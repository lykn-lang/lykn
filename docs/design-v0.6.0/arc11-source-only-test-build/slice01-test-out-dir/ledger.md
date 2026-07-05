# Slice 01: test-out-dir — Ledger

Wire `lykn test`'s reserved `--out-dir` → `target/lykn/test/` (wiped per
run); no generated `.js` in the source tree at any moment. Rebuild-first
verify. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Recon: running compiled tests from `target/lykn/test/` works** — import-map resolution, relative imports, `Deno.cwd()` assumptions (`compileBoth`'s project-root contract), freshness-guard interplay all verified from the new location; blockers surfaced before wiring | written trace in the closing report: representative set (surface, `.lyk`, `import-macros`, corpus rows) compiled to target + run green from there | serious | slice-doc | open | | **gates F-2**; the April sibling design (`a640398`) may have existed for a reason — find it or rule it out |
| F-2 | **`--out-dir` wired, default `target/lykn/test/`** — both `compile_lykn_test_files` call sites (`main.rs:458`, `:499`) pass the dir; wipe-per-run (doctest pattern, `doctest.rs:553–558`); `--compile-only` writes there; flag un-hidden + documented | `lykn test` run: `find test -name '*_test.js'` empty **mid-run**; `ls target/lykn/test/` populated; `--out-dir /tmp/x` respected; `lykn test --help` shows the flag | serious | operator observation 2026-07-05 / P-7 | open | | `compute_compiled_path(Some(dir))` + its unit tests already exist (`:650`, `:1345/:1351`) |
| F-3 | **Interrupt + compile-only leave no source-tree debris** — SIGINT mid-run and `--compile-only` both leave `test/` clean (debris, if any, lands in gitignored `target/`); the `--docs`+compile-only inconsistency (`:459–468` compiles then immediately cleans) resolved with a stated rationale | kill a run mid-way → `git status --porcelain test/` empty; `lykn test --compile-only` → same; rationale in closing report | serious | slice-doc (gap analysis) | open | | this is the failure mode the transient design couldn't cover |
| F-4 | **`.gitignore` covers `*_test.js`** — belt-and-suspenders for stray pre-existing debris; safe because zero tracked files match (verified 2026-07-05: 81 tracked tests are all `.test.js`) | `git check-ignore test/foo_test.js` succeeds; `git ls-files '*_test.js'` still 0 | polish | slice-doc | open | | do NOT ignore `*.test.js` (tracked, hand-written) |
| F-5 | **Suites green at baseline, rebuild-first** — no test semantics changed by relocation | `make check` ✓; `lykn test` ≥1365/0; `deno test --config project.json -A test/` ≥673/0; `make test-docs` 0 failed; clippy exit 0 | serious | standing bar | open | | baseline = arc10-close numbers |
| F-6 | **P-7 demo unconditionally runnable** — "grep source tree for compiled `.js` = 0" holds during/after any `lykn test` invocation mode | the three-moment demo transcript (mid-run, post-SIGINT, post-compile-only) in the closing report | serious | project ledger P-7 | open | | this is what arc11 exists to give arc09 |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> F-1 gates F-2 — if running from `target/` hits a real resolution blocker,
> stop and surface (the fallback space includes emitting an import-map shim
> or adjusting generated import specifiers — design calls, not silent
> hacks). Design sub-questions (dir naming/harmonization with the doctest
> dir; freshness guard; `--compile-only` UX) go in the closing report.
