# DD-59 — The Lykn-Source Linter (`lykn lint`) — DRAFT

> **Status: DRAFT — for odm promotion (Duncan).** Drafted by CDC 2026-07-06
> from the M12 kickoff thread's Q0–Q6, resolved with the operator's design
> calls (2026-07-06) and two months of intervening history. Lives in
> `arc05/design/` until promoted into `docs/design/`.

## Context and history

The linter is lykn's oldest public promise (`lykn lint` stub cites GitHub
issue #1) and philosophy commitment #2 (Option A: lint **Lykn source**, not
compiled JS). Since the M12 kickoff (2026-05-10), the landscape moved:

- **The naming collision resolved itself.** The kickoff's Q0 (existing
  `lykn lint` wrapped `deno lint` over compiled JS) is gone — that wrapper
  was removed from the user surface (philosophy #2 Option A; the arc04-era
  cleanup); `cmd_lint` today is a stub reserving the name for source
  linting. **`lykn lint` = source linting. No flag bifurcation needed.**
- **arc10 sharpened the corpus division.** The compiler now owns the closed
  declaration-form namespace (the 5 kernel-only heads are compile errors on
  both compilers, including via macros). The linter owns **idiom and
  style** — things that compile fine but shouldn't be written.
- **arc11 seeded two conventions rules** (test-source location
  independence) that the compiler can't enforce.

## Decisions (operator, 2026-07-06)

| Q | Decision |
|---|----------|
| Q0 naming | `lykn lint` = source linting (resolved by history; the JS pass no longer exists as a user surface) |
| Q1 where | **Rust**, over the **reader SExpr, pre-expansion** (spans available; matches `lykn check`'s pipeline position). Rationale: lint judges what the user *wrote*, not what it expands to; the JS compiler needs no parity (lint is a dev-side CLI concern, not a language-semantics concern — no dual-backend obligation) |
| Q2 rules | **Hardcoded match-dispatch registry** (v1); config-driven enable/disable deferred until demand |
| Q3 output | **Text (check-style) + `--format=json`** for tooling |
| Q4 severity | **error / warn** (two levels; info reserved, unused in v1) |
| Q5 fixes | **Read-only** (no `--fix` in v1; rules that auto-fix cleanly noted for a fast-follow) |
| Q6 rule set | **Broad v1**: tier-1 shape rules + two easy tier-2 (missing-type-annotations; shadowing via the existing `analysis/scope.rs`) + the 2 arc11 conventions rules |
| exit codes | `0` clean · `1` findings (CI-gateable) · `2` usage/IO errors |
| testing | per-rule fixtures (bad → flagged, good → silent) + `insta` snapshots on text and JSON output (never auto-accepted) |

## Rule inventory (v1 target — subject to slice01's compiler-verification pass)

**Tier 1 — shape rules** (pure SExpr pattern matches; the guide's ID in
parens): no-require (33, **error** — compiles to invalid ESM), no-eval (31,
error), sort-without-comparator (17, warn), parseint-radix (5, warn),
no-new-wrappers (6, warn), global-isnan (4, warn), no-arguments (30, warn),
no-iife (32, warn), no-delete-on-array (34, warn), no-json-deep-copy (35,
warn), prefer-surface-operators (38 — `===`/`&&`/`||`/`==` when `=`/`and`/
`or` exist, warn), or-for-defaults (3, warn — shape `(or x <literal>)`;
false-positive rate to be measured on the repo corpus before final
severity), for-in-on-arrays (29, warn), fn-as-param-name (42, warn),
const-wrapped-for-of-binding (44, warn).

**Tier 2 — context rules**: missing-type-annotations (39 — `func`/`genfunc`
params without `:type` keywords; shape-checkable, warn),
shadowing (12 — reuses `analysis/scope.rs`, warn).

**Conventions rules** (path-scoped to test files): no-relative-source-imports
(arc11 — require bare import-map specifiers, error),
no-dirname-fixtures (arc11 — require `Deno.cwd()`-anchored fixture paths,
error).

**Verification gate (arc10 lesson #4, applied proactively):** before
implementation, each candidate's bad-example is compiled against the
current compiler — anything that already errors (or can't parse) is
reclassified out of the lint corpus. The slice01 table is authoritative;
this DD's list is the target.

## Non-goals (v1)

`deno lint` integration; `lykn fmt`; typechecking (the analysis layer owns
it); flow analysis (cell-when-pure, sequential-await — tracked candidates);
`--fix`; LSP; rule configuration files.

## Future (recorded, not committed)

Config-driven rule selection (Q2-C); `--fix` for the mechanical rules;
promotion of tier-2 flow rules as the analysis layer grows; doctest/guide
integration (lint the guide examples in CI).

## Addendum — ID-42 disposition (2026-07-21, arc05 slice03; closes arc13 A-6)

The ID-42 question — *should the linter warn on reserved-word or form-named
parameters?* — is re-answered from arc13's fixed state. **Disposition: no lint
rule.**

- **Reserved words at binding positions are already D2 compile errors**
  (`binding::validate_reserved_names`, both backends; the ID-44 genus is dead at
  the root). A lint warning would be redundant with — and weaker than — a
  compile error.
- **Form-named parameters legally shadow (DD-60 D1).** A param named
  `array`/`cell`/`parseInt` genuinely shadows the form/global on both backends;
  the compiler emits a call to the binding. Warning would contradict the
  semantics arc13 was run to establish.

This is the operator steer — *"do the right thing instead of warning broadly"* —
vindicated by the fixed compiler; the slice03 dogfood surfaced no case where the
linter's silence on a param name is harmful. The **shadowing rule (ID-12)**
covers the one genuinely-confusing param-name case that remains — shadowing an
*enclosing binding* (not a form) — which is orthogonal to the reserved/form
question. Landed in slice03 (`ea429e2`); closes arc13 A-6.

