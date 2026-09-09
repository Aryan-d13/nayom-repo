from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pathlib import Path
from pydantic import BaseModel, Field


class ProviderStatus(BaseModel):
    """Status indicating whether a deployment provider is configured and available."""
    provider_name: str = Field(..., description="Provider identifier (e.g. 'vercel', 'cloudflare', 'netlify')")
    is_configured: bool = Field(..., description="Whether required credentials or CLI tools are present")
    missing_credentials: List[str] = Field(default_factory=list, description="List of missing environment variable names")
    description: str = Field(default="", description="Human-readable description of configuration state")


class DeploymentRequest(BaseModel):
    """Input request specification for deploying a generated website."""
    business_id: str = Field(..., description="Business / site identifier matching generated/<business-id>")
    site_dir: str = Field(..., description="Absolute or relative path to the generated Next.js project directory")
    provider: Optional[str] = Field(None, description="Optional manual override for deployment provider")
    custom_domain: Optional[str] = Field(None, description="Optional custom domain or alias to assign")
    production: bool = Field(default=True, description="Whether to deploy to production or preview environment")
    allow_mock_fallback: bool = Field(default=False, description="Whether to allow falling back to Mock provider if live cloud providers fail")


class DeploymentResult(BaseModel):
    """Result contract returned after a deployment attempt."""
    business_id: str = Field(..., description="Business / site identifier matching the project")
    provider: str = Field(..., description="Provider that performed the deployment (e.g. 'vercel', 'netlify', 'mock')")
    deployment_id: str = Field(default="", description="Unique deployment identifier from the provider")
    url: str = Field(..., description="Live accessible website URL returned by the hosting provider")
    status: str = Field(default="success", description="Deployment status ('success', 'failed', 'skipped', 'pending')")
    deployed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    duration_seconds: float = Field(default=0.0, description="Processing duration in seconds")
    warnings: List[str] = Field(default_factory=list, description="Non-fatal warnings recorded during deployment")
    error: Optional[str] = Field(None, description="Error message if deployment failed")
