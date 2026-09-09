import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from contracts.orchestrator import PipelineRunState, PipelineRunConfig, BusinessRunState
from api.app import app, state_mgr, event_mgr, control_mgr


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check_endpoint(client: TestClient):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "nayom-automation-api"


def test_stats_endpoint(client: TestClient):
    res = client.get("/stats")
    assert res.status_code == 200
    data = res.json()
    assert "total_runs" in data
    assert "active_runs" in data
    assert "success_rate" in data


def test_create_and_list_runs_api(client: TestClient):
    # 1. Create a run with mocked async runner so it doesn't execute real network calls
    payload = {
        "query": "api test dentists",
        "limit": 2,
        "concurrency": 2,
        "dry_run": True,
        "ai_provider": "mock",
    }
    
    with patch.object(control_mgr, "start_run_async") as mock_start:
        mock_run_state = state_mgr.initialize_run(
            PipelineRunConfig(query="api test dentists", limit=2, dry_run=True),
            run_id="run_test_api_mock_001",
        )
        mock_start.return_value = mock_run_state

        create_res = client.post("/runs", json=payload)
        assert create_res.status_code == 201
        run_data = create_res.json()
        run_id = run_data["run_id"]
        assert run_id == "run_test_api_mock_001"

    # Add sample business and event to state for inspection
    biz = BusinessRunState(
        business_id="biz_api_01",
        business_name="API Dental",
        website="https://apidental.com",
        status="completed",
    )
    state_mgr.save_business_state(run_id, biz)
    event_mgr.emit(run_id=run_id, status="completed", message="Test event emitted", level="success")

    # 2. List runs
    list_res = client.get("/runs")
    assert list_res.status_code == 200
    runs = list_res.json()
    assert any(r["run_id"] == run_id for r in runs)

    # 3. Get single run detail
    detail_res = client.get(f"/runs/{run_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["run"]["run_id"] == run_id
    assert len(detail["businesses"]) >= 1

    # 4. Pause run
    pause_res = client.post(f"/runs/{run_id}/pause")
    assert pause_res.status_code == 200
    assert pause_res.json()["status"] == "paused"

    # 5. Resume run
    resume_res = client.post(f"/runs/{run_id}/resume")
    assert resume_res.status_code == 200

    # 6. Cancel run
    cancel_res = client.post(f"/runs/{run_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"

    # 7. Retry run
    retry_res = client.post(f"/runs/{run_id}/retry", json={})
    assert retry_res.status_code == 200

    # 8. Events endpoint
    events_res = client.get(f"/runs/{run_id}/events")
    assert events_res.status_code == 200
    events = events_res.json()
    assert isinstance(events, list)
    assert len(events) > 0


def test_business_detail_endpoint(client: TestClient):
    res = client.get("/businesses/nonexistent_biz_id")
    assert res.status_code == 200
    data = res.json()
    assert data["business_id"] == "nonexistent_biz_id"
