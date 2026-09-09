import os
import time
import shutil
import logging
import subprocess
from pathlib import Path
from typing import Optional


from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from ..base import DeploymentProvider
from ..builder import ensure_static_build

logger = logging.getLogger(__name__)


class GitHubPagesProvider(DeploymentProvider):
    """
    GitHub Pages Deployment Provider.
    
    Deploys Next.js static output to the gh-pages branch of a designated GitHub repository.
    """

    def __init__(
        self,
        token: Optional[str] = None,
        repository: Optional[str] = None,
    ):
        self._token = token if token is not None else (os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN"))
        raw_repo = repository if repository is not None else (os.environ.get("GITHUB_REPOSITORY") or os.environ.get("GITHUB_REPO") or "")
        self._repository = raw_repo.replace("https://github.com/", "").replace("http://github.com/", "").strip("/ ")


    @property
    def provider_name(self) -> str:
        return "github_pages"

    def is_available(self) -> ProviderStatus:
        missing = []
        if not self._token:
            missing.append("GITHUB_TOKEN")
        if not self._repository:
            missing.append("GITHUB_REPOSITORY")

        return ProviderStatus(
            provider_name=self.provider_name,
            is_configured=len(missing) == 0,
            missing_credentials=missing,
            description="GitHub Pages static site hosting" if len(missing) == 0 else f"Missing credentials: {', '.join(missing)}",
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
                warnings=[f"GitHub credentials not configured: {', '.join(status.missing_credentials)}"],
                error="Missing GitHub credentials",
            )

        logger.info("Initiating GitHub Pages deployment for '%s' to repo '%s'...", request.business_id, self._repository)

        try:
            build_dir = ensure_static_build(site_dir)

            # Ensure git longpaths is enabled on Windows to prevent path length errors
            try:
                subprocess.run(["git", "config", "core.longpaths", "true"], cwd=str(site_dir), capture_output=True)
                subprocess.run(["git", "config", "--global", "core.longpaths", "true"], capture_output=True)
            except Exception:
                pass

            parts = self._repository.split("/")
            owner = parts[0]
            repo_name = parts[1] if len(parts) > 1 else ""
            subpath = f"/{repo_name}/{request.business_id}".rstrip("/")

            # 1. Create .nojekyll so GitHub Pages does not ignore dotfiles or underscore directories
            (build_dir / ".nojekyll").touch(exist_ok=True)

            # 2. Duplicate _next/ folder as next_static/ to bypass Jekyll underscore filtering completely
            next_dir = build_dir / "_next"
            static_alias_dir = build_dir / "next_static"
            if next_dir.exists():
                if static_alias_dir.exists():
                    shutil.rmtree(static_alias_dir, ignore_errors=True)
                shutil.copytree(next_dir, static_alias_dir)

            # 3. Rewrite all /_next/ asset paths in HTML to subpath /next_static/
            for html_file in build_dir.rglob("*.html"):
                try:
                    content = html_file.read_text(encoding="utf-8")
                    content = content.replace(f"{subpath}/_next/", f"{subpath}/next_static/")
                    content = content.replace('"/_next/', f'"{subpath}/next_static/')
                    content = content.replace("'/_next/", f"'{subpath}/next_static/")
                    content = content.replace('href="/_next/', f'href="{subpath}/next_static/')
                    content = content.replace('src="/_next/', f'src="{subpath}/next_static/')
                    content = content.replace('href="/favicon', f'href="{subpath}/favicon')
                    html_file.write_text(content, encoding="utf-8")
                except Exception as ex:
                    logger.debug("Could not patch HTML asset paths in %s: %s", html_file, ex)

            # 4. Patch JS chunk files for subpath asset loader
            for js_file in build_dir.rglob("*.js"):
                try:
                    content = js_file.read_text(encoding="utf-8")
                    if "_next" in content:
                        content = content.replace(f"{subpath}/_next/", f"{subpath}/next_static/")
                        content = content.replace('"/_next/', f'"{subpath}/next_static/')
                        content = content.replace("'/_next/", f"'{subpath}/next_static/")
                        js_file.write_text(content, encoding="utf-8")
                except Exception:
                    pass

            # Authenticated git remote repo URL
            repo_url = f"https://x-access-token:{self._token}@github.com/{self._repository}.git"



            # Use npx gh-pages -d out --repo <repo_url>
            cmd = [
                "npx",
                "-y",
                "gh-pages",
                "-d",
                str(build_dir),
                "--repo",
                repo_url,
                "-m",
                f"Deploy {request.business_id} via Nayom Automation",
                "--dest",
                request.business_id,
                "--dotfiles",
            ]


            proc = subprocess.run(
                cmd,
                cwd=str(site_dir),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                shell=True,
                timeout=300,
            )

            stdout = (proc.stdout or "").strip()
            stderr = (proc.stderr or "").strip()

            if proc.returncode != 0:
                logger.error("GitHub Pages deployment failed: %s\nStderr: %s", stdout, stderr)
                return DeploymentResult(
                    business_id=request.business_id,
                    provider=self.provider_name,
                    url="",
                    status="failed",
                    duration_seconds=round(time.time() - start_time, 2),
                    error=stderr or stdout or "gh-pages deployment failed",
                )

            # Construct GitHub Pages URL
            parts = self._repository.split("/")
            owner = parts[0]
            repo_name = parts[1] if len(parts) > 1 else ""
            live_url = f"https://{owner}.github.io/{repo_name}/{request.business_id}/"

            duration = round(time.time() - start_time, 2)
            logger.info("GitHub Pages deployment succeeded: %s (duration: %.2fs)", live_url, duration)

            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                deployment_id=f"gh-pages-{request.business_id}",
                url=live_url,
                status="success",
                duration_seconds=duration,
            )

        except Exception as ex:
            logger.error("GitHub Pages deployment error: %s", ex)
            return DeploymentResult(
                business_id=request.business_id,
                provider=self.provider_name,
                url="",
                status="failed",
                duration_seconds=round(time.time() - start_time, 2),
                error=str(ex),
            )
