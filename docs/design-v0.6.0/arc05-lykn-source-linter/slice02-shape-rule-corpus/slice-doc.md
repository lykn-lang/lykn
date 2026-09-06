# Slice 02: shape-rule-corpus

> Land the **12 remaining verified lint rules** from slice01's F-1 table,
> the **2 recon-gated compiler fixes** the F-1 catches earned (ID-44 for-of
> bug; ID-42 reserved-param disallow — operator decisions 2026-07-06), the
> **ID-03 severity-by-measurement**, and the **real dogfood pass** over the
> repo's own sources. After this slice, `lykn lint` enforces the guide's
> shape rules and the compiler has no known silent-invalid-output path.

## Goal

Corpus complete at the shape tier: every rule from the authoritative F-1
table implemented with both-direction fixtures; the two compiler holes F-1
found are closed (or their fallback taken with data); the repo lints clean
or every finding is triaged. slice03 then adds shadowing + guide alignment.

## The contract (from slice01 F-1 — measured, not DD-59's target list)

**The 12 lint rules** (severity per DD-59 unless noted):

| Rule | Guide ID | Severity | Shape |
|------|----------|----------|-------|
| no-eval | 31 | error | call-head `eval` / `js:eval` |
| no-new-wrappers | 6 | warn | `(new String\|Number\|Boolean …)` |
| global-isnan | 4 | warn | call-head `isNaN` (suggest `Number:isNaN`) |
| no-arguments | 30 | warn | atom `arguments` in expression position |
| no-iife | 32 | warn | list whose head is a `fn`/`lambda` form |
| no-delete-on-array | 34 | warn | `(delete <expr> <index>)` numeric-index shape |
| no-json-deep-copy | 35 | warn | `JSON:parse` wrapping `JSON:stringify` |
| prefer-surface-operators | 38 | warn | heads `===`/`!==`/`==`/`!=`/`&&`/`\|\|` (suggest `=`/`!=`-surface/`and`/`or`) |
| or-for-defaults | 3 | **measured** | `(or <expr> <literal>)` — see below |
| for-in-on-arrays | 29 | warn | `for-in` over an array-suggesting expr (context stack; conservative — flag only clear cases) |
| no-relative-source-imports | conv | error | `(import "./…"\|"../…" …)` — **path-scoped: test files** |
| no-dirname-fixtures | conv | error | `import.meta:dirname` / `import:meta:dirname` in fixture-path position — **path-scoped: test files** |

**ID-03 severity-by-measurement:** run the rule over the full repo corpus;
report the hit list and a judgment per hit (true positive / legitimate).
Propose the severity (warn vs info vs drop) from the measured
false-positive rate in the closing report — with the data, not a priori.

**The 2 compiler fixes (recon-gated, self-stop on scope explosion):**

1. **ID-44 — for-of binding validation.** `(for-of (const …) …)` must be a
   compile **error** with a proper diagnostic (suggest the bare binding),
   making guide-09's "Throws" claim true. Regression test + a corpus row.
   **Check the JS compiler on the same input first** (DD-58 lesson:
   per-backend enforcement) — if it also emits garbage or diverges, fix or
   surface; the two backends must agree on rejection.
2. **ID-42 — reserved parameter names.** Recon first: (a) confirm the
   shadowing semantics (the F-1 transcript shows `(fn)` in a body calling
   the *param* — which other form heads shadow like this?); (b) derive the
   **reserved set** — the dangerous shadowers only (banning common nouns
   like `type`/`get` would break reasonable code; the set is probably the
   special-form heads whose call-position meaning changes); (c) blast
   radius: grep the repo + guides for params named from that set; (d) both
   compilers. If the radius is small → compile error with a clear
   diagnostic on both backends + tests. If large → **stop, report the
   data**; the measured fallback is a lint-warn rule (operator re-decides).

## Scope (out)

- shadowing (slice03; needs `analysis/scope.rs`), guide-09 relabeling
  (slice03), `make lint` wiring (slice03), `--fix`, config.
- Any compiler change beyond the two gated fixes.

## Verification approach

Rebuild-first; `make check` green; per-rule fixtures both directions;
snapshots extended + reviewed; the two compiler fixes carry their own
regression tests (and a cross-compiler corpus row for ID-44). **Real
dogfood** (arc A-5 at slice scale): `./bin/lykn lint` over all repo
`.lykn` sources with the full corpus — findings fixed or acknowledged in a
triage table (expect `prefer-surface-operators` and `or-for-defaults` to
actually fire; that's the point).

## Exit criteria

12 rules green both directions; ID-44 rejected by both compilers (or
divergence surfaced); ID-42 disallowed-or-fallback-with-data; ID-03
severity proposed from measurement; dogfood triage table complete; suites
green at baseline; snapshots reviewed. Bubble-up: corpus state for
slice03; DD-59 addendum items; anything the compiler fixes revealed.

## Design sub-questions (surface, don't decide silently)

1. **for-in-on-arrays precision** — how conservative? (Flag `(for-in k
   <array-literal>)` and obvious array bindings only; prefer misses over
   false positives in v1.)
2. **Conventions-rule path scoping** — how does the linter know a file is
   a test file? (`*_test.lykn`/`*.test.lykn` suffix per `test/CONVENTIONS`;
   confirm the match set.)
3. **ID-42 reserved set** — CC proposes from recon data; operator confirms
   at close.
