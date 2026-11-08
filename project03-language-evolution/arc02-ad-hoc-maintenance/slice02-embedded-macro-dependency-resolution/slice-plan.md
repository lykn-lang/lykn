---
project: project03-language-evolution
arc: arc02-ad-hoc-maintenance
slice: slice02-embedded-macro-dependency-resolution
status: in-progress
planned-release: unassigned
depends-on: []
related: [arc03-protected-host-intrinsics/slice01-versioned-host-protection]
---

# S02 — compiler-owned embedded macro dependency resolution

## Current implementation authority — 2026-11-08

Operator “Perfect! Go ahead and implement” approves reviewed c209462 design
for this prerequisite's source delivery/independent close. Current SOURCE
assignment [cc-prompt-iteration01.md](cc-prompt-iteration01.md); initial6003
cc-prompt.md remains immutable DESIGN-only history. Reuse coherent Luna6 High
design contributor as CC after renewed intake/source ownership; Sol6.1 High CDC
independently reviews/reproduces. First planned source assignment0/5, source
refinements not inferred from filename. Arc03 source01/5/tooling8/K0 unchanged.
STOP ANY substantive failure/real gap. Only finite S02 is authorized; no Arc03
composition/continuation, release mutation or automatic next source unit.
Actual immutable freezes/static release precede baseline and production gates.
Provided exact source -F files precede first commit. All6MR remain OPEN.

## Assignment history

- 2026-11-08: iteration01 issued at017549ff297b9545a718dfc33fead3b5340c54ab.
  `/root/cdc/macro_dependency_design_luna` completed renewed source intake and
  verbatim readback of all three supplied commit messages. CDC handed that
  Luna6 High actor exclusive source/index/build/raw ownership; CDC retains
  planning/prose and independent acceptance. Hook preflight found only sample
  hooks. Tests-only freeze is first; static review holds all builds/baselines.
- Initial cc-prompt.md at6003: read-only design review completed, no source pass.
- Iteration01 SOURCE assignment issued after explicit approval, predecessor
  design-only prompt. Same physical task checkout, new branch from accepted62e
  only after intake/handoff; old e2f ref preserved. Execution pending, no new
  results claimed. First initial planned code/TDD delivery, not a budget reset.

## Reviewed design outcome — 2026-11-08

Fresh `/root/cdc/macro_dependency_design_luna` (gpt-6-luna High) completed the
issued6003 read-only review; CDC Sol6.1 High reconciled its source findings in
[design-review.md](artifacts/design-review.md). Five bounded clarifications are
incorporated below. No source/build/probe/runtime, no actual repair proof or
implementation acceptance. All6MR/AM-04/HC/PHI/CV remain OPEN. This DESIGN endpoint
is ready for Operator assessment; execution/candidate composition still held.

## Authority and endpoint — 2026-11-08

Operator authorizes DESIGN of the bounded dependency-resolution repair and
native policy-oracle strengthening, same Luna6 High contribution/separate
Sol6.1 High CDC final judgment, Autonomous Mode, first substantive failure or
real evidence gap STOP. This turn ends at reviewed design and concrete held
implementation assignments. NO source edits/builds/specimens/probes/dependencies/
branch creation/merge/push/publication. Source/release62e accepted; tests-only
Arc03 e2f preserved. Planning base c791eca; exact old raw stays unchanged.

This is one useful generic compiler-runtime maintenance increment in existing
Arc02, not a new arc or process-only investigation/repair/review chain. Arc03
retains its own v1 implementation and oracle correction. No indefinite Arc02
intake closure blocks return. Planned maintenance source budget0/5; Arc03 S01
refinement01/5 spent/four remain and old tooling8/K0/13 DO NOT reset.

CDC authors the design/recipe; fresh fork-none Luna6 High READ-ONLY reviewer
checks source feasibility and oracle discrimination under [cc-prompt.md](cc-prompt.md).
Fresh context avoids carrying the stopped implementation context's setup/capture
slips into design judgment; no model substitution or source reassignment occurs.
Actual review is not implementation acceptance. All six MR rows remain open.

## Useful delivery and held implementation assignment

The [repair/oracle design](artifacts/repair-and-oracle-design.md) is the exact
source/contract authority. Future source assignment is HELD for Operator approval.
Recommended scope, no public API addition:

1. `crates/lykn-lang/src/expander/deno.rs`: public spawn materializes/canonicalizes with `?`,
   passes `&Path` to PURE private `build_deno_command(script, materialized)`.
   Always use compiler-owned package config/lock; remove private cwd-project
   discovery. Preserve evaluator script/protocol, pipes and Drop kill→wait.
2. `crates/lykn-lang/src/expander/embedded.rs`: narrow required-file presence
   in same-version cache fastpath (existing deno.json AND deno.lock); missing
   file triggers existing extraction. No content-hash/build-key/cache redesign.
3. NEW `crates/lykn-cli/tests/macro_dependencies.rs`: five finite process
   conditions below plus strict runtimes/immutability observations; tiny local
   optional receipt idiom, no replacement harness. Default assertions never skip.
4. `docs/guides/15-lykn-cli.md`, `skills/lykn/SKILL.md`: narrow native macro
   config/lock/source-dependency boundary documentation. PublicJS/browser unchanged.

No compiler.js import rewrite, lock/version/dependency update, pass0/CLI config
resolver algorithm rewrite, blanket network sandbox or Arc03 policy code.
Package config/lock already exist in canonical AND embedded source; no new asset.
New I/O propagates existing LyknError::Io, not expect/panic. Pure builder takes
Path arguments without lossy conversion. Existing public spawn signature stays.

## Finite proposed tests/predictions (UNRUN)

