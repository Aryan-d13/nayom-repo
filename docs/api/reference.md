# Nayom Control Plane API Reference

The Nayom Control Plane exposes a REST and Server-Sent Events (SSE) interface built with FastAPI. It runs by default on `http://127.0.0.1:8000`.

---

## 1. Authentication & Global Headers

* **Authentication**: Currently unauthenticated (Local development mode).
* **CORS**: `Allow-Origin: *`, `Allow-Methods: *`, `Allow-Headers: *`.
* **Content-Type**: Standard endpoints return `application/json; charset=utf-8`. Real-time event streams return `text/event-stream; charset=utf-8`.

---

## 2. Global Metrics & Health

### `GET /api/health`
Checks control plane operational status.
* **Response**: `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-09-03T14:30:00.000000Z"
}
```

### `GET /api/stats`
Returns aggregated historical performance statistics computed across all runs in `data/runs/`.
* **Response**: `200 OK`
```json
{
  "total_runs": 14,
  "active_runs": 1,
  "completed_runs": 11,
  "failed_runs": 2,
  "total_businesses_discovered": 280,
  "total_businesses_processed": 210,
  "total_sites_generated": 195,
  "total_sites_deployed": 180,
  "total_emails_sent": 145,
  "overall_success_rate": 85.71,
  "last_updated": "2026-09-03T14:30:00.000000Z"
}
```

---

## 3. Pipeline Run Management

### `GET /api/runs`
Lists historical and active pipeline runs sorted newest first.
* **Query Parameters**:
  - `limit` (optional, integer, default: `50`, min: `1`, max: `500`): Maximum runs to return.
* **Response**: `200 OK` — `List[PipelineRunState]`
```json
[
  {
    "run_id": "run_20260826_160056_dentists_in_austin_texas",
    "status": "completed",
    "created_at": "2026-08-26T16:00:56.303124+00:00",
    "updated_at": "2026-08-26T16:05:45.120000+00:00",
    "config": {
      "query": "dentists in Austin Texas",
      "limit": 10,
      "concurrency": 5,
      "dry_run": false
    },
    "summary": {
      "total_businesses_requested": 10,
      "total_businesses_found": 10,
      "total_businesses_usable": 10,
      "total_businesses_processed": 10,
      "total_businesses_succeeded": 3,
      "total_businesses_failed": 7
    }
  }
]
```

### `POST /api/runs`
Initializes and launches a new background automation campaign.
* **Request Body**: `CreateRunRequest` (`application/json`)
  - `query` (string, required): Search query (e.g. `"dentists in Austin TX"`).
  - `limit` (integer, optional, default: `20`, min: `1`, max: `500`): Target usable business count.
  - `concurrency` (integer, optional, default: `5`, min: `1`, max: `50`): ThreadPool worker count.
  - `dry_run` (boolean, optional, default: `true`): If true, simulates email sending.
  - `ai_provider` (string, optional, default: `gemini`): AI provider (`gemini`, `mock`).
  - `deploy_provider` (string, optional): Specific deployer override (`vercel`, `cloudflare`, `netlify`, `github_pages`, `render`, `firebase`, `mock`).
  - `email_provider` (string, optional): Specific emailer override (`resend`, `sendgrid`, `gmail`, `outlook`, `smtp`, `mock`).
  - `template_override` (string, optional): Specific template ID override.
  - `fast_mode` (boolean, optional, default: `true`): Fast geographic grid scraping.
  - `render_js` (boolean, optional, default: `false`): Enable Playwright JS execution.
  - `screenshot` (boolean, optional, default: `false`): Capture DOM screenshots.
* **Response**: `201 Created` — `PipelineRunState`
```bash
curl -X POST http://127.0.0.1:8000/api/runs \
  -H "Content-Type: application/json" \
  -d '{
    "query": "roofers in Denver CO",
    "limit": 5,
    "concurrency": 3,
    "dry_run": true
  }'
```

### `GET /api/runs/{run_id}`
Retrieves deep run execution details, including configuration, stage funnels, and per-business states.
* **Path Parameters**:
  - `run_id` (string, required): Canonical run identifier.
* **Response**: `200 OK` — `RunDetailResponse`
* **Errors**: `404 Not Found` if `run_id` does not exist on disk.

### `POST /api/runs/{run_id}/pause`
Pauses an active run. Workers will finish their current stage and wait before starting subsequent stages.
* **Response**: `200 OK` — `PipelineRunState` (`status: "paused"`)

### `POST /api/runs/{run_id}/resume`
Resumes a paused run or re-launches an aborted run from disk checkpoints.
* **Response**: `200 OK` — `PipelineRunState` (`status: "running"`)

### `POST /api/runs/{run_id}/cancel`
Cancels an active run immediately.
* **Response**: `200 OK` — `PipelineRunState` (`status: "cancelled"`)

### `POST /api/runs/{run_id}/retry`
Retries failed stages for an existing run.
* **Request Body**: `RetryRunRequest`
  - `stage` (string, optional): Stage to reset (`website_collector`, `deployment`, etc.).
  - `business_id` (string, optional): Specific business to retry.
* **Response**: `200 OK` — `PipelineRunState`

---

## 4. Telemetry & Server-Sent Events

### `GET /api/runs/{run_id}/events`
Queries historical events or streams live events via SSE.
* **Query Parameters**:
  - `stream` (boolean, optional, default: `false`): If `true`, opens SSE stream.
  - `since` (string, optional): ISO timestamp filter.
  - `stage` (string, optional): Filter by pipeline stage name.
  - `level` (string, optional): Filter by event level (`info`, `warning`, `error`, `success`).
  - `limit` (integer, optional, default: `100`): Max events to return in non-stream mode.
* **SSE Stream Example**:
```bash
curl -N http://127.0.0.1:8000/api/runs/run_20260826_160056_dentists/events?stream=true
```
* **SSE Event Payload**:
```text
: keep-alive

event: message
data: {"event_id":"evt_01918a","timestamp":"2026-08-26T16:01:10.58Z","run_id":"run_20260826_160056_dentists","business_id":"biz_0x8644b","business_name":"Sola Smile Co.","stage":"website_collector","status":"started","level":"info","message":"Starting crawl for https://solasmileaustin.com/","metadata":{}}

event: end
data: {}
```

---

## 5. Business Artifact Inspection

### `GET /api/businesses/{business_id}`
Returns the comprehensive 7-stage dossier for a single business.
* **Path Parameters**:
  - `business_id` (string, required): Unique business identifier.
* **Query Parameters**:
  - `run_id` (string, optional): Contextual run ID for locating per-run state.
* **Response**: `200 OK` — `BusinessDetailResponse`
  - `business`: Canonical business profile (name, category, address, phone, email, website).
  - `stages`: Execution status and timing for each of the 7 stages.
  - `artifacts`: Direct links/content for `website.json`, `website_intelligence.json`, `site-data.json`, `deployment.json`, `email.json`, `email_delivery.json`.
  - `events`: Filtered list of structured events for this business.
* **Errors**: `404 Not Found` if business record cannot be located.
