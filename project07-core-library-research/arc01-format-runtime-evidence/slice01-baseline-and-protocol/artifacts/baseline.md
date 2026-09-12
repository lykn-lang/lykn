# Baseline B01 — 2026-09-12

CC-attested inspection, not a runtime format trial. Start time: 21:27:20 UTC.
The selected compiler is the **existing release/0.6.x `bin/lykn`**, identified
by its bytes, with the existing Deno 2.7.7. This avoids the older PATH CLI and
requires no rebuild, upgrade, installation, or source edit. Compilation and
execution are separate capabilities: the permission-sensitive launch route has
a confirmed source-level gap, described below.

## Local identity and ownership

| Surface | Observed identity | State and use |
| --- | --- | --- |
| Planning | `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, `planning`, `4b289ba4e8800f99fa4a4f734e122216da76a0ca` | Clean before this work; only allowed planning files authored |
| Source 0.6.x | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, `release/0.6.x`, `8c66469ba8f290a4bba993157b68a9e0d7716f0d` | Clean; chosen source/document comparison baseline; read-only |
| Source 0.7.x | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x`, `release/0.7.x`, `74a90d51b853fc18fe2b7c6ee07417736e1ce464` | Clean; read-only, not selected |
| Source 0.8.x | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.8.x`, `release/0.8.x`, `0f3c28ce78f127ec122334c22fd15b8b433905b7` | Clean; read-only, not selected |
| Integration | `/Users/oubiwann/lab/lykn/lang`, `main`, `1b747830cd6dcdae465445db64ad70d009904aad` | Clean; no authored work |
| Book | `/Users/oubiwann/lab/lykn/book` symlink → `/Users/oubiwann/lab/cnbb/lykn`, `main`, `6aa379d1534b3cf680bc5a0eb5c344c99f975c16` | Remote `git@github.com:cnbbooks/lykn.git`; untracked `_to_delete/` preserved and excluded |
| Patch | **Not located within the recorded search** | No path, branch, package name, or repository creation inferred |
| Host | `Darwin arm64` | One host only; other OS/filesystem behavior untested |

`git worktree list` also reports prunable registrations at
`/private/tmp/lykn-deno-compat` (`deno-compat-floor`, `00c9766`) and
`/private/tmp/lykn-layer4-main` (`layer4-consumer-smoke-main`, `2ae6509`).
They are not available research checkouts; no pruning performed.

Patch search: listed `/Users/oubiwann/lab/lykn`; searched filenames containing
`patch` under that directory and `/Users/oubiwann/lab/billosys`; ran
`find /Users/oubiwann/lab -maxdepth 4 -iname '*patch*' -type d`.
Results were unrelated patch directories in LFE/Rust/Clojang/music projects.
This bounded search does not exclude a differently named or deeper checkout.
Arc04 must establish its real identity before integration; absence is permitted
by this slice's contract.

## Executables

| Path | Output / SHA-256 | Qualification |
| --- | --- | --- |
| `/opt/homebrew/bin/deno` → `../Cellar/deno/2.7.7/bin/deno` | `deno 2.7.7 (stable, release, aarch64-apple-darwin)`; `v8 14.6.202.9-rusty`; `typescript 5.9.2`; `103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4` | Selected runtime; package compatibility not exercised |
| `/Users/oubiwann/.cargo/bin/lykn` | `lykn 0.5.2`; `c02d3b844d1d3243f5ad0d4793e3cd2c691038f9011e43734513e1dd19b6bb03` | Installed PATH CLI; not the guide baseline |
| `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn` | `lykn 0.6.0-dev`; `4e6e715b07c6b89d774d06b592a2a703496fc46cbbb596e7a5b9e8fda7f2c7d0` | Selected existing binary, 2,895,568 bytes; ignored build artifact |
| Same source tree, `target/release/lykn` | Same SHA-256 as `bin/lykn` | Byte equality established, source-to-binary build provenance **not** established |
| Same source tree, `target/debug/lykn` | Exists, 10,083,976 bytes | Not selected or executed |

No `bin/lykn`, `target/release/lykn`, or `target/debug/lykn` was found in the
0.7.x or 0.8.x worktrees at the inspected paths. Do not call the selected
binary “built from 8c66469”: its source checkout is at that commit, but the
ignored binary has no independently verified build receipt.

Observed local help (exit 0):

```text
lykn compile [OPTIONS] <FILE>
  -o, --output <OUTPUT>
  --strip-assertions
  --kernel-json
  --source-context-path <PATH>
  --no-strict
lykn run <FILE> [ARGS]...
  -h, --help
