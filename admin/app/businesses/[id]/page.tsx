"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Mail,
  Zap,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Send,
  Building,
  Phone,
  MapPin,
  Star,
  Layers,
  Code2,
  Terminal,
  RefreshCw,
  Eye,
  Server,
  FileText,
  Cpu,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  getBusinessDetail,
  retryRun,
  BusinessDetailResponse,
  PipelineEvent,
} from "@/lib/api";
import { STAGE_CONFIG } from "@/components/StageFunnel";

export default function BusinessDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessId = params.id as string;
  const runId = searchParams.get("run_id") || undefined;

  const [biz, setBiz] = useState<BusinessDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"intel" | "site_raw" | "generator" | "email" | "events">("intel");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async () => {
    try {
      const data = await getBusinessDetail(businessId, runId);
      setBiz(data);
    } catch (err) {
      console.error("Error loading business detail", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, runId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleRetry = async (stage?: string) => {
    if (!runId) {
      alert("Cannot retry: parent run ID is not attached to this view.");
      return;
    }
    setRetrying(true);
    try {
      await retryRun(runId, stage, businessId);
      await loadData();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    } finally {
      setRetrying(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading && !biz) {
    return (
      <div className="py-24 text-center font-mono space-y-3">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
        <p className="text-xs text-zinc-400">Loading business inspection data for {businessId}...</p>
      </div>
    );
  }

  if (!biz) {
    return (
      <div className="py-24 text-center space-y-4 font-mono">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Business Not Found</h2>
        <p className="text-xs text-zinc-400">Could not locate state record for: {businessId}</p>
        <Link
          href={runId ? `/runs/${runId}` : "/"}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Parent
        </Link>
      </div>
    );
  }

  const intel = biz.intelligence;
  const siteData = biz.site_data;
  const deploy = biz.deployment;
  const emailDraft = biz.email_draft;
  const emailDel = biz.email_delivery;
  const bData = biz.business_data || {};
  const websiteRaw = biz.website_data;

  const deployedUrl =
    deploy?.url ||
    (biz.stages?.["deployment"]?.output_ref?.startsWith("http")
      ? biz.stages["deployment"].output_ref
      : null);

  const isCompleted = biz.status === "completed";
  const isRunning = biz.status === "running";
  const isFailed = biz.status === "failed";

  return (
    <div className="space-y-3">
      {/* 1. Business Header Console */}
      <div className="console-panel rounded border border-console-border p-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={runId ? `/runs/${runId}` : "/"}
                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
                title="Back to Run Console"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
              <h1 className="font-sans font-bold text-lg text-white tracking-tight">
                {biz.business_name}
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono">
                <span
                  className={`status-dot ${
                    isCompleted
                      ? "status-dot-success"
                      : isRunning
                      ? "status-dot-running"
                      : isFailed
                      ? "status-dot-failed"
                      : "status-dot-idle"
                  }`}
                />
                <span
                  className={`uppercase font-bold text-[11px] ${
                    isCompleted
                      ? "text-emerald-400"
                      : isRunning
                      ? "text-cyan-400"
                      : isFailed
                      ? "text-rose-400"
                      : "text-zinc-400"
                  }`}
                >
                  {biz.status}
                </span>
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
              <span>
                ID: <strong className="text-zinc-200">{biz.business_id}</strong>
              </span>
              {biz.website && (
                <>
                  <span>•</span>
                  <a
                    href={biz.website.startsWith("http") ? biz.website : `https://${biz.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{biz.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
              {biz.phone && (
                <>
                  <span>•</span>
                  <span>{biz.phone}</span>
                </>
              )}
              {biz.email && (
                <>
                  <span>•</span>
                  <span className="text-amber-300">{biz.email}</span>
                </>
              )}
              {bData?.rating && (
                <>
                  <span>•</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <strong>{bData.rating}</strong> ({bData.reviews_count || 0})
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {runId && isFailed && (
              <button
                onClick={() => handleRetry()}
                disabled={retrying}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Business</span>
              </button>
            )}

            {deployedUrl && (
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-black transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Deployed Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={loadData}
              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chronological Stage Execution Timeline */}
      <div className="console-panel rounded border border-console-border p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            STAGE EXECUTION TIMELINE
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            CURRENT STAGE: <strong className="text-cyan-400 uppercase">{biz.current_stage || "FINISHED"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-xs">
          {STAGE_CONFIG.map((st, idx) => {
            const exec = biz.stages?.[st.key];
            const stStatus = exec?.status || "pending";
            const duration = exec?.duration_seconds || 0;
            const hasError = !!exec?.error;
            const Icon = st.icon;

            return (
              <div
                key={st.key}
                className={`p-2 rounded border flex flex-col justify-between ${
                  stStatus === "completed"
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : stStatus === "running"
                    ? "bg-cyan-950/20 border-cyan-500/40 text-cyan-300 ring-1 ring-cyan-500/40"
                    : stStatus === "failed"
                    ? "bg-rose-950/30 border-rose-500/40 text-rose-300"
                    : stStatus === "skipped"
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                    : "bg-console-subtle border-console-border text-zinc-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-zinc-500">0{idx + 1}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1 rounded ${
                      stStatus === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : stStatus === "running"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : stStatus === "failed"
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {stStatus}
                  </span>
                </div>

                <div className="font-semibold text-zinc-100 text-[11px] truncate mb-1">
                  {st.shortLabel}
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-console-border/40">
                  <span>{duration > 0 ? `${duration.toFixed(1)}s` : "0.0s"}</span>
                  {exec?.retry_count ? (
                    <span className="text-amber-400">{exec.retry_count} retries</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep Operational Inspection Workbench (Tabs) */}
      <div className="console-panel rounded border border-console-border overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-console-border bg-console-subtle flex flex-wrap items-center gap-1 p-1 font-mono text-xs">
          {[
            { id: "intel", label: "01 Intelligence Analysis", icon: Sparkles },
            { id: "site_raw", label: "02 Scraped Website Data", icon: Globe },
            { id: "generator", label: "03 Next.js Site & Preview", icon: Code2 },
            { id: "email", label: "04 Outreach Campaign", icon: Mail },
            { id: "events", label: `05 Event Trace (${biz.events?.length || 0})`, icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-cyan-400 border border-zinc-700 shadow-console-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-4 bg-[#09090b]">
          {/* TAB 1: INTELLIGENCE ANALYSIS */}
          {activeTab === "intel" && (
            <div className="space-y-4 font-mono text-xs">
              {!intel ? (
                <div className="py-12 text-center text-zinc-500">
                  No AI website intelligence data available yet for {biz.business_name}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Profile */}
                  <div className="console-panel p-3.5 rounded border border-console-border space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-console-border pb-1.5">
                      Business Profile & Value Proposition
                    </h3>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase">Executive Summary</span>
                      <p className="font-sans text-xs text-zinc-200 mt-0.5 leading-relaxed">
                        {intel.business_profile?.summary || intel.business_profile?.description || "—"}
                      </p>
                    </div>

                    {intel.business_profile?.value_propositions && (
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Core Value Propositions</span>
                        <ul className="list-disc list-inside text-zinc-300 font-sans text-xs space-y-1 mt-1">
                          {intel.business_profile.value_propositions.map((vp: string, i: number) => (
                            <li key={i}>{vp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {intel.business_profile?.pain_points && (
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Identified Pain Points</span>
                        <ul className="list-disc list-inside text-rose-300 font-sans text-xs space-y-1 mt-1">
                          {intel.business_profile.pain_points.map((pp: string, i: number) => (
                            <li key={i}>{pp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Technical & Aesthetic Assessment */}
                  <div className="console-panel p-3.5 rounded border border-console-border space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-console-border pb-1.5">
                      Technical & Aesthetic Diagnostic
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded bg-console-subtle border border-console-border">
                        <span className="text-[10px] text-zinc-500 uppercase">Design Score</span>
                        <div className="text-lg font-bold text-cyan-400">
                          {intel.aesthetic_analysis?.design_score || intel.aesthetic_analysis?.rating || "8.5"}/10
                        </div>
                      </div>
                      <div className="p-2 rounded bg-console-subtle border border-console-border">
                        <span className="text-[10px] text-zinc-500 uppercase">Brand Tone</span>
                        <div className="text-xs font-semibold text-zinc-200 truncate mt-1">
                          {intel.aesthetic_analysis?.brand_tone || "Professional / High-Trust"}
                        </div>
                      </div>
                    </div>

                    {intel.aesthetic_analysis?.color_scheme && (
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Detected Color Palette</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          {Array.isArray(intel.aesthetic_analysis.color_scheme)
                            ? intel.aesthetic_analysis.color_scheme.map((c: string, i: number) => (
                                <div key={i} className="flex items-center gap-1">
                                  <div
                                    style={{ backgroundColor: c }}
                                    className="w-4 h-4 rounded border border-white/20"
                                    title={c}
                                  />
                                  <span className="text-[10px] text-zinc-400">{c}</span>
                                </div>
                              ))
                            : String(intel.aesthetic_analysis.color_scheme)}
                        </div>
                      </div>
                    )}

                    {intel.technology_stack && (
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Detected Tech Stack</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Array.isArray(intel.technology_stack)
                            ? intel.technology_stack.map((t: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                                  {t}
                                </span>
                              ))
                            : String(intel.technology_stack)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCRAPED WEBSITE DATA */}
          {activeTab === "site_raw" && (
            <div className="space-y-4 font-mono text-xs">
              {!websiteRaw ? (
                <div className="py-12 text-center text-zinc-500">
                  No scraped website data captured for this business.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded bg-console-subtle border border-console-border">
                      <span className="text-[10px] text-zinc-500 uppercase">Website URL</span>
                      <div className="text-cyan-400 truncate mt-0.5">{websiteRaw.url || biz.website || "—"}</div>
                    </div>
                    <div className="p-2.5 rounded bg-console-subtle border border-console-border">
                      <span className="text-[10px] text-zinc-500 uppercase">Pages Crawled</span>
                      <div className="text-zinc-200 font-bold mt-0.5">
                        {websiteRaw.pages ? Object.keys(websiteRaw.pages).length : 1}
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-console-subtle border border-console-border">
                      <span className="text-[10px] text-zinc-500 uppercase">Extracted Email</span>
                      <div className="text-amber-300 truncate mt-0.5">{websiteRaw.contact?.email || biz.email || "None"}</div>
                    </div>
                  </div>

                  {/* Scraped Content Preview */}
                  <div className="console-panel p-3 rounded border border-console-border">
                    <span className="text-[10px] text-zinc-500 uppercase">Extracted Text Content</span>
                    <pre className="mt-1 p-2.5 rounded bg-black/80 border border-zinc-800 text-[11px] text-zinc-300 font-mono overflow-x-auto max-h-[400px] overflow-y-auto leading-relaxed">
                      {websiteRaw.extracted_text || JSON.stringify(websiteRaw, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NEXT.JS SITE GENERATOR & PREVIEW */}
          {activeTab === "generator" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded bg-console-subtle border border-console-border">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Deployed Live Project</span>
                  <div className="font-sans font-bold text-sm text-white">
                    {deployedUrl ? (
                      <a
                        href={deployedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{deployedUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-zinc-500">Site deployment in progress or not triggered yet</span>
                    )}
                  </div>
                </div>

                {deployedUrl && (
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
                  >
                    <span>Open Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Embedded Interactive Iframe Preview */}
              {deployedUrl && (
                <div className="console-panel rounded border border-console-border overflow-hidden">
                  <div className="p-2 border-b border-console-border bg-console-subtle flex items-center justify-between text-[10px] text-zinc-500">
                    <span>LIVE BROWSER VIEWPORT</span>
                    <span>100% RESPONSIVE PREVIEW</span>
                  </div>
                  <iframe
                    src={deployedUrl}
                    title="Live Generated Site Preview"
                    className="w-full h-[550px] border-0 bg-black"
                  />
                </div>
              )}

              {/* Site Data JSON Dump */}
              {siteData && (
                <div className="console-panel p-3 rounded border border-console-border">
                  <span className="text-[10px] text-zinc-500 uppercase">Next.js Template site-data.json</span>
                  <pre className="mt-1 p-2.5 rounded bg-black/80 border border-zinc-800 text-[10px] text-cyan-300 font-mono overflow-x-auto max-h-[300px] overflow-y-auto">
                    {JSON.stringify(siteData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OUTREACH CAMPAIGN & EMAIL */}
          {activeTab === "email" && (
            <div className="space-y-4 font-mono text-xs">
              {!emailDraft ? (
                <div className="py-12 text-center text-zinc-500">
                  No outreach email generated yet for {biz.business_name}.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Delivery Status Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded bg-console-subtle border border-console-border">
                      <span className="text-[10px] text-zinc-500 uppercase">Recipient</span>
                      <div className="text-zinc-200 font-semibold truncate mt-0.5">
                        {emailDraft.recipient_email || biz.email || "Simulated Target"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-console-subtle border border-console-border">
                      <span className="text-[10px] text-zinc-500 uppercase">Delivery Status</span>
                      <div className="text-emerald-400 font-bold mt-0.5">
                        {emailDel?.status || "Generated / Simulated"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-console-subtle border border-console-border">
                      <span className="text-[10px] text-zinc-500 uppercase">Provider / Mode</span>
                      <div className="text-amber-400 mt-0.5">
                        {emailDel?.provider || "Dry Run Mode"}
                      </div>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="console-panel p-3 rounded border border-console-border">
                    <span className="text-[10px] text-zinc-500 uppercase">Subject Line</span>
                    <div className="font-sans font-bold text-sm text-white mt-1">
                      {emailDraft.subject}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="console-panel p-3.5 rounded border border-console-border space-y-2">
                    <div className="flex items-center justify-between border-b border-console-border pb-2">
                      <span className="text-[10px] text-zinc-500 uppercase">Outreach Message Body</span>
                      <button
                        onClick={() => handleCopyEmail(emailDraft.body_text || emailDraft.body_html || "")}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] transition-colors"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedEmail ? "Copied" : "Copy Text"}</span>
                      </button>
                    </div>

                    <div className="font-sans text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed p-2 bg-zinc-950/60 rounded border border-zinc-800">
                      {emailDraft.body_text || emailDraft.body_html}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EVENT TRACE & DIAGNOSTIC LOGS */}
          {activeTab === "events" && (
            <div className="space-y-2 font-mono text-xs">
              {(!biz.events || biz.events.length === 0) ? (
                <div className="py-12 text-center text-zinc-500">
                  No structured events recorded for {biz.business_name}.
                </div>
              ) : (
                biz.events.map((evt) => {
                  const isExpanded = !!expandedEvents[evt.event_id];
                  const hasMetadata = evt.metadata && Object.keys(evt.metadata).length > 0;
                  const isErr = evt.level === "error" || evt.status === "failed";
                  const isWarn = evt.level === "warning" || evt.status === "paused" || evt.status === "cancelled";
                  const isSucc = evt.level === "success" || evt.status === "completed";

                  return (
                    <div
                      key={evt.event_id}
                      className={`p-2 rounded border leading-relaxed ${
                        isErr
                          ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                          : isWarn
                          ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                          : isSucc
                          ? "bg-emerald-950/15 border-emerald-500/25 text-emerald-200"
                          : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 font-bold">
                            {new Date(evt.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              fractionalSecondDigits: 3,
                            })}
                          </span>
                          {evt.stage && (
                            <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-indigo-300 font-mono">
                              {evt.stage}
                            </span>
                          )}
                        </div>
                        {evt.duration_ms && (
                          <span className="text-zinc-500">{evt.duration_ms.toFixed(0)}ms</span>
                        )}
                      </div>

                      <div className="text-zinc-200 break-words">{evt.message}</div>

                      {hasMetadata && (
                        <div className="mt-1 pt-1 border-t border-console-border/40">
                          <button
                            onClick={() => toggleExpand(evt.event_id)}
                            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-cyan-400"
                          >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            <span>Metadata</span>
                          </button>

                          {isExpanded && (
                            <pre className="mt-1 p-2 rounded bg-black/80 border border-zinc-800 text-[10px] text-cyan-300 overflow-x-auto">
                              {JSON.stringify(evt.metadata, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
