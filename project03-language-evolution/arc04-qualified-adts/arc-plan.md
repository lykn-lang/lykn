---
project: project03-language-evolution
arc: arc04-qualified-adts
status: preparation
related: [project07-core-library-research]
---

# Qualified ADTs

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
| S03 qualified constructors and patterns | Execute the approved example through native/public compile, normal CLI and imports | Qualified declaration/runtime binding, pattern resolution, owner identity, diagnostics, type/decl output and required source/reference migration. |
| S04 build and research composition | Qualified ADTs remain usable and selective in actual build/package consumers | Run the agreed emission gate, actual imports/aliases/escaping namespace and package/API checks, and re-pin/replay the JSON decoder with explicit representation changes. |
| S05 public API and documentation audit | Identify every affected language, JS, Rust, CLI, generated and documentation surface | Trace actual changes and consumers, update obligations and coordinate the separate book. Feed the existing Arc01 whole-work audit. |
| S06 conditional documentation implementation | Implement findings from S05, or record a justified no-op | Verify actual guide/book/example corrections and retain operator source review. This is the requested documentation placeholder. |

The source syntax is approved. S01 must settle its semantic and compatibility
details and testable emission design. A literal JavaScript object is one
possible layout. It cannot be selected on appearance alone. Preserve the
no-mandatory-runtime, no-new-Node/npm, optional packages, observable effects,
published API and micro-deployment requirements. Experimental results describe
their actual layout and tool pins, with no extrapolated tree-shaking claim.

S03 begins with the concretely agreed emission comparison before choosing
its production layout. S02's existing-ADT repair can proceed independently
of that choice after its source-ready assignment. S04 checks the actual
implemented build/package consumers against the same semantic and size
oracles. Prototype evidence and integrated production evidence have their
own actual source pins and dispositions.

This arc owns D-2611-NPAT/ZVAR source corrections and the qualified-constructor
design. It takes the adjacent NE-T02 guard-contract question as an explicit
design input. D-2611-RDEO remains a separate reader correction under Project07
Arc03. RTCK and existing guide/book findings keep their owners, coordinated
with S05/S06. The compiler's internal AST redesign is a separate decision.
Project07's original research evidence, final synthesis and library handoffs
survive this detour, including every YAML and human-review obligation.

## Version history

- 2026-11-10 v1.0. Opened from the operator's approval of qualified constructor
  and pattern syntax, static resolution, distinct owner identity and emission
  validation. The JSON trial supplied independently reproduced ADT defects.
