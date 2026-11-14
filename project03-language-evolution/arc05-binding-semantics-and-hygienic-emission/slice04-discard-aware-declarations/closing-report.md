# CC closeout — Arc05 S04 discard-aware declarations

Date: 2026-11-14

Final root status2026-11-14: S04 independently closes all8DT/BS-04 at
c0ed454610f3a384196e4fa003335373819fb2fd/tree7d8b3359, including separate
closing-metadata PASS for retrospective/parent routing. Release staysc60;
S05 remains unopened. Original CC proposals, HOLD and pending notes below
retain their historical cutoffs; the final reconciliation records the outcome.

Root location correction2026-11-14: after CC's clean/no-jobs handoff, root
moved this complete doer report byte-preservingly from artifacts/cc/closing.md
to the canonical slice-root closing-report.md, then appended this notice. No
doer prose or evidence was rewritten. The source candidate and row proposals
below remain pending independent implementation review; the earlier path is
provenance, not a second current closing report.

## Source delivery

- Branch: `codex/qualified-adt-core`
- Base/release authority: `c60dea62d126bb07557a7f4f7183662dec3f6a58`
- Commit: `918f2e9c4237770fc7b2e0e950d726e735e95198`
- Tree: `37b1cd6e7a457caf94933a35cdac54335c7afb66`
- Parent: `c60dea62d126bb07557a7f4f7183662dec3f6a58`
- Final task source worktree was clean; only these four paths changed:
  `crates/lykn-lang/src/emitter/dts.rs`,
  `crates/lykn-cli/tests/discard_declarations.rs`,
  `docs/guides/00-lykn-surface-forms.md`, and
  `docs/guides/06-functions-closures.md`.
- Commit trailers are adjacent and intact. No release write/merge/push,
  publication, dependency change, or S05 work occurred.

## Implementation and oracle

The native DTS emitter now reserves normalized meaningful parameter names per
clause before allocating collision-free `arg{i}`/suffix labels. Parameter
positions remain intact; `_value` remains named; default and rest input types
follow required-position constraints, including nested tuple skip/default/rest
and object default fields under exact optional semantics. Bind and BindGroup use
the existing binding projection for inline and named exports. Scalar inference
is unchanged, destructured leaves remain `unknown`, and an empty module marker
is emitted only for explicitly handled empty inline Bind/BindGroup exports;
default, re-export, kernel passthrough and named-exports routes veto that marker.
Object/schema `_` keys remain data.

The retained pre-edit semantic red is in `artifacts/cc/baseline-red/`: valid
local type-only TS client, real c60 generated `.d.ts`, Deno exit 1 with exactly
two TS2300 duplicate-identifier errors, and a 1/1 Rust witness asserting that
real checker failure. The earlier invalid `import type`-as-value consumer is
separately preserved as a failed TS1361 attempt and is not counted as semantic
red.

The ordinary required-simple-after-destructured source spelling was separately
run through the existing release-worktree default/debug c60 binary. Its exact
input, command, stdout, stderr and status are in
`artifacts/cc/classifier-boundary/`; it exits 1 in existing CLI prevalidation
with “method call on a parenthesized expression”. The classifier/runtime source
was not changed. The accepted current CLI producer fixtures use first-position
destructuring followed by named defaults (reserving `arg0`/`arg0_1`), and a
named required argument before destructuring; the native lower-level shape test
also covers the required-named-after collision. Root has routed the existing
validator/API limitation to backlog `D-2611-MPVR` and an Arc02 unopened
candidate. This attribution remains an open owner item, not a claim that the
rejected spelling reached DTS generation.

## Final evidence

- `artifacts/cc/focused/final08/native-dts/`: 32 passed, 0 failed;
  1,179 library tests filtered.
- `artifacts/cc/focused/final08/`: CLI integration 4 passed, 0 failed;
  complete raw streams, actual child commands/statuses, generated DTS,
  TypeScript checker receipts, and runtime outputs are nested in `cli/`.
