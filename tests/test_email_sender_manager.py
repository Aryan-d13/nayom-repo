import unittest
import json
import tempfile
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

from contracts.email import (
    OutreachEmail,
    EmailDeliveryRequest,
    EmailDeliveryResult,
    SenderProviderStatus,
)
from modules.email_sender.base import EmailSenderProvider
from modules.email_sender.suppression import SuppressionList
from modules.email_sender.manager import EmailSenderManager
from modules.email_sender.providers.mock import MockEmailSenderProvider


class DummyTestSenderProvider(EmailSenderProvider):
    def __init__(
        self,
        name: str,
        configured: bool = True,
        should_fail: bool = False,
        daily_limit: int = 100,
    ):
        self._name = name
        self._configured = configured
        self._should_fail = should_fail
        self._daily_limit = daily_limit
        self.sent_count = 0

    @property
    def provider_name(self) -> str:
        return self._name

    @property
    def default_daily_limit(self) -> int:
        return self._daily_limit

    def is_available(self) -> SenderProviderStatus:
        return SenderProviderStatus(
            provider_name=self._name,
            is_configured=self._configured,
            daily_limit=self._daily_limit,
            missing_credentials=[] if self._configured else ["TEST_API_KEY"],
            description=f"Dummy provider {self._name}",
        )

    def send(self, email: EmailDeliveryRequest) -> EmailDeliveryResult:
        if self._should_fail:
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self._name,
                status="failed",
                error=f"{self._name} simulated dispatch error",
            )
        self.sent_count += 1
        return EmailDeliveryResult(
            business_id=email.business_id,
            recipient=email.recipient,
            provider=self._name,
            message_id=f"{self._name}-msg-{self.sent_count}",
            status="dry_run" if email.dry_run else "sent",
        )


