# Operations, Telemetry & Maintenance Runbook

This guide covers operational maintenance, log analysis, health monitoring, backup procedures, and capacity management for Nayom in production.

---

## 1. Monitoring & Observability Architecture

### 1. Health Checks
* **Endpoint**: `GET /api/health`
* **Liveness Probe**: Confirms FastAPI is accepting socket connections and responding in <50ms.
* **Readiness Probe**: Queries `GET /api/stats` to confirm that `data/runs/` is readable on the local filesystem.

### 2. Structured Event Logging (`events.jsonl`)
All significant pipeline state changes append JSON lines to `data/runs/<run_id>/events.jsonl`:
```json
{
  "event_id": "evt_01918a2b3c4d",
  "timestamp": "2026-09-03T14:30:15.123456Z",
  "run_id": "run_20260903_143000_dentists",
  "business_id": "biz_0x8644b",
  "business_name": "Austin Dental Arts",
  "stage": "website_intelligence",
  "status": "completed",
  "duration_ms": 12450.5,
  "level": "info",
  "message": "Extracted intelligence profile via Gemini 3.5 Flash-Lite",
  "metadata": {"template_recommended": "generic-modern", "services_count": 8}
}
```

### 3. Key Operational Metrics to Monitor
1. **Gemini API Error Rate**: Track HTTP 429 rate limit errors. If >5% of calls return 429, decrease `concurrency` or upgrade from Gemini free tier.
2. **Disk Space Utilization**: Each processed business consumes between **5MB and 25MB** (DOM dumps, screenshots, and Next.js project code). An operation processing 1,000 businesses consumes ~15GB.
3. **Daily Provider Quota Depletion**: Monitor `data/email_sending_state.json`. When counts approach provider limits (e.g. 100 for Resend), alert operations that provider rotation will occur.

---

## 2. Routine Maintenance Procedures

### 1. Cleaning Historical Run Artifacts
To prevent disk exhaustion, archive or purge old runs older than 30 days:
```bash
# Delete raw scrape dumps older than 30 days
find /home/nayom/app/data/raw -name "*_raw.json" -mtime +30 -delete

# Purge generated site folders older than 30 days
find /home/nayom/app/generated -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +
```

### 2. Backup & Restore Procedures
Because Nayom stores all state directly on the filesystem, backup consists of snapshotting the `data/` directory:

```bash
# Create timestamped tarball backup
tar -czvf /backup/nayom_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  -C /home/nayom/app data \
  --exclude="data/raw"

# Restore procedure
tar -xzvf /backup/nayom_backup_20260903.tar.gz -C /home/nayom/app
```

---

## 3. Capacity Planning & Sizing

| Metric | Single Business Average | Batch of 100 Businesses | Batch of 1,000 Businesses |
| :--- | :---: | :---: | :---: |
| **Duration (concurrency=5)** | 60–90 seconds | 25–35 minutes | ~4.5 hours |
| **Memory Footprint (MarkCrawl)** | ~150 MB | ~500 MB (shared pool) | ~500 MB (shared pool) |
| **Memory Footprint (Playwright)** | ~250 MB | ~1.5 GB (shared pool) | ~1.5 GB (shared pool) |
| **Disk Storage Generated** | 10–15 MB | 1.2 GB | 12–15 GB |
| **Gemini API Tokens** | ~6,000 tokens | ~600,000 tokens | ~6,000,000 tokens |
| **Cloud Deploys Triggered** | 1 deploy | 100 deploys | 1,000 deploys |
| **Emails Transmitted** | 1 email | 100 emails | 1,000 emails |
