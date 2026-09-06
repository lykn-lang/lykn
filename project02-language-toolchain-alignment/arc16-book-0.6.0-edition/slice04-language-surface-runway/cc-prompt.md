# CC Prompt - arc16 slice04: language surface runway

You are CC in the implementation seat. CDC has opened arc16 slice04 to settle
the remaining implementation-first language surface before the Lykn Book starts
teaching final 0.6.0 examples.

## Branch and Repo

Work in:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x
```

Branch:

```text
release/0.6.x
```

Do not edit the sibling book repo or writers-guide repo in this slice. This is
language/compiler/guide work in the lang repo.

## Required Reading

Read these before editing:

1. `AGENTS.md`
2. `assets/ai/SKILL.md`
3. `docs/guides/00-lykn-surface-forms.md`
4. `docs/guides/01-core-idioms.md`
5. `docs/guides/02-api-design.md`
6. `docs/guides/06-functions-closures.md`
7. `docs/guides/09-anti-patterns.md`
8. `docs/guides/10-project-structure.md`
9. `docs/guides/15-lykn-cli.md`
10. Rust language/project guidelines before editing Rust
11. Deno-based JavaScript guidelines before editing JS or Deno-facing tests
12. `backlog/discoveries.md` rows `D-2608-XPRT`, `D-2608-LBND`, and
    `D-2608-COND`
13. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md`
14. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
15. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/closing-report.md`
16. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md`
17. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/cdc-verification.md`
18. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/slice-plan.md`
19. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/ledger.md`

Then inspect the likely implementation seams:

- `crates/lykn-lang/src/classifier/forms.rs`
- `crates/lykn-lang/src/emitter/forms.rs`
- `crates/lykn-lang/src/resolver.rs`
- `crates/lykn-lang/src/ast/surface.rs`
- `crates/lykn-cli/src/lint/`
- `test/forms/export_test.lykn`
- `test/forms/export.test.js`
- `test/surface/bind_test.lykn`
- conditional, `if`, and `match` fixtures under `test/`

## Implementation Assignment

Close the remaining language-surface cluster:

- `D-2608-XPRT`: implement a top-of-module export declaration surface, with a
  coherent relationship to `mod.lykn` package-entrypoint re-exports. Target
  spelling is `(exports name1 name2 ...)` unless your implementation read finds
  a better spelling that fits the existing grammar and docs more cleanly.
- `D-2608-LBND`: implement grouped local bindings. Target spelling extends
  `bind`:

  ```lykn
  (bind
    email (normalize-email record:email)
    role (normalize-role record:role)
    tags (normalize-tags (?? record:tags #a())))
  ```

  Decide and document whether grouped form supports typed pairs such as
  `:string email ...`, destructuring patterns, and sequential visibility.
- `D-2608-COND`: implement a flatter ordered branch surface. Target spelling is
  `cond` with ordered predicate/result clauses and `:else` for the default:

  ```lykn
  (cond
    ((not (string-present? id)) (ShapeErr "missing-id"))
    ((not (valid-email? email)) (ShapeErr "invalid-email"))
    (:else (ShapeOk record)))
  ```

  Expression-position `cond` must not emit invalid JavaScript. If no branch can
  provide a value and no `:else` is present, `lykn check` / `compile` should
  fail with a clear diagnostic, following the arc10 no-invalid-JS lesson.

Before implementing, explicitly confirm in your notes whether all three
surfaces fit this slice. If they do not, stop before compiler changes and
propose a split with named follow-up slices. Do not land a partial language
surface while leaving the other rows as informal "later" work.

## Required Design Decisions

Record the final choices in the closing report:

- Export declaration syntax, allowed location, duplicate/missing export
  diagnostics, emitted JS shape, and compatibility policy for existing inline
  `(export (func ...))` / `(export (bind ...))`.
- Whether `mod.lykn` remains a package API/barrel file, and how it differs from
  module-level export declarations.
- Grouped binding syntax, arity rules, typed pair support, destructuring
  support, sequential vs simultaneous evaluation, shadowing, and duplicate-name
  diagnostics.
- `cond` syntax, expression vs statement behavior, required/default else
  behavior, malformed-clause diagnostics, and relationship to `?`, `if`, and
  `match`.

## Required Automated Coverage

Add focused coverage close to the behavior:

- classifier/emitter tests for top-of-module exports;
- resolver or compile tests proving exported names must exist and duplicate
  declarations behave as designed;
- positive and negative grouped-bind tests, including lexical visibility;
- positive and negative `cond` tests, including expression-position missing
  `:else` diagnostics;
- CLI-level `./bin/lykn check` / `compile` / `run` probes where they catch
  integration issues unit tests cannot.

Prefer small fixtures whose expected output would fail if the new forms were
only parsed but not semantically honored.

## Required Guidance Updates

Update `assets/ai/SKILL.md` and affected guides so they teach the accepted
0.6.0 truth. In particular:

- stop normalizing inline export wrappers as the preferred module style if the
  new top-of-module declaration lands;
- stop teaching repeated sibling binds as the default for multi-local
  normalization when grouped bind lands;
- stop presenting deeply nested `?` validation ladders as the durable idiom if
  `cond` lands;
- preserve existing examples only where they are intentionally still supported,
  and say why if the old form remains for compatibility.

## Required Checks

Run the implementation gates relevant to the touched surfaces:

```sh
cargo fmt --check
cargo test -p lykn-lang
cargo test -p lykn-cli
./bin/lykn build
```

Run targeted form/fixture gates you add or touch, for example:

```sh
deno test --config project.json -A test/forms/export.test.js
./bin/lykn test test/forms/export_test.lykn
./bin/lykn check <new-positive-or-negative-fixture>
./bin/lykn compile <new-positive-or-negative-fixture>
./bin/lykn run <new-positive-fixture>
```

Always run the docs/planning bar:

```sh
git diff --check
make check-cited-paths
make test-docs
```

If a gate fails for a pre-existing or intentionally exposed reason, record the
exact command, exit status, and re-entry condition. Do not report a failed gate
as passed.

## Required Close

When done, write the standard slice close report in this slice directory. It
must include:

1. Source material read, with one-line roles.
2. Scope-fit decision: one slice completed, or split proposed before compiler
   changes.
3. Implementation summary grouped by discovery ID.
4. Final syntax/semantics decisions for XPRT, LBND, and COND.
5. Tests added or changed.
6. CLI/form verification transcript.
7. Row-by-row ledger walk for F-1 through F-12.
8. Bubble-up to arc16:
   - whether book-facing slices can now proceed;
   - whether any language surface remains open or deferred;
   - whether follow-up dogfood is recommended before book prose.

Commit the implementation and close artifacts together unless Duncan directs a
split. Use the shared trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
