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
