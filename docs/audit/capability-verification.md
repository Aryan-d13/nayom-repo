# Nayom Capability Verification Audit

This document audits the core business capabilities promised by the Nayom-Automation platform. Every claim is cross-referenced against the actual code path, runtime reachability, external side effects, and empirical verification.

---

## 1. Capability Reality Matrix

| Capability | Claimed | Code Exists | Reachable | Real Side Effect | Tested | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Google Maps Discovery** | Discovers businesses across regional territories | Yes (`modules/maps_scraper/`) | Yes (`main.py`, orchestrator) | Spawns `google-maps-scraper.exe`, queries Nominatim, writes raw JSON | Yes (Real subprocess & parsing) | **REAL** |
| **Contact Extraction** | Extracts phone, email, website from Maps records | Yes (`modules/maps_scraper/adapter.py`) | Yes | Parses gosom output; regex for address & phone | Yes | **REAL** |
| **Domain Crawling** | Crawls multi-page websites with sitemap discovery | Yes (`modules/website_collector/collector.py`) | Yes (`main.py`, orchestrator) | Makes HTTP requests, traverses internal links, writes `website.json` | Yes | **REAL** |
| **JS Rendering & Screenshots** | Headless Chromium execution for SPA sites & screenshots | Yes (`modules/website_collector/vendor/markcrawl/`) | Yes (`--render-js`, `--screenshot`) | Launches Playwright browser; captures PNG screenshots | Partial (Requires browser binary download) | **PARTIAL** |
| **AI Multimodal Intelligence** | Analyzes DOM & screenshots via Gemini 3.5 Flash-Lite | Yes (`modules/website_intelligence/`) | Yes (`main.py`, orchestrator) | Invokes Google GenAI API; produces `website_intelligence.json` | Yes (Mock & Live tested) | **REAL** |
| **11 Industry Templates** | 11 tailored Next.js templates for local business verticals | Yes (`templates/`) | Yes (`modules/template_registry/`) | Copies directory tree to `generated/<business_id>/` | Partial (Only 3/11 templates contain React code) | **PARTIAL** |
| **Deterministic Generation** | Assembles Next.js codebase without LLM code hallucination | Yes (`modules/website_generator/`) | Yes (`main.py`, orchestrator) | Generates `site-data.json`, copies assets, creates project | Yes | **REAL** |
| **Template Auto-Selection** | Matches business category to optimal template | Yes (`modules/website_generator/template_selector.py`) | Yes | Returns template metadata | Partial (Selects non-runnable templates for dentists/lawyers) | **BROKEN** |
| **Vercel Cloud Deployment** | Deploys generated Next.js sites to Vercel production | Yes (`modules/deployment/providers/vercel.py`) | Yes | Runs `npx vercel deploy --prod`; patches project SSO settings | Partial (Mock fallback masking) | **REAL** |
| **Cloudflare Pages Deploy** | Deploys static build to Cloudflare edge network | Yes (`modules/deployment/providers/cloudflare.py`) | Yes | Builds project; runs `npx wrangler pages deploy` | Partial | **REAL** |
| **Netlify Deploy** | Deploys to Netlify via REST API ZIP upload | Yes (`modules/deployment/providers/netlify.py`) | Yes | Compresses build to ZIP; POSTs to Netlify REST API | Yes | **REAL** |
| **GitHub Pages Deploy** | Pushes static export to GitHub repository branch | Yes (`modules/deployment/providers/github_pages.py`) | Yes | Rewrites asset paths; runs `npx gh-pages` | Yes | **REAL** |
| **Render Web Service Deploy** | Deploys Next.js site to Render Web Service | Yes (`modules/deployment/providers/render.py`) | Yes | Triggers redeployment hook on existing service ID | Weak (Cannot create dynamic sites) | **STUBBED** |
| **Firebase Hosting Deploy** | Deploys static export to Firebase Hosting CDN | Yes (`modules/deployment/providers/firebase.py`) | Yes | Runs `npx firebase-tools deploy` | Partial | **REAL** |
| **Round-Robin Deploy Rotation** | Rotates across hosting providers automatically | Yes (`modules/deployment/manager.py`) | Yes | Persists `deployment_state.json` with thread locks | Yes | **REAL** |
| **Deployment Failover** | Gracefully falls back to next provider on error | Yes (`modules/deployment/manager.py`) | Yes | Advances to next provider index | MOCKED (Final fallback returns fake success) | **MOCKED** |
| **Personalized Cold Outreach** | Generates tailored outreach email grounded in audit | Yes (`modules/email_generator/`) | Yes | Calls Gemini API; outputs `email.json` | Yes | **REAL** |
| **Live Link Inclusion** | Guarantees deployed preview link is in email body | Yes (`modules/email_generator/generator.py`) | Yes | Enforces URL presence | MOCKED (Injects fake `nayom-preview.pages.dev` on deploy failure) | **MOCKED** |
| **Multi-Provider Email Send** | Dispatches emails across Resend, SendGrid, Gmail, Outlook, SMTP | Yes (`modules/email_sender/`) | Yes | Transmits live HTTP/SMTP messages | Yes | **REAL** |
| **Daily Quota Enforcement** | Tracks daily quota limits per email provider | Yes (`modules/email_sender/manager.py`) | Yes | Persists counts to `email_sending_state.json` | Yes | **REAL** |
| **Suppression / Opt-Out** | Prevents sending to opted-out recipients | Yes (`modules/email_sender/suppression.py`) | Yes | Reads/writes `email_suppression_list.json` | Yes | **REAL** |
| **Concurrent Execution** | Runs multiple businesses simultaneously | Yes (`modules/orchestrator/pipeline.py`) | Yes | `ThreadPoolExecutor` worker dispatch | Yes | **REAL** |
| **State Checkpointing** | Resumes runs from disk checkpoints | Yes (`modules/orchestrator/state.py`) | Yes (`--resume <run_id>`) | Loads `run.json` and skips completed stages | Yes | **REAL** |
| **Live SSE Telemetry** | Streams real-time pipeline events to frontend | Yes (`modules/orchestrator/events.py`, `api/app.py`) | Yes (`EventSource` in Next.js) | Appends to `events.jsonl` and streams SSE chunks | Yes | **REAL** |
| **Live Run Control** | Pauses, resumes, cancels, and retries runs | Yes (`modules/orchestrator/control.py`, `api/app.py`) | Yes (Admin UI buttons) | Threading events control worker loops | Yes | **REAL** |
| **Operations Console** | Next.js 14 real-time admin portal | Yes (`admin/`) | Yes (`npm run dev`) | Renders dashboard, funnels, logs, and business detail | Yes | **REAL** |

