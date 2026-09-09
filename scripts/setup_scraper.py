import os
import sys
import platform
import urllib.request
import json
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from config.settings import SCRAPER_BIN_PATH, SCRAPER_BIN_DIR


def get_download_asset_name() -> str:
    system = platform.system().lower()
    arch = platform.machine().lower()
    if arch in ["x86_64", "amd64"]:
        arch_str = "amd64"
    elif "arm" in arch or "aarch64" in arch:
        arch_str = "arm64"
    else:
        arch_str = "amd64"

    if system == "windows":
        return f"google_maps_scraper-1.17.3-windows-{arch_str}.exe"
    elif system == "darwin":
        return f"google_maps_scraper-1.17.3-darwin-{arch_str}"
    else:
        return f"google_maps_scraper-1.17.3-linux-{arch_str}"


def setup_scraper():
    SCRAPER_BIN_DIR.mkdir(parents=True, exist_ok=True)
    if SCRAPER_BIN_PATH.exists() and SCRAPER_BIN_PATH.stat().st_size > 0:
        print(f"Scraper binary already exists at: {SCRAPER_BIN_PATH}")
        return True

    asset_name = get_download_asset_name()
    download_url = f"https://github.com/gosom/google-maps-scraper/releases/download/v1.17.3/{asset_name}"
    print(f"Downloading {asset_name} from GitHub releases...")
    print(f"URL: {download_url}")
    print(f"Destination: {SCRAPER_BIN_PATH}")

    try:
        req = urllib.request.Request(download_url, headers={"User-Agent": "NayomAutomation"})
        with urllib.request.urlopen(req) as resp, open(SCRAPER_BIN_PATH, "wb") as out_file:
            out_file.write(resp.read())

        if sys.platform != "win32":
            # Make executable on Unix
            os.chmod(SCRAPER_BIN_PATH, 0o755)

        print(f"Successfully installed scraper binary to {SCRAPER_BIN_PATH}")
        return True
    except Exception as e:
        print(f"Error downloading scraper binary: {e}", file=sys.stderr)
        return False


if __name__ == "__main__":
    success = setup_scraper()
    sys.exit(0 if success else 1)
