# S02 source refinement 02 — correct the exact proof and request cases

Continue standard Autonomous Mode under [original scope](cc-prompt.md) from
clean `27eeef048e09084fd2ced92fe4c704c852deefd8`. Prior candidate and
ordinary failed -F path attempt are preserved. No build, formatter or test
ran. Use only normal exact-path Git. Fixed -F body:
`/private/tmp/lykn-s02-cdc.gadeVma9/s02-refinement02-source-message.txt`.

## Narrow source fixes

- JS adapter currently deduplicates by operation ID, so two valid distinct
  ReflectApply nodes erroneously fail. Check duplicate anchor identity only.
  Keep the actual opaque operation ID and validate all three stable atom
  operands before marking, with the same no-empty/colon/this/super/literal
  checks as native and undefined only for receiver. Add a two-distinct-anchor
  positive and same-anchor negative. Retain whole-unit cleanup. A private
  finalized flag is set only after resolving all actual generated call nodes
  and injecting the helper. Returning from a callback that consumed nodes
  without finalizing must fail rather than return provisional output. Keep mirrors
  exact. Native validation must also reject empty/this (the current predicate
  omits them). A failed operand must never execute a getter or nested expression.
- Native direct wrapper query must unwrap actual async function declarations
  inside exported declarations too. Reuse actual emitted roles. Add focused
  native/public controls for direct Reflect!, local import alias, named and
  default export, exported async function and block-hoisted var. Add legal
  external import/export name and nested scope countercontrols. Preserve
  old no-request path and S01 policy checks.
- Native plan holds a single helper name, not a separately cloned name in
  every anchor. Keep one map address→consumed state or equivalent. Preserve
  exact repeat/unconsumed checks. This is local and no interface change.

## Exact input corrections

Existing frozen live and retained inputs do not match the original approved
oracles. Replace only those three fixture bodies with this Lykn kernel.
The other three fixture sources and all original expected behavior remain.

**provider.lisp**
```lykn
"use strict"
(console:log "provider")
(const marker "provider")
(function invoke (saved receiver argv Reflect! globalThis lykn-host-reflect-apply0)
  (const result (saved receiver argv))
  (return (array result Reflect!:id globalThis:id lykn-host-reflect-apply0
    (typeof lyknHostReflectApply1) receiver:Reflect)))
(export (names invoke marker))
```

**live-entry.lisp**
```lykn
(import "./provider.js" (invoke))
(function run (mode)
  (const events (array))
  (const original (lambda (a b)
    (events:push "call")
    (return (array this:id a b))))
  (const receiver (object (id "receiver") (Reflect "property")))
  (Object:defineProperty receiver "method" (object
    (get (lambda ()
      (events:push "get")
      (if (=== mode "getter") (throw (new Error "getter")))
      (return original)))
    (configurable true)))
  (const replacement (lambda () (throw (new Error "replacement"))))
  (= original:call (lambda () (throw (new Error "call touched"))))
  (= original:apply (lambda () (throw (new Error "apply touched"))))
  (const iter (function* ()
    (events:push "spread")
    (yield 7)))
  (function update ()
    (events:push "arg")
    (if (=== mode "arg") (throw (new Error "arg")))
    (Object:defineProperty receiver "method" (object (value replacement)))
    (return 8))
  (try
    (const result (invoke (get receiver "method") receiver
      (array (spread (iter)) (update))
      (object (id "localReflect")) (object (id "localGlobal")) 3))
    (return (array events (spread result)))
    (catch error (return (array events error:message)))))
(console:log (JSON:stringify (run "live")))
(console:log (JSON:stringify (run "getter")))
(console:log (JSON:stringify (run "arg")))
```

**retained-observer.lisp**
```lykn
(let reads 0)
(const original Reflect:apply)
(Object:defineProperty Reflect "apply" (object
  (get (lambda ()
    (+= reads 1)
    (return original)))
  (configurable true)))
(await (dynamic-import "./retained.js"))
(console:log reads)
(const deliberate Reflect:apply)
(console:log reads)
```

The expected original live and retained results are unchanged. The requested
provider now reserves candidate 0 and free candidate 1 so check helper 2.
The no-request provider may still contain the user names 0 and 1. Assert
absence of the helper declaration/body and ordinary direct call rather than
absence of their shared textual prefix. Keep normal/temporary evidence
locations hygienic, absolute, and precreated before dependent invocations.
JS fixture paths should use the normal repository cwd convention. Compile
real shared fixture inputs and preserve complete output. Run actual
format/build/focused cases promptly after the new immutable static release.
No renaming policy, new prototype dependency, helper script or trial family.
