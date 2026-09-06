# arc06 · slice04 — Closing Report (`lykn link`/`unlink` overlay)

**By:** CC (Claude Code) · **Date:** 2026-07-23 · **Branch:** `release/0.6.x`
**Verdict: delivered.** `lykn link <pkg> <path>` points a dependency at a local
build via a git-ignored `project.local.json`, `lykn unlink` flips back
losslessly, dev paths (run/test/compile/macro) see the overlay, and
**`lykn dist`/`publish` do not** — the safety property. Reuses slice03's writer
shape; no new deps. `make check` green.

## Per-row ledger walk (8 in, 8 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **S-1** — `Link`/`Unlink` subcommands | **done** | `Commands::Link { package, path }` / `Unlink { package }` (main.rs) → `cmd_link`/`cmd_unlink`. |
| **S-2** — git-ignored `project.local.json` overlay | **done** | `config::write_overlay`/`remove_from_overlay` manage `<root>/project.local.json` (imports-only, order preserved, deleted when empty). `GITIGNORE_TEMPLATE` gains `project.local.json`. |
| **S-3** — build-dir resolution, require-built | **done** | `link` resolves to `<path>/target/lykn/build/<pkg>/` (bare → `mod.js`, slash → dir) — **not** `packages/`. Unbuilt → `error: … run 'lykn build' in <path> first` (host: `lykn link nope /tmp/x` rc=1). |
| **S-4** — effective merge (local wins), fed to dev | **done** | `config::read_effective_project_config_optional` = base ⊕ overlay (local wins); consumed by `compile.rs` (3 macro-import-map sites), `cmd_test`'s validation, and `dev_config` (run/test `--config`). When an overlay exists, `write_effective_deno_config` emits `target/lykn/project.effective.json`; else `project.json` directly. Test `effective_merge_local_wins_over_base`. |
| **S-5** — **SAFETY: dist/publish ignore the overlay** | **done** | grep: `dist.rs` reads raw `read_project_config`/`read_project_config_optional` (lines 185/573/611), **never** the effective reader. Host: `lykn dist` after linking `localdep` → **0** `localdep` in `target/lykn/dist/project.json`. A linked dep cannot reach published output. |
| **S-6** — lossless `unlink` | **done** | `remove_from_overlay` drops the dep's keys, deletes the file when empty; `project.json` never touched. Host: link → unlink → `project.local.json` gone, `project.json` 0 `localdep`. Test `overlay_remove_deletes_file_when_empty_and_errors_on_absent`. |
| **S-7** — effective-config relative-path resolution | **done** | `absolutize_import` resolves a relative override against the project root when writing `project.effective.json` (which lives two levels deeper, `target/lykn/`), so `../dep/…` still resolves correctly. Host: overlay `"../localdep/…/mod.js"` → effective `"/private/tmp/relproj/../localdep/…/mod.js"` (absolute). Test `absolutize_relative_leaves_registry_and_absolute`. |
| **S-8** — `make check` green; scoped diff; no new deps | **done** (CC-attested) | `make check` ✓. Diff: `main.rs` (link/unlink + `dev_config` + gitignore), `config.rs` (overlay + effective + 4 tests), `compile.rs` (3 dev sites → effective), `add.rs` (helpers `pub(crate)` for reuse). `Cargo.toml` untouched. |

### `project.json` / `project.local.json` before / after a `link`

```jsonc
// project.json — UNCHANGED by link (the committed pin is never touched)
"imports": { "localdep/": "…", "lang/": "jsr:@lykn/lang/", … }

// project.local.json (git-ignored) — written by `lykn link localdep /tmp/localdep`
{ "imports": {
    "localdep":  "/tmp/localdep/target/lykn/build/localdep/mod.js",
    "localdep/": "/tmp/localdep/target/lykn/build/localdep/"
} }

// lykn dist output (target/lykn/dist/project.json) — localdep ABSENT (safety)
```

## Effective-config merge (as landed)

