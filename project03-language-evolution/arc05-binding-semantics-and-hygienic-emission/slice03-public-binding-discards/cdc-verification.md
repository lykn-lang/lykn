# S03 independent CDC verification

## Source-readiness review — PASS — 2026-11-14

Reviewer: the separately assigned OpenAI gpt-6.1-sol/high CDC context
`/root/arc05_s03_cdc`; root owns design/planning and source/build preparation,
and the operator selected Luna6 High as the prospective CC implementer.
This verdict covers the corrected, still-unissued initial draft, not an
implementation. All nine PB rows remain open.

Source inspected in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, assigned
branch `codex/qualified-adt-core` at
`9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`, tree
`6d64692fde0c367e73deeda1ec1aca19e49d6b93`. Root supplied the clean pin;
this readiness assignment prohibited Git/index operations, so the reviewer
did not independently repeat that status check. Planning is the existing
orphan planning worktree. Release remains outside this assignment.

Read the full draft slice plan, nine-row ledger and initial prompt, including
root's preparation corrections; repository AGENTS.md; collaboration-framework
and project-management routing; engineering-methods' prompt-authoring/intake
and readiness contract; the relevant JS/Deno identity, copying, scope and error
testing guidance; testing's validation/proportionate-proof guidance; and the
relevant source language/API and accepted S02 boundary records. Inspection used
bounded source reads, symbol searches and a static selected-test census.
Source and guide locators below describe the inspected baseline, not planning
as a second source tree.

### Source-grounded conclusions

- The two preparation doors are viable. Explicit escapes validate and mark at
  `packages/lang/expander-core.js:1956–1987`; the normal fallback at2338 follows
  lexical resolution, classification and macro expansion at1991–2144.
  `expandAt:1881–1906` propagates sanctioned identity. Preparation must operate
  on the precise node later marked, while skipping already sanctioned own
  slots. Generated Type constructors really bind schema `_` fields at
  `packages/lang/classifier.js:1537–1581`; expansion sanctions their output at
  `packages/lang/expander-core.js:2085–2100`. A global writer/tree rewrite would
  violate the contract.
- Occurrence-local structural copies fit existing identity ownership:
  `cloneOccurrenceSyntax:855–864`, `compilerPrivateAtom:763–768` and
  `finalizeCompilerPrivateAtoms:1263–1291` in expander-core preserve private
  capabilities through actual object identity. The draft correctly rejects
  JSON/structuredClone as a copying mechanism before finalization, while
  retaining finalized JSON as a public output check.
- Ordinary pattern preparation can extend the existing
  `surface-helpers.js:369–443` recursion without touching default RHSs or keys.
  Actual per-parameter and class-member slots follow compiler.js:825–912 and
  lexical-regions.js:10–144. The untyped spread omissions are real:
  binding.js:673–693 and lexical-regions.js:67–100 omit a role already consumed
  by compiler.js:1968–1975. Typed parameter grammar need not widen.
- Catch must follow the legacy expression writer and suffix selection,
  compiler.js:1084–1138, not ordinary declaration patterns. The corrected
  design now follows default/rest/spread expression operands at1437–1458 and
  1508–1517, object shorthand/pairs/computed keys at1520–1602, and selected
  catch/finally/direct-body expansion in expander-core.js:1140–1184.
- Public grouped admission is already broader than the native historical
  proxy: classifier.js:350–393 admits untyped non-atom patterns without a
  nonempty-name gate, and compiler.js:1934–1937 supports empty-list shorthand.
  Normalizing static alias keys only for zero-name untyped groups fits
  compilePatternKey:2097–2105 and the existing Keyword conversion at
  compiler.js:1814–1815. Preserving String/numeric keys, named/single/raw
  branches, metadata and expression roles is explicitly specified.
- The shared signature rejection can use actual parseTypedParams results
  (surface-helpers.js:565–633) before expansion. Func classification/emission
  at classifier.js:294–304 and742–765 plus exported builders at823 and982 are
  genuine entrances. The corrected recipe delegates one-clause calls in the
  exported multi builder itself, preserving both source and direct callers.
