---
project: project01-mvp
status: historical-archive
planned-release: "0.5.0"
depends-on: []
blocks: []
related: ["project02-language-toolchain-alignment"]
---

# MVP

Retrospective home for the early language, compiler, and tooling planning that
preceded the canonical 0.6 planning tree. The operator's historical target is
0.5.0. Some retained records discuss 0.5.1/0.5.2 and work later carried into
0.6.0; their original release statements remain evidence, not rewritten scope.
In particular, the DD-50.5 family is grouped here as requested.

The numbered arcs are approximate capability groupings, not assertions about
historical execution order or independent acceptance. Existing filenames and
content are preserved except where a complete phased implementation plan has
been renamed to arc-plan.md. No retrospective slices are fabricated.

## Roadmap

| Arc | Reconstructed capability |
| --- | --- |
| [arc01-js-foundations](arc01-js-foundations/arc-plan.md) | js foundations |
| [arc02-macro-system](arc02-macro-system/arc-plan.md) | macro system |
| [arc03-surface-language](arc03-surface-language/arc-plan.md) | surface language |
| [arc04-rust-cli-correctness](arc04-rust-cli-correctness/arc-plan.md) | rust cli correctness |
| [arc05-native-js-codegen](arc05-native-js-codegen/arc-plan.md) | native js codegen |
| [arc06-typed-bindings-and-parameters](arc06-typed-bindings-and-parameters/arc-plan.md) | typed bindings and parameters |
| [arc07-generators](arc07-generators/arc-plan.md) | generators |
| [arc08-class-surface-expansion](arc08-class-surface-expansion/arc-plan.md) | class surface expansion |
| [arc09-project-tooling](arc09-project-tooling/arc-plan.md) | project tooling |
| [arc10-testing-dsl](arc10-testing-dsl/arc-plan.md) | testing dsl |
| [arc11-publishing-macro-resolution](arc11-publishing-macro-resolution/arc-plan.md) | publishing macro resolution |
| [arc12-identifier-mapping](arc12-identifier-mapping/arc-plan.md) | identifier mapping |
| [arc13-position-aware-compilation](arc13-position-aware-compilation/arc-plan.md) | position aware compilation |
| [arc14-kernel-context-refinement](arc14-kernel-context-refinement/arc-plan.md) | kernel context refinement |
| [arc15-implicit-return](arc15-implicit-return/arc-plan.md) | implicit return |
| [arc16-downstream-emission](arc16-downstream-emission/arc-plan.md) | downstream emission |
| [arc17-deno-tool-boundaries](arc17-deno-tool-boundaries/arc-plan.md) | deno tool boundaries |
| [arc18-guide-alignment](arc18-guide-alignment/arc-plan.md) | guide alignment |

## Status and evidence

This is an archive, not a newly verified software project. See ledger.md for
the migration evidence boundary and artifacts/design-index.md for the old
design catalog, now linked to the owning projects and arcs. Shared early
research lives in artifacts/research/; ecosystem submission notes are in
artifacts/ecosystem/.

## Definition of done

Preserve and make the historical plans navigable. Implementation completion
is exactly as attested in the original records; the reorganization does not
re-run or close their software work.

## Version history

- 2026-09-06 v1.0: Reconstructed during project06-planning-reorg.
