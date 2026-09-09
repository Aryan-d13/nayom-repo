import sys
from typing import Dict, List, Optional
from contracts.orchestrator import PipelineRunState, BusinessRunState, PipelineSummary, PIPELINE_STAGES


def truncate(s: str, max_len: int) -> str:
    """Truncates a string with ellipsis if it exceeds max_len."""
    if not s:
        return "N/A"
    s = str(s).strip()
    return (s[:max_len - 3] + "...") if len(s) > max_len else s


class PipelineReporter:
    """
    Formats and prints real-time stage progress and final run summary.
    """

    @staticmethod
    def print_banner(query: str, run_id: str, limit: int, dry_run: bool, is_resume: bool = False):
        """Prints initial run header banner."""
        mode_str = "RESUME RUN" if is_resume else "NEW RUN"
        print("\n" + "=" * 80)
        print(f" Nayom-Automation — End-to-End Pipeline Orchestrator ({mode_str})")
        print("=" * 80)
        print(f" Query:          {query}")
        print(f" Run ID:         {run_id}")
        print(f" Business Limit: {limit}")
        print(f" Dry Run:        {dry_run}")
        print(f" Checkpoint:     data/runs/{run_id}/")
        print("-" * 80 + "\n")

    @staticmethod
    def print_stage_start(business_idx: int, total_businesses: int, business_name: str, stage_name: str):
        """Prints stage start notice."""
        stage_display = stage_name.replace("_", " ").title()
        print(f"[{business_idx}/{total_businesses}] ({business_name}) -> {stage_display}...")

    @staticmethod
    def print_stage_result(business_name: str, stage_name: str, status: str, duration: float, detail: Optional[str] = None):
        """Prints single stage completion or skip notice."""
        stage_display = stage_name.replace("_", " ").title()
        status_tag = f"[{status.upper()}]"
        detail_str = f" ({detail})" if detail else ""
        print(f"   -> {status_tag:<11} {stage_display:<22} in {duration:.2f}s{detail_str}")

    @staticmethod
    def print_final_summary(run_state: PipelineRunState, businesses: Dict[str, BusinessRunState]):
        """
        Prints the standardized final summary metrics and per-business table.
        """
        summary = run_state.summary
        failed_or_skipped = summary.failed + summary.skipped

        print("\n" + "=" * 80)
        print(" PIPELINE EXECUTION SUMMARY")
        print("=" * 80)
        print(f" Run ID:                  {run_state.run_id}")
        print(f" Search Query:            {run_state.query}")
        print(f" Overall Status:          {run_state.status.upper()}")
        print(f" Duration:                {run_state.duration_seconds:.2f} seconds")
        print(f" Checkpoint Directory:    data/runs/{run_state.run_id}/")
        print("-" * 80)
        print(f" Operational Metrics:")
        print(f"   Requested:             {summary.requested}")
        print(f"   Attempted:             {summary.attempted}")
        print(f"   Found:                 {summary.found}")
        print(f"   Usable:                {summary.usable}")
        print(f"   Processed:             {summary.processed}")
        print(f"   Succeeded:             {summary.succeeded}")
        print(f"   Failed:                {summary.failed}")
        print(f"   Skipped:               {summary.skipped}")
        print("-" * 80)
        print(f" Stage Execution Breakdown:")
        print(f"   Businesses found:      {summary.businesses_found}")
        print(f"   Websites collected:    {summary.websites_collected}")
        print(f"   Intelligence completed:{summary.intelligence_completed}")
        print(f"   Sites generated:       {summary.sites_generated}")
        print(f"   Sites deployed:        {summary.sites_deployed}")
        print(f"   Emails generated:      {summary.emails_generated}")
        print(f"   Emails sent:           {summary.emails_sent}")
        print("=" * 80 + "\n")


        # Tabular breakdown per business
        if businesses:
            print("=" * 126)
            header = (
                f"| {'Business Name':<24} | {'Website':<20} | {'Collector':<9} | {'Intel':<7} | "
                f"{'Gen':<5} | {'Deploy':<7} | {'EmailGen':<8} | {'Sender':<8} | {'Status':<9} |"
            )
            print(header)
            print("|" + "-" * 26 + "|" + "-" * 22 + "|" + "-" * 11 + "|" + "-" * 9 + "|" + "-" * 7 + "|" + "-" * 9 + "|" + "-" * 10 + "|" + "-" * 10 + "|" + "-" * 11 + "|")

            for b_id, b in businesses.items():
                stages = b.stages
                c_stat = stages.get("website_collector", None)
                i_stat = stages.get("website_intelligence", None)
                g_stat = stages.get("website_generator", None)
                d_stat = stages.get("deployment", None)
                eg_stat = stages.get("email_generator", None)
                es_stat = stages.get("email_sender", None)

                def fmt(st):
                    if not st:
                        return "PEND"
                    if st.status == "completed":
                        return "OK"
                    if st.status == "failed":
                        return "ERR"
                    if st.status == "skipped":
                        return "SKIP"
                    return st.status[:4].upper()

                print(
                    f"| {truncate(b.business_name, 24):<24} "
                    f"| {truncate(b.website or 'None', 20):<20} "
                    f"| {fmt(c_stat):<9} "
                    f"| {fmt(i_stat):<7} "
                    f"| {fmt(g_stat):<5} "
                    f"| {fmt(d_stat):<7} "
                    f"| {fmt(eg_stat):<8} "
                    f"| {fmt(es_stat):<8} "
                    f"| {b.status.upper():<9} |"
                )
            print("=" * 126 + "\n")
