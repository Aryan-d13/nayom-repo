import unittest
import json
import tempfile
from pathlib import Path

from config.settings import WEBSITES_DATA_DIR, TEMPLATES_DIR
from contracts.intelligence import (
    WebsiteIntelligence,
    BusinessProfile,
    ServiceProduct,
    ContactIntelligence,
    BrandAndContentIntelligence,
    CallToAction,
    DesignAndUXAnalysis,
    TechnicalAndSEOAnalysis,
    RedesignRecommendations,
    TemplateRecommendation,
    IntelligenceMetadata,
)
from contracts.generator import (
    WebsiteGenerationRequest,
    WebsiteGenerationResult,
    TemplateMetadata,
)
from modules.website_generator import (
    WebsiteGenerator,
    TemplateSelector,
    SlotPopulator,
)


def create_sample_intelligence(
    site_id: str = "test_developer",
    rec_template: str = "dark-mode-systems-portfolio",
    category: str = "portfolio",
    industry: str = "Software Engineering",
    style_direction: str = "dark_tech",
) -> WebsiteIntelligence:
    return WebsiteIntelligence(
        site_id=site_id,
        base_url="https://testdev.example.com",
        domain="testdev.example.com",
        source_website_json="data/websites/test_developer/website.json",
        business_profile=BusinessProfile(
            business_name="Test Dev Corp",
            tagline="High Performance Cloud Systems",
            description="Engineering scalable backend infrastructure and automation tools.",
            industry_category=industry,
            value_proposition="We build resilient data pipelines and automated workflows.",
            target_audience="High growth startups and tech enterprises.",
            key_differentiators=["Sub-millisecond processing", "Zero downtime deployments"],
        ),
        services_and_products=[
            ServiceProduct(
                name="Data Pipeline Engine",
                description="High throughput parallelized rendering engine.",
                category="Infrastructure",
                features=["Redis queues", "Sub-5m runtime"],
                pricing_hint="Custom retainers",
            )
        ],
        contact_intelligence=ContactIntelligence(
            emails=["hello@testdev.example.com"],
            phones=["+1-555-0199"],
            addresses=["100 Innovation Blvd"],
            city="Indore",
            country="India",
            has_contact_method=True,
        ),
        brand_and_content=BrandAndContentIntelligence(
            tone_and_voice=["technical", "authoritative"],
            brand_positioning="Elite Systems Architecture",
            hero_headlines=["ENGINEERING SCALABLE SYSTEMS"],
            important_copy_snippets=["Great systems compound quietly."],
            content_quality_score=9,
        ),
        calls_to_action=[
            CallToAction(
                text="Explore Projects",
                destination="#work",
                intent="navigation",
                prominence="primary",
            )
        ],
        design_and_ux=DesignAndUXAnalysis(
            visual_aesthetic="Dark tech minimalist",
            typography_assessment="Clean sans-serif",
            color_palette_assessment="Obsidian and cyan",
            layout_and_spacing="Bento grid",
            ux_navigation_flow="Anchor scroll",
            visual_inputs_analyzed=False,
        ),
        technical_and_seo=TechnicalAndSEOAnalysis(
            inferred_tech_stack=["Python", "Next.js", "Redis", "Docker", "Tailwind CSS"],
            seo_health="Good meta hierarchy",
            accessibility_observations="High contrast",
        ),
        redesign_recommendations=RedesignRecommendations(
            overall_redesign_verdict="Modernize conversion CTAs",
            quick_wins=["Add interactive demo"],
        ),
        template_recommendation=TemplateRecommendation(
            recommended_template=rec_template,
            template_category=category,
            style_direction=style_direction,
            layout_pattern="bento_grid",
            template_confidence=0.95,
        ),
        metadata=IntelligenceMetadata(
            provider="gemini",
            model="gemini-3.5-flash-lite",
        ),
    )


