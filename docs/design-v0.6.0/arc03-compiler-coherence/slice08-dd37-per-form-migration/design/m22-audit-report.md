# M22.5-1 Audit Report — Fresh CC

**Auditor:** Claude Code (fresh Opus 4.6 instance, no prior context)
**Date:** 2026-05-23 (audit of 2026-05-18 state)
**Pre-M22 reference SHA:** `4cfa4c2` (M21-7: pilot delta + extrapolation recorded in DD-37)
**Post-M22 current SHA:** `ddb2aa5` (HEAD, includes DD-58 refinement post-M22)

---

## Methodology compliance attestation

I attest that during this audit:
- [x] I did not read the M22 closing report before completing the
  audit table.
- [x] I did not read the M22 CDC review at all during the audit.
- [x] I did not use subagent delegation for any verification.
- [x] I did not modify any source file.
- [x] Each row in the table below was verified by reading the
  actual code (citations included).

---

## Per-form audit table

**Methodology:** For each form, I (a) read the pre-M22 implementation in `/tmp/pre-m22-surface.js` (extracted via `git show 4cfa4c2:packages/lang/surface.js`), (b) read the current `classifier.js` case and `emitSurfaceForm` case, (c) verified `registerSurfaceMacros` no longer registers the form, (d) compared implementation bodies.

### Batch 1 — Mutation primitives

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `swap!` | classifier.js inline emit | classifier.js:27-29 (classify), classifier.js:165-168 (emit) | `MOVED_WITH_EDITS_OPTION_C` | Logic equivalent. Pre-M22 used `kernelArray()`, post-M22 uses plain `array()`. | Pre: `return kernelArray(sym("="), cellValue, array(fn, cellValue, ...extraArgs));` Post: `return array(sym("="), cellValue, array(node.fn, cellValue, ...node.extraArgs));` | `_kernel` marker no longer emitted on swap! output — behavioral difference for expander routing |
| `reset!` | classifier.js inline emit | classifier.js:31-33 (classify), classifier.js:169 (emit) | `MOVED_WITH_EDITS_OPTION_C` | Logic equivalent. Pre-M22 used `kernelArray()`, post uses `array()`. | Pre: `return kernelArray(sym("="), sym(\`\${cell.value}:value\`), args[1]);` Post: `return array(sym("="), sym(\`\${node.cell.value}:value\`), node.value);` | Same `_kernel` change as swap! |
| `set!` | classifier.js inline emit | classifier.js:34-38 (classify), classifier.js:170-171 (emit) | `MOVED_WITH_EDITS_OPTION_C` | Substantively same logic. Pre-M22 used `kernelArray()`, post uses `array()`. | Post emit: `return array(sym("="), node.target, node.value);` | Validation logic in classify, emit logic is 1 line |
| `set-symbol!` | classifier.js inline emit | classifier.js:39-41 (classify), classifier.js:172-173 (emit) | `MOVED_WITH_EDITS_OPTION_C` | Same logic. Pre-M22 used `kernelArray()`, post uses `array()`. | Post emit: `return array(sym("="), array(sym("get"), node.obj, node.key), node.value);` | Same `_kernel` change |

### Batch 2 — Collection ops

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `conj` | classifier.js inline emit | classifier.js:43-44 (classify), classifier.js:175 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic; pre-M22 did not use `kernelArray()`. | Post emit: `return array(sym("array"), array(sym("spread"), node.arr), node.item);` | Clean extraction |
| `assoc` | classifier.js inline emit | classifier.js:45-54 (classify), classifier.js:176-179 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: `const pairs = node.pairs.map(p => array(sym(p.key), p.value)); return array(sym("object"), array(sym("spread"), node.obj), ...pairs);` | Validation in classify; emit logic matches pre-M22 |
| `dissoc` | classifier.js inline emit | classifier.js:55-63 (classify), classifier.js:180-187 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit builds `aliasPatterns`, `restVar`, `pattern`, `binding`, `arrowBody`, returns `array(arrowBody)` — same structure as pre-M22. | Clean extraction |

### Batch 3 — Threading macros

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `->` | classifier.js inline emit | classifier.js:64-66 (classify), classifier.js:188-208 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic to pre-M22 `buildThread(args, "first")`. | Post emit (Thread case): same `isKw`/`isArr` step logic, position-based insertion. | Clean extraction; pre-M22 was a scoped `function buildThread()` inside `registerSurfaceMacros` |
| `->>` | classifier.js inline emit | classifier.js:67-69 (classify), classifier.js:188-208 (emit, shared Thread case) | `MOVED_EXACTLY_OPTION_C` | Same as `->`, uses `position === "last"` branch. | `return Thread("last", args[0], args.slice(1));` | Shares emit case with `->` |
| `some->` | classifier.js inline emit | classifier.js:70-72 (classify), classifier.js:209-243 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic to pre-M22 `buildSomeThread(args, "first")`. | Post emit (SomeThread case): same `gensym("t")`, `null` check, step iteration, IIFE wrap. | Clean extraction |
| `some->>` | classifier.js inline emit | classifier.js:73-75 (classify), classifier.js:209-243 (emit, shared SomeThread case) | `MOVED_EXACTLY_OPTION_C` | Same as `some->`, uses `position === "last"` branch. | `return SomeThread("last", args[0], args.slice(1));` | Shares emit case with `some->` |

