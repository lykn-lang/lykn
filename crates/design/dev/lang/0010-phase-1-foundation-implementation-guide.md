# Phase 1 — Foundation: Implementation Guide

**For**: Claude Code
**Scope**: Phase 1 of lykn v0.1.0 (camelCase, colon syntax, `get` form, special atoms, `.` removal)
**Where you're working**: `src/compiler.js` — this is the only file you modify
**Design authority**: `crates/design/dev/lang/0001-dd-01-colon-syntax-and-camelcase-conversion.md`
**Secondary reference**: `crates/design/dev/lang/0008-dd-08-special-atoms-update-operators-and-miscellaneous-forms.md` (for `this`/`super`)

---

## What You're Building (and Why It Matters)

Phase 1 establishes the **identity transformation layer** that every subsequent phase depends on. Lykn uses lisp-case identifiers (`my-function`, `get-element-by-id`) and colon-delimited member access (`console:log`, `this:name`). These must be reliably converted to JavaScript's camelCase identifiers and dot-notation member expressions *before* any form compilation happens.

If Phase 1 is wrong, everything built on top of it — function declarations, imports, classes, destructuring — will emit broken JavaScript. This is the foundation.

### The Pipeline

```
.lykn source
    → reader.js (UNTOUCHED — do not modify)
    → compiler.js (ALL your work is here)
    → astring (vendored — do not modify)
    → JavaScript output
```

The reader produces a simple AST with four node types:

```js
{ type: 'atom',   value: 'console:log' }    // identifiers, keywords, operators
{ type: 'string', value: 'hello' }           // "hello"
{ type: 'number', value: 42 }                // 42
{ type: 'list',   values: [node, node, ...] } // (anything in parens)
```

Your job in `compiler.js` is to transform these into ESTree AST nodes that astring can generate valid JavaScript from.

---

## 1. The Existing Code You're Modifying

Open `src/compiler.js` and read it fully before starting. Here's what you need to know:

**Current structure:**
- A `macros` object maps form names (strings) to handler functions. Each handler receives `args` (the list elements after the head atom) and returns an ESTree node.
- `compileExpr(node)` is the recursive core. It dispatches on `node.type`: atoms become `Identifier`/`Literal`, strings/numbers become `Literal`, lists check the head atom against `macros` or default to `CallExpression`.
- `toStatement(node)` wraps expression nodes in `ExpressionStatement` when needed.
- `compile(exprs)` takes the reader output (array of top-level nodes) and produces a JS string.
- Binary operators (`+`, `-`, `===`, etc.) and unary operators (`!`, `typeof`, etc.) are registered in bulk loops.

