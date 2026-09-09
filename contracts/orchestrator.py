from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field
from contracts.business import Business

StageStatus = Literal["pending", "running", "completed", "failed", "skipped", "paused", "cancelled"]

PIPELINE_STAGES = [
    "website_collector",
    "website_intelligence",
    "website_generator",
    "deployment",
    "email_generator",
    "email_sender",
]


class StageExecution(BaseModel):
    """Execution record for a single stage within a business pipeline."""
    stage_name: str = Field(..., description="Stage identifier (e.g. 'website_collector')")
    status: StageStatus = Field(default="pending", description="Current status of this stage")
    started_at: Optional[str] = Field(default=None, description="ISO timestamp when stage began execution")
    completed_at: Optional[str] = Field(default=None, description="ISO timestamp when stage finished")
    duration_seconds: float = Field(default=0.0, description="Duration of stage execution in seconds")
    output_ref: Optional[str] = Field(default=None, description="Path or reference to stage output artifact")
    error: Optional[str] = Field(default=None, description="Error message if stage execution failed")
    warnings: List[str] = Field(default_factory=list, description="Non-fatal warning messages")
    retry_count: int = Field(default=0, description="Number of retry attempts executed for transient failures")


class BusinessRunState(BaseModel):
    """
    Persistent run state and stage tracking for an individual business.
    Saved to `data/runs/<run-id>/businesses/<business-id>.json`.
    """
    business_id: str = Field(..., description="Unique business identifier slug")
    business_name: str = Field(..., description="Display name of the business")
    website: Optional[str] = Field(default=None, description="Website URL if available")
    email: Optional[str] = Field(default=None, description="Direct email if available")
    phone: Optional[str] = Field(default=None, description="Phone number if available")
    status: StageStatus = Field(default="pending", description="Overall business processing status")
    stages: Dict[str, StageExecution] = Field(default_factory=dict, description="Stage-by-stage execution records")
    current_stage: Optional[str] = Field(default=None, description="Currently executing stage name")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    error: Optional[str] = Field(default=None, description="Business-level fatal error message if any")
    business_data: Optional[Dict[str, Any]] = Field(default=None, description="Raw or normalized Business contract dump")

    def get_stage(self, stage_name: str) -> StageExecution:
        """Retrieves or creates a default StageExecution for the given stage name."""
        if stage_name not in self.stages:
            self.stages[stage_name] = StageExecution(stage_name=stage_name, status="pending")
        return self.stages[stage_name]

    def is_stage_completed(self, stage_name: str) -> bool:
        """Checks if a stage was already successfully completed."""
        return stage_name in self.stages and self.stages[stage_name].status == "completed"


class PipelineRunConfig(BaseModel):
    """Configuration parameters for an end-to-end pipeline run."""
    query: str = Field(..., description="Search query for Google Maps discovery or seed target")
    limit: int = Field(default=20, description="Max number of businesses to process")
    concurrency: int = Field(default=5, ge=1, le=50, description="Number of businesses to process concurrently")
    dry_run: bool = Field(default=False, description="Simulate email sending without real network transmission")
    resume_run_id: Optional[str] = Field(default=None, description="Run ID to resume if specified")
    ai_provider: Optional[str] = Field(default=None, description="AI provider override ('gemini', 'mock')")
    email_provider: Optional[str] = Field(default=None, description="Email sender provider override ('gmail', 'resend', 'mock', etc.)")
    deploy_provider: Optional[str] = Field(default=None, description="Deployment provider override ('vercel', 'cloudflare', 'mock', etc.)")
    template_override: Optional[str] = Field(default=None, description="Website template override")
    max_retries: int = Field(default=2, description="Max retry attempts for transient stage failures")
    delay_seconds: float = Field(default=0.0, description="Pause between processing successive businesses")
    fast_mode: bool = Field(default=True, description="Scraper fast mode flag")
    render_js: bool = Field(default=False, description="Website collector JS rendering flag")
    screenshot: bool = Field(default=False, description="Website collector screenshot capture flag")


class PipelineSummary(BaseModel):
    """Summary statistics aggregated across all businesses in the run."""
    # Explicit operational metrics
    requested: int = Field(default=0, description="Target number of businesses requested by caller")
    attempted: int = Field(default=0, description="Total discovery/grid attempts performed")
    found: int = Field(default=0, description="Raw businesses discovered across search")
    usable: int = Field(default=0, description="Businesses discovered that meet usability criteria")
    processed: int = Field(default=0, description="Businesses actually processed through pipeline stages")
    succeeded: int = Field(default=0, description="Businesses completing all required stages successfully")
    failed: int = Field(default=0, description="Total businesses or stages that failed")
    skipped: int = Field(default=0, description="Total businesses or stages that were skipped")

    # Stage-by-stage counts
    businesses_found: int = Field(default=0, description="Total businesses discovered by scraper")
    websites_collected: int = Field(default=0, description="Total websites successfully crawled")
    intelligence_completed: int = Field(default=0, description="Total AI intelligence analyses completed")
    sites_generated: int = Field(default=0, description="Total Next.js website projects generated")
    sites_deployed: int = Field(default=0, description="Total websites successfully deployed")
    emails_generated: int = Field(default=0, description="Total outreach emails generated")
    emails_sent: int = Field(default=0, description="Total outreach emails dispatched or simulated (sent/dry_run)")


class PipelineRunState(BaseModel):
    """
    Top-level orchestrator run record.
    Saved to `data/runs/<run-id>/run.json`.
    """
    run_id: str = Field(..., description="Unique run identifier (e.g. 'run_20260822_173000_dentists_austin')")
    query: str = Field(..., description="Search query or pipeline target")
    status: StageStatus = Field(default="pending", description="Overall pipeline status ('pending', 'running', 'completed', 'failed')")
    config: PipelineRunConfig = Field(..., description="Run configuration options")
    started_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    completed_at: Optional[str] = Field(default=None, description="ISO timestamp when run finished")
    duration_seconds: float = Field(default=0.0, description="Total run duration in seconds")
    total_businesses: int = Field(default=0, description="Number of businesses included in this run")
    business_ids: List[str] = Field(default_factory=list, description="Ordered list of business IDs in this run")
    summary: PipelineSummary = Field(default_factory=PipelineSummary, description="Aggregated run summary")
    errors: List[str] = Field(default_factory=list, description="Run-level error messages")
    warnings: List[str] = Field(default_factory=list, description="Run-level warning messages")
