import os
import io
import time
import zipfile
import logging
import requests
import subprocess
from pathlib import Path
from typing import Optional

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider
from ..builder import ensure_static_build

logger = logging.getLogger(__name__)


class NetlifyProvider(DeploymentProvider):
    """
    Netlify Deployment Provider.
    
    Supports native Next.js deployment via Netlify CLI and direct ZIP deployment via Netlify REST API.
    """

    def __init__(
        self,
        auth_token: Optional[str] = None,
        site_id: Optional[str] = None,
        project_prefix: str = "nayom",
    ):
        self._auth_token = auth_token if auth_token is not None else (os.environ.get("NETLIFY_AUTH_TOKEN") or os.environ.get("NETLIFY_API_KEY") or os.environ.get("NETLIFY_TOKEN"))
        self._site_id = site_id if site_id is not None else os.environ.get("NETLIFY_SITE_ID")
        self._prefix = project_prefix

    @property
    def provider_name(self) -> str:
        return "netlify"

    def is_available(self) -> ProviderStatus:
        missing = []
        if not self._auth_token:
            missing.append("NETLIFY_AUTH_TOKEN")

        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=len(missing) == 0,
            missing_credentials=missing,
            description="Netlify global edge & serverless hosting" if len(missing) == 0 else f"Missing credentials: {', '.join(missing)}",
        )

    def _zip_directory(self, dir_to_zip: Path) -> bytes:
        """Compresses directory into an in-memory ZIP archive bytes buffer."""
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, _, files in os.walk(dir_to_zip):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(dir_to_zip)
                    zf.write(file_path, arcname)
        buffer.seek(0)
        return buffer.getvalue()

    def _deploy_via_api(self, site_dir: Path, request: DeploymentRequest, start_time: float) -> DeploymentResult:
        """Deploys static build to Netlify REST API via ZIP upload."""
        build_dir = ensure_static_build(site_dir)
        zip_bytes = self._zip_directory(build_dir)

        headers = {
            "Authorization": f"Bearer {self._auth_token}",
        }

        sanitized_name = f"{self._prefix}-{request.business_id.replace('_', '-')[:30]}".lower().strip("-")

        # 1. Get or create site
        site_id = self._site_id
        if not site_id:
            create_url = "https://api.netlify.com/api/v1/sites"
            resp = requests.post(create_url, headers=headers, json={"name": sanitized_name}, timeout=30)
            if resp.status_code in (200, 201):
                site_data = resp.json()
                site_id = site_data.get("id") or site_data.get("site_id")
            elif resp.status_code == 422:  # Site name might already exist
                # Query existing site or create with unique suffix
                import uuid
                unique_name = f"{sanitized_name}-{uuid.uuid4().hex[:6]}"
                resp = requests.post(create_url, headers=headers, json={"name": unique_name}, timeout=30)
                if resp.status_code in (200, 201):
                    site_id = resp.json().get("id")
                else:
                    raise RuntimeError(f"Failed to create Netlify site: {resp.text}")
            else:
                raise RuntimeError(f"Failed to initialize Netlify site: {resp.status_code} - {resp.text}")

        # 2. Deploy ZIP
        deploy_url = f"https://api.netlify.com/api/v1/sites/{site_id}/deploys"
        headers["Content-Type"] = "application/zip"
        deploy_resp = requests.post(deploy_url, headers=headers, data=zip_bytes, timeout=120)

        if deploy_resp.status_code not in (200, 201):
            raise RuntimeError(f"Netlify deploy API failed: {deploy_resp.status_code} - {deploy_resp.text}")

        res_json = deploy_resp.json()
        live_url = res_json.get("ssl_url") or res_json.get("url") or f"https://{sanitized_name}.netlify.app"
        deployment_id = res_json.get("id", site_id)
        duration = round(time.time() - start_time, 2)

        logger.info("Netlify API deployment succeeded: %s (duration: %.2fs)", live_url, duration)

        return DeploymentResult(
            business_id=request.business_id,
            provider=self.provider_name,
            deployment_id=str(deployment_id),
            url=live_url,
            status="success",
            duration_seconds=duration,
        )

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
                warnings=[f"Netlify credentials not configured: {', '.join(status.missing_credentials)}"],
                error="Missing Netlify credentials",
            )

        logger.info("Initiating Netlify deployment for '%s'...", request.business_id)

        # Primary: REST API deployment with ZIP
        try:
            return self._deploy_via_api(site_dir, request, start_time)
        except Exception as api_err:
            logger.warning("Netlify REST API failed, attempting CLI fallback: %s", api_err)

        # Fallback: Netlify CLI
        try:
            build_dir = ensure_static_build(site_dir)
            env = os.environ.copy()
            env["NETLIFY_AUTH_TOKEN"] = self._auth_token

            cmd = [
                "npx",
                "-y",
                "netlify-cli",
                "deploy",
                "--prod",
                "--dir",
                str(build_dir),
                "--auth",
                self._auth_token,
            ]

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
                logger.error("Netlify CLI failed: %s", stderr or stdout)
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    url="",
                    status="failed",
                    duration_seconds=round(time.time() - start_time, 2),
                    error=stderr or stdout or "Netlify CLI deployment failed",
                )

            live_url = ""
            for line in stdout.splitlines():
                if "Website URL:" in line or "Website Draft URL:" in line or "Live URL:" in line:
                    parts = line.split()
                    for p in parts:
                        if p.startswith("https://"):
                            live_url = p
                            break

            if not live_url:
                sanitized_name = f"{self._prefix}-{request.business_id.replace('_', '-')[:30]}".lower().strip("-")
                live_url = f"https://{sanitized_name}.netlify.app"

            duration = round(time.time() - start_time, 2)
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url=live_url,
                status="success",
                duration_seconds=duration,
            )

        except Exception as ex:
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=round(time.time() - start_time, 2),
                error=str(ex),
            )
