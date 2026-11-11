# S01 iteration02 — same-module selective emission

Correct the partial iteration01 return 75f845e3. Source stays read-only at
685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95 in the assigned worktree. Luna 6
High CC formalizes the direction; separate Sol 6.1 High verifies. This is
design only. All five QD rows remain open until independent disposition.

Required-full in order: planning AGENTS.md; this prompt; current slice plan
and ledger; both artifacts at 75f845e3; initial cdc-verification.md.
Required-section: iteration01's semantic decisions 1–10 and intake/return
rules; closing-report.md's iteration01 partial return; arc-plan.md's increment
table. Record bounded actual reads and a concise contract readback in the
existing closing report. Recover missing text, not merely previous receipts.
Retain original prompts/returns and findings in Git and dated report sections.

The root coordinator identified the sidecar identity error in its own prior
direction. Independent Sol confirmed it and identified the alias-TDZ edge
below from resolver.rs:186–203 and emitter/forms.rs:3535–3544. These are
source-grounded design deductions, not executed experiments or CC faults.

## Replace the two layouts coherently

Reject the proposed independently cached case/identity sidecars. Two producer
instances such as producer.js?one and producer.js?two can share those static
sidecar URLs and a token, violating generative ownership. Do not weaken the
owner contract or exclude valid module instantiation to rescue that candidate.

Both new candidates keep the SAME single physical producer module: owner
Symbol allocation, case functions/unit values, frozen namespace facade,
runtime representation and initialization position. Both expose exactly the
same named exports and metadata. Publicly exported ADT owners have their
public namespace plus versioned compiler ABI exports for owner token AND each
case, e.g. __lykn_adt_v1_owner_Label and
__lykn_adt_v1_case_Label_Text. Private/unexported types stay private. The
interface records exact runtime export names at the real producer/reexport
boundary; do not guess names or introduce helper members on Label. These are
actual generated exports that DTS, package staging and API audits must cover.
Package outputs preserve them; application bundling removes only unobserved
code with effects preserved.

- L1 facade access: qualified constructor value/call references use the
  namespace's actual case property, both locally and across named imports.
- L2 selective linkage: statically resolved qualified case references lower
  to local case bindings or named case-ABI imports from the SAME producer.
  Its namespace facade remains available for export/escape/dynamic use.
  `(get owner key)` and unknown runtime namespace values retain ordinary
  access; no arbitrary object-property optimizer is added.

The independent variable is qualified-reference lowering/linkage, not owner
encoding, namespace shape or public exports. Include before/after illustrative
code for imported and local static calls, zero cases and case extraction.
Both candidates work with single-file string/stdout output and ordinary
compiler-produced imported modules; remove the obsolete builder-only sidecar
fallback distinction and package sidecar export proposals. Namespace imports
remain banned; this revision needs none, even as compiler-owned glue.

Preserve evaluation of the ACTUAL source qualifier before arguments. A read
of only the owner token is insufficient: a later initialized local owner
alias can still be in TDZ when a hoisted function using it is called. The
recommended lowering is `(qualifierBinding, privateCaseBinding)(args)` or
equivalent with precisely the same qualifier read before arguments. An
extracted case is `(qualifierBinding, privateCaseBinding)`; a unit value follows
the same rule. No receiver is needed by these constructor functions. Keep
alias declarations/initializer effects in compiler output. Do not manually
delete a qualifier read because a bundler might later optimize it.

For qualified patterns, try a clause by reading its actual resolved namespace
qualifier, then performing safe owner/case dispatch; nested qualifiers are
read only when that nested pattern is reached. Invalid subjects do not cause
property reads on null/primitives. A qualifier's own TDZ or foreign getter
exception is a genuine evaluation error, not a pattern mismatch. Named type
guards may use the canonical owner reference as static type metadata; they
must preserve the defined runtime initialization dependencies. Include the
concrete alias counterexample and expected pre-argument failure in the future
normal compiler conformance gate. Distinguish emitted-language guarantees
from limitations of a particular bundler; do not assert a broad new esbuild
TDZ guarantee without evidence.

## Repair remaining contract precision

- The owner's runtime namespace introduces a lexical value binding. An
  ordinary function with that same normalized name in the SAME scope conflicts
  and is diagnosed; a function sharing only a short case name is independent,
  and nested lexical shadowing still works. Replace the misleading blanket
  statement that a type and same-named function coexist. Ordinary lexical or
  global short-name calls retain normal resolver behavior; case declarations
  do not seize them. Bare ADT patterns have the explicit qualified migration.
