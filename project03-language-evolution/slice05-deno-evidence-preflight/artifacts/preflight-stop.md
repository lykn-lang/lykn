# Slice05 Deno preflight stop

2026-11-05 CDC: this stop record is independently accepted at CC candidate
`2b79677`; see [verification](../cdc-verification.md). The authorized attempt
ends with **0/5 controls run and 5/5 unrun**. Original CC attestation/intake
and correction history below retain their actual origin and limits.

**Assignment:** Project03 / collapsed standalone Slice05 / initial assignment
**Date:** 2026-11-05
**CC:** OpenAI Codex 6 Luna High
**Evidence strength:** attested; independent CDC verification pending

## Intake and scope

Planning opened clean on `planning` at `da925811e45fef2e084723c3f29711859965802d`. Read-only source opened clean on `release/0.7.x` at `74a90d51b853fc18fe2b7c6ee07417736e1ce464`. Planning and source `AGENTS.md` compared byte-equal (command exit 0). No source task branch/worktree was created because this assignment stops before implementation.

| Required input | Coverage and status |
|---|---|
| Current `cc-prompt.md` | Required-full, lines 1–102, at the opening planning commit. |
| Slice05 `slice-plan.md`, `ledger.md`, planning `AGENTS.md` | Required-full: plan lines 1–148, ledger lines 1–13; current planning governance is retained as a full lines 1–301 read from the immediately preceding Slice04 context. Current source governance was byte-compared and matched. |
| Parent Project03 plan | Required section, `project-plan.md` lines 76–95: the 2026-11-05 bounded Deno attempt and evidence-gap stop, plus the current-unit/boundary listing at lines 97–104. |
| Slice04 correction/close records | Required sections: `cdc-verification.md` §Final correction review and closure (lines 72–138); `artifacts/findings.md` §§Next audit protocol and Remaining decisions and limits (lines 110–143). Read in this context. |
| Retained framework/project/evidence intake | Slice04 Findings §Intake lines 14–34 records full/section extents from the same context: collaboration-framework 3.0.1; Codex role/Autonomous/ownership/prompt contracts; canonical planning/evidence; Lykn source/no-Node/module policy; scientific framing/measures/protocol/validity. I reused unchanged complete reads and did not repeat their census. Work-verification 2.8.0, project-management 3.0.0 and collaboration-framework 3.0.1 identities match the prior intake. |
| Newly required scientific-methods guides | Scientific-methods 1.0.0 identity checked. Required-full reads: `02-experiment-design.md` lines 1–63; `03-controls-and-confounds.md` 1–62; `06-evidence-capture.md` 1–51; `07-comparison-and-regression-testing.md` 1–61. |
| Deno 2.9.6 primary source | Official version-tagged raw GitHub sources read on 2026-11-05: `cli/tools/bundle/esbuild.rs` lines 19–147; `cli/tools/bundle/mod.rs` lines 210–397, 1057–1099, 2528–2607, 2787–2892. Full requested extents were visible; no source excerpt was inferred from a hash. |

No required text extent was missing. All identity and cache commands below were run before edits. Intake receipts and command output are CC attestation, not independent review. The source-cited contract readback follows before conclusions or ledger updates.

## Source-cited contract readback

