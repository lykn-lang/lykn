---
number: 12
title: "Macro System Research for lykn"
author: "calling macros"
component: All
tags: [change-me]
created: 2026-03-26
updated: 2026-03-26
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# Macro System Research for lykn

**Date**: 2026-03-26
**Purpose**: Inform design decisions for lykn's macro system
**Scope**: Compile-time only; Lisp-to-JS and JS-native prior art; ESM module interaction

---

## Executive Summary

Across twelve macro system implementations surveyed — six Lisp-to-X compilers (ClojureScript, Wisp, eslisp, Parenscript, Fennel, Janet), three JS-native tools (Sweet.js, Babel plugins, babel-plugin-macros), Racket's scope-set system, and two smaller JS Lisps (SLip, Loko) — the research converges on a clear recommendation:

**lykn should implement Fennel-style s-expression macros with enforced gensym, using `new Function()` for compile-time evaluation on Deno.**

Key findings:

1. **Macros should transform s-expressions, not ESTree nodes** — preserves compositionality, keeps macros accessible to authors
2. **Quasiquote should build lists, not AST objects** — same rationale; the compiler handles JS translation
3. **`new Function()` executes macro code at compile time** — synchronous, no Deno-specific complications, natural isolation from compiler internals
4. **Fennel's enforced gensym catches ~99% of capture bugs** with a single compile-time check — no need for full Scheme-style hygiene at this stage
5. **Macro expansion slots between reader and compiler** as a new pipeline phase: reader → **macro expander** → compiler → astring
6. **`import-macros` via dynamic `import()` with data URIs** solves ESM macro module loading without filesystem hacks

---

## 1. Prior Art: Lisp-to-JS Compilers

### 1.1 ClojureScript

**Architecture**: Macros are written in Clojure (JVM), not ClojureScript itself. The ClojureScript compiler runs on the JVM, so macros execute in the JVM environment during compilation. Self-hosted ClojureScript exists but requires shipping ~2MB of JS.

