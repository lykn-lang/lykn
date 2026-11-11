# Independent review of completed AT-02 specimen

## Current verdict

The frozen completed decoder satisfies its bounded 35-row ordinary population in native default, native stripped, and public default. All 40 emitted observations per condition match an independently authored structured-value oracle, including every exact key, unchanged original alias, updated nested value and untouched sibling. The 12-row L-03 population is fully characterized in each condition; T11/T12 expose real compiler failures and are not passing language behavior. Zero-field supplemental output independently reproduces the existing public discrepancy. No source repair or canonical planning/Git write was made by this review.

This verdict concerns the exact source bytes below, pending the contributor's immutable candidate commit and final narrative reconciliation. Operator source-shape review remains pending. Compiler/guide repairs remain open at their existing Arc03 destinations; successful sequential-match decoder code does not close them.

## Identity and scope

Input source copied before execution from planning artifacts/at02/final and matched the coordinator's three declared hashes:

- decoder.lykn: 7a99e9d63836b78d60047045f7129ca4780a20e8c494c17c31bb9ac8e52123ad
- controls.lykn: c5db7b99f2ca1cea3d6f41ded36233daad6cb4713d35d9876a435978174a39bd
- zero-field-control.lykn: 3f56706c048cbba48c1f6891e2118aaad368d224c9bf5568b8656cf2071ae023

Source worktree /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering, codex/completion-value-flow, immutable 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. Copied CLI SHA256 0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2; Deno/book pins remain the coordinator-verified original identities. Public packages/lang was copied unchanged from this reviewer's original exact-commit export; retained config/lock/driver copied unchanged. No new dependency or network execution. Runtime DENO_DIR=/Users/oubiwann/Library/Caches/deno.

