from typing import Optional, List
from pydantic import BaseModel, Field
from .business import Business


class MapsSearchRequest(BaseModel):
    """
    Contract for requesting a Google Maps search scrape.
    """
    query: str
    max_results: int = 20
    geo: Optional[str] = None  # e.g., "30.2672,-97.7431"
    zoom: int = 14
    radius: float = 10000.0  # Search radius in meters
    extract_email: bool = False
    fast_mode: bool = True


class MapsSearchResult(BaseModel):
    """
    Contract for Google Maps search scraping results.
    """
    request: MapsSearchRequest
    businesses: List[Business] = Field(default_factory=list)
    total_found: int = 0
    usable_count: int = 0
    raw_file_path: str
    normalized_file_path: str
    executed_at: str
    duration_seconds: float
    # Explicit operational metrics
    requested: int = Field(default=0, description="Requested max results from query")
    attempted: int = Field(default=0, description="Number of grid tiles or queries attempted")
    found: int = Field(default=0, description="Total raw places found across all tiles before deduplication")
    usable: int = Field(default=0, description="Total usable unique businesses with valid contact info")
    processed: int = Field(default=0, description="Total unique records normalized and processed")
    succeeded: int = Field(default=0, description="Total unique records successfully saved to output")
    failed: int = Field(default=0, description="Number of tiles or items that failed")
    skipped: int = Field(default=0, description="Number of duplicate or unusable items skipped")

