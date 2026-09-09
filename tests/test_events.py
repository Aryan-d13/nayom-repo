import json
import pytest
from pathlib import Path
from contracts.events import PipelineEvent
from modules.orchestrator.events import EventManager


def test_event_contract_and_emission(tmp_path: Path):
    event_mgr = EventManager(runs_root=tmp_path)
    run_id = "test_run_123"

    evt = event_mgr.emit(
        run_id=run_id,
        status="completed",
        message="Website intelligence analysis finished",
        business_id="biz_001",
        business_name="Acme Dental",
        stage="website_intelligence",
        duration_ms=450.5,
        metadata={"template": "dental-smooth", "confidence": 0.95},
        level="success",
    )

    assert evt.run_id == run_id
    assert evt.business_id == "biz_001"
    assert evt.stage == "website_intelligence"
    assert evt.status == "completed"
    assert evt.duration_ms == 450.5
    assert evt.level == "success"

    # Verify append-only file persistence in events.jsonl
    events_file = tmp_path / run_id / "events.jsonl"
    assert events_file.exists()

    with open(events_file, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    assert len(lines) == 1
    data = json.loads(lines[0])
    assert data["run_id"] == run_id
    assert data["message"] == "Website intelligence analysis finished"
    assert data["metadata"]["template"] == "dental-smooth"


def test_event_replay_and_filtering(tmp_path: Path):
    event_mgr = EventManager(runs_root=tmp_path)
    run_id = "test_run_replay"

    # Emit multiple events
    event_mgr.emit(run_id=run_id, status="started", message="Run started", level="info")
    event_mgr.emit(run_id=run_id, status="running", message="Crawling biz 1", business_id="biz_1", stage="website_collector", level="info")
    event_mgr.emit(run_id=run_id, status="failed", message="Collector error", business_id="biz_1", stage="website_collector", level="error")
    event_mgr.emit(run_id=run_id, status="running", message="Crawling biz 2", business_id="biz_2", stage="website_collector", level="info")
    event_mgr.emit(run_id=run_id, status="completed", message="Crawled biz 2", business_id="biz_2", stage="website_collector", level="success")

    # 1. Retrieve all events
    all_events = event_mgr.get_events(run_id)
    assert len(all_events) == 5

    # 2. Filter by business_id
    biz1_events = event_mgr.get_events(run_id, business_id="biz_1")
    assert len(biz1_events) == 2
    assert biz1_events[1].status == "failed"

    # 3. Filter by level
    errors = event_mgr.get_events(run_id, level="error")
    assert len(errors) == 1
    assert errors[0].message == "Collector error"

    # 4. Limit results
    last_two = event_mgr.get_events(run_id, limit=2)
    assert len(last_two) == 2
    assert last_two[1].status == "completed"
