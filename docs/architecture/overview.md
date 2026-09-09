# System Architecture Overview

Nayom is an end-to-end, locally executed personal automation system and control plane designed to automate the discovery, web analysis, redesign, deployment, and outreach lifecycle for local businesses.

---

## 1. System Topology & Runtime Boundaries

The repository contains three primary execution runtimes:

```mermaid
graph TD
    subgraph Browser ["Client Runtime (Web Browser)"]
        UI["Next.js Operations Console (Port 3000)"]
    end

    subgraph ControlPlane ["Control Plane Runtime (Python 3.10+ / FastAPI)"]
        API["FastAPI Control Plane (Port 8000)"]
        RCM["RunControlManager"]
        RSM["RunStateManager"]
        EVM["EventManager"]
    end

    subgraph PipelineWorkers ["Execution Runtime (ThreadPoolExecutor)"]
        PO["PipelineOrchestrator"]
        MS["Phase 1: Maps Scraper Subprocess"]
        WC["Phase 2: Website Collector"]
        WI["Phase 3: Website Intelligence (Gemini)"]
        WG["Phase 4: Website Generator"]
        DM["Phase 5: Deployment Manager"]
        EG["Phase 6: Email Generator (Gemini)"]
        ES["Phase 7: Email Sender"]
    end

    subgraph LocalStorage ["Storage Runtime (Local Filesystem)"]
        RUNS["data/runs/<run_id>/ (run.json, events.jsonl)"]
        WEBSITES["data/websites/<site_id>/ (website.json, raw/)"]
        GENERATED["generated/<biz_id>/ (Next.js projects)"]
        STATE["data/ (deployment_state.json, email_sending_state.json)"]
    end

    UI -->|REST / Control Calls| API
    UI -->|SSE Stream (events.jsonl)| API
    API --> RCM
    RCM -->|Spawns Thread| PO
    PO --> MS
    PO --> WC
    PO --> WI
    PO --> WG
    PO --> DM
    PO --> EG
    PO --> ES
    PO --> RSM
    PO --> EVM
    RSM --> RUNS
    EVM --> RUNS
    WC --> WEBSITES
    WI --> WEBSITES
    WG --> GENERATED
    DM --> STATE
    ES --> STATE
```

---

## 2. Major Subsystems & Responsibilities

### 1. Control Plane & Administration
- **FastAPI Application (`api/app.py`, `api/server.py`)**: Exposes REST endpoints for initiating pipeline runs, querying global statistics, pausing/resuming/canceling runs, performing deep business inspections, and streaming live JSONL events via Server-Sent Events (`text/event-stream`).
- **Next.js Operations Console (`admin/`)**: A Next.js 14 App Router dashboard built with React 18, Tailwind CSS, and Lucide icons. Provides interactive forms with advanced configuration toggles, real-time stage funnels, worker telemetry, live log tailing, and business artifact inspectors.

### 2. The 7-Stage Automation Pipeline
- **Phase 1: Maps Scraper (`modules/maps_scraper/`)**:
  - Executes `gosom/google-maps-scraper` binary in a local subprocess.
  - Queries OpenStreetMap Nominatim to resolve location queries into geographic bounding boxes.
  - Decomposes bounding boxes into dynamic spatial grid tiles (10 to 50 tiles based on requested results).
  - Deduplicates businesses across tiles by Place ID, Data ID, Phone, and Name+Address fallback keys.
  - Normalizes raw records into the `Business` contract (`contracts/business.py`), computing usability (`usable: bool`).
- **Phase 2: Website Collector (`modules/website_collector/`)**:
  - Crawls business domains using the embedded MarkCrawl engine.
  - Discovers sitemaps and traverses internal links with BFS queue up to `max_pages`.
  - Parses DOM with BeautifulSoup4: headings (H1–H6), links, images, forms with inputs, CTAs, and JSON-LD schemas.
  - Optional Playwright headless Chromium execution for SPA JavaScript rendering and full-page PNG screenshots.
  - Outputs raw artifacts to `data/websites/<site_id>/raw/` and consolidated `website.json`.
