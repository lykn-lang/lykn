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

## Iteration02 same-module proposal return — 2026-11-10

Iteration02 began at planning `8a95c7bae837e586d099fa92e8ac9ec1af4c7168` on `planning`; the worktree was clean. The assigned source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/completion-value-flow`, remained clean at `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`. The required-full readback was completed in order: root `AGENTS.md` (complete; no slice-local AGENTS file exists), iteration02 prompt (all 167 lines), slice plan and ledger, both current artifacts, and all of `cdc-verification.md` including RV-01 through RV-06 and the initial five-row disposition. Required sections were recovered in bounded ranges from iteration01's semantic decisions 1–10 and intake/return rules, this report's iteration01 partial return, and the Arc04 increment table. The prompt's first combined listing was truncated; bounded file reads recovered the required text rather than relying on prior receipts. No plan, ledger, prompt, or review was edited.

### Contract readback and source fit

The proposal retains the approved `(type Label MissingField NullField (Text :string value))`, `Label:Case` expression/pattern syntax, case values versus fielded constructors, lexical owner binding, lowercase import aliases, and ordinary colon/get boundary. It formalizes typed logical `OwnerRef`/`CaseRef` metadata separately from per-evaluated-declaration runtime `Symbol()` identity; adds an explicit v1 interface schema, current-unit ID, discriminated builtin/ADT field refs, real namespace/token/case ABI export maps and metadata-only private/transitive definitions. Existing synchronous `lykn`/browser entrypoints remain source-to-string with optional metadata; CLI/build/dist must obtain interfaces through a non-executing graph adapter. It explicitly does not assume runtime imports populate metadata, does not claim public callers' remote export claims are verified, and makes repeated-call JS state isolation a required correction.

Representation readback states the exact safe owner/case membership predicate; readonly descriptors for brand and `tag`; reserved `tag`; shallow payload checks and mutable data; frozen zero-field singleton and namespace; reconstruction after JSON/clone/spread/assoc; target mutation via `Object.assign(existingADT, ...)`; and the non-security/forgery boundary. It separates namespace policy, payload policy and host-intrinsic policy. Host v1 only protects global `Reflect` and exact `Reflect.apply`; use of Symbol/Object operations requires a bounded separately reviewed extension. Null-prototype explicit descriptor records, computed payload properties, and typed compiler-owned initialization-purity provenance are implementation prerequisites, not existing guarantees. The `.d.ts` sketch keys its property by a private shared-brand-key unique symbol and types the value with the actual exported owner token; actual token/case exports and namespace members are represented.

Source-fit reads were grounded at the clean commit: native prelude and `TypeRegistry` (`analysis/prelude.rs`, `analysis/type_registry.rs`), existing bare constructor emission and textual tag pattern path (`emitter/forms.rs`), `assoc` spread-copy path (`emitter/forms.rs`), native declaration mapping (`emitter/dts.rs`), resolver sequence/scope behavior (`resolver.rs:80–208`), and JS public API/surface/classifier state (`packages/lang/mod.js`, `compiler.js`, `surface.js`, `classifier.js`, `surface-helpers.js`, `expander-core.js`). The source guide's Modules section confirms namespace imports and `export *` are banned and inline `(export (type ...))` remains accepted. Existing native analysis collects module-top-level types but has no imported interface graph; existing public `lykn(source, {strict})` is synchronous. Prelude Option/Result data is metadata only and creates no runtime constructors. `assoc` emits a new spread object, explaining brand loss; ordinary in-place `Object.assign` is distinct. The actual source contains no PURE/PureCall facility. Alias TDZ readback is grounded in resolver's left-to-right sibling visibility and the emitter's ordinary ordered call behavior: L2 must evaluate the actual qualifier before args, not merely read the case/token. No source behavior was executed.

### Iteration02 five-row proposal; all remain open

| Row | CC proposal for independent review | Status |
| --- | --- | --- |
| QD-01 | Clarifies owner binding versus spelling, lexical shadowing, lowercase aliases, same-scope normalized-name collisions, ordinary colon calls, v1 top-level-only declaration scope, TDZ and diagnostic boundaries. | Open |
| QD-02 | Specifies nominal owner/case test, representation, guard/strip, constructor and singleton semantics, serialization/reconstruction, namespace/payload/intrinsic policies, and host/PURE prerequisites. | Open |
| QD-03 | Specifies optional synchronous metadata API, non-executing CLI/build graph, interface schema and export ABI, per-call state requirement, DTS brand key, migration and source route map. | Open |
| QD-04 | Proposes same-producer L1 facade access versus L2 direct named case linkage with equal public ABI and actual qualifier reads; defines exactly 24 keys, six fixtures, complete oracles, tools and frozen future execution checkpoint. | Open |
| QD-05 | Recommends seven increments: S02 NPAT/ZVAR; S03 local qualified core/host/purity/native-public single-file; S04 graph/import/ABI plus two emitters and agreed gate; S05 build/package and JSON composition; S06 API/docs audit; S07 conditional docs. Root owns plan disposition. | Open |

RV-01 through RV-06 remain historical findings from the not-accepted initial review and are not closed by this CC return. Iteration02 directly addresses their subject areas: explicit metadata-only prelude policy and binding conflict; bounded host prerequisites; same-producer named case ABI for imported selection; fixed two-candidate/source-ready comparison and normal compiler routes; concrete aliases/dynamic access and namespace-import ban; and fresh per-call registry state. Independent Sol must verify these are adequately resolved; CC does not mark any RV or QD item accepted. The prior iteration01 sidecar identity contradiction is preserved as a known incorrect direction: producer cache instances could have shared a sidecar token. Iteration02 removes that mechanism without weakening generativity and keeps both layouts within the same producer module.

### Protocol population and execution boundary

The two layouts vary only qualified-case reference lowering. Each public producer exports the same namespace, owner token and case ABI bindings. Six fixture families are unused pure, one statically selected imported case, all cases, same-spelled cases from distinct owners, escaped/dynamic namespace with effect, and two aliases including lowercase. The declared matrix has exactly `2 × 6 × 2 = 24` unique esbuild cells per contributor; one independent replay is separately reported. Complete source/body/metafile/runtime/effect/export evidence and separate byte accounting for guard case-name strings remain required. Exact fixture bytes and candidate hashes cannot exist until implementation is ready; they are explicit future freeze fields, not invented now. Normal compiler semantic regressions and package/DTS checks are separately scoped, not added to the matrix. Operator agreement precedes execution. No invocation, test, compile, prototype, bundle, gzip calculation, replay or dependency operation occurred in this return.

### Scope and handoff

Only `artifacts/qualified-adt-contract.md`, `artifacts/emission-protocol.md`, and this slice-root `closing-report.md` are assigned. Source remains clean at the recorded baseline. The all-open QD status and prior report/review history remain intact. This is a coherent iteration02 candidate for independent source/contract/protocol review, not slice acceptance or permission to implement/execute the gate. Git ownership returns to root after the scoped commit; no unrelated path is staged.

## Iteration03 complete source/interface/observer return — 2026-11-11

Iteration03 started at planning `c574a26c2c61319dc99a5b0277dd0770d116ec63` on `planning`. The planning worktree was clean before edits; the assigned source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/completion-value-flow`, remains read-only and clean at `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`. The arc plan at the assigned HEAD is version 1.1 and already records seven increments. No plan, ledger, review, or prompt was edited.

