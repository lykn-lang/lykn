# Independent planning review

2026-11-07. Reviewer: `/root/cdc/compiler_integrity_plan_review`, fresh OpenAI
Sol 6.1 High context, separate from planning author `/root/cdc` (Sol 6.1 High).
Root coordinated read-only. This report reviews the fixed planning candidate
`17182cb6eb1b329ed8679b2f425366e5b7938183`; it does not review a later amendment.

**Verdict: adequate proposed engineering roadmap for Operator design review;
no material planning correction required.** This accepts planning adequacy only.
It does not approve architecture, a public API break, release policy, execution,
arc closure or any software/tooling capability. Every CI ledger row remains open.

## Actual review and evidence limits

Read the complete Arc01 `arc-plan.md`, `ledger.md` and
`compiler-integrity-design.md`; current affected parent project-plan/ledger/README
additions; BACKLOG current routing and original NE-C01–12, NE-T01–02, NE-D01–02
and A6 sections; and complete Slice19 closing report, independent verification
and retrospective, including retained historical failures and budget states.
Read planning AGENTS and the installed collaboration-framework/project-management
entrypoints, PM wayfinder/canonical-layout/top-down guides and work-verification
evidence-strength/independence guides. Read the Rust guidance entrypoint for the
bounded source/API assessment.

Live native Git reads confirmed planning HEAD above, accepted task
`codex/match-subject-values@8ed869f1ed24bf688ba91f71d8c539680136794e` in
`.worktrees/contract-predicate-lowering`, and separate release/0.6.x
`5408abd432b8789ae474a3895436f68818c4e482` in `.worktrees/0.6.x`.
Planning and task status were clean before this report.

Targeted source inspection at task8ed covered `crates/lykn-lang/src/`
classifier/forms.rs numeric-for roles, emitter/forms.rs profiles/context/failure
paths, emitter/context.rs, emitter/mod.rs public signatures, error.rs, the raw
nested fields in ast/surface.rs and codegen/emit.rs numeric-for printing;
`crates/lykn-cli/src/compile.rs`, dist.rs and main.rs compile-output handling;
public module exposure and repository emitter callers; and public JS exports and
expression-if rejection in `packages/lang/`. These reads substantiate the stated
source boundaries: the fixed positional for profile, Err-to-raw fallback,
infallible public Vec/String APIs, existing Codegen diagnostic carrier, three
production emit callers, compile/dist frontend distinction and sequential output
writes. Dist parity remains an unexecuted policy risk, not a reproduced defect.

This is independent document/source inspection. Prior executed acceptance and
NE-C12 observations are retained from the original
[Slice19 verification](../../slice19-match-subject-and-walker/cdc-verification.md),
[close](../../slice19-match-subject-and-walker/closing-report.md) and
[retrospective](../../slice19-match-subject-and-walker/cdc-retrospective.md);
they were **not replayed here**. No build, test, experiment, parser/K run,
acquisition, implementation prompt, source edit or external action occurred.

## Assessment and follow-through

- The complete finding map preserves accepted C01/03/07–11 as regression inputs,
  correctly keeps C10/11 task-only, and separates historical/current applicability,
  source-only concerns and actual observations. C04/T01/T02 have concrete adjacent
  outcome owners and re-entry conditions without becoming assumed K dependencies.
- S01 delivers the narrow useful numeric-for correction independently of S02's
  consequential error/API migration. The eight units compose coherently; they are
  roadmap scopes, with detailed source-ready sizing and consequential decisions
  required before executable assignments. They do not authorize an AST rewrite.
- The shared contract explicitly preserves Statement/Value/Tail, resolved heads,
  syntax/pattern/binding containers, normalized operand order, function-local
  contexts, async/final values and existing regressions. Structured compiler
  failure is distinguished from user text and intentional runtime assertions.
  Incremental roles and A6 are compared without confusing compiler AST typing
  with public ADT membership policy.
- S02 requires the public Rust compatibility choice before code, inventories
  callers and JS behavior, and bounds artifact protection to the failing unit's
  compiler failures. Additive legacy behavior cannot silently inherit a universal
  fail-closed claim. Dist frontend policy and I/O transaction limits are explicit.
- S07/S08 are real close gates: task8ed-to-final and release5408-to-candidate or
  separately authorized integration ranges expose inherited unmerged C10/11;
  compatibility, audiences, guides, LLM reference, API/release docs, separate book
  and explicit no-change results are required. Required book/human work cannot be
  closed by source tests, and the final audit cannot postpone breaking choices.
- K remains 0/13, final tooling unaccepted and eight tooling passes spent. Prior
  failures and original F1–F12/Project07 obligations survive. Plan review grants
  no implementation, integration, release or renewed tooling allowance.

Two nonblocking source-citation precision edits were announced by the author
after the candidate froze: expand native/CLI path prefixes, and attribute
variadic-body evidence explicitly to classifier/printer rather than to Guide00
alone. They improve traceability without changing this design assessment; they
are not part of the reviewed fixed tip. No governing document was edited by the
reviewer. CDC retains all index/commit ownership and Operator decision follow-up.
