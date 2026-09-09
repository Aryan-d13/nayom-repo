"use client";

import React from "react";
import { Globe, Sparkles, Zap, Server, Mail, Send } from "lucide-react";
import { PipelineSummary } from "@/lib/api";

export const STAGE_CONFIG = [
  { key: "website_collector", label: "Website Collector", shortLabel: "Collector", icon: Globe },
  { key: "website_intelligence", label: "Intelligence", shortLabel: "Intelligence", icon: Sparkles },
  { key: "website_generator", label: "Generator", shortLabel: "Generator", icon: Zap },
  { key: "deployment", label: "Deployment", shortLabel: "Deployment", icon: Server },
  { key: "email_generator", label: "Email Gen", shortLabel: "Email Gen", icon: Mail },
  { key: "email_sender", label: "Email Sender", shortLabel: "Email Sender", icon: Send },
];

interface StageFunnelProps {
  summary: PipelineSummary;
  totalBusinesses: number;
}

export default function StageFunnel({ summary: s, totalBusinesses }: StageFunnelProps) {
  const total = Math.max(1, totalBusinesses || s.businesses_found || s.found || s.requested || 1);

  const stageCounts: Record<string, number> = {
    website_collector: s.websites_collected || 0,
    website_intelligence: s.intelligence_completed || 0,
    website_generator: s.sites_generated || 0,
    deployment: s.sites_deployed || 0,
    email_generator: s.emails_generated || 0,
    email_sender: s.emails_sent || 0,
  };

  return (
    <div className="console-panel rounded border border-console-border p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
          7-STAGE PIPELINE FUNNEL
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          POOL: <strong className="text-zinc-300">{total}</strong> BUSINESSES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGE_CONFIG.map((st, idx) => {
          const count = stageCounts[st.key] || 0;
          const pct = Math.min(100, Math.round((count / total) * 100));
          const Icon = st.icon;
          const isComplete = count >= total && total > 0;
          const isActive = count > 0 && count < total;

          return (
            <div
              key={st.key}
              className={`p-2.5 rounded border ${
                isComplete
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                  : isActive
                  ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-300"
                  : "bg-console-subtle border-console-border text-zinc-400"
              } flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-zinc-500">0{idx + 1}</span>
                  <span className="font-semibold text-[11px] truncate">{st.shortLabel}</span>
                </div>
                <Icon className={`w-3.5 h-3.5 ${isComplete ? "text-emerald-400" : isActive ? "text-cyan-400" : "text-zinc-600"}`} />
              </div>

              <div>
                <div className="flex items-baseline justify-between font-mono text-xs mb-1">
                  <span className="font-bold text-sm text-zinc-100">{count}</span>
                  <span className="text-[10px] text-zinc-500">{pct}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full transition-all duration-300 ${
                      isComplete ? "bg-emerald-500" : isActive ? "bg-cyan-500" : "bg-zinc-700"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