### Actual intake, bounded reads and contract readback

The required manifest was read in order. Root `AGENTS.md` was read in two bounded chunks (lines 1–100 and 101–186; no slice-local AGENTS.md exists). `cc-prompt-iteration03.md` was read completely (180 lines); `slice-plan.md` (114 lines) and `ledger.md` (9 lines) were read; the current contract was recovered in full at lines 1–80 and 81–170, and the protocol at lines 1–95 and 96–184 after an earlier combined display truncated. `cdc-verification.md` was read in bounded complete sections (1–140, 141–280, 281–376), including both the original RV-01–06 review and the complete iteration02 RV-07–13 review/current QD disposition. The iteration02 prompt was recovered in lines 1–90 and 91–167, and the iteration01/02 return sections were reread in the canonical closing report. Prompt, review and report history remain unchanged.

The assigned source-guide sections were read from `docs/guides/00-lykn-surface-forms.md` at the exact requested ranges: Functions 204–328, Types & Pattern Matching 495–597, Objects & Immutable Updates 653–690, and Modules 808–869. They establish keyword `:args`/`:body` function syntax and the zero-argument shorthand, match's one-constructor universe/exhaustiveness contract, `assoc` as a spread copy, actual named/alias import grammar, `(exports ...)` behavior for imported locals, and the `dynamic-import` surface form. Native source reads include `classifier/forms.rs::classify_func` 1654–1730 and `top_level_exportable_names` 222–233; `analysis/match_check.rs::infer_match_type` 98–151 and its existing mixed-owner regression; `analysis/pattern.rs` deconstructed constructor string identity; CLI compile arguments; `packages/lang/compiler.js` import/dynamic-import lowering; and detailed native/public type-check/no-match sites. Work-verification evidence-strength guidance and the relevant project-management iteration/Autonomous Mode records were consulted. Source reports below cite only the assigned clean commit.

