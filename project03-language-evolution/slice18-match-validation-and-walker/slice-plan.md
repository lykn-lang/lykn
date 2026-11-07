# Slice18 — match validation repair and unchanged walker re-entry

**Closed2026-11-07 at independently reproduced NE-C11.** Candidate4304 task-only/
unaccepted; MVone done/five deferred. Actual same740-byte positive compile0 then
DenoSyntaxError42:29/runtime1; no source acceptance/fullMake/citation/tool re-entry/
K execution. All13unrun. Outer2spent/3remaining, oldtooling3spent/2remaining unchanged,
no cap reset or current next unit. Source-only fn/yields candidate concern stays
NE-C10 acceptance follow-up. All earlier active wording below is historical.

Current assignment iteration02,2026-11-07, outer refinement2/5, fresh LunaHigh CC
because recurring fixture/capture errors; prior CC relinquished all writes. Tooling
3spent/tworemaining unchanged. Uncommitted candidate47c516 full body preserved,
not HEAD68b production: units6/6/fmt0, CLI private-DTS oracle fails before runtime.
Consolidated review requires generator metadata/body policies, keyword literal
tail preservation and exact source-backed type sidecar oracle. No full source
acceptance/tool edit/K runtime. Suppressed archival cp created stray stdout;
SHA390b2f… bytes preserved/relocated, initial no-file claim corrected and violation
retained in iteration02. Earlier active entries below are historical.

Raw-log whitespace exception: prep23197ab's staged diff check reported trailing
blank lines at EOF in the three verbatim Rust stdout receipts, then the multiline
shell continued to commit. Do not claim that aggregate check passed. Raw bytes
are preserved unchanged; prose/prompt diff is checked separately before handoff.
This metadata handling does not weaken any source/runtime validation gate.

Current assignment iteration01,2026-11-07, source refinement1/outer5; tooling
3spent/tworemaining unchanged. Initial test0117102 baseline has meaningful NE-C10
red plus wrong malformed-clause oracle. CC grammar correction3175e4f and unit
rerun preceded formal directive under CDC informal instruction; preserve actual
timing, no retroactive conformance. Positive guard should-run would contradict
Box/false fixed42 oracle (runtime unrun); test-only guardtrue correction and actual
literal/binding prefix cases frozen before corrected baseline. Production unchanged.

Opened2026-11-07, standalone collapsed Project03 increment. Operator explicitly:
“Let's fix NE-C10, validate it independently, then complete the Lykn tooling and
resume the same K01–K12 gate. Same models, Autonomous Mode, and stop if we hit
another real evidence gap :-D”. Endpoint independently accepted bounded repair
and completed original13-row capability gate, or first other real gap. No release
integration/propagation/push/publication/remoteCI/globalinstall/deps/library/full
corpus/F6/nextunit. NE-D02/NE-T02 remain separate source-only follow-ups.

CDC `/root/cdc` Sol6.1 High owns source-ready design/planning/independent review;
fresh fork-none Luna6 High CC executes source/raw only, root read-only transport.
Sequential file/index ownership. Planning91c004 clean; source/task/release5408
tree39bc56b73897e568ff81ce60a2feef28a2310ea8 clean before opening. Reuse physical
task checkout /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering;
CC creates NEW nondefault branch `codex/match-validation-context` from exact5408,
preserving codex/async-expression-values and every old ref. Release stays read-only.

Budget: at most five substantive refinement cycles across this increment, no
stage reset. Within that outer bound, tooling inherits Slice17's THREE spent
corrections and only TWO remaining; source prerequisite/unit change does not
reset it. Record actual source/tooling track usage at every follow-up. At either
applicable cap unresolved substantive work returns to Operator. Ordinary normal
test-driven initial implementation is not permission for repeated hidden fixes;
returned failures get preserved numbered directives. Stop at another real gap,
not at expected NE-C10 baseline red. No workaround/new unrelated compiler repair.

## Stage A — narrow Rust validation repair

Actual source5408 classifier/forms.rs370–487 no-else validator recognizes cond/
switch but not match, traversing raw literal-headed clauses as Value. Existing
classify_match1871–1918 supports optional `:when` at item1, guard item2, body from3
or1; pattern is syntax. Emitter2234–2237 emits statement-match body sequences;
value-match2322–2355 emits prefixes as statements and returns its final emitted
form. Guide00 match471–524 and if849–854 establish statements versus values.
Do NOT universally label all match body forms Statement: that could admit invalid
no-else result tails. Initial unqualified all-Statement recipe was refined BEFORE
dispatch; no test or production change consumed it.