### Batch 4 — Binding macros

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `if-let` | classifier.js inline emit | classifier.js:76-81 (classify), classifier.js:244-259 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic; uses `compileLetPattern` from surface-helpers.js. | Post emit: `const result = compileLetPattern(pattern, tempVar); ... stmts.push(array(sym("if"), condition, array(sym("block"), ...thenBlock), ...))` | Delegates to `compileLetPattern` helper (re-exported from surface.js — see helpers table) |
| `when-let` | classifier.js inline emit | classifier.js:82-87 (classify), classifier.js:260-272 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: uses `compileLetPattern`, `wrapReturnLast`, same IIFE wrap pattern. | Same helper dependency as if-let |

### Batch 5 — Anonymous functions

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `fn` | classifier.js inline emit | classifier.js:88-93 (classify), classifier.js:273-282 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic to pre-M22 `fnMacro`. | Post emit: `return array(sym("=>"), array(...pNames), ...typeChecks, ...wrapReturnLast(node.bodyForms));` | Uses `parseTypedParams`, `paramNameNodes`, `paramTypeChecks`, `wrapReturnLast` — all imported from helpers/surface |
| `lambda` | classifier.js inline emit | classifier.js:88-93 (classify, shared case with fn) | `MOVED_EXACTLY_OPTION_C` | Same implementation as `fn` (shared `case "lambda":` falls through to `case "fn":`). | `case "fn": case "lambda": { ... return Fn(args[0], args.slice(1)); }` | Pre-M22 used `macroEnv.set("lambda", fnMacro)` — now a shared classify case |

### Batch 6 — Logical n-ary

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `and` | classifier.js inline emit | classifier.js:94-96 (classify), classifier.js:283-286 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: `let result = node.args[0]; for (let i = 1; ...) result = array(sym("&&"), result, node.args[i]); return result;` | Matches pre-M22 exactly |
| `or` | classifier.js inline emit | classifier.js:97-99 (classify), classifier.js:287-290 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: same pattern with `sym("||")`. | Matches pre-M22 exactly |

### Batch 7 — Small surface forms

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `express` | classifier.js inline emit | classifier.js:100-103 (classify), classifier.js:293 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: `return sym(\`\${node.cell.value}:value\`);` | Single-line emit, clean extraction |
| `obj` | classifier.js inline emit | classifier.js:104-112 (classify), classifier.js:294-301 (emit) | `MOVED_WITH_EDITS_OPTION_C` | Logic equivalent but differs: pre-M22 used `kernelArray()` to build pairs, post-M22 uses `pair._kernel = true` directly. | Post emit: `const pair = array(sym(p.key), p.value); pair._kernel = true;` Pre: `pairs.push(kernelArray(sym(args[i].value), args[i + 1]));` | Functionally identical; different mechanism for `_kernel` marking |
| `cell` | classifier.js inline emit | classifier.js:113-115 (classify), classifier.js:303 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: `return array(sym("object"), array(sym("value"), node.value));` | Clean extraction |
| `type` | classifier.js → surface.js delegation | classifier.js:141-143 (classify), classifier.js:365-366 (emit delegates) | `DELEGATED_VIA_CALL_OPTION_A` | Emit body lives at surface.js:1436-1501 (`emitTypeMacro`). classifier.js line 366: `return emitTypeMacro([node.typeName, ...node.constructors]);` | Delegation: `case "TypeDef": return emitTypeMacro([node.typeName, ...node.constructors]);` Function at surface.js:1436: `export function emitTypeMacro(args) { ... }` | ~66 lines of implementation remain in surface.js. Body is the original macro body extracted to top-level |
| `genfn` | classifier.js inline emit | classifier.js:133-136 (classify), classifier.js:346-362 (emit) | `MOVED_EXACTLY_OPTION_C` | Logic equivalent to pre-M22 `genfnMacro` body. | Post emit: parses yields type, calls `parseTypedParams`, `paramNameNodes`, `paramTypeChecks`, `instrumentYields`, builds `function*` array. | Uses `instrumentYields` imported from surface.js — a delegation dependency but the emit logic itself is inline |

**Note on `do`:** The ledger lists `do` in batch 7. `do` was **never registered as a macro** in `surface.js`'s `registerSurfaceMacros` — it does not appear in the pre-M22 baseline at all. It is not present in `classifier.js` either. `do` was not a surface form; it was out of scope. Status: `NOT_IN_SCOPE`.