- **Phase 3: AI Website Intelligence (`modules/website_intelligence/`)**:
  - Extracts multi-dimensional structured intelligence using Google's `gemini-3.5-flash-lite` model.
  - Validates output strictly into the `WebsiteIntelligence` Pydantic contract (`contracts/intelligence.py`).
  - Audits business profile, value proposition, services catalog, brand tone, visual aesthetic, and UX weaknesses.
  - Generates strategic redesign recommendations and template suggestions.
- **Phase 4: Deterministic Website Generator (`modules/website_generator/`)**:
  - Selects the optimal Next.js template from `templates/` using `TemplateSelector`.
  - Deterministically copies project files (ignoring build artifacts) into `generated/<business_id>/`.
  - Populates `site-data.json` with extracted business data, services, contact information, and brand tokens.
  - Copies crawled assets to `public/assets/` and writes `generator-manifest.json`. Completes in <15ms.
- **Phase 5: Multi-Provider Deployment Engine (`modules/deployment/`)**:
  - Supports Vercel, Cloudflare Pages, Netlify, GitHub Pages, Render, and Firebase Hosting.
  - Persists round-robin rotation state in `data/deployment_state.json` with thread locks.
  - Automatically advances to the next provider on failure or rate-limit exhaustion.
  - Writes deployment metadata to `generated/<business_id>/deployment.json`.
- **Phase 6: Personalized Email Generator (`modules/email_generator/`)**:
  - Uses Gemini to draft tailored cold outreach emails grounded in discovered pain points and the live preview URL.
  - Injects business profile details and enforces preview link placement in the email body.
  - Resolves target recipient email from business contact intelligence.
  - Outputs draft to `generated/<business_id>/email.json`.
- **Phase 7: Multi-Provider Email Sender (`modules/email_sender/`)**:
  - Dispatches emails across Resend, SendGrid, Gmail SMTP, Outlook SMTP, and Custom SMTP.
  - Enforces daily quota limits per provider (tracked in `data/email_sending_state.json`).
  - Pre-checks recipient email syntax and checks `data/email_suppression_list.json` before sending.
  - Records delivery outcome in `generated/<business_id>/email_delivery.json`.

### 3. Orchestration & State Management
- **Pipeline Orchestrator (`modules/orchestrator/pipeline.py`)**: Coordinates execution of all 7 stages using `concurrent.futures.ThreadPoolExecutor`. Provides isolated per-business failure boundaries (one business failure never stops the run).
- **Run State Manager (`modules/orchestrator/state.py`)**: Manages run directories (`data/runs/<run_id>/`), writing `run.json` and `<business_id>.json` using atomic temporary file renaming (`.tmp` + `replace()`).
- **Event Manager (`modules/orchestrator/events.py`)**: Appends structured `PipelineEvent` records to `events.jsonl` with thread-safe file locks. Supports live tailing for SSE streams.
- **Run Control Manager (`modules/orchestrator/control.py`)**: Controls background threads using `threading.Event` primitives, supporting pause, resume from checkpoint, cancel, and targeted stage retry.

---

## 3. Concurrency & Data Isolation Model

1. **Per-Business Isolation**: Each business discovered by Maps Scraper receives an independent `BusinessRunState` and is processed as an autonomous unit of work. If Business A crashes during Playwright crawling or Gemini analysis, its state is marked as `failed`, an event is emitted, and Business B continues unaffected.
2. **Worker Pool Concurrency**: The orchestrator spawns a `ThreadPoolExecutor(max_workers=config.concurrency, thread_name_prefix="nayom-biz")`. Concurrency is configurable from 1 to 50 workers (default: 5).
3. **Atomic File Persistence**: Because multiple threads may update run summaries or shared quotas simultaneously, all JSON files representing shared state (`run.json`, `deployment_state.json`, `email_sending_state.json`, `email_suppression_list.json`) use `threading.Lock` mutexes and write to a `.tmp` file before calling `os.replace()` to ensure atomic POSIX/NT filesystem updates.
4. **Append-Only Event Stream**: The event stream uses an append-only JSONL file (`data/runs/<run_id>/events.jsonl`) protected by a per-run reentrant lock (`threading.RLock`). Flush guarantees ensure that SSE stream readers receive live events immediately.
