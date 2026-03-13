# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Offline-first scope preserved (no cloud dependency for core SMS parsing,
  transaction storage, budgeting, and goal allocation).
- [ ] Deterministic pipeline defined end-to-end:
  SMS -> sender -> bank -> parser -> extraction -> dedupe -> storage -> updates.
- [ ] Parser strategy supports modular backends (`RegexParser` now, `MLParser` future)
  with stable `TransactionCandidate` contract.
- [ ] Duplicate detection uses defined weighted scoring and threshold with user-facing
  merge-or-keep resolution flow.
- [ ] Financial privacy and safety controls are specified:
  encrypted local DB, no SMS egress, PIN/biometric options.
- [ ] Performance validation plan exists for budgets:
  parse < 20 ms, DB query < 50 ms, chart render < 100 ms.
- [ ] Manual override UX is included for transaction edit/delete/category changes.
- [ ] Code quality gates are included (Prettier, ESLint Airbnb, Husky, lint-staged).
- [ ] Ambiguous behavior handling is defined: source-of-truth lookup or mandatory
  human clarification before code changes.
- [ ] Change scope is minimal and reviewable; no unrelated renames/format sweeps/
  architecture reshuffles are included.
- [ ] Existing project utilities, error handling, and patterns are reused where
  possible.
- [ ] Root-cause fixes are limited to the touched area; unrelated follow-up work is
  split into separate TODOs or later changes.
- [ ] Large changes are decomposed into incremental slices with module/call-path/
  contract inventory, stable API/data semantics per slice, migration checkpoints,
  and runnable intermediate states.
- [ ] Secrets strategy is defined through environment `.env` usage (no hard-coded
  secrets).
- [ ] Naming/interface conventions are explicitly planned by language/runtime,
  including snake_case/camelCase rules, UPPER_SNAKE_CASE constants, persisted JSON
  snake_case, JavaScript object parameter signatures, import strategy, and boundary
  mapping for external contracts.
- [ ] Plan references a written spec/issue/design note for non-exploratory work.
- [ ] Repository navigation relies on search/discovery, not assumed paths.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
