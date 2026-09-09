import os
import json
import shutil
import subprocess
import unittest
from pathlib import Path

from config.settings import GENERATED_DIR, TEMPLATES_DIR
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
from modules.website_generator import WebsiteGenerator
from modules.tracking.tracker import LeadTracker


def create_vanguard_garage_doors_intel() -> WebsiteIntelligence:
    """Realistic business intelligence fixture for Vanguard Garage Doors, Dallas TX."""
    return WebsiteIntelligence(
        site_id="vanguard_garage_doors",
        base_url="https://vanguarddoorsdallas.com",
        domain="vanguarddoorsdallas.com",
        source_website_json="data/websites/vanguard_garage_doors/website.json",
        business_profile=BusinessProfile(
            business_name="Vanguard Garage Doors",
            tagline="Premier Garage Door Installation & Repair in Dallas",
            description="Commercial and residential overhead door installations, broken spring replacements, and smart opener conversions throughout the Dallas-Fort Worth metroplex.",
            industry_category="Garage Door Services",
            value_proposition="Same-day dispatch, architectural steel doors, and lifetime spring warranties.",
            target_audience="Homeowners, property managers, and custom home builders in DFW.",
            key_differentiators=[
                "24/7 Emergency Dispatch",
                "Licensed & Insured Technicians",
                "Lifetime Torsion Spring Warranty",
            ],
        ),
        services_and_products=[
            ServiceProduct(
                name="Torsion Spring Replacement",
                description="Heavy-duty oil-tempered springs rated for 25,000 cycles with precision balancing.",
                category="Repair",
                features=["Same-day service", "Safety inspection included"],
                pricing_hint="From $189",
            ),
            ServiceProduct(
                name="Custom Architectural Doors",
                description="Full-view glass, modern flush wood grain, and insulated steel carriage doors.",
                category="Installation",
                features=["R-18 polyurethane insulation", "Smart Wi-Fi opener compatibility"],
            ),
            ServiceProduct(
                name="Smart Opener Upgrades",
                description="Ultra-quiet belt drive openers with battery backup and smartphone control.",
                category="Openers",
                features=["Belt drive whisper operation", "Integrated HD camera"],
            ),
        ],
        contact_intelligence=ContactIntelligence(
            emails=["service@vanguarddoorsdallas.com"],
            phones=["(214) 555-0812"],
            addresses=["1420 Commerce St, Suite 300"],
            city="Dallas",
            state_or_region="Texas",
            postal_code="75201",
            country="US",
            hours="Mon-Sat 7:00 AM - 8:00 PM",
            social_links=[],
            has_contact_method=True,
        ),
        brand_and_content=BrandAndContentIntelligence(
            tone_and_voice=["authoritative", "craftsman", "reliable"],
            brand_positioning="Dallas Architectural Overhead Door Specialists",
            hero_headlines=["DALLAS ARCHITECTURAL GARAGE DOORS"],
            important_copy_snippets=["Engineered for the Texas heat, built to last generations."],
            content_quality_score=9,
        ),
        calls_to_action=[
            CallToAction(
                text="REQUEST A SERVICE",
                destination="#quote",
                intent="contact",
                prominence="primary",
            ),
            CallToAction(
                text="VIEW OUR WORK",
                destination="#doors",
                intent="navigation",
                prominence="secondary",
            ),
        ],
        design_and_ux=DesignAndUXAnalysis(
            visual_aesthetic="Industrial Architectural",
            typography_assessment="Bold sans-serif with refined serif accents",
            color_palette_assessment="Charcoal, amber, and warm bone",
            layout_and_spacing="Spacious editorial sections",
            ux_navigation_flow="Sticky header with direct phone CTA",
            visual_inputs_analyzed=False,
        ),
        technical_and_seo=TechnicalAndSEOAnalysis(
            inferred_tech_stack=["Next.js", "Tailwind CSS"],
            seo_health="Strong local schema markers",
            accessibility_observations="High contrast text",
        ),
        redesign_recommendations=RedesignRecommendations(
            overall_redesign_verdict="Elevate brand perception to premium architectural level",
            quick_wins=["Add interactive door style visualizer", "Provide instant repair diagnostics"],
            strategic_opportunities=["Capture high-intent emergency repair searches"],
        ),
        template_recommendation=TemplateRecommendation(
            recommended_template="up-and-over",
            template_category="garage_doors",
            style_direction="warm_editorial",
            layout_pattern="editorial_showcase",
            template_confidence=0.98,
        ),
        metadata=IntelligenceMetadata(
            provider="deterministic",
            model="mock",
        ),
    )


