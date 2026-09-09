import json
import logging
import re
import urllib.parse as up
from typing import Optional, List, Dict, Any, Tuple, Set
from bs4 import BeautifulSoup, Tag

from contracts.website import (
    PageHeading,
    PageLink,
    PageImage,
    PageFormField,
    PageForm,
    PageButton,
    PageMetadata,
    StructuredData,
    PageContent,
)

logger = logging.getLogger(__name__)

# Common CTA keyword patterns in button / link text
CTA_TEXT_PATTERN = re.compile(
    r"\b(get\s+started|sign\s*up|book\s*(now|a|an)?|schedule|contact\s*us|free\s*trial|demo|buy\s*now|subscribe|join|order\s*now|request\s*(a\s*)?quote|try\s*free|get\s*in\s*touch|apply\s*now|call\s*now|hire\s*us|start\s*free)\b",
    re.IGNORECASE,
)

CTA_CLASS_PATTERN = re.compile(
    r"\b(btn|button|cta|action|primary-btn|hero-btn|sign-up|get-started|contact-btn)\b",
    re.IGNORECASE,
)


def clean_text(text: Optional[str]) -> str:
    """Normalize and collapse whitespace."""
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()


def resolve_url(url: Optional[str], base_url: str) -> str:
    """Resolves relative URL to absolute URL."""
    if not url:
        return ""
    url = url.strip()
    if url.startswith("//"):
        parsed_base = up.urlsplit(base_url)
        return f"{parsed_base.scheme}:{url}"
    try:
        return up.urljoin(base_url, url)
    except Exception:
        return url


def is_external_url(url: str, base_netloc: str) -> bool:
    """Checks if a URL points to an external domain."""
    try:
        parsed = up.urlsplit(url)
        if not parsed.netloc:
            return False
        # Compare base hostnames (stripping www.)
        host = parsed.netloc.lower().split(":")[0]
        base_host = base_netloc.lower().split(":")[0]
        if host.startswith("www."):
            host = host[4:]
        if base_host.startswith("www."):
            base_host = base_host[4:]
        return host != base_host and not host.endswith("." + base_host)
    except Exception:
        return False


def extract_headings(soup: BeautifulSoup) -> List[PageHeading]:
    """Extracts all headings (h1-h6) with their level, text, and DOM ID."""
    headings: List[PageHeading] = []
    for tag in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        try:
            level = int(tag.name[1])
            text = clean_text(tag.get_text())
            if text:
                tag_id = tag.get("id")
                headings.append(PageHeading(level=level, text=text, id=str(tag_id) if tag_id else None))
        except Exception:
            continue
    return headings


def extract_links(soup: BeautifulSoup, base_url: str, base_netloc: str) -> List[PageLink]:
    """Extracts all hyperlinks with resolved URLs, anchor text, title, and external flag."""
    links: List[PageLink] = []
    seen: Set[Tuple[str, str]] = set()

    for a in soup.find_all("a", href=True):
        href = a.get("href", "").strip()
        if not href or href.startswith(("#", "javascript:", "data:")):
            continue

        if href.startswith("mailto:"):
            email_clean = href[7:].split("?")[0].strip()
            if "@" in email_clean:
                text = clean_text(a.get_text()) or email_clean
                dedup_key = (f"mailto:{email_clean}", text)
                if dedup_key not in seen:
                    seen.add(dedup_key)
                    links.append(PageLink(
                        url=f"mailto:{email_clean}",
                        text=text,
                        title=f"Email: {email_clean}",
                        is_external=False,
                    ))
            continue

        if href.startswith("tel:"):
            phone_clean = href[4:].split("?")[0].strip()
            if phone_clean:
                text = clean_text(a.get_text()) or phone_clean
                dedup_key = (f"tel:{phone_clean}", text)
                if dedup_key not in seen:
                    seen.add(dedup_key)
                    links.append(PageLink(
                        url=f"tel:{phone_clean}",
                        text=text,
                        title=f"Phone: {phone_clean}",
                        is_external=False,
                    ))
            continue

        resolved = resolve_url(href, base_url)
        if not resolved or not resolved.startswith(("http://", "https://")):
            continue

        text = clean_text(a.get_text())
        # If no text, check for image alt text inside the anchor
        if not text:
            img = a.find("img", alt=True)
            if img and img.get("alt"):
                text = clean_text(img["alt"])

        title = a.get("title")
        rel = a.get("rel")
        rel_str = " ".join(rel) if isinstance(rel, list) else (str(rel) if rel else None)
        is_ext = is_external_url(resolved, base_netloc)

        dedup_key = (resolved, text)
        if dedup_key not in seen:
            seen.add(dedup_key)
            links.append(PageLink(
                url=resolved,
                text=text,
                title=clean_text(title) if title else None,
                is_external=is_ext,
                rel=rel_str,
            ))

    return links


