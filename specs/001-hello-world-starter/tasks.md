---
description: 'Implementation tasks for the Hello World Starter feature'
---

# Tasks: Hello World Starter

**Input**: Design documents from `/specs/001-hello-world-starter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/starter-experience.md, quickstart.md

**Tests**: Validation is primarily covered through documented manual launch, offline, APK, theme, and icon checks in the implementation tasks below.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup

**Purpose**: Bootstrap the Android-first React Native starter and repository quality tooling.

- [x] T001 Bootstrap the React Native project manifest and root scripts in package.json
- [x] T002 Create the React Native app entry files in index.js and app.json
- [x] T003 [P] Configure Babel and Metro for the starter app in babel.config.js and metro.config.js
- [x] T003A [P] Add the Heroicons dependency and shared theme wiring in package.json and src/theme/appTheme.js
- [x] T004 [P] Configure formatting and linting rules in .prettierrc.js and .eslintrc.js
- [x] T005 Configure Husky and lint-staged quality gates in .husky/pre-commit and package.json

---

## Phase 2: Foundational

**Purpose**: Establish shared starter contracts, config loading, and preflight behavior required by all user stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [x] T006 Create the tracked starter override example in src/config/starterConfig.example.js
- [x] T007 [P] Add local config ignore rules for starter overrides in .gitignore
- [x] T008 [P] Implement starter config loading and validation in src/utils/loadStarterConfig.js
- [x] T009 Create starter display constants in src/constants/starterDisplay.js
- [x] T009A [P] Define centralized dark purple high-contrast theme tokens in src/theme/appTheme.js
- [x] T010 [P] Implement the Redux store shell in src/redux/store.js
- [x] T011 [P] Add the starter feature state slice in src/features/starter/starterSlice.js
- [x] T012 [P] Add starter feature selectors in src/features/starter/starterSelectors.js
- [x] T013 Implement deterministic preflight validation and failure codes in scripts/validate-starter-setup.mjs
- [x] T014 Wire preflight, Android run, and APK build commands into package.json

**Checkpoint**: Foundation ready. User stories can now proceed in priority order.

---

## Phase 3: User Story 1 - Launch the First Runnable App Shell (Priority: P1) 🎯 MVP

**Goal**: Launch a local Android app shell that renders ExpenseTracker, a greeting, and a starter or baseline label without network access.

**Independent Test**: From a clean checkout with local config present, run the documented launch flow and confirm the first screen renders the required text while offline.

### Implementation for User Story 1

- [x] T015 [P] [US1] Build the starter card presentation component in src/components/StarterCard.js
- [x] T016 [US1] Implement the starter screen container in src/pages/StarterScreen.js
- [x] T017 [US1] Wire the starter screen and Redux provider into App.js and index.js
- [x] T018 [US1] Connect loaded config values to starter state and rendering in src/features/starter/starterSlice.js
- [x] T018A [US1] Apply the shared dark purple theme and Heroicons-only styling to the starter screen in src/components/StarterCard.js and src/pages/StarterScreen.js
- [x] T019 [US1] Document the offline launch, theme, and Heroicons verification steps in specs/001-hello-world-starter/quickstart.md

**Checkpoint**: User Story 1 is independently runnable and demonstrable as the MVP.

---

## Phase 4: User Story 2 - Demonstrate the Baseline to Reviewers (Priority: P2)

**Goal**: Provide a repeatable Android demo flow with clear prerequisite failures and a debug-installable APK artifact.

**Independent Test**: Follow the documented Android demo and APK steps, confirm preflight blocks missing setup with recovery guidance, and confirm the debug APK is produced at the required path.

### Implementation for User Story 2

- [x] T020 [US2] Expand preflight checks for Android SDK, device availability, and blocked-command recovery guidance in scripts/validate-starter-setup.mjs
- [x] T021 [US2] Add the Android debug APK generation command and artifact path handling in package.json
- [x] T022 [P] [US2] Document the emulator or device demo flow and APK retrieval steps in specs/001-hello-world-starter/quickstart.md
- [x] T023 [P] [US2] Align the failure and artifact contract details with implementation in specs/001-hello-world-starter/contracts/starter-experience.md
- [x] T024 [US2] Update the repository startup and demo instructions in README.md

**Checkpoint**: User Story 2 is independently demonstrable with a repeatable local Android demo and debug artifact path.

---

## Phase 5: User Story 3 - Keep the Starter Safely Scoped (Priority: P3)

**Goal**: Keep the starter minimal, reversible, and free of expense-tracking side effects while preserving a stable baseline.

**Independent Test**: Review the running starter and docs to confirm there are no SMS, database, analytics, authentication, budgeting, or goal-tracking behaviors introduced.

### Implementation for User Story 3

- [x] T025 [US3] Constrain the app shell to starter-only behavior and imports in App.js
- [x] T026 [P] [US3] Keep the starter screen free of network, SMS, database, and analytics side effects in src/pages/StarterScreen.js
- [x] T027 [P] [US3] Encode starter-only copy, theme boundaries, and Heroicons-only scope in src/constants/starterDisplay.js
- [x] T028 [US3] Document the stable starter checkpoint and out-of-scope boundaries in specs/001-hello-world-starter/quickstart.md

**Checkpoint**: All user stories remain independently valid and the starter stays safely scoped.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, validation, performance checks, and security hygiene across the implemented stories.

- [ ] T029 [P] Review tracked config and local override guidance for secret-free handling in src/config/starterConfig.example.js and .gitignore
- [ ] T030 Validate the first-screen startup budget, high-contrast dark theme behavior, and offline launch behavior in specs/001-hello-world-starter/quickstart.md
- [ ] T031 [P] Validate the end-to-end demo flow from README.md and specs/001-hello-world-starter/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no dependencies and starts immediately.
- **Phase 2: Foundational** depends on Phase 1 and blocks all user story work.
- **Phase 3: User Story 1** depends on Phase 2 and defines the MVP checkpoint.
- **Phase 4: User Story 2** depends on Phase 2 and builds on the runnable shell from User Story 1.
- **Phase 5: User Story 3** depends on Phase 2 and can proceed after the app shell shape is established.
- **Phase 6: Polish** depends on the completion of the stories being shipped.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion; no dependency on other user stories.
- **User Story 2 (P2)**: Starts after Foundational completion; depends functionally on the runnable app shell from User Story 1 for demonstration.
- **User Story 3 (P3)**: Starts after Foundational completion; should be completed after User Story 1 establishes the app shell so scope boundaries can be enforced against real code.

### Within Each User Story

- Build shared state and presentation pieces before wiring screens.
- Complete the story-specific documentation and validation steps before marking the story done.
- Keep the app runnable at every checkpoint.

### Parallel Opportunities

- **Setup**: T003, T003A, and T004 can run in parallel; T005 can follow once package.json exists.
- **Foundational**: T007, T008, T009A, T010, T011, and T012 can run in parallel after T006 establishes the config contract.
- **User Story 1**: T015 can run in parallel with T016 after foundational state and theme tokens are ready.
- **User Story 2**: T022 and T023 can run in parallel while command wiring is completed.
- **User Story 3**: T026 and T027 can run in parallel after App.js scope wiring begins.
- **Polish**: T029 and T031 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T015 [US1] Build the starter card presentation component in src/components/StarterCard.js"
Task: "T016 [US1] Implement the starter screen container in src/pages/StarterScreen.js"
Task: "T018A [US1] Apply the shared dark purple theme and Heroicons-only styling to the starter screen in src/components/StarterCard.js and src/pages/StarterScreen.js"
```

