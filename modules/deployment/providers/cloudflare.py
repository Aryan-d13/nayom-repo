import os
import time
import logging
import subprocess
from pathlib import Path
from typing import Optional

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider
from ..builder import ensure_static_build

logger = logging.getLogger(__name__)


class CloudflarePagesProvider(DeploymentProvider):
    """
    Cloudflare Pages Deployment Provider.
    
    Deploys Next.js export / static output to Cloudflare Pages using Wrangler CLI.
    """

    def __init__(
        self,
        api_token: Optional[str] = None,
        account_id: Optional[str] = None,
        project_prefix: str = "nayom",
    ):
        self._api_token = api_token if api_token is not None else (os.environ.get("CLOUDFLARE_API_TOKEN") or os.environ.get("CF_API_TOKEN"))
        self._account_id = account_id if account_id is not None else (os.environ.get("CLOUDFLARE_ACCOUNT_ID") or os.environ.get("CF_ACCOUNT_ID"))
        self._prefix = project_prefix

    @property
    def provider_name(self) -> str:
        return "cloudflare"

    def is_available(self) -> ProviderStatus:
        missing = []
        if not self._api_token:
            missing.append("CLOUDFLARE_API_TOKEN")
        if not self._account_id:
            missing.append("CLOUDFLARE_ACCOUNT_ID")

        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=len(missing) == 0,
            missing_credentials=missing,
            description="Cloudflare Pages global edge network" if len(missing) == 0 else f"Missing credentials: {', '.join(missing)}",
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
                warnings=[f"Cloudflare credentials not configured: {', '.join(status.missing_credentials)}"],
                error="Missing Cloudflare credentials",
            )

        sanitized_name = f"{self._prefix}-{request.business_id.replace('_', '-')[:25]}".lower().strip("-")
        logger.info("Initiating Cloudflare Pages deployment for '%s' (project: %s)...", request.business_id, sanitized_name)

        try:
            # Ensure static build output exists
            build_dir = ensure_static_build(site_dir)
            rel_dir = build_dir.name  # 'out' or '.next'

            env = os.environ.copy()
            env["CLOUDFLARE_API_TOKEN"] = self._api_token
            env["CLOUDFLARE_ACCOUNT_ID"] = self._account_id

            # 1. Ensure Cloudflare Pages project exists (create if not present)
            try:
                import requests
                create_proj_url = f"https://api.cloudflare.com/client/v4/accounts/{self._account_id}/pages/projects"
                proj_headers = {
                    "Authorization": f"Bearer {self._api_token}",
                    "Content-Type": "application/json",
                }
                requests.post(
                    create_proj_url,
                    headers=proj_headers,
                    json={"name": sanitized_name, "production_branch": "main"},
                    timeout=15,
                )
            except Exception as e:
                logger.debug("Project create check: %s", e)

            # Fallback to CLI project create if needed
            create_cmd = [
                "npx",
                "-y",
                "wrangler",
                "pages",
                "project",
                "create",
                sanitized_name,
                "--production-branch",
                "main",
            ]
            try:
                subprocess.run(
                    create_cmd,
                    cwd=str(site_dir),
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    shell=True,
                    env=env,
                    timeout=30,
                )
            except Exception:
                pass

            cmd = [
                "npx",
                "-y",
                "wrangler",
                "pages",
                "deploy",
                str(build_dir),
                "--project-name",
                sanitized_name,
                "--commit-dirty=true",
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
                logger.error("Cloudflare Pages deployment failed: %s\nStderr: %s", stdout, stderr)
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    url="",
                    status="failed",
                    duration_seconds=round(time.time() - start_time, 2),
                    warnings=[f"Wrangler returned code {proc.returncode}"],
                    error=stderr or stdout or "Wrangler CLI deployment failed",
                )

            # Search output for https://*.pages.dev
            live_url = ""
            for line in stdout.splitlines():
                if "https://" in line and "pages.dev" in line:
                    parts = line.split()
                    for p in parts:
                        if p.startswith("https://") and "pages.dev" in p:
                            live_url = p.rstrip(".")
                            break

            if not live_url:
                live_url = f"https://{sanitized_name}.pages.dev"

            duration = round(time.time() - start_time, 2)
            logger.info("Cloudflare Pages deployment succeeded: %s (duration: %.2fs)", live_url, duration)

            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                deployment_id=sanitized_name,
                url=live_url,
                status="success",
                duration_seconds=duration,
            )

        except Exception as ex:
            logger.error("Cloudflare deployment error: %s", ex)
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=round(time.time() - start_time, 2),
                error=str(ex),
            )
