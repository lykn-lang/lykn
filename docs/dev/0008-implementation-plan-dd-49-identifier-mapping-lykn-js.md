# Implementation Plan: DD-49 Identifier Mapping (lykn → JS)

## Context

DD-49 (`docs/design/05-active/0049-identifier-mapping-lykn-js.md`) specifies a composite rule for mapping non-JS-safe Lykn identifiers (like `valid?`, `swap!`, `*globals*`, `string->json`) to valid JavaScript identifiers. Both compilers currently pass punctuation through verbatim, producing invalid JS (V-02, V-03 from M6). The fix replaces the simple `to_camel_case`/`toCamelCase` functions with a unified algorithm implementing 8 rules: trailing `?` → `is`-prefix predicate naming, trailing `!` → strip, embedded punctuation → uppercase abbreviations, macro-name overrides, doubled-trailing handling, collision detection, error-message bridging, and import-binding transformation.

The change touches **Rust** (~60%), **JS** (~30%), and **Lykn test files** (~10%).

---

## Phase 1: Rust — Core Identifier Transformation

**File:** `crates/lykn-lang/src/codegen/names.rs`

### 1a. Add constant data tables

Above `to_camel_case` (line 15), add:

- `MACRO_OVERRIDES: &[(&str, &str)]` — `[("->", "threadFirst"), ("->>", "threadLast")]`
- `PREDICATE_PREFIXES: &[&str]` — `["is-", "has-", "can-", "should-", "will-", "does-", "was-", "had-"]`
- `MULTI_CHAR_ESCAPES: &[(&str, &str)]` — `[("->", "To"), ("<-", "From")]` — embedded-position arrows only. `->>` is **not** in this table; it appears only in `MACRO_OVERRIDES` (whole-identifier match, checked first). Per DD-49 Rule 3, the embedded-arrow table only contains `->` and `<-`. (Same intent as the JS-side note in §2a.)
- `PUNCTUATION_TABLE: &[(char, &str)]` — 11 entries: `('?', "QMARK")`, `('!', "BANG")`, `('*', "STAR")`, `('+', "PLUS")`, `('=', "EQ")`, `('<', "LT")`, `('>', "GT")`, `('&', "AMP")`, `('%', "PCT")`, `('$', "DOLLAR")`, `('/', "SLASH")`

Per Rust API guidelines (ID-04 naming, AP-02 parameter types): use `&str` slices in const arrays. Per core idioms: `const` over `static` for compile-time-known data with no interior mutability.

### 1b. Replace `to_camel_case` with `to_js_identifier`

New signature: `pub fn to_js_identifier(s: &str) -> String`

Implement the DD's composition algorithm as a single left-to-right pass:

1. **Macro-override check:** iterate `MACRO_OVERRIDES`; if whole-string match, return registered name immediately.
2. **Trailing-rule phase:** check last char — if `?`, strip and set `predicate_mode = true`; if `!`, strip. If remainder is empty after strip, undo.
3. **Prefix-detection:** if `predicate_mode` and remainder doesn't start with any `PREDICATE_PREFIXES` entry, prepend `is-`.
4. **Walk phase** (left-to-right, `cap_next: bool` flag):
   - At each position, try `MULTI_CHAR_ESCAPES` via `starts_with` (longest first). If match: push abbreviation chars, set `cap_next`, advance index past match length.
   - Else check `PUNCTUATION_TABLE` for current char. If match: push abbreviation, set `cap_next`.
   - Else if `-`: set `cap_next`, don't emit (handle leading/trailing hyphens as underscores per existing behavior).
   - Else (alphanumeric): uppercase if `cap_next`, else as-is. Clear `cap_next`.

Use `String::with_capacity(s.len() + 8)` for the output buffer (the `is` prefix + abbreviation could add a few chars). Work with `s.as_bytes()` or `chars().collect::<Vec<_>>()` for indexed access — the existing code uses `Vec<char>`, which is fine for this character set.

Keep a thin deprecated wrapper: `pub fn to_camel_case(s: &str) -> String { to_js_identifier(s) }` so any external callers don't break. Mark with `#[deprecated(note = "use to_js_identifier")]`.

### 1c. Update call sites

- `crates/lykn-lang/src/codegen/names.rs` `emit_atom` (line 73): change `to_camel_case(value)` → `to_js_identifier(value)`
- `crates/lykn-lang/src/codegen/names.rs` `emit_member_chain` (line 86): each segment through `to_js_identifier`
- `crates/lykn-lang/src/codegen/emit.rs` direct calls — verified: `use super::names::{emit_atom, to_camel_case};` at line 10 plus 7 call sites at lines 64, 283, 307, 916, 1015, 1315, 1318. Update both the `use` statement and the call sites.