The operator-authorized outcome is one pinned compiler/Deno combination, one backend and five tiny control programs, with no new dependency; stop if the evidence gap is reached. The current prerequisite is the exact Deno 2.9.6 esbuild backend. Upstream [`esbuild.rs` at Deno v2.9.6](https://raw.githubusercontent.com/denoland/deno/v2.9.6/cli/tools/bundle/esbuild.rs) pins `ESBUILD_VERSION` to 0.25.5 and cache version 1 (lines 19–22), maps this platform to `darwin-arm64` (23–38), constructs `dl/esbuild-0.25.5-1/esbuild-darwin-arm64` (40–58), and returns only if that exact path exists (59–61). If it does not, it resolves `@esbuild/darwin-arm64@0.25.5` through npm package metadata and package-cache/tarball logic (62–89), then copies the backend into the expected path (91–140). Matching [`bundle/mod.rs` at Deno v2.9.6](https://raw.githubusercontent.com/denoland/deno/v2.9.6/cli/tools/bundle/mod.rs) calls `ensure_esbuild_downloaded` before constructing/awaiting the resolver (210–223); it starts the service with that path (278–285). Thus a future bundle call may provision the backend before workspace resolution; `--no-npm` is not evidence that the bundler backend itself needs no npm package. No call was made and no download was attempted or observed.

That same [`bundle/mod.rs`](https://raw.githubusercontent.com/denoland/deno/v2.9.6/cli/tools/bundle/mod.rs) separately shows that internal build flags enable `tree_shaking(true)` and `metafile(true)` and forward a requested source-map mode (2528–2607). The build request sets `write: false` for the esbuild protocol (1057–1099); `process_result` collects and processes output files then writes them (2787–2851). The CLI's finished summary reports input-module count and each output path/type/size (2853–2892); the inspected summary does not expose the per-input contribution map. These source details establish internal capability and the exposed summary shape, not behavior from a produced bundle. Source-map forwarding does not establish adequate attribution or coverage. Missing metafile/help flags do not prove optimizer absence, and neither counts nor byte deltas prove retained-code membership. I do not claim every possible source-map or other attribution technique is impossible, and do not investigate alternatives in this stop assignment.

The five predictions remain the plan's specification-strength controls C1–C5: C1 no library import yields exactly `BASE`; C2 JSON-only consumer parses `{"x":1}` to key `x` with numeric value 1 while independent YAML identities are absent; C3 JSON value-only consumer yields the same result while its document/file-helper identities are absent; C4 used function yields 42, ordered effect output is exactly `["init:effect","entry:42"]`, and known-pure unused code may drop; C5 positively imports every specimen public root/subpath, including YAML and helper consumers. Graph membership and retained-output attribution are distinct oracles. All predictions remain unrun. C5 supplies the shared positive consumers; it is not a sixth program. These controls do not replace Slice01's original F-6/F-10 contracts or its separate throwing/effect/corpus scope.

## Live identity and exact local command receipts

The following commands were run from the planning checkout. Each command and its exit status is recorded; no credentials, npmrc contents, or unrelated cache inventory were queried.

| Command | Exit | Complete relevant output |
|---|---:|---|
| `git status --short --branch && git rev-parse HEAD` (planning) | 0 | `## planning`<br>`da925811e45fef2e084723c3f29711859965802d` |
| `git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x status --short --branch && git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x rev-parse HEAD` | 0 | `## release/0.7.x`<br>`74a90d51b853fc18fe2b7c6ee07417736e1ce464` |
| `cmp -s /Users/oubiwann/lab/lykn/lang/.worktrees/planning/AGENTS.md /Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x/AGENTS.md; printf 'cmp_exit=%s\n' "$?"` | 0 | `cmp_exit=0` |
| `deno --version` | 0 | `deno 2.9.6 (stable, release, aarch64-apple-darwin)`<br>`v8 15.0.245.2-rusty`<br>`typescript 6.0.3` |
| `shasum -a 256 /opt/homebrew/bin/deno` | 0 | `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74  /opt/homebrew/bin/deno` |
| `deno info` | 0 | `Deno version: 2.9.6`<br>`DENO_DIR location: /Users/oubiwann/Library/Caches/deno`<br>`Remote modules cache: /Users/oubiwann/Library/Caches/deno/remote`<br>`npm modules cache: /Users/oubiwann/Library/Caches/deno/npm`<br>`Emitted modules cache: /Users/oubiwann/Library/Caches/deno/gen`<br>`Language server registries cache: /Users/oubiwann/Library/Caches/deno/registries`<br>`Origin storage: /Users/oubiwann/Library/Caches/deno/location_data`<br>`Web cache storage: /Users/oubiwann/Library/Caches/deno/location_data/web_cache` |
| `ls -ld /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.25.5-1/esbuild-darwin-arm64 /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.5` | 1 | `ls: /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.25.5-1/esbuild-darwin-arm64: No such file or directory`<br>`ls: /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.5: No such file or directory` |
| `for p in /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.25.5-1/esbuild-darwin-arm64 /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.5; do test -e "$p"; s=$?; printf 'test -e %s => %s\n' "$p" "$s"; done` | loop exit 0; each test 1 | `test -e /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.25.5-1/esbuild-darwin-arm64 => 1`<br>`test -e /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.5 => 1` |
| `ls -ld /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.12 /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.27.4` | 0 | `drwxr-xr-x@ 5 oubiwann staff 160 Mar 26 2026 /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.25.12`<br>`drwxr-xr-x@ 5 oubiwann staff 160 Mar 26 2026 /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/@esbuild/darwin-arm64/0.27.4` |
| `ls -ld /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.25.12-1 /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.27.4-1` | 1 | `ls: /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.25.12-1: No such file or directory`<br>`ls: /Users/oubiwann/Library/Caches/deno/dl/esbuild-0.27.4-1: No such file or directory` |

The exact required executable and fallback package directory are absent. Different 0.25.12 and 0.27.4 npm package directories exist; neither matches source version 0.25.5. The mixed `ls` result is not used to infer that every path was absent: each exact path has its own `test -e` result, and each successful sibling listing is reported separately. I did not inspect/cache-survey other versions, execute a cached binary, copy or seed a backend, fetch/install packages, or invoke Deno bundle/backend/API/compile/build commands. The local Deno hash/version are live tool identity only, not reproduced Deno build provenance.

## Preflight result and five-control denominator

The first gate fails before control C1: matching source requires an exact executable at the DENO_DIR `dl/` path or the exact 0.25.5 package as the npm fallback; both were independently absent. Upstream source predicts package resolution/acquisition on the later bundle initialization path. Since no bundle command was invoked, acquisition is not an observed event. The prerequisite is sufficient to stop; no backend or workspace path is executed.

| Control | Run status | Prediction retained from Slice05 plan |
|---|---|---|
| C1 | unrun | No library import; exact stdout/result `BASE`; all stdlib identities absent from graph and retained contribution, with C5 as the positive library consumer. |
| C2 | unrun | JSON-only `{"x":1}` returns exactly key `x` with numeric value 1; no YAML edge or retained contribution; C5 positively imports YAML. |
| C3 | unrun | JSON value-only subpath yields the same exact value; document/file-helper modules have neither graph edge nor retained contribution; C5 exercises helper subpaths. |
| C4 | unrun | Used function returns 42, exact effect order/count is `["init:effect","entry:42"]`, unused known-pure declaration may drop. No sixth throwing variant is included in this five-program protocol; original Slice01 throwing-initializer obligation remains open. |
| C5 | unrun | One shared positive consumer imports every declared specimen root/subpath; JSON/YAML/file-helper behaviors remain usable independently of app pruning; no registry publication. |
| **Total** | **0/5 run; 5/5 unrun** | **No passing/failing behavior, retained-code result, divergence, or optimizer acceptance exists.** |

## Stop, decision ownership and re-entry

This is the authorized evidence-gap stop, not a passing or failing five-test experiment. The operator may authorize (a) review and acquisition of the exact 0.25.5 backend plus a separately bounded retained-code attribution method, (b) a separately scoped alternative evidence route, or (c) leaving the attempt stopped. CC chooses none of these. No possible change silently replaces original F-6/metafile or F-10/ESTree-walker evidence. Any re-entry needs new explicit authority, a fresh pinned source/tool/cache identity, the exact backend prerequisite resolved without wrong-version substitution, a dedicated non-default source task worktree, a predictions-before-run commit, and independently reviewable output attribution. An acquisition alone does not resolve the distinct attribution gap.

Open owners remain: CDC/operator for any F-6/F-10 evidence-contract amendment; later source owner for `lang/lib/` dependency/import/metadata/build compatibility; CDC for Slice01 F-1–F-12 evidence, divergences and independent closure; Project07 owners for P-01–P-08, final synthesis, licence/bootstrap/source/home proof, all 28 Y-14 and 36 unsupported Y-13 items, ADT/guide/book/representative-source obligations and human review. JSON remains before any production YAML authorization. Nothing here closes, narrows or substitutes those obligations. No experiment, source edit, build, task worktree, fixture, install/fetch, cache seed, CI trigger, push or publication occurred.

## Contract and validity limits

The machine-cache observations are bounded to the two exact required paths and the named 0.25.12/0.27.4 npm package directories. They do not establish that no esbuild versions or binaries exist elsewhere. Source says the native bundle backend may call npm metadata/tarball facilities when the exact path is missing; that is a source-grounded prediction, not an observed request/download. The cache may change after this date and must be rechecked before authorized re-entry. Deno command identity/hash does not establish its source build recipe.

Internal source flags do not prove tree-shaking outcomes. The exposed output summary is not a retained-code oracle; graph absence, source-map content, module counts, stdout and byte sizes each answer only part of the question. Because the exact backend prerequisite blocks even the first control, exposed-versus-internal attribution remains unresolved in this attempt. All five specimen statements are predictions only and do not validate the Lykn syntax, package shape, JSON/YAML behavior, API exports, optimizer or effects.

## Iteration01 intake correction — 2026-11-05

The initial-attempt Intake table above is preserved as written. Its `cc-prompt.md` entry says required-full lines 1–102, and its Project03-plan entry covers lines 76–95 plus current units at 97–104. CDC's initial review found the actual issued `cc-prompt.md` has 126 lines and the required Project03 extent continues through line 117. Those initial entries are not evidence that the omitted extents were read; this correction does not backdate or upgrade them.

Fresh targeted coverage in iteration01:

| Input | Correction read extent | Readback |
|---|---|---|
| `cc-prompt.md` | Required lines 103–126; current file length verified as 126 lines. Iteration01 prompt `cc-prompt-iteration01.md` lines 1–32 was read full. | Complete the first intake correction only. Preserve the preceding 1–102 entry as the initial attested extent; combined coverage now reaches 1–126, with no claim that the initial attempt read all 126. Do not reopen the experiment. |
| Parent `project-plan.md` | Required lines 76–117 loaded in iteration01. | Lines 76–95 state bounded authority and its evidence-gap endpoint; lines 97–104 list all current units; lines 105–117 retain the no-fabricated-arc/backlog boundary and say current research records do not establish future implementation definition-of-done. The earlier 76–95/97–104 receipt remains the initial record and is not treated as complete coverage of the now-required extent. |
| Current `cdc-verification.md` | Required-full, lines 1–41, initial review. | CDC holds DP-01 for the precise extent discrepancy but independently reproduced the pinned source/cache stop. DP-02/03 source/cache, DP-04 five predictions, and DP-05 residuals are retained without re-running them; all rows remain open and controls remain 0/5 run, 5/5 unrun. |

The source/cache findings and five-control predictions remain at their original source pin/date and evidence strength. This iteration changed no source observation, cache state, command result, experiment scope, or owner. It only corrects the text-coverage receipt and makes the current assignment/intake status explicit; DP-01 remains open for independent CDC disposition.
