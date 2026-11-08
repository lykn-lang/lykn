# S04 design-phase retrospective — 2026-11-08

This records the completed bounded design activity at a real contract gate;
S04 implementation is NOT closed or accepted. All six CV rows/CI04 remain open.
No source/build/test/probe or new compiler failure was observed.

The Operator's explicit source-boundary principle resolved the earlier return-
target ambiguity. Source-grounded review then found that expression lifting
needs Reference/Argument ownership, not only value temps, and that private
completion state must be region-scoped through finally. A fresh Luna6 High
read-only contribution helped identify phase/API constraints; CDC reconciled
its native-insertion simplification and preserved valid bound-call/switch
contracts. Neither fluent design nor source inspection is runtime proof.

The remaining H1 is precise: trusted invocation/capture plus mutable-realm and
unused-module effects is not specified by the inspected standing sources.
Stopping affected call design avoids hiding a deployment/semantic choice in
Reflect.apply or a purity annotation. Other design portions and useful first
C02/boundary delivery are retained instead of turning the gap into a broad
census, new runtime experiment or full-AST rewrite.

Next work should consume the existing partial design and resolved gate, then
engineer the first useful source packet; do not reread every historical failure
or reset exhausted tooling8. Source implementation needs explicit authority,
correct frozen discriminators and separate CDC gates. Later source scopes must
retain all CV obligations, protected post scope/finally and actual API/guide/
LLM/book/human impact. No model benchmark, new methodology rule or unrun success
claim follows from this single design pass.