## Parallel Example: User Story 2

```bash
Task: "T022 [US2] Document the emulator or device demo flow and APK retrieval steps in specs/001-hello-world-starter/quickstart.md"
Task: "T023 [US2] Align the failure and artifact contract details with implementation in specs/001-hello-world-starter/contracts/starter-experience.md"
```

## Parallel Example: User Story 3

```bash
Task: "T026 [US3] Keep the starter screen free of network, SMS, database, and analytics side effects in src/pages/StarterScreen.js"
Task: "T027 [US3] Encode starter-only copy and scope boundaries in src/constants/starterDisplay.js"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate the local Android launch while offline, with the shared theme and Heroicons-only presentation applied.
5. Stop for review before expanding to demo artifact and scope-hardening work.

### Incremental Delivery

1. Ship the runnable starter shell in User Story 1.
2. Add repeatable demo and APK generation support in User Story 2.
3. Lock down scope and stable checkpoint behavior in User Story 3.
4. Finish with cross-cutting validation and documentation.

### Parallel Team Strategy

1. One developer can finish Setup and Foundational work.
2. After the foundation is ready, one developer can own User Story 1 while another prepares User Story 2 documentation and contract alignment tasks.
3. User Story 3 can follow once the app shell exists, with polish tasks handled in parallel near the end.

---

## Notes

- [P] tasks touch different files and have no dependency on unfinished tasks in the same phase.
- Each user story remains independently testable using the documented manual checks.
- The MVP scope is User Story 1 only.
