# Phase 3 — Expressions: Implementation Guide

**For**: Claude Code
**Scope**: Phase 3 of lykn v0.1.0 — template literals, spread, default params, object construction rewrite
**Where you're working**: `src/compiler.js` — adding macros and rewriting the existing `object` macro
**Prerequisite**: Phase 1 must be complete. Phase 2 is NOT required — Phase 3 is independent.
**Design authority**:
- `crates/design/dev/lang/0005-dd-05-template-literals.md`
- `crates/design/dev/lang/0006-dd-06-destructuring-patterns.md` (for `spread`, `default`, `object` amendment)

---

## Overview: What Phase 3 Is

Phase 3 adds four new forms and **rewrites one existing form**:

| Item | Type | Notes |
|------|------|-------|
| 3.1 `template` | New macro | The hardest item — TemplateLiteral quasis/expressions interleaving |
| 3.2 `tag` | New macro | Simple wrapper around `template` |
| 3.3 `spread` | New macro | Simple — but read the context notes |
| 3.4 `default` | New macro | Used in function params — but also recognized structurally in Phase 4 |
| 3.5 `object` | **Rewrite** existing macro | Flat pairs → grouped pairs. Breaking change from v0.0.1 |

Phase 3 is estimated at ~1 day. The `template` form takes the most thought; the rest are straightforward.

---

## 3.1 `template` — Template Literals

**Design doc**: `0005-dd-05-template-literals.md`

### What It Does

`(template args...)` compiles to a JavaScript template literal (`` `...` ``).

```lisp
(template "Hello, " name "!")
```
→
```js
`Hello, ${name}!`
```

### The ESTree Structure You Must Produce

A `TemplateLiteral` has two parallel arrays: `quasis` and `expressions`. They interleave — there is ALWAYS exactly one more quasi than expression:

```
quasis[0]  expressions[0]  quasis[1]  expressions[1]  ...  quasis[n]
```

For `` `Hello, ${name}!` ``:
```js
{
  type: 'TemplateLiteral',
  quasis: [
    { type: 'TemplateElement', value: { raw: 'Hello, ', cooked: 'Hello, ' }, tail: false },
    { type: 'TemplateElement', value: { raw: '!', cooked: '!' }, tail: true }
  ],
  expressions: [
    { type: 'Identifier', name: 'name' }
  ]
}
```

The last `TemplateElement` MUST have `tail: true`. All others have `tail: false`.

### The Core Algorithm: Type-Based Dispatch with Empty Segment Inference

The lykn `template` form uses **type dispatch** to distinguish segments from expressions:
- **String args** → become `TemplateElement` nodes (the static text segments)
- **Non-string args** (atoms, numbers, lists) → become entries in the `expressions` array

The compiler must **infer empty segments** at boundaries where the ESTree spec requires a quasi but the lykn source has none:

| Situation | What lykn sees | What ESTree needs | Rule |
|-----------|---------------|-------------------|------|
| Expression at start | `(template name "!")` | Empty quasi before `name` | Prepend empty element |
| Two adjacent expressions | `(template "Hi " a b "!")` | Empty quasi between `a` and `b` | Insert empty between |
| Expression at end | `(template "Hi " name)` | Empty quasi after `name` | Append empty element |
| All expressions | `(template a b)` | Empty quasis around and between | All three rules apply |

### Implementation

