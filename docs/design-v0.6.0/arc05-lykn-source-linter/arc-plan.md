# arc05 — Lykn-Source Linter (`lykn lint`)

> **Status: RESUMED (arc13 gate GO 2026-07-09) — slice03 scoped 2026-07-21
> as a 1→2 split (see v1.6).** 15 rules live at 2/3. slice03 is now the
> **resolution-consumer + context-rules** half (resolution-awareness,
> shadowing, the ID-42 re-answer, dogfood); the productionization + docs +
> arc-close half is **slice04**. Design:
> [`design/dd-59-…-DRAFT.md`](./design/dd-59-lykn-source-linter-DRAFT.md);
> kickoff: `design/kickoff-thread.md`.
>
> _Was (through 2026-07-09): **PAUSED at 2/3, blocked on arc13** — slice02's
> F-4 recon found the Rust and JS expanders resolved param-vs-macro
> shadowing **differently**; the operator ruled it a blocker (*"pause arc05
> and fix the expander divergence… then we won't have to warn on all macro
> names — we can just do the right thing."*). arc13 closed that divergence;
> the resume is this slice03._

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
| **slice03 · resolution-consumer + context rules** (resumes post-arc13) | **Linter resolution-awareness** (arc13/§A6 consequence: resolve the pre-expansion forms + route the shared head accessor through `as_form_head()` so bound-name calls — a param named `parseInt` — don't false-positive; the linter becomes a resolution *consumer* like every dispatch site); the **shadowing rule** (ID-12, via arc13's resolution machinery, superseding the `analysis/scope.rs` sketch — reuse the resolver's scope model, no parallel decider); the **ID-42 re-answer** from the fixed state closing **arc13 A-6** (disposition: no rule — reserved words are D2 compile errors, form-named params legally shadow via D1); the **dogfood** re-run (A-5). | **Open — scoped** (open set written 2026-07-21) |
| **slice04 · suppression + integration + guide alignment + arc close** | The **lint-suppression mechanism** (comment/directive-based; depends on the reader preserving comments — sized here, not in slice03); `make lint` / `make check` **wiring** of `lykn lint`; **guide-09 reclassification** (every entry labeled compiler-enforced / linted-as-`<rule>` / documented-only — closes A-6); guide-15 CLI docs + SKILL note; the **P-11 demo** (A-4) → **arc close**. | Open — planned (deferred from the slice03 1→2 split, v1.6) |

## 3. Dependencies

Consumes: arc03's coherent surface + canonical-form discipline; **arc10's
corpus division** (the compiler owns the closed 5-form namespace everywhere,
so every lint rule is idiom/style by construction); arc11's conventions
rules + `test/CONVENTIONS.md`; **arc13's Resolve-Once machinery** (DD-61:
`resolver::resolve`, `SExpr::as_form_head`, `crate::binding::bindings_introduced`
— slice03's resolution-awareness + shadowing consume it, superseding the
never-built `analysis/scope.rs` sketch). Feeds **P-11**. Independent of
arc06/arc07; must land before arc09.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (lint-infra) closed | ptr: slice01 cdc-verification | serious | arc-plan | open | | |
| A-2 | slice02 (shape-rule-corpus) closed | ptr: slice02 cdc-verification | serious | arc-plan | open | | |
| A-3 | slice03 (resolution-consumer + context rules) closed | ptr: slice03 cdc-verification | correctness | arc-plan | open | | narrowed by the v1.6 split |
| A-4 | **`lykn lint` flags every v1 rule's seeded anti-pattern in a fixture corpus and stays silent on clean idiomatic source** (the P-11 demo) | end-to-end run over the seeded + clean fixtures; every rule fires exactly where seeded; exit 1 dirty / 0 clean | serious | arc-plan / P-11 | open | | reproduce at arc scale on host; **delivered in slice04** |
| A-5 | **the linter is dogfooded** — `lykn lint` over the repo's own `.lykn` sources returns zero findings, or every finding is fixed/acknowledged with rationale | run it on `test/`, `examples/`, `packages/`; triage table | serious | arc-plan | open | | a linter the repo itself can't pass is a lie detector pointed backwards; **slice03** (resolution-aware finding set) |
| A-6 | **guide-09 is aligned** — every entry carries its enforcement label (compiler-enforced / linted / documented-only); doctests green | grep the labels; `make check` | correctness | CC anti-patterns audit (2026-06-30) | open | | closes the reclassification debt that spawned arc10; **slice04** |
| A-7 | slice04 (suppression + integration + guide alignment + arc close) closed | ptr: slice04 cdc-verification | correctness | arc-plan (v1.6 split) | open | | the productionization/docs/demo half |

## 5. Version History

### v1.6 — 2026-07-21 (arc05 RESUMED; slice03 scoped as a 1→2 split)
Resuming after the arc13 gate GO (2026-07-09; nothing landed on
`release/0.6.x` since — tip `ff0e72e`). Scoping slice03 against the actual
code (grounding pass, CDC) surfaced two things: **(1) the resolution-consumer
work is small** — `resolver::resolve` is `pub` and structural (already called
in `compile.rs`), and `as_form_head()` returns `None` for bound heads, so
routing the linter's single shared `atom_call` helper through it gates every
head-matching rule at once; **(2) the v1.4/v1.5 "slice03" bundled ~8
workstreams** across code + an open-ended suppression feature + a ~26-label
guide pass + the arc-close demo — too large for one context with iteration
headroom (PROJECT-MANAGEMENT.md sizing). **Split 1→2:** slice03 = the
code-correctness half (resolution-awareness, shadowing, the ID-42 re-answer,
dogfood); **slice04** (new) = suppression + `make lint` wiring + guide-09/15
+ SKILL + the P-11 demo + arc close. Arc ledger gains **A-7** (slice04
closed); A-4/A-6 re-homed to slice04, A-5 to slice03 (Notes). **ID-42
re-answer (operator steer confirmed):** no lint rule — reserved words are D2
compile errors, form-named params legally shadow via D1; this closes **arc13
A-6** (its Verify was this scoping note). slice03 open set written. Sequence
unchanged: arc05 → arc06 → arc07 → arc09. Which-child-surfaced: the slice03
scoping/grounding session (CDC, 2026-07-21).

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