- **Reader:** `config::read_effective_project_config_optional` — `project.json`
  ⊕ `project.local.json` (`insert` = local wins). **Dev-only** (run / test /
  compile / macro-expansion). `dist.rs` deliberately keeps the raw
  `read_project_config[_optional]` — the safety row (S-5).
- **Deno `--config` generation:** `dev_config()` → `write_effective_deno_config`:
  when a non-empty overlay exists, splice the merged (+ absolutized) imports into
  the `project.json` text and write `target/lykn/project.effective.json`, pass
  that; else pass `project.json` directly (zero overhead — the common case).
  The splice reuses slice03's `add::splice_imports` (one imports-writer for both
  `project.json` and the effective file), so all other config keys
  (`workspace`/`lint`/`tasks`) are preserved byte-for-byte.
- **Path absolutization (S-7):** the effective file lives at `target/lykn/`, two
  levels below root, so a *relative* override written verbatim would resolve
  wrong (deno resolves import-map values relative to the config file). `link`
  stores the human-readable path in `project.local.json`; the effective writer
  **absolutizes** relative fs values against the root (registry `jsr:`/`npm:` and
  already-absolute values pass through). This was the "easiest to get subtly
  wrong" wrinkle DD-63 §7 flagged — tested explicitly.

## Bubble-up to the arc (three questions)

**1. Did the overlay deliver the lossless registry⇄local flip with the safety
property?** Yes. `link`/`unlink` flip freely, the committed pin is never edited,
a relative or absolute local path both resolve, and — the property Option 2 buys
— **`lykn dist` output contains no local path** (verified: 0 `localdep` in the
staged config). You cannot publish a local checkout.

**2. What it revealed that reshapes slice05 (N1 — downstream test resolution):**
- **slice04 produces the specifier slice05 must honor, and it's a *bare/slash
  import-map key* (`localdep` / `localdep/`), not a relative `../x.js`.** The N1
  gap (slice02) was that mycelium's tests do `(import "../render.js")`, which
  dangles under `target/`. With `lykn link`, the linked package is reachable via
  its **import-map key** (`localdep/mod.js` or the bare `localdep`). **Recommend
  slice05's A-6 bar be: a downstream test imports its package via the
  import-map specifier (which the effective config resolves to the local build),
  not a relative source path** — i.e. N1 is fixed by *teaching the import*, and
  the effective config already makes it resolve. slice05 should verify
  `lykn test` green from mycelium once its tests import via the specifier.
- **The effective config is the resolution substrate slice05 inherits:** because
  `dev_config` already feeds `target/lykn/project.effective.json` to
  `deno test --config`, a test that imports the linked package by specifier
  resolves with **zero additional machinery** — slice05 is mostly a
  downstream-import convention + the A-6 demo, not new resolution code.

**3. Effective-config path-resolution subtlety:** the absolutization (S-7) is the
one real subtlety — a relative override must be resolved against the *root*, not
left relative to the effective file's deeper location. Absolutizing (rather than
recomputing a `../../`-adjusted relative) is robust to any file depth and to
`deno`'s relative-to-config resolution. Registry/absolute values pass through
untouched so a mixed overlay is fine.

## Discipline notes

- **Source:** `main.rs` (link/unlink + `cmd_link`/`cmd_unlink` + `dev_config` +
  gitignore), `config.rs` (overlay read/write, effective reader, effective-deno
  config, absolutization + 4 tests), `compile.rs` (3 dev macro-import sites →
  effective), `add.rs` (splice/render helpers `pub(crate)` for reuse). **`dist.rs`
  untouched** (reads raw — the safety property). No new heavy deps (deno-shell
  continuity). No N1/test-import resolution (slice05).
- **Host note:** `rm -f bin/lykn && cp …` (Apple Silicon signature).
  Runtime rows (link/unlink/dist-safety/run/test via deno) CC-attested →
  host reconcile.
- Closing report + ledger untracked at hand-off; source lands as a green
  increment.
