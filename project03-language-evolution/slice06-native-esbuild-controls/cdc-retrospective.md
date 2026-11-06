# Slice06 retrospective — native tool delivered, controls stopped

2026-11-05, CDC Sol 6.1 High. Reviewed CC Luna 6 High work through 6ccfd9e,
initial/iteration01 prompts, source corrections, complete observer and stimuli,
results/closeout and raw failed/successful attempt records. Independently rebuilt
native esbuild and replayed the same source/gate/first-runtime sequence; the
[verification](cdc-verification.md#final-independent-review--2026-11-05) owns
acceptance. This record studies our method, not compiler root cause or model
effectiveness. No comparative exposure, time or token measurements were collected.

The useful delivered increment is a reusable native esbuild 0.25.5 built from
pinned upstream Go inputs without Node/npm, independently matching its binary
hash, plus actual retained-code attribution for one tiny C4 bundle. The full
five-control result was not delivered: first C5 failed parsing generated JS;
four bundles and ten of eleven runtimes remain unrun. The user-required stop
prevented either an unauthorized compiler patch or a source escape that would
hide the failing documented precondition. NE-C01 is routed to the existing
Project03 backlog with an explicit owner and re-entry.

What helped was separation of acquisition from offline build, immutable source
and module sums, explicit binary paths and private reviewer caches. The native
metafile exposed a genuine distinction: dead.js was resolved but not retained.
Reading the complete tiny bundle alongside original bodies established more
than a name grep or byte-size difference could. C4's separate gate phase let us
inspect this before dependent runtimes. The positive C5 was deliberately shared
across all nine public paths; when it failed we kept its denominator rather
than claiming public availability from export-map shape alone.

Authoring and review were substantially less smooth. The source history retains
an accidental LF in exact data, four observer delimiter failures, nonexistent
static String/Array APIs, missing actual metadata/hash predicates, duplicated
C5 receipt labels and root imports that really exercised subpaths. The first
CDC review caught those defects before runtime; source repairs stayed with CC.
The iteration included a functional cell/receiver example, explicit schema and
path/contribution predicates, unique labels and graph/output boundary warnings.
These were substantive fixes to already specified acceptance, not new controls.

Later emitted-code review found an expression-position no-else catch becoming
a COMPILE_ERROR sentinel, a strict-reserved package binding, and await inside
a synchronous conditional IIFE. Native check/compile/lint success did not prove
the observer was executable: two Deno launch attempts failed before evaluation.
Atomic createNew writes, pkg bindings and explicit async phase functions let
the existing observer reach C4. This is evidence about these concrete shapes;
it does not establish a general compiler fault population or a model limitation.
The no-else source was contrary to DD-50; its accepted emitted sentinel is a
separate diagnostic-coverage question. The final documented equality/:pre
mismatch has its own exact source/generated/runtime witness and was not repaired.

CDC's preparation and review contributed to the rework. The initial packet
described Deno.Command/outputSync/digest mechanics but did not supply the exact
already-reviewed supervisor pointer until CC asked. It did not demonstrate a
complete executable phase layout. The source review identified real contracts
but initially did not inspect every generated observer region, so reserved-name
and async-IIFE failures surfaced later. The roughly 950-line observer was large relative
to five tiny stimuli, even though it implemented required finite predicates.
It would be misleading to attribute all failed attempts to unread guidance or
to treat more detailed paperwork as proof of better preparation. Guide reading
and exact checks were observed; their faithful application still required review.

For the next relevant assignment, CDC should supply the exact consumed API
example and a small verified async-phase layout, then inspect generated observer
code before dependent execution. Prefer straightforward finite helpers; do not
respond by inventing a general supervisor or new checker framework. This is a
prompt/review recommendation for the next authorized scope, not a policy change
or permission to alter the frozen current stimuli. A later clean implementation
with the same quality gates would support its usefulness; repeated failures or
increased preparation cost without earlier detection would count against it.

Follow-through on Slice04/05: concrete cases/oracles and stable section names
were used up front, unchanged baseline reads were reused, and no new receipt-only
correction loop was required. That narrower improvement did not prevent the
substantive authoring/emission issues above. Source/build and review effort were
visible in the preserved attempts; framework/intake versus useful work cannot
be given a defensible percentage without measurements. Source fixes, observer
repairs and raw evidence preservation consumed appreciable attention; this
qualitative observation is not a timing estimate or an effectiveness trend.

The reusable native binary now has an actual method consumer (C4), so its value
is demonstrated within this pilot. The larger audit, JSON/YAML implementation,
Project07 final synthesis, authoring/book/human and licence/bootstrap gates
remain owed. Stop here; a separate authorized compiler follow-up is the next
decision, not an automatic expansion of this slice.
