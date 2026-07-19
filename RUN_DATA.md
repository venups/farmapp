# RUN_DATA

## Run Identity
- Agent/harness (e.g. Claude Code, Cursor, Devin, aider, a raw API loop): Claude Code (VS Code extension, Claude Agent SDK)
- Model name/identifier: claude-fable-5 (Claude Fable 5)
- Context window (tokens), if known: unknown — not exposed to the model at runtime
- Temperature / top_p / top_k: unknown — sampling parameters are not exposed to the model
- Max tokens per response: unknown — not exposed to the model
- System/assistant instructions received beyond this prompt (1–2 line summary, or "none"): Standard Claude Code system prompt (tool usage, VS Code integration, communication conventions, memory directory); no task-specific instructions beyond prompt.md.

## Timeline
- Start time / end time (or "unknown"): 2026-07-19 ~08:06 / ~08:50 (local, from git and shell timestamps)
- Stages completed (of 6): 6
- Total retries across all failed commands/tests: 2 (frontend test query-ambiguity fix + rerun; one `npm run build` re-run after invoking it from the wrong directory)

## Code & Artifacts
- Source files created/modified — backend / frontend / tests (split out): backend 11 (8 app modules, 2 `__init__`, requirements.txt) / frontend 18 (4 core js/jsx, 3 pages, 7 components, global.css, index.html, vite.config.js, package.json) / tests 8 (5 backend incl. conftest + `__init__`, 2 frontend suites + test-setup.js)
- Approx. line count — backend / frontend / tests (split out): ~640 / ~1,900 (of which ~950 is global.css + index.html/config) / ~420
- Test cases implemented and executed (count): 21 (14 pytest, 7 Vitest)
- All tests passing at end? (Yes/No): Yes

## Tool Usage
- Shell commands invoked (approx. count): ~30
- Git commits made (count): 6 this run (repo total 16 including 5 pre-existing commits)
- External services used (e.g. MongoDB Atlas / local mongod / mongomock fallback): mongomock in-process fallback with JSON snapshot (no mongod, Docker daemon not running); npm registry and PyPI for dependency installs

## Errors
- [Error 1]: 2 of 7 frontend tests failed — `getByLabelText(/rain jacket/i)` matched both the checkbox and the "Delete Rain jacket" button aria-label — resolved by switching to `getByRole("checkbox", { name })` queries; suite green on rerun.
- [Error 2]: `npm run build` invoked from the repo root instead of `frontend/` (npm enoent: no package.json); the stage-4 commit still went through because the pipe masked the exit code — resolved by re-running the build from `frontend/` (success); committed files were unaffected.
- [Error 3]: Environment limitation, not a code failure: no `mongod` binary and Docker daemon not running, and no Python 3.11+ interpreter installed — handled via the prompt's designated fallbacks (mongomock + JSON snapshot; existing Python 3.9 venv), documented in DECISIONS_LOG D1/D2.
