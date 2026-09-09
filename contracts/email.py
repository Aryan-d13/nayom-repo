from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class OutreachEmailDraft(BaseModel):
    """
    Structured AI draft schema returned by the LLM.
    
    Focuses on crafting personalized, human outreach copy based on business intelligence.
    """
    subject: str = Field(
        ...,
        description="Conversational, personalized, non-spammy email subject line",
    )
    body: str = Field(
        ...,
        description="Personalized, concise, human email body referencing real facts, useful improvements, and the preview URL",
    )
    key_improvements: List[str] = Field(
        default_factory=list,
        description="Specific website improvements or friction points addressed in the email",
    )
    salutation_name: Optional[str] = Field(
        default=None,
        description="Inferred individual name or team title used in greeting (e.g. 'Jane' or 'Elia Team')",
    )


class OutreachEmail(BaseModel):
    """
    Standardized Outreach Email Contract for Nayom-Automation.
    
    Unifies business identity, recipient contact information, generated copy,
    live preview link, and AI reproducibility metadata.
    """
    recipient: Optional[str] = Field(
        default=None,
        description="Target recipient email address (e.g. 'contact@example.com'), or null if no email is found",
    )
    subject: str = Field(
        ...,
        description="Compelling, personalized, non-spammy email subject line",
    )
    body: str = Field(
        ...,
        description="Personalized, concise, human email body copy",
    )
    business_id: str = Field(
        ...,
        description="Target business identifier or site slug",
    )
    preview_url: str = Field(
        ...,
        description="Deployed live preview website URL",
    )
    generated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO timestamp when email was generated",
    )
    model: str = Field(
        ...,
        description="AI model identifier used for generation (e.g. 'gemini-3.5-flash-lite')",
    )
    
    # Rich metadata & helper fields
    business_name: Optional[str] = Field(
        default=None,
        description="Official or operational business name",
    )
    key_improvements: List[str] = Field(
        default_factory=list,
        description="Specific website improvements highlighted in the outreach copy",
    )
    provider: str = Field(
        default="gemini",
        description="AI provider adapter identifier (e.g. 'gemini', 'mock')",
    )
    prompt_version: str = Field(
        default="1.0.0",
        description="Version of the email prompt template",
    )
    warnings: List[str] = Field(
        default_factory=list,
        description="Non-fatal warnings recorded during email generation",
    )


class EmailGenerationRequest(BaseModel):
    """Input request specification for the Email Generator module."""
    business_id: Optional[str] = Field(
        default=None,
        description="Target business/site identifier slug",
    )
    preview_url: Optional[str] = Field(
        default=None,
        description="Live preview website URL (inferred from deployment.json if omitted)",
    )
    recipient_email: Optional[str] = Field(
        default=None,
        description="Explicit recipient email override",
    )
    intelligence_path: Optional[str] = Field(
        default=None,
        description="Path to website_intelligence.json (inferred if omitted)",
    )
    business_json_path: Optional[str] = Field(
        default=None,
        description="Path to normalized business JSON file or raw business record",
    )
    output_path: Optional[str] = Field(
        default=None,
        description="Destination path for generated email.json",
    )


class SenderProviderStatus(BaseModel):
    """Status indicating configuration state and current quota availability of an email sender provider."""
    provider_name: str = Field(..., description="Provider identifier (e.g. 'resend', 'sendgrid', 'gmail', 'outlook', 'smtp', 'mock')")
    is_configured: bool = Field(..., description="Whether required authentication credentials are present")
    is_exhausted: bool = Field(default=False, description="Whether the provider has reached its daily quota limit")
    daily_limit: int = Field(default=0, description="Configured maximum daily emails allowed for this provider")
    sent_today: int = Field(default=0, description="Number of emails sent via this provider today")
    missing_credentials: List[str] = Field(default_factory=list, description="Missing environment variables or settings")
    description: str = Field(default="", description="Human-readable description of provider status")


class EmailDeliveryRequest(BaseModel):
    """Request specification for dispatching an outreach email."""
    business_id: str = Field(..., description="Business identifier matching generated/<business-id>")
    recipient: Optional[str] = Field(default=None, description="Target recipient email address")
    subject: str = Field(..., description="Email subject line")
    body: str = Field(..., description="Email body copy")
    preview_url: Optional[str] = Field(default=None, description="Live preview website URL")
    business_name: Optional[str] = Field(default=None, description="Target business name")
    from_email: Optional[str] = Field(default=None, description="Sender from email address override")
    from_name: Optional[str] = Field(default=None, description="Sender display name override")
    provider: Optional[str] = Field(default=None, description="Explicit provider override (e.g. 'resend', 'gmail', 'mock')")
    dry_run: bool = Field(default=False, description="Whether to simulate sending without making real network calls")
    allow_mock_fallback: bool = Field(default=False, description="Whether to allow falling back to Mock provider if live email providers fail")
    custom_headers: Dict[str, str] = Field(default_factory=dict, description="Optional custom email headers")


class EmailDeliveryResult(BaseModel):
    """Standardized delivery result contract recorded for each business email attempt."""
    business_id: str = Field(..., description="Business identifier matching the email")
    recipient: Optional[str] = Field(default=None, description="Recipient email address that was targeted")
    provider: str = Field(..., description="Email provider adapter that processed the request (or 'none'/'mock')")
    message_id: Optional[str] = Field(default=None, description="Provider message ID or tracking identifier")
    status: str = Field(default="sent", description="Delivery status ('sent', 'dry_run', 'skipped', 'failed')")
    sent_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO timestamp when email was sent or recorded",
    )
    error: Optional[str] = Field(default=None, description="Error message if delivery failed")
    warnings: List[str] = Field(default_factory=list, description="Non-fatal warnings recorded during processing")
    duration_seconds: float = Field(default=0.0, description="Dispatch duration in seconds")
    attempts: int = Field(default=1, description="Number of dispatch attempts or fallback cycles executed")