### 1d. Unit tests in `names.rs`

Add to the existing `#[cfg(test)] mod tests` block. Use the existing `atom_output()` helper pattern:

- **Rule 1 (predicate):** `"valid?"` → `"isValid"`, `"empty?"` → `"isEmpty"`, `"has-items?"` → `"hasItems"`, `"is-void?"` → `"isVoid"`, `"does-match?"` → `"doesMatch"`, `"was-modified?"` → `"wasModified"`, one test per prefix in `PREDICATE_PREFIXES`
- **Rule 2 (bang):** `"swap!"` → `"swap"`, `"reset!"` → `"reset"`, `"set!"` → `"set"`
- **Rule 3 (embedded):** `"*globals*"` → `"STARGlobalsSTAR"`, `"string->json"` → `"stringToJson"`, `"json<-string"` → `"jsonFromString"`, `"func?-thing"` → `"funcQMARKThing"`, one per abbreviation-table entry
- **Rule 4 (overrides):** `"->"` → `"threadFirst"`, `"->>"` → `"threadLast"`
- **Rule 5 (doubled):** `"valid??"` → `"isValidQMARK"`, `"swap!!"` → `"swapBANG"`
- **Edge cases:** `"?"` → `"QMARK"`, `"!"` → `"BANG"`, `"*"` → `"STAR"`, `"-"` → `"_"`, `"--"` → `"__"`
- **Regression:** all 12 existing `test_to_camel_case_*` tests must still pass (hyphen-only identifiers are unchanged)

**Verify:** `cargo test -p lykn-lang -- names` passes.

---

## Phase 2: JS — Core Identifier Transformation

**File:** `packages/lang/compiler.js`

### 2a. Add data tables

Near the top of the file (before `toCamelCase` at line 78), add module-level `const` declarations:

```js
const MACRO_OVERRIDES = new Map([["->", "threadFirst"], ["->>", "threadLast"]]);
const PREDICATE_PREFIXES = ["is-", "has-", "can-", "should-", "will-", "does-", "was-", "had-"];
const MULTI_CHAR_ESCAPES = [["->", "To"], ["<-", "From"]];
const PUNCTUATION_TABLE = new Map([
  ["?", "QMARK"], ["!", "BANG"], ["*", "STAR"], ["+", "PLUS"],
  ["=", "EQ"], ["<", "LT"], [">", "GT"], ["&", "AMP"],
  ["%", "PCT"], ["$", "DOLLAR"], ["/", "SLASH"],
]);
```

Per JS SKILL: `const` by default, `Map` for lookup tables.

Note: `MULTI_CHAR_ESCAPES` doesn't need `->>` because the override registry (checked first as whole-identifier) handles it. The walk phase only encounters `->` embedded inside larger identifiers.

### 2b. Replace `toCamelCase` with `toJsIdentifier`

Identical algorithm to the Rust version. Replace lines 78-106. Same 4-step composition.

Per JS SKILL: use `for` loop with index (not `for...of`) for character-by-character walking with lookahead. Use `===` for comparisons. Use `??` where applicable.

### 2c. Update call sites

Global find-and-replace `toCamelCase(` → `toJsIdentifier(`. Approximately 30 call sites across:
- `buildImportSpecifier` (lines 10, 13, 21-22)
- `buildExportNames` (lines 33, 36, 43-45)
- `toClassKey` (line 61)
- All identifier construction in `compileExpr`
- Object/array pattern emission
- Method call forms

**Verify:** `make test-js` and `make test-lykn` pass.

### 2d. Cross-compiler convergence test

Add tests in `test/forms/camel-case_test.lykn` (extend existing) using the `test-compiles` macro. These run both compilers (JS for test compilation, Rust via `lykn compile`) and verify output.

Key test cases matching Phase 1d above.

---

## Phase 3: Collision Detection (Rule 6)

**File:** `crates/lykn-lang/src/analysis/scope.rs`

### 3a. Add `js_names` tracking to `ScopeLevel`

Add a field: `js_names: HashMap<String, String>` (JS name → lykn source name).

### 3b. Update `ScopeTracker::introduce()`

After the existing shadowing check (line 78) and before the `insert` (line 87):

