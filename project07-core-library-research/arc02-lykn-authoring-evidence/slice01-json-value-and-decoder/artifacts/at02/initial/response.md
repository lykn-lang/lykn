# Decoding a small server config with Lykn ADTs

I’ll use this shape:

```json
{"server":{"port":8080},"label":"edge"}
```

`server.port` is required and must be an integer from 0 through 65535. `label` is optional and, when present, may be a string or JSON `null`. The decoder returns a `Config` on success and a typed failure otherwise. A valid empty label stays `LabelText ""`; it is not treated as absent.

The boundary here is an already-decoded value represented by `JsonValue` constructors. The code models JSON null, booleans, numbers, strings, arrays, and objects. I also include `JUndefined` for a present property supplied by a JavaScript caller: JSON text cannot encode it, but an adapter can preserve that case. `JObject` stores entries as a list, so a missing key is different from an entry whose value is `JNull`, `JString ""`, or `JUndefined`. Duplicate-key policy and conversion from native `JSON.parse` output are outside this small example.

`decoder.lykn` demonstrates the ADTs and decoder. Its `JObject` can hold a nested server object, and the final example rejects a boolean at `server.port`.

## What is checked where

- **Static / compile time:** Lykn checks that declared function parameters, return annotations, and ADT constructor fields are used with the declared types. Literal type mismatches can be rejected at compile time. These declarations do not prove the contents of an `:array` or an arbitrary `:any` value.
- **Runtime:** non-literal typed function boundaries and ADT constructors have runtime checks unless assertions are stripped. `decode-config` explicitly checks the object/entry ADT tags, required fields, port integer/range, and label variant. It returns `MissingField`, `WrongValue`, or `InvalidPort` rather than coercing values.
- **Absent:** the example does not parse JSON text, validate every nested array element, detect duplicate keys, or prove that a caller built `JObject` entries faithfully from a native object. In particular, `JUndefined` is a runtime-only representation and is not valid JSON.

For the input anchor, an absent `label` becomes `LabelMissing`, `label: null` becomes `LabelNull`, and `label: ""` becomes `LabelText ""`. A present `label: false` is rejected as `WrongValue`; `label: 0` is also rejected (it is not defaulted away); and a present own `label: undefined` becomes `LabelUndefined`, distinct from a missing entry. For the deliberately wrong nested value `{server:{port:false}}`, the decoder returns `WrongValue "server.port" ...`. The anchor `{x:...}` exercises the same presence/value distinction when `x` stands for the optional label field.

```lykn
(type JsonValue
  (JNull)
  (JUndefined)
  (JBoolean :boolean value)
  (JNumber :number value)
  (JString :string value)
  (JArray :array values)
  (JObject :array entries))

(type JsonEntry
  (Entry :string key :any value))

(type Label
  (LabelMissing)
  (LabelUndefined)
  (LabelNull)
  (LabelText :string value))

(type Config
  (ServerConfig :number port :any label))

(type DecodeFailure
  (MissingField :string path)
  (WrongValue :string path :string expected)
  (InvalidPort :string path :number value))

(type DecodeResult
  (Decoded :any value)
  (Rejected :any failure))

;; The option result marks whether an entry exists, independently of its value.
(func lookup
  :args (:array entries :string key)
  :returns :any
  :body
  (bind found (entries:find (fn (:any entry) (= entry:key key))))
  (if (= found undefined)
    None
    (Some found:value)))

(func decode-port
  :args (:any found :string path)
  :returns :any
  :body
  (match found
    ((None) (Rejected (MissingField path)))
    ((Some (JNumber n))
      :when (and (Number:isInteger n) (>= n 0) (<= n 65535))
      (Decoded n))
    ((Some (JNumber n)) (Rejected (InvalidPort path n)))
    ((Some _) (Rejected (WrongValue path "integer 0..65535")))))

(func decode-label
  :args (:any found)
  :returns :any
  :body
  (match found
    ((None) (Decoded LabelMissing))
    ((Some (JUndefined)) (Decoded LabelUndefined))
    ((Some (JNull)) (Decoded LabelNull))
    ((Some (JString text)) (Decoded (LabelText text)))
    ((Some _) (Rejected (WrongValue "label" "string or null")))))

(func decode-config
  :args (:any input)
  :returns :any
  :body
  (match input
    ((JObject config-entries)
      (match (lookup config-entries "server")
        ((None) (Rejected (MissingField "server")))
        ((Some (JObject server-entries))
          (match (decode-port (lookup server-entries "port") "server.port")
            ((Rejected failure) (Rejected failure))
            ((Decoded port)
              (match (decode-label (lookup config-entries "label"))
                ((Rejected failure) (Rejected failure))
                ((Decoded label) (Decoded (ServerConfig port label)))))))
        ((Some _) (Rejected (WrongValue "server" "object"))))
    (_ (Rejected (WrongValue "$" "object")))))

;; Empty string is a present label; port zero is within range.
(bind valid-empty-label
  (JObject #a(
    (Entry "server" (JObject #a((Entry "port" (JNumber 0)))))
    (Entry "label" (JString "")))))
(console:log (decode-config valid-empty-label))

;; A missing label stays distinct from explicit JSON null.
(bind absent-label
  (JObject #a((Entry "server" (JObject #a((Entry "port" (JNumber 8080))))))))
(bind null-label
  (JObject #a(
    (Entry "server" (JObject #a((Entry "port" (JNumber 8080)))))
    (Entry "label" JNull))))
(console:log (decode-config absent-label))
(console:log (decode-config null-label))

;; Wrong nested value: the port is a boolean, not an integer.
(bind wrong-nested-port
  (JObject #a(
    (Entry "server" (JObject #a((Entry "port" (JBoolean false)))))
    (Entry "label" (JString "edge")))))
(console:log (decode-config wrong-nested-port))
```
