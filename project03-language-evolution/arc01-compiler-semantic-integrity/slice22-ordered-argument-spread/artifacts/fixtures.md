# Exact ordered spread fixture population

```lykn
(bind trace (array))
(bind iteration-error (new Error "iteration"))
(genfunc produce-items :args (:any fail) :yields :any :body
  (trace:push "next0")
  (yield 1)
  (trace:push "next1")
  (if fail (throw iteration-error))
  (yield 2)
  (trace:push "done"))
(func make-items :args (:any fail) :returns :any :body
  (bind iterable (obj))
  (Object:defineProperty iterable Symbol:iterator
    (obj :value (fn () (trace:push "iterator") (produce-items fail))))
  iterable)
(func lexical-target :args (:any a :any b :any c :any d) :returns :any :body
  (trace:push "lexical")
  (array a b c d))
(func invoke-lexical :args (:any target :any fail :any stop) :returns :any :body
  (target (do (trace:push "before") 0)
          (spread (make-items fail))
          (do (trace:push "late") (if stop (return 7)) 3)))
(func method-target :args (:any a :any b :any c :any d) :returns :any :body
  (trace:push (array "method" this:marker))
  (array a b c d))
(func make-receiver :returns :any :body
  (bind receiver (obj :marker "receiver"))
  (Object:defineProperty receiver "run"
    (obj :get (fn () (trace:push "getter") method-target)))
  receiver)
(func invoke-static :args (:any receiver) :returns :any :body
  (receiver:run (do (trace:push "before") 0)
                (spread (make-items false))
                (do (trace:push "late") 3)))
(func invoke-computed :args (:any receiver) :returns :any :body
  ((get receiver (do (trace:push "key") "run"))
   (do (trace:push "before") 0)
   (kernel:spread (do (trace:push "operand") (make-items false)))
   (do (trace:push "late") 3)))
(func mixed-computed-spread :args (:any receiver :any items) :returns :any :body
  ((get receiver (do (return 7) "method")) (spread items)))
(func observe-failure :returns :any :body
  (try (return (invoke-lexical lexical-target true false))
       (catch problem (return (array (= problem iteration-error))))))
(bind normal (invoke-lexical lexical-target false false))
(bind early (invoke-lexical lexical-target false true))
(bind failed (observe-failure))
(bind static-result (invoke-static (make-receiver)))
(bind computed-result (invoke-computed (make-receiver)))
(bind header-return (mixed-computed-spread (make-receiver) (make-items false)))
(console:log (JSON:stringify
  (array normal early failed static-result computed-result header-return trace)))
```

Exact current expected stdout plus LF, no stderr:

```json
[[0,1,2,3],7,[true],[0,1,2,3],[0,1,2,3],7,["before","iterator","next0","next1","done","late","lexical","before","iterator","next0","next1","done","late","before","iterator","next0","next1","getter","before","iterator","next0","next1","done","late",["method","receiver"],"key","getter","before","operand","iterator","next0","next1","done","late",["method","receiver"]]]
```

their original early-return branches.

F1 is `test/fixtures/semantic-roles/ordered-argument-spread.lykn`.
The header-return case has the exact old computed function source.
It returns before getter/iteration. Iterator failure keeps exact
error identity and skips later argument/call. Preserve full runtime
outputs and native kernel JSON. Native DTS absent.

## F2 — pure-argument-spread.lykn

```lykn
(func collect-three :args (:any a :any b :any c) :returns :any :body
  (array a b c))
(func invoke-plain :args (:any callee :any items) :returns :any :body
  (callee (spread items) 3))
(console:log (JSON:stringify (invoke-plain collect-three (array 1 2))))
```

Strict stdout `[1,2,3]\n` and empty stderr. Entire old/current JS
and native kernel stay byte-identical by backend. Actual ordinary
spread syntax and no ReflectApply provider. Native DTS absent.

## F3 — malformed actual spread, compile only

```lykn
(func malformed-spread :args (:any target) :returns :any :body
  (target (spread)))
```

Selected native compiler exits 1 with no JS/DTS and precise source
target `2:11: error: spread takes exactly one argument`. Public
returns Error with exact same text and no module. Preserve actual
old outcome separately. Old native writer may compile invalid text.
No output is executed. Bound `spread` is an ordinary call.

## Existing exact hold transitions

Keep all three existing standalone tests in both runners and keep
their exact input bytes with final LF. Update the assertions and
test names to current actual accepted complete output and native
DTS absence, retaining preassert source/result evidence on old
rejection. The direct static and lexical cases show their actual
for-of before the source return in complete generated JS. The
computed-only-header case shows ordinary `[key](...items)` with
no local/inline ReflectApply provider. Do not assert incidental
private suffixes. The new F1 executes matching real routes.
