# Slice 02: js-dd58-parity — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-05
**Verdict: accepted — slice02 closed.** The JS compiler now enforces DD-58
(strict default-on + the `kernel:` escape) with behavior parity to the Rust
CLI. arc10 **A-3 goes partial → met** (attested runtime + code-reproduced;
arc-scale reproduction happens at arc close per LEDGER-DISCIPLINE §B). Two
CDC findings routed (below); no silent drops.

## Verification (git + code review + grep; runtime CC-attested)

Commit: **`feb056c` confirmed on `release/0.6.x`**
(`git merge-base --is-ancestor` ✓). Diff: 25 files, +316/−42 — shape matches
the closing report exactly (compiler: `kernel-forms.js` new + `expander.js` +
`mod.js` + browser; migration: helpers + 10 test files + 2 `.lykn` mirrors +
`main.rs` codegen script + guides 06/09 + 3 example HTMLs; `dispatch.rs`
comment-only).

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 attach point | **code-reviewed**: `enforceStrictTopLevel` pre-pass in `expand()` after pass0/pass1, before `pass2ExpandAll` — top-level-only, `_kernel`-independent, sees `bind` as `bind` (pre-desugar). Consumer table complete, incl. both CDC-ground-truthed paths (`main.rs` codegen script threads `.lyk`→lax; browser `load()` extension-aware). | reproduced (code) |
| F-2 `kernel:` escape | **code-reviewed** `expandExpr`: strip → whitelist-validate → did-you-mean (≤2) → passthrough marked `_kernel`; both modes, any depth. **Whitelist parity independently reproduced**: scripted set-diff of JS `KERNEL_FORMS` vs Rust `dispatch.rs` — 92 = 92, sets identical, no dupes (upgrades CC's "reconciled, no mismatch" from attested to reproduced). Runtime convergence attested (F-7 transcript). | **reproduced** (code + set-diff) |
| F-3 strict default-on | **code-reviewed** + 9 committed tests (`test/expander/dd58-strict.test.js`): the 5 heads throw with diagnostic text I compared **verbatim** against `forms.rs:162–169`; nested compiles; operators/surface pass; `{strict:false}` opt-out; rejects exactly the 5 + invalid `kernel:` (unknown heads stay function calls — checked the pre-pass logic). | reproduced (code) + attested (runtime) |
| F-4 migration audit | table present; count reconciliation credible and **explains the 26-vs-38/59 gap** (compileBoth sites route through the now-lax shared helper, so the helper fix covers them wholesale — consistent with CDC's own grep, which found those sites inside `.lykn` files using the helpers). | reproduced (reasoning + code) |
| F-5 migration applied | **code-reviewed** every migration hunk: helpers-lax with strong rationale comment (paired with the Rust `--no-strict` comment); per-file `{strict:false}` wrappers with reasons; `.lykn` mirrors via `(obj :strict false)` (grep-confirmed); examples — kernel HTMLs → `kernel:` escapes, and the surface example's stray `let`/`+=` correctly became `cell`/`swap!`/`express` (a genuine idiom fix). Coverage preserved: wrapper diffs are 2-line, assertions untouched, no tests deleted. | reproduced (code/grep) + attested (suites green) |
| F-6 fence flip | **reproduced by grep**: guide skips now 00:3, 01:4, 10:1, 16:4 (=12) + README 1 = **13 remaining**, exactly the closing report's "other 13"; guide-09 ID-38 is `compile-fail` (:653); guide-06 runs `(kernel:function* …)`. Audit covered all 16 (15 real + 1 doc-table row). | reproduced (grep) |
| F-7 A-3 demo | JS side backed by committed tests (not just the transcript); Rust side unchanged since slice01; cross-compiler convergence transcript CC-attested. | reproduced (code) + attested (runtime) |
| F-8 full green | CC-attested: `make check` ✓, `make test-docs` green **both example trees**, `lykn test` 1354/0 (+9), `deno test` 667/0 (+9), clippy ✓. | attested |

Rows: 8/8 walked. Done: 8. Deferred: 0. No-op: 0. **No silent drops.**
Spec-softening check: one minor note — F-2's Verify clause "compileBoth
converges on `kernel:` forms" is satisfied by the manual F-7 transcript +
equivalent string assertions in the committed JS tests, but **no `kernel:`
rows were added to the compileBoth corpus**, so cross-compiler convergence
isn't regression-protected. Small follow-up (below), not a softpedal of the
criterion's substance.

## Design sub-questions — answered, accepted

Options-bag API (`{ strict = true }` threaded `lykn → expand`); pre-pass
placement; browser strict-default with extension-aware `load()`; verbatim
diagnostics + did-you-mean ported. All match the slice-doc's stated
directions; none decided silently.

## ⚠ CDC findings (routed, not close-blocking)

1. **Strict semantics diverge at the macro boundary** (found in review;
   neither suite exercises it). Rust runs strict **post**-expansion
   (`compile.rs`: read → expand → classify-strict), JS **pre**-expansion
   (architecturally forced — the JS expander interleaves surface desugar, so
   post-expansion everything is kernel). Observable: a **user macro that
   expands to a top-level bare kernel-only decl** compiles on JS but errors
   on Rust. Latent, edge-case, but it is a semantic JS↔Rust divergence in
   the very feature this arc completes. → Needs a DD-58 refinement note
   (which semantics is *intended* at the macro boundary) + a small
   test/decision; **routed to slice03's scope assessment** (it's an
   expander-core question and slice03 lives there) — recorded in arc-plan
   v1.3.
2. **`kernel:` compileBoth corpus gap** — add a few `(kernel:…)` rows to the
   cross-compiler corpus so escape convergence is regression-protected.
   Candidate slice03 drive-by; recorded in arc-plan v1.3.

## CC findings — dispositions confirmed

Kernel-form set duplication (reconciled now; shared source = filed follow-up,
arc-plan v1.3) · release-notes breaking items (→ arc09) · browser examples'
pre-existing `(= el:inner-HTML …)` equality no-op (→ arc07 examples pass;
recorded) · `_kernel` note for slice03 (the escape *sets* `_kernel`; slice03
must provide the equivalent don't-re-expand signal) · strict|strict
compileBoth for the surface corpus (filed) · mycelium (standing, repo-only).

## Bubble-up check

- Delivered its assigned arc piece: **yes** — A-3 partial → met; DD-58 now
  holds on every compile path (Rust CLI, JS API, doctests, browser, JSR).
- Silent-drop diff: clean (scope-as-specified vs delivered matches; the one
  scope *addition* — the surface-example idiom fix — is disclosed in F-4/F-5).
- arc-plan change required: **yes** — A-2 → done, A-3 → met-attested
  (reproduce at arc close), new findings routed (v1.3, done this pass).

## Disposition

- **slice02 closed.** Operator host re-run recommended to reconcile the
  runtime rows (standing practice).
- Next: **slice03 · dd37-step4-kernel-removal** — its prompt should carry:
  the `_kernel` map from CC's bubble-up, the macro-boundary finding (#1),
  and the `kernel:` corpus drive-by (#2). Then arc10 closes (arc-level
  closing-report + composition check, A-3/A-4 reproduced at arc scale on
  host).
