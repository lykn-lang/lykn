# arc06 · slice02 — CDC pre-audit (static inspection of mycelium)

> **By CDC (Cowork), 2026-07-21.** mycelium was connected to Cowork mid-scoping,
> so CDC did the **static** disposition by reading the source/config (no
> toolchain in the sandbox — CDC cannot *run* lykn). This is CC's starting map:
> confirm the "likely fixed" by running, and reproduce the "still open." **These
> are hypotheses from inspection, not verdicts — the RUN decides.**

## The version-pinning trap (read first)

`project.json` pins the toolchain to **published 0.5.2**:

```json
"imports": {
  "lang/":    "jsr:@lykn/lang@0.5.2/",
  "testing":  "jsr:@lykn/testing@0.5.2",
  "testing/": "jsr:@lykn/testing@0.5.2/",
  "astring":  "npm:astring@^1.9.0"
}
```

A bare `make test` therefore audits **0.5.2**, not current `release/0.6.x` —
worthless for this audit. **The audit MUST re-point `lang/`+`testing/` at current
lykn** (local `../lang/packages/lang/` + `../lang/packages/testing/`, or a 0.6.0
prerelease build) on a **scratch branch**, non-destructively, then build/test.
The `smoke/0.5.2-registry-pinned` branch is the pinned baseline; do not confuse
it with the current-lykn run. **Capture how manual/awkward the re-point is — it
is prime `lykn add` / DD-63 evidence** (switching a dep between local and
registry is exactly the ergonomics arc06 owns).

## Two axes (route differently)

1. **Toolchain bugs** — does *current* lykn still miscompile something mycelium
   worked around? Test by **removing the workaround** and recompiling. Route →
   compiler follow-up (fix-in-0.6.0 vs post).
2. **Downstream drift** — mycelium's own config/Makefile carry patterns the
   0.6.0 toolchain has obsoleted (in-place build, build-then-test). Route →
   `lykn new` scaffold (should new projects get the new pattern?) and/or a
   mycelium update.

## Likely FIXED by inspection — CC confirms by running

| Issue | Inspection evidence | Confirm by |
|---|---|---|
| #8 `.d.ts` generation | `target/lykn/build/**` has `mod.d.ts`, `escape.d.ts`, `render.d.ts`, `void-elements.d.ts` | `lykn build` against current lykn regenerates them |
| #14 `target/` output (toolchain) | compiled `.js`/`.d.ts` present under `target/lykn/build/` | current lykn emits to `target/`, not in-place |
| #3 license | `packages/mycl-html/deno.json` has `"license": "Apache-2.0"` | present in both packages; check `lykn new` generates it |
| #9 `lang`/`testing` imports | `project.json` has `lang/`+`testing/`+`astring` | present (registry-pinned); check `lykn new` generates them |
| #12 raw npm/deno publish | Makefile publish targets call `lykn publish --jsr/--npm` | adopted; a `lykn publish --dry-run` should work |
| #2 import-macros jsr | `render_test.lykn:1` uses `(import-macros "jsr:@lykn/testing@0.5.2" …)` | should resolve on current lykn (V-08, 0.5.2) — confirm after re-point |

## Workarounds STILL in mycelium source — test whether current lykn makes each UNNECESSARY

Remove the workaround, recompile against current lykn, and record fixed/open:

| Issue | Workaround in source | Location | The un-worked-around form to test |
|---|---|---|---|
| #1 `?`-suffix → invalid JS | `is-void-element` (renamed from `void-element?`) | `void-elements.lykn:7` | does `(func void-element? …)` compile to valid JS now? |
| #5 nested `if` in return position | guard-clause `(return …)` chain | `render.lykn:47-52` | does a nested-`if` return-expression compile to a ternary chain (not stray `if` statements)? |
| #6 `(express x):method` chaining | intermediate `(bind result (express parts)) (result:join "")` | `render.lykn:40-41` | does `((express parts):join "")` emit a method call now (ID-31)? |
| #7 `if` in binding position | `(? has-attrs … …)` for conditional bind | `render.lykn:69` | does `(bind x (if cond a b))` compile to a ternary now? |

## ★ The `(export (func …))` finding — confirm FIRST (it can block the build)

`render.lykn:81` and `void-elements.lykn:7` use **`(export (func html …))`** /
`(export (func is-void-element …))`. Project memory (`lykn_export_surface_syntax`)
flags `(export (func …))` as **invalid surface syntax that the SKILL + guides
wrongly teach** (fix pending — export names separately via `(export (names …))`).
mycelium was built following those guides. **So: does current lykn compile or
reject `(export (func …))`?**

- If it **rejects** → mycelium won't build against current lykn at all, and it's
  a concrete **arc06 → arc07 link** (a guide bug breaking a real downstream). A
  high-priority routing item, and a strong argument for pulling the guide fix
  forward.
- If it **compiles** → the guides are behind, not the compiler; route the guide
  fix to arc07.

Run this check before the rest of the build — it gates everything after it.

## Downstream-drift gaps (toolchain fixed; mycelium not migrated)

| What | Evidence | Question for the audit |
|---|---|---|
| in-place build | `Makefile` `build`: `lykn compile $$f -o $${f%.lykn}.js` (packages/ still has `render.js` etc.) | current lykn supports `target/`; should mycelium's Makefile + `lykn new`'s template move off in-place `-o`? |
| build-then-test flow | `make test` = `build` (in-place) → `lykn test packages/mycl-html/tests/` | arc11 made `lykn test` compile to `target/lykn/test/`; is the pre-`build` step now redundant/conflicting? |
| `.gitignore` posture | ignores `packages/*/*.js` + `*.d.ts` (comment: publish via `lykn publish` not `deno publish` from source) | coherent with the current publish path? does `lykn new` generate this? |

## What this pre-audit does NOT settle

Everything above is a reading of *files*, not a *run*. Nothing is dispositioned
fixed/open until CC reproduces it against current `release/0.6.x`. This map
exists so CC spends its runtime budget confirming, not rediscovering.
