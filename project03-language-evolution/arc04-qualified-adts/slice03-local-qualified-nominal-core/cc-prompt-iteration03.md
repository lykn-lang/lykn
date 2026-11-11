# S03 A correction03 — public implicit-return parity

Continue correction02 and fix the newly exposed public compiler defect. Same
Luna 6 High CC and separate Sol 6.1 High CDC, standard Autonomous Mode. Root
selects the existing documented/native implicit-return contract; adding type
annotations to hide the failing fixtures is not the repair. No operator pause
is required for this concrete implementation inconsistency.

## Exact intake and authority

Source remains `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
on `codex/qualified-adt-core`, parent
16dcd64f09946b6bd484a893dcefa16c01e1b431. Preserve correction02's three dirty
files: emitter/forms.rs, tests/emission_results.rs and
test/forms/embedded-adt-pattern.test.js. Root rechecked that exact set and
saved its patch at artifacts/increment-a/correction02/source-before-implicit-return-fix.patch,
SHA-256 e59b3ec72b83a8d095a18b7541ec8fb62a1a395d893220e263fba502932cc23f.
Do not reset or reapply that patch over the existing work. The temporary debug
error-output change was already reverted; its captured diagnostic remains in
the failed M6 receipt. No correction02 source commit or full gate occurred.

Root owns planning Git/index and parent status. After explicit issue CC owns
task source/build/index again. No release edits, merge, push, publication/tag,
dependency, remote CI or subagents. No B/C, qualified syntax, nominal runtime,
purity or new public stripping API is assigned. The unissued B1 design is not
implementation authority.

No Python execution is permitted; no parity exception exists. No Python/Ruby/
Fennel/handwritten JS research helper, including temporary ones. Research
tooling uses Lykn. Actual compiler Rust/JS and normal product tests are allowed;
shell/native CLI is for direct invocation and file lifecycle. Read AGENTS,
correction02 and current CDC record; apply the installed domain/testing guides
and source guides below. Send concise readback, then complete implementation.

## Verified problem and binding behavior

The completed materialized five-test oracle ran three passing tests and two
failing dispatch fixtures. Owned Array aliases were correct. Both failures
occur because public `classifier.js::buildMultiClauseFunc` pushes bare body
expressions when the clause has neither :post nor :returns, then execution
continues to the final no-match throw. Native compilation of those unchanged
fixtures already returns the expected array/string results in all four
checked/stripped shadow conditions.

Root inspected immutable 16dcd64f:

- `docs/guides/01-core-idioms.md`, ID-19, teaches that func/fn return their last
  expression. Its SHOULD concerns idiomatic source authoring, not permission
  for optional type annotations to alter successful function control flow.
- Native `emit_func_multi`'s ordinary no-post branch converts and returns its
  last expression independently of a returns annotation, preserving its
  statement/control-transfer exceptions.
- Public `buildMultiClauseFunc` (~1001–1220) has
  `if (hasPost) ... else if (hasReturns) wrapReturnLast ... else ...bodyClause`.
  `surface-helpers.js::wrapReturnLast` (~66) already preserves statement-only
  and control-transfer tails. Reuse it; do not create a parallel return rule.

**Binding:** ordinary multi-clause bodies without :post use the existing
implicit-last-return policy whether :returns is present or omitted. The
existing :post branch, clause ordering/overlap, argument and error guards,
explicit transfers and no-matching-clause behavior are retained. This repairs
control flow only; it does not add missing general multi-clause return-type
validation, solve I4 protected early returns, or change void/generator policy.

## Concrete implementation and proof

1. Preserve and complete correction02's materialized tests and real dispatch
   parameter-span repair. Both fixture sources remain unchanged. Keep exact
   stdout, exit zero and empty child stderr, all seven module comparisons,
   cold copied CLI/config/lock/no-canonical-fallback assertions and five actual
   materialized runtimes.
2. In canonical `packages/lang/classifier.js::buildMultiClauseFunc`, keep the
   current hasPost branch. In its ordinary else branch always append
   `wrapReturnLast(bodyClause)`. Remove only locals made unused by eliminating
   the hasReturns gate. Do not alter neighboring single-clause, generator,
   dispatch sorting/type conditions or postcondition logic. Copy the resulting
   classifier.js byte-for-byte into the actual embedded package.
3. Add a normal public surface runtime regression in
   `test/forms/language-surface-runway.test.js` alongside its existing
   multi-clause tests. Exercise unannotated clauses with both a one-expression
   body and a prefix plus final value, compare valid annotated and unannotated
   variants, and assert exact returned values/prefix effects. Retain an unknown
   argument-type no-match outcome. Include a small emitted-runtime control
   explicitly exercising an unannotated explicit-return tail and a multi-clause
   :post branch; existing nearby overlap/source-inclusion tests do not prove
   these runtime branches. Preserve the helper's statement/control-transfer
   exclusions. Do not assert that
   return-type guards are now complete. Run emitted ESM, not only source-text
   inclusion tests. Ordinary product JS test orchestration is authorized.
4. Run both native checked/stripped fixtures and the canonical public surface
   regression, then actual M6 materialized five-case suite. The pre-fix failure
   must stay recorded at parent16 plus the retained correction02 patch; a test
   title is not evidence of a case actually executing. If another substantive
   issue appears, report a precise source/runtime witness to root; routine
   obvious mechanics remain authorized, public contract expansion does not.

Correction02's census clarification remains required: 44 raw-producer test
sections, 125 remaining sections with direct public emit_form calls, 33 other
sections, 202 total. 158 is the untouched remainder. Retain earlier attestation
and append the correction; do not replace source history with a rewritten
narrative. Label missing failure logs as unavailable rather than reconstructing.

## Validation, commit and return

Use BOTH explicit existing DENO_DIR and owned npm cache from the first focused
command, with owned XDG/tmp. Scope receipt environment variables to focused
commands where useful; retain full gate logs. After focused controls pass, run
`make check` (docs once), `make bundle-size-check` (80 KiB), commit exact source
paths, then committed-HEAD `make check-cited-paths`. No whole-file legacy JS
formatting, automatic snapshot approval, weaker oracle, amended commit or
receipt cleanup based on file count.

The source set is correction02's three files plus canonical/embedded
classifier.js and language-surface-runway.test.js: six named files. Necessary
direct caller/test adjustment inside that set is in scope; other public
semantics remain held. Use `git commit --only` and the contiguous Codex/Billo
AI trailers in a single body. Check actual %B and return clean exact pin/tree.

Append a correction03 checkpoint and census clarification to closing-report.md;
new useful receipts live in artifacts/increment-a/correction03/. Leave
correction02 failures/patch and prior evidence intact. Root owns all planning
staging/commits/ledger/parent changes. Return source/build ownership for separate
Sol review; CC success accepts no LC row and starts no B/C work.
