# Slice 01: test-out-dir — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-05 · **Branch:** `release/0.6.x`
**Verdict: delivered — with two F-1 recon adaptations (both surfaced).**
`lykn test` now compiles `*_test.lykn`/`.lyk` into **`target/lykn/test/`** (wiped
per run), never the source tree — finishing philosophy.md commitment #1 for the
last source-tree emitter. Generated `.js` never lands under `test/` at any
moment (mid-run, post-SIGINT, post-`--compile-only`). P-7's demo is now
unconditionally runnable.

---

## F-1 — Recon (gated F-2; the prior was *partially disconfirmed*)

The slice-doc's grounded prior — "today's test sources import bare import-map
specifiers, location-independent, so relocation *works now*" — was **verified,
and found incomplete**. Compiling the corpus into `target/lykn/test/` and running
from there surfaced **two** categories of location-dependence the recon caught
before wiring shipped:

**Finding 1 — relative source imports (2 files).**
`test/expander/import-macros_test.lykn` and `macro-module-chain_test.lykn` used
`(import "../../packages/lang/compiler.js" (compile))` — a **relative** path to
*source* that resolves to `target/lykn/test/packages/lang/compiler.js` (absent)
when relocated. This is the slice-doc's sanctioned "adjust generated import
specifiers" fallback, so I fixed it in place: → `(import "lang/compiler.js" …)`,
the import-map bare specifier every other test already uses (built
`lang/compiler.js` exports `compile`; verified).

**Finding 2 — `import.meta.dirname` fixture resolution (5 files)** — *surfaced,
operator chose the fix.* The `import-macros` / `macro-module` / `testing-dsl`
tests located fixtures with `resolve(import.meta.dirname, "../fixtures/macros")`
— relative to the **test file's on-disk location**, which changes on relocation
→ `macro module not found: ./basic-control.lykn` (38 failures). Not an import
specifier, so I **stopped and surfaced**. Operator (2026-07-05) chose
**`Deno.cwd()`-relative** (project-root anchored), matching `compileBoth`'s
existing project-root-cwd contract. Applied to all 5:
`(resolve (Deno:cwd) "test/fixtures/macros")` (and `"packages/testing"` for
`testing-dsl`). Verified: each runs green from `target/`.

**Recurrence check (the point of F-1):** after both fixes,
`grep -rE '\(import "\.\./' test/**/*.lykn` and `grep import:meta:dirname` are
both **empty** — no location-dependent specifiers remain in generated output, so
the April-orphan failure mode cannot recur.

Other recon checks — clean: `compileBoth` rows work from `target/` (Deno.cwd() =
project root under `lykn test`); the freshness guard (`check_cross_compiler_
freshness`) guards `bin/lykn` + `target/lykn/build/`, orthogonal to the test
out-dir; `--config project.json`'s import map resolves bare specifiers
location-independently.

---

## F-2 — `--out-dir` wired

`cmd_test` now defaults `out_dir` to **`target/lykn/test/`** (`DEFAULT_TEST_OUT_
DIR`; arc01-aligned with `build`/`dist`), passes `Some(out_dir)` to both
`compile_lykn_test_files` call sites, and **wipes the dir per run** (`wipe_test_
out_dir` — the doctest-runner `remove_dir_all` + recreate pattern). The Deno run
points at the original dir patterns (hand-written `*.test.js`) **plus** the
out-dir (compiled `*_test.js`) — preserving the full 1365-test set (81
hand-written `.test.js` = 673, + the compiled corpus). Specific-file invocations
run just their compiled outputs. `compute_compiled_path(Some)` (already
unit-tested) does the path mapping. `--out-dir` is **un-hidden + documented**
(`lykn test --help` shows it; `--out-dir /tmp/x` respected). `--compile-only`
writes to the out-dir and **prints the target path**.

---

## F-3 — No source-tree debris (the transient design's gap, closed)

Because output now lives under gitignored `target/`, the interim design's failure
modes are structurally gone: SIGINT/crash mid-run and `--compile-only` leave
`test/` clean (any debris is in `target/`, wiped next run). `clean_compiled_test_
files` (the old post-run sibling cleanup) is **removed** — wipe-per-run
supersedes it. **`--docs`+`--compile-only` inconsistency resolved:** it no longer
"compiles then immediately cleans"; it compiles to the out-dir and prints the
count/path, consistent with the main `--compile-only` branch.

## F-4 — `.gitignore` covers `*_test.js`

Added `*_test.js` (belt-and-suspenders; output now goes to `target/` anyway).
Verified safe: `git ls-files '*_test.js'` = **0** (all 81 hand-written tests are
`*.test.js`, which is **not** ignored).

## F-7 — Discovery hygiene (fossil deleted; exclude *declined*, with rationale)

- **Fossil deleted:** `target/test/lykn/` (April orphans with dead relative
  imports — the actual cause of the TS2307 abort I diagnosed) is removed.
