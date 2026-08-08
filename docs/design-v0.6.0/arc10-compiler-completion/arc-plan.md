# arc10 — Compiler Completion (DD-58 strict-default + DD-37 `_kernel` removal)

> **Status: REOPENED — original 3-slice gate remains closed; slice04 draft
> added 2026-08-08.** The original arc10 capability was gated by the operator
> 2026-07-05 (host run 23:29: 5-form demo verbatim, `kernel:` resolves, suites
> reconciled; see [`closing-report.md`](./closing-report.md) §7). arc07 slice02
> later surfaced `D-2608-W2HF`: no-else `if` in expression position passes
> `lykn check`/`compile` and emits invalid JS. That follow-up belongs here, so
> arc10 is reopened with a draft `slice04` plan. The slice is not executable
> until its full open set is written.

## 1. Capability

Make surface lykn *actually* the closed, clean namespace DD-58 and DD-37 designed
— so the language becomes what `philosophy.md` and the guides already claim it is.
Two pieces:

1. **DD-58 strict-default** — strict enforcement is default-on for ordinary
   `.lykn` compilation (not just the test runner). Bare kernel-only forms in
   surface become compile errors, resolvable via the `(kernel:<form> …)` escape.
2. **DD-37 step 4** — remove the transitional `_kernel` marker (the last piece of
   DD-37's migration, surfaced at arc04's close).

