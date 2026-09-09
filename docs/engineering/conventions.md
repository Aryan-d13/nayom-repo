# Engineering Conventions & Architectural Patterns

This document captures the concrete code conventions, design patterns, and engineering standards observed across the Nayom codebase.

---

## 1. Python Conventions & Idioms

### 1. Pydantic v2 Contract-First Architecture
All data traversing module boundaries must be modeled as a subclass of `pydantic.BaseModel` in `contracts/`:
- **Validation**: Use `model_validate()` and `model_validate_json()` rather than manual dict indexing.
- **Serialization**: Use `model_dump()` and `model_dump_json()` instead of `.dict()`.
- **Defaults**: Default optional fields to `None` or empty lists/dicts with explicit type annotations (`Optional[List[str]] = None`).

### 2. Typing & Docstrings
- Full type annotations on all function signatures (`typing.Optional`, `typing.List`, `typing.Dict`, `typing.Union`, `pathlib.Path`).
- Google-style or Sphinx-style docstrings on all public classes and methods detailing parameters, return types, and side effects.

### 3. File System & Path Handling
- Always use `pathlib.Path` instead of `os.path` for file manipulation.
- Ensure all directory paths exist using `.mkdir(parents=True, exist_ok=True)`.
- Enforce explicit `encoding="utf-8"` on all `open()` calls.

### 4. Atomic Write Pattern
Whenever writing persistent JSON state, write to a `.tmp` file and replace:
```python
temp_path = target_path.with_suffix(".tmp")
with open(temp_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
temp_path.replace(target_path)
```

---

## 2. Design Patterns Observed in Nayom

| Design Pattern | Implementation Location | Operational Role |
| :--- | :--- | :--- |
| **Adapter Pattern** | `modules/deployment/providers/`, `modules/email_sender/providers/`, `modules/website_intelligence/providers/` | Normalizes heterogenous external APIs (Vercel, Cloudflare, Resend, Gmail, Gemini) into uniform abstract provider interfaces (`DeploymentProvider`, `EmailSenderProvider`, `AIProvider`). |
| **Singleton Pattern** | `api/app.py` (`state_mgr`, `event_mgr`, `control_mgr`) | Shares in-memory coordination objects across all HTTP requests. |
| **Strategy Pattern** | `modules/website_generator/template_selector.py` | Scores candidate templates against multi-criteria heuristics to select the optimal layout. |
| **Observer Pattern (SSE)** | `modules/orchestrator/events.py` (`EventManager.stream_events`) | Async generator observes new event lines appended to `events.jsonl` and pushes updates to browser subscribers. |
| **Thread Gate / Primitive** | `modules/orchestrator/control.py` (`RunControl`) | Leverages `threading.Event` to pause and cancel running threads cleanly without killing processes ungracefully. |
| **Repository Pattern** | `modules/orchestrator/state.py` (`RunStateManager`) | Abstracts file-based persistence for `run.json` and `<business_id>.json` checkpoints behind uniform CRUD methods. |

---

## 3. TypeScript & Frontend Conventions

- **Next.js 14 App Router**: Route definitions use `app/<route>/page.tsx`.
- **Server vs Client Components**: Components that consume browser APIs (`EventSource`, `useState`, `useEffect`, `setInterval`) explicitly declare `'use client'` at line 1.
- **Typed API Contracts**: `admin/lib/api.ts` mirrors backend Pydantic models with identical field names and types.
- **Console Aesthetics**: Custom Tailwind colors in `tailwind.config.ts`: `console-bg (#0b0f17)`, `console-surface (#111827)`, `console-border (#1f2937)`, `console-accent (#38bdf8)`.
