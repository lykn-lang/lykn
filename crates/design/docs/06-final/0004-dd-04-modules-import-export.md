---
number: 4
title: "DD-04: Modules — import / export"
author: "dispatching on"
component: All
tags: [change-me]
created: 2026-03-24
updated: 2026-03-26
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# DD-04: Modules — import / export

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

One `import` form and one `export` form handle all module cases by dispatching on argument shape. Module path comes first in imports (like "from this module, get these things"). `alias` is used for renaming. Namespace imports (`import *`) and re-export-all (`export *`) are banned for maintainability. Dynamic import uses a separate `dynamic-import` form.

## Decisions

### Unified `import` form

**Decision**: A single `import` form handles all static import variants. The first argument is always the module path string. Subsequent arguments are bindings: a bare atom for default import, a list for named imports. Inside the named import list, atoms are plain imports and `(alias original local)` triples are renames.

**Syntax**:

```lisp
;; named imports
(import "node:fs" (read-file write-file))

;; default import
(import "express" express)

;; side-effect only
(import "module")

;; all renamed
(import "node:fs" ((alias read-file rf) (alias write-file wf)))

;; mixed plain and renamed
(import "node:fs" (read-file (alias write-file wf)))

;; combined default + named with rename
(import "express" express (read-file (alias write-file wf)))
```

```javascript
// named imports
import { readFile, writeFile } from "node:fs";

// default import
import express from "express";

// side-effect only
import "module";

// all renamed
import { readFile as rf, writeFile as wf } from "node:fs";

// mixed plain and renamed
import { readFile, writeFile as wf } from "node:fs";

// combined default + named with rename
import express, { readFile, writeFile as wf } from "express";
```

**ESTree nodes**: `ImportDeclaration`, `ImportSpecifier`, `ImportDefaultSpecifier`

**Rationale**: Module path first reads naturally — "from this source, import these bindings." Dispatching on argument shape (string-only = side-effect, atom = default, list = named) is unambiguous. `alias` as an explicit sub-form avoids the ambiguity of positional pairs. One form instead of four eliminates proliferation.

### Namespace imports banned

**Decision**: `import * as name` is not supported. No `ImportNamespaceSpecifier` will be emitted.

**Rationale**: Namespace imports (`import *`) are a maintainability nightmare — you can't tell what's being used, tree-shaking becomes harder, and refactoring is error-prone. Named imports are always preferable. Lykn enforces this as an opinionated design choice.

### Unified `export` form

**Decision**: A single `export` form handles all export variants by dispatching on argument shape.

**Syntax**:

```lisp
;; export a declaration (wrapper, like async)
(export (const x 42))
(export (function handler ()
  (return 1)))

;; export default
(export default my-value)
(export default (=> (x) (* x 2)))
(export default (function ()
  (return 1)))

;; export existing bindings
(export (names a b))
(export (names a (alias original renamed)))

;; re-export named from another module
(export "module" (names a b))
(export "module" (names a (alias original renamed)))
```

```javascript
// export a declaration
export const x = 42;
export function handler() {
  return 1;
}

// export default
export default myValue;
export default (x) => x * 2;
export default function() {
  return 1;
}

// export existing bindings
export { a, b };
export { a, original as renamed };

// re-export named from another module
export { a, b } from "module";
export { a, original as renamed } from "module";
```

**ESTree nodes**: `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportSpecifier`

**Rationale**: Same dispatch-on-shape principle as `import`. The compiler distinguishes variants by what follows `export`: `default` atom → default export, a declaration form (`const`, `function`, etc.) → export declaration, `(names ...)` → export existing bindings, string + `(names ...)` → re-export. Wrapper pattern is consistent with `async` (DD-03). `names` disambiguates "export these bindings" from "export this declaration form."

### Re-export-all banned

**Decision**: `export * from "module"` is not supported. No `ExportAllDeclaration` will be emitted.

**Rationale**: Same maintainability argument as namespace imports. Barrel files with `export *` obscure what's actually being exported. Re-export explicitly with `(export "module" (names a b))`.

### `alias` for renaming

**Decision**: `(alias original local)` is the rename syntax used in both import and export specifier lists.

**Syntax**:

```lisp
;; in imports
(import "mod" ((alias original local-name)))

;; in exports
(export (names (alias internal-name external-name)))
```

```javascript
// in imports
import { original as localName } from "mod";

// in exports
export { internalName as externalName };
```

**ESTree nodes**: `ImportSpecifier` (with differing `imported` and `local`), `ExportSpecifier` (with differing `local` and `exported`)

**Rationale**: `alias` is explicit and unambiguous. No confusion between a list of names and a rename pair. Mirrors the concept clearly — "this name is an alias for that name." Both sides are atoms, so both get camelCase conversion per DD-01.

### `dynamic-import` for expression-level import

