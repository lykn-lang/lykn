# Milestone M18: DD-58 Phase 1b — Closed-Namespace Dispatch + Strict-Mode Flag (Rust Classifier)

> **Status:** open
> **Iteration budget:** 5 (expect 2–3)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (this session, cdc/compiler-coherence)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** [DD-58](../../docs/design/05-active/0059-dd-58-*.md), [philosophy.md](../../docs/philosophy.md), M17 closing report
> **Thread origin:** [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md)
> **Predecessors:** M17 (DD-58 Phase 1a — `kernel:` escape recognition) closed 2026-05-17; foundation in place.
> **DD-58 Phase mapping:** This is the second sub-piece of DD-58's "Phase 1 — Rust classifier strict mode + kernel: prefix + closed-namespace dispatch." Specifically the dispatch-tables-and-strict-mode-flag piece, scoped as Phase 1b. Phase 1c (test migration + strict-mode enforcement) and Phase 4 (file-extension gating turning on enforcement by default) are subsequent milestones.

---

## Why this milestone exists

DD-58's closed-namespace model requires the Rust classifier to
have two views of the dispatch tables:

- **The current (lax) view** — `is_surface_form()` and
  `is_kernel_form()` as they exist today, with overlaps (`=`,
  `!=`) and bare kernel forms accepted in surface code.
- **The DD-58 strict view** — the closed-namespace enumeration
  per DD-58: surface namespace is closed (every atom is
  unambiguously surface form, `kernel:`-prefixed, user macro, or
  diagnostic); kernel-only forms (`function`, `const`, `let`,
  `var`, `quote`, `quasiquote`) are reachable only via
  `kernel:` escape.

M18 lands the strict view as a separate set of dispatch
functions, plus a strict-mode flag on `classify()`. **Existing
behaviour is preserved** (strict mode defaults to OFF; the old
dispatch tables and routing logic are untouched). When the flag
is ON, the classifier uses the new tables and enforces the
closed-namespace rule.

Landing this as additive infrastructure:

- Enables M19+ to migrate existing tests and turn strict mode ON
  by default for `.lykn` files (DD-58 Phase 4).
- Lets users who want strict-mode behaviour today opt in via
  the flag.
- Avoids a breaking change in M18 — existing user code and tests
  continue to work without modification.
- Establishes the dispatch shape that DD-37's JS-side classifier
  will mirror (M-something-after-M18).

---

## What this milestone produces

1. **New strict-mode dispatch functions** in
   `crates/lykn-lang/src/classifier/dispatch.rs`:
   - `is_surface_form_strict(name: &str) -> bool` — returns true
     for atoms in DD-58's surface namespace (rich-unique +
     passthrough + namesake-sharing).
   - `is_kernel_only_form(name: &str) -> bool` — returns true
     for atoms that are reachable only via `kernel:` escape
     (`function`, `function*`, `const`, `let`, `var`, `quote`,
     `quasiquote`).
   - Existing `is_surface_form()` and `is_kernel_form()` are
     **untouched** in M18. They continue to govern non-strict
     classification.
2. **Strict-mode flag on `classify()`.** The classifier entry
   point gains a `strict: bool` parameter (or equivalent — e.g.,
   a `ClassifierOptions` struct with a `strict` field).
   - When `strict == false` (default): existing behaviour
     preserved bit-for-bit.
   - When `strict == true`: dispatch uses the new strict
     functions; a surface-position atom that is NOT in
     `is_surface_form_strict()` AND NOT `kernel:`-prefixed AND
     NOT a registered user macro produces a structured diagnostic.