```js
'template'(args) {
  const quasis = [];
  const expressions = [];

  // Walk through args, building interleaved quasis and expressions
  for (let i = 0; i < args.length; i++) {
    if (args[i].type === 'string') {
      // String → TemplateElement
      // If we already have a quasi at the top (from a previous string),
      // this means two adjacent strings — which is odd but we handle it
      // by concatenating them into one quasi.
      // More commonly: this is the first string, or follows an expression.
      quasis.push(makeTemplateElement(args[i].value, false));
    } else {
      // Non-string → Expression
      // Before adding an expression, ensure there's a quasi before it
      if (quasis.length === expressions.length) {
        // No quasi before this expression — need an empty one
        quasis.push(makeTemplateElement('', false));
      }
      expressions.push(compileExpr(args[i]));
    }
  }

  // After processing all args, ensure there's a trailing quasi
  if (quasis.length === expressions.length) {
    // Ended with an expression — need a trailing empty quasi
    quasis.push(makeTemplateElement('', true));
  }

  // Mark the last quasi as tail
  if (quasis.length > 0) {
    quasis[quasis.length - 1].tail = true;
  }

  return {
    type: 'TemplateLiteral',
    quasis,
    expressions,
  };
},
```

**Helper function** — add this as a module-level function:

```js
function makeTemplateElement(raw, tail) {
  return {
    type: 'TemplateElement',
    value: { raw, cooked: raw },
    tail,
  };
}
```

### Wait — That Algorithm Has a Bug

The algorithm above doesn't handle the case where two adjacent args are BOTH strings. In normal usage this is unlikely (why write `(template "Hello, " "world")`?), but it's valid and should produce a single merged quasi.

More importantly, it doesn't correctly handle the quasi-after-expression interleaving. Let me give you a cleaner algorithm that gets this right:

```js
'template'(args) {
  if (args.length === 0) {
    // (template) → empty template literal ``
    return {
      type: 'TemplateLiteral',
      quasis: [makeTemplateElement('', true)],
      expressions: [],
    };
  }

  const quasis = [];
  const expressions = [];
  let currentSegment = '';  // accumulates adjacent string args

  for (let i = 0; i < args.length; i++) {
    if (args[i].type === 'string') {
      // Accumulate into current segment
      currentSegment += args[i].value;
    } else {
      // Non-string: flush current segment as a quasi, then add expression
      quasis.push(makeTemplateElement(currentSegment, false));
      currentSegment = '';
      expressions.push(compileExpr(args[i]));
    }
  }

  // Flush final segment (may be empty if last arg was an expression)
  quasis.push(makeTemplateElement(currentSegment, true));

  return {
    type: 'TemplateLiteral',
    quasis,
    expressions,
  };
},
```

**This version is correct.** Here's why:

- It accumulates string args into `currentSegment`.
- When it hits a non-string arg, it flushes `currentSegment` as a quasi (even if empty), then records the expression.
- After the loop, it flushes whatever remains in `currentSegment` as the final (tail) quasi.
- This naturally produces the right number of quasis: always `expressions.length + 1`.

### Worked Examples

**`(template "Hello, " name "!")`**:
```
i=0: string "Hello, " → currentSegment = "Hello, "
i=1: atom name → flush "Hello, " as quasi, add name as expression, reset segment to ""
i=2: string "!" → currentSegment = "!"
end: flush "!" as tail quasi
Result: quasis=["Hello, ", "!"], expressions=[name]
→ `Hello, ${name}!`  ✓
```

**`(template a b)`** (all expressions):
```
i=0: atom a → flush "" as quasi, add a, reset
i=1: atom b → flush "" as quasi, add b, reset
end: flush "" as tail quasi
Result: quasis=["", "", ""], expressions=[a, b]
→ `${a}${b}`  ✓
```

**`(template "Hello")`** (pure string, no expressions):
```
i=0: string "Hello" → currentSegment = "Hello"
end: flush "Hello" as tail quasi
Result: quasis=["Hello"], expressions=[]
→ `Hello`  ✓
```

**`(template name)`** (single expression):
```
i=0: atom name → flush "" as quasi, add name, reset
end: flush "" as tail quasi
Result: quasis=["", ""], expressions=[name]
→ `${name}`  ✓
```

### Compiler Pitfall: `raw` vs `cooked`

ESTree `TemplateElement` has both `value.raw` and `value.cooked`. The difference:
- `raw` is the literal text as written in source (backslashes not processed)
- `cooked` is the processed version (backslashes interpreted as escape sequences)

