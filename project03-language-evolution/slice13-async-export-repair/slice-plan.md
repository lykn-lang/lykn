# Slice13: NE-C07 repair and unchanged parser re-entry

Opened 2026-11-06. Status: closed at independently confirmed first new gap
NE-C08; NE-C07 remains unaccepted/unfixed. One ledger row done, six deferred.
Parser observations0/4 run. See [independent review](cdc-verification.md).
Collapsed standalone Project03 increment. Original opening scope follows.
Operator: “Let's fix NE-C07, validate it independently, and then resume the same
four parser observations. Same models, Autonomous Mode, and stop if we hit
another real evidence gap :-D”. Endpoint: independently accepted narrow repair
plus the same four observations, or an honest new-gap stop. No walker/full
corpus/F6/library work, release integration, publication or next unit.

## Roles, homes and current source

CDC `/root/cdc`: OpenAI Sol6.1 High; fresh CC: OpenAI6 Luna High; root read-only
transport. Two contributors: CC authors, CDC independently reviews actual source,
generated code and fresh execution. Five preserved correction iterations across
the unit, no reset between repair and re-entry. Preserve every failed attempt,
whole source body, actual tool/config/output and unrun denominator.

Planning branch/home `.worktrees/planning`, initial7dd457388cf3c2b213df02df230994a545c6f2db.
Reuse task checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
on NEW dedicated `codex/async-export-binding`, created normally from
f70565566088f5d55129edda6bd73a4691e5a58d/tree572bc953. Old
codex/template-string-boundary remains bc83b43 unchanged. Release0.6 stays
read-only f705655; no source branch merge/propagation is authorized.
Source-cwd installed Rust/Cargo1.97.0 from rust-toolchain.toml; no upgrade.
Baseline release compiler absolute target/release/lykn SHA256
57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28.
Deno /opt/homebrew/bin/deno2.9.6 SHA256
2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.

CDC owns planning/index until dispatch. CC then solely owns task source/index
within the explicit paths below and this slice's artifacts/**, results.md,
closing-report.md and ledger attestations/index. All source/research writes
are sequential; return both ownerships for independent review. Generated caches
and normal outputs live ignored task target/slice13/{cc,cdc}; selected evidence
and authoritative research sources stay planning. No new worktree needed.

## Phase A: narrow native validation repair

Retained failure: Slice12 candidate6c4faee/core SHA8ab59c5f4c81cf0cd8187287a01e6858d9d2dd30d89332d08a64affdadb8a018,
CC7c9fbea and independent check exit1 at1:10/1:22. Current SKILL Modules/Async
explicitly teaches `(exports name)` and `(async (func name ...))`; do not change
the language contract to get a green check. Exact original witnesses/history
remain unchanged, including CDC's earlier wrong-export instruction/retraction.

Source check_strict and strict compile/build all call validate_exports_declarations
after expansion/resolution (compile.rs74–135,251,342). Its private
classifier/forms.rs184–209 collector is the narrow repair boundary:
top_level_binding_sites currently unwraps only outer export. Recognize valid
module-level async named-function declarations transparently, with known
wrapper structure/function payload and resolution-aware as_form_head; never
recursively collect arbitrary function-body/parameter/nested bind names.
Preserve existing inline-export compatibility and unknown/duplicate/module-only
validation. Inspect supported named genfunc and existing kernel-function async
compatibility before choosing precise wrapper guard; malformed/call-bound heads
must not be promoted. No new async grammar or permissive arbitrary payload rule.

Keep shared bindings_introduced deliberately nonrecursive: walk_bindings already
recurses and resolver/expander consume it for different scopes. A broad recursive
change could duplicate reserved-name diagnostics or hoist locals. Inspect those
consumers to justify scope, not redesign them. If the private fix is insufficient,
return exact evidence before broadening; no speculative binding/compiler rewrite.
Parallel JS source has its own binding/classifier/emitter path; no matching
native export-validator failure is presumed. Necessary existing product-JS
regression tests are allowed; new JS research/helper drivers are forbidden.

Allowed source paths:
- crates/lykn-lang/src/classifier/forms.rs (private fix + focused unit tests)
- crates/lykn-cli/tests/async_exports.rs (new actual CLI regression)
- test/fixtures/async-exports/module.lykn and consumer.lykn (shared product inputs)
- test/forms/export.test.js (existing product test, only relevant shared positive)

Do not change bindings.rs/resolver/expander/JS compiler/mirror unless a separately
recorded source-grounded scope amendment is issued. No dependencies/Cargo lock/
toolchain/Make/guidance changes. Ordinary explicit-path local commits only.

### Test contract before production edit

