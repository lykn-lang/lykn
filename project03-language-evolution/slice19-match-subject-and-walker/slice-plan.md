# Slice19 — match subject repair and combined validation

Opened2026-11-07, canonical standalone Project03 continuation. Operator:
“Let's fix NE-C11, independently validate both repairs, then complete the Lykn
tooling and resume the same K01–K12 gate. Same models, Autonomous Mode, and stop
if we hit another real evidence gap :-D”. Endpoint both repairs independently
accepted then original tools/13-row capability gate, or first OTHER real gap.
No release integration/propagation/push/publication/remoteCI/newdeps/install/
globalinstall/library/fullcorpus/F6/nextunit. Known NE-C11/NE-C10 red is expected.

CDC `/root/cdc` Sol6.1 High designs/independently reviews; fresh fork-none Luna6
High CC implements source/raw only, root read-only. Explicit sequential index
ownership. Planning4d516284 clean; reusable task4304eb280a4198eb75355956b166923883ceecbe
on codex/match-validation-context clean/unaccepted. CC creates NEW nondefault
codex/match-subject-values at exact4304 in SAME physical task checkout
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering. Preserve old
refs, including async-expression-values5408. Release/0.6.x5408 stays read-only.

**Budget continuation, no reset:** outer2 refinements already spent in Slice18;
this initial StageA assignment is refinement3/5. After it, at most TWO outer
refinements remain. Tooling separately inherits Slice17's3spent/tworemaining;
source prerequisites/new unit do not restore it. Tool edits must consume remaining
outer allowance AND old tooling allowance. Unresolved substantive failures at
either cap require Operator decision, no hidden retries/re-slicing. Unexpected
substantive failures return before editing; first other real gap stops.

## Stage A — source-ready minimal changes

Baseline source4304 emitter/forms.rs::emit_match_statement2215+ creates its const
target initializer with emit_expr(target,ctx) while ctx is Statement. Existing
emit_in_context193–205 saves/sets/restores ExprContext. Change ONLY that target
initializer to emit_in_context(target,ExprContext::Value,ctx,registry). Clauses,
guards, pattern binding/order/once-only target evaluation, IIFE/value-match path,
async/other emitter policy remain unchanged. No architecture/typedAST refactor.

NE-C10 candidate concern is also authorized: classifier/forms.rs::walk_fn_like_args
recognizes :yields header for ordinary fn/lambda, although classify_fn/lambda keep
ALL args1+ as body; classify_genfn alone owns optional header. Restrict header
consumption to generator caller/policy (FunctionBodyPolicy::Statements currently
only genfn at this helper), preserve fn/lambda data keywords and Value checks.
No grammar expansion, global binding changes or unrelated validator work.

Allowed product paths ONLY emitter/forms.rs, classifier/forms.rs and existing
crates/lykn-cli/tests/match_clause_validation.rs (logging/retention only if needed).
No JS/compiler mirror changes indicated: existing canonical+embedded JS remain
byte-identical source; no JS new helper/backend. Rust guidance: borrowed SExpr,
existing context-save helper/private policy, no unchecked indexing/new panic,
clone-heavy wholeAST rewrite/dependencies or swallowed diagnostics.

Tests BEFORE fixes, complete actual Git commit+hash/status BEFORE each run:

- Emitter structural unit using existing SurfaceForm::Match/MatchClause, atom/list/
  num/ctx/reg helpers (existing tests3968+). Target `(if ready 1 2)`, statement
  context. Inspect actual emitted block[1] const binding[2] initializer: it MUST
  have `?` head, not `if`; assert caller context remains Statement afterward.
  Existing value-context match test plus SAME full positive preserve consumed path;
  no stringgrep-only proof/new runtime fixture.
- Two independently selected validator counters for fn and lambda: ordinary body
  starts literal `:yields`, next `(consume (if cond 1))`, final42. Example
  `(bind f (fn (:boolean cond) :yields (consume (if cond 1)) 42))`, lambda analog.
  Each must retain ONE no-else Value diagnostic. Actual classifier accepts these
  as body expressions; the erroneous header skip loses that check at4304.
- Positive genfn header counter uses real `:yields :number` and statement body
  `(if cond (yield 1))`: no diagnostic. Preserve existing generator preValue,
  bodyStatement, keyword-tail and all match consumed-tail negative regressions.
  These are finite private regression controls, not new K families.

Old SAME740-byte POSITIVE_SOURCE in committed CLI test stays byte-identical:
SHAceaaf162892e964a76f317558ad35cfcdf82bd6731fcebe0eabb21de2d953058.
No `?` replacement, different helper/fixture or guard tweak. Source style violation
remains history, language contract supports functional if. Expected JSON+LF:
`[[42,["prefix","tail","statement"]],[42,["tail"]],[0,["fallback"]]]`.
Exact DTS: `type Choice =\n  | { tag: "Box"; ready: boolean }\n  | { tag: "Other" };\n`.
Existing negative check/stdout/-o/no JS/DTS writes remain binding. Prior compile0/
Deno1/full readableJS111a1fae baseline in Slice18 cdc/nec11 is retained applicable
evidence; no need redundant old full runtime. New unit counter red on4304 before
fixes and new samepositive real runtime green after fixes establish repair.

