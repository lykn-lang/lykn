# arc06 · slice05 — N1: downstream tests import by specifier (the A-6 closer)

> **Open set** (2026-07-22, CDC). The **last arc06 slice**. Fixes N1 (a
> downstream test's relative `../x.js` dangles under the `target/` model) via
> **convention, not new resolution code** (CC's reframe, CDC-endorsed): a test
> imports its own package by its **self-package import-map specifier**
> (`<pkg>/<subpath>` → `target/lykn/build/<pkg>/`), which the scaffold already
> provides. Delivers **A-6** — the mycelium build+test+publish-dry composition
> demo — after which **arc06 closes**. Largely host-run (mycelium is the
> acceptance corpus).

## 1. Goal

Prove and adopt the import convention that makes a downstream `lykn test` green:
tests import their package via `<pkg>/<file>` (or bare `<pkg>` for the public
entry), resolving to the built output through the self-package import-map key —
**not** a relative source path. Then reproduce **A-6**: mycelium builds, tests,
and publish-dry-runs green as a downstream of current lykn.

## 2. Scope

### In

- **Prove the mechanism (first task — de-risks the whole reframe).** The scaffold
  writes `"{name}/": "./target/lykn/build/{name}/"` but no scaffold test exercises
  it. **Confirm the compiler PRESERVES an import-map specifier** — a test doing
  `(import "<pkg>/render.js" (html))` must compile to JS that keeps the
  `<pkg>/render.js` specifier (Deno resolves it via the import map at run), **not**
  a rewritten relative path. If it does *not* pass through, **self-stop and
  surface** — that would be a real compiler gap (route it), not this slice.
- **mycelium update (host corpus).** (a) re-point mycelium at current lykn (the
  slice02 re-point); (b) add the self-package key(s)
  `"mycl-html/": "./target/lykn/build/mycl-html/"` (and `mycl/` if it has tests)
  to mycelium's `project.json`; (c) change the **3 dangling imports** —
  `../render.js`, `../escape.js`, `../void-elements.js` (in `render_test`,
  `escape_test`, `void_elements_test`) — to `mycl-html/render.js` etc.
- **A-6 composition demo.** From mycelium, host-run: `lykn build` + **`lykn test`
  (green)** + `lykn publish --jsr --dry` (green) as a downstream of current lykn.
  Record commands + output. This is the arc-scale reproduction.
- **Guide note.** The convention — *import your package by its specifier
  (`<pkg>`/`<pkg>/…`), not a relative source path* — as a guide/SKILL note
  (originates here; pairs with the arc07 pass). Include the "public entry vs
  internal subpath" distinction (bare `<pkg>` for the mod.js API; `<pkg>/file`
  for internals).
- **Flag the multi-package scaffold gap.** `lykn new` writes **one** `{name}/`
  self-key (single package); a multi-package workspace (mycelium) needs a key
  **per package** — hand-added here. Route the scaffold enhancement (generate
  per-member self-keys) to a follow-up (post-0.6.0 / arc07), don't build it here.

### Out

- **New resolution / compiler code** — unless the first-task check fails (then
  self-stop + route). The reframe is convention + corpus + demo.
- The **multi-package scaffold enhancement** — flagged, not built.
- `lykn remove`, Mix `~>`, etc. — future.

## 3. Verification approach

- **CC** runs it on the host (mycelium is host-only): the preservation check, the
  mycelium fix, and the A-6 demo (build+test+publish-dry green). Attests output.
- **CDC** verifies: the preservation claim against `lang` (how the compiler emits
  a bare/subpath specifier — does it keep it?); the mycelium diff (self-keys added,
  the 3 imports converted, no relative-source imports remain); A-6 completeness
  (all three of build/test/publish-dry green, recorded). Reconcile on host.
- Deliverable: the mycelium changes (host) + a `findings`/demo record + the guide
  note; minimal-to-no `lang` source change.

## 4. Exit criteria

1. **Preservation proven** — a `(import "<pkg>/x.js" …)` compiles to JS that keeps
   the specifier and resolves via the import map (or: a compiler gap is surfaced +
   routed).
2. mycelium re-pointed; self-key(s) added; the 3 relative imports converted; sweep
   shows no `../*.js` source imports remain in tests.
3. **A-6 green** — mycelium `lykn build` + `lykn test` + `lykn publish --dry` all
   green as a downstream (recorded).
4. Guide note written; multi-package scaffold gap flagged/routed.
5. Minimal-to-no `lang` source change (convention slice); `make check` green.

## 5. Consumes / feeds — and the arc close

Consumes slice04's overlay (link resolves the self-key to the local build for
dev) + the scaffold self-key + slice02's re-point. **Feeds the arc06 CLOSE:** on
A-6 green, CDC writes `arc06/closing-report.md` walking A-1…A-7 (A-5 `lykn add`
✓, A-6 composition demo ✓, A-7 all mycelium issues dispositioned incl. N1), and
Duncan gates. **This is the slice on which the 0.6.0 dive's original motivation —
"consume lykn as a dependency, end-to-end" — is demonstrably met.**
