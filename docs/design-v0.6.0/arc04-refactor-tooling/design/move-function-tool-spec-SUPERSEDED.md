# M22.5-T1 Implementation Prompt: `move-function.js` (Tooling Track B)

> **SUPERSEDED (2026-05-23):** This combined prompt has been split into
> two sequential prompts and should **not** be handed to CC as-is. Use:
>
> - `M22.5-T1a-move-function-core-prompt-2026-05-23.md` — the verbatim-
>   move core (edits only the two named files), validated on a
>   zero-external-consumer helper.
> - `M22.5-T1b-move-function-rewiring-prompt-2026-05-23.md` — cross-file
>   consumer rewiring + batch mode, validated on the real `andChain`
>   move with the full suite green.
>
> Retained for the design reasoning and full spec context. The two split
> prompts are the authoritative instructions.

**From:** CDC (Cowork Claude, cdc/compiler-coherence thread)
**To:** CC (Claude Code, fresh session)
**Date:** 2026-05-23
**Branch:** `cdc/compiler-coherence` (worktree at `.worktrees/compiler-coherence/`)
**Re:** Build the byte-exact function-move tool that the M22.5 surface
extraction workstreams (M22.5-2, M22.5-3) will be executed *with*.

---

## 0. Read these first

Before writing any code, read, in order:

1. `workbench/2026-05-18-M22-audit-report.md` — the fresh-CC audit of
   M22's actual state. This is your function/line inventory and your
   acceptance corpus. Pay special attention to the per-helper table and
   the `surface.js` shape section (§C).
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

This is **track B** of a three-track tooling plan:

- **Track A** (done): manual moves under human supervision — slow,
  evasion-prone. This is what M22 was.
- **Track B** (this task): a tactical, single-purpose Deno/JS tool that
  performs verbatim moves with a verification gate. We will execute
  M22.5-2 and M22.5-3 *with* this tool and learn what a real refactoring
  engine needs.
- **Track C** (future): a custom MCP-powered refactoring server
  (Tree-sitter + LSP + verify primitives). Out of scope here; track B
  exists to inform its design.

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
behaviour preservation by inspection. The tool may use `astring` only if
it needs to *generate a brand-new import line* (and even then, hand-
writing the import string is preferred and simpler).

A dedicated test (see §7) asserts that the moved declaration's bytes are
identical to the original declaration's bytes (compare by SHA-256 or
strict string equality of the sliced spans). If that test cannot be made
to pass, the tool is wrong — fix the tool, do not weaken the test.

---

## 3. Placement, runtime, dependencies

- **File:** `scripts/move-function.js` (the project already keeps
  standalone Deno tooling in `scripts/` — see `scripts/bundle-size.js`
  for the established convention: top-of-file comment block stating the
  invocation, ESM, `npm:` bare imports).
  - *Design call (surface if you disagree):* `scripts/` vs a new
    `tools/`. CDC recommends `scripts/` for consistency with the
    existing `bundle-size.js` precedent and the lint config that already
    covers `scripts/`. If you have a reason to prefer `tools/`, surface
    it rather than deciding silently.
- **Runtime:** Deno. No Node.js (project rule).
- **Language:** plain JavaScript. **Do not introduce TypeScript** — it
  would add a third language to the toolchain (JS, Rust, +TS) for a tool
  whose only job is shuffling JS bodies, against Principle 2 (Lykn-only
  tooling). This was a deliberate CDC/Duncan decision.
- **Dependencies:** `npm:acorn` (imported directly as a bare specifier,
  exactly as `bundle-size.js` imports `npm:esbuild` — **no `project.json`
  import-map entry is needed**). Deno std (`jsr:@std/...` or
  `https://deno.land/std/...`, matching whatever the existing JS tests
  use — they use `https://deno.land/std/assert/mod.ts`) for the test
  assertions. Nothing else.
- **Permissions:** invoke with `-A` (matches `bundle-size.js`). The tool
  needs read, write, and run (it spawns the verify command).

Invocation shape:

```sh
deno run -A scripts/move-function.js \
  --from packages/lang/surface.js \
  --to   packages/lang/surface-helpers.js \
  --name andChain \
  [--names andChain,getLiteralType,...] \
  [--dry-run] \
  [--verify-cmd "deno test -A test/"]
```

---

## 4. Functional spec

### 4.1 Structure for testability

Structure the tool so its logic is a set of **pure, exported functions**
operating on strings, with a thin CLI wrapper (`if (import.meta.main)
{...}`) and a thin IO/subprocess layer. The pure core is what the unit
tests in §7 exercise directly. Suggested (not mandatory) core surface:

- `locateDeclaration(sourceText, name) → { start, end, exported, kind,
  spanWithComments } | null` — parse with acorn, find the top-level
  `function` / `function*` / `const` declaration named `name` (unwrap a
  surrounding `export`). `start`/`end` are the offsets of the
  declaration itself; `spanWithComments` extends `start` backward to
  include leading doc comments contiguous with the declaration (see
  §6). `exported` records whether the source wrapped it in `export`.
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
- `rewriteImportSource(text, name, oldSpecifier, newSpecifier) →
  newText` — move `name` out of the import-from-`oldSpecifier` and into
  an import-from-`newSpecifier` (merging or creating as needed). Used for
  consumer files (§5).
- `stripReExport(text, name, fromSpecifier) → newText` — remove `name`
  from any `export { ... } from "<fromSpecifier>"` statement; delete the
  statement entirely if its list becomes empty. Used to clean the
  `surface-helpers.js:52` alias re-export when a real definition arrives.

### 4.2 The move algorithm (single name)

1. Read FROM and TO as raw strings; record originals for revert.
2. `locateDeclaration(FROM, name)` → abort if not found, or if more than
   one top-level declaration of `name` exists (ambiguous).
3. Collision check: abort if `name` is already declared **or** imported
   in TO (don't create a duplicate binding / duplicate export).
4. Extract `verbatimDecl = FROM.slice(spanWithComments.start, end)`.
5. `removeDeclaration(FROM, spanWithComments)`.
6. After removal, scan FROM for remaining references to `name`
   (identifier uses, excluding the now-deleted declaration and excluding
   property keys / shorthand that aren't the binding). If any remain
   **and** no other binding of `name` exists in FROM, `addNamedImport`
   to FROM pointing at TO (compute the correct relative specifier from
   FROM's directory to TO). If a *different* binding of `name` already
   exists in FROM → abort and report (genuine ambiguity).
7. `insertDeclaration(TO, verbatimDecl)`.
8. `stripReExport(TO, name, <relative spec from TO to FROM>)` — if TO
   currently re-exports `name` from FROM (the alias-evasion artifact),
   remove that entry so the new real definition is the sole export.
9. Consumer rewiring (§5): for every other module under
   `packages/lang/*.js` that imports `name` from FROM, rewrite that
   import to point at TO.
10. Write all modified files. Run the verify command (§4.4). On failure,
    **revert every file to its recorded original** and exit non-zero
    with the captured verify output. On success, print a summary and
    exit zero.

### 4.3 Abort conditions (write nothing, exit non-zero, explain)

- `name` not found as a top-level declaration in FROM.
- Multiple top-level declarations of `name` in FROM (ambiguous).
- `name` already declared or imported in TO (collision).
- Parse error in any file the tool must read.
- A remaining reference in FROM collides with a *different* existing
  binding of `name` (can't safely add the back-import).

The governing principle, mirroring the project's safety ethos: **the
tool never makes an edit it cannot guarantee is correct. Ambiguity is
reported, not guessed.** The verify gate (§4.4) is the backstop for
anything the static analysis misses.

### 4.4 Verify gate

- Default verify command: `deno test -A test/` (the full JS suite).
- Overridable via `--verify-cmd "..."` for faster iteration on a
  subset, but the default is the full suite and the tool prints which
  command it ran.
- The tool **must not** pass any skip-gate flag to the verify command
  and **must not** offer a silent `--no-verify`. A move either verifies
  green or is reverted. (This is the §0(3) safety-gate spirit.)
- On failure: revert, surface the captured stdout/stderr, exit non-zero.

### 4.5 Dry run

`--dry-run`: perform all analysis and compute the would-be file
contents, print a readable diff (a minimal hand-rolled before/after or
changed-region print is fine — no diff dependency required) for every
file that would change, write **nothing**, run **no** verify, exit zero.

### 4.6 Batch mode

`--names a,b,c`: process names left-to-right, each as an **atomic
move+verify** (move one, verify, keep if green). Stop on the first
failure (after reverting that one move) and report which name failed.
Atomic-per-name is the default because it gives clean bisection when a
dependency ordering is wrong. (A `--batch-verify-once` flag that defers
verification to the end is optional and may be deferred to track C.)

---

## 5. Consumer import rewiring (the cross-file part)

This is the capability that makes the tool actually usable on M22.5-2.
Per the audit, helpers like `buildTypeCheck` are imported **directly
from `surface.js` by `classifier.js` (line 8)** *and* alias-re-exported
by `surface-helpers.js:52`. If the tool moves `buildTypeCheck` to
`surface-helpers.js` but leaves `classifier.js` importing it from
`surface.js`, the suite goes red and the move reverts — making the tool
useless for exactly our case.

So the tool must, as part of a move FROM→TO:

- Glob `packages/lang/*.js` (excluding TO and FROM themselves).
- For each module, parse and find any `ImportDeclaration` whose resolved
  source is FROM and whose specifiers include `name`.
- `rewriteImportSource(...)` so that `name` is imported from TO instead
  (merge into an existing import-from-TO if present; otherwise create
  one; drop `name` from the import-from-FROM, deleting that import if it
  becomes empty).

Every edit here is a mechanical specifier/string change — no call sites
move, because the imported binding name is unchanged. The test suite is
the backstop. Resolve "is this import's source FROM?" by path, not by
raw string match, so `"./surface.js"` from different directories
resolves correctly.

**Scope boundary:** the tool rewires imports *of the moved name from
FROM*. It does **not** attempt to rewrite transitive re-export chains
beyond the single `stripReExport` in §4.2 step 8. If a module imports
`name` from a *re-exporter* (e.g. from `surface-helpers.js`) rather than
from FROM, it is unaffected and correctly left alone — the re-exporter
still exports `name` (now via the real definition).

---

## 6. Acorn usage notes

- Parse with `acorn.parse(text, { ecmaVersion: "latest", sourceType:
  "module", locations: true, onComment: comments })` where `comments` is
  an array you pass to collect comment nodes with their `start`/`end`.
- Node ranges: acorn sets `node.start` / `node.end` (character offsets)
  by default. These are your slice bounds.
- Top-level declarations to handle:
  - `FunctionDeclaration` (incl. generator `function*`).
  - `VariableDeclaration` with a single `VariableDeclarator` whose `id`
    is the name (covers `const NAME = (...) => {...}` arrow consts).
  - `ExportNamedDeclaration` wrapping either of the above — unwrap to the
    inner declaration for the verbatim body, but record `exported: true`
    and treat the *outer* `export ... ` extent as the removal span.
- **Leading comments (important for byte-fidelity of the unit):** a
  helper's doc comment must travel with it. After locating the
  declaration, find comment nodes whose `end` is immediately before the
  declaration's `start` with only whitespace (and no blank line, or at
  most the contiguous comment block) between them, and extend
  `spanWithComments.start` back to the first such comment's `start`.
  Test this explicitly (§7) — JSDoc on `buildTypeCheck`/`compilePattern`
  is real and must not be orphaned.
- Reference scan (§4.2 step 6): walk the AST for `Identifier` nodes whose
  `name` matches and which are in value position (not property keys of
  non-computed member expressions, not object-literal keys). A simple
  recursive walk is fine; you do not need full scope analysis for track
  B, but you must not count the declaration's own id or string contents.

---

## 7. Testing strategy (TDD-first, paired commits)

Tests live in `scripts/move-function.test.js`, run via `deno test -A
scripts/move-function.test.js`, using the same assertion import the
existing JS tests use (`https://deno.land/std/assert/mod.ts`). The
tool's own code must pass `deno lint`.

Follow **TDD-first paired commits** (LEDGER_DISCIPLINE): for each ledger
row, a test-only commit precedes the fix-only commit; the SHA boundary
must be visible in `git log`. This is the methodology MUST established
after M19 — do not combine test+fix into one commit, and do not let
discipline degrade on the later rows (that was an M22 failure the audit
flagged).

### Layer 1 — unit tests on the pure core (string in, string out)

- `locateDeclaration` finds: exported function; non-exported function;
  `export function*`; `export const NAME = (...) => ...`. Returns null
  for absent names.
- `locateDeclaration` reports `exported` correctly and includes leading
  doc comments in `spanWithComments` (fixture with a `/** ... */` block
  immediately above the function).
- `removeDeclaration` leaves the rest of the file byte-identical and
  removes exactly one adjoining newline (no blank-gap).
- `addNamedImport` merges into an existing import from the same
  specifier; creates a new import line otherwise; computes/accepts the
  right relative specifier.
- `rewriteImportSource` moves a name between import sources, deleting an
  emptied import.
- `stripReExport` removes a name from an `export { ... } from "..."`
  list and deletes the statement when the list empties; leaves unrelated
  re-exports intact.

### Layer 2 — end-to-end on temp fixtures

Expose an in-process `moveFunction(opts)` so tests can drive a full move
without spawning a subprocess. In a temp dir, write small FROM / TO /
consumer `.js` files, run `moveFunction`, then assert:

- The moved declaration's bytes in TO are **identical** to the original
  declaration's bytes in FROM (slice-equality or SHA-256 — this is the
  invariant test from §2).
- FROM no longer declares the name; gains a back-import iff a reference
  remained.
- TO exports the name exactly once (real def present, alias re-export
  entry stripped).
- A consumer that imported the name from FROM now imports it from TO.
- A consumer that imported the name from a re-exporter is untouched.

### Layer 3 — abort + verify-gate behaviour

- Collision (name already in TO) → no files written, non-zero exit.
- Not found / ambiguous → no files written, non-zero exit.
- Verify-gate revert: craft a fixture and a `--verify-cmd` that exits
  non-zero; assert all touched files are restored to byte-original and
  the tool exits non-zero with the captured output.
- `--dry-run`: assert no file on disk changed and exit zero.

### Layer 4 — acceptance against the real corpus

On a **throwaway scratch branch** (so this never lands as real M22.5-2
work): move one small real helper — `andChain` (surface.js, ~9 lines,
clean boundary) — from `surface.js` to `surface-helpers.js`, let the
tool rewire `classifier.js`, and run the **full** `deno test -A test/`.
It must stay green. Then `git reset --hard` / discard the scratch
branch. Record the result in the ledger row's Verify output. This proves
the tool works on real code before we trust it with M22.5-2/-3.

---

## 8. Ledger (M22.5-T1)

TDD-first paired commits. Each row: test-only commit, then fix-only
commit. `Verify` is grep-/run-verifiable.

| Row | Description | Verify |
|-----|-------------|--------|
| T1-1 | Scaffold `scripts/move-function.js` (CLI arg parsing, `import.meta.main` guard, top-of-file invocation comment) + first failing test for `locateDeclaration`. | `deno test -A scripts/move-function.test.js` shows the new test (red→green across the pair). |
| T1-2 | `locateDeclaration` (all declaration shapes + leading-comment extension). | Layer-1 locate tests green. |
| T1-3 | `removeDeclaration` + `insertDeclaration` (verbatim slice; byte-identity test). | Layer-1 + the §2 invariant test green. |
| T1-4 | `addNamedImport`, `rewriteImportSource`, `stripReExport`. | Layer-1 import/re-export tests green. |
| T1-5 | `moveFunction` end-to-end orchestration (single name) + Layer-2 temp-fixture tests. | Layer-2 tests green. |
| T1-6 | Verify gate + auto-revert + dry-run + abort conditions (Layer 3). | Layer-3 tests green. |
| T1-7 | Consumer rewiring across `packages/lang/*.js` (§5) + batch mode. | Layer-2 consumer test + batch test green. |
| T1-8 | Acceptance: scratch-branch `andChain` move, full suite green, then discard scratch. | `deno test -A test/` green on scratch; scratch discarded; result recorded. |
| T1-9 | `deno lint scripts/` clean; closing notes. | `deno lint scripts/` exits 0. |

Iteration budget: this is genuine engineering, not compliance theatre —
the standing iteration-budget override applies. Progress over count.

---

## 9. Non-goals (do not build these here)

- No TypeScript, no tsconfig, no build step for the tool.
- No auto-rewriting of transitive re-export chains beyond the single
  `stripReExport` in §4.2 step 8.
- No scope-accurate rename/shadowing analysis — track-B reference
  detection is the simple identifier walk of §6; the verify gate
  backstops it.
- No `astring` regeneration of moved bodies, ever (see §2).
- No actual M22.5-2/-3 moves. This task builds and proves the tool only.
  The real extraction workstreams come next, as separate prompts.
- No MCP server, no LSP, no Tree-sitter — that's track C.

---

## 10. Methodology reminders

- **TDD-first paired commits**, SHA boundary visible in `git log`. Do not
  let discipline slip on the later rows.
- **Surface design calls, don't decide silently.** The `scripts/` vs
  `tools/` placement (§3) is one. If the comment-extension rule or the
  reference-scan precision turns out to need a judgment call on real
  code, raise it.
- **No evasion.** This tool's entire reason for existing is to make a
  particular evasion impossible; the tool's own implementation must be
  held to the same standard. If a test is hard to pass, fix the tool —
  do not weaken the test.
- **Closing report:** end with an honest expected-vs-actual summary —
  what the tool does, what it deliberately does not do, any abort
  conditions you hit on the real `andChain` acceptance run, and any
  findings about surface.js's structure that will matter for M22.5-2/-3
  (e.g. helpers with entangled internal dependencies, unusual comment
  placement, anything that resisted a clean verbatim slice).

---

## 11. Acceptance criteria

The task is done when:

1. `scripts/move-function.js` exists, plain JS, `npm:acorn`-only, passes
   `deno lint`.
2. The §2 byte-identity invariant test passes.
3. All four test layers (§7) pass via `deno test -A
   scripts/move-function.test.js`.
4. The Layer-4 acceptance move of `andChain` kept `deno test -A test/`
   green on a scratch branch, and the scratch was discarded (no real
   extraction landed).
5. The ledger rows are committed as TDD-first pairs with visible SHA
   boundaries.
6. A closing report with an honest expected-vs-actual summary is written
   to `workbench/`.

Go.