For lykn, we set both to the same value. The reader has already processed escape sequences in string literals (e.g., `\n` → newline). So by the time we see the string value, it's already "cooked". Setting `raw = cooked = value` is correct for our use case.

If you set `raw` to something different from `cooked`, astring may produce unexpected output. Keep them identical.

### Compiler Pitfall: `tail` Flag

The LAST element in `quasis` MUST have `tail: true`. All others MUST have `tail: false`. If you get this wrong, astring will malformat the template literal. The algorithm above handles this correctly — it sets `tail: false` during the loop and `tail: true` on the final flush.

### Compiler Pitfall: Nested Templates

`(template "outer " (template "inner " x) " end")` — a template inside a template. The inner `(template ...)` is a non-string arg, so it's compiled as an expression via `compileExpr`. This produces a nested `TemplateLiteral` node. astring handles this correctly — it generates `` `outer ${`inner ${x}`} end` ``. No special handling needed.

---

## 3.2 `tag` — Tagged Template Literals

**Design doc**: `0005-dd-05-template-literals.md`

**Syntax**: `(tag fn (template ...))`

**What it produces**: `TaggedTemplateExpression`

```lisp
(tag html (template "<div>" content "</div>"))
```
→
```js
html`<div>${content}</div>`
```

### Implementation

```js
'tag'(args) {
  if (args.length !== 2) {
    throw new Error('tag requires exactly 2 arguments: (tag function (template ...))');
  }

  // Verify the second argument is a template form
  if (args[1].type !== 'list' || args[1].values.length === 0 ||
      args[1].values[0].type !== 'atom' || args[1].values[0].value !== 'template') {
    throw new Error('tag: second argument must be a (template ...) form');
  }

  const tag = compileExpr(args[0]);
  const quasi = compileExpr(args[1]);  // compiles the template form

  return {
    type: 'TaggedTemplateExpression',
    tag,
    quasi,  // this is the TemplateLiteral node from compiling (template ...)
  };
},
```

### Compiler Pitfall: The Field Name is `quasi`, Not `template`

ESTree's `TaggedTemplateExpression` has `tag` and `quasi`. The `quasi` field holds a `TemplateLiteral` node. Don't name it `template` — that's not the ESTree field name and astring won't find it.

### Compiler Pitfall: Verify BEFORE Compiling

The check that `args[1]` is a `(template ...)` form inspects the RAW reader node (checking `args[1].type === 'list'` and `args[1].values[0].value === 'template'`). Then it compiles via `compileExpr(args[1])` which dispatches to `macros['template']` and returns a `TemplateLiteral` node. If you tried to compile first and check after, you'd need to inspect the ESTree node type instead, which is messier.

---

## 3.3 `spread` — Spread Element

**Design doc**: `0006-dd-06-destructuring-patterns.md`

**Syntax**: `(spread expr)`

**What it produces**: `SpreadElement`

```lisp
(array 1 2 (spread rest))         ;; → [1, 2, ...rest]
(foo a (spread args))             ;; → foo(a, ...args)
(object (name "x") (spread obj))  ;; → { name: "x", ...obj }  (after 3.5 rewrite)
```

### Implementation

```js
'spread'(args) {
  if (args.length !== 1) {
    throw new Error('spread takes exactly one argument');
  }
  return {
    type: 'SpreadElement',
    argument: compileExpr(args[0]),
  };
},
```

### How It Works in Different Contexts

`spread` is a macro that always produces a `SpreadElement` node. The contexts that accept it are:

| Context | ESTree container | How it works |
|---------|-----------------|--------------|
| `(array ... (spread x))` | `ArrayExpression.elements` | The `array` macro calls `compileExpr` on each arg. If an arg is `(spread x)`, `compileExpr` dispatches to `macros['spread']` and returns a `SpreadElement`. The `array` macro puts it in the `elements` array. astring generates `...x`. |
| `(foo (spread args))` | `CallExpression.arguments` | Same mechanism — `compileExpr` returns `SpreadElement`, it goes in the `arguments` array. |
| `(object ... (spread obj))` | `ObjectExpression.properties` | After the 3.5 rewrite, the `object` macro will handle `(spread ...)` sub-lists specially. |

