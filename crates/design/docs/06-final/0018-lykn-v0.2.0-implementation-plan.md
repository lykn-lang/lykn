---
number: 18
title: "Lykn v0.2.0 — Implementation Plan"
author: "resolved path"
component: All
tags: [change-me]
created: 2026-03-26
updated: 2026-03-31
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# Lykn v0.2.0 — Implementation Plan

**Generated from**: DD-10 through DD-14, plus macro system research
**Date**: 2026-03-26
**Goal**: "Can write macros" — quasiquote, user-defined macros, reader
dispatch, macro modules, data literals

---

## Architecture Change

v0.1.0 pipeline:

```
.lykn source → reader → compiler → astring → JS
```

v0.2.0 pipeline (new expansion pass inserted):

```
.lykn source → reader → EXPANDER → compiler → astring → JS
```

The reader gains `#` dispatch, backtick, comma, and dotted-pair handling.
The expander is entirely new — a three-pass s-expr → s-expr transformer
that resolves macros, quasiquote, sugar forms, and pattern desugaring.
The compiler is unchanged (it only understands DD-01–09 core forms +
`alias`). Work spans all three components: reader, expander, compiler
(minor).

---

## Phase 1 — Reader Extensions

**Dependencies**: None. Must be done first.
**Estimated effort**: ~2 days

### 1.1 Backtick / Comma / Comma-At (DD-10)

The reader recognizes `` ` ``, `,`, and `,@` as prefix characters and
wraps the next form:

| Character(s) | Reader output |
|---|---|
| `` `expr `` | `(quasiquote expr)` |
| `,expr` | `(unquote expr)` |
| `,@expr` | `(unquote-splicing expr)` |

The reader does NO validation — it is purely mechanical wrapping. No
depth tracking, no checking whether unquote is inside quasiquote. All
validation happens in the expander.

### 1.2 `#` Dispatch Table (DD-12, DD-12 v1.2)

When the reader sees `#` at the start of a token (NOT mid-atom —
`temp#gen` is a single atom), it consults a fixed dispatch table:

| Dispatch | Reader action |
|---|---|
| `#;` | Read and discard next complete form |
| `#a(...)` | Expand to `(array ...)` |
| `#o(...)` | Expand to `(object ...)` |
| `#NNr<value>` | Parse value in base NN (2–36), emit numeric literal |
| `#\|...\|#` | Discard contents, track nesting depth |
| `#(...)` | Error: `"use #a(...) for array literals"` |
| `#` + unknown | Error: `"unknown dispatch character"` |

**`#;` implementation**: Call the reader's existing `readForm()`, discard
the result. No AST node produced.

**`#a(...)` implementation**: Read the contents as a normal list, emit
`(array <contents...>)`. Mechanical — no semantic awareness.

**`#o(...)` implementation**: Read the contents as a normal list, emit
`(object <contents...>)`. Uses the same grouped `(key value)` pair
convention as `object` (DD-06 amendment).

**`#NNr` implementation**:

1. After `#`, read digits until `r` → base (2–36, else error)
2. After `r`, read value characters until delimiter
3. Parse with `parseInt(valueStr, base)` — validate all digits are
   legal for the base
4. Emit a numeric AST node with the computed value
5. Compiler emits native literal for bases 2/8/16 (`0b`, `0o`, `0x`),
   decimal for all others

**`#|...|#` implementation**: Track depth counter. Increment on `#|`,
decrement on `|#`. Discard everything until depth returns to 0. Error
on EOF with depth > 0.

### 1.3 Dotted-Pair Syntax (DD-12)

When the reader encounters `.` inside a list (not as the first or last
element), it produces a cons-pair AST node instead of a regular list
node.

**Reader rules**:

- `(a . b)` → cons-pair node with car=`a`, cdr=`b`
- `(a . b . c)` → error: only one dot per list level
- `(. a)` → error: dot cannot be first
- `(a .)` → error: dot cannot be last
- `(a . )` → error: nothing after dot

The reader produces a structurally distinct node type for cons pairs vs
regular lists. The expander handles the semantics.

