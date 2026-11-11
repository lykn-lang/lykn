## JSON

JavaScript Object Notation — the lingua franca of data exchange.

### `JSON:parse`

```lisp
(bind data (JSON:parse json-string))
```

Parses a JSON string into a JavaScript value. Throws `SyntaxError` on invalid input.

```lisp
;; With error handling
(try
  (bind data (JSON:parse input))
  (process data)
  (catch e
    (console:error "Invalid JSON:" e:message)))

;; Or with the Result pattern (Ch 10)
(func parse-json-safe
  :args (:string input)
  :returns :any
  :body
  (try (Ok (JSON:parse input))
    (catch e (Err e:message))))
```

Parsing JSON is a classic "expected failure" — invalid input is a data condition, not a bug. The `Result` pattern from Chapter 10 handles it cleanly.

### `JSON:stringify`

```lisp
;; Basic
(bind json (JSON:stringify data))

;; Pretty-printed (2-space indent)
(bind pretty (JSON:stringify data null 2))
```

### What JSON Supports

Strings, numbers, booleans, `null`, arrays, and objects (with string keys only). No `undefined`, no functions, no `Date` objects, no `Map`/`Set`, no symbols, no `BigInt`. Values that can't be serialized are silently dropped or converted to `null`.

### Reviver and Replacer

`JSON:parse` accepts a reviver function — transform values during parsing:

```lisp
(bind data (JSON:parse json-string
  (fn (:string key :any val)
    (if (and (= (typeof val) "string")
             (val:match (regex "^\\d{4}-\\d{2}-\\d{2}T")))
      (new Date val)
      val))))
```

`JSON:stringify` accepts a replacer — transform values during serialization.

### JSON and Lykn's Data Conventions

Lykn's `type` constructors produce tagged objects: `{ tag: "Ok", value: 42 }`. These serialize to JSON naturally — no custom `toJSON` needed. `obj` with keywords produces clean JSON-friendly objects too. The surface language's conventions align with JSON out of the box.
