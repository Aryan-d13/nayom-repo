# Nayom Codebase Audit — Executive Summary

**Audit Date**: September 2026  
**Auditor**: Senior Systems & Security Architecture Forensic Review  
**Subject**: Nayom Automation System & Control Plane  
**Target Audience**: Senior Engineers, Staff DevOps, Security Engineers, and Engineering Leadership  

---

## The Core Question

> **"If a senior engineer were handed this repository tomorrow, what would they discover actually works?"**

They would discover a sophisticated, highly articulate personal automation codebase possessing an **unusually high degree of architectural polish**, complete with Pydantic v2 contracts, thread-safe atomic file managers, a functional Next.js 14 Operations Console, and an active FastAPI SSE telemetry bus.

However, behind this sophisticated scaffolding lies a stark divide between **locally verified execution** and **cloud-dependent reality**:

1. **What Genuinely Works**:
   - **Phase 1 (Maps Scraper)**: The local `google-maps-scraper.exe` subprocess wrapper, spatial grid tile calculation via OpenStreetMap Nominatim, and deduplicated parsing into `Business` models operate deterministically.
   - **Phase 2 (Website Collector)**: DOM parsing via BeautifulSoup, link extraction, form discovery, and heading mapping work cleanly on standard static HTML sites.
   - **Phase 3 (AI Website Intelligence)**: Google Gemini structured generation (`gemini-3.5-flash-lite`) via `google-genai` reliably extracts business profiles, brand tone, and UX audits into valid Pydantic schemas.
   - **Phase 4 (Website Generator)**: The deterministic file copying and `site-data.json` population work in sub-15ms.
   - **FastAPI Control Plane & Admin UI**: The Next.js 14 dashboard and FastAPI REST/SSE endpoints build and communicate cleanly. Runs can be initiated, paused, resumed, and inspected down to individual business JSON records.
   - **File-Based Checkpoint State Machine**: `RunStateManager` and `EventManager` reliably persist `run.json`, `events.jsonl`, and per-business states using atomic `.tmp` + `replace()` patterns.

2. **What Is Partially Implemented**:
   - **Phase 4 Templates**: While the repository advertises **11 industry templates**, **ONLY 3 ARE RUNNABLE NEXT.JS CODEBASES** (`generic-modern`, `cyber-brutalist`, `dark-portfolio`). The other 8 templates (`dental-smooth`, `construction-craft`, `gym-power`, `lawyer-authority`, `medical-modern`, `realestate-prime`, `restaurant-flavor`, `salon-glow`) are **metadata stubs** lacking `package.json`, `next.config.mjs`, and React components.
   - **Template Selection Bug**: `TemplateSelector.select_template()` defaults to `only_runnable=False`. When an AI model recommends `dental-smooth` for a dentist, the generator copies a stub with no `package.json`. Downstream `npm run build` fails immediately.
   - **Deployment Engine**: While adapters for Vercel, Cloudflare, Netlify, and GitHub Pages contain real CLI/API commands, **Render** cannot deploy arbitrary dynamic Next.js sites (it merely triggers a redeploy of an already existing static service ID), and **all deployment failures silently fall back to `MockDeploymentProvider`**, generating a fake URL (`https://preview.nayom-automation.local/...`).
   - **Website Collector Playwright Support**: Headless Chromium JS rendering and full-page screenshots require local browser binaries that are not installed by default and consume 200MB+ RAM per concurrent worker.

3. **What Is Fake / Mocked / Hollow**:
   - **Silent Mock Fallbacks**: Both `DeploymentManager` and `EmailSenderManager` contain catch-all blocks that catch provider failure or lack of credentials and **silently fall back to Mock providers**, returning `status="success"` or `status="sent"`. This causes the system to record successful deployments and sent emails even when zero external network calls occurred.
   - **Synthetic Fallback URLs in Email Generator**: If deployment fails or is skipped, `modules/email_generator/generator.py:216` invents a fake preview URL (`https://nayom-preview.pages.dev/{business_id}`) and embeds it directly into the generated cold email.
   - **Dry-Run Email Fabrication**: In `dry_run` mode, if a business has no email address discovered, `EmailGenerator._resolve_recipient_email` fabricates an email (`contact@{domain}`) rather than reporting the missing contact method.
   - **Concurrency Testing**: The 122 passing pytest suite does **not** prove multi-worker cloud resilience; `tests/test_concurrency.py` and `tests/test_orchestrator.py` mock all 7 subsystems with `unittest.mock.MagicMock()`.

4. **Critical Security Alert**:
   - **Live Production Credentials in Git**: The repository's `.env` file was committed with live API keys and app passwords (Gemini, Vercel, Cloudflare, Netlify, GitHub PAT, Render, Firebase, Resend, Gmail App Password, Outlook App Password, SendGrid).
   - **Unauthenticated Control Plane**: The FastAPI backend has no authentication or authorization middleware, combined with wildcard CORS (`allow_origins=["*"]`).

