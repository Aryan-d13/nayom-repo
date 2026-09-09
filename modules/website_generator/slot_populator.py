import re
import logging
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime, timezone

from contracts.site_data import (
    CanonicalSiteData,
    CanonicalBusinessIdentity,
    CanonicalContact,
    CanonicalEditorial,
    CanonicalCTA,
    CanonicalOffering,
    CanonicalSocialProof,
    CanonicalTestimonial,
    CanonicalSEO,
    CanonicalAsset,
)
from contracts.intelligence import WebsiteIntelligence
from contracts.business import Business
from contracts.website import WebsiteCollectionResult
from contracts.generator import TemplateMetadata

logger = logging.getLogger(__name__)


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    return re.sub(r"[\s_-]+", "-", s).strip("-")


def extract_raw_phone(phone: Optional[str]) -> Optional[str]:
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    return digits if digits else None


class CanonicalSiteDataBuilder:
    """
    Constructs an authoritative CanonicalSiteData contract from:
    - Business model (Google Maps / input)
    - WebsiteIntelligence (multimodal AI analysis)
    - WebsiteCollectionResult (raw scraped website content)
    
    Principles:
    1. Nayom owns WHAT the business is.
    2. Zero fake testimonials.
    3. Zero synthetic FAQs presented as real.
    4. Zero invented contact information.
    5. Clean, strict fallback to None / empty lists for unknown facts.
    """

    def build(
        self,
        intelligence: WebsiteIntelligence,
        business: Optional[Business] = None,
        website_raw: Optional[WebsiteCollectionResult] = None,
    ) -> CanonicalSiteData:
        bp = intelligence.business_profile
        ci = intelligence.contact_intelligence
        bc = intelligence.brand_and_content
        ts = intelligence.technical_and_seo

        # 1. Identity
        biz_name = (
            (business.name if business else None)
            or bp.business_name
            or intelligence.site_id.replace("_", " ").replace("-", " ").title()
        )
        tagline = bp.tagline if bp.tagline else None
        category = (
            (business.category if business else None)
            or bp.industry_category
            or None
        )
        description = bp.description if bp.description else None

        identity = CanonicalBusinessIdentity(
            name=biz_name,
            short_name=None,
            tagline=tagline,
            category=category,
            description=description,
        )

        # 2. Contact & Operations
        phone = (business.phone if business and business.phone else None) or (ci.phones[0] if ci.phones else None)
        raw_phone = extract_raw_phone(phone)
        email = (business.email if business and business.email else None) or (ci.emails[0] if ci.emails else None)
        address = (business.address if business and business.address else None) or (ci.addresses[0] if ci.addresses else None)
        city = (business.city if business and business.city else None) or ci.city
        state = (business.state if business and business.state else None) or ci.state_or_region
        postal_code = (business.postal_code if business and business.postal_code else None)
        country = (business.country if business and business.country else None) or ci.country or "US"
        hours = ci.business_hours if ci.business_hours else None

        social_dict: Dict[str, str] = {}
        for s in ci.social_links:
            if s.platform and s.url:
                social_dict[s.platform.lower()] = s.url

        service_areas: List[str] = []
        if city:
            service_areas.append(city)

        contact = CanonicalContact(
            phone=phone,
            raw_phone=raw_phone,
            email=email,
            address=address,
            city=city,
            state=state,
            postal_code=postal_code,
            country=country,
            hours=hours,
            social_links=social_dict,
            service_areas=service_areas,
        )

        # 3. Editorial & CTAs
        headline = bc.hero_headlines[0] if bc.hero_headlines else f"Welcome to {biz_name}"
        subheadline = bp.value_proposition or bp.description or None
        value_prop = bp.value_proposition or None
        differentiators = list(bp.key_differentiators) if bp.key_differentiators else []

        primary_cta = None
        secondary_cta = None
        if intelligence.calls_to_action:
            first_cta = intelligence.calls_to_action[0]
            primary_cta = CanonicalCTA(
                text=first_cta.text,
                link=first_cta.destination or "#contact",
                phone_action="call" in first_cta.text.lower() or "phone" in first_cta.text.lower(),
            )
            if len(intelligence.calls_to_action) > 1:
                sec_cta = intelligence.calls_to_action[1]
                secondary_cta = CanonicalCTA(
                    text=sec_cta.text,
                    link=sec_cta.destination or "#services",
                    phone_action="call" in sec_cta.text.lower(),
                )
        else:
            primary_cta = CanonicalCTA(
                text="Get A Quote",
                link="#contact",
                phone_action=False,
            )

        editorial = CanonicalEditorial(
            headline=headline,
            subheadline=subheadline,
            value_proposition=value_prop,
            differentiators=differentiators,
            primary_cta=primary_cta,
            secondary_cta=secondary_cta,
        )

        # 4. Offerings
        offerings: List[CanonicalOffering] = []
        for i, s in enumerate(intelligence.services_and_products):
            s_name = s.name.strip()
            if not s_name:
                continue
            s_id = slugify(s_name) or f"offering-{i+1}"
            offerings.append(
                CanonicalOffering(
                    id=s_id,
                    name=s_name,
                    category=s.category or None,
                    summary=s.description or None,
                    features=s.features if s.features else [],
                    pricing=s.pricing_hint if s.pricing_hint else None,
                )
            )

        # 5. Social Proof
        rating = business.rating if business and business.rating is not None else None
        review_count = business.review_count if business and business.review_count is not None else None
        testimonials: List[CanonicalTestimonial] = []

        # Zero fake business claims: Never invent testimonials or turn marketing slogans into fake reviews!
        # Only populate if genuine structured reviews exist on the business entity
        if business and hasattr(business, "reviews") and business.reviews:
            for rev in business.reviews:
                if isinstance(rev, dict):
                    q = rev.get("text") or rev.get("quote", "")
                    if q:
                        testimonials.append(
                            CanonicalTestimonial(
                                quote=q,
                                author=rev.get("author_name") or rev.get("author"),
                                rating=rev.get("rating"),
                                source=rev.get("source", "Google Review"),
                            )
                        )
                elif hasattr(rev, "quote") and rev.quote:
                    testimonials.append(
                        CanonicalTestimonial(
                            quote=rev.quote,
                            author=getattr(rev, "author", None),
                            rating=getattr(rev, "rating", None),
                            source=getattr(rev, "source", "Google Review"),
                        )
                    )

        social_proof = CanonicalSocialProof(
            rating=rating,
            review_count=review_count,
            testimonials=testimonials,
        )

        # 6. SEO
        seo_title = f"{biz_name} | {city + ' ' if city else ''}{category or 'Services'}"
        seo_desc = (subheadline or description or f"Welcome to {biz_name}")[:160]
        keywords = [biz_name]
        if category:
            keywords.append(category)
        if city:
            keywords.append(city)
            if category:
                keywords.append(f"{category} in {city}")

        json_ld = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness" if (address or city) else "Organization",
            "name": biz_name,
            "description": description or subheadline,
            "telephone": phone,
            "email": email,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": address,
                "addressLocality": city,
                "addressRegion": state,
                "postalCode": postal_code,
                "addressCountry": country,
            } if address or city else None,
        }

        seo = CanonicalSEO(
            title=seo_title,
            meta_description=seo_desc,
            keywords=keywords,
            json_ld=json_ld,
        )

        # 7. Assets
        assets: List[CanonicalAsset] = []
        if website_raw and website_raw.pages:
            for page in website_raw.pages:
                for img in page.images:
                    img_url = getattr(img, "url", getattr(img, "src", None))
                    if img_url and not str(img_url).startswith("data:"):
                        assets.append(
                            CanonicalAsset(
                                url_or_path=str(img_url),
                                alt=getattr(img, "alt", None) or None,
                                kind="general",
                            )
                        )
                        if len(assets) >= 10:
                            break
                if len(assets) >= 10:
                    break

        return CanonicalSiteData(
            schema_version="1.0.0",
            business_id=intelligence.site_id,
            generated_at=datetime.now(timezone.utc).isoformat(),
            identity=identity,
            contact=contact,
            editorial=editorial,
            offerings=offerings,
            social_proof=social_proof,
            seo=seo,
            assets=assets,
            metadata={
                "domain": intelligence.domain,
                "base_url": intelligence.base_url,
            },
        )


class SlotPopulator:
    """
    Backward-compatible adapter that uses CanonicalSiteDataBuilder to produce
    the canonical contract.
    """

    def __init__(self):
        self._builder = CanonicalSiteDataBuilder()

    def build_canonical(
        self,
        intelligence: WebsiteIntelligence,
        business: Optional[Business] = None,
        website_raw: Optional[WebsiteCollectionResult] = None,
    ) -> CanonicalSiteData:
        return self._builder.build(intelligence, business=business, website_raw=website_raw)

    def populate(
        self,
        intelligence: WebsiteIntelligence,
        template_meta: TemplateMetadata,
        website_raw: Optional[WebsiteCollectionResult] = None,
        business: Optional[Business] = None,
    ) -> Dict[str, Any]:
        """Returns the canonical site-data dictionary."""
        canonical = self.build_canonical(intelligence, business=business, website_raw=website_raw)
        return canonical.model_dump(mode="json")
