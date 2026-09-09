from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class PageHeading(BaseModel):
    """Represents a heading tag (h1-h6) on a page."""
    level: int = Field(..., ge=1, le=6, description="Heading level (1-6)")
    text: str = Field(..., description="Cleaned heading text")
    id: Optional[str] = Field(None, description="DOM ID attribute if present")


class PageLink(BaseModel):
    """Represents a link on a page."""
    url: str = Field(..., description="Resolved absolute URL")
    text: str = Field(default="", description="Anchor text")
    title: Optional[str] = Field(None, description="Link title attribute")
    is_external: bool = Field(default=False, description="True if link points outside the site domain")
    rel: Optional[str] = Field(None, description="Link rel attribute (e.g. nofollow, noopener)")


class PageImage(BaseModel):
    """Represents an image on a page."""
    url: str = Field(..., description="Resolved absolute image URL")
    alt: Optional[str] = Field(None, description="Image alt text")
    title: Optional[str] = Field(None, description="Image title attribute")
    width: Optional[int] = Field(None, description="Image width if specified")
    height: Optional[int] = Field(None, description="Image height if specified")
    loading: Optional[str] = Field(None, description="Loading strategy (lazy / eager)")
    local_path: Optional[str] = Field(None, description="Relative path to local copy if downloaded")


class PageFormField(BaseModel):
    """Represents an individual form field (input, select, textarea)."""
    name: Optional[str] = Field(None, description="Field name attribute")
    type: str = Field(default="text", description="Input type (text, email, password, select, textarea, etc.)")
    label: Optional[str] = Field(None, description="Associated label text")
    placeholder: Optional[str] = Field(None, description="Placeholder text")
    required: bool = Field(default=False, description="Whether field is required")
    value: Optional[str] = Field(None, description="Default or pre-set value")
    options: List[str] = Field(default_factory=list, description="Options if select dropdown or radio list")


class PageForm(BaseModel):
    """Represents a form element on a page."""
    id: Optional[str] = Field(None, description="Form DOM ID")
    name: Optional[str] = Field(None, description="Form name attribute")
    action: Optional[str] = Field(None, description="Form submit action URL")
    method: str = Field(default="GET", description="HTTP method (GET, POST)")
    fields: List[PageFormField] = Field(default_factory=list, description="List of form fields")
    submit_text: Optional[str] = Field(None, description="Text of the submit button")


class PageButton(BaseModel):
    """Represents an interactive button or CTA (Call-to-Action) element."""
    text: str = Field(..., description="Visible button or CTA text")
    type: str = Field(default="button", description="Button type (button, submit, link_cta)")
    href: Optional[str] = Field(None, description="Destination URL if link styled as button/CTA")
    onclick: Optional[str] = Field(None, description="onclick handler or javascript action if present")
    id: Optional[str] = Field(None, description="DOM ID attribute")
    class_name: Optional[str] = Field(None, description="CSS classes")
    is_cta: bool = Field(default=False, description="True if heuristic detects high-intent Call to Action")


class PageMetadata(BaseModel):
    """Comprehensive page metadata and SEO tags."""
    title: Optional[str] = Field(None, description="Page title")
    description: Optional[str] = Field(None, description="Meta description")
    keywords: List[str] = Field(default_factory=list, description="Meta keywords")
    canonical: Optional[str] = Field(None, description="Canonical URL")
    language: Optional[str] = Field(None, description="Page language (e.g. en, fr)")
    charset: Optional[str] = Field(None, description="Character encoding")
    viewport: Optional[str] = Field(None, description="Viewport meta tag")
    author: Optional[str] = Field(None, description="Page author")
    robots: Optional[str] = Field(None, description="Robots directive")
    og_tags: Dict[str, str] = Field(default_factory=dict, description="Open Graph tags (og:*)")
    twitter_tags: Dict[str, str] = Field(default_factory=dict, description="Twitter card tags (twitter:*)")
    favicon: Optional[str] = Field(None, description="Favicon URL")
    other_meta: Dict[str, str] = Field(default_factory=dict, description="Other custom meta tags")


class StructuredData(BaseModel):
    """Structured data extracted from the page."""
    json_ld: List[Dict[str, Any]] = Field(default_factory=list, description="Parsed JSON-LD scripts")
    opengraph: Dict[str, Any] = Field(default_factory=dict, description="OpenGraph structured properties")
    microdata: List[Dict[str, Any]] = Field(default_factory=list, description="HTML5 microdata entities")


