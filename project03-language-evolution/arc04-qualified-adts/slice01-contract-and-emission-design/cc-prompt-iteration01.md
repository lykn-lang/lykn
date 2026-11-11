# S01 iteration01 — settle the contract and make the protocol executable

This is a design-only correction to initial proposal 4bd224fc, following
independent not-accepted review 1615547d (RV-01–06). Source remains the clean
685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95 checkout named in cc-prompt.md.
Use Luna 6 High CC; a separate Sol 6.1 High context verifies the result.
Root CDC now supplies the following coherent design direction under the
operator's request to settle S01 in Autonomous Mode. Challenge a concrete
contradiction; do not turn these decisions back into an unresolved menu.
They become accepted only after independent review. Production layout and
experiment execution retain their separate gates.

## Intake, permissions and return

Required-full, in order: planning AGENTS.md; this prompt; current slice plan
and ledger; the two current artifacts; the complete initial cdc-verification.md.
Required-section: original cc-prompt.md for source homes/domain reads and
scope constraints; arc-plan.md's increment table and emission sequencing;
closing-report.md's intake, five-row walk and initial unresolved decisions.
These are at planning HEAD 1615547d. Retain the initial return in Git and
append iteration-labelled findings/readback/results to the canonical report;
do not erase or relabel its initial open verdict. Recover required text no
longer held in context in complete bounded chunks. Verify source/plan drift.

Root has inspected native registry, patterns, emitter/type_checks/DTS, source
module rules, protected host v1, CLI compile pipeline and independent review.
Apply Rust TD-02/03 (SHOULD: semantic OwnerRef/CaseRef types) and API-23
(MUST: typed fallible boundaries); preserve existing Result/diagnostic routes.
Apply javascript-deno API options/sync-result conventions, values ID-16 and
ID-20/21 (shallow freeze and explicit property descriptors), and API ID-26
(CONSIDER symbol metadata). That last guide incorrectly says symbol-keyed
properties are non-enumerable by default: they are not. Explicitly specify
the descriptor. No standalone skill repair is in scope.

Write only artifacts/qualified-adt-contract.md,
artifacts/emission-protocol.md and closing-report.md. No source edits,
prototype/compile/runtime/bundle execution, acquisition or network/release
actions. All authored research/helper/orchestration/validation logic must be
Lykn. No Python execution or temporary parity exception, Ruby, Fennel,
handwritten JS/Node helper logic, substitute scripting, new Node/npm input,
or generated-output repair. Illustrative JS emission is unexecuted design,
not an executable helper. Native Git/read-only source/tool metadata and simple
file lifecycle are allowed. Commit only the three named files with
git commit --only and both contiguous AGENTS.md coauthor trailers; return Git
ownership and exact hash. QD/QA rows remain open pending independent verdict.

## Binding semantic decisions to formalize

1. Keep the approved zero-field values and fielded calls/patterns. Normalize
   `(Zero)` in a declaration to the same zero-field case as `Zero`; neither
   creates a callable constructor. Constructor/type namespaces are separate
   concepts: `(type Box (Box :number value))` becomes `(Box:Box 1)` with no
   automatic flat `Box` function. Unknown/malformed ADT pattern/known owner
   case/arity diagnostics are compile errors, including stripped mode.
   Ordinary object/host colon calls retain their existing meaning. Do not
   claim general static type inference: declared payload type guards remain
   runtime checks; syntactically resolved owner/case and arity are static.

2. Introduce semantic compile-time OwnerRef/CaseRef, separate from runtime
   identity. An owner is a lexical declaration in a canonical module graph;
   named reexports/import aliases preserve that reference. Runtime user ADTs
   are generative: one fresh identity token per evaluated declaration/module
   instance. Equal-spelled types, separately evaluated copies, or identical
   source bytes in different modules do not become the same type. No global
   owner registry, source hash or absolute-path textual runtime identity.

3. Recommended concrete representation, held identical in both layout trials:
   use a fresh Symbol() owner token; a shared metadata key obtained via
   Symbol.for("lykn.adt.owner.v1"); an own, non-enumerable, non-writable,
   non-configurable symbol-keyed owner property on each constructed value;
   and an own enumerable, non-writable/non-configurable `tag` containing its
   normalized case name. Payload fields are ordinary enumerable writable
   data fields, shallowly guarded at construction. Reserve `tag` as a payload
   field with a targeted diagnostic. Emit literal/computed fields safely for
   names such as `__proto__`; reject actual JS-normalization collisions.
   Unit values are per-owner/case singletons; fielded calls return fresh
   objects. Do not intern payloads or deep-freeze them. This is nominal
   membership, not an anti-forgery/security boundary: reflection or deliberately
   copying the actual private ABI/brand can forge it. Old raw `{tag:...}` fails.

