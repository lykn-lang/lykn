# S02 independent reviews and stopped dispositions

## Correction02 full-gate stop — current disposition (2026-11-07)

Source483ff5074001d7a039270f4639e8ef61d70e4b4e is clean and **unaccepted**.
Correction02 fixed CE-R05/06/07 in exactly the two authorized test locations;
CDC reviewed the actual immutable delta and released it BEFORE any validation.
The prior d352 wrong-oracle finding is resolved test construction, not the current
blocker. Production/docs/maintenance fixtures/oracles were unchanged by correction.
Shared correction02 is spent (2/5; three remain), no reset of old tooling8/K0/13.

### Actual green checks and first failure

CC `/root/cdc/checked_emission_correction02_luna_cc` (fresh Luna6 High) captured
workspace no-run --offline --locked0 and final producer pins before direct tests.
Focused: new typed6/6, lang units1133/1133, CLI library99/99, CLI main180/180,
emission_failures4/4, contract1test/17observations, validation parity3/3,
e2e18/18, cross-compiler22/22. All four invalid rejection/no-write and four valid
strict-runtime oracles now match in CC's run, including prior MH-P01. These are
doer-observed greens; they are not independent full acceptance or a new baseline.

Required normal UNFILTERED `make check` then exited2. Actual raw stages: embedded
cited paths0 (63 documents/601 frozen historical refs), release build, Clippy,
format, syntax, Lykn lint, refresh and Rust test stage completed. Deno corpus:
**1469 passed (11 steps), 1 failed**, existing
`residual (documented): form-named label — shape-mismatch asymmetry`
at `test/expander/conformance-corpus.test.js:221–235`. Documentation tests were
NOT reached; standalone citation gate and independent full/focused reproduction
were NOT run after the stop. Complete CC streams/commands/exit/pins and dated
attestation are committed at planning2c7ff05ef6d14d1df1950697065978c23127a702 in
`artifacts/evidence/cc/correction02/`. No source edit/retry/filter followed failure.

### Independent exact failing condition

After explicit ownership return, CDC Sol6.1 High reproduced ONLY the failing
Rust arm, with original `compile --no-strict`, same task cwd and exact original
27-byte/no-LF source `(label fn (block (fn 987)))`. The original corpus helper
uses that mode; no skip/permission option was injected. Input SHA256
`37ce2126f73aaef828a263c5bc0ca68a993758f5e3408ce2c823374191ab4ccf`.
Actual POST-MAKE `bin/lykn` byte-equals `target/release/lykn`, SHA256
`746f206298f1a32f3da6210022a2f3e706436d25dd36efb513feffc52893024f`,
unchanged before/after replay. Compiler **exit1, empty stdout, exact diagnostic
`1:18: error: fn requires params and body`**. No generated program runtime,
new variant, JS-backend probe or compiler rebuild. Fresh actual raw/command/input/
producer evidence is in `artifacts/evidence/cdc/correction02-stop/`.

### S02-RD01 — explicit behavior/contract decision required

The CURRENT tracked test explicitly expects Rust success containing `fn(987)`
while JS rejects the form shape. It says a change forces conscious re-disposition.
The [canonical DD-60](../../../project02-language-toolchain-alignment/arc13-expander-coherence/artifacts/design/05-active/0062-dd-60-name-binding-semantics-bindings-shadow-macrosforms.md)
Context/D1/label exception and 2026-07-09 refinement confirm: lexical value
bindings shadow forms; a label is a separate namespace and does NOT introduce
such a value binding. Wrong-shape form fallthrough was documented outside D1's
scope and pinned as expected divergence. Thus this is not automatically a new
compiler bug, a bad test, or proof the whole source program is invalid.

Candidate's checked nested-classification error naturally rejects the recognized
unresolved `fn` form instead of silently cloning it as a call. That aligns with
the proposed S02 error contract and historical JS shape rejection, but does not
override the authoritative pinned residual without Operator decision. Genuine
lexically bound `fn`/foreign calls remain a distinct requirement, protected by
resolution and existing D1 cases; no fallback restoration or oracle change is
authorized here. Historical53/1947 and38-label-cell counts remain dated evidence,
NOT remeasured or claimed fixed by one representative case.

