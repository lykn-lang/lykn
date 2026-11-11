# S02 CC close report

Current coordinator disposition: **S02 is independently accepted and closed**
at `0829e892999890e8877dec5e35cd249753e1be5d`, with all five PC rows done.
The final metadata review of planning b61c9968 accepts the documentary handoff
and supports QA-02 closure. See [independent verification](cdc-verification.md)
and [coordination retrospective](cdc-retrospective.md). The initial and
corrected CC records below keep their original evidence strength and scope.

Coordinator status: the initial `7b09a4e` candidate below is **not accepted**.
Sol's exact-pin read-only review found RV-01, stale embedded compiler payload;
[iteration03](cc-prompt-iteration03.md) owns the delivery correction. This
report is CC attestation, not retained raw gate output. CC confirmed historical
raw logs were not saved; fresh corrected/independent receipts will be labeled
as such. Root moved the uncommitted CC report to its canonical filename while
preserving its content below. All five PC rows remain open.

Corrected CC candidate: source commit `0829e892999890e8877dec5e35cd249753e1be5d`
adds the missing self-contained embedded delivery and a cold-cache materialized
public-path regression. Its full gates and committed-HEAD cited-path check pass.
All five PC rows remain open pending Sol CDC and root acceptance; see the
corrected-candidate record appended below. The initial `7b09a4e` report and
Sol's RV-01 hold remain preserved as history.

Date: 2026-11-11
Mode: Autonomous Mode, Luna 6 High CC; separate Sol 6.1 High CDC remains pending.

## Pins and scope

- Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
- Source branch: `codex/adt-pattern-correctness`
- Source base: `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`
- Source commit: `7b09a4e119fb841f950111217a07d5d8e833c220` (`fix: repair recursive ADT pattern matching`)
- Planning worktree at start of close: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch `planning`, commit `16b8d0393e5bb2681c49bc68c530ea7ce19d29ba` (plan v1.3; ledger rows left open)
- Source worktree was clean after the scoped source commit. Planning changed only for this close report; the planning ledger and parent plans remain unchanged.

This repair shares one ordered recursive pattern plan across native and public match/conditional-binding paths. Registered ADT and object checks guard each demanded field capture; wildcard fields are not read. The native sequence emitter now groups sequence expressions in every expression context. Public field temporaries carry compiler-private identity through macro expansion, then receive final names against the whole expanded unit. Binding analysis ignores those marked nodes by identity, not by printed prefix. The direct public `expandExpr` boundary also finalizes private atoms. Both zero-field type spellings emit tagged object constants.

The explicit compatibility boundary remains: public unregistered flat constructor patterns retain positional `Object.values` mapping/read behavior. The new selective read/order guarantee applies to registered constructor fields and object patterns. No qualified/imported resolution, S03 identity model, release integration, merge, push, publication, or dependency change is included.

## Runtime and regression evidence

Focused product checks on the committed tree:

- `cargo test -p lykn-lang test_seq --lib`: 4 passed, including `&&` short-circuit grouping, call argument, and initializer contexts.
- `cargo test -p lykn-cli --test semantic_roles recursive_adt_patterns_preserve_guards_reads_and_conditional_bindings -- --exact`: passed.
- `cargo test -p lykn-cli --test semantic_roles compiler_private_pattern_fields_do_not_shadow_user_macros -- --exact`: passed.
- `cargo test -p lykn-cli --test semantic_roles statement_match_preserves_protected_function_exit_checks -- --exact`: passed.
- `DENO_DIR=/Users/oubiwann/Library/Caches/deno XDG_CACHE_HOME=/private/tmp/lykn-arc04-s02/xdg deno test --config project.json -A test/forms/language-surface-runway.test.js`: 11 passed, 0 failed.

The public strict runtime fixture covers nested constructor success and wrong outer/inner tags, nested constructor literals (success and mismatch), null/missing children, false/null/undefined literals, nested object/ADT checks, false/0/empty-string payloads, a guard reading its bound nested value, guard-false fallthrough, guarded final wildcard success and exhaustion, list and bare zero-field variants in match/if-let/when-let, root falsey binding behavior, number/string conditional literals, and getter trace behavior. Its getter trace proves each demanded registered/object field is read once, after parent checks; wildcard does not read, and an invalid inner tag prevents reading that child's `value`. The conditional paths test bare-zero mismatch as well as success.

