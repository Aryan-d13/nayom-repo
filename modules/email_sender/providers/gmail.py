import os
import time
import uuid
import smtplib
import logging
from typing import Optional, List
from datetime import datetime, timezone

from contracts.email import EmailDeliveryRequest, EmailDeliveryResult, SenderProviderStatus
from modules.email_sender.base import EmailSenderProvider, build_mime_message, is_valid_email
from config.settings import DEFAULT_FROM_NAME, DEFAULT_GMAIL_DAILY_LIMIT

logger = logging.getLogger(__name__)


class GmailSmtpEmailProvider(EmailSenderProvider):
    """
    Google Gmail SMTP delivery adapter.
    Requires Google App Password with 2-Step Verification enabled on the Google Account.
    Host: smtp.gmail.com:587 (STARTTLS)
    """

    SMTP_HOST = "smtp.gmail.com"
    SMTP_PORT = 587

    def __init__(
        self,
        username: Optional[str] = None,
        app_password: Optional[str] = None,
        from_name: Optional[str] = None,
        daily_limit: Optional[int] = None,
    ):
        self.username = username if username is not None else os.environ.get("GMAIL_USER", os.environ.get("GMAIL_EMAIL", ""))
        self.app_password = app_password if app_password is not None else os.environ.get("GMAIL_APP_PASSWORD", os.environ.get("GMAIL_PASSWORD", ""))
        self.from_name = from_name if from_name is not None else os.environ.get("GMAIL_FROM_NAME", DEFAULT_FROM_NAME)
        self.daily_limit_override = daily_limit or DEFAULT_GMAIL_DAILY_LIMIT

    @property
    def provider_name(self) -> str:
        return "gmail"

    @property
    def default_daily_limit(self) -> int:
        return self.daily_limit_override

    def is_available(self) -> SenderProviderStatus:
        missing = []
        if not self.username or "your_" in self.username.lower() or "xxx" in self.username.lower():
            missing.append("GMAIL_USER")
        if not self.app_password or "your_" in self.app_password.lower() or "xxx" in self.app_password.lower():
            missing.append("GMAIL_APP_PASSWORD")


        is_conf = len(missing) == 0
        desc = f"Configured for Gmail SMTP ({self.username})" if is_conf else f"Missing credentials: {', '.join(missing)}"

        return SenderProviderStatus(
            provider_name=self.provider_name,
            is_configured=is_conf,
            daily_limit=self.default_daily_limit,
            missing_credentials=missing,
            description=desc,
        )


    def send(self, email: EmailDeliveryRequest) -> EmailDeliveryResult:
        start_time = time.time()

        if not email.recipient or not is_valid_email(email.recipient):
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                status="skipped",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=round(time.time() - start_time, 3),
                warnings=["Recipient email is missing or invalid"],
            )

        status_check = self.is_available()
        if not status_check.is_configured:
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                status="failed",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=round(time.time() - start_time, 3),
                error=f"Gmail SMTP provider not configured: {', '.join(status_check.missing_credentials)}",
            )

        from_addr = email.from_email or self.username
        from_name = email.from_name or self.from_name

        mime_msg = build_mime_message(email, from_email=from_addr, from_name=from_name)
        msg_id = f"gmail-{uuid.uuid4().hex[:12]}"

        try:
            server = smtplib.SMTP(self.SMTP_HOST, self.SMTP_PORT, timeout=20)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(self.username, self.app_password)
            server.send_message(mime_msg)
            server.quit()

            duration = round(time.time() - start_time, 3)
            logger.info("Successfully sent email to %s via Gmail SMTP", email.recipient)
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                message_id=msg_id,
                status="sent",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=duration,
            )
        except Exception as e:
            duration = round(time.time() - start_time, 3)
            logger.error("Gmail SMTP transmission failed: %s", e)
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                status="failed",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=duration,
                error=str(e),
            )
