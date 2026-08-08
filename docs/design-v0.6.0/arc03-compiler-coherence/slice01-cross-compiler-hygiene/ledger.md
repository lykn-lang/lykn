# Milestone M16: Cross-Compiler Hygiene

> **Status:** open
> **Iteration budget:** 5 (expect 2–3; most rows are bounded mechanical work, row M16-6 is the largest structural change)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (session that drafted this ledger)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** [philosophy.md](../../docs/philosophy.md), [thread-opening doc](../2026-05-10-compiler-coherence-thread-opening.md)
> **Thread origin:** [`workbench/kickoff-thread-compiler-architecture-coherence.md`](../kickoff-thread-compiler-architecture-coherence.md)
> **Predecessors:** M7 closed 2026-05-10 (`f9b647a`); DD-50.6/DD-50.7/DD-52/M10/M11/M13/DD-53/DD-54/DD-55 ICU all landed (`4ee1eaa`); DD-37 promoted to `05-active/` with amendments uncommitted on `cdc/compiler-coherence`.
> **Sibling work (parallel):** DD-58 (separation DD) drafting in main CDC context.

---

## Why this milestone exists

This milestone collects five Track-B-classed items from the compiler-
architecture-coherence thread — items whose value is **independent of
DD-58's syntax decision** but which compound the same architectural
debt the separation work will durably resolve. Doing them now (a)
sharpens the substrate against which DD-58 lands, (b) closes user-
visible bug surfaces (Finding #4 error-format leak, DD-50.7 #1/#2
emitter cleanups, DD-52 #3 import-path divergence) that would otherwise
ship into 0.6.0 unfixed, and (c) broadens `compileBoth`'s coverage so
the post-separation regression net is wider than DD-50.7's localised
patch.

The five items in scope:

1. **Broader compileBoth conversion** — extend cross-compiler
   verification beyond the 11 tests currently using `(compile-both ...)`
   to cover every test in `test/forms/*_test.lykn` that asserts on
   emitted JS structure. Surface latent divergences as findings
   (handoff §"Net effect on Track A/B/C").
2. **JS/Rust error-format alignment (Finding #4)** — JS return-type
   check leaks gensym name (`"return 'result__gensym0' expected boolean"`);
   Rust uses generic `"return value"` label. JS converges on Rust's shape.
3. **DD-50.7 #1 — if-profile-audit pattern** — canonicalise the
   discipline that DD-50.7 closing review #1 named: every kernel form
   with a special-case intercept (the `if` line-375 case is canonical)
   MUST have its profile audited for the non-intercepted context paths.
4. **DD-50.7 #2 — Surface-form-handler Value override refactor** —
   remove the blanket `ctx.expr_context = ExprContext::Value` override
   at `emitter/forms.rs:~356` for nested surface-form dispatch. The
   nine emitters currently using save/restore workarounds (per DD-50.7
   Cluster 2 fix) become unnecessary once each emitter sets its own
   child context.
5. **DD-52 #3 — Directory-path vs explicit `.lykn` import convergence**
   — Rust expander resolves `"./packages/testing"` → adds `/mod.lykn`
   automatically (`find_macro_entry`); JS expander requires the
   explicit file path. Compilers should agree.

---

## What this milestone produces

1. **Baseline state capture** at `workbench/verify/m16/baseline.txt`
   recording pre-state: `compile-both` test count, file-line landmarks
   referenced by later rows, test-pass count.
2. **`compileBoth` audit + conversion** at `workbench/verify/m16/
   compileboth-audit.md` enumerating every `(compile ...)` call in
   `test/forms/*_test.lykn` with its disposition (`converted`,
   `skipped-runtime-test`, `skipped-with-rationale`). Conversions
   landed in test files; surfaced divergences dispositioned (fixed,
   logged as fast-follow with rationale, or normalised in
   `compileBoth`'s normaliser with explicit note).
3. **JS return-type-check format fix** in `packages/lang/surface.js`:
   the `buildTypeCheck` call sites for return checks (`surface.js:1802`
   and `1852` per Finding #4 analysis) no longer leak the gensym name.
   Output format matches Rust's `emit_return_type_check`:
   `"<funcName>: return value expected <type>, got <typeof>"`.
4. **If-profile-audit pattern** documented at
   `docs/dev/0017-if-profile-audit-pattern-for-special-case-intercepts.md`
   (next available dev-doc number; verify before writing) and applied:
   audit doc at `workbench/verify/m16/kernel-profile-audit.md`
   enumerating every kernel form with a special-case context intercept
   (currently: `if` at line ~375; verify if any others exist) and the
   profile-correctness check for each context path.
5. **Surface-form-handler Value-override refactor** in
   `crates/lykn-lang/src/emitter/forms.rs`: the blanket
   `ctx.expr_context = ExprContext::Value` at the surface-form-
   intercept site (~line 356) is removed; each per-form emitter sets
   the child context appropriate to that form. The nine save/restore
   workarounds DD-50.7 introduced (Cluster 2) are removed where the
   refactor makes them redundant; rationale preserved where any are
   kept.
6. **Import-path resolution convergence**: both compilers handle
   `"./packages/testing"` identically (either both auto-resolve to
   `/mod.lykn`, OR both require the explicit path — design call CDC
   makes in the diagnosis phase before the implementation row starts;
   default proposal: align JS to Rust's `find_macro_entry` behaviour
   since that's the more ergonomic pattern and matches existing
   downstream consumer use).
7. **Closing report substrate-rule compliance section** addressing the
   six starter rules per LEDGER_DISCIPLINE.
8. **Single coherent commit chain** naming M16 and the substantive
   change classes.

This milestone does **not**:

- Touch DD-58's separation work. Track A proceeds independently in
  main CDC context.
- Re-promote DD-37 (already in `05-active/` per `4ee1eaa`; amendments
  on `cdc/compiler-coherence` land via separate commit).
- Touch the cdc/dep-ergonomics CDC's W-1/W-2/W-3 work (held pending
  DD-58 per the handoff).
- Address the 8 remaining Class A1/A2 doctest failures from the
  cdc/dep-ergonomics Phase 1a triage — those are fixed by DD-58's
  separation, not by patching the current overlap.
- Introduce DD-50.7's `emit_if_iife` fix (logged as DD-50.7 fast-follow
  #3, awaits Duncan's A/B/C call separately).

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md) — protocol (mandatory)
2. [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md) — thread state, Resolutions section, fast-follow handoff
3. [`workbench/handoff-surface-kernel-separation-2026-05-14.md`](../handoff-surface-kernel-separation-2026-05-14.md) — cdc/dep-ergonomics handoff for context on Tracks A/B/C
4. [`workbench/old/dd-50.7-closing-cdc-review-2026-05-12.md`](../old/dd-50.7-closing-cdc-review-2026-05-12.md) — Findings #1 and #2 (rows M16-4, M16-5)
5. [`workbench/old/2026-05-12-DD-52-closing-report.md`](../old/2026-05-12-DD-52-closing-report.md) — Findings for fast-follow #3 (row M16-6)
6. [`workbench/2026-05-05-DD-49-iteration-2-closing-report.md`](../2026-05-05-DD-49-iteration-2-closing-report.md) — Finding #4 (row M16-3 origin)
7. [`docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`](../../docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md) — DD-50 + DD-50.5 context-profile background
8. [`packages/testing/helpers.js`](../../packages/testing/helpers.js) — `compileBoth` helper (row M16-2 reference)

---

## Design dispositions (carried forward from CDC scope analysis)

**On M16-2 (compileBoth conversion scope).** The conversion targets
**tests whose substantive claim is about emitted JS structure**, not
runtime behaviour. Per-test disposition is required: every `(compile ...)`
call in `test/forms/*_test.lykn` is either converted or
skip-rationaled in the audit doc. Skip rationale must be specific
(e.g., "asserts on runtime behaviour, not emitted JS — both compilers
hit the same Deno runtime, so cross-compiler check is vacuous here").

**On M16-2 normaliser policy.** `compileBoth` currently normalises
whitespace, strips trailing semicolons, and strips Rust warnings.
Additions are permitted *only* with explicit rationale in the helper's
docstring AND a comment naming what's being hidden. The default
posture is "if normalisation hides a real divergence, fix the
divergence; don't extend the normaliser."

**On M16-5 (Value-override refactor).** The refactor MUST preserve
DD-50.7's behavioural guarantees: every emitter whose body emits as a
statement sequence (`emit_fn_expr`, `emit_func_single`,
`emit_func_multi`, `emit_genfunc_single`, `emit_genfn_expr`,
`emit_match_statement`, `emit_match_iife`, `emit_when_let_statement`,
`emit_when_let_iife`) MUST receive Statement context for body
children after the refactor. The acceptance criterion is not "lines
removed" but "DD-50.7's regression tests still pass and no new
context-leak bug is introduced."

**On M16-6 (import-path convergence direction).** Two possible
directions: (a) align JS to Rust's auto-resolve behaviour; (b) align
Rust to JS's require-explicit-path behaviour. Default proposal is (a):
auto-resolve is ergonomic, matches existing downstream consumer use
(@lykn/testing imported via directory path), and the Rust behaviour
is already documented as the working pattern in DD-52's closing
report. CC SHOULD propose (a) as the default in the diagnosis row;
if there's structural reason to prefer (b), CC stops and surfaces.

**On audit-pattern documentation form (M16-4).** The if-profile-audit
pattern is canonicalised as a *dev doc* (`docs/dev/`), not as a DD or
guide. The pattern is methodology-internal — it instructs future CDC
+ CC how to audit profile-handling changes — and doesn't need
philosophy.md or guide-level visibility. The audit application
(workbench/verify/m16/kernel-profile-audit.md) is the evidence that
the pattern was followed.

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M16-1 | Baseline state captured at `workbench/verify/m16/baseline.txt` with pre-state landmarks: `compileBoth` test count, the line-356 and line-375 reference sites in `emitter/forms.rs`, the JS gensym-leak grep pre-fix, `make test` pass count, `make test-lykn` pass count | `test -f workbench/verify/m16/baseline.txt && grep -cE "^=== " workbench/verify/m16/baseline.txt` returns ≥5 | polish | Spec 1; LEDGER_DISCIPLINE pre-state discipline | open | | |
| M16-2 | compileBoth audit doc enumerates every `(compile ...)` call in `test/forms/*_test.lykn` with a disposition; conversions landed in test files; surfaced divergences are explicitly dispositioned | `test -f workbench/verify/m16/compileboth-audit.md && grep -cE "^\| (converted\|skipped" workbench/verify/m16/compileboth-audit.md` returns the same number as `grep -cE '\(compile "' test/forms/*_test.lykn`; AND `grep -c '(compile-both ' test/forms/*_test.lykn` returns a number strictly greater than the M16-1 baseline (i.e., conversions actually happened); AND `make test-lykn` exits 0 | serious | Spec 2; thread-opening Track B row 1; handoff §"Track B" | open | | Surface divergences as fast-follow if not fixed within M16 — disclosure not silent drop |
| M16-3 | JS return-type-check error message uses generic `"return value"` label, not the gensym variable name; matches Rust's `emit_return_type_check` output exactly | `grep -E "return '?result__gensym[0-9]+' expected" packages/lang/surface.js` returns 0 lines; AND a new test in `test/forms/dd-49_test.lykn` asserts `(includes ... "return value expected boolean")` and explicitly NOT-includes `"result__gensym"`; AND `compileBoth` against a `(func f :args (:any x) :returns :boolean :body x)` invocation produces convergent output (modulo gensym numbering — within the existing normaliser tolerance) | serious | Spec 3; Finding #4 in DD-49 iter-2 closing report; thread-opening Track B row 2 | open | | The gensym variable name is the *internal* identifier; the user-visible message uses the literal label "return value" matching the Rust shape |
| M16-4 | If-profile-audit pattern documented as dev doc; audit applied to every kernel form with a special-case context intercept; result recorded | `test -f docs/dev/00*-if-profile-audit-pattern-*.md`; AND `test -f workbench/verify/m16/kernel-profile-audit.md`; AND in the audit doc, `grep -cE "^\| " workbench/verify/m16/kernel-profile-audit.md` returns ≥1 row per kernel form named (minimum: `if`; CC verifies whether any others exist via `grep -nE "head_name == \"" crates/lykn-lang/src/emitter/forms.rs` and audits each); AND each audited form has a profile-correctness check + a test reference | correctness | Spec 4; DD-50.7 closing CDC review Finding #1; thread-opening Track B row 3 (DD-50.7 #1) | open | | Audit is documentation + applied check, not refactor; future profile changes follow the documented pattern |
| M16-5 | Surface-form-handler blanket Value override removed; per-form emitters set child context appropriate to each form; DD-50.7's behavioural guarantees preserved | At the surface-form-intercept site in `crates/lykn-lang/src/emitter/forms.rs` (line ~356 pre-refactor): `grep -B2 -A2 "ctx.expr_context = ExprContext::Value" crates/lykn-lang/src/emitter/forms.rs` shows the blanket override is no longer at the dispatch site (may still exist *intentionally* in per-form emitters where Value context is correct); AND the DD-50.7 Cluster 2 save/restore pattern at the 9 sites is reduced (lines 1254, 1319, 1539, 1715, 1760, 1881, 1969, 2284, 2334 per DD-50.7 CDC review — verify post-refactor count is strictly less than 9); AND `cargo test -p lykn-lang -- dd_50` passes; AND `make test-lykn` exits 0 (DD-50.7 regression tests continue to pass) | serious | Spec 5; DD-50.7 closing CDC review Finding #2; thread-opening Track B row 4 (DD-50.7 #2) | open | | The line-356 reference is the pre-refactor location; post-refactor the line number will shift. Verify via grep, not absolute line numbers, after the change |
| M16-6 | Rust and JS expanders agree on directory-path import resolution: `"./packages/testing"` resolves to `"./packages/testing/mod.lykn"` on both, OR both require the explicit path; behaviour is identical | A new `compile-both` test in `test/forms/` (suggested name: `dd-52-import-path-convergence_test.lykn`) compiles `(import-macros "./packages/testing" (...))` and asserts both compilers produce convergent output (currently they disagree per DD-52 fast-follow #3); test exits 0; `make test-lykn` exits 0 | serious | Spec 6; DD-52 closing report fast-follow #3; thread-opening Track B row 5 (DD-52 #3) | open | | CC SHOULD propose direction (a) — align JS to Rust's auto-resolve — in the diagnosis phase. If structural reason favours (b), stop and surface to CDC |
| M16-7 | Closing report includes substrate-rule compliance section addressing the six starter rules | `grep -cE "^## Substrate-rule compliance$" workbench/2026-*-M16-closing-report.md` returns 1; each of the six starter rules (AGENTS.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite, philosophy.md Principle 1, philosophy.md Principle 3, spec-softening check, partial-adoption check) named in the section | correctness | Spec 7; Phase 2 methodology improvement; M11-M13 precedent | open | | |
| M16-8 | Single coherent commit chain naming M16 | `git log --grep="M16\|cross-compiler hygiene\|compileBoth\|return value expected\|if-profile-audit\|Value override\|directory.path\|find_macro_entry" --oneline` returns ≥6 commits | polish | Spec 8; LEDGER_DISCIPLINE evidence-trail discipline | open | | |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** The protocol applies. Iteration
   budget is 5; expected 2–3.

2. **Read the source materials in the listed order before writing any code.**
   Rows M16-4, M16-5, M16-6 are precisely characterised in the cited
   review docs; the criteria above reference those characterisations
   verbatim where possible. If anything in this ledger conflicts with a
   cited source, surface to CDC before implementing.

3. **Subagent delegation policy applies.** Per the project methodology,
   subagent delegation is for **lookups only** (find call sites, grep
   for patterns, list files). All design work, refactor decisions,
   prose-writing, and judgment about whether a divergence is real
   stay in main CC context. Refer to the subagent-delegation policy
   doc if unsure.

4. **Order of work:**
   - **M16-1 (baseline)** — captures pre-state. Must land first.
   - **M16-3 (error-format alignment)** — small, isolated, builds
     momentum. Two call sites (`surface.js:1802`, `1852`); add a
     branch in `buildTypeCheck` for return-mode (or a sibling
     function) that uses the literal label `"return value"` rather
     than the param-name path. Add the regression test.
   - **M16-6 (import-path convergence)** — propose direction (a) in
     diagnosis row; if CDC approves, align JS expander to Rust's
     `find_macro_entry` behaviour. Add the cross-compiler test.
   - **M16-4 (if-profile-audit pattern)** — write the dev doc first
     (the pattern), then apply (the audit). The pattern doc names what
     a "special-case intercept" is and how to audit it. The audit doc
     lists every form, runs the check, records the result.
   - **M16-5 (Value-override refactor)** — the largest structural
     change. **Before refactoring, run `cargo test -p lykn-lang -- dd_50`
     to capture the pre-refactor pass state.** Then refactor in a
     single coherent change: remove the blanket override, audit each
     per-form emitter for its required child context, remove the
     DD-50.7 Cluster 2 workarounds where redundant. Re-run the test
     suite; every test that passed pre-refactor must pass post-refactor.
   - **M16-2 (compileBoth conversion)** — last among the substantive
     rows. By this point, M16-3/4/5/6 have fixed the known divergence
     classes; the remaining divergences `compileBoth` surfaces during
     conversion are genuinely new findings. Write the audit doc as
     you go, not retrospectively. Dispose of each conversion:
     converted / skipped-runtime / skipped-with-rationale / divergence-
     surfaced-as-fast-follow.
   - **M16-7, M16-8** — at closing.

5. **The named failure mode is compliance theatre.** Per LEDGER_DISCIPLINE:
   paper compliance regularly exceeds observed compliance by large
   margins. The countermeasure is per-row walk in the closing report
   with reproducible evidence. **Do not write a prose summary of "all
   rows complete." Walk each row item by item with evidence.**

6. **Anti-shortcut explicit instructions:**
   - For M16-2: do NOT extend `compileBoth`'s normaliser to hide a
     divergence without explicit CDC review of that divergence first.
     If a normaliser extension seems warranted, surface to CDC; the
     default is "fix the divergence."
   - For M16-3: do NOT change the *parameter*-check format. Only the
     return-type-check format changes. The two call paths share the
     same `buildTypeCheck` helper currently; the fix may be a new
     sibling function or a branched-on-label inside `buildTypeCheck`.
     Either is fine — name the choice in the closing report.
   - For M16-5: do NOT remove a DD-50.7 Cluster 2 workaround if its
     emitter's body context isn't structurally guaranteed Statement
     after the blanket-override removal. The audit must justify each
     workaround's removal; preserved workarounds need rationale.
   - For M16-6: do NOT silently change either compiler's behaviour
     without surfacing the design decision to CDC. The direction
     (a)-vs-(b) call is in the diagnosis phase, not implementation.

7. **If `make test` or `make test-lykn` breaks at any point and stays
   broken,** stop and surface. Diagnose before continuing. The
   per-row Verify commands depend on the test infrastructure working;
   downstream verification fails silently if upstream tests are broken.

8. **If a row's scope feels wrong during implementation** — too small,
   too large, structurally different from the criterion — do not
   silently work around it. Raise it as an amendment request. The
   ledger can change; it cannot be quietly ignored. (LEDGER_DISCIPLINE
   §CC protocol point 2.)

---

## CDC instructions

1. **Count rows at close.** Closing report row count = 8. Missing rows
   are a ledger bug, return for completion.

2. **Run every Verify command independently.** Do not take CC's
   evidence at face value. Reproduce against the actual commit state.

3. **For M16-2 (compileBoth conversion):** check the audit doc
   itemises every candidate. Pick three random `(compile ...)` sites
   in `test/forms/*_test.lykn`; verify each appears in the audit doc
   with a disposition. The disposition must be evidence-backed (the
   converted ones now use `compile-both`; the skipped ones have a
   specific rationale).

4. **For M16-5 (Value-override refactor):** independently run
   `cargo test -p lykn-lang -- dd_50` against the post-refactor state.
   DD-50.7 regression tests are the substantive correctness gate.
   Also workspace-grep for `ctx.expr_context = ExprContext::Statement`
   to count post-refactor save/restore sites; should be strictly less
   than the DD-50.7-introduced count (9).

5. **For M16-4 (audit pattern):** the dev doc must be self-contained
   (a future CC can read it and apply the pattern). The audit doc
   must enumerate every kernel form with a special-case intercept,
   not just the `if` case the DD-50.7 review named.

6. **Watch for spec-softening.** Particular risk areas:
   - M16-2: normaliser extensions hiding divergences.
   - M16-5: workarounds preserved without rationale (effectively a
     no-op refactor).
   - M16-6: behaviour change documented but not actually implemented.

7. **Watch for silent drops.** Specific risk: M16-2's audit doc lists
   every candidate but the conversions cover only some. The Verify
   command catches the count, but verify the conversions actually
   exercise emitted-JS assertions (not just `compileBoth` calls with
   no `(assert ...)`).

---

## What worked

_(Filled in at milestone close. Patterns, practices, or decisions
that made the milestone close cleanly and should be preserved or
generalised.)_

## Closure

_(Filled in at milestone close. Closed at commit `<SHA>` on `<date>`.
CDC verification: `<session>`. Total rows: 8. Done: `<n>`. Deferred:
`<n>`. No-op: `<n>`.)_
