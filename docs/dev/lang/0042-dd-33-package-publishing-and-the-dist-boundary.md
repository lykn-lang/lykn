---
number: 43
title: "DD-33: Package Publishing and the `dist/` Boundary"
author: "the lykn"
component: CLI, Build, Publishing
tags: [publishing, workspace, cli, jsr, npm, build]
created: 2026-04-17
updated: 2026-04-17
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# DD-33: Package Publishing and the `dist/` Boundary

**Status**: Decided
**Date**: 2026-04-17
**Session**: Publishing infrastructure design conversation (2026-04-17)
**Depends on**: DD-28 (workspace convention), DD-29 (project template), DD-30 (testing DSL)
**Blocks**: DD-34 (cross-package `import-macros` resolution — future)

## Summary

Every lykn workspace member publishes from a unified `dist/<pkg>/`
staging directory — never directly from source. `lykn build` (extended
from its current npm-only form) produces self-contained package
artifacts that satisfy both JSR and npm. Source `.lykn` files are
**build inputs**, never published as primary entry points. Three
package kinds are formally recognized (runtime library,
compile-time-only / macro module, tooling), and a `lykn` metadata
field in the generated package config declares the kind so the lykn
compiler can locate macro sources at a consumer's compile time.
This is implemented as a pre-publish build phase consumed by both
`lykn publish --jsr` and `lykn publish --npm`. `serde_json` is
adopted in `lykn-cli` to replace hand-rolled JSON parsing.

## Motivation

1. **`@lykn/testing` currently cannot be published cleanly.** Its
   `deno.json` declares `"exports": "./mod.lykn"` — JSR accepts this
   but npm consumers cannot import it, and the current
   `lykn publish --npm` copies only `.js` files, producing a broken
   package with a `package.json` pointing at a nonexistent `./mod.js`.

2. **The problem is structural, not specific to testing.** `lykn new`
   currently generates `"exports": "./mod.lykn"` for every new
   project. Without DD-33, every lykn project scaffold ships with the
   same publishing bug.

3. **JSR and npm code paths are asymmetric today.** `lykn publish --jsr`
   runs `deno publish` on the raw source tree. `lykn publish --npm`
   runs a partial `dist/` build. This fork makes every publishing
   concern cost twice — consistency requires a unified staging
   boundary.

4. **Source `.lykn` files are not a distribution format.** Consumers
   without the lykn toolchain cannot parse them. Publishing source
   as the package entry point means the package only works for other
   lykn users — defeating interoperability with plain JS / TS.

5. **Compile-time-only packages are a legitimate pattern.** The
   testing package, and future linter/macro packages, need to ship
   `.lykn` macro sources alongside compiled JS. Calling these
   "macro modules" and giving them explicit metadata is cleaner than
   ad-hoc special-casing.

6. **The hand-rolled JSON parsing in `build_npm_package` will not
   survive DD-33's complexity.** Adding `serde_json` now removes a
   maintenance liability and simplifies DD-29's template generator.

## Decisions

### 1. Unified `dist/` as the single publishing boundary

**Decision**: `lykn publish --jsr` and `lykn publish --npm` both
consume `dist/<pkg>/`. Neither reads from `packages/<pkg>/` directly
at publish time. A mandatory `lykn build` step populates `dist/`
before either publish action runs.

**Workflow**:

```
packages/<pkg>/       (source — authored by humans)
     │
     │  lykn build
     ▼
dist/<pkg>/           (staged — regenerated, gitignored)
     │
     ├──► lykn publish --jsr  →  deno publish
     └──► lykn publish --npm  →  npm publish
```

**Rationale**: One mechanism, one place to reason about what gets
published. Matches how every mature compiled language handles
distribution (TypeScript's `outDir`, Rust's `target/package`, etc.).

### 2. Three formally recognized package kinds

**Decision**: Every lykn package declares one of three `kind` values
in its `deno.json`:

| Kind | Description | Example |
|------|-------------|---------|
| `runtime` | Library consumed at runtime; authored in `.lykn` and/or `.js` | `@lykn/lang`, `@lykn/browser`, future lykn libraries |
| `macro-module` | Compile-time-only package consumed via `import-macros` | `@lykn/testing` |
| `tooling` | Plain JS tooling, no lykn sources | Build scripts, CI helpers |

