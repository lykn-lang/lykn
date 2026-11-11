---
project: project03-language-evolution
arc: arc04-qualified-adts
status: active
version: "1.4"
related: [project07-core-library-research]
---

# Qualified ADTs

2026-11-11 current work: [S03 local qualified nominal core](slice03-local-qualified-nominal-core/slice-plan.md)
is open from independently integrated release `0829e892`. Its initial bounded
increment establishes the finite protected-host/reference prerequisite; the
eight-row plan retains local ownership, nominal runtime/guards, APIs/DTS,
private purity, migration and full consumer proof. S03 software is not yet
accepted. [S02 release integration](slice02-existing-adt-correctness/artifacts/release-integration-0829e892.md)
passes all three independent gates, including fresh release full checks and
cold installed-CLI/materialized-public proof. No remote/publication action ran.

Previous source gate: [S02 existing ADT correctness](slice02-existing-adt-correctness/cdc-verification.md#corrected-candidate-independent-source-and-runtime-verification--2026-11-11)
is independently closed at task `0829e892`, with all five PC rows and QA-02
done after final metadata review of planning b61c9968. The repair preserves flat constructors and
adds recursive match/conditional correctness, zero-field parity, necessary
sequence/hygiene dependencies and actual embedded delivery. Initial candidate
7b09a4e's embedded-payload hold and all evidence remain preserved. Release
was `685bbe1d` at that closure; the subsequent accepted integration is above.

[S01 design](slice01-contract-and-emission-design/cdc-verification.md#iteration04-final-design-acceptance--2026-11-11)
remains accepted at candidate 4d4aef29, verified in 30a7c78d against source
685bbe1d. S03 is now open on the repaired baseline. The seven-increment
decomposition remains unchanged.
S02's cold materialization proof does not establish same-version warm-cache
content invalidation. Existing Arc01 S04 I4/CV-03 retains checked early-return
work; S06/S07 still own the full API/docs/book/human obligations. No qualified
feature, emission experiment or production strategy is accepted by S02.

Deliver coherent type-qualified construction, matching and public JavaScript
access, grounded in the operator's 2026-11-10 approval. The agreed source
shape is a type declaring short variant names, with value use such as
Label:MissingField and (Label:Text "hello"), and match patterns such as
(Label:MissingField ...) and ((Label:Text text) ...). JavaScript consumers
receive the corresponding Label.Text access. The compiler resolves declared
constructor identity through bindings and imports, and distinguishes equal
case names belonging to different types.

Historical inspected baseline is 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95;
release/0.6.x now equals accepted S02 source 0829e892 after independent local
integration. S03 uses dedicated codex/qualified-adt-core from that exact state,
in the reused task worktree. Planning lives on its separate branch.
Design work consumes source read-only.
Implementation uses a dedicated non-default task branch when activated.
The established Luna 6 High CC and separate Sol 6.1 High review arrangement
continues. Each slice includes appropriate source, compiler and consumer
validation. Integration and publication retain their existing authority.

| Order | Usable increment | Required proof |
| --- | --- | --- |
| [S01 contract and emission design](slice01-contract-and-emission-design/slice-plan.md) | Reviewed source/runtime contract, affected-route map and a fixed emission-gate protocol | Resolve identity, scope, imports, guards, serialization, mutability and compatibility before dependent implementation. Prepare bounded native-esbuild comparison. |
| [S02 existing ADT correctness](slice02-existing-adt-correctness/slice-plan.md) | Correct nested constructor checks/bindings and zero-field declaration behavior in both compilers | Reproduce D-2611-NPAT and D-2611-ZVAR with original inputs and meaningful positive/negative regressions. |
| [S03 local qualified nominal core](slice03-local-qualified-nominal-core/slice-plan.md) | Execute qualified local construction and nested matching in native/public single-file output and the normal CLI | Fresh per-unit metadata, OwnerRef/CaseRef static universes, guarded/stripped behavior, declarations, diagnostics, initialization order and necessary migration. Review the finite host-dependency extension and private initialization-purity provenance before using them. |
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

- 2026-11-11 v1.4. Independently integrate S02 to local release 0829e892 and
  open S03 with preserved eight-row delivery and bounded host foundation first.
  Record browser compile/eval and initialization-support proof distinctions;
  imported/emission/operator, composition and API/docs/human gates survive.

- 2026-11-11 v1.3. Record S02 source and documentary acceptance at task 0829e892,
  actual embedded delivery and explicit existing limits.
  Release stays 685bbe1d and the seven-increment scope/gates are retained.

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
