from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pathlib import Path
from pydantic import BaseModel, Field

# Re-export TemplateMetadata, TemplateValidationResult, TemplateRegistryIndex for backward compatibility
from contracts.template import (
    TemplateMetadata,
    TemplateValidationResult,
    TemplateRegistryIndex,
)


class WebsiteGenerationRequest(BaseModel):
    """Input request specification for the Website Generator module."""
    site_id: Optional[str] = Field(None, description="Target site/business identifier slug")
    intelligence_path: Optional[str] = Field(None, description="Path to website_intelligence.json")
    website_json_path: Optional[str] = Field(None, description="Path to raw website.json if available")
    template_id: Optional[str] = Field(None, description="Optional manual override for template ID")
    output_dir: Optional[str] = Field(None, description="Destination directory for generated Next.js project")
    overwrite: bool = Field(default=True, description="Whether to overwrite existing generated folder")


class WebsiteGenerationResult(BaseModel):
    """Output result contract returned after website generation."""
    business_id: str = Field(..., description="Generated business ID matching target site")
    site_id: str = Field(..., description="Site identifier slug")
    output_dir: str = Field(..., description="Path to generated Next.js project root")
    template_id: str = Field(..., description="ID of the template selected and assembled")
    template_name: str = Field(..., description="Name of the template")
    site_data_path: str = Field(..., description="Path to populated site-data.json")
    manifest_path: str = Field(..., description="Path to generator-manifest.json")
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_success: bool = Field(default=True, description="Whether generation succeeded")
    slots_populated: int = Field(default=0, description="Count of top-level slots populated in site-data.json")
    warnings: List[str] = Field(default_factory=list, description="Non-fatal warnings recorded during generation")
