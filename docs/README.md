# Nayom Technical Documentation & Forensic Audit Portal

Welcome to the authoritative engineering documentation for the **Nayom** personal automation platform and control plane.

This documentation suite was produced following an exhaustive forensic audit of the entire codebase, evaluating actual executable logic, runtime call graphs, third-party cloud integrations, thread concurrency, state persistence, and security attack surfaces.

---

## 🧭 Documentation Sitemap

### 1. Forensic Audit & Reality Scorecards (Mandatory Reading)
* **[Executive Summary](file:///e:/Code/Nayom/docs/audit/executive-summary.md)**: "What does this system actually do?" Brutally honest technical breakdown of verified capabilities vs. AI-scaffolded mocks.
* **[Reality Scorecard](file:///e:/Code/Nayom/docs/audit/reality-scorecard.md)**: Uncompromising grading across 10 operational dimensions (REAL, PARTIAL, MOCKED, STUBBED, BROKEN, DEAD).
* **[Capability Verification](file:///e:/Code/Nayom/docs/audit/capability-verification.md)**: The Capability Reality Matrix mapping every core claim to code, side effects, and empirical reality.
* **[Integration Audit](file:///e:/Code/Nayom/docs/audit/integration-audit.md)**: Provider-by-provider audit of Vercel, Cloudflare, Netlify, GitHub Pages, Render, Firebase, Resend, SendGrid, Gmail, Outlook, and SMTP.
* **[Frontend ↔ Backend Contract Matrix](file:///e:/Code/Nayom/docs/audit/frontend-backend-contract-audit.md)**: Field-by-field verification between Next.js 14 `admin/lib/api.ts` and FastAPI `api/app.py`.
* **[Test Quality Audit](file:///e:/Code/Nayom/docs/audit/test-quality-audit.md)**: Forensic analysis of the 122-test pytest suite; separating real behavior tests from mock scaffolding.
* **[Forensic Findings & Vulnerability Register](file:///e:/Code/Nayom/docs/audit/forensic-findings.md)**: Line-by-line evidence register of committed credentials, non-runnable template traps, and silent mock fallbacks.

### 2. Architecture & Subsystems
* **[System Overview](file:///e:/Code/Nayom/docs/architecture/overview.md)**: High-level architectural topology, 7-stage pipeline, data boundaries, and Mermaid diagrams.
* **[Frontend Architecture](file:///e:/Code/Nayom/docs/architecture/frontend.md)**: Deep dive into the Next.js 14 App Router Operations Console, component hierarchy, and SSE tailing.
* **[Backend Architecture](file:///e:/Code/Nayom/docs/architecture/backend.md)**: FastAPI control plane, worker thread managers, and Server-Sent Events mechanics.
* **[Python Pipeline Subsystems](file:///e:/Code/Nayom/docs/architecture/python.md)**: Comprehensive mapping of all 9 Python modules in `modules/` and contracts in `contracts/`.
* **[Data Lifecycle & Persistence](file:///e:/Code/Nayom/docs/architecture/data-flow.md)**: End-to-end data flow from Google Maps query to normalized JSON, DOM scrape, Next.js assembly, and delivery.
* **[Glossary](file:///e:/Code/Nayom/docs/architecture/glossary.md)**: Canonical definitions for Nayom-specific concepts, contracts, and operational states.

### 3. API & Integration Specification
* **[API Reference](file:///e:/Code/Nayom/docs/api/reference.md)**: Complete OpenAPI specification for all REST and SSE endpoints with request/response schemas.

### 4. Development & Testing
* **[Clean-Room Local Setup](file:///e:/Code/Nayom/docs/development/setup.md)**: Step-by-step developer onboarding on a fresh machine (Python, Node.js, binaries, Playwright).
* **[Configuration & Environment](file:///e:/Code/Nayom/docs/development/configuration.md)**: Exhaustive reference table of all environment variables, flags, quotas, and provider credentials.
* **[Testing Guide](file:///e:/Code/Nayom/docs/development/testing.md)**: How to execute unit tests, integration tests, mock runs, and smoke tests safely.

### 5. Production, Deployment & Operations
* **[Production Deployment](file:///e:/Code/Nayom/docs/deployment/production.md)**: Serving FastAPI, building Next.js admin, process supervision, and cloud provider topologies.
* **[Operations & Telemetry](file:///e:/Code/Nayom/docs/deployment/operations.md)**: Operating the pipeline, tailing `events.jsonl`, reading telemetry, and runtime control.
* **[Troubleshooting Runbook](file:///e:/Code/Nayom/docs/operations/troubleshooting.md)**: Practical symptom-cause-verification-resolution tables for common failures.
* **[Failure Modes & Disaster Recovery](file:///e:/Code/Nayom/docs/operations/failure-recovery.md)**: Resuming interrupted runs from checkpoints, repairing corrupt state, and quota exhaustion procedures.

### 6. Security, Engineering & Technical Debt
* **[Security Architecture & Threat Model](file:///e:/Code/Nayom/docs/security/security.md)**: Attack surfaces, credential handling, subprocess safety, prompt injection, and mitigation steps.
* **[Engineering Conventions](file:///e:/Code/Nayom/docs/engineering/conventions.md)**: Observed patterns, typing rules, atomic file writes, and code style.
* **[Dependency Analysis](file:///e:/Code/Nayom/docs/engineering/dependencies.md)**: Complete graph of internal module coupling and third-party libraries.
* **[Technical Debt Register](file:///e:/Code/Nayom/docs/engineering/technical-debt.md)**: Prioritized backlog of architectural risks, scalability limits, and remediation priorities.

---

## ⚡ Quick Architecture Overview

```text
Google Maps Query
       │
       ▼
[Phase 1: Maps Scraper] ──────────► data/raw/ & data/normalized/
       │
       ▼ (Usable Businesses)
[Phase 2: Website Collector] ─────► data/websites/<site_id>/ (DOM & Screenshots)
       │
       ▼
[Phase 3: Website Intelligence] ──► data/websites/<site_id>/website_intelligence.json
       │
       ▼
[Phase 4: Website Generator] ────► generated/<business_id>/ (Next.js Codebase)
       │
       ▼
[Phase 5: Cloud Deployment] ─────► generated/<business_id>/deployment.json (Live Preview URL)
       │
       ▼
[Phase 6: Email Generator] ──────► generated/<business_id>/email.json (Personalized Pitch)
       │
       ▼
[Phase 7: Email Sender] ─────────► generated/<business_id>/email_delivery.json
       ▲
       │
[Orchestrator Control Plane] ────► data/runs/<run_id>/ (run.json, events.jsonl, SSE)
       ▲
       │
[Next.js Operations Console] ───► Interactive Web Dashboard on localhost:3000
```
