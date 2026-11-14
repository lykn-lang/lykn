---
project: project03-language-evolution
arc: arc06-adt-modules-and-library-integration
status: planned
version: "0.4"
planned-release: unassigned
depends-on: []
related: [arc04-qualified-adts, arc05-binding-semantics-and-hygienic-emission, project07-core-library-research]
---

# ADT modules and library integration

## Authority and useful result

2026-11-14 carry-forward: [Arc05 S04 source/delivery](../arc05-binding-semantics-and-hygienic-emission/slice04-discard-aware-declarations/cdc-verification.md)
is independently accepted atc0ed454610f3a384196e4fa003335373819fb2fd,
tree7d8b3359; all8DT/BS-04 close with separate closing-metadata PASS. LI-04 must audit
the exact c60dea62→c0ed4546 four-path range: declaration-local anonymous/discard
parameter labels and collisions; default/rest/tuple/object caller input types,
optional fields and explicit undefined; inline/named Bind/BindGroup projection,
scalar literal inference versus unknown destructured leaves; conservative empty
module markers and stale-sidecar replacement; guides00/06 and actual native
AnalyzedUnit/file/package-generated outputs. No Rust public signature, runtime
emission, classified-IR representation or CLI production API changed in S04.

This is the supported native Func/Bind/BindGroup/Type declaration increment,
not complete generator/class/default/re-export/imported/browser declaration
support. Preserve those pre-existing omissions and their actual consumer/API/
guide/book implications rather than infer completion. D-2611-MPVR is a separate
source-admission finding queued under Arc02; rejected required-after-destructure
spelling must not be described as emitted. Nested alias bound_names is only a
later census WATCH, without a demonstrated behavioral defect. All six LI rows
and actual qualified/module/library/book/human gates remain open; no experiment
or new source work is opened by carrying these inputs.