**No changes needed to the existing `array` macro** — it already calls `compileExpr` on all elements, and `SpreadElement` is valid in `ArrayExpression.elements`.

**No changes needed to the CallExpression path** — the default list handler already calls `compileExpr` on all arguments, and `SpreadElement` is valid in `CallExpression.arguments`.

The only special handling is in the `object` rewrite (3.5), where `(spread ...)` is detected as a structural pattern within the object's children.

### Compiler Pitfall: `SpreadElement` vs `RestElement`

ESTree has TWO spread/rest node types:
- `SpreadElement` — used in expressions (spread INTO arrays, calls, objects)
- `RestElement` — used in patterns (collect remaining elements in destructuring)

Phase 3 only uses `SpreadElement`. Phase 4 will use `RestElement` for `(rest ...)` in destructuring patterns. Don't confuse them — they're different ESTree nodes even though they both compile to `...x` in the output.

### Compiler Pitfall: `spread` IS a Standalone Macro

Unlike `alias` and `default` (which are structural patterns recognized in specific contexts), `spread` is a proper standalone macro in the `macros` object. This is because `SpreadElement` is always the result of compiling a `(spread ...)` form, regardless of context. The parent form doesn't need to "see" the spread — it just gets a `SpreadElement` node back from `compileExpr`.

---

## 3.4 `default` — Default Parameter Values

**Design doc**: `0006-dd-06-destructuring-patterns.md`

**Syntax**: `(default name value)` inside a function parameter list

**What it produces**: `AssignmentPattern`

```lisp
(function greet ((default name "world"))
  (console:log (template "Hello, " name "!")))
```
→
```js
function greet(name = "world") {
  console.log(`Hello, ${name}!`);
}
```

### Implementation

```js
'default'(args) {
  if (args.length !== 2) {
    throw new Error('default requires exactly 2 arguments: (default name value)');
  }
  return {
    type: 'AssignmentPattern',
    left: compileExpr(args[0]),
    right: compileExpr(args[1]),
  };
},
```

### How It Works in Function Params

The existing `function`, `lambda`, and `=>` macros compile parameter lists by calling `compileExpr` on each parameter node. When a parameter is `(default name "world")`:

1. `compileExpr` sees a list with head atom `default`
2. Dispatches to `macros['default']`
3. Returns an `AssignmentPattern` node: `{ left: Identifier("name"), right: Literal("world") }`
4. This goes into the function's `params` array

astring generates `name = "world"` for an `AssignmentPattern` in parameter position. No changes to the function macros needed.

### Compiler Pitfall: `default` IS a Standalone Macro (For Now)

In Phase 3, `default` is a macro that always produces `AssignmentPattern`. This works for function parameters.

In Phase 4, `default` will ALSO appear inside destructuring patterns: `(const (object (default x 0)) point)`. In that context, `default` still produces `AssignmentPattern` — the same ESTree node. So the macro works unchanged in Phase 4. The destructuring pattern compiler will call `compileExpr` on its children, which dispatches to `macros['default']` and gets the right node.

However: in Phase 4's `import` rename context, `(alias original local default-val)` uses a THREE-argument alias form for rename-with-default. That's handled inside `buildImportSpecifier`, not via the `default` macro. Don't confuse these two uses.

### Compiler Pitfall: `left` Can Be a Pattern (in Phase 4)

`AssignmentPattern.left` accepts any `Pattern` node, not just `Identifier`. In Phase 4, you might see:

```lisp
(function f ((default (object x y) (object (x 0) (y 0))))
  ...)
```
→
```js
function f({ x, y } = { x: 0, y: 0 }) { ... }
```

