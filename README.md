# Duolingo Web App Clone

A full-stack Duolingo clone web application built for an SDE full-stack capstone project.

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13)
- **Database**: SQLite
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)

---

## 📂 Project Structure

```text
duolingo-clone/
├── frontend/             # Next.js App Router frontend
│   ├── src/
│   │   ├── app/          # App router pages & layouts
│   │   ├── components/   # UI & common reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # API client and helper functions
│   │   └── types/        # TypeScript type declarations
│   ├── public/           # Static assets
│   ├── package.json
│   └── tsconfig.json
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── api/          # Route controllers (v1 endpoints)
│   │   ├── core/         # Configuration & settings
│   │   ├── db/           # SQLite & SQLAlchemy setup (session & base)
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── repositories/ # Data access abstraction layer
│   │   ├── services/     # Business logic layer
│   │   └── main.py       # FastAPI application entry point
│   ├── requirements.txt
│   └── .env.example
├── notes/                # Local developer notes (gitignored)
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested with v24.x)
- **Python**: 3.10+ (tested with 3.13.x)

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

5. Verify backend health endpoint:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```
   Interactive API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌿 Branching Strategy

Development follows a feature-branch workflow:
- `main`: Production-ready, stable codebase.
- `feature/<feature-name>`: Dedicated branch for each isolated feature (e.g. `feature/project-setup`, `feature/auth`, `feature/learning-path`).
- Branches are merged into `main` after verification and testing.
