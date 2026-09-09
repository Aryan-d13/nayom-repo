"""Email Sender Provider Adapters."""
from .smtp import SmtpEmailProvider
from .resend import ResendEmailProvider
from .sendgrid import SendGridEmailProvider
from .gmail import GmailSmtpEmailProvider
from .outlook import OutlookSmtpEmailProvider
from .mock import MockEmailSenderProvider

__all__ = [
    "SmtpEmailProvider",
    "ResendEmailProvider",
    "SendGridEmailProvider",
    "GmailSmtpEmailProvider",
    "OutlookSmtpEmailProvider",
    "MockEmailSenderProvider",
]
