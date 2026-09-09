"""Multi-Provider Deployment module for Nayom-Automation."""
from .base import DeploymentProvider
from .manager import DeploymentManager, ROUND_ROBIN_ORDER
from .builder import ensure_static_build
from .providers.vercel import VercelProvider
from .providers.cloudflare import CloudflarePagesProvider
from .providers.netlify import NetlifyProvider
from .providers.github_pages import GitHubPagesProvider
from .providers.render import RenderProvider
from .providers.firebase import FirebaseHostingProvider
from .providers.mock import MockDeploymentProvider

__all__ = [
    "DeploymentProvider",
    "DeploymentManager",
    "ROUND_ROBIN_ORDER",
    "ensure_static_build",
    "VercelProvider",
    "CloudflarePagesProvider",
    "NetlifyProvider",
    "GitHubPagesProvider",
    "RenderProvider",
    "FirebaseHostingProvider",
    "MockDeploymentProvider",
]
