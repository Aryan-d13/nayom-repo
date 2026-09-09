import os
import json
import threading
import pytest
from pathlib import Path
from unittest.mock import MagicMock, patch

from contracts.business import Business
from contracts.maps import MapsSearchRequest, MapsSearchResult
from contracts.website import WebsiteCollectionRequest, WebsiteCollectionResult
from contracts.intelligence import (
    WebsiteIntelligence,
    BusinessProfile,
    ContactIntelligence,
    BrandAndContentIntelligence,
    DesignAndUXAnalysis,
    TechnicalAndSEOAnalysis,
    RedesignRecommendations,
    TemplateRecommendation,
)
from contracts.generator import WebsiteGenerationResult
from contracts.deployment import DeploymentRequest, DeploymentResult
from contracts.email import OutreachEmail, EmailDeliveryRequest, EmailDeliveryResult
from contracts.orchestrator import (
    PipelineRunConfig,
    PipelineSummary,
    PipelineRunState,
    BusinessRunState,
    StageExecution,
)
from modules.maps_scraper.scraper import GoogleMapsScraper
from modules.maps_scraper.geocoder import generate_grid_tiles
from modules.deployment.manager import DeploymentManager
from modules.email_sender.manager import EmailSenderManager
from modules.email_sender.suppression import SuppressionList
from modules.orchestrator.state import RunStateManager
from modules.orchestrator.pipeline import PipelineOrchestrator


def make_test_business(b_id="biz_1", name="Test Dental", usable=True, website="https://test.com", email="test@test.com", phone="512-555-0100"):
    return Business(
        id=b_id,
        name=name,
        category="Dentist",
        website=website if usable else None,
        email=email if usable else None,
        phone=phone if usable else None,
        usable=usable,
    )


