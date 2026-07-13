# Skill 01: Project Initialization

> **Goal**: Create the complete directory structure, initialize Python and Node.js environments, and install all base dependencies.

---

## Step 1.1: Create Directory Structure

Create every directory listed below. Use `mkdir -p` or equivalent to create nested directories:

```
farmapp/
├── _progress/
├── backend/
│   └── app/
│       ├── models/
│       ├── schemas/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── trips/
│       │   ├── itinerary/
│       │   ├── expenses/
│       │   ├── maps/
│       │   ├── packing/
│       │   └── photos/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── styles/
└── skills/
```

Create `__init__.py` files in every Python package directory (backend/app/ and all its subdirectories).

---

## Step 1.2: Initialize Backend Python Environment

1. Create `backend/requirements.txt` with these exact contents:

```txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
motor==3.6.0
beanie==1.27.0
pydantic[email]==2.10.4
pydantic-settings==2.7.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
python-dotenv==1.0.1
httpx==0.28.1
Pillow==11.1.0
aiofiles==24.1.0
pytest==8.3.4
pytest-asyncio==0.25.0
```

2. Create a Python virtual environment:
```bash
cd backend && python3 -m venv venv
```

3. Activate and install dependencies:
```bash
cd backend && source venv/bin/activate && pip install -r requirements.txt
```

If `python3 -m venv` fails, try `python -m venv venv`. If pip install fails for any package, remove that specific package from requirements.txt, log it in `_progress/errors.md`, and continue.

---

## Step 1.3: Initialize Frontend React + TypeScript App

1. Scaffold a new Vite React TypeScript project inside the `frontend/` directory:

```bash
cd frontend && npx -y create-vite@latest . --template react-ts
```

If this command prompts for anything, accept defaults. If the directory is not empty, use `--force` or clear it first.

2. Install core dependencies:

```bash
cd frontend && npm install
```

3. Install additional dependencies:

```bash
cd frontend && npm install axios react-router-dom@6 react-leaflet leaflet recharts lucide-react @hello-pangea/dnd react-hot-toast date-fns
```

4. Install TypeScript type definitions:

```bash
cd frontend && npm install -D @types/leaflet
```

---

## Step 1.4: Create Environment Files

### `backend/.env`
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=tripforge
JWT_SECRET_KEY=tripforge-super-secret-key-change-in-production-2024
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10
```

### `backend/.env.example`
Same as above but with placeholder values:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=tripforge
JWT_SECRET_KEY=CHANGE_ME_TO_A_RANDOM_SECRET
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=TripForge
```

---

## Step 1.5: Create `.gitignore`

Create a root-level `.gitignore`:

```gitignore
# Python
backend/venv/
backend/__pycache__/
backend/app/__pycache__/
**/__pycache__/
*.pyc
*.pyo
backend/.env
backend/uploads/

# Node
frontend/node_modules/
frontend/dist/
frontend/.env

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Progress tracking (optional - keep for evaluation)
# _progress/

# Docker
*.log
```

---

## Step 1.6: Verify Setup

1. Verify Python packages installed:
```bash
cd backend && source venv/bin/activate && python -c "import fastapi; import motor; import beanie; print('Backend OK')"
```

2. Verify Node packages installed:
```bash
cd frontend && node -e "require('react'); require('axios'); console.log('Frontend OK')"
```

If either verification fails, troubleshoot and fix. Log any issues in `_progress/errors.md`.

---

## Step 1.7: Update Progress

1. Update `_progress/checklist.md`:
   - [x] Project directory structure created
   - [x] Backend Python environment initialized
   - [x] Frontend React app scaffolded

2. Update `_progress/progress.md`: Fill in row for Skill 01

3. Log decisions in `_progress/decisions.md`:
   - Python version used
   - Any package version adjustments
   - Any error workarounds

---

## ✅ Completion Criteria for Skill 01

- [ ] All directories exist
- [ ] All `__init__.py` files created
- [ ] Python venv created and packages installed
- [ ] React + Vite app scaffolded with all npm packages installed
- [ ] `.env` files created for both backend and frontend
- [ ] `.gitignore` created
- [ ] Both verification commands pass
- [ ] Progress tracking files updated
