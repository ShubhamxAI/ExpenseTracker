# Data Model: Hello World Starter

## Entity: StarterConfiguration

- Purpose: Local pre-launch values that drive the visible starter greeting and baseline label.
- Source: `src/config/starterConfig.js`, created from a tracked example file.
- Fields:
  - `greetingMessage`: string, required, non-empty, visible on first screen.
  - `baselineLabel`: string, required, non-empty, visible on first screen.
- Validation rules:
  - Both values must be present and trimmed.
  - Values must remain safe for UI display; no markup or network-derived content.
  - Keys must use `camelCase`.
- State transitions:
  - `example` -> `local override created`
  - `local override created` -> `validated`
  - `validated` -> `rendered in app`

## Entity: StarterExperience

- Purpose: The first visible product state shown after app launch.
- Fields:
  - `productName`: constant string, fixed to `ExpenseTracker`.
  - `greetingMessage`: string, loaded from `StarterConfiguration`.
  - `baselineLabel`: string, loaded from `StarterConfiguration`.
  - `heroIconName`: string, required, references an approved Heroicons glyph.
  - `isOfflineCapable`: boolean, always `true` for this slice.
  - `buildVariant`: enum-like string, expected value `debug` for this feature.
- Validation rules:
  - `productName` must remain unchanged in this slice.
  - `greetingMessage` and `baselineLabel` must both be visible on smaller Android screens without scrolling assumptions where practical.
  - `heroIconName` must come from Heroicons only.
  - Rendering must not depend on network requests or persisted local data.
- Relationships:
  - Depends on one `StarterConfiguration`.
  - Depends on one `StarterTheme`.

## Entity: StarterTheme

- Purpose: Shared visual tokens that give the first screen a dark purple high-contrast appearance with a sophisticated old-money tone.
- Source: `src/theme/appTheme.js`.
- Fields:
  - `backgroundColor`: string, required.
  - `surfaceColor`: string, required.
  - `primaryTextColor`: string, required.
  - `accentColor`: string, required.
  - `mutedAccentColor`: string, required.
  - `iconSet`: constant string, fixed to `Heroicons`.
- Validation rules:
  - Text and surface combinations must remain visually high contrast.
  - Purple tones must be applied through the shared theme rather than screen-local overrides.
  - `iconSet` must remain `Heroicons` for this slice.
- State transitions:
  - `defined` -> `applied to starter screen`
  - `applied to starter screen` -> `validated in demo`

## Entity: DemoReadiness

- Purpose: Represents whether a maintainer can complete the documented local demo flow.
- Fields:
  - `hasNodeTooling`: boolean.
  - `hasAndroidSdk`: boolean.
  - `hasLocalConfig`: boolean.
  - `hasTargetDevice`: boolean, emulator or physical device.
  - `canBuildDebugArtifact`: boolean.
- Validation rules:
  - All prerequisite booleans except `canBuildDebugArtifact` must be true before attempting Android launch.
  - Validation failures must emit recovery steps.
- State transitions:
  - `unchecked` -> `preflight passed`
  - `unchecked` -> `preflight failed with recovery guidance`
  - `preflight passed` -> `demo running`
  - `demo running` -> `debug artifact produced`

## Entity: SetupFailure

- Purpose: Standardized preflight failure surfaced to maintainers when required setup is missing.
- Fields:
  - `code`: string identifier such as `MISSING_LOCAL_CONFIG` or `MISSING_ANDROID_SDK`.
  - `message`: short human-readable failure summary.
  - `recoverySteps`: ordered string list.
  - `blockingCommand`: string identifying the attempted command.
- Validation rules:
  - Every failure must include at least one recovery step.
  - Failures must be deterministic and emitted before opaque native build errors when possible.
- Relationships:
  - Produced by validation of `DemoReadiness`.

## Non-Entities by Design

- No transaction, SMS, account, budget, goal, database, analytics, or authentication entities are introduced in this feature.
- No persisted JSON or SQLite schema is introduced in this slice.
