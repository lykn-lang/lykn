---
number: 44
title: "DD-34: Cross-Package `import-macros` Resolution"
author: "the lykn"
component: Expander, CLI
tags: [expander, macros, resolution, jsr, npm, workspace]
created: 2026-04-17
updated: 2026-04-17
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# DD-34: Cross-Package `import-macros` Resolution

**Status**: Decided
**Date**: 2026-04-17
**Session**: Publishing infrastructure design conversation (2026-04-17),
follow-up to DD-33
**Depends on**: DD-13 (macro expansion pipeline), DD-14 (macro modules
and ESM interaction), DD-33 (publishing and the `dist/` boundary)
**Blocks**: None (cross-package macro consumption becomes available
once implemented)

## Summary

`(import-macros "<spec>" (...))` gains a layered resolution scheme.
Specifiers may be: (a) scheme-prefixed URLs that Deno already
understands (`jsr:`, `npm:`, `file:`, `https:`), (b) bare package
names resolved through `project.json`'s `imports` map, or
(c) relative/absolute filesystem paths (the current behaviour).
Scheme-prefixed specifiers are delegated to the existing Deno
subprocess which asks Deno to resolve them to cached on-disk paths;
bare names expand through the import map and then fall through to
the filesystem resolver. The `ModuleCache` is re-keyed by resolved
canonical path so identical packages reached via different
specifier forms deduplicate correctly. A new `lykn.macroEntry`
field in a published package's `deno.json` (established by DD-33)
tells the resolver which file contains the macro definitions when
a specifier points at a package root rather than a specific file.

## Motivation

1. **DD-33 produced a publishable `@lykn/testing` but no way to
   consume it from a downstream project.** The current expander's
   resolution in `pass0::process_single_import` is pure filesystem:
   `fp.parent().join(&module_path)`. A consumer writing
   `(import-macros "@lykn/testing" (test is))` fails because the
   resolver looks for a literal file called `@lykn/testing` next to
   the importing source.

2. **`runtime-import` already handles `jsr:` and `npm:` specifiers
   correctly** — it compiles to an ESM `import` statement that Deno
   resolves natively. `import-macros` should mirror this behaviour
   rather than invent its own.

3. **Three distinct consumption patterns exist and must all work**:
   | Pattern | Example | Who |
   |---------|---------|-----|
   | In-repo macro modules | `(import-macros "./macros.lykn" ...)` | Current usage inside lykn |
   | Workspace sibling | `(import-macros "testing" ...)` (resolved through `project.json`) | Future lykn projects with in-workspace macro packages |
   | Published package | `(import-macros "jsr:@lykn/testing" ...)` | Consumers of `@lykn/testing` post-DD-33 |

4. **The asymmetry between `runtime-import` and `import-macros` is
   a papercut.** DD-34 harmonizes them so users have one mental
   model for "this is where a module comes from" regardless of
   whether the module is a runtime dependency or a compile-time
   macro module.

5. **Re-litigating DD-33 won't solve this.** DD-33 correctly
   deferred cross-package resolution to a separate DD. That's this
   one.

## Decisions

### 1. Three-tier resolution strategy

**Decision**: `import-macros` specifiers are resolved in this
order, with the first match winning:

1. **Scheme-prefixed**: specifier starts with `jsr:`, `npm:`,
   `file:`, `http:`, or `https:`. Delegated to Deno's resolver
   (via subprocess) to produce a canonical on-disk path.

2. **Bare name with import-map entry**: specifier contains no
   path separator and no scheme, and matches a key in
   `project.json`'s `imports` map. The map value is looked up,
   and if it is itself scheme-prefixed or a relative path, that
   value is resolved via the remaining tiers.

3. **Filesystem path**: specifier starts with `./`, `../`, `/`,
   or an alphanumeric path segment not matched by tier 2.
   Resolved relative to the importing file's directory
   (current behaviour, unchanged).

**Example dispatch**:

```lisp
;; Tier 1 — scheme-prefixed, Deno resolves via JSR
(import-macros "jsr:@lykn/testing" (test is))

;; Tier 1 — scheme-prefixed, Deno resolves via npm
(import-macros "npm:@lykn/testing@^0.5.0" (test is))

;; Tier 2 — bare name, looked up in project.json imports map
;;   where "testing" maps to "jsr:@lykn/testing" or similar
(import-macros "testing" (test is))

;; Tier 3 — relative path (existing behaviour)
(import-macros "./macros/control-flow.lykn" (unless))

;; Tier 3 — sibling workspace package via relative path
(import-macros "../testing/mod.lykn" (test is))
```

