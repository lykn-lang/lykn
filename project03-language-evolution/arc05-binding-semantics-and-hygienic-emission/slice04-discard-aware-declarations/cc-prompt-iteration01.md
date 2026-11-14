# CC correction01 — grouped exports and recursive parameter proof

Issued2026-11-14 after separate correction01 readiness PASS and committed
open set, following the consolidated independent918 source-first HOLD.
Project03/Arc05/S04, first refinement of [cc-prompt.md](cc-prompt.md),1/5.
Same Luna6 High CC / separate Sol6.1 High CDC, Autonomous Mode through S04
independent task-branch close only. Root owns design/planning/index/status.

## Immutable candidate, findings and exact scope

Start cleantask `918f2e9c4237770fc7b2e0e950d726e735e95198`, tree
`37b1cd6e7a457caf94933a35cdac54335c7afb66`, parentc60, existing
codex/qualified-adt-core at
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Release/0.6.x staysc60. Planning is the separate orphan
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`.

Read the [independent source-first HOLD](cdc-verification.md), including R01/02
and all eight DT dispositions. No emitter defect was demonstrated. Earlier
green gates are doer attestation; the missing cases allow a broken grouped
renderer or recursive path to pass. All8DT/BS-04 remain open.

Only ONE product file may change in this correction:
`crates/lykn-cli/tests/discard_declarations.rs`.
Complete S04 delivery remains the same four paths; do not amend918 or earlier
reviewed commits. No DTS implementation/docs/runtime/AST/classifier/macro/
dependency/lock/M6 population change. Keep the existing four Rust test groups.
If a new valid case exposes an actual emitter defect, retain it and return to
root before production edits outside this test-only assignment.

## Required reading and intake

Required-full: this prompt, current slice-plan.md and ledger.md, source AGENTS.md,
complete current817-line discard_declarations.rs, independent918 HOLD section
and its row walk. Required-section: original prompt helper/commit/return rules;
plan A–D and proof mapping; canonical closing-report.md original handoff and
retention limits; complete dts.rs param_shape_to_ts/emit_func_args/module Bind/
BindGroup/helper paths plus relevant TypedParam/DestructuredField/ArrayParamElement
definitions; classifier actual bind-group and recursive parameter parsers.
Load complete typed nested-parameter alias emission in emitter/forms.rs and
codegen emit_alias_pattern: property key versus leaf binding is consequential
to the R02 runtime specimen.
Guidance: testing discipline/Proportionate Proof; engineering-methods intake;
Rust AP09/AP12/AP13; prior S04 boundary-applicability record. Resolve through
catalog, read complete named extents and recover clipping before edits.

Append intake/readback BEFORE edits to the exact canonical file:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice04-discard-aware-declarations/artifacts/cc/intake.md`.
Do not write evidence under source artifacts/. The first-class close is exactly
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice04-discard-aware-declarations/closing-report.md`.
Append correction01 there, preserving the initial report/root location notice.
New raw evidence/cache/M6 homes use correction01 under the existing owned
planning artifacts/cc and `/private/tmp/lykn-arc05-s04-cc` roots; no overwrites.

## R01 — positive grouped binding exports

Extend the existing export fixture/consumer/runtime test, not a new harness.
Add BOTH real branches (illustrative source sketches, not prior executed input):

    (export (bind _ 7 :number grouped-number 11 grouped-text "group"
      (object (alias "leaf" grouped-leaf)) (obj :leaf 17)))
    (bind :number grouped-kept 13 :string grouped-hidden "hidden"
      (object (alias "leaf" grouped-selected)
        (alias "hidden" grouped-nested-hidden)) (obj :leaf 19 :hidden "hidden") _ 9)
    (exports grouped-kept grouped-selected)

These are real multi-pair BindGroups. Typed pairs are scalar typed bind grammar;
untyped destructuring stays ordinary Bind-pattern grammar, not Func parameters.
The inline group must declare groupedNumber:number and groupedText:string;
the inline grouped leaf must be unknown; the named group must declare
groupedKept:number and groupedSelected:unknown while omitting groupedHidden,
groupedNestedHidden and `_`.
Source hyphens distinguish selection before normalization. Include their real
values in the runtime output and exact namespace keys, generated declaration
checks and actual strict TypeScript namespace/value client. Preserve all old
scalar/pattern/zero-name/stale-sidecar/raw-veto/schema cases. A renderer producing
no BindGroup declarations or ignoring the named selection must fail these controls.

## R02 — recursively nested input types/defaults

Extend declaration_source and its existing CLI/TypeScript/runtime consumer.
One admitted Source specimen can exercise Object→Array→Object recursion,
optional property `_`, default-before-required tuple slot and typed rest:

    (func nested-input
      :args ((object (alias :array items
        (array (object (default :number _ 7) :string label)
          (default :boolean _ true) :number total (rest :string tail)))))
      :returns :array
      :body #a(_ label total tail))

Add nested-input to actual exports. Recommended TypeScript input type is:
`{ items: [{ _?: number | undefined; label: string }, boolean | undefined,
number, ...string[]] }`. Keep every actual level/position; no unknown/any
substitution for the nested shapes. With the current owned strict/exact/
skipLibCheck:false checker, call with
`{items:[{label:"ok", _:undefined},undefined,5,"kept"]}` and with a provided
boolean/number/named field. Add single-line expect-error negatives for a nested
wrong `_` value, missing required label and wrong rest element type. These are
actual generated DTS inputs, not handwritten replacement declarations.

Under foreign global `_`99, the first runtime call must yield
`[99,"ok",5,["kept"]]`; a provided opposing value case such as
`{items:[{label:"second", _:3},false,6]}` yields `[99,"second",6,[]]`.
Thus nested defaults/discards do not capture `_`, ordinary nested bindings work,
and named leaves survive. The `items` alias is a PROPERTY KEY mapped to the
nested pattern, not an additional local binding. Observe each original caller
object's items.length before/after calling (4/4 and3/3) in the existing runtime
consumer; do not read an unbound items identifier in the Lykn function body.
Reuse existing checked/stripped and
package declaration-equality consumers where they share declaration_source;
do not duplicate an entire test protocol. The current known required-after-
destructure CLI prevalidation finding is unrelated and stays open. This sketch
has one parameter-list shape and avoids that unsupported source spelling.

Private fixture names are local discretion. Preserve types, roles, opposing
values, actual recursive producer and diagnostic checks; challenge any real
source-contract mismatch before more fixture permutations. No keyword carveout
or validator repair belongs here.

## Gates, commit and handback

Run rustfmt/check before expensive full gates and confirm only the single test
file changes. Refresh staged artifacts before dependent consumers. Focused
`cargo test -p lykn-cli --test discard_declarations -- --nocapture` must execute
all four groups with actual new TS/runtime/group cases. Then one final make
check/docs once, current actual M670/all14 command/config/status/comparisons,
and complete raw streams. The native32 selector is unchanged; fresh full check
covers it, no extra run required solely because it shares a file with old proof.
Keep actual profile/cache/warning/download/skip/tracing distinctions.

Commit ONLY the one named test with adjacent Codex/Billo AI trailers using
git commit --only. No amend. Then final-HEAD cited paths and fresh81920 size
gate. Append exact pin/results/limits/inventory and ALL8 row proposals to the
canonical closing report. Root owns planning Git/index/rows; return clean/no
jobs for the same independent Sol review before any acceptance. All prior
failed attempts/prompts/918 HOLD remain visible.

All helper/script/orchestration/validator/evidence-processing/JSON/command logic
must be Lykn, never Python/Ruby/Fennel/handwritten JS/Node or substitutes.
**No Python execution or parity exception.** Named Rust product tests/static TS
and runtime product fixtures are this deliverable; native shell/Git only direct
invocation/simple filesystem lifecycle. No S05, merge/push/remote/publication,
new dependency/licence or broader API/qualified/library work.
