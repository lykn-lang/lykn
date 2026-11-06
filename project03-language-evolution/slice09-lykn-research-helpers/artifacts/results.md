# CC intake and working record

## Intake coverage

Loaded in full: `cc-prompt.md` (120 lines), `slice-plan.md`, and `ledger.md`.
The ownership/allowed-paths/checks heading is in `cc-prompt.md`, not the slice
plan. The slice plan is the binding contract for this CC: the owned artifacts are
the four Lykn helpers plus README; allowed source-tree edits are AGENTS-only;
the accepted Python validator is retained temporarily for exact positive
parity, and the inline builder is not executable or repairable. The finite
controls are V0–V7 and R0–R3. Planning artifacts remain open for independent
CDC disposition. No unrelated tests/full-pilot rerun, compiler fixes, history
edits, merges, pushes, or cleanup are authorized in this iteration.

The planning worktree was clean at `f4ac5d64937dcec86122f3bc4b190aad498f5cf9`.
The six source homes were clean at the exact tips listed in the slice plan;
the worktree listing also showed two unrelated prunable `/private/tmp`
checkouts, outside the seven-home scope.

Required-full/section reads completed: planning `AGENTS.md` and source
`AGENTS.md` in all six homes (all seven tracked byte streams were verified
identical at SHA-256
`4e314256eec67945d229918ac9f443ea0b0684a199b497c3747be56440fd47a3`); Project03's
“Existing units” and “Definition of done and boundaries”; source a061
`skills/lykn/SKILL.md` sections Before You Do Anything, Bindings & Mutation,
Functions, Objects & Immutable Updates, Colon Syntax & Member Access, Error
Handling, Async & Concurrency, Anti-Patterns to AVOID, lykn CLI, Deno Runtime
and No-Node Boundary; source a061 `docs/guides/09-anti-patterns.md` ID-01,
18–20, 31, 35–41; and the complete source a061 Deno runtime basics guide.
The pinned Deno `types` output confirms `CommandOutput.stdout/stderr` are
`Uint8Array`, `Deno.writeFile` accepts `Uint8Array`, and `WriteFileOptions`
has `createNew`.

Required host material loaded: collaboration-framework entrypoint; PM README's
Autonomous Mode section; implementation-prompt guide's complete “Required
reading and CC intake”; testing entrypoint and complete Testing Discipline;
JavaScript/Deno sections Error Handling, Async & Concurrency, Deno Runtime,
and No-Node Boundary; and scientific-methods Comparison and Regression Testing.
The Lykn surface/reference and Deno runtime sections govern API use; host JS
conventions do not authorize JS implementation. Exact stdout parity on the
same frozen workspace remains distinct from V/R reconstructed controls.

Required-data and source witnesses: seven worktree tips/statuses revalidated;
both original Python hashes and scoped duplicate paths identified; original
validator body, failed inline-builder body, expected map/file sequence and
full positive stdout loaded; Slice06 driver's save-result and
public-snapshot/digest sections loaded; Deno types inspected. Tool pins were
verified locally: accepted `lykn` SHA-256
`544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`, Deno
2.9.6 SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
The frozen driver's UTF-8-decoded output receipt cannot be reused for byte-safe
evidence. `artifacts/results.md` is the named intake record.

## Contract readback

- `slice-plan.md`, “Binding implementation and oracles”: author logic only in
  Lykn; no Python or replacement scripting language for helpers, evidence,
  JSON, orchestration, or command construction. Native shell/CLI is limited to
  direct invocation/simple filesystem lifecycle. The only temporary exception
  is the exact unmodified, hashed original validator for parity, followed by a
  separately authorized cleanup after CDC review.
- `slice-plan.md`, “Fixed comparison/control population”: exact stdout and
  successful exit parity on the original positive workspace; V0–V7 validator
  controls and R0–R3 orchestration controls are finite and must retain actual
  failures. Reconstructed behavior is not exact parity with missing original
  orchestration source.
- `slice-plan.md`, “Guidance, deletion and acceptance sequence”: update only
  AGENTS.md in each of six source homes, keep seven guidance files byte-equal,
  and preserve their relative CLAUDE symlinks. New CC prompts must carry the
  same explicit no-Python rule and parity exception. This iteration returns
  before deleting source Python.
- `cc-prompt.md`, “Ownership, allowed paths and checks”: planning changes are
  restricted to this Slice09 directory and its assigned records; source homes
  permit AGENTS.md only; generated files are restricted to the task's ignored
  `target/slice09/`. Parent plan and BACKLOG are CDC-owned.
- Slice08's original `export-map-check.py` defines ordered 4/2/3 export maps
  and 13 public-file paths; adjacent `export-map-check.log` is the byte-exact
  positive stdout oracle. The inline builder's `en vargs` defect is preserved
  as an observed failure and is not repairable under this assignment.
