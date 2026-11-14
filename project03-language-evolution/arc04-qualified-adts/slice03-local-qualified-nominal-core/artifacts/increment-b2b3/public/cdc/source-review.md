# Committed source review —dba24d40

Source home/branch/pin/tree are recorded in README.md and final/pin.txt.
Only B2-DISCARD-P is under review; native production is unchanged from759.

## R01 — HOLD: legacy catch default-left validation regresses

Current binding.js188 passes PatternGrammar.CATCH_BINDING to
walkPatternDefaults. At280, recursion into a default's LEFT binding pattern
still requires grammar===PatternGrammar.BINDING_PATTERN. The old759 catch
caller used BINDING_PATTERN, so that recursive path was previously taken.
The new separate mode was intended to isolate only new spread and required-
default-RHS projection behavior; it now also drops an existing executable
nested default validation region. The root atom/private filters do not repair
that missed traversal. Canonical and embedded copies share the defect.

Bounded supported source positive, `catch-default/positive-kernel.lykn`:

```lisp
(try (throw (array (array)))
  (catch (array (default (array (default value (=> (input) 1))) (array)))
    (console:log (value 7))))
```

Actual public lykn generates `catch ([[value = input => 1] = []])`; real ESM
runs0 and prints1. Change ONLY input→eval (`reserved-kernel.lykn`): public
lykn succeeds in the helper (negativeCompiled true), generates
`catch ([[value = eval => 1] = []])`, then actual ESM runs1 with
`SyntaxError: Unexpected eval or arguments in strict mode`. The source function
parameter must be rejected by existing D2 before emitting illegal JS. Current
native check independently rejects the same eval parameter with its normal
strict-binding diagnostic. It accepts the positive fixture0, establishing a
balanced one-expression source before any public parse invocation.

Root/root source causal comparison: immutable759 binding.js is preserved as
`catch-default/binding-before.js` and exact caller/walker extracts. That old
caller enters the nested-left recursion, which reaches the raw arrow parameter
through the existing kernel binding walk. This is SOURCE-inspected before/after
causality, not a falsely claimed old public-runtime replay. No old compiler or
alternate source checkout was executed. Current helper and generated ESM pair
are actual runtime evidence. Catch grammar is unchanged by the witness: the
existing raw arrow compiles directly; no new typed catch parameter lowering.

Minimal bounded recommendation for root: preserve the old default-left walk
for CATCH_BINDING as well as BINDING_PATTERN (keep TypedParameter's existing
consumed slots), while continuing to exclude catch from the NEW canonical
spread/required-RHS behavior. Add the valid raw-arrow catch pair to ordinary
product regression coverage. Do not fix source fn parameter expansion, catch
grammar, reader, or annotation semantics as part of this correction. Reviewer
made no source edit and does not select final implementation mechanics.

First attempted source-fn pair is retained separately as positive.lykn /
reserved.lykn plus prepare.mjs outputs. Public catch intentionally does not
expand its parameter (expander-core1176), leaving source fn raw in generated
output. That variant was NOT executed as the positive witness and is not used
to claim a new regression. The corrected raw-arrow files are separate; no
original receipt/source was overwritten. Neither source has an unmatched close;
native check completed both before public helper execution.

## Other bounded source review

- surface-helpers265–445 prepares private actual/pattern/check records; the same
  atom reaches binder, predicate and dynamic typeof. Rest collections and
  private elements are separate; array p.rest now uses per-element checks.
  Object `_` default uses alias with a nested default pattern; actual runtime
  supplement proves key/default/check and source99 semantics. Prepared-record
  object spread does not copy the identity-bearing atom. Original schema/type
  emitter stays separate and its public four-argument buildTypeCheck API stays.
- classifier664/773/837/1006/1230 cover Fn/Lambda, Genfn, single/multi Func and
  Genfunc once. Simple multi uses prepared actual and existing top-simple
  default/rest limit; nested patterns use prepared pattern/checks. Removed split
  helper caller census is complete. Non-any nested selector annotations remain
  a known separate limit. Ordinary rest diagnostic now names source collection.
- classifier443 typed Bind returns ordinary const/check siblings for nonliteral
  values. Static any/matching literals retain previous rules and malformed typed
  non-atom rejection. Source BindGroup uses shared source projector, not old
  incorrect duplicate walker. No user block flattening is introduced.
- expander-core1825 admits direct discard; prepared const name survives fast
  and transfer paths with independent completion destination; initializer once.
 2148 Source export branch is after actual user-macro redispatch and before
  generic Single Value handling, checks actual bound/tagged/kernel child,
  preserves public extra-arity rejection and appends only source names. Current
  runtime supplement proves typed discard, nested aliases and exact namespace.
- binding676/860 metadata-filters direct private parameter and nested pattern
  atoms. Existing WeakMap/count/finalizer/clone lifecycle remains unchanged;
  no prefix or fake field grants private authority. Actual source macro prefix
  and same-spelling source binding tests run in focused187. New spread traversal
  of executable defaults and actual lexical array-call/reserved/duplicate tests
  are present; the catch mode interaction above is the confirmed exception.
- compiler1968/2018/2130 routes only pattern spread through RestElement; value
  spread remains expression and catch param still compileExpr1114. Object alias
  key2097 preserves literal/string bytes and keyword normalization; numeric keys
  use computed constants (including negative) so the astring negative-literal
  output is legal. Assignment direct colon and nested get-list routes stay.
- Exact five canonical/embedded pairs compare equal. Only two old underscore
  spelling assertions migrated, runtime30 retained. M6 adds new mapped7 to55,
  source assertion62/14 correct. No M6 execution/acceptance is claimed here
  because R01 stopped the review before full gate.

No second concrete product defect found within this bounded source review.
The seven green groups are retained as useful focused evidence, not acceptance.

## Draft22 source-readiness —2026-11-13 —SOURCE-READY

This section was appended AFTER the frozen independent HOLD archive
`receipts-dba24d40-hold.tar.gz` (SHA256
fe8598a9ac2f16db2ce824e231559207ce571a4fe15e0f0bd14a25f48a16bc4c).
It is not part of those frozen bytes and does not replace the R01 source verdict
or any original receipt. No source pin change, build or test occurred.

Read the COMPLETE unissued cc-prompt-iteration22.md through EOF and reread the
actual catch→walkPatternDefaults→default-left→raw-arrow kernelParamNames→
validateReservedNames chain at dba24d40. The proposed existing `typed` guard
(`if (!typed)`) restores old left traversal for both BindingPattern and
CatchBinding, while preserving TypedParameter's previous slot behavior.
Canonical-only spread and required-default-RHS projection remain guarded
separately; catch callers retain CATCH_BINDING. No new catch grammar, typed
source-fn expansion or private/name/annotation semantics are introduced.

Exact THREE paths are coherent: canonical binding.js, identical embedded copy,
and the existing product test. The exact raw-arrow positive must actually run1
with process0/empty stderr through public and mapped browser ESM. Input→eval
and input→arguments are compile-time strict-binding negatives in both facades,
not expected late SyntaxErrors. The current source predicate supplies exactly
those diagnostic substrings. Existing seven groups and M6 actual62/14 remain;
typed/default/spread/legacy catch regressions and full/citation/fresh size gates
are explicitly retained rather than borrowing the held candidate's CC full.

No material contradiction remains. Root may issue22 under existing authority;
this is SOURCE readiness only. Reviewer has not authored implementation or run
new checks. Root retains source/build/design/Git/index/ledger until actual
handoff; no reviewer job. Corrected clean candidate still needs independent
software validation before B2-DISCARD-P acceptance. All broader limits remain.