Harmless source macro uses existing quasiquote grammar:
```lykn
(macro twice (x) `(+ ,x ,x))
(console:log (JSON:stringify (twice 21)))
```
Expected exact `42\n`, exit0/empty stderr.
Freeze complete literal fixture in future product test before any execution.

| Condition | Required final observation; old source prediction |
| --- | --- |
| M1 no project, cold owned XDG | Macro compiles and strict child prints42; old source is expected to reproduce known bare-astring boundary, not claimed measured for this harmless source |
| M2 project imports omits astring | Same semantic success, caller config/lock bytes unchanged; old dependency resolution expected red |
| M3 consumer alias named astring points to its own local macro module | Import-macros "astring" reaches that module through unchanged Rust tier, while compiler uses its own declared astring; exact42 and no caller config/lock mutation; old private Deno-config coupling expected red |
| M4 same-version cache missing required package config | Warm-up compile/materialization captured before assertions, remove ONLY config, then second compile must re-extract and succeed; old fastpath expected red. Preserve both outcomes; no early expected-red assertion may skip the second condition |
| M5 owned blocked XDG cache path | Existing regular file prevents materialization: CLI exits1 with I/O diagnostic, no panic/new output; old expect path predicted101. Typed propagation is additionally source-reviewed, not inferred from CLI text alone |

M5 MUST use the SAME macro-bearing harmless source as M1: without a top-level
macro/import-macros form expand() returns before spawning/materializing, so an
ordinary source would not test the intended failure. Compile to an owned absent
output, require no new JS/DTS; no generic I/O program or new source family.
M2 config is `{"workspace":[],"imports":{}}`; M3 uses the same root schema with
`"astring":"./macros/mod.lykn"`. Use existing valid package lock bytes for any
caller-lock sentinel, not a malformed hand-invented lock schema.

M3 module contains ONLY:
```lykn
(macro alias-twice (x) `(+ ,x ,x))
```
consumer imports `(import-macros "astring" (alias-twice))`, has NO local macro
definition, then `(console:log (JSON:stringify (alias-twice 21)))`. Config alias target
`./macros/mod.lykn`, caller cwd is project root, consumer source at that root;
no ambiguity about current relative exact-map base. Complement with EXISTING
pass0 exact/longest-prefix/dev-overlay/relative tests unmodified; do not invent
new registry inputs or assume current resolver is universally correct.

M4 first compile is preparation AND retained observation; full package files
are materialized even if old macro compilation errors. Require actual config
existence/bytes before removing it; do not synthesize a successful warm-up or
skip on error. Second compile and all final assertions still run. Missing-lock
proof uses owned filesystem state through the ACTUAL shared production cache-
validity path, not a synthetic boolean mirror: private cache-readiness helper
used BY production fastpath, owned dirs/same-version sentinel and neither-file,
config-only, lock-only, both-file states => false,false,false,true. Lock-absence
proof is source+filesystem-unit ONLY; M4 supplies runtime re-extraction proof
for config absence. No extra runtime family; no global env mutation in tests.

Proposed parent population is five tests/M1–M5, six compilation observations
(M4 has two), four harmless runtime outputs; pure command/cache controls are
separate native units. These are future predictions, not observed totals.

Pure command tests replace old config/no-config assertions consciously: exact
owned cwd, OsString/Path config+lock arguments/frozen flag, no caller file. Check
unusual path characters without spawning Deno. Add materialization-error typed
propagation test using an owned blocked cache path in an isolated CLI process,
not unsafe global env changes or broad permission manipulation.

Future guide15 edit explicitly qualifies its current lines74–75 “no Deno ...
required for compilation”: ordinary/no-user-macro native compilation versus
user macro/import-macros compilation requiring Deno. Document the actual owned
config/lock and lost arbitrary caller-Deno passthrough. This pre-existing guide
overstatement is owned here, not deferred wholesale to later S07/S08/book audit.
No new target-JS runtime dependency is implied.

Future full normal unfiltered Make+cites and separate CDC source/focused/full
reproduction required. Build all needed targets/no-run then actual final pins;
durable first-launch cwd/argv/env/raw, fresh private TMP/XDG/npm, fixed approved
DENO_DIR/existing pinned dependency, exact Deno2.9.6. No missing-input acquisition;
cache availability is a preflight obligation, no hermetic/no-network theorem.
No W8 protected-write program execution; exact W8 expansion/re-entry stays an
Arc03 compile-only condition after prerequisite acceptance.

TDD sequencing: first Git-freeze the five CLI tests against OLD public APIs,
then meaningful predicted-red observations. New private command/cache units
join the production implementation freeze (do not type-break old-API baseline).
New required tests must not inherit existing skip-if-Deno-absent conventions:
missing pinned executable/input is a stop. Existing weak legacy macro tests do
not substitute for these actual success/runtime oracles.

## Integration/re-entry proposal, NOT authority

Future source branch from accepted62e in existing task checkout, preserve e2f
and old accepted refs. Intentionally red Arc03 tests are absent, so this unit's
normal full Make can genuinely pass. After accepted prerequisite commit P,
request explicit local candidate-composition authority: new Arc03 descendant
preserving P/e2f histories via normal merge, exact union review; no release merge.
Arc03 then executes its separately approved native-oracle correction02 (not
issued now), original baseline and v1 recipe/full independent gates. Its dist
classifier error mapping addition is explicit in design, not hidden maintenance.
No source allowance or historical acceptance is reset by that composition.

Actual implementation -F messages/intake/source/index/build handoff and complete
fresh source-ready prompt occur only after execution approval. No empty source
prompt or fake gates are issued in this design-only unit.
