# Biome Setup

Biome configuration for lykn projects. Biome operates on compiled
JavaScript output — not on `.lykn` source files. It replaces both
ESLint and Prettier with a single tool.

For the full treatment, see the JS guide `13-biome/13-01-setup.md`.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output.

---

## ID-01: One Tool Replaces ESLint + Prettier

**Strength**: MUST

```sh
# Install (macOS)
brew install biome

# Lint + format in one pass
biome check --write dist/

# Lint only
biome lint dist/

# Format only
biome format --write dist/
```

---

## ID-02: Biome Operates on Compiled JS, Not `.lykn` Source

**Strength**: MUST

The pipeline: `.lykn` → `lykn compile` → `.js` → `biome format` →
final `.js` output.

Biome cannot read `.lykn` files. Configure it to operate on the `dist/`
or `src/` directory where compiled `.js` files live.

---

## ID-03: `biome.json` Configuration

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  }
}
```

---

## ID-04: Integrate with Deno Tasks

```json
{
  "tasks": {
    "fmt": "biome format --write dist/",
    "lint": "biome lint dist/",
    "check": "biome check --write dist/"
  }
}
```

---

## ID-05: CI Integration

```sh
# CI — check without writing (exits non-zero on issues)
biome check dist/
```

---

## Related Guidelines

- **No-Node Boundary**: See `14-no-node-boundary.md` ID-08, ID-22
- **Project Structure**: See `10-project-structure.md` ID-15
- **Lint Rules**: See `13-biome/13-02-lint-rules.md`
- **Formatting**: See `13-biome/13-03-formatting.md`
