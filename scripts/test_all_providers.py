import sys
import os
import time
from pathlib import Path
from datetime import datetime, timezone

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from contracts.email import EmailDeliveryRequest
from modules.email_sender.manager import EmailSenderManager


def run_tests(target_email: str = "aryanstark3000@gmail.com"):
    print("\n" + "=" * 80)
    print(" Nayom-Automation - Multi-Provider Live Email Test Suite")
    print("=" * 80)
    print(f"Target Recipient:  {target_email}")
    print(f"Timestamp:         {datetime.now(timezone.utc).isoformat()}")
    print("-" * 80 + "\n")

    manager = EmailSenderManager()
    providers = manager._providers

    results = []

    # Desired test sequence
    test_order = ["resend", "gmail", "sendgrid", "outlook", "smtp"]

    for name in test_order:
        prov = providers.get(name)
        if not prov:
            continue

        print(f"[*] Testing provider: {name.upper()}...")
        status = prov.is_available()

        if not status.is_configured:
            print(f"    [-] Skipped: Unconfigured ({', '.join(status.missing_credentials)})")
            results.append({
                "provider": name,
                "status": "SKIPPED",
                "message_id": "N/A",
                "duration": 0.0,
                "detail": f"Missing: {', '.join(status.missing_credentials)}"
            })
            continue

        req = EmailDeliveryRequest(
            business_id=f"test-{name}",
            recipient=target_email,
            subject=f"[Nayom Test] Verification Email via {name.upper()}",
            body=(
                f"Hello Aryan,\n\n"
                f"This is a live test email sent directly from the Nayom-Automation engine.\n\n"
                f"Provider: {name.upper()}\n"
                f"Sent At (UTC): {datetime.now(timezone.utc).isoformat()}\n"
                f"Destination: {target_email}\n\n"
                f"If you are reading this, the {name.upper()} integration is 100% operational!\n\n"
                f"Best regards,\n"
                f"Nayom Automation Engine"
            ),
            preview_url="https://github.com/Aryan-d13/nayom-repo",
            business_name=f"Nayom Test ({name.upper()})",
            dry_run=False,
        )

        try:
            start_t = time.time()
            res = prov.send(req)
            dur = round(time.time() - start_t, 2)

            if res.status == "sent":
                print(f"    [+] SUCCESS! Message ID: {res.message_id} ({dur}s)")
                results.append({
                    "provider": name,
                    "status": "SENT",
                    "message_id": res.message_id or "OK",
                    "duration": dur,
                    "detail": "Delivered successfully"
                })
            else:
                err_str = res.error or ", ".join(res.warnings) or "Unknown error"
                print(f"    [!] FAILED: {err_str} ({dur}s)")
                results.append({
                    "provider": name,
                    "status": "FAILED",
                    "message_id": "N/A",
                    "duration": dur,
                    "detail": err_str
                })
        except Exception as ex:
            print(f"    [!] EXCEPTION: {ex}")
            results.append({
                "provider": name,
                "status": "ERROR",
                "message_id": "N/A",
                "duration": 0.0,
                "detail": str(ex)
            })

    # Summary Table
    print("\n" + "=" * 96)
    print(f"| {'Provider':<14} | {'Status':<10} | {'Message ID':<26} | {'Time (s)':<10} | {'Details':<22} |")
    print("|" + "-" * 16 + "|" + "-" * 12 + "|" + "-" * 28 + "|" + "-" * 12 + "|" + "-" * 24 + "|")
    for r in results:
        detail_trunc = (r["detail"][:21] + "...") if len(r["detail"]) > 24 else r["detail"]
        msg_trunc = (r["message_id"][:23] + "...") if len(r["message_id"]) > 26 else r["message_id"]
        print(f"| {r['provider'].upper():<14} | {r['status']:<10} | {msg_trunc:<26} | {r['duration']:<10.2f} | {detail_trunc:<22} |")
    print("=" * 96 + "\n")


if __name__ == "__main__":
    email_arg = sys.argv[1] if len(sys.argv) > 1 else "aryanstark3000@gmail.com"
    run_tests(email_arg)
