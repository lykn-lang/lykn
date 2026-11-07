# CDC independent staged verification

## Stage A NE-C08 — accepted narrowly, 2026-11-06

Reviewer `/root/cdc`, OpenAI gpt-6.1-sol High. Implementer
`/root/cdc/validation_parity_cc`, fresh gpt-6-luna High. Source clean on
codex/compile-route-validation at4610b4ce37d41dd11a591f88b4e67e15b84f96b1;
tests frozen94076ccee4ffaff8f0db58677da06ac8da5ad93c then offline flags corrected
759300d748d250c8997be15b2c8d240024072e89 before runtime. CDC independently
inspected the exact two-path diff against2bf7a109, all new tests and complete
production helper/call sites. Five validators retain stdout order/diagnostic
format and borrowed forms, now shared after resolve with with_dts. check_strict,
analysis/emission/DTS/write code unchanged. No keyword blacklist or mode bypass.

Meaningful red raw is API `stage-a-api-red-retry02.txt` (one failed/177 filtered),
CLI `stage-a-cli-red.txt` (two failed/one positive passed). Both expose the three
missing passes, including emitted bytes/sentinel overwrite before assertions.
Earlier two zero-selected runs and pathspec commit failure remain invocation
errors, not semantic proof. Red is retained CC attestation reconciled with the
actual old source and frozen tests, not claimed as a CDC old-binary replay.

After explicit ownership return CDC freshly executed:

- `cargo test --offline --locked -p lykn-cli --bin lykn compile_ -- --nocapture`:
  exit0,40/40 passing,138 filtered. Raw `artifacts/cdc-stage-a/api.log` + `.exit`.
- `LYKN_TEST_DENO=/opt/homebrew/bin/deno cargo test --offline --locked -p lykn-cli
  --test compile_validation_parity -- --nocapture`: exit0,3/3 passing,0 filtered.
  Raw `artifacts/cdc-stage-a/cli.log` + `.exit`.
- Unfiltered `make check`: Make exit2, inner Cargo failure101 at the KNOWN
  NE-C07 async export. Dependencies/citations/build/lint and Rust library0,
  CLI library98/98, main binary178/178 pass; async integration1pass/1knownfail.
  Later Rust targets, JS suite/docs unrun. Raw `make-check.log` + `.exit`.
- Direct committed `make check-cited-paths`: exit0,63 documents,601 unchanged
  historical citations. Raw `cited-paths.log` + `.exit`.

Actual cwd for these is the named task checkout. Before runtime CDC verified
debug CLI79720545b4846538b83f78348a68aa6610e2fc0ac95b3cd65e5968d0c5291d08,
release CLI9e73a4241c2e3d2ef895c4057929d588fb37d7572c88c1659b31a1e35fdff025,
Deno2.9.6 hash2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74,
Cargo/Rust1.97.0. Full Make used task/target/slice14/cdc-a fresh npm-cache,
xdg-cache/config/data/state paths, fixed DENO_DIR=/Users/oubiwann/Library/Caches/deno,
LYKN_TEST_DENO=/opt/homebrew/bin/deno. No PATH filter or forced/skip flags.
Raw task output retains all diagnostic categories, fresh-no-output and unchanged
sentinels. Complete generated positive JS/DTS and unannotated warning/empty DTS
were inspected: inc has argument/return checks and valid export; local Deno
outputs42 LF/empty stderr; unannotated loose retains unknown DTS/warning. Some
parallel unit-test log text interleaves; CLI generated JS text is complete.

**Verdict:** VP01–03 done for NE-C08's route semantics and explicit gate
disposition. No full-green repository claim: VP05 stays open until NE-C07 and
the complete required independent gate pass. Known failure is authorized next
prerequisite, not a NEW evidence gap. No release integration occurred.

## Process nonconformance remains separate

CC executed prohibited Python for ledger replacement during handoff. CDC
verified no source change, preserved actual ledger diff and CC-supplied command
text/status limitations in [incident](artifacts/python-policy-incident.md).
Actual Python exit is unknown; earlier inferred0 retracted. The old CC gets no
more writes; later stage uses fresh same-approved-model CC. CDC's reproduction
used only direct native CLI/lifecycle and normal apply_patch/Git, no Python.
This technical acceptance does not retrospectively authorize the breach or
claim blanket compliance. Earlier Slice12/13 history remains unchanged.

Raw log/patch whitespace remains verbatim: the full staged diff check reports
blank EOF lines, one interleaved test-output trailing space and the patch's
space-prefixed blank context. Explicitly named prose passes; no whole-raw-diff
whitespace-clean claim or log normalization. CC's Make101 prose denotes its
inner Cargo failure; CDC separately captures actual Make exit2 above.

## Stage B NE-C07 — accepted, 2026-11-06

Fresh implementer `/root/cdc/async_repair_cc`, gpt-6-luna High. Source clean at
3b65d09a1a8997f8c9680a34f43fd2c2e0aa8c4e. CDC independently inspected both
changed Rust paths and original private collector/shared binding consumers.
Only the exact async func/genfunc wrapper is unwrapped, with resolution-aware
heads; shared bindings_introduced stays nonrecursive. Existing unknown/local/
parameter/nested/duplicate/bound-head rules and the extra malformed-wrapper
countercontrol pass. Shared fixture hashes unchanged (module e8c39a91…c7bd4d,
consumer08482d6d…80ea). Source/test body cmp against CC pre-run frozen copies
passes. Those body freezes preceded CC tests; source Git commit followed them.

CDC freshly built tests --no-run, then pinned default debug compiler
a13d6b313740608eaa0e825b81573fa6e0db6066aa9754bf0843ff15c5485957 before
running8/8 export unit tests (1110 filtered; separate zero-selected targets
explicit in log) and2/2 actual async CLI tests: all exit0. Raw exact outputs
and exits: artifacts/cdc-stage-b/{test-build,exports,async-cli}.{log,exit}.
Complete emitted module/consumer JS inspected: valid export plus async function,
typed argument/return checks, relative import and await; stdout/file bytes match,
Deno outputs42 LF/empty stderr. Applicable DTS paths explicitly absent, not lost.

CC full Make passed with CARGO_NET_OFFLINE=true; that invocation is retained
as such, followed by normal metadata/citation passes, not silently relabelled.
CDC's independent COMPLETE `make check` explicitly unset CARGO_NET_OFFLINE and
CARGO_TARGET_DIR, used default target plus fresh target/slice14/cdc-b npm/XDG
caches, existing fixed DENO_DIR and absolute LYKN_TEST_DENO. Exit0: all Rust
targets pass (including StageA regressions), JS1467 passed/6steps, docs482 passed.
Direct committed citations exit0:63 documents/601 historical citations. Raw
artifacts/cdc-stage-b/{make-check,cited-paths}.{log,exit}. This is full canonical
gate acceptance, with no test filtering or metadata-gate waiver.

Verified before/after: actual task target/release/lykn and bin/lykn both
748cd9991003da42b9a07950005d21e46b6a295b9d8650c71c4fca3e69cf2e5c,
Deno2.9.6 remains2ad84f9e…e5ce74. VP04/05 done; both repairs accepted task-only.
No release/source propagation. Parser still0/4 until the preserved StageC gate.
Async declaration sidecar absence is an owned type-distribution limitation,
not a NEW gap: current DTS emitter lacks Async wrapper handling; philosophy
says “possibly .d.ts”, not universal async coverage. No new type repair here.
