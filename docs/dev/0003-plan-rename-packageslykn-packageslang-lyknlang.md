# Plan: Rename packages for clean @lykn/* taxonomy

## Context

Rename packages for a clean taxonomy: `@lykn/lang` (core compiler), `@lykn/browser` (browser runtime), `@lykn/testing` (future). Two directory renames:
- `packages/lykn/` → `packages/lang/`
- `packages/lykn-browser/` → `packages/browser/`

## Changes

### 1. Directory + config

```bash
git mv packages/lykn packages/lang
git mv packages/lykn-browser packages/browser
```

**`packages/lang/deno.json`**: `"name": "@lykn/lykn"` → `"name": "@lykn/lang"`

**`packages/browser/deno.json`**: `"name": "@lykn/browser"` stays same, no change needed

**`project.json`**: 
- workspace: `"./packages/lykn"` → `"./packages/lang"`, `"./packages/lykn-browser"` → `"./packages/browser"`
- imports: `"lykn/"` → `"lang/"`, path `"./packages/lykn/"` → `"./packages/lang/"`

### 2. Test imports (86 files)

```bash
# Mechanical sed across all test files
sed -i '' 's|from "lykn/|from "lang/|g' test/**/*.test.js
```

### 3. Browser package (`packages/browser/compiler.js` — after rename)

```
from 'lykn/reader.js'    → from 'lang/reader.js'
from 'lykn/expander.js'  → from 'lang/expander.js'
from 'lykn/compiler.js'  → from 'lang/compiler.js'
```

### 4. Rust source (11 references)

| File | Line(s) | Change |
|------|---------|--------|
| `crates/lykn-lang/tests/e2e_tests.rs` | 71-72 | `packages/lykn/` → `packages/lang/` |
| `crates/lykn-lang/tests/cross_compiler.rs` | 69-70 | `packages/lykn/` → `packages/lang/` |
| `crates/lykn-lang/src/expander/env.rs` | 83-84 | `packages/lykn/` → `packages/lang/` |
| `crates/lykn-cli/src/bridge.rs` | 21, 54, 93 | `packages/lykn/` → `packages/lang/` |
| `crates/lykn-cli/src/main.rs` | 557 | esbuild plugin: `"packages/lykn/"` → `"packages/lang/"` |
| `crates/lykn-cli/src/main.rs` | ~542 | esbuild entry: `"packages/lykn-browser/"` → `"packages/browser/"` |
| `crates/lykn-cli/src/main.rs` | 682 | comment: `"lykn/"` → `"lang/"` |
| `crates/lykn-cli/src/main.rs` | 733-734 | npm rewrite: `from 'lykn/` → `from 'lang/`, then `@lykn/lang` |

### 5. npm build import rewriting

In `build_npm_for_package` — the generic rewrite logic currently replaces `from 'lykn/` with `from '@lykn/lykn/`. After rename:
- Import map key is `lang/`
- npm rewrite: `from 'lang/` → `from '@lykn/lang/`

This should work generically since the rewrite reads the workspace import map from project.json. But verify the hardcoded `@lykn/lykn` references are gone.

### 6. `lykn new` templates

The `lykn new` command generates `project.json` with an import map keyed on the project name. No changes needed — it already uses `{name}/` dynamically. But the generated `deno.json` uses `@{name}/{name}` which is fine for user projects.

### 7. Docs

| File | Change |
|------|--------|
| `README.md` | `packages/lykn/` → `packages/lang/`, `@lykn/lykn` → `@lykn/lang`, fix browser ref to `packages/browser/` |
| `AGENTS.md` | `packages/lykn/` → `packages/lang/`, `@lykn/lykn` → `@lykn/lang` |

## Verification

```bash
# Tests
deno test --config project.json --no-check -A test/
cargo test -p lykn-lang
cargo clippy

# Browser bundle
lykn build --browser

# npm packages
lykn publish --npm --dry-run
# Should show @lykn/lang and @lykn/browser

# JSR
lykn publish --jsr --dry-run

# Run
echo '(console:log "hello")' > /tmp/t.lykn && lykn run /tmp/t.lykn
```

## Key files (count: ~100)

- 86 test files (mechanical sed)
- `packages/lang/deno.json` (rename)
- `packages/browser/` (directory rename)
- `project.json` (3 lines)
- `packages/browser/compiler.js` (3 imports)
- 4 Rust source files (11 line changes)
- 2 doc files (README, AGENTS.md)
