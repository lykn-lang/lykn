# Finding E — Empirical Disconfirmation of M7 / DD-50.6 Closure

**Date:** 2026-05-12
**Thread:** cdc/dep-ergonomics (branch `cdc/dep-ergonomics` @ f9b647a, scoped from `release/0.6.x`)
**Tested binary:** lykn built fresh from `release/0.6.x` @ e670088 (HEAD as of 2026-05-12)
**Test corpus:** mycelium's `packages/mycl-html/render.lykn` (the canonical downstream)
**Reproducible via:** `workbench/verify-finding-e-2026-05-12.sh`

## The empirical result

DD-50 (closed 2026-05-10 in M7) + DD-50.5 + addendum + DD-50.6 (closed 2026-05-11) collectively asserted that the conditional / block forms emission is structurally correct on both compilers. Built fresh from current `release/0.6.x` HEAD (`e670088`), the Rust compiler produces **syntactically invalid JS** for the canonical downstream's source.

`deno check` verdict on `lykn compile`'s output of mycelium's `render.lykn`:

```
error: The module's source code could not be parsed: Expression expected
at file:///.../render.js:27:77

  ... undefined : (() => if (typeof value === "string" || typeof value === "number") ...
                         ~~
```

## Two distinct bug clusters in the output

### Cluster 1 — IIFE wrapping for nested-if-with-statement-branches (line 27)

The render-attrs source pattern:

```lykn
(for-of (array name value) (Object:entries attrs)
  (validate-attr-name name)
  (if (= value true)
    (swap! parts ...)
    (if (or (= value false) (js:eq value null))
      undefined
      (if (or (= (js:typeof value) "string") (= (js:typeof value) "number"))
        (swap! parts ...)
        (throw (new Error ...))))))
```

Compiled to:

```js
value === true ? parts.value = (...)(parts.value)
  : value === false || value == null
  ? undefined
  : (() => if (typeof value === "string" || typeof value === "number") {
      return parts.value = (...)(parts.value);
    } else {
      return throw new Error(...);
      ;
    }
    )();
```

Three concrete bugs in those few lines:

- **E.1.** `(() => if (...) {...} else {...})()` — arrow body is a bare `if` statement, not an expression and not a `{...}` block. Invalid JS.
- **E.2.** `return throw new Error(...)` — `throw` is a statement; can't be the target of `return`.
- **E.3.** Stray `;\n      ;` after else block close.

### Cluster 2 — Rule 2 firing on a statement-position no-else `if` (line 73)

The render-element source pattern:

```lykn
(func render-element
  :args (:array el)
  :returns :string
  :body
  ...
  (if (is-void-element tag)
    (block
      (if (> children:length 0)
        (throw (new Error ...)))
      (return (template "<" tag attrs-str ">"))))
  (bind mapped ...)
  ...)
```

The outer `(if (is-void-element tag) (block ...))` is in the *middle* of the func body — statement position, no surrounding expression context. Per DD-50, statement-position no-else `if` is valid JS as `if (cond) statement;`. Per DD-50 Rule 2, *expression-position* no-else `if` requires an else branch (compile error via runtime throw stand-in).

Emitted JS:

```js
if (isVoidElement(tag)) {
  throw new TypeError("COMPILE_ERROR: if in expression position requires an else branch — add an else branch, or restructure as a statement");
  return `<${tag}${attrsStr}>`;
}
```

The compiler classified this `if` as expression-position and fired the Rule 2 throw — then helpfully emitted the user's intended `return` after the throw. The classification is wrong; this is statement position.

## What this disconfirms

The M7 closing report (2026-05-10) row M7-3 asserts DD-50.5 + addendum work landed "exhaustive site audit on both compilers: JS 7 → 64 expression calls; Rust kernel-form fallthrough sets Value for non-head children; `if_to_ternary` deleted and replaced by `convert_to_expression` unified path", and the M7 cross-DD consistency check claims:

> "DD-50 ensures every `if`-in-expression-position emits valid JS (ternary or IIFE per branch classification) or fires a compile error (Rule 2 — runtime-throw stand-in, replacement is a logged fast-follow). DD-50.5 ensures statement-bodied kernel forms preserve their body children's Statement context, so `(while cond (if c (throw e)))` remains valid JS rather than triggering a Rule 2 compile error inappropriately. **Compliance: full.** Both compilers produce valid JS for every pattern the test suite exercises."

The last sentence is the operative qualifier: *"every pattern the test suite exercises."* Test suite synthetic patterns ≠ canonical downstream patterns. Empirically, the test suite did not exercise these two real-world shapes.

The compiler-coherence thread's kickoff (`workbench/kickoff-thread-compiler-architecture-coherence.md`) inherits this assumption:

