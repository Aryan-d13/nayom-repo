from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Union
from pathlib import Path
from pydantic import BaseModel, Field, model_validator


class TemplateMetadata(BaseModel):
    """
    Standardized metadata contract for Next.js website templates.
    All template metadata is loaded directly from metadata.json in template directories.
    """
    id: str = Field(..., description="Unique template identifier (e.g. 'dark-portfolio', 'generic-modern')")
    name: str = Field(..., description="Human-readable template name")
    version: str = Field(default="1.0.0", description="Template semantic or major version")
    description: str = Field(default="", description="Detailed description of template aesthetic and purpose")
    
    # Discovery & Matching Categories
    categories: List[str] = Field(default_factory=list, description="Primary business categories and archetypes")
    industries: List[str] = Field(default_factory=list, description="Target industry verticals (e.g. 'dental', 'saas', 'law')")
    style_keywords: List[str] = Field(default_factory=list, description="Visual design tags (e.g. 'dark-tech', 'minimalist', 'swiss', 'glassmorphism')")
    layout_patterns: List[str] = Field(default_factory=list, description="Layout architectures (e.g. 'bento_grid', 'single_page_anchor_flow', 'multi_page_funnel')")
    
    # Features & Slot Support
    supported_features: List[str] = Field(default_factory=list, description="Feature tags supported (e.g. ['projects', 'booking', 'testimonials', 'tech_stack'])")
    supported_slots: List[str] = Field(default_factory=list, description="List of slot keys defined in slots.json")
    
    # Assets & Technical Entrypoint
    preview_image: Optional[str] = Field(default=None, description="Relative path to preview screenshot/image (e.g. 'preview/thumbnail.png')")
    entrypoint: str = Field(default="app/page.tsx", description="Next.js page entrypoint relative to template root")
    template_dir: Optional[str] = Field(default=None, description="Absolute or relative path to template root directory on disk")

    # Validation and Health Status
    is_valid: bool = Field(default=True, description="Whether template passes contract validation checks")
    is_runnable: bool = Field(default=True, description="Whether template has runnable Next.js code and build files")
    validation_errors: List[str] = Field(default_factory=list, description="List of validation errors if invalid")
    validation_warnings: List[str] = Field(default_factory=list, description="List of non-fatal validation warnings")

    # Backward-compatibility and theme fields
    industry: Optional[str] = Field(default=None, description="Legacy single industry field")
    supported_industries: List[str] = Field(default_factory=list, description="Legacy supportedIndustries field")
    capabilities: Dict[str, Any] = Field(default_factory=dict, description="Legacy capability boolean map")
    default_theme: Optional[Dict[str, Any]] = Field(default=None, description="Default color palette, typography and token definitions")
    supported_variants: List[str] = Field(default_factory=list, description="Supported visual theme variants")
    available_sections: List[str] = Field(default_factory=list, description="Available UI component sections")

    @model_validator(mode="before")
    @classmethod
    def harmonize_fields(cls, data: Any) -> Any:
        """Harmonizes camelCase and legacy field formats with standard contract."""
        if not isinstance(data, dict):
            return data
        
        # Support camelCase aliases from raw metadata.json
        if "supportedIndustries" in data and not data.get("industries"):
            data["industries"] = list(data["supportedIndustries"])
        if "styleKeywords" in data and not data.get("style_keywords"):
            data["style_keywords"] = list(data["styleKeywords"])
        if "layoutPatterns" in data and not data.get("layout_patterns"):
            data["layout_patterns"] = list(data["layoutPatterns"])
        if "supportedFeatures" in data and not data.get("supported_features"):
            data["supported_features"] = list(data["supportedFeatures"])
        if "supportedSlots" in data and not data.get("supported_slots"):
            data["supported_slots"] = list(data["supportedSlots"])
        if "previewImage" in data and not data.get("preview_image"):
            data["preview_image"] = data["previewImage"]
        if "defaultTheme" in data and not data.get("default_theme"):
            data["default_theme"] = data["defaultTheme"]
        if "supportedVariants" in data and not data.get("supported_variants"):
            data["supported_variants"] = list(data["supportedVariants"])
        if "availableSections" in data and not data.get("available_sections"):
            data["available_sections"] = list(data["availableSections"])

        # Consolidate industries / categories
        cats = list(data.get("categories", []))
        inds = list(data.get("industries", []))
        if data.get("industry") and data.get("industry") not in inds:
            inds.append(data.get("industry"))
        if data.get("supported_industries"):
            for item in data.get("supported_industries"):
                if item not in inds:
                    inds.append(item)
        if not cats and inds:
            cats = list(inds)
        if not inds and cats:
            inds = list(cats)
        data["categories"] = cats
        data["industries"] = inds

        # Consolidate capabilities into supported_features if empty
        if not data.get("supported_features") and data.get("capabilities"):
            caps = data.get("capabilities", {})
            if isinstance(caps, dict):
                data["supported_features"] = [k for k, v in caps.items() if v]

        return data

    @property
    def all_search_tags(self) -> List[str]:
        """Returns lowercase set of all keywords associated with this template."""
        tags = set()
        tags.add(self.id.lower())
        tags.add(self.name.lower())
        for c in self.categories:
            tags.add(c.lower())
        for ind in self.industries:
            tags.add(ind.lower())
        for s in self.style_keywords:
            tags.add(s.lower())
        for l in self.layout_patterns:
            tags.add(l.lower())
        for f in self.supported_features:
            tags.add(f.lower())
        for v in self.supported_variants:
            tags.add(v.lower())
        return sorted(list(tags))


