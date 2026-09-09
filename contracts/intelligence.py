from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ServiceProduct(BaseModel):
    """Represents a specific service, product, or offering identified on the website."""
    name: str = Field(..., description="Name or title of the service/product")
    description: str = Field(default="", description="Summary of what the service/product provides")
    category: Optional[str] = Field(None, description="Category or tier (e.g. Core, Add-on, Enterprise)")
    target_audience: Optional[str] = Field(None, description="Intended customer or user for this service")
    features: List[str] = Field(default_factory=list, description="Key features, deliverables, or highlights")
    pricing_hint: Optional[str] = Field(None, description="Pricing mentions, starting rates, or models if available")


class SocialLink(BaseModel):
    """Represents a social media profile link."""
    platform: str = Field(..., description="Platform name (e.g. linkedin, twitter, github, instagram, youtube, facebook)")
    url: str = Field(..., description="Full profile URL")


class ContactIntelligence(BaseModel):
    """Structured extraction of contact and location information."""
    emails: List[str] = Field(default_factory=list, description="Extracted email addresses")
    phones: List[str] = Field(default_factory=list, description="Extracted phone numbers")
    addresses: List[str] = Field(default_factory=list, description="Physical addresses or office locations")
    city: Optional[str] = Field(None, description="Primary city identified")
    state_or_region: Optional[str] = Field(None, description="Primary state/region identified")
    country: Optional[str] = Field(None, description="Country or operational jurisdiction")
    social_links: List[SocialLink] = Field(
        default_factory=list,
        description="Social media profile URLs (platform and url)",
    )
    contact_forms_found: bool = Field(default=False, description="Whether inquiry/contact forms are present")
    business_hours: Optional[str] = Field(None, description="Operating hours or availability mentions")
    has_contact_method: bool = Field(default=False, description="True if at least one contact channel was identified")



class CallToAction(BaseModel):
    """Structured Call to Action (CTA) identified across the website."""
    text: str = Field(..., description="Visible CTA label (e.g. 'Get Started', 'Schedule a Demo')")
    destination: Optional[str] = Field(None, description="Target URL, route, or anchor link")
    intent: str = Field(
        default="general",
        description="Intent category (e.g. lead_capture, contact, booking, download, checkout, navigation)",
    )
    prominence: str = Field(
        default="secondary",
        description="Visual or hierarchical importance (primary, secondary, subtle)",
    )
    location: Optional[str] = Field(
        None,
        description="Page location or component (e.g. Hero, Sticky Header, Footer, Pricing Card)",
    )


class BusinessProfile(BaseModel):
    """High-level business identity, value proposition, and market positioning."""
    business_name: Optional[str] = Field(None, description="Official or operational name of the business/creator")
    tagline: Optional[str] = Field(None, description="Core slogan, hero banner statement, or primary headline")
    description: str = Field(..., description="Comprehensive business overview explaining what it is and does")
    industry_category: Optional[str] = Field(None, description="Primary industry or business category")
    value_proposition: str = Field(
        ...,
        description="Core value proposition: why customers choose them and what problem is solved",
    )
    target_audience: str = Field(
        ...,
        description="Primary target customers, demographic segments, or ideal client profile",
    )
    key_differentiators: List[str] = Field(
        default_factory=list,
        description="Unique strengths, proprietary methodologies, or standout capabilities",
    )


class BrandAndContentIntelligence(BaseModel):
    """Brand voice, visual style, copy quality, and key messaging statements."""
    tone_and_voice: List[str] = Field(
        default_factory=list,
        description="Tone descriptors (e.g. ['minimalist', 'authoritative', 'technical', 'playful'])",
    )
    brand_positioning: str = Field(
        default="",
        description="How the brand positions itself in the market (e.g. luxury, high-velocity, trusted partner)",
    )
    hero_headlines: List[str] = Field(
        default_factory=list,
        description="Prominent hero headers and high-impact copy lines from key pages",
    )
    important_copy_snippets: List[str] = Field(
        default_factory=list,
        description="Memorable case studies, quotes, proof points, or testimonials",
    )
    content_quality_score: int = Field(
        default=7,
        ge=1,
        le=10,
        description="Estimated content quality rating from 1 to 10 based on depth, clarity, and authority",
    )


