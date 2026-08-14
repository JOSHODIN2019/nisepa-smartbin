# PROJECT_MEMORY.md
## Engineering Handbook & Persistent Project Rules
### IoT-Based Urban Waste Management Network — NISEPA Case Study

> **Document purpose:** This file is the engineering handbook and persistent project memory for the entire application. It is written from the CTO's perspective and is the single source of truth for architecture, development workflow, coding standards, design decisions, security, testing, simulation, and stage approvals.

---

# 1. PROJECT VISION

## 1.1 Product

Build a professional web-based **IoT Waste Management Network for Urban Areas**, using the **Niger State Environmental Protection Agency (NISEPA)** as the case study.

The platform demonstrates how connected smart waste bins can provide timely information about waste levels and help NISEPA monitor and respond to collection needs.

The project is an academic prototype. Physical IoT hardware will **not** be deployed across real urban locations because of cost. Instead, the physical IoT layer will be simulated in software while preserving the logic of a real IoT system.

## 1.2 Core System Concept

The central experience is:

**Public User adds simulated waste**
→ **3D smart-bin level increases**
→ **system updates the waste percentage**
→ **NISEPA Staff and Administrator see the update**
→ **80% warning**
→ **90% high-priority warning**
→ **100% full / collection required**
→ **alert sent to NISEPA Staff and Administrator**
→ **collection is recorded**
→ **bin level/status is reset or updated**

The system must make this behaviour easy to demonstrate during an academic project presentation.

## 1.3 Main Objectives

The implementation must demonstrate:

1. Simulated IoT waste-level monitoring.
2. Real-time or near-real-time dashboard updates.
3. A visual 3D/simulated smart waste bin.
4. Waste-level thresholds at 80%, 90%, and 100%.
5. Automatic alerts to NISEPA Staff and Administrator.
6. Waste-bin location and status monitoring.
7. Collection management and history.
8. Public interaction with the simulated bin.
9. Database storage of monitoring and collection data.
10. A professional monitoring dashboard.
11. Clear testing evidence that the system performs its intended functions.

---

# 2. CLAUDE'S ROLE

Act throughout the project as a coordinated senior engineering team.

Claude is responsible for acting as:

- **CTO / Technical Lead**
- **Senior Full Stack Engineer**
- **Software Architect**
- **Database Architect**
- **Backend Engineer**
- **Frontend Engineer**
- **UI/UX Engineer**
- **Security Engineer**
- **QA/Test Engineer**
- **DevOps Engineer**
- **Product Manager**

Do not behave like a code generator that forgets previous decisions.

Maintain architectural consistency across the entire project.

Before changing an established architecture decision, explain:

- What is changing.
- Why it should change.
- What existing code will be affected.
- Whether migration is required.
- Whether the change improves the project enough to justify the risk.

Never silently introduce a new framework, library, service, database, API, or architecture pattern that conflicts with this document.

---

# 3. DEVELOPMENT PHILOSOPHY

Build this as a serious software project, even though it is an academic prototype.

Priorities:

1. Correctness.
2. Maintainability.
3. Simplicity.
4. Clear architecture.
5. Reusability.
6. Good UX.
7. Security.
8. Testability.
9. Performance.
10. Future extensibility.

Do not over-engineer features that are unnecessary for the research objectives.

Prefer a simple working implementation over an impressive but fragile implementation.

Never create fake functionality and describe it as real.

If a service is simulated, label it internally as a simulation and document the upgrade path.

---

# 4. FREE-FIRST TECHNOLOGY POLICY

## 4.1 Rule

Use technologies that are free and open source whenever possible.

The application must be able to run locally without paid infrastructure.

## 4.2 Preferred Stack

### Frontend

- React
- Vite
- TypeScript preferred
- HTML
- CSS
- Tailwind CSS where useful
- Three.js / React Three Fiber if a real lightweight 3D implementation is practical
- SVG/CSS/Canvas as a fallback for the simulated 3D bin
- Recharts or another free chart library where appropriate

### Backend

- Node.js
- Express.js
- TypeScript preferred

### Database

- SQLite for local development
- Prisma ORM if useful

SQLite is preferred because it is free, local, simple, and sufficient for the academic prototype.

### Development Tools

- Visual Studio Code
- Git
- GitHub only at final deployment stage
- Browser developer tools

## 4.3 Paid Service Rule

Before introducing anything that may require payment, STOP and report:

**Service:**  
**Purpose:**  
**Free status:** FREE / FREE WITH LIMITS / PAID  
**Why it is needed:**  
**Free local alternative:**  
**Recommended approach:**

Do not silently introduce paid services.

---

# 5. SIMULATION POLICY

The following are simulations unless explicitly changed later.

## 5.1 IoT Hardware

Physical:

`Ultrasonic Sensor → ESP32 → Network → Server`

Prototype:

`Simulated Sensor → Simulated ESP32 Layer → Local API → Server → Database → Dashboard`

The software architecture should make it possible to replace the simulated device service with real ESP32 data later.

## 5.2 Payment

No real payment gateway is required.

Do not integrate:

- Paystack
- Flutterwave
- Stripe
- Bank APIs

unless explicitly requested later.

If a payment-like workflow is ever needed for an expansion feature, simulate:

- transaction initiation
- transaction reference
- payment status
- confirmation
- proof of payment

Always label it as simulated.

## 5.3 Proof of Payment Integrity

For simulated proof of payment:

`Canonical transaction data → SHA-256 → integrity hash → stored with proof`

The UI may say:

**Proof of Payment Verified**

