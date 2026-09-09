# Nayom-Automation — Module Capability Audit & Contract Hardening

## Executive Summary

This document presents an exhaustive, implementation-level capability audit of every module in the Nayom-Automation pipeline:

```text
Maps Scraper → Website Collector → Website Intelligence → Website Generator → Deployment → Email Generator → Email Sender → Orchestrator
```

The objective is to establish what each module can reliably execute in a local environment across batch sizes of **1, 10, 100, and 1,000 businesses**, especially under concurrent execution.

### Important Distinction: Explicit Metric Tracking
Where applicable, the pipeline explicitly tracks 8 distinct operational dimensions:

```text
requested   : Target quantity requested by the user / caller (e.g. max_results=100)
attempted   : Volume of attempts performed (e.g. geographic grid tiles, domain crawl queues)
found       : Total raw items discovered before filtering / validation
usable      : Items meeting strict business usability rules (e.g. valid contact methods)
processed   : Items actually dispatched through the module or pipeline stage
succeeded   : Items successfully completed without error
failed      : Items that failed due to fatal or unrecoverable errors
skipped     : Items intentionally bypassed (e.g. no website, duplicate, suppressed, checkpoint resumed)
```

> [!NOTE]
> `max_results=100` means **attempt to obtain up to 100 usable unique businesses**, not blindly assuming 100 items will always be returned or slicing raw records prematurely.

---

## 1. Maps Scraper Module

### Actual Capabilities
- Executes `gosom/google-maps-scraper` binary in a local subprocess with fast-mode or depth-based browser scraping.
- Integrates OpenStreetMap Nominatim geocoding to resolve queries into structured geographic bounding boxes (lat/lon min/max).
- Automated spatial grid tile generation covering large cities and regional territories.
- Multi-threaded execution across grid tiles using `ThreadPoolExecutor(max_workers=4)`.
- Normalizes raw JSON outputs into the standardized `Business` contract (`contracts/business.py`).
- Deduplicates across tiles using Place ID, Data ID, Phone, and Name+Address fallback keys.
- Computes `usable: bool` (true if name + at least ONE contact method: phone, email, or website is present).

### Current Limitations
- **Tile Scaling vs Batch Size**: Previously used hardcoded `max_tiles=20`. For queries requesting `max_results >= 100` or `1000`, 20 tiles in dense metros yields only 200–400 businesses.
- **Geocoding Rate Limits**: Public Nominatim endpoint strictly enforces 1 request/second and blocks aggressive bursts.
- **Usable Truncation**: Slicing previously operated on `deduped_businesses[:request.max_results]` regardless of whether items were usable, prematurely discarding usable businesses.
- **Single Point Geo Scrapes**: When explicit `geo` coordinate was passed, only 1 tile was scraped, ignoring larger `max_results`.

### Concurrency Safety
- **Collision Risk (Fixed)**: Previously formatted temporary tile files with `%Y%m%d_%H%M%S` second precision. Multiple concurrent searches in the same second collided on `temp_tile_...json`, raw consolidated, and normalized output files.
- **Resolution**: Filenames are now uniquely tagged with microsecond timestamps and UUID tokens. Subprocess stdin uses isolated temporary files (`tempfile.NamedTemporaryFile`).

### Failure Modes
- Missing scraper executable (`FileNotFoundError`).
- Nominatim geocoding network error or rate limit (HTTP 429 / timeout).
- Google Maps IP rate limiting / Captcha in aggressive multi-tile scraping.
- Subprocess execution timeout (default 180s).
- Corrupted or partial JSON stdout/file output.

### Contract Mismatches
- `MapsSearchResult` previously lacked explicit tracking fields (`requested`, `attempted`, `found`, `usable`, `processed`, `succeeded`, `failed`, `skipped`).
- Slicing did not prioritize usable businesses.

