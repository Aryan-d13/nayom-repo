import os
import time
import html
import uuid
import logging
import requests
from typing import Optional, List
from datetime import datetime, timezone

from contracts.email import EmailDeliveryRequest, EmailDeliveryResult, SenderProviderStatus
from modules.email_sender.base import EmailSenderProvider, is_valid_email
from config.settings import DEFAULT_FROM_EMAIL, DEFAULT_FROM_NAME, DEFAULT_SENDGRID_DAILY_LIMIT

logger = logging.getLogger(__name__)


class SendGridEmailProvider(EmailSenderProvider):
    """
    Twilio SendGrid v3 Mail Send API delivery adapter.
    Documentation: https://docs.sendgrid.com/api-reference/mail-send/mail-send
    """

    API_URL = "https://api.sendgrid.com/v3/mail/send"

    def __init__(
        self,
        api_key: Optional[str] = None,
        from_email: Optional[str] = None,
        from_name: Optional[str] = None,
        daily_limit: Optional[int] = None,
        session: Optional[requests.Session] = None,
    ):
        self.api_key = api_key if api_key is not None else os.environ.get("SENDGRID_API_KEY", "")
        self.from_email = from_email if from_email is not None else os.environ.get("SENDGRID_FROM_EMAIL", DEFAULT_FROM_EMAIL)
        self.from_name = from_name if from_name is not None else os.environ.get("SENDGRID_FROM_NAME", DEFAULT_FROM_NAME)
        self.daily_limit_override = daily_limit or DEFAULT_SENDGRID_DAILY_LIMIT
        self._session = session or requests.Session()

    @property
    def provider_name(self) -> str:
        return "sendgrid"

    @property
    def default_daily_limit(self) -> int:
        return self.daily_limit_override

    def is_available(self) -> SenderProviderStatus:
        missing = []
        if not self.api_key or "your_" in self.api_key.lower() or "xxx" in self.api_key.lower():
            missing.append("SENDGRID_API_KEY")

        is_conf = len(missing) == 0
        desc = "Configured via SendGrid API key" if is_conf else f"Missing credentials: {', '.join(missing)}"

        return SenderProviderStatus(
            provider_name=self.provider_name,
            is_configured=is_conf,
            daily_limit=self.default_daily_limit,
            missing_credentials=missing,
            description=desc,
        )


    def _build_html_body(self, email: EmailDeliveryRequest) -> str:
        escaped = html.escape(email.body.strip())
        formatted_html = "<br><br>".join(
            p.replace("\n", "<br>") for p in escaped.split("\n\n")
        )
        preview_btn = ""
        if email.preview_url:
            preview_btn = f"""
            <div style="margin: 24px 0;">
                <a href="{html.escape(email.preview_url)}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    View Live Preview
                </a>
            </div>
            """
        return f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff; padding: 16px;">
            <div>{formatted_html}</div>
            {preview_btn}
        </body>
        </html>
        """.strip()

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
                error=f"SendGrid provider not configured: {', '.join(status_check.missing_credentials)}",
            )

        from_addr = email.from_email or self.from_email
        from_name = email.from_name or self.from_name

        from_obj = {"email": from_addr}
        if from_name:
            from_obj["name"] = from_name

        payload = {
            "personalizations": [
                {
                    "to": [{"email": email.recipient}],
                }
            ],
            "from": from_obj,
            "subject": email.subject,
            "content": [
                {
                    "type": "text/plain",
                    "value": email.body.strip(),
                },
                {
                    "type": "text/html",
                    "value": self._build_html_body(email),
                }
            ]
        }

        if email.custom_headers:
            payload["headers"] = email.custom_headers

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            resp = self._session.post(self.API_URL, json=payload, headers=headers, timeout=20)
            duration = round(time.time() - start_time, 3)

            # SendGrid returns 202 Accepted on success
            if resp.status_code in (200, 201, 202):
                msg_id = resp.headers.get("X-Message-Id") or f"sg-{uuid.uuid4().hex[:12]}"
                logger.info("Successfully sent email to %s via SendGrid (ID: %s)", email.recipient, msg_id)
                return EmailDeliveryResult(
                    business_id=email.business_id,
                    recipient=email.recipient,
                    provider=self.provider_name,
                    message_id=msg_id,
                    status="sent",
                    sent_at=datetime.now(timezone.utc).isoformat(),
                    duration_seconds=duration,
                )
            else:
                err_msg = f"SendGrid API error [{resp.status_code}]: {resp.text}"
                logger.error(err_msg)
                return EmailDeliveryResult(
                    business_id=email.business_id,
                    recipient=email.recipient,
                    provider=self.provider_name,
                    status="failed",
                    sent_at=datetime.now(timezone.utc).isoformat(),
                    duration_seconds=duration,
                    error=err_msg,
                )
        except Exception as e:
            duration = round(time.time() - start_time, 3)
            logger.error("SendGrid HTTP request failed: %s", e)
            return EmailDeliveryResult(
                business_id=email.business_id,
                recipient=email.recipient,
                provider=self.provider_name,
                status="failed",
                sent_at=datetime.now(timezone.utc).isoformat(),
                duration_seconds=duration,
                error=str(e),
            )
