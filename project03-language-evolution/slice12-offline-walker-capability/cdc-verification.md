# Slice12 CDC verification

## Pre-execution authoring review — correction required, 2026-11-06

Reviewer `/root/cdc`, Sol6.1 High; source author fresh CC
`/root/cdc/offline_parser_cc`, 6 Luna High. Initial candidate/control/prediction
freeze21aa45e9db2f5f4befd51c97db21cf7ba7df9923 and complete attempt-0001 copies
are retained. Read all441 initial Lykn lines and actual control/prediction data.
No compiler/parser capability result exists yet. Manual source findings are
ordinary authoring issues, not observed compiler/parser defects:

- JS-style braces/from import and legacy exports spelling instead of documented
  Lykn import/export forms; unmatched outer async boundary in load-parser.
- Async verify-parser returned a promise to a string return check without await;
  prior-hash parameter was not used.
- Probe and observer used try/catch in a bound value position instead of the
  documented/tested statement form; use statement try with a cell/final value.
- Preserve attempt metadata before child spawn and actual raw/status receipts
  before decode/assert; configurable empty cwd and per-case fresh cache are
  required for the independent condition, not hardcoded CC state.

CC preserved corrected-but-unvalidated attempt-0002 bodies before pausing;
iteration01 is the durable consolidated instruction before further checks/runs.
Both drafts stay attributable to CC; CDC has not edited implementation source.

Process exceptions are explicit: CC reports `jq empty controls.json` before a
precheck snapshot, plus `git -c core.hooksPath=/dev/null commit` for21aa45e.
These are not retroactively compliant. Controls unchanged since jq is CC
attestation, not independent precheck-byte proof; actual command/output and
limits must be retained without rerunning jq. CDC's read-only current hook
inspection found no configured core.hooksPath and only .sample hooks in the
common /Users/oubiwann/lab/lykn/lang/.git/hooks. Thus no active applicable hook
is presently observed, but that does not justify the bypass option or establish
an unrecorded historical hook state. Normal commits and any actually applicable
hook checks are required; no history rewrite. Scientific source/control freezes
still precede the first native compiler or parser runtime, both unrun.

All six PC rows remain open. No PhaseA/PhaseB capability acceptance, compiler
repair, new dependencies, larger control set or full-corpus work is inferred.

### CDC export-instruction retraction — before dependent checks

CC correctly challenged iteration01's local-export instruction. Current source
SKILL Modules431–461 and guide00 Modules require top-level `(exports ...)`;
classifier/forms.rs166–173 validates this surface declaration and emitter
forms.rs141/726 lowers it to kernel `(export (names ...))`. CDC had not checked
that exact current section before prescribing the older syntax. The initial
candidate's `(exports load-parser verify-parser)` was correct and must remain.
Retract that part of the first source finding and iteration01, preserving both
issued records. This is CDC's source-reading error, not a guide/compiler defect.
The real path-first import/delimiter/await/try/receipt findings are unchanged.
Attempt-0003 preserves the corrected observer before further checks; no compiler
or parser run has occurred. Numbered correction02 records the one-line semantic
retraction without restarting the refinement budget or inventing source evidence.

## Independently reproduced first-gap stop — 2026-11-06

Reviewed clean CC handoff7c9fbea6c3eb14251c59ade933802e08ed658fe3 and exact
frozen candidate6c4faee8c093ba1a109152fee90c508816b49320. Independently repeated
its SAME three-file pinned `lykn check` invocation from fresh owned config-free
/private/tmp/lykn-slice12-cdc-gap-20261106-01. Actual output is in
[own receipts](artifacts/evidence/cdc/): exit1, empty stdout and identical
unknown top-level export diagnostics for load-parser (1:10) and verify-parser
(1:22). Native cmd_check stops at the first failing file; the other files are
not thereby validated. No reduced repro, alternative form, formatter, lint,
compile, Deno check or parser/runtime was run during this review.

Own identity.txt establishes all three current source files equal the frozen
candidate and actual compiler SHA256
57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28/version0.6.0.
Core source SHA256 is8ab59c5f4c81cf0cd8187287a01e6858d9d2dd30d89332d08a64affdadb8a018.
Own config-absence metadata shows no project.json in cwd or any ancestor. Source
release remains clean f705655; no product source was edited.

This is a **native check/validation composition gap**, not proof of a codegen,
Acorn, Deno-offline or walker defect. The valid seven-top-level-form core uses
preferred `(exports ...)` plus documented `(async (func ...))`. Current SKILL
Modules/Async and guide00 Modules support that composition. Source
classifier/forms.rs184–209 collects bindings through top_level_binding_sites;
it unwraps outer export only. bindings_introduced in binding.rs181–218 is
explicitly nonrecursive and has no async wrapper case. These source facts and
the repeated diagnostic establish NE-C07 below without another program.
The CC's initial “authoring” interpretation of check03 is superseded by this
source-backed disposition; checks01/02 were actual delimiter authoring failures.

No generated JS exists, so generated-code semantic review is unrun. Authored
core/probe/observer are retained **unvalidated candidates**, not usable verified
tooling. PhaseA is0/4 observations run (K11/K01/K08/K09); full K01–K12 walker
gate is unrun, K10a/K10b remain two manifest cases and K12 remains a separate
synthetic unit boundary. No AST/range/error/offline parser result is inferred.
Some CC command-recipe text lists prospective fmt/lint/compile steps; actual
observations are only the three check receipts and this one independent replay.
Do not count prospective recipe lines as executions. CC results physically
reside at artifacts/results.md rather than prompt's root results.md; this same-
slice existing home is adopted here with the deviation visible, not recreated.

### Final six-row disposition

| ID | Status | Evidence, reason and re-entry |
| --- | --- | --- |
| PC-01 | deferred | Later source/tool freezes and every native attempt are retained; pre-jq/diff-check bytes/exits were not contemporaneously preserved and unchanged-data claim remains attested. Hook bypass is noncompliant even though current hooks are only samples. Historical verification requires actual contemporaneous evidence; no recovery inquiry or retroactive cure is claimed. Future work starts with compliant fresh freezes. |
| PC-02 | deferred | Native validation gap stops before parser prerequisite:0/4 run. Re-entry after separately authorized NE-C07 disposition/repair, pinned compiler/source change and fresh same-four-observation assignment. |
| PC-03 | deferred | Walker not authored, deliberately held behind prerequisite. Resume only after independent parser-gate acceptance, same accepted contract. |
| PC-04 | deferred | All12 K control groups unrun; no case weakened or removed. Resume the fixed gate only after prerequisite/tool implementation acceptance, with K10 and K12 boundaries preserved. |
| PC-05 | deferred | Native check fails documented async exports; fmt/lint/compile/Deno/generated review unrun. No export/async reshaping, kernel/bind wrapper or skipped validation used to bypass it. Resume required scoped gates after NE-C07, not a claim of usable tools now. |
| PC-06 | done | Reconciled independent same-source/tool failure + source/guide root-cause bounds, six-row walk, owned backlog re-entry, preserved process exceptions and CDC retrospective. Accept only the bounded stop. |

All six rows have explicit disposition: one done, five deferred. No no-op or
missing row. Initial source/prompt/review mistakes and bypass/precheck limits
remain preserved; no history is rewritten. No new source/compiler repair,
parser acquisition, PhaseB, full corpus/F6 audit or next unit is opened.
All original F1–F12 and Project07 synthesis/licence/bootstrap/library/ADT/guide/
book/human and separate compiler/diagnostic obligations remain open/owned.
