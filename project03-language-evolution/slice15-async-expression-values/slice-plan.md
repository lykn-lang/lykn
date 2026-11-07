# Slice15 — async expression values and bounded parser re-entry

Opened2026-11-06; open, collapsed standalone increment. Operator “let’s dive
into C09!” accepts NE-C09 repair → independent validation → unchanged four
parser observations, same Sol6.1 High CDC/Luna6 High CC Autonomous Mode and
another-real-gap stop. Endpoint only this increment. No release integration,
walker/corpus/F6/library/push/publication/global install/dependency/remote CI.

Current assignment iteration01: consolidated fixture correction2/5 before
production. Original freeze61a7e3e/oracle5dc2e0d and baseline9133b90 preserved;
const expected-Value harness fix5b11f49 was correction1. E2 malformed source,
E1 stdout prefix and E2/E4 weak discriminators are authoring findings, not new
language gaps. Correction restores promised cases and async value-throw coverage
within the same five fixtures, freezes updated predictions before rerun.

## Roles, homes and history

CDC /root/cdc gpt-6.1-sol High independently reviews fresh fork-none
gpt-6-luna High CC. Root read-only transport. Initial CC owns only assigned
source/index + this slice artifacts/repair/** raw evidence; CDC owns all planning
prose/ledgers/prompts. Return all indices before CDC reproduction. Later parser
work requires preserved continuation after independent repair acceptance.
Max5 preserved correction passes across the unit; no reset at stage transitions.

Planning starts c3a0a54b0ae095207236009c2f2b4bb2bf8bbdea. Reused task checkout
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering is NEW
codex/async-expression-values from3b65d09a1a8997f8c9680a34f43fd2c2e0aa8c4e.
Old compile-route-validation3b65d09, async-export-binding2bf7a109 and template
bc83 refs preserved. Release0.6 f705655 read-only. Existing accepted task
compiler absolute target/release/lykn SHA748cd9991003da42b9a07950005d21e46b6a295b9d8650c71c4fca3e69cf2e5c;
Deno /opt/homebrew/bin/deno2.9.6 SHA2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Re-pin actual built binaries before each runtime; no bare/stale global tools.
Local commits have no automatic remote CI effect. No external action authorized.

Preserve every actual body before edits/checks: immutable named commit/path/hash
can cover repeated unchanged checks. Commit intended fixture/prediction freeze
BEFORE red runtime, then fix freeze before green. Preserve raw compiler output,
generated JS/DTS or absence BEFORE assertions/temporary-drop, argv/cwd/env/exits.
No retrospective “fixed” label for old failures or process compliance.

## Contract and source-grounded diagnosis

Full witness: Slice14 artifacts/stage-c/tooling/parser-core.lykn at13fd27f,
SHA6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7;
generated artifacts/cdc-stage-c/parser-core.js SHA3e5b22d1d959b68e244c1ea3cf11ad6aaec29a8b81a5e6e6c7faa166ef44fefb.
Native check/strict compile0, Deno check0 insufficient, SAME-module load1
SyntaxError await26:24 before evaluation; no Acorn import, parser0/4. Inner
version/ready object return loss and observer nested-if malformed output are
static witnesses, not established runtime value behavior. Establish runtime
value/countercontrols before claiming correction. NE-C02 statement-bind witness
is related by position concern, not proven same cause or authorized expansion.

Guide00 do804–825 guarantees final value/expression IIFE; if834–860 promises
expression equivalence, despite strong LLM preference for ?. SKILL Async MUST
and guide07 ID11 permit awaited operations in async functions. No helper rewrite
to ?/alternate form, raw generated patch or compiler-printer string substitution.

Native source3b65: emitter/forms.rs emit_expr recurses kernel child Value profiles,
but equality/logical surface helpers inherit context. Function bodies emit every
child Statement before convert_to_expression; if conversion sees statement Do
block, emit_if_iife leaves block un-returnwrapped and always creates sync arrow.
emit_do value arrow is also always sync and propagates one context to all children.
contains_await honors resolution but descends nested function bodies; existing
thread/match consumers are NOT to be globally changed. wrap_iife_async already
exists, but plain await(asyncIIFE) would assimilate a Promise-valued final result.
Parallel packages/lang/compiler.js do handler and buildIfIIFE also emit async:false.
JS block/value APIs already use expression position; no expander rewrite needed.

## Recommended bounded lowering design (binding behavioral invariants)

1. Add private value-context/sequence helpers, save/restore EmitterContext.
   Value consumers receive Value; sequence prefixes Statement, final Value/Tail
   only when the result is used. Apply to do value bodies, if condition/branches,
   func single/multi non-void and fn/lambda final expressions, and equality/
   inequality/logical operand helpers (observer witness). Resolved-bound and
   computed-call fallback callee/arguments are also Value, not inherited Statement;
   preserve resolution tags/list shape and cover that site with a focused unit.
   Void and statement
   bodies remain Statement. Preserve current type/post/return handling and no-else
   diagnostics. No broad generator/yield/class/binding or native printer rewrite.
2. Lower branches as values BEFORE if wrapper selection. Pure values remain
   ternary, including selected-branch Do IIFEs. Keep await inside the selected
   branch, not unconditionally around the whole if. If statement branches still
   require IIFEs and await is involved, use branch-local value wrappers; zero-
   await existing synchronous wrapper shapes may remain. Do not make a sync path
   return a Promise or suspend merely due to an untaken await branch.
3. Add NE-C09-local structural current-scope await detection on lowered kernel
   SExprs: as_form_head semantics, await/for-await-of recognized, stop at nested
   function/function*/=> bodies (async wrappers defer their function contents).
   Literal strings/data and bound await calls are not operators. Leave the
   existing global contains_await/wrap consumers unchanged. JS counterpart scans
   ESTree AwaitExpression/awaited ForOf, stopping Function/Arrow nodes; no source
   substring grep or parser dependency.
