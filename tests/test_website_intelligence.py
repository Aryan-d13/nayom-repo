import unittest
import json
import tempfile
from pathlib import Path

from config.settings import WEBSITES_DATA_DIR
from contracts.intelligence import WebsiteIntelligence
from modules.website_intelligence import (
    WebsiteIntelligenceAnalyzer,
    MockProvider,
    GeminiProvider,
    get_provider,
    register_provider,
    AIProvider,
)


class TestWebsiteIntelligence(unittest.TestCase):

    def setUp(self):
        self.sample_website_json = WEBSITES_DATA_DIR / "aryansharmaswe_vercel_app" / "website.json"

    def test_analyzer_end_to_end_with_mock_provider(self):
        mock_prov = MockProvider(model_name="mock-gemini-3.5-flash-lite")
        analyzer = WebsiteIntelligenceAnalyzer(provider=mock_prov)

        with tempfile.TemporaryDirectory() as tmp_dir:
            out_file = Path(tmp_dir) / "test_intel.json"

            intel = analyzer.analyze(
                source=self.sample_website_json,
                output_path=out_file,
            )

            self.assertIsInstance(intel, WebsiteIntelligence)
            self.assertEqual(intel.site_id, "aryansharmaswe_vercel_app")
            self.assertEqual(intel.domain, "aryansharmaswe.vercel.app")
            self.assertEqual(intel.metadata.provider, "mock")
            self.assertEqual(intel.metadata.model, "mock-gemini-3.5-flash-lite")

            # Check that file was created and is valid JSON
            self.assertTrue(out_file.exists())
            with open(out_file, "r", encoding="utf-8") as f:
                saved_data = json.load(f)

            self.assertEqual(saved_data["site_id"], "aryansharmaswe_vercel_app")
            self.assertIn("business_profile", saved_data)
            self.assertIn("redesign_recommendations", saved_data)

    def test_screenshot_discovery_and_multimodal_flag(self):
        mock_prov = MockProvider()
        analyzer = WebsiteIntelligenceAnalyzer(provider=mock_prov)

        with tempfile.TemporaryDirectory() as tmp_dir:
            site_dir = Path(tmp_dir) / "test_site"
            site_dir.mkdir()
            shots_dir = site_dir / "screenshots"
            shots_dir.mkdir()
            fake_shot = shots_dir / "hero.png"
            fake_shot.write_bytes(b"\x89PNG\r\n\x1a\nfake_image_data")

            # Write a minimal website.json
            fake_website_json = site_dir / "website.json"
            website_data = {
                "request": {"url": "https://example.com"},
                "site_id": "test_site",
                "base_url": "https://example.com",
                "domain": "example.com",
                "total_pages_crawled": 1,
                "successful_pages": 1,
                "failed_pages": 0,
                "pages": [
                    {
                        "url": "https://example.com",
                        "path": "/",
                        "title": "Example Test",
                        "screenshot_path": str(fake_shot),
                        "content": {"markdown": "Hello world", "word_count": 2},
                    }
                ],
                "raw_output_dir": str(site_dir / "raw"),
                "website_json_path": str(fake_website_json),
            }
            with open(fake_website_json, "w", encoding="utf-8") as f:
                json.dump(website_data, f)

            intel = analyzer.analyze(source=fake_website_json)

            self.assertTrue(intel.design_and_ux.visual_inputs_analyzed)
            self.assertGreaterEqual(intel.metadata.screenshots_processed, 1)

    def test_provider_factory_and_gemini_config(self):
        # Factory returns MockProvider
        mock_p = get_provider("mock", model_name="custom-mock")
        self.assertEqual(mock_p.provider_name, "mock")
        self.assertEqual(mock_p.model_name, "custom-mock")

        # Factory returns GeminiProvider with default model
        gemini_p = get_provider("gemini", model_name="gemini-3.5-flash-lite", api_key="test-key")
        self.assertEqual(gemini_p.provider_name, "gemini")
        self.assertEqual(gemini_p.model_name, "gemini-3.5-flash-lite")

        # Test custom provider registration
        class DummyProvider(AIProvider):
            @property
            def provider_name(self):
                return "dummy"

            @property
            def model_name(self):
                return "dummy-v1"

            def generate_structured(self, prompt, system_instruction, response_schema, image_paths=None):
                return response_schema()

        register_provider("dummy", DummyProvider)
        dummy_p = get_provider("dummy")
        self.assertEqual(dummy_p.provider_name, "dummy")

    def test_missing_input_file_raises_not_found(self):
        analyzer = WebsiteIntelligenceAnalyzer(provider=MockProvider())
        with self.assertRaises(FileNotFoundError):
            analyzer.analyze(source="non_existent_directory_or_file.json")


if __name__ == "__main__":
    unittest.main()
