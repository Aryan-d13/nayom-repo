import unittest
import tempfile
import json
import shutil
from pathlib import Path
from unittest.mock import patch, MagicMock

from config.settings import TEMPLATES_DIR
from contracts.template import (
    NayomTemplateManifest,
    TemplateInspectionResult,
    TemplateImportResult,
)
from modules.template_registry import TemplateRegistry, TemplateValidator, TemplateImporter


def create_sample_nextjs_source(
    base_dir: Path,
    manifest_data: dict,
    include_slots: bool = True,
    include_site_data: bool = True,
    include_app: bool = True,
    include_pkg: bool = True,
) -> Path:
    """Creates a standalone Next.js template directory for testing imports."""
    tpl_dir = base_dir / "sample_source"
    tpl_dir.mkdir(parents=True, exist_ok=True)

    # 1. nayom.template.json
    with open(tpl_dir / "nayom.template.json", "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    # 2. package.json
    if include_pkg:
        pkg = {
            "name": manifest_data.get("id", "sample-tpl"),
            "version": "1.0.0",
            "dependencies": {
                "next": "14.2.3",
                "react": "^18",
                "react-dom": "^18",
                "lucide-react": "^0.378.0",
            },
        }
        with open(tpl_dir / "package.json", "w", encoding="utf-8") as f:
            json.dump(pkg, f, indent=2)

    # 3. app/page.tsx
    if include_app:
        app_dir = tpl_dir / "app"
        app_dir.mkdir(parents=True, exist_ok=True)
        with open(app_dir / "page.tsx", "w", encoding="utf-8") as f:
            f.write("export default function Page() { return <main><h1>Sample</h1></main>; }")
        with open(app_dir / "layout.tsx", "w", encoding="utf-8") as f:
            f.write("export default function Layout({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html>; }")

    # 4. components/
    comp_dir = tpl_dir / "components"
    comp_dir.mkdir(parents=True, exist_ok=True)
    with open(comp_dir / "HeroSection.tsx", "w", encoding="utf-8") as f:
        f.write("export const HeroSection = () => <section>Hero</section>;")
    with open(comp_dir / "PricingSection.tsx", "w", encoding="utf-8") as f:
        f.write("export const PricingSection = () => <section>Pricing</section>;")
    with open(comp_dir / "Testimonials.tsx", "w", encoding="utf-8") as f:
        f.write("export const Testimonials = () => <section>Testimonials</section>;")

    # 5. slots.json (optional)
    if include_slots:
        with open(tpl_dir / "slots.json", "w", encoding="utf-8") as f:
            json.dump({"site.name": "business_identity.business_name"}, f, indent=2)

    # 6. site-data.json (optional)
    if include_site_data:
        with open(tpl_dir / "site-data.json", "w", encoding="utf-8") as f:
            json.dump({"site": {"name": "Sample Practice"}}, f, indent=2)

    return tpl_dir


class TestTemplateImporter(unittest.TestCase):

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.templates_root = Path(self.tmp_dir.name) / "templates"
        self.templates_root.mkdir(parents=True, exist_ok=True)

        self.registry = TemplateRegistry(templates_dir=self.templates_root)
        self.importer = TemplateImporter(templates_dir=self.templates_root, registry=self.registry)

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_inspect_valid_template(self):
        """Verify inspect correctly parses nayom.template.json and detects framework features."""
        manifest = {
            "id": "dental-023",
            "name": "Modern Dental Practice",
            "version": "1.0.0",
            "description": "Premium modern dental practice",
            "industry": ["dental", "healthcare"],
            "categories": ["dentist"],
            "styles": ["minimal", "premium", "light"],
            "layouts": ["hero-services-testimonials-contact"],
            "features": ["booking", "testimonials", "pricing", "contact"],
            "entrypoint": "app/page.tsx",
            "slots": {
                "hero.title": "string",
                "services": "service[]",
            },
        }

        source_path = create_sample_nextjs_source(Path(self.tmp_dir.name), manifest)
        inspection = self.importer.inspect(str(source_path))

        self.assertTrue(inspection.is_valid_source)
        self.assertTrue(inspection.manifest_found)
        self.assertTrue(inspection.manifest_valid)
        self.assertEqual(inspection.manifest.id, "dental-023")
        self.assertTrue(inspection.is_nextjs)
        self.assertTrue(inspection.entrypoint_found)
        self.assertIn("HeroSection", inspection.detected_components)
        self.assertIn("PricingSection", inspection.detected_components)
        self.assertIn("pricing", inspection.detected_features)
        self.assertTrue(inspection.ready_to_import)

    def test_inspect_missing_manifest(self):
        """Verify inspect reports missing manifest and ready_to_import=False."""
        plain_dir = Path(self.tmp_dir.name) / "plain_dir"
        plain_dir.mkdir()

        inspection = self.importer.inspect(str(plain_dir))
        self.assertFalse(inspection.manifest_found)
        self.assertFalse(inspection.manifest_valid)
        self.assertFalse(inspection.ready_to_import)
        self.assertIn("Missing required manifest file: nayom.template.json", inspection.detected_issues)

    def test_local_template_import_success(self):
        """Verify importing a local template copies files, generates metadata.json, and rebuilds registry."""
        manifest = {
            "id": "dental-023",
            "name": "Modern Dental Practice",
            "version": "1.0.0",
            "description": "Premium dental clinic template",
            "industry": ["dental"],
            "categories": ["dentist", "healthcare"],
            "styles": ["clean", "bright", "modern"],
            "layouts": ["single_page_anchor_flow"],
            "features": ["booking", "pricing", "testimonials"],
            "entrypoint": "app/page.tsx",
            "slots": {
                "hero.title": "string",
                "contact.phone": "string",
            },
        }

        source_path = create_sample_nextjs_source(Path(self.tmp_dir.name), manifest)
        res = self.importer.import_template(str(source_path))

        self.assertTrue(res.is_success)
        self.assertEqual(res.template_id, "dental-023")
        
        target_dir = Path(res.target_dir)
        self.assertTrue(target_dir.exists())
        self.assertTrue((target_dir / "nayom.template.json").exists())
        self.assertTrue((target_dir / "metadata.json").exists())
        self.assertTrue((target_dir / "slots.json").exists())
        self.assertTrue((target_dir / "site-data.json").exists())
        self.assertTrue((target_dir / "app" / "page.tsx").exists())

        # Verify discovered in registry
        registered = self.registry.get_template("dental-023")
        self.assertIsNotNone(registered)
        self.assertEqual(registered.name, "Modern Dental Practice")
        self.assertTrue(registered.is_runnable)
        self.assertTrue(registered.is_valid)

    def test_duplicate_id_protection_and_force_flag(self):
        """Verify importer rejects duplicate ID collision unless force=True."""
        manifest = {
            "id": "duplicate-test",
            "name": "First Instance",
            "industry": ["saas"],
            "styles": ["dark"],
            "layouts": ["bento_grid"],
            "features": ["auth"],
            "entrypoint": "app/page.tsx",
        }

        source_path = create_sample_nextjs_source(Path(self.tmp_dir.name), manifest)
        
        # 1. First import succeeds
        res1 = self.importer.import_template(str(source_path))
        self.assertTrue(res1.is_success)

        # 2. Second import without force fails
        res2 = self.importer.import_template(str(source_path), force=False)
        self.assertFalse(res2.is_success)
        self.assertIn("already exists in registry", res2.errors[0])

        # 3. Second import with force succeeds
        res3 = self.importer.import_template(str(source_path), force=True)
        self.assertTrue(res3.is_success)

    def test_non_interactive_missing_manifest_fails(self):
        """Verify non-interactive mode rejects missing manifest with clear error."""
        empty_dir = Path(self.tmp_dir.name) / "no_manifest"
        empty_dir.mkdir()

        res = self.importer.import_template(str(empty_dir), non_interactive=True)
        self.assertFalse(res.is_success)
        self.assertIn("nayom.template.json is missing in source", res.errors[0])

    def test_validation_failure_triggers_rollback(self):
        """Verify if a template fails Next.js structure validation, the target directory is deleted (clean rollback)."""
        manifest = {
            "id": "broken-template",
            "name": "Broken Template",
            "industry": ["realestate"],
            "styles": ["luxury"],
            "layouts": ["grid"],
            "features": ["gallery"],
            "entrypoint": "app/page.tsx",
        }

        # Create source missing package.json and app/page.tsx (causes validation failure)
        broken_source = create_sample_nextjs_source(
            Path(self.tmp_dir.name),
            manifest,
            include_app=False,
            include_pkg=False,
        )

        res = self.importer.import_template(str(broken_source))
        self.assertFalse(res.is_success)
        self.assertGreaterEqual(len(res.errors), 1)

        # Target directory should have been rolled back and removed
        expected_target = self.templates_root / "realestate" / "broken-template"
        self.assertFalse(expected_target.exists(), "Target directory was not rolled back after validation failure")

    @patch("subprocess.run")
    def test_github_repository_import(self, mock_subproc):
        """Verify remote Git repository clone and import workflow."""
        mock_subproc.return_value = MagicMock(returncode=0, stdout="", stderr="")

        manifest = {
            "id": "github-saas-01",
            "name": "Cloud SaaS Landing",
            "industry": ["saas"],
            "styles": ["minimal"],
            "layouts": ["split_hero"],
            "features": ["pricing"],
            "entrypoint": "app/page.tsx",
        }

        # Setup dummy clone behavior by writing files when git clone is called
        def fake_git_clone(cmd, **kwargs):
            dest_dir = Path(cmd[5])
            sample_dir = create_sample_nextjs_source(dest_dir.parent, manifest)
            for item in sample_dir.iterdir():
                if item.is_dir():
                    shutil.copytree(item, dest_dir / item.name)
                else:
                    shutil.copy2(item, dest_dir / item.name)
            return MagicMock(returncode=0, stdout="", stderr="")

        mock_subproc.side_effect = fake_git_clone

        res = self.importer.import_template("https://github.com/example/saas-template")
        self.assertTrue(res.is_success)
        self.assertEqual(res.template_id, "github-saas-01")

        # Verify in registry
        tpl = self.registry.get_template("github-saas-01")
        self.assertIsNotNone(tpl)
        self.assertEqual(tpl.name, "Cloud SaaS Landing")


if __name__ == "__main__":
    unittest.main()
