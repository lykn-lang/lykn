# M10 Implementation Prompt for CC — `.d.ts` Generation from `:type` Annotations

## Preamble — read this first

M10 generates TypeScript `.d.ts` declaration files alongside the compiled `.js` for any lykn package with `:type` annotations on exported forms. TypeScript consumers of the lykn package get full autocomplete, type-narrowing, and `tsc`-level checks against the lykn-exported API surface.

**Pattern A confirmed: `.js` + `.d.ts` siblings.** Not `.ts`-first output. Lykn is ECMAScript-2025-aligned; `.d.ts` is auxiliary type information; `.js` remains the canonical compiled output. M10 is additive — the existing JS emit pipeline is untouched.

All ten design questions resolved per Duncan's calls (2026-05-13). See `workbench/m10-pre-dd-inventory-2026-05-12.md` for the full resolution table. Summary:

- **Q1: A** — `:any` → `unknown` (TS-idiomatic).
- **Q2: A** — Bare `:array` → `unknown[]`; destructured array → typed tuple.
- **Q3: A** — Bare `:object` → `object`; destructured object → shaped type.
- **Q4: A** — `:function` → `Function` (lossy).
- **Q5: D** — Exported func without `:returns` → warning + `.d.ts` emits `unknown`.
- **Q6: A** — Emit `.d.ts` during `lykn compile`, parallel to `.js`. M11's `target/lykn/build/<pkg>/` accommodates.
- **Q7: C** — Opt-out via `deno.json` `"lykn": { "emitDts": false }`. On by default for packages with `:type` annotations.
- **Q8: A** — `.d.ts` only for M10. JSDoc-in-JS is future work.
- **Q9: A** — Multi-clause `func` → TS overloads (multiple function declarations).
- **Q10: B** — `:pre`/`:post` → JSDoc `@requires`/`@ensures` tags above the TS signature.

**This is the largest milestone in the dep-ergo thread.** Substantial new code in the Rust emitter; new dependency on neither (TS emission is hand-written string formatting). Methodology discipline that worked for DD-54 applies in full force here.

---

## The methodology pattern (carried forward from DD-54)

DD-54 closed cleanly first try because of four elements:

1. **Pre-solved obstacles in the prompt** — not listed as "anticipated risks" for CC to discover, but spelled out with proposed solutions.
2. **Two-turn pause** — diagnosis-first artifact, CDC approval, then implementation.
3. **Mandatory call-path tracing in the closing report** — file:line citations proving the test exercises production code.
4. **Explicit forbidden patterns** — auto-trigger rejection at CDC review.

All four apply to M10. The two-turn pause is structural to the prompt below.

---

## Pre-solved obstacles

M10 has several specific gotchas that will surface during implementation if not pre-solved:

### Obstacle 1 — Multi-clause function overloads

lykn's multi-clause `func` form:
```lykn
(func greet
  (:args (:string name) :returns :string :body ...)
  (:args (:string g :string name) :returns :string :body ...))
```

TS overload shape:
```typescript
export function greet(name: string): string;
export function greet(g: string, name: string): string;
```

**Each clause is a separate declaration with the same function name.** The `.d.ts` emits one `export function NAME(...): RET;` line per clause, in source order. NO function-body, NO trailing `{` — just the signature followed by `;`.

If the function is NOT exported, the overloads use `declare function NAME(...): RET;` (no `export`).

### Obstacle 2 — ADT discriminated unions

lykn's `(type ...)` form:
```lykn
(type Option (Some :any value) None)
(type Shape (Circle :number radius) (Rect :number w :number h))
```

TS discriminated union shape:
```typescript
export type Option =
  | { tag: "Some"; value: unknown }
  | { tag: "None" };

export type Shape =
  | { tag: "Circle"; radius: number }
  | { tag: "Rect"; w: number; h: number };
```

**The `tag` field name and string-literal type are load-bearing.** Lykn's runtime tagging uses `tag` as the discriminator field (per the existing emit at `crates/lykn-lang/src/emitter/type_checks.rs` and forms.rs). The `.d.ts` MUST use the same field name and the literal string values matching the constructor names.

For nullary constructors (`None`), the variant is `{ tag: "None" }` with no other fields.

### Obstacle 3 — Destructured parameter shapes

lykn destructured-object pattern:
```lykn
(func render-config
  :args ((object :string host :number port (default :boolean ssl true)))
  :returns :string :body ...)
```

