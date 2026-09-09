import time
import logging
import threading
from typing import Optional, Dict, Any, Callable
from contracts.orchestrator import PipelineRunState, PipelineRunConfig
from .events import EventManager
from .state import RunStateManager

logger = logging.getLogger(__name__)


class RunCancelledException(Exception):
    """Raised when a run execution is aborted by user command."""
    pass


class RunControl:
    """
    Per-run execution control primitive supporting pause, resume, and cancellation.
    """

    def __init__(self, run_id: str):
        self.run_id = run_id
        # _pause_event is SET when running, CLEARED when paused
        self._pause_event = threading.Event()
        self._pause_event.set()
        # _cancel_event is SET when cancelled
        self._cancel_event = threading.Event()

    @property
    def is_paused(self) -> bool:
        return not self._pause_event.is_set()

    @property
    def is_cancelled(self) -> bool:
        return self._cancel_event.is_set()

    def pause(self):
        """Pauses execution before starting next stages or businesses."""
        self._pause_event.clear()
        logger.info("Run %s paused", self.run_id)

    def resume(self):
        """Resumes a paused run."""
        self._pause_event.set()
        logger.info("Run %s resumed", self.run_id)

    def cancel(self):
        """Cancels a run immediately."""
        self._cancel_event.set()
        self._pause_event.set()  # Unblock any waiting threads so they can exit
        logger.info("Run %s cancelled", self.run_id)

    def check_and_wait(self, poll_interval: float = 0.5) -> bool:
        """
        Blocks while paused. If cancelled, raises RunCancelledException or returns False.
        Returns True if execution may proceed.
        """
        while not self._pause_event.is_set():
            if self._cancel_event.is_set():
                raise RunCancelledException(f"Run {self.run_id} was cancelled while paused")
            time.sleep(poll_interval)

        if self._cancel_event.is_set():
            raise RunCancelledException(f"Run {self.run_id} was cancelled")

        return True


class RunControlManager:
    """
    Manages active pipeline runs, background execution threads, and run controls.
    """

    def __init__(self, state_manager: Optional[RunStateManager] = None, event_manager: Optional[EventManager] = None):
        self.state_manager = state_manager or RunStateManager()
        self.event_manager = event_manager or EventManager()
        self._controls: Dict[str, RunControl] = {}
        self._threads: Dict[str, threading.Thread] = {}
        self._lock = threading.Lock()

    def get_or_create_control(self, run_id: str) -> RunControl:
        """Returns or creates a RunControl object for the given run ID."""
        with self._lock:
            if run_id not in self._controls:
                self._controls[run_id] = RunControl(run_id)
            return self._controls[run_id]

    def is_run_active(self, run_id: str) -> bool:
        """Checks if a run has an active execution thread."""
        with self._lock:
            t = self._threads.get(run_id)
            return t is not None and t.is_alive()

    def pause_run(self, run_id: str) -> PipelineRunState:
        """Pauses an active run and persists status update."""
        ctrl = self.get_or_create_control(run_id)
        ctrl.pause()

        run_state = self.state_manager.load_run_state(run_id)
        run_state.status = "paused"
        self.state_manager.save_run_state(run_state)

        self.event_manager.emit(
            run_id=run_id,
            status="paused",
            message=f"Pipeline run {run_id} paused by user",
            level="warning",
        )
        return run_state

    def resume_run(self, run_id: str, orchestrator_factory: Optional[Callable[[], Any]] = None) -> PipelineRunState:
        """
        Resumes a paused or stopped run. If the worker thread has exited, resumes pipeline execution in a new thread.
        """
        ctrl = self.get_or_create_control(run_id)
        run_state = self.state_manager.load_run_state(run_id)

        ctrl.resume()

        if not self.is_run_active(run_id) and orchestrator_factory is not None:
            # Re-launch pipeline execution in resume mode
            config = run_state.config.model_copy()
            config.resume_run_id = run_id
            self.start_run_async(config, orchestrator_factory)
        else:
            run_state.status = "running"
            self.state_manager.save_run_state(run_state)

        self.event_manager.emit(
            run_id=run_id,
            status="resumed",
            message=f"Pipeline run {run_id} resumed",
            level="info",
        )
        return run_state

    def cancel_run(self, run_id: str) -> PipelineRunState:
        """Cancels an active run."""
        ctrl = self.get_or_create_control(run_id)
        ctrl.cancel()

        run_state = self.state_manager.load_run_state(run_id)
        run_state.status = "cancelled"
        self.state_manager.save_run_state(run_state)

        self.event_manager.emit(
            run_id=run_id,
            status="cancelled",
            message=f"Pipeline run {run_id} cancelled by user",
            level="warning",
        )
        return run_state

    def retry_run(
        self,
        run_id: str,
        stage_name: Optional[str] = None,
        business_id: Optional[str] = None,
        orchestrator_factory: Optional[Callable[[], Any]] = None,
    ) -> PipelineRunState:
        """
        Resets failed stages to 'pending' and resumes execution in a background thread.
        """
        reset_count = self.state_manager.reset_failed_stages(
            run_id=run_id,
            stage_name=stage_name,
            business_id=business_id,
        )

        run_state = self.state_manager.load_run_state(run_id)
        run_state.status = "running"
        self.state_manager.save_run_state(run_state)

        self.event_manager.emit(
            run_id=run_id,
            status="retrying",
            business_id=business_id,
            stage=stage_name,
            message=f"Reset {reset_count} failed stages for retry in run {run_id}",
            metadata={"reset_count": reset_count, "stage": stage_name, "business_id": business_id},
            level="info",
        )

        if orchestrator_factory is not None and not self.is_run_active(run_id):
            config = run_state.config.model_copy()
            config.resume_run_id = run_id
            self.start_run_async(config, orchestrator_factory)

        return run_state

    def start_run_async(
        self,
        config: PipelineRunConfig,
        orchestrator_factory: Callable[[], Any],
        run_id: Optional[str] = None,
    ) -> PipelineRunState:
        """
        Initializes a run and spawns its execution in a background daemon thread.
        """
        if config.resume_run_id:
            active_run_id = config.resume_run_id
            run_state = self.state_manager.load_run_state(active_run_id)
            run_state.status = "running"
            self.state_manager.save_run_state(run_state)
        else:
            run_state = self.state_manager.initialize_run(config, run_id=run_id)
            active_run_id = run_state.run_id

        ctrl = self.get_or_create_control(active_run_id)
        # Ensure fresh control state
        ctrl.resume()

        def _worker():
            try:
                orchestrator = orchestrator_factory()
                orchestrator.run(config, run_control=ctrl)
            except Exception as e:
                logger.error("Background run %s failed: %s", active_run_id, e, exc_info=True)

        thread = threading.Thread(target=_worker, name=f"run-{active_run_id}", daemon=True)
        with self._lock:
            self._threads[active_run_id] = thread
        thread.start()

        return run_state
