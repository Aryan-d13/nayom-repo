import os
import sys
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
NORMALIZED_DATA_DIR = DATA_DIR / "normalized"
WEBSITES_DATA_DIR = DATA_DIR / "websites"
TEMPLATES_DIR = BASE_DIR / "templates"
GENERATED_DIR = BASE_DIR / "generated"
RUNS_DIR = DATA_DIR / "runs"

# Ensure data directories exist
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
NORMALIZED_DATA_DIR.mkdir(parents=True, exist_ok=True)
WEBSITES_DATA_DIR.mkdir(parents=True, exist_ok=True)
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
GENERATED_DIR.mkdir(parents=True, exist_ok=True)
RUNS_DIR.mkdir(parents=True, exist_ok=True)

# Scraper binary configuration
SCRAPER_BIN_DIR = BASE_DIR / "modules" / "maps_scraper" / "bin"
SCRAPER_BIN_DIR.mkdir(parents=True, exist_ok=True)

EXE_NAME = "google-maps-scraper.exe" if sys.platform == "win32" else "google-maps-scraper"
SCRAPER_BIN_PATH = SCRAPER_BIN_DIR / EXE_NAME

# Scraper defaults
DEFAULT_ZOOM = 14
DEFAULT_RADIUS = 10000.0  # 10 km
DEFAULT_MAX_RESULTS = 20
SCRAPER_TIMEOUT_SECONDS = 180

# Website Collector defaults
DEFAULT_WEBSITE_MAX_PAGES = 50
DEFAULT_WEBSITE_CONCURRENCY = 5
DEFAULT_WEBSITE_TIMEOUT = 20
DEFAULT_WEBSITE_DELAY = 0.25
DEFAULT_WEBSITE_RENDER_JS = False
DEFAULT_WEBSITE_SCREENSHOT = False

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except ImportError:
    pass

# AI Provider & Model Configuration
DEFAULT_AI_PROVIDER = os.environ.get("AI_PROVIDER", "gemini")
DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", DEFAULT_GEMINI_MODEL)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
MAX_VISUAL_SCREENSHOTS = int(os.environ.get("MAX_VISUAL_SCREENSHOTS", "5"))

# Email Sender & Provider Configuration
EMAIL_STATE_FILE = DATA_DIR / "email_sending_state.json"
EMAIL_SUPPRESSION_FILE = DATA_DIR / "email_suppression_list.json"
DEFAULT_EMAIL_DELAY_SECONDS = float(os.environ.get("EMAIL_DELAY_SECONDS", "1.0"))
DEFAULT_FROM_EMAIL = os.environ.get("EMAIL_FROM", os.environ.get("DEFAULT_FROM_EMAIL", "outreach@nayom.com"))
DEFAULT_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", os.environ.get("DEFAULT_FROM_NAME", "Nayom Growth Team"))

# Default configurable daily quotas (overridable via .env)
DEFAULT_RESEND_DAILY_LIMIT = int(os.environ.get("RESEND_DAILY_LIMIT", "100"))
DEFAULT_SENDGRID_DAILY_LIMIT = int(os.environ.get("SENDGRID_DAILY_LIMIT", "100"))
DEFAULT_GMAIL_DAILY_LIMIT = int(os.environ.get("GMAIL_DAILY_LIMIT", "500"))
DEFAULT_OUTLOOK_DAILY_LIMIT = int(os.environ.get("OUTLOOK_DAILY_LIMIT", "300"))
DEFAULT_SMTP_DAILY_LIMIT = int(os.environ.get("SMTP_DAILY_LIMIT", "500"))


