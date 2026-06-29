# M16 Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-15-M16-closing-report.md`
**Reviewed at:** 2026-05-15
**Disposition:** **Accepted.** Eight rows walked, evidence reproducible
independently, one row's count-criterion is acknowledged as a CDC
misprediction (M16-5); the substantive refactor at M16-5 is correct
and clean. CC's behaviour was methodology-positive throughout: the
count-vs-substantive-intent gap was surfaced explicitly rather than
papered over. Iteration count: 1 of 5.

---

## Protocol checklist (LEDGER_DISCIPLINE CDC protocol)

| Requirement | Status | Verification |
|---|---|---|
| Row count: 8 ledger rows → 8 walked | ✓ | Per-row walk in CC's report addresses M16-1 through M16-8 |
| Every `done` row: evidence reproducible independently | ✓ | Verify commands re-run from worktree — see §Per-row verification |
| No silent drops | ✓ | All 8 rows have explicit status |
| Spec-softening check | ✓ (one acknowledged caveat — see M16-5) | The count criterion is a CDC misprediction, not a softpedalled criterion |
| Partial-adoption check | ✓ | M16-5 refactor applies to the single dispatch site; per-form responsibility established uniformly |
| Substrate-rule compliance section present | ✓ | Closing report §Substrate-rule compliance addresses six rules |
| Fast-follow findings logged | ✓ | 9 formatting-class divergences from M16-2 logged with disposition path |
| "What Worked" section present | ✓ | Per LEDGER_DISCIPLINE Safety-II complement |

---

## Per-row verification (independent reproduction)

CDC ran every Verify command against the worktree state.

### M16-1 — Baseline state capture ✓

- `test -f workbench/verify/m16/baseline.txt` → exists.
- `grep -cE '^=== ' workbench/verify/m16/baseline.txt` → 10 (≥5
  required). ✓
- Captures the pre-state landmarks the ledger required.

### M16-2 — compileBoth audit + conversion ✓

- Audit doc exists with 43 dispositioned entries.
- compile-both invocations: 68 (CC claimed 68; baseline 19;
  3.6× growth). ✓ Strictly greater than baseline.
- 9 divergences surfaced and logged as fast-follow per the
  ledger's disposition policy (genuine divergences, formatting-
  class, both compilers produce valid JS).
- The divergence classes are honestly catalogued (class/object,
  generator, async, destructuring, defaults, tagged template).
  These are exactly the kind of fast-follow-able findings the
  conversion was intended to surface — methodology working as
  designed.

### M16-3 — JS return-type-check error format alignment ✓

- `grep -cE "return '?result__gensym[0-9]+' expected"
  packages/lang/surface.js` → 0 lines. ✓
- New test in `test/forms/dd-49_test.lykn` includes two
  assertions on `"return value expected boolean"` (lines 128
  and 134, confirmed via grep). ✓
- Design choice: branched inside `buildTypeCheck` keyed on
  `label === "return"`. Either that or a sibling function was
  acceptable per the ledger's anti-shortcut for M16-3. CC named
  the choice in the closing report — clean disclosure.

### M16-4 — If-profile-audit pattern ✓

- Dev doc at `docs/dev/0024-if-profile-audit-pattern-for-special-case-intercepts.md` exists. ✓
- Audit doc at `workbench/verify/m16/kernel-profile-audit.md`
  exists with 4 rows (header + 3 audited forms). ✓
- The 3 audited forms (`assign`, `class`/`class-expr`, `if`)
  cover **every** `head_name == "..."` special-case intercept
  in `emit_expr` (CDC independently grepped: matches at lines
  328, 349, 350, 372 — exactly the four CC found, with class/
  class-expr correctly grouped). ✓
- The `if` profile correctness check is sound: Statement-context
  emission uses `Positional(&[V, S, S])` (condition Value, then
  Statement, else Statement) — matches JS `IfStatement`
  semantics.

### M16-5 — Surface-form-handler Value-override refactor — *done with caveat (CDC-acknowledged misprediction)*

This is the row that needs the most careful CDC treatment.
Below: independent verification, the count-criterion question,
and the disposition.

**Independent verification of the substantive change:**

CDC read the dispatch site in
`crates/lykn-lang/src/emitter/forms.rs` (lines 340–380
post-refactor):

```rust
if crate::classifier::dispatch::is_surface_form(head_name)
    || head_name == "class"
    || head_name == "class-expr"
{
    // This subexpression is a surface form — classify and emit it.
    // Each per-form emitter sets the child context it needs ...
    match crate::classifier::classify_expr(expr) { ... }
}
```

**The blanket `ctx.expr_context = ExprContext::Value;` at the
pre-refactor dispatch site is gone.** The replacement comment
documents the new per-form responsibility model. ✓

