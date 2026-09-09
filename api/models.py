from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from contracts.orchestrator import StageExecution, BusinessRunState, PipelineRunState, PipelineSummary
from contracts.events import PipelineEvent


class CreateRunRequest(BaseModel):
    """Payload to initiate a new end-to-end pipeline run."""
    query: str = Field(..., description="Target search query (e.g. 'dentists in Austin Texas')")
    limit: int = Field(default=20, ge=1, le=500, description="Max businesses to discover & process")
    concurrency: int = Field(default=5, ge=1, le=50, description="Worker concurrency limit")
    dry_run: bool = Field(default=False, description="Simulate email sending without network transmission")
    ai_provider: Optional[str] = Field(default=None, description="AI provider override ('gemini', 'mock')")
    email_provider: Optional[str] = Field(default=None, description="Email sender provider override ('gmail', 'resend', 'mock', etc.)")
    deploy_provider: Optional[str] = Field(default=None, description="Deployment hosting provider override ('vercel', 'cloudflare', 'mock', etc.)")
    template_override: Optional[str] = Field(default=None, description="Website template override")
    max_retries: int = Field(default=2, ge=0, le=10, description="Max transient failure retries")
    delay_seconds: float = Field(default=0.0, ge=0.0, description="Delay between processing successive businesses")
    fast_mode: bool = Field(default=True, description="Scraper fast mode flag")
    render_js: bool = Field(default=False, description="Website collector JS rendering flag")
    screenshot: bool = Field(default=False, description="Website collector screenshot capture flag")


class RetryRunRequest(BaseModel):
    """Payload to retry failed stages or businesses in a run."""
    stage: Optional[str] = Field(default=None, description="Optional specific stage name to retry (e.g. 'deployment')")
    business_id: Optional[str] = Field(default=None, description="Optional specific business ID to retry")


class RunDetailResponse(BaseModel):
    """Detailed response for a single run including businesses list."""
    run: PipelineRunState
    businesses: List[BusinessRunState]
    is_active: bool = Field(default=False, description="Whether background worker thread is currently active")


class BusinessDetailResponse(BaseModel):
    """Comprehensive business inspection record aggregating all pipeline artifacts."""
    business_id: str
    business_name: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    status: str
    current_stage: Optional[str] = None
    stages: Dict[str, StageExecution] = Field(default_factory=dict)
    business_data: Optional[Dict[str, Any]] = None
    website_data: Optional[Dict[str, Any]] = None
    intelligence: Optional[Dict[str, Any]] = None
    generated_manifest: Optional[Dict[str, Any]] = None
    site_data: Optional[Dict[str, Any]] = None
    deployment: Optional[Dict[str, Any]] = None
    email_draft: Optional[Dict[str, Any]] = None
    email_delivery: Optional[Dict[str, Any]] = None
    events: List[PipelineEvent] = Field(default_factory=list)


class GlobalStatsResponse(BaseModel):
    """Aggregated operational metrics across all runs."""
    total_runs: int = 0
    active_runs: int = 0
    total_businesses: int = 0
    total_websites_crawled: int = 0
    total_sites_generated: int = 0
    total_sites_deployed: int = 0
    total_emails_sent: int = 0
    total_succeeded: int = 0
    total_failed: int = 0
    success_rate: float = 0.0
