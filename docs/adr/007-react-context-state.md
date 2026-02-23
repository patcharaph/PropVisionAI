# ADR-007: React Context for State Management

## Status

Accepted

## Date

2025-01

## Context

The staging workflow requires shared state across multiple pages:

- **Landing** → user selects room size and uploads image
- **Preview** → displays original image, triggers generation
- **Result** → shows generated image with before/after slider, renovation costs

State includes: `originalImage`, `generatedImageUrl`, `roomSize`, `roomType`, `isGenerating`, `dailyQuota`, `error`.

We considered:

- **React Context** – Built-in, zero dependencies, sufficient for app-wide state.
- **Redux / Zustand** – Powerful but overkill for <10 state properties.
- **URL state (search params)** – Doesn't work for binary image data.
- **Prop drilling** – Fragile across 3+ levels of nesting with React Router.

## Decision

Use **React Context** (`StagingContext`) for the staging workflow state and **a separate `I18nContext`** for internationalization state.

### StagingContext provides:

- Image state (`originalImage`, `generatedImageUrl`)
- Room configuration (`roomSize`, `roomType`)
- UI state (`isGenerating`, `error`, `dailyQuota`)
- Computed methods (`getRenovationCosts()`, `getRoomSizeInfo()`)
- Actions (`resetState()`)

### I18nContext provides:

- Current language (`en` / `th`)
- Translation function
- Language persistence to `localStorage`

## Consequences

### Positive

- Zero additional dependencies
- Simple and readable — entire state fits in one context file
- Computed methods colocated with state (e.g., `getRenovationCosts()`)
- Language preference persists across sessions via localStorage
- Easy to understand for new contributors

### Negative

- All consumers re-render on any state change (acceptable with <10 state properties)
- No middleware, devtools, or time-travel debugging
- Would need migration if state complexity grows significantly

### Risks

- If the app grows to 20+ state properties, performance may degrade and migration to Zustand/Redux would be needed