The 4 remaining `ctx.expr_context = ExprContext::Value` sites
in `forms.rs` (lines 596, 664, 675, 2459) are all in per-form
emitters where Value context is correct for that emitter's
specific children (e.g., line 596 in `emit_bind` sets Value
for the bound value expression — that IS the correct context
for `(bind x value-expr)`'s value-expr). CDC spot-checked
line 596 and confirms. The other three are in similar
per-form positions. ✓

**The audit doc** at `workbench/verify/m16/value-override-audit.md`
exhaustively catalogues each of the 9 Cluster 2
save/restore sites with the body context each emitter
requires (all Statement) and the reason (e.g., "Arrow fn body
is a block of statements," "Function body is a block of
statements"). Each row is empirically grounded in the
emitter's JS-emission semantics. ✓

**The count criterion question.** The ledger's M16-5 Verify
included: "AND the DD-50.7 Cluster 2 save/restore pattern at
the 9 sites is reduced (verify post-refactor count is strictly
less than 9)."

Post-refactor count is 9 (unchanged). CC declared "done with
caveat" and explained: the 9 sites are no longer
workarounds-for-a-blanket-override; they are the primary
context-setting mechanism for each emitter's body. Removing
the blanket doesn't reduce the count because each emitter
can be called from a Value context (e.g., a `func` inside a
`bind` initializer) and still needs Statement for its body.

**CDC's disposition on this:** the count criterion was a
CDC misprediction at ledger-writing time. The architectural
intent of M16-5 was "remove the blanket override; establish
per-form responsibility." That intent is met. The count
heuristic was based on the implicit assumption that the
save/restore sites would be reducible if the blanket were
gone, which CC's audit shows is empirically wrong.

The methodology-positive read: CC surfaced the discrepancy
explicitly, provided the audit doc that validates the per-
emitter Statement requirement, and declared "done with
caveat" rather than papering over. This is exactly the
honest-engagement behaviour the protocol asks for.

**The methodology-lessons-learned read** (for future ledger
writing): count-based heuristics for refactor metrics ("the
post-refactor count should be strictly less than N") need an
architectural-intent check before being committed to a ledger
Verify. The intent here was structural (remove the blanket);
the count was a poor proxy. Future ledger rows for refactor
work should grep for the *architectural* change directly
(presence/absence of the blanket override), not for downstream
metric changes.

**CDC accepts M16-5 as done.** The substantive criterion is
met (blanket override removed at the dispatch site, per-form
responsibility established, audit doc empirically validates
the per-emitter Statement requirement, all DD-50.7 regression
tests still pass). The count criterion was malformed; CC's
honest disclosure is the right protocol behaviour.

### M16-6 — Import-path resolution convergence ✓

- Test file `test/forms/dd-52-import-path-convergence_test.lykn`
  exists (20 lines). ✓
- CC's diagnosis chose direction (a) — align JS to Rust's
  `find_macro_entry` auto-resolve. The rationale is sound:
  ergonomic precedent (matches `mod.lykn` convention), no
  downstream breakage (only expands what compiles), DD-52
  already documented Rust as canonical.
- **Note on `compileBoth` limitation surfaced:** CC discovered
  that `compileBoth` can't test import-macros with relative
  paths because the helper writes source to a temp file and
  Rust resolves relative to the temp dir, not the project
  root. CC worked around by using JS-only compile (which runs
  in project context) plus existing Rust-side
  `find_macro_entry` tests. This is a legitimate limitation
  worth logging as a separate compileBoth-helper fast-follow
  (the helper could be extended to write to a project-rooted
  temp dir, or to take a `--project-root` arg). **CDC notes
  this for future Track-B-style work; not blocking for M16
  closure.**

### M16-7 — Substrate-rule compliance section ✓

Six starter rules addressed in the closing report's section.
CDC independently checks:

- **CLAUDE.md safety gates:** CDC reviewed CC's commit chain
  for `--allow-dirty`, `--force`, `--no-verify` — none in any
  changed file. ✓
- **LEDGER_DISCIPLINE no-silent-rewrite:** No verify commands
  modified. M16-5's caveat is *named*, not silently rewritten.
  ✓
- **philosophy.md Principle 1:** No source-tree-structural
  changes. ✓
- **philosophy.md Principle 3 (compiler-owned output quality):**
  M16-3 (return-value error format aligned), M16-5 (blanket
  override removed), M16-6 (JS aligned to Rust) all improve
  output quality. ✓
- **Spec-softening check:** M16-5 caveat acknowledged above;
  no other criteria weakened. ✓
- **Partial-adoption check:** M16-5 dispatch-site change is
  global (single site); per-form Statement-setting applies
  uniformly to all 9 emitters that need it (per the audit).
  M16-3 fix applies to both call sites (`surface.js:1802` and
  `1852`). No partial adoption detected. ✓

### M16-8 — Single coherent commit chain ✓

- `git log --grep="M16|cross-compiler hygiene|compileBoth|return
  value expected|if-profile-audit|Value override|directory.path|find_macro_entry"
  --oneline` → 9 commits (≥6 required). ✓
- Commit chain is clean: one commit per substantive row, plus
  the conversion commit at the end.

---

## Substrate-rule compliance — independent verification

Covered above in M16-7's row walk. CDC concurs with CC's
self-assessment in all six categories.

---

## Methodology observations

### Methodology-positive behaviours

1. **CC followed the ledger order I specified** (M16-1 →
   M16-3 → M16-6 → M16-4 → M16-5 → M16-2 → M16-7/8). Small
   isolated rows first, structural refactor mid-flight,
   compileBoth conversion last. CC's "What Worked" section
   notes "No backtracking needed" — confirming the ordering
   was correct.

2. **CC ran the M16-5 preflight discipline I added to the
   implementation prompt.** The audit doc at
   `workbench/verify/m16/value-override-audit.md` is the
   evidence — each of the 9 sites' Statement requirement is
   empirically grounded *before* the refactor proceeded. This
   is exactly the "diagnosis before refactor" preflight the
   prompt asked for.

3. **CC surfaced the count-criterion mismatch honestly** rather
   than dropping the row or papering over with a creative
   reinterpretation. The closing report's caveat section names
   the prediction-vs-reality gap explicitly.

4. **The compileBoth-limitation finding (M16-6 note)** is
   a methodology bonus: CC surfaced an infrastructure
   limitation discovered during legitimate work, named it
   precisely, and proposed a fix path. This is the
   substrate-pillar discipline working as designed —
   unsolicited cross-domain contribution that future work can
   build on.

### Methodology-relevant findings for future ledger writing

1. **Count-based heuristics for refactor metrics need an
   architectural-intent check before committing to a ledger.**
   The M16-5 count criterion ("strictly less than 9") was
   chosen at ledger-writing time as a mechanical proxy for the
   architectural change (blanket override removed). The proxy
   was wrong: the 9 sites turned out to be required by the
   per-emitter semantics regardless of the blanket. Future
   refactor-row Verify commands should grep for the
   *architectural* change directly (the blanket override's
   presence/absence at the dispatch site) rather than for a
   downstream metric whose relationship to the intent is
   only assumed. Worth canonicalising in LEDGER_DISCIPLINE
   or as a CDC methodology note.

2. **CC's "done with caveat" disposition is methodology-
   correct.** The protocol asks for honest disclosure over
   confident-but-softpedalled `done` claims. M16-5's caveat
   is the textbook example: substantive intent met, mechanical
   criterion not met as written, CC explicit about which is
   which.

---

## Recommendations

1. **Accept M16 closure.** All 8 rows walked; evidence reproducible;
   substantive intents met; honest disclosure of the one caveat.
2. **Log the count-heuristic lesson** in LEDGER_DISCIPLINE or
   thread-opening doc methodology notes. Future ledger writers
   (CDC role) should check whether a count-based Verify is a
   reliable proxy for the architectural change, not just a
   plausible-sounding metric.
3. **Log the compileBoth-limitation finding** as a separate
   Track-B fast-follow (extending `compileBoth` to support
   project-rooted compilation or `--project-root` arg). Not
   blocking; useful enhancement.
4. **Accept the 9 formatting-class divergences from M16-2** as
   fast-follow findings. Resolution path is clear per the
   closing report (fix in one compiler OR extend normaliser
   with rationale, on a per-class basis).

---

## What CC does NOT need to redo

- The eight rows are substantively complete.
- The audit docs (kernel-profile-audit, value-override-audit,
  compileboth-audit) are clean and reviewable.
- The substrate-rule compliance section is thorough.
- The methodology disclosures (count caveat, compileBoth
  limitation) are precise and honest.

CDC's observations above are methodology-learnings, not
correction requests on CC's work.

---

## Open inputs for Duncan

1. **Accept M16 closure?** CDC recommendation: yes.
2. **Methodology amendment to LEDGER_DISCIPLINE:** should the
   count-heuristic lesson go in the protocol doc, or stay as
   a thread-level note? CDC lean: thread-level note for now;
   if the pattern recurs across milestones, fold into the
   protocol.
3. **compileBoth-limitation fast-follow:** roll into M17 or
   keep as a standalone fast-follow item? CDC lean: standalone
   for now (small, can land any time).
4. **Commit timing:** when you merge `cdc/compiler-coherence`
   into `release/0.6.x`, the M16 commits land. Sequencing is
   your call.
