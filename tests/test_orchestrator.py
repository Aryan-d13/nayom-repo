import os
import json
import pytest
from pathlib import Path
from unittest.mock import MagicMock, patch

from contracts.business import Business
from contracts.maps import MapsSearchRequest, MapsSearchResult
from contracts.website import WebsiteCollectionRequest, WebsiteCollectionResult
from contracts.intelligence import WebsiteIntelligence, BusinessProfile, ContactIntelligence, BrandAndContentIntelligence, DesignAndUXAnalysis, TechnicalAndSEOAnalysis, RedesignRecommendations, TemplateRecommendation
from contracts.generator import WebsiteGenerationResult
from contracts.deployment import DeploymentResult
from contracts.email import OutreachEmail, EmailDeliveryResult
from contracts.orchestrator import (
    StageStatus,
    StageExecution,
    BusinessRunState,
    PipelineRunConfig,
    PipelineSummary,
    PipelineRunState,
)
from modules.orchestrator.state import RunStateManager
from modules.orchestrator.retry import is_transient_error, execute_with_retry
from modules.orchestrator.pipeline import PipelineOrchestrator


def make_dummy_business(b_id="test_dentist", name="Austin Dental Care", website="https://austindental.example.com", email="info@austindental.com"):
    return Business(
        id=b_id,
        name=name,
        category="Dentist",
        website=website,
        email=email,
        phone="512-555-0100",
        address="123 Main St, Austin, TX",
        city="Austin",
        state="TX",
        usable=True,
    )


def make_dummy_intelligence(site_id="test_dentist"):
    return WebsiteIntelligence(
        site_id=site_id,
        base_url=f"https://{site_id}.example.com",
        domain=f"{site_id}.example.com",
        source_website_json=f"data/websites/{site_id}/website.json",
        business_profile=BusinessProfile(
            business_name="Austin Dental Care",
            description="Modern comprehensive dental care in Austin.",
            value_proposition="Painless and gentle dentistry.",
            target_audience="Austin families",
        ),
        contact_intelligence=ContactIntelligence(
            emails=["info@austindental.com"],
            phones=["512-555-0100"],
            has_contact_method=True,
        ),
        brand_and_content=BrandAndContentIntelligence(
            brand_positioning="Trusted family dentist",
            hero_headlines=["Gentle Dentistry in Austin"],
        ),
        design_and_ux=DesignAndUXAnalysis(
            visual_aesthetic="Clean clinical",
            typography_assessment="Legible sans-serif",
            color_palette_assessment="Blue and white",
            layout_and_spacing="Standard layout",
            ux_navigation_flow="Simple flow",
        ),
        technical_and_seo=TechnicalAndSEOAnalysis(
            seo_health="Good",
            accessibility_observations="Accessible",
        ),
        redesign_recommendations=RedesignRecommendations(
            overall_redesign_verdict="Modern overhaul recommended",
            quick_wins=["Add online booking button"],
        ),
        template_recommendation=TemplateRecommendation(
            recommended_template="generic-modern",
            template_category="local_service",
            style_direction="clean_corporate",
            layout_pattern="split_hero_feature_stack",
            template_confidence=0.95,
        ),
    )


