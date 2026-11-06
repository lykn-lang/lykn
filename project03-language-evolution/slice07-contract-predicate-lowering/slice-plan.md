# Slice07 — Contract predicate lowering and resumed native controls

Status: open; Phase A independently accepted in `cdc-verification.md`. Current
assignment `cc-prompt-iteration01.md` resumes Phase B. Initial `cc-prompt.md`
is preserved. Collapsed standalone increment owned by
Project03 NE-C01, not a second implementation home in Project07.

## Authority and endpoint

Operator accepted the proposed sequence “repair precondition code generation,
then resume the same five controls”: “awesome, let's get that repaired!”, later
“keep going :-D”. Installed Rust guidance was explicitly selected; the intervening
guidance cleanup is independently complete at planning bd434c1. Same Autonomous
roles: CDC Sol 6.1 High designs/reviews; fresh CC Luna 6 High implements, avoiding
stale guidance paths. Root coordinates/read-only lookup. No new model question.

Endpoint: bounded NE-C01 repair with meaningful native regressions and required
repository gates, independent repair acceptance, then the unchanged five-control/
eleven-runtime native pilot with independent final review/retrospective; or an
honest new blocker/gap stop preserving all failed/unrun work. No new backend,
library implementation, unrelated compiler fixes, dependency/toolchain updates,
production-branch propagation, merge/rebase, push/publication or remote CI.
Five refinement iterations maximum; no budget/history reset or implicit project
authorization. Prior Slice06 failure remains 1/5 bundles and 1/11 failed runtime
attempt, with four bundles/ten calls unrun under its original compiler condition.

## Baseline and ownership

Planning initially clean bd434c1997b4e369e34cd7343375a56ecbcff5ec. Sole source
implementation home: .worktrees/contract-predicate-lowering, branch
codex/contract-predicate-lowering at 9be0c301e11e3d8503605e9b50b53056f47c9b14,
clean. Its code/lock/Make/scripts exactly match 74a90d5; intervening commits are
guidance only. Other release/main/pilot worktrees read-only. Re-read current
AGENTS and use skills/lykn/SKILL.md, installed rust-guidelines/testing; obsolete
assets links no longer apply. Original release integration priority is not chosen.

CC owns only named source files and this slice's artifacts/results.md,
closing-report.md, ledger Evidence and plan status/intake after handoff. CDC owns
prompts/parent plans/review/retrospective. Sequential index ownership, exact-path
local commits and contiguous Codex/Billo AI trailers. Source tests/build outputs
stay in the task's ignored target/ and temporary directories, not source folders.
Existing native esbuild tool/cache home in native-esbuild-controls is read-only;
do not seed Deno bundle caches or acquire/build another backend.

## Narrow repair design

Native emitter/contracts.rs builds kernel checks by cloning raw surface pre
expressions; post checks replace ~ then likewise bypass expression emission.
forms.rs sends raw guards at single func pre/post (1393/1442), multi func pre/post
(1613/1654), genfunc pre (1789), at the unchanged code baseline. Existing private
emit_expr recursively lowers surface operators and respects resolved form heads.
Use it on predicates, not string operator replacements or a second walk over
generated function/kernel wrappers (which could reinterpret kernel assignment).

Preserve public emit_pre_check/emit_post_check signatures and old pure-kernel
constructor behavior. Recommended shape: add pub(super) internal constructor
variants accepting original diagnostic SExpr by borrow and an owned emitted
predicate. Existing public helpers delegate with their original raw semantics;
the five production sites supply lowered predicates to the internal variants.
Expose replace_tilde only within emitter as needed; preserve its existing logic.
In forms.rs, a small private helper saves expr_context, sets Value, calls
emit_expr with the SAME mutable context/type registry, and restores the saved
context. Pre: lower raw pre. Post: replace ~ with existing result gensym BEFORE
lowering, while diagnostics serialize ORIGINAL post with ~. Then construct
kernel !/if/throw checks. Do not lower the original diagnostic into its message,
reset gensyms/resolution or change type/contract order, strip behavior, generator
dispatch/yield behavior, public APIs or unrelated expression errors.

Allowed source paths: crates/lykn-lang/src/emitter/contracts.rs,
crates/lykn-lang/src/emitter/forms.rs,
crates/lykn-cli/tests/contract_predicate_lowering.rs (new), and
test/surface/contract_predicates_test.lykn (new, focused existing-harness parity).
No new dependency or handwritten JS helper. If actual implementation requires
other production paths, report the exact need before expanding. Helper naming
and ordinary local test formatting are discretionary; semantic boundaries bind.

Applied guidance: Rust AP-02/ID-39 borrow str/SExpr inputs; AP-12/18 avoid copies
except intentional owned AST construction and existing tilde traversal; AP-09 no
new caller-triggered panic in production (test expects are assertions); existing
emitter Value/save/restore pattern is the local precedent. Testing guides require
behavior/negative controls, actual native boundary, preserved failures and native
gates, not matching private implementation or blanket JS-output text replacement.

## Phase A regressions and repair gate