**Note**: `.` was freed by DD-01's removal of dots for member access.

### 1.4 `#` Mid-Atom Handling (DD-11, DD-12)

Confirm that `#` inside an atom (e.g., `temp#gen`) does NOT trigger
dispatch. The reader treats the entire token as a single atom. This
is critical for DD-11's auto-gensym suffix.

### 1.5 Tests

- `test/reader/backtick.test.js` — `` ` ``, `,`, `,@` wrapping
- `test/reader/dispatch.test.js` — all `#` dispatch entries
- `test/reader/radix.test.js` — `#NNr` edge cases (bases 2–36)
- `test/reader/block-comment.test.js` — `#|...|#` nesting
- `test/reader/expr-comment.test.js` — `#;` discarding
- `test/reader/dotted-pair.test.js` — `.` in lists
- `test/reader/hash-in-atom.test.js` — `temp#gen` passthrough

---

## Phase 2 — Expander Core

**Dependencies**: Phase 1 (reader produces quasiquote, dispatch, and
dotted-pair nodes).
**Estimated effort**: ~3–4 days

This phase builds the expansion pass as a new module: `src/expander.js`.

### 2.1 Internal AST Node API (DD-10, DD-11)

The macro environment API. These functions construct and inspect the
internal AST representation (flat JS arrays, symbols, numbers, strings):

| Function | Purpose |
|----------|---------|
| `array(...items)` | Create a list AST node (flat JS array) |
| `sym(name)` | Create a symbol node |
| `gensym(prefix?)` | Create unique symbol (`prefix__gensymN`) |
| `append(...arrays)` | Concatenate arrays |
| `isArray(x)` | Test: is x a list node? |
| `isSymbol(x)` | Test: is x a symbol? |
| `isNumber(x)` / `isString(x)` | Type predicates |
| `first(arr)` / `rest(arr)` | Array accessors |
| `concat(...arrays)` | Array concatenation (alias for append) |
| `length(arr)` | Array length |
| `nth(arr, n)` | Indexed access |

`gensym` uses a monotonic counter shared with `#gen` auto-gensym.
Default prefix is `"g"`. Output format: `prefix__gensymN`.

### 2.2 Quasiquote Expansion — Bawden's Algorithm (DD-10)

Implement `expandQuasiquote(form, depth)`:

**Atom case** (depth 0): `` `foo `` → `(quote foo)`. Numbers and
strings are self-evaluating.

**List case** (depth 0): each element produces one argument to
`append`:

| Element | Expansion |
|---|---|
| Literal `x` | `(array (quote x))` |
| `(unquote x)` | `(array x)` |
| `(unquote-splicing x)` | `x` (bare — must be array) |

Result: `(append <arg1> <arg2> ... <argN>)`

**Nested quasiquote**: depth counter. `` ` `` increments, `,` decrements.
Unquoting only fires at depth 0. At depth > 0, preserve quasiquote/
unquote forms as literal data.

**Optimizations** (DD-10):

- No unquotes → return literal AST node directly
- No splices → use `array` instead of `append`

**Validation**:

- `unquote` outside quasiquote → error
- `unquote-splicing` outside quasiquote → error
- `unquote-splicing` not in list → error

### 2.3 `quote` Resolution (DD-10)

`(quote x)` → return `x` as a literal AST node. No further expansion.
If `quote` reaches the compiler → compile error (safety net).

### 2.4 Dispatch Table (DD-13)

```javascript
const dispatchTable = {
  // Don't recur
  "quote":          { walk: "none" },

  // Should be processed in pass 1 — error in pass 2
  "macro":          { walk: "register-macro" },

  // DD-12 sugar forms
  "cons":           { walk: "desugar", transform: desugarCons },
  "list":           { walk: "desugar", transform: desugarList },
  "car":            { walk: "desugar", transform: desugarCar },
  "cdr":            { walk: "desugar", transform: desugarCdr },
  "cadr":           { walk: "desugar", transform: desugarCadr },
  "cddr":           { walk: "desugar", transform: desugarCddr },

  // Pattern desugaring
  "as":             { walk: "desugar", transform: desugarAs },

  // Debug utilities
  "macroexpand":    { walk: "debug-expand", mode: "full" },
  "macroexpand-1":  { walk: "debug-expand", mode: "once" },
};
```