1. Compute `let js_name = crate::codegen::names::to_js_identifier(name);`
2. Check current scope's `js_names` for `js_name`. If found and the existing source name differs from `name`, emit a `Severity::Error` diagnostic: `"identifier collision: '{name}' and '{existing}' both compile to '{js_name}'"`
3. Insert into `js_names`: `js_names.insert(js_name, name.to_string())`

**Dependency note:** This imports from `codegen::names` into `analysis::scope`. Both are in the `lykn-lang` crate. If the project prefers to keep analysis independent of codegen, extract `to_js_identifier` into a shared module (e.g., `src/identifiers.rs`). Check the existing crate module structure before deciding.

### 3c. Tests

- Same-scope collision: introduce `"valid?"` then `"is-valid"` → error diagnostic containing `"identifier collision"`
- Same-scope collision with prefix: `"has-items?"` and `"has-items"` → error
- Different-scope (no collision): `"valid?"` in outer, `"is-valid"` in inner → shadowing warning only
- Non-colliding: `"valid?"` and `"empty?"` → no error

**Verify:** `cargo test -p lykn-lang -- scope` passes.

---

## Phase 4: Error-Message Format (Rule 7)

### 4a. Rust side

**File:** `crates/lykn-lang/src/emitter/type_checks.rs`. Three format strings to update:

- `build_error_message` (line 140) — the format at line 149: `"{func_name}: {label} '{param_name}' expected {type_keyword}, got "`. Used by `emit_type_check` for argument checks.
- `emit_return_type_check` (line 112) — the format at line 122: `"{func_name}: return value expected {type_keyword}, got "`. Used for return-type checks.
- (`build_error_message` is the only helper; `emit_type_check` delegates to it. No other format strings in this file.)

`crates/lykn-lang/src/emitter/contracts.rs` does **not** contain `expected … got` strings — confirmed via grep. No edits needed there.

Update runtime error-message strings from:
```
"valid?: arg 'x' expected string, got "
```
to:
```
"isValid (valid?): arg 'x' expected string, got "
```

The pattern: `func_name` arrives as the lykn source name (verified — callers at `forms.rs:544, 992, 1110, 1124, 1268, 1629` pass source-side names). Compute `js_name = to_js_identifier(func_name)`. If `js_name != func_name`, format as `"{js_name} ({func_name}): ..."`. If equal (no punctuation stripping), format as `"{func_name}: ..."` — no parenthesized redundancy.

`param_name` is also a lykn source name and could in principle contain punctuation (e.g., a parameter named `valid?`). Apply the same `js_name (source_name)` treatment to `param_name` when they differ. Keeps the bridging consistent across the message.

### 4b. JS side

**File:** `packages/lang/surface.js` — `buildTypeCheck` function (line 95).

Two format paths in the function (lines 100–102):
```js
const msgText = label
    ? `${funcName}: ${label} '${paramName}' expected ${typeName}, got `
    : `${funcName} '${paramName}': expected ${typeName}, got `;
```

Both need updating. The `funcName` parameter is the lykn source name (verified — call sites at lines 534, 539, 548 pass source-side names from the surrounding `func` definition). Apply the same pattern as Rust (4a): compute `jsName = toJsIdentifier(funcName)`; if different, render `${jsName} (${funcName})`; otherwise render `${funcName}`. Same treatment for `paramName`.

Import `toJsIdentifier` from `compiler.js`. **Check for circular imports up front** — if `compiler.js` imports from `surface.js` (or transitively), extract `toJsIdentifier` into a new shared module (e.g., `packages/lang/identifiers.js`) before starting Phase 4. A circular-import failure mid-Phase-4 would force the extraction with rework; doing it proactively avoids the churn.

### 4c. Tests

