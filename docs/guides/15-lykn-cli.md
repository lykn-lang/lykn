# lykn CLI

The lykn command-line tool: compiling, formatting, and syntax checking
`.lykn` source files. The CLI is a single Rust binary with no runtime
dependencies.

---

## ID-00: `lykn new` — Create a New Project

**Strength**: SHOULD

**Summary**: Create a new lykn project with the workspace convention.

```sh
lykn new my-app
cd my-app
./bin/lykn run packages/my-app/mod.lykn
```

**Generated structure**:

```
my-app/
├── project.json              ← workspace root
├── README.md
├── LICENSE                    ← Apache-2.0
├── bin/
│   └── lykn                   ← project-local CLI binary
├── packages/
│   └── my-app/
│       ├── deno.json          ← package config (name, version, exports, lykn.kind)
│       └── mod.lykn           ← entry point
├── test/
│   └── mod_test.lykn          ← starter test (using @lykn/testing DSL)
└── .gitignore
```

When `lykn new` is run from a source checkout before the matching
`@lykn/testing` package has been published, it may also write a gitignored
`project.local.json` overlay that points the starter test macros at the local
checkout. The committed `project.json` remains registry-oriented.

**Options**:

| Flag | Description |
|------|-------------|
| `--path DIR` | Create in a specific parent directory |

**Name rules**: kebab-case only — lowercase letters, digits, hyphens.
Must start with a letter.

The generated project is immediately runnable (`./bin/lykn run`) and
testable (`./bin/lykn test`). Git is initialized automatically.

---

## ID-01: Install — Build from Source

**Strength**: MUST

```sh
# Build the release binary
cargo build --release

# Copy to project bin/
mkdir -p bin/
cp target/release/lykn bin/

# Verify
./bin/lykn --version
```

The lykn binary is self-contained. No runtime dependencies, no Deno
or Node.js required for compilation.

---

## ID-02: `lykn compile` — Compile `.lykn`/`.lyk` to JavaScript

**Strength**: MUST

```sh
# Output to stdout
lykn compile packages/myapp/main.lykn

# Output to file
lykn compile packages/myapp/main.lykn -o target/lykn/build/myapp/main.js

# Strip type checks and contracts (production)
lykn compile packages/myapp/main.lykn --strip-assertions -o target/lykn/build/myapp/main.js

# Output kernel JSON (debugging)
lykn compile packages/myapp/main.lykn --kernel-json
```

**Options**:

| Flag | Description |
|------|-------------|
| `-o`, `--output FILE` | Write to file (default: stdout) |
| `--strip-assertions` | Remove type checks and contracts |
| `--kernel-json` | Output kernel S-expression JSON |

**Note**: `lykn compile` operates on a single file and is best treated as a
low-level command reference. For normal multi-file projects, use `lykn build`.
If you need a one-off debug loop, keep generated files under `target/lykn/`:

```sh
# Compile all .lykn files
for f in packages/myapp/**/*.lykn; do
  out="target/lykn/build/myapp/${f#packages/myapp/}"
  out="${out%.lykn}.js"
  mkdir -p "$(dirname "$out")"
  lykn compile "$f" -o "$out"
done
```

---

## ID-03: `lykn fmt` — Format `.lykn`/`.lyk` Source

**Strength**: SHOULD

```sh
# Preview formatted output (stdout)
lykn fmt packages/myapp/main.lykn

# Format in place
lykn fmt -w packages/myapp/main.lykn

# Format multiple files
lykn fmt -w packages/myapp/auth/*.lykn
```

The formatter handles S-expression indentation with 80-character line
width. This formats the `.lykn` source — for formatting compiled JS
output, use \`deno fmt\`.

---

## ID-04: `lykn check` — Syntax Check

**Strength**: SHOULD

```sh
# Check a single file
lykn check packages/myapp/main.lykn

# Check multiple files
lykn check packages/myapp/**/*.lykn
```

`lykn check` parses and analyzes the source without producing output.
It reports:
- Syntax errors
- Unused bindings (warnings)
- Missing type annotations
- Unknown surface forms

Use it in CI to catch issues before compilation.

---

## ID-04a: `lykn run` — Run `.lykn`/`.lyk` or `.js` Files

**Strength**: SHOULD

**Summary**: Run a file directly via Deno. Workspace package `.lykn`/`.lyk`
files are built into `target/lykn/build/<pkg>/` first, then executed from
that generated path so relative imports resolve beside the rest of the package
build output. Source files outside a workspace package are compiled under
`target/lykn/run/` when a project root exists, otherwise to a temporary `.js`
file.

```sh
# No permissions are added by lykn; Deno can prompt interactively
lykn run packages/myapp/main.lykn

# Grant only the access the program needs; fail instead of prompting
lykn run --no-prompt --allow-read=./data --allow-write=./output packages/myapp/main.lykn

# The same options apply to compiler-generated JavaScript
lykn run --no-prompt --allow-read=./data target/lykn/build/myapp/main.js

