# Technical Debt Register & Architectural Backlog

This document prioritizes the architectural compromises, performance bottlenecks, non-runnable stubs, and scalability ceilings discovered during the forensic audit of Nayom.

---

## 1. Prioritized Technical Debt Register

| ID | Category | Title | Impact | Effort | Risk | Recommended Target State |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **DEBT-01** | Architecture | **Implement or Remove Non-Runnable Templates** | **HIGH** | Large (3-5 days) | High | 8 of 11 templates lack React code. Either scaffold full Next.js App Router codebases for the 8 stubs or prune `templates/registry.json` to the 3 genuine templates. |
| **DEBT-02** | Bug Fix | **Enforce `only_runnable=True` in TemplateSelector** | **HIGH** | Trivial (1 hour) | Low | In `modules/website_generator/generator.py:177`, pass `only_runnable=True` so broken stubs can never be copied into `generated/`. |
| **DEBT-03** | Reliability | **Eliminate Silent Mock Fallbacks in Production Mode** | **HIGH** | Small (4 hours) | Med | When `dry_run=False`, both `DeploymentManager` and `EmailSenderManager` must report explicit failures instead of falling back to Mock and logging false success. |
| **DEBT-04** | Security | **Control Plane Bearer Token Authentication** | **HIGH** | Medium (1 day) | Med | Add API token verification to `api/app.py` and configure `admin/lib/api.ts` to pass the token via `Authorization: Bearer <TOKEN>`. |
| **DEBT-05** | OS / Runtime | **Fix Windows `charmap` Unicode Subprocess Crashes** | **MED** | Small (2 hours) | Low | Ensure all `subprocess.run()` calls and console print statements specify `errors="replace"` to prevent crashing on checkmark characters (`\u2713`). |
| **DEBT-06** | Data Model | **Support Website-Less Businesses in Pipeline** | **MED** | Medium (2 days) | Low | When Google Maps finds a business without a website, bypass `website_collector` and synthesize minimal intelligence to enable greenfield website generation. |
| **DEBT-07** | Architecture | **Replace Render Provider with Dynamic Deployment** | **LOW** | Medium (1 day) | Low | Replace the hardcoded `RENDER_SERVICE_ID` redeploy webhook with dynamic service creation via Render API or deprecate the provider. |
| **DEBT-08** | Performance | **Pagination for Historical Runs in Control Plane** | **LOW** | Small (4 hours) | Low | `GET /api/runs` reads all run directories on disk. Implement directory-level offset/cursor pagination for scalability beyond 500 runs. |

---

## 2. Deep Technical Debt Analysis

### 1. The Template Library Illusion (DEBT-01 & DEBT-02)
- **Current State**: `templates/` advertises 11 industry templates (`construction`, `dental`, `generic`, `gym`, `law`, `medical`, `portfolio/cyber-brutalist`, `portfolio/dark-portfolio`, `realestate`, `restaurant`, `salon`). However, 8 of these 11 folders only contain JSON metadata files (`metadata.json`, `nayom.template.json`, `slots.json`).
- **Consequence**: When Gemini categorizes a business as `Dentist` or `Lawyer`, `TemplateSelector` selects `dental-smooth` or `lawyer-authority`. `WebsiteGenerator` copies the folder to `generated/<biz_id>/`. When deployment attempts `npm run build`, it crashes because there is no `package.json`.
- **Target Architecture**:
  1. Temporary hotfix: Force `only_runnable=True` in `TemplateSelector.select_template()`, which will safely fall back to `generic-modern`.
  2. Permanent resolution: Flesh out real Next.js codebases for the remaining 8 templates with responsive Tailwind components.

### 2. Silent Mock Fallback Masking (DEBT-03)
- **Current State**: Lines 226-234 of `DeploymentManager` and line 369 of `EmailSenderManager` catch missing credentials or failed deployments/sends and execute `MockProvider.deploy()` and `MockEmailSenderProvider.send()`.
- **Consequence**: An operator receives green checkmarks and success statistics in the console even when cloud infrastructure failed. The system generates emails with non-functional local URLs.
- **Target Architecture**:
  In `PipelineRunConfig`, check `config.dry_run`. If `dry_run=False`, do not permit automatic fallback to Mock. Let the stage fail with an explicit error in `businesses/<biz_id>.json` and notify the operator via telemetry.

### 3. Website-Less Business Pipeline Block (DEBT-06)
- **Current State**: In `modules/orchestrator/pipeline.py:382`:
  ```python
  if not biz_state.website:
      self._mark_stage_skipped(biz_state, "website_collector", "No website URL provided")
      continue
  ```
  Because Stage 3, 4, 5, and 6 require `website_collector == "completed"`, any business discovered on Google Maps that has a phone number and email but lacks a website is completely discarded from redesign and outreach!
- **Target Architecture**: Businesses without websites are the prime target demographic for web design agencies. A dedicated "Greenfield Generation" path should synthesize `WebsiteIntelligence` directly from Maps category, ratings, reviews, and address, allowing a new website to be generated and pitched.
