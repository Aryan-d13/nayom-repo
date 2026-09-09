import unittest
from unittest.mock import MagicMock, patch
import json
import requests

from contracts.email import EmailDeliveryRequest, EmailDeliveryResult, SenderProviderStatus
from modules.email_sender.base import is_valid_email, build_mime_message
from modules.email_sender.providers.smtp import SmtpEmailProvider
from modules.email_sender.providers.resend import ResendEmailProvider
from modules.email_sender.providers.sendgrid import SendGridEmailProvider
from modules.email_sender.providers.gmail import GmailSmtpEmailProvider
from modules.email_sender.providers.outlook import OutlookSmtpEmailProvider
from modules.email_sender.providers.mock import MockEmailSenderProvider


class TestEmailProviders(unittest.TestCase):

    def test_email_validation_helper(self):
        self.assertTrue(is_valid_email("test@example.com"))
        self.assertTrue(is_valid_email("user.name+tag@domain.co.uk"))
        self.assertFalse(is_valid_email(""))
        self.assertFalse(is_valid_email(None))
        self.assertFalse(is_valid_email("invalid-email"))
        self.assertFalse(is_valid_email("@missinguser.com"))
        self.assertFalse(is_valid_email("user@.com"))

    def test_mime_message_builder(self):
        req = EmailDeliveryRequest(
            business_id="elia_test",
            recipient="contact@example.com",
            subject="Test Subject Line",
            body="Hello world,\n\nThis is paragraph two.",
            preview_url="https://preview.local/elia",
            custom_headers={"X-Test": "Value123"},
        )
        msg = build_mime_message(req, from_email="outreach@nayom.com", from_name="Nayom Team")
        self.assertEqual(msg["Subject"], "Test Subject Line")
        self.assertIn("Nayom Team", msg["From"])
        self.assertIn("outreach@nayom.com", msg["From"])
        self.assertEqual(msg["To"], "contact@example.com")
        self.assertEqual(msg["X-Test"], "Value123")

        # Check payload parts (plain text + html)
        parts = msg.get_payload()
        self.assertEqual(len(parts), 2)
        plain = parts[0].get_payload(decode=True).decode("utf-8")
        html = parts[1].get_payload(decode=True).decode("utf-8")
        self.assertIn("Hello world", plain)
        self.assertIn("https://preview.local/elia", html)

    def test_mock_provider(self):
        mock_p = MockEmailSenderProvider()
        status = mock_p.is_available()
        self.assertTrue(status.is_configured)
        self.assertEqual(status.provider_name, "mock")

        # Test valid send
        req = EmailDeliveryRequest(
            business_id="biz_mock",
            recipient="mock@test.com",
            subject="Hello",
            body="Content",
        )
        res = mock_p.send(req)
        self.assertEqual(res.status, "sent")
        self.assertIn("mock-msg-", res.message_id)

        # Test dry-run send
        req_dry = EmailDeliveryRequest(
            business_id="biz_mock",
            recipient="mock@test.com",
            subject="Hello",
            body="Content",
            dry_run=True,
        )
        res_dry = mock_p.send(req_dry)
        self.assertEqual(res_dry.status, "dry_run")

        # Test simulated failure
        failing_mock = MockEmailSenderProvider(should_fail=True, failure_message="Simulated error")
        res_fail = failing_mock.send(req)
        self.assertEqual(res_fail.status, "failed")
        self.assertEqual(res_fail.error, "Simulated error")

    def test_smtp_provider_availability_and_missing_recipient(self):
        # Empty host -> unconfigured
        p_unconf = SmtpEmailProvider(host="")
        st = p_unconf.is_available()
        self.assertFalse(st.is_configured)
        self.assertIn("SMTP_HOST", st.missing_credentials)

        # Configured host
        p_conf = SmtpEmailProvider(host="smtp.example.com", port=587, username="u", password="p")
        self.assertTrue(p_conf.is_available().is_configured)

        # Missing recipient skips
        req_no_recip = EmailDeliveryRequest(business_id="test", recipient="", subject="Hi", body="Text")
        res_skip = p_conf.send(req_no_recip)
        self.assertEqual(res_skip.status, "skipped")

    @patch("smtplib.SMTP")
    def test_smtp_provider_successful_send(self, mock_smtp_cls):
        mock_server = MagicMock()
        mock_smtp_cls.return_value = mock_server

        p = SmtpEmailProvider(host="smtp.example.com", port=587, username="u", password="p")
        req = EmailDeliveryRequest(
            business_id="biz_smtp",
            recipient="hello@example.com",
            subject="Subject",
            body="Body content",
        )
        res = p.send(req)
        self.assertEqual(res.status, "sent")
        self.assertIn("smtp-", res.message_id)
        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once_with("u", "p")
        mock_server.send_message.assert_called_once()
        mock_server.quit.assert_called_once()

    def test_resend_provider_availability(self):
        # Missing key
        r_unconf = ResendEmailProvider(api_key="")
        st = r_unconf.is_available()
        self.assertFalse(st.is_configured)
        self.assertIn("RESEND_API_KEY", st.missing_credentials)

        # Configured key
        r_conf = ResendEmailProvider(api_key="re_123456789")
        self.assertTrue(r_conf.is_available().is_configured)
        self.assertEqual(r_conf.default_daily_limit, 100)

    def test_resend_provider_send_success_and_error(self):
        mock_session = MagicMock(spec=requests.Session)
        
        # Test success 200 response
        mock_resp_success = MagicMock()
        mock_resp_success.status_code = 200
        mock_resp_success.json.return_value = {"id": "resend_id_999"}
        mock_session.post.return_value = mock_resp_success

        r_provider = ResendEmailProvider(api_key="re_test", session=mock_session)
        req = EmailDeliveryRequest(
            business_id="elia_biz",
            recipient="triinu@eliaontheriver.com",
            subject="Personalized site upgrade",
            body="Hi Triinu, here is your preview.",
            preview_url="https://elia-preview.pages.dev",
        )
        res = r_provider.send(req)
        self.assertEqual(res.status, "sent")
        self.assertEqual(res.message_id, "resend_id_999")

        # Test error 422 response
        mock_resp_err = MagicMock()
        mock_resp_err.status_code = 422
        mock_resp_err.text = "Unverified sender domain"
        mock_session.post.return_value = mock_resp_err

        res_err = r_provider.send(req)
        self.assertEqual(res_err.status, "failed")
        self.assertIn("Unverified sender domain", res_err.error)

    def test_sendgrid_provider_availability(self):
        sg_unconf = SendGridEmailProvider(api_key="")
        st = sg_unconf.is_available()
        self.assertFalse(st.is_configured)
        self.assertIn("SENDGRID_API_KEY", st.missing_credentials)

        sg_conf = SendGridEmailProvider(api_key="SG.123456789")
        self.assertTrue(sg_conf.is_available().is_configured)
        self.assertEqual(sg_conf.default_daily_limit, 100)

    def test_sendgrid_provider_send_success_202(self):
        mock_session = MagicMock(spec=requests.Session)
        mock_resp = MagicMock()
        mock_resp.status_code = 202
        mock_resp.headers = {"X-Message-Id": "sg_msg_id_777"}
        mock_session.post.return_value = mock_resp

        sg_p = SendGridEmailProvider(api_key="SG.test", session=mock_session)
        req = EmailDeliveryRequest(
            business_id="elia_biz",
            recipient="test@example.com",
            subject="Subject",
            body="Body",
        )
        res = sg_p.send(req)
        self.assertEqual(res.status, "sent")
        self.assertEqual(res.message_id, "sg_msg_id_777")

    def test_gmail_provider_availability(self):
        gm_unconf = GmailSmtpEmailProvider(username="", app_password="")
        st = gm_unconf.is_available()
        self.assertFalse(st.is_configured)
        self.assertIn("GMAIL_USER", st.missing_credentials)
        self.assertIn("GMAIL_APP_PASSWORD", st.missing_credentials)

        gm_conf = GmailSmtpEmailProvider(username="user@gmail.com", app_password="abcd efgh ijkl mnop")
        self.assertTrue(gm_conf.is_available().is_configured)
        self.assertEqual(gm_conf.default_daily_limit, 500)

    @patch("smtplib.SMTP")
    def test_gmail_provider_send_success(self, mock_smtp_cls):
        mock_server = MagicMock()
        mock_smtp_cls.return_value = mock_server

        gm = GmailSmtpEmailProvider(username="outreach@gmail.com", app_password="app_password_123")
        req = EmailDeliveryRequest(
            business_id="gmail_biz",
            recipient="target@client.com",
            subject="Greeting",
            body="Hello from Nayom",
        )
        res = gm.send(req)
        self.assertEqual(res.status, "sent")
        self.assertIn("gmail-", res.message_id)
        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once_with("outreach@gmail.com", "app_password_123")

    def test_outlook_provider_availability(self):
        ot_unconf = OutlookSmtpEmailProvider(username="", password="")
        st = ot_unconf.is_available()
        self.assertFalse(st.is_configured)
        self.assertIn("OUTLOOK_USER", st.missing_credentials)
        self.assertIn("OUTLOOK_APP_PASSWORD", st.missing_credentials)

        ot_conf = OutlookSmtpEmailProvider(username="user@outlook.com", password="pass")
        self.assertTrue(ot_conf.is_available().is_configured)
        self.assertEqual(ot_conf.default_daily_limit, 300)


if __name__ == "__main__":
    unittest.main()
