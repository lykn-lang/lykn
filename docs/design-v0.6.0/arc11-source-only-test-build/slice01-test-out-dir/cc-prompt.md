# CC Prompt — arc11 / slice01 · test-out-dir

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-05
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Finish `philosophy.md` commitment #1 for the **last source-tree
emitter**: `lykn test` currently compiles `*_test.lykn`/`.lyk` to sibling
`_test.js` files in `test/`, runs, then deletes them. Wire the
already-existing (hidden, "reserved for future use") `--out-dir` so compiled
test JS lands in **`target/lykn/test/`**, wiped per run. Gates arc09's P-7
demo.

## 0. Read first

- `…/slice01-test-out-dir/ledger.md` (6 rows) and `slice-doc.md` (the full
  grounded map — flag, stub, call sites, precedent, gaps, with line numbers).
- The in-repo precedent: `doctest.rs:553–558` (`target/test/doctest/`,
  `remove_dir_all` + recreate per run, Deno pointed at the dir).
- The interim design you're replacing: `main.rs:498–537` + commit `a640398`
  (April: compile-sibling + clean-after; it also removed 16 committed
  `_test.js` artifacts — history worth knowing).

## 1. The work (MUST), in order

1. **F-1 — recon first; it gates F-2.** The April sibling design may exist
   *because* running from another directory broke something. Compile a
   representative set into `target/lykn/test/` and run it from there under
   `--config project.json`: surface tests, kernel `.lyk` tests,
   `import-macros` users, `compileBoth` corpus rows (note its
   `Deno.cwd()`-is-project-root contract). Enumerate anything that resolves
   differently (import map, relative specifiers, cwd assumptions, the
   freshness guard). **If you hit a real blocker, stop and surface** —
   fallback designs (import-map shim, adjusted generated specifiers) are
   design calls, not silent hacks.
2. **F-2 — wire it.** Default `Some(target/lykn/test/)` at both call sites
   (`main.rs:458`, `:499`); wipe-per-run like the doctest dir; point the
   Deno run at the target paths; `--compile-only` writes there and prints
   the target paths; un-hide `--out-dir` (`main.rs:81–83`) and document it.
   `compute_compiled_path` already handles `Some` and is unit-tested — most
   of the plumbing exists.
3. **F-3 — kill the debris modes.** SIGINT mid-run and `--compile-only`
   must leave `test/` clean (target-dir debris is fine — it's gitignored
   and wiped next run). While there: the `--docs`+`--compile-only` branch
   (`:459–468`) compiles then immediately cleans — resolve the
   inconsistency with a stated rationale, don't just preserve it.
4. **F-4 — `.gitignore` gains `*_test.js`.** Safe: zero tracked files match
   (all 81 hand-written tests are `.test.js`). Do **not** ignore
   `*.test.js`.

## 2. Verify (rebuild-first, all green)

`make check` ✓; `lykn test` ≥1365/0; `deno test --config project.json -A
test/` ≥673/0; `make test-docs` 0 failed; clippy clean (F-5). Headline
(F-6): the **three-moment demo** — `find test -name '*_test.js'` and
`git status --porcelain test/` both empty (a) mid-run from a second
terminal, (b) after killing a run part-way, (c) after `--compile-only`.
Transcript in the closing report.

## 3. Discipline

- **F-1 before F-2.** The sibling design is old enough to have a reason;
  find it or rule it out before replacing it.
- **Surface, don't decide silently:** dir naming (recommend
  `target/lykn/test/`, arc01-aligned; harmonizing the doctest dir
  `target/test/doctest` → under `target/lykn/` is in-scope only if it's a
  one-line constant — else file it for slice02's disposition table);
  freshness-guard interplay; the `--compile-only` UX. → closing report.
- Suite numbers hold at baseline — relocation must not change what runs.
- Safety gates (CLAUDE.md): nothing here bypasses git/deno gates; the
  publish dirty-check keeps doing its job (there'll just be less noise for
  it to catch).
- Leave `docs/design-v0.6.0/**` to CDC except your closing report. Source
  only.

## 4. Close

`closing-report.md`: per-row walk (6 rows, no silent drops) + the F-1 trace
+ the three-moment transcript + design-call rationales + **bubble-up to
arc11** (does slice02's audit inherit anything you found — e.g. more
reserved/dead plumbing in `main.rs`?) → hand back for CDC
`cdc-verification.md`. Then slice02 (buried-intent-audit) closes the arc.
