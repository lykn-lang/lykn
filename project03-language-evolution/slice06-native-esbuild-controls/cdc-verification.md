# Slice06 CDC verification

## In-progress source review — 2026-11-05

CDC Sol 6.1 High, independent of CC Luna 6 High. Initial source freezes 9ced73a,
input correction 8fd1f4d, observer syntax repairs ebfc219/0818be3; active initial
assignment cc-prompt.md. Native tools and 15 modules reported built/compiled,
observer now syntax-compiles, run-03 dist stages successfully. No bundle/runtime
has run. These current build/compile claims remain CC attested until final replay.

**Verdict: return bounded observer/C5 correction before C4 execution.** Syntax
success does not establish host API correctness, complete observation or API
coverage. Current follow-up is cc-prompt-iteration01.md. This is first substantive
refinement; earlier delimiter/input source commits and all failed states remain.

Inspected complete committed driver 0818be3, C5, source package configs and current
results, without writing implementation. Confirmed these contract defects:

1. Driver alias/argument builders call String:slice, String:lower-case and
   Array:push. These emit nonexistent String.slice/String.lowerCase/Array.push.
   Receiver methods are required; task's ECMAScript 2025 corpus places slice at
   String.prototype (22.1.3.22), toLowerCase at String.prototype (22.1.3.28), and
   push at Array.prototype (23.1.3.23). Lykn guide Modules/Colon Syntax and
   anti-pattern 47 establish receiver syntax; skill mutation guidance recommends
   functional builders or cell+conj. This is an LLM-authored host-API mistake,
   not evidence of a compiler defect. No failing runtime was deliberately run.
2. Driver bundles/runs but never parses or records actual metafile observations,
   and does not implement the declared graph/contribution/public-byte checks.
   Existing manual C4 code inspection remains necessary, but cannot substitute
   for the approved Lykn observer's finite JSON observation/oracles.
3. Both C5 unbundled observations save to C5-source-run.json: final run would
   overwrite initial data. No overwrite has happened because runtimes are unrun.
   Give before/after distinct immutable receipt labels before execution.
4. C5 labels fileRoot/documentRoot as root observations while importing those
   names from the subpaths twice. JSON root currently imports only parse-value;
   the root's read-text/document-label named exports are untested. Import/call
   them from @probe/json root and retain corresponding subpath calls. This
   changes only C5; output prediction and five-stimulus/nine-key scope stay fixed.

A guessed installed Deno lib.es5.d.ts path was absent during reviewer lookup;
no inference used it. The actual repo ECMAScript corpus sections above were
loaded directly. No new probe program, compiler change or broad inquiry was
commissioned. Domain guidance was read; receipt alone does not prove application.

Evidence applicability: retain native tool source/build receipts, pinned compiler,
unchanged library/config/data source states and 14 unaffected module compiles at
run-03 as attested pending final independent replay. C5 and observer must recompile;
C5 staging must update and byte equality/config checks remain required. No need
repeat the 14 solely for observer fixes. Preserve runs 01/02 parse failures and
run-03 success/staging observations. Tool proofs will be independently checked
at final acceptance; nothing is prematurely promoted. All seven NE rows remain
open; all five bundles/runtimes remain unrun. Prior F/Project07 obligations unchanged.

## Final independent review — 2026-11-05

CDC Sol 6.1 High reviewed CC Luna 6 High candidate
6ccfd9e41522478702afaeb997e279b044280276, initial prompt and iteration01,
complete source population, results/closeout, actual C4 code/metafile/argv,
first C5 failure and retained attempt history. Source files are unchanged since
30e97932dc2cabeaa243338f405a5b8fe6399c10. CDC implemented no specimen/observer
repair. The earlier review above remains historical; this verdict is current.

**Verdict: accept the delivered native tool and bounded stop, with four rows
done and three deferred. The five-control experiment did not pass.**

### Independently reproduced evidence

