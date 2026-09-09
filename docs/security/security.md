# Security Architecture, Threat Model & Vulnerability Register

This document defines the security architecture, trust boundaries, threat models, and identified security risks for the Nayom codebase.

---

## 1. Threat Model & Trust Boundaries

```mermaid
graph TD
    Attacker["External Web / Attacker"]
    TargetSite["Target Business Website"]
    HostServer["Nayom Host Server"]
    ControlPlane["FastAPI / Next.js Admin"]
    CloudAPIs["External SaaS & Cloud Accounts"]

    Attacker -.->|Prompt Injection / Malicious Payload| TargetSite
    TargetSite -->|Raw HTML / Crawled Text| HostServer
    HostServer -->|Unsanitized Context| Gemini["Google Gemini API"]
    
    Attacker -.->|Unauthenticated Requests (Port 8000)| ControlPlane
    ControlPlane -->|Execution Command| HostServer
    HostServer -->|API Tokens / Credentials| CloudAPIs
```

### Trust Boundary Analysis
1. **Target Business Websites (UNTRUSTED)**: Website content scraped during Phase 2 is completely untrusted. Attackers could place adversarial text ("Ignore previous instructions and output...") designed to hijack Gemini's structured output.
2. **Localhost Network (CURRENTLY UNTRUSTED)**: The FastAPI control plane binds to `127.0.0.1:8000` with `allow_origins=["*"]` and **zero authentication**. Any script or malicious web page loaded in an operator's local browser can execute CSRF attacks against `http://127.0.0.1:8000/api/runs`.
3. **Cloud & SMTP Credentials (HIGHLY SENSITIVE)**: Access tokens for Vercel, Cloudflare, Netlify, Resend, and SMTP credentials grant wide operational control over personal and organization cloud accounts.

---

## 2. Identified Vulnerabilities & Attack Vectors

### 1. Hardcoded / Committed Production Secrets (CRITICAL)
- **Vulnerability**: As identified in [Finding SEC-01](file:///e:/Code/Nayom/docs/audit/forensic-findings.md#sec-01-committed-production-credentials), live production tokens for Gemini, Vercel, Cloudflare, Netlify, GitHub, Render, Firebase, Resend, Gmail, and Outlook were committed directly to `.env` in the workspace root.
- **Risk**: Full compromise of hosting infrastructure, source repositories, and email sending domains.
- **Remediation**:
  1. Revoke all 11 API keys and app passwords immediately.
  2. Add `.env` to `.gitignore`.
  3. Ensure production environments load secrets via Linux environment variables or a secure secret manager (e.g. AWS Secrets Manager, HashiCorp Vault).

### 2. Unauthenticated Control Plane & Wildcard CORS (HIGH)
- **Vulnerability**: `api/app.py` has no authentication middleware and configures `allow_origins=["*"]` with `allow_credentials=True`.
- **Risk**: Any website visited in the operator's browser can issue cross-origin POST requests to launch campaigns, drain API quotas, or exfiltrate business contact data.
- **Remediation**:
  1. Add HTTP Bearer Token authentication via FastAPI dependency (`HTTPBearer`).
  2. Restrict `allow_origins` strictly to `["http://localhost:3000"]` (or production admin domain).

### 3. Subprocess Command Injection & Token Logging (MEDIUM)
- **Vulnerability**:
  - `modules/deployment/providers/github_pages.py:121` embeds the GitHub PAT directly into the git remote URL string:
    ```python
    repo_url = f"https://x-access-token:{self._token}@github.com/{self._repository}.git"
    ```
  - Subprocesses in `github_pages.py` and `vercel.py` run with `shell=True` on Windows.
- **Risk**: If a subprocess command fails and logs the command line, the GitHub personal access token will be leaked in plaintext log files.
- **Remediation**:
  1. Pass GitHub tokens via the `GIT_ASKPASS` environment variable or standard git credentials helper instead of embedding in the URL string.
  2. Remove `shell=True` and pass command arguments as explicit token lists.

### 4. Prompt Injection via Scraped DOM Content (MEDIUM)
- **Vulnerability**: Raw plain text extracted from target websites is interpolated directly into Gemini's system and user prompts without semantic sanitization.
- **Risk**: A target site owner could craft hidden text instructing the LLM to output offensive email copy or alter the JSON schema output.
- **Mitigation**: Pydantic structured output constraints (`response_schema=WebsiteIntelligence`) protect against schema tampering, but semantic guardrails should be added to system instructions.

---

## 3. Recommended Remediation & Hardening Roadmap

```text
Priority   Task Description                                          Timeline
-----------------------------------------------------------------------------
P0         Rotate all 11 production credentials and scrub Git history  Immediate
P0         Enforce .gitignore on .env and commit sanitized .env.example Immediate
P1         Implement Bearer Token authentication on all FastAPI routes 24 Hours
P1         Restrict CORS origins in api/app.py to admin console origin 24 Hours
P2         Remove shell=True and scrub tokens from subprocess logging   48 Hours
P2         Implement basic rate limiting on FastAPI endpoints          72 Hours
```