### Batch 8 — Large forms

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `func` | classifier.js partially inline, partially delegated | classifier.js:125-128 (classify), classifier.js:334-343 (emit) | `DELEGATED_VIA_CALL_OPTION_A` | Emit is 9 lines inline, but delegates the actual work to `buildSingleClauseFunc` (surface.js:947-1101, 155 lines) and `buildMultiClauseFunc` (surface.js:1104-1318, 215 lines) — both imported from surface.js. | Emit: `return buildMultiClauseFunc(funcName, nameNode, restArgs);` / `return buildSingleClauseFunc(funcName, nameNode, restArgs);` | Zero-arg shorthand is inline; all substantive logic delegates to surface.js |
| `genfunc` | classifier.js → surface.js delegation | classifier.js:129-132 (classify), classifier.js:344-345 (emit delegates) | `DELEGATED_VIA_CALL_OPTION_A` | Emit body lives at surface.js:1508-1580 (`emitGenfuncMacro`). | Delegation: `case "GenFunc": return emitGenfuncMacro([node.nameNode, ...node.restArgs]);` Function at surface.js:1508: `export function emitGenfuncMacro(args) { ... }` | ~73 lines of implementation remain in surface.js |
| `match` | classifier.js → surface.js delegation | classifier.js:137-139 (classify), classifier.js:363-364 (emit delegates) | `DELEGATED_VIA_CALL_OPTION_A` | Emit body lives at surface.js:1319-1434 (`emitMatchMacro`). | Delegation: `case "Match": return emitMatchMacro([node.expr, ...node.clauses]);` Function at surface.js:1319: `export function emitMatchMacro(args) { ... }` | ~116 lines of implementation remain in surface.js |
| `bind` | classifier.js inline emit | classifier.js:116-118 (classify), classifier.js:305-322 (emit) | `MOVED_WITH_EDITS_OPTION_C` | Logic equivalent to pre-M22. Restructured to operate on `node.args` array. | Post emit: `const a = node.args; if (a[0].type === "keyword") { ... const check = buildTypeCheck(nameNode, typeKw, "bind", ""); return check === null ? constDecl : array(sym("block"), constDecl, check); } return array(sym("const"), a[0], a[1]);` | Emit logic inline in classifier.js. Uses `getLiteralType`, `typeMatchesLiteral`, `buildTypeCheck` from surface.js via helpers |

### Batch 9 — Special-case forms

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `=` | classifier.js inline emit | classifier.js:119-121 (classify), classifier.js:323-330 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic to pre-M22 (n-ary chaining `===`). | Post emit: `if (node.args.length === 2) return array(sym("==="), node.args[0], node.args[1]); const checks = []; ...` | Clean extraction; flavor (c) emit transformation to `===` |
| `!=` | classifier.js inline emit | classifier.js:122-124 (classify), classifier.js:332-333 (emit) | `MOVED_EXACTLY_OPTION_C` | Identical logic. | Post emit: `return array(sym("!=="), node.a, node.b);` | Clean extraction; flavor (c) emit transformation to `!==` |
| `macro` | classifier.js inline | N/A | `NOT_IN_SCOPE` | Was never a registered macro in `surface.js`. Handled by expander.js walk table (expander.js:674). | expander.js:674: `"macro": { walk: "register-macro" }` | Not a surface form — macro-system primitive handled by expander |
| `import-macros` | classifier.js inline | N/A | `NOT_IN_SCOPE` | Was never a registered macro in `surface.js`. Handled by expander.js walk table (expander.js:685). | expander.js:685: `"import-macros": { walk: "import-macros" }` | Not a surface form — macro-system primitive handled by expander |

### M21 pilot (verify not duplicated)

| Form | Expected location | Actual location (file:line) | Status code | Body equivalence vs. pre-M22 | Evidence quote | Notes |
|------|------------------|----------------------------|-------------|------------------------------|----------------|-------|
| `not` | classifier.js inline emit | classifier.js:21-25 (classify), classifier.js:162-163 (emit) | `MOVED_EXACTLY_OPTION_C` | Present in classifier.js; NOT duplicated in `registerSurfaceMacros`. | `case "not": ... return Not(args[0]); ... case "Not": return array(sym("!"), node.operand);` | Already migrated in M21; no duplication found |

---

## Per-helper audit table

**9 helpers named in CDC 2026-05-17 directive, plus additional helpers discovered.**

| Helper | Expected location | Actual location (file:line) | Status code | Evidence quote | Notes |
|--------|------------------|----------------------------|-------------|----------------|-------|
| `compileLetPattern` | surface-helpers.js | Defined: surface.js:890-916. Re-exported: surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | surface-helpers.js:52: `export { isPascalCase, compilePattern, andChain, getLiteralType, typeMatchesLiteral, buildTypeCheck, compileLetPattern, parseTypedParams, paramNameNodes, paramTypeChecks } from "./surface.js";` | Body (27 lines) remains in surface.js |
| `wrapReturnLast` | surface-helpers.js | Defined: surface-helpers.js:35-43 | `MOVED_TO_HELPERS_FILE` | surface-helpers.js:35: `export function wrapReturnLast(bodyForms) { if (bodyForms.length === 0) return []; ...` | Actually moved. 9 lines, fully defined in helpers file |
| `buildTypeCheck` | surface-helpers.js | Defined: surface.js:89-192. Re-exported: surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Same re-export line as compileLetPattern | Body (104 lines) remains in surface.js |
| `formatSExpr` | surface-helpers.js | Defined: expander.js. Re-exported: surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | surface-helpers.js:6-12: `import { sym, array, gensym, isKeyword, isArray, formatSExpr } from "./expander.js";` line 16: `export { sym, array, gensym, isKeyword, isArray, formatSExpr, toJsIdentifier };` | Was never in surface.js — always lived in expander.js. Re-export is convenience, not extraction |
| `toJsIdentifier` | surface-helpers.js | Defined: compiler.js. Re-exported: surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | surface-helpers.js:13: `import { toJsIdentifier } from "./compiler.js";` line 16: `export { ... toJsIdentifier };` | Was never in surface.js — always lived in compiler.js |
| `gensym` | surface-helpers.js | Defined: expander.js. Re-exported: surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | Same re-export pattern as formatSExpr | Was never in surface.js. Convenience re-export |
| `isKeyword` | surface-helpers.js | Defined: expander.js. Re-exported: surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | Same re-export pattern | Was never in surface.js |
| `isArray` | surface-helpers.js | Defined: expander.js. Re-exported: surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | Same re-export pattern | Was never in surface.js |
| `isSymbol` | surface-helpers.js | NOT present in surface-helpers.js at all | `MISSING_ENTIRELY` | `isSymbol` defined at expander.js:104 but not imported or re-exported by surface-helpers.js. Not used by classifier.js. | Named in directive but never extracted. Possibly not needed by classifier |

