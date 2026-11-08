# Actual design review and CDC disposition — 2026-11-08

DESIGN ONLY. Author `/root/cdc`, gpt-6.1-sol High; fresh reviewer/contributor
`/root/cdc/macro_dependency_design_luna`, gpt-6-luna High, fork none. Issued
[read-only prompt](../cc-prompt.md) is immutable planning
`6003a51d774ffcb70817c4d8738786305cae08e7`. Reviewer reported complete required
source/guide/design/history reading, clean planning/product refs, and returned
chat findings without any writes/builds/probes/specimens. No source/index/build
ownership was handed to this reviewer. Root supplied read-only co-design facts.

## Actual findings and resolution

| Finding | Source / consequence | CDC disposition in final design |
| --- | --- | --- |
| M5 must force the macro path | expander/mod.rs63–87 returns unchanged without top-level macro/import-macros; a plain program would not touch blocked XDG | Explicitly reuse M1 macro-bearing source, compile to absent output; same condition, no new runtime family |
| Missing-lock proof was under-specified | M4 deletes config only; both required files must affect production fastpath | Explicit owned-file unit states neither/config-only/lock-only/both against shared PRODUCTION cache-readiness path; lock proof is source+unit, config absence has M4 runtime proof. No claim two cache runtime conditions were observed |
| Four-versus-five condition wording | Plan included M5 after saying four conditions | Five future parent tests, six compile observations (M4 two), four harmless strict runtime outputs. All UNRUN |
| Guide compilation claim too broad | guide15:74–75 says no Deno required, while user-macro path spawns Deno | Immediate narrow guide/skill ownership: distinguish ordinary native compile from user macro/import-macros compilation, owned config/lock and compatibility change. Later S07/S08/book remains actual final-impact audit |
| Native mtime checks need discriminating preimages | Fresh writes can share coarse timestamp with rewrite | Set existing-output sentinels to UNIX_EPOCH with existing File::set_modified before captured launch; preserve bytes/times and same predicate controls, no sleep/clock change |

The reviewer source-confirmed: existing From<IoError>/spawn Result, pure Path
builder feasibility, Drop kill→wait, matching existing package declarations/
locks, Rust resolver tiers, unique imported alias-twice discrimination, exact
check/compile rendering, parsed/default spans and typed first-classifier dist
variant/nonempty error invariant. These are source/design findings, not runtime
reproduction or a guarantee the repair passes future gates.

CDC accepts those bounded clarifications and independently reconciles them with
the source already read. Root's preissue co-design supplied the unique-macro
countercontrol and scoped-map/lock distinctions; these are not falsely
attributed as new Luna findings. CDC additionally makes the pure builder's
absolute-root precondition explicit: canonicalize with `?` in spawn after
materialization, not I/O inside builder or double-relative joined paths. That
last mechanical clarification is CDC-owned, not claimed as Luna-authored proof.

## Verdict and evidence boundary

Reviewed bounded implementation proposal is ready for Operator assessment:
Arc02 S02 owns native dependency config/lock repair on accepted62e; Arc03 S01
owns exact v1 oracles and required typed-dist adapter after accepted prerequisite/
explicit local composition. No new unresolved PL policy choice is delegated to
the implementer. Source-readiness is not successful implementation: actual
macro resolution, frozen lock/cache recovery and test results remain unobserved.
If cached input is unavailable or future behavior contradicts predictions,
STOP rather than acquire inputs or invent a workaround.

No source execution or candidate integration is authorized by this review.
All6MR/AM-04/HC/PHI/CV remain OPEN, maintenance source0/5, Arc03 source01/5 and
older tooling8/K0/13 preserved. Initial6003 prompt, c791eca original raw and
previous stop records remain untouched. No source-acceptance closing report or
implementation verification is fabricated at this design endpoint.
