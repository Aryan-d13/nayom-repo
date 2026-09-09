import time
import uuid
import logging
from typing import Optional, List
from datetime import datetime, timezone

from contracts.email import EmailDeliveryRequest, EmailDeliveryResult, SenderProviderStatus
from modules.email_sender.base import EmailSenderProvider, is_valid_email

logger = logging.getLogger(__name__)


class MockEmailSenderProvider(EmailSenderProvider):
    """
    Mock email sender provider for testing, sandbox execution, and offline environments.
    """

    def __init__(self, should_fail: bool = False, failure_message: str = "Simulated mock transmission failure"):
        self._should_fail = should_fail
        self._failure_message = failure_message
        self.sent_requests: List[EmailDeliveryRequest] = []

    @property
    def provider_name(self) -> str:
        return "mock"

    @property
    def default_daily_limit(self) -> int:
        return 10000

    def is_available(self) -> SenderProviderStatus:
        return SenderProviderStatus(
            provider_name=self.provider_name,
            is_configured=True,
            daily_limit=self.default_daily_limit,
            missing_credentials=[],
            description="Mock email sender provider (always active)",
        )

    def send(self, email: EmailDeliveryRequest) -> EmailDeliveryResult:
        start_time = time.time()
        self.sent_requests.append(email)

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

        if self._should_fail:
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                status="failed",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=round(time.time() - start_time, 3),
                error=self._failure_message,
            )

        status = "dry_run" if email.dry_run else "sent"
        msg_id = f"mock-msg-{uuid.uuid4().hex[:12]}"
        logger.info("[MOCK SENDER] Processed email for %s (%s)", email.recipient, status)

        return EmailDeliveryResult(
            business_id=email.business_id,
            recipient=email.recipient,
            provider=self.provider_name,
            message_id=msg_id,
            status=status,
            sent_at=datetime.now(timezone.utc).isoformat(),
            duration_seconds=round(time.time() - start_time, 3),
        )
