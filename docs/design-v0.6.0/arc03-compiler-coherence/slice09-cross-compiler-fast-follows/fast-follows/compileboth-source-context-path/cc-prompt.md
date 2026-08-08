# compileBoth Fast-Follow Implementation Prompt for CC — `--source-context-path` Flag

## Read this first

The M16 closure surfaced a limitation in `compileBoth` (the
cross-compiler testing helper at `packages/testing/helpers.js`):
when source contains `(import-macros "./packages/testing" ...)` or
similar relative-path imports, the Rust compiler resolves those
paths relative to the *temp file's location* (in `$TMPDIR`), not
the project root. As a result, `compileBoth` cannot test sources
with relative-path imports — and CC's M16-6 test had to fall back
to JS-only compilation plus Rust-side unit tests to cover that
case (which is correct but not parity).

The fix: add a `--source-context-path <PATH>` flag to the Rust
`lykn compile` subcommand. The flag tells the compiler "treat this
source as if it lives at `<PATH>`" for the purpose of relative-path
resolution, decoupling source content from on-disk location.
`compileBoth` then passes the project root (or `Deno.cwd()`) as the
context path when shelling out.

This is option (2) from the CDC scoping conversation — the
architecturally clean fix. Option (1) (write temp files at project
root) was an alternative for a 0.6.0 minimum-change but was rejected
in favour of (2) as the durable solution.

The plumbing is already mostly in place on the Rust side:
`compile_source(source, file_path: Option<&Path>, ...)` takes a
`file_path` that's threaded down to `expander::expand` and then to
pass0's relative-path resolution. This work adds the CLI flag, routes
it into that existing `file_path` slot when set, and updates
`compileBoth` to use it.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code** and follow its CC protocol throughout. The protocol's
  named failure mode is *compliance theatre*. The acceptance criteria
  below have grep-verifiable Verify commands; meet them as written,
  not as paraphrased.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`: subagents for lookup
  only (grep, find call sites). Design and judgment in main context.
- **You MUST stop and surface on dissonance.** If any acceptance
  criterion is wrong, impossible, or supersedable, raise it as an
  amendment request before working around it.
- **You MUST NOT auto-pass safety-bypass flags** to underlying tools
  per AGENTS.md "Lykn CLI safety gates."
- **You MUST preserve backward compatibility.** When
  `--source-context-path` is *not* set, all existing behaviour stays
  identical. The flag's absence routes through the unchanged code
  path. No test that passes today may regress.

---

## Required reading (before writing any code)

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/AGENTS.md` "Lykn CLI safety gates"
4. `packages/testing/helpers.js` — the current `compileBoth`
   implementation
5. `crates/lykn-cli/src/main.rs` `Compile` subcommand clap setup
   (search for `/// Compile .lykn to JavaScript`)
6. `crates/lykn-cli/src/compile.rs` — `compile_file` and
   `compile_source` signatures
7. `crates/lykn-lang/src/expander/pass0.rs` lines 215–255 — where
   `file_path` is used for relative-path resolution

---

## Pre-solved obstacles

### Obstacle 1 — `file_path` is already the right plumbing

You do NOT need to thread a new parameter through the expander.
`expander::expand(forms, file_path, imports)` already takes
`file_path: Option<&Path>`, and pass0 uses it for relative-path
resolution at lines 226 and 250. The fix is:

- At the CLI layer (main.rs / compile.rs), when
  `--source-context-path` is set, build a synthetic
  `file_path: PathBuf` that points at `<context-path>/<source-file-name>`
  (or just the context-path with a generic filename like
  `__compileBoth__.lykn`).
- Pass that synthetic path to `compile_source` instead of the
  actual temp file path.

The expander resolves `fp.parent().unwrap_or(Path::new("."))` from
`file_path`, so as long as `file_path.parent()` is the directory the
user wants relative imports resolved from, the existing code does the
right thing.

### Obstacle 2 — Existing call sites pass `Some(path)` from the actual file

`cmd_compile` in `main.rs` constructs a `PathBuf` from the user-
supplied file arg and passes it down. After the fix, `cmd_compile`
needs to decide: if `--source-context-path` is set, use a synthetic
path with `context_path` as the parent; otherwise, use the actual
file path. The decision is local to `cmd_compile`; downstream
functions don't change signatures.