4. For a synthetic value IIFE requiring await, use a PRIVATE value box to avoid
   implicit Promise assimilation: conceptually `(await (async()=>{ ...;
   return [value]; })())[0]`. Box returns belonging to this synthetic scope ONLY,
   never nested function returns; ensure fallthrough yields boxed undefined,
   propagate throws. Unwrap after await. This preserves Promise identity when an
   explicit earlier await precedes a Promise-valued tail. No new runtime import;
   ordinary internal array/AST representation is sufficient. No universal host-
   mutation or exact-microtask theorem is claimed: finite observable controls
   below establish selected paths/order and synchronous/Promise distinction.
5. Mirror necessary JS compiler changes byte-identically into embedded source;
   preserve public sync behavior. Fresh XDG materialization + fixed existing
   DENO_DIR must prove used mirror bytes (NE-C04 same-version cache remains open).

Native representation clarification2026-11-06: codegen emit_await614 currently
does not apply parent precedence; use a private synchronous scalar-unwrapper
arrow applied to the awaited box, conceptually `(box=>box[0])(await boxCall)`,
rather than relying on direct get(await…,0). This fits the existing computed-
callee/call-argument writer API, preserves the approved boxed final value and
needs no printer change. JS may use its equivalent ESTree member representation.
The static backend constraint is not a reproduced public await-member gap;
no additional fixture or helper rewrite is authorized by this clarification.

Private names/local mechanics discretionary. Consequential alternatives need
source-grounded explanation before broadening. This is not a new typed-AST
architecture. No new public API/namespace, dependency, async-all policy or change
to helper/control/oracle data. If the inspected code makes this recipe unsound,
challenge it before dependent edits; do not silently select language semantics.

## Finite proof — five shared product fixtures

New test/fixtures/async-expression-values/{E1-sync-values,E2-async-branches,
E3-promise-value,E4-deferred-function,E5-effects-errors}.lykn. Freeze exact bodies
and expected JSON/trace values before baseline; no sixth fixture family.