- Slice06 `artifacts/source/driver.lykn` demonstrates process output and
  hashing, but `save-result` decodes stdout/stderr. It does not establish
  invalid-UTF8-safe evidence. The new runner must persist returned byte arrays
  before propagating a child failure.
- Source a061's API reference and pinned Deno types cover structural map
  checks, actual-byte hashing, `Deno.Command` output bytes, `writeFile`, and
  `createNew`. V6 is a changed emitted digest that still succeeds, not a
  frozen-content rejection test. R1 must preserve `[0,255,10]` and
  `[1,254,10]`, record child status 7, and prevent its sentinel action.

## Source and tool evidence

Intake is complete. Source tips, original hashes, positive stdout, tool hashes
and API contracts are recorded above. Implementation and control evidence will
be added here; all ledger rows remain open pending CDC review.

### Preserved authoring attempt

The first authored `public-check.lykn` source SHA-256
`80d58c8e926b81f090b1a47e15351b02ee1964d90b59969e4c5f72c4c4cd9f66` failed
with `unterminated list at 45:5`; its bytes were overwritten during iteration
before a snapshot was made. Its hash and failure output remain, but its exact
body is unavailable and is not reconstructed. A later failed body, SHA-256
`2f2ecd841f5bbd40f8955da97b3677237231d1a9fbf5f51ed0f07d8bdb5be77f`, is
preserved at ignored `target/slice09/attempts/public-check-2f2ecd841f5bbd40.lykn`;
it failed with the same parser error and its stdout/stderr are retained.
Initial `orchestrate.lykn` SHA-256
`1521d64955bfdd4de5d0eca376e8b8ddaa0f485dbd5a16ad0a585e4e84d0e5b5` is
preserved at `target/slice09/attempts/orchestrate-initial.lykn`; pinned
`lykn check` exit 1 reported `unterminated list at 37:1`, with raw output beside
the source snapshot. These are source authoring errors, not compiler blockers.

The first `check-helpers.lykn` compile used frozen source SHA-256
`7809bd640b11abcb23eee08912308f82b59668cbbc9bffec976f901b82ac6145` at
`target/slice09/empty/attempts/check-helpers-freeze1.lykn` and failed with
exit 1, `unterminated list at 71:1`. The exact source body is preserved; the
compiler diagnostic is retained in this record. This is a source parenthesis
error, not a language blocker.

`check-helpers` freeze2 source SHA-256
`5f4bf4bb09a12d0a468c9ef6873ebc2feece605c2c4bf81afaba05bf0b873488` is
preserved at `target/slice09/empty/attempts/check-helpers-freeze2.lykn`; the
pinned compiler again exited 1 with `unterminated list at 71:1`. The failure
body is retained exactly and the diagnostic is recorded here.

Subsequent `check-helpers` source bodies are also preserved in the numbered
`empty/attempts/` files. Freeze3 (`be89835e1367be8f19ad6c429910e83304ff56fdad2e7d482ef04bb019e693c8`)
reported the same line-71 unterminated list; freeze4
(`feff30c397eb81e87e051ff4b68d09670816207f17fd63d3df223a4ffb524b66`) and
freeze5 (`91d117d1e4526e41c1a0951c0ca4634f41837bb31132ac29a5e0a55b04460543`)
reported line 64. These are recorded compiler diagnostics from authored
parenthesis errors; no language blocker has appeared.

The first native Lykn format attempt on `check-helpers.lykn` used SHA-256
`af2b31ec2fcd70cc17723907ce740bfb45572d629ea50907fb4b22156bd8693d`, preserved
at `target/slice09/attempts/check-helpers-format-failure.lykn`. The formatter
reported exit 1, `unterminated list at 210:1`. The formatter successfully
formatted public-check and orchestrate before stopping on this file. The
failure source is retained; it is still source syntax, not a compiler defect.

After syntax edits, a second formatter attempt used source SHA-256
`f06dbefaf04d6b73c96cd3a72112f3c00b1b56f46e481c5671f9a8cbd6cc4962`, retained
at `target/slice09/attempts/check-helpers-format-184.lykn`; it reported
`unterminated list at 184:1`. This is a separate source authoring failure.

At precontrol source pins above, recorded `lykn check` results were success for
all four authored sources. Recorded lint results were one orchestrator warning
for a shadowed `index` binding (source SHA-256
`dd330605c081af8d150cb3e9bd1b228a25394af9940382dbfac9101575f2f2df`) and
success for the other three. Those earlier commands did not record an
executable path alongside the result, so they are not presently certified as
using the accepted binary pin. The shadowed-binding source is frozen at
`target/slice09/empty/attempts/orchestrate-precontrol.lykn`.

## Current stop record

