# M10 Closing Report — `.d.ts` Generation from `:type` Annotations

**CC author:** Claude Code (main context, not delegated)
**Date:** 2026-05-13

---

## Per-row ledger walk

### R-1 — Diagnosis addresses all 8 items
**Status:** done
**Evidence:** `workbench/m10-diagnosis-2026-05-13.md` — 8 subsections with code references.

### R-2 — Two-turn structure honored
**Status:** done
**Evidence:** Turn 1 diagnosis delivered; CDC approved; Turn 2 began after.

### R-3 — `dts.rs` exists with core emit functions
**Status:** done
**Evidence:**
```
$ grep -cE "fn emit_dts|fn lykn_type_to_ts|fn param_shape_to_ts|fn emit_func_dts|fn emit_type_dts|fn emit_bind_dts|fn emit_dts_module" crates/lykn-lang/src/emitter/dts.rs
7
```

### R-4 — Type-mapping table correct for all primitives
**Status:** done
**Evidence:** 12 unit tests in `dts.rs::tests`: `test_type_number`, `test_type_string`, `test_type_boolean`, `test_type_function` (→ `Function`), `test_type_object` (→ `object`), `test_type_array` (→ `unknown[]`), `test_type_symbol`, `test_type_bigint`, `test_type_any` (→ `unknown`), `test_type_void`, `test_type_promise` (→ `Promise<unknown>`), `test_type_user`.

### R-5 — ADT emission produces discriminated union
**Status:** done
**Evidence:** `test_emit_type_adt` — verifies `Option` with `Some` and `None` constructors produces `tag: "Some"; value: unknown` and `tag: "None"` variants. Mycelium acceptance: no ADTs in mycl-html, but the unit test covers the shape.

### R-6 — Multi-clause functions emit TS overloads
**Status:** done
**Evidence:** `test_emit_func_multi_clause_overloads` — 2-clause `greet` function produces two `export function greet(...)` declaration lines.

### R-7 — Destructured params with optional defaults
**Status:** done
**Evidence:** `test_param_destructured_object` — `{ host: string; ssl?: boolean }` with `ssl` optional because `default_value.is_some()`. `test_param_destructured_array_with_rest` — `[string, ...number[]]`.

### R-8 — Q5 warning fires for exported func without `:returns`
**Status:** done
**Evidence:** `test_emit_func_no_returns_warning` — exported function without `:returns` produces a `Severity::Warning` diagnostic and `.d.ts` contains `: unknown`. Mycelium acceptance: `render.d.ts` has `html(hiccup: unknown): string` — the `:returns :string` annotation prevents the warning; the `:any` param correctly maps to `unknown`.

### R-9 — `emitDts: false` skips emission
**Status:** done
**Evidence:** `LyknMetadata.emit_dts: Option<bool>` at config.rs:62. `compile_lykn_sources` receives `emit_dts: bool` parameter. When `false`, the `.d.ts` write block is skipped.

### R-10 — Mycelium acceptance gate
**Status:** done
**Evidence:**
```
$ cd mycelium && lykn build
@lykn/mycl built in target/lykn/build/mycl/
@lykn/mycl-html built in target/lykn/build/mycl-html/

$ cat target/lykn/build/mycl-html/mod.d.ts
export const VERSION: string;

$ cat target/lykn/build/mycl-html/render.d.ts
export function html(hiccup: unknown): string;
```

### R-11 — Empirical gates green
**Status:** done
**Evidence:**
```
$ cargo test -p lykn-lang
test result: ok. 964 passed; 0 failed (lib)
test result: ok. 22 passed; 0 failed (integration)
test result: ok. 18 passed; 0 failed (snapshot)
test result: ok. 5 passed; 0 failed (macro_expansion)
test result: ok. 1 passed; 0 failed (doctests)
```
```
$ ./target/release/lykn build && ./target/release/lykn test
ok | 1197 passed | 0 failed (8s)
```

---

## Production code path verification

For the mycelium acceptance test (`lykn build` from mycelium/):

1. **`crates/lykn-cli/src/main.rs:976`** — `cmd_build` calls `dist::build_project()`.
2. **`crates/lykn-cli/src/dist.rs:557`** — `build_project` reads `project.json`, iterates workspace members.
3. **`crates/lykn-cli/src/dist.rs:570`** — reads per-package `deno.json`, extracts `pkg_config.lykn.emit_dts`.
4. **`crates/lykn-cli/src/dist.rs:575`** — calls `compile_lykn_sources(&pkg_path, &build_dir, emit_dts)`.
5. **`crates/lykn-cli/src/dist.rs:188-243`** — for each `.lykn` file: read → expand → classify → analyze → emit kernel → codegen JS → write `.js`.
6. **`crates/lykn-cli/src/dist.rs:245-260`** — if `emit_dts`: calls `lykn_lang::emitter::dts::emit_dts_module(&classified, &registry, &file_str)`, prints warnings, writes `.d.ts` alongside `.js`.
7. **`crates/lykn-lang/src/emitter/dts.rs:205`** — `emit_dts_module` walks `SurfaceForm`s, dispatches to `emit_func_dts`, `emit_bind_dts`, `emit_type_dts` per form type.

---

## M10 Follow-up (CDC review findings)

CDC review (`workbench/m10-closing-cdc-review-2026-05-13.md`) surfaced two findings. Both addressed:

### Finding #1 — Single-file `lykn compile` `.d.ts` emission

Single-file `lykn compile foo.lykn -o foo.js` now also writes `foo.d.ts`. Implementation:
- `crates/lykn-cli/src/compile.rs::compile_file_with_dts` (new wrapper)
- `crates/lykn-cli/src/compile.rs::compile_source_with_dts` (new function returning `(js, dts_opt, warnings)`)
- `crates/lykn-cli/src/main.rs::cmd_compile` — uses `compile_file_with_dts` for `-o` mode; writes `.d.ts` alongside `.js`
- Stdout mode (`lykn compile foo.lykn` without `-o`) skips `.d.ts` by design — no natural destination.

Verification:
```
$ echo '(export (bind X 42))' > /tmp/test.lykn
$ lykn compile /tmp/test.lykn -o /tmp/test.js
$ cat /tmp/test.d.ts
export const X: number;
```

### Finding #2 — `emit_bind_inferred_dts` literal-type inference

`emit_bind_inferred_dts` now infers the TS type from the bind's value expression via `infer_literal_ts_type`:
- `SExpr::String` → `string`
- `SExpr::Number` → `number`
- `SExpr::Bool` → `boolean`
- All other variants → `unknown`

5 new unit tests cover each literal variant + the fallback.

### Updated empirical gates

```
$ cargo test -p lykn-lang
test result: ok. 969 passed; 0 failed (lib — 964 prior + 5 new)
test result: ok. 22 passed; 0 failed (integration)
test result: ok. 18 passed; 0 failed (snapshot)
test result: ok. 5 passed; 0 failed (macro_expansion)
test result: ok. 1 passed; 0 failed (doctests)
```
```
$ ./target/release/lykn build && ./target/release/lykn test
ok | 1197 passed | 0 failed (8s)
```

Mycelium acceptance unchanged: `mod.d.ts` → `export const VERSION: string;` (correct — VERSION's `"0.1.1"` is a string literal); `render.d.ts` → `export function html(hiccup: unknown): string;`.