| Fixture | Source shape and expected discriminator |
| --- | --- |
| E1 | sync func if/do with scoped binds, both outcomes41/42; typeof returned number, no Promise. Typed return/post case and nested `(= 7 (if true 7 8))` true. Statement no-else if in Do prefix remains legal. |
| E2 | async both-sided awaited branch results42/7. Separate choose flag true sync path vs false awaited path: trace true `[sync,after-branch,after-call]`, false `[await,after-call,after-branch]`; no untaken effects or extra suspension of sync path. |
| E3 | inside async observe, original=Promise.resolve9; result=do(await Promise.resolve0, original). Before leaving observe, `result===original` true, typeof result.then=function, await result9. Catches unboxed async transport. |
| E4 | sync Do returns deferred async fn containing await, not invoked during construction. Immediate typeof callback=function; awaiting later invocation9. Also inline Rust tagged/bound await scanner countercontrol; no invalid reserved-name source binding. |
| E5 | selected throws and awaited rejection preserve actual Error message/selected effect order, untaken branch no effects, scoped local does not overwrite outer binding. Source catch/implicit finals, no unrelated explicit typed-return or bare branch-bind forms. |

Use existing Lykn cell/conj/express and typed functions, foreign:any boundaries.
Functions log JSON only; all fixtures self-contained, no network/file/global
permission required. Trace is finite observable sequencing, not a universal
scheduler specification. Define exact E5 JSON/messages in the pre-runtime freeze
from these contracts; don't infer expected values from a run.

Rust CLI integration uses CARGO_BIN_EXE_lykn, tempfile, serde_json (existing deps),
actual default strict compile/output/module load and awaited JSON. Loop all five
despite per-fixture failure and retain complete source/generated outputs before
assertions. Product JS regression uses existing public packages/lang/mod.js lykn
and the SAME five sources, generated temporary modules executed by pinned Deno;
use existing template-string-boundary product-test pattern, no research JS driver
or coherence normalizer expansion. Direct both-backend values/side-effects, not
only generated strings or DenoCheck0. Retain actual red counts, including syntax
vs wrong-value failures and positives that already pass. Existing complete core
is an additional retained module-load witness, not a sixth stimulus family.

Allowlisted source: crates/lykn-lang/src/emitter/forms.rs (fix + focused units);
packages/lang/compiler.js and crates/lykn-lang/embedded/packages/lang/compiler.js;
new crates/lykn-cli/tests/async_expression_values.rs;
new test/forms/async-expression-values.test.js; the five fixture files above.
No context.rs/classifier/binding/resolver/expander/codegen printer/helpers normalizer
or other product path unless a separately recorded source-grounded amendment.

## Gates and endpoint

Freeze tests first; meaningful baseline red with exact absolute/pinned old CLI
and public JS path before production edits. Focused Cargo --offline --locked,
build --no-run and pin actual CLI before runtime; actual source-cwd toolchain
Rust/Cargo1.97.0. Test selectors must name main binary/integration target correctly,
no zero-selected pass. Pin exact new release binary after fix, inspect complete
generated modules and SAME old core load (not DenoCheck-only), all values/trace
controls, public JS/mirror and fresh materialization. Then full unfiltered normal
make check/citations, normal metadata env (unset CARGO_NET_OFFLINE/CARGO_TARGET_DIR),
fresh owned npm/XDG + fixed existing DENO_DIR. Legacy npm compatibility tests stay;
no installers/toolchain/dependency updates or PATH filtering. CDC independently
reviews exact code/test/mirror/generated evidence and repeats focused/full gates.

Only after independent repair acceptance issue preserved continuation for same
formatted three Slice14 helpers13fd27f, original controls/predictions unchanged,
ordered K11/K01/K08/K09 with exact Acorn local ESM SHA1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7,
Deno2.9.6, true config-free /private/tmp cwd and actual NEW compiler. Inspect whole
generated JS and genuine module-validity proof before four observations; Deno
check0 alone is not enough. Same hash-before-import/offline/exact grants/raw-before-
assertions/child no subprocess/observer exactDeno, no acquisition/vendor copy.
First unrelated known/open or new real blocker stops; NE-C09 baseline expected.
Normal author errors preserved under max5; no alternative shape to evade a gap.

NO Python whatsoever, NO migration exception, including literal replacement.
No Ruby/Fennel/handwritten research JS/Node/jq/shell-logic substitution. Authored
research logic Lykn; native direct CLI/simple lifecycle/raw capture and authorized
product Rust/JS edits/tests only. No force/skip/suppression/broader permissions,
hook override/no-verify/generated patch/amend/rebase. Normal explicit paths,
stage new named files first, actual-newline -F commits with contiguous Codex and
BilloAI trailers; inspect rawbody/status. Offending Slice14 CC is not reused.

