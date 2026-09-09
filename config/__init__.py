"""Configuration package for Nayom-Automation."""
from .settings import (
    BASE_DIR,
    DATA_DIR,
    RAW_DATA_DIR,
    NORMALIZED_DATA_DIR,
    SCRAPER_BIN_PATH,
    DEFAULT_ZOOM,
    DEFAULT_RADIUS,
    DEFAULT_MAX_RESULTS,
    SCRAPER_TIMEOUT_SECONDS,
)

__all__ = [
    "BASE_DIR",
    "DATA_DIR",
    "RAW_DATA_DIR",
    "NORMALIZED_DATA_DIR",
    "SCRAPER_BIN_PATH",
    "DEFAULT_ZOOM",
    "DEFAULT_RADIUS",
    "DEFAULT_MAX_RESULTS",
    "SCRAPER_TIMEOUT_SECONDS",
]
