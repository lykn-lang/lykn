# Slice 01: run-once-topology — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-05 · **Branch:** `release/0.6.x`
**Verdict: delivered.** Implemented my own A–D from the redundancy report:
every test runs **once** per `make check`; `make test-docs` tests **docs
only**. The measured win is large — `make test-docs` **1m53s → ~3s**.

---

## F-1 — Baseline (before-state)

From the 2026-07-05 redundancy report + a fresh timing:

| Metric (before) | Value |
|---|---|
| `surface/bind_test` corpus runs — `make test-docs` | **4×** (guides / README / examples-surface / examples-kernel) |
| `surface/bind_test` corpus runs — `make check` | **8×** |
| `make check && make test-docs` corpus runs | **~12×** |
| `make test-docs` wall | **1m52s** (85–94% corpus, not docs) |
| Crates recompiled (warm tree) | **0** (cost is Deno corpus re-execution, not compilation) |
| Doc-test payload per `--docs docs/guides/` | 16 doc files vs **88 corpus files** re-run |

---

## F-2 (A) — `--docs` without explicit patterns runs docs only

**The fix:** removed the clap `default_value = "test/"` on `patterns`. In
`cmd_test`, the `--docs` branch now compiles/runs the corpus **only when the
user passed explicit test patterns**; the non-docs path defaults to `test/` in
code. So `lykn test --docs docs/guides/` (bare) tests docs only; `lykn test
--docs X test/forms/` keeps the combined behavior; `lykn test` still defaults
to `test/`. **TDD:** `crates/lykn-cli/tests/docs_pattern_gating.rs` pins both
directions (bare `--docs` → no corpus-compile marker; `--docs` + explicit
pattern → marker present).

## F-3 (B) — one Deno startup for the doc phase

**Mechanism (chosen + rationale):** made `--docs` a **repeatable multi-path
flag** (`docs: Vec<String>`), and `run_doc_tests` accumulates doc files across
all paths → generates into the one doctest out-dir → runs `deno test` **once**.
`make test-docs` is now a single `lykn test --docs docs/guides/ --docs
README.md --docs examples/surface/ --docs examples/kernel/` — one Deno startup
instead of four. Chose multi-path `--docs` over a combined out-dir because it
reuses the existing generate-then-run flow verbatim (lower risk) and keeps the
granular `test-docs-{guides,readme,examples}` targets working (single-path) for
focused dev runs.

## F-4 (C) — honest targets

- **`test` chain:** `test-rust test-js test-lykn test-docs` → `test-rust
  test-suite test-docs`. `test-lykn`'s subset re-run is **out of the chain**.
- **Naming (surfaced):** `test-js` **renamed to `test-suite`** — bare `lykn
  test` runs the full 1365 (hand-written `*.test.js` **and** the compiled
  `.lykn` corpus), so "JS tests" was a lie. `test-lykn` **kept as a documented
  convenience alias** for surface-focused dev runs (not in `test`/`check`).
  `check-all` + `make help` updated.

## F-5 (D) — one build pass per `make check`

`common-checks: check-deps lint build` → `check-deps build-release lint`. Two
changes: (1) **build before lint** — `lint` runs `lykn check` and needs
`bin/lykn`, which `build` produces (a latent ordering fix); (2) **release
profile** — matching `fresh-artifacts`, so the workspace compiles **once**
(release) and `fresh-artifacts`' `cargo build --release` is a cache hit rather
than a separate debug full-build. Minor, per the ledger — incremental builds
already make it cheap on warm trees; this removes the redundant *profile*.

## F-6 — Counts, docs, timing

**Docs updated so `make check` is the canonical bar** (killing the `&& make
test-docs` habit at the source): `AGENTS.md` verify commands + `test/
CONVENTIONS.md` now state `make check` as the full bar and `make test-docs` as
the doc-focused iteration tool (no longer run alongside).

---

## Verification — the sentinel census + timing

**Sentinel census** (`surface/bind_test`, 11 tests), rebuild-first:

