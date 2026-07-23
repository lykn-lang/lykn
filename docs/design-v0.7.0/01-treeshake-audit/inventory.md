# Emission inventory — what reaches module top level (ledger F-2)

**Status:** CDC static phase, 2026-07-07. Evidence strengths marked per row:
*verified* = CDC read the cited code directly; *agent-reported* = enumerated by
a lookup pass and spot-checked but not line-by-line re-read. CC's fixture
compiles (P1) are the reproduction step for every row here.

## Emission-path routing (feeds F-1)

Default `lykn compile` routes: reader → expander → resolver → analysis →
classifier → `emitter::emit(...)` (kernel forms) → `codegen::emit_module_js`
(`crates/lykn-cli/src/compile.rs:204-214`) — **native Rust codegen**.
*Verified* control flow: `bridge::kernel_json_to_js` is not called in the
standard pipeline; the bridge serves the cross-compiler coherence harness
(`crates/lykn-cli/tests/cross_compiler.rs`). The JS compiler
(`packages/lang/`) remains a live product path as the runtime/browser
compiler (dist `runtime` package kind, browser bundle), so F-8's
cross-emitter diff stays in scope. No deprecation markers on either path
(*agent-reported*).

## Rust codegen (`crates/lykn-lang`) — top-level emissions

| # | lykn form | Emitted top level | Site | Class | Strength |
|---|-----------|-------------------|------|-------|----------|
| R1 | `(bind x expr)` | `const x = <expr>;` | emitter/forms.rs:599-646, codegen/emit.rs:443-459 | pure decl (initializer purity separate — see R10) | verified |
| R2 | `(bind :type x <non-literal>)` | `const x = ...;` **followed by** `if (<negated check>) throw new TypeError(...)` | emitter/forms.rs:626-645, emitter/type_checks.rs:28-45 | **load-time effect** (H3) — skipped when `strip_assertions` (CLI flag, main.rs:48) or literal initializer | verified |
| R3 | `(func name :args ... :body ...)` | `function name(...) {...}` | emitter/forms.rs:206-212, codegen/emit.rs:516-538 | pure decl | agent-reported |
| R4 | `(type Enum A B)` | `const A = {tag:"A"}; ...` | emitter/forms.rs:1070-1122 | pure decl (object literal) | agent-reported |
| R5 | `(type Rec (x :t) ...)` | `function Rec(x){return {tag:"Rec", x};}` | emitter/forms.rs:1070-1122 | pure decl | agent-reported |
| R6 | `(match ...)` statement position | target `const` + `if/else` chain | emitter/forms.rs:1859-1940 | effect only if arms effect (user code) | agent-reported |
| R7 | `(match ...)` **expression position** (e.g. bind initializer) | `((() => {...})())` IIFE; **`(await (async () => {...})())` if body awaits** | emitter/forms.rs:1943-2050 | **shake hazard** (H1); await variant ⇒ **top-level await** (H2) | agent-reported; fixture f04 reproduces |
| R8 | `(cell init)` | `{value: init}` object (inside enclosing `const`) | emitter/forms.rs:687-696 | pure decl | verified (site read) |
| R9 | `(template "...")` / ICU | template literal; ICU plural/select lowers to conditional/IIFE shape | codegen/emit.rs:1267-1317, codegen/icu.rs | plain: pure; ICU-in-top-level-bind: potential hazard (H4) | agent-reported; fixture f07 probes |
| R10 | any call/`new` in a top-level initializer | `const x = f(...);` | codegen/emit.rs:104-147 | **shake hazard** (H5): bundlers assume calls effectful; **no `/*#__PURE__*/` emitted anywhere** (grep: zero hits in codegen/) | verified (grep) |
| R11 | bare top-level expression | `<expr>;` ExpressionStatement | codegen/emit.rs:104-147 | user-intent effect (by design) | agent-reported |
| R12 | `(import "m")` bare | `import "m";` | codegen/emit.rs:1539-1613 | side-effect import (user intent) | agent-reported |
| R13 | import/export named/default/re-export | standard ESM decls | codegen/emit.rs:1539-1675 | pure | agent-reported |
| R14 | prelude/helpers | **none injected** | codegen/mod.rs:39-49 | — | agent-reported |

## JS compiler (`packages/lang`) — top-level emissions

Parallel grammar, same broad shape (*agent-reported*): no prelude injection;
no PURE annotations; `cell` → ObjectExpression; expression-position `match` →
IIFE; typed `bind` may emit declaration + check statements. The exact
statement shapes are what F-8's diff pins down — differences in the *hazard
rows* (R2, R7, R9, R10 equivalents) matter most.

## dist metadata (feeds F-9)

`write_package_json` (crates/lykn-cli/src/dist.rs:503-542) emits no
`sideEffects` field (*verified*, grep 2026-07-07). No shaking-relevant
fields in generated `deno.json` observed; CC re-verifies at close.

## Hazard register (drives fixtures + predictions)

- **H1** expression-position `match` → un-annotated IIFE call at top level
- **H2** `match` with `await` in expression position → top-level await
  (blocks DCE of the statement *and* constrains bundle format)
- **H3** typed `bind` (non-literal) → top-level `if/throw` type check
  (unless `--strip-assertions`)
- **H4** ICU plural/select in a top-level binding → IIFE-shaped lowering
- **H5** any user call in a top-level initializer, un-annotated (no PURE
  machinery exists in either emitter)
- **H6** no `sideEffects` metadata in dist output
