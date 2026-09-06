# Proposed Additions to SKILL.md and Guides

These additions address discoverability gaps encountered during the
mycelium bootstrap. Each includes the chain of events that led to the
problem, the proposed fix, and good/bad examples.

---

## 1. SKILL.md — Add "Publishing" to the Document Selection Guide

### Chain of events

The Document Selection Guide table in SKILL.md covers writing, learning,
reviewing, testing, etc. but has no entry for publishing. During the
mycelium bootstrap, I followed the "Writing New lykn Code" workflow
which ends at `lykn compile` and never mentions `lykn build --dist` or
`lykn publish`. This led to hand-rolling a manual compilation and
staging pipeline instead of using the built-in tooling.

### Proposed addition

Add this row to the Document Selection Guide table:

```markdown
| **Publishing a package** | `docs/guides/15-lykn-cli.md` (ID-04d, ID-04e), `docs/guides/10-project-structure.md` |
```

---

## 2. SKILL.md — Add "Publishing a Package" Workflow

### Chain of events

The Workflows section has three workflows: "Writing New lykn Code",
"Converting JS to lykn", and "Code Review / Quality Audit". None
covers publishing. I followed the "Writing New" workflow, which ends
at step 6 (`lykn check`/`lykn compile`) and step 7 (self-review).
There was no next step pointing to the publish pipeline.

### Proposed addition

Add after the "Code Review / Quality Audit" workflow:

```markdown
### Publishing a Package

1. **Ensure `deno.json` has required fields**: `name`, `version`, `exports`, `license`, and `lykn.kind`
2. **Run `lykn build --dist`**: Compiles source, stages compiled output + generated `package.json`/`deno.json` into `dist/<pkg>/`
3. **Verify**: `lykn publish --jsr --dry-run` and `lykn publish --npm --dry-run`
4. **Publish**: `lykn publish --jsr` then `lykn publish --npm`
5. **Do not** hand-write `package.json` or `jsr.json` — `lykn build --dist` generates them from `deno.json`
6. **Do not** call `npm publish` or `deno publish` directly — `lykn publish` wraps both, runs `lykn build --dist` automatically, and handles registry-specific flags. Using raw `npm`/`deno` commands bypasses the lykn pipeline and violates the no-Node boundary (`14-no-node-boundary.md`)
```

---

## 3. Guide `10-project-structure.md` — Add explicit guidance against `src/` subdirectories

### Chain of events

The dev instructions doc for mycelium specified a `src/` subdirectory
for source files — a convention borrowed from Rust, Node.js, and many
other ecosystems. I followed it without cross-checking against guide
10, which shows files at the package root but doesn't explicitly say
"do not use `src/`" or explain why.

The consequence: `lykn build --dist` only stages `.js` files from the
package root. Files in `src/` were silently skipped, producing a dist
with metadata but no code. The error was invisible — the dist looked
populated but was missing the actual modules.

### Proposed addition

Add a new entry after ID-05 (One Module, One Purpose):

```markdown
## ID-05a: Source Files at the Package Root — No `src/` Subdirectory

**Strength**: MUST

**Summary**: Place `.lykn` source files directly in the package
directory, not in a `src/` subdirectory. `lykn build --dist` stages
files from the package root — files in subdirectories other than
feature directories are silently skipped.

‎```lykn
;; Good — source at package root
packages/
    mycl-html/
        deno.json
        mod.lykn           ;; entry point
        escape.lykn        ;; helper module
        render.lykn        ;; core logic
        void-elements.lykn ;; data module
        tests/
            render_test.lykn

;; Bad — source in src/ subdirectory
packages/
    mycl-html/
        deno.json
        src/               ;; lykn build --dist will NOT stage these
            mod.lykn
            escape.lykn
            render.lykn
            void-elements.lykn
        tests/
            render_test.lykn
