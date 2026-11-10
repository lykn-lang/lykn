---
project: project03-language-evolution
arc: arc01-compiler-semantic-integrity
slice: slice13-structural-match-and-kernel-escape
status: in-progress
depends-on: [slice12-native-match-clause-scope]
---

# S13 — match reserved names and nested kernel escape

Operator authorized NE-C16 and NE-C17 together before other work.
Standard Autonomous Mode, Luna 6 High CC and independent Sol 6.1
High CDC. Start clean task `codex/completion-value-flow` at
`b5c22b63029f394d8a12b8b8afd98ce051420258`, tree
`78369d6fe65a727a90a40e07bef60557bcff5ebb`, in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
The independently validated release `7b17a784` is read-only.

Repair the two exact [S12 carryovers](../../BACKLOG.md#ne-c16--public-reserved-name-scan-misreads-a-match-clause)
through their real public/native routes. Restore the original frozen
fixtures without changing the accepted S12 controls. Public D2 keeps
true reserved-binder coverage, actual definition order and ordinary
bound calls. Native nested escapes consult the existing allowlist and
structured diagnostic, retain direct kernel semantics, and distinguish
object properties from executable children. No public API changes.
Separate focused/full and independent gates are mandatory.

[Assignment](cc-prompt.md) and [exact proof inputs](artifacts/fixtures.md)
record the tested scope. S13 has its own bounded refinement count.
Release propagation, new dependencies, K, other I2 and I3/I4 stay out.

## Assignment history

2026-11-09 [initial assignment](cc-prompt.md), active. Predecessor is
independently accepted S12. First freeze exact tests, then observe the
old condition before source. No unresolved Operator choice in scope.

2026-11-09 [refinement 01](cc-prompt-iteration01.md), active after
initial test-only freeze `d80959e7`. Static review held it before
all test/build launches. Fixture inputs and oracles stay frozen.
The [excluded process incident](artifacts/evidence/cc/initial-raw-handoff.txt)
records the unauthorized read-only Python invocation during authoring.
Acceptance uses independent native Git/blob checks.

2026-11-09 [refinement 02](cc-prompt-iteration02.md), active.
Initial measured old baseline at `28ed061d` matches planned native
reds and public F1/F3. F2 hit a separate duplicate macro fixture
setup failure. Isolate only that public fixture's macro state and
keep the same tested source bytes.

2026-11-10 [refinement 03](cc-prompt-iteration03.md), active.
Exact nine-path production freeze `afdb7d77` passed static review.
The first grouped build exited 101 with E0308 at the native
object-property list pattern. No native tests ran. Correct only
the pattern and retain the separate unchanged public condition.
