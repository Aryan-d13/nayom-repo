import sqlite3
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from config.settings import DATA_DIR

logger = logging.getLogger(__name__)

DEFAULT_DB_PATH = DATA_DIR / "leads.db"


class LeadTracker:
    """
    Lightweight, embedded SQLite state tracker for personal automation.
    
    Answers the core question: 'What happened to this business?'
    Enforces quality gates before outreach:
    A business is NEVER eligible for outreach if site generation or build failed.
    """

    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = Path(db_path) if db_path else DEFAULT_DB_PATH
        self._mem_conn = None
        if str(self.db_path) == ":memory:":
            self._mem_conn = sqlite3.connect(":memory:", timeout=10.0)
            self._mem_conn.row_factory = sqlite3.Row
        else:
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        if self._mem_conn is not None:
            return self._mem_conn
        conn = sqlite3.connect(str(self.db_path), timeout=10.0)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS leads (
                    business_id TEXT PRIMARY KEY,
                    business_name TEXT NOT NULL,
                    category TEXT,
                    city TEXT,
                    phone TEXT,
                    website TEXT,
                    selected_template TEXT,
                    research_status TEXT DEFAULT 'pending',
                    generation_status TEXT DEFAULT 'pending',
                    build_status TEXT DEFAULT 'pending',
                    deployment_status TEXT DEFAULT 'pending',
                    outreach_status TEXT DEFAULT 'pending',
                    live_url TEXT,
                    last_error TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def record_discovery(
        self,
        business_id: str,
        business_name: str,
        category: Optional[str] = None,
        city: Optional[str] = None,
        phone: Optional[str] = None,
        website: Optional[str] = None,
    ):
        now = self._now()
        with self._get_connection() as conn:
            conn.execute(
                """
                INSERT INTO leads (business_id, business_name, category, city, phone, website, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(business_id) DO UPDATE SET
                    business_name = excluded.business_name,
                    category = COALESCE(excluded.category, leads.category),
                    city = COALESCE(excluded.city, leads.city),
                    phone = COALESCE(excluded.phone, leads.phone),
                    website = COALESCE(excluded.website, leads.website),
                    updated_at = excluded.updated_at
                """,
                (business_id, business_name, category, city, phone, website, now, now),
            )
            conn.commit()

    def record_research(self, business_id: str, status: str, error: Optional[str] = None):
        now = self._now()
        with self._get_connection() as conn:
            conn.execute(
                """
                UPDATE leads
                SET research_status = ?,
                    last_error = CASE WHEN ? IS NOT NULL THEN ? ELSE last_error END,
                    updated_at = ?
                WHERE business_id = ?
                """,
                (status, error, error, now, business_id),
            )
            conn.commit()

    def record_generation(
        self,
        business_id: str,
        template_id: str,
        status: str,
        error: Optional[str] = None,
    ):
        now = self._now()
        with self._get_connection() as conn:
            conn.execute(
                """
                UPDATE leads
                SET selected_template = ?,
                    generation_status = ?,
                    last_error = CASE WHEN ? IS NOT NULL THEN ? ELSE last_error END,
                    updated_at = ?
                WHERE business_id = ?
                """,
                (template_id, status, error, error, now, business_id),
            )
            conn.commit()

    def record_build(self, business_id: str, status: str, error: Optional[str] = None):
        """
        Record result of Next.js production build ('passed' or 'failed').
        If failed, automatically blocks outreach!
        """
        now = self._now()
        outreach_override = "blocked" if status == "failed" else None
        with self._get_connection() as conn:
            if outreach_override:
                conn.execute(
                    """
                    UPDATE leads
                    SET build_status = ?,
                        outreach_status = 'blocked',
                        last_error = ?,
                        updated_at = ?
                    WHERE business_id = ?
                    """,
                    (status, error, now, business_id),
                )
            else:
                conn.execute(
                    """
                    UPDATE leads
                    SET build_status = ?,
                        last_error = CASE WHEN ? IS NOT NULL THEN ? ELSE last_error END,
                        updated_at = ?
                    WHERE business_id = ?
                    """,
                    (status, error, error, now, business_id),
                )
            conn.commit()

    def record_deployment(
        self,
        business_id: str,
        status: str,
        live_url: Optional[str] = None,
        error: Optional[str] = None,
    ):
        now = self._now()
        with self._get_connection() as conn:
            conn.execute(
                """
                UPDATE leads
                SET deployment_status = ?,
                    live_url = COALESCE(?, live_url),
                    last_error = CASE WHEN ? IS NOT NULL THEN ? ELSE last_error END,
                    updated_at = ?
                WHERE business_id = ?
                """,
                (status, live_url, error, error, now, business_id),
            )
            conn.commit()

    def is_eligible_for_outreach(self, business_id: str) -> bool:
        """
        Hard Quality Gate:
        A business is only eligible for outreach if site generation succeeded AND build passed.
        """
        lead = self.get_lead(business_id)
        if not lead:
            return False
        if lead.get("generation_status") != "completed":
            return False
        if lead.get("build_status") != "passed":
            return False
        if lead.get("outreach_status") == "blocked":
            return False
        return True

    def get_lead(self, business_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            row = conn.execute("SELECT * FROM leads WHERE business_id = ?", (business_id,)).fetchone()
            return dict(row) if row else None

    def list_leads(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM leads ORDER BY updated_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
            return [dict(r) for r in rows]