class DesignAndUXAnalysis(BaseModel):
    """Comprehensive design, layout, typography, and user experience evaluation."""
    visual_aesthetic: str = Field(
        ...,
        description="Analysis of the visual theme (e.g. dark-tech, Swiss editorial, corporate modern, minimalist)",
    )
    typography_assessment: str = Field(
        ...,
        description="Evaluation of font hierarchy, legibility, scale contrast, and typographic rhythm",
    )
    color_palette_assessment: str = Field(
        ...,
        description="Assessment of color harmony, background tones, accent balance, and contrast",
    )
    layout_and_spacing: str = Field(
        ...,
        description="Observations on grid layout, white space, visual pacing, and bento/card structures",
    )
    ux_navigation_flow: str = Field(
        ...,
        description="Evaluation of navigation menu, clarity of paths to conversion, and user journey",
    )
    visual_inputs_analyzed: bool = Field(
        default=False,
        description="True if actual raw screenshot renders were processed by the multimodal AI",
    )
    screenshot_observations: List[str] = Field(
        default_factory=list,
        description="Specific visual findings directly observed from the rendered screenshots (if provided)",
    )
    strengths: List[str] = Field(
        default_factory=list,
        description="Design and UX strengths that stand out positively",
    )
    weaknesses: List[str] = Field(
        default_factory=list,
        description="Design and UX friction points, flaws, or outdated patterns",
    )


class TechnicalAndSEOAnalysis(BaseModel):
    """Technical architecture, search engine optimization, and accessibility hygiene."""
    inferred_tech_stack: List[str] = Field(
        default_factory=list,
        description="Detected or inferred frameworks, libraries, hosting, or CMS (e.g. Next.js, Tailwind, Vercel)",
    )
    seo_health: str = Field(
        ...,
        description="Evaluation of meta tags, headings structure, canonicals, and keyword relevance",
    )
    seo_strengths: List[str] = Field(default_factory=list, description="SEO elements implemented well")
    seo_weaknesses: List[str] = Field(default_factory=list, description="SEO missing elements or errors")
    accessibility_observations: str = Field(
        ...,
        description="Observations on alt tags, semantic landmarking, contrast, and interactive button states",
    )
    performance_and_structure_notes: str = Field(
        default="",
        description="Structural hygiene, content density, or asset weight notes",
    )


class RedesignRecommendations(BaseModel):
    """Strategic and tactical recommendations for rebuilding or improving the website."""
    overall_redesign_verdict: str = Field(
        ...,
        description="Executive verdict on whether and why a redesign or overhaul is recommended",
    )
    strategic_recommendations: List[str] = Field(
        default_factory=list,
        description="High-level architectural, positioning, and conversion strategy advice",
    )
    ui_ux_improvements: List[str] = Field(
        default_factory=list,
        description="Specific visual, layout, and UI interaction improvements",
    )
    rebuild_opportunities: List[str] = Field(
        default_factory=list,
        description="Modern rebuild avenues (e.g. Next.js/Tailwind, headless CMS, automated booking/lead funnels)",
    )
    quick_wins: List[str] = Field(
        default_factory=list,
        description="High-impact changes that can be executed quickly with minimal effort",
    )


class TokenUsage(BaseModel):
    """Token consumption statistics from AI provider."""
    prompt_tokens: Optional[int] = Field(None, description="Number of tokens in prompt")
    candidates_tokens: Optional[int] = Field(None, description="Number of tokens in response")
    total_tokens: Optional[int] = Field(None, description="Total tokens consumed")


