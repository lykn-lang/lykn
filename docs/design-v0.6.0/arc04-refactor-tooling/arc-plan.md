# arc04 — Refactor Tooling (`move-function`)

> **Status: Tool built & proven (slice01 + slice02 closed); A-3 deferred to
> M22.5-2 (now unblocked).** The `move-function` tool is complete — verbatim-move
> core + cross-file rewiring + batch + atomic multi-file revert, all TDD-first and
> proven on real code (the verify gate caught a real free-var entanglement and
> reverted cleanly). A-3 (a *real green extraction*) is deferred to the M22.5-2
> campaign — **now unblocked**: the M22 DD-37 architecture (`classifier.js`,
> `surface-helpers.js`) was merged to `release/0.6.x` on 2026-06-29 (the §5
> finding is resolved). Reconstructed retroactively (2026-06-28) from the M22.5
> tooling track.
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

slice02 is the last tool-build slice; closing it completes arc04's `move-function`
tool. The **real extraction campaigns** then follow as their own slices: **M22.5-2**
(10 helpers, ~500 lines — start with `andChain`), then **M22.5-3** (4 complex
forms: `match`/`type`/`genfunc`/`func`, ~470 lines; depends on M22.5-2), then
**M22.5-4** (dead-code + `_kernel` cleanup). See the M22 audit
(`../arc03-compiler-coherence/slice08-dd37-per-form-migration/design/m22-audit-report.md`)
§"Suggested workstream segmentation".

## 3. Dependencies

Consumes: arc03's coherent two-compiler surface and the DD-37 per-form migration
state. Enables: the remaining M22.5 surface-extraction workstreams.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (verbatim-move core) closed | ptr: slice01 closing-report + cdc-verification | correctness | arc-plan | **done** | slice01 closed 9/9 (CC-attested + CDC code/git-verified) |
| A-2 | slice02 (rewiring + batch) closed | ptr: slice02 closing-report + cdc-verification | correctness | arc-plan | **done** | slice02 closed (CC-attested + CDC git/code-verified) |
| A-3 | `move-function` performs a real move with the full suite green, end-to-end | run the move + rebuild-first `lykn test` | serious | arc-plan | **deferred** | deferred to the **M22.5-2** campaign — **now unblocked** (the architecture it extracts from landed on release 2026-06-29). Re-entry: scope M22.5-2 |

## 5. Version History

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