class TestWebsiteGenerator(unittest.TestCase):

    def setUp(self):
        self.sample_intel = create_sample_intelligence()
        self.selector = TemplateSelector()
        self.populator = SlotPopulator()

    def test_template_selector_discovery(self):
        templates = self.selector.available_templates
        self.assertGreaterEqual(len(templates), 2)
        template_ids = [t.id for t in templates]
        self.assertIn("generic-modern", template_ids)
        self.assertIn("dark-portfolio", template_ids)

    def test_template_selector_matching_logic(self):
        # 1. Direct recommended template matching
        intel = create_sample_intelligence(rec_template="dark-mode-systems-portfolio")
        t = self.selector.select_template(intel)
        self.assertEqual(t.id, "dark-portfolio")

        # 2. Dental matching
        intel_dental = create_sample_intelligence(
            rec_template="dental-smooth-practice",
            category="dental",
            industry="Dental Clinic",
            style_direction="clean_corporate",
        )
        t_dental = self.selector.select_template(intel_dental)
        self.assertEqual(t_dental.id, "dental-smooth")

        # 3. Fallback matching
        intel_unknown = create_sample_intelligence(
            rec_template="unknown-custom-theme-999",
            category="unknown_category_xyz",
            industry="Unknown Mystery Widget",
            style_direction="neutral_minimalist",
        )
        t_fallback = self.selector.select_template(intel_unknown)
        self.assertEqual(t_fallback.id, "generic-modern")

        # 4. Manual override
        t_override = self.selector.select_template(intel, template_override="generic-modern")
        self.assertEqual(t_override.id, "generic-modern")

    def test_slot_populator_structure(self):
        template_meta = self.selector.get_template("dark-portfolio")
        site_data = self.populator.populate(self.sample_intel, template_meta)

        self.assertIsInstance(site_data, dict)
        self.assertEqual(site_data["identity"]["name"], "Test Dev Corp")
        self.assertEqual(site_data["editorial"]["headline"], "ENGINEERING SCALABLE SYSTEMS")
        self.assertEqual(site_data["editorial"]["primary_cta"]["text"], "Explore Projects")
        self.assertEqual(site_data["contact"]["email"], "hello@testdev.example.com")
        self.assertIn("Indore", site_data["contact"]["city"])
        self.assertEqual(len(site_data["offerings"]), 1)
        self.assertEqual(site_data["offerings"][0]["name"], "Data Pipeline Engine")
        self.assertEqual(len(site_data["social_proof"]["testimonials"]), 0)

    def test_generator_end_to_end_project_assembly(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            out_base = Path(tmp_dir) / "generated"
            generator = WebsiteGenerator(output_base_dir=out_base)

            res = generator.generate(
                source=self.sample_intel,
            )

            self.assertIsInstance(res, WebsiteGenerationResult)
            self.assertTrue(res.is_success)
            self.assertEqual(res.business_id, "test_developer")
            self.assertEqual(res.template_id, "dark-portfolio")

            # Check that destination directory exists
            out_dir = Path(res.output_dir)
            self.assertTrue(out_dir.exists())

            # Check essential project files
            self.assertTrue((out_dir / "package.json").exists())
            self.assertTrue((out_dir / "tsconfig.json").exists())
            self.assertTrue((out_dir / "site-data.json").exists())
            self.assertTrue((out_dir / "generator-manifest.json").exists())
            self.assertTrue((out_dir / "app" / "page.tsx").exists())
            self.assertTrue((out_dir / "app" / "layout.tsx").exists())

            # Read and verify site-data.json
            with open(out_dir / "site-data.json", "r", encoding="utf-8") as f:
                saved_site_data = json.load(f)
            self.assertEqual(saved_site_data["identity"]["name"], "Test Dev Corp")
            self.assertEqual(saved_site_data["editorial"]["primary_cta"]["text"], "Explore Projects")

            # Read and verify generator-manifest.json
            with open(out_dir / "generator-manifest.json", "r", encoding="utf-8") as f:
                manifest = json.load(f)
            self.assertEqual(manifest["template_id"], "dark-portfolio")
            self.assertEqual(manifest["business_id"], "test_developer")
            self.assertGreater(manifest["slots_populated"], 5)

    def test_generator_from_real_intelligence_file(self):
        real_intel_path = WEBSITES_DATA_DIR / "aryansharmaswe_vercel_app" / "website_intelligence.json"
        if not real_intel_path.exists():
            self.skipTest("Real intelligence file not found")

        with tempfile.TemporaryDirectory() as tmp_dir:
            out_base = Path(tmp_dir) / "generated"
            generator = WebsiteGenerator(output_base_dir=out_base)

            res = generator.generate(source=real_intel_path)

            self.assertTrue(res.is_success)
            self.assertEqual(res.business_id, "aryansharmaswe_vercel_app")
            self.assertEqual(res.template_id, "dark-portfolio")

            out_dir = Path(res.output_dir)
            with open(out_dir / "site-data.json", "r", encoding="utf-8") as f:
                data = json.load(f)

            self.assertEqual(data["identity"]["name"], "Aryan Sharma")
            self.assertIn("Julius", [s["name"] for s in data["offerings"]])

    def test_generator_avoids_non_runnable_template_stubs(self):
        """Verify that generator selects only runnable templates even when intelligence recommends non-runnable stub."""
        intel_gym = create_sample_intelligence(
            site_id="test_gym",
            rec_template="gym-power",
            category="gym",
            industry="Fitness Center",
            style_direction="bold_dark",
        )
        with tempfile.TemporaryDirectory() as tmp_dir:
            out_base = Path(tmp_dir) / "generated"
            generator = WebsiteGenerator(output_base_dir=out_base)

            res = generator.generate(source=intel_gym)

            self.assertTrue(res.is_success)
            # Must NOT select the non-runnable gym-power stub
            self.assertNotEqual(res.template_id, "gym-power")
            # Must select a valid and runnable template
            selected_t = generator._selector.get_template(res.template_id)
            self.assertTrue(selected_t.is_runnable)

            out_dir = Path(res.output_dir)
            self.assertTrue((out_dir / "package.json").exists())
            self.assertTrue((out_dir / "site-data.json").exists())


if __name__ == "__main__":
    unittest.main()
