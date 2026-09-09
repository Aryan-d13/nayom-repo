# Nayom Forensic Findings & Vulnerability Register

This document records the exact, line-by-line forensic findings discovered during the technical audit of the Nayom codebase. Every negative finding is backed by file citations, line numbers, and impact assessments.

---

## 1. Critical Findings Matrix

| ID | Severity | Category | Finding | Evidence (File & Lines) | Impact | Recommended Fix |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **CRITICAL** | Security | Live API keys, tokens, and app passwords committed to Git | [`.env:1-84`](file:///e:/Code/Nayom/.env#L1-L84) | Complete credential compromise for Gemini, Vercel, Cloudflare, Netlify, GitHub, Render, Firebase, Resend, SendGrid, Gmail, Outlook | Revoke and rotate all 11 credentials immediately. Add `.env` to `.gitignore`. Commit `.env.example`. |
| **TPL-01** | **CRITICAL** | Architecture | 8 of 11 templates in catalog are metadata stubs lacking React code | [`templates/registry.json:1-50`](file:///e:/Code/Nayom/templates/registry.json), [`templates/dental/dental-smooth/`](file:///e:/Code/Nayom/templates/dental/dental-smooth/) | Generating sites for dentists, doctors, lawyers, gyms, salons, restaurants copies empty folders; downstream deployment crashes on missing `package.json` | Either implement real Next.js codebases for all 8 templates or restrict catalog to the 3 runnable templates. |
| **TPL-02** | **HIGH** | Bug / Logic | TemplateSelector defaults to non-runnable templates | [`modules/website_generator/template_selector.py:124`](file:///e:/Code/Nayom/modules/website_generator/template_selector.py#L124), [`modules/website_generator/generator.py:177`](file:///e:/Code/Nayom/modules/website_generator/generator.py#L177) | Automatically assigns non-runnable templates to vertical queries, poisoning downstream deployment stages | In `generator.py:177`, enforce `only_runnable=True` when calling `select_template()`. |
| **DEP-01** | **HIGH** | Architecture | Silent fallback to Mock Provider masks cloud deployment failures | [`modules/deployment/manager.py:226-234`](file:///e:/Code/Nayom/modules/deployment/manager.py#L226-L234) | System reports 100% deployment success rate with fake local URLs (`https://preview.nayom-automation.local/...`) when real deployments fail | When `dry_run=False` or live deployment is requested, record status as `failed` rather than silently invoking Mock. |
| **DEP-02** | **MEDIUM** | Implementation | Render Provider cannot deploy arbitrary dynamic websites | [`modules/deployment/providers/render.py:68-94`](file:///e:/Code/Nayom/modules/deployment/providers/render.py#L68-L94) | Render provider only triggers redeployment of a pre-existing service ID; cannot create per-business preview sites | Deprecate Render provider or replace with Render Blueprint / API service creation. |
| **EML-01** | **HIGH** | Bug / Integrity | Email Generator fabricates fake preview URLs on deploy failure | [`modules/email_generator/generator.py:216-220`](file:///e:/Code/Nayom/modules/email_generator/generator.py#L216-L220) | Outreach emails sent to real businesses contain dead links (`https://nayom-preview.pages.dev/{biz_id}`) | Do not generate or send outreach email if the prerequisite live deployment URL is missing or failed. |
| **EML-02** | **MEDIUM** | Integrity | Email Generator fabricates recipient emails in dry-run mode | [`modules/email_generator/generator.py:245-247`](file:///e:/Code/Nayom/modules/email_generator/generator.py#L245-L247) | Dry-run simulations invent `contact@{domain}` rather than testing missing-recipient error branches | Retain `recipient=None` to accurately simulate skipped email dispatch. |
| **EML-03** | **HIGH** | Architecture | Silent fallback to Mock Email Provider masks email delivery failures | [`modules/email_sender/manager.py:369-378`](file:///e:/Code/Nayom/modules/email_sender/manager.py#L369-L378) | When SMTP or API delivery fails, Mock marks email as `sent`, incrementing sent counters falsely | Discontinue Mock fallback in live send mode; record explicit delivery failure. |
| **SYS-01** | **HIGH** | OS / Runtime | Windows cp1252 charmap encoding crash on Unicode characters | [`modules/orchestrator/pipeline.py`](file:///e:/Code/Nayom/modules/orchestrator/pipeline.py), [`data/runs/.../biz_*.json`](file:///e:/Code/Nayom/data/runs/run_20260826_160056_dentists_in_austin_texas/businesses/biz_0x8644b351a8e24e97_0x4fbbf19295014748.json#L49) | `UnicodeEncodeError: 'charmap' codec can't encode character '\u2713'` aborts deployment stages on Windows consoles | Add `errors="replace"` to stdout logging and configure UTF-8 stream wrappers on Windows entrypoints. |
| **API-01** | **HIGH** | Security | Unauthenticated API with Wildcard CORS | [`api/app.py:34-40`](file:///e:/Code/Nayom/api/app.py#L34-L40) | Any local web page or script on the host machine can launch runs, pause runs, or read emails | Add API Bearer token authentication and restrict CORS origins to `localhost:3000`. |
| **PIP-01** | **MEDIUM** | Business Logic | Website-less businesses are completely abandoned by pipeline | [`modules/orchestrator/pipeline.py:379-397`](file:///e:/Code/Nayom/modules/orchestrator/pipeline.py#L379-L397) | Businesses with phone or email but no website are skipped from intelligence, generation, and outreach | Implement greenfield website generation path for businesses that have no existing website. |

---

## 2. In-Depth Forensic Findings

### SEC-01: Committed Production Credentials
- **File**: [`.env`](file:///e:/Code/Nayom/.env#L1-L84)
- **Code**:
  ```ini
  GEMINI_API_KEY=AQ.Ab8RN6KoOD7...
  VERCEL_TOKEN=vcp_0vNGrrsVN35...
  CLOUDFLARE_API_TOKEN=cfut_BcQxPd617...
  NETLIFY_AUTH_TOKEN=nfp_hoQ3m1r...
  GITHUB_TOKEN=ghp_KbzMEf6tZnJ...
  RENDER_API_KEY=rnd_bXclKwLX...
  FIREBASE_TOKEN=1//0gDlvnY9...
  RESEND_API_KEY=re_3WwRLqcJ...
  GMAIL_APP_PASSWORD=lrtz jqni wifx wkay
  OUTLOOK_APP_PASSWORD=pcwjmohiptrtvlkz
  SENDGRID_API_KEY=SG.cfEgcpyNRUC5...
  ```
- **Analysis**: The file was committed directly into the workspace. Any clone or fork of this repository exposes active production credentials across 11 major SaaS, cloud, and email services.

### TPL-01 & TPL-02: Non-Runnable Template Trap
- **Files**:
  - [`templates/registry.json`](file:///e:/Code/Nayom/templates/registry.json)
  - [`modules/website_generator/template_selector.py:124`](file:///e:/Code/Nayom/modules/website_generator/template_selector.py#L124)
  - [`modules/website_generator/generator.py:177`](file:///e:/Code/Nayom/modules/website_generator/generator.py#L177)
- **Code in Selector**:
  ```python
  def select_template(
      self,
      intelligence: WebsiteIntelligence,
      template_override: Optional[str] = None,
      only_runnable: bool = False,
  ) -> TemplateMetadata:
  ```
- **Code in Generator**:
  ```python
  template_meta: TemplateMetadata = self._selector.select_template(
      intelligence=intel,
      template_override=template_override,
  )
  ```
- **Analysis**: `generator.py` calls `select_template()` without passing `only_runnable=True`. The default is `False`. If the AI model analyzes a dentist site, it recommends `dental-smooth`. The selector gives `dental-smooth` a +200 match score. `generator.py` copies `templates/dental/dental-smooth` into `generated/<biz_id>/`. Because `dental-smooth` has no `package.json`, subsequent `npm run build` or cloud deployment fails immediately.

### DEP-01: Silent Cloud Deployment Fallback
- **File**: [`modules/deployment/manager.py:226-234`](file:///e:/Code/Nayom/modules/deployment/manager.py#L226-L234)
- **Code**:
  ```python
  if not successful_result:
      logger.info("All configured cloud providers were skipped or failed; using Mock Provider fallback.")
      mock_inst = self.get_provider("mock")
      if mock_inst:
          successful_result = mock_inst.deploy(site_dir, request)
          successful_result.warnings.extend(warnings)
          if successful_result.status == "success":
              self._record_successful_deployment("mock", 0)
  ```
- **Analysis**: This block ensures that deployment *never fails* unless `MockDeploymentProvider` itself crashes. A user without Vercel or Cloudflare tokens will receive a green "SUCCESS" response with a dead local preview link (`https://preview.nayom-automation.local/...`).

### EML-01: Fake Preview URLs in Email Body
- **File**: [`modules/email_generator/generator.py:216-220`](file:///e:/Code/Nayom/modules/email_generator/generator.py#L216-L220)
- **Code**:
  ```python
  # Fallback placeholder preview URL if no deployment record exists
  fallback = f"https://nayom-preview.pages.dev/{business_id or 'demo'}"
  msg = f"No deployment.json found. Using preview URL fallback: {fallback}"
  logger.warning(msg)
  warnings.append(msg)
  return fallback, warnings
  ```
- **Analysis**: When deployment is skipped or fails, the email generator creates a fictitious Cloudflare Pages URL. This URL is inserted into the email prompt with instructions that it must be included in the email. The recipient receives a pitch directing them to a 404 page.

### SYS-01: Windows `charmap` Encoding Crash
- **Evidence**: [`data/runs/run_20260826_160056_dentists_in_austin_texas/businesses/biz_0x8644b351a8e24e97_0x4fbbf19295014748.json:49`](file:///e:/Code/Nayom/data/runs/run_20260826_160056_dentists_in_austin_texas/businesses/biz_0x8644b351a8e24e97_0x4fbbf19295014748.json#L49)
- **Log**:
  ```text
  "error": "Deployment execution failed: 'charmap' codec can't encode character '\u2713' in position 297: character maps to <undefined>"
  ```
- **Analysis**: When Next.js or cloud CLIs (e.g. Vercel) output checkmarks (`✓` / `\u2713`) upon build success, Python subprocess handlers decoding with system default `charmap` (Windows-1252) crash with an unhandled `UnicodeEncodeError`, marking the deployment stage as failed.