class NayomTemplateManifest(BaseModel):
    """
    Authoritative template manifest contract from nayom.template.json.
    Defines identity, classification, layouts, features, and declared slots.
    """
    id: str = Field(..., description="Unique template identifier (e.g. 'dental-023')")
    name: str = Field(..., description="Human-readable template name")
    version: str = Field(default="1.0.0", description="Semantic version string")
    description: str = Field(default="", description="Description of template aesthetic and purpose")
    industry: Union[str, List[str]] = Field(default_factory=list, description="Target industry vertical(s)")
    categories: List[str] = Field(default_factory=list, description="Business categories")
    styles: List[str] = Field(default_factory=list, description="Visual design tags")
    layouts: List[str] = Field(default_factory=list, description="Page layout patterns")
    features: List[str] = Field(default_factory=list, description="Supported capability/feature flags")
    entrypoint: str = Field(default="app/page.tsx", description="Next.js entrypoint file relative to root")
    slots: Union[Dict[str, Any], List[str]] = Field(default_factory=dict, description="Declared slots mapping (key -> type/source)")
    preview_image: Optional[str] = Field(default="preview/thumbnail.png", description="Preview image path")

    @model_validator(mode="before")
    @classmethod
    def harmonize_manifest(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data
        
        # Support aliases
        if "style_keywords" in data and not data.get("styles"):
            data["styles"] = data["style_keywords"]
        if "layout_patterns" in data and not data.get("layouts"):
            data["layouts"] = data["layout_patterns"]
        if "supported_features" in data and not data.get("features"):
            data["features"] = data["supported_features"]
        if "supported_slots" in data and not data.get("slots"):
            data["slots"] = data["supported_slots"]
        if "previewImage" in data and not data.get("preview_image"):
            data["preview_image"] = data["previewImage"]

        # Ensure industry is list
        ind = data.get("industry")
        if isinstance(ind, str):
            data["industry"] = [ind] if ind else []
        elif ind is None:
            data["industry"] = []

        return data

    @property
    def industries_list(self) -> List[str]:
        if isinstance(self.industry, list):
            return self.industry
        return [self.industry] if self.industry else []

    @property
    def slots_dict(self) -> Dict[str, str]:
        if isinstance(self.slots, dict):
            return {k: str(v) for k, v in self.slots.items()}
        elif isinstance(self.slots, list):
            return {k: "string" for k in self.slots}
        return {}

    @property
    def slots_keys(self) -> List[str]:
        if isinstance(self.slots, dict):
            return list(self.slots.keys())
        elif isinstance(self.slots, list):
            return list(self.slots)
        return []

    def to_metadata(self, template_dir: Optional[str] = None) -> TemplateMetadata:
        return TemplateMetadata(
            id=self.id,
            name=self.name,
            version=self.version,
            description=self.description,
            categories=self.categories or self.industries_list,
            industries=self.industries_list or self.categories,
            style_keywords=self.styles,
            layout_patterns=self.layouts,
            supported_features=self.features,
            supported_slots=self.slots_keys,
            preview_image=self.preview_image,
            entrypoint=self.entrypoint,
            template_dir=template_dir,
        )


class TemplateValidationResult(BaseModel):
    """Validation report for a single template."""
    template_id: str
    template_dir: str
    is_valid: bool = True
    is_runnable: bool = True
    checks_passed: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    metadata: Optional[TemplateMetadata] = None


class TemplateRegistryIndex(BaseModel):
    """Rebuildable registry index cache schema saved to templates/registry.json."""
    version: str = Field(default="1.0.0", description="Registry schema format version")
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_templates: int = 0
    valid_templates: int = 0
    runnable_templates: int = 0
    templates: Dict[str, TemplateMetadata] = Field(default_factory=dict)


class TemplateInspectionResult(BaseModel):
    """Output report from inspecting a prospective template before import."""
    source: str
    is_valid_source: bool = True
    manifest_found: bool = False
    manifest_path: Optional[str] = None
    manifest_valid: bool = False
    manifest_errors: List[str] = Field(default_factory=list)
    manifest: Optional[NayomTemplateManifest] = None
    
    # Technical framework evaluation
    is_nextjs: bool = False
    framework_version: Optional[str] = None
    entrypoint_found: bool = False
    entrypoint_path: Optional[str] = None
    detected_components: List[str] = Field(default_factory=list)
    detected_features: List[str] = Field(default_factory=list)
    detected_issues: List[str] = Field(default_factory=list)
    
    ready_to_import: bool = False


class TemplateImportResult(BaseModel):
    """Result returned after attempting to add/import a template."""
    template_id: str
    target_dir: str
    is_success: bool = True
    manifest: Optional[NayomTemplateManifest] = None
    metadata: Optional[TemplateMetadata] = None
    validation_report: Optional[TemplateValidationResult] = None
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