**Syntax**:

```json
{
  "name": "@lykn/testing",
  "version": "0.5.0",
  "exports": "./mod.lykn",
  "lykn": {
    "kind": "macro-module",
    "macroEntry": "./mod.lykn"
  }
}
```

The `lykn` field is ignored by Deno, JSR, and npm; it is read only
by `lykn build` (to drive the staging strategy) and by the lykn
compiler at the consumer's end (to locate macro sources).

**Default**: If `lykn.kind` is absent, `lykn build` infers `runtime`
if any `.lykn` file is present, otherwise `tooling`. An explicit
declaration is preferred.

**Rationale**: Making the kind explicit turns "what do we do with
this package?" from an ad-hoc decision at publish time into a
property of the package itself. New package kinds (e.g., a future
`linter-plugin`) extend the enum cleanly.

### 3. `lykn build` as the pre-publish staging phase

**Decision**: The existing `lykn build` command gains a new
third form. Current flags:

```
lykn build --browser   # existing — browser bundle
lykn build --npm       # existing — npm dist dirs (legacy)
```

New flag:

```
lykn build --dist      # NEW — unified dist/ staging for all members
```

`lykn build --dist` replaces the legacy `--npm` behaviour. `--npm`
continues to work during a transition period but emits a deprecation
warning pointing at `--dist`. Both `lykn publish --jsr` and
`lykn publish --npm` invoke `lykn build --dist` implicitly if
`dist/` is missing or stale.

**Workspace iteration**: `lykn build --dist` reads workspace members
from `project.json` and builds each into `dist/<short-name>/` (where
`short-name` is the portion after the `@scope/` prefix). A single
workspace member can be targeted via `lykn build --dist <pkg>`.

**Staleness check**: `dist/<pkg>/` is considered stale if any file
under `packages/<pkg>/` has a newer mtime than `dist/<pkg>/.build-stamp`.

**Rationale**: Keeping this as a subcommand of the existing `build`
verb rather than a new top-level command matches DD-28's CLI shape.
Implicit invocation from publish means users never forget the step.

### 4. Per-kind staging rules

**Decision**: `lykn build --dist` dispatches on `lykn.kind` and
stages the package accordingly.

#### 4.1 `runtime` packages

- Compile every `.lykn` file under `packages/<pkg>/` to `.js` at the
  same relative path under `dist/<pkg>/`.
- Copy every non-`.lykn` source file (existing `.js`, `.d.ts`, etc.)
  verbatim.
- Generate `dist/<pkg>/deno.json` from the source `deno.json`, with
  `exports` rewritten to point at the compiled `.js` files.
- Generate `dist/<pkg>/package.json` for npm.
- Do **not** ship `.lykn` sources in the published artifact. They
  stay in `packages/<pkg>/` and optionally in `dist/<pkg>/src/` for
  source maps (out of scope for DD-33; deferred).

#### 4.2 `macro-module` packages

- Copy every `.lykn` file under `packages/<pkg>/` verbatim to
  `dist/<pkg>/` — these are **data** for the lykn compiler at the
  consumer's end, not runtime code.
- Copy every `.js` file verbatim.
- Generate a minimal `dist/<pkg>/mod.js` stub that exports a
  `VERSION` string and nothing else. This satisfies JS tooling
  (JSR validator, npm import-resolution) while the real work
  happens through `import-macros` at the consumer's compile time.
- Generate `dist/<pkg>/deno.json` with `exports: "./mod.js"` and
  a preserved `lykn` metadata field.
- Generate `dist/<pkg>/package.json` with `main: "./mod.js"`.

#### 4.3 `tooling` packages

- Copy `.js` files verbatim.
- Generate configs as for `runtime` (no compilation step needed).

**Example — macro-module staging**:

Source tree:

```
packages/testing/
  deno.json       ; kind: macro-module
  mod.lykn        ; runtime-import + surface-macros directives
  macros.js       ; hand-written macro bridge
```

After `lykn build --dist packages/testing`:

```
dist/testing/
  deno.json       ; exports: ./mod.js, preserves lykn metadata
  package.json    ; main: ./mod.js
  mod.js          ; generated stub: export const VERSION = "0.5.0";
  mod.lykn        ; copied verbatim
  macros.js       ; copied verbatim
  README.md       ; copied
  LICENSE         ; copied
  .build-stamp    ; mtime marker
```