class TestOrchestratorContractsAndState:
    """Tests orchestrator contract models, RunStateManager, and checkpointing."""

    def test_stage_execution_model(self):
        stage = StageExecution(stage_name="website_collector", status="completed", duration_seconds=1.5, output_ref="path/to/website.json")
        assert stage.stage_name == "website_collector"
        assert stage.status == "completed"
        assert stage.duration_seconds == 1.5
        assert stage.output_ref == "path/to/website.json"

    def test_business_run_state_methods(self):
        biz = BusinessRunState(
            business_id="b1",
            business_name="Test Business",
            website="https://example.com",
        )
        assert not biz.is_stage_completed("website_collector")
        
        st = biz.get_stage("website_collector")
        st.status = "completed"
        assert biz.is_stage_completed("website_collector")

    def test_run_state_manager_init_and_save(self, tmp_path):
        mgr = RunStateManager(runs_root=tmp_path)
        cfg = PipelineRunConfig(query="dentists in Austin", limit=5, dry_run=True)
        
        run_state = mgr.initialize_run(cfg)
        assert (tmp_path / run_state.run_id / "run.json").exists()
        assert (tmp_path / run_state.run_id / "businesses").exists()

        # Load back
        loaded = mgr.load_run_state(run_state.run_id)
        assert loaded.run_id == run_state.run_id
        assert loaded.query == "dentists in Austin"
        assert loaded.config.limit == 5

    def test_business_checkpoint_save_and_update(self, tmp_path):
        mgr = RunStateManager(runs_root=tmp_path)
        cfg = PipelineRunConfig(query="dentists in Austin", limit=2)
        run_state = mgr.initialize_run(cfg)

        biz_state = BusinessRunState(
            business_id="biz_1",
            business_name="Dental Spa",
            website="https://dentalspa.example.com",
        )
        mgr.save_business_state(run_state.run_id, biz_state)

        # Verify file exists
        biz_file = tmp_path / run_state.run_id / "businesses" / "biz_1.json"
        assert biz_file.exists()

        # Update a stage
        mgr.update_stage(
            run_id=run_state.run_id,
            business_state=biz_state,
            stage_name="website_collector",
            status="completed",
            output_ref="data/websites/biz_1/website.json",
            duration=2.5,
        )

        loaded_biz = mgr.load_business_state(run_state.run_id, "biz_1")
        assert loaded_biz is not None
        assert loaded_biz.stages["website_collector"].status == "completed"
        assert loaded_biz.stages["website_collector"].output_ref == "data/websites/biz_1/website.json"
        assert loaded_biz.stages["website_collector"].duration_seconds == 2.5


class TestRetryLogic:
    """Tests transient error detection and retry execution."""

    def test_is_transient_error(self):
        assert is_transient_error(TimeoutError("Connection timed out"))
        assert is_transient_error(ConnectionResetError("Connection reset by peer"))
        assert is_transient_error(Exception("Rate limit 429 exceeded"))
        assert is_transient_error(Exception("503 Service Unavailable"))
        assert not is_transient_error(ValueError("Invalid argument format"))
        assert not is_transient_error(FileNotFoundError("No such file"))

    def test_retry_success_after_transient_failure(self):
        calls = [0]

        def flaky_function():
            calls[0] += 1
            if calls[0] < 2:
                raise TimeoutError("Temporary timeout")
            return "success"

        result, retries = execute_with_retry(
            fn=flaky_function,
            max_retries=2,
            initial_backoff=0.01,
            stage_name="test_stage",
        )
        assert result == "success"
        assert retries == 1
        assert calls[0] == 2

    def test_retry_fails_on_non_transient(self):
        calls = [0]

        def bad_function():
            calls[0] += 1
            raise ValueError("Fatal syntax error")

        with pytest.raises(ValueError, match="Fatal syntax error"):
            execute_with_retry(
                fn=bad_function,
                max_retries=3,
                initial_backoff=0.01,
                stage_name="test_stage",
            )
        assert calls[0] == 1  # No retries on non-transient


