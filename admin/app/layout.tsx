import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Cpu, HardDrive, GitBranch } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAYOM // Operations Console",
  description: "Concurrent Multi-Worker Orchestrator & Live Operational Control Plane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-console-bg text-console-text flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        {/* Top Operations Command Bar */}
        <header className="sticky top-0 z-50 console-header-bar border-b border-console-border">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/60 transition-colors">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm tracking-wider text-zinc-100 group-hover:text-cyan-400 transition-colors">
                    NAYOM
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-zinc-800/90 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded tracking-wider">
                    OPERATIONS CONSOLE
                  </span>
                </div>
              </Link>

              <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

              <nav className="hidden sm:flex items-center gap-1 text-xs">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-zinc-300 hover:text-white hover:bg-console-elevated border border-transparent hover:border-console-border transition-colors font-medium"
                >
                  <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                  Dashboard & Runs
                </Link>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-zinc-400 hover:text-white hover:bg-console-elevated border border-transparent hover:border-console-border transition-colors font-medium"
                >
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  API Schema
                </a>
              </nav>
            </div>

            {/* Live System Telemetry Header Indicators */}
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span className="status-dot status-dot-success" />
                <span className="text-[10px] uppercase text-zinc-400">ENGINE</span>
                <span className="text-emerald-400 font-semibold">ONLINE</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-zinc-500 text-[10px]">
                <GitBranch className="w-3 h-3 text-zinc-600" />
                <span>7-STAGE PIPELINE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Primary Operational Viewport */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {children}
        </main>

        {/* Console Telemetry Footer */}
        <footer className="border-t border-console-border bg-console-subtle py-3 text-[11px] font-mono text-zinc-500">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">NAYOM AUTOMATION</span>
              <span>//</span>
              <span className="text-zinc-500">CONCURRENT MULTI-WORKER ORCHESTRATION</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span>Maps Scraper</span>
              <span>→</span>
              <span>Collector</span>
              <span>→</span>
              <span>Intelligence</span>
              <span>→</span>
              <span>Generator</span>
              <span>→</span>
              <span>Deployment</span>
              <span>→</span>
              <span>Email Gen</span>
              <span>→</span>
              <span>Email Sender</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
