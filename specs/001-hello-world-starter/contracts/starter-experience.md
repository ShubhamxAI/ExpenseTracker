# Contract: Starter Experience

## Purpose

Define the public contract for the first-screen starter experience and the local configuration it consumes.

## Local Configuration Contract

Tracked example file:

```javascript
const STARTER_CONFIG = {
  greetingMessage: "Hello from ExpenseTracker",
  baselineLabel: "Starter Baseline",
};

export default STARTER_CONFIG;
```

Local override file:

- Path: `src/config/starterConfig.local.js`
- Shape: default export of an object with `greetingMessage` and `baselineLabel`
- Key rules:
  - Keys use `camelCase`
  - Values are non-empty strings
  - File is local-editable before launch
  - File contains no secrets

## UI Rendering Contract

When the app reaches the first visible screen, it must render all of the following without network access:

- Product name: `ExpenseTracker`
- Greeting text: value from `starterConfig.local.js.greetingMessage`
- Starter state label: value from `starterConfig.local.js.baselineLabel`

Additional rendering rules:

- The product name and starter label must remain visually distinguishable on a smaller Android screen.
- The starter screen must not trigger SMS reads, database creation, authentication, analytics, or any external API calls.
- The screen must remain stable when the device is offline.

## Failure Contract

The preflight validation command must exit non-zero before Android build or run commands proceed when a required dependency is missing.

Supported failure classes:

- `MISSING_LOCAL_CONFIG`
- `MISSING_ANDROID_SDK`
- `MISSING_DEVICE`
- `MISSING_NODE_DEPENDENCIES`

Each failure must provide:

- A short summary of what is missing
- Recovery steps that a maintainer can execute locally
- The command that was blocked

## Artifact Contract

- Build type: Android debug
- Expected artifact path: `android/app/build/outputs/apk/debug/app-debug.apk`
- Install target: local Android emulator or physical Android device
