import time
import pytest
from unittest.mock import MagicMock
from pathlib import Path

from contracts.business import Business
from contracts.maps import MapsSearchRequest, MapsSearchResult
from contracts.website import WebsiteCollectionResult
from contracts.intelligence import (
    WebsiteIntelligence,
    BusinessProfile,
    ContactIntelligence,
    DesignAndUXAnalysis,
    TechnicalAndSEOAnalysis,
    RedesignRecommendations,
    TemplateRecommendation,
    IntelligenceMetadata,
)
from contracts.generator import WebsiteGenerationResult
from contracts.deployment import DeploymentResult
from contracts.email import OutreachEmail, EmailDeliveryResult
from contracts.orchestrator import PipelineRunConfig, PipelineRunState
from modules.orchestrator import PipelineOrchestrator, RunStateManager, EventManager


from tests.test_orchestrator import make_dummy_intelligence

def create_mock_intel(biz_id: str) -> WebsiteIntelligence:
    return make_dummy_intelligence(site_id=biz_id)


def test_concurrent_pipeline_execution(tmp_path: Path):
    """
    Tests executing multiple businesses concurrently via ThreadPoolExecutor,
    verifying thread-safety, event logging, and checkpoint integrity.
    """
    state_mgr = RunStateManager(runs_root=tmp_path / "runs")
    event_mgr = EventManager(runs_root=tmp_path / "runs")

    # Mock 5 businesses
    businesses = [
        Business(
            id=f"biz_{i:03d}",
            name=f"Clinic {i}",
            category="Dentist",
            phone=f"+1 555-010{i}",
            website=f"https://clinic{i}.com",
            usable=True,
        )
        for i in range(1, 6)
    ]

    mock_scraper = MagicMock()
    mock_scraper.search.return_value = MapsSearchResult(
        request=MapsSearchRequest(query="dentists test", max_results=5),
        total_found=5,
        usable_count=5,
        businesses=businesses,
        duration_seconds=0.05,
        raw_file_path=str(tmp_path / "raw.json"),
        normalized_file_path=str(tmp_path / "norm.json"),
        executed_at="2026-08-23T14:00:00Z",
    )

    mock_collector = MagicMock()
    mock_collector.collect.side_effect = lambda req: WebsiteCollectionResult(
        request=req,
        site_id=req.site_id,
        base_url=req.url,
        domain=f"{req.site_id}.com",
        total_pages_crawled=3,
        successful_pages=3,
        failed_pages=0,
        pages=[],
        website_json_path=str(tmp_path / f"{req.site_id}_site.json"),
        raw_output_dir=str(tmp_path / req.site_id),
        duration_seconds=0.02,
    )

    mock_analyzer = MagicMock()
    mock_analyzer.analyze.side_effect = lambda source, provider=None, output_path=None, max_screenshots=5: create_mock_intel(
        str(source).split("/")[-1]
    )

    mock_generator = MagicMock()
    mock_generator.generate.side_effect = lambda source, output_dir=None, template_override=None: WebsiteGenerationResult(
        business_id=str(source).split("/")[-1],
        site_id=str(source).split("/")[-1],
        template_id="dental-smooth",
        template_name="Dental Smooth",
        output_dir=str(tmp_path / "gen" / str(source).split("/")[-1]),
        site_data_path=str(tmp_path / "gen" / "site-data.json"),
        manifest_path=str(tmp_path / "gen" / "manifest.json"),
        slots_populated=5,
    )

    mock_deployer = MagicMock()
    mock_deployer.deploy.side_effect = lambda target, provider_override=None: DeploymentResult(
        business_id=str(target).split("/")[-1],
        provider="vercel",
        status="success",
        url=f"https://nayom-{str(target).split('/')[-1]}.vercel.app",
        deployment_id="dep_123",
        duration_seconds=0.05,
    )

    mock_email_gen = MagicMock()
    mock_email_gen.generate.side_effect = lambda target, preview_url=None, recipient=None, output_path=None, **kwargs: OutreachEmail(
        business_id=str(target),
        subject="Personalized Growth Concept",
        body="Hi there, we built a modern website preview for you!",
        recipient=recipient,
        preview_url=preview_url or "https://preview.example.com",
        provider="mock",
        model="mock",
    )

    mock_email_sender = MagicMock()
    mock_email_sender.send.side_effect = lambda target, provider_override=None, dry_run=False, force=False: EmailDeliveryResult(
        business_id=str(target).split("/")[-1],
        recipient="info@example.com",
        status="dry_run" if dry_run else "sent",
        provider="gmail",
        message_id="msg_123",
        sent_at="2026-08-23T14:00:00Z",
        duration_seconds=0.01,
    )

    orchestrator = PipelineOrchestrator(
        scraper=mock_scraper,
        collector=mock_collector,
        analyzer=mock_analyzer,
        generator=mock_generator,
        deployer=mock_deployer,
        email_generator=mock_email_gen,
        email_sender=mock_email_sender,
        state_manager=state_mgr,
        event_manager=event_mgr,
    )

    config = PipelineRunConfig(
        query="dentists test",
        limit=5,
        concurrency=4,
        dry_run=True,
    )

    run_state = orchestrator.run(config)

    assert run_state.status == "completed"
    assert run_state.summary.businesses_found == 5
    assert run_state.summary.succeeded == 5
    assert run_state.summary.failed == 0
    assert run_state.summary.sites_generated == 5
    assert run_state.summary.sites_deployed == 5
    assert run_state.summary.emails_sent == 5

    # Check that events were emitted and persisted
    events = event_mgr.get_events(run_state.run_id)
    assert len(events) > 10

    # Verify per-business checkpoints exist on disk
    all_biz = state_mgr.load_all_business_states(run_state.run_id)
    assert len(all_biz) == 5
    for b_id, b_state in all_biz.items():
        assert b_state.status == "completed"
        assert len(b_state.stages) == 6
        for s_name, s_exec in b_state.stages.items():
            assert s_exec.status == "completed"
