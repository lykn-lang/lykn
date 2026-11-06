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

### Iteration01 source-cited correction readback before edits

Current assigned prompt: `cc-prompt-iteration01.md`; planning opened at
`abe1c83ebc3d00a0aed99e4e584b6f37fcc58bd8`, with prior source history through
`0818be32908e3e4eca75aad0f4431fd470ce4795`. CDC's current `cdc-verification.md`
inspected this exact observer and C5: three invalid static host-method calls,
missing metafile observations/oracles, a duplicate C5 receipt label, and false
root-vs-subpath file/document coverage. It confirms zero bundles/runtimes and 14
unaffected workspace source compiles reusable; C5 and observer require recompile.

The full required Lykn sections were loaded for this correction:
`docs/guides/00-lykn-surface-forms.md` “Colon Syntax”, “cell / express / swap!”
and `conj`; `docs/guides/09-anti-patterns.md` ID-41 and ID-47. The pinned source
ECMAScript corpus sections were loaded fully: `docs/ecmascript-2025/22-text-processing.md`
§22.1.3.22 `String.prototype.slice`, §22.1.3.28 `String.prototype.toLowerCase`,
and `docs/ecmascript-2025/23-indexed-collections.md` §23.1.3.23
`Array.prototype.push`. These are prototype receiver methods; Lykn colon syntax
lowers `receiver:method` to member access and hyphenated methods to camelCase.
The correction uses `key:slice`, `name:to-lower-case`, and `conj` accumulation
where loop state is needed; no static String/Array call or raw JavaScript is
appropriate. C5 root and subpath imports are separate observations: JSON file
and document calls will be tested once from `@probe/json` root and once from
their declared subpaths, preserving the expected camelCase JSON keys/order.

The existing full-metafile requirement will be implemented in finite Lykn code:
parse actual `inputs`/`outputs`, select output by normalized `entryPoint`, record
complete normalized input/import identities and numeric `bytesInOutput`, then
apply the fixed per-control graph/contribution rules. The raw metafile remains
separate and unchanged. C4 gate writes its observation and returns before any
runtime; manual complete C4 bundle/source/metafile review remains mandatory.
C5 positively exercises the dead export and no removal claim rests on grep or
byte totals. The 13 staged public JS/config hashes will be snapshotted before
gate and reconciled after. Receipt labels distinguish C5 before/after; writes
must reject pre-existing paths. No new probe or predicted outcome is introduced.

### Iteration01 implementation and retained preflight evidence

The prior committed C5/observer produced no bundle/runtime evidence. Its CDC
review returned it before the gate. All iteration01 changes preserve the same
five stimuli, ten support modules, nine declared public keys, permissions,
expected outputs and eleven-runtime order. C5 now imports JSON parse/file/
document from `@probe/json` root and again from their three subpaths; the
predeclared camelCase JSON output keys and values remain unchanged. The driver
uses Lykn receiver forms for slice/lowercase and cell-plus-conj accumulation.

For each native bundle the observer reads and JSON-parses the actual metafile,
requires nonempty actual input/output objects and import arrays, selects the
specified `.js` outfile by normalized path plus the normalized expected
`entryPoint`, requires its `inputs`, and records every normalized input/import
identity, output identity and numeric `bytesInOutput` contributor. It retains
the original raw `.meta.json` written by esbuild. Its finite checks implement
the existing C1–C5 graph/contribution rules and explicitly record unexpected
library identities; C4 separately records whether dead.js resolved and whether
its output contribution is zero. Gate writes only C4 metadata/observation and
returns before runtime. Controls consumes the reviewed C4 hash and the same C4
bundle, then persists a cumulative observation set separate from the gate.

Before C4, the observer records 13 exact staged library JS/config paths and
hashes plus all nine actual export specifier/target/hash rows. It validates
target-to-file correspondence and later reconciles each path, key, target and
hash against a separate after-snapshot. Runtime receipt labels are unique,
including `C5-source-before`/`C5-source-after`; each refuses an existing receipt
before writing. The corrected observer code is source-frozen before its
required C5/observer-only recompile; no bundle or runtime has yet run.

