# arc16 slice02 - Dogfood Implementation Runway

## Goal

Run another from-scratch Lykn project dogfood pass before any book prose starts,
then use the result to route implementation work for the current 0.6.0 language,
CLI, scaffold, and package-surface decisions.

This slice exists because the book must teach the language we actually ship,
not the language we wish the prose could assume. The dogfood pass should reveal
which pre-book findings are truly blocking implementation work and which can be
settled as documentation or future-version decisions.

## Scope

In scope:

- Have CC read the current Lykn authoring substrate: `assets/ai/SKILL.md`, the
  relevant `docs/guides/` files, `AGENTS.md`, and the arc16 slice01 close
  packet.
- Have CC create a non-trivial from-scratch Lykn project outside tracked source
  trees, using current `./bin/lykn` workflows.
- Require the project to build, test, lint, and run where the current toolchain
  supports those operations.
- Require CC to self-grade the resulting project against the Lykn SKILL and
  guides, with concrete code examples.
- Require CC to identify any language, CLI, scaffold, package, or guide defects
  revealed by the dogfood pass.
- Route findings against `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`,
  `D-2608-COND`, and `D-2608-SOWN`, plus any new discoveries that deserve a
  durable row.
- Produce a report for CDC review.

Out of scope:

- Editing the Lykn compiler, CLI, scaffold, guides, book repo, or writers-guide
  repo in this slice.
- Starting book chapter prose or writer-guide instruction rewrites.
- Treating CC's dogfood project as a committed artifact. The project is scratch
  evidence; the durable artifact is the report and routed findings.
- Deciding all syntax questions by fiat. CC may recommend, but the operator
  decides the 0.6.0 surface.

## Required Project Shape

CC should choose a utility-library style project that naturally exercises:

- modules and public API boundaries;
- exports and package entrypoints;
- several derived local bindings;
- ordered validation/error construction;
- arrays/objects/records or tagged results;
- a small test suite;
- at least one command or example that can be run end to end.

Avoid toy arithmetic and one-function examples. The project should be small
enough to finish in one CC context, but rich enough to make awkward syntax show
up without being forced.

## Verification

Minimum checks for this planning slice in the lang repo:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

Minimum checks CC should run for the scratch dogfood project:

- project creation command transcript;
- `./bin/lykn build`;
- `./bin/lykn test`;
- `./bin/lykn lint`;
- one run/demo command, if the current project shape supports it.

If any dogfood check cannot run because the current toolchain lacks the
capability or emits an implementation defect, CC must record the exact command,
exit status, error output, and recommended routing.

## Exit Criteria

- The slice ledger is closed row by row.
- The closing report contains the scratch project summary, command transcript,
  self-grade, defects/findings, and routing recommendations.
- The report explicitly states whether the next work should be:
  - a compiler/language implementation slice;
  - a CLI/scaffold/package implementation slice;
  - another dogfood iteration;
  - or a book/writers-guide slice.
- No book prose starts before all accepted 0.6.0 implementation work is closed
  or explicitly deferred with a re-entry condition.