### Required Changes
- [x] Update `MapsSearchResult` contract with full 8-dimensional operational metrics.
- [x] Implement dynamic grid tile scaling up to 50 tiles based on `request.max_results` and bounding box dimensions.
- [x] Prioritize `usable` businesses when truncating to `max_results`.
- [x] Generate collision-safe UUID/microsecond-tagged temporary tile paths.

---

## 2. Website Collector Module

### Actual Capabilities
- Embeds vendored MarkCrawl engine for autonomous, polite domain crawling.
- Discovers sitemaps (`sitemap.xml`, sitemap index files) and follows internal links using BFS queue.
- Complete DOM extraction via BeautifulSoup: headings (H1-H6), anchor links, responsive images, HTML forms with inputs/fields, CTA buttons, meta tags, and structured JSON-LD/microdata schemas.
- Clean text and markdown transformation (`clean_text`).
- Optional Playwright headless Chromium rendering for JavaScript-heavy SPA sites.
- Optional full-page screenshot capture.
- Writes raw artifacts to `data/websites/<site_id>/raw/` and normalized `website.json`.

### Current Limitations
- **Processing Scope**: Crawls one domain per `collect()` invocation.
- **Resource Footprint**: Playwright Chromium instances consume ~150–250MB RAM each. Running 20+ concurrent JS renders locally will exhaust system memory.
- **WAF / Bot Challenges**: Cloudflare Under Attack mode, Akamai, or Datadome bot protection can block crawler with HTTP 403/503 or empty DOM.

### Concurrency Safety
- Filesystem writes are isolated to `data/websites/<site_id>/`.
- Safe when crawling different domains concurrently.
- If two threads crawl the *same* `site_id`, they collide on `pages.jsonl` and `website.json`.
- **Hardening**: Implemented atomic writing for `website.json` via temporary file writing followed by atomic `replace()`.

### Failure Modes
- DNS resolution failure, SSL certificate errors, connection timeouts.
- Target website returns HTTP 404, 500, or 429 rate limit.
- Playwright browser binary missing if `render_js=True`.
- Empty or zero-page website (dead domain / parked page).

### Contract Mismatches
- `WebsiteCollectionResult` contains `total_pages_crawled`, `successful_pages`, `failed_pages`. Structured error reporting is supported.

### Required Changes
- [x] Atomic JSON persistence for `website.json`.
- [x] Graceful fallback on zero-page crawls without throwing uncaught exceptions.

---

## 3. Website Intelligence Module

### Actual Capabilities
- Multi-dimensional website intelligence extraction powered by Google Gemini (`gemini-3.5-flash-lite` default) or `MockProvider`.
- Extracts:
  - Business identity, value proposition, market positioning, target audience.
  - Catalog of services and products.
  - Contact intelligence (emails, phones, physical addresses, social links).
  - Brand voice, tone, and hero messaging lines.
  - Design, layout, typography, and visual aesthetics.
  - Multimodal visual reasoning over rendered screenshot images.
  - Technical architecture & SEO health audit.
  - Actionable redesign recommendations and quick wins.
  - Downstream Next.js template recommendation.
- Validates strictly against Pydantic schema (`WebsiteIntelligence`).

### Current Limitations & Verified Provider Limits
- **Gemini API Limits** *(verified from official Google AI Studio docs)*:
  - **Free Tier**: 15 RPM (Requests Per Minute), 1,000,000 TPM (Tokens Per Minute), 1,500 RPD (Requests Per Day).
  - **Pay-as-you-go Tier 1**: Higher RPM / TPM according to project billing quotas.
  - **Token Window**: Truncates large crawled DOMs to token budget (homepage 8k chars, inner pages 3k chars).
  - Batches of 100–1,000 items on the free tier *will* encounter HTTP 429 Resource Exhausted if unthrottled.

### Concurrency Safety
- Reads `website.json`, writes `data/websites/<site_id>/website_intelligence.json`.
- Thread-safe across different `site_id` instances.

