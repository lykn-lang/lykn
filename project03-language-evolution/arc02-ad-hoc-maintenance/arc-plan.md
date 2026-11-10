---
project: project03-language-evolution
arc: arc02-ad-hoc-maintenance
status: in-progress
planned-release: unassigned
depends-on: []
related: [arc01-compiler-semantic-integrity]
---

# Ad hoc maintenance

## Browser compiler split for 0.6.x

The Operator added two compatibility-preserving compiler refactors before
0.6.0 publication. Plan S04 to separate the Deno macro loader from the
browser compiler, then S05 to separate the private ESTree invocation
bridge. AM-06 and AM-07 track the two deliveries. The
[split plan](artifacts/browser-compiler-split-plan.md) defines their
design, measurements, and release composition checks. Open each
implementation slice from its actual accepted baseline.

The local release policy change `b0c97f4e` sets the 80 KiB hard
cap for the full gzip output. The fixed DD-37 historical delta
remains visible. S03's old ceiling and failure remain historical
evidence.

The explicit [bounded Arc03 source re-entry](../arc03-protected-host-intrinsics/slice01-versioned-host-protection/cdc-verification.md#original-pre-policy-baseline-independently-reproduced)
is independently accepted at `5a2e569`. With the earlier six MR rows,
this fulfills AM-04. Arc03 v1 and typed dist wiring keep their own gates.

S02's compiler-owned macro dependency repair is independently accepted at
`f2cd8139`, with all six MR rows done. [Acceptance](slice02-embedded-macro-dependency-resolution/cdc-verification.md).
AM-04's separate Arc03 re-entry was pending at that source acceptance.

Iteration02 repaired the test ownership issue and captured the old macro
failures. Candidate `7777cd71` stopped before validation on a platform-specific
test default. [Review and re-entry](slice02-embedded-macro-dependency-resolution/cdc-verification.md).
AM-04 stays open and the Arc03 dependency is still held.

## S02 source readiness stopped — 2026-11-08

The tests-only freeze d7c7c733 stopped before the first build on two borrowed
temporary command builders. [Review and re-entry](slice02-embedded-macro-dependency-resolution/cdc-verification.md).
All six MR rows and AM-04 remain open, no compiler change or trial. Source
refinements 0/5; the bounded test correction requires renewed approval.
Existing scope and future Arc03 composition dependency are unchanged.

## S02 implementation approved — 2026-11-08

Operator approves reviewed c209462 repair for finite S02 implementation and
independent close, [source prompt](slice02-embedded-macro-dependency-resolution/cc-prompt-iteration01.md).
Same Luna6 High CC/Sol6.1 High CDC/Autonomous; source0/5, STOP any substantive
failure/real gap. No other maintenance intake, Arc03 candidate composition,
release mutation or next unit. All6MR/AM-04 remain open until actual gates.

## Reviewed S02 design endpoint — 2026-11-08

Fresh Luna6 High read-only review at planning6003 completed; CDC Sol6.1 High
disposition incorporates macro-trigger, cache-proof, count, docs and mtime
clarifications in [actual review](slice02-embedded-macro-dependency-resolution/artifacts/design-review.md).
Design is ready for Operator assessment, no source/runtime/repair acceptance.
All6MR/AM-04 remain open; execution and candidate composition still held.
Earlier November7 S02 return references below mean Arc01's Result slice, not
this new maintenance S02. Original acceptance/history is not reinterpreted.

## New S02 design intake — 2026-11-08

Operator authorizes DESIGN ONLY of existing compiler dependency resolution and
native v1-oracle re-entry after Arc03 S01's observed W8 stop. Proposed useful
[S02](slice02-embedded-macro-dependency-resolution/slice-plan.md) owns generic
native evaluator config/lock/materialization plus real macro controls. Arc03
retains its v1-oracle correction/dist classifier wiring and source01/5. Fresh
Luna6 High read-only contribution, Sol6.1 High CDC final design judgment; no
source/build/probe/branch/merge/dependency acquisition or execution prompt.
Earlier S01 acceptance/return and all prior budgets remain. AM-04 below is a
new capability obligation, not acceptance by planning or a miscellaneous sweep.

## Explicit return decision — 2026-11-07

After accepted finite S01 baseline, Operator answered “yes please!” to S02
continuation. The bounded return dependency is satisfied; Arc01 owns Result code.
No further maintenance intake or implementation is authorized by that answer.
AM-03 remains open for any later arc composition/intake close, not a S02 blocker.

## First slice accepted; intake remains available — 2026-11-07

S01 independently closes five MH rows atc129 as a trustworthy local harness and
baseline, NOT all-green product. Both runs101/1pass2fail; predicates10/10; four
invalid observations and runtime3/4matches. Unexpected package obj failure is
concretely owned by existing S02 resolver/fatal-fallback scope. No source retry or
production repair followed. AM-01/02 done; AM-03 remains open for explicit return
disposition/intake composition. S02 continuation stays Operator-gated and does
not depend on indefinite future miscellany. Correction01 spent, no reset.

## S01 execution authorized — 2026-11-07

Operator “perfect, let's tackle that one now!” opens only the finite first
maintenance slice. Its source-ready prompt governs fresh Luna6 High CC and
separate Sol6.1 High CDC, inherited correction01/5 and first unexpected
substantive-failure stop (known old-product red expected). Planning-only history
below remains intact. S02/future miscellany/integration remain held.

## Authority and useful result

2026-11-07: the Operator requested pausing Arc01 S02, creating an ad hoc arc for miscellany, and planning one or more slices to address the harness issues before returning. **This authorization is planning only.** No source edits, test/build execution, CC dispatch, dependency acquisition, release integration or S02 continuation is authorized now.

The first useful result is a trustworthy local emission-regression test and independently reproduced **old-compiler baseline**, including its expected product-red outcomes. Evidence currently proves defects in one newly authored test, not a broken repository-wide test infrastructure. Preserve that distinction; do not commission a broad audit or replace the general harness without a source-grounded need and further approval.

The Operator explicitly requested this collection arc. Only the first finite item is detailed; the arc is not an unlimited maintenance assignment or a sweep of old findings. Later intake needs a named owner, useful scope, source home, dependencies, acceptance and execution authority. Keeping intake available does not make indefinite arc completion a prerequisite to returning to S02.

## Roadmap and ownership

| Unit | Useful deliverable | Dependencies and owner |
| --- | --- | --- |
| [S01 — Emission harness and old-compiler baseline](slice01-emission-harness-baseline/slice-plan.md) | Correct the local test's real paths, optional-DTS and runtime/error predicates; establish discriminating harness checks and complete honest baseline observations with independent review | Frozen test-only2321943 and Arc01 S02 review; CDC Sol6.1 High designs/reviews, future CC Luna6 High implements only after Operator execution approval |
| [S02 — Embedded macro dependency resolution](slice02-embedded-macro-dependency-resolution/slice-plan.md) | Native compiler-owned config/lock, unchanged documented Lykn macro resolver tiers, cold/warm/alias/runtime/error proof | Independently accepted at f2cd8139, with explicit Arc03 re-entry pending |
| Future individually scoped miscellany | Not yet assigned or authorized | CDC records a concrete proposed item and its acceptance before opening another slice; no inherited implementation authority |

No investigation/repair/review slices split this first result by process stage. It is one branch-sized test delivery with its verification. No executable CC prompt is issued now; complete that open-set member only when execution is approved. Future implementation uses the established two-contributor arrangement, normal exact-path commits and separate `cdc-verification.md`; no fabricated plan-review or implementation-acceptance artifact is created at planning time.

## Inputs, limits and return

- Planning home: `.worktrees/planning`, branch `planning`. Source remains untouched at `codex/checked-emission-results@23219431e6d154a4e046bfd375a01dc8bfb3929d` in `.worktrees/contract-predicate-lowering`. Release and preserved accepted task ref remain8f5d199; no API implementation exists.
- The [S02 independent stop](../arc01-compiler-semantic-integrity/slice02-checked-emission-results/cdc-verification.md) is the finding/evidence authority. Its first failed initial attempt and missing original no-run streams/post-build pin remain history. No retroactive reconstruction.
- This move does **not** grant a fresh correction allowance: one failed initial S02 attempt, zero numbered refinements executed; proposed maintenance correction is the next refinement01 under that inherited five-refinement ceiling. The first-substantive-failure stop remains pending execution-specific continuation. Eight spent older tooling passes/K0/13 unchanged.
- Accepted S01 proves the test and baseline, not Result APIs or product success. Meaningful expected reds are retained, never ignored/filtered/declared green. Full normal green source gates remain Arc01 S02's implementation obligation.
- Return depends on accepted **this bounded first slice**, not closure of all future miscellany. CDC then proposes explicit S02 continuation with its approved Result design, original CE rows/history and remaining allowance. No automatic implementation, integration or next-unit advance follows maintenance planning or future baseline acceptance.

All original F1–F12, Project07/library/book/guide/human/licensing and other compiler/type/doc owners remain unchanged. No compiler fix, helper/K/walker/corpus/F6 run or publication is part of this arc's current item.

## Version history

- 2026-11-10 v0.6: Planned the two pre-release browser compiler
  splits in measured order and recorded the approved absolute cap.

- 2026-11-10 v0.5: S03 independently reproduces the fixed DD-37 regression. AM-05 owns the outstanding product budget decision.

- 2026-11-08 v0.4: New bounded S02 DESIGN intake after Arc03 W8; generic repair
  home distinct from Arc03 policy/oracles, original accepted S01 not reopened.
- 2026-11-07 v0.3: First finite slice independently accepted as faithful c129
  baseline, with product-red/unexpected package witness preserved and S02-owned;
  no all-green claim or automatic return. Later intake/return composition open.

- 2026-11-07 v0.2: Operator authorized finite S01 execution, inherited correction01,
  fresh Luna6 High CC/separate Sol6.1 High CDC; S02/later work still held.

- 2026-11-07 v0.1: Operator-requested planning-only maintenance home and one finite local-test/baseline slice; preserved S02 pause, expected product reds, history and shared correction allowance.

2026-11-10 [CLI test portability and isolation](artifacts/hosted-ci-test-isolation-2026-11-10.md)
is independently accepted on the clean I3 task composition. It adds
two test-only changes and leaves the browser DD-37 size issue open.

2026-11-10 [S03 — DD-37 browser compiler](slice03-dd37-browser-bundle/slice-plan.md)
reproduced the exact fixed-source budget failure and measured
the two source-graph cuts. At the CI pin on this platform the
whole browser compiler is 11,818 bytes over. Both experimental
cuts together left 7,875 bytes over the S03 ceiling. AM-05 owns the
remaining product work under the approved release policy above.
[S03 verification](slice03-dd37-browser-bundle/cdc-verification.md).

2026-11-10 [S04](slice04-browser-macro-loader-split/cdc-verification.md)
accepted at `cc806c84`. AM-06 closes with 2,623 bytes of measured
gzip savings and the existing browser, staged ESM and native
contracts. S05 starts on this exact task source.

2026-11-10 [S05](slice05-browser-estree-bridge-split/cdc-verification.md)
accepted on the composed task at `685bbe1d`. AM-07 closes after
real browser, Deno, native and optimizer reproduction. The browser
is 41,338 gzip bytes, a 3,506-byte saving across S04 and S05.
AM-05 retains the release integration and verification gate.