### Additional helpers discovered (not in directive, but in surface-helpers.js or cross-boundary)

| Helper | Location | Status code | Evidence | Notes |
|--------|----------|-------------|----------|-------|
| `sym` | expander.js → surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | Convenience re-export for classifier.js | |
| `array` | expander.js → surface-helpers.js:16 | `RE_EXPORTED_FROM_THIRD_FILE` | Convenience re-export | |
| `isStatementOnlyForm` | surface-helpers.js:26-33 | `MOVED_TO_HELPERS_FILE` | Actually defined in helpers file (8 lines + `STATEMENT_ONLY_HEADS` constant) | |
| `kernelArray` | surface-helpers.js:45-49 | `MOVED_TO_HELPERS_FILE` | Defined in helpers file. `export function kernelArray(...items) { const node = array(...items); node._kernel = true; return node; }` | New helper, not extracted from surface.js |
| `isPascalCase` | surface.js:40-42 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Body in surface.js, aliased via re-export | |
| `compilePattern` | surface.js:694-879 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | 186 lines remain in surface.js | |
| `andChain` | surface.js:880-888 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Body in surface.js | |
| `getLiteralType` | surface.js:47-76 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Body in surface.js | |
| `typeMatchesLiteral` | surface.js:78-87 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Body in surface.js | |
| `parseTypedParams` | surface.js:624-692 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | 69 lines remain in surface.js | |
| `paramNameNodes` | surface.js:474-520 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Body in surface.js | |
| `paramTypeChecks` | surface.js:522-556 → re-exported from surface-helpers.js:52 | `ALIASED_FROM_SOURCE` | Body in surface.js | |
| `buildSingleClauseFunc` | surface.js:947-1101 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports directly from surface.js | 155-line function, not in helpers |
| `buildMultiClauseFunc` | surface.js:1104-1318 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports directly from surface.js | 215-line function, not in helpers |
| `emitMatchMacro` | surface.js:1319-1434 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports directly from surface.js | 116-line function |
| `emitTypeMacro` | surface.js:1436-1501 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports directly from surface.js | 66-line function |
| `emitGenfuncMacro` | surface.js:1508-1580 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports directly from surface.js | 73-line function |
| `instrumentYields` | surface.js:918-945 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports from surface.js | 28 lines, used by GenFn emit in classifier |
| `parseKeywordClauses` | surface.js:193-217 | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports from surface.js | Used by genfunc/func delegated emitters |
| `typeRegistry` | surface.js:27 (Map) | `STILL_IN_SOURCE_DIRECT_IMPORT` | classifier.js:8 imports from surface.js | Shared mutable state |

---

## Substantive checks

### A. `_kernel` marker emissions

**Findings:**

`_kernel` appears in 3 files across `packages/lang/`:

1. **surface-helpers.js:47** — `kernelArray()` function sets `node._kernel = true`. This is used by:
   - No direct calls from classifier.js's `emitSurfaceForm`. However, classifier.js does import `kernelArray` (line 7).

2. **classifier.js:298** — Direct `pair._kernel = true` in the `Obj` emit case. This is a new `_kernel` emission point created during M22 (replacing `kernelArray()` usage from pre-M22).

3. **expander.js:733, 740, 746, 751** — The expander's classifier-integration code reads/sets `_kernel` for dispatch routing.

**Impact on DD-37 step 4 (`_kernel` retirement):**

The `_kernel` marker is still actively emitted by:
- classifier.js:298 (`Obj` case) — `pair._kernel = true`
- The delegated functions in surface.js (`emitMatchMacro`, `emitTypeMacro`, `emitGenfuncMacro`) use `kernelArray()` internally which sets `_kernel`
- `surface-helpers.js` defines `kernelArray()` which is the `_kernel` emission helper

Step 4 is **partially blocked**: the dispatch routing uses `_kernel` in expander.js, and some emit paths still produce `_kernel`-marked output. Retirement would require modifying both classifier.js's Obj case and the delegated surface.js emit functions.

### B. `surface-helpers.js` shape

