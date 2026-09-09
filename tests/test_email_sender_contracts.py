import unittest
from datetime import datetime, timezone
from contracts.email import (
    SenderProviderStatus,
    EmailDeliveryRequest,
    EmailDeliveryResult,
    OutreachEmail,
)


class TestEmailSenderContracts(unittest.TestCase):

    def test_sender_provider_status_contract(self):
        status = SenderProviderStatus(
            provider_name="resend",
            is_configured=True,
            is_exhausted=False,
            daily_limit=100,
            sent_today=15,
            missing_credentials=[],
            description="Resend API Active",
        )
        self.assertEqual(status.provider_name, "resend")
        self.assertTrue(status.is_configured)
        self.assertFalse(status.is_exhausted)
        self.assertEqual(status.daily_limit, 100)
        self.assertEqual(status.sent_today, 15)
        self.assertEqual(status.missing_credentials, [])

        data = status.model_dump()
        self.assertEqual(data["provider_name"], "resend")

    def test_email_delivery_request_contract(self):
        req = EmailDeliveryRequest(
            business_id="eliaontheriver_com",
            recipient="contact@eliaontheriver.com",
            subject="Quick question about Elia's website",
            body="Hello team, love your waterfront restaurant...",
            preview_url="https://elia-preview.pages.dev",
            business_name="Elia on the River",
            from_email="outreach@nayom.com",
            from_name="Nayom Team",
            provider="resend",
            dry_run=True,
            custom_headers={"X-Campaign": "Miami-Restaurants"},
        )
        self.assertEqual(req.business_id, "eliaontheriver_com")
        self.assertEqual(req.recipient, "contact@eliaontheriver.com")
        self.assertTrue(req.dry_run)
        self.assertEqual(req.custom_headers["X-Campaign"], "Miami-Restaurants")

        # Test defaults
        minimal_req = EmailDeliveryRequest(
            business_id="test_biz",
            subject="Hello",
            body="Test body",
        )
        self.assertIsNone(minimal_req.recipient)
        self.assertFalse(minimal_req.dry_run)
        self.assertEqual(minimal_req.custom_headers, {})

    def test_email_delivery_result_contract(self):
        now_iso = datetime.now(timezone.utc).isoformat()
        res = EmailDeliveryResult(
            business_id="eliaontheriver_com",
            recipient="contact@eliaontheriver.com",
            provider="resend",
            message_id="resend-msg-12345",
            status="sent",
            sent_at=now_iso,
            duration_seconds=0.45,
            warnings=["Initial provider was skipped due to missing token"],
            attempts=2,
        )
        self.assertEqual(res.business_id, "eliaontheriver_com")
        self.assertEqual(res.status, "sent")
        self.assertEqual(res.provider, "resend")
        self.assertEqual(res.message_id, "resend-msg-12345")
        self.assertEqual(res.attempts, 2)
        self.assertIsNone(res.error)
        self.assertEqual(len(res.warnings), 1)

        # Test JSON serialization and deserialization
        json_str = res.model_dump_json()
        self.assertIn("resend-msg-12345", json_str)
        reloaded = EmailDeliveryResult.model_validate_json(json_str)
        self.assertEqual(reloaded.business_id, "eliaontheriver_com")


if __name__ == "__main__":
    unittest.main()