class PageContent(BaseModel):
    """Cleaned text and markdown content of the page."""
    markdown: str = Field(default="", description="Cleaned markdown representation")
    plain_text: str = Field(default="", description="Clean visible plain text")
    word_count: int = Field(default=0, description="Total word count of content")
    character_count: int = Field(default=0, description="Total character count")
    excerpt: Optional[str] = Field(None, description="Short summary or excerpt of page content")


class PageError(BaseModel):
    """Record of an error encountered during page fetch or extraction."""
    error_type: str = Field(..., description="Error category / exception name")
    message: str = Field(..., description="Error explanation")
    status_code: Optional[int] = Field(None, description="HTTP status code if applicable")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Page(BaseModel):
    """
    Standardized Page Contract representing all frontend-visible information for a single page.
    """
    url: str = Field(..., description="Page URL")
    path: str = Field(default="/", description="URL path component")
    title: str = Field(default="", description="Page title")
    status_code: Optional[int] = Field(default=200, description="HTTP response status code")
    crawled_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    duration_ms: Optional[float] = Field(None, description="Fetch and parse duration in milliseconds")
    content: PageContent = Field(default_factory=PageContent)
    headings: List[PageHeading] = Field(default_factory=list)
    links: List[PageLink] = Field(default_factory=list)
    images: List[PageImage] = Field(default_factory=list)
    metadata: PageMetadata = Field(default_factory=PageMetadata)
    forms: List[PageForm] = Field(default_factory=list)
    buttons: List[PageButton] = Field(default_factory=list)
    structured_data: StructuredData = Field(default_factory=StructuredData)
    screenshot_path: Optional[str] = Field(None, description="Path to captured screenshot file if enabled")
    raw_markdown_path: Optional[str] = Field(None, description="Path to raw markdown file in raw/")
    is_success: bool = Field(default=True, description="Whether page was crawled and parsed successfully")
    errors: List[PageError] = Field(default_factory=list, description="Errors encountered for this page")
    warnings: List[str] = Field(default_factory=list, description="Warnings or non-critical issues")


class WebsiteCollectionRequest(BaseModel):
    """
    Contract for requesting a website crawl and collection.
    """
    url: str = Field(..., description="Seed website URL (e.g. https://example.com)")
    site_id: Optional[str] = Field(None, description="Optional custom site ID; defaults to domain slug")
    max_pages: int = Field(default=50, description="Max pages to crawl (0 for unlimited)")
    render_js: bool = Field(default=False, description="Enable Playwright JavaScript rendering")
    screenshot: bool = Field(default=False, description="Capture full-page screenshots")
    concurrency: int = Field(default=5, description="Concurrent request limit")
    timeout: int = Field(default=20, description="Request timeout in seconds")
    delay: float = Field(default=0.25, description="Politeness delay between requests in seconds")
    use_sitemap: bool = Field(default=True, description="Attempt sitemap-first URL discovery")
    include_subdomains: bool = Field(default=False, description="Whether to include subdomains")
    min_words: int = Field(default=5, description="Minimum words threshold for page inclusion")
    download_images: bool = Field(default=False, description="Download images to local raw/assets/")
    user_agent: Optional[str] = Field(None, description="Custom User-Agent string")


class WebsiteCollectionResult(BaseModel):
    """
    Standardized Website Collection Result Contract for Nayom-Automation.
    
    This contract is independent from MarkCrawl's internal schema and contains
    all frontend-visible information collected across the domain.
    """
    request: WebsiteCollectionRequest
    site_id: str = Field(..., description="Unique site identifier slug")
    base_url: str = Field(..., description="Normalized root URL")
    domain: str = Field(..., description="Registered domain or hostname")
    total_pages_crawled: int = Field(default=0, description="Total pages processed")
    successful_pages: int = Field(default=0, description="Number of successfully extracted pages")
    failed_pages: int = Field(default=0, description="Number of pages that failed or threw errors")
    pages: List[Page] = Field(default_factory=list, description="List of all collected page contracts")
    sitemap_urls_found: int = Field(default=0, description="Number of URLs discovered via sitemap")
    site_title: Optional[str] = Field(None, description="Primary site title from homepage")
    site_description: Optional[str] = Field(None, description="Primary site description from homepage")
    started_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    completed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    duration_seconds: float = Field(default=0.0, description="Total collection duration in seconds")
    raw_output_dir: str = Field(..., description="Path to raw MarkCrawl outputs directory")
    website_json_path: str = Field(..., description="Path to normalized website.json file")
    errors: List[str] = Field(default_factory=list, description="Site-level errors")
    warnings: List[str] = Field(default_factory=list, description="Site-level warnings")