**Rationale**: Layered resolution matches user intuition about
specifier strings. Scheme prefixes are unambiguous and match
Deno's existing conventions. Bare names through an import map
provide ergonomic aliases without special syntax. Relative paths
preserve backward compatibility for every current use site.

### 2. `lykn.macroEntry` field resolves package-root specifiers

**Decision**: When a resolved path points to a **package root**
(a directory containing a `deno.json` or `package.json`) rather
than a specific file, the resolver consults the package's
`lykn.macroEntry` field to find the `.lykn` file containing
the macro definitions.

**Example**: A consumer writes:

```lisp
(import-macros "jsr:@lykn/testing" (test is))
```

Deno resolves `jsr:@lykn/testing` to a cached directory like
`~/.cache/deno/npm/registry.npmjs.org/@lykn/testing/0.5.0/`.
That directory contains `deno.json` with:

```json
{
  "name": "@lykn/testing",
  "version": "0.5.0",
  "exports": "./mod.js",
  "lykn": {
    "kind": "macro-module",
    "macroEntry": "./mod.lykn"
  }
}
```

The resolver reads `lykn.macroEntry` → `./mod.lykn` and treats
the macro source as that file relative to the package root.

**Fallback**: If `lykn.macroEntry` is absent, the resolver looks
for `./mod.lykn`, then `./macros.lykn`, then `./index.lykn` in
order. If none exist, it falls back to `exports` if that points
at a `.lykn` file. If no macro source can be located, resolution
fails with a clear diagnostic.

**Rationale**: Package authors control where their macros live
via explicit declaration. The fallback chain handles packages
that follow conventions without requiring the field. Letting
`exports` serve as a fallback is a deliberate concession to
packages that predate DD-33's metadata conventions.

### 3. Delegation protocol to Deno subprocess

**Decision**: The existing `DenoSubprocess` in
`crates/lykn-lang/src/expander/deno.rs` gains a new action:
`"resolve"`. Given a scheme-prefixed specifier, Deno returns
the resolved absolute path (or an error).

**Protocol**:

Request:
```json
{ "action": "resolve", "specifier": "jsr:@lykn/testing" }
```

Success response:
```json
{ "ok": true, "result": "/Users/.../deno/npm/.../@lykn/testing/0.5.0/" }
```

Failure response:
```json
{ "ok": false, "error": "jsr:@lykn/testing not found" }
```

**Deno-side implementation**: The evaluator script uses
`import.meta.resolve()` to turn the specifier into a `file://`
URL, then converts to a filesystem path. For package-root
specifiers, it resolves to the directory containing the package
config rather than the `exports` file itself.

**Rationale**: Deno is already the authority on module
resolution for the consuming project. Asking Deno rather than
reimplementing resolution in Rust is correct by construction —
any future Deno feature (new registry schemes, version
constraint syntax) works automatically.

### 4. Cache key unification

**Decision**: `ModuleCache` is re-keyed by resolved canonical
path (`std::fs::canonicalize` result), not by the raw specifier
string. This ensures that:

```lisp
(import-macros "jsr:@lykn/testing" (test))
(import-macros "@lykn/testing" (is))  ; same package via import map alias
```

both hit the same cache entry and trigger compilation exactly
once per lykn invocation.

**Rationale**: The current cache already keys by `PathBuf`, so
this is a simplification, not a rework. The win is avoiding
double-compilation when the same underlying module is reached
via multiple specifier forms.

### 5. `import-macros` specifier format

**Decision**: The specifier is a single string. No version
constraint syntax is invented specifically for `import-macros`;
version constraints are expressed via the underlying scheme
(e.g., `npm:@lykn/testing@^0.5.0`, `jsr:@lykn/testing@0.5.0`).

**Rationale**: Every scheme has its own version constraint
conventions. Inventing a lykn-specific layer on top would
duplicate that work and mean the lykn documentation has to
re-teach npm's semver ranges. Pass-through is simpler and
delegates authority to the ecosystem that already has it.

### 6. `project.json` import-map semantics for macros

**Decision**: `import-macros` consults the same `imports` map
in `project.json` that Deno uses for module resolution. No
separate `macroImports` field.

**Example** `project.json`:

```json
{
  "workspace": ["./packages/lang", "./packages/testing"],
  "imports": {
    "astring": "npm:astring@^1.9.0",
    "testing/": "./packages/testing/",
    "@lykn/testing": "jsr:@lykn/testing@^0.5.0"
  }
}
```

