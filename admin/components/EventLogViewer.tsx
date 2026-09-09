"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Filter,
  Search,
  Pause,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Cpu,
} from "lucide-react";
import { PipelineEvent, BusinessRunState } from "@/lib/api";

interface EventLogViewerProps {
  events: PipelineEvent[];
  selectedWorkerId: number | null;
  onSelectWorker: (workerId: number | null) => void;
  concurrency: number;
  businesses: BusinessRunState[];
  runId: string;
}

export default function EventLogViewer({
  events,
  selectedWorkerId,
  onSelectWorker,
  concurrency,
  businesses,
  runId,
}: EventLogViewerProps) {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new events arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events, autoScroll]);

  // Derive business IDs associated with selected worker
  const selectedWorkerBusinesses = React.useMemo(() => {
    if (selectedWorkerId === null) return null;
    const totalSlots = Math.max(1, concurrency || 1);
    const targetIdx = selectedWorkerId - 1;
    const bizIds = new Set<string>();

    businesses.forEach((b, idx) => {
      if (idx % totalSlots === targetIdx) {
        bizIds.add(b.business_id);
      }
    });

    return bizIds;
  }, [selectedWorkerId, concurrency, businesses]);

  // Current active business on this worker if selected
  const activeWorkerBiz = React.useMemo(() => {
    if (selectedWorkerId === null) return null;
    const totalSlots = Math.max(1, concurrency || 1);
    const targetIdx = selectedWorkerId - 1;

    // First look for currently running business
    const running = businesses.filter((b) => b.status === "running");
    for (let i = 0; i < running.length; i++) {
      if (i % totalSlots === targetIdx) {
        return running[i];
      }
    }

    // Otherwise return latest assigned
    const assigned = businesses.filter((_, idx) => idx % totalSlots === targetIdx);
    return assigned[assigned.length - 1] || null;
  }, [selectedWorkerId, concurrency, businesses]);

  // Filter events
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      // 1. Worker filter
      if (selectedWorkerBusinesses && evt.business_id) {
        if (!selectedWorkerBusinesses.has(evt.business_id)) {
          return false;
        }
      }

      // 2. Level filter
      if (levelFilter !== "all" && evt.level !== levelFilter) {
        return false;
      }

      // 3. Stage filter
      if (stageFilter !== "all" && evt.stage !== stageFilter) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const msg = (evt.message || "").toLowerCase();
        const biz = (evt.business_name || "").toLowerCase();
        const st = (evt.stage || "").toLowerCase();
        if (!msg.includes(q) && !biz.includes(q) && !st.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedWorkerBusinesses, levelFilter, stageFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const workerNumStr = selectedWorkerId ? (selectedWorkerId < 10 ? `0${selectedWorkerId}` : `${selectedWorkerId}`) : null;

  return (
    <div className="console-panel rounded border border-console-border flex flex-col h-[700px] overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-2.5 border-b border-console-border bg-console-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-100">
            {selectedWorkerId ? `WORKER ${workerNumStr} STRUCTURED LOGS` : "STRUCTURED EVENT STREAM"}
          </h3>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
            {filteredEvents.length} EVENTS
          </span>
        </div>

        {/* Worker Switcher & Auto-Scroll Controller */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={selectedWorkerId === null ? "all" : String(selectedWorkerId)}
            onChange={(e) => onSelectWorker(e.target.value === "all" ? null : parseInt(e.target.value, 10))}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-[11px] text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Fleet: All Workers</option>
            {Array.from({ length: Math.max(1, concurrency || 1) }, (_, i) => {
              const num = i + 1;
              const nStr = num < 10 ? `0${num}` : `${num}`;
              return (
                <option key={num} value={String(num)}>
                  Worker {nStr}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
              autoScroll
                ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/40"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200"
            }`}
            title={autoScroll ? "Click to pause auto-scrolling" : "Click to enable live auto-scrolling"}
          >
            {autoScroll ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Live Scroll</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Worker Context Banner (When a specific worker is selected) */}
      {selectedWorkerId !== null && (
        <div className="px-3 py-2 bg-zinc-900/90 border-b border-console-border text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase">Worker</span>
            <div className="font-bold text-cyan-400">Worker {workerNumStr}</div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase">Assigned Business</span>
            <div className="font-semibold text-zinc-200 truncate">
              {activeWorkerBiz?.business_name || "Idle / Queue"}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase">Current Stage</span>
            <div className="text-indigo-300 truncate">
              {activeWorkerBiz?.current_stage ? activeWorkerBiz.current_stage.replace("_", " ") : "Idle"}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase">Status</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`status-dot ${
                  activeWorkerBiz?.status === "running"
                    ? "status-dot-running"
                    : activeWorkerBiz?.status === "failed"
                    ? "status-dot-failed"
                    : activeWorkerBiz?.status === "completed"
                    ? "status-dot-success"
                    : "status-dot-idle"
                }`}
              />
              <span className="uppercase text-zinc-300 font-semibold">{activeWorkerBiz?.status || "Idle"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar (Severity, Stage, Search) */}
      <div className="p-2 border-b border-console-border bg-console-subtle flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {["all", "info", "success", "warning", "error"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                levelFilter === lvl
                  ? lvl === "error"
                    ? "bg-rose-950 text-rose-300 border border-rose-500/50"
                    : lvl === "warning"
                    ? "bg-amber-950 text-amber-300 border border-amber-500/50"
                    : lvl === "success"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                    : "bg-zinc-700 text-white border border-zinc-500"
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-[10px] text-zinc-300 focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="website_collector">Website Collector</option>
            <option value="website_intelligence">Intelligence</option>
            <option value="website_generator">Generator</option>
            <option value="deployment">Deployment</option>
            <option value="email_generator">Email Generator</option>
            <option value="email_sender">Email Sender</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 w-32 sm:w-40 font-mono"
            />
            <Search className="w-3 h-3 text-zinc-500 absolute left-1.5 top-1.5" />
          </div>
        </div>
      </div>

      {/* Log Feed Body */}
      <div
        ref={containerRef}
        className="flex-1 p-2.5 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[#08080a]"
      >
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-zinc-600">
            No structured events match the current filter criteria for {runId}.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isExpanded = !!expandedEvents[evt.event_id];
            const hasMetadata = evt.metadata && Object.keys(evt.metadata).length > 0;
            const isErr = evt.level === "error" || evt.status === "failed";
            const isWarn = evt.level === "warning" || evt.status === "paused" || evt.status === "cancelled";
            const isSucc = evt.level === "success" || evt.status === "completed";

            const timeStr = evt.timestamp
              ? new Date(evt.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  fractionalSecondDigits: 3,
                })
              : "--:--:--.---";

            return (
              <div
                key={evt.event_id}
                className={`p-2 rounded border transition-colors leading-relaxed ${
                  isErr
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                    : isWarn
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                    : isSucc
                    ? "bg-emerald-950/15 border-emerald-500/25 text-emerald-200"
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300"
                }`}
              >
                {/* Event Top Line */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-zinc-500 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 font-bold">{timeStr}</span>

                    {evt.stage && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-indigo-300 font-mono">
                        {evt.stage}
                      </span>
                    )}

                    {evt.business_name && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-300 truncate max-w-[140px]" title={evt.business_name}>
                        {evt.business_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {evt.duration_ms !== undefined && evt.duration_ms !== null && (
                      <span className="text-zinc-500">
                        {evt.duration_ms > 1000 ? `${(evt.duration_ms / 1000).toFixed(2)}s` : `${evt.duration_ms.toFixed(0)}ms`}
                      </span>
                    )}
                    <span
                      className={`text-[9px] uppercase font-bold px-1 rounded ${
                        isErr
                          ? "bg-rose-500/20 text-rose-400"
                          : isWarn
                          ? "bg-amber-500/20 text-amber-400"
                          : isSucc
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                </div>

                {/* Event Message */}
                <div className="break-words font-mono text-[11px] text-zinc-200">
                  {evt.message}
                </div>

                {/* Expandable JSON Metadata Inspector */}
                {hasMetadata && (
                  <div className="mt-1 pt-1 border-t border-console-border/40">
                    <button
                      onClick={() => toggleExpand(evt.event_id)}
                      className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span>Metadata payload ({Object.keys(evt.metadata).length} fields)</span>
                    </button>

                    {isExpanded && (
                      <pre className="mt-1 p-2 rounded bg-black/80 border border-zinc-800 text-[10px] text-cyan-300/90 overflow-x-auto">
                        {JSON.stringify(evt.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
