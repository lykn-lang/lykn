# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

Composition criteria that verify the capability. Class-(b) rows are **reproduced
at arc scale** (the mycelium end-to-end demo), never inherited. Opens here;
per-row walk closes in `closing-report.md`. (A-5…A-7 firm up when slices 03/04
are detailed post-audit.)

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (lang-exports-gap) closed | ptr: slice01 closing-report + cdc-verification | correctness | round-2 | done | Finding-D closing + CDC review (attested) | |
| A-2 | slice02 (mycelium re-audit) closed | ptr: slice02 cdc-verification | serious | arc-plan | **done** — reconciled | slice02 cdc-verification (a2e9b00) | the ground-truth inventory |
| A-3 | slice03 (`lykn add`) closed | ptr: slice03 cdc-verification | serious | arc-plan | **done** — reconciled | slice03 cdc-verification (f9f9014) | DD-63-backed |
| A-4 | slice04 (`lykn link`/`unlink`) closed | ptr: slice04 cdc-verification | serious | arc-plan | **met — REPRODUCED** (operator, Part B) | slice04 cdc-verification (e1c0dd7); **host Part B**: require-built guard rc=1 w/ actionable message; overlay git-ignored (`check-ignore`); `project.json` untouched; **`lykn dist` → 0 `localdep` in staged config**; unlink lossless | safety property architecturally guaranteed |
| A-5 | **`lykn add <specifier>` adds a dependency to a project and it resolves** — end-to-end on a fixture project | run `lykn add`; the added dep imports + compiles | serious | arc-plan / DoD (P-6) | **met — REPRODUCED** (operator, Part A) | **host Part A**: `npm:astring` → `@1.9.0` exact (no caret) + bare/slash pair; jsr pair `@1.0.19`; macro-module note; re-add idempotent (1 key); bad specifier rc=2; 404 rc=1 with `project.json` **unchanged**; probe compiles | reproduced at arc scale |
| A-6 | **mycelium builds *and tests* green as a downstream of current lykn** (the composition demo) | host: mycelium → `lykn build` + **`lykn test`** + `lykn publish --dry` green | serious | arc-plan | **met — REPRODUCED** (operator, Part C) | **host Part C**: mycelium `lykn build` ✓ · `lykn test` **43/0** · publish-dry green. **Part C-bis also green**: links current-source testing → 43/0, and the negative check (rename the local dist) fails at the local path, proving the override live | **A-6's concrete bar = downstream `lykn test` green** (slice02 finding). RED today — **N1** (test's relative `../render.js` dangles under `target/`) → **slice05**. host-only |
| A-7 | every mycelium-bootstrap issue is dispositioned — fixed / fixed-in-arc06 / routed-with-home / documented-only | ptr: slice02 inventory + the routing table | correctness | mycelium report | **met** | slice02 inventory (14) + N1–N4 all routed — see `closing-report.md` A-7 | no silent drops from the 14-issue list |
| A-8 | slice06 (version-consolidation) closed | ptr: slice06 closing-report + cdc-verification | polish | operator runsheet pass (v1.3) | **met** | slice06 cdc-verification (2026-07-24): V-1…V-6 verified; one workspace version, `0.6.0-dev` across Rust+JS, registry pins + scaffold untouched, snapshots clean (independently grepped) | added v1.3 — was absent from this ledger while the slice was already committed. Sweep routed a stale-`dist/` precondition → arc09 |
| A-9 | slice07 (link-registry-specifier) closed — `lykn link jsr:@scope/pkg@ver <path>` redirects a literal registry specifier **for a macro module** to a local dist staging (a *runtime* import of a linked specifier errors rather than silently resolving to the published package; full runtime override → 0.7.0) | ptr: slice07 closing-report + cdc-verification | serious | operator runsheet pass (v1.3) | **met** | slice07 cdc-verification (2026-07-24): 9 rows verified at HEAD after iteration 1 resolved all six review findings (F1 blocking regression fixed + covered by 4 new table tests; guard now tested; scope narrowed to the demonstrated capability) | scope line carries the macro-module boundary so the arc ledger does not inherit the pre-iteration overclaim |

