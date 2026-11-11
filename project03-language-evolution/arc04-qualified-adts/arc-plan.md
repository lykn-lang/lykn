---
project: project03-language-evolution
arc: arc04-qualified-adts
status: active
version: "1.2"
related: [project07-core-library-research]
---

# Qualified ADTs

2026-11-11 current gate: [S01 is independently accepted](slice01-contract-and-emission-design/cdc-verification.md#iteration04-final-design-acceptance--2026-11-11)
at design-review strength, with all five QD rows and QA-01 done. The accepted
contract/protocol candidate is 4d4aef29, verified in 30a7c78d. Source remains
685bbe1d; no new compiler behavior, experiment or production strategy is
accepted. S02's source-ready existing-ADT repair is next. The seven-increment
v1.1 decomposition below is unchanged by this status-only v1.2 closeout.

Deliver coherent type-qualified construction, matching and public JavaScript
access, grounded in the operator's 2026-11-10 approval. The agreed source
shape is a type declaring short variant names, with value use such as
Label:MissingField and (Label:Text "hello"), and match patterns such as
(Label:MissingField ...) and ((Label:Text text) ...). JavaScript consumers
receive the corresponding Label.Text access. The compiler resolves declared
constructor identity through bindings and imports, and distinguishes equal
case names belonging to different types.

Use clean source 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95 as the inspected
baseline, currently on codex/completion-value-flow and release/0.6.x.
Planning lives on its separate branch. Design work consumes source read-only.
Implementation uses a dedicated non-default task branch when activated.
The established Luna 6 High CC and separate Sol 6.1 High review arrangement
continues. Each slice includes appropriate source, compiler and consumer
validation. Integration and publication retain their existing authority.

| Order | Usable increment | Required proof |
| --- | --- | --- |
| [S01 contract and emission design](slice01-contract-and-emission-design/slice-plan.md) | Reviewed source/runtime contract, affected-route map and a fixed emission-gate protocol | Resolve identity, scope, imports, guards, serialization, mutability and compatibility before dependent implementation. Prepare bounded native-esbuild comparison. |
| S02 existing ADT correctness | Correct nested constructor checks/bindings and zero-field declaration behavior in both compilers | Reproduce D-2611-NPAT and D-2611-ZVAR with original inputs and meaningful positive/negative regressions. |
| S03 local qualified nominal core | Execute qualified local construction and nested matching in native/public single-file output and the normal CLI | Fresh per-unit metadata, OwnerRef/CaseRef static universes, guarded/stripped behavior, declarations, diagnostics, initialization order and necessary migration. Review the finite host-dependency extension and private initialization-purity provenance before using them. |
| S04 imported interfaces and selective emission | Qualified imported owners/aliases resolve through actual module metadata and preserve identity | Implement the non-executing graph and real namespace/token/case ABI, then compare the two agreed same-module lowering strategies with 24 bundle cells per contributor. Operator agreement on the frozen checkpoint precedes execution; no winner is assumed. |
| S05 build and research composition | Accepted production lowering remains usable and selective in actual build/package consumers | Verify integrated selective/escaping namespace, public exports, declarations and final artifacts at their real source pins; re-pin/replay the JSON decoder with explicit representation changes. Prototype evidence alone cannot close this. |
| S06 public API and documentation audit | Identify every affected language, JS, Rust, CLI, generated and documentation surface | Trace actual changes and consumers, update obligations and coordinate the separate book. Feed the existing Arc01 whole-work audit. |
| S07 conditional documentation implementation | Implement findings from S06, or record a justified no-op | Verify actual guide/book/example corrections and retain operator source review. This remains the requested documentation placeholder. |

The source syntax is approved. S01 must settle its semantic and compatibility
details and testable emission design. A literal JavaScript object is one
possible layout. It cannot be selected on appearance alone. Preserve the
no-mandatory-runtime, no-new-Node/npm, optional packages, observable effects,
published API and micro-deployment requirements. Experimental results describe
their actual layout and tool pins, with no extrapolated tree-shaking claim.

Version 1.1 supersedes the six-increment v1.0 sequencing: S03 was qualified
construction including imports and the preliminary comparison; S04 was final
build/research composition; S05/S06 were audit and conditional documentation.
S01 exposed enough distinct interface/host/initialization work to split the
qualified core from imported resolution and comparative lowering. Existing
criteria and documentation duties are retained, with later increments shifted.
This is an in-scope decomposition under the operator's S01 Autonomous Mode
request, not authority for source integration, publication or extra experiments.

S03 establishes the common nominal frontend and single-file semantics without
selecting a winning builder strategy. S04 then starts from that accepted core,
adds imported metadata/ABI support and the two candidate lowering paths, and
freezes candidate pins, fixtures, commands and oracles before the agreed gate.
Both strategies keep token/cases/facade in the declaring module and the same
export ABI; L1 accesses facade members and L2 links statically resolved case
bindings/imports while preserving the actual qualifier read. Independently
cached identity/case sidecars were rejected during S01 design because they
can violate generativity. No user namespace-import syntax is introduced.

S02's existing-ADT repair can proceed independently of the emission choice
after its source-ready assignment. S05 checks the final implemented
build/package consumers against the semantic and size oracles. Prototype and
integrated production evidence have their own pins, populations and verdicts.
The runtime/type-guard host dependencies and current backend keyword
differences must be inspected honestly, not hidden by the new representation.

This arc owns D-2611-NPAT/ZVAR source corrections and the qualified-constructor
design. It takes the adjacent NE-T02 guard-contract question as an explicit
design input. D-2611-RDEO remains a separate reader correction under Project07
Arc03. RTCK and existing guide/book findings keep their owners, coordinated
with S05/S06. The compiler's internal AST redesign is a separate decision.
Project07's original research evidence, final synthesis and library handoffs
survive this detour, including every YAML and human-review obligation.

## Version history

- 2026-11-11 v1.2. Record S01's independent design acceptance, source-unchanged
  boundary and next S02 handoff. No change to the v1.1 scope, sequencing,
  criteria, source gates or operator experiment/human-review duties.
- 2026-11-10 v1.1. S01's design/review exposed separate local semantics,
  imported-interface/ABI and emission-proof prerequisites. Split former S03,
  move comparison to new S04 and composition to S05, and retain the audit and
  conditional documentation as S06/S07. Reject cached identity sidecars;
  preserve single-module generativity and actual qualifier initialization.
  No acceptance criterion, original evidence or operator execution gate is
  removed. The source remains unchanged during S01.
- 2026-11-10 v1.0. Opened from the operator's approval of qualified constructor
  and pattern syntax, static resolution, distinct owner identity and emission
  validation. The JSON trial supplied independently reproduced ADT defects.
