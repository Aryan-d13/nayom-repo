import sys
import os
import time
from pathlib import Path
from datetime import datetime, timezone

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from contracts.deployment import DeploymentRequest
from modules.deployment.manager import DeploymentManager

TARGET_PROJECT = BASE_DIR / "generated" / "aryansharmaswe_vercel_app"


def run_deployments():
    print("\n" + "=" * 80)
    print(" Nayom-Automation - Multi-Provider Live Website Deployment Suite")
    print("=" * 80)
    print(f"Target Project:    {TARGET_PROJECT}")
    print(f"Timestamp:         {datetime.now(timezone.utc).isoformat()}")
    print("-" * 80 + "\n")

    if not TARGET_PROJECT.exists():
        print(f"[ERROR] Target project directory {TARGET_PROJECT} not found.", file=sys.stderr)
        sys.exit(1)

    manager = DeploymentManager()
    providers = manager._providers

    deploy_order = ["vercel", "cloudflare", "netlify", "github_pages", "render", "firebase"]
    results = []

    for name in deploy_order:
        prov = providers.get(name)
        if not prov:
            continue

        print(f"[*] Testing deployment on provider: {name.upper()}...")
        status = prov.is_available()

        if not status.is_configured:
            print(f"    [-] Skipped: Unconfigured ({', '.join(status.missing_credentials)})")
            results.append({
                "provider": name,
                "status": "SKIPPED",
                "url": "N/A",
                "duration": 0.0,
                "detail": f"Missing: {', '.join(status.missing_credentials)}"
            })
            continue

        request = DeploymentRequest(
            business_id="aryansharmaswe_vercel_app",
            site_dir=str(TARGET_PROJECT),
            provider=name,
        )

        try:
            start_t = time.time()
            res = prov.deploy(TARGET_PROJECT, request)
            dur = round(time.time() - start_t, 2)

            if res.status == "success":
                print(f"    [+] SUCCESS! Live URL: {res.url} ({dur}s)")
                results.append({
                    "provider": name,
                    "status": "LIVE",
                    "url": res.url,
                    "duration": dur,
                    "detail": "Deployed successfully"
                })
            else:
                err_str = res.error or ", ".join(res.warnings) or "Unknown error"
                print(f"    [!] FAILED: {err_str} ({dur}s)")
                results.append({
                    "provider": name,
                    "status": "FAILED",
                    "url": "N/A",
                    "duration": dur,
                    "detail": err_str
                })
        except Exception as ex:
            print(f"    [!] EXCEPTION: {ex}")
            results.append({
                "provider": name,
                "status": "ERROR",
                "url": "N/A",
                "duration": 0.0,
                "detail": str(ex)
            })

    # Summary Table
    print("\n" + "=" * 105)
    print(f"| {'Provider':<16} | {'Status':<10} | {'Live Website URL':<44} | {'Time (s)':<10} |")
    print("|" + "-" * 18 + "|" + "-" * 12 + "|" + "-" * 46 + "|" + "-" * 12 + "|")
    for r in results:
        url_trunc = (r["url"][:41] + "...") if len(r["url"]) > 44 else r["url"]
        print(f"| {r['provider'].upper():<16} | {r['status']:<10} | {url_trunc:<44} | {r['duration']:<10.2f} |")
    print("=" * 105 + "\n")


if __name__ == "__main__":
    run_deployments()
