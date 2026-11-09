# Source refinement 01 of 5 — own both regression commands

Operator “Go for it” approves the test correction in the stopped
[review](cdc-verification.md) and continuation of
[iteration01](cc-prompt-iteration01.md). Same Luna6 High CC, separate Sol6.1
High CDC, Autonomous Mode. Stop on the next unexpected substantive failure or
real evidence gap. This is the first source refinement. Earlier budgets and
findings stay recorded.

Reuse the completed iteration01 intake. Read this assignment and the exact
commit-message file below. Verify clean `codex/embedded-macro-dependencies` at
`d7c7c733214a85742dcb1bdb7a118ef57ec22979` in the same task checkout.
CDC explicitly hands off source/index/build/raw ownership before edits.

Edit only `crates/lykn-cli/tests/macro_dependencies.rs`. In
`compile_recorded` (line 128 in d7c7c733) and
`m5_blocked_xdg_materialization_returns_io_error_without_output` (line 483),
replace the borrowed initializer with an owned `let mut command = cli();`
and a separate `command.current_dir(...)` setter chain. Preserve every
argument, fixture, predicate, capture and observation. The existing
`run_strict_recorded` owns its command using this pattern.

Use [the fixed message](artifacts/commit-messages/command-ownership.txt) via
`git commit --only -F <absolute-file> -- <exact-path>` and return the actual
raw Git message, immutable commit, path diff, and clean status. Hold all
formatter/build/test launches until CDC reviews the two changes. If the
iteration01 mechanical leaf-format step is used, preserve the prior Git
body and exact formatter evidence, commit separately with the supplied
format message, and hold the final body for review before builds.

After CDC releases the final test body, resume the original five-condition
baseline under the existing gates and report all six compile observations
and four runtime dispositions. The source-grounded old reds from iteration01
are expected. Hold production until the baseline is reconciled. Continue the
approved five-path implementation and independent acceptance if green at
each remaining gate. Preserve all earlier bodies and results. Arc03
composition and release integration are outside this assignment.

Use the inherited language boundary. Authored research and orchestration
logic uses Lykn. No Python execution or exceptions, no substitute scripts,
new dependencies, or gate bypasses.
