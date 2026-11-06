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
