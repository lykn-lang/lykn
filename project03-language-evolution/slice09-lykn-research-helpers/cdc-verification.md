# CDC verification — Slice09

Reviewer `/root/cdc`, Operator-selected OpenAI Sol 6.1 High, independent of
CC `/root/cdc/helpers_cc` (OpenAI Luna 6 High). Reviewed candidate planning
7cd6ca966f14ab65646a3392087f1906724e3f5f on 2026-11-06.

## Functional parity and fixed controls accepted

I read all four complete Lykn sources and all 712 lines of their fresh native
JavaScript output, plus the complete intake/attempt/results record. From a new
owned task `target/slice09/cdc-review-20261106/` cwd with explicit empty config
SHA79eb6349, I independently ran check, fmt-check, lint and strict compile for
each source using the ABSOLUTE task target/release/lykn, SHA544041ec. All four
gate chains exited 0. Native check reports 7/16/31/5 top-level forms. Lint has
zero findings; actual compiler warnings remain, with real uses visible in code.
The four outputs byte-compare equal to CC's final frozen products:

| Output | SHA-256 |
| --- | --- |
| public-check.js | 161036f7c7c14d790f63e9d9b05cd5fc3148441a169bb421f0b13064e922ae24 |
| orchestrate.js | 76ee6715db0b98b262a0b11abb7eb1a0338640cd93244387c6b10ef132a3a621 |
| check-helpers.js | 30ff4d62639584243987819b2340b0eaad67201e82ed8068f601f8154577a768 |
| child-fixture.js | 8a7aa205172c05aad758081b1869b17c9b78a946f27ba5fa90f252c06593b6be |

Own single complete check-driver invocation exited 0, empty stderr, under exact
Deno2.9.6 SHA2ad84f9 with cached-only/no-npm/no-remote/deny-net/no-prompt,
task-target/accepted-workspace read and owned review write grants, and exact
Deno/compiler run grants. Its seven arguments were own new `cases` path,
unchanged Slice08 accepted workspace, own public-check/orchestrate/child JS,
absolute pinned compiler, and staged child Lykn. No Python was invoked by CDC.
Raw gates, warnings, suite output, case stdio/status and action manifests/
attempts/results are retained in `artifacts/evidence/cdc-review/`. Routine
executables/caches/cloned workspaces remain ignored; retained code snapshots
in evidence are explicitly review witnesses, not authored JS tooling.

| Cases | Independently established observation |
| --- | --- |
| V0 | Exit0, exact nine exports/13 hashes. Own stdout equals saved single Python oracle AND immutable Slice08 original stdout, SHA c30a0ead3be94937397eca741072b1cec799af0ee5c0d96d0cdc8d96c21fa92c |
| V1 | Both map property orders changed and still pass; native diff shows only actual dist/json/deno.json checksum changes, all other output equal |
| V2/V3/V4 | Source-only missing key / dist-only wrong target / extra dist key fail for the actual expected map diagnostic, rather than unrelated errors |
| V5 | Missing target fails with NotFound and actual json/value.js path |
| V6 | Valid content mutation still succeeds; native diff shows only effects/effect.js checksum changes |
| V7 | Space-path unchanged clone is byte-identical to V0 |
| R0 | Real pinned compiler action000 in spaced cwd succeeds, Deno action001 preserves spaced/literal shell text arguments without a shell, copy002 preserves three bytes, compare003 true |
| R1 | Raw stdout00ff0a/stderr01fe0a, child and outer7; actual receipt001 and marker absent |
| R2 | Equal-length unequal bytes record false and exit1; next action/marker absent |
| R3 | Copy rejects existing destination; actual040506 preserved; next action/marker absent |

The original program's one execution is CC-attested with actual saved stdout/
stderr; I independently reconciled those bytes with new Lykn execution and
the immutable prior baseline. I did not claim independent Python re-execution.
This establishes the assigned positive parity, not exact negative Python
diagnostic parity or arbitrary historical orchestration-program equivalence.

## Inventory, policy and evidence limits

