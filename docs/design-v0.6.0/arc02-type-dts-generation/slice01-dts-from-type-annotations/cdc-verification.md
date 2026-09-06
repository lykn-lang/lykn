# M10 Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role)
**Reviewed artifact:** `workbench/2026-05-13-M10-closing-report.md`
**Reviewed at:** 2026-05-13
**Disposition:** **Accepted with two findings.** The core work is solid; the mycelium acceptance gate passes; the architecture is clean. Two real issues to address — one is a deviation from the prompt's Q6=A spec; one is a latent correctness bug. Both are small fixes; recommend folding into this iteration rather than fast-follow.

---

## Protocol checklist

| Requirement | Status |
|---|---|
| Per-row ledger walk | ✓ R-1 through R-11 |
| Production code path verification with crate-prefixed paths | ✓ Note B satisfied |
| Empirical gates green | ✓ 964 Rust (= 943 + 21 new) + 1197 JS |
| Mycelium acceptance gate (R-10) | ✓ `target/lykn/build/mycl-html/{mod,render}.d.ts` have expected declarations |
| Diagnosis-then-pause honored | ✓ |
| Two-turn structure | ✓ |

---

## Structural verification (independent)

CDC verified the implementation at file:line:

- **`crates/lykn-lang/src/emitter/dts.rs`** — 17317 bytes, 7 named functions (`lykn_type_to_ts`, `param_shape_to_ts`, `emit_func_args`, `emit_func_dts`, `emit_type_dts`, `emit_bind_dts`, `emit_dts_module`) plus 3 helpers (`emit_bind_inferred_dts`, `emit_constructor_fn_dts`, `format_sexpr_brief`). ✓
- **`crates/lykn-lang/src/emitter/mod.rs`**: `pub mod dts;` ✓
- **`crates/lykn-cli/src/config.rs:64`**: `pub emit_dts: Option<bool>` with `#[serde(rename = "emitDts")]` ✓
- **`crates/lykn-cli/src/dist.rs` hook (lines ~245+)**: conditional emit; calls `emit_dts_module`; prints warnings; writes `.d.ts` with the nice optimization of `if !dts_content.is_empty()` to avoid writing empty `.d.ts` files ✓
- **Test count**: 21 new unit tests (42 lines matching `#[test]`/`fn test_` patterns × 2 lines per test = 21 tests). Matches CC's claim. ✓
- **Math**: 943 (post-DD-54 baseline) + 21 (M10 new) = 964 Rust ✓

---

## Two architectural additions worth acknowledging

CC added two functions beyond what my prompt sketched. Both are correct architectural responses to gaps the prompt didn't anticipate.

### 1. `emit_constructor_fn_dts` — closes a real ADT gap

For `(type Option (Some :any value) None)`, lykn emits at runtime BOTH the discriminated union type AND value-level constructor functions (e.g., `function Some(value) { return {tag: "Some", value}; }`). Without value-level declarations in the `.d.ts`, TS consumers could see `Option` as a type but couldn't call `Some(42)`.

CC's `emit_constructor_fn_dts`:
- Nullary constructors → `export const None: Option;`
- Constructors with fields → `export function Some(value: unknown): Option;`

This is **necessary** for typed TS consumers to actually use lykn ADTs. My prompt's pseudocode missed it; CC caught it. ✓

### 2. `emit_bind_inferred_dts` — handles untyped `(bind ...)` exports

For `(export (bind VERSION "0.1.1"))` (no type annotation), CC added a fallback emitter. **But the implementation always emits `string`** regardless of the bind value's actual type. See Finding #2 below.

---

## Finding #1 — Single-file `lykn compile` does NOT emit `.d.ts` (deviation from Q6=A)

My prompt's Q6=A: "Emit `.d.ts` during `lykn compile`, parallel to `.js`."

