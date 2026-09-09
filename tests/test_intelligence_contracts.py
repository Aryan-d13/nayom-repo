import unittest
import json
from contracts.intelligence import (
    BusinessProfile,
    ServiceProduct,
    SocialLink,
    ContactIntelligence,
    BrandAndContentIntelligence,
    CallToAction,
    DesignAndUXAnalysis,
    TechnicalAndSEOAnalysis,
    RedesignRecommendations,
    TemplateRecommendation,
    IntelligenceMetadata,
    WebsiteIntelligence,
)


class TestIntelligenceContracts(unittest.TestCase):

    def test_business_profile_contract(self):
        bp = BusinessProfile(
            business_name="Acme Corp",
            tagline="Innovating Tomorrow Today",
            description="Leading AI infrastructure provider.",
            industry_category="Technology / AI",
            value_proposition="Faster and cheaper neural inference.",
            target_audience="Enterprise developers and data scientists.",
            key_differentiators=["Proprietary compiler", "Zero cold start"],
        )
        self.assertEqual(bp.business_name, "Acme Corp")
        self.assertEqual(len(bp.key_differentiators), 2)
        dumped = bp.model_dump()
        self.assertEqual(dumped["industry_category"], "Technology / AI")

    def test_contact_intelligence_contract(self):
        ci = ContactIntelligence(
            emails=["info@acme.com"],
            phones=["+1-800-555-0199"],
            addresses=["100 Innovation Way"],
            city="Seattle",
            state_or_region="WA",
            country="USA",
            social_links=[SocialLink(platform="linkedin", url="https://linkedin.com/company/acme")],
            contact_forms_found=True,
            has_contact_method=True,
        )
        self.assertTrue(ci.has_contact_method)
        self.assertEqual(ci.city, "Seattle")
        self.assertEqual(ci.social_links[0].platform, "linkedin")

    def test_template_recommendation_contract(self):
        tr = TemplateRecommendation(
            recommended_template="modern-saas-bento",
            template_category="saas_landing",
            style_direction="dark_tech",
            layout_pattern="bento_grid",
            template_confidence=0.92,
            key_sections=["hero", "features_bento", "pricing_tier", "cta_modal"],
            reasoning="SaaS product with developer target audience benefits from dark bento grid.",
        )
        self.assertEqual(tr.recommended_template, "modern-saas-bento")
        self.assertEqual(tr.style_direction, "dark_tech")
        self.assertEqual(len(tr.key_sections), 4)

    def test_design_and_ux_contract_with_visual_flag(self):
        dux = DesignAndUXAnalysis(
            visual_aesthetic="Dark-mode Swiss minimalist layout with neon accents.",
            typography_assessment="Tight display sans serif with high legibility.",
            color_palette_assessment="Deep obsidian (#0B0F17) with electric blue CTA buttons.",
            layout_and_spacing="Generous 24px grid gaps with structured bento cards.",
            ux_navigation_flow="Intuitive sticky header navigation with clear conversion funnels.",
            visual_inputs_analyzed=True,
            screenshot_observations=["Observed clean hero visual alignment and sharp dark theme."],
            strengths=["Stunning visual hierarchy", "Clear contrast"],
            weaknesses=["Secondary pages lack interactive previews"],
        )
        self.assertTrue(dux.visual_inputs_analyzed)
        self.assertEqual(len(dux.screenshot_observations), 1)

    def test_full_website_intelligence_roundtrip(self):
        intel = WebsiteIntelligence(
            site_id="acme_ai",
            base_url="https://acme.ai",
            domain="acme.ai",
            source_website_json="data/websites/acme_ai/website.json",
            business_profile=BusinessProfile(
                business_name="Acme AI",
                tagline="Fast Inference",
                description="High performance inference engine.",
                value_proposition="Ultra-low latency model hosting.",
                target_audience="Engineers",
            ),
            services_and_products=[
                ServiceProduct(
                    name="Inference API",
                    description="Sub-10ms API endpoints.",
                    category="Core Product",
                    features=["Global CDN", "Pay per token"],
                )
            ],
            contact_intelligence=ContactIntelligence(
                emails=["sales@acme.ai"],
                has_contact_method=True,
            ),
            brand_and_content=BrandAndContentIntelligence(
                tone_and_voice=["technical", "authoritative"],
                brand_positioning="Premium Developer Infrastructure",
                hero_headlines=["Zero Latency AI"],
                content_quality_score=9,
            ),
            calls_to_action=[
                CallToAction(
                    text="Start Free Trial",
                    destination="/signup",
                    intent="lead_capture",
                    prominence="primary",
                )
            ],
            design_and_ux=DesignAndUXAnalysis(
                visual_aesthetic="Technical Dark Modern",
                typography_assessment="Inter / JetBrains Mono",
                color_palette_assessment="Monochrome with Cyan accents",
                layout_and_spacing="Asymmetric grid",
                ux_navigation_flow="Direct onboarding flow",
                visual_inputs_analyzed=False,
            ),
            technical_and_seo=TechnicalAndSEOAnalysis(
                inferred_tech_stack=["Next.js", "Tailwind", "Vercel"],
                seo_health="Excellent meta tags and structured schema.",
                accessibility_observations="High contrast colors; ARIA tags present.",
            ),
            redesign_recommendations=RedesignRecommendations(
                overall_redesign_verdict="Minor polish recommended; architecture is already modern.",
                quick_wins=["Add interactive playground to hero"],
            ),
            template_recommendation=TemplateRecommendation(
                recommended_template="modern-saas-bento",
                template_category="saas_landing",
                style_direction="dark_tech",
                layout_pattern="bento_grid",
                template_confidence=0.95,
                key_sections=["hero", "features", "pricing"],
            ),
            metadata=IntelligenceMetadata(
                provider="gemini",
                model="gemini-3.5-flash-lite",
                prompt_version="1.0.0",
            ),
        )

        json_str = intel.model_dump_json()
        data = json.loads(json_str)

        self.assertEqual(data["site_id"], "acme_ai")
        self.assertEqual(data["business_profile"]["business_name"], "Acme AI")
        self.assertEqual(data["metadata"]["model"], "gemini-3.5-flash-lite")
        self.assertEqual(data["template_recommendation"]["recommended_template"], "modern-saas-bento")
        self.assertEqual(len(data["services_and_products"]), 1)
        self.assertEqual(data["services_and_products"][0]["name"], "Inference API")

        # Validate deserialization back to model
        loaded = WebsiteIntelligence.model_validate(data)
        self.assertEqual(loaded.site_id, "acme_ai")
        self.assertEqual(loaded.template_recommendation.template_category, "saas_landing")



if __name__ == "__main__":
    unittest.main()
