import argparse
import uvicorn
import logging

logger = logging.getLogger(__name__)


def start_server(host: str = "127.0.0.1", port: int = 8000, reload: bool = False):
    """Starts the FastAPI Uvicorn server."""
    print(f"\n[*] Starting Nayom-Automation Control Plane API on http://{host}:{port}")
    print(f"[*] API Docs: http://{host}:{port}/docs")
    print(f"[*] Admin UI connection ready.\n")
    uvicorn.run("api.app:app", host=host, port=port, reload=reload, log_level="info")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nayom-Automation API Server")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Port number (default: 8000)")
    parser.add_argument("--reload", action="store_true", help="Enable live auto-reload for development")
    args = parser.parse_args()

    start_server(host=args.host, port=args.port, reload=args.reload)
