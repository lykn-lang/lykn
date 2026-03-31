---
number: 25
title: "DD-20: Rust Surface Compiler Architecture"
author: "the classifier"
component: All
tags: [change-me]
created: 2026-03-31
updated: 2026-03-31
state: Draft
supersedes: null
superseded-by: null
version: 1.0
---

# DD-20: Rust Surface Compiler Architecture

**Status**: Decided
**Date**: 2026-03-28
**Session**: v0.3.0 surface language design

## Summary

The Rust surface compiler is a modular **toolchain library**, not a
monolithic compiler. Six modules (reader, surface AST, macro expander,
analysis, kernel emitter, diagnostics) are designed for reuse across
the compiler, linter, and formatter. The compiler pipeline has three
phases: collection, analysis, and emission. The Rust compiler does its
own macro expansion — built-in surface forms are static transforms,
user-defined macros invoke Deno as a subprocess. A parallel JS surface
compiler (using the existing DD-13 pipeline) serves as reference
implementation and future browser-path compiler. The Rust-to-JS kernel
compiler interface is JSON matching the flat-array AST format.

## Decisions

### Toolchain library architecture

**Decision**: The Rust codebase is a **language toolchain library**
with the compiler as one consumer. The library provides reusable
modules for reading, parsing, analyzing, and transforming lykn source.
The compiler, linter, and formatter are separate binaries (or
subcommands of a single `lykn` binary) that compose these modules
differently.

```
┌─────────────────────────────────────────┐
│           lykn toolchain library        │
│                                         │
│  ┌────────┐  ┌─────────────┐            │
│  │ Reader │  │ Surface AST │            │
│  └────┬───┘  └──────┬──────┘            │
│       │             │                   │
│  ┌────▼─────────────▼───┐               │
│  │     Classifier       │               │
│  └────┬─────────────────┘               │
│       │                                 │
│  ┌────▼──────────┐  ┌──────────────┐    │
│  │ Macro Expander│  │  Analysis    │    │
│  └────┬──────────┘  └──────┬───────┘    │
│       │                    │            │
│  ┌────▼────────────────────▼───┐        │
│  │      Kernel Emitter         │        │
│  └────┬────────────────────────┘        │
│       │         ┌──────────────┐        │
│       │         │ Diagnostics  │        │
│       │         └──────────────┘        │
└───────┼─────────────────────────────────┘
        │
        ▼
   JSON (kernel AST)
        │
        ▼
┌───────────────────┐
│ JS kernel compiler│
│ (reader.js +      │
│  compiler.js +    │
│  astring)         │
└───────┬───────────┘
        │
        ▼
   JavaScript output
```

**Consumers**:

| Consumer | Modules used |
|----------|-------------|
| Compiler | Reader, Surface AST, Classifier, Macro Expander, Analysis, Kernel Emitter, Diagnostics |
| Linter | Reader, Surface AST, Classifier, Analysis, Diagnostics |
| Formatter | Reader, Surface AST, Diagnostics |

**Rationale**: A monolithic compiler forces the linter and formatter
to duplicate parsing logic or depend on the entire compiler. A modular
library lets each tool use exactly what it needs. The reader is the
most-shared module — every tool starts by reading `.lykn` files. The
surface AST is the shared language between modules. This also enables
third-party tools (IDE plugins, documentation generators) to build on
the library without pulling in the full compiler.

### Six-module decomposition

**Decision**: The toolchain library consists of six modules with
defined responsibilities and interfaces.

**Reader module**: Parses `.lykn` source text into a generic
s-expression tree. Implements the reader specification from DD-01
(colon syntax, lisp-case identifiers), DD-12 (`#` dispatch table:
`#a(...)`, `#o(...)`, `#;`, `#NNr`, `#|...|#`), and DD-15 (keyword
type: `:name` → `{ type: "keyword", value: "name" }`). The reader
produces an untyped tree of atoms, lists, keywords, and literals.
It attaches source locations (file, line, column, span) to every
node.

- **Input**: `.lykn` source text (string or file path)
- **Output**: Generic s-expression tree with source locations
- **Consumers**: Compiler, linter, formatter

**Surface AST module**: Defines the typed AST representation for
lykn/surface forms. Each surface form (DD-15 through DD-19) has a
corresponding AST node type. This is a Rust enum (or equivalent)
with variants for `Func`, `Bind`, `Match`, `Type`, `Obj`, `Cell`,
`Express`, `Swap`, `Reset`, `ThreadFirst`, `ThreadLast`,
`SomeThreadFirst`, `SomeThreadLast`, `IfLet`, `WhenLet`, `Fn`,
`Lambda`, and `KernelPassthrough`. Each variant carries its
constituent parts as typed fields (e.g., `Func` has `name`,
`clauses`, each clause has `args`, `returns`, `pre`, `post`, `body`).

- **Input**: N/A (type definitions only)
- **Output**: N/A (type definitions only)
- **Consumers**: All modules that operate on classified forms