but must not claim blockchain or banking-level security.

The hash demonstrates whether the stored simulated record has been altered.

## 5.4 AI

AI is **not required for the core waste-management system**.

If an AI feature is later requested:

- First determine whether it is necessary.
- Prefer a local/free implementation.
- If a paid API is required, stop and report it.
- Never make fabricated AI claims.
- Keep AI modular so it can later be replaced by a production API.

## 5.5 Notifications

Use local/in-app notifications for the prototype.

Do not require paid SMS, WhatsApp, email, or push-notification providers.

External notifications may be simulated.

## 5.6 Escrow / Wallet / Cryptocurrency

These are **not core features of this waste-management project**.

Do not add:

- Solana
- cryptocurrency wallets
- escrow
- marketplace
- investor hub

unless the project scope is explicitly changed.

If such features are requested later, treat them as separate modules and first determine whether they belong in the research scope.

---

# 6. USER ROLES

There are three human roles.

## 6.1 Public User

Can:

- View landing page.
- Register/login if required.
- View available waste-management information.
- Interact with the simulated smart bin.
- Add simulated waste.
- See waste level increase.
- View relevant notifications.
- Report a waste issue if that feature is included.

## 6.2 NISEPA Waste Management Staff

Can:

- Login.
- View monitoring dashboard.
- Monitor waste bins.
- View waste levels.
- View locations.
- View status.
- Receive 80%, 90%, and 100% alerts.
- View collection alerts.
- Update collection status.
- View collection history.

## 6.3 NISEPA Administrator

Can:

- Login.
- View overall dashboard.
- Monitor all bins.
- View real-time levels.
- View alerts.
- Manage users.
- Manage bins.
- View collections.
- View reports.
- Manage system settings.
- View audit/system activity.

The simulated smart bin is a **system component**, not a human user.

---

# 7. WASTE-LEVEL RULES

Use these rules consistently throughout the application.

| Level | Status | Meaning |
|---|---|---|
| 0–79% | Normal | Continue monitoring |
| 80–89% | Warning | Collection planning recommended |
| 90–99% | High Priority | Immediate attention recommended |
| 100% | Full | Collection required |

Alerts must be generated when the level reaches:

- 80%
- 90%
- 100%

Avoid generating duplicate alerts continuously for the same threshold crossing.

A threshold alert should have a clear lifecycle such as:

`NEW → ACKNOWLEDGED → RESOLVED`

or:

`UNREAD → READ → RESOLVED`

---

# 8. 3D SMART-BIN RULES

The simulated smart bin is a major demonstration feature.

It should display:

- Bin ID.
- Location.
- Waste percentage.
- Status.
- Last updated time.
- Visible waste level.

When the Public User adds waste:

- The visual waste level increases.
- The percentage updates.
- The status updates.
- The database is updated.
- Staff dashboard updates.
- Administrator dashboard updates.
- Relevant alert is generated.

The 3D implementation must remain lightweight.

If true 3D creates unnecessary complexity, use a convincing simulated 3D representation with:

- CSS
- SVG
- Canvas

The goal is to demonstrate the IoT concept, not to build a game engine.

---

# 9. ARCHITECTURE

Use a clean, modular architecture.

Recommended high-level structure:

```text
Browser
   │
   ▼
React Frontend
   │
   ▼
API Layer
   │
   ▼
Express Server
   │
   ├── Authentication
   ├── Users
   ├── Waste Bins
   ├── IoT Simulation
   ├── Waste Levels
   ├── Alerts
   ├── Collections
   ├── Reports
   └── Notifications
   │
   ▼
Service Layer
   │
   ├── Bin Service
   ├── IoT Simulation Service
   ├── Alert Service
   ├── Collection Service
   └── Notification Service
   │
   ▼
Prisma
   │
   ▼
SQLite
```

Keep external integrations behind service interfaces so they can be replaced later.

---

# 10. FOLDER STRUCTURE

Prefer a feature-oriented structure.

Example:

```text
project-root/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── bins/
│   │   │   ├── monitoring/
│   │   │   ├── alerts/
│   │   │   ├── collections/
│   │   │   ├── reports/
│   │   │   └── users/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   ├── types/
│   │   └── styles/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── simulations/
│   │   ├── utils/
│   │   └── types/
│   └── ...
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
├── tests/
├── docs/
├── .env.example
├── .gitignore
├── README.md
├── CLAUDE.md
└── PROJECT_MEMORY.md
```

Adapt the exact structure only when there is a clear technical reason.

---

# 11. CODING STANDARDS

## 11.1 SOLID

Follow SOLID principles where appropriate.

Avoid giant classes and giant functions.

## 11.2 DRY

Do not duplicate:

- API calls
- validation
- UI components
- status logic
- alert logic
- formatting
- database logic

## 11.3 Clean Architecture

Keep:

- UI logic
- business logic
- data access
- infrastructure

separated.

## 11.4 Naming

Use meaningful names.

Prefer:

`getBinStatus()`

over:

`doStuff()`

Prefer:

`WasteLevelIndicator`

over:

`Box2`

## 11.5 Components

Components should have one clear responsibility.

Avoid giant page components.

## 11.6 TypeScript

Prefer TypeScript for new code.

Avoid `any` unless there is a documented reason.

## 11.7 Comments

Do not comment obvious code.

Comment:

- important architectural decisions
- complex business rules
- simulation boundaries
- non-obvious calculations

---

# 12. UI/UX DESIGN PRINCIPLES

The UI should feel like a modern real product.

