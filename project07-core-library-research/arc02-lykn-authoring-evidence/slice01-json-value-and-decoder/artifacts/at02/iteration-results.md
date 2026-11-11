# AT-02 iteration01 execution results

Contributor execution on 2026-11-10/11 under source `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`, CLI `0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2`, Deno 2.9.6 SHA `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`. No source checkout was modified. All execution used the pinned CLI. No generated code was edited.

## Original-first run (source unchanged)

The scratch copy was byte-compared to the frozen `initial/decoder.lykn` before use. Commands were run from `artifacts/at02/scratch/initial/` with `project.json` `{}` and target path `target/`.

| Command | Exit | Result / raw evidence |
|---|---:|---|
| `lykn check decoder.lykn` | 1 | `unterminated list at 64:1`; `scratch/initial/check.*`. |
| `lykn lint decoder.lykn` | 2 | `cannot lint (parse error): unterminated list at 64:1`; `scratch/initial/lint.*`. |
| `lykn compile decoder.lykn -o target/default.js` | 1 | `unterminated list at 64:1`; `scratch/initial/compile.*`. |
| `lykn compile --strip-assertions decoder.lykn -o target/stripped.js` | 1 | `unterminated list at 64:1`; `scratch/initial/stripped-compile.*`. |
| Native default/stripped runtime | not run | Compile failed; no JS outputs existed. |
| Public default compile/runtime by this contributor | skipped | Source failed the accepted-source prerequisite. Iteration03 records separate independent reviewer public evidence as a coordinator contribution; it must remain attributed to that reviewer. |

This reproduces a syntax blocker, not a runtime claim about the initial decoder. No first-source repair was attempted. The original response/source and reference receipt remain unchanged at `de33d6bf`.

## Final-source correction attempts

Five whole-source snapshots and their command outputs are preserved under `scratch/final/iter01` through `iter05`. The executable check used was `lykn check decoder.lykn` from `artifacts/at02/final/`, against the current source snapshot at each attempt.

| Attempt | Source | Exit | Parser output |
|---:|---|---:|---|
| 1 | `scratch/final/iter01/decoder.lykn` | 1 | `unterminated list at 107:1`; raw logs `final/check.*`. |
| 2 | `scratch/final/iter02/decoder.lykn` | 1 | `unterminated list at 105:1`; raw logs `final/iter02-check.*`. |
| 3 | `scratch/final/iter03/decoder.lykn` | 1 | `unterminated list at 105:1`; raw logs `final/iter03-check.*`. |
| 4 | `scratch/final/iter04/decoder.lykn` | 1 | `unexpected ')' at 72:63`; raw logs `final/iter04-check.*`. |
| 5 | `scratch/final/iter05/decoder.lykn` | 1 | `unterminated list at 128:1`; raw logs `final/iter05-check.*`. |

The five-iteration correction bound in the assignment has been reached. Stop rule applied: no more source corrections or final matrix commands were made. The current `final/decoder.lykn` is an unaccepted, parse-failing draft, retained as evidence only. `lykn lint`, compile, default/stripped runtime, formatter passes, generated-output review and public compiler/runtime for the final specimen were not run. There is no final JS output to compare.

## Matrix disposition at the earlier stop

The assessment's exact control population was not expanded into a timestamped case manifest before final-source checks. The source draft contains the following planned ordinary cases, but this list is a retrospective disposition rather than a preregistration: 8 raw-value calls (J-02 six kinds, J-01 nested input, injected nested undefined); 14 config calls (port 0, 65535, -1, 65536, fraction, string, missing and null; label missing, null, empty, text, false and zero); one direct own-undefined config; one exact J-08 key object; one nested full-key-set edit witness. None ran because source did not pass `lykn check`. L-03 constructor/annotation/tag/match controls are not authored in an executable control specimen. Do not count any of these 25 planned values as observed cases.

| Ledger row | Actual disposition in this contributor's run | Status |
|---|---|---|
| JV-01 six JSON shapes and recursive nested wrong value | Initial source declares JSON-like ADTs but doesn't parse native input or walk nested members; it does include no runtime witness. Final recursive raw conversion draft fails syntax. | Open; authored shape partial, runtime matrix blocked. |
| JV-02 expected config failures, paths and option distinctions | Initial branches and examples are present but not executable. The final strict decoder and boundary case list are only in the parse-failing draft. | Open; execution blocked. |
| JV-03 constructor, annotation and match boundaries | Prior ADT preflight is a separate control specimen and remains useful; AT-02 original run is syntax-blocked. No final matrix. Independent original public run belongs to reviewer evidence, not this receipt. | Open; assigned matrix incomplete. |
| JV-04 exact dynamic keys and immutable nested edits | Final draft has exact J-08 strings and a nested `__proto__` update expression, but no execution or alias evidence. | Open; authored draft only. |
| JV-05 authoring, formatting and reference evidence | Frozen first capture, initial receipt, same-context intake correction, raw failed runs and source snapshots exist. Final candidate failed syntax; lint/formatter/recompile/behavior evidence unavailable. | Open; evidence record incomplete for acceptance. |

