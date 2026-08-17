# Community Program & Volunteer Impact Tracking System
## Comprehensive Technical Documentation & Code Explanation Guide

This document provides a **complete, file-by-file breakdown** of the Backend and Database architecture. It is designed to help you explain every design decision, entity relationship, line of logic, and architectural layer to your professor, evaluator, or technical panel in thorough detail.

---

# Table of Contents
1. [Project Overview & Problem Statement Mapping](#1-project-overview--problem-statement-mapping)
2. [High-Level Architecture & Request Lifecycle](#2-high-level-architecture--request-lifecycle)
3. [Security, Authentication & PII Protection Model](#3-security-authentication--pii-protection-model)
4. [Database & Entity-Relationship Design (Prisma)](#4-database--entity-relationship-design-prisma)
5. [The Participation Funnel Mechanism](#5-the-participation-funnel-mechanism)
6. [Complete File-by-File Explanation](#6-complete-file-by-file-explanation)
   - [Core Server & App (`server.ts`, `app.ts`)](#61-core-server--app)
   - [Configurations (`config/`)](#62-configurations-config)
   - [Middleware Layer (`middleware/`)](#63-middleware-layer-middleware)
   - [Type System & Enums (`types/index.ts`)](#64-type-system--enums-typesindexts)
   - [Utility Functions (`utils/helpers.ts`)](#65-utility-functions-utilshelpersts)
   - [Validation Layer (`validators/`)](#66-validation-layer-validators)
   - [Routing Layer (`routes/`)](#67-routing-layer-routes)
   - [Controllers Layer (`controllers/`)](#68-controllers-layer-controllers)
   - [Business Logic & Service Layer (`services/`)](#69-business-logic--service-layer-services)
   - [Database Schema, Migrations & Seeding (`prisma/`, `database/`)](#610-database-schema-migrations--seeding)
   - [Documentation & Testing Files (`docs/`)](#611-documentation--testing-files-docs)
   - [Project Configuration Files](#612-project-configuration-files)
7. [Viva / Professor Q&A Guide](#7-viva--professor-qa-guide)

---

# 1. Project Overview & Problem Statement Mapping

### The Business Challenge
Community NGOs run dozens of educational programs, skill-development drives, and community outreach campaigns across colleges and cities. Historically, they face three major bottlenecks:
1. **Scattered Data:** Reliance on manual Google Forms and Excel sheets makes tracking participant drop-offs impossible.
2. **Missing Participation Funnel:** Inability to track a participant's state journey: `REGISTERED` → `ATTENDED` → `PARTICIPATED` → `COMPLETED`.
3. **No Centralized Impact Analytics:** Inability to aggregate verified volunteer contribution hours and calculate real attendance/completion rates.

### The Solution We Built
A modular, secure, and production-ready **RESTful API Backend** paired with a **relational PostgreSQL database (Supabase)** and **Prisma ORM**, strictly adhering to the Integration Contract:
- **Separation of Concerns:** Controller-Service-Repository/ORM architecture.
- **Strict Role-Based Access Control (RBAC):** Supabase JWT Authentication for `ADMIN`, `STAFF`, and `COORDINATOR`.
- **Frictionless Public Registrations:** No login barrier for public participants/volunteers; instead, unique human-readable tracking IDs (e.g., `CPR-PAR-XXXXXXXX`) are issued for self-tracking.
- **Server-Side Aggregations:** Database-level aggregations for real-time analytics dashboards.

---

# 2. High-Level Architecture & Request Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                  │
│   Frontend (React/Vite)  /  Mobile Client  /  Postman / Public User   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST Request (/api/v1)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS.JS BACKEND                              │
│                                                                        │
│  1. CORS & JSON Body Parsing (app.ts)                                  │
│  2. Routes (routes/*.ts)                                               │
│  3. Middleware Pipeline:                                               │
│     ├── Public Routes: Passthrough                                    │
│     └── Protected Routes: auth.ts (Supabase JWT) → authorize.ts (RBAC) │
│  4. Controllers (controllers/*.ts)                                     │
│     └── Request extraction & Zod Validation (validators/*.ts)          │
│  5. Business Logic Services (services/*.ts)                           │
│     └── Database Queries via Prisma ORM (config/prisma.ts)             │
│  6. Global Error Handling (middleware/errorHandler.ts)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQL Queries over Pooler (TLS)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER (Supabase PostgreSQL)                  │
│                                                                        │
│   Tables:                                                              │
│   • users              (NGO Staff & Admins)                            │
│   • programs           (Community initiatives)                         │
│   • participants       (Public participants)                           │
│   • volunteers         (Public volunteers + verified hours)            │
│   • registrations      (Funnel status & timestamps)                    │
│   • impact_records     (Aggregated metrics & impact KPIs)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 3. Security, Authentication & PII Protection Model

When your professor asks, *"How did you ensure security and protect participant Personally Identifiable Information (PII)?"*, here is the exact architecture to present:

### 1. Two-Tier User Model
We do not force public participants or students to create accounts and passwords just to register for an NGO workshop.
- **Tier 1: Internal NGO Users (`ADMIN`, `STAFF`, `COORDINATOR`)**
  - Authenticated via **Supabase Auth** using cryptographically signed **JWT access tokens**.
  - Passwords are salted, hashed, and managed by Supabase (never stored in plaintext).
  - Every protected API route enforces JWT verification via `auth.ts` middleware.
  - Role permissions are stored in our own database `users` table and enforced on the backend via `authorize.ts` middleware (never trusting client claims).
- **Tier 2: Public Registrants (Participants & Volunteers)**
  - Public registration requires **no password**.
  - A unique, cryptographically random, non-guessable 8-character hex **Tracking ID** (e.g., `CPR-PAR-2EC3287E`) is generated upon registration.
  - The public tracking endpoint (`GET /api/v1/participants/track/:trackingId`) returns **only** that specific individual's registration journey, preventing data harvesting.

### 2. Service Role Key Protection
- The Supabase **Service Role Key** (`sb_secret_z...`) is stored **exclusively in `backend/.env`** on the backend server.
- It is excluded from Git via `.gitignore`. The client frontend never has access to the database credentials or master keys.

### 3. Protection in Transit & at Rest
- All database connections to Supabase PostgreSQL use **TLS encryption**.
- SQL Injection is prevented by design because Prisma ORM strictly parameterizes all database queries.

---

# 4. Database & Entity-Relationship Design (Prisma)

### Relational Model & Schema Diagram

```
 +------------------+           1:N           +---------------------+
 |      User        | ----------------------> |       Program       |
 | (Admin / Staff)  |  (as Coordinator)       | (Unique ProgramCode)|
 +------------------+                         +---------------------+
                                                         | 1:N
                                                         |
         +-----------------------------------------------+-----------------------------------------------+
         | 1:N                                           | 1:N                                           | 1:N
         ▼                                               ▼                                               ▼
+---------------------+                       +---------------------+                       +---------------------+
|     Participant     |                       |    Registration     |                       |    ImpactRecord     |
| (Unique TrackingId) |                       | (Funnel & Timestamps|                       | (Program Metrics &  |
+---------------------+                       +---------------------+                       |  Completion Rates)  |
         | 1:N                                           ▲                                  +---------------------+
         +-----------------------------------------------+
         | (participantId)                               | (volunteerId)
         |                                               |
         |                                    +---------------------+
         +----------------------------------- |      Volunteer      |
                                              | (Unique TrackingId  |
                                              | + Total Hours)      |
                                              +---------------------+
```

### Table Breakdown:

| Table Name | Description | Key Fields |
|---|---|---|
| `users` | NGO internal administrative staff | `id` (UUID), `supabaseUid` (Unique Link), `email`, `name`, `role` (`ADMIN`/`STAFF`/`COORDINATOR`), `isActive` |
| `programs` | Community outreach programs & workshops | `id` (UUID), `programCode` (Unique human code e.g. `EDU-PUN-2026-01`), `name`, `category`, `location`, `status` (`DRAFT`/`UPCOMING`/`ACTIVE`/`COMPLETED`/`CANCELLED`), `startDate`, `endDate`, `coordinatorId` |
| `participants` | Public students/citizens registering for programs | `id` (UUID), `trackingId` (Unique e.g. `CPR-PAR-7FCFFC35`), `name`, `email`, `phone`, `location`, `college`, `ageOrYear`, `areaOfInterest` |
| `volunteers` | Volunteers offering their time and skills | `id` (UUID), `trackingId` (Unique e.g. `CPR-VOL-3FA8219B`), `name`, `email`, `phone`, `totalHours` (Accumulated verified hours) |
| `registrations` | Maps a Participant OR Volunteer to a Program | `id` (UUID), `programId`, `participantId`, `volunteerId`, `registrantType` (`PARTICIPANT`/`VOLUNTEER`), `status` (`REGISTERED`/`ATTENDED`/`PARTICIPATED`/`COMPLETED`), `volunteerStatus`, `hoursContributed`, `attendedAt`, `participatedAt`, `completedAt` |
| `impact_records` | Program-level outcome measurements | `id` (UUID), `programId`, `totalRegistered`, `totalAttended`, `totalCompleted`, `totalVolunteerHours`, `attendanceRate`, `completionRate` |

### ID Strategy (Contract Section 8):
- **Database Primary Keys:** UUIDv4 for absolute uniqueness and distributed scalability.
- **Human-Facing Identifiers:**
  - `CPR-PAR-XXXXXXXX` for Participants
  - `CPR-VOL-XXXXXXXX` for Volunteers
  - `EDU-PUN-2026-01` for Program Codes (`<CATEGORY>-<LOCATION>-<YEAR>-<SEQUENCE>`)

---

# 5. The Participation Funnel Mechanism

The core requirement of the problem statement is answering:
> *"Who registered? → Who attended? → Who participated? → Who completed the program?"*

Our backend enforces this state machine in `registration.service.ts`:

```
   ┌────────────────┐
   │   REGISTERED   │  Initial registration state upon submitting the public form
   └───────┬────────┘
           │ (Coordinator marks attendance / QR code scan)
           ▼
   ┌────────────────┐
   │    ATTENDED    │  Timestamp `attendedAt` is automatically recorded
   └───────┬────────┘
           │ (Participant takes part in workshops/activities)
           ▼
   ┌────────────────┐
   │  PARTICIPATED  │  Timestamp `participatedAt` is automatically recorded
   └───────┬────────┘
           │ (Participant finishes final assessment/capstone)
           ▼
   ┌────────────────┐
   │   COMPLETED    │  Timestamp `completedAt` is recorded + Volunteer contribution
   └────────────────┘  hours are automatically incremented to volunteer profile!
```

---

# 6. Complete File-by-File Explanation

---

### 6.1 Core Server & App

#### 📄 `backend/src/server.ts`
- **Purpose:** Entry point of the Node.js application.
- **Key Responsibilities:**
  1. Initializes the environment variables via `dotenv`.
  2. Tests database connectivity on startup via `prisma.$connect()`.
  3. Starts the Express HTTP server on the configured port (`PORT=5000`).
  4. Implements **graceful shutdown** listeners for `SIGINT` (Ctrl+C) and `SIGTERM` signals to cleanly disconnect Prisma database connections before terminating the process.

#### 📄 `backend/src/app.ts`
- **Purpose:** Express application configuration and middleware orchestration.
- **Key Responsibilities:**
  1. **CORS Configuration (Contract Section 22):** Allows authorized requests from the React frontend origin (`http://localhost:5173`) while denying unauthorized origins.
  2. **Body Parsers:** Configures `express.json({ limit: '10mb' })` and URL-encoded parsers for incoming payload processing.
  3. **Health Check Route (`GET /health`):** A lightweight endpoint for uptime monitors and load balancers.
  4. **Route Registration:** Mounts all modular API sub-routers under the `/api/v1` namespace.
  5. **404 Fallback:** Catches any unmatched endpoints and returns a standardized JSON `NOT_FOUND` error.
  6. **Global Error Middleware:** Attaches `errorHandler` as the final error boundary.

---

### 6.2 Configurations (`config/`)

#### 📄 `backend/src/config/supabase.ts`
- **Purpose:** Initializes the Supabase Admin client.
- **Key Responsibilities:**
  - Instantiates `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`.
  - Configures `autoRefreshToken: false` and `persistSession: false` since token management in backend servers is stateless per request.
  - Used for verifying JWT tokens and administrative user management.

#### 📄 `backend/src/config/prisma.ts`
- **Purpose:** Database connection pool singleton.
- **Key Responsibilities:**
  - Instantiates `new PrismaClient()`.
  - Utilizes a global singleton pattern in non-production environments to prevent connection exhaustion during hot-reloads (Nodemon).
  - Configures logging levels (`query`, `error`, `warn` in development).

---

### 6.3 Middleware Layer (`middleware/`)

#### 📄 `backend/src/middleware/auth.ts`
- **Purpose:** JWT Authentication Middleware.
- **How It Works:**
  1. Extracts the HTTP `Authorization: Bearer <token>` header from incoming requests.
  2. Calls `supabaseAdmin.auth.getUser(token)` to cryptographically verify the token with Supabase.
  3. If valid, queries our database `users` table using `supabaseUid` to obtain the user's role and account status (`isActive`).
  4. Attaches the authenticated user object (`id`, `supabaseUid`, `email`, `role`, `name`) to `req.user`.

#### 📄 `backend/src/middleware/authorize.ts`
- **Purpose:** Role-Based Access Control (RBAC) factory middleware (Contract Section 19).
- **How It Works:**
  - Accepts a list of authorized roles: e.g., `authorize(UserRole.ADMIN, UserRole.STAFF)`.
  - Checks if `req.user.role` is included in the allowed roles.
  - If unauthorized, immediately rejects the request with HTTP `403 FORBIDDEN` and error code `FORBIDDEN`.

#### 📄 `backend/src/middleware/errorHandler.ts`
- **Purpose:** Centralized Global Error Boundary & Custom Error Class (Contract Section 13).
- **Key Responsibilities:**
  - Defines `AppError` class extending native JavaScript `Error` with `statusCode` and `code` properties.
  - Formats all operational and unexpected errors into the contract response structure:
    ```json
    { "success": false, "message": "...", "code": "ERROR_CODE" }
    ```
  - Masks internal stack traces in production to prevent information disclosure.

---

### 6.4 Type System & Enums (`types/index.ts`)

#### 📄 `backend/src/types/index.ts`
- **Purpose:** The single TypeScript source of truth for enums, interfaces, and API response contracts.
- **Key Definitions:**
  - `UserRole`: `ADMIN`, `STAFF`, `COORDINATOR`.
  - `ProgramStatus`: `DRAFT`, `UPCOMING`, `ACTIVE`, `COMPLETED`, `CANCELLED`.
  - `RegistrationStatus`: `REGISTERED`, `ATTENDED`, `PARTICIPATED`, `COMPLETED`.
  - `VolunteerStatus`: `REGISTERED`, `ASSIGNED`, `ACTIVE`, `COMPLETED`.
  - `ErrorCode`: Standardized error codes like `PROGRAM_NOT_FOUND`, `UNAUTHORIZED`, `VALIDATION_ERROR`.
  - `AuthenticatedRequest`: Extends Express `Request` with typed `req.user`.
  - `ApiSuccess<T>`, `ApiList<T>`, `ApiError`: Standardized envelope interfaces.

---

### 6.5 Utility Functions (`utils/helpers.ts`)

#### 📄 `backend/src/utils/helpers.ts`
- **Purpose:** Shared helper routines.
- **Key Functions:**
  1. `getPagination(req)`: Safely parses `page` and `limit` query parameters with boundary limits (`limit` capped at 100).
  2. `generateParticipantTrackingId()`: Generates human-readable `CPR-PAR-XXXXXXXX` tracking codes.
  3. `generateVolunteerTrackingId()`: Generates `CPR-VOL-XXXXXXXX` tracking codes.
  4. `generateProgramCode(category, location, seq)`: Creates formatted codes like `EDU-PUN-2026-01`.
  5. `paginatedResponse(data, total, page, limit)`: Generates contract-compliant paginated response objects with `totalPages`.
  6. `successResponse(data)`: Generates standard success response envelopes.

---

### 6.6 Validation Layer (`validators/`)

All validators use **Zod** for schema validation before requests reach the business logic:

#### 📄 `backend/src/validators/auth.validator.ts`
- Validates login input (`email`, `password` with min length 6).

#### 📄 `backend/src/validators/program.validator.ts`
- `createProgramSchema`: Validates program creation fields (ISO 8601 `startDate`/`endDate`, positive participant/volunteer capacities).
- `updateProgramSchema`: Partial schema for updates.
- `updateProgramStatusSchema`: Validates program state transitions (`ProgramStatus` enum).

#### 📄 `backend/src/validators/registration.validator.ts`
- `participantRegistrationSchema` & `volunteerRegistrationSchema`: Validates public registration fields (Indian 10-digit phone regex `^[6-9]\d{9}$`, email, location, college, year).
- `updateRegistrationStatusSchema`: Validates status updates for the participation funnel and optional hours contributed.

---

### 6.7 Routing Layer (`routes/`)

Maps HTTP methods and endpoints to their respective controllers and middleware guards:

#### 📄 `backend/src/routes/auth.routes.ts`
- `POST /api/v1/auth/login` (Public)
- `POST /api/v1/auth/logout` (Protected)
- `GET /api/v1/auth/me` (Protected)

#### 📄 `backend/src/routes/program.routes.ts`
- `GET /api/v1/programs` (Protected)
- `GET /api/v1/programs/:id` (Protected)
- `POST /api/v1/programs` (Protected - `ADMIN` / `STAFF`)
- `PATCH /api/v1/programs/:id` (Protected - `ADMIN` / `STAFF` / `COORDINATOR`)
- `PATCH /api/v1/programs/:id/status` (Protected - `ADMIN` / `STAFF`)
- `DELETE /api/v1/programs/:id` (Protected - `ADMIN` only)
- `POST /api/v1/programs/:programId/register/participant` (Public)
- `POST /api/v1/programs/:programId/register/volunteer` (Public)
- `GET /api/v1/programs/:programId/registrations` (Protected)

#### 📄 `backend/src/routes/people.routes.ts`
- `GET /api/v1/participants` (Protected - Search, filter, pagination)
- `GET /api/v1/participants/track/:trackingId` (**Public Self-Tracking**)
- `GET /api/v1/participants/:id` (Protected)
- `GET /api/v1/volunteers` (Protected)
- `GET /api/v1/volunteers/track/:trackingId` (**Public Self-Tracking**)
- `GET /api/v1/volunteers/:id` (Protected)

#### 📄 `backend/src/routes/registration.routes.ts`
- `GET /api/v1/registrations/:id` (Protected)
- `PATCH /api/v1/registrations/:id` (Protected - Participation funnel update)

#### 📄 `backend/src/routes/analytics.routes.ts`
- `GET /api/v1/analytics/dashboard` (Protected - `ADMIN` / `STAFF` / `COORDINATOR`)
- `GET /api/v1/analytics/programs` (Protected - Program-wise impact)
- `GET /api/v1/analytics/location` (Protected - Location-wise impact)

---

### 6.8 Controllers Layer (`controllers/`)

Controllers act as HTTP adapters: they extract inputs, invoke Zod validation schemas, call the appropriate service method, and format the HTTP response.

- 📄 `auth.controller.ts`: Handles login, logout, and session user retrieval.
- 📄 `program.controller.ts`: Handles program listings, single lookups, program creation, updates, and deletions.
- 📄 `registration.controller.ts`: Handles public participant/volunteer registrations, program registration lists, and status updates.
- 📄 `participant.controller.ts`: Handles participant and volunteer queries and public tracking lookup.
- 📄 `analytics.controller.ts`: Handles dashboard and geographic impact analytics queries.

---

### 6.9 Business Logic & Service Layer (`services/`)

Contains the core business rules and database queries via Prisma ORM:

#### 📄 `backend/src/services/auth.service.ts`
- Interacts with Supabase Auth to authenticate credentials.
- Queries the PostgreSQL database to verify user status and role.
- Returns access tokens and user profile data.

#### 📄 `backend/src/services/program.service.ts`
- Implements program search (name, code, description, location) and filtering (`status`, `location`).
- Calculates automated program codes based on location and category sequences (`generateProgramCode`).
- Manages relational queries including coordinator details and registration counts.

#### 📄 `backend/src/services/registration.service.ts`
- Enforces registration business rules:
  - Verifies program exists and is in `ACTIVE` or `UPCOMING` status.
  - Finds or creates the `Participant` / `Volunteer` record (reusing existing participant profiles across different programs).
  - Enforces duplicate registration prevention via database composite unique constraints.
  - Generates unique tracking IDs for new registrants.
  - Automatically records timestamp transitions (`attendedAt`, `participatedAt`, `completedAt`) as the funnel progresses.
  - Automatically calculates and updates accumulated volunteer hours on the volunteer's main profile when a volunteer completes a program.

#### 📄 `backend/src/services/participant.service.ts`
- Provides server-side search, filtering by program, and pagination for participant and volunteer rosters.
- Implements the secure public tracking lookup by `trackingId` that selects only the registrant's own data and program history.

#### 📄 `backend/src/services/analytics.service.ts`
- Executes database-level aggregations (`groupBy`, `count`, `aggregate` sum) to calculate:
  - Total and active programs.
  - Total unique participants and volunteers.
  - Attendance rate: `(totalAttended / totalRegistrations) * 100`.
  - Completion rate: `(totalCompleted / totalRegistrations) * 100`.
  - Total volunteer contribution hours.
  - Real-time registration funnel distribution across all 4 stages.
  - Location-wise program distribution.

---

### 6.10 Database Schema, Migrations & Seeding

#### 📄 `backend/prisma/schema.prisma`
- **Datasource:** PostgreSQL on Supabase.
- **Client:** `@prisma/client`.
- **Enums & Models:** Full declaration of `User`, `Program`, `Participant`, `Volunteer`, `Registration`, `ImpactRecord` with foreign key relations, cascade deletes, composite unique keys, and B-Tree indexes for fast lookups.

#### 📁 `backend/prisma/migrations/20260817063625_init/migration.sql`
- Raw SQL migration script generated by Prisma that defines the table creation DDL, foreign key constraints, default UUID values, and indexes.

#### 📄 `backend/prisma/seed.ts`
- Automated database seeding script:
  - Creates the Supabase Auth Admin user: `admin@ngo.org` / `Admin@12345`.
  - Seeds 5 diverse community programs covering `ACTIVE`, `UPCOMING`, `COMPLETED`, `DRAFT`, and `CANCELLED` states.
  - Seeds 20 Indian participants across multiple colleges and locations.
  - Seeds 10 volunteers with diverse contribution hours and interests.
  - Seeds 30 registrations distributed across the participation funnel.
  - Seeds 5 impact metric records.

#### 📄 `database/README.md`
- Documentation guide for the Database Developer explaining table relationships, enum lifecycles, and migration commands.

---

### 6.11 Documentation & Testing Files (`docs/`)

#### 📄 `backend/docs/API.md`
- Complete API specification documenting every endpoint, query parameter, request body schema, response structure, and error code.

#### 📄 `backend/docs/postman_collection.json`
- Postman v2.1.0 collection file containing pre-configured requests for all endpoints with automated test scripts to save JWT tokens into collection variables upon login.

---

### 6.12 Project Configuration Files

- 📄 `backend/package.json`: NPM package configuration declaring dependencies (`express`, `@supabase/supabase-js`, `@prisma/client`, `zod`, `cors`, `dotenv`, `uuid`) and development scripts (`dev`, `build`, `start`, `db:seed`, `prisma:migrate`).
- 📄 `backend/tsconfig.json`: TypeScript compiler options (`strict: true`, `target: ES2020`, `module: commonjs`, `esModuleInterop: true`).
- 📄 `backend/prisma.config.ts`: Prisma CLI migration configuration.
- 📄 `backend/.env.example`: Safe environment variable template with connection string instructions.
- 📄 `backend/.env`: Local environment file containing live Supabase database URLs and keys (ignored by Git).
- 📄 `backend/.gitignore` & `/.gitignore`: Prevents secrets (`.env`), build artifacts (`dist/`), and dependencies (`node_modules/`) from being pushed to version control.

---

# 7. Viva / Professor Q&A Guide

### Q1: Why did you use Prisma ORM instead of writing raw SQL queries?
> **Answer:** Prisma provides compile-time type safety, automated migration management, and parameterized queries that protect against SQL injection vulnerabilities. It generates TypeScript types directly from the schema, ensuring that database models and API types remain synchronized.

### Q2: What is the purpose of the Controller-Service architecture?
> **Answer:** It enforces Separation of Concerns:
> - **Controllers** handle HTTP-specific tasks (extracting headers, request bodies, query params, input validation with Zod, and sending HTTP status codes).
> - **Services** encapsulate pure business logic and database interactions. This allows business logic to be unit tested and reused independently of the HTTP delivery mechanism.

### Q3: Why do participants have both a database `id` (UUID) and a `trackingId`?
> **Answer:** UUIDs are used internally as primary keys for database efficiency, relational foreign keys, and preventing collision across distributed systems. However, UUIDs (e.g. `8cb77696-9c8c-4076-8c04-2e68cbdf6434`) are difficult for human users to read or remember. The `trackingId` (e.g. `CPR-PAR-7FCFFC35`) provides a clean, user-friendly, human-readable identifier that participants can easily enter on a public tracking page without needing login credentials.

### Q4: How is Role-Based Access Control (RBAC) enforced?
> **Answer:** RBAC is enforced in two steps:
> 1. `auth.ts` verifies the cryptographic signature of the Supabase JWT token and attaches the user's identity.
> 2. `authorize.ts` checks the user's verified database role (`ADMIN`, `STAFF`, `COORDINATOR`) against the allowed roles for that specific endpoint before granting access.

### Q5: How do you handle analytics calculation without slowing down the server?
> **Answer:** We do not fetch thousands of records to the Node.js server to calculate metrics in JavaScript memory. Instead, we offload calculations to PostgreSQL using Prisma's `count()`, `groupBy()`, and `aggregate()` functions. PostgreSQL calculates the totals, averages, and funnel counts directly on indexed fields, returning only the final computed figures to the backend.

---
*Authored for the Community Program & Volunteer Impact Tracking System Project.*