With this map:

```lisp
(import-macros "testing" ...)       ; tier 2 lookup fails — "testing" isn't a key,
                                    ;   but "testing/" is — treated as miss; tier 3 runs
                                    ;   and fails unless a "testing" file exists locally
(import-macros "testing/mod.lykn" ...) ; tier 2 prefix match — maps to "./packages/testing/mod.lykn"
(import-macros "@lykn/testing" ...) ; tier 2 exact match — maps to "jsr:@lykn/testing@^0.5.0"
                                    ;   which then re-enters tier 1
```

The two key shapes (`"foo"` exact and `"foo/"` prefix) mirror
Deno's own behaviour.

**Rationale**: Consolidating onto one import map keeps
`project.json` manageable. Using Deno's conventions means users
don't have to learn a second syntax. The prefix-match behaviour
makes the common case (alias a local package directory) ergonomic.

### 7. Error diagnostics

**Decision**: Resolution failures produce diagnostics that
explain which tier was consulted and why it failed. The
expander's `LyknError::Read` variant carries enough detail to
surface this.

**Example messages**:

```
import-macros resolution failed for "jsr:@lykn/testing":
  tier 1 (Deno resolver): jsr:@lykn/testing not found in registry
  hint: check your project.json imports map or run `deno info jsr:@lykn/testing`
```

```
import-macros resolution failed for "testing":
  tier 2 (project.json imports): no matching key
  tier 3 (filesystem): no file 'testing' or 'testing.lykn' relative to <path>
  hint: add an entry to project.json "imports" or use a scheme prefix
```

```
import-macros resolution succeeded for "jsr:@lykn/testing" but
no macro entry found in the package:
  checked: lykn.macroEntry field (absent)
  checked: ./mod.lykn (not found)
  checked: ./macros.lykn (not found)
  checked: ./index.lykn (not found)
  checked: exports field (points at mod.js, not .lykn)
  hint: the package may not declare macros, or it predates DD-33 metadata
```

**Rationale**: Resolution failures are the single most likely
source of user confusion. Making the failure message explicit
about which path the resolver took — and what failed — turns
"it doesn't work" into "it doesn't work for *this reason*".

### 8. Backward compatibility

**Decision**: Every specifier that works today continues to work
after DD-34. Relative paths (`./foo.lykn`, `../bar.lykn`) and
absolute paths (`/tmp/baz.lykn`) fall through to tier 3 and use
the existing resolver unchanged.

The only observable change for existing lykn code: tier 2
now takes effect when a bare name coincides with an import-map
key, which may convert some previously-failing resolutions into
successful ones. No current in-repo test uses a bare-name
specifier that also exists in the import map, so the transition
is safe.

**Rationale**: Breaking `import-macros` for the existing test
suite would cost more than DD-34 gains. Additive changes only.

## Rejected Alternatives

### Filesystem-only resolution (status quo)

**What**: Keep the current behaviour — `import-macros` resolves
only relative filesystem paths. Cross-package consumption would
require the consumer to depend on a specific on-disk layout.

**Why rejected**: Defeats DD-33. A published `@lykn/testing`
that nobody can cleanly consume is not a solved publishing
problem, just a relocated one.

### Separate `macroImports` field in `project.json`

**What**: Introduce a `macroImports` map distinct from
`imports`, used only by `import-macros`. Keeps runtime and
compile-time import namespaces cleanly separate.

**Why rejected**: Two maps for nearly identical purposes is a
confusing API. Users would have to maintain both. Deno itself
uses one map; matching that convention is less surprising than
inventing a new one.

### Publish-time materialization via `lykn install`

**What**: Add a `lykn install` (or `lykn sync`) command that
fetches `@lykn/*` macro packages and writes them into a local
`.lykn/macros/` directory. `import-macros` resolves only the
filesystem, pointing at `.lykn/macros/<pkg>/mod.lykn`.

**Why rejected**: Introduces an install step that lykn has
explicitly avoided elsewhere. Deno's native resolution already
caches packages on disk; reinventing a parallel cache is
duplicative. If performance or offline resolution becomes an
issue, this approach can be revisited as an optimization over
DD-34's base mechanism.

### Lykn-specific version constraint syntax

**What**: Invent a lykn-native way to pin macro package versions,
e.g., `(import-macros "testing" :version "^0.5.0" (...))`.

