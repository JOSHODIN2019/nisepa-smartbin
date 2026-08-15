# Demo Accounts

For local development and academic demonstration only (`PROJECT_MEMORY.md` Section 32 — the prototype must be easy to demonstrate). Auto-seeded on first server start against an empty database (`server/src/seed/users.seed.ts`), the same way demo bins are seeded — one account per role, so a login is always available for a fresh demo.

| Role | Email | Password |
|---|---|---|
| Public | `public@nisepa.demo` | `Password123!` |
| Staff | `staff@nisepa.demo` | `Password123!` |
| Admin | `admin@nisepa.demo` | `Password123!` |

Notes:

- Any visitor can also self-register their own **public** account at `/register` with any email/password/home address they choose — the demo public account above is just a convenience, not the only way in. Self-registration never creates a bin; an Admin assigns one afterward from Bin Management (Section 36.7), the same way NISEPA would only install a bin once the household is registered.
- **Staff and Admin accounts can no longer only come from this seed** — Stage 38 (User Management, `/admin/users`) is now built, so a real Admin can create additional Staff/Admin accounts from the UI. This seed still runs on a fresh database purely so there's a working login on first start.
- **Never use these credentials, or this seeding approach, in a real deployment.** Real Staff/Admin accounts should be created via `/admin/users` instead, and this seed should be disabled outside local development.
