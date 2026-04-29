# Deno Publishing

Publishing lykn libraries to JSR (JavaScript Registry) and npm. lykn
source compiles to JavaScript — the compiled output is what gets
published.

For the full treatment, see the JS guide `12-deno/12-04-publishing.md`.

Target environment: **Deno**, **ESM-only**, **`deno lint` + `deno fmt`** on compiled
output.

---

## ID-01: Publish to JSR

**Strength**: SHOULD

**Use `lykn publish --jsr`** — the lykn CLI wraps `deno publish` and
runs `lykn build --dist` first to stage compiled output, generated
`jsr.json`, and copied `LICENSE`/`README.md` into `dist/`. See
[`15-lykn-cli.md`](../15-lykn-cli.md) ID-04e for the full publish
workflow.

> **Counter-cue:** if you are tempted to run `deno publish` directly
> in a lykn project, stop. The raw command bypasses `lykn build
> --dist` staging and produces a broken package.

```sh
lykn publish --jsr --dry-run
lykn publish --jsr
```

---

## ID-02: Publish to npm

**Strength**: CONSIDER

**Use `lykn publish --npm`** — the lykn CLI wraps `npm publish` and
runs `lykn build --dist` first to stage compiled output, generated
`package.json`, and copied `LICENSE`/`README.md` into `dist/`. See
[`15-lykn-cli.md`](../15-lykn-cli.md) ID-04e for the full publish
workflow.

> **Counter-cue:** if you are tempted to run `npm publish` directly
> in a lykn project, stop. The raw command bypasses `lykn build
> --dist` staging and produces a broken package.

```sh
lykn publish --npm --dry-run
lykn publish --npm
```

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
# 1. Build and stage for publishing
lykn build --dist

# 2. Dry-run to verify
lykn publish --jsr --dry-run
lykn publish --npm --dry-run

# 3. Publish
lykn publish --jsr
lykn publish --npm
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