---

## High-Level Subsystem Reality Breakdown

| Subsystem | Claimed Capability | Verified Status | Reality & Bottlenecks |
| :--- | :--- | :---: | :--- |
| **Google Maps Scraper** | Multi-tile scraping of 100+ businesses | **REAL** | Subprocess binary execution works. Bounded by Nominatim 1 req/sec rate limit and Google Maps IP captcha on large multi-tile bursts. |
| **Website Collector** | Deep DOM crawler + JS render + screenshots | **PARTIAL** | Python HTTP extraction works. Playwright requires pre-installed browser binaries; heavy memory footprint (1.5GB+ for 5 workers). |
| **Website Intelligence** | Gemini 3.5 Flash-Lite multimodal reasoning | **REAL** | Structured Pydantic extraction works cleanly. Free-tier quota is limited to 15 RPM / 1,500 RPD; unthrottled batches trigger HTTP 429. |
| **Website Generator** | 11 Next.js App Router templates | **PARTIAL** | **Only 3 templates are runnable**. 8 templates are metadata stubs. Generator does not enforce `only_runnable=True`, copying broken stubs. |
| **Deployment Engine** | Round-robin across 6 cloud hosts | **PARTIAL / MOCKED** | Vercel, Cloudflare, Netlify, and GitHub Pages have real CLI logic. Render is stubbed. **All failures silently fall back to Mock**. |
| **Email Generator** | AI personalized outreach drafting | **REAL / PARTIAL** | LLM drafting works. Injects fake `nayom-preview.pages.dev` URLs when deployment is missing. Injects fake recipient emails in dry-run. |
| **Email Sender** | Multi-provider rotation (5 services) | **REAL / MOCKED** | Resend, SendGrid, Gmail, Outlook, SMTP have real network implementations. Quotas tracked. **Exhaustion silently falls back to Mock**. |
| **Orchestrator** | ThreadPool concurrent execution + SSE | **REAL** | ThreadPool dispatch works. Checkpoints resume properly. Windows encoding bugs (`\u2713`) previously crashed terminal loggers. |
| **FastAPI Backend** | Local control plane + SSE streaming | **REAL** | Functional REST & SSE endpoints. Zero authentication; wildcard CORS; file-tailed SSE works via `asyncio.sleep`. |
| **Next.js Admin UI** | Real-time monitoring portal | **REAL** | Clean Next.js 14 App Router dashboard. Compiles cleanly. Matches backend API contracts. |

---

## Most Dangerous Defects & Operational Traps

1. **The "Silent Success" Pipeline Illusion**:
   If an engineer runs the pipeline with missing or expired cloud credentials, the orchestrator does not abort with an error. The deployment manager catches the missing credentials and falls back to `mock`. Downstream, the email generator takes the mock URL, generates an email, and the email sender manager (if SMTP fails) falls back to `mock`. The CLI prints green tables reporting 100% success rate, even though **no website was deployed and no email was sent**.

2. **The Non-Runnable Template Landmine**:
   8 of the 11 template directories in `templates/` lack `package.json` and React code. A business categorized as `dentist` will be assigned `dental-smooth` by the AI analyzer. The generator copies the stub. Downstream deployment attempts `npm run build`, fails with a missing `package.json`, and triggers the silent mock fallback described above.

3. **Windows `charmap` Unicode Crashes**:
   Subprocess output parsing in deployment modules and terminal printing throws `UnicodeEncodeError: 'charmap' codec can't encode character '\u2713'` on default Windows cp1252 consoles when CLI tools output Unicode checkmarks.

4. **Website-Dependent Business Filter**:
   If Google Maps discovers 50 usable businesses that have phone numbers but lack websites, the orchestrator skips `website_collector` ("No website URL"). Because downstream stages require `website_collector == "completed"`, all 50 businesses are skipped entirely from intelligence, generation, and email outreach.

---

## Recommended Remediation Sequence

1. **Security Immediate**: Rotate all API keys, tokens, and app passwords committed in `.env`. Add `.env` to `.gitignore` and enforce template `.env.example`.
2. **Template Hardening**: In `modules/website_generator/generator.py`, force `TemplateSelector.select_template(..., only_runnable=True)` so non-runnable template stubs can never be selected.
3. **Disable Silent Mock Fallbacks in Production Mode**: In `DeploymentManager` and `EmailSenderManager`, disable automatic fallback to `mock` when `dry_run=False` or when cloud deployment is explicitly requested. Let failures be explicit.
4. **Fix Windows Subprocess Encoding**: Set `PYTHONIOENCODING=utf-8` and ensure all `subprocess.run(..., encoding="utf-8", errors="replace")` explicitly ignore non-cp1252 characters.
5. **Add API Token Authentication to Control Plane**: Implement bearer token authentication on FastAPI endpoints to prevent unauthorized local processes from launching campaigns.
