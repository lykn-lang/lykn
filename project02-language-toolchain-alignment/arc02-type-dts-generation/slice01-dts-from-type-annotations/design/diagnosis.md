# M10 Diagnosis — `.d.ts` Generation from `:type` Annotations

**Author:** Claude Code (main context, not delegated)
**Date:** 2026-05-13

---

## 1. TS emitter location

The new emitter belongs at `crates/lykn-lang/src/emitter/dts.rs`, sibling to the existing `forms.rs`, `type_checks.rs`, `json.rs`, and `context.rs`. The module will be registered in `crates/lykn-lang/src/emitter/mod.rs` (add `pub mod dts;` at line 12).

Existing types it reuses directly (no new AST types needed):
- `TypeAnnotation` (surface.rs:5) — the `:type` annotation with `name: String`
- `TypedParam` (surface.rs:11) — typed parameter with `type_ann`, `name`, `default_value`, `is_rest`
- `ParamShape` (surface.rs:50) — `Simple(TypedParam)`, `DestructuredObject { fields }`, `DestructuredArray { elements }`
- `DestructuredField` (surface.rs:20) — `Simple(TypedParam)` or `Nested { alias_name, type_ann, pattern }`
- `ArrayParamElement` (surface.rs:32) — `Typed`, `Rest`, `Skip`, `Nested`, `NestedWithAlias`
- `FuncClause` (surface.rs:153) — `args: Vec<ParamShape>`, `returns: Option<TypeAnnotation>`, `pre`, `post`
- `Constructor` (surface.rs:174) — `name`, `fields: Vec<TypedParam>` (the surface-level ADT constructor)
- `SurfaceForm` variants: `Func`, `Bind`, `Type`, `Export` (surface.rs:249, 243, 260, 405)
- `TypeRegistry` (type_registry.rs) with `TypeDef`, `ConstructorDef`, `FieldDef`

The `.d.ts` emitter operates on `&[SurfaceForm]` (the classified forms) plus `&TypeRegistry` — the same inputs the existing kernel emitter at `emitter::emit()` (mod.rs:27) receives.

**Resolved.** No new dependencies, no new AST types. The emitter uses the existing classified surface forms.

---

## 2. Type-mapping function shape

`lykn_type_to_ts(ann: &TypeAnnotation, registry: &TypeRegistry) -> String` maps the 11 known type keywords:

| lykn `:type` | TS output | Rationale |
|---|---|---|
| `:number` | `number` | Direct |
| `:string` | `string` | Direct |
| `:boolean` | `boolean` | Direct |
| `:function` | `Function` | Q4=A (lossy) |
| `:object` | `object` | Q3=A (bare) |
| `:array` | `unknown[]` | Q2=A (bare) |
| `:symbol` | `symbol` | Direct |
| `:bigint` | `bigint` | Direct |
| `:any` | `unknown` | Q1=A |
| `:void` | `void` | Direct |
| `:promise` | `Promise<unknown>` | Built-in type keyword from SKILL.md |
| `:<UserType>` | The type name as-is | Emitted as a reference; resolves at TS check time |

For user types, `registry.lookup(name)` is checked. If the type is registered (from a `(type ...)` declaration in the same file), it's emitted as the PascalCase type name. If not registered, it's still emitted as-is — it will resolve via the TS consumer's type context.

The `name` field of `TypeAnnotation` at surface.rs:6 is the keyword string WITHOUT the leading `:` (e.g., `"number"`, `"string"`, `"MyType"`). Confirmed by reading `classifier/forms.rs` where `TypeAnnotation` is constructed from keyword atoms.

**Resolved.** Straightforward match-arm function.

---

## 3. Multi-clause overload emission

`FuncClause` at surface.rs:153 is a single clause. `SurfaceForm::Func` at surface.rs:249 has `clauses: Vec<FuncClause>`. Multi-clause functions have `clauses.len() > 1`.

For each clause, the `.d.ts` emitter produces one `export function NAME(args): RET;` line. Multi-clause functions produce multiple overload declaration lines with the same function name, in source order.

The `ParamShape` items in `clause.args` each have bound names accessible via the `bound_names()` method (surface.rs:68-76, returns `Vec<&str>`). For `Simple` params, the name comes from `TypedParam::name`. For destructured params, the bound names are the individual field names — but in the TS declaration, the entire destructured pattern becomes a single positional argument with an inline object/array type.

For destructured params in overload signatures, I'll use a synthetic parameter name (e.g., `arg0`, `arg1`) since the destructured field names aren't valid single-parameter names in TS.

**Resolved.** The AST cleanly represents multi-clause functions. No flattening or merging.

---

## 4. ADT emission

`SurfaceForm::Type` at surface.rs:260 has `constructors: Vec<Constructor>`. Each `Constructor` (surface.rs:174) has `name: String` and `fields: Vec<TypedParam>`. The `TypedParam` gives each field's name and type annotation.

For the `.d.ts`, each constructor becomes an object-type variant in a discriminated union:
- `{ tag: "ConstructorName"; field1: type1; field2: type2 }`
- Nullary constructors (empty fields): `{ tag: "ConstructorName" }`
- The `tag` field matches the runtime tagging used by the existing emitter (confirmed at `emitter/forms.rs` where `(type ...)` emits `{ tag: "Name", ...fields }`).

The `TypeRegistry` at type_registry.rs:24 also has `TypeDef` with `constructors: Vec<ConstructorDef>`, but the `.d.ts` emitter should work from the `SurfaceForm::Type` variant directly (it has the full constructor info with typed fields). The registry is needed only for cross-reference resolution (when a function parameter references a user type).

