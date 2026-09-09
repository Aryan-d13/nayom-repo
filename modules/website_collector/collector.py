import json
import logging
import os
import re
import time
import urllib.parse as up
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any

from config.settings import WEBSITES_DATA_DIR
from contracts.website import (
    Page,
    PageContent,
    PageError,
    WebsiteCollectionRequest,
    WebsiteCollectionResult,
)
from .extractor import parse_page_html, clean_text
from .vendor.markcrawl import crawl
from .vendor.markcrawl.screenshots import ScreenshotConfig

logger = logging.getLogger(__name__)


def slugify_domain(url: str) -> str:
    """Extracts domain from URL and converts into a clean filesystem slug."""
    try:
        parsed = up.urlsplit(url)
        netloc = parsed.netloc or parsed.path
        # Strip port and www
        host = netloc.split(":")[0].lower()
        if host.startswith("www."):
            host = host[4:]
        # Convert non-alphanumeric to underscore
        slug = re.sub(r"[^\w]+", "_", host).strip("_")
        return slug or "website"
    except Exception:
        return "website"


class WebsiteCollector:
    """
    Website Collector orchestrator for Nayom-Automation.
    
    Wraps the vendored MarkCrawl engine, extracts complete frontend-visible
    DOM information, saves raw crawl artifacts to `data/websites/<site-id>/raw/`,
    and outputs a normalized `data/websites/<site-id>/website.json`.
    """

    def __init__(self, data_root: Optional[Path] = None):
        self.data_root = data_root or WEBSITES_DATA_DIR
        self.data_root.mkdir(parents=True, exist_ok=True)

    def collect(self, request: WebsiteCollectionRequest) -> WebsiteCollectionResult:
        """Executes full domain crawl and structured frontend extraction."""
        started_at = datetime.now(timezone.utc)
        start_time = time.monotonic()

        # Normalize URL
        url = request.url.strip()
        if not url.startswith(("http://", "https://")):
            url = f"https://{url}"

        parsed_url = up.urlsplit(url)
        domain = parsed_url.netloc.lower()

        # Resolve site ID and paths
        site_id = request.site_id or slugify_domain(url)
        site_dir = self.data_root / site_id
        raw_dir = site_dir / "raw"
        website_json_path = site_dir / "website.json"

        raw_dir.mkdir(parents=True, exist_ok=True)

        pages_by_url: Dict[str, Page] = {}
        crawl_errors: List[str] = []
        crawl_warnings: List[str] = []

        # Configure Screenshot if requested
        screenshot_cfg = None
        if request.screenshot:
            screenshot_cfg = ScreenshotConfig(enabled=True)

        # Hook function invoked during MarkCrawl processing
        def page_hook(page_url: str, html_text: str, response: Any, page_data: Dict):
            try:
                page_start = time.monotonic()
                status_code = getattr(response, "status_code", getattr(response, "status", 200))
                screenshot_rel = page_data.get("screenshot")
                raw_md_rel = page_data.get("path")

                if html_text and html_text.strip():
                    (
                        content,
                        headings,
                        links,
                        images,
                        metadata,
                        forms,
                        buttons,
                        structured_data,
                    ) = parse_page_html(
                        html=html_text,
                        url=page_url,
                        status_code=status_code,
                        screenshot_path=screenshot_rel,
                        raw_markdown_path=raw_md_rel,
                    )
                else:
                    # Fallback if no raw HTML text was available
                    content = PageContent(
                        markdown=page_data.get("content", ""),
                        plain_text=clean_text(page_data.get("content", "")),
                        word_count=len(page_data.get("content", "").split()),
                        character_count=len(page_data.get("content", "")),
                    )
                    from contracts.website import PageMetadata, StructuredData
                    headings, links, images, forms, buttons = [], [], [], [], []
                    metadata = PageMetadata(title=page_data.get("title"))
                    structured_data = StructuredData()

                parsed_path = up.urlsplit(page_url).path or "/"
                duration_ms = round((time.monotonic() - page_start) * 1000, 2)

                page = Page(
                    url=page_url,
                    path=parsed_path,
                    title=page_data.get("title") or metadata.title or "",
                    status_code=status_code,
                    crawled_at=datetime.now(timezone.utc).isoformat(),
                    duration_ms=duration_ms,
                    content=content,
                    headings=headings,
                    links=links,
                    images=images,
                    metadata=metadata,
                    forms=forms,
                    buttons=buttons,
                    structured_data=structured_data,
                    screenshot_path=screenshot_rel,
                    raw_markdown_path=raw_md_rel,
                    is_success=True,
                    errors=[],
                    warnings=[],
                )
                pages_by_url[page_url] = page

            except Exception as exc:
                err_msg = f"Failed to extract frontend data for {page_url}: {exc}"
                logger.warning(err_msg, exc_info=True)
                page = Page(
                    url=page_url,
                    path=up.urlsplit(page_url).path or "/",
                    title=page_data.get("title", "Error"),
                    status_code=getattr(response, "status_code", getattr(response, "status", None)),
                    crawled_at=datetime.now(timezone.utc).isoformat(),
                    is_success=False,
                    errors=[
                        PageError(
                            error_type=type(exc).__name__,
                            message=str(exc),
                            status_code=getattr(response, "status_code", getattr(response, "status", None)),
                        )
                    ],
                )
                pages_by_url[page_url] = page

        # Run MarkCrawl engine
        try:
            logger.info("Starting MarkCrawl on %s (max_pages=%s, render_js=%s)", url, request.max_pages, request.render_js)
            crawl_res = crawl(
                base_url=url,
                out_dir=str(raw_dir),
                max_pages=request.max_pages,
                concurrency=request.concurrency,
                timeout=request.timeout,
                delay=request.delay,
                use_sitemap=request.use_sitemap,
                include_subdomains=request.include_subdomains,
                min_words=request.min_words,
                download_images=request.download_images,
                render_js=request.render_js,
                screenshot_config=screenshot_cfg,
                user_agent=request.user_agent,
                page_hook=page_hook,
            )
        except Exception as exc:
            err_msg = f"MarkCrawl execution failed: {exc}"
            logger.error(err_msg, exc_info=True)
            crawl_errors.append(err_msg)

        # Fallback inspection of raw/pages.jsonl if any page wasn't hooked
        jsonl_file = raw_dir / "pages.jsonl"
        if jsonl_file.exists():
            try:
                with open(jsonl_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line:
                            continue
                        row = json.loads(line)
                        row_url = row.get("url")
                        if row_url and row_url not in pages_by_url:
                            # Construct page entry from jsonl
                            txt = row.get("text", "")
                            pages_by_url[row_url] = Page(
                                url=row_url,
                                path=up.urlsplit(row_url).path or "/",
                                title=row.get("title", ""),
                                status_code=200,
                                crawled_at=row.get("crawled_at", datetime.now(timezone.utc).isoformat()),
                                content=PageContent(
                                    markdown=txt,
                                    plain_text=clean_text(txt),
                                    word_count=len(txt.split()),
                                    character_count=len(txt),
                                ),
                                screenshot_path=row.get("screenshot"),
                                raw_markdown_path=row.get("path"),
                                is_success=True,
                            )
            except Exception as exc:
                crawl_warnings.append(f"Failed reading pages.jsonl fallback: {exc}")

        # Derive primary site title & description from homepage / first page
        site_title = None
        site_desc = None
        pages_list = list(pages_by_url.values())

        for p in pages_list:
            if p.path in ("/", "") or p.url.rstrip("/") == url.rstrip("/"):
                site_title = p.metadata.title or p.title
                site_desc = p.metadata.description or (p.content.excerpt if p.content else None)
                break

        if not site_title and pages_list:
            site_title = pages_list[0].metadata.title or pages_list[0].title
        if not site_desc and pages_list:
            site_desc = pages_list[0].metadata.description

        completed_at = datetime.now(timezone.utc)
        duration_seconds = round(time.monotonic() - start_time, 2)

        successful_pages = sum(1 for p in pages_list if p.is_success)
        failed_pages = sum(1 for p in pages_list if not p.is_success)

        result = WebsiteCollectionResult(
            request=request,
            site_id=site_id,
            base_url=url,
            domain=domain,
            total_pages_crawled=len(pages_list),
            successful_pages=successful_pages,
            failed_pages=failed_pages,
            pages=pages_list,
            sitemap_urls_found=0,
            site_title=site_title,
            site_description=site_desc,
            started_at=started_at.isoformat(),
            completed_at=completed_at.isoformat(),
            duration_seconds=duration_seconds,
            raw_output_dir=str(raw_dir.resolve()),
            website_json_path=str(website_json_path.resolve()),
            errors=crawl_errors,
            warnings=crawl_warnings,
        )

        # Write website.json with atomic write
        try:
            temp_json_path = website_json_path.with_suffix(".tmp")
            with open(temp_json_path, "w", encoding="utf-8") as f:
                f.write(result.model_dump_json(indent=2))
            temp_json_path.replace(website_json_path)
            logger.info("Saved normalized website JSON to %s", website_json_path)
        except Exception as exc:
            err_msg = f"Failed writing website.json: {exc}"
            logger.error(err_msg)
            crawl_errors.append(err_msg)

        return result



def collect_website(
    url: str,
    max_pages: int = 50,
    render_js: bool = False,
    screenshot: bool = False,
    concurrency: int = 5,
    timeout: int = 20,
    delay: float = 0.25,
    use_sitemap: bool = True,
    download_images: bool = False,
    user_agent: Optional[str] = None,
) -> WebsiteCollectionResult:
    """Convenience function to collect a website with default collector."""
    collector = WebsiteCollector()
    request = WebsiteCollectionRequest(
        url=url,
        max_pages=max_pages,
        render_js=render_js,
        screenshot=screenshot,
        concurrency=concurrency,
        timeout=timeout,
        delay=delay,
        use_sitemap=use_sitemap,
        download_images=download_images,
        user_agent=user_agent,
    )
    return collector.collect(request)