If you find yourself wanting to add a `context_path: Option<&Path>`
parameter to `compile_source` or `compile_file`, **stop and surface**.
The cleaner shape is to resolve the path-decision at the CLI layer
and pass a single `file_path` downstream.

### Obstacle 3 — The flag must apply to other subcommands that resolve relative imports

`lykn run` and `lykn test` also invoke the compiler. They take real
files (not in-memory sources), so they typically don't need
`--source-context-path`. **Scope-bound this fix to `lykn compile`
only.** If other subcommands need a similar flag later, that's
follow-up work; do not silently add it to other clap definitions.

### Obstacle 4 — The compileBoth JS side decides what to pass

`compileBoth` runs in Deno; `Deno.cwd()` returns the directory where
the test process was launched. For `lykn test`-driven test runs,
that's the project root. The simplest fix:

```js
const projectRoot = Deno.cwd();
const proc = new Deno.Command(lyknBin, {
  args: ["compile", "--source-context-path", projectRoot, tmpPath],
  ...
}).outputSync();
```

This passes the project root as the context, so relative imports in
source resolve from project root regardless of where the temp file
sits.

### Obstacle 5 — Existing tests cover the no-flag path

You do NOT need to add a separate "without the flag" regression test.
The full existing test suite (`make test`, `make test-lykn`) covers
the no-flag path; if any of those fail post-change, the backward-
compat invariant is broken.

---

## Implementation steps (ordered)

1. **Read the required materials.** Especially the pass0 resolution
   code (lines 215–255), so you understand what `file_path.parent()`
   does and why a synthetic path with the right parent works.

2. **Add the CLI flag.** In `crates/lykn-cli/src/main.rs`, the
   `Compile` clap variant gains a new field:
   ```rust
   /// Resolve relative imports in source relative to this path
   /// instead of the source file's actual location. Used by
   /// cross-compiler testing helpers (e.g., compileBoth) where the
   /// source is in a temp file but should compile as if it lives in
   /// the project root.
   #[arg(long, value_name = "PATH")]
   source_context_path: Option<PathBuf>,
   ```

3. **Route the flag in `cmd_compile`.** When `source_context_path`
   is set:
   - Construct a synthetic path: `context_path.join("__compileBoth__.lykn")`
     (or any stable synthetic filename — the basename doesn't
     matter, only the parent directory)
   - Read the source from the actual `file` arg (unchanged)
   - Call `compile_source(&source, Some(&synthetic_path), ...)`
     instead of `Some(&file)`
   
   When `source_context_path` is None: existing behaviour preserved.

4. **Update `compileBoth` in `packages/testing/helpers.js`.** Pass
   `--source-context-path <projectRoot>` as the first arg pair, then
   the tmp path. Use `Deno.cwd()` as the project root.

5. **Update the M16-6 test** (`test/forms/dd-52-import-path-convergence_test.lykn`).
   Convert from JS-only `compile` to `compile-both`. Remove the
   "Note on compileBoth limitation" comment from the file — the
   limitation is now fixed.

6. **Update `compileBoth`'s docstring.** Replace the (implicit)
   "cannot test relative-path imports" limitation note with the
   actual behaviour: "Passes `Deno.cwd()` as `--source-context-path`
   to the Rust binary so relative imports in source resolve from
   project root regardless of the temp file's location."

7. **Run the full test suites:**
   - `cargo test -p lykn-cli` — Rust CLI tests
   - `cargo test -p lykn-lang` — Rust library tests
   - `make test-lykn` — surface tests
   - `make test` — full suite

---

## Acceptance criteria (per-row, grep-verifiable)

