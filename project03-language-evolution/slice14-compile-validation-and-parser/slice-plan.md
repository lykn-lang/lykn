# Slice14: compile validation parity, async exports and four parser observations

Opened 2026-11-06. Status: open. Canonical collapsed standalone increment.
StageA NE-C08 independently accepted narrowly at source4610b4 (VP01–03 done),
known NE-C07/full green pending. Fresh StageB CC replaces the prior context after
its explicit Python-policy breach; see cdc-verification.md and incident receipt.
StageB NE-C07 and complete canonical independent validation now accepted at
source3b65d09, compiler748cd999 (VP04/05 done); StageC re-entry is current under
cc-prompt-iteration02.md. Earlier staged statements remain dated chronology.
Operator: “Let's fix NE-C08, validate it independently, then return to NE-C07
and the same four parser observations. Same models, Autonomous Mode, and stop
if we hit another real evidence gap :-D”. Endpoint is these staged repairs and
four observations, or the first genuinely NEW real gap. Known NE-C08/NE-C07
baseline failures are authorized prerequisites, not new stop conditions.

## Roles, identity and ownership

CDC /root/cdc: OpenAI gpt-6.1-sol High, independent review. Fresh CC:
OpenAI gpt-6-luna High, fork none, implementation. Root read-only transport.
Two contributors; no self-acceptance. Maximum five preserved correction
iterations across this unit; stage continuations do not reset that budget.
Only local exact-path commits; no external CI is triggered by local commits.
No release integration/propagation, push, publication or subsequent unit.

