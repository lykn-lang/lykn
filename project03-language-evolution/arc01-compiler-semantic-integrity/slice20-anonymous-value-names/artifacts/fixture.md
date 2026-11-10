# Exact anonymous storage regression

Freeze `test/fixtures/semantic-roles/anonymous-completion-names.lykn`
with a final LF. The first three fields follow the preliminary
same-source observation. The other fields distinguish actual
source binding naming and recognized anonymous kernel shapes.

```lykn
(func name-of :args (:any callback :any _other) :returns :any :body
  callback:name)
(func names :args (:any callee) :returns :any :body
  (bind ordinary (callee (fn () 1) 0))
  (bind lifted (callee (fn () 1) (do 0 0)))
  (bind value (do (fn () 1)))
  (bind named-callback (fn () 1))
  (bind lifted-lambda (callee (kernel:lambda () (return 1)) (do 0 0)))
  (bind lifted-generator (callee (kernel:function* () (yield 1)) (do 0 0)))
  (bind lifted-class (callee (kernel:class-expr ()) (do 0 0)))
  (bind lifted-async (callee (kernel:async (kernel:=> () 1)) (do 0 0)))
  (bind bound-result ((get (fn () 1) "bind") (do 0 0)))
  (array ordinary lifted value:name named-callback:name
         lifted-lambda lifted-generator lifted-class lifted-async bound-result:name))
(console:log (JSON:stringify (names name-of)))
```

Exact expected strict stdout `["","","","namedCallback","","","","","bound "]`
with final LF and empty runtime stderr. Native generated DTS
absent. Old baseline predicts names at private temp columns,
with ordinary empty and source `namedCallback` retained.
Keep actual modules and emitted private temp names, without
freezing incidental suffix numbers in the final oracle.

The final field distinguishes the computed receiver storage.
The function prototype bind method obtains the original anonymous receiver name and returns
a function named exactly `bound ` (with one trailing space).