Native reproduction used private /private/tmp/lykn-cdc-native-review.gqz91V,
not CC's writable cache or checkout. Exported the immutable esbuild Git object
ea453bf687c8e5cf3c5f11aae372c5ca33be0c98, copied its exact acquired module cache
into a separate review cache, and read both manifests and both licence texts.
The manifests match the recorded hashes; the sole x/sys version and both sums
match the approved pins. Go executable hash be0aa789…be511 matches the plan.
With private GOPATH/GOMODCACHE/GOCACHE/GOTMPDIR, GOENV=off, GOWORK=off,
GOTOOLCHAIN=local, GOPROXY=off, the recorded checksum controls, CGO_ENABLED=0,
GOOS=darwin and GOARCH=arm64, go mod verify returned “all modules verified”.
The same readonly/trimpath/no-VCS-stamp build recipe produced SHA-256
b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f, exactly
CC's native binary. Version/help and go version -m confirm 0.25.5, metafile and
tree-shaking flags, Go 1.24.3 and the exact x/sys sum. No reviewer acquisition,
Node/npm command or CC-cache mutation occurred. Historical acquisition/DNS/
permission receipts remain CC-attested; independent reproduction validates
the actual pinned inputs/output without inventing an observed redirect trace.

After ownership return, repeated the task's offline/locked Cargo build: exit 0,
unchanged native Lykn hash 66e9f8f…51dd and Cargo.lock bbec9052…ca92. Rechecked
Cargo/rustc 1.97.0, task branch codex/native-esbuild-controls at exact 74a90d5,
clean tracked source, clean upstream esbuild checkout and unchanged manifests.
AGENTS equality/read receipts and managed-tool fallback remain applicable from
the unchanged opening boundary; no source implementation was added. Deno hash
2ad84f9e…ce74 is unchanged at the pinned 2.9.6 executable.

For independent experimental replay, exported the immutable 30e9793 source
population to the private review workspace. Inspected all five stimuli, ten
supports, five configs, driver and seven literal data bytes; hash is exactly
5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22.
All 16 default strict native compilations exited 0. Native dist exited 0;
all 15 staged stimulus/support JS files byte-match their direct CLI outputs.
Inspected generated member names and all nine public export keys/targets;
this is map/path evidence, not runtime API acceptance. Formatter check on the
changed driver/C5 passed, driver check passed (39 top-level expressions), and
lint found no findings across all 16 sources. Compiler unused-binding warnings
remain verbatim in the independent driver log; they were not suppressed.

The reviewer invoked the generated Lykn driver with the same explicit Deno
flags and minimal read/write/run grants, own native esbuild binary and isolated
DENO_DIR. Gate exited 0. Read complete C4 source, all four generated effects
modules, complete 538-byte bundle and raw metafile before controls. Own bundle
and raw metafile byte-match CC's retained records; bundle SHA-256 is
6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a.
Concrete used(n)=n+1, its type checks/call(41), and console effect remain;
the entire unusedPure(n)=n*2 declaration/body is absent. Dead.js is nevertheless
resolved (406 input bytes); it has no output contributor row. Used/effect
contribute 365/28 bytes, barrel 0. This demonstrates the finite attribution
capability, without equating graph membership with retained bytes or claiming
a full ESTree scan. C5 positive corroboration remains missing.

Then invoked only the prescribed controls phase with that reviewed C4 hash.
It saved C5-source-before (exit 1, empty stdout), then stopped. Deno rejects
yaml/value.js line 4, `if (!text = "answer: 42")`, before module evaluation.
Own generated YAML file byte-matches CC's witness at SHA-256
4023bd054662c54a0518b369cd297756821dceb65581feb9e34a28ad4f9fe8bd.
Both the outer driver status and inner failed child status are 1; the shell's
successful receipt-printing command is not experimental success. No later
runtime, bundle, source workaround or extra case was executed.