def create_incomplete_garage_door_intel() -> WebsiteIntelligence:
    """Fixture with missing email, missing hours, missing testimonials, missing offerings."""
    return WebsiteIntelligence(
        site_id="lone_star_doors_incomplete",
        base_url="https://lonestardoors.example.com",
        domain="lonestardoors.example.com",
        source_website_json="data/websites/lone_star_doors_incomplete/website.json",
        business_profile=BusinessProfile(
            business_name="Lone Star Doors",
            tagline=None,
            description="Garage door repair services in Fort Worth.",
            industry_category="Garage Doors",
            value_proposition="",
            target_audience="",
            key_differentiators=[],
        ),
        services_and_products=[],  # No offerings
        contact_intelligence=ContactIntelligence(
            emails=[],  # No email
            phones=["(817) 555-9988"],
            addresses=[],
            city="Fort Worth",
            state_or_region="Texas",
            postal_code=None,
            country="US",
            hours=None,  # No hours
            social_links=[],
            has_contact_method=True,
        ),
        brand_and_content=BrandAndContentIntelligence(
            tone_and_voice=["direct"],
            brand_positioning="Local Garage Repair",
            hero_headlines=[],  # No custom headline
            important_copy_snippets=[],
            content_quality_score=6,
        ),
        calls_to_action=[],
        design_and_ux=DesignAndUXAnalysis(
            visual_aesthetic="Clean",
            typography_assessment="Standard",
            color_palette_assessment="Neutral",
            layout_and_spacing="Standard",
            ux_navigation_flow="Single page",
            visual_inputs_analyzed=False,
        ),
        technical_and_seo=TechnicalAndSEOAnalysis(
            inferred_tech_stack=[],
            seo_health="Minimal",
            accessibility_observations="Standard",
        ),
        redesign_recommendations=RedesignRecommendations(
            overall_redesign_verdict="Build modern presence",
            quick_wins=[],
            strategic_opportunities=[],
        ),
        template_recommendation=TemplateRecommendation(
            recommended_template="up-and-over",
            template_category="garage_doors",
            style_direction="warm_editorial",
            layout_pattern="editorial_showcase",
            template_confidence=0.90,
        ),
        metadata=IntelligenceMetadata(
            provider="deterministic",
            model="mock",
        ),
    )


