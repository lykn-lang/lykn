# lykn CLI

The lykn command-line tool: compiling, formatting, and syntax checking
`.lykn` source files. The CLI is a single Rust binary with no runtime
dependencies.

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

## ID-02: `lykn compile` — Compile `.lykn` to JavaScript

**Strength**: MUST

```sh
# Output to stdout
lykn compile src/main.lykn

# Output to file
lykn compile src/main.lykn -o dist/main.js

# Strip type checks and contracts (production)
lykn compile src/main.lykn --strip-assertions -o dist/main.js

# Output kernel JSON (debugging)
lykn compile src/main.lykn --kernel-json
```

**Options**:

| Flag | Description |
|------|-------------|
| `-o`, `--output FILE` | Write to file (default: stdout) |
| `--strip-assertions` | Remove type checks and contracts |
| `--kernel-json` | Output kernel S-expression JSON |

**Note**: `lykn compile` operates on a single file. For multi-file
projects, use a Makefile or shell loop:

```sh
# Compile all .lykn files
for f in src/**/*.lykn; do
  out="dist/${f#src/}"
  out="${out%.lykn}.js"
  mkdir -p "$(dirname "$out")"
  lykn compile "$f" -o "$out"
done
```

---

## ID-03: `lykn fmt` — Format `.lykn` Source

**Strength**: SHOULD

```sh
# Preview formatted output (stdout)
lykn fmt src/main.lykn

# Format in place
lykn fmt -w src/main.lykn

# Format multiple files
lykn fmt -w src/auth/*.lykn
```

The formatter handles S-expression indentation with 80-character line
width. This formats the `.lykn` source — for formatting compiled JS
output, use `biome format`.

**See also**: `13-biome/13-03-formatting.md` for JS output formatting.

---

## ID-04: `lykn check` — Syntax Check

**Strength**: SHOULD

```sh
# Check a single file
lykn check src/main.lykn

# Check multiple files
lykn check src/**/*.lykn
```

`lykn check` parses and analyzes the source without producing output.
It reports:
- Syntax errors
- Unused bindings (warnings)
- Missing type annotations
- Unknown surface forms

Use it in CI to catch issues before compilation.

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

**Development** (`lykn compile`):

```js
function add(a, b) {
  if (typeof a !== "number" || Number.isNaN(a))
    throw new TypeError("add: arg 'a' expected number, got " + typeof a);
  if (typeof b !== "number" || Number.isNaN(b))
    throw new TypeError("add: arg 'b' expected number, got " + typeof b);
  if (!(a >= 0 && b >= 0))
    throw new Error("add: pre-condition failed: ...");
  const result__gensym0 = a + b;
  if (typeof result__gensym0 !== "number" || Number.isNaN(result__gensym0))
    throw new TypeError("add: return value expected number, got " + typeof result__gensym0);
  return result__gensym0;
}
```

**Production** (`lykn compile --strip-assertions`):

```js
function add(a, b) {
  return a + b;
}
```

---

## ID-06: The Full Build Pipeline

**Strength**: MUST

```sh
# 1. Format lykn source
lykn fmt -w src/main.lykn

# 2. Check syntax
lykn check src/main.lykn

# 3. Compile to JS
lykn compile src/main.lykn -o dist/main.js

# 4. Format compiled JS
biome format --write dist/

# 5. Lint compiled JS
biome lint dist/

# 6. Run tests
deno test test/

# 7. Run
deno run --allow-net dist/main.js
```

A typical `Makefile`:

```makefile
.PHONY: build test check fmt

build:
	lykn compile src/main.lykn -o dist/main.js
	biome format --write dist/

test: build
	deno test --allow-all

check: build
	biome check dist/
	deno test --allow-all

fmt:
	lykn fmt -w src/*.lykn
	biome format --write dist/
```

---

## ID-07: `--kernel-json` for Debugging

**Strength**: CONSIDER

```sh
# See the kernel S-expressions as JSON (before JS codegen)
lykn compile src/main.lykn --kernel-json
```

Useful for debugging macro expansions and surface-to-kernel
transformations. The output shows the intermediate representation
that the JS codegen consumes.

---

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `lykn compile FILE` | Compile to JS (stdout) |
| `lykn compile FILE -o OUT` | Compile to file |
| `lykn compile FILE --strip-assertions` | Production build |
| `lykn compile FILE --kernel-json` | Debug kernel output |
| `lykn fmt FILE` | Preview formatted source |
| `lykn fmt -w FILE` | Format in place |
| `lykn check FILE` | Syntax check |
| `lykn --version` | Show version |

---

## Related Guidelines

- **Project Structure**: See `10-project-structure.md` ID-26 for the
  compilation pipeline
- **Type Discipline**: See `05-type-discipline.md` ID-30 for
  `--strip-assertions`
- **Biome Formatting**: See `13-biome/13-03-formatting.md` for JS
  output formatting
- **Surface Forms Reference**: See `00-lykn-surface-forms.md` for the
  complete surface form catalog
