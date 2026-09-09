import pytest
from pathlib import Path
from contracts.orchestrator import PipelineRunConfig, BusinessRunState
from modules.orchestrator.control import RunControl, RunControlManager, RunCancelledException
from modules.orchestrator.state import RunStateManager
from modules.orchestrator.events import EventManager


def test_run_control_flags():
    ctrl = RunControl("run_ctrl_1")
    assert not ctrl.is_paused
    assert not ctrl.is_cancelled

    ctrl.pause()
    assert ctrl.is_paused

    ctrl.resume()
    assert not ctrl.is_paused

    ctrl.cancel()
    assert ctrl.is_cancelled

    # Check that check_and_wait raises RunCancelledException when cancelled
    with pytest.raises(RunCancelledException):
        ctrl.check_and_wait()


def test_run_control_manager_pause_resume_cancel(tmp_path: Path):
    state_mgr = RunStateManager(runs_root=tmp_path / "runs")
    event_mgr = EventManager(runs_root=tmp_path / "runs")
    control_mgr = RunControlManager(state_manager=state_mgr, event_manager=event_mgr)

    config = PipelineRunConfig(query="test dentists", limit=5)
    run_state = state_mgr.initialize_run(config, run_id="run_test_ctrl_123")

    # 1. Pause
    paused_state = control_mgr.pause_run(run_state.run_id)
    assert paused_state.status == "paused"
    assert state_mgr.load_run_state(run_state.run_id).status == "paused"

    # 2. Resume
    resumed_state = control_mgr.resume_run(run_state.run_id)
    assert resumed_state.status == "running"
    assert state_mgr.load_run_state(run_state.run_id).status == "running"

    # 3. Cancel
    cancelled_state = control_mgr.cancel_run(run_state.run_id)
    assert cancelled_state.status == "cancelled"
    assert state_mgr.load_run_state(run_state.run_id).status == "cancelled"


def test_run_control_manager_retry(tmp_path: Path):
    state_mgr = RunStateManager(runs_root=tmp_path / "runs")
    event_mgr = EventManager(runs_root=tmp_path / "runs")
    control_mgr = RunControlManager(state_manager=state_mgr, event_manager=event_mgr)

    config = PipelineRunConfig(query="test dentists", limit=1)
    run_state = state_mgr.initialize_run(config, run_id="run_retry_test")

    # Create a business with a failed stage
    biz = BusinessRunState(
        business_id="biz_fail_01",
        business_name="Fail Clinic",
        status="failed",
    )
    state_mgr.update_stage(
        run_id=run_state.run_id,
        business_state=biz,
        stage_name="website_generator",
        status="failed",
        error="Template syntax error",
    )

    loaded_biz = state_mgr.load_business_state(run_state.run_id, "biz_fail_01")
    assert loaded_biz.stages["website_generator"].status == "failed"

    # Execute retry
    retried_state = control_mgr.retry_run(
        run_id=run_state.run_id,
        stage_name="website_generator",
    )
    assert retried_state.status == "running"

    # Verify stage was reset to pending
    loaded_biz_after = state_mgr.load_business_state(run_state.run_id, "biz_fail_01")
    assert loaded_biz_after.stages["website_generator"].status == "pending"
    assert loaded_biz_after.stages["website_generator"].error is None
