# Exact ordered write fixture population

Use final LF on every source. F1–F3 live under
`test/fixtures/semantic-roles/` and run through the actual native and
public source entrypoints with strict Deno runtime. Native DTS is
absent. F4 is an inline exact compile-only oracle. Its protected write
never executes. Retain old and current stdout, stderr and actual JS
and kernel bytes before assertion.

## F1 — ordered-simple-assignment.lykn

```lykn
(bind trace (array))
(bind original (obj :a 10))
(bind replacement (obj :a 40 :c 50))
(bind key (obj))
(Object:defineProperty key Symbol:toPrimitive
  (obj :value (fn (:any hint) (trace:push hint) "a")))
(func assign-target :args (:any target :any stop) :returns :any :body
  (bind result
    (set-symbol! target (do (trace:push "key") key)
      (do (trace:push "rhs") (kernel:= target replacement)
          (if stop (return 95)) 5)))
  (trace:push "after")
  result)
(func write-statement :args (:any target :any stop) :returns :any :body
  (kernel:= (get target "c")
    (do (trace:push "statement-rhs") (if stop (return 96)) 8))
  (trace:push "statement-after")
  target:c)
(bind early (assign-target original true))
(bind before (array original:a replacement:a))
(bind normal (assign-target original false))
(bind early-statement (write-statement replacement true))
(bind statement-before replacement:c)
(bind normal-statement (write-statement replacement false))
(console:log (JSON:stringify
  (array early before normal original:a replacement:a early-statement
         statement-before normal-statement replacement:c trace)))
```

Exact strict stdout with LF.

```json
[95,[10,40],5,5,40,96,50,8,8,["key","rhs","key","rhs","string","after","statement-rhs","statement-rhs","statement-after"]]
```

The true bind branch escapes before key coercion/write despite
already evaluating the raw key. The false branch reassigns the
source receiver binding then still writes its original receiver.
The separate source Statement writes only on normal completion.

## F2 — ordered-literal-compound-assignment.lykn

```lykn
(bind trace (array))
(bind original (obj :stored 10))
(bind replacement (obj :stored 40))
(Object:defineProperty original "slot"
  (obj :get (fn () (trace:push "get") original:stored)
       :set (fn (:any next) (trace:push (array "set" next))
              (set! original:stored next))))
(func add-slot :args (:any target :any stop) :returns :any :body
  (bind result
    (kernel:+= (kernel:get target "slot")
      (do (trace:push "rhs") (kernel:= target replacement)
          (if stop (return 91)) 4)))
  (trace:push "after")
  result)
(bind early (add-slot original true))
(bind before (array original:stored replacement:stored))
(bind normal (add-slot original false))
(console:log (JSON:stringify
  (array early before normal original:stored replacement:stored trace)))
```

Exact strict stdout with LF.

```json
[91,[10,40],14,14,40,["get","rhs","get","rhs",["set",14],"after"]]
```

## F3 — ordinary-assignment-preservation.lykn

```lykn
(func plain-writes :args (:any box :any local) :returns :any :body
  (bind first (set-symbol! box "a" 2))
  (bind second (kernel:+= (get box "a") 3))
  (bind third (kernel:= local 6))
  (array first second third box:a local))
(func local-protected :args (:any Reflect) :returns :any :body
  (bind result (set-symbol! Reflect "apply" 7))
  (array result Reflect:apply))
(console:log (JSON:stringify
  (array (plain-writes (obj :a 1) 0) (local-protected (obj :apply 0)))))
```

Exact stdout `[[2,5,6,5,6],[7,7]]` with LF. Actual complete native
and public JS modules remain byte-identical old to current. Preserve
existing local host-name shadow and genuine normal assignment.

## F4 — direct protected write with a lifted RHS

```lykn
(func blocked :args () :returns :any :body
  (kernel:= (get Reflect "apply") (do 0 0)))
```

Native actual check and compile return exit 1 with anchored
`error: host-contract v1: write to protected slot Reflect.apply`
and compile writes no JS or DTS. Require public actual `lykn(source)`
throws the protected slot error. Preserve full actual message and
span where available. It is a pre-existing protected error, not a
new incomplete-lowering diagnostic. The full unchanged v1
native/public suite covers other direct and alias spellings.
