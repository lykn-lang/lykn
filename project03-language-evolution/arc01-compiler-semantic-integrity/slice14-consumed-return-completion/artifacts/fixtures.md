# Exact consumed return proof cases

Add these four separate files under `test/fixtures/semantic-roles/`,
with their final LF. Use the existing native runner and public
semantic-role parent. Runtime comparisons are exact JSON plus LF,
empty stderr and exit 0. Both original check/compile effects and
generated modules remain visible. All fixtures are unexported
programs and native DTS must be absent.

## F1 — return-consumed-match.lykn

```lykn
(bind trace (array))
(func read-value :args (:any input) :returns :any :body
  (return
    (match (do (trace:push "subject") input)
      (_ :when (do (trace:push "guard") false) (return "wrong"))
      (1 "normal")
      (_ (return "inside")))))
(console:log (JSON:stringify (array (read-value 0) (read-value 1) trace)))
```

Expected `["inside","normal",["subject","guard","subject","guard"]]`.
Native old lowering
unconditionally wraps the explicit clause tail in another return.
Expect native failed JS execution or compile rather than a successful
exact oracle. Public old may already return this value, so retain its
actual status. New match is lexical with one subject, actual guard
and enclosing source return. The transfer-free subject and guard
may retain their ordinary local value adapters.

## F2 — return-consumed-loop.lykn

```lykn
(bind trace (array))
(func iterate :returns :any :body
  (for (let i 0) (< i 4) (++ i)
    (return
      (do
        (if (= i 0) (continue))
        (if (= i 2) (break))
        (trace:push i)
        (if (= i 1) (do (trace:push "skip") (continue)) "wrong"))))
  "done")
(console:log (JSON:stringify (array (iterate) trace)))
```

Expected `["done",[1,"skip"]]`. Old consumed do introduces
a function boundary around loop transfers. It cannot reach the
loop and is expected to fail generated JS execution. Inspect
actual phase and bytes, preserve them. Current loop visits
update after continue, then break, and reaches the real function tail.

## F3 — return-consumed-guard-exhaustion.lykn

```lykn
(bind trace (array))
(func exhausted :returns :any :body
  (match 0 (_ :when (do (trace:push "guard") false) 1)))
(try
  (trace:push (exhausted))
  (catch e (trace:push e:message)))
(console:log (JSON:stringify trace))
```

Expected `["guard","match: no matching pattern"]`. Native old
may pass because its value-match correctly handles guarded-final
exhaustion. Public old considers the guarded final wildcard
terminal and is expected to produce `["guard",null]`. Current
generated path must preserve actual error and catch behavior.

## F4 — return-consumed-macro-boundaries.lykn

```lykn
(macro i2-return-body () `(do (return "inside") "wrong"))
(bind trace (array))
(func choose :returns :any :body
  (bind nested (fn () (return "nested") "wrong-inner"))
  (trace:push (nested))
  (if true (i2-return-body) (do (trace:push "wrong-else") "not-chosen")))
(console:log (JSON:stringify (array (choose) trace)))
```

Expected `["inside",["nested"]]`. A prior compiler may pass the
trace but still use an IIFE at the consumed outer branch. The
current complete module must show the macro-generated source return
in the enclosing named function and a distinct nested function
with its own return. Preserve the existing simple ternary control.
