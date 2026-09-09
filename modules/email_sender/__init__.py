"""
Email Sender Module for Nayom-Automation.

Provides multi-provider email delivery, round-robin rotation, quota tracking,
local suppression/unsubscribe management, dry-run safety, and delivery outcome persistence.
"""

from contracts.email import (
    EmailDeliveryRequest,
    EmailDeliveryResult,
    SenderProviderStatus,
)
from .base import EmailSenderProvider, is_valid_email, build_mime_message
from .suppression import SuppressionList
from .manager import EmailSenderManager, DEFAULT_ROTATION_ORDER
from .providers.smtp import SmtpEmailProvider
from .providers.resend import ResendEmailProvider
from .providers.sendgrid import SendGridEmailProvider
from .providers.gmail import GmailSmtpEmailProvider
from .providers.outlook import OutlookSmtpEmailProvider
from .providers.mock import MockEmailSenderProvider

__all__ = [
    "EmailDeliveryRequest",
    "EmailDeliveryResult",
    "SenderProviderStatus",
    "EmailSenderProvider",
    "is_valid_email",
    "build_mime_message",
    "SuppressionList",
    "EmailSenderManager",
    "DEFAULT_ROTATION_ORDER",
    "SmtpEmailProvider",
    "ResendEmailProvider",
    "SendGridEmailProvider",
    "GmailSmtpEmailProvider",
    "OutlookSmtpEmailProvider",
    "MockEmailSenderProvider",
]
