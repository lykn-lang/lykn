---
project: project03-language-evolution
arc: arc01-compiler-semantic-integrity
slice: slice01-variadic-for-context
status: closed
planned-release: unassigned
---

# S01 — faithful variadic numeric-for bodies

## Final endpoint — 2026-11-07

Independently accepted task-only source8f5d1990df86405656729972485ae4d11feba808,
five VF rows done. [Verification](cdc-verification.md), implementer-attributed
[closeout](closing-report.md) and [retrospective](cdc-retrospective.md) preserve
the initial stopped test attempt, explicitly authorized correction01 and raw
capture limits. Fresh independent full normal Make/focused/citation/runtime and
unchanged-walker compile-only proof pass. No further substantive failure arose.
Source release/bin actual SHA657ff4cc...; release5408 unchanged. S02/tools/K/
integration remain held, eight spent tooling passes unchanged. Endpoint complete;
the historical authority and attempts below are not retroactively rewritten.

## Approved continuation — 2026-11-07

Operator explicitly authorized the consolidated four-part test correction then
original S01 repair, same Luna6 High CC/separate Sol6.1 High CDC and first further
substantive-failure stop. [Preserved correction01](cc-prompt-iteration01.md)
supersedes the inadequate validator alternative and defines actual public runtime,
direct emitter-header counter, independently selected native negatives and
Deno.cwd fixture path. Correction1/5, no reset; eight spent tooling passes remain.
Corrected actual tests must be committed and statically reviewed before baseline.
The preceding stopped condition below is retained, not cured retroactively.

## Current review state — 2026-11-07

Paused under the Operator's first additional substantive-failure stop. Frozen
test-only1d2dbcfa has static test-contract defects documented in
[independent review](cdc-verification.md). Two no-run builds succeeded per CC;
zero behavioral tests/runtime/witness/full gates executed. Production profile
unchanged, NE-C12 unfixed; all five VF rows open. A consolidated test-correction
proposal is recorded for Operator decision, not issued or executed. The original
recipe below is preserved, including its inadequate validator alternative;
the review owns that CDC readiness error. No source/tool budget reset.

## Authority, roles and endpoint

On 2026-11-07 the Operator approved the incremental design direction and said:
“Let's open S01 and fix NE-C12. Let's go back to Luna6 High for CC and with CDC
staying at Sol6.1 High, Autonomous Mode, and stop on any further substantive
failures”. This opens S01 only, not S02, the full arc, tools or K execution.
The normal source refinement ceiling is five, but the explicit first additional
substantive-failure stop is stricter: expected NE-C12 baseline red is the known
prerequisite, while an unexpected substantive failure stops dependent work and
returns to CDC/Operator. No automatic corrective cycle, budget reset or workaround.
Mechanical formatting with original bytes retained does not waive semantic gates.
Eight spent tooling passes remain unchanged; no tooling allowance is renewed.

CDC `/root/cdc`: OpenAI Sol6.1 High, design/independent review/planning close.
Fresh fork-none CC: OpenAI Luna6 High, implementation and raw evidence only.
Root is read-only transport/co-design. CC receives explicit source/planning-index
ownership after the committed prompt; CDC then performs no overlapping writes or
builds. After clean ownership return, CDC independently validates before acceptance.

Accepted source baseline: `8ed869f1ed24bf688ba91f71d8c539680136794e`, existing
`.worktrees/contract-predicate-lowering`, currently codex/match-subject-values.
CC creates **codex/variadic-for-body-context** at that exact clean tip in the same
checkout, preserving old refs. Release/0.6.x5408 remains read-only. Endpoint:
reviewed task-only repair, native/full-gate proof and this slice close/retro, or
an independently verified additional-failure stop. No source integration follows.

## Binding repair and source-ready proof

At8ed `crates/lykn-lang/src/emitter/forms.rs::kernel_child_profile` assigns
numeric-for `Positional([Value,Value,Value,Statement])`; later indices default
Value. Classifier forms.rs463–475 and printer codegen/emit.rs734–747 establish
three Value headers followed by every body form in Statement context.
Use the existing `PositionalThenStatement(&[V,V,V])` for **numeric-for only**.
Preserve saved-context restoration, resolver/form-head identity, header ordering
and all other loop profiles. No public signature, error-channel or JS compiler
change. This is one precise application of the approved semantic-role contract.

Allowed source paths:

- `crates/lykn-lang/src/emitter/forms.rs`: meaningful inline behavioral tests,
  then the narrow profile/comment repair.
- `crates/lykn-cli/tests/variadic_for_bodies.rs`: actual default strict CLI/check
  positive and three consumed-header negatives; direct Deno runtime.
- `test/fixtures/variadic-for-bodies.lykn`: one shared positive program below.
- `test/forms/for.test.js`: extend existing product tests to exercise the same
  fixture through public `lykn` and three negative headers. This is authorized
  product test code, not a JS research/orchestration helper.
- `docs/guides/00-lykn-surface-forms.md`: narrow numeric-for prose clarification:
  first three positions are header values; subsequent forms are ordered statements.
  Do not change do-while or add unrelated guide repairs.

### Frozen intended cases and predictions

The source shape below is source-guided, **not yet compiled**. CC freezes exact
fixture/test bodies in Git before actual baseline execution. No oracle changes
to match observed output. Runtime fixture:

