from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CanonicalBusinessIdentity(BaseModel):
    """Core identity of the business."""
    name: str = Field(..., description="Official business name")
    short_name: Optional[str] = Field(None, description="Short brand or display name")
    tagline: Optional[str] = Field(None, description="Genuine slogan or motto if known")
    category: Optional[str] = Field(None, description="Primary business vertical (e.g. 'garage_doors', 'plumbing')")
    description: Optional[str] = Field(None, description="Genuine summary of what the business does")


class CanonicalContact(BaseModel):
    """Direct contact and physical location details."""
    phone: Optional[str] = Field(None, description="Formatted phone number for display (e.g. '(214) 555-0199')")
    raw_phone: Optional[str] = Field(None, description="Numeric-only phone for tel: links (e.g. '2145550199')")
    email: Optional[str] = Field(None, description="Contact email address")
    address: Optional[str] = Field(None, description="Full street address if available")
    city: Optional[str] = Field(None, description="City name")
    state: Optional[str] = Field(None, description="State or province (e.g. 'TX' or 'Texas')")
    postal_code: Optional[str] = Field(None, description="ZIP or postal code")
    country: Optional[str] = Field(default="US", description="Country code or name")
    hours: Optional[str] = Field(None, description="Operating hours summary if known")
    social_links: Dict[str, str] = Field(default_factory=dict, description="Platform -> profile URL mapping")
    service_areas: List[str] = Field(default_factory=list, description="Counties, neighborhoods, or cities served")


class CanonicalCTA(BaseModel):
    """Actionable call to action."""
    text: str = Field(..., description="CTA button label (e.g. 'Call Now', 'Get A Quote')")
    link: Optional[str] = Field(None, description="Anchor link or URL (e.g. '#contact', 'tel:2145550199')")
    phone_action: bool = Field(default=False, description="Whether this CTA directly triggers a phone call")


class CanonicalEditorial(BaseModel):
    """Editorial and value proposition copy derived from real business research."""
    headline: Optional[str] = Field(None, description="Primary hero headline")
    subheadline: Optional[str] = Field(None, description="Supporting hero subheadline")
    value_proposition: Optional[str] = Field(None, description="Why customers choose this business")
    differentiators: List[str] = Field(default_factory=list, description="Genuine strengths (e.g. '24/7 Emergency Service', 'Locally Owned Since 1998')")
    primary_cta: Optional[CanonicalCTA] = None
    secondary_cta: Optional[CanonicalCTA] = None


class CanonicalOffering(BaseModel):
    """A real service or product offered by the business."""
    id: str = Field(..., description="Unique slug for the service")
    name: str = Field(..., description="Service name (e.g. 'Spring Replacement')")
    category: Optional[str] = Field(None, description="Service category")
    summary: Optional[str] = Field(None, description="Brief description of the service")
    features: List[str] = Field(default_factory=list, description="Key features or deliverables")
    pricing: Optional[str] = Field(None, description="Pricing note only if genuinely known")


class CanonicalTestimonial(BaseModel):
    """A genuine customer review or quote."""
    quote: str = Field(..., description="Exact review text or excerpt")
    author: Optional[str] = Field(None, description="Reviewer name or 'Verified Customer'")
    rating: Optional[float] = Field(None, ge=1.0, le=5.0, description="Star rating if known")
    source: Optional[str] = Field(None, description="Source platform (e.g. 'Google Maps', 'Yelp')")


class CanonicalSocialProof(BaseModel):
    """Real social proof metrics and authentic reviews."""
    rating: Optional[float] = Field(None, ge=1.0, le=5.0, description="Aggregate average rating")
    review_count: Optional[int] = Field(None, ge=0, description="Total count of verified reviews")
    testimonials: List[CanonicalTestimonial] = Field(default_factory=list, description="Real customer reviews only. Never synthetic.")


class CanonicalSEO(BaseModel):
    """Search engine optimization and structured metadata."""
    title: Optional[str] = Field(None, description="Page <title> tag")
    meta_description: Optional[str] = Field(None, description="Meta description tag")
    keywords: List[str] = Field(default_factory=list, description="SEO keywords")
    json_ld: Optional[Dict[str, Any]] = Field(None, description="Schema.org LocalBusiness structured data")


class CanonicalAsset(BaseModel):
    """Real business visual asset discovered or collected."""
    url_or_path: str = Field(..., description="Path or URL to the asset (e.g. '/assets/logo.png')")
    alt: Optional[str] = Field(None, description="Alt text describing the image")
    kind: str = Field(default="general", description="'logo', 'hero', 'exterior', 'work', 'team', or 'general'")


class CanonicalSiteData(BaseModel):
    """
    Standardized Canonical Business Site Contract for Nayom-Automation.
    
    Nayom owns WHAT the business is.
    The template owns HOW it is presented.
    The template adapter translates between the two.
    
    No synthetic FAQs. No fake customer testimonials. No inferred tech stacks.
    """
    schema_version: str = "1.0.0"
    business_id: str = Field(..., description="Unique business slug identifier")
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    
    identity: CanonicalBusinessIdentity
    contact: CanonicalContact
    editorial: CanonicalEditorial
    offerings: List[CanonicalOffering] = Field(default_factory=list)
    social_proof: CanonicalSocialProof = Field(default_factory=CanonicalSocialProof)
    seo: CanonicalSEO = Field(default_factory=CanonicalSEO)
    assets: List[CanonicalAsset] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Operational metadata")
