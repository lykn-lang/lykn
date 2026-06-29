# arc02 — Type Declaration (`.d.ts`) Generation

> **Status: Closed.** Reconstructed retroactively (2026-06-28) from milestone
> M10. See `slice01-.../{closing-report.md, cdc-verification.md}` and the
> `design/` diagnosis + pre-DD inventory for the shipped evidence.

## 1. Capability

Generate TypeScript `.d.ts` declaration files from lykn `:type` annotations, so
that lykn-authored packages present accurate types to TypeScript/Deno consumers
without the user ever hand-writing or seeing compiled-JS-level type machinery
(DD-56, canonical-form spec). This is the type-surfacing half of the
"clean output, Lykn-only surface" stance applied to declarations.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · dts-from-type-annotations** | Emit `.d.ts` from `:type` annotations; diagnosis, pre-DD inventory, implementation + follow-up | Closed |

## 3. Dependencies

Consumes: the surface `:type` annotation form (DD-24 family). Independent of
arc01. Informs arc03's canonical-form work (DD-56 spec is shared design
substrate, copied to `arc02/design/`).

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 closed | ptr: slice01 closing-report + cdc-verification | correctness | arc-plan | done | M10 closing report + CDC review |
| A-2 | `.d.ts` emitted from `:type` annotations | slice01 closing report (per-row walk) | correctness | arc-plan | done | reproduced at slice scale (closing report) |

**Reconstruction caveat:** no separate `ledger.md` existed for M10 (it was
tracked via diagnosis → prompt → closing → CDC, without a `milestones/` ledger
file). The closing report + CDC review carry the evidence. Rows here are
*attested* from those artifacts.

## 5. Version History

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from M10 (shipped 2026-05-13). Missing-`ledger.md` gap disclosed
above (not silently dropped).