The macro hygiene fixture invokes outer source bindings `patternField__gensym0` and `patternField__gensym1` from a macro in statement, value, protected, if-let and when-let paths while pattern fields are generated. Its additional user macro is named exactly `patternField__private`. The retained negative control removed the identity filters from binding analysis and ran the strict public test:

```text
DENO_DIR=/Users/oubiwann/Library/Caches/deno XDG_CACHE_HOME=/private/tmp/lykn-arc04-s02/xdg deno test --config project.json -A test/forms/language-surface-runway.test.js --filter 'private fields preserve same-named user macros'
exit 1: ReferenceError: patternField__private is not defined
```

With the filters restored to skip marked atoms by identity, the same test passes and each delayed route returns the macro value `42`. The name census also proves source/macro-introduced `patternField__gensymN` names are reserved before private names are finalized. No source-prefix exclusion is used.

The public unregistered fallback test still returns `13` through its historical positional mapping. This is a compatibility witness, not evidence of selective reads for unregistered constructors.

## Original controls replayed on the final source tree

The byte-preserved NPAT and ZVAR inputs, public drivers, project config and lock came from:

`project07-core-library-research/arc02-lykn-authoring-evidence/slice01-json-value-and-decoder/artifacts/at02/independent-original/{nested-control,zero-control}`

Their copies under `/private/tmp/lykn-arc04-s02/{nested,zero}` retained the inputs/drivers/config/lock; I refreshed only `public/packages/lang/` from the committed S02 source. The release binary at `source/bin/lykn` was built by the final `make check` from the same source tree as commit `7b09a4e119fb841f950111217a07d5d8e833c220`.

Native NPAT commands in `.../nested/native`:

```text
bin/lykn compile nested.lykn -o target/final-native.js
bin/lykn run --cached-only --no-prompt target/final-native.js
stdout: 7\n
bin/lykn compile --strip-assertions nested.lykn -o target/final-stripped.js
bin/lykn run --cached-only --no-prompt target/final-stripped.js
stdout: 7\n
```

Native ZVAR commands in `.../zero/native` use the same compile/run forms with `zero.lykn`; both default and `--strip-assertions` runtime stdout was exactly:

```text
["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]\n
```

Public NPAT and ZVAR used the preserved `compile-probe.lykn` and original `probe.lykn` with current public sources:

```text
bin/lykn compile compile-probe.lykn -o target/final-compile-probe.js
bin/lykn run --cached-only --frozen --no-prompt --allow-read=probe.lykn target/final-compile-probe.js > target/final-public.js
bin/lykn run --cached-only --frozen --no-prompt target/final-public.js
```

NPAT stdout was exactly `7\n`; ZVAR stdout was exactly `["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]\n`. Every compile and run exited 0. Native compile emitted only pre-existing unused type-name warnings (`Option`, `InnerValue`, `ZeroForms`); public compile/runtime stderr was empty. Original source inputs and control directories were not edited.

## Gate results and retained failures

Final committed-tree command:

```text
cargo fmt --all -- --check && git diff --check && make check
exit 0
```

`make check` passed dependency checks, cited-path check, release build, clippy, Rust formatting, Lykn syntax and source lint (no findings), the full workspace Rust suite, the complete JS and compiled Lykn corpus, and docs. The final docs stage reported `ok | 482 passed | 0 failed`; the command ended `✓ All checks passed (build + lint + test)`.

Committed-HEAD gates:

- `make check-cited-paths`: exit 0; 64 documents and 601 accepted historical citations on `codex/adt-pattern-correctness`.
- `make bundle-size-check`: exit 0. Baseline gzip 27,630 bytes; current gzip 41,349 bytes; delta +13,719 bytes (+13.4 KiB), within the 80 KiB budget. esbuild printed its existing `astring` package condition-order warning; the gate passed.

Failures and their dispositions are retained here:

