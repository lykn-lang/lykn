# S03 iteration16 — B2b2 native ICU generated-name hygiene

Assignment path: project03-language-evolution/arc04-qualified-adts/
slice03-local-qualified-nominal-core/cc-prompt-iteration16.md.
Predecessor cc-prompt-iteration15.md completed B2-UNIT; execute this new native
checkpoint and return its proposed-done evidence to root and separate Sol CDC.

Issued2026-11-13 after separate Sol read-only source readiness. Source baseline
5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb,
treef632c415b833e796e6843abdc5220d6492595fc0, clean branch
codex/qualified-adt-core in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Root owns design/planning/index; source/build transfers to Luna on explicit
issue. Same approved Luna6High CC/separate Sol6.1High CDC, standard Autonomous
Mode. No release merge/push/publication/remote CI/new dependency.

## Useful scope and invariants

Distinct source spellings identify distinct bindings. Emission must also keep
compiler-generated locals from capturing those bindings. Root's actual native
CLI baseline is retained at artifacts/increment-b2b/root/icu-hoist-baseline:

```lykn
(bind _n 2)
(console:log (template "{n} {n}" :n (+ _n 1)))
```

currently emits `const _n = _n + 1` and throws ReferenceError. Likewise plural
selector _v0 emits `const _v0 = _v0`. A noncollision control prints3 3. Repair
this late native-generated-local family before ordinary binding hygiene.
This does not implement source binding IDs, some-name/someName, OwnerRef/CaseRef,
public JS ICU hygiene, nominal activation or check semantic join. Keep every
LC02–08/B2b obligation and earlier accepted rows. Public JS ICU has analogous
raw names; record its separate remaining obligation, do not silently broaden
this bounded native checkpoint or add cross-equivalence cases it cannot pass.

## Root's source-grounded implementation recipe

Binding: no new runtime, public API, compiler-wide ambient allocator, dependency,
serialization change or reordering. Keep current IIFE locations, control/effect
boundaries, branch laziness, once-only evaluation, exceptions and existing
keyword iteration order. Do not rewrite hoists as IIFE parameters, sort kwargs,
or migrate unrelated template semantics. Existing successful output should keep
preferred local names when they are safe.

Recommended: one private per-template generated-name allocator, preferably in
codegen/names.rs (crate-private type; fields private) for reuse by later native
hygiene. It owns a HashSet of occupied emitted identifiers and a suffix cursor.
Constructor/reservation borrows source SExpr inputs. Walk atoms (including
List and Cons recursively); reserve to_js_identifier of the first colon segment
as emit_member_chain does. Conservative extra reservation of syntax/property
atoms is acceptable; strings/keywords/numbers are data, not variable spellings.
No AST clone for the scan. Reserve ALL actual kwarg expression source atoms
before generating any hoist, so later kwargs cannot be captured. For an atom
without colon reserve its full normalized spelling. Account for normalized
forms such as _n! that emit _n.

Allocation takes an already emitted valid preferred stem, e.g. _n or _v0.
Try stem unchanged; on collision try a deterministic suffix such as
`{stem}__lyknGenerated{cursor}`, testing/reserving EVERY candidate against
occupied names. Never rely on a reserved-looking prefix being unnameable.
Reserve each returned name immediately; two slot keys that normalize equally
must still receive distinct generated locals. This private encapsulated state
enforces freshness; it is not a new public string/newtype API.

In codegen/icu.rs try_emit_template_icu, create the allocator after kwargs
validation and before consuming kwargs. Use it for the existing repeated-slot
hoist preferred names. Thread the SAME allocator explicitly through emit_mft,
emit_plural_iife, emit_select_iife and their recursive branch calls. Keep the
selector counter's existing _v0,_v1 preferences, but allocate each preferred
name against the shared occupied set. This also protects a hoist named _v0
from a nested selector and prevents generated locals capturing one another.
The literal-only dispatch and in-module emit_mft_str helper construct a local
allocator too; helper must reserve its actual kwargs, not assume a fresh test
universe. No global/static/mutex/Arc/thread-local state or extra current-unit
handle. All private metadata/host/completion protocols remain untouched.

Counter/suffix exhaustion must not silently wrap/reuse a name; choose checked
arithmetic consistent with current error channel or a finite search argument.
Ordinary OOM/allocation policy stays Rust's existing one; do not invent
configurable budgets. One scan per template plus per-allocation set lookup is
sufficient; no speculative whole-writer/IR refactor.

## Discriminating proof

Add ordinary Rust product tests, using existing ICU/runtime helpers or a small
native-only helper in icu_cross_compiler_tests.rs; no new research harness.
Run generated JS and require subprocess success before stdout assertions.
Skip cannot count as runtime proof: independent environment has Deno.

1. Actual repeated-slot _n fixture prints3 3; native canonical CLI checked and
   stripped both execute successfully. Old code fails TDZ.