This will work automatically because `compileExpr(args[0])` will compile the `(object x y)` in pattern context (Phase 4) and return an `ObjectPattern`. The `default` macro doesn't need to know — it just puts whatever `compileExpr` returns into `left`.

---

## 3.5 `object` — Rewrite to Grouped Pairs

**Design doc**: `0006-dd-06-destructuring-patterns.md` (amendment)

### What's Changing

The existing `object` macro uses **flat alternating pairs**:
```lisp
;; OLD (v0.0.1) — being REMOVED
(object name "Duncan" age 42)
```

It's being replaced with **grouped pairs**:
```lisp
;; NEW (v0.1.0)
(object (name "Duncan") (age 42))
```

This is a **breaking change** from v0.0.1. The old syntax is gone.

### Why the Change

The flat pair syntax is ambiguous when combined with spread, shorthand, and computed properties. Grouped pairs make each property self-contained:

```lisp
;; Grouped pairs — every use case is unambiguous:
(object
  (name "Duncan")                     ;; key-value pair
  age                                 ;; shorthand (key = value = age)
  (spread defaults)                   ;; spread
  ((computed key-expr) "value"))      ;; computed key
```

With flat pairs, `(object name age spread defaults)` is ambiguous — is `spread` a key or a spread operator?

### The New Rules

Each child of `(object ...)` is one of:

| Child shape | What it produces | Example |
|-------------|-----------------|---------|
| Bare atom `name` | Shorthand property | `name` → `{ name }` |
| Two-element list `(key value)` | Regular property | `(name "Duncan")` → `{ name: "Duncan" }` |
| `(spread expr)` | SpreadElement | `(spread obj)` → `{ ...obj }` |
| `((computed key-expr) value)` | Computed property | `((computed k) v)` → `{ [k]: v }` |
| Single-element sub-list `(name)` | **Compile-time error** | Ambiguous — did they mean shorthand? |

### Implementation

**Replace the entire existing `object` macro** with:

```js
'object'(args) {
  const properties = [];

  for (const child of args) {
    if (child.type === 'atom') {
      // Bare atom → shorthand property { name } where key and value are the same
      const name = toCamelCase(child.value);
      properties.push({
        type: 'Property',
        key: { type: 'Identifier', name },
        value: { type: 'Identifier', name },
        kind: 'init',
        computed: false,
        shorthand: true,
        method: false,
      });
    } else if (child.type === 'list') {
      // List child — check what kind
      if (child.values.length === 0) {
        throw new Error('object: empty sub-list is not allowed');
      }

      // Check for (spread expr)
      if (child.values[0].type === 'atom' && child.values[0].value === 'spread') {
        if (child.values.length !== 2) {
          throw new Error('spread takes exactly one argument');
        }
        properties.push({
          type: 'SpreadElement',
          argument: compileExpr(child.values[1]),
        });
        continue;
      }

      // Check for ((computed key-expr) value) — first element is itself a list
      if (child.values[0].type === 'list') {
        const innerList = child.values[0];
        if (innerList.values.length === 2 &&
            innerList.values[0].type === 'atom' &&
            innerList.values[0].value === 'computed') {
          if (child.values.length !== 2) {
            throw new Error('object: computed property requires a value: ((computed key) value)');
          }
          properties.push({
            type: 'Property',
            key: compileExpr(innerList.values[1]),
            value: compileExpr(child.values[1]),
            kind: 'init',
            computed: true,
            shorthand: false,
            method: false,
          });
          continue;
        }
      }

      // Regular (key value) pair
      if (child.values.length === 1) {
        throw new Error(
          'object: single-element sub-list (' + 
          (child.values[0].type === 'atom' ? child.values[0].value : '...') +
          ') is ambiguous — use a bare atom for shorthand'
        );
      }

      if (child.values.length !== 2) {
        throw new Error('object: each property must be (key value), got ' + child.values.length + ' elements');
      }

      const keyNode = child.values[0];
      properties.push({
        type: 'Property',
        key: keyNode.type === 'atom'
          ? { type: 'Identifier', name: toCamelCase(keyNode.value) }
          : compileExpr(keyNode),
        value: compileExpr(child.values[1]),
        kind: 'init',
        computed: false,
        shorthand: false,
        method: false,
      });
    } else {
      throw new Error('object: each element must be an atom (shorthand) or a list (key value)');
    }
  }

  return { type: 'ObjectExpression', properties };
},
```

