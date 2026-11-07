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