Default for unknown heads: expand all sub-forms recursively.

### 2.5 Sugar Form Desugaring (DD-12, DD-13)

| Form | Desugars to |
|---|---|
| `(cons x y)` | `(array x y)` |
| `(list a b c)` | `(cons a (cons b (cons c null)))` → `(array a (array b (array c null)))` |
| `(list)` | `null` |
| `(car x)` | `(get x 0)` |
| `(cdr x)` | `(get x 1)` |
| `(cadr x)` | `(get (get x 1) 0)` |
| `(cddr x)` | `(get (get x 1) 1)` |

#### 2.5.1 List Literals

We will also need to support the following list literals:

```
'(1 2 3 4 5 6)
`(1 2 3 4 5 ,a)
```

### 2.6 `as` Desugaring (DD-11, DD-13)

Two modes based on first argument:

**Simple rename** (first arg is atom): `(as source target)` → `(alias source target)`

**Whole-and-destructure** (first arg is pattern/list):
`(const (as whole (object a b)) expr)` → two forms:

1. `(const whole expr)`
2. `(const (object a b) whole)`

### 2.7 Expansion Walk (DD-13)

Implement `expand(form, macroEnv)`:

```
expand(form, env):
  if atom → return form
  if empty list → return form
  head = first(form)

  // Fixed-point macro expansion
  while head is a known macro:
    form = macroEnv.get(head)(..rest(form))
    if ++count > 1000 → error: expansion limit
    head = first(form)

  // Dispatch table
  strategy = dispatchTable[head] ?? "expand-all"
  dispatch on strategy

  // Default: recur into sub-forms
  return form.map(sub => expand(sub, env))
```

### 2.8 Tests

- `test/expander/quasiquote.test.js` — all Bawden cases + nesting
- `test/expander/sugar-forms.test.js` — cons/list/car/cdr desugaring
- `test/expander/as-pattern.test.js` — rename and whole-and-destructure
- `test/expander/expansion-walk.test.js` — dispatch, recursion, limits
- `test/expander/quote.test.js` — quote resolution + safety net

---

## Phase 3 — Macro Definition and Hygiene

**Dependencies**: Phase 2 (expander core, quasiquote, AST node API).
**Estimated effort**: ~3–4 days

### 3.1 `macro` Form Processing (DD-11, DD-13)

When the expander encounters `(macro name params body...)`:

1. Compile the macro body from lykn s-expressions to JavaScript
   using the same compiler
2. Compile quasiquote in the body into calls to the macro environment
   API functions (`array`, `sym`, `append`, etc.)
3. Wrap in `new Function()` with macro environment API as parameters
4. Store in macro environment
5. Erase — `macro` produces no output

**`new Function()` sandbox**:

```javascript
const macroFn = new Function(
  "array", "sym", "gensym",
  "isArray", "isSymbol", "isNumber", "isString",
  "first", "rest", "concat", "nth", "length",
  "append", "quote",
  compiledBodyString
);
```

Macro receives call-site arguments (not the whole form including name),
following CL convention.

### 3.2 CL-Heritage Destructuring in Macro Params (DD-11)

Macro parameter lists use DD-06 destructuring forms: `rest`, `default`,
`object`, `array`, `as`, `_` skip. The param list is a pattern applied
to call-site arguments.

```lisp
;; rest
(macro when (test (rest body)) ...)
;; test = first arg, body = remaining args

;; default
(macro my-assert (test (default msg "assertion failed")) ...)

;; skip
(macro third (_ _ x) x)

;; whole-and-destructure via as
(macro my-mac ((as form (test (rest body)))) ...)
```

### 3.3 Enforced Gensym Check (DD-11)

Inside quasiquote templates, bare symbols in binding positions that are
NOT one of:

- Macro parameters
- Known core form names (`if`, `const`, `let`, `do`, etc.)
- Created via `#gen`, `(gensym)`, or `(sym)`