**Recommendation/proposed next scope, NOT approved or issued:** explicitly adopt
rejection of malformed recognized UNRESOLVED forms while preserving real bound
calls/label namespace. Then update only this original corpus expectation and
its coverage/residual comments; append a dated Operator refinement to canonical
DD-60 without rewriting its old decision/counts; clarify this behavior in current
`docs/guides/03-error-handling.md` and assign public behavior/doc/book impact to
S02 and final S07/S08. Keep source case and all D1 controls; do not remove or
weaken the failing test. Production implementation need not change for that
choice. After explicit approval, original full normal Make/citations and separate
CDC gates are still required. If instead preserving legacy fallthrough is chosen,
a new narrow dispatch/error design must distinguish it from invalid nested
forms without reviving silent failure; not a quick blanket raw-clone exception.

All six CE rows remain deferred/CI-02 open. Source483, old d352/maintenancec129/
checked232 refs and accepted release8f are preserved/clean. No policy amendment,
new prompt, source correction, further experiment, integration or later unit
was issued after this stop. Initial test stops below, receipt limitations and
all original F/Project07/book/human/old tooling obligations remain history.

## Retained d352 resumed implementation review

## Resumed implementation review — stopped at d352 (2026-11-07)

Current reviewer `/root/cdc`, OpenAI gpt-6.1-sol High; fresh implementer
`/root/cdc/checked_emission_resume_luna_cc`, OpenAI gpt-6-luna High. Root's
read-only source review independently found the same final-test defect. The
accepted maintenancec129 baseline is unchanged; this section is a NEW stopped
source/test attempt, not a revision of that accepted result or the initial stop
below. No implementation accepted; CE-01–06 deferred/CI-02 open.

### Actual candidate and execution

Task `codex/checked-emission-results-v2@d352e6bafed80048bfe59a3a723b60025e753973`,
clean, descends from maintenancec129. Exactly the original13 allowed source/doc
paths changed. Commits9ce0ef5/cd638cd/fb4c7ce/d352 remain; no rewrite or post-stop
edit. Old checked ref232, maintenancec129, accepted task/release8f remain intact.
Source has a candidate Result/collector/route/docs implementation, **not a proven
fix**. Do not use its built CLI as accepted tooling or integrate it.

CC's sole actual build was `cargo test --workspace --no-run --locked`, exit0,
in the task cwd. Full separate streams/command/exit and post-build producer pins
are durable in `artifacts/evidence/cc/resumption01/attempt01/`, committed by CC
at `e810b4e5548bdf8e0d23eda2995309f127f15b25`. Recorded explicit fresh caches,
fixed DENO_DIR, no global Cargo offline/target override. Actual candidate CLI
SHA256 `9d64b649acd03745ad5aeda6c2ff5f946eacb4e556e4b5273c4fb8290f829189`;
new typed-test executable SHA256
`3cb8f901f686c579981a8b258aabdc810226c4cf787fb176a755dd560048f57b`.
These are built bytes only. No focused test binary, invalid route, runtime,
full Make or cited-path gate ran. New typed tests0/6 source-declared functions,
original invalid/runtime conditions0/4 each, contract observations0/17 at this
candidate. The old c129 results are retained baseline evidence, not new-code proof.

### Independently confirmed final-test findings

- **CE-R05 — wrong nested diagnostic oracle (blocking).** In final
  `crates/lykn-lang/tests/emission_results.rs:41,73`, `values` is the OUTER bind
  list, so `values[2]` is its Obj value. Both tests call
  `classify_expr(&values[2]).unwrap_err()` there. Actual
  `crates/lykn-lang/src/classifier/forms.rs:1509–1525` shallow-clones wellformed
  keyword/value pairs and returns **Ok(Obj)**; it does not classify nested values.
  Correct original-recipe target is `bind.value.obj.values[2]` (the first bad
  dissoc or duplicate bind). Thus the final oracle is built at the wrong node
  and would unwrap Err from Ok before validating emission. This is a static
  source-confirmed test-authoring defect, not an observed runtime panic or a
  compiler/parser bug. No mini-reproduction was needed or executed.
