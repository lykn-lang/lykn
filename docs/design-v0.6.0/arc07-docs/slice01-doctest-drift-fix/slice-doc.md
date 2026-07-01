# Slice 01: doctest-drift-fix (CI green)

> arc07's first slice, made near-term by a **red CI** finding: the first CI run
> on `release/0.6.x` failed on **8 guide doctest blocks** whose functions declare
> a `:returns :TYPE` but end in a statement-only form (`try` or `fn`) that can't
> produce a value (DD-50.6's return-type check — the compiler is correct). This is
> accumulated **guide drift**, not a code bug. **Docs-only fix; it lands and takes
> CI green.**

## Goal

Fix the 8 stale guide examples so `make test-docs` (the guide doctest surface) is
green and `release/0.6.x` CI goes green. No compiler change.

## The 8 blocks (from CC's CI report 28421983093)

| Guide | Function(s) | Ends in |
|-------|-------------|---------|
| `03-error-handling.md` | `load-config`, `valid-json?` | `try` |
| `06-functions-closures.md` | `create-logger`, `create-filter` (+ any sibling `:returns :function` fns in the block, e.g. `create-multiplier`) | `fn` |
| `07-async-concurrency.md` | `debounce` | `fn` |
| `08-performance.md` | `memoize`, `memoize-lru` | `fn` |
| `11-documentation.md` | `debounce` | `fn` |

Fix **every** offending function in each failing block (a block is one compile
unit — a sibling function with the same shape fails it too), not only the named ones.

## The two fix patterns

**`try` cases** — `try` is genuinely statement-only (like JS `return try{…}`).
The success value (e.g. `(JSON:parse raw)`) must be produced explicitly:
- preferred: an explicit `(return <expr>)` inside the `try` success path; or
- bind the result and end the body in that binding; or
- if the example doesn't need a typed return, drop `:returns :TYPE`.
Preserve the example's intent (e.g. `load-config` should still yield the object).

**`fn` cases** — a bare `fn`/`lambda` is a statement-only *declaration*; it can't
be implicitly returned. Two docs-only mechanisms (settled call: **docs-only**):
- **`=>`** (the value-producing arrow) — but note `=>` is the **untyped**
  kernel arrow (no param type checks). Use it where an untyped closure reads
  fine.
- **bind-then-return the `fn`** — `(bind logger (fn (:string message) …)) logger`
  — **preserves the typed closure** and satisfies the check (body ends in the
  binding, an expression). Prefer this where the typed params carry teaching value
  (this is the *functions & closures* guide).

Per-example editorial judgment; `make test-docs` is the gate.

## Preventive (stop re-drift)

Add a short note to `06-functions-closures.md` (the closure section): *to return a
closure, end the body in a value-producing form — `=>` (untyped) or a bound `fn`
returned by name; a bare `fn`/`lambda` is statement-only and cannot be implicitly
returned.* So future authors don't reintroduce this.

## Verification

`make test-docs` green (the surface that catches this), plus `make check` (which
includes it) and the CI's two previously-red jobs. **Process note carried from the
finding:** this drift was invisible to the standing slice green-bar (`lykn test` +
`deno test test/`) — doc-touching slices must run `make test-docs`.

## Exit criteria

8 blocks fixed (all offending functions), intent preserved (typed closures kept
where sensible), `make test-docs` + `make check` green, the preventive note added,
CI green on `release/0.6.x`. No compiler change.