...trigger a compile error with a helpful message:

```
Error: bare symbol `temp` in binding position inside quasiquote.
Use temp#gen for auto-gensym, (gensym "temp") for manual,
or (sym "temp") for intentional capture.
```

### 3.4 Auto-Gensym via `#gen` Suffix (DD-11)

When the expander processes a quasiquote template:

1. Scan for atoms ending in `#gen`
2. For each unique prefix, allocate a gensym: `prefix__gensymN`
3. All occurrences of the same `prefix#gen` within one template resolve
   to the same generated name
4. Counter is shared with `(gensym)` calls

```lisp
(macro swap (a b)
  `(let ((temp#gen ,a))
     (= ,a ,b)
     (= ,b temp#gen)))

;; (swap x y) expands to:
(let ((temp__gensym0 x))
  (= x y)
  (= y temp__gensym0))
```

### 3.5 `(sym "name")` Escape Hatch (DD-11)

Creates a symbol node with the exact given name, bypassing the enforced
gensym check. For intentional capture (anaphoric macros).

```lisp
(macro aif (test then else)
  `(let (((sym "it") ,test))
     (if (sym "it") ,then ,else)))
```

### 3.6 Quasiquote Compilation in Macro Bodies (DD-11)

Quasiquote inside macro bodies is compiled into calls to macro
environment API functions — NOT resolved at definition time.

```lisp
(macro when (test (rest body))
  `(if ,test (do ,@body)))

;; body compiles to approximately:
;; function(test, ...body) {
;;   return array(sym("if"), test,
;;     concat(array(sym("do")), body));
;; }
```

### 3.7 Error Reporting (DD-11)

If a macro function throws during expansion:

```
Error expanding macro `name` at file:line:col: <message>
```

Show call site location (from reader source location metadata), not
macro definition site.

### 3.8 Tests

- `test/expander/macro-basic.test.js` — define + expand simple macros
- `test/expander/macro-params.test.js` — rest, default, as, skip
- `test/expander/enforced-gensym.test.js` — bare symbol rejection
- `test/expander/auto-gensym.test.js` — `#gen` suffix resolution
- `test/expander/gensym-fn.test.js` — `(gensym)` programmatic use
- `test/expander/sym-escape.test.js` — `(sym)` intentional capture
- `test/expander/macro-errors.test.js` — error reporting with locations

---

## Phase 4 — Three-Pass Pipeline

**Dependencies**: Phase 3 (macro definition works).
**Estimated effort**: ~2 days

### 4.1 Three-Pass Architecture (DD-13)

Wire up the expander as three sequential passes:

```
Pass 0 — Process `import-macros` (load external macro modules)
Pass 1 — Compile and register file-local `macro` definitions
Pass 2 — Expand all remaining forms
```

### 4.2 Pass 1: Iterative Fixed-Point Macro Compilation (DD-13)

Compile macro definitions in dependency order using iterative
fixed-point:

```
pending = all macro forms from file
max_passes = pending.length

loop:
  progress = false
  still_pending = []

  for each macro in pending:
    deps = symbols in body that match other pending macro names
    if no deps:
      compile and register macro
      progress = true
    else:
      still_pending.push(macro)

  pending = still_pending
  if pending is empty → done
  if not progress → error: circular dependency
```

Macros can call other macros regardless of source order:

```lisp
;; Both compile successfully — order doesn't matter
(macro unless (test (rest body))
  `(when (not ,test) ,@body))

(macro when (test (rest body))
  `(if ,test (do ,@body)))
```

### 4.3 Duplicate Macro Detection (DD-13)

Two macros with the same name in one file → hard error:

```
Error: duplicate macro definition: 'when'
```

### 4.4 Safety Limits (DD-13)

| Limit | Value | Scope | Triggers on |
|---|---|---|---|
| Per-node expansion | 1000 | Pass 2, per form | Infinite macro loops |
| Macro compilation passes | N (number of defs) | Pass 1, per file | Circular deps |

### 4.5 `macroexpand` / `macroexpand-1` (DD-13)

**In-file forms** (expansion-time, erased from output):

```lisp
;; One step — prints to stderr
(macroexpand-1 '(unless (= x 0) (console:log "nonzero")))

;; Full expansion — prints to stderr
(macroexpand '(unless (= x 0) (console:log "nonzero")))
```

**CLI flags**:

```bash
lykn compile --expand-1 src/app.lykn
lykn compile --expand src/app.lykn
```

### 4.6 Pipeline Integration

Wire the expander into the main compilation flow in the CLI entry point:

```javascript
// Before (v0.1.0):
const ast = read(source);
const estree = compile(ast);
const js = astring.generate(estree);

// After (v0.2.0):
const ast = read(source);
const expanded = await expand(ast, macroEnv);  // NEW
const estree = compile(expanded);
const js = astring.generate(estree);
```

The `expand()` call runs all three passes. If the file has no macros
or sugar forms, expansion is a fast no-op walk.

### 4.7 Tests

- `test/expander/pipeline.test.js` — full three-pass flow
- `test/expander/order-independence.test.js` — macros in any order
- `test/expander/circular-macros.test.js` — circular dep detection
- `test/expander/duplicate-macros.test.js` — duplicate name error
- `test/expander/safety-limits.test.js` — expansion limit
- `test/expander/macroexpand-debug.test.js` — debug utilities

---

## Phase 5 — Macro Modules

**Dependencies**: Phase 4 (three-pass pipeline works).
**Estimated effort**: ~2–3 days

### 5.1 `import-macros` Syntax (DD-14)

```lisp
(import-macros "./control-flow.lykn" (unless when-let))
(import-macros "./control-flow.lykn" ((as unless my-unless) when-let))
```

- Module-path-first (DD-04 convention)
- Explicit binding list required (no import-all)
- Relative paths only (`./` or `../`), file extension required
- `as` for renaming
- Compile-time only — erased from output

### 5.2 Macro Module Compilation (DD-14)

When Pass 0 encounters `import-macros`:

1. Resolve path, check cache (path + mtime)
2. Read target file through reader → s-expressions
3. Run full three-pass pipeline on target (recursive — target may
   have its own `import-macros`)
4. Compile all expanded forms to JS, wrapped as a module-pattern
   function with return statement exposing exported macros
5. Execute via `new Function()` with macro environment API
6. Register requested macros from binding list

```javascript
const moduleFn = new Function(
  "array", "sym", "gensym",
  "isArray", "isSymbol", "isNumber", "isString",
  "first", "rest", "concat", "nth", "length",
  `
  // compiled helpers, constants, unexported macros
  const makeBindings = (pairs) => { ... };

  // compiled exported macros
  const unless = (test, ...body) => { ... };
  const whenLet = (binding, ...body) => { ... };

  return { unless, whenLet };
  `
);

const exports = moduleFn(array, sym, gensym, ...);
macroEnv.set("unless", exports.unless);
```

### 5.3 `export` of Macros (DD-14)

```lisp
(export (macro unless (test (rest body))
  `(if (not ,test) (do ,@body))))
```

Macro modules use regular `export` wrapping. When the module is
compiled for macro extraction, `export` marks which macros appear
in the return object.

### 5.4 Mixed Files (DD-14)

A file can export both macros and runtime functions:

```lisp
;; utils.lykn
(export (macro unless (test (rest body))
  `(if (not ,test) (do ,@body))))

(export (function format-name (first last)
  (template first " " last)))
```

```lisp
;; consumer.lykn
(import-macros "./utils.lykn" (unless))  ;; compile-time
(import "./utils.js" (format-name))       ;; runtime
```

Path difference: `import-macros` → `.lykn` source; `import` → `.js`
compiled output.

### 5.5 Caching (DD-14)

Cache compiled macro modules by resolved path + mtime. If source
unchanged, reuse cached module. For v0.2.0, only leaf modules (those
with no `import-macros` of their own) benefit from caching.

### 5.6 Circular Dependency Detection (DD-14)

Compilation stack: push path on entry, pop on exit. If path already
on stack → hard error:

```
Error: circular macro module dependency:
  ./a.lykn imports macros from ./b.lykn
  ./b.lykn imports macros from ./a.lykn
```

### 5.7 Shadowing Prevention (DD-14)

File-local macro with same name as imported macro → hard error:

```
Error: macro 'unless' already defined (imported from ./control-flow.lykn)
```

### 5.8 Tests

- `test/expander/import-macros.test.js` — basic import + expansion
- `test/expander/macro-module-export.test.js` — export syntax
- `test/expander/macro-module-mixed.test.js` — macros + runtime in one file
- `test/expander/macro-module-renaming.test.js` — `as` renaming
- `test/expander/macro-module-cache.test.js` — mtime caching
- `test/expander/macro-module-circular.test.js` — circular dep error
- `test/expander/macro-module-chain.test.js` — A imports from B
  imports from C
- `test/expander/macro-module-shadow.test.js` — shadowing error

---

## Phase 6 — Browser Shim Update

**Dependencies**: Phases 1–5 (expander must be feature-complete).
**Estimated effort**: ~0.5 day

### 6.1 Bundle Expander

Add `src/expander.js` to the browser bundle alongside reader, compiler,
and astring:

```sh
esbuild src/lykn-browser.js --bundle --format=iife \
  --global-name=lykn --outfile=dist/lykn-browser.js --minify
```

### 6.2 Pipeline Update

The `<script type="text/lykn">` handler and `window.lykn.compile()`
must now run the expansion pass between reading and compiling.

### 6.3 Tests

- Manual browser test: page with macros defined inline
- Manual browser test: verify `window.lykn.compile()` handles macros

---

## Integration Tests

After all phases, these programs must compile and run:

### Test 1: Control Flow Macros

```lisp
(macro when (test (rest body))
  `(if ,test (do ,@body)))

(macro unless (test (rest body))
  `(when (not ,test) ,@body))

(macro -> (val (rest forms))
  (let ((result#gen val))
    (for-of form forms
      (= result#gen `(,(first form) ,result#gen ,@(rest form))))
    result#gen))

(const data #o((users #a("alice" "bob" "charlie")) (count 3)))

(when (> data:count 0)
  (console:log "has users"))

(unless (=== data:count 0)
  (console:log "not empty"))
```

### Test 2: Data Structure Macros

```lisp
(const items (list 1 2 3 4 5))

(console:log (car items))
(console:log (cadr items))

(let ((`(,first . (,second . ,rest)) items))
  (console:log "first:" first)
  (console:log "second:" second)
  (console:log "rest:" rest))

(const config #o((host "localhost") (port 8080)))
(const mask #2r11110000)
(const color #16rff8800)
```

### Test 3: Macro Module

```lisp
;; macros/control.lykn
(export (macro when (test (rest body))
  `(if ,test (do ,@body))))

(export (macro unless (test (rest body))
  `(when (not ,test) ,@body)))

(export (macro when-let (binding (rest body))
  `(let (,binding)
     (when ,(first binding) ,@body))))
```

```lisp
;; app.lykn
(import-macros "./macros/control.lykn" (when unless when-let))

(when-let ((const user (find-user "alice")))
  (console:log user:name))

(unless (=== status "error")
  (process-result data))
```

### Test 4: `as` Pattern Form

```lisp
(import "./utils.js" ((as some-long-name short)))

(const (as whole (object name age)) (get-person id))
(console:log whole name age)

(function process ((as original (object name age)))
  (console:log "processing" original)
  (use name age))
```

### Test 5: Gensym and Hygiene

```lisp
(macro swap (a b)
  `(let ((temp#gen ,a))
     (= ,a ,b)
     (= ,b temp#gen)))

(macro aif (test then else)
  `(let (((sym "it") ,test))
     (if (sym "it") ,then ,else)))

(let ((x 1) (y 2))
  (swap x y)
  (console:log x y))

(aif (find-user id)
  (console:log it:name)
  (console:log "not found"))
```

### Test 6: Macroexpand Debugging

```lisp
(macro when (test (rest body))
  `(if ,test (do ,@body)))

(macroexpand-1 '(when true (console:log "a")))
;; stderr: (if true (do (console:log "a")))

(macroexpand '(when true (console:log "a")))
;; stderr: (if true (do (console:log "a")))
```

---

## "Done" Checklist

- [ ] All reader extension tests pass (Phase 1)
- [ ] Quasiquote expansion handles all Bawden cases + nested depth
- [ ] Sugar forms (`cons`, `list`, `car`/`cdr`/`cadr`/`cddr`) desugar correctly
- [ ] `as` desugars to `alias` (rename) and two-binding (whole-and-destructure)
- [ ] `macro` form compiles, registers, and expands macros
- [ ] Enforced gensym rejects bare symbols in binding positions
- [ ] Auto-gensym `#gen` produces unique names, shared counter with `(gensym)`
- [ ] `(sym)` escape hatch works for intentional capture
- [ ] Three-pass pipeline: import → register → expand
- [ ] Order-independent macro compilation (iterative fixed-point)
- [ ] Circular macro dependency detection
- [ ] Duplicate macro name detection
- [ ] Per-node expansion limit (1000)
- [ ] `macroexpand` / `macroexpand-1` debug utilities
- [ ] `import-macros` loads and caches macro modules
- [ ] Macro modules compile recursively (cross-module composition)
- [ ] Mixed files work (`import-macros` + `import` of same source)
- [ ] Shadowing of imported macros is a hard error
- [ ] Browser shim updated with expander in pipeline
- [ ] Integration Tests 1–6 compile and run
- [ ] Compiled JS output remains clean and readable
- [ ] No runtime dependencies in output
- [ ] All v0.1.0 tests still pass (no regressions)

---

## Rough Sizing

| Phase | Effort | Cumulative |
|-------|--------|------------|
| Phase 1: Reader extensions | ~2 days | 2 days |
| Phase 2: Expander core | ~3–4 days | 5–6 days |
| Phase 3: Macro definition + hygiene | ~3–4 days | 8–10 days |
| Phase 4: Three-pass pipeline | ~2 days | 10–12 days |
| Phase 5: Macro modules | ~2–3 days | 12–15 days |
| Phase 6: Browser shim update | ~0.5 day | 12.5–15.5 days |
| Integration testing | ~2–3 days | 14.5–18.5 days |
| **Total** | **~15–19 days** | focused work |

---

## What's OUT (v0.3.0+)

| Feature | Why deferred |
|---------|-------------|
| Transitive macro module cache invalidation | Simple mtime sufficient for v0.2.0 |
| Package-style bare specifiers for `import-macros` | No macro package ecosystem yet |
| ESTree escape hatch (macros returning raw AST) | Sugar over s-expr macros is sufficient |
| `macrodebug` pretty-printer | Nice-to-have, not essential |
| `once-only` utility macro | Can be defined in userland |
| Compiler sandbox restricting macro I/O | `new Function()` boundary is sufficient |
| Source maps through expansion | Full tracing deferred |
| User-extensible reader dispatch | Fixed table is sufficient |
| Generators / `yield` | Still needs iterator protocol design |
| Optional chaining `?.` | Still needs syntax design |
| `let` form | Not yet defined — uses `const` + block scoping |

---

## Reference: Decision Docs

| DD | Topic | Key decisions |
|----|-------|---------------|
| 10 | Quasiquote | Expansion-time only, Bawden's `append`/`array`, depth tracking, trivial-case optimization |
| 11 | Macro definition + hygiene | `macro` form, `as` universal pattern, enforced gensym, `#gen` auto-gensym, `(sym)` escape, `new Function()` |
| 12 | Reader dispatch + data literals | `#;`, `#a(...)`, `#o(...)`, `#NNr`, `#\|...\|#`, `cons`/`list`/`car`/`cdr`, dotted pairs |
| 13 | Expansion pipeline | Three-pass (import→register→expand), table-driven dispatch, iterative fixed-point, safety limits, `macroexpand` |
| 14 | Macro modules + ESM | `import-macros`, regular `.lykn` files, `new Function()` sync, caching, cross-module composition, no shadowing |