1. The first native runtime pass exposed ungrouped `seq` comma expressions under short-circuit checks; it broke the nested check and made the sequence grouping controls fail. An earlier tautology workaround was removed. The bounded codegen repair always parenthesizes a native sequence expression; 4 direct codegen tests and the Lykn runtime fixture now pass.
2. A normal-sandbox `make check` stopped at Lykn syntax checking with `Operation not permitted` on `test/surface/func_test.lykn`. The same `bin/lykn check` succeeded when run with authorized escalation; subsequent full `make check` runs used escalation for repository fixture reads.
3. The first elevated full run correctly rejected the new fixture's kernel `&&` spelling under surface lint. The runtime fixture now uses surface `and`; direct codegen tests still exercise native `&&` grouping.
4. Ordered guard continuation first exposed the old protected fixture's hidden early-return observation. The original source and result are retained immediately below. Independent source triage assigns this pre-existing protected function prefix-return bypass to Arc01 S04 I4/CV-03 (with CV-04/CV-05 and CI-04 composition still open). S02 does not redesign checked early returns. The revised protected regression uses a traced later clause and tail `7`; it proves false-guard continuation and postcondition checking on the finite in-scope path.
5. The null-pattern classifier change invalidated an old unit assertion that required `SExpr::Null` to fail. The test now requires `Pattern::Literal(SExpr::Null)`; the full 1,170-test `lykn-lang` unit suite passed.
6. The first public corpus pass found old emitted-shape substrings expecting dotted member syntax where private computed-member accesses now emit `target["tag"]` / `target["value"]`; these assertions were updated to check computed access and literal equality without relying on a generated temporary name. The shared public protected fixture oracle was updated for the traced fallback.
7. A later public corpus pass found the object literal assertion expected `response["ok"] === true`; the ordered matcher correctly emits a cached field temp then `temp === true`. The assertion now checks the computed `"ok"` access and `=== true` separately.
8. Root's final edge review found public value matches could silently return `undefined` when the final wildcard/binding was guarded and its guard was false. `emitMatchMacro` now emits the no-match throw for a guarded final clause. The strict public/native correctness fixture includes a guard-true control and a caught guard-false exhaustion case; the final full gate passed.

Original protected early-return failure before the finite test adjustment:

```lykn
(func checked :returns :number :post (verify-result ~) :body
  (match 0
    (_ :when false (return 99))
    (_ (return "bad")))
  7)
```

The failing `statement_match_preserves_protected_function_exit_checks` run observed `stdout=["bad",[]]\n` against the old expected `[7,[7]]\n`. Generated JS reached the second explicit prefix `return "bad"` and bypassed the function's tail postcondition machinery; this is the existing I4 limitation identified by the parent-plan triage, not an S02 acceptance claim. The corrected in-scope fixture now records `"fallback"` after the false guard and returns/checks tail `7`, producing `[7,["fallback",7]]\n`.

## Criterion dispositions

These are CC proposed-done recommendations only. The ledger remains unchanged with all five rows `open`; Sol CDC and root acceptance are outstanding.

| PC | CC disposition | Evidence boundary |
| --- | --- | --- |
| PC-01 | proposed-done | Original NPAT control prints `7` through native and strict public paths; recursive native/public wrong-tag, literal, object, null/missing checks pass. |
| PC-02 | proposed-done | Original ZVAR control prints exact tagged-object typeof/JSON output through native default/stripped and strict public paths; registered list and bare variants work in conditional and match tests. |
| PC-03 | proposed-done with disclosed limits | Recursive plans, all current match/if-let/when-let paths, getter ordering/once/no-read, falsey payloads, guards, control transfers, macro hygiene, direct `expandExpr`, and fallback compatibility have runtime tests. Unregistered fallback remains historical positional enumeration; protected prefix explicit returns retain the separately owned I4 limitation. |
| PC-04 | proposed-done | Final `make check`, committed-HEAD `make check-cited-paths`, and `make bundle-size-check` passed; retained failed attempts and corrected negative controls are recorded above. |
| PC-05 | proposed-done for CC handoff | Scoped source commit and this planning report preserve pins, history, limits and downstream owners. CDC acceptance, root closure, methodology retrospective and arc bubble-up remain downstream. |

## Downstream boundary

