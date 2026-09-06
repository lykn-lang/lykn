# Slice 01: doctest-drift-fix (CI green) — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-30
**Verdict: accepted — slice01 closed.** Docs-only, intent-preserving, and it
takes the guide doctests green. Closes the red-CI item (arc07's first slice; the
arc itself stays open for the broader guide-drift work).

## Verification (git + grep; `make`/CI attested)

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| — docs-only | **git-confirmed:** `0731048` changed **only** `docs/guides/{03,06,07,08,11}.md` — zero code/compiler files. | reproduced (git) |
| F-1 `try` cases | **read-confirmed:** `load-config` dropped `:returns` and produces the value with an explicit `(return (JSON:parse raw))` inside the `try`; `catch` still throws with `:cause`. Intent preserved. | reproduced (read) |
| F-2 `fn` cases | **read-confirmed:** `create-logger` = `(bind logger (fn (:string message) …)) logger` — bind-then-return, **keeping the typed param** and `:returns :function`. The type-preserving mechanism, uniformly applied. | reproduced (read) |
| F-3 all offending fns | CC fixed unnamed siblings too (`create-multiplier` et al.); block-level. | attested |
| F-4/F-5 green | CC-attested: guide doctests **472/0** (was 464/8), `make test-docs` green, `make check` ✓, `lykn test` 1345/0, `deno test` 658/0. Not runnable here (no `deno`/`make`). | attested |
| F-6 CI green | CC-asserted (`make check` green ⇒ CI should pass). **Pending operator CI re-run** to reconcile. | attested |
| F-7 preventive note | **read-confirmed:** `06-functions-closures.md` §"Returning a closure" — value-producing form required; bare `fn`/`lambda` is statement-only; bind-then-return (keeps types) or `=>` (untyped). Accurate. | reproduced (read) |

## Disposition

- 7 rows, all done. Docs-only; no compiler change (the declined `fn`-value tweak
  stayed declined). ✓
- CC verified candidates against the actual compiler before editing (`return` not
  in `STATEMENT_ONLY_HEADS`; the check inspects the last body form's head) — good
  practice. ✓
- **slice01 closed.** The red-CI item is resolved (pending the operator CI re-run
  to confirm green). **arc07 remains open** — the broader guide-drift audit, SKILL
  additions, and guide↔SKILL consistency are still capability-depth (plan-late).
- Process fix reaffirmed: doc-touching slices must run `make test-docs`.
