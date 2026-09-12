# JSON behavior ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| J2-01 | Corrected identified launch enforces narrow permissions | Arc03 CDC receipt plus actual argv/denied-read control | serious | PERM and B01 drift | open | [Verified launcher](../../arc03-findings-and-integration/slice01-run-permissions/cdc-verification.md) | External correction closed; own harness argv/denial evidence still required |
| J2-02 | All J-01–17 variants are frozen with explicit expected invariants | Walk case-manifest against every FM01 family and all encoded inputs | correctness-grade | FM01 | open | — | No omitted or silently merged cases |
| J2-03 | Native JSON value/byte behavior and failures are demonstrated | Replay J-01–11 and J-17 retained programs/inputs; inspect values, bytes and errors | correctness-grade | JSON scope | open | — | First-parse loss cannot be hidden by round trips |
| J2-04 | JSONC/framing/canonicalization behavior has actual pinned-graph evidence | Replay J-10/12–15 with graph/map/lock and negative framing controls | correctness-grade | Extensions | open | — | No Node/npm graph |
| J2-05 | Resource trials have external controls and honest dispositions | Verify supervisor on bounded timeout control then J-16; inspect wall/output/RSS evidence | serious | RP01 resource gates | open | — | Sampled RSS is not a hard memory cap |
| J2-06 | Guide/book/code-shape findings survive into later work | Inspect reference logs, original/revised source and discovery destinations | correctness-grade | Operator authoring goals | open | — | Human acceptance remains separate |
| J2-07 | Evidence and conclusions independently reproduce | CDC replay, link/scope checks, per-row closure and arc bubble-up | correctness-grade | Expedited Mode | open | — | No prototype promoted into accepted library |