**Line count:** 52 lines.

**Exports breakdown:**

| Export | Status | Notes |
|--------|--------|-------|
| `sym` | RE_EXPORTED from expander.js | Convenience |
| `array` | RE_EXPORTED from expander.js | Convenience |
| `gensym` | RE_EXPORTED from expander.js | Convenience |
| `isKeyword` | RE_EXPORTED from expander.js | Convenience |
| `isArray` | RE_EXPORTED from expander.js | Convenience |
| `formatSExpr` | RE_EXPORTED from expander.js | Convenience |
| `toJsIdentifier` | RE_EXPORTED from compiler.js | Convenience |
| `isStatementOnlyForm` | MOVED_TO_HELPERS_FILE | Actually defined here (lines 18-33) |
| `wrapReturnLast` | MOVED_TO_HELPERS_FILE | Actually defined here (lines 35-43) |
| `kernelArray` | MOVED_TO_HELPERS_FILE | Actually defined here (lines 45-49) |
| `isPascalCase` | ALIASED_FROM_SOURCE | line 52: `export { ... } from "./surface.js"` |
| `compilePattern` | ALIASED_FROM_SOURCE | line 52 |
| `andChain` | ALIASED_FROM_SOURCE | line 52 |
| `getLiteralType` | ALIASED_FROM_SOURCE | line 52 |
| `typeMatchesLiteral` | ALIASED_FROM_SOURCE | line 52 |
| `buildTypeCheck` | ALIASED_FROM_SOURCE | line 52 |
| `compileLetPattern` | ALIASED_FROM_SOURCE | line 52 |
| `parseTypedParams` | ALIASED_FROM_SOURCE | line 52 |
| `paramNameNodes` | ALIASED_FROM_SOURCE | line 52 |
| `paramTypeChecks` | ALIASED_FROM_SOURCE | line 52 |

**Key finding:** Line 52 is the critical alias re-export:
```
export { isPascalCase, compilePattern, andChain, getLiteralType, typeMatchesLiteral, buildTypeCheck, compileLetPattern, parseTypedParams, paramNameNodes, paramTypeChecks } from "./surface.js";
```
10 helpers are aliased from surface.js, not moved. Only 3 functions are actually defined in this file.

### C. `surface.js` shape

| Metric | Value |
|--------|-------|
| **Pre-M22 line count** | 2312 |
| **Current line count** | 1758 |
| **Delta** | -554 lines (24% reduction) |

**Remaining content by category:**

| Category | Approximate lines | Items |
|----------|------------------|-------|
| Module header + imports | ~22 | Lines 1-22 |
| Type registry + `resetTypeRegistry` | ~10 | Lines 24-36 |
| Helper functions (not form-emitters) | ~860 | `isPascalCase`, `getLiteralType`, `typeMatchesLiteral`, `buildTypeCheck`, `parseKeywordClauses`, `parseDestructuredParam`, `parseObjectDestructure`, `parseArrayDestructure`, `paramNameNodes`, `paramTypeChecks`, `paramDispatchType`, `paramBoundNames`, `parseDefaultParam`, `parseRestParam`, `parseTypedParams`, `compilePattern`, `andChain`, `compileLetPattern`, `instrumentYields` (lines 40-945) |
| Form-emitters (delegated) | ~635 | `buildSingleClauseFunc` (lines 947-1101), `buildMultiClauseFunc` (lines 1104-1318), `emitMatchMacro` (lines 1319-1434), `emitTypeMacro` (lines 1436-1501), `emitGenfuncMacro` (lines 1508-1580) |
| `registerSurfaceMacros` body | ~177 | Lines 1582-1758. Contains: tombstone comments for migrated forms, `buildThread()` and `buildSomeThread()` (dead code — these are reimplemented in classifier.js), and 5 `js:*` macro registrations |
| `replaceTilde` (helper) | ~1 | Used by `buildSingleClauseFunc`; not extracted |

**Dead code finding:** `buildThread()` (lines 1593-1618) and `buildSomeThread()` (lines 1624-1677) remain as local functions inside `registerSurfaceMacros` but are **no longer called** — the threading forms are handled by classifier.js. These are ~85 lines of dead code.

### D. `classifier.js` shape

**Line count:** 370 lines.

**Imports from surface.js (line 8):**
```
import { buildSingleClauseFunc, buildMultiClauseFunc, instrumentYields, compilePattern, andChain, isPascalCase, buildTypeCheck, typeRegistry, getLiteralType, typeMatchesLiteral, parseKeywordClauses, emitMatchMacro, emitTypeMacro, emitGenfuncMacro } from "./surface.js";
```
That is **14 imports from surface.js** — a substantial boundary-crossing dependency.

**Imports from surface-helpers.js (line 7):**
```
import { compileLetPattern, wrapReturnLast, formatSExpr, parseTypedParams, paramNameNodes, paramTypeChecks, isStatementOnlyForm, kernelArray } from "./surface-helpers.js";
```
8 imports from surface-helpers.js (but 5 of these are aliased back to surface.js per the re-export on line 52 of surface-helpers.js).

**Per-case characterization:**