‎```

**Why it matters**: `lykn build --dist` generates `dist/<pkg>/` by
copying `.js` files from the package root. A `src/` subdirectory
causes a silent failure — the dist is created with metadata files
(`deno.json`, `package.json`, `README.md`) but no compiled modules.
Publishing this dist produces a package that installs but has no
code.

**Feature directories are fine**: Subdirectories that represent
feature modules (e.g., `auth/`, `users/`, `shared/`) work correctly
because their contents are part of the module graph and `lykn build
--dist` follows imports. The issue is specifically with a top-level
`src/` wrapper that adds a layer between the package root and the
source files.

**Rationale**: This matches the Deno convention (`mod.ts` at package
root, not `src/mod.ts`) and aligns with how `lykn build --dist`
stages output. Projects that use `src/` will need to maintain a
manual staging pipeline for publishing.
```

---

## 4. Guide `15-lykn-cli.md` — Add staging behavior note to `lykn build --dist`

### Chain of events

The `lykn build --dist` documentation (ID-04d) describes what gets
staged by `lykn.kind` but doesn't mention that staging operates on
the package root directory. I assumed it would recursively find and
compile all `.lykn` files regardless of location.

### Proposed addition

Add after the kind table in ID-04d:

```markdown
**Staging scope**: For all package kinds, `lykn build --dist` stages
files from the **package root directory** (the directory containing
`deno.json`). Source files in subdirectories like `src/` are not
staged. Place all source `.lykn` files at the package root.

‎```
;; Good — lykn build --dist finds and stages these
packages/my-lib/
    deno.json
    mod.lykn       → dist/my-lib/mod.js  ✓
    helpers.lykn   → dist/my-lib/helpers.js  ✓

;; Bad — lykn build --dist silently skips these
packages/my-lib/
    deno.json
    src/
        mod.lykn   → (not staged)  ✗
        helpers.lykn → (not staged)  ✗
‎```
```

---

## 5. Guide `10-project-structure.md` — Add publishing files to reference layout

### Chain of events

The reference directory structure (ID-03) does not mention
`package.json` or `jsr.json`. I assumed these needed to be hand-
written because they weren't shown. In fact, `lykn build --dist`
generates them — they are build artifacts in `dist/`, not source
files.

### Proposed addition

Update the reference directory structure (ID-03) to show the
`dist/` output and annotate which files are generated:

```markdown
my-project/
├── project.json             ;; workspace root (lykn CLI reads this)
├── packages/
│   └── my-project/
│       ├── deno.json        ;; package config — MUST include: name, version,
│       │                    ;;   exports, license, lykn.kind
│       ├── mod.lykn         ;; entry point
│       └── helpers.lykn     ;; other modules
├── dist/                    ;; generated by lykn build --dist
│   ├── my-project/
│   │   ├── mod.js           ;; compiled from mod.lykn
│   │   ├── mod.d.ts         ;; generated type declarations
│   │   ├── helpers.js       ;; compiled from helpers.lykn
│   │   ├── helpers.d.ts     ;; generated type declarations
│   │   ├── deno.json        ;; generated — DO NOT hand-write
│   │   ├── package.json     ;; generated — DO NOT hand-write
│   │   ├── README.md        ;; copied from package root
│   │   └── LICENSE          ;; copied from repo root
│   └── project.json         ;; generated workspace config
```

Add a note:

```markdown
**Do not hand-write `package.json` or `jsr.json`** in the source
package directory. These are generated by `lykn build --dist` from
the fields in `deno.json`. Hand-written versions will be overwritten
by the build step and may diverge from the canonical config.

‎```
;; Good — let lykn build --dist generate publish configs
packages/my-lib/
    deno.json        ;; name, version, exports, license, lykn.kind
    mod.lykn

;; Bad — hand-written publish configs in source
packages/my-lib/
    deno.json
    package.json     ;; will be overwritten by lykn build --dist
    jsr.json         ;; not needed — deno.json is the source of truth
    mod.lykn
