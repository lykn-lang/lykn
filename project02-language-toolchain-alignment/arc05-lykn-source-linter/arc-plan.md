# arc05 — Lykn-Source Linter (`lykn lint`)

> **Status: CLOSED — gate GO 2026-07-21 (operator; `make check` green, P-11 demo
> 16/16 seeded → exit 1, clean → exit 0). All 4 slices CDC-closed; A-1…A-7 compose.**
> `lykn lint` ships: 16 rules, resolution-aware, in `make check` green; guide-09
> reclassified (accurate labels); the P-11 corpus proves the set. slice04
> delivered `2feb5fd`; inline suppression deferred → arc14 (DD-62). Design:
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
| **slice03 · resolution-consumer + context rules** (resumes post-arc13) | **Linter resolution-awareness** (arc13/§A6 consequence: resolve the pre-expansion forms + route the shared head accessor through `as_form_head()` so bound-name calls — a param named `parseInt` — don't false-positive; the linter becomes a resolution *consumer* like every dispatch site); the **shadowing rule** (ID-12, via arc13's resolution machinery, superseding the `analysis/scope.rs` sketch — reuse the resolver's scope model, no parallel decider); the **ID-42 re-answer** from the fixed state closing **arc13 A-6** (disposition: no rule — reserved words are D2 compile errors, form-named params legally shadow via D1); the **dogfood** re-run (A-5). | **Closed** 2026-07-21 (`ea429e2`; CDC-verified) |
| **slice04 · integration + guide alignment** (arc05's last slice) | `make lint` / `make check` **wiring** of `lykn lint` (the 2 kernel-interop dogfood findings **path-scoped** green, not suppressed); **guide-09 reclassification** (every entry labeled compiler-enforced / linted-as-`<rule>` / documented-only — closes A-6); guide-15 CLI docs + SKILL note; the **P-11 demo** (A-4). **Suppression deferred → arc14 · comment-retention** (DD-62 — reader comment-retention doesn't exist yet). arc05 close = CDC close-set after slice04. | **Closed** 2026-07-21 (`2feb5fd`; CDC-verified) |

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

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.9 — 2026-07-21 (slice04 CLOSED; arc05 CLOSING — composition verified)
CC delivered slice04 at `2feb5fd` (source+docs); CDC-verified (F-1/F-2/F-3/F-5/
F-6/F-7 reproduced-by-code+grep; F-4/F-8 attested). `lykn lint` is in `make
check` green (path-scoped, one `find` exclusion — not suppression); guide-09
reclassified accurately (all 12 formerly-ELIMINATED corrected, **ID-42's body
fixed** too, not just relabelled); guide-15 ID-04c rewritten (was stale — the
old `deno lint` wrapper) + SKILL; the P-11 seeded/clean corpus (`p11_lint_corpus`)
proves 16 rules fire/silent. **Arc ledger A-4/A-6/A-7 → done; A-1…A-7 all
done — the 4 slices compose.** `closing-report.md` written (slice walk 4/4,
composition check, project bubble-up). **Formal close = operator host reconcile**
(§5: `make check` + the 2 P-11 demo commands). Findings routed: guide-15
stale-tool drift → arc07; the `_test.lykn` predicate coupling → hardening
backlog; orphaned `LintContext` API → cleanup; suppression → arc14. Which-child:
slice04 close.

### v1.8 — 2026-07-21 (slice04 SCOPED; suppression deferred to arc14)
Scoping slice04 hit the reader-comment-retention question flagged at slice03
close: **the suppression mechanism depends on the reader retaining comments,
which no backend does** (both readers drop line/block/datum comments; `SExpr`
has no trivia node). Same shape as arc05→arc13 — so the operator's comment-
handling directive (reader retention → surface→kernel provenance → strip-or-
preserve at JS emit) becomes its own arc: **arc14 · comment-retention** (DD-62
drafted). **Suppression is deferred there** (its natural first consumer); the 2
kernel-interop dogfood findings are handled in slice04 by **path-scoping**
`lykn lint`, not inline suppression, so `make lint` goes green without arc14.
slice04 (arc05's last slice) = `make lint` wiring + guide-09 reclassification
(A-6) + guide-15 + SKILL + the P-11 demo (A-4); the arc05 close is CDC's
close-set after. 0.6.0's DoD doesn't require inline suppression, so arc05/0.6.0
close cleanly. Open set written. Which-child: slice04 scoping.

### v1.7 — 2026-07-21 (slice03 CLOSED, CDC-verified; findings routed to slice04)
CC delivered slice03 at `ea429e2` (source-only). CDC-verified by code-review +
grep (sandbox has no toolchain): F-1…F-6 **reproduced-by-code**, F-8/F-9
CC-attested (host `make check` + dogfood reconcile). The linter is a resolution
consumer — `lint_source` runs `resolver::resolve` then routes the shared
`atom_call` head through `as_form_head()`; the ID-12 shadowing rule fires only
at precomputed `resolver::shadowing_sites` spans. **F-6 held rigorously**: grep
confirms zero scope logic in `lint/` — one decider (`scope_plan`/`hoisted_names`),
many consumers (resolve-tagging, expand-gating, now shadow-detection), pinned by
`resolve_shadow_parity`. **Arc ledger: A-1/A-2/A-3 → done (slices closed);
A-5 → done (dogfood clean, 2 benign fixtures triaged).** Bubble-up findings
routed here → **slice04**: (a) the `LintContext` ancestry API
(`ancestors`/`source`/`parent()`) is now orphaned — the shadowing rule consumed
the resolver's scope model instead, so slice04 decides delete-or-keep; (b) the
`prefer-surface-operators` fixture noise concretely motivates the suppression
mechanism; (c) route (a) (tag-consumption) was insufficient — a `BindingDef` tag
doesn't encode "shadows an enclosing binding," so `shadowing_sites` is a new
`lykn-lang` export (grounded arc-plan correction). Standing note (staleness trap
#4, 4th costume): a bare `cargo test` hits the stale-`bin/lykn` guard on
`lyk_runner_kernel_only` — `cargo build --release && cp target/release/lykn
bin/lykn` first; `make check` rebuilds so it's green. Which-child: slice03 close.

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
