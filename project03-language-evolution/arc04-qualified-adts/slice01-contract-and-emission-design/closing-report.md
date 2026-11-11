# S01 CC design return — 2026-11-10

CC returns the [qualified ADT contract](artifacts/qualified-adt-contract.md)
and [emission protocol](artifacts/emission-protocol.md) as proposals for
independent review. This is a design-only return: no source changes, prototype,
compile, test, bundle, replay, dependency operation or emission experiment was
performed. The source remained clean at
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95` on
`codex/completion-value-flow`; planning began clean at
`f478eb788159d856d9c32a06486f07bc050d2f01` on `planning`. Existing native
esbuild availability and gzip presence were checked read-only. The proposed
matrix was not executed.

## Intake and evidence census

Read the complete assignment prompt, both worktree `AGENTS.md` files, Project03
Arc04 plan/ledger, this slice plan/ledger, and the full [preparation review](artifacts/preparation-review.md).
Read Project07 Arc02 S01 `cdc-verification.md` and `closing-report.md`, its
independent nested/zero/return observations and operator discussion; Project03
backlog entries NE-T02 and NE-D02; and the adjacent-ADT rows in
`arc01-compiler-semantic-integrity/artifacts/compiler-integrity-design.md`.
Read native-esbuild S06 plan/results and its source/build receipt. These
records distinguish the accepted qualified syntax direction from unresolved
runtime representation, type/guard semantics, imports, compatibility,
preparation evidence and human documentation review.

Source census used the assigned clean source worktree and commit only. Read
`skills/lykn/SKILL.md` (808 lines; after an initial truncated output, recovered
the required guide09 and relevant source/anti-pattern ranges), full guide09,
guide00 Types & Pattern Matching, Modules and Colon Syntax sections, guide05
ADT/guard/strip sections and guide10 module/package sections. Resolved and
consulted installed collaboration-framework/project-management,
work-verification, Rust-guidelines and javascript-deno-guidelines materials;
initial broad guideline output was truncated, and relevant API, error, module
and mutation sections were used. Full assignment-required read manifests were
not present as separate files; the prompt carried the required list.

Source queries included the assignment's tracked grep inventory for
`(type`, `(match`, import aliases, exports and `packages/lang/test`, plus
targeted `git grep`/`rg` reads for registry, patterns, AST/classifier,
resolver, analysis, emitters, type checks, declarations, public entrypoints,
tests, alias support and `ImportNamespaceSpecifier`. `packages/lang/test` is
absent. Complete relevant fixtures inspected include
`test/surface/type_test.lykn`, `match_test.lykn`, import/export fixtures and
tests, and native match-check/registry cases. Coverage found local legacy ADT
construction and matching and runtime import aliases, but no imported ADT owner
metadata/identity test. No whole-repository use count is asserted.

Grounding highlights: native `TypeRegistry` indexes constructors by bare
name; AST/surface constructor and pattern nodes carry textual names; analysis
registers declarations per module; resolver has lexical value bindings but
does not resolve imported owner interfaces; current native emitter uses flat
bindings and textual `tag`, with nested pattern compilation incomplete; DTS
separates constructor declarations from the tagged union. Public `lykn(source,
{strict})` is synchronous and single-source; public classifier state uses a
process-global bare-name registry, and reset/isolation must be made explicit.
CLI/build/dist compile modules individually without a type-interface graph.
The current generic user-type guard only checks object/tag shape and accepts
forged values; strip behavior and imported-owner behavior need exact policy.
Source guide confirms ESM and named aliases, bans surface namespace imports
and `export *`, and documents `bind` as not deep immutability. Arc03 protected
host v1 protects only global `Reflect` and exact `Reflect.apply`; no other
intrinsic is presumed trusted.

## Five-row walk — CC proposal, all rows open

| Row | CC result | Independent disposition |
| --- | --- | --- |
| QD-01 | Contract gives approved zero/fielded forms, lowercase alias resolution, binding-kind diagnostics, ordinary colon access boundary, shadowing, arity, nested extraction/guards and unknown-case behavior. | **Open.** Validate parser/classifier boundary, particularly ordinary runtime member access versus ADT-specific pattern context. |
| QD-02 | Proposes logical owner identity and explicit representation/guard/serialization decisions; distinguishes namespace, payload and intrinsic policies, forged tags, clone/JSON reconstruction and strip behavior. | **Open.** CDC must choose owner encoding, identity/forgery model, guard classification, mutation policies, and any intrinsic assumptions. |
| QD-03 | Maps native and public bare-name registries, resolver/analyzer, emitters, DTS, CLI/dist, sync public API, tests, import aliases and migration gaps. Includes normalization and metadata-key collisions. | **Open.** Confirm route map and choose metadata API, export/declaration and legacy migration behavior. |
| QD-04 | Proposes two candidate layouts and exactly 12 layout/consumer pairs × two settings = 24 unique cells per contributor; sets zero-unused/selective case gates, complete code/metafile/effect/export inspection, three byte measures and separate replay. | **Open.** Operator agreement to exact candidates, sources, commands and oracles must precede any experiment. |
| QD-05 | Gives pre-implementation decisions, test families, stops and downstream API/docs/human gates; retains Project07 evidence and no self-acceptance claim. | **Open.** CDC must disposition dependencies; Arc01/Project07 retain their integration and human review duties. |

## Decisions requiring disposition

1. Stable `OwnerId` construction, public module/type key, versioning and local
   private type identity; guarantee distinct owners for same-spelled cases.
2. Explicit interface metadata format and transport for CLI compile/dist and
   native resolver/analyzer; compatible synchronous public compiler API or
   additive graph API; per-call isolation from public global registry state.
3. Runtime representation and owner/case membership semantics, including
   forged values, assertion stripping and static-vs-runtime guarantees.
4. JSON/structured-clone contract and explicit decode/reconstruction behavior
   if brand identity is non-serializable.
5. Namespace member mutability, payload mutability and trusted intrinsic
   hygiene as three separate policies. Current protected-host scope is only
   `Reflect` and exact `Reflect.apply`.
6. Identifier-normalization collision diagnostics, exact reserved metadata
   slots (including `tag` only if selected layout uses it), helper hygiene,
   and namespace/field/export collision handling.
7. Legacy bare constructor support/deprecation, raw tag compatibility, named
   exports, declaration output and migration/version policy. Any generated
   ESM namespace import needs a distinct internal-use decision; surface
   namespace import syntax remains banned.
8. Concrete L1/L2 fixtures and exact command/tool receipt before execution;
   no winner is implied by this design.

## Scope and handoff

Only the two assigned artifacts and this slice-root report are authored.
All five QD rows remain open for independent Sol review and CDC disposition.
No test or validation gate was run because this assignment requests design
only. No source branch, release, publication or integration action occurred.
Arc01 retains compiler integrity/API audit duties; Arc04 owns qualified ADT
contract and implementation; Project07 retains book and human review duties.
The proposed emission protocol is not permission to execute the comparison.
The handoff includes exact planning changes only and preserves earlier
preparation and source evidence unchanged.

## Iteration01 partial return — 2026-11-10

Iteration01 began from planning `811b944bd7d3100dad5ed11e1779f7c94f8efab1`
with source still clean at
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`. Its prompt names `1615547d` for
the complete initial review and report sections; those retained review
sections were read from the current tree, including all six RV findings and
the initial five-row disposition. Required reads were repeated in the
specified order: planning `AGENTS.md`, iteration prompt, slice plan/ledger,
both artifacts and the full `cdc-verification.md`; initial aggregate output
truncated and was recovered with bounded complete reads. The original prompt,
arc increment/emission sequencing and initial report sections were reread.
The source and planning ownership/status were verified before edits.

The contract was partially revised to formalize root's supplied decisions:
compile-time OwnerRef/CaseRef versus per-evaluated-module Symbol token;
explicit v1 interfaces and synchronous API input; top-level scope and export
wrapper behavior; nominal brand/tag predicate and descriptors; guard/strip,
clone/spread/assoc and mutation behavior; protected-host and PURE prerequisites;
prelude metadata-only status, migration and DTS/ABI expectations. Standards
links support symbol, descriptor and enumerable-copy semantics; no runtime
experiment is implied. The native `analysis/prelude.rs` inspection confirms
blessed Option/Result metadata only, with no installed runtime constructors.

Before the L2 protocol draft was completed, root found a design contradiction:
the iteration01 sidecar owner-token module can be cached once while two
separate producer-module evaluations create distinct compile-time/runtime
instances, accidentally making both instances share one token. This violates
the supplied generative owner identity. No workaround or architecture change
was invented. The emission artifact is explicitly marked as initial,
superseded and non-executable; it is not represented as an iteration01
protocol. Root will issue iteration02 with same-module facade versus direct
case-reference lowering. Root retains the arc sequencing update.

No source edit, prototype, compile, test, bundle, replay, dependency operation
or network action occurred. Only the three authorized paths are changed in
the partial commit. QD-01 through QD-05 remain open; this is not slice
completion or acceptance. The initial proposal and its not-accepted verdict
remain intact in Git and in the report above.
