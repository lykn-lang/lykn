# arc06 · slice05 — Closing Report (N1: import-by-specifier; the A-6 closer)

**By:** CC (Claude Code) · **Date:** 2026-07-23 · **Branch:** `release/0.6.x`
(lang) / `smoke/0.6-slice05-import-by-specifier` (mycelium corpus)
**Verdict: delivered — A-6 is green.** N1 is fixed by **convention, not new
compiler code**: a downstream test imports its own package by the self-package
import-map specifier (`mycl-html/render.js` → `target/lykn/build/mycl-html/`)
instead of a relative source path (`../render.js`) that dangles under the
`target/` model. mycelium now **builds, tests (43/0), and publish-dry-runs**
green as a downstream of current lykn. Zero `lang` source change; `make check`
green. **arc06's original motivation — consume lykn end-to-end — is met.**

## Per-row ledger walk (7 in, 7 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **S-1** — specifier preservation (de-risker) | **done** | `lykn compile` of a fixture emits the import **verbatim**: `(import "mycl-html/render.js" (html))` → `import {html} from "mycl-html/render.js";`. Bare `mycl-html` → `"mycl-html"`; subpath → `"mycl-html/escape.js"`; and `../render.js` → `"../render.js"` — **all** passed through unrewritten (identifiers kebab→camel, but specifier *strings* are untouched). Preservation holds ⇒ **no compiler change, no route needed.** |
| **S-2** — mycelium re-pointed + self-key | **done** | Scratch branch `smoke/0.6-slice05-import-by-specifier` off the slice02 re-point (registry-pinned `@0.5.2` = current lykn). `project.json` gains `"mycl-html/": "./target/lykn/build/mycl-html/"`. `mycl` has no tests → no `mycl/` key (see S-6). |
| **S-3** — 3 dangling imports converted | **done** | 4 import lines / 3 files: `escape_test` (`../escape.js`→`mycl-html/escape.js`), `render_test` (`../render.js`→`mycl-html/render.js`), `void_elements_test` (`../void-elements.js` + `../render.js`→`mycl-html/…`). Post-sweep `grep -rn '\.\./.*\.js' packages --include='*.lykn'` = **zero**. |
| **S-4** — **A-6 green** | **done** (CC-attested) | Host, from mycelium: `lykn build` ✓ (both packages → `target/lykn/build/`); **`lykn test` → 43 passed / 0 failed** (was `Module not found` red before); `lykn publish --jsr --dry-run` → **"Dry run complete"**. |
| **S-5** — guide note | **done** | `docs/guides/16-testing.md` ID-15 extended (`42500a9`): the `target/`-model explanation, ✗ relative vs ✓ specifier, the scaffold self-key, and the bare-`<pkg>` (public API) vs `<pkg>/file` (internal) distinction. |
| **S-6** — multi-package scaffold gap routed | **done** | Guide blockquote flags it; routed here to post-0.6.0 / arc07 (per-member self-key generation). **Not built.** |
| **S-7** — minimal `lang` change; `make check` green | **done** | S-1 held ⇒ **zero `lang` source change**; only `docs/guides/16-testing.md` (+41). `make check` green — build + lint + test, **476 doc blocks, 0 failed**. |

### The N1 mechanism (why relative dangles, why the specifier resolves)

`lykn test` compiles `packages/mycl-html/tests/render_test.lykn` →
`target/lykn/test/packages/mycl-html/tests/render_test.js`, mirroring the source
tree. A **relative** `../render.js` in that compiled file resolves to
`target/lykn/test/packages/mycl-html/render.js` — which does not exist; the
built module is at `target/lykn/build/mycl-html/render.js`. Deno reports
`Module not found`. The **self-package specifier** `mycl-html/render.js` is
resolved through the import-map key `"mycl-html/": "./target/lykn/build/mycl-html/"`,
landing on the built output regardless of where the compiled test sits. Because
lykn preserves the specifier verbatim (S-1), the import map does all the work —
no resolution code was needed.

### A-6 evidence (host, mycelium scratch branch)