- Compile `(func valid? :args (:string x) :body x)` → verify compiled JS contains `"isValid (valid?):"` in the TypeError string
- Compile `(func my-func :args (:number n) :body n)` → verify just `"myFunc:"` (no parenthesized form since `my-func` → `myFunc` doesn't involve punctuation stripping)

---

## Phase 5: Integration and Final Verification

### 5a. Run full test suite

```sh
make lint     # clippy, cargo fmt, lykn syntax
make test     # all: rust, js, lykn surface, doctests
```

### 5b. Check for existing tests using `?` or `!` in identifiers

```sh
# Lykn comments are `;;`, not `#` — filter those out.
grep -rE '\b[a-zA-Z_][a-zA-Z0-9_-]*[?!]' test/ --include='*.lykn' | grep -v ';;'
```

Cast wider than `test/surface/ test/forms/` — any test directory with `.lykn` files. Any existing test that used `valid?` expecting `valid?` in output needs updating to expect `isValid`. Likewise `swap!` → `swap`, etc.

### 5c. Check insta snapshots

```sh
find crates/ -name "*.snap" | xargs grep -l '[?!]' 2>/dev/null
```

If any snapshots contain `?`/`!` identifiers in compiled output, they need `cargo insta test --review` after the change.

### 5d. V-02/V-03 regression verification

The M6 repro inputs and captured outputs live in `workbench/verify/m6/` (see `v02-*`, `v03-*` files). Re-run those inputs through both compilers and verify:

- `valid?` → `isValid` (not `valid?`)
- `import {isValid}` from V-03 (not `import {valid?}`)
- Error messages contain `"isValid (valid?):"` format
- Update or annotate the captured `*-js-output.txt` / `*-rust-output.txt` files in `workbench/verify/m6/` to reflect the new expected output (or note them as stale references to the pre-fix V-rows). Coordinate this with M8's closing report.

### 5e. Rule 8 (import-binding emission) verification

Implicit in Phase 2c (the global `toCamelCase` → `toJsIdentifier` rename) — `buildImportSpecifier` and `buildExportNames` already route through the central transformer. But verify explicitly with a focused test:

```lykn
;; Source
(import "./x.js" (valid?))
(export (func valid? :args (:any x) :body x))
```

Expected JS output:
```js
import { isValid } from "./x.js";
function isValid(x) { ... }
export { isValid };
```

Same test in Rust. Confirms Rule 8 (DD-49) survived Phase 2c's mechanical rename without regression.

---

## Critical Files

| File | Phase | Change type |
|------|-------|------------|
| `crates/lykn-lang/src/codegen/names.rs` | 1 | Core function replacement + tests |
| `crates/lykn-lang/src/codegen/emit.rs` | 1 | Call site updates (~7) |
| `packages/lang/compiler.js` | 2 | Core function replacement + call sites (~30) |
| `crates/lykn-lang/src/analysis/scope.rs` | 3 | Collision detection |
| `crates/lykn-lang/src/emitter/type_checks.rs` | 4 | Error-message format (2 strings: `build_error_message` line 149, `emit_return_type_check` line 122) |
| `packages/lang/surface.js` | 4 | Error-message format (2 paths in `buildTypeCheck` line 100–102) |
| `test/forms/camel-case_test.lykn` | 2, 5 | Surface tests |

## Sequencing

```
Phase 1 (Rust core) ─┬─→ Phase 3 (Collision) ──→ Phase 5 (Integration)
                     └─→ Phase 4 (Error msgs) ──↗
Phase 2 (JS core)   ───→ Phase 4 (Error msgs) ──↗
```

Phases 1 and 2 are independent (different files/languages). Phase 3 depends on Phase 1 (imports `to_js_identifier` from `codegen::names`). **Phase 4 depends on both Phases 1 and 2** — the error-message format change calls `to_js_identifier` (Rust) and `toJsIdentifier` (JS). Phase 5 is the final sweep.

## Cross-compiler byte-identical convergence

Per the M5 context-aware split: the Rust and JS implementations diverge in mechanism but **must converge in user-visible output**. Specifically, the following must be byte-identical across compilers for any input identifier:

- The abbreviation table (Rule 3) — same characters, same all-caps escapes
- The macro-override registry (Rule 4) — same form names, same JS-side names
- The predicate-prefix list (Rule 1) — same eight prefixes, same order doesn't matter, same set
- The error-message format (Rule 7) — same parenthesization shape

Phase 2d's cross-compiler convergence test is the gate. If the Rust and JS outputs ever diverge for a tested input, that's a bug in one of the implementations, not a design difference.

## Key Rust Quality Checks (per SKILL guides)

- Use `&str` parameters, return `String` (API guidelines ID-04: `to_*` naming = allocates)
- No `.unwrap()` — the function is pure and handles all inputs (AP-08)
- `#[cfg(test)]` module with descriptive test names (AP-60: test quality)
- `cargo clippy -- -D warnings` clean (AP-01: no blanket deny(warnings), but clippy clean)
- `cargo fmt` clean
- Mark deprecated wrapper with `#[deprecated]` attribute

## Key JS Quality Checks (per SKILL guide)

- `const` for all tables and function declarations
- `===` for all comparisons
- `Map` for lookup tables (not plain objects — per JS SKILL conventions)
- No `var`, no `==`
- Named `function` declaration for module-level `toJsIdentifier` (hoisted, named in stack traces)