Readback: the current native function classifier treats a non-keyword parameter-list-looking list as zero-arg body content; keyword args/body or documented shorthand are needed for the specimens. Existing `infer_match_type` extracts a constructor owner name from the bare registry and rejects mixed root owners, so C4 must use separate one-owner matches and qualified analysis must migrate its universe to `OwnerRef`/`CaseRef`. The exportable-name collector accepts `ImportLocal`, so exporting an imported namespace is legal. The public import lowering accepts named and alias specifiers; dynamic import emits an import expression. Existing native guards use `Number.isNaN`, `Array.isArray`, `TypeError` and `Promise` for promise checks; native no-match throws `Error`. Public `surface-helpers.js` uses `Number.isNaN`, `Array.isArray`, and `TypeError`, and throws `Error` on unsupported/no-match patterns. This extends the bounded host/hygiene checklist; it does not claim old builtin keyword guards already have cross-compiler parity.

The iteration03 contract corrects the source surface and carries the chosen same-module identity/ABI, owner-qualifier sequencing, metadata-only prelude, mutation/serialization and top-level scope decisions. It now states bare qualified zero patterns as canonical, parenthesized zero patterns as equivalent only in pattern position, zero value versus invalid call, exact direct qualified-call arity in stripped and checked modes, and ordinary detached-call arity. It preserves one root constructor OwnerRef per match while allowing independently typed nested field owners and preserving existing exhaustiveness/reachability. The self-contained TDZ source follows resolver ordering; complete all-case reconstruction and typed nested Envelope/Label false-guard examples are included.

The interface is now specified as a v1 schema with required fields, uniqueness/reference rules, current module record, exact current-module/specifier/target/export lookup, normalized import alias binding, errors and a three-module producer/barrel/consumer example. Reexports preserve the defining OwnerRef but record actual namespace/token/case ABI names at the barrel. Module identity now retains loader-distinct query/fragment/resolved-copy instances, and graph adapters rebase package templates to actual OwnerRefs; no machine absolute path or source-byte deduplication is identity. The declaration sketch exports public TS `type Label` alongside runtime `const Label`, uses precise unit/Text case types, and shows a renamed barrel reusing the defining type/brand. Type-consumer oracles are explicit.

The protocol retains the exact 24 unique esbuild cells and adds a separate Lykn C5 observer outside the bundle graph. It exports `escaped` and `observed`, imports the generated bundle once per fresh Deno observer process, and checks sorted namespace members, frozen namespace/singletons, observed scalar fields and own brand/tag/payload descriptor projections. Missing descriptors yield explicit false; the brand oracle requires a symbol-valued token equal to a control token; unit projections require a non-null object, expected tag, same owner brand and frozen status (since `Object.isFrozen(undefined/null)` alone can be true). The 24 Deno processes are separately reported from the 24 esbuild cells, and C1–C4/C6 observer imports add no output. The observer uses only the authorized Lykn source/tool path. CLI compilation is a pre-driver action; runner permissions cover only pinned children it launches. The protocol also restores stop/re-entry accounting and the eligibility/no-winner rules.

### Five-row proposal; all QD rows remain open

| Row | Iteration03 CC proposal | Status |
| --- | --- | --- |
| QD-01 | Canonical and equivalent zero patterns, invalid zero call, checked/stripped direct-call arity, detached calls, single root OwnerRef per match, nested field owner and complete source examples. | Open |
| QD-02 | Same-module generativity plus loader-distinct graph identity; exact owner/case membership and mutable/serialized value behavior; required transitive host dependencies and hygienic limits. | Open |
| QD-03 | Required schema and exact import/reexport lookup, module-instance IDs, deterministic errors, public/native boundaries, public TS Label plus case-precise types and reexport identity. | Open |
| QD-04 | Six exact Lykn fixture graphs, C4 owner-only positive/negative controls, complete outside-graph C5 Lykn observer, 24 bundles plus separately counted 24 observations, freeze/failure/re-entry/eligibility policy. | Open |
| QD-05 | Follows arc-plan v1.1's seven increments and keeps host/purity/graph prerequisites ordered before the appropriate consumer evidence; all prior API/docs/JSON/human obligations remain. | Open |

### Review findings RV-01–13 dispositions in this candidate