```lykn
(bind trace (array))
(for (let i 0) (< i 2) (++ i)
  (if true (trace:push i))
  (bind value (+ i 10))
  (if true (trace:push value))
  (bind next-value (+ value 1))
  (if true (trace:push next-value))
  (if false (trace:push 999)))
(console:log (JSON:stringify (obj :trace trace)))
```

Expected parsed JSON is exactly `{"trace":[0,10,11,1,11,12]}` with exit0 and
empty runtime stderr. Multiple body slots, first/late no-else ifs, false branch,
and sibling declaration sequencing must survive. Inspect the complete generated
module: declarations are siblings inside the loop block, later reads use them,
and body ifs remain statements. Native baseline is predicted to check/compile0
but emit internal error instructions for later body ifs and fail runtime; the
existing public JS backend is predicted to pass. Actual differences remain facts.

Inline emitter behavioral tests must call actual `emit_expr`/`emit_form`, not
merely compare the profile to itself. Build a numeric-for list using existing
test `atom/list/num/ctx/reg` helpers with first and multiple late no-else body ifs
and intervening bind/uses; inspect emitted kernel nodes by `as_list/as_atom`:
body if heads remain `if`, declarations remain sibling `const`, order is retained,
and the caller context is restored. A countertest places no-else if in EACH of
the three header slots and proves those remain Value by actual lowered rejection
shape (or existing semantic validator), not by a textual substring alone.
These distinguish the real repair from making every child Statement.

Three CLI/public-JS negative sources replace exactly one header of
`(for (let i 0) (< i 1) (++ i) (console:log i))` with respectively
`(if true 0)`, `(if true true)`, `(if true 1)`.
All must reject with existing “if in expression position requires an else branch”
diagnostic. Run native `check` and default `compile -o` (no no-strict or strip
flags); no emitted JS for each failing compile. Public JS must throw the existing
compile error. No invalid generated module is executed. Record actual output
before assertions; check's broader behavior is not expanded by these cases.

Use existing async_expression_values.rs process/TempDir/serde_json patterns and
for.test.js/public async-expression-values.test.js product test patterns; no new
generic harness, dependencies, script language or runtime API. Use `LYKN_TEST_DENO`
with actual `/opt/homebrew/bin/deno`. Deno generated-program children use
`run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt` with
no extra permissions. Existing public-product test setup may use the repository
cached compiler dependencies and normal sanctioned test permissions, not a new
research JS wrapper. Generated children remain strict.

## Execution and acceptance spine

1. Read required inputs, revalidate clean source/branch and guides, record concise
   intake/readback in owned raw `artifacts/evidence/cc/`. Establish actual Rust
   from source cwd (previously1.97), Deno2.9.6/hash2ad84… and existing cache/tool
   availability. No installation/update, hooks bypass or remote action.
2. Commit test/fixture bodies **before** dependent baseline checks. Build all
   focused lib/CLI binaries with `cargo test --offline --locked --no-run` and
   native CLI build as needed, then pin actual executable paths/hashes after the
   LAST Cargo invocation. Run direct built test binaries, no intervening Cargo
   before their actual CLI/Deno use. Retain raw red and complete generated JS/DTS.
3. Apply only the profile repair and guide clarification, freeze actual Git
   bodies, then build/no-run and freshly pin again. Run the exact unit/CLI/public
   product cases green with real populations and generated module review.
4. Verify original NE-C12 witness by compiling the exact unchanged Slice19 walker
   from9122473 (source SHA033762a58aa1a9a3104c097641666fc2dc794f08115ce913de2009f78be688c7)
   in an owned genuinely config-free `/private/tmp` cwd. Preserve actual source/
   CLI/output hashes and inspect the formerly bad three sites/complete affected
   functions. No helper semantic edit, execution, observer/core repin or K case.
5. Commit source before citation gate. Run full normal **unfiltered `make check`**
   and `make check-cited-paths`; preserve complete stdout/stderr/exits from launch.
   Use unique owned npm_config_cache/XDG_CACHE_HOME from the first launch and the
   accepted DENO_DIR (record actual value), normal Cargo metadata/resolution env;
   no global CARGO_NET_OFFLINE/CARGO_TARGET_DIR overrides, filters or suppressions.
   Existing legacy npm compatibility tests are part of this gate; no new Node/npm
   research dependency or installation. Re-pin actual release/bin after Make.
6. CC commits only allowed source/raw paths with exact -F message/readback,
   returns clean status, actual source/tree/binary pins, gates, counts, limits and
   ownership. CDC reviews diff/source/generated bodies, independently repeats
   focused behavior, unchanged witness compile and full normal gates/citations
   with separate outputs/caches, then per-row acceptance/close/retrospective.

S02 remains held on its separate public Rust compatibility decision. S03–08,
all tool/K/corpus/F6/library work, adjacent candidates and release propagation
remain outside this endpoint. Original F1–F12/Project07/book/human gates survive.

## Author readiness and guideline application

CDC inspected actual8ed profile/caller context, classifier and printer, existing
for tests, the native async-expression CLI harness and public JS product tests.
The five-path recipe reuses the existing enum and behavior routes; no new API,
resource lifecycle or concurrent mechanism is introduced. Rust anti-pattern
guidance supports the existing typed enum/private slice rather than magic index
exceptions or a new abstraction; testing discipline/validation gates require
actual red/green plus header negatives and normal repository gates. Prompt
authoring guide's test-oracle and actual-tool rules drive the committed-body and
post-build pin order. Current guide/example reads establish authoring shapes,
not unrun behavior. First additional substantive failure stops without masking it.
