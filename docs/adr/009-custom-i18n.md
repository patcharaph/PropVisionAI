# ADR-009: Custom i18n with React Context

## Status

Accepted

## Date

2025-02

## Context

PropVisionAI targets the Thai real estate market but should also support English-speaking users. The app needs bilingual support for:

- UI labels, buttons, and messages
- Room type names and descriptions
- Renovation cost descriptions
- Error messages

We considered:

- **react-i18next** – Full-featured i18n library with namespace support, pluralization, and interpolation.
- **Custom React Context** – Lightweight, zero dependencies, sufficient for 2 languages.
- **Format.js (react-intl)** – Powerful but heavy for a simple 2-language app.

## Decision

Use a **custom `I18nContext`** with a simple translation object structure. Language preference stored in `localStorage`.

### Implementation:

- Translation strings defined inline in context file
- Language toggle between `en` and `th`
- Context provides `t()` function for string lookup
- Language persists across sessions via `localStorage`

## Consequences

### Positive

- Zero additional dependencies
- Simple flat string structure is easy to maintain for 2 languages
- Language switch is instant (no async loading)
- Full control over translation logic
- Easy to understand and modify

### Negative

- No pluralization, interpolation, or namespace support out of the box
- All translations bundled in the main bundle (no lazy loading per locale)
- Adding a third language increases maintenance burden linearly
- No established tooling for translation management (no extraction, no CI checks)

### Risks

- If the app needs 3+ languages or complex pluralization, migration to `react-i18next` would be advisable
- Inline translation strings may lead to inconsistencies without automated checks
