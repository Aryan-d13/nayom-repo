"""Website Collector module for Nayom-Automation."""
from .collector import WebsiteCollector, collect_website
from .extractor import parse_page_html

__all__ = [
    "WebsiteCollector",
    "collect_website",
    "parse_page_html",
]
