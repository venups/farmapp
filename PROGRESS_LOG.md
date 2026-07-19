# Progress Log

## TODO / DONE

- [x] Stage 1 — Environment setup (scaffold, .gitignore, .env.example, deps)
- [ ] Stage 2 — Backend (models, store, repository, routes, validation)
- [ ] Stage 3 — Frontend (routing, API client, core components)
- [ ] Stage 4 — Styling (design-system pass)
- [ ] Stage 5 — Testing (backend pytest + frontend Vitest)
- [ ] Stage 6 — Docs (README, RUN_DATA, final logs)
- [ ] Final validation

## Entries

### 2026-07-19 ~08:10 — Environment survey
- Checked interpreters/tooling: Python 3.9.6 only (no 3.11+ anywhere, no uv), Node v26.4.0, npm 11.17.0, Homebrew present, `mongod` absent, Docker CLI present but daemon not running.
- Found an existing repo `.venv` (Python 3.9) already containing fastapi 0.115.0, pydantic 2.9.2, mongomock 4.3.0, pymongo 4.9.2, pytest 8.3.3, uvicorn 0.32.0.
- Commands: `python3 --version`, `node --version`, `which mongod docker`, `docker info`, `.venv/bin/pip list`.
- Result: environment fallback triggered — no reachable MongoDB; going with mongomock + JSON snapshot (DECISIONS_LOG D2). Python 3.9 retained (D1).

### 2026-07-19 ~08:12 — Stage 1 scaffold
- Installed `httpx` into `.venv` (needed by FastAPI's TestClient; also confirmed outbound network works).
- Appended Python/macOS/app-data sections to `.gitignore`; created `backend/app/routes`, `backend/tests`, `backend/data` directories; wrote `.env.example` and `backend/requirements.txt` (pinned to the versions actually installed).
- Wrote DECISIONS_LOG.md D1–D12 (environment fallbacks, data-shape choices, design plan).
- Commands: `pip install httpx` → success.
- Result: OK.
