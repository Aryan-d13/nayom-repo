import time
import socket
import logging
from typing import Callable, TypeVar, Tuple, Optional

logger = logging.getLogger(__name__)

T = TypeVar("T")

TRANSIENT_ERROR_KEYWORDS = [
    "timeout",
    "timed out",
    "rate limit",
    "429",
    "500",
    "502",
    "503",
    "504",
    "temporarily unavailable",
    "try again",
    "connection reset",
    "connection refused",
    "remote end closed",
    "quota exceeded",
    "resource exhausted",
    "econnreset",
    "econnrefused",
    "etimedout",
]


def is_transient_error(exc: Exception) -> bool:
    """
    Determines whether an exception is likely a transient network, rate limit,
    or service blip suitable for retry.
    """
    if isinstance(exc, (TimeoutError, socket.timeout, ConnectionError, ConnectionResetError, ConnectionRefusedError)):
        return True

    exc_name = type(exc).__name__.lower()
    exc_msg = str(exc).lower()

    if any(k in exc_name for k in ("timeout", "connection", "ratelimit", "network", "unavailable")):
        return True

    if any(k in exc_msg for k in TRANSIENT_ERROR_KEYWORDS):
        return True

    return False


def execute_with_retry(
    fn: Callable[[], T],
    max_retries: int = 2,
    initial_backoff: float = 1.0,
    backoff_multiplier: float = 2.0,
    stage_name: str = "stage",
    business_id: Optional[str] = None,
) -> Tuple[T, int]:
    """
    Executes a callable with automated exponential backoff retries for transient errors.
    
    Args:
        fn: Callable operation to execute.
        max_retries: Maximum number of retry attempts.
        initial_backoff: Initial sleep duration in seconds before first retry.
        backoff_multiplier: Factor by which sleep increases each retry.
        stage_name: Name of the stage for logging context.
        business_id: Business identifier for logging context.
        
    Returns:
        Tuple of (result, retry_count).
        
    Raises:
        Exception if all retries fail or if a non-transient error is encountered.
    """
    attempts = 0
    current_backoff = initial_backoff
    target_desc = f"[{business_id}] {stage_name}" if business_id else stage_name

    while True:
        try:
            result = fn()
            return result, attempts
        except Exception as exc:
            attempts += 1
            is_transient = is_transient_error(exc)

            if is_transient and attempts <= max_retries:
                logger.warning(
                    "%s encountered transient error: %s. Retrying in %.2fs (attempt %d/%d)...",
                    target_desc,
                    exc,
                    current_backoff,
                    attempts,
                    max_retries,
                )
                time.sleep(current_backoff)
                current_backoff *= backoff_multiplier
            else:
                if is_transient:
                    logger.error(
                        "%s failed after %d retries. Last error: %s",
                        target_desc,
                        attempts - 1,
                        exc,
                    )
                else:
                    logger.debug("%s encountered non-transient error: %s", target_desc, exc)
                raise exc