class IntelligenceMetadata(BaseModel):
    """Reproducibility metadata, provider configuration, and run statistics."""
    provider: str = Field(default="gemini", description="AI Provider adapter identifier")
    model: str = Field(default="gemini-3.5-flash-lite", description="Underlying model identifier")
    prompt_version: str = Field(default="1.0.0", description="Version of the intelligence extraction prompt")
    analyzed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    screenshots_processed: int = Field(default=0, description="Number of visual screenshot images fed to AI")
    duration_seconds: float = Field(default=0.0, description="End-to-end analysis processing duration")
    token_usage: Optional[TokenUsage] = Field(None, description="Token usage details from API if reported")



class TemplateRecommendation(BaseModel):
    """
    Template and architectural direction recommended for downstream website generation.
    """
    recommended_template: str = Field(
        ...,
        description="Recommended template archetype identifier (e.g. 'dark-mode-systems-portfolio', 'modern-saas-bento', 'local-service-leadgen', 'creative-editorial-agency')",
    )
    template_category: str = Field(
        ...,
        description="High-level category of template (e.g. 'portfolio', 'saas_landing', 'local_service', 'agency', 'e_commerce', 'professional_services')",
    )
    style_direction: str = Field(
        ...,
        description="Visual design and aesthetic style direction (e.g. 'dark_tech', 'minimalist_swiss', 'clean_corporate', 'warm_editorial', 'bold_industrial')",
    )
    layout_pattern: str = Field(
        ...,
        description="Primary page layout pattern (e.g. 'bento_grid', 'split_hero_feature_stack', 'single_page_anchor_flow', 'multi_page_funnel', 'sticky_card_scroll')",
    )
    template_confidence: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Confidence score for this template recommendation between 0.0 and 1.0",
    )
    key_sections: List[str] = Field(
        default_factory=list,
        description="Essential sections/components recommended for this site (e.g. ['hero', 'case_study_bento', 'skills_stack', 'lead_booking_cta'])",
    )
    reasoning: str = Field(
        default="",
        description="Strategic rationale for why this template direction best serves the business and audience",
    )


class WebsiteIntelligence(BaseModel):
    """
    Complete Standardized Website Intelligence Contract.
    
    This contract unifies AI-driven business intelligence, design/UX analysis,
    technical/SEO review, strategic redesign recommendations, and downstream
    template recommendations into a single structured schema.
    """
    site_id: str = Field(..., description="Unique site identifier slug matching website.json")
    base_url: str = Field(..., description="Root website URL")
    domain: str = Field(..., description="Website registered domain or hostname")
    source_website_json: str = Field(..., description="Path to the input website.json file")
    
    # Core Intelligence Modules
    business_profile: BusinessProfile = Field(..., description="Business description, positioning, and value prop")
    services_and_products: List[ServiceProduct] = Field(
        default_factory=list,
        description="Catalog of extracted services and products",
    )
    contact_intelligence: ContactIntelligence = Field(
        ...,
        description="Extracted contact channels, locations, and social presence",
    )
    brand_and_content: BrandAndContentIntelligence = Field(
        ...,
        description="Brand voice, headlines, key messaging, and copy quality",
    )
    calls_to_action: List[CallToAction] = Field(
        default_factory=list,
        description="Key CTAs identified across pages",
    )
    design_and_ux: DesignAndUXAnalysis = Field(
        ...,
        description="Visual aesthetic, typography, UX flows, and screenshot-based analysis",
    )
    technical_and_seo: TechnicalAndSEOAnalysis = Field(
        ...,
        description="Technical stack, SEO health, and accessibility review",
    )
    redesign_recommendations: RedesignRecommendations = Field(
        ...,
        description="Strategic overhaul recommendations, quick wins, and rebuild opportunities",
    )
    template_recommendation: TemplateRecommendation = Field(
        ...,
        description="Downstream template archetype, style direction, and layout pattern recommendation",
    )
    
    # Execution & Reproducibility Metadata
    metadata: IntelligenceMetadata = Field(default_factory=IntelligenceMetadata)
    warnings: List[str] = Field(default_factory=list, description="Non-fatal warnings recorded during extraction")