- M6's retained population statically totals62:5 embedded ADT +6 type context
  +17 reserved bindings +6 ICU +21 lexical regions +7 existing discards.
  The selector and exact count assertion are macro_dependencies.rs:1124–1163;
  its14 canonical/embedded/materialized comparisons are1059–1098. Eight new
  top-level tests yield the specified70. This is a census, not runtime proof.

### Preparation observations and disposition

Review and root's parallel source inspection corrected three consequential
draft details before issue: ordinary `function` is named-only (compiler.js:825),
whereas `function*` admits anonymous layouts (851–891); public catch defaults,
rests and spreads retain legacy expression recursion, and an `alias`-named
object property is not a standalone alias subwriter; one-clause delegation
belongs in the exported multi builder with direct-builder default/rest proof.
Root also replaced approximate guide names with actual reading-manifest
headings. These are preparation corrections, not an accepted implementation
or a spent CC refinement. No source or test was changed by this reviewer.

The corrected plan/prompt/ledger agree on exact14 product paths, eight new test
groups and nine open PB rows. The recipe resolves the consequential producer,
role, admission, static-data and signature decisions. The foreign99/argument7,
iterator-result getter0/2 and early-close1/1, catch live-value/legacy8, unexpanded
default macro0, source-only namespaces, schema7/type-error and raw-versus-
expanded controls distinguish plausible wrong implementations. Real facade,
fragment, browser compile-to-ESM and materialized delivery gates are retained,
with the browser execution-policy claim explicitly bounded. No material
readiness ambiguity remains.

**PASS for root to finalize and issue this draft within its recorded authority.**
No build, runtime experiment or Git/index operation was performed, and no PB
implementation criterion is independently accepted here. The later source
verdict must inspect CC intake/readback, actual candidate/diff and oracles,
then reproduce the required focused/full/inner M6/citation/fresh-size checks.
Source/build ownership remains with root; this reviewer has no running jobs.

## Initial implementation verdict — HOLD — 2026-11-14

**HOLD candidate30d8b77c4e5516191fc9d470325c4ead64e9fba4, tree
eed763256aada46c8bc5e7a848be09c7a1f7f19c.** Same separate Sol6.1 High CDC
context; Luna6 High implemented. The complete14-path delivery was inspected,
including all378 lines of the new suite; five mirror pairs were byte-compared
before omitting duplicate semantic reads. Current full plan/ledger/initial
prompt/metadata01 prompt, CC intake/closing additions and metadata receipts were
loaded. Read-only Git confirms clean source and correct replacement messages,
trees and ancestry. Readiness PASS above remains its historical design verdict.

Fresh evidence and exact command recipes are in
[artifacts/cdc/candidate30-source-first.md](artifacts/cdc/candidate30-source-first.md),
with the Lykn consumers, source witnesses, consequential generated output,
streams and numeric statuses. `make fresh-artifacts`0 preceded staged consumers;
the new8 suite passes8/0 despite the defects below. No aggregate/full66/M6/
citations/size gate was run on known-held source. CC's earlier gate receipts
remain doer-attested at their original conditions.

### Consolidated findings

**R01 — P1, preparation crosses the source child boundary (PB-01/02/04/07).**
`packages/lang/surface-helpers.js:418–443` recursively prepares an async payload,
includes typed Source `lambda` in a raw-function helper, and recursively prepares
any numeric-for initializer. This runs before the child has its own lexical/
surface/macro decision. Actual valid `(async (lambda ((object :number _)) _))`
is rejected with `field name must be an atom`; the same source at9e compiles
and runs99. Scalar async lambda instead leaks `arg 'discardValue__private'`
in its runtime TypeError through both public Deno and staged browser facades,
where the unwrapped control says `arg '_'`. A numeric-for initializer calling
a lexically bound `async` callback around typed lambda similarly corrupts that
source label; actual9e preserves `_`. Receipts: `typed-object-async-lambda`,
`baseline-typed-object-async-lambda`, `typed-async-lambda`,
`browser-typed-async-lambda`, `for-lexical-async` and their controls.

