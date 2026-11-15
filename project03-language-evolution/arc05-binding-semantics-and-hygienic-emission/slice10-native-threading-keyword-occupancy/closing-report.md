# CC close: S10 native threading-keyword occupancy

**Disposition: proposed-done, pending independent Sol review and acceptance.**
This is the CC implementation close only. Root owns planning rows and the
retrospective; this report does not accept the arc or authorize S07/release work.

## Root closing handoff — 2026-11-14

Separate Sol source and fresh runtime gates pass at unchanged a170; the
[independent verification](cdc-verification.md) is authoritative for TK-01–05.
Root's [retrospective](cdc-retrospective.md) accounts for the tagged-Bare draft
mistake, development oracles, retained evidence and follow-through. Arc05,
Project03, Arc06 LI-04 and Project07 now carry the exact source/API/guide and
prerequisite disposition with later owners preserved. TK-06/BS-10 remain open
until separate review of that closing metadata. No new source execution,
S07 opening or release integration follows this handoff.

## Assignment and immutable result

- Project03 / Arc05 / S10, issued prompt dispatch `542806f0`; source input
  `a44e16db96ca4ae76de124b555c34ffe2c2779ba` (tree
  `4080ee3f7be200610814b39b4118d2b5f3062ca8`), branch
  `codex/qualified-adt-core`. Release source remains
  `82f1b65b92529979afd6c624183912ca31453927`.
- Commit `a170be580888198ec7da1a99c4731a1d177157a1`, tree
  `818f02478bc1667254f48899aca3d230a4e3b697`. Commit changes exactly:
  `crates/lykn-lang/src/emitter/source_names.rs`,
  `crates/lykn-cli/tests/generated_name_hygiene.rs`, and
  `docs/guides/06-functions-closures.md`. Both adjacent coauthor trailers are
  present. Source worktree was clean at handback.
- CC made no planning ledger, row, retrospective, release, dependency, schema,
  grammar, generated mirror, or public API changes. No S07 work was opened.

## Result and contract boundary

The existing borrowed owning-input census now follows executable step roles
before helper names are allocated. All four actual Surface thread variants
dispatch tagged `Bare` through a keyword-aware bare-step visitor and tagged
`Call` through a call-head visitor. Generic expression traversal recognizes
only exact raw thread heads `->`, `->>`, `some->`, and `some->>` and gives their
remaining expressions raw-step roles. Existing borrowed `text` reservation
continues to provide normalized physical-name matching, including static
Unicode aliases.

The Surface tag remains authoritative: `Bare(List(...))` is ordinary
expression recursion, even when the List is keyword-headed. A real raw thread
nested in that expression is found recursively; a keyword-headed data List is
not recast as a call step. Initial keywords, ordinary keyword/string data, and
keyword call arguments remain unreserved. Existing Cons traversal remains
recursive. No clone, parser roundtrip, resolver behavior, API, type, unsafe
code, allocation state, or error-model change was introduced. The guide records
this limited occupancy guarantee and explicitly avoids promising binding
resolution or general macro hygiene.

## Six TK proposals for Sol

These are evidence-based CC recommendations, not row edits or independent
acceptance.

1. **TK-01 — baseline reproduction:** propose verified. The preserved root a44
   specimen/generated-module/output receipts reproduce intended result 7
   failing in both relevant ways: computed keyword-member capture raises a
   TypeError, and the enclosing generated `result__gensym0` read raises a
   ReferenceError. Sol should inspect the immutable baseline and confirm the
   changed census targets those actual failures.
2. **TK-02 — census role correctness:** propose verified. Seven focused
   `source_names` tests passed. They exercise all four tagged Surface forms
   with Bare and Call keywords, nested raw threads under ordinary containers,
   the tagged Bare nested-raw/data split, mixed isolated negative cases,
   escaped alias normalization, a public `emit_form` entrance, and Cons atom
   recursion. The two opposing tagged-Bare results are explicit: nested real
   raw keyword step skips t0; keyword-headed data list leaves t0 available.
3. **TK-03 — native behavior:** propose verified. Six focused CLI integration
   tests passed, including exactly 32 fresh compiler/runtime collision cells:
   four heads × two step roles × `.lykn`/`.lyk` × checked/stripped. Every cell
   compiled and executed with status 0, stdout exactly `7\n`, and empty runtime
   stderr. The tests assert unchanged foreign computed member reads and absence
   of the conflicting generated declaration where applicable. Separate
   controls prove escaped member spelling, ordinary atom reads, null
   short-circuit effect count, `->` versus `->>` ordering, and one-time ordered
   receiver/argument effects. An actual CLI `--kernel-json` value also flowed
   through `packages/lang/compiler.js` and executed to 7.
