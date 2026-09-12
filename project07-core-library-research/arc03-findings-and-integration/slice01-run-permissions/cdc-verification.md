# CDC verification — Run permissions closed

Date: 2026-09-12. Reviewer: Codex, CDC, separate from executing CC.
Source reviewed: `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`.
Planning reviewed: `b15ca70b7634b30249f3da3390b065489bac6152`.

**Verdict: six of six original criteria done at reproduced strength.**
The run-permission correction is closed; the launcher prerequisite for
Arc01/Slice02 is lifted. No JSON trial, package adoption, whole-toolchain
permission repair, or human acceptance is claimed.

## Source and contract review

Read all four changed source files, the original contract, all six ledger
rows, CC's three artifacts and closing report, and the ancestor/discovery
diffs. Source scope is exactly main.rs, run_permissions.rs, and the two named
guides. Planning scope is the twelve authorized paths. Both commits pass
`git show --format= --check`. No criterion or required control was removed.

Clap owns option parsing; the first positional starts trailing program capture.
Optional scopes require equals. Absent, bare, scoped, repeated and explicit
empty values remain distinct; an empty value cannot become a broad grant.
Requested runtime arguments precede a child `--` boundary, while program
arguments use OsString and cannot grant permissions. Both source routes share
the corrected dispatch. Config construction, build output and child exit
handling retain their previous behavior. The guides explain the runtime/
compiler distinction and the separate test-runner policy.

Re-read parent `2a0cabf` main.rs: both old branches contain unconditional `-A`.
CC's original recorder transcript is retained as historical attestation; CDC
did not rebuild or claim to recreate the old executable. Current child-boundary
tests and actual runtime controls independently establish the correction.

## Independent validation

Source CWD: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`.

| Command/check | Independently observed result |
| --- | --- |
| `cargo test -p lykn-cli --test run_permissions` | 11 passed, 0 failed/ignored |
| Initial `make check` | Stopped in existing npm dry-run test because the sandbox cannot write the user's npm cache; retained as a failed attempt |
| `npm_config_cache="$p07_npm_cache" make check` | Passed after setting that cache to a fresh disposable directory; no test/code/assertion changed |
| Canonical Rust tests | 1,502 passed across 23 harness summaries |
| Canonical JavaScript/Lykn suite | 1,465 passed, 0 failed |
| Canonical documentation tests | 482 passed, 0 failed; no separate doc rerun |
| Other canonical gates | Dependency, cited paths, release build, Clippy, formatting, source syntax and lint passed |
| `cargo build --release --locked` | Passed; release binary hash unchanged |
| `make check-cited-paths` at committed source HEAD | Passed: 63 documents, 601 retained historical citations |

Cache replay setup is `p07_npm_cache=$(mktemp -d /private/tmp/lykn-p07-cdc-npm-cache.XXXXXX)`.
This isolates an existing repository validation dependency; it adds no npm
dependency to the correction or research. The first gate's failure and the
successful rerun are distinct observations. Raw routine logs were retained
during review at `/private/tmp/p07-rp-cdc-targeted.log`,
`/private/tmp/p07-rp-cdc-check.log`, and
`/private/tmp/p07-rp-cdc-check-isolated.log`; the commands/results above are
the durable replay record, not a promise that scratch survives.

## Receipt reconciliation

RP-B01's source commit, tree `1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`,
Cargo.lock hash, all four changed-input hashes, Deno identity and executable
hashes match current bytes. Source tracked/untracked status remained clean.
Fresh locked build, version and help also match. Rust and Cargo are 1.97.0,
native aarch64-apple-darwin, as recorded in RP-B01.

- Selected CLI: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn`.
- CLI SHA-256: `5efc8299cc005e977c4d33304f3c9f7062bc4eeb0038c93136a95dccdbaceb86`;
  identical to `target/release/lykn`.
