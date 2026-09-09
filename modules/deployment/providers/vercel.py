import os
import re
import json
import time
import shutil
import logging
import subprocess
import urllib.request
from pathlib import Path
from typing import Optional, List

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider

logger = logging.getLogger(__name__)


class VercelProvider(DeploymentProvider):
    """
    Vercel Deployment Provider.
    
    Deploys Next.js projects natively to Vercel via the official Vercel CLI / REST API.
    """

    def __init__(
        self,
        token: Optional[str] = None,
        team_id: Optional[str] = None,
        project_name_prefix: str = "nayom",
    ):
        self._token = token if token is not None else (os.environ.get("VERCEL_TOKEN") or os.environ.get("VERCEL_AUTH_TOKEN") or os.environ.get("VERCEL_API_KEY"))
        self._team_id = team_id if team_id is not None else (os.environ.get("VERCEL_TEAM_ID") or os.environ.get("VERCEL_ORG_ID"))
        self._prefix = project_name_prefix

    @property
    def provider_name(self) -> str:
        return "vercel"

    def is_available(self) -> ProviderStatus:
        missing = []
        if not self._token:
            missing.append("VERCEL_TOKEN")

        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=len(missing) == 0,
            missing_credentials=missing,
            description="Native Next.js cloud hosting via Vercel platform" if len(missing) == 0 else f"Missing credentials: {', '.join(missing)}",
        )

    def _make_project_public(self, project_name: str):
        """Ensures the Vercel project has SSO Deployment Protection disabled so preview links are 100% public."""
        if not self._token:
            return
        try:
            patch_url = f"https://api.vercel.com/v9/projects/{project_name}"
            patch_body = json.dumps({"ssoProtection": None, "passwordProtection": None}).encode("utf-8")
            patch_req = urllib.request.Request(
                patch_url,
                data=patch_body,
                headers={"Authorization": f"Bearer {self._token}", "Content-Type": "application/json"},
                method="PATCH",
            )
            with urllib.request.urlopen(patch_req, timeout=5) as resp:
                logger.info("Successfully disabled SSO protection for Vercel project '%s'", project_name)
        except Exception as e:
            logger.debug("Non-fatal error configuring Vercel public access for '%s': %s", project_name, e)

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
                warnings=[f"Vercel credentials not configured: {', '.join(status.missing_credentials)}"],
                error="Missing Vercel credentials",
            )

        sanitized_name = f"{self._prefix}-{request.business_id.replace('_', '-')[:40]}".lower().strip("-")
        logger.info("Initiating Vercel deployment for '%s' (project: %s)...", request.business_id, sanitized_name)

        # Build CLI command
        # npx -y vercel deploy --prod --yes --token <TOKEN>
        cmd = [
            "npx",
            "-y",
            "vercel",
            "deploy",
            "--prod",
            "--yes",
            "--name",
            sanitized_name,
            "--token",
            self._token,
        ]

        clean_team = (self._team_id or "").strip()
        if clean_team and not clean_team.startswith("#") and "optional" not in clean_team.lower() and clean_team != "team_xxx":
            cmd.extend(["--scope", clean_team])


        try:
            # Set environment variable for VERCEL_TOKEN
            env = os.environ.copy()
            env["VERCEL_TOKEN"] = self._token
            env["VERCEL_PROJECT_NAME"] = sanitized_name

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
                logger.error("Vercel deployment failed with exit code %d: %s\nStderr: %s", proc.returncode, stdout, stderr)
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    url="",
                    status="failed",
                    duration_seconds=round(time.time() - start_time, 2),
                    warnings=[f"CLI returned code {proc.returncode}"],
                    error=stderr or stdout or "Vercel CLI deployment failed",
                )

            # Extract the actual live Vercel URL from stdout / JSON
            live_url = ""

            # 1. Check for JSON block in output
            try:
                json_match = re.search(r"\{[\s\S]*\"status\":\s*\"ok\"[\s\S]*\}", stdout)
                if json_match:
                    payload = json.loads(json_match.group(0))
                    live_url = payload.get("deployment", {}).get("url", "")
            except Exception:
                pass

            # 2. Check for "Aliased https://..." in output
            if not live_url:
                alias_match = re.search(r"Aliased\s+(https://[^\s]+\.vercel\.app)", stdout, re.IGNORECASE)
                if alias_match:
                    live_url = alias_match.group(1).strip()

            # 3. Check for "Production https://..." in output
            if not live_url:
                prod_match = re.search(r"Production\s+(https://[^\s]+\.vercel\.app)", stdout, re.IGNORECASE)
                if prod_match:
                    live_url = prod_match.group(1).strip()

            # 4. Extract any valid https://*.vercel.app URL from stdout (skipping inspect/api URLs)
            if not live_url:
                all_vercel_urls = re.findall(r"https://[a-zA-Z0-9\-_.]+\.vercel\.app", stdout)
                for u in reversed(all_vercel_urls):
                    if "inspect" not in u and "api.vercel.com" not in u:
                        live_url = u
                        break

            if not live_url:
                # Fallback to standard project URL format
                live_url = f"https://{sanitized_name}.vercel.app"

            duration = round(time.time() - start_time, 2)
            logger.info("Vercel deployment succeeded: %s (duration: %.2fs)", live_url, duration)

            # Ensure the project has SSO Deployment Protection disabled for public viewing
            self._make_project_public(sanitized_name)

            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                deployment_id=sanitized_name,
                url=live_url,
                status="success",
                duration_seconds=duration,
                warnings=[],
                error=None,
            )

        except subprocess.TimeoutExpired:
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=round(time.time() - start_time, 2),
                error="Vercel deployment timed out after 300 seconds",
            )
        except Exception as ex:
            logger.error("Unexpected error during Vercel deployment: %s", ex)
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=round(time.time() - start_time, 2),
                error=str(ex),
            )