No V0–V7 validator controls, R0–R3 orchestrator controls, or original-Python
parity run occurred. The sole runtime event was the earlier pre-freeze child
fixture launch; it is a separate authoring attempt, not accepted R1 coverage.
Its exact Lykn source is preserved at
`target/slice09/attempts/child-fixture-early-r1.lykn` (SHA-256
`a798419b11521c4b765a14dfe04e26ec36ffa0aed8d2a2a323a86e24e6b02168`), with
generated JS alongside it. Captured stdout bytes were `[0,255,10]`, stderr
bytes `[1,254,10]`, and process status 7. It did not exercise the orchestrator
or a following sentinel. The accepted Deno pin was SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.

In the current turn, candidate freezes were copied before CLI invocations:
`public-check-candidate-freeze1.lykn` (SHA-256
`da1f13a854995696907fe4df037802516ba3a50f67cc75a9b5e100a5949c735d`),
`orchestrate-candidate-freeze1.lykn` (`7569339d5f4e2e1480c61c435f9e41461af55ce54da7c66dc5f06429b4a20d19`),
`check-helpers-candidate-freeze1.lykn` (`eab8d1709edfc1e2c7440da66b6581d1f29eb84e4a5530cfb752ea28479b5b4b`),
and `child-fixture-candidate-freeze1.lykn`
(`a798419b11521c4b765a14dfe04e26ec36ffa0aed8d2a2a323a86e24e6b02168`), all
under the task checkout's `target/slice09/empty/attempts/`.

