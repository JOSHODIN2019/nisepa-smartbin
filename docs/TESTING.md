# Testing Evidence — Phase 7 QA

This is the honest record of what has actually been tested and how, per `PROJECT_MEMORY.md` Phase 7 (Stages 50-60). It links each stage to real evidence — a test file, a specific browser verification run, or an explicit gap — rather than claiming blanket coverage.

## Automated tests

`cd server && npm test` — 38 tests across 15 files, all passing as of this writing. Uses `mongodb-memory-server` (a real, ephemeral MongoDB instance, not a mock) + `supertest` driving the actual Express app, so these are integration tests against real HTTP + real database behavior, not unit tests with stubbed dependencies.

| File | What it covers |
|---|---|
| `db.smoke.test.ts` | DB connection, model creation defaults |
| `health.smoke.test.ts` | `/api/health`, 404 envelope |
| `auth.smoke.test.ts` | Register, duplicate-email conflict, login (good/bad), `/me`, logout |
| `bins.smoke.test.ts` | Bin list/get, malformed-ID 400, level increase + clamping at 100% |
| `binManagement.smoke.test.ts` | Bin CRUD, RBAC, duplicate-code rejection, active/inactive listing split |
| `notifications.smoke.test.ts` | Threshold-triggered notifications, no duplicate on same-tier update, mark-read |
| `issueReports.smoke.test.ts` / `issueReportsList.smoke.test.ts` | Anonymous + authenticated submission, validation, admin-only listing |
| `alerts.smoke.test.ts` | Alert creation on threshold crossing, RBAC (401/403), acknowledge/resolve |
| `userManagement.smoke.test.ts` | RBAC, create/list/deactivate, self-demotion/self-deactivation guards, deactivated-account login block |
| `collections.smoke.test.ts` | RBAC, full record-collection lifecycle, bin reset, **alert auto-resolution**, populated response fields |
| `reports.smoke.test.ts` | RBAC, real aggregation math (not fabricated), populated response fields |
| `auditLog.smoke.test.ts` | RBAC, real entry created on a real action |
| `settings.smoke.test.ts` | RBAC, min>max rejection, **settings changes actually alter simulation behavior** (deterministic proof), populated response fields |
| `thresholds.unit.test.ts` | **Stage 55** — exhaustive boundary coverage: 0, 1, 79, 80, 85, 89, 90, 95, 99, 100 |

## Stage-by-stage status

| Stage | Status | Evidence |
|---|---|---|
| 50 — Unit Testing | ✅ | `thresholds.unit.test.ts` (pure function, no I/O) |
| 51 — API Testing | ✅ | All `*.smoke.test.ts` files drive real HTTP requests through `supertest` |
| 52 — Database Testing | ✅ | Every test runs against a real (ephemeral) MongoDB instance; relationship integrity implicitly covered by populate-correctness assertions (see "Bugs found" below) |
| 53 — Role Testing | ✅ | Every admin/staff-only route has an explicit 401 (no auth) and 403 (wrong role) test |
| 54 — IoT Simulation Testing | ✅ | `bins.smoke.test.ts` (level increase, clamping), `settings.smoke.test.ts` (deterministic add-amount proof) |
| 55 — Threshold Testing | ✅ | `thresholds.unit.test.ts`, all 10 stated boundary values |
| 56 — Alert Testing | ✅ | `alerts.smoke.test.ts` (creation, RBAC, lifecycle), `collections.smoke.test.ts` (auto-resolution on collection) |
| 57 — Responsive Testing | 🟡 Partial | Every major screen was screenshotted at 1440px/1280px (desktop) and 390px (mobile) during development and passed visual review — see the running commit history for specifics. **Not covered:** a dedicated tablet-width (~768px) pass; no formal regression suite (screenshots were ad hoc verification, not saved as a fixture set). |
| 58 — Accessibility Testing | 🟡 Partial | Every status indicator (bin status, alert status, issue status) pairs color with a text label and/or icon — never color alone (Section 29). Forms use `<label htmlFor>`, semantic HTML, visible focus rings (default browser focus, not suppressed). **Not covered:** no automated axe/Lighthouse audit was run; no dedicated screen-reader pass; keyboard-only navigation was not explicitly walked end-to-end. |
| 59 — Security Testing | 🟡 Partial | Passwords hashed with bcrypt (cost 12); JWT in httpOnly cookies; RBAC enforced server-side on every protected route (never trust the client); rate limiting on auth, add-waste, and issue-submission endpoints; Zod validation on every request body; Mongoose CastError handled (no raw stack traces to the client); no secrets committed (`.env` gitignored, `.env.example` provided). **Not covered:** no dependency vulnerability scan (`npm audit`) was run as part of this work; no CSRF token (mitigated by `sameSite: 'lax'` cookies, but not a full CSRF defense); no formal penetration test. |
| 60 — Final System Testing | ✅ | See "End-to-end flow verified" below — the complete Section 32 demonstration script has been run live in a browser, not just asserted. |

## End-to-end flow verified (Section 32's demonstration checklist)

Every item below was driven live in a real headless-Chromium session during development (not just unit-tested in isolation):

1. ✅ Login (all three roles: public, staff, admin)
2. ✅ Public user interaction (`/smart-bin`)
3. ✅ Waste being added (button click → API call → DB write)
4. ✅ Bin visual level increasing (SVG fill animates, percentage updates)
5. ✅ Dashboard update (same page re-renders with new state after the API responds)
6. ✅ 80% warning (color/badge changes to Warning)
7. ✅ 90% high-priority alert (color/badge changes to High Priority)
8. ✅ 100% full alert (color/badge changes to Full, "Add waste" button disables)
9. ✅ Staff seeing the alert (real-time in the sense of "on next page load/navigation" — see the Stage 25 gap below)
10. ✅ Administrator seeing the alert (same data, admin-scoped view)
11. ✅ Collection being recorded (`/staff/collections`)
12. ✅ Bin status changing after collection (resets to 0%/Normal, alert auto-resolves)
13. ✅ Database records being updated (every step above is a real Mongoose write, verified via direct queries in tests, not mocked)

## Known gaps (honest, not hidden)

- **No live push (Stage 25).** A second browser tab open on the Staff dashboard will not update automatically when another user adds waste — it requires a manual refresh/navigation. This is the one piece of "real-time" from Section 1.2 that isn't built; everything else in the loop is real.
- **No ESP32 abstraction layer (Stage 23).** The bin service plays this role directly rather than through a separate simulated-device module. Functionally equivalent, architecturally simpler.
- **Reports has one report type** (`collections-summary`). Real aggregation, real data, but not a general-purpose report builder.
- **Bug pattern found repeatedly during this QA pass:** four separate repository `create()`/`update()` calls returned Mongoose documents with unpopulated `ref` fields, which the client rendered immediately (raw ObjectIds instead of names) before a later `GET` request would have shown the correct populated data. Found and fixed in: `alertRepository.findById` (Stage 27), `collectionRecordRepository.create` (Stage 35), `reportRepository.create` (Stage 42), `settingsRepository.update`/`getOrCreate` (Stage 44). Each fix has a regression test asserting the **immediate response** is populated, not just a subsequent list fetch — this was the actual gap that let the bug through the first time.
