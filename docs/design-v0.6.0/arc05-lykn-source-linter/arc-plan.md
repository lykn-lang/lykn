# arc05 — Lykn-Source Linter (`lykn lint`)

> **Status: ACTIVE — slice-planned 2026-07-06.** The arc became the next
> work after the arc10/11/12 gate (2026-07-05); the operator's design calls
> (Broad rule set; architecture package; DD drafted) are recorded in
> [`design/dd-59-lykn-source-linter-DRAFT.md`](./design/dd-59-lykn-source-linter-DRAFT.md)
> (odm promotion = Duncan). Originating thread: `design/kickoff-thread.md`
> (M12; its Q0 naming collision resolved by history — the JS-lint wrapper is
> gone, `lykn lint` is the reserved stub citing issue #1).

## 1. Capability

`lykn lint` lints **Lykn source** (`.lykn` files) for stylistic and semantic
patterns — anti-patterns, idiom, style — **not** compiled JS (that was Deno's
`deno lint`, now removed from the user surface per philosophy commitment #2,
Option A) and **not** mere syntax errors (`lykn check` already covers those).
The rule-set seed is `docs/guides/09-anti-patterns.md` plus the surface-forms
reference.

**Corpus division (settled by arc10, 2026-07-05):** the **compiler** owns the
closed declaration-form namespace — the 5 kernel-only heads are compile
errors on both compilers, incl. via macros (DD-58 strict + the macro-boundary
sweep) — so the linter owns **idiom/style only**: the operator/expression
anti-patterns (`==`/`===`-vs-`=`, `&&`/`||`-vs-`and`/`or`, `require`→invalid
ESM, IIFE, `or`-vs-`??`, `:sort`, `for-in`, boolean params, catch-and-log,
`cell`-when-pure, `js:`-overuse, …). `09-anti-patterns.md` needs the
"ELIMINATED" reclassification per the CC audit + slice01's ID-38 reframe.

**Seed additions from arc11/slice02 (2026-07-05, buried-intent audit):**
repo-test-suite conventions the compiler can't enforce (`test/CONVENTIONS.md`
is the spec):
- reject **relative source imports** in `.lykn` test files (require bare
  import-map specifiers) — the April-fossil failure class;
- reject **`import.meta.dirname`-anchored fixture paths** in test files
  (require `Deno.cwd()`-anchored) — the location-dependence class slice01
  fixed 5 instances of.

**Explicitly out of scope** (from the thread): `deno lint` integration;
`lykn fmt` (separate command); typechecking/inference (Rust analysis layer
already handles it); LSP server work (Phase 3+).

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · lint-infra** | The machinery, end-to-end: rule trait + hardcoded match-dispatch registry over a spanned SExpr walk (pre-expansion); diagnostics reusing the `Diagnostic` machinery (error/warn); CLI wiring **replacing the stub** (`lykn lint <paths>`, exit 0/1/2, `--format=json`); per-rule fixture harness + `insta` snapshots; **3 pilot rules** proving the shapes (no-require [error], sort-without-comparator [warn], parseint-radix [warn]); **the rule-inventory compiler-verification pass** — compile every DD-59 candidate's bad-example against the current compiler; anything that already errors is reclassified out. The resulting table is slice02's authoritative corpus. | **Open — scoped** (open set written) |
| **slice02 · shape-rule-corpus** | The remaining tier-1 shape rules from slice01's verified table (~12) + the 2 conventions rules (path-scoped to test files); per-rule fixtures (bad flagged / good silent); or-for-defaults' false-positive rate measured on the repo corpus before its severity is finalized; **dogfood pass**: `lykn lint` over the repo's own `.lykn` sources, findings fixed or acknowledged. | Open (scope after slice01's bubble-up) |
| **slice03 · context-rules + docs** | Tier-2: missing-type-annotations (shape-checkable) + shadowing (reuses `analysis/scope.rs`); **guide-09 reclassification** (every entry labeled: compiler-enforced / linted-as-`<rule>` / documented-only — the ELIMINATED cleanup the CC audit demanded); guide-15 CLI docs + SKILL note; `make lint` integration decision; P-11 demo prep. | Open (scope after slice02) |

## 3. Dependencies

Consumes: arc03's coherent surface + canonical-form discipline; **arc10's
corpus division** (the compiler owns the closed 5-form namespace everywhere,
so every lint rule is idiom/style by construction); arc11's conventions
rules + `test/CONVENTIONS.md`; the existing `analysis/scope.rs` (slice03).
Feeds **P-11**. Independent of arc06/arc07; must land before arc09.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (lint-infra) closed | ptr: slice01 cdc-verification | serious | arc-plan | open | | |
| A-2 | slice02 (shape-rule-corpus) closed | ptr: slice02 cdc-verification | serious | arc-plan | open | | |
| A-3 | slice03 (context-rules + docs) closed | ptr: slice03 cdc-verification | correctness | arc-plan | open | | |
| A-4 | **`lykn lint` flags every v1 rule's seeded anti-pattern in a fixture corpus and stays silent on clean idiomatic source** (the P-11 demo) | end-to-end run over the seeded + clean fixtures; every rule fires exactly where seeded; exit 1 dirty / 0 clean | serious | arc-plan / P-11 | open | | reproduce at arc scale on host |
| A-5 | **the linter is dogfooded** — `lykn lint` over the repo's own `.lykn` sources returns zero findings, or every finding is fixed/acknowledged with rationale | run it on `test/`, `examples/`, `packages/`; triage table | serious | arc-plan | open | | a linter the repo itself can't pass is a lie detector pointed backwards |
| A-6 | **guide-09 is aligned** — every entry carries its enforcement label (compiler-enforced / linted / documented-only); doctests green | grep the labels; `make check` | correctness | CC anti-patterns audit (2026-06-30) | open | | closes the reclassification debt that spawned arc10 |

## 5. Version History

### v1.2 — 2026-07-06 (arc ACTIVE; slice-planned; DD-59 drafted)
Operator design calls (2026-07-06): **Broad v1 rule set** (tier-1 shape
rules + missing-type-annotations + shadowing + the 2 conventions rules);
**architecture package confirmed** (Rust over pre-expansion SExpr; hardcoded
dispatch; text + `--format=json`; error/warn; read-only; exit 0/1/2; insta
snapshots); **DD-59 drafted** (`design/dd-59-lykn-source-linter-DRAFT.md`,
odm promotion = Duncan). Kickoff Q0 (naming collision) resolved by history.
Three slices planned (infra+pilots+verification-pass → shape corpus +
dogfood → context rules + guide alignment); arc ledger opened with the
dogfood row (A-5) and the guide-09 alignment row (A-6) alongside the P-11
composition demo (A-4). slice01 open set written. Surfaced by: operator
go-ahead post the arc10/11/12 gate.

### v1.1 — 2026-07-05 (corpus division settled; arc11 seed additions)
Recorded the arc10-settled corpus division (compiler owns the closed 5-form
namespace everywhere incl. the macro boundary; linter owns idiom/style) and
added two rule candidates from arc11/slice02's buried-intent audit
(relative-source-imports and `import.meta.dirname` fixture anchoring in test
files — enforcing `test/CONVENTIONS.md`). Surfaced by: arc10 close + arc11
slice02 bubble-up.

### v1.0 — 2026-06-28 (reconstructed)
Capability statement recovered from the linter kickoff thread; arc seeded, not
slice-planned.