TS shape:
```typescript
export function renderConfig(arg: {
  host: string;
  port: number;
  ssl?: boolean;
}): string;
```

**Notes:**
- The whole destructured-object pattern becomes a single inline object type.
- Fields with `(default ...)` become **optional** (`fieldName?: type`).
- Nested patterns (object inside object) recurse: `{ field: { nested: type } }`.

Destructured-array shape:
```lykn
(func with-array
  :args ((array :string head (rest :number tail)))
  :returns :any :body ...)
```

TS shape:
```typescript
export function withArray(arg: [string, ...number[]]): unknown;
```

**Notes:**
- `(rest :type name)` → `...type[]` in the tuple.
- Skipped positions (`Skip` in lykn AST) → `unknown` in the tuple.

### Obstacle 4 — Where the Q5 warning is emitted

`lykn compile` is the build command. The Q5 warning needs to surface to the user's terminal during build. Approach:

- Diagnostics flow through `LyknError` or an equivalent diagnostics channel (verify in diagnosis).
- For M10, a warning-level diagnostic (not fatal). Pattern to follow: similar to the existing "unused binding" warnings the Rust compiler already produces.
- Emit to stderr; format like the existing warnings (`<file>:<line>: warning: <message>`).
- Diagnosis MUST identify the existing warning-diagnostic mechanism and confirm M10's warnings flow through the same path.

### Obstacle 5 — `deno.json` `lykn.emitDts` flag parsing

The opt-out flag (Q7=C) is per-package. Each package's `deno.json` may or may not have:
```json
{
  "name": "@scope/pkg",
  "version": "...",
  "exports": "...",
  "lykn": {
    "kind": "runtime",
    "emitDts": false   // ← opt-out
  }
}
```

The default value when unspecified is `true` (emit). Set to `false` → skip `.d.ts` generation for that package.

**Diagnosis MUST identify where `deno.json` is currently parsed and how the `lykn` field is read.** The existing `lykn.kind` field (e.g., `"runtime"`, `"macro-module"`) tells us the parsing infrastructure exists; M10 extends it with `emitDts`.

### Obstacle 6 — Pipeline hook for emission

Q6=A says emit during `lykn compile`. Currently `lykn compile` produces `.js` to `target/lykn/build/<pkg>/`. M10 adds `.d.ts` siblings.

**Source-to-output mapping:** for source file `packages/<pkg>/mod.lykn`, emit:
- `target/lykn/build/<pkg>/mod.js` (existing)
- `target/lykn/build/<pkg>/mod.d.ts` (new)

Diagnosis MUST identify the existing `.js` emission write point in `lykn compile`'s pipeline and confirm the `.d.ts` write happens at the same lifecycle stage.

---

## Two-turn structure (same as DD-54)

### Turn 1 — Diagnosis only

Output: `workbench/m10-diagnosis-2026-05-13.md`.

MUST address all eight items below, each with ≥ 3 sentences and code references:

1. **TS emitter location.** Where will the new emitter live? Proposed: `crates/lykn-lang/src/emitter/dts.rs` (sibling to the existing JS emitter machinery). Identify what existing helpers it can reuse (`TypeAnnotation`, `TypedParam`, `ParamShape`, `TypeDef`, `ConstructorDef`, `FieldDef`).

2. **Type-mapping function shape.** A core function `lykn_type_to_ts(annotation: &TypeAnnotation, registry: &TypeRegistry) -> String` (or similar) maps lykn type names to TS types. Diagnosis sketches the match-arm structure for the 11 known type keywords (`:number`, `:string`, `:boolean`, `:function`, `:object`, `:array`, `:symbol`, `:bigint`, `:any`, `:void`, `:UserType`).

3. **Multi-clause overload emission.** Per-clause iteration over `Vec<FuncClause>`. Each clause produces one declaration line.

4. **ADT emission.** `TypeDef` with its `constructors: Vec<ConstructorDef>` produces a union of object types. Each `ConstructorDef` has `name` (the tag string) and `fields: Vec<FieldDef>`.

5. **Destructured param recursion.** `ParamShape::DestructuredObject` and `ParamShape::DestructuredArray` recurse into their inner patterns. Diagnosis MUST show how `(default ...)` inside a destructured pattern produces an optional field marker.

6. **Q5 warning emission path.** Identify where existing warnings are emitted in `lykn compile`. Show the diagnostic infrastructure M10's warning hooks into.

7. **`deno.json` `lykn.emitDts` parsing.** Identify the existing `deno.json` parser; show how `lykn.kind` is currently read; sketch the `emitDts` extension.