### Compiler Pitfall: `shorthand: true` for Bare Atoms

When a bare atom `name` appears as a child of `object`, it produces a SHORTHAND property — where the key and value are the same identifier. In the ESTree `Property` node, `shorthand: true` tells astring to generate `{ name }` instead of `{ name: name }`.

**Both `key` and `value` must be identical `Identifier` nodes** with the SAME camelCased name. Don't accidentally apply `toCamelCase` to only one of them.

### Compiler Pitfall: `spread` Inside `object` is Detected Structurally

When the `object` macro encounters a list child whose head is `spread`, it builds the `SpreadElement` inline rather than calling `compileExpr` on the whole list. This is because if you called `compileExpr` on `(spread obj)`, it would dispatch to `macros['spread']` and return a `SpreadElement` — which would work. BUT then the `object` macro wouldn't know it's a spread vs a regular property.

Actually, either approach works — but the structural detection approach is clearer about intent and gives better error messages. The code above uses structural detection.

### Compiler Pitfall: `computed` is a Nested List Pattern

`((computed key-expr) value)` — the first element of the property sub-list is ITSELF a list `(computed key-expr)`. This is a three-level nesting:
- `object` list → child sub-list → first element is a list `(computed ...)`

Check `child.values[0].type === 'list'` to detect this. Then check inside that inner list for the `computed` atom.

### Compiler Pitfall: String Keys

