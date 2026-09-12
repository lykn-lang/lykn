# Starting evidence from the exploratory conversation

Recorded 2026-09-12 during project opening. This is a provenance-bearing seed
for Slice01 to recheck, not a completed baseline or a library design decision.
The earlier assistant inspected public docs/published source and local files;
it did not execute format probes, install dependencies, or implement libraries.
Some search pages exposed older versions; pinned published sources must win
over unqualified search summaries when reconciling a specific version.

## Operator requirements

Use Lykn as the default for general scripting work. New core libraries belong
in the Lykn patch and receive individual projects in the language planning
worktree. Start with JSON, then YAML, for reading, parsing, editing, and writing.
Use ADTs heavily for type safety and avoid Node.js and its dependency ecosystem.
Research must investigate both the available Deno substrate and Lykn itself.

Guide usability/accuracy and generated-code idiom; book consistency with the
language/compiler/formatter/tooling; and the operator's enjoyment of the code
and language direction are explicit goals. Addressing and integrating findings
is authorized overall scope. Expedited Mode was requested at project opening.

## Claims to reconcile

| ID | Earlier observation or hypothesis | Starting locator | Evidence boundary and research need |
| --- | --- | --- | --- |
| SE-01 | Native `JSON.parse`/`JSON.stringify` and Deno text-file APIs cover ordinary JSON workflows | [ECMAScript JSON](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object), [Deno files](https://docs.deno.com/api/deno/file-system/) | Documentation inspected; Lykn end-to-end execution still required |
| SE-02 | JSON precision, duplicate keys, unsupported values, null/absence, and serialization fidelity need explicit policy | ECMAScript source above | Specify fixtures and representation alternatives; a wrapper cannot restore discarded information automatically |
| SE-03 | `@std/json` includes framed/concatenated stream transforms and canonicalization | [JSON API](https://jsr.io/@std/json/doc) | Earlier docs showed 1.1.0; verify exact exports and framing, not arbitrary-document incremental editing |
| SE-04 | `@std/jsonc` parses comments/trailing commas but lacks serialization | [JSONC package](https://jsr.io/@std/jsonc) | Earlier docs showed 1.0.2; no comment-preserving editing demonstrated |
| SE-05 | Published `@std/yaml` 1.2.0 exposes parse/parseAll/stringify, options, and YamlSyntaxError | [Metadata](https://jsr.io/@std/yaml/meta.json), [pinned parse source](https://jsr.io/@std/yaml/1.2.0/parse.ts), [package config](https://jsr.io/@std/yaml/1.2.0/deno.json) | Metadata/source fetched in prior turn; stable/unstable exports and full dependency graph need reconciliation |
| SE-06 | YAML schemas change resulting values; default includes timestamps/merges and extra types, while core/json share implementation | [Pinned schema](https://jsr.io/@std/yaml/1.2.0/_schema.ts) | Source observation; test scalars, non-string keys, tags, alias/cycle behavior and losses |
| SE-07 | `@std/yaml` value serialization does not provide original-document preservation | [YAML API](https://jsr.io/@std/yaml/doc) | API-shape inference, not a byte-fidelity experiment; verify with fixtures |
| SE-08 | `@eemeli/yaml` offers document/node/comment APIs through JSR | [Maintainer docs](https://eemeli.org/yaml/) | Alternative candidate only; no acceptance, graph audit, complete-fidelity promise, or npm-ancestry decision |
| SE-09 | Existing Lykn imports `npm:astring`; Deno YAML identifies its js-yaml ancestry | `lang` commit `8c66469ba8f290a4bba993157b68a9e0d7716f0d`, `project.json`; pinned YAML parse source above | Existing policy tension, not permission to adopt npm or proof of a vulnerability |
| SE-10 | Lykn documents ADTs and matching, but generic/recursive collection guarantees need executable evidence | Same `lang` commit, `docs/guides/00-lykn-surface-forms.md`, `docs/guides/05-type-discipline.md`, `assets/ai/SKILL.md` | Guides describe parametric types as future work; check actual current compiler behavior and guide accuracy |

## Local observations to refresh

- Workspace `/Users/oubiwann/lab/lykn` is a multi-repository directory.
- Planning: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch
  `planning`; pre-opening HEAD `d80fc63`, clean on initial inspection.
- Source worktrees: `.worktrees/0.6.x` at `8c66469`, `.worktrees/0.7.x` at
  `74a90d5`, `.worktrees/0.8.x` at `0f3c28c`; all clean at opening inspection.
- Prior executable observations: `/opt/homebrew/bin/deno`, Deno 2.7.7,
  V8 14.6.202.9-rusty, TypeScript 5.9.2;
  `/Users/oubiwann/.cargo/bin/lykn`, Lykn 0.5.2. These are observations from
  the earlier exploratory turn, not a selected research baseline.
- Book: `/Users/oubiwann/lab/lykn/book`, branch `main`, commit
  `6aa379d1534b3cf680bc5a0eb5c344c99f975c16`. Untracked `_to_delete/` was
  present during opening inspection; preserve it and exclude it from claims
  about tracked book contents unless explicitly investigated as local evidence.
- No patch checkout was established by the exploratory directory listing.
  Absence from that listing is not evidence that no patch repository exists.

## Evidence discipline

Every row must become confirmed, corrected, contradicted, or explicitly
unresolved in `source-register.md`, with its exact support and remaining
execution needs. Record source/library versions and retrieval dates; never
replace a previous observation without retaining its provenance. Pin source
references to commits and published packages for replay, then record later
drift separately. Human acceptance and independent reproduction remain open.
