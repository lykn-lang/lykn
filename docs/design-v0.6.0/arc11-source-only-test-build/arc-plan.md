# arc11 — Source-Only Test Build (+ buried-intent closeout)

> **Status: Open — scoped 2026-07-05.** Created from an operator observation
> during the arc10 composition run (compiled `_test.js` siblings visible in
> `test/` mid-run) + CDC ground-truthing. Appended as arc11 by **creation
> order**; dependency-wise it is independent of arc05 (may run parallel or
> before) and **must land before arc09** (it gates the P-7 DoD demo).

## 1. Capability

Finish `philosophy.md` commitment #1 (source-only tree) for the **last
remaining source-tree emitter**, and close out the *class* of failure this
instance exemplifies:

1. **`lykn test` compiles to `target/`, not to `test/`.** Today
   `compile_lykn_test_files` emits sibling `_test.js` files into the source
   tree, runs, then deletes them (`main.rs:498–529`, the April interim
   design, `a640398`). Transient by design — but an interrupted run strands
   debris, `--compile-only` leaves it deliberately, `.gitignore` doesn't
   cover `*_test.js`, and P-7's "no `.js` in source tree" demo only holds at
   rest. The `--out-dir` flag already exists, hidden, annotated *"reserved
   for future use"* (`main.rs:81–83`), received as `_out_dir` and ignored
   (`main.rs:447`). **Doctests already do this right** —
   `target/test/doctest/`, wiped per run (`doctest.rs:553–558`) — so there
   is an in-repo pattern to copy.
2. **Buried-intent audit.** This is the third instance of one signature this
   cycle — *intent captured in an artifact but never wired to behavior, with
   no ledger row watching it* (stranded branches; DD-58 wired to `lykn test`
   only; `--out-dir` reserved-and-ignored). The signature is grep-able and
   the sweep is small (~10 marker hits repo-wide, CDC-sized 2026-07-05).
   Sweep it once, disposition every hit (wire / retire / track), so the rest
   of 0.6.0 stops tripping over them. Already-known candidates:
   `surface.rs:294` (a `TODO: deprecate when surface/kernel syntaxes are
   separated` — **its trigger fired when arc10 closed**), `icu.rs:696`
   (span-attribution TODO), `cmd_lint` stub (tracked — arc05), the
   `hide = true` flag itself (slice01 unhides it).

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · test-out-dir** | Wire `--out-dir` (default `target/lykn/test/`): compile `.lykn`/`.lyk` test files there, run Deno against it, wipe-per-run like the doctest dir; `--compile-only` writes there too; interrupt debris lands in gitignored `target/`, never `test/`; add `*_test.js` to `.gitignore` as belt-and-suspenders for pre-existing stray debris; un-hide the flag + document. Recon-first: compiled tests' relative/import-map resolution when run from `target/` (the likely reason for the April sibling design). | **Open — scoped** (open set written) |
| **slice02 · buried-intent-audit** | Sweep the marker inventory (TODO/FIXME/"for now"/"reserved"/`hide = true`/underscore-silenced params/`allow(dead_code)`) + doc-claims-vs-code spot-checks; produce a disposition table: every hit **wired, retired, or given a tracked row**; includes the `surface.rs:294` deprecation whose DD-58 trigger has fired. | **Open** (planned; scope after slice01 per plan-late-plan-deep) |

## 3. Dependencies

Consumes arc01 (the `target/lykn/` discipline) and the doctest precedent.
Independent of arc05 (parallel OK). **Gates arc09**: P-7's project-scale demo
("grep source tree for `.js` = 0") must hold *during and after any run*, not
just at rest, before the release cut. Sequence of open work: arc10-gate →
(arc11 ∥ arc05) → arc06 → arc07 → arc09.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (test-out-dir) closed | ptr: slice01 cdc-verification | serious | arc-plan | open | | |
| A-2 | slice02 (buried-intent-audit) closed | ptr: slice02 cdc-verification | correctness | arc-plan | open | | |
| A-3 | **source tree is `.js`-free at every moment** — during a `lykn test` run, after Ctrl-C mid-run, and after `--compile-only` (tracked hand-written `.test.js` files excepted) | arc-scale demo: start `lykn test`, interrupt it, then `git status --porcelain test/` + `find test -name '*_test.js'` → empty; repeat with `--compile-only` | serious | operator observation 2026-07-05 | open | | reproduce at arc scale on host |
| A-4 | **buried-intent inventory is empty-or-tracked** — the marker sweep returns only hits with a written disposition (wired / retired / tracked row) | slice02 disposition table; re-run the sweep, diff against the table | correctness | CDC systemic finding | open | | the anti-"delayed, deferred, buried, lost" row |

## 5. Version History

### v1.0 — 2026-07-05 (created)
Created from the operator's observation during the arc10 composition run +
CDC ground-truthing (sibling-emission design `a640398`; reserved `--out-dir`
never wired; doctest precedent at `doctest.rs:553`; marker sweep sized at
~10 hits). Two slices: wire the test build dir (scoped now); sweep +
disposition the buried-intent inventory (scoped after slice01). Recorded at
project scale as P-16 (project-plan v1.16). Origin note: this arc
operationalizes the operator's named systemic failure mode — *features
delayed, deferred, or buried, then lost* — the pre-framework plague; A-4 is
its standing countermeasure for 0.6.0.
