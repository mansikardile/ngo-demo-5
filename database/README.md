# Database — Community Program & Volunteer Impact Tracking System

This folder is the **Database Developer's** reference area.

## Technology
- **PostgreSQL** hosted on Supabase
- **Prisma ORM** for schema, migrations, and queries
- Project: `https://sijypfejdzwqvtulnjrz.supabase.co`

---

## Folder Contents

```
database/
├── schema/
│   └── schema.prisma     ← Mirror of backend/prisma/schema.prisma (reference copy)
├── migrations/           ← SQL files exported from Prisma migrations (reference)
└── README.md             ← This file
```

> ⚠️ **The source of truth for the schema is `backend/prisma/schema.prisma`.**
> Changes must go through Prisma migrations, not manual SQL on Supabase Studio.

---

## Entities

| Table | Description |
|-------|-------------|
| `users` | NGO Admins, Staff, Coordinators (Supabase Auth linked) |
| `programs` | Community programs with unique `program_code` |
| `participants` | Public registrants with `tracking_id` (CPR-PAR-XXXXXXXX) |
| `volunteers` | Public volunteers with `tracking_id` (CPR-VOL-XXXXXXXX) |
| `registrations` | Links participants/volunteers to programs, holds funnel status |
| `impact_records` | Program-level outcome metrics |

---

## Status Enums (contract Section 14)

### ProgramStatus
`DRAFT` → `UPCOMING` → `ACTIVE` → `COMPLETED` | `CANCELLED`

### RegistrationStatus (participation funnel)
`REGISTERED` → `ATTENDED` → `PARTICIPATED` → `COMPLETED`

### VolunteerStatus
`REGISTERED` → `ASSIGNED` → `ACTIVE` → `COMPLETED`

---

## ID Strategy (contract Section 8)

- **Primary keys**: UUID (`id`)
- **Participant tracking**: `CPR-PAR-XXXXXXXX` (human-readable, separate from UUID)
- **Volunteer tracking**: `CPR-VOL-XXXXXXXX`
- **Program code**: `EDU-PUN-2026-01` (category-location-year-sequence)

---

## Setup Instructions

### 1. Get database credentials from Supabase

Go to: Supabase Dashboard → Project `sijypfejdzwqvtulnjrz` → Settings → Database

Copy:
- **Transaction pooler URL** → set as `DATABASE_URL` in `backend/.env`
- **Direct URL** → set as `DIRECT_URL` in `backend/.env`

### 2. Run migrations

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, SUPABASE_SERVICE_ROLE_KEY

npx prisma migrate dev --name init
```

### 3. Seed the database

```bash
npm run db:seed
```

This will create:
- 1 Admin user (via Supabase Auth): `admin@ngo.org` / `Admin@12345`
- 5 Programs (ACTIVE, UPCOMING, COMPLETED, DRAFT, CANCELLED)
- 20 Participants with tracking IDs
- 10 Volunteers with tracking IDs
- 30 Registrations across programs
- 5 Impact records

### 4. View data in Prisma Studio

```bash
npx prisma studio
```

---

## Important Rules (contract Sections 5-7)

1. **Never rename** a column/table without coordinating with the backend dev
2. **Never delete** columns used by the backend
3. **All schema changes** go through `prisma migrate dev`, not Supabase Studio SQL editor
4. **Indexes** are defined in `schema.prisma` — do not add/remove without updating the file
5. **Row Level Security (RLS)** on Supabase: the backend uses the Service Role Key which bypasses RLS — all access control is enforced in the Express middleware

---

## Key Relationships

```
User ──(1:N)──► Program (coordinator)
Program ──(1:N)──► Registration
Participant ──(1:N)──► Registration
Volunteer ──(1:N)──► Registration
Program ──(1:N)──► ImpactRecord
```

Each `Registration` belongs to either a `Participant` OR a `Volunteer` (not both), determined by `registrant_type`.
