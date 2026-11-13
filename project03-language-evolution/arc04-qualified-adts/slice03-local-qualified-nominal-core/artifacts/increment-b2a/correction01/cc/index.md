# B2a correction01 CC evidence index

Status: implementation underway; no acceptance claim. Source/build owner: Luna6High. Root owns planning Git/index/status. Independent Sol review remains separate.

## Intake/readback and timing

- Issued correction: `cc-prompt-iteration10.md`, full 1–165 read; read before editing.
- Full slice plan, `slice-plan.md` 1–384; ledger, `ledger.md` 1–14; source `AGENTS.md` 1–186; `artifacts/b2a-lexical-regions-recipe.md` 1–224.
- Full prior CDC HOLD, `artifacts/increment-b2a/cdc/README.md` 1–168. It records R01 native redispatch and genfunc diagnostic ordering, R02 class-default Array/list-path TypeError, R03 named `kernel:function` parameter-role loss, rejected/unrun probes, and prior full gate reconciliation (1546/67, docs 482). Archive SHA: `d9d1b02c8ace3d9777f292e8e56eacd736f242b97858e27c2134182f668e2963`.
- Prior recipe implementation spine and return contract read from `cc-prompt-iteration09.md` 1–180 and 181–end. Required B2a scope notes and source handoff reconciliation read from `closing-report.md` 206–296. This preserves occurrence ownership, approved host predicate paths, B2b boundary, and the corrected prior denominator.
- Applicable skill guidance refreshed: Rust skill entrypoint and TD-01–03 (`rust-guidelines/SKILL.md`; `guides/05-type-design.md`), EH-01 (`guides/03-error-handling.md`), JS API ID-03–04 (`javascript-deno-guidelines/guides/02-api-design.md`), Testing validation gates (`testing/guides/03-validation-gates.md`). Applied as private named structure/explicit grammar, no panic on malformed forms, preserve private APIs/result shapes, and repository-gate evidence.
- Timing note: this index is being created after the first bounded R01–03 source edits, despite the prompt's before-edit record requirement. One focused command (`cargo test -p lykn-lang lexical_regions --lib`) had already completed before index creation: exit0, selected0, 1191 filtered. It is preserved as a selector miss, not a pass. Initial bounded source edits preceded indexing; the later targeted test additions did not. Preserve this chronology.

## Source pin and scoped source queries