- Selected runtime: `/opt/homebrew/bin/deno`, 2.7.7.
- Runtime SHA-256: `103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.

This reproduces the local source/build receipt using Cargo's existing cache.
It does not establish clean-room or cross-machine bit reproducibility. CC's
receipt and the older Arc01 B01 remain historical records, not rewritten.

## Independent release-binary controls

Used the exact selected CLI above, the two retained Lykn programs from
[CC validation](artifacts/validation.md), and a fresh disposable root containing
spaces. `project.json` was `{}`; allowed/outside directories contained distinct
input text. Write payload was `CDC output`. Each process used cleared inherited
environment, PATH `/opt/homebrew/bin:/usr/bin:/bin`, HOME/TMPDIR/DENO_DIR below
that root, DENO_NO_UPDATE_CHECK=1, NO_COLOR=1 and null stdin.

Command shape: `CLI run --no-prompt FLAGS read.lykn|write.lykn PATH [SCRIPT_ARGS]`.
For each read/write operation, independently ran these five controls:

| Control | FLAGS / target / script arguments | Result for read and write |
| --- | --- | --- |
| No grant | none; allowed path | exit 1, NotCapable for the intended operation |
| Scoped grant | allow-operation=absolute allowed directory; allowed path | exit 0; exact input/output payload checked |
| Outside scope | same allow; outside path | exit 1, NotCapable |
| Explicit denial | allow and deny for allowed directory; allowed path | exit 1, NotCapable; deny first for write, last for read |
| Script grant attempt | no runtime grant; trailing --allow-all for read or -A for write | exit 1, NotCapable |

**10/10 controls passed.** Confirmed denied initial writes created no file;
outside output never existed. Scratch root was
`/private/tmp/lykn p07 CDC permissions.eQyMcM`. These are permission controls,
not JSON research results. The targeted integration tests separately cover
standalone/workspace/generated-JS routes, all sixteen allow/deny names,
scope repetitions, empty values, program separators, help, config overlays,
cached/frozen placement, and mock/real nonzero exits.

## Per-row verdict and limits

| Row | Status / strength | Basis |
| --- | --- | --- |
| RP-01 | done / reproduced | Parent source defect; current all-route exact argv tests without implicit grants |
| RP-02 | done / reproduced | Process argument tests and real repeated-scope controls; script boundary cannot grant access |
| RP-03 | done / reproduced | All-route real Deno controls plus 10 independent release-binary controls |
| RP-04 | done / reproduced | Config overlay/build paths, runtime option placement, stderr/exit 37 and actual exit 23 |
| RP-05 | done / reproduced | Two-guide/help review and local committed-source/input/runtime/binary receipt reconciliation |
| RP-06 | done / reproduced | Full canonical gates, retained failed attempt, exact scoped commits and this independent review |

Six rows opened, six closed; zero deferrals/no-ops. Unix/macOS execution is
verified. Windows and interactive prompting remain unclaimed. Non-file
permissions have argument coverage; comprehensive enforcement, graph/offline
behavior and resource supervision retain their later research owners.

## Bubble-up and advancement

The assigned run correction is delivered. No further source change or slice
split is needed. Close Arc03 A3-01 and D-2609-PERM as repaired on release/0.6.x.
Arc03/Slice02 still owns the separate test-runner policy; LINT/NPMB/JSER/YNOD,
arc composition and all project criteria remain open.

Resume the already-open Arc01/Slice02 with the verified executable/runtime pins
and concrete launch contract added to its packet. Its own launch/argv control,
package graph/lock preflight and external resource supervisor still require
execution evidence; lifting the launcher dependency does not close J2-01.
Arc03/Slice02 planning stays queued under the existing cross-arc sequence.

Handoff checks: 107 local Markdown links resolve across Project07; status JSON
parses and points to Arc01. The six original criterion/verification/significance/
origin fields are unchanged, and all six statuses are now done. Source commit
scope matches exactly four allowed paths; all twelve CC planning paths are
authorized. CDC whitespace and exact commit scope are checked separately.
Concurrent Project02 release planning is preserved outside this change.

## What worked

Combining a child-argument recorder with actual Deno denial tests separated
parsing correctness from enforcement. Pinning executable bytes made the
research handoff checkable. Isolating the existing package-test cache allowed
the full gate to run without weakening it or changing user files.
