# Architecture

## Shared layer

`www/` is the single shared travel experience used by PWA, Android and iOS. It contains the timeline UI, scene dialogs, local phrasebook, credential wallet logic, itinerary data and offline fallback assistant.

## Android

Capacitor generates `android/`. `scripts/prepare-android.mjs` then applies the TUHU native plugins:

- `TuhuFilesPlugin` for private file handling.
- `TuhuLlmPlugin` for optional on-device GGUF inference.
- `MainActivity` plugin registration.

If no GGUF model is installed, the app keeps working through the built-in travel knowledge base.

## iOS

Capacitor generates `ios/`. iOS keeps the same travel UI and device-local storage. Android-only GGUF integration is intentionally not required on iOS; the assistant falls back to the built-in travel knowledge base.

## Data boundary

Repository data is app/content data. User-imported credentials and receipts stay in private app storage and are not source assets.