- **CE-R06 — incomplete prescribed constructor/origin coverage.** Final test
  `checked_emission_reports_assign_and_returns_mismatch` covers top assign only;
  no nested-assign case, and no comparison of Codegen diagnostic spans against
  parsed assign/clause origin. It asserts variants/gensym only. The required
  parsed-origin/nested constructor claims remain unverified, not accepted by
  typechecking. The planned tests must be completed without new semantics.
- **CE-R07 — insufficient validation-order countercontrol.** Final
  `validation.rs` tests five isolated sources plus reserved-versus-method only.
  The specified successive suffix combinations of the SAME five inputs are
  absent. Reordering the later nonempty groups can pass these checks, so full
  five-group priority is not established. Existing CLI two-message check does
  not replace that priority falsifier.

These are findings in the claimed FINAL frozen candidate, unlike the earlier
unchecked-inner test alias. That alias existed in cd638; CC attested it was a
temporary intermediate, no check consumed it, and finald352 removes it for
explicit public success unwraps/structured negatives. Preserve the actual
intermediate/timing and intent-attestation limit, not a retroactive acceptance.
Second/intermediate test commits used the older fixed test-message title rather
than the newly assigned source title; actual trailers remain proper. This is
recorded process nonconformance, not evidence of source/test behavior.

### Stop and concrete unissued correction

CDC/Root confirmed CE-R05 by actual frozen source. CC stopped after no-run0 and
BEFORE the first focused test launch, returned source/planning/index/build
ownership, and preserved all bodies/receipts. No source correction, oracle
weakening, extra probe or new implementation dispatch followed.

Proposed ONE consolidated **test-only** follow-up, NOT authorized/issued here:
descend both exact oracle lookups one Obj level and assert the selected bad head;
complete the already-prescribed nested-assign and parsed Codegen origin checks;
replace/extend validation-order checks with the prescribed five suffix mixtures.
No product implementation, fixture/oracle change or new family is proposed for
these findings. Then actual frozen focused tests/generated/runtime and full
normal Make/citation gates plus separate CDC reproduction remain mandatory;
these corrections are not a guarantee the untested candidate is sound. Remaining
unexecuted acceptance is held, not presumed green.

S02 paused pending Operator disposition. Maintenance correction01 remains spent
(1/5; four remain); prompt iteration01 resumed the planned implementation, not a
new allowance. The next actual refinement would be shared02 if authorized.
Original232/maintenance limitations, old tooling8/K0/13, all F/Project07/book/human
owners remain. No S03/integration or later unit follows.

## Retained initial test-only review

2026-11-07. Reviewer `/root/cdc`, OpenAI gpt-6.1-sol High; implementer `/root/cdc/checked_emission_luna_cc`, fresh OpenAI gpt-6-luna High. Root read-only coordination. CDC authored the plan/prompt; this is independent review of CC's actual test source, not independent validation of CDC's own planning. No implementation capability accepted.

## Reviewed condition and evidence strength

Planning prep `fd53e1a9ca53623dfd32f3389570c295e6eb89fb`. Task `codex/checked-emission-results@23219431e6d154a4e046bfd375a01dc8bfb3929d`, tree `5c60578a75a712ab326ba2a0c6caec825d34529e`, clean. Relative to accepted8f the ONLY change is added `crates/lykn-cli/tests/emission_failures.rs` (261 lines); production compiler/docs unchanged. Actual committed source/body/path/trailers independently read. Old task `codex/variadic-for-body-context` and release remain exact `8f5d1990df86405656729972485ae4d11feba808`, tree8b1a05ff; prior match ref8ed retained. CC returned source/planning/index/build ownership and made no post-stop edits.

