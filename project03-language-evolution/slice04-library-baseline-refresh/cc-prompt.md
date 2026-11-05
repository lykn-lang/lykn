# CC assignment — Slice04 library baseline refresh

You are CC, OpenAI Codex **6 Luna, High reasoning**, implementing the operator-
authorized planning-only baseline refresh. CDC is **Sol 6.1, High reasoning**
and your independent reviewer. Read this assignment from disk and match it to
`slice-plan.md` before work. No source implementation or audit execution occurs.
Current identity: Project03 / collapsed standalone Slice04 / initial attempt.

## Deliverable and boundary

Produce `artifacts/findings.md`: a source-cited current compiler/Deno/module/
packaging/dependency-policy baseline and concrete proposed protocol for resuming
Slice01. This answers the operator's accepted request to refresh the existing
audit for today's compiler, Deno and dependency policy, then use JSON/YAML as
concrete consumers. One baseline census and one protocol are the agreed effort
extent; no additional experiments, portfolios or readiness investigations.
Use the standard five corrective iterations without automatic extension.

Binding approved direction: `lang/lib/` core library source; independently
opt-in `@lykn/*` JSR packages; selective entrypoints; importing no standard
library means zero standard-library payload. Safe application tree shaking
preserves effects, while published package APIs remain available. This is a
source/architecture direction, not a working build, package-name inventory,
licence choice or YAML port authorization. Prior `lykn-patch/yaml` home is
superseded. JSON remains before production YAML. Keep all Project07 remaining
synthesis, licence/bootstrap/source proof, authoring/book/human and 28 Y-14/
36 unsupported Y-13 obligations explicit.

Do not run builds, compile fixtures/corpus, bundle, execute research programs,
fetch/install dependencies, publish, push, merge, trigger CI or mutate source.
Do not add npm/Node dependencies or handwritten JS research tooling. Existing
npm:esbuild/npm:astring or node: references are observations to classify; old
scripts/prompt are historical, not current execution authority. No safety-bypass
flags or relaxed strict/assertion behavior. Lykn-first remains the rule if a
future research program is needed; this slice needs none. Shell and existing
read-only inspection tools suffice; no custom checker is needed.

## Preflight and ownership

Planning root `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch
`planning`, opening base `d49f5a9ba7b414eaa4930e2364e766c78beb081b` plus the CDC
open-set commit. Read-only source root
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x`, branch `release/0.7.x`, pinned
`74a90d51b853fc18fe2b7c6ee07417736e1ce464`. Recheck worktree/HEAD/status before
edits and on handoff. Source changes or different HEAD require CDC reconciliation.
Global `lykn` reports 0.5.2 and is not trusted as current-source provenance.
Installed Deno was 2.9.6 at opening; recheck version/help only. No source branch
is created because source is read-only; later implementation requires a dedicated
non-default task branch/worktree and revalidated baseline.

CDC hands you exclusive mutation/index ownership for exactly:

- `project03-language-evolution/slice04-library-baseline-refresh/artifacts/findings.md`
- `project03-language-evolution/slice04-library-baseline-refresh/ledger.md`
- `project03-language-evolution/slice04-library-baseline-refresh/slice-plan.md` (intake/assignment status only; no scope changes)
- `project03-language-evolution/slice04-library-baseline-refresh/closing-report.md`

Everything else is read-only. Preserve unrelated changes and prior evidence.
No root coordinator or CDC writes during your ownership. Return ownership to
CDC with exact commit/status. Local commits are authorized. No external trigger
is needed; CI definitions are inspected, not executed.

## Required reading manifest

Load required text fully in bounded visible reads; recover truncation. Record
file/revision and loaded extent separately from data-query coverage in
`artifacts/findings.md` §Intake, followed by a concise source-cited contract
readback in your words before dependent edits. Hashes/file listings are identity,
not proof of reading. Resolve contradictions/missing required text before the
affected work; coherent preflight permits execution without another approval.

1. **Required-full:** this prompt, sibling `slice-plan.md`, sibling `ledger.md`,
   and planning-root `AGENTS.md`. Source-root `AGENTS.md` must be byte-compared
   with it; if different, load both and surface conflict.
2. **Required-full:** installed
   `/Users/oubiwann/Library/Application Support/ChatGPT-Profiles/personal/codex-home/skills/collaboration-framework/SKILL.md`.
   Use its installed `knowledge/` root for the next framework sections.