Durable independent raw receipts/logs are in
[artifacts/evidence/cdc-review/](artifacts/evidence/cdc-review/), including
16-compile summary, dist, formatter/lint, warnings, gate/controls exit status,
native C4 argv/result and failed first C5 argv/result. Byte-identical code/meta
and YAML witnesses reuse the existing CC records rather than duplicate them.
The private replay paths identify reviewer runs; reusable tools and exact
source/module inputs remain in the documented ignored task tool home.

### Finding, counters and final row walk

**NE-C01 — documented equality in a precondition emits invalid JS.** The
source's `(= text "answer: 42")` is documented strict equality in pinned
00-lykn-surface-forms §Equality/DD-22 and anti-pattern ID-01; :pre is documented
under Functions. The actual generated assignment contradicts that specific
contract. Cause, affected population and repair remain uninvestigated; this
is not a general compiler audit. Existing [Project03 backlog A4](../BACKLOG.md#native-pilot-compiler-follow-up-ne-c01)
owns the follow-up. CDC prepares a separate bounded compiler-diagnosis/fix
assignment only after Operator authorization; future CC implements and a fresh
review independently verifies it before re-entry. No assertion stripping,
kernel spelling substitution or reordered controls is accepted as a pass.

| Count, per author/reviewer attempt | Executed | Unrun |
| --- | --- | --- |
| Stimulus definitions | Five frozen; zero completed functional programs | None dropped |
| Native bundles | 1/5, C4 success | 4/5 |
| Runtime invocations | 1/11, first C5 failed before evaluation | 10/11 |

Author and reviewer each reached this same stop; replay is not an extra control
family and does not turn two failed attempts into two completed cases. Earlier
four delimiter failures (run-01/02/04/05), input-LF correction, wrapper error,
run-08 reserved-word parse and run-09 invalid-await parse remain separately
retained. Source freezes preceded each dependent attempt. The catch sentinel
also remains: invalid expression-position no-else authoring is documented by
DD-50; native compile/check accepting an emitted sentinel is a separate
diagnostic-coverage observation. No runtime was run merely to demonstrate it.

| Row | Final disposition | Independent basis / re-entry |
| --- | --- | --- |
| NE-01 | done, reproduced | Immutable source/manifests, exact module sums, isolated offline native rebuild and identical binary hash. |
| NE-02 | done, reproduced | Exact task/source/lock identities, unchanged tracked source, repeated offline locked Cargo build. |
| NE-03 | done, reproduced | Frozen population/predictions chronology, exact bytes, all native compiles and staging/map equality. This row does not assert generated JS passed runtime parsing. |
| NE-04 | deferred | C4 attribution reproduced, but required later C5 unused-pure positive contribution/behavior is unrun; re-enter after separately verified NE-C01 resolution and authorized complete sequence. |
| NE-05 | deferred | First C5 fails before evaluation; remaining 10 runtimes and all paired behavior/effect/API oracles unrun. Same owner/re-entry as NE-C01. |
| NE-06 | deferred | C1/C2/C3/C5 metafiles unavailable; later authorized unchanged five-case attempt must establish exclusions and positives after NE-C01. |
| NE-07 | done, reproduced | Seven rows retained, exact stop/unruns, artifacts/history/diffs and explicit backlog owner; source fixes and original audit/Project07 gates remain outside this close. |

Silent-drop check: all original Slice01 F-1–F-12 remain open, including full
families/inventory, emitter relevance/parity, minified/unminified F-6, F-10 full
corpus/walker, divergence dispositions and complete report. Pilot does not amend
those contracts. Project03 composition stays open. Project07 P rows, consolidated
Arc04/P-06/P-07 research synthesis, new-code licence/bootstrap/actual-home proof,
28 Y-14 variants, 36 unsupported Y-13 cells and authoring/ADT/guide/book/human
gates retain their existing owners. No production library, publication or release
claim follows. Independent retrospective completes this collapsed slice endpoint.