---

## 2. Forensic Analysis of Core Promises

### Promise 1: "Discovers local businesses at scale"
* **Claim**: Scrapes 100 to 1,000 businesses across cities/territories.
* **Implementation Path**: `GoogleMapsScraper.search()` -> `NominatimGeocoder.geocode_location_info()` -> `generate_grid_tiles()` -> `ThreadPoolExecutor` running `google-maps-scraper.exe`.
* **Empirical Reality**:
  - Nominatim geocoding limits requests to **1 per second**; geocoding broad regional queries takes 5–15 seconds before scraping starts.
  - Slicing logic correctly prioritizes usable records up to `max_results`.
  - Concurrency safety has been hardened with UUID/microsecond-tagged temporary tile files.
  - **Verdict**: **REAL**.

### Promise 2: "11 Production-Ready Next.js Website Templates"
* **Claim**: The template catalog supports 11 industries with modern Next.js App Router codebases.
* **Implementation Path**: `templates/<industry>/<template_id>/` -> `modules/website_generator/generator.py:_copy_template_files()`.
* **Empirical Reality**:
  - `templates/registry.json` reports: `Total: 11, Valid: 3, Runnable: 3`.
  - Only `generic-modern`, `cyber-brutalist`, and `dark-portfolio` contain `package.json`, `app/page.tsx`, and Next.js dependencies.
  - The other 8 templates are metadata stubs.
  - `TemplateSelector.select_template()` defaults to `only_runnable=False`. When a dentist is processed, it selects `dental-smooth`, copying a stub with no `package.json` into `generated/<business_id>/`.
  - **Verdict**: **PARTIAL / BROKEN TEMPLATE SELECTOR**.

### Promise 3: "Zero-Downtime Multi-Cloud Deployment Engine"
* **Claim**: Automatically deploys sites across Vercel, Cloudflare, Netlify, GitHub Pages, Render, and Firebase with round-robin rotation.
* **Implementation Path**: `DeploymentManager.deploy()` -> Provider adapter -> Subprocess CLI or REST API -> `ensure_static_build()`.
* **Empirical Reality**:
  - `VercelProvider`: Real CLI execution via `npx vercel deploy --prod`.
  - `CloudflarePagesProvider`: Real CLI execution via `npx wrangler pages deploy`.
  - `NetlifyProvider`: Real in-memory ZIP upload to Netlify REST API with CLI fallback.
  - `GitHubPagesProvider`: Real `npx gh-pages` push with asset path rewriting.
  - `RenderProvider`: **STUBBED**. Cannot create new sites; only triggers redeployment of a pre-existing service ID.
  - `FirebaseHostingProvider`: Real `npx firebase-tools deploy` execution.
  - **The Mock Mask**: If all cloud providers fail or credentials are missing, lines 226-234 of `DeploymentManager` catch the error and execute `MockDeploymentProvider.deploy()`, returning `status="success"` with a dummy URL (`https://preview.nayom-automation.local/...`).
  - **Verdict**: **PARTIAL / MOCKED FALLBACK**.

### Promise 4: "Outreach Emails Grounded in Live Previews"
* **Claim**: Generates personalized emails containing the deployed preview URL.
* **Implementation Path**: `EmailGenerator.generate()` -> `_discover_preview_url()`.
* **Empirical Reality**:
  - When deployment succeeds, the real preview URL is passed.
  - When deployment fails or is skipped, `_discover_preview_url()` (lines 216-220 of `modules/email_generator/generator.py`) falls back to:
    ```python
    fallback = f"https://nayom-preview.pages.dev/{business_id or 'demo'}"
    ```
  - This injects a non-existent URL into the email copy sent to real businesses.
  - In `dry_run` mode, if no recipient email was discovered, it fabricates `contact@{domain}`.
  - **Verdict**: **PARTIAL / MOCKED FALLBACK**.

### Promise 5: "Multi-Provider Email Delivery with Quota Tracking"
* **Claim**: Sends cold emails across Resend, SendGrid, Gmail, Outlook, and SMTP, respecting daily limits.
* **Implementation Path**: `EmailSenderManager.send()` -> Provider adapter -> Quota check -> Suppression check.
* **Empirical Reality**:
  - All 5 providers have genuine network implementations (Resend REST API, SendGrid v3 API, Gmail SMTP, Outlook SMTP, Custom SMTP).
  - Quotas are tracked in `data/email_sending_state.json` and reset daily at 00:00 UTC.
  - Suppression list is enforced.
  - **The Mock Mask**: If all providers fail or are unconfigured, line 369 of `EmailSenderManager` falls back to `MockEmailSenderProvider`, recording `status="sent"`.
  - **Verdict**: **REAL (Providers) / MOCKED (Failover Fallback)**.
