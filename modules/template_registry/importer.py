import os
import json
import shutil
import subprocess
import tempfile
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any, Union

from config.settings import TEMPLATES_DIR
from contracts.template import (
    TemplateMetadata,
    NayomTemplateManifest,
    TemplateInspectionResult,
    TemplateImportResult,
    TemplateValidationResult,
)
from .validator import TemplateValidator
from .registry import TemplateRegistry

logger = logging.getLogger(__name__)


class TemplateImporter:
    """
    Automates the ingestion, validation, and registration of new Next.js website templates.
    
    Principles:
    1. nayom.template.json is the authoritative manifest source of truth for new templates.
    2. Inspects project files only for technical validation and component discovery.
    3. Guarantees safe rollback (zero leftover files) on validation failure.
    4. Prevents duplicate template ID collisions unless explicitly forced.
    5. Rebuilds templates/registry.json index cache upon successful import.
    """

    def __init__(
        self,
        templates_dir: Optional[Union[str, Path]] = None,
        registry: Optional[TemplateRegistry] = None,
        validator: Optional[TemplateValidator] = None,
    ):
        self._templates_dir = Path(templates_dir).resolve() if templates_dir else TEMPLATES_DIR.resolve()
        self._validator = validator or TemplateValidator()
        self._registry = registry or TemplateRegistry(templates_dir=self._templates_dir, validator=self._validator)

    @property
    def registry(self) -> TemplateRegistry:
        return self._registry

    def _is_git_url(self, source: str) -> bool:
        """Determines if source string is a remote Git repository URL."""
        s = source.strip().lower()
        return (
            s.startswith("http://")
            or s.startswith("https://")
            or s.startswith("git@")
            or s.endswith(".git")
            or "github.com" in s
            or "gitlab.com" in s
        )

    def _resolve_source(self, source: str) -> Tuple[Path, Optional[Any], Optional[str]]:
        """
        Resolves local path or clones remote Git URL into a temporary workspace.
        Returns: (source_path, temp_dir_context, error_message)
        """
        source_str = source.strip()
        if self._is_git_url(source_str):
            logger.info("Cloning remote Git repository from: %s", source_str)
            try:
                temp_dir = tempfile.TemporaryDirectory(prefix="nayom_tpl_clone_")
                clone_dest = Path(temp_dir.name)

                # Clone repository with shallow depth
                cmd = ["git", "clone", "--depth", "1", source_str, str(clone_dest)]
                res = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
                if res.returncode != 0:
                    temp_dir.cleanup()
                    return Path("."), None, f"Git clone failed: {res.stderr.strip()}"

                return clone_dest, temp_dir, None
            except FileNotFoundError:
                return Path("."), None, "Git executable not found on system PATH."
            except Exception as e:
                return Path("."), None, f"Failed to clone Git repository: {e}"

        local_path = Path(source_str).resolve()
        if not local_path.exists():
            return local_path, None, f"Source directory does not exist: {local_path}"
        if not local_path.is_dir():
            return local_path, None, f"Source path is not a directory: {local_path}"

        return local_path, None, None

    def _find_manifest_file(self, root_dir: Path) -> Optional[Path]:
        """Locates nayom.template.json or fallback metadata.json in source directory."""
        candidates = [
            root_dir / "nayom.template.json",
            root_dir / "nayom-template.json",
            root_dir / "template.json",
            root_dir / "metadata.json",
        ]
        for c in candidates:
            if c.exists() and c.is_file():
                return c
        return None

    def inspect(self, source: str) -> TemplateInspectionResult:
        """
        Inspects a prospective template folder or Git repo and reports manifest,
        technical framework, entrypoint, components, and readiness status.
        """
        source_path, temp_ctx, error = self._resolve_source(source)
        if error:
            return TemplateInspectionResult(
                source=source,
                is_valid_source=False,
                detected_issues=[error],
                ready_to_import=False,
            )

        try:
            manifest_file = self._find_manifest_file(source_path)
            manifest_found = manifest_file is not None
            manifest_valid = False
            manifest_errors: List[str] = []
            manifest_obj: Optional[NayomTemplateManifest] = None

            if manifest_file:
                try:
                    with open(manifest_file, "r", encoding="utf-8") as f:
                        raw_data = json.load(f)
                    manifest_obj = NayomTemplateManifest.model_validate(raw_data)
                    manifest_valid = True
                except Exception as e:
                    manifest_errors.append(f"Failed to parse manifest ({manifest_file.name}): {e}")

            # Technical Next.js framework inspection
            is_nextjs = False
            framework_ver: Optional[str] = None
            pkg_file = source_path / "package.json"
            if pkg_file.exists():
                try:
                    with open(pkg_file, "r", encoding="utf-8") as f:
                        pkg = json.load(f)
                    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
                    if "next" in deps:
                        is_nextjs = True
                        framework_ver = f"Next.js {deps['next']}"
                    elif "react" in deps:
                        framework_ver = f"React {deps['react']}"
                except Exception:
                    pass

            # Detect entrypoint
            entrypoint_rel = manifest_obj.entrypoint if (manifest_obj and manifest_obj.entrypoint) else "app/page.tsx"
            entrypoint_path = source_path / entrypoint_rel
            entrypoint_found = entrypoint_path.exists()

            if not entrypoint_found:
                # Check standard alternatives
                for candidate in [
                    "src/app/page.tsx",
                    "src/app/page.jsx",
                    "src/app/page.js",
                    "app/page.tsx",
                    "app/page.jsx",
                    "app/page.js",
                    "src/pages/index.tsx",
                    "src/pages/index.jsx",
                    "pages/index.tsx",
                    "pages/index.js",
                ]:
                    if (source_path / candidate).exists():
                        entrypoint_rel = candidate
                        entrypoint_found = True
                        break

            # Detect components
            detected_components: List[str] = []
            comp_dirs = [source_path / "components", source_path / "src" / "components"]
            for cd in comp_dirs:
                if cd.exists() and cd.is_dir():
                    for item in cd.iterdir():
                        if item.is_file() and item.suffix in [".tsx", ".jsx", ".js", ".ts"]:
                            detected_components.append(item.stem)

            # Detect feature clues
            detected_features: List[str] = []
            comp_lower = [c.lower() for c in detected_components]
            feature_keywords = {
                "booking": ["book", "appointment", "schedule"],
                "pricing": ["pricing", "price", "plan", "tier"],
                "testimonials": ["testimonial", "review", "feedback"],
                "faqs": ["faq", "accordion", "question"],
                "contact": ["contact", "reach", "message", "form"],
                "projects": ["project", "portfolio", "case-study", "work"],
                "tech_stack": ["stack", "tech", "skill", "badge"],
                "gallery": ["gallery", "image", "photo"],
            }
            for feat, keywords in feature_keywords.items():
                if any(any(k in c for k in keywords) for c in comp_lower):
                    detected_features.append(feat)

            detected_issues: List[str] = []
            if not manifest_found:
                detected_issues.append("Missing required manifest file: nayom.template.json")
            elif not manifest_valid:
                detected_issues.extend(manifest_errors)

            if not is_nextjs:
                detected_issues.append("No Next.js dependency declared in package.json")
            if not entrypoint_found:
                detected_issues.append(f"Entrypoint file '{entrypoint_rel}' not found on disk")

            ready_to_import = manifest_valid and is_nextjs and entrypoint_found and len(detected_issues) == 0

            return TemplateInspectionResult(
                source=source,
                is_valid_source=True,
                manifest_found=manifest_found,
                manifest_path=str(manifest_file) if manifest_file else None,
                manifest_valid=manifest_valid,
                manifest_errors=manifest_errors,
                manifest=manifest_obj,
                is_nextjs=is_nextjs,
                framework_version=framework_ver,
                entrypoint_found=entrypoint_found,
                entrypoint_path=entrypoint_rel,
                detected_components=sorted(detected_components),
                detected_features=sorted(detected_features),
                detected_issues=detected_issues,
                ready_to_import=ready_to_import,
            )
        finally:
            if temp_ctx:
                temp_ctx.cleanup()

    def _build_slots_json_scaffold(self, manifest: NayomTemplateManifest) -> Dict[str, str]:
        """Builds standard slots.json mapping based on declared manifest slots."""
        if manifest.slots and isinstance(manifest.slots, dict):
            # If manifest has explicit mapping, use it
            return {k: str(v) for k, v in manifest.slots.items()}
        
        # Standard Nayom slots mapping scaffold
        return {
            "site.name": "business_identity.business_name",
            "site.tagline": "business_identity.tagline",
            "site.niche": "business_identity.industry_category",
            "hero.title": "brand_and_content.hero_headlines[0]",
            "hero.subtitle": "business_identity.description",
            "hero.cta": "calls_to_action[0].text",
            "hero.ctaLink": "calls_to_action[0].destination",
            "about.summary": "business_identity.value_proposition",
            "about.differentiators": "business_identity.key_differentiators",
            "contact.phone": "contact_intelligence.phones[0]",
            "contact.email": "contact_intelligence.emails[0]",
            "contact.address": "contact_intelligence.addresses[0]",
            "contact.location": "contact_intelligence.city",
            "services": "services_and_products",
            "testimonials": "brand_and_content.important_copy_snippets",
            "faqs": "frequently_asked_questions",
            "socialLinks": "contact_intelligence.social_links"
        }

    def _build_site_data_scaffold(self, manifest: NayomTemplateManifest) -> Dict[str, Any]:
        """Builds sample site-data.json payload matching the declared template."""
        return {
            "site": {
                "name": manifest.name,
                "tagline": manifest.description or f"High Performance {manifest.name}",
                "niche": manifest.industries_list[0] if manifest.industries_list else "Professional Services",
            },
            "hero": {
                "title": f"Welcome to {manifest.name}",
                "subtitle": manifest.description or "Delivering exceptional quality, performance, and dedicated service.",
                "cta": "Get In Touch",
                "ctaLink": "#contact",
            },
            "about": {
                "summary": "We provide industry-leading solutions tailored to your operational requirements.",
                "differentiators": ["Quality Assured", "Fast Turnaround", "Dedicated Support"],
            },
            "contact": {
                "phone": "+1 (555) 019-2834",
                "email": f"contact@{manifest.id.replace('-', '')}.com",
                "address": "100 Innovation Way, Suite 400",
                "location": "Austin, TX",
            },
            "services": [
                {
                    "name": "Core Service",
                    "description": "Comprehensive specialized solution engineered for reliable results.",
                    "category": "Primary",
                    "features": ["Feature 1", "Feature 2"],
                }
            ],
            "testimonials": [
                {
                    "quote": f"Working with {manifest.name} delivered outstanding reliability and results.",
                    "author": "Verified Client Review",
                    "rating": 5,
                }
            ],
        }

    def _copy_template_tree(self, source_dir: Path, target_dir: Path, overwrite: bool = False):
        """Copies source files to target directory ignoring build artifacts and cache folders."""
        if target_dir.exists():
            if overwrite:
                def _rm_readonly(fn, path, exc):
                    import stat
                    try:
                        os.chmod(path, stat.S_IWRITE)
                        fn(path)
                    except Exception:
                        pass
                try:
                    shutil.rmtree(target_dir, onexc=lambda fn, p, exc: _rm_readonly(fn, p, exc))
                except TypeError:
                    shutil.rmtree(target_dir, onerror=_rm_readonly)
            else:
                raise FileExistsError(f"Target directory already exists: {target_dir}")

        target_dir.mkdir(parents=True, exist_ok=True)

        ignore_patterns = shutil.ignore_patterns(
            ".git",
            "node_modules",
            ".next",
            "dist",
            ".turbo",
            ".vercel",
            "*.log",
            "*.tmp",
            "__pycache__",
        )

        for item in source_dir.iterdir():
            dest = target_dir / item.name
            if item.is_dir():
                if item.name not in [".git", "node_modules", ".next", "dist", ".turbo", ".vercel", "__pycache__"]:
                    shutil.copytree(item, dest, ignore=ignore_patterns, dirs_exist_ok=True)
            else:
                shutil.copy2(item, dest)

    def import_template(
        self,
        source: str,
        industry_override: Optional[str] = None,
        category_override: Optional[str] = None,
        id_override: Optional[str] = None,
        name_override: Optional[str] = None,
        style_override: Optional[List[str]] = None,
        layout_override: Optional[List[str]] = None,
        features_override: Optional[List[str]] = None,
        non_interactive: bool = False,
        force: bool = False,
    ) -> TemplateImportResult:
        """
        Imports a Next.js template from a local directory or remote Git URL.
        
        Validates nayom.template.json manifest first, copies files, scaffolds
        contracts, runs validator, and automatically rolls back if invalid.
        """
        source_path, temp_ctx, error = self._resolve_source(source)
        if error:
            return TemplateImportResult(
                template_id=id_override or "unknown",
                target_dir="",
                is_success=False,
                errors=[error],
            )

        target_dir: Optional[Path] = None
        try:
            # 1. Locate manifest file
            manifest_file = self._find_manifest_file(source_path)
            raw_manifest: Dict[str, Any] = {}

            if manifest_file:
                try:
                    with open(manifest_file, "r", encoding="utf-8") as f:
                        raw_manifest = json.load(f)
                except Exception as e:
                    return TemplateImportResult(
                        template_id=id_override or "unknown",
                        target_dir="",
                        is_success=False,
                        errors=[f"Could not parse manifest {manifest_file.name}: {e}"],
                    )
            else:
                # Missing manifest
                if non_interactive and not (id_override and (industry_override or category_override)):
                    return TemplateImportResult(
                        template_id=id_override or "unknown",
                        target_dir="",
                        is_success=False,
                        errors=[
                            "nayom.template.json is missing in source. In --non-interactive mode, "
                            "the template must include nayom.template.json or specify --id and --industry flags."
                        ],
                    )

            # Apply overrides to manifest data
            if id_override:
                raw_manifest["id"] = id_override.strip()
            elif not raw_manifest.get("id"):
                raw_manifest["id"] = source_path.name.strip().lower().replace("_", "-")

            if name_override:
                raw_manifest["name"] = name_override.strip()
            elif not raw_manifest.get("name"):
                raw_manifest["name"] = raw_manifest["id"].replace("-", " ").title()

            if industry_override:
                raw_manifest["industry"] = [i.strip() for i in industry_override.split(",") if i.strip()]
            if category_override:
                raw_manifest["categories"] = [c.strip() for c in category_override.split(",") if c.strip()]
            if style_override:
                raw_manifest["styles"] = style_override
            if layout_override:
                raw_manifest["layouts"] = layout_override
            if features_override:
                raw_manifest["features"] = features_override

            # 2. Validate manifest model
            try:
                manifest = NayomTemplateManifest.model_validate(raw_manifest)
            except Exception as e:
                return TemplateImportResult(
                    template_id=str(raw_manifest.get("id", "unknown")),
                    target_dir="",
                    is_success=False,
                    errors=[f"Invalid nayom.template.json manifest: {e}"],
                )

            # Validate non-empty industry / category
            if not manifest.industries_list and not manifest.categories:
                if non_interactive:
                    return TemplateImportResult(
                        template_id=manifest.id,
                        target_dir="",
                        is_success=False,
                        errors=["Manifest must declare at least one 'industry' or 'categories'. Use --industry <name>."],
                    )
                else:
                    manifest.industry = ["generic"]

            # 3. Check duplicate template ID collision
            existing_tpl = self._registry.get_template(manifest.id)
            if existing_tpl and not force:
                return TemplateImportResult(
                    template_id=manifest.id,
                    target_dir=existing_tpl.template_dir or "",
                    is_success=False,
                    errors=[
                        f"Template ID '{manifest.id}' already exists in registry ({existing_tpl.template_dir}). "
                        "Specify a unique --id or use --force to overwrite."
                    ],
                )

            # 4. Determine destination directory: templates/<industry>/<template_id>/
            primary_ind = manifest.industries_list[0] if manifest.industries_list else (
                manifest.categories[0] if manifest.categories else "generic"
            )
            target_dir = self._templates_dir / primary_ind / manifest.id

            logger.info("Importing template '%s' into %s", manifest.id, target_dir)

            # 5. Copy files to target directory
            self._copy_template_tree(source_path, target_dir, overwrite=force)

            # 6. Generate nayom.template.json
            with open(target_dir / "nayom.template.json", "w", encoding="utf-8") as f:
                json.dump(manifest.model_dump(mode="json"), f, indent=2, ensure_ascii=False)

            # 7. Generate standardized metadata.json
            meta_obj = manifest.to_metadata(template_dir=str(target_dir))
            with open(target_dir / "metadata.json", "w", encoding="utf-8") as f:
                json.dump(meta_obj.model_dump(mode="json"), f, indent=2, ensure_ascii=False)

            # 8. Check content layer (adapter vs legacy slots.json)
            has_adapter = (
                (target_dir / "src" / "data" / "adapter.ts").exists()
                or (target_dir / "data" / "adapter.ts").exists()
                or (target_dir / "src" / "data" / "content.ts").exists()
                or (target_dir / "data" / "content.ts").exists()
            )
            slots_file = target_dir / "slots.json"
            if not has_adapter and (not slots_file.exists() or slots_file.stat().st_size == 0):
                slots_content = self._build_slots_json_scaffold(manifest)
                with open(slots_file, "w", encoding="utf-8") as f:
                    json.dump(slots_content, f, indent=2, ensure_ascii=False)

            # 9. Scaffold site-data.json if missing
            site_data_file = target_dir / "site-data.json"
            if not site_data_file.exists() or site_data_file.stat().st_size == 0:
                sample_payload = self._build_site_data_scaffold(manifest)
                with open(site_data_file, "w", encoding="utf-8") as f:
                    json.dump(sample_payload, f, indent=2, ensure_ascii=False)

            # 10. Ensure preview folder exists
            (target_dir / "preview").mkdir(parents=True, exist_ok=True)

            # 11. Run TemplateValidator on target directory
            val_res = self._validator.validate_template_dir(target_dir)

            if not val_res.is_valid:
                # Rollback on validation failure
                logger.warning("Imported template '%s' failed validation. Rolling back target directory.", manifest.id)
                def _rm_readonly(fn, path, exc):
                    import stat
                    try:
                        os.chmod(path, stat.S_IWRITE)
                        fn(path)
                    except Exception:
                        pass
                try:
                    shutil.rmtree(target_dir, onexc=lambda fn, p, exc: _rm_readonly(fn, p, exc))
                except TypeError:
                    shutil.rmtree(target_dir, onerror=_rm_readonly)

                return TemplateImportResult(
                    template_id=manifest.id,
                    target_dir=str(target_dir),
                    is_success=False,
                    manifest=manifest,
                    validation_report=val_res,
                    errors=[f"Template validation failed: {e}" for e in val_res.errors],
                    warnings=val_res.warnings,
                )

            # 12. Success: Rebuild registry index cache
            self._registry.discover_and_rebuild()

            logger.info("Successfully imported and registered template '%s' -> %s", manifest.id, target_dir)
            return TemplateImportResult(
                template_id=manifest.id,
                target_dir=str(target_dir),
                is_success=True,
                manifest=manifest,
                metadata=meta_obj,
                validation_report=val_res,
                warnings=val_res.warnings,
            )

        except Exception as e:
            # Safe rollback on unexpected exception
            if target_dir and target_dir.exists():
                logger.error("Exception during template import (%s). Rolling back %s", e, target_dir)
                try:
                    shutil.rmtree(target_dir)
                except Exception:
                    pass
            return TemplateImportResult(
                template_id=str(raw_manifest.get("id", "unknown")),
                target_dir=str(target_dir) if target_dir else "",
                is_success=False,
                errors=[f"Import failed: {e}"],
            )
        finally:
            if temp_ctx:
                temp_ctx.cleanup()
