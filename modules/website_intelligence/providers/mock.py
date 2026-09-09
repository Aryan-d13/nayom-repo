from typing import Type, TypeVar, Optional, List
from pydantic import BaseModel

from contracts.intelligence import (
    WebsiteIntelligence,
    BusinessProfile,
    ServiceProduct,
    SocialLink,
    ContactIntelligence,
    BrandAndContentIntelligence,
    CallToAction,
    DesignAndUXAnalysis,
    TechnicalAndSEOAnalysis,
    RedesignRecommendations,
    TemplateRecommendation,
    IntelligenceMetadata,
)


from .base import AIProvider

T = TypeVar("T", bound=BaseModel)


class MockProvider(AIProvider):
    """
    Mock AI Provider for deterministic testing, offline testing, and validation.
    """

    def __init__(
        self,
        model_name: str = "mock-gemini-3.5-flash-lite",
        custom_response: Optional[BaseModel] = None,
        should_fail: bool = False,
    ):
        self._model_name = model_name
        self._custom_response = custom_response
        self._should_fail = should_fail

    @property
    def provider_name(self) -> str:
        return "mock"

    @property
    def model_name(self) -> str:
        return self._model_name

    def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_schema: Type[T],
        image_paths: Optional[List[str]] = None,
    ) -> T:
        if self._should_fail:
            raise RuntimeError("MockProvider simulated API failure")

        if self._custom_response is not None:
            if isinstance(self._custom_response, response_schema):
                return self._custom_response
            return response_schema.model_validate(self._custom_response.model_dump())

        # If requesting WebsiteIntelligence schema, generate rich realistic mock data
        if issubclass(response_schema, WebsiteIntelligence):
            has_images = bool(image_paths and len(image_paths) > 0)
            mock_data = WebsiteIntelligence(
                site_id="mock_site_id",
                base_url="https://example.com",
                domain="example.com",
                source_website_json="data/websites/example_com/website.json",
                business_profile=BusinessProfile(
                    business_name="Example Engineering Corp",
                    tagline="Architecting Resilient Distributed Systems",
                    description="Specialized high-throughput engineering firm building modern cloud microservices.",
                    industry_category="Software & Cloud Infrastructure",
                    value_proposition="We build fault-tolerant backend infrastructures that scale without operational overhead.",
                    target_audience="High-growth tech companies, engineering teams, and enterprise SaaS providers.",
                    key_differentiators=[
                        "Event-driven architecture focus",
                        "Sub-millisecond processing pipelines",
                        "Production-grade reliability guarantees",
                    ],
                ),
                services_and_products=[
                    ServiceProduct(
                        name="Cloud Infrastructure Consulting",
                        description="End-to-end design of distributed microservice architectures.",
                        category="Core Service",
                        target_audience="CTOs and Engineering Directors",
                        features=["Infrastructure as Code", "Kubernetes cluster orchestration", "Automated failover"],
                        pricing_hint="Custom retainers",
                    )
                ],
                contact_intelligence=ContactIntelligence(
                    emails=["contact@example.com"],
                    phones=["+1 (555) 019-2834"],
                    addresses=["123 Tech Blvd, San Francisco, CA"],
                    city="San Francisco",
                    state_or_region="CA",
                    country="USA",
                    social_links=[
                        SocialLink(platform="linkedin", url="https://linkedin.com/in/example"),
                        SocialLink(platform="github", url="https://github.com/example"),
                    ],
                    contact_forms_found=True,

                    business_hours="Mon-Fri 9am-6pm PST",
                    has_contact_method=True,
                ),
                brand_and_content=BrandAndContentIntelligence(
                    tone_and_voice=["technical", "authoritative", "minimalist"],
                    brand_positioning="High-end specialized systems engineering consultancy",
                    hero_headlines=["ENGINEERING SCALABLE SYSTEMS", "Designing systems that run reliably, quietly, and forever."],
                    important_copy_snippets=["Great systems aren't loud. They compound quietly."],
                    content_quality_score=9,
                ),
                calls_to_action=[
                    CallToAction(
                        text="Explore Selected Work",
                        destination="#work",
                        intent="navigation",
                        prominence="primary",
                        location="Hero Section",
                    ),
                    CallToAction(
                        text="Download Resume (PDF)",
                        destination="/resume.pdf",
                        intent="download",
                        prominence="secondary",
                        location="Hero Header",
                    ),
                ],
                design_and_ux=DesignAndUXAnalysis(
                    visual_aesthetic="Dark-mode Swiss technical editorial with high-contrast mono typography.",
                    typography_assessment="Clean sans-serif headings with high-contrast monospace accents.",
                    color_palette_assessment="Deep obsidian dark palette with subtle neutral borders and emerald accents.",
                    layout_and_spacing="Generous whitespace, structured bento grids, and clear visual hierarchy.",
                    ux_navigation_flow="Linear single-page anchor navigation with sticky header actions.",
                    visual_inputs_analyzed=has_images,
                    screenshot_observations=[
                        "Observed sharp typography contrast and dark-themed hero layout in screenshots."
                    ] if has_images else [],
                    strengths=["Strong visual identity", "Clean typography", "Clear value proposition"],
                    weaknesses=["Could benefit from more interactive case study demos"],
                ),
                technical_and_seo=TechnicalAndSEOAnalysis(
                    inferred_tech_stack=["Next.js", "Tailwind CSS", "Vercel", "PostgreSQL", "Redis"],
                    seo_health="Good metadata and heading structure with clear H1/H2 hierarchy.",
                    seo_strengths=["Proper title and OpenGraph tags present"],
                    seo_weaknesses=["Could include more structured schema markup (JSON-LD)"],
                    accessibility_observations="Good color contrast; all interactive buttons have clear labels.",
                    performance_and_structure_notes="Fast loading static/SSR bundle with minimal client bloat.",
                ),
                redesign_recommendations=RedesignRecommendations(
                    overall_redesign_verdict="The core layout is solid; recommended enhancements focus on interactive lead capture and social proof integration.",
                    strategic_recommendations=[
                        "Add an interactive ROI/cost-savings calculator for prospective clients.",
                        "Introduce a dedicated case study deep-dive modal.",
                    ],
                    ui_ux_improvements=[
                        "Add subtle hover micro-animations on case study cards.",
                        "Include client logos/testimonials carousel.",
                    ],
                    rebuild_opportunities=[
                        "Rebuild with Next.js App Router and dynamic booking widget.",
                    ],
                    quick_wins=[
                        "Add explicit meta keywords and canonical tags.",
                        "Add a floating quick-contact button for mobile viewports.",
                    ],
                ),
                template_recommendation=TemplateRecommendation(
                    recommended_template="dark-mode-systems-portfolio",
                    template_category="portfolio",
                    style_direction="dark_tech",
                    layout_pattern="bento_grid",
                    template_confidence=0.95,
                    key_sections=[
                        "hero_metrics",
                        "production_case_studies_bento",
                        "specialized_utility_suite",
                        "technical_stack_grid",
                        "professional_timeline",
                        "verified_credentials",
                        "quick_contact_lead_cta",
                    ],
                    reasoning="The site highlights high-volume distributed backend systems, FFmpeg DAGs, and production utilities. A high-contrast dark-mode bento portfolio communicates technical authority and engineering precision.",
                ),
                metadata=IntelligenceMetadata(

                    provider="mock",
                    model=self._model_name,
                    prompt_version="1.0.0",
                    screenshots_processed=len(image_paths) if image_paths else 0,
                    duration_seconds=0.1,
                ),
                warnings=[],
            )
            return mock_data  # type: ignore

        # Fallback generic model creation if other schema requested
        return response_schema()
