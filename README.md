# 🏗️ Feature: Project Scaffolding & Foundation (`feature/project-setup`)

This branch contains **Phase 0** of the Duolingo Clone project: establishing the foundational, decoupled project architecture for both the Next.js frontend and the FastAPI backend.

---

## 🌟 Scope & Architecture Established in this Branch

### 1. Frontend Architecture (`frontend/`)
- Built with **Next.js (App Router)** and **TypeScript**.
- Minimal, clean folder structure prepared for modular scalability:
  ```text
  frontend/
  ├── src/
  │   ├── app/          # App router pages & layouts (Root layout, page skeleton)
  │   ├── components/   # UI components (ui/ & common/)
  │   ├── hooks/        # Custom React hooks (e.g. useAuth)
  │   ├── lib/          # API utilities and third-party integrations
  │   └── types/        # TypeScript interface declarations
  ├── package.json
  └── tsconfig.json
  ```
- Tailored global design configuration (`globals.css`) using Vanilla CSS variables.

### 2. Backend Architecture (`backend/`)
- Built with **FastAPI** (Python 3.13) following clean architecture principles (Separation of Concerns):
  ```text
  backend/
  ├── app/
  │   ├── api/          # API route controllers (v1 router + health endpoint)
  │   ├── core/         # Settings, environment configuration (Pydantic settings)
  │   ├── db/           # Database engine, session maker, SQLAlchemy Base
  │   ├── models/       # Database ORM models (SQLAlchemy)
  │   ├── schemas/      # Request validation & response schemas (Pydantic)
  │   ├── repositories/ # Abstract data access layer
  │   ├── services/     # Business logic orchestration
  │   └── main.py       # FastAPI application initialization & middleware
  ├── requirements.txt
  └── .env.example
  ```
- **Health-Check Endpoint (`GET /api/v1/health`)**: Validates server uptime and return status: `{"status": "ok", "app": "Duolingo Clone API"}`.

### 3. Database Foundation
- SQLite setup configured with SQLAlchemy ORM (`app/db/session.py`).
- Pre-configured `Base` declarative model parent (`app/db/base.py`).

### 4. Project Organization & Notes
- Isolated `notes/` directory for developer architecture documentation (excluded from Git tracking via `.gitignore`).

---

## 🚀 How to Run & Test this Branch

### 1. Backend Server
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Verify health check:
```bash
curl http://localhost:8000/api/v1/health
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

