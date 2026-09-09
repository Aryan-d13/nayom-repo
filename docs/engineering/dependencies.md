# Dependency Analysis & Software Bill of Materials (SBOM)

This document provides a complete software bill of materials (SBOM) and dependency analysis for both the Python backend/pipeline and the Node.js frontend.

---

## 1. Python Dependencies (`requirements.txt`)

| Package Name | Version Spec | License | Type | Consuming Modules | Architectural Purpose |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **`fastapi`** | `>=0.111.0` | MIT | Runtime | `api/` | REST and SSE HTTP control plane framework |
| **`uvicorn[standard]`** | `>=0.30.0` | BSD-3 | Runtime | `api/server.py` | High-performance ASGI HTTP server |
| **`pydantic`** | `>=2.7.0` | MIT | Runtime | `contracts/`, all `modules/` | Domain modeling, serialization, and JSON schema constraints |
| **`google-genai`** | `>=0.1.0` | Apache-2.0| Runtime | `modules/website_intelligence`, `modules/email_generator` | Official Google GenAI SDK for Gemini 3.5 Flash-Lite |
| **`playwright`** | `>=1.44.0` | Apache-2.0| Optional | `modules/website_collector/vendor/markcrawl/` | Headless Chromium automation and screenshot capture |
| **`beautifulsoup4`** | `>=4.12.0` | MIT | Runtime | `modules/website_collector` | Static HTML DOM parsing and tag extraction |
| **`lxml`** | `>=5.2.0` | BSD-3 | Runtime | `modules/website_collector` | High-performance C-based HTML parsing backend |
| **`requests`** | `>=2.32.0` | Apache-2.0| Runtime | `modules/deployment`, `modules/email_sender` | HTTP client for Resend, SendGrid, and Netlify APIs |
| **`python-dotenv`** | `>=1.0.0` | BSD-3 | Runtime | `config/settings.py` | Loading environment variables from `.env` |
| **`pydantic-settings`**| `>=2.2.0` | MIT | Runtime | `config/settings.py` | Environment variable parsing and type coercion |
| **`pytest`** | `>=8.0.0` | MIT | Dev / Test| `tests/` | Test runner and assertion framework |
| **`pytest-cov`** | `>=5.0.0` | MIT | Dev / Test| `tests/` | Code coverage reporting plugin |
| **`httpx`** | `>=0.27.0` | BSD-3 | Dev / Test| `tests/test_api.py` | Asynchronous test client for FastAPI endpoints |

---

## 2. Frontend Dependencies (`admin/package.json`)

| Package Name | Version Spec | License | Type | Architectural Purpose |
| :--- | :---: | :---: | :---: | :--- |
| **`next`** | `^14.2.3` | MIT | Runtime | Full-stack React framework with App Router |
| **`react`** | `^18.3.1` | MIT | Runtime | UI rendering library |
| **`react-dom`** | `^18.3.1` | MIT | Runtime | Browser DOM renderer for React |
| **`lucide-react`** | `^0.378.0` | ISC | Runtime | Icon library for status badges, arrows, and funnels |
| **`tailwindcss`** | `^3.4.3` | MIT | Dev | Utility-first CSS framework |
| **`typescript`** | `^5.4.5` | Apache-2.0| Dev | Static type system for JavaScript |
| **`postcss`** | `^8.4.38` | MIT | Dev | CSS processing engine |
| **`autoprefixer`** | `^10.4.19` | MIT | Dev | Vendor prefixing for browser CSS compatibility |

---

## 3. External Executable Binaries

1. **`google-maps-scraper.exe` (Windows) / `google-maps-scraper` (Linux/macOS)**:
   - **Origin**: Open-source Go project `gosom/google-maps-scraper`.
   - **Size**: ~60 MB binary.
   - **Execution**: Spawned as a child process via `subprocess.run()`.
   - **License**: MIT.