Tool provenance correction: those current-turn checks, lints, and compiles
used `/Users/oubiwann/.cargo/bin/lykn`, SHA-256
`c02d3b844d1d3243f5ad0d4793e3cd2c691038f9011e43734513e1dd19b6bb03`, not the
accepted task binary. Each `lykn check <freeze>` exited 0. Each
`lykn lint <freeze>` exited 1 with the CLI message that Lykn-source linting is
not implemented. Each `lykn compile <freeze> -o <target/slice09 file>` exited
0; orchestrator emitted unused-binding warnings at 286:1 and 85:3, while
check-helpers emitted warnings at 13:9, 237:12, 237:27, and 720:1–728:1. These
results and generated JS are not accepted-tool evidence. The executable at
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn`
was independently hash-identified as the accepted SHA-256
`544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`; it was
not invoked in this turn. Earlier checks in this record lack an explicit
binary path and remain unverified for pin compliance.

The wrong-binary generated outputs were copied to uniquely named ignored
attempt paths: `public-check-compiler-blocker-freeze1.js` (SHA-256
`80e5fde8ea36a6f9c744efd99a17cae153d46a8024ebb236b95853ec9292813f`),
`orchestrate-compiler-blocker-freeze1.js`
(`256cbb8fff947f68d98cd3277f8129aaa0af7cca8c6138ce78dd431238fcb3aa`), and
`check-helpers-compiler-blocker-freeze1.js`
(`635459667fa71da1a063de364bfb060b2a5258ed43f756ce162cead844cab119`).
These are preserved as generated-output witnesses only; their content is not
evidence about the accepted compiler. The four wrong-tool source/output pairs
are grouped under
`target/slice09/attempts/global-lykn-c02d3b844d1d-2026-11-06/`. Exact source
hashes are listed above and the generated-output hashes are recorded in this
section. During inspection I also learned that
the current check-helpers candidate has a missing function boundary before
`run-validator-controls`; its later nested-if/catch output is therefore
confounded and is not classified as a language defect. No compiler blocker is
claimed by this CC. CDC independently checked the public-check freeze using
the accepted binary and reported exit 0, empty stderr, and valid emitted
statement-form `if`s. The failed wrong-tool output is superseded as compiler
evidence. CDC will independently handle the check-helpers source-boundary
correction under a separate iteration. Do not run controls or original Python
while that review is pending.

Policy synchronization was completed as seven AGENTS-only commits:
planning `c7f3770df38461d3007efaa81f62022f67d965bc`, main
`6ed2c58742917386a83a41b8922b921b3064ad89`, release/0.6.x
`ae51223089def7b7b3498519d9f51283b3a6065b`, release/0.7.x
`e693bf98f13d859c9ec6a1ff941bdb8d830aa62c`, release/0.8.x
`c733f7abe1a2d205aa18b10927dca9e32f340a45`, native-esbuild task
`3b12e2c885deff4395eaf60840961f6d590bbbc3`, and contract-predicate task
`bc83b43cc9084d0eddb910c73497cef0f9c43179`. All seven `AGENTS.md` files
have SHA-256 `1b5d78b96a4ef888153696e8e6656029ee24bc00be602ad5568e40265398c73d`,
mode `0644`; all seven `CLAUDE.md` symlinks remain relative targets to
`AGENTS.md`. Each of the six source homes passed `make check-cited-paths` at
its committed HEAD (62 documents on main, 63 on each release/task source home;
601 historical citations accepted in each).

All slice and ledger acceptance rows remain open for CDC. No helper, policy, or
original-source deletion acceptance is claimed here.

## Iteration01 accepted-tool source freeze and predictions

The iteration01 intake loaded `cc-prompt-iteration01.md` in full, including
the exact-tool correction and complete scope; the sibling slice plan and ledger;
the current planning AGENTS; all four current Lykn files and README; the
preserved-authoring/current-stop sections above; and the complete CDC pin
recheck command/output evidence. The initial intake statement “No unrelated
tests/full-pilot rerun” means the fixed V0–V7 and R0–R3 checks remain required.
The ownership/allowlist citation belongs to the iteration prompt. The six
source `AGENTS.md` reads are recorded above. No policy was changed in this
iteration.

The accepted compiler was reverified at its absolute path and SHA-256
`544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`; every
accepted CLI call below used it from
`target/slice09/empty/`, whose explicit CDC `project.json` has SHA-256
`79eb6349b3638aaebd03b21d7418c81756b21bc870a0db50b300badc00c5f851`. Deno
remains the pinned `/opt/homebrew/bin/deno` SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.

Final sources committed for the fixed control run:

| Source | SHA-256 | Accepted-tool gate evidence |
| --- | --- | --- |
| `public-check.lykn` | `da1f13a854995696907fe4df037802516ba3a50f67cc75a9b5e100a5949c735d` | check, fmt-check, lint passed; compile exit 0, JS `161036f7c7c14d790f63e9d9b05cd5fc3148441a169bb421f0b13064e922ae24` |
| `orchestrate.lykn` | `7569339d5f4e2e1480c61c435f9e41461af55ce54da7c66dc5f06429b4a20d19` | check, fmt-check, lint passed; compile exit 0, JS `76ee6715db0b98b262a0b11abb7eb1a0338640cd93244387c6b10ef132a3a621` |
| `check-helpers.lykn` | `82f39a4d51b83f6489867c731cff8b018fecb657a562e414d5f8a7858c0910a0` | check (30 top-level expressions), fmt-check, lint passed; compile exit 0, JS `fb69bc0ca0366ec033df14e9e4cfb27d71e34c826a907ed424ab69eb54a618db` |
| `child-fixture.lykn` | `e3ba6c8de2be5cadec4778859290e4bc73db2c9b7e50e476072031144a832e86` | check, fmt-check, lint passed; compile exit 0, JS `8a7aa205172c05aad758081b1869b17c9b78a946f27ba5fa90f252c06593b6be` |

Final source bodies and compiler products are preserved under the ignored
contract-predicate-lowering checkout's
`target/slice09/empty/attempts/iteration01/`. The latest helper change removed
the unused `child-js` parameter from R0; R0 instead compiles the canonical
child source itself and uses that fresh output. Its pre-edit helper body is
preserved as `check-helpers-pre-r0-param-cleanup.lykn` (SHA-256
`535acf26e97505b0e8311fa67c7ef0d4bfc7bf3e6c97fc8f1f01b9c634713e17`). The
final helper freeze used for the latest check, format-check, lint, and compile
is `check-helpers-r0-param-cleanup-{check,fmtcheck,lint,compile}.lykn`, each
SHA-256 `82f39a4d51b83f6489867c731cff8b018fecb657a562e414d5f8a7858c0910a0`.
The compile output contains no `COMPILE_ERROR` placeholders and has top-level
`equalBytes`, `sameLinesExceptOne`, `runValidatorControls`, `runR0`, and
`runOrchestrationControls`; R0 receipt indices are compile 000, child 001,
copy 002, compare 003. Full generated bodies were inspected.

The accepted compiler emitted nonfatal unused-binding warnings for helper
parameters `left`, `before`, and `after`; CLI bindings `workspace`,
`public-check-js`, `child-js`, `orchestrate-js`, `child-lykn`, and `task-root`;
and top-level functions `equal-bytes`, `same-lines-except-one`,
`command-action`, `copy-action`, and `compare-action`. The generated JS uses
each named parameter, binding, or function in the fixed controls (for example,
byte comparison, V1/V6 line checks, CLI dispatch, and action creation). They
are retained as observed static analyzer warnings, not suppressed or described
as warning-free. The earlier helper source with explicit `(return ...)` and
its malformed generated `const result = return ...` are preserved as a
source/generated witness; the guide-backed implicit final-value form fixed
that source, and no compiler defect is claimed. The earlier candidate compile
and generated product are not replaced by this final pair.

Before any remaining runtime, the committed predictions are:

| Case | Expected observation |
| --- | --- |
| V0 | Original positive workspace succeeds; retain raw stdout for external parity. |
| V1 | Reordered source and dist JSON export properties pass; map output and the other 12 digest rows are unchanged; only `target/lykn/dist/json/deno.json` has its actual reordered-byte digest. |
| V2 | Source-only missing `json ./value` export fails with the expected source map key-count diagnostic. |
| V3 | Dist-only wrong `json ./value` target fails with the expected target diagnostic. |
| V4 | One extra dist export fails with the expected dist key-count diagnostic. |
| V5 | Missing `json/value.js` fails with its expected not-a-regular-file diagnostic. |
| V6 | One valid first-byte mutation of dist `effects/effect.js` succeeds and changes only that file's expected digest row. |
| V7 | Unchanged clone under a path containing spaces succeeds with byte-identical stdout to V0. |
| R0 | The orchestrator directly compiles the copied Lykn child with the exact pinned compiler in a space-containing cwd, runs the fresh JS with literal spaced/metacharacter args, then copies and byte-compares three bytes; receipt order and argv/cwd/status match source assertions. |
| R1 | Invalid UTF-8 stdout `[0,255,10]`, stderr `[1,254,10]`, child/outer status 7; sentinel and receipt 001 are absent. |
| R2 | Unequal bytes produce false and status 1; sentinel and receipt 001 are absent. |
| R3 | No-clobber copy fails, existing destination remains `[4,5,6]`; sentinel and receipt 001 are absent. |

This is a source/prediction freeze only; no V0–V7 controls, accepted R0–R3
controls, or original Python parity run has occurred in iteration01 yet. The
pre-freeze raw child exit-7 attempt remains separately recorded above. The
previous current-stop note about a missing helper boundary/CDC source correction
is superseded by the accepted-tool generated review here: that suspected
compiler issue came from the wrong global binary and was disproven. The final
accepted-tool helper has coherent top-level boundaries. No original Python
deletion or acceptance is claimed.

## Iteration01 first runtime attempt and corrective freeze

After source/prediction commit `859f8f436991951898999c00aff910bbb7cb890b`,
the one permitted external original-validator execution ran exactly once with
Python `/Library/Frameworks/Python.framework/Versions/3.11/bin/python3`
(SHA-256 `94a5f331b4d73cbabad9998057013f4d4b6ab2c2d1c3042a1a6e4e56d94773a6`),
against its hardcoded unchanged accepted workspace. The exact unmodified source
was `export-map-check.py` SHA-256
`8bdaed8398d03e491cb6b349c7d764fc5d8066a6bf1d2467161d037dee105865`; command
exit was 0. Raw stdout and stderr were directed to ignored
`target/slice09/parity-iteration01/original.stdout.bin` and
`original.stderr.bin`; parity is not yet established until a successful V0
output is compared byte-for-byte with the saved original output. This exception
has been consumed; no second original-validator execution is authorized by
this prompt.

The first frozen control invocation used Deno SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`, frozen
helper JavaScript SHA-256
`fb69bc0ca0366ec033df14e9e4cfb27d71e34c826a907ed424ab69eb54a618db`, and new
run root `target/slice09/run-iteration01-2026-11-06`. The direct Deno command
was the seven-argument invocation recorded in the committed README with
`frozen-iteration01/` substituted for the four JS paths. It exited 1 during
V1 after V0 had completed. The captured runtime error was:

```text
ReferenceError: sha256 is not defined
  const v1ManifestHash = await sha256(await Deno.readFile(`${v1Path}/target/lykn/dist/json/deno.json`));
                         ^
    at runValidatorControls (.../frozen-iteration01/check-helpers.js:140:26)
```

This was a missing helper in the CC-authored check driver, not a language or
compiler finding. Keep this failed attempt and its partial controls in that
run root; do not treat V1–V7 or R0–R3 as executed or reuse the root. The
original runtime's text/status are captured here from the direct tool result;
no separate raw stderr file was produced by that invocation.

The correction added the already used `sha256` implementation from the public
validator. The exact corrected helper source SHA-256 is
`26967707f6ee820218d0d97dd7475756c552150d44f7bd22a6573dfdc80c8b66`, frozen
before each affected accepted-tool call as `check-helpers-v1-sha-helper-{check,
fmt,lint,compile}.lykn`. With the accepted absolute compiler at the recorded
empty project cwd: check passed (31 top-level expressions), fmt-check passed,
lint reported no findings, and compile exited 0. The generated JS is preserved
as `check-helpers-accepted-compile4.js`, SHA-256
`ad68208c9654f732756bc19f1f99becfd56d1faab3d280c52c682ab3a5fc201d`; it
contains `async function sha256` and no `COMPILE_ERROR` placeholder. Nonfatal
unused-binding warnings remain and are retained as described above.

The corrected helper plus this actual failed-attempt record must be committed
before any new runtime. The remaining fixed controls use a fresh run root;
compare successful V0 stdout with the already saved original output via native
`cmp`. Preserve both the failed run and any later outcomes. No further Python
execution, original deletion, or acceptance is claimed.