CC's implementation hooks `.d.ts` emission into `dist.rs::compile_lykn_sources` (invoked by `lykn build`). It does NOT hook into `compile.rs::compile_source` (the single-file `lykn compile` path).

CDC verified: `grep -nE "dts|emit_dts" crates/lykn-cli/src/compile.rs` returns **zero matches**. Single-file `lykn compile foo.lykn` produces only the `.js`, no `.d.ts`.

This deviates from the prompt's literal Q6=A spec AND from Note A in my diagnosis approval (which asked CC to pick a single-file behavior and document it). CC neither implemented it nor documented why it's skipped.

### Severity

Modest. The canonical publish path is `lykn build` → `lykn dist`, not single-file `lykn compile`. Real-world consumers shipping to JSR use the build path. The single-file `lykn compile` is a developer-iteration convenience; its `.d.ts` would mostly be debugging-quality.

But the deviation is real:
- The prompt's Q6=A was unambiguous: emit during `lykn compile`.
- CC didn't surface this as a mid-implementation discovery requiring amendment.
- CC didn't document the choice in the closing report.

### Resolution options

- **A. Small fix now.** Add a `.d.ts` write to `compile.rs::compile_source` (only when `-o <path>` is specified; skip for stdout-mode). ~10 lines of code. Closing report addendum.
- **B. Accept as documented limitation.** Add a paragraph to the closing report explaining: "Single-file `lykn compile` skips `.d.ts` emission by design; the canonical `.d.ts` path is `lykn build`. Rationale: single-file compile is a dev-iteration command, `.d.ts` is a publish-target artifact."
- **C. Fast-follow.** Log as a 0.7.0 candidate; move on.

CDC lean: **A.** The work is small; the spec deviation is closed; consistency with Q6=A is restored. If A is too much friction, B is acceptable but should be explicit in the closing report.

---

## Finding #2 — `emit_bind_inferred_dts` always emits `string` (latent correctness bug)

For `(export (bind NAME value))` with no type annotation, CC's `emit_bind_inferred_dts` hardcodes:

```rust
format!("{modifier}const {js_name}: string;\n")
```

For mycelium's `(export (bind VERSION "0.1.1"))`, this produces `export const VERSION: string;` — **coincidentally correct** because VERSION is a string literal.

But for `(export (bind COUNT 42))` (an untyped numeric bind), the same code path produces `export const COUNT: string;` — **wrong**. TS consumers using `COUNT` would think it's a string and may even pass it to functions expecting `string`, triggering runtime type confusion.

### Why this matters

Lykn surface allows `(bind NAME value)` without a type annotation. Users will write this. The `.d.ts` output for these binds needs to either:
- Infer from the value expression's literal type (if `value` is `42` → emit `number`; if `"foo"` → `string`; etc.)
- Default to `unknown` (TS-idiomatic safe fallback)
- Emit a Q5-style warning + `unknown` fallback (warning encourages explicit typing)

CC's choice (hardcoded `string`) is the **worst of all options** — incorrect by default; gives consumers false confidence.

### Severity

Real but bounded. Works correctly for string-literal binds (which is most of what mycelium currently has). Wrong for any other primitive. Subtle: the user gets a green build but the TS consumer sees wrong types.

### Resolution options

- **A. Infer from value expression.** Look at the bind's `value: SExpr`; if it's a string literal → `string`, number literal → `number`, boolean → `boolean`, otherwise → `unknown`. ~10 lines of match arms. Most correct.
- **B. Always emit `unknown`.** Safe; conservative; never wrong. Loses convenience for the string-literal case.
- **C. Warn + emit `unknown`.** Analogous to Q5's discipline: nudge library authors toward explicit type annotations.

CDC lean: **A.** Inference for primitive literals is mechanical; gives the right answer for the common case (string/number/boolean literals). For non-literal values (calls, computed expressions), fall back to `unknown`. The implementation is ~15 lines.

If A is too much friction, **B** is safer than the current `string` default. Either is better than the status quo.

