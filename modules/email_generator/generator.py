import os
import json
import time
import re
import logging
from pathlib import Path
from typing import Union, Optional, List, Dict, Any
from datetime import datetime, timezone

from config.settings import (
    DATA_DIR,
    WEBSITES_DATA_DIR,
    GENERATED_DIR,
    NORMALIZED_DATA_DIR,
    GEMINI_MODEL,
    DEFAULT_AI_PROVIDER,
)
from contracts.business import Business
from contracts.intelligence import WebsiteIntelligence
from contracts.email import OutreachEmail, OutreachEmailDraft, EmailGenerationRequest
from modules.website_intelligence.providers import (
    AIProvider,
    GeminiProvider,
    MockProvider,
    get_provider,
)
from .prompts import build_email_prompt, SYSTEM_INSTRUCTION, PROMPT_VERSION

logger = logging.getLogger(__name__)


class EmailGenerator:
    """
    Personalized Outreach Email Generator for Nayom-Automation.
    
    Generates human, concise, grounded cold outreach emails using business
    intelligence facts and live deployed website preview URLs.
    """

    def __init__(
        self,
        provider: Optional[AIProvider] = None,
        provider_name: Optional[str] = None,
        model_name: Optional[str] = None,
    ):
        if provider is not None:
            self._provider = provider
        else:
            p_name = provider_name or DEFAULT_AI_PROVIDER
            m_name = model_name or GEMINI_MODEL
            self._provider = get_provider(provider_name=p_name, model_name=m_name)

    @property
    def provider(self) -> AIProvider:
        return self._provider

    def _resolve_business_id(
        self,
        target: Optional[Union[str, Path]],
        intelligence: Optional[WebsiteIntelligence],
        business: Optional[Business],
    ) -> str:
        """Determines the canonical business_id slug from inputs."""
        if intelligence and intelligence.site_id:
            return intelligence.site_id
        if business and business.id:
            return business.id
        if target:
            p = Path(target)
            if p.is_dir() or p.is_file():
                # E.g. generated/aryansharmaswe_vercel_app or data/websites/eliaontheriver_com
                parts = p.parts
                for part in reversed(parts):
                    if part not in ("website_intelligence.json", "email.json", "deployment.json", "site-data.json", "generated", "websites", "data"):
                        return part
            return str(target).strip().replace("/", "_").replace("\\", "_")
        return "unknown_business"

    def _load_intelligence(
        self,
        source: Optional[Union[str, Path, Dict[str, Any], WebsiteIntelligence]],
        business_id: Optional[str] = None,
    ) -> tuple[WebsiteIntelligence, Optional[str]]:
        """Loads WebsiteIntelligence from instance, dict, or file path."""
        if isinstance(source, WebsiteIntelligence):
            return source, None

        if isinstance(source, dict):
            return WebsiteIntelligence.model_validate(source), None

        candidate_paths = []
        if source:
            p = Path(source)
            if p.is_file():
                candidate_paths.append(p)
            elif p.is_dir():
                candidate_paths.append(p / "website_intelligence.json")
                candidate_paths.append(p / "site-data.json")

        if business_id:
            candidate_paths.append(WEBSITES_DATA_DIR / business_id / "website_intelligence.json")
            candidate_paths.append(GENERATED_DIR / business_id / "site-data.json")

        for cp in candidate_paths:
            if cp.exists() and cp.is_file():
                with open(cp, "r", encoding="utf-8") as f:
                    data = json.load(f)
                try:
                    return WebsiteIntelligence.model_validate(data), str(cp.resolve())
                except Exception as e:
                    logger.debug("Failed to validate %s as WebsiteIntelligence: %s", cp, e)

        raise FileNotFoundError(
            f"Could not find valid website_intelligence.json for source='{source}', business_id='{business_id}'"
        )

    def _load_business(
        self,
        source: Optional[Union[str, Path, Dict[str, Any], Business]],
        business_id: Optional[str] = None,
        intelligence: Optional[WebsiteIntelligence] = None,
    ) -> Optional[Business]:
        """Loads Business record from instance, dict, file, or normalized directory search."""
        if isinstance(source, Business):
            return source
        if isinstance(source, dict):
            try:
                return Business.model_validate(source)
            except Exception:
                pass

        if source and Path(source).is_file():
            try:
                with open(source, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, dict):
                    if "businesses" in data and isinstance(data["businesses"], list):
                        for b in data["businesses"]:
                            b_obj = Business.model_validate(b)
                            if business_id and (b_obj.id == business_id or business_id in b_obj.name.lower()):
                                return b_obj
                        if data["businesses"]:
                            return Business.model_validate(data["businesses"][0])
                    else:
                        return Business.model_validate(data)
            except Exception as e:
                logger.debug("Error loading business from %s: %s", source, e)

        # Search normalized datasets if business_id or intelligence domain is known
        if business_id or (intelligence and intelligence.domain):
            search_domain = intelligence.domain.lower() if intelligence and intelligence.domain else None
            for norm_file in sorted(NORMALIZED_DATA_DIR.glob("*.json"), reverse=True):
                try:
                    with open(norm_file, "r", encoding="utf-8") as f:
                        norm_data = json.load(f)
                    for b in norm_data.get("businesses", []):
                        if business_id and b.get("id") == business_id:
                            return Business.model_validate(b)
                        if search_domain and b.get("website") and search_domain in b.get("website", "").lower():
                            return Business.model_validate(b)
                except Exception:
                    continue

        # Fallback: synthesize minimal Business from WebsiteIntelligence
        if intelligence:
            bp = intelligence.business_profile
            ci = intelligence.contact_intelligence
            return Business(
                id=business_id or intelligence.site_id,
                name=bp.business_name or intelligence.site_id.replace("_", " ").title(),
                category=bp.industry_category,
                website=intelligence.base_url,
                email=ci.emails[0] if ci.emails else None,
                phone=ci.phones[0] if ci.phones else None,
                city=ci.city,
                state=ci.state_or_region,
                country=ci.country,
            )

        return None

    def _discover_preview_url(
        self,
        preview_url: Optional[str] = None,
        business_id: Optional[str] = None,
        target_path: Optional[Union[str, Path]] = None,
    ) -> tuple[str, List[str]]:
        """Discovers the live preview URL from deployment.json or explicit argument."""
        warnings = []
        if preview_url and preview_url.strip():
            return preview_url.strip(), warnings

        candidate_paths = []
        if target_path:
            tp = Path(target_path)
            if tp.is_file() and tp.name == "deployment.json":
                candidate_paths.append(tp)
            elif tp.is_dir():
                candidate_paths.append(tp / "deployment.json")

        if business_id:
            candidate_paths.append(GENERATED_DIR / business_id / "deployment.json")

        for cp in candidate_paths:
            if cp.exists() and cp.is_file():
                try:
                    with open(cp, "r", encoding="utf-8") as f:
                        deploy_data = json.load(f)
                    if deploy_data.get("url"):
                        logger.info("Discovered preview URL '%s' from %s", deploy_data["url"], cp)
                        return deploy_data["url"], warnings
                except Exception as e:
                    logger.debug("Failed to read deployment.json at %s: %s", cp, e)

        # Fallback placeholder preview URL if no deployment record exists
        fallback = f"https://nayom-preview.pages.dev/{business_id or 'demo'}"
        msg = f"No deployment.json found. Using preview URL fallback: {fallback}"
        logger.warning(msg)
        warnings.append(msg)
        return fallback, warnings

    def _resolve_recipient_email(
        self,
        recipient_override: Optional[str] = None,
        business: Optional[Business] = None,
        intelligence: Optional[WebsiteIntelligence] = None,
        dry_run: bool = False,
    ) -> Optional[str]:
        """Resolves target recipient email address or None."""
        if recipient_override and recipient_override.strip():
            email = recipient_override.strip()
            if "@" in email:
                return email

        if business and business.email and business.email.strip() and "@" in business.email:
            return business.email.strip()

        if intelligence and intelligence.contact_intelligence and intelligence.contact_intelligence.emails:
            for em in intelligence.contact_intelligence.emails:
                if em and "@" in em and not any(skip in em.lower() for skip in ("example.com", "domain.com", "wixpress", "sentry")):
                    return em.strip()
            if intelligence.contact_intelligence.emails[0]:
                return intelligence.contact_intelligence.emails[0].strip()

        if dry_run:
            domain = (intelligence.domain if intelligence and intelligence.domain else "business.com").replace("www.", "").strip()
            return f"contact@{domain}"

        return None

    def _generate_draft_with_provider(
        self,
        prompt: str,
        intelligence: WebsiteIntelligence,
        preview_url: str,
        business: Optional[Business],
    ) -> OutreachEmailDraft:
        """Invokes the AI provider to draft the email."""
        # Handle MockProvider gracefully
        if self._provider.provider_name == "mock" or isinstance(self._provider, MockProvider):
            if hasattr(self._provider, "_custom_response") and self._provider._custom_response:
                if isinstance(self._provider._custom_response, OutreachEmailDraft):
                    return self._provider._custom_response

            biz_name = (
                (business.name if business and business.name else None)
                or (intelligence.business_profile.business_name if intelligence.business_profile else None)
                or intelligence.site_id.replace("_", " ").title()
            )
            salutation = biz_name
            improvements = []
            if intelligence.redesign_recommendations and intelligence.redesign_recommendations.quick_wins:
                improvements = intelligence.redesign_recommendations.quick_wins[:3]
            else:
                improvements = [
                    "Mobile-responsive navigation & layout hierarchy",
                    "Direct online reservation / inquiry flow",
                    "High-contrast modern typography and fast asset loading",
                ]

            return OutreachEmailDraft(
                subject=f"Quick idea for {biz_name}'s website (+ a modern live preview)",
                body=(
                    f"Hi {salutation},\n\n"
                    f"I was recently checking out {biz_name} and really liked what you've built. "
                    f"While reviewing your current website, I noticed a few quick opportunities to improve "
                    f"mobile responsiveness and make your online inquiry flow significantly smoother.\n\n"
                    f"To show you what a modern, high-performance experience could look like, "
                    f"I went ahead and put together a working live prototype:\n\n"
                    f"{preview_url}\n\n"
                    f"Feel free to take a look whenever you have a moment. If you'd like the project files "
                    f"or want me to make any tweaks, I'd be happy to send them over. "
                    f"No worries at all if you're completely happy with your current setup!\n\n"
                    f"Best regards,\nWeb Development Team"
                ),
                key_improvements=improvements,
                salutation_name=salutation,
            )

        # Call real AI Provider (Gemini)
        logger.info("Calling AI Provider '%s' (%s) for email generation", self._provider.provider_name, self._provider.model_name)
        draft = self._provider.generate_structured(
            prompt=prompt,
            system_instruction=SYSTEM_INSTRUCTION,
            response_schema=OutreachEmailDraft,
        )
        return draft

    def _ensure_preview_url_in_body(self, body: str, preview_url: str) -> str:
        """Ensures the exact preview URL is clearly present in the email body."""
        if preview_url in body:
            return body

        # If model forgot or paraphrased the URL, inject it cleanly before the signoff
        paragraphs = body.split("\n\n")
        if len(paragraphs) > 1:
            # Insert before last paragraph
            paragraphs.insert(-1, f"Here is the live prototype link:\n{preview_url}")
            return "\n\n".join(paragraphs)
        return f"{body}\n\nLive Preview: {preview_url}"

    def generate(
        self,
        target: Optional[Union[str, Path]] = None,
        intelligence: Optional[Union[str, Path, Dict[str, Any], WebsiteIntelligence]] = None,
        business: Optional[Union[str, Path, Dict[str, Any], Business]] = None,
        preview_url: Optional[str] = None,
        recipient: Optional[str] = None,
        output_path: Optional[Union[str, Path]] = None,
        dry_run: bool = False,
    ) -> OutreachEmail:
        """
        Executes deterministic end-to-end outreach email generation.
        
        Args:
            target: Target site ID, project dir, or file path.
            intelligence: WebsiteIntelligence instance or path to website_intelligence.json.
            business: Business contract instance, dict, or path.
            preview_url: Deployed live website URL (discovered if omitted).
            recipient: Explicit recipient email override.
            output_path: Destination path for email.json.
            dry_run: If True, allows simulated recipient address if no public email exists.
            
        Returns:
            Validated OutreachEmail contract.
        """
        start_time = time.time()
        warnings = []

        # 1. Determine Business ID
        intel_obj = None
        if isinstance(intelligence, WebsiteIntelligence):
            intel_obj = intelligence
        biz_obj = None
        if isinstance(business, Business):
            biz_obj = business

        business_id = self._resolve_business_id(target, intel_obj, biz_obj)

        # 2. Resolve WebsiteIntelligence
        intel_source = intelligence or target or business_id
        intel, intel_path = self._load_intelligence(intel_source, business_id=business_id)

        # 3. Resolve Business
        biz = self._load_business(business, business_id=business_id, intelligence=intel)

        # 4. Resolve Live Preview URL
        resolved_preview_url, preview_warnings = self._discover_preview_url(
            preview_url=preview_url,
            business_id=business_id,
            target_path=target,
        )
        warnings.extend(preview_warnings)

        # 5. Resolve Recipient Email Address (or None)
        resolved_recipient = self._resolve_recipient_email(
            recipient_override=recipient,
            business=biz,
            intelligence=intel,
            dry_run=dry_run,
        )

        # 6. Build Prompt
        prompt = build_email_prompt(
            intelligence=intel,
            preview_url=resolved_preview_url,
            business=biz,
            recipient_email=resolved_recipient,
        )

        # 7. Generate Email Draft with AI Provider
        draft = self._generate_draft_with_provider(
            prompt=prompt,
            intelligence=intel,
            preview_url=resolved_preview_url,
            business=biz,
        )

        # 8. Deterministically assemble and enforce final OutreachEmail contract
        final_body = self._ensure_preview_url_in_body(draft.body.strip(), resolved_preview_url)
        biz_name = (
            (biz.name if biz and biz.name else None)
            or (intel.business_profile.business_name if intel.business_profile else None)
            or business_id.replace("_", " ").title()
        )

        email_contract = OutreachEmail(
            recipient=resolved_recipient,
            subject=draft.subject.strip(),
            body=final_body,
            business_id=business_id,
            preview_url=resolved_preview_url,
            generated_at=datetime.now(timezone.utc).isoformat(),
            model=self._provider.model_name,
            business_name=biz_name,
            key_improvements=draft.key_improvements,
            provider=self._provider.provider_name,
            prompt_version=PROMPT_VERSION,
            warnings=warnings,
        )

        # 9. Save email.json
        self._save_email_json(email_contract, output_path=output_path, business_id=business_id)

        duration = time.time() - start_time
        logger.info(
            "Successfully generated outreach email for '%s' in %.2fs (recipient: %s)",
            business_id,
            duration,
            resolved_recipient or "None",
        )

        return email_contract

    def _save_email_json(
        self,
        email: OutreachEmail,
        output_path: Optional[Union[str, Path]] = None,
        business_id: Optional[str] = None,
    ) -> List[Path]:
        """Saves validated email.json to disk."""
        saved_paths = []

        if output_path:
            p = Path(output_path)
            if p.is_dir():
                p = p / "email.json"
            p.parent.mkdir(parents=True, exist_ok=True)
            temp_p = p.with_suffix(".tmp")
            with open(temp_p, "w", encoding="utf-8") as f:
                f.write(email.model_dump_json(indent=2))
            temp_p.replace(p)
            saved_paths.append(p)
            return saved_paths

        # Default paths: generated/<business_id>/email.json and data/websites/<business_id>/email.json
        if business_id:
            gen_dir = GENERATED_DIR / business_id
            gen_dir.mkdir(parents=True, exist_ok=True)
            p_gen = gen_dir / "email.json"
            temp_gen = gen_dir / "email.json.tmp"
            with open(temp_gen, "w", encoding="utf-8") as f:
                f.write(email.model_dump_json(indent=2))
            temp_gen.replace(p_gen)
            saved_paths.append(p_gen)

            # Also save to data/websites/<business_id>/email.json if website dir exists
            web_dir = WEBSITES_DATA_DIR / business_id
            if web_dir.exists() and web_dir.is_dir():
                p_web = web_dir / "email.json"
                temp_web = web_dir / "email.json.tmp"
                with open(temp_web, "w", encoding="utf-8") as f:
                    f.write(email.model_dump_json(indent=2))
                temp_web.replace(p_web)
                saved_paths.append(p_web)

        return saved_paths


