# Slice08 — NE-C03 template string boundary

Status: open. Current assignment: `cc-prompt.md`, diagnosis phase only.
Collapsed standalone increment under Project03; no parallel Project07 home.

## Authority, outcome and gates

On2026-11-06 Operator approved merging the accepted predicate repair into
release/0.6.x “and then move on to NE-C03”. The local merge/full release gate
is complete at b841f71b30eb2c3e340a651ae1d57de04fec3d79; Slice07's integration
receipt preserves that separate authorization/history. Same approved Autonomous
roles: CDC Sol6.1 High plans/reviews, existing fresh CC Luna6 High implements;
root transports/reads. No model-selection question or budget reset.

Useful endpoint: resolve the source/template contract, repair a confirmed
implementation mismatch when semantics are unambiguous, validate independently,
then replay the unchanged five controls/eleven calls; or stop at a real semantic
choice/new evidence gap. Initial diagnosis is a necessary bounded part of that
approved work, not a separate open-ended inquiry. CDC limits it to the source
population and six programs/22 values below; this is an execution ceiling,
not a claim that Operator supplied that number. No extension without disposition.
Five refinement iterations maximum. Genuine language-design ambiguity goes to
Operator; CC cannot select new public behavior merely to make the pilot pass.

Phase A returns observations and a source-grounded recommendation for independent
CDC review. NO production patch, legacy-test change, observer change or pilot
replay before a preserved iteration resolves implementation and semantic scope.
No release/main edits, further merge/propagation, push/publication, dependency/
toolchain/backend acquisition, broad escaping audit or NE-C02 repair.

## Source and ownership

Task home remains `.worktrees/contract-predicate-lowering`, now NEW dedicated
branch `codex/template-string-boundary` at integrated release b841f71b. The old
`codex/contract-predicate-lowering@86d116d` ref is preserved; its accepted eb24ae3
binary was copied/hash-verified into task
`target/lykn/tools/lykn-86d116d/bin/lykn` before switching. Other source homes
are read-only. Planning starts from4385fb6, clean. No unused new worktree.

CC builds/pins the baseline native compiler offline/locked from this task path;
do not assume its hash equals the release build's e4b04426, since build paths
can matter. Lock is the release's unchanged672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce.
Generated outputs stay in ignored task `target/slice08/`; no new source code
is authorized in Phase A. CC owns only this slice's `artifacts/results.md`,
`closing-report.md`, ledger evidence/status-open, plan status/intake, and
`artifacts/diagnosis/run-01/` (six Lykn sources, actual JS/commands/raw receipts).
CDC owns prompts/parents/review/retrospective. Sequential index ownership.

## Contract evidence and inspection method

At b841f71b, source `docs/guides/01-core-idioms.md` ID-33 is MUST: the reader
cooks escapes before code generation and both compilers see the same string
value. Native lexer `read_string` and JS reader `readStringEscape` implement
that decoding. Guide17 Concat describes string literal segments/non-string
interpolations; Tagged says raw/cooked behavior comes from the post-expansion
JS literal, not original Lykn lexical source bytes.

Native `codegen/emit.rs::emit_template_text` passes backslashes through;
concat and `icu.rs::emit_mft` share it. JS `makeTemplateElement` sets raw after
backtick/$ escaping, cooked to its input; concat and emitMft share it. Inspect
these complete functions/callers and existing passthrough/convergence/tag tests.
The May16 f1f04a5 C6b history and D2 test are competing historical evidence,
NOT immutable Operator semantics. Do not invent an AST split solely to retain
those assertions; do not erase or update them before reconciling the contract.

The frozen observer624–629/generated362–364 and C5 source receipt in Slice07
`artifacts/evidence/cdc-stop/` are the actual failure witness. Child exit0/all
intended values vs outer oracle1 is not a failed library API. Preserve it.
Phase A inspects JS routing but does not invent a second JS execution route:
existing compileBoth proves structural convergence only, not runtime semantics.

## Finite discriminating observations

Author five tiny independent Lykn programs, one payload each. No braces/ICU
format syntax are used, so one-literal ICU and forced two-literal concat can
observe the same intended decoded value without an unrelated quoting rule.

| Program | Decoded payload (Unicode scalar decimal values, binding) | Purpose |
| --- | --- | --- |
| P1 | 92,110 (literal backslash+n) | Distinguish a decoded value from interpreting its escape again |
| P2 | 92,34 (literal backslash+quote) | Exact kind of inner-JSON quote loss in the frozen observer |
| P3 | 10 (decoded LF) | Retain an actual newline, not introduce literal slash+n |
| P4 | 13 (decoded CR) | Detect JS physical-template CR normalization separately |
| P5 | 92,96,36 (backslash+backtick+dollar) | Delimiter/backslash ordering and valid emitted syntax |

Each prints one JSON object with four string fields: plain binding,
interpolation of that binding, forced concat from the same literal plus empty
string, and ICU from the single literal. Thus20 intended value observations.
Representative shape (P1; source, not claimed executed):

