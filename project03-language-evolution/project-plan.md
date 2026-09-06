---
project: project03-language-evolution
status: research
planned-release: "0.7.0"
depends-on: ["project02-language-toolchain-alignment"]
blocks: []
related: ["project04-c-lang"]
---

# Language evolution

This project holds the former 0.7.0 candidate backlog and exploratory work:
build tooling, distribution, output optimization, language forms and typing,
and internationalization. It is a research and candidate roadmap, not a promise
that every backlog item ships in 0.7.0. Release splits remain undecided where
BACKLOG.md says so.

## Existing units

- [slice01-treeshake-audit](slice01-treeshake-audit/slice-plan.md): compiled-output tree-shakeability research; open.
- [slice02-packaging-strategy](slice02-packaging-strategy/slice-plan.md): distribution strategy research; open.
- [slice03-threading-macros](slice03-threading-macros/slice-plan.md): completed argument-position research; language-design disposition remains separate.

The original units explicitly use the collapsed standalone-slice convention.
No arcs are fabricated for unapproved candidate capabilities. The full future
arc roadmap will be designed when project definition resumes; BACKLOG.md
retains every candidate and its re-entry condition.

## Definition of done and boundaries

For the current research opening: retain the three research records and the
candidate register, with their source and status distinctions. A future
implementation definition of done is not established by this migration.

## Version history

- 2026-09-06 v1.0: Added project metadata and a retrospective roadmap during project06-planning-reorg; release scope remains provisional.