**Rationale**: The macro-module rule is the subtle one. A consumer's
lykn compiler needs `mod.lykn` and `macros.js` at compile time; a
consumer's JS tooling needs `mod.js` at import-resolution time.
Shipping both satisfies both audiences without compromising either.

### 5. Import path rewriting during staging

**Decision**: When a source file contains workspace-relative imports
(e.g., `from "lang/reader.js"` resolved through `project.json`'s
`imports` map), `lykn build --dist` rewrites those imports to their
package-qualified form (`from "@lykn/lang/reader.js"`) in the
staged output.

The rewriter uses a proper ES module import parser (via `swc` or
`oxc_parser` — see Open Questions). It does **not** use string
replacement. The current hand-rolled `content.replace("from 'lang/"`
in `build_npm_for_package` is retired.

**Rationale**: String replacement breaks on template literals,
comment-embedded imports, and quote-style variation. Parser-based
rewriting is correct by construction. Since we're adopting
`serde_json` anyway, the crate-count argument against a JS parser
crate is weaker than it was.

### 6. Generated `deno.json` and `package.json`

**Decision**: The source `packages/<pkg>/deno.json` is the authoritative
metadata. `lykn build --dist` generates the distribution configs from
it using `serde_json`:

- `dist/<pkg>/deno.json`: Copy `name`, `version`, rewrite `exports`
  to point at compiled/staged files, preserve `lykn` metadata,
  preserve `imports` (rewritten if they reference workspace siblings).

- `dist/<pkg>/package.json`: Derive `name`, `version`, `main`,
  `exports`, `type: "module"`, `dependencies` (translated from
  `imports` — `npm:foo@^1.0.0` → `"foo": "^1.0.0"`, workspace
  imports → `@lykn/<sibling>: "^<version>"`). Preserve author,
  license, repository from project-level defaults in `project.json`
  or a new top-level block (see Decision 8).

**Rationale**: Writing configs from parsed JSON is vastly more
robust than the current substring-matching approach, and DD-29's
template generator will benefit from the same `serde_json`-based
code path.

### 7. `lykn new` template update

**Decision**: `lykn new` changes the generated `deno.json` to
declare `kind: "runtime"` and point `exports` at `./mod.js`
(the compilation target), not `./mod.lykn` (the source).

**Generated** `packages/<name>/deno.json`:

```json
{
  "name": "@<name>/<name>",
  "version": "0.1.0",
  "exports": "./mod.js",
  "lykn": {
    "kind": "runtime"
  }
}
```

The generated `mod.lykn` remains the authoring entry; `./mod.js`
is understood as the post-build artifact. Running
`lykn build --dist` produces `dist/<name>/mod.js` from
`packages/<name>/mod.lykn`.

**Rationale**: Without this change, every new lykn project inherits
the same publishing bug that DD-33 is fixing in `@lykn/testing`.
DD-29's template is the propagation vector.

### 8. `serde_json` adoption in `lykn-cli`

**Decision**: Add `serde` (with `derive`) and `serde_json` as
dependencies of `lykn-cli`. Replace the hand-rolled JSON helpers
(`json_extract`, `extract_npm_deps`, the workspace-array parser
in `read_workspace_members`) with typed structs.

**New types** (sketch):

```rust
#[derive(Deserialize)]
struct ProjectConfig {
    workspace: Vec<String>,
    #[serde(default)]
    imports: IndexMap<String, String>,
    // ...
}

#[derive(Deserialize, Serialize)]
struct PackageConfig {
    name: String,
    version: String,
    exports: String,
    #[serde(default)]
    imports: IndexMap<String, String>,
    #[serde(default, rename = "lykn")]
    lykn_metadata: Option<LyknMetadata>,
}

#[derive(Deserialize, Serialize)]
struct LyknMetadata {
    kind: PackageKind,
    #[serde(skip_serializing_if = "Option::is_none")]
    macro_entry: Option<String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
enum PackageKind {
    Runtime,
    MacroModule,
    Tooling,
}
```

**Rationale**: The publishing pipeline reads and writes several
JSON configs with non-trivial structure. Continuing with substring
matching would create bugs that only surface at publish time — too
late. The dependency cost is trivial compared to the correctness
win.

### 9. `lykn publish` behaviour

