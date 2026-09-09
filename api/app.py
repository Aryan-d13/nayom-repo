import os
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse

from config.settings import DATA_DIR, WEBSITES_DATA_DIR, GENERATED_DIR, RUNS_DIR
from contracts.orchestrator import PipelineRunConfig, PipelineRunState, BusinessRunState
from contracts.events import PipelineEvent
from modules.orchestrator import PipelineOrchestrator, RunStateManager, EventManager, RunControlManager
from api.models import (
    CreateRunRequest,
    RetryRunRequest,
    RunDetailResponse,
    BusinessDetailResponse,
    GlobalStatsResponse,
)

logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="Nayom-Automation Control Plane API",
    description="Local concurrent orchestrator and admin control plane for Nayom-Automation",
    version="1.0.0",
)

# Enable CORS for local admin frontend (Next.js default port 3000, 3001, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared singletons
state_mgr = RunStateManager()
event_mgr = EventManager()
control_mgr = RunControlManager(state_manager=state_mgr, event_manager=event_mgr)


def get_orchestrator_factory():
    """Factory to create a freshly configured PipelineOrchestrator."""
    return lambda: PipelineOrchestrator(
        state_manager=state_mgr,
        event_manager=event_mgr,
    )


# -----------------------------------------------------------------------------
# Health & Stats
# -----------------------------------------------------------------------------
@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "nayom-automation-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "runs_dir": str(state_mgr.runs_root),
    }


@app.get("/stats", response_model=GlobalStatsResponse, tags=["Dashboard"])
@app.get("/api/stats", response_model=GlobalStatsResponse, tags=["Dashboard"])
async def get_global_stats():
    """Returns aggregated stats across all historical and active runs."""
    all_runs = state_mgr.list_all_runs()
    total_runs = len(all_runs)
    active_runs = sum(1 for r in all_runs if r.status in ("running", "paused") or control_mgr.is_run_active(r.run_id))

    total_businesses = 0
    total_websites_crawled = 0
    total_sites_generated = 0
    total_sites_deployed = 0
    total_emails_sent = 0
    total_succeeded = 0
    total_failed = 0

    for r in all_runs:
        s = r.summary
        total_businesses += r.total_businesses or s.businesses_found or s.found
        total_websites_crawled += s.websites_collected
        total_sites_generated += s.sites_generated
        total_sites_deployed += s.sites_deployed
        total_emails_sent += s.emails_sent
        total_succeeded += s.succeeded
        total_failed += s.failed

    success_rate = (total_succeeded / total_businesses * 100) if total_businesses > 0 else 0.0

    return GlobalStatsResponse(
        total_runs=total_runs,
        active_runs=active_runs,
        total_businesses=total_businesses,
        total_websites_crawled=total_websites_crawled,
        total_sites_generated=total_sites_generated,
        total_sites_deployed=total_sites_deployed,
        total_emails_sent=total_emails_sent,
        total_succeeded=total_succeeded,
        total_failed=total_failed,
        success_rate=round(success_rate, 1),
    )


# -----------------------------------------------------------------------------
# Run Management Endpoints
# -----------------------------------------------------------------------------
@app.post("/runs", response_model=PipelineRunState, status_code=status.HTTP_201_CREATED, tags=["Runs"])
@app.post("/api/runs", response_model=PipelineRunState, status_code=status.HTTP_201_CREATED, tags=["Runs"])
async def create_run(req: CreateRunRequest):
    """
    Starts a new end-to-end pipeline run with concurrent workers.
    """
    config = PipelineRunConfig(
        query=req.query,
        limit=req.limit,
        concurrency=req.concurrency,
        dry_run=req.dry_run,
        ai_provider=req.ai_provider,
        email_provider=req.email_provider,
        deploy_provider=req.deploy_provider,
        template_override=req.template_override,
        max_retries=req.max_retries,
        delay_seconds=req.delay_seconds,
        fast_mode=req.fast_mode,
        render_js=req.render_js,
        screenshot=req.screenshot,
    )

    run_state = control_mgr.start_run_async(
        config=config,
        orchestrator_factory=get_orchestrator_factory(),
    )
    return run_state


@app.get("/runs", response_model=List[PipelineRunState], tags=["Runs"])
@app.get("/api/runs", response_model=List[PipelineRunState], tags=["Runs"])
async def list_runs(limit: Optional[int] = Query(default=50, ge=1, le=500)):
    """
    Lists all runs sorted newest first.
    """
    return state_mgr.list_all_runs(limit=limit)


