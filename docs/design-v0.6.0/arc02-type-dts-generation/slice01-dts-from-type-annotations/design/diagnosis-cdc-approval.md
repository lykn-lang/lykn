# M10 Diagnosis — CDC Approval

**Reviewer:** Cowork Claude (CDC role)
**Reviewed artifact:** `workbench/m10-diagnosis-2026-05-13.md`
**Reviewed at:** 2026-05-13
**Disposition:** **APPROVED. Proceed to Turn 2.** Plus three small notes for CC to address in Turn 2 implementation — none blocking.

---

## Protocol observance

| Requirement | Status |
|---|---|
| Diagnosis as standalone artifact | ✓ (10602 bytes) |
| No implementation code in Turn 1 | ✓ (no `dts.rs` created; no `m10*` test files) |
| All 8 items addressed | ✓ |
| Each item with code references | ✓ |
| Stop-and-surface gates honored | ✓ (none fired; reasoning is sound) |

---

## Independent verification

CDC spot-checked four cited references:

- **`Constructor` struct at `crates/lykn-lang/src/ast/surface.rs:174`** — verified. Has `name: String`, `name_span: Span`, `fields: Vec<TypedParam>`, `span: Span`. CC's reference is accurate. ✓

- **`LyknMetadata` location** — CC cited "config.rs:52" without the crate prefix. Actual path is `crates/lykn-cli/src/config.rs:52`. Minor omission; not incorrect. The struct exists at the claimed line with the claimed fields. ✓ (note: cite full paths in the closing report)

- **`dist.rs:240` area** — verified. `fs::write(&js_path, js)` happens at line ~240. `classified` and `analysis_result.type_registry` are both already in scope. CC's pipeline-integration plan checks out. ✓

- **`:promise` as a built-in type** — verified at `crates/lykn-lang/src/emitter/type_checks.rs:88` (`"promise" => Some(list(...))`) and `:260` (tested). CC's 12th-arm addition (`:promise → Promise<unknown>`) is correct and aligned with existing runtime-check support. My original 10-question inventory missed this; CC caught it. ✓

---

## Architectural decisions worth acknowledging

### 1. `Constructor` (surface-level) vs `ConstructorDef` (type registry)

My prompt's pseudocode used `ConstructorDef` from `type_registry`. CC's diagnosis uses `Constructor` from the surface AST instead, with the explanation:

> "The `.d.ts` emitter should work from the `SurfaceForm::Type` variant directly (it has the full constructor info with typed fields). The registry is needed only for cross-reference resolution."

This is the better choice. The surface-level constructor has source-faithful info; the registry has the analyzed/normalized version. For declaration emission, surface-level is direct. **CC's adaptation is more architecturally correct than what I sketched.** Approved.

### 2. `:promise` added to the type-mapping table

CC found `:promise` documented in SKILL.md and implemented in `type_checks.rs:88`. CC adds `:promise → Promise<unknown>` (12 total type-mapping arms instead of 11). This is correct — `:promise` IS a built-in lykn type; my prompt missed it.

If the lykn type ever becomes `:promise(:type)` (parameterized) in future surface-syntax work, M10's mapping would need updating to `Promise<T>` instead of `Promise<unknown>`. For M10 scope, `Promise<unknown>` is the right answer.

### 3. Synthetic parameter names for destructured params

CC's diagnosis (line 64):

> "For destructured params in overload signatures, I'll use a synthetic parameter name (e.g., `arg0`, `arg1`) since the destructured field names aren't valid single-parameter names in TS."

