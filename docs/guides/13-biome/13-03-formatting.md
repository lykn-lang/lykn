# Biome Formatting

Biome formatting for lykn's compiled JavaScript output. Biome formats
the `.js` files, not the `.lykn` source. For lykn source formatting,
use `lykn fmt`.

For the full treatment, see the JS guide `13-biome/13-03-formatting.md`.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output.

---

## ID-01: Two Formatters — `lykn fmt` for Source, `biome format` for Output

**Strength**: MUST

```sh
# Format lykn source (S-expression formatting)
lykn fmt -w src/main.lykn

# Format compiled JS output (JS formatting)
biome format --write dist/
```

The lykn formatter handles S-expression indentation and line wrapping.
Biome handles JavaScript formatting conventions (semicolons, quotes,
indentation) on the compiled output.

---

## ID-02: Biome Formatter Configuration

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100,
    "quoteStyle": "double"
  },
  "javascript": {
    "formatter": {
      "semicolons": "always",
      "quoteStyle": "double",
      "trailingCommas": "all"
    }
  }
}
```

---

## ID-03: Format in the Build Pipeline

```sh
# Standard pipeline
lykn compile src/main.lykn -o dist/main.js && biome format --write dist/

# Or via Makefile
make build   # compile + format
```

---

## ID-04: Check Without Writing (CI)

```sh
# Exits non-zero if formatting issues exist
biome format dist/
```

---

## Related Guidelines

- **Biome Setup**: See `13-biome/13-01-setup.md`
- **lykn CLI**: See `15-lykn-cli.md` for `lykn fmt`
- **Project Structure**: See `10-project-structure.md` ID-26
