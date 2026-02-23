# ADR-004: Use Supabase for Database

## Status

Accepted

## Date

2025-01

## Context

PropVisionAI needs persistent storage for:

- **User quotas** – tracking daily generation limits per user
- **Generation logs** – recording performance metrics, costs, and outcomes
- **Analytics events** – funnel tracking (upload → generate → share → feedback)
- **User feedback** – star ratings and comments

Requirements:

- Managed PostgreSQL (no DBA overhead)
- Row Level Security for data isolation
- Quick setup with a JavaScript SDK
- Free tier sufficient for beta launch
- In-memory fallback for local development without database

We considered:

- **Supabase** – Managed Postgres, JS SDK, RLS, generous free tier.
- **Firebase/Firestore** – NoSQL; relational queries for analytics would be awkward.
- **PlanetScale** – MySQL-based; less ecosystem fit with our Node.js stack.
- **Raw PostgreSQL on Cloud SQL** – More operational overhead.

## Decision

Use **Supabase** (PostgreSQL) with the `@supabase/supabase-js` SDK. Schema defined in `backend/supabase-schema.sql`.

Implement an **in-memory fallback** in all database service modules so the app runs without Supabase configured (for local development).

## Consequences

### Positive

- Zero infrastructure management; Supabase handles backups, scaling, and SSL
- RLS policies enforce service-role-only access at the database level
- PostgreSQL enables complex analytics queries (7-day aggregations, funnel analysis)
- JS SDK integrates cleanly with Express backend
- In-memory fallback enables development without cloud dependencies

### Negative

- Vendor lock-in to Supabase's SDK patterns (mitigated by standard SQL schema)
- Free tier has connection and storage limits
- In-memory fallback means local dev doesn't test real database behavior

### Key Tables

| Table | Purpose |
|-------|---------|
| `user_quota` | Daily generation limit tracking |
| `generation_jobs` | Job status tracking |
| `generation_logs` | Performance metrics and cost analysis |
| `analytics_events` | User funnel tracking |
| `user_feedback` | Ratings and comments |