Design inspiration may include:

- Apple
- Linear
- Stripe
- Arc
- high-quality modern SaaS products
- high-quality Dribbble references

Do not copy their designs.

Use them as inspiration for:

- spacing
- hierarchy
- typography
- interaction
- information density
- navigation
- visual rhythm

Prioritize:

- clear hierarchy
- clean spacing
- strong typography
- restrained visual language
- accessible contrast
- responsive layouts
- useful empty states
- loading states
- error states
- success states
- clear status indicators

Avoid:

- excessive gradients
- unnecessary glassmorphism
- decorative UI
- excessive animations
- fake statistics
- generic dashboard templates
- too many cards
- clutter

---

# 13. DESIGN INSPIRATION WORKFLOW

Every screen is built using a controlled inspiration process.

Before implementing a screen, Claude MUST ask:

### A. Screenshot inspiration

"Do you have a screenshot you want me to use as visual inspiration for this screen?"

Provide a dedicated placeholder:

```text
SCREENSHOT INSPIRATION:
[PASTE SCREENSHOT HERE]
```

### B. CSS inspiration

Ask:

"Do you have CSS, Tailwind, HTML, or code from a design you want me to study?"

Provide:

```text
CSS / CODE INSPIRATION:
[PASTE CODE HERE]
```

### C. Design instructions

Claude must analyze the inspiration for:

- layout
- spacing
- typography
- colors
- components
- interaction
- responsive behaviour
- visual hierarchy

Then recreate the design **without copying proprietary code or assets**.

If no inspiration is provided, Claude may proceed using the project's established design system only after explicitly confirming that no reference is available.

---

# 14. SCREEN-BY-SCREEN RULE

Never build multiple major screens without approval.

Each screen is its own stage.

For every screen Claude must first provide:

## Stage Brief

**Stage:**  
**Screen:**  
**Purpose:**  
**User Role:**  
**User Flow:**  
**Main Components:**  
**Data Required:**  
**API Required:**  
**Database Changes:**  
**Reusable Components:**  
**Screenshot Needed:** YES/NO  
**CSS/Code Inspiration Needed:** YES/NO  
**Testing Plan:**  
**Acceptance Criteria:**

Then STOP and ask for any required screenshots/CSS.

Only after the required information is available should implementation begin.

---

# 15. REQUIRED STAGE WORKFLOW

Every stage must follow this sequence:

### STEP 1 — Announce Stage

State:

> "We are starting Stage X: [name]."

### STEP 2 — Explain What Is Needed

Tell me exactly what you need:

- screenshot
- CSS
- copy/text
- logo
- image
- data
- design decision
- API decision

Do not ask vague questions.

### STEP 3 — Wait

Do not start coding until required inspiration or decisions have been provided.

### STEP 4 — Plan

Provide a short implementation plan.

### STEP 5 — Implement

Build only the approved scope.

### STEP 6 — Test

Run:

- application
- type checking
- linting if configured
- relevant tests
- browser verification

### STEP 7 — Review

Check:

- visual quality
- functionality
- responsiveness
- accessibility
- errors
- architecture
- consistency

### STEP 8 — Complete Stage

State:

> "Stage X is complete."

Then summarize:

- what was built
- files changed
- tests performed
- known limitations

### STEP 9 — Announce Next Stage

State:

> "We are now ready to move to Stage X+1: [name]."

Then provide what is needed for that next stage.

### STEP 10 — Approval Gate

Do NOT begin Stage X+1 until I approve it or explicitly tell you to proceed.

---

# 16. COMPLETE PRODUCT ROADMAP

The following roadmap is the authoritative implementation sequence.

## PHASE 1 — FOUNDATION

### Stage 01 — Project Audit
Inspect existing files, tools, Node/npm versions, and current project state.

### Stage 02 — Architecture Setup
Establish frontend/backend/database boundaries.

### Stage 03 — Project Structure
Create agreed folder structure.

### Stage 04 — Global Design System
Set typography, spacing, borders, radii, shadows, and core tokens.

### Stage 05 — Database Setup
Configure Prisma + SQLite.

### Stage 06 — Database Schema
Create users, bins, levels, alerts, collections, reports, notifications, and audit structures.

### Stage 07 — API Foundation
Create Express server, routing, middleware, validation, and error handling.

### Stage 08 — Authentication Foundation
Implement local authentication and password hashing.

### Stage 09 — Role-Based Access
Implement Public User, Staff, and Administrator permissions.

### Stage 10 — Frontend Application Shell
Create routing, layouts, navigation, and global state structure.

---

## PHASE 2 — PUBLIC EXPERIENCE

### Stage 11 — Splash / Loading Experience
Create a short professional entry/loading experience if needed.

### Stage 12 — Landing Page
Build the main public-facing landing page.

### Stage 13 — Registration
Build Public User registration.

### Stage 14 — Login
Build login and authentication states.

### Stage 15 — Public Dashboard
Build the public user's main interface.

### Stage 16 — Waste Information
Build public-facing waste-management information.

### Stage 17 — Smart Bin Interaction
Create the interaction where users can add simulated waste.

### Stage 18 — 3D Smart Bin
Build the visual simulated smart bin.

### Stage 19 — Waste Level Simulation
Implement percentage changes and persistence.

### Stage 20 — Public Notifications
Build notification UI.

### Stage 21 — Issue Reporting
Allow users to report relevant waste problems.

---

## PHASE 3 — IoT SIMULATION

### Stage 22 — Simulated Sensor Service
Create the simulated ultrasonic sensor layer.