- Keep existing `lykn(source)` and `{strict}` calls valid. Missing moduleId
  means a fresh anonymous compilation context for local ADTs, with no stable
  exported cross-module metadata identity. No random/textual nonce need enter
  emitted JS: runtime generativity already comes from Symbol(). Missing
  typeInterfaces means no external ADT interfaces, not no local ADTs. When
  cross-module metadata is supplied, moduleId must match its current unit;
  schema validation has deterministic errors and never does I/O.
- Schema version 1 must distinguish field types: a builtin type keyword or a
  resolved ADT OwnerRef, not an unexplained string resolved in the consumer's
  scope. Include needed private/transitively referenced type definitions for
  declarations without exposing their runtime namespaces as human APIs.
  Separate schema/consistency validation from actual filesystem/ESM export
  validation. A pure synchronous compiler cannot verify a claimed remote
  module's real exports. The graph/build adapter validates its source/output
  manifest; public callers supply matching trusted compiler interfaces.
- Both layout interfaces contain the same namespace/token/case export names;
  layout is an emission strategy, not incompatible package ABI. Remove
  caseModuleSpecifier and sidecar linkage. Reexport interfaces preserve
  ownerRef while mapping real namespace/token/case exports at that boundary.
- Preserve low-level stage contracts explicitly. Public expand returns kernel
  forms, compile returns a program string, compileExpr returns an ESTree node.
  Thread fresh metadata through actual surface resolution/lowering; fully
  lowered kernel compilation must still work without an ambient type registry
  or a new mandatory caller context. Do not force metadata onto raw kernel
  users that do not consume ADT surface constructs.
- Fix the illustrative DTS brand key: runtime data is keyed by the SHARED
  brand-key symbol, not by the per-owner token symbol. Use a private declared
  unique-symbol brand-key type and the real exported owner token as its
  nominal value type. Type unit/case exports precisely and include actual
  case-ABI export signatures. No fabricated runtime field at [ownerToken].
- Resolve leftover `tag` menu wording: it IS reserved as a payload field for
  this representation. Clarify Object.assign({}, value) loses the brand;
  Object.assign(existingADT, updates) mutates that target and retains its
  brand, subject to readonly metadata and mutable-payload limitations.
  The reconstruction example should actually transform text, not simply
  rebuild the same text. All examples remain uncompiled design inputs.

## Complete the concrete proposed protocol

Retain the two-layout/six-consumer/two-setting population: 24 unique bundle
cells per contributor, independent replay separate. Use the six approved
families and exact code/file graphs, fixed expected outputs/effects/exports,
full tool identities and argv templates required by iteration01. C2 is static
selection across an import boundary; C6 uses two aliases including lowercase.
C1 unused pure producer has zero retained ADT code; C5 actual escaped/dynamic
namespace retains every case and application effect. Both candidates use the
same exports and runtime ABI. State the evidence boundary: selective lowering
benefits statically resolved LYKN source, not a claim that arbitrary handwritten
JS `Label.Text` consumers or dynamic gets receive equivalent case pruning.
JS access remains correct; separate entrypoints/consumer evidence may address
its retention later without adding cells to this gate.

The future two compiler candidate revisions share frontend/interface/identity
semantics and differ in this lowering strategy. Freeze their actual commits,
binaries, fixture bytes/hashes, 24-key manifest, tool identities, argv and
independent expected oracles before execution. Qualified syntax does not
compile on the baseline; source-ready implementation precedes this comparison.
No result/winner is selected now; operator agreement precedes execution.
Retain complete code/source-body/metafile/runtime/effect/export evidence;
byte count or an absent minified name alone cannot prove removal. Counters
and negative controls must not silently add bundle cells. Normal compiler
semantic regressions are a separate named validation population.

The return recommends this executable arc split for root disposition:
S02 existing NPAT/ZVAR repairs; S03 local qualified nominal core and host/PURE
foundation in native/public single-file paths; S04 interface/import/ABI graph
and two candidate emission strategies plus agreed gate; S05 final build/package
and repinned JSON composition; S06 full API/docs audit; S07 conditional docs.
Root owns actual arc/parent updates; create no new slice directories yourself.

Write/commit only the same two artifacts and closing-report.md, using explicit
git commit --only and contiguous AGENTS trailers. Append honest iteration02
intake, source/contract readback, five-row proposal, RV dispositions and scope
handoff to the report; preserve previous partial work and the root design error.
No source changes or experimental execution. All authored research/tool logic
must be Lykn; no Python execution/parity exception, Ruby, Fennel, handwritten
JS/Node helpers, substitute scripting, new Node/npm input, network/acquisition,
generated-output repair, merge/push/publication or extra artifacts. Read-only
native commands/Git and simple file lifecycle only. Return exact commit and
Git ownership for independent review; do not self-accept ledger rows.
