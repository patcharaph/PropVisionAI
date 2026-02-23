# ADR-002: Use Express.js for Backend API

## Status

Accepted

## Date

2025-01

## Context

The backend serves as a thin orchestration layer between the frontend and external AI services (OpenRouter, Fal.ai) plus a database (Supabase). It needs to:

- Accept image uploads (multipart form data)
- Orchestrate two sequential AI API calls
- Manage user quotas and analytics
- Be deployable as a container on Cloud Run

We considered:

- **Express.js** – Minimal, well-understood, excellent middleware ecosystem (multer, cors).
- **Fastify** – Faster but less ecosystem maturity for file uploads.
- **Serverless functions (Cloud Functions)** – Cold starts problematic for 20s+ AI generation flows.
- **NestJS** – Too much structure for 6 simple endpoints.

## Decision

Use **Express.js 4.18** with Node.js 20 as the backend API framework.

## Consequences

### Positive

- Multer integrates natively for file upload handling
- Minimal boilerplate — the entire API fits in a single `index.js` with service modules
- Easy to containerize with a standard Dockerfile
- Team familiarity; fast iteration
- CORS middleware handles cross-origin requests from Vercel-hosted frontend

### Negative

- No built-in TypeScript support (acceptable for current project size)
- No request validation framework out of the box
- Single-threaded; long AI calls block the event loop (mitigated by async/await)

### Risks

- As the API grows, the flat file structure may need refactoring into controllers/routes
