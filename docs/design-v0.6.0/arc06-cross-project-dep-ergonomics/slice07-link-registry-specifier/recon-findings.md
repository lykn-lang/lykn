# arc06 · slice07a — Recon findings (literal-registry-specifier override)

**By:** CC · **Date:** 2026-07-24 · **Deliverable:** the feasibility proof + the
design forks that shape 07b. **No production code landed** — the spike below was
reverted; the tree is clean. **This is the sign-off gate before 07b.**

## The question

Can a downstream point a **literal registry specifier** — e.g.
`(import-macros "jsr:@lykn/testing@0.5.2" …)` — at a **local build** via a dev
overlay, so it exercises current-source libraries? (The runsheet's C-bis wanted
this; it failed because `lykn link` overrides import-map *aliases*, and a literal
`jsr:` specifier isn't an alias.)

## Finding 1 — root cause: resolver ordering (not a `lykn link` bug)

`crates/lykn-lang/src/expander/pass0.rs::resolve_specifier` resolves a macro/
import specifier in tiers:

1. **Tier 1 — scheme:** `jsr:` / `npm:` / `http(s):` → resolve via Deno / the
   DD-53 JSR fetch. **Runs first.**
2. file:// → path.
3. **Tier 2 — import map:** exact key, then longest `/`-prefix. **Only reached
   for non-scheme specifiers**, because Tier 1 already returned.
4. workspace `packages/<name>/` fallback.
5. Tier 3 — filesystem.

So a **literal `jsr:` specifier short-circuits at Tier 1 and never consults the
import map** — an overlay override is silently ignored. That is *exactly* why
C-bis couldn't redirect the testing macros.

## Finding 2 — the fix + failing→passing proof

**Hook:** an exact import-map override at the **top** of `resolve_specifier`,
ahead of the scheme branch:

```rust
// exact override wins over EVERY later tier — including the scheme branch —
// so a literal jsr:/npm: specifier can be redirected to a local build.
if let Some(target) = imports.and_then(|m| m.get(module_path)) {
    return resolve_specifier(target, file_path, None, deno);
}
```

The plumbing already exists: the effective `imports` map
(`config::read_effective_project_config_optional`) is threaded into
`expander::expand` → `pass0`. The fix is *one lookup*, ahead of the scheme test.

**Micro-proof** (`resolve_specifier("jsr:@lykn/testing@0.5.2", …)` with an exact
overlay entry `→ /tmp/local/testing/mod.lykn`):

| State | Result |
|-------|--------|
| **WITHOUT hook** (today) | `~/.cache/lykn/macros/jsr_@lykn_testing@0.5.2/mod.lykn` — **the JSR fetch cache**; override ignored → **test FAILS** |
| **WITH hook** | `/tmp/local/testing/mod.lykn` — the local override, short-circuiting the JSR fetch → **test PASSES** |

The failing state also *demonstrates* the literal specifier fetching from JSR
today. Existing `resolve_specifier` tests are unaffected: a bare exact-match
(`test_resolve_specifier_import_map_exact`) already recurses `resolve_specifier(
target, …)`, so the top hook yields the identical result for aliases; only
scheme-prefixed keys gain new behavior. (Spike + test reverted after capture.)

## Finding 3 — the real design fork: macro modules need `.lykn` source

A **macro-module** override must point at a dir the expander can read **macro
source** from — it compiles `mod.lykn` (Tier 1 returns `module_dir/mod.lykn`).
But `lykn link`'s current target, `target/lykn/build/<pkg>/`, holds **only
compiled `.js`**:

```
target/lykn/build/testing/   → helpers.js  macros.js  mod.js        (NO mod.lykn)
packages/testing/            → mod.lykn  (the source)
target/lykn/dist/testing/    → mod.lykn + helpers.js + macros.js + mod.js  (macro-module dist copies BOTH)
```

So a macro-module override **cannot use the build dir** — it must point at the
**dist** dir (`target/lykn/dist/<pkg>/`, which copies `.lykn` for macro modules;
requires `lykn dist` first) or the **source** package (`packages/<pkg>/`). This
is the main thing 07b must decide.

## Shaped 07b plan (pending sign-off)

1. **Resolver (`pass0`):** land the top-of-fn exact override (production form +
   a real test, not the spike). Decide the guard (see Q3).
2. **`lykn link` CLI:** detect a scheme-prefixed arg; derive the package →
   local-dir; **require** the right local dir (dist for macro modules); write an
   **exact-key** overlay entry (`jsr:@scope/pkg@ver` → local). `unlink` removes
   by exact key. Reuses slice04's overlay writer + the raw-reader safety property.
3. **Safety test:** a linked literal specifier is **absent** from `lykn dist`
   output (dist/publish read raw — unchanged).
4. **Demo:** mycelium `lykn link jsr:@lykn/testing@0.5.2 ~/lab/lykn/lang` →
   build + test **43/0** against current-source testing (the real C-bis).
5. `make check` green; scoped diff; no new deps.

## Open design questions for the operator (07b)

- **Q1 — macro-override target: dist or source?** *Recommend **dist*** (`<path>/
  target/lykn/dist/<pkg>/`): it's the published *shape* (has `mod.lykn` **and**
  the runtime `.js`), so one override serves both macro + runtime imports, and it
  mirrors what actually ships. Cost: requires `lykn dist` in the linked project
  first (a clear require-dist error, like slice04's require-built).
- **Q2 — override key: exact only, or version-agnostic too?** *Recommend
  **exact only*** for 0.6.0 (`jsr:@lykn/testing@0.5.2`) — matches what the source
  literally imports, least surprising. A version-agnostic form (`jsr:@lykn/
  testing` → local regardless of pin) is a possible 0.7.0 nicety.
- **Q3 — resolver guard: override everything, or local targets only?**
  *Recommend override **only when the target resolves to an existing local path***
  (fs, not another `jsr:`/`npm:`) — keeps the hook strictly a dev-overlay
  redirect and can't accidentally reroute one registry specifier to another.
- **Q4 — verb: extend `lykn link` (recommended) vs a new `link-spec`?** 07b
  assumes **extend `lykn link`** (branch on whether the arg has a scheme) unless
  you prefer the separate verb.

**Sign-off asks:** confirm Q1–Q4 (or just "go with the recommendations"), then
07b implements.
