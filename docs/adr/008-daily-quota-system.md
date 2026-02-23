# ADR-008: Daily Quota System for Rate Limiting

## Status

Accepted

## Date

2025-01

## Context

Each AI generation costs approximately $0.03–0.05 (OpenRouter + Fal.ai combined). Without limits, a single user could generate hundreds of images and create significant API costs. We need a rate limiting mechanism that:

- Prevents abuse and cost overruns
- Is fair to individual users
- Works for anonymous users (no auth in beta)
- Provides clear feedback to the user about remaining quota

We considered:

- **IP-based rate limiting** – Unreliable with mobile networks and VPNs.
- **Account-based limits** – Requires authentication system (not in beta).
- **Daily quota per user ID** – Simple, uses client-generated or anonymous ID.
- **Pay-per-use** – Premature for beta; needs payment infrastructure.

## Decision

Implement a **daily quota of 3 generations per user per day**, tracked in Supabase (`user_quota` table) with an in-memory fallback for development.

### Implementation details:

- User identified by client-generated ID (stored in localStorage)
- Quota resets daily (based on database date comparison)
- Backend checks quota before executing generation pipeline
- Frontend displays remaining quota count
- Quota upsell UI prepared for future monetization

## Consequences

### Positive

- Predictable cost ceiling: max 3 generations × $0.05 = $0.15/user/day
- Simple implementation; no complex rate limiting infrastructure
- Users get clear feedback about remaining generations
- Quota table enables usage analytics and forecasting
- In-memory fallback means local dev has unlimited generations

### Negative

- Client-generated IDs can be spoofed (acceptable for beta)
- Hard limit may frustrate power users
- No carry-over of unused quota between days

### Risks

- Determined users can bypass by clearing localStorage (acceptable trade-off for beta phase)
- Quota system needs proper authentication before production launch