| | corpus runs of `surface/bind_test` |
|---|---|
| `make check` | **1** (only `target/lykn/test/…surface/bind_test.js`) |
| `make test-docs` | **0** |

**Counts (unchanged):** `lykn test` **1365 / 0**; `deno test --config
project.json -A test/` **673 / 0**; doc tests **475 / 0** (identical set — same
files, same blocks, now one Deno process); `make check` **✓ All checks passed**;
clippy clean. `find test -name '*_test.js'` after `make check` → **0** (no
source-tree debris created).

**Timing (measured):**

| | before | after |
|---|--------|-------|
| `make test-docs` | 1m52s | **2.6s** |
| `make check` | >2m00s (timed out at the 2m cap before; ~8× corpus) | **1m04s** |

**F-2 test:** `crates/lykn-cli/tests/docs_pattern_gating.rs` — passes (bare
`--docs` → no corpus-compile; `--docs` + explicit pattern → corpus compiled).

---

## Before / after

| | Before | After |
|---|--------|-------|
| `make test-docs` wall | **1m52s** | **~3s** |
| corpus runs in `make test-docs` | 4× | **0×** |
| corpus runs in `make check` | 8× | **1×** |
| Deno startups in the doc phase | 4 | **1** |
| `make check` build passes (workspace) | debug + release | **1 (release, cached)** |
| suites (`lykn test` / `deno test`) | 1365/0 · 673/0 | **unchanged** |
| doc-test count | (same files) | **unchanged** |

---

## Design-call rationales (surfaced)

1. **F-3 mechanism** — multi-path `--docs` (vs combined out-dir): lower-risk
   reuse of the existing flow; granular targets preserved.
2. **F-4 naming** — `test-js` → `test-suite` (honest); `test-lykn` kept as a
   documented dev alias rather than deleted (it's a useful surface-focused
   subset).
3. **F-5** — `build-release` before `lint`: fixes the lint-needs-`bin/lykn`
   ordering *and* dedups the profile; declined to strip the build entirely
   (lint depends on the binary).

## Bubble-up to arc12

- **Post-0.6.0 speed lever (filed, out of scope):** each corpus compile spawns
  ~97 per-file `deno eval` processes (`compile_lykn_test_files`). Batching them
  into one Deno process is the next big win, but it's a compiler-CLI change
  beyond topology.
- **`--compile-only` + `--docs` quirk (noted):** `run_doc_tests` ignores
  `--compile-only` and still runs the doc tests. Harmless; a candidate tidy.
- **The combined gate session** (arc10 §5 + arc11 §5 + arc12 A-2/A-3) is now
  cheap — one `make check` reproduces all three arcs' green bars.
- **Robustness observation (arc11-adjacent, filed):** `lykn test` points
  `deno test` at `test/`, whose default discovery includes `*_test.js` — so any
  **stray** compiled sibling in the source tree (from an old binary, a crash, or
  a pre-arc11 checkout) is discovered and double-run. I hit exactly this during
  the census (97 stray siblings, mtime-transient, gitignored → invisible to
  `git status`); cleaning them made the census exact, and `lykn test` itself
  never creates them (verified). A hardening: have `lykn test` run `test/`'s
  **`*.test.js`** hand-written tests explicitly and the compiled corpus only from
  `target/`, so stray `*_test.js` can't be picked up. Not arc12's scope
  (topology), but a real edge.
- **Freshness-guard false-positive (minor, filed):** `check_cross_compiler_
  freshness` compares the binary against `crates/` broadly; a newer
  `crates/lykn-cli/tests/*.rs` file (not recompiled by `cargo build`) trips it
  even though the compiler is current. Scope it to `src/` in a future tidy.

## Discipline notes

- Topology only — no change to *what* any test verifies; counts hold exactly.
- Surfaced the F-3 mechanism, F-4 naming, F-5 approach (above).
- `docs/design-v0.6.0/**` left to CDC except this closing report. Source only.

Handed back for CDC `cdc-verification.md`.