Binding design: add private `walk_match_args(args: &[SExpr], position: ExprPosition,
out: &mut Vec<Diagnostic>)`, called ONLY from real `as_form_head()==match` branch.
Subject and optional guard Value; skip pattern metadata; body prefixes Statement;
last raw clause body form Value when parent match is Value, otherwise Statement.
Parent position must itself reflect actual consumption: current validator marks
ALL func/fn bodies and do children Statement, unlike emitter663–686/1557–1582/
3136–3161. Align sequence-tail roles in this SAME validator: function/fn prefixes
Statement, nonvoid/default/fn tail expression Value, explicit void body allStatement;
preserve emitter's statement-only tail exclusion and special if-with-else value
case. Value do prefixesStatement/finalValue, Statement do allStatement. Value if
branches inheritValue, Statement if branchesStatement. This prevents newly admitting
consumed matches under func/fn/do/if. No emitter refactor/sharedAST or unrelated
validation work. Small private tail predicate mirrors actual emitter statement-
head/ifelse rule using as_form_head; comment the source and protect existing no-else
statement tails. Do not blindly mark every function tail Value. Existing function
metadata scanner may collect borrowed body references/returns-void before walking;
preserve pre/post Value and actual classifier clause-key handling.
Use borrowed slices/get/first and checked lengths matching classify_match, retain
grammar ownership/diagnostics for malformed clauses, no panic/index unchecked.
No changes to resolution, emitter, JS compiler/mirror, existing validators or
typed-AST architecture. A bound/computed callee named match remains ordinary Value
arguments via existing as_form_head distinction. Preserve spans/source diagnostics.

Allowed source changes ONLY classifier/forms.rs (helper + meaningful unit tests)
and new crates/lykn-cli/tests/match_clause_validation.rs. Reuse existing unit
no_else_if_errs/read and CLI regression patterns in compile_validation_parity.rs
and async_exports.rs; std/tempfile/Command already available, no dependencies.
Tests freeze/commit BEFORE baseline execution; production unchanged for red.

Finite unit conditions: literal/wildcard/binding/ADT or object-pattern arm body
prefix statement-if accepted; consumed match prefix-if followed by scalar accepted;
unconsumed statement arm tail-if accepted. Negatives retain one real diagnostic
for no-else subject, guard, call argument, bind initializer, explicit return value,
and **consumed match final-tail if**. Patterns are not executable values; malformed
clauses remain classifier errors, no validation panic. No broad new matrix.
Cover the same consumed-tail negative through direct bind, nonvoid/default func,
fn, consumed do and consumed if branch; positive prefixes through these roles
keep scalar tails. These protect the same repair, not K controls. Existing final
no-else statement if in function body stays accepted. Source-only inspect bound
match dispatch; no novel runtime family.

One native CLI integration test uses normal strict `check`, stdout compile and
`compile -o`, observes actual bytes/diagnostics BEFORE assertions, compares JS
routes, then runs the generated module with exact Deno/offline/no-permission flags.
Positive source spine: typed `collect(kind:string,ready:boolean):array`, events cell;
bind answer to consumed match Box arm optional prefix push, tail push, final42;
fallback push/final0; a later unconsumed match Box arm has no-else optional
statement push; final array contains answer and expressed events.
Calls Box/true,Box/false,Other/true emit exact JSON+LF:
`[[42,["prefix","tail","statement"]],[42,["tail"]],[0,["fallback"]]]`.
Use proven cell/swap!/conj/fn/implicit-final-value forms. Unit negatives and CLI
check/stdout/-o negative consumed-tail source must reject with no JS/DTS writes.
Do not create JS research drivers or relax assertions. Valid DTS output is observed,
not a new universal async/type promise. Freeze literal complete fixture and oracle
before any execution; preserve every failed source body/output.

Red baseline then narrow implementation/green focused tests, full generated module
inspection and full normal UNFILTERED `make check` plus committed citation gate.
Focused Cargo --offline --locked allowed; full Make normal metadata/resolution env,
no CARGO_NET_OFFLINE/CARGO_TARGET_DIR or PATH/test filters. Existing legacy npm-pack
validation remains honestly part of full Make; no new Node/npm dependency. Owned
npm_config_cache/fresh XDG under task ignored target/slice18, fixed accepted DENO_DIR;
no HOME changes or cache purge. Actual cwd Rust toolchain is authoritative. Full
checks may need normal existing tool permissions; never bypass/skip/suppress.
CC returns indices, CDC reviews exact diff/red/green/raw/generated bodies and
freshly repeats focused/full required gates. Pin NEW actual absolute task release
compiler and bin copy hashes BEFORE any tooling re-entry. Accepted source only on
task; release5408/CLI85 remain historical baseline and untouched.

