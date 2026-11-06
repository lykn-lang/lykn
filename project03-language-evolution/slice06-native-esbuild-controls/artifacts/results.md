# Slice06 — Native esbuild and five controls

**Assignment:** Project03 / collapsed standalone Slice06 / initial assignment
**Date:** 2026-11-05
**CC:** OpenAI Codex 6 Luna High
**Evidence strength:** attested; independent CDC reproduction pending

## Intake, ownership and baseline

Planning opened clean on `planning@88554617805c123bcd4f5c2404ca6c18bf347922`. The dedicated source/build checkout is `/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls`, branch `codex/native-esbuild-controls`, clean at `74a90d51b853fc18fe2b7c6ee07417736e1ce464`; its common Git directory is `/Users/oubiwann/lab/lykn/lang/.git`. `cmp` and SHA-256 checks show planning, task and release `AGENTS.md` files byte-equal (hash `f837dc71ab11ffc2a0a97997967aa6f2da222c5246c757412decbea107f633b3`). No tracked source file is authorized to change. The task checkout was created after the managed API rejected a nested source repository and the allowed parent source root proved not to be a Git repository; CDC's recorded repository-local worktree fallback is retained, not repeated.

At opening, the named durable ignored task targets `target/lykn/tools/esbuild-0.25.5/`, `target/lykn/compiler-build/` and `target/lykn/experiments/native-esbuild-controls/` did not exist. Task worktree `.gitignore:3` matches each as `target/`; `git check-ignore -v` confirmed the source, binary and run-01 paths are ignored. No unknown-owner files were present in those exact subtrees. The task worktree remains pinned to the release commit; current release branches and main are read-only.

