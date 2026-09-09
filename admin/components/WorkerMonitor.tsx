"use client";

import React, { useMemo } from "react";
import { Cpu, CheckCircle2, AlertTriangle, AlertCircle, Clock, Play, Layers, ExternalLink } from "lucide-react";
import { BusinessRunState, PipelineEvent } from "@/lib/api";

export interface WorkerSlot {
  workerId: number; // 1-indexed (e.g. 1, 2, ... N)
  workerName: string; // e.g. "Worker 01"
  status: "running" | "idle" | "completed" | "failed" | "paused";
  businessId: string | null;
  businessName: string | null;
  stage: string | null;
  stageLabel: string | null;
  durationSeconds: number;
  errorCount: number;
  warningCount: number;
  totalProcessed: number;
  lastEventMessage?: string;
}

interface WorkerMonitorProps {
  concurrency: number;
  businesses: BusinessRunState[];
  events: PipelineEvent[];
  selectedWorkerId: number | null; // null means "All Workers"
  onSelectWorker: (workerId: number | null) => void;
  runStatus: string;
}

const STAGE_NAME_MAP: Record<string, string> = {
  website_collector: "Website Collector",
  website_intelligence: "Intelligence",
  website_generator: "Generator",
  deployment: "Deployment",
  email_generator: "Email Gen",
  email_sender: "Email Sender",
};