**Why rejected**: Every underlying scheme has its own version
syntax. Piping the scheme specifier through (`jsr:@lykn/testing@0.5.0`)
is one form; adding a second form just for lykn means users
mentally translate. Delegation is simpler.

### Full static resolution at compile time (no Deno subprocess
for resolve)

**What**: Reimplement Deno's JSR/npm resolution logic in the
Rust expander so scheme-prefixed specifiers never round-trip to
the subprocess.

**Why rejected**: The Deno subprocess is already running for
macro compilation and evaluation. Adding one `"resolve"` action
costs almost nothing. Reimplementing Deno's resolver in Rust is
a large amount of code that would drift from the authoritative
implementation as Deno evolves. Fewer moving parts wins.

### Glob or multi-file specifiers

**What**: Allow `(import-macros "testing/*" (...))` to import
all macro modules from a package's macro directory.

**Why rejected**: Premature generality. DD-14 already decided on
explicit binding lists for clarity. A multi-file specifier would
obscure which module each name comes from. Revisit if a real
use case emerges.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| Scheme-prefixed specifier Deno can't resolve | Error with scheme-specific message from Deno | `jsr:@lykn/nonexistent` |
| Bare name matches neither import map nor filesystem | Tier 3 error with hint to use scheme or add import map entry | `testing` with no alias configured |
| Import map value itself fails to resolve | Report the chain: "specifier → alias target → resolution failure" | `testing` → `jsr:@lykn/testing` → not found |
| Same package imported twice via different specifiers | Single cache entry keyed by canonical path; compiled once | `jsr:@lykn/testing` and `@lykn/testing` alias |
| Package root has no `lykn.macroEntry` and fallback chain fails | Error listing every candidate checked | Published package missing DD-33 metadata |
| Specifier resolves to a directory without a `deno.json` | Treat as raw directory; apply macro-entry fallback chain directly | Older pre-JSR package layouts |
| Specifier contains query string (`?`) or fragment (`#`) | Pass through to Deno for `jsr:`/`npm:`/`http:`; error for `file:` and bare | `https://example.com/macros.lykn?v=1` |
| Import map redirects to another import-map key | Resolve iteratively with cycle detection (max depth 8) | `"a"` → `"b"` → `"c"` |
| Import map cycle | Error with full cycle chain | `"a"` → `"b"` → `"a"` |
| Consumer has no `project.json` | Skip tier 2; proceed directly to tier 3 | One-off scripts |
| `https:` specifier but offline / sandboxed Deno | Deno returns a network error; surface with hint about `--allow-net` | Running under `--allow-read` only |
| Same in-workspace macro package imported via relative path and alias | Both hit the same cache via canonical-path keying | Development of a macro package and its consumer in the same workspace |

## Dependencies

- **Depends on**:
  - DD-13 (macro expansion three-pass pipeline — the resolver
    lives inside Pass 0)
  - DD-14 (macro modules + ESM interaction — establishes the
    `import-macros` form)
  - DD-33 (the `lykn.kind` and `lykn.macroEntry` metadata fields
    that DD-34 reads)
- **Affects**:
  - The Pass 0 implementation in `crates/lykn-lang/src/expander/pass0.rs`
    (resolution rewrite)
  - The Deno evaluator script in
    `crates/lykn-lang/src/expander/env.rs` (new `"resolve"` action)
  - The `DenoSubprocess` API in
    `crates/lykn-lang/src/expander/deno.rs` (new `resolve_specifier`
    method)
  - The `ModuleCache` in `crates/lykn-lang/src/expander/cache.rs`
    (canonical-path keying)
  - Documentation: `docs/guides/12-deno/12-04-publishing.md` (consumer
    side), future `docs/guides/macro-authoring.md`
  - Book chapter on macros and book chapter on CI/CD and publishing

## Open Questions

- [ ] **Should `file:` be treated identically to relative paths
  (tier 3) or go through Deno's resolver (tier 1)?** The current
  design routes `file:` through Deno for consistency. Alternative:
  short-circuit `file:` to the existing filesystem resolver to
  avoid subprocess overhead for what is effectively the current
  case. Probably a micro-optimization; decide during
  implementation.

- [ ] **Cache lifetime across `lykn` invocations?** DD-34 keeps
  the current in-memory cache-per-invocation model. A future
  optimization could persist compiled macro modules to disk
  (keyed by content hash + lykn version) and skip recompilation
  across invocations. Out of scope for DD-34; revisit if
  compilation latency becomes a user-visible pain point.

