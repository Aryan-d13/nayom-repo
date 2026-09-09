import unittest
import tempfile
import json
from pathlib import Path

from config.settings import TEMPLATES_DIR
from contracts.template import (
    TemplateMetadata,
    TemplateValidationResult,
    TemplateRegistryIndex,
)
from modules.template_registry import TemplateRegistry, TemplateValidator
from modules.website_generator import TemplateSelector
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


def create_mock_intelligence(
    rec_template: str = "dark-mode-systems-portfolio",
    category: str = "portfolio",
    industry: str = "Software",
    style_direction: str = "dark_tech",
    layout_pattern: str = "bento_grid",
) -> WebsiteIntelligence:
    return WebsiteIntelligence(
        site_id="test_company",
        base_url="https://testcompany.example.com",
        domain="testcompany.example.com",
        source_website_json="data/websites/test_company/website.json",
        business_profile=BusinessProfile(
            business_name="Test Company",
            tagline="Enterprise AI & Scalable Systems",
            description="High scale cloud infrastructure and engineering solutions.",
            industry_category=industry,
            value_proposition="Resilient architectures for modern enterprises.",
            target_audience="CTOs and engineering leaders.",
            key_differentiators=["Zero downtime", "High throughput"],
        ),
        services_and_products=[
            ServiceProduct(
                name="Cloud Engine",
                description="Distributed rendering pipeline",
                category="Infrastructure",
                features=["Async queues"],
                pricing_hint="Custom",
            )
        ],
        contact_intelligence=ContactIntelligence(
            emails=["contact@testcompany.example.com"],
            phones=["+1-555-0100"],
            addresses=["100 Tech Blvd"],
            city="San Francisco",
            country="USA",
            has_contact_method=True,
        ),
        brand_and_content=BrandAndContentIntelligence(
            tone_and_voice=["modern", "authoritative"],
            brand_positioning="Leading Cloud Engineering",
            hero_headlines=["ENGINEERING TOMORROW'S CLOUD"],
            important_copy_snippets=["Speed and stability combined."],
            content_quality_score=9,
        ),
        calls_to_action=[
            CallToAction(
                text="Get Started",
                destination="#contact",
                intent="contact",
                prominence="primary",
            )
        ],
        design_and_ux=DesignAndUXAnalysis(
            visual_aesthetic="Dark tech minimalist",
            typography_assessment="Clean sans-serif",
            color_palette_assessment="Obsidian and blue",
            layout_and_spacing="Bento grid",
            ux_navigation_flow="Anchor scroll",
            visual_inputs_analyzed=False,
        ),
        technical_and_seo=TechnicalAndSEOAnalysis(
            inferred_tech_stack=["Next.js", "TypeScript", "Tailwind CSS"],
            seo_health="Good",
            accessibility_observations="High contrast",
        ),
        redesign_recommendations=RedesignRecommendations(
            overall_redesign_verdict="Modernize UX",
            quick_wins=["Add interactive components"],
        ),
        template_recommendation=TemplateRecommendation(
            recommended_template=rec_template,
            template_category=category,
            style_direction=style_direction,
            layout_pattern=layout_pattern,
            template_confidence=0.95,
        ),
        metadata=IntelligenceMetadata(
            provider="gemini",
            model="gemini-3.5-flash-lite",
        ),
    )