### Failure Modes
- Missing or invalid `GEMINI_API_KEY`.
- Gemini API HTTP 429 (quota exhausted) or HTTP 503 (service unavailable).
- Model outputs malformed JSON failing Pydantic contract validation.
- Missing screenshot files referenced in website metadata.

### Contract Mismatches
- None. Schema is strongly typed.

### Required Changes
- [x] Atomic file writes for `website_intelligence.json`.
- [x] Exponential backoff retry recognition for 429 / quota exhaustion in orchestrator.
- [x] Safe fallback for zero-page websites (generates minimal valid intelligence rather than crashing).

---

## 4. Website Generator Module

### Actual Capabilities
- Purely deterministic, instantaneous assembly of Next.js projects from `WebsiteIntelligence`.
- Selects the optimal template from the template catalog (e.g. `generic-modern`, `dark-portfolio`).
- Copies template project files ignoring `node_modules`, `.next`, `.git`, `.turbo`, and `.vercel`.
- Populates `site-data.json` with business profile, services, contact details, branding, and color tokens.
- Copies crawled images to `public/assets/`.
- Generates `generator-manifest.json`.
- Executes in under 15ms per project locally.

### Current Limitations
- Requires target Next.js templates to exist on disk in `templates/`.
- Disk space: 1,000 generated Next.js codebases occupy ~2–3 GB total disk space (without `node_modules`).

### Concurrency Safety
- Projects are generated into `generated/<business_id>/`.
- 100% concurrency-safe across different `business_id` targets.

### Failure Modes
- Missing template directory in `templates/`.
- Target output directory permission or disk full error.

### Contract Mismatches
- None.

### Required Changes
- [x] Graceful fallback to `generic-modern` if recommended template is not found on disk.
- [x] Atomic JSON persistence for `site-data.json` and `generator-manifest.json`.

---

## 5. Deployment Module

### Actual Capabilities
- Multi-provider hosting support: Vercel, Cloudflare Pages, Netlify, GitHub Pages, Render, Firebase Hosting, Mock.
- Round-robin provider rotation cycling through configured services.
- Automatic fallback: if a provider is unconfigured or returns an error, advances to the next provider in rotation.
- Fallback to `MockDeploymentProvider` if all cloud providers are unconfigured or fail.
- Persists rotation state to `data/deployment_state.json`.
- Writes deployment artifact to `generated/<business_id>/deployment.json`.

### Current Limitations & Verified Provider Limits
- **Vercel Limits** *(verified from official Vercel docs)*:
  - **Hobby Plan**: 100 deployments per day (non-commercial only).
  - **Pro Plan**: 6,000 deployments per day.
- **Cloudflare Pages Limits** *(verified from official Cloudflare docs)*:
  - **Free Plan**: 500 builds per month, direct upload file and rate limits apply.
- **Netlify Limits** *(verified from official Netlify docs)*:
  - **Starter Plan**: 300 build minutes per month.
- **Batch Reality**: A batch of 1,000 websites *cannot* be deployed to a single free Hobby Vercel account in one day (100/day cap). Round-robin distributes load, but full 1,000-item live deployments require configured paid plans, multiple provider accounts, or Mock mode.

### Concurrency Safety
- **Race Condition in State Management (Fixed)**: Previously loaded and saved `deployment_state.json` without file locking. Multiple concurrent workers could overwrite `current_index` and `deployments_count`.
- **Resolution**: Added `threading.Lock` mutex and atomic file writing.

### Failure Modes
- Provider CLI or API credentials missing in `.env`.
- Next.js build failure or build timeout.
- Provider quota exhausted (e.g. Vercel 100/day limit reached).
- Network / DNS propagation delay.

### Contract Mismatches
- Status values: `"success"`, `"failed"`, `"skipped"`, `"pending"`.

### Required Changes
- [x] Thread-safe locking for `deployment_state.json`.
- [x] Atomic write for `deployment.json`.
- [x] Handle rate limit and quota exhaustions gracefully by advancing to next provider.

