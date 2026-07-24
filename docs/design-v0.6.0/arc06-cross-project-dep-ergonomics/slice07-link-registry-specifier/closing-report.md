# arc06 · slice07 — Closing Report (`lykn link` for a literal registry specifier)

**By:** CC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Verdict: delivered.** `lykn link jsr:@scope/pkg@ver <path>` redirects a
*literal* registry specifier — including a **macro module** imported by that
literal (`(import-macros "jsr:@lykn/testing@0.5.2" …)`) — at a local **dist**
build, honored by the resolver ahead of the JSR/npm fetch, while `dist`/`publish`
keep reading the raw `project.json`. mycelium now tests against **current-source**
testing (the runsheet's C-bis, made real): `lykn build` ✓ · `lykn test` **43/0**,
with a negative proof the override is *active*. `make check` green.

## Per-row ledger walk (8 in, 8 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **R-1** — 07a recon + sign-off | **done** | The gap is a resolver *ordering* fact: `pass0::resolve_specifier` checks the scheme (Tier 1) before the import map, so a literal `jsr:` bypasses overrides. Failing→passing micro-proof (WITHOUT hook → `~/.cache/lykn/macros/…` JSR cache; WITH → local). Macro-source fork surfaced (build dir has only `.js`; `mod.lykn` is in dist). Operator signed off: **dist target**, extend `lykn link`, exact key, local-guarded. |
| **S-1** — resolver Tier-0 override | **done** | `pass0.rs`: an exact `imports` entry whose target is non-scheme (`is_scheme_specifier`) resolves to the local target ahead of Tier 1. Tests `test_resolve_specifier_literal_specifier_override_wins_over_scheme` + `_scheme_target_override_is_not_taken`; **11/11** resolver tests green (existing alias/prefix/jsr unaffected — a bare exact match already recursed identically). |
| **S-2** — `lykn link <spec>` | **done** | `cmd_link` branches on `jsr:`/`npm:` → `cmd_link_specifier`: `add::parse_specifier` → unscoped last segment = dist-dir name (`@lykn/testing`→`testing`); **require-dist** (`run 'lykn dist' in <path> first`); exact-key overlay `"jsr:@lykn/testing@0.5.2" → .../dist/testing/`. |
| **S-3** — `lykn unlink <spec>` | **done** | `cmd_unlink` branches on scheme → removes just the exact key (no `/` variant). Host: overlay removed, `project.local.json` deleted when empty. |
| **S-4** — effective-config fix | **done** | A pre-existing slice04 bug the demo surfaced: the effective config lives at `target/lykn/`, so relative base imports (the `mycl-html/` self-key) **and** `workspace` members resolved wrong. Fix: absolutize **base** imports (not just overlay) against root, and **drop `workspace`** (deno requires members nested under the config dir; it's a dev import-map override, and publish uses the raw config). Rewrote `write_effective_deno_config` from text-splice to a `serde_json::Value` round-trip (project.json is strict JSON — jsonc was never supported). |
| **S-5** — SAFETY (dist/publish raw) | **done** | `dist.rs` reads raw `read_project_config` (unchanged). Host: `lykn dist` with the link active → **0** override refs in the staged `project.json`. The override lives only in git-ignored `project.local.json` + the generated effective config — it can't reach a published package. Same architectural guarantee as slice04, extended to the literal-specifier key. |
| **S-6** — the real C-bis demo | **done** | mycelium scratch branch: `lykn dist` (lang) → `lykn link jsr:@lykn/testing@0.5.2 ~/lab/lykn/lang` → `lykn build` ✓ · `lykn test` **43/0**. **Negative proof:** renaming the local dist target made the test fail (`import-macros: no macro entry found in …/dist/testing/`) — the resolver was using the local override, not JSR — restore → green. mycelium restored (unlinked; scratch branch deleted; `main`/slice05 untouched). |
| **S-7** — `make check`; scoped diff | **done** | `make check` ✓. Diff: `crates/lykn-lang/src/expander/pass0.rs` (Tier 0 + `is_scheme_specifier` + 2 tests), `crates/lykn-cli/src/main.rs` (link/unlink branch + `cmd_link_specifier` + help), `crates/lykn-cli/src/config.rs` (effective-config fix). `Cargo.toml` untouched; no new deps. |

## How it resolves (the mechanism)

```
(import-macros "jsr:@lykn/testing@0.5.2" …)
   │  resolve_specifier("jsr:@lykn/testing@0.5.2", effective-imports, …)
   ├─ Tier 0 (NEW): exact overlay hit → target ".../dist/testing/" (non-scheme) → recurse → the dir
   │                                     (WITHOUT this: Tier 1 fetches from JSR)
   └─ process_single_import: resolved.is_dir() → find_macro_entry → dist/testing/mod.lykn (+ siblings)
```

The overlay points at the **dist** dir because that's the only local artifact
that carries a macro module's `mod.lykn` **source** (the build dir has only
compiled `.js`); dist also carries the runtime `.js`, so one override serves both.

## Bubble-up to the arc

- **The runsheet's routed C-bis limitation is now a shipped 0.6.0 capability.** A
  downstream can develop a macro/runtime dependency against a local checkout by
  its published specifier, then flip back with `unlink` — with the slice04 safety
  property intact (a local path can't be published).
- **Fixed a latent slice04 bug** en route: the effective config broke relative
  base imports + `workspace` when any overlay was present (slice04's tests didn't
  exercise a workspace project with tests + an overlay). Now absolutized + workspace
  dropped — this also hardens slice04's own `lykn link` on real multi-package
  downstreams.
- **Routed forward (0.7.0):** a version-agnostic override form
  (`jsr:@scope/pkg` → local regardless of the pinned version) — 0.6.0 ships the
  exact-key form, which matches what source literally imports.

## Discipline notes

- **Source only:** `pass0.rs`, `main.rs`, `config.rs`. No new deps. `cargo fmt`
  applied. Recon spike (07a) was reverted before 07b — no dead code.
- **Host note:** `rm -f bin/lykn && cp …` (Apple Silicon signature); `lykn dist`
  in the linked project is the require-dist precondition.
- Recon (`recon-findings.md`) + this report + the ledger authored at operator
  direction (recon-first, signed off before impl).
