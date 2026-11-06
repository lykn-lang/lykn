# Slice02 independent verification

## Initial candidate review — 2026-11-05

CDC Sol 6.1 High reviewed CC Luna 6 High planning candidate
1688a5930f20740eae0d188ffa0cadd00aca3149 and its six source tips, recorded in
closing-report.md. CDC authored no AGENTS or source cleanup implementation.
The separate fresh Sol 6.1 High context guidance_composition_review audits the
parent A-2/P-7 composition and governance contract; its verdict is not CDC's
self-review of the parent plan. Root's parallel facts matrix is read-only
corroboration, not an independently selected model/acceptance claim.

**Current verdict: return GC-R01 for correction. All six GC rows remain open;
parent A-2/P-7 remain open. No Rust work resumes on this candidate.**

Complete old/new AGENTS and the corrected candidate were inspected.
Architecture, named skills, branch-qualified source guidance, philosophy and
output-quality authority, validation, history, snapshots, wrappers/permissions,
Git trailers and human gates are present. Precommit semantic review and its
iteration03 preserved omissions without CDC implementing the text.

The fresh parent reviewer found GC-R01: the table's dedicated product-task rule
and unconditional no-product-authoring on release branches overgeneralize the
Autonomous task requirement. Old AGENTS assigned release source/docs homes;
Operator supplied no global ban. CDC confirmed the earlier prompt caused this
design error. The fresh reviewer reported no second material concern; existing
named Deno guidance and preserved Lykn reference retain the no-Node boundary.
Iteration04 restores ordinary release homes outside Autonomous Mode or an
explicit active assignment, leaving main/integration/external gates intact.

### Independently reproduced, retained partial evidence

At the initial candidate's six fixed source tips, CDC ran native
make check-cited-paths with private DENO_DIRs under
/private/tmp/lykn-guidance-cdc.uzWHmP and DENO_NO_UPDATE_CHECK=1. All six exited
0: main 62 documents; the other five 63 each; 601 frozen historical citations
accepted in each. Raw outputs are in artifacts/cdc-citation-checks.txt.
No package fetch/new dependency or source/index/CC-cache mutation was needed.
These are initial-candidate runs, not fresh checks of iteration04.

All seven committed AGENTS were regular mode100644, blob ede9c15088ba7ffe407ca83dbffea72c168960ae,
SHA-256 0a164012d6ce4c551b7b1538f52b720b5fc9ec17e62edc11b4db05bf06d90023.
CLAUDE remained mode120000, blob47dc3e3d863cfb5727b87d785d09abf9743c0a72,
with actual readlink target AGENTS.md in every home. All tracked trees were clean.

Each final source SKILL was directly compared with its own original Git blob:
the sole content delta is the DD49 line replacement. Main preserved its distinct
0205e6ea original; the other five preserved 241bc4d8. Final blobs are respectively
b8cecd4ce7c3a14e717186fa3146ffb649537828 and
860d7ab7b0d8b7cb9cefb919f226f6dffe31a8ef. Historical move-checkpoint execution
is CC-attested; independent original/final byte comparison proves preservation
of every other byte. README/philosophy/ignore diffs contain only the assigned
reference replacements and obsolete ignore-rule removal.

All old ai directories and tracked link entries are absent. Reviewed CC's exact
historical lifecycle: test -L on each named entry; tracked names additionally
checked with git ls-files --error-unmatch; rm on the quoted entry path without
recursive/trailing-slash arguments; finally rmdir on each emptied ai directory.
Those operations unlink symlink entries and require empty directories, without
following external targets. Initial inventory and action execution remain
attested; their safe semantics, Git modes/diffs and current absence are reviewed/
reproduced. No external-target before/after contents were measured, and no
historical deletion was falsely rerun for review.

Six complete no-rename source diffs contain only the ten allowed governance/docs
paths. Code, tests, Cargo manifests/lock, Makefile, citation checker and frozen
census are unchanged. Independent active-reference and code-consumer git grep
queries returned expected exit1/no matches for assets/ai; populations were
AGENTS/README/philosophy/SKILL and tracked rs/js/lykn/lyk/Makefile respectively,
not historical planning/census payloads. All commit trailers and diff checks
passed. Full make check/compiler/doctests were neither run nor claimed here;
relocation preserves their selected file populations and changes no code.

