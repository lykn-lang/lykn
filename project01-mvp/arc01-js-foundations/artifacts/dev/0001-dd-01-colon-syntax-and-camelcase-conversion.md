# DD-01: Colon Syntax and camelCase Conversion

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how colon syntax for member access
and lisp-case to camelCase conversion should work.

These are foundational — almost every other design decision depends on
them.

## Current state

The reader produces four node types: `atom`, `number`, `string`, `list`.
Colons are currently treated as ordinary atom characters (no special
handling). There is no camelCase conversion.

## The proposal from research

Handle colon splitting at **compile time** (not in the reader), keeping
the reader simple. When the compiler sees an atom containing `:`, it
splits on `:` and builds a chained `MemberExpression`.

```lisp
(console:log "hi")       ;; -> console.log("hi")
(obj:prop)               ;; -> obj.prop  (property access)
(this:name)              ;; -> this.name
(a:b:c)                  ;; -> a.b.c     (chained)
```

Proposed implementation sketch:

```javascript
// In compileExpr, atom case:
if (node.value.includes(':') && !node.value.startsWith(':')) {
  const parts = node.value.split(':');
  let result = { type: 'Identifier', name: toCamelCase(parts[0]) };
  for (let i = 1; i < parts.length; i++) {
    result = {
      type: 'MemberExpression',
      object: result,
      property: { type: 'Identifier', name: toCamelCase(parts[i]) },
      computed: false,
    };
  }
  return result;
}
```

For camelCase, the proposal only converts when hyphens are present:

```javascript
function toCamelCase(name) {
  if (!name.includes('-')) return name;
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
```

## Questions to discuss

1. **Reader vs compiler**: Is compile-time splitting the right call, or
   should the reader understand colons? What are the tradeoffs?

2. **Leading colon**: Atoms starting with `:` (like `:keyword`) are
   excluded from splitting. Should `:foo` be reserved for future use
   (e.g., keyword syntax, symbols)? Or just treated as a regular
   identifier?

3. **camelCase edge cases**:
   - `JSON:parse` — should `JSON` stay as-is? (Yes, no hyphen → no
     conversion.) But what about `my-app:get-data`? That should become
     `myApp.getData`.
   - Trailing hyphens: `foo-` → `foo`? Or error?
   - Leading hyphens: `-foo` → already handled as negative numbers?
   - Double hyphens: `foo--bar` → `fooBar`? `foo-Bar`? Error?
   - All-caps segments: `get-HTTP-response` → `getHTTPResponse`? Or
     `getHttpResponse`?
   - Single-letter segments: `get-x` → `getX`

4. **Colon in non-head position**: `(const x obj:prop)` — the colon
   atom appears as an argument, not as the function/head position. This
   should still produce a `MemberExpression`. Confirm?

5. **Colon with computed access**: How do you do `obj[expr]` in colon
   syntax? Or is that only available via the `.` form? The current `.`
   form does `(. obj prop)` for dot access and uses computed for
   numbers/strings. Relationship between `:` and `.`?

6. **Interaction with `this` and `super`**: `this:name` needs the first
   segment to compile to `ThisExpression`, not `Identifier("this")`.
   Same for `super:method`. How should the compiler detect these?

7. **URL-like colons**: `http:get` looks like a URL scheme. Is this a
   real concern or purely theoretical? (Atoms can't contain `//` since
   that would be parsed as... actually the reader doesn't have `//`
   comments. Worth checking.)

8. **Numeric segments**: `obj:0` — should this produce computed access
   (`obj[0]`) or is it an error?

## Reference: eslisp's approach

Eslisp uses `.` as a macro for member access:

```lisp
(. obj prop)        ;; obj.prop (non-computed if prop is Identifier)
(. obj prop1 prop2) ;; obj.prop1.prop2 (chained)
```

Eslisp also has `get` for always-computed access:

```lisp
(get obj key)       ;; obj[key]
```

Lykn v0.0.1 already has the `.` form. The colon syntax is sugar that's
more ergonomic for the common case.

## Goal

By the end of this discussion, decide:
- Where colon splitting happens (reader vs compiler)
- Exact camelCase conversion rules (including all edge cases)
- How `:` and `.` relate to each other
- What leading-colon atoms mean
- How `this:x` and `super:x` work

When we're done, I'll ask you to write a decision doc using the
template in this project.