8. **Pipeline integration.** Identify the `lykn compile` code path that writes `.js` to `target/lykn/build/<pkg>/`. Sketch where the `.d.ts` write happens (likely immediately after the `.js` write).

**STOP-and-surface triggers** for Turn 1 (these are real obstacles to look for; if any fires, surface BEFORE Turn 2):

- The diagnostic infrastructure for warnings doesn't have a non-fatal channel.
- The `deno.json` parser doesn't easily extend to read `emitDts`.
- The `lykn compile` pipeline writes JS at a point where `.d.ts` companion-emission is awkward.
- `TypeRegistry` lookup for user-defined types doesn't cleanly produce the constructor list at emit time.
- Multi-clause overload handling requires non-trivial AST walk machinery that doesn't exist yet.

After Turn 1: CC STOPS. CDC reviews. CDC approves OR sends back amendments. Then Turn 2 proceeds.

### Turn 2 — Implementation + tests + closing report

After CDC approval, CC implements in a single turn:

- Deliverable 2: code (new `dts.rs` emitter + `deno.json` flag parsing + pipeline hook + warning emission).
- Deliverable 3: tests (per the spec in §"Test gates" below).
- Deliverable 4: closing report with per-row ledger + call-path verification.

If during Turn 2 anything surfaces that requires deviating from the diagnosis, STOP and surface.

---

## R-ledger for M10

| ID | Criterion | Verify | Significance |
|----|-----------|--------|--------------|
| R-1 | Diagnosis addresses all 8 items | Closing report §Diagnosis has subsections | Serious |
| R-2 | Two-turn structure honored | Turn 1 artifact only; CDC approved before Turn 2 | Serious |
| R-3 | `crates/lykn-lang/src/emitter/dts.rs` exists with the core emit functions | `grep -nE "fn emit_dts\|fn lykn_type_to_ts" crates/lykn-lang/src/emitter/dts.rs` returns matches | Serious |
| R-4 | Type-mapping table emits all 11 primitive type keywords correctly | Unit tests in dts.rs covering each: `:number`→`number`, `:string`→`string`, etc., `:any`→`unknown`, `:void`→`void`, user types pass through | Serious |
| R-5 | ADT emission produces discriminated union shape | Test fixture with `(type Option (Some :any value) None)` emits `export type Option = { tag: "Some"; value: unknown } \| { tag: "None" };` | Serious |
| R-6 | Multi-clause functions emit TS overloads | Test fixture with 2-clause `func` emits two declaration lines with the same name | Serious |
| R-7 | Destructured params emit shaped types with optional defaults | Test fixture with `(object :string host (default :boolean ssl true))` emits `{ host: string; ssl?: boolean }` | Serious |
| R-8 | Q5 warning fires for exported func without `:returns` | Test fixture with such a function emits a warning to stderr during `lykn compile`; `.d.ts` contains `unknown` return type | Serious |
| R-9 | `deno.json` `lykn.emitDts: false` skips emission | Test fixture with the flag set to false produces NO `.d.ts` file | Serious |
| R-10 | Mycelium acceptance gate | Build mycelium with this binary; `target/lykn/build/mycl-html/mod.d.ts` contains `export function html(hiccup: unknown): string;` and `export const VERSION: string;` | Serious — load-bearing closure gate |
| R-11 | Empirical gates green | 989+ Rust tests, 1197+ JS tests, verify-finding-e ✓, no regression in DD-50.7/52/53/54 tests | Serious |

---

## Forbidden patterns

These auto-trigger rejection at CDC review:

1. **Adding a new dependency for TS emission.** The emitter writes plain TypeScript syntax via Rust string formatting. No `swc`, no `quick-js`, no `tsc`-as-subprocess. The TS we emit is hand-rolled.

2. **Emitting JS code in dts.rs.** This file produces TS-declaration source only. Never `.js`.

3. **Skipping the Q5 warning silently** when an exported function lacks `:returns`. The warning MUST emit; the `.d.ts` MUST use `unknown`. If the warning channel is hard to access from the emit point, surface; don't skip.

4. **Defaulting `emitDts` to false.** Q7=C is opt-out. Default is `true`. Reading an unspecified `lykn.emitDts` field MUST yield `true`.

5. **"Tested indirectly" or "documents current behavior"** phrasings in the closing report.

6. **Auto-passing `--allow-*` flags** to underlying tools.

