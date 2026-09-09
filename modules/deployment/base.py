import abc
import logging
from pathlib import Path
from typing import Optional, List

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus

logger = logging.getLogger(__name__)


class DeploymentProvider(abc.ABC):
    """
    Abstract base class for all deployment hosting providers.
    
    Each provider encapsulates all authentication, CLI execution, API calls,
    and platform-specific deployment mechanics.
    """

    @property
    @abc.abstractmethod
    def provider_name(self) -> str:
        """Unique provider identifier (e.g. 'vercel', 'cloudflare', 'netlify')."""
        pass

    @abc.abstractmethod
    def is_available(self) -> ProviderStatus:
        """
        Checks whether the provider has the required environment credentials
        or CLI tools configured.
        """
        pass

    @abc.abstractmethod
    def deploy(self, site_dir: Path, request: DeploymentRequest) -> DeploymentResult:
        """
        Executes deployment of the Next.js site to the hosting platform.
        
        Args:
            site_dir: Path to the generated Next.js project directory.
            request: Standardized DeploymentRequest contract.
            
        Returns:
            DeploymentResult containing deployment URL, status, and metadata.
        """
        pass