**Classifier module**: Transforms the generic s-expression tree
into the typed surface AST. This is where "is this a `func` or a
`match` or a kernel passthrough?" is decided. The classifier
dispatches on the head symbol of each list form. Known surface form
names (`func`, `match`, `type`, `bind`, `obj`, `cell`, `express`,
`swap!`, `reset!`, `->`, `->>`, `some->`, `some->>`, `if-let`,
`when-let`, `fn`, `lambda`, `macro`, `import-macros`) produce typed
surface AST nodes. Known kernel form names (`const`, `function`,
`lambda`, `=>`, `if`, `import`, `export`, `class`, `for`, `try`,
etc.) produce `KernelPassthrough` nodes. Unknown head symbols are
classified as function calls.

The classifier validates surface form structure — it rejects
malformed forms with source-located error messages (e.g., "`func`
missing `:args` keyword", "`type` field missing type annotation").

```
Generic s-expression tree
        │
        ▼
   ┌────────────┐
   │ Classifier │
   └────┬───────┘
        │
        ▼
Typed surface AST
   ├── Func { name, clauses: [{ args, returns, pre, post, body }] }
   ├── Match { target, clauses: [{ pattern, guard, body }] }
   ├── Type { name, constructors: [{ name, fields }] }
   ├── Bind { name, type_annotation, value }
   ├── Obj { pairs: [(keyword, value)] }
   ├── ThreadFirst { initial, steps }
   ├── SomeThreadFirst { initial, steps }
   ├── IfLet { binding_clause, then_branch, else_branch }
   ├── ...
   └── KernelPassthrough { raw_sexpr }
```

- **Input**: Generic s-expression tree
- **Output**: Typed surface AST (or diagnostic errors)
- **Consumers**: Compiler (mandatory), linter (mandatory)

**Macro expander module**: Expands macros in the surface AST.
Built-in surface forms are NOT macros — they are typed AST nodes
handled by the classifier and emitter directly. User-defined macros
(`macro` definitions and `import-macros` imports) are expanded by
this module. Expansion of user-defined macros invokes Deno as a
subprocess (see "User-defined macro evaluation via Deno subprocess"
decision below). The expander implements DD-13's three-pass pipeline
logic: Pass 0 (`import-macros`), Pass 1 (macro compilation), Pass 2
(expansion with recursive top-down fixed-point walk and per-node
safety limit).

- **Input**: Typed surface AST (may contain macro invocations)
- **Output**: Typed surface AST (macros expanded, may produce new
  surface forms or kernel forms)
- **Consumers**: Compiler

**Analysis module**: Static analysis passes over the typed surface
AST. Implemented as a set of independent passes that each traverse
the AST and produce diagnostics:

| Pass | Applies to | Produces |
|------|-----------|----------|
| Exhaustiveness | `Match` nodes | Compile errors for non-exhaustive matches |
| Overlap detection | Multi-clause `Func` nodes | Compile errors for overlapping clauses |
| Unused bindings | All binding forms | Warnings for unused `Bind`, `Func`, pattern bindings |
| Scope tracking | All forms | Binding introduction, usage, shadowing analysis |
| Type registration | `Type` nodes | Populates the type registry with constructors and variant sets |

The analysis module provides a **trait-based form handler**
interface. Each surface AST node type has an associated handler that
implements analysis behavior. Surface form handlers perform real
analysis. `KernelPassthrough` handlers perform basic scope tracking
(binding introduction, usage detection) but no semantic analysis.
This trait boundary is the extension point — when checks for kernel
forms are identified later, they are implemented without changing
the architecture.

The **type registry** is a data structure populated during the
collection phase and consumed during analysis. It maps type names to
their constructor sets (constructor name → field names and types).
The registry also tracks **blessed types** — `Option` and `Result`
from `lykn/core` — identified by module path. Blessed types get
enhanced error messages (see Diagnostics module).

The **prelude** is injected by the analysis module during the
collection phase. Every surface module behaves as if it begins with:

```lisp
(import (Option Some None) "lykn/core/option")
(import (Result Ok Err) "lykn/core/result")
```

These imports are added to the AST before classification. They can
be shadowed by local definitions — a module that defines its own
`Option` type uses its local version and loses compiler-enhanced
behavior.

- **Input**: Typed surface AST + type registry
- **Output**: Diagnostics (errors, warnings) + populated type
  registry
- **Consumers**: Compiler, linter

**Kernel emitter module**: Transforms the typed surface AST into
kernel AST (flat arrays matching the JS reader's output format).
Each surface AST node type has an emission rule:

| Surface node | Kernel emission |
|-------------|----------------|
| `Bind` | `(const name value)` |
| `Func` (single clause) | `(function name (args...) body...)` with type checks, contracts |
| `Func` (multi-clause) | `(function name (...args) dispatch-chain...)` |
| `Match` (statement) | `(if test1 body1 (if test2 body2 ...))` |
| `Match` (expression) | IIFE: `((=> () (if test1 (return body1) ...)))` |
| `Type` | Constructor functions + const declarations |
| `Obj` | `(object (key1 val1) (key2 val2) ...)` |
| `Cell` | `(object (value init))` |
| `Express` | `target:value` |
| `Swap` | `(= target:value (f target:value))` |
| `Reset` | `(= target:value new-value)` |
| `ThreadFirst` | Nested calls (pure rewrite) |
| `ThreadLast` | Nested calls (pure rewrite) |
| `SomeThreadFirst` | IIFE with `== null` checks |
| `IfLet` | IIFE or statement depending on context |
| `WhenLet` | IIFE or statement depending on context |
| `Fn` / `Lambda` | `(lambda (args...) body...)` or `(=> (args...) body...)` |
| `KernelPassthrough` | Raw s-expression unchanged |

The emitter is where **context detection** happens — determining
whether a form is in value position (needs IIFE), statement position
(plain if-chain), or tail position of a `func` (if-chain with
`return`). The emitter also handles **assertion stripping** — when
`--strip-assertions` is active, type checks, contract checks, and
constructor validation are omitted from the output.

- **Input**: Typed surface AST (analyzed)
- **Output**: Kernel AST as JSON (flat arrays)
- **Consumers**: Compiler

**Diagnostics module**: Error and warning formatting. Provides
structured diagnostic objects with severity, message, source
location, and optional fix suggestions. Includes the **s-expression
serializer** — converts surface AST nodes back to s-expression text
for inclusion in contract error messages (DD-19).

Enhanced messages for blessed types:

| Generic message | Enhanced message (blessed type) |
|----------------|-------------------------------|
| "non-exhaustive match — missing `None`" | "this function can return `None` but you haven't handled the empty case" |
| "non-exhaustive match — missing `Err`" | "this `Result` match doesn't handle the error case" |

- **Input**: Diagnostic data from any module
- **Output**: Formatted messages (text, JSON, or LSP-compatible)
- **Consumers**: All tools

**Rationale**: Six modules is the minimum decomposition that
achieves clean separation of concerns with reuse across tools. The
reader is shared by all three tools. The surface AST is the lingua
franca. The classifier is shared by compiler and linter. Analysis
is shared by compiler and linter. The kernel emitter is
compiler-only. Diagnostics is shared by all. Fewer modules would
couple concerns (e.g., merging classifier into reader loses the
ability for the formatter to work on generic s-expressions). More
modules would be premature decomposition.

### Two-level AST: generic s-expression tree → typed surface AST

**Decision**: The Rust compiler operates on two AST levels. The
**generic s-expression tree** is the reader's output — untyped nodes
representing atoms, lists, keywords, numbers, strings, and booleans,
each with source locations. The **typed surface AST** is the
classifier's output — a Rust enum with variants for each surface form,
carrying structured fields.

The two-level design exists because:

1. The reader should not need to know about surface forms. It parses
   syntax, not semantics. This makes the reader stable — new surface
   forms in future DDs never change the reader.
2. The formatter operates on the generic tree (it cares about
   structure and whitespace, not semantics).
3. The classifier is where structural validation happens — malformed
   surface forms produce clear errors with source locations.
4. Analysis passes and the emitter work on typed nodes, getting
   compile-time guarantees (in Rust's type system) that the AST is
   well-formed.

**Pipeline**:

```
.lykn text
    │
    ▼
Reader ──► Generic s-expression tree (atoms, lists, keywords, locs)
    │
    ▼
Classifier ──► Typed surface AST (Func, Match, Type, Bind, ...)
    │
    ▼
Macro Expander ──► Typed surface AST (user macros expanded)
    │
    ▼
Collection phase ──► Type registry populated, prelude injected
    │
    ▼
Analysis phase ──► Diagnostics (errors, warnings)
    │
    ▼
Emission phase ──► Kernel AST (JSON)
    │
    ▼
JS kernel compiler ──► JavaScript
```

**Rationale**: Two-level ASTs are standard in production compilers.
Rust's own compiler has a parse tree (AST), a high-level IR (HIR),
and a mid-level IR (MIR). TypeScript has a syntax tree and a bound
tree. The generic-then-typed pattern catches structural errors early
(in the classifier) and gives downstream passes typed, validated
input. The alternative — a single AST level — would force analysis
passes to re-validate structure at every use site.

### Three compilation phases

**Decision**: After classification and macro expansion, the compiler
executes three sequential phases:

**Phase 1 — Collection**: Traverses the typed surface AST to gather
metadata needed by later phases. Specifically:

- Registers all `Type` definitions in the type registry (constructor
  names, field names, field types, variant sets)
- Collects `Func` signatures for multi-clause overlap detection
- Resolves prelude imports (injects `Option`/`Result` if not
  shadowed)
- Builds the scope tree (what bindings are visible where)

Collection must complete before analysis begins, because
exhaustiveness checking on a `Match` node requires the type registry
to contain all variants of the matched type.

**Phase 2 — Analysis**: Runs analysis passes over the typed surface
AST, using metadata from the collection phase:

- **Exhaustiveness checking** on `Match` nodes — ensures every
  variant is covered, using the type registry's variant sets and
  Maranget's usefulness/exhaustiveness algorithm (DD-17)
- **Overlap detection** on multi-clause `Func` nodes — ensures no
  two clauses can match the same arguments (DD-16)
- **Unused binding detection** — flags bindings that are never
  referenced
- **Scope analysis** — identifies shadowing, reports undefined
  references

Analysis produces diagnostics. If any diagnostic is an error
(exhaustiveness failure, overlap, undefined reference), compilation
halts after analysis — the emission phase does not run.

**Phase 3 — Emission**: Transforms the typed surface AST into kernel
AST. This is where:

- Surface form nodes become kernel form arrays
- Type checks and contract assertions are emitted (unless
  `--strip-assertions`)
- Context detection determines IIFE vs statement codegen
- `await` hoisting/async IIFE wrapping is applied
- The s-expression serializer captures contract expressions for
  error messages
- `KernelPassthrough` nodes are emitted unchanged

The output is a JSON array representing the complete kernel AST for
the module.

**Rationale**: Three phases keep each phase's responsibilities
focused. Collection is a data-gathering pass — it doesn't reject
anything. Analysis is a checking pass — it doesn't transform
anything. Emission is a transformation pass — it doesn't analyze
anything. Any two phases could theoretically be merged (collection
into analysis, or analysis into emission), but the separation makes
each phase easier to reason about, test, and debug independently.

### JSON interface to JS kernel compiler

**Decision**: The Rust surface compiler emits kernel AST as JSON.
The JSON format matches exactly the flat-array data structures that
the JS reader produces — nested arrays of strings (symbols),
numbers, booleans, and `null`. The JS kernel compiler receives this
JSON, parses it with `JSON.parse()`, and feeds the result directly
to `compiler.js` as if the reader had produced it.

**Example**: The surface form `(bind x 42)` produces the kernel
form `(const x 42)`, serialized as:

```json
["const", "x", 42]
```

A complete module with multiple top-level forms produces an array
of kernel forms:

```json
[
  ["const", "name", "Duncan"],
  ["const", "age", 42],
  ["function", "greet", ["name"],
    ["console.log", ["template", "Hello, ", "name"]]]
]
```

Keywords in kernel output are serialized as their string values
(`:name` → `"name"`) since keywords compile to strings (DD-15).

**Rationale**: JSON is the natural serialization of the JS reader's
output format. The JS kernel compiler already operates on exactly
this data shape — arrays of arrays of primitives. No new parser, no
new format, no new protocol. The JSON files are human-readable and
debuggable (`cat output.json | jq .`). The format also serves as the
canonical test fixture format (see "Parallel JS implementation"
decision).

### Full Rust macro expansion

**Decision**: The Rust surface compiler performs all macro expansion
itself. It does not delegate to the JS-based expander. Built-in
surface forms and user-defined macros are handled differently:

**Built-in surface forms** (`bind`, `func`, `fn`, `lambda`, `type`,
`match`, `obj`, `cell`, `express`, `swap!`, `reset!`, `->`, `->>`,
`some->`, `some->>`, `if-let`, `when-let`, `assoc`, `dissoc`,
`conj`) are **static compiler transforms**. They are classified into
typed surface AST nodes by the classifier, analyzed by the analysis
module, and transformed to kernel forms by the emitter. No macro
system involvement — the Rust compiler knows their expansion rules
at compile time.

**User-defined macros** (`macro` definitions and `import-macros`
imports) are expanded by the macro expander module, which implements
DD-13's three-pass pipeline:

- Pass 0: Process `import-macros` forms, load and compile macro
  modules
- Pass 1: Compile `macro` definitions in the current file (iterative
  fixed-point for order independence)
- Pass 2: Expand macro invocations (recursive top-down fixed-point
  walk with per-node safety limit)

User-defined macro evaluation invokes **Deno as a subprocess**. The
macro body (compiled to JS via the same `new Function()` approach
from DD-11/DD-14) and the macro arguments (serialized as JSON) are
passed to a Deno process. The process evaluates the macro body with
the macro environment API (`array`, `sym`, `gensym`, `isArray`,
etc.) and returns the expanded AST as JSON.

```
Rust macro expander
    │
    ├── macro body + args (JSON) ──► Deno subprocess
    │                                    │
    │                                    ▼
    │                              new Function() eval
    │                              macro environment API
    │                                    │
    │   expanded AST (JSON) ◄────────────┘
    │
    ▼
Classifier (re-classify expanded forms)
```

After expansion, the expanded forms are fed back through the
classifier to produce typed surface AST nodes. This means a
user-defined macro can expand to any surface form or kernel form —
the classifier handles it uniformly.

**Rationale**: Full Rust expansion keeps the entire compilation
pipeline in Rust, making it a single-process operation (modulo Deno
subprocess calls for user-defined macros). Built-in surface forms as
static transforms rather than macros provides the compiler with full
structural knowledge — it can analyze `func` clauses, check `match`
exhaustiveness, and detect errors before any transformation happens.
If built-in forms were macros, the compiler would only see their
kernel expansions, losing the structural information needed for
static analysis. User-defined macros use Deno subprocess invocation
rather than embedding V8 in Rust — this is architecturally clean
(no V8 dependency), uses the project's existing Deno toolchain, and
compile-time macro evaluation is not a performance bottleneck for
most projects. Embedding V8 is a future optimization if needed.

### Parallel JS surface compiler

**Decision**: A parallel JS surface compiler, using the existing
DD-13 pipeline infrastructure, serves two purposes:

1. **Reference implementation**: The JS surface compiler expands all
   surface forms (built-in and user-defined) as macros using the
   existing `new Function()` expander. Its kernel output (JSON)
   becomes the canonical test fixture set for the Rust implementation.
   Both compilers must produce identical kernel JSON for the same
   input.

2. **Future browser-path compiler**: The JS surface compiler will
   eventually run in the browser, enabling lykn/surface syntax in
   HTML `<script>` tags. The Rust compiler handles CLI compilation;
   the JS compiler handles browser-embedded compilation.

**Development workflow**: Implement surface form expansion in JS
first (it's easier — the macro infrastructure exists). Capture the
kernel JSON output as test fixtures. Build the Rust implementation
to produce identical JSON. The JS implementation is the fast path
to a working surface compiler; the Rust implementation is the
production path with static analysis.

In the JS surface compiler, ALL surface forms are macros — there is
no classifier, no typed AST, no analysis passes. This is fine because
the JS compiler doesn't provide static analysis. It's a pure
expansion engine. The Rust compiler provides the safety guarantees.

```
                    ┌─────────────────┐
                    │  .lykn source   │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │                           │
              ▼                           ▼
   ┌──────────────────┐       ┌──────────────────┐
   │ Rust surface     │       │ JS surface       │
   │ compiler         │       │ compiler         │
   │ (typed AST,      │       │ (macro-only,     │
   │  analysis,       │       │  no analysis)    │
   │  static checks)  │       │                  │
   └────────┬─────────┘       └────────┬─────────┘
            │                          │
            ▼                          ▼
   ┌──────────────────┐       ┌──────────────────┐
   │ Kernel JSON      │  ═══  │ Kernel JSON      │
   │ (must match)     │       │ (canonical)      │
   └────────┬─────────┘       └────────┬─────────┘
            │                          │
            └──────────┬───────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │ JS kernel        │
            │ compiler         │
            └────────┬─────────┘
                     │
                     ▼
                 JavaScript
```

**Rationale**: The parallel implementation strategy provides a fast
path to a working surface compiler (JS is easier to iterate in),
a rigorous test suite (identical output requirement), and a future
browser deployment path. The JS compiler doesn't duplicate the Rust
compiler's analysis — it only duplicates the expansion rules. This
is acceptable because the browser-path compiler explicitly trades
safety (no static analysis) for deployability (runs in the browser
without Rust).

### Kernel form passthrough with trait-based analysis

**Decision**: When the classifier encounters a known kernel form
name (`const`, `function`, `lambda`, `=>`, `if`, `import`, `export`,
`class`, `for`, `try`, `while`, `do-while`, `switch`, `throw`,
`return`, `break`, `continue`, `new`, `delete`, `typeof`, `instanceof`,
`in`, `void`, `yield`, `label`, `seq`, `debugger`, etc.), it produces
a `KernelPassthrough` node wrapping the raw s-expression.

The analysis module uses a **trait-based form handler** interface.
Each surface AST node type implements this trait with analysis
behavior appropriate to its semantics. `KernelPassthrough` implements
the trait with a minimal handler that performs:

- **Binding introduction**: recognizes `const` (binding a name),
  `function` (binding a name), `class` (binding a name), `import`
  (binding imported names)
- **Binding usage**: scans sub-expressions for symbol references
- **No semantic analysis**: no type checking, no exhaustiveness, no
  contract verification

This trait boundary is the **extension point** for future analysis
of kernel forms. When specific checks are identified (e.g., warning
on `for...in` usage, detecting `this` references in surface context),
they are implemented as additional behavior on the
`KernelPassthrough` handler or by introducing more specific kernel
AST node types. The architecture does not need to change.

DD-15's edge case table states "Kernel form used in surface context:
Permitted — surface is a superset of kernel." This decision
implements that guarantee — kernel forms pass through classification,
analysis, and emission with their structure preserved.

**Rationale**: The trait-based approach satisfies both the current
need (kernel forms work in surface files) and the future need
(analysis can be added incrementally). A no-op passthrough would lose
the ability to detect unused kernel bindings or undefined kernel
references. A full kernel AST (with typed variants for every kernel
form) would be premature — the Rust compiler doesn't need to
understand kernel semantics to emit them.

### Expression-position codegen module

**Decision**: The kernel emitter includes a shared **expression-
position codegen module** used by all forms that need IIFE wrapping.
The module provides three codegen strategies selected by context:

| Context | Strategy | Used by |
|---------|----------|---------|
| Statement position | Plain if-chain, no wrapping | `match`, `if-let`, `when-let` |
| Value position | IIFE: `(() => { ... })()` | `match`, `some->`, `some->>`, `if-let`, `when-let` |
| Tail position of `func` | If-chain with `return` in each branch | `match`, `if-let`, `when-let` |

**Context detection**: The emitter tracks an **expression context**
as it descends the surface AST. The context is one of:

- `Statement` — the form's value is unused (top-level expression,
  body of `when-let` in statement position, etc.)
- `Value` — the form's value is used (right side of `bind`, argument
  to a function call, body of `fn`, etc.)
- `Tail` — the form is the last expression in a `func` body with
  `:returns` (the emitter needs to add `return` but not wrap in IIFE)

The context is propagated through the AST — when the emitter
processes a `Bind` node, the value expression is emitted in `Value`
context. When it processes a `Func` body, the last expression is
emitted in `Tail` context if `:returns` is present, `Statement`
context if not.

**Rationale**: Without a shared module, each form would independently
implement context detection and IIFE wrapping, leading to
inconsistencies and code duplication. The three-strategy model covers
all cases identified across DD-17 (`match`) and DD-18 (`some->`,
`if-let`, `when-let`). Tail-position detection is an optimization
that avoids unnecessary IIFEs when a `match` is the last expression
in a function — the function's own `return` mechanism suffices.

### `await` handling in expression-position forms

**Decision**: The expression-position codegen module handles `await`
inside IIFEs with two strategies, selected by where the `await`
appears:

**Strategy 1 — Target hoisting**: When `await` appears in the
**target expression** of a `match`, `if-let`, or `when-let`, or in
the **initial value** of a `some->`, the `await` is hoisted out of
the IIFE into a `const` binding before it:

```lisp
;; await in match target
(bind result (match (await (fetch url))
  ((Ok data) (process data))
  ((Err e) (handle e))))
```

```javascript
const _matchTarget = await fetch(url);
const result = (() => {
  if (_matchTarget.tag === "Ok") {
    const data = _matchTarget.value;
    return process(data);
  }
  if (_matchTarget.tag === "Err") {
    const e = _matchTarget.error;
    return handle(e);
  }
})();
```

**Strategy 2 — Async IIFE**: When `await` appears in a **branch
body** of a `match`, `if-let`, or `when-let`, or in a **step** of
`some->` / `some->>`, the IIFE is emitted as `async` and the entire
IIFE call is wrapped in an outer `await`:

```lisp
;; await in branch body
(bind result (match response
  ((Ok url) (await (fetch url)))
  ((Err e) (handle e))))
```

```javascript
const result = await (async () => {
  if (response.tag === "Ok") {
    const url = response.value;
    return await fetch(url);
  }
  if (response.tag === "Err") {
    const e = response.error;
    return handle(e);
  }
})();
```

**Detection**: The emitter scans each form's sub-expressions for
`await` nodes during emission. If `await` is found in the target/
initial position, Strategy 1 applies. If `await` is found in branch
bodies or steps, Strategy 2 applies. If both are present, both
strategies apply (hoist the target AND emit async IIFE).

**Constraint**: Strategy 2 requires the enclosing function to be
`async`. If the emitter detects `await` in a branch body inside a
non-async function context, it produces a compile error: "cannot use
`await` inside `match` in a non-async function."

**ESTree nodes**: Strategy 1 → `VariableDeclaration` (`const`) +
`AwaitExpression` before the IIFE. Strategy 2 → `AwaitExpression`
wrapping `CallExpression` wrapping `ArrowFunctionExpression` with
`async: true`.

**Rationale**: These two strategies handle all cases identified in
DD-17 and DD-18's open questions. Target hoisting is preferred when
applicable because it avoids the async IIFE overhead — the IIFE
itself stays synchronous. Async IIFE is the general fallback for
`await` anywhere in the body. Both strategies produce correct,
idiomatic JavaScript. The alternative — compile error requiring
manual restructuring — was considered as a v0.3.0 fallback but is
unnecessary given that both strategies are straightforward to
implement.

### Assertion stripping

**Decision**: The `--strip-assertions` CLI flag controls a boolean
in the emitter's context. When active, the emitter omits:

- Type checks in `func` `:args` (DD-16)
- Return type checks from `func` `:returns` (DD-16)
- `:pre` contract assertions (DD-19)
- `:post` contract assertions (DD-19)
- Constructor field type validation in `type` (DD-17)

The emitter does **NOT** strip:

- Multi-clause `func` dispatch checks (these are runtime semantics,
  not assertions — DD-16)
- `match` exhaustiveness (this is a compile-time check, not a runtime
  emission — it runs in the analysis phase regardless of the flag)

**Implementation**: The emitter checks the strip flag at each
assertion emission site. When stripping, the assertion code is simply
not emitted — no dead code, no conditional branches, no runtime cost.
The function body compiles as if no contracts existed.

```bash
# Dev mode (default) — assertions emitted
lykn compile src/app.lykn

# Production mode — assertions stripped
lykn compile --strip-assertions src/app.lykn
```

**Rationale**: A single boolean flag is the simplest correct
implementation. No granularity (strip types but keep contracts, etc.)
is needed for v0.3.0. The flag is a deployment decision, not a code
decision — the same source compiles differently. This follows
Clojure.spec's `*compile-asserts*` and Eiffel's assertion monitoring.

### Error infrastructure and s-expression serialization

**Decision**: The diagnostics module provides a structured diagnostic
type with:

| Field | Purpose |
|-------|---------|
| `severity` | Error, warning, info |
| `message` | Human-readable message text |
| `location` | File path, line, column, span (from source locations on AST nodes) |
| `source_form` | Original s-expression text (for contract error messages) |
| `suggestion` | Optional fix suggestion |

The **s-expression serializer** converts surface AST nodes back to
s-expression text. It is used in two contexts:

1. **Contract error messages** (DD-19): `:pre` and `:post`
   expressions are serialized to strings and embedded in the error
   message literal. The serializer produces the original lykn source
   text (after reader processing but before any transformation).

2. **Diagnostic messages**: When reporting errors like "non-exhaustive
   match — missing `None`", the diagnostic includes the source
   location of the `match` form and optionally the serialized
   s-expression for context.

**Enhanced messages for blessed types**: The diagnostics module
recognizes `Option` and `Result` (identified via the type registry's
blessed type flag) and produces domain-specific error messages:

| Condition | Generic message | Enhanced message |
|-----------|----------------|-----------------|
| Match on `Option` missing `None` | "non-exhaustive match — missing variant `None`" | "this function can return `None` but you haven't handled the empty case" |
| Match on `Result` missing `Err` | "non-exhaustive match — missing variant `Err`" | "this `Result` match doesn't handle the error case — did you mean to propagate it?" |
| Void function returns `Option` value | N/A (future) | "this function returns an `Option` but callers can't access it — did you mean to add `:returns`?" |

**Error message format** for runtime assertions (emitted in compiled
JS):

```
<function-name>: pre-condition failed: <source-expression> — caller blame
<function-name>: post-condition failed: <source-expression> — callee blame
<function-name>: arg '<param-name>' expected <type>, got <actual-type>
<constructor-name>: field '<field-name>' expected <type>, got <actual-type>
```

**Rationale**: Structured diagnostics enable tooling (IDEs, CI
pipelines) to consume errors programmatically. The s-expression
serializer is a small utility but architecturally important — it's
the bridge between the compiler's internal AST and the developer-
facing error messages. Enhanced messages for blessed types are a
concrete payoff of compiler recognition (DD-17) — the compiler knows
what `None` and `Err` mean semantically, not just structurally.

## Rejected Alternatives

### Monolithic compiler binary

**What**: A single Rust binary that combines reader, analysis,
transformation, and codegen into one unit.

**Why rejected**: The linter and formatter need the reader and AST
but not the kernel emitter. A monolithic compiler forces these tools
to either duplicate parsing or depend on the entire compiler. The
modular library enables clean tool composition.

### JS reader feeding Rust compiler

**What**: The JS reader parses `.lykn` files, passes the AST to the
Rust compiler as JSON. Avoids implementing a reader in Rust.

**Why rejected**: Creates a dependency on the JS reader for all Rust
tools. The linter and formatter would need to invoke a JS process
before they can operate. The reader specification (DD-01, DD-12) is
well-defined and stable — implementing it in Rust is straightforward
and eliminates the cross-language dependency.

### Rust replaces JS reader entirely

**What**: The Rust reader becomes the only reader. The JS reader is
retired.

**Why rejected (deferred)**: The JS reader is needed for the
browser-path compiler (future `<script>` tag support). Long-term the
Rust reader is canonical for CLI tooling, but the JS reader continues
to serve the browser path. Both readers implement the same spec.

### Hybrid macro expansion (built-in in Rust, user in JS)

**What**: Built-in surface forms are compiler transforms in Rust,
but user-defined macros delegate to the JS-based DD-13 expander
running as a subprocess.

**Why rejected**: The Rust compiler needs to see all forms — both
built-in and user-defined — to perform static analysis across the
entire module. If user-defined macros expand in a separate JS
process, the Rust compiler receives their kernel output and loses
the ability to analyze macro-generated surface forms. Full Rust
expansion with Deno subprocess for `new Function()` evaluation keeps
the analysis pipeline unified while still using JS for the part that
requires it (executing macro body code).

### Embedding V8 in Rust for macro evaluation

**What**: Link `rusty_v8` or Deno's runtime directly into the Rust
toolchain library for in-process macro evaluation.

**Why rejected (deferred)**: Heavy dependency. The Deno subprocess
approach is architecturally clean and sufficient for v0.3.0 — macro
evaluation at compile time is not a performance bottleneck. Embedding
V8 is a future optimization if profiling shows subprocess overhead
is significant.

### Single-level AST (generic s-expression only)

**What**: The Rust compiler operates on the generic s-expression
tree directly, without a typed surface AST. Each module pattern-
matches on tree structure to recognize forms.

**Why rejected**: Duplicated validation. Every module that needs to
process a `func` form would independently validate that it has the
right keywords in the right positions. The typed surface AST
centralizes validation in the classifier, giving downstream modules
typed, guaranteed-well-formed input. This is the same reason
production compilers (Rust, TypeScript, Go) all have multiple IR
levels.

### Compile error for `await` in expression-position forms

**What**: Rather than hoisting or async IIFEs, emit a compile error
requiring the developer to restructure: "cannot use `await` inside
expression-position `match` — bind the awaited value first."

**Why rejected**: The restructuring is mechanical — the compiler can
do it automatically. A compile error pushes work onto the developer
for no safety benefit. The hoisting and async IIFE strategies produce
correct, idiomatic JavaScript. The compile error was considered as a
v0.3.0 fallback but is unnecessary.

### Merging collection and analysis phases

**What**: Analyze each form as it's encountered during a single
traversal, rather than separate collection and analysis passes.

**Why rejected**: Collection must complete before analysis because
exhaustiveness checking on a `Match` node requires the type registry
to contain all variants of the matched type — and the `type`
definition might appear after the `match` in source order. Separate
phases guarantee that all metadata is available when analysis runs,
regardless of declaration order.

### Per-file `--strip-types` / `--strip-contracts` granularity

**What**: Separate flags for stripping type checks vs contract
checks.

**Why rejected**: Premature granularity. No use case has been
identified for stripping types but keeping contracts (or vice versa).
A single boolean flag is the simplest correct implementation. If
granularity is needed later, the flag can be extended without
changing the emitter's architecture — the emission sites already
check individual assertion types.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| Empty `.lykn` file | Compiles to empty kernel JSON array | `[]` |
| File with only kernel forms | All forms pass through as `KernelPassthrough` | `(const x 42)` → `["const", "x", 42]` |
| File with only surface forms | All forms classified, analyzed, emitted | Normal compilation |
| Mixed surface and kernel forms | Each form classified independently | Surface forms get analysis, kernel forms pass through |
| Surface form referencing kernel binding | Scope tracking covers both | `(const x 42) (bind y (+ x 1))` — `x` in scope for `y` |
| `type` defined after `match` that uses it | Collection phase processes `type` first (full traversal) | Order-independent |
| User macro expanding to surface form | Re-classified after expansion | `(my-macro ...)` → `(match ...)` → `Match` AST node |
| User macro expanding to kernel form | Re-classified as `KernelPassthrough` | `(my-macro ...)` → `(const ...)` → `KernelPassthrough` |
| `import-macros` from missing file | Compile error with source location | "cannot find macro module: ./missing.lykn" |
| Deno subprocess failure | Compile error with subprocess stderr | "macro evaluation failed: ..." |
| Deno not installed | Compile error with actionable message | "user-defined macros require Deno — install from deno.land" |
| `--strip-assertions` with no assertions | No effect — compiles normally | Clean output identical to dev mode |
| `await` in both target and body | Both strategies apply | Hoist target + async IIFE for body |
| `await` in non-async function | Compile error | "cannot use `await` in non-async function" |
| Nested `match` in expression position | Outer and inner both get IIFE treatment | Inner IIFE nested inside outer IIFE branch |
| `match` as last expression of `func` with `:returns` | Tail context — if-chain with `return`, no IIFE | Optimized codegen |
| Formatter processing surface forms | Uses reader output only (generic tree) | No classification needed |
| Linter checking exhaustiveness | Uses reader + classifier + analysis | Same analysis as compiler |

## Dependencies

- **Depends on**: DD-01 (colon syntax — reader specification),
  DD-02 through DD-09 (kernel form names — classifier needs the
  complete list), DD-10 through DD-14 (macro system — expander
  reimplements the three-pass pipeline, `new Function()` protocol,
  macro environment API), DD-15 (surface language architecture —
  surface form vocabulary, keyword type, `js:` interop), DD-16
  (`func` — type check emission, contract emission, multi-clause
  dispatch, assertion stripping), DD-17 (`type` + `match` —
  exhaustiveness analysis, tagged object representation, IIFE codegen,
  blessed type registry), DD-18 (threading macros — IIFE codegen for
  `some->`, `if-let`, `when-let`, `== null` exception), DD-19
  (contracts — s-expression serialization for error messages, single-
  expression `:pre`/`:post`, blame attribution)
- **Affects**: DD-21 (type analysis and exhaustiveness — detailed
  design of the analysis module's type-related passes, deferred to
  its own DD). Future DDs: browser-path JS surface compiler, IDE/LSP
  integration, formatter design, linter rule set.

## Open Questions

- [ ] Deno subprocess protocol — exact JSON schema for macro body +
  arguments passed to Deno, and expanded AST returned. Needs detailed
  design during implementation. The schema should match the generic
  s-expression tree format for interoperability.
- [ ] Macro caching in Rust — DD-14 specifies path + mtime caching.
  The Rust compiler should cache compiled macro modules across files
  in the same compilation run. Cross-run caching (persistent on disk)
  is a v0.3.x optimization.
- [ ] Source map generation — the Rust compiler has full source
  location information. Emitting source maps for debugging compiled
  JS is a natural extension but not designed here.
- [ ] Incremental compilation — the three-phase architecture supports
  incremental recompilation (re-run only affected phases when a file
  changes) but this is not designed for v0.3.0.
- [ ] LSP integration — the modular library is designed for LSP
  server integration (reader + classifier + analysis = diagnostics on
  save). Detailed LSP protocol design is a future DD.
- [ ] Performance of Deno subprocess for macro evaluation — if
  macro-heavy projects show measurable compile-time overhead from
  subprocess spawning, consider a persistent Deno process (long-
  running macro evaluation server) or V8 embedding. Deferred until
  profiling data is available.
- [ ] Formatter design — the formatter uses the reader module and
  generic s-expression tree. It needs access to comments (currently
  discarded by most readers). The reader module should preserve
  comments as metadata for formatter consumption. Detailed design
  in a future DD.
- [ ] Linter rule set — the linter uses reader + classifier +
  analysis. The specific rules (beyond exhaustiveness and unused
  bindings) need their own design. Candidates from DD-15–19:
  keyword casing (`:firstName` → suggest `:first-name`), `:when`
  with side effects in guards, `when-let` with `_` pattern (dead
  code), `if-let` with `_` pattern (dead else branch).
- [ ] Array patterns in `match` — DD-17 deferred detailed design
  for array destructuring patterns and their interaction with
  exhaustiveness. The classifier and analysis module need to handle
  these when designed.
- [ ] The `cell` + `match` interaction — DD-17 noted that `(match
  counter ...)` on a cell should be a compile error with message
  "cannot match on cell — use express." The analysis module needs a
  check for this, requiring knowledge of which bindings are cells.

## Version History

### v1.0 — 2026-03-28

Initial version.
