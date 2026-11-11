## `match`: Exhaustive Pattern Matching

`match` takes an expression and a list of clauses. Each clause has a pattern and a body. The compiler ensures every possible value is handled.

### ADT Patterns

Constructors in patterns are destructurers — the same syntax that builds a value takes it apart:

```lisp
(match opt
  ((Some v) (console:log "got:" v))
  (None (console:log "nothing")))
```

```javascript
{
  const target__gensym0 = opt;
  if (target__gensym0.tag === "Some") {
    const v = target__gensym0.value;
    console.log("got:", v);
  } else if (target__gensym0.tag === "None") {
    console.log("nothing");
  } else {
    throw new Error("match: no matching pattern");
  }
}
```

The pattern `(Some v)` does two things: checks that `opt.tag === "Some"`, and binds `opt.value` to `v`. Construction and destruction are the same syntax — `(Some 42)` builds; `(Some v)` unbinds.

### Literal Patterns

```lisp
(match status
  (200 "ok")
  (404 "not found")
  (_ "unknown"))
```

```javascript
const target__gensym0 = status;
if (target__gensym0 === 200) {
  return "ok";
}
if (target__gensym0 === 404) {
  return "not found";
}
{
  return "unknown";
}
```

Literal patterns compare with `===`. The wildcard `_` matches anything and binds nothing.

### Boolean Patterns

```lisp
(match flag
  (true "yes")
  (false "no"))
```

Two cases, both covered. Boolean `match` is exhaustive without a wildcard — `true` and `false` are the only values.

### Nested Patterns

Patterns can nest:

```lisp
(match response
  ((Ok (Some v)) (use v))
  ((Ok None) (use-default))
  ((Err e) (handle e)))
```

The compiler generates nested checks: first `response.tag === "Ok"`, then `response.value.tag === "Some"`. Each level of nesting adds an `if` inside an `if`. The output is still a clean if-chain — no recursion, no pattern matching runtime.

### The Wildcard `_`

`_` matches anything and binds nothing. Use it for "all remaining cases":

```lisp
(match x
  (42 "the answer")
  (_ "something else"))
```

For ADT matches, `_` covers all variants you haven't listed explicitly. For literal matches on open types (numbers, strings), `_` is required — the compiler can't enumerate every possible number.

### No Runtime Library

Every `match` compiles to a chain of `if` statements with `===` comparisons and `.tag` property checks. No pattern matching runtime. No dispatch table. No overhead beyond what you'd write by hand — and considerably less risk of getting it wrong.