class TestEmailSenderManager(unittest.TestCase):

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.base_dir = Path(self.tmp_dir.name)
        self.state_file = self.base_dir / "test_email_state.json"
        self.suppression_file = self.base_dir / "test_suppression.json"

        # Create sample business directory with email.json
        self.biz_dir = self.base_dir / "generated" / "elia_test"
        self.biz_dir.mkdir(parents=True)
        self.email_payload = {
            "business_id": "elia_test",
            "recipient": "contact@elia.test",
            "subject": "Personalized Website Upgrade",
            "body": "Hello Elia team, check out your preview.",
            "preview_url": "https://elia-preview.pages.dev",
            "business_name": "Elia Test",
            "model": "gemini-3.5-flash-lite",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
        self.email_json_path = self.biz_dir / "email.json"
        with open(self.email_json_path, "w", encoding="utf-8") as f:
            json.dump(self.email_payload, f, indent=2)

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_suppression_list_crud(self):
        supp = SuppressionList(self.suppression_file)
        self.assertFalse(supp.is_suppressed("optout@example.com"))

        # Add to suppression
        added = supp.add("optout@example.com", reason="unsubscribed")
        self.assertTrue(added)
        self.assertTrue(supp.is_suppressed("optout@example.com"))
        self.assertTrue(supp.is_suppressed("OPTOUT@EXAMPLE.COM "))

        # Duplicate add returns False
        self.assertFalse(supp.add("optout@example.com"))

        # Remove
        self.assertTrue(supp.remove("optout@example.com"))
        self.assertFalse(supp.is_suppressed("optout@example.com"))

    def test_round_robin_rotation(self):
        p1 = DummyTestSenderProvider("prov_a")
        p2 = DummyTestSenderProvider("prov_b")
        p3 = DummyTestSenderProvider("prov_c")

        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"prov_a": p1, "prov_b": p2, "prov_c": p3, "mock": MockEmailSenderProvider()},
            rotation_order=["prov_a", "prov_b", "prov_c"],
        )

        # 1st send -> prov_a
        res1 = manager.send(self.email_json_path)
        self.assertEqual(res1.provider, "prov_a")
        self.assertEqual(res1.status, "sent")

        # 2nd send -> prov_b
        res2 = manager.send(self.email_json_path)
        self.assertEqual(res2.provider, "prov_b")

        # 3rd send -> prov_c
        res3 = manager.send(self.email_json_path)
        self.assertEqual(res3.provider, "prov_c")

        # 4th send -> wraps around to prov_a
        res4 = manager.send(self.email_json_path)
        self.assertEqual(res4.provider, "prov_a")

        # Verify state file persistence
        with open(self.state_file, "r", encoding="utf-8") as f:
            state_data = json.load(f)
        self.assertEqual(state_data["total_sent_count"], 4)
        self.assertEqual(state_data["last_used_provider"], "prov_a")
        self.assertEqual(state_data["provider_daily_usage"]["prov_a"]["sent_today"], 2)

    def test_quota_exhaustion_skipping(self):
        # prov_a limit is 1, prov_b limit is 5
        p1 = DummyTestSenderProvider("prov_a", daily_limit=1)
        p2 = DummyTestSenderProvider("prov_b", daily_limit=5)

        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"prov_a": p1, "prov_b": p2, "mock": MockEmailSenderProvider()},
            rotation_order=["prov_a", "prov_b"],
        )

        # 1st send -> prov_a (usage now 1/1)
        res1 = manager.send(self.email_json_path)
        self.assertEqual(res1.provider, "prov_a")

        # 2nd send -> prov_b (prov_a exhausted, prov_b used)
        res2 = manager.send(self.email_json_path)
        self.assertEqual(res2.provider, "prov_b")

        # 3rd send -> prov_a still exhausted -> skips to prov_b
        res3 = manager.send(self.email_json_path)
        self.assertEqual(res3.provider, "prov_b")

    def test_automatic_fallback_on_unconfigured_and_failed_providers(self):
        p1 = DummyTestSenderProvider("unconfigured_prov", configured=False)
        p2 = DummyTestSenderProvider("failing_prov", should_fail=True)
        p3 = DummyTestSenderProvider("working_prov")

        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={
                "unconfigured_prov": p1,
                "failing_prov": p2,
                "working_prov": p3,
                "mock": MockEmailSenderProvider(),
            },
            rotation_order=["unconfigured_prov", "failing_prov", "working_prov"],
        )

        res = manager.send(self.email_json_path)
        self.assertEqual(res.status, "sent")
        self.assertEqual(res.provider, "working_prov")
        self.assertEqual(res.attempts, 3)
        self.assertTrue(any("unconfigured" in w.lower() for w in res.warnings))
        self.assertTrue(any("failing_prov" in w.lower() for w in res.warnings))

    def test_suppression_and_force_override(self):
        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"mock": MockEmailSenderProvider()},
            rotation_order=["mock"],
        )

        # Suppress the recipient
        manager.suppression_list.add("contact@elia.test", reason="complained")

        # Regular send should be skipped
        res_skipped = manager.send(self.email_json_path, force=False)
        self.assertEqual(res_skipped.status, "skipped")
        self.assertTrue(any("suppression" in w.lower() for w in res_skipped.warnings))

        # Force send should bypass suppression
        res_forced = manager.send(self.email_json_path, force=True)
        self.assertEqual(res_forced.status, "sent")

    def test_missing_recipient_skips_safely(self):
        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"mock": MockEmailSenderProvider()},
        )

        # Missing recipient
        req = EmailDeliveryRequest(
            business_id="no_recip_biz",
            recipient=None,
            subject="Hello",
            body="Text",
        )
        res = manager.send(req)
        self.assertEqual(res.status, "skipped")
        self.assertIn("missing", res.warnings[0].lower())

    def test_no_silent_mock_fallback_on_live_failure(self):
        failing_p = DummyTestSenderProvider("failing_live", should_fail=True)
        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"failing_live": failing_p, "mock": MockEmailSenderProvider()},
            rotation_order=["failing_live"],
        )

        req = EmailDeliveryRequest(
            business_id="biz_live_test",
            recipient="test@example.com",
            subject="Hello",
            body="Text",
            dry_run=False,
        )
        res = manager.send(req)
        # Should record failure, NOT silent mock success
        self.assertEqual(res.status, "failed")
        self.assertEqual(res.provider, "none")
        self.assertIn("failed", res.error.lower())

    def test_dry_run_mode_and_delivery_json_output(self):
        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"mock": MockEmailSenderProvider()},
            rotation_order=["mock"],
        )

        res = manager.send(self.email_json_path, dry_run=True)
        self.assertEqual(res.status, "dry_run")

        # Verify email_delivery.json was written in business directory
        deliv_file = self.biz_dir / "email_delivery.json"
        self.assertTrue(deliv_file.exists())
        with open(deliv_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data["business_id"], "elia_test")
        self.assertEqual(data["status"], "dry_run")
        self.assertEqual(data["provider"], "mock")

    def test_quota_date_rollover_reset(self):
        # Setup initial state with past date and full quota
        past_state = {
            "current_index": 0,
            "last_used_provider": "prov_a",
            "last_sent_at": "2026-08-01T00:00:00Z",
            "total_sent_count": 10,
            "today_date": "2026-08-01",
            "provider_daily_usage": {
                "prov_a": {"sent_today": 100, "last_reset_date": "2026-08-01"}
            }
        }
        with open(self.state_file, "w", encoding="utf-8") as f:
            json.dump(past_state, f)

        p1 = DummyTestSenderProvider("prov_a", daily_limit=100)
        manager = EmailSenderManager(
            state_file=self.state_file,
            suppression_file=self.suppression_file,
            providers={"prov_a": p1},
            rotation_order=["prov_a"],
        )

        # Loading state should detect new date and reset quota
        loaded_state = manager._load_state()
        self.assertNotEqual(loaded_state["today_date"], "2026-08-01")
        self.assertEqual(loaded_state["provider_daily_usage"]["prov_a"]["sent_today"], 0)

        # Provider statuses should report 0 sent today and not exhausted
        statuses = manager.get_provider_statuses()
        self.assertEqual(statuses[0].sent_today, 0)
        self.assertFalse(statuses[0].is_exhausted)

    def test_send_all_batch_execution(self):
        # Create a second business directory in GENERATED_DIR
        import modules.email_sender.manager as mgr_mod
        orig_gen = mgr_mod.GENERATED_DIR
        mock_gen_dir = self.base_dir / "generated"
        mgr_mod.GENERATED_DIR = mock_gen_dir

        biz2 = mock_gen_dir / "biz_two"
        biz2.mkdir(parents=True, exist_ok=True)
        with open(biz2 / "email.json", "w", encoding="utf-8") as f:
            json.dump({
                "business_id": "biz_two",
                "recipient": "biz2@example.com",
                "subject": "Upgrade 2",
                "body": "Body 2",
                "preview_url": "https://biz2.preview.dev",
                "model": "gemini-3.5-flash-lite",
                "generated_at": datetime.now(timezone.utc).isoformat(),
            }, f)

        try:
            manager = EmailSenderManager(
                state_file=self.state_file,
                suppression_file=self.suppression_file,
                providers={"mock": MockEmailSenderProvider()},
                rotation_order=["mock"],
            )

            # Run send_all with dry_run
            results = manager.send_all(dry_run=True, delay_seconds=0.01)
            self.assertEqual(len(results), 2)
            self.assertTrue(all(r.status == "dry_run" for r in results))

            # Running send_all again without force skips already processed
            results_cached = manager.send_all(force=False, delay_seconds=0.01)
            self.assertEqual(len(results_cached), 2)
        finally:
            mgr_mod.GENERATED_DIR = orig_gen


if __name__ == "__main__":
    unittest.main()

