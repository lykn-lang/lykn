# Deno Publishing

Publishing lykn libraries to JSR (JavaScript Registry) and npm. lykn
source compiles to JavaScript — the compiled output is what gets
published.

For the full treatment, see the JS guide `12-deno/12-04-publishing.md`.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output.

---

## ID-01: Publish to JSR with `deno publish`

**Strength**: SHOULD

```sh
# Dry run first
deno publish --dry-run

# Publish (opens browser for auth)
deno publish
```

---

## ID-02: Publish to npm with `npm publish`

**Strength**: CONSIDER

```sh
# For npm consumers
npm publish --access public
```

Requires `package.json` with the compiled `.js` entry point.

---

## ID-03: `deno.json` `exports` Field

```json
{
  "name": "@lykn/my-lib",
  "version": "1.0.0",
  "exports": "./dist/mod.js"
}
```

The `exports` field points to compiled `.js`, not `.lykn` source.

---

## ID-04: The lykn Publishing Pipeline

```sh
# 1. Compile all source
make build

# 2. Format compiled output
biome format --write dist/

# 3. Run tests
deno test --allow-all

# 4. Publish
deno publish          # to JSR
npm publish           # to npm (if configured)
```

---

## ID-05: Version in Multiple Places

lykn projects may have versions in:
- `deno.json` — JSR version
- `package.json` — npm version
- `Cargo.toml` — Rust crate version (if Rust components exist)

Keep them in sync. See the lykn project's `Makefile` for an example
of coordinated version bumps.

---

## Related Guidelines

- **Project Structure**: See `10-project-structure.md` ID-08, ID-22
- **No-Node Boundary**: See `14-no-node-boundary.md` ID-05
