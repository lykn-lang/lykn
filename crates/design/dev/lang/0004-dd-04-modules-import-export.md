# DD-04: Modules — import / export

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how ES module `import` and `export`
statements should work in lykn.

**Important**: Read DD-02 (function forms) first if available — export
interacts with function declarations.

## Design constraint

Duncan wants to model this after ECMAScript's module system (`import` /
`export`), not CommonJS `require()`. Lykn already sets `sourceType:
"module"` in its Program node.

## What ECMAScript defines

JS has many import/export variants:

```javascript
// --- Imports ---
import defaultExport from "module";
import { named1, named2 } from "module";
import { original as renamed } from "module";
import * as namespace from "module";
import "module";                              // side-effect only
import defaultExport, { named } from "module"; // combined

// --- Exports ---
export const x = 42;
export function handler() { ... }
export class Foo { ... }
export { a, b };
export { original as renamed };
export default expression;
export default function() { ... }
export * from "module";                       // re-export all
export { named } from "module";               // re-export named
export * as namespace from "module";          // re-export as namespace

// --- Dynamic import (expression, not declaration) ---
const mod = await import("./module.js");
```

## The gap analysis proposal

The research proposed **four separate import forms** and **four export
forms**:

```lisp
;; Named import
(import (read-file write-file) "node:fs")

;; Default import
(import-default express "express")

;; Namespace import
(import-all path "node:path")

;; Renamed import
(import ((read-file read)) "node:fs")

;; Named export
(export (const x 42))

;; Export default
(export-default (function () ...))

;; Re-export all
(export-all "./utils.js")

;; Re-export named
(export-from (foo bar) "./utils.js")
```

## Questions to discuss

1. **Form proliferation**: Four import forms and four export forms is
   a lot. Can we unify under a single `import` form that dispatches
   on the shape of its arguments? Consider:

   ```lisp
   ;; What if import's first arg determines the variant?
   (import express "express")              ;; default (single atom)
   (import (read-file write-file) "fs")    ;; named (list of atoms)
   (import (* as path) "path")             ;; namespace
   (import ((original renamed)) "mod")     ;; renamed (list of pairs)
   ```

   Is this ambiguous? What about combined default + named?

2. **Renaming syntax**: JS uses `as` — `import { foo as bar }`. The
   proposal uses a nested list `(foo bar)`. Alternatives:
   - `(foo as bar)` — mirrors JS but `as` is a keyword in the form
   - `(foo -> bar)` — visual arrow
   - `(foo bar)` — positional pair (proposal's choice)
   
   How does the compiler distinguish `(import (a b) "mod")` (named
   import of `a` and `b`) from `(import ((a b)) "mod")` (import `a`
   as `b`)? The nesting level matters.

3. **Side-effect imports**: `import "module"` has no bindings. How?
   `(import "module")`? But then a string as first arg means side-
   effect. Is that clear enough?

4. **Export wrapping a declaration**: `(export (const x 42))` wraps
   the declaration. This means `export` is a form that takes another
   form. Similar to how `async` wraps functions. Consistent?

5. **Export default**: `export default` can take an expression OR a
   declaration. `(export-default expr)` vs `(export default expr)`.
   Should `default` be a keyword inside the export form, or a separate
   form entirely?

6. **Re-exports**: `export * from "mod"` and `export { a } from "mod"`
   are re-exports. Do these need their own forms, or can they be
   special cases of `export`?

7. **Dynamic import**: `import("./mod.js")` is an expression, not a
   declaration. The proposal used `(dynamic-import "./mod.js")`. But
   in JS, it's literally calling `import` as a function. Could lykn
   just use `(import "./mod.js")` when import has a single string arg
   and no binding? Or does that conflict with side-effect imports?

8. **camelCase in module specifiers**: Import specifiers like
   `read-file` should become `readFile` in the compiled output.
   But the module path `"node:fs"` is a string and should NOT be
   converted. Confirm this is handled by only converting atoms?

## ESTree nodes involved

- `ImportDeclaration` — `specifiers` array + `source` (Literal string)
- `ImportSpecifier` — `imported` (Identifier) + `local` (Identifier)
- `ImportDefaultSpecifier` — `local` (Identifier)
- `ImportNamespaceSpecifier` — `local` (Identifier)
- `ExportNamedDeclaration` — `declaration` or `specifiers` + `source`
- `ExportDefaultDeclaration` — `declaration` (Expression or Declaration)
- `ExportAllDeclaration` — `source` + optional `exported`
- `ExportSpecifier` — `local` + `exported`
- `ImportExpression` — `source` (Expression) — for dynamic import()

## Goal

By the end of this discussion, decide:
- How many import forms (one unified vs several)
- How many export forms (one unified vs several)
- Renaming syntax
- Side-effect import syntax
- Dynamic import syntax
- Re-export syntax

When we're done, I'll ask you to write a decision doc using the
template in this project.