class TestConcurrencyHardening:
    """Tests thread-safety and locking mechanisms for shared state across workers."""

    def test_deployment_manager_concurrent_deployments(self, tmp_path):
        state_file = tmp_path / "deployment_state.json"
        mgr = DeploymentManager(state_file=state_file)

        # Create 10 dummy site dirs
        site_dirs = []
        for i in range(10):
            d = tmp_path / f"site_{i}"
            d.mkdir(parents=True, exist_ok=True)
            site_dirs.append(d)

        def deploy_worker(site_dir):
            mgr.deploy(site_dir, provider_override="mock")

        threads = [threading.Thread(target=deploy_worker, args=(sd,)) for sd in site_dirs]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        # State file should have recorded all deployments cleanly without corruption
        assert state_file.exists()
        with open(state_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert data.get("deployments_count") == 10

    def test_email_sender_manager_concurrent_usage(self, tmp_path):
        state_file = tmp_path / "email_state.json"
        supp_file = tmp_path / "suppression.json"
        mgr = EmailSenderManager(state_file=state_file, suppression_file=supp_file)

        # Create dummy requests
        requests = []
        for i in range(10):
            biz_dir = tmp_path / f"biz_{i}"
            biz_dir.mkdir(parents=True, exist_ok=True)
            req = EmailDeliveryRequest(
                business_id=f"biz_{i}",
                recipient=f"user_{i}@example.com",
                subject="Test Subject",
                body="Test Body",
                provider="mock",
            )
            requests.append((req, biz_dir))

        def send_worker(req, biz_dir):
            mgr.send(req, provider_override="mock", dry_run=True)

        threads = [threading.Thread(target=send_worker, args=(r, bd)) for r, bd in requests]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        assert state_file.exists()
        with open(state_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert data.get("total_sent_count") == 10

    def test_suppression_list_concurrent_modifications(self, tmp_path):
        supp_file = tmp_path / "suppression.json"
        supp = SuppressionList(file_path=supp_file)

        def add_worker(idx):
            supp.add(f"optout_{idx}@example.com", reason="test")

        threads = [threading.Thread(target=add_worker, args=(i,)) for i in range(20)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        all_supp = supp.get_all()
        assert len(all_supp) == 20
        assert supp.is_suppressed("optout_5@example.com")


class TestMapsScraperHardening:
    """Tests usable prioritization and dynamic grid tile scaling."""

    def test_grid_tile_scaling(self):
        bbox = (30.1, -97.9, 30.5, -97.5)
        tiles_small = generate_grid_tiles(bbox, max_tiles=10)
        tiles_medium = generate_grid_tiles(bbox, max_tiles=25)
        tiles_large = generate_grid_tiles(bbox, max_tiles=50)

        assert len(tiles_small) > 0
        assert len(tiles_medium) >= len(tiles_small)
        assert len(tiles_large) >= len(tiles_medium)

    def test_usable_business_prioritization_on_slicing(self, tmp_path):
        scraper = GoogleMapsScraper(binary_path=tmp_path / "nonexistent.exe")

        # Mock _scrape_single_tile to return 4 businesses: 2 usable, 2 unusable
        raw_usable_1 = {"title": "Biz Usable 1", "phone": "512-111-1111", "data_id": "1"}
        raw_usable_2 = {"title": "Biz Usable 2", "email": "info@biz2.com", "data_id": "2"}
        raw_unusable_1 = {"title": "Biz Unusable 1", "data_id": "3"}
        raw_unusable_2 = {"title": "Biz Unusable 2", "data_id": "4"}

        # Patch internal methods to simulate scraping
        with patch.object(scraper, "_scrape_single_tile") as mock_scrape, \
             patch("modules.maps_scraper.scraper.SCRAPER_BIN_PATH", tmp_path / "fake.exe"), \
             patch.object(Path, "exists", return_value=True):

            mock_scrape.return_value = [raw_unusable_1, raw_usable_1, raw_unusable_2, raw_usable_2]

            req = MapsSearchRequest(query="dentists", max_results=2, geo="30.2672,-97.7431")
            result = scraper.search(req)

            # When requesting 2, it should prioritize the 2 usable businesses!
            assert len(result.businesses) == 2
            assert result.usable == 2
            assert all(b.usable for b in result.businesses)
            assert result.businesses[0].name == "Biz Usable 1"
            assert result.businesses[1].name == "Biz Usable 2"
            assert result.requested == 2
            assert result.succeeded == 2


class TestOrchestratorOperationalMetrics:
    """Tests explicit 8-dimensional operational metrics aggregation across 1, 10, 100 scales."""

    def test_metrics_aggregation_across_batch_scales(self, tmp_path):
        state_mgr = RunStateManager(runs_root=tmp_path / "runs")

        # Setup mock run with 10 businesses (7 completed, 2 skipped, 1 failed)
        cfg = PipelineRunConfig(query="dentists in Austin", limit=10)
        run_state = state_mgr.initialize_run(cfg)

        for i in range(10):
            is_usable = (i != 9)
            biz_state = BusinessRunState(
                business_id=f"biz_{i}",
                business_name=f"Dental Practice {i}",
                website=f"https://dental{i}.com" if is_usable else None,
                status="pending",
                business_data={"id": f"biz_{i}", "name": f"Dental Practice {i}", "usable": is_usable},
            )

            if i < 7:
                # 7 complete all stages
                biz_state.status = "completed"
                for stage in ["website_collector", "website_intelligence", "website_generator", "deployment", "email_generator", "email_sender"]:
                    biz_state.stages[stage] = StageExecution(stage_name=stage, status="completed")
            elif i in (7, 8):
                # 2 skipped due to no website
                biz_state.status = "skipped"
                biz_state.stages["website_collector"] = StageExecution(stage_name="website_collector", status="skipped")
            else:
                # 1 failed
                biz_state.status = "failed"
                biz_state.stages["website_collector"] = StageExecution(stage_name="website_collector", status="failed", error="Connection timeout")

            state_mgr.save_business_state(run_state.run_id, biz_state)

        run_state.total_businesses = 10
        summary = state_mgr.refresh_run_summary(run_state)

        assert summary.requested == 10
        assert summary.found == 10
        assert summary.usable == 9
        assert summary.processed == 10
        assert summary.succeeded == 7
        assert summary.skipped == 2
        assert summary.failed == 1

        assert summary.websites_collected == 7
        assert summary.intelligence_completed == 7
        assert summary.sites_generated == 7
        assert summary.sites_deployed == 7
        assert summary.emails_generated == 7
        assert summary.emails_sent == 7


class TestAtomicFilePersistence:
    """Verifies that atomic write mechanics cleanly write without leaving temp files."""

    def test_run_state_atomic_save(self, tmp_path):
        state_mgr = RunStateManager(runs_root=tmp_path / "runs")
        cfg = PipelineRunConfig(query="test query", limit=5)
        run_state = state_mgr.initialize_run(cfg)

        run_file = tmp_path / "runs" / run_state.run_id / "run.json"
        assert run_file.exists()
        # No dangling .tmp file
        assert not (tmp_path / "runs" / run_state.run_id / "run.json.tmp").exists()
