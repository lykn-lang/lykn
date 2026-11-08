# Slice21 CC close report — proposed evidence

CC: OpenAI gpt-6-luna High, Autonomous Mode. Source remains the independently
accepted `c9e0d7e5a6faa437e1dece7d0adf9ce06a67b5a1`; this report records only the
authorized local `release/0.6.x` integration and its fresh validation. CDC
independent acceptance and planning closure remain pending.

## Exact integration and validation

The clean release pointer advanced by the authorized `git merge --ff-only`
from `8f5d1990df86405656729972485ae4d11feba808` to
`c9e0d7e5a6faa437e1dece7d0adf9ce06a67b5a1`, tree
`f19702c863e74d672c2e471e148eab21daad591e`. The source task checkout stayed
clean at that same commit; ancestry is 9/9 and the exact delta is the 14 paths
listed in the slice plan. No other worktree tip changed. The common Git hooks
directory contains only samples and `core.hooksPath` is unset. Workflow review
found CI on pushes to `main`/`release/*` and PRs to `main`; Deno compatibility
has manual/PR/scheduled triggers; consumer smoke is manual only. No hosted action
was triggered.

Fresh unfiltered `make check` from the release checkout exited 0 under Rust and
Cargo 1.97.0, fixed Deno 2.9.6 (`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`),
fresh npm/XDG/TMP roots, fixed existing `DENO_DIR`, and no Cargo offline/target
override. Dependency, committed citation, release build, Clippy, format, syntax,
Lykn lint, Rust, full corpus and docs stages passed. Corpus: 1470 passed across
11 steps, zero failed. Docs: 482 passed, zero failed. The standalone committed
HEAD `make check-cited-paths` also exited 0 (63 documents, 601 historical
citations).

After the final Make build, direct runs used only the existing release-built
executables, with no intervening build: `emission_results` 6/6;
`emission_failures` 4/4 (ten predicate mutations, four invalid routes, and
four valid runtime observations); checked numeric-for header 1 test/3 slots;
validation priority 1 test/five successive suffixes; contract integration 1
test/17 observations. Release `bin/lykn` byte-matches `target/release/lykn`.
Actual release/debug/test executable and Deno hashes before and after direct use
are retained in the raw evidence.

The four complete successful generated modules are retained and were read.
Bound `dissoc` remains an ordinary call in CLI/package outputs; both strict
children exit 0 with stdout `"kept"\n` and empty stderr. Literal
`COMPILE_ERROR` text and the intentional `TypeError` remain program behavior in
CLI/package outputs (exit 1 with the expected user message). Optional DTS is
absent for these non-exporting controls. All four invalid routes reject before
new/overwritten outputs; pre-existing JS/DTS bytes remain identical, and package
sentinels stayed at epoch mtimes while the source was newer. Invalid-source
generated output was not executed.

Raw Make/citation streams, focused streams and statuses, exact generated modules,
strict runtime child receipts, file preimages/mtimes, command details and before/
after producer pins are under `artifacts/evidence/cc/attempt01/`. Raw ANSI and
whitespace are preserved.

## Proposed row walk and handoff

| ID | CC disposition | Evidence and remaining gate |
| --- | --- | --- |
| RI-01 | Proposed done | Exact clean 8f→c9 FF, 9/9 ancestry, tree and 14-path delta; task/other worktree refs unchanged. CDC must independently inspect. |
| RI-02 | Proposed done | Fresh full normal Make, direct existing-built focused tests, standalone citations and actual producer pins retained. CDC must separately reproduce. |
| RI-03 | Proposed done | Four invalid routes, four valid route runtimes, ten predicate controls, complete modules, optional DTS absence and stale-file preservation retained. CDC must separately inspect/reproduce. |
| RI-04 | Pending independent CDC | No CC result can close the distinct review/reproduction criterion. CDC owns fresh independent release Make/focused/runtime/citation replay. |
| RI-05 | Pending CDC reconciliation | CC report/raw evidence and source/API impact limits are recorded. CDC owns final row walk, retrospective, parent pointers and the S03 readiness handoff. |

No source edits, repair, retry, rollback, dependency/toolchain change, push,
publication, remote CI, additional branch propagation, new test, S03 source work,
or S04/K/walker work occurred. S02 remains accepted at c9; shared correction03/5,
old tooling8/K0/13 and the original project obligations are unchanged. Release
composition alone does not establish public/API/book/human acceptance or
universal compiler correctness. Release pointer and ignored build outputs return
cleanly to CDC for its distinct review.
