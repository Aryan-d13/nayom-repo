# Python Architecture & Pipeline Subsystems

The core automation engine of Nayom is composed of 9 modular Python subsystems organized under `modules/` and governed by strongly typed Pydantic contracts in `contracts/`.

---

## 1. Subsystem Architecture Map

```text
modules/
├── maps_scraper/             # Phase 1: Google Maps subprocess scraper & geocoding
├── website_collector/        # Phase 2: Autonomous crawler & DOM extractor (MarkCrawl)
├── website_intelligence/     # Phase 3: Gemini 3.5 Flash-Lite multimodal reasoning
├── website_generator/        # Phase 4: Deterministic Next.js project assembly
├── deployment/               # Phase 5: Multi-provider hosting deployment engine
├── email_generator/          # Phase 6: AI personalized outreach email drafter
├── email_sender/             # Phase 7: Quota-managed multi-provider email dispatcher
├── orchestrator/             # E2E pipeline coordinator, state machine & event bus
└── template_registry/        # Next.js website template catalog & validator
```

---

## 2. Deep Subsystem Specifications

### Subsystem 1: Maps Scraper (`modules/maps_scraper/`)
* **Responsibility**: Discovers local businesses in target territories by executing the `gosom/google-maps-scraper` binary across automatically generated spatial grid tiles.
* **Entry Point**: `GoogleMapsScraper.search(request: MapsSearchRequest) -> MapsSearchResult`.
* **Public Interface**:
  - `GoogleMapsScraper`: Main subprocess wrapper.
  - `NominatimGeocoder`: Resolves location queries into geographic bounding boxes.
  - `normalize_raw_records()`: Normalizes raw gosom JSON dictionaries into `Business` contract objects.
* **Internal Dependencies**: `contracts.maps`, `contracts.business`, `config.settings`.
* **External Dependencies**: `google-maps-scraper.exe`, OpenStreetMap Nominatim API, `urllib.request`.
* **Data Transformation**:
  $$\text{Query String} \xrightarrow{\text{Nominatim}} \text{Bounding Box} \xrightarrow{\text{Grid}} \text{Tiles} \xrightarrow{\text{Scraper Subprocess}} \text{Raw JSON} \xrightarrow{\text{Adapter}} \text{List[Business]}$$
* **Usability Rule**: A record is tagged `usable = True` if and only if `name` is present AND at least ONE contact method (`phone` OR `email` OR `website`) exists.
* **Failure Modes**:
  - Missing scraper binary (`FileNotFoundError`).
  - Nominatim rate limiting (HTTP 429) if queried more than 1 request/second.
  - Google Maps IP captcha challenge during aggressive multi-tile scraping.
* **Side Effects**: Writes raw scraper outputs to `data/raw/<search_id>_raw.json` and clean normalized records to `data/normalized/<search_id>.json`.

---

### Subsystem 2: Website Collector (`modules/website_collector/`)
* **Responsibility**: Crawls business domains, discovers sitemaps, traverses internal pages, and extracts frontend DOM structure, forms, and metadata.
* **Entry Point**: `WebsiteCollector.collect(request: WebsiteCollectionRequest) -> WebsiteCollectionResult`.
* **Public Interface**:
  - `WebsiteCollector`: High-level crawler coordinator.
  - `parse_page_html()`: HTML parser extracting headings, links, images, forms, CTAs, and JSON-LD.
  - `clean_text()`: HTML-to-markdown text transformer.
* **Internal Dependencies**: `contracts.website`, `config.settings`, `modules.website_collector.vendor.markcrawl`.
* **External Dependencies**: `beautifulsoup4`, `lxml`, `playwright` (optional), `markdownify`.
* **Data Transformation**:
  $$\text{Website URL} \xrightarrow{\text{MarkCrawl}} \text{Raw HTML} \xrightarrow{\text{BeautifulSoup4}} \text{Structured Page Objects} \xrightarrow{\text{Consolidation}} \text{website.json}$$
* **Failure Modes**:
  - DNS resolution failure, SSL certificate errors, or network timeouts.
  - Anti-bot challenges (Cloudflare Under Attack, Akamai) returning HTTP 403/503.
  - Missing Playwright browser binaries when `render_js=True`.
* **Side Effects**: Writes crawled page artifacts to `data/websites/<site_id>/raw/` and consolidated metadata to `data/websites/<site_id>/website.json`.

---

### Subsystem 3: Website Intelligence (`modules/website_intelligence/`)
* **Responsibility**: Performs deep multimodal reasoning over crawled website text, structured metadata, and screenshots to extract business profiles, brand tone, and strategic redesign recommendations.
* **Entry Point**: `WebsiteIntelligenceAnalyzer.analyze(source, provider, ...) -> WebsiteIntelligence`.
* **Public Interface**:
  - `WebsiteIntelligenceAnalyzer`: Core analyzer coordinator.
  - `GeminiProvider`: Google Gemini implementation using `google-genai` SDK (`gemini-3.5-flash-lite`).
  - `MockProvider`: Offline synthetic intelligence generator.
* **Internal Dependencies**: `contracts.intelligence`, `config.settings`.
* **External Dependencies**: `google-genai`, `pydantic`.
* **Data Transformation**:
  $$\text{website.json} + \text{Screenshots} \xrightarrow{\text{Gemini Multimodal}} \text{Raw JSON} \xrightarrow{\text{Pydantic Validation}} \text{WebsiteIntelligence}$$
* **Failure Modes**:
  - Missing or invalid `GEMINI_API_KEY`.
  - Gemini API rate limits (15 RPM free tier quota exhaustion).
  - Schema validation failure if LLM output omits mandatory fields.
