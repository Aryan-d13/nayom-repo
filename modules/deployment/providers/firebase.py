import os
import json
import time
import logging
import subprocess
from pathlib import Path
from typing import Optional

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider
from ..builder import ensure_static_build

logger = logging.getLogger(__name__)


class FirebaseHostingProvider(DeploymentProvider):
    """
    Firebase Hosting Deployment Provider.
    
    Deploys Next.js static output to Firebase Hosting using firebase-tools CLI.
    """

    def __init__(
        self,
        token: Optional[str] = None,
        project_id: Optional[str] = None,
    ):
        self._token = token if token is not None else os.environ.get("FIREBASE_TOKEN")
        self._project_id = project_id if project_id is not None else (os.environ.get("FIREBASE_PROJECT_ID") or os.environ.get("FIREBASE_PROJECT") or os.environ.get("GCP_PROJECT"))

    @property
    def provider_name(self) -> str:
        return "firebase"

    def is_available(self) -> ProviderStatus:
        missing = []
        if not self._token:
            missing.append("FIREBASE_TOKEN")
        if not self._project_id:
            missing.append("FIREBASE_PROJECT_ID")

        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=len(missing) == 0,
            missing_credentials=missing,
            description="Firebase global CDN & SSD-backed hosting" if len(missing) == 0 else f"Missing credentials: {', '.join(missing)}",
        )

    def _ensure_firebase_json(self, site_dir: Path, public_dir_name: str = "out"):
        """Creates minimal firebase.json if not present in the site directory."""
        firebase_json = site_dir / "firebase.json"
        if not firebase_json.exists():
            config = {
                "hosting": {
                    "public": public_dir_name,
                    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
                    "rewrites": [
                        {
                            "source": "**",
                            "destination": "/index.html"
                        }
                    ]
                }
            }
            firebase_json.write_text(json.dumps(config, indent=2), encoding="utf-8")
            logger.info("Created default firebase.json in %s", site_dir)

    def deploy(self, site_dir: Path, request: DeploymentRequest) -> DeploymentResult:
        start_time = time.time()
        status = self.is_available()
        if not status.is_configured:
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="skipped",
                duration_seconds=0.0,
                warnings=[f"Firebase credentials not configured: {', '.join(status.missing_credentials)}"],
                error="Missing Firebase credentials",
            )

        logger.info("Initiating Firebase Hosting deployment for '%s' (project: %s)...", request.business_id, self._project_id)

        try:
            build_dir = ensure_static_build(site_dir)
            self._ensure_firebase_json(site_dir, public_dir_name=build_dir.name)

            cmd = [
                "npx",
                "-y",
                "firebase-tools",
                "deploy",
                "--only",
                "hosting",
                "--project",
                self._project_id,
                "--token",
                self._token,
                "--non-interactive",
            ]

            env = os.environ.copy()
            env["FIREBASE_TOKEN"] = self._token

            proc = subprocess.run(
                cmd,
                cwd=str(site_dir),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                shell=True,
                env=env,
                timeout=300,
            )

            stdout = (proc.stdout or "").strip()
            stderr = (proc.stderr or "").strip()

            if proc.returncode != 0:
                logger.error("Firebase deployment failed: %s\nStderr: %s", stdout, stderr)
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    url="",
                    status="failed",
                    duration_seconds=round(time.time() - start_time, 2),
                    error=stderr or stdout or "Firebase deployment failed",
                )

            # Look for Hosting URL: in output
            live_url = ""
            for line in stdout.splitlines():
                if "Hosting URL:" in line or "https://" in line and ".web.app" in line:
                    for p in line.split():
                        if p.startswith("https://"):
                            live_url = p.rstrip(".")
                            break

            if not live_url:
                live_url = f"https://{self._project_id}.web.app"

            duration = round(time.time() - start_time, 2)
            logger.info("Firebase Hosting deployment succeeded: %s (duration: %.2fs)", live_url, duration)

            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                deployment_id=f"firebase-{self._project_id}",
                url=live_url,
                status="success",
                duration_seconds=duration,
            )

        except Exception as ex:
            logger.error("Firebase deployment error: %s", ex)
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=round(time.time() - start_time, 2),
                error=str(ex),
            )
