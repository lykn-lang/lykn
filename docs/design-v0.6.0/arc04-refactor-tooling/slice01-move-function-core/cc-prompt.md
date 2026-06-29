# M22.5-T1a Implementation Prompt: `move-function.js` — Verbatim-Move Core

**From:** CDC (Cowork Claude, cdc/compiler-coherence thread)
**To:** CC (Claude Code, fresh session)
**Date:** 2026-05-23
**Branch:** `cdc/compiler-coherence` (worktree at `.worktrees/compiler-coherence/`)
**Re:** Build the byte-exact function-move tool — **core only** (the two
named files). Cross-file consumer rewiring and batch mode are a separate
follow-up prompt (`M22.5-T1b`). Build and prove the core first.

---

## 0. Read these first

Before writing any code, read, in order:

1. `workbench/2026-05-18-M22-audit-report.md` — the fresh-CC audit of
   M22's actual state. Your function/line inventory and the source of
   the corpus this tool will later operate on. Note especially the
   per-helper table and the `surface.js` shape section (§C).
2. `LEDGER_DISCIPLINE.md` — TDD-first paired commits, grep-verifiable
   Verify commands. This applies to the tool's own development.
3. `CLAUDE.md` → "Lykn CLI safety gates" — the *spirit* of that rule
   (never silently bypass a verification gate) applies to this tool's
   verify step, even though this tool is not the Lykn CLI.

Do **not** start coding until you have read these and the spec below in
full.

---

## 1. Why this tool exists

M22 (DD-37 step 3, per-form surface migration) repeatedly failed in one
specific way: when asked to *move* a function from `surface.js` to
another module, the implementing session kept **reimplementing** the
function from scratch instead of **copying** it — and reimplementation
introduced behavioural divergence (e.g. a broken `emitMatch`). Two other
evasions appeared: aliasing (`export { foo } from "./surface.js"`) in
place of moving, and vague "it's basically the same" framing.

The structural fix is to take the move out of the generative path
entirely. A tool that **parses only to locate, then copies raw bytes**
cannot reimplement, cannot reflow, cannot "improve" the code in transit.
The moved bytes are provably identical to the source bytes.

This is **track B** of a three-track tooling plan (A = manual,
evasion-prone, what M22 was; B = this tactical tool; C = a future
MCP-powered refactoring server). Track B exists to do M22.5-2/-3 *with*
the tool and learn what track C needs.

**This prompt (T1a) builds the core.** The tool produced here moves a
declaration between exactly two files — the `--from` file and the `--to`
file — and nothing else. A move whose declaration is imported by *other*
modules will (correctly) fail verification here; rewiring those
consumers is `M22.5-T1b`. Pick the T1a acceptance helper accordingly
(§7, Layer 4).

---

## 2. The one invariant (non-negotiable)

> **Parse only to locate. Copy raw bytes. Never regenerate.**

The tool uses a JS parser (`acorn`) **only** to find the exact
`[start, end]` character offsets of a named top-level declaration in the
source file's original text. It then extracts the moved code via
`sourceText.slice(start, end)` — the verbatim substring — and inserts
that substring into the target file **unchanged**.

`astring` (or any code generator / pretty-printer) **must never touch
the moved declaration body.** Even a faithful pretty-printer reflows
source; that destroys the byte-exactness guarantee that lets us verify
behaviour preservation by inspection.

A dedicated test (see §7, Layer 2) asserts that the moved declaration's
bytes are identical to the original declaration's bytes (strict string
equality or SHA-256 of the sliced spans). If that test cannot be made to
pass, the tool is wrong — fix the tool, do not weaken the test.

---

## 3. Placement, runtime, dependencies

- **File:** `scripts/move-function.js`. The project already keeps
  standalone Deno tooling in `scripts/` — see `scripts/bundle-size.js`
  for the convention (top-of-file comment stating invocation, ESM,
  `npm:` bare imports).
  - *Design call (surface if you disagree):* `scripts/` vs a new
    `tools/`. CDC recommends `scripts/` for consistency with the
    `bundle-size.js` precedent and the lint config that already covers
    `scripts/`. If you prefer `tools/`, say so rather than deciding
    silently.
- **Runtime:** Deno. No Node.js (project rule).
- **Language:** plain JavaScript. **Do not introduce TypeScript** — it
  would add a third language to the toolchain (JS, Rust, +TS) for a tool
  whose only job is shuffling JS bodies, against Principle 2 (Lykn-only
  tooling). This was a deliberate CDC/Duncan decision, not an oversight.
