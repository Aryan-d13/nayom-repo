# Nayom External Integration & Provider Audit

This document provides a forensic audit of every external integration in the Nayom repository, verifying authentication loading, payload construction, network calls, response parsing, and error handling.

---

## 1. External Integration Matrix

| Integration | Adapter File | Credentials Loaded | Actual Network Call | Response Parsing | Consumer Module | Tested in Pytest? | Forensic Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **OSM Nominatim** | `modules/maps_scraper/geocoder.py` | None (Public API) | `urllib.request.urlopen` GET to `nominatim.openstreetmap.org` | JSON parsed into bounding box lat/lon | `GoogleMapsScraper` | Yes (Unit tested) | **REAL** |
| **Google Maps Scraper** | `modules/maps_scraper/scraper.py` | Local Binary | Subprocess execution of `google-maps-scraper.exe` | Reads stdout / JSON output file | `PipelineOrchestrator` | Yes (Mocked in e2e) | **REAL** |
| **Playwright Chromium** | `modules/website_collector/vendor/markcrawl/` | Local Binaries | Headless Chromium CDP browser automation | DOM HTML & screenshot PNG buffer | `WebsiteCollector` | Partial (Browser binary dependent) | **PARTIAL** |
| **Google Gemini API** | `modules/website_intelligence/providers/gemini.py` | `GEMINI_API_KEY` | `google.genai.Client.models.generate_content` | Pydantic JSON schema validation | `WebsiteIntelligenceAnalyzer` | Yes (Mock & Live tested) | **REAL** |
| **Vercel CLI / API** | `modules/deployment/providers/vercel.py` | `VERCEL_TOKEN`, `VERCEL_TEAM_ID` | `subprocess.run(["npx", "vercel", "deploy", "--prod"])` + PATCH API | Regex extraction of `*.vercel.app` URL | `DeploymentManager` | Partial (CLI mock in tests) | **REAL** |
| **Cloudflare Pages** | `modules/deployment/providers/cloudflare.py` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | POST `api.cloudflare.com` + `npx wrangler pages deploy` | Parses `*.pages.dev` URL | `DeploymentManager` | Partial | **REAL** |
| **Netlify API / CLI** | `modules/deployment/providers/netlify.py` | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` | POST `api.netlify.com/api/v1/sites/{id}/deploys` (ZIP buffer) | Reads `ssl_url` from response JSON | `DeploymentManager` | Partial | **REAL** |
| **GitHub Pages** | `modules/deployment/providers/github_pages.py` | `GITHUB_TOKEN`, `GITHUB_REPOSITORY` | `subprocess.run(["npx", "gh-pages", ...])` via git token | Constructs `https://{owner}.github.io/{repo}/{id}/` | `DeploymentManager` | Partial | **REAL** |
| **Render API** | `modules/deployment/providers/render.py` | `RENDER_API_KEY`, `RENDER_SERVICE_ID` | POST `api.render.com/v1/services/{id}/deploys` | Hardcodes `https://{name}.onrender.com` | `DeploymentManager` | Weak | **STUBBED** |
| **Firebase Hosting** | `modules/deployment/providers/firebase.py` | `FIREBASE_TOKEN`, `FIREBASE_PROJECT_ID` | `subprocess.run(["npx", "firebase-tools", "deploy", ...])` | Parses `Hosting URL:` from stdout | `DeploymentManager` | Partial | **REAL** |
| **Resend API** | `modules/email_sender/providers/resend.py` | `RESEND_API_KEY` | POST `https://api.resend.com/emails` | Reads `id` from JSON response | `EmailSenderManager` | Yes (Mocked HTTP session) | **REAL** |
| **SendGrid v3 API** | `modules/email_sender/providers/sendgrid.py` | `SENDGRID_API_KEY` | POST `https://api.sendgrid.com/v3/mail/send` | Reads `X-Message-Id` response header | `EmailSenderManager` | Yes (Mocked HTTP session) | **REAL** |
| **Gmail SMTP** | `modules/email_sender/providers/gmail.py` | `GMAIL_USER`, `GMAIL_APP_PASSWORD` | `smtplib.SMTP("smtp.gmail.com", 587)` (STARTTLS) | SMTP transaction code handling | `EmailSenderManager` | Yes (Mocked smtplib) | **REAL** |
| **Outlook SMTP** | `modules/email_sender/providers/outlook.py` | `OUTLOOK_USER`, `OUTLOOK_APP_PASSWORD` | `smtplib.SMTP("smtp.office365.com", 587)` (STARTTLS) | SMTP transaction code handling | `EmailSenderManager` | Yes (Mocked smtplib) | **REAL** |
| **Custom SMTP** | `modules/email_sender/providers/smtp.py` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | `smtplib.SMTP` or `smtplib.SMTP_SSL` | Standard SMTP response parsing | `EmailSenderManager` | Yes (Mocked smtplib) | **REAL** |