One focused Cargo **no-run** build exited0 with an unused SystemTime import warning. CC's historical readback is retained in `artifacts/evidence/cc-readback.txt`: output originally existed only in its tool transcript, not durable separate streams; no post-build executable hash or actual binary run. This is attested build evidence, not a CDC rerun or prospective raw receipt. No baseline behavior, generated module/DTS review, Deno child, Result implementation, full Make or citation gate executed. No further probe was needed to establish the static harness defects below.

## Findings (all static, independently source-verified)

Paths here are relative to the exact task source revision2321943; production files are byte-unchanged from8f.

- **CE-R01 — wrong package output directory.** Test package config line42 names `@fixture/emission`; sentinel path151 and positive read paths248–249 use `target/lykn/build/fixture`. `crates/lykn-cli/src/config.rs:176–180` strips the scope to `emission`, and `src/dist.rs:602–610` uses that name for the build directory. Thus the preservation test watches unrelated sentinel files; positive reads point at the wrong files. Not a product failure or filesystem observation.
- **CE-R02 — unsupported positive DTS-existence oracle.** Test224/255 rejects absent DTS for both sources. Neither source exports a declaration. `crates/lykn-lang/src/emitter/dts.rs:201–301` emits no declaration for these exact forms; CLI compile.rs384–387 returns None for empty content and main.rs497–503 only writes Some. Dist.rs252–264 likewise only writes nonempty content. The correct oracle for these sources is explicit absence, with sentinel preservation still separately checked for invalid inputs. No universal DTS promise is inferred or new NE-T01 defect claimed.
- **CE-R03 — missing package runtime control.** Test245–257 builds/reads the two package outputs but never invokes run_deno on them. It therefore cannot prove the required package-route ordinary bound-call result or intentional user-exception behavior. CLI runtime is present but unrun. This is missing test coverage, not evidence of wrong program behavior.
- **CE-R04 — nondiscriminating runtime predicates.** Test237–239 uses `stderr.contains("")` for the successful bound-call control, which is always true. The user-exception control accepts any unsuccessful status and TypeError substring, rather than exact exit1 and its message; successful control likewise needs exact exit0. Required exact stdout is already present. Both route controls need the nonvacuous byte/exit predicates from the plan.

The missing explicit assertion that source mtime exceeds both stale sentinel mtimes and unused SystemTime import are additional straightforward test/capture details for the same proposed correction, not a compiler finding or a separately executed refinement. Setting UNIX_EPOCH does not by itself prove the test watched the real output location (CE-R01).

## Concrete proposed correction — NOT issued/authorized

One consolidated test-only refinement, same source file and source fixtures, no production edits or new test family: use actual `emission` output paths; explicitly assert no DTS for these two nonexporting fixtures; execute both correctly located package outputs; require exact runtime code0/empty stderr for the bound-call and code1/TypeError plus user message for intentional throw, exact existing stdout in both routes; assert actual source mtime exceeds watched JS/DTS mtimes; remove unused import. Preserve all four invalid outcomes before aggregate assertion. Full raw streams/cwd/env/exit and final executable pins must be saved prospectively from the first corrected no-run/build/run.

After explicit Operator continuation, freeze corrected tests first, run meaningful old-API baseline and retain all actual outcomes, then only if sound proceed with the original checked Result recipe and full independent gates. Do not treat the current unrun baseline as red or bypass it. Preserve initial2321943, all receipts/limitations and CDC readiness responsibility. No new implementation prompt, code correction, rerun or budget reset has been issued by this review.

## Row walk and endpoint

CE-01 partial intake/test freeze but behavioral red unmet; CE-02 no production implementation; CE-03 zero of four invalid and zero of four valid route conditions; CE-04 no focused execution/generated/runtime/full gates; CE-05 static rejection only; CE-06 stopped records do not substitute for delivery. All six deferred, CI-02 open. S02 paused pending Operator disposition under the first-substantive-failure rule. Eight old tooling passes, K0/13, F1–F12/Project07/adjacent/API-audit/book/human obligations unchanged.
