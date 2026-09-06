# M10 Follow-Up Implementation Prompt for CC

## Read this first

M10 closed with **two findings** from CDC review (`workbench/m10-closing-cdc-review-2026-05-13.md`). Both are real, both are small, both should be fixed in this iteration rather than logged as fast-follow.

This is a **single-turn, focused prompt**. No two-turn diagnosis pause needed — the findings are mechanical and well-specified. Total scope: ~25 lines of code + 3-4 new tests + closing-report addendum.

---

## Finding #1 — Single-file `lykn compile` doesn't emit `.d.ts`

### What's wrong

The M10 prompt's Q6=A: *"Emit `.d.ts` during `lykn compile`, parallel to `.js`."*

M10's implementation hooked `.d.ts` emission into `dist.rs::compile_lykn_sources` (invoked by `lykn build`) but NOT into the single-file path. Verify:

```sh
grep -nE "dts|emit_dts" crates/lykn-cli/src/compile.rs
# (no matches in current code)
```

Single-file `lykn compile foo.lykn -o foo.js` produces only `foo.js`, no `foo.d.ts`. The prompt's literal Q6=A spec wasn't met.

### The fix

The single-file compile path lives in `crates/lykn-cli/src/main.rs::cmd_compile` (around line 256) and `crates/lykn-cli/src/compile.rs::compile_source`.

**Behavior:**
- When `lykn compile foo.lykn -o foo.js` is invoked (`-o <path>` mode): also write `foo.d.ts` alongside (using `path.with_extension("d.ts")`).
- When `lykn compile foo.lykn` is invoked without `-o` (stdout mode): skip `.d.ts` (no natural destination).

**Approach:** modify `compile_source` (or add a wrapper) to optionally also return the `.d.ts` content. Then `cmd_compile` writes the `.d.ts` when `-o` is set.

**Pseudocode for the `compile_source` change** (or a new wrapper function):

```rust
pub fn compile_source_with_dts(
    source: &str,
    file_path: Option<&Path>,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<(String, Option<String>, Vec<Diagnostic>), CompileError> {
    // Same as compile_source, but:
    // 1. Capture `classified` after the classify step.
    // 2. Capture `analysis_result.type_registry` after the analyze step.
    // 3. After producing the JS string, also call:
    //      let (dts_content, dts_warnings) = lykn_lang::emitter::dts::emit_dts_module(
    //          &classified, &type_registry, file_path_str_or_default
    //      );
    // 4. Return (js, Some(dts_content), warnings) — or (js, None, ...) if dts_content is empty.
}
```

Then `cmd_compile` uses the new function for `-o` mode:

```rust
fn cmd_compile(file: &Path, output: Option<&Path>, strip_assertions: bool, kernel_json: bool) {
    // ... existing setup ...
    let (js, dts_opt, warnings) = compile_source_with_dts(...)?;

    // Print warnings to stderr (same pattern as dist.rs)
    for w in &warnings { eprintln!("{w}"); }

    if let Some(out_path) = output {
        // Write .js as before
        fs::write(out_path, js)?;
        // M10 follow-up: also write .d.ts when -o is used AND dts content exists
        if let Some(dts_content) = dts_opt {
            if !dts_content.is_empty() {
                let dts_path = out_path.with_extension("d.ts");
                fs::write(&dts_path, &dts_content)?;
            }
        }
    } else {
        // stdout mode: print JS only; .d.ts is skipped by design
        print!("{js}");
    }
    // ...
}
```

**Design choice to document in the closing report addendum:**
> "Single-file `lykn compile` emits `.d.ts` only when `-o <path>` is specified; stdout-mode produces JS only. Rationale: `.d.ts` is a sibling artifact requiring a known on-disk destination; stdout-mode has no such destination."

You MAY also want the single-file path to consult `deno.json`'s `lykn.emitDts` flag for consistency with `lykn build`. **Recommended default for the follow-up: skip the deno.json consultation; always emit when `-o` is set.** Reasoning: single-file `lykn compile` is dev-iteration convenience; the publish path is `lykn build`. If a library author wants per-package opt-out, that's primarily a publish concern. If you want to consult deno.json, do so via `crate::config::read_project_config_optional`; but the simpler "always emit when `-o`" is fine.

---

## Finding #2 — `emit_bind_inferred_dts` always emits `string`

### What's wrong

`crates/lykn-lang/src/emitter/dts.rs::emit_bind_inferred_dts` (line ~257) hardcodes the TS type as `string`:

```rust
fn emit_bind_inferred_dts(name: &str, exported: bool) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let js_name = to_js_identifier(name);
    format!("{modifier}const {js_name}: string;\n")  // ← hardcoded "string"
}
```

For mycelium's `(export (bind VERSION "0.1.1"))`, this coincidentally produces correct output (VERSION IS a string). But for `(export (bind COUNT 42))`, the same code produces `export const COUNT: string;` — **wrong**.