### Stage 23 — Simulated ESP32 Layer
Create the simulated device/controller layer.

### Stage 24 — IoT Data API
Create the endpoint for simulated sensor data.

### Stage 25 — Real-Time Update Layer
Implement local real-time/near-real-time updates.

### Stage 26 — Threshold Engine
Implement 80%, 90%, and 100% rules.

### Stage 27 — Alert Engine
Generate threshold alerts.

### Stage 28 — Notification Engine
Deliver in-app notifications.

### Stage 29 — Bin Status Engine
Synchronize normal/warning/high-priority/full states.

---

## PHASE 4 — NISEPA STAFF

### Stage 30 — Staff Dashboard
Create the main monitoring dashboard.

### Stage 31 — Bin Monitoring
Display all monitored bins.

### Stage 32 — Bin Details
Create detailed bin view.

### Stage 33 — Real-Time Monitoring
Show changing levels in real time.

### Stage 34 — Alert Center
Display 80%, 90%, and 100% alerts.

### Stage 35 — Collection Management
Allow staff to manage collection status.

### Stage 36 — Collection History
Display previous collection activities.

---

## PHASE 5 — ADMINISTRATOR

### Stage 37 — Administrator Dashboard
Create system-wide overview.

### Stage 38 — User Management
Manage users and roles.

### Stage 39 — Bin Management
Create/edit/deactivate monitored bins.

### Stage 40 — Alert Management
Manage system alerts.

### Stage 41 — Collection Records
Review all collection activities.

### Stage 42 — Reports
Create useful monitoring reports.

### Stage 43 — System Activity
Display audit/activity records.

### Stage 44 — Settings
Build system settings.

---

## PHASE 6 — OPTIONAL TRANSACTION / INTEGRITY DEMO

These stages are only built if the final academic scope requires them.

### Stage 45 — Simulated Transaction
Create a local simulated transaction.

### Stage 46 — Simulated Payment Confirmation
Simulate payment status.

### Stage 47 — Proof of Payment
Generate a simulated proof record.

### Stage 48 — SHA-256 Integrity Verification
Generate and verify proof integrity hashes.

### Stage 49 — Transaction Notifications
Display transaction confirmation notifications.

Do not allow these optional stages to distract from the core waste-management research objective.

---

## PHASE 7 — QUALITY ASSURANCE

### Stage 50 — Unit Testing
Test core business logic.

### Stage 51 — API Testing
Test endpoints and validation.

### Stage 52 — Database Testing
Test relationships and data integrity.

### Stage 53 — Role Testing
Test all permissions.

### Stage 54 — IoT Simulation Testing
Test waste-level updates.

### Stage 55 — Threshold Testing
Test 79%, 80%, 89%, 90%, 99%, and 100%.

### Stage 56 — Alert Testing
Verify alerts reach Staff and Administrator.

### Stage 57 — Responsive Testing
Test desktop, tablet, and mobile.

### Stage 58 — Accessibility Testing
Test keyboard navigation, labels, contrast, focus, and semantic HTML.

### Stage 59 — Security Testing
Test authentication, authorization, validation, and common web vulnerabilities.

### Stage 60 — Final System Testing
Perform end-to-end testing.

---

# 17. DATABASE RULES

Use singular or plural naming consistently. Preferred table names:

- users
- waste_bins
- waste_levels
- alerts
- collection_records
- reports
- notifications
- audit_logs

Use:

- `id` as primary key where appropriate.
- Foreign keys such as `bin_id`, `user_id`, `staff_id`.
- `created_at`
- `updated_at`

Use migrations for schema changes.

Never manually modify production-like database structures without a migration.

Index frequently queried fields such as:

- bin ID
- bin status
- created date
- alert status
- user email
- user role

Avoid premature over-indexing.

---

# 18. API STANDARDS

Use REST-style endpoints unless there is a clear reason not to.

Examples:

```text
GET    /api/bins
GET    /api/bins/:id
POST   /api/bins
PATCH  /api/bins/:id
DELETE /api/bins/:id

GET    /api/bins/:id/levels
POST   /api/bins/:id/levels

GET    /api/alerts
PATCH  /api/alerts/:id

GET    /api/collections
POST   /api/collections
PATCH  /api/collections/:id
```

