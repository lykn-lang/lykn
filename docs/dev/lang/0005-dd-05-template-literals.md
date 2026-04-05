# DD-05: Template Literals

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how template literals (string
interpolation) should work in lykn.

## What ECMAScript defines

```javascript
// Simple interpolation
`Hello, ${name}!`

// Multi-expression
`${first} + ${second} = ${first + second}`

// Tagged template
html`<div>${content}</div>`

// Raw strings (no escape processing)
String.raw`\n is not a newline`

// Nested templates
`outer ${`inner ${x}`} end`

// Multi-line
`line one
line two`
```

ESTree representation:
- `TemplateLiteral` has `quasis` (array of `TemplateElement`) and
  `expressions` (array of `Expression`)
- `TemplateElement` has `value.raw` and `value.cooked`, plus a `tail`
  boolean
- `TaggedTemplateExpression` has `tag` (Expression) and `quasi`
  (TemplateLiteral)

The quasis and expressions alternate: quasis[0], expressions[0],
quasis[1], expressions[1], ..., quasis[n]. There is always one more
quasi than expression. Empty segments are empty strings.

## The gap analysis proposal

```lisp
;; `Hello, ${name}!`
(template "Hello, " name "!")

;; Tagged: html`<div>${content}</div>`
(tag html (template "<div>" content "</div>"))
```

String segments and non-string elements alternate. Strings become
`TemplateElement` nodes, non-strings become entries in the
`expressions` array.

## Questions to discuss

1. **Positional alternation**: The proposal relies on type to
   distinguish template segments from expressions — strings are
   segments, everything else is an expression. This breaks down in
   several cases:

   - **Two adjacent expressions**: `` `${a}${b}` `` — the quasis array
     needs an empty string between them. Would you write
     `(template "" a "" b "")`? That's ugly but explicit.

   - **Expression that's a string variable**: `(template "Hi " name)`
     — `name` is an atom so it's an expression. Fine. But what if you
     wanted a template that's just a static string? `(template "hello")`
     — is that `` `hello` `` or just pointless?

   - **String literal as an interpolated expression**: What if you want
     `` `${"literal"}` ``? You can't write `(template "literal")`
     because that's a segment, not an expression. Edge case, but real.

2. **Alternative: explicit interpolation markers**:

   ```lisp
   ;; Option A: $ marks expressions
   (template "Hello, " ($ name) "!")

   ;; Option B: ~ marks expressions (less visual noise)
   (template "Hello, " ~name "!")

   ;; Option C: just use position (the proposal)
   (template "Hello, " name "!")
   ```

   Option A is unambiguous but verbose. Option B requires reader
   changes. Option C is clean for the common case but has edge cases.

3. **Empty segments**: For `` `${a}${b}` ``, ESTree requires three
   quasis: `["", "", ""]` with two expressions. Does
   `(template a b)` produce this? If all elements are non-strings,
   the compiler would need to infer empty segments at boundaries.

4. **Tagged templates**: `(tag html (template ...))` — is `tag` the
   right form name? Alternatives: `(tagged html ...)`,
   `(html (template ...))` (just call the tag function on the template).
   The last option is interesting — in JS, a tagged template IS a
   function call with special arguments.

5. **Nesting**: `` `outer ${`inner`}` `` — in lykn, this would be
   `(template "outer " (template "inner"))`. Does this just work, or
   are there compilation issues?

6. **Multi-line**: Template literals can span multiple lines. In lykn,
   strings are delimited by `"`. A multi-line template would be
   `(template "line one\nline two")`. Or should the reader support
   multi-line strings?

7. **Do we even need a `template` form?** An alternative approach:
   use a special string syntax in the reader, like backticks:

   ```lisp
   `Hello, ${name}!`    ;; reader produces a template literal node
   ```

   This would require reader changes but would look natural. However,
   backticks are sometimes used for other purposes in Lisps. Is this
   worth the reader complexity?

## ESTree nodes involved

- `TemplateLiteral` — `{ quasis: [TemplateElement], expressions: [Expression] }`
- `TemplateElement` — `{ tail: boolean, value: { raw: string, cooked: string } }`
- `TaggedTemplateExpression` — `{ tag: Expression, quasi: TemplateLiteral }`

## Goal

By the end of this discussion, decide:
- The syntax for basic template literals
- How adjacent expressions are handled (empty segments)
- How tagged templates work
- Whether the reader needs changes for this
- Edge case behavior

When we're done, I'll ask you to write a decision doc using the
template in this project.
