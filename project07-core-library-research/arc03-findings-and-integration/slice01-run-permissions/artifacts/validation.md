# Run-permission validation

Date: 2026-09-12 UTC. CC attested/proposed-done; all six ledger rows remain
open pending independent CDC review. Source `release/0.6.x` commit
`d0bb981dae2a4abf6c984406c4b2081a45cc92f8`. Exact executable identity: [RP-B01](build-receipt.md).

## References and isolation

Read the source AGENTS.md and the installed collaboration-framework,
project-management (including its guides README/Expedited Mode),
work-verification, testing and Rust guidelines. `assets/ai/rust` was verified
absent, including as a symlink; the operator explicitly authorized the installed
`/Users/oubiwann/.codex/skills/rust-guidelines/SKILL.md` substitute. Consulted
Rust anti-patterns, core idioms, error handling, CLI argument parsing and CLI
testing guidance; source `assets/ai/SKILL.md`, Lykn core idioms/anti-patterns,
and the two runtime/CLI guides for fixture authoring. No repository skill path
was silently repaired or governance file edited.

Tests live at source-commit path `crates/lykn-cli/tests/run_permissions.rs`.
They invoke the compiled CLI as a process; the fake child records NUL-delimited
argv, and separate tests invoke actual Deno. TempDir roots have spaces, isolated
CWD/HOME/TMPDIR/DENO_DIR, cleared inherited environment except PATH and explicit
fixture settings, null stdin, and no network imports. All program fixtures are
Lykn strings; the JS route uses compiler output. The shell recorder is only a
child-boundary harness. No generated program code was repaired or replaced.

The integration harness is Unix-only and was run on macOS/aarch64. Deno absence
fails these tests on Unix rather than being skipped. No Windows acceptance or
interactive TTY-prompt acceptance is claimed. Runtime enforcement here covers
file read/write; other permission names have argv coverage, not an FFI/network/
subprocess security certification. Package graph/offline completeness remains
Arc01/Slice04. The separate test runner's implicit grants remain Arc03/Slice02.

## Contract coverage

| Evidence | Coverage |
| --- | --- |
| `all_routes_have_no_implicit_grants_and_preserve_build_paths` | Standalone under project, workspace, generated JS and no-project fallback; exact child argv has no grants; expected emitted file exists |
| `every_permission_supports_bare_scoped_repeated_and_explicit_empty_values` | All 16 permission options; bare, scoped, repeated, spaces/commas, empty value, mixed bare/scoped in either order |
| `runtime_options_and_child_exit_are_preserved_on_all_routes` | Both all-access spellings; no-prompt/cached/frozen true/false placement; exit 37 and stderr; spaces, empty and shell-looking script strings |
| `flags_after_file_are_script_args_with_or_without_separator` | Recognized, unknown and help-looking flags after FILE; optional initial separator and later literal separator |
| `invalid_options_are_rejected_before_launch_and_bare_flags_do_not_eat_file` | Unknown option, malformed frozen value, invalid boolean value, missing FILE; usage exit 2; bare permission leaves FILE positional |
| `effective_config_overlay_is_used_with_runtime_controls` | Workspace effective config path and absolutized local import; cached/frozen options before program |
| `real_deno_enforces_read_and_write_scopes_on_all_routes` | Three routes × two operations; no-grant denial, scoped success, outside-scope denial, deny override in either input order, program-argument grant attempts denied, output content/absence checked |
| `real_deno_repeated_scopes_and_bare_mixture_match_native_semantics` | Two allowed roots, third denied; bare/scoped mixture stays scoped; bare-only succeeds; empty scope fails in Deno |
| `real_deno_receives_script_flags_and_nonzero_exit` | Actual program sees exact argument array and exits 23; cached/frozen controls accepted |
| `filename_starting_with_hyphen_is_not_a_runtime_option` | Filename selected through -- is protected by the child -- boundary |
| `help_lists_the_explicit_contract` | Usage and all 20 long options exposed |

