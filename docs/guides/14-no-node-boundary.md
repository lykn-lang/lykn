# No-Node Boundary

The consolidated reference for every Node.js pattern this project avoids
and its Deno replacement. This is a practical boundary specification:
"In this project, here's what we use instead." Each entry states the
Node.js pattern, names the Deno replacement, and cross-references the
guide that covers it in detail. lykn compiles to Deno-native ESM — all
these boundaries apply equally to lykn's compiled output.

Target environment: **Deno**, **ESM-only**, **`deno lint` + `deno fmt`** on compiled
output, lykn/surface syntax throughout.

---

## ID-01: No `require()` — ESM `import` Only

**Strength**: MUST-AVOID

**Summary**: `require()` does not exist in Deno ESM modules. lykn
compiles exclusively to ESM.

```lykn
;; Good — ESM import
(import "./utils.js" (transform))
(bind text (await (Deno:readTextFile "./data.txt")))
```

**See also**: `01-core-idioms.md` ID-08, `09-anti-patterns.md` ID-33

---

## ID-02: No `module.exports` — Use `export`

**Strength**: MUST-AVOID

```lykn
;; Good — ESM export
(export (func parse :args (:string input) :returns :any :body (JSON:parse input)))
(export (func stringify :args (:any data) :returns :string :body (JSON:stringify data)))
```

---

## ID-03: No Extensionless Imports — File Extensions Required

**Strength**: MUST-AVOID

**Summary**: Deno resolves imports like a browser — no extension
guessing, no `index.js` resolution.

```lykn
;; Good — explicit extension
(import "./parser.js" (parse))
(import "./lib/mod.js" (utils))
```

---

## ID-04: No `index.js` — Use `mod.js` (or `mod.lykn`)

**Strength**: SHOULD-AVOID

**See also**: `10-project-structure.md` ID-08

---

## ID-05: No `package.json` — Use `deno.json`

**Strength**: MUST-AVOID

**Summary**: `deno.json` replaces `package.json`, `tsconfig.json`,
`.eslintrc`, and `.prettierrc`. Lint and format config goes in `deno.json`.

**See also**: `10-project-structure.md` ID-15

---

## ID-06: No `node_modules` — Deno Uses a Global Cache

**Strength**: MUST-AVOID

**Summary**: `jsr:` and `npm:` specifiers resolve on demand.

---

## ID-07: No `npm install` / `npm run` — Use `deno add` / `deno task`

**Strength**: MUST-AVOID

---

## ID-08: No `.eslintrc` / `.prettierrc` — Use `deno.json`

**Strength**: MUST-AVOID

**See also**: `13-biome/01-setup.md`

---

## ID-09: No `tsconfig.json` — Use `compilerOptions` in `deno.json`

**Strength**: MUST-AVOID

---

## ID-10: No `process.env` — Use `Deno:env:get`

**Strength**: SHOULD-AVOID

```lykn
;; Good — Deno namespace + ?? for defaults
(bind port (Number (?? (Deno:env:get "PORT") "8080")))
```

Requires `--allow-env`.

---

## ID-11: No `process.argv` — Use `Deno:args`

**Strength**: SHOULD-AVOID

```lykn
(bind args Deno:args)
```

---

## ID-12: No `__dirname` / `__filename` — Use `import:meta`

**Strength**: SHOULD-AVOID

```lykn
(bind config-path (template import:meta:dirname "/config.json"))
```

---

## ID-13: No `Buffer` — Use `Uint8Array` + `TextEncoder`/`TextDecoder`

**Strength**: SHOULD-AVOID

```lykn
(bind bytes ((new TextEncoder):encode "hello"))
(bind str ((new TextDecoder):decode bytes))
```

---

## ID-14: No `fs.readFile` — Use `Deno:readTextFile`

**Strength**: SHOULD-AVOID

```lykn
(bind text (await (Deno:readTextFile "./data.txt")))
(await (Deno:writeTextFile "./output.txt" result))
```

