import sys
import time
import logging
import concurrent.futures
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Union

from config.settings import WEBSITES_DATA_DIR, GENERATED_DIR, RUNS_DIR
from contracts.business import Business
from contracts.maps import MapsSearchRequest, MapsSearchResult
from contracts.website import WebsiteCollectionRequest, WebsiteCollectionResult
from contracts.intelligence import WebsiteIntelligence
from contracts.generator import WebsiteGenerationResult
from contracts.deployment import DeploymentResult
from contracts.email import OutreachEmail, EmailDeliveryResult
from contracts.orchestrator import (
    StageStatus,
    PIPELINE_STAGES,
    StageExecution,
    BusinessRunState,
    PipelineRunConfig,
    PipelineSummary,
    PipelineRunState,
)
from modules.maps_scraper import GoogleMapsScraper
from modules.website_collector import WebsiteCollector
from modules.website_intelligence import WebsiteIntelligenceAnalyzer
from modules.website_intelligence.providers import get_provider as get_ai_provider
from modules.website_generator import WebsiteGenerator
from modules.deployment import DeploymentManager
from modules.email_generator import EmailGenerator
from modules.email_sender import EmailSenderManager
from .state import RunStateManager, slugify
from .retry import execute_with_retry
from .reporter import PipelineReporter
from .events import EventManager
from .control import RunControl, RunCancelledException

logger = logging.getLogger(__name__)


