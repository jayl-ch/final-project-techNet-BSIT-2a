# TaskWise Frontend

TaskWise frontend is a React (Vite) single-page app for student task management, groups, analytics, and a developer-only admin panel.

## Tech Stack

- React + Vite
- React Router
- React-Bootstrap + Bootstrap + Bootstrap Icons
- Axios
- Framer Motion
- TanStack Query

## Requirements

- Node.js 18+ recommended
- Backend API running (see backend README)

## Environment Variables

Create a `.env` file in `/frontend` if needed:

```env
# Optional: direct API base URL (used by Axios)
VITE_API_URL=http://localhost:5000

# Dev proxy target for Vite (used when calling /api locally)
SERVER_LOCAL=http://localhost:5000
```

Notes:

- If `VITE_API_URL` is not set, the app uses relative `/api` paths and the Vite proxy handles API requests in dev.
- If `VITE_API_URL` is set, requests go directly to that backend URL; ensure CORS + cookies are configured.

## Setup

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## App Routes

Public:

- `/` Landing
- `/login` Login
- `/register` Register

Protected:

- `/dashboard` Dashboard
- `/tasks` Tasks
- `/groups` Groups
- `/groups/:groupId` Group details
- `/profile` Profile

Developer-only:

- `/admin` Admin panel (requires developer role)

## Folder Structure

```text
/frontend
├── /public
├── /src
│   ├── /app
│   │   ├── /providers
│   │   │   ├── /query
│   │   │   └── /theme
│   │   └── /styles
│   ├── /features
│   │   ├── /auth
│   │   ├── /admin
│   │   ├── /dashboard
│   │   ├── /groups
│   │   ├── /landing
│   │   ├── /layout
│   │   ├── /profile
│   │   └── /tasks
│   ├── /pwa
│   └── /shared
│       └── /ui
├── index.html
├── vite.config.js
└── package.json
```

## Dev Notes

- API calls are centralized in feature APIs (e.g., `features/groups/api`).
- Auth uses httpOnly cookies; ensure backend and frontend origins are configured for credentials.
- The admin panel is role-protected; only users with `role=developer` can access `/admin`.

## Maintainers

TechNet - BSIT-2A