Requires `--allow-read`, `--allow-write`.

---

## ID-15: No `http.createServer` — Use `Deno:serve`

**Strength**: SHOULD-AVOID

```lykn
(Deno:serve (fn (:any req) (new Response "Hello")))
```

Requires `--allow-net`.

---

## ID-16: No `child_process` — Use `Deno:Command`

**Strength**: SHOULD-AVOID

```lykn
(bind cmd (new Deno:Command "git" (obj :args #a("log" "--oneline"))))
(bind output (await (cmd:output)))
(console:log ((new TextDecoder):decode output:stdout))
```

Requires `--allow-run`.

---

## ID-17: No Node Streams — Use Web Streams API

**Strength**: SHOULD-AVOID

```lykn
(bind file (await (Deno:open "large-file.txt")))
(for-await-of chunk file:readable
  (process chunk))
(file:close)
```

**See also**: `07-async-concurrency.md` ID-27

---

## ID-18: No `EventEmitter` — Use `EventTarget`

**Strength**: SHOULD-AVOID

```lykn
(bind target (new EventTarget))
(target:addEventListener "data"
  (fn (:any e) (handle e:detail)))
(target:dispatchEvent
  (new CustomEvent "data" (obj :detail (obj :id 1))))
```

---

## ID-19: No Error-First Callbacks — Use `async`/`await`

**Strength**: MUST-AVOID

**See also**: `07-async-concurrency.md` ID-09

---

## ID-20: No `process.nextTick` — Use `queueMicrotask`

**Strength**: SHOULD-AVOID

```lykn
(queueMicrotask (fn () (do-work)))
```

**See also**: `07-async-concurrency.md` ID-04

---

## ID-21: No Jest / Mocha / Vitest — Use `Deno:test` + `@std/assert`

**Strength**: MUST-AVOID

**Summary**: Deno has a built-in test runner. Tests run on compiled JS.

**See also**: `12-deno/02-testing.md`

---

## ID-22: No ESLint / No Prettier — Use `deno lint` + `deno fmt`

**Strength**: MUST-AVOID

**See also**: `13-biome/01-setup.md`

---

## ID-23: No `npx` — Use `deno run` with Specifiers

**Strength**: SHOULD-AVOID

---

## ID-24: `npm:` Specifier — The Acceptable Escape Hatch

**Strength**: CONSIDER-AVOIDING

**Summary**: Use `npm:` for packages with no JSR equivalent.

```lykn
;; Acceptable — no JSR equivalent
(import "npm:chalk@5" chalk)

;; Preferred — JSR package available
(import "jsr:@std/assert@^1.0.0" (assert-equals))
```

---

## ID-25: `node:` Specifier — Available but Not Preferred

**Strength**: CONSIDER-AVOIDING

**Summary**: Deno provides `node:` shims for compatibility. Prefer
Deno/Web APIs for new code.

---

## ID-26: `nodeModulesDir` — Last Resort for Compat

**Strength**: CONSIDER-AVOIDING

**Summary**: Only when a framework or native addon requires a local
`node_modules` directory.

---

---

## Best Practices Summary

### Quick Reference Table