Retained pre-correction build evidence: run-03 compiled all 15 then-current
workspace modules and the then-current observer (16/16 exits 0); run-03
`lykn dist` exited 0 and staged `@probe/json`, `@probe/yaml`, `@probe/effects`,
and `@probe/controls` under `target/lykn/dist/{json,yaml,effects,controls}`.
Those successes are attested and do not prove the corrected observer or C5.
The earlier 14 unchanged module outputs remain reusable. C5 and driver must be
recompiled and the changed C5 staging plus every staged JS byte equality and
export-map path checked in a fresh attempt. No bundle/runtime or Deno control
has executed; denominator remains five bundles and eleven runtime invocations,
all unrun.

### Iteration01 first corrected-source compile attempt

Source commit `d228833905d2a0981c1193d9d27d9deee12e579c` froze the C5 root-path
coverage and finite observer contract above. I copied the run-03 staged workspace
to fresh task target `run-04`, replaced only C5 source, and reused the prior
14 unchanged compiled source outputs. A compile-log setup command first exited
1 because `run-04/compile-logs/` had not yet been created; no compiler ran in
that setup attempt. After creating the directory, C5 compiled with exit 0 and
the observer compile exited 1 with `unterminated list at 436:1`; both outputs
are retained under ignored task target `run-04/compile-logs/`. No dist, C4
bundle or runtime action followed. The source review located open loop forms in
output selection, unexpected-identity accumulation, export target validation,
and before/after reconciliation. I am preserving run-04 and correcting only
those loop closures, without changing the five controls, schema/oracle rules,
permissions or predictions. The corrected source requires a new commit before
the next fresh C5/observer compile.

A fresh `run-05` copy recompiled corrected C5 with exit 0, then observer compile
again exited 1 at `unterminated list at 436:1`. The pinned `lykn check` and
read-only `lykn fmt` on that exact source independently returned the same parse
error; formatter output was empty. I then inspected complete top-level form
boundaries and nested loop closures. The specific remaining unclosed forms were
the first C5 conditional in `runtime-args` and the async `main` function; the
current source adds one close at each actual boundary. This correction is
syntax-structure-only. Run-05's C5/driver summaries and native check/fmt outputs
are retained under its ignored compile-log directory. The next attempt must
compile the newly committed state and use the successful native formatter output
to review top-level form boundaries before any C4 bundle.

### Native parser/formatter and observer source review

After the source-boundary correction, fresh `run-06` compiled C5 and the
observer successfully (two commands, both exit 0). Pinned `lykn check` passed
both corrected files and reported 37 observer and 12 C5 top-level expressions.
The first `lykn fmt --check` found these two changed files were unformatted.
I generated and read the complete 951-line output from the pinned `lykn fmt`
command, checking the full function list and nested `gate`/`controls`, `do`,
and loop boundaries; this made the async-main and loop nesting explicit. I then
applied that formatter only to the two changed sources. A follow-up
`lykn fmt --check` and `lykn check` both exit 0. All 16 Lykn source files pass
the pinned `lykn lint` with no findings. The formatted driver byte-compares
identically to the saved formatter output. These formatted source changes are
included in the next source commit and the two affected files must be recompiled
from that exact state before staging.

Inspection of the generated run-06 JavaScript confirms the corrected Lykn
receivers emit `key.slice(2)`, `name.toLowerCase()`, and instance-array methods;
the inspected regions contain no generated `Array.push`. Generated C5 imports
`parseValue`, `readText`, and `documentLabel` from `@probe/json` root and imports
the matching three subpath functions separately, then calls each root/subpath
binding. This was generated-code inspection only, not a Deno runtime result.
Fourteen unchanged compiled module/control outputs in run-06 compare byte for
byte against run-03. C5 and observer compilation logs, formatter/check/lint
receipts, and those comparisons are attested; no esbuild bundle or runtime has
run. The denominator remains zero of five bundles and zero of eleven runtimes.

### Final corrected-source compile and staged pre-gate checks

