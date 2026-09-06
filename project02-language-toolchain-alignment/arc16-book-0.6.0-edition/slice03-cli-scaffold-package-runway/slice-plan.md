# arc16 slice03 - CLI Scaffold Package Runway

## Goal

Make the fresh-project runway reliable enough that the book can later teach
normal Lykn project workflows without documenting around known toolchain holes.

slice02 proved that a scratch Lykn utility library can be made to work, but only
after manual repair: add a local binary shim, abandon scaffolded Lykn tests,
flatten nested source files, and run built JavaScript instead of the source
entrypoint. This slice turns that friction into implementation work.

## Scope

In scope:

- `D-2608-BINW`: make a fresh project created by `lykn new` usable with the
  project-local `./bin/lykn` command shape, or explicitly change the scaffold
  and guides to a different reproducible command shape.
- `D-2608-TDSL`: make scaffolded Lykn tests expand and run through the testing
  macro package in a fresh project.
- `D-2608-BREC`: make `lykn build` include nested package source directories,
  preserving relative output layout, or replace the silent skip with a clear
  diagnostic and a documented flat-package rule.
- `D-2608-RIMP`: make `lykn run` on a source file with relative imports resolve
  those imports from the source file or package context, or replace the implied
  source-run workflow with an enforced built-entrypoint workflow.
- The 0.6.0 floor for `D-2608-SOWN`: preserve user freedom to keep arbitrary
  non-Lykn files in source trees while making the Lykn-owned generated/config
  boundary explicit in scaffold, build/dist behavior, and docs touched here.
- Focused guide/SKILL updates only where behavior or command truth changes.
- Automated regression coverage plus one fresh scratch-project acceptance demo.

Out of scope:

- `D-2608-XPRT` top-of-module exports.
- `D-2608-LBND` grouped local binding syntax.
- `D-2608-COND` flatter validation branching.
- Book repo or writers-guide prose.
- A full redesign of package metadata ownership. If the current package
  manifest model stays for 0.6.0, say that honestly and route the stronger
  redesign later.
- Publishing the dogfood scratch project or committing scratch project files.

## Grounding

Known source seams from CDC's opening read:

- `crates/lykn-cli/src/main.rs` owns `cmd_new`, scaffold templates, `cmd_run`,
  test compilation, lint path behavior, and command help.
- `crates/lykn-cli/src/dist.rs` owns `build_project`, `compile_lykn_sources`,
  JS copying, dist staging, and package metadata generation.
- `crates/lykn-cli/src/config.rs` owns `project.json` and package config
  parsing/merging.
- `crates/lykn-lang/src/expander/pass0.rs` owns macro module resolution,
  `lykn.macroEntry`, fallback files, and JSR/local import handling.
- `packages/testing/deno.json` and `packages/testing/mod.lykn` define the
  testing macro package surface that fresh scaffolded tests try to consume.

## Expected Behavior

At close, a fresh project should support this shape without manual surgery:

```text
lykn new runway-fixture --path /private/tmp/<scratch>
cd /private/tmp/<scratch>/runway-fixture
./bin/lykn --version
./bin/lykn build
./bin/lykn test
./bin/lykn lint packages/runway-fixture test
```

After adding a small nested helper module and a source entrypoint that imports
it, the project should also support:

```text
./bin/lykn build
test -f target/lykn/build/runway-fixture/<nested-helper>.js
./bin/lykn run packages/runway-fixture/<source-entrypoint>.lykn
./bin/lykn run target/lykn/build/runway-fixture/<built-entrypoint>.js
```

If CC finds that one of these expected behaviors should not be shipped in
0.6.0, the slice must replace it with an explicit diagnostic, guide update, and
re-entry route. Silent skip or accidental success is not an acceptable close.

## Verification

Minimum implementation gates:

- `cargo fmt --check`
- `cargo test -p lykn-cli`
- `cargo test -p lykn-lang` if macro resolution or language behavior changes
- targeted Deno/Lykn test commands for touched testing DSL or integration
  surfaces
- fresh scratch-project acceptance demo covering the expected behavior above

Minimum docs/planning gates:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

## Exit Criteria

- The ledger rows all reach a final status with evidence.
- Each of `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and the
  slice's `D-2608-SOWN` floor is either implemented and regression-tested, or
  explicitly deferred with a reason and re-entry condition.
- A fresh scratch project can run the accepted project-runway workflow without
  the manual repairs slice02 needed.
- Any guide/SKILL command truth affected by the implementation is updated.
- The closing report recommends the next arc16 slice: another dogfood iteration,
  the language-surface implementation slice, or a book-facing slice if and only
  if implementation findings are closed or deferred.