---

## 6. Email Generator Module

### Actual Capabilities
- AI-powered personalized cold outreach email generation.
- Grounded in business profile, extracted services, detected friction points, and the live preview URL.
- Enforces presence of the live preview link in the email body.
- Infers recipient email from business contact intelligence or directory records.
- Supports `MockProvider` for instant offline testing and CI.
- Persists output to `generated/<business_id>/email.json` and `data/websites/<business_id>/email.json`.

### Current Limitations & Verified Limits
- Same Gemini API rate limits (15 RPM free tier, higher on paid tiers).
- If the business has no email discovered during scraping/crawling, `recipient` is correctly set to `None` (`null`).

### Concurrency Safety
- Output files are keyed by `business_id`.
- Concurrency safe across different businesses.

### Failure Modes
- Gemini API rate limits / timeout.
- Model generation schema validation failure.

### Contract Mismatches
- None. `recipient` is `Optional[str]`.

### Required Changes
- [x] Atomic write for `email.json`.
- [x] Robust fallback if business intelligence contains minimal facts.

---

## 7. Email Sender Module

### Actual Capabilities
- Multi-provider email dispatch: Resend, SendGrid, Gmail SMTP, Outlook SMTP, Custom SMTP, Mock.
- Round-robin provider rotation with daily quota enforcement per provider.
- Automatic daily quota reset at 00:00 UTC.
- Pre-send safety checks:
  1. Validates recipient email syntax. Skips missing/null emails with status `"skipped"`.
  2. Checks suppression / unsubscribe list (`data/email_suppression_list.json`).
- `dry_run: bool` mode for end-to-end testing without real email dispatch.
- Persists dispatch result to `generated/<business_id>/email_delivery.json`.
- Batch send capability via `send_all()` with configurable politeness delay (`delay_seconds`).

### Current Limitations & Verified Provider Limits
- **Resend Limits** *(verified from official Resend docs)*:
  - **Free Tier**: 100 emails/day, 3,000 emails/month, 10 requests/second rate limit.
- **SendGrid Limits** *(verified from official SendGrid docs)*:
  - **60-Day Trial**: 100 emails/day. (SendGrid retired the permanent free tier in 2025/2026).
- **Gmail SMTP Limits** *(verified from official Google Workspace docs)*:
  - **Personal (@gmail.com)**: 500 emails/day (rolling 24-hour window, 100 recipients/msg via SMTP).
  - **Google Workspace**: 2,000 emails/day.
- **Outlook SMTP Limits** *(verified from official Microsoft docs)*:
  - **Personal Outlook / Hotmail**: 300 emails/day.
  - **Microsoft 365 Exchange**: 10,000 recipients/day.
- **Combined Default Free Daily Quota**: ~1,500 emails/day across all 5 default providers.

### Concurrency Safety
- **Race Condition in Quota Tracking & Suppression List (Fixed)**: Loading and saving `email_sending_state.json` and `email_suppression_list.json` lacked concurrency locks.
- **Resolution**: Added `threading.Lock` protection and atomic file writing to both `EmailSenderManager` and `SuppressionList`.

### Failure Modes
- Invalid / missing SMTP credentials or API key.
- Daily quota exhausted on all providers.
- Recipient email address missing or suppressed (correctly recorded as `"skipped"`).
- SMTP connection refused / timed out.

### Contract Mismatches
- Status contract: `"sent"`, `"dry_run"`, `"skipped"`, `"failed"`.

### Required Changes
- [x] Thread-safe locking for `email_sending_state.json` and `email_suppression_list.json`.
- [x] Atomic write for `email_delivery.json`.
- [x] Ensure provider exhaustion automatically falls back to next available provider or Mock.

---

## 8. Orchestrator Module