Build/no-run ALL required lib/CLI test binaries first, commit actual complete input
source before execution, pin absolute debugCLI AND actual test executables/paths/
hashes after last Cargo build. Invoke built test executables directly for focused
red/green; no intervening Cargo rebuild replacing the pinned producer. Preserve
commands/cwd/env/stdout/stderr/exits/bodies before assertions/edits. Fmt writes are
mechanical only with saved oldbody/new commit BEFORE dependent run; no uncommitted
body-only freeze accepted. Full readable actual generatedJS/DTS needed alongside
raw logs; use existing native output/logging, no new extraction logic language.

After focused green +complete generated inspection, FULL NORMAL unfiltered
`make check` and committed citation gate, then ownership return for CDC exactdiff/
fresh focused/fullnormal gates/real JS+JSON/DTS acceptance of BOTH source repairs.
Focused Cargo --offline --locked allowed; fullMake no global CARGO_NET_OFFLINE/
CARGO_TARGET_DIR/PATH/test filters/hardeningflag overrides. Taskcwd Rust1.97,
Deno `/opt/homebrew/bin/deno` version2.9.6 SHA
2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Fresh owned npm_config_cache/XDG under ignored target/slice19, fixed existing
DENO_DIR=/Users/oubiwann/Library/Caches/deno. Legacy npm-pack tests are part of full
Make, not new dependency authorization. No HOME change/cache purge/installer.
Refresh actual release/bin/debug hashes AFTER fullMake and verify before+after
use; pre-Make pins are not claimed later producer identity. Release5408 CLI85 and
task old9b71/debug31f8release are baselines only, never silently selected as fixed.

## Stage B/C — held for independent combined source acceptance

Separate preserved follow-up then FIRST recheck exact old bd3 walker (SHA6976a853…)
unchanged with newly accepted actual compiler. Old Slice17/18 sources/history stay
unchanged; new work in this slice artifacts/tooling. Complete walker/scanner/
observer per accepted Slice11 FULL audit-contract/finala9ccd823 and Slice17 full
predicates, with only two remaining tooling corrections AND outer allowance.
Core6ca1afe/fullcontrols0f20dba47 unchanged. Native check/fmt/lint/strictcompile,
complete generated review/DenoCheck AND genuine zeroarg guards before any K run.
Source-ready completion prompt will adjudicate ordinary deferred items, including
Error.name prototype handling against actual Acorn construction, no new probe now.

Original13 frozen rows ONLY: K11 then K01–K09/K10a/K10b/K12,12families; K12synthetic
not file/parser count. Full K06nine/path/loc/range/status/partition/unknownfailclosed
and negative-nonzero semantics preserved, no totals-only observer. Exact cached
unmodified npm-distributed Acorn8.17.0 ESM SHA
1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7, no acquisition/
vendor copy/general npm-source waiver. Hash BEFORE import/version/after-use; source
inputs inert, not executed. Strict no-config/no-npm/no-remote/cached-only/deny-net/
no-prompt; exact own input/manifest/module/parser reads, K10a exact missing grant
versus K10b existing denied. Observer only exactDenochild, scannerchild no subprocess.
Raw bytes/exits before assertions; fresh owned roots/caches; CDC independent fresh
same13 replay. No source-generated identity inference/no broad root grants.

## Policy/history/endpoint

NO Python execution/authorship for helpers/scripts/orchestration/validators/
evidence/JSON/commandconstruction, no exception. No Ruby/Fennel/handwritten research
JS/Node/jq/substitute scripting/shelllogic. Researchlogic Lykn; authorized product
Rust/tests plus native directCLI/simpleFS allowed. No hookbypass/no-verify/force/
skip/suppression/2>/dev/null/||true/broader permissions/generatedpatch/historyrewrite/
blanketstaging. Prerequisite failure STOPS dependent command, no empty extraction.
Absolute tools/inputs/precreated receipt paths, true configfree/private/tmp cwd,
narrow exact ancestor config checks; hash frozen file BEFORE native invocation.
Normal exactpath Git commits real-newline -F/contiguous Codex+BilloAI trailers,
rawbody/status verification, inspect hooks/automatic CI effects first; no remote
trigger authorized. All prior snapshot/hand-off/style/suppression/pin limits remain,
not retroactively cured. Original F1–F12/Project07 synthesis/lib/package/publicAPI/
ADT/guide/book/licence/bootstrap/human/other defect duties remain open. Close
six rows/report/review/retro/parent/backlog honestly at endpoint only, no nextunit.

## Assignment history

| Prompt | Date | Assignment | State |
| --- | --- | --- | --- |
| cc-prompt.md | 2026-11-07 | Source continuation refinement3/5, NE-C11+NE-C10 concern | StageA only; no tooling/runtimeK before CDC combined acceptance |