After iteration04, retain only unaffected SKILL/removal/census/source-scope
evidence if exact deltas establish applicability. Fresh semantic/AGENTS-byte/
mode/citation/diff/status checks and the separate parent's fresh verdict are
required. This record preserves the rejected candidate and its useful partial
evidence; it does not soften GC-01/GC-06 or infer higher acceptance.

## Final child review — iteration04, 2026-11-05

Candidate planning b8152fd0ab869fd48cc246182930ac7ba9a27a93; assignment
cc-prompt-iteration04.md. **Child verdict: all six GC rows done, reproduced.
Parent A-2/P-7 acceptance remains with the separate fresh reviewer.**

| Source home | Final reviewed tip |
| --- | --- |
| main | 1dc85832c2414460323f4e203adfcc283db239e7 |
| release/0.6.x | cb3ee61cd686eac9fe551fb9c826b9aad532b008 |
| release/0.7.x | d51f494069552d746f4e8d3fa79cf594f685be0e |
| release/0.8.x | e0356ee902392610a96492470595ffc745b3d33c |
| codex/native-esbuild-controls | 9be0c301e11e3d8503605e9b50b53056f47c9b14 |
| codex/contract-predicate-lowering | 9be0c301e11e3d8503605e9b50b53056f47c9b14 |

Inspected actual committed AGENTS delta and full corrected meaning. Dedicated
task branches apply in Autonomous Mode or when the assignment explicitly
requires one; otherwise assigned release source/docs homes remain valid. The
global release-authoring ban is gone; main/integration safeguards survive.
GC-R01 is corrected. Pre-gate ambiguous wording/amended IDs remain in CC's
dated results; no failed gate invented or rejected candidate erased.

Fresh seven-tree/actual-file checks: AGENTS regular mode100644, common blob
b802953bbbfe54b315833c59f1cafe6b8746781b, SHA-256
4e314256eec67945d229918ac9f443ea0b0684a199b497c3747be56440fd47a3.
CLAUDE stays mode120000 with actual relative target AGENTS.md. Each six source
delta from its initial cleanup tip is AGENTS-only; planning changes AGENTS plus
four allowed CC outputs. Status/diff checks passed. Original SKILL/body,
unlink/removal, census/checker, companion docs, source/lock/test and consumer
population proof above remains applicable at its original revision/date;
none is relabeled a fresh run.

Independently reran native make check-cited-paths on all six final tips using
private per-home DENO_DIRs. All exit0: main62 docs, other five63 each, unchanged
601 historical census citations. Fresh raw outputs are in
artifacts/cdc-citation-checks-iteration04.txt; initial outputs remain separate.
No full implementation, doctest or coverage suite is claimed for this cleanup.

| Row | Final basis |
| --- | --- |
| GC-01 | done: complete semantic review and corrected conditional authoring rule; parent authority audit independently owned. |
| GC-02 | done: original/final per-branch byte comparison retained, exactly one DD49 citation delta and valid companion references. |
| GC-03 | done: retained inventory/safe lifecycle review and reproduced absence/modes; external-target contents not measured. |
| GC-04 | done: fresh seven-home AGENTS bytes/Git mode and CLAUDE target/mode. |
| GC-05 | done: fresh six native citation passes; unchanged active/code reference population and frozen census/checker retained. |
| GC-06 | done: allowed deltas/trailers/status, preserved history/ownership, no compiler/source-code/merge/push or parent acceptance inferred. |

Six opening rows remain six; no deferred/no-op or weakened criterion. Prior
tools/binaries and original five-control/policy/licence/human evidence survive.
GC-D01 is an unexecuted static guide follow-up in Project07. NE-C01 remains
unfixed and held until the fresh parent verdict; no original F/Project07 or
Project06 P-2 acceptance follows. The separate fresh reviewer has confirmed
iteration04's source meaning/parity; its final parent composition record follows
the committed child close. Retrospective covers CDC's placement/authority errors.

After this child close, fresh reviewer guidance_composition_review accepted only
new A-2/P-7 at af7cb86 and the six corrected source tips. Its verbatim authored
report is now preserved in [parent close](../closing-report.md#2026-11-05-portable-guidance-follow-through),
with evidence reuse/fresh checks distinguished. CDC merely persisted that
report and derived status metadata; this is not self-acceptance of parent plans.
No source/guidance implementation changed after the reviewed candidate.
