# Native match-clause scope ledger

First old baseline at test freeze `bd081320`: native 15/17 and
public 15/16 steps passed. Three private discriminators failed on
the expected wrong scope. The runtime fixtures also exposed two
separate product limits before completing their intended comparisons.
[Refinement 01](cc-prompt-iteration01.md) isolates the same oracles.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MC-01 | Native resolver isolates incoming, structural and each clause's executable scope | Exact occurrence tags, same-clause bound call and sibling nested match, real F1 current runtime | correctness-grade | NE-C13/14, DD60/61 | open | cc-prompt.md | Keep source/span/shape |
| MC-02 | Pass2 preserves pattern syntax and expands genuine guards and bodies | F2 real macro subprocess, old/current complete modules and strict runtime | correctness-grade | Guide 00, DD60/61 | open | artifacts/fixtures.md | Public F2 preservation |
| MC-03 | Bound match is ordinary and lint reports only real clause shadowing | Exact tag and shadow-site controls, public F1/F2, normal corpus | correctness-grade | DD60/61, DD59 ID12 | open | cc-prompt.md | Preserve binding projection and existing diagnostics |
| MC-04 | Frozen source and actual full and focused gates accepted | Exact task scope, full Make/cites, complete modules and independent reproduction | correctness-grade | AGENTS, Arc01 | open | cc-prompt.md | Task-only acceptance |
