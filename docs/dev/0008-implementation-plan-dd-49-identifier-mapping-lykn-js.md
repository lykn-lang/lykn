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
- `MULTI_CHAR_ESCAPES: &[(&str, &str)]` — `[("->>", "ThreadLast"), ("->", "To"), ("<-", "From")]` — longest-first ordering (the `->>`/`->` overlap requires this)
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

- `emit_atom` (line 73): change `to_camel_case(value)` → `to_js_identifier(value)`
- `emit_member_chain` (line 86): each segment through `to_js_identifier`
- `emit.rs` direct calls (lines 64, 283, 307, 916, 1015, 1315, 1318): update import and calls

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

**Files:** `crates/lykn-lang/src/emitter/` (find the type-check emission functions)

Update runtime error-message strings from:
```
"valid?: arg 'x' expected string, got "
```
to:
```
"isValid (valid?): arg 'x' expected string, got "
```

The pattern: compute `js_name = to_js_identifier(lykn_name)`. If `js_name != lykn_name`, format as `"{js_name} ({lykn_name}): ..."`. If equal, format as `"{js_name}: ..."` (no parenthesized redundancy).

### 4b. JS side

**File:** `packages/lang/surface.js` — `buildTypeCheck` function (line 95)

Same format change. Import `toJsIdentifier` from `compiler.js` (or extract to a shared identifiers module if circular-import issues arise).

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
grep -r '[?!]' test/surface/ test/forms/ --include='*.lykn' | grep -v '^#'
```

Any existing test that used `valid?` expecting `valid?` in output needs updating to expect `isValid`.

### 5c. Check insta snapshots

```sh
find crates/ -name "*.snap" | xargs grep -l '[?!]' 2>/dev/null
```

If any snapshots contain `?`/`!` identifiers in compiled output, they need `cargo insta test --review` after the change.

### 5d. V-02/V-03 regression verification

Compile the M6 repro files through both compilers and verify:
- `valid?` → `isValid` (not `valid?`)
- `import {isValid}` (not `import {valid?}`)
- Error messages contain `"isValid (valid?):"` format

---

## Critical Files

| File | Phase | Change type |
|------|-------|------------|
| `crates/lykn-lang/src/codegen/names.rs` | 1 | Core function replacement + tests |
| `crates/lykn-lang/src/codegen/emit.rs` | 1 | Call site updates (~7) |
| `packages/lang/compiler.js` | 2 | Core function replacement + call sites (~30) |
| `crates/lykn-lang/src/analysis/scope.rs` | 3 | Collision detection |
| `crates/lykn-lang/src/emitter/` | 4 | Error-message format |
| `packages/lang/surface.js` | 4 | Error-message format |
| `test/forms/camel-case_test.lykn` | 2, 5 | Surface tests |

## Sequencing

```
Phase 1 (Rust core) ──→ Phase 3 (Collision) ──→ Phase 5 (Integration)
Phase 2 (JS core)   ──→ Phase 4 (Error msgs) ──↗
```

Phases 1 and 2 are independent (different files/languages). Phase 3 depends on Phase 1 (imports `to_js_identifier`). Phase 4 depends on both. Phase 5 is the final sweep.

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