Together: surface prevents bare **kernel-only declaration forms** —
`const`/`let`/`var`/`function`/`function*` (currently they leak through and emit
directly, e.g. `(var x 1)`→`var x = 1`), and the `_kernel` scaffolding is gone.
(Scope note per CC's 2026-06-30 finding: DD-58 closes *exactly* these 5 heads;
the operator/expression anti-patterns `==`/`this`/`arguments`/`require`/IIFE are
legal surface and belong to arc05's linter, not this arc.)

**Scope note (operator, 2026-06-30):** the strict-default migration is
**repo-only** for now — downstream projects (e.g. mycelium) that use bare kernel
forms will break under strict and are handled as a **separate follow-up**, not in
arc10 slice01.

**Reopened extension (operator, 2026-08-08):** compiler completion also owns the
no-invalid-JS boundary for no-else `if` in expression position. The docs already
teach the intended semantics as a compile error; the compiler/check path must
make that true.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · dd58-strict-default** | Wire `classify_form_strict` into normal `.lykn` compilation on the **Rust CLI** (`compile`/`build`/`check`). The 5 kernel-only heads (`const`/`let`/`var`/`function`/`function*`) → compile error; `kernel:` resolves; `.lyk` exempt; `--no-strict` harness-only. Guides migrated (15 `lykn,skip` fences; ID-38 operators reframed as legal passthrough). | **Closed** (`faee8a1`; Rust CLI strict; `make check` ✓, corpus 1345/0, guide docs 468/0) |
| **slice02 · js-dd58-parity** (NEW — from slice01 bubble-up) | The JS compiler (`packages/lang/`) implements **neither** strict **nor** the `kernel:` escape — so doctests/`deno test` stay lax and `(kernel:const x 42)` mis-compiles (`kernel.const(x,42)`). Add strict + `kernel:` handling to the JS compiler so DD-58 holds at the *language* level, not just the Rust CLI. Then guide kernel demos can go `skip`→`compile-fail`. | **Closed** (`feb056c`; strict default-on + `kernel:` escape in JS; A-3 partial→met; 26-site migration; guide fences flipped; `make check` ✓, `lykn test` 1354/0, deno 667/0) |
| **slice03 · dd37-step4-kernel-removal** | Remove the `_kernel` marker (expander-core; replacement sanctioned-kernel signal; behavior identical) **+ the arc-close closeout, bundled (operator, 2026-07-05):** A-6 macro-boundary enforcement on JS (Rust semantics — decided), A-7 kernel-form parity guard, A-8 `kernel:` compileBoth corpus rows. Bundled because A-6's enforcement shares the `_kernel`-replacement signal. arc10's last slice. | **Closed** (`2f6a84d`; `_kernel` → WeakSet sanctioned-kernel registry; A-6 enforced via post-pass2 sweep; guards landed; `lykn test` 1365/0, deno 673/0, `make check` ✓) |
| **slice04 · no-else-if-expression-error** | Fix `D-2608-W2HF`: no-else `if` in expression position must fail `lykn check`/`compile` before emitting invalid JS. Positive forms (`if` with else in expression position; no-else `if` in statement position; explicit `?`) must remain valid. | **Draft planned only** ([slice-doc](./slice04-no-else-if-expression-error/slice-doc.md)); full open set still needed before CC starts |

## 3. Dependencies

Consumes: arc03 (DD-58 strict-mode machinery + DD-37 classifier) and arc04 (the
surface extraction — `classifier.js` is self-contained). **Gates arc05** — the
`lykn lint` corpus depends on what the *compiler* enforces: once strict-default
lands, the kernel-form anti-patterns (10 of the guide's 12 "eliminated" leaks)
become compile errors, not lint rules, so the linter focuses on genuine
idiom/style. **Should land before arc09 (release)** — it's a language-integrity
change (and a breaking one) that 0.6.0 should ship.

**Historical sequence:** arc10 → arc05 → (arc06/arc07) → arc09. (NN is
creation order; this is the dependency order.) **Current reopened sequence
(2026-08-08):** slice04 must close before arc07/arc16 teach the no-else
expression case as settled and before arc09 cuts the release. arc07 slice03
can proceed because it is build/dist/publish docs, not the `if` semantics pass.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (strict-default) closed | ptr: slice01 closing-report | serious | arc-plan | **done** | slice01 `cdc-verification.md` (accepted 2026-06-30; commit `faee8a1`) — attested (pointer to closed child ledger) |
| A-2 | slice02 (js-dd58-parity) closed | ptr: slice02 closing-report | serious | arc-plan (re-pointed v1.2; was: "slice02 (`_kernel` removal)" — the v1.1 re-slicing moved `_kernel` removal to slice03, now row A-5) | **done** | slice02 `cdc-verification.md` (accepted 2026-07-05; commit `feb056c`) — attested (pointer to closed child ledger) |
| A-5 | slice03 (dd37-step4-kernel-removal) closed | ptr: slice03 closing-report | correctness | arc-plan (v1.2; carries the criterion A-2 held before the v1.1 re-slicing) | **done** | slice03 `cdc-verification.md` (accepted 2026-07-05; commit `2f6a84d`) — attested (pointer to closed child ledger); `_kernel` zero-grep CDC-reproduced |
| A-6 | **macro-boundary strict asymmetry dispositioned** — Rust enforces strict *post*-expansion, JS *pre*-expansion (architecturally forced); a user macro emitting a top-level bare kernel-only decl compiles on JS, errors on Rust. Needs a DD-58 refinement note (intended semantics) + decision/test | ptr: DD-58 refinement entry + slice03 closing-report (F-4) | correctness | slice02 CDC finding (bubble-up) | **done** | slice03 F-1 (divergence runtime-confirmed) + F-4 (post-pass2 sweep; 4 tests both directions; sweep design CDC-code-reviewed); DD-58 refinement entry at `0059-…md:1005` (CDC grep-reproduced) | **DECIDED (operator, 2026-07-05): Rust semantics** — macro-emitted top-level bare kernel-only decls error everywhere; macro authors use `(kernel:…)` in templates; Rust unchanged, JS enforces |
| A-7 | **kernel-form set duplication mitigated** — JS `kernel-forms.js` mirrors Rust `dispatch.rs` (reconciled at slice02, 92=92; cross-ref comments both sides); shared/generated source or a CI parity check filed | ptr: follow-up disposition (this arc or routed) | polish | slice02 bubble-up | **done** | slice03 F-5: `kernel-forms-parity.test.js` (parses both sources, symmetric-diff failure; in `make check` via deno test); seeded-mismatch demo attested | duplication now *guarded*; shared-generated source remains an optional future nicety |
| A-8 | **`kernel:` compileBoth corpus rows added** — escape convergence regression-protected cross-compiler | corpus contains `(kernel:…)` rows; `lykn test` green | polish | slice02 CDC finding | **done** | slice03 F-6: `test/forms/kernel-escape_test.lykn` (5 rows, one per kernel-only head); green attested (1365/0) | |
| A-3 | **surface prevents bare kernel-only *declaration* forms** — `const`/`let`/`var`/`function`/`function*` in a `.lykn` file are compile errors, on **both** compilers | compile each of the 5 → errors on Rust CLI **and** JS path; `kernel:` escape resolves on both | serious | anti-patterns finding | **met (attested)** | Rust CLI: slice01 (`faee8a1`); JS path: slice02 (`feb056c`) — 9 committed JS tests + convergence transcript; whitelist parity CDC-reproduced (92=92 set-diff). Class-(b) row: **reproduce at arc scale on host at arc close** per LEDGER-DISCIPLINE §B. (Was: *partial*, Rust-only.) |
| A-4 | whole tree still compiles + green after migration | `make check` green; doctests green; ~~downstream (mycelium) builds~~ *(clause deferred — see Notes)* | serious | arc-plan | **met (attested)** | per-slice greens attested at each close (final: `make check` ✓, `lykn test` 1365/0, deno 673/0, doctests 0 failed, clippy ✓). **Reproduce at arc scale on host at close.** | mycelium clause **deferred** per the operator's repo-only boundary (2026-06-30); re-entry = the downstream-migration follow-up (bare kernel forms there will break under a strict consumer) |
| A-9 | slice04 (no-else-if-expression-error) closed | ptr: slice04 closing-report + cdc-verification | serious | arc07 slice02 bubble-up / D-2608-W2HF | open | | draft slice-doc exists; full open set still needed |
| A-10 | no-else `if` in expression position fails before invalid JS is emitted | `./bin/lykn check` and `./bin/lykn compile` fail on no-else expression-position fixture; positive fixtures still pass; `make check` green | serious | D-2608-W2HF | open | | reopened composition row |

## 5. Version History

### v1.6 — 2026-08-08 (reopened for no-else `if` expression error)

arc07 slice02 found and CDC reproduced `D-2608-W2HF`: `(bind label (if (> 1 0)
"items"))` passes `lykn check`, `lykn compile` exits successfully, and the
emitted JavaScript contains `const label = throw ...`, failing only when Deno
parses it. The operator routed this compiler bug back to arc10 rather than
leaving it as an arc07 docs dependency. Added draft-only `slice04 ·
no-else-if-expression-error` and reopened the arc ledger with A-9/A-10. The
original 2026-07-05 three-slice gate remains historical truth; current arc10
does not close again until slice04 is fully opened, implemented, and
CDC-verified.

### v1.5 — 2026-07-05 (slice03 closed; arc → CLOSING, gate pending)
slice03 closed (`2f6a84d`, CDC-verified): `_kernel` → WeakSet sanctioned-kernel
registry (`kernel-mark.js`; mark-propagation wrapper; zero-grep
CDC-reproduced); A-6 enforced via a post-pass2 top-level sweep (JS now
structurally congruent with Rust's post-expansion classification;
divergence runtime-confirmed first per F-1; DD-58 refinement entry landed);
A-7 parity guard in `make check`; A-8 five `kernel:` corpus rows. **Arc-ledger:
A-5/A-6/A-7/A-8 → done.** Rows corrected during recon: CDC's "kernelArray
appears dead" disconfirmed by CC (call site `surface-helpers.js:518`; kept).
Two cosmetic defects routed for a one-line drive-by: stale `kernel-mark.js:10`
comment ("removed as dead" — it wasn't); stale `macroEnv.has('bind')`
idempotence guard (pre-existing, arc04 vintage). Arc-level
`closing-report.md` written; **composition (A-3/A-4) + gate = operator host
run** — arc closes formally on that reconciliation. Bubble-up to project
recorded there (incl. the project-ledger gap: arc10 has no P-row → P-15
proposed).

### v1.4 — 2026-07-05 (slice03 scoped; A-6 decided; closeout bundled)
slice03 open set written (`slice-doc`/`ledger`[7 rows]/`cc-prompt`), grounded
in the full `_kernel` map (4 setter roles: classifier output, `kernel:`
escape, Obj pairs, `kernelArray` [appears dead]; 4 reader guards). **Operator
decisions (2026-07-05):** (1) **A-6 → Rust semantics** — macro-emitted
top-level bare kernel-only decls are errors everywhere; macro authors write
`(kernel:…)` in templates; Rust unchanged, JS enforces on macro output;
(2) **bundle A-6/A-7/A-8 into slice03** — A-6's enforcement needs the same
sanctioned-kernel signal the `_kernel` replacement provides (splitting would
mean rearchitecting fresh work); A-7/A-8 ride as drive-bys. slice03 is
arc10's last slice; its F-1 empirically gates F-4 (the A-6 Rust-side claim
is CDC-code-read, not yet runtime-verified — CC self-stop on
disconfirmation). Surfaced by: slice02 close + operator direction that CDC
findings land before arc10 closes.

### v1.3 — 2026-07-05 (slice02 closed; A-3 met; findings routed)
slice02 (`js-dd58-parity`) closed (`feb056c`, CDC-verified): strict default-on
+ `kernel:` escape in the JS compiler (`kernel-forms.js` mirror of the Rust
dispatch tables — whitelist parity CDC-reproduced, 92=92; Rust-verbatim
diagnostics + did-you-mean); `{strict:false}` opt-out; browser loader + the
`main.rs` codegen script extension-aware; 26-site migration (helpers lax
wholesale); guide fences: 09 ID-38 → `compile-fail`, 06 `function*` →
runnable `kernel:`; 13 skips remain for non-parity reasons. **A-2 → done;
A-3 → met (attested; arc-scale host reproduction at close).** New rows from
bubble-ups: **A-6** macro-boundary strict asymmetry (CDC review finding:
Rust enforces post-expansion, JS pre-expansion — user-macro-emitted top-level
kernel decls diverge; DD-58 refinement needed, assess in slice03), **A-7**
kernel-form set duplication follow-up, **A-8** `kernel:` compileBoth corpus
rows (slice03 drive-by). Routed outward: browser-example `(= el:inner-HTML …)`
equality no-op → arc07; breaking-change items → arc09 release notes.

### v1.2 — 2026-07-05 (slice02 scoped; arc-ledger reconciled)
Wrote the slice02 (`js-dd58-parity`) open set (`slice-doc.md` / `ledger.md` /
`cc-prompt.md`), grounded in `packages/lang/` + the Rust strict reference
(`classify_form_strict`): strict default-on for the JS surface pipeline +
`kernel:` escape (both modes), migration of ~38–59 JS-path call sites,
parity-gap `lykn,skip` fence flips (15 fences grounded: 14 guides + 1 README).
**Arc-ledger reconciliation** (drift found while scoping; surfaced by CDC, not
a slice): A-1 → done (slice01 closed 2026-06-30, evidence pointer added — the
v1.1 entry recorded the close but never updated the row); A-2 re-pointed to
slice02 · js-dd58-parity (was: "slice02 (`_kernel` removal)" — stale after the
v1.1 re-slicing); added A-5 for slice03 (carries A-2's former criterion), so
each slice in the breakdown has its class-(a) row.

### v1.1 — 2026-06-30 (slice01 closed; JS-parity finding → slice02)
slice01 (`dd58-strict-default`) closed (`faee8a1`): DD-58 strict default-on for
`.lykn` on the **Rust CLI** (`compile`/`build`/`check`); the 5 kernel-only heads
error, `kernel:` resolves, `.lyk` exempt, `--no-strict` harness-only; guides
migrated (15 `lykn,skip` fences; ID-38 operators reframed as legal passthrough);
`make check` ✓, corpus 1345/0, guide docs 468/0. **Bubble-up:** the JS compiler
(`packages/lang/`) has **no strict + no `kernel:` escape** → **added slice02 ·
js-dd58-parity** (next; gates A-3), pushed `_kernel` removal to slice03. A-3 →
*partial* (Rust-only) until slice02.

### v1.0 — 2026-06-30 (created)
Created from the DD-58 strict-mode finding (anti-patterns verification, CC report
2026-06-30) + the operator decision to complete DD-58 (strict default-on). Pairs
that with the DD-37 step-4 `_kernel` removal surfaced at arc04's close. Appended
as arc10 (creation-order convention); sequences before arc05. DD-58 doc updated
to v1.1 with the decision.
