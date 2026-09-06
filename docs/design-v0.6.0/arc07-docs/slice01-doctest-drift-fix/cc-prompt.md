# CC Prompt — arc07 / slice01 · doctest-drift-fix (CI green)

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-30
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Take `release/0.6.x` CI **green** by fixing 8 stale guide doctest blocks.
Pure **docs-only** — the compiler is correct (DD-50.6); the guides drifted. You
wrote the CI report that found this; this is the planned fix.

## 0. Read first
- `…/slice01-doctest-drift-fix/ledger.md` (7 rows) and `slice-doc.md` (the two fix
  patterns + the `=>`-is-untyped nuance).

## 1. The rule (why they fail)
A function declaring `:returns :TYPE` whose body ends in a **statement-only form**
(`try`, or a bare `fn`/`lambda`) can't produce a value → DD-50.6 rejects it. Fix =
make the body end in a **value-producing** form (or drop `:returns`).

## 2. The work (MUST)

**The 8 blocks:** `03-error-handling.md` (`load-config`, `valid-json?` — `try`);
`06-functions-closures.md` (`create-logger`, `create-filter`, and any sibling
`:returns :function` fn in those blocks e.g. `create-multiplier`);
`07-async-concurrency.md` (`debounce`); `08-performance.md` (`memoize`,
`memoize-lru`); `11-documentation.md` (`debounce`). Fix **every** offending
function in each block — a sibling with the same shape fails the block too (F-3).

**`try` cases (F-1):** produce the success value explicitly — an explicit
`(return <expr>)` inside the `try` success path is cleanest; or bind-then-return;
or drop `:returns` if the example doesn't need it. Keep the intent (`load-config`
still yields the object).

**`fn` cases (F-2):** a bare `fn` is statement-only. Two docs-only fixes:
- **bind-then-return the `fn`** — `(bind logger (fn (:string message) …)) logger`
  — **preferred where the closure's typed params carry teaching value** (this is
  the closures guide), because it **keeps the type annotations**.
- **`=>`** — the value-producing arrow, but **untyped** (no param type checks;
  guide 06:72). Use it where an untyped closure reads fine and types aren't the point.
Pick per example. **Do not** reach for a compiler change (the `fn`-value-position
tweak was considered and declined — docs-only is settled).

**Preventive (F-7):** add a short note to `06-functions-closures.md`'s closure
section: to return a closure, end the body in a value-producing form — `=>`
(untyped) or a bound `fn` returned by name; a bare `fn`/`lambda` is statement-only.

## 3. Verify (MUST — all green)
- **`make test-docs`** → 0 failed (the surface that caught this). (F-4)
- **`make check`** green — build + lint + all tests incl. docs. (F-5)
- Confirm the code suites are unaffected: `lykn test` 1345/0, `deno test --config
  project.json -A test/` 658/0.
- **CI:** the two previously-red jobs (`make test`, `make test-docs`) pass. (F-6)

## 4. Discipline
- Docs-only; touch only `docs/guides/*.md` (+ the preventive note). No code/compiler.
- Lands (committed). Small, intent-preserving edits.
- Leave `docs/design-v0.6.0/**` to CDC.

## 5. Close
Write `closing-report.md` (per-row walk + a note on which mechanism you chose per
`fn` example and why, and confirmation `make test-docs`/`make check`/CI are green)
→ hand back for CDC `cdc-verification.md`. This closes the red-CI item; arc07's
remaining slices (broader guide-drift audit, SKILL additions) stay
capability-depth until the arc is scheduled in full.