4. Match dispatch always checks owner and case, then extracts fields and
   recursively tests nested patterns with clause-local bindings and exactly
   once evaluation. Owner/case dispatch is semantic and survives assertion
   stripping. Default named-ADT argument/return/payload guards check the
   resolved owner's token plus declared case membership; no recursive payload
   revalidation or general soundness claim. These assertions are stripped by
   the established flag. Wrong-owner values fail default guards, can pass a
   stripped function boundary, and still cannot select the wrong match arm.
   Mutation of a payload can invalidate a field's declared type; document that
   existing mutable-data limitation instead of claiming immutable ADTs.

5. JSON and supported clone operations carry data, not membership. With the
   descriptor above, JSON/spread/structured clone do not preserve the brand.
   Raw data requires explicit validation and constructor reconstruction before
   nominal guards/patterns accept it. No automatic generic decoder, wire ABI,
   JSON-safe arbitrary payload or structuredClone success guarantee is added.

6. Namespaces expose the declared normalized case properties and are read-only
   at runtime. Their general prototype, reflective ordering or namespace-object
   species is not a promised plain-object API. Known source writes/deletes to
   an ADT namespace are errors; runtime read-only members cover escaped JS
   values. Constructor bindings/identity metadata are immutable; payloads are
   separate. Host primitives needed by this recommendation are Symbol,
   Symbol.for, Object.freeze and Object.defineProperties. Existing host v1
   protects none of them. Make a bounded host-contract extension an explicit
   implementation prerequisite with exact slots/global roots, lexical hygiene,
   source-write diagnostics and dynamic-alias/foreign-code limits consistent
   with v1. A shadowed Object/Symbol needs hygienic compiler-owned capture,
   whose inline-data-module/CSP implications are stated. Do not claim existing
   Reflect invocation proves integrity of these other operations. Pure
   initialization annotations require that extension's verified assumptions;
   never mark effectful payload/guard/application work pure.

7. Keep public compilation synchronous/string-returning. Extend its existing
   options with moduleId and typeInterfaces (explicit pre-resolved input),
   rather than replacing it with an async loader or inventing another public
   compile name. Browser compileLykn mirrors it. Native gets typed context
   through resolve/analyze/emission; no hidden global registry. Include the
   lower-level public expand/classify/compile stage boundaries, not just top
   entrypoints. Per-compilation state is fresh and failure cannot leak type
   metadata to the next invocation. Define a version-1 concrete interface
   schema and validation errors, exact specifier-to-interface lookup, export
   aliases/reexports, owner/case/field metadata and runtime-linkage fields.
   CLI compile/build/dist supplies it using a non-executing module-interface
   graph prepass and generated package metadata. No module evaluation or
   network fetch discovers types. Missing/unavailable interfaces fail the
   ADT-specific uses; ordinary JS imports/member calls remain usable.

8. For imported runtime owner checks, declare a compiler ABI explicitly.
   Export each owner's token under a hygienic reserved generated name such as
   __lykn_adt_v1_owner_Label and record its actual export name in the interface.
   Consumer code imports that symbol through the producer's real module
   boundary. It is a real generated export to audit/version, not a secret or
   a new human-facing constructor API. Metadata versions bind the compiler
   ABI; packages preserve these exports until application bundling legitimately
   eliminates them. DTS includes the runtime namespace plus nominal tagged
   union, readonly discriminant/brand and mutable payloads; token exports are
   typed as their real unique symbols. Avoid adding helper members to Label.

9. Imported type aliases and direct immutable local owner aliases preserve
   OwnerRef (e.g. `(bind another Label)`). A conditional/dynamic namespace
   value is not statically an owner; it is usable as an ordinary object at
   runtime but cannot stand as a declared owner in a pattern. Detached case
   functions remain ordinary functions with their captured owner/payload
   guards; do not add arbitrary function alias pattern inference. Include
   worked alias, detached call, dynamic get, unknown case and lexical shadow
   examples. Any unsupported static pattern points to a declared/imported
   owner instead of guessing from capitalization or earlier process state.

