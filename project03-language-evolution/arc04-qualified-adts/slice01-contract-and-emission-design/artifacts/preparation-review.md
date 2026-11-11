# Qualified ADT preparation review

Reviewed planning `a6a328f8a1f5d5ceab105ce2d90c7acdeeb752e5` in the
assigned independent Sol 6.1 High context. This is a read-only source-grounded
plan/prompt review, not feature verification. All QD and QA rows remain open.

**Readiness: ready for the authorized S01 contract/protocol draft.** The two
findings below must be addressed in that draft and its concrete execution
agreement before admitting the emission experiment. Neither a winning layout
nor dependent qualified-ADT implementation is ready or claimed. The proposed
two-layout/six-consumer population is not an operator-approved exact matrix.

## Findings

### PR-01 — Medium: make the zero-unused requirement an explicit gate oracle

Locations: `slice-plan.md:31-40`, `ledger.md:8` (QD-04),
`cc-prompt.md:53-60`; parent `arc-plan.md:36-47`.

The packet requires sources, behavior, effects, metafiles and size measures,
but it does not explicitly require zero retained contribution from an unused
pure ADT, or define what retained case/namespace code would disqualify a layout
for a selective consumer. Merely producing a small bundle and reporting its
size could satisfy the present wording while retaining unused constructors.
“Micro-deployment requirements” is a useful constraint, but a measurement is
not yet its acceptance oracle.

The existing native-tool experiment already supplies the relevant distinction:
`../../slice06-native-esbuild-controls/slice-plan.md:193-218` distinguishes
resolved inputs from retained `bytesInOutput` and requires complete bundle/body
inspection for absent unused-pure code. Project07's approved opt-in requirement
also remains zero library payload without library imports
(`project07-core-library-research/project-plan.md:29-33`). Those are constraints,
not evidence that any new ADT layout satisfies them.

Required resolution: the draft should explicitly state the unused-pure-ADT
retained-byte/code absence oracle, identify the corresponding selective-case
retention target, and preserve positive used-code/effect and published-export
observations. Give the escaping/dynamic namespace its honest, separately
interpreted retention expectation. Keep ordinary entrypoint/wrapper overhead
separate from ADT contribution; a metafile input entry or marker search alone
must not stand in for retained-code proof. CDC/operator agreement must settle
these concrete pass/fail targets before execution. This adds specificity to the
existing six consumers, not a new stimulus population.

### PR-02 — Low: reconcile raw/minified measurement with the bundle ceiling

Locations: `slice-plan.md:32-36`, `ledger.md:8` (QD-04),
`cc-prompt.md:54-60`.

“At most two” layouts by six consumers gives at most twelve layout/consumer
cells. Requiring “raw/minified/gzip measures” does not yet say whether raw means
unminified JavaScript or uncompressed bytes of the minified bundle. In the
former interpretation, twelve cells can require twenty-four emitted artifacts
or bundle invocations. The old tool experiment explicitly used one nonminified
bundle per control; its budget does not answer this new question.

Required resolution: the proposed protocol should name emitted variants and
exact invocation count separately from the twelve consumer/layout cells, and
identify which bytes feed gzip. Obtain agreement on that actual count before
execution. Do not silently expand the ceiling or omit a promised measure.
This is a protocol-accounting ambiguity, not an observed over-budget run.

### Coordinator disposition during preparation review

The coordinator agreed with both findings after this inspection and will amend
the planning packet separately. Its concrete proposal is twelve layout/consumer
pairs times two settings (unminified/minified), hence **24 unique bundle cells**,
with gzip derived using existing native tools and independent replay counted
separately. The gate will require complete unminified output, metafile and
runtime evidence for zero-unused/case elimination, plus explicit retained
behavior/members for namespace escape. Minified symbol-name absence or byte
counts alone will not qualify. This is still a proposed execution scope, not
operator agreement or an executed result. Findings above remain against the
immutable `a6a328f8` packet; a later delta review must inspect the actual amendment.

## Source grounding and authority checks

