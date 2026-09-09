import argparse
import sys
import json
import logging
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Ensure UTF-8 output encoding on Windows to prevent charmap codec crashes on unicode checkmarks
if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from contracts.maps import MapsSearchRequest
from contracts.website import WebsiteCollectionRequest
from contracts.orchestrator import PipelineRunConfig
from config.settings import WEBSITES_DATA_DIR, GENERATED_DIR, GEMINI_MODEL, DEFAULT_AI_PROVIDER
from modules.maps_scraper import GoogleMapsScraper
from modules.website_collector import WebsiteCollector
from modules.website_intelligence import WebsiteIntelligenceAnalyzer, get_provider
from modules.website_generator import WebsiteGenerator
from modules.deployment import DeploymentManager
from modules.email_generator import EmailGenerator
from modules.email_sender import EmailSenderManager
from modules.orchestrator import PipelineOrchestrator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")




def is_deployment_target(target: str) -> bool:
    """Checks if target points to a generated website project directory."""
    t = target.strip()
    p = Path(t)
    if p.is_dir() and (p / "site-data.json").exists():
        return True
    if (GENERATED_DIR / t).exists() and (GENERATED_DIR / t / "site-data.json").exists():
        return True
    if p.is_file() and p.name in ("deployment.json", "generator-manifest.json", "site-data.json"):
        return True
    return False


def is_email_json_target(target: str) -> bool:
    """Checks if target points to an email.json file or business directory with email.json."""
    t = target.strip()
    p = Path(t)
    if p.is_file() and p.name == "email.json":
        return True
    if p.is_dir() and (p / "email.json").exists():
        return True
    if (GENERATED_DIR / t / "email.json").exists():
        return True
    return False



def is_intelligence_json_target(target: str) -> bool:
    """Checks if the target argument points to a website_intelligence.json file."""
    t = target.strip()
    p = Path(t)
    if p.is_file() and ("intelligence" in p.name.lower() or p.name.endswith(".json")):
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
            if "business_profile" in data or "template_recommendation" in data or "analysis" in data:
                return True
        except Exception:
            pass
    if p.is_dir() and (p / "website_intelligence.json").exists():
        return True
    if (WEBSITES_DATA_DIR / t / "website_intelligence.json").exists():
        return True
    return False


def is_website_json_target(target: str) -> bool:
    """Checks if the target argument points to a website.json file, site directory, or site ID."""
    t = target.strip()
    p = Path(t)
    if p.is_file() and p.name == "website.json":
        return True
    if p.is_file() and p.name.endswith(".json"):
        return True
    if p.is_dir() and (p / "website.json").exists():
        return True
    if (WEBSITES_DATA_DIR / t / "website.json").exists():
        return True
    return False


def is_url_target(target: str) -> bool:
    """Checks if the command line argument is a website URL rather than a Maps search query."""
    t = target.strip().lower()
    return t.startswith(("http://", "https://", "www.")) or (
        "." in t and not any(space in t for space in (" in ", " near ", " at ", " "))
    )


def format_maps_table_row(name: str, category: str, phone: str, website: str, rating: str, city: str, usable: str) -> str:
    def truncate(s: str, max_len: int) -> str:
        return (s[:max_len - 3] + "...") if len(s) > max_len else s

    return f"| {truncate(name, 28):<28} | {truncate(category, 18):<18} | {truncate(phone, 16):<16} | {truncate(website, 24):<24} | {truncate(rating, 6):<6} | {truncate(city, 12):<12} | {usable:<6} |"


def format_website_table_row(url: str, title: str, words: str, headings: str, links: str, images: str, forms: str, ctas: str, status: str) -> str:
    def truncate(s: str, max_len: int) -> str:
        return (s[:max_len - 3] + "...") if len(s) > max_len else s

    return f"| {truncate(url, 32):<32} | {truncate(title, 26):<26} | {words:<7} | {headings:<8} | {links:<6} | {images:<6} | {forms:<5} | {ctas:<5} | {status:<6} |"


