# ADR-006: PWA + TWA for Mobile Distribution

## Status

Accepted

## Date

2025-02

## Context

PropVisionAI targets real estate professionals who primarily use mobile devices to photograph properties. We need a mobile-friendly distribution strategy that:

- Provides an app-like experience on mobile
- Is installable from the Play Store (for discoverability and trust)
- Avoids the cost and complexity of maintaining a native Android/iOS codebase
- Leverages the existing web app without duplication

We considered:

- **PWA only** – Installable via browser, but no Play Store presence.
- **React Native** – Full native app, but requires separate codebase and maintenance.
- **Capacitor/Cordova** – Wraps web in WebView, but adds build complexity.
- **TWA (Trusted Web Activity)** – Chrome-based, Play Store distributable, zero code duplication.
- **PWA + TWA** – PWA for direct install, TWA for Play Store. Best of both worlds.

## Decision

Implement **PWA** with service worker for direct mobile install, plus **TWA** via Bubblewrap for Play Store distribution.

### PWA Configuration

- `manifest.json` with standalone display mode, themed icons (72px–512px)
- Service worker (`sw.js`) with cache-first for fingerprinted assets, network-first for API
- Install prompt via `useInstallPrompt` hook

### TWA Configuration

- Bubblewrap-generated Gradle project in `twa/`
- Digital Asset Links in `public/.well-known/assetlinks.json`
- Signed APK and AAB for Play Store submission

## Consequences

### Positive

- Single codebase serves web, PWA, and Play Store
- PWA provides offline-capable experience with service worker caching
- TWA eliminates the Chrome address bar for a native feel
- Play Store listing increases trust and discoverability in Thai market
- No native code to maintain

### Negative

- TWA requires Chrome on the device (falls back to Custom Tabs)
- iOS has limited PWA support (no TWA equivalent for App Store)
- Service worker cache management adds complexity
- Digital Asset Links require SHA256 fingerprint management for signing keys

### Risks

- Google may change TWA policies or Chrome requirements
- iOS PWA limitations may frustrate iPhone users
