# Architecture — SmartBin (NISEPA)

See `PROJECT_MEMORY.md` for the full engineering handbook. This file is the living project map: where things live and what they do.

## Stack

- **Client:** Vite + React 19 + TypeScript, Tailwind CSS v4, React Router v7.
- **Server:** Node.js + Express 5 + TypeScript, running as native ESM.
- **Database:** MongoDB Atlas (production) via Mongoose. See `PROJECT_MEMORY.md` Section 36.1 — this replaces the originally planned SQLite + Prisma.
- **Testing:** Vitest + Supertest + `mongodb-memory-server` (in-memory MongoDB, no real Atlas credentials needed for tests or local dev verification).

## Request flow

```
Browser (client/, port 5173/5174)
   │  fetch('/api/...') — Vite dev proxy → :4000 in dev; same-origin in prod
   ▼
Express app (server/src/app.ts)
   │  cors → json → cookie-parser → morgan → rate limit
   ▼
Router (server/src/routes/index.ts) → feature routers (auth.routes.ts, ...)
   │
   ▼
Controller (server/src/controllers/*.controller.ts) — parses/validates via Zod, calls services
   │
   ▼
Service (server/src/services/*.service.ts) — business logic (hashing, JWT, thresholds)
   │
   ▼
Repository (server/src/repositories/*.repository.ts) — thin query wrappers
   │
   ▼
Mongoose model (server/src/models/*.ts) → MongoDB Atlas
```

Errors thrown anywhere in this chain (as `ApiError` or `ZodError`) are caught by `asyncHandler` and handled centrally in `server/src/middleware/errorHandler.ts`, which always returns the `{ success, error: { code, message } }` envelope and never leaks stack traces in production.

## Auth

- JWT signed with `JWT_SECRET`, stored in an httpOnly cookie named `token` (see `server/src/middleware/auth.middleware.ts`).
- `requireAuth` — rejects unauthenticated requests.
- `requireRole(...roles)` — rejects requests from users whose role isn't in the allowed list (`server/src/middleware/rbac.middleware.ts`).
- Public self-registration (`POST /api/auth/register`) always creates a `public`-role account. Staff/Admin accounts are provisioned by an Administrator (Stage 38 — not yet built).

## Frontend structure

```
client/src/
├── App.tsx              # BrowserRouter + route tree (public / staff / admin)
├── features/auth/       # AuthContext, RequireAuth guard, shared auth types
├── layouts/              # PublicLayout, DashboardLayout (shared), StaffLayout, AdminLayout
├── pages/
│   ├── auth/             # LoginPage, RegisterPage
│   ├── public/            # LandingPage, PublicDashboardPage, PlaceholderPage
│   ├── staff/             # StaffDashboardPage
│   └── admin/             # AdminDashboardPage
├── components/            # Shared UI (Logo, ...)
└── lib/api.ts             # fetch wrapper — unwraps the {success,data}/{success,error} envelope
```

`RequireAuth` is a route-level guard (`<Route element={<RequireAuth allowedRoles={[...]} />}>` wrapping child `<Route>`s) — it redirects to `/login` if unauthenticated, or to `/` if authenticated but role-mismatched.

## Local development without Atlas credentials

Until a real `MONGODB_URI` is supplied, `server/scripts/start-dev-mongo.mjs` spins up a temporary local MongoDB via `mongodb-memory-server` for manual dev/testing. This is a dev-only convenience — production still targets MongoDB Atlas. It is not part of the deployed app; the generated URI file is gitignored.

## Database schema (MongoDB collections)

| Collection | Purpose |
|---|---|
| `users` | Public/Staff/Admin accounts. `passwordHash` is `select: false` by default. |
| `wastebins` | Bin metadata + current level/status snapshot. |
| `wastelevels` | Append-only history of level readings (the simulated IoT feed). |
| `alerts` | One record per threshold crossing (80/90/100) per bin per fill cycle. |
| `collectionrecords` | Staff collection activity against a bin. |
| `notifications` | In-app notifications for a user. |
| `reports` | Generated report snapshots (data frozen at generation time). |
| `auditlogs` | System/user action audit trail. |

Shared status/role/threshold enums and the canonical `getBinStatus()` derivation live in `server/src/types/enums.ts` — the single source of truth for the 80/89/90/99/100 cutoffs (`PROJECT_MEMORY.md` Section 7).

## API conventions

REST-style under `/api`. Every response is `{ success: true, data }` or `{ success: false, error: { code, message } }`. See `server/src/utils/apiResponse.ts` and `server/src/utils/ApiError.ts`.

## Where things are documented

- `docs/DESIGN_SYSTEM.md` — Tailwind design tokens.
- `docs/ARCHITECTURE.md` — this file.
- `PROJECT_MEMORY.md` — handbook, roadmap, and the live decision log (Section 36) for anything that amends the original plan.
