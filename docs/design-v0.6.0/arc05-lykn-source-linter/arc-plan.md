# arc05 — Lykn-Source Linter (`lykn lint`)

> **Status: PAUSED at 2/3 slices (operator, 2026-07-06) — blocked on
> arc13 · expander-coherence.** slice02's F-4 recon found the Rust and JS
> expanders resolve param-vs-macro shadowing **differently** (and each is
> internally inconsistent); the operator ruled it a blocker: *"pause arc05
> and fix the expander divergence… then we won't have to warn on all macro
> names — we can just do the right thing."* slice03 (+ the ID-42 lint
> question, re-answered from the fixed state per arc13 A-6) resumes when
> arc13 closes. Design: [`design/dd-59-…-DRAFT.md`](./design/dd-59-lykn-source-linter-DRAFT.md);
> kickoff: `design/kickoff-thread.md`.

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
| **slice01 · lint-infra** | The machinery, end-to-end: rule trait + hardcoded match-dispatch registry over a spanned SExpr walk (pre-expansion); diagnostics reusing the `Diagnostic` machinery (error/warn); CLI wiring **replacing the stub** (`lykn lint <paths>`, exit 0/1/2, `--format=json`); per-rule fixture harness + `insta` snapshots; **3 pilot rules** proving the shapes (no-require [error], sort-without-comparator [warn], parseint-radix [warn]); **the rule-inventory compiler-verification pass** — compile every DD-59 candidate's bad-example against the current compiler; anything that already errors is reclassified out. The resulting table is slice02's authoritative corpus. | **Closed** (`1989138`; F-1 caught: ID-39 already compiler-owned, ID-42 stale guide claim, ID-44 **compiler bug** [rc=0, unparseable JS]; smoke dogfood 117 files clean; `make check` ✓) |
| **slice02 · shape-rule-corpus** | The **12 remaining verified lint rules** (F-1 table minus pilots, shadowing→slice03, and ID-42/ID-44→compiler) + **2 recon-gated compiler fixes** (operator, 2026-07-06): ID-44 for-of binding validation → compile error (Principle 3; both compilers checked) and ID-42 reserved-param-names → compile-time disallow (recon: reserved set + blast radius on both compilers; lint-warn fallback if large); or-for-defaults' false-positive rate measured on the repo corpus before its severity is finalized; **real dogfood pass**: the full corpus over the repo's `.lykn` sources, findings fixed or acknowledged. | **Open — scoped** (open set written 2026-07-06) |
| **slice03 · context-rules + docs** (resumes post-arc13) | Tier-2: shadowing (via arc13's resolution machinery, superseding the `analysis/scope.rs` sketch); **linter resolution-awareness** (added 2026-07-06, arc13/A6 consequence: head-matching rules must consult the binding walker/env so bound-name calls — e.g. a param named `parseInt` — don't false-positive; the linter becomes a resolution *consumer* like every dispatch site); the ID-42 `reserved-param-name` question re-answered from the fixed state (arc13 A-6); **guide-09 reclassification** (every entry labeled: compiler-enforced / linted-as-`<rule>` / documented-only); guide-15 CLI docs + SKILL note; lint-suppression mechanism decision; `make lint` integration decision; P-11 demo prep. | Open — **blocked on arc13** |

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

### v1.5 — 2026-07-06 (slice03 scope grows: linter becomes a resolution consumer)
Per the arc13 DD-61 §A6 tooling accounting (operator question: which
tools must read the resolution flags): the linter's head-matching rules
would false-positive on bound-name calls post-arc13 (e.g. a param named
`parseInt`), so slice03 gains **linter resolution-awareness** — it threads
arc13's binding walker/env and skips bound heads, becoming a resolution
consumer like every dispatch site. Also folded into slice03's line:
shadowing now rides arc13's machinery (supersedes the `analysis/scope.rs`
sketch); the lint-suppression decision. `lykn fmt` = documented no-op
(formats by shape, pre-resolution — correct). Surfaced by: operator
tooling question during the arc13 architecture session.

### v1.4 — 2026-07-06 (slice02 delivered; ARC PAUSED — arc13 created)
slice02 delivered (CDC verification pending CC's commit): 12 rules landed
(15 total live); **ID-44 fixed on both backends** (the JS-first recon found
the JS compiler shared the latent bug — masked by an arg-count coincidence;
`check_loop_binding` guards all three loop forms; +3 corpus rows, 1368/0);
**ID-03 measured 0/10 FP → warn (operator-confirmed)**; dogfood 5 findings
= 3 fixed (a rule bug: `!=` is already surface — contract corrected) + 2
acknowledged; **ID-42 SELF-STOPPED as designed** — the recon exposed the
expander param-vs-macro shadowing **divergence** (Rust calls the param
where JS throws; Rust fires macros for `cell`/`express`/`get`/`not`/
`lambda`/`template`/`new` params — wrong code; JS reserved words → invalid
JS at rc=0). **Operator: blocker — arc PAUSED; arc13 · expander-coherence
created** (matrix + DD-60 → Rust → JS + conformance corpus). slice03 and
the reserved-param-name question resume post-arc13 (A-6 there). Also
surfaced: lint-suppression mechanism wanted (slice03 candidate).

### v1.3 — 2026-07-06 (slice01 closed; corpus reshaped by F-1 + operator calls)
slice01 closed (`1989138`, CDC-verified): machinery + pilots + the F-1
compiler-verification of all 19 DD-59 candidates. F-1's catches: **ID-39
already compiler-enforced** (out); **ID-42's guide rationale void** (it
compiles — but the transcript shows a param named `fn` *semantically
shadows the special form*); **ID-44 is a compiler bug** (rc=0 +
unparseable `for (const const …)` JS — Principle 3 violation). **Operator
decisions:** ID-44 → fix the compiler (guide's "Throws" becomes true; both
compilers checked); ID-42 → **compile-time disallow, recon-gated**
(reserved set + blast radius to be measured; lint-warn fallback). Slice02
re-scoped: **12 lint rules + 2 recon-gated compiler fixes + ID-03
severity-by-measurement + real dogfood.** DD-59 addendum due at arc close.
Surfaced by: slice01 close (F-1 table).

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