- **`project.json` `target/` exclude — declined (design-call, surfaced).** The
  slice-doc delegated the mechanism ("top-level vs `test.exclude` — CC's call")
  and expected an exclude added. Empirically, **both** forms filter *even
  explicitly-passed* `target/` paths (Deno returns "No test"), so a `target/`
  exclude would **break `lykn test`'s own `target/lykn/test/` run** and doctests'
  `target/test/doctest/` run. And it is **unnecessary**: the fossil deletion +
  the F-1 bare-specifier fix mean the new `target/lykn/test/` output resolves
  cleanly, so unscoped `deno test --config project.json` **no longer aborts
  with TS2307** (verified: 0 target-related errors). The exclude premise
  ("new output recreates the failure") was invalidated by the bare-specifier
  fix. Net: F-7's *goal* (no TS2307 from `target/**`) is met; its proposed
  *mechanism* is dropped as incompatible. (Unscoped `deno test` still needs
  `-A` and double-runs the corpus — pre-existing, documented; the supported
  command remains `deno test --config project.json -A test/`.)

---

## F-5 / F-6 — Verification (rebuild-first)

**Observed (2026-07-05, rebuild-first):**
- `make check` → **`✓ All checks passed (build + lint + test)`** (exit 0) —
  includes clippy `-D warnings` and `make test-docs`.
- `lykn test` → **`1365 | 0`** (baseline held); `deno test --config project.json
  -A test/` → **`673 | 0`** (baseline held).
- `make test-docs` → 0 failed. `cargo test` (incl. `compute_compiled_path` unit
  tests) 0 failed. `cargo clippy --all-features --workspace -- -D warnings` clean.
- `find test -name '*_test.js'` → **0**; `git status --porcelain test/` (generated
  `.js`) → **0**. Compiled corpus lands under `target/lykn/test/` (97 files).
- Unscoped `deno test --config project.json` → **0** TS2307/target errors (fossil
  gone, bare specifiers resolve).

**Three-moment demo (F-6, P-7 at slice scale)** — `find test -name '*_test.js'`
and `git status --porcelain test/ | grep _test.js` both **empty** at every
moment:

| Moment | `test/` `*_test.js` |
|--------|---------------------|
| mid-run (sampled from a concurrent process) | 0 |
| after mid-run SIGINT | 0 |
| after `--compile-only` | 0 |
| after `--docs --compile-only` | 0 |

---

## Design-call rationales (surfaced)

1. **Directory naming** — `target/lykn/test/` (arc01-aligned with
   `target/lykn/{build,dist}`). **Doctest-dir harmonization
   (`target/test/doctest` → under `target/lykn/`) filed, not done:** it is a
   one-line constant in `doctest.rs`, but `run_doc_tests` also does discovery/
   cleanup around it and the change wants its own verify pass — routed to
   slice02's disposition table rather than folded in here.
2. **Freshness guard** — no change needed; it guards `bin/lykn` +
   `target/lykn/build/`, not the test out-dir (verified: `lykn test` green,
   guard active).
3. **`--compile-only` UX** — prints `Compiled N .lykn test file(s) to
   target/lykn/test.` (the target path), so the use-case (inspect compiled JS)
   survives the relocation.
4. **F-7 exclude mechanism** — declined; see F-7 above.

---

## Bubble-up to arc11 (for slice02's buried-intent audit)

- **`main.rs` reserved-plumbing pattern confirmed:** `--out-dir` was a hidden
  "reserved for future use" flag threaded as `_out_dir` and ignored — exactly the
  buried-intent shape slice02 audits. Now live. Worth a sweep for other
  `_`-prefixed ignored params / `hide = true` flags.
- **Test-source location-dependence is a latent class:** 7 files (2 relative
  imports + 5 `import.meta.dirname`) assumed compile-beside-source. Fixed here;
  slice02 could add a lint/guard so new tests use bare specifiers + `Deno.cwd()`
  and don't regress the source-only property.
- **The `project.json` exclude tension** (generated tests live under `target/`,
  which any `target/` exclude would filter) is worth a project-level note: the
  supported test entry is the scoped `-A test/` command; unscoped `deno test`
  is not supported (needs `-A`, double-runs). Candidate: a `deno task` in a
  `deno.json`, or documenting the scoped command as canonical.

## Discipline notes

- F-1 ran before F-2; recon disconfirmed part of the prior → surfaced both
  findings (one fixed under the sanctioned fallback, one operator-decided) before
  wiring shipped.
- Suite numbers held at baseline (relocation changed *where* tests compile, not
  *what* runs).
- No safety-gate bypass; the publish dirty-check keeps working (with less
  generated-`.js` noise to catch).
- `docs/design-v0.6.0/**` left to CDC except this closing report. Source only.

Handed back for CDC `cdc-verification.md`.