```lykn
(bind value "\\n")
(console:log
  (JSON:stringify
    (obj :plain value :interpolated (template value)
      :concat (template "\\n" "") :icu (template "\\n"))))
```

Sixth program prints two observations using the already existing tag form:
`(tag String:raw (template <P1-literal> ""))` and single-literal ICU equivalent.
Record actual post-expansion raw values alongside the emitted literal; don't
assume raw must equal cooked or the original source spelling. Total6 programs/
22 values; compile/module failures leave affected values unestablished. Do not
count an exception/parse error as correct data. No broad variant family, fuzzing,
handwritten JS helper, eval/newFunction, installs or frozen pilot mutation.

First pin source/compiler/Deno, commit case sources and predictions BEFORE
runs. Build with cached `cargo build --offline --locked --release -p lykn-cli`.
Use fresh run dir and parent dirs; strict native CLI compile each absolute input
to owned JS, from isolated cwd/config. Run modules with Deno2.9.6
`run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt`;
no permission grants are needed. Save exact argv, source/JS bytes, exits,
stdout/stderr before interpretation. Preserve unique attempts; never overwrite.

Run existing native `codegen::emit::tests::test_template` focused tests (three
current direct-AST cases) offline/locked. Read bodies as well as actual output:
those assertions check emitted text from manually constructed String values,
not source/runtime value preservation. Report what they establish and conflict
with; no new Rust test/code change in this phase. Compare P1–P5 plain/interpolated
results with ID-33 values and the concat/ICU outputs, recording code points or
unambiguous JSON escapes. State observed, documented, inferred and unresolved
claims separately. A desired conclusion is not a passing criterion.

## Applied guidance and next implementation boundary

Rust borrowed-string guidance (AP-02/ID-39) favors existing `&str` printer API;
no new allocation framework/API is justified. JS ESM/Deno/no-eval/no-new-Node
rules keep probes in Lykn and real subprocess modules. Testing discipline
requires actual decoded values, LF and delimiter countercontrols, not merely
two compilers agreeing or old snapshots passing. Scientific-methods controls
hold source/tool/config fixed and preserve failed/unrun denominators.

Candidate only, not yet implementation authority: if evidence confirms ID-33
value loss, native printer and JS template raw representation likely need
encoding decoded backslashes before existing delimiter/$ escapes, plus correct
CR representation. Cooked values and tagged post-expansion raw consequences
must be specified first. No blanket slash replacement, reader change or
artificial surface/kernel encoding layer is preselected. Existing tests may
need explicit reconciliation, not preservation by fiat or silent deletion.

After independent diagnosis, CDC issues concrete affected-path/test instructions
or surfaces the genuine semantic choice. A confirmed repair must retain the
accepted predicate tests and pass focused runtime/kernel/JS evidence plus full
unfiltered make check with isolated npm cache; legacy npm checks remain included.
Only after independent acceptance can the exact frozen30e9793 five/eleven pilot
resume under a new pinned compiler condition, with C4-first inspection/stop.
All F-1–F-12, old failed/unrun conditions, Project07 synthesis/licence/bootstrap/
ADT/guide/book/human obligations and four recorded metadata failures survive.

## CDC author readiness — 2026-11-06

Current source/reader/printer/helper callers, guide ID-33, actual dispatch/tag
rules and three direct-AST tests were inspected before this assignment. The
six-program method distinguishes interpreted escapes, physical CR, syntax and
post-expansion raw text from emitted-text convergence. Existing dispatch table
and implementation select single-literal ICU; guide17's later “only” keyword
sentence is broader than that table and needs calibrated documentation handling,
not a changed diagnostic payload. Initial work is investigation with explicit
population/observations, not an unresolved implementation instruction. Repair
choices and any changed test expectations are held for an independent review
and preserved iteration; no guessed helper/API signature or new validator.

## CC Phase A receipt — 2026-11-06

CC committed the source-cited intake at planning `d920f31a177bdd15766b7399993ee68d9b0f90b4`,
then froze six programs/predictions and the task-local baseline at
`41fba58c8d0a99c851ae79093a82fd8c7990b7f6` before running cases. From task
source b841, locked/offline release build produced `lykn 0.6.0`, SHA-256
`e69f67f4cbc8cda4b9a3a82436bd3375f277d68c45387dae7ac7fc2a9ba32ae8`.
All six strict native compiles exited 0. Runtime exited 0 for P1/P2/P3/P4/P6;
P5 exited 1 because emitted JS was syntactically invalid, leaving four of 22
values unestablished. The three assigned direct-AST tests each exited 0 but
assert printer text only. Full command/raw receipts and generated JS are in
`artifacts/diagnosis/run-01/`; interpretation and the 22-row denominator are
in `artifacts/results.md`. This is CC evidence only: TE-01 remains open for CDC
independent review, and all repair/runtime/pilot criteria remain held/open.
