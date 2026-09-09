import json
import logging
import os
import re
import subprocess
import sys
import tempfile
import time
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any, Set

from config.settings import (
    RAW_DATA_DIR,
    NORMALIZED_DATA_DIR,
    SCRAPER_BIN_PATH,
    DEFAULT_RADIUS,
    DEFAULT_ZOOM,
    DEFAULT_MAX_RESULTS,
    SCRAPER_TIMEOUT_SECONDS,
)
from contracts.business import Business
from contracts.maps import MapsSearchRequest, MapsSearchResult
from .adapter import normalize_raw_records
from .geocoder import extract_location_from_query, geocode_location_info, generate_grid_tiles

logger = logging.getLogger(__name__)


def slugify(text: str) -> str:
    """Converts a string into a clean filename slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "_", text)[:40]


class GoogleMapsScraper:
    """
    Subprocess wrapper for gosom/google-maps-scraper with automated Geographic Grid Coverage.
    """

    def __init__(self, binary_path: Optional[Path] = None):
        self.binary_path = binary_path or SCRAPER_BIN_PATH
        if not self.binary_path.exists():
            fallback = Path("google-maps-scraper.exe" if sys.platform == "win32" else "google-maps-scraper")
            if fallback.exists():
                self.binary_path = fallback.resolve()

    def _scrape_single_tile(
        self,
        query: str,
        geo: str,
        radius: float,
        zoom: int,
        fast_mode: bool,
        extract_email: bool,
        raw_tile_path: Path,
    ) -> List[Dict[str, Any]]:
        """Executes a single tile search subprocess and returns parsed raw items."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False, encoding="utf-8") as temp_input:
            temp_input.write(f"{query}\n")
            temp_input_path = temp_input.name

        try:
            cmd = [
                str(self.binary_path),
                "-input", temp_input_path,
                "-results", str(raw_tile_path),
                "-json",
                "-radius", str(radius),
                "-zoom", str(zoom),
                "-c", "1",
            ]

            if fast_mode:
                cmd.append("-fast-mode")
                if geo:
                    cmd.extend(["-geo", geo])
            else:
                cmd.extend(["-depth", "1"])

            if extract_email:
                cmd.append("-email")

            subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=SCRAPER_TIMEOUT_SECONDS,
                cwd=str(self.binary_path.parent),
            )
        finally:
            if os.path.exists(temp_input_path):
                try:
                    os.remove(temp_input_path)
                except Exception:
                    pass

        raw_items = []
        if raw_tile_path.exists() and raw_tile_path.stat().st_size > 0:
            try:
                with open(raw_tile_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if content and content != "null":
                        parsed = json.loads(content)
                        if isinstance(parsed, list):
                            raw_items = parsed
                        elif isinstance(parsed, dict):
                            raw_items = [parsed]
            except Exception as e:
                logger.debug("Failed to read raw tile: %s", e)
            finally:
                # Cleanup individual tile raw file if temporary
                try:
                    raw_tile_path.unlink(missing_ok=True)
                except Exception:
                    pass

        return raw_items

    def search(self, request: MapsSearchRequest) -> MapsSearchResult:
        """
        Executes a full territory Google Maps scrape using automated bounding-box grid search.
        """
        if not self.binary_path.exists():
            raise FileNotFoundError(
                f"Google Maps scraper executable not found at: {self.binary_path}. "
                "Please run `python scripts/setup_scraper.py` to download the binary."
            )

        start_time = time.time()
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
        slug = slugify(request.query)
        uid = uuid.uuid4().hex[:6]
        search_id = f"{timestamp}_{slug}_{uid}"

        raw_output_path = RAW_DATA_DIR / f"{search_id}_raw.json"
        normalized_output_path = NORMALIZED_DATA_DIR / f"{search_id}.json"

        # Determine tiles to scrape dynamically based on requested results
        tiles: List[Dict[str, Any]] = []
        max_res = request.max_results or 20
        if max_res <= 20:
            tile_budget = 10
        elif max_res <= 100:
            tile_budget = 25
        else:
            tile_budget = 50

        if request.geo:
            # Explicit single-point coordinate
            tiles.append({
                "geo": request.geo,
                "radius": request.radius or DEFAULT_RADIUS,
                "zoom": request.zoom or DEFAULT_ZOOM,
            })
        else:
            # Auto-resolve bounding box for the whole region (City / State)
            location_str = extract_location_from_query(request.query)
            loc_info = geocode_location_info(location_str) or geocode_location_info(request.query)
            
            if loc_info:
                lat, lon, bbox = loc_info
                # Generate grid coverage across entire territory scaled to tile budget
                tiles = generate_grid_tiles(bbox, max_tiles=tile_budget)
                logger.info("Auto-generated %d grid tiles covering %s (bbox: %s)", len(tiles), location_str, bbox)
            else:
                logger.warning("Could not geocode location for '%s', using default tile", request.query)
                tiles.append({
                    "geo": "30.2672,-97.7431",
                    "radius": DEFAULT_RADIUS,
                    "zoom": DEFAULT_ZOOM,
                })

        all_raw_items: List[Dict[str, Any]] = []
        seen_keys: Set[str] = set()
        deduped_businesses: List[Business] = []
        failed_tiles_count = 0

        # Execute grid tiles concurrently
        max_workers = min(4, len(tiles)) if len(tiles) > 1 else 1

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_tile = {}
            for i, tile in enumerate(tiles):
                tile_raw_path = RAW_DATA_DIR / f"temp_tile_{search_id}_{i}.json"
                future = executor.submit(
                    self._scrape_single_tile,
                    query=request.query,
                    geo=tile["geo"],
                    radius=tile.get("radius", DEFAULT_RADIUS),
                    zoom=tile.get("zoom", DEFAULT_ZOOM),
                    fast_mode=request.fast_mode,
                    extract_email=request.extract_email,
                    raw_tile_path=tile_raw_path,
                )
                future_to_tile[future] = (i + 1, tile)

            for future in as_completed(future_to_tile):
                tile_idx, tile = future_to_tile[future]
                try:
                    tile_items = future.result()
                    if tile_items:
                        all_raw_items.extend(tile_items)
                        # Normalize and deduplicate on the fly
                        tile_biz_list = normalize_raw_records(tile_items, raw_file_ref=str(raw_output_path))
                        for b in tile_biz_list:
                            dedup_key = b.google_place_id or b.phone or f"{b.name.lower()}_{b.address or ''}"
                            if dedup_key not in seen_keys:
                                seen_keys.add(dedup_key)
                                deduped_businesses.append(b)
                except Exception as e:
                    failed_tiles_count += 1
                    logger.warning("Tile %d (%s) failed: %s", tile_idx, tile["geo"], e)

        # Usable business prioritization:
        # Prioritize usable businesses up to request.max_results rather than blindly truncating
        usable_biz = [b for b in deduped_businesses if b.usable]
        unusable_biz = [b for b in deduped_businesses if not b.usable]

        if request.max_results and request.max_results > 0:
            if len(usable_biz) >= request.max_results:
                final_businesses = usable_biz[:request.max_results]
            else:
                needed = request.max_results - len(usable_biz)
                final_businesses = usable_biz + unusable_biz[:needed]
        else:
            final_businesses = deduped_businesses

        # Save consolidated raw JSON
        with open(raw_output_path, "w", encoding="utf-8") as f:
            json.dump(all_raw_items, f, indent=2, ensure_ascii=False)

        usable_count = sum(1 for b in final_businesses if b.usable)
        duration = round(time.time() - start_time, 2)
        executed_at = datetime.now(timezone.utc).isoformat()

        # Operational metrics computation
        requested_count = request.max_results if (request.max_results and request.max_results > 0) else len(final_businesses)
        attempted_count = len(tiles)
        found_count = len(all_raw_items)
        usable_metric = usable_count
        processed_count = len(deduped_businesses)
        succeeded_count = len(final_businesses)
        failed_metric = failed_tiles_count
        skipped_metric = max(0, len(all_raw_items) - len(final_businesses))

        # Save consolidated normalized JSON
        result_payload = {
            "query": request.query,
            "total_found": len(final_businesses),
            "usable_count": usable_count,
            "grid_tiles_searched": len(tiles),
            "executed_at": executed_at,
            "duration_seconds": duration,
            "metrics": {
                "requested": requested_count,
                "attempted": attempted_count,
                "found": found_count,
                "usable": usable_metric,
                "processed": processed_count,
                "succeeded": succeeded_count,
                "failed": failed_metric,
                "skipped": skipped_metric,
            },
            "businesses": [b.model_dump() for b in final_businesses],
        }

        with open(normalized_output_path, "w", encoding="utf-8") as f:
            json.dump(result_payload, f, indent=2, ensure_ascii=False)

        return MapsSearchResult(
            request=request,
            businesses=final_businesses,
            total_found=len(final_businesses),
            usable_count=usable_count,
            raw_file_path=str(raw_output_path),
            normalized_file_path=str(normalized_output_path),
            executed_at=executed_at,
            duration_seconds=duration,
            requested=requested_count,
            attempted=attempted_count,
            found=found_count,
            usable=usable_metric,
            processed=processed_count,
            succeeded=succeeded_count,
            failed=failed_metric,
            skipped=skipped_metric,
        )