Evidence root: /private/tmp/lykn-at02-cdc-final.XeqVk0cQ. Copied specimens are case/*.lykn. All generated files live under case/target and public/target. logs/<cell>/launch.json records executable, cwd, exact argv, clearEnv=true and the complete explicit environment before execution. The same cell retains stdout.raw, stderr.raw and exit-status.txt. Lykn orchestration source is case/replay.lykn; exact outer launch is metadata/replay-launch.txt. The structured oracle is case/audit.lykn, earlier revision audit-decoder-and-format.lykn, and first failed helper source audit-attempt01.lykn. No handwritten JS or substitute research logic was authored. Public generated stdout was copied unchanged for execution.

## Reproduction and denominators

49 specimen commands executed, all exit 0: per three source files, check/lint, native default and stripped compile/run, two formatter passes, formatted default and stripped compile/run (36 commands); public driver compile (1); per three files original/formatted public compile/run (12). The public compiler has no stripped mode; no public stripped execution is claimed.

Each decoder run has 40 lines corresponding to 35 frozen rows: R01-R09=9, C01-C14=14, U01=1 row with 2 observations, K01-K10=10, E01=1 row with 5 observations. 35 ordinary rows x3 compiler conditions=105/105 matching row outcomes, with 40x3=120 raw observations. Formatted replay repeats those same outcomes, rather than adding new independent case variants. The six decoder executions pass 40/40 exact-value checks each (metadata/audit-extended.stdout).

Each guard run has 12 lines. All 36 raw row/condition cells are observed; 30 characterize the declared expected/default/stripped boundaries and 6 T11/T12 cells expose implementation failures. All 12x3 cells have dispositions, not 12x3 successful language behaviors. Formatted executions reproduce the same dispositions. The command exits are 0 because observe-control catches each unexpected exception and serializes its type/message. No runtime stdout/stderr is silently discarded; all 18 raw/formatted runtime command stderr files are empty.

All three specimens' first and second formatter outputs are byte-identical. Original/formatted generated JS is byte-identical within each native/public condition. Runtime output is byte-identical within each original/formatted condition. Decoder observations are equal across all three compiler conditions. Native/public codegen whitespace/gensym differences are not treated as semantic failures. Check and source lint pass; compiler warnings remain recorded, including unused type names and controls' same-named type/constructor shadow warnings. A clean source-lint exit does not erase those compiler warnings.

## What the exact values establish

- R01-R07 preserve all six actual JSON:parse shapes and the full J01 name/n/flags/nil fixture. Recursive wrong raw array member fails as Rejected/WrongValue at $[1], with valid parsed sibling inputs present.
- R09 visits a raw own undefined label and returns Rejected/WrongValue at $["label"]. U01 separately proves Some(JUndefined) presence and rejects it at config label, while missing gives LabelMissing. HostValue/JUndefined is declared separately from the six JsonValue cases (decoder:1-14).
- C01-C14 verify inclusive integer endpoints, invalid bounds/fraction/string/missing/null, and missing/null/empty/nonempty/false/zero label distinctions. Expected failures are ADT data with exact variant/path/value; they are not counted merely because some error occurred.
- K01-K10 verify all nine exact keys and exact numeric values, including first-name vs firstName, empty/colon/slash/tilde, __proto__, constructor and toString. The model stores Entry key strings as data, with no keyword normalization or native prototype assignment.
- E01 verifies the entire original alias still has nested __proto__=6, the updated whole tree changes exactly nested __proto__ to 55, the new root identity differs, and the nested constructor sibling remains 7. The oracle compares full expected trees, not just a single changed scalar.

## Guard and generated-code review

Native default controls JS:2-12 has scalar and outer-array constructor guards; stripped controls JS:2-7 removes them. Native/public default expectControl checks object/non-null/tag presence (native controls:30-34; public controls:49-53), not constructor identity or payload recursion. Thus unrelated OtherTag and forged ControlNumber with wrong payload pass the broad annotation; match returns "wrong" from the forged payload. Missing-tag input throws by default and passes stripped. Wrong nested array member passes outer-array validation in all modes. Omitted arm reaches the actual runtime fallback in all modes; wildcard yields "wildcard".

T11/T12 native generated nestedControl omits nested tag check and bound number (native controls:86-111; stripped:67-92); both inputs return an unbound number and serialize ReferenceError. Public controls:105-130 tests t__gensym7 before its block declaration and also serializes ReferenceError. The balanced independent minimal control already isolated this behavior. T12's frozen matrix calls its negative input NestedNull, but actual controls uses ControlNull (:111); this is a documentary name mismatch, not an absent negative control. Preserve a transparent correction rather than changing source.

Decoder stripped JS:100-120 retains explicit null/type/Array.isArray/object dispatch and recursive conversion. Its port branch at :145-149 retains Number.isInteger and inclusive bounds. These are ordinary explicit code, separate from removed generated guards. Runtime exact invalid cases remain rejected after stripping, so survival is demonstrated. Config and label checks use sequential matches to avoid the independently observed nested-pattern defect; this workaround does not repair the compiler.

Supplemental zero-field-control uses separate ListDeclared/BareDeclared types. Native emits constants and prints tagged values; public emits a ListZero function and logs `list-declared-zero undefined` because JSON.stringify of a function returns undefined. BareZero is tagged in both. This contributor fixture differs from the independent earlier one-type ZeroForms control, which also printed typeof and array serialization. Both establish the same documented parenthesized-form discrepancy without rewriting either source.

## Reference and history review

Initial answer/source/reference log remain immutable at de33d6bf and retain guide09 partial read 1-260. Original failed check/lint/default/stripped results stay attached. The contributor's public-original skip remains an actual skip; independent review separately ran public and observed accepted malformed input with no demonstrations. Do not retroactively attribute that public run to CC.

The replacement-context receipt initially reused prior-author reads; iteration02 correctly identifies this as inherited provenance, not current-context coverage. Its appended table reports actual complete same-context skill/guide09 and assigned guide00/05/06 reads before extension edits; the prior receipt remains. This correction repairs the later reading condition without repairing the first-author condition or establishing guide efficacy. Iteration03/04 preserve explicit runtime constructor bindings, expression-style correction, all five delimiter-failing attempts, and the coordinator's superseded stopping rule. No successful final outcome can erase those failures.

R09's post-observation expectation-text correction is explicitly logged: omitted root $ repaired to the already-required $["label"] with input/source/output unchanged. This is an expectation typo correction, not a new passing fixture. Original opportunity list's broader matrix opportunities are not all original-task promises; distinguish openly absent native parsing/J08/compiler controls from original required demonstrations.

Current iteration-results.md is a preserved pre-resumption stopped-state report and must remain historical. The final closing report still needs to reconcile it rather than silently changing it into a successful record. Final contributor narrative and immutable commit are pending at this checkpoint.

## Source quality and bounded claims

Explicit :any is appropriate at genuinely unknown raw decode-json input and a polymorphic Option/Decoded payload; checked discrimination is the operation being researched. Other locations have known domain types that could carry stronger names: Entry.value (decoder:12) normally JsonValue; ServerConfig.label (:26) is Label; Rejected.failure (:22) is DecodeFailure; known decoder results could use DecodeResult return annotations. The deliberate U01 host injection currently relies on Entry.value accepting HostValue/JUndefined. A later library design should separate the untrusted/raw fixture boundary from validated JsonValue data and consider naming those known field/result types. This is a source-design opportunity for operator review, not an added correctness gate on this frozen specimen. Current compiler user-ADT guards are shallow tag-presence checks, so more specific annotations alone would not prove recursive membership or remove the need for explicit validation. No generic syntax or public API is proposed here.

The successful data begins at actual JSON:parse host values plus the two controlled unsupported-value injections. Raw parser token detail, duplicate source entries, exact large-integer identity, number lexemes and document bytes are not preserved by this ADT model. JSON:parse can also yield Infinity from text such as 1e400; this specimen does not establish finite/lossless number fidelity beyond the frozen cases. No extra numerical matrix was added. Arbitrary host object, cycle and resource-limit guarantees are expressly absent. run-config-case parses known valid fixture text directly and does not capture malformed JSON parse exceptions; the present matrix establishes expected decode failures as data, not a general safe parsing API. Final narrative must keep that bound explicit if discussing parse failures.

## Routing review

Arc03 arc-plan routes D-2611-RDEO/NPAT/ZVAR under A3-04 and RTCK under A3-03 and keeps repairs open. Reader, nested and return-check descriptions match reproduced evidence. A ZVAR provenance mismatch in backlog text initially described separate types as the independent control; the coordinator corrected it to the actual one-type ZeroForms source and separated observed serialization from inferred matching risk. Recheck final committed text when recording canonical review. These routes do not accept final decoder source, repair compiler behavior, accept book wording, or supply operator readability judgment.

## Provisional JV disposition

JV-01 through JV-04 have independently reproduced bounded research evidence: six-kind recursive conversion, domain/presence failures, characterized guard/match boundaries including actual failures, and exact keys/immutable update. JV-05 has independently reproduced machine/format evidence and preserved history/reference deviations; final contributor packet/commit and explicit human source-shape review remain to be reconciled. No ledger row is changed in this read-only review. Original task completion remains 0/1; the successful completed specimen is a corrected/extended result, not a retroactive first-attempt success. User review coverage remains 0 reviewed and pending.