The two original Slice08 body files and their owned ignored duplicates retain
their original hashes pending cleanup. Broader recent-lineage inspection found
one additional retained program: Slice07 raw staging commands-reconciliation.txt
contains the dist-only nine-map validator here-doc (SHA1477a1d9, blob5881e780).
Its exact 13-line saved positive log matches own V0's first13 lines under native
cmp; new structural-map checks cover its needed role plus additional checks.
No second Python execution was needed. It has no ignored duplicate in current
task target/slice07. Cleanup therefore covers five existing program-body files,
not merely the four originally inventoried. Other historical scripts, notably
Slice03's catalog, remain outside this requested recent-helper migration.

I independently reproduced six AGENTS-only source deltas and raw contiguous
trailers, seven common AGENTS blob1f6f987/SHA1b5d78b96a4ef888153696e8e6656029ee24bc00be602ad5568e40265398c73d,
mode100644, and all relative CLAUDE targets/mode120000. Source tips:
main6ed2c587, release0.6 ae512230, release0.7 e693bf98, release0.8 c733f7ab,
native task3b12e2c, template taskbc83b43. Each source tree was clean. I reran all
six citation gates: exit0, main62/others63 documents, unchanged601 historical
citations. Source policy is accepted; product code is unchanged by this slice.

Failures are not erased: first helper body was lost before snapshotting; earlier
unattributed CLI calls remain unverified; latest initial calls demonstrably used
wrong globalc02, not accepted544041ec. The alleged current-compiler statement
blocker was disproved by the committed independent pinned recheck. One early
standalone child ran before source freeze and is not R1 proof. First frozen
suite reached V1's subject, then failed observer SHA lookup; V1 acceptance was
unestablished, rather than its subject being literally unrun. Next attempt's V5
subject correctly failed, but its observer demanded an invented message. The
third attempt passed V0–V7 then failed R0 preparation permissions before an
orchestrator action. Corrected final attempt and own replay both pass. The
stale compile5 hash claim was corrected before execution. These limits remain
in results; success does not backfill provenance or missing original evidence.

The real accepted-tool explicit-final-return malformed-output pair and actual
unused-binding warnings remain owned follow-ups, not repairs in this slice.
The invalid quoted-string dissoc call was an authoring error, not absent builtin.

## Remaining cleanup / review findings

Functional helper behavior and fixed controls are accepted. README still gives
compiler commands from repository cwd despite the explicit empty-cwd contract;
repair its usable replay recipe without overwriting historical frozen outputs.
Retain accepted source helpers unchanged for cleanup; no cosmetic normalization,
refactor or new compiler work is assigned. Retire original program bodies per the authorized cleanup prompt,
preserving Git locators, diagnostics and raw outcomes; Python exception is now
consumed and no further Python execution is permitted. LH-06 and final LH-07
remain open; LH-03's implementation proof is accepted with documentation/
idiom delivery refinement still pending. No compiler fix, merge, push,
publication or full five/eleven pilot repeat follows.

## Cleanup accepted — 2026-11-06

Reviewed clean2d69bda, including cleanup4e19e0e. I independently confirmed the
two .py paths are absent and recent Slice06/07/08 artifact plus owned task
target/slice07/08/09 find/rg queries find no .py/.pyc or full inline bodies.
I inspected all three replacement/locator documents; original Git blobs37e39,
dbf448 and5881e780 still exist. Tracked/ignored builder metadata compare equal.
Both original stderr/status pairs remain equal at SHAa04627a7 and4355a46b;
Git diff against7048 proves the tracked diagnostic and positive-log bytes did
not change. Historical diagnostic fragments/mentions remain intentionally;
this is not a claim of zero Python text or a global legacy-script purge.

All four helper source hashes remain da1f13a8/7569339d/82fca2d8/e3ba6c8d,
and there is no source diff from accepted e9555ecd. README now really changes
compiler cwd to its explicit empty-config directory, uses paths valid there,
documents R0's fixed config dependency and stages the child within read scope.
Its fresh outputs/run root preserve prior frozen receipts. No remaining
functional or documentation finding. Accepted native gates, full code review,
all12 runtime controls and exact output reconciliation therefore retain their
applicability without another runtime, Python invocation or compiler build.

Final source-home tips, common AGENTS SHA1b5d78b9 and CLAUDE mode120000 remained
unchanged/clean, so the six independently reproduced citation gates apply.
LH-03/06/07 now done. CDC's mechanical canonical report relocation and final
retrospective/parent update complete this bounded endpoint. Source-backed
NE-C05/06 follow-ups and all earlier audit/library/human obligations remain
owned/open; no new scope or external action is opened.
