"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Search,
  Zap,
  Globe,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Sliders,
  Flame,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Server,
  Activity,
  ChevronDown,
  Terminal,
} from "lucide-react";
import {
  getGlobalStats,
  getRuns,
  createRun,
  pauseRun,
  resumeRun,
  cancelRun,
  retryRun,
  PipelineRunState,
  GlobalStatsResponse,
  CreateRunRequest,
} from "@/lib/api";

const PRESET_QUERIES = [
  "dentists in Austin Texas",
  "roofers in Miami Florida",
  "cosmetic surgeons in Los Angeles",
  "lawyers in Chicago Illinois",
  "gyms in Denver Colorado",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<GlobalStatsResponse | null>(null);
  const [runs, setRuns] = useState<PipelineRunState[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [query, setQuery] = useState("dentists in Austin Texas");
  const [limit, setLimit] = useState(10);
  const [concurrency, setConcurrency] = useState(5);
  const [dryRun, setDryRun] = useState(true);
  const [aiProvider, setAiProvider] = useState("gemini");
  const [deployProvider, setDeployProvider] = useState("vercel");
  const [emailProvider, setEmailProvider] = useState("gmail");
  const [templateOverride, setTemplateOverride] = useState("");
  const [maxRetries, setMaxRetries] = useState(2);
  const [delaySeconds, setDelaySeconds] = useState(0);
  const [fastMode, setFastMode] = useState(true);
  const [renderJs, setRenderJs] = useState(false);
  const [screenshot, setScreenshot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter State
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [statsData, runsData] = await Promise.all([
        getGlobalStats().catch(() => null),
        getRuns(100).catch(() => []),
      ]);
      if (statsData) setStats(statsData);
      if (runsData) setRuns(runsData);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2500);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleStartRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateRunRequest = {
        query: query.trim(),
        limit,
        concurrency,
        dry_run: dryRun,
        ai_provider: aiProvider || undefined,
        deploy_provider: deployProvider || undefined,
        email_provider: emailProvider || undefined,
        template_override: templateOverride || undefined,
        max_retries: maxRetries,
        delay_seconds: delaySeconds,
        fast_mode: fastMode,
        render_js: renderJs,
        screenshot: screenshot,
      };
      await createRun(payload);
      await loadData();
    } catch (err: any) {
      alert(`Failed to launch run: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePause = async (runId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(runId);
    try {
      await pauseRun(runId);
      await loadData();
    } catch (err: any) {
      alert(`Pause failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (runId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(runId);
    try {
      await resumeRun(runId);
      await loadData();
    } catch (err: any) {
      alert(`Resume failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (runId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to cancel this pipeline run?")) return;
    setActionLoading(runId);
    try {
      await cancelRun(runId);
      await loadData();
    } catch (err: any) {
      alert(`Cancel failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = async (runId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(runId);
    try {
      await retryRun(runId);
      await loadData();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRuns = runs.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        r.run_id.toLowerCase().includes(q) ||
        r.query.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeRunsCount = runs.filter((r) => r.status === "running").length;

  return (
    <div className="space-y-4">
      {/* 1. Global Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { label: "Active Runs", val: stats?.active_runs ?? activeRunsCount, color: "text-cyan-400 font-bold", isRunning: (stats?.active_runs ?? activeRunsCount) > 0 },
          { label: "Total Runs", val: stats?.total_runs ?? runs.length, color: "text-zinc-200" },
          { label: "Businesses", val: stats?.total_businesses ?? 0, color: "text-zinc-200" },
          { label: "Crawled", val: stats?.total_websites_crawled ?? 0, color: "text-sky-400" },
          { label: "Generated", val: stats?.total_sites_generated ?? 0, color: "text-indigo-400" },
          { label: "Deployed", val: stats?.total_sites_deployed ?? 0, color: "text-emerald-400 font-semibold" },
          { label: "Emails Sent", val: stats?.total_emails_sent ?? 0, color: "text-amber-400" },
          { label: "Success Rate", val: `${stats?.success_rate ?? 0}%`, color: "text-emerald-400 font-bold" },
        ].map((m) => (
          <div key={m.label} className="console-panel p-2.5 rounded border border-console-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500">
              <span>{m.label}</span>
              {m.isRunning && <span className="status-dot status-dot-running" />}
            </div>
            <div className={`text-lg font-mono num-metric mt-1 ${m.color}`}>
              {m.val}
            </div>
          </div>
        ))}
      </div>

      {/* 2. New Pipeline Run Launcher (Command Console Style) */}
      <div className="console-panel rounded border border-console-border p-4">
        <div className="flex items-center justify-between border-b border-console-border pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-200">
              LAUNCH PIPELINE RUN
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            CONCURRENCY ENGINE: <strong className="text-cyan-400">{concurrency} WORKERS</strong>
          </span>
        </div>

        <form onSubmit={handleStartRun} className="space-y-3">
          {/* Main Query Bar & Action Button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. dentists in Austin Texas, roofers in Miami FL..."
                className="w-full pl-3 pr-3 py-2 bg-console-subtle border border-console-border focus:border-cyan-500 rounded text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Quick Limit */}
            <div className="flex items-center gap-1.5 bg-console-subtle border border-console-border px-2.5 py-1 rounded text-xs font-mono">
              <span className="text-zinc-500 text-[11px]">LIMIT:</span>
              <input
                type="number"
                min={1}
                max={200}
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value, 10) || 10)}
                className="w-12 bg-transparent text-white font-bold focus:outline-none text-right"
              />
            </div>

            {/* Concurrency Selector */}
            <div className="flex items-center gap-1.5 bg-console-subtle border border-console-border px-2.5 py-1 rounded text-xs font-mono">
              <span className="text-zinc-500 text-[11px]">WORKERS:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={concurrency}
                onChange={(e) => setConcurrency(parseInt(e.target.value, 10) || 5)}
                className="w-10 bg-transparent text-cyan-400 font-bold focus:outline-none text-right"
              />
            </div>

            {/* Dry Run Toggle */}
            <label className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-console-subtle border border-console-border text-xs font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-cyan-500"
              />
              <span className={dryRun ? "text-amber-400 font-semibold" : "text-rose-400 font-semibold"}>
                {dryRun ? "DRY RUN" : "LIVE SEND"}
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>EXECUTE RUN</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Queries */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
            <span className="text-zinc-500">PRESETS:</span>
            {PRESET_QUERIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setQuery(p)}
                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Collapsible Advanced Parameters */}
          <div className="pt-2 border-t border-console-border">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              <span>ADVANCED ENGINE CONFIGURATION</span>
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-2.5 p-3 rounded bg-console-subtle border border-console-border text-xs font-mono">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">AI Provider</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs focus:outline-none"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="mock">Mock Intelligence</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Deploy Provider</label>
                  <select
                    value={deployProvider}
                    onChange={(e) => setDeployProvider(e.target.value)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs focus:outline-none"
                  >
                    <option value="vercel">Vercel (Production)</option>
                    <option value="mock">Mock Deployer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Email Provider</label>
                  <select
                    value={emailProvider}
                    onChange={(e) => setEmailProvider(e.target.value)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs focus:outline-none"
                  >
                    <option value="gmail">Gmail OAuth / SMTP</option>
                    <option value="mock">Mock Email Sender</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Max Retries</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(parseInt(e.target.value, 10) || 2)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Throttle (sec)</label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs focus:outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fastMode}
                      onChange={(e) => setFastMode(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-cyan-500"
                    />
                    <span>Scraper Fast Mode</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={renderJs}
                      onChange={(e) => setRenderJs(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-cyan-500"
                    />
                    <span>Render Collector JS</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* 3. Pipeline Runs Console Table */}
      <div className="console-panel rounded border border-console-border overflow-hidden">
        {/* Table Filter / Control Bar */}
        <div className="p-3 border-b border-console-border bg-console-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-100">
              PIPELINE EXECUTION LOGS
            </h3>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
              {filteredRuns.length} RUNS
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Search Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search run ID or query..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-6 pr-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-48 font-mono"
              />
              <Search className="w-3 h-3 text-zinc-500 absolute left-1.5 top-2" />
            </div>

            <button
              onClick={loadData}
              className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors"
              title="Refresh Runs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dense Runs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-console-subtle text-zinc-400 uppercase text-[10px] tracking-wider border-b border-console-border">
              <tr>
                <th className="py-2.5 px-3">Run & Query</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Workers</th>
                <th className="py-2.5 px-3">Progress (Succeeded / Total)</th>
                <th className="py-2.5 px-3">Sites / Emails</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-console-border">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 text-xs">
                    {loading ? "Loading pipeline runs..." : "No pipeline runs located."}
                  </td>
                </tr>
              ) : (
                filteredRuns.map((r) => {
                  const isRunning = r.status === "running";
                  const isPaused = r.status === "paused";
                  const isCompleted = r.status === "completed";
                  const isFailed = r.status === "failed";
                  const isCancelled = r.status === "cancelled";

                  const s = r.summary;
                  const total = r.total_businesses || s.businesses_found || s.found || r.config?.limit || 1;
                  const succ = s.succeeded || 0;
                  const pct = Math.min(100, Math.round((succ / (total || 1)) * 100));

                  return (
                    <tr
                      key={r.run_id}
                      className="console-table-row group cursor-pointer"
                      onClick={() => (window.location.href = `/runs/${r.run_id}`)}
                    >
                      {/* Run ID & Query */}
                      <td className="py-2.5 px-3">
                        <div className="font-sans font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors truncate max-w-[260px]">
                          {r.query || "Pipeline Run"}
                        </div>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <span>{r.run_id}</span>
                          <span>•</span>
                          <span>{new Date(r.started_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
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
                            className={`text-[10px] uppercase font-bold ${
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
                            {r.status}
                          </span>
                        </div>
                      </td>

                      {/* Workers */}
                      <td className="py-2.5 px-3">
                        <span className="text-zinc-300 font-semibold">{r.config?.concurrency || 5}</span>
                        <span className="text-zinc-500 text-[10px]"> w</span>
                      </td>

                      {/* Progress Bar */}
                      <td className="py-2.5 px-3 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-zinc-200">
                            {succ} <span className="text-zinc-500">/ {total}</span>
                          </span>
                          <span className="text-zinc-400 text-[10px]">{pct}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full transition-all ${
                              isCompleted ? "bg-emerald-500" : isFailed ? "bg-rose-500" : "bg-cyan-500"
                            }`}
                          />
                        </div>
                      </td>

                      {/* Sites / Emails */}
                      <td className="py-2.5 px-3 text-[11px]">
                        <div className="text-emerald-400">
                          {s.sites_deployed || 0} <span className="text-zinc-500 text-[10px]">deployed</span>
                        </div>
                        <div className="text-amber-400">
                          {s.emails_sent || 0} <span className="text-zinc-500 text-[10px]">emails</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-2.5 px-3 text-[11px] text-zinc-300">
                        {r.duration_seconds > 0 ? `${r.duration_seconds.toFixed(1)}s` : isRunning ? "Running..." : "—"}
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {isRunning && (
                            <>
                              <button
                                onClick={(e) => handlePause(r.run_id, e)}
                                disabled={actionLoading === r.run_id}
                                title="Pause"
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 transition-colors"
                              >
                                <Pause className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => handleCancel(r.run_id, e)}
                                disabled={actionLoading === r.run_id}
                                title="Cancel"
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-rose-300 border border-zinc-700 transition-colors"
                              >
                                <Square className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {isPaused && (
                            <button
                              onClick={(e) => handleResume(r.run_id, e)}
                              disabled={actionLoading === r.run_id}
                              title="Resume"
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-700 transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          )}

                          {(isCompleted || isFailed || isCancelled) && (
                            <button
                              onClick={(e) => handleRetry(r.run_id, e)}
                              disabled={actionLoading === r.run_id}
                              title="Retry Failed Stages"
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}

                          <Link
                            href={`/runs/${r.run_id}`}
                            className="p-1 rounded bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 transition-colors"
                            title="Open Run Detail Console"
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
  );
}
