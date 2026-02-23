# ADR-001: Use React + Vite for Frontend

## Status

Accepted

## Date

2025-01

## Context

PropVisionAI needs a responsive, interactive frontend for an image upload-and-preview workflow (upload room photo, preview staging result with before/after comparison). The UI must support:

- Image upload with client-side compression
- Multi-step wizard flow (Landing → Preview → Result)
- Real-time state updates during AI generation
- PWA capabilities for mobile install
- Fast development iteration for a small team

We evaluated several options:

- **Next.js** – Full-featured but heavier than needed; we have a separate Express backend and don't need SSR for this image-centric app.
- **React + Vite** – Lightweight, fast HMR, simple config, great ecosystem.
- **Vue + Vite** – Viable, but the team has stronger React experience.
- **Vanilla JS** – Too much boilerplate for the interactive UI required.

## Decision

Use **React 19** with **Vite** as the build tool and dev server.

## Consequences

### Positive

- Extremely fast HMR and build times with Vite
- React's ecosystem provides mature libraries for routing (`react-router`), image handling, and PWA support
- Easy to add Tailwind CSS v4 via Vite plugin
- Simple deployment to Vercel as a static SPA
- React 19 hooks simplify component logic

### Negative

- No SSR out of the box (not needed for this app but limits future SEO options)
- Vite 8 beta may have occasional breaking changes
- Client-side only means initial load requires JavaScript

### Risks

- React 19 is the latest major version; some third-party libraries may lag in compatibility
