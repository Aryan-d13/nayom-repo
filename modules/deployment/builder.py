import os
import shutil
import logging
import subprocess
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


def ensure_static_build(site_dir: Path, timeout: int = 180) -> Path:
    """
    Ensures a static HTML export directory ('out/') is generated for static hosting platforms
    (such as GitHub Pages, Firebase Hosting, or Cloudflare direct upload).
    
    If 'out/' does not exist, updates next.config.mjs to enable static export and runs the build.
    """
    out_dir = site_dir / "out"
    if out_dir.exists() and any(out_dir.iterdir()):
        logger.info("Found existing static build output at %s", out_dir)
        return out_dir

    logger.info("Generating static export for project at %s ...", site_dir)

    # 1. Check if node_modules exists, otherwise install dependencies
    node_modules = site_dir / "node_modules"
    if not node_modules.exists():
        logger.info("Installing project dependencies in %s ...", site_dir)
        try:
            # Try pnpm or npm
            pkg_mgr = "pnpm" if shutil.which("pnpm") else "npm"
            subprocess.run(
                [pkg_mgr, "install"],
                cwd=str(site_dir),
                check=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                shell=True,
                timeout=timeout,
            )
        except Exception as e:
            logger.warning("Dependency install error (will attempt build anyway): %s", e)

    # 2. Ensure next.config.mjs has output: 'export'
    next_config = site_dir / "next.config.mjs"
    if next_config.exists():
        try:
            content = next_config.read_text(encoding="utf-8")
            if "output:" not in content and "'export'" not in content:
                # Add output: 'export'
                updated = content.replace(
                    "reactStrictMode: true,",
                    "reactStrictMode: true,\n  output: 'export',",
                )
                if updated == content:
                    # Generic insertion
                    updated = "const nextConfig = {\n  output: 'export',\n  reactStrictMode: true,\n};\nexport default nextConfig;\n"
                next_config.write_text(updated, encoding="utf-8")
                logger.info("Configured output: 'export' in next.config.mjs")
        except Exception as ex:
            logger.warning("Could not patch next.config.mjs: %s", ex)

    # 3. Run build command
    try:
        pkg_mgr = "pnpm" if shutil.which("pnpm") else "npm"
        proc = subprocess.run(
            [pkg_mgr, "run", "build"],
            cwd=str(site_dir),
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            shell=True,
            timeout=timeout,
        )
        logger.info("Static build succeeded for %s", site_dir.name)
    except subprocess.CalledProcessError as cpe:
        logger.error("Build failed: %s\nStdout: %s\nStderr: %s", cpe, cpe.stdout, cpe.stderr)
        raise RuntimeError(f"Next.js build failed: {cpe.stderr or cpe.stdout or str(cpe)}")
    except Exception as ex:
        logger.error("Failed to execute build: %s", ex)
        raise RuntimeError(f"Failed to execute build: {ex}")

    if not out_dir.exists():
        # Fallback to .next or create out/ with basic index.html if export mode differed
        dot_next = site_dir / ".next"
        if dot_next.exists():
            return dot_next
        raise FileNotFoundError(f"Expected output directory not found at {out_dir}")

    return out_dir