Scope values require equals. Forwarding groups options by category and emits
repeated scopes individually; a bare occurrence mixed with scopes normalizes
to those scopes, matching inspected Deno 2.7.7 behavior. Explicit `=`, unlike
a bare flag, remains `=` and Deno rejects it. No unknown-option passthrough,
shell interpolation, synthesized permission grants, or dependency was added.

## Commands and results

CWD for every gate: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`.
`make help` was inspected before validation.

1. Initial `cargo test -p lykn-cli --test run_permissions`: 10 pass, 1 fail.
   The config assertion compared raw strings: existing output retained
   `/./local.js`, expected string did not. Corrected the test to compare Path
   values and removed an unused import; config implementation was unchanged.
2. Repeated targeted command: 11 pass, 0 fail.
3. Initial `make check`: dependency and cited-path gates plus release build
   passed; Clippy rejected a 416-byte command enum variant versus a 121-byte
   next-largest variant. Boxed `RunArgs`; no lint suppression or weaker gate.
4. Final targeted command: 11 pass, 0 fail, 0 ignored (output below).
5. Final `make check`: exit 0; 1,502 Rust tests across 23 harness summaries,
   1,465 JavaScript/Lykn suite tests and 482 documentation tests; no failures
   or ignored Rust tests. Includes Clippy, formatting, source lint/syntax,
   dependency and cited-path checks. No separate doc rerun or snapshot acceptance.
6. After source commit, `cargo build --release --locked`: exit 0;
   `make check-cited-paths`: exit 0 against committed HEAD; 63 documents and
   unchanged 601-entry historical citation census. Executable hashes reconciled.

Two failed verification rounds were corrected within scope; the five-failure
re-slice threshold was not reached. No gate remains unavailable.

```text
   Compiling lykn-cli v0.6.0-dev (/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/crates/lykn-cli)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.52s
     Running tests/run_permissions.rs (target/debug/deps/run_permissions-f5e5aa78125d398e)

running 11 tests
test help_lists_the_explicit_contract ... ok
test real_deno_receives_script_flags_and_nonzero_exit ... ok
test filename_starting_with_hyphen_is_not_a_runtime_option ... ok
test real_deno_repeated_scopes_and_bare_mixture_match_native_semantics ... ok
test flags_after_file_are_script_args_with_or_without_separator ... ok
test effective_config_overlay_is_used_with_runtime_controls ... ok
test invalid_options_are_rejected_before_launch_and_bare_flags_do_not_eat_file ... ok
test every_permission_supports_bare_scoped_repeated_and_explicit_empty_values ... ok
test runtime_options_and_child_exit_are_preserved_on_all_routes ... ok
test all_routes_have_no_implicit_grants_and_preserve_build_paths ... ok
test real_deno_enforces_read_and_write_scopes_on_all_routes ... ok

test result: ok. 11 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.62s

```

Final canonical gate result lines (full routine per-test output omitted):

```text
✓ All dependencies up to date
✓ Cited-path check passed (63 documents on release/0.6.x; 601 historical citations accepted via scripts/cited-paths-census.tsv)
✓ Release build complete
✓ Clippy passed
✓ Format check passed
✓ lykn syntax check passed
✓ lykn lint passed
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 98 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.09s
test result: ok. 176 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.27s
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.34s
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.48s
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.82s
test result: ok. 11 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.39s
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.45s
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s
test result: ok. 1115 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.40s
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.17s
test result: ok. 18 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s
test result: ok. 25 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.50s
test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
✓ Rust tests passed
ok | 1465 passed | 0 failed (10s)
✓ Test suite passed
ok | 482 passed | 0 failed (936ms)
✓ Documentation tests passed
✓ All checks passed (build + lint + test)
```

Post-commit cited-path output:

```text
Checking cited paths resolve in git...
✓ Cited-path check passed (63 documents on release/0.6.x; 601 historical citations accepted via scripts/cited-paths-census.tsv)
```

## Revised child captures

The same isolated recorder/root as [reproduction.md](reproduction.md), now
using the corrected release executable. Grouping options changes their order
without expanding scope; the child `--` protects the program boundary.

```text
command: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run standalone.lykn -- --allow-all
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<-->
</private/tmp/lykn-rp-original-c3j02gl6/target/lykn/run/standalone.js>
<--allow-all>


