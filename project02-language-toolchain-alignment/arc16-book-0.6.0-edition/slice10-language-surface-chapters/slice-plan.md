# arc16 slice10 - Language Surface Chapters

Status: **Open**
Opened: 2026-09-12

## Capability

Refresh the Lykn Book language/compiler chapters so the taught language surface matches current 0.6.x behavior after the implementation runway and slice08 JS parity fix. The slice covers examples and prose for identifier mapping, surface-vs-kernel forms, position-aware forms, exported definitions, grouped local bindings, `cond`, functions/closures, records/single-constructor types, destructuring, classes, generators, equality, and expected diagnostics/output where those appear in language-facing chapters.

## Scope

Use the slice07 current-book drift inventory as the source of remaining language-facing failures and stale claims. At minimum, triage and fix or route:

- kernel-only examples compiled as ordinary surface examples;
- intentional compile-error examples that need explicit skip/expected-error treatment;
- placeholder or non-Lykn examples compiled as Lykn;
- stale surface/library examples from pre-0.6.0 syntax;
- reader/compiler expected-output drift;
- slice07 language-surface inventory rows including B2-F, B2-G, B2-I, B2-J, and the B3 language/compiler chapter follow-ups.

## Out of scope

- Toolchain, testing, project-structure, CI, build/dist/publish, and source-ownership chapter work already closed in slice09.
- Whole-book final build/link/voice/metadata close; slice11 owns the edition close and release gate.
- New compiler implementation except when a fresh defect is discovered and must be registered and routed instead of normalized in prose.
- GitHub Linguist / `lykn` fence migration unless the operator changes the release boundary.

## Inputs

Read before editing:

- `../arc-plan.md`;
- this slice plan, `ledger.md`, and `cc-prompt.md`;
- `../slice07-current-book-drift-refresh/artifacts/current-book-drift-inventory-2026-09.md`;
- `../slice08-js-fn-return-parity/closing-report.md` and `../slice08-js-fn-return-parity/cdc-verification.md`;
- `../slice09-toolchain-and-project-structure-chapters/closing-report.md`;
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/AGENTS.md`;
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`;
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` and authoring guidance;
- current release/0.6.x source guides for the language forms touched by the slice.

## Verification

At close, run the focused book fence gate from `/Users/oubiwann/lab/cnbb/lykn` for every touched language/compiler chapter:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched chapter> --fence lisp
```

Use repeated `--docs` arguments for multiple chapters. Record generated, skipped, passed, and failed counts. If source code or source docs change, run the appropriate source gates in release/0.6.x. Preserve the book repo's pre-existing `_to_delete/` scratch directory and remove generated doctest `target/` unless intentionally tracked.

## Close conditions

- Every touched chapter is named in the closing report.
- Every visible language-surface book failure in scope is fixed, explicitly skipped with a correct reason, or routed to a named implementation/design home.
- The focused book doctest gate passes for touched chapters or remaining failures have named dispositions.
- Planning surfaces and status dashboards reflect the final slice disposition and the next slice.
