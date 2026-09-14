# Dependency and document-route choices

Status: **reviewable choices; no operator policy acceptance or adoption**.
The [source inventory](dependency-inventory.md) supplies static boundaries;
prior JSON/value/resource CDC and [Slice08 CDC](../../slice08-file-fault-completion/cdc-verification.md)
supply behavior. This slice ran only native research tools and static graph
transport. Rich document APIs remain untested in a compatible route.

| Alternative | Actual read/parse/edit/write and fidelity evidence | Values, errors and resources | Boundary / maintenance / decision |
| --- | --- | --- | --- |
| Native JSON plus Lykn validation | Deno file operations + JSON.parse, edit decoded values, JSON.stringify; prior J evidence measures value rewrites. Whitespace, original numeric spelling and duplicate occurrences are not a source document model | Validate finite numbers and application precision; preserve arbitrary keys via data access. BigInt stringify throws; undefined/functions/symbols have position-dependent omission/null outcomes. Recursive ADT must validate external values and wrap thrown parse/I/O errors in explicit Result variants | No third-party parser package; runtime is still pinned Deno/V8 and compiler exceptions remain. Lowest parser maintenance cost, but application policy/validation remains ours. Decide accepted JSON domain, duplicate/numeric loss and error contract |
| Pinned std JSON/JSONC/streams + YAML value APIs | JSONC parse discards comment syntax; JSON streams process values, not editable syntax. std/yaml parse/parseAll/stringify supports measured value operations and schemas; Y-10/11 show presentation loss. Reading/writing remains separate Deno file policy | YAML aliases/tags, non-string keys, cycles, Date/Map/Set/nonfinite values require explicit domain/conversion policies; no blanket recursive JSON ADT equivalence. std/yaml has no distinct toJS or package resource-bound API. Stream framing does not prove constant memory | Permitted export graph has no Node/npm edges. MIT and js-yaml ancestry, std repository npm/test ecosystem remain explicit. Decide whether that ancestry/development boundary is acceptable. Wrappers and regression maintenance remain ours |
| Eemeli 2.9.1 unchanged | Static parseDocument/parseAllDocuments, Document.setIn, toString, comments/source tokens are document candidates; no compatible execution or preservation result accepted | Distinct document/node graph and conversion-to-JS stage; maxAliasCount during conversion is not a parser-wide bound. Capture warnings/errors and graph identity explicitly; no assumed ADT losslessness | Runtime node:process/node:buffer disqualify under current boundary. ISC, npm build/test ecosystem. No execution/adoption authority; unchanged candidate stays gated |
| Eemeli browser build claim | Source config generates ESM and replaces Node bindings; emitted distribution absent from source archive. No independently verified build/graph/API/fidelity proof | Substituted Buffer/warning/env behavior needs explicit API comparisons; browser compatibility does not establish conversion, byte preservation or resource guarantees | Existing Rollup/Babel/TypeScript build is npm-based. Requires reproducible artifact provenance, license notices, policy decision and separate bounded proof; cannot be accepted simply by selecting a browser export |
| Independently maintained Lykn/Deno document implementation or port | Possible ownership of parsing, document nodes, edits and serialization; currently a design alternative with zero execution evidence | Must define concrete trivia/token model, aliases/cycles/schema/value mappings, Result boundaries, limits and cancellation. All 28 original Y-14 trials and their physical byte comparisons remain required | Highest maintenance burden: conformance corpus, upstream/security tracking, divergence ledger, release/build ownership, license/ancestry preservation. Operator must choose permitted reuse versus independent implementation and actual source home before implementation |

## Concrete operator decisions

1. Is the boundary runtime imports only, or does it also exclude historical
   ancestry and upstream development/build ecosystems? Existing compiler npm
   and node:path use is a fact, not authorization for any new library exception.
2. For each format, is value rewrite sufficient, or is preservation of comments,
   directives, anchors, styles, order and unrelated bytes required? Specify the
   allowed differences; do not label a serializer “lossless” without a domain.
3. Is reuse/porting from MIT/ISC ancestors acceptable, with retained notices,
   or is independently authored implementation required? Choose who owns fixes,
   conformance updates, security response, releases and long-term divergence.
4. Choose source home and later project/release assignment explicitly. The
   verified local `lykn` release worktree is the compiler correction home;
   the verified lykn-patch organization currently exposes only mycelium, whose
   README describes a web framework. No JSON/YAML repository was found or
   invented. A future library home remains unassigned pending the design decision.
5. Approve recursive ADT/Result and representative Lykn source only after Arc02
   trials and actual operator review. P-04/P-08 cannot be supplied by this packet.

The operator explicitly answered the source-home clarification after the Slice09
handoff: “Leave source home unassigned pending design.” This records deferral of
selection to design; it selects no repository, maintainer or implementation route
and authorizes no repository creation or adoption. This answer supersedes the
unanswered-question note retained as historical evidence in the sealed research
packet. The other policy choices above remain proposals awaiting actual answers;
no response or timeout is treated as acceptance.

## File policy from verified evidence

Slice08 distinguishes actual cross-device rename (os error 18), actual directory
failure (IsADirectory/os error 21), and Deno source-read denial (NotCapable).
Permission design must include both rename source and destination requirements;
a denied call is not evidence about the OS operation. Same-filesystem sibling
temp + flush/close + rename is a candidate policy supported by observed complete
replacement and cancellation/reader controls, not a universal atomicity promise.
Cross-filesystem fallback must be a separately named policy; silently switching
to copy would change visibility, failure and cancellation semantics.

Before implementation, decide mode/link treatment, conflict detection/two-writer
policy, orphan ownership and recovery, overwrite authorization, error-stage
reporting, directory flush/crash-durability requirements and cancellation after
the commit point. A post-rename cancellation cannot honestly promise rollback.
Raw partial writes were detected; cleanup does not erase that evidence. Sampled
RSS and bounded trials establish no universal allocation ceiling or safe maximum.

## Actual route and re-entry

No already independently verified compatible document route exists in the
retained evidence. The concrete prerequisite is
[Arc03/Slice08 document-route-design](../../../arc03-findings-and-integration/slice08-document-route-design/slice-plan.md),
with its own ledger/prompt and registered ancestor row. It is **design-only**;
this turn opens the assignment but does not perform it. Source-home verification
records the actual inspected repositories and reserves the future library choice
for the operator. It authorizes no repo creation, vendoring, port or package trial.

Later implementation/evaluation requires the design's recorded operator choices,
an exact authorized source home/worktree, an implementation-specific open set,
and independent API/graph/provenance proof. Only that route can re-enter all 28
original Y-14 variants (same Y-10/Y-11 bytes/edits; comments/source tokens on/off).
All 36 unsupported Y-13 cells keep their reasons: 18 missing conversion API,
27 missing package-bound API, overlap nine. A new API plus separate reviewed
protocol is required to re-enter those cells; they are not failed timings.

Slice10 owns original R-01/03–09, exact J-16/Y-13/DB physical crosswalks,
effective argv, supported-pair availability, five negative families and complete
fresh/captured eight-row DB composition. Deno 2.7.7 is removed and cannot count
as a fresh comparison. Arc02 owns ADT/authoring and human source review; Arc03
retains test/guide/book/compiler correction and integration duties. No parent
DB, arc or project row closes from this decision packet.
