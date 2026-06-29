# Slice: move-function-core (arc04 / slice01) — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-28
**Verdict: accepted — slice01 closed.** All 9 rows verified to the strength the
verifying environment allows.

## Verification environment + limits

Same posture as arc03/slice11: CDC runs in a Linux sandbox with no `deno`, so
the runtime rows (`deno test`, `deno lint`) are **CC-attested + CDC code- and
git-verified**; an operator host re-run reconciles them. What CDC reproduced
here: git history (TDD pairs) and **full source review of the tool**.

## Per-row verification

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1…F-6 | **git-confirmed** each is a visible red→green TDD pair: F-1 `c7d050c→db7c45e`, F-2 `ff634c8→f7f828c`, F-3 `cb51531→b31e81d`, F-4 `018da3d→9e3798e`, F-5 `664461c→7c2ca58`, F-6 `0465cb8→d9b2d5a`. Discipline held (no test+fix blends). | reproduced (git) + attested (runtime) |
| F-3 byte-identity invariant | **code-reviewed** `scripts/move-function.js`: move is `fromOrig.slice(loc.start, loc.end)` (verbatim bytes); `grep astring\|generate(` → none. No code generator is ever in the move path — the invariant holds **by construction**. | reproduced (code) |
| F-6 verify gate | **code-reviewed**: on verify failure both files are rewritten to `fromOrig`/`toOrig` and a `VerifyError` is thrown (auto-revert); `runVerifyCommand` runs the command verbatim and "never injects skip-gate flags (no `--no-verify`, `--allow-dirty`)". CLAUDE.md safety-gate ethos honored. | reproduced (code) + attested (runtime) |
| F-5 aborts | code-reviewed: not-found / collision / ambiguous abort writing nothing. | reproduced (code) + attested |
| F-7 acceptance | CC-attested: `parseRestParam` (zero-consumer, grep recorded) moved to scratch `surface-helpers.js`, byte-identical, suite 657/0 after `lykn build`, scratch discarded (no extraction landed). Not runnable here. | attested |
| F-8 / F-9 | CC-attested (`deno lint scripts/` exit 0; 26 tool tests + 657 JS suite green). Not runnable here. | attested |
| Step 0 (fmt) | **git-confirmed** `401e2bd` reformatted exactly the 5 crates files (`compile.rs`, `main.rs`, `emit.rs`, `cache.rs`, `pass0.rs`) — the pre-existing `make check` lint red. | reproduced (git) |

## Disposition

- Silent-drop check: 9 rows opened, 9 closed (9 done). No drops. ✓
- Non-goals (cross-file rewiring, batch, no astring, no scope-rename) correctly
  deferred to slice02. ✓
- Design calls surfaced not decided silently (`scripts/` vs `tools/`; pinned
  `npm:acorn@^8`; `insertDeclaration` takes a formed unit). ✓
- **slice01 closed.** Operator host re-run recommended to reconcile F-7/F-8/F-9.

## Bubble-up accepted (→ arc04 arc-plan)

CC surfaced two findings that **refine slice02's scope** — both accepted:

1. **No extraction target exists yet.** `surface-helpers.js` does not exist on
   `release/0.6.x`; the core was proven on a discarded scratch. slice02
   (cross-file rewiring / batch) must **pick or create the real extraction
   target** as part of its scope.
2. **Build-dir staleness, again.** The tool's default verify (`deno test -A
   test/`) runs against built `lang/`, so a real extraction needs a
   `--verify-cmd` that **rebuilds first** — the same staleness class arc03/slice11
   guarded. slice02 must use a rebuild-first verify-cmd; a **shared freshness
   fix** (reuse slice11's guard) is worth considering rather than re-solving.

These are recorded in arc04 `arc-plan.md` (slice02 scope + Version History);
slice02 is planned deep only when it becomes active.