| Required input | Read extent and identity |
|---|---|
| This `cc-prompt.md` | Required-full, lines 1–177. |
| Slice06 `slice-plan.md`, `ledger.md` | Required-full, lines 1–295 and 1–15 respectively. These define the exact pins, target paths, source inventory, controls, predictions, permission model, phase gates and return contract. |
| Planning `AGENTS.md` | Required-full, current 301 lines retained from the same-context Slice04/05 intake. Current planning/task/release files have identical SHA-256 and byte comparison. |
| Project03 plan | Required sections: `Native source-built esbuild authorization` (lines 100–126), `Existing units` (127–140), and `Definition of done and boundaries` (141–147). The bounded work ends after this slice's controls/review/retrospective or honest stop; no arc is invented and future implementation definition-of-done remains unset. |
| Slice05 CDC close | Required final review/stop closure, `cdc-verification.md` lines 44–102, read full. Slice05 remains an accepted 0/5-run, 5/5-unrun historical stop; its source/cache checks are not repeated or erased here. |
| Slice04 original audit obligations | `artifacts/findings.md` §F-1–F-12 re-entry map, lines 91–109, read full. All original F rows and Project07 obligations remain open; this pilot does not claim full corpus/ESTree or public-release acceptance. |
| Retained framework, project and evidence contracts | Same-context complete/section reads recorded in Slice04 Findings §Intake and Slice05 results: collaboration-framework 3.0.1; project-management 3.0.0; work-verification 2.8.0; scientific-methods 1.0.0. Identities rechecked. Reused unchanged role/Autonomous/ownership/prompt, canonical planning/evidence, scientific design/controls/measures/protocol/capture/validity reads; no census replay. |
| Lykn domain guidance | Required-full `docs/guides/09-anti-patterns.md` lines 1–1117. Required sections of `00-lykn-surface-forms.md`: Bindings & Mutation/bind lines 75–182; Functions/func 183–326; Modules/import/export 738–793. Required `15-lykn-cli.md` IDs 01 Install and 02 Compile, lines 58–121. `assets/ai/SKILL.md` full lines 1–798 retained from the same pinned source context. |
| Go build guidance | Required-full installed `go-guidelines/SKILL.md` lines 1–459, v1.0.0. Required sections of the actual installed `guides/10-project-structure.md`: PS-19 lines 740–775 and PS-20 779–823. No Go source is authored; this assignment uses the guide's pinned manifest/read-only module discipline. |
| Official esbuild docs | Retrieved 2026-11-05: [Build from source](https://esbuild.github.io/getting-started/#build-from-source), section lines 351–372; [Metafile](https://esbuild.github.io/api/#metafile), lines 5035–5115; [Tree shaking](https://esbuild.github.io/api/#tree-shaking), lines 4534–4606. Current docs show a newer example tag; their procedure is explanatory only and does not alter the pinned v0.25.5 source commit. |
| Official Go and Deno docs | Retrieved 2026-11-05: Go [toolchain selection](https://go.dev/doc/toolchain), lines 171–194; module [authentication](https://go.dev/ref/mod#authenticating), lines 1786–1795; Deno [workspace configuration](https://docs.deno.com/runtime/fundamentals/workspaces/), lines 247–349, and [workspace resolution](https://docs.deno.com/runtime/fundamentals/workspaces/#how-deno-resolves-workspace-dependencies), lines 403–431. |

### Source-cited contract readback before specimen edits

The operator authorized one exact source-built native esbuild 0.25.5 tool, one existing Go 1.24.3 toolchain and only the pinned module input, followed by exactly five control stimuli. The source recipe says acquire immutable commit `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98`, preserve `go.mod`/`go.sum`, authenticate the exact `golang.org/x/sys@v0.0.0-20220715151400-c0bba94af5f8` sums, then build offline with local Go, CGO disabled, Darwin/arm64, trimpath and VCS stamping disabled. Any locked Lykn dependency miss or compiler/syntax problem stops for CDC; no silent fetch, source repair, dependency update or baseline change.

The sibling plan fixes the source population at 16 `.lykn` files: five stimuli, ten local support modules and one bounded observer. It freezes three local research packages, exactly nine declared library public keys, one no-LF JSON input and five predictions before execution. C4 bundles first; only a complete source/bundle/metafile inspection that identifies retained used/effect code and dropped unused-pure code opens the controls phase. The full eleven runtime invocations, permission rules, hashes, package-path checks and C5 object are binding. The observer is not a sixth stimulus. Direct native esbuild replaces Deno bundle; Deno only executes generated ESM. Slice05's preparation stop is superseded only for this approved native source build; its historical receipts and all original F-1–F-12/Project07 obligations remain.

The [esbuild source-build guide](https://esbuild.github.io/getting-started/#build-from-source) documents Go plus `go build ./cmd/esbuild`; current version examples are not the approved pin. The esbuild [metafile reference](https://esbuild.github.io/api/#metafile) specifies JSON `inputs` and `outputs`, including `bytesInOutput`, and warns its formatted analysis is for humans; this assignment will inspect actual full JSON and output code. The [Go toolchain guide](https://go.dev/doc/toolchain) explains automatic toolchain selection, so `GOTOOLCHAIN=local` is required to hold the existing binary fixed. The [module authentication reference](https://go.dev/ref/mod#authenticating) describes go.sum and checksum database verification; the exact pinned sums and `go mod verify` remain required. Deno's [workspace docs](https://docs.deno.com/runtime/fundamentals/workspaces/#how-deno-resolves-workspace-dependencies) say bare package names are resolved from configured workspace member names and exports, which C5 must test using the generated project's explicit nonstandard `project.json` config. These docs establish the recipe and expectation, not an executed build or result.

## Initial live tool receipts

Commands were run before source or specimen edits:

| Command | Exit | Output |
|---|---:|---|
| `git status --short --branch && git rev-parse HEAD` (planning) | 0 | `## planning`<br>`88554617805c123bcd4f5c2404ca6c18bf347922` |
| `git -C /Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls status --short --branch && git -C /Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls rev-parse HEAD && git -C /Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls rev-parse --git-common-dir` | 0 | `## codex/native-esbuild-controls`<br>`74a90d51b853fc18fe2b7c6ee07417736e1ce464`<br>`/Users/oubiwann/lab/lykn/lang/.git` |
| `/opt/go/1.24.3/bin/go version` | 0 | `go version go1.24.3 darwin/arm64` |
| `shasum -a 256 /opt/go/1.24.3/bin/go` | 0 | `be0aa789abf9342e1b7b4b9ccb940b1a5c5d13395f18a90834d09e09a44be511  /opt/go/1.24.3/bin/go` |
| `cmp` planning, task, release `AGENTS.md` and SHA-256 | 0 | All three byte-equal; hash `f837dc71ab11ffc2a0a97997967aa6f2da222c5246c757412decbea107f633b3`. |
| `git check-ignore -v` on source, compiler binary and run-01 target paths | 0 | Each resolves to task `.gitignore:3:target/`; each exact owned target subtree was absent at opening. |

## Predeclared outcomes

These are the sibling plan's predictions, not results. Module graph inputs, per-output retained contributions, runtime behavior and package export declarations remain separate evidence classes.

| Control | Exact baseline/bundled runtime prediction | Graph, retained code and API prediction |
|---|---|---|
| C1 | stdout `BASE\n`, exit 0, empty stderr | No library identity in resolved graph or output contributors; C5 proves availability. |
| C2 | stdout `{"x":1}\n`, exit 0 | JSON value contributes; no YAML input/edge/contribution. Root barrel may resolve JSON helpers. |
| C3 | stdout `{"x":1}\n`, exit 0 | Value contributes; JSON file/document and YAML identities absent from graph and output. C5 demonstrates omitted helper paths. |
| C4 | stdout `init:effect\nentry:42\n`, exit 0 | Used and effect code retained; unused-pure code has zero/absent output contribution. Gate requires complete bundle/source/metafile inspection before any runtime control. |
| C5 | `init:effect` then frozen JSON with the plan's exact ordered keys/values; exit 0 | All nine public root/subpaths work in one positive consumer, including implementation modules otherwise absent from apps. The unbundled baseline is reconciled to frozen package hashes. |
| **Total** | **Five stimuli; eleven declared runtime invocations after the C4 gate** | **No extra program, backend, minification variant or hidden positive consumer.** |

Expected C5 values are predeclared: JSON root/value `{x:1}`; file root/value exact raw `{"x":1}`; document root/value `document:{"x":1}`; YAML root/value `{answer:42}`; used root/value `42`; dead root/value `82`. The ordered output object keys are exactly `jsonRoot,jsonValue,fileRoot,fileValue,documentRoot,documentValue,yamlRoot,yamlValue,usedRoot,usedValue,deadRoot,deadValue`. The effects package contributes one `init:effect` line. C5 is a research stub/contract check, not production YAML, registry or licensing acceptance.

No esbuild source acquisition, Go module acquisition, build, Lykn source edit, compilation, bundle, runtime, npm/Node action or external trigger has occurred at this initial receipt. Subsequent sections will append commands, exits, hashes, attempt records, failures/unruns and evidence without replacing prior observations.

## Native esbuild source freeze and build

### Immutable source and dependency inputs

Only the approved source commit was fetched into the durable ignored tool home. The local Git repository was initialized under `target/lykn/tools/esbuild-0.25.5/source/`; its configured `origin` was supplied as `https://github.com/evanw/esbuild.git`, while `git remote get-url origin` resolved to `git@github.com:evanw/esbuild.git` through the existing HTTPS-to-SSH rewrite. The initial sandbox `git fetch --depth=1 origin ea453bf687c8e5cf3c5f11aae372c5ca33be0c98` failed (exit 128: SSH DNS lookup for `github.com` failed). The same exact fetch succeeded under the assignment-authorized network escalation; Git reported `From github.com:evanw/esbuild` and only the requested commit to `FETCH_HEAD`. `git checkout --detach FETCH_HEAD` produced detached `HEAD ea453bf687c8e5cf3c5f11aae372c5ca33be0c98`, commit `publish 0.25.5 to npm`, dated `2025-05-26T23:11:58-04:00`. The upstream tree is clean. No tag/version switch or working-tree source edit occurred.

The immutable root `go.mod` (10 lines), `go.sum` (2 lines) and `LICENSE.md` (21 lines) were read fully. `go.mod` declares Go 1.13 intentionally and the single direct module `golang.org/x/sys v0.0.0-20220715151400-c0bba94af5f8`; it explicitly says not to upgrade that dependency. Their SHA-256 values are respectively `2d48dbed6151e653adc9ab5d8869cba012d167f13352e45880e59104e1e02b9b`, `f2881c3c2d9d03858770bf7713c82ff7564c0893685cf708e49a111e5fd66ab2`, and `b40ec5baec7bb34fa5b1c09521fa3cd52d5fad7adafed74932a2010d3612a681`. Root license is MIT. The actual module's `go.mod` (3 lines, Go 1.17) and `LICENSE` (27 lines, BSD-style Go Authors terms) were also read fully; hashes are `f033333096fe198f3151deed93f2deba74e50bbfe7739134045bc3b7ce4a5024` and `2d36597f7117c38b006835ae7f537487207d8ec407aa9d9980794b2030cbc067`.

### Authenticated isolated module acquisition

All Go operations use `GOENV=off`, `GOWORK=off`, `GOTOOLCHAIN=local`, `GOFLAGS=-mod=readonly`, empty `GOPRIVATE`/`GONOPROXY`/`GONOSUMDB`, isolated `GOPATH`, `GOMODCACHE`, `GOCACHE` and `GOTMPDIR` below the tool target, and explicit `GOSUMDB=sum.golang.org`. Acquisition alone used `GOPROXY=https://proxy.golang.org` with no `,direct` fallback. The first exact `go mod download -json golang.org/x/sys@v0.0.0-20220715151400-c0bba94af5f8` attempt failed in the sandbox (exit 1; DNS lookup of `proxy.golang.org` failed). The identical command then succeeded under authorized escalation (exit 0). JSON reported the approved module and version, isolated cache paths, `Sum=h1:0A+M6Uqn+Eje4kHMK80dtF3JCXC4ykBgQG4Fe06QRhQ=` and `GoModSum=h1:oPkhp1MJrh7nUepCBck5+mAzfO9JrbApNNgaTdGDITg=` exactly as pinned. No other module was requested; Go's CLI did not expose a redirect trace, so no claim about actual blob redirect hosts is made. The proxy/sumdb environment constrains Go's configured module sources; it is not an OS-level network allowlist.

`go mod verify` in that isolated environment succeeded with `all modules verified`. The pinned Go identity is `go version go1.24.3 darwin/arm64`, executable SHA-256 `be0aa789abf9342e1b7b4b9ccb940b1a5c5d13395f18a90834d09e09a44be511`; `go env` returned `GOVERSION=go1.24.3`, `GOROOT=/opt/go/1.24.3`, `GOOS=darwin`, `GOARCH=arm64`, `GOTOOLCHAIN=local`. `go tool compile -V` returned `compile version go1.24.3`.

### Reproducible offline build and CLI verification

The offline build used the pinned binary, the same isolated cache paths, `GOPROXY=off`, `CGO_ENABLED=0`, `GOOS=darwin`, `GOARCH=arm64`, `-trimpath`, `-buildvcs=false`, `-mod=readonly`, and output `/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild`:

```sh
env GOENV=off GOWORK=off GOTOOLCHAIN=local GOFLAGS=-mod=readonly GOPROXY=off \
  GOSUMDB=sum.golang.org GOPRIVATE= GONOPROXY= GONOSUMDB= \
  GOPATH=/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/gopath \
  GOMODCACHE=/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/cache/mod \
  GOCACHE=/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/cache/build \
  GOTMPDIR=/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/tmp \
  CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 \
  /opt/go/1.24.3/bin/go build -trimpath -buildvcs=false -mod=readonly \
  -o /Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild \
  ./cmd/esbuild
```

Build exited 0 with empty stdout/stderr. The resulting file reports `Mach-O 64-bit executable arm64`, SHA-256 `b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`; `esbuild --version` exits 0 and prints `0.25.5`. Help inspection (`set -o pipefail; esbuild --help | rg -n -- '--metafile|--tree-shaking'`) exits 0 and finds line 85 `--metafile=... Write metadata about the build to a JSON file` and line 107 `--tree-shaking=... Force tree shaking on or off (false | true)`. `go version -m` identifies Go 1.24.3, package `github.com/evanw/esbuild/cmd/esbuild`, the exact x/sys module version and expected sum, `-trimpath=true`, `CGO_ENABLED=0`, `GOARCH=arm64`, `GOOS=darwin`. `-buildvcs=false` means binary VCS metadata is intentionally absent; the immutable source commit is recorded above. Rechecking upstream status and hashes shows clean source at the same commit and unchanged manifests.

This verifies a concrete usable native esbuild executable and required CLI surfaces. It does not by itself prove metafile accuracy for the Lykn fixtures, retained-code attribution, control outcomes, or public package behavior. The five-control phase remains closed until pinned Lykn build/provenance, source fixture commit, staged package/API checks, and C4's complete nonminified code/metafile inspection have each passed.

### Pinned Lykn compiler build and source freeze

The exact locked compiler build was first attempted in the normal sandbox:
`env CARGO_TARGET_DIR=<task>/target/lykn/compiler-build cargo build --offline --locked --release -p lykn-cli`.
Cargo returned exit 101 because unpacking already-cached `clap v4.6.1` into its
standard `/Users/oubiwann/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/`
cache failed with `Operation not permitted (os error 1)`. The same command was
then authorized at the permission boundary to use that existing Cargo cache;
it completed and populated only the explicitly owned compiler target. Repeating
the exact offline/locked command in the normal sandbox returned exit 0:
`Finished release profile [optimized] target(s) in 0.03s`. The build did not
access the network or change the lockfile. Cargo is `1.97.0 (c980f4866 2026-06-30)`;
rustc is `1.97.0 (2d8144b78 2026-07-07)`. `Cargo.lock` remains SHA-256
`bbec9052ee3a3401d716c3b4f2d227107e7e0a8c6f8c846c27fd902e0f39ca92`. The
generated executable is task-local ignored
`target/lykn/compiler-build/release/lykn`, reports `lykn 0.6.0-dev`, is Mach-O
arm64, and has SHA-256
`66e9f8f83ccf5e8be7d19aa211529f82ab9598c49bebc29642f0146c7e8051dd`. Its help
lists the authorized `compile` and `dist` commands. This is compiler-tool
provenance only; no fixture has yet been compiled or run.

Before the first fixture compilation, the concrete specimen is now frozen in
`artifacts/source/`: exactly 16 `.lykn` files (five C1–C5 stimuli, ten support
modules, one observer), four package `deno.json` files, root `project.json`, and
the literal no-LF input `workspace/data/input.json` (SHA-256
`bb157861a164e35cdde9d726b0af9ce2765a8f530c35d9e45732b94ee65e9557`). The five
JSON configuration files parse successfully. C5 imports each of the nine configured public keys,
calls root and subpath implementations, and serializes the predeclared ordered
object. The driver has only `gate` and `controls` phases. Gate makes C4's single
native bundle and returns without running controls. Controls first hashes the
actual C4 bundle against a reviewer-supplied frozen SHA-256, then runs the
predeclared eleven invocations in order. It constructs aliases from the staged
package `deno.json` export maps, saves every subprocess's exit/stdout/stderr
receipt before assertions, and compares exact predicted stdout with zero
stderr. C5 alone receives child-runtime file read permission for the exact
input path. The observer itself will receive read access only to the fixture
workspace and evidence output directory (the latter is required to re-hash the
reviewed C4 artifact), write access only to that output directory, and run
access only to pinned esbuild and Deno. The driver is authored Lykn; no
handwritten JavaScript or custom checker was added.

The API mechanics for this finite observer were grounded in the already-reviewed
Slice07 supervisor source at
`planning/project07-core-library-research/arc03-findings-and-integration/slice07-research-supervisor/artifacts/supervisor.lykn`,
lines 1–26: `Deno.Command` construction with explicit args/cwd/clear-env/env,
piped streams and `output-sync`; typed-array SHA-256 via `crypto:subtle:digest`;
and TextDecoder decoding. Only these API mechanics are reused. Slice06 retains
its narrower run permissions, cleared deterministic child environment, output
receipt-before-assertion and explicit C4 human/code gate; none of Slice07's
broader supervisor process inventory or permissions are inherited. Source
mapping for staged package directories was verified against the pinned task
implementation (`config::short_name` and `dist::stage_runtime`): scoped names
`@probe/json`, `@probe/yaml`, `@probe/effects` stage as `dist/json`, `dist/yaml`,
`dist/effects`. The driver still reads actual generated export maps and later
checks paths/byte equality rather than treating this mapping rule as a staging
result.

At this point source plus this intake/protocol receipt must be committed before
any fixture compile, dist staging, bundle or runtime action. C4 remains the
first bundle and sole gate; no runtime control has occurred. Source compilation,
dist/byte-equality, export-map path verification, full C4 code/metafile review,
and the eleven declared runtime invocations are pending.

### Pre-execution source correction: input newline

Before any fixture compilation or execution, the read-only coordinator inspected
the committed input bytes and found that the initial source commit above had an
LF byte after `{"x":1}`. Thus its recorded SHA-256
`bb157861a164e35cdde9d726b0af9ce2765a8f530c35d9e45732b94ee65e9557` and claim
that the file had no LF were incorrect; the actual initial file was eight bytes.
The plan requires exactly seven bytes with no terminal LF. I preserved the
initial commit and changed only this data file before any dependent action. The
corrected input is seven bytes (`7b 22 78 22 3a 31 7d`), contains no newline,
and hashes to
`5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`.
The existing C5 expected raw-text value remains exactly `{"x":1}`; no source
shape, prediction, or test scope changed. This correction must be committed and
the new source commit becomes the prerequisite freeze for all fixture work.

### First strict compilation attempt and observer syntax correction

After the corrected-input source commit, I copied a fresh workspace to
`/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/experiments/native-esbuild-controls/run-01/workspace/`
and ran the pinned strict per-file `lykn compile -o` loop. All 15 stimulus and
support files compiled with exit 0. The separately compiled driver failed with
exit 1, `unterminated list at 98:1`; the actual command and result are retained
in ignored task-target
`target/lykn/experiments/native-esbuild-controls/run-01/compile-logs/summary.txt`
and `driver.log`. This was a Lykn reader error, before dist staging or any
bundle/runtime operation. Inspection located the unmatched form at the end of
the async `digest` definition: one required close parenthesis was missing. I
made only that delimiter correction in `artifacts/source/driver.lykn`; fixture
shapes, observer flow, permissions, predictions and control count are unchanged.
This source state and the failed attempt are retained in history, and the driver
correction must be committed before its compile retry. No runtime control has
run; all 11 remain unrun and C4 remains the future first bundle/gate.

A second fresh compile attempt in `run-02` again compiled all 15 fixture/support
modules (exit 0); the driver again returned `unterminated list at 98:1`, captured
in that attempt's separate `compile-logs/summary.txt` and `driver.log`. The
first delimiter correction closed `digest` but exposed that the following async
`main` form also lacked its final closing parenthesis. I have now added only
that closing delimiter. The previous attempt and source commit remain intact;
the corrected driver requires its own source commit before a fresh `run-03`
compile. No C4 bundle or runtime action has occurred.