The formatted corrected source is committed at planning
`ea8410c203ef773e9b846c4e52c001e4e1844f85`. A fresh run-07 copied run-03's
checkpoint, recompiled only C5 and the observer (both exit 0), and byte-compared
the 14 unaffected compiled library/C1–C4 outputs against run-03 (14/14 exact).
`lykn check` on the two corrected files passed (37 and 12 top-level expressions),
`lykn fmt --check` passed, and pinned `lykn lint` reported no findings across
all 16 `.lykn` source files. The driver compile itself exits 0 but emits the
compiler warnings preserved verbatim in `artifacts/evidence/compilation/run-07/driver.log`
(unused-binding notices, including several values/functions that the generated
observer calls). These warnings are retained and disclosed; the source linter
still reports no findings. No warning is suppressed by a bypass flag.

One map-check wrapper invocation stopped after successful dist/byte comparison
because its local `plan` shell variable was unset; this did not affect source or
staging. The corrected finite map command then succeeded: `lykn dist` exit 0
staged the four declared members; all 15 compiled stimulus/support JS files
compared byte-for-byte with staged JS. Semantic source/dist export-map diffs
were identical, with exact keys and targets: JSON 4 (`.`→mod, `./document`,
`./file`, `./value`), YAML 2 (`.`→mod, `./value`), effects 3 (`.`→mod,
`./dead`, `./used`); all nine targets exist. Full map output and dist receipt
are in `artifacts/evidence/staging/run-07/`.

