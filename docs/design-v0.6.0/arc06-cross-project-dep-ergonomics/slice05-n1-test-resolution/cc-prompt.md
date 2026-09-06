# CC Prompt — arc06 · slice05 · N1: downstream tests import by specifier (the A-6 closer)

> **You are CC** on `~/lab/lykn/lang`, `release/0.6.x`, with `~/lab/lykn/mycelium`
> (the acceptance corpus, host-only). This is the **last arc06 slice** — it fixes
> N1 by **convention** (import by specifier, not relative source path) and
> delivers **A-6**, the mycelium composition demo, after which arc06 closes. Read
> the promoted **DD-63**, `slice-doc.md`, `ledger.md` (7 rows) first. Surface and
> self-stop.

## Why

mycelium's tests import their package via **relative source paths**
(`../render.js`) that **dangle under the `target/` model** (compiled test lands
in `target/lykn/test/…`, the built package `.js` in `target/lykn/build/…`) — that
is N1, the arc's real acceptance gap. The fix is **not** new resolution code: the
`lykn new` scaffold already writes a self-package key
`"{name}/": "./target/lykn/build/{name}/"`, so a test can import
`<pkg>/render.js` and it resolves to the built output. This slice **proves** that
mechanism (the scaffold writes it but no test exercises it) and adopts it in
mycelium, then reproduces A-6.

## What to do (MUST)

### 1 — FIRST: prove specifier preservation (de-risks everything)
- Confirm the compiler **preserves an import-map specifier**: a test doing
  `(import "<pkg>/render.js" (html))` must compile to JS that **keeps**
  `"<pkg>/render.js"` (Deno resolves it via the `project.json` import map at run),
  **not** a rewritten relative path. Check the emitted JS on a small fixture.
- **If it is NOT preserved → self-stop and surface it.** That is a real compiler
  gap (route it as a compiler follow-up); do not paper over it. (CC's slice04
  bubble-up + the scaffold design say it should pass through — this confirms it.)

### 2 — mycelium: adopt the convention (host, corpus)
- Re-point mycelium at current lykn (the slice02 re-point — scratch branch, don't
  disturb `main`).
- Add the self-package key(s) to mycelium's `project.json`:
  `"mycl-html/": "./target/lykn/build/mycl-html/"` (and `"mycl/"` if `mycl` has
  tests).
- Convert the **3 dangling imports** to the specifier form:
  - `render_test.lykn`: `(import "../render.js" (html))` → `(import "mycl-html/render.js" (html))`
  - `escape_test.lykn`: `(import "../escape.js" (escape-text escape-attr))` → `mycl-html/escape.js`
  - `void_elements_test.lykn`: `(import "../void-elements.js" …)` + `(import "../render.js" …)` → `mycl-html/…`
  - Sweep: **no `../*.js` source imports remain** in mycelium tests.

### 3 — A-6: the composition demo (the arc closer)
- From mycelium, host-run and record commands + output:
  - `lykn build` → green
  - **`lykn test` → green** (the N1 bar; red before this slice)
  - `lykn publish --jsr --dry-run` → green
- This is the arc-scale reproduction of "mycelium builds, tests, and
  publish-dry-runs as a downstream of current lykn."

### 4 — Guide note + scaffold-gap flag
- Write the convention as a guide/SKILL note: **import your package by its
  specifier** — bare `<pkg>` for the public entry (`mod.js`), `<pkg>/file` for
  internals — **not** a relative source path. (Pairs with the arc07 pass.)
- **Flag** (route, don't build): `lykn new` writes **one** `{name}/` self-key;
  a **multi-package** workspace needs a key **per member** (mycelium hand-adds
  here). Route the scaffold enhancement to post-0.6.0 / arc07.

## MUST NOT

- **No new resolution/compiler code** — unless step 1 proves preservation fails,
  in which case **self-stop + route** (don't work around it).
- **Do not build the multi-package scaffold enhancement** — flag it (S-6).
- Keep mycelium's re-point on a scratch branch; restore `main` at hand-off.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` with:

1. The 7-row ledger walk (paste: the preservation check's emitted JS; the
   mycelium `project.json` + test diffs; the **A-6** build/test/publish-dry
   output).
2. **Bubble-up to the arc (the CLOSE):** did slice05 deliver A-6; is the arc
   ready to close — walk A-5 (`lykn add` ✓), A-6 (composition demo ✓), A-7 (all
   14 mycelium issues + N1–N4 dispositioned); anything that blocks the arc gate.

Then **stop** — CDC verifies preservation against `lang`, the mycelium diff, and
A-6 completeness, then writes the **arc06 `closing-report.md`** (A-1…A-7) for
Duncan's gate. This is the slice on which the 0.6.0 dive's original motivation —
consume lykn as a dependency, end-to-end — is demonstrably met.

## Host note

Apple Silicon: `rm -f bin/lykn && cp …` (bare `cp` over the running binary →
`Killed: 9`).
