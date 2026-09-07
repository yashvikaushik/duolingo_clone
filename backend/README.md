# Backend - FastAPI Application

FastAPI backend service for the Duolingo clone project.

---

## 🏗 Architecture Layers

- **`app/core/`**: Central application configurations and environment settings (`config.py`).
- **`app/db/`**: Database engine, session maker (`session.py`), and base model class (`base.py`).
- **`app/models/`**: SQLAlchemy entity models (declarative mappings).
- **`app/schemas/`**: Pydantic models for request validation and response serialization.
- **`app/repositories/`**: Repository layer abstracting direct database queries.
- **`app/services/`**: Domain and business logic operations.
- **`app/api/`**: API routes organized by version (`v1/router.py`, `v1/endpoints/`).

---

## ⚡ Quick Start

1. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. Check Health Endpoint:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```
   Expected response:
   ```json
   {
     "status": "ok",
     "environment": "development",
     "version": "0.1.0",
     "database": "connected"
   }
   ```