What about `(object ("content-type" "text/plain"))`? The key is a string, not an atom. This should produce `{ "content-type": "text/plain" }`. The implementation handles this: when `keyNode.type !== 'atom'`, it falls through to `compileExpr(keyNode)`, which produces `Literal("content-type")`. The `computed` flag stays `false` (string keys are not computed — they're static, just not identifiers).

Wait — actually, in ESTree, a non-identifier string key still uses `computed: false`. The `computed` flag is specifically about bracket notation (`[expr]`). A string literal key like `"content-type"` uses `computed: false` with a `Literal` key node. astring will output `{"content-type": "text/plain"}`. This is correct.

### Test Cases for the New Object Syntax

```js
// Basic grouped pairs
(object (name "Duncan") (age 42))
→ ({name: "Duncan", age: 42})  // or { name: "Duncan", age: 42 } depending on astring

// Shorthand
(object name age)
→ ({name, age})

// Mixed
(object (name "Duncan") age)
→ ({name: "Duncan", age})

// Spread
(object (name "x") (spread defaults))
→ ({name: "x", ...defaults})

// Computed key
(object ((computed key) "value"))
→ ({[key]: "value"})

// String key (for headers, etc.)
(object ("content-type" "text/plain"))
→ ({"content-type": "text/plain"})

// With camelCase
(object (my-name "Duncan") (my-age 42))
→ ({myName: "Duncan", myAge: 42})

// Empty object
(object)
→ ({})

// Single-element sub-list → error
(object (name))
→ ERROR: ambiguous
```

---

## 3.6 Tests

### File Organization

```
test/
  forms/
    template.test.js
    tag.test.js
    spread.test.js
    default-params.test.js
    object.test.js         ← rewritten for new syntax
```

### Test Pattern (Same as Phases 1–2)

```js
import { assertEquals, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { read } from "../../src/reader.js";
import { compile } from "../../src/compiler.js";

function lykn(source) {
  return compile(read(source)).trim();
}
```

### `test/forms/template.test.js`

This is the most important test file in Phase 3. Exercise every interleaving case:

```js
Deno.test("template: string only", () => {
  assertEquals(lykn('(template "hello")'), '`hello`;');
});

Deno.test("template: expression only", () => {
  assertEquals(lykn('(template name)'), '`${name}`;');
});

Deno.test("template: string-expr-string", () => {
  assertEquals(lykn('(template "Hello, " name "!")'), '`Hello, ${name}!`;');
});

Deno.test("template: two adjacent expressions", () => {
  assertEquals(lykn('(template a b)'), '`${a}${b}`;');
});

Deno.test("template: expression at start", () => {
  assertEquals(lykn('(template name " is here")'), '`${name} is here`;');
});

Deno.test("template: expression at end", () => {
  assertEquals(lykn('(template "value: " x)'), '`value: ${x}`;');
});

Deno.test("template: multiple expressions with strings", () => {
  assertEquals(lykn('(template "a=" a ", b=" b)'), '`a=${a}, b=${b}`;');
});

Deno.test("template: three adjacent expressions", () => {
  assertEquals(lykn('(template a b c)'), '`${a}${b}${c}`;');
});

Deno.test("template: empty", () => {
  assertEquals(lykn('(template)'), '``;');
});

Deno.test("template: expression is a call", () => {
  assertEquals(lykn('(template "Result: " (compute x))'), '`Result: ${compute(x)}`;');
});

Deno.test("template: nested template", () => {
  const result = lykn('(template "outer " (template "inner " x) " end")');
  // Should contain nested backticks
  assertEquals(result.includes('`outer ${`inner ${x}`} end`'), true);
});
```

**Important**: astring's exact output format for template literals may vary. Run the first test, see exactly what astring produces (backtick placement, semicolons, etc.), and adjust all tests to match.

### `test/forms/tag.test.js`

```js
Deno.test("tag: basic tagged template", () => {
  const result = lykn('(tag html (template "<div>" content "</div>"))');
  // Should produce: html`<div>${content}</div>`
  assertEquals(result.includes('html`'), true);
  assertEquals(result.includes('${content}'), true);
});

Deno.test("tag: tag is a member expression", () => {
  const result = lykn('(tag String:raw (template "\\n"))');
  assertEquals(result.includes('String.raw`'), true);
});

Deno.test("tag: non-template second arg throws", () => {
  assertThrows(() => lykn('(tag html "not a template")'));
});
```

### `test/forms/spread.test.js`

```js
Deno.test("spread: in array", () => {
  assertEquals(lykn('(array 1 2 (spread rest))'), '[1, 2, ...rest];');
});

Deno.test("spread: in function call", () => {
  assertEquals(lykn('(foo (spread args))'), 'foo(...args);');
});

Deno.test("spread: in array at start", () => {
  assertEquals(lykn('(array (spread first) 4 5)'), '[...first, 4, 5];');
});
```

### `test/forms/default-params.test.js`

```js
Deno.test("default: in arrow params", () => {
  const result = lykn('(const f (=> ((default x 0)) x))');
  assertEquals(result.includes('x = 0'), true);
});

Deno.test("default: in function params", () => {
  const result = lykn('(function greet ((default name "world")) (return name))');
  assertEquals(result.includes('name = "world"'), true);
});

Deno.test("default: multiple defaults", () => {
  const result = lykn('(=> ((default x 0) (default y 0)) (+ x y))');
  assertEquals(result.includes('x = 0'), true);
  assertEquals(result.includes('y = 0'), true);
});
```

### `test/forms/object.test.js`

```js
Deno.test("object: grouped pairs", () => {
  const result = lykn('(object (name "Duncan") (age 42))');
  assertEquals(result.includes('name'), true);
  assertEquals(result.includes('"Duncan"'), true);
  assertEquals(result.includes('age'), true);
  assertEquals(result.includes('42'), true);
});