class TestPipelineOrchestratorEndToEnd:
    """Tests full pipeline orchestration, resume, stage skipping, and failure isolation."""

    @pytest.fixture
    def mock_components(self, tmp_path):
        scraper = MagicMock()
        collector = MagicMock()
        analyzer = MagicMock()
        generator = MagicMock()
        deployer = MagicMock()
        email_gen = MagicMock()
        email_snd = MagicMock()
        state_mgr = RunStateManager(runs_root=tmp_path / "runs")

        return {
            "scraper": scraper,
            "collector": collector,
            "analyzer": analyzer,
            "generator": generator,
            "deployer": deployer,
            "email_gen": email_gen,
            "email_snd": email_snd,
            "state_mgr": state_mgr,
        }

    def test_full_pipeline_success(self, mock_components):
        b1 = make_dummy_business("b1", "Alpha Dental", "https://alpha.com", "contact@alpha.com")
        b2 = make_dummy_business("b2", "Beta Dental", "https://beta.com", "info@beta.com")

        # Mock Scraper
        mock_components["scraper"].search.return_value = MapsSearchResult(
            request=MapsSearchRequest(query="dentists"),
            businesses=[b1, b2],
            total_found=2,
            usable_count=2,
            raw_file_path="raw.json",
            normalized_file_path="norm.json",
            executed_at="2026-08-22T00:00:00Z",
            duration_seconds=1.0,
        )

        # Mock Collector
        mock_components["collector"].collect.side_effect = lambda req: WebsiteCollectionResult(
            request=req,
            site_id=req.site_id,
            base_url=req.url,
            domain=req.site_id + ".com",
            total_pages_crawled=5,
            successful_pages=5,
            raw_output_dir=f"data/websites/{req.site_id}/raw",
            website_json_path=f"data/websites/{req.site_id}/website.json",
        )

        # Mock Analyzer
        mock_components["analyzer"].analyze.side_effect = lambda source, provider=None: make_dummy_intelligence(site_id=str(source).split("/")[-1].replace(".json", "") if "/" in str(source) else str(source))

        # Mock Generator
        mock_components["generator"].generate.side_effect = lambda source, template_override=None: WebsiteGenerationResult(
            business_id="b1" if "b1" in str(source) else "b2",
            site_id="b1" if "b1" in str(source) else "b2",
            output_dir=f"generated/{'b1' if 'b1' in str(source) else 'b2'}",
            template_id="generic-modern",
            template_name="Generic Modern",
            site_data_path="site-data.json",
            manifest_path="manifest.json",
        )

        # Mock Deployer
        mock_components["deployer"].deploy.side_effect = lambda target, provider_override=None: DeploymentResult(
            business_id=str(target),
            provider="mock",
            url=f"https://nayom-preview.pages.dev/{target}",
            status="success",
        )

        # Mock Email Generator
        mock_components["email_gen"].generate.side_effect = lambda target, preview_url=None, recipient=None, **kwargs: OutreachEmail(
            recipient=recipient,
            subject="Quick website preview for you",
            body="Check out your preview here",
            business_id=str(target),
            preview_url=preview_url or "https://preview.com",
            model="mock",
        )

        # Mock Email Sender
        mock_components["email_snd"].send.side_effect = lambda target, provider_override=None, dry_run=False: EmailDeliveryResult(
            business_id=str(target),
            recipient="test@example.com",
            provider="mock",
            message_id="msg_123",
            status="dry_run" if dry_run else "sent",
        )

        orchestrator = PipelineOrchestrator(
            scraper=mock_components["scraper"],
            collector=mock_components["collector"],
            analyzer=mock_components["analyzer"],
            generator=mock_components["generator"],
            deployer=mock_components["deployer"],
            email_generator=mock_components["email_gen"],
            email_sender=mock_components["email_snd"],
            state_manager=mock_components["state_mgr"],
        )

        cfg = PipelineRunConfig(query="dentists in Austin", limit=2, dry_run=True)
        run_state = orchestrator.run(cfg)

        assert run_state.status == "completed"
        assert run_state.summary.businesses_found == 2
        assert run_state.summary.websites_collected == 2
        assert run_state.summary.intelligence_completed == 2
        assert run_state.summary.sites_generated == 2
        assert run_state.summary.sites_deployed == 2
        assert run_state.summary.emails_generated == 2
        assert run_state.summary.emails_sent == 2
        assert run_state.summary.failed == 0

        # Verify all mocks were called
        assert mock_components["scraper"].search.call_count == 1
        assert mock_components["collector"].collect.call_count == 2
        assert mock_components["analyzer"].analyze.call_count == 2
        assert mock_components["generator"].generate.call_count == 2
        assert mock_components["deployer"].deploy.call_count == 2
        assert mock_components["email_gen"].generate.call_count == 2
        assert mock_components["email_snd"].send.call_count == 2

    def test_stage_skipping_on_resume(self, mock_components):
        """Tests that already-completed stages are skipped when a run is resumed."""
        state_mgr = mock_components["state_mgr"]
        cfg = PipelineRunConfig(query="dentists in Austin", limit=1)
        initial_run = state_mgr.initialize_run(cfg)

        b1 = make_dummy_business("b1", "Alpha Dental", "https://alpha.com", "info@alpha.com")
        biz_state = BusinessRunState(
            business_id="b1",
            business_name="Alpha Dental",
            website="https://alpha.com",
            email="info@alpha.com",
        )
        # Pre-populate website_collector and website_intelligence as completed
        state_mgr.update_stage(initial_run.run_id, biz_state, "website_collector", "completed", output_ref="data/websites/b1/website.json")
        state_mgr.update_stage(initial_run.run_id, biz_state, "website_intelligence", "completed", output_ref="data/websites/b1/website_intelligence.json")
        initial_run.business_ids = ["b1"]
        initial_run.total_businesses = 1
        state_mgr.save_run_state(initial_run)

        # Mock downstream stages
        mock_components["generator"].generate.return_value = WebsiteGenerationResult(
            business_id="b1",
            site_id="b1",
            output_dir="generated/b1",
            template_id="generic-modern",
            template_name="Generic Modern",
            site_data_path="site-data.json",
            manifest_path="manifest.json",
        )
        mock_components["deployer"].deploy.return_value = DeploymentResult(
            business_id="b1",
            provider="mock",
            url="https://preview.pages.dev/b1",
            status="success",
        )
        mock_components["email_gen"].generate.return_value = OutreachEmail(
            recipient="info@alpha.com",
            subject="Live preview",
            body="Check preview",
            business_id="b1",
            preview_url="https://preview.pages.dev/b1",
            model="mock",
        )
        mock_components["email_snd"].send.return_value = EmailDeliveryResult(
            business_id="b1",
            recipient="info@alpha.com",
            provider="mock",
            status="sent",
        )

        orchestrator = PipelineOrchestrator(
            scraper=mock_components["scraper"],
            collector=mock_components["collector"],
            analyzer=mock_components["analyzer"],
            generator=mock_components["generator"],
            deployer=mock_components["deployer"],
            email_generator=mock_components["email_gen"],
            email_sender=mock_components["email_snd"],
            state_manager=state_mgr,
        )

        # Resume the run
        resume_cfg = PipelineRunConfig(
            query="dentists in Austin",
            resume_run_id=initial_run.run_id,
        )
        resumed_run = orchestrator.run(resume_cfg)

        assert resumed_run.status == "completed"
        # Scraper, collector, and analyzer should NOT have been called
        assert mock_components["scraper"].search.call_count == 0
        assert mock_components["collector"].collect.call_count == 0
        assert mock_components["analyzer"].analyze.call_count == 0

        # Downstream stages should have executed
        assert mock_components["generator"].generate.call_count == 1
        assert mock_components["deployer"].deploy.call_count == 1
        assert mock_components["email_gen"].generate.call_count == 1
        assert mock_components["email_snd"].send.call_count == 1

    def test_failure_isolation(self, mock_components):
        """Tests that a failure in Business 1 does not halt Business 2."""
        b1 = make_dummy_business("b1", "Failing Dental", "https://broken-site.com")
        b2 = make_dummy_business("b2", "Healthy Dental", "https://healthy-site.com")

        mock_components["scraper"].search.return_value = MapsSearchResult(
            request=MapsSearchRequest(query="dentists"),
            businesses=[b1, b2],
            total_found=2,
            usable_count=2,
            raw_file_path="raw.json",
            normalized_file_path="norm.json",
            executed_at="2026-08-22T00:00:00Z",
            duration_seconds=1.0,
        )

        def mock_collect(req):
            if req.site_id == "b1":
                raise ConnectionError("Domain unreachable 404/500")
            return WebsiteCollectionResult(
                request=req,
                site_id=req.site_id,
                base_url=req.url,
                domain="healthy.com",
                total_pages_crawled=3,
                successful_pages=3,
                raw_output_dir=f"data/websites/{req.site_id}/raw",
                website_json_path=f"data/websites/{req.site_id}/website.json",
            )

        mock_components["collector"].collect.side_effect = mock_collect
        mock_components["analyzer"].analyze.return_value = make_dummy_intelligence("b2")
        mock_components["generator"].generate.return_value = WebsiteGenerationResult(
            business_id="b2",
            site_id="b2",
            output_dir="generated/b2",
            template_id="generic-modern",
            template_name="Generic Modern",
            site_data_path="site-data.json",
            manifest_path="manifest.json",
        )
        mock_components["deployer"].deploy.return_value = DeploymentResult(
            business_id="b2",
            provider="mock",
            url="https://preview.pages.dev/b2",
            status="success",
        )
        mock_components["email_gen"].generate.return_value = OutreachEmail(
            recipient="healthy@example.com",
            subject="Preview",
            body="Body",
            business_id="b2",
            preview_url="https://preview.pages.dev/b2",
            model="mock",
        )
        mock_components["email_snd"].send.return_value = EmailDeliveryResult(
            business_id="b2",
            recipient="healthy@example.com",
            provider="mock",
            status="sent",
        )

        orchestrator = PipelineOrchestrator(
            scraper=mock_components["scraper"],
            collector=mock_components["collector"],
            analyzer=mock_components["analyzer"],
            generator=mock_components["generator"],
            deployer=mock_components["deployer"],
            email_generator=mock_components["email_gen"],
            email_sender=mock_components["email_snd"],
            state_manager=mock_components["state_mgr"],
        )

        cfg = PipelineRunConfig(query="dentists in Austin", limit=2, max_retries=1)
        run_state = orchestrator.run(cfg)

        # b1 should have failed stages; b2 should have completed all stages
        all_biz = mock_components["state_mgr"].load_all_business_states(run_state.run_id)
        assert all_biz["b1"].stages["website_collector"].status == "failed"
        assert all_biz["b1"].stages["website_intelligence"].status == "skipped"
        assert all_biz["b2"].stages["email_sender"].status == "completed"

        assert run_state.summary.failed == 1
        assert run_state.summary.emails_sent == 1

    def test_missing_website_skipping(self, mock_components):
        """Tests that a business with no website skips collection and downstream gracefully."""
        b_no_site = make_dummy_business("b_no_web", "No Web Dental", website="")

        mock_components["scraper"].search.return_value = MapsSearchResult(
            request=MapsSearchRequest(query="dentists"),
            businesses=[b_no_site],
            total_found=1,
            usable_count=1,
            raw_file_path="raw.json",
            normalized_file_path="norm.json",
            executed_at="2026-08-22T00:00:00Z",
            duration_seconds=1.0,
        )

        orchestrator = PipelineOrchestrator(
            scraper=mock_components["scraper"],
            collector=mock_components["collector"],
            analyzer=mock_components["analyzer"],
            generator=mock_components["generator"],
            deployer=mock_components["deployer"],
            email_generator=mock_components["email_gen"],
            email_sender=mock_components["email_snd"],
            state_manager=mock_components["state_mgr"],
        )

        cfg = PipelineRunConfig(query="dentists in Austin", limit=1)
        run_state = orchestrator.run(cfg)

        all_biz = mock_components["state_mgr"].load_all_business_states(run_state.run_id)
        assert all_biz["b_no_web"].stages["website_collector"].status == "skipped"
        assert all_biz["b_no_web"].stages["website_intelligence"].status == "skipped"
        assert mock_components["collector"].collect.call_count == 0


