# AT-02 final specimen case manifest (frozen before runtime matrix)

Declared 2026-11-10 after the parser-only native check and default compile/declaration inspection of final source iteration06, before any final-source runtime case. This is the complete contributor population derived from `assessment.md`; the initial answer's attempts are separate. Exact source and fixture text are retained in `final/decoder.lykn` and `final/controls.lykn`.

For the decoder/config families, expected cells compare native default, native assertion-stripped and public default output; compare exact JSON result text and diagnostic streams. The public compiler has no strip option. L-03 rows compare each runtime control in native default, stripped, and public default, preserving throws separately from result data. No case is successful merely because it returns an error.

## Raw JSON conversion and recursive path

| ID | Input/source boundary | Expected observation |
|---|---|---|
| R01 | `JSON:parse("null")` | `Decoded(JNull)`. |
| R02 | `JSON:parse("false")` | `Decoded(JBoolean(false))`. |
| R03 | `JSON:parse("0")` | `Decoded(JNumber(0))`. |
| R04 | `JSON:parse("\"\"")` | `Decoded(JString(""))`. |
| R05 | `JSON:parse("[]")` | `Decoded(JArray([]))`. |
| R06 | `JSON:parse("{}")` | `Decoded(JObject([]))`. |
| R07 | `JSON:parse("{\"name\":\"Ada\",\"n\":1,\"flags\":[true,false],\"nil\":null}")` | All object/array members recursively converted with names, flags and null intact. |
| R08 | Lykn array `#a((JSON:parse "1") undefined (JSON:parse "3"))` at `$` | `Rejected(WrongValue, path="$[1]", expected="JSON value")`; valid siblings do not obscure the path. |
| R09 | `(obj :server (obj :port 8080) :label undefined)` at `$` | `Rejected(WrongValue, path="$[\"label\"]", expected="JSON value")`; raw own label is visited. |

## Config and optional-label policy

| ID | Exact parsed input | Expected observation |
|---|---|---|
| C01 | `{"server":{"port":0}}` | Decoded port 0, `LabelMissing`. |
| C02 | `{"server":{"port":65535}}` | Decoded port 65535, `LabelMissing`. |
| C03 | `{"server":{"port":-1}}` | `InvalidPort` at `server.port`, value -1. |
| C04 | `{"server":{"port":65536}}` | `InvalidPort` at `server.port`, value 65536. |
| C05 | `{"server":{"port":1.5}}` | `InvalidPort` at `server.port`, value 1.5. |
| C06 | `{"server":{"port":"8"}}` | `WrongValue` at `server.port`. |
| C07 | `{"server":{}}` | `MissingField` at `server.port`. |
| C08 | `{"server":{"port":null}}` | `WrongValue` at `server.port`. |
| C09 | `{"server":{"port":8080}}` | `LabelMissing`. |
| C10 | `{"server":{"port":8080},"label":null}` | `LabelNull`. |
| C11 | `{"server":{"port":0},"label":""}` | `LabelText("")`. |
| C12 | `{"server":{"port":8080},"label":"edge"}` | `LabelText("edge")`. |
| C13 | `{"server":{"port":8080},"label":false}` | `WrongValue` at `label`. |
| C14 | `{"server":{"port":8080},"label":0}` | `WrongValue` at `label`; falsy zero is not absence. |
| U01 | Entry list containing `Entry("label", JUndefined)` | Presence is `Some(JUndefined)` and strict ADT config returns `WrongValue` at `label`. |

## Exact keys and immutable nested edit

J-08 fixture text:

```json
{"first-name":0,"firstName":1,"":2,"a:b":3,"a/b":4,"~":5,"__proto__":6,"constructor":7,"toString":8}
```

| ID | Input/action | Expected observation |
|---|---|---|
| K01 | Decode the exact object above | All nine string keys and their values remain data; no key normalization or prototype behavior. |
| K02–K10 | For each key in the listed order, lookup in decoded J-08 entries | Every result is explicitly `Some(JNumber(value))`, including both spellings and all prototype-like strings. |
| E01 | Decode `{"first-name":0,"firstName":1,"":2,"a:b":3,"a/b":4,"~":5,"__proto__":6,"constructor":7,"toString":8,"nested":{"first-name":0,"firstName":1,"":2,"a:b":3,"a/b":4,"~":5,"__proto__":6,"constructor":7,"toString":8}}`; replace `nested["__proto__"]` with `JNumber(55)` | Original serializes unchanged; updated tree has exact nested value 55; untouched nested `constructor` remains 7; `Object:is(original, updated)` is false. |

## L-03 constructor and match controls

| ID | Control | Expected default and stripped distinction |
|---|---|---|
| T01 | Valid scalar constructor | `ControlNumber(3)` accepted in both. |
| T02 | Zero-field constant | `ControlNull` is a constant tagged value in both. |
| T03 | Wrong scalar constructor with runtime string value | Default throws constructor `TypeError`; stripped constructs the forged-payload shape. |
| T04 | Wrong outer array constructor with runtime string value | Default throws constructor `TypeError`; stripped constructs it. |
| T05 | Wrong nested array member `ControlArray(["bad"])` | Shallow array-field guard accepts in both; it does not recursively validate. |
| T06 | Unrelated `OtherTag` passed through a `:ControlJson` function boundary | Observe whether tag-presence annotation accepts; do not infer constructor identity. |
| T07 | Object without `tag` passed through `:ControlJson` boundary | Default throws type error; stripped passes. |
| T08 | Forged known `ControlNumber` tag with string payload | Annotation/match dispatch behavior is recorded separately from constructor validation. |
| T09 | Omitted-arm match receives `ControlNull` | Runtime fallback throw is a distinct observation in both modes. |
| T10 | Wildcard match receives unrelated variant | Wildcard result returned in both modes. |
| T11 | Nested constructor match receives `NestedSome(InnerNumber(7))` | Expected value 7; any `ReferenceError` is retained as an implementation observation, not a pass. |
| T12 | Same nested match receives `NestedSome(NestedNull)` | Expected negative branch; report independently from T11. |

Declared total: **35** ordinary decoder/config/key/edit input rows (R01–R09, C01–C14, U01, K01–K10, E01) plus **12** L-03 control rows = **47** case rows. The matrix is not complete until every runnable row has a native default, native stripped, and public default disposition; unrun/blocked cells remain in the denominator. Each command invocation, including expected failures, retains status/stdout/stderr. No lossless token, arbitrary host-object, cycle, or resource-bound claim is made.

## Post-observation expectation-text correction

After the first native decoder observation, the coordinator noticed that the frozen R09 table cell omitted the root `$` from its expected path. The function was passed `$`; the actual raw stdout was `WrongValue` at `$["label"]`. The matrix text is corrected above to include `$`, without changing the fixture, implementation or observation. This is retained as an expectation-text correction after observation; both original and corrected table content are recoverable from Git history.