| ID | Avoid | Strength | Replacement |
|----|-------|----------|-------------|
| 01 | `require()` | MUST-AVOID | ESM `import` |
| 02 | `module.exports` | MUST-AVOID | ESM `export` |
| 03 | Extensionless imports | MUST-AVOID | Explicit `.js` |
| 04 | `index.js` | SHOULD-AVOID | `mod.js` |
| 05 | `package.json` | MUST-AVOID | `deno.json` |
| 06 | `node_modules` | MUST-AVOID | Global cache |
| 07 | `npm install`/`npm run` | MUST-AVOID | `deno add`/`deno task` |
| 27 | `npm publish` | MUST-AVOID | `lykn publish --npm` |
| 08 | `.eslintrc`/`.prettierrc` | MUST-AVOID | `deno.json` |
| 09 | `tsconfig.json` | MUST-AVOID | `deno.json` |
| 10 | `process.env` | SHOULD-AVOID | `Deno:env:get` |
| 11 | `process.argv` | SHOULD-AVOID | `Deno:args` |
| 12 | `__dirname`/`__filename` | SHOULD-AVOID | `import:meta` |
| 13 | `Buffer` | SHOULD-AVOID | `Uint8Array` + encoders |
| 14 | `fs.readFile` | SHOULD-AVOID | `Deno:readTextFile` |
| 15 | `http.createServer` | SHOULD-AVOID | `Deno:serve` |
| 16 | `child_process` | SHOULD-AVOID | `Deno:Command` |
| 17 | Node streams | SHOULD-AVOID | Web Streams API |
| 18 | `EventEmitter` | SHOULD-AVOID | `EventTarget` |
| 19 | Error-first callbacks | MUST-AVOID | `async`/`await` |
| 20 | `process.nextTick` | SHOULD-AVOID | `queueMicrotask` |
| 21 | Jest/Mocha/Vitest | MUST-AVOID | `Deno:test` |
| 22 | ESLint + Prettier | MUST-AVOID | `deno lint` + `deno fmt` |
| 23 | `npx` | SHOULD-AVOID | `deno run npm:tool` |
| 24 | `npm:` (when JSR exists) | CONSIDER-AVOIDING | `jsr:` |
| 25 | `node:` built-ins | CONSIDER-AVOIDING | Deno/Web APIs |
| 26 | `nodeModulesDir` | CONSIDER-AVOIDING | Global cache |

### Node.js → Deno Replacement Table

| Category | Node.js | Deno/lykn |
|----------|---------|-----------|
| **Modules** | `require("./mod")` | `(import "./mod.js" (...))` |
| | `module.exports` | `(export ...)` |
| | `index.js` | `mod.js` / `mod.lykn` |
| **Config** | `package.json` | `deno.json` |
| | `tsconfig.json` | `deno.json` `compilerOptions` |
| | `.eslintrc` + `.prettierrc` | `deno.json` |
| | `node_modules` | Global cache |
| | `npm install` | `deno add` |
| | `npm run` | `deno task` |
| **Globals** | `process.env.X` | `(Deno:env:get "X")` |
| | `process.argv.slice(2)` | `Deno:args` |
| | `__dirname` | `import:meta:dirname` |
| | `Buffer.from(str)` | `((new TextEncoder):encode str)` |
| **I/O** | `fs.readFile` | `(Deno:readTextFile path)` |
| | `fs.writeFile` | `(Deno:writeTextFile path data)` |
| **Network** | `http.createServer` | `(Deno:serve handler)` |
| | `child_process.exec` | `(new Deno:Command ...)` |
| **Streams** | Node `Readable`/`Writable` | `ReadableStream`/`WritableStream` |
| **Events** | `EventEmitter` | `EventTarget` + `CustomEvent` |
| **Testing** | Jest / Mocha / Vitest | `Deno:test` + `@std/assert` |
| **Linting** | ESLint | `deno lint` |
| **Formatting** | Prettier | `deno fmt` |
| **Registry** | npm | JSR (`jsr:`) preferred |

---

## Related Guidelines

- **Core Idioms**: See `01-core-idioms.md` for ESM (ID-08), Deno-first
  (ID-20)
- **Async & Concurrency**: See `07-async-concurrency.md` for Web Streams
  (ID-27-29), `queueMicrotask` (ID-04)
- **Anti-Patterns**: See `09-anti-patterns.md` for `require()` (ID-33)
- **Project Structure**: See `10-project-structure.md` for `deno.json`
  (ID-15), `mod.js` (ID-08)
- **Deno**: See `12-deno/01-runtime-basics.md` for Deno API details
- **Linting/Formatting**: Deno's built-in `deno lint` + `deno fmt` on
  compiled output. See also `13-biome/01-setup.md` for legacy Biome docs
- **lykn CLI**: See `15-lykn-cli.md` for the lykn compilation step