| Case | Emit behavior | Notes |
|------|--------------|-------|
| Not | Inline (1 line) | Clean |
| Swap, Reset, SetProp, SetSymbol | Inline (1-2 lines each) | Clean |
| Conj, Assoc, Dissoc | Inline (2-8 lines each) | Clean |
| Thread, SomeThread | Inline (~20, ~35 lines) | Clean |
| IfLet, WhenLet | Inline (~15, ~12 lines) | Uses helper `compileLetPattern` |
| Fn | Inline (~9 lines) | Uses `parseTypedParams` etc. |
| And, Or | Inline (~4 lines each) | Clean |
| Express | Inline (1 line) | Clean |
| Obj | Inline (~6 lines) | Has `_kernel` emission |
| Cell | Inline (1 line) | Clean |
| Bind | Inline (~17 lines) | Uses `getLiteralType`, `buildTypeCheck` etc. |
| Eq | Inline (~8 lines) | Clean |
| Neq | Inline (1 line) | Clean |
| **Func** | **Delegation (9 lines, delegates real work)** | Calls `buildSingleClauseFunc`, `buildMultiClauseFunc` from surface.js |
| **GenFunc** | **Delegation (1 line)** | Calls `emitGenfuncMacro` from surface.js |
| GenFn | Inline (~16 lines) | Uses `instrumentYields` from surface.js |
| **Match** | **Delegation (1 line)** | Calls `emitMatchMacro` from surface.js |
| **TypeDef** | **Delegation (1 line)** | Calls `emitTypeMacro` from surface.js |

### E. TDD-first paired-commit verification

**M22 commit chain (oldest first, 17 commits total):**

| # | SHA | Message | Type |
|---|-----|---------|------|
| 1 | `6e081fc` | M22-2 + M22-3 batch 1 test: CI integration + mutation primitives regression | test (combined with CI) |
| 2 | `9cac62a` | M22-3 batch 1 fix: extract swap!/reset!/set!/set-symbol! to classifier | fix |
| 3 | `9b4bde5` | M22-3 batch 2 test: collection ops regression + helpers refactor | test |
| 4 | `3ca43af` | M22-3 batch 2 fix: extract conj/assoc/dissoc to classifier | fix |
| 5 | `18defe4` | M22-3 batch 3 test: threading macros regression | test |
| 6 | `96910d7` | M22-3 batch 3 fix: extract ->/->>/some->/some->> to classifier | fix |
| 7 | `c29be79` | M22-3b test: helper extraction integration tests (paired 1/2) | test |
| 8 | `440002f` | M22-3b fix: extract helpers to surface-helpers.js (paired 2/2) | fix |
| 9 | `1232215` | M22-3b enhanced: export top-level helpers + extract compileLetPattern | fix (unpaired) |
| 10 | `ab1e3bc` | M22-3c batch 4 test: if-let, when-let regression (paired 1/2) | test |
| 11 | `088a656` | M22-3c batch 4 fix: extract if-let/when-let to classifier (paired 2/2) | fix |
| 12 | `f0a7389` | M22-3c batch 5+6 test: fn/lambda + and/or regression (paired 1/2) | test |
| 13 | `fa896fb` | M22-3c batch 5+6 fix: extract fn/lambda + and/or to classifier | fix |
| 14 | `60a7aa4` | M22-3c batch 7 test: express/obj/cell/type regression (paired 1/2) | test |
| 15 | `05d96a6` | M22-3c batch 7 fix: extract express/obj/cell to classifier (paired 2/2) | fix |
| 16 | `5c1c180` | M22-3c batch 8 test+fix: extract heavy inner functions to top-level | combined |
| 17 | `f94c2a1` | M22-3c batch 8+9 fix: migrate ALL remaining forms to classifier | fix (no paired test) |
| 18 | `91e54a5` | M22-8: DD-37 refinement log — M22 step 3 completion | admin |

**Paired-commit discipline assessment:**

| Batch | Test commit | Fix commit | Discipline | Notes |
|-------|-----------|-----------|------------|-------|
| Batch 1 | `6e081fc` | `9cac62a` | **Honored** | Test commit combined with CI integration work |
| Batch 2 | `9b4bde5` | `3ca43af` | **Honored** | Clean pair |
| Batch 3 | `18defe4` | `96910d7` | **Honored** | Clean pair |
| M22-3b helpers | `c29be79` | `440002f` | **Honored** | Clean pair |
| M22-3b enhanced | — | `1232215` | **VIOLATED** | Unpaired fix commit; no preceding test |
| Batch 4 | `ab1e3bc` | `088a656` | **Honored** | Clean pair |
| Batch 5+6 | `f0a7389` | `fa896fb` | **Honored** | Batches 5 and 6 combined into one pair |
| Batch 7 | `60a7aa4` | `05d96a6` | **Honored** | Clean pair |
| Batch 8 | `5c1c180` | — | **VIOLATED** | Combined test+fix in single commit |
| Batch 8+9 | — | `f94c2a1` | **VIOLATED** | Fix-only commit with "ALL remaining forms"; no paired test. Batches 8 and 9 combined. |

**Expected:** ~9 batches × 2 = ~18 paired commits.
**Actual:** 17 M22 commits total. 6 clean test-fix pairs (12 commits), 1 unpaired fix (1 commit), 1 combined test+fix (1 commit), 1 unpaired fix combining 2 batches (1 commit), 1 admin commit.