### The fix

Pass the bind's value SExpr into `emit_bind_inferred_dts` and infer the TS type from literal value variants.

**Verified SExpr variants** (from `crates/lykn-lang/src/ast/sexpr.rs`):
- `SExpr::String { value, span }` — string literals → TS `string`
- `SExpr::Number { value, span }` — number literals → TS `number`
- `SExpr::Bool { value, span }` — boolean literals → TS `boolean`
- `SExpr::Null { span }` — null literal → TS `unknown` (recommended; `null` is too narrow)
- `SExpr::Atom { value, span }` — symbol references → TS `unknown` (can't infer at this layer)
- `SExpr::Keyword { value, span }` — lykn keyword → TS `unknown` (not a typical TS value type)
- `SExpr::List { values, span }` — computed expressions → TS `unknown`

**Verified call-site context** (`crates/lykn-lang/src/emitter/dts.rs::emit_dts_module`):

```rust
SurfaceForm::Bind { name, type_ann, .. } => {
    // ... currently uses `..` to ignore value field
    // After fix: capture `value` and pass to emit_bind_inferred_dts
}
```

`SurfaceForm::Bind` has `value: SExpr` (verified at `crates/lykn-lang/src/ast/surface.rs:246`). Currently the destructuring ignores it via `..`; capture it.

**Pseudocode for the fix:**

```rust
// In dts.rs

fn infer_literal_ts_type(expr: &SExpr) -> &'static str {
    match expr {
        SExpr::String { .. } => "string",
        SExpr::Number { .. } => "number",
        SExpr::Bool { .. } => "boolean",
        SExpr::Null { .. } => "unknown",   // null is too narrow as a default
        SExpr::Atom { .. } => "unknown",   // can't infer from symbol reference
        SExpr::Keyword { .. } => "unknown",
        SExpr::List { .. } => "unknown",   // computed expression
    }
}

fn emit_bind_inferred_dts(name: &str, value: &SExpr, exported: bool) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let js_name = to_js_identifier(name);
    let ts_type = infer_literal_ts_type(value);
    format!("{modifier}const {js_name}: {ts_type};\n")
}
```

And the call site in `emit_dts_module`:

```rust
SurfaceForm::Bind { name, type_ann, value, .. } => {  // ← capture `value`
    if let Some(ann) = type_ann {
        if let Some(n) = name.as_atom() {
            out.push_str(&emit_bind_dts(n, ann, true, registry));
        }
    } else if let Some(n) = name.as_atom() {
        out.push_str(&emit_bind_inferred_dts(n, value, true));  // ← pass `value`
    }
}
```

**Design choice to document:** literal-type inference applies only to bind expressions where the value is a literal. For computed values, fall back to `unknown` (safer than the previous hardcoded `string`).

---

## What MUST be in this iteration

### Code changes

- `crates/lykn-cli/src/compile.rs` — add `compile_source_with_dts` wrapper (or modify `compile_source` signature). Lines: ~15.
- `crates/lykn-cli/src/main.rs::cmd_compile` — use the new wrapper; write `.d.ts` for `-o` mode. Lines: ~10.
- `crates/lykn-lang/src/emitter/dts.rs` — add `infer_literal_ts_type` helper; update `emit_bind_inferred_dts` to take value; update call site in `emit_dts_module`. Lines: ~15.

Total: ~40 lines of code. Slightly more than the CDC review's ~25-line estimate but still in the small-scope category.

### Tests

Add to `crates/lykn-lang/src/emitter/dts.rs::tests`:

1. **`test_emit_bind_inferred_string`** — `SExpr::String` value → `"string"` type
2. **`test_emit_bind_inferred_number`** — `SExpr::Number` value → `"number"` type
3. **`test_emit_bind_inferred_boolean`** — `SExpr::Bool` value → `"boolean"` type
4. **`test_emit_bind_inferred_null_to_unknown`** — `SExpr::Null` value → `"unknown"` type (per design choice)
5. **`test_emit_bind_inferred_computed_to_unknown`** — `SExpr::List` value → `"unknown"` type

These test the literal-type inference. For Finding #1, the single-file `.d.ts` emission can be tested as an integration test (compile a small file with `-o`; verify `.d.ts` exists alongside the `.js`). Add to the existing test suite as appropriate; if there's no clean integration-test harness for `cmd_compile`, document the manual verification in the closing report.

### Closing-report addendum

Update `workbench/2026-05-13-M10-closing-report.md` with an addendum section at the end:

```markdown
---

## M10 Follow-up (CDC review findings)

CDC review (`workbench/m10-closing-cdc-review-2026-05-13.md`) surfaced two findings. Both addressed:

### Finding #1 — Single-file `lykn compile` `.d.ts` emission
Single-file `lykn compile foo.lykn -o foo.js` now also writes `foo.d.ts`. Implementation:
- `crates/lykn-cli/src/compile.rs::compile_source_with_dts` (new wrapper, lines X-Y)
- `crates/lykn-cli/src/main.rs::cmd_compile` (modified to write .d.ts when -o is set, lines Z-W)
- Stdout mode (`lykn compile foo.lykn`) skips `.d.ts` by design — no natural destination.

### Finding #2 — `emit_bind_inferred_dts` literal-type inference
`emit_bind_inferred_dts` now infers the TS type from the bind's value expression:
- `SExpr::String` → `string`
- `SExpr::Number` → `number`
- `SExpr::Bool` → `boolean`
- All other variants → `unknown`

5 new unit tests cover each literal variant + the fallback.

### Updated empirical gates
- `cargo test -p lykn-lang`: 969 passing (964 prior + 5 new tests for literal inference)
- `./target/release/lykn build && ./target/release/lykn test`: 1197 passing (unchanged)
- Mycelium acceptance: `target/lykn/build/mycl-html/mod.d.ts` still contains `export const VERSION: string;` (VERSION's `"0.1.1"` is a string literal; inference produces correct result).
```

(Adjust numbers to match actual results.)

### Empirical re-verification

After the fixes, re-run:

```sh
cargo test -p lykn-lang                          # expect 969+ passing (964 + 5 new)
./target/release/lykn build && ./target/release/lykn test  # expect 1197 (unchanged)
./workbench/verify-finding-e-2026-05-12.sh --lykn-bin ./target/release/lykn  # expect ✓ ALL CHECKS PASSED
```

Plus a single-file test:

```sh
# In a temp dir, create a small lykn source and compile with -o
echo '(export (bind X 42))' > /tmp/test_m10_followup.lykn
./target/release/lykn compile /tmp/test_m10_followup.lykn -o /tmp/test_m10_followup.js
ls /tmp/test_m10_followup.{js,d.ts}  # both should exist
cat /tmp/test_m10_followup.d.ts      # should be: export const X: number;
```

Quote the output verbatim in the closing-report addendum.

---

## MUST framing

You MUST:

1. **Make both fixes.** They're independent; both small; both real.
2. **Update the M10 closing report with the addendum.** Don't write a new closing report; extend the existing one with the addendum section above.
3. **Add the 5 unit tests** for literal-type inference (per Finding #2).
4. **Run the empirical gates** post-fix and quote output verbatim.

You MUST NOT:

1. **Substitute Finding #2's fix with a blanket `unknown` default.** Literal-type inference (the `infer_literal_ts_type` function pattern shown above) is the REQUIRED fix. The function MUST match on `SExpr::String`/`Number`/`Bool` and return the corresponding TS type — `string`/`number`/`boolean` — for those variants. Falling back to `unknown` is acceptable only for non-literal variants (`Atom`, `Keyword`, `List`, `Null`), NOT as the answer for every case. If you find yourself writing `format!("...: unknown;")` without first matching against the SExpr literal variants, you are doing the wrong fix.
2. **Hard-code the single-file `.d.ts` to skip `deno.json` consultation** if it would be easy to add. The recommended default is to skip (single-file is dev-convenience), but if `read_project_config_optional` is already in `compile_source`, leveraging it is fine. Choose one; document the choice.
3. **Modify `dist.rs`'s existing `.d.ts` hook.** That part of M10 is correct; don't touch.
4. **Auto-pass `--allow-*` flags** to any tool.

---

## No two-turn pause for this iteration

The fixes are mechanical and well-specified. Single-turn implementation is appropriate. Proceed to implementation + tests + closing-report addendum in one turn.

If during implementation you discover something unexpected (e.g., the `compile_source` signature can't be cleanly extended without touching many callers; or the SExpr structure differs from what's documented above), STOP and surface. Otherwise proceed.

---

## Required reading

1. `workbench/m10-closing-cdc-review-2026-05-13.md` — the review identifying both findings.
2. `crates/lykn-lang/src/emitter/dts.rs` — current `emit_bind_inferred_dts` (line ~257) and `emit_dts_module` (line ~206).
3. `crates/lykn-cli/src/compile.rs::compile_source` — the single-file compile entry point.
4. `crates/lykn-cli/src/main.rs::cmd_compile` (around line 256) — the CLI dispatch.
5. `crates/lykn-cli/src/dist.rs` — reference for how the dist path handles `.d.ts` writes (your single-file implementation should match this pattern).
6. `crates/lykn-lang/src/ast/sexpr.rs` — `SExpr` enum (verified to have `String`, `Number`, `Bool`, `Null`, `Atom`, `Keyword`, `List` variants).

---

## Iteration estimate

1 turn. Mechanical implementation; well-specified; small.

Begin.
