# Independent S10 verification

2026-11-14, separate Sol CDC. **SOURCE-PROOF PASS** at
`a170be580888198ec7da1a99c4731a1d177157a1`, tree
`818f02478bc1667254f48899aca3d230a4e3b697`, branch
`codex/qualified-adt-core`, source worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Independent runtime/gate reproduction is **pending** explicit exclusive
source/build handoff. Root TK-06 retrospective/parent reconciliation and final
metadata acceptance are also pending. This is not slice closure.

## Review scope and evidence level

I reviewed the immutable candidate diff from accepted input
`a44e16db96ca4ae76de124b555c34ffe2c2779ba`, the complete committed
source_names.rs and generated_name_hygiene.rs, and the complete changed guide
section. I checked the issued prompt at planning dispatch `542806f0`, the six
TK criteria, retained readiness finding/resolution, baseline sources/generated
bytes/streams, and CC execution record and focused successful result records.
The candidate changes exactly the three assigned paths and carries both
contiguous coauthor trailers. Source status was clean on inspection.

The baseline root receipts and CC test streams are inspected evidence, not
fresh execution by this reviewer. During this phase Luna retains mutable
source/build ownership. I ran no compiler, import, probe, build, test, or Git
mutation, and authored no implementation. The only new write is this assigned
S10 verification record.

## Source and proof findings

No blocking implementation or proof-design defect found.

The production census now reserves all four actual Surface threading variants
by their tagged roles: Bare keyword text goes through existing `text`, other
Bare expressions recurse ordinarily, and Call slices reserve keyword heads
while arguments recurse ordinarily. Raw lists recognize exactly the four
assigned heads; their initial expressions remain ordinary and their subsequent
steps receive raw keyword/List/ordinary handling. Empty lists/calls remain
safe, generic Cons/list recursion remains, and no source clone, parser round
trip, allocator/state change, public API or new decoder is introduced.

The original preissue tagged-Bare issue is resolved in actual committed code.
A Bare containing a genuine raw thread reaches normal raw-head recognition;
a Bare containing ordinary keyword-headed data does not gain a Call role.
The matched inline positive and negative make that distinction inspectable.
The source census still feeds `EmitterGensym::reserve` and its existing physical
mapping, so decoded Unicode identifiers and computed identifier runs share
the same occupancy machinery as existing atom occurrences.

The reservation remains in the owning-input pass before any lowering. Unit
and public fragment entrances, nested expression classification, helper
allocation and actual method writing are unchanged from a44. Consequently the
new raw walk reaches a nested keyword before an enclosing checked function
allocates its result helper, as well as before a null-safe thread allocates t.
This is conservative occupancy, not lexical binding resolution or admission
of a new member grammar.

Seven inline tests have meaningful independent oracles: each of four Surface
variants with Bare/Call keyword role; all four raw heads under an ordinary
container; tagged-Bare nested-thread/data distinction; ordinary keyword/string,
initial and argument exclusions; physical escaped alias; actual public
emit_form binding/read separation and post-lowering counter; and existing
ordinary Cons atom traversal. Their census fixtures use fresh allocators.
The negative roles are isolated from a positive collision that could mask
over-reservation. The fragment assertion correctly expects t1 in emitted
binding, unchanged t0 in foreign member text, and t2 as the next allocation.

The six CLI tests retain the original two tests and add four bounded tests.
The principal loop constructs32 distinct fresh compiler processes/temporary
projects: four heads × two keyword roles × two extensions × two assertion
modes. Its source sets the foreign index via a string key, avoiding an ordinary
atom occurrence that would mask a missed keyword. Callable array children
return7. Generated spelling assertions check unchanged computed references
and absence of the conflicting binding; checked plain threads oppose the
enclosing result0, null-safe threads oppose t0, and stripped plain threads
correctly do not demand a checked-only helper. Exact runtime output, exit and
stderr are asserted in every principal cell.

The escaped keyword fixture requires the original backslash-u spelling to
survive in generated code, t1 to replace the conflicting generated binding,
and runtime7. This correctly distinguishes occupancy-key decoding from output
rewriting. The real kernel-JSON test consumes actual native serialization via
packages/lang/compiler.js, checks binding/read separation in that compiler's
generated output, then executes it; no hand-authored replacement AST/codegen
substitutes for that boundary. Existing private/package exports and DTS
consumers remain unchanged.

The new ordinary-atom bind/log fixture is a live-read smoke check by itself.
The stronger retained ordinary-atom collision control is in the unchanged
actual_lykn_lyk_check_compile_strip_and_kernel_json_compiler_consumer test:
global t0=99 and box[99]=5 versus box[7]=100 oppose a some-thread helper
capturing `box[t__gensym0]`; the expected third result12 rejects capture.
That retained test exercises both extensions, both assertion modes and actual
kernel-JSON consumers. No duplicate new collision matrix is needed.