- `artifacts/cc/fresh-artifacts/final03/`: status 0.
- `artifacts/cc/gates/make-check-final03/`: status 0. Full results are
  1,786 Rust tests passed with no failed/ignored tests across 40 harness-result
  rows; 99 Lykn product inputs compiled; product suite 1,578/1,578 across 67
  steps; docs 482/482. Docs separately show 15 annotation/fragment skips and 9
  no-Lykn-block inputs.
- `artifacts/cc/m6-final/`: actual strict Deno 2.9.6 command/config, seven
  selected paths, 70/70 tests, full streams and five compiler warnings. Fourteen
  `.comparison.txt` receipts each show canonical equality to both embedded and
  materialized output.
- `artifacts/cc/gates/cited-paths-final-head/`: status 0, 64 documents,
  601 accepted historical citations.
- `artifacts/cc/gates/bundle-size-final-head/`: status 0, fresh gzip 48,689 B
  against 81,920 B; raw/minified sizes and actual esbuild download/astring
  condition warnings are retained.
- `artifacts/cc/gates/make-check-final/` preserves the initial Clippy
  `redundant_guards` failure; `make-check-final02/` preserves the next
  formatting-only failure. The direct cargo-format correction touched only the
  permitted DTS source. `make-check-final03/` is the terminal successful gate.
- `artifacts/cc/focused/retry01/`, `retry02/`, `retry03/`, `final03/`,
  `final04/`, `final05/`, `final06/`, and `final07/` preserve observed failed or
  superseded test conditions and successes. Some intermediate retry test-source
  versions were not snapshotted byte-for-byte; no such preservation is claimed.
  The baseline and final test sources are retained in their canonical locations.

A first `git commit --only` attempt rejected the new test path because it was
untracked. The exact test file was then staged and the same explicit four-path
`git commit --only` succeeded; no other source path entered the commit. No jobs
remain and final HEAD is clean.

## CC row proposals for separate review

These are CC proposals only. No planning ledger row is accepted or closed by
this report.

| Row | CC proposal | Evidence and limit |
| --- | --- | --- |
| DT-01 | Proposed done | Actual generated declarations and TS calls cover repeated typed discards at indices 0, 1 and 2; later named `arg0`, `arg2`, and `arg0_1`; `_value`; defaults wrapping a first destructured slot; named-before-destructured slot; actual successful AnalyzedUnit and fresh-unit allocator tests. Ordinary required-simple-after-destructured CLI syntax is rejected before generation by the existing validator, recorded above. |
| DT-02 | Proposed done | Actual generated-DTS strict/exact-optional consumer covers default-before-required, trailing and before-rest defaults, discarded rest, tuple before-required/trailing/default/rest/bare-skip optional positions and object default. Native tests cover renderer boundaries. |
| DT-03 | Proposed done | CLI tests cover inline typed/inferred scalar, Bind destructuring, reserved data keys aliased to names, named exports, exact TypeScript `keyof` namespace and runtime keys, empty inline group, stale sidecar replacement, non-module source, and default/re-export/kernel veto controls alone and mixed. |
| DT-04 | Proposed done | TypeScript and runtime checks retain object `_`, ADT `_` property/constructor input, missing constructor field rejection, real `TypeError`, foreign global `_ = 99`, `_value = 7`, empty non-module behavior, overload/warning preservation. |
| DT-05 | Proposed done | A successful AnalyzedUnit projects declarations; CLI normal/stripped DTS bytes match and produced JS is executed; actual `lykn build` package with `emitDts:true` has byte-identical declaration to CLI output for identical source. |
| DT-06 | Proposed done | Local generated `.d.ts` consumers use offline Deno with strict, exactOptionalPropertyTypes and skipLibCheck false; positive and expect-error calls pass and unguarded wrong type yields actual TS2345; runtime/data/export namespace oracles pass. |
| DT-07 | Proposed done | Focused suites, `make fresh-artifacts`, terminal `make check`, exact M6 70/7-path/14-comparison evidence, final-HEAD citations, clean exact-path commit and fresh gzip budget passed. Earlier failed Clippy/format attempts remain separately preserved. |
| DT-08 | Open pending | Separate Sol eight-row disposition and root retrospective/routing are still required. CC inventory, history, explicit boundary and later-owner evidence are provided here. |

