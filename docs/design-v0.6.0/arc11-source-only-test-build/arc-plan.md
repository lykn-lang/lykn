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
| **slice01 · test-out-dir** | Wire `--out-dir` (default `target/lykn/test/`): compile `.lykn`/`.lyk` test files there, run Deno against it, wipe-per-run like the doctest dir; `--compile-only` writes there too; interrupt debris lands in gitignored `target/`, never `test/`; add `*_test.js` to `.gitignore` as belt-and-suspenders for pre-existing stray debris; un-hide the flag + document. Recon-first: compiled tests' relative/import-map resolution when run from `target/` (the likely reason for the April sibling design). | **Closed** (`75c9cc2`; recon caught 7 location-dependence items in 5 files, fixed; fossil deleted; exclude declined w/ rationale; three-moment demo clean; 1365/0 · 673/0 · `make check` ✓) |
| **slice02 · buried-intent-audit** | Sweep the marker inventory (TODO/FIXME/"for now"/"reserved"/`hide = true`/underscore-silenced params/`allow(dead_code)`) + doc-claims-vs-code spot-checks; produce a disposition table: every hit **wired, retired, or given a tracked row**; includes the `surface.rs:294` deprecation whose DD-58 trigger has fired. **Inherits from slice01's bubble-up:** reserved-plumbing sweep of `main.rs`; test-source location-dependence conventions note + arc05 lint-rule candidate; canonical-test-command documentation (`-A test/` is supported; unscoped is not); doctest-dir harmonization (`target/test/doctest` → `target/lykn/`, filed with reason). | **Open** (planned; scope next — arc11's last slice) |

## 3. Dependencies

Consumes arc01 (the `target/lykn/` discipline) and the doctest precedent.
Independent of arc05 (parallel OK). **Gates arc09**: P-7's project-scale demo
("grep source tree for `.js` = 0") must hold *during and after any run*, not
just at rest, before the release cut. Sequence of open work: arc10-gate →
(arc11 ∥ arc05) → arc06 → arc07 → arc09.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (test-out-dir) closed | ptr: slice01 cdc-verification | serious | arc-plan | **done** | slice01 `cdc-verification.md` (accepted 2026-07-05; commit `75c9cc2`) — attested (pointer to closed child ledger) | |
| A-2 | slice02 (buried-intent-audit) closed | ptr: slice02 cdc-verification | correctness | arc-plan | open | | |
| A-3 | **source tree is `.js`-free at every moment** — during a `lykn test` run, after Ctrl-C mid-run, and after `--compile-only` (tracked hand-written `.test.js` files excepted) | arc-scale demo: start `lykn test`, interrupt it, then `git status --porcelain test/` + `find test -name '*_test.js'` → empty; repeat with `--compile-only` | serious | operator observation 2026-07-05 | open | | reproduce at arc scale on host |
| A-4 | **buried-intent inventory is empty-or-tracked** — the marker sweep returns only hits with a written disposition (wired / retired / tracked row) | slice02 disposition table; re-run the sweep, diff against the table | correctness | CDC systemic finding | open | | the anti-"delayed, deferred, buried, lost" row; the `target/test/lykn/` orphans join the exhibit list (dead artifacts of a retired mechanism) |
| A-5 | **unscoped `deno test --config project.json` does not abort on generated or orphaned artifacts** — the April fossil is gone and generated output resolves cleanly (bare specifiers) | run it unscoped; no TS2307 from `target/**` | correctness | operator deno-test issue + CC investigation 2026-07-05 | **met (attested)** | slice01: fossil deleted (CDC-reproduced) + 0 target errors unscoped (attested). **Amended (v1.2; was: "discovery excludes `target/`")** — the exclude mechanism was empirically invalidated (Deno's config `exclude` filters even explicitly-passed paths, which would break `lykn test`'s own out-dir run); goal met without it. Residual: unscoped runs double-run the corpus + need `-A` — not a supported invocation; canonical-command doc → slice02 |

## 5. Version History

### v1.2 — 2026-07-05 (slice01 closed; A-5 amended)
slice01 closed (`75c9cc2`, CDC-verified): `--out-dir` live (default
`target/lykn/test/`, wiped per run, un-hidden); the F-1 recon caught 7
location-dependence items in 5 files (2 relative imports → bare specifiers;
5 `import.meta.dirname` → operator-decided `Deno.cwd()`-anchoring;
recurrence greps 0, CDC-reproduced); April fossil deleted; three-moment
demo clean — **P-7's demo is unconditionally runnable**. **A-5 amended**
(was: "discovery excludes `target/`"): CC empirically invalidated the
exclude mechanism (Deno's config `exclude` filters explicitly-passed paths
→ would break the out-dir run itself); the row's goal (no unscoped TS2307
abort) is met without it. A-1 → done. slice02's inventory gains four
bubble-up items (see breakdown). Surfaced by: slice01 close.

### v1.1 — 2026-07-05 (CC deno-test investigation folded in)
The operator's unscoped `deno test` failure, investigated by CC, added three
grounded facts to slice01 and one arc row: (1) **the April blocker,
fossilized** — `target/test/lykn/` holds Apr-18 orphans from a retired
target-dir emission mechanism, whose **relative** imports broke off-site;
today's import-map bare specifiers dissolve that blocker, so F-1's recon
prior flips to *should-work-now*; (2) **no `exclude` in `project.json`** —
Deno walks `target/` on unscoped runs and aborts on the orphans (TS2307);
slice01 gains **F-7** (delete the fossil; exclude `target/`), without which
the new output dir would recreate the same failure; (3) a permission-scope
footnote (67 failures without `-A`; documented command unaffected; noted
for slice02's audit). Arc ledger gains **A-5** (unscoped discovery doesn't
abort). Surfaced by: operator test-run issue + CC report, 2026-07-05.

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
