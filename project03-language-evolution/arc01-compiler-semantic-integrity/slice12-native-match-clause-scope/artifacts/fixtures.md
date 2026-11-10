# Frozen shared clause-scope fixtures

Use these exact UTF-8 files with trailing LF. Add both as separate
native tests in the existing semantic-role runner and as two public
steps in its existing parent. Their final population is native 17
tests, public one parent and 16 steps.

## F1 — match-clause-scope.lykn

```lykn
(bind trace (array))
(func plus-ten :args (:any n) :returns :any :body (+ n 10))
(match plus-ten
  (match :when (do (trace:push (match 1)) false)
    (trace:push "wrong"))
  (_
    (match 2
      (1 (trace:push "wrong-inner"))
      (_ (trace:push 22)))))
(do
  (bind match (fn (:any a :any b) (+ a b)))
  (trace:push (match 3 (plus-ten 1))))
(console:log (JSON:stringify trace))
```

Final exact stdout `[11,22,14]\n`. The first guard calls its own
`match` binding. A genuine nested match in its sibling stays syntax.
The final local function call remains ordinary, with a clause-shaped
second operand. The accepted old native production is predicted to
emit an ordinary call in the second clause and fail its strict runtime.
Record the actual phase/error. Public is expected to pass unchanged.

## F2 — match-structural-pattern-macros.lykn

```lykn
(macro obj (key binder) `0)
(macro clause-guard (value) `(= ,value 7))
(macro clause-push (value) `(trace:push ,value))
(bind trace (array))
(match (kernel:object (key 7))
  ((obj :key n) :when (clause-guard n) (clause-push n))
  (_ (trace:push "fallback")))
(console:log (JSON:stringify trace))
```

Final exact stdout `[7]\n`. Native old Pass2 is predicted to
run the `obj` macro in the pattern, leaving a literal 0 candidate
and printing `["fallback"]\n`. This is an actual macro-bearing
compiler route. The guard and body are executable macro uses and
must still expand. Public is expected to pass unchanged. Review
the complete modules, actual command and strict runtime evidence.
Both final natives require actual check/strict compile success, no
DTS and exact runtime exit 0 with empty stderr. Public strict
runtime has the same stdout and exit/stderr oracle.
