# CDC verification — source iteration01 stopped, 2026-11-08

Reviewer `/root/cdc` (Sol6.1 High), separate from the Luna6 High implementation
actor, independently read the complete immutable test source, raw Git message,
parent, scope and digest. Source checkout
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/embedded-macro-dependencies`, clean commit
`d7c7c733214a85742dcb1bdb7a118ef57ec22979`, tree
`25bf3311064eb76d1ee07a1567be7d9675451579`, parent
`62e9531e6183b3762a9ff326fdc07439db33f31f`. Sole added
`crates/lykn-cli/tests/macro_dependencies.rs`, 521 lines, SHA-256
`f264eacc06384d6b075edf01d39b03c315eb8eedc00bb4f7b567246408f1b588`.
Normal commit and both contiguous trailers confirmed. Arc03 e2f and release
62e remain unchanged; release status clean.

**Blocking source finding.** In `compile_recorded` at lines 128–136 and the
M5 blocked-XDG test at 483–491, `let mut command = cli().current_dir(...).env(...).arg(...);`
binds a mutable reference returned by the setters. The local `cli()` helper
returns an owned `Command`; the setter chain does not return ownership. The
Rust 1.97 standard library `process.rs` signatures for `arg`, `env` and
`current_dir` each return `&mut Command`. The owned temporary drops at the
end of the initializer statement, before `record_command` and `output` use the
reference. The correctly owned setup in this same file's
`run_strict_recorded` is a concrete repair pattern. This is a source finding,
not an observed rustc diagnostic or an executed macro dependency condition.

**Verdict: stopped, not accepted.** All six rows in the [ledger](ledger.md)
remain open. Both contexts report no build, formatter, or behavioral launch;
baseline 0/6 compiles, 0/4 runtimes, 0/5 parent tests run. No repair, full Make,
citation gate or independent runtime trial. Original W8 and design review do
not fill these denominators. No new raw results to archive.

**Bounded re-entry proposal, not authority.** At the two affected locations
use `let mut command = cli();`, then a separate `command.current_dir(...)`
builder statement. Preserve the real command capture, child arguments,
fixtures and existing assertions. Only with Operator approval, issue the
preserved test-only correction01 (next source refinement, currently 0/5),
freeze and review it, then continue the original TDD baseline and repair
gates. No Arc03 composition, policy oracle edits or release action.

## Source iteration02 — candidate review stopped

Operator “Go for it” approved [iteration02](cc-prompt-iteration02.md), the first
source refinement. Same CC and independent CDC. Actual commit `a95817dc`
corrected exactly the two command sites. Separate `408405fc` is rustfmt-only
by full diff inspection. CC reported leaf formatter exit 0 and empty streams.
The tests-only file SHA-256 is
`2cb62e8ed07edb5a3b9bda91a9f44ee768d678809f2fd8bee7f6b3877b463c8b`.

[Byte-preserved CC baseline](artifacts/evidence/cc/baseline-408405fc/)
contains launch metadata and tool pins, no-run exit 0, one direct test
exit 101 (0 passed, 5 failed, 0 ignored or filtered), and all six compile
observations. CDC checked the raw outcomes and did not rerun this baseline.

| Condition | Observed legacy result |
| --- | --- |
| M1 | Exit 1, compiler import `astring` unresolved. |
| M2 | Exit 1, `astring` absent from dependencies and the supplied map. |
| M3 | Exit 1, compiler tried to import the caller alias's Lykn file as a JS/TS module. |
| M4 warmup and recovery | Both exit 1 on unresolved `astring`. The owned config was removed with lock present, and remained absent after the second compile. |
| M5 | Exit 101, materialization panicked with NotADirectory. |

No JS or declarations were observed. The four runtime children were
unlaunched. The empty JS/DTS receipt files are placeholders paired with the
false artifact flags. M2/M3 caller config bytes and mtimes match. Both caller locks
changed from the supplied package lock to a version-only object and their
mtimes moved off the epoch. CDC compared the raw bytes and CC explicitly
withdrew an inaccurate equality attestation. Only the fixture root was
checked for configs before launch. CDC's later exact path inspection found
no project.json, deno.json or deno.jsonc at the higher ancestors. This
corroborates the isolation setup after the fact. It cannot establish
contemporaneous higher-ancestor absence. The exact fixture and outcome
receipts establish meaningful old behavior with that limit. The explicit
M2/M3 configs and M5 owned path supply separate controls.

The evidence copy matched the source directory byte-for-byte by `diff -qr`.
The full planning diff check exited 2 for the original blank line at EOF
in `baseline.stdout:56`. Prose-only diff check exited 0. The raw stdout
bytes are preserved.

**Current stop.** Clean `codex/embedded-macro-dependencies` candidate
`7777cd718cf5f7799845bd49fa988cc281432377`, tree
`2de689bda24c23a04e5df0dea44913a7829a6813`, changed exactly the five
allowed paths from release base `62e9531e`. Static inspection found that
`crates/lykn-cli/tests/macro_dependencies.rs:168`–169 falls back to
`/opt/homebrew/bin/deno` when `LYKN_TEST_DENO` is unset. The repository's
Ubuntu jobs install Deno on PATH and run `make test` and workspace
`cargo test` without that override (`.github/workflows/ci.yml:30`–69).
Thus the four positive runtime cases depend on a host-specific path under
the ordinary runner. A local pin override would hide the defect. This is a
static compatibility finding. Candidate formatter/build/test/Make/cites and
independent execution all remain unrun. CC returned clean ownership.

All MR rows remain open. Proposed test-only refinement 02 of 5 changes
`OsString::from("/opt/homebrew/bin/deno")` to `OsString::from("deno")`.
It keeps the recorded explicit executable override and strict flags.
The baseline remains applicable because the runtime selector never ran.
After approval and review of the immutable change, resume the original
candidate gates with prospective exact ancestor checks. Release remains
at `62e9531e` and the Arc03 tests-only ref remains at `e2f2959`.