The next frozen invocation used helper4 JS and fresh run root
`target/slice09/run-iteration01-v1-2026-11-06`. It passed V0–V4; V5 returned
nonzero from the validator as required, but the driver then failed its
over-specific error assertion. Captured stderr reports Deno `NotFound` for
`/target/lykn/dist/json/value.js`, with exit-status file `1`; stderr SHA-256 is
`b0c440b3f2d7dd53d2cf78262457f64258d50e0bd7c2d91524e2dd968858d1b9`. The
binding slice plan requires a missing target to fail nonzero with context; it
does not prescribe the exact text. `Deno.stat` raises `NotFound` before the
regular-file predicate, so the source validator remains unchanged. The driver
now checks both the `NotFound` classification and the exact missing dist path,
retaining contextual coverage without demanding an invented custom message.
V6, V7 and R0–R3 remain unrun in this attempt.

The corrected V5 assertion source is SHA-256
`82fca2d87cd5c07ee4545b51a6fa721ed0d5bfab7db126d5f2e53e46eb2a3e89`, frozen
before each affected accepted-tool gate in
`check-helpers-v5-error-context-{check,fmt,lint,compile}.lykn`. From the
explicit empty project cwd, accepted `check` passed (31 top-level expressions),
`fmt --check` passed, `lint` reported no findings, and compile exited 0 with
nonfatal unused-binding warnings retained. Generated output
`check-helpers-accepted-compile5.js` has SHA-256
`ad68208c9654f732756bc19f1f99becfd56d1faab3d280c52c682ab3a5fc201d`; it
contains the new V5 context assertions and no `COMPILE_ERROR` placeholder.
This correction and V0–V5 failure evidence are committed before the next fresh
runtime. No new case was added, and neither the original validator nor source
workspace was rerun or changed.

Hash receipt cross-check: the V5 paragraph above mistakenly copied the
compile4 output hash (`ad68208c9654f732756bc19f1f99becfd56d1faab3d280c52c682ab3a5fc201d`)
into its compile5 row. The actual compile5 JS and fresh runtime copy both
hash `30ff4d62639584243987819b2340b0eaad67201e82ed8068f601f8154577a768`; a
native `cmp` found them byte-identical, and inspection confirmed the compiled
NotFound and exact missing-path assertions. No runtime was launched with the
stale compile4 product for the V5 correction.

With the byte-verified compile5 helper copy, the next frozen runtime at
`target/slice09/run-iteration01-v2-2026-11-06` passed all V0–V7 controls. The
helper then exited 1 at R0 before invoking the orchestrator: the outer Deno
process was not granted read access to the planning-tree child source passed as
`CHILD-LYKN`. The exact error was `NotCapable` at `Deno.copyFile(childLykn,
compileSource)`. R0's compile/copy/compare actions did not run, and R1–R3 did
not run in this attempt. Preserve its successful V0–V7 receipts and the R0
permission failure in that run root.

The same run's V0 stdout is byte-identical to the single saved original Python
stdout under native `cmp`: both SHA-256
`c30a0ead3be94937397eca741072b1cec799af0ee5c0d96d0cdc8d96c21fa92c`. Original
Python exited 0 with empty stderr; the Lykn V0 exit-status receipt is 0. The
original parity exception has therefore been exercised once and exact positive
stdout/status parity is established on the unchanged accepted workspace.

Invocation correction: stage the committed child Lykn source under the already
granted task target and pass that staged copy to R0. Its source SHA-256 remains
`e3ba6c8de2be5cadec4778859290e4bc73db2c9b7e50e476072031144a832e86`; the
target copy at `frozen-iteration01-v3/child-fixture.lykn` has the same hash.
The README now shows this exact staging step and path. This only corrects the
outer Deno file-read grant through an already-authorized target path; helper
source, compiler output, case population, and permissions scope are unchanged.
The next R0–R3 execution uses fresh root
`target/slice09/run-iteration01-v3-2026-11-06`; no second Python invocation is
required or will occur.

## Iteration01 fixed-control outcome

The final fresh run used Deno SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`, helper
source SHA-256
`82fca2d87cd5c07ee4545b51a6fa721ed0d5bfab7db126d5f2e53e46eb2a3e89`, generated
helper SHA-256
`30ff4d62639584243987819b2340b0eaad67201e82ed8068f601f8154577a768`, and
fresh root
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/run-iteration01-v3-2026-11-06`.
The four JS products were frozen beneath `target/slice09/frozen-iteration01-v3/`;
their hashes are recorded above and the child Lykn source staged there is byte
identical to committed SHA-256 `e3ba6c8de2be5cadec4778859290e4bc73db2c9b7e50e476072031144a832e86`.
The actual direct Deno invocation and all seven arguments are recorded in the
committed tooling README. It exited 0 and printed `V0–V7 passed`, `R0 pass`,
`R1 pass`, `R2 pass`, `R3 pass`, and `R0–R3 pass`.

