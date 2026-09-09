import re
import json
import logging
import threading
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, Dict, List, Union

from config.settings import RUNS_DIR
from contracts.orchestrator import (
    StageStatus,
    PIPELINE_STAGES,
    StageExecution,
    BusinessRunState,
    PipelineRunConfig,
    PipelineSummary,
    PipelineRunState,
)

logger = logging.getLogger(__name__)


def slugify(text: str) -> str:
    """Converts search query or string into a clean filesystem slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "_", text)[:40].strip("_")


class RunStateManager:
    """
    Manages local filesystem run state, checkpoints, and resume discovery.
    Thread-safe for concurrent worker pipelines.
    
    Structure:
    data/runs/<run-id>/
    ├── run.json
    ├── events.jsonl
    └── businesses/
        └── <business-id>.json
    """

    def __init__(self, runs_root: Optional[Path] = None):
        self.runs_root = Path(runs_root) if runs_root else RUNS_DIR
        self.runs_root.mkdir(parents=True, exist_ok=True)
        self._locks: Dict[str, threading.RLock] = {}
        self._global_lock = threading.RLock()

    def _get_run_lock(self, run_id: str) -> threading.RLock:
        """Returns or creates a reentrant/thread lock for a given run ID."""
        with self._global_lock:
            if run_id not in self._locks:
                self._locks[run_id] = threading.RLock()
            return self._locks[run_id]

    def generate_run_id(self, query: str) -> str:
        """Generates a human-readable, timestamped run ID."""
        ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        slug = slugify(query) or "pipeline_run"
        return f"run_{ts}_{slug}"

    def get_run_dir(self, run_id: str) -> Path:
        """Returns the directory path for a specific run ID."""
        return self.runs_root / run_id

    def get_businesses_dir(self, run_id: str) -> Path:
        """Returns the businesses directory path for a specific run ID."""
        return self.get_run_dir(run_id) / "businesses"

    def initialize_run(self, config: PipelineRunConfig, run_id: Optional[str] = None) -> PipelineRunState:
        """
        Creates a new run directory structure and initializes run.json.
        """
        active_run_id = run_id or self.generate_run_id(config.query)
        run_dir = self.get_run_dir(active_run_id)
        biz_dir = self.get_businesses_dir(active_run_id)

        run_dir.mkdir(parents=True, exist_ok=True)
        biz_dir.mkdir(parents=True, exist_ok=True)

        run_state = PipelineRunState(
            run_id=active_run_id,
            query=config.query,
            status="running",
            config=config,
            started_at=datetime.now(timezone.utc).isoformat(),
            total_businesses=0,
            business_ids=[],
            summary=PipelineSummary(),
            errors=[],
            warnings=[],
        )

        self.save_run_state(run_state)
        logger.info("Initialized run %s at %s", active_run_id, run_dir)
        return run_state

    def save_run_state(self, run_state: PipelineRunState):
        """Saves top-level run.json to disk with atomic write and thread-locking."""
        lock = self._get_run_lock(run_state.run_id)
        run_dir = self.get_run_dir(run_state.run_id)
        run_dir.mkdir(parents=True, exist_ok=True)
        run_file = run_dir / "run.json"
        temp_file = run_dir / "run.json.tmp"

        with lock:
            try:
                with open(temp_file, "w", encoding="utf-8") as f:
                    f.write(run_state.model_dump_json(indent=2))
                temp_file.replace(run_file)
            except Exception as e:
                logger.error("Failed to save run.json for %s: %s", run_state.run_id, e)

    def load_run_state(self, run_id_or_path: Union[str, Path]) -> PipelineRunState:
        """
        Loads a PipelineRunState by run ID or direct path to run.json / run dir.
        """
        p = Path(run_id_or_path)
        if p.is_file() and p.name == "run.json":
            target_file = p
        elif p.is_dir() and (p / "run.json").exists():
            target_file = p / "run.json"
        else:
            candidate = self.runs_root / str(run_id_or_path) / "run.json"
            if candidate.exists():
                target_file = candidate
            else:
                raise FileNotFoundError(f"Could not locate run state for '{run_id_or_path}' in {self.runs_root}")

        with open(target_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        return PipelineRunState.model_validate(data)

    def list_all_runs(self, limit: Optional[int] = None) -> List[PipelineRunState]:
        """
        Lists all runs present in the runs root directory, sorted newest first.
        """
        runs: List[PipelineRunState] = []
        if not self.runs_root.exists():
            return runs

        for run_dir in sorted(self.runs_root.iterdir(), reverse=True):
            if run_dir.is_dir() and (run_dir / "run.json").exists():
                try:
                    run_state = self.load_run_state(run_dir)
                    runs.append(run_state)
                except Exception as e:
                    logger.warning("Error loading run from %s: %s", run_dir, e)

        # Sort by started_at descending
        runs.sort(key=lambda r: r.started_at or "", reverse=True)
        if limit and limit > 0:
            return runs[:limit]
        return runs

    def save_business_state(self, run_id: str, business_state: BusinessRunState):
        """Saves or updates individual business checkpoint JSON."""
        lock = self._get_run_lock(run_id)
        biz_dir = self.get_businesses_dir(run_id)
        biz_dir.mkdir(parents=True, exist_ok=True)
        biz_file = biz_dir / f"{business_state.business_id}.json"

        business_state.updated_at = datetime.now(timezone.utc).isoformat()
        with lock:
            try:
                with open(biz_file, "w", encoding="utf-8") as f:
                    f.write(business_state.model_dump_json(indent=2))
            except Exception as e:
                logger.error("Failed to save business state for %s: %s", business_state.business_id, e)

    def load_business_state(self, run_id: str, business_id: str) -> Optional[BusinessRunState]:
        """Loads business state from checkpoint JSON if it exists."""
        lock = self._get_run_lock(run_id)
        with lock:
            biz_file = self.get_businesses_dir(run_id) / f"{business_id}.json"
            if biz_file.exists():
                try:
                    with open(biz_file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    return BusinessRunState.model_validate(data)
                except Exception as e:
                    logger.warning("Could not read business checkpoint %s: %s", biz_file, e)
            return None

    def load_all_business_states(self, run_id: str) -> Dict[str, BusinessRunState]:
        """Loads all business state checkpoints for a given run."""
        lock = self._get_run_lock(run_id)
        with lock:
            biz_dir = self.get_businesses_dir(run_id)
            results: Dict[str, BusinessRunState] = {}
            if not biz_dir.exists():
                return results

            for biz_file in sorted(biz_dir.glob("*.json")):
                try:
                    with open(biz_file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    biz_state = BusinessRunState.model_validate(data)
                    results[biz_state.business_id] = biz_state
                except Exception as e:
                    logger.warning("Error loading business state %s: %s", biz_file, e)

            return results

    def update_stage(
        self,
        run_id: str,
        business_state: BusinessRunState,
        stage_name: str,
        status: StageStatus,
        output_ref: Optional[str] = None,
        error: Optional[str] = None,
        warnings: Optional[List[str]] = None,
        duration: float = 0.0,
        retry_count: int = 0,
    ) -> BusinessRunState:
        """
        Updates a stage execution record, updates business-level status, and writes checkpoint to disk.
        """
        stage = business_state.get_stage(stage_name)
        stage.status = status
        stage.duration_seconds = duration
        stage.retry_count = retry_count
        if output_ref:
            stage.output_ref = output_ref
        if error:
            stage.error = error
        if warnings:
            stage.warnings.extend(warnings)

        if status == "running":
            stage.started_at = datetime.now(timezone.utc).isoformat()
            business_state.current_stage = stage_name
        elif status in ("completed", "failed", "skipped"):
            stage.completed_at = datetime.now(timezone.utc).isoformat()

        # Update overall business status based on stages
        if any(s.status == "failed" for s in business_state.stages.values()):
            business_state.status = "failed"
        elif all(s.status == "completed" for s in business_state.stages.values()) and len(business_state.stages) >= len(PIPELINE_STAGES):
            business_state.status = "completed"
        elif any(s.status == "running" for s in business_state.stages.values()):
            business_state.status = "running"

        self.save_business_state(run_id, business_state)
        return business_state

    def reset_failed_stages(
        self,
        run_id: str,
        stage_name: Optional[str] = None,
        business_id: Optional[str] = None,
    ) -> int:
        """
        Resets failed stage executions to 'pending' to allow targeted retries.
        Returns number of stages reset.
        """
        all_biz = self.load_all_business_states(run_id)
        reset_count = 0

        for b_id, b_state in all_biz.items():
            if business_id and b_id != business_id:
                continue

            changed = False
            for s_name, stage_exec in b_state.stages.items():
                if stage_name and s_name != stage_name:
                    continue
                if stage_exec.status == "failed":
                    stage_exec.status = "pending"
                    stage_exec.error = None
                    stage_exec.completed_at = None
                    reset_count += 1
                    changed = True

            if changed:
                # Recalculate business status
                if any(s.status == "failed" for s in b_state.stages.values()):
                    b_state.status = "failed"
                elif all(s.status == "completed" for s in b_state.stages.values()) and len(b_state.stages) >= len(PIPELINE_STAGES):
                    b_state.status = "completed"
                else:
                    b_state.status = "pending"
                self.save_business_state(run_id, b_state)

        return reset_count

    def refresh_run_summary(self, run_state: PipelineRunState) -> PipelineSummary:
        """
        Aggregates stage results across all businesses and updates run summary with full operational metrics.
        Thread-safe under run lock.
        """
        lock = self._get_run_lock(run_state.run_id)
        with lock:
            all_biz = self.load_all_business_states(run_state.run_id)

            summary = run_state.summary or PipelineSummary()
            summary.requested = run_state.config.limit if (run_state.config and run_state.config.limit) else (run_state.total_businesses or len(all_biz))
            summary.businesses_found = run_state.total_businesses or len(all_biz)
            summary.found = summary.found or summary.businesses_found
            summary.attempted = summary.attempted or len(all_biz)

            websites_collected = 0
            intelligence_completed = 0
            sites_generated = 0
            sites_deployed = 0
            emails_generated = 0
            emails_sent = 0
            failed_count = 0
            skipped_count = 0
            succeeded_count = 0
            processed_count = 0
            usable_count = 0

            for b_id, b_state in all_biz.items():
                stages = b_state.stages
                
                is_usable = True
                if b_state.business_data and isinstance(b_state.business_data, dict):
                    is_usable = b_state.business_data.get("usable", True)
                if is_usable:
                    usable_count += 1

                if b_state.status in ("running", "completed", "failed") or any(s.status != "pending" for s in stages.values()):
                    processed_count += 1

                if stages.get("website_collector", StageExecution(stage_name="website_collector")).status == "completed":
                    websites_collected += 1
                if stages.get("website_intelligence", StageExecution(stage_name="website_intelligence")).status == "completed":
                    intelligence_completed += 1
                if stages.get("website_generator", StageExecution(stage_name="website_generator")).status == "completed":
                    sites_generated += 1
                if stages.get("deployment", StageExecution(stage_name="deployment")).status == "completed":
                    sites_deployed += 1
                if stages.get("email_generator", StageExecution(stage_name="email_generator")).status == "completed":
                    emails_generated += 1
                if stages.get("email_sender", StageExecution(stage_name="email_sender")).status == "completed":
                    emails_sent += 1

                if b_state.status == "completed" or (stages.get("email_sender") and stages.get("email_sender").status == "completed"):
                    succeeded_count += 1
                elif b_state.status == "failed" or any(s.status == "failed" for s in stages.values()):
                    failed_count += 1
                elif b_state.status == "skipped" or any(s.status == "skipped" for s in stages.values()):
                    skipped_count += 1

            summary.websites_collected = websites_collected
            summary.intelligence_completed = intelligence_completed
            summary.sites_generated = sites_generated
            summary.sites_deployed = sites_deployed
            summary.emails_generated = emails_generated
            summary.emails_sent = emails_sent

            summary.usable = summary.usable or usable_count
            summary.processed = processed_count
            summary.succeeded = succeeded_count
            summary.failed = failed_count
            summary.skipped = skipped_count

            run_state.summary = summary
            self.save_run_state(run_state)
            return summary
