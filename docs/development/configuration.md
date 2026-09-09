# Configuration & Environment Variable Reference

This document provides a comprehensive reference for all configuration options, environment variables, default quotas, and credentials consumed across Nayom.

---

## 1. Environment Variable Reference Matrix

| Variable Name | Type | Req? | Default | Sensitivity | Consumers | Purpose & Fallback Behavior |
| :--- | :---: | :---: | :--- | :---: | :--- | :--- |
| **`GEMINI_API_KEY`** | string | **YES** | None | **SECRET** | `modules/website_intelligence`, `modules/email_generator` | Google Gemini API key. If missing, intelligence analysis and email generation fail with `ValueError`. |
| **`GEMINI_MODEL`** | string | No | `gemini-3.5-flash-lite` | Non-sensitive | `modules/website_intelligence` | Target Gemini model identifier for structured Pydantic extraction. |
| **`VERCEL_TOKEN`** | string | Opt | `None` | **SECRET** | `modules/deployment/providers/vercel.py` | Vercel Personal Access Token. If missing, Vercel provider is skipped in rotation. |
| **`VERCEL_TEAM_ID`** | string | Opt | `None` | Sensitive | `modules/deployment/providers/vercel.py` | Optional Vercel Team/Scope ID passed via `--scope`. |
| **`CLOUDFLARE_API_TOKEN`** | string | Opt | `None` | **SECRET** | `modules/deployment/providers/cloudflare.py` | Cloudflare API Token with Pages edit permissions. If missing, skipped. |
| **`CLOUDFLARE_ACCOUNT_ID`**| string | Opt | `None` | Sensitive | `modules/deployment/providers/cloudflare.py` | Cloudflare Account ID for Pages API management. |
| **`NETLIFY_AUTH_TOKEN`** | string | Opt | `None` | **SECRET** | `modules/deployment/providers/netlify.py` | Netlify Personal Access Token for ZIP deployments. If missing, skipped. |
| **`NETLIFY_SITE_ID`** | string | Opt | `None` | Sensitive | `modules/deployment/providers/netlify.py` | Pre-existing Netlify Site ID (optional; creates site if absent). |
| **`GITHUB_TOKEN`** | string | Opt | `None` | **SECRET** | `modules/deployment/providers/github_pages.py` | GitHub Personal Access Token (`repo` scope) for `gh-pages` branch pushes. |
| **`GITHUB_REPOSITORY`** | string | Opt | `None` | Non-sensitive | `modules/deployment/providers/github_pages.py` | Target repository in `owner/repo` format for GitHub Pages hosting. |
| **`RENDER_API_KEY`** | string | Opt | `None` | **SECRET** | `modules/deployment/providers/render.py` | Render API Key. If missing, Render provider is skipped. |
| **`RENDER_SERVICE_ID`** | string | Opt | `None` | Sensitive | `modules/deployment/providers/render.py` | Render Web Service ID for redeploy triggers. |
| **`FIREBASE_TOKEN`** | string | Opt | `None` | **SECRET** | `modules/deployment/providers/firebase.py` | Firebase CI Token for `firebase-tools deploy`. |
| **`FIREBASE_PROJECT_ID`**| string | Opt | `None` | Sensitive | `modules/deployment/providers/firebase.py` | Target Firebase Project ID. |
| **`RESEND_API_KEY`** | string | Opt | `None` | **SECRET** | `modules/email_sender/providers/resend.py` | Resend REST API Key (`re_...`). |
| **`RESEND_DAILY_LIMIT`** | int | No | `100` | Non-sensitive | `modules/email_sender/providers/resend.py` | Daily email transmission ceiling before provider rotation. |
| **`SENDGRID_API_KEY`** | string | Opt | `None` | **SECRET** | `modules/email_sender/providers/sendgrid.py` | Twilio SendGrid v3 API Key (`SG....`). |
| **`SENDGRID_DAILY_LIMIT`**| int | No | `100` | Non-sensitive | `modules/email_sender/providers/sendgrid.py` | Daily email transmission ceiling before provider rotation. |
| **`GMAIL_USER`** | string | Opt | `None` | Sensitive | `modules/email_sender/providers/gmail.py` | Sender Gmail address. |
| **`GMAIL_APP_PASSWORD`** | string | Opt | `None` | **SECRET** | `modules/email_sender/providers/gmail.py` | Google 16-character App Password (requires 2FA enabled on Gmail). |
| **`GMAIL_DAILY_LIMIT`** | int | No | `500` | Non-sensitive | `modules/email_sender/providers/gmail.py` | Daily Gmail SMTP limit. |
| **`OUTLOOK_USER`** | string | Opt | `None` | Sensitive | `modules/email_sender/providers/outlook.py` | Sender Office 365 / Outlook email address. |
| **`OUTLOOK_APP_PASSWORD`**| string | Opt | `None` | **SECRET** | `modules/email_sender/providers/outlook.py` | Microsoft App Password. |
| **`OUTLOOK_DAILY_LIMIT`**| int | No | `300` | Non-sensitive | `modules/email_sender/providers/outlook.py` | Daily Outlook SMTP limit. |
| **`SMTP_HOST`** | string | Opt | `None` | Sensitive | `modules/email_sender/providers/smtp.py` | Custom SMTP hostname. |
| **`SMTP_PORT`** | int | No | `587` | Non-sensitive | `modules/email_sender/providers/smtp.py` | Custom SMTP port (`587` for STARTTLS, `465` for SSL). |
| **`SMTP_USER`** | string | Opt | `None` | Sensitive | `modules/email_sender/providers/smtp.py` | Custom SMTP username. |
| **`SMTP_PASSWORD`** | string | Opt | `None` | **SECRET** | `modules/email_sender/providers/smtp.py` | Custom SMTP password. |
| **`NEXT_PUBLIC_API_URL`**| string | No | `http://127.0.0.1:8000` | Non-sensitive | `admin/lib/api.ts` | Backend URL for Next.js browser requests. |

---

## 2. Configuration Precedence & Loading

Settings are loaded at application boot in `config/settings.py` following this strict precedence order:
1. **Operating System Environment Variables** (`os.environ`).
2. **Local `.env` file** located in the workspace root (parsed via `python-dotenv`).
3. **Hardcoded Fallback Defaults** defined in `config/settings.py`.

```python
# config/settings.py precedence loading
from dotenv import load_dotenv
load_dotenv(override=False)  # Preserves host environment overrides
```

---

## 3. Persistent State Files

In addition to environment variables, system runtime configuration is persisted in JSON files in `data/`:

* **`data/deployment_state.json`**:
  ```json
  {
    "current_provider_index": 2,
    "total_deployments": 45,
    "provider_stats": {
      "vercel": {"success": 15, "failed": 1},
      "cloudflare": {"success": 15, "failed": 0},
      "netlify": {"success": 15, "failed": 0}
    }
  }
  ```
* **`data/email_sending_state.json`**:
  ```json
  {
    "daily_counts": {
      "resend": 12,
      "gmail": 45
    },
    "last_reset_date": "2026-09-03"
  }
  ```
  *(Automatically resets counts at 00:00 UTC).*
* **`data/email_suppression_list.json`**:
  ```json
  [
    "optout@example.com",
    "competitor@domain.com"
  ]
  ```
  *(Prevents email dispatch to opted-out recipients).*