Freeze tests/fixtures first and capture meaningful baseline failure, not merely
a Rust/test-source syntax error. Suggested positive module: `(exports fetch-value)`
plus `(async (func fetch-value :args (:number value) :returns :number :body (+ value 1)))`.
Consumer imports its actual emitted module filename and logs JSON.stringify of
`(await (fetch-value 41))`: exact42 LF, empty stderr, exit0. Existing Rust
CARGO_BIN_EXE_lykn/tempfile/serde_json harness patterns in template_string_boundary.rs
and contract_predicate_lowering.rs provide real CLI/Deno boundaries. No new JS
research runner. Record actual absolute built CLI/version/hash and generated JS.

Unit regressions should cover named async func/genfunc declarations, exports
before/after definitions and relevant valid wrapper compatibility, plus genuine
unknown name, parameter-only/local nested function, nested exports, duplicates,
reserved names and invalid arbitrary async bind/call-head promotion. Use actual
resolved tags where testing as_form_head semantics. Keep distinct assertions and
actual rejection diagnostics; no generic any-error substitute for the intended
validator predicate. CLI regression proves native check AND strict compile AND
actual imported/awaited result; unknown/nested negative cases remain rejected
through actual CLI routes. Existing public-JS product fixture test may verify
its emitted async/export shape; do not invent native/JS validation parity.

Focused commands: cargo test --offline --locked -p lykn-lang exports;
cargo test --offline --locked -p lykn-cli --test async_exports -- --nocapture.
Derive actual selected counts. Then cached offline/locked native release build,
complete generated-code review and unfiltered required `make check` plus
committed `make check-cited-paths`. Use own task target/slice13/cc npm_config_cache
and fresh XDG_CACHE_HOME, fixed existing DENO_DIR=/Users/oubiwann/Library/Caches/deno
for canonical legacy validation. Confirm gate tools already installed so no
autoinstaller branches. Existing npm dry-run compatibility tests remain in the
canonical gate; no npm/Node-free gate claim or PATH filtering. No Make deps/
version updates, ignored tests, force/skip/hook overrides or broader permissions.
If JS compiler bytes ever change under an approved amendment, mirror/fresh
materialization proof becomes affected; do not assume it here.

Return committed PhaseA source/red/green/raw/fullgate results and ownership.
CDC inspects exact diff/callers/negative controls/generated code, independently
runs relevant focused gates AND full required Make/citations under fresh own
caches, and pins the exact new tested task binary. No release merge follows.

## Phase B: preserved followup after independent repair acceptance

Only CDC's numbered continuation authorizes re-entry. Reuse exact Slice12
core/probe/observer at6c4faee and controls/predictions at the retained slice;
no silent oracle/control-byte changes. Re-run required check/fmt/lint/strict
compile/Deno check with NEW absolute task binary/hash, true config-free owned
/private/tmp cwd (verify no ancestor project.json), durable ignored task outputs,
complete generated-code inspection and pre-runtime freezes. A format-only or
ordinary authoring correction is preserved explicitly, never a semantic
workaround for another real gap. Old unvalidated sources/failures stay immutable.

Then only ordered K11,K01,K08,K09, fixed literals/ranges/status expectations:
0/4 initially unrun; mismatch and SyntaxError are expected nonzero observations,
not failed positive gates. Acorn exact existing local ESM SHA256
1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7, same Deno2.9.6;
hash BEFORE matching literal-file dynamic import, version/post-hash and no
source body execution. Same no-config/no-npm/no-remote/cached-only/deny-net/
no-prompt, exact read/write grants, child no subprocess, observer only exactDeno.
Raw argv/cwd/env/hashes/bytes/code before assertions, fresh per-case caches.
CDC independently repeats the same fixed fresh condition. No full K walker,
corpus or F6 matrix. Any new real compiler/parser/offline/oracle evidence gap
stops immediately with unchanged remaining denominator, owned follow-up/options;
no another repair or export/kernel/bind/permission workaround in this unit.

## Policy/history and closure

All authored research/helper/orchestration/validator/evidence/JSON/command logic
is Lykn. NO Python execution/authorship or parity exception; no Ruby/Fennel/
handwritten JS/Node/jq or shell-logic substitution. Native direct CLIs/simple
filesystem lifecycle and authorized native/product tests are allowed. Preserve
whole candidates before every check/edit/run and commit intended source/control/
prediction freezes before runtime. No precheck without retained bytes, no
core.hooksPath override/force/skip/permission injection; normal commits only,
real multiline -F messages with contiguous Codex/Billo AI trailers/rawbody check.
Prior Slice12 process deficiencies and deferred rows are not retroactively cured.

Close with explicit done/deferred rows, independent evidence/retrospective and
parent/backlog update; original F1–F12 and Project07 synthesis/licence/bootstrap/
lib/ADT/guides/book/human goals remain distinct/open. No next unit.