Source worktree `lang/.worktrees/contract-predicate-lowering` is clean at
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95` on
`codex/completion-value-flow`. Source inspections below are at that revision:

- Native `analysis/type_registry.rs:34-95,103-125` actually indexes constructors
  by bare name and rejects a duplicate user constructor, while retaining
  `owning_type` and `module_path` metadata. The slice correctly identifies a
  real migration point, not a presently supported qualified constructor API.
- `ast/surface.rs:174-194` stores constructor/pattern names as strings;
  `analysis/pattern.rs:62-85` resolves through that bare-name registry.
  `resolver.rs:324-350` preserves pattern syntax and tags actual binders.
  Declared owner/import resolution therefore needs an explicit design across
  these routes; ordinary member-access spelling does not implement it.
- `emitter/forms.rs:3302-3347` emits flat constructor bindings and bare-name
  tags; `:4541-4592` exposes the known nested-field lowering gap.
  `emitter/type_checks.rs:104-117` is the broad tagged-object guard underlying
  NE-T02. `emitter/dts.rs:335-359` declares separate constructor values/functions.
  The draft's binding, owner identity, guards/stripping, diagnostics, declaration
  and migration work correspond to actual current surfaces.
- Public `mod.js:23-24` calls read/expand/compile;
  `expander.js:20-23` delegates to `expander-core.js`.
  `surface.js:18-25` resets the bare constructor map;
  `surface-helpers.js:464-498` uses it for constructor/nested patterns.
  `expander-core.js:653-656` participates in reset. These implementation routes
  must stay in the draft's map when following the listed public facade.
  Pre-registered match metadata is correctly distinguished from runtime bindings.

The recorded Project07 S01 discussion ends with approval of qualified
construction/patterns, declared resolution, distinct owning-type identity and
emission validation. The packet preserves those as constraints. It correctly
leaves concrete tag/owner representation, guard membership policy, mutability,
serialization, import/alias/shadow behavior and migration to explicit design
and CDC disposition. It does not manufacture static exhaustiveness, nominal
unforgeability or recursive container guarantees from the approved syntax.

## Existing tool versus future proof

The existing native esbuild file at
`lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild`
is present, executable and Mach-O arm64. Read-only `shasum -a 256` returns
`b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`, matching
`../../slice06-native-esbuild-controls/artifacts/evidence/tool-identity.txt`
and that slice's independent source/build reproduction. No tool was rebuilt,
acquired or executed by this review. Its old partial experiment did not prove
new qualified-ADT layouts; this packet does not claim otherwise.

S03 explicitly places the concretely agreed comparison before production
layout selection. S04 separately checks the actual implemented build/package
consumers. S02's existing nested/zero-field repair can be detailed without
prematurely selecting that layout. This ordering is coherent. Protocol drafting
is authorized now; matrix/prototype execution is expressly withheld until its
concrete agreement. No additional approval role or experiment is introduced here.

## Coverage, ownership and limits

The QD/QA rows cover construction/pattern grammar, aliases and shadowing,
owner identity across modules, zero-field and nested fields, raw/forged values,
assertion modes, serialization, mutation/hygiene, exported declarations and
source/JS compatibility. The design should distinguish namespace mutation from
payload mutation, and serialization compatibility from runtime identity; these
are already within QD-02, not additional gates invented by this review.

Current crosslinks consistently place NPAT/ZVAR and the NE-T02 contract in
Project03 Arc04. Project07's superseding owner note makes its older provisional
A3-04 paragraphs historical. RDEO stays with the separate reader correction;
RTCK and other guide/book corrections keep their owners. S05's full API audit
and S06's conditional documentation implementation remain explicit, as do
Project07's YAML, final synthesis/library handoffs and actual human source
review. The prepared JSON file/module trial remains queued for refreshed
source/reference pins; original failed authoring and old/new decoder evidence
must remain separate when the new representation is later replayed.

This review used the planning and prompt-authoring readiness guidance, scoped
native/public interface reads, existing S01 independent evidence and exact
operator-discussion receipt. It did not perform an exhaustive code audit,
run tests/builds/prototypes/bundles, author research helpers or change source.
No present layout, contract draft, guard repair, size result or QD/QA criterion
is accepted by this preparation review.