This is a real design choice. The alternative would be TS destructuring patterns: `function f({host, port}: {host: string; port: number}): void`. CC's choice (synthetic `arg0`, `arg1`) is simpler and matches how TS overload signatures typically look. Both are valid; CC's choice is cleaner for the `.d.ts` use case (consumers don't care about parameter names in declarations).

---

## Three notes for Turn 2 (none blocking)

### Note A — Single-file `lykn compile` vs project-build `lykn build` paths

The diagnosis (line 165) acknowledges both paths exist and proposes that single-file `lykn compile` "can check for a per-package deno.json in the source file's directory and call the .d.ts emitter." Worth being explicit about TWO things in the implementation:

1. **Where does single-file `.d.ts` output go?** For `lykn compile foo.lykn -o foo.js`, the `.d.ts` could go to `foo.d.ts` (alongside). For `lykn compile foo.lykn` (stdout), the `.d.ts` has nowhere natural to go. Recommend: stdout-mode skips `.d.ts` generation; `-o`-mode writes `.d.ts` alongside. Document this in the closing report.

2. **Single-file `lykn compile` `.d.ts` behavior is a developer-iteration convenience.** The canonical `.d.ts` for publishing comes through `lykn build` → `target/lykn/build/<pkg>/`. The single-file behavior should be consistent but not load-bearing.

This isn't a stop-and-surface — CC's diagnosis describes both paths. Just make the choice explicit in Turn 2.

### Note B — Crate-prefixed paths in closing report

CC's diagnosis sometimes omits the crate prefix (e.g., "config.rs:52" instead of "crates/lykn-cli/src/config.rs:52"). The closing report's §"Production code path verification" should use full paths consistently — CDC's grep checks rely on them. Minor.

### Note C — Q5 warning semantics with `--config emit_dts: false`

If a package has `lykn.emitDts: false`, the `.d.ts` isn't generated. Should the Q5 warning ALSO be skipped? My prompt didn't specify. Two reasonable answers:

- **Skip the warning when `.d.ts` is off** — the warning is about TS-consumer type quality; if no `.d.ts` is being emitted, the warning's value is reduced.
- **Emit the warning regardless** — it documents missing `:returns` discipline regardless of output format.

Recommend: skip the warning when `emitDts: false`. The warning has no consumer value in that case. Document in the closing report.

This isn't structural; it's a minor semantic choice. CC should pick one and document.

---

## Risk-by-risk approval

### Risk 1 — TS emitter location
**Approved.** `crates/lykn-lang/src/emitter/dts.rs` sibling to existing emitter files. Module registration at `mod.rs:12`.

### Risk 2 — Type-mapping function shape
**Approved.** 12-arm match (11 prompt-specified + `:promise`). `lykn_type_to_ts(ann, registry)` signature is clean.

### Risk 3 — Multi-clause overload emission
**Approved.** `FuncClause` in `Vec<FuncClause>` represents overloads cleanly. Synthetic param names for destructured params per Note C.

### Risk 4 — ADT emission
**Approved.** `SurfaceForm::Type::constructors: Vec<Constructor>`. The `tag` field matches existing runtime emission.

### Risk 5 — Destructured param recursion
**Approved.** `default_value: Option<SExpr>` is the optional-field marker. Recursion via `Box<ParamShape>`.

### Risk 6 — Q5 warning emission path
**Approved.** Existing `Diagnostic` + `Severity::Warning` + `eprintln!` pattern. The `(content, warnings)` return shape is clean — caller prints. Plus the Note C clarification.

### Risk 7 — `LyknMetadata.emit_dts` parsing
**Approved.** One-field `Option<bool>` addition with `#[serde(rename = "emitDts")]`. `should_emit_dts()` defaults to `true`.

### Risk 8 — Pipeline integration
**Approved.** `.d.ts` write after `.js` write at `dist.rs:243`. Threading `emit_dts: bool` into `compile_lykn_sources`. Plus the Note A clarification on single-file mode.

---

## What CC does in Turn 2

Proceed with the implementation per the prompt:

1. **Deliverable 2** — code:
   - New file `crates/lykn-lang/src/emitter/dts.rs` with the type-mapping function, per-form emitters, file-level entry point.
   - `LyknMetadata.emit_dts` field added.
   - Pipeline hook in `dist.rs` after the `.js` write.
   - Q5 warning emission via existing `Diagnostic` channel.
   - `lykn compile` single-file behavior: `.d.ts` written alongside the `.js` when `-o` is used; skipped for stdout mode.
2. **Deliverable 3** — tests:
   - Unit tests in `dts.rs::mod tests` covering each type-mapping arm, each `ParamShape` variant, each emit function.
   - Integration tests for ADT, multi-clause, destructured params, optional defaults.
   - Q5 warning test.
   - Opt-out test (`lykn.emitDts: false`).
   - Mycelium acceptance gate (R-10) — verify `target/lykn/build/mycl-html/mod.d.ts` has expected declarations.
3. **Deliverable 4** — closing report:
   - Per-row ledger walk (R-1 through R-11).
   - Production code path verification with **full crate-prefixed paths** (per Note B).
   - Document the single-file `.d.ts` behavior choice (per Note A).
   - Document the Q5-warning-when-emit-disabled choice (per Note C).
   - Empirical gate output verbatim (cargo + lykn build && lykn test + verify-finding-e).

If during Turn 2 anything surfaces that requires deviating from the diagnosis, STOP and surface. The four-element discipline (pre-solve, two-turn, call-path trace, forbidden patterns) is operating in full force here.

---

## Acknowledgment

The diagnosis is rigorous. The two architectural adaptations (using surface-level `Constructor` instead of registry-level `ConstructorDef`; adding `:promise` to the type-mapping table) demonstrate that CC engaged with the design space rather than just executing the prompt mechanically. The DD-54-pattern continues: clean diagnostic discipline, honest discovery during diagnosis, no stop-and-surface dramas.

---

## Approval to proceed

CC: begin Turn 2.