4. **TK-04 — fragment and delivered boundaries:** propose verified. The public
   `emit_form` unit test proves reservation occurs before lowering and checks
   actual binding/read separation. The one full gate's materialized strict M6
   child exited 0 and reported exactly 78 passed/0 failed across the prescribed
   eight-file population. All 15 canonical/embedded/materialized comparisons
   were individually retained and report both byte equalities true; their
   recorded byte lengths are in `artifacts/cc/execution.md` and the M6 receipts.
   The explicit warm DENO_DIR and fresh owned child XDG profile are recorded;
   this is not cold dependency/network or same-version cache invalidation
   evidence.
5. **TK-05 — scoped source and required gates:** propose verified. The single
   `make check` passed; `lykn-lang` unit suite reported 1224 passed/0 failed, Source
   corpus 1586 passed/0 failed in 67 steps, and docs generated 22 files/482
   blocks with 15 skipped, then passed 482/0. Final committed-HEAD
   `make check-cited-paths` passed (64 documents, 601 historical census
   citations). Fresh committed-HEAD `make bundle-size-check` passed the
   existing 81920-byte gzip threshold at 50162 bytes (baseline27630,
   delta+22532). Commit contains only the three authorized product paths and
   final worktree was clean.
6. **TK-06 — independent close/history/next owners:** keep open for root and
   Sol. This is a serious process/ownership row, not a code assertion. Root
   should retain the baseline and prior S05/S06 decisions, record the
   independent disposition and retrospective, update parent rows, and route
   future S07–09 work only through their existing gates. This assignment did
   not accept S10 independently or change release82.

## Validation chronology and failure accounting

All attempts, including corrected failures, remain separately recorded under
`artifacts/cc/`. The first source unit attempt was 6/7: its `emit_form` oracle
expected no allocation from real lowering; observed lifecycle consumes t1
after census reserved t0. The oracle was corrected to assert emitted t1/read
t0 and next t2; attempt02 passed 7/7. The first CLI attempt was 5/6 after all
32 principal cells passed: the escaped-keyword assertion expected decoded
member spelling, while emitted JavaScript correctly preserved the literal
`\\u005f` source escape; the assertion was corrected to preserve that actual
spelling, and attempt02 passed 6/6. The first format check found three
rustfmt-only hunks; `cargo fmt --all` fixed them and the later full gate passed
format/lint. These failures were not discarded or treated as product failures.

`make check` ran once with docs once. It passed release build, Clippy, format,
JS lint, all Rust/integration groups, Source corpus, M6 and docs. The output
retains the existing `(skipped — jsr.io not reachable)` notice and informational
“no lykn blocks” lines. The 15 skipped documentation blocks are reported as
skips, not passes. The external-registry notice is not treated as registry
availability evidence. Deno/esbuild fetch and the pinned warm DENO_DIR are
visible in the final size log; no cold dependency claim is made. No failed
fixture, population member, unknown stream, or runtime failure was silently
dropped; each changed expectation has its own attempt log and explanation.

## Durable CC artifact inventory

All paths below are under `artifacts/cc/`:

- `execution.md` — required reading/readback, implementation, exact commands,
  environment, gate populations, outcomes and complete M6 comparison values.
- `focused-native-source-names-attempt01.log` and
  `focused-native-source-names-attempt02.log` — failed oracle and 7/7 repair.
- `focused-cli-generated-name-hygiene-attempt01.log` and
  `focused-cli-generated-name-hygiene-attempt02.log` — escaped spelling oracle
  correction and 6/6 with 32 principal cells.
- `format-check-attempt01.log` — original formatting diagnostics.
- `make-check.log` — complete single full gate output.
- `m6-check-20261114/` — 386 actual child files: command/environment records,
  source and generated artifacts, stdout/stderr/status, strict Deno config and
  15 named byte-comparison receipts.
- `final-check-cited-paths.log` — final committed-HEAD citation gate.
- `final-bundle-size-check.log` — final fresh size measurement and budget.

## Handoff

CC proposes S10 implementation done at commit `a170be580888198ec7da1a99c4731a1d177157a1`,
tree `818f02478bc1667254f48899aca3d230a4e3b697`. Source/build ownership is
returned to root; source is clean and no gate jobs remain. Sol must independently
inspect the immutable commit/evidence, rerun assigned fresh validations, and
accept or return findings. Parent planning rows/retrospective remain root-owned.

### Addendum: aggregate Rust counts and process census limit

Reading the 42 Rust test-harness result records in `artifacts/cc/make-check.log`
gives 1809 passed and 0 failed total; the 1224-test record is specifically the
`lykn-lang` library unit-test harness (not CLI unit tests). All CC-owned tool
and gate sessions had completed. The OS `pgrep` attempt failed because the
`sysmond` service was unavailable, so this handback does not claim an
independent OS-level process census.