Preservation controls assert null output and argument-effect count0 with a
static child member, -93 versus93 for thread-first/thread-last noncommutative
order, and exact receiver,argument trace with result3 for once-only keyword
call evaluation. They do not claim a separately instrumented computed-selector
side effect. Existing lowering code is untouched. The guide explains keyword
roles, data exclusions, raw/tag boundaries and occupancy limits without
promising exact source-binding or general macro hygiene.

CC retained the initial fragment-counter oracle failure and escaped-output
assertion failure separately. Their corrections follow actual allocation and
preserved spelling, rather than weakening the semantic runtime oracle. CC
successful streams show7 census tests and6 CLI tests, including all32 principal
runtime records and the real JSON result. Those observations remain CC-run
until independent reproduction.

## TK disposition at source-proof checkpoint

| Row | Independent assessment now | Remaining acceptance work |
| --- | --- | --- |
| TK-01 | Baseline source/generated capture and intended7 inspected and causally coherent | Root receipts remain original executed baseline evidence; no historical verdict rewrite |
| TK-02 | SOURCE-PROOF PASS: role census, tagged boundaries, physical mapping and timing match contract | Fresh focused execution after handoff |
| TK-03 | SOURCE-PROOF PASS: concrete32-cell consumers and controls have meaningful oracles | Independently execute focused CLI tests and inspect actual values |
| TK-04 | SOURCE-PROOF PASS: fragment/public JSON/private-package proof retained | Fresh fragment/CLI and full M6 artifacts/all15 comparisons |
| TK-05 | Exact three-path committed scope/trailers/clean source verified | Fresh focused/full/citation/size gates and final clean pin |
| TK-06 | Readiness history and initial failures preserved; no silent scope expansion | CC final close/inventory, root retrospective/parent routing and independent closing-metadata review |

All ledger rows remain open at this checkpoint. No formal correction is
requested; no release integration, S07 opening, external action or broader
investigation follows from this source-proof result.

## Authoritative independent runtime and delivery verdict

After explicit exclusive source/build handoff from root, I independently
validated unchanged clean `a170be580888198ec7da1a99c4731a1d177157a1` /
`818f02478bc1667254f48899aca3d230a4e3b697`. **TK-01–05 PASS. TK-06 remains
OPEN for root closing metadata and separate final metadata review.** No formal
implementation correction is requested.

Complete exact environment/command/status/session records, actual denominator
derivation, M6 values and artifact inventory are in
[independent execution](artifacts/cdc/execution.md). Fresh release/package
artifacts preceded all candidate stage consumers. Focused source tests7/7 and
CLI tests6/6 passed; all32 principal runtime cells actually returned exit0,
exact7 and empty stderr. The real kernel-JSON→public-compiler consumer and
escaped alias/private/package/null/order/effect controls passed.

Exactly one independent full `make check` completed exit0, with docs once.
Actual42 Rust result records sum1809 passed/0 failed (including lykn-lang1224),
Source/JS corpus1586 passed in67 steps/0 failed, docs482 passed/0 failed with
15 skipped and nine no-block notices. Actual M6 strict child reports78 passed
on the prescribed eight paths, status0; all15 named comparison receipts have
both equalities true with lengths individually inspected and retained.
Final committed-HEAD citation check passes64 documents/601 historical census
citations. Fresh gzip50162 is within unchanged81920 budget, baseline27630 and
delta+22532. Existing JSR-unreachable conditional and astring export warnings
remain visible; none becomes cold-network or registry-availability evidence.
Fresh owned XDG materialization used explicit warm DENO_DIR and does not prove
same-version warm-cache invalidation.

I also freshly executed both archived actual root-generated baseline modules
with offline Deno flags: expected TypeError and ReferenceError, each exit1.
This confirms their actual failing runtime behavior; it is not a freshly
recompiled old CLI. Immutable old-source inspection plus root's original a44
build/compile receipts establish baseline provenance. Historical S05/S06
verdicts retain their exact original scopes and revisions.

| Row | Final independent disposition | Evidence / boundary |
| --- | --- | --- |
| TK-01 | PASS | Original immutable root source/generated receipts inspected; archived actual generated bytes independently execute to the two expected capture failures |
| TK-02 | PASS | Immutable source-proof plus fresh7 census/fragment tests; roles, tagged boundary, negatives, physical alias and preallocation timing retained |
| TK-03 | PASS | Fresh6 CLI tests including all32 actual collision cells and semantic/Unicode/order/null/effect/JSON controls |
| TK-04 | PASS | Actual public fragment/whole-unit and retained private/package consumers; fresh M6 eight paths/78 cases/all15 true byte comparisons |
| TK-05 | PASS | Exact three committed paths/adjacent trailers/clean pin; fresh focused/full/citation/size gates, no weakened gate or source edit |
| TK-06 | OPEN | CC close/inventory and failures inspected; root retrospective/BS-10/parent/API/research reconciliation and final metadata review still required |

Only the canonical verification record and artifacts/cdc were written during
review/validation. Source remains clean at the same immutable commit/tree;
all owned tool sessions are terminal (no system-wide process-list assertion).
Source/build ownership returns to root. S10 is not fully closed until TK-06
is independently disposed; no S07 opening, release integration or remote action
is authorized by this verdict.
