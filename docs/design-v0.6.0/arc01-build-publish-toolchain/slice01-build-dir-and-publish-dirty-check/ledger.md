# Milestone M11+M13: Build-Dir Reorganization + `lykn publish` Dirty-Check

> **Status:** open
> **Iteration budget:** 5 (expect 3–4)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (session that drafted this ledger)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** [phase-2-plan.md](../phase-2-plan.md), [philosophy.md](../../docs/philosophy.md)
> **Thread origin:** [`workbench/kickoff-thread-build-dir-and-publish-dirty-check.md`](../kickoff-thread-build-dir-and-publish-dirty-check.md)
> **Predecessor:** M7 closed 2026-05-10 (`f9b647a`); DD-50.6 fast-follow active on `release/0.6.x`

---

## Why this milestone exists

Two 0.6.0 commitments from `docs/philosophy.md` `§0.6.0 commitments` land in this milestone:

- **Build-dir reorganization (M11).** Move all build artifacts under
  `target/lykn/build/` (intermediate compiler output) and `target/lykn/dist/`
  (publish-ready staging), matching Rust's `target/` discipline. This closes
  multiple Phase 1 Known Violations: `.js` files in source tree, scaffold
  `.gitignore` gaps, and `deno.json` `exports` references pointing at source-
  tree siblings.
- **`lykn publish` uncommitted-changes check (M13).** Refuse to publish when
  the working tree has uncommitted changes or untracked files. Provide
  `--allow-dirty` opt-in override. Materializes the lykn-level half of the
  CLAUDE.md "Lykn CLI safety gates" rule: the lykn CLI owns its own gate at
  the surface, and never auto-passes safety-bypass flags to underlying tools.

These two milestones are bundled because they (a) both touch
`crates/lykn-cli/` and only `crates/lykn-cli/`, (b) are conceptually coupled
— M11's gitignored `target/lykn/dist/` means `deno publish` against a
gitignored staged tree never sees the user's source git state, so M13's
lykn-level gate is the *only* gate the user feels, and (c) fit together
within the 5-iteration budget (M11 ≈ 3 iters, M13 ≈ 1 iter, with shared
setup and substrate-rule disclosure work).

If scope grows mid-flight, M13 can be split into a separate ledger without
rewriting M11's work.

---

## What this milestone produces

1. `lykn build` and `lykn dist` as cleanly-separated subcommands, with
   distinct output paths (`target/lykn/build/<pkg>/` and
   `target/lykn/dist/<pkg>/`). `lykn build --dist` continues to work as a
   deprecation-aliased command (warning emitted, removal in 0.7.0).
2. Compile output relocated out of the source tree: no `.js` files appear
   in `packages/<pkg>/` after a fresh `lykn build`.
3. `project.json` workspace `imports` repointed at the build intermediate
   so local-dev imports (`lang/reader.js`, `testing/...`) continue to
   resolve. `lykn test` exits 0 against the new layout.
4. `lykn new` scaffold templates updated: `.gitignore` covers `target/`,
   workspace `project.json` `imports` reference the new layout, per-package
   `deno.json` `exports` unchanged (semantically becomes a staging template).
5. `lykn publish` (both `--jsr` and `--npm`) refuses to ship on a dirty
   tree by default; emits a Cargo-style error pointing the user at
   `git status`, commit/stash, or `--allow-dirty`.
6. `--allow-dirty` flag added to `lykn publish`. When set, the lykn-level
   gate is bypassed. The flag is **not** auto-passed to underlying
   `deno publish` / `npm publish` invocations — the user's relationship
   with those tools' gates is independent.
7. `docs/philosophy.md` "Known violations" entries closed (or moved to a
   "Resolved" subsection) for the items M11 fixes.
8. Insta snapshot review notes for any snapshots whose generated-output
   changes as a result of M11. **No auto-accept.**

This milestone does **not**:

- Implement `lykn migrate` or any auto-migration tool for existing 0.5.x
  scaffolded projects. Migration is documented in 0.6.0 release notes;
  users hand-edit or re-scaffold.
- Add a Lykn-source linter (M12 — separate thread).
- Ship 0.6.0 itself (M15 — separate milestone).
- Touch the JS compiler (`packages/lang/`) or any compiler-internals work.

---

## Design dispositions (carried forward from CDC scope analysis)

These were settled in the CDC thread that drafted this ledger. Recorded
here so CC has the dispositions in-context without needing to re-derive.

**M11 dispositions:**

1. **Subdirectory layout.** Per-package subdirs under
   `target/lykn/build/<pkg>/` and `target/lykn/dist/<pkg>/`, mirroring the
   existing `dist/<pkg>/` shape. Minimal disruption to staging logic.
