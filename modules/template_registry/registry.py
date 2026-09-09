import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime, timezone

from config.settings import TEMPLATES_DIR
from contracts.template import (
    TemplateMetadata,
    TemplateValidationResult,
    TemplateRegistryIndex,
)
from .validator import TemplateValidator

logger = logging.getLogger(__name__)


class TemplateRegistry:
    """
    Scalable Template Registry for Nayom-Automation.
    
    Principles:
    1. Template directories and their metadata.json files are the SINGLE SOURCE OF TRUTH.
    2. templates/registry.json is a fast, rebuildable cache index.
    3. Adding new templates requires zero generator-code changes.
    4. Discovers templates recursively across any depth in the templates/ directory.
    5. Supports multi-criteria filtering by industry, category, style, layout, and features.
    """

    def __init__(
        self,
        templates_dir: Optional[Union[str, Path]] = None,
        auto_load: bool = True,
        validator: Optional[TemplateValidator] = None,
    ):
        self._templates_dir = Path(templates_dir).resolve() if templates_dir else TEMPLATES_DIR.resolve()
        self._registry_file = self._templates_dir / "registry.json"
        self._validator = validator or TemplateValidator()
        self._catalog: Dict[str, TemplateMetadata] = {}
        self._validation_reports: Dict[str, TemplateValidationResult] = {}
        
        if auto_load:
            self.load_or_rebuild()

    @property
    def templates_dir(self) -> Path:
        """Root templates directory."""
        return self._templates_dir

    @property
    def registry_file(self) -> Path:
        """Path to cached registry.json."""
        return self._registry_file

    @property
    def all_templates(self) -> List[TemplateMetadata]:
        """Returns all discovered templates (valid and invalid/stub)."""
        return list(self._catalog.values())

    @property
    def valid_templates(self) -> List[TemplateMetadata]:
        """Returns only templates passing contract validation."""
        return [t for t in self._catalog.values() if t.is_valid]

    @property
    def runnable_templates(self) -> List[TemplateMetadata]:
        """Returns templates that are runnable (have Next.js app structure and package.json)."""
        return [t for t in self._catalog.values() if t.is_runnable]

    def _find_template_directories(self) -> List[Path]:
        """
        Recursively discovers all directories containing a metadata.json file.
        Skips build artifacts, node_modules, and hidden folders.
        """
        if not self._templates_dir.exists():
            logger.warning("Templates directory does not exist: %s", self._templates_dir)
            return []

        discovered: List[Path] = []
        ignored_names = {
            "node_modules",
            ".next",
            "dist",
            ".git",
            "__pycache__",
            ".turbo",
            ".vercel",
            "components",
            "lib",
            "app",
            "pages",
            "preview",
            "assets",
            "public",
        }

        for root_str, dirs, files in os.walk(self._templates_dir):
            root_path = Path(root_str)
            # Filter out ignored directories from traversal
            dirs[:] = [d for d in dirs if d not in ignored_names and not d.startswith(".")]

            if "metadata.json" in files:
                # Found a template directory
                discovered.append(root_path)

        return sorted(discovered, key=lambda p: str(p))

    def discover_and_rebuild(self) -> TemplateRegistryIndex:
        """
        Scans filesystem templates directory (the single source of truth),
        validates all templates, populates the catalog, and updates registry.json.
        """
        logger.info("Scanning template library at: %s", self._templates_dir)
        template_dirs = self._find_template_directories()

        self._catalog.clear()
        self._validation_reports.clear()

        # Validate all discovered directories
        validation_results = self._validator.validate_all(template_dirs)

        for report in validation_results:
            self._validation_reports[report.template_id] = report
            if report.metadata:
                self._catalog[report.template_id] = report.metadata
            else:
                # Create minimal fallback metadata for broken template so it's visible in index
                fallback_meta = TemplateMetadata(
                    id=report.template_id,
                    name=report.template_id.replace("-", " ").title(),
                    template_dir=report.template_dir,
                    is_valid=False,
                    is_runnable=False,
                    validation_errors=report.errors,
                    validation_warnings=report.warnings,
                )
                self._catalog[report.template_id] = fallback_meta

        # Create registry index snapshot
        index = TemplateRegistryIndex(
            generated_at=datetime.now(timezone.utc).isoformat(),
            total_templates=len(self._catalog),
            valid_templates=len(self.valid_templates),
            runnable_templates=len(self.runnable_templates),
            templates={k: v for k, v in self._catalog.items()},
        )

        # Atomically write registry.json cache
        self._save_registry_cache(index)

        logger.info(
            "Template Registry rebuilt: %d templates discovered (%d valid, %d runnable)",
            index.total_templates,
            index.valid_templates,
            index.runnable_templates,
        )
        return index

    def _save_registry_cache(self, index: TemplateRegistryIndex) -> None:
        """Atomically writes registry.json cache file to templates directory."""
        try:
            self._templates_dir.mkdir(parents=True, exist_ok=True)
            temp_file = self._templates_dir / "registry.json.tmp"
            
            # Serialize model
            payload = index.model_dump(mode="json")
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)
            
            temp_file.replace(self._registry_file)
            logger.debug("Saved registry cache to %s", self._registry_file)
        except Exception as e:
            logger.warning("Could not persist registry.json cache: %s", e)

    def load_or_rebuild(self) -> None:
        """
        Loads the template registry. If registry.json is missing, corrupted,
        or any template directories have been modified, it automatically rebuilds
        from the filesystem source of truth.
        """
        # Always verify filesystem directly or rebuild if registry file missing
        if not self._registry_file.exists():
            self.discover_and_rebuild()
            return

        try:
            with open(self._registry_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            index = TemplateRegistryIndex.model_validate(data)
            self._catalog = index.templates

            # Quick sanity check: verify that cached template paths actually exist on disk
            missing_paths = False
            for meta in self._catalog.values():
                if meta.template_dir and not Path(meta.template_dir).exists():
                    missing_paths = True
                    break

            if missing_paths or not self._catalog:
                logger.info("Cached registry.json has stale paths. Rebuilding from filesystem...")
                self.discover_and_rebuild()

        except Exception as e:
            logger.warning("Error reading registry.json (%s). Rebuilding from filesystem...", e)
            self.discover_and_rebuild()

    def get_template(self, template_id: str) -> Optional[TemplateMetadata]:
        """
        Retrieves template metadata by exact ID, folder name, or case-insensitive match.
        """
        if not template_id:
            return None
        
        target = template_id.strip()
        # Direct key lookup
        if target in self._catalog:
            return self._catalog[target]

        target_lower = target.lower()
        # Case-insensitive / normalized lookup
        for t_id, meta in self._catalog.items():
            if t_id.lower() == target_lower:
                return meta
            if meta.name.lower() == target_lower:
                return meta
            if Path(meta.template_dir or "").name.lower() == target_lower:
                return meta

        # Normalized hyphens/underscores match
        norm_target = target_lower.replace("_", "-")
        for t_id, meta in self._catalog.items():
            if t_id.lower().replace("_", "-") == norm_target:
                return meta

        return None

    def search(
        self,
        query: Optional[str] = None,
        industry: Optional[str] = None,
        category: Optional[str] = None,
        style: Optional[str] = None,
        layout: Optional[str] = None,
        features: Optional[List[str]] = None,
        only_runnable: bool = False,
        only_valid: bool = False,
    ) -> List[TemplateMetadata]:
        """
        Multi-criteria template search and filtering.
        """
        results = list(self._catalog.values())

        if only_valid:
            results = [t for t in results if t.is_valid]
        if only_runnable:
            results = [t for t in results if t.is_runnable]

        if query:
            q_terms = [term.lower().strip() for term in query.split() if term.strip()]
            filtered = []
            for t in results:
                tags = t.all_search_tags
                all_text = f"{t.id} {t.name} {t.description}".lower()
                if any(term in all_text or any(term in tag for tag in tags) for term in q_terms):
                    filtered.append(t)
            results = filtered

        if industry:
            ind_lower = industry.lower().strip()
            results = [
                t for t in results
                if any(ind_lower in i.lower() or i.lower() in ind_lower for i in t.industries)
                or any(ind_lower in c.lower() for c in t.categories)
            ]

        if category:
            cat_lower = category.lower().strip()
            results = [
                t for t in results
                if any(cat_lower in c.lower() or c.lower() in cat_lower for c in t.categories)
                or any(cat_lower in i.lower() for i in t.industries)
            ]

        if style:
            style_lower = style.lower().strip()
            results = [
                t for t in results
                if any(style_lower in s.lower() or s.lower() in style_lower for s in t.style_keywords)
                or any(style_lower in v.lower() for v in t.supported_variants)
            ]

        if layout:
            layout_lower = layout.lower().strip()
            results = [
                t for t in results
                if any(layout_lower in l.lower() or l.lower() in layout_lower for l in t.layout_patterns)
            ]

        if features:
            req_features = [f.lower().strip() for f in features if f.strip()]
            filtered = []
            for t in results:
                t_features = [f.lower() for f in t.supported_features]
                if all(any(rf in tf for tf in t_features) for rf in req_features):
                    filtered.append(t)
            results = filtered

        return results

    def get_validation_report(self, template_id: str) -> Optional[TemplateValidationResult]:
        """Returns detailed validation report for a specific template."""
        return self._validation_reports.get(template_id)

    def validate_all(self) -> List[TemplateValidationResult]:
        """Runs validation on all templates and returns report list."""
        template_dirs = self._find_template_directories()
        reports = self._validator.validate_all(template_dirs)
        for r in reports:
            self._validation_reports[r.template_id] = r
        return reports