Sol should review the committed diff, independently replay the original controls, and disposition all five PC rows. Root retains parent-plan/ledger writes and final closure. Track the protected prefix-return/postcondition behavior under its Arc01 S04 I4/CV-03 owner; S02 does not claim to resolve it. The unregistered positional fallback remains explicitly non-selective. Qualified/imported constructor ownership and S03 representation work remain later work.

## Corrected-candidate record: embedded package delivery

Date: 2026-11-11. This is a fresh CC verification record for the corrected
candidate, not a replacement for the initial `7b09a4e` report above. Source
worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/adt-pattern-correctness`, is clean at
`0829e892999890e8877dec5e35cd249753e1be5d` (`fix: embed recursive pattern
compiler`), parent `7b09a4e119fb841f950111217a07d5d8e833c220`. The source binary
used for the final direct replay is `bin/lykn`, SHA-256
`d2319c8a27d987a0aa781eeb2b27eeb988f737629ce1208cefd5f3e1af4bdfc5`.

The correction synchronizes canonical `packages/lang/{binding.js,
classifier.js,expander-core.js,surface-helpers.js,compiler-private-atoms.js}`
into the real include root `crates/lykn-lang/embedded/packages/lang/`. It adds
the M6 CLI delivery test in `crates/lykn-cli/tests/macro_dependencies.rs` and
strict public runtime tests in `test/forms/embedded-adt-pattern.test.js`. The
existing `include_dir!` crate-owned packaging remains intact; no config, lock,
version, dependency, or warm-cache policy changed.

Sol's RV-01 was correct: the source-ready recipe and initial implementation
missed this duplicate delivery home. Commit `7b09a4e` repaired canonical
`packages/lang` only, leaving `include_dir!` materialization stale; its passing
canonical public tests therefore did not establish the installed route. The
new integration test exercises that boundary directly and the correction
brings the payload into sync.

M6 starts with an owned XDG cache whose versioned embedded directory does not
exist, copies `CARGO_BIN_EXE_lykn` into a standalone working directory with no
`packages/lang` fallback, and runs a Lykn macro trigger through that copied
binary. It asserts materialization, then compares canonical, embedded, and
materialized bytes for all five changed modules, including the private helper
transitive import. A strict Deno product test uses an import map to the actual
materialized package and executes the nested/literal/zero-field fixture plus
same-name macro-hygiene fixture. The test passes both nested and zero-field
controls and private macro value 42. Fresh-XDG behavior is established; the
existing cache sentinel remains version-based, and this work makes no claim
that a same-version warm cache is content-invalidated.

Focused corrected-delivery command and captured receipt:

```text
LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR=/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice02-existing-adt-correctness/artifacts/corrected-candidate/m6-final \
  cargo test -p lykn-cli --test macro_dependencies \
  m6_embedded_compiler_payload_matches_canonical_and_runs_from_cold_cache -- --exact
