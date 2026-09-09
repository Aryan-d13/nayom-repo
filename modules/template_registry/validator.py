import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple, Any

from contracts.template import TemplateMetadata, TemplateValidationResult

logger = logging.getLogger(__name__)


class TemplateValidator:
    """
    Validates Next.js website templates against the standard Nayom Template Contract.
    
    Checks for:
    1. Required core files (metadata.json, slots.json, site-data.json, package.json, entrypoint)
    2. Valid metadata.json schema and required fields
    3. Valid slots.json format and slot definitions
    4. Valid Next.js application structure (package.json, app/ or pages/, components/)
    5. Slot consistency across metadata.json and slots.json
    6. Unique template IDs
    """

    REQUIRED_METADATA_FIELDS = [
        "id",
        "name",
        "version",
        "description",
        "categories",
        "style_keywords",
        "layout_patterns",
        "supported_features",
        "supported_slots",
        "entrypoint",
    ]

    REQUIRED_TEMPLATE_FILES = [
        "metadata.json",
        "slots.json",
        "site-data.json",
        "package.json",
    ]

    def validate_template_dir(
        self,
        template_dir: Path,
        registered_ids: Optional[Set[str]] = None,
    ) -> TemplateValidationResult:
        """
        Validates a single template directory against the standardized contract.
        
        Args:
            template_dir: Path to template directory.
            registered_ids: Optional set of already registered template IDs to detect duplicates.
            
        Returns:
            TemplateValidationResult with boolean status, checks passed, errors, and warnings.
        """
        template_dir = Path(template_dir).resolve()
        errors: List[str] = []
        warnings: List[str] = []
        checks_passed: List[str] = []
        metadata_obj: Optional[TemplateMetadata] = None
        is_runnable = True

        if not template_dir.exists() or not template_dir.is_dir():
            return TemplateValidationResult(
                template_id=template_dir.name,
                template_dir=str(template_dir),
                is_valid=False,
                is_runnable=False,
                errors=[f"Template directory does not exist or is not a directory: {template_dir}"],
            )

        # Check 1: metadata.json existence & parsing
        meta_path = template_dir / "metadata.json"
        if not meta_path.exists():
            # Check v1 fallback
            if (template_dir / "v1" / "metadata.json").exists():
                meta_path = template_dir / "v1" / "metadata.json"
            else:
                return TemplateValidationResult(
                    template_id=template_dir.name,
                    template_dir=str(template_dir),
                    is_valid=False,
                    is_runnable=False,
                    errors=["Missing required file: metadata.json"],
                )

        raw_meta: Dict[str, Any] = {}
        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                raw_meta = json.load(f)
            checks_passed.append("metadata_json_parsed")
        except Exception as e:
            errors.append(f"metadata.json is not valid JSON: {e}")

        # Extract template ID
        template_id = str(raw_meta.get("id") or template_dir.name).strip()

        # Check 2: Unique template ID
        if registered_ids is not None:
            if template_id in registered_ids:
                errors.append(f"Duplicate template ID '{template_id}' found in {template_dir}")
            else:
                checks_passed.append("unique_template_id")

        # Check 3: Required metadata.json fields
        if raw_meta:
            # Build Pydantic model to test schema conformity
            try:
                raw_meta["template_dir"] = str(template_dir)
                metadata_obj = TemplateMetadata.model_validate(raw_meta)
                checks_passed.append("metadata_schema_valid")

                # Verify individual required fields are populated
                if not metadata_obj.name:
                    errors.append("metadata.json 'name' field cannot be empty")
                if not metadata_obj.description:
                    warnings.append("metadata.json 'description' field is empty")
                if not metadata_obj.categories and not metadata_obj.industries:
                    warnings.append("metadata.json has no 'categories' or 'industries' specified")
                if not metadata_obj.style_keywords:
                    warnings.append("metadata.json has no 'style_keywords' specified")
                if not metadata_obj.layout_patterns:
                    warnings.append("metadata.json has no 'layout_patterns' specified")

            except Exception as e:
                errors.append(f"metadata.json failed schema validation: {e}")

        # Check 4: slots.json existence & parsing
        slots_path = template_dir / "slots.json"
        raw_slots: Dict[str, Any] = {}
        if slots_path.exists():
            try:
                with open(slots_path, "r", encoding="utf-8") as f:
                    raw_slots = json.load(f)
                checks_passed.append("slots_json_parsed")
            except Exception as e:
                errors.append(f"slots.json is not valid JSON: {e}")
        else:
            errors.append("Missing required file: slots.json")
            is_runnable = False

        # Check 5: site-data.json existence & parsing
        site_data_path = template_dir / "site-data.json"
        if site_data_path.exists():
            try:
                with open(site_data_path, "r", encoding="utf-8") as f:
                    json.load(f)
                checks_passed.append("site_data_json_parsed")
            except Exception as e:
                warnings.append(f"site-data.json is not valid JSON: {e}")
        else:
            warnings.append("Missing recommended file: site-data.json (used as sample template payload)")

        # Check 6: Slot consistency between slots.json and metadata.json
        if raw_slots and metadata_obj and metadata_obj.supported_slots:
            slot_keys = set(raw_slots.keys())
            declared_slots = set(metadata_obj.supported_slots)
            missing_declared = slot_keys - declared_slots
            if missing_declared:
                warnings.append(f"slots.json contains slots not declared in metadata.json: {sorted(list(missing_declared))}")
            checks_passed.append("slots_consistency_checked")

        # Check 7: Next.js Structure & Package Manifest
        pkg_path = template_dir / "package.json"
        if pkg_path.exists():
            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    pkg_data = json.load(f)
                deps = {**pkg_data.get("dependencies", {}), **pkg_data.get("devDependencies", {})}
                if "next" not in deps and "react" not in deps:
                    warnings.append("package.json does not declare 'next' or 'react' dependencies")
                checks_passed.append("package_json_valid")
            except Exception as e:
                errors.append(f"package.json is not valid JSON: {e}")
                is_runnable = False
        else:
            errors.append("Missing required file: package.json (Next.js project descriptor)")
            is_runnable = False

        # Check 8: Entrypoint & App/Pages directory
        entrypoint_rel = metadata_obj.entrypoint if metadata_obj else "app/page.tsx"
        entry_path = template_dir / entrypoint_rel
        has_app_dir = (template_dir / "app").is_dir()
        has_pages_dir = (template_dir / "pages").is_dir()

        if not has_app_dir and not has_pages_dir:
            errors.append("Missing Next.js application directory (expected 'app/' or 'pages/')")
            is_runnable = False
        else:
            checks_passed.append("nextjs_app_directory_present")

        if not entry_path.exists():
            # Check for alternative extensions (.tsx, .jsx, .js, .ts)
            alt_candidates = [
                template_dir / "app" / "page.tsx",
                template_dir / "app" / "page.jsx",
                template_dir / "app" / "page.js",
                template_dir / "pages" / "index.tsx",
                template_dir / "pages" / "index.jsx",
            ]
            if not any(c.exists() for c in alt_candidates):
                errors.append(f"Entrypoint file not found: {entrypoint_rel}")
                is_runnable = False
            else:
                checks_passed.append("nextjs_entrypoint_present")
        else:
            checks_passed.append("nextjs_entrypoint_present")

        # Check 9: Optional components & preview folders
        if not (template_dir / "components").is_dir():
            warnings.append("No 'components/' directory found (recommended for modular React structure)")
        else:
            checks_passed.append("components_directory_present")

        if (template_dir / "preview").is_dir():
            checks_passed.append("preview_directory_present")

        is_valid = len(errors) == 0

        # Update metadata object with validation results
        if metadata_obj:
            metadata_obj.is_valid = is_valid
            metadata_obj.is_runnable = is_runnable
            metadata_obj.validation_errors = errors
            metadata_obj.validation_warnings = warnings

        return TemplateValidationResult(
            template_id=template_id,
            template_dir=str(template_dir),
            is_valid=is_valid,
            is_runnable=is_runnable,
            checks_passed=checks_passed,
            errors=errors,
            warnings=warnings,
            metadata=metadata_obj,
        )

    def validate_all(
        self,
        template_dirs: List[Path],
    ) -> List[TemplateValidationResult]:
        """Validates all given template directories ensuring no ID collisions."""
        results: List[TemplateValidationResult] = []
        registered_ids: Set[str] = set()

        for t_dir in sorted(template_dirs, key=lambda p: str(p)):
            res = self.validate_template_dir(t_dir, registered_ids=registered_ids)
            if res.template_id:
                registered_ids.add(res.template_id)
            results.append(res)

        return results
