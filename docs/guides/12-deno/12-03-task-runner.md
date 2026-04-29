# Deno Task Runner

Using `deno task` for lykn project scripts. Tasks are defined in
`deno.json` and replace `npm run` / `npm scripts`.

For the full treatment, see the JS guide `12-deno/12-03-task-runner.md`.

Target environment: **Deno**, **ESM-only**, **`deno lint` + `deno fmt`** on compiled
output.

---

## ID-01: Define Tasks in `deno.json`

**Strength**: SHOULD

```json
{
  "tasks": {
    "build": "make build",
    "dev": "deno run --watch --allow-net dist/main.js",
    "test": "make build && deno test --allow-all",
    "check": "make build && deno lint dist/ && deno test --allow-all",
    "bench": "make build && deno bench",
    "fmt": "deno fmt dist/"
  }
}
```

---

## ID-02: `deno task` Replaces `npm run`

```sh
deno task build     # compile lykn + format
deno task test      # compile + test
deno task check     # compile + lint + test
deno task dev       # watch mode
```

---

## ID-03: lykn Build Tasks

A typical Makefile for lykn projects:

```makefile
build:
	lykn compile src/main.lykn -o dist/main.js
	deno fmt dist/

test: build
	deno test --allow-all

check: build
	deno lint dist/
	deno test --allow-all
```

---

## ID-04: Watch Mode

```sh
# Watch compiled output for changes
deno task dev
# deno run --watch --allow-net dist/main.js
```

Note: `--watch` watches the compiled `.js` files. Recompile `.lykn`
sources manually or with a file watcher.

---

## Related Guidelines

- **Project Structure**: See `10-project-structure.md` ID-15
- **No-Node Boundary**: See `14-no-node-boundary.md` ID-07