```

The installed 0.5.2 compile help lacks the last two options. Normal trials
retain assertions and strict `.lykn` mode. Help is not proof of compilation.

## Launch gap and policy boundary

At source commit `8c66469`, `crates/lykn-cli/src/main.rs:464-509` constructs
`deno run --config ... -A ...` in both `.lykn` and `.js` paths (lines 499 and
505); script arguments follow the filename. The current `run --help` exposes
no Deno permission option. This contradicts `AGENTS.md`'s no-injected-permissions
rule. Source inspection establishes the defect in this revision; the existing
binary's subprocess behavior was **not** probed. `test` also contains `-A`
(lines 636, 683); it is not a least-privilege substitute.

See [D-2609-PERM and follow-up](findings.md). Until corrected/verified or an
explicit execution-route exception is authorized, the protocol stops before
`lykn run`/`test` format probes. It does not silently invoke direct Deno,
substitute another authoring language, or add npm. This is a launch prerequisite,
not a reason to suppress the JSON/YAML cases.

## References actually loaded

All Lykn entries below are from the clean **release/0.6.x commit `8c66469`**.
`assets/ai/SKILL.md` is a regular tracked file, not a symlink. Guide paths are
root-relative to that source commit, never relative to planning.

| File | Read extent / reason | Git blob |
| --- | --- | --- |
| `assets/ai/SKILL.md` | Entry point and language/CLI reference; large output revisited in sections | `241bc4d8ce5dfff153edec2462e012849e96b2ad` |
| `docs/guides/09-anti-patterns.md` | Reference read; source-first policy and JSON loss warnings | `e82f984596154e7bb191905f7a8812949412654f` |
| `docs/guides/00-lykn-surface-forms.md` | Lines 1–210 and 430–670; bindings, type and matching sections | `7edaa320b33720bd604c6bed5ada2bc7129cbfe3` |
| `docs/guides/05-type-discipline.md` | Reference read; especially ID-01–05, 19, 21, 26–30 | `3dac9940de5a20e967f55f306d532b5b27c60afb` |
| `docs/guides/14-no-node-boundary.md` | Reference read; ID-07, 14, 24–26 | `848b004e7ba5970adb191823765f234296ae2b7b` |
| `docs/guides/15-lykn-cli.md` | Lines 1–125 and heading search; compiler identity and CLI route | `085c99fbc28304b9d7fc1009f5871817c34bcc3b` |
| `docs/guides/03-error-handling.md`, `07-async-concurrency.md` | Heading/example locator search only, not a full load | Same source commit; later task must load selected sections |

Book files actually read at the pinned book commit: `src/SUMMARY.md` (locator
search), `src/part5/chapter25/2-json.md`,
`src/part2/chapter10/2-type.md`, `src/part2/chapter10/3-match.md`.
No book execution or sweep was performed.

`assets/ai` also contains symlinks to the ai-engineering repository for coverage,
audit, ledger, and delegation material. Their existence was inspected; they
were not followed or used as this slice's instruction sources. No `assets/ai/js`
or `rust` entry was present in the listing; no JS/Rust authoring was undertaken.

Installed method references read: collaboration-framework 2.1.0 `SKILL.md`,
its posture guides 01–03 and engineering-methods guide 01; project-management
2.14.0 `SKILL.md`, `guides/README.md`, guides 02/04/05; work-verification 2.4.0
`SKILL.md`, guides 01–05; scientific-methods 1.0.0 `SKILL.md`, guides 01–08.
These are installed-version identities, not assumed source commit identities.

## Replay identity inspection

Run from the planning worktree, read-only:

```sh
date -u
git worktree list
command -v deno lykn
deno --version
lykn --version
uname -sm
for p in /Users/oubiwann/lab/lykn/lang /Users/oubiwann/lab/lykn/lang/.worktrees/{0.6.x,0.7.x,0.8.x,planning} /Users/oubiwann/lab/lykn/book; do
  git -C "$p" rev-parse --show-toplevel HEAD
  git -C "$p" status --short
 done
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn --version
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --help
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn compile --help
shasum -a 256 /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/{bin/lykn,target/release/lykn} /Users/oubiwann/.cargo/bin/lykn /opt/homebrew/bin/deno
ls -la /Users/oubiwann/lab/lykn /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/assets/ai
find /Users/oubiwann/lab -maxdepth 4 -iname '*patch*' -type d
git -C /Users/oubiwann/lab/lykn/lang show 8c66469:crates/lykn-cli/src/main.rs
```

The successful inspection outputs are transcribed above. An initial guessed
`crates/lykn-cli/src/commands/run.rs` lookup failed (path absent); `rg --files`
and symbol search located `src/main.rs`. No repository was created or repaired.
Package pins, retrieval failures, hashes, and source locators are in
[source-register.md](source-register.md). No package was installed into a Lykn
project and no lock or runtime dependency graph was generated in this slice.