Deno.test("object: shorthand", () => {
  const result = lykn('(object name age)');
  // Should produce {name, age} with shorthand: true
  assertEquals(result.includes('{name, age}') || result.includes('{ name, age }'), true);
});

Deno.test("object: spread", () => {
  const result = lykn('(object (name "x") (spread defaults))');
  assertEquals(result.includes('...defaults'), true);
});

Deno.test("object: camelCase keys", () => {
  const result = lykn('(object (my-name "Duncan"))');
  assertEquals(result.includes('myName'), true);
});

Deno.test("object: empty", () => {
  assertEquals(lykn('(object)'), '({});');
});

Deno.test("object: single-element sub-list throws", () => {
  assertThrows(() => lykn('(object (name))'));
});

Deno.test("object: computed key", () => {
  const result = lykn('(object ((computed key) "value"))');
  assertEquals(result.includes('[key]'), true);
});

Deno.test("object: string key", () => {
  const result = lykn('(object ("content-type" "text/plain"))');
  assertEquals(result.includes('"content-type"'), true);
});
```

---

## Summary of All Changes to `compiler.js`

| What | Where | Notes |
|------|-------|-------|
| `makeTemplateElement()` function | Module level, near `toCamelCase` | Helper for template |
| `macros['template']` | In `macros` object | New |
| `macros['tag']` | In `macros` object | New |
| `macros['spread']` | In `macros` object | New |
| `macros['default']` | In `macros` object | New |
| `macros['object']` | In `macros` object | **REWRITE** — replace the existing implementation entirely |

### Files Changed

| File | Action |
|------|--------|
| `src/compiler.js` | Add 4 macros, 1 helper, rewrite `object` macro |
| `test/forms/template.test.js` | New file |
| `test/forms/tag.test.js` | New file |
| `test/forms/spread.test.js` | New file |
| `test/forms/default-params.test.js` | New file |
| `test/forms/object.test.js` | New or rewritten |

### What NOT to Do

- **Do not implement destructuring patterns.** That's Phase 4. `object` and `array` in Phase 3 only handle the EXPRESSION/CONSTRUCTION side, not the pattern/destructuring side.
- **Do not implement `rest`.** `rest` is a Phase 4 concept (destructuring rest elements). Phase 3 only has `spread` (expression-side spreading).
- **Do not implement `alias`.** It was discussed in Phase 2 as a structural pattern in `import`/`export`. In Phase 4, it'll appear in destructuring. It's never a standalone macro.
- **Do not modify the reader.** Template literals are handled entirely in the compiler via the `template` form — no reader-level backtick support.
- **Do not change the existing `array` macro.** It already works with `SpreadElement` nodes returned by `compileExpr`.

---

## Verification Checklist

- [ ] `(template "Hello, " name "!")` compiles to `` `Hello, ${name}!` ``
- [ ] `(template a b)` compiles to `` `${a}${b}` `` (with inferred empty quasis)
- [ ] `(template "hello")` compiles to `` `hello` ``
- [ ] `(template)` compiles to `` `` `` (empty template)
- [ ] `(tag html (template "x" y "z"))` compiles to `` html`x${y}z` ``
- [ ] `(tag html "not-template")` throws
- [ ] `(spread x)` produces a `SpreadElement` node
- [ ] `(array 1 (spread rest))` compiles to `[1, ...rest]`
- [ ] `(=> ((default x 0)) x)` compiles with `x = 0` in params
- [ ] `(object (name "Duncan") (age 42))` compiles with grouped pair syntax
- [ ] `(object name age)` compiles with shorthand properties
- [ ] `(object (spread defaults))` compiles with `...defaults`
- [ ] `(object (name))` throws (ambiguous single-element sub-list)
- [ ] `(object ((computed key) "val"))` compiles with `[key]: "val"`
- [ ] Old flat syntax `(object name "Duncan" age 42)` NO LONGER WORKS (breaking change confirmed)
- [ ] `deno test test/` passes all tests
- [ ] `deno lint src/` passes
