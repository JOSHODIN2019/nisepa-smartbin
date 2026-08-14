# Demo Accounts

For local development and academic demonstration only (`PROJECT_MEMORY.md` Section 32 — the prototype must be easy to demonstrate). Auto-seeded on first server start against an empty database (`server/src/seed/users.seed.ts`), the same way demo bins are seeded.

There is no admin User Management UI yet (Stage 38) to create Staff/Admin accounts any other way — public self-registration (`/register`) always creates a `public`-role account.

| Role | Email | Password |
|---|---|---|
| Staff | `staff@nisepa.demo` | `Password123!` |
| Admin | `admin@nisepa.demo` | `Password123!` |

**Never use these credentials, or this seeding approach, in a real deployment.** Once Stage 38 (User Management) exists, real Staff/Admin accounts should be created there instead, and this seed should be disabled outside local development.