Use consistent response structures.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request."
  }
}
```

Never leak stack traces to production-like clients.

Validate request bodies.

Validate route parameters.

Return appropriate HTTP status codes.

---

# 19. SECURITY STANDARDS

Implement:

- password hashing
- role-based authorization
- input validation
- safe database queries
- XSS protection
- CSRF considerations where relevant
- secure session/token handling
- rate limiting where appropriate
- audit logging for important actions
- environment variables for secrets
- no secrets committed to Git

Use SHA-256 only for integrity demonstration, not password storage.

Never store plain-text passwords.

Never place secrets in frontend code.

Never commit `.env`.

Provide `.env.example`.

---

# 20. GIT WORKFLOW

Do not push to GitHub until the project is finalized.

Use meaningful commits.

Examples:

```text
feat: add simulated waste level service
feat: add staff monitoring dashboard
fix: correct 90 percent alert state
refactor: extract bin status service
test: add threshold engine tests
docs: update project architecture
```

Before final GitHub deployment:

1. Run tests.
2. Run build.
3. Check `.gitignore`.
4. Check for secrets.
5. Update README.
6. Review changed files.
7. Show the intended commit.
8. Ask for confirmation.
9. Only then push.

---

# 21. DEFINITION OF DONE

A stage is NOT complete merely because code exists.

A stage is complete only when:

- Requirements are implemented.
- UI matches the approved direction.
- Existing architecture remains consistent.
- No obvious console errors exist.
- Relevant tests pass.
- Data flow works.
- Error states are handled.
- Loading states are handled where necessary.
- Responsive behaviour is checked.
- Accessibility basics are checked.
- Code is clean and reusable.
- No unnecessary dependencies were introduced.
- Documentation is updated if architecture changed.
- The local application has been tested in a browser.
- Claude reports the result.
- I approve the stage.

---

# 22. APPROVAL GATES

Claude MUST NOT move forward automatically.

After every stage, say:

> **STAGE X COMPLETE**
>
> Completed:
> - ...
>
> Tested:
> - ...
>
> Known issues:
> - ...
>
> **NEXT STAGE: Stage X+1 — [Name]**
>
> Before I begin the next stage, I need:
> - Screenshot: [required/not required]
> - CSS/code inspiration: [required/not required]
> - Other information: [...]
>
> **Waiting for approval.**

Do not start the next stage until approval is given.

---

# 23. PERSISTENT PROJECT MEMORY

Whenever an important architectural decision is finalized, update the appropriate project documentation.

Examples:

- database decision
- authentication approach
- chosen 3D approach
- chosen notification approach
- API conventions
- design tokens
- important component decisions
- simulation boundaries
- major folder changes

Never forget previous decisions.

Before implementing a new feature, inspect the existing implementation and reuse established components and services.

Do not recreate functionality that already exists.

---

# 24. CHANGE MANAGEMENT

Before making a major change:

1. Inspect existing code.
2. Identify dependencies.
3. Explain impact.
4. Propose the change.
5. Wait for approval if the change is architectural.

For small bug fixes, proceed without unnecessary approval.

Never rewrite a working system just to use a newer library.

---

# 25. BROWSER VERIFICATION

After each major UI stage:

1. Start local server.
2. Open in browser.
3. Inspect rendered result.
4. Check console.
5. Test primary interactions.
6. Test responsive layout.
7. Compare with approved inspiration.
8. Fix obvious issues.

Do not say "looks good" without actually checking the rendered interface when browser access is available.

---

# 26. IMAGE POLICY

For the landing page, use Nigerian-context imagery where appropriate.

Prefer properly licensed/free sources.

If an image source requires an external service or cannot be safely used locally:

- report it
- use a local placeholder
- do not invent licensing

Avoid excessive imagery inside dashboards.

Images should support the product story rather than decorate every section.

---

# 27. REAL-TIME IMPLEMENTATION POLICY

For the academic prototype, local real-time behaviour may be implemented using:

- WebSockets
- Server-Sent Events
- polling

Choose the simplest reliable solution.

Do not introduce Redis, Kafka, MQTT brokers, or cloud event infrastructure unless actually necessary.

For the simulated IoT layer, local simulation is sufficient.

If MQTT is later desired:

- first determine whether it materially improves the research demonstration
- use a free local broker for development
- never require a paid cloud MQTT service

---

# 28. PERFORMANCE

Avoid unnecessary:

- API calls
- database queries
- re-renders
- large images
- 3D assets
- dependencies

The simulated 3D bin must remain lightweight.

Dashboard updates should not require full-page reloads.

Use reusable data-fetching patterns.

---

# 29. ACCESSIBILITY

Use:

- semantic HTML
- labels for form fields
- keyboard navigation
- visible focus states
- meaningful button labels
- appropriate ARIA only when necessary
- accessible colour contrast
- non-colour status indicators where practical

Do not rely on colour alone to communicate:

- warning
- high priority
- full
- success
- error

---

# 30. RESEARCH SCOPE CONTROL

This is an academic research system.

Every implementation decision must be checked against the research topic:

**Development of Waste Management IoT Network for Urban Areas — Case Study of NISEPA**

If a proposed feature does not support:

- IoT monitoring
- waste management
- smart bins
- real-time monitoring
- alerts
- collection
- public interaction
- NISEPA administration

question whether it belongs in the system.

Do not allow unrelated startup features to expand the project unnecessarily.

---

# 31. FUTURE EXPANSION

The architecture should make future upgrades possible without rewriting the entire application.

Possible future upgrades:

- Real ESP32 hardware.
- Real ultrasonic sensors.
- MQTT.
- Cloud hosting.
- PostgreSQL.
- Production authentication.
- Real SMS/email notifications.
- Real payment gateway.
- Mobile application.
- Advanced analytics.
- AI-based collection prediction.
- Route optimization.
- Geographic maps.
- Multi-agency support.

The prototype must remain functional without these services.

---

# 32. FINAL PROJECT PRESENTATION REQUIREMENT

The completed prototype must be easy to demonstrate.

The demonstration should allow the researcher to show:

1. Login.
2. Public User interaction.
3. Waste being added.
4. 3D bin level increasing.
5. Real-time dashboard update.
6. 80% warning.
7. 90% high-priority alert.
8. 100% full alert.
9. Staff seeing the alert.
10. Administrator seeing the alert.
11. Collection being recorded.
12. Bin status changing after collection.
13. Database records being updated.

Provide a simple simulation control if needed so these scenarios can be demonstrated reliably.

---

# 33. CLAUDE'S OPERATING RULE

At all times:

**Think before coding.**

Before touching code:

- inspect the existing project
- understand existing architecture
- identify reusable components
- identify required data
- identify dependencies
- identify risks
- identify whether screenshots/CSS inspiration are needed

Then build.

Do not rush.

Do not skip approval gates.

Do not create duplicate systems.

Do not invent external integrations.

Do not claim simulations are real hardware.

Do not claim simulated payments are real payments.

Do not claim hashes are blockchain.

Do not add unrelated features.

---

# 34. STARTUP INSTRUCTION

When this document is loaded at the beginning of a session:

1. Read `CLAUDE.md`.
2. Read `PROJECT_MEMORY.md`.
3. Inspect the current project.
4. Determine the current completed stage.
5. Review recent architectural decisions.
6. Do not assume previous work is correct; verify it.
7. State the current stage.
8. State what is already completed.
9. State what is required for the next stage.
10. Ask for screenshots/CSS inspiration if needed.
11. Wait for approval before beginning a new major stage.

The response should begin with:

> **Project state checked. We are currently at Stage X: [Stage Name].**

Then continue with the stage briefing.

---

# 35. CTO PRINCIPLE

The goal is not to produce the largest amount of code.

The goal is to produce a system that is:

**clear, functional, testable, maintainable, visually strong, academically defensible, and easy to demonstrate.**

Every line of code should serve the product or the research objective.

**Build deliberately. Test continuously. Document decisions. Wait for approval. Move one stage at a time.**

---

# 36. LIVE DECISION LOG (Session Amendments)

This section records decisions made during active development that amend or override defaults set earlier in this document. Later entries take precedence over earlier sections when they conflict. Do not delete history here — append.

## 36.1 Database: MongoDB Atlas (overrides Section 4.2 / 17)

**Decided:** 2026-08-14

The project uses **MongoDB Atlas** (cloud-hosted MongoDB) as the database, with **Mongoose** as the ODM, instead of the originally documented SQLite + Prisma.

- **Free status:** FREE WITH LIMITS — MongoDB Atlas M0 shared cluster tier (512MB storage, shared RAM/vCPU). No credit card required for M0. Sufficient for an academic prototype's data volume.
- **Why chosen:** Explicit project owner decision — cloud DB simplifies access from anywhere and avoids local SQLite file management.
- **Impact:** All schema design moves from relational tables (Section 17 table list) to Mongoose document collections with equivalent names: `users`, `wastebins`, `wastelevels`, `alerts`, `collectionrecords`, `reports`, `notifications`, `auditlogs`. Foreign keys become ObjectId references (`binId`, `userId`, `staffId`) with `.populate()` where needed. Prisma is dropped from the stack; `prisma/` folder in Section 10's folder structure is replaced by `server/src/models/` (Mongoose schemas) and `server/src/config/db.ts` (connection).
- **Credentials:** The actual Atlas connection string (`MONGODB_URI`) must be supplied by the project owner via `.env` (never committed). Until provided, local development/testing of live DB connectivity is blocked — code will be written against the Mongoose interface and connection will be verified once the URI is supplied.
- **Free-first policy status:** Compliant (free tier, no forced upgrade for prototype scope). No STOP-and-report needed since usage stays within M0 limits.

## 36.2 Approval Gates: Continuous Mode (overrides Sections 14, 15 Step 10, 22)

**Decided:** 2026-08-14

The project owner has instructed: proceed through stages continuously without stopping for per-stage approval. Screenshot/CSS inspiration requests and STAGE COMPLETE summaries are still produced for visibility, but they are **not blocking** — implementation continues automatically to the next stage unless the owner says "stop."

This does not waive the Paid-Service Rule (Section 4.3) or Change Management (Section 24) for genuinely risky/ambiguous decisions (e.g., destructive git operations, publishing/deploying, or paid services beyond free tiers) — those still pause for explicit confirmation.

## 36.3 Landing Page Imagery (confirms Section 26)

**Decided:** 2026-08-14

Confirmed: Nigerian-context imagery should be used on the landing page and other public-facing pages where appropriate, sourced from properly licensed/free sources (e.g., Unsplash/Pexels free-license Nigerian photography), consistent with the existing Image Policy.

---

# 37. PROGRESS LOG

Updated at the end of every completed stage, per Section 21 (Definition of Done). This is the authoritative record of what is actually built — check this before assuming a stage's status.

**Mode:** Continuous (Section 36.2) — stages proceed without per-stage approval gates until the project owner says stop.

## Phase 1 — Foundation

| Stage | Status | Notes |
|---|---|---|
| 01 — Project Audit | ✅ Done | Node v24.11.1, npm 11.6.2, git 2.52.0. Renamed `PROJECT_MEMORY(10).md` → `PROJECT_MEMORY.md`. Local git repo initialized (`main` branch), no remote yet. |
| 02 — Architecture Setup | ✅ Done | Vite+React+TS client, Express+TS server, MongoDB Atlas + Mongoose (see 36.1), npm (no workspace tooling). |
| 03 — Project Structure | ✅ Done | `client/`, `server/src/{config,controllers,routes,services,repositories,middleware,validators,types,models}`, `docs/`, `tests/`. |
| 04 — Global Design System | ✅ Done | Tailwind v4 `@theme` tokens in `client/src/index.css`: brand green, neutrals, waste-level status colors, radii, shadows. Documented in `docs/DESIGN_SYSTEM.md`. |
| 05 — Database Setup | ✅ Done | `server/src/config/env.ts` (Zod-validated env), `server/src/config/db.ts` (Mongoose connection to Atlas). |
| 06 — Database Schema | ✅ Done | Models: User, WasteBin, WasteLevel, Alert, CollectionRecord, Notification, Report, AuditLog. Shared enums + `getBinStatus()` in `server/src/types/enums.ts`. |
| 07 — API Foundation | ✅ Done | Express app (`server/src/app.ts`): CORS, rate limiting, `{success,data}`/`{success,error}` envelopes, centralized error handler. |
| 08 — Authentication Foundation | ✅ Done | bcrypt hashing, JWT httpOnly cookie sessions. `/api/auth/{register,login,logout,me}`. Public registration always creates `public` role. |
| 09 — Role-Based Access | ✅ Done | `requireAuth` + `requireRole(...roles)` middleware. |
| 10 — Frontend Application Shell | ✅ Done | React Router v7 route tree (public/staff/admin), `PublicLayout`, shared `DashboardLayout` → `StaffLayout`/`AdminLayout`, `AuthContext`, `RequireAuth` guard, `lib/api.ts` fetch wrapper. Functional + role-based routing browser-verified via Playwright (screenshots + console/network checks, no errors). |

**Verification method used:** `mongodb-memory-server` (in-memory MongoDB) for automated tests and for local manual browser verification — no real MongoDB Atlas credentials have been supplied yet. **Still needed from the project owner: a real `MONGODB_URI` connection string for `server/.env`** before the app can run against production Atlas.

**Test coverage so far:** 6 passing Vitest tests (`tests/server/`) — DB connectivity, model defaults, HTTP health/404 envelopes, register/login/me/logout, RBAC 401/403.

## Phase 2 — Public Experience

| Stage | Status | Notes |
|---|---|---|
| 11 — Splash / Loading Experience | ✅ Done | Branded `SplashScreen` gates the whole app until the initial `/api/auth/me` check resolves (`AppRoutes` in `App.tsx`) — prevents a logged-out/logged-in flash. |
| 12 — Landing Page | ✅ Done | Hero (Lagos street market photo + gradient overlay), "How it works" 4-step strip mirroring Section 1.2's core loop, 4-card feature grid, mission section (Nigeria sunset photo) + CTA. Real Unsplash imagery, credited in `docs/IMAGE_CREDITS.md`. Browser-verified at desktop/tablet/mobile widths, no console errors. |
| 13 — Registration | ✅ Done | Split-screen `AuthLayout` (brand panel w/ benefit bullets on desktop, logo-only header on mobile) shared with Login. `FormField` component extracted to deduplicate label+input markup. |
| 14 — Login | ✅ Done | Same `AuthLayout`. Full login→dashboard→logout loop browser-verified with zero console errors. |
| 15 — Public Dashboard | ✅ Done | Greeting header, 3 quick-action cards (Smart Bin / Waste Info / Report an Issue — link to their still-placeholder stages), honest empty-state notifications panel (no fake data). |
| 16 — Waste Information | ✅ Done | 4 threshold cards (Normal/Warning/High Priority/Full) mirroring Section 7's table, each with a distinct icon (not color alone, per Section 29) + a "Why it matters" explainer. |
| 17 — Smart Bin Interaction | ✅ Done | `/smart-bin` lists real bins from the API; "Add simulated waste" button calls `POST /api/bins/:id/waste`, disables + relabels once a bin hits 100%. |
| 18 — 3D Smart Bin | ✅ Done | `SmartBinVisual` — lightweight SVG bin (per Section 8: CSS/SVG fallback, no 3D engine), animated fill height/color transitions, status-colored, percentage label. |
| 19 — Waste Level Simulation | ✅ Done | `addSimulatedWaste()` service: random 5-15% increase (clamped 0-100), recomputes status via `getBinStatus()`, persists both the bin snapshot and an append-only `WasteLevel` history row. |
| 20 — Public Notifications | ✅ Done | `Notification` model + `GET /api/notifications` + `PATCH /api/notifications/:id/read`, wired to real events: when a logged-in user's "add waste" action crosses a threshold (into warning/high/full, never duplicated for same-tier updates), they get a real notification. `NotificationList` component replaces the dashboard's static empty state. Message text deliberately does NOT claim NISEPA staff were alerted — that's Stage 27 (Alert Engine), not built yet. |
| 21 — Issue Reporting | ✅ Done | New `IssueReport` model (distinct from the `reports` analytics-snapshot collection) + `POST /api/issues`, works for both anonymous and logged-in visitors (`attachAuthIfPresent`). `/report` is a real form now, not a placeholder. |

**Phase 2 is complete (Stages 11-21).**

## Phase 3 — IoT Simulation

| Stage | Status | Notes |
|---|---|---|
| 22 — Simulated Sensor Service | 🟡 Partial | `POST /api/bins/:id/waste` plays this role directly (no separate module). |
| 23 — Simulated ESP32 Layer | ⬜ Not started | Bin service plays this role too; no distinct abstraction. |
| 24 — IoT Data API | ✅ Done | Same endpoint as above. |
| 25 — Real-Time Update Layer | ⬜ Not started | Client only sees updates it triggered itself — no push to *other* open tabs/dashboards (would need SSE/WebSocket/polling per Section 27). |
| 26 — Threshold Engine | ✅ Done | `getBinStatus()` / `statusToAlertThreshold()` in `server/src/types/enums.ts` — single source of truth. |
| 27 — Alert Engine | ✅ Done | `raiseThresholdAlert()` creates an `Alert` doc on every threshold crossing (80/90/100), wired into `bin.controller.ts#addWaste`. `GET/PATCH /api/alerts` (staff/admin only via `requireRole`). |
| 28 — Notification Engine | 🟡 Partial | Notifies the *acting user* (Stage 20). Does not push to staff/admin — that's what the Alert Engine (above) is for; the two are deliberately separate (personal confirmation vs. staff-facing alert). |
| 29 — Bin Status Engine | ✅ Done (inline) | Status sync happens inside `addSimulatedWaste()`, not as a standalone module — functionally complete, architecturally could be extracted later if it grows. |