**Decision**: `lykn publish` flags and semantics update as follows:

| Flag | Behaviour |
|------|-----------|
| `--jsr` | Run `lykn build --dist`, then `deno publish` pointed at `dist/`-based config |
| `--npm` | Run `lykn build --dist`, then `npm publish` per staged package |
| `--dry-run` | Build `dist/`; show what would be published without network I/O |
| (no flags) | Default to `--jsr` (unchanged from current behaviour) |
| `--no-build` | Skip the build step; publish from existing `dist/` (CI optimization) |

The JSR publish path needs a generated top-level workspace config
that references `dist/<pkg>/deno.json` paths instead of source
`packages/<pkg>/deno.json` paths. `lykn build --dist` emits this at
`dist/project.json`. `deno publish --config dist/project.json`
then publishes from `dist/`.

**Rationale**: Unifying the two publish flows on a shared `dist/`
input is the whole point of DD-33. `--no-build` is an escape hatch
for CI systems that want to cache the build artifact between the
build job and the publish job.

### 10. `.gitignore` and build artifacts

**Decision**: `dist/` remains gitignored (already is — see
`.gitignore` line `/dist`). The generated `dist/project.json`,
per-package `dist/<pkg>/deno.json`, `package.json`, `mod.js` stubs,
and `.build-stamp` markers are all build artifacts.

**Rationale**: Nothing in `dist/` should be hand-edited. Treating
it as a build artifact (like `target/`) prevents drift between
source config and staged config.

## Example: end-to-end for `@lykn/testing`

Before DD-33 (current state):

```
packages/testing/
  deno.json            ; "exports": "./mod.lykn"
  mod.lykn
  macros.js

lykn publish --npm
  → dist/npm-testing/
      package.json     ; "main": "./mod.js"  ← BROKEN: mod.js doesn't exist
      macros.js        ; copied
      (no mod.js, no mod.lykn)
```

After DD-33:

```
packages/testing/
  deno.json            ; "exports": "./mod.lykn", lykn.kind: "macro-module"
  mod.lykn
  macros.js

lykn build --dist packages/testing
  → dist/testing/
      deno.json        ; "exports": "./mod.js", preserves lykn.*
      package.json     ; "main": "./mod.js"
      mod.js           ; generated stub
      mod.lykn         ; copied (data for lykn compiler)
      macros.js        ; copied
      .build-stamp

lykn publish --jsr   → publishes dist/testing/ via deno publish
lykn publish --npm   → publishes dist/testing/ via npm publish
```

## Rejected Alternatives

### Quick fix: add `mod.js` stub, leave everything else alone

**What**: Add a hand-written `packages/testing/mod.js` stub,
update `exports` in the current testing `deno.json`, ship it.

**Why rejected**: Fixes one package while the same bug sits in
`lykn new`'s template. Every future lykn project would repeat the
exact mistake. The refactor to `dist/` would happen anyway — doing
the quick fix first means doing the work twice.

### Two-track publishing (runtime vs macro-module)

