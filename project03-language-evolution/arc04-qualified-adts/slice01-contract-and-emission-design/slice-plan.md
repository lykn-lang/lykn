---
project: project03-language-evolution
arc: arc04-qualified-adts
slice: slice01-contract-and-emission-design
status: preparation
---

# Qualified ADT contract and emission design

Produce the contract that makes the operator-approved Label example a
responsible compiler change. Deliver a concrete design and source/consumer
map, plus a predeclared emission comparison protocol under artifacts/.
This slice is design work. Later implementation consumes its actual settled
decisions and appropriately scoped experiment results.

Use source 685bbe1d and Project07's independently reproduced S01 record.
The native TypeRegistry currently indexes constructors by bare name and
rejects duplicate user case names across types. Public surface helpers use
a bare-constructor map. These are concrete migration points for qualified
owner identity and aliases. Type and value scopes, imported metadata,
generated declarations, existing call sites and prelude metadata must agree.

Keep the approved source/match spelling and qualified public JS access.
Resolve runtime owner/case identity, zero-field semantics, source typing and
guard membership, serialization, namespace mutability and hygiene, alias and
shadowing behavior, source/JS compatibility and migration. Identify actual
affected entrypoints and supporting tests. The output names each decision,
its source evidence, the implementation shape and a discriminating check.
It does not infer static exhaustiveness or recursive container validation.

Prepare a small comparison for the pinned native esbuild 0.25.5 tool already
built under slice06-native-esbuild-controls. Propose at most two concrete
emission layouts and six consumers: unused ADT, one case, all cases,
same-named cases in two types, escaping/dynamic namespace, and imported alias.
That is a proposed ceiling of twelve bundles. Freeze exact sources, expected
behavior, exports/effects, tool identities and raw/minified/gzip measures
before execution. Verify tool availability and the representation each
prototype actually establishes. Operator agreement on the concrete protocol
precedes experiment execution. This design assignment does not acquire or
rebuild dependencies or execute that proposed matrix.

Current [CC assignment](cc-prompt.md) is the contract/protocol draft.
Coordination retains PL design authority and resolves consequential choices
before dependent implementation. Use the established Luna 6 High CC and
Sol 6.1 High independent review settings. Source and release remain read-only
inputs during this design assignment. Retain all original findings and gates.
