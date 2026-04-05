---
number: 11
title: "Designing a macro system for lykn"
author: "the compiler"
component: All
tags: [change-me]
created: 2026-03-26
updated: 2026-03-26
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# Designing a macro system for lykn

**Fennel's "unhygienic macros with enforced gensym" model is the right starting point for lykn.** Macros should operate as s-expression→s-expression transformations inserted between the reader and compiler, using `new Function()` for compile-time evaluation on Deno. This design requires roughly 300–500 lines of new code, produces zero runtime overhead, and follows directly from how every successful compile-to-X Lisp has solved this problem. The key architectural insight: lykn's compiler already runs on JS (Deno), so macro code written in lykn can be compiled to JS by the compiler itself and immediately executed—no separate host language, no VM, no bootstrapping crisis.

---

## Fennel is the blueprint, not ClojureScript

Among the six Lisp-to-X compilers surveyed, **Fennel** (Lisp→Lua) shares the most constraints with lykn: thin-skin philosophy, dynamic target language, no runtime library, no namespace system, compile-time-only macros. The lessons from Fennel are directly applicable; the lessons from ClojureScript are instructive but involve tradeoffs lykn should avoid.

ClojureScript requires macros to be written in Clojure (JVM), not ClojureScript itself. This sharp host/target split gives macros access to the full JVM ecosystem but creates real friction: macro files use a different dialect (`.clj` vs `.cljs`), namespace aliases from the target language don't work in macros, and self-hosted CLJS requires shipping ~2MB of JS. The namespace-qualifying behavior of syntax-quote (`` ` ``) provides partial hygiene automatically—`core/let` can never be shadowed—but this depends on having a namespace system, which lykn lacks.

Fennel's model is simpler and more appropriate. Macros are ordinary functions that receive AST nodes (tables/lists) and return AST nodes. They run in a sandboxed compiler environment at compile time. **Fennel enforces gensym use at compile time**: since v0.3.0, attempting to introduce a bare binding inside a backtick template triggers a compile error ("macro tried to bind `x` without gensym; try `x#` instead"). This single check catches the most common macro bug—introduced-variable capture—with zero runtime cost and minimal implementation complexity. The `#` suffix on symbols inside backtick forms triggers auto-gensym, where `x#` expands to a guaranteed-unique name like `_x_0_`.

