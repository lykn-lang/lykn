# Slice 03: dd37-step4-kernel-removal — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-05
**Verdict: accepted — slice03 closed; arc10 ready for its closing-report +
host composition run.** The `_kernel` marker is retired for a principled
sanctioned-kernel registry; DD-58 is enforced at the macro boundary on JS
(A-6, Rust semantics, per the operator decision); both regression guards
landed. Two cosmetic defects found in review (below) — neither blocks.

## Verification (git + code review + grep; runtime CC-attested)

Commit: **`2f6a84d` confirmed on `release/0.6.x`** (`merge-base
--is-ancestor` ✓). Diff: 10 files, +280/−38 — JS + tests + the DD-58 doc
refinement only; **no `crates/` changes** (Rust-is-the-reference held).

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 recon | Runtime confirmation CC-attested (Rust exit-1 / JS-compiles transcript). Surface-macro map **reproduced by code**: `registerSurfaceMacros` (`surface.js:363–441`) registers exactly the 5 `js:*` macros, none emitting kernel-only decls — the map is right, no false-positive risk. F-1 ran before F-4 as gated. | reproduced (code) + attested (runtime) |
| F-2 `_kernel` removed | **Reproduced by grep**: zero marker uses in `packages/` (only Rust-symbol names in comments). **Code-reviewed** `kernel-mark.js` (WeakSet registry, non-mutating, ESM-singleton) + all four producer migrations + all four `isKernel` guards + the mark-propagation wrapper (`expandExpr` → marking wrapper + `expandExprInner`; input-sanctioned ⇒ output re-marked, element-wise for arrays). Design is sound: user-macro output stays unmarked and therefore checkable — exactly the constraint the slice-doc set. `kernelArray` correction verified: alive at `surface-helpers.js:60`, called at `:518` (`compileLetPattern`), re-homed onto `markKernel`. | **reproduced** (grep + code) |
| F-3 behavior identical | `helpers.js` untouched this slice (normalizer diff = none — reproduced by git). Suite deltas reconcile: deno 667→673 (+4 A-6 +2 A-7), lykn 1354→1365 (+5 A-8 rows + migrated fixtures). The one intended change (two macro fixtures → `kernel:` templates) is disclosed, not silent. Runtime numbers attested. | reproduced (git) + attested |
| F-4 A-6 enforced | **Code-reviewed** the post-`pass2ExpandAll` sweep: rejects kernel-only head ∧ ¬`isKernel`, top-level-only — the JS analogue of Rust's post-expansion classify-strict, unifying user-written + macro-emitted bare decls in one check (slice02's pre-pass correctly superseded, its doc-comment rewritten to match). Walked the `bind` path: classifier wins before the macro loop, emission is marked, propagation holds ⇒ sanctioned output passes (and a committed test pins it). **DD-58 refinement entry reproduced by grep** (`0059-…md:1005` — decision, semantics, date). 4 committed tests both directions. | reproduced (code/grep) + attested (runtime) |
| F-5 A-7 guard | Test file present (`kernel-forms-parity.test.js`, parses `dispatch.rs` + `kernel-forms.js`, symmetric-diff failure); homed in `deno test` ⇒ runs in `make check`. Seeded-mismatch demonstration attested (`onlyJs: ["bogusform"]`). | reproduced (code) + attested (demo) |
| F-6 A-8 rows | `test/forms/kernel-escape_test.lykn` present — 5 `compileBoth` rows, one per kernel-only head; green run attested (compileBoth throws on divergence, so green = convergent). | reproduced (code) + attested |
| F-7 full green | CC-attested rebuild-first: `make check` ✓, `lykn test` 1365/0, deno 673/0, `make test-docs` 0 failed, clippy ✓, `deno lint` clean. | attested |

Rows: 7/7 walked. Done: 7. Deferred: 0. No-op: 0. **No silent drops.**
Design-call rationales all surfaced (registry vs wrapper/split-walk;
post-pass sweep vs in-loop; kernelArray kept; guard home).

## CDC corrections & defects (routed)

1. **CDC's own recon error, owned:** the slice-doc's "`kernelArray` appears
   dead" was wrong — my grep counted 2 occurrences in `surface-helpers.js`
   and I inferred "definition + export" without reading the second hit,
   which was the real call site. CC caught it against ground truth and kept
   the function. (Same lesson as issues-log #4, pointed the other way:
   *CDC claims also need grounding to the artifact, not the count.*)
2. **Defect (cosmetic, this slice): `kernel-mark.js:10`** header comment says
   kernelArray was "removed as dead in this slice" — stale text contradicting
   the code (`surface-helpers.js:60/:518`) and the closing report's own
   correction. One-line comment fix; producer #4 is alive.
3. **Defect (cosmetic, pre-existing since arc04): `expander.js`'s
   `macroEnv.has('bind')` idempotence guard** is stale — `bind` left
   `macroEnv` in the arc04 extraction (only the 5 `js:*` macros register
   now), so the guard always fails and `registerSurfaceMacros` re-runs per
   `expand()` call (harmless: idempotent sets). Should key on a `js:*` name.

Disposition for 2–3: one-line fixes; ride the next source commit (operator's
staging pass or an arc-close drive-by). Recorded in arc-plan v1.5.

## Bubble-up check

- Delivered its assigned piece: **yes** — A-5 done, A-6/A-7/A-8 all
  dispositioned with evidence; nothing from the expander rework blocks the
  arc close (CC's readiness claim verified against the arc ledger).
- Silent-drop diff: clean; the two fixture migrations and the superseded
  pre-pass are disclosed.
- arc-plan change required: **yes** — A-5/A-6/A-7/A-8 → done; the two
  cosmetic defects recorded (v1.5); arc proceeds to close.

## Disposition

- **slice03 closed.** Runtime rows attested; operator host re-run
  reconciles as part of the **arc composition run** (next step).
- **Next: the arc10 close** — CDC assembles `closing-report.md` (slice walk,
  composition check, bubble-up to project); the composition rows (A-3, A-4)
  must be **reproduced at arc scale on the host** and the gate reviewed by
  an independent party (the operator) — CDC assembled the arc, so CDC
  cannot sign it off alone (LEDGER-DISCIPLINE §B).