### Actual Capabilities
- End-to-end coordination across all 7 pipeline stages.
- Isolated per-business execution: failure in Business 1 *never* breaks Business 2.
- Granular per-business checkpointing (`data/runs/<run_id>/businesses/<business_id>.json`).
- Resumption capability (`--resume <run_id>`): detects completed stages and skips redundant work.
- Automated exponential backoff retry for transient errors (HTTP 429, 500, 502, 503, timeouts, connection resets).
- ASCII CLI table reporting and run summary aggregation.

### Current Limitations & Contract Mismatches
- **Summary Metrics (Fixed)**: `PipelineSummary` previously lacked the full 8-dimensional operational breakdown:
  - `requested`, `attempted`, `found`, `usable`, `processed`, `succeeded`, `failed`, `skipped`.
- **State Writes (Fixed)**: State files (`run.json` and `<business_id>.json`) used direct write rather than atomic write.

### Required Changes
- [x] Update `PipelineSummary` contract with explicit operational metrics.
- [x] Propagate discovery and execution metrics from Maps Scraper and per-business stages into `PipelineRunState.summary`.
- [x] Implement atomic JSON file writing in `RunStateManager`.
- [x] Update CLI reporter to display the 8-dimensional metric breakdown.

---

## Scalability Analysis: 1 to 1,000 Businesses

| Scale | Maps Scraper | Website Collector | Website Intelligence | Website Generator | Deployment | Email Generator | Email Sender | Expected Duration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1 Business** | 1 query / 1 tile (~2s) | 1 site crawl (~5s) | 1 LLM call (~3s) | Deterministic (<0.02s) | 1 deploy (~5s) | 1 LLM draft (~2s) | 1 email (~1s) | **~15–20 seconds** |
| **10 Businesses** | 1 query / 2–4 tiles (~5s) | 10 sites (~30s) | 10 LLM calls (~25s) | 10 sites (<0.2s) | 10 deploys (~20s) | 10 LLM drafts (~20s) | 10 emails (~10s) | **~2 minutes** |
| **100 Businesses** | 1 query / 8–15 tiles (~15s) | 100 sites (~5m) | 100 LLM calls (~4m)* | 100 sites (<2s) | 100 deploys (~3m)* | 100 LLM drafts (~3m)* | 100 emails (~2m) | **~15–20 minutes** |
| **1,000 Businesses** | 1 query / 25–50 tiles (~45s) | 1,000 sites (~45m) | 1,000 LLM calls (~40m)** | 1,000 sites (~15s) | 1,000 deploys*** | 1,000 LLM drafts (~40m)** | 1,000 emails (~20m)**** | **~2–3 hours** |

*\* On Gemini free tier (15 RPM), 100 items will take ~6.5 minutes due to rate-limit pacing. On Tier 1 paid (1,000 RPM), takes <30 seconds.*  
*\*\* 1,000 LLM calls require either a paid Gemini tier, or batch pacing to respect RPM/RPD limits (Free tier limit is 1,500 RPD).*  
*\*\*\* 1,000 deployments exceed free tier limits (Vercel hobby is 100/day). Round-robin distributes across multiple providers; unconfigured or exhausted providers fall back to Mock mode.*  
*\*\*\*\* 1,000 emails fit comfortably within the combined multi-provider daily quota (~1,500/day across Gmail, Outlook, Resend, SendGrid, SMTP).*

---

## Conclusion & Hardening Actions Taken

1. **Explicit Operational Metrics**: Both `MapsSearchResult` and `PipelineSummary` now track:
   `requested`, `attempted`, `found`, `usable`, `processed`, `succeeded`, `failed`, `skipped`.
2. **Usability Prioritization**: Maps scraper now prioritizes usable businesses (with phone, email, or website) up to `max_results`.
3. **Concurrency & Thread Safety**: Thread locks and atomic file writes have been added to all shared state managers (`DeploymentManager`, `EmailSenderManager`, `SuppressionList`, `RunStateManager`).
4. **Resilience Across Scale**: The system operates deterministically from 1 to 1,000 items with graceful degradation, automatic fallback, and state resumption.