# Runtime options precede FILE; everything after FILE belongs to the script
lykn run --allow-net=localhost:3000 packages/myapp/main.lykn -- --port 3000
```

Usage: `lykn run [OPTIONS] FILE [ARGS]...`. Lykn adds **no permission grants**
by default. Missing access follows Deno's ordinary prompting policy; use
`--no-prompt` for deterministic permission failures in unattended work.
These permissions constrain the launched program, not the compiler's file access.

For each of `read`, `write`, `net`, `env`, `run`, `sys`, `ffi`, and `import`,
Lykn accepts `--allow-NAME` and `--deny-NAME`, either bare or with `=LIST`.
A bare flag applies to the category; a list scopes it. Scope values require
`=` so a bare flag cannot consume FILE. Quote scopes containing spaces, for
example `--allow-read="./input data"`. Repeated scoped flags accumulate, as in
`--allow-read=./config --allow-read=./data`. As in Deno, when a bare occurrence
is mixed with scoped occurrences, the supplied scopes determine access.
An empty `=LIST` is passed through for Deno to reject, never broadened.
Explicit deny flags exclude resources from a grant.

`-A` / `--allow-all` grants all permissions only when explicitly requested.
`--cached-only` requires cached remote dependencies; `--frozen` (equivalent to
`--frozen=true`) and `--frozen=false` control lockfile enforcement. Deno validates
scope values and reports options unsupported by the installed runtime.

Everything after FILE, including `--allow-read`, `-A`, or `--help`, is a script
argument and cannot grant runtime access. An optional `--` immediately after
FILE is consumed as the script separator; subsequent `--` arguments are passed
through. Use `--` before FILE to select a filename beginning with `-`.
The child process's exit code is returned by Lykn.

The CLI discovers `project.json` from the current directory and passes it with
`--config`. When a local import overlay is present, it passes the generated
effective configuration instead. This run contract does not change the separate
`lykn test` permission policy.

---

## ID-04b: `lykn test` — Run Tests

**Strength**: SHOULD

**Summary**: Run tests via Deno's test runner.

```sh
# Run all tests
lykn test

# Run specific test directory
lykn test test/forms/

# Run a single test file
lykn test test/surface/func.test.js

# Test Markdown docs; extracts `lykn` fences by default
lykn test --docs docs/guides/

# Opt into another Markdown fence tag for docs mode
lykn test --docs src --fence lisp
```

Wraps `deno test --config project.json --no-check -A`.

---

## ID-04c: `lykn lint` — Lint lykn Source (anti-patterns)

**Strength**: SHOULD

**Summary**: Lint `.lykn` **source** for anti-patterns and non-idiomatic
style — it judges what you *wrote* (pre-expansion), not the compiled JS.
Findings map to the `09-anti-patterns.md` catalog: every entry there labelled
**Linted (`rule`)** is a rule here.

```sh
# Lint files or directories (recurses; .lykn only)
lykn lint packages/ examples/ test/

# JSON output, for editors / tooling
lykn lint --format=json src/app.lykn
```

**Rule set** (16 rules; see `09-anti-patterns.md` for each rule's fix):
`no-require`, `no-eval`, `no-new-wrappers`, `global-isnan`, `no-arguments`,
`no-iife`, `no-delete-on-array`, `no-json-deep-copy`,
`prefer-surface-operators`, `or-for-defaults`, `for-in-on-arrays`,
`parseint-radix`, `sort-without-comparator`, `shadowing` (accidental shadowing
of an enclosing binding), plus two test-file conventions
(`no-relative-source-imports`, `no-dirname-fixtures`). The linter is
**resolution-aware**: a lexically-bound name that matches a rule's trigger (a
param named `parseInt`) is a call to your binding, not a finding.

**Exit codes**: `0` clean · `1` findings · `2` usage / I-O error (a path that
doesn't exist, or a `.lykn` file that fails to parse — run `lykn check` first).
`.lyk` kernel files are **exempt** (kernel style is its own idiom).

> Per-finding inline suppression (a `; disable` comment) is not yet available —
> it needs source comment retention. Scope with paths in the meantime.

> **Not** `deno lint`: that lints the *compiled JS* and is run separately
> (`make lint` invokes both). `lykn lint` is the lykn-source linter.

---

## ID-04d: `lykn dist` — Stage Packages for Publishing

**Strength**: SHOULD

**Summary**: Stage all workspace members into `target/lykn/dist/<pkg>/`
with generated `deno.json` and `package.json`, ready for both JSR and
npm. `lykn build` remains the local build step and writes intermediate
artifacts to `target/lykn/build/<pkg>/`.

```sh
lykn build
lykn dist
```

Each package is staged according to its kind (set via `lykn.kind` in
the package's `deno.json`):

| Kind | `lykn.kind` value | What gets staged |
|------|-------------------|------------------|
| **Runtime** | `"runtime"` | `.js` files with workspace imports rewritten to `@lykn/` scope |
| **Macro module** | `"macro-module"` | All files (`.lykn`/`.lyk` + `.js`), plus a generated `mod.js` stub |
| **Tooling** | `"tooling"` | Same as runtime |

**Staging scope**: `lykn dist` stages from each workspace member's
package root (the directory containing its `deno.json`). Place package
entry points and directly-staged source files at the package root, not
under a top-level `src/` wrapper.

Example package `deno.json` with lykn metadata:

```json
{
    "name": "@lykn/testing",
    "version": "0.5.2",
    "exports": "./mod.lykn",
    "lykn": {
        "kind": "macro-module",
        "macroEntry": "mod.lykn"
    }
}
```

`lykn build --dist` is a deprecated alias for `lykn dist`. It remains
accepted in 0.6.x for migration, but new docs and workflows should use
`lykn dist`.

---

## ID-04e: `lykn publish` — Publish Packages

**Strength**: SHOULD

**Summary**: Publish to JSR, npm, or both. Automatically runs
`lykn dist` first unless `--no-build` is passed. Publishing refuses to
run with uncommitted changes unless `--allow-dirty` is passed
explicitly.

```sh
# Publish to JSR (default)
lykn publish --jsr