**What**: Separate publishing code paths per package kind —
compile-to-dist for runtime packages, raw-source publishing for
macro modules (CC's original proposal).

**Why rejected**: Splits the mental model where unification is
cleaner. Mixed packages (lykn libraries that export both runtime
code and compile-time macros) would need a third track. A single
`dist/` with kind-aware staging rules handles all cases naturally.

### Pre-expand macro modules to pure JS at build time

**What**: Use the lykn compiler to pre-expand `mod.lykn` into a
standalone `.js` file that encodes the `runtime-import` and
`surface-macros` directives as JS data, shipping only the compiled
form.

**Why rejected**: Tempting but wrong-layered. The `runtime-import`
and `surface-macros` directives are instructions to the lykn
compiler, not JS runtime constructs. Pre-expanding pushes compiler
semantics into the JS runtime where they don't belong and can't
be interpreted. Keeping the `.lykn` source as compile-time data
preserves the compiler's authority over those directives.

### Publish source `.lykn` as the primary entry point

**What**: Keep the current `"exports": "./mod.lykn"` pattern;
require consumers to have the lykn toolchain.

**Why rejected**: Closes the door on plain-JS / TypeScript
consumers. A lykn library that emits clean JS should be usable
from clean JS. The thin-skin-over-JS principle (DD-15) argues for
interop, not lykn-only ecosystems.

### String-based import rewriting (status quo)

**What**: Keep the current `content.replace("from 'lang/"` approach
for workspace import rewriting.

**Why rejected**: Breaks on template literals, comment-embedded
imports, and arbitrary quote styles. One parser-based rewriter is
correct for all cases; the substring approach has a bug waiting to
happen every time someone writes an import in a slightly
unexpected style.

### Defer `serde_json` adoption

**What**: Keep hand-rolled JSON parsing, extend it to handle the
new fields DD-33 introduces.

**Why rejected**: The parsing burden grows enough in DD-33 that
rolling more of it by hand is net-negative. `serde_json` is a
universal Rust-ecosystem dependency; treating it as load-bearing
infrastructure is normal practice. Duncan's explicit preference
(conversation 2026-04-17) confirms.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| Package with no `lykn.kind` declared | Infer from contents: `runtime` if any `.lykn` file, else `tooling` | Existing `@lykn/browser` auto-classified as `runtime` |
| `macro-module` with only `.js` (no `.lykn`) | Build succeeds; generated stub still emitted | A hypothetical pure-JS macro bridge |
| `runtime` package with no `.lykn` files | Build copies `.js` verbatim (no compilation step needed) | Current `@lykn/lang` — already compiled |
| Workspace member with neither `deno.json` nor `package.json` | Build fails with clear error pointing at missing config | Misconfigured workspace |
| `dist/` exists but is stale | Publish triggers rebuild; warn if source mtime > `.build-stamp` | Modified source after last build |
| `dist/` exists and is fresh | Skip rebuild unless `--force-build` | CI optimization |
| `--no-build` with missing `dist/` | Fail with clear error: run `lykn build --dist` first | CI misconfiguration |
| Package has `kind: macro-module` but no `.lykn` files | Build warns — is it really a macro module? | Misclassification |
| Circular workspace dependency | Build fails with clear cycle diagnostic | Future multi-package development |
| User edits `dist/<pkg>/` by hand | Next build overwrites silently (dist is a build artifact) | Attempting to patch published code |
| `package.json` needs fields not in `deno.json` (repo URL, author) | Read from a new top-level `publish` block in `project.json` | Consistent metadata across all members |

## Dependencies

- **Depends on**:
  - DD-28 (workspace convention, `lykn build`, `project.json`)
  - DD-29 (project template — must be updated per Decision 7)
  - DD-30 (testing DSL — defines `@lykn/testing` as the canonical
    `macro-module` example)
- **Affects**:
  - DD-29 (template generation must emit new `exports` and
    `lykn.kind`)
  - Future DD-34 (cross-package `import-macros` resolution)
  - Book chapter "CI/CD and Publishing" (to be renamed from "CI/CD")
  - `docs/guides/12-deno/12-04-publishing.md` (rewrite needed)

## Open Questions

- [ ] **Cross-package `import-macros` resolution is unsolved.** The
  current expander resolves `(import-macros "testing" ...)` as a
  filesystem path relative to the importing file (see `pass0.rs`).
  There is no `jsr:` / `npm:` / workspace-alias handling. For a
  consumer in a different project to `(import-macros "@lykn/testing"
  ...)` successfully, the expander needs a resolution scheme. This
  is DD-34's scope. DD-33 ensures that `dist/<pkg>/` contains the
  files DD-34 will need (macro sources + metadata) so we don't lock
  ourselves out.

- [ ] **JS import parser choice for rewriting (Decision 5).** Options
  include `swc_ecma_parser`, `oxc_parser`, or a minimal regex-based
  parser targeted at the narrow "string-literal module specifier"
  case. The minimal approach might be a reasonable starting point
  if the full parsers add significant compile time. Decide during
  implementation Phase 2.

- [ ] **Top-level `publish` block in `project.json`?** Fields like
  `author`, `license`, `repository`, `keywords` are currently
  hard-coded in `build_npm_for_package`. A `"publish": { ... }`
  block in `project.json` would let each project declare these
  once. Low priority; can be added after the core pipeline works.

- [ ] **Source maps / `.lykn` source in published runtime packages?**
  For debugging, published `@lykn/*` runtime packages might benefit
  from shipping `.lykn` sources under `dist/<pkg>/src/` with source
  maps in the compiled `.js`. Interacts with the ongoing source
  mapping work (see `lykn-source-mapping-bootstrap.md`). Out of
  scope for DD-33; revisit after source mapping lands.

- [ ] **How does `lykn build --dist` interact with the existing
  `--browser` flag?** The browser bundle is its own artifact, not
  per-package staging. Current plan: keep `--browser` separate,
  since it bundles across the workspace rather than staging
  per-package. `--npm` becomes deprecated alias for `--dist` with
  npm-only output.

- [ ] **Versioning: synced or independent across workspace members?**
  Today all packages are `0.5.0`. No decision forced by DD-33, but
  the `lykn build --dist` implementation needs to know. Proposal:
  synced versions read from a single source (either the top-level
  `project.json` or the root `Cargo.toml`'s `workspace.package.version`),
  propagated to all members. Revisit if independent versioning
  becomes needed.

## Implementation Phases

### Phase 1: `serde_json` adoption and config types

1. Add `serde`, `serde_json`, `indexmap` to `crates/lykn-cli/Cargo.toml`.
2. Create `crates/lykn-cli/src/config.rs` with `ProjectConfig`,
   `PackageConfig`, `LyknMetadata`, `PackageKind` types.
3. Replace `read_workspace_members`, `json_extract`, `extract_npm_deps`
   with typed serde calls.
4. Verify existing `lykn build --npm` and `lykn publish --npm`
   continue to work with no behaviour change.
5. Update tests.

### Phase 2: `lykn build --dist` core

1. Add `--dist` variant to the `build` subcommand in `main.rs`.
2. Implement `build_dist_for_package` per-kind dispatch.
3. Implement `runtime` kind staging: compile `.lykn` → `.js`,
   rewrite `exports` in generated `deno.json`, generate
   `package.json`.
4. Implement `macro-module` kind staging: copy `.lykn` and `.js`,
   generate `mod.js` stub, preserve `lykn` metadata.
5. Implement `tooling` kind staging: copy `.js`, generate configs.
6. Emit `dist/project.json` for JSR workspace publish.
7. Emit `.build-stamp` for staleness detection.
8. Tests: unit tests per-kind + integration test publishing
   `@lykn/testing` to a local npm verdaccio (or `npm pack --dry-run`).

### Phase 3: Import rewriting

1. Choose import-parser crate (see Open Questions).
2. Implement `rewrite_workspace_imports` in `build.rs`.
3. Integrate into `runtime` and `macro-module` staging.
4. Retire the string-based `content.replace` in
   `build_npm_for_package`.
5. Tests: edge cases (template literals, comments, mixed quotes,
   multi-line imports).

### Phase 4: Publish pipeline integration

1. Update `cmd_publish` to invoke `lykn build --dist` implicitly.
2. Point `deno publish` at `dist/project.json`.
3. Point `npm publish` per `dist/<pkg>/`.
4. Add `--no-build` flag for CI.
5. Deprecate `lykn build --npm` → alias to `--dist` with warning.
6. Tests: `--dry-run` end-to-end for both JSR and npm.

### Phase 5: Update workspace members

1. Add `"lykn": { "kind": "runtime" }` to `packages/lang/deno.json`
   and `packages/browser/deno.json`.
2. Add `"lykn": { "kind": "macro-module", "macroEntry": "./mod.lykn" }`
   to `packages/testing/deno.json`.
3. Change `packages/testing/deno.json` `exports` from `"./mod.lykn"`
   to `"./mod.js"` (aligned with the stub).
4. Verify `lykn publish --dry-run --jsr` and `--npm` produce
   valid packages for all three members.

### Phase 6: Update `lykn new` template (DD-29 interaction)

1. Change `deno_json_template` in `main.rs` to emit
   `"exports": "./mod.js"` and `"lykn": { "kind": "runtime" }`.
2. Update the generated `README.md` / scaffold docs to describe the
   build-then-publish workflow.
3. Verify a fresh `lykn new demo` project publishes cleanly.

### Phase 7: Documentation

1. Rewrite `docs/guides/12-deno/12-04-publishing.md` to document
   the `dist/` boundary, package kinds, and the three-step workflow.
2. Update the book's CI/CD chapter into "CI/CD and Publishing".
3. Update `CLAUDE.md` and `README.md` with the new workflow.
