# Exact ordered lexical call cases

Place two new files in `test/fixtures/semantic-roles/`. Use the
existing native and public strict runtime fixtures, final LF and no
stderr. Native JS present and DTS absent. All expected JSON has one LF.

## F1 — ordered-lexical-bind-call.lykn

```lykn
(bind trace (array))
(func original-call :args (:any earlier :any middle :any later) :returns :any :body
  (trace:push "old")
  (array "old" middle))
(func replacement-call :args (:any earlier :any middle :any later) :returns :any :body
  (trace:push "new")
  (array "new" middle))
(func use-lexical-call :args (:any callable :any stop) :returns :any :body
  (bind answer
    (callable
      (trace:push "earlier")
      (do
        (trace:push "middle")
        (kernel:= callable replacement-call)
        (if stop (return 91))
        8)
      (trace:push "later")))
  (trace:push "after")
  answer)
(console:log (JSON:stringify
  (array (use-lexical-call original-call true) (use-lexical-call original-call false) trace)))
```

Expected `[91,["old",8],["earlier","middle","earlier","middle","later","old","after"]]`.
This deliberate kernel assignment changes a JavaScript parameter binding
for a compiler order regression. Surface user mutation guidance remains
cell-based. The callable must already be saved when the argument changes
the binding. Old output can let the local return become an argument and
continue. The normal run still calls the saved original.

## F2 — ordered-lexical-statement-call.lykn

```lykn
(bind trace (array))
(func observe-call :args (:any earlier :any middle) :returns :any :body
  (trace:push middle))
(func use-statement-call :args (:any and :any stop) :returns :any :body
  (and (trace:push "first")
       (do (trace:push "middle") (if stop (return 90)) 4))
  (trace:push "after")
  91)
(bind early (use-statement-call observe-call true))
(bind normal (use-statement-call observe-call false))
(try
  (use-statement-call 0 false)
  (catch problem (trace:push (instanceof problem TypeError))))
(console:log (JSON:stringify (array early normal trace)))
```

Expected `[90,91,["first","middle","first","middle",4,"after","first","middle",true]]`.
The real lexical `and` is a call. A function-local return from the
argument skips the target and after effect. For the noncallable value,
both arguments run before the native JavaScript TypeError. Keep prior
ordinary pure and genuine surface and/or controls.

## F3 — checked mixed spread hold

In the existing negative tests use this same inline input with final LF:

```lykn
(func mixed-spread :args (:any callable :any items) :returns :any :body
  (callable (spread items) (do (return 7) 8)))
```

Expect exact diagnostic message
`ordered lexical call with spread and lifted arguments is not supported`.
Native strict compile exits 1, no JS or DTS, using the existing checked
emitter error and real source span of the call. Public `lykn` throws Error
with that exact message. Old source is predicted to compile with a
transport wrapper, so the test is expected red on the old source.
Observe its actual compile and emitted file effects without execution.
Plain spread without a lifted prefix stays on its original path.
