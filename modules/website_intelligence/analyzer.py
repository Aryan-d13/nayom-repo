import os
import json
import time
import logging
from pathlib import Path
from typing import Union, Optional, List, Dict, Any
from datetime import datetime, timezone

from config.settings import WEBSITES_DATA_DIR, MAX_VISUAL_SCREENSHOTS
from contracts.website import WebsiteCollectionResult, Page
from contracts.intelligence import WebsiteIntelligence, IntelligenceMetadata
from .providers.base import AIProvider
from .providers.factory import get_provider
from .prompts import build_analysis_prompt, SYSTEM_INSTRUCTION, PROMPT_VERSION

logger = logging.getLogger(__name__)


class WebsiteIntelligenceAnalyzer:
    """
    Orchestrates the AI Website Intelligence extraction pipeline.
    
    Transforms crawled website.json (and associated visual screenshots) into a
    strongly-typed, validated WebsiteIntelligence contract.
    """

    def __init__(self, provider: Optional[AIProvider] = None):
        self._provider = provider

    def _resolve_website_json_path(self, target: Union[str, Path]) -> Path:
        """Resolves target input argument to a valid website.json Path."""
        path = Path(target)
        if path.is_file():
            return path.resolve()
        if path.is_dir():
            candidate = path / "website.json"
            if candidate.exists():
                return candidate.resolve()
        
        # Check in WEBSITES_DATA_DIR by site_id
        candidate = WEBSITES_DATA_DIR / str(target) / "website.json"
        if candidate.exists():
            return candidate.resolve()

        raise FileNotFoundError(f"Could not locate website.json for input target: '{target}'")

    def _load_website_data(self, source: Union[str, Path, Dict[str, Any], WebsiteCollectionResult]) -> tuple[WebsiteCollectionResult, str, Path]:
        """Loads and parses website data from path or dictionary."""
        if isinstance(source, WebsiteCollectionResult):
            source_path_str = source.website_json_path or "in-memory"
            base_dir = Path(source.raw_output_dir).parent if source.raw_output_dir else WEBSITES_DATA_DIR / source.site_id
            return source, source_path_str, base_dir

        if isinstance(source, dict):
            res = WebsiteCollectionResult.model_validate(source)
            base_dir = WEBSITES_DATA_DIR / res.site_id
            return res, "dict", base_dir

        json_path = self._resolve_website_json_path(source)
        with open(json_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        res = WebsiteCollectionResult.model_validate(raw_data)
        return res, str(json_path), json_path.parent

    def _discover_screenshots(
        self,
        site_result: WebsiteCollectionResult,
        site_dir: Path,
        max_screenshots: int = MAX_VISUAL_SCREENSHOTS,
    ) -> List[str]:
        """
        Discovers and resolves valid screenshot image file paths for multimodal reasoning.
        """
        found_paths = []
        seen = set()

        def add_if_valid(p: Path):
            if p.exists() and p.is_file() and str(p.resolve()) not in seen:
                seen.add(str(p.resolve()))
                found_paths.append(str(p.resolve()))

        # 1. Check pages in site_result
        for page in site_result.pages:
            if page.screenshot_path:
                # Check as absolute or relative to site_dir
                p = Path(page.screenshot_path)
                if not p.is_absolute():
                    p = site_dir / p
                add_if_valid(p)

                # Also check relative to raw_output_dir if present
                if site_result.raw_output_dir:
                    p_raw = Path(site_result.raw_output_dir) / page.screenshot_path
                    add_if_valid(p_raw)

        # 2. Check standard directory locations under site_dir
        for sub_dir in ["screenshots", "raw/screenshots", "raw"]:
            dir_to_check = site_dir / sub_dir
            if dir_to_check.exists() and dir_to_check.is_dir():
                for ext in ["*.png", "*.jpg", "*.jpeg", "*.webp"]:
                    for img_file in dir_to_check.glob(ext):
                        add_if_valid(img_file)

        selected = found_paths[:max_screenshots]
        if selected:
            logger.info("Discovered %d screenshot(s) for visual AI analysis: %s", len(selected), [Path(p).name for p in selected])
        else:
            logger.info("No screenshot images found for site %s (analyzing structured text/DOM).", site_result.site_id)

        return selected

    def analyze(
        self,
        source: Union[str, Path, Dict[str, Any], WebsiteCollectionResult],
        output_path: Optional[Union[str, Path]] = None,
        provider: Optional[AIProvider] = None,
        max_screenshots: int = MAX_VISUAL_SCREENSHOTS,
    ) -> WebsiteIntelligence:
        """
        Runs AI Website Intelligence extraction and writes structured output.
        
        Args:
            source: Path to website.json, site_id, raw dict, or WebsiteCollectionResult.
            output_path: Destination path for website_intelligence.json. If None, saves in site dir.
            provider: Custom AIProvider instance (defaults to GeminiProvider or factory default).
            max_screenshots: Maximum number of visual screenshots to pass to the model.
            
        Returns:
            Validated WebsiteIntelligence instance.
        """
        start_time = time.time()
        active_provider = provider or self._provider or get_provider()

        logger.info(
            "Starting Website Intelligence extraction using provider '%s' (%s)...",
            active_provider.provider_name,
            active_provider.model_name,
        )

        # 1. Load website data
        site_result, source_path_str, site_dir = self._load_website_data(source)

        # 2. Discover screenshots for visual analysis
        screenshot_paths = self._discover_screenshots(site_result, site_dir, max_screenshots=max_screenshots)

        # 3. Build prompts
        prompt = build_analysis_prompt(
            site_result,
            screenshot_count=len(screenshot_paths),
            response_schema=WebsiteIntelligence,
        )

        # 4. Generate structured intelligence via AI Provider
        intelligence: WebsiteIntelligence = active_provider.generate_structured(
            prompt=prompt,
            system_instruction=SYSTEM_INSTRUCTION,
            response_schema=WebsiteIntelligence,
            image_paths=screenshot_paths if screenshot_paths else None,
        )

        duration = round(time.time() - start_time, 2)

        # 5. Guarantee core identity & execution metadata
        intelligence.site_id = site_result.site_id
        intelligence.base_url = site_result.base_url
        intelligence.domain = site_result.domain
        intelligence.source_website_json = source_path_str

        # Update visual analysis status
        intelligence.design_and_ux.visual_inputs_analyzed = len(screenshot_paths) > 0

        # Update contact channel flag
        ci = intelligence.contact_intelligence
        ci.has_contact_method = bool(
            ci.emails or ci.phones or ci.addresses or ci.social_links or ci.contact_forms_found
        )

        # Populate metadata
        intelligence.metadata = IntelligenceMetadata(
            provider=active_provider.provider_name,
            model=active_provider.model_name,
            prompt_version=PROMPT_VERSION,
            analyzed_at=datetime.now(timezone.utc).isoformat(),
            screenshots_processed=len(screenshot_paths),
            duration_seconds=duration,
        )

        # 6. Determine output file path and save with atomic write
        if output_path:
            out_file = Path(output_path)
        else:
            out_file = site_dir / "website_intelligence.json"

        out_file.parent.mkdir(parents=True, exist_ok=True)
        temp_file = out_file.with_suffix(".tmp")
        with open(temp_file, "w", encoding="utf-8") as f:
            f.write(intelligence.model_dump_json(indent=2))
        temp_file.replace(out_file)

        logger.info(
            "Saved Website Intelligence to %s (duration: %.2fs)",
            out_file,
            duration,
        )

        return intelligence

