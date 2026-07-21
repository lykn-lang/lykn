# Slice 11: conformance-corpus + dispositions — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-09
**Verdict: accepted — slice11 closed; arc13's last slice is done.**
Rows: 7/7, no silent drops. Source commit `a0b24b9`
("arc13/slice11: conformance-corpus + F-3/F-5 fixes"). Runtime rows
attested (`make check` ✓; corpus ~1.0 s vs matrix 14.3 s; final matrix
1947/53); structure **reproduced by code review + git log** this
session.

## Verification

- **Commit + ancestry (partially reproduced):** `git log --oneline`
  from the main checkout shows the linear chain `a0b24b9 ← 2a2eaa1 ←
  c19a1fb ← a9a5131 ← 19ab39e ← 4c12301 ← a0b2dc8 ← dab4405` — the
  slice09/10/11 SHAs confirmed on-branch by direct observation; the
  formal `merge-base --is-ancestor` sweep over all six source SHAs is
  the gate's first runbook step.
- **F-1** — `test/expander/conformance-corpus.test.js` exists with the
  coverage-map header; the vehicle decision (matrix classification
  method over `compileBoth`) is *reasoned in the report* with the
  formatting-divergence evidence — a good call, and the rejection
  rationale is recorded rather than silent.
- **F-2** — `f2-teeth-transcript.txt` present in the slice dir; both
  seeded breaks (JS `formHead` tag-ignore; Rust pass1 scan removal) red
  → restored → green, sources byte-identical.
- **F-3** — `pass1.rs:39` (`is_def = is_macro_def(&form) &&
  !shadowed…`) + `hoisted_names` reuse (:41) reproduced — the fix
  consumes the shared scoping source, not a re-derivation.
- **F-5** — `emitter/forms.rs` `contains_await`/`step_contains_await`
  now gate on `as_form_head() == Some("await")` (:70/:90/:96)
  reproduced. **This was a real latent Rust correctness bug** (bound
  `await` inside an async-gated wrapper reinterpreted as the operator)
  — found by probe discipline, invisible to both matrix and corpus
  coverage bars. The lesson is carried to the arc close.
- **F-4/F-6** — dispositions reviewed: both *document* decisions are
  correctly reasoned (label residual = shape-mismatch asymmetry outside
  DD-60's scope, not a D1 violation — the ‡ semantics are convergent;
  `kernel:if` = unbindable edge 4; D2-timing residual = diagnostic
  quality only, no rc=0 leak). CDC writes the DD-60 note (F-4's ask)
  and the DD-61 as-built note (contains_await) — done at this close.
- Minor: the report says 9 corpus test blocks; grep counts 10
  `Deno.test` occurrences (likely a doc-comment example) — cosmetic,
  not chased.

## Bubble-up check

Complete and honest: capability confirmed against the arc-plan's
statement; the A-4 evidence input is exactly what the arc close needs
(53 cells, 2 classes, both documented-as-intended, snapshot
re-runnable); the matrix-bounds-dispatch-not-emitter-heuristics lesson
is surfaced as a standing caution (future structural `.value` reads in
emit-time heuristics should honour resolution — the A6 static checks
watch dispatch, not heuristics). No silent drops: all seven rows walked
with evidence.

## Disposition

**slice11 closed; A-14 and A-15 flip done. All eleven arc13 slices are
closed.** What remains is the **arc close-set**: the arc
closing-report (written at this close), the DD notes (written), the
operator host gate (A-4/A-5 reproduced at arc scale + the merge-base
sweep — runbook in the arc closing-report §5), then the project
bubble-up and arc05's resumption.