---

## What CC's closing report did NOT address (from CDC's diagnosis approval)

- **Note A — Single-file `.d.ts` behavior**: not documented; not implemented. (Finding #1.)
- **Note B — Full crate-prefixed paths**: satisfied ✓
- **Note C — Q5 warning when `emit_dts: false`**: not documented; but the implementation naturally skips both emit AND warning when `emit_dts: false` (the warning is part of `emit_dts_module` which isn't called). That's a reasonable design choice; just not surfaced in the closing report. **Acceptable.**

---

## What's right (most of the milestone)

- The 12-arm type-mapping table (including the bonus `:promise` arm) emits correct TS.
- ADT discriminated unions + constructor functions (the two-emit pattern CC added) are architecturally complete.
- Multi-clause function overloads work.
- Destructured params with optional defaults (`?:`) emit correctly.
- Q5 warning fires for funcs without `:returns`; falls back to `unknown`.
- `LyknMetadata.emit_dts` opt-out via `deno.json` flows through cleanly.
- The dist.rs hook with the empty-`.d.ts` skip is a thoughtful detail.
- Mycelium acceptance produces clean output:
  ```typescript
  // mod.d.ts
  export const VERSION: string;

  // render.d.ts
  export function html(hiccup: unknown): string;
  ```
- 21 new unit tests covering type-mapping, ParamShape variants, ADT emission, multi-clause overloads, Q5 warning.

The work is real, structurally sound, and produces correct output for mycelium's actual use case. The two findings are not closure-blocking but they ARE real.

---

## Recommendation

**Option α — Address both findings in a small follow-up commit** (CDC lean):

1. Add `.d.ts` write to `compile.rs::compile_source` for `-o`-mode (Finding #1, Option A).
2. Add literal-type inference to `emit_bind_inferred_dts` (Finding #2, Option A) — or at minimum fall back to `unknown` instead of `string`.
3. Update the M10 closing report with the additions and a brief Note about the resolved findings.

~25 lines of code total; no design surface; closing report addendum. Cleanest end-state.

**Option β — Accept closure; log both as fast-follows.**

1. M10 closes as-is.
2. Fast-follow #1: single-file `lykn compile` `.d.ts` emission.
3. Fast-follow #2: `emit_bind_inferred_dts` correctness.

This is faster but leaves a known bug (Finding #2) and a known spec deviation (Finding #1) in shippable code.

CDC strongly recommends **α** because:
- Finding #2 is a real correctness bug that will silently produce wrong TS for any non-string untyped bind.
- The fixes are mechanical (~25 lines total).
- The dep-ergo thread's discipline standard is "if the fix is small and clearly necessary, do it in the current iteration rather than fast-follow."

---

## Acknowledgment

The implementation work is genuinely good. CC's architectural additions (`emit_constructor_fn_dts`, `emit_bind_inferred_dts`) demonstrate engagement with the design space. The Q5 warning mechanism is clean. The dist.rs hook is well-integrated. The mycelium acceptance gate produces correct output.

The two findings are about edge cases CC didn't think hard enough about:
- **Finding #1**: single-file path is a literal-prompt deviation; CC interpreted "during `lykn compile`" too narrowly (only `dist`, not single-file).
- **Finding #2**: `emit_bind_inferred_dts` was added beyond the prompt but its default ("string") was chosen without thinking through non-string cases.

Both are addressable with small focused fixes; neither requires re-doing the milestone.

---

## Open inputs for Duncan

1. **Option α (small fix in this iteration) or β (accept as fast-follows)?** CDC strongly recommends α.
2. **If α: shall I write a focused CC prompt** for the two small fixes? Or are they small enough to skip the full prompt protocol?
3. **The dep-ergo thread's work is essentially complete after M10's closure.** Per my earlier rundown, 0-1 substantive iterations remaining (just the optional methodology retrospective). Worth a moment of acknowledgment when this closes.
