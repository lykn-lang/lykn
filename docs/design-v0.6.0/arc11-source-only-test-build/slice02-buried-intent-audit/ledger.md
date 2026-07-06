# Slice 02: buried-intent-audit — Ledger

Sweep + disposition the buried-intent inventory (arc11 A-4); land the
trivial fixes; route the design questions. Audit-then-fix. Doc-touching →
`make test-docs` in the green bar. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. 7 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Sweep complete + inventory reconciled** — the marker greps (TODO/FIXME/XXX/"for now"/"temporar"/"transitional"/"reserved"/`hide = true`/`allow(dead_code)`/`unimplemented!`) + the CLI-surface sweep (underscore-silenced params, hidden flags, threaded-and-dropped options) + the bounded doc-claims sample, reconciled against the slice-doc's opening inventory (9 items + benign filter); anything new is added, nothing dropped | inventory table in the closing report; stated grep commands; count reconciles with the slice-doc seed | serious | arc11 A-4 / slice01 bubble-up | open | | the benign-filter rule is part of the deliverable: *describes-now* = noise, *should-someday* = inventory |
| F-2 | **Every inventory item has a written disposition** — wired / retired / **tracked** (tracked = a named row/DD/arc home + re-entry condition; "later" alone is invalid) | disposition table: one row per item, disposition + rationale + pointer | serious | arc11 A-4 | open | | includes #5 `cmd_lint` (verify the arc05/P-11 pointer, no code change) |
| F-3 | **Trivial fixes landed** — `kernel-mark.js:10` false "removed as dead" comment corrected (producer #4 lives, `surface-helpers.js:518`); `expander.js` `macroEnv.has('bind')` stale guard re-keyed to a `js:*` name; `icu.rs:696` fixed-if-small-else-tracked; any new one-liners from F-1 | grep the corrected comment; grep the new guard key; each fix named in the walk | correctness | arc10 v1.5 routed defects + F-1 | open | | fixes ride this slice — ending their "ride any next commit" limbo |
| F-4 | **`SetSymbol`/`set-symbol!` deprecation assessed + routed** — `surface.rs:294`'s trigger (surface/kernel separation) fired at arc10's close; assess current usage (repo + guides), surface the design question (deprecate in 0.7.0? keep?), and give it a tracked home (DD note / project-plan row / arc07-09 item). **Do not remove it in this slice** | usage census in the closing report; the routing pointer; the stale TODO text replaced by one that names the tracked home | serious | F-1 seed #1 (trigger-fired TODO) | open | | breaking-surface question — operator decides on the routed item, not here |
| F-5 | **Conventions + canonical docs landed** — test-source location-independence rules (bare specifiers; `Deno.cwd()`-anchored fixtures; never `import.meta.dirname`) documented in the agreed home; the canonical test command (`deno test --config project.json -A test/`; unscoped unsupported) documented where developers look; arc05 lint-rule candidates filed in the bubble-up | grep the conventions text in its home; grep the command doc; bubble-up lists the lint candidates | correctness | slice01 bubble-up (#7, #8) | open | | home choice (guide 16 vs `test/CONVENTIONS.md` vs CLAUDE.md) = CC proposes, says why |
| F-6 | **Doctest-dir harmonized or no-op'd with rationale** — `target/test/doctest/` → `target/lykn/test/doctest/` (arc01-aligned) with discovery/cleanup verified, **or** a written no-op rationale if the move is riskier than its value | if moved: `make test-docs` 0 failed + old path absent; if no-op: rationale in the walk | polish | slice01 design-call #1 (filed) | open | | slice01 declined to fold it in precisely because it wants its own verify — this is that verify |
| F-7 | **Green bar + the A-4 closure demo** — rebuild-first suites green; **sweep re-run at close diffs clean against the disposition table** (zero undispositioned hits) | `make check` ✓; `make test-docs` 0 failed; `lykn test` ≥1365/0; `deno test --config project.json -A test/` ≥673/0; clippy ✓; the sweep-rerun diff transcript | serious | standing bar / arc11 A-4 | open | | this transcript is A-4's arc-scale evidence — arc11's composition rests on it |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> Audit-then-fix: F-1/F-2 before any code lands. F-4 is assess-and-route,
> not remove. Doc-touching slice → `make test-docs` mandatory. This is
> arc11's **last slice** — the bubble-up should state whether arc11 is
> ready for its closing-report + composition check (A-3 three-moment demo +
> A-4 sweep diff + A-5, reproduced at arc scale on host).
