# Slice05 — Deno evidence preflight

Status: **CC attested proposed-done; preflight stop awaits independent CDC review.**
Parent: [Project03](../project-plan.md), established collapsed standalone slice.
Current assignment: `cc-prompt.md`. Contract: [ledger.md](ledger.md).

## Operator authority and endpoint

On 2026-11-05 the operator said: “Agreed, let's do that bounded Deno experiment
next! Same models, Autonomous Mode, and stop if we hit the evidence gap you
described :-D”. The accepted proposal was one pinned compiler/Deno combination,
one backend, no new external dependencies, and five tiny control programs:
no-library payload, JSON without YAML, JSON value without unrelated file helpers,
unused pure code versus retained effects, and usable published entrypoints.
Stop when retained/removed code cannot be identified; do not silently replace
original F-6/F-10 or add programs/backends to evade that boundary.

Same explicit model choices: OpenAI Codex Sol 6.1 High for CDC/design/independent
review; OpenAI Codex 6 Luna High for CC. Root transports and performs read-only
lookup. CDC owns planning/index until handoff, CC then owns its exact four paths,
and CDC resumes ownership for independent review/retrospective. No push, publish,
remote CI, installation, package fetch, new npm/Node dependency or source change.
Read-only retrieval of official versioned source is documentation research,
not permission for package acquisition.

The outcome is the experiment result **or the required gap-stop**. Author
preflight has already found a provisioning prerequisite before any control:
matching official Deno 2.9.6 source requires native esbuild 0.25.5 and initializes
it before resolver setup; the exact dl executable and exact npm package folder
are absent locally. Cached0.25.12/0.27.4 versions are different and are not
substituted. The current CC assignment independently checks this stop and
records0/5 control programs run. It does not attempt a bundle to observe a
forbidden download. This is a valid stopped attempt, not successful optimizer
validation and not deferral of a silently reduced five-program experiment.

The authorization ends after evidence/independent review and retrospective or
this gap-stop. No compiler build, task worktree, fixture/helper/program or
output bundle is created while the prerequisite is held. Source is read-only;
therefore no unused task branch is invented. Actual later experimental program
implementation/build first requires a dedicated non-default task source
branch/worktree and refreshed authority/identity, as recorded in Project03.

## Current baseline and gate

Planning branch `planning`, existing `.worktrees/planning`, opening clean at
`1ff8bb0a1fdecb59579aff3c29e94f241488dd46`. Read-only source `release/0.7.x`,
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x`, clean at
`74a90d51b853fc18fe2b7c6ee07417736e1ce464`. No source branch is switched.
Global lykn 0.5.2 remains stale; the available 0.6.x binary is not 0.7.x provenance.
Deno 2.9.6 is `/opt/homebrew/bin/deno`, SHA256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`;
V8 15.0.245.2-rusty, TypeScript 6.0.3. Revalidate live facts.

`deno info` identifies `DENO_DIR=/Users/oubiwann/Library/Caches/deno`.
Expected matching-source backend is `dl/esbuild-0.25.5-1/esbuild-darwin-arm64`;
the exact npm-cache fallback is
`npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.5` under that DENO_DIR.
Both are absent at author preflight. Exact cached versions 0.25.12/0.27.4 exist;
metadata presence is not the required executable/version. Record current state,
not an assertion that no esbuild is cached anywhere. No environment/npmrc
secrets are needed; do not print credentials or broaden to an all-cache survey.