class TestE2EPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.generator = WebsiteGenerator()
        cls.tracker = LeadTracker(db_path=":memory:")
        cls.output_dir = GENERATED_DIR / "test_e2e_vanguard"
        cls.incomplete_output_dir = GENERATED_DIR / "test_e2e_incomplete"

    def tearDown(self):
        # Clean up generated test output directories
        for p in [self.output_dir, self.incomplete_output_dir]:
            if p.exists():
                try:
                    # Remove junction or folder safely on Windows
                    if (p / "node_modules").exists():
                        subprocess.run(f'cmd /c "rmdir \"{p / "node_modules"}\""', shell=True, capture_output=True)
                    shutil.rmtree(p, ignore_errors=True)
                except Exception:
                    pass

    def _link_node_modules(self, target_dir: Path):
        """Helper to create fast directory junction for node_modules on Windows."""
        template_nm = Path("E:/Code/Templates For Buisinesses Frontend/Garage Door/up-and-over/node_modules")
        if not template_nm.exists():
            template_nm = TEMPLATES_DIR / "garage_doors" / "up-and-over" / "node_modules"
        
        target_nm = target_dir / "node_modules"
        if template_nm.exists() and not target_nm.exists():
            subprocess.run(
                f'cmd /c "mklink /J \"{target_nm}\" \"{template_nm}\""',
                shell=True,
                check=True,
                capture_output=True,
            )

    def test_vanguard_garage_doors_e2e_generation_and_build(self):
        """
        End-to-End Test:
        1. Canonical business data created.
        2. Template selected (up-and-over).
        3. Project generated with single root site-data.json.
        4. Real business info verified in site-data.json (NO synthetic testimonials).
        5. Specialized template structures (DOOR_STYLES, ARCH_POINTS) preserved.
        6. Next.js build (npm run build) succeeds.
        7. LeadTracker marks outreach READY.
        """
        intel = create_vanguard_garage_doors_intel()

        # 1. Record lead initial state in Tracker
        self.tracker.record_discovery(
            business_id=intel.site_id,
            business_name=intel.business_profile.business_name,
            category=intel.business_profile.industry_category,
            phone=intel.contact_intelligence.phones[0],
            city=intel.contact_intelligence.city,
            website=intel.base_url,
        )

        # 2. Execute deterministic website generation
        result = self.generator.generate(
            source=intel,
            output_dir=self.output_dir,
            template_override="up-and-over",
            overwrite=True,
        )

        self.assertTrue(result.is_success)
        self.assertEqual(result.template_id, "up-and-over")

        # 3. Verify single root site-data.json exists and NO duplicate in src/data
        root_site_data = self.output_dir / "site-data.json"
        nested_site_data = self.output_dir / "src" / "data" / "site-data.json"
        self.assertTrue(root_site_data.exists(), "Root site-data.json must exist")
        self.assertFalse(nested_site_data.exists(), "Duplicate src/data/site-data.json must NOT exist")

        # 4. Verify canonical data content
        with open(root_site_data, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["identity"]["name"], "Vanguard Garage Doors")
        self.assertEqual(data["contact"]["city"], "Dallas")
        self.assertEqual(data["contact"]["state"], "Texas")
        self.assertEqual(data["contact"]["phone"], "(214) 555-0812")
        self.assertEqual(data["contact"]["email"], "service@vanguarddoorsdallas.com")

        # Zero fake business claims: no invented testimonials
        self.assertEqual(data["social_proof"]["testimonials"], [])
        self.assertEqual(len(data["offerings"]), 3)

        # 5. Verify adapter and template files exist
        self.assertTrue((self.output_dir / "src" / "data" / "adapter.ts").exists())
        self.assertTrue((self.output_dir / "src" / "data" / "defaultContent.ts").exists())
        self.assertTrue((self.output_dir / "src" / "data" / "content.ts").exists())

        # 6. Run Next.js build
        self._link_node_modules(self.output_dir)
        build_res = subprocess.run(
            ["npm.cmd" if os.name == "nt" else "npm", "run", "build", "--", "--webpack"],
            cwd=str(self.output_dir),
            capture_output=True,
            text=True,
            timeout=120,
        )
        self.assertEqual(
            build_res.returncode,
            0,
            f"Next.js build failed:\nStdout: {build_res.stdout}\nStderr: {build_res.stderr}",
        )

        # 7. Update Tracker and test Quality Gate
        self.tracker.record_generation(
            business_id=intel.site_id,
            template_id="up-and-over",
            status="completed",
        )
        self.tracker.record_build(
            business_id=intel.site_id,
            status="passed",
        )

        # Verification: Quality Gate passed -> eligible for outreach
        self.assertTrue(self.tracker.is_eligible_for_outreach(intel.site_id))

    def test_incomplete_data_fallback_and_build(self):
        """
        Test incomplete business data:
        - missing email
        - missing hours
        - missing testimonials
        - missing optional offerings
        Verify Next.js build passes cleanly with presentation fallbacks.
        """
        intel = create_incomplete_garage_door_intel()

        result = self.generator.generate(
            source=intel,
            output_dir=self.incomplete_output_dir,
            template_override="up-and-over",
            overwrite=True,
        )
        self.assertTrue(result.is_success)

        root_site_data = self.incomplete_output_dir / "site-data.json"
        with open(root_site_data, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["identity"]["name"], "Lone Star Doors")
        self.assertEqual(data["contact"]["city"], "Fort Worth")
        self.assertIsNone(data["contact"]["email"])
        self.assertIsNone(data["contact"]["hours"])
        self.assertEqual(data["social_proof"]["testimonials"], [])
        self.assertEqual(data["offerings"], [])

        # Build with incomplete data
        self._link_node_modules(self.incomplete_output_dir)
        build_res = subprocess.run(
            ["npm.cmd" if os.name == "nt" else "npm", "run", "build", "--", "--webpack"],
            cwd=str(self.incomplete_output_dir),
            capture_output=True,
            text=True,
            timeout=120,
        )
        self.assertEqual(
            build_res.returncode,
            0,
            f"Incomplete data build failed:\nStdout: {build_res.stdout}\nStderr: {build_res.stderr}",
        )

    def test_quality_gate_blocks_outreach_on_failure(self):
        """Verify hard quality gate blocks outreach if generation or build fails."""
        biz_id = "failed_biz_001"
        self.tracker.record_discovery(
            business_id=biz_id,
            business_name="Faulty Doors",
            category="Garage Doors",
        )

        # When generation pending
        self.assertFalse(self.tracker.is_eligible_for_outreach(biz_id))

        # When generation failed
        self.tracker.record_generation(biz_id, template_id="up-and-over", status="failed", error="Missing template")
        self.assertFalse(self.tracker.is_eligible_for_outreach(biz_id))

        # When generation completed but build failed
        self.tracker.record_generation(biz_id, template_id="up-and-over", status="completed")
        self.tracker.record_build(biz_id, status="failed", error="Syntax error in content.ts")
        self.assertFalse(self.tracker.is_eligible_for_outreach(biz_id))


if __name__ == "__main__":
    unittest.main()