exit 0; 1 Rust integration test passed; its strict Deno subprocess reported 2 passed, 0 failed.
```

The focused test's exact process receipts are in
`artifacts/corrected-candidate/m6-final/`; the full gate log is
`artifacts/corrected-candidate/make-check-postformat.log`, and the committed
HEAD cited-path log is `artifacts/corrected-candidate/cited-paths-final-head.log`.

The final full-gate command on the exact formatted corrected source tree was
`cargo fmt --all -- --check && git diff --check && make check`, exit 0. The log
ends `ok | 482 passed | 0 failed` and `All checks passed (build + lint + test)`.
On committed HEAD `0829e892999890e8877dec5e35cd249753e1be5d`,
`make check-cited-paths` exits 0 with 64 documents and 601 accepted historical
citations. The earlier `make bundle-size-check` result at initial candidate
`7b09a4e` is retained: this correction changes only the embedded Rust
include-dir payload, CLI integration test, and a new test module; canonical
`packages/lang` and browser bundle inputs are byte-unchanged, so repeating that
measurement would measure the same inputs. Its prior result was baseline gzip
27,630 bytes, current gzip 41,349 bytes, delta +13,719 bytes, within the 80 KiB
budget. The esbuild warning and prior gate pass are described in the initial
report; no historical raw log was saved.

The original NPAT/ZVAR controls were copied byte-for-byte from the cited
Project07 original-control artifacts into
`artifacts/corrected-candidate/original-replay/`; each public work directory
retains its original driver, probe, lock, and original project config alongside
the new project config that maps `lang/` to the materialized package. The
release binary built by the successful full gate first materialized the
embedded package in fresh `/private/tmp/lykn-arc04-s02-corrected-replay/xdg-cache`
using a macro-trigger compile. Native NPAT default and stripped runs each
printed exactly `7\n`. Native ZVAR default and stripped runs each printed
exactly `["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]\n`. Both original
public drivers then compiled and ran through the materialized embedded public
package: NPAT printed `7\n`; ZVAR printed the same exact tagged-object JSON
output. All captured compile/run exit statuses are zero. The command files,
status, stdout, stderr, generated JS and public configs are retained under
`artifacts/corrected-candidate/original-replay/`; the M6 process receipts and
final gate logs are under `artifacts/corrected-candidate/`.

New corrected-candidate failures and setup corrections are retained as bounded
logs under `artifacts/corrected-candidate/`:

1. The first M6 attempt compiled a fixture with no macro invocation, so the
   CLI correctly never materialized the embedded package; the test then failed
   its materialization assertion. The source was updated to include a simple
   macro trigger before the unchanged recursive-pattern fixture.
2. The first triggered retry used fresh `XDG_CACHE_HOME` for both embedded and
   Deno's npm cache. The macro expander tried to fetch cached `astring` from
   npm, but network DNS was unavailable. The test now pins `DENO_DIR` to the
   host's normal Deno cache while keeping the embedded XDG cache fresh.
3. The next strict public run reached both tests but lacked `-A`, so its reads
   of the committed Lykn fixtures failed with `NotCapable`. The runner now
   grants test permissions; both public tests pass under that import map.
4. The first corrected full gate caught a Clippy `needless_borrows_for_generic_args`
   in the new test harness. Removing the unnecessary borrow fixed it; the
   final full gate passes.
5. The first original-public replay setup double-redirected stdout and left the
   generated JS file empty; it was not counted as a product result. Re-running
   with a single output redirect and copying the bytes to the receipt produced
   the recorded passing outputs above. A path typo also prevented one initial
   receipt redirect; corrected command receipts are the ones retained.

Historical limitations and failures remain as stated in the initial report.
In particular, the protected prefix explicit-return observation
`stdout=["bad",[]]\n` versus `[7,[7]]\n` is an attested historical result, not a
raw log and not resolved by this packaging correction; the Arc01 S04 I4/CV-03
owner remains responsible. The unregistered public flat-pattern path keeps
historical positional `Object.values` behavior. A prior focused null unit
command using `--exact` matched zero tests because its test name was shortened;
the full unit suite passed. The old canonical-browser-size and earlier run
receipts were not reconstructed.

## Corrected PC dispositions

CC retains the same proposed dispositions; all rows remain `open` in the
ledger. The embedding correction closes the RV-01 delivery gap for this CC
candidate but does not confer CDC or root acceptance.

| PC | CC disposition | Corrected evidence boundary |
| --- | --- | --- |
| PC-01 | proposed-done | Original NPAT prints `7` through native default/stripped and strict public materialized-package paths; recursive negative and literal controls remain in product fixtures. |
| PC-02 | proposed-done | Original ZVAR exact tagged-object output passes native default/stripped and strict public materialized-package paths; list and bare zero variants are covered. |
| PC-03 | proposed-done with disclosed limits | Shared recursive ordering, guard/read/hygiene/control tests pass in native and canonical public routes; embedded strict public path exercises nested, zero and same-name macro cases. Unregistered positional fallback and Arc01 protected prefix-return limit remain disclosed. |
| PC-04 | proposed-done | Corrected full `make check`, committed-HEAD cited-path gate, and retained earlier bundle-size pass on unchanged canonical/browser inputs. |
| PC-05 | proposed-done for CC handoff | Corrected source commit and this report/artifacts preserve exact pins, failures, receipts, and downstream owners. CDC/root review and methodology follow-up remain open. |

The planning worktree remains on `planning`; only this slice closing report and
its `artifacts/corrected-candidate/` evidence are changed by this close. The
slice ledger and parent plans are not edited. Sol owns independent CDC and
replay; root owns final acceptance, parent status, and retrospective.

## Root handoff reconciliation

Source worktree/branch and exact base/candidate are those recorded above.
`git diff --name-only 685bbe1d 0829e892` identifies these 24 source paths;
they are delivered by the two scoped commits `7b09a4e` and `0829e892`, not by
merging planning into source:

```text
crates/lykn-cli/tests/macro_dependencies.rs
crates/lykn-cli/tests/semantic_roles.rs
crates/lykn-lang/embedded/packages/lang/binding.js
crates/lykn-lang/embedded/packages/lang/classifier.js
crates/lykn-lang/embedded/packages/lang/compiler-private-atoms.js
crates/lykn-lang/embedded/packages/lang/expander-core.js
crates/lykn-lang/embedded/packages/lang/surface-helpers.js
crates/lykn-lang/src/classifier/forms.rs
crates/lykn-lang/src/codegen/emit.rs
crates/lykn-lang/src/emitter/forms.rs
packages/lang/binding.js
packages/lang/classifier.js
packages/lang/compiler-private-atoms.js
packages/lang/expander-core.js
packages/lang/surface-helpers.js
test/fixtures/semantic-roles/adt-pattern-correctness.lykn
test/fixtures/semantic-roles/adt-pattern-macro-hygiene.lykn
test/fixtures/semantic-roles/seq-expression-contexts.lykn
test/fixtures/semantic-roles/statement-match-protected-preservation.lykn
test/forms/embedded-adt-pattern.test.js
test/forms/language-surface-runway.test.js
test/forms/semantic-roles.test.js
test/surface/conditional-binding_test.lykn
test/surface/match_test.lykn
```

Planning history: `e6671ae0` opens S02; `be1a477b` records sequence grouping;
`a351809e` consolidates draft dispatch/hygiene corrections; `16b8d039` retains
I4 ownership; `87ad086c` preserves the initial CC report, independent RV-01 hold
and embedded correction assignment. `e24804da` adds the corrected CC report and
raw evidence. Its original process receipts remain intact, without amendment
or a file-count-driven consolidation. Earlier setup/filter/assertion corrections
reported during work also included a rejected two-filter Cargo invocation,
an expected newline adjustment, wrong temporary CLI/config/lock setup and an
expanded-fixture expected-vector correction; these are attested history, not
newly recreated raw failures.

The slice inventory is its plan, five-row ledger, initial/three iteration
prompts, canonical closing/verification/retrospective records and the bounded
`artifacts/corrected-candidate/` plus `artifacts/cdc-independent/` evidence homes.
The raw corrected packet is enumerated by planning commit `e24804da`; the
reviewer record identifies the independent receipt archive and integrity data.
Root's final named planning changes reconcile this slice, Arc04's plan/ledger,
Project03's plan/ledger and Project07 Arc03's correction status. No research
archive, original finding payload or accepted S01 contract is rewritten.

The delivered scope includes the necessary sequence grouping, recursive literal
classification, conditional-binding, guard-exhaustion, identity-based hygiene
and embedded-payload dependencies. It retains the flat representation. S03 is
the next implementation increment for local qualified nominal ADTs; imported
resolution, emission experiments, actual build/JSON composition and S06/S07
API/documentation/book/human obligations remain open. S06 must account for the
changed emitted shape, newly accepted literal conditional patterns and internal
private-atom helpers as well as later qualified APIs. This source acceptance
does not integrate `release/0.6.x`, which remains `685bbe1d`, or authorize push,
publication, a library licence, repository creation or a warm-cache redesign.

Final closure is a clerical reconciliation following Sol's independent source
and metadata verdicts. Source remains exactly 0829e892; planning b61c9968
contains the reviewed handoff/retrospective and raw independent receipts. The
final planning commit records the completed statuses, without changing source
or weakening any remaining project/arc criterion. All five slice rows are done;
QA-02 is done, QA-03 through QA-06 and P-QADT remain open. No additional source
gate was repeated for these documentary status updates.
