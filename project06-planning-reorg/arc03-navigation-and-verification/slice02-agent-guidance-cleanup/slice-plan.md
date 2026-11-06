# Slice02 — Portable agent guidance

Status: open. Parent: Arc03 navigation/governance follow-through. Current
assignment: cc-prompt-iteration01.md (placement correction). This is the existing project's bounded maintenance
increment, not a new project or historical migration/acceptance reset.

## Authority and endpoint

2026-11-05 Operator chose installed rust-guidelines and requested removal of
the obsolete ai directory, canonical AGENTS.md rewritten for agents generally,
and CLAUDE.md as a symlink to AGENTS.md. The latter arrangement already exists;
preserve it. The unique Lykn reference is retained under docs/skills/lykn/SKILL.md.
Installed named skills replace personal absolute-path dependencies.

Same Autonomous roles/settings: CDC Sol 6.1 High designs/reviews; CC Luna 6 High
implements. Root coordinates read-only lookups. Endpoint is actual cleanup of
all seven current worktrees, independent verification, bubble-up/retrospective.
Compiler NE-C01 remains held during this prerequisite. After cleanup acceptance,
revalidate guidance/source identities before resuming the separately approved
compiler repair and unchanged controls; no extra permission question is implied.
This slice itself authors no compiler/library/test implementation.

## Homes, ownership and exact scope

Planning opens clean at 5f19a3bb888e69e541e37334eceb5acd43efdaf0. Source tips:
main 12afe1c7c7c8acaabce5b7b75e0df19f3b3fb6ec; release/0.6.x
4dded883bbd321d19635e6fce233343f33803f9e; release/0.7.x
74a90d51b853fc18fe2b7c6ee07417736e1ce464; release/0.8.x
0f3c28ce78f127ec122334c22fd15b8b433905b7. Both task branches
codex/native-esbuild-controls and codex/contract-predicate-lowering are clean
at 74a90d5. Homes are main repository root and .worktrees/{0.6.x,0.7.x,0.8.x,
native-esbuild-controls,contract-predicate-lowering,planning}. Prunable temporary
worktree registrations are not live cleanup targets. Inspect drift before edits.

Operator's explicit guidance cleanup permits companion governance/doc edits on
these existing branches, including main, as a limited exception to ordinary
task-branch product authoring. No branch merge/rebase, source propagation,
push/publication, installation, dependency/toolchain update or remote CI.
One explicit local cleanup commit per worktree; do not cherry-pick source
history across branches. Both co-author trailers remain contiguous.

Six source worktrees may change only AGENTS.md, CLAUDE.md if necessary,
.gitignore's obsolete /assets/ai rule, README.md's reference, the two relevant
docs/philosophy.md references, assets/ai/SKILL.md -> docs/skills/lykn/SKILL.md,
and the four tracked obsolete external symlinks. Main also has five known
ignored untracked external links: AI-CONSTITUTION-SUPPLEMENT.md,
AI-ENGINEERING-METHODOLOGY.md, deno, js, rust. Inventory with lstat; unlink only
the link entries, never traverse/delete their targets. Preserve unexpected data
and report it before affected deletion; rmdir only the empty obsolete directory.
Planning changes AGENTS.md/CLAUDE.md plus this slice's four CC output paths
(artifacts/results.md, closing-report.md, ledger.md, slice-plan.md).
CDC owns parent plans/review/retrospective; all index mutation is sequential.

## Binding construction and preservation

AGENTS.md must be one byte-identical, agent-neutral guidance document across
all seven homes. Retain substantive governance: source/planning branch homes,
never merge planning to source, inspect local changes and release divergence,
normal source propagation 0.6 -> 0.7 -> 0.8 without implied integration/push,
per-scale plans/ledgers and preserved prompts/evidence, original human gates,
both trailers, explicit publication/push authority, no automatic bypass flags,
review snapshots rather than auto-accepting, tests scoped to test/ and canonical
make check for implementation work. Preserve location-independent test rules.

