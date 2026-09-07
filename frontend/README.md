# Frontend - Next.js Application

Next.js frontend application built with TypeScript and App Router for the Duolingo clone project.

---

## 📂 Directory Structure

```text
src/
├── app/                  # App Router pages, layout, and global styles
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/           # Reusable UI elements
│   ├── common/           # Shared/composite components (headers, footers, etc.)
│   └── ui/               # Basic design system primitives (buttons, inputs, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities and API helper
│   ├── api.ts            # Fetch wrapper for backend API communication
│   └── constants.ts      # Global application constants
└── types/                # TypeScript interface declarations
    └── index.ts
```

---

## ⚡ Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
