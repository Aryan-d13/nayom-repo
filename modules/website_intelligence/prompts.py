import json
from typing import Dict, Any, List, Optional, Type
from pydantic import BaseModel
from contracts.website import WebsiteCollectionResult, Page
from contracts.intelligence import WebsiteIntelligence

PROMPT_VERSION = "1.0.0"

SYSTEM_INSTRUCTION = """You are an elite Chief Website Strategist, Principal UI/UX Architect, and Technical Auditor.

Your mission is to perform a comprehensive, deep-dive intelligence extraction and audit on the provided website data.

Key Guidelines:
1. Grounding & Precision: Extract facts, services, messaging, and contact details strictly from the provided website crawl and content. Do not hallucinate fake products or fabricated contact info.
2. Multimodal Visual Reasoning: When screenshot images are provided, analyze the actual visual rendering (typography, layout density, spacing, colors, visual focal points, whitespace balance) in addition to the structured text. Record specific visual observations from the screenshots.
3. Actionable Redesign & Growth: Provide candid, high-value, and realistic recommendations for redesigning or rebuilding the website (modern Next.js/Tailwind architectures, conversion funnels, brand positioning, and quick wins).
4. Template & Architectural Direction: Recommend the optimal downstream website template archetype, category (e.g. portfolio, saas_landing, local_service, agency), visual style (e.g. dark_tech, minimalist_swiss, clean_corporate), layout pattern (e.g. bento_grid, split_hero_stack), and essential components best suited for this business type and audience.
5. Strict Schema Compliance: Structure your entire output strictly according to the provided WebsiteIntelligence JSON schema. Output valid JSON matching the exact schema definition.
"""



def build_page_summary(page: Page, max_content_chars: int = 4000) -> str:
    """Formats an individual page's structure and content into a clean text block."""
    lines = []
    lines.append(f"### Page: {page.title or 'Untitled'} ({page.path or page.url})")
    lines.append(f"- URL: {page.url}")
    lines.append(f"- Status: {page.status_code}")
    if page.metadata.description:
        lines.append(f"- Meta Description: {page.metadata.description}")
    if page.metadata.keywords:
        lines.append(f"- Meta Keywords: {', '.join(page.metadata.keywords)}")

    # Headings hierarchy
    if page.headings:
        h_str = " -> ".join(f"[H{h.level}] {h.text}" for h in page.headings[:15])
        lines.append(f"- Key Headings: {h_str}")

    # Contact Links (mailto, tel)
    contact_links = [l.url for l in page.links if l.url.startswith(("mailto:", "tel:"))]
    if contact_links:
        lines.append(f"- Direct Contact Links: {', '.join(contact_links[:10])}")

    # Buttons and CTAs
    ctas = [b.text for b in page.buttons if b.is_cta or b.type in ("submit", "link_cta")]
    if ctas:
        lines.append(f"- Buttons / CTAs: {', '.join(ctas[:10])}")

    # Forms
    if page.forms:
        form_descs = []
        for f in page.forms:
            fields = [fld.name or fld.type for fld in f.fields]
            form_descs.append(f"{f.method} form with fields [{', '.join(fields)}]")
        lines.append(f"- Forms: {'; '.join(form_descs)}")

    # Structured Data
    if page.structured_data.json_ld:
        lines.append(f"- JSON-LD Schemas: {len(page.structured_data.json_ld)} schema entity(s) found")

    # Content
    content_text = ""
    if page.content:
        content_text = page.content.markdown or page.content.plain_text or ""

    if content_text:
        trimmed = content_text[:max_content_chars].strip()
        if len(content_text) > max_content_chars:
            trimmed += "\n[...content truncated for brevity...]"
        lines.append("\n**Extracted Page Content:**\n```markdown\n" + trimmed + "\n```")

    return "\n".join(lines)


def build_analysis_prompt(
    site_result: WebsiteCollectionResult,
    screenshot_count: int = 0,
    response_schema: Optional[Type[BaseModel]] = WebsiteIntelligence,
) -> str:
    """
    Constructs the prompt for Website Intelligence extraction with explicit JSON schema instructions.
    """
    lines = []
    lines.append("# WEBSITE INTELLIGENCE EXTRACTION REQUEST")
    lines.append(f"Prompt Version: {PROMPT_VERSION}")
    lines.append(f"Site ID: {site_result.site_id}")
    lines.append(f"Domain: {site_result.domain}")
    lines.append(f"Base URL: {site_result.base_url}")
    if site_result.site_title:
        lines.append(f"Site Title: {site_result.site_title}")
    if site_result.site_description:
        lines.append(f"Site Description: {site_result.site_description}")
    lines.append(f"Total Pages Crawled: {site_result.total_pages_crawled}")
    lines.append(f"Visual Screenshots Attached: {screenshot_count}")
    lines.append("\n---\n## CRAWLED WEBSITE PAGES AND CONTENT:\n")

    # Sort pages: homepage first, then others
    pages = list(site_result.pages)
    pages.sort(key=lambda p: (0 if p.path in ("/", "", "/index.html") else 1, p.path))

    for idx, page in enumerate(pages, 1):
        lines.append(f"\n## [{idx}/{len(pages)}] Page Record")
        # Give homepage more content budget
        budget = 8000 if idx == 1 else 3000
        lines.append(build_page_summary(page, max_content_chars=budget))

    lines.append("\n---\n")
    lines.append("## REQUIRED OUTPUT JSON SCHEMA:")
    lines.append("Analyze the above website data (and any attached screenshot images).")
    lines.append("You MUST return a valid JSON object strictly conforming to the following JSON Schema:\n")

    target_cls = response_schema or WebsiteIntelligence
    schema_dict = target_cls.model_json_schema()
    lines.append("```json")
    lines.append(json.dumps(schema_dict, indent=2))
    lines.append("```")

    return "\n".join(lines)

