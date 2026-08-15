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
| 57 — Responsive Testing | ✅ Done | Desktop (1440/1280px), tablet (768px, 21 screens), and mobile (390px) all screenshotted and visually reviewed. Tablet pass found and fixed one real issue: `StatusBadge` text ("High Priority") wrapped awkwardly inside tight table columns — added `whitespace-nowrap`, re-verified. **Still not covered:** no formal automated regression suite (screenshots are ad hoc verification, not a saved fixture set to diff against on every future change). |
| 58 — Accessibility Testing | ✅ Done | Ran a real `axe-core` audit (WCAG 2 A + AA rules) against all 20 screens across all three roles — found genuine issues, not a rubber stamp: 15 color-contrast violations (`neutral-500` and `brand-600` text both failed 4.5:1 against common backgrounds by a narrow margin) and one critical missing accessible name on a per-row `<select>` in User Management. Fixed the two color tokens (recalculated via WCAG relative-luminance formula, verified worst-case background), added `aria-label` to the select, and — since the contrast fix revealed the same underlying mistake reused 8 times — searched for every other instance of the same anti-pattern (`text-neutral-400` used for actual readable text, which was never intended to pass text contrast) and fixed all of them, not just the ones the audit happened to render. Re-ran the full audit: **0 violations across all 20 pages.** Also drove the login form and full sign-in with the keyboard only (Tab + type + Enter, no clicks) and confirmed it reaches the form and submits correctly, with visible focus rings. **Still not covered:** no dedicated screen-reader (VoiceOver/NVDA) pass. |
| 59 — Security Testing | ✅ Done | Passwords hashed with bcrypt (cost 12); JWT in httpOnly cookies; RBAC enforced server-side on every protected route (never trust the client); rate limiting on auth, add-waste, and issue-submission endpoints; Zod validation on every request body; Mongoose CastError handled (no raw stack traces to the client); no secrets committed (`.env` gitignored, `.env.example` provided). Ran `npm audit` on both `client/` and `server/`: **0 known vulnerabilities in either.** Added `helmet` (standard security headers — CSP, X-Frame-Options, X-Content-Type-Options, etc.) to the Express app; verified it doesn't break CORS, the SSE stream, or anything else with a real browser session (curl-confirmed the headers are actually present on responses, not just configured). **Still not covered:** no CSRF token (mitigated by `sameSite: 'lax'` cookies, but not a full CSRF defense); no formal penetration test. |
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