7. **Hard-coding the type-mapping table inline at multiple call sites.** ONE function (e.g., `lykn_type_to_ts`) holds the mapping. Other emit functions call it. DRY.

8. **Modifying the JS emitter's output behavior.** M10 is additive. The `.js` pipeline is untouched.

---

## Architecture (the spec)

### New file: `crates/lykn-lang/src/emitter/dts.rs`

```rust
//! TypeScript .d.ts declaration emitter.
//!
//! M10: emits .d.ts files alongside compiled .js for any lykn package
//! with :type annotations. The .d.ts is auxiliary type information for
//! TypeScript consumers; the .js remains the canonical compiled output.

use crate::ast::surface::{TypeAnnotation, TypedParam, ParamShape, ...};
use crate::analysis::type_registry::{TypeDef, ConstructorDef, FieldDef, TypeRegistry};

/// Map a lykn :type annotation to its TypeScript equivalent.
pub fn lykn_type_to_ts(ann: &TypeAnnotation, registry: &TypeRegistry) -> String {
    match ann.name.as_str() {
        "number"   => "number".to_string(),
        "string"   => "string".to_string(),
        "boolean"  => "boolean".to_string(),
        "function" => "Function".to_string(),
        "object"   => "object".to_string(),
        "array"    => "unknown[]".to_string(),
        "symbol"   => "symbol".to_string(),
        "bigint"   => "bigint".to_string(),
        "any"      => "unknown".to_string(),     // Q1=A
        "void"     => "void".to_string(),
        // User types: registry lookup, fall through to the type name as-is
        // if it's a registered TypeDef
        name if registry.lookup(name).is_some() => name.to_string(),
        // Unknown — treat as user type name (it will resolve at TS check
        // time if the consumer has the type declared elsewhere)
        name => name.to_string(),
    }
}

/// Map a destructured ParamShape to a TS type literal.
pub fn param_shape_to_ts(shape: &ParamShape, registry: &TypeRegistry) -> String {
    match shape {
        ParamShape::Simple(tp) => lykn_type_to_ts(&tp.type_ann, registry),
        ParamShape::DestructuredObject { fields, .. } => {
            // Emit { field1: type1; field2?: type2; ... }
            // Defaults make fields optional (?:)
            // Nested patterns recurse
            ...
        }
        ParamShape::DestructuredArray { elements, .. } => {
            // Emit [type, type, ...resttype[]]
            // Rest produces ...T[] suffix
            // Skip produces unknown
            ...
        }
    }
}

/// Emit a TS declaration for a function (single clause or overload set).
pub fn emit_func_dts(name: &str, clauses: &[FuncClause], exported: bool, registry: &TypeRegistry) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let mut out = String::new();
    for clause in clauses {
        // Each clause is a separate declaration line
        // Emit JSDoc tags for :pre / :post if present (Q10=B)
        if let Some(pre) = &clause.pre { /* JSDoc @requires */ }
        if let Some(post) = &clause.post { /* JSDoc @ensures */ }

        // Args
        let args: Vec<String> = clause.args.iter().enumerate().map(|(i, shape)| {
            let arg_name = shape.bound_names().first().copied().unwrap_or(&format!("arg{i}").as_str()).to_string();
            let arg_type = param_shape_to_ts(shape, registry);
            format!("{arg_name}: {arg_type}")
        }).collect();

        // Return type
        let return_type = match &clause.returns {
            Some(ann) => lykn_type_to_ts(ann, registry),
            None if exported => {
                // Q5=D: warning emission goes elsewhere; fall back to unknown
                "unknown".to_string()
            }
            None => "unknown".to_string(),
        };

        out.push_str(&format!("{modifier}function {name}({}): {return_type};\n", args.join(", ")));
    }
    out
}

/// Emit a TS declaration for an ADT type.
pub fn emit_type_dts(td: &TypeDef, exported: bool) -> String {
    let modifier = if exported { "export " } else { "" };
    let variants: Vec<String> = td.constructors.iter().map(|c| {
        let mut parts = vec![format!("tag: \"{}\"", c.name)];
        for field in &c.fields {
            parts.push(format!("{}: {}", field.name,
                // Q1=A: :any → unknown; other types pass through
                match field.type_keyword.as_str() {
                    "any" => "unknown".to_string(),
                    other => other.to_string(),
                }));
        }
        format!("{{ {} }}", parts.join("; "))
    }).collect();
    format!("{modifier}type {} = {};\n", td.name, variants.join(" | "))
}

/// Emit a TS declaration for an exported `(bind ...)` form with a type annotation.
pub fn emit_bind_dts(name: &str, type_ann: &TypeAnnotation, exported: bool, registry: &TypeRegistry) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let ts_type = lykn_type_to_ts(type_ann, registry);
    format!("{modifier}const {name}: {ts_type};\n")
}

// Entry point: produce the complete .d.ts content for a source file
pub fn emit_dts_file(forms: &[SExpr], registry: &TypeRegistry, ...) -> Result<String, LyknError> {
    let mut out = String::new();
    // Walk top-level forms; for each:
    //   - (export (func name ...)) → emit_func_dts(... exported=true)
    //   - (func name ...)          → emit_func_dts(... exported=false) — only if any other form references it
    //                                (or skip; the .d.ts only needs exported declarations for consumer use)
    //   - (export (bind ...))      → emit_bind_dts(... exported=true)
    //   - (export (type ...))      → emit_type_dts(... exported=true)
    //   - (type ...)               → emit_type_dts(... exported=false) — needed for ADTs referenced by exported types
    //   - Other forms              → skip
    ...
    Ok(out)
}
```

