"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Square,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  Globe,
  Mail,
  Zap,
  RefreshCw,
  Filter,
  Cpu,
} from "lucide-react";
import {
  getRunDetail,
  pauseRun,
  resumeRun,
  cancelRun,
  retryRun,
  subscribeRunEvents,
  RunDetailResponse,
  PipelineEvent,
  BusinessRunState,
} from "@/lib/api";
import MetricsBar from "@/components/MetricsBar";
import StageFunnel, { STAGE_CONFIG } from "@/components/StageFunnel";
import WorkerMonitor from "@/components/WorkerMonitor";
import EventLogViewer from "@/components/EventLogViewer";

export default function RunDetailPage() {
  const params = useParams();
  const runId = params.id as string;

  const [data, setData] = useState<RunDetailResponse | null>(null);
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // First-Class Worker Selection State (null = All Workers)
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);

  // Business table filters
  const [bizSearch, setBizSearch] = useState("");
  const [bizStatusFilter, setBizStatusFilter] = useState("all");
  const [bizStageFilter, setBizStageFilter] = useState("all");

  const loadRun = useCallback(async () => {
    try {
      const res = await getRunDetail(runId);
      setData(res);
    } catch (err) {
      console.error("Error loading run detail", err);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    loadRun();
    const interval = setInterval(loadRun, 2000);
    return () => clearInterval(interval);
  }, [loadRun]);

  // Subscribe to live SSE events from disk
  useEffect(() => {
    if (!runId) return;

    const unsubscribe = subscribeRunEvents(
      runId,
      (evt) => {
        setEvents((prev) => {
          if (prev.some((e) => e.event_id === evt.event_id)) return prev;
          return [...prev, evt];
        });
      },
      (err) => {
        console.warn("SSE connection error", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [runId]);

  const handlePause = async () => {
    setActionLoading(true);
    try {
      await pauseRun(runId);
      await loadRun();
    } catch (err: any) {
      alert(`Pause failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      await resumeRun(runId);
      await loadRun();
    } catch (err: any) {
      alert(`Resume failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this pipeline run?")) return;
    setActionLoading(true);
    try {
      await cancelRun(runId);
      await loadRun();
    } catch (err: any) {
      alert(`Cancel failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryAll = async () => {
    setActionLoading(true);
    try {
      await retryRun(runId);
      await loadRun();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryBusiness = async (bizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await retryRun(runId, undefined, bizId);
      await loadRun();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center font-mono space-y-3">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
        <p className="text-xs text-zinc-400">Loading pipeline run telemetry for {runId}...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-24 text-center space-y-4 font-mono">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Run Not Found</h2>
        <p className="text-xs text-zinc-400">Could not locate state for run: {runId}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { run, businesses } = data;
  const s = run.summary;
  const isRunning = run.status === "running";
  const isPaused = run.status === "paused";
  const isCompleted = run.status === "completed";
  const isFailed = run.status === "failed";
  const isCancelled = run.status === "cancelled";
  const concurrency = run.config?.concurrency || 5;

  // Filter businesses
  const filteredBusinesses = businesses.filter((b) => {
    if (bizStatusFilter !== "all" && b.status !== bizStatusFilter) return false;
    if (bizStageFilter !== "all" && b.current_stage !== bizStageFilter) return false;
    if (bizSearch.trim()) {
      const q = bizSearch.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(q) ||
        b.business_id.toLowerCase().includes(q) ||
        (b.website && b.website.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* 1. Run Header & Quick Control Console */}
      <div className="console-panel rounded border border-console-border p-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/"
                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
              <h1 className="font-sans font-bold text-lg text-white tracking-tight">
                {run.query || "Pipeline Execution"}
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono">
                <span
                  className={`status-dot ${
                    isRunning
                      ? "status-dot-running"
                      : isPaused
                      ? "status-dot-warning"
                      : isCompleted
                      ? "status-dot-success"
                      : isFailed
                      ? "status-dot-failed"
                      : "status-dot-idle"
                  }`}
                />
                <span
                  className={`uppercase font-bold text-[11px] ${
                    isRunning
                      ? "text-cyan-400"
                      : isPaused
                      ? "text-amber-400"
                      : isCompleted
                      ? "text-emerald-400"
                      : isFailed
                      ? "text-rose-400"
                      : "text-zinc-400"
                  }`}
                >
                  {run.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
              <span>
                RUN ID: <strong className="text-zinc-200">{run.run_id}</strong>
              </span>
              <span>•</span>
              <span>
                WORKERS: <strong className="text-cyan-400">{concurrency} CONCURRENT</strong>
              </span>
              <span>•</span>
              <span>
                MODE:{" "}
                <strong className={run.config?.dry_run ? "text-amber-400" : "text-rose-400"}>
                  {run.config?.dry_run ? "DRY RUN" : "LIVE SEND"}
                </strong>
              </span>
              <span>•</span>
              <span>
                DURATION:{" "}
                <strong className="text-zinc-200">
                  {run.duration_seconds > 0 ? `${run.duration_seconds.toFixed(1)}s` : isRunning ? "Running..." : "—"}
                </strong>
              </span>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isRunning && (
              <>
                <button
                  onClick={handlePause}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 transition-colors"
                >
                  <Square className="w-3.5 h-3.5" /> Cancel
                </button>
              </>
            )}

            {isPaused && (
              <>
                <button
                  onClick={handleResume}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Resume
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 transition-colors"
                >
                  <Square className="w-3.5 h-3.5" /> Cancel
                </button>
              </>
            )}

            {(isCompleted || isFailed || isCancelled) && (
              <button
                onClick={handleRetryAll}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry Failed Stages
              </button>
            )}

            <button
              onClick={loadRun}
              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Operational Metrics Bar (8 Columns) */}
      <MetricsBar summary={s} totalBusinesses={run.total_businesses} />

      {/* 3. 6-Stage Visual Funnel */}
      <StageFunnel summary={s} totalBusinesses={run.total_businesses} />

      {/* 4. First-Class Independent Worker Monitoring Fleet */}
      <WorkerMonitor
        concurrency={concurrency}
        businesses={businesses}
        events={events}
        selectedWorkerId={selectedWorkerId}
        onSelectWorker={setSelectedWorkerId}
        runStatus={run.status}
      />

      {/* 5. Split Workspace: Businesses Table (Left) + Dedicated Structured Event Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column: Businesses Table (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="console-panel rounded border border-console-border overflow-hidden flex flex-col h-[700px]">
            {/* Header & Filter Bar */}
            <div className="p-2.5 border-b border-console-border bg-console-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-100">
                  BUSINESSES ({filteredBusinesses.length} / {businesses.length})
                </h3>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                {/* Status Filter */}
                <select
                  value={bizStatusFilter}
                  onChange={(e) => setBizStatusFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="skipped">Skipped</option>
                  <option value="pending">Pending</option>
                </select>

                {/* Stage Filter */}
                <select
                  value={bizStageFilter}
                  onChange={(e) => setBizStageFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Stages</option>
                  <option value="website_collector">Collector</option>
                  <option value="website_intelligence">Intelligence</option>
                  <option value="website_generator">Generator</option>
                  <option value="deployment">Deployment</option>
                  <option value="email_generator">Email Gen</option>
                  <option value="email_sender">Email Sender</option>
                </select>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name/URL..."
                    value={bizSearch}
                    onChange={(e) => setBizSearch(e.target.value)}
                    className="pl-6 pr-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 w-28 sm:w-36 font-mono"
                  />
                  <Search className="w-3 h-3 text-zinc-500 absolute left-1.5 top-1.5" />
                </div>
              </div>
            </div>

            {/* Businesses List */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="sticky top-0 bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-console-border z-10">
                  <tr>
                    <th className="py-2 px-3">Business</th>
                    <th className="py-2 px-3">Stage Matrix</th>
                    <th className="py-2 px-3">Live Site</th>
                    <th className="py-2 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-console-border">
                  {filteredBusinesses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-500 text-xs">
                        No businesses match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBusinesses.map((b) => {
                      const stages = b.stages || {};
                      const deployStage = stages["deployment"];
                      const liveUrl =
                        deployStage?.output_ref && deployStage.output_ref.startsWith("http")
                          ? deployStage.output_ref
                          : null;

                      return (
                        <tr
                          key={b.business_id}
                          className="console-table-row group cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/businesses/${b.business_id}?run_id=${encodeURIComponent(runId)}`)
                          }
                        >
                          {/* Business Name & Meta */}
                          <td className="py-2.5 px-3">
                            <div className="font-sans font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors truncate max-w-[200px]">
                              {b.business_name}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate max-w-[200px] mt-0.5">
                              {b.website || b.phone || "No website URL"}
                            </div>
                          </td>

                          {/* 6-Stage Dot Matrix */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              {STAGE_CONFIG.map((st) => {
                                const exec = stages[st.key];
                                const stStatus = exec ? exec.status : "pending";
                                let dotColor = "bg-zinc-800 border-zinc-700";
                                if (stStatus === "completed") dotColor = "bg-emerald-500 border-emerald-400";
                                else if (stStatus === "running")
                                  dotColor = "bg-cyan-500 border-cyan-400 animate-pulse";
                                else if (stStatus === "failed") dotColor = "bg-rose-500 border-rose-400";
                                else if (stStatus === "skipped") dotColor = "bg-amber-500/60 border-amber-500/40";

                                return (
                                  <div
                                    key={st.key}
                                    title={`${st.label}: ${stStatus.toUpperCase()}`}
                                    className={`w-2 h-2 rounded-full border ${dotColor}`}
                                  />
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-1 capitalize truncate max-w-[140px]">
                              {b.current_stage ? b.current_stage.replace("_", " ") : b.status}
                            </div>
                          </td>

                          {/* Live Site Preview Link */}
                          <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                            {liveUrl ? (
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-[10px] transition-colors"
                              >
                                <span>Preview</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-zinc-600 text-[10px]">Pending</span>
                            )}
                          </td>

                          {/* Quick Retry & Inspection Action */}
                          <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {b.status === "failed" && (
                                <button
                                  onClick={(e) => handleRetryBusiness(b.business_id, e)}
                                  title="Retry Business"
                                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              )}
                              <Link
                                href={`/businesses/${b.business_id}?run_id=${encodeURIComponent(runId)}`}
                                className="p-1 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 transition-colors"
                                title="Inspect Business"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Structured Event Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <EventLogViewer
            events={events}
            selectedWorkerId={selectedWorkerId}
            onSelectWorker={setSelectedWorkerId}
            concurrency={concurrency}
            businesses={businesses}
            runId={runId}
          />
        </div>
      </div>
    </div>
  );
}
