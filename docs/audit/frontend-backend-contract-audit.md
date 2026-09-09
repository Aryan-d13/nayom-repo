# Frontend ↔ Backend Contract Audit

This document audits the communication contract between the Next.js 14 Operations Console (`admin/`) and the FastAPI Control Plane API (`api/app.py`).

---

## 1. Frontend ↔ Backend Contract Matrix

| UI Feature | Frontend API Call (`admin/lib/api.ts`) | Backend Route (`api/app.py`) | Method | Request Schema Match | Response Schema Match | Real Behavior | Verdict |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **Global Metrics Bar** | `getGlobalStats()` | `GET /api/stats` | `GET` | N/A (No body) | `GlobalStatsResponse` (Exact match) | Computes historical aggregation across all runs in `data/runs/` | **MATCH (REAL)** |
| **Historical Runs Table** | `getRuns(limit)` | `GET /api/runs?limit={limit}` | `GET` | Query param `limit` (int, ge=1, le=500) | `List[PipelineRunState]` (Exact match) | Lists directories in `data/runs/` sorted newest first | **MATCH (REAL)** |
| **Launch Run Modal** | `createRun(payload)` | `POST /api/runs` | `POST` | `CreateRunRequest` (Exact field-level match) | `PipelineRunState` (Status 201) | Starts background worker thread via `RunControlManager` | **MATCH (REAL)** |
| **Run Drilldown Page** | `getRunDetail(runId)` | `GET /api/runs/{run_id}` | `GET` | Path param `run_id` | `RunDetailResponse` (Exact match) | Reads `run.json` and loads all `<biz_id>.json` files | **MATCH (REAL)** |
| **Pause Run Button** | `pauseRun(runId)` | `POST /api/runs/{run_id}/pause` | `POST` | Path param `run_id` | `PipelineRunState` (Exact match) | Clears `threading.Event`, halting worker between stages | **MATCH (REAL)** |
| **Resume Run Button** | `resumeRun(runId)` | `POST /api/runs/{run_id}/resume` | `POST` | Path param `run_id` | `PipelineRunState` (Exact match) | Sets `threading.Event` or re-launches thread in resume mode | **MATCH (REAL)** |
| **Cancel Run Button** | `cancelRun(runId)` | `POST /api/runs/{run_id}/cancel` | `POST` | Path param `run_id` | `PipelineRunState` (Exact match) | Sets cancellation flag, raising `RunCancelledException` | **MATCH (REAL)** |
| **Retry Stage / Business** | `retryRun(runId, stage, bizId)` | `POST /api/runs/{run_id}/retry` | `POST` | `RetryRunRequest` (`stage`, `business_id`) | `PipelineRunState` (Exact match) | Resets target stage to `pending` and dispatches thread | **MATCH (REAL)** |
| **Business Drilldown Page** | `getBusinessDetail(bizId, runId)` | `GET /api/businesses/{biz_id}?run_id=...` | `GET` | Path `biz_id` + Query `run_id` | `BusinessDetailResponse` (Exact match) | Aggregates Maps, scraped DOM, intelligence, site-data, email | **MATCH (REAL)** |
| **Event Stream (SSE)** | `subscribeRunEvents(runId)` | `GET /api/runs/{run_id}/events?stream=true` | `GET` | SSE EventSource connection | `text/event-stream` chunks | Tails `events.jsonl` every 200ms and pushes live lines | **MATCH (REAL)** |
| **Historical Event Query** | `getRunEvents(runId, limit)` | `GET /api/runs/{run_id}/events?limit=...` | `GET` | Query params: `limit`, `since`, `stage` | `List[PipelineEvent]` (Exact match) | Replays JSONL lines from disk with optional filtering | **MATCH (REAL)** |

---

## 2. Detailed Contract Verification Points

### 1. Schema & Type Alignment
Both sides of the contract use strictly aligned TypeScript interfaces (`admin/lib/api.ts`) and Pydantic models (`api/models.py` and `contracts/orchestrator.py`):
- `PipelineRunConfig`: All 13 fields (`query`, `limit`, `concurrency`, `dry_run`, `ai_provider`, `email_provider`, `deploy_provider`, `template_override`, `max_retries`, `delay_seconds`, `fast_mode`, `render_js`, `screenshot`) match in naming, type, and defaults.
- `StageExecution`: Status enum (`pending`, `running`, `completed`, `failed`, `skipped`, `paused`, `cancelled`) is identical between TypeScript and Pydantic.
- `PipelineSummary`: Tracks the 8 operational dimensions (`requested`, `attempted`, `found`, `usable`, `processed`, `succeeded`, `failed`, `skipped`) plus the 7 stage tallies.

### 2. Live SSE Telemetry Verification
- **Implementation**: In `admin/lib/api.ts:subscribeRunEvents()`, the client opens a native browser `EventSource`:
  ```typescript
  const eventSource = new EventSource(`${API_BASE}/api/runs/${runId}/events?stream=true`);
  ```
- **Backend**: In `api/app.py:get_run_events()`, when `stream=True` or `accept: text/event-stream` is requested, it yields formatted SSE events:
  ```python
  yield f"event: message\ndata: {data}\n\n"
  ```
- **Verification**: Handled cleanly with keep-alive comments (`: keep-alive\n\n`) and terminal event (`event: end\ndata: {}\n\n`). Reconnection is native to browser `EventSource`.

### 3. Polling & Optimistic UI
- `admin/app/page.tsx` polls `getGlobalStats()` and `getRuns()` every **2,500ms** via `setInterval`.
- This dual-layer observability (SSE for high-frequency logs + short polling for aggregate dashboard stats) ensures the UI recovers automatically even if an SSE stream drops.

### 4. Identified Discrepancies & Edge Cases
1. **API URL Hardcoding Fallback**: `admin/lib/api.ts:1` defines `export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"`. If deployed to production without `NEXT_PUBLIC_API_URL`, browser clients will attempt to contact `127.0.0.1:8000` on the end user's machine.
2. **Missing Frontend Pagination**: `getRuns(limit=100)` fetches up to 100 runs. On high-volume production deployments with 500+ runs, disk reads in `state_mgr.list_all_runs()` will slow down the dashboard response.
3. **CORS Configuration**: `api/app.py` specifies `allow_origins=["*"]` with `allow_credentials=True`. Standard browser fetch specifications reject `credentials: include` when origins is wildcarded. In local development where no cookies are sent, it succeeds, but it is an invalid security configuration for authenticated production setups.
