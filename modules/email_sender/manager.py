import os
import time
import json
import logging
import threading
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Union, Tuple, Any

from config.settings import (
    DATA_DIR,
    GENERATED_DIR,
    EMAIL_STATE_FILE,
    EMAIL_SUPPRESSION_FILE,
    DEFAULT_EMAIL_DELAY_SECONDS,
)
from contracts.email import (
    OutreachEmail,
    EmailDeliveryRequest,
    EmailDeliveryResult,
    SenderProviderStatus,
)
from .base import EmailSenderProvider, is_valid_email
from .suppression import SuppressionList
from .providers.smtp import SmtpEmailProvider
from .providers.resend import ResendEmailProvider
from .providers.sendgrid import SendGridEmailProvider
from .providers.gmail import GmailSmtpEmailProvider
from .providers.outlook import OutlookSmtpEmailProvider
from .providers.mock import MockEmailSenderProvider

logger = logging.getLogger(__name__)

DEFAULT_ROTATION_ORDER = [
    "resend",
    "sendgrid",
    "gmail",
    "outlook",
    "smtp",
]


class EmailSenderManager:
    """
    Manages multi-provider email dispatching with round-robin rotation,
    quota tracking, automatic fallback, suppression enforcement, and state persistence.
    """

    def __init__(
        self,
        state_file: Optional[Path] = None,
        suppression_file: Optional[Path] = None,
        providers: Optional[Dict[str, EmailSenderProvider]] = None,
        rotation_order: Optional[List[str]] = None,
    ):
        self._state_file = Path(state_file) if state_file else EMAIL_STATE_FILE
        self._suppression = SuppressionList(suppression_file or EMAIL_SUPPRESSION_FILE)
        self._providers: Dict[str, EmailSenderProvider] = providers or self._init_default_providers()
        self._rotation_order = rotation_order or list(DEFAULT_ROTATION_ORDER)
        self._lock = threading.Lock()

    def _init_default_providers(self) -> Dict[str, EmailSenderProvider]:
        """Initializes default email provider instances."""
        return {
            "resend": ResendEmailProvider(),
            "sendgrid": SendGridEmailProvider(),
            "gmail": GmailSmtpEmailProvider(),
            "outlook": OutlookSmtpEmailProvider(),
            "smtp": SmtpEmailProvider(),
            "mock": MockEmailSenderProvider(),
        }

    def register_provider(self, name: str, provider: EmailSenderProvider):
        """Registers a custom or mock provider instance."""
        self._providers[name.lower()] = provider

    def get_provider(self, name: str) -> Optional[EmailSenderProvider]:
        """Retrieves a provider by identifier."""
        return self._providers.get(name.lower())

    @property
    def suppression_list(self) -> SuppressionList:
        """Access the underlying suppression manager."""
        return self._suppression

    def get_provider_statuses(self) -> List[SenderProviderStatus]:
        """Returns availability and quota statuses for all registered providers."""
        state = self._load_state()
        usage = state.get("provider_daily_usage", {})
        today_str = self._get_today_utc_date()

        statuses = []
        for name, prov in self._providers.items():
            st = prov.is_available()
            prov_usage = usage.get(name, {})
            # Check if usage is from today
            sent_today = prov_usage.get("sent_today", 0) if prov_usage.get("last_reset_date") == today_str else 0
            st.sent_today = sent_today
            st.daily_limit = prov.default_daily_limit
            st.is_exhausted = (st.daily_limit > 0 and sent_today >= st.daily_limit)
            statuses.append(st)
        return statuses

    def _get_today_utc_date(self) -> str:
        """Returns the current UTC date string YYYY-MM-DD."""
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")

    def _load_state_unlocked(self) -> Dict[str, Any]:
        """Loads persistent rotation and usage state from disk without lock."""
        today_str = self._get_today_utc_date()
        state: Dict[str, Any] = {
            "current_index": 0,
            "last_used_provider": None,
            "last_sent_at": None,
            "total_sent_count": 0,
            "today_date": today_str,
            "provider_daily_usage": {},
        }

        if self._state_file.exists():
            try:
                with open(self._state_file, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict):
                        state.update(loaded)
            except Exception as e:
                logger.warning("Could not read email sending state file %s: %s", self._state_file, e)

        # Check for date change to reset daily quotas
        if state.get("today_date") != today_str:
            logger.info("New day detected (%s -> %s). Resetting daily email sending counters.", state.get("today_date"), today_str)
            state["today_date"] = today_str
            for p_name in state.get("provider_daily_usage", {}):
                state["provider_daily_usage"][p_name]["sent_today"] = 0
                state["provider_daily_usage"][p_name]["last_reset_date"] = today_str

        return state

    def _save_state_unlocked(self, state: Dict[str, Any]):
        """Persists rotation state to disk without lock."""
        try:
            self._state_file.parent.mkdir(parents=True, exist_ok=True)
            temp_file = self._state_file.with_suffix(".tmp")
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(state, f, indent=2)
            temp_file.replace(self._state_file)
        except Exception as e:
            logger.error("Could not write email sending state %s: %s", self._state_file, e)

    def _load_state(self) -> Dict[str, Any]:
        """Loads persistent rotation and usage state from disk with thread-safety."""
        with self._lock:
            return self._load_state_unlocked()

    def _save_state(self, state: Dict[str, Any]):
        """Persists rotation state to disk with atomic write and thread-safety."""
        with self._lock:
            self._save_state_unlocked(state)

    def _increment_provider_usage(self, provider_name: str, index: int = 0, state: Optional[Dict[str, Any]] = None):
        """Updates provider daily sent count, rotation index, and timestamp atomically."""
        today_str = self._get_today_utc_date()
        with self._lock:
            st = self._load_state_unlocked()
            usage = st.setdefault("provider_daily_usage", {})
            prov_stat = usage.setdefault(provider_name, {"sent_today": 0, "last_reset_date": today_str})

            if prov_stat.get("last_reset_date") != today_str:
                prov_stat["sent_today"] = 0
                prov_stat["last_reset_date"] = today_str

            prov_stat["sent_today"] += 1
            st["total_sent_count"] = st.get("total_sent_count", 0) + 1
            st["last_used_provider"] = provider_name
            st["last_sent_at"] = datetime.now(timezone.utc).isoformat()
            
            # Advance round-robin index
            if self._rotation_order:
                st["current_index"] = (index + 1) % len(self._rotation_order)

            self._save_state_unlocked(st)


    def _resolve_request(self, target: Union[str, Path, EmailDeliveryRequest, OutreachEmail]) -> Tuple[EmailDeliveryRequest, Path]:
        """Resolves target input into a standardized EmailDeliveryRequest and target business directory."""
        if isinstance(target, EmailDeliveryRequest):
            biz_dir = GENERATED_DIR / target.business_id
            return target, biz_dir

        if isinstance(target, OutreachEmail):
            biz_dir = GENERATED_DIR / target.business_id
            req = EmailDeliveryRequest(
                business_id=target.business_id,
                recipient=target.recipient,
                subject=target.subject,
                body=target.body,
                preview_url=target.preview_url,
                business_name=target.business_name,
            )
            return req, biz_dir

        p = Path(target)
        if p.is_file() and p.name == "email.json":
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
            email_contract = OutreachEmail(**data)
            req = EmailDeliveryRequest(
                business_id=email_contract.business_id,
                recipient=email_contract.recipient,
                subject=email_contract.subject,
                body=email_contract.body,
                preview_url=email_contract.preview_url,
                business_name=email_contract.business_name,
            )
            return req, p.parent.resolve()

        if p.is_dir() and (p / "email.json").exists():
            return self._resolve_request(p / "email.json")

        # Try inside GENERATED_DIR
        candidate = GENERATED_DIR / str(target)
        if candidate.exists() and (candidate / "email.json").exists():
            return self._resolve_request(candidate / "email.json")

        raise FileNotFoundError(f"Could not find valid email.json for target: '{target}'")


    def send(
        self,
        target: Union[str, Path, EmailDeliveryRequest, OutreachEmail],
        provider_override: Optional[str] = None,
        dry_run: bool = False,
        force: bool = False,
    ) -> EmailDeliveryResult:
        """
        Dispatches an email for a target business using rotation, safety checks, and fallback.
        
        Args:
            target: Path to email.json, business directory, business ID, or EmailDeliveryRequest.
            provider_override: Optional explicit provider identifier.
            dry_run: If True, simulates transmission without sending live emails.
            force: If True, ignores suppression list and overrides safety checks.
            
        Returns:
            EmailDeliveryResult contract.
        """
        start_time = time.time()
        request, biz_dir = self._resolve_request(target)
        if dry_run:
            request.dry_run = True

        # Safety Check 1: Missing or invalid recipient
        if not request.recipient or not is_valid_email(request.recipient):
            logger.warning("Target business '%s' has missing or invalid recipient email: %s. Skipping send.", request.business_id, request.recipient)
            res = EmailDeliveryResult(
                business_id=request.business_id,
                recipient=request.recipient,
                provider=provider_override or "none",
                status="skipped",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=round(time.time() - start_time, 3),
                warnings=["Recipient email address is missing, null, or invalid"],
            )
            self._save_delivery_json(biz_dir, res)
            return res

        # Safety Check 2: Suppression / Unsubscribe check
        if not force and self._suppression.is_suppressed(request.recipient):
            logger.warning("Recipient %s is on suppression/unsubscribe list. Skipping send.", request.recipient)
            supp_info = self._suppression.get_info(request.recipient)
            reason = supp_info.get("reason", "unsubscribed") if supp_info else "unsubscribed"
            res = EmailDeliveryResult(
                business_id=request.business_id,
                recipient=request.recipient,
                provider=provider_override or "none",
                status="skipped",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=round(time.time() - start_time, 3),
                warnings=[f"Recipient email is on suppression list (reason: {reason})"],
            )
            self._save_delivery_json(biz_dir, res)
            return res

        # Check explicit provider override or EMAIL_PROVIDER env
        chosen_provider = provider_override or request.provider or os.environ.get("EMAIL_PROVIDER")

        if chosen_provider:
            provider_inst = self.get_provider(chosen_provider)
            if not provider_inst:
                raise ValueError(f"Unknown email provider: '{chosen_provider}'")

            logger.info("Sending email for '%s' using explicitly requested provider: '%s'", request.business_id, chosen_provider)
            res = provider_inst.send(request)
            if res.status in ("sent", "dry_run"):
                self._increment_provider_usage(chosen_provider, 0)
            self._save_delivery_json(biz_dir, res)
            return res

        # -------------------------------------------------------------
        # Round-Robin Rotation with Quota Tracking & Automatic Fallback
        # -------------------------------------------------------------
        state = self._load_state()
        rotation_list = [p for p in self._rotation_order if p in self._providers]
        if not rotation_list:
            rotation_list = ["mock"]

        total_providers = len(rotation_list)
        current_idx = state.get("current_index", 0) % total_providers
        today_str = self._get_today_utc_date()
        usage = state.setdefault("provider_daily_usage", {})

        warnings: List[str] = []
        successful_result: Optional[EmailDeliveryResult] = None
        attempts = 0

        for offset in range(total_providers):
            idx = (current_idx + offset) % total_providers
            provider_name = rotation_list[idx]
            provider_inst = self.get_provider(provider_name)
            if not provider_inst:
                continue

            attempts += 1
            status = provider_inst.is_available()

            # Check configuration
            if not status.is_configured:
                logger.debug(
                    "Provider '%s' is not configured (%s), skipping to next...",
                    provider_name,
                    ", ".join(status.missing_credentials),
                )
                warnings.append(f"Skipped unconfigured provider '{provider_name}'")
                continue

            # Check daily quota limit
            prov_usage = usage.get(provider_name, {})
            sent_today = prov_usage.get("sent_today", 0) if prov_usage.get("last_reset_date") == today_str else 0
            daily_limit = provider_inst.default_daily_limit

            if daily_limit > 0 and sent_today >= daily_limit:
                logger.warning(
                    "Provider '%s' has reached daily quota (%d/%d sent today), skipping to next...",
                    provider_name,
                    sent_today,
                    daily_limit,
                )
                warnings.append(f"Provider '{provider_name}' daily quota exhausted ({sent_today}/{daily_limit})")
                continue

            logger.info("Round-robin selected provider: '%s' (%d/%d used today). Attempting send...", provider_name, sent_today, daily_limit)
            try:
                res = provider_inst.send(request)
                if res.status in ("sent", "dry_run"):
                    logger.info("Email dispatch succeeded on provider '%s' (Status: %s, Message ID: %s)", provider_name, res.status, res.message_id)
                    res.warnings.extend(warnings)
                    res.attempts = attempts
                    successful_result = res
                    self._increment_provider_usage(provider_name, idx)
                    break
                else:
                    logger.warning("Provider '%s' failed: %s. Trying next provider in rotation...", provider_name, res.error)
                    warnings.append(f"Provider '{provider_name}' failed: {res.error}")
            except Exception as ex:
                logger.warning("Provider '%s' threw unexpected exception: %s. Trying next provider...", provider_name, ex)
                warnings.append(f"Provider '{provider_name}' error: {ex}")

        # Fallback to Mock provider ONLY if explicitly permitted or requested
        if not successful_result:
            allow_mock = (
                request.provider == "mock"
                or getattr(request, "allow_mock_fallback", False)
                or (request.dry_run and "mock" in self._rotation_order)
            )
            if allow_mock:
                mock_inst = self.get_provider("mock")
                if mock_inst:
                    logger.info("All configured cloud providers failed or unconfigured; falling back to Mock Provider (explicitly permitted).")
                    successful_result = mock_inst.send(request)
                    successful_result.warnings.extend(warnings)
                    successful_result.attempts = attempts
                    if successful_result.status in ("sent", "dry_run"):
                        self._increment_provider_usage("mock", 0)
            else:
                err_summary = "; ".join(warnings) if warnings else "All email providers failed or were unconfigured/exhausted."
                logger.error("Email dispatch failed across all providers: %s (silent mock fallback disabled)", err_summary)


        if not successful_result:

            successful_result = EmailDeliveryResult(
                business_id=request.business_id,
                recipient=request.recipient,
                provider="none",
                status="failed",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=round(time.time() - start_time, 3),
                warnings=warnings,
                error="All email providers failed or were unconfigured/exhausted.",
                attempts=attempts,
            )

        self._save_delivery_json(biz_dir, successful_result)
        return successful_result

    def _save_delivery_json(self, biz_dir: Path, result: EmailDeliveryResult):
        """Persists email_delivery.json to the business directory with atomic write."""
        dest = biz_dir / "email_delivery.json"
        temp_file = biz_dir / "email_delivery.json.tmp"
        try:
            biz_dir.mkdir(parents=True, exist_ok=True)
            with open(temp_file, "w", encoding="utf-8") as f:
                f.write(result.model_dump_json(indent=2))
            temp_file.replace(dest)
            logger.info("Saved delivery record to %s", dest)
        except Exception as e:
            logger.error("Could not write email_delivery.json to %s: %s", biz_dir, e)


    def send_all(
        self,
        provider_override: Optional[str] = None,
        dry_run: bool = False,
        force: bool = False,
        delay_seconds: Optional[float] = None,
    ) -> List[EmailDeliveryResult]:
        """
        Dispatches generated emails across all businesses in generated/ directory.
        
        Args:
            provider_override: Optional manual provider override.
            dry_run: Simulate sending without real network transmission.
            force: Re-send even if already sent or suppressed.
            delay_seconds: Time to sleep between sending emails to respect rate limits.
            
        Returns:
            List of EmailDeliveryResult contracts.
        """
        results: List[EmailDeliveryResult] = []
        delay = delay_seconds if delay_seconds is not None else DEFAULT_EMAIL_DELAY_SECONDS

        if not GENERATED_DIR.exists():
            logger.warning("Generated directory %s does not exist.", GENERATED_DIR)
            return results

        email_files = sorted(GENERATED_DIR.glob("*/email.json"))
        logger.info("Discovered %d business email(s) in %s", len(email_files), GENERATED_DIR)

        for i, email_file in enumerate(email_files):
            biz_dir = email_file.parent
            deliv_file = biz_dir / "email_delivery.json"

            # If already sent successfully and not forcing, skip
            if deliv_file.exists() and not force:
                try:
                    with open(deliv_file, "r", encoding="utf-8") as f:
                        prev = json.load(f)
                    if prev.get("status") == "sent":
                        logger.info("Skipping '%s' — already sent on %s", biz_dir.name, prev.get("sent_at"))
                        results.append(EmailDeliveryResult(**prev))
                        continue
                except Exception:
                    pass

            logger.info("[%d/%d] Processing email for business: %s", i + 1, len(email_files), biz_dir.name)
            res = self.send(
                target=email_file,
                provider_override=provider_override,
                dry_run=dry_run,
                force=force,
            )
            results.append(res)

            # Apply delay between emails to respect rate limits
            if delay > 0 and i < len(email_files) - 1:
                logger.debug("Pausing for %s seconds to respect rate limits...", delay)
                time.sleep(delay)

        return results
