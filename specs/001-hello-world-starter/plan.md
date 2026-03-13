# Implementation Plan: Hello World Starter

**Branch**: `001-hello-world-starter` | **Date**: 2026-03-13 | **Spec**: `/home/ubuntu/projects/ExpenseTracker/specs/001-hello-world-starter/spec.md`
**Input**: Feature specification from `/specs/001-hello-world-starter/spec.md`

## Summary

Bootstrap an Android-first React Native starter that launches locally on an emulator or device, renders `ExpenseTracker` with a visible starter label and greeting, allows those two visible strings to be overridden through a local pre-launch config file, validates missing setup with actionable failures, and produces a repeatable debug-installable APK artifact.

## Technical Context

**Language/Version**: JavaScript (ES2023) on Node.js 20 LTS  
**Primary Dependencies**: React Native CLI (JavaScript template), React 18, React Native, Redux Toolkit, React Redux, Jest, React Native Testing Library  
**Storage**: N/A for this slice; no user, financial, SMS, or demo state is persisted  
**Testing**: Jest component smoke test, config validation script test coverage where practical, manual Android emulator/device launch, manual debug APK install verification  
**Target Platform**: Android emulator (Android 14/API 34 baseline) and physical Android device for local demo  
**Project Type**: Mobile app, Android-first React Native starter  
**Performance Goals**: First visible screen within 5 seconds of debug launch; no network requirement at startup; debug APK produced from documented commands  
**Constraints**: Offline-capable startup, no SMS/database/budget logic, local config override before launch, clear preflight failure and recovery steps, no hard-coded secrets, minimal diff and stable starter checkpoint  
**Scale/Scope**: Single starter screen, one local config contract, one validation/preflight script, one Redux starter slice, Android debug artifact only

## Constitution Check

_GATE: Passed before Phase 0 research. Re-checked after Phase 1 design._

- [x] Offline-first scope preserved: starter flow renders fully on-device with no network or cloud dependency.
- [x] Deterministic pipeline impact is controlled: this slice does not implement SMS intake or financial flows and does not preclude the required future pipeline.
- [x] Parser strategy contract remains untouched by scope: no parsing logic is introduced in this starter slice.
- [x] Duplicate detection rules remain untouched by scope: no transaction ingestion or dedupe behavior is introduced.
- [x] Financial privacy and safety are preserved by omission: no SMS egress, no database, no personal or financial data collection, and no secrets added.
- [x] Performance validation is scoped to applicable starter budgets: first-screen render and local demo repeatability are measured now; SMS/DB/chart budgets remain for later feature slices.
- [x] Manual override is included for this slice through a local config module that controls greeting and starter label before launch.
- [x] Code quality gates are included in the scaffold plan: Prettier, ESLint Airbnb, Husky, and lint-staged are part of the bootstrap tasks.
- [x] Ambiguity handling is defined: implementation must search repository and governing docs first, then stop for human clarification if behavior remains unclear.
- [x] Change scope stays minimal and reviewable: bootstrap only the app shell, config override, validation path, Android demo path, and related docs/tests.
- [x] Existing repository patterns are reused where they exist, and constitution-defined React Native + Redux boundaries anchor the new structure where the repo is currently empty.
- [x] Root-cause fixes stay in touched areas only; unrelated product features remain explicitly out of scope.
- [x] Work is decomposed into an incremental runnable checkpoint with stable contracts for config, launch, and first-screen rendering.
- [x] Secrets strategy is respected: this slice introduces no secrets; any future secret-bearing values must use `.env` rather than code.
- [x] Branch/spec mapping is valid: active branch `001-hello-world-starter` matches `/specs/001-hello-world-starter/`.
- [x] Naming/interface conventions are planned explicitly: JavaScript `camelCase`, constants `UPPER_SNAKE_CASE`, persisted JSON `snake_case` if introduced later, object parameter signatures for JavaScript functions, and absolute imports/path aliases preferred over relative imports.
- [x] Plan is tied to a written feature spec and constitution.
- [x] Repository navigation used search/discovery rather than assumed paths.

**Post-Design Gate Result**: PASS. Phase 1 artifacts keep the feature limited to a local Android demo shell and do not introduce any constitution violations that require exception handling.

## Project Structure

### Documentation (this feature)

```text
specs/001-hello-world-starter/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── starter-experience.md
└── tasks.md
```

### Planned Source Code (repository root)

```text
android/
app.json
babel.config.js
index.js
package.json
metro.config.js

src/
├── pages/
│   └── StarterScreen.js
├── components/
│   └── StarterCard.js
├── features/
│   └── starter/
│       ├── starterSlice.js
│       └── starterSelectors.js
├── redux/
│   └── store.js
├── config/
│   ├── starterConfig.example.js
│   └── starterConfig.local.js
├── constants/
│   └── starterDisplay.js
└── utils/
    └── loadStarterConfig.js

scripts/
└── validate-starter-setup.js

__tests__/
└── starter-screen.test.js
```

**Structure Decision**: Use a single React Native mobile project at the repository root with Android generated output and a `src/` layout aligned to the constitution's `pages`, `components`, `features`, `redux`, `config`, `constants`, and `utils` boundaries. No API, database, or iOS work is introduced in this first slice.

## Phased Approach

### Phase 0: Research and Decisions

- Confirm the bootstrap path is React Native CLI with JavaScript rather than Expo or TypeScript, because the constitution names React Native (JavaScript) and the requested deliverable is a local Android demo plus debug-installable artifact.
- Define the local override contract as an ignored `starterConfig.local.js` copied from a tracked example file so maintainers can change greeting and starter label without editing app logic.
- Define preflight validation as a required wrapper step before `start`, `android`, and APK generation so missing config or Android SDK/device prerequisites fail with recovery guidance instead of opaque Gradle errors.

### Phase 1: Design and Contracts

- Capture the minimal data model for starter config, visible starter experience, and demo readiness.
- Capture the UI/config contract for what the first screen must render, what local config it consumes, and how failure messaging behaves.
- Document a quickstart path from clean checkout to local Android launch and debug APK location.

### Phase 2: Implementation Strategy

1. Bootstrap the React Native project and Android buildable baseline at repo root.
2. Add repo-quality scaffolding required by the constitution: Prettier, ESLint Airbnb, Husky, lint-staged, and absolute-import configuration where practical.
3. Add `starterConfig.example.js`, ignore `starterConfig.local.js`, and implement a validation script plus npm/yarn wrapper commands that stop early with actionable setup errors.
4. Implement a single starter screen backed by a minimal Redux slice that surfaces `ExpenseTracker`, greeting text, and a visible starter/baseline label without any network or data access.
5. Add smoke tests, quickstart/docs updates, and manual verification steps for emulator/device launch and debug APK retrieval.

## Task Generation Notes

- Keep User Story 1 focused on app bootstrap, offline starter render, and local config loading.
- Keep User Story 2 focused on repeatable Android demo commands, debug APK generation, and setup-failure recovery messaging.
- Keep User Story 3 focused on scope protection, privacy-by-omission checks, and avoiding accidental introduction of future expense-tracking logic.
- Treat iOS support, SQLite setup, SMS permissions, parsing, dedupe, budgeting, goal allocation, analytics, authentication, and release signing as follow-on features, not part of this task set.

## Complexity Tracking

No constitution violations or complexity exceptions are required for this plan.