| Finding | Candidate disposition for Sol review | State |
| --- | --- | --- |
| RV-01 | Explicit metadata-only Option/Result and deliberate structural-tag/flat-binding migration; no implicit runtime owner. | Carried; independent review pending |
| RV-02 | New Symbol/Object operations require a separate bounded host contract; no existing Reflect authority is overstated. | Carried; independent review pending |
| RV-03 | L2 uses actual case ABI names from the same producer and preserves the identical public ABI. | Carried; independent review pending |
| RV-04 | Six source fixtures, common producer compiler route, tools/argv, oracles and freeze checkpoint are explicit; no current-baseline claim. | Refined; independent review pending |
| RV-05 | Owner aliases, ordinary colon/get, dynamic values, exports and user namespace-import ban are explicit. | Carried; independent review pending |
| RV-06 | Per-call JS state isolation remains a requirement; explicit `resetMacros` is not described as automatic. | Carried; independent review pending |
| RV-07 | Canonical keyword args/body, resolver-safe alias TDZ, complete reconstruction and nested false-guard example now fit source contracts. | Addressed in candidate; pending review |
| RV-08 | C4 now uses positive and opposite-owner-only negative matches separately; static matching migrates from short names to OwnerRefs/CaseRefs. | Addressed in candidate; pending review |
| RV-09 | C5 exports both observable values and includes a concrete Lykn observer plus exact output and invocation, outside bundle graph. | Addressed in candidate; pending review |
| RV-10 | Schema requires current-module/import records, exact specifier route, public export and OwnerRef consistency; complete renamed barrel mapping and deterministic errors included. | Addressed in candidate; pending review |
| RV-11 | DTS preserves public TS type `Label` and runtime value `Label`, with exact unit/Text types and consumer oracles; barrels reuse original type. | Addressed in candidate; pending review |
| RV-12 | Zero pattern forms and expression distinction are explicit; direct qualified arity remains static in strip mode, unlike detached JS calls. | Addressed in candidate; pending review |
| RV-13 | Freeze, stop, expected layout miss, unexpected failure, original denominators and retry/re-entry evidence are explicit. | Addressed in candidate; pending review |

Root additionally clarified that actual module-graph identity must preserve query/fragment and separately resolved copies while aliases/reexports within one module preserve identity. This is incorporated into the contract and a future semantic regression; no additional bundle family is introduced. All prior partial returns, iteration02 design miss and all reviewer findings remain preserved as historical evidence. This CC proposal closes no RV or QD item.

### Applied decisions and future checks (none run)

| Decision now fixed in proposal | Falsifiable future check | Current evidence status |
| --- | --- | --- |
| Bare and parenthesized zero patterns are patterns; zero values are not callable; direct qualified fielded calls have exact static arity even with assertions stripped. | Compile positive/negative forms in both compilers and both assertion modes; separately call detached/dynamic constructors with ordinary JS arity behavior. | Source contract drafted; not executed |
| One root owner universe per match; nested pattern owner follows declared field type. | Shared mixed-root diagnostic; C4 separate direction controls catch tag-only matching; nested Envelope/Label false guard falls through. | Existing native owner-string check read; future migration oracle |
| `OwnerRef` includes resolved loader identity; reexports preserve it. | Same source bytes under two query/fragment URLs create distinct token values; two named aliases through one barrel share one token. | Design only |
| Exact schema lookup/validation and case-precise `.d.ts` aliases. | Invalid version/current module/specifier/export/reference/collision produce specified errors; TS consumer accepts Text `.value` and mutable payload but rejects unit `.value`, readonly tag/brand and cross-owner type assignment. | Design only |
| C5 exported values plus outside-graph Lykn observer; missing descriptors evaluate false. | One observer process per bundle cell; inspect exact member/freeze/value/descriptor lines and preserve child raw streams. | Source drafted; uncompiled/unrun |
| Freeze/stop/re-entry and eligibility separate expected target misses from unexpected failures. | Preserve raw cell records, original 24 unique keys and planned/launched/failed/completed/unrun counts; retries have new receipts and do not overwrite. | Protocol proposal; no gate run |

### Scope and handoff

Only `artifacts/qualified-adt-contract.md`, `artifacts/emission-protocol.md`, and this canonical `closing-report.md` were edited. `git diff --check` and path/status review are the only local checks; no source tests, compile, parser probe, observer compile/run, bundle, gzip, replay, or acquisition occurred. The source worktree remains clean at `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`; the planning candidate is for independent Sol 6.1 High review and remains non-accepted. All five QD rows are open. Git ownership returns to root after the scoped commit; no unrelated paths may be staged.