## Bubble-up

1. Keep the ordinary required-simple-after-destructured CLI parameter
   validator behavior attributed to existing `classifier/forms.rs` method-call
   prevalidation, distinct from reader, DTS emitter, and generated declarations.
   Root recorded backlog `D-2611-MPVR` and an Arc02 candidate; do not silently
   broaden this slice or claim that spelling was emitted.
2. Preserve downstream owners for class/generator/default/re-export/package
   declaration coverage, general source-name lowering and browser-facing
   declaration entrypoints, whole-language API inventory, qualified pattern
   state/IR provenance, and guide/book/human review, as described by the plan.
3. The measured size target fetched esbuild into the Deno cache during its
   required fresh measurement. This is a tool cache event; no repository
   dependency/lockfile changed.

Independent Sol review and root retrospective remain outstanding. All rows stay
open in the planning ledger until their owners record their disposition.

## CC correction01 implementation and final-pin close — 2026-11-14

Correction01 was issued after the independent source-first HOLD found missing
R01/R02 consumer proofs, not a demonstrated emitter defect. Intake and
source-cited contract readback are appended to
`artifacts/cc/intake.md` (correction01 section; prompt line-count correction
records 144 lines loaded in full). No correction changed the authorized
four-path S04 product scope. Correction01 itself changed only
`crates/lykn-cli/tests/discard_declarations.rs`, retaining its four test groups.
No implementation/docs/runtime/AST/classifier/macro/dependency/lock/M6 source
was changed.

R01 added real inline and named multi-pair BindGroups to the existing export
test. Generated declarations assert typed scalars and `unknown` destructured
leaves; the strict TypeScript consumer checks exact `keyof typeof` names,
positive values, and absent discard/unselected names. Runtime keys and projected
values include both group paths. Existing scalar, schema/data, discard-only,
sidecar replacement, raw export veto and non-module controls remain in the same
group.

R02 added exported `nestedInput` to the shared CLI/package fixture, exercising
the actual nested Object→Array→Object shape, optional defaulted `_`,
default-before-required tuple position and typed rest. Its generated DTS contains
`{ items: [{ _?: number | undefined; label: string }, boolean | undefined,
number, ...string[]] }`. Strict/exact-optional Deno consumers accept both
provided-value cases and reject a string `_`, missing `label`, and numeric rest
item. Checked and stripped outputs agree and execute under foreign `_ = 99` to
`[99,"ok",5,["kept"]]` and `[99,"second",6,[]]`; observed input array
lengths remain 4/4 and 3/3. The actual `lykn build` package declaration remains
byte-identical to CLI output for identical source and its consumer calls the
nested declaration. `items` is only the object property key, never a local in
the Lykn body.

### Correction01 evidence and gates

- `artifacts/cc/correction01/fresh-artifacts/`: `make fresh-artifacts` status 0.
- `artifacts/cc/correction01/focused/`: focused
  `cargo test -p lykn-cli --test discard_declarations -- --nocapture` passed
  all 4 groups. Actual Deno checks used strict, `exactOptionalPropertyTypes`,
  `skipLibCheck:false`, offline/cached local declarations. The unguarded wrong
  slot control remained an actual TS2345 rejection. Runtime receipts preserve
  both checked and stripped output. The two `unused binding` warnings are from
  the newly added named group’s deliberately unselected `grouped-hidden` and
  `grouped-nested-hidden` fixture bindings; they are not a pre-existing repo
  warning baseline.
- `artifacts/cc/correction01/preflight/`: `cargo fmt --all --check` and
  `cargo check -p lykn-cli --all-targets` passed after formatting. An initial
  format check failed on line wrapping in three changed assertions; direct
  `rustfmt --edition 2024` corrected those lines and the full format check then
  passed. The initial failed format output is retained in this task transcript,
  not as a separate raw file; no byte-for-byte raw failure artifact is claimed.