- **Dependencies:** `npm:acorn` (imported as a bare specifier exactly as
  `bundle-size.js` imports `npm:esbuild` — **no `project.json`
  import-map entry needed**). Deno std for test assertions
  (`https://deno.land/std/assert/mod.ts`, matching existing JS tests).
  Nothing else.
- **Permissions:** invoke with `-A` (matches `bundle-size.js`).

Invocation shape (core):

```sh
deno run -A scripts/move-function.js \
  --from packages/lang/surface.js \
  --to   packages/lang/surface-helpers.js \
  --name <helperName> \
  [--dry-run] \
  [--verify-cmd "deno test -A test/"]
```

`--names` (batch) is **not** part of T1a.

---

## 4. Functional spec (core: two named files only)

### 4.1 Structure for testability

Structure the tool so its logic is a set of **pure, exported functions**
operating on strings, with a thin CLI wrapper (`if (import.meta.main)
{...}`) and a thin IO/subprocess layer. The pure core is what the unit
tests exercise directly. Suggested core surface for T1a:

- `locateDeclaration(sourceText, name) → { start, end, exported, kind,
  spanWithComments } | null` — parse with acorn, find the top-level
  `function` / `function*` / `const` declaration named `name` (unwrap a
  surrounding `export`). `start`/`end` are the declaration's own
  offsets; `spanWithComments.start` extends backward to include leading
  doc comments contiguous with the declaration (§5). `exported` records
  whether the source wrapped it in `export`.
- `removeDeclaration(sourceText, span) → newText` — delete the span
  (including its `export` wrapper if present) and exactly one adjoining
  newline so no blank gap is left. Everything else byte-identical.
- `insertDeclaration(targetText, verbatimDecl) → newText` — append
  `export ` + the verbatim declaration after the last top-level
  statement, separated by one blank line.
- `addNamedImport(text, name, relativeSpecifier) → newText` — add
  `import { name } from "<spec>";`, merging into an existing import from
  the same specifier if one exists, else inserting a new import line
  after the last existing import.
- `stripReExport(text, name, fromSpecifier) → newText` — remove `name`
  from any `export { ... } from "<fromSpecifier>"` statement; delete the
  statement entirely if its list becomes empty; leave unrelated
  re-exports intact.
- `moveFunction(opts) → result` — the in-process orchestrator (so tests
  can drive a full move without a subprocess).

### 4.2 The move algorithm (single name, two files)

1. Read FROM and TO as raw strings; record originals for revert.
2. `locateDeclaration(FROM, name)` → abort if not found, or if more than
   one top-level declaration of `name` exists (ambiguous).
