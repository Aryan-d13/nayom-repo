import unittest
import json
import tempfile
from pathlib import Path

from contracts.deployment import DeploymentRequest, DeploymentResult, ProviderStatus
from modules.deployment import (
    DeploymentManager,
    DeploymentProvider,
    ROUND_ROBIN_ORDER,
    VercelProvider,
    CloudflarePagesProvider,
    NetlifyProvider,
    GitHubPagesProvider,
    RenderProvider,
    FirebaseHostingProvider,
    MockDeploymentProvider,
)


class DummyCustomProvider(DeploymentProvider):
    def __init__(self, name: str, should_fail: bool = False, configured: bool = True):
        self._name = name
        self._should_fail = should_fail
        self._configured = configured

    @property
    def provider_name(self) -> str:
        return self._name

    def is_available(self) -> ProviderStatus:
        return ProviderStatus(
            provider_name=self._name,
            is_configured=self._configured,
            missing_credentials=[] if self._configured else ["DUMMY_KEY"],
            description=f"Dummy provider {self._name}",
        )

    def deploy(self, site_dir: Path, request: DeploymentRequest) -> DeploymentResult:
        if self._should_fail:
            return DeploymentResult(
                business_id=request.business_id,
                provider=self._name,
                url="",
                status="failed",
                duration_seconds=0.1,
                error=f"{self._name} simulated failure",
            )

        return DeploymentResult(
            business_id=request.business_id,
            provider=self._name,
            deployment_id=f"{self._name}-123",
            url=f"https://{request.business_id}.{self._name}.example.com",
            status="success",
            duration_seconds=0.1,
        )