| Case | Captured outcome |
| --- | --- |
| V0 | Exit 0; stdout SHA equals original validator SHA `c30a0ead3be94937397eca741072b1cec799af0ee5c0d96d0cdc8d96c21fa92c`. |
| V1 | Exit 0 after source and dist map reorder; expected map output and only the reordered dist JSON manifest digest change. |
| V2 | Nonzero with the expected source `json` map key-count diagnostic. |
| V3 | Nonzero with the expected dist wrong-target diagnostic. |
| V4 | Nonzero with the expected dist map key-count diagnostic. |
| V5 | Nonzero; stderr reports `NotFound` and the exact missing `target/lykn/dist/json/value.js` path. |
| V6 | Exit 0; the sole changed digest row is `target/lykn/dist/effects/effect.js`, matching its mutated bytes. |
| V7 | Exit 0; the unchanged space-path clone's stdout is byte-identical to V0. |
| R0 | Exit 0. Receipt 000 directly invoked the accepted compiler with `compile <child-fixture.lykn> -o <child-fixture.js>` from `compile cwd with spaces`; exact compiler SHA is the accepted `544041ec…`. Compile code 0, stdout empty, stderr retained with the warning below. Receipt 001 ran Deno with argv `space value` and literal `literal;$(echo no-shell)`, code 0, exact JSON stdout and empty stderr. Receipts 002/003 copied 3 bytes and recorded `equal: true`. |
| R1 | Outer and child status 7. Captured stdout bytes `00 ff 0a`; stderr bytes `01 fe 0a`. Sentinel and receipt 001 are absent. |
| R2 | Unequal three-byte inputs record `equal: false`; outer status 1. Sentinel and receipt 001 are absent. |
| R3 | No-clobber copy fails; existing destination remains `04 05 06`. Sentinel and receipt 001 are absent. |

R0's accepted compile receipt preserves an 80-byte stderr warning: `3:1:
warning: unused binding 'mode'` (SHA-256
`2fd076b63d64c14f98e1b9d4158e78c91c24252a749ea00aad43fbefd77ecce7`). The
compiled child uses `mode` in its raw-failure/sentinel dispatch; the warning is
retained as an observed unused-binding analyzer warning, not suppressed. R0
compile receipt argv, cwd, environment and code, R0 Deno argv/cwd/code, raw
R1 bytes, R2 result, R3 destination bytes, and all V/R outputs remain under the
ignored run root. The two earlier runtime failures (missing local `sha256`,
then source-tree read permission) and the V5 assertion correction remain
separately preserved at their original run roots; they were not overwritten or
relabelled as successful attempts.

The exact Python/Lykn positive stdout and status parity is established on the
same unchanged accepted workspace. The original unmodified Python source was
executed once, its exception is consumed, and no cleanup/deletion or CDC
acceptance is claimed. Policy commits remain as previously recorded; LH-01–07
and all slice acceptance rows remain open for independent disposition.

## Iteration02 scoped cleanup — CC proposed-done

Required intake completed before mutation: `cc-prompt-iteration02.md`,
`slice-plan.md`, `ledger.md`, Slice09 `cdc-verification.md`, planning
`AGENTS.md`, tooling README, and the fixed-control/original-parity section above
were read completely. I read the complete three pre-cleanup bodies and checked
the original plan's scope/deletion contract. Planning began clean at
`e9555ecd3bb62af36a66bbfe68affd770a9ae206`; the source task worktree remained
clean at `bc83b43cc9084d0eddb910c73497cef0f9c43179`. CDC had independently
accepted helper output byte identity, all 12 controls, exact saved-oracle and
baseline parity, and the seven-home policy/citation gates. The only remaining
work was the exact scoped cleanup and usable README. No Python ran in this
iteration; the parity exception was already consumed.

Before mutation, each original matched its immutable planning commit
`7048fba9c5da1fefef4659d9c668d0b01d4616eb` blob and expected mode `100644`:

| Original body | Git path at immutable commit | Blob | SHA-256 |
| --- | --- | --- | --- |
| Slice08 validator | `project03-language-evolution/slice08-template-string-boundary/artifacts/evidence/pilot/run-01/raw/staging/export-map-check.py` | `37e39ae6bc285a9a6212efd6725b5e1e1222562c` | `8bdaed8398d03e491cb6b349c7d764fc5d8066a6bf1d2467161d037dee105865` |
| Slice08 failed inline builder | `project03-language-evolution/slice08-template-string-boundary/artifacts/evidence/pilot/run-01/raw/gate/launch-setup-error-01/command.txt` | `dbf448910ab1ac9ad9ab286b4c435f9c24c4c60a` | `01b6100ba22d690908dcda64c0bd89e9f4d0cf6fab73cd384e3a493dee060797` |
| Slice07 dist-only checker | `project03-language-evolution/slice07-contract-predicate-lowering/artifacts/evidence/phase-b/run-02/raw/staging/commands-reconciliation.txt` | `5881e780c6b08db528dd2b54e775d04f2eb97ad1` | `1477a1d9ac168aec06c239f6c0772ecc75f3d68ec70d5d84b99bcecca73e3c8e` |

The ignored Slice08 task counterparts of the validator and inline-builder files
were present, mode `0644`, and byte-identical to their tracked originals before
cleanup. The Slice07 task target contains no reconciliation-body duplicate.
The tracked and ignored `stderr.log` copies (SHA-256
`a04627a721f5de85fd2c39791ce16df7f3521bad33ddc203b0e446d011aaab64`) and
`exit-status.txt` copies (SHA-256
`4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`, content
`1`) were `cmp`-identical before and after replacement and were not edited.
Their retained stderr includes the actual SyntaxError and invalid source
fragment; the failed gate command was never invoked. Slice07's prior positive
output log remains SHA-256
`235ddc00dd83c6f295500d512868fe249998f36a981bfb8ce1577d6d055072cd` and its
stderr remains empty (SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`). CDC
reconciled its 13 lines with V0's first 13 lines; this was not re-executed.