* **Side Effects**: Writes structured intelligence to `data/websites/<site_id>/website_intelligence.json`.

---

### Subsystem 4: Website Generator (`modules/website_generator/`)
* **Responsibility**: Deterministically assembles a complete Next.js App Router codebase from `WebsiteIntelligence` without using LLMs to mutate React code.
* **Entry Point**: `WebsiteGenerator.generate(source, output_dir, ...) -> WebsiteGenerationResult`.
* **Public Interface**:
  - `WebsiteGenerator`: Assembly orchestrator.
  - `TemplateSelector`: Matches intelligence recommendations to available templates in `templates/`.
  - `SlotPopulator`: Populates template slot data into `site-data.json`.
* **Internal Dependencies**: `contracts.generator`, `contracts.intelligence`, `modules.template_registry`.
* **External Dependencies**: Standard library `shutil`, `json`, `pathlib`.
* **Execution Duration**: Runs deterministically in **under 15ms** per website.
* **Critical Trap**: If `select_template()` selects a non-runnable template stub (e.g. `dental-smooth`), the copied directory lacks `package.json`.
* **Side Effects**: Creates a complete project folder in `generated/<business_id>/`, writing `site-data.json` and `generator-manifest.json`.

---

### Subsystem 5: Deployment Engine (`modules/deployment/`)
* **Responsibility**: Deploys generated Next.js codebases across cloud hosting providers with persistent round-robin rotation and automatic failover.
* **Entry Point**: `DeploymentManager.deploy(target, provider_override) -> DeploymentResult`.
* **Public Interface**:
  - `DeploymentManager`: Round-robin rotation coordinator with thread-safe locking.
  - `VercelProvider`: Native Vercel deployment via `npx vercel deploy --prod`.
  - `CloudflarePagesProvider`: Direct upload edge deployment via `npx wrangler pages deploy`.
  - `NetlifyProvider`: Direct ZIP archive upload to Netlify REST API.
  - `GitHubPagesProvider`: Static deployment to GitHub branch via `npx gh-pages`.
  - `RenderProvider`: Triggers redeploy of existing service ID (Stubbed).
  - `FirebaseHostingProvider`: Static deployment via `npx firebase-tools`.
  - `MockDeploymentProvider`: Generates local preview URLs for testing.
* **Internal Dependencies**: `contracts.deployment`, `config.settings`.
* **External Dependencies**: Node.js CLI tools (`npx`), `requests`, `urllib.request`.
* **Side Effects**: Writes deployment metadata to `generated/<business_id>/deployment.json` and updates `data/deployment_state.json`.

---

### Subsystem 6: Email Generator (`modules/email_generator/`)
* **Responsibility**: Uses Gemini to draft highly personalized cold outreach emails grounded in discovered UX friction points and the deployed preview link.
* **Entry Point**: `EmailGenerator.generate(target, preview_url, ...) -> OutreachEmail`.
* **Public Interface**:
  - `EmailGenerator`: Drafter coordinator.
* **Internal Dependencies**: `contracts.email`, `contracts.intelligence`, `contracts.business`.
* **External Dependencies**: `google-genai`, `pydantic`.
* **Data Transformation**:
  $$\text{WebsiteIntelligence} + \text{Preview URL} \xrightarrow{\text{Gemini Prompt}} \text{OutreachEmail (Subject, Body, Improvements)}$$
* **Critical Trap**: Injects fake `https://nayom-preview.pages.dev/{biz_id}` URLs when deployment is missing.
* **Side Effects**: Writes draft to `generated/<business_id>/email.json`.

---

### Subsystem 7: Email Sender (`modules/email_sender/`)
* **Responsibility**: Dispatches generated outreach emails across 5 providers with daily quota management and suppression list enforcement.
* **Entry Point**: `EmailSenderManager.send(target, provider_override, dry_run) -> EmailDeliveryResult`.
* **Public Interface**:
  - `EmailSenderManager`: Quota tracker and rotation coordinator.
  - `SuppressionList`: Opt-out / suppression list manager.
  - `ResendEmailProvider`: Resend REST API delivery adapter.
  - `SendGridEmailProvider`: Twilio SendGrid v3 API adapter.
  - `GmailSmtpEmailProvider`: Google Gmail SMTP adapter with App Password.
  - `OutlookSmtpEmailProvider`: Microsoft Office 365 SMTP adapter.
  - `SmtpEmailProvider`: Generic custom SMTP adapter.
* **Internal Dependencies**: `contracts.email`, `config.settings`.
* **External Dependencies**: `smtplib`, `requests`.
* **Side Effects**: Sends live network emails (unless `dry_run=True`), updates `data/email_sending_state.json`, and writes `generated/<business_id>/email_delivery.json`.

---

### Subsystem 8: Orchestrator (`modules/orchestrator/`)
* **Responsibility**: Coordinates end-to-end execution of all 7 stages with concurrent worker pools, checkpointing, pause/resume, and telemetry.
* **Entry Point**: `PipelineOrchestrator.run(config: PipelineRunConfig) -> PipelineRunState`.
* **Public Interface**:
  - `PipelineOrchestrator`: Main execution loop.
  - `RunStateManager`: Atomic file persistence for run checkpoints.
  - `EventManager`: Append-only structured event logger (`events.jsonl`).
  - `RunControlManager`: Background thread controller with pause/cancel primitives.
  - `execute_with_retry()`: Transient error retry wrapper with exponential backoff.
* **Internal Dependencies**: All `contracts.*` and `modules.*`.
* **Side Effects**: Creates `data/runs/<run_id>/`, writing `run.json`, `events.jsonl`, and `businesses/<biz_id>.json`.
