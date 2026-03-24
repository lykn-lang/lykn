---
number: 5
title: "DD-05: Template Literals"
author: "Duncan McGreggor"
component: All
tags: [change-me]
created: 2026-03-24
updated: 2026-03-24
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# DD-05: Template Literals

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

Template literals use a `template` form where strings are template segments and non-strings are interpolated expressions. The compiler infers empty `TemplateElement` nodes at boundaries and between adjacent expressions — no explicit empty strings needed in lykn source. Tagged templates use `(tag fn (template ...))`. No reader changes required.

## Decisions

### `template` form with type-based dispatch

**Decision**: `(template args...)` produces a `TemplateLiteral`. Each string argument becomes a `TemplateElement` (segment). Each non-string argument becomes an entry in the `expressions` array. The compiler inserts empty `TemplateElement` nodes as needed to satisfy ESTree's alternation rule (one more quasi than expressions).

**Syntax**:

```lisp
;; simple interpolation
(template "Hello, " name "!")

;; multi-expression
(template first " + " second " = " (+ first second))

;; expression at start
(template name " is here")

;; expression at end
(template "value: " x)

;; adjacent expressions (compiler infers empty segments)
(template a b)

;; mixed adjacent and separated
(template "sum: " a b " = " (+ a b))

;; static string (valid but pointless)
(template "hello")
```

```javascript
// simple interpolation
`Hello, ${name}!`

// multi-expression
`${first} + ${second} = ${first + second}`

// expression at start
`${name} is here`

// expression at end
`value: ${x}`

// adjacent expressions
`${a}${b}`

// mixed adjacent and separated
`sum: ${a}${b} = ${a + b}`

// static string
`hello`
```

**ESTree nodes**: `TemplateLiteral`, `TemplateElement`

**Rationale**: Type-based dispatch (string = segment, non-string = expression) handles the common case cleanly with no extra markers or syntax. The compiler's empty-segment inference is mechanical and eliminates the need for ugly explicit `""` in source. The rule is simple: walk the arguments, track whether you need to insert an empty quasi, and always bookend with quasis.

### Compiler empty-segment inference rules

**Decision**: The compiler applies these rules when building the `quasis` and `expressions` arrays:

- If the first argument is not a string, prepend an empty `TemplateElement`
- If two adjacent arguments are both non-strings, insert an empty `TemplateElement` between them
- If the last argument is not a string, append an empty `TemplateElement` (with `tail: true`)
- If the last argument is a string, that segment gets `tail: true`

**Rationale**: ESTree requires `quasis.length === expressions.length + 1` with strict alternation. These rules produce correct ESTree for any argument sequence without requiring the lykn author to manage empty strings manually.

### `tag` form for tagged templates

**Decision**: `(tag fn (template ...))` produces a `TaggedTemplateExpression`. The first argument is the tag function (any expression), the second is a `template` form.

**Syntax**:

```lisp
;; tagged template
(tag html (template "<div>" content "</div>"))

;; String.raw
(tag String:raw (template "\\n is not a newline"))

;; custom tag function
(tag my-tag-fn (template "hello " name))

;; tag via variable
(tag css (template "color: " color ";"))
```

```javascript
// tagged template
html`<div>${content}</div>`

// String.raw
String.raw`\n is not a newline`

// custom tag function
myTagFn`hello ${name}`

// tag via variable
css`color: ${color};`
```

**ESTree nodes**: `TaggedTemplateExpression`

**Rationale**: Explicit `tag` form is unambiguous — the compiler knows to emit `TaggedTemplateExpression` without context-dependent magic. The tag can be any expression (identifier, member expression via colon syntax, etc.). Calling the tag function directly on a template form — `(html (template ...))` — would look like a regular function call and require the compiler to special-case "template as argument," which is magical.

### Nested templates

**Decision**: Nesting works naturally. A `template` form inside another `template` form compiles to a `TemplateLiteral` expression inside the outer template's `expressions` array.

