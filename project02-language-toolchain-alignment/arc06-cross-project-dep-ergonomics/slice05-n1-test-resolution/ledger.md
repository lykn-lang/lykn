# arc06 · slice05 — Ledger (N1: import-by-specifier; the A-6 closer)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Largely host-run
(mycelium corpus); CC attests, CDC verifies completeness + the compiler
preservation claim against `lang`. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | **Specifier preservation** — `(import "<pkg>/x.js" …)` compiles to JS that **keeps** the `<pkg>/x.js` specifier (Deno resolves via the import map), not a rewritten relative path. | compile a fixture test; read emitted JS; **if not preserved → self-stop + route** | **serious** | slice05 first-task | **done** | `lykn compile` of a fixture emits `import {html} from "mycl-html/render.js";` verbatim; bare `mycl-html`→`"mycl-html"`, subpath→`"mycl-html/escape.js"`, and even `../render.js`→`"../render.js"` are all passed through unrewritten. **Preservation holds → no compiler change** | de-risks the whole reframe |
| S-2 | **mycelium re-pointed + self-keys added** — `mycl-html/` (and `mycl/` if needed) → `./target/lykn/build/…`; current lykn. | mycelium `project.json` diff | serious | slice02 N1 | **done** | mycelium on scratch `smoke/0.6-slice05-import-by-specifier` (registry-pinned @0.5.2 = current lykn); `project.json` += `"mycl-html/": "./target/lykn/build/mycl-html/"`. `mycl` has no tests → no `mycl/` key (flagged S-6) | host; commit `e60af9d` |
| S-3 | **The 3 dangling imports converted** — `../render.js` / `../escape.js` / `../void-elements.js` → `mycl-html/…`; no `../*.js` source imports remain in tests. | grep mycelium tests: zero `\.\./.*\.js` | serious | recon | **done** | 4 import lines across 3 files converted (`escape_test`, `render_test`, `void_elements_test`); post-sweep `grep -rn '\.\./.*\.js' packages --include='*.lykn'` = **zero** | 3 files |
| S-4 | **A-6 green** — mycelium `lykn build` + **`lykn test`** + `lykn publish --jsr --dry` all green as a downstream. | host: the three commands + output | **serious** | arc-plan A-6 | **done** (CC-attested) | host: `lykn build` ✓; **`lykn test` → 43 passed / 0 failed** (was `Module not found` red pre-slice); `lykn publish --jsr --dry-run` → "Dry run complete" (dirty gate satisfied by committing on scratch, **not** `--allow-dirty`). Publish-safe: staged `dist/*/deno.json` carry **no** `target/lykn/build` path | the arc-scale demo |
| S-5 | **Guide note** — import-by-specifier convention (bare `<pkg>` = public entry; `<pkg>/file` = internal). | the note exists (guide/SKILL) | correctness | slice-doc | **done** | `docs/guides/16-testing.md` ID-15 extended (commit `42500a9`): the target/-model explanation, ✗ relative vs ✓ specifier, scaffold self-key, bare-vs-subpath distinction | pairs with arc07 |
| S-6 | **Multi-package scaffold gap flagged/routed** — `lykn new` writes one self-key; multi-package needs per-member; routed (not built). | the routing note | correctness | recon | **done** | guide blockquote flags it; closing-report bubble-up routes the per-member self-key scaffold enhancement to post-0.6.0 / arc07. **Not built** | post-0.6.0 |
| S-7 | **Minimal-to-no `lang` source change; `make check` green** — convention slice (unless S-1 forces a routed compiler fix). | `git show --stat`; host `make check` | serious | recon discipline | **done** | S-1 held → **zero `lang` source change**; only `docs/guides/16-testing.md` (+41). `make check` green (build+lint+test, 476 doc blocks 0 failed) | |

## Closure

Closed at `<CDC-fills>` (CC-attested; mycelium/deno + `make check` reconcile on
host). Rows: 7. Done: 7. **On close, arc06's A-6 is met** — CDC writes the arc06
`closing-report.md` (walk A-1…A-7) and Duncan gates the arc.

_(On close: CDC verifies the preservation claim against `lang` (compile a bare/
subpath specifier — kept, not rewritten), the mycelium diff (self-key added, 4
imports converted, zero `../*.js` remain), and A-6 completeness (build+test+
publish-dry all green, recorded). mycelium work is on scratch
`smoke/0.6-slice05-import-by-specifier` (commit `e60af9d`); `main` untouched.
Handoff: arc06 A-1…A-7 are all met — see the closing-report bubble-up; the arc
is ready for Duncan's gate.)_