2026-11-14 carry-forward: [Arc05 S03](../arc05-binding-semantics-and-hygienic-emission/slice03-public-binding-discards/cdc-verification.md#final-correction03-verdict--accept--2026-11-14)
is independently accepted atc60dea62. LI-04 must include exact source range
9e6fb127→c60dea62: the new prepareSourceDiscardBindings helper export, existing
functionRegionLayout/bindingScopePlan behavior, bounded static Atom/Keyword→String
classified alias keys and preserved metadata, direct one-clause builder behavior,
early unsupported simple multi-clause diagnostics, raw/source/fragment/JSON and
actual browser/materialized entrances, and guides00/06. Public legacy catch
expression roles and ordinary array-binding elision must stay distinct in the
audit. This adds inputs only; all six LI rows and library/book/human gates
remain open, with no implementation/experiment or release action authorized.

2026-11-14 carry-forward: [Arc05 S02](../arc05-binding-semantics-and-hygienic-emission/slice02-native-binding-discards/cdc-verification.md#final-correction04-verdict--accept--2026-11-14)
is independently accepted at9e6fb127. LI-04 must audit its bounded classified-IR
change: static Atom/Keyword alias keys in newly admitted zero-name BindGroups
become literal String nodes after structural validation, preserving spans and
existing identifier normalization. Include negative numeric-key emission,
native early unsupported SIMPLE multi-clause default/rest diagnostics and the
actual Source versus raw-IR admission/guide distinction. This adds inputs to
the existing explicit-range API/IR/docs audit, not completion or implementation
authority here. All six LI rows remain open; release stays0829e892.

2026-11-13: the operator requests a recorded home for the downstream third
group after approving the binding arc and the remaining ADT feature roadmap.
This is a planning stub. No source work, experiment, library creation or
publication starts here; implementation remains paused.

Make qualified ADTs usable across real modules and selective build outputs,
then demonstrate their use in the retained JSON research specimen and account
for public APIs, guides, the book and human source review. This includes real
module capability work, not only a final testing phase.

This arc receives the former Arc04 roadmap S04–S07 responsibilities. Those
roadmap slots had no opened slices; their identities are preserved in the
[Arc04 transfer map](../arc04-qualified-adts/arc-plan.md). Existing S01 contracts
and protocol remain authoritative:
[qualified ADT contract](../arc04-qualified-adts/slice01-contract-and-emission-design/artifacts/qualified-adt-contract.md)
and the owning S01 plan/evidence. No language or experimental contract changes
merely because ownership moves.

## Candidate roadmap and dependencies

Only arc-plan/ledger stubs exist. Detail a slice when it is near, against its
actual accepted source and consumers; each implementation slice includes its
delivery, migrations, necessary immediate documentation and independent proof.

| Candidate | Useful result | Required input / preserved checkpoint |
| --- | --- | --- |
| S01 imported ADT interfaces and ABI | Non-executing module metadata/graph, imported owners/aliases and actual namespace/token/case exports preserve static and runtime identity | Arc04 closed local semantics and declaration ABI; relevant Arc05 naming behavior. No new user namespace-import syntax or independently cached identity sidecars |
| S02 selective emission evaluation | Execute the already-agreed comparison of two same-module lowering strategies with honest semantics, effect and size results | S01 working interfaces plus accepted local core; frozen candidate/tool/source/fixture checkpoint requires its existing operator disposition BEFORE execution; retain24 bundle cells per contributor |
| S03 build/package and JSON research composition | Implement/verify the selected production lowering in actual selective/escaping namespace and package consumers; re-pin and replay the original JSON decoder with explicit representation changes | S02 disposition, accepted implemented module strategy and relevant Arc04/05 consumers. Prototype output alone is insufficient |
| S04 public API and documentation audit | Account for actual language/JS/Rust/CLI/generated/module surfaces, compatibility and documentation obligations over explicit commit ranges | Delivered feature/composition; coordinate Arc01's whole-work API audit and Project07 rather than duplicating its acceptance |
| S05 conditional documentation and human handoff | Implement S04 findings or justify an actual no-op; integrate required guide/book examples and explicit operator code-shape dispositions | S04 findings; actual separate book/source owners and original Project07 human-review gate |

Prepare metadata/ABI design from accepted S01 inputs without declaring all of
Arc05 a blanket prerequisite. Execution needs the specific local runtime,
declaration and naming checkpoints it consumes. The dependency graph, not
numeric arc order, governs. Early design does not authorize an investigation
or trial; preserve the original agreed question, population and stop limits.

## Boundaries that survive the transfer

- Logical compile-time owner identity and runtime loader-instance tokens are
  distinct; preserve generativity, facade reads/TDZ and the declared ABI.
- Preserve the no-mandatory-runtime, optional `lib/`/JSR-entrypoint direction,
  no-new-Node/npm policy and observable initialization. Compiler gzip and
  emitted application/deployment sizes are different measurements. The0.7.x
  AOT roadmap remains separate.
- Initialization-purity provenance comes from Arc04's reviewed private
  producer/serialization/writer path. No source-shaped annotation, ordinary
  constructor call or test-only optimizer result becomes trusted proof.
- Browser compile-to-ESM proof does not settle existing run/load/indirect-eval,
  CSP or fallback-import execution policy. S04 must identify impacts and
  explicit decisions; no new loader or public assertion-stripping flag is
  selected here. Actual public checked/native checked-and-stripped routes
  retain their precise limits.
- Required source/corpus/doc migrations land with affected capabilities;
  the full audit is not permission to leave shipped examples broken earlier.
- Project07 still owns final research synthesis, original fixture obligations,
  individual JSON/YAML library planning, source-home/licence decisions and
  document-route proof. This compiler integration arc supplies inputs to that
  handoff, not completed libraries or publication authority.
- Reader RDEO/RDCL and Arc01 checked exits/I4, warnings and tooling boundaries
  retain their existing owners. Cold materialization does not prove same-
  version warm-cache invalidation; retain that limit in consumer evidence.

## Verification and ownership

[LI-01–06](ledger.md) remain open. Original Arc04 QA-04–06 and relevant S03
LC-05/07/08 remain open at their original paths until complete verifiers are
satisfied. Re-slicing cannot close them by pointers alone. Final composition
requires actual consumers and independent review, with a closing retrospective;
human/book gates require actual dispositions.

Use existing planning and assigned task homes; refresh pins before authoring.
Current accepted task source is cleanc0ed4546; release is independently accepted
c60dea62. The earlier dba24d40/public-discard-held and release0829 checkpoint
is historical. S04 root closing metadata is independently verified in its owning slice.
Prospective source work uses the established Luna6 High implementer and separate
Sol6.1 High reviewer after explicit implementation resume. Root owns plans and
planning Git/index. No new worktree, CC prompt, source/build/probe/experiment,
merge/push/release, dependency adoption or licence choice is authorized now.
Repository Lykn-only helper rules apply; no Python exception.

## Version history

- 2026-11-14 v0.4: Carry Arc05 S04's exact c60→c0ed generated-declaration/
  optional-input/export/guide impact and explicit unsupported routes into LI-04;
  refresh task/release pins, retain MPVR/Arc02 and alias WATCH boundaries.
  All six rows remain open; no implementation/experiment authority is added.

- 2026-11-14 v0.3: Carry accepted S03 API/helper/layout/classified-IR/signature/
  guide inputs into the existing LI-04 audit; all six criteria stay open.

- 2026-11-14 v0.2: Carry accepted S02 static-key IR/API and guide impacts into
  LI-04 without opening a slice or changing the existing roadmap/gates.

- 2026-11-13 v0.1: Record operator-requested downstream arc stub, transferring
  former Arc04 S04–S07 responsibilities without altering their contracts/gates.
