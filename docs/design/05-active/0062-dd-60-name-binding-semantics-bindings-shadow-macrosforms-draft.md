---
number: 62
title: "DD-60 — Name-Binding Semantics (bindings shadow macros/forms) — DRAFT"
author: "Duncan McGreggor"
component: All
tags: [change-me]
created: 2026-07-06
updated: 2026-07-06
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# DD-60 — Name-Binding Semantics (bindings shadow macros/forms) — DRAFT

> **Status: DRAFT — for odm promotion (Duncan).** Drafted by CC 2026-07-06 from
> the arc13/slice01 conformance matrix (`tools/conformance-matrix.js`, 885
> cells, both backends). Lives in `arc13/design/` until promoted into
> `docs/design/`. Slices 02 (Rust) and 03 (JS + corpus) implement it.

## Context

arc05/slice02's F-4 recon found that a parameter named after a macro behaves
differently on the two backends. The slice01 matrix generalized that probe to
**every** name class × binding position × reference position × both backends
and measured the ground truth:

- **885 cells · 312 (35%) where the backends disagree.**
- **Neither backend has real binding awareness.** Rust's `classify_surface_form`
  and JS's `expandExpr` both dispatch **purely on the head name**, with no
  lexical scope. Rust's apparent shadowing of `fn`/`func`/`obj` is *accidental*
  — a reference like `(fn 987)` fails the `fn` form's shape check (it wants a
  param list) and falls through to a plain call, while `(cell 987)` matches
  `cell`'s shape so the macro fires. Change the reference arity and the
  "shadowing" evaporates.
- **Reserved words are the ID-44 genus at scale.** Binding any JS reserved word
  (`if`, `const`, `new`, `return`, `function`, …) in any position emits invalid
  JS at rc=0 on Rust (`const if = 0`, `function probe(if)`) — the compiler
  silently produces output no engine can parse. The kernel `:` escape and
  `export` do not save it (`(kernel:const if 0)` → `const if = 0`).

The matrix is the ground truth this DD is written against; every "target"
column below is checkable by re-running the probe after the fixes.

## Decisions

### D1 — Lexical bindings shadow macro/form dispatch within their scope

A name introduced by a **lexical binding** — a `func`/`fn`/`genfunc`/`genfn`
parameter, a `bind`, a destructuring pattern, a loop binding, or a class method
parameter — **shadows** any macro, surface form, or kernel form of the same
name, for the extent of that binding's scope, on **both** backends. This is
standard Lisp lexical scoping. Inside the scope, the name means *the binding*:
a reference resolves to the value, and a call `(name …)` is an ordinary call to
it — the macro/form does **not** fire.

The rule extends to **`import-macros`-imported user macros** (they dispatch
through the same `macroEnv`/classifier path a bound name now short-circuits) —
same rule, no special case.

**Target:** every legal-identifier name in every binding × reference cell
becomes `calls-binding` — i.e., the control-name (`x`, `widget`, `result`)
behavior, which is already `✓bind/✓bind` today, becomes universal.

### D2 — JS reserved words are invalid lykn names

A name that is not a legal JS binding identifier (the reserved words: `if`,
`while`, `for`, `return`, `const`, `let`, `var`, `function`, `class`, `new`,
`do`, `import`, `delete`, `typeof`, `in`, `void`, `this`, `super`, `export`,
`default`, `instanceof`, `case`, `catch`, `try`, `switch`, `finally`,
`debugger`, `throw`, `else`, `break`, `continue`, `with`, `enum`, `extends`,
`null`, `true`, `false`) is **rejected as a name** at **every binding position**,
on **both backends**, with a proper diagnostic — never emitted as invalid output
at rc=0. This is the ID-44 genus, killed at the root (Principle 3: no silent
invalid output).

The authoritative test is empirical, not a hand-list: a name is illegal iff
`const <name> = 0;` fails to parse as a module (the matrix computes this per
name via `deno check`, memoized). Contextual keywords resolve correctly this way
(`await`, `yield`, `async`, `get`, `let`… — note `let` **is** rejected as a
lexical name, `yield`/`await` are **not** in module top-level `const` position).

**Target:** every reserved-word cell (currently `invalid-output` on Rust,
`invalid-output`/`throws` on JS) becomes `rejects-cleanly` — a compile error
with a diagnostic on both backends.

### D3 — DD-58's closed kernel namespace is untouched

The five kernel-only declaration heads (`const`, `let`, `var`, `function`,
`function*`) remain compile errors when written bare in surface `.lykn` (DD-58);
you cannot `bind` them as forms because they are reserved words anyway (D2). The
`kernel:` escape stays the raw passthrough it is. D1/D2 add binding awareness and
name validation *around* the existing dispatch; they do not open or reclassify
the kernel namespace.