Before the C4 gate, pinned executable identity was reconfirmed: Deno
`/opt/homebrew/bin/deno` 2.9.6 SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`, native
esbuild 0.25.5 SHA-256
`b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`, and
task-local Lykn 0.6.0-dev SHA-256
`66e9f8f83ccf5e8be7d19aa211529f82ab9598c49bebc29642f0146c7e8051dd`. The
updated C5/driver sources and staging checks are complete; this records
preparation only. At this receipt, output directory/gate command are not yet
run, and the denominator is still zero of five bundles and zero of eleven
runtime invocations.

### Pre-gate generated-code correction: create-new writes

Before C4, inspection of the complete generated `driver.js` found that the
prior `ensureAbsent` helper's emitted try/catch did not implement its source
intent: the catch path unconditionally throws, so the helper cannot perform
the intended absence check. This is recorded as observed emitted behavior;
the cause is not attributed. No gate ran with that driver. Pinned Deno 2.9.6
`deno types` documents `Deno.writeTextFileSync(path, data, options)` and
`WriteFileOptions.createNew`, which fails when a file, directory, or symlink
already exists. I replaced the try/catch probe with `createNew` writes for
receipts and reserve empty new paths before esbuild writes bundle/metafile
outputs. The exact emitted helper and Deno API excerpt are retained in
`artifacts/evidence/source-review/pre-gate-create-new.txt`. The corrected
observer requires a fresh native compile and emitted-code inspection before
the single C4 gate. This correction does not change stimuli, package sources,
oracles, runtime order, or permissions. The denominator remains zero of five
bundles and zero of eleven runtimes.

The first run-08 outer launch then stopped at module parse, before the observer
or native esbuild ran: Deno reported `Unexpected strict mode reserved word` at
generated `modulePath(package, file)`. The exact command and stderr are retained
under `artifacts/evidence/gate/run-08/`; this is a failed launch, not a C4
bundle. I renamed the Lykn binding `package` to `pkg` in the three observer
locations and call sites. The source has been formatted and `lykn check` passes
(37 top-level expressions); the next fresh compile must be inspected for any
remaining reserved generated declarations and compiler sentinels before
retrying the gate. Bundle/runtime denominators remain 0/5 and 0/11.

The create-new correction is committed at `6c9a3147a7f01b5fff4f5cd80e373c1a989e669b`. Fresh run-08 copied the staged run-07 workspace and recompiled only the changed observer. Native compile, `lykn check` (37 top-level expressions), and `lykn fmt --check` passed; `lykn lint` again reported no findings across all 16 source files. Generated code now emits `Deno.writeTextFileSync(path, text, { createNew: true })` for receipts and uses the same create-new option to reserve JS/metafile output paths. The generated diff versus run-07 is confined to that helper and its call sites; the complete observer's previously reviewed top-level/main/gate/controls and nested loop boundaries are unchanged. CDC completed a read-only static review of this corrected 951-line observer and found no further contract defect. Compilation evidence and the changed-region witness are in `artifacts/evidence/compilation/run-08/`. No C4 bundle or runtime has yet run: 0/5 bundles, 0/11 runtimes.

The run-08 module-parse failure was corrected in planning commit `3c7d573f8c61d1327c278e4aa37799e68d95a1d4`: every Lykn binding named `package` in the observer was renamed `pkg`; there were no intended user-facing strings or package identities to change. Fresh run-09 compiled the updated observer with exit 0, `lykn check` passed (37 top-level expressions), `fmt --check` passed, and lint again reported no findings in 16 source files. The generated function/parameter/loop declarations were reviewed for strict-mode reserved names and `COMPILE_ERROR` sentinels; none were found. Generated write helpers still use Deno `createNew`, and the change relative to run-08 is limited to the `package`→`pkg` bindings and derived references. Run-08 failed only before source loading; no esbuild process or C4 bundle was reached. C4 remains not yet attempted successfully (0/5 bundle receipts) and runtimes remain 0/11.

Run-09 passed module loading after the `pkg` rename but stopped on Deno parsing
the observer's gate body: `await publicSnapshot()` was inside a synchronous
arrow IIFE emitted for the phase conditional. No observer statement or esbuild
process ran. The exact launch and stderr are retained in
`artifacts/evidence/gate/run-09/`. I moved the gate and controls bodies into
separate async phase functions; the main dispatcher now only returns the
selected phase promise, keeping each `await` directly inside an async function
body. This is an observer-source control-flow correction; no compiler
attribution is made. Pinned native `lykn fmt --write`, `lykn check` (39
top-level expressions), `fmt --check`, and all-16-file lint passed. The source
will be committed before the next fresh compile. Bundle/runtime denominators
remain 0/5 and 0/11.

Fresh run-10 compiled the async phase-function correction from source commit `30e97932dc2cabeaa243338f405a5b8fe6399c10`; native compile, `lykn check` (39 top-level expressions), formatter check, and lint across all 16 sources passed. Generated-code inspection confirms `gatePhase` and `controlsPhase` are async functions, all remaining `await` expressions are within async function bodies, and `main` returns the selected phase promise for the top-level `await main()`. Reserved-declaration/sentinel scan is empty. The fresh workspace reuses the already verified 14 unchanged compiled files and the staged maps/modules; no source or staging inputs changed. The run-09 pre-load parse failure is retained; no C4 bundle or runtime has run yet (0/5, 0/11). Compile and generated-phase witnesses are under `artifacts/evidence/compilation/run-10/`.

Correction to the preceding run-09 phrasing: run-09 did not pass module parsing; it cleared the earlier reserved-name diagnostic but Deno still rejected the invalid `await` placement before evaluating the observer. Both pre-C4 launch failures (run-08 and run-09) are preserved as failures before any esbuild invocation.

### C4 code and metafile gate

The run-10 gate succeeded with exactly one native esbuild C4 invocation and no runtime execution. Raw C4 bundle, metafile, argv/result receipt, gate observations, and the 13-file/nine-export pre-snapshot are retained under `artifacts/evidence/gate/run-10/`. The selected output is `out/C4.js`, entry point is the staged `controls/c4.js`, output size is 538 bytes, and bundle SHA-256 is `6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a`.

I read the complete emitted bundle alongside the complete C4 entry and staged effects sources. It contains the `init:effect` side effect and the `used(41)` call with its `used(n)` implementation (`n + 1` plus type checks). The complete bundle contains no `unusedPure` declaration or body. Raw metafile inputs resolve `effects/dead.js` (406 input bytes), but the selected output has no dead.js contributor row: this is recorded as resolved-but-zero/absent retained contribution, not graph absence. The selected output reports 365 bytes from `used.js`, 28 from `effect.js`, and 0 from the barrel; gate observations record `c4DeadResolved: true`, the positive contributions, and no unexpected library identities. CDC independently reproduced the complete-code/source/metafile inspection and confirmed this finite gate passes. This supports only the planned C4 negative-removal observation; C5 must still prove positive use of `unusedPure` and all runtime/API behavior remains untested.

The C4 code/metafile attribution gate is satisfied. The durable denominator is now one of five bundles and zero of eleven runtime invocations; the remaining fixed controls sequence is authorized to proceed using this exact C4 bundle hash.
