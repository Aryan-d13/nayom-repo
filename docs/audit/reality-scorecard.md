# Nayom System Scorecard — Technical Reality Evaluation

This scorecard presents an uncompromising, evidence-based evaluation of every core operational layer within the Nayom automation platform.

### Rating Legend
* **REAL**: Fully functional, verified in code, backed by actual operational logic and valid external side effects.
* **PARTIAL**: Partially functional; critical limitations, edge-case failure modes, or missing features exist.
* **MOCKED**: Substituted with synthetic or simulated behavior either by design or via catch-all fallbacks.
* **STUBBED**: Scaffolding or contract interfaces exist with minimal or incomplete backing implementation.
* **BROKEN**: Code exists and attempts execution but fails reliably under standard conditions.
* **DEAD**: Code exists in the repository but is unreachable from any real execution path.
* **UNVERIFIED**: Implementation exists but could not be safely verified due to missing external credentials or environment dependencies.

---

## 1. System Reality Scorecard

| Subsystem / Layer | Claimed Capability | Forensic Verdict | Evidence & Operational Notes |
| :--- | :--- | :---: | :--- |
| **Architecture & Contracts** | Strongly typed Pydantic v2 domain models across 7 pipeline stages | **REAL** | `contracts/` defines complete, valid Pydantic models (`Business`, `WebsiteIntelligence`, `DeploymentResult`, `PipelineRunState`). Strongly typed and consistently imported. |
| **Google Maps Discovery** | Multi-tile geographic grid discovery of local businesses | **REAL** | `modules/maps_scraper/` wraps `google-maps-scraper.exe`. Nominatim geocoding generates spatial grid tiles. Deduplication and normalization to `Business` work as claimed. |
| **Website Crawling** | Autonomous domain crawling with sitemap and DOM extraction | **REAL** | `modules/website_collector/` leverages vendored MarkCrawl and BeautifulSoup4. Page content, metadata, links, forms, and JSON-LD are parsed into `Page` contracts. |
| **Headless JS & Screenshots** | Playwright Chromium headless rendering and full-page PNG capture | **PARTIAL** | Functional when Chromium binaries are present. However, binaries are not bundled (`playwright install` required), and memory overhead (~200MB/worker) threatens local host stability under concurrency. |
| **AI Intelligence Extraction** | Gemini 3.5 Flash-Lite multimodal reasoning and UX audit | **REAL** | `modules/website_intelligence/providers/gemini.py` uses the new `google-genai` SDK with `response_schema` constraints and image parts. Accurately extracts structured intelligence. |
| **Next.js Template Library** | 11 pre-built Next.js App Router website templates | **PARTIAL** | **Only 3 templates are runnable Next.js codebases** (`generic-modern`, `cyber-brutalist`, `dark-portfolio`). The remaining 8 are metadata-only stubs. |
| **Website Assembly Engine** | Deterministic file copying and slot data population | **REAL** | `modules/website_generator/` copies template files and populates `site-data.json` in sub-15ms. Works reliably when targeting the 3 runnable templates. |
| **Template Selector** | Dynamic metadata-driven template matching | **BROKEN** | `TemplateSelector.select_template()` does not enforce `only_runnable=True`. When matching industries like dentists or law, it selects non-runnable stub folders that break downstream builds. |
| **Vercel Deployment** | Native Next.js deployment via Vercel CLI | **REAL** | Executes `npx vercel deploy --prod` in subprocess. Captures stdout URL and patches SSO deployment protection via REST API. |
| **Cloudflare Pages Deployment** | Edge deployment via Wrangler CLI and REST API | **REAL** | Triggers `ensure_static_build()`, ensures project exists via Cloudflare REST API, and deploys static export via `wrangler pages deploy`. |
| **Netlify Deployment** | Native deployment via direct ZIP REST API upload | **REAL** | Zips static export in-memory and POSTs directly to Netlify REST API endpoints (`/api/v1/sites/{site_id}/deploys`). Functional fallback to CLI. |
| **GitHub Pages Deployment** | Static branch deployment to designated repository | **REAL** | Prepares `.nojekyll`, rewrites HTML subpaths to avoid underscore filtering, and pushes to repository via `npx gh-pages`. |
| **Render Deployment** | Native Web Service deployment via Render API | **STUBBED** | Cannot deploy arbitrary new dynamic sites. Only triggers redeployment of a pre-existing `RENDER_SERVICE_ID`. Speculative `.onrender.com` URL generation. |
| **Firebase Deployment** | Static hosting via `firebase-tools` CLI | **REAL** | Generates minimal `firebase.json` and runs `npx firebase-tools deploy --only hosting`. |
| **Deployment Fallback** | Graceful failover between cloud providers | **MOCKED** | If cloud credentials fail or are unconfigured, `DeploymentManager` silently falls back to `MockDeploymentProvider`, reporting success with a non-working local URL. |
| **Outreach Email Generator** | AI personalized cold outreach email generation | **REAL** | Generates persuasive cold email drafts grounded in extracted business pain points and live URLs. |
| **Preview URL Resolution** | Injects live deployed URL into outreach email | **MOCKED** | If deployment failed or was skipped, `EmailGenerator` invents a fake preview URL (`https://nayom-preview.pages.dev/{business_id}`) and embeds it in the email. |
| **Email Recipient Resolution** | Infers real business contact emails | **PARTIAL** | Extracts verified emails from crawled DOM. In `dry_run` mode, fabricates fake emails (`contact@{domain}`) if no email was found. |
| **Email Provider Rotation** | Daily quota-managed dispatch across 5 providers | **REAL** | Resend, SendGrid, Gmail, Outlook, and SMTP implementations connect to actual APIs/servers. Quota tracking with UTC daily resets operates properly. |
| **Email Sender Fallback** | Fallback to next provider when quotas are reached | **MOCKED** | If all providers are unconfigured or fail, `EmailSenderManager` silently falls back to `MockEmailSenderProvider`, recording emails as "sent". |
| **Suppression Management** | Local opt-out suppression list enforcement | **REAL** | `SuppressionList` maintains thread-safe, atomic JSON persistence in `data/email_suppression_list.json` and successfully blocks suppressed recipients. |
| **Concurrent Orchestration** | Multi-worker parallel processing of businesses | **REAL** | `ThreadPoolExecutor` concurrent execution works. Businesses run in isolation; checkpointing prevents redundant work on resumption. |
| **State & Checkpoint Persistence**| Atomic file-based state machine | **REAL** | `RunStateManager` uses atomic write patterns (`.tmp` + `replace()`) with `threading.Lock` protection across `run.json` and `<biz_id>.json`. |
| **Structured Event Telemetry** | Append-only durable event logging | **REAL** | `EventManager` appends valid JSONL to `data/runs/<run_id>/events.jsonl` with flush guarantees. |
| **SSE Streaming** | Real-time Server-Sent Events stream for admin UI | **REAL** | FastAPI `StreamingResponse` tails `events.jsonl` with keep-alive headers and clean disconnect handling. |
| **Run Lifecycle Control** | Live pause, resume, cancel, and stage retry | **REAL** | `RunControlManager` uses `threading.Event` primitives and check-and-wait loops. Reliably pauses and cancels background workers. |
| **FastAPI Control Plane** | Admin REST API | **REAL** | Comprehensive endpoint suite. Fully functional, but completely unauthenticated with wildcard CORS. |
| **Next.js Admin Console** | Real-time monitoring portal | **REAL** | Production-ready Next.js 14 App Router portal. Valid TypeScript, builds cleanly with `next build`, communicates directly with FastAPI. |
| **Pytest Test Suite** | Automated test verification | **PARTIAL** | 122 tests pass, but integration tests heavily mock external dependencies (`MagicMock`). High assertion quality on contracts; low assertion quality on live cloud adapters. |
| **Security & Credential Safety** | Safe handling of production secrets | **BROKEN** | Live production API keys and SMTP credentials were committed directly to `.env` in the repository root. |

---

## 2. Dimension Breakdown

```text
Dimension              Score      Status
---------------------------------------------------------
Architecture           10 / 10    REAL
Persistence & State     9 / 10    REAL
Local Modules (Ph 1-3)  9 / 10    REAL
Templates (Phase 4)     3 / 10    PARTIAL (3/11 runnable)
Cloud Deployment        5 / 10    PARTIAL / MOCKED
Email Delivery          7 / 10    REAL / MOCKED
Control Plane & UI      9 / 10    REAL
Test Reality            5 / 10    PARTIAL (Heavy mocking)
Security Posture        2 / 10    BROKEN (Credentials in Git)
```