---

## 2. Hosting Provider Reality Matrix

| Provider | Implemented | Instantiated | Reachable | Real API / CLI Call | Auth Mechanism | Participates in Rotation | Failure Handling | Forensic Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **Vercel** | Yes | Yes | Yes | `npx vercel deploy --prod` | Bearer Token CLI argument | Yes (Index 0) | Returns `failed`; manager tries next | **REAL** |
| **Cloudflare** | Yes | Yes | Yes | Wrangler CLI + REST API | API Token in Env / Header | Yes (Index 1) | Returns `failed`; manager tries next | **REAL** |
| **Netlify** | Yes | Yes | Yes | REST API direct ZIP POST | Bearer Auth Header | Yes (Index 2) | Returns `failed`; manager tries next | **REAL** |
| **GitHub Pages** | Yes | Yes | Yes | `npx gh-pages` git push | `x-access-token` in remote URL | Yes (Index 3) | Returns `failed`; manager tries next | **REAL** |
| **Render** | Yes | Yes | Yes | REST API deploy trigger | Bearer Auth Header | Yes (Index 4) | Fails if `service_id` missing | **STUBBED** |
| **Firebase** | Yes | Yes | Yes | `npx firebase-tools` | CI Token argument | Yes (Index 5) | Returns `failed`; manager tries next | **REAL** |
| **Mock** | Yes | Yes | Yes | Pure local string format | None required | Standby Fallback | Returns simulated success | **MOCKED** |

### Critical Deployment Findings
1. **The Render Provider Stub**: `modules/deployment/providers/render.py` cannot dynamically generate and host independent Next.js projects for businesses. It requires a pre-existing `RENDER_SERVICE_ID` in `.env` and issues a `POST /v1/services/{id}/deploys` trigger, which merely rebuilds that single pre-existing service.
2. **The Final Fallback Mask**: When all 6 hosting providers fail (or if an engineer has no credentials configured), `DeploymentManager.deploy()` catches the failure and invokes `MockDeploymentProvider`. This marks the stage as `status="completed"` in the database and returns `https://preview.nayom-automation.local/<biz>`, disguising cloud infrastructure failures as complete pipeline success.

---

## 3. Email Provider Reality Matrix

| Provider | Implemented | Instantiated | Reachable | Real Network Call | Auth Mechanism | Daily Quota Enforced | Failure Handling | Forensic Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **Resend** | Yes | Yes | Yes | HTTPS POST to `api.resend.com` | Bearer API Key | Yes (100/day default) | Advances to next provider | **REAL** |
| **SendGrid** | Yes | Yes | Yes | HTTPS POST to `api.sendgrid.com` | Bearer API Key | Yes (100/day default) | Advances to next provider | **REAL** |
| **Gmail SMTP** | Yes | Yes | Yes | TCP TLS socket to port 587 | Google App Password | Yes (500/day default) | Advances to next provider | **REAL** |
| **Outlook SMTP** | Yes | Yes | Yes | TCP TLS socket to port 587 | Basic Auth / App Password | Yes (300/day default) | Advances to next provider | **REAL** |
| **Custom SMTP** | Yes | Yes | Yes | TCP socket (TLS/SSL) | SMTP Auth | Yes (500/day default) | Advances to next provider | **REAL** |
| **Mock** | Yes | Yes | Yes | None (In-memory return) | None | Unlimited | Always succeeds | **MOCKED** |

### Critical Email Findings
1. **Genuine Network Code**: Unlike the deployment engine where some tools are CLI wrappers, all 5 email providers implement genuine network protocols (HTTP JSON payloads via `requests` or RFC 822 MIME message transmission via Python `smtplib`).
2. **Quota & Suppression Interception**: Pre-send checks correctly halt sending before network transmission if the daily provider quota has been exhausted or if the recipient is found in `data/email_suppression_list.json`.
3. **The Mock Mask**: If all 5 email providers fail (or if credentials are unconfigured), `EmailSenderManager` falls back to `MockEmailSenderProvider`, recording `status="sent"` with a dummy message ID (`mock-msg-...`).
