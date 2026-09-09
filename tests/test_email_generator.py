import unittest
import json
import tempfile
from pathlib import Path

from config.settings import WEBSITES_DATA_DIR, GENERATED_DIR
from contracts.email import OutreachEmail, OutreachEmailDraft, EmailGenerationRequest
from contracts.intelligence import WebsiteIntelligence
from contracts.business import Business
from modules.website_intelligence.providers import MockProvider, get_provider
from modules.email_generator import EmailGenerator, build_email_prompt, PROMPT_VERSION, SYSTEM_INSTRUCTION


class TestEmailGenerator(unittest.TestCase):

    def setUp(self):
        self.sample_intel_path = WEBSITES_DATA_DIR / "eliaontheriver_com" / "website_intelligence.json"
        self.sample_business_id = "eliaontheriver_com"

    def test_outreach_email_contract_schema(self):
        """Validates that OutreachEmail enforces required fields and serializes correctly."""
        email = OutreachEmail(
            recipient="info@eliaontheriver.com",
            subject="Quick idea for Elia on the River's website (+ a live prototype)",
            body="Hi Elia on the River,\n\nI built a live preview: https://elia-preview.pages.dev",
            business_id="eliaontheriver_com",
            preview_url="https://elia-preview.pages.dev",
            model="gemini-3.5-flash-lite",
            business_name="Elia on the River",
            key_improvements=["Added dock-and-dine booking flow"],
        )

        data = json.loads(email.model_dump_json())
        self.assertEqual(data["recipient"], "info@eliaontheriver.com")
        self.assertEqual(data["business_id"], "eliaontheriver_com")
        self.assertEqual(data["preview_url"], "https://elia-preview.pages.dev")
        self.assertEqual(data["model"], "gemini-3.5-flash-lite")
        self.assertIn("generated_at", data)
        self.assertEqual(data["subject"], "Quick idea for Elia on the River's website (+ a live prototype)")
        self.assertIn("https://elia-preview.pages.dev", data["body"])

    def test_outreach_email_null_recipient(self):
        """Validates that recipient can be null when no email address is found."""
        email = OutreachEmail(
            recipient=None,
            subject="Website Prototype for Local Business",
            body="Here is your preview link: https://preview.example.com",
            business_id="local_biz",
            preview_url="https://preview.example.com",
            model="gemini-3.5-flash-lite",
        )
        self.assertIsNone(email.recipient)
        dump = json.loads(email.model_dump_json())
        self.assertIsNone(dump["recipient"])

    def test_prompt_builder_contains_rich_context(self):
        """Verifies that the prompt builder injects real business intelligence and instructions."""
        with open(self.sample_intel_path, "r", encoding="utf-8") as f:
            intel_dict = json.load(f)
        intel = WebsiteIntelligence.model_validate(intel_dict)

        biz = Business(
            id="eliaontheriver_com",
            name="Elia on the River",
            email="info@eliaontheriver.com",
            city="Miami",
            state="FL",
        )

        prompt = build_email_prompt(
            intelligence=intel,
            preview_url="https://elia-preview.pages.dev",
            business=biz,
        )

        self.assertIn("Elia on the River", prompt)
        self.assertIn("https://elia-preview.pages.dev", prompt)
        self.assertIn("Miami", prompt)
        self.assertIn("info@eliaontheriver.com", prompt)
        self.assertIn("OUTREACH EMAIL GENERATION REQUEST", prompt)
        self.assertIn("Prompt Version: 1.0.0", prompt)

        # Verify system instructions ban hype/buzzwords
        self.assertIn("NEVER use hype terms", SYSTEM_INSTRUCTION)
        self.assertIn("synergy", SYSTEM_INSTRUCTION.lower())
        self.assertIn("game-changer", SYSTEM_INSTRUCTION.lower())

    def test_generator_end_to_end_with_mock_provider(self):
        """Verifies end-to-end execution of EmailGenerator with MockProvider and saving email.json."""
        mock_p = MockProvider(model_name="mock-gemini-3.5-flash-lite")
        generator = EmailGenerator(provider=mock_p)

        with tempfile.TemporaryDirectory() as tmp_dir:
            out_file = Path(tmp_dir) / "email.json"

            email = generator.generate(
                target=self.sample_intel_path,
                preview_url="https://elia-test-preview.pages.dev",
                recipient="contact@eliaontheriver.com",
                output_path=out_file,
            )

            self.assertIsInstance(email, OutreachEmail)
            self.assertEqual(email.business_id, "eliaontheriver_com")
            self.assertEqual(email.recipient, "contact@eliaontheriver.com")
            self.assertEqual(email.preview_url, "https://elia-test-preview.pages.dev")
            self.assertEqual(email.model, "mock-gemini-3.5-flash-lite")
            self.assertIn("https://elia-test-preview.pages.dev", email.body)
            self.assertTrue(len(email.subject) > 5)

            # Check that file was created and is valid JSON matching the contract
            self.assertTrue(out_file.exists())
            with open(out_file, "r", encoding="utf-8") as f:
                saved_json = json.load(f)

            self.assertEqual(saved_json["business_id"], "eliaontheriver_com")
            self.assertEqual(saved_json["recipient"], "contact@eliaontheriver.com")
            self.assertEqual(saved_json["preview_url"], "https://elia-test-preview.pages.dev")
            self.assertIn("generated_at", saved_json)
            self.assertIn("subject", saved_json)
            self.assertIn("body", saved_json)

    def test_auto_discovery_from_deployment_json(self):
        """Verifies that preview_url is automatically discovered from deployment.json in generated directory."""
        mock_p = MockProvider()
        generator = EmailGenerator(provider=mock_p)

        # aryansharmaswe_vercel_app has a real deployment.json
        aryan_dir = GENERATED_DIR / "aryansharmaswe_vercel_app"
        if aryan_dir.exists() and (aryan_dir / "deployment.json").exists():
            dep_data = json.loads((aryan_dir / "deployment.json").read_text(encoding="utf-8"))
            expected_url = dep_data.get("url")
            with tempfile.TemporaryDirectory() as tmp_dir:
                out_file = Path(tmp_dir) / "email.json"
                email = generator.generate(
                    target=str(aryan_dir),
                    output_path=out_file,
                )
                self.assertEqual(email.business_id, "aryansharmaswe_vercel_app")
                self.assertEqual(email.preview_url, expected_url)
                self.assertIn(expected_url, email.body)


    def test_ensure_preview_url_in_body_injection(self):
        """Verifies that preview_url is safely injected into the body if omitted by LLM draft."""
        generator = EmailGenerator(provider=MockProvider())
        body_without_url = "Hi Team,\n\nI built a redesign.\n\nBest,\nDev"
        url = "https://preview.pages.dev"
        fixed = generator._ensure_preview_url_in_body(body_without_url, url)
        self.assertIn(url, fixed)


if __name__ == "__main__":
    unittest.main()