- [ ] **What happens when a published `macro-module` package
  depends on another macro module?** Macro modules can themselves
  contain `import-macros` directives. The resolver must handle
  resolution *relative to the resolved package root*, not the
  consumer's project. Currently the `compilation_stack` in
  `pass0.rs` tracks this via `PathBuf`; DD-34 preserves that and
  just ensures the recursive call has the right `file_path`
  context. Verify this in the implementation.

- [ ] **Offline behaviour for `jsr:` / `npm:` specifiers not yet
  cached.** Deno fetches them transparently if the network is
  available. If not, resolution fails. Should `lykn` pre-fetch
  macro packages during `lykn build`? DD-33 doesn't require it;
  DD-34 doesn't either. But a `lykn fetch` (or
  `lykn install --macros-only`) subcommand might be worth
  considering. Deferred.

- [ ] **Security: should macro packages be allowed arbitrary
  `runtime-import` of `npm:` / `jsr:` URLs at compile time?**
  The current expander runs macro code in a `new Function()`
  sandbox with access only to the macro API. But if a macro
  module's `mod.lykn` contains `(runtime-import "jsr:dangerous" ...)`,
  that dependency ends up in the *consumer's* compiled output.
  This is a trust model decision: does consuming a macro module
  mean trusting its runtime-import declarations? Probably yes
  (same trust model as any npm dep), but it warrants an explicit
  note in the publishing guide. Deferred to DD-35 (macro package
  trust model) if it warrants a full design pass.

- [ ] **Tooling: should `lykn check` verify import-macros
  resolution across a whole project?** A `--resolve-imports`
  flag (or separate `lykn resolve` subcommand) that walks every
  `import-macros` call in a project and reports unresolvable
  specifiers would be useful pre-publish. Out of scope for
  DD-34's core, but mentioned so the CLI surface has room for
  it.

## Implementation Phases

### Phase 1: Deno subprocess `"resolve"` action

1. Extend `DENO_EVALUATOR_JS` in `env.rs` with the `"resolve"`
   case: call `import.meta.resolve(specifier)`, convert the
   returned URL to a filesystem path, return it. For package
   roots, detect the package config and return the containing
   directory.
2. Add `resolve_specifier(&mut self, specifier: &str) -> Result<PathBuf, LyknError>`
   to `DenoSubprocess`.
3. Tests: round-trip for `jsr:@std/assert`, `npm:astring@^1.9.0`,
   `file://` URLs, and error cases.

### Phase 2: Import-map parsing

1. Extend `crates/lykn-cli/src/config.rs` (from DD-33's Phase 1)
   with an `ImportMap` type that mirrors Deno's semantics (exact
   match and prefix match).
2. Expose the map to the expander. `expand()` already accepts a
   `file_path` for resolution context; extend to also accept the
   project's `imports` map (read from `project.json` once per
   invocation).
3. Tests: map lookup edge cases, prefix match, scheme-rewrites.

### Phase 3: Three-tier resolver in Pass 0

1. Create `crates/lykn-lang/src/expander/resolve.rs`.
2. Implement `resolve_specifier(spec, importing_file, import_map, deno) -> ResolvedModule`
   with the three-tier dispatch.
3. Implement macro-entry fallback chain for package-root
   resolutions.
4. Wire into `pass0::process_single_import` replacing the current
   `fp.parent().join(&module_path)` logic.
5. Cache keyed by canonical path throughout.
6. Tests: every edge case from the table above.

### Phase 4: Error diagnostics

1. Introduce a `ResolutionError` enum with variants per failure
   mode (tier 1 fail, tier 2 miss, tier 3 miss, macro-entry not
   found, import-map cycle).
2. Render each variant with the explanatory format from
   Decision 7.
3. Tests: verify every error path produces a message that names
   the tier(s) tried.

### Phase 5: Integration tests

1. Build a minimal consumer project at `test/fixtures/consumer-project/`
   that uses `(import-macros "jsr:@lykn/testing" ...)`.
2. Run the full pipeline: `lykn build --dist` on testing,
   `lykn test` on the consumer.
3. Add CI coverage for the cross-package case.

### Phase 6: Documentation

1. Update `docs/guides/12-deno/12-04-publishing.md` with a
   "consuming a macro package" section.
2. Update or create `docs/guides/macro-authoring.md` with a
   specifier-style reference.
3. Update the book's macro chapter to mention the three
   specifier forms.
4. Update `CLAUDE.md` and the relevant conversation bootstrap
   documents.
