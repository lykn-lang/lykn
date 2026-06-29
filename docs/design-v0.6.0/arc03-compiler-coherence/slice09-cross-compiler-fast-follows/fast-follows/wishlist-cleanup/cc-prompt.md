# Comprehensive Cleanup Prompt for CC — Wishlist Items Across Recent Work

## Read this first

This prompt extracts every "improvement worth making" item CDC has
identified across the recent work cycle (M16 + `--source-context-path`
fast-follow + import-macros Turn 2). Each item is framed as a MUST.
None are soft-pedalled. CC's job is to address all of them; CDC's
job is to verify each was addressed substantively.

**Scope:** twelve discrete items in three tiers:
- **Tier A — Coverage gaps (3 items):** missing tests / fixtures /
  CLI verifications that should have existed but don't.
- **Tier B — Documentation and comments (3 items):** code and
  helper documentation that's currently thin where the methodology
  expects thoroughness.
- **Tier C — Formatting-class divergences from M16-2 (6 items):**
  six cross-compiler output divergences that `compileBoth` surfaced
  during M16-2 conversion and that were logged as fast-follow.
  Each requires diagnosis + canonical-direction decision + fix or
  normalizer extension.

**Ordering:** this work MUST land **AFTER** the import-macros
divergence Turn 2 (the in-flight `(runtime-import ...)` Rust fix).
Several items in Tier C may behave differently once Turn 2 lands,
so starting before Turn 2 closes risks duplicate work or
re-diagnosing already-fixed divergences.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode. Every
  acceptance criterion in this prompt is written in substantive-
  intent terms, not surface-mechanism terms. Meet the substantive
  intent.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Lookup-only for
  subagents. Design decisions, diagnosis judgment, normalizer-vs-fix
  decisions, and prose-writing in main CC context.
- **You MUST stop and surface on dissonance.** If a Tier C item's
  diagnosis surfaces something genuinely surprising — e.g., a
  divergence that's actually correctness-grade and not formatting-
  class — name it explicitly and pause before proceeding to the fix.
  Mid-flight reclassification of an item's tier is acceptable; silent
  re-scope is not.
- **You MUST address EVERY item.** No item may be silently dropped.
  If during work an item proves wrong, impossible, or supersedable,
  raise an amendment request. The list is the spec; the list cannot
  be quietly ignored.
- **You MUST follow the two-turn pattern for Tier C** (diagnose all
  6 divergences in Turn 1 with CDC approval gate; implement fixes
  in Turn 2). This is the methodology gate that prevents the
  "literal criterion met, substantive gap" pattern.
- **You MUST NOT auto-pass safety-bypass flags** to underlying
  tools per CLAUDE.md "Lykn CLI safety gates."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md` — the protocol.
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md` — subagent rules.
3. `assets/ai/CLAUDE.md` "Lykn CLI safety gates" + "Snapshot
   testing" sections.
4. `workbench/2026-05-15-M16-closing-report.md` — the M16-2
   divergence classes are listed in §"Findings for fast-follow."
5. `workbench/M16-closing-cdc-review-2026-05-15.md` — CDC's review
   of M16 (context on the divergence catalogue).
6. `workbench/2026-05-16-compileboth-source-context-path-closing-report.md`
   — source-context-path closure (context on cmd_compile routing).
7. `workbench/compileboth-fast-follow-cdc-review-2026-05-16.md` —
   CDC review of source-context-path (context on F-6 caveat: the
   current test verifies the mechanism, not the routing).
8. `workbench/old/dd-52-closing-cdc-review-2026-05-12.md` — DD-52
   bad-form fixture gap (DD-52 §"Test inventory verification").
9. The current state of `crates/lykn-cli/src/{main.rs,compile.rs}`,
   `packages/testing/helpers.js`, and the M16-2-modified
   `test/forms/*_test.lykn` files.

---

## Tier A — Coverage gaps (3 items)

### A-1 — `cmd_compile` routing-logic integration test