2. **Command naming.** Four-way split:
   - `lykn compile <file>` — single-file primitive. Unchanged behaviour
     (default stdout; `-o <path>` writes to path).
   - `lykn build` — whole-project compile to `target/lykn/build/<pkg>/`.
     This is the local-dev compile-all step that makes `lykn test` and
     `lykn run` work after a fresh clone.
   - `lykn dist` — whole-project staging to `target/lykn/dist/<pkg>/`.
     Renamed from `lykn build --dist`. Produces ship-ready package trees
     with generated `deno.json` / `package.json` / `.d.ts` stubs and import
     rewrites.
   - `lykn publish --jsr|--npm` — depends on `lykn dist` having run.
     Transparently invokes `lykn dist` if `target/lykn/dist/` is stale or
     absent (matching the current pattern in `dist.rs:compile_lykn_sources`
     where staleness is checked per source/output mtime).
3. **No user override.** No `--out <path>` flag in 0.6.0. The philosophy
   doc commits to a specific layout; an escape hatch dilutes it. Add only
   when a real downstream user demands it.
4. **`exports` field convention.** Source per-package `deno.json` `exports`
   stays unchanged (still `./mod.js` etc.). Semantically it is a **template
   for the staged package's `exports`**, not a local-dev resolution config.
   The path `./mod.js` is relative to the staged tree (where `mod.js` is
   generated as a sibling of the generated `deno.json`), not relative to
   the source location. `dist.rs:write_deno_json` already copies this value
   verbatim into the staged `deno.json`.

   Local-dev resolution flows entirely through `project.json` `imports`,
   which gets repointed at `./target/lykn/build/<pkg>/`.
5. **Sequencing against in-flight branches.** No coordination needed.
   Other worktrees (`m12-linter`, `cdc-dep-ergonomics`, `compiler-coherence`,
   plus the main checkout's DD-50.6 fast-follow) are in planning/
   investigation mode, not coding. M11 lands against whatever
   `release/0.6.x` head exists at coding time.
6. **Snapshot review.** Manual review per CLAUDE.md "Snapshot testing"
   rule. `cargo insta review` only; **never `cargo insta accept`**.

**M13 dispositions:**

1. **Definition of "dirty".** Tracked-modified + untracked + staged-but-
   uncommitted, all block. Matches `cargo publish --allow-dirty` semantics.
   No "publish surface" carve-out — uncommitted `docs/` changes block too.
   Simple to explain, simple to implement.
2. **Submodules.** No-op (lykn has no submodules).
3. **Error message wording.** Cargo-style. Format:

   ```
   error: lykn publish: working tree has uncommitted changes

   The following files have uncommitted modifications:

     M crates/lykn-cli/src/main.rs
     ?? packages/foo/bar.lykn

   Commit or stash these changes, or pass --allow-dirty to proceed anyway.
   ```

   Two-section: status header + file list + actionable footer. Status
   prefix codes (`M`, `??`, `A`, `D`, `R`, etc.) come straight from
   `git status --porcelain` output, no re-translation.
4. **`--allow-dirty` behaviour.** Proceeds as if clean. **No auto-injection
   to underlying tools.** If `deno publish` then fires its own dirty-gate
   (e.g., because the staged dist tree is also "dirty" from a deno
   perspective), that is a separate gate the user must resolve
   independently. The lykn-level gate runs first; the underlying gate runs
   second; neither auto-passes anything to the other.

   See CLAUDE.md "Lykn CLI safety gates" — this is the materialization of
   the rule's lykn-level half. The rule's underlying-tool half (don't
   auto-pass `--allow-dirty` to `deno publish` / `cargo publish` /
   `npm publish`) is already in place in the current `cmd_publish` and
   must be preserved.
5. **Detached HEAD.** Pass (not blocked). What matters is whether the
   source tree matches `HEAD`, not whether `HEAD` is a named branch.
6. **Out of scope.** Verifying that `HEAD` is tagged, pushed, signed, or
   anything else about its provenance. M13 just answers "does on-disk
   match committed."

**Deprecation alias format:**

```
warning: `lykn build --dist` is deprecated; use `lykn dist` instead.
         This alias will be removed in lykn 0.7.0.
```

Emitted to stderr, single warning per invocation, command proceeds.

---

## Source materials (read in this order)

1. `assets/ai/LEDGER_DISCIPLINE.md` — protocol (mandatory)
2. `assets/ai/CLAUDE.md` **"Lykn CLI safety gates" section** — load-bearing
   for M13. The rule materialization is what M13 *is*.
3. `assets/ai/CLAUDE.md` **"Snapshot testing (insta)" section** — load-
   bearing for M11. Manual review only.
4. `docs/philosophy.md` `§0.6.0 commitments` — the contract M11 and M13
   are paying off.
5. `docs/philosophy.md` `§Known violations` — the entries M11 closes.
6. `docs/philosophy.md` `§Decided design questions` #1 (build-artifact
   directory) and #4 (JSR-publishing-only-via-lykn-publish, with 0.6.0
   uncommitted-changes-check enhancement).
