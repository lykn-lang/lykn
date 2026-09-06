# arc16 slice04 - Language Surface Runway Closing Report

## 1. Source Material Read

| File | Role in this slice |
|------|--------------------|
| `AGENTS.md` | Release worktree rules, no sibling book edits, generated-output policy, and commit trailer requirements. |
| `assets/ai/SKILL.md` | Current Lykn authoring guidance and the surface forms the book/agents will imitate. |
| `docs/guides/00-lykn-surface-forms.md` | Surface syntax reference updated for `exports`, grouped `bind`, and `cond`. |
| `docs/guides/01-core-idioms.md` | Idiomatic binding, export, and control-flow guidance. |
| `docs/guides/02-api-design.md` | Public API and `mod.lykn` barrel guidance. |
| `docs/guides/03-error-handling.md` through `docs/guides/17-template-and-i18n.md`, including `docs/guides/12-deno/*.md` | Current guide surface checked for stale preferred inline-export examples and doc-test impact. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/arc-plan.md` | Arc status, implementation-first rule, and slice04 dependency on book-facing language chapters. |
| `docs/design-v0.6.0/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md` | Source rows for `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`. |
| `slice01-pre-book-decision-gate/closing-report.md` and `cdc-verification.md` | Decision-gate context and CDC interpretation. |
| `slice02-dogfood-implementation-runway/closing-report.md` and `cdc-verification.md` | Dogfood evidence that exposed the language-surface gaps. |
| `slice03-cli-scaffold-package-runway/closing-report.md` and `cdc-verification.md` | Prior implementation runway closure and remaining language-surface blocker. |
| `slice04-language-surface-runway/slice-doc.md`, `ledger.md`, and `cc-prompt.md` | Direct scope, acceptance criteria, and required verification. |
| Rust compiler files under `crates/lykn-lang/src/` and CLI compile path under `crates/lykn-cli/src/compile.rs` | Classifier, resolver, analysis, emitter, DTS, and check/compile integration seams. |
| JS compiler files under `packages/lang/` and form tests under `test/forms/` | JS/browser/test-pipeline parity for the same surface forms. |
| `/Users/oubiwann/.agents/skills/rust-guidelines/SKILL.md` plus focused Rust idiom/error-handling material | External Rust guidance used because this repo has no in-repo Rust AI guidance directory. |
| `/Users/oubiwann/.agents/skills/javascript-deno-guidelines/SKILL.md` | External Deno/JS guidance used because this repo has no in-repo JS AI guidance directory. |

## 2. Scope Fit Confirmation

`D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` fit this slice as one language-surface cluster. They share the same compiler seams: surface classification, lexical binding, position-aware emission, CLI validation, JS compiler parity, and SKILL/guide truth. No split was needed.

Work stayed in the Lykn repo. The sibling book and writers-guide repos were not edited.

## 3. Implementation Summary

| Finding | Disposition | Evidence |
|---------|-------------|----------|
| `D-2608-XPRT` | Implemented. New module-level `(exports name1 name2 ...)` emits named ESM exports for names defined in the current module. | Rust classifier/emitter/CLI tests; JS classifier test; fixture `test/surface/language-surface-runway_test.lykn`; guides/SKILL updated. |
| `D-2608-LBND` | Implemented. `bind` now supports grouped sequential name/value pairs, including typed pairs. | Rust binding/resolver/emitter/compile tests; JS expander/classifier tests; Lykn fixture runs. |
| `D-2608-COND` | Implemented. `cond` supports ordered predicate/result clauses and final `:else`; expression-position no-else cases reject in Rust check/compile. | Rust classifier/compile/emitter tests; JS Deno tests; Lykn fixture runs. |

Key changed areas:

- Rust: `ast/surface.rs`, `binding.rs`, `classifier/*`, `resolver.rs`, `expander/pass2.rs`, `analysis/*`, `emitter/forms.rs`, `emitter/dts.rs`, and CLI compile validation.
- JS: `packages/lang/surface-ast.js`, `classifier.js`, `binding.js`, and `expander.js`.
- Tests: Rust unit/compile tests, JS Deno form tests, and `test/surface/language-surface-runway_test.lykn`.
- Guidance: `assets/ai/SKILL.md` and guides 00, 01, 02, 03, 04, 05, 06, 07, 08, 10, 11, and 14.

## 4. Decisions

### Exports

Final syntax: `(exports name1 name2 ...)`.

Rules:

- `exports` is a top-level module declaration. Nested `exports` is rejected by Rust check/compile validation.
- Names must be atom names and not `_`.
- Duplicate names in one declaration or across declarations are rejected.
- Names must refer to top-level runtime bindings: `bind`, grouped `bind`, `func`, `genfunc`, class names, imported locals, and ADT constructor values. The ADT type name itself is not a runtime binding.
- Emitted JS shape is a named ESM list: `export {name1, name2};`, with normal Lykn-to-JS identifier conversion.
- Existing inline `(export (func ...))`, `(export (bind ...))`, and `(export (type ...))` remain accepted for 0.6.0 compatibility. They are not the preferred teaching style for new module-local exports.
- `mod.lykn` remains the package entrypoint/barrel layer for selective re-exports from sibling modules, for example `(export "./stats/mean.js" (names mean))`. `(exports ...)` exposes names defined in the current module; it does not replace `mod.lykn`.

### Grouped Bind

Final syntax:

```lykn
(bind
  email (get record :email)
  role (normalize-role (get record :role))
  label (role-label role))
```

Rules:

- Grouped `bind` extends the existing `bind` form.
- Untyped pairs are `name value`.
- Typed pairs are `:type name value`.
- Grouped bindings are sequential, not simultaneous. Each initializer sees earlier names from the same group; a pair does not see its own name.
- Untyped binding positions may use existing destructuring patterns.
- Typed grouped pairs require an atom name, matching the existing typed `bind` restriction.
- Duplicate names inside one group are compile errors.
- Shadowing of outer bindings follows the existing scope/lint behavior; this slice did not introduce a new shadowing policy.
- There is no body region inside grouped `bind`; it lowers to sibling `const` declarations.

### Cond

Final syntax:

```lykn
(cond
  ((= role "admin") "Administrator")
  ((= role "editor") "Editor")
  (:else "User"))
```

Rules:

- Clauses are two-item lists: predicate and result.
- Clauses are checked in source order.
- `:else` is the default branch, may appear at most once, and must be last.
- In expression/value position, Rust check/compile rejects `cond` without `:else` so no invalid JavaScript is emitted.
- In statement position, `cond` may omit `:else`; if no predicate matches, no branch runs and no value is produced.
- Use `?` for compact binary value choices, `if` for one-off statement branches, `cond` for ordered predicate chains, and `match` for structural or ADT dispatch.

## 5. Automated Coverage

| Behavior | Coverage |
|----------|----------|
| Export declaration classification/emission | Rust classifier/emitter tests and `compile_source_exports_declaration`; JS `exports: surface declaration lowers to named ESM export`. |
| Missing/duplicate/non-top-level exports | Rust compile test for missing and duplicate names; classifier validation test for nested `exports`. |
| Inline export compatibility | Existing Rust/JS export tests still pass; docs mark inline wrappers as compatibility syntax. |
| Grouped bind syntax and typing | Rust classifier tests for grouped and typed grouped forms; JS `language-surface-runway.test.js`. |
| Grouped bind lexical visibility | Rust resolver test and CLI compile test for earlier-name visibility; JS expander test checks sequential constants. |
| Cond expression success | Rust compile/emitter tests and JS Deno test. |
| Cond expression no-else failure | Rust compile/check test emits a `cond in expression position requires an :else clause` diagnostic; JS Deno path also rejects after lowering through the existing no-else `if` expression rule. |
| Statement-position cond | Rust classifier validation allows statement-position no-else; emitted JS uses a no-value IIFE path. |
| End-to-end Lykn surface | `test/surface/language-surface-runway_test.lykn` checks, compiles, runs, and passes through `lykn test`. |

## 6. Verification Transcript

| Command | Result |
|---------|--------|
| `cargo test -p lykn-lang --lib` | exit 0; 1115 unit tests passed after implementation. An earlier run failed one stale bind-arity expectation, then the test was updated and rerun green. |
| `cargo test -p lykn-cli --lib` | exit 0; 98 unit tests passed. |
| `make test-docs` | first run failed because a new grouped-bind guide example referenced `record` without defining it; fixed the example. Final run exit 0; 482 passed, 0 failed. |
| `cargo test -p lykn-lang` | exit 0; full lykn-lang unit, integration, and doc tests passed. |
| `cargo test -p lykn-cli` | exit 0; full lykn-cli lib/main/integration/doc tests passed. |
| `./bin/lykn check test/surface/language-surface-runway_test.lykn` | exit 0; 6 top-level expressions checked. |
| `./bin/lykn compile test/surface/language-surface-runway_test.lykn` | exit 0; emitted `export {roleLabel, normalizeRecord};` plus grouped `const` bindings and `cond` IIFEs. |
| `./bin/lykn test test/surface/language-surface-runway_test.lykn` | initially failed because JS compiler parity treated `(exports ...)` as a call; fixed JS classifier/expander parity. Final run exit 0; 2 tests passed. |
| `./bin/lykn run test/surface/language-surface-runway_test.lykn` | exit 0. |
| `deno test --config project.json -A test/forms/export.test.js test/forms/language-surface-runway.test.js` | exit 0; 12 passed, 0 failed. |
| `./bin/lykn build` | exit 0; rebuilt `@lykn/lang`, `@lykn/browser`, and `@lykn/testing`. |
| `deno fmt --check ...` | non-gate; exited 1 because existing JS files such as `packages/lang/expander.js` are not Deno-formatted wholesale and would produce large unrelated churn. No broad format rewrite was applied. |
| `cargo fmt --check` | exit 0. |
| `git diff --check` | exit 0. |
| `make check-cited-paths` | pre-commit run exited 2 because the new close report and fixture paths were correctly cited from tracked docs but not yet present in `HEAD`; after the implementation commit put those paths in git, the gate exited 0 across 618 scanned documents. |

## 7. Ledger Walk

| ID | Status | Evidence |
|----|--------|----------|
| F-1 | done | Section 1 lists the required repo guidance, every guide area, prior close artifacts, slice docs, and external Rust/Deno guidance used. |
| F-2 | done | Section 2 records the explicit one-slice scope-fit confirmation. |
| F-3 | done | Section 4 records the 0.6.0 inline export compatibility policy; existing export tests remain green. |
| F-4 | done | Section 5 lists export positive, missing, duplicate, and nested validation coverage; CLI fixture compiles to named ESM export. |
| F-5 | done | Section 4 distinguishes module-local `(exports ...)` from `mod.lykn` barrel re-exports; SKILL and guide updates teach the distinction. |
| F-6 | done | Section 4 records grouped-bind syntax, sequential semantics, typed/destructuring support, shadowing, duplicate names, and visibility. |
| F-7 | done | Rust resolver/compile/emitter tests and JS Deno tests cover grouped-bind behavior; fixture runs through `lykn test`. |
| F-8 | done | Section 4 records `cond` syntax, expression/statement behavior, `:else`, and relationship to `?`, `if`, and `match`. |
| F-9 | done | Rust compile/check rejects expression-position no-else `cond`; positive fixture checks/compiles/tests/runs. |
| F-10 | done | Statement-position no-else `cond` is allowed and covered in Rust validation/emission behavior. |
| F-11 | done | SKILL/guides updated away from preferred inline-export examples; `make test-docs` passed after fixing the self-contained grouped-bind example. |
| F-12 | done | Standard gates passed. `make check-cited-paths` required a post-commit rerun because it resolves citations against `HEAD`; the final rerun exited 0 after the new cited paths were tracked. |

## 8. Bubble-Up

slice04 closes the accepted 0.6.0 language-surface runway for `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`, pending CDC verification.

Book-facing language chapters may now teach:

- `(exports ...)` as the preferred module-local named export declaration.
- `mod.lykn` as the package/barrel re-export layer.
- grouped sequential `bind` for related normalization/validation locals.
- `cond` for ordered predicate/result branching, with `:else` required when a value is needed.

Known limitation: JS direct compiler parity now emits and tests these forms, but the strongest missing-name/non-top-level export diagnostics live in the Rust check/compile path. That is acceptable for the 0.6.0 CLI teaching path because `lykn check`/`compile` enforce those diagnostics; a future JS-only diagnostic parity pass could make browser/direct JS errors match exactly.
