# ADR-003: Two-Step AI Pipeline (OpenRouter + Fal.ai)

## Status

Accepted

## Date

2025-01

## Context

The core product feature is transforming a room photo into a virtually staged interior. This requires:

1. **Understanding the room** – identifying room type, existing features, and layout
2. **Generating a staged image** – creating a photorealistic redesign

A single model cannot do both well. Vision-language models excel at understanding but produce text, not images. Image generation models need detailed prompts to produce quality output.

We evaluated:

- **Single model (end-to-end)** – No model reliably does both analysis and generation at the required quality.
- **OpenAI DALL-E 3** – Good generation but limited image-to-image control.
- **Stable Diffusion (self-hosted)** – Full control but requires GPU infrastructure and maintenance.
- **OpenRouter + Fal.ai** – Best-of-breed: Claude 3 Haiku via OpenRouter for fast room analysis, Fal.ai Flux for high-quality image-to-image transformation.

## Decision

Use a **two-step pipeline**:

1. **Step 1 – Room Analysis**: Send the uploaded image to **OpenRouter** (Claude 3 Haiku with vision) to extract room type, features, and characteristics as structured text.
2. **Step 2 – Image Generation**: Send the original image + enriched prompt to **Fal.ai Flux** (image-to-image) to generate the staged result with Modern Scandinavian styling.

A **20-second timeout** protects against slow Fal.ai responses, returning a fallback demo image if exceeded.

## Consequences

### Positive

- Room-aware prompts produce significantly better staging results than generic prompts
- Claude 3 Haiku is fast (~1-2s) and cheap ($0.25/1M input tokens)
- Fal.ai Flux provides high-quality image-to-image at $0.03/megapixel
- Each service can be replaced independently (loose coupling)
- Cost tracking is straightforward per step

### Negative

- Two external API calls increase latency (total ~10-15s typical)
- Two points of failure; both must succeed for a generation
- Timeout fallback means some users get a demo image instead of a real result

### Risks

- External API pricing changes could affect unit economics
- Fal.ai or OpenRouter outages directly impact service availability
- Image quality varies with room type and lighting conditions