7. `workbench/phase-2-plan.md` `§Scope (in)` — M11 and M13 entries; the
   phase-2 methodology improvements section (#1 substrate-rule compliance,
   #3 verify-command portability).
8. `crates/lykn-cli/src/main.rs` lines 93–118 (clap defs for `build` and
   `publish`), 625 (`cmd_publish`), 921 (`cmd_build`), 290 (config-file
   discovery — confirms `project.json` is the active Deno config), 332/
   338/384/415 (deno-spawn sites passing `--config`), 841–847
   (scaffold `GITIGNORE_TEMPLATE`), 864–895 (`cmd_new`), 895 (existing
   `git init` invocation — the only `git` call today).
9. `crates/lykn-cli/src/dist.rs` lines 102 (`dist_root` resolution),
   160–229 (`compile_lykn_sources` — currently writes `.js` into source
   tree), 242–266 (`copy_js_files`), 269–291 (`copy_all_files`), 351–387
   (`write_deno_json` — line 371 is `pkg_config.exports.clone()`,
   confirming source `exports` is a staging template).
10. `Makefile` — `make build`, `make build-dist`, `make clean` etc.
    (lines 14, 46, 182, 189, 245). Targets that reference `dist/` or
    `bin/` need alignment.
11. `crates/lykn-cli/src/snapshots/` — list snapshots before
    implementation; expect some may capture generated `deno.json`/
    `package.json` content that changes as paths shift.

---

## Specifications

Each subsection produces one ledger row. The Verify command in each row
must be independently reproducible per LEDGER_DISCIPLINE.md.

### Spec 1 — Baseline (M11M13-1)

Capture the pre-implementation state so CDC can verify what changed.
Write `workbench/verify/m11-m13/baseline.txt` containing the output of:

```sh
mkdir -p workbench/verify/m11-m13

# Current dist-layout footprint
{
  echo "=== source-tree .js files (Known Violation) ==="
  find packages -name "*.js" -type f | sort
  echo ""
  echo "=== current dist/ contents ==="
  ls dist/ 2>/dev/null || echo "(no dist/ yet)"
  echo ""
  echo "=== current target/lykn presence (should be empty pre-M11) ==="
  ls target/lykn/ 2>/dev/null || echo "(no target/lykn/ yet)"
  echo ""
  echo "=== publish dirty-check baseline (should NOT exist pre-M13) ==="
  lykn publish --help 2>&1 | grep -i "allow-dirty" || echo "(no --allow-dirty flag yet)"
  echo ""
  echo "=== current git state (for dirty-tree behaviour comparison) ==="
  git status --porcelain | head -20
} > workbench/verify/m11-m13/baseline.txt
```

Expected: shows `.js` files present in `packages/*/`, no `target/lykn/`,
no `--allow-dirty` flag.

### Spec 2 — Compile output relocated (M11M13-2)

`dist.rs::compile_lykn_sources` writes compiled `.js` to
`target/lykn/build/<pkg>/<basename>.js` instead of
`packages/<pkg>/<basename>.js`. Source tree stays clean of `.js` artifacts.

The relocation MUST preserve the existing mtime-staleness check (only
recompile when source is newer than output).

**Verify:**

```sh
# Clean slate
rm -rf target/lykn/

# Run a build
lykn build 2>&1

# No .js in source tree
find packages -name "*.js" -type f | wc -l
# Expected: 0

# Compiled output exists under target/lykn/build/
find target/lykn/build -name "*.js" -type f | wc -l
# Expected: >0 (matches the number of .lykn source files across packages)
```

### Spec 3 — `lykn dist` subcommand and deprecation alias (M11M13-3)

`lykn dist` is a top-level subcommand that stages publish-ready package
trees into `target/lykn/dist/<pkg>/`. Equivalent semantics to today's
`lykn build --dist`, but written to the new path.

`lykn build --dist` continues to work as a deprecation alias, emitting
the deprecation warning specified in §Design dispositions and proceeding
to delegate to the `lykn dist` codepath.

**Verify:**

```sh
# `lykn dist` runs and produces output at the new location
rm -rf target/lykn/
lykn dist
ls -d target/lykn/dist/lang target/lykn/dist/testing target/lykn/dist/browser
# Expected: all three present

# Deprecation alias still works, emits warning
rm -rf target/lykn/
lykn build --dist 2>&1 | grep -E "^warning:.*deprecated.*lykn dist"
# Expected: 1 match
ls -d target/lykn/dist/lang
# Expected: present (alias delegated to lykn dist successfully)
```

### Spec 4 — `lykn build` whole-project semantics (M11M13-4)

`lykn build` (no flag) compiles every workspace member's `.lykn` sources
into `target/lykn/build/<pkg>/`. This is the local-dev compile-all step.
It is distinct from `lykn dist` (which is `build` plus staging metadata).

`lykn compile <file>` retains its existing per-file semantics (default
stdout, `-o <path>` writes to path). It is the primitive `lykn build`
calls per-source.

**Verify:**

```sh
# Fresh state
rm -rf target/lykn/

# Whole-project build
lykn build

# Output for each workspace member
for pkg in lang testing browser; do
  count=$(find "target/lykn/build/$pkg" -name "*.js" -type f 2>/dev/null | wc -l)
  echo "$pkg: $count"
done
# Expected: each pkg shows >0 files
```

### Spec 5 — `project.json` imports repointed; local-dev resolution preserved (M11M13-5)

`project.json` `imports` field updates so workspace-prefix imports
continue to resolve after the compile-output relocation:

```json
{
  "imports": {
    "lang/":    "./target/lykn/build/lang/",
    "testing/": "./target/lykn/build/testing/",
    "astring":  "npm:astring@^1.9.0"
  }
}
```

Per-package `packages/<pkg>/deno.json` `exports` field stays unchanged
(it is a staging template, not a local-dev config; see §Design
dispositions Q4).

**Verify:**

```sh
# imports field points at target/lykn/build/
grep -E '"lang/"\s*:\s*"\./target/lykn/build/lang/"' project.json
grep -E '"testing/"\s*:\s*"\./target/lykn/build/testing/"' project.json
# Expected: 1 match each

# Local-dev resolution works: lykn test passes
rm -rf target/lykn/
lykn build
lykn test 2>&1 | tee workbench/verify/m11-m13/lykn-test-output.txt
echo "EXIT: ${PIPESTATUS[0]}"
# Expected: EXIT: 0; all tests pass
```

If `lykn test` exits non-zero, the imports repointing is wrong (or
something else broke). Do NOT proceed to subsequent rows until this
passes — every later test depends on `lykn test` working.

### Spec 6 — Scaffold updated (M11M13-6)

`lykn new` generates a project skeleton matching the new conventions:

- `.gitignore` contains `target/` (covers the new build dir). The
  existing `dist/` entry can be removed or retained as defensive
  coverage; CC chooses.
- Workspace `project.json` `imports` references `./target/lykn/build/<pkg>/`.
- Per-package `packages/<pkg>/deno.json` `exports` unchanged (`./mod.js`).

The `cmd_new` codepath at `main.rs:864–895` produces the scaffold.

**Verify:**

```sh
# Scratch dir for scaffold test
cd /tmp && rm -rf lykn-m11-scaffold-test
lykn new lykn-m11-scaffold-test
cd lykn-m11-scaffold-test

# .gitignore covers target/
grep -E "^target/$" .gitignore
# Expected: 1 match

# project.json imports point at target/lykn/build/
grep -E '"\./target/lykn/build/' project.json | wc -l
# Expected: >0 (one match per workspace member)

# Fresh-scaffold smoke test: build + test should succeed
lykn build
lykn test 2>&1 | tail -5
echo "EXIT: ${PIPESTATUS[0]}"
# Expected: EXIT: 0
```

### Spec 7 — Snapshot review (M11M13-7)

Per CLAUDE.md "Snapshot testing (insta)" rule, **never** `cargo insta
accept`. After M11 changes land, snapshot tests in
`crates/lykn-cli/src/snapshots/` may show diffs (paths in generated
`deno.json` / `package.json` content may shift, and content of staged
files may be reorganized).

For each pending snapshot:

1. Run `cargo insta test` to surface pending snapshots.
2. Review the diff via `cargo insta review` (interactive).
3. For each pending change, explicitly judge: is the new snapshot the
   correct expected output under M11's new conventions?
4. Accept or reject each individually with explicit reasoning recorded.

Reasoning for each accepted snapshot MUST be captured at
`workbench/verify/m11-m13/snapshot-review.md`, structured as:

```markdown
## <snapshot file name>

**Old output:** <one-line summary>
**New output:** <one-line summary>
**Why the change is correct:** <explanation tying back to M11 spec>
**Disposition:** accepted | rejected (and what was changed instead)
```

If a snapshot diff CANNOT be explained by M11's design, it is a
regression — do NOT accept. Pause and surface.

**Verify:**

```sh
# After running cargo insta review and recording rationales:
cargo insta test --review --check
# Expected: no pending snapshots remain
test -f workbench/verify/m11-m13/snapshot-review.md
grep -cE "^## " workbench/verify/m11-m13/snapshot-review.md
# Expected: ≥1 (one section per reviewed snapshot)
```

If no snapshots changed (possible if the test fixtures don't capture
path-dependent content), record that explicitly:

```markdown
## No snapshot diffs

`cargo insta test` showed zero pending snapshots after M11 changes
landed. The snapshot fixtures capture generated-file *content* that did
not change under the new path conventions. No review records needed.
```

### Spec 8 — M13 dirty-check enforces gate (M11M13-8)

`lykn publish` (both `--jsr` and `--npm` variants) checks git working-
tree state before any underlying tool is spawned. Dirty state (tracked-
modified, untracked, or staged-uncommitted) causes the command to refuse
with the Cargo-style error specified in §Design dispositions Q3.

Implementation MUST:

- Use `git status --porcelain` (or equivalent `git2` invocation) — not
  `git status` (the porcelain output is the documented stable format).
- Run BEFORE any `lykn dist` invocation (if `cmd_publish` invokes dist
  transparently per §Design dispositions M11-Q2).
- Exit non-zero (recommended: `1`) with the error on stderr.
- NOT auto-pass any flag to underlying tools to bypass their own gates.

**Verify:**

```sh
# In a clean tree: lykn publish --dry-run succeeds (this row tests the
# rejection path, not the success path — but a clean-tree dry-run must
# still work as a smoke test of the gate's positive case)
git status --porcelain | wc -l  # confirm 0 before starting
lykn publish --jsr --dry-run 2>&1 | tail -3
echo "EXIT: ${PIPESTATUS[0]}"
# Expected: EXIT: 0 (or 101 in the structural-failure pattern for
# inter-crate cargo deps if applicable — match M9-release pattern)

# Now introduce dirt and re-run
echo "test" > workbench/verify/m11-m13/dirty-test-marker.txt
git status --porcelain | grep dirty-test-marker  # confirm dirt
lykn publish --jsr --dry-run 2>&1 | tee workbench/verify/m11-m13/dirty-publish-output.txt
echo "EXIT: ${PIPESTATUS[0]}" >> workbench/verify/m11-m13/dirty-publish-output.txt

# Expected: EXIT non-zero, stderr matches the Cargo-style error format
grep -E "^error: lykn publish: working tree has uncommitted changes" workbench/verify/m11-m13/dirty-publish-output.txt
grep -E "Commit or stash these changes, or pass --allow-dirty" workbench/verify/m11-m13/dirty-publish-output.txt
# Expected: 1 match each

# Clean up
rm workbench/verify/m11-m13/dirty-test-marker.txt
```

### Spec 9 — M13 `--allow-dirty` override; no auto-injection (M11M13-9)

`lykn publish --allow-dirty` bypasses the lykn-level dirty-check and
proceeds as if the tree were clean. Underlying tools (`deno publish`,
`npm publish`) MUST NOT receive `--allow-dirty` automatically — they
have their own gates the user controls independently.

The most reliable way to test the no-auto-injection invariant is to
inspect what arguments `cmd_publish` passes to `deno`/`npm` when
`--allow-dirty` is set. Two options:

- **(a) Code-inspection check** (Verify-friendly): grep the relevant
  function bodies in `main.rs` for any code path that adds
  `--allow-dirty` to a Command's args. There should be exactly zero
  matches.
- **(b) Behaviour check**: in a dirty tree with `--allow-dirty`, capture
  the exact deno/npm command line spawned (e.g., via instrumentation,
  trace flag, or a test harness that wraps `Command::new`).

For M13, the code-inspection check is sufficient (the absence of the
auto-injection is statically verifiable). The ledger row's Verify
command runs (a).

**Verify:**

```sh
# Behaviour: --allow-dirty proceeds on dirty tree
echo "test" > workbench/verify/m11-m13/dirty-test-marker.txt
lykn publish --jsr --dry-run --allow-dirty 2>&1 | tee workbench/verify/m11-m13/allow-dirty-output.txt
echo "EXIT: ${PIPESTATUS[0]}" >> workbench/verify/m11-m13/allow-dirty-output.txt
# Expected: EXIT 0 (or the structural-failure pattern), no dirty-tree refusal
grep -E "^error: lykn publish: working tree has uncommitted changes" workbench/verify/m11-m13/allow-dirty-output.txt | wc -l
# Expected: 0 (the gate did not fire)

# Code inspection: no auto-injection of --allow-dirty to underlying tools
# Search the publish-related code paths in main.rs for any addition of
# the string "--allow-dirty" to a Command's args vector.
grep -nE '"--allow-dirty"' crates/lykn-cli/src/main.rs
# Expected: matches ONLY in the clap definition for the lykn-level flag
# AND in the dirty-check logic itself — NOT in any args.push() / vec![]
# spawning deno or npm.

# Clean up
rm workbench/verify/m11-m13/dirty-test-marker.txt
```

If the grep returns a match in a `Command::new("deno")` or
`Command::new("npm")` arg-construction block, that is an auto-injection
violation per CLAUDE.md "Lykn CLI safety gates" — DO NOT close this row.

### Spec 10 — Documentation alignment (M11M13-10)

`docs/philosophy.md` "Known violations" section currently lists several
entries that M11 resolves:

- **`lykn compile` writes `.js` next to `.lykn` source.** Closed by Spec 2.
- **`.gitignore` does not exclude `*.js` from source tree.** Partially
  closed: with no `.js` ever generated in source tree, the defensive
  `*.js` ignore becomes unnecessary (but harmless if retained). Either
  remove or note as superseded.
- **Source `deno.json` `exports` references `./mod.js`.** Closed in
  spirit: source `exports` is now documented as a staging template, not
  a local-dev config. The path is semantically valid for the staged
  tree.

Move each of these entries to a new "Resolved violations" subsection of
the philosophy doc (or strike them through and add a footnote pointing
at M11), retaining their original text as a historical record.

The known-violations entries that are NOT resolved by M11 (e.g., `lykn
lint` stubbing — that's M12) remain in place.

**Verify:**

```sh
# The three resolved entries are moved or marked as resolved
grep -cE "^### From Phase 1 work$" docs/philosophy.md
# Expected: 1 (the existing heading remains)

grep -cE "^### Resolved by M11" docs/philosophy.md
# Expected: 1 (the new subsection exists)

# The original-text entries appear under the resolved heading
grep -cE "lykn compile.*writes.*\.js.*next to.*\.lykn source" docs/philosophy.md
# Expected: 1 (preserved as historical record)
```

Note: the precise format of the resolved-violations section is CC's
call — strike-through, separate subsection, footnote pointing at M11
closing report. As long as the original-text entries are retrievable
and clearly marked as resolved, the format is acceptable.

### Spec 11 — Substrate-rule compliance (M11M13-11)

Per Phase 2 plan methodology improvement #1, closing report includes a
substrate-rule compliance section. Starter rules for M11+M13:

| Rule | Touched by | Expected evidence shape |
|------|-----------|-------------------------|
| `CLAUDE.md` "Lykn CLI safety gates" — no auto-injection of safety-bypass flags | Spec 9 (`--allow-dirty`) | The grep in Spec 9 returns matches ONLY in the clap def and the lykn-level dirty-check logic, NEVER in a deno/npm Command's args. Documented in the closing report. |
| `CLAUDE.md` "Snapshot testing (insta)" — never auto-accept | Spec 7 (snapshot review) | `cargo insta accept` was NOT invoked anywhere in the milestone. `cargo insta review` was used; rationales recorded per-snapshot. Or: no snapshots changed, recorded explicitly. |
| `docs/philosophy.md` Principle 1 — no `.js` in source tree | Spec 2, Spec 6 (scaffold) | `find packages -name "*.js"` returns 0 after a fresh build. Scaffold-generated projects produce 0 source-tree `.js` after `lykn build`. |
| `docs/philosophy.md` Decided design question #1 — `target/lykn/build/` and `target/lykn/dist/` | Spec 2, Spec 3, Spec 4 | Compile output at `target/lykn/build/`; staging at `target/lykn/dist/`; both per-package. |
| `docs/philosophy.md` Decided design question #4 — lykn-owned publish gate | Spec 8, Spec 9 | Dirty check runs at the lykn level before any underlying tool. `--allow-dirty` bypasses only the lykn gate, not underlying gates. |
| `assets/ai/LEDGER_DISCIPLINE.md` — Verify commands not silently rewritten | All rows | Every Verify command in the closing report runs exactly as written. If a command needs amendment, declare the amendment inline per the M5/M9 amendment refinement pattern; do not silently change it. |

CC drafts the substrate-rule section as part of the closing report
itself (not a separate file). Each row above gets a paragraph with the
specific evidence (commit SHA + grep output + test result, as appropriate).

**Verify:**

```sh
# Closing report exists and contains substrate-rule section addressing
# the six starter rules above
test -f workbench/2026-MM-DD-M11-M13-closing-report.md  # CC fills date
grep -cE "^## Substrate-rule compliance$" workbench/2026-*-M11-M13-closing-report.md
# Expected: 1

# Each starter rule named in the section
for rule in "Lykn CLI safety gates" "Snapshot testing" "Principle 1" \
            "Decided design question #1" "Decided design question #4" \
            "Verify commands"; do
  echo -n "$rule: "
  grep -cF "$rule" workbench/2026-*-M11-M13-closing-report.md
done
# Expected: 1 (or more) for each
```

### Spec 12 — Commit chain (M11M13-12)

Single coherent commit chain naming M11 and M13. Expected commits (CC's
judgment on exact granularity, but each must be reachable from a single
`git log` invocation):

- One or more commits implementing M11 (build-dir reorg, dist.rs
  changes, project.json update, scaffold update).
- One commit implementing M13 (dirty-check + `--allow-dirty`).
- One commit for philosophy.md known-violations alignment.
- The closing report itself lives in `workbench/` (gitignored), so does
  not appear in commits — the closing report's existence is the
  evidence trail; the commits are the load-bearing artifacts.

**Verify:**

```sh
git log --grep="M11\|M13\|build-dir\|publish.*dirty\|allow-dirty" --oneline
# Expected: ≥3 commits (M11 implementation + M13 implementation + doc)

# Sanity: all commits land on the cdc-build-dir-reorg branch (or
# wherever Duncan picks for CC's actual implementation work)
git log --grep="M11\|M13\|build-dir\|publish.*dirty\|allow-dirty" --format="%H %s"
```

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M11M13-1 | Baseline state captured at `workbench/verify/m11-m13/baseline.txt` | `test -f workbench/verify/m11-m13/baseline.txt && grep -cE "^=== " workbench/verify/m11-m13/baseline.txt` returns ≥5 | polish | Spec 1; LEDGER_DISCIPLINE pre-state discipline | open | | |
| M11M13-2 | Compile output relocated: no `.js` in source tree; `target/lykn/build/<pkg>/*.js` populated | After `rm -rf target/lykn/ && lykn build`: `find packages -name "*.js" -type f \| wc -l` returns 0 AND `find target/lykn/build -name "*.js" -type f \| wc -l` returns >0 | serious | Spec 2; philosophy.md Principle 1; 0.6.0 commitment | open | | |
| M11M13-3 | `lykn dist` exists as subcommand; `lykn build --dist` works as deprecation alias | `lykn dist && ls -d target/lykn/dist/lang target/lykn/dist/testing target/lykn/dist/browser` succeeds; `lykn build --dist 2>&1 \| grep -E "^warning:.*deprecated.*lykn dist"` returns 1 match | serious | Spec 3; §Design dispositions M11-Q2 | open | | |
| M11M13-4 | `lykn build` (no flag) compiles whole project to `target/lykn/build/<pkg>/` | After `rm -rf target/lykn/ && lykn build`: for each pkg in {lang, testing, browser}, `find target/lykn/build/$pkg -name "*.js" \| wc -l` returns >0 | serious | Spec 4; §Design dispositions M11-Q2 | open | | |
| M11M13-5 | `project.json` imports repointed; `lykn test` exits 0 | `grep -E '"lang/"\s*:\s*"\./target/lykn/build/lang/"' project.json` returns 1; `rm -rf target/lykn/ && lykn build && lykn test` exits 0 | serious | Spec 5; §Design dispositions M11-Q4 | open | | |
| M11M13-6 | Scaffold generates new-layout project; fresh scaffold's `lykn build && lykn test` succeeds | In scratch dir: `lykn new <name> && cd <name> && grep -E "^target/$" .gitignore` returns 1; `grep -E '"\./target/lykn/build/' project.json \| wc -l` returns >0; `lykn build && lykn test` exits 0 | serious | Spec 6 | open | | |
| M11M13-7 | All insta snapshots reviewed and either accepted with rationale or rejected; no auto-accept | `cargo insta test --review --check` returns 0 pending; `workbench/verify/m11-m13/snapshot-review.md` exists with one section per reviewed snapshot (or explicit "no diffs" record) | correctness | Spec 7; CLAUDE.md "Snapshot testing" | open | | |
| M11M13-8 | `lykn publish` refuses on dirty tree with Cargo-style error | In dirty tree: `lykn publish --jsr --dry-run` exits non-zero; stderr contains `error: lykn publish: working tree has uncommitted changes` AND `Commit or stash these changes, or pass --allow-dirty` | serious | Spec 8; philosophy.md DD #4; 0.6.0 commitment | open | | |
| M11M13-9 | `--allow-dirty` bypasses lykn gate; no auto-injection to underlying tools | In dirty tree: `lykn publish --jsr --dry-run --allow-dirty` exits 0 (or structural-failure pattern); `grep -nE '"--allow-dirty"' crates/lykn-cli/src/main.rs` returns matches ONLY in clap def + dirty-check logic, NEVER in a deno/npm Command::new args block | serious | Spec 9; CLAUDE.md "Lykn CLI safety gates" — the rule materialization | open | | |
| M11M13-10 | philosophy.md Known Violations entries M11 resolves are marked resolved | `grep -cE "^### Resolved by M11" docs/philosophy.md` returns 1; original-text entries (`lykn compile` source-tree output, scaffold `.gitignore`, source `exports` framing) preserved as historical record under the resolved subsection | correctness | Spec 10; philosophy.md alignment | open | | |
| M11M13-11 | Closing report includes substrate-rule compliance section addressing the 6 starter rules | `grep -cE "^## Substrate-rule compliance$" workbench/2026-*-M11-M13-closing-report.md` returns 1; each of the 6 starter rules named in the section | correctness | Spec 11; Phase 2 methodology improvement #1 | open | | |
| M11M13-12 | Single coherent commit chain naming M11/M13 | `git log --grep="M11\|M13\|build-dir\|publish.*dirty\|allow-dirty" --oneline` returns ≥3 commits | polish | Spec 12; LEDGER_DISCIPLINE evidence-trail discipline | open | | |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** The protocol applies. Iteration
   budget is 5; expected 3–4.

2. **Read `CLAUDE.md` "Lykn CLI safety gates" section before Spec 9.**
   M13 is the materialization of the rule's lykn-level half. The
   underlying-tool half (no auto-injection) must be preserved.

3. **Read `CLAUDE.md` "Snapshot testing (insta)" section before Spec 7.**
   Manual review only. `cargo insta accept` is forbidden.

4. **Order of work:**
   - Spec 1 (baseline) — captures pre-state.
   - Spec 2 (compile output relocation) — the central M11 change. Once
     this is in, `lykn build` may break local-dev resolution until Spec 5
     repoints `project.json`. That is expected mid-flight.
   - Spec 5 (project.json imports) — repointing. Once this lands,
     `lykn test` should work again.
   - Spec 3, Spec 4 (`lykn dist` + `lykn build` semantics, deprecation
     alias) — can land in either order; both touch the same `cmd_build` /
     new `cmd_dist` codepaths.
   - Spec 6 (scaffold) — depends on Spec 5's `project.json` shape being
     settled.
   - Spec 7 (snapshot review) — after all M11 changes have landed.
   - Spec 8, Spec 9 (M13 dirty-check + `--allow-dirty`) — M13 work,
     independent of M11.
   - Spec 10 (philosophy.md alignment) — after M11 implementation
     complete.
   - Spec 11 (substrate-rule compliance) — drafted as part of the
     closing report at the end.
   - Spec 12 (commit chain) — verified at close.

5. **If `lykn test` breaks after Spec 2 and stays broken after Spec 5,
   STOP.** That means the imports-repointing isn't correct. Diagnose
   before continuing — every downstream Verify command depends on
   `lykn test` working.

6. **For Spec 7 (snapshot review): if a snapshot diff is surprising or
   can't be explained by M11's design, do NOT accept.** Pause and
   surface to CDC. The snapshot tests are protecting against silent
   regressions; an unexplained diff is exactly the case where the
   protocol pays off.

7. **For Spec 9: the no-auto-injection invariant is the central M13
   correctness claim.** If you find yourself wanting to pass
   `--allow-dirty` through to `deno publish` "for convenience" or
   "because dry-run benefits," STOP. That is precisely the antipattern
   the CLAUDE.md safety-gates rule was written to prevent. The
   commit `64bb301` precedent (reverted) is named in CLAUDE.md as the
   incident the rule responds to. Honour the rule.

8. **For Spec 10: take care moving philosophy.md entries.** The doc is
   foundational. The original text of the known-violations entries
   should be preserved verbatim under the resolved subsection — they
   are historical record, not just stylistic content.

9. **Update the ledger as you work.** Each row's Evidence column gets
   the commit SHA + Verify output at completion time. Do not leave all
   evidence for the closing report.

10. **In the closing report, walk every row.** No summary form. The
    closing report includes Substrate-rule compliance per Phase 2
    methodology improvement #1 (already required by Spec 11).

11. **If a Verify command's pattern doesn't match your output's
    wording**, amend inline per the M5/M9 inline-amendment refinement.
    Specifically: the cargo-style error message format in §Design
    dispositions Q3 is a recommendation; if CC chooses a slight variant
    for code-quality reasons (e.g., different prefix capitalization),
    update the Verify pattern in the closing report to match and note
    the amendment.

12. **Self-stop conditions.** If CC finds:
    - A snapshot diff that can't be explained by M11's design (Spec 7).
    - A test failure that suggests `project.json` imports repointing
      isn't enough (Spec 5).
    - A code path that wants to auto-inject `--allow-dirty` (Spec 9).
    - A design decision in §Design dispositions that turns out to be
      wrong on contact with code (any spec).

    …STOP and surface to CDC. Do not work around. The five-iteration
    budget exists exactly to allow these surfacings to be resolved
    properly rather than papered over.

---

## Closing report specification

Path: `workbench/2026-MM-DD-M11-M13-closing-report.md` (use the actual
close date in `YYYY-MM-DD`).

Structure (same as M7 / M9-release closing reports):

- **Summary** — 2-3 sentences naming what M11 and M13 delivered.
- **Per-row walk** — one section per ledger row (M11M13-1 through
  M11M13-12). Each section contains:
  - `Verify command run:` (exact command from the ledger)
  - `Output:` (the command's output)
  - `Disposition:` (done / deferred / no-op)
  - `Evidence chain:` (commit SHAs + any other evidence)
- **Cross-spec consistency check** — confirm that M11's command-naming
  (build/dist/compile/publish) is internally consistent and the M13
  dirty-check correctly fires before the dist step.
- **Substrate-rule compliance** — required by Spec 11. The six starter
  rules above, each with specific evidence.
- **What needs to be reflected back into earlier reports** — anything
  M7 / M9 / phase-2-plan got wrong that this milestone surfaces.
- **Findings logged for fast-follow / future work** — anything
  surfaced during implementation that's out of scope (e.g., `lykn
  migrate` for downstream users of 0.5.x scaffolds).
- **Methodology learnings** — what worked, what didn't, what should
  inform future ledgers.
- **What this milestone did NOT cover** — explicit out-of-scope
  (linter, 0.6.0 release, JS compiler changes).

---

## What Worked

_(Filled in at milestone close. Particularly: did bundling M11+M13 in
one ledger reduce overhead vs splitting? Did the §Design dispositions
section save iterations by pre-resolving DD-style questions? Did the
substrate-rule starter list catch any near-miss violations during
implementation?)_

---

## Closure

_(CC fills in: closing commit SHA, date.
CDC fills in: verification session, total rows, dispositions.)_
