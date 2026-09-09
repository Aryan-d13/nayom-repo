import os
import time
import logging
import requests
import subprocess
from pathlib import Path
from typing import Optional

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider

logger = logging.getLogger(__name__)


class RenderProvider(DeploymentProvider):
    """
    Render Deployment Provider.
    
    Deploys Next.js web applications using the Render REST API and deploy triggers.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        service_id: Optional[str] = None,
        owner_id: Optional[str] = None,
        project_prefix: str = "nayom",
    ):
        self._api_key = api_key if api_key is not None else os.environ.get("RENDER_API_KEY")
        self._service_id = service_id if service_id is not None else os.environ.get("RENDER_SERVICE_ID")
        self._owner_id = owner_id if owner_id is not None else os.environ.get("RENDER_OWNER_ID")
        self._prefix = project_prefix

    @property
    def provider_name(self) -> str:
        return "render"

    def is_available(self) -> ProviderStatus:
        missing = []
        if not self._api_key:
            missing.append("RENDER_API_KEY")

        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=len(missing) == 0,
            missing_credentials=missing,
            description="Render unified cloud & Web Services" if len(missing) == 0 else f"Missing credentials: {', '.join(missing)}",
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
                warnings=[f"Render credentials not configured: {', '.join(status.missing_credentials)}"],
                error="Missing Render credentials",
            )

        sanitized_name = f"{self._prefix}-{request.business_id.replace('_', '-')[:30]}".lower().strip("-")
        logger.info("Initiating Render deployment for '%s'...", request.business_id)

        # 1. Trigger existing service deploy if service_id is configured
        if self._service_id:
            try:
                url = f"https://api.render.com/v1/services/{self._service_id}/deploys"
                headers = {
                    "Authorization": f"Bearer {self._api_key}",
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
                resp = requests.post(url, headers=headers, json={"clearCache": "do_not_clear"}, timeout=30)
                if resp.status_code in (200, 201):
                    deploy_data = resp.json()
                    deploy_id = deploy_data.get("id", "render-deploy")
                    live_url = f"https://{sanitized_name}.onrender.com"
                    duration = round(time.time() - start_time, 2)
                    return DeploymentResult(
                        business_id=request.business_id,
                        provider=self.provider_name,
                        deployment_id=str(deploy_id),
                        url=live_url,
                        status="success",
                        duration_seconds=duration,
                    )
                else:
                    logger.warning("Render service deploy API returned %s: %s", resp.status_code, resp.text)
            except Exception as e:
                logger.warning("Render API trigger error: %s", e)

        # 2. Render CLI fallback
        try:
            cmd = ["render", "deploy"]
            env = os.environ.copy()
            env["RENDER_API_KEY"] = self._api_key

            proc = subprocess.run(
                cmd,
                cwd=str(site_dir),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                shell=True,
                env=env,
                timeout=180,
            )

            stdout = (proc.stdout or "").strip()
            stderr = (proc.stderr or "").strip()

            if proc.returncode == 0:
                live_url = f"https://{sanitized_name}.onrender.com"
                duration = round(time.time() - start_time, 2)
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    deployment_id=sanitized_name,
                    url=live_url,
                    status="success",
                    duration_seconds=duration,
                )
            else:
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    url="",
                    status="failed",
                    duration_seconds=round(time.time() - start_time, 2),
                    error=proc.stderr or proc.stdout or "Render CLI deploy failed",
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