@app.get("/runs/{run_id}", response_model=RunDetailResponse, tags=["Runs"])
@app.get("/api/runs/{run_id}", response_model=RunDetailResponse, tags=["Runs"])
async def get_run_detail(run_id: str):
    """
    Fetches comprehensive details for a run including all businesses and current status.
    """
    try:
        run_state = state_mgr.load_run_state(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")

    biz_map = state_mgr.load_all_business_states(run_id)
    # Order businesses according to run_state.business_ids if available
    ordered_biz: List[BusinessRunState] = []
    if run_state.business_ids:
        for b_id in run_state.business_ids:
            if b_id in biz_map:
                ordered_biz.append(biz_map[b_id])
    else:
        ordered_biz = list(biz_map.values())

    is_active = control_mgr.is_run_active(run_id)
    return RunDetailResponse(
        run=run_state,
        businesses=ordered_biz,
        is_active=is_active,
    )


@app.post("/runs/{run_id}/pause", response_model=PipelineRunState, tags=["Control"])
@app.post("/api/runs/{run_id}/pause", response_model=PipelineRunState, tags=["Control"])
async def pause_run(run_id: str):
    """
    Pauses an in-progress pipeline run.
    """
    try:
        return control_mgr.pause_run(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/runs/{run_id}/resume", response_model=PipelineRunState, tags=["Control"])
@app.post("/api/runs/{run_id}/resume", response_model=PipelineRunState, tags=["Control"])
async def resume_run(run_id: str):
    """
    Resumes a paused or stopped pipeline run from saved checkpoints.
    """
    try:
        return control_mgr.resume_run(
            run_id=run_id,
            orchestrator_factory=get_orchestrator_factory(),
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/runs/{run_id}/cancel", response_model=PipelineRunState, tags=["Control"])
@app.post("/api/runs/{run_id}/cancel", response_model=PipelineRunState, tags=["Control"])
async def cancel_run(run_id: str):
    """
    Cancels an active pipeline run.
    """
    try:
        return control_mgr.cancel_run(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/runs/{run_id}/retry", response_model=PipelineRunState, tags=["Control"])
@app.post("/api/runs/{run_id}/retry", response_model=PipelineRunState, tags=["Control"])
async def retry_run(run_id: str, req: Optional[RetryRunRequest] = None):
    """
    Resets failed stages to 'pending' and re-executes the pipeline.
    """
    try:
        stage_name = req.stage if req else None
        business_id = req.business_id if req else None
        return control_mgr.retry_run(
            run_id=run_id,
            stage_name=stage_name,
            business_id=business_id,
            orchestrator_factory=get_orchestrator_factory(),
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------------------------------------------------------
# Structured Events & SSE Stream
# -----------------------------------------------------------------------------
@app.get("/runs/{run_id}/events", tags=["Events"])
@app.get("/api/runs/{run_id}/events", tags=["Events"])
async def get_run_events(
    run_id: str,
    request: Request,
    stream: bool = Query(default=False, description="Stream events as Server-Sent Events"),
    since: Optional[str] = Query(default=None, description="Filter events after ISO timestamp"),
    business_id: Optional[str] = Query(default=None, description="Filter events for business ID"),
    stage: Optional[str] = Query(default=None, description="Filter events for stage"),
    level: Optional[str] = Query(default=None, description="Filter events by severity level"),
    limit: Optional[int] = Query(default=500, ge=1, le=5000, description="Max events to return"),
):
    """
    Retrieves or live-streams structured events persisted in events.jsonl.
    """
    # Check if run exists
    run_dir = state_mgr.get_run_dir(run_id)
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")

    accept_header = request.headers.get("accept", "")
    is_sse = stream or ("text/event-stream" in accept_header)

    if is_sse:
        async def event_generator():
            try:
                # Yield comment header
                yield ": keep-alive\n\n"
                async for event in event_mgr.stream_events(
                    run_id=run_id,
                    since_timestamp=since,
                    business_id=business_id,
                    poll_interval=0.2,
                    is_active_check=lambda: control_mgr.is_run_active(run_id),
                ):
                    data = event.model_dump_json()
                    yield f"event: message\ndata: {data}\n\n"
                # Send terminal event
                yield "event: end\ndata: {}\n\n"
            except Exception as e:
                logger.error("SSE stream error for %s: %s", run_id, e)

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    # Return standard JSON array of replayed events
    events = event_mgr.get_events(
        run_id=run_id,
        since_timestamp=since,
        business_id=business_id,
        stage=stage,
        level=level,
        limit=limit,
    )
    return events


# -----------------------------------------------------------------------------
# Deep Business Inspection Endpoints
# -----------------------------------------------------------------------------
@app.get("/businesses/{business_id}", response_model=BusinessDetailResponse, tags=["Businesses"])
@app.get("/api/businesses/{business_id}", response_model=BusinessDetailResponse, tags=["Businesses"])
async def get_business_detail(business_id: str, run_id: Optional[str] = None):
    """
    Deep inspection of a business: returns Maps record, stage execution history,
    website scraped data, intelligence analysis, Next.js site manifest, deployed URL,
    personalized email body, delivery record, and structured stage logs.
    """
    # 1. Locate business state across runs
    found_biz_state: Optional[BusinessRunState] = None
    target_run_id: Optional[str] = run_id

    if target_run_id:
        found_biz_state = state_mgr.load_business_state(target_run_id, business_id)
    else:
        # Search recent runs
        for r in state_mgr.list_all_runs(limit=20):
            b = state_mgr.load_business_state(r.run_id, business_id)
            if b:
                found_biz_state = b
                target_run_id = r.run_id
                break

    # If still not found in runs, create a fallback BusinessRunState from raw files
    business_name = found_biz_state.business_name if found_biz_state else business_id
    status_str = found_biz_state.status if found_biz_state else "unknown"
    stages_dict = found_biz_state.stages if found_biz_state else {}
    biz_data = found_biz_state.business_data if found_biz_state else None
    website_url = found_biz_state.website if found_biz_state else None
    email_val = found_biz_state.email if found_biz_state else None
    phone_val = found_biz_state.phone if found_biz_state else None
    current_stage = found_biz_state.current_stage if found_biz_state else None

    # 2. Discover related artifacts on disk
    website_data: Optional[Dict[str, Any]] = None
    intelligence_data: Optional[Dict[str, Any]] = None
    site_data: Optional[Dict[str, Any]] = None
    manifest_data: Optional[Dict[str, Any]] = None
    deployment_data: Optional[Dict[str, Any]] = None
    email_draft_data: Optional[Dict[str, Any]] = None
    email_delivery_data: Optional[Dict[str, Any]] = None

    # Scraped Website JSON
    site_json = WEBSITES_DATA_DIR / business_id / "website.json"
    if site_json.exists():
        try:
            with open(site_json, "r", encoding="utf-8") as f:
                website_data = json.load(f)
        except Exception:
            pass

    # Website Intelligence JSON
    intel_json = WEBSITES_DATA_DIR / business_id / "website_intelligence.json"
    if intel_json.exists():
        try:
            with open(intel_json, "r", encoding="utf-8") as f:
                intelligence_data = json.load(f)
                if not business_name or business_name == business_id:
                    business_name = intelligence_data.get("business_profile", {}).get("business_name", business_id)
        except Exception:
            pass

    # Generated Next.js Site files
    gen_dir = GENERATED_DIR / business_id
    if gen_dir.exists():
        s_data_file = gen_dir / "site-data.json"
        if s_data_file.exists():
            try:
                with open(s_data_file, "r", encoding="utf-8") as f:
                    site_data = json.load(f)
            except Exception:
                pass

        man_file = gen_dir / "generator-manifest.json"
        if man_file.exists():
            try:
                with open(man_file, "r", encoding="utf-8") as f:
                    manifest_data = json.load(f)
            except Exception:
                pass

        dep_file = gen_dir / "deployment.json"
        if dep_file.exists():
            try:
                with open(dep_file, "r", encoding="utf-8") as f:
                    deployment_data = json.load(f)
            except Exception:
                pass

        em_file = gen_dir / "email.json"
        if em_file.exists():
            try:
                with open(em_file, "r", encoding="utf-8") as f:
                    email_draft_data = json.load(f)
            except Exception:
                pass

        em_del_file = gen_dir / "email_delivery.json"
        if em_del_file.exists():
            try:
                with open(em_del_file, "r", encoding="utf-8") as f:
                    email_delivery_data = json.load(f)
            except Exception:
                pass

    # 3. Retrieve events for this business if run ID known
    biz_events: List[PipelineEvent] = []
    if target_run_id:
        biz_events = event_mgr.get_events(run_id=target_run_id, business_id=business_id)

    return BusinessDetailResponse(
        business_id=business_id,
        business_name=business_name,
        website=website_url,
        email=email_val,
        phone=phone_val,
        status=status_str,
        current_stage=current_stage,
        stages=stages_dict,
        business_data=biz_data,
        website_data=website_data,
        intelligence=intelligence_data,
        generated_manifest=manifest_data,
        site_data=site_data,
        deployment=deployment_data,
        email_draft=email_draft_data,
        email_delivery=email_delivery_data,
        events=biz_events,
    )
