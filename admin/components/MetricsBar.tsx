"use client";

import React from "react";
import { PipelineSummary } from "@/lib/api";

interface MetricsBarProps {
  summary: PipelineSummary;
  totalBusinesses?: number;
}

export default function MetricsBar({ summary: s, totalBusinesses }: MetricsBarProps) {
  const items = [
    { label: "Requested", val: s.requested || totalBusinesses || 0, color: "text-zinc-300", bg: "bg-zinc-900/40" },
    { label: "Attempted", val: s.attempted || s.requested || 0, color: "text-zinc-400", bg: "bg-zinc-900/40" },
    { label: "Found", val: s.found || s.businesses_found || 0, color: "text-sky-400", bg: "bg-sky-950/20" },
    { label: "Usable", val: s.usable || s.found || 0, color: "text-cyan-400", bg: "bg-cyan-950/20" },
    { label: "Processed", val: s.processed || 0, color: "text-indigo-400", bg: "bg-indigo-950/20" },
    { label: "Succeeded", val: s.succeeded || 0, color: "text-emerald-400", bg: "bg-emerald-950/20" },
    { label: "Failed", val: s.failed || 0, color: s.failed > 0 ? "text-rose-400 font-bold" : "text-zinc-500", bg: s.failed > 0 ? "bg-rose-950/30 border-rose-500/30" : "bg-zinc-900/40" },
    { label: "Skipped", val: s.skipped || 0, color: "text-amber-400", bg: "bg-amber-950/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map((m) => (
        <div
          key={m.label}
          className={`console-panel p-2.5 rounded border border-console-border ${m.bg} flex flex-col justify-between`}
        >
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
            {m.label}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-xl font-mono num-metric ${m.color}`}>
              {m.val}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