3. **Required-section:** engineering-methods `guides/01-engineering-methodology.md`
   §§Notes for Codex, Roles and Shared Invariants, Two-Contributor Workflow,
   Autonomous Mode (all its subsections). These establish actual roles,
   independent acceptance, ownership, model selection and bounded authority.
   Engineering-methods `guides/07-implementation-prompt-authoring.md`
   §§Investigation and semantic evidence assignments, Required reading and CC
   intake. Project-management `guides/README.md` §§Notes for Codex, Expedited
   Mode, Autonomous Mode; `guides/02-canonical-planning-worktree.md`
   §§Existing records and supporting evidence, Slice iteration filenames and
   preservation. Required-full work-verification `guides/01-ledger-discipline.md`
   and `guides/02-evidence-strength.md`.
4. **Required-section:** `../project-plan.md` §§Current direction and bounded
   Autonomous Mode, Existing units, Definition of done and boundaries;
   planning `project07-core-library-research/project-plan.md` the entire new
   2026-11-05 approach amendment before September history plus §§Definition of
   done, Research and evaluation contract. Read Project07 ledger rows P-01–P-08
   with their column definitions and 2026-11-05 status note. Earlier history is
   reference-only, and no old scope is silently reduced.
5. **Required-full:** `../slice01-treeshake-audit/slice-plan.md`, `ledger.md`,
   `inventory.md`, `predictions.md`. **Required-section:** its historical
   `cc-prompt.md` §§Hard constraints, Phase P2, Phase P3, to identify old path,
   npm and handwritten-JS assumptions; those are held, not execution authority.
6. **Required-full:** source-root `assets/ai/SKILL.md` (Lykn language guidance).
   **Required-section:** source-root `docs/guides/14-no-node-boundary.md`
   IDs01–07,24–26; `docs/guides/10-project-structure.md` IDs01–03,08,15.
   Read complete IDs including examples. These supply documented module/config/
   package policy to compare with stricter current task authority; do not treat
   an old permissive npm/node example as permission to execute it.
7. **Required-section:** installed scientific-methods `SKILL.md` §§Core Pattern,
   Minimum Useful Protocol and full `guides/01-inquiry-framing.md`,
   `04-operational-measures.md`, `05-protocol-and-prompt-design.md`,
   `08-analysis-and-threats-to-validity.md` under that skill. This informs the
   proposed protocol's controls/measures/limits, not experiment authority.
8. **Required-data and witnesses:** source projection below. Preserve complete
   queries, exits, denominators/exclusions/errors in Findings §Method. Source
   function bodies required as witnesses are prose/code reads, not merely grep
   counts. Derive observations rather than repeat expected counts.

Conditional: if unexpected source/guide dependencies change the contract,
load the exact dependency before affected conclusions and inform CDC; do not
expand into unrelated audits. No source or research programs are authored, so
Rust/JS implementation guides and Lykn code-authoring chapters are not required.
If source implementation becomes necessary, stop and request a new assignment.

## Source census and inspection recipe

Use `rg`/`rg --files`, `git show`, bounded `sed`/`nl`, `cat` and existing CLI help.
All source citations identify `release/0.7.x@74a90d5`, repository-relative path,
symbol and verified line. Record observation/inference/decision/proposal classes.

1. Recheck `git worktree list`, both source/planning HEAD/branch/status, byte
   equality of governance, `deno --version`, `deno bundle --help`, `cargo --version`,
   and global `lykn --version` only (never use it to compile). Capture exact
   installed command availability. Help does not establish runtime behavior.
2. Follow default `Commands::Compile` dispatch to `cmd_compile` in
   `crates/lykn-cli/src/main.rs` (arguments near40–68, dispatch near184,
   function325–414); inspect `compile.rs` complete `compile_source_inner` and
   entry wrapper functions, especially resolver/classifier/analysis/emitter/
   native codegen. Find any alternate independently invocable bridge/JS route
   through complete matches in `crates/lykn-cli/src/{main,compile,bridge}.rs`
   and cross-compiler tests. State an alternate route as unverified if source
   cannot establish it; do not infer live authority from a stale docstring.
3. Inspect `project.json` in full and every `packages/*/deno.json` (derive the
   package count). Inspect `config.rs` `workspace_members`, `extract_npm_deps`,
   `read_effective_project_config_optional` and configuration data types;
   `dist.rs` `build_project`, `build_dist`, `rewrite_imports`, `stage_runtime`,
   `write_deno_json`, `write_package_json`, plus associated source tests found
   by search. Inspect complete `build_browser_bundle` in main.rs near1773.
   Search all `crates/lykn-cli/src`, `packages`, `project.json` and their tracked
   JSON manifests for `sideEffects`, npm:/node: and workspace/exports rules;
   report complete match population by category with exclusions (lockfiles are
   provenance inventories, not proof of live runtime imports). No project-wide
   dependency-graph reconstruction or internet survey is commissioned.