**Macro mechanism**: `defmacro` in `.clj` files, referenced via `:require-macros` in `.cljs` files. Syntax-quote (`` ` ``) auto-qualifies symbols with their namespace, providing partial hygiene. Auto-gensym via `foo#` suffix within syntax-quote.

**Tradeoffs for lykn**:

- The host/target split (Clojure macros for ClojureScript code) creates real friction — different dialects, namespace aliases don't cross the boundary
- lykn doesn't have this problem because the compiler and target are both JS
- The namespace-qualifying hygiene depends on having a namespace system, which lykn lacks
- **Lesson**: Avoid requiring a separate host language for macros

### 1.2 Wisp

**Architecture**: Lisp-to-JS compiler in JS. Limited macro support — mostly relies on built-in special forms rather than user-extensible macros.

**Tradeoffs for lykn**:

- Wisp's limited macro system demonstrates the cost of not having one — users hit a wall
- **Lesson**: User-defined macros are essential for real-world use

### 1.3 eslisp

**Architecture**: S-expressions → ESTree AST → escodegen → JS. Nearly identical to lykn's pipeline. All code is constructed by calling macros — built-in and user macros are identical.

**Macro mechanism**: Macros are plain JS functions that receive s-expression nodes and return either:

- S-expression nodes (which undergo further macro expansion), OR
- Raw ESTree objects (which bypass expansion entirely)

This dual-return-type design is an important escape hatch. Quasiquote (`` ` ``), unquote (`,`), and unquote-splicing (`,@`) build s-expression templates.

**Tradeoffs for lykn**:

- eslisp proves that the s-expr macro approach works for a JS-targeting Lisp
- The ESTree escape hatch is valuable for edge cases the s-expression compiler can't express
- eslisp is unmaintained — its codebase is a reference, not a dependency
- **Lesson**: S-expression macros with ESTree escape hatch is the right dual-mode design

### 1.4 Parenscript

**Architecture**: Common Lisp to JS. Leverages the full CL macro system — `defpsmacro`, `gensym`, `with-ps-gensyms`, `ps-once-only`.

**Macro mechanism**: Standard CL `defmacro` semantics. Macros manipulate s-expressions; the PS compiler translates to JS. The `ps-once-only` utility (equivalent to CL's `once-only`) prevents multiple evaluation of macro arguments.

**Tradeoffs for lykn**:

- Requires a CL runtime for compilation — irrelevant to lykn's constraints
- But the `once-only` pattern is important for any macro system and should be provided as a utility
- **Lesson**: Provide `once-only` / evaluation-guarding utilities

### 1.5 Fennel (Primary Blueprint)

**Architecture**: Lisp→Lua. Thin-skin philosophy, dynamic target language, no runtime library, no namespace system, compile-time-only macros. **The closest architectural analog to lykn.**

**Macro mechanism**:

- `macro` for file-local macros
- `macros` block for defining multiple macros
- `import-macros` for loading macro modules from separate files
- Macros are ordinary functions receiving AST nodes (tables/lists), returning AST nodes
- Run in a sandboxed compiler environment — no access to runtime I/O by default

**Hygiene model — enforced gensym**:

- Since v0.3.0, bare bindings inside backtick templates trigger a compile error
- `x#` suffix triggers auto-gensym: all occurrences of `x#` within one backtick resolve to the same unique name (e.g., `_x_0_`)
- Manual `(gensym)` available for complex cases
- `sym` function provides escape hatch for intentional capture (anaphoric macros)

**Phase separation**:

- Macros run at compile time in the compiler's Lua environment
- Macro modules are compiled, evaluated, and cached
- Sequential file processing: `defmacro` is available to all subsequent forms in the same file

**Tradeoffs for lykn**:

- Fennel arrived at this design after years of iteration — it's battle-tested
- The enforced gensym is the key innovation: catches most capture bugs with minimal implementation cost
- Sandboxed environment prevents macros from doing I/O during compilation — good default
- **Lesson**: This is the model to adopt, adapted for JS/Deno

### 1.6 Janet

**Architecture**: Small Lisp with macros, compiles to bytecode.

**Interesting contribution**: Functions as values can be unquoted directly into macro templates and resolve correctly at runtime, providing a form of automatic hygiene for function references. But this only works for bytecode targets, not text-based output like JS.

**Tradeoffs for lykn**:

- The "functions as values in templates" trick doesn't apply — lykn outputs text (JS source)
- **Lesson**: Text-based output requires different hygiene strategies than bytecode

---

## 2. Prior Art: JS-Native Macro Tools

### 2.1 Sweet.js

**Architecture**: Hygienic macro system for JavaScript, based on Racket's "sets of scopes" model. Published an academic paper (DLS 2014).

**Current status**: The sweet-js/sweet-core repository was archived in February 2026. The project struggled with the fundamental difficulty of macro systems for non-delimited syntax — JavaScript's grammar makes it extremely hard to know where a macro's input ends. This is the "enforestation problem" that Lisp avoids entirely with s-expressions.

**Hygiene model**: Full scope-set hygiene following Flatt 2016. Every identifier carries a set of scope tokens; binding resolution finds the most specific subset match.

**Tradeoffs for lykn**:

- Sweet.js proves that full hygiene for JS is possible but extremely complex
- The project's archival validates the approach of using s-expressions rather than fighting JS grammar
- lykn doesn't need to solve enforestation — it has parentheses
- **Lesson**: Full hygiene is overkill when you have s-expressions and can use enforced gensym

### 2.2 Babel Plugins

**Architecture**: Visitor pattern over AST nodes. Plugins register handlers for specific node types (`IfStatement`, `CallExpression`, etc.) and can transform, replace, or remove nodes.

**Macro-like features**: `@babel/template` provides quasiquote-like functionality — "an implementation of quasiquotes" per Babel's own description. Template strings with `%%placeholder%%` holes that expand to AST subtrees.

**Tradeoffs for lykn**:

- The AST visitor pattern is powerful but verbose and non-compositional
- Babel introduced templates precisely because raw AST manipulation is painful
- If the JS ecosystem needs quasiquotation even with non-s-expression syntax, lykn should start with it natively
- **Lesson**: The fact that Babel reinvented quasiquote validates lykn's approach

### 2.3 babel-plugin-macros

**Architecture**: A convention layer over Babel — macro packages are imported and Babel recognizes the import to apply compile-time transformation. Zero-config approach.

**Tradeoffs for lykn**:

- The import-based macro discovery pattern is interesting for ESM integration
- `import-macros` in lykn should follow a similar "import signals compile-time use" convention
- **Lesson**: Import syntax should clearly distinguish compile-time vs runtime imports

### 2.4 TC39 Macro Proposals

No macro proposal has advanced beyond Stage 1 at TC39. The fundamental obstacles are JS's non-delimited syntax (making macro boundaries ambiguous) and the complexity of hygiene in a language with multiple scoping mechanisms (var hoisting, let/const block scoping, function scoping, module scoping). This will likely never change — **TC39 will never add macros to JavaScript. lykn doesn't need them to.**

---

## 3. Macro Expansion Pipeline Design

### 3.1 Where in the Pipeline

Four insertion points exist:

| Option | Description | Verdict |
|--------|-------------|---------|
| **(a) Reader macros** | Transform character streams during parsing | Reserve for fixed `#` dispatch, not user-extensible |
| **(b) S-expr → s-expr** | Transform after reading, before compilation | **Correct for v0.2.0** |
| **(c) ESTree → ESTree** | Transform AST nodes | Too verbose, destroys compositionality |
| **(d) Hybrid** | Mix of read-time and compile-time | Good long-term, unnecessary for v0.2.0 |

**Option (b) is correct.** This is where every successful Lisp macro system operates:

- Preserves homoiconicity (macros manipulate the same structures they're written in)
- Macros compose naturally (one macro's output can invoke another macro)
- Macro authors don't need to know ESTree
- The pipeline becomes: **reader → macro expander → compiler → astring**

### 3.2 Expansion Order

**Outside-in (standard).** The outer macro runs first, then the expander recurses into the result. This is a correctness requirement, not a design choice — until the outer macro executes, the expander cannot know whether inner forms should be expanded at all (the macro might quote, discard, or rearrange them).

### 3.3 Expansion Algorithm

```javascript
function macroExpand1(form, macroEnv) {
  if (!isList(form) || isEmpty(form)) return { form, changed: false };
  const head = first(form);
  if (isSymbol(head) && macroEnv.has(head.name)) {
    const transformer = macroEnv.get(head.name);
    const expanded = transformer(...rest(form));
    return { form: expanded, changed: true };
  }
  return { form, changed: false };
}

async function macroExpandAll(form, macroEnv) {
  // Repeatedly expand outermost macro until fixed point
  let current = form;
  let changed = true;
  while (changed) {
    ({ form: current, changed } = macroExpand1(current, macroEnv));
  }
  if (!isList(current)) return current;
  const head = first(current);

  // Handle special forms
  if (isSymbol(head)) {
    if (head.name === 'quote') return current;  // don't expand inside quote
    if (head.name === 'defmacro') {
      const [, name, params, ...body] = current;
      const jsFn = compileMacroToFunction(params, body, macroEnv);
      macroEnv.set(name.name, jsFn);
      return null;  // defmacro produces no output
    }
    if (head.name === 'import-macros') {
      const [, path, bindings] = current;
      await loadMacroModule(path, bindings, macroEnv);
      return null;  // import-macros produces no output
    }
  }

  // Recurse into sub-forms
  const expanded = [];
  for (const sub of current) {
    expanded.push(await macroExpandAll(sub, macroEnv));
  }
  return list(...expanded);
}
```

### 3.4 Reader-Level Character Reservations

The reader already reserves `` ` ``, `,`, and `#`. These should map to:

| Character | Reader expansion | Purpose |
|-----------|-----------------|---------|
| `` `expr `` | `(quasiquote expr)` | Template construction |
| `,expr` | `(unquote expr)` | Value insertion |
| `,@expr` | `(unquote-splicing expr)` | List splicing |
| `#` | Dispatch character | Fixed set of reader extensions |

The `#` dispatch table (for discussion — not finalized):

| Syntax | Possible meaning |
|--------|-----------------|
| `#js{...}` | JS object literal in macro output |
| `#t` / `#f` | Boolean literals |
| `#S(...)` | Struct literal (shorthand for `(object ...)`) |
| `#;expr` | Comment out next expression |

---

## 4. Hygiene Models Compared

| Model | Implementation cost | Capture prevention | Intentional capture | Best for |
|-------|--------------------|--------------------|--------------------:|----------|
| **Unhygienic (CL defmacro)** | Low | Manual gensym only | Easy | Experts only |
| **Enforced gensym (Fennel)** | Low-medium | Compile-time check | `sym` escape hatch | **lykn v0.2.0** |
| **Auto-gensym (Clojure)** | Medium | Convention-based | Explicit | Namespace-dependent |
| **syntax-rules (Scheme)** | High | Automatic | Not available | Pure pattern macros |
| **syntax-case (Scheme)** | Very high | Automatic | `datum→syntax` | Full-featured |
| **Scope sets (Racket)** | Very high | Automatic | Controlled | Research / production Lisps |

### Recommendation: Fennel-style enforced gensym

Inside backtick templates, any symbol used in a binding position **must** end with `#` or the compiler raises an error. This single check:

- Catches the most common macro bug (introduced-variable capture)
- Costs zero at runtime
- Requires minimal implementation
- Leaves room for intentional capture via `sym` escape hatch

```lisp
;; This triggers a compile error:
(defmacro bad-swap [a b]
  `(let [tmp ,a]       ;; ERROR: bare `tmp` in binding position
     (= ,a ,b)
     (= ,b tmp)))

;; This works:
(defmacro good-swap [a b]
  `(let [tmp# ,a]      ;; OK: tmp# auto-gensyms to _tmp_0_
     (= ,a ,b)
     (= ,b tmp#)))
```

---

## 5. Quasiquote for JS/ESTree

### What should quasiquote build?

| Option | What `` `(if ,test ,body) `` constructs | Verdict |
|--------|----------------------------------------|---------|
| **(A) S-expression lists** | `["if", <test>, <body>]` → flows through compiler | **Recommended** |
| **(B) ESTree nodes** | `{type: "IfStatement", ...}` | Escape hatch only |
| **(C) Template strings** | Parse JS string with holes | Loses homoiconicity |

**Option A as primary, Option B as escape hatch** — matching eslisp's proven dual-mode approach.

### Implementation: Bawden's Algorithm

Quasiquote expansion uses `append` and `list` (never `cons`), handles nested quasiquote correctly:

```
`(a ,b ,@c d)  →  (append (list 'a) (list b) c (list 'd))
```

Nested quasiquote increments/decrements a depth counter:

```
``(a ,,b)  →  (list 'quasiquote (list 'a (list 'unquote b)))
```

---

## 6. ESM Module Interaction

### The Phase Separation Problem

Macro code runs at compile time but is written in the same language as runtime code. lykn has an advantage here: the compiler runs on JS (Deno), and macros compile to JS, so there's no cross-language boundary.

### Two Phases for v0.2.0

- **Phase 0 (runtime)**: Normal lykn code → compiles to JS output
- **Phase 1 (compile-time)**: `defmacro` bodies and macro module code → compiled to JS, evaluated during compilation, erased from output

### Macro Import Syntax

Following TypeScript's `import type` precedent, macro imports should use distinct syntax:

```lisp
;; Compile-time only — erased from output JS
(import-macros "./control-flow.lykn" (unless when-let))

;; Runtime — appears in output JS as import statement
(import "./utils.js" (helper))
```

### Macro Module Format

Macro modules are regular `.lykn` files. No separate file format needed. The module is:

1. Read and compiled to JS by the lykn compiler
2. Evaluated via dynamic `import()` with data URI
3. Its exports are registered as macros
4. The module runs with access to AST manipulation utilities

```lisp
;; control-flow.lykn (macro module)
(export (macro unless (test & body)
  `(if (not ,test) (do ,@body))))

(export (macro when-let (binding & body)
  (const name# (get ,binding 0))
  (const val# (get ,binding 1))
  `(let [name# ,val#]
     (if name# (do ,@body)))))
```

### Sequential Processing

Following SLip's model: each top-level form is read, macro-expanded, and compiled in sequence. A `defmacro` in line 10 is available to all forms from line 11 onward in the same file. This is the simplest correct approach and matches how Fennel works.

### Macro Module Caching

Compiled macro modules should be cached by file path + mtime. If the source hasn't changed, reuse the cached compiled module. This prevents recompilation on every import.

---

## 7. Deno-Specific Implementation

### `new Function()` for Inline Macros

Deno fully supports `new Function()`. Unlike `eval()`, it creates a function **without access to the local scope**, providing natural isolation:

```javascript
// When compiler encounters (defmacro unless [test & body] ...)
// 1. Compile macro body to JS
const jsBody = compileMacroBody(bodyAst);
// 2. Create executable function
const macroFn = new Function('test', '...body', jsBody);
// 3. Register
macroEnv.set('unless', macroFn);
```

### Dynamic `import()` for Macro Modules

Deno supports `data:` URL imports:

```javascript
// When compiler encounters (import-macros "./control-flow.lykn" ...)
// 1. Read and compile macro module to JS
const jsSource = compileModule(readFile("./control-flow.lykn"));
// 2. Dynamic import via data URI
const macroModule = await import(
  "data:application/javascript," + encodeURIComponent(jsSource)
);
// 3. Register exported macros
for (const [name, fn] of Object.entries(macroModule)) {
  macroEnv.set(name, fn);
}
```

### Tradeoff: Sync vs Async

- `new Function()` is synchronous → good for inline `defmacro`
- Dynamic `import()` is async → required for `import-macros` with ESM
- The macro expansion phase must be `async` when macro modules are involved

### Node.js `vm` Module

Deno offers a `node:vm` compatibility shim, but it adds unnecessary complexity for v0.2.0. Reserve for a future sandbox feature if macro security becomes a concern.

---

## 8. Macro Environment API

The macro environment should expose these utilities to macro functions:

| Function | Purpose |
|----------|---------|
| `list(...items)` | Create a list node |
| `sym(name)` | Create a symbol node |
| `gensym(prefix?)` | Create a unique symbol |
| `list?(x)` | Test if x is a list |
| `sym?(x)` | Test if x is a symbol |
| `number?(x)` / `string?(x)` | Type predicates |
| `first(lst)` / `rest(lst)` | List accessors |
| `concat(...lists)` | List concatenation |
| `length(lst)` | List length |
| `nth(lst, n)` | Indexed access |

These are available in the macro execution environment but produce no runtime output — they're compile-time-only utilities.

---

## 9. Implementation Roadmap

### v0.2.0 (Essential)

- Reader changes: `` ` ``, `,`, `,@` expand to `quasiquote`, `unquote`, `unquote-splicing` forms
- Quasiquote expander (Bawden's algorithm)
- `defmacro` with `new Function()` evaluation
- `gensym` function
- Enforced gensym check (bare bindings in backtick → compile error)
- Auto-gensym via `#` suffix
- Source location metadata on AST nodes (for error reporting)
- Basic error reporting showing macro call site on expansion failure
- `macroexpand` / `macroexpand-1` debugging utilities

### v0.3.0 (Module Support)

- `import-macros` with dynamic `import()` via data URIs
- Macro module compilation and caching
- Macro modules written in lykn
- `#` reader dispatch table (fixed set: `#js{}`, `#;`, potentially `#S()`)
- Compiler sandbox restricting macro access to I/O

### v0.4.0+ (Polish)

- ESTree escape hatch (macros returning raw AST nodes bypass expansion)
- `macrodebug` pretty-printer (show expansion steps)
- `once-only` utility macro
- Performance: lazy expansion, expansion caching
- Consider whether full hygiene is needed based on user feedback

---

## 10. Comparative Summary

| Feature | ClojureScript | Fennel | eslisp | Sweet.js | **lykn (proposed)** |
|---------|--------------|--------|--------|----------|-------------------|
| Host language | Clojure (JVM) | Fennel (Lua) | JS | JS | **lykn (JS)** |
| Macro input | S-expressions | AST tables | S-expressions | Token trees | **S-expressions** |
| Macro output | S-expressions | AST tables | S-expr or ESTree | Token trees | **S-expr (+ ESTree escape)** |
| Hygiene | Syntax-quote + auto-gensym | Enforced gensym | None | Full scope sets | **Enforced gensym** |
| Quasiquote target | Lists | Lists | Lists | N/A | **Lists** |
| Compile-time eval | JVM | Lua interpreter | Node.js `vm` | Babel | **`new Function()`** |
| Module macros | `:require-macros` | `import-macros` | N/A | Import-based | **`import-macros`** |
| Runtime deps | ClojureScript core | None | None | None | **None** |

---

## Sources Consulted

- ClojureScript macro documentation and thheller's blog on CLJS macros
- Fennel reference manual, macro guide, and enforced-gensym patch discussion (sourcehut)
- eslisp macro documentation (GitHub: anko/eslisp)
- Parenscript reference manual
- Sweet.js academic paper (DLS 2014) and sweet-core repository (archived Feb 2026)
- Babel plugin handbook and `@babel/template` documentation
- Racket guide on macro phases; Flatt 2016 "Binding as Sets of Scopes" (POPL)
- SLip implementation notes (lisperator.net)
- Bawden 1999 "Quasiquotation in Lisp" (PEPM)
- Common Lisp HyperSpec on macroexpansion
- Deno documentation on `node:vm` compatibility
