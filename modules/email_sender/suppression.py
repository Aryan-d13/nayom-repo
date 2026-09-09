import json
import logging
import threading
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

from config.settings import EMAIL_SUPPRESSION_FILE

logger = logging.getLogger(__name__)


class SuppressionList:
    """
    Manages local unsubscribe and suppression lists to prevent contacting
    recipients who opted out or requested not to be contacted.
    """

    def __init__(self, file_path: Optional[Path] = None):
        self.file_path = Path(file_path) if file_path else EMAIL_SUPPRESSION_FILE
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._load()

    def _load(self):
        """Loads suppression entries from disk with thread-safety."""
        with self._lock:
            self._cache.clear()
            if self.file_path.exists():
                try:
                    with open(self.file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    entries = data.get("suppressed_emails", [])
                    for entry in entries:
                        if isinstance(entry, dict) and "email" in entry:
                            email_clean = entry["email"].strip().lower()
                            self._cache[email_clean] = entry
                        elif isinstance(entry, str):
                            email_clean = entry.strip().lower()
                            self._cache[email_clean] = {
                                "email": email_clean,
                                "reason": "unsubscribed",
                                "added_at": datetime.now(timezone.utc).isoformat(),
                            }
                except Exception as e:
                    logger.warning("Could not read suppression file %s: %s", self.file_path, e)

    def _save(self):
        """Persists suppression list to disk with atomic write and thread-safety."""
        try:
            self.file_path.parent.mkdir(parents=True, exist_ok=True)
            payload = {
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "total_suppressed": len(self._cache),
                "suppressed_emails": list(self._cache.values()),
            }
            temp_file = self.file_path.with_suffix(".tmp")
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2)
            temp_file.replace(self.file_path)
        except Exception as e:
            logger.error("Could not write suppression list %s: %s", self.file_path, e)


    def is_suppressed(self, email: Optional[str]) -> bool:
        """Checks whether the given email address is on the suppression list."""
        if not email:
            return False
        return email.strip().lower() in self._cache

    def add(self, email: str, reason: str = "unsubscribed") -> bool:
        """Adds an email address to the suppression list."""
        if not email or not email.strip():
            return False
        email_clean = email.strip().lower()
        if email_clean in self._cache:
            return False
        
        self._cache[email_clean] = {
            "email": email_clean,
            "reason": reason,
            "added_at": datetime.now(timezone.utc).isoformat(),
        }
        self._save()
        logger.info("Added %s to email suppression list (reason: %s)", email_clean, reason)
        return True

    def remove(self, email: str) -> bool:
        """Removes an email address from the suppression list."""
        if not email:
            return False
        email_clean = email.strip().lower()
        if email_clean in self._cache:
            del self._cache[email_clean]
            self._save()
            logger.info("Removed %s from email suppression list", email_clean)
            return True
        return False

    def get_info(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieves suppression metadata for an email address."""
        if not email:
            return None
        return self._cache.get(email.strip().lower())

    def get_all(self) -> List[Dict[str, Any]]:
        """Returns all suppression records."""
        return list(self._cache.values())