- `artifacts/cc/correction01/gates/make-check-final/`: one final `make check`
  with docs, executed against source commit `8ed7761e834583c7c524783d7614ffb7c53a1420`
  (tree `7d8b3359fa570b2e8322996dbe8b648f02af58da`), status 0. It reported 40
  Cargo harness result rows, 1,786 passed / 0 failed / 0 ignored; 99 `.lykn`
  test inputs compiled; product suite 1,578 passed across 67 steps; docs 482
  passed / 0 failed. Docs accounting is 15 annotation/fragment skips and 9
  input files with no Lykn blocks. Clippy, format, syntax and source lint passed.
  The in-run citation check saw 64 documents and 601 accepted historical
  citations.
- The first full `make check` did not set the optional macro-dependencies
  receipt variable. Its unchanged 14-test harness, including M6, passed, but
  that invocation did not save the M6 command/config/comparison receipts.
  `artifacts/cc/correction01/m6/` preserves the one subsequent focused existing
  M6 test run (status 0; 1 passed, 13 filtered) with receipts enabled. It used
  Deno 2.9.6, an owned cold XDG materialization cache, cached Deno dependencies,
  no npm, and seven explicit local public-test paths. The strict materialized
  run exited 0 with 70 passed / 0 failed. Fourteen named file comparisons
  individually record canonical=embedded and canonical=materialized true. The
  run's full command, config, status, stdout/stderr, inputs and generated output
  are retained; no selected-test population was inferred from an exit code.
- `artifacts/cc/correction01/gates/c0ed-final-head/cited-paths/`: final
  replacement-HEAD `make check-cited-paths` status 0, 64 documents / 601
  accepted historical citations.
- `artifacts/cc/correction01/gates/c0ed-final-head/bundle-size/`: fresh final
  replacement-HEAD `make bundle-size-check` status 0 against 81,920-byte gzip
  budget: raw 379,173 B, minified 181,014 B, gzip 48,689 B. Deno 2.9.6,
  TypeScript 6.0.3. The command emitted esbuild download notices and repeated
  existing astring `browser`-condition ordering warnings; no project dependency
  or lockfile changed.

The first source commit `8ed7761e834583c7c524783d7614ffb7c53a1420` contained a
blank paragraph between its two required co-author trailers. This metadata
failure is preserved as the raw original object under
`artifacts/root-metadata01/original-8ed7761.commit`, with its command message
and coordinator rationale in that directory's README. CC did not amend or
recreate it. After clean handback, root preserved the exact original object and
created `c0ed454610f3a384196e4fa003335373819fb2fd` using the same tree, parent,
author/committer identity and timestamps, changing only the inter-trailer blank
line, then compare-and-swapped only the task ref. The original and replacement
raw objects and message are retained in `artifacts/root-metadata01/`. No focused,
full, or M6 runtime tests were repeated for this metadata-only repair; those
results remain attributed to 8ed and its identical tree. The two final-HEAD
gates above were freshly run on c0ed.

Final task source pin is `c0ed454610f3a384196e4fa003335373819fb2fd`, tree
`7d8b3359fa570b2e8322996dbe8b648f02af58da`, parent
`918f2e9c4237770fc7b2e0e950d726e735e95198`, branch
`codex/qualified-adt-core`. Exactly one path changed in the correction commit:
`crates/lykn-cli/tests/discard_declarations.rs` (54 insertions, 10 deletions);
the final source tree is clean. No jobs remain. Release/0.6.x remains c60. No
S05, merge, push, remote update or publication was performed. Root owns planning
Git/index/ledger state.

## Correction01 CC row proposals for separate review

These proposals are not acceptance; all eight ledger rows remain open until
their owners record disposition.

