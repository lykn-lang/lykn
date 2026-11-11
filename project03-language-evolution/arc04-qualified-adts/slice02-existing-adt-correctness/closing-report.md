# S02 CC close report

Coordinator status: the initial `7b09a4e` candidate below is **not accepted**.
Sol's exact-pin read-only review found RV-01, stale embedded compiler payload;
[iteration03](cc-prompt-iteration03.md) owns the delivery correction. This
report is CC attestation, not retained raw gate output. CC confirmed historical
raw logs were not saved; fresh corrected/independent receipts will be labeled
as such. Root moved the uncommitted CC report to its canonical filename while
preserving its content below. All five PC rows remain open.

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
