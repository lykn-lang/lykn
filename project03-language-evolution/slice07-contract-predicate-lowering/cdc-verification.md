# CDC independent verification

## Phase A — accepted, 2026-11-05

Reviewer: `/root/cdc`, Operator-selected Sol 6.1 High; implementation by the
separate fresh Luna 6 High `/root/cdc/repair_cc`. Reviewed planning handoff
`792b56870cbf0cf304a21f2400daaf9933be6cb4` and clean source
`86d116db5c096d0fff7ec555d388343946114e4d`, dedicated
`codex/contract-predicate-lowering`. No source implementation by this reviewer.

The complete four-path baseline diff and full native test were inspected.
`contracts.rs:13–70` retains public signatures and constructor behavior, separates
borrowed original diagnostics from owned emitted predicates, and preserves tilde
replacement. `forms.rs:427` lowers only predicates with the shared context and
registry in Value position, then restores the prior context. Its five callers
at 1410/1466/1643/1691/1832 cover single/multi pre/post and generator pre.
No printed-operator patch, generated-kernel re-lowering, assertion stripping,
dependency/lock change or unrelated production file change was found.

I read the complete valid unfixed raw baseline: 13 inputs blocked by invalid
generated equality, two wrong `cond` ReferenceErrors, two bound-head successes.
This is inspected CC execution evidence, not my own replay of the old compiler.
The source pins and fixture repairs remain explicit. Initial delimiter and
duplicate-declaration attempts have source pins and recorded tool excerpts, but
no retained full raw files; the corrected report discloses that limitation.

I independently ran from the source task home, in order:

- `cargo test --offline --locked -p lykn-cli --test contract_predicate_lowering -- --nocapture`:
  exit0, all seven families/17 actual inputs pass, plus correct following-if
  marker. Raw `target/slice07/cdc-native-focused.log` was read completely.
- Unfiltered `make check`, with only `npm_config_cache` set to the fresh ignored
  task `target/slice07/cdc-npm-cache`: exit0, complete native checks, existing
  legacy npm compatibility tests, JS+Lykn1461/1461, docs482/482. Raw
  `target/slice07/cdc-make-check.log`; actual terminal and category results read.
- After that full gate completed, `LYKN_BIN=./bin/lykn ./bin/lykn test test/surface/contract_predicates_test.lykn`:
  exit0,1/1; `make check-cited-paths`: exit0,63 documents/601 unchanged historical
  citations. Raw `cdc-parity-final.log` and `cdc-cited-paths.log` read completely.
  An earlier focused parity invocation overlapped the full build and passed;
  the post-gate invocation above is the independent final witness.

The focused comparison covers equality pre and nested boolean post, not all
JS/native output shapes. The retained failed `cond` comparison showed ternary
versus value-IIFE shape; no semantic divergence or normalizer repair is inferred.
Native `cond` behavior remains exercised in the 17-input runtime regression.
The default npm-cache EPERM is preserved; the successful full gate uses an
isolated cache, not filtered tests or an installation. Native probes/backend
remain free of the npm client; whole-repository validation includes its legacy
compatibility surface.