Task source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/qualified-adt-core`, initial clean HEAD `bcb98482fa9b32aa6f58df3e2249123e16924271`, tree `72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9`.

- Native `expand_expr` root entry and redispatch: `crates/lykn-lang/src/expander/pass2.rs` 47–180, called from `expand_all` 25–44 and recursively from child traversal 190–450; native `try_desugar` 549–648. Scope binds feed dispatch via `scope` and shared resolver plans; genfunc diagnostic was before bound-head selection.
- Function layout roles and resolver/pass2 consumers: `crates/lykn-lang/src/lexical_regions.rs` 181–225; source group parsing 41–172. Consumers include `resolver.rs` source function branch (query `rg -n 'SourceFunction|function_regions' crates/lykn-lang/src/resolver.rs crates/lykn-lang/src/expander/pass2.rs`) and pass2 source visitor 283–337. `kernel:function` and `kernel:function*` are recognized, while optional-name detection previously matched only bare `function`/`function*`.
- Public default replacement call path: `packages/lang/expander-core.js` `expandClassMember` 1091–1128; `replaceArrayPath` 1061–1071. Class branch caller is `expandClassRegions` 1075–1088. Embedded exact mirror is `crates/lykn-lang/embedded/packages/lang/expander-core.js` and is checked with `cmp`.
- Relevant existing regression fixtures/tests: `crates/lykn-cli/src/compile.rs` 480–535 (function/class scope and genfunc diagnostic controls); `test/expander/lexical-regions.test.js` 1–end; `crates/lykn-cli/tests/macro_dependencies.rs` 1–end. M6 module/test population still to be captured from the canonical command/script inventory before gate execution.
- No query result is a whole-repository audit. Detailed complete query commands and outputs will be retained in receipts before final handoff.

## Corrections in progress

R01 reuses the existing native entry policy at every same-root returned head with a single macro count and original chain name/location; bound heads skip the genfunc form diagnostic; children remain separately expanded. R02 uses the array-path helper on the local copied method values and keeps mirrors identical. R03 detects optional names from canonical `kernel:` base kind only for function/function* families. These are corrections to reproduced HOLD findings, no new syntax/policy.

## Receipts

Raw command/stdout/stderr/status files are under `receipts/`; record every failed attempt and numeric exit. Focused native run started: `cargo test -p lykn-lang lexical_regions --lib`, receipt stem `focused-native-lexical`; actual exit0; zero selected, 1191 filtered. This is not behavioral proof.

## Final candidate, source inventory, and evidence

Committed source pin: `804be5daace5b0cb708ad21b3beb7eecbd5d00fa`; tree `d25f2b660d3de2e6f52b8ee890172f223c9abc80`; parent `bcb98482fa9b32aa6f58df3e2249123e16924271`; branch `codex/qualified-adt-core`. Post-commit status is clean. Commit message and changed paths were inspected; the seven authorized paths have contiguous `Co-authored-by: Codex` and `Co-authored-by: Billo AI` trailers.

Exactly seven paths changed:

1. `crates/lykn-lang/src/expander/pass2.rs` — re-dispatch same-root outputs at quote/binding/genfunc diagnostic/sugar/macro priorities under one count and original location; process terminal children without re-entering root dispatch.
2. `crates/lykn-lang/src/lexical_regions.rs` — canonicalize `kernel:` base kind for optional names only in function/function* grammar.
3. `packages/lang/expander-core.js` — replace method-default paths with `replaceArrayPath` on the copied method values; delete incorrect list-node helper.
4. `crates/lykn-lang/embedded/packages/lang/expander-core.js` — exact mirror, byte-equal to canonical.
5. `crates/lykn-cli/src/compile.rs` — paired bound multi-clause-genfunc compile controls and escaped named function/generator header controls.
6. `crates/lykn-cli/tests/macro_dependencies.rs` — actual CLI/ESM runtime controls for returned bound/sugar heads, multi-step and runaway chains, kernel named parameter and self-name; M6 expected current 39-case materialized public suite.
7. `test/expander/lexical-regions.test.js` — class method default runtime/count oracle including constructor default and static wrapper default.

`source-query-inventory.txt` preserves the actual affected-body/caller query output. M6 has 14 listed canonical/embedded/materialized compiler modules (including `host-invocation-kernel.js`) and four strict public test files: embedded ADT patterns, surface type context, reserved binding output, lexical regions. Cold M6 on committed HEAD passes exit0; all14 byte comparisons pass, copied CLI/browser-compiled ESM runs, and materialized strict public tests report `39 passed | 0 failed` (11 retained + 17 IC-01 + 11 lexical-region cases).

## Final gates and preserved attempts

- Focused public run used an explicit Deno config mapping `lang/` to the absolute current `packages/lang/` path, with testing and astring imports retained. The corrected class-default test passes omitted=41 and supplied=42, confirms constructor default=40 and static wrapper default=43, and counts the default macro exactly once. Focused public file: 11/11, exit0.
- Native runtime integration controls: 4 selected/6 filtered, exit0. The exact returned bound call prints41; returned `car` sugar wins over same-named macro and prints41; a three-macro chain prints41; supported kernel-object alpha/beta loop exits with the original chain-limit diagnostic at `alpha`; named kernel function with callable `array` parameter prints7; own-name recursion named `array` prints7.
- Native compiler controls: paired bound actual two-clause genfunc with/without unrelated macro passes (outputs equal); escaped named kernel function and generator pass with `array(7)`/`yield array(7)` call roles. Exit0 for final focused selectors.
- Final fresh `make check` retry01 exit0: release build, cited-path/lint checks, workspace Rust tests, full product suite reports 1547 passed (67 steps), and documentation suite reports 482 passed/0 failed (once in this successful attempt). The earlier full make attempt is preserved: exit2, Clippy stopped before test/docs because `while` loop style triggered `clippy::while_let_loop`; refactor to `while let`, format, and focused controls passed before retry. No docs had run during that first attempt.
- Post-commit `make check-cited-paths` exit0 at committed HEAD: 64 documents, 601 accepted historical citations.
- Post-commit `make bundle-size-check` exit0 at committed HEAD: gzip46,418 bytes, +18,788 bytes from 27,630 baseline, within80KiB. Deno emitted existing astring package condition warnings; no package manifest/dependency was changed.

Historical/failed observations retained, not repaired in place: the first `lexical_regions` filter selected0/1191; the mistaken `--lib` target selected0/99; initial untyped test fixture compile failed (exit101); first bound-genfunc output assertion expected a wrong emitted representation (exit101); an authored self-recursive macro hit pass1's expected circular-dependency check (exit101) and was replaced by the exact supported CDC dynamic object alpha/beta fixture; first `cargo fmt --check` identified formatting only and the applied-format rerun passed. Completed command/environment receipt descriptions are explicitly labeled retrospective from actual invocation traces; raw streams/statuses remain the direct captures. Initial evidence-path drift and byte-preserving move into this exact canonical home are recorded above and no mistaken source evidence directory remains.

## Disposition

CC proposes correction01 done for the bounded B2a R01–03 findings and returns source/build ownership cleanly to root for separate Sol review. No independent acceptance is claimed here. B2-LX remains pending CDC disposition; B2b and unanswered B2-ID-NAME, OwnerRef/CaseRef, nominal runtime, purity, LC-02–08 and S03 remain open. No language policy or scope beyond iteration10 is selected.

## Addenda — provenance reconciliations

**Evidence-location correction.** The first index and one focused-command output were initially written relative to the source worktree at `.../contract-predicate-lowering/artifacts/increment-b2a/correction01/cc/`. Their bytes were moved to the canonical S03 planning path `.../slice03-local-qualified-nominal-core/artifacts/increment-b2a/correction01/cc/` and `receipts/`; source-root files/directories were removed only after verifying destination contents. This followed an earlier path drift reminder. All subsequent capture commands use an absolute `EVIDENCE_HOME` resolved to the canonical planning path. No source evidence was committed.

**Bundle-size reconciliation.** The historical iteration09 closing report says45,457 gzip bytes, but its original raw `bundle-size-check.stdout.txt` is46,457 (baseline27,630; +18,827). Root confirms the historical report has a preserved 1,000-byte transcription error and will reconcile status append-only. Independent comparison using the same current Deno 2.9.6, cached esbuild, project config and `scripts/bundle-size.js` against a temporary `git archive` of prior source pin `bcb98482fa9b32aa6f58df3e2249123e16924271` measures46,457; the committed correction measures46,418, a 39-byte decrease consistent with replacing/removing the bad helper. `prior-b2a-size-compare.stdout.txt` preserves this same-script prior-pin result. The first comparison attempt omitted `--allow-env`, failed with Deno `NotCapable` on `ESBUILD_BINARY_PATH`, exit1, and is preserved; `--allow-all --cached-only` retry succeeded. No bundle source/build setting was changed.

**Final source/query and invocation records.** `postcommit-inspection.*` captures exact commit message/trailers, seven paths, clean status, final tree and mirror comparison. `cold-m6-final.*` is the committed-pin M6 run and `m6-final/` contains the 14 module equality receipts, strict public command/config/status and `39 passed | 0 failed`. `postcommit-citations.*` and `postcommit-bundle-size.*` capture committed pin gates. `source-query-inventory.txt` preserves affected full caller queries, module/test population, and the exact fourteen-file M6 list/its consumers.

**Additional guidance reconciliation.** During final review, loaded Rust anti-patterns AP-12/AP-18, JS anti-patterns ID-14/ID-16, Deno testing ID-01/04, and Testing Discipline. This happened after source edits and is recorded honestly. The already-applied design moves the root S-expression instead of cloning the full form; class defaults replace within a local array copy and do not mutate input; malformed paths stay in fallible existing classifier diagnostics; tests assert actual emitted/runtime behavior and await subprocess completion. Earlier loaded guidance remains as recorded in Intake.