**Syntax**:

```lisp
;; nested template
(template "outer " (template "inner " x) " end")
```

```javascript
// nested template
`outer ${`inner ${x}`} end`
```

**ESTree nodes**: Nested `TemplateLiteral` within outer `TemplateLiteral`

**Rationale**: Falls out naturally from the compilation model. The inner `template` compiles to an expression node like any other non-string argument.

### Multi-line via escape sequences

**Decision**: Multi-line template content uses `\n` in string segments. No reader-level multi-line string support for v0.1.0.

**Syntax**:

```lisp
(template "line one\nline two")
```

```javascript
`line one
line two`
```

**Rationale**: Reader-level multi-line strings would be a nice ergonomic improvement but add reader complexity. `\n` works for v0.1.0. Multi-line reader support can be revisited later.

### No reader changes

**Decision**: Template literals are handled entirely at compile time via the `template` and `tag` forms. No backtick syntax or other reader-level changes.

**Rationale**: Backtick syntax in the reader would look natural but adds reader complexity for something the `template` form handles well. The reader stays minimal — it handles s-expression structure, the compiler handles JS semantics (consistent with DD-01's colon-splitting decision).

## Rejected Alternatives

### Explicit interpolation markers

**What**: `(template "Hello, " ($ name) "!")` or `(template "Hello, " ~name "!")` where expressions are explicitly marked.

**Why rejected**: Adds noise to the common case for no practical benefit. Type-based dispatch (string = segment, non-string = expression) is unambiguous for all real-world usage. The `$` marker would be needed on every interpolated expression, which is the majority of non-string arguments.

### Explicit empty strings for adjacent expressions

**What**: Require `(template "" a "" b "")` for `` `${a}${b}` ``.

**Why rejected**: Ugly and error-prone. The compiler can infer empty segments mechanically. The lykn author shouldn't have to manage ESTree bookkeeping.

### Backtick reader syntax

**What**: `` `Hello, ${name}!` `` in the reader, producing a `TemplateLiteral` node directly.

**Why rejected**: Reader complexity for something the `template` form handles. Backticks have other uses in some Lisps (quasiquote). Keeping the reader minimal is a consistent design principle.

### Tag function as direct call

**What**: `(html (template ...))` — let the compiler detect that a template is being passed as an argument and emit `TaggedTemplateExpression`.

**Why rejected**: Magical context-dependent behavior. `(html (template ...))` looks like a regular function call `html(template(...))`. The compiler would need to special-case "if the sole argument is a template form" which is fragile and surprising.

### `tagged` as a combined form

**What**: `(tagged html "<div>" content "</div>")` — fuse the tag and template arguments into one form.

**Why rejected**: Overloads one form with two different argument structures. `tag` + `template` as separate composable forms is cleaner — each does one thing.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| All non-string args | Empty quasis inferred at all boundaries | `(template a b)` → `` `${a}${b}` `` |
| All string args | Single template element, no expressions | `(template "hello")` → `` `hello` `` |
| Empty template | Valid, produces empty template literal | `(template "")` → `` `` `` |
| `template` with no args | Compile-time error | `(template)` → error |
| String literal as interpolated expr | Not supported | Use a variable: `(const s "lit") (template s)` |
| Nested template | Inner compiles as expression | `(template "a" (template "b" x))` → `` `a${`b${x}`}` `` |
| `tag` with non-template second arg | Compile-time error | `(tag html "string")` → error |
| `tag` with no args or one arg | Compile-time error | `(tag html)` → error |

## Dependencies

- **Depends on**: DD-01 (atoms in template expressions get camelCase conversion; strings are untouched)
- **Affects**: DD-09 (template literals are essential for v0.1.0)

## Open Questions

- [ ] Reader-level multi-line string support — deferred to post-v0.1.0, use `\n` for now
- [ ] Whether backtick reader syntax is worth adding later for ergonomics — deferred