**eslisp** deserves special attention because its architecture is nearly identical to lykn's: s-expressions → ESTree AST → escodegen → JS. In eslisp, all code is constructed by calling macros at compile time—built-in macros and user macros are identical. Macros are plain JS functions that receive s-expression nodes and return either s-expression nodes (which undergo further expansion) or raw ESTree objects (which bypass expansion). This dual-return-type design is worth adopting as an escape hatch. eslisp's quasiquote (`` ` ``), unquote (`,`), and unquote-splicing (`,@`) build s-expression templates, exactly the approach recommended here.

Parenscript and Janet round out the picture. Parenscript leverages the full Common Lisp macro system—`defpsmacro`, `gensym`, `with-ps-gensyms`, `ps-once-only`—but requires a CL runtime for compilation, which is irrelevant to lykn's constraints. Janet's most interesting contribution is the "functions as values" trick: because Janet compiles to bytecode, a function reference can be unquoted directly into a macro template and will resolve correctly at runtime. This provides a form of automatic hygiene for function references but only works for bytecode targets, not text-based output like JS.

---

## S-expression transformation is where macros belong

The compilation pipeline offers four possible insertion points for macro expansion. Only one is appropriate for lykn v0.2.0.

**Option (b)—after reading, before compilation (s-expr → s-expr)—is correct.** This is where every successful Lisp macro system operates, and for good reason: it preserves homoiconicity (macros manipulate the same list structures they're written in), macros compose naturally (one macro's output can be another macro's input), and macro authors don't need to understand ESTree. The pipeline becomes: **reader → macro expander → compiler → astring**.

Reader macros (option a) operate on character streams before s-expressions exist. They're useful for genuinely new syntax (Common Lisp's `#(...)` for vectors, `#'` for function references), but lykn already has reserved characters (`` ` ``, `,`, `#`) that the reader can handle natively. Reader macros add global mutable state (the readtable), break tooling, and compose poorly. They're unnecessary when the reader already produces the right data structures. Reserve `#` dispatch for a fixed set of reader extensions (`#js{}` for JS object literals, `#t`/`#f` for booleans) rather than user-extensible reader macros.

AST-level transformation (option c) means macros would receive and return ESTree nodes—`{type: "IfStatement", test: {...}, consequent: {...}}`. This is essentially the Babel plugin model. It's dramatically more verbose than list manipulation, destroys the compositional elegance of Lisp macros, and forces macro authors to learn ESTree's ~70 node types. Babel's own documentation introduced `@babel/template` specifically to escape this verbosity, calling it an "implementation of quasiquotes." If even the JS ecosystem recognizes that raw AST manipulation needs quasiquotation, lykn should start with quasiquotation natively.

A hybrid approach (option d) makes sense long-term: s-expr macros for user-facing extensions, with internal compiler passes over ESTree for optimizations like constant folding. But for v0.2.0, pure s-expr→s-expr macros are sufficient.

**Expansion order must be outside-in** (the standard). The outer macro runs first, then the expander recurses into the result. This is not a design choice—it's a correctness requirement. Until the outer macro executes, the expander cannot know whether inner forms should be expanded at all (the macro might quote, discard, or rearrange them).

```
;; Expansion example
(unless ready? (launch!))
  → macro expander calls `unless` transformer
  → returns (if (not ready?) (do (launch!)))
  → expander recurses into sub-forms
  → no more macros; pass to compiler
  → compiler emits ESTree IfStatement
  → astring emits: if (!ready$QMARK) { launch$BANG(); }
```

---

## Fennel-style enforced gensym is the right hygiene model

Four hygiene models exist on a spectrum from "no protection" to "full automatic hygiene." For lykn v0.2.0, the Fennel model—**unhygienic macros with mandatory gensym enforcement and auto-gensym via `#` suffix**—hits the optimal tradeoff.

**Unhygienic `defmacro` (Common Lisp)** is the simplest to implement. Macros are functions; quasiquote builds templates; done. But with no protection, the introduced-binding capture bug is easy to write and hard to debug. Every CL macro tutorial warns about it, and every experienced CL programmer has been bitten. Manual `gensym` solves it, but only if the programmer remembers.

**Full hygienic macros (Scheme's syntax-rules/syntax-case, Racket's scope sets)** eliminate capture automatically. Racket's "sets of scopes" model—where every identifier carries a set of scope tokens, and binding resolution finds the most specific subset match—is the theoretical state of the art. Sweet.js adopted this model for JavaScript macros. But the implementation cost is substantial: syntax objects must carry lexical context through all phases, the expander must track scope creation and propagation, and intentionally breaking hygiene (which real macros sometimes need) requires `datum→syntax` or equivalent escape hatches. **This is overkill for a v0.2.0 of a language without a namespace system.**

**Fennel's enforced gensym** occupies the sweet spot:

- Inside backtick templates, any symbol used in a binding position **must** end with `#` or the compiler raises an error
- `x#` auto-generates a unique name like `_x_0_` (all occurrences of `x#` within one backtick resolve to the same gensym)
- Free variables (like `if`, `do`, `not`) are resolved by the compiler, not by macro expansion, so free-variable capture is impossible for core forms
- Manual `(gensym)` is available for complex cases
- The `sym` function provides an escape hatch for intentional capture

This model catches **~99% of accidental capture bugs** with a single compile-time check. It does not prevent deliberate capture (which is sometimes desired for anaphoric macros like `aif`), and it does not protect against free-variable capture of user-defined functions. Both limitations are acceptable for a language following the "thin skin over JS" philosophy.

For lykn specifically, the auto-gensym syntax should use `#` as the suffix (matching both Fennel and Clojure convention):

```lisp
(defmacro my-max [x y]
  `(let [x# ,x y# ,y]
     (if (< x# y#) y# x#)))

;; Expansion of (my-max (compute-a) (compute-b)):
(let [_x_0_ (compute-a) _y_1_ (compute-b)]
  (if (< _x_0_ _y_1_) _y_1_ _x_0_))
```

---

## Quasiquote should build s-expressions, not ESTree

The central design question for quasiquote: what data does `` `(if ,test ,body) `` construct? Three options exist.

**Option A: S-expression lists (recommended).** The backtick builds a list `["if", <test-value>, <body-value>]` which then flows through the normal compiler. This is how Fennel, Parenscript, eslisp, and ClojureScript all work. Macro authors think in the language's own syntax. Macros compose—one macro's output can invoke another macro. The compiler handles all JS-specific translation.

**Option B: ESTree nodes directly.** The backtick would construct `{type: "IfStatement", test: ..., consequent: ...}`. This forces macro authors to know ESTree intimately, makes composition impossible (ESTree nodes can't invoke other macros), and is extremely verbose. eslisp supports this as an escape hatch—macros can return raw ESTree objects that bypass further expansion—but it's not the primary API.

**Option C: Template strings (à la `@babel/template`).** Parse a JS string template and fill in holes. This mixes JS syntax into Lisp code and loses the benefits of homoiconicity. Babel invented this approach precisely because working with raw AST is painful. A Lisp doesn't have this problem.

**Adopt Option A as the primary mechanism, with Option B available as an escape hatch** for edge cases where the s-expression compiler can't express a particular JS pattern.

The quasiquote implementation should follow **Bawden's algorithm** (PEPM 1999), which uses `append` and `list` (never `cons`) and handles nested quasiquote correctly:

```
`(a ,b ,@c d)  →  (append '(a) (list b) c '(d))
```

At the reader level, the reserved characters map to special forms:

| Syntax | Reader expansion |
|--------|-----------------|
| `` `expr `` | `(quasiquote expr)` |
| `,expr` | `(unquote expr)` |
| `,@expr` | `(unquote-splicing expr)` |

The macro expander treats `quasiquote` as a special form that constructs list/symbol AST nodes at compile time. The `#` dispatch character can serve struct-literal or other reader extensions (`#js{...}` for JS object literals in macro output).

---

## `new Function()` and dynamic `import()` solve Deno's constraints

Deno lacks Node's `vm` module (though it offers a compatibility shim via `node:vm`), but this doesn't matter. Two native mechanisms cover all macro evaluation needs.

**`new Function()` for inline macro evaluation.** Deno fully supports `new Function()` at the same privilege level as the running process. Unlike `eval()`, `new Function()` creates a function **without access to the local scope**, which is actually desirable—it provides natural isolation between macro code and compiler internals. The compiler compiles a macro's body to a JS string, wraps it in `new Function()`, and registers the result:

```javascript
// When the compiler encounters (defmacro unless [test & body] ...)
// 1. Compile the macro body to JS
const jsBody = compileMacroBody(bodyAst);  // returns JS string
// 2. Create executable function
const macroFn = new Function('test', 'body', jsBody);
// 3. Register in macro table
macroEnv.set('unless', macroFn);
```

**Dynamic `import()` with data URIs for macro modules.** Deno supports importing from `data:` URLs: `await import("data:application/javascript," + encodedSource)`. This enables loading compiled macro modules without touching the filesystem:

```javascript
// When the compiler encounters (import-macros "./control-flow.lykn" ...)
// 1. Read and compile the macro module to JS
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

The tradeoff: `new Function()` is synchronous (good for inline `defmacro`), while dynamic `import()` is async (required for `import-macros` with proper ESM semantics). This means the macro expansion phase must be async when macro modules are involved—use `async function macroExpandAll(form, macroEnv)`.

**Deno's `node:vm` compatibility layer** is available but adds unnecessary complexity. It provides `vm.Script`, `vm.runInThisContext`, and `vm.createContext` for sandboxed execution contexts. Reserve this for a future v0.3.0+ sandbox feature if macro security becomes a concern.

---

## Phase separation and macro modules

The "phase separation problem"—macro code runs at compile time but is written in the same language as runtime code—has a clean solution for lykn because **the compiler and the target language are both JavaScript**.

In ClojureScript, this problem is severe: macros must be Clojure (JVM), runtime code is ClojureScript (JS). In Fennel, it's moderate: macros are Fennel evaluated by the Fennel compiler (which is Lua), with a sandboxed environment restricting access to runtime facilities. In lykn, it's minimal: macros are lykn compiled to JS, evaluated by the Deno runtime that also runs the compiler. No cross-language boundary, no separate VM.

**Two phases are sufficient for v0.2.0:**

- **Phase 0 (runtime):** Normal lykn code that compiles to JS output
- **Phase 1 (compile-time):** `defmacro` bodies and macro module code, compiled to JS and evaluated during compilation

Following TypeScript's `import type` precedent, macro imports should use distinct syntax that signals compile-time-only resolution:

```lisp
;; Compile-time only — erased from output JS
(import-macros "./control-flow.lykn" {unless unless when-let when-let})

;; Runtime — appears in output JS as import statement
(import "./utils.js" {helper helper})
```

**Macro modules are regular `.lykn` files** that evaluate to an object of named functions. No separate file format needed. Fennel's approach works: the module is compiled, evaluated, and its exports are registered as macros. The module runs in the compiler's environment with access to AST manipulation utilities (`list`, `sym`, `gensym`, `list?`, `sym?`).

**File-local macros via `defmacro`** emit no JS output. They exist only during compilation of the current file. **Macro modules via `import-macros`** are loaded, compiled, and cached (like Fennel's `macro-searchers` cache). Macros cannot be exported via the normal `export` mechanism—they are compile-time constructs with no runtime representation.

The SLip compiler (lisperator.net/slip) faced this exact problem in a JS context and solved it by compiling and executing each top-level form sequentially: "when you compile a file, each expression is read, compiled and executed, in sequence. This means that a macro can freely use functions that were previously defined in the same file." This sequential processing model works for lykn as well—`defmacro` is available to all subsequent forms in the same file.

---

## Concrete architecture and implementation roadmap

The macro expander slots into lykn's pipeline as a new phase between reader and compiler. Here is the complete expansion algorithm:

```javascript
function macroExpand1(form, macroEnv) {
  if (!isList(form) || isEmpty(form)) return { form, changed: false };
  const head = first(form);
  if (isSymbol(head) && macroEnv.has(head.name)) {
    const transformer = macroEnv.get(head.name);
    const expanded = transformer(...rest(form));  // pass args, not whole form
    return { form: expanded, changed: true };
  }
  return { form, changed: false };
}

async function macroExpandAll(form, macroEnv) {
  // Repeatedly expand outermost macro
  let current = form;
  let changed = true;
  while (changed) {
    ({ form: current, changed } = macroExpand1(current, macroEnv));
  }
  if (!isList(current)) return current;
  const head = first(current);

  // Special forms
  if (isSymbol(head)) {
    if (head.name === 'quote') return current;
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

The macro environment exposes these utilities to macro functions:

| Function | Purpose |
|----------|---------|
| `list(...items)` | Create a list node |
| `sym(name)` | Create a symbol node |
| `gensym(prefix?)` | Create a unique symbol |
| `list?(x)` | Test if x is a list |
| `sym?(x)` | Test if x is a symbol |
| `number?(x)` / `string?(x)` | Type predicates |

**v0.2.0 priorities (essential):** `defmacro` with `new Function()` evaluation, quasiquote/unquote/unquote-splicing in the reader, `gensym`, source location metadata on AST nodes, basic error reporting showing macro call site on failure.

**v0.3.0 additions:** `import-macros` with dynamic `import()`, `macroexpand` debugging utility, auto-gensym (`#` suffix) with Fennel-style compile-time enforcement, macro modules written in lykn.

**v0.4.0 and beyond:** compiler sandbox restricting macro access to I/O, ESTree escape hatch (macros returning raw AST nodes), `macrodebug` pretty-printer.

## Conclusion

The research across twelve macro systems converges on a clear recommendation: **lykn should implement Fennel-style s-expression macros with enforced gensym, using `new Function()` for compile-time evaluation**. This is not a compromise—it's the design that Fennel, the closest architectural analog to lykn, arrived at after years of iteration. The JS ecosystem's experience with Sweet.js (archived February 2026 after struggling with JS grammar complexity) and Babel plugins (no hygiene, but "good enough" adoption) reinforces that Lisp's uniform syntax is a massive advantage for macro systems. lykn doesn't need to solve the enforestation problem, the lexer-parser coupling problem, or the non-delimited syntax problem. It has s-expressions. The hard part is already done.

Three decisions matter most: macros transform s-expressions not ESTree nodes (preserving compositional power), quasiquote builds lists not AST objects (keeping macros accessible), and `new Function()` executes macro code at compile time (avoiding Deno-specific complications). Everything else—hygiene enforcement, macro modules, sandboxing—layers on incrementally without changing the core architecture. TC39 will never add macros to JavaScript. lykn doesn't need them to.