def extract_images(soup: BeautifulSoup, base_url: str) -> List[PageImage]:
    """Extracts all images with resolved URLs, alt text, dimensions, and loading attribute."""
    images: List[PageImage] = []
    seen_urls: Set[str] = set()

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src") or img.get("data-original")
        if not src:
            # Check srcset
            srcset = img.get("srcset") or img.get("data-srcset")
            if srcset:
                src = srcset.split(",")[0].strip().split(" ")[0]

        if not src or src.startswith("data:"):
            continue

        resolved = resolve_url(src, base_url)
        if not resolved or resolved in seen_urls or not resolved.startswith(("http://", "https://")):
            continue

        seen_urls.add(resolved)
        alt = clean_text(img.get("alt"))
        title = clean_text(img.get("title"))
        loading = img.get("loading")

        width_val = None
        height_val = None
        try:
            if img.get("width") and str(img["width"]).isdigit():
                width_val = int(img["width"])
            if img.get("height") and str(img["height"]).isdigit():
                height_val = int(img["height"])
        except Exception:
            pass

        images.append(PageImage(
            url=resolved,
            alt=alt if alt else None,
            title=title if title else None,
            width=width_val,
            height=height_val,
            loading=str(loading) if loading else None,
        ))

    return images


def extract_forms(soup: BeautifulSoup, base_url: str) -> List[PageForm]:
    """Extracts all HTML forms and their input fields, selects, and textareas."""
    forms: List[PageForm] = []

    for form in soup.find_all("form"):
        form_id = form.get("id")
        form_name = form.get("name")
        action = resolve_url(form.get("action"), base_url) if form.get("action") else None
        method = (form.get("method") or "GET").upper()

        fields: List[PageFormField] = []
        submit_text: Optional[str] = None

        # Build lookup for <label for="id">
        labels_by_for: Dict[str, str] = {}
        for label in form.find_all("label"):
            for_id = label.get("for")
            if for_id:
                labels_by_for[for_id] = clean_text(label.get_text())

        # Inputs
        for inp in form.find_all(["input", "select", "textarea"]):
            inp_type = (inp.get("type") or ("select" if inp.name == "select" else ("textarea" if inp.name == "textarea" else "text"))).lower()
            inp_name = inp.get("name")
            inp_id = inp.get("id")
            placeholder = inp.get("placeholder")
            required = inp.has_attr("required")
            value = inp.get("value")

            # Check label
            field_label = None
            if inp_id and inp_id in labels_by_for:
                field_label = labels_by_for[inp_id]
            elif inp.parent and inp.parent.name == "label":
                field_label = clean_text(inp.parent.get_text())

            # Options for select dropdown
            options: List[str] = []
            if inp.name == "select":
                for opt in inp.find_all("option"):
                    opt_text = clean_text(opt.get_text() or opt.get("value"))
                    if opt_text:
                        options.append(opt_text)

            if inp_type in ("submit", "image"):
                if not submit_text:
                    submit_text = clean_text(value or inp.get("alt") or "Submit")
                continue

            fields.append(PageFormField(
                name=inp_name,
                type=inp_type,
                label=field_label,
                placeholder=clean_text(placeholder) if placeholder else None,
                required=required,
                value=clean_text(value) if value else None,
                options=options,
            ))

        # Check button[type=submit]
        if not submit_text:
            btn = form.find("button", attrs={"type": re.compile(r"submit", re.I)}) or form.find("button")
            if btn:
                submit_text = clean_text(btn.get_text())

        forms.append(PageForm(
            id=str(form_id) if form_id else None,
            name=str(form_name) if form_name else None,
            action=action,
            method=method,
            fields=fields,
            submit_text=submit_text,
        ))

    return forms


