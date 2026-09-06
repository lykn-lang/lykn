# Slice 11: conformance-corpus + dispositions — Ledger

Arc13's last slice: the permanent cross-backend corpus + a recorded
disposition for every explained residual. The arc close (closing-report,
arc-scale A-4/A-5, operator gate) follows this slice — it is not in it.
Per LEDGER-DISCIPLINE. Rebuild-first (`./bin/lykn build` before any
probe — staleness trap #4). 7 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **The standing corpus in `make check`** — ≥1 cross-backend test per name-class × binding-position × reference-position equivalence class (no class uncovered; coverage mapping published); vehicle chosen on timing evidence (compile-both rows / snapshot subset); `make check` cost delta reported | the coverage mapping + suite run + cost figures | serious | arc capability statement ("pins it permanently") | **done** | `test/expander/conformance-corpus.test.js` (9 tests, coverage map in header); vehicle = matrix classification method (compileBoth too strict for if-let/match desugaring — formatting divergence); cost **≈1.0 s** vs matrix 14.3 s; `make check` ✓ | the matrix stays the on-demand audit tool |
| F-2 | **Corpus has teeth** — seeded-divergence demo: one backend's resolution temporarily broken → corpus red → restored green | demo transcript | serious | the A-7/coverage/A6-check precedent (4th instantiation) | **done** | `f2-teeth-transcript.txt` (this dir): JS break (`formHead` ignores ref tag) → 2 red; Rust break (pass1 scan removed) → macro row red; both restored → green, sources byte-identical | a corpus that can't fail is theatre |
| F-3 | **The `macro` name row converges** — bound legal-ident `macro` = `calls-binding` on Rust (the gap JS is ahead of); cells agree; corpus row pins it | probe before/after; matrix delta exactly this class | serious | slice10 bubble-up (A-4 baseline class b) | **done** | `pass1.rs` (binding-aware partition) + `pass2.rs` (definition-shape guard); matrix **56→53**, Rust calls-binding +3, no other cell moved; bind/destructuring/import all byte-identical to JS | small fix, contained — mirrors pass2's existing light scan |
| F-4 | **Label asymmetry + `kernel:if` dispositioned** — label accidental-shadow asymmetry: fix-or-document with rationale (document → DD-60 refinement note via CDC); `kernel:if` strict cells: documented (unbindable class, DD-60 edge 4) | probe evidence + the recorded disposition | correctness | slice10 bubble-up (classes a, c) | **done** | **DOCUMENTED** both. Label (38 cells): pre-existing shape-mismatch asymmetry (DD-60 §Context), not a D1 violation — labels don't shadow (‡), both mean the form; probe `(label fn …)` Rust falls-through / JS throws. kernel:if (15): DD-60 edge 4 unbindable. Corpus pins both; **CDC: DD-60 refinement note** | labels do not shadow (‡) — settled; this is the reference-side shape-mismatch asymmetry |
| F-5 | **`contains_await` dispositioned** — probe (bound `await` param, non-async body); then either the `as_form_head()` change + test, or a documented `A6-exempt` rationale | the probe + decision record | correctness | slice08 bubble-up (routed here) | **done** | **FIXED.** Canonical case already correct; probing await-gated wrappers surfaced a matrix-invisible Rust misfire (bound `await` head → wrongly async-wrapped, `await(987)` reinterpreted as operator; JS correct). One-line `as_form_head()` change in `emitter/forms.rs` (`contains_await` + `step_contains_await`) + `test_contains_await_honours_resolution`; genuine await still async-wraps | decided with the probe in hand |
| F-6 | **D2-timing residual dispositioned** — the constructed-from-macro-arg reserved-binder gap: documented as the permanent asymmetry (+ a pinning probe if cheap) | the record (+ probe) | polish | slice10 bubble-up (routed here) | **done** | **DOCUMENTED.** Probe: `(mk if)` from `` `(bind ,n 0) `` → Rust rejects cleanly, JS hits unrelated error; literal-in-template → both reject. **Neither leaks rc=0** — diagnostic-quality difference only. Unify = out of scope. Pinned by probe | unifying pass placement is OUT unless trivially cheap |
| F-7 | **Green bar + final snapshot** — `make check` ✓ (incl. the new corpus); the end-state matrix snapshot published: final divergence count, every residual documented-as-intended — **the A-4 evidence input for the arc close** | suite runs + the snapshot in the closing report | serious | standing bar; arc A-4 | **done** | `make check` ✓ (docs 475/0, all suites green). **Final: 1947 cells · 53 divergent** = 38 form-named-label + 15 kernel:if, all documented-as-intended; snapshot + breakdown in the closing report | the A-4 evidence input |

## What Worked / Closure

**7/7 rows done. Source-only increment; closing report is the arc-close
handoff / A-4 input.** Two fixes (F-3 `macro` row on Rust; F-5 `contains_await`
resolution-honouring), three documented dispositions (F-4 ×2, F-6). Divergence
**56→53**, every residual documented-as-intended, corpus with demonstrated
teeth standing in `make check`.

- **The probe caught what the matrix couldn't.** F-5's `contains_await` misfire
  is invisible to the matrix (it probes bound-name × ref-position, not
  bound-name-inside-an-async-gated-wrapper). Grounding the disposition in an
  actual probe — not deciding in the abstract — is what surfaced a real Rust
  correctness bug and a Rust/JS divergence. Carry into the arc close: the
  matrix/corpus bound the *dispatch* surface, not the emitter's structural
  `.value` heuristics.
- **F-3 was small, as predicted — once grounded.** The fix looked like it might
  need pass-ordering surgery; grounding it (`has_macros` scan → pass1
  `is_macro_def` → pass2 guard) showed it was three small, contained edits
  reusing the existing `hoisted_names` light scan. The import cell exposed a
  second, distinct wrinkle (pass2 walking the import binder list) closed by the
  definition-shape guard.
- **Vehicle choice mattered.** `compileBoth` (byte-identical) is the wrong gate
  for region-bearing forms — their benign desugaring-shape divergence would make
  the corpus permanently red or force normalizer extensions that hide real
  differences. The matrix's classification method is resolution-focused and
  formatting-robust.
- **Which-child-surfaced:** slice10 (F-3, F-4, F-6 baselines) + slice08 (F-5).