# Publish to npm
lykn publish --npm

# Dry run (verify without publishing)
lykn publish --jsr --dry-run
lykn publish --npm --dry-run

# Skip staging (assume target/lykn/dist/ is already staged)
lykn publish --jsr --no-build

# Override the dirty-tree safety gate when you intentionally need to publish
# with uncommitted changes
lykn publish --jsr --allow-dirty
```

### Note: `target/lykn/dist/` and the JSR publishing flow

JSR's `deno publish` operates on git-tracked files — gitignored files are excluded from the published package. This can create tension:
a developer may want compiled `.js` artifacts gitignored to keep
`git status` clean, but JSR needs them tracked.

The scaffold resolves this by treating `target/lykn/dist/` as generated
publish staging. `lykn publish --jsr` reads from `target/lykn/dist/`
directly via the filesystem, not via git, so gitignore exclusions do
not affect publishing. Source `.lykn` and source package `deno.json`
files remain tracked normally.

The dirty-tree gate is separate from generated staging: publish refuses
to run when tracked or untracked files are present so the shipped source
state is auditable. Use `--allow-dirty` only for an intentional,
reviewed exception.

---

## ID-05: `--strip-assertions` for Production Builds

**Strength**: SHOULD

**Summary**: Remove all type checks and `:pre`/`:post` contracts from
compiled output for zero-overhead production builds.

```lykn
;; Source
(func add
  :args (:number a :number b)
  :returns :number
  :pre (and (>= a 0) (>= b 0))
  :body (+ a b))
```

---

## ID-06: The Full Build Pipeline

**Strength**: MUST

```sh
# 1. Format lykn source
lykn fmt -w packages/myapp/main.lykn

# 2. Check syntax
lykn check packages/myapp/main.lykn

# 3. Build for distribution
lykn build
lykn dist

# 4. Run tests
lykn test

# 5. Run
lykn run packages/myapp/main.lykn
```

A typical `Makefile`:

```makefile
.PHONY: build test check fmt

build:
	lykn build

test: build
	lykn test

check: build
	lykn test

dist: build
	lykn dist

fmt:
	lykn fmt -w packages/myapp/*.lykn
```

---

## ID-07: `--kernel-json` for Debugging

**Strength**: CONSIDER

```sh
# See the kernel S-expressions as JSON (before JS codegen)
lykn compile packages/myapp/main.lykn --kernel-json
```

Useful for debugging macro expansions and surface-to-kernel
transformations. The output shows the intermediate representation
that the JS codegen consumes.

---

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `lykn new NAME` | Create new project |
| `lykn compile FILE` | Compile to JS (stdout) |
| `lykn compile FILE -o OUT` | Compile to file |
| `lykn compile FILE --strip-assertions` | Production build |
| `lykn compile FILE --kernel-json` | Debug kernel output |
| `lykn fmt FILE` | Preview formatted source |
| `lykn fmt -w FILE` | Format in place |
| `lykn check FILE` | Syntax check |
| `lykn run FILE` | Run .lykn or .js file |
| `lykn test [PATTERNS]` | Run tests via Deno |
| `lykn test --docs GLOB [--fence TAG]` | Test Markdown docs; `--fence` is opt-in and repeatable |
| `lykn lint [PATHS]` | Lint lykn **source** for anti-patterns (see `09-anti-patterns.md`) |
| `lykn build` | Build workspace packages to `target/lykn/build/` |
| `lykn dist` | Stage publishable packages in `target/lykn/dist/` |
| `lykn publish --jsr` | Publish to JSR |
| `lykn publish --npm` | Stage + publish to npm |
| `lykn publish --dry-run` | Check without publishing |
| `lykn --version` | Show version |

---

## Related Guidelines

- **Project Structure**: See `10-project-structure.md` ID-26 for the
  compilation pipeline
- **Type Discipline**: See `05-type-discipline.md` ID-30 for
  `--strip-assertions`
- **Deno Runtime**: See `12-deno/12-01-runtime-basics.md` for
  `deno lint` and `deno fmt` on compiled output
- **Surface Forms Reference**: See `00-lykn-surface-forms.md` for the
  complete surface form catalog
