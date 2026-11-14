# S04 retrospective — discard-aware declarations

2026-11-14, root CDC/coordinator. Analysis in progress through the preserved
initial918 source-first HOLD and issued correction01; implementation acceptance
and final closing reconciliation remain pending. Luna6 High implements;
separate Sol6.1 High owns [independent verification](cdc-verification.md).
This is analysis of the work, including my own preparation, not independent
evidence that our process is effective.

## Intended result and inspection limits

The useful delivery is native-generated TypeScript declarations describing
real discarded/default/rest/destructured parameters and module exports, consumed
by actual TypeScript clients and delivered by file and package compilation.
It is a prerequisite for binding/qualified-library work, not a library release.
Release integration atc60 was separately independently accepted before S04.

I inspected the source pins/deltas and producer/consumer sections used in the
plan, issued prompts, doer intake/close, retained semantic red and selected
failed/final receipts, independent HOLD and correction01 readiness. The
reviewer read the complete new CLI suite and emitter delta. Doer aggregate
green results at918 are attested, not independently reproduced at this cutoff.
Some interim test-source versions were not snapshotted; retained terminal
streams do not reconstruct those bytes. No controlled model/process comparison
or elapsed-effort measurement was undertaken.

## Observations and interpretation

- The real baseline red isolates compiler-produced duplicate `_` parameter
  labels: a valid local type-only import/typeof/declared callable client,
  explicit strict/exactOptionalPropertyTypes/skipLibCheck:false settings, and
  exactly two TS2300 diagnostics. The first invalid consumer instead produced
  TS1361 by trying to call a type-only binding. That mistake recurred in later
  clients until the namespace/typeof/value pattern was applied consistently.
  Root should have supplied a complete client example earlier, rather than
  assuming the checker settings alone specified a valid oracle.
- Initial fixtures confused Func typed-pattern grammar with ordinary Bind
  patterns, used reserved names `private` and `public`, and guessed re-export
  spelling. Root first caught only one reserved name. Legal string data aliases
  preserve the intended public/private projection opposition without pretending
  those words are ordinary bindings. These were authoring mistakes, not
  evidence of requested new language semantics.
- Initial authoring and readiness missed that default/re-export/kernel escapes
  reach KernelPassthrough rather than the nominal Export variant. Source-based
  correction before issue made the empty-module marker conservative. Trace the
  actual classified representation, not only similarly named enum variants.
- Existing CLI method prevalidation rejected an ordinary required parameter
  after a destructured parameter before declaration generation. Source tracing
  attributed it to recursive call validation on the parameter-list container,
  not the reader or DTS renderer. Admitted named defaults still reserve the
  same Simple parameter names, so they provide the source collision witness;
  the required-after arrangement remains separately covered at low-level
  ParamShape construction only. This explicit composition avoids silently
  claiming the rejected Source spelling succeeded. The real release-worktree
  witness and D-2611-MPVR/Arc02 unopened candidate retain the repair owner.
- Root noticed missing constructor input/runtime TypeError, declaration byte
  equality, bare tuple skip and true foreign-discard controls before final gates.
  Sol caught that a slot2 collision claim still had `_value` at slot2. These
  checks improved the opposing values and real consumers, but also show that
  a long assertion list is insufficient without checking the actual input roles.
- Sol's complete source review held green918 for two promised paths with no
  real input: positive inline/named BindGroups and recursive parameter shapes.
  Empty-group tests could pass even if both positive group renderers dropped
  all declarations; one-level shapes did not traverse nested conversion. Root
  and initial readiness missed those gaps. Correction01 extends the existing
  four-group protocol instead of adding a separate harness or changing the
  scope. No emitter defect was established by that HOLD.
- Correction01 readiness caught my own incorrect assumption that an object
  alias key `items` also becomes a local variable. Complete typed lowering and
  emit_alias_pattern show that it is a property key mapped to a nested pattern;
  only its leaves bind. The corrected runtime function returns leaf values and
  the caller observes input lengths. A bound_names alias overapproximation is
  a watch for a later binder census, not a diagnosed behavioral defect here.
- Intake was again first written under the source checkout. Root's initial
  relative artifact instruction remained ambiguous despite the S03 lesson.
  CC relocated bytes under exclusive ownership; later root moved the misplaced
  closing report after a clean/no-jobs handback and appended a location notice.
  Correction01 names canonical absolute intake/close paths. Preserved reports
  and location notices distinguish provenance from current authority.
- Clippy redundant-guard and formatting failures remained distinct from semantic
  failures and the successful final gate. Actual M6 configuration is not the
  strict local TypeScript consumer configuration. The optimized release witness
  and default/debug task compiler are likewise distinct. Root corrected an
  initial release-profile attribution without an unnecessary replay solely for
  wording. Keep denominator, skip, cache, warning and profile claims precise.
- Correction01 again separated required coauthors into paragraphs, repeating a
  mistake already repaired in S03. CC noticed before independent review and
  proposed a source-comment follow-up. Root stopped that route because it would
  not fix the first commit and would add unnecessary product churn. After clean
  handback, root preserved both raw objects and recreated only the unreviewed
  message with identical tree/parent/identities/dates and adjacent trailers;
  [metadata receipts](artifacts/root-metadata01/README.md) retain original8ed
  and replacementc0ed. Prior tests stay attributed to8ed; final-HEAD metadata
  gates are recaptured and Sol verifies the repair. Existing adjacent-trailer
  instructions alone did not prevent recurrence. Future prompt authors should
  supply a complete message-file example and inspect raw commit text before
  handoff, without inferring model intent or running tests for message changes.
- Full correction01 make check passed without the optional M6 receipt variable.
  One focused existing M6 test was therefore rerun to capture the required inner
  command/config/status/70-test/14-comparison proof. The missing capture is not a
  product failure; it is avoidable validation setup work. Set all required
  capture variables before the full gate rather than manufacture proof from
  the outer Cargo result. A reported41 harness rows was corrected to the actual
 40; this did not change the1786 passing-test total or require another run.

## Follow-through and recommendations

The [S03 recommendations](../slice03-public-binding-discards/cdc-retrospective.md)
were partly applied: source-first review preceded independent aggregate runs,
real foreign values/namespace keys/error classes were used, and ownership was
serialized. The explicit absolute artifact paths were not applied soon enough,
and producer mapping still missed grouped and recursive entrances. Retain the
recommendations, with a concrete completion check: for each materially changed
producer, identify the actual input node/role, consumed artifact and plausible
wrong implementation rejected by the test before expensive gates. Root owns
that check in subsequent preparation; reviewer independently challenges it.

For TypeScript declaration work, supply one complete generated-sidecar client
and contrasting unguarded error, then apply that pattern to every added callable.
Read actual lowering before turning syntax names into runtime observations.
These are local recommendations, not measured cures or new framework policy.
At the next relevant close, check whether invalid clients, wrong producer inputs
or path relocations recur; do not infer success merely from fewer refinements.

Preserve the useful source-first HOLD and immutable numbered correction rather
than treating green counts as complete scope coverage. One consolidated
correction01 spends1/5 review refinements; the earlier local failed authoring
conditions are preserved separately, not silently relabelled or erased. The
same implementer/reviewer contexts continue within the user-selected models.

## Final outcome and reconciliation

Pending correction01 implementation, independent final-source validation and
root row/bubble-up reconciliation. All eight DT rows and BS-04 remain open at
this analysis cutoff. No S05, further merge, push, publication, qualified/library
trial, book/human acceptance or licence decision is authorized by this record.