## Stage B/C — existing tooling and13-row gate, held until Stage A acceptance

Preserved follow-up assignment required, not this initial CC scope. Re-enter exact
Slice17bd3 walker SHA6976a853a9fea81bcf47e47d634fa5bcd568e9f3b72e6f36c4f58be2bd48d1c6
FIRST with new accepted compiler; no helper/oracle mutation to bypass NE-C10.
Use this slice artifacts/tooling as new work home copied from exact old freeze;
old Slice17 files/receipts/issued prompts stay unchanged. Accepted Slice11 full
audit-contract (finala9ccd823), Slice17 full plan/predicates remain binding.
Finish partial scanner/walker/observer obligations EW-R1–R5 with only two remaining
tooling corrections; unchanged parser-core6ca1afe and full controls0f20dba47.
All source/check/fmt/lint/strictcompile/complete generated review/DenoCheck AND real
zeroarg guards precede runtime. No full corpus/producer implementation or pilot.

Same13 rows: K11 first then K01–K09/K10a/K10b/K12,12families, K12synthetic not file/
parser count. K06nine reasons per full oracle. Exact positive/numerical path/loc/
range, deferred exclusions, status partitions/negative nonzero/potential versus
observed evidence remain binding; no totals-only observer or incomplete walker.
Exact cached unmodified npm-distributed Acorn8.17.0 local ESM SHA
1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7,
path /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs;
hash BEFORE dynamic import/version/after-use, no acquisition/vendor copy/general
npm-source waiver. Deno executable `/opt/homebrew/bin/deno`, version `2.9.6`, SHA
2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Strict no-config/no-npm/no-remote/cached-only/deny-net/no-prompt runtime; observer
only exactDenochild, child no subprocess, exact file/module/parser/manifest/OWNINPUT
read grants, K10a exact missing grant vs K10b existing denied, no root grants.
True config-free/private/tmp cwd and source copies, direct narrow ancestor config
entries; absolute executable/inputs/precreated receipts; verify actual frozen input
HASH BEFORE check, never count empty-extraction0. Raw bytes/exits before assertions,
fresh owned caches/roots; CDC repeats fixed conditions independently after return.

## Provenance, policy and endpoint

No Python execution/authorship for helpers/scripts/orchestration/validators/
evidence/JSON/command construction, NO exception. No Ruby/Fennel/handwritten research
JS/Node/jq/substitute scripting/shell-logic helpers. All authored researchlogic
Lykn; native direct CLI/simple filesystem allowed; authorized product Rust tests
are not research harnesses. No hook bypass/no-verify/force/skip/suppression/broader
permissions/generated patches/history rewrite/blanket staging. Exact path commits,
actual newline -F messages and contiguous Codex/BilloAI trailers/rawbody/status.
Inspect hooks/CI effects before mutation; no hosted trigger authorized.

Capture actual complete body before edit/check and freeze before execution. Retain
all Slice17 setup/authoring/CDC-emptyinput/capture violations without retroactive
cure; earlier EW deferrals remain historical. New source admission does not accept
partial tools. Original F1–F12/Project07 synthesis/lib/opt-in JSR/ADT/guide/book/
licence/bootstrap/human and other defect owners remain open. Canonical close/
review/retro/parent/backlog with done/deferred/unrun truth at endpoint only.

## Assignment history

| Prompt | Date | Reason | State |
| --- | --- | --- | --- |
| cc-prompt.md | 2026-11-07 | Explicit NE-C10 repair, independently gated before old tooling | Returned test/oracle failures; production initially unchanged |
| cc-prompt-iteration01.md | 2026-11-07 | Retain wrong grammar/guard fixtures, restore intended conditions, real literal clause positive | Refinement1 returned candidate47/DTS oracle failure; old CC retired after suppression violation |
| cc-prompt-iteration02.md | 2026-11-07 | Preserve generator/keyword roles, precise DTS oracle, fresh CC | Refinement2 returned4304/new runtime gap NE-C11; closed stop, no source acceptance |
