# Contract: Starter Experience

## Purpose

Define the public contract for the first-screen starter experience and the local configuration it consumes.

## Local Configuration Contract

Tracked example file:

```javascript
const STARTER_CONFIG = {
  greetingMessage: 'Welcome to ExpenseTracker',
  baselineLabel: 'Starter Baseline',
};

export default STARTER_CONFIG;
```

Local override file:

- Path: `src/config/starterConfig.js`
- Shape: default export of an object with `greetingMessage` and `baselineLabel`
- Key rules:
  - Keys use `camelCase`
  - Values are non-empty strings
  - File is local-editable before launch
  - File contains no secrets

## UI Rendering Contract

When the app launches, it must render the starter flow without network access:

- First visible splash state:
  - Product name: `ExpenseTracker`
  - Greeting text: value from `starterConfig.js.greetingMessage`
  - Starter state label: value from `starterConfig.js.baselineLabel`
  - Theme styling from the shared starter theme module
  - Heroicons-only iconography where an icon is used
- Follow-up main page state:
  - A local demo overview card for the starter baseline
  - A demo expense list rendered from the local on-device database only
  - Swipe-to-delete behavior that removes an expense row from the UI and the local on-device database
  - No sync or remote fetch requirement before rendering

Additional rendering rules:

- The product name and starter label must remain visually distinguishable on a smaller Android screen.
- The starter screen must use a centralized dark purple high-contrast theme with a sophisticated old-money tone.
- Any icon rendered on the first screen must come from Heroicons only.
- The starter flow must not trigger SMS reads, analytics, authentication, or any external API calls.
- The screen must remain stable when the device is offline.
- The local database is allowed only for seeded demo expenses in this starter slice.

## Failure Contract

The preflight validation command must exit non-zero before Android build or run commands proceed when a required dependency is missing.

Supported failure classes:

- `MISSING_LOCAL_CONFIG`
- `MISSING_ANDROID_SDK`
- `MISSING_ANDROID_PLATFORM_TOOLS`
- `MISSING_DEVICE`
- `MISSING_ANDROID_PROJECT`
- `MISSING_NODE_DEPENDENCIES`

Each failure must provide:

- A short summary of what is missing
- Recovery steps that a maintainer can execute locally
- The command that was blocked

## Artifact Contract

- Build type: Android debug
- Build command: `yarn starter:apk`
- Expected artifact path: `android/app/build/outputs/apk/debug/app-debug.apk`
- Install target: local Android emulator or physical Android device
