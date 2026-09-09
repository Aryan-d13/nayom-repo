import os
import json
import time
import asyncio
import logging
import threading
from pathlib import Path
from typing import Optional, List, Dict, Any, AsyncGenerator, Callable

from config.settings import RUNS_DIR
from contracts.events import PipelineEvent, EventLevel

logger = logging.getLogger(__name__)


class EventManager:
    """
    Append-only, durable structured event manager.
    
    Source of truth: `data/runs/<run_id>/events.jsonl`.
    Replayable from disk at any time, supporting live file-tailing SSE streams.
    """

    def __init__(self, runs_root: Optional[Path] = None):
        self.runs_root = Path(runs_root) if runs_root else RUNS_DIR
        self._locks: Dict[str, threading.RLock] = {}
        self._global_lock = threading.RLock()

    def _get_run_lock(self, run_id: str) -> threading.RLock:
        """Returns a thread lock specific to a given run ID."""
        with self._global_lock:
            if run_id not in self._locks:
                self._locks[run_id] = threading.RLock()
            return self._locks[run_id]

    def get_events_file(self, run_id: str) -> Path:
        """Returns the absolute path to events.jsonl for a given run."""
        run_dir = self.runs_root / run_id
        run_dir.mkdir(parents=True, exist_ok=True)
        return run_dir / "events.jsonl"

    def emit(
        self,
        run_id: str,
        status: str,
        message: str,
        business_id: Optional[str] = None,
        business_name: Optional[str] = None,
        stage: Optional[str] = None,
        duration_ms: Optional[float] = None,
        metadata: Optional[Dict[str, Any]] = None,
        level: EventLevel = "info",
    ) -> PipelineEvent:
        """
        Creates and appends a structured PipelineEvent to data/runs/<run_id>/events.jsonl.
        """
        event = PipelineEvent(
            run_id=run_id,
            business_id=business_id,
            business_name=business_name,
            stage=stage,
            status=status,
            duration_ms=duration_ms,
            message=message,
            metadata=metadata or {},
            level=level,
        )

        events_file = self.get_events_file(run_id)
        lock = self._get_run_lock(run_id)

        line = event.model_dump_json() + "\n"
        with lock:
            with open(events_file, "a", encoding="utf-8") as f:
                f.write(line)
                f.flush()

        logger.debug("Emitted event [%s] for run %s: %s", status, run_id, message)
        return event

    def get_events(
        self,
        run_id: str,
        since_timestamp: Optional[str] = None,
        business_id: Optional[str] = None,
        stage: Optional[str] = None,
        level: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> List[PipelineEvent]:
        """
        Replays and returns structured events directly from disk (events.jsonl).
        """
        events_file = self.get_events_file(run_id)
        if not events_file.exists():
            return []

        results: List[PipelineEvent] = []
        lock = self._get_run_lock(run_id)

        with lock:
            with open(events_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        evt = PipelineEvent.model_validate(data)

                        if since_timestamp and evt.timestamp <= since_timestamp:
                            continue
                        if business_id and evt.business_id != business_id:
                            continue
                        if stage and evt.stage != stage:
                            continue
                        if level and evt.level != level:
                            continue

                        results.append(evt)
                    except Exception as e:
                        logger.warning("Corrupted event line in %s: %s", events_file, e)

        if limit and limit > 0:
            return results[-limit:]
        return results

    async def stream_events(
        self,
        run_id: str,
        since_timestamp: Optional[str] = None,
        business_id: Optional[str] = None,
        poll_interval: float = 0.25,
        timeout_seconds: Optional[float] = None,
        is_active_check: Optional[Callable[[], bool]] = None,
    ) -> AsyncGenerator[PipelineEvent, None]:
        """
        Async generator for SSE:
        1. Reads and yields all historical events from `events.jsonl` matching filters.
        2. Tails `events.jsonl` for new appended lines until run ends or connection closes.
        """
        events_file = self.get_events_file(run_id)
        last_pos = 0
        start_time = time.monotonic()

        # Replay phase & tailing loop
        while True:
            if timeout_seconds and (time.monotonic() - start_time) > timeout_seconds:
                break

            if events_file.exists():
                lock = self._get_run_lock(run_id)
                new_lines = []
                with lock:
                    file_size = events_file.stat().st_size
                    if file_size > last_pos:
                        with open(events_file, "r", encoding="utf-8") as f:
                            f.seek(last_pos)
                            for line in f:
                                line = line.strip()
                                if line:
                                    new_lines.append(line)
                            last_pos = f.tell()

                for line in new_lines:
                    try:
                        data = json.loads(line)
                        evt = PipelineEvent.model_validate(data)

                        if since_timestamp and evt.timestamp <= since_timestamp:
                            continue
                        if business_id and evt.business_id != business_id:
                            continue

                        yield evt
                    except Exception as e:
                        logger.warning("Error parsing streamed event: %s", e)

            # Check if execution finished
            if is_active_check is not None and not is_active_check():
                # Read any final remaining lines once more before stopping
                await asyncio.sleep(poll_interval)
                if events_file.exists():
                    lock = self._get_run_lock(run_id)
                    final_lines = []
                    with lock:
                        if events_file.stat().st_size > last_pos:
                            with open(events_file, "r", encoding="utf-8") as f:
                                f.seek(last_pos)
                                for line in f:
                                    line = line.strip()
                                    if line:
                                        final_lines.append(line)
                                last_pos = f.tell()
                    for line in final_lines:
                        try:
                            data = json.loads(line)
                            evt = PipelineEvent.model_validate(data)
                            if since_timestamp and evt.timestamp <= since_timestamp:
                                continue
                            if business_id and evt.business_id != business_id:
                                continue
                            yield evt
                        except Exception:
                            pass
                break

            await asyncio.sleep(poll_interval)