**Resolved.** The `Constructor` struct has exactly the fields needed for discriminated-union emission.

---

## 5. Destructured param recursion

`ParamShape::DestructuredObject { fields: Vec<DestructuredField> }` at surface.rs:52:
- `DestructuredField::Simple(TypedParam)` — field with `type_ann` and optional `default_value`. If `default_value.is_some()`, the field is optional in TS (`fieldName?: type`).
- `DestructuredField::Nested { alias_name, type_ann, pattern }` — nested object/array pattern. The `pattern` is `Box<ParamShape>`, so recursion produces inline nested types: `{ fieldName: { nested: type } }`.

`ParamShape::DestructuredArray { elements: Vec<ArrayParamElement> }` at surface.rs:56:
- `ArrayParamElement::Typed(TypedParam)` — positional element with type.
- `ArrayParamElement::Rest(TypedParam)` — rest element; TS `...type[]`.
- `ArrayParamElement::Skip(Span)` — skipped position; TS `unknown`.
- `ArrayParamElement::Nested { pattern }` — nested pattern; recurse.

The `default_value: Option<SExpr>` field on `TypedParam` (surface.rs:15) is the marker for optional fields. When `default_value.is_some()`, the field gets `?:` in the TS output. Confirmed accessible at emit time — the `TypedParam` is contained within the `DestructuredField::Simple` variant.

**Resolved.** The AST has all the information needed. Recursion follows `ParamShape` → `DestructuredField`/`ArrayParamElement` → `ParamShape` (via `Box`).

---

## 6. Q5 warning emission path

The existing warning channel is well-established:
- `Diagnostic` struct at diagnostics/mod.rs:12 with `Severity::Warning`
- `analysis::analyze()` at analysis/mod.rs:354 returns `AnalysisResult { diagnostics, type_registry, has_errors }`
- `compile.rs:95-100` prints warnings to stderr: `for diag in &analysis_result.diagnostics { if Warning { eprintln!("{diag}"); } }`
- `dist.rs:223-236` also processes diagnostics from analysis

For M10, the Q5 warning (exported func without `:returns`) can be emitted during the `.d.ts` generation pass itself, since the `.d.ts` emitter walks the classified forms and has access to `:returns` info. The warning goes to stderr via `eprintln!` at the call site in `dist.rs` or `compile.rs`, matching the existing pattern.

The simplest approach: `emit_dts_file` returns both the `.d.ts` content AND a list of warnings (`Vec<Diagnostic>`). The caller (in `dist.rs` or `compile.rs`) prints them to stderr using the same `eprintln!("{diag}")` pattern.

**Resolved.** The warning channel exists and is straightforward to use from the `.d.ts` emission point.

---

## 7. `deno.json` `lykn.emitDts` parsing

`LyknMetadata` at config.rs:52 currently has `kind: PackageKind` and `macro_entry: Option<String>`. It derives `Deserialize` and `Default`. Adding `emit_dts: Option<bool>` is a one-line addition:

```rust
#[derive(Debug, Clone, Deserialize, Serialize, Default)]
pub struct LyknMetadata {
    #[serde(default)]
    pub kind: PackageKind,
    #[serde(skip_serializing_if = "Option::is_none", rename = "macroEntry")]
    pub macro_entry: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none", rename = "emitDts")]
    pub emit_dts: Option<bool>,
}
```

Because `serde` uses `#[serde(default)]` for the struct, a missing `emitDts` field deserializes as `None`. The `should_emit_dts` function returns `config.emit_dts.unwrap_or(true)` (defaults to `true` when absent, per Q7=C).

The `PackageConfig` at config.rs:72 already has `pub lykn: LyknMetadata` (line 90). The new field flows through automatically.

**Resolved.** One field addition to `LyknMetadata`. Serde handles the optional deserialization.

---

## 8. Pipeline integration

The `.js` write happens at `dist.rs:240`: `fs::write(&js_path, js)`. At this point in `compile_lykn_sources` (line 173), the following are available:
- `classified` (line 212): `Vec<SurfaceForm>` — the classified surface forms
- `analysis_result.type_registry` (line 223): the `TypeRegistry` with registered types
- `path` (line 188): the source `.lykn` file path (for Q5 warning source locations)
- `js_path` (line 191): the output `.js` path — `.d.ts` path is `js_path.with_extension("d.ts")`

The `.d.ts` write goes immediately after line 243 (after the `.js` write succeeds):

```rust
// After fs::write(&js_path, js)
if should_emit_dts(pkg_config) {
    let (dts_content, warnings) = dts::emit_dts_file(&classified, &analysis_result.type_registry, &path);
    for w in &warnings { eprintln!("{w}"); }
    let dts_path = js_path.with_extension("d.ts");
    fs::write(&dts_path, dts_content).map_err(...)?;
}
```

The `pkg_config` (the per-package `deno.json`) is available in the caller `build_project` at dist.rs:536 but NOT directly in `compile_lykn_sources`. I'll need to thread it through as a parameter — `compile_lykn_sources` currently takes `(pkg_path, build_dir)`. Adding `emit_dts: bool` as a third parameter keeps it simple.

For `lykn compile` (single-file compilation at compile.rs:57), the `.d.ts` output would be written alongside the `.js` output. The `compile_source` function currently returns a `String` (the JS). For M10, it can also return the `.d.ts` content, or the caller handles the `.d.ts` write after the `.js` write. The single-file `cmd_compile` in main.rs can check for a per-package `deno.json` in the source file's directory and call the `.d.ts` emitter.

**Resolved.** The integration point is clean. One parameter addition to `compile_lykn_sources` and a `.d.ts` write block after the existing `.js` write.