Planning `.worktrees/planning` branch planning starts
3dad8d48cfe95c4428dc5f2e9002782c426d222e. Task checkout
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering` reuses NEW
dedicated `codex/compile-route-validation` from test-only
2bf7a10929dc870acbd37709d5851cfd109f0082. Old async-export-binding ref and
template-string-boundary bc83 remain. Production baseline is release
f70565566088f5d55129edda6bd73a4691e5a58d; release remains read-only.
Baseline absolute release compiler SHA25657a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28.
Deno `/opt/homebrew/bin/deno` 2.9.6 SHA2562ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Revalidate current executable before every distinct validation stage; never bare
global lykn, stale task binary or source-identity-derived binary hash.

CDC owns planning/index until dispatch; CC then owns exact source paths below,
this slice artifacts/**, results.md, closing-report.md and ledger attestations.
Return source/planning/index ownership before independent review. Source stages
are separately accepted before dependent implementation. Outputs/caches ignored
task target/slice14; durable raw receipts and source freezes in slice artifacts.
Preserve actual whole bodies BEFORE each edit/check/run; pin intended tests and
predictions before runtime. Reuse unchanged complete prior guide readings and
evidence with their original applicability, not fabricated new intake receipts.

## A — NE-C08 shared compile-route validation

Source-ready boundary: cli/src/compile.rs stdout path resolves then validates
reserved names, method-on-expression, nested fn params, no-else-if expression,
exports, then classify/analyze/emit. with_dts resolves but currently only runs
the last two passes. CLI main.rs482 uses with_dts when -o; stdout uses normal
compile (lax only when explicitly requested). `check_strict` has its existing
four-pass subset without reserved names. The three missing compile passes are
the coherent parity scope; this is not a `default` blacklist or DTS bypass.

Recommended private helper shape (not compiled pseudocode):
`fn validate_compile_forms(forms: &[lykn_lang::ast::sexpr::SExpr]) -> Result<(), CompileError>`.
This public type path is also re-exported by CLI reader.rs. Move the existing stdout five-pass
sequence verbatim, retaining order, short-circuit diagnostic grouping and
CompileError::Analysis formatting. Borrow forms (Rust AP-02), propagate Result
with ? (EH-08), no clone/panic/new dependency. Invoke after resolve in both
compile_source_inner and compile_source_with_dts. Leave check_strict behavior,
classifier modes, expand/config/resolve, analysis warnings, JS/kernel output,
DTS generation and CLI writes unchanged. Do not refactor the entire pipeline.

Allowlisted source in A: crates/lykn-cli/src/compile.rs (private helper and inline
unit/API tests); new crates/lykn-cli/tests/compile_validation_parity.rs (actual
CLI regression). No lib.rs public API exposure needed: with_dts unit tests live
inside compile.rs. Existing product Rust tests are allowed; research drivers
must not be JS. inspect main.rs/config/validator source read-only for integration.

Freeze meaningful tests first. Table-driven negative inputs through both
compile_source and with_dts, plus actual stdout/-o CLI rejection:
reserved SAME Slice13 `(func default :args () :body 42)\n(exports default)\n`;
method `(bind r ((express parts):join ""))` => `parenthesized expression`;
nested fn `(bind f (fn (x) x))` => `expected type keyword`;
no-else-if `(bind label (if (> 1 0) "items"))` => existing requires-else predicate;
unknown export `(exports missing)` => unknown top-level binding predicate.
Use existing source validator tests to confirm these exact predicates, not
generic any-error assertions. Same input through same routes; retain stdout,
stderr/status and pre-assert emitted JS/DTS before temporary-drop on red.
Negative -o must create neither JS nor DTS on fresh paths and preserve explicit
sentinel outputs on an existing-output case (validation before any write).

Positive controls: typed exported synchronous increment + console JSON output
42 LF, matching stdout/file JS bytes, expected typed DTS, no runtime stderr;
exported unannotated function retains unknown DTS and existing warning; empty
nonexport module preserves optional-none DTS API; kernel_json/strip_assertions
remain valid and strict/lax APIs keep their existing mode contract. Derive exact
expected JS/DTS/warnings from source/emitter contracts, retain outputs for review.
Do not add speculative CLI combinations or alter no-strict/-o semantics here.

Run focused offline locked CLI tests/unit tests with actual selected counts,
then exact native release build, unfiltered make check and committed citation
gate. Installed Cargo/Rust pinned by source toolchain; no updates or installs.
Use explicit isolated npm_config_cache under target/slice14, fresh owned XDG,
fixed accepted DENO_DIR=/Users/oubiwann/Library/Caches/deno. Existing legacy npm
compatibility tests are part of canonical validation, not a no-npm gate.
Known NE-C07 positive test may stop the unfiltered Rust gate: retain exact raw
failure/counts and incomplete downstream checks; do not filter, hide, or claim
full green. CDC may independently accept NE-C08's focused route semantics with
that explicit known dependency held; full unit acceptance awaits StageB green.
Return clean source/plan refs, raw red/green/gate receipts and ownership now.

## B — NE-C07 only after independent A acceptance and preserved followup

Reuse Slice13 complete unvalidated 14-line forms.rs candidate/diff as a proposal,
not accepted code. Private top_level_binding_sites unwraps valid module-level
async named func/genfunc with exact wrapper shape and resolution-aware
as_form_head. Keep global bindings_introduced deliberately nonrecursive and
existing inline export/module-only/unknown/duplicate/reserved rules intact.
Allowed B paths: crates/lykn-lang/src/classifier/forms.rs; existing
crates/lykn-cli/tests/async_exports.rs; existing shared
test/fixtures/async-exports/{module,consumer}.lykn. No binding/resolver/expander/
JS production/mirror change. Current exports form is correct; retain Slice12
CDC's wrong-instruction/retraction without repeating it.

Existing red unit/CLI tests remain. Review wrapper/resolved-head positives and
invalid/local/parameter/duplicate/nested/scope negatives. Actual native check,
strict stdout/-o compile and Deno import/await result42 LF, empty stderr, meaningful
rejection diagnostics are required. Pin exact new binary/generated output.
Full unfiltered make check and committed citation gate must pass; CDC fresh
focused/full required replay and actual generated-code/source review precedes C.
No release merge. No unrelated repair if a NEW real gap appears.

## C — same frozen four parser observations only

After independent B acceptance, issue preserved continuation. Exact Slice12
candidate6c4faee8c093ba1a109152fee90c508816b49320 tooling/control/prediction
bytes are inputs; no quiet amendments. Required source check/fmt/lint/strict
compile/Deno check and complete generated review use newly accepted absolute
binary/hash from A+B, honest config-free owned /private/tmp cwd verified against
ancestor project.json. Preserve authoring failures; ordinary corrections need
numbered prompt, actual prior bodies and explicit condition change.

Same ordered K11 mismatch, K01 module locations/ranges, K08 top-level await,
K09 real SyntaxError; baseline0/4. Accepted literal predictions in Slice12
artifacts/predictions.md govern, not generated observations. Acorn8.17.0 exact
cached unmodified npm-distributed local ESM SHA256
1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7.
Authorized exact cached use only; no acquisition/general npm-source reuse.
Hash BEFORE dynamic import, verify version and after-hash; inert source never
executed. Same --no-config/--cached-only/--no-npm/--no-remote/--deny-net/--no-prompt
and exact grants, child no subprocess, observer exactDeno only. Freeze source,
predictions, argv/tool inputs before each runtime stage; raw bytes/status first.
CDC repeats the same fresh condition. NEW actual compiler/parser/offline/oracle
gap => immediate stop, no workaround or another repair; preserve remaining /4.
Walker/K corpus, full audit/F6 matrix/library work remain outside scope.

## Policy, reading applicability and close

All helper/script/orchestration/validator/evidence/JSON/command logic is Lykn.
NO Python execution/authorship or parity exception; no Ruby/Fennel/handwritten
research JS/Node/jq or shell-logic substitution. Native direct CLI/simple
filesystem lifecycle plus authorized product Rust/JS tests are allowed. No hook
override/no-verify/force/skip/suppression, broader grants, stale compiler or
generated-JS patch. No dependency/toolchain change, installs, global action,
release integration, push, publication, remote CI or next unit.

CDC applies retained unchanged framework3.0.1, PM required layout/topdown/close,
work-verification2.8, testing/scientific regression/evidence/proportionate-proof,
Rust2.0 (borrowed slice, recoverable Result, existing typed error and ?), JS/Deno
offline/API, Lykn Modules/Async guides. New source reading above supplies actual
validator order/consumers and discriminating negative controls. Current PM
README/entry/prompt-authoring relevant sections refreshed; no claim that truncated
refresh output is a complete new receipt. Reuse earlier full unchanged readings.
Fresh CC reads its own applicable manifest and reports bounded extents honestly.

Close canonical independent review, row dispositions, raw witnesses, parent/
backlog update and CDC retrospective. Preserve every old Slice12/13 deferred row,
failed attempt/provenance deficiency/hook violation/CDC retraction; no retroactive
acceptance. All original F1–F12 and Project07 final research/licence/bootstrap/
lib/ADT/guides/book/human obligations survive. Stop at this explicit endpoint.