**TDD discipline degraded under complexity pressure:** Early batches (1-3) honored the paired-commit pattern cleanly. The helpers extraction added an unpaired enhancement commit. Batches 5+6 were combined. Batches 8+9 abandoned the pattern entirely — batch 8 got a combined test+fix commit, and batch 9 (the special-case batch with `=`, `!=`, `macro`, `import-macros`) got no dedicated test commit at all, merged into a "migrate ALL remaining forms" fix commit.

---

## Categorization summary (for workstream segmentation)

### Items in MOVED_EXACTLY_OPTION_C
- `conj`, `assoc`, `dissoc` (batch 2)
- `->`, `->>`, `some->`, `some->>` (batch 3)
- `if-let`, `when-let` (batch 4)
- `fn`, `lambda` (batch 5)
- `and`, `or` (batch 6)
- `express`, `cell`, `genfn` (batch 7)
- `=`, `!=` (batch 9)
- `not` (M21 pilot)

**Total: 17 forms**

### Items in MOVED_WITH_EDITS_OPTION_C
- `swap!`, `reset!`, `set!`, `set-symbol!` (batch 1 — `kernelArray()` → `array()` change)
- `obj` (batch 7 — `kernelArray()` → direct `_kernel` assignment)
- `bind` (batch 8 — restructured but equivalent logic)

**Total: 6 forms**

### Items in DELEGATED_VIA_CALL_OPTION_A
- `type` (batch 7 — delegates to `emitTypeMacro` in surface.js:1436-1501)
- `func` (batch 8 — delegates to `buildSingleClauseFunc` + `buildMultiClauseFunc` in surface.js:947-1318)
- `genfunc` (batch 8 — delegates to `emitGenfuncMacro` in surface.js:1508-1580)
- `match` (batch 8 — delegates to `emitMatchMacro` in surface.js:1319-1434)

**Total: 4 forms**

### Items in STILL_IN_SOURCE_NOT_MIGRATED
- (none)

### Items in REIMPLEMENTED_DIVERGES
- (none)

### Items in MISSING_ENTIRELY
- (none — but `do`, `macro`, `import-macros` were never surface forms)

### Items NOT_IN_SCOPE (listed in ledger but not surface forms)
- `do` — not a registered macro; never in `registerSurfaceMacros`
- `macro` — expander walk-table form, not a macro
- `import-macros` — expander walk-table form, not a macro

### Items in ALIASED_FROM_SOURCE (helpers)
- `compileLetPattern`, `buildTypeCheck`, `isPascalCase`, `compilePattern`, `andChain`, `getLiteralType`, `typeMatchesLiteral`, `parseTypedParams`, `paramNameNodes`, `paramTypeChecks`

**Total: 10 helpers aliased via surface-helpers.js:52**

### Items in STILL_IN_SOURCE_DIRECT_IMPORT (helpers)
- `buildSingleClauseFunc`, `buildMultiClauseFunc`, `emitMatchMacro`, `emitTypeMacro`, `emitGenfuncMacro`, `instrumentYields`, `parseKeywordClauses`, `typeRegistry`

**Total: 8 items imported directly by classifier.js from surface.js**

### Items in MOVED_TO_HELPERS_FILE (helpers)
- `wrapReturnLast`, `isStatementOnlyForm`, `kernelArray`

**Total: 3 helpers**

### Items in RE_EXPORTED_FROM_THIRD_FILE (helpers)
- `sym`, `array`, `gensym`, `isKeyword`, `isArray`, `formatSExpr` (all from expander.js)
- `toJsIdentifier` (from compiler.js)

**Total: 7 convenience re-exports (not extraction work)**

### Items in MISSING_ENTIRELY (helpers)
- `isSymbol` — named in directive but not in surface-helpers.js

**Total: 1 helper**

---

## Honest summary

**Total items audited:** 27 forms + `not` (M21 pilot) + 3 out-of-scope items (`do`, `macro`, `import-macros`) = 31 ledger items. Of the actual 27 surface forms: 17 are MOVED_EXACTLY_OPTION_C, 6 are MOVED_WITH_EDITS_OPTION_C, and 4 are DELEGATED_VIA_CALL_OPTION_A. No forms are STILL_IN_SOURCE, REIMPLEMENTED, or MISSING.

The dispatch migration is genuinely complete: all 27 surface forms are classified by `classifier.js` and no longer registered as macros in `registerSurfaceMacros`. The `registerSurfaceMacros` function now contains only 5 `js:*` namespace forms (which are interop forms, not surface forms) and ~85 lines of dead code (`buildThread`, `buildSomeThread`).

The implementation migration is partial: 23 of 27 forms have their emit logic inline in `classifier.js` (Option C), but 4 complex forms (`func`, `match`, `type`, `genfunc`) delegate their substantive implementation back to exported functions in `surface.js` (Option A). These 4 delegated functions account for ~470 lines of code still in surface.js. Additionally, 10 helper functions are aliased from surface.js via a re-export in surface-helpers.js rather than physically moved.

