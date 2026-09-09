import os
import json
import logging
import threading
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Union, Any

from config.settings import DATA_DIR, GENERATED_DIR
from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from .base import DeploymentProvider
from .providers.vercel import VercelProvider
from .providers.cloudflare import CloudflarePagesProvider
from .providers.netlify import NetlifyProvider
from .providers.github_pages import GitHubPagesProvider
from .providers.render import RenderProvider
from .providers.firebase import FirebaseHostingProvider
from .providers.mock import MockDeploymentProvider

logger = logging.getLogger(__name__)

# Canonical Round-Robin sequence
ROUND_ROBIN_ORDER = [
    "vercel",
    "cloudflare",
    "netlify",
    "github_pages",
    "render",
    "firebase",
]


class DeploymentManager:
    """
    Manages multi-provider deployments with round-robin rotation,
    automatic failure fallback, local state persistence, and output writing.
    """

    def __init__(
        self,
        state_file: Optional[Path] = None,
        providers: Optional[Dict[str, DeploymentProvider]] = None,
    ):
        self._state_file = Path(state_file) if state_file else (DATA_DIR / "deployment_state.json")
        self._providers: Dict[str, DeploymentProvider] = providers or self._init_default_providers()
        self._lock = threading.Lock()

    def _init_default_providers(self) -> Dict[str, DeploymentProvider]:
        """Initializes default deployment provider instances."""
        return {
            "vercel": VercelProvider(),
            "cloudflare": CloudflarePagesProvider(),
            "netlify": NetlifyProvider(),
            "github_pages": GitHubPagesProvider(),
            "render": RenderProvider(),
            "firebase": FirebaseHostingProvider(),
            "mock": MockDeploymentProvider(),
        }

    def register_provider(self, name: str, provider: DeploymentProvider):
        """Registers a custom provider instance."""
        self._providers[name.lower()] = provider

    def get_provider(self, name: str) -> Optional[DeploymentProvider]:
        """Retrieves a registered provider by name."""
        return self._providers.get(name.lower())

    def get_available_providers(self) -> List[ProviderStatus]:
        """Returns availability status for all registered providers."""
        return [p.is_available() for p in self._providers.values()]

    def _load_state_unlocked(self) -> Dict[str, Any]:
        """Loads state dictionary without locking (called from within a locked context)."""
        if self._state_file.exists():
            try:
                with open(self._state_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning("Could not read deployment state file: %s", e)

        return {
            "current_index": 0,
            "last_used_provider": None,
            "last_deployed_at": None,
            "deployments_count": 0,
        }

    def _save_state_unlocked(self, state: Dict[str, Any]):
        """Saves state dictionary without locking (called from within a locked context)."""
        try:
            self._state_file.parent.mkdir(parents=True, exist_ok=True)
            temp_file = self._state_file.with_suffix(".tmp")
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(state, f, indent=2)
            temp_file.replace(self._state_file)
        except Exception as e:
            logger.warning("Could not write deployment state: %s", e)

    def _load_state(self) -> Dict[str, Any]:
        """Loads persistent round-robin rotation state from disk with thread-safety."""
        with self._lock:
            return self._load_state_unlocked()

    def _save_state(self, state: Dict[str, Any]):
        """Persists rotation state to disk with atomic write and thread-safety."""
        with self._lock:
            self._save_state_unlocked(state)

    def _record_successful_deployment(self, provider_name: str, index: int = 0):
        """Atomically records a successful deployment and updates state."""
        with self._lock:
            state = self._load_state_unlocked()
            state["deployments_count"] = state.get("deployments_count", 0) + 1
            state["last_used_provider"] = provider_name
            state["last_deployed_at"] = datetime.now(timezone.utc).isoformat()
            if ROUND_ROBIN_ORDER:
                state["current_index"] = (index + 1) % len(ROUND_ROBIN_ORDER)
            self._save_state_unlocked(state)

    def _resolve_site_dir_and_business_id(self, target: Union[str, Path]) -> tuple[Path, str]:
        """Resolves target input argument to a valid generated project directory and business ID."""
        path = Path(target)
        if path.is_file() and path.name == "deployment.json":
            path = path.parent
        elif path.is_file() and path.name == "site-data.json":
            path = path.parent

        if path.exists() and path.is_dir():
            return path.resolve(), path.name

        # Check inside GENERATED_DIR
        candidate = GENERATED_DIR / str(target)
        if candidate.exists() and candidate.is_dir():
            return candidate.resolve(), candidate.name

        raise FileNotFoundError(f"Generated Next.js project directory not found for target: '{target}'")

    def deploy(
        self,
        target: Union[str, Path, DeploymentRequest],
        provider_override: Optional[str] = None,
    ) -> DeploymentResult:
        """
        Executes deployment using round-robin provider selection with automatic fallback.
        
        Args:
            target: Path to generated/<business-id>, business ID slug, or DeploymentRequest.
            provider_override: Optional manual provider override.
            
        Returns:
            DeploymentResult contract.
        """
        if isinstance(target, DeploymentRequest):
            request = target
            site_dir = Path(request.site_dir)
            business_id = request.business_id
        else:
            site_dir, business_id = self._resolve_site_dir_and_business_id(target)
            request = DeploymentRequest(
                business_id=business_id,
                site_dir=str(site_dir),
                provider=provider_override,
            )

        # Check explicit provider override or DEPLOY_PROVIDER env var
        chosen_provider = provider_override or request.provider or os.environ.get("DEPLOY_PROVIDER")

        if chosen_provider:
            provider_inst = self.get_provider(chosen_provider)
            if not provider_inst:
                raise ValueError(f"Unknown deployment provider: '{chosen_provider}'")

            logger.info("Executing deployment with requested provider: '%s'", chosen_provider)
            result = provider_inst.deploy(site_dir, request)
            if result.status == "success":
                self._record_successful_deployment(chosen_provider, 0)
            self._save_deployment_json(site_dir, result)
            return result

        # -------------------------------------------------------------
        # Round-Robin Rotation with Automatic Fallback
        # -------------------------------------------------------------
        state = self._load_state()
        current_idx = state.get("current_index", 0) % len(ROUND_ROBIN_ORDER)

        attempted = []
        warnings = []
        successful_result: Optional[DeploymentResult] = None

        total_providers = len(ROUND_ROBIN_ORDER)
        for offset in range(total_providers):
            idx = (current_idx + offset) % total_providers
            provider_name = ROUND_ROBIN_ORDER[idx]
            provider_inst = self.get_provider(provider_name)
            if not provider_inst:
                continue

            attempted.append(provider_name)
            status = provider_inst.is_available()

            if not status.is_configured:
                logger.debug(
                    "Provider '%s' is not configured (%s), skipping to next...",
                    provider_name,
                    ", ".join(status.missing_credentials),
                )
                warnings.append(f"Skipped unconfigured provider '{provider_name}'")
                continue

            logger.info("Round-robin selected provider: '%s'. Attempting deployment...", provider_name)
            try:
                res = provider_inst.deploy(site_dir, request)
                if res.status == "success":
                    logger.info("Deployment succeeded on provider '%s' -> %s", provider_name, res.url)
                    successful_result = res
                    self._record_successful_deployment(provider_name, idx)
                    break
                else:
                    logger.warning("Provider '%s' deployment returned failure: %s. Trying next provider...", provider_name, res.error)
                    warnings.append(f"Provider '{provider_name}' failed: {res.error}")
            except Exception as ex:
                logger.warning("Provider '%s' threw exception: %s. Trying next provider...", provider_name, ex)
                warnings.append(f"Provider '{provider_name}' error: {ex}")

        # Fallback to Mock Provider ONLY if explicitly permitted or requested
        if not successful_result:
            allow_mock = (request.provider == "mock") or getattr(request, "allow_mock_fallback", False)
            if allow_mock:
                logger.info("All configured cloud providers were skipped or failed; using Mock Provider fallback (explicitly permitted).")
                mock_inst = self.get_provider("mock")
                if mock_inst:
                    successful_result = mock_inst.deploy(site_dir, request)
                    successful_result.warnings.extend(warnings)
                    if successful_result.status == "success":
                        self._record_successful_deployment("mock", 0)
            else:
                err_summary = "; ".join(warnings) if warnings else "All deployment providers failed or were unconfigured."
                logger.error("Deployment failed across all providers: %s (silent mock fallback disabled)", err_summary)
                successful_result = DeploymentResult(
                    business_id=business_id,
                    provider="none",
                    url="",
                    status="failed",
                    duration_seconds=0.0,
                    warnings=warnings,
                    error=f"Deployment failed: {err_summary}",
                )

        self._save_deployment_json(site_dir, successful_result)
        return successful_result

    def _save_deployment_json(self, site_dir: Path, result: DeploymentResult):
        """Saves deployment.json inside the generated business project directory with atomic write."""
        dest = site_dir / "deployment.json"
        temp_file = site_dir / "deployment.json.tmp"
        try:
            site_dir.mkdir(parents=True, exist_ok=True)
            with open(temp_file, "w", encoding="utf-8") as f:
                f.write(result.model_dump_json(indent=2))
            temp_file.replace(dest)
            logger.info("Saved deployment record to %s", dest)
        except Exception as e:
            logger.error("Could not write deployment.json: %s", e)


