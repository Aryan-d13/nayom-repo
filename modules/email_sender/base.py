import abc
import re
import html
import logging
from typing import Optional, List
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

from contracts.email import EmailDeliveryRequest, EmailDeliveryResult, SenderProviderStatus

logger = logging.getLogger(__name__)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_valid_email(email: Optional[str]) -> bool:
    """Validates basic syntax of an email address."""
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def build_mime_message(
    request: EmailDeliveryRequest,
    from_email: str,
    from_name: Optional[str] = None,
) -> MIMEMultipart:
    """
    Constructs a standardized multipart MIME email object (plain text + HTML).
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = request.subject
    
    # Set From header
    if from_name:
        msg["From"] = formataddr((from_name, from_email))
    else:
        msg["From"] = from_email

    msg["To"] = request.recipient or ""

    # Attach custom headers if provided
    for key, value in request.custom_headers.items():
        if key.lower() not in ("subject", "from", "to"):
            msg[key] = value

    # Plain text content
    text_content = request.body.strip()
    part_text = MIMEText(text_content, "plain", "utf-8")
    msg.attach(part_text)

    # HTML content
    escaped_body = html.escape(request.body.strip())
    # Format line breaks and paragraphs
    formatted_html = "<br><br>".join(
        p.replace("\n", "<br>") for p in escaped_body.split("\n\n")
    )

    # Add interactive preview button if preview_url is present
    preview_button_html = ""
    if request.preview_url:
        preview_button_html = f"""
        <div style="margin: 24px 0;">
            <a href="{html.escape(request.preview_url)}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Live Preview
            </a>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff; padding: 16px;">
        <div>{formatted_html}</div>
        {preview_button_html}
    </body>
    </html>
    """.strip()

    part_html = MIMEText(html_content, "html", "utf-8")
    msg.attach(part_html)

    return msg


class EmailSenderProvider(abc.ABC):
    """
    Abstract base class for all email delivery adapters.
    
    Encapsulates credential verification, payload formatting, rate-limit checking,
    and platform-specific transmission mechanics.
    """

    @property
    @abc.abstractmethod
    def provider_name(self) -> str:
        """Unique provider identifier (e.g. 'resend', 'sendgrid', 'gmail', 'outlook', 'smtp', 'mock')."""
        pass

    @property
    @abc.abstractmethod
    def default_daily_limit(self) -> int:
        """Default documented daily sending quota for this provider."""
        pass

    @abc.abstractmethod
    def is_available(self) -> SenderProviderStatus:
        """
        Checks whether the provider has required credentials configured
        and reports current availability.
        """
        pass

    @abc.abstractmethod
    def send(self, email: EmailDeliveryRequest) -> EmailDeliveryResult:
        """
        Transmits the outreach email through the provider.
        
        Args:
            email: Standardized EmailDeliveryRequest contract.
            
        Returns:
            EmailDeliveryResult containing delivery status, message ID, and metadata.
        """
        pass
