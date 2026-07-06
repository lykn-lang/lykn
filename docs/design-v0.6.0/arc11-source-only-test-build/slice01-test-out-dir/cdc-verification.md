# Slice 01: test-out-dir — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-05
**Verdict: accepted — slice01 closed.** `lykn test` output now lands in
`target/lykn/test/` (wiped per run), never the source tree; the reserved
`--out-dir` is live and public; the April fossil is gone; P-7's demo is
unconditionally runnable. One documented deviation (F-7's exclude mechanism,
declined with empirical rationale) — accepted as a contract amendment, and
the arc ledger's A-5 row is amended accordingly (was:-noted).

## Verification (git + code review + grep; runtime CC-attested)

Commit: **`75c9cc2` confirmed on `release/0.6.x`**. Diff: 8 files — `main.rs`
(+73/−29: wiring), `.gitignore` (+4), the 5 `.lykn` test files (path edits),
`deno.lock` (incidental, disclosed).

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 recon | Trace complete: **7 items / 5 files** (2 relative imports fixed under the sanctioned fallback; 5 `import.meta.dirname` → the operator-decided `Deno.cwd()`-anchoring — sample diff verified: `(resolve (Deno:cwd) "packages/testing")`). **Recurrence greps independently reproduced: both 0** (no relative imports, no `import.meta.dirname` in `.lykn` tests). compileBoth/freshness-guard checks attested-clean. | **reproduced** (grep/diff) + attested |
| F-2 wiring | **Code-reproduced**: `DEFAULT_TEST_OUT_DIR = "target/lykn/test"` (`main.rs:451`), defaulted at `:463`, `wipe_test_out_dir` called at both compile sites (`:470`, `:518`), flag un-hidden. Deno run spans original dirs + out-dir (1365 count preserved — attested). | reproduced (code) + attested |
| F-3 debris modes | Structural: output under gitignored `target/`; old sibling cleanup removed; `--docs`+`--compile-only` inconsistency resolved (compiles to out-dir, prints path). Three-moment demo attested (see F-6). | reproduced (code) + attested |
| F-4 gitignore | **Reproduced**: `.gitignore:8` `*_test.js` with rationale comment; `git ls-files '*_test.js'` = 0; `.test.js` not ignored. | reproduced (grep) |
| F-5 baseline green | Attested rebuild-first: `make check` ✓ (incl. test-docs + clippy), `lykn test` 1365/0, deno 673/0. Per-file coverage-preserved holds: the 5 edits touch fixture-path *resolution* only (verified by diff — assertions untouched). Conventions note: **carried to slice02's bubble-up** (CC routed the lint/guard idea there — acceptable home; watch it lands). | reproduced (diff) + attested |
| F-6 P-7 demo | Three-moment table attested (mid-run / SIGINT / `--compile-only` / `--docs --compile-only` all 0); **at-rest state independently reproduced**: `find test -name '*_test.js'` = 0 in the current tree. | reproduced (at-rest) + attested (moments) |
| F-7 discovery hygiene | **Fossil deletion reproduced**: `target/test/` now holds only `doctest/`. **Exclude declined — deviation accepted**: CC empirically found Deno's config `exclude` filters even explicitly-passed paths (consistent with known Deno behavior), so a `target/` exclude would break `lykn test`'s own out-dir run and the doctest run; and the goal (no TS2307 abort on unscoped runs) is met by fossil-deletion + bare specifiers (attested: 0 target errors unscoped). Goal met, mechanism dropped — a legitimate amendment, not a softpedal. Residual wrinkle disclosed: unscoped `deno test` double-runs the compiled corpus and needs `-A`; **not a supported invocation** — the canonical command note routes to slice02/project docs. | reproduced (fossil) + attested (behavior) |

Rows: 7/7 walked. Done: 7 (F-7 with amended mechanism). Deferred: 0.
No-op: 0. **No silent drops** — the deviation, the `deno.lock` incidental,
and the doctest-dir harmonization (filed → slice02, with the reason it
wasn't folded in) are all disclosed.

## Bubble-up check

- Delivered its assigned arc piece: **yes** — A-3's three-moment property
  holds at slice scale; the last source-tree emitter is gone.
- Silent-drop diff: clean.
- arc-plan change required: **yes** — A-1 → done; **A-5 amended** (the
  criterion's "discovery excludes `target/`" mechanism was invalidated
  empirically; the goal stands, re-worded with a was:-note); slice02's
  audit inherits three items from CC's bubble-up (reserved-plumbing sweep;
  location-dependence lint/guard + conventions note; canonical-test-command
  documentation). Done this pass (arc-plan v1.2).

## Disposition

- **slice01 closed.** Operator host re-run reconciles runtime rows
  (standing). slice02 (buried-intent-audit) is now arc11's last slice —
  its inventory gains CC's three bubble-up items on top of the ~10 marker
  hits.