Removed the tracked Slice08 `export-map-check.py` and its exact ignored copy.
Added adjacent `export-map-check-source.md` (mode `0644`, SHA-256
`74dc65c258686670f83350277dc9492bd0028c115be5917cda35ecd09775a531`) with the
immutable source locator and the replacement/parity paths. Replaced the full
inline-body `command.txt` in both tracked and ignored Slice08 homes with
identical metadata (mode `0644`, SHA-256
`262b1aef8989f82abb18dd168111b12510078b185ae2b8fdc60c0ee8d7246e0e`); the
metadata identifies the failed setup, exact retained stderr/status and source
commit/blob/hash. Replaced Slice07's complete here-doc file with metadata
(mode `0644`, SHA-256
`69bf690df50572c19c88ae661da618fd125bb6b842f1779ee190dc198dc38fca`), keeping
its prior log/stderr and explaining why the separate short `commands.txt`
label is not an executable source. All three body removals are dated
2026-11-06, after functional parity acceptance and before independent cleanup
verification. No Python body was copied, backed up, archived, or executed.

The README now states that no Python execution or exception remains. Its
compiler recipe copies the CDC empty config into a fresh named cwd, runs every
compiler command from that cwd, uses paths valid from there, stages the child
under the granted task target, and sends generated products and a new run root
to fresh iteration02 paths. The accepted helper also uses the pre-existing
`target/slice09/empty/project.json` for R0; its known hash is documented and
the file remains untouched. No helper `.lykn`, generated accepted product,
AGENTS file, source implementation, status, stderr, or prior run receipt was
changed.

Final native inventory commands were run over Slice06–08 `artifacts/` and task
`target/slice07/`, `target/slice08/`, `target/slice09/`:

```sh
find /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice06-native-esbuild-controls/artifacts /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice07-contract-predicate-lowering/artifacts /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice08-template-string-boundary/artifacts -type f \( -name '*.py' -o -name '*.pyc' \) -print
find /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice07 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09 -type f \( -name '*.py' -o -name '*.pyc' \) -print
rg -n --hidden --glob '*.txt' --glob '*.md' --glob '*.log' --glob '*.sh' \
  -e 'python3?[[:space:]]+-[[:space:]]*<<' \
  -e '^import (hashlib|json|pathlib)' /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice06-native-esbuild-controls/artifacts /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice07-contract-predicate-lowering/artifacts /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice08-template-string-boundary/artifacts
rg -n --hidden --glob '*.txt' --glob '*.md' --glob '*.log' --glob '*.sh' \
  -e 'python3?[[:space:]]+-[[:space:]]*<<' \
  -e '^import (hashlib|json|pathlib)' /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice07 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09
```

Both final scans returned no paths or code-body matches. Before deletion, the
first scan found only the tracked Slice08 validator and its ignored copy; the
body-pattern search found only the Slice07 here-doc and the two tracked/ignored
Slice08 inline builder copies. The broader post-cleanup text review found only
historical prose/metadata, the separate Slice07 `commands.txt` label
`python3 export-map-check.py ...` (confirmed not an invocation), and a
third-party Python mention in generated Deno type documentation. Those are not
program bodies; Slice08's prior results retain factual narrative, not code.
Slice03 and other projects remain outside this inventory and unchanged.

README and cleanup locators are prepared for commit in the authorized paths.
This is CC proposed-done evidence only. No Rust make check, compiler gate,
control rerun, source cleanup, or Python execution was added. LH-03, LH-06,
LH-07 and all slice acceptance rows remain open for CDC final disposition.