| ID | Criterion | Verify |
|----|-----------|--------|
| F-1 | `--source-context-path` flag exists on `lykn compile` | `./bin/lykn compile --help 2>&1 \| grep -c "source-context-path"` returns ≥1 |
| F-2 | Flag is plumbed through to `compile_source` via synthetic path; `compile_source` signature unchanged | `grep -E "fn compile_source\(\s*source:" crates/lykn-cli/src/compile.rs` shows the same signature as pre-change (no new parameters); AND `grep "source_context_path" crates/lykn-cli/src/main.rs` returns ≥1 match in `cmd_compile` (the routing logic) |
| F-3 | `compileBoth` passes `--source-context-path` with `Deno.cwd()` | `grep -c "source-context-path" packages/testing/helpers.js` returns 1; AND the line uses `Deno.cwd()` (verified by reading) |
| F-4 | M16-6 test now uses `compile-both` (cross-compiler verification) | `grep -c "compile-both" test/forms/dd-52-import-path-convergence_test.lykn` returns ≥1; AND `grep -c "compileBoth cannot test" test/forms/dd-52-import-path-convergence_test.lykn` returns 0 (stale limitation comment removed) |
| F-5 | The flag's absence preserves existing behaviour | `make test` and `make test-lykn` both exit 0 with same pass counts as pre-change (post-M16 baseline: 1071 Rust, 292 surface, 666 forms) |
| F-6 | A new Rust unit test in `compile.rs` covers the `--source-context-path` code path | `grep -c "source_context_path\|context_path" crates/lykn-cli/src/compile.rs` shows the test, OR a new `#[test]` function name signals the test exists. Test exercises: synthetic-path branch sets the right `file_path.parent()` |
| F-7 | `compileBoth`'s docstring updated to reflect new behaviour, not the old limitation | `grep -c "cannot test import-macros" packages/testing/helpers.js` returns 0; AND `grep -c "source-context-path" packages/testing/helpers.js` returns ≥1 (mentioned in docs comment) |
| F-8 | Single coherent commit chain | `git log --grep="source-context-path\|compileBoth" --oneline` returns ≥1 commit |

---

## Forbidden patterns

- **Do NOT add `context_path: Option<&Path>` as a new parameter to
  `compile_source`, `compile_file`, or `expander::expand`.** The
  decision is local to `cmd_compile`; the downstream signature is
  unchanged. (If you find yourself wanting to add the parameter,
  stop and surface — the synthetic-path approach is the cleaner
  shape per Obstacle 2.)
- **Do NOT silently extend the flag to `lykn run` or `lykn test`.**
  Scope is `lykn compile` only. (If a different subcommand needs
  it later, that's a separate change.)
- **Do NOT remove the temp-file machinery from `compileBoth`.**
  Stdin support is a separate orthogonal improvement; this change
  keeps temp files and just fixes their addressing-by-the-Rust-compiler.
- **Do NOT touch `expander::expand` or pass0's resolution logic.**
  The existing `file_path` plumbing is correct; this change reuses
  it. If anything in pass0 needs changing, stop and surface.
- **Do NOT auto-accept any insta snapshot diffs.** Per AGENTS.md
  "Snapshot testing." Manual review only.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-compileboth-source-context-path-closing-report.md`. The
closing report MUST:

1. Walk each F-1 through F-8 row with the final status (`done` /
   `deferred` / `no-op`) and the Verify command output as evidence.
   No prose summary; per-row walk.
2. Name the synthetic-path naming choice explicitly (e.g.
   `__compileBoth__.lykn` or whatever you pick) and explain why
   the parent matters but the basename doesn't.
3. Include a "Substrate-rule compliance" section addressing the
   four most-relevant rules (AGENTS.md safety gates, LEDGER_DISCIPLINE
   no-silent-rewrite, backward-compatibility invariant, partial-
   adoption check).
4. Include a "Findings for fast-follow" section if any genuine
   findings surface (e.g., orthogonal limitations discovered, naming
   inconsistencies, etc.). If none, say so explicitly.
5. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to add stdin support to the Rust CLI. That's an
  orthogonal future change.
- You do not need to fix the 9 formatting-class divergences logged
  as M16-2 fast-follow. Those are separate.
- You do not need to extend the flag to `lykn run` or `lykn test`.
  Scope is `lykn compile`.
- You do not need to touch DD-37 or DD-58. Both are CDC-side work.

---

## Iteration budget

**5 iterations.** Expected 1–2 since the plumbing already exists
and the fix surface is small. If you reach iteration 5 without
convergence, stop. Rework scope or surface a methodology question.

---

## Start

Once you've read the required materials, begin at implementation
step 1 (read pass0 resolution code) and proceed in order. Surface
anything that looks off before working around it.