Initial task completion: **0/1** all criteria met; **0/1** runtime tasks executed and **1/1** blocked before execution. These denominators are distinct. No guide-violation incidence or attribution distribution is reported. Initial opportunity list is at `initial-opportunities.md`; machine failure and authored omissions remain separate.

## Earlier stop receipt

This contributor reached the coordinator-inserted correction bound with a parse failure. The earlier stop accurately describes that checkpoint only. Iteration04 records the operator's standing autonomy instruction and authorizes the exact routine delimiter and conditional-expression corrections. The subsequent continuation is documented below; the earlier receipt is not retroactively rewritten.

## Iteration04 authorized continuation and final matrix

The sixth check and final source pin are preserved separately from attempts 1–5. At iteration06, the exact parent-specified fixes made the source parse. Iterations07–10 retained later authored corrections and actual outputs, including a mistaken key-probe result at iteration07 and corrected key observations at iteration08. Iteration11 is the frozen final specimen after (a) documented correction from parenthesized to bare zero-field variants, based on observed native/public divergence, and (b) separation of host-only `JUndefined` into `HostValue`. No later source change was made.

Final pinned source hashes: decoder `7a99e9d63836b78d60047045f7129ca4780a20e8c494c17c31bb9ac8e52123ad`; controls `c5db7b99f2ca1cea3d6f41ded36233daad6cb4713d35d9876a435978174a39bd`; zero-field control `3f56706c048cbba48c1f6891e2118aaad368d224c9bf5568b8656cf2071ae023`. The `final/` copies byte-match the iteration11 executed sources.

| Check | Contributor disposition | Evidence |
|---|---|---|
| Final `lykn check` | Decoder (65 top-level expressions), controls (26), zero-field control (4): exit 0. | `scratch/final/iter11/check-*`; retained copies under `evidence/final/native/`. |
| Final `lykn lint` | All three exit 0; no findings. | `scratch/final/iter11/lint-*`; `evidence/final/native/lint-*`. |
| Native compile | Decoder and controls default and stripped, plus zero-field control: all exit 0. | `scratch/final/iter11/compile-*`; generated JS copied to `output/native/`. |
| Native runtime | All five default/stripped/control observations exit 0. Decoder default and stripped stdout/stderr match byte-for-byte. | `scratch/final/iter11/run-*`; exact output retained there. |
| Public compiler/runtime | Decoder, controls and zero-field driver compile and run exit 0 using the frozen cached-only/frozen fixture. | `scratch/final/iter11/public/*`; generated JS copied to `output/public/`. |
| Decoder observation equality | Native default and public default stdout match byte-for-byte. All 35 ordinary case rows have corresponding outputs in both. | Native/public raw stdout and status files under `scratch/final/iter11/`; matrix in `matrix.md`. |
| Controls | All twelve controls produce corresponding outputs. T11/T12 throw `ReferenceError` in both compilers, with differing messages (`number is not defined` native; `t__gensym7 is not defined` public). | Native/public controls stdout; emitted JavaScript in `output/`. |
| Zero-field forms | The isolated list-vs-bare control shows native supports both; public emitted function for list form does not construct a value (`undefined`), while bare form works. The final specimen uses bare zero-field names and native/public output agrees. | `final/zero-field-control.lykn`, `output/zero-field-pre-fix/`, `output/public/zero-field-control.js`, runtime logs. |
| Formatting | Two formatter passes were byte-identical for all three pinned source files. | Formatter receipts in `scratch/final/iter11/` (see `replay.md`). |

Own-undefined evidence is split deliberately: raw JSON-like input with an own `label: undefined` is rejected by the raw boundary at `$["label"]`; the separate ADT-domain presence control returns `Some(JUndefined)`, then strict config rejects it at `label`. This host-only sentinel is not one of the six `JsonValue` variants.

### Independent-review boundary and ledger disposition

The coordinator reports that the independent reviewer replayed the exact three final hashes with 49 command cells exiting 0. The completed exact-value audit confirms all **105 ordinary row-condition outcomes** (35 rows across three compiler/mode conditions) and all **36 control dispositions** (12 rows across three conditions), including six actual nested-match failures (T11/T12 in native default, native stripped and public default). This is coordinator-reported reviewer evidence, not a contributor-owned replay; its raw packet remains in the separate parent-owned `independent-original/` path and is not included in this contributor's commit. The reviewer confirms equality and guard results; independent final ledger disposition is still for the parent to reconcile.

The final trial moves the initial task from blocked-before-runtime to an executed specimen, but does not establish guide efficacy or complete repository/library acceptance. JV-01, JV-02 and JV-04 now have strong contributor runtime evidence; JV-03 retains the observed nested-match implementation failure and awaits independent disposition; JV-05 retains the authoring, reference, formatter and execution record. **All five JV rows remain open** pending independent review and operator review. No readability judgment is attributed to a person. Do not treat 47 manifest rows as 47 successes without checking each expected result and each compiler/mode cell.
