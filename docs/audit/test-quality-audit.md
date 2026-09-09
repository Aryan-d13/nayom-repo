# Nayom Test Suite Forensics & Quality Audit

This document audits the 22 test suites in `tests/` (122 passing tests). Green checkmarks are interrogated to separate tests that verify real code behavior from tests that merely verify mock setups.

---

## 1. Test Reality Matrix

| Test Suite | Real Code Executed | Mocked Critical Path | Assertion Quality | Integration Level | Confidence Rating |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **`test_contracts.py`** | Pydantic v2 validation, serialization, required fields | None | **HIGH** | Unit | **HIGH** |
| **`test_website_contracts.py`** | `Page`, `PageHeading`, `StructuredData` schemas | None | **HIGH** | Unit | **HIGH** |
| **`test_intelligence_contracts.py`** | Complex nested `WebsiteIntelligence` schemas | None | **HIGH** | Unit | **HIGH** |
| **`test_email_sender_contracts.py`** | `EmailDeliveryRequest`, `EmailDeliveryResult` validation | None | **HIGH** | Unit | **HIGH** |
| **`test_adapter.py`** | Maps scraper address parsing, regex, ID generation | None | **HIGH** | Unit | **HIGH** |
| **`test_website_extractor.py`** | HTML parsing, DOM traversal, form extraction | None (Real HTML strings) | **HIGH** | Unit | **HIGH** |
| **`test_website_collector.py`** | Crawl loop, sitemap parsing, BFS queue | Network (`requests` mocked) | **MEDIUM** | Mocked Unit | **MEDIUM** |
| **`test_website_intelligence.py`** | Prompt construction, token truncation | LLM API (`MockProvider` used) | **HIGH** | Contract | **HIGH** |
| **`test_template_registry.py`** | Template scanning, JSON cache rebuilding | Real disk directory | **HIGH** | Real I/O | **HIGH** |
| **`test_template_importer.py`** | Manifest validation, component heuristics | Real disk directory | **HIGH** | Real I/O | **HIGH** |
| **`test_website_generator.py`** | Project copying, slot population, JSON writing | Real disk templates | **MEDIUM** | Real I/O (No `next build`) | **MEDIUM** |
| **`test_deployment.py`** | Rotation state loading, index incrementing | Cloud APIs (`DummyCustomProvider`) | **LOW** | Mocked Unit | **LOW** |
| **`test_email_providers.py`** | Request payload formatting, header extraction | Network (`smtplib`, `requests`) | **MEDIUM** | Mocked Unit | **MEDIUM** |
| **`test_email_sender_manager.py`** | Quota tracking, suppression list, daily reset | Live SMTP (`MockEmailSenderProvider`) | **HIGH** | Logic & I/O | **HIGH** |
| **`test_email_generator.py`** | Prompt formatting, fallback preview URL | LLM API (`MockProvider`) | **HIGH** | Contract | **HIGH** |
| **`test_events.py`** | Append-only JSONL writes, filtering, replay | Real disk `events.jsonl` | **HIGH** | Real I/O | **HIGH** |
| **`test_run_control.py`** | Pause, resume, cancel `threading.Event` loops | Real threads | **HIGH** | Real Concurrency | **HIGH** |
| **`test_orchestrator.py`** | 7-stage orchestrator sequencing, checkpoints | **ALL 7 MODULES MOCKED** | **LOW** | Mock Scaffold | **LOW** |
| **`test_concurrency.py`** | Parallel business dispatch in ThreadPool | **ALL 7 MODULES MOCKED** | **LOW** | Mock Scaffold | **LOW** |
| **`test_capability_hardening.py`** | Usability slicing, microsecond tile collisions | Scraper binary mocked | **HIGH** | Logic & Math | **HIGH** |
| **`test_api.py`** | FastAPI endpoints, status codes, JSON responses | Control manager async task mocked | **HIGH** | API Contract | **HIGH** |

---

## 2. In-Depth Test Forensics

### 1. High-Confidence Suites (Real Logic & Disk I/O)
- **`test_contracts.py` & contract suites**: Verify strict Pydantic v2 schemas. Missing required fields (`name` in Business, `site_id` in WebsiteIntelligence) fail immediately.
- **`test_website_extractor.py`**: Feeds complex synthetic HTML documents containing forms, nested headings, CTA buttons, and microdata directly to BeautifulSoup; verifies parsed attributes and word counts accurately.
- **`test_events.py`**: Generates real `events.jsonl` files in temporary directories, verifies append-only concurrency with locks, and checks filtering by severity, stage, and timestamps.
- **`test_run_control.py`**: Executes real Python worker threads, triggering `pause()`, verifying that the worker blocks, triggering `resume()`, and triggering `cancel()` to assert that `RunCancelledException` is raised.

### 2. Deceptive Suites (Mocks Testing Mocks)
- **`test_concurrency.py`**:
  ```python
  mock_scraper = MagicMock()
  mock_collector = MagicMock()
  mock_analyzer = MagicMock()
  mock_generator = MagicMock()
  mock_deployer = MagicMock()
  mock_email_gen = MagicMock()
  mock_email_sender = MagicMock()
  ```
  Every single operational module is replaced with a `MagicMock`. The test does **not** prove that concurrent scraping, Playwright headless browsers, Gemini API calls, Next.js builds, or SMTP connections can run concurrently without deadlock, resource exhaustion, or rate limiting. It only tests Python's `ThreadPoolExecutor` dispatching dummy lambdas.
- **`test_deployment.py`**:
  Uses `DummyCustomProvider` which returns `https://{biz}.{name}.example.com`. It verifies that the integer `current_index` increments in `deployment_state.json`, but provides **zero verification** that Vercel, Cloudflare, Netlify, Render, or Firebase CLI commands can successfully deploy a generated Next.js website.
- **`test_website_generator.py`**:
  Verifies that `_copy_template_files()` copies directory trees and `site-data.json` is populated. It **never runs `next build`** on the generated project. Consequently, it passed 100% even while 8 of the 11 templates were completely missing `package.json` and React files.

### 3. Critical Functionality With Zero Automated Tests
1. **Live Subprocess Deployment**: Zero tests execute real `npx vercel deploy` or `npx wrangler pages deploy`.
2. **Next.js Production Build Validation**: Zero tests run `npm run build` on a generated codebase to ensure that populated `site-data.json` conforms to TypeScript types.
3. **Playwright JavaScript Rendering**: Zero tests launch Playwright Chromium or capture real screenshots due to lack of pre-installed browser binaries in CI.
4. **FastAPI SSE Streaming Under Disconnect**: Zero tests simulate client socket abortions during SSE event generation to verify that background generators terminate cleanly.