| Row | CC proposal | Correction01 evidence and limits |
| --- | --- | --- |
| DT-01 | Proposed done | Retained repeated typed discard positions, named-label/suffix oppositions and allocator evidence; actual nested parameter consumer now also proves discarded default values do not capture `_`. The required-simple-after-destructure CLI spelling remains rejected by inherited prevalidation and is not claimed emitted. |
| DT-02 | Proposed done | Retained defaults/rest/tuple/object controls; the actual generated recursive input type now covers optional nested `_`, default-before-required tuple slot and typed rest with positive and negative strict/exact-optional calls. |
| DT-03 | Proposed done | Actual inline and named multi-pair BindGroups now assert typed scalar and unknown leaf declarations, exact namespace keys, hidden-name rejection and runtime projected values, alongside the preserved veto/sidecar/empty controls. |
| DT-04 | Proposed done | Existing schema/data/constructor `_`, `_value`, overload/warning and non-module controls remain; correction01 changed only tests and introduced no emitter or schema behavior. |
| DT-05 | Proposed done | Actual CLI generated declaration, checked/stripped byte equality and executed JS plus `lykn build` package byte equality and nested generated-DTS consumer are exercised. Native successful-unit and prior low-level receipts remain as originally attributed. |
| DT-06 | Proposed done | Offline Deno consumers use actual generated `.d.ts`, strict/exact optional settings, positive calls and three nested expect-error controls; the unguarded wrong-type control produced TS2345; runtime values, foreign `_`, and caller lengths are observed. |
| DT-07 | Proposed done | Fresh artifacts, focused four-group test, final `make check`, 40 Cargo harness rows / 1,786 Rust tests, 99 `.lykn` inputs, 1,578 product tests / 67 steps, 482 docs, seven-path M6 70/0 and 14 comparisons, final c0ed cited-path check and fresh 48,689-byte gzip size all pass. Initial formatter failure, first-M6 optional-capture omission, and original commit-message metadata failure are retained separately and corrected/attributed. |
| DT-08 | Open pending | Independent Sol review, root retrospective and remaining S04-to-Arc/API/IR/research routing remain separate owners. CC returns the full eight-row proposal set and inventory; no higher-scale acceptance is claimed. |

## Correction01 bubble-up and limits

1. Preserve D-2611-MPVR and the Arc02 candidate for the ordinary required-simple-
   after-destructure CLI prevalidation boundary. This correction did not alter
   validator/runtime grammar or claim that rejected spelling reached DTS.
2. Retain the prior downstream owners for broader class/generator/default/
   re-export/package declaration routes, source-name lowering, browser-facing
   declaration entrypoints, full language API inventory, qualified pattern
   state/IR provenance, and human guide/book review. Correction01 adds the
   specified grouped export and recursive-input witnesses only.
3. Keep the two new unused-group fixture warnings, earlier format attempt,
   omitted optional M6 capture on the first full check, and original 8ed trailer
   metadata condition distinct from successful reruns or root's metadata-only
   repair. The required c0ed final-HEAD citations and size gates are fresh.

Independent Sol review and root retrospective remain outstanding. CC's
proposals do not change the ledger or independently accept S04.

## Root handoff attribution — 2026-11-14

Root verified clean finalc0ed/tree7d8b, unchanged four-path c60 delivery and
zero original8ed-to-replacement byte diff after clean/no-jobs CC handback.
The correction01 phrase "no npm" above is not a demonstrated blanket dependency
claim: the captured strict-public command uses cached-only Deno, the standalone
macro child argv is not separately traced, and the shared DENO_DIR is warm.
No new repository dependency/lockfile was introduced. M6's config is an import
map, distinct from the explicitly strict/exactOptionalPropertyTypes/
skipLibCheck:false local DTS-consumer config. Actual profiles and warning/cache
limits remain binding. No additional runtime run is required for this wording
clarification. All eight DT rows stay open pending independent source/gate
review and root final retrospective/bubble-up reconciliation.

## Root final-source reconciliation — 2026-11-14

Separate Sol's [correction01 implementation/delivery ACCEPT](cdc-verification.md#correction01-implementationdelivery-verdict--accept--2026-11-14)
accepts DT-01–07 on actual cleanfinalc0ed4546/tree7d8b3359. Fresh independent
CLI4/0 and fullRust1786/native1211 includingDTS32/product1578 across67steps/
docs482 passed; same-invocation actualM670/7paths/all14 comparisons, finalHEAD
64/601 citations and fresh48689/81920 gzip all passed. Correct documentation
categories, JSR reachability self-skip, profile/cache/download/warning and
untraced macro-child argv limits remain as recorded by Sol; no gate is omitted.

