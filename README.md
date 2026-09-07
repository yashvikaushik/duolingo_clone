# 🔐 Feature: Authentication & User Profile Foundation (`feature/auth`)

This branch contains **Phase 1** of the Duolingo Clone project: complete user authentication (Email/Password, Google, Facebook) powered by Firebase Auth, coupled with a FastAPI backend SQLite user profile sync mechanism.

---

## 🌟 Features Implemented in this Branch

### 1. Frontend Authentication & UI Flow
- **Landing Page (`/`)**: High-converting Duolingo-styled landing page with hero mascot, CTA buttons, and feature breakdown.
- **Login Page (`/login`)**: Full authentication form supporting:
  - Email & Password authentication with error handling.
  - **Google OAuth** pop-up sign-in via Firebase SDK.
  - **Facebook OAuth** pop-up sign-in via Firebase SDK.
  - Form validation, loading spinners, and friendly error banners.
- **Signup Page (`/signup`)**: Two-step registration flow collecting user age, display name, email, and password.
- **Protected Profile Page (`/profile`)**: Authenticated dashboard displaying:
  - User avatar, join date, current streak, XP, and gems.
  - Profile edit form allowing updates to display name and target language.
  - Session state display (Firebase UID, registered email).
  - Secure logout button with instant state reset.
- **Auth Context (`src/context/AuthContext.tsx`)**: Global React context managing Firebase auth state listeners (`onAuthStateChanged`), token refresh, loading states, and backend user sync.
- **API Client (`src/lib/api.ts`)**: Fetch wrapper automatically attaching Firebase ID token as a `Bearer` token in the `Authorization` header.

### 2. Design System & Components
- Built using **pure Vanilla CSS** (over 600+ lines in `src/app/globals.css`) adhering to Duolingo's vibrant brand aesthetics (Feather green `#58cc02`, bold typography, 3D rounded button depth, glassmorphism, responsive cards).
- **Custom UI Components**:
  - `DuoLogo`: SVG branding logo.
  - `DuoMascot`: Playful owl mascot component.
  - `Sidebar`: Fixed left navigation bar with active route highlighting.
  - `SocialButtons`: Styled Google and Facebook sign-in buttons.
  - `LoadingScreen`: Smooth loading overlay with animated spinner.

### 3. Backend User Persistence & JWT Verification
- **User Sync API (`POST /api/v1/auth/sync`)**: Receives Firebase JWT from frontend, verifies signature, extracts claims, and creates/syncs a user record in the local SQLite database mapped by `firebase_uid`.
- **User Management APIs (`GET /api/v1/users/me`, `PUT /api/v1/users/me`)**: Retrieves and updates current authenticated user profile details.
- **Robust Firebase Verification (`app/core/firebase.py`)**:
  - First attempts verification via Firebase Admin SDK.
  - Gracefully falls back to verifying JWT signatures directly using Google's public **JWKS** (JSON Web Key Set) endpoint for seamless local development without needing a service account private key file.
- **SQLite Database Schema (`app/models/user.py`)**:
  - `id` (Integer Primary Key)
  - `firebase_uid` (String Unique Index)
  - `email` (String Unique Index)
  - `display_name` (String)
  - `photo_url` (String)
  - `learning_language` (String)
  - `streak_count` (Integer)
  - `total_xp` (Integer)
  - `gems` (Integer)

---

## 🛠 Branch Setup Instructions

### Environment Variables

1. **Frontend Configuration (`frontend/.env.local`)**:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="duolingo-9e4dd.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="duolingo-9e4dd"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="duolingo-9e4dd.firebasestorage.app"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
   ```

2. **Backend Configuration (`backend/.env`)**:
   ```env
   PROJECT_NAME="Duolingo Clone API"
   API_V1_STR="/api/v1"
   ENVIRONMENT="development"
   DATABASE_URL="sqlite:///./app.db"
   ALLOWED_ORIGINS=["http://localhost:3000"]
   FIREBASE_PROJECT_ID="duolingo-9e4dd"
   ```

---

## 🧪 Testing & Verification

### Running Backend Unit Tests
```bash
cd backend
PYTHONPATH=. pytest
```
*Expected Result: 3/3 passing unit tests for user creation, retrieval, and profile updates.*

### Running End-to-End Auth Verification
1. Start backend: `cd backend && ./venv/bin/uvicorn app.main:app --reload --port 8000`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000/login` or `http://localhost:3000/signup`.
4. Sign up a new user → redirected to protected `/profile` page with SQLite user record automatically created.

