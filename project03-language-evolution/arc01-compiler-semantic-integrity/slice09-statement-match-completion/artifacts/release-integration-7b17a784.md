# Local release integration of the first I2 delivery

The Operator authorized the exact local fast-forward and continuation
into native match-clause scope after release validation. Root performed
the fast-forward. Sol 6.1 High CDC independently verified and ran both
normal gates in `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`.

The release reflog records a fast-forward from `d73601a5` to
`7b17a7841cc4d749276467ec2bcec7ed9faed7b2`, tree
`da690cba4b3e2d35feec0ac5853f279ffa83e664`. The range contains 15
commits and changes 28 paths, including previously accepted I1,
NE-C14 and S09. Checkout and exact accepted-tree comparisons pass.

| Actual release gate | Result |
| --- | --- |
| Normal unfiltered `make check` | Exit 0. Build, Clippy, format, native workspace suites including 1,161 language-library tests, 1,480 Deno tests with 38 steps and 482 documentation cases. |
| Standalone `make check-cited-paths` | Exit 0, 64 current documents and 601 historical citations. |
| Actual post-build binaries | `bin/lykn` and `target/release/lykn` byte-identical at SHA-256 `9f227e9c7f3504776352f8f93ab76b03d22ccfe5f7ee6dcc04bdf42f44d219c6`. |
| Actual materialization | Both canonical JS modules match embedded and fresh Make-owned cache bytes. |

The [release receipts](evidence/release-7b17a784/) retain the
prospective launch lines, exact absent-name checks, tool pins, raw
streams and terminal statuses. The release gate used Rust/Cargo
1.97.0, Deno 2.9.6 on ordinary PATH, the established DENO_DIR and
distinct fresh TMPDIR, XDG and npm roots. The release tip is clean.
This adds release-checkout evidence to the previously independent
source acceptance. CV-04, CI-04 and the new clause-scope work remain
separate.

The planning prose diff check passes. The full staged archive check
reports the retained Make stdout's blank EOF line. The raw bytes
remain unchanged.