Reuse unchanged framework3.0.1, PM required opening/iteration/closing guides,
work-verification2.8, testing/scientific controls/evidence and Rust2.0 AP-02/EH-08
readings; current JS-Deno1.0 and Lykn async/if/do source contracts apply. Keep
required manifest bounded; no huge historical rereads or new reporting schema.
Close review/rows/report/parent/backlog/CDC retrospective at endpoint, preserve
NE-C02/05/NE-T01 and every prior failure/violation/uncaptured receipt. Original
F1–F12 and Project07 finalresearch/licence/bootstrap/lib/ADT/guide/book/human gates
remain open. No automatic next unit or integration follows.

## Draft review correction3

The complete unaccepted production draft is preserved at source45fc835c2bcf0c4a713a49a9910bb3458feed4e9.
Implementation01 reported greens preceded its freeze and a later JS/unit edit;
they are historical draft observations, not acceptance of this committed body.
The exact pre-green implementation body is not established by a retained snapshot.
Correction3/5 addresses the new current-scope scanner's class-member namespace
regression and restores the assigned compiled-ESTree JS detector. It adds a
private source-role countercontrol, retains all five shared cases/oracles, and
requires a committed final body before fresh gates. See preserved
[correction3 prompt](cc-prompt-iteration02.md). Two corrections remain afterward;
no parser re-entry before independent repair acceptance.

## Frozen green review and correction4

Source0fe6663c49f35608927832cfc7b8bf09cf50551d was frozen before genuine native5/5,
public-JS5/5 and four private-unit greens. Correction03 retains its source/tool
pins, meaningful class/carrier reds, weak initial class unit and WIP chronology.
Full gates were held for the remaining native statement-role inconsistency:
documented for-await-of was omitted from statement classification. Preserved
[correction4](cc-prompt-iteration03.md) requires a private meaningful tail red,
that bounded alignment and the original lowered-kernel detector callsites before
fresh native/full gates. No shared fixture/oracle or JS body changes. One correction
remains after4/5; no reset. Existing unchanged JS proof stays attributed to0fe.

## Last fixture correction5

The normal full Make on546 stopped at the newly authored E5 intentional enclosing
shadow warning, after deps/citations/build/clippy/format/syntax passed. It is an
authored fixture/lint conflict, not a demonstrated new compiler gap. Complete
shadow-source/native/public outcomes, including independent CDC replays, stay
preserved and applicable to identical production blobs. The final
[correction5](cc-prompt-iteration04.md) replaces that current-tree condition with
two same-name local bindings in sibling Do scopes, preserving exact output JSON
and all other cases. It tests sibling isolation, not enclosing shadowing. No
suppression, exclusion, lint/product change or historical proof substitution.
Fresh same-five/full gates follow the fixture freeze. Five-correction budget is
then exhausted; no reset or further substantive correction loop.

## Pending Operator decision at exhausted budget

After correction5, full Make passes lint but the unchanged pre-existing grouped-
bind function-body scope unit fails (1122passed/1failed). CDC independently repeats
that EXACT unit: exit101, block where sibling const was required. Candidate802
and production546 remain UNACCEPTED; same-core/five-case successes do not override
this regression. [Independent pending verdict and concrete proposal](cdc-verification.md)
identifies new emit_function_body bypassing the old Statement out.extend path.
All affected execution is paused at5/5, parser0/4. No sixth pass, re-slice, code
change, full gate or parser continuation is authorized by this record. Proposed
one extra correction restores existing statement expansion while retaining new
value tails, with exact unit/same-five/full normal gates and independent review;
an explicit Operator re-scope/override decision is required. No formal close yet.

## Explicit Operator override: one extra cycle

Operator selected **Authorize one extra cycle (Recommended)** to the exact question: “Do you
authorize one extra bounded correction beyond the framework’s five-pass cap:
a fresh Luna 6 High CC restores grouped-binding scope, Sol 6.1 High independently
validates it, then the same four parser observations run only if the source gate
is green?” This records approval BEFORE execution. The prior pause/verdict remains
history; correction6 TOTAL is authorized once, with a fresh Luna High context,
not a budget reset or source acceptance. [Issued assignment](cc-prompt-iteration05.md)
allows only forms.rs statement-body expansion restoration, unchanged tests and
normal full/independent gates. No seventh substantive pass or implicit integration.
Any unresolved substantive failure returns to Operator; same-four re-entry still
requires independent source acceptance and stops at another real blocker.