def extract_buttons(soup: BeautifulSoup, base_url: str) -> List[PageButton]:
    """Extracts buttons, submit inputs, and CTA links styled as buttons."""
    buttons: List[PageButton] = []
    seen: Set[str] = set()

    # 1. <button> elements
    for btn in soup.find_all("button"):
        text = clean_text(btn.get_text())
        if not text:
            continue
        btn_type = (btn.get("type") or "button").lower()
        btn_id = btn.get("id")
        btn_class = " ".join(btn.get("class", [])) if isinstance(btn.get("class"), list) else str(btn.get("class") or "")
        onclick = btn.get("onclick")
        is_cta = bool(CTA_TEXT_PATTERN.search(text) or CTA_CLASS_PATTERN.search(btn_class))

        key = f"btn:{text}:{btn_type}:{btn_id}"
        if key not in seen:
            seen.add(key)
            buttons.append(PageButton(
                text=text,
                type=btn_type,
                href=None,
                onclick=str(onclick) if onclick else None,
                id=str(btn_id) if btn_id else None,
                class_name=btn_class if btn_class else None,
                is_cta=is_cta,
            ))

    # 2. <input type="button|submit"> elements
    for inp in soup.find_all("input", type=re.compile(r"^(button|submit)$", re.I)):
        text = clean_text(inp.get("value") or inp.get("name"))
        if not text:
            continue
        btn_type = inp.get("type", "button").lower()
        btn_id = inp.get("id")
        btn_class = " ".join(inp.get("class", [])) if isinstance(inp.get("class"), list) else str(inp.get("class") or "")
        onclick = inp.get("onclick")
        is_cta = bool(CTA_TEXT_PATTERN.search(text) or CTA_CLASS_PATTERN.search(btn_class))

        key = f"inp:{text}:{btn_type}:{btn_id}"
        if key not in seen:
            seen.add(key)
            buttons.append(PageButton(
                text=text,
                type=btn_type,
                href=None,
                onclick=str(onclick) if onclick else None,
                id=str(btn_id) if btn_id else None,
                class_name=btn_class if btn_class else None,
                is_cta=is_cta,
            ))

    # 3. <a> tags that are styled or act as CTAs
    for a in soup.find_all("a", href=True):
        href = a.get("href", "").strip()
        if not href or href.startswith("javascript:"):
            continue
        text = clean_text(a.get_text())
        if not text:
            continue
        classes = " ".join(a.get("class", [])) if isinstance(a.get("class"), list) else str(a.get("class") or "")
        a_id = a.get("id")

        is_cta_text = bool(CTA_TEXT_PATTERN.search(text))
        is_cta_class = bool(CTA_CLASS_PATTERN.search(classes))
        role = a.get("role", "").lower()

        if is_cta_text or is_cta_class or role == "button":
            resolved = resolve_url(href, base_url)
            key = f"a:{text}:{resolved}"
            if key not in seen:
                seen.add(key)
                buttons.append(PageButton(
                    text=text,
                    type="link_cta",
                    href=resolved,
                    onclick=str(a.get("onclick")) if a.get("onclick") else None,
                    id=str(a_id) if a_id else None,
                    class_name=classes if classes else None,
                    is_cta=True,
                ))

    return buttons


def extract_metadata(soup: BeautifulSoup, base_url: str) -> PageMetadata:
    """Extracts SEO metadata, Open Graph, Twitter cards, canonical, language, and favicon."""
    meta = PageMetadata()

    # Title
    if soup.title and soup.title.string:
        meta.title = clean_text(soup.title.string)

    # HTML language
    html_tag = soup.find("html")
    if html_tag and html_tag.get("lang"):
        meta.language = clean_text(html_tag["lang"])

    # Meta tags in head and body
    for m in soup.find_all("meta"):
        name = (m.get("name") or "").strip().lower()
        prop = (m.get("property") or "").strip().lower()
        content = clean_text(m.get("content"))
        charset = m.get("charset")

        if charset and not meta.charset:
            meta.charset = clean_text(charset)

        if not content:
            continue

        if prop.startswith("og:"):
            meta.og_tags[prop] = content
            if prop == "og:title" and not meta.title:
                meta.title = content
            elif prop == "og:description" and not meta.description:
                meta.description = content
        elif name.startswith("twitter:"):
            meta.twitter_tags[name] = content
        elif name == "description":
            meta.description = content
        elif name == "keywords":
            meta.keywords = [k.strip() for k in content.split(",") if k.strip()]
        elif name == "author":
            meta.author = content
        elif name == "robots":
            meta.robots = content
        elif name == "viewport":
            meta.viewport = content
        elif name:
            meta.other_meta[name] = content

    # Canonical link
    canonical = soup.find("link", rel=re.compile(r"canonical", re.I))
    if canonical and canonical.get("href"):
        meta.canonical = resolve_url(canonical["href"], base_url)

    # Favicon
    favicon = soup.find("link", rel=re.compile(r"^(shortcut |apple-touch-)?icon$", re.I))
    if favicon and favicon.get("href"):
        meta.favicon = resolve_url(favicon["href"], base_url)

    return meta