class TestTemplateRegistry(unittest.TestCase):

    def setUp(self):
        self.registry = TemplateRegistry()
        self.validator = TemplateValidator()

    def test_registry_discovery(self):
        """Verify registry discovers templates recursively in subdirectories."""
        templates = self.registry.all_templates
        self.assertGreaterEqual(len(templates), 5)
        
        template_ids = [t.id for t in templates]
        self.assertIn("dark-portfolio", template_ids)
        self.assertIn("generic-modern", template_ids)
        self.assertIn("dental-smooth", template_ids)
        self.assertIn("construction-craft", template_ids)
        self.assertIn("restaurant-flavor", template_ids)
        self.assertIn("lawyer-authority", template_ids)

    def test_registry_rebuild_cache(self):
        """Verify registry rebuilds templates/registry.json index cache without error."""
        index = self.registry.discover_and_rebuild()
        self.assertIsInstance(index, TemplateRegistryIndex)
        self.assertGreaterEqual(index.total_templates, 5)
        self.assertGreaterEqual(index.runnable_templates, 2)
        self.assertTrue(self.registry.registry_file.exists())

        # Verify reading cache
        with open(self.registry.registry_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("templates", data)
        self.assertIn("dark-portfolio", data["templates"])

    def test_template_search_by_industry(self):
        """Verify multi-criteria filtering by industry and category."""
        dental_matches = self.registry.search(industry="dental")
        self.assertGreaterEqual(len(dental_matches), 1)
        self.assertEqual(dental_matches[0].id, "dental-smooth")

        law_matches = self.registry.search(industry="legal")
        self.assertGreaterEqual(len(law_matches), 1)
        self.assertEqual(law_matches[0].id, "lawyer-authority")

        food_matches = self.registry.search(category="food")
        self.assertGreaterEqual(len(food_matches), 1)
        self.assertEqual(food_matches[0].id, "restaurant-flavor")

    def test_template_search_by_style_and_layout(self):
        """Verify filtering by style keywords and layout patterns."""
        dark_matches = self.registry.search(style="dark")
        self.assertGreaterEqual(len(dark_matches), 2)
        ids = [t.id for t in dark_matches]
        self.assertIn("dark-portfolio", ids)

        bento_matches = self.registry.search(layout="bento_grid")
        self.assertGreaterEqual(len(bento_matches), 2)
        bento_ids = [t.id for t in bento_matches]
        self.assertIn("dark-portfolio", bento_ids)

    def test_validator_valid_vs_stub(self):
        """Verify validator marks complete Next.js templates as valid and stubs as incomplete."""
        dark_port = self.registry.get_template("dark-portfolio")
        self.assertIsNotNone(dark_port)
        self.assertTrue(dark_port.is_valid)
        self.assertTrue(dark_port.is_runnable)

        dental_stub = self.registry.get_template("dental-smooth")
        self.assertIsNotNone(dental_stub)
        self.assertFalse(dental_stub.is_runnable)

    def test_validator_isolated_directory(self):
        """Verify validator accurately diagnoses missing files in an isolated temporary template."""
        with tempfile.TemporaryDirectory() as tmp_dir:
            temp_tpl = Path(tmp_dir) / "custom-template"
            temp_tpl.mkdir()

            # 1. Empty folder
            res1 = self.validator.validate_template_dir(temp_tpl)
            self.assertFalse(res1.is_valid)
            self.assertIn("Missing required file: metadata.json", res1.errors[0])

            # 2. Add valid metadata.json & slots.json & site-data.json & package.json & app/page.tsx
            meta = {
                "id": "custom-template",
                "name": "Custom Dynamic Template",
                "version": "1.0.0",
                "description": "Test template for unit validation",
                "categories": ["custom", "test"],
                "industries": ["testing"],
                "style_keywords": ["modern", "test"],
                "layout_patterns": ["single_page_anchor_flow"],
                "supported_features": ["booking"],
                "supported_slots": ["site.name"],
                "preview_image": "preview/thumbnail.png",
                "entrypoint": "app/page.tsx",
            }
            with open(temp_tpl / "metadata.json", "w", encoding="utf-8") as f:
                json.dump(meta, f)
            with open(temp_tpl / "slots.json", "w", encoding="utf-8") as f:
                json.dump({"site.name": "business_identity.business_name"}, f)
            with open(temp_tpl / "site-data.json", "w", encoding="utf-8") as f:
                json.dump({"site": {"name": "Test"}}, f)
            with open(temp_tpl / "package.json", "w", encoding="utf-8") as f:
                json.dump({"name": "custom", "dependencies": {"next": "14.2.0", "react": "18.2.0"}}, f)
            
            (temp_tpl / "app").mkdir()
            with open(temp_tpl / "app" / "page.tsx", "w", encoding="utf-8") as f:
                f.write("export default function Page() { return <div>Test</div>; }")

            res2 = self.validator.validate_template_dir(temp_tpl)
            self.assertTrue(res2.is_valid)
            self.assertTrue(res2.is_runnable)
            self.assertEqual(len(res2.errors), 0)

    def test_dynamic_selector_resolution(self):
        """Verify dynamic template selector chooses optimal templates without hardcoded python maps."""
        selector = TemplateSelector(registry=self.registry)

        # Portfolio intelligence
        intel_dev = create_mock_intelligence(
            rec_template="dark-mode-systems-portfolio",
            category="portfolio",
            industry="Software Development",
            style_direction="dark_tech",
        )
        t_dev = selector.select_template(intel_dev)
        self.assertEqual(t_dev.id, "dark-portfolio")

        # Dental intelligence
        intel_dental = create_mock_intelligence(
            rec_template="dental-smooth-practice",
            category="dental",
            industry="Dentist Clinic",
            style_direction="clean_bright",
        )
        t_dental = selector.select_template(intel_dental)
        self.assertEqual(t_dental.id, "dental-smooth")

        # Unknown fallback intelligence
        intel_unknown = create_mock_intelligence(
            rec_template="alien-futuristic-widget-theme",
            category="alien_industry",
            industry="Exotic Mineral Refinery",
            style_direction="neon_matrix",
        )
        t_fallback = selector.select_template(intel_unknown)
        self.assertEqual(t_fallback.id, "generic-modern")


if __name__ == "__main__":
    unittest.main()
