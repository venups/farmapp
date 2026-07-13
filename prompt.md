# Travel Planner – FARM Stack

You are an autonomous full‑stack + DevOps engineer.

Build a complete “Travel Planner” website using the FARM stack:

- Backend: FastAPI (Python)
- Frontend: React
- Database: MongoDB
- Containerization: Docker & Docker Compose

Goals:

- Stunning “modern classic” UI (refined typography, muted premium colors, smooth but subtle animations).
- Features: trips with dates and destinations, daily itineraries, budgets, packing/prep checklists, and a dashboard showing trip status and checklist completion.
- Everything must run locally on my machine using standard Python + Node tooling, and must also be fully dockerized to build and run seamlessly with Docker and Docker Compose.
- You should build multiple functionality similar to a professional wesbite with your best reasoning. Basic layout is not accetable.

Constraints:

- Work fully autonomously. Do NOT ask me questions. Make reasonable assumptions and document them.
- Use clear stages and git commits (env setup, backend, frontend, styling, testing, docs).
- Track:
  - Progress and actions over time.
  - Design and implementation decisions.
  - A checklist of TODO vs DONE.
- Implement automated tests (at least basic backend and frontend tests) and actually run them.
- Produce a detailed README that explains:
  - Prerequisites (including Docker and Docker Compose).
  - How to configure environment variables.
  - How to install dependencies and run locally using standard Python + Node tooling.
  - Exact, step-by-step instructions to build, launch, and access the application stack (database, backend, frontend) using Docker / Docker Compose.
  - How to run tests (both locally and within the Docker environment).
  - Exact instructions to open and test the web page for a quick end‑to‑end manual verification (e.g. accessing http://localhost:<port></port>, creating a trip, adding checklist items, and confirming they persist on reload).
- At the end, verify:
  - Backend and frontend both start cleanly.
  - Core flows work (create trip, add checklist items, view dashboard).
  - Tests pass or clearly report failures.

Failure handling and iteration:

- Whenever something does not work (launch issues, container startup crashes, database connection failures, build error, runtime error, failing test, broken flow, or port conflicts):
  - Diagnose the problem thoroughly (e.g. check logs, verify ports, check environment variables).
  - Attempt a fix.
  - Re‑run the launch script, command, server, or test.
- Keep iterating on each failing issue **at least 5 times** (or until it is fixed), unless it is clearly impossible due to environment limitations.
- For each iteration, record in PROGRESS_LOG.md:
  - What failed.
  - What change you tried.
  - The outcome (still failing / fixed).
- Only move on from a broken part of the system after:
  - You have tried at least 5 concrete fix attempts, OR
  - You can clearly explain why it cannot be fixed in this environment.

Logging (for my manual model comparison later):

- Maintain:
  - PROGRESS_LOG.md – chronological notes of what you did, files touched, commands/tests run, failures, and retries.
  - DECISIONS_LOG.md – key design/stack decisions and trade‑offs.

- Create RUN_DATA.md at the end with **raw, factual data only** (no opinions), including:
  1. Model identity and configuration:
     - Model name or identifier (if accessible).
     - Context window size (tokens), if known.
     - Sampling parameters used:
       - Temperature.
       - Top_p.
       - Top_k (if any).
       - Max tokens per response.
     - Any system/assistant role instructions you received (summarize briefly).
  2. Execution timeline:
     - Approximate start and end time of this run (or “unknown”).
     - Number of major stages completed (e.g., env setup, backend, frontend, UX, tests, docs).
     - Number of retries for failed commands or tests.
  3. Code and artifact metrics:
     - Approximate number of source files created/modified (backend, frontend, tests).
     - Rough line‑count estimates for backend, frontend, tests.
     - Number of test cases implemented and executed.
     - Whether all tests passed at the end (Yes/No).
  4. Tool and command usage:
     - Approximate number of shell commands invoked.
     - Number of git commits made.
     - Any external services used (e.g., MongoDB Atlas vs local MongoDB).
  5. Error log:
     - List of major errors encountered.
     - Brief description of how each was resolved or why it remained unresolved.

- If any values are inaccessible, write “unknown” and briefly explain why.

Final validation:

1. Start the backend and frontend in development mode (both via local dev servers and via Docker/Docker Compose) and confirm they run without errors.
2. Perform a manual end‑to‑end test (verifying both the local run and the Docker run):
   - Create a new trip via the frontend.
   - Add checklist items.
   - Confirm data persistence and retrieval through the backend and MongoDB.
3. Run automated tests for backend and frontend (both locally and within the Docker environment).
4. Verify that README.md instructions match the actual commands and environment.
5. Update PROGRESS_LOG.md with a final “Validation complete” entry.

Output behavior at the end:

- Give me a concise summary:
  - What you built.
  - Exact commands to run backend and frontend.
  - Where to find:
    - README.md
    - PROGRESS_LOG.md
    - DECISIONS_LOG.md
    - RUN_DATA.md

- Do not ask me for any additional input. Just execute, iterate until things work smoothly, and report.