```
$ lykn build
@lykn/mycl built in target/lykn/build/mycl/
@lykn/mycl-html built in target/lykn/build/mycl-html/

$ lykn test packages/mycl-html/tests/
...
ok | 43 passed | 0 failed (94ms)

$ lykn publish --jsr --dry-run
@lykn/mycl-html staged in target/lykn/dist/mycl-html/  ...
Simulating publish of @lykn/mycl-html@0.1.1 ...
Simulating publish of @lykn/mycl@0.0.2 ...
Success  Dry run complete
```

**Safety-gate note (methodology-clean):** the first `publish --dry-run` fired
the uncommitted-changes gate. Per the CLI safety rule I **satisfied the gate**
(committed the 4 mycelium files on the scratch branch, `e60af9d`) rather than
passing `--allow-dirty`. **Publish-safety of the self-key:** the staged
`target/lykn/dist/*/deno.json` carry only `exports`/`lint`/`name`/`version` —
`grep 'target/lykn/build'` across the staged publish configs = **zero**. The
dev-only self-key is a workspace-root import-map concern and never propagates
into a per-package publish config, so a local build path cannot reach a
published package (the same architectural property slice04 bought for `link`).

## Bubble-up to the arc — **the CLOSE**

**Did slice05 deliver A-6?** Yes. mycelium builds, **tests green (43/0)**, and
publish-dry-runs as a downstream of current lykn. The N1 acceptance gap that
slice02 named as "arc06's real bar" is closed — and closed *without* new
compiler or resolution code, exactly as the slice04 reframe predicted (the
scaffold already writes the self-key; the compiler already preserves the
specifier; the fix was to *teach the import*).

**Is arc06 ready to close? Walk A-1…A-7:**

| A-row | Bar | State after slice05 |
|-------|-----|---------------------|
| **A-1** | slice01 (lang-exports-gap) closed | **met** — CDC-verified |
| **A-2** | slice02 (mycelium re-audit) closed | **met** — CDC-verified (`a2e9b00`); ground-truth inventory |
| **A-3** | slice03 (`lykn add`) closed | **met** — CDC-verified (`f9f9014`) |
| **A-4** | slice04 (external-project path / `lykn link`) closed | **met** — CDC-verified (`e1c0dd7` + `6904fe1`) *(arc-plan row still reads "open" — update on gate)* |
| **A-5** | `lykn add <specifier>` adds a dep and it resolves | **met** — `lykn add` exact-pins + resolves (slice03) |
| **A-6** | mycelium builds **and tests** green as a downstream | **met (this slice)** — 43/0 + build + publish-dry green |
| **A-7** | every mycelium issue dispositioned with a home | **met** — slice02's 14 issues (9 fixed / 1 partial / 2 open, all routed) + N1–N4: **N1 closed here**; **N2** delivered by slice03 (`add`) + slice04 (`link`); **N3** routed to arc07 docs; **N4** routed to a post-0.6.0 compiler-follow-up. No silent drops. |

**Nothing blocks the arc gate.** All seven acceptance rows are met; the only
bookkeeping is flipping the A-4 arc-plan row (slice04 is closed) and updating
the arc ledger — CDC's arc06 `closing-report.md` job. Routed-forward, not
blocking: the per-member self-key scaffold enhancement (S-6 → post-0.6.0 /
arc07), N3 deprecation docs (arc07), N4 surface-name warning + #11 unused-binding
FP (post-0.6.0 compiler-follow-up).

## Discipline notes

- **lang source:** none. Only `docs/guides/16-testing.md` (+41), committed
  `42500a9` via pathspec (planning docs left staged for CDC). `make check` green.
- **mycelium (host corpus):** scratch branch `smoke/0.6-slice05-import-by-specifier`
  (commit `e60af9d`); `main` **untouched**. Diff = `project.json` (+1 self-key) +
  3 test files (4 import lines).
- **Safety:** dirty-tree gate satisfied by committing, **not** `--allow-dirty`.
  Self-key verified absent from staged publish configs.
- **Host note:** `rm -f bin/lykn && cp target/release/lykn bin/lykn` (Apple
  Silicon signature) before running against mycelium.
- Closing report + filled ledger untracked at hand-off; the guide lands as a
  green increment.
