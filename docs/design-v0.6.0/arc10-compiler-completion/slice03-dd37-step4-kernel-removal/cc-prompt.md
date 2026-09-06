# CC Prompt — arc10 / slice03 · dd37-step4-kernel-removal (+ boundary closeout)

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-05
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** arc10's **last slice**: remove the transitional `_kernel` marker
(DD-37 step 4) with a principled sanctioned-kernel signal, enforce **DD-58 at
the macro boundary on JS** (A-6 — operator decided **Rust semantics**,
2026-07-05), and land the two regression guards (A-7 parity test, A-8
`kernel:` corpus rows). Bundled deliberately: A-6's enforcement needs the
same signal the `_kernel` replacement provides.

## 0. Read first

- `…/slice03-dd37-step4-kernel-removal/ledger.md` (7 rows) and `slice-doc.md`
  (the grounded `_kernel` map is there — setters, readers, and the A-6
  mechanics).
- Your slice02 closing report's `_kernel` note (the escape *sets* `_kernel`;
  your removal must provide the equivalent don't-re-expand signal).
- DD-58 (`docs/design/05-active/0059-…`) — you'll add the A-6 refinement
  entry (F-4); Duncan reconciles odm versioning after.
- Rust reference: `compile.rs` (read → expand → **classify-strict** — strict
  runs post-expansion) and `classify_form_strict` (`forms.rs:117`).

## 1. The work (MUST), in order

1. **F-1 — recon first; it gates F-4.** CDC's A-6 finding is **code-read,
   not runtime-verified**. Empirically confirm on your host:
   (a) Rust: a fixture user macro expanding to a top-level bare
   `(const x 1)` errors under `lykn compile` strict;
   (b) JS: the same input compiles today.
   Then map what the remaining `macroEnv` surface macros
   (`registerSurfaceMacros`, `surface.js`) emit at **top level** — if any
   legitimately emit bare kernel-only decls, naive post-expansion enforcement
   would false-positive on real surface code, and your signal design must
   sanction their output. Write the trace + macro-output table.
   **If (a) disconfirms, STOP and surface** — the contract adapts before any
   code is written (your self-stops have caught two CDC errors; this row
   exists because the finding is mine and unverified at runtime).
2. **F-2 — remove `_kernel`.** All four setter roles (slice-doc map):
   classifier-emitted kernel (`expander.js:762,764`), the `kernel:` escape
   (`:750`), Obj pairs (`classifier.js:297`), and `kernelArray`
   (`surface-helpers.js:52` — appears **dead**: definition + export, no call
   sites; confirm and remove if so). Replacement mechanism is your call
   (wrapper node / WeakSet / split-walk) — constraints: it must encode
   *sanctioned kernel* for classifier output, escape output, Obj pairs, and
   (per F-1's map) surface-macro output, while leaving **user-macro output
   checkable** for F-4. Document the design + rationale in the closing
   report. `grep -rn "_kernel" packages/` must end at **0**.
3. **F-3 — behavior identical.** Corpus/suite/doctests green with unchanged
   semantics. **Do NOT extend the compileBoth normalizer** (forbidden-
   extension policy — a new divergence is a bug to fix, not to hide). This
   is the invariant that made arc04 safe; same bar.
4. **F-4 — enforce A-6 on JS (Rust semantics).** Unsanctioned macro-emitted
   **top-level** bare kernel-only decls → throw the **Rust-verbatim**
   kernel-only diagnostic (reuse `kernelOnlyMessage`). `(kernel:…)` in macro
   templates compiles (the sanctioned authoring path — both compilers since
   slice02). Nested macro-emitted kernel stays legal (top-level-only,
   matching Rust). Rust side: **unchanged** — it is the reference. TDD both
   directions. Add the DD-58 refinement entry recording the decision
   (operator, 2026-07-05) + the semantics.
5. **F-5 — A-7 parity guard.** An automated test that parses **both**
   kernel-form sources (Rust `dispatch.rs`: `KERNEL_FORMS` +
   `is_kernel_only_form`; JS `kernel-forms.js`: `KERNEL_FORMS` +
   `KERNEL_ONLY_FORMS`) and fails on any set difference. Demonstrate with a
   seeded mismatch, then run on the real sets. Home it where `make check`
   runs it by default; say where in the closing report.
6. **F-6 — A-8 corpus rows.** Add `(kernel:…)` rows to the compileBoth
   corpus (at least the 5 kernel-only heads) so escape convergence is
   regression-protected — your slice02 F-7 transcript, made permanent.

## 2. Verify (rebuild-first, all green)

`make check` green; `make test-docs` 0 failed; `lykn test` 0 failed (≥1354 +
the F-6 rows); `deno test --config project.json -A test/` 0 failed (≥667);
`clippy -D warnings` exit 0 (F-7). Rebuild first; trust nothing stale.

## 3. Discipline

- **F-1 before F-4, always.** Recon, self-stop on disconfirmation.
- **Scope watch:** this is expander-core. If the `_kernel` rework explodes
  (scope, not iteration count), stop and surface for a re-slice — don't
  grind. The five-iteration cap applies as usual.
- **Surface, don't decide silently:** the replacement-signal mechanism, the
  enforcement point (macro-loop check vs post-pass2 sweep), `kernelArray`
  disposal, and the A-7 guard's home are your calls — but each gets a
  written rationale in the closing report.
- **Breaking-change note** (arc09): macro authors emitting bare kernel-only
  decls at top level now error on JS too (they already did on Rust) — the
  fix is `(kernel:…)` in the template.
- No Rust compiler/classifier changes; anomalies are surfaced, not fixed.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report. Source only.

## 4. Close

`closing-report.md`: per-row walk (7 rows, no silent drops) + the F-1
trace/macro-table + the replacement-signal design note + design-call
rationales + a **bubble-up to arc10** that explicitly answers: **is arc10
ready to close?** (A-5 done, A-6/A-7/A-8 dispositioned, anything the
expander rework revealed) — because the next step after your close is the
arc closing-report + the **host composition run** (A-3/A-4 reproduced at arc
scale). → hand back for CDC `cdc-verification.md`.
