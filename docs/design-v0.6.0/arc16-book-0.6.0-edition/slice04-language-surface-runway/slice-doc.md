# arc16 slice04 - Language Surface Runway

## Goal

Settle and land the remaining 0.6.0 language-surface work that dogfooding
proved the book must not paper over: top-of-module exports, grouped local
bindings, and flatter ordered validation branches.

slice02 exposed these as realistic readability and API-shape defects. slice03
closed the CLI/scaffold/package runway. This slice now turns the remaining
language-surface decisions into either shipped 0.6.0 behavior with tests and
guidance, or explicit deferrals with re-entry conditions that the book can
respect honestly.

## Scope

In scope:

- `D-2608-XPRT`: settle and implement the 0.6.0 export ownership story.
  Target shape: module-level export declarations appear before implementation
  bodies, for example `(exports collect-valid-records ShapeOk ShapeErr)`.
  `mod.lykn` remains the package-entrypoint/barrel layer unless the slice
  deliberately chooses and documents another model.
- `D-2608-LBND`: settle and implement a grouped local binding surface. Target
  shape: one `(bind ...)` form may contain several sequential local bindings,
  for example:

  ```lykn
  (bind
    email (normalize-email record:email)
    role (normalize-role record:role)
    tags (normalize-tags (?? record:tags #a())))
  ```

  The slice must define whether typed pairs are supported in the grouped form
  and how duplicate names, destructuring, shadowing, and earlier-binding
  visibility behave.
- `D-2608-COND`: settle and implement a flatter ordered branch surface for
  validation/parsing code. Target shape: `cond` with ordered predicate/result
  clauses and an explicit `:else` branch in expression position, for example:

  ```lykn
  (cond
    ((not (string-present? id)) (ShapeErr (validation-error "id" "missing-id")))
    ((not (valid-email? email)) (ShapeErr (validation-error "email" "invalid-email")))
    (:else (ShapeOk record)))
  ```

- Compatibility policy for existing inline exports. The slice must decide
  whether `(export (func ...))` / `(export (bind ...))` remain accepted,
  receive a lint/deprecation route, or become compile errors. The decision must
  be reflected in tests and guide/SKILL text.
- Compiler/classifier/emitter/resolver/linter work needed to make the selected
  shapes real.
- Focused updates to `assets/ai/SKILL.md` and relevant guides so generated
  examples no longer normalize rejected shapes.
- Regression fixtures that prove the new syntax and the migration/diagnostic
  story.

Out of scope:

- Book repo or writers-guide prose.
- Broad chapter rewrites or dogfood project generation.
- A full package-metadata/source-ownership redesign beyond the `D-2608-XPRT`
  `mod.lykn` ownership question.
- `D-2607-R4NW` book fence reachability.
- 0.7.0-only comment retention, typed-classification hardening, or unrelated
  language cleanup.

If CC's opening read proves the three language surfaces are too large for one
context with recovery headroom, stop before compiler changes and propose a
tracked split. Do not partially land one surface while leaving the others as
silent drops.

## Grounding

Known source seams from CDC's opening read:

- `assets/ai/SKILL.md` currently teaches inline named exports as the normal
  module surface.
- `docs/guides/02-api-design.md`, `docs/guides/06-functions-closures.md`, and
  other guide examples contain inline export wrappers that may need migration.
- `crates/lykn-lang/src/classifier/forms.rs` owns the surface dispatcher,
  `export` classification, `bind` arity, and no-else expression-position
  diagnostics.
- `crates/lykn-lang/src/emitter/forms.rs` owns export wrapping, bind emission,
  expression-position `if` lowering, and statement/expression branch lowering.
- `crates/lykn-lang/src/resolver.rs` owns lexical binding visibility and
  shadowing diagnostics that grouped bindings must preserve.
- `crates/lykn-cli/src/lint/` owns guide-facing lint/diagnostic policy if
  inline exports are deprecated rather than rejected.
- `test/forms/export_test.lykn`, `test/forms/export.test.js`,
  `test/surface/bind_test.lykn`, and conditional/match fixtures are starting
  points for behavior tests.

## Expected Behavior

At close, the accepted 0.6.0 surface should be demonstrable with small Lykn
fixtures:

```lykn
(exports greet VERSION)

(func greet
  :args (:string name)
  :returns :string
  :body (template "Hello, " name))

(bind VERSION "0.6.0")
```

```lykn
(func normalize
  :args (:any record)
  :returns :object
  :body
  (bind
    id (normalize-token record:id)
    email (normalize-email record:email)
    tags (normalize-tags (?? record:tags #a())))
  (obj :id id :email email :tags tags))
```

```lykn
(func validate
  :args (:any record)
  :returns :any
  :body
  (cond
    ((not (string-present? record:id)) (ShapeErr "missing-id"))
    ((not (valid-email? record:email)) (ShapeErr "invalid-email"))
    (:else (ShapeOk record))))
```

If the final syntax differs from these target shapes, the closing report must
state why and show the shipped shape. The book must not receive examples that
depend on syntax the compiler does not accept.

## Verification

Minimum implementation gates:

- `cargo fmt --check`
- `cargo test -p lykn-lang`
- `cargo test -p lykn-cli` if lint, CLI, or fixture runner behavior changes
- targeted Lykn/JS form tests for exports, grouped bindings, and `cond`
- compile/check/run probes for positive fixtures and expected diagnostics

Minimum docs/planning gates:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

## Exit Criteria

- The ledger rows all reach a final status with evidence.
- `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` each have an accepted 0.6.0
  disposition: implemented, explicitly deferred, or split into a new named
  slice before implementation starts.
- Any implemented syntax has classifier/emitter/resolver coverage and at least
  one CLI-level proof through `./bin/lykn check` / `compile` / `run` as
  appropriate.
- Existing guidance no longer teaches rejected inline exports, repeated binds,
  or nested `?` validation ladders as the durable 0.6.0 idiom.
- The closing report states whether book-facing slices can proceed, or names
  the next implementation slice and its blocker.
