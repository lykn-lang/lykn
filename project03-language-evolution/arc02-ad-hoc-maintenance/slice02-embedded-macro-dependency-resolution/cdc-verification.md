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