**MUST add an integration test that exercises both branches of
`cmd_compile`'s `match source_context_path { Some(...) => ...,
None => ... }`.** The current unit test (`compile_source_context_path_synthetic_parent`)
verifies the underlying mechanism (synthetic path's `parent()`)
but does NOT exercise the routing branch in `cmd_compile`. A
malformed routing change would not be caught.

**Verify:**
- A new test in `crates/lykn-cli/tests/` (suggested name:
  `source_context_path_routing.rs`) MUST exist and:
  - Invoke `lykn compile` with `--source-context-path <path>` set
    on a source containing a relative import; assert the import
    resolves against `<path>`, not the temp file's directory.
  - Invoke `lykn compile` without `--source-context-path` on the
    same source; assert the import resolves against the source
    file's directory.
- `cargo test -p lykn-cli source_context_path_routing` exits 0.

### A-2 — CLI integration test that the flag appears in `--help`

**MUST add a CLI-level test that verifies `lykn compile --help`
output contains the `--source-context-path` flag.** Current F-1
verification was source-inspection only because the Mac binary
won't run in CDC's Linux sandbox. A test that compiles + runs the
binary closes the gap.

**Verify:**
- A test in `crates/lykn-cli/tests/` (could be in the same file as
  A-1) MUST exist and:
  - Invoke `./target/release/lykn compile --help` (or use a `Command`
    helper).
  - Assert the output contains the literal string
    `--source-context-path`.
- `cargo test -p lykn-cli` exits 0 with the new test included.

### A-3 — `bad-form` fixture test coverage

**MUST add a test exercising the `bad-form` fixture in
`test/regression/surface-macros/`.** The fixture was created during
DD-52 implementation but no test in `test/forms/dd-52.test.js`
exercises it. The validation code path (`pass0.rs` `extract_surface_macros_directive`)
exists but is untested via integration.

**Verify:**
- A new test case in `test/forms/dd-52.test.js` (or
  `dd-52-surface-macros-validation.test.js`) MUST:
  - Compile a source with `(surface-macros 42)` or
    `(surface-macros)` (a syntactically-bad surface-macros directive).
  - Assert the compilation produces a validation error containing
    `surface-macros` and the specific malformation (e.g., "expected
    string path" or "missing argument").
- `deno test --allow-read --config project.json test/forms/dd-52.test.js`
  exits 0 with the new test included.

---

## Tier B — Documentation and comments (3 items)

### B-1 — `compileBoth` docstring overhaul

**MUST replace `compileBoth`'s current docstring in
`packages/testing/helpers.js` with a thorough one that names ALL
of the following:**

- What `compileBoth` does (compile via both JS and Rust, assert
  convergent output).
- The `--source-context-path` mechanism: passes `Deno.cwd()` as
  the context, so relative imports in source resolve from project
  root regardless of the temp file's location. Names the
  assumption: "callers MUST invoke from project root."
- The normalizer's specific transformations: whitespace collapse,
  trailing-semicolon canonicalization, Rust-warning stripping,
  gensym-counter canonicalization. Names each transformation with
  one-sentence rationale.
- The forbidden-extension policy: "if a divergence surfaces that
  isn't covered by the normalizer, the default action is to FIX
  the divergence in one compiler, not to extend the normalizer.
  Normalizer extensions require explicit rationale in the
  docstring."
- The current known limitations (post-Turn-2 of import-macros
  work): what kinds of sources `compileBoth` reliably converges
  on and what kinds may surface latent divergences.

**Verify:**
- `grep -c "Deno.cwd" packages/testing/helpers.js` returns ≥1
  (mentioned in docstring).
- `grep -c "normalizer" packages/testing/helpers.js` returns ≥1.
- `grep -c "FIX the divergence" packages/testing/helpers.js` (or
  equivalent forbidden-extension language) returns ≥1.
- The docstring section is at least 30 lines (substantive, not
  one-line).

### B-2 — Synthetic-path routing comment in `cmd_compile`

**MUST add a comment in `crates/lykn-cli/src/main.rs` near the
`let resolve_path: std::path::PathBuf = match source_context_path`
block explaining the mechanism:**

- Why the synthetic basename (`__compileBoth__.lykn`) is
  irrelevant.
- Why the parent directory matters (pass0's
  `file_path.parent().unwrap_or(Path::new("."))` semantics).
- What happens when `source_context_path` is `None` (the file's
  own path is used; default behaviour preserved).

The comment MUST be at least 6 lines and MUST cite `pass0.rs` for
the resolution mechanism.

**Verify:**
- `grep -A 10 "match source_context_path" crates/lykn-cli/src/main.rs`
  returns the routing block prefixed by ≥6 lines of comment.
- Comment contains references to `pass0` (the resolution site).

### B-3 — Normalizer policy comment in `helpers.js`

**MUST add a comment immediately above the `normalize` function in
`packages/testing/helpers.js` codifying the policy:**

- Each existing normalizer transformation is listed with its
  one-sentence rationale.
- The forbidden-extension rule is named: "any new normalizer
  transformation MUST be added with an explicit rationale comment
  AND a reference to the closing-report or fast-follow note that
  surfaced the need."
- The "FIX the divergence, don't normalize it" default is named.

**Verify:**
- `grep -B 12 "const normalize" packages/testing/helpers.js`
  returns ≥10 lines of comment immediately above the function.
- Comment names each existing transformation.
- Comment names the forbidden-extension policy.

---

## Tier C — Formatting-class divergences from M16-2 (6 items)

**This is the substantive workstream. SIX cross-compiler output
divergences were logged by M16-2 as fast-follow:**

1. **C-1 — Class/object formatting** (class body, object literal)
2. **C-2 — Generator syntax** (`function*` declaration)
3. **C-3 — Async wrapping** (async function wrapping)
4. **C-4 — Destructuring formatting** (parameter and assignment patterns)
5. **C-5 — Default parameter formatting**
6. **C-6 — Tagged template emission**

**Affected test files (per M16-2 closing report):** tag_test,
object_test, default-params_test, generator_test,
destructuring-params_test, destructuring-assignment_test,
class_test, class-methods_test, async-await_test.

### MUST use the two-turn pattern

**Turn 1 — Diagnosis (all 6 items in one document; CDC-approval
gate before Turn 2).** Produce a diagnosis at
`workbench/2026-05-<date>-m16-formatting-divergences-diagnosis.md`
addressing for EACH of the 6 classes:

- **D-Q1 (per class) — Side-by-side example.** Minimal source
  that triggers the divergence; JS output; Rust output; precise
  diff.
- **D-Q2 (per class) — Why each compiler does what it does.** Cite
  the code sites in each compiler. (Likely candidates: `compiler.js`
  for JS; `crates/lykn-lang/src/codegen/emit.rs` and `forms.rs`
  for Rust.)
- **D-Q3 (per class) — Stylistic vs. correctness-grade.** Same
  question as the import-macros divergence: would the output of
  one compiler actually break at runtime, or is the divergence
  truly cosmetic? **You MUST treat correctness-grade findings as
  promotion-to-substantive items;** if any of C-1..C-6 turns out
  to be correctness-grade, name it and pause for CDC review of
  scope.
- **D-Q4 (per class) — Direction recommendation.** Three options
  per class:
  - **(a) Align Rust to JS** — change Rust to match JS's output.
  - **(b) Align JS to Rust** — change JS to match Rust's output.
  - **(c) Normalize in `compileBoth`** — extend the normalizer
    with rationale (default-disfavoured per the policy comment
    you'll add in B-3).
- **D-Q5 (per class) — Implementation scope estimate.** Rough
  file count and line estimate for each direction.

**MUST stop and surface after Turn 1.** Do not implement until CDC
approves direction for each class. CDC will respond with
class-by-class direction confirmations or pushback.

### Turn 2 — Implementation (6 fixes, after CDC direction-per-class)

For each of C-1 through C-6, implement the CDC-approved direction.

**Per-class acceptance criteria:**

- **For directions (a) or (b) fixes:** the test file previously
  flagged as surfacing the divergence MUST now use `compile-both`
  in place of `compile`, and pass. (The M16-2 closing-report list
  names the 9 affected files; map each to the relevant class.)
- **For direction (c) normalizer extensions:** the normalizer
  comment (added in B-3) MUST be updated with the new
  transformation and its rationale; the affected test file MUST
  now use `compile-both` and pass; and the closing report MUST
  explain why direction (c) was chosen over (a) or (b) for that
  class.

**Aggregate acceptance:**
- `make test`, `make test-lykn`, and `./bin/lykn test test/forms/`
  MUST exit 0 with pass counts ≥ post-Turn-2-import-macros
  baseline.
- `grep -c '(compile-both ' test/forms/*_test.lykn | awk -F: '{sum+=$2} END{print sum}'`
  MUST be strictly greater than the post-M16-2 baseline (68) —
  the 9 affected test files now use compile-both where they
  didn't.

---

## Forbidden patterns

- **Do NOT proceed to Turn 2 of Tier C without CDC approval of
  the direction per class.** Six classes; CDC must approve each.
- **Do NOT silently extend the normalizer.** Every new
  transformation requires the rationale comment from B-3 AND a
  named reason in the closing report. The default action is to
  FIX the divergence.
- **Do NOT mix items across tiers in a single commit.** Tier A
  items each get their own commit (or one commit per file).
  Tier B items each get their own commit. Tier C items get one
  diagnosis commit + per-class fix commits.
- **Do NOT drop any item.** All 12 must reach final status. If
  an item proves unactionable, raise an amendment request — do
  not silently skip.
- **Do NOT auto-accept any insta snapshot diffs** per CLAUDE.md
  "Snapshot testing."
- **Do NOT start before Turn 2 of the import-macros divergence
  fast-follow lands.** That work changes the Rust expander's
  output for `(import-macros ...)` sources; Tier C diagnosis
  needs that baseline.

---

## Iteration budget

**5 iterations.** Expected 3–4 (Tier A + Tier B in 1 iteration;
Tier C Turn 1 diagnosis as 1 iteration; CDC review; Tier C Turn 2
implementation as 1–2 iterations). If you reach iteration 5
without convergence, stop. Rework scope or surface a methodology
question.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-wishlist-cleanup-closing-report.md`. The
closing report MUST:

1. Walk EVERY item (A-1, A-2, A-3, B-1, B-2, B-3, C-1, C-2, C-3,
   C-4, C-5, C-6) with the final status (`done` / `deferred` /
   `no-op`) and the Verify command output as evidence.
2. For each Tier C item, name the direction chosen (a/b/c) AND
   the rationale.
3. Include a "Substrate-rule compliance" section addressing
   CLAUDE.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite,
   no-spec-softening (particularly for any Tier C class
   promoted to correctness-grade), and partial-adoption check.
4. Include a "Findings for fast-follow" section logging any
   genuine new findings (e.g., a Tier C class that turned out to
   be correctness-grade, additional divergences surfaced during
   diagnosis, etc.). If none, say so explicitly.
5. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to touch DD-58 or DD-37 (CDC's work).
- You do not need to redo M16 or the import-macros divergence
  Turn 2 work (separate; already in flight or done).
- You do not need to canonicalize the methodology lessons (count-
  criterion + substantive-intent) into LEDGER_DISCIPLINE — that's
  CDC work.
- You do not need to commit to canonicalising what the M16-2
  divergences mean for DD-58. That synthesis happens after DD-58's
  drafting completes; for this prompt, just diagnose and fix the
  divergences in their current scope.

---

## Start

1. Wait for Turn 2 of the import-macros divergence fast-follow to
   close cleanly. (CDC will signal via merging or explicit
   sign-off.)
2. Re-read this prompt and the required materials.
3. Tier A items can be done in any order (parallel-safe).
4. Tier B items can be done in any order (parallel-safe, but B-3
   informs Tier C's normalizer-policy framing — do B-3 before
   Tier C Turn 1).
5. Tier C Turn 1: diagnose all 6 classes in one document, stop
   and surface for CDC review.
6. Tier C Turn 2: implement after CDC direction-per-class.
7. Produce the closing report.

Surface anything that looks off before working around it.
