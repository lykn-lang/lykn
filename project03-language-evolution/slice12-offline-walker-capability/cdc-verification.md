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