Keep own-slot preparation local: let the normal child expansion route own
typed classification, lexical resolution and raw preparation. Numeric-for's
rule concerns its declaration binder, not arbitrary initializer expressions.
Add actual async typed scalar/object success and exact type-error controls,
plus a lexical initializer control. The currently bound-but-uncalled async
arrow at new test107 does not prove its runtime behavior; invoke it as well.

**R02 — P1, an admitted anonymous generator layout is not prepared
(PB-02/04/07).** The actual writer at `compiler.js:854–881` accepts the documented
empty-string sentinel `(function* "" (params) ...)` in addition to list-first
anonymous parameters. `surface-helpers.js:427–430` selects its String node as
the params slot and leaves `_` literal. The actual public witness
`(bind f (kernel:function* "" (_) (yield _)))` yields7 against foreign99.
`lexical-regions.js:36–47` also selects the wrong params/body region for this
layout, so fixing preparation alone does not establish named/default scope.
The existing binding projection at binding.js:664–672 already checks args[1]
for non-list-first layouts; reconcile all consumers with the real writer.
Retain named/list-first cases and add the sentinel's discard, named form-head
resolution, default expansion, arity and call/advance controls. Do not widen the
writer or infer source admission from unsupported kernel prefixes.

**R03 — P2, the throwing-default oracle passes a syntax failure (PB-02/08).**
New test `test/forms/remaining-discard-bindings.test.js:144–147` puts a `throw`
statement directly in a default expression. Actual output is
`function throwDefault(x = throw new Error("default boom");)`, and Deno returns1
with `SyntaxError: Expression expected`. `executeFailure:31–45` only checks
nonzero plus a message substring, so the source excerpt's `default boom` makes
this test pass. A valid helper function called by the default produces an
actual `Error: default boom` in the contrasting independent receipt.
Use a valid expression and discriminate actual runtime error class/message
from parse failure. Apply the helper's failure discrimination to its schema
TypeError use too; source excerpts are not runtime exception evidence. Preserve
the original failed oracle rather than recasting its8/0 result as proof.

**R04 — P2, several explicit new-path obligations lack discriminating proof
(PB-04/05/07/08).** These are required-proof gaps, not additional confirmed
production defects:

- Spread test201–204 uses args:length and explicit `(get bind 0)`, which do not
  test whether a spread-bound form name is resolved as a callable head. It has
  no top-level spread with nested default whose RHS actually needs expansion.
  Reserved eval rejection is a useful control but does not prove these two
  separate consumers. Use an opposing form-head result, for example a callable
  `array` bound through a spread object's index0, and a default RHS requiring
  real expansion. Assert exact runtime result and once-only/lazy effects.
- `expandExpr` is imported but unused in the new suite. The retained S01 fragment
  at discard-bindings.test.js:482–484 uses a nondiscard typed fn and only checks
  ESTree type; its whole-unit failure is a malformed typed header. They do not
  exercise this new raw-form fragment producer's private allocation/finalization,
  failure after preparation, recovery and finalized JSON execution. Add bounded
  same-context checks through actual expandExpr/compileExpr or compile output.
- Grouped test223–226 exercises flat aliases/array hole/empty-list admission;
  its default-effect test227–228 is a single Bind. There is no new-path nested
  grouped default/rest/static-key/RHS role control. Existing S01 spread/default
  tests cover already-admitted single/named branches, not this new zero-name
  literalizer. Add grouped nested/default/rest runtime effects and actual
  classified-node assertions for unchanged String/number/named/single/RHS roles
  and normalized-key metadata, using existing product tests rather than a new
  harness.
- Delivery test355–374 imports `visible` and calls it, but never inspects the
  namespace. Retained S01 namespace tests support the unchanged export wrapper;
  they do not supply this assignment's promised remaining-form/browser namespace
  observation. Extend the existing consumer to assert exact source-only keys
  for the representative delivered source, including the browser facade.

