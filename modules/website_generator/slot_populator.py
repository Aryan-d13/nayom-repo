import logging
from typing import Dict, Any, Optional, List
from pathlib import Path

from contracts.intelligence import WebsiteIntelligence
from contracts.website import WebsiteCollectionResult
from contracts.generator import TemplateMetadata

logger = logging.getLogger(__name__)


class SlotPopulator:
    """
    Transforms structured WebsiteIntelligence into a populated site-data.json payload
    for deterministic Next.js template assembly without mutating React code.
    """

    def populate(
        self,
        intelligence: WebsiteIntelligence,
        template_meta: TemplateMetadata,
        website_raw: Optional[WebsiteCollectionResult] = None,
    ) -> Dict[str, Any]:
        """
        Populates all site-data.json slots from structured business intelligence.
        """
        bp = intelligence.business_profile
        ci = intelligence.contact_intelligence
        bc = intelligence.brand_and_content
        ts = intelligence.technical_and_seo
        rec = intelligence.template_recommendation

        # 1. Site identity
        business_name = bp.business_name or intelligence.site_id.replace("_", " ").title()
        tagline = bp.tagline or (bc.hero_headlines[0] if bc.hero_headlines else "")
        niche = bp.industry_category or "Professional Services"

        # 2. Hero headline & copy
        hero_title = ""
        if bc.hero_headlines:
            hero_title = bc.hero_headlines[0]
        elif bp.tagline:
            hero_title = bp.tagline
        else:
            hero_title = f"Welcome to {business_name}"

        hero_subtitle = bp.description or bp.value_proposition or "Delivering exceptional quality, performance, and dedicated service."

        # Hero CTA
        hero_cta_text = "Get In Touch"
        hero_cta_link = "#contact"
        if intelligence.calls_to_action:
            primary_cta = intelligence.calls_to_action[0]
            hero_cta_text = primary_cta.text
            if primary_cta.destination:
                hero_cta_link = primary_cta.destination

        # 3. Services / Products
        services_list = []
        for s in intelligence.services_and_products:
            services_list.append({
                "name": s.name,
                "description": s.description or "",
                "category": s.category or "Specialized Service",
                "features": s.features if s.features else [],
                "priceRange": s.pricing_hint or "",
            })

        # 4. Contact details
        phone = ci.phones[0] if ci.phones else ""
        email = ci.emails[0] if ci.emails else ""
        address = ci.addresses[0] if ci.addresses else ""
        loc_parts = [p for p in [ci.city, ci.state_or_region, ci.country] if p]
        location_str = ", ".join(loc_parts) if loc_parts else ""
        business_hours = ci.business_hours or ""

        # Social links mapping
        social_links_dict = {}
        for s in ci.social_links:
            social_links_dict[s.platform.lower()] = s.url

        # 5. Testimonials & proof points
        testimonials_list = []
        if bc.important_copy_snippets:
            for snippet in bc.important_copy_snippets[:4]:
                testimonials_list.append({
                    "quote": snippet,
                    "author": "Verified Overview / Client Feedback",
                    "rating": 5,
                })
        else:
            testimonials_list.append({
                "quote": f"Working with {business_name} delivered outstanding reliability, clarity, and results.",
                "author": "Client Review",
                "rating": 5,
            })

        # 6. Tech stack / tools
        tech_stack = list(ts.inferred_tech_stack) if ts.inferred_tech_stack else []

        # 7. Theme tokens
        default_theme = template_meta.default_theme or {}
        palette = default_theme.get("palette", ["#0f172a", "#0284c7", "#10b981", "#f8fafc"])
        typography = default_theme.get("typography", "Inter, sans-serif")
        style_direction = rec.style_direction if rec else "modern"

        # 8. SEO Metadata
        seo_title = f"{business_name} | {tagline or niche}"
        seo_desc = hero_subtitle[:160]

        # 9. Assembled site-data.json payload
        payload = {
            "site": {
                "name": business_name,
                "tagline": tagline,
                "niche": niche,
                "domain": intelligence.domain,
                "baseUrl": intelligence.base_url,
            },
            "theme": {
                "palette": palette,
                "typography": typography,
                "styleDirection": style_direction,
            },
            "hero": {
                "title": hero_title,
                "subtitle": hero_subtitle,
                "cta": hero_cta_text,
                "ctaLink": hero_cta_link,
            },
            "about": {
                "summary": bp.value_proposition or bp.description,
                "differentiators": bp.key_differentiators if bp.key_differentiators else [],
            },
            "contact": {
                "phone": phone,
                "email": email,
                "address": address,
                "location": location_str,
                "businessHours": business_hours,
            },
            "services": services_list,
            "techStack": tech_stack,
            "testimonials": testimonials_list,
            "faqs": [
                {
                    "question": f"What services does {business_name} provide?",
                    "answer": bp.description or "We provide high quality, dedicated solutions tailored to your operational requirements.",
                },
                {
                    "question": "How can I get started?",
                    "answer": "Reach out through our contact form or direct email to discuss project scope and milestones.",
                },
            ],
            "socialLinks": social_links_dict,
            "locations": {
                "serviceAreas": [ci.city] if ci.city else ["Global / Remote"],
            },
            "seo": {
                "title": seo_title,
                "description": seo_desc,
                "jsonLd": {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness" if ci.addresses else "Organization",
                    "name": business_name,
                    "description": bp.description,
                    "url": intelligence.base_url,
                    "telephone": phone if phone else None,
                    "email": email if email else None,
                },
            },
        }

        logger.info(
            "Populated site-data.json for '%s' (%d services, %d testimonials, %d stack items)",
            business_name,
            len(services_list),
            len(testimonials_list),
            len(tech_stack),
        )

        return payload