class PipelineOrchestrator:
    """
    End-to-End Orchestrator coordinating all 7 stages of Nayom-Automation:
    Maps Scraper -> Website Collector -> Website Intelligence -> Website Generator -> Deployment -> Email Generator -> Email Sender.
    
    Provides:
    - Configurable concurrent worker execution (ThreadPoolExecutor)
    - Structured append-only event emission (events.jsonl)
    - Real-time pause, resume, cancel, and stage retry capabilities
    - Per-business isolation (failures never halt remaining businesses)
    - Granular stage checkpointing (resumes without re-running completed stages)
    - Automated transient error retries
    - Clean separation from underlying module logic
    """

    def __init__(
        self,
        scraper: Optional[GoogleMapsScraper] = None,
        collector: Optional[WebsiteCollector] = None,
        analyzer: Optional[WebsiteIntelligenceAnalyzer] = None,
        generator: Optional[WebsiteGenerator] = None,
        deployer: Optional[DeploymentManager] = None,
        email_generator: Optional[EmailGenerator] = None,
        email_sender: Optional[EmailSenderManager] = None,
        state_manager: Optional[RunStateManager] = None,
        reporter: Optional[PipelineReporter] = None,
        event_manager: Optional[EventManager] = None,
    ):
        self.scraper = scraper or GoogleMapsScraper()
        self.collector = collector or WebsiteCollector()
        self.analyzer = analyzer or WebsiteIntelligenceAnalyzer()
        self.generator = generator or WebsiteGenerator()
        self.deployer = deployer or DeploymentManager()
        self.email_generator = email_generator or EmailGenerator()
        self.email_sender = email_sender or EmailSenderManager()
        self.state_manager = state_manager or RunStateManager()
        self.reporter = reporter or PipelineReporter()
        self.event_manager = event_manager or EventManager()

    def _execute_stage_with_retry(
        self,
        fn,
        stage_name: str,
        business_id: str,
        max_retries: int = 2,
    ) -> tuple[Any, float, int]:
        """Runs a stage function wrapped in timing and transient error retries."""
        start_time = time.monotonic()
        result, retries = execute_with_retry(
            fn=fn,
            max_retries=max_retries,
            stage_name=stage_name,
            business_id=business_id,
        )
        duration = round(time.monotonic() - start_time, 2)
        return result, duration, retries

    def run(
        self,
        config: PipelineRunConfig,
        run_control: Optional[RunControl] = None,
    ) -> PipelineRunState:
        """
        Executes or resumes an end-to-end pipeline run with concurrency and structured events.
        """
        start_mono = time.monotonic()
        is_resume = bool(config.resume_run_id)

        # -------------------------------------------------------------
        # 1. State Initialization & Resume Handling
        # -------------------------------------------------------------
        if is_resume:
            try:
                run_state = self.state_manager.load_run_state(config.resume_run_id)
                run_state.status = "running"
                self.state_manager.save_run_state(run_state)
            except Exception as e:
                logger.error("Failed to load run for resume (%s): %s", config.resume_run_id, e)
                raise e
        else:
            run_state = self.state_manager.initialize_run(config)

        self.event_manager.emit(
            run_id=run_state.run_id,
            status="started" if not is_resume else "resumed",
            message=f"Pipeline run {'resumed' if is_resume else 'started'} for query: '{config.query}'",
            metadata={"limit": config.limit, "concurrency": config.concurrency, "dry_run": config.dry_run},
            level="info",
        )

        self.reporter.print_banner(
            query=run_state.query,
            run_id=run_state.run_id,
            limit=config.limit,
            dry_run=config.dry_run,
            is_resume=is_resume,
        )

        # -------------------------------------------------------------
        # 2. Stage 0: Maps Scraper (Discovery)
        # -------------------------------------------------------------
        all_businesses: Dict[str, BusinessRunState] = self.state_manager.load_all_business_states(run_state.run_id)

        if not all_businesses or not run_state.business_ids:
            if run_control:
                try:
                    run_control.check_and_wait()
                except RunCancelledException:
                    run_state.status = "cancelled"
                    self.state_manager.save_run_state(run_state)
                    self.event_manager.emit(run_id=run_state.run_id, status="cancelled", message="Run cancelled prior to discovery", level="warning")
                    return run_state

            logger.info("Discovering businesses via Google Maps Scraper for '%s' (limit: %d)...", config.query, config.limit)
            print(f"[*] Discovering businesses via Google Maps Scraper for: '{config.query}'...")

            self.event_manager.emit(
                run_id=run_state.run_id,
                stage="maps_scraper",
                status="running",
                message=f"Beginning Google Maps discovery for '{config.query}' (limit: {config.limit})",
                level="info",
            )

            maps_req = MapsSearchRequest(
                query=config.query,
                max_results=config.limit,
                fast_mode=config.fast_mode,
            )

            try:
                search_res, s_dur, s_retries = self._execute_stage_with_retry(
                    fn=lambda: self.scraper.search(maps_req),
                    stage_name="maps_scraper",
                    business_id="search",
                    max_retries=config.max_retries,
                )
                discovered = search_res.businesses
                run_state.summary.requested = getattr(search_res, "requested", config.limit)
                run_state.summary.attempted = getattr(search_res, "attempted", len(discovered))
                run_state.summary.found = getattr(search_res, "found", getattr(search_res, "total_found", len(discovered)))
                run_state.summary.usable = getattr(search_res, "usable", getattr(search_res, "usable_count", len(discovered)))
                run_state.summary.businesses_found = len(discovered)
                print(f"   -> Discovered {len(discovered)} businesses in {s_dur:.2f}s\n")

                self.event_manager.emit(
                    run_id=run_state.run_id,
                    stage="maps_scraper",
                    status="completed",
                    duration_ms=s_dur * 1000,
                    message=f"Google Maps discovery completed: found {len(discovered)} businesses ({run_state.summary.usable} usable)",
                    metadata={"found": len(discovered), "usable": run_state.summary.usable},
                    level="success",
                )
            except Exception as e:
                err_msg = f"Maps scraper discovery failed: {e}"
                logger.error(err_msg)
                print(f"\n[ERROR] {err_msg}", file=sys.stderr)
                run_state.status = "failed"
                run_state.errors.append(err_msg)
                run_state.completed_at = datetime.now(timezone.utc).isoformat()
                run_state.duration_seconds = round(time.monotonic() - start_mono, 2)
                self.state_manager.save_run_state(run_state)

                self.event_manager.emit(
                    run_id=run_state.run_id,
                    stage="maps_scraper",
                    status="failed",
                    message=err_msg,
                    metadata={"error": str(e)},
                    level="error",
                )
                return run_state

            # Initialize per-business checkpoint records
            run_state.total_businesses = len(discovered)
            run_state.business_ids = []

            for biz in discovered:
                biz_state = BusinessRunState(
                    business_id=biz.id,
                    business_name=biz.name,
                    website=biz.website,
                    email=biz.email,
                    phone=biz.phone,
                    status="pending",
                    business_data=biz.model_dump(),
                )
                self.state_manager.save_business_state(run_state.run_id, biz_state)
                all_businesses[biz.id] = biz_state
                run_state.business_ids.append(biz.id)

            self.state_manager.save_run_state(run_state)

        total_biz = len(run_state.business_ids)
        concurrency = max(1, getattr(config, "concurrency", 5))
        print(f"[*] Pipeline processing {total_biz} businesses with concurrency {concurrency} (Run: {run_state.run_id})...\n")

        # -------------------------------------------------------------
        # 3. Concurrent Per-Business Pipeline Execution
        # -------------------------------------------------------------
        def _worker_task(item: tuple[int, str]):
            idx, biz_id = item
            if run_control:
                try:
                    run_control.check_and_wait()
                except RunCancelledException:
                    return

            biz_state = self.state_manager.load_business_state(run_state.run_id, biz_id) or all_businesses.get(biz_id)
            if not biz_state:
                return

            if biz_state.status == "completed":
                self.reporter.print_stage_result(
                    business_name=biz_state.business_name,
                    stage_name="all_stages",
                    status="completed",
                    duration=0.0,
                    detail="All stages already completed (checkpoint resumed)",
                )
                return

            try:
                self._process_single_business(
                    idx=idx,
                    total=total_biz,
                    run_id=run_state.run_id,
                    biz_state=biz_state,
                    config=config,
                    run_control=run_control,
                )
            except RunCancelledException:
                logger.info("Business processing for %s stopped due to run cancellation", biz_id)
                return
            except Exception as unhandled_exc:
                logger.error("Unhandled exception processing business %s: %s", biz_id, unhandled_exc, exc_info=True)
                biz_state.status = "failed"
                biz_state.error = str(unhandled_exc)
                self.state_manager.save_business_state(run_state.run_id, biz_state)

            all_businesses[biz_id] = biz_state
            self.state_manager.refresh_run_summary(run_state)

            if config.delay_seconds > 0 and idx < total_biz:
                time.sleep(config.delay_seconds)

        work_items = list(enumerate(run_state.business_ids, start=1))

        if concurrency == 1 or len(work_items) <= 1:
            for item in work_items:
                if run_control and run_control.is_cancelled:
                    break
                _worker_task(item)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency, thread_name_prefix="nayom-biz") as executor:
                futures = [executor.submit(_worker_task, item) for item in work_items]
                for future in concurrent.futures.as_completed(futures):
                    try:
                        future.result()
                    except Exception as e:
                        logger.error("Thread pool task exception: %s", e)

        # -------------------------------------------------------------
        # 4. Finalization & Summary Reporting
        # -------------------------------------------------------------
        run_state.completed_at = datetime.now(timezone.utc).isoformat()
        run_state.duration_seconds = round(time.monotonic() - start_mono, 2)
        summary = self.state_manager.refresh_run_summary(run_state)

        if run_control and run_control.is_cancelled:
            run_state.status = "cancelled"
            self.event_manager.emit(
                run_id=run_state.run_id,
                status="cancelled",
                duration_ms=run_state.duration_seconds * 1000,
                message=f"Pipeline run {run_state.run_id} cancelled",
                metadata={"processed": summary.processed, "succeeded": summary.succeeded, "failed": summary.failed},
                level="warning",
            )
        elif run_control and run_control.is_paused:
            run_state.status = "paused"
            self.event_manager.emit(
                run_id=run_state.run_id,
                status="paused",
                duration_ms=run_state.duration_seconds * 1000,
                message=f"Pipeline run {run_state.run_id} paused",
                level="warning",
            )
        elif summary.failed >= total_biz and total_biz > 0:
            run_state.status = "failed"
            self.event_manager.emit(
                run_id=run_state.run_id,
                status="failed",
                duration_ms=run_state.duration_seconds * 1000,
                message=f"Pipeline run {run_state.run_id} completed with all {summary.failed} businesses failed",
                metadata={"failed": summary.failed, "total": total_biz},
                level="error",
            )
        else:
            run_state.status = "completed"
            self.event_manager.emit(
                run_id=run_state.run_id,
                status="completed",
                duration_ms=run_state.duration_seconds * 1000,
                message=f"Pipeline run {run_state.run_id} finished successfully: {summary.succeeded}/{total_biz} businesses succeeded",
                metadata={"succeeded": summary.succeeded, "processed": summary.processed, "failed": summary.failed},
                level="success",
            )

        self.state_manager.save_run_state(run_state)
        self.reporter.print_final_summary(run_state, all_businesses)
        return run_state

    def _process_single_business(
        self,
        idx: int,
        total: int,
        run_id: str,
        biz_state: BusinessRunState,
        config: PipelineRunConfig,
        run_control: Optional[RunControl] = None,
    ):
        """Processes all 6 sequential stages for a single business with checkpoint checks and events."""
        biz_name = biz_state.business_name
        biz_id = biz_state.business_id

        # -------------------------------------------------------------
        # Stage 1: Website Collector
        # -------------------------------------------------------------
        if run_control:
            run_control.check_and_wait()

        stage_name = "website_collector"
        if biz_state.is_stage_completed(stage_name):
            self.reporter.print_stage_result(biz_name, stage_name, "completed", 0.0, "Checkpoint resumed")
        elif not biz_state.website or not biz_state.website.strip():
            self.state_manager.update_stage(
                run_id=run_id,
                business_state=biz_state,
                stage_name=stage_name,
                status="skipped",
                warnings=["No website URL provided for business"],
            )
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="skipped",
                message=f"[{biz_name}] Skipped website collection (no website URL)",
                level="info",
            )
            self.reporter.print_stage_result(biz_name, stage_name, "skipped", 0.0, "No website URL")
        else:
            self.reporter.print_stage_start(idx, total, biz_name, stage_name)
            self.state_manager.update_stage(run_id, biz_state, stage_name, status="running")
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="running",
                message=f"[{biz_name}] Crawling website {biz_state.website}...",
                metadata={"url": biz_state.website},
                level="info",
            )

            req = WebsiteCollectionRequest(
                url=biz_state.website,
                site_id=biz_id,
                max_pages=20,
                render_js=config.render_js,
                screenshot=config.screenshot,
            )
            try:
                c_res, c_dur, c_ret = self._execute_stage_with_retry(
                    fn=lambda: self.collector.collect(req),
                    stage_name=stage_name,
                    business_id=biz_id,
                    max_retries=config.max_retries,
                )
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="completed",
                    output_ref=c_res.website_json_path,
                    duration=c_dur,
                    retry_count=c_ret,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="completed",
                    duration_ms=c_dur * 1000,
                    message=f"[{biz_name}] Website collection completed ({c_res.total_pages_crawled} pages)",
                    metadata={"pages": c_res.total_pages_crawled, "output": c_res.website_json_path},
                    level="success",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "completed", c_dur, f"{c_res.total_pages_crawled} pages")
            except Exception as exc:
                err_msg = f"Website collection failed: {exc}"
                logger.warning("[%s] %s", biz_id, err_msg)
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="failed",
                    error=err_msg,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="failed",
                    message=f"[{biz_name}] {err_msg}",
                    metadata={"error": str(exc)},
                    level="error",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "failed", 0.0, str(exc))

        # -------------------------------------------------------------
        # Stage 2: Website Intelligence
        # -------------------------------------------------------------
        if run_control:
            run_control.check_and_wait()

        stage_name = "website_intelligence"
        collector_stage = biz_state.get_stage("website_collector")

        if biz_state.is_stage_completed(stage_name):
            self.reporter.print_stage_result(biz_name, stage_name, "completed", 0.0, "Checkpoint resumed")
        elif collector_stage.status != "completed":
            skip_reason = f"Prerequisite {collector_stage.stage_name} was {collector_stage.status}"
            self.state_manager.update_stage(
                run_id=run_id,
                business_state=biz_state,
                stage_name=stage_name,
                status="skipped",
                warnings=[skip_reason],
            )
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="skipped",
                message=f"[{biz_name}] Skipped intelligence ({skip_reason})",
                level="info",
            )
            self.reporter.print_stage_result(biz_name, stage_name, "skipped", 0.0, skip_reason)
        else:
            self.reporter.print_stage_start(idx, total, biz_name, stage_name)
            self.state_manager.update_stage(run_id, biz_state, stage_name, status="running")
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="running",
                message=f"[{biz_name}] Running AI Website Intelligence analysis...",
                metadata={"provider": config.ai_provider or "default"},
                level="info",
            )

            ai_prov = get_ai_provider(provider_name=config.ai_provider) if config.ai_provider else None
            try:
                i_res, i_dur, i_ret = self._execute_stage_with_retry(
                    fn=lambda: self.analyzer.analyze(
                        source=collector_stage.output_ref or biz_id,
                        provider=ai_prov,
                    ),
                    stage_name=stage_name,
                    business_id=biz_id,
                    max_retries=config.max_retries,
                )
                dest_file = f"data/websites/{biz_id}/website_intelligence.json"
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="completed",
                    output_ref=dest_file,
                    duration=i_dur,
                    retry_count=i_ret,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="completed",
                    duration_ms=i_dur * 1000,
                    message=f"[{biz_name}] Intelligence completed (Recommended template: {i_res.template_recommendation.recommended_template})",
                    metadata={"template": i_res.template_recommendation.recommended_template, "industry": i_res.business_profile.industry_category},
                    level="success",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "completed", i_dur, f"Template: {i_res.template_recommendation.recommended_template}")
            except Exception as exc:
                err_msg = f"Website intelligence analysis failed: {exc}"
                logger.warning("[%s] %s", biz_id, err_msg)
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="failed",
                    error=err_msg,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="failed",
                    message=f"[{biz_name}] {err_msg}",
                    metadata={"error": str(exc)},
                    level="error",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "failed", 0.0, str(exc))

        # -------------------------------------------------------------
        # Stage 3: Website Generator
        # -------------------------------------------------------------
        if run_control:
            run_control.check_and_wait()

        stage_name = "website_generator"
        intel_stage = biz_state.get_stage("website_intelligence")

        if biz_state.is_stage_completed(stage_name):
            self.reporter.print_stage_result(biz_name, stage_name, "completed", 0.0, "Checkpoint resumed")
        elif intel_stage.status != "completed":
            skip_reason = f"Prerequisite {intel_stage.stage_name} was {intel_stage.status}"
            self.state_manager.update_stage(
                run_id=run_id,
                business_state=biz_state,
                stage_name=stage_name,
                status="skipped",
                warnings=[skip_reason],
            )
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="skipped",
                message=f"[{biz_name}] Skipped website generator ({skip_reason})",
                level="info",
            )
            self.reporter.print_stage_result(biz_name, stage_name, "skipped", 0.0, skip_reason)
        else:
            self.reporter.print_stage_start(idx, total, biz_name, stage_name)
            self.state_manager.update_stage(run_id, biz_state, stage_name, status="running")
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="running",
                message=f"[{biz_name}] Generating Next.js website project...",
                level="info",
            )

            try:
                g_res, g_dur, g_ret = self._execute_stage_with_retry(
                    fn=lambda: self.generator.generate(
                        source=intel_stage.output_ref or biz_id,
                        template_override=config.template_override,
                    ),
                    stage_name=stage_name,
                    business_id=biz_id,
                    max_retries=config.max_retries,
                )
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="completed",
                    output_ref=g_res.output_dir,
                    duration=g_dur,
                    retry_count=g_ret,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="completed",
                    duration_ms=g_dur * 1000,
                    message=f"[{biz_name}] Next.js site generated successfully (Template: {g_res.template_id})",
                    metadata={"template": g_res.template_id, "output_dir": g_res.output_dir},
                    level="success",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "completed", g_dur, f"Template: {g_res.template_id}")
            except Exception as exc:
                err_msg = f"Website generation failed: {exc}"
                logger.warning("[%s] %s", biz_id, err_msg)
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="failed",
                    error=err_msg,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="failed",
                    message=f"[{biz_name}] {err_msg}",
                    metadata={"error": str(exc)},
                    level="error",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "failed", 0.0, str(exc))

        # -------------------------------------------------------------
        # Stage 4: Deployment
        # -------------------------------------------------------------
        if run_control:
            run_control.check_and_wait()

        stage_name = "deployment"
        gen_stage = biz_state.get_stage("website_generator")

        if biz_state.is_stage_completed(stage_name):
            self.reporter.print_stage_result(biz_name, stage_name, "completed", 0.0, "Checkpoint resumed")
        elif gen_stage.status != "completed":
            skip_reason = f"Prerequisite {gen_stage.stage_name} was {gen_stage.status}"
            self.state_manager.update_stage(
                run_id=run_id,
                business_state=biz_state,
                stage_name=stage_name,
                status="skipped",
                warnings=[skip_reason],
            )
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="skipped",
                message=f"[{biz_name}] Skipped deployment ({skip_reason})",
                level="info",
            )
            self.reporter.print_stage_result(biz_name, stage_name, "skipped", 0.0, skip_reason)
        else:
            self.reporter.print_stage_start(idx, total, biz_name, stage_name)
            self.state_manager.update_stage(run_id, biz_state, stage_name, status="running")
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="running",
                message=f"[{biz_name}] Deploying website to cloud provider...",
                metadata={"provider": config.deploy_provider or "round-robin"},
                level="info",
            )

            try:
                d_res, d_dur, d_ret = self._execute_stage_with_retry(
                    fn=lambda: self.deployer.deploy(
                        target=gen_stage.output_ref or biz_id,
                        provider_override=config.deploy_provider,
                    ),
                    stage_name=stage_name,
                    business_id=biz_id,
                    max_retries=config.max_retries,
                )
                if d_res.status == "success":
                    self.state_manager.update_stage(
                        run_id=run_id,
                        business_state=biz_state,
                        stage_name=stage_name,
                        status="completed",
                        output_ref=d_res.url,
                        duration=d_dur,
                        retry_count=d_ret,
                    )
                    self.event_manager.emit(
                        run_id=run_id,
                        business_id=biz_id,
                        business_name=biz_name,
                        stage=stage_name,
                        status="completed",
                        duration_ms=d_dur * 1000,
                        message=f"[{biz_name}] Deployed to {d_res.provider.upper()}: {d_res.url}",
                        metadata={"url": d_res.url, "provider": d_res.provider, "deployment_id": d_res.deployment_id},
                        level="success",
                    )
                    self.reporter.print_stage_result(biz_name, stage_name, "completed", d_dur, f"Live URL: {d_res.url}")
                else:
                    self.state_manager.update_stage(
                        run_id=run_id,
                        business_state=biz_state,
                        stage_name=stage_name,
                        status="failed",
                        error=d_res.error or "Deployment status not success",
                        duration=d_dur,
                    )
                    self.event_manager.emit(
                        run_id=run_id,
                        business_id=biz_id,
                        business_name=biz_name,
                        stage=stage_name,
                        status="failed",
                        message=f"[{biz_name}] Deployment failed: {d_res.error}",
                        metadata={"error": d_res.error},
                        level="error",
                    )
                    self.reporter.print_stage_result(biz_name, stage_name, "failed", d_dur, d_res.error or "Deploy failed")
            except Exception as exc:
                err_msg = f"Deployment execution failed: {exc}"
                logger.warning("[%s] %s", biz_id, err_msg)
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="failed",
                    error=err_msg,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="failed",
                    message=f"[{biz_name}] {err_msg}",
                    metadata={"error": str(exc)},
                    level="error",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "failed", 0.0, str(exc))

        # -------------------------------------------------------------
        # Stage 5: Email Generator
        # -------------------------------------------------------------
        if run_control:
            run_control.check_and_wait()

        stage_name = "email_generator"
        deploy_stage = biz_state.get_stage("deployment")

        if biz_state.is_stage_completed(stage_name):
            self.reporter.print_stage_result(biz_name, stage_name, "completed", 0.0, "Checkpoint resumed")
        elif intel_stage.status != "completed":
            skip_reason = f"Prerequisite {intel_stage.stage_name} was {intel_stage.status}"
            self.state_manager.update_stage(
                run_id=run_id,
                business_state=biz_state,
                stage_name=stage_name,
                status="skipped",
                warnings=[skip_reason],
            )
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="skipped",
                message=f"[{biz_name}] Skipped email generator ({skip_reason})",
                level="info",
            )
            self.reporter.print_stage_result(biz_name, stage_name, "skipped", 0.0, skip_reason)
        else:
            self.reporter.print_stage_start(idx, total, biz_name, stage_name)
            self.state_manager.update_stage(run_id, biz_state, stage_name, status="running")
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="running",
                message=f"[{biz_name}] Generating personalized outreach email...",
                level="info",
            )

            preview_url = deploy_stage.output_ref if deploy_stage.status == "completed" else None
            try:
                eg_res, eg_dur, eg_ret = self._execute_stage_with_retry(
                    fn=lambda: self.email_generator.generate(
                        target=biz_id,
                        preview_url=preview_url,
                        recipient=biz_state.email,
                        dry_run=config.dry_run,
                    ),
                    stage_name=stage_name,
                    business_id=biz_id,
                    max_retries=config.max_retries,
                )
                if eg_res.recipient and not biz_state.email:
                    biz_state.email = eg_res.recipient

                dest_file = f"generated/{biz_id}/email.json"
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="completed",
                    output_ref=dest_file,
                    duration=eg_dur,
                    retry_count=eg_ret,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="completed",
                    duration_ms=eg_dur * 1000,
                    message=f"[{biz_name}] Outreach email generated (Subject: {eg_res.subject[:40]}...)",
                    metadata={"subject": eg_res.subject, "recipient": eg_res.recipient},
                    level="success",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "completed", eg_dur, f"Subject: {eg_res.subject[:30]}...")
            except Exception as exc:
                err_msg = f"Email generation failed: {exc}"
                logger.warning("[%s] %s", biz_id, err_msg)
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="failed",
                    error=err_msg,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="failed",
                    message=f"[{biz_name}] {err_msg}",
                    metadata={"error": str(exc)},
                    level="error",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "failed", 0.0, str(exc))

        # -------------------------------------------------------------
        # Stage 6: Email Sender
        # -------------------------------------------------------------
        if run_control:
            run_control.check_and_wait()

        stage_name = "email_sender"
        email_gen_stage = biz_state.get_stage("email_generator")

        if biz_state.is_stage_completed(stage_name):
            self.reporter.print_stage_result(biz_name, stage_name, "completed", 0.0, "Checkpoint resumed")
        elif email_gen_stage.status != "completed":
            skip_reason = f"Prerequisite {email_gen_stage.stage_name} was {email_gen_stage.status}"
            self.state_manager.update_stage(
                run_id=run_id,
                business_state=biz_state,
                stage_name=stage_name,
                status="skipped",
                warnings=[skip_reason],
            )
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="skipped",
                message=f"[{biz_name}] Skipped email sender ({skip_reason})",
                level="info",
            )
            self.reporter.print_stage_result(biz_name, stage_name, "skipped", 0.0, skip_reason)
        else:
            self.reporter.print_stage_start(idx, total, biz_name, stage_name)
            self.state_manager.update_stage(run_id, biz_state, stage_name, status="running")
            self.event_manager.emit(
                run_id=run_id,
                business_id=biz_id,
                business_name=biz_name,
                stage=stage_name,
                status="running",
                message=f"[{biz_name}] Dispatching outreach email ({'DRY RUN' if config.dry_run else 'LIVE'})...",
                level="info",
            )

            try:
                es_res, es_dur, es_ret = self._execute_stage_with_retry(
                    fn=lambda: self.email_sender.send(
                        target=email_gen_stage.output_ref or biz_id,
                        provider_override=config.email_provider or "gmail",
                        dry_run=config.dry_run,
                    ),
                    stage_name=stage_name,
                    business_id=biz_id,
                    max_retries=config.max_retries,
                )
                dest_file = f"generated/{biz_id}/email_delivery.json"

                if es_res.status in ("sent", "dry_run"):
                    self.state_manager.update_stage(
                        run_id=run_id,
                        business_state=biz_state,
                        stage_name=stage_name,
                        status="completed",
                        output_ref=dest_file,
                        duration=es_dur,
                        retry_count=es_ret,
                        warnings=es_res.warnings,
                    )
                    self.event_manager.emit(
                        run_id=run_id,
                        business_id=biz_id,
                        business_name=biz_name,
                        stage=stage_name,
                        status="completed",
                        duration_ms=es_dur * 1000,
                        message=f"[{biz_name}] Email dispatched via {es_res.provider.upper()} ({es_res.status.upper()})",
                        metadata={"provider": es_res.provider, "message_id": es_res.message_id, "status": es_res.status},
                        level="success",
                    )
                    self.reporter.print_stage_result(biz_name, stage_name, "completed", es_dur, f"Status: {es_res.status.upper()} ({es_res.provider})")
                elif es_res.status == "skipped":
                    self.state_manager.update_stage(
                        run_id=run_id,
                        business_state=biz_state,
                        stage_name=stage_name,
                        status="skipped",
                        output_ref=dest_file,
                        duration=es_dur,
                        warnings=es_res.warnings,
                    )
                    self.event_manager.emit(
                        run_id=run_id,
                        business_id=biz_id,
                        business_name=biz_name,
                        stage=stage_name,
                        status="skipped",
                        duration_ms=es_dur * 1000,
                        message=f"[{biz_name}] Email skipped ({', '.join(es_res.warnings)})",
                        metadata={"warnings": es_res.warnings},
                        level="warning",
                    )
                    self.reporter.print_stage_result(biz_name, stage_name, "skipped", es_dur, f"Skipped ({', '.join(es_res.warnings)})")
                else:
                    self.state_manager.update_stage(
                        run_id=run_id,
                        business_state=biz_state,
                        stage_name=stage_name,
                        status="failed",
                        output_ref=dest_file,
                        duration=es_dur,
                        error=es_res.error or "Email delivery failed",
                    )
                    self.event_manager.emit(
                        run_id=run_id,
                        business_id=biz_id,
                        business_name=biz_name,
                        stage=stage_name,
                        status="failed",
                        duration_ms=es_dur * 1000,
                        message=f"[{biz_name}] Email sending failed: {es_res.error}",
                        metadata={"error": es_res.error},
                        level="error",
                    )
                    self.reporter.print_stage_result(biz_name, stage_name, "failed", es_dur, es_res.error or "Delivery failed")
            except Exception as exc:
                err_msg = f"Email sending failed: {exc}"
                logger.warning("[%s] %s", biz_id, err_msg)
                self.state_manager.update_stage(
                    run_id=run_id,
                    business_state=biz_state,
                    stage_name=stage_name,
                    status="failed",
                    error=err_msg,
                )
                self.event_manager.emit(
                    run_id=run_id,
                    business_id=biz_id,
                    business_name=biz_name,
                    stage=stage_name,
                    status="failed",
                    message=f"[{biz_name}] {err_msg}",
                    metadata={"error": str(exc)},
                    level="error",
                )
                self.reporter.print_stage_result(biz_name, stage_name, "failed", 0.0, str(exc))

        # Check overall business status
        if all(s.status == "completed" for s in biz_state.stages.values()):
            biz_state.status = "completed"
        elif any(s.status == "failed" for s in biz_state.stages.values()):
            biz_state.status = "failed"
        else:
            biz_state.status = "completed"

        self.state_manager.save_business_state(run_id, biz_state)
        print()