export default function WorkerMonitor({
  concurrency,
  businesses,
  events,
  selectedWorkerId,
  onSelectWorker,
  runStatus,
}: WorkerMonitorProps) {
  // Dynamically compute worker slot states
  const workerSlots: WorkerSlot[] = useMemo(() => {
    const totalSlots = Math.max(1, concurrency || 1);
    const slots: WorkerSlot[] = [];

    // Initialize all slots as idle
    for (let i = 1; i <= totalSlots; i++) {
      const numStr = i < 10 ? `0${i}` : `${i}`;
      slots.push({
        workerId: i,
        workerName: `Worker ${numStr}`,
        status: runStatus === "running" ? "idle" : runStatus === "paused" ? "paused" : runStatus === "failed" ? "failed" : "completed",
        businessId: null,
        businessName: null,
        stage: null,
        stageLabel: null,
        durationSeconds: 0,
        errorCount: 0,
        warningCount: 0,
        totalProcessed: 0,
      });
    }

    // Partition businesses across worker slots
    // 1. First assign running businesses to slots
    const runningBiz = businesses.filter((b) => b.status === "running");
    const failedBiz = businesses.filter((b) => b.status === "failed");
    const completedBiz = businesses.filter((b) => b.status === "completed");

    // Track processed counts per slot using modulo mapping as a baseline
    businesses.forEach((b, index) => {
      const slotIdx = index % totalSlots;
      slots[slotIdx].totalProcessed += 1;
      if (b.status === "failed") {
        slots[slotIdx].errorCount += 1;
      }
    });

    if (runStatus === "running") {
      // Map active running businesses to slots
      runningBiz.forEach((b, idx) => {
        const slotIdx = idx % totalSlots;
        const currentStageKey = b.current_stage || "website_collector";
        const stageExec = b.stages?.[currentStageKey];
        
        let duration = stageExec?.duration_seconds || 0;
        if (stageExec?.started_at && (!stageExec.duration_seconds || stageExec.status === "running")) {
          const startMs = new Date(stageExec.started_at).getTime();
          if (!isNaN(startMs)) {
            duration = Math.max(0, Math.round((Date.now() - startMs) / 100) / 10);
          }
        }

        slots[slotIdx].status = "running";
        slots[slotIdx].businessId = b.business_id;
        slots[slotIdx].businessName = b.business_name;
        slots[slotIdx].stage = currentStageKey;
        slots[slotIdx].stageLabel = STAGE_NAME_MAP[currentStageKey] || currentStageKey;
        slots[slotIdx].durationSeconds = duration;
      });
    } else if (runStatus === "completed") {
      // Show latest completed info
      slots.forEach((slot, idx) => {
        slot.status = "completed";
        const assigned = businesses.filter((_, i) => i % totalSlots === idx);
        const lastBiz = assigned[assigned.length - 1];
        if (lastBiz) {
          slot.businessId = lastBiz.business_id;
          slot.businessName = lastBiz.business_name;
          slot.stage = "completed";
          slot.stageLabel = "All Stages Finished";
        }
      });
    } else if (runStatus === "paused") {
      slots.forEach((slot) => {
        slot.status = "paused";
      });
    }

    return slots;
  }, [concurrency, businesses, runStatus]);

  const activeCount = workerSlots.filter((w) => w.status === "running").length;
  const idleCount = workerSlots.filter((w) => w.status === "idle").length;
  const failedCount = workerSlots.filter((w) => w.status === "failed" || w.errorCount > 0).length;

  return (
    <div className="console-panel rounded border border-console-border p-3 space-y-3">
      {/* Header & Worker Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-console-border pb-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-200">
              WORKER FLEET MONITOR
            </h3>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
            {concurrency} WORKERS CONCURRENT
          </span>
        </div>

        {/* Fleet Summary Pills & Filter */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
            <span className="status-dot status-dot-running" />
            <span>{activeCount} RUNNING</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
            <span className="status-dot status-dot-idle" />
            <span>{idleCount} IDLE</span>
          </div>
          {failedCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300">
              <span className="status-dot status-dot-failed" />
              <span>{failedCount} FAILED</span>
            </div>
          )}

          <button
            onClick={() => onSelectWorker(null)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedWorkerId === null
                ? "bg-zinc-700 text-white font-bold border border-zinc-500"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            All Workers
          </button>
        </div>
      </div>

      {/* Multi-Worker Grid Matrix (Supports 1, 5, 10, 20+ workers cleanly) */}
      <div
        className={`grid gap-2 ${
          concurrency === 1
            ? "grid-cols-1"
            : concurrency <= 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : concurrency <= 10
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        }`}
      >
        {workerSlots.map((worker) => {
          const isSelected = selectedWorkerId === worker.workerId;
          const isRunning = worker.status === "running";
          const isFailed = worker.status === "failed";
          const isCompleted = worker.status === "completed";
          const isIdle = worker.status === "idle";

          return (
            <div
              key={worker.workerId}
              onClick={() => onSelectWorker(isSelected ? null : worker.workerId)}
              className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                isSelected
                  ? "bg-zinc-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-console-sm"
                  : isRunning
                  ? "bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-500/70"
                  : isFailed
                  ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-500/70"
                  : isCompleted
                  ? "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/60"
                  : "bg-console-subtle border-console-border hover:border-zinc-700"
              }`}
            >
              {/* Top: Worker ID & Status Pill */}
              <div className="flex items-center justify-between gap-1 mb-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <span
                    className={`status-dot ${
                      isRunning
                        ? "status-dot-running"
                        : isFailed
                        ? "status-dot-failed"
                        : isCompleted
                        ? "status-dot-success"
                        : "status-dot-idle"
                    }`}
                  />
                  <span className={isSelected ? "text-cyan-300" : isRunning ? "text-cyan-400" : "text-zinc-200"}>
                    {worker.workerName}
                  </span>
                </div>

                <span
                  className={`text-[9px] uppercase font-semibold px-1 py-0.2 rounded ${
                    isRunning
                      ? "bg-cyan-500/20 text-cyan-300"
                      : isFailed
                      ? "bg-rose-500/20 text-rose-300"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {worker.status}
                </span>
              </div>

              {/* Middle: Assigned Business Name */}
              <div className="text-xs font-semibold text-zinc-100 truncate mb-1" title={worker.businessName || "Idle"}>
                {worker.businessName || <span className="text-zinc-500 font-mono font-normal text-[11px]">— No active task —</span>}
              </div>

              {/* Bottom: Current Stage & Duration */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-console-border/60">
                <span className="truncate max-w-[120px]" title={worker.stageLabel || "Idle"}>
                  {worker.stageLabel || "Idle"}
                </span>

                {isRunning && worker.durationSeconds > 0 ? (
                  <span className="text-cyan-300 font-semibold">{worker.durationSeconds.toFixed(1)}s</span>
                ) : worker.totalProcessed > 0 ? (
                  <span className="text-zinc-500">{worker.totalProcessed} processed</span>
                ) : (
                  <span className="text-zinc-600">0.0s</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