**Current atom handling (lines ~254–259 — this is what you're changing):**

```js
case 'atom':
  if (node.value === 'true') return { type: 'Literal', value: true };
  if (node.value === 'false') return { type: 'Literal', value: false };
  if (node.value === 'null') return { type: 'Literal', value: null };
  if (node.value === 'undefined') return { type: 'Identifier', name: 'undefined' };
  return { type: 'Identifier', name: node.value };
```

This is the insertion point for camelCase conversion, colon splitting, and special atoms. You're replacing the final `return` line and adding logic before it.

**Current `.` form (lines ~49–85):** This is the `macros['.']` handler. You will **delete this entirely** in step 5.

**Current `object` form (lines ~184–200):** Uses flat alternating pairs `(object key1 val1 key2 val2)`. Phase 3 will change this to grouped pairs, but **do not change it in Phase 1**. Leave it alone.

---

## 2. Task 1.1 — `toCamelCase()` Function

### What It Does

Converts lisp-case identifiers to JavaScript camelCase. This runs on every `Identifier` name the compiler emits — it's the most-called utility in the entire compiler.

### Where to Put It

Add it as a module-level function near the top of `compiler.js`, after the import and before the `macros` object. It's not a macro — it's a utility.

### Implementation: Character Walk, Not Regex

**Why not regex?** Regex-based approaches fail on edge cases like consecutive hyphens, leading/trailing hyphens, and mixed-case preservation. A character walk handles all cases in a single pass and is easier to reason about.

### The Algorithm

Walk through the input string character by character, tracking your state:

```
STATE: { atStart: true, afterHyphen: false, leadingHyphens: true }
```

For each character:

1. **If it's a hyphen and we're still in leading position** (no non-hyphen seen yet): emit an underscore. This handles `-foo` → `_foo` and `--foo` → `__foo`.

2. **If it's a hyphen and we're past the leading position**: set a flag that the next letter should be uppercased. Do NOT emit the hyphen. If the *next* character is also a hyphen (consecutive mid-word hyphens like `foo--bar`), treat the whole run as a single word boundary — only one uppercase transition.

3. **If it's a letter and the "uppercase next" flag is set**: emit the letter uppercased, clear the flag.

4. **If it's a hyphen at the very end of the string** (trailing): emit an underscore.

5. **Otherwise**: emit the character as-is.

### Edge Case Table (These Are Your Test Cases)

| Input | Output | Why |
|-------|--------|-----|
| `my-function` | `myFunction` | Standard conversion |
| `get-x` | `getX` | Single-letter segment |
| `get-HTTP-response` | `getHTTPResponse` | The `H` is already uppercase; hyphen removal + uppercase of next char = `H` stays uppercase. The `R` in `response` gets uppercased. The `TTP` in the middle is already uppercase and passes through. |
| `-foo` | `_foo` | Leading hyphen = underscore |
| `--foo` | `__foo` | Multiple leading hyphens = same count underscores |
| `foo-` | `foo_` | Trailing hyphen = underscore |
| `foo--bar` | `fooBar` | Consecutive mid-word hyphens = single word boundary |
| `JSON` | `JSON` | No hyphens = no conversion at all |
| `_private` | `_private` | Existing underscores pass through unchanged |
| `my-var-name` | `myVarName` | Multiple segments |
| `x` | `x` | Single char, no hyphens |
| `a-b-c` | `aBC` | All single-letter segments |
| `get-element-by-id` | `getElementById` | Real-world DOM method |
| `inner-HTML` | `innerHTML` | Preserves existing uppercase |

### Compiler Pitfall: The `get-HTTP-response` Case

This is tricky. When you encounter `get-HTTP-response`:
- `get` + `-` → next char `H` gets uppercased → `H` (was already uppercase, so no visible change)
- `HTTP` has no hyphens, passes through as-is
- `-` before `response` → `r` uppercased to `R`
- Result: `getHTTPResponse`

The key insight is that "uppercase the character after a hyphen" is idempotent on already-uppercase characters. You don't need special handling for "the segment was already uppercase" — the algorithm naturally preserves it.

### Compiler Pitfall: Don't Apply camelCase to Non-Identifier Atoms

The atoms `true`, `false`, `null`, `undefined` are handled by the special-case checks in `compileExpr` *before* your camelCase logic runs. The check order must be:

```
1. true/false/null/undefined → Literal / Identifier (BEFORE camelCase)
2. this/super → ThisExpression / Super (BEFORE camelCase)
3. colon check → MemberExpression chain (applies camelCase to each segment)
4. regular atom → Identifier with camelCase applied
```

Also: operator names like `+`, `===`, `typeof`, `!` are dispatched from the list/macro path, never from the atom path. They come in as `head.value` in a list, checked against `macros`. So they never hit `toCamelCase`. You only call `toCamelCase` on atoms that will become `Identifier` nodes.

---

## 3. Task 1.2 — Colon Splitting (Member Access)

### What It Does

When the reader sees `console:log`, it produces a single atom:
```js
{ type: 'atom', value: 'console:log' }
```

The compiler must split this into a `MemberExpression`:
```js
{
  type: 'MemberExpression',
  object: { type: 'Identifier', name: 'console' },
  property: { type: 'Identifier', name: 'log' },
  computed: false
}
```

For chains like `process:argv:slice`, you build nested `MemberExpression` nodes left-to-right:
```js
// process:argv:slice  →  process.argv.slice
{
  type: 'MemberExpression',
  object: {
    type: 'MemberExpression',
    object: { type: 'Identifier', name: 'process' },
    property: { type: 'Identifier', name: 'argv' },
    computed: false
  },
  property: { type: 'Identifier', name: 'slice' },
  computed: false
}
```

### Where This Goes

In `compileExpr`, in the `case 'atom':` branch, **after** the `true`/`false`/`null`/`undefined`/`this`/`super` checks but **before** the default `Identifier` return.

### The Algorithm

```
1. If atom value contains ':' AND does NOT start with ':':
   a. Split on ':'
   b. Validate: no empty segments, no trailing colon, no numeric segments
   c. For each segment: apply toCamelCase
   d. Build the first node:
      - If segment is 'this' → { type: 'ThisExpression' }
      - If segment is 'super' → { type: 'Super' }
      - Otherwise → { type: 'Identifier', name: toCamelCase(segment) }
   e. For each subsequent segment:
      result = {
        type: 'MemberExpression',
        object: result,
        property: { type: 'Identifier', name: toCamelCase(segment) },
        computed: false
      }
   f. Return result

2. If atom value starts with ':':
   Throw: "Leading colon syntax is reserved for future use"

3. If atom is just ':':
   Throw: "Bare colon is not a valid identifier"
```

### Compiler Pitfall: camelCase Applies to Each Segment Independently

`my-obj:get-value` becomes `myObj.getValue`, NOT `myObj.getvalue` or `myObjGetValue`. Each segment between colons is camelCased on its own. The colon is a member access delimiter, not a word boundary.

### Compiler Pitfall: `this` and `super` as First Segment

`this:name` must produce:
```js
{
  type: 'MemberExpression',
  object: { type: 'ThisExpression' },  // NOT Identifier("this")
  property: { type: 'Identifier', name: 'name' },
  computed: false
}
```

`super:constructor` must produce:
```js
{
  type: 'MemberExpression',
  object: { type: 'Super' },  // NOT Identifier("super")
  property: { type: 'Identifier', name: 'constructor' },
  computed: false
}
```

If you emit `Identifier("this")` instead of `ThisExpression`, astring will generate `this` as a variable name reference rather than the keyword — which happens to work in most cases but is technically wrong per ESTree and can break in strict mode analysis or when other tools consume the AST. Use the correct node types.

### Compiler Pitfall: `this` and `super` as Bare Atoms (Without Colon)

These must ALSO be handled even when there's no colon. A bare `this` in an expression position (e.g., `(return this)`) comes through as `{ type: 'atom', value: 'this' }`. Add these checks to the atom handling, before the colon check:

```
if (node.value === 'this') return { type: 'ThisExpression' };
if (node.value === 'super') return { type: 'Super' };
```

### Compiler Pitfall: The Order of Checks in `compileExpr`'s Atom Branch

The full atom branch should check in this order:

```
1. true / false / null    → Literal
2. undefined              → Identifier('undefined')
3. this                   → ThisExpression
4. super                  → Super
5. starts with ':'        → error (reserved)
6. contains ':'           → colon split → MemberExpression chain
7. default                → Identifier with toCamelCase
```

If you put the colon check before `this`/`super`, atoms like `this` (without colon) would fall through to the default Identifier path. If you put `toCamelCase` on the `this`/`super` atoms, you'd try to camelCase the keyword (harmless since it has no hyphens, but wrong in principle).

### Error Cases

| Input | Error |
|-------|-------|
| `:foo` | "Leading colon syntax is reserved for future use" |
| `foo:` | "Trailing colon in member expression" |
| `:` | "Bare colon is not a valid identifier" |
| `obj:0` | "Numeric segment in colon syntax — use (get obj 0) for computed access" |
| `foo::bar` | Split produces empty segment → "Empty segment in colon syntax" |

### How to Detect Numeric Segments

After splitting on `:`, check each segment: if `segment` matches `/^\d/` (starts with a digit), it's a numeric segment. Error out and suggest `(get obj 0)` instead.

### Test Cases for Colon Syntax

| Input Atom | Generated JS | ESTree Summary |
|-----------|-------------|----------------|
| `console:log` | `console.log` | `MemberExpression(Identifier("console"), Identifier("log"))` |
| `this:name` | `this.name` | `MemberExpression(ThisExpression, Identifier("name"))` |
| `this:my-name` | `this.myName` | `MemberExpression(ThisExpression, Identifier("myName"))` |
| `super:constructor` | `super.constructor` | `MemberExpression(Super, Identifier("constructor"))` |
| `process:argv:slice` | `process.argv.slice` | Nested MemberExpressions, 3 deep |
| `Math:PI` | `Math.PI` | `MemberExpression(Identifier("Math"), Identifier("PI"))` — no camelCase effect since no hyphens |
| `my-obj:get-value` | `myObj.getValue` | Both segments camelCased independently |
| `response:json` | `response.json` | Simple two-segment |
| `foo` | `foo` | No colon → normal Identifier |
| `my-function` | `myFunction` | No colon → Identifier with camelCase |

---

## 4. Task 1.3 — `get` Form (Computed Access)

### What It Does

`(get obj key)` compiles to `obj[key]` — a `MemberExpression` with `computed: true`. This is the counterpart to colon syntax: colons are for static (compile-time known) property names, `get` is for dynamic (runtime) keys.

### Where This Goes

Add a new entry in the `macros` object:

```js
'get'(args) {
  if (args.length !== 2) {
    throw new Error('get requires exactly 2 arguments: (get object key)');
  }
  return {
    type: 'MemberExpression',
    object: compileExpr(args[0]),
    property: compileExpr(args[1]),
    computed: true,
  };
}
```

### Compiler Pitfall: `get` Does NOT Conflict with Future Class Accessors

In Phase 5 (classes), `get` inside a class body will be a keyword marker for getter methods. That's a completely different context — class body compilation will have its own dispatch logic that checks for `get`/`set` as head atoms *within* the class body compiler, not in the general `macros` table. The `macros['get']` handler only fires when `get` is the head of a list in expression context.

Don't worry about this conflict now. Just implement `get` as a regular macro. Phase 5 will handle the class body context separately.

### Test Cases

| lykn | JS Output | Notes |
|------|-----------|-------|
| `(get arr 0)` | `arr[0]` | Numeric index |
| `(get obj "name")` | `obj["name"]` | String key |
| `(get obj key)` | `obj[key]` | Variable key |
| `(get (get matrix 0) 1)` | `matrix[0][1]` | Nested computed access |
| `(get args (- len 1))` | `args[len - 1]` | Expression as key |

---

## 5. Task 1.4 — Special Atoms: `this` and `super`

### What They Are

In JavaScript, `this` and `super` are not regular identifiers — they're keywords with dedicated ESTree node types. If you emit them as `Identifier` nodes, the AST is technically malformed.

### Where This Goes

Already covered in the atom handling order described in Task 1.2 above. The checks for bare `this` and `super` atoms (without colons) go in `compileExpr`'s `case 'atom':` branch, after the literal checks but before the colon check.

### ESTree Nodes

```js
// this → { type: 'ThisExpression' }
// super → { type: 'Super' }
```

That's it. No properties. These are leaf nodes.

### Test Cases

| lykn | JS Output | ESTree |
|------|-----------|--------|
| `(return this)` | `return this;` | `ReturnStatement(ThisExpression)` |
| `(console:log this)` | `console.log(this)` | `CallExpression` with `ThisExpression` as argument |
| `this` (in expression position) | `this` | `ThisExpression` |
| `super` (bare) | `super` | `Super` |

---

## 6. Task 1.5 — Remove the `.` Form

### What You're Removing

The existing `macros['.']` handler (currently lines ~49–85 in `compiler.js`). This is the v0.0.1 way of doing member access:

```lisp
;; OLD — being removed
(. console log)         ;; → console.log
((. console log) "hi")  ;; → console.log("hi")
```

This is replaced by colon syntax:

```lisp
;; NEW — already works after Tasks 1.1–1.2
console:log             ;; → console.log
(console:log "hi")      ;; → console.log("hi")
```

### How to Remove It

1. Delete the entire `'.'(args) { ... }` entry from the `macros` object.
2. Update the example file `examples/main.lykn` to use colon syntax instead of `.` form.

### Compiler Pitfall: Calls Using `.` Form

In the old syntax, `((. console log) "hi")` was a list whose head was itself a list `(. console log)`. The compiler compiled the head via `compileExpr` (which dispatched to `macros['.']`), got a `MemberExpression`, and wrapped it as the `callee` of a `CallExpression`.

With colon syntax, `(console:log "hi")` works differently. The head of the list is the atom `console:log`. In `compileExpr`, the list handler checks `head.type === 'atom' && macros[head.value]`. Since `console:log` is not in `macros`, it falls through to the `CallExpression` path. The head is compiled via `compileExpr(head)`, which hits the atom branch, sees the colon, splits it, and returns a `MemberExpression`. That MemberExpression becomes the callee. Same result, cleaner syntax.

**This means colon-based method calls already work** once you implement Tasks 1.1–1.2. No additional work needed for the call path. The compiler's existing "lists that aren't macros become CallExpressions" logic handles it.

### Updating `examples/main.lykn`

The current example uses `(. console log)` and `(. Math floor)` etc. Rewrite it to use colon syntax:

```lisp
; lykn example — main.lykn
; A small demo showing s-expression syntax compiling to clean JS.

; Variable declarations
(const greeting "hello, world")

; Function definition using arrow syntax
(const greet (=> (name)
  (console:log (+ greeting ", " name "!"))))

; Call the function
(greet "lykn")

; A slightly more involved example: rotating taglines
(const taglines (array
  "S-expression syntax for JavaScript"
  "Good luck — lykn"
  "Closure, in every sense"))

(const pick (=> ()
  (let idx (Math:floor (* (Math:random) taglines:length)))
  (return (taglines:at idx))))

(console:log (pick))
```

Note how `(. console log)` becomes `console:log`, `(. Math floor)` becomes `Math:floor`, etc. The `(. taglines length)` becomes `taglines:length` and `(. taglines at)` becomes `taglines:at`. Every `.` form call site converts to colon syntax.

---

## 7. Task 1.6 — Tests

### Testing Setup

The project uses Deno for testing. Tests go in a `test/` directory. Create the directory structure:

```
test/
  forms/
    camel-case.test.js
    colon-syntax.test.js
    get.test.js
```

### Test Pattern

Each test imports `read` from the reader and `compile` from the compiler, feeds lykn source through both, and asserts the JS output matches expected output.

```js
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { read } from "../../src/reader.js";
import { compile } from "../../src/compiler.js";

// Helper: compile a lykn string to JS, trimmed
function lykn(source) {
  return compile(read(source)).trim();
}

Deno.test("camelCase: basic hyphenated identifier", () => {
  assertEquals(lykn("my-function"), "myFunction;");
});
```

Note the trailing semicolon — astring adds it to expression statements.

### `test/forms/camel-case.test.js`

Test every row from the edge case table in Task 1.1. Also test camelCase in context — inside function calls, as variable names, etc.

```js
// Test the conversion table
Deno.test("camelCase: my-function → myFunction", () => {
  assertEquals(lykn("my-function"), "myFunction;");
});

Deno.test("camelCase: get-x → getX", () => {
  assertEquals(lykn("get-x"), "getX;");
});

Deno.test("camelCase: get-HTTP-response → getHTTPResponse", () => {
  assertEquals(lykn("get-HTTP-response"), "getHTTPResponse;");
});

Deno.test("camelCase: leading hyphen → underscore", () => {
  assertEquals(lykn("-foo"), "_foo;");
});

Deno.test("camelCase: double leading hyphens → double underscore", () => {
  assertEquals(lykn("--foo"), "__foo;");
});

Deno.test("camelCase: trailing hyphen → trailing underscore", () => {
  assertEquals(lykn("foo-"), "foo_;");
});

Deno.test("camelCase: consecutive mid hyphens → single boundary", () => {
  assertEquals(lykn("foo--bar"), "fooBar;");
});

Deno.test("camelCase: all-caps no hyphens → unchanged", () => {
  assertEquals(lykn("JSON"), "JSON;");
});

Deno.test("camelCase: existing underscore → unchanged", () => {
  assertEquals(lykn("_private"), "_private;");
});

// Test in context
Deno.test("camelCase: in variable declaration", () => {
  assertEquals(lykn('(const my-var 42)'), "const myVar = 42;");
});

Deno.test("camelCase: in function call arguments", () => {
  assertEquals(lykn('(foo my-arg)'), "foo(myArg);");
});

Deno.test("camelCase: get-element-by-id real-world", () => {
  assertEquals(lykn("get-element-by-id"), "getElementById;");
});
```

### `test/forms/colon-syntax.test.js`

Test colon splitting, chaining, `this`/`super` integration, error cases.

```js
Deno.test("colon: simple member access", () => {
  assertEquals(lykn("console:log"), "console.log;");
});

Deno.test("colon: method call", () => {
  assertEquals(lykn('(console:log "hi")'), 'console.log("hi");');
});

Deno.test("colon: three-segment chain", () => {
  assertEquals(lykn("process:argv:length"), "process.argv.length;");
});

Deno.test("colon: this member access", () => {
  assertEquals(lykn("this:name"), "this.name;");
});

Deno.test("colon: this with camelCase", () => {
  assertEquals(lykn("this:my-name"), "this.myName;");
});

Deno.test("colon: super member access", () => {
  assertEquals(lykn("super:constructor"), "super.constructor;");
});

Deno.test("colon: camelCase each segment independently", () => {
  assertEquals(lykn("my-obj:get-value"), "myObj.getValue;");
});

Deno.test("colon: Math:PI no camelCase effect", () => {
  assertEquals(lykn("Math:PI"), "Math.PI;");
});

Deno.test("colon: bare this", () => {
  assertEquals(lykn("(return this)"), "return this;");
});

Deno.test("colon: bare super", () => {
  // super as a bare expression is unusual but should parse
  assertEquals(lykn("super"), "super;");
});

// Error cases
Deno.test("colon: leading colon throws", () => {
  assertThrows(() => lykn(":foo"), Error, "reserved");
});

Deno.test("colon: trailing colon throws", () => {
  assertThrows(() => lykn("foo:"), Error);
});

Deno.test("colon: numeric segment throws", () => {
  assertThrows(() => lykn("obj:0"), Error, "get");
});
```

Don't forget to import `assertThrows` from the Deno standard library for the error cases.

### `test/forms/get.test.js`

```js
Deno.test("get: numeric index", () => {
  assertEquals(lykn("(get arr 0)"), "arr[0];");
});

Deno.test("get: string key", () => {
  assertEquals(lykn('(get obj "name")'), 'obj["name"];');
});

Deno.test("get: variable key", () => {
  assertEquals(lykn("(get obj key)"), "obj[key];");
});

Deno.test("get: nested", () => {
  assertEquals(lykn("(get (get matrix 0) 1)"), "matrix[0][1];");
});

Deno.test("get: expression as key", () => {
  assertEquals(lykn("(get args (- len 1))"), "args[len - 1];");
});

Deno.test("get: wrong arity throws", () => {
  assertThrows(() => lykn("(get obj)"), Error, "2 arguments");
});
```

### Running Tests

```sh
deno test test/
```

### A Note on Expected Output Formatting

astring controls the exact formatting of the output. You should run each test once, check what astring actually produces, and match that exactly. For example, astring may or may not add spaces around operators, may or may not add trailing semicolons, etc. The `{ indent: '  ' }` option is already passed in `compile()`.

If a test fails because of whitespace differences (e.g., `a+b` vs `a + b`), check what astring actually emits and match it. Don't fight astring — it's the source of truth for output formatting.

---

## 8. Summary of Changes to `compiler.js`

Here is the complete list of modifications, in order:

### A. Add `toCamelCase()` function

Location: top of file, after the import, before `macros`.

### B. Add `get` macro

Location: inside the `macros` object.

```js
'get'(args) {
  if (args.length !== 2) {
    throw new Error('get requires exactly 2 arguments: (get object key)');
  }
  return {
    type: 'MemberExpression',
    object: compileExpr(args[0]),
    property: compileExpr(args[1]),
    computed: true,
  };
},
```

### C. Delete the `.` macro

Remove the entire `'.'(args) { ... }` block from `macros`.

### D. Rewrite the `case 'atom':` branch in `compileExpr`

Replace:

```js
case 'atom':
  if (node.value === 'true') return { type: 'Literal', value: true };
  if (node.value === 'false') return { type: 'Literal', value: false };
  if (node.value === 'null') return { type: 'Literal', value: null };
  if (node.value === 'undefined') return { type: 'Identifier', name: 'undefined' };
  return { type: 'Identifier', name: node.value };
```

With:

```js
case 'atom': {
  const val = node.value;

  // 1. Literal atoms
  if (val === 'true') return { type: 'Literal', value: true };
  if (val === 'false') return { type: 'Literal', value: false };
  if (val === 'null') return { type: 'Literal', value: null };
  if (val === 'undefined') return { type: 'Identifier', name: 'undefined' };

  // 2. Special keyword atoms
  if (val === 'this') return { type: 'ThisExpression' };
  if (val === 'super') return { type: 'Super' };

  // 3. Colon syntax → MemberExpression chain
  if (val.includes(':')) {
    if (val.startsWith(':')) {
      throw new Error('Leading colon syntax is reserved for future use');
    }
    if (val.endsWith(':')) {
      throw new Error('Trailing colon in member expression');
    }
    if (val === ':') {
      throw new Error('Bare colon is not a valid identifier');
    }

    const segments = val.split(':');
    for (const seg of segments) {
      if (seg === '') {
        throw new Error('Empty segment in colon syntax (consecutive colons)');
      }
      if (/^\d/.test(seg)) {
        throw new Error(
          `Numeric segment "${seg}" in colon syntax — use (get obj ${seg}) for computed access`
        );
      }
    }

    // Build first node
    let result;
    const first = segments[0];
    if (first === 'this') {
      result = { type: 'ThisExpression' };
    } else if (first === 'super') {
      result = { type: 'Super' };
    } else {
      result = { type: 'Identifier', name: toCamelCase(first) };
    }

    // Chain remaining segments as MemberExpressions
    for (let i = 1; i < segments.length; i++) {
      result = {
        type: 'MemberExpression',
        object: result,
        property: { type: 'Identifier', name: toCamelCase(segments[i]) },
        computed: false,
      };
    }

    return result;
  }

  // 4. Regular identifier with camelCase
  return { type: 'Identifier', name: toCamelCase(val) };
}
```

### E. Update `examples/main.lykn`

Replace all `(. obj prop)` patterns with `obj:prop` colon syntax.

---

## 9. What NOT to Do

- **Do not modify `src/reader.js`.** The reader is unchanged for all of v0.1.0. It already passes colons through as part of atom values.
- **Do not modify the `object` macro.** Phase 3 will change it from flat pairs to grouped pairs. Leave it as-is for now.
- **Do not add `function`, `import`, `export`, `async`, or any Phase 2+ forms.** Phase 1 is strictly the foundation layer.
- **Do not add a runtime or helper library.** Compiled output must be plain JS with no lykn dependencies.
- **Do not rename existing macros.** `=>`, `lambda`, `if`, `block`, `=`, `new`, `array`, `return`, `var`, `const`, `let` — all stay exactly as they are.
- **Do not change `compile()` or `toStatement()`.** They work correctly and don't need modification.
- **Do not use npm.** The project uses Deno for testing and import maps for dependencies (astring is mapped via `deno.json`). No `node_modules`, no `package-lock.json`.

---

## 10. Verification Checklist

When you're done, confirm all of the following:

- [ ] `toCamelCase('my-function')` returns `'myFunction'`
- [ ] `toCamelCase('-foo')` returns `'_foo'`
- [ ] `toCamelCase('JSON')` returns `'JSON'`
- [ ] `lykn('console:log')` produces `console.log;`
- [ ] `lykn('this:name')` produces `this.name;` (with `ThisExpression`, not `Identifier`)
- [ ] `lykn('(console:log "hi")')` produces `console.log("hi");`
- [ ] `lykn('(get arr 0)')` produces `arr[0];`
- [ ] `lykn('(return this)')` produces `return this;`
- [ ] `lykn(':foo')` throws an error about reserved syntax
- [ ] `lykn('obj:0')` throws an error suggesting `(get obj 0)`
- [ ] The `.` macro is gone from `macros`
- [ ] `examples/main.lykn` compiles successfully with the new syntax
- [ ] `deno test test/` passes all tests
- [ ] `deno lint src/` passes
- [ ] `biome format src/` passes (or run `biome format --write src/` to fix)

---

## 11. Files Changed Summary

| File | Action |
|------|--------|
| `src/compiler.js` | Add `toCamelCase()`, add `get` macro, delete `.` macro, rewrite atom handling |
| `examples/main.lykn` | Update to colon syntax |
| `test/forms/camel-case.test.js` | New file |
| `test/forms/colon-syntax.test.js` | New file |
| `test/forms/get.test.js` | New file |