Keep eight top-level groups/M6 population70, preserve useful existing tests and
avoid turning these focused controls into new generic verification machinery.

**R05 — P2, guide merges two different array roles (PB-03/07).**
`docs/guides/00-lykn-surface-forms.md:1410–1417` says array-pattern `_` is an
elision and then applies “this meaning” to the legacy catch slot. The public
catch writer uses expression arrays, and the accepted implementation/test
intentionally consumes a live value there. Explain that catch distinction
explicitly, retaining the native/public binding teaching and raw-IR boundary
without implying all raw array underscores become value binders.

### Scope, retention and nine-row disposition

The metadata01 correction is independently reconciled: all four preserved raw
objects hash to their named IDs; replacement trailers are adjacent; C1/final
trees and baseline ancestry are unchanged;85→30 content diff0; exactly14 product
paths. No further metadata repair is requested. This preserves applicability
of CC's old source-content results as attestation, not independent acceptance.
The initial sampled intake and misplaced evidence were corrected before product
module edits per the appended record; the missing earlier invalid-fixture
snapshots/aggregate denominator remain disclosed limits, not fabricated proof.

| Row | Initial independent disposition |
| --- | --- |
| PB-01 | Open; ordinary/iterator cases reviewed and new8 run, but R01 exposes initializer-role crossing. |
| PB-02 | HOLD R01/R02 actual source defects and R03 false error oracle. |
| PB-03 | Source/catch cases reviewed, useful new runtime coverage; R05 teaching correction and final retained-gate proof pending. |
| PB-04 | HOLD R01/R02 boundary/layout defects and R04 spread/fragment proof gaps. |
| PB-05 | Source normalization shape/flat live-key cases reviewed; R04 nested/grouped/role proof remains. |
| PB-06 | Shared guard, direct one-clause delegation and new8 cases supported; no observed signature defect, final acceptance pending repaired candidate gates. |
| PB-07 | HOLD R01/R02/R04/R05. Raw7/expanded99 and schema/JSON boundaries have useful existing/new evidence, not blanket failure. |
| PB-08 | HOLD R03/R04; full66/full make check/actual M670/14/final citations/fresh size remain unrun independently until source/oracles are ready. |
| PB-09 | Open; independent HOLD returned for scoped correction. Root retains retrospective/closure/bubble-up duties and S03 endpoint. |

All9 PB rows remain open. No source/test/ledger/index edit was made by this
reviewer; only this record and necessary artifacts/cdc evidence were authored.
Source is still clean30d8b77c/treeeed76325, release/0.6.x remains0829e892. All
owned commands have completed. Exclusive source/build ownership returns to root
for a consolidated bounded correction; S04/release/remote actions remain held.

## Correction02 source-readiness — PASS — 2026-11-14

Same independent Sol6.1 High reviewer read the complete199-line issued
`cc-prompt-iteration02.md` and v1.1 plan's current-assignment, authority,
preflight, assignment-history and version-history amendments before CC
dispatch. This is a compact follow-up against the source/writer/region and
oracle inspection recorded above, not acceptance of unwritten source.

The six-path correction coherently addresses R01–05 while retaining all9 PB
rows, the complete14-path delivery, eight new groups/M670 and existing gates.
Removing both async and numeric-for parent recursion gives each child its own
normal resolution/classification/preparation door; removing early lambda
handling preserves typed Source parsing and source diagnostics. Reusing
functionRegionLayout for actual own raw callable params avoids another index
algorithm, provided its corrected params/body/name paths follow the unchanged
writer's list-first versus non-list-first generator forms and real name test.
This fits the already inspected compiler.js:825–912 and lexical-regions.js.

The new oracles distinguish the reproduced defects: typed object admission and
exact source TypeError labels, both facades and lexical initializer, actual
async-arrow execution; sentinel foreign99/argument7 plus default/form-head
scope and call/advance timing; valid throwing-helper defaults with actual error
class/message; opposing spread callable/default behavior; raw fragment failure
after allocation and same-context recovery; genuinely grouped nested effects
and static/expression representation controls; exact namespace keys through
both compilers. The prescribed catch wording distinguishes ordinary elision
from legacy bare catch-array consumption without promising a new grammar.