3. **Tests** for strict mode:
   - **Strict rejection:** `(const x 42)` in surface position
     with strict ON → diagnostic naming the form and suggesting
     either `bind` (surface alternative) or `kernel:const`
     (explicit escape).
   - **Strict acceptance — surface forms:** `(bind x 42)`,
     `(func foo ...)`, `(if c t e)`, etc. classify correctly
     under strict mode.
   - **Strict acceptance — passthrough forms:** `(+ a b)`,
     `(array 1 2)`, `(=> (x) x)` classify correctly (route to
     `SurfaceForm::KernelPassthrough` per the same machinery M17
     established).
   - **`kernel:` escape under strict:** `(kernel:const x 42)`
     classifies as `KernelPassthrough` (per M17's logic).
   - **Backward-compat:** existing tests pass unchanged with
     strict OFF.
4. **DD-58 citation in the new code.** Each new dispatch
   function and the strict-mode routing logic carry a comment
   citing DD-58's "Per-layer form enumeration" section.
5. **No changes to:**
   - The existing `is_surface_form()` / `is_kernel_form()`
     dispatch functions.
   - The emitter / codegen.
   - The JS compiler (separate milestone, depends on DD-37).
   - The lambda emission (DD-58 Breaking Change #3 — separate
     milestone).
   - File-extension gating (DD-58 Phase 4 — separate milestone).
   - Test migration (M19+ scope).

This milestone does **not**:

- Migrate existing tests to use surface forms instead of bare
  kernel forms. That's M19 scope.
- Turn on strict mode by default. That's Phase 4 / M20+.
- Implement the lambda emission fix (`function` for
  `lambda`/`fn`). Separate milestone — touches codegen, not
  classifier.
- Touch the JS compiler.
- Retire `_kernel` marker, `kernelArray()`, or `SetSymbol`.
  DD-58 Phase 5.

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md) — protocol (mandatory)
2. [`assets/ai/SUBAGENT-DELEGATION-POLICY.md`](../../assets/ai/SUBAGENT-DELEGATION-POLICY.md) — subagent rules
3. [`assets/ai/AGENTS.md`](../../assets/ai/AGENTS.md) "Lykn CLI safety gates" + "Snapshot testing"
4. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`. Focus on:
   - §"Architectural rule"
   - §"Per-layer form enumeration" — the canonical lists for the strict-mode dispatch
   - §"Migration sequencing — Phase 1"
5. **M17 ledger and closing report** for the precedent of how the
   prefix-handler logic was scoped and tested:
   - `workbench/milestones/M17-dd58-phase1a-kernel-prefix-recognition-ledger.md`
   - `workbench/2026-05-17-M17-closing-report.md`
   - `workbench/M17-closing-cdc-review-2026-05-17.md`
6. `crates/lykn-lang/src/classifier/dispatch.rs` — current
   `is_surface_form` and `is_kernel_form`. Read end-to-end before
   adding the strict variants; understand the existing shape so
   the new functions match style.
7. `crates/lykn-lang/src/classifier/mod.rs` — `classify()` entry
   point; understand the signature and call sites before adding
   the strict parameter.
8. `crates/lykn-lang/src/classifier/forms.rs` — `classify_form()`
   where M17 added the `kernel:` prefix handling. The strict-mode
   routing logic lives near here.

---

## Design dispositions (carried forward from DD-58 + CDC scope analysis)

**On the lists for the strict dispatch functions.** Use DD-58's
"Per-layer form enumeration" verbatim:

- `is_surface_form_strict()` includes all of flavor (a)
  rich-unique, flavor (b) passthrough, and flavor (c)
  namesake-sharing forms enumerated in DD-58. This is the
  closed surface namespace.
- `is_kernel_only_form()` includes `function`, `function*`,
  `const`, `let`, `var`, `quote`, `quasiquote`. These are the
  forms accessible only via `kernel:` escape.
- Note that some forms (e.g., `=>`) are in BOTH the strict
  surface set (as passthrough) AND `is_kernel_form()` (current).
  That's expected — `=>` is a passthrough surface form whose
  emitter routes through the kernel.

**On the strict-mode flag's API shape.** Two acceptable shapes:
- Direct parameter: `pub fn classify(forms: &[SExpr], strict: bool) -> Result<...>`.
- Options struct: `pub fn classify(forms: &[SExpr], opts: ClassifierOptions) -> Result<...>` where `ClassifierOptions { strict: bool, ... }`.
The struct form is more extensible (Phase 4 may add `file_kind:
FileKind` for extension gating). CDC lean: **struct form** to
avoid a second signature change in M20. CC's call if there's a
strong reason to prefer the direct parameter.

**On routing under strict mode.** When strict is ON, the
classifier's algorithm is:
1. Check if head atom starts with `kernel:`. If yes, use M17's
   existing logic (strip, validate against `is_kernel_form()`,
   emit `KernelPassthrough`).
2. Check if head atom is in `is_surface_form_strict()`. If yes,
   dispatch to the typed surface-form parser.
3. Otherwise, the atom is either a user macro (resolved at
   expansion time) or a diagnostic. Producing a diagnostic at
   classification time requires knowing whether a macro is
   registered, which the classifier doesn't have visibility
   into at this layer. **CDC disposition: defer the diagnostic
   to expansion time.** Strict-mode classifier produces
   `SurfaceForm::FunctionCall { head, args }` (or equivalent
   "unknown" wrapper) for atoms not in the surface set; the
   expander then resolves it as a macro invocation OR produces
   a clearer "no surface form or macro registered for 'X'"
   diagnostic.

**On diagnostic message shape.** For strict-mode rejection of
`(const x 42)`: the diagnostic SHOULD suggest both the surface
alternative AND the `kernel:` escape. Example: `"'const' is a
kernel-only form; use '(bind x 42)' for surface binding, or
'(kernel:const x 42)' to access the kernel form explicitly."`
First-pass can be simpler ("kernel-only form 'X'; use 'Y' or
'(kernel:X ...)'"); did-you-mean polish is acceptable to defer.

**On TDD-first discipline.** Per M17's precedent and CC's
methodology-learning self-reflection, this milestone REQUIRES
failing-test-first for M18-3 (strict-mode flag + routing logic),
M18-4 (strict rejection tests), and M18-5 (strict acceptance
tests). The pattern: test commit → fix commit, verifiable in
the git log.

**Methodology learning from M17 CDC review:** when ledger rows
split positive-path and negative-path of the same implementation
site, the TDD-first discipline adapts — what matters is "is
there a failing test for each substantive behaviour change,"
not "does each row's test commit strictly precede each row's fix
commit." M18-4 and M18-5 cover positive-path (strict acceptance)
and negative-path (strict rejection) of the same strict-mode
implementation; if M18-3's fix bundles both, the M18-4/M18-5
tests may pass trivially in the same way M17-4 did. **Disclose
honestly if so.**

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M18-1 | Baseline state captured at `workbench/verify/m18/baseline.txt` | `test -f workbench/verify/m18/baseline.txt && grep -cE "^=== " workbench/verify/m18/baseline.txt` returns ≥4 | polish | Spec; LEDGER_DISCIPLINE pre-state discipline | open | | Pre-state: current is_surface_form / is_kernel_form sizes; classify() signature; existing test counts |
| M18-2 | New strict-mode dispatch functions `is_surface_form_strict()` and `is_kernel_only_form()` exist in dispatch.rs, matching DD-58's enumeration | `grep -nE "fn is_surface_form_strict\|fn is_kernel_only_form" crates/lykn-lang/src/classifier/dispatch.rs` returns 2 lines; each function has a comment citing DD-58 §"Per-layer form enumeration"; the surface-strict set includes `=>` (per DD-58's 2026-05-17 follow-up) | serious | Spec 1; DD-58 enumeration | open | | Verify the strict set matches DD-58 exactly — spot-check 5-10 representative forms |
| M18-3 | Strict-mode flag added to `classify()`; OFF preserves existing behaviour, ON uses strict tables and produces diagnostic for unknown surface atoms | TDD-first: test for strict ON exists and fails before implementation; passes after. Existing tests continue to pass when strict is OFF (no change to their call sites) | serious | Spec 2; DD-58 §"Migration sequencing Phase 1" | open | | TDD-first MUST: test commit precedes fix commit |
| M18-4 | Strict rejection tests: `(const x 42)` and similar bare kernel-only forms in surface position with strict ON produce structured diagnostics naming the form and suggesting alternative | Tests in `crates/lykn-lang/src/classifier/` exercise at least three kernel-only forms (e.g., `const`, `let`, `function`); each test asserts the diagnostic contains the form name and either a surface alternative OR the `(kernel:X ...)` suggestion | serious | Spec 3; DD-58 §"The kernel: escape syntax" | open | | TDD-first; per M17 methodology, may pass trivially if M18-3's fix bundles diagnostic with routing — disclose honestly if so |
| M18-5 | Strict acceptance tests: surface forms (rich + passthrough + namesake-sharing) all classify correctly under strict mode | Tests exercise at least one form per flavor: `bind` (a), `+` (b), `=>` (b), `if` (c); each test asserts correct classification (right `SurfaceForm` variant or correct `KernelPassthrough` routing) | serious | Spec 3 | open | | TDD-first; may pass trivially per M18-4 note |
| M18-6 | `kernel:` escape continues to work under strict mode (per M17's implementation) | Test: `(kernel:const x 42)` with strict ON classifies as `KernelPassthrough` (same as strict OFF behaviour) | correctness | Spec 3; M17 precedent | open | | Backward-compat for M17's work |
| M18-7 | Backward-compat: no existing test regresses with strict OFF | `make test`, `make test-lykn`, `./bin/lykn test test/forms/` all pass with counts ≥ post-M17 baseline (1006 Rust, 292 surface, 670 forms — except where increased by new M18 tests) | serious | Spec 5; M17 baseline | open | | The strict flag MUST default to OFF; existing call sites MUST NOT need modification |
| M18-8 | Closing report includes substrate-rule compliance section + TDD-first | `grep -cE "^## Substrate-rule compliance" workbench/2026-*-M18-closing-report.md` returns 1; six rules named (AGENTS.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite, philosophy.md Principle 1, philosophy.md Principle 3, backward-compat invariant, TDD-first discipline) | correctness | Spec; methodology continuity | open | | |
| M18-9 | Single coherent commit chain demonstrating TDD-first | `git log --grep="M18\|strict.mode\|closed.namespace\|DD-58" --oneline` returns ≥3 commits; for substantive changes (M18-3 et al.) the test commit precedes the fix commit | correctness | Spec; TDD-first discipline | open | | |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** Protocol applies.
   Iteration budget is 5; expected 2–3.

2. **Read DD-58 before writing any code.** The "Per-layer form
   enumeration" section is the canonical source for the strict
   dispatch tables. The strict-mode flag's expected behaviour is
   in "Migration sequencing — Phase 1."

3. **Subagent delegation policy:** lookup-only. Design decisions,
   classifier logic, dispatch-table contents, diagnostic-message
   wording all stay in main CC context.

4. **TDD-first MUST** for M18-3, M18-4, M18-5:
   - Test FIRST. Run. Observe failure. Commit test.
   - THEN fix. Run. Observe pass. Commit fix.
   - Per M17's methodology learning: if M18-4's or M18-5's tests
     pass trivially after M18-3's fix (because the fix bundles
     positive-path and negative-path), **disclose honestly in
     the closing report** rather than artificially separating.