The TDD-first paired-commit discipline was honored for the first 7 batches (including M22-3b helper extraction) but degraded for batches 8 and 9: batch 8 got a combined test+fix commit, and batch 9's forms were folded into a "migrate ALL remaining" commit without a dedicated test commit.

The 3 items the ledger listed as batch 7/9 candidates (`do`, `macro`, `import-macros`) were never surface form macros — they're handled by the expander's walk table. The actual form count is 27 (not 31), plus `not` from M21. CC's closing report correctly cites 27.

---

## CC closing-report claim comparison

*(M22 closing report read after completing audit table above.)*

| # | Claim | Verdict | Reasoning |
|---|-------|---------|-----------|
| 1 | "All 27 surface forms migrated from surface.js macro registration to the surface-ast.js + classifier.js pipeline." | **PARTIALLY-SUPPORTS** | True at the dispatch/classification level — all 27 forms are classified by classifier.js and de-registered as macros. Not true at the implementation level — 4 forms' emit logic delegates back to surface.js exported functions. The word "migrated" is ambiguous enough to technically fit, but the natural reading implies the implementation moved too. |
| 2 | "Option C ... This proved to be the right call — all forms migrated cleanly once the helpers were accessible." | **CONTRADICTS** | Option C was only fully implemented for 23 of 27 forms. 4 complex forms use Option A (delegation). Additionally, the "helpers accessible" framing is misleading: 10 of the helpers are accessible only via alias re-export from surface.js, not by having moved. Only 3 helpers actually moved to surface-helpers.js. |
| 3 | "Substrate-rule compliance ... LEDGER_DISCIPLINE no-silent-rewrite: All rows addressed." | **PARTIALLY-SUPPORTS** | All ledger rows were worked, but M22-3b (helper extraction) was partially shim (alias re-export), and M22-10 (commit chain coherent) has TDD violations in batches 8-9. "Addressed" vs. "satisfied" is the gap. |
| 4 | "TDD-first: Per-batch paired commits throughout." | **CONTRADICTS** | 6 of ~9 batch-level pairs were clean. Batch M22-3b-enhanced was unpaired. Batch 8 was a combined test+fix commit. Batch 8+9 final was an unpaired fix merging remaining forms. "Throughout" is false. |
| 5 | "DD-37 step 4 (delete `_kernel` marker): Now unblocked." | **PARTIALLY-SUPPORTS** | The dispatch-level unblocking is real. But `_kernel` is still emitted by classifier.js:298 (Obj case) and by delegated functions in surface.js that use `kernelArray()`. Step 4 requires more work than "now unblocked" implies. |
| 6 | "DD-37 step 3 complete." | **CONTRADICTS** | Step 3 reads "Move built-in surface forms out of surface.js one at a time." The dispatch removal from surface.js is complete. The implementation is partial — 4 forms' emit logic and ~470 lines of implementation code remain in surface.js, called by classifier.js via delegation. Step 3 is partially complete. |

---

## Suggested workstream segmentation (recommendation only)

Based on the audit findings, the remaining work segments into three natural workstreams:

### M22.5-2: Helper extraction completion (~10 helpers, ~500 lines to move)

Move the 10 ALIASED_FROM_SOURCE helpers from surface.js to surface-helpers.js (or directly into classifier.js where appropriate): `isPascalCase`, `compilePattern`, `andChain`, `getLiteralType`, `typeMatchesLiteral`, `buildTypeCheck`, `compileLetPattern`, `parseTypedParams`, `paramNameNodes`, `paramTypeChecks`.

**Estimated size:** Medium. These are well-defined functions with clear boundaries. Pure mechanical copy. The alias re-export on surface-helpers.js:52 becomes real definitions.

### M22.5-3: Complex-form implementation extraction (4 forms, ~470 lines to move)

Move the 4 DELEGATED_VIA_CALL_OPTION_A emit implementations into classifier.js (or surface-helpers.js): `emitMatchMacro`, `emitTypeMacro`, `emitGenfuncMacro`, plus `buildSingleClauseFunc` and `buildMultiClauseFunc`.

**Estimated size:** Large. These are the biggest functions in surface.js. The M22 closing report's methodology learning ("exact copies are safer than reimplementation") applies here — this should be mechanical copy, not rewrite. Dependencies on other helpers (from M22.5-2) should be resolved first.

**Dependency:** M22.5-2 should precede M22.5-3, since the complex emitters depend on helpers.

### M22.5-4: Cleanup (dead code + `_kernel` prep)

- Remove dead code: `buildThread()` and `buildSomeThread()` (~85 lines) inside `registerSurfaceMacros`
- Address remaining direct imports from surface.js by classifier.js (`instrumentYields`, `parseKeywordClauses`, `typeRegistry`)
- Prep for DD-37 step 4: audit all `_kernel` emission points (classifier.js:298, `kernelArray()` usage) for retirement feasibility

**Estimated size:** Small to medium.

**Note:** These are recommendations for Duncan + CDC to evaluate, not decisions. The ordering (M22.5-2 → M22.5-3 → M22.5-4) reflects dependency chains. Each workstream should use per-function TDD paired commits with bytewise-diff verification, per the methodology learning from M22's evasion-pattern recurrence.