Primary evidence is version-tagged upstream source, retrieved 2026-11-05:
- [esbuild.rs](https://raw.githubusercontent.com/denoland/deno/v2.9.6/cli/tools/bundle/esbuild.rs)
  lines19–22,40–147: required version/cache path, exists short circuit, npm
  metadata/package/tarball fallback and atomic installation.
- [bundle/mod.rs](https://raw.githubusercontent.com/denoland/deno/v2.9.6/cli/tools/bundle/mod.rs)
  lines210–307,309–397,1057–1099,2528–2607,2787–2892: initialization order,
  backend startup, internal metafile, write:false, source-map forwarding,
  tree_shaking(true), metafile(true), processed files and CLI summary.

These source observations qualify the local risk; local binary hash/version is
not a reproduced build-provenance attestation. `--no-npm` governs workspace
resolution; it is not proof of no backend npm acquisition. Internal tree shaking
and metafile exist despite absent help flags. The inspected CLI path reports
counts/names/sizes, not the internal per-input contribution map. Source maps
are forwarded; neither sourcesContent nor module-count/byte deltas alone prove
retained code. Universal impossibility of source-map methods is not established.
Do not investigate alternative APIs, internal protocol interception or tool
substitution beyond this stop assignment.

## Five controls retained before any execution

These are predeclared **specification-strength predictions**, not created or
validated programs. There are five control programs total, not five families
with added consumers. Each may use local support library modules if later
authorized; those modules are not additional entrypoint programs. Positive
consumers are shared as shown; no sixth program/alternate backend or hidden
variant is authorized. All five are currently unrun.

| Control | Tiny planned specimen and prediction | Shared positive/negative role and evidence oracle |
| --- | --- | --- |
| C1 | No library imports; `(console:log "BASE")` emits exactly BASE | Frozen library identity set has no resolved edge or retained contribution; C5 is the positive library consumer |
| C2 | Import only a JSON value subpath; input `{"x":1}` yields exactly key x with number1; no YAML package import | Independent JSON/YAML module sets; no YAML graph edge or retained contribution; C5 positively imports YAML |
| C3 | Import only the same JSON value subpath; x=1; no document/file-helper imports | Inside JSON package, value module has no helper edge and helpers have no top-level effects; no helper graph edge/contribution; C5 positively imports helper entrypoints |
| C4 | Used function returns 42, one effect records `["init:effect","entry:42"]`, unused known-pure function drops | One fixed nonthrowing program, no extra throwing variant; source range/retained-code attribution plus exact ordered stdout establishes this control only |
| C5 | One consumer imports every declared local specimen public root/subpath: JSON result x=1, tiny YAML fixture answer=42, file-helper reads exact `{"x":1}` | Positive consumers shared with C1–C3; declared/generated API map and behavior remain usable separately from app pruning; no registry publication |

Future support shapes use the already inspected native surface syntax: `(func
used :args (:number n) :body (+ n 1))`, named `(exports used)`, and local
`(import "./value.js" (parse-value))`; JSON uses native `JSON:parse`. They are
prose design examples only; no syntax/runtime success is claimed. Actual
helper/package setup and code must be concretized in a later authorized prompt
if the prerequisite is resolved. This current stop needs no unused source files.
Preserve original Slice01's broader throwing/effect/corpus requirements; this
five-control scope neither fulfills nor deletes them.

## Evidence, checks and exit

Artifacts: one `artifacts/preflight-stop.md` captures actual command outputs and
exits, source locators, observations versus interpretation, all five unrun
controls, exact gate, options/decision owner and re-entry. This single file
serves the decision/reproducibility need; no routine export, archive or custom
research helper is needed. CC writes a closing report and attested ledger
evidence; CDC independently rechecks and records `cdc-verification.md` plus
`cdc-retrospective.md`. No optimizer row is marked passed from a preflight stop.

No dependent commands are run: no bundle/API/backend invocation, cached wrong-
version binary, compiler build, fixture/corpus execution, source editing,
dependency provisioning, backend-cache seeding or external trigger. A changed
cache/binary/authority fact returns to CDC instead of automatically resuming.
After independent stop verification all DP rows may close as evidence-record
criteria, while the actual experiment remains 0/5 run and 5/5 unrun. Original
F-1–F-12 and Project07 consolidated report, JSON/YAML sequence, licence/bootstrap,
28 Y-14, 36 unsupported Y-13 and ADT/guide/book/human obligations remain unchanged.

## Author readiness and history

CDC retained unchanged framework 3.0.1, role/ownership/prompt/ledger contracts and
Slice04 native compiler/module source findings; refreshed live source/status,
Deno version/help/hash/cache and read primary Deno source before proposing any
execution. Loaded scientific-methods experiment design, controls/confounds,
evidence capture and comparison guides in addition to framing/measures/protocol/
validity already read. Concrete five-control denominator, shared consumers and
predictions precede all possible runs; the earlier framework-overhead watch item
is applied by reusing unchanged source evidence and creating only one result
artifact. No new source implementation is needed because the first prerequisite
already fails. Current questions and checks are fully specified in the prompt.

| Assignment | Date | Predecessor | Reason | Disposition |
| --- | --- | --- | --- | --- |
| `cc-prompt.md` | 2026-11-05 | none | Execute operator-required stop after newly discovered Deno provisioning/evidence preflight | ready for CC |

## Version history

- 2026-11-05 v1.0: Opened approved bounded Deno attempt, stopped before first
  control at pinned-backend prerequisite; preserve five predictions and0/5 run
  denominator, exact cache nuance, internal optimizer facts and evidence limits.
