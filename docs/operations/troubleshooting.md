# Troubleshooting & Diagnostic Runbook

This runbook provides actionable Symptom-Cause-Verification-Resolution guides for diagnosing and repairing failures in Nayom.

---

## 1. Symptom-Cause-Remediation Matrix

| Symptom / Error Message | Likely Root Cause | Verification Command / Step | Resolution Procedure |
| :--- | :--- | :--- | :--- |
| **`'charmap' codec can't encode character '\u2713'`** | Windows cp1252 default encoding cannot print Unicode checkmarks emitted by Next.js / Vercel CLI. | Inspect `<biz_id>.json` deployment stage error. | Set `PYTHONIOENCODING=utf-8` in terminal or add `errors="replace"` to subprocess decoding. |
| **`FileNotFoundError: Template folder not found: templates/dental-smooth`** or missing `package.json` | `TemplateSelector` selected a non-runnable template stub. | Inspect `templates/registry.json` runnable status. | Pass `only_runnable=True` to `TemplateSelector.select_template()`. |
| **`ResourceExhausted: 429 Resource has been exhausted (quota)`** | Exceeded Gemini free tier limit (15 requests/minute). | Check `events.jsonl` error messages for `google.genai.errors.ClientError`. | Reduce pipeline `concurrency` (e.g. `--concurrency 2`) or upgrade Google AI Studio API tier. |
| **`Google Maps scraper executable not found`** | Missing `google-maps-scraper.exe` or binary not in root directory. | Run `ls -l google-maps-scraper*`. | Run `python scripts/setup_scraper.py` to download the binary. |
| **`Unverified sender domain` (HTTP 422 in Resend)** | Sending from a domain not verified in the Resend dashboard. | Check `generated/<biz_id>/email_delivery.json`. | Configure DNS DKIM/SPF records in Resend, or use `onboarding@resend.dev` for testing. |
| **`SMTPAuthenticationError: (535, '5.7.8 Username and Password not accepted')`** | Invalid Gmail App Password or standard password used instead of 16-char App Password. | Test with `python scripts/test_all_providers.py`. | Generate a 16-character App Password under Google Account -> Security -> 2-Step Verification. |
| **Next.js Admin Console displays amber connection error** | FastAPI control plane on port 8000 is not running. | Run `curl http://127.0.0.1:8000/api/health`. | Start backend: `python main.py server --port 8000`. |
| **`No deployment.json found. Using preview URL fallback`** | Deployment stage failed or was skipped, causing email generator to invent a fake link. | Check `generated/<biz_id>/deployment.json` existence. | Fix deployment provider credentials or investigate build errors in target project. |
| **Silent mock deployment reported on empty credentials** | `DeploymentManager` catch-all fell back to `MockDeploymentProvider`. | Check URL prefix for `https://preview.nayom-automation.local`. | Provide valid cloud tokens (`VERCEL_TOKEN`, etc.) or disable mock fallback in code. |

---

## 2. Step-by-Step Diagnostic Procedures

### 1. Diagnosing a Failed Run
1. Locate the run ID from the dashboard or terminal (e.g. `run_20260826_160056_dentists`).
2. Inspect the consolidated run state:
   ```bash
   cat data/runs/<run_id>/run.json | grep -A 10 "summary"
   ```
3. Identify which businesses failed:
   ```bash
   grep -rn '"status": "failed"' data/runs/<run_id>/businesses/
   ```
4. Read the exact stage error and stack trace from the target business JSON file:
   ```bash
   cat data/runs/<run_id>/businesses/<failed_biz_id>.json
   ```

### 2. Live SSE Stream Diagnostics
To verify that the control plane is streaming telemetry without connecting a browser:
```bash
curl -N http://127.0.0.1:8000/api/runs/<run_id>/events?stream=true
```
If lines starting with `event: message` and `data: {...}` appear as the pipeline executes, the event bus and SSE server are fully operational.

### 3. Diagnosing Next.js Template Build Issues
If a generated project fails during deployment:
```bash
cd generated/<business_id>
npm install
npm run build
```
Any TypeScript compilation errors, missing slot keys, or broken JSX imports will be displayed with exact line numbers.
