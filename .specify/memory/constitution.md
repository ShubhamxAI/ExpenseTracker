<!--
Sync Impact Report
- Version change: 1.1.0 -> 1.5.0
- Modified principles:
	- V. Security, Performance, and Code Quality Gates -> V. Security, Performance, and Code Quality Gates
	- VI. Deterministic Change Scope and Minimal Diffs -> VI. Deterministic Change Scope and Minimal Diffs
	- VII. Incremental Execution and Contract Stability -> VII. Incremental Execution and Contract Stability
	- Governance -> Governance
- Added sections:
	- None
- Expanded sections:
	- Product and Architecture Constraints
	- Delivery Workflow and Milestones
	- Governance
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ pending (directory not present in repo): .specify/templates/commands/*.md
	- ✅ README.md (reviewed; no change required)
- Follow-up TODOs:
	- None
-->

# ExpenseTracker Constitution

## Core Principles

### I. Offline-First Determinism (NON-NEGOTIABLE)
All core transaction flows MUST run fully on-device with no cloud dependency,
including SMS intake, parsing, deduplication, categorization, budget tracking, and
goal allocation. Given the same SMS input and local state, the system MUST produce
the same transaction output and derived totals.

Rationale: Financial tracking requires predictable behavior and private local control.

### II. Modular SMS Parsing and Extensibility
SMS parsing MUST use a strategy interface that supports pluggable implementations
(`RegexParser` now, `MLParser` later) without breaking downstream consumers.
Bank-specific parsing MUST be configuration-driven via sender rules and regex
patterns, and parser output MUST conform to a stable `TransactionCandidate`
contract: amount, timestamp, bank, merchant, account, type, raw_message.

Rationale: Modular boundaries preserve maintainability and enable future AI parsing.

### III. Financial Data Integrity and Duplicate Safety
Transaction storage MUST prioritize correctness over convenience. Duplicate handling
MUST implement the defined weighted scoring model (amount +50, account +20,
merchant similarity +15, time window +15; duplicate threshold >= 80) with a
5-minute tolerance window. Any duplicate candidate decision MUST be reviewable by
the user through an explicit merge-or-keep action.

Rationale: Monetary records are high-impact and require conservative, auditable rules.

### IV. User Trust, Transparency, and Manual Override
Every automated decision (parsing result, duplicate flag, category assignment,
budget alert, savings allocation) MUST remain transparent and manually editable.
Users MUST be able to delete transactions, mark duplicates, and edit categories.
Merchant normalization (for example UPI IDs to canonical merchant names) MUST be
reversible and never hide raw SMS evidence.

Rationale: User trust depends on control, clarity, and correction-friendly UX.

### V. Security, Performance, and Code Quality Gates
SMS data MUST never leave the device. The local database MUST be encrypted, and the
application MUST support PIN lock and biometric unlock as user-configurable options.
Performance budgets are mandatory: SMS parse < 20 ms, database queries < 50 ms, and
chart render < 100 ms under normal workload targets. Engineering standards MUST
enforce Prettier (`semi: true`, `singleQuote: true`, `tabWidth: 2`,
`trailingComma: all`), ESLint with Airbnb style, and Husky + lint-staged pre-commit
checks.

Rationale: Privacy and responsiveness are essential to daily financial workflows.

### VI. Deterministic Change Scope and Minimal Diffs
When behavior is unclear, agents MUST either locate source-of-truth behavior in the
repository or stop and ask a human for clarification before changing code;
almost-correct behavior is unsafe. Agents MUST keep changes small, reviewable, and
directly tied to requested scope. Agents MUST avoid unrelated renames, formatting
sweeps, or architectural reshuffles. Agents MUST reuse existing utilities, error
handling, and project patterns where possible. Agents SHOULD fix only the root cause
within the touched area. Agents MAY propose follow-up TODOs but MUST NOT bundle
unrelated work in the same change set.

Rationale: Small diffs reduce risk and make workflow validation easier.

### VII. Incremental Execution and Contract Stability
Large changes MUST be executed incrementally, module-by-module and feature-slice by
feature-slice. Agents MUST begin with an inventory of modules, call paths, and
contracts. Agents MUST keep API and data semantics stable during each slice and keep
the repository runnable at every step. Agents SHOULD leave explicit migration
checkpoints for review and rollback.

Rationale: Incremental delivery lowers blast radius and preserves integration safety.

## Product and Architecture Constraints

- Product mission: build an offline-first personal expense tracker that extracts bank
	SMS transactions, deduplicates intelligently, tracks budgets, and allocates
	savings to goals.
- Mandatory processing pipeline:
	incoming SMS -> sender detection -> bank identification -> parsing -> extraction ->
	duplicate detection -> database insertion -> budget and goal updates.
- Supported transaction classes: debit, credit, UPI, ATM withdrawal, card payment,
	and netbanking transfer. Non-transactional SMS (OTP, marketing, non-movement
	alerts) MUST be excluded.
- Required local data model includes users, accounts, transactions,
	fixed_deductions, budgets, and goals in SQLite.
- Savings allocation rule is fixed: savings = income - fixed_deductions - expenses;
	allocate 50% to car goal and 50% to gold goal.
- Budget policy is fixed monthly budget with alerts at 80%, 100%, and post-100% on
	every additional transaction.
- Mobile architecture baseline is React Native (JavaScript) with Redux and Clean
	Architecture boundaries:
	`pages`, `components`, `features`, `services`, `database`, `redux`, `utils`,
	`config`, and `constants`.
- Dashboard analytics MUST include summary panel, expense distribution,
	monthly trend, weekly spend, and goal progress visualizations.
- Transaction UI MUST support card-style tabular display, swipe-left delete,
	swipe-right duplicate mark, tap-to-edit category, and bulk actions.
- Secrets MUST be provided via environment `.env` file and MUST NOT be hard-coded.
- Naming and interface conventions are mandatory:
	- Python variable names MUST use `snake_case`.
	- Node.js variable names MUST use `camelCase`.
	- DataFrame columns and database naming (tables, columns, keys, persisted schema
		fields) MUST use `snake_case`.
	- Constants and enum members MUST use `UPPER_SNAKE_CASE`.
	- JSON message keys MUST follow runtime language convention:
		Node.js payload keys `camelCase`, Python payload keys `snake_case`.
	- JSON keys saved to `.json` or `.jsonl` files MUST use `snake_case`.
	- JavaScript functions MUST use an object parameter signature with a default empty
		object (for example `function fn({ a, b } = {})`).
	- Relative imports SHOULD be avoided; absolute imports or configured path aliases
		SHOULD be preferred.
- Boundary exception rule:
	- When external contracts require specific naming/keys, agents MUST preserve the
		external contract at integration boundaries and map internally to repository
		naming conventions.
- Repo navigation rule:
	- Agents MUST NOT assume file locations and MUST use repository search.

## Delivery Workflow and Milestones

- Phase 1 (Core engine): SMS reader, regex parser, and transaction storage.
- Phase 2 (Expense tracking): dashboard, categories, and transaction editing.
- Phase 3 (Budget system): budget alerts and monthly reporting.
- Phase 4 (Financial planning): savings allocation and car/gold goal tracking.
- Edge cases requiring explicit implementation coverage: duplicate SMS, delayed SMS,
	same-amount multi-transactions, merchant variations, multiple bank formats,
	UPI ID merchants, and card transactions.
- Each phase MUST define measurable acceptance checks tied to this constitution,
	including functional correctness, privacy constraints, and performance budgets.
- Agents are allowed to implement scoped feature changes, add or adjust tests/docs
	needed to ship safely, and fix bugs in the touched area when they are direct root
	causes.
- Agents are NOT allowed to perform broad refactors or cross-cutting rewrites
	without a migration spec.
- Agents are NOT allowed to implement feature/refactor work without a written spec
	(spec file, issue, or approved design note) unless a human explicitly requests
	exploratory work.

## Governance

This constitution is the highest-priority engineering and product policy for this
repository. All plans, specifications, tasks, and implementation pull requests MUST
include a constitution compliance check.

This constitution supersedes local conventions when they conflict.

Amendment procedure:
- Propose changes in `.specify/memory/constitution.md` with explicit rationale.
- Record template and documentation sync impacts in the Sync Impact Report.
- Any change to this document MUST be reviewed by a human maintainer.
- Amendment pull requests MUST include the reason for change, compatibility impact,
  and any required follow-up migrations.

Versioning policy (semantic versioning):
- MAJOR: incompatible principle removals/redefinitions or governance model changes.
- MINOR: new principle/section or materially expanded mandatory guidance.
- PATCH: wording clarifications, typo fixes, and non-semantic refinements.

Compliance review expectations:
- `/speckit.plan` outputs MUST pass constitution gates before Phase 0 and after
	Phase 1 design.
- `/speckit.specify` outputs MUST include offline/privacy, manual override,
	edge-case, and measurable-performance requirements.
- `/speckit.tasks` outputs MUST include tasks for security controls, performance
	validation, and duplicate-handling integrity where applicable.
- Every pull request review MUST explicitly check Security and Secrets rules.
- If a change touches deployment/environment configuration, sensitive genomic data
  handling, or patient/clinical workflows, escalation to a human reviewer is
  mandatory.

Escalation triggers (agents MUST stop and ask a human):
- Any uncertainty about clinical meaning, units, interpretation, or data retention.
- Any need to change serverless/IAM/stage/environment/deployment behavior.
- Any request that might expose PHI/PII or other protected genomic/health-linked
  data.

**Version**: 1.5.0 | **Ratified**: 2026-03-12 | **Last Amended**: 2026-03-13