Explicit execution-attribution correction to the doer appendix above: its
focused/full/M6 runs occurred on dirty918 plus the correction01 test delta,
before8ed was created. Those bytes subsequently became tree7d8b/8ed and
identical-treec0ed. They are applicable historical evidence by content identity,
not proof that8ed was already checked out. Sol's final independent commands
ran on actual cleanfinalc0ed. Earlier failed source/gate conditions and raw
metadata objects remain preserved; neither the message replacement nor this
wording clarification creates a new runtime observation.

Eight opening criteria remain eight: DT-01–07 are independently done with the
per-row mapping in ledger.md and Sol's complete eight-row walk. DT-08 is the
sole pending status until compact closing-metadata review confirms the root
retrospective and parent routing below. Root completed the first-class
[retrospective](cdc-retrospective.md), including planning/readiness mistakes,
proof gaps, location/TypeScript/metadata/capture failures and prior S03
recommendation follow-through. One review refinement was spent; prior local
attempts and immutable initial/correction prompts remain visible.

### Final artifact inventory

Existing artifacts/cc retains initial intake, actual semantic red/invalid-client
attempt, classifier-boundary release witness, failed/successful focused and
gate conditions, M6 delivery evidence and correction01 receipts. New
artifacts/root-metadata01 retains both raw commit objects, exact message and
repair rationale. Independent artifacts/cdc/correction01 contains commands/
source-profile/hash record; fresh/focused/full/cited/size stdout/stderr/status;
actual full/cli generated-DTS/TS/runtime/package receipts and full/m6 actual
command/config/status/streams/all14 comparisons. No optional archive/replay
framework was created. Issued prompts, plans, ledger, close, verification and
retrospective are first-class slice records, excluded from supporting artifacts.
Missing interim test snapshots and the correction01 formatter failure's
transcript-only capture stay explicit; no reconstruction is claimed.

### Final bubble-up and endpoint

This increment supplies BS-04's discard-specific native declaration capability,
with honest pre-existing broader declaration omissions. Once DT-08 metadata
review passes, BS-04 closes alongside BS-01–03; BS-05–09 stay open. No structural
arc-roadmap amendment is needed. S05 native compiler-generated name hygiene
is the next candidate, unopened; general exact-name lowering and S09 signature
design retain separate source-ready planning and review.

Arc06 LI-04 now owns exactc60→c0ed declaration labels/default/rest/tuple/object/
export/empty-module/guide impacts and unimplemented generator/class/default/
re-export/imported/browser routes. No public Rust signature or runtime/IR/CLI
production change is inferred. All six LI rows stay open. D-2611-MPVR stays
under Arc02's unopened maintenance candidate; nested-alias bound_names remains
only a watch for future census. Arc04/retired S03 preserve paused qualified
activation, all15 original dispositions and native759/public499 boundaries.
Project03 P-BIND/P-QADT and original QA/LC composition remain open. Project07
JSON/YAML/document/final synthesis/reader/book/human/source-home/licence
obligations remain open; no library trial resumes. Root updated those owning
plans/ledgers without changing the original criteria or acceptance boundaries.

Task source remains cleanc0ed with exactly the same four product paths; release
remains independently acceptedc60. No S05, additional merge, push, hosted CI,
publication or dependency/licence choice is opened. Planning commit for this
close set is pending until committed; root will report its actual hash.

Final closing-metadata PASS2026-11-14: the same separate Sol reviewed the
completed retrospective, eight-row ledger and all parent diffs, accepted DT-08
and authorized final S04/BS-04 status flips. Root applied only those reviewed
closing transitions. All eight DT criteria and BS-01–04 are done; BS-05–09,
P-BIND/P-QADT, original QA/LC and six LI composition/later criteria remain open.
No runtime gates were repeated for metadata. Source remains cleanc0ed and
releasec60, with no jobs or next-slice/remote action.