## Correction6 return: full gate fails, pending further Operator decision

Final clean source3f8f6dfe6177db7233932dc6c8938993655a1cae restores the existing
grouped-bind unit and preserves finite5native/5public/core-load successes. After
one retained mechanical rustfmt correction, normal full Make passes all Rust but
fails two existing DD50 switch-case coherence tests:1466passed/2failed(11steps),
actual exit2. CDC independently reproduces both exact failures. The new forced-
Value generic recursion treats structural switch clauses as ordinary calls;
[current review/proposed bounded next scope](cdc-verification.md) records evidence.
One extra correction6 is spent; no seventh pass or budget reset is authorized.
Source remains unaccepted, docs/independent full Make unrun, parser0/4. All
affected execution pauses for Operator disposition; no formal close or next unit.

## Explicit second override: correction7 total

Operator answered **“yes, authorised!”** to ONE further bounded role-aware
switch-clause correction, full validation plus Sol6.1 High independent review
with CC Luna6 High, then the unchanged four parser observations ONLY after source
acceptance. This authorization is recorded before execution. Correction7 total
is allowed once, not a reset/eighth substantive correction. Previous rejection,
failed full gates and every provenance limit remain history. The preserved
[next assignment](cc-prompt-iteration06.md) permits only forms.rs kernel switch
role traversal and correction07 raw evidence, retaining tests/JS/oracles. A fresh
Luna High source/raw-only context is selected to avoid stale scope instructions;
CDC retains planning/review ownership. Source3f8/releasef705 and planning692b5d8
were revalidated clean. Endpoint remains independent source acceptance plus the
same four, or honest blocker; no integration, next unit or expanded audit.

## Source accepted; original conditional parser continuation active

CDC independently accepts source5408abd432b8789ae474a3895436f68818c4e482 TASK-ONLY:
normal full Make0/all Rust/JS1468(11steps)/docs482/citations63+601, exact regressions,
five runtime cases/full generated review and same-core strict load0. Canonical/
embedded/fresh XDG compiler.js match1c1e7e8; actual release compilerb0a56497.
Source clean, no integration. AV-01–04 done; AV-05–07 remain open, parser0/4.
[Parser continuation](cc-prompt-iteration07.md) executes the SAME three immutable
helpers and four oracles under the originally approved conditional authority.
It is not an eighth correction or budget reset; any substantive gap stops.

## Assignment history

All issue dates2026-11-06. Issued prompts remain unchanged; filenames identify
correspondence, not new iteration allowance. The initial const-storage correction1
was an author fix within the initial assignment without a separate prompt; this
historical discrepancy is preserved, not repaired by inventing a prompt.

| Assignment | Predecessor | Reason / count | Disposition |
| --- | --- | --- | --- |
| cc-prompt.md | none | Initial source repair; correction1 harness fix preserved | Superseded, failures retained |
| cc-prompt-iteration01.md | cc-prompt.md | Correct finite fixture discriminators, correction2 | Superseded, corrected baseline retained |
| cc-prompt-iteration02.md | iteration01 | Class/carrier/AST review, correction3 | Superseded, meaningful/weak controls retained |
| cc-prompt-iteration03.md | iteration02 | Async-loop statement role/lowered scan, correction4 | Superseded, focused greens/lint stop retained |
| cc-prompt-iteration04.md | iteration03 | Lint-clean sibling scope condition, correction5 | Rejected grouped-bind regression; pause retained |
| cc-prompt-iteration05.md | iteration04 | Explicit override1, grouped-bind correction6 | Group fix green, switch regression rejected |
| cc-prompt-iteration06.md | iteration05 | Explicit override2, role-aware switch correction7 | Source independently accepted5408 |
| cc-prompt-iteration07.md | iteration06 | Original conditional parser phase; count remains7 | Active; no parser runtime before source acceptance |