I independently confirmed Rust/Cargo1.97.0, unchanged lock SHA256
`bbec9052ee3a3401d716c3b4f2d227107e7e0a8c6f8c846c27fd902e0f39ca92`,
both source `target/release/lykn` and `bin/lykn` SHA256
`eb24ae3ba372ecfaef255ac883e0f41a0f1ef85494d41925583c4eb2148cbddb`,
and unchanged Deno hash `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
Source tracked state is clean; `git diff 9be0c301..HEAD --check` passes.
The final source commit has the required contiguous trailers.

Disposition: CP-01/02/03 done. No remaining repair finding. This accepts the
bounded task-branch repair, not a release/integration or general compiler proof.
CP-04/05/06 remain open. The new compiler identity above is the sole changed
condition for the frozen pilot; its original predictions remain unchanged.
`cc-prompt-iteration01.md` resumes Phase B, retaining the C4-first stop gate and
all historical failed/unrun counts. The separate branch-local-bind emission
witness is routed as open NE-C02 in the existing Project03 backlog.

## Phase B — independently reproduced bounded stop, 2026-11-05

Reviewed CC return `5217edef50218efb1d3b16f40a64c2a73aee000f`. Its predictions
were committed at33b6ba5 before compilation. Setup/missing-parent and invalid
comparison-path attempts remain separate from compiler/control results.
Before CC continued, I read its complete C4 bundle/raw metafile/native receipt,
five relevant Lykn and staged JS files,15 comparison statuses and nine maps;
independently hashed C4 and explicitly confirmed that gate. No control was
authorized around the new gap after its first runtime.

I then independently exported the immutable30e9793 archive into source task
`target/slice07/cdc-pilot-stop/experiment/`, using the SAME pinned compiler,
esbuild and Deno. Exact shell trace, compiler stdout/stderr and actual receipts
are copied to `artifacts/evidence/cdc-stop/`; no cache/binary or new helper was
committed. Own16 strict compiles and `dist` exited0; all15 direct/staged modules
compared identical. I read the actual three deno.json files: JSON4/YAML2/effects3
exports, nine unchanged entrypoints. Data/tool hashes match the frozen condition.

Own C4-only native bundle exited0. I read its complete538-byte code and raw
metafile before controls: hash6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a,
effect28 and used365 retained; dead406 resolves but has no output contribution;
barrel0. Its actual unusedPure body is absent, used/body/invocation and effect
initializer remain. This is code/metafile evidence, not a completed C4 runtime.

I invoked exactly the frozen controls command. It reproduced outer exit1 at
the first C5-source-before stdout assertion. The saved child receipt has exit0,
empty stderr and all intended JSON/file/document/YAML/used/dead values, including
dead82. I read the complete receipt and outer stderr. No later child/runtime or
bundle ran. Own13 public before/after file hashes compared identical; this is a
post-stop snapshot, not the unrun planned C5-source-after call.

Each implementation/reviewer replication therefore has1/5 bundles and1/11
child calls: child success, outer oracle failure; four bundles/ten calls unrun.
The two replications are not additional stimulus families or a combined2/5 pass.
Original Slice06's distinct compiler/parse-failure condition remains historical.

The full frozen driver source624–629 and generated JS362–364 identify the
template expected-string boundary, not bad child JSON. I independently compared
the retained prior run10 generated driver with my newly compiled driver: byte
identical (cmp0). That old ignored target path is retained historical material,
not an immutable new source proof. Native codegen emit.rs178–194/1267–1286
passes template backslashes through intentionally; its existing kernel tests
2276–2304 protect that behavior. NE-C03 needs a bounded surface/reader/template
contract diagnosis; no blanket escape patch is justified. No new probe, observer
correction, runtime reordering or further compiler repair was performed here.

I inspected the four malformed planning commit messages: literal backslash-n
between co-author strings, as reported. Correct record commit5217edef preserves
their identities and does not repair them. This remains an explicit process
nonconformance; no prior compliance is inferred. The final CDC commit uses an
actual multiline message and immediate raw-body verification.

Disposition: CP-01/02/03 remain done; CP-04/05 are deferred to the existing
NE-C03 re-entry owner, not passed. CP-06 done for independent bounded close,
history/remaining-owner preservation and retrospective, with the stated
metadata nonconformance retained. Slice closed at its authorized new-gap stop;
no new slice, source integration, push/publication or full audit acceptance.
All F-1–F-12 and Project07 synthesis/licence/bootstrap/authoring/book/human
obligations remain unchanged.

Closure whitespace check: the full staged `git diff --check` reports the
original terminal blank line in three verbatim Phase A raw logs (make-check,
native-focused, parity). Those bytes are preserved rather than cleaned up as
prose. The changed planning prose passes its explicit-path whitespace check;
the source diff/full native gate already passed independently. No product
validation gate is bypassed by retaining raw-output fidelity.
