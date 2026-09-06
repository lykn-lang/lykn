# arc06 · slice05 — CDC Verification (N1: import-by-specifier; the A-6 closer)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's slice05 (guide commit
`42500a9`; mycelium scratch `e60af9d`). Code review + grep against `lang`;
runtime rows (mycelium, host-only) CC-attested → host reconcile. Verifier ≠ closer.

## Verdict — VERIFIED; A-6 green

The de-risker holds: the compiler preserves import specifiers verbatim, so N1 is
pure convention with **zero `lang` source change**. mycelium adopted it; A-6
(build + test + publish-dry) is green (CC-attested). Rows S-1…S-7 met.

## Independent CDC checks

| Claim | CDC check | Result |
|-------|-----------|--------|
| **S-1 — specifier preservation (the de-risker)** | `emit_import` (`codegen/emit.rs`) writes the module path via `emit_expr(module_path)` — a string literal emits verbatim; no rewrite to relative | **reproduced** — `(import "mycl-html/render.js" …)` → `from "mycl-html/render.js"` unchanged; **no compiler gap → nothing to route** |
| **S-2 — self-key added** | mycelium `project.json` @ `e60af9d`: `"mycl-html/": "./target/lykn/build/mycl-html/"` | **reproduced** |
| **S-3 — dangling imports converted** | grep mycelium `packages/*/tests/*.lykn`: **0** `../*.js` source imports remain | **reproduced** |
| **Zero `lang` source change** | slice05's `lang` commit `42500a9` = `docs/guides/16-testing.md` only (+41); no `crates/` | **reproduced** |
| **S-5 — guide note** | `16-testing.md` ID-15: relative dangles under `target/`; use the self-package specifier; bare `<pkg>` = public API, `<pkg>/file` = internal | **reproduced** |
| **S-4 — A-6 green** | mycelium (downstream): `lykn build` ✓ · `lykn test` **43 passed / 0 failed** (was Module-not-found red) · `lykn publish --jsr --dry-run` "Dry run complete"; dev-only self-key **absent** from staged publish `deno.json` (publish-safe); dirty-tree gate satisfied by a scratch-branch commit, **not** `--allow-dirty` | **attested (CC)** → host reconcile |
| **S-6 — multi-package scaffold gap routed** | `lykn new` writes one `{name}/` self-key; multi-package needs per-member → routed post-0.6.0 / arc07 | **attested** |

Mechanism cross-check: S-1 (verbatim specifier) + S-2 (self-key → `target/lykn/build`)
together make S-4's resolution sound — the runtime greenness follows from the two
reproduced facts, so the host reconcile is confirmation, not discovery.

## Close status

slice05 **CDC-verified → closes** on host reconcile. It turns **A-6 green** — the
last open arc06 acceptance bar. Proceeding to the **arc06 closing report**.
