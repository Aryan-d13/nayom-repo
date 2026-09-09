import os
import time
import uuid
import smtplib
import logging
from typing import Optional, List
from datetime import datetime, timezone

from contracts.email import EmailDeliveryRequest, EmailDeliveryResult, SenderProviderStatus
from modules.email_sender.base import EmailSenderProvider, build_mime_message, is_valid_email
from config.settings import DEFAULT_FROM_EMAIL, DEFAULT_FROM_NAME, DEFAULT_SMTP_DAILY_LIMIT

logger = logging.getLogger(__name__)


class SmtpEmailProvider(EmailSenderProvider):
    """
    Standard generic SMTP provider supporting STARTTLS and SSL connections.
    """

    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        username: Optional[str] = None,
        password: Optional[str] = None,
        use_tls: Optional[bool] = None,
        use_ssl: Optional[bool] = None,
        from_email: Optional[str] = None,
        from_name: Optional[str] = None,
        daily_limit: Optional[int] = None,
    ):
        self.host = host if host is not None else os.environ.get("SMTP_HOST", "")
        self.port = int(port or os.environ.get("SMTP_PORT", "587"))
        self.username = username if username is not None else os.environ.get("SMTP_USER", "")
        self.password = password if password is not None else os.environ.get("SMTP_PASSWORD", os.environ.get("SMTP_PASS", ""))
        
        use_tls_env = os.environ.get("SMTP_USE_TLS", "true").lower() in ("true", "1", "yes")
        self.use_tls = use_tls if use_tls is not None else use_tls_env
        
        use_ssl_env = os.environ.get("SMTP_USE_SSL", "false").lower() in ("true", "1", "yes")
        self.use_ssl = use_ssl if use_ssl is not None else use_ssl_env

        self.from_email = from_email if from_email is not None else os.environ.get("SMTP_FROM_EMAIL", DEFAULT_FROM_EMAIL)
        self.from_name = from_name if from_name is not None else os.environ.get("SMTP_FROM_NAME", DEFAULT_FROM_NAME)
        self.daily_limit_override = daily_limit or DEFAULT_SMTP_DAILY_LIMIT

    @property
    def provider_name(self) -> str:
        return "smtp"

    @property
    def default_daily_limit(self) -> int:
        return self.daily_limit_override

    def is_available(self) -> SenderProviderStatus:
        missing = []
        if not self.host or "yourhost" in self.host.lower() or "your_" in self.host.lower():
            missing.append("SMTP_HOST")
        
        is_conf = len(missing) == 0
        desc = "Configured for custom SMTP host" if is_conf else f"Missing credentials: {', '.join(missing)}"

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
                error=f"SMTP provider not configured: {', '.join(status_check.missing_credentials)}",
            )

        from_addr = email.from_email or self.from_email
        from_name = email.from_name or self.from_name

        mime_msg = build_mime_message(email, from_email=from_addr, from_name=from_name)
        msg_id = f"smtp-{uuid.uuid4().hex[:12]}"

        try:
            if self.use_ssl:
                server = smtplib.SMTP_SSL(self.host, self.port, timeout=20)
            else:
                server = smtplib.SMTP(self.host, self.port, timeout=20)
                if self.use_tls:
                    server.starttls()

            if self.username and self.password:
                server.login(self.username, self.password)

            server.send_message(mime_msg)
            server.quit()

            duration = round(time.time() - start_time, 3)
            logger.info("Successfully sent email to %s via SMTP (%s)", email.recipient, self.host)
            
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
            logger.error("Failed to send email via SMTP: %s", e)
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                status="failed",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=duration,
                error=str(e),
            )
