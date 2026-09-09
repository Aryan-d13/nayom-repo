# Testing Guide & Test Architecture

This guide details the test structure, execution workflows, fixture management, and mocking standards across the Nayom codebase.

---

## 1. Test Architecture & Directory Layout

The automated test suite is located in `tests/` and powered by **pytest** and Python's standard `unittest`:

```text
tests/
├── conftest.py                        # Shared pytest fixtures & temporary directories
├── test_contracts.py                  # Pydantic schema validation tests
├── test_website_contracts.py          # DOM, Page, and StructuredData contracts
├── test_intelligence_contracts.py     # WebsiteIntelligence nested models
├── test_email_sender_contracts.py     # Email delivery contracts
├── test_adapter.py                    # Maps scraper normalization & address parsing
├── test_website_extractor.py          # BeautifulSoup DOM parsing & text cleanup
├── test_website_collector.py          # MarkCrawl crawling logic
├── test_website_intelligence.py       # Prompt building & Gemini extraction
├── test_template_registry.py          # Template discovery & registry caching
├── test_template_importer.py          # Template importing & validation
├── test_website_generator.py          # Project assembly & site-data generation
├── test_deployment.py                 # DeploymentManager rotation & failover
├── test_email_providers.py            # Email provider adapters (Resend, SMTP, Gmail)
├── test_email_sender_manager.py       # EmailSenderManager quotas & suppression
├── test_email_generator.py            # Outreach email drafting logic
├── test_events.py                     # Durable JSONL event logging & filtering
├── test_run_control.py                # Thread pausing, resuming, and cancellation
├── test_orchestrator.py               # E2E 7-stage orchestrator flow (Mocked)
├── test_concurrency.py                # ThreadPool concurrent business dispatch
├── test_capability_hardening.py       # Microsecond collision & usability slicing
└── test_api.py                        # FastAPI REST & SSE endpoint contracts
```

---

## 2. Test Execution Commands

### Run Full Test Suite
```bash
pytest tests/ -v
```

### Run Specific Test Suite
```bash
pytest tests/test_deployment.py -v
```

### Run Specific Test Case
```bash
pytest tests/test_deployment.py -k "test_provider_availability_and_credential_detection" -v
```

### Run with Coverage Reporting
```bash
pytest --cov=modules --cov=contracts tests/ --cov-report=term-missing
```

---

## 3. Mocking Policy & Standards

As revealed during the forensic audit, excessive mocking can create an illusion of functionality while hiding broken integrations. Engineers contributing to Nayom must follow these strict guidelines:

### What MUST Be Mocked in Unit Tests
1. **Financial or Consumptive External APIs**:
   - Google Gemini API calls (to avoid exhausting the 15 RPM / 1,500 RPD free tier quota).
   - Resend and SendGrid email sending (to prevent sending unsolicited test emails).
2. **Cloud Infrastructure Mutation**:
   - Vercel, Cloudflare, Netlify CLI/API calls (to avoid creating real orphan projects on personal cloud accounts during CI).

### What MUST NOT Be Mocked
1. **Filesystem Persistence & State**:
   - Never mock `RunStateManager`, `EventManager`, or JSON file writes. Use pytest's `tmp_path` fixture to write real files on disk and assert atomic replacement behavior.
2. **Contract Validation**:
   - Never mock Pydantic models. Always instantiate real contracts with valid and invalid payloads.
3. **HTML DOM Parsing**:
   - Never mock `BeautifulSoup` or `parse_page_html()`. Pass synthetic or real HTML fixture files directly into the extractor.
4. **Template Project Validation**:
   - Do not merely assert that files are copied. Tests for `WebsiteGenerator` must verify that the copied template contains `package.json` and a runnable Next.js structure.

---

## 4. Writing New Tests: Example Pattern

```python
import pytest
from pathlib import Path
from contracts.business import Business
from modules.orchestrator.state import RunStateManager

def test_atomic_business_state_persistence(tmp_path: Path):
    # 1. Arrange with real temporary directory
    state_mgr = RunStateManager(runs_root=tmp_path / "runs")
    run_id = "test_run_001"
    biz = Business(id="biz_test", name="Test Dental", category="Dentist")
    
    # 2. Act
    state = state_mgr.create_business_run_state(run_id, biz)
    state.status = "completed"
    state_mgr.save_business_run_state(run_id, state)
    
    # 3. Assert directly from disk
    saved_file = tmp_path / "runs" / run_id / "businesses" / "biz_test.json"
    assert saved_file.exists()
    
    loaded = state_mgr.load_business_run_state(run_id, "biz_test")
    assert loaded.status == "completed"
    assert loaded.business_data.name == "Test Dental"
```