No consequential ambiguity remains in this correction's recipe or acceptance
method. **PASS for the recorded CC dispatch.** Candidate30/HOLD, metadata01
reconciliation, prior failed oracle and all evidence limits remain preserved.
No source edit, runtime/build experiment or Git/index operation was performed
for this readiness follow-up. Source/build remains root-owned until dispatch;
implementation acceptance and every PB closure remain pending.

## Correction02 implementation verdict — HOLD — 2026-11-14

**HOLD3d21eab58cb3d28714338e8742dbb0a9c519822b, tree
b7788f6564863f51d5e8fe62979098b583b7b4b6.** Same independent Sol6.1 High
reviewer. Actual six-path correction and full540-line suite were read, with
current required prompt/intake/closing additions and relevant whole consumers.
All five mirror pairs match. Corrected source is clean, exact six-path delta
and14-path baseline scope preserved, and the actual trailers are adjacent.
Source-first evidence is
[artifacts/cdc/correction02/source-first.md](artifacts/cdc/correction02/source-first.md).

### R01–05 correction disposition

R01's async/for parent recursion and early lambda treatment are removed; own
raw callable preparation now reuses functionRegionLayout. R02's actual
generator name/parameter/body selection agrees with the writer, including
String-sentinel anonymous functions. Both-facade async typed object/scalar
success/error-label tests and lexical initializer control, invoked async arrow,
sentinel arity/default/form-head controls now pass independently in new8.

R03 uses an actual throwing helper call and asserts error class/message while
excluding SyntaxError; the schema TypeError follows the same actual ESM path.
R04 now has live spread form-head and macro-expanded default effects, new raw
fragment failure/recovery and output execution, grouped nested default/rest/
getter/initializer effects and classified key/RHS/metadata checks, and exact
dual-facade namespace observations. Static inspection additionally confirms
named/single/raw transformation boundaries remain unchanged. R05 now explains
bare legacy catch-array consumption separately from ordinary binding elision.
No remaining defect is found in these five specific repairs. Their full final
acceptance is still subject to the original retained tests and final gates.

### R06 — P1, unmarked callable parameter containers reach macro dispatch

The new ordinary-source preparation at `expander-core.js:2228–2230` leaves
ordinary arrows/lax raw functions unmarked. `binding.js:471–473` uses the
structural function region only when isKernel(form); its fallback at482–483
instead returns bodyStart0 for these ordinary callable heads.
`expandChildrenPlan:992–1024` consequently expands their parameter-list
container as an executable form. A newly prepared first `_` is an identity-
bearing atom whose visible name is discardValue__private. `formHead` in
compiler-private-atoms.js:23–26 does not exclude those private atoms, and
`expander-core.js:2106–2144` allows a same-spelling user macro to consume that
structural list.

Fresh public source with
`(macro discardValue__private () \`(captured-one captured-two))` and
`(bind arrow (=> (_) _))` compiles to a TWO-parameter arrow and runs
`2 99`, where required arity is1/body99. The staged browser facade reproduces
the same result. Explicit `(kernel:=> (_) _)` is structurally protected and
runs `1 99`. Actual9e public source runs `1 7`: its old literal `_` semantics
differ, but the unrelated macro does not intercept the parameter list there.
All four compile/runtime pairs exit0 with empty stderr; generated bytes and
streams are retained under `correction02/{bare-arrow-prefix,
browser-bare-arrow-prefix,escaped-arrow-prefix-control,
baseline-bare-arrow-prefix}.*`.