Add meaningful strict-native CLI integration tests using existing tempfile dev
dependency, CARGO_BIN_EXE_lykn, unique temp dirs, isolated cwd/config and explicit
Deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt.
No Deno permission grant is needed for pure probes. Write Lykn source, compile
normally to owned JS, run actual generated module; no eval/raw JS workaround or
--no-strict/--strip-assertions in the native regression. Capture compile/runtime
code/stdout/stderr. Parse failures are not expected contract rejection: either
catch expected errors in Lykn and serialize name/message (assert exact output),
or explicitly require runtime Error and reject SyntaxError/COMPILE_ERROR markers.

Finite regression population (product tests, distinct from the five pilot
stimuli): exact frozen YAML :pre function positive/negative; :any strict equality
42 vs string "42"; post equality with ~ positive/negative and original callee
message; both multi-clause pre/post routes; generator guard positive/negative
when consumed; nested and/or/not/!=/comparison/value-producing cond predicate;
lexically bound predicate name (e.g. parameter not) must remain a normal call.
Use real positive and negative results, preserve caller/callee blame, and check
following statement context still works. The prompt fixes seven small fixture
families / 17 input observations; shared construction may avoid repeated
compilation but must not silently drop an observation. No fuzz/backend/platform
matrix or general harness.
Existing strip-assertion semantics may be tested only as an explicit unit API
regression, never as an escape for native/pilot failures.

Preserve existing pure constructor/tilde tests. Add the focused Lykn test using
existing compileBoth for an equality pre and post/nested predicate, without
editing its normalizer/lax reference policy. This sanctioned comparison helper
does not replace the strict native regression. JS expander 951–985 recursively
expands produced kernel children; native guard bypass is the source-grounded
repair boundary. No JS production change is assumed; report actual parity issues.

Commit test-only regression state and run the relevant native test on unfixed
code to preserve real fail-before evidence (unchanged controls may pass). Then
implement/commit repair and run focused tests to green. Build new compiler offline
and locked first with existing cached Rust 1.97.0; record any permission/cache
failure honestly, use authorized tool approval, never change locks/toolchain.
Use default task target layout for Makefile's target/release and bin freshness
assumptions. Run actual make check and make check-cited-paths at committed HEAD.
Full make check includes legacy npm-client compatibility tests and existing
Deno dry-run checks; do not hide PATH/filter them or claim whole validation is
npm-free. No new Node/npm dependency/install is authorized; existing tools are
present. check-deps may detect compatible updates; preserve failure and return
to CDC rather than update unrelated deps or skip/patch the gate. No snapshots
auto-accepted. A failed required gate is not green because focused tests passed.

Phase A return exact source/test commits, toolchain/lock/binary hashes, actual
red/green/gate outputs and open-row attestation; relinquish ownership. No pilot
bundle/runtime until CDC independently accepts repair and required gate status.

## Phase B unchanged pilot, after repair acceptance

Reuse exact source population at planning30e97932dc2cabeaa243338f405a5b8fe6399c10
under Slice06 artifacts/source (five stimuli, ten supports, one Lykn observer,
five configs and seven-byte data). No specimen/observer edit. Same esbuild0.25.5
binary b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f and
Deno2.9.6 hash2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Only compiler source/binary condition changes, recorded/committed before runs.
Use fresh owned run directory; strict compile all16, dist, byte-compare all15
staged modules and nine export maps. No old generated output reuse across compiler
conditions. Snapshot13 public files/keys before/after; data hash5041bf1f…18b22.

Preserve Slice06 staging/permissions/observer protocol and exact predictions:
C1 BASE with zero library graph/payload; C2 JSON value/no YAML graph/contribution;
C3 direct JSON value/no file/document/YAML graph/contribution; C4 effect then
entry42, used/effect retained and unusedPure absent despite resolved dead input;
C5 all nine public paths with exact frozen JSON/values and unchanged package bytes.
YAML remains a one-input stub, not production/fidelity proof. Root/barrel resolution
and retained bytes remain separate. No original F-6/F-10 substitution.

C4-only first bundle/actual metafile/complete tiny code inspection before any
runtime; expected unchanged C4 hash6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a.
On unidentifiable retained/removed code or unexpected compiler change, stop and
report exact gap; no extra backend/control to evade it. After recorded gate,
reuse that bundle/hash and run fixed eleven calls in original order:
C5 source-before; C4 source/bundle; C1 source/bundle; C2 source/bundle;
C3 source/bundle; C5 bundle; C5 source-after. Unique raw receipts precede
assertions. Five total bundles/eleven runtime invocations; no hidden variants.
Only C5 gets exact-data read grant; original minimal driver run/read/write and
child deny-net/no-remote/no-npm/cached-only/no-prompt flags remain.

Carry all failed/unrun baselines, original Slice01 F1–F12, Project03 composition,
Project07 final synthesis/licence/bootstrap/ADT/guide/book/human gates. Old Slice06
deferred rows stay historical; a new accepted compiler condition does not rewrite
its failed attempt. Final review/retrospective ends this increment, not the project.
