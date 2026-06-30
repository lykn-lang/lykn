# arc04 — Refactor Tooling (`move-function`)

> **Status: Tool built, proven, and delivering — slices 01–04 closed.** The
> `move-function` tool drove the full surface extraction: slice03 (M22.5-2, 10
> helpers) and slice04 (M22.5-3, the 4 complex-form emitters, byte-identical incl.
> `emitMatchMacro`). **DD-37's implementation migration is finished** — all
> complex-form emit logic is in `classifier.js`; `surface.js` is down to ~540
> lines (was 2,315 pre-DD-37) and `classifier.js` imports nothing from it. Only
> **slice05 = M22.5-4** remains (dead-code `buildThread`/`buildSomeThread` +
> `_kernel` cleanup — clears the last 2 `deno lint packages/` residuals → exit 0).
> The tool also gained a tested **TO-as-consumer import-prune** capability in
> slice04. Reconstructed retroactively (2026-06-28) from the M22.5 tooling track.
>
> **Follow-up (slice02):** the F-7 freshness guard is **too broad** — it fires
> for *any* `lykn test` over `.lykn` files (it broke the `lyk_runner_kernel_only`
> cargo tests until a rebuild). It should be scoped to the cross-compiler corpus.
> Tracked as a slice02 follow-up.

## 1. Capability

A byte-exact `move-function` tool that relocates a function between files
without changing its text, then rewires cross-file consumers — the tool the
DD-37 surface-extraction workstreams (M22.5-2, M22.5-3) are meant to be
executed *with*, so that large mechanical surface refactors are verifiable
rather than hand-edited. The tool's own development follows ledger discipline
(TDD-first paired commits, grep-verifiable Verify), and respects the *spirit*
of the CLAUDE.md safety gates (never silently bypass its own verify step).

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · move-function-core** | M22.5-T1a: verbatim-move core — edits only the two named files, validated on a zero-external-consumer helper | **Closed** (9/9; `scripts/move-function.js` TDD-first; byte-identity invariant verified) |
| **slice02 · move-function-rewiring** | M22.5-T1b: cross-file consumer rewiring + batch mode + atomic multi-file revert + rebuild-first verify | **Closed** (7/7, F-4 adapted; TDD-first; rewiring proven on the real `toJsIdentifier` consumer since the M22 andChain/classifier split doesn't exist on `release/0.6.x`) |
| **slice03 · helper-extraction** (M22.5-2) | First **real** extraction: move the 10 aliased helpers `surface.js`→`surface-helpers.js` (dependency-ordered, byte-exact, via the tool), rewire consumers, drop the alias | **Closed** (`266ff3d`; 10/10 byte-identical via the tool; corpus 1345/0; F-8 deno-lint-packages residual = pre-existing M22.5-3/4 debt) |
| **slice04 · complex-form-extraction** (M22.5-3) | Move the 4 complex-form emitters (`emitMatch/Type/GenfuncMacro` + `buildSingle/MultiClauseFunc`, +5 support) `surface.js`→`classifier.js` byte-exact; relocate shared `typeRegistry` to `surface-helpers.js` (single instance) | **Closed** (`ff481b4`; 10/10 byte-identical incl. `emitMatchMacro`; `typeRegistry` single instance; no surface↔classifier cycle; corpus 1345/0; deno-lint 4→2). **DD-37 impl migration FINISHED** |
| **slice05 · cleanup** (M22.5-4) | Delete dead `buildThread`/`buildSomeThread` → `deno lint packages/` exit 0; assess (not remove) the `_kernel` marker (DD-37 step 4) | **Open — scoped** (slice-doc + ledger + cc-prompt ready for CC) |

slices 01–02 built the tool; **slice03 onward use it** for the real surface
extraction. slice03 (M22.5-2) landed the helpers; **slice04 = M22.5-3** (the 4
complex forms — the hardest, with the shared-`typeRegistry` hazard); then
**slice05 = M22.5-4** (dead-code + `_kernel` cleanup, also clears the last
`deno lint packages/` residuals). This expands arc04's scope
from "build the tool" to "the move-function refactor end-to-end (build + drive the
surface extraction)." See the M22 audit
(`../arc03-compiler-coherence/slice08-dd37-per-form-migration/design/m22-audit-report.md`)
§"Suggested workstream segmentation". *(If you'd rather these extraction campaigns
be their own arc rather than arc04 slices, say so — I kept them here to avoid
another renumber.)*