5. **Order of work:**
   - M18-1 (baseline) — captures pre-state.
   - M18-2 (new strict dispatch functions) — data-only addition.
     Verify the strict set matches DD-58 exactly; spot-check
     5–10 representative forms per flavor.
   - M18-3 (strict-mode flag on `classify()`) — TDD-first.
     Decide between direct `strict: bool` parameter vs.
     `ClassifierOptions` struct (CDC lean: struct; CC's call
     if structural reason favours parameter).
   - M18-4 (strict rejection tests) — TDD-first; verify
     diagnostic shape.
   - M18-5 (strict acceptance tests) — TDD-first; verify
     classification correctness across flavors.
   - M18-6 (kernel: escape under strict) — regression test for
     M17's work under the new strict mode.
   - M18-7 (backward-compat verify) — run full test suite.
   - M18-8, M18-9 — at closing.

6. **Anti-shortcut explicit instructions:**
   - **Do NOT modify the existing `is_surface_form()` or
     `is_kernel_form()`.** Those are untouched in M18; the new
     `_strict` / `_only` functions exist alongside them.
   - **Do NOT change the default value of `strict`.** Defaults
     to OFF (false). Turning strict ON by default is M20+ scope.
   - **Do NOT touch the emitter / codegen.** The lambda emission
     fix (DD-58 Breaking Change #3) is a separate milestone.
   - **Do NOT migrate existing tests.** M19 scope.
   - **Do NOT touch the JS compiler.**
   - **Do NOT auto-pass safety-bypass flags** per AGENTS.md.
   - **Do NOT auto-accept insta snapshot diffs** per AGENTS.md.

7. **If the dispatch-table contents in DD-58 don't match
   reality** (e.g., a form is listed as passthrough but doesn't
   exist in the current `is_kernel_form()`), STOP and surface.
   This is methodology-relevant — DD-58 may need refinement.

8. **Compliance theatre is the named failure mode.** Per-row walk
   in the closing report MUST cite test commit SHAs and fix
   commit SHAs for M18-3 (and M18-4/M18-5 if they have separate
   commits).

---

## CDC instructions

1. **Count rows at close.** Closing report row count = 9.

2. **Run every Verify command independently.**

3. **For M18-2 (strict dispatch functions): spot-check the
   strict set against DD-58.** Pick 5–10 forms across flavors
   and verify each is in the right strict function. Particular
   attention to `=>` (recently confirmed as passthrough surface
   form per 2026-05-17 follow-up).

4. **For M18-3 (strict-mode flag): verify the default is OFF.**
   Inspect the signature or struct definition.

5. **For M18-4 / M18-5 / M18-6: verify the test commits exist
   and the TDD-first discipline is honored in substance.** Per
   M17 precedent, trivial-pass disclosures are methodology-
   acceptable when bundled implementations cover multiple rows.

6. **For M18-7 (backward-compat): run the full test suite from
   a clean state.** The strict-OFF default means EVERY existing
   test should pass unchanged; any regression is a methodology
   violation.

7. **Watch for spec-softening.** Particular risks:
   - The strict set is INCOMPLETE (missing some flavor (b)
     passthrough forms) — would soft-pedal the closed-namespace
     rule.
   - The diagnostic message under strict is generic ("unknown
     form") rather than naming the form AND suggesting
     alternatives — would soft-pedal the user-facing intent.
   - The strict-OFF behaviour is changed (call sites need
     updating) — would soft-pedal the backward-compat invariant.

8. **Watch for partial adoption.** The strict-mode routing
   should apply uniformly — not "strict for some surface forms,
   not for others." If the implementation has carve-outs, name
   them.

---

## What worked

_(Filled in at milestone close.)_

## Closure

_(Filled in at milestone close. Closed at commit `<SHA>` on
`<date>`. CDC verification: `<session>`. Total rows: 9. Done:
`<n>`. Deferred: `<n>`. No-op: `<n>`.)_
