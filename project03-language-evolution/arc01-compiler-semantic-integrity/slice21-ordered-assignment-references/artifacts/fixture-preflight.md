# Literal compound fixture clarification before first source freeze

Keep the issued fixture history at `ca94a050`. F2 requires an observable
old-value conversion to distinguish GetValue from conversion. In F2
insert these exact forms between the existing replacement binding and
original descriptor registration.

```lykn
(bind previous (obj))
(Object:defineProperty previous Symbol:toPrimitive
  (obj :value (fn (:any hint) (trace:push (array "convert" hint)) original:stored)))
```

Use `:get (fn () (trace:push "get") previous)` in that original descriptor.
F2's full strict stdout, including LF, is now the following.

```json
[91,[10,40],14,14,40,["get","rhs","get","rhs",["convert","default"],["set",14],"after"]]
```

The early branch skips conversion and setter. The normal branch gets
before RHS, then converts the original saved value and writes once.
Every other fixture and denominator stays the same.