**Decision**: `(dynamic-import expr)` emits `ImportExpression`. Separate form from `import` to avoid overloading the declaration form with expression semantics.

**Syntax**:

```lisp
;; basic dynamic import
(const mod (await (dynamic-import "./module.js")))

;; computed module path
(const mod (await (dynamic-import (+ "./modules/" name ".js"))))

;; without await (returns a promise)
(const promise (dynamic-import "./module.js"))
```

```javascript
// basic dynamic import
const mod = await import("./module.js");

// computed module path
const mod = await import("./modules/" + name + ".js");

// without await
const promise = import("./module.js");
```

**ESTree nodes**: `ImportExpression`

**Rationale**: `import` as a declaration and `import()` as an expression are fundamentally different in JS — different ESTree nodes, different semantics, different positions. Keeping them as separate forms (`import` vs `dynamic-import`) avoids context-dependent behavior. `dynamic-import` is verbose but rarely used, and the name is descriptive.

### camelCase in module contexts

**Decision**: Atoms in import/export specifier lists get camelCase conversion per DD-01. Module path strings are never converted (strings are never converted — DD-01 rule).

**Syntax**:

```lisp
(import "node:fs" (read-file write-file))
;; read-file → readFile, write-file → writeFile
;; "node:fs" → untouched
```

```javascript
import { readFile, writeFile } from "node:fs";
```

**ESTree nodes**: `Identifier` (the `name` field reflects camelCase conversion)

**Rationale**: Falls out naturally from DD-01: camelCase applies to atoms, strings are pass-through. No new rules needed.

## Rejected Alternatives

### Four separate import forms

**What**: `import`, `import-default`, `import-all`, `import-from` as distinct forms.

**Why rejected**: Form proliferation. One form dispatching on argument shape handles all cases cleanly.

### Four separate export forms

**What**: `export`, `export-default`, `export-all`, `export-from` as distinct forms.

**Why rejected**: Same — one `export` form with dispatch handles everything.

### `as` keyword for renaming

**What**: `(import "mod" ((read-file as rf)))` mirroring JS syntax.

**Why rejected**: `as` as a keyword atom inside a list is workable but less explicit than `alias` as a sub-form head. `alias` is unambiguous — it's always the first element of a triple. `as` floating in the middle of a triple is harder to parse visually.

### Positional pairs for renaming

**What**: `(import "mod" ((read-file rf)))` where a two-element list means rename.

**Why rejected**: Ambiguous. `(import "mod" (a b))` could mean "import named `a` and `b`" or "import `a` as `b`". The nesting level distinguishes them but it's subtle and error-prone.

### Module path last (JS order)

**What**: `(import (read-file write-file) "node:fs")` with the module path as the last argument.

**Why rejected**: Module-first reads more naturally — "from this source, get these things." Also consistent with how re-exports work: `(export "module" (names ...))` parallels `(import "module" (...))`.

### Overloading `import` for dynamic import

**What**: `(import "./module.js")` used as both side-effect import (declaration) and dynamic import (expression) depending on context.

**Why rejected**: Context-dependent behavior — a form meaning different things based on where it appears. `(import "module")` at top level is a side-effect import declaration; as a value it would be a dynamic import expression. Explicit separation with `dynamic-import` is clearer and consistent with lykn's preference for unambiguous forms.

### Namespace import (`import *`)

**What**: `(import "mod" (* as name))` producing `ImportNamespaceSpecifier`.

**Why rejected**: Namespace imports harm maintainability — unclear what's used, defeats tree-shaking, complicates refactoring. Named imports are always preferable. Opinionated ban.

### Re-export all (`export *`)

**What**: `(export "module")` or `(export * "module")` producing `ExportAllDeclaration`.

**Why rejected**: Same maintainability argument as namespace imports. Barrel files with `export *` obscure the public API. Explicit re-exports with `(export "module" (names ...))` are always clearer.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| `import` with no args | Compile-time error | `(import)` → error |
| `import` with non-string first arg | Compile-time error | `(import foo bar)` → error |
| `alias` with wrong arity | Compile-time error | `(alias a)` or `(alias a b c)` → error |
| `export default` with no value | Compile-time error | `(export default)` → error |
| `export` with bare atom (not `default`) | Compile-time error | `(export foo)` → error, use `(export (names foo))` |
| `names` with empty list | Compile-time error | `(export (names))` → error |
| Hyphenated import names | camelCase applied | `(import "mod" (get-data))` → `import { getData } from "mod"` |
| Hyphenated alias local name | camelCase applied | `(alias foo my-name)` → `foo as myName` |

## Dependencies

- **Depends on**: DD-01 (camelCase conversion for identifiers, strings untouched), DD-02 (function declarations interact with `export`)
- **Affects**: DD-07 (class exports use the same `export` wrapper), DD-09 (modules are essential for v0.1.0 scope)

## Open Questions

None.