10. Qualified declared constructors replace automatic flat constructor
    bindings for 0.6; no dual legacy emission mode or implicit export aliases.
    Preserve ordinary lexically declared functions with the same short names.
    Inventory/migrate actual source/tests/examples and public constructor/DTS
    exports; retain historical evidence at its original pin. The blessed
    Option/Result records are currently analysis-only and install no runtime
    constructors. Do not synthesize built-in namespaces from them. A local
    `(type Option ...)` is an ordinary nominal declaration; two independent
    such declarations are distinct. Cross-module Option/Result APIs must share
    the same explicitly declared/exported owner by import/reexport. Blessed
    diagnostics may annotate a real declared/imported interface of the expected
    shape, but metadata alone must not authorize ownerless runtime patterns.
    Explicitly disposition the previous structural tag interoperability and
    constructor-collision shadowing behavior as deliberate 0.6 migration.
    No mandatory shared prelude runtime or standard-library package is added.

## Make the bounded emission protocol concrete

Retain exactly 2 layouts × 6 consumers × 2 settings = 24 bundle cells per
contributor, with independent replay separate. No cells run now. Make the
following worked alternatives and their actual production routes explicit:

- L1 single-module immutable namespace object with separately emitted private
  case bindings and the named owner-token ABI export. Static local references
  may lower directly; imported public access still reaches the actual facade.
  Do not claim it can prune imported unused cases without evidence.
- L2 compiler-owned case-module ESM namespace reexported as the named Label
  binding from the public module. Private case module exports only cases;
  separate private identity module shares the owner token with its cases and
  the main module's named owner-token ABI export. Compiler-generated namespace
  imports are implementation-only; user namespace imports/export-star remain
  banned. Define actual sidecar relative paths and dist/package inclusion.

L2 is a builder candidate, not a way to silently change the string-returning
single-source compiler to emit missing sidecars. Raw/native stdout/browser
single-file output retains L1 as a defined representation fallback if L2 wins
the build gate; it promises the same constructor/match/owner semantics, with
no claim of identical reflective namespace species or imported-case retention.
Record this route distinction and its later conformance/API/docs checks.

Use two candidate compiler revisions/binaries on the same frontend/identity
implementation, each producing the fixed qualified Lykn fixtures through the
normal compile/build route with one candidate emission implementation. S03
first implements the common frontend/interface/host prerequisites and the
two candidate emitters; it freezes both source commits/binary hashes before
the agreed gate chooses a production builder layout. No handwritten JS
prototype/repair, research emitter in a substitute language or extra public
experimental CLI mode. Existing generated JS is compiler-owned output. The
comparison establishes native prototype-build evidence only; native/public
single-file, final builder/package and JSON-decoder integration have their own
later conformance gates at actual implementation pins.

Include exact proposed Lykn producer/consumer code blocks and file graph in
this artifact (uncompiled design inputs), observable expected outputs/effects,
namespace/export/member and DTS oracle per consumer. C2 must import/use one
case across a module boundary; C6 uses two import aliases, including lowercase,
of the same owner. C4 uses two separate modules each declaring Label/Text,
imported as distinct local aliases. C5 exports/escapes the namespace and uses
a runtime key, retaining every public case and explicit application effects.
C1's separate pure producer must have zero retained ADT contribution without
adding an uncounted baseline bundle. Include negative-control obligations
without silently creating extra bundle cells.

Give exact esbuild argument templates with absolute pinned binary path,
--bundle --tree-shaking=true --format=esm --platform=neutral --target=es2022,
metafile/outfile/input paths; paired minified setting adds only --minify.
Use /usr/bin/gzip -n -9 -c on those minified bytes, capture stdout as the gzip
artifact, and freeze actual tool identities/options before launch. Specify
the future Lykn harness's native compile/build/invocation route and how it
captures bytes, exits/stdout/stderr/exports. Do not invent an unsupported
launcher flag: consult the existing accepted CLI/evidence invocation if needed.
Freeze exact source bytes/hashes, candidate pins, commands, 24-key manifest
and independent expected outcomes at a pre-execution checkpoint. Operator
agreement remains required for that concrete protocol before any execution;
future implementation hashes can only be filled after it exists.

Complete code/source-body/metafile plus behavior oracles remain binding:
zero unused ADT code; no unused case code for static imported selection;
retained used behavior/effects, all published exports at package staging and
observable escaping members at application bundling. Case-name strings used
by a closed-membership guard are not themselves unused constructor bodies;
account for their bytes honestly. A failing layout stays failed. The protocol
must be executable in a later scoped slice, not claim current baseline compiles
new syntax. Amend the arc sequencing in the return recommendation if these
prerequisites require sub-increments; root owns actual plan updates.