(Pseudocode — exact API depends on existing patterns in the codebase. Diagnosis confirms shapes.)

### Pipeline hook

`lykn compile` currently writes `.js` to `target/lykn/build/<pkg>/`. After writing the `.js`:

```rust
// Pseudocode — the existing pipeline structure determines exact placement
let js_content = compile_to_js(&forms, ...)?;
write_file(&js_path, &js_content)?;

// M10 addition
if should_emit_dts(&deno_json) {  // Q7=C: opt-out check
    let dts_content = dts::emit_dts_file(&forms, &registry, ...)?;
    let dts_path = js_path.with_extension("d.ts");
    write_file(&dts_path, &dts_content)?;
}
```

### `deno.json` `lykn.emitDts` flag

Extends the existing `deno.json` parser. Default value: `true`. The flag lives under `deno.json` → `lykn` → `emitDts`.

```rust
struct LyknPackageConfig {
    kind: Option<String>,         // existing — "runtime" / "macro-module" / "tooling"
    macro_entry: Option<String>,  // existing (V-08 DD-48)
    emit_dts: Option<bool>,       // M10: defaults to true when absent
}

fn should_emit_dts(config: &LyknPackageConfig) -> bool {
    config.emit_dts.unwrap_or(true)
}
```

---

## Test gates

### Unit tests (in `dts.rs::mod tests`)

- `lykn_type_to_ts` for each of the 11 keyword type names
- `lykn_type_to_ts` for user types (registry-resolved and unresolved)
- `param_shape_to_ts` for Simple, DestructuredObject (with and without defaults), DestructuredArray (with rest, with skip)
- `emit_func_dts` for single clause, multiple clauses (overloads), with and without `:returns`
- `emit_type_dts` for unary, binary, nullary constructors
- `emit_bind_dts` for primitive and user types

### Integration tests

- Test fixture `.lykn` files with each pattern; compile through `lykn compile`; verify `.d.ts` output matches expected.
- Real-world fixture: mycelium's `packages/mycl-html/`. Build it; verify `target/lykn/build/mycl-html/mod.d.ts` contains:
  ```typescript
  export const VERSION: string;
  export function html(hiccup: unknown): string;
  ```
- The `html` function has `:returns :string` declared, so no Q5 warning fires.

### Q5 warning test

Test fixture: `(export (func untyped :args (:any x) :body x))` — exported, no `:returns`. Verify:
- Build emits warning to stderr.
- `.d.ts` contains `export function untyped(x: unknown): unknown;`.

### Opt-out test

Test fixture: `deno.json` with `"lykn": { "emitDts": false }`. Verify:
- Build succeeds.
- NO `.d.ts` file is written.

### Mycelium acceptance gate (R-10 — load-bearing)

```sh
# In mycelium's workspace
cd /Users/oubiwann/lab/lykn/mycelium
/Users/oubiwann/lab/lykn/lang/.worktrees/cdc-dep-ergonomics/target/release/lykn build

# Verify:
test -f target/lykn/build/mycl-html/mod.d.ts
grep "export function html" target/lykn/build/mycl-html/mod.d.ts
grep "export const VERSION" target/lykn/build/mycl-html/mod.d.ts
```

The mycl-html `mod.d.ts` should have the expected TS declarations. CDC will verify the literal contents.

