# M22 Form Inventory

**Date:** 2026-05-17

## Forms to migrate (27 total, grouped by batch)

### Batch 1 — Mutation primitives (4 forms)
- `swap!` — (swap! cell fn) → (= cell.value (fn cell.value))
- `reset!` — (reset! cell val) → (= cell.value val)
- `set!` — (set! target val) → (= target val)
- `set-symbol!` — (set-symbol! obj key val) → (= obj[key] val)

### Batch 2 — Collection ops (3 forms)
- `conj` — (conj arr item) → [...arr, item]
- `assoc` — (assoc obj ...kv-pairs) → {...obj, k1: v1, ...}
- `dissoc` — (dissoc obj ...keys) → spread + delete

### Batch 3 — Threading macros (4 forms)
- `->` — thread-first
- `->>` — thread-last
- `some->` — nil-safe thread-first
- `some->>` — nil-safe thread-last

### Batch 4 — Binding macros (2 forms)
- `if-let` — conditional binding + IIFE
- `when-let` — conditional binding (no else) + IIFE

### Batch 5 — Anonymous functions (2 forms)
- `fn` — typed anonymous function → kernel function expression
- `lambda` — alias for fn

### Batch 6 — Logical n-ary (2 forms)
- `and` — (and a b c) → (&& (&& a b) c)
- `or` — (or a b c) → (|| (|| a b) c)

### Batch 7 — Core surface forms (5 forms)
- `express` — (express cell) → cell.value
- `obj` — (obj :key val ...) → {key: val, ...}
- `cell` — (cell val) → {value: val}
- `type` — ADT definition
- `genfn` — generator function expression

### Batch 8 — Large forms (4 forms, possibly sub-batched)
- `func` — full surface function with contracts
- `genfunc` — generator function with contracts
- `match` — pattern matching
- `bind` — type-annotated variable binding

### Batch 9 — Special case (2 forms)
- `=` — surface equality → (=== a b)
- `!=` — surface inequality → (!== a b)

## Out of scope
- `not` — already migrated (M21)
- `do` — not a surface macro (handled by compiler)
- `macro` / `import-macros` — handled by expander, not surface.js
- `js:bind`, `js:call`, `js:eq`, `js:eval`, `js:typeof` — js: namespace interop, stays in surface.js
- `unquote` / `unquote-splicing` — handled inline by quasiquote logic

## Design-call confirmations
All 8 confirmed. Batch ordering follows CDC's recommendation with
genfn/genfunc integrated into batches 7/8. `macro`/`import-macros`
not in surface.js — special-case batch (9) reduced to = and != only.
