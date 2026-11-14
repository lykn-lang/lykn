# S03 iteration22 — preserve nested catch default validation

Issued2026-11-13 after root author-readiness and separate Sol source-readiness;
exclusive source/build transfers root→Luna on actual dispatch.
Public21 is retained at dba24d4063f34551c30590c884a495c8ca57298f,
tree0ad99ea5838a463ee8aa680005fae472a0b8135c, clean task branch
codex/qualified-adt-core in
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering.
Planning is the existing orphan
/Users/oubiwann/lab/lykn/lang/.worktrees/planning.
Same approved Luna6High CC and separate Sol6.1High CDC, standard Autonomous
Mode. Root owns design/planning Git/index/ledger/status. Source/build transfers
only on actual issue; no reviewer or root build overlaps CC ownership.

## Binding correction and rationale

Independent public review found R01 and holds B2-DISCARD-P. Read
artifacts/increment-b2b3/public/cdc/README.md and source-review.md in full.
The new CATCH_BINDING discriminator correctly excludes catch from newly added
canonical spread/required-default-RHS rules, but it also accidentally excludes
preexisting default-LEFT traversal in walkPatternDefaults. Before21 catch
passed BINDING_PATTERN and took that traversal. TypedParameter's old traversal
is different and must remain so.

The concrete supported positive, already publicly executed0/output1 by Sol:

```lisp
(try (throw (array (array)))
  (catch (array (default (array (default value (=> (input) 1))) (array)))
    (console:log (value 7))))
```

Change ONLY input to eval. Current public lykn wrongly succeeds and emits
`catch ([[value = eval => 1] = []])`; actual ESM fails1 with SyntaxError.
Existing validateReservedNames must reject that strict-mode parameter before
code generation. Native check already rejects it; no native repair is needed.
Source inspection of immutable759 establishes the old traversal; no old public
runtime was replayed or claimed. The actual corrected raw-arrow witness is
catch-default/positive-kernel.lykn and reserved-kernel.lykn in the review home.
The earlier typed-source-fn catch attempt is preserved but unexecuted/unsuitable:
legacy catch parameter expansion is deliberately unchanged. Do not substitute
source fn in this witness or broaden catch grammar/expansion.

Recommended exact implementation: in binding.js walkPatternDefaults' default
branch, reuse its existing `typed` discriminator and recurse into child1 for
NON-TypedParameter grammar (`if (!typed) ...`). This restores BindingPattern
and CatchBinding's shared prior left walk. Keep the RHS slot expression
`pattern.values[typed ? 3 : 2]`, all scope inputs, actual default evaluation and
private metadata unchanged. Equivalent explicit BindingPattern-or-CatchBinding
logic is local discretion; unchanged behavior is binding.

Keep CATCH_BINDING at the catch callers. Do not switch catch back wholesale to
BindingPattern: canonical spread participation and required-default-RHS name
projection remain excluded from catch, as issued21 requires. Keep all private
filters, source name/data roles, five prepared consumers, static Bind branches,
exports, numeric-key emission and completion/host/ICU lifecycle unchanged.
Mirror the one canonical production edit byte-for-byte.

## Product proof and exact scope

Add the exact positive to the EXISTING pattern/catch top-level group in
test/forms/discard-bindings.test.js. Execute real ESM from public lykn AND
mapped browserCompileLykn; both must run0 with stdout1 and empty stderr.
For two negatives differing only input→eval and input→arguments, assert both
facades THROW during compilation with the existing strict-binding diagnostic:
`'<name>' is forbidden as a strict-mode binding identifier`.
Do not accept a generated module's later SyntaxError as the expected result.
These negatives reject the current defective implementation. Existing catch
callable8 controls, canonical spread/default traversal and typed-parameter
cases must remain green. Reuse current module helpers and cleanup; no new
top-level test or t.step population, M6 selector/count change or new harness.

Exact THREE source paths:
- packages/lang/binding.js
- crates/lykn-lang/embedded/packages/lang/binding.js
- test/forms/discard-bindings.test.js

No native Rust, other public module, new API/dependency, reader, catch grammar,
typed catch expansion or new default/rest annotation behavior is authorized.
No whole-file production reformat or migration of unrelated tests. Canonical
and embedded binding.js must compare equal; all five21 mirrors stay equal.
Seven meaningful groups remain seven; M6 remains62 tests/14 comparisons.

## Reading, validation and handback

Required-full before edits: this prompt, current slice-plan/ledger, source
AGENTS, issued21, bounded recipe, independent public HOLD README/source-review.
Required-section: binding.js walk/walkPatternDefaults (catch/function/default
call chain), PatternGrammar, patternNames, kernelParamNames and
validateReservedNames with their dependencies; current full489-line product
test and its real execution/import helpers; review catch-default raw-arrow
fixtures/results; current M6 map/count/assertion; source Lykn guidance relevant
to catch/kernel and immutable bindings. Prior CC index/native acceptance are
reference-only except exact retained evidence this correction relies on.
Installed JS anti-pattern12 (SHOULD-AVOID shadow/TDZ), closures08 (SHOULD
per-invocation private state), Deno testing01/03/04 and testing01/03 guide the
unchanged lexical roles, early strict-name rejection and actual awaited
positive/negative runtime proof. Root inspected the complete causal path and
both grammar branches; no public contract choice is left to CC.

Record read extents, missing/truncated recovery and source-cited readback in
artifacts/increment-b2b3/public/correction01/cc/index.md before edits. Do not
modify original21/independent HOLD receipts. New failure/source/command/env/
stdout/stderr/numeric status receipts go in that correction home. Snapshot
actual test bytes before executions; a later reconstruction is not original.
Reuse existing DENO_DIR with owned /private/tmp/lykn-b2-discard-public-cc/
XDG/npm/TMP. Track the exec session identifiers; if a process stalls, preserve
incomplete observation and safely stop its exact owned process before retry.

Run new catch positive/negative focused proof and the seven-group suite plus
affected binding/lexical/private/ICU/host regressions against canonical and
fresh staged browser. Then ONE final make check (docs once), with a fresh
precreated absolute M6 hook directory capturing actual62/14 inner receipts.
Commit only the three paths using git commit --only, contiguous Codex/Billo
trailers, no amend/reset/blanket staging. Run final committed-HEAD cited paths
and fresh81920-byte size gate; retain exact denominators/cache/network/skip
limits. Do not claim prior bad candidate's CC full as this correction's gate.

No Python execution/parity exception. No Python/Ruby/Fennel/handwritten JS
research, helper, evidence, orchestration or command logic. New helper logic
uses Lykn; ordinary JS product tests and direct shell/native CLI/simple
filesystem lifecycle remain allowed. No release/merge/push/publication/remote
CI/licence or dependency action. Routine in-scope defects are corrected
autonomously; surface a genuinely unresolved contract/evidence choice to root.

Return clean source commit/tree/exact paths and no owned jobs, proposed-done
only, for separate Sol acceptance. Root alone stages planning. B2-DISCARD-P
stays open until that review; native759 acceptance and all parent/raw discard/
annotation/name/owner/check/DTS/API/docs/book/human/LC02–08/B2b/S03 gates remain.
