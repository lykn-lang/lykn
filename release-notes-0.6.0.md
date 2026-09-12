# Lykn 0.6.0 Release Notes

Status: draft for the 0.6.0 release cut. Do not treat this file as publication
evidence until the release arc records registry publication, tags, and
post-publish verification.

## Highlights

Lykn 0.6.0 turns the early language/toolchain work into a release-ready surface:
the compiler boundary is stricter, package publishing is staged through Lykn's
own tooling, dependency workflows are documented and tested, and the 0.6 book
edition has been reconciled against the implementation.

## Language and compiler

- Tightened the kernel/surface split. Kernel-only forms, surface forms, and the
  `kernel:` escape route now have explicit compiler boundaries across the Rust
  and JavaScript implementations.
- Improved conditional and block diagnostics. `if` in value position now rejects
  a missing else branch before code generation, and `do`/conditional behavior is
  covered by current examples and tests.
- Reconciled JavaScript interop edge cases surfaced by the book refresh,
  including function-return parity and overlapping JavaScript function clauses.
- Preserved readable JavaScript output while moving more form handling through
  shared classifier/surface machinery.

## Toolchain and packaging

- Added the release-oriented dist/publish path. `lykn dist` stages packages
  under `target/lykn/dist/`, and `lykn publish` can publish JSR and npm artifacts
  from the generated package layout.
- Kept publish safety gates visible. `lykn publish` refuses uncommitted changes
  unless the operator explicitly passes `--allow-dirty`; dry-runs and release
  evidence must not bypass that gate silently.
- Updated the crates dry-run helper to use `cargo publish --dry-run` without
  injecting `--allow-dirty`.
- Consolidated the three Rust crates on the shared 0.6.0 workspace version:
  `lykn-lang`, `lykn-cli`, and `lykn`.
- Updated the JSR package manifests for `@lykn/browser`, `@lykn/lang`, and
  `@lykn/testing` to the 0.6.0 release version.

## Types, linting, and tests

- Added declaration generation from Lykn `:type` annotations, including
  single-file `.d.ts` emission and literal-type inference refinements.
- Added `lykn lint` for Lykn source, with shape/idiom rules and
  resolution-aware shadowing checks wired into the repository quality gate.
- Moved generated test output under `target/lykn/test/` so source trees are not
  polluted by compiled test artifacts.
- Reworked test topology so repository tests avoid double-running generated
  corpus files.
- Kept Deno compatibility coverage at the 2.3.1 floor, current stable 2.x, and
  canary.

## Dependency and project workflows

- Added dependency ergonomics for consuming Lykn packages across projects:
  `lykn add`, `lykn link`, `lykn unlink`, specifier imports, version
  consolidation, and local link-registry behavior.
- Refreshed guides and README material for the 0.6.0 source, build, dist,
  publish, lint, and testing workflows.
- Added template/i18n examples using ICU-style message formatting support.

## Documentation and book edition

- Reconciled the Lykn Book v0.6 edition with the current 0.6.0 language and
  toolchain surface.
- Verified book Lykn examples through the documentation fence gate. The 0.6.0
  book continues to use `lisp` fences for Lykn code blocks; migration to `lykn`
  fences remains deferred.
- Added explicit book-version navigation and release-tag expectations for the
  `book-v0.6.0` edition tag.

## Compatibility notes

- Some compiler behavior is intentionally stricter than earlier development-era
  behavior. Invalid value-position conditionals and overlapping JavaScript
  function clauses now fail earlier instead of producing misleading output.
- `lykn run` no longer injects blanket Deno `-A` permissions. Commands that need
  filesystem, network, environment, subprocess, or FFI access must request the
  relevant permission explicitly.
- Unscoped `deno test --config project.json` is not the supported repository test
  command. Use `deno test --config project.json -A test/` or the Makefile gates.
- Release publication, the language `0.6.0` tag, and the book `book-v0.6.0` tag
  are separate operator-owned steps and are not implied by this draft.