def extract_structured_data(soup: BeautifulSoup) -> StructuredData:
    """Extracts JSON-LD scripts and OpenGraph structured data."""
    json_ld_list: List[Dict[str, Any]] = []

    for script in soup.find_all("script", type="application/ld+json"):
        try:
            raw = script.string or script.get_text()
            if not raw:
                continue
            data = json.loads(raw)
            if isinstance(data, dict):
                json_ld_list.append(data)
            elif isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        json_ld_list.append(item)
        except Exception:
            continue

    # Microdata extraction
    microdata_list: List[Dict[str, Any]] = []
    for item in soup.find_all(attrs={"itemscope": True}):
        item_type = item.get("itemtype")
        props: Dict[str, str] = {}
        for prop in item.find_all(attrs={"itemprop": True}):
            prop_name = prop.get("itemprop")
            prop_val = prop.get("content") or clean_text(prop.get_text()) or prop.get("src") or prop.get("href")
            if prop_name and prop_val:
                props[prop_name] = prop_val
        if props:
            entity = {"type": item_type} if item_type else {}
            entity["properties"] = props
            microdata_list.append(entity)

    return StructuredData(
        json_ld=json_ld_list,
        microdata=microdata_list,
    )


def extract_page_content(soup: BeautifulSoup, url: str) -> PageContent:
    """Extracts clean plain text, word counts, and markdown representation."""
    # Clone soup for plain text extraction
    clone = BeautifulSoup(str(soup), "lxml")
    for el in clone.find_all(["script", "style", "noscript", "template", "svg"]):
        el.decompose()

    body = clone.find("body") or clone
    plain_text = clean_text(body.get_text(separator=" "))
    words = plain_text.split()
    word_count = len(words)
    char_count = len(plain_text)

    # Excerpt (first ~250 chars)
    excerpt = plain_text[:250].strip() + ("..." if len(plain_text) > 250 else "") if plain_text else None

    # Markdown conversion
    markdown = ""
    try:
        from modules.website_collector.vendor.markcrawl.extract_content import html_to_markdown
        _, md, _ = html_to_markdown(str(soup), base_url=url, keep_images=False)
        markdown = md or ""
    except Exception:
        try:
            import markdownify
            markdown = markdownify.markdownify(str(body), heading_style="ATX")
        except Exception:
            markdown = plain_text

    return PageContent(
        markdown=markdown,
        plain_text=plain_text,
        word_count=word_count,
        character_count=char_count,
        excerpt=excerpt,
    )


def parse_page_html(
    html: str,
    url: str,
    status_code: int = 200,
    duration_ms: Optional[float] = None,
    screenshot_path: Optional[str] = None,
    raw_markdown_path: Optional[str] = None,
) -> Tuple[
    PageContent,
    List[PageHeading],
    List[PageLink],
    List[PageImage],
    PageMetadata,
    List[PageForm],
    List[PageButton],
    StructuredData,
]:
    """
    Parses raw HTML and extracts all structured frontend data.
    """
    soup = BeautifulSoup(html, "lxml")
    base_netloc = up.urlsplit(url).netloc

    headings = extract_headings(soup)
    links = extract_links(soup, url, base_netloc)
    images = extract_images(soup, url)
    forms = extract_forms(soup, url)
    buttons = extract_buttons(soup, url)
    metadata = extract_metadata(soup, url)
    structured_data = extract_structured_data(soup)
    content = extract_page_content(soup, url)

    return (
        content,
        headings,
        links,
        images,
        metadata,
        forms,
        buttons,
        structured_data,
    )