class TestDeploymentModule(unittest.TestCase):

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.site_dir = Path(self.tmp_dir.name) / "test_site"
        self.site_dir.mkdir()
        (self.site_dir / "site-data.json").write_text(json.dumps({"site": {"name": "Test"}}), encoding="utf-8")
        self.state_file = Path(self.tmp_dir.name) / "test_state.json"

    def tearDown(self):
        self.tmp_dir.cleanup()

    def test_provider_availability_and_credential_detection(self):
        # 1. Vercel with empty token should report missing VERCEL_TOKEN
        vercel = VercelProvider(token="")
        st_v = vercel.is_available()
        self.assertFalse(st_v.is_configured)
        self.assertIn("VERCEL_TOKEN", st_v.missing_credentials)

        # 2. Cloudflare with missing tokens
        cf = CloudflarePagesProvider(api_token="", account_id="")
        st_cf = cf.is_available()
        self.assertFalse(st_cf.is_configured)
        self.assertIn("CLOUDFLARE_API_TOKEN", st_cf.missing_credentials)
        self.assertIn("CLOUDFLARE_ACCOUNT_ID", st_cf.missing_credentials)

        # 3. Netlify
        netlify = NetlifyProvider(auth_token="")
        st_net = netlify.is_available()
        self.assertFalse(st_net.is_configured)
        self.assertIn("NETLIFY_AUTH_TOKEN", st_net.missing_credentials)

        # 4. GitHub Pages
        gh = GitHubPagesProvider(token="", repository="")
        st_gh = gh.is_available()
        self.assertFalse(st_gh.is_configured)
        self.assertIn("GITHUB_TOKEN", st_gh.missing_credentials)

        # 5. Render
        render = RenderProvider(api_key="")
        st_r = render.is_available()
        self.assertFalse(st_r.is_configured)
        self.assertIn("RENDER_API_KEY", st_r.missing_credentials)

        # 6. Firebase
        firebase = FirebaseHostingProvider(token="", project_id="")
        st_fb = firebase.is_available()
        self.assertFalse(st_fb.is_configured)
        self.assertIn("FIREBASE_TOKEN", st_fb.missing_credentials)

        # 7. Mock Provider is always configured
        mock = MockDeploymentProvider()
        self.assertTrue(mock.is_available().is_configured)

    def test_mock_provider_deployment_and_json_output(self):
        mock_provider = MockDeploymentProvider(base_url="https://preview.local")
        manager = DeploymentManager(
            state_file=self.state_file,
            providers={"mock": mock_provider},
        )

        res = manager.deploy(
            target=self.site_dir,
            provider_override="mock",
        )

        self.assertIsInstance(res, DeploymentResult)
        self.assertEqual(res.status, "success")
        self.assertEqual(res.provider, "mock")
        self.assertEqual(res.business_id, "test_site")
        self.assertEqual(res.url, "https://preview.local/test-site")

        # Verify deployment.json was saved
        dep_file = self.site_dir / "deployment.json"
        self.assertTrue(dep_file.exists())
        with open(dep_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data["business_id"], "test_site")
        self.assertEqual(data["status"], "success")

    def test_round_robin_rotation_sequence(self):
        p1 = DummyCustomProvider("prov_a")
        p2 = DummyCustomProvider("prov_b")
        p3 = DummyCustomProvider("prov_c")

        manager = DeploymentManager(
            state_file=self.state_file,
            providers={"prov_a": p1, "prov_b": p2, "prov_c": p3, "mock": MockDeploymentProvider()},
        )

        # Override round robin order for test
        import modules.deployment.manager as mgr_mod
        original_order = mgr_mod.ROUND_ROBIN_ORDER
        mgr_mod.ROUND_ROBIN_ORDER = ["prov_a", "prov_b", "prov_c"]

        try:
            # 1st deployment -> prov_a
            res1 = manager.deploy(self.site_dir)
            self.assertEqual(res1.provider, "prov_a")
            self.assertEqual(res1.status, "success")

            # 2nd deployment -> prov_b
            res2 = manager.deploy(self.site_dir)
            self.assertEqual(res2.provider, "prov_b")

            # 3rd deployment -> prov_c
            res3 = manager.deploy(self.site_dir)
            self.assertEqual(res3.provider, "prov_c")

            # 4th deployment -> wraps around to prov_a
            res4 = manager.deploy(self.site_dir)
            self.assertEqual(res4.provider, "prov_a")

            # Verify state persistence
            with open(self.state_file, "r", encoding="utf-8") as f:
                saved_state = json.load(f)
            self.assertEqual(saved_state["deployments_count"], 4)
            self.assertEqual(saved_state["last_used_provider"], "prov_a")
        finally:
            mgr_mod.ROUND_ROBIN_ORDER = original_order

    def test_automatic_fallback_on_unconfigured_and_failed_providers(self):
        p1 = DummyCustomProvider("unconfigured_prov", configured=False)
        p2 = DummyCustomProvider("failing_prov", should_fail=True)
        p3 = DummyCustomProvider("working_prov")

        manager = DeploymentManager(
            state_file=self.state_file,
            providers={
                "unconfigured_prov": p1,
                "failing_prov": p2,
                "working_prov": p3,
                "mock": MockDeploymentProvider(),
            },
        )

        import modules.deployment.manager as mgr_mod
        original_order = mgr_mod.ROUND_ROBIN_ORDER
        mgr_mod.ROUND_ROBIN_ORDER = ["unconfigured_prov", "failing_prov", "working_prov"]

        try:
            res = manager.deploy(self.site_dir)
            self.assertEqual(res.provider, "working_prov")
            self.assertEqual(res.status, "success")
        finally:
            mgr_mod.ROUND_ROBIN_ORDER = original_order

    def test_no_silent_mock_fallback_when_live_fails(self):
        p1 = DummyCustomProvider("failing_prov", should_fail=True)

        manager = DeploymentManager(
            state_file=self.state_file,
            providers={
                "failing_prov": p1,
                "mock": MockDeploymentProvider(),
            },
        )

        import modules.deployment.manager as mgr_mod
        original_order = mgr_mod.ROUND_ROBIN_ORDER
        mgr_mod.ROUND_ROBIN_ORDER = ["failing_prov"]

        try:
            # When live fails and allow_mock_fallback is False, status should be failed, NOT mock success
            res = manager.deploy(self.site_dir)
            self.assertEqual(res.status, "failed")
            self.assertEqual(res.provider, "none")
            self.assertIn("failed", res.error.lower())
        finally:
            mgr_mod.ROUND_ROBIN_ORDER = original_order


if __name__ == "__main__":
    unittest.main()
