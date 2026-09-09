import os
import json
import shutil
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Union, Optional, Dict, Any, List

from config.settings import GENERATED_DIR, WEBSITES_DATA_DIR, TEMPLATES_DIR
from contracts.intelligence import WebsiteIntelligence
from contracts.website import WebsiteCollectionResult
from contracts.generator import (
    WebsiteGenerationRequest,
    WebsiteGenerationResult,
    TemplateMetadata,
)
from .template_selector import TemplateSelector
from .slot_populator import SlotPopulator

logger = logging.getLogger(__name__)


class WebsiteGenerator:
    """
    Orchestrates deterministic Next.js website generation from AI Website Intelligence.
    
    Transforms website_intelligence.json into a runnable Next.js project inside
    generated/<business-id>/ without using AI to mutate React code arbitrarily.
    """

    def __init__(
        self,
        templates_dir: Optional[Path] = None,
        output_base_dir: Optional[Path] = None,
        template_selector: Optional[TemplateSelector] = None,
        slot_populator: Optional[SlotPopulator] = None,
    ):
        self._templates_dir = Path(templates_dir) if templates_dir else TEMPLATES_DIR
        self._output_base_dir = Path(output_base_dir) if output_base_dir else GENERATED_DIR
        self._selector = template_selector or TemplateSelector(self._templates_dir)
        self._populator = slot_populator or SlotPopulator()

    def _resolve_intelligence_data(
        self,
        source: Union[str, Path, Dict[str, Any], WebsiteIntelligence, WebsiteGenerationRequest],
    ) -> tuple[WebsiteIntelligence, str, Path]:
        """Resolves target input into a validated WebsiteIntelligence model and its origin directory."""
        if isinstance(source, WebsiteGenerationRequest):
            if source.intelligence_path:
                return self._resolve_intelligence_data(source.intelligence_path)
            elif source.site_id:
                candidate = WEBSITES_DATA_DIR / source.site_id / "website_intelligence.json"
                return self._resolve_intelligence_data(candidate)
            raise ValueError("WebsiteGenerationRequest must specify intelligence_path or site_id")

        if isinstance(source, WebsiteIntelligence):
            source_path = source.source_website_json or "in-memory"
            origin_dir = WEBSITES_DATA_DIR / source.site_id
            return source, source_path, origin_dir

        if isinstance(source, dict):
            intel = WebsiteIntelligence.model_validate(source)
            origin_dir = WEBSITES_DATA_DIR / intel.site_id
            return intel, "in-memory-dict", origin_dir

        path = Path(source)
        if path.is_dir():
            # Look for website_intelligence.json inside folder
            intel_file = path / "website_intelligence.json"
            if intel_file.exists():
                path = intel_file
            else:
                raise FileNotFoundError(f"Could not find website_intelligence.json in '{path}'")

        # If bare site_id passed
        if not path.exists():
            candidate = WEBSITES_DATA_DIR / str(source) / "website_intelligence.json"
            if candidate.exists():
                path = candidate
            else:
                raise FileNotFoundError(f"Could not locate website_intelligence.json for: '{source}'")

        with open(path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        intel = WebsiteIntelligence.model_validate(raw_data)
        return intel, str(path.resolve()), path.parent

    def _load_raw_website_if_available(self, site_dir: Path) -> Optional[WebsiteCollectionResult]:
        """Attempts to load raw website.json if available in the same directory."""
        website_json_path = site_dir / "website.json"
        if website_json_path.exists():
            try:
                with open(website_json_path, "r", encoding="utf-8") as f:
                    raw_data = json.load(f)
                return WebsiteCollectionResult.model_validate(raw_data)
            except Exception as e:
                logger.debug("Optional raw website.json could not be loaded: %s", e)
        return None

    def _copy_template_files(self, template_dir: Path, target_dir: Path, overwrite: bool = True):
        """Copies template directory to target output folder, ignoring build artifacts."""
        if target_dir.exists() and overwrite:
            logger.info("Cleaning existing generated project at %s", target_dir)
            def _remove_readonly(func, path, excinfo):
                import stat
                try:
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                except Exception:
                    pass
            try:
                shutil.rmtree(target_dir, onexc=lambda fn, path, exc: _remove_readonly(fn, path, exc))
            except TypeError:
                # Python < 3.12 compatibility
                shutil.rmtree(target_dir, onerror=_remove_readonly)

        target_dir.mkdir(parents=True, exist_ok=True)

        ignore_patterns = shutil.ignore_patterns(
            "node_modules",
            ".next",
            "dist",
            ".git",
            "*.log",
            ".turbo",
            ".vercel",
        )

        for item in template_dir.iterdir():
            dest = target_dir / item.name
            if item.is_dir():
                if item.name not in ["node_modules", ".next", "dist", ".git", ".turbo", ".vercel"]:
                    shutil.copytree(item, dest, ignore=ignore_patterns, dirs_exist_ok=True)
            else:
                shutil.copy2(item, dest)

    def _copy_public_assets_if_available(self, site_dir: Path, target_dir: Path):
        """Copies any crawled images or assets into public/assets/ folder of the generated project."""
        assets_source = site_dir / "raw" / "assets"
        if assets_source.exists() and assets_source.is_dir():
            public_assets = target_dir / "public" / "assets"
            public_assets.mkdir(parents=True, exist_ok=True)
            for asset in assets_source.iterdir():
                if asset.is_file():
                    shutil.copy2(asset, public_assets / asset.name)
            logger.info("Copied collected visual assets to %s", public_assets)

    def generate(
        self,
        source: Union[str, Path, Dict[str, Any], WebsiteIntelligence, WebsiteGenerationRequest],
        output_dir: Optional[Union[str, Path]] = None,
        template_override: Optional[str] = None,
        overwrite: bool = True,
    ) -> WebsiteGenerationResult:
        """
        Executes deterministic website generation from intelligence data.
        
        Args:
            source: Path to website_intelligence.json, site_id slug, dict, or WebsiteIntelligence.
            output_dir: Optional custom destination path (defaults to generated/<site-id>/).
            template_override: Optional template ID override.
            overwrite: Whether to overwrite existing output folder.
            
        Returns:
            WebsiteGenerationResult containing generated project metadata.
        """
        logger.info("Starting Website Generation pipeline...")

        # 1. Resolve intelligence data and origin path
        intel, source_path_str, site_dir = self._resolve_intelligence_data(source)
        website_raw = self._load_raw_website_if_available(site_dir)

        business_id = intel.site_id

        # 2. Select template
        template_meta: TemplateMetadata = self._selector.select_template(
            intelligence=intel,
            template_override=template_override,
            only_runnable=True,
        )

        template_path = Path(template_meta.template_dir) if template_meta.template_dir else (self._templates_dir / template_meta.id)
        if not template_path.exists():
            raise FileNotFoundError(f"Template folder not found: {template_path}")

        # 3. Determine target project directory
        if output_dir:
            target_project_dir = Path(output_dir).resolve()
        else:
            target_project_dir = (self._output_base_dir / business_id).resolve()

        logger.info(
            "Generating Next.js website for '%s' using template '%s' -> %s",
            business_id,
            template_meta.id,
            target_project_dir,
        )

        # 4. Copy template project structure
        self._copy_template_files(template_path, target_project_dir, overwrite=overwrite)

        # 5. Populate site-data.json
        site_data = self._populator.populate(
            intelligence=intel,
            template_meta=template_meta,
            website_raw=website_raw,
        )

        # 6. Write site-data.json into project with atomic write
        site_data_dest = target_project_dir / "site-data.json"
        temp_site_data = target_project_dir / "site-data.json.tmp"
        with open(temp_site_data, "w", encoding="utf-8") as f:
            json.dump(site_data, f, indent=2, ensure_ascii=False)
        temp_site_data.replace(site_data_dest)

        # 7. Copy assets if available
        self._copy_public_assets_if_available(site_dir, target_project_dir)

        # 8. Write generator manifest with atomic write
        manifest_dest = target_project_dir / "generator-manifest.json"
        temp_manifest = target_project_dir / "generator-manifest.json.tmp"
        manifest_data = {
            "business_id": business_id,
            "site_id": intel.site_id,
            "domain": intel.domain,
            "base_url": intel.base_url,
            "template_id": template_meta.id,
            "template_name": template_meta.name,
            "template_version": template_meta.version,
            "source_intelligence_file": source_path_str,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "slots_populated": len(site_data),
            "project_files": [f.name for f in target_project_dir.iterdir() if f.is_file()],
        }
        with open(temp_manifest, "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, indent=2)
        temp_manifest.replace(manifest_dest)


        logger.info(
            "Successfully assembled Next.js project at %s (template: %s)",
            target_project_dir,
            template_meta.id,
        )

        return WebsiteGenerationResult(
            business_id=business_id,
            site_id=intel.site_id,
            output_dir=str(target_project_dir),
            template_id=template_meta.id,
            template_name=template_meta.name,
            site_data_path=str(site_data_dest),
            manifest_path=str(manifest_dest),
            generated_at=manifest_data["generated_at"],
            is_success=True,
            slots_populated=len(site_data),
            warnings=[],
        )
