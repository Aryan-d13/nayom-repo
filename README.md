# Nayom-Automation

A modular personal automation system designed for local execution.

---

## Phase 1 — Google Maps Scraper

Phase 1 provides a robust, decoupled Google Maps business scraper module wrapping `gosom/google-maps-scraper`.

### Architecture

```
Nayom/
├── config/
│   ├── __init__.py
│   └── settings.py               # Paths, default timeouts, scraper binary locations
├── contracts/
│   ├── __init__.py
│   ├── business.py               # Business dataclass / Pydantic contract
│   ├── maps.py                   # MapsSearchRequest, MapsSearchResult contracts
│   ├── website.py                # Website crawler & page contracts
│   ├── intelligence.py           # Website intelligence contracts
│   ├── generator.py              # Website generator contracts
│   └── deployment.py             # Deployment contracts
├── data/
│   ├── raw/                      # Preserves raw JSON output from scraper
│   ├── normalized/               # Clean normalized Business records
│   └── websites/                 # Crawled website records & intelligence reports
├── templates/                    # Versioned Next.js template library
├── generated/                    # Assembled Next.js production projects
├── modules/
│   ├── __init__.py
│   ├── maps_scraper/             # Google Maps scraper
│   ├── website_collector/        # Full website crawler (MarkCrawl engine)
│   ├── website_intelligence/     # Gemini 3.5 Flash-Lite intelligence analyzer
│   ├── website_generator/        # Deterministic Next.js website generator
│   └── deployment/               # Multi-provider deployment engine
├── tests/
├── main.py                       # CLI entry point
└── requirements.txt
```

### Business Contract Rules

- **Strict minimum**: `name` + at least one contact method (`phone` OR `email` OR `website`).
- **Usability flag**: A record is `usable = true` if name and at least one contact method is found. If no contact method is available, `usable = false`.
- **Tolerant parsing**: Missing optional fields (`city`, `state`, `email`, `rating`, etc.) never cause exceptions or dropped records.
- **Validation Warnings**: `validation_warnings` contains a list of any missing optional fields.

### Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run a search query for an entire city or state:
```bash
python main.py "Dentists in Maryland" -n 25
```
```bash
python main.py "coffee shops in Austin Texas" -n 20
```

---

## Phase 2 — Full Website Collector

Collects clean markdown, headings, links, forms, CTAs, SEO metadata, and full-page screenshots.

```bash
python main.py "https://aryansharmaswe.vercel.app" --render-js --screenshot -n 10
```

---

## Phase 3 — AI Website Intelligence

Uses Google's **Gemini 3.5 Flash-Lite** (`gemini-3.5-flash-lite`) with multimodal screenshot reasoning to extract structured website intelligence, business profile, UX/design audits, technical stack inferences, and strategic redesign recommendations into `website_intelligence.json`.

```bash
python main.py "data/websites/aryansharmaswe_vercel_app/website.json"
```

---

## Phase 4 — Deterministic Next.js Website Generator

Transforms `website_intelligence.json` into a complete, runnable Next.js App Router website inside `generated/<business-id>/`.

```bash
python main.py "data/websites/aryansharmaswe_vercel_app/website_intelligence.json"
```

To run the generated site locally:

```bash
cd generated/aryansharmaswe_vercel_app
npm install   # or: pnpm install
npm run dev   # or: pnpm dev
```

---

## Phase 5 — Multi-Provider Deployment Engine

Deploys generated Next.js sites across 6 major hosting providers with persistent round-robin rotation and automatic failure fallback.

### Supported Providers

- **Vercel** (`VERCEL_TOKEN`, optional `VERCEL_TEAM_ID`) — Native Next.js deployment
- **Cloudflare Pages** (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
- **Netlify** (`NETLIFY_AUTH_TOKEN`, optional `NETLIFY_SITE_ID`) — Native Next.js / API
- **GitHub Pages** (`GITHUB_TOKEN`, `GITHUB_REPOSITORY`) — Static export
- **Render** (`RENDER_API_KEY`, optional `RENDER_SERVICE_ID`) — Native Web Service
- **Firebase Hosting** (`FIREBASE_TOKEN`, `FIREBASE_PROJECT_ID`)
- **Mock Provider** — Offline preview deployment for testing without API keys

### Usage

Deploy with automatic round-robin rotation:

```bash
python main.py deploy generated/aryansharmaswe_vercel_app
```

Deploy to a specific provider:

```bash
python main.py deploy generated/aryansharmaswe_vercel_app --provider vercel
```

Produces: `generated/<business-id>/deployment.json`

---

### Running Tests

```bash
pytest tests/
```
