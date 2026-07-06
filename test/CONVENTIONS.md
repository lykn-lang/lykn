# Test-suite conventions

Conventions for the lykn repo's own test suite. (User-facing "how to write
lykn tests" lives in `docs/guides/16-testing.md`; this file is about *this
repo's* tests.)

## Running the tests

**Canonical command:**

```sh
deno test --config project.json -A test/
```

- `--config project.json` — supplies the import map (`lang/` → the built
  package, `testing/` → the built testing helpers, `astring`). Without it,
  bare specifiers don't resolve.
- `-A` — the suite needs read/write/run/env access (temp files, the A-7 parity
  guard reads `dispatch.rs`, `compileBoth` shells out to the Rust binary).
- `test/` — **scope the run to `test/`.** Unscoped `deno test --config
  project.json` is **not supported**: it also walks `target/` (compiled
  `*_test.js` under `target/lykn/test/`, doctest output), which double-runs the
  corpus and, without `-A`, fails on permissions.

`lykn test` runs the same JS suite *plus* the compiled `.lykn` cross-compiler
corpus (it compiles `*_test.lykn`/`.lyk` to `target/lykn/test/`, never the
source tree — arc11/slice01).

## Location independence (MUST)

Compiled `.lykn`/`.lyk` tests are run from `target/lykn/test/`, not beside their
source. Anything that resolves a path from the test file's on-disk location
breaks there. So:

- **Module imports → bare import-map specifiers**, never relative paths into the
  repo. Use `"lang/compiler.js"`, `"testing/helpers.js"` — not
  `"../../packages/lang/compiler.js"`. The import map (in `project.json`)
  resolves bare specifiers relative to the config, so they work from any
  location.
- **Fixture / data paths → anchored at `Deno.cwd()`** (the project root under
  both `lykn test` and the canonical `deno test` command), never
  `import.meta.dirname`. Use `(resolve (Deno:cwd) "test/fixtures/macros")` —
  not `(resolve import:meta:dirname "../fixtures/macros")`. This matches
  `compileBoth`'s project-root-cwd contract.

Rationale: `import.meta.dirname` and relative source imports both encode the
test's compile location; when tests compile into `target/`, that location
changes and the paths dangle (the "April orphan" failure mode — arc11).

## Naming

- Hand-written JS tests: `*.test.js` (tracked, run directly by Deno).
- Compiled lykn tests: `*_test.lykn` / `*_test.lyk` → `*_test.js` (generated
  into `target/lykn/test/`, gitignored; `*_test.js` is in `.gitignore`).