## 3. Dependencies

Consumes: arc03's coherent two-compiler surface and the DD-37 per-form migration
state. Enables: the remaining M22.5 surface-extraction workstreams.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (verbatim-move core) closed | ptr: slice01 closing-report + cdc-verification | correctness | arc-plan | **done** | slice01 closed 9/9 (CC-attested + CDC code/git-verified) |
| A-2 | slice02 (rewiring + batch) closed | ptr: slice02 closing-report + cdc-verification | correctness | arc-plan | **done** | slice02 closed (CC-attested + CDC git/code-verified) |
| A-3 | `move-function` performs a real move with the full suite green, end-to-end | run the move + rebuild-first `lykn test` | serious | arc-plan | **done** | **slice03 (M22.5-2): 10 real moves, byte-identical, corpus 1345/0** — the tool proven on the real corpus, committed (`266ff3d`) |

## 5. Version History

### v1.4 — 2026-06-29 (slice04 closed; DD-37 impl migration finished)
slice04 (M22.5-3) closed — the 4 complex-form emitters + 5 support symbols moved
`surface.js`→`classifier.js` byte-identical (incl. `emitMatchMacro`, the function
M22 broke by reimplementing), `typeRegistry` relocated to `surface-helpers.js` as
a single shared instance (ADT round-trip verified), `classifier.js` imports
nothing from `surface.js` (DD-37 dependency inversion complete). Commits
`3ed5e6a`/`ff481b4`. **DD-37's implementation migration is finished**; `surface.js`
540 lines (was 2,315). The split anticipated in CC's Part 1 proved unnecessary
once a **TDD'd tool enhancement** (`fdde09f`→`20748a5`, TO-as-consumer import
prune) made the moves clean. deno-lint 4→2. Next: slice05 = M22.5-4 (cleanup).

### v1.3 — 2026-06-29 (slice03 closed; A-3 done; first real extraction)
slice03 (M22.5-2) closed — the **first real `move-function` extraction**: 10
aliased helpers moved `surface.js`→`surface-helpers.js`, byte-identical, entirely
by the tool, dependency-ordered (acorn free-var scan; 2 importable hazards
satisfied, no deferrals), committed `266ff3d`, corpus 1345/0. **A-3 done** (the
tool proven on the real corpus). Disclosed: `deno lint packages/` ≠ 0 from 4
pre-existing residuals (`buildThread`/`buildSomeThread` → M22.5-4;
`typeRegistry`/`parseKeywordClauses` → M22.5-3) — slice03 cut packages/ errors
10+→4 and introduced none. Transitional `surface↔surface-helpers` import cycle
noted (safe; reduces with M22.5-3/4). Tool-enhancement candidate: prune unused
FROM imports post-move. Next: **slice04 = M22.5-3** (4 complex forms).

### v1.2 — 2026-06-29 (slice02 closed; tool done; A-3 deferred; architecture finding)
slice02 closed — cross-file rewiring + batch + atomic multi-file revert + sh-c
rebuild-first verify; A-2 done. The tool is built and proven. **A-3 deferred:**
slice02's `andChain` acceptance surfaced (CDC-confirmed) that the **M22 DD-37
architecture is not merged to `release/0.6.x`** — `classifier.js`/`surface-helpers.js`
don't exist there; M17–M22 (DD-58 + DD-37) are ancestors only of
`cdc/compiler-coherence` (fork `e462a67`). So the M22.5-2/-3 extraction campaigns
are **blocked** until that work lands. Escalated to arc03 + project-plan; needs an
operator merge/branch decision. (Surfaced by: slice02 F-4.)

### v1.1 — 2026-06-28 (slice01 closed)
slice01 (`move-function-core`) closed: `scripts/move-function.js` built TDD-first
(9/9 rows), byte-identity invariant verified, fmt drive-by landed (`401e2bd`).
A-1 → done. **Bubble-up from slice01 refined slice02's scope** (surfaced by
slice01): (a) no `surface-helpers.js`/extraction target exists yet — slice02 must
pick or create one; (b) the tool's verify runs against built `lang/`, so slice02
needs a rebuild-first `--verify-cmd` — reuse arc03/slice11's freshness guard
rather than re-solve. Recorded in the slice02 breakdown row.

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from the M22.5 tooling-track prompts (2026-05-23). Arc is the
warmest in-flight thread; slices carry open-set prompts only.