## Per-cell target behavior (covers every live cell — zero TBD)

| Name class | Today (rust / js) | DD-60 target (both) | Rule |
|---|---|---|---|
| control (`x`, `widget`, `result`) | calls-binding / calls-binding | **calls-binding** | D1 (already correct) |
| surface form, legal ident (`fn`, `func`, `obj`, `and`, `cell`, `not`, `express`, `lambda`, `match`, `type`, …) | calls-binding *or* macro-fires *or* throws / throws | **calls-binding** | D1 |
| kernel head, legal ident (`array`, `await`, `async`, `block`, `get`, `yield`, `assign`, `import`?†) | calls-binding *or* macro-fires / throws | **calls-binding** | D1 |
| reserved word (`if`, `const`, `new`, `return`, `function`, `do`, `import`, `let`, `var`, `while`, `for`, `class`, …) | invalid-output / invalid-output *or* throws | **rejects-cleanly** (compile error + diagnostic) | D2 |
| `kernel:`-prefixed (`kernel:const`, `kernel:if`) | invalid-output/macro / mixed | **not a bindable name** — the `:` escape is raw passthrough; a reserved word in its name slot is still rejected (D2 applies to the emitted binding) | D2/D3 |

† `import` is a reserved word → rejected (D2). Listed to show the classifier
uses identifier-legality, not a curated form list.

## Breaking-change analysis (verified against the matrix, not asserted)

Claim to verify: *"wrong-code rows become correct; nothing currently-correct
breaks."*

- **Rows that are currently `throws` / `invalid-output` / `macro-fires` for a
  legal-ident name → become `calls-binding`.** All of these are currently
  **broken** (compile error, unparseable output, or surprising macro output for
  a name the user lexically bound). Making them resolve to the binding fixes a
  bug; nothing that *worked* changes. ✓
- **Reserved-word rows → become a clean compile error.** Currently they are
  `invalid-output` (never ran — `deno check` rejects them) or an incidental
  `throws`. Turning them into an honest diagnostic breaks no working code. ✓
- **The one genuine meaning-change class:** cells currently `calls-binding` on
  Rust by *shape-coincidence* (`fn`/`func`/`obj` where the reference happens not
  to match the form shape) stay `calls-binding` — no change. But cells currently
  `macro-fires` for a legal-ident kernel/surface name used as a param
  (`array`→`[987]`, `await`→`await 987`, `cell`→`{value:987}`) **flip** from the
  macro's output to a call on the binding. This is a *meaning change for code
  that compiled* — but the current behavior is the surprising one (a lexically
  bound name silently ignored), and it is what this arc exists to fix.
  **Blast radius: 0** — arc05/slice02's F-5 dogfood found no params named from
  the macro set in the repo, guides, or examples. So no real code changes
  meaning; the risk is theoretical.

**Conclusion:** the claim holds. No currently-*correct* (valid, intended) code
breaks; the meaning-change class is entirely currently-*surprising* code with
zero occurrences in-tree.

## Edge cases (named)

1. **User macros (`import-macros`)** — same shadowing rule (D1); a bound name
   shadows an imported macro exactly as it shadows a built-in form.
2. **Exported names** (`(export (bind if 0))` → `export const if = 0`, invalid
   today) — the reserved-word validator (D2) applies; the binding position is
   the same whether or not it is exported. **Recommend: cover it.**
3. **`kernel:` escape with a reserved-word name** (`(kernel:const if 0)` →
   `const if = 0`, invalid today) — the escape is raw passthrough, but emitting
   invalid JS at rc=0 is the exact Principle-3 violation D2 forbids.
   **Recommend: the name-validity check (D2) fires here too**; flag as a
   sub-question for the operator (does the raw escape get to bypass name
   validation? proposal: no — validity is not a macro concern).
4. **Shadowing an actual `kernel:`-prefixed *atom* as a name** — unrepresentable
   (`kernel:if` is not a legal identifier; you cannot bind it). Documented; no
   action.

## Design sub-questions (for operator confirmation)

1. **Shadowing granularity** — D1 proposes whole-lexical-scope shadowing
   (standard Lisp). The matrix shows no cell where position-aware shadowing
   would be preferable; whole-scope is clean and matches every Lisp dialect.
   **Proposal: whole-scope.**
2. **Reserved-word validator coverage of `export` and `kernel:` name slots** —
   proposal: **yes to both** (edge cases 2, 3). Operator confirms.
3. **Probe home** — `tools/conformance-matrix.js` (proposed; see the closing
   report). Re-runnable, CI-adjacent, outside `crates/`+`packages/`.