command: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --no-prompt --allow-read=./data --allow-write=./output --cached-only --frozen=false standalone.lykn -- --allow-all
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<--allow-read=./data>
<--allow-write=./output>
<--no-prompt>
<--cached-only>
<--frozen=false>
<-->
</private/tmp/lykn-rp-original-c3j02gl6/target/lykn/run/standalone.js>
<--allow-all>


command: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run packages/demo/main.lykn -- --allow-all
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<-->
</private/tmp/lykn-rp-original-c3j02gl6/target/lykn/build/demo/main.js>
<--allow-all>


command: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --no-prompt --allow-read=./data --allow-write=./output --cached-only --frozen=false packages/demo/main.lykn -- --allow-all
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<--allow-read=./data>
<--allow-write=./output>
<--no-prompt>
<--cached-only>
<--frozen=false>
<-->
</private/tmp/lykn-rp-original-c3j02gl6/target/lykn/build/demo/main.js>
<--allow-all>


command: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run generated.js -- --allow-all
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<-->
<generated.js>
<--allow-all>


command: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --no-prompt --allow-read=./data --allow-write=./output --cached-only --frozen=false generated.js -- --allow-all
exit=0
<run>
<--config>
</private/tmp/lykn-rp-original-c3j02gl6/project.json>
<--allow-read=./data>
<--allow-write=./output>
<--no-prompt>
<--cached-only>
<--frozen=false>
<-->
<generated.js>
<--allow-all>