‎```
```

---

## 6. Guide `00-lykn-surface-forms.md` — Clarify `if` vs `?` in expression position

### Chain of events

I used `(bind x (if cond a b))` expecting `if` to work as an
expression (as it does in Lisp). It compiled to `const x = if (cond)
a; else b;` — a syntax error because JS `if` is a statement. The
surface forms reference lists `if` under "Control Flow (kernel forms)"
and `?` under expressions, but doesn't explicitly warn that `if`
cannot appear in expression/binding position.

### Proposed addition

Add a note under the `if` / `?` section in Control Flow:

```markdown
**`if` is a statement, `?` is an expression.** Use `?` when the
result is assigned to a binding or used as a return value. Use `if`
for side effects and guard clauses.

‎```lykn
;; Good — ? for conditional bindings
(bind label (? (> count 0) "items" "empty"))

;; Bad — if in expression position produces invalid JS
(bind label (if (> count 0) "items" "empty"))
;; compiles to: const label = if (count > 0) "items"; else "empty";
;; (syntax error)

;; Good — if for guard clauses (statement position)
(if (not valid) (throw (new Error "invalid")))

;; Good — if for conditional side effects
(if debug (console:log "trace"))
‎```
```

---

## 7. Guide `09-anti-patterns.md` — Add `?` suffix and `if`-as-expression entries

### Chain of events

Two lykn-specific anti-patterns were encountered that aren't in the
current catalog:

(a) Using `?` suffix in function names produces invalid JS identifiers
(`voidElement?` is not valid JS).

(b) Using `if` in expression position (binding initializer or return
value) produces invalid JS.

### Proposed additions

```markdown
## ID-47: Using `?` Suffix in Function Names

**Strength**: MUST-AVOID

**Summary**: The `?` character is not valid in JavaScript identifiers.
Function names with `?` compile to invalid JS.

‎```lykn
;; Bad — ? is not valid in JS identifiers
(func valid? :args (:string s) :returns :boolean
  :body (> s:length 0))
;; Compiles to: function valid?(s) { ... }  — syntax error

;; Good — use is- prefix
(func is-valid :args (:string s) :returns :boolean
  :body (> s:length 0))
;; Compiles to: function isValid(s) { ... }
‎```

**Fix**: Use `is-` prefix: `is-valid`, `is-empty`, `is-void-element`.
The `?` convention is documented in the naming guide but does not
compile to valid JS until the compiler maps `?` to a JS-safe suffix.

---

## ID-48: Using `if` in Binding/Expression Position

**Strength**: MUST-AVOID

**Summary**: `if` is a statement form. Using it where an expression
is required (binding initializer, function return) produces invalid JS.

‎```lykn
;; Bad — if is a statement, not an expression
(bind size (if (> n 0) "big" "small"))
;; Compiles to: const size = if (n > 0) "big"; else "small";

;; Good — use ? (ternary) for expressions
(bind size (? (> n 0) "big" "small"))
;; Compiles to: const size = n > 0 ? "big" : "small";

;; Good — if for guard clauses (statement position)
(if (not valid) (return "invalid"))
;; Compiles to: if (!valid) return "invalid";
‎```
```

---

## Summary

| # | Target | What to add |
|---|--------|-------------|
| 1 | SKILL.md, Document Selection Guide | "Publishing a package" row |
| 2 | SKILL.md, Workflows | "Publishing a Package" workflow |
| 3 | `10-project-structure.md` | ID-05a: no `src/` subdirectory (MUST) |
| 4 | `15-lykn-cli.md` | Staging scope note on `lykn build --dist` |
| 5 | `10-project-structure.md` | `dist/` output in reference layout; don't hand-write `package.json` |
| 6 | `00-lykn-surface-forms.md` | `if` vs `?` clarification with good/bad examples |
| 7 | `09-anti-patterns.md` | ID-47 (`?` suffix) and ID-48 (`if` as expression) |