4. Explain whether `lib/` member iteration, local dependency resolution,
   import rewriting, JSR entrypoints and npm metadata have the same support.
   Important contrary case to check: generic `project_root.join(member)` can
   accept `./lib/json`, while prefix-based `./packages/` recognition can still
   miss its dependencies. The finding is source evidence, not proof a new
   library builds. Record existing npm output compatibility separately from
   the new library JSR/no-new-npm requirement; no ecosystem removal is approved.
5. Derive the original F ID set from Slice01 ledger, fixture filenames from its
   `fixtures/`, and original classifier/inventory coverage assumptions. Read
   fixture bodies only as needed to substantiate a concrete protocol mapping;
   do not claim full fixture validity or inventory completeness from filenames.
   Map **every F-1–F-12** in Findings: original meaning, retained evidence,
   stale/current prerequisite, next proof and next owner. No original row
   changes, no original prompt edits, no resetting budgets or history.

## Concrete Findings structure and proposed protocol

Use one durable Findings file with §§Intake, Baseline and source observations,
Policy and library/package boundaries, F-1–F-12 re-entry map, Next audit protocol,
Remaining decisions and limits. Local prose layout is discretionary; coverage is
binding. Connect findings to actual symbols and avoid prescribing conclusions.

The proposed protocol must give a recommended path, verified command surfaces,
inputs/output ownership, predeclared predictions, controls, observation methods,
stop conditions and explicit unresolved steps. Include at least these distinct
future claim groups and falsifying oracles (not executed now):

- No stdlib import: an application without stdlib references has no stdlib
  module bytes or transitive graph edge. Define exact module/input membership;
  a smaller byte count alone cannot establish zero payload.
- Selective entrypoint: a JSON-only import preserves its chosen functionality
  without pulling unrelated YAML modules. Define both membership and functional
  oracles, not only source grep or filename counts.
- Application shake: used exports stay live, unreachable pure declarations can
  drop, and effects/throwing initializers retain order/exactly-once behavior.
  Keep original nine families, partial-import app, live-emitter, full corpus,
  metadata, prediction/divergence/report obligations. Do not call arbitrary
  top-level calls pure or auto-select `sideEffects:false`/PURE annotations.
- Package preservation: separately inspect generated public export/subpath maps
  and consumer entrypoint availability before/after optimization. App-only DCE
  must not redefine a published package API. Do not prune packages by one app's
  imports. No package metadata is handwritten or published during research.

Deno 2.9.6 help exposes bundle/minify/platform/no-npm/no-remote/no-config,
but no documented explicit treeShaking flag or metafile in that help. Verify
this yourself. Recommend a no-new-npm route only within what source/help
supports. Label retention/runtime proof and missing metafile/ESTree-walker
capability unresolved where needed. Any change to original F-6 esbuild/metafile
or F-10 walker evidence needs CDC/Operator disposition in an amended Slice01
contract and a preserved next prompt before execution. This slice may recommend
that change; it cannot approve evidence equivalence. Never mark a gap 'done'
merely because a different tool can create a bundle.

Guidance application: Lykn Modules/Project Structure named ESM exports and
package-root source support selective entrypoints but do not prove tree shaking;
no-Node guide's npm/node escape hatches conflict with current stricter task
execution policy and must be held. Scientific-methods operational measures and
threats-to-validity separate source inspection, help, observed behavior and
future experiments. Framework evidence strength keeps this output attested
until CDC reproduces it; no higher-scale outcome inherits child completion.

## Checks, stop and return

Before commit run `git diff --check`; inspect all diffs and ensure only permitted
paths changed. Check all six LB rows have attested evidence, every original F ID
appears once in the mapping, every source locator resolves at the pinned SHA,
and none of the document's optimizer/runtime claims exceeds actual evidence.
Review the concrete false-positive risks above, package/member hardcoding and
pending Project07 outcomes. These are semantic review oracles, not a request to
write tests/validators for Markdown. No full source suite is needed or authorized.

If required input is absent, source drifts, evidence contradicts direction,
protocol needs a new dependency or source/experiment execution, stop affected
work and report exact evidence/decision/owner. No automatic inquiry extension.
Preserve significant failures and every unrun/unsupported claim explicitly.

Write `closing-report.md` with assignment identity, exact source/planning state,
per-LB evidence/limits, findings and bubble-up to the project (collapsed arc),
silent-drop check, outstanding owners and explicit proposed-done verdict.
Update ledger Evidence (attested), leave Status open for CDC; update only
assignment/intake status in slice-plan. Commit exact four paths with
`git commit --only -- <paths>` after inspecting staged changes; never blanket
add or sweep unrelated staging. Contiguous trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

Return prompt path, commit, source/planning statuses, checks and limits, all
unresolved decisions, and ownership to CDC. Do not author CDC verification or
retrospective; do not open the next slice or execute the original audit.