> "DD-50: position-aware compilation of conditional/block forms (both compilers structurally aligned; remaining surface forms route through KernelPassthrough which now correctly recurses)."

That premise is now empirically false for at least these two patterns.

## Methodology pattern (for Phase 2 retrospective)

Two related discipline gaps surface here:

1. **Closure-without-empirical-validation.** Milestones M7 + DD-50.5 + DD-50.6 closed against synthetic `compileBoth` test patterns. M4 (the explicit "empirical validation against a real downstream consumer" milestone) was deferred to the end of Phase 2. The two together created a window where milestones could declare closure on bugs that would have been caught by M4 if M4 had been a prerequisite.

2. **Acceptance-test fidelity.** The M9-release acceptance test (`m9r-downstream: placeholder test ... 1 passed | 0 failed`) was `(is-equal (+ 1 1) 2)` — too small a JS surface to exercise the bugs that the V-08 fix's broader changes might have introduced or left in place. Two findings in this thread (Finding D earlier, Finding E now) trace back to that test being too thin.

Discipline fix candidate for LEDGER_DISCIPLINE.md or a fresh methodology doc: *milestones touching compiler emission MUST include an acceptance test that compiles at least one non-trivial real downstream source file and runs the compiler-output through `deno check` (or equivalent syntactic validator).* The synthetic `compileBoth` tests are useful for regression coverage but insufficient for closure.

## Priority implications for 0.6.0 ship

The current Phase 2 plan has M15 (0.6.0 release) blocked on M10–M14. If 0.6.0 ships with the two bug clusters above, every downstream consumer using nested-`if`-with-statement-branches *or* no-else-`if`-in-middle-of-body will hit invalid JS. These patterns are common in renderers, parsers, serializers, and validators — exactly the application surface lykn targets.

Reading literally: **0.6.0 cannot ship until these clusters are fixed.** Either:

- (a) Fix in a new DD (DD-50.7 or whatever name) before 0.6.0 ship.
- (b) Document as known issues in 0.6.0 release notes with workarounds, ship anyway.
- (c) Delay 0.6.0; ship 0.5.3 patch addressing these clusters; sequence 0.6.0 after.

Per CLAUDE.md "Lykn CLI safety gates" reasoning style, option (b) feels like the same pattern as silently weakening underlying tool safety — shipping known-broken emission as "known issue" violates Principle 3 (compiler-owned output quality). The principle says compiler bugs in compiled JS are language-level bugs, not user-facing issues; documenting them as user-side workarounds is the inverse of that.

## Routing recommendation

The DISCOVERY is appropriate for this thread (dep-ergonomics is the thread that ran the empirical test against canonical downstream).

The FIX should be routed to one of:

- **compiler-coherence thread** (currently chartered around structural alignment; can absorb this as a scope addition). Pro: existing compiler-internals context. Con: scope creep beyond its charter.
- **A fresh DD-50.7 thread** (purpose-built for this fix). Pro: clean scope. Con: yet another thread, more coordination.
- **An amendment-to-M7 + DD-50.6 thread.** Pro: reopens the closure cleanly. Con: amendments at this distance from the original closure are unusual.

My weak lean: **compiler-coherence**, expanded scope. Its kickoff already names DD-50 territory; it has the structural-alignment lens that matches what these bugs need. The "audit + DDs" framing in its kickoff would naturally produce a DD-50.7-equivalent as one of its outputs.

But this is a routing call only Duncan can make.

## What this thread does NOT propose to do

- Draft the fix DD. Compiler-coherence (or whichever thread Duncan routes to) is positioned to do that better.
- Block on the fix. Other dep-ergonomics scope items (M10 .d.ts, surface-macros gap, Finding D exports field) can proceed independently of the fix landing — they're orthogonal to the DD-50 emission gap.
- Reopen M7 ledger formally. That's Duncan's protocol call to make.

## Open inputs needed from Duncan

1. **Routing.** Which thread absorbs the fix? compiler-coherence, fresh DD-50.7, M7 amendment, or other?
2. **Ship-readiness call for 0.6.0.** (a) fix before ship, (b) document + ship, or (c) sequence 0.5.3 first?
3. **Empirical-validation-as-gate methodology fix.** Worth folding into LEDGER_DISCIPLINE or treated as a Phase 2 retrospective output?

## What I plan to do regardless

- Stand by on this thread for next moves once routed.
- Begin parallel work on the remaining dep-ergonomics scope (Finding D writeup as input to bootstrap-issue-#9's GitHub ticket; surface-macros gap DD draft; M10 design questions) — none of these block on Finding E fix.
