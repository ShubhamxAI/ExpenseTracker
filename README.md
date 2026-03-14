# ExpenseTracker

Tracking Daily expense

## Starter Baseline

The current baseline is a local-first Expo starter for Android and Expo Go.
It opens with a welcome splash for ExpenseTracker, then transitions to a main
page that shows demo expenses stored in a local on-device SQLite database using
the shared dark purple theme and Heroicons only.

## Run Locally

1. Install dependencies with `yarn`.
2. Run `yarn starter:check`.
3. Start the dev server with `yarn starter:start`.
4. Open the app in Expo Go, or run `yarn starter:android` if your Android SDK and emulator or device are ready.
5. Swipe any expense card left on the main page to remove it from the visible list and the local device database.

## Build Android Debug APK

1. Verify the Android environment with `node scripts/validate-starter-setup.mjs apk`.
2. Build the debug APK with `yarn starter:apk`.
3. Retrieve the artifact from `android/app/build/outputs/apk/debug/app-debug.apk`.

## Scope Guardrails

- The starter is offline-first and local-only.
- The visible expenses are demo data stored only in the local on-device SQLite database for UI review.
- No SMS, analytics, authentication, or network sync behavior is included in this slice.
- Splash copy is hard-coded in shared starter constants rather than loaded from local config.

## Governance

Product and engineering policies are defined in `.specify/memory/constitution.md`.
All new feature specs, plans, and task lists should align with this constitution.
Each new spec must be created on its own newly created feature branch, with a
matching directory under `specs/`.
