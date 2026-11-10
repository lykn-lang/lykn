# Frozen direct statement-match fixtures

Use these exact UTF-8 files with trailing LF in
`test/fixtures/semantic-roles/`. Each current child exits 0 with empty
stderr and exact stdout plus LF. No fixture writes generated output
in the source checkout. The production baseline is accepted f348.

## F1 — statement-match-guards.lykn

```lykn
(bind trace (array))
(func subject :returns :any :body (trace:push "subject") 2)
(func gate :args (:any mark :any result) :returns :any :body
  (trace:push mark)
  result)
(match (subject)
  (1 :when (gate "wrong-pattern" true) (trace:push "wrong-body"))
  (2 :when (gate "literal-false" false) (trace:push "wrong-literal"))
  (captured :when (gate captured false) (trace:push "wrong-binding"))
  (_ :when (gate "chosen" true) (trace:push "body"))
  (_ :when (gate "late" true) (trace:push "late-body")))
(console:log (JSON:stringify trace))
```

Current `["subject","literal-false",2,"chosen","body"]`.
Old native predicted `["subject","literal-false"]`; old public
predicted already matches. This proves a skipped guard for a failed
pattern, both guarded fallthrough paths, visible clause binding, single
subject and early success.

## F2 — statement-match-return.lykn

```lykn
(kernel:function choose (input)
  (match input
    (_ :when false (return "wrong"))
    (_ (return "inside")))
  (return "after"))
(console:log (choose 0))
```

Current `inside`. Both old routes predicted `after` by different
causes. Native stops at guarded catch-all. Public consumes the return
inside its synthetic IIFE. Actual final generated source must show the
return inside choose's lexical body and no match-local function.

## F3 — statement-match-loop.lykn

```lykn
(bind trace (array))
(for (let i 0) (< i 4) (++ i)
  (match i
    (1 (continue))
    (3 (break))
    (_ (trace:push i)))
  (trace:push (+ i 10)))
(console:log (JSON:stringify trace))
```

Current `[0,10,2,12]`. Old native already matches. Old public
predicted strict SyntaxError because break/continue are inside the
match IIFE. A compiler-inserted loop could also retarget them.
Read the complete current module to distinguish the actual shape.

## F4 — statement-match-exhaustion.lykn

```lykn
(bind trace (array))
(try
  (match 2
    (_ :when (do (trace:push "guard") false) (trace:push "wrong")))
  (trace:push "after")
  (catch err (trace:push err:message)))
(console:log (JSON:stringify trace))
```

Current `["guard","match: no matching pattern"]`. Old both
predicted `["guard","after"]`. This proves the guarded last wildcard
does not establish exhaustion coverage and the error crosses the
ordinary surrounding try block.

## F5 — statement-match-preservation.lykn

```lykn
(macro read-target () `target__gensym0)
(macro emitted-match () `(match 0 (_ (trace:push 7))))
(bind target__gensym0 101)
(bind matched__gensym1 201)
(bind matched__gensym2 202)
(bind matched__gensym3 203)
(bind trace (array))
(match 0
  (_
    (trace:push (read-target))
    (trace:push matched__gensym1)
    (trace:push matched__gensym2)
    (trace:push matched__gensym3)))
(emitted-match)
(bind keep
  (do (match 0 (_ (trace:push 8))) (match 1 (_ 41))))
(bind match (fn (:any n) n))
(console:log (JSON:stringify (array trace keep (match 42))))
```

Current `[[101,201,202,203,7,8],41,42]`. With the first target
chosen as target__gensym0, old native/public are predicted to read
0 instead of 101. The fixture-local public resetGensym controls
counter order. Preserve actual old outcomes if this prediction
differs. Current proof must discriminate macro-produced free
reference from generated target, guard the matched-bit name,
recognize the user macro's genuine match output once, retain the
consumed value and mixed do-prefix effects, and preserve the
ordinary bound call.