2. Plural source _v0=2 prints2; select source _v0="owner" selects Owner. Nested
   same-selector and plural-inside-select retain correct selected values.
3. A noncollision template keeps its old preferred name/output and result.
4. A suffix-looking source name, normalization collision (_n!), colon root
   (_n:value), and hoist/selector overlap all execute with original values.
   Assert outputs derived from fixtures; do not merely inspect fresh strings.
   Include both repeated slot keys a-b and aB with distinct nontrivial values:
   their preferred hoist names both normalize to _aB. A correct repair retains
   both values rather than duplicate declarations or shared values.
5. Repeated nontrivial kwarg is evaluated exactly once and returns its expected
   repeated value even when its callee/argument uses a colliding name; retain
   exception propagation and unselected branch behavior. For the latter use
   a once-referenced kwarg in the unselected branch: existing repeated
   nontrivial kwargs are eagerly hoisted, and this repair must not add laziness.
6. Repeated/failing/recovery compilations cannot leak allocator state. Existing
   ICU parser/invalid forms/concat and cross-compiler equivalence tests stay.

Use source-supported forms and existing fixtures. The examples above were
compiled/executed as documented; new edge-case fixtures are test designs, not
preclaimed runtime observations. Existing icu_cross_compiler_tests.rs directly
tests kernel template codegen, so supplement with actual canonical CLI; do not
claim that direct writer coverage alone proves the owned-unit path.

## Intake, paths, gates and evidence

Required-full: this prompt and source AGENTS.md. Required-sections: current
slice plan/ledger, root baseline README/raw generated outputs, accepted B2-UNIT
limitations. Load installed rust-guidelines (TD02–03 and ownership OB02–03)
and testing (behavior discriminator/validation gates); source Lykn skill/guide
for actual Lykn fixtures. Root applied TD02–03 to one encapsulated owned
freshness invariant, OB02–03 to borrowed scans/exclusive allocator mutation;
no speculative public abstraction. Testing demands actual runtime disagreement
with known bad output and subprocess exit checks.

Inspect complete affected functions and caller census: names.rs normalization/
member roots, ast/sexpr.rs variants/accessors, icu.rs dispatch/hoists/all MFT
callers/test helper, existing ICU/e2e tests, canonical CLI compile/default/
stripped routes. Before edits record actual read extents, query coverage and
source-cited readback in absolute canonical
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b2/cc/index.md`.
Root owns planning staging/ledger. Recover truncation; do not fabricate reads.

Authorized product paths: crates/lykn-lang/src/codegen/{names.rs,icu.rs},
crates/lykn-lang/tests/icu_cross_compiler_tests.rs and e2e_tests.rs if needed
for actual canonical runtime proof. Do not edit production JS/embedded copies,
ordinary binding/resolution/analyzer/emitter behavior or unrelated goldens.
If source contradicts recipe, report before dependent changes; root may settle
clear local mechanics under standing authority, not erase failures.

No Python execution or Python/Ruby/Fennel/handwritten JS research/evidence/
orchestration/command helpers; no parity exception. New helpers use Lykn.
Ordinary Rust/JS product tests and direct shell/CLI/simple lifecycle allowed.
Record exact cwd/command/env/raw streams/numeric status outside ignored caches.
DENO_DIR=/Users/oubiwann/Library/Caches/deno; create XDG/npm/TMPDIR under
/private/tmp/lykn-b2b2-cc/ outside every repo/config ancestor before invoking.

Focused native allocator/ICU/canonical runtime gates, then fresh make check
(docs included once); actual cold M6 fourteen module comparisons/current49
public cases may be established by its inner receipts. Required copied native
CLI and canonical checked/stripped fixtures; unchanged public/browser/private
host/Reflect/JSON coverage survives the full gate. After commit run finalHEAD
cited paths and80KiB browser gate; unchanged JS inputs permit retained size
measurement only with explicit reviewer applicability. Never repeatedly run
full gates on known-bad focused candidates or weaken tests/gates.

Commit only inspected exact authorized files with git commit --only; message
file and contiguous literal+parsed Codex/Billo trailers. No amend/reset/blanket
staging. Return clean committed source/build with commit/tree/path inventory,
all original/final attempts, real denominators, native-only API/behavior impact
and remaining public/source-name/owner obligations. Separate Sol independently
verifies before a new B2-ICU-N row can close.

Root author readiness: actual native runtime failures and control are retained;
all production functions/normalization and private helper signature/call sites
were inspected. No runtime behavior choice is delegated. Separate Sol found
no recipe contradiction: nested kwarg scans cover source atoms; canonical
host/completion finalization precedes native codegen, while current raw
writer aliases are disjoint from this ICU naming family. That is family-
specific evidence, not a generic promise for future generated names.
Root clarifies existing eager repeated-kwarg behavior and preserves HashMap
consumption order, so neither deterministic full output nor new laziness is
claimed. Readiness artifact and clean handback precede this issue.
B2b overall and S03 remain open.
