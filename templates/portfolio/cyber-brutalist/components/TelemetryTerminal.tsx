'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Shield, RefreshCw, Check } from 'lucide-react';
import { SiteData } from '../lib/site-data';

interface TelemetryTerminalProps {
  siteData: SiteData;
}

export default function TelemetryTerminal({ siteData }: TelemetryTerminalProps) {
  const [logs, setLogs] = useState<string[]>(siteData.about.terminalLogs);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'STACK' | 'BENCHMARK'>('TELEMETRY');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Dynamic streaming logs to simulate active system computation
    const logInterval = setInterval(() => {
      const timestamp = new Date().toISOString().substring(11, 19);
      const randomPings = [
        `[${timestamp}] NODE_EDGE_US_WEST: ACK 0.04ms // ROUTE OPTIMAL`,
        `[${timestamp}] MEM_ALLOC: 412MB GC_PAUSE: 0.00ms`,
        `[${timestamp}] SHADER_PIPELINE: 120 FPS FLUSH COMPLETED`,
        `[${timestamp}] SEC_GUARD: ZERO VULNERABILITIES DETECTED [TLS 1.3]`,
        `[${timestamp}] REDIS_PUB_SUB: 48,920 ACTIVE SUBSCRIBERS`,
      ];
      const nextLog = randomPings[Math.floor(Math.random() * randomPings.length)];

      setLogs((prev) => {
        const updated = [...prev, nextLog];
        return updated.length > 8 ? updated.slice(updated.length - 8) : updated;
      });
    }, 2800);

    return () => clearInterval(logInterval);
  }, []);

  const copyTelemetry = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#050505] border-2 border-[rgba(255,255,255,0.2)] hover:border-[#FFE600] transition-colors rounded-ui overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Terminal Window Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0C0D10] border-b border-[rgba(255,255,255,0.15)]">
        {/* Terminal Window Controls */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-3 font-mono text-[11px] text-[rgba(255,255,255,0.7)] uppercase tracking-wider hidden sm:inline">
            SYS.TELEMETRY // {siteData.site.systemVersion}
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1">
          {(['TELEMETRY', 'STACK', 'BENCHMARK'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
              className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-[#FFE600] text-[#050505]'
                  : 'text-[rgba(255,255,255,0.5)] hover:text-[#FFFFFF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 sm:p-6 font-mono text-xs leading-relaxed min-h-[260px] flex flex-col justify-between">
        {activeTab === 'TELEMETRY' && (
          <div className="space-y-1.5 overflow-hidden">
            <div className="flex items-center gap-2 text-[#00FF88] mb-3 pb-2 border-b border-[rgba(255,255,255,0.1)]">
              <Shield className="w-4 h-4" />
              <span>LIVE TELEMETRY STREAM // ENCRYPTION ACTIVE</span>
            </div>
            {logs.map((log, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  index === logs.length - 1
                    ? 'text-[#FFE600] font-bold animate-pulse'
                    : 'text-[rgba(255,255,255,0.75)]'
                }`}
              >
                <span className="text-[#FFE600] select-none">&gt;</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'STACK' && (
          <div className="space-y-3">
            <span className="text-[#FFE600] font-bold block mb-2">
              CORE INFRASTRUCTURE BLUEPRINTS
            </span>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-[#0C0D10] border border-[rgba(255,255,255,0.1)]">
                <span className="text-[rgba(255,255,255,0.5)] block">COMPUTE</span>
                <span className="text-[#FFFFFF] font-bold">RUST / TOKIO / WASM</span>
              </div>
              <div className="p-2.5 bg-[#0C0D10] border border-[rgba(255,255,255,0.1)]">
                <span className="text-[rgba(255,255,255,0.5)] block">SURFACE</span>
                <span className="text-[#FFFFFF] font-bold">NEXT.JS 14 / TYPESCRIPT</span>
              </div>
              <div className="p-2.5 bg-[#0C0D10] border border-[rgba(255,255,255,0.1)]">
                <span className="text-[rgba(255,255,255,0.5)] block">GRAPHICS</span>
                <span className="text-[#FFFFFF] font-bold">WEBGL / GLSL SHADERS</span>
              </div>
              <div className="p-2.5 bg-[#0C0D10] border border-[rgba(255,255,255,0.1)]">
                <span className="text-[rgba(255,255,255,0.5)] block">ORCHESTRATION</span>
                <span className="text-[#FFFFFF] font-bold">KUBERNETES / CLOUDFLARE</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'BENCHMARK' && (
          <div className="space-y-3">
            <span className="text-[#00FF88] font-bold block mb-2">
              AUDITED RUNTIME BENCHMARKS
            </span>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>P99 RESPONSE TIME</span>
                  <span className="text-[#FFE600] font-bold">12ms</span>
                </div>
                <div className="w-full h-2 bg-[rgba(255,255,255,0.1)]">
                  <div className="w-[94%] h-full bg-[#FFE600]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>GPU FRAME BUDGET (120 FPS)</span>
                  <span className="text-[#00FF88] font-bold">8.3ms / 8.3ms</span>
                </div>
                <div className="w-full h-2 bg-[rgba(255,255,255,0.1)]">
                  <div className="w-[100%] h-full bg-[#00FF88]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>LIGHTHOUSE PERFORMANCE</span>
                  <span className="text-[#00F0FF] font-bold">100 / 100</span>
                </div>
                <div className="w-full h-2 bg-[rgba(255,255,255,0.1)]">
                  <div className="w-[100%] h-full bg-[#00F0FF]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between text-[10px] text-[rgba(255,255,255,0.5)]">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>SHELL: ZSH // NODE: 20.x</span>
          </div>

          <button
            onClick={copyTelemetry}
            type="button"
            className="flex items-center gap-1.5 text-[#FFE600] hover:underline"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#00FF88]" />
                <span className="text-[#00FF88]">COPIED</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                <span>COPY LOGS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