This is a new-S03 private-allocation/structural-role interaction, present in the
initial delivery and still unfixed by correction02, not a new public feature.
Ensure ordinary admitted/lax/fragment callable parameter lists take their real
structural region and only defaults/bodies expand in their proper environments.
Preserve lexical and macro priority at actual source heads. Do not solve this
by granting ordinary bare declarations a sanctioned-kernel capability that
bypasses strict-mode diagnostics, or by treating the private spelling prefix
as authority. Add opposing same-prefix macro/arity/runtime controls for ordinary
and explicit/lax/fragment entrances as applicable. Root owns the bounded repair
recipe and any correction-path adjustment within the original delivery scope.

The independently repeated new8 suite is green8/0 and misses R06. Full66,
aggregate make check/docs, actual M670/14, final citations and fresh size were
deliberately not run on this known-held candidate. No original source gate is
waived, and CC's captured full1578/67steps/docs482/M670 remains attestation at
its original conditions.

### Nine-row disposition and handback

| Row | Correction02 independent disposition |
| --- | --- |
| PB-01 | R01 numeric initializer/typed-child regression repaired and exercised; final retained/gate proof pending. |
| PB-02 | R01/R02/R03 repaired; HOLD R06 callable arity/parameter-role corruption. |
| PB-03 | Catch source unchanged and live-value cases pass; R05 guide corrected, final preservation gates pending. |
| PB-04 | R04 spread/fragment proof substantially repaired; HOLD R06 private-name macro interception. |
| PB-05 | Nested group/representation/effects controls now pass; no observed normalization defect, final gates pending. |
| PB-06 | Shared signature implementation unchanged; direct/early/single-clause controls pass in new8, full final proof pending. |
| PB-07 | Dual facade namespace/raw/schema/JSON proof improved; HOLD R06 ordinary-vs-escaped public boundary. |
| PB-08 | HOLD; fresh new8 only, full acceptance gates remain unrun independently. |
| PB-09 | Open for the consolidated correction and root closing duties; no self-acceptance or later advancement. |

Independently inspected S02's three dated root-attributed accounting errata
against retained raw stderr168–177 and unchanged doctest.rs:685–697. Correct
categories are482 testable/executed doc blocks,15 separate Skip/Fragment
exclusions and nine no-block inputs. Current CC S03 full log uses the same
categories; this is raw-evidence reconciliation, not a new independent full
run. Original statements/receipts remain preserved, with no S02 source/row
acceptance changed. The unrelated JSR reachability self-skip stays separate.

All9 PB rows remain open. No product/test/Git/index/ledger edits were made by
this reviewer. Source is still clean3d21eab5/treeb7788f65; release/0.6.x0829e892
unchanged. All owned commands completed. Exclusive source/build ownership
returns to root for one bounded R06 correction, with all earlier findings,
prompts, candidates and evidence limits preserved.

## Correction03 source-readiness — PASS — 2026-11-14

Same independent Sol6.1 High reviewer read the full correction03 prompt and
v1.2 plan current-assignment/history/version amendments against the inspected
3d21eab5 scope/region/dispatch chain and R06 witnesses. The proposed condition
routes actual resolved raw function/function*/arrow heads into the existing
functionRegionLayout, leaves lambda marked-only, and retains normal source
head priority without granting sanctioned-kernel capability. It directly
addresses the reproduced structural parameter-container failure while preserving
strict bare-function rejection, typed Source lambda and raw compiler APIs.

The exact three-path correction, unchanged14-path complete delivery/eight new
groups/M670, pre-repair semantic red, actual dual-facade arity/result, unmarked
fragment/lax/sentinel/default/timing and priority controls are coherent. Root
added concrete admissible priority examples (lexically bound lambda and a
function-named user macro emitting addition) and reconciled history so03 is
current and02 prior. This avoids invalid reserved binding or self-reexpanding
test fixtures. R01–05 tests and all source/history/independent gate obligations
remain. No consequential readiness ambiguity remains.

**PASS to issue/dispatch correction03 within recorded authority.** No runtime,
build/gate, source edit or Git/index action occurred in this readiness review.
Only this reviewer record was appended. Root retains source/build until CC
dispatch; all9 PB rows and implementation acceptance remain pending.
