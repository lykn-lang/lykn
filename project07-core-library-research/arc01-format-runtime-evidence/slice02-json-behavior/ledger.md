# JSON behavior ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| J2-01 | Corrected identified launch enforces narrow permissions | Arc03 CDC receipt plus actual argv/denied-read control | serious | PERM and B01 drift | done | [Reproduced CDC](cdc-verification.md) | Own controls pass on isolated pinned-source build; live binary drift disclosed |
| J2-02 | All J-01–17 variants are frozen with explicit expected invariants | Walk case-manifest against every FM01 family and all encoded inputs | correctness-grade | FM01 | done | [Reproduced CDC](cdc-verification.md), [manifest](artifacts/case-manifest.md) | 161 variants; original fixture amendment retained |
| J2-03 | Native JSON value/byte behavior and failures are demonstrated | Replay J-01–11 and J-17 retained programs/inputs; inspect values, bytes and errors | correctness-grade | JSON scope | done | [Reproduced CDC](cdc-verification.md) | 220 native attempts; byte outputs and file states match |
| J2-04 | JSONC/framing/canonicalization behavior has actual pinned-graph evidence | Replay J-10/12–15 with graph/map/lock and negative framing controls | correctness-grade | Extensions | done | [Reproduced CDC](cdc-verification.md) | 86 package attempts; graph and frozen lock match |
| J2-05 | Resource trials have external controls and honest dispositions | Verify supervisor on bounded timeout control then J-16; inspect wall/output/RSS evidence | serious | RP01 resource gates | done | [Reproduced CDC](cdc-verification.md), [replay](artifacts/cdc-replay.jsonl) | Three controls and 48 stress attempts; no hard memory/durability claim |
| J2-06 | Guide/book/code-shape findings survive into later work | Inspect reference logs, original/revised source and discovery destinations | correctness-grade | Operator authoring goals | done | [Reproduced CDC](cdc-verification.md), [authoring](artifacts/authoring-observations.md) | Three findings reproduced; aggregation deviation recorded; human review pending |
| J2-07 | Evidence and conclusions independently reproduce | CDC replay, link/scope checks, per-row closure and arc bubble-up | correctness-grade | Expedited Mode | done | [Reproduced CDC](cdc-verification.md), [Lykn audit](artifacts/cdc-audit.lykn) | Full replay and 5170 audit checks; YAML split preserves all families |

2026-09-12: CDC closed (was CC proposed-done). Seven criteria reproduced;
zero deferrals/no-ops. Source/compiler/book repairs and human acceptance remain
separate from this research closure.
