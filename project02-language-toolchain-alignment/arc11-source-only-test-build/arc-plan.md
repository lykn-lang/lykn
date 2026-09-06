# arc11 — Source-Only Test Build (+ buried-intent closeout)

> **Status: CLOSED — gated by the operator 2026-07-05** (host runs: A-3
> three-moment with `./bin/lykn` at 23:31; A-4 sweep + A-5 from the earlier
> session; see [`closing-report.md`](closing-report.md) §7). Created and
> fully executed same day from an operator observation: slice01 (`75c9cc2`,
> test-out-dir) + slice02 (`4f2a628`, buried-intent-audit). No compiled JS
> in the source tree at any moment; buried-intent inventory empty-or-
> tracked. P-7's demo unconditional — arc09 unblocked on this front.

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
| **slice02 · buried-intent-audit** | Sweep the marker inventory (TODO/FIXME/"for now"/"reserved"/`hide = true`/underscore-silenced params/`allow(dead_code)`) + doc-claims-vs-code spot-checks; produce a disposition table: every hit **wired, retired, or given a tracked row**; includes the `surface.rs:294` deprecation whose DD-58 trigger has fired. **Inherits from slice01's bubble-up:** reserved-plumbing sweep of `main.rs`; test-source location-dependence conventions note + arc05 lint-rule candidate; canonical-test-command documentation (`-A test/` is supported; unscoped is not); doctest-dir harmonization (`target/test/doctest` → `target/lykn/`, filed with reason). | **Closed** (`4f2a628`; 13-item disposition table; 3 wired fixes; SetSymbol routed; `test/CONVENTIONS.md` + AGENTS.md; doctest dir → `target/lykn/test/doctest`; sweep-diff clean, CDC-reproduced; 1365/0 · 673/0 ✓) |

## 3. Dependencies

Consumes arc01 (the `target/lykn/` discipline) and the doctest precedent.
Independent of arc05 (parallel OK). **Gates arc09**: P-7's project-scale demo
("grep source tree for `.js` = 0") must hold *during and after any run*, not
just at rest, before the release cut. Sequence of open work: arc10-gate →
(arc11 ∥ arc05) → arc06 → arc07 → arc09.

## 4. Arc ledger

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.4 — 2026-07-05 (slice02 closed; arc → CLOSING)
slice02 closed (`4f2a628`, CDC-verified): 13-item disposition table (9 seed
+ 4 new — genfunc multi-clause silent drop, reader block-comment stub,
doctest nested-fence limit, nested-destructure deferral — all tracked with
homes + re-entry); 3 fixes wired (kernel-mark comment, `js:eq` guard re-key,
SetSymbol TODO → tracked-home comment); `test/CONVENTIONS.md` + AGENTS.md
docs; doctest dir → `target/lykn/test/doctest`. **A-4 met — CDC
independently reproduced the sweep-diff** (8 hits, zero orphans). Tracked
homes instantiated: project-plan §Post-0.6.0 candidates (v1.17); arc05 seed
(2 lint rules). A-2 → done; **arc → CLOSING** (closing-report written;
host composition run + operator gate = the formal close). Surfaced by:
slice02 close.

### v1.3 — 2026-07-05 (slice02 scoped)
slice02 (`buried-intent-audit`) open set written, grounded in a fresh
post-slice01 sweep: **9-item seeded inventory** (surface.rs:294 SetSymbol
TODO [trigger fired at arc10 close — F-4 assess-and-route, operator
decides]; icu.rs:696; the two arc10-routed cosmetic defects [kernel-mark
comment, macroEnv guard — F-3, ending their drive-by limbo]; the cmd_lint
stub [tracked, arc05]; slice01's four bubble-up items) + a **benign-filter
rule** (describes-now = noise; should-someday = inventory). A-4's closure
evidence = the sweep-rerun diff at slice close. arc11's last slice.
Surfaced by: operator go-ahead + slice01 bubble-up.

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
