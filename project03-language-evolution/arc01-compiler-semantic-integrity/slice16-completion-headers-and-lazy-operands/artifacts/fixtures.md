# Exact I2 header and lazy result cases

Four shared new fixtures in the existing semantic-role runner. Each
fixture has a final LF. The exact output below includes LF and no stderr.
The native route must check and strict compile successfully, preserve no
DTS for these unexported fixtures, and run the actual generated module.
Keep the entire S15 population unchanged.

## H1 — completion-if-headers.lykn

```lykn
(bind trace (array))
(func choose-header :args (:any mode) :returns :any :body
  (if (do
        (trace:push "statement")
        (if (= mode 0) (return 80))
        false)
    (trace:push "wrong"))
  (bind result
    (if (do
          (trace:push "value")
          (if (= mode 1) (return 81))
          (= mode 2))
      (do (trace:push "then") 7)
      (do (trace:push "else") 8)))
  (trace:push "after")
  result)
(console:log (JSON:stringify
  (array (choose-header 0) (choose-header 1) (choose-header 2) (choose-header 3) trace)))
```

Expected `[80,81,7,8,["statement","statement","value","statement","value","then","after","statement","value","else","after"]]`.
The first return skips arm selection in a discarded conditional. The
second skips the bind and following effect in a consumed conditional.
The normal paths evaluate each test once and select one lexical arm.
Old local-return wrappers can continue into the wrong arm and effects.
Retain the actual old trace.

## H2 — completion-match-headers.lykn

```lykn
(bind trace (array))
(func choose-match-header :args (:any mode) :returns :any :body
  (match (do
           (trace:push "discarded")
           (if (= mode 0) (return 80))
           3)
    (seen :when (do
                  (trace:push seen)
                  (if (= mode 1) (return 81))
                  false)
      (trace:push "wrong"))
    (_ (trace:push "discarded-fallback")))
  (return
    (match (do
             (trace:push "consumed")
             (if (= mode 2) (return 82))
             4)
      (seen :when (do
                    (trace:push seen)
                    (if (= mode 3) (return 83))
                    false)
        (do (trace:push "wrong") 90))
      (_ (do (trace:push "consumed-fallback") 84)))))
(console:log (JSON:stringify
  (array (choose-match-header 0) (choose-match-header 1)
    (choose-match-header 2) (choose-match-header 3) (choose-match-header 4) trace)))
```

Expected `[80,81,82,83,84,["discarded","discarded",3,"discarded",3,"discarded-fallback","consumed","discarded",3,"discarded-fallback","consumed",4,"discarded",3,"discarded-fallback","consumed",4,"consumed-fallback"]]`.
Subject transfer skips candidate dispatch. Guard transfer follows its
actual clause binding and skips later clauses. A false normal guard
continues to the next candidate. The ordinary selected clause remains
under its original scope.

## L1 — completion-logical-operands.lykn

```lykn
(bind trace (array))
(func lazy-results :args (:any stop) :returns :any :body
  (bind first (and (do (trace:push "first") 0)
                   (do (trace:push "wrong-and") (return 91))
                   92))
  (bind second (or (do (trace:push "second") "kept")
                   (do (trace:push "wrong-or") (return 93))))
  (return (and (do (trace:push first) true)
               (do (trace:push second) (if stop (return 7)) "next")
               (do (trace:push "last") (array first second)))))
(func bound-logical :returns :any :body
  (bind and (fn (:any a :any b) (array a b)))
  (return (and (trace:push "arg1") (trace:push "arg2"))))
(func pure-logical :returns :any :body
  (or (and false "wrong") "pure"))
(console:log (JSON:stringify (array (lazy-results true) (lazy-results false)
  (bound-logical) (pure-logical) trace)))
```

Expected `[7,[0,"kept"],[10,11],"pure",["first","second",0,"kept","first","second",0,"kept","last","arg1","arg2"]]`.
The three-value conjunction tests genuine selected short-circuit
sequencing. Skipped right operands contain real source transfers.
Retain old direct-function call semantics for the lexical `and` binding.
The two recorded array lengths come from the actual receiver. The
pure function retains ordinary logical expressions with no temp support.

## L2 — completion-nullish-operands.lykn

```lykn
(bind trace (array))
(func nullish-result :args (:any input) :returns :any :body
  (bind result
    (kernel:?? (do (trace:push "left") input)
               (do (trace:push "right") (return "early") "unreachable")
               (do (trace:push "wrong") 91)))
  (trace:push "after")
  result)
(console:log (JSON:stringify (array (nullish-result 0) (nullish-result false)
  (nullish-result null) (nullish-result undefined) trace)))
```

Expected `[0,false,"early","early",["left","after","left","after","left","right","left","right"]]`.
Validate real recognized kernel escape and preserve false and 0 as results.
Exact generated nullish comparison checks null and `void 0` strictly,
rather than using a loose null comparison.
