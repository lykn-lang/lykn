# Proposed exact static member cases

Keep source and normal-runtime oracle distinct from optimized artifact
observations. Freeze the test inputs before baseline. Source remains
ordinary Lykn. Place provider, entry and pure source files together under
one owned fixture directory.

## Provider

```lykn
(exports probe)
(bind provider-kind "local")
(bind trace (array))
(func original-method :args (:any earlier :any middle :any later) :returns :any :body
  (trace:push "call")
  (array this:label middle))
(func wrong-method :returns :any :body
  (throw (new Error "unexpected method")))
(Object:defineProperty original-method "call" (obj :value wrong-method))
(Object:defineProperty original-method "apply" (obj :value wrong-method))
(func use-member-call :args (:any stop) :returns :any :body
  (bind Reflect (obj :label "receiver"))
  (bind receiver Reflect)
  (bind lykn-host-reflect-apply0 "earlier")
  (Object:defineProperty receiver "readEntry"
    (obj :configurable true :get (fn () (trace:push "get") original-method)))
  (bind result
    (receiver:read-entry
      (trace:push lykn-host-reflect-apply0)
      (do
        (trace:push "middle")
        (Object:defineProperty receiver "readEntry" (obj :value wrong-method))
        (if stop (return 92))
        8)
      (trace:push "later")))
  (trace:push "after")
  result)
(func probe :returns :any :body
  (array provider-kind (use-member-call true) (use-member-call false) trace))
(console:log "provider")
```

For the actual fallback provider, replace the `provider-kind` binding
with `(bind Reflect! "inline")` and its one use in `probe` with
`Reflect!`. All other bytes stay the same. Emitted module scope
binds actual `Reflect`. The function's returned marker proves that
binding remains live.

Compile as ordinary current Lykn module to `provider.js` for each
isolated proof. Native API/CLI and public kernel round trips must
retain same complete output and actual support strategy. Record
native DTS as a separate actual export artifact.

## Live entry

```lykn
(import "./provider.js" (probe))
(console:log (JSON:stringify (probe)))
```

Strict actual stdout, each line LF, stderr empty:

```text
provider
["local",92,["receiver",8],["get","earlier","middle","get","earlier","middle","later","call","after"]]
```

The fallback variant prints `"inline"` in place of `"local"`.
The first call must skip later argument, invocation, and after
effect. The second must keep the callable obtained by the getter
and the original receiver, despite method redefinition and poisoned
function call/apply properties. Old source is predicted to run both
later and call/after effects and produce `["receiver",92]` as its
first function result. Keep the actual baseline bytes.

## Shaken entry

```lykn
(import "./provider.js")
(console:log "entry")
```

Actual bundled stdout `provider\nentry\n`, stderr empty. The
provider remains observable while its invocation support, including
any inline data-module bytes, makes no output contribution.
Retained uncalled proof bundles the original provider as an ESM
entry, so exported probe remains but stdout is only `provider\n`.
Read complete optimized artifacts/metafiles. The retained helper or
inlined equivalent keeps the only Reflect.apply access inside live
call execution. Use the pinned native esbuild, no assumed PURE flag
or replacement JavaScript fixture.

## Pure no-lift case

```lykn
(func probe :args (:any receiver) :returns :any :body
  (receiver:read-entry 3))
(bind receiver (obj :read-entry (fn (:any value) (+ value 1))))
(console:log (probe receiver))
```

Exact `4\n`, stderr empty, normal call output unchanged within each
backend against the old baseline, no request/helper/data import.

Both live variants have an actual nested local `Reflect` and a
local emitted name `lyknHostReflectApply0` at the invocation site.
The outer module determines helper strategy. The reserved local
must not capture the injected support call, so the shared Arc03
allocator must choose the next free support name. The "earlier"
effect continues to come from the existing local.