class TestCLIIntegration:
    """Tests CLI integration for python main.py run and python main.py run --resume."""

    def test_cli_run_dispatch(self, monkeypatch):
        import sys
        import main
        from contracts.orchestrator import PipelineRunState, PipelineSummary

        mock_orchestrator = MagicMock()
        mock_orchestrator.run.return_value = PipelineRunState(
            run_id="run_mock_123",
            query="dentists in Austin",
            status="completed",
            config=PipelineRunConfig(query="dentists in Austin", limit=5, dry_run=True),
            summary=PipelineSummary(businesses_found=5, websites_collected=5, emails_sent=5),
        )

        monkeypatch.setattr(main, "PipelineOrchestrator", lambda: mock_orchestrator)
        test_argv = ["main.py", "run", "dentists in Austin", "--limit", "5", "--dry-run"]
        monkeypatch.setattr(sys, "argv", test_argv)

        main.main()

        assert mock_orchestrator.run.call_count == 1
        cfg = mock_orchestrator.run.call_args[0][0]
        assert cfg.query == "dentists in Austin"
        assert cfg.limit == 5
        assert cfg.dry_run is True

    def test_cli_run_resume_dispatch(self, monkeypatch):
        import sys
        import main
        from contracts.orchestrator import PipelineRunState, PipelineSummary

        mock_orchestrator = MagicMock()
        mock_orchestrator.run.return_value = PipelineRunState(
            run_id="run_existing_456",
            query="dentists in Austin",
            status="completed",
            config=PipelineRunConfig(query="dentists in Austin", resume_run_id="run_existing_456"),
            summary=PipelineSummary(businesses_found=3, websites_collected=3, emails_sent=3),
        )

        monkeypatch.setattr(main, "PipelineOrchestrator", lambda: mock_orchestrator)
        test_argv = ["main.py", "run", "--resume", "run_existing_456"]
        monkeypatch.setattr(sys, "argv", test_argv)

        main.main()

        assert mock_orchestrator.run.call_count == 1
        cfg = mock_orchestrator.run.call_args[0][0]
        assert cfg.resume_run_id == "run_existing_456"