def run_website_collection(args, target_url: str):
    max_pages = 0 if args.all else args.max_results

    print("\n" + "=" * 80)
    print(" Nayom-Automation - Full Website Collector (MarkCrawl Engine)")
    print("=" * 80)
    print(f"Target URL:   {target_url}")
    print(f"Max Pages:    {'ALL (Unlimited)' if max_pages == 0 else max_pages}")
    print(f"JS Render:    {args.render_js}")
    print(f"Screenshots:  {args.screenshot}")
    print(f"Sitemap:      {not args.no_sitemap}")
    print(f"Concurrency:  {args.concurrency}")
    print("-" * 80 + "\n")

    request = WebsiteCollectionRequest(
        url=target_url,
        max_pages=max_pages if max_pages > 0 else 10000,
        render_js=args.render_js,
        screenshot=args.screenshot,
        concurrency=args.concurrency,
        timeout=args.timeout,
        use_sitemap=not args.no_sitemap,
        download_images=args.download_images,
    )

    collector = WebsiteCollector()
    try:
        result = collector.collect(request)
    except Exception as e:
        print(f"\n[ERROR] Website collection failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 122)
    print(format_website_table_row("URL", "Title", "Words", "Headings", "Links", "Images", "Forms", "CTAs", "Status"))
    print("|" + "-" * 34 + "|" + "-" * 28 + "|" + "-" * 9 + "|" + "-" * 10 + "|" + "-" * 8 + "|" + "-" * 8 + "|" + "-" * 7 + "|" + "-" * 7 + "|" + "-" * 8 + "|")

    for page in result.pages:
        ctas_count = sum(1 for b in page.buttons if b.is_cta)
        status_str = "OK" if page.is_success else f"ERR {page.status_code or ''}".strip()
        print(format_website_table_row(
            url=page.url,
            title=page.title or "N/A",
            words=str(page.content.word_count if page.content else 0),
            headings=str(len(page.headings)),
            links=str(len(page.links)),
            images=str(len(page.images)),
            forms=str(len(page.forms)),
            ctas=str(ctas_count),
            status=status_str,
        ))

    print("=" * 122 + "\n")
    print(f"Site ID:              {result.site_id}")
    print(f"Domain:               {result.domain}")
    print(f"Primary Title:        {result.site_title or 'N/A'}")
    print(f"Total Pages Crawled:  {result.total_pages_crawled}")
    print(f"Successful Pages:     {result.successful_pages}")
    print(f"Failed Pages:         {result.failed_pages}")
    print(f"Duration:             {result.duration_seconds} seconds")
    print(f"Raw Output Dir:       {result.raw_output_dir}")
    print(f"Normalized JSON:      {result.website_json_path}")
    print("=" * 80 + "\n")


def run_maps_search(args):
    max_results = 0 if args.all else args.max_results

    print("\n" + "=" * 80)
    print(" Nayom-Automation - Google Maps Full-Territory Scraper (Phase 1)")
    print("=" * 80)
    print(f"Query:        {args.query}")
    print(f"Coverage:     Full Geographic Territory (Auto Bounding-Box Grid)")
    print(f"Max Results:  {'ALL (Unlimited)' if max_results == 0 else max_results}")
    print(f"Fast Mode:    {not args.no_fast_mode}")
    if args.geo:
        print(f"Manual Geo:   {args.geo}")
    print("-" * 80 + "\n")

    request = MapsSearchRequest(
        query=args.query,
        max_results=max_results,
        geo=args.geo,
        zoom=args.zoom,
        radius=args.radius or 10000.0,
        extract_email=args.email,
        fast_mode=not args.no_fast_mode,
    )

    scraper = GoogleMapsScraper()
    try:
        result = scraper.search(request)
    except Exception as e:
        print(f"\n[ERROR] Scraper failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 122)
    print(format_maps_table_row("Name", "Category", "Phone", "Website", "Rating", "City", "Usable"))
    print("|" + "-" * 30 + "|" + "-" * 20 + "|" + "-" * 18 + "|" + "-" * 26 + "|" + "-" * 8 + "|" + "-" * 14 + "|" + "-" * 8 + "|")

    for biz in result.businesses:
        print(format_maps_table_row(
            name=biz.name or "N/A",
            category=biz.category or "N/A",
            phone=biz.phone or "N/A",
            website=biz.website or "N/A",
            rating=str(biz.rating) if biz.rating is not None else "N/A",
            city=biz.city or "N/A",
            usable="YES" if biz.usable else "NO",
        ))

    print("=" * 122 + "\n")
    print(f"Total Discovered:    {result.total_found}")
    print(f"Usable for Outreach: {result.usable_count} (has phone, email, or website)")
    print(f"Duration:            {result.duration_seconds} seconds")
    print(f"Raw Data Saved:      {result.raw_file_path}")
    print(f"Normalized JSON:     {result.normalized_file_path}")
    print("=" * 80 + "\n")


def run_website_intelligence(args, target_path: str):
    provider_name = args.provider or DEFAULT_AI_PROVIDER
    model_name = args.model or GEMINI_MODEL

    print("\n" + "=" * 80)
    print(f" Nayom-Automation - AI Website Intelligence ({model_name})")
    print("=" * 80)
    print(f"Target Input:       {target_path}")
    print(f"Provider:           {provider_name}")
    print(f"Model:              {model_name}")
    print(f"Max Screenshots:    {args.max_screenshots}")
    print("-" * 80 + "\n")

    try:
        provider = get_provider(
            provider_name=provider_name,
            model_name=model_name,
        )
        analyzer = WebsiteIntelligenceAnalyzer(provider=provider)
        intel = analyzer.analyze(
            source=target_path,
            output_path=args.output,
            max_screenshots=args.max_screenshots,
        )
    except Exception as e:
        print(f"\n[ERROR] Website Intelligence failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 80)
    print(f" SITE INTELLIGENCE REPORT: {intel.site_id.upper()}")
    print("=" * 80)
    bp = intel.business_profile
    print(f"\n[BUSINESS PROFILE]")
    print(f"  Name:        {bp.business_name or 'N/A'}")
    print(f"  Tagline:     {bp.tagline or 'N/A'}")
    print(f"  Industry:    {bp.industry_category or 'N/A'}")
    print(f"  Audience:    {bp.target_audience}")
    print(f"  Value Prop:  {bp.value_proposition}")
    if bp.key_differentiators:
        print(f"  Differentiators:")
        for diff in bp.key_differentiators[:3]:
            print(f"    * {diff}")

    ci = intel.contact_intelligence
    print(f"\n[CONTACT & PRESENCE]")
    print(f"  Emails:      {', '.join(ci.emails) if ci.emails else 'None found'}")
    print(f"  Phones:      {', '.join(ci.phones) if ci.phones else 'None found'}")
    loc_parts = [x for x in [ci.city, ci.state_or_region, ci.country] if x]
    print(f"  Location:    {', '.join(loc_parts) if loc_parts else 'Not specified'}")
    if ci.social_links:
        print(f"  Socials:     {', '.join(f'{s.platform}: {s.url}' for s in ci.social_links)}")

    dux = intel.design_and_ux
    print(f"\n[DESIGN & UX EVALUATION]")
    print(f"  Aesthetic:   {dux.visual_aesthetic}")
    print(f"  Typography:  {dux.typography_assessment}")
    print(f"  Visuals:     {'Screenshots Analyzed' if dux.visual_inputs_analyzed else 'Text / DOM Analysis'}")
    if dux.screenshot_observations:
        print(f"  Visual Notes:")
        for obs in dux.screenshot_observations[:3]:
            print(f"    * {obs}")
    if dux.strengths:
        print(f"  Strengths:")
        for s in dux.strengths[:3]:
            print(f"    + {s}")
    if dux.weaknesses:
        print(f"  Weaknesses:")
        for w in dux.weaknesses[:3]:
            print(f"    - {w}")

    ts = intel.technical_and_seo
    print(f"\n[TECHNICAL & SEO]")
    print(f"  Inferred Stack: {', '.join(ts.inferred_tech_stack) if ts.inferred_tech_stack else 'N/A'}")
    print(f"  SEO Health:     {ts.seo_health}")

    rr = intel.redesign_recommendations
    print(f"\n[REDESIGN RECOMMENDATIONS]")
    print(f"  Verdict:        {rr.overall_redesign_verdict}")
    if rr.quick_wins:
        print(f"  Quick Wins:")
        for qw in rr.quick_wins[:3]:
            print(f"    -> {qw}")
    if rr.rebuild_opportunities:
        print(f"  Rebuild Avenues:")
        for ro in rr.rebuild_opportunities[:3]:
            print(f"    -> {ro}")

    tr = intel.template_recommendation
    print(f"\n[TEMPLATE RECOMMENDATION]")
    print(f"  Recommended:    {tr.recommended_template}")
    print(f"  Category:       {tr.template_category}")
    print(f"  Style:          {tr.style_direction}")
    print(f"  Layout Pattern: {tr.layout_pattern}")
    print(f"  Confidence:     {int(tr.template_confidence * 100)}%")
    if tr.key_sections:
        print(f"  Key Sections:   {', '.join(tr.key_sections)}")
    if tr.reasoning:
        print(f"  Rationale:      {tr.reasoning}")

    print("\n" + "=" * 80)
    print(f" Provider:              {intel.metadata.provider} ({intel.metadata.model})")
    print(f" Screenshots Processed: {intel.metadata.screenshots_processed}")
    print(f" Duration:              {intel.metadata.duration_seconds}s")
    out_dest = args.output or f"data/websites/{intel.site_id}/website_intelligence.json"
    print(f" Output JSON:           {out_dest}")
    print("=" * 80 + "\n")


def run_website_generation(args, target_path: str):
    print("\n" + "=" * 80)
    print(" Nayom-Automation - Deterministic Next.js Website Generator (Phase 4)")
    print("=" * 80)
    print(f"Target Intelligence: {target_path}")
    if args.template:
        print(f"Template Override:   {args.template}")
    print("-" * 80 + "\n")

    try:
        generator = WebsiteGenerator()
        res = generator.generate(
            source=target_path,
            output_dir=args.output,
            template_override=args.template,
        )
    except Exception as e:
        print(f"\n[ERROR] Website Generation failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 80)
    print(f" NEXT.JS WEBSITE GENERATED: {res.business_id.upper()}")
    print("=" * 80)
    print(f"  Business ID:       {res.business_id}")
    print(f"  Selected Template: {res.template_name} ({res.template_id})")
    print(f"  Output Project:    {res.output_dir}")
    print(f"  Site Data:         {res.site_data_path}")
    print(f"  Manifest:          {res.manifest_path}")
    print(f"  Slots Populated:   {res.slots_populated}")
    print(f"  Generated At:      {res.generated_at}")
    print("-" * 80)
    print("\nTo run the generated Next.js website locally:")
    print(f"  cd \"{res.output_dir}\"")
    print("  npm install   # or: pnpm install")
    print("  npm run dev   # or: pnpm dev")
    print("  Open http://localhost:3000 in your browser")
    print("=" * 80 + "\n")


def run_website_deployment(args, target_path: str):
    print("\n" + "=" * 80)
    print(" Nayom-Automation - Multi-Provider Deployment Module (Phase 5)")
    print("=" * 80)
    print(f"Target Project:     {target_path}")
    if args.provider:
        print(f"Provider Override:  {args.provider}")
    else:
        print(f"Provider Selection: Round-Robin (Vercel -> Cloudflare -> Netlify -> GitHub -> Render -> Firebase)")
    print("-" * 80 + "\n")

    try:
        manager = DeploymentManager()
        result = manager.deploy(
            target=target_path,
            provider_override=args.provider,
        )
    except Exception as e:
        print(f"\n[ERROR] Deployment failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 80)
    print(f" DEPLOYMENT RESULT: {result.business_id.upper()}")
    print("=" * 80)
    print(f"  Business ID:       {result.business_id}")
    print(f"  Hosting Provider:  {result.provider.upper()}")
    print(f"  Status:            {result.status.upper()}")
    print(f"  Live Website URL:  {result.url or 'N/A'}")
    print(f"  Deployment ID:     {result.deployment_id or 'N/A'}")
    print(f"  Duration:          {result.duration_seconds}s")
    print(f"  Deployed At:       {result.deployed_at}")
    if result.warnings:
        print("  Warnings:")
        for w in result.warnings:
            safe_w = str(w).encode("ascii", errors="backslashreplace").decode("ascii")
            print(f"    * {safe_w}")
    if result.error:
        safe_err = str(result.error).encode("ascii", errors="backslashreplace").decode("ascii")
        print(f"  Error:             {safe_err}")
    print("-" * 80)
    dest_json = f"generated/{result.business_id}/deployment.json"
    print(f" Deployment Record: {dest_json}")
    print("=" * 80 + "\n")


def run_email_generation(args, target_path: str):
    provider_name = args.provider or DEFAULT_AI_PROVIDER
    model_name = args.model or GEMINI_MODEL
    preview_url = getattr(args, "preview_url", None)
    recipient = getattr(args, "recipient", None)

    print("\n" + "=" * 80)
    print(f" Nayom-Automation - Personalized Outreach Email Generator ({model_name})")
    print("=" * 80)
    print(f"Target Input:       {target_path}")
    print(f"Provider:           {provider_name}")
    print(f"Model:              {model_name}")
    if preview_url:
        print(f"Preview URL:        {preview_url}")
    if recipient:
        print(f"Recipient:          {recipient}")
    print("-" * 80 + "\n")

    try:
        generator = EmailGenerator(
            provider_name=provider_name,
            model_name=model_name,
        )
        email = generator.generate(
            target=target_path,
            preview_url=preview_url,
            recipient=recipient,
            output_path=args.output,
        )
    except Exception as e:
        print(f"\n[ERROR] Email Generation failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 80)
    print(f" OUTREACH EMAIL GENERATED: {email.business_id.upper()}")
    print("=" * 80)
    print(f"  Business:          {email.business_name or email.business_id}")
    print(f"  Recipient:         {email.recipient or 'None found (null)'}")
    print(f"  Subject:           {email.subject}")
    print(f"  Preview URL:       {email.preview_url}")
    print(f"  Model:             {email.model} ({email.provider})")
    print(f"  Generated At:      {email.generated_at}")
    if email.key_improvements:
        print(f"  Key Upgrades:")
        for imp in email.key_improvements:
            print(f"    * {imp}")
    print("-" * 80)
    print("\n[EMAIL BODY]")
    print("-" * 80)
    print(email.body)
    print("-" * 80)
    dest_json = args.output or f"generated/{email.business_id}/email.json"
    print(f" Output JSON:        {dest_json}")
    print("=" * 80 + "\n")


def run_email_sending(args, target_path: Optional[str] = None):
    is_batch = getattr(args, "all", False)
    dry_run = getattr(args, "dry_run", False)
    provider_override = getattr(args, "provider", None)
    force = getattr(args, "force", False)
    delay = getattr(args, "delay", None)

    print("\n" + "=" * 80)
    print(" Nayom-Automation - Multi-Provider Email Sender Module (Phase 7)")
    print("=" * 80)
    if is_batch:
        print("Mode:               BATCH SEND (--all)")
    else:
        print(f"Target Input:       {target_path}")
    print(f"Dry Run:            {dry_run}")
    print(f"Force Send:         {force}")
    if provider_override:
        print(f"Provider Override:  {provider_override}")
    else:
        print(f"Provider Selection: Round-Robin (Resend -> SendGrid -> Gmail -> Outlook -> SMTP)")
    print("-" * 80 + "\n")

    manager = EmailSenderManager()

    if is_batch:
        results = manager.send_all(
            provider_override=provider_override,
            dry_run=dry_run,
            force=force,
            delay_seconds=delay,
        )
        print("\n" + "=" * 115)
        print(f"| {'Business ID':<26} | {'Recipient':<28} | {'Provider':<12} | {'Message ID':<24} | {'Status':<10} |")
        print("|" + "-" * 28 + "|" + "-" * 30 + "|" + "-" * 14 + "|" + "-" * 26 + "|" + "-" * 12 + "|")
        for r in results:
            biz_str = (r.business_id[:23] + "...") if len(r.business_id) > 26 else r.business_id
            recip_str = (r.recipient[:25] + "...") if r.recipient and len(r.recipient) > 28 else (r.recipient or "N/A")
            msg_str = (r.message_id[:21] + "...") if r.message_id and len(r.message_id) > 24 else (r.message_id or "N/A")
            print(f"| {biz_str:<26} | {recip_str:<28} | {r.provider:<12} | {msg_str:<24} | {r.status.upper():<10} |")
        print("=" * 115 + "\n")
        total = len(results)
        sent = sum(1 for r in results if r.status in ("sent", "dry_run"))
        skipped = sum(1 for r in results if r.status == "skipped")
        failed = sum(1 for r in results if r.status == "failed")
        print(f"Summary: Total Processed: {total} | Sent/Simulated: {sent} | Skipped: {skipped} | Failed: {failed}\n")
        return

    if not target_path:
        print("[ERROR] Target email.json path or business ID is required unless --all is specified.", file=sys.stderr)
        sys.exit(1)

    try:
        res = manager.send(
            target=target_path,
            provider_override=provider_override,
            dry_run=dry_run,
            force=force,
        )
    except Exception as e:
        print(f"\n[ERROR] Email Sending failed: {e}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 80)
    print(f" EMAIL DELIVERY OUTCOME: {res.business_id.upper()}")
    print("=" * 80)
    print(f"  Business ID:       {res.business_id}")
    print(f"  Recipient:         {res.recipient or 'None (null)'}")
    print(f"  Status:            {res.status.upper()}")
    print(f"  Provider Used:     {res.provider.upper()}")
    print(f"  Message ID:        {res.message_id or 'N/A'}")
    print(f"  Timestamp:         {res.sent_at}")
    print(f"  Duration:          {res.duration_seconds}s")
    if res.warnings:
        print("  Warnings:")
        for w in res.warnings:
            print(f"    * {w}")
    if res.error:
        print(f"  Error:             {res.error}")
    print("-" * 80)
    dest_json = f"generated/{res.business_id}/email_delivery.json"
    print(f" Delivery Record:    {dest_json}")
    print("=" * 80 + "\n")


def format_template_table_row(t_id: str, name: str, category: str, style: str, runnable: str, status: str, path: str) -> str:
    def truncate(s: str, max_len: int) -> str:
        return (s[:max_len - 3] + "...") if len(s) > max_len else s

    return f"| {truncate(t_id, 20):<20} | {truncate(name, 32):<32} | {truncate(category, 22):<22} | {truncate(style, 16):<16} | {runnable:<8} | {status:<8} | {truncate(path, 34):<34} |"


def run_template_management(args):
    from modules.template_registry import TemplateRegistry
    registry = TemplateRegistry()

    action = (getattr(args, "action", "") or "list").lower().strip()
    query = getattr(args, "query", "") or ""

    if action == "list":
        templates = registry.all_templates
        if getattr(args, "runnable", False):
            templates = registry.runnable_templates

        print("\n" + "=" * 155)
        print(" Nayom-Automation - Next.js Website Template Registry")
        print("=" * 155)
        print(f" Total Templates:    {len(registry.all_templates)}")
        print(f" Contract Valid:     {len(registry.valid_templates)}")
        print(f" Runnable Next.js:   {len(registry.runnable_templates)}")
        print(f" Registry Cache:     templates/registry.json (rebuildable cache)")
        print(f" Source of Truth:    templates/ directory tree")
        print("-" * 155)
        print(format_template_table_row("Template ID", "Name", "Category / Industry", "Style", "Runnable", "Status", "Directory Path"))
        print("|" + "-" * 22 + "|" + "-" * 34 + "|" + "-" * 24 + "|" + "-" * 18 + "|" + "-" * 10 + "|" + "-" * 10 + "|" + "-" * 36 + "|")

        for t in templates:
            cats = ", ".join(t.categories[:2]) if t.categories else (t.industry or "generic")
            styles = ", ".join(t.style_keywords[:2]) if t.style_keywords else "modern"
            runnable_str = "YES" if t.is_runnable else "NO"
            status_str = "VALID" if t.is_valid else "STUB"
            rel_path = t.template_dir or ""
            if "templates" in rel_path:
                rel_path = "templates" + rel_path.split("templates", 1)[1].replace("\\", "/")
            print(format_template_table_row(t.id, t.name, cats, styles, runnable_str, status_str, rel_path))

        print("=" * 155 + "\n")

    elif action == "search":
        search_query = query or getattr(args, "term", "") or ""
        industry = getattr(args, "industry", None)
        style = getattr(args, "style", None)
        layout = getattr(args, "layout", None)
        only_runnable = getattr(args, "runnable", False)

        results = registry.search(
            query=search_query,
            industry=industry,
            style=style,
            layout=layout,
            only_runnable=only_runnable,
        )

        print("\n" + "=" * 90)
        print(f" Nayom-Automation - Template Search: '{search_query or industry or style or layout or 'all'}'")
        print("=" * 90)
        print(f" Matching Templates Found: {len(results)}\n")

        if not results:
            print(" No templates matched your search criteria. Run 'python main.py templates list' to see all available templates.")
        else:
            for i, t in enumerate(results, start=1):
                status_desc = "VALID & RUNNABLE NEXT.JS" if t.is_runnable else "CONTRACT STUB (not yet runnable)"
                rel_path = t.template_dir or ""
                if "templates" in rel_path:
                    rel_path = "templates" + rel_path.split("templates", 1)[1].replace("\\", "/")
                print(f" [{i}] {t.id} - {t.name}")
                print(f"     Status:         {status_desc}")
                print(f"     Version:        {t.version}")
                print(f"     Directory:      {rel_path}")
                print(f"     Categories:     {', '.join(t.categories)}")
                print(f"     Industries:     {', '.join(t.industries)}")
                print(f"     Styles:         {', '.join(t.style_keywords)}")
                print(f"     Layouts:        {', '.join(t.layout_patterns)}")
                print(f"     Features:       {', '.join(t.supported_features)}")
                print(f"     Description:    {t.description}")
                print("-" * 90)

        print("=" * 90 + "\n")

    elif action == "validate":
        print("\n" + "=" * 90)
        print(" Nayom-Automation - Template Library Contract Validator")
        print("=" * 90)
        print(" Scanning template contracts across filesystem tree...\n")

        reports = registry.validate_all()
        for r in reports:
            prefix = "[*]" if r.is_valid else "[!]"
            status_text = "VALID (Runnable Next.js Project)" if r.is_runnable else ("VALID CONTRACT STUB" if r.is_valid else "INCOMPLETE / INVALID")
            rel_dir = r.template_dir
            if "templates" in rel_dir:
                rel_dir = "templates" + rel_dir.split("templates", 1)[1].replace("\\", "/")

            print(f" {prefix} {r.template_id} ({rel_dir})")
            print(f"     Status:   {status_text}")
            if r.checks_passed:
                print(f"     Passed:   {', '.join(r.checks_passed[:5])}{'...' if len(r.checks_passed) > 5 else ''}")
            if r.errors:
                print("     Errors:")
                for e in r.errors:
                    print(f"       x {e}")
            if r.warnings:
                print("     Warnings:")
                for w in r.warnings:
                    print(f"       ! {w}")
            print("-" * 90)

        valid_cnt = sum(1 for r in reports if r.is_valid)
        runnable_cnt = sum(1 for r in reports if r.is_runnable)
        print("\n" + "=" * 90)
        print(" VALIDATION SUMMARY")
        print("=" * 90)
        print(f"  Total Discovered:   {len(reports)}")
        print(f"  Contract Valid:     {valid_cnt}")
        print(f"  Runnable Next.js:   {runnable_cnt}")
        print(f"  Stubs / Incomplete: {len(reports) - runnable_cnt}")
        print("=" * 90 + "\n")

    elif action == "inspect":
        from modules.template_registry import TemplateImporter
        importer = TemplateImporter(registry=registry)
        target = query or getattr(args, "target", "") or ""
        if not target:
            print("[ERROR] A template path or GitHub repository URL is required. Example: python main.py templates inspect ./my-template", file=sys.stderr)
            sys.exit(1)

        res = importer.inspect(target)
        print("\n" + "=" * 90)
        print(" Nayom-Automation - Template Inspection Report")
        print("=" * 90)
        print(f"  Target Source:      {res.source}")
        print(f"  Source Accessible:  {'YES' if res.is_valid_source else 'NO'}")
        print(f"  Manifest:           {'Found (nayom.template.json)' if res.manifest_found else 'MISSING (nayom.template.json not found)'}")
        print(f"  Manifest Valid:     {'YES' if res.manifest_valid else 'NO'}")
        if res.manifest:
            m = res.manifest
            print(f"  Template ID:        {m.id}")
            print(f"  Name:               {m.name}")
            print(f"  Version:            {m.version}")
            print(f"  Description:        {m.description}")
            print(f"  Industry:           {', '.join(m.industries_list)}")
            print(f"  Categories:         {', '.join(m.categories)}")
            print(f"  Styles:             {', '.join(m.styles)}")
            print(f"  Layouts:            {', '.join(m.layouts)}")
            print(f"  Features:           {', '.join(m.features)}")
            if m.slots_dict:
                slot_strs = [f"{k} ({v})" for k, v in list(m.slots_dict.items())[:6]]
                print(f"  Declared Slots:     {', '.join(slot_strs)}{'...' if len(m.slots_dict) > 6 else ''}")

        print("-" * 90)
        print(f"  Framework:          {res.framework_version or ('Next.js' if res.is_nextjs else 'Unknown / Not Next.js')}")
        print(f"  Entrypoint:         {res.entrypoint_path} ({'Found on disk' if res.entrypoint_found else 'MISSING on disk'})")
        if res.detected_components:
            print(f"  Components ({len(res.detected_components)}):    {', '.join(res.detected_components[:8])}{'...' if len(res.detected_components) > 8 else ''}")
        if res.detected_features:
            print(f"  Detected Features:  {', '.join(res.detected_features)}")
        if res.detected_issues:
            print("  Detected Issues:")
            for issue in res.detected_issues:
                print(f"    x {issue}")

        print("-" * 90)
        print(f"  Ready to Import:    {'YES' if res.ready_to_import else 'NO'}")
        if not res.manifest_found:
            print("\n  [GUIDANCE] To prepare this template for import, add a 'nayom.template.json' manifest:")
            print("  {")
            print('    "id": "my-template-id",')
            print('    "name": "My Template Name",')
            print('    "version": "1.0.0",')
            print('    "description": "Template description",')
            print('    "industry": ["dental"],')
            print('    "categories": ["dentist"],')
            print('    "styles": ["minimal", "premium", "light"],')
            print('    "layouts": ["hero-services-testimonials-contact"],')
            print('    "features": ["booking", "testimonials", "faq", "contact"],')
            print('    "entrypoint": "app/page.tsx",')
            print('    "slots": { "hero.title": "string", "services": "service[]" }')
            print("  }")
        print("=" * 90 + "\n")

    elif action == "add":
        from modules.template_registry import TemplateImporter
        importer = TemplateImporter(registry=registry)
        target = query or getattr(args, "target", "") or ""
        if not target:
            print("[ERROR] A template path or GitHub repository URL is required. Example: python main.py templates add ./my-template", file=sys.stderr)
            sys.exit(1)

        print("\n" + "=" * 90)
        print(" Nayom-Automation - Template Onboarding Importer")
        print("=" * 90)
        print(f" Source:           {target}")
        print(f" Non-interactive:  {getattr(args, 'non_interactive', False)}")
        print(f" Force overwrite:  {getattr(args, 'force', False)}")
        print("-" * 90)

        style_list = [s.strip() for s in args.style.split(",")] if getattr(args, "style", None) else None
        layout_list = [l.strip() for l in args.layout.split(",")] if getattr(args, "layout", None) else None
        feat_list = [f.strip() for f in args.features.split(",")] if getattr(args, "features", None) else None

        res = importer.import_template(
            source=target,
            industry_override=getattr(args, "industry", None),
            category_override=getattr(args, "category", None),
            id_override=getattr(args, "id", None),
            name_override=getattr(args, "name", None),
            style_override=style_list,
            layout_override=layout_list,
            features_override=feat_list,
            non_interactive=getattr(args, "non_interactive", False),
            force=getattr(args, "force", False),
        )

        if not res.is_success:
            print(f"\n[ERROR] Template import failed for '{res.template_id}':", file=sys.stderr)
            for err in res.errors:
                print(f"  x {err}", file=sys.stderr)
            if res.warnings:
                print("  Warnings:", file=sys.stderr)
                for w in res.warnings:
                    print(f"    ! {w}", file=sys.stderr)
            print("=" * 90 + "\n", file=sys.stderr)
            sys.exit(1)

        print("\n" + "=" * 90)
        print(f" TEMPLATE IMPORTED & REGISTERED: {res.template_id.upper()}")
        print("=" * 90)
        print(f"  Template ID:     {res.template_id}")
        if res.manifest:
            print(f"  Name:            {res.manifest.name}")
            print(f"  Industry:        {', '.join(res.manifest.industries_list)}")
            print(f"  Categories:      {', '.join(res.manifest.categories)}")
            print(f"  Styles:          {', '.join(res.manifest.styles)}")
            print(f"  Layouts:         {', '.join(res.manifest.layouts)}")
        print(f"  Destination:     {res.target_dir}")
        print(f"  Status:          VALID & RUNNABLE NEXT.JS TEMPLATE")
        print(f"  Registry Cache:  Rebuilt (templates/registry.json)")
        if res.warnings:
            print("  Warnings:")
            for w in res.warnings:
                print(f"    ! {w}")
        print("-" * 90)
        print(f"Template '{res.template_id}' is ready for website generation!")
        print("=" * 90 + "\n")

    elif action in ("rebuild", "index", "sync"):
        print("\n" + "=" * 80)
        print(" Nayom-Automation - Template Registry Cache Rebuild")
        print("=" * 80)
        index = registry.discover_and_rebuild()
        print(f" Scanned template directory:  {registry.templates_dir}")
        print(f" Rebuilt index cache at:      {registry.registry_file}")
        print(f" Total templates discovered:  {index.total_templates}")
        print(f" Valid templates:             {index.valid_templates}")
        print(f" Runnable Next.js templates:  {index.runnable_templates}")
        print("=" * 80 + "\n")

    else:
        print(f"[ERROR] Unknown templates action '{action}'. Available actions: list, search, inspect, add, validate, rebuild", file=sys.stderr)
        sys.exit(1)


def run_pipeline(args):
    query = getattr(args, "query", "") or ""
    resume_id = getattr(args, "resume", None)

    if not query and not resume_id:
        print("[ERROR] A search query (e.g. 'dentists in Austin Texas') or --resume <run_id> is required.", file=sys.stderr)
        sys.exit(1)

    limit = getattr(args, "limit", 20)
    concurrency = getattr(args, "concurrency", 5)

    config = PipelineRunConfig(
        query=query,
        limit=limit,
        concurrency=concurrency,
        dry_run=getattr(args, "dry_run", False),
        resume_run_id=resume_id,
        ai_provider=getattr(args, "ai_provider", None),
        email_provider=getattr(args, "email_provider", None),
        deploy_provider=getattr(args, "deploy_provider", None),
        template_override=getattr(args, "template", None),
        max_retries=getattr(args, "max_retries", 2),
        delay_seconds=getattr(args, "delay", 0.0) or 0.0,
        fast_mode=not getattr(args, "no_fast_mode", False),
        render_js=getattr(args, "render_js", False),
        screenshot=getattr(args, "screenshot", False),
    )

    orchestrator = PipelineOrchestrator()
    try:
        run_state = orchestrator.run(config)
        if run_state.status == "failed" and run_state.errors:
            sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Pipeline run failed: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Nayom-Automation: Local Business, Intelligence, Generator, Deployment & Email CLI"
    )
    # Check if first argument is a sub-command like 'templates', 'run', 'server', 'deploy', 'email', 'send-email'
    if len(sys.argv) > 1 and sys.argv[1].lower() in ("templates", "template"):
        tpl_parser = argparse.ArgumentParser(description="Nayom-Automation Next.js Website Template Registry & Management")
        tpl_parser.add_argument("command", help="'templates'")
        tpl_parser.add_argument("action", nargs="?", default="list", help="Action: 'list', 'search', 'inspect', 'add', 'validate', 'rebuild'")
        tpl_parser.add_argument("query", nargs="?", default="", help="Search query, keyword, local path, or GitHub URL")
        tpl_parser.add_argument("--industry", type=str, default=None, help="Industry vertical(s)")
        tpl_parser.add_argument("--category", type=str, default=None, help="Business category")
        tpl_parser.add_argument("--id", type=str, default=None, help="Template ID override")
        tpl_parser.add_argument("--name", type=str, default=None, help="Template human-readable name override")
        tpl_parser.add_argument("--style", type=str, default=None, help="Style keywords (comma-separated)")
        tpl_parser.add_argument("--layout", type=str, default=None, help="Layout patterns (comma-separated)")
        tpl_parser.add_argument("--features", type=str, default=None, help="Supported features (comma-separated)")
        tpl_parser.add_argument("--non-interactive", action="store_true", help="Fail if required manifest details cannot be inferred")
        tpl_parser.add_argument("--force", action="store_true", help="Force overwrite existing template ID")
        tpl_parser.add_argument("--runnable", action="store_true", help="Only show fully runnable Next.js templates")
        t_args = tpl_parser.parse_args()
        run_template_management(t_args)
        return
    elif len(sys.argv) > 1 and sys.argv[1].lower() in ("server", "api"):
        server_parser = argparse.ArgumentParser(description="Start Nayom-Automation Control Plane API Server")
        server_parser.add_argument("command", help="'server' or 'api'")
        server_parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address (default: 127.0.0.1)")
        server_parser.add_argument("--port", type=int, default=8000, help="Port number (default: 8000)")
        server_parser.add_argument("--reload", action="store_true", help="Enable live auto-reload for development")
        srv_args = server_parser.parse_args()
        from api.server import start_server
        start_server(host=srv_args.host, port=srv_args.port, reload=srv_args.reload)
        return
    elif len(sys.argv) > 1 and sys.argv[1].lower() == "run":
        # Handle 'python main.py run "query"' and 'python main.py run --resume <id>'
        run_parser = argparse.ArgumentParser(description="End-to-End Nayom-Automation Pipeline Orchestrator")
        run_parser.add_argument("command", help="'run'")
        run_parser.add_argument("query", nargs="?", default="", help="Search query (e.g. 'dentists in Austin Texas')")
        run_parser.add_argument("-n", "--limit", "--max-results", dest="limit", type=int, default=20, help="Max businesses to process (default: 20)")
        run_parser.add_argument("-c", "--concurrency", type=int, default=5, help="Concurrent businesses to process (default: 5)")
        run_parser.add_argument("--dry-run", action="store_true", help="Simulate email sending without real network transmission")
        run_parser.add_argument("--resume", type=str, default=None, help="Resume an existing run by run ID (e.g. --resume run_20260822_173000_...)")
        run_parser.add_argument("-p", "--provider", "--ai-provider", dest="ai_provider", type=str, default=None, help="AI provider ('gemini', 'mock')")
        run_parser.add_argument("--email-provider", type=str, default=None, help="Email provider ('gmail', 'resend', 'mock', etc.)")
        run_parser.add_argument("--deploy-provider", type=str, default=None, help="Deployment provider ('vercel', 'cloudflare', 'mock', etc.)")
        run_parser.add_argument("-t", "--template", type=str, default=None, help="Website template override")
        run_parser.add_argument("--max-retries", type=int, default=2, help="Max transient error retries (default: 2)")
        run_parser.add_argument("--delay", type=float, default=0.0, help="Delay in seconds between businesses")
        run_parser.add_argument("--no-fast-mode", action="store_true", help="Disable fast mode for Maps scraper")
        run_parser.add_argument("--render-js", action="store_true", help="Enable JavaScript rendering for website collection")
        run_parser.add_argument("--screenshot", action="store_true", help="Enable screenshots for website collection")
        r_args = run_parser.parse_args()
        run_pipeline(r_args)
        return
    elif len(sys.argv) > 1 and sys.argv[1].lower() == "deploy":
        # Handle 'python main.py deploy <target>'
        deploy_parser = argparse.ArgumentParser(description="Deploy a generated Next.js website")
        deploy_parser.add_argument("command", help="'deploy'")
        deploy_parser.add_argument("target", help="Path to generated project or business ID (e.g. 'generated/aryansharmaswe_vercel_app')")
        deploy_parser.add_argument("-p", "--provider", type=str, default=None, help="Hosting provider override ('vercel', 'cloudflare', 'netlify', 'github_pages', 'render', 'firebase', 'mock')")
        d_args = deploy_parser.parse_args()
        run_website_deployment(d_args, d_args.target)
        return
    elif len(sys.argv) > 1 and sys.argv[1].lower() == "email":
        # Handle 'python main.py email <target>'
        email_parser = argparse.ArgumentParser(description="Generate personalized outreach email for a business")
        email_parser.add_argument("command", help="'email'")
        email_parser.add_argument("target", help="Path to project dir, business ID, or website_intelligence.json")
        email_parser.add_argument("-p", "--provider", type=str, default=None, help="AI Provider ('gemini', 'mock')")
        email_parser.add_argument("-m", "--model", type=str, default=None, help=f"AI model identifier (default: {GEMINI_MODEL})")
        email_parser.add_argument("-o", "--output", type=str, default=None, help="Custom destination path for email.json")
        email_parser.add_argument("--preview-url", type=str, default=None, help="Override deployed live preview URL")
        email_parser.add_argument("--recipient", type=str, default=None, help="Override recipient email address")
        e_args = email_parser.parse_args()
        run_email_generation(e_args, e_args.target)
        return
    elif len(sys.argv) > 1 and sys.argv[1].lower() in ("send-email", "send_email", "sendemail"):
        # Handle 'python main.py send-email <target>' and 'python main.py send-email --all'
        send_parser = argparse.ArgumentParser(description="Send outreach emails via multi-provider sender")
        send_parser.add_argument("command", help="'send-email'")
        send_parser.add_argument("target", nargs="?", default=None, help="Path to generated/<business-id>/email.json or business ID")
        send_parser.add_argument("--all", action="store_true", help="Send emails across all generated businesses")
        send_parser.add_argument("--dry-run", action="store_true", help="Simulate email sending without making network calls")
        send_parser.add_argument("-p", "--provider", type=str, default=None, help="Provider override ('resend', 'sendgrid', 'gmail', 'outlook', 'smtp', 'mock')")
        send_parser.add_argument("--delay", type=float, default=None, help="Pause in seconds between sends in batch mode")
        send_parser.add_argument("--force", action="store_true", help="Force send even if suppressed or previously sent")
        s_args = send_parser.parse_args()
        run_email_sending(s_args, s_args.target)
        return

    parser.add_argument("query", help="Target URL, website.json, website_intelligence.json, generated/<id>, or Maps query")
    parser.add_argument("-n", "--max-results", type=int, default=50, help="Max results / pages to collect (default: 50, use 0 or --all for unlimited)")
    parser.add_argument("--all", action="store_true", help="Scrape/crawl all available records/pages")
    
    # Maps-specific options
    parser.add_argument("-g", "--geo", type=str, default=None, help="Optional manual override coordinates 'lat,lon' (Maps only)")
    parser.add_argument("-r", "--radius", type=float, default=None, help="Optional manual override radius in meters (Maps only)")
    parser.add_argument("-z", "--zoom", type=int, default=14, help="Map zoom level (default: 14)")
    parser.add_argument("--no-fast-mode", action="store_true", help="Disable fast mode and use browser-based crawl (Maps only)")
    parser.add_argument("--email", action="store_true", help="Extract emails from business websites (Maps only)")
    
    # Website Collector options
    parser.add_argument("--render-js", action="store_true", help="Enable JavaScript rendering with Playwright (Website only)")
    parser.add_argument("--screenshot", action="store_true", help="Capture full-page screenshots (Website only)")
    parser.add_argument("--concurrency", type=int, default=5, help="Concurrent crawl workers (Website only, default: 5)")
    parser.add_argument("--timeout", type=int, default=20, help="Request timeout in seconds (default: 20)")
    parser.add_argument("--no-sitemap", action="store_true", help="Disable sitemap-based discovery (Website only)")
    parser.add_argument("--download-images", action="store_true", help="Download content images to raw/assets/ (Website only)")

    # AI Website Intelligence, Generator, Deployment & Email options
    parser.add_argument("-p", "--provider", type=str, default=None, help="AI, Deployment or Email Provider ('gemini', 'mock', 'vercel', 'resend', etc.)")
    parser.add_argument("-m", "--model", type=str, default=None, help=f"AI model identifier (default: {GEMINI_MODEL})")
    parser.add_argument("-o", "--output", type=str, default=None, help="Custom output path for generated files")
    parser.add_argument("--max-screenshots", type=int, default=5, help="Max screenshots to pass for visual multimodal analysis (default: 5)")

    # Website Generator, Deployment & Email options
    parser.add_argument("-t", "--template", type=str, default=None, help="Manual template override for website generator (e.g. 'generic-modern', 'dark-portfolio')")
    parser.add_argument("--generate", action="store_true", help="Force Website Generator execution")
    parser.add_argument("--deploy", action="store_true", help="Force Deployment execution on target project")
    parser.add_argument("--email-gen", action="store_true", help="Force Outreach Email Generator execution")
    parser.add_argument("--send-email", action="store_true", help="Force Email Sender execution on target email.json")
    parser.add_argument("--dry-run", action="store_true", help="Simulate email sending without real network transmission")
    parser.add_argument("--force", action="store_true", help="Force re-send or bypass suppression")
    parser.add_argument("--delay", type=float, default=None, help="Delay in seconds between email sends")
    parser.add_argument("--preview-url", type=str, default=None, help="Override deployed live preview URL for email generator")
    parser.add_argument("--recipient", type=str, default=None, help="Override recipient email address for email generator")

    args = parser.parse_args()

    if args.send_email or is_email_json_target(args.query):
        run_email_sending(args, args.query)
    elif args.email_gen:
        run_email_generation(args, args.query)
    elif args.deploy or (args.query.startswith("generated/") and is_deployment_target(args.query)):
        run_website_deployment(args, args.query)
    elif args.generate or is_intelligence_json_target(args.query):
        run_website_generation(args, args.query)
    elif is_website_json_target(args.query):
        run_website_intelligence(args, args.query)
    elif is_url_target(args.query):
        target_url = args.query.strip()
        if not target_url.startswith(("http://", "https://")):
            target_url = f"https://{target_url}"
        run_website_collection(args, target_url)
    else:
        run_maps_search(args)


if __name__ == "__main__":
    main()