### Closing-report empirical gates

```
cargo test -p lykn-lang
./target/release/lykn build && ./target/release/lykn test
./workbench/verify-finding-e-2026-05-12.sh --lykn-bin ./target/release/lykn
```

Quote verbatim output in the closing report.

---

## Production code path verification (mandatory closing-report section)

Per the methodology pattern: the closing report MUST trace from one of the integration tests through to the `.d.ts` write. Specifically, for the mycelium test:

1. `lykn build` invocation → builds all packages
2. For each package, `lykn compile` is invoked → file:line citation
3. `lykn compile` parses → reader → emitter pipeline → file:line
4. After `.js` write, the `should_emit_dts` check → file:line citation
5. `dts::emit_dts_file` is called → file:line
6. Walks forms, emits per-form TS declarations → cite the specific emit functions called for mycelium's exports
7. Result written to `target/lykn/build/mycl-html/mod.d.ts` → file:line

If any step can't be cited concretely, the test isn't exercising the production code path — surface as a finding.

---

## Required reading (in this order)

1. `workbench/m10-pre-dd-inventory-2026-05-12.md` — full DD with resolved calls.
2. `workbench/dd-54-closing-cdc-review-2026-05-13.md` — DD-54's CDC review; understand the methodology pattern that worked.
3. `assets/ai/LEDGER_DISCIPLINE.md` — protocol.
4. **Code paths to study:**
   - `crates/lykn-lang/src/ast/surface.rs` — `TypeAnnotation`, `TypedParam`, `ParamShape`, `FuncClause` definitions.
   - `crates/lykn-lang/src/analysis/type_registry.rs` — `TypeDef`, `ConstructorDef`, `FieldDef` definitions.
   - `crates/lykn-lang/src/emitter/forms.rs` — existing emitter patterns; reference for `dts.rs`'s shape.
   - `crates/lykn-lang/src/emitter/type_checks.rs` — existing runtime type-check emission; reference for understanding what `tag` field is used for ADTs.
   - `crates/lykn-cli/src/compile.rs` — the `lykn compile` pipeline; where `.js` is written and `.d.ts` write hooks in.
   - The `deno.json` parser — wherever `lykn.kind` is currently read.
   - `packages/mycl-html/mod.lykn` and `packages/mycl-html/render.lykn` — the mycelium acceptance test fixtures.

---

## Anticipated risks (Turn 1 diagnosis MUST address each)

These are real risks that diagnosis MUST address. If any becomes a stop-and-surface trigger, raise BEFORE Turn 2:

- **Warning emission infrastructure.** Diagnosis must locate the existing warning channel. If non-fatal diagnostics don't have a clean path, surface.
- **`deno.json` schema extension.** The `lykn.emitDts` field reads cleanly only if the existing parser is structured to accept new optional fields. If the parser is rigid, surface.
- **TypeRegistry availability at emit time.** The `dts.rs` emitter needs `&TypeRegistry` to resolve user types. Diagnosis must confirm the registry is available at the `.d.ts`-write point in the compile pipeline.
- **Multi-clause AST representation.** Diagnosis must confirm that `FuncClause` actually represents multiple clauses cleanly (not flattened or merged).
- **Default values in destructured patterns.** The `DestructuredField` enum has `Simple` and `Nested` variants; the `default_value: Option<SExpr>` field of `TypedParam` is the marker for "optional in TS." Diagnosis verifies this is accessible at emit time.

---

## Out of scope

- **Source-map generation.** Separate concern; not in M10.
- **JSDoc-in-JS annotation** (DD-19's "primary" option). Q8=A → `.d.ts` only.
- **Typed callback signatures via new surface syntax.** Q4=A → `Function` (lossy) is M10's answer.
- **The `lykn cache clean` subcommand.** 0.7.0 candidate (mentioned in DD-54 fast-follows).
- **TypeScript source-aware LSP.** Phase 3+ work.

---

## Discussion points

If Turn 1 diagnosis reveals architectural surprises hitting any of the "STOP and surface" conditions, raise BEFORE writing implementation code. The pattern that's worked in DD-54 (mid-implementation discoveries surfaced honestly via Findings; small adaptations made transparently; larger amendments paused for CDC) applies here.

Iteration estimate: 2 iterations (Turn 1 diagnosis + Turn 2 implementation). The scope is the largest in the dep-ergo thread, but the work is mechanical: walk the AST, emit strings. The hard parts are the obstacles pre-solved above.

Begin Turn 1.
