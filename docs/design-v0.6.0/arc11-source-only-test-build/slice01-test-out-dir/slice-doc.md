# Slice 01: test-out-dir

> Wire `lykn test`'s reserved `--out-dir` so compiled test JS lands in
> `target/lykn/test/` (wiped per run), never in the source tree — finishing
> `philosophy.md` commitment #1 for the last source-tree emitter. The flag,
> the plumbing stub, and the in-repo precedent all already exist; this slice
> connects them.

## Goal

`lykn test` (and `lykn test --compile-only`) compiles `*_test.lykn`/`.lyk`
into `target/lykn/test/` (default; `--out-dir` overrides), runs Deno against
that directory, and wipes it per run — mirroring the doctest runner's
existing discipline. At no moment does a generated `.js` exist under
`test/`: not mid-run, not after Ctrl-C, not after `--compile-only`.
`.gitignore` gains `*_test.js` as belt-and-suspenders against pre-existing
stray debris.

## Current state (grounded 2026-07-05)

- **The interim design** (April, `a640398`): `compile_lykn_test_files(files,
  None)` → `compute_compiled_path(…, None)` → **sibling** `.js` next to each
  source (`main.rs:649–656`); run; `clean_compiled_test_files` deletes after
  (`main.rs:528`, `:468`). Comment at `:498`: "Compile .lykn files next to
  sources, run, then clean up."
- **The reserved flag**: `--out-dir` exists on `Commands::Test`
  (`main.rs:81–83`), **hidden** (`#[arg(long, hide = true)]`), doc'd
  "reserved for future use"; threaded to `cmd_test` as **`_out_dir`**
  (`:447`) and ignored; both `compile_lykn_test_files` call sites (`:458`,
  `:499`) pass `None`. `compute_compiled_path` already handles
  `Some(out_dir)` (`:650–652` — joins the relative source path under it) and
  has unit tests for both branches (`:1345`, `:1351`).
- **The precedent**: doctests write generated `.test.js` to
  `target/test/doctest/`, `remove_dir_all` + recreate per run
  (`doctest.rs:553–558`), and point Deno at that dir (`:625`).
- **Gaps in the interim design** (why transient isn't enough): Ctrl-C/crash
  mid-run strands `_test.js` in `test/` (cleanup never runs);
  `--compile-only` leaves them deliberately (`:502` returns before cleanup —
  and note the `--docs`+compile-only branch at `:459–468` compiles then
  immediately cleans, which looks inconsistent — resolve while in there);
  `.gitignore` covers only `*.js.map`; stray debris then shows as untracked
  and trips the publish dirty gate. P-7's DoD demo only holds at rest.
- **Suffix separation is clean** (verified): generated files are always
  `*_test.js` (from `*_test.lykn`/`.lyk`); all 81 tracked hand-written tests
  are `*.test.js`; **zero** tracked `*_test.js`.
- **The likely reason for the April sibling design (F-1 recon target):**
  compiled tests import via the project import map (`"testing/helpers.js"`,
  `"lang/…"`) under `--config project.json`; import-map keys are
  project-root-relative, so running from `target/` *should* resolve — but
  any **relative** imports in generated output, and `Deno.cwd()`-dependent
  helpers (`compileBoth` asserts callers invoke from the project root — it
  uses `Deno.cwd()` as `--source-context-path`), must be verified from the
  new location before the switch.

## Scope (in)

1. **F-1 recon**: compile a representative set (surface forms, kernel
   `.lyk`, `import-macros` users, `compileBoth` corpus rows) into
   `target/lykn/test/` and run from there; enumerate anything that resolves
   differently (import map, relative paths, `Deno.cwd()` assumptions,
   freshness-guard interplay). Surface blockers before wiring.
2. **F-2 wiring**: default out-dir `target/lykn/test/`; wipe-per-run;
   `--compile-only` writes there; un-hide `--out-dir` + document.
3. **F-3 hygiene**: `.gitignore` `*_test.js`; the `--docs`+compile-only
   inconsistency resolved (surfaced, not silently chosen).
4. **F-4 demo**: the A-3 arc criterion at slice scale — mid-run, post-
   interrupt, post-compile-only: `test/` stays clean.

## Scope (out)

- The buried-intent audit (slice02).
- `target/test/doctest/` → `target/lykn/…` harmonization: **design
  sub-question below**, implement only if trivially safe, else route.
- Any change to *which* tests run or their semantics; suite numbers must
  hold (1365/0, 673/0 at current baseline).

## Verification approach

Rebuild-first; full green bar (`make check`, `make test-docs`, `lykn test`,
`deno test`, clippy). Headline demo: `find test -name '*_test.js'` and
`git status --porcelain test/` both empty **during** a run (second
terminal), after a mid-run SIGINT, and after `--compile-only`.

## Exit criteria

Generated test JS lands only under `target/` (gitignored); the three-moment
demo passes; the flag is public + documented; `.gitignore` covers
`*_test.js`; suites green at baseline; P-7's demo becomes unconditionally
runnable.

## Design sub-questions (surface, don't decide silently)

1. **Directory naming** — recommend `target/lykn/test/` (aligns with arc01's
   `target/lykn/{build,dist}`); the doctest runner uses `target/test/doctest`
   — harmonize to `target/lykn/test/doctest/` now, or file it? (Recommend:
   harmonize if it's a one-line constant; otherwise route to slice02's
   disposition table.)
2. **Freshness guard** — does `check_cross_compiler_freshness` need to know
   about the new dir? (Recon says likely no — it guards `bin/lykn` +
   `target/lykn/build/` — but verify.)
3. **`--compile-only` contract** — with output in `target/`, what does the
   user-facing message print (the target paths, presumably)? Confirm the
   use-case survives.
