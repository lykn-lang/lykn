# Slice06 — Native esbuild and five controls

Status: **Independently closed as a bounded stop: four rows done, three deferred.** Parent: [Project03](../project-plan.md).
Collapsed standalone slice; final assignment `cc-prompt-iteration01.md`; [ledger](ledger.md).
Native tool and C4 attribution were reproduced; first C5 runtime failed before
evaluation (1/5 bundles, 1/11 runtime attempts, 4 bundles/10 runtimes unrun). See
[verification](cdc-verification.md#final-independent-review--2026-11-05) and
[retrospective](cdc-retrospective.md). No five-control success is claimed.

## Authority, result and endpoint

2026-11-05 operator approved the concrete proposal to use esbuild as a pinned
native build tool without Node/npm: “perfect. I love this idea — let's do it :-)”.
This extends the bounded five-control attempt with explicit upstream source and
reviewed Go-input acquisition, separate acquisition/build, explicit binary paths
and provenance. It supersedes Slice05's no-provisioning gate only for this source
build; the old stop/receipts remain historical. Direct native esbuild replaces
Deno bundle for this attempt; Deno only executes generated ESM. No npm client,
npm distribution/registry, Node installation, alternate bundler, production
library implementation, publish/push/release or remote CI is authorized.

Endpoint: one source-built esbuild 0.25.5 / Go 1.24.3 / Lykn 74a90d5 / Deno 2.9.6
combination and exactly five stimulus programs, with independent review and
retrospective, or an honest bounded stop if acquisition/build/retained-code
proof fails. No minification/backend/platform/version matrix. Source/tool or
permission errors are retained; satisfy actual permissions through authorized
tools, never bypass checks. No compiler/upstream source repair is authorized.
No old F criterion changes or inherits a result from this pilot.

Models remain explicit: CDC/design/independent reviewer OpenAI Codex Sol 6.1 High;
CC OpenAI Codex 6 Luna High; root transport/read-only. One necessary Lykn driver
is observer/orchestration tooling, not a sixth stimulus. Its scope is this finite
five-case record, not a supervisor framework. C5 shares all positive consumers.
Five corrective iterations maximum; do not extend inquiry or invent cases.

## Ownership and pinned homes

Planning: existing `planning`, opening clean `df8f3de249d4af8f85c68b61571a09043bf37594`.
Source/build task worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls`,
branch `codex/native-esbuild-controls`, exact `74a90d51b853fc18fe2b7c6ee07417736e1ce464`,
clean. Existing release branches/main are read-only. Research sources/evidence
belong in this planning slice's artifacts; task worktree gets generated files
under ignored target only. No tracked source change/commit there is intended.

Managed creation was attempted as required: app API rejected nested lang sourceRoot;
allowed parent sourceRoot is not a Git repository. list_artifacts was empty.
Verified actual repository/common Gitdir/worktree list, then used repository-local
`git worktree add -b codex/native-esbuild-controls .worktrees/native-esbuild-controls
74a90d5`. This is a recorded API limitation/fallback, not an approval rejection.
Do not change the parent setup to fit the API or claim managed attachment.

Durable ignored tool home (retain for later audit; no global install/cache seeding):
`<task>/target/lykn/tools/esbuild-0.25.5/`, with `source/`, isolated Go `cache/`,
`tmp/`, `gopath/` and `bin/esbuild`. Foreign source stays there, outside core lib.
Native Lykn build: `<task>/target/lykn/compiler-build/release/lykn`.
Experimental workspace: `<task>/target/lykn/experiments/native-esbuild-controls/run-01/`.
Preserve failed attempts/unknown-owner files; later corrections use distinct
attempt directories/commits, not overwritten evidence. Keep the task worktree
and binaries for the next audit; its clean tracked state and paths are reported.

CDC owns planning/index until handoff; CC then owns exact slice outputs and the
named task target subtrees, no other source/index. CDC resumes ownership for
review. Local scoped planning commits authorized with both contiguous trailers.
No automatic pipeline is triggered by local commits; no remote action.

## Tool acquisition and build recipe

- esbuild v0.25.5 upstream `https://github.com/evanw/esbuild.git`, immutable commit
  `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98` (tag resolution independently looked up
  before acquisition). Fetch only this commit, checkout detached, verify HEAD,
  clean tree and the immutable go.mod/go.sum. No npm install script/distribution.
- Existing `/opt/go/1.24.3/bin/go`: go1.24.3 darwin/arm64, SHA256
  `be0aa789abf9342e1b7b4b9ccb940b1a5c5d13395f18a90834d09e09a44be511`.
  Pin this installed toolchain, record GOROOT/compiler identity and output
  `go version -m`; no automatic download/upgrade.
- Exact sole module dependency `golang.org/x/sys@v0.0.0-20220715151400-c0bba94af5f8`.
  Expected Sum `h1:0A+M6Uqn+Eje4kHMK80dtF3JCXC4ykBgQG4Fe06QRhQ=`;
  GoModSum `h1:oPkhp1MJrh7nUepCBck5+mAzfO9JrbApNNgaTdGDITg=`.
  Upstream go.mod says Go 1.13; keep both manifests byte-unchanged, no tidy/get -u.
- Acquisition uses isolated GOPATH/GOMODCACHE/GOCACHE/GOTMPDIR, `GOENV=off`,
  `GOWORK=off`, `GOTOOLCHAIN=local`, `GOFLAGS=-mod=readonly`; clear GOPRIVATE,
  GONOPROXY and GONOSUMDB. Explicit `GOPROXY=https://proxy.golang.org` with no
  direct fallback, `GOSUMDB=sum.golang.org`; `go mod download -json` exact module
  and `go mod verify`, verify both expected sums and actual module population.
  GitHub (including actual Git transport), proxy.golang.org, sum.golang.org and
  proxy blob redirects such as storage.googleapis.com are scoped acquisition
  services. Record receipts/redirects actually observable, not a claim these env
  flags enforce an OS network allowlist. No credentials/npmrc inventory.
- After acquisition build with the same isolated environment plus GOPROXY=off,
  CGO_ENABLED=0, GOOS=darwin, GOARCH=arm64; pinned Go command:
  `go build -trimpath -buildvcs=false -mod=readonly -o <tool>/bin/esbuild ./cmd/esbuild`.
  Record source commit because VCS stamping is explicitly disabled. Check native
  version 0.25.5/help/metafile flags, binary SHA256/file platform/go version -m.
  No third-party source edits or silent fallback. Reviewer can rebuild offline
  from these exact inputs and compare binary hash.
- Build pinned Lykn on the task branch using `CARGO_TARGET_DIR=<task>/target/lykn/compiler-build
  cargo build --offline --locked --release -p lykn-cli`. Record Cargo/rustc,
  source/lock hashes, binary path/hash. Prefer cached/offline build. On a cache
  miss preserve exact locked-input failure and return to CDC to assess existing
  task authority/provenance; do not silently fetch new versions, change the lock,
  upgrade toolchain or switch baseline. Never use stale global lykn 0.5.2.

Official method sources: [source build](https://esbuild.github.io/getting-started/#build-from-source),
[metafile](https://esbuild.github.io/api/#metafile),
[Go toolchains](https://go.dev/doc/toolchain),
[module authentication](https://go.dev/ref/mod#authenticating).
Immutable go.mod/go.sum were personally read after bounded default-DNS failures
and authorized escalated HTTPS retrieval. Those failures are retained in the
record; no source checkout/build/control has been executed at this opening.

## Frozen source population and concrete construction

Author exactly 16 Lykn source files: five stimulus entrypoints C1–C5, ten library
support modules, one observer driver. Configuration/data are not extra programs.
Local specimen names `@probe/json`, `@probe/yaml`, `@probe/effects` are research
labels, not assigned production @lykn package names or library implementations.

Under `artifacts/source/workspace/`: root project.json workspace
`["./lib/json","./lib/yaml","./lib/effects","./controls"]`, imports `{}`.
Each package has deno.json version 0.0.0, lykn.kind runtime; source configs only.
Library exports (exact nine public keys across three packages):
- json: `.`→mod.js, `./value`→value.js, `./file`→file.js, `./document`→document.js.
- yaml: `.`→mod.js, `./value`→value.js.
- effects: `.`→mod.js, `./used`→used.js, `./dead`→dead.js.
Controls is a harness workspace member @probe/controls (exports c1.js), excluded
from library-public-API denominator. Data `data/input.json` is exactly `{"x":1}`
without LF (write literal bytes, record hash). No handwritten JS/package.json.

Ten support modules, all `.lykn`:
- json/value: `(func parse-value :args (:string text) :returns :object :body (JSON:parse text))`
  plus `(exports parse-value)`.
- json/file: `(func read-text :args (:string path) :returns :string :body (Deno:read-text-file-sync path))`
  plus exports. No load-time I/O/effects.
- json/document: `(func document-label :args (:string text) :returns :string :body (template "document:" text))`, exports.
- json/mod: three selective `(export "./value.js" (names parse-value))` and sibling
  file/read-text, document/document-label re-exports. No YAML dependency.
- yaml/value: `(func parse-yaml-fixture :args (:string text) :returns :object :pre (= text "answer: 42") :body (obj :answer 42))`, exports.
  This is a one-input research stub, explicitly not YAML parsing/fidelity proof.
- yaml/mod: selective re-export of parse-yaml-fixture.
- effects/used: `(func used :args (:number n) :returns :number :body (+ n 1))`, exports.
- effects/dead: `(func unused-pure :args (:number n) :returns :number :body (* n 2))`, exports.
- effects/effect: `(console:log "init:effect")` only.
- effects/mod: bare `(import "./effect.js")` and selective re-exports used/unused-pure.

Five controls under controls/c1.lykn…c5.lykn:
- C1: `(console:log "BASE")`, no library import.
- C2: `(import "@probe/json" (parse-value))`; parse literal `{"x":1}`, print
  JSON:stringify result. Root/barrel may resolve JSON helpers even if removed.
- C3: same action but import `@probe/json/value`; no helper resolution permitted.
- C4: `(import "@probe/effects" (used))`; `(console:log (template "entry:" (used 41)))`.
- C5: one positive consumer imports ALL nine configured library keys, using
  `(alias original renamed)` where root/subpath names overlap. Call each root
  exported function AND corresponding subpath function: JSON parse, file read
  at `Deno.args[0]`, document label, YAML stub, used(41), unused-pure(41).
  Print one JSON object in this exact key order: jsonRoot,jsonValue,fileRoot,
  fileValue,documentRoot,documentValue,yamlRoot,yamlValue,usedRoot,usedValue,
  deadRoot,deadValue. The values, respectively: {x:1},{x:1}, raw input, raw input,
  document:{x:1} text twice, {answer:42} twice,42 twice,82 twice. Actual string
  values are exact `{"x":1}` and `document:{"x":1}`; JSON keys x/answer hold numbers.
  Effects import adds exactly one init:effect line before that JSON. This key
  map and values are binding predeclared expected results, not learned from output.

Keep surface forms/typed params, no --no-strict/--strip-assertions/PURE annotation
or sideEffects:false. Module import path first, explicit binding lists; bare
import only the intentional effect module. Full unknown codegen is not assumed:
CC validates these shapes through the pinned compiler, preserves any failures,
and stops for a compiler/source fix outside this assignment.

## Staging, observer and predeclared procedure

CC creates sources/driver and commits them BEFORE the first fixture compile,
bundle or runtime command. This plan's predictions already precede experiments;
record the concrete-source commit. Tool builds are prerequisites, not controls.
Copy source workspace fresh to run-01. Default strict pinned `lykn compile -o`
compiles the 15 control/support files to target/lykn/build/<short-name>/relative.js
and the driver separately. This produces optional adjacent d.ts; own those outputs.
Run pinned `lykn dist` in that fresh workspace to stage generated configs/files;
assert every staged JS is byte-identical to precompiled JS (empty imports means
no rewrite), source/dist public export maps agree, record incidental generated
npm metadata without using/publishing it or selecting production-code licences.
Compilation freshness makes dist's mtime path reuse those exact CLI outputs;
verify byte equality, do not assume it. No production lib compatibility claim.

Driver `artifacts/source/driver.lykn` uses only Deno/Web built-ins, native JSON,
Deno.Command with explicit executable path, cwd, piped stdout/stderr and stdin
null; use outputSync, persist code/stdout/stderr BEFORE assertions. Deno types
and existing reviewed supervisor show this exact API shape; no eval/wrappers.
Driver runs native esbuild and Deno only, reads generated export maps to derive
all nine `--alias:<specifier>=<absolute staged .js>` flags. Parent native CLI
resolves no JSR/npm itself; unbundled Deno uses generated dist/project.json
workspace to exercise actual public export maps. No invented manual package.json.

One bundle per control, nonminified, explicit `--bundle --tree-shaking=true
--format=esm --platform=neutral --target=es2022 --metafile=<out/Cn.meta.json>
--outfile=<out/Cn.js>`, no other backend/variant. Cwd is the fresh workspace;
record actual argv, inputs/imports, outputs/inputs/bytesInOutput and exports.
Normalize paths against that cwd; do not identify modules only by basename.
`inputs` means resolved/load graph, not retained contribution. Output per-input
bytes is a separate observation; barrels legitimately resolve dropped modules.

The observer has two finite phases, not extra stimulus variants. Gate phase
bundles C4 only, parses/persists its metafile and exits without runtime controls.
CC reads the complete actual C4 bundle/source/metafile and records the doer gate
finding in results.md. Controls phase accepts the reviewed C4 bundle hash and
checks it against actual bytes before reusing that same bundle; no second C4
bundle or new case. Only after that source-grounded check does it run the fixed
sequence. This keeps the human/code-inspection observation before dependent
runtime actions instead of assuming the driver performed a semantic review.

First bundle is C4, BEFORE any control execution. Parse real metafile and read
its complete tiny nonminified bundle against original support module bodies:
used/effect code identifiable with positive retained contribution, dead module
zero/absent output contribution, unused-pure declaration/body absent. Metafile
and complete code inspection jointly support this finite removal claim; a marker
grep or smaller byte count alone does not. If attribution/code identity cannot
be established, STOP with C4 bundle evidence and all runtime controls unrun.
Do not run extra controls/backends to hide the gap. C5 later supplies the genuine
unused-pure positive result 82 and positive module contribution.

Snapshot all staged public configs/JS hashes before C4. Once evidence gate passes,
run C5 unbundled positive baseline (after C4 evidence bundle, against unchanged
package hashes), then C4 unbundled/bundled, C1/C2/C3 unbundled/bundled, C5 bundled,
and C5 unbundled again at end. This is five stimulus sources and 11 runtime
invocations, not eleven distinct programs/conditions. Baseline/bundle differ only
by app bundling; exact inputs, package bytes, platform, arguments and permissions
stay fixed. C5's initial run is reconciled to pre-C4 package bytes by hash equality;
no earlier public-API runtime execution is falsely claimed. Check final public
config/JS hashes unchanged and every declared library path works via C5.

The official Deno workspace rule permits bare named members/subpaths via each
member's name/version/exports without an imports entry; explicitly select the
nonstandard generated project.json filename with --config. This is a source-
grounded expectation, tested by C5 itself, not a separate sixth probe.

Deno child runtime: explicit `/opt/homebrew/bin/deno` v2.9.6/hash from Slice05,
`run --cached-only --no-npm --no-remote --deny-net --no-prompt --config=<generated
workspace project.json> <entry.js> [data-path]`; ONLY C5 gets --allow-read=<exact
input.json>, others no file API grant. Driver itself uses --no-config and minimal
--allow-run=<exact esbuild,Deno>, --allow-read=<workspace>, --allow-write=<out>;
no -A, allow-all or implicit permission injection. Clear child environment and
set only deterministic PATH, isolated DENO_DIR, DENO_NO_UPDATE_CHECK, NO_COLOR.
Use fixed binaries/args, no process spawning from stimuli or framework expansion.

## Predictions and evidence oracles (committed before runs)

| Control | Exact functional prediction | Graph/retained/public oracle |
| --- | --- | --- |
| C1 | stdout `BASE\n`, exit 0, stderr empty | No library identities in inputs/import graph OR output contributors; C5 proves libraries available |
| C2 | stdout `{"x":1}\n`, exit 0 | JSON value contributes; no YAML input/edge/contribution. JSON barrel helpers may be resolved but need not contribute |
| C3 | same exact JSON stdout/exit | Value contributes; no JSON file/document nor YAML identities in input graph/contributors; C5 proves omitted helper paths functional |
| C4 | stdout `init:effect\nentry:42\n`, exit 0 | used/effect retained, unused-pure code absent/zero module contribution; complete bundle inspection, later C5 positive dead-module proof |
| C5 | init:effect then exact frozen JSON of all root/subpath results, exit 0 | Nine declared keys work locally; implementation modules including YAML/file/dead have positive contribution; package configs/JS unchanged after app bundles |

Paired original/bundled stdout/code/stderr must match these exact predictions;
C5 root/subpath JSON x=1, fileraw=`{"x":1}`, document=`document:{"x":1}`, YAML answer=42,
used=42, unused=82. No warnings hidden. Inspect all meta graph edges and contribution
maps, not just aggregate counts. No universal tree-shaking, JSR-registry acceptance,
YAML implementation or full ESTree corpus audit claim. Original F-1–F-12 still owe
the complete inventory/families/corpus/prediction-divergence/report contract.

## Records, limits and review

Artifacts: source tree/driver/data; one results.md with intake, provenance,
commands, source/module/binary hashes, actual attempt denominators, gate/each
control disposition, observations versus inference and residuals; evidence/
contains the five metafiles, five nonminified bundles, compact command/runtime
records and needed generated public configs/JS witnesses. Retain failures and
unrun rows; do not create large source/cache/binary archives in Git. Binaries,
upstream source/caches remain durable ignored task target paths with rebuild
recipe/hash receipts. Original historical failed/unrun and human/licence gates
are unchanged. Evidence is CC attested until CDC reproduces it.

No full source Makecheck/upstream test suite is claimed: no product/Go/Rust code
changes. Required meaningful checks are source syntax/lint as applicable, strict
compilation/staging equality, native build/version/help/provenance, all finite
metafile/code/runtime/API oracles and diagnostic-only diff. Source fixes require
a separate assignment. CDC independently replays driver/data, examines code/meta,
checks binary provenance and may rebuild same native inputs offline/hash-compare.
Close with row walk, collapsed bubble-up and retrospective; stop at this slice.

## Readiness/history

CDC inspected native compile/dist/module source, actual local tool APIs and
pinned upstream manifests; applied Lykn anti-patterns/modules/functions/CLI,
Go module PS-19/20 (retain manifests/read-only pinned build; no Go edits),
scientific controls/protocol/evidence and retained framework contracts. Managed
API failure fallback and exact task branch established before implementation.
The prompt names readable scope/sections, executable shapes, discriminating
oracles and ownership; no consequential method choice is left to unsupported
CC inference. Local helper names/report formatting are discretionary.

| Assignment | Date | Predecessor | Disposition |
| --- | --- | --- | --- |
| cc-prompt.md | 2026-11-05 | none | executed prerequisites/source freezes; retained parser/input corrections; returned before runtime for observer/C5 source defects |
| cc-prompt-iteration01.md | 2026-11-05 | cc-prompt.md | completed bounded observer repairs and C4 gate; stopped at first C5 parse failure; independent close with three deferred rows |

## Version history

- 2026-11-05 v1.2: Independently rebuilt the pinned native tool and replayed
  C4 attribution plus the first C5 parse failure. Closed NE-01/02/03/07;
  deferred NE-04/05/06 without changing their criteria. Routed NE-C01 to the
  existing Project03 backlog, preserved all failures/unruns, and completed
  retrospective. This authorization ends here; no compiler/source workaround.

- 2026-11-05 v1.1: Pre-runtime source review returned observer host-API errors,
  incomplete metadata/hash observation, duplicate future C5 receipts and root
  consumer coverage. Issued iteration01 preserving builds, 14 unaffected compiles,
  all prior failures/source freezes and the unchanged five-case scope.

- 2026-11-05 v1.0: Opened approved native source-build/direct-metafile approach
  with five fixed stimuli, shared positives, observer scope and pre-run predictions.