Replace obsolete host references with installed skill names: rust-guidelines,
javascript-deno-guidelines, testing, collaboration-framework (and its routed
code-auditing/work-verification/agent-coordination components as relevant).
Resolve through the session's skill catalog; no personal absolute paths or new
external symlinks. Lykn guidance is source-worktree docs/skills/lykn/SKILL.md and
docs/guides/09-anti-patterns.md, under docs/philosophy.md. On planning, source
references refer explicitly to the assigned source worktree/branch, not a
nonexistent planning docs tree. Missing required skills are disclosed and a
supported substitute resolved; do not recreate obsolete paths automatically.

Correct architecture from source: three Rust crates (lykn-lang native pipeline,
lykn-cli orchestration, lykn umbrella), JS compiler/browser path still exists;
zero mandatory emitted runtime is not absence of existing compiler dependencies.
Lykn is source-first with ADTs/contracts; kernel JS is implementation detail,
research tooling prefers Lykn, compiled JS stays in ignored target artifacts.
Existing npm-resolved compiler inputs are not authority to add npm/Node research
dependencies. Preserve ADT, guide/book and explicit human acceptance obligations
in their owning plans. Approved lib/opt-in JSR/selective-entrypoint/effect/API
direction is future direction, not an implemented stdlib or licence/publication
approval. Current commands use lykn build for build, lykn dist for
target/lykn/dist staging; build --dist is deprecated, not the preferred path.
Contributors may use repository Cargo/Deno/Make gates; normal Lykn users use
lykn commands. Do not turn documentation cleanup into unrequested publication.

Each main SKILL original blob is 0205e6ea0457c0099f1dec0a36fc62b363cbaa9d;
the other five source homes use 241bc4d8ce5dfff153edec2462e012849e96b2ad.
Move each worktree's own bytes first and record exact checkpoint blob equality.
Then change only its one stale DD49 citation to the branch-qualified canonical
planning URL for project01-mvp/arc12-identifier-mapping/artifacts/design/06-final/
0049-identifier-mapping-lykn-js.md. Final SKILL is NOT byte-identical: its sole
approved content delta is this citation. Keep all other version differences.
Update README's link and philosophy's reference; its audit grep must scan both
docs/guides/ and docs/skills/lykn/SKILL.md, retaining the old guide/reference scope.
Frozen scripts/cited-paths-census.tsv and all historical plans/prompts stay intact.

The source reference was not previously in the executable doctest population.
Keep it outside docs/guides/: Makefile test-docs selects that directory, README
and the two example trees. Moving it into docs/skills/lykn preserves that role
and selected population. Source blob241bc4 has a static grouped-bind example /
expected-JS mismatch (GC-D01), routed to Project07 Arc03 guide consistency;
do not fix example semantics, annotate skip, or alter tests in this cleanup.

## Verification and close

Before mutation capture each opening tip, status, tracked modes/blobs and link
inventory. Confirm no code/include consumer depends on old paths using tracked
source queries, not recursive .worktrees scanning or historical archives. Record
query population/errors; git grep avoids dereferencing broken tracked symlinks.
Commit explicit paths before the citation gate, which resolves HEAD. Run native
make check-cited-paths in each of six source worktrees; no full make check for
this documentation/governance-only change. Do not modify the checker/census to
hide failure. Planning has no source Makefile; inspect its branch-qualified
references and shared guidance equality instead of pretending it ran a source gate.

Check CLAUDE mode120000 and literal relative target AGENTS.md in each Git tree;
AGENTS regular mode and byte equality across seven; original Skill checkpoint
and exact final citation-only diff per branch; absent obsolete directory and
tracked entries; current links valid and no active obsolete guidance references;
all source diffs restricted to named governance/docs paths and no code/lock/test
change. Preserve failed commands, unknowns and previous compiler/pilot stop.
No large archive or new validator/helper is needed. CC reports rows attested/
open; CDC independently reproduces checks and commits review/retrospective.

## Assignment history

- cc-prompt.md: initial issued assignment; pre-edit intake only, no mutation.
- cc-prompt-iteration01.md: current bounded placement correction before moves;
  unchanged inventory/framework/source receipts retained. No scope/quality waiver.
