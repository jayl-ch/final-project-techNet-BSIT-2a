# TaskWise Backend

TaskWise backend is an Express + MongoDB API for assignment/task management, group collaboration, priority/deadline analytics, and developer-only admin reporting.

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB + Mongoose
- Auth: JWT access + refresh token rotation
- Session Transport: httpOnly secure cookies
- Security Middleware: helmet, cors, cookie-parser
- Password Hashing: bcrypt
- Google Auth: Google ID token verification (google-auth-library)
- Config: dotenv

## Current Architecture

The backend follows feature modular layering:

- routes -> controllers -> services -> repositories -> models
- shared middlewares for auth, validation, async handling, and global error handling

Key middlewares currently implemented:

- auth middleware with cookie-first token extraction
- request validation middleware
- async controller wrapper
- global 404 + error middleware

## Folder Structure

```text
/backend
├── /src
│   ├── /config
│   │   └── db.js
│   ├── /modules
│   │   ├── /controllers
│   │   ├── /middlewares
│   │   ├── /models
│   │   ├── /repositories
│   │   ├── /routes
│   │   ├── /services
│   │   ├── /utils
│   │   └── /validators
│   └── server.js
├── .env
└── package.json
```

## Models

- Student: user account and credentials, with role-based access (`user` or `developer`)
- Group: collaboration group metadata
- GroupMember: group membership and role (admin/member)
- Task: assignment/task records
- TaskAssignment: mapping of tasks to members within a group
- TaskPriority: computed priority snapshot per task
- RefreshToken: refresh token session tracking and revocation

## Auth and Session Flow

TaskWise now uses cookie-based auth for better browser security:

- Access token cookie: `taskwise_access_token`
- Refresh token cookie: `taskwise_refresh_token`
- Cookies are set as `httpOnly` and environment-sensitive (`secure` in production)

Flow summary:

1. `POST /api/student/login` validates credentials and sets auth cookies.
2. `POST /api/student/google` verifies Google ID token and sets auth cookies.
3. Protected routes read access token from cookie (fallback to Bearer header).
4. `POST /api/student/refresh` rotates refresh token and re-issues cookies (cookie or payload).
5. `POST /api/student/logout` revokes refresh token and clears auth cookies.

Refresh tokens are stored as hashes and revoked on rotation or logout.

## Environment Variables

Create `.env` in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Token secrets
JWT_SECRET=legacy_or_fallback_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Token TTL
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7

# Cookie max age (milliseconds)
ACCESS_COOKIE_MAX_AGE_MS=900000
REFRESH_COOKIE_MAX_AGE_MS=604800000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_web_client_id

# CORS
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# Environment
NODE_ENV=development
```

Notes:

- In production with cross-site frontend/backend, use `NODE_ENV=production` and HTTPS.
- For cross-site cookies in production, `sameSite=none` + `secure=true` is required.

## Setup

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

## API Routes

### Student `/api/student`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/student` | Get authenticated student profile |
| PATCH | `/api/student` | Update authenticated profile |
| POST | `/api/student/register` | Register account |
| POST | `/api/student/login` | Login and set auth cookies |
| POST | `/api/student/google` | Login with Google ID token and set auth cookies |
| POST | `/api/student/refresh` | Rotate refresh token and re-issue cookies |
| POST | `/api/student/logout` | Revoke session and clear cookies |

### Admin `/api/admin`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/admin/users` | Developer-only user, group, and task summary |

### Group `/api/group`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/group` | List user-owned and joined groups |
| GET | `/api/group/:id/details` | Group members and assigned tasks |
| POST | `/api/group/create` | Create group (creator becomes admin) |
| POST | `/api/group/join` | Join by invite code |
| DELETE | `/api/group/delete/:id` | Delete group (admin only) |
| DELETE | `/api/group/:id/member/:memberId` | Remove member (admin only) |
| DELETE | `/api/group/:id/leave` | Leave group (member only) |

### Task `/api/task`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/task` | Get created + assigned tasks (includes priority level) |
| POST | `/api/task/create` | Create task |
| PATCH | `/api/task/update/:id` | Update task (assigned members can update status only) |
| POST | `/api/task/assign` | Assign task to member (group admin only) |
| DELETE | `/api/task/assign` | Remove task assignment (group admin only) |
| POST | `/api/task/priority/:id` | Recompute and persist task priority |
| DELETE | `/api/task/delete/:id` | Delete task |

## Task Assignment Rules

- A task can be assigned to only one member per group at a time.
- If a task is already assigned, attempts to assign it to another member return a conflict error.
- Group admins can unassign a task via `DELETE /api/task/assign` before reassigning.
- Only the group owner can assign/unassign tasks, and only for tasks they created.
- Assigned members can update only the task status.

## Task Priority Engine

- Priority is computed from deadline urgency and difficulty (LOW, MODERATE, CRITICAL).
- Priorities are synced on `GET /api/task` and can be recomputed on demand via `POST /api/task/priority/:id`.

## Validation and Error Contract

- Input validation is enforced on key mutation routes via request validator middleware.
- Controllers are wrapped with async handler to avoid duplicated try/catch blocks.
- Global error middleware returns a consistent payload:

```json
{
	"message": "Human-readable error message",
	"error": {
		"code": "ERROR_CODE",
		"message": "Human-readable error message",
		"details": []
	}
}
```

## Security Notes

- Helmet is enabled.
- CORS is origin-restricted and `credentials` is enabled.
- Access token is short-lived; refresh tokens are rotated and revocable.
- Passwords are hashed with bcrypt.

## Roles and Authorization Rules

- Group admin can: delete group, remove members, assign tasks, unassign tasks.
- Group member can: join group, view authorized group details, leave group.
- Group admin cannot leave a group via leave endpoint; admin should delete group.
- Developer role can access admin reporting endpoints.
- Assigned members can update only the task status.

## Maintainers

TechNet - BSIT-2A