## Phase 4 — NISEPA Staff

| Stage | Status | Notes |
|---|---|---|
| 30 — Staff Dashboard | ✅ Done | Real stat tiles (bin counts by status) + active-alerts list with Acknowledge/Resolve, at `/staff/dashboard`. |
| 31 — Bin Monitoring | ✅ Done | `/staff/bins` — dense table (not cards) matching internal-tool density conventions: Bin/Location/Level/Status/Last updated. |
| 32 — Bin Details | ⬜ Not started | |
| 33 — Real-Time Monitoring | ⬜ Not started | Depends on Stage 25 (no live push yet — staff must refresh to see other users' changes). |
| 34 — Alert Center | ✅ Done | `/staff/alerts` — full alert list, same `AlertList` component as the dashboard's preview. |
| 35 — Collection Management | ⬜ Not started | Nav link exists (`/staff/collections`), still a placeholder. |
| 36 — Collection History | ⬜ Not started | |

**Demo accounts** (`docs/DEMO_ACCOUNTS.md`): `staff@nisepa.demo` / `admin@nisepa.demo`, password `Password123!`, auto-seeded on first run — there's no admin User Management UI yet (Stage 38) to create Staff/Admin accounts any other way.

**Bug fixed during this work:** `DashboardLayout` (shared by Staff + Admin) had no responsive treatment at all — on mobile the fixed `w-64` sidebar squeezed all content into an unusable ~130px column. Fixed with an off-canvas drawer (hamburger toggle, backdrop, closes on nav) that only applies below `lg`. `AlertList` also cramped on narrow screens (badge/content/buttons all in one unwrapped flex row) — fixed to stack vertically below `sm`. Both verified with real mobile-viewport screenshots, not just resized-desktop assumptions.

**Design token fix:** the original status palette (`#22a860/#d97706/#ea580c/#dc2626`) failed the dataviz skill's palette validator (green under 3:1 contrast vs. surface). Darkened all four (`#15803d/#b45309/#9a3412/#b91c1c`) — now passes contrast; see `docs/DESIGN_SYSTEM.md` for the validator reasoning on why pairwise CVD-separation doesn't strictly apply to this ordered severity ramp (it's always paired with a text label/icon, never color-alone).

## Phase 5 — Administrator

| Stage | Status | Notes |
|---|---|---|
| 37 — Administrator Dashboard | ✅ Done | `/admin/dashboard` — reuses `StatTile`/`AlertList` from Staff, adds a "New issue reports" tile backed by a new admin-only `GET /api/issues` + `GET /api/issues/stats` (closes the loop on Stage 21's write-only issue reports — someone can finally see them). |
| 38 — User Management | ✅ Done | `/admin/users` — admin-exclusive (Staff cannot access, per Section 6.3). Create Staff/Admin accounts, change role, activate/deactivate. Guards against self-demotion and self-deactivation (both client-disabled and server-enforced with dedicated error codes). Deactivated accounts are actually blocked from logging in (`login()` already checked `isActive`, reused here). |
| 39 — Bin Management | ✅ Done | `/admin/bins` — create form + inline Deactivate/Reactivate on `BinMonitoringTable` (now takes an optional `onToggleActive` prop, backward-compatible with Staff's read-only usage). `POST/PATCH /api/bins` admin-only; rejects duplicate bin codes (`BIN_CODE_IN_USE`). `GET /api/bins` now returns inactive bins too for staff/admin (they need to see them to reactivate) while staying active-only for the public smart-bin page. |
| 40 — Alert Management | ✅ Done | `/admin/alerts` — same `AlertList` component, unfiltered (admin sees everything, same data as Staff's Alert Center currently — no per-role filtering exists yet). |
| 41 — Collection Records | ⬜ Not started | |
| 42 — Reports | ⬜ Not started | Nav link exists, still a placeholder. |
| 43 — System Activity | ⬜ Not started | |
| 44 — Settings | ⬜ Not started | Nav link exists, still a placeholder. |

Verified: RBAC re-confirmed with a fresh browser context — a Staff account visiting `/admin/dashboard` is redirected to `/`. Also confirmed the `DashboardLayout` mobile-responsive fix (from the Staff work) carries over correctly to Admin for free, since it's the same shared layout component — screenshotted at 390px width, no cramping.

## Next Stage

**Phases 4-5's monitoring/management core is now done** (Stages 30, 31, 34, 37, 38, 39, 40). What's left in these phases — Collections (35/36/41) and Reports/Settings/System Activity (42-44) — are all genuinely new feature areas (collection scheduling/history, generated reports, audit logs, system settings), not extensions of what already exists. This is a reasonable point to check in with the project owner before continuing further, given how much has been built in this session.

Verified for this stage: 19 passing Vitest tests (2 new — RBAC on bin CRUD, full create/duplicate-reject/update/deactivate lifecycle, and that deactivated bins disappear from the public listing while staying visible to staff/admin). Full browser run: created a bin as admin, deactivated it, confirmed it's gone from `/smart-bin` (public) but still shows (dimmed, "Inactive") on both `/admin/bins` and `/staff/bins` (confirming the shared-component change didn't break Staff's read-only view). Zero console errors.
