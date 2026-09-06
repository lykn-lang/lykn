# Slice 05: position-sweep + walker-completion — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered — the discover-by-leak loop is ended by derivation.** Both
walkers gained refinement #2's positions (`catch` bindings, `import` locals,
`label` names) **and** the derived-exhaustiveness sweep, which — inverting the
discovery direction — enumerated the codegen's identifier-emission sites and
found a whole *class* leak-discovery had missed: **name slots** (`function if`,
`function* if`, `class if`, `type` constructor names/fields). All folded
(mechanical). The coverage of the derived inventory is now a standing test.
`make check` green.

## Per-row walk (5 rows)

**F-1 — catch/import-local (D1+D2) + label (D2-only) — MET.** Both backends.
`catch` binding (`(catch NAME …)`), `import` locals (default name, named
specifiers, `(alias original local)` locals), `label` name (own namespace —
`BindingKind::Label.shadows_values() == false`, so the resolution slices extend
the *value* env for every kind except `Label`; D2 validates all). slice04's
evidence repros error on both: `(try (f) (catch if …))`, `(import "m" (if))`,
`(label if …)`.

**F-2 — the sweep — MET (inventory below).** Derived from the codegen dispatch,
with citations. Diff vs walker coverage: **the leak-discovery walker missed the
entire name-slot class** — folded (all mechanical: identifiers in a name slot of
a form the walker already handled).

**F-3 — standing coverage test — MET.** `binding-walker-parity.test.js` is now
the derived-coverage test: one fixture per derived binder position asserts both
backends reject a reserved name there (walker miss → invalid JS → both diverge →
fail). **Seeded-gap demo:** removing the JS `catch` arm failed the "catch
binding" fixture (backends disagree); restored, green.

**F-4 — matrix columns — MET.** Probe gained `catch`/`import`/`label` (8 → 11
positions). Original 8 columns **byte-identical** to the slice04 baseline (no
scope leak); new columns' reserved rows reject cleanly on both. (Name-slot folds
are pinned by the coverage test rather than matrix columns — the matrix's
reference dimension is degenerate for a form's own name.)

**F-5 — green bar — MET.** `make check` ✓; three-way reserved-word parity green;
Rust walker unit tests 23/0.

## F-2 — the derived binder-emission inventory (the exhaustiveness evidence)

**Method:** enumerate every place each backend's codegen writes an identifier
into a JS *binding / declaration / label* grammar slot; map each to the surface
form that produces it; diff against `bindings_introduced`/`bindingsIntroduced`.

**Rust — `crates/lykn-lang/src/codegen/emit.rs` dispatch (`match head`, :214):**

| Kernel emission site | binder slot | surface form | walker |
|---|---|---|---|
| `emit_declaration` (:216) `const`/`let`/`var` | declarator id | `bind`, loop/`if-let`/`when-let`/`match` desugar | ✓ `bind`, `kernel:const/let/var` |
| `emit_function` (:221) | `function` **name** + params | `func` | ✓ **name (folded)** + params |
| `emit_function_star` (:222) | `function*` **name** + params | `genfunc` | ✓ **name (folded)** + params |
| `emit_arrow` (:219) / `emit_lambda` (:220) | params | `fn` / `lambda` | ✓ params |
| `emit_for_of/in/await_of` (:235–237) | loop binding | `for-of`/`-in`/`-await-of` | ✓ loop |
| `emit_try` catch (:951) | `catch (X)` | `try`/`catch` | ✓ **catch (new)** |
| `emit_label` (:898) | `X:` label | `label` | ✓ **label (new, D2-only)** |
| `emit_class` (:284) | `class` **name** + method params | `class` | ✓ **name (folded)** + method params |
| `emit_class_expr` (:285) | optional name (dropped when unused) | `class-expr` | n/a — name erased, no leak (verified) |
| `emit_import` (:1508) | default name + specifier locals + alias local | `import` | ✓ **import (new)** |
| `emit_export` (:1583) | re-export names (reference existing bindings) | `export` | ✓ via recursion into `(export (bind …))` |
| surface `type` → `function CtorName(field…)` | ctor **name** + fields | `type` | ✓ **type (folded)** |
| class field / method *names* | property names (reserved words legal) | — | **not a binder** (verified `class C { if = 0 }` parses) |

**JS — `packages/lang/compiler.js` ESTree `Identifier`-in-binder constructions:**
`VariableDeclarator.id`, `FunctionDeclaration.id`/`.params`,
`ArrowFunctionExpression.params`, `CatchClause.param`,
`ImportSpecifier/ImportDefaultSpecifier.local` (`buildImportSpecifier`, :8),
`LabeledStatement.label`, `ClassDeclaration.id`, `MethodDefinition.value.params`,
and (via `type`) a `FunctionDeclaration` per constructor. Same set as Rust.

**Coverage diff after this slice: EMPTY.** Every identifier-into-binder site maps
to a covered walker position; every non-binder identifier site (class-expr erased
name, field/method property names, export re-export references) is documented as
such with verification.

### Exhaustiveness judgment (the ledger asked)

**The binding-position list is now complete by construction, not accumulation.**
The codegen `match head` is a *closed* set of kernel forms; the sweep walked it
exhaustively and every identifier-emitting-into-a-binder form is covered. Two
rounds of leak-discovery found reference-side and pattern positions but
structurally could not find **name slots** (they don't involve a reference in a
body) — the derivation did, which is exactly why the method was changed. I found
**no** binder-emission site left uncovered. The coverage test now keeps the
walker honest against this inventory forever (a future binder-emitting grammar
form fails CI until a fixture + walker arm are added).

## Bubble-up to arc13

- **Hook-point notes for the resolution slices (rust, then js):** the walker's
  `bindings_introduced`/`bindingsIntroduced` yield **all** binder positions with
  a `kind`. The resolver extends the **value** env for every site where
  `kind.shadows_values()` is true, and **skips `Label`** (own namespace). The
  D2 name-slot set = every site (labels included). `as_form_head()`/`formHead()`
  (DD-61 §A6) land in those slices; the walker's per-form hook is what they
  consult to know what's bound before dispatch.
- **Exhaustiveness is the arc's A-4/A-5 footing:** the derived inventory + the
  coverage test mean the resolution slices can extend the env at a *complete*
  position set — no more "one more leak."
- **No refinement #3.** The sweep found only mechanical name-slot gaps (folded);
  nothing semantically novel. If a future grammar form binds a name, the
  coverage test flags it — the loop is closed by the test, not by vigilance.

## Discipline notes

- Resolution-independent: no scope/tags/dispatch changes — walker + D2 +
  probe/test extension only.
- The sweep *derived* the list from codegen (authority inversion), rather than
  accumulating from leaks — the operator's method change, executed.
- Closing report untracked; `docs/design-v0.6.0/**` is CDC's. Source only.

Handed back for CDC verification → the resolution slices (rust-resolution, then
js-resolution) implement D1 on this complete, test-pinned position set.
