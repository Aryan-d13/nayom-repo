import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

EventLevel = Literal["info", "warning", "error", "success"]


class PipelineEvent(BaseModel):
    """
    Structured execution event emitted during pipeline or stage lifecycle.
    Persisted append-only to `data/runs/<run-id>/events.jsonl`.
    """
    event_id: str = Field(default_factory=lambda: f"evt_{uuid.uuid4().hex[:12]}", description="Unique event identifier")
    run_id: str = Field(..., description="Parent run ID")
    business_id: Optional[str] = Field(default=None, description="Associated business ID if business-scoped")
    business_name: Optional[str] = Field(default=None, description="Associated business name for readable display")
    stage: Optional[str] = Field(default=None, description="Pipeline stage identifier if stage-scoped")
    status: str = Field(..., description="Status keyword ('started', 'running', 'completed', 'failed', 'skipped', 'retrying', 'paused', 'resumed', 'cancelled')")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="ISO timestamp")
    duration_ms: Optional[float] = Field(default=None, description="Execution duration in milliseconds if applicable")
    message: str = Field(..., description="Human-readable event summary")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary stage output or debug metadata")
    level: EventLevel = Field(default="info", description="Severity level ('info', 'warning', 'error', 'success')")