```

## Receipt-executable enforcement smoke

After source commit, ran these six controls against the exact executable in
RP-B01. CWD is the recorded disposable root; environment is isolated as above.
`project.json` contains `{}`. `allowed/input.txt` contains `receipt input` and
`outside/input.txt` contains `outside input`. Source programs:

```lykn
;; read.lykn
(console:log (Deno:read-text-file-sync (get Deno:args 0)))
;; write.lykn
(Deno:write-text-file-sync (get Deno:args 0) "receipt output")
```

Each `argv` JSON array below is one process invocation, preserving spaces.
On success, `allowed/output.txt` equaled `receipt output`; after denied runs,
`outside/output.txt` did not exist. Complete captured process outputs:

```json
{
  "binary_sha256": "5efc8299cc005e977c4d33304f3c9f7062bc4eeb0038c93136a95dccdbaceb86",
  "root": "/private/tmp/lykn receipt smoke 90xen7ay",
  "runs": [
    {
      "case": "read no grant",
      "argv": [
        "/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn",
        "run",
        "--no-prompt",
        "read.lykn",
        "/private/tmp/lykn receipt smoke 90xen7ay/allowed/input.txt"
      ],
      "exit": 1,
      "stdout": "",
      "stderr": "error: Uncaught (in promise) NotCapable: Requires read access to \"/private/tmp/lykn receipt smoke 90xen7ay/allowed/input.txt\", run again with the --allow-read flag\nconsole.log(Deno.readTextFileSync(Deno.args[0]));\n                 ^\n    at Object.readTextFileSync (ext:deno_fs/30_fs.js:800:10)\n    at file:///private/tmp/lykn%20receipt%20smoke%2090xen7ay/target/lykn/run/read.js:1:18\n"
    },
    {
      "case": "read scoped",
      "argv": [
        "/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn",
        "run",
        "--no-prompt",
        "--allow-read=/private/tmp/lykn receipt smoke 90xen7ay/allowed",
        "read.lykn",
        "/private/tmp/lykn receipt smoke 90xen7ay/allowed/input.txt"
      ],
      "exit": 0,
      "stdout": "receipt input\n",
      "stderr": ""
    },
    {
      "case": "read outside",
      "argv": [
        "/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn",
        "run",
        "--no-prompt",
        "--allow-read=/private/tmp/lykn receipt smoke 90xen7ay/allowed",
        "read.lykn",
        "/private/tmp/lykn receipt smoke 90xen7ay/outside/input.txt"
      ],
      "exit": 1,
      "stdout": "",
      "stderr": "error: Uncaught (in promise) NotCapable: Requires read access to \"/private/tmp/lykn receipt smoke 90xen7ay/outside/input.txt\", run again with the --allow-read flag\nconsole.log(Deno.readTextFileSync(Deno.args[0]));\n                 ^\n    at Object.readTextFileSync (ext:deno_fs/30_fs.js:800:10)\n    at file:///private/tmp/lykn%20receipt%20smoke%2090xen7ay/target/lykn/run/read.js:1:18\n"
    },
    {
      "case": "write no grant",
      "argv": [
        "/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn",
        "run",
        "--no-prompt",
        "write.lykn",
        "/private/tmp/lykn receipt smoke 90xen7ay/allowed/output.txt"
      ],
      "exit": 1,
      "stdout": "",
      "stderr": "error: Uncaught (in promise) NotCapable: Requires write access to \"/private/tmp/lykn receipt smoke 90xen7ay/allowed/output.txt\", run again with the --allow-write flag\nDeno.writeTextFileSync(Deno.args[0], \"receipt output\");\n     ^\n    at writeFileSync (ext:deno_fs/30_fs.js:835:3)\n    at Object.writeTextFileSync (ext:deno_fs/30_fs.js:898:10)\n    at file:///private/tmp/lykn%20receipt%20smoke%2090xen7ay/target/lykn/run/write.js:1:6\n"
    },
    {
      "case": "write scoped",
      "argv": [
        "/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn",
        "run",
        "--no-prompt",
        "--allow-write=/private/tmp/lykn receipt smoke 90xen7ay/allowed",
        "write.lykn",
        "/private/tmp/lykn receipt smoke 90xen7ay/allowed/output.txt"
      ],
      "exit": 0,
      "stdout": "",
      "stderr": ""
    },
    {
      "case": "write outside",
      "argv": [
        "/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn",
        "run",
        "--no-prompt",
        "--allow-write=/private/tmp/lykn receipt smoke 90xen7ay/allowed",
        "write.lykn",
        "/private/tmp/lykn receipt smoke 90xen7ay/outside/output.txt"
      ],
      "exit": 1,
      "stdout": "",
      "stderr": "error: Uncaught (in promise) NotCapable: Requires write access to \"/private/tmp/lykn receipt smoke 90xen7ay/outside/output.txt\", run again with the --allow-write flag\nDeno.writeTextFileSync(Deno.args[0], \"receipt output\");\n     ^\n    at writeFileSync (ext:deno_fs/30_fs.js:835:3)\n    at Object.writeTextFileSync (ext:deno_fs/30_fs.js:898:10)\n    at file:///private/tmp/lykn%20receipt%20smoke%2090xen7ay/target/lykn/run/write.js:1:6\n"
    }
  ]
}
```

## CDC replay

Inspect the four-path source commit and compare RP-B01 hashes. From its source
worktree, run the targeted command, `make check`, and `make check-cited-paths`;
review the original/revised captures and reproduce receipt build identity and
real controls. Tests require actual Deno. Keep the six ledger rows open until
that independent evidence exists. JSON runtime work is still blocked; no
operator acceptance or arc/project closure is inferred from these checks.

## Planning handoff checks

Before the scoped planning commit, a fence-aware Markdown-link walk checked
46 local links across the 11 owning/ancestor documents and the PERM entry in
the Discovery Register: zero missing targets. Compared the six ledger rows
against planning HEAD: IDs, criteria, verify methods, significance, origin and
open status are unchanged. Inspected the source commit's path list: exactly
four authorized files; all four immutable `COMMIT:PATH` locators resolve via
`git cat-file -e`. `git diff --check` passed. The cached planning diff is
reviewed only for the 12 paths listed in cc-prompt.md; unrelated work is not
included. These document checks are not runtime or independent CDC evidence.
