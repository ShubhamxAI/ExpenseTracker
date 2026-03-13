# Research: Hello World Starter

## Decision 1: Bootstrap with React Native CLI using the JavaScript template

- Decision: Use a React Native CLI project at repository root, Android-first, with JavaScript rather than Expo or a TypeScript-first template.
- Rationale: The constitution explicitly sets the mobile baseline as React Native (JavaScript) with Redux and clean-architecture boundaries. React Native CLI also aligns directly with the required local emulator/device demo and standard debug APK generation path.
- Alternatives considered: Expo was rejected because it adds managed-workflow constraints and a different local artifact path than the requested debug-installable Android deliverable. TypeScript-first bootstrap was rejected for this slice because the constitution names JavaScript and the goal is the smallest runnable checkpoint.

## Decision 2: Use a local ignored config module for visible text overrides

- Decision: Track `src/config/starterConfig.example.js` and require maintainers to create or edit `src/config/starterConfig.local.js` before launch for `greetingMessage` and `baselineLabel` overrides.
- Rationale: The requirement is to override visible starter text by editing a local config value before launch. A local module keeps the override explicit, offline, low-risk, and easy to validate without introducing environment-variable tooling for non-secret strings.
- Alternatives considered: `.env` values were rejected for the starter label and greeting because they are not secrets and would add extra React Native environment plumbing in the first slice. Remote config was rejected because the starter must work offline and must not depend on network services.

## Decision 3: Add a preflight validation script ahead of Android run/build commands

- Decision: Provide a Node-based `scripts/validate-starter-setup.js` and wrapper commands such as `npm run starter:check`, `npm run android`, and `npm run starter:apk` that fail fast when local config, Android SDK, or device/emulator prerequisites are missing.
- Rationale: The spec requires clear build or run errors with recovery steps. Native Gradle or adb failures are often too opaque for a first-slice maintainer experience, so preflight validation gives deterministic error messages and next actions.
- Alternatives considered: Relying only on raw Gradle or Metro errors was rejected because it would not satisfy the clarity requirement. A custom shell-only script was rejected because a Node script is more portable within a JavaScript React Native project and easier to test.

## Decision 4: Standardize the deliverable artifact as the Android debug APK

- Decision: Treat `android/app/build/outputs/apk/debug/app-debug.apk` as the required debug-installable artifact for this slice.
- Rationale: It is the standard local installable Android build output for React Native CLI projects and matches the requirement for a repeatable debug-installable artifact.
- Alternatives considered: AAB output was rejected because it is not the simplest local install artifact for emulator/device demos. Release signing was rejected because it is out of scope for a minimal starter.

## Decision 5: Include a minimal Redux shell even though the feature is one screen

- Decision: Create a minimal starter slice in Redux Toolkit to hold the loaded display values and keep the app aligned with the constitution's React Native + Redux baseline.
- Rationale: This preserves the intended project architecture without expanding scope into real business state. It also gives subsequent task generation a stable place to evolve the app shell.
- Alternatives considered: A pure component-local state implementation was rejected because it would immediately diverge from the mandated architecture baseline. A larger domain-state setup was rejected because it would add unnecessary complexity before any expense-tracking logic exists.