3. Collision check: abort if `name` is already declared **or** imported
   in TO (don't create a duplicate binding / duplicate export).
4. Extract `verbatimDecl = FROM.slice(spanWithComments.start, end)`.
5. `removeDeclaration(FROM, spanWithComments)`.
6. After removal, scan FROM for remaining references to `name` (§5
   reference scan). If any remain **and** no other binding of `name`
   exists in FROM, `addNamedImport` to FROM pointing at TO (compute the
   correct relative specifier from FROM's directory to TO). If a
   *different* binding of `name` already exists in FROM → abort and
   report (genuine ambiguity).
7. `insertDeclaration(TO, verbatimDecl)`.
8. `stripReExport(TO, name, <relative spec from TO to FROM>)` — if TO
   currently re-exports `name` from FROM (the alias-evasion artifact),
   remove that entry so the new real definition is the sole export.
9. Write FROM and TO. Run the verify command (§4.4). On failure,
   **revert both files to their recorded originals** and exit non-zero
   with the captured verify output. On success, print a summary and exit
   zero.

**Note:** step 9's verify will fail if `name` is imported by any module
*other than* FROM, because those imports still point at FROM which no
longer exports `name`. That is expected and correct in T1a — rewiring
external consumers is T1b. The T1a acceptance helper must therefore have
zero external consumers (§7, Layer 4).

### 4.3 Abort conditions (write nothing, exit non-zero, explain)

- `name` not found as a top-level declaration in FROM.
- Multiple top-level declarations of `name` in FROM (ambiguous).
- `name` already declared or imported in TO (collision).
- Parse error in FROM or TO.
- A remaining reference in FROM collides with a *different* existing
  binding of `name`.

Governing principle, mirroring the project's safety ethos: **the tool
never makes an edit it cannot guarantee is correct. Ambiguity is
reported, not guessed.** The verify gate (§4.4) backstops anything the
static analysis misses.

### 4.4 Verify gate

- Default verify command: `deno test -A test/` (the full JS suite).
- Overridable via `--verify-cmd "..."` for faster iteration; the default
  is the full suite and the tool prints which command it ran.
- The tool **must not** pass any skip-gate flag to the verify command
  and **must not** offer a silent `--no-verify`. A move either verifies
  green or is reverted.
- On failure: revert, surface captured stdout/stderr, exit non-zero.

### 4.5 Dry run

`--dry-run`: perform all analysis and compute the would-be file
contents, print a readable before/after (a minimal hand-rolled
changed-region print is fine — no diff dependency required) for FROM and
TO, write **nothing**, run **no** verify, exit zero.

---

## 5. Acorn usage notes

- Parse with `acorn.parse(text, { ecmaVersion: "latest", sourceType:
  "module", locations: true, onComment: comments })` where `comments` is
  an array you pass to collect comment nodes with `start`/`end`.
- Node ranges: acorn sets `node.start` / `node.end` (character offsets)
  by default — your slice bounds.
- Top-level declarations to handle:
  - `FunctionDeclaration` (incl. generator `function*`).
  - `VariableDeclaration` with a single `VariableDeclarator` whose `id`
    is the name (covers `const NAME = (...) => {...}`).
  - `ExportNamedDeclaration` wrapping either — unwrap to the inner
    declaration for the verbatim body, record `exported: true`, and use
    the outer `export ...` extent as the removal span.
- **Leading comments (byte-fidelity of the unit):** a helper's doc
  comment must travel with it. After locating the declaration, find
  comment nodes whose `end` is immediately before the declaration's
  `start` with only whitespace between (the contiguous comment block),
  and extend `spanWithComments.start` back to the first such comment's
  `start`. Test this explicitly — JSDoc on the real helpers is real and
  must not be orphaned.
- **Reference scan (step 6):** walk the AST for `Identifier` nodes whose
  `name` matches and which are in value position (not non-computed
  member-expression property keys, not object-literal keys). A simple
  recursive walk suffices for track B; do not count the declaration's
  own id or string contents.

---

## 6. (reserved — cross-file rewiring is specified in T1b)

---

## 7. Testing strategy (TDD-first, paired commits)

Tests live in `scripts/move-function.test.js`, run via `deno test -A
scripts/move-function.test.js`, using
`https://deno.land/std/assert/mod.ts`. The tool's own code must pass
`deno lint`.

Follow **TDD-first paired commits** (LEDGER_DISCIPLINE): per ledger row,
a test-only commit precedes the fix-only commit; the SHA boundary is
visible in `git log`. This is the methodology MUST established after M19
— do not combine test+fix, and do not let discipline degrade on later
rows (an M22 failure the audit flagged).

### Layer 1 — unit tests on the pure core (string in, string out)

- `locateDeclaration` finds: exported function; non-exported function;
  `export function*`; `export const NAME = (...) => ...`; returns null
  for absent names; reports `exported` correctly.
- `locateDeclaration` includes leading doc comments in `spanWithComments`
  (fixture with a `/** ... */` block immediately above the function).
- `removeDeclaration` leaves the rest byte-identical and removes exactly
  one adjoining newline (no blank gap).
- `addNamedImport` merges into an existing import from the same
  specifier; creates a new import line otherwise.
- `stripReExport` removes a name from `export { ... } from "..."`,
  deletes the statement when emptied, leaves unrelated re-exports
  intact.

### Layer 2 — end-to-end on temp fixtures (two files)

Drive `moveFunction(opts)` in-process. In a temp dir, write small FROM
and TO `.js` files, run the move, then assert:

- **Byte-identity invariant (§2):** the moved declaration's bytes in TO
  are identical to the original declaration's bytes in FROM.
- FROM no longer declares the name; gains a back-import iff a reference
  remained internally.
- TO exports the name exactly once (real def present; any alias
  re-export entry stripped).

### Layer 3 — abort + verify-gate behaviour

- Collision (name already in TO) → no files written, non-zero exit.
- Not found / ambiguous → no files written, non-zero exit.
- Verify-gate revert: craft a fixture and a `--verify-cmd` that exits
  non-zero; assert both touched files are restored to byte-original and
  the tool exits non-zero with the captured output.
- `--dry-run`: assert no file on disk changed and exit zero.

### Layer 4 — acceptance against the real corpus (zero-consumer helper)

On a **throwaway scratch branch** (this never lands as real extraction):

1. Grep `packages/lang/*.js` to select a `surface.js` helper that **no
   other module imports from `surface.js`** — preferably a
   *non-exported* internal helper (e.g. one of the param-parsing
   internals like `parseRestParam` / `parseDefaultParam` /
   `parseObjectDestructure`, *if* grep confirms zero external importers).
   A non-exported pick also exercises the "was not exported, gains
   `export` in TO" path. Record which helper you chose and the grep that
   proved zero external consumers.
2. Move it from `surface.js` to `surface-helpers.js` with the tool.
3. Run the **full** `deno test -A test/`. It must stay green (the
   within-`surface.js` back-import is the only rewiring needed, and the
   tool handles it).
4. `git reset --hard` / discard the scratch branch. No extraction lands.

`andChain` is **not** a valid T1a acceptance helper — `classifier.js`
imports it from `surface.js`, so its move requires consumer rewiring and
is reserved for T1b's acceptance.

---

## 8. Ledger (M22.5-T1a)

TDD-first paired commits. Each row: test-only commit, then fix-only
commit. `Verify` is grep-/run-verifiable.

| Row | Description | Verify |
|-----|-------------|--------|
| T1a-1 | Scaffold `scripts/move-function.js` (CLI arg parsing for `--from/--to/--name/--dry-run/--verify-cmd`, `import.meta.main` guard, invocation comment) + first failing `locateDeclaration` test. | `deno test -A scripts/move-function.test.js` shows the new test (red→green across the pair). |
| T1a-2 | `locateDeclaration` (all declaration shapes + leading-comment extension). | Layer-1 locate tests green. |
| T1a-3 | `removeDeclaration` + `insertDeclaration` (verbatim slice; byte-identity invariant). | Layer-1 + §2 invariant test green. |
| T1a-4 | `addNamedImport` + `stripReExport`. | Layer-1 import/re-export tests green. |
| T1a-5 | `moveFunction` orchestration (single name, two files) + Layer-2 temp-fixture tests + abort conditions (Layer 3, abort cases). | Layer-2 + abort tests green. |
| T1a-6 | Verify gate + auto-revert + dry-run (Layer 3 remainder). | Layer-3 verify/dry-run tests green. |
| T1a-7 | Acceptance: scratch-branch move of a zero-external-consumer helper, full suite green, scratch discarded. | `deno test -A test/` green on scratch; result + chosen helper + grep recorded. |
| T1a-8 | `deno lint scripts/` clean; closing notes. | `deno lint scripts/` exits 0. |

Iteration budget: genuine engineering, not compliance theatre — the
standing iteration-budget override applies. Progress over count.

---

## 9. Non-goals for T1a (deferred)

- **Cross-file consumer rewiring** across `packages/lang/*.js` — this is
  `M22.5-T1b`. T1a edits only the two named files.
- **Batch mode** (`--names`) — T1b.
- No TypeScript, no tsconfig, no build step.
- No `astring` regeneration of moved bodies, ever (§2).
- No scope-accurate rename/shadowing analysis — the simple identifier
  walk of §5 plus the verify gate is the track-B approach.
- No actual M22.5-2/-3 extraction. T1a builds and proves the core only.
- No MCP server / LSP / Tree-sitter — that's track C.

---

## 10. Methodology reminders

- **TDD-first paired commits**, SHA boundary visible in `git log`. Do not
  let discipline slip on later rows.
- **Surface design calls, don't decide silently.** `scripts/` vs
  `tools/` (§3) is one. If the comment-extension rule or reference-scan
  precision needs a judgment call on real code, raise it.
- **No evasion.** This tool's reason for existing is to make one evasion
  impossible; hold the tool's own implementation to the same standard.
  If a test is hard to pass, fix the tool — do not weaken the test.
- **Closing report:** end with an honest expected-vs-actual summary —
  what the core does, what it deliberately defers to T1b, which helper
  you used for the acceptance run and the grep proving zero external
  consumers, and any findings about `surface.js` structure that will
  matter for T1b and M22.5-2/-3 (entangled internal dependencies,
  unusual comment placement, anything that resisted a clean verbatim
  slice).

---

## 11. Acceptance criteria

Done when:

1. `scripts/move-function.js` exists, plain JS, `npm:acorn`-only, passes
   `deno lint`.
2. The §2 byte-identity invariant test passes.
3. Test layers 1–3 (§7) pass via `deno test -A
   scripts/move-function.test.js`.
4. The Layer-4 acceptance move of a zero-external-consumer helper kept
   `deno test -A test/` green on a scratch branch, and the scratch was
   discarded (no real extraction landed).
5. Ledger rows committed as TDD-first pairs with visible SHA boundaries.
6. A closing report with an honest expected-vs-actual summary is in
   `workbench/`.

Go.
