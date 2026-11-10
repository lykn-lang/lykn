# Exact direct bind proof cases

Add the following five separate files under
`test/fixtures/semantic-roles/`, with final LF. F1–F4 run
through both existing runners. F5 is native only. Every
current runtime exits 0, stdout is exact JSON plus LF, stderr
empty, and native DTS absent. Preserve old fixture/runner tests.

## F1 — bind-consumed-early-return.lykn

```lykn
(bind trace (array))
(func choose-bound :args (:any flag) :returns :any :body
  (bind answer
    (do
      (if flag (return "early"))
      (trace:push "body")
      7))
  (trace:push "after")
  answer)
(console:log (JSON:stringify (array (choose-bound true) (choose-bound false) trace)))
```

Expected `["early",7,["body","after"]]`. Old initializer
IIFE can pass the early value back to its local bind and still
execute the first after effect. Record actual old trace. New
early return skips actual source const and following effect.
Normal path retains lexical const and exact ordering.

## F2 — bind-consumed-group-match.lykn

```lykn
(bind trace (array))
(func choose-binding :args (:any flag) :returns :any :body
  (bind first (match flag
                (true (return 81))
                (_ (do (trace:push "match") 7)))
        second (if false (do (trace:push "wrong") 0) (+ first 1)))
  (trace:push second)
  second)
(console:log (JSON:stringify (array (choose-binding true) (choose-binding false) trace)))
```

Expected `[81,8,["match",8]]`. Old native can fail from
nested return syntax. Old public can continue from the local
match return and execute later bindings. Exact old condition
is measured. New second bind sees first only on normal
continuation. Untaken branch has no effects.

## F3 — bind-consumed-loop-transfer.lykn

```lykn
(bind trace (array))
(func bind-loop :returns :any :body
  (for (let i 0) (< i 4) (++ i)
    (bind value
      (do
        (if (= i 1) (continue))
        (if (= i 3) (break))
        i))
    (trace:push value))
  trace)
(console:log (JSON:stringify (bind-loop)))
```

Expected `[0,2]`. Old value do can produce illegal loop
transfers under an IIFE. New continue reaches the original
update and break exits its actual loop.

## F4 — bind-consumed-name-hygiene.lykn

```lykn
(macro s15-read-later () `completionValue__gensym0!:value)
(macro s15-read-external () `completionValue__gensym1:value)
(bind completionValue__gensym1 (obj :value 41))
(bind trace (array))
(func hygienic-bind :returns :any :body
  (bind answer (do (trace:push "result") 7))
  (bind completionValue__gensym0! (obj :value 99))
  (array answer (s15-read-later) (s15-read-external)))
(console:log (JSON:stringify (array (hygienic-bind) trace)))
```

Expected `[[7,99,41],["result"]]`. Old may pass through
an IIFE. New lexical result temp exists and must avoid both
normalized spellings `completionValue__gensym0` and
`completionValue__gensym1`. Complete module proves it did
not capture the macro-emitted colon references, even though
the local binder follows the initializer.

## F5 — bind-consumed-native-typed.lykn

```lykn
(bind trace (array))
(func typed-pick :args (:any flag) :returns :any :body
  (bind :number x (do (if flag (return "early")) 9))
  (trace:push x)
  x)
(console:log (JSON:stringify (array (typed-pick true) (typed-pick false) trace)))
```

Expected `["early",9,[9]]`. Native old can produce a local
return of a string then throw its existing type guard.
New early path exits before the check. Normal initialization
keeps the original named const and runtime number check.
This does not extend the public typed-bind support claim.
