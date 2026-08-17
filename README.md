# NGO Community Program & Volunteer Impact Tracking System

A centralized portal for NGO administrators, program coordinators, volunteers, and participants.

## Tech Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Authentication**: Supabase Auth (JWT)
- **Frontend**: React + TypeScript + Tailwind CSS *(separate branch)*

## Branches

| Branch | Owner | Contents |
|--------|-------|----------|
| `main` | — | Root README |
| `feature/backend-api` | Backend Developer | Express API, services, routes, middleware |
| `feature/database-schema` | Database Developer | Prisma schema, migrations, seed data |

## Architecture

```
Frontend (React) → REST API /api/v1 → Express Backend → Prisma ORM → PostgreSQL (Supabase)
```

## Quick Start (Backend)

```bash
cd backend
cp .env.example .env        # Fill in Supabase credentials
npx prisma migrate dev      # Run migrations
npm run db:seed             # Seed sample data
npm run dev                 # Start server → http://localhost:5000
```

## API Documentation

See [`backend/docs/API.md`](./backend/docs/API.md)

## Contract

See the Integration Contract document for shared API contracts, naming conventions, and development rules.
