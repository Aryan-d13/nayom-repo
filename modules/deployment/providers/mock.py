import os
import time
import logging
from pathlib import Path
from typing import Optional

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider

logger = logging.getLogger(__name__)


class MockDeploymentProvider(DeploymentProvider):
    """
    Mock Deployment Provider.
    
    Generates preview deployment URLs for local testing, offline workflows,
    and fallback when live credentials are not set.
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        should_fail: bool = False,
    ):
        self._base_url = base_url or os.environ.get("DEMO_BASE_URL", "https://preview.nayom-automation.local")
        self._should_fail = should_fail

    @property
    def provider_name(self) -> str:
        return "mock"

    def is_available(self) -> ProviderStatus:
        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=True,
            missing_credentials=[],
            description="Local mock deployment engine for development and testing",
        )

    def deploy(self, site_dir: Path, request: DeploymentRequest) -> DeploymentResult:
        start_time = time.time()
        logger.info("Executing Mock deployment for '%s'...", request.business_id)

        if self._should_fail:
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=0.05,
                error="Mock deployment simulated failure",
            )

        sanitized_slug = request.business_id.replace("_", "-").lower()
        if self._base_url.endswith("/"):
            live_url = f"{self._base_url}{sanitized_slug}"
        else:
            live_url = f"{self._base_url}/{sanitized_slug}"

        duration = round(time.time() - start_time, 2)
        logger.info("Mock deployment generated preview URL: %s", live_url)

        return DeploymentResult(
            business_id=request.business_id,
            provider=self.provider_name,
            deployment_id=f"mock-{sanitized_slug}",
            url=live_url,
            status="success",
            duration_seconds=duration,
            warnings=[],
            error=None,
        )
