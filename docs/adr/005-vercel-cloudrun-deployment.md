# ADR-005: Deploy on Vercel + Cloud Run

## Status

Accepted

## Date

2025-01

## Context

PropVisionAI has a clear frontend/backend split that allows independent deployment:

- **Frontend**: Static SPA (React + Vite build output)
- **Backend**: Node.js Express API with file upload handling and long-running AI calls

We need:

- Zero-config frontend deployment with automatic HTTPS and CDN
- Container support for the backend (long-running requests up to 20s+)
- Cost-effective for beta traffic volumes
- Easy environment variable management

We considered:

- **Vercel (frontend) + Cloud Run (backend)** – Best-of-breed for each workload.
- **Vercel for both** – Serverless functions have 10s timeout limits, too short for AI generation.
- **Cloud Run for both** – Possible but adds CDN/SSL complexity for the static frontend.
- **AWS (S3 + Lambda/ECS)** – More configuration overhead for the same result.

## Decision

- Deploy frontend on **Vercel** with SPA rewrite rules (`vercel.json`)
- Deploy backend on **Google Cloud Run** with a single Dockerfile
- Connect via `VITE_API_URL` environment variable

## Consequences

### Positive

- Vercel provides instant deployments, preview URLs, and global CDN
- Cloud Run scales to zero (no cost when idle) and supports long requests
- Each can be deployed independently
- `vercel.json` handles SPA client-side routing rewrites
- Cloud Run's `--allow-unauthenticated` simplifies public API access

### Negative

- Cross-origin setup required (CORS configuration on backend)
- Two deployment platforms to monitor
- Cloud Run cold starts add ~2-3s on first request after idle period

### Risks

- Cloud Run pricing scales with usage; unexpected traffic spikes could increase costs
- Vercel free tier has bandwidth limits for production use
