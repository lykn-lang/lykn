# Biome Lint Rules

Biome lint rules relevant to lykn's compiled JavaScript output. Biome
lints the `.js` files produced by `lykn compile`, catching issues in
the generated code.

For the full treatment, see the JS guide `13-biome/13-02-lint-rules.md`.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output.

---

## ID-01: Use `recommended` Rules as Baseline

**Strength**: SHOULD

```json
{
  "linter": {
    "rules": { "recommended": true }
  }
}
```

The `recommended` preset catches common JS issues in compiled output.

---

## ID-02: Key Rules for lykn Compiled Output

Since lykn compiles to specific JS patterns, some Biome rules are
particularly relevant:

| Rule | Why it matters for lykn |
|------|------------------------|
| `noDoubleEquals` | Should never appear (DD-22: `=` → `===`) |
| `noVar` | Should never appear (`bind` → `const`) |
| `useExhaustiveSwitchCases` | Relevant if using kernel `switch` |
| `noUnusedVariables` | Catches dead code in compiled output |
| `noConsole` | Optional — disable for CLI/logging code |

---

## ID-03: Suppressing Rules for Generated Code

If Biome flags patterns in lykn's compiled output that are intentional
(e.g., gensym variable names), use targeted suppression in
`biome.json`:

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

---

## Related Guidelines

- **Biome Setup**: See `13-biome/13-01-setup.md`
- **Biome Formatting**: See `13-biome/13-03-formatting.md`
- **Anti-Patterns**: See `09-anti-patterns.md` for patterns Biome catches
