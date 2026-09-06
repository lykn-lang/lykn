# CC Prompt — arc06 · slice04 · `lykn link`/`unlink` (registry⇄local overlay)

> **You are CC** on `~/lab/lykn/lang`, `release/0.6.x`. This adds the **dev-only,
> non-destructive** registry⇄local switch (DD-63 §3(a), promoted). Builds on
> slice03's `lykn add` machinery. **N1 (downstream-test resolution) is slice05 —
> not this slice.** Read the promoted **DD-63** (odm), `slice-doc.md`,
> `ledger.md` (8 rows) first. Surface and self-stop.

## Why

Developing against a *local* lykn checkout today means hand-editing `project.json`
to a build-dir path — lossy (destroys the registry pin) and easy to accidentally
commit a `../lang` path. `lykn link` makes it a command backed by a **git-ignored
overlay**, so you flip freely, never lose the pin, and **can't publish a local
path** (the safety property).

## What to do (MUST)

### 1 — `Link`/`Unlink` subcommands
- `Commands::Link { package: String, path: PathBuf }` and
  `Commands::Unlink { package: String }` (beside `Add`), dispatched to
  `cmd_link`/`cmd_unlink`.

### 2 — `project.local.json` overlay (git-ignored)
- `link` writes/updates **only** the overridden `imports` keys in
  `project.local.json` at the project root; `unlink` removes that dep's keys
  (and the file if empty). Preserve `IndexMap` order / pretty-print.
- Add `project.local.json` to the `lykn new` `.gitignore` template
  (`GITIGNORE_TEMPLATE`).

### 3 — Build-dir resolution (require-built)
- `link <pkg> <path>` resolves the override to **`<path>/target/lykn/build/<pkg>/`**
  — bare key → its `mod.js`, slash key → the dir. **Reuse slice03's bare+slash
  emission.** **NOT** `<path>/packages/<pkg>/` (that's source `.lykn`). If
  `<path>/target/lykn/build/<pkg>/` is absent, error:
  `run 'lykn build' in <path> first` — do **not** auto-build another project.

### 4 — Effective-config merge (the mechanism)
- `project.json` **is** Deno's `--config`. Add
  `config::read_effective_project_config[_optional]`: read `project.json`, overlay
  `project.local.json`'s `imports` (**local wins**).
- For the deno-facing config: when an overlay exists, write the merged config to a
  git-ignored **`target/lykn/project.effective.json`** and pass
  `deno … --config target/lykn/project.effective.json`; when no overlay, pass
  `project.json` directly (today's path — zero overhead).
- Point the **dev** consumers at the effective reader: the macro import-map in
  `compile.rs` (`read_project_config_optional` sites) and `find_config` / the
  `deno run`/`test` `--config`.

### 5 — Dev-only — dist/publish read RAW (the safety property)
- **`dist.rs` and `publish` MUST keep reading `project.json` (the raw
  `read_project_config`)** — do **not** switch them to the effective reader. A
  **linked dependency must not appear in `lykn dist` output or publish staging.**
  This is the property Option 2 buys over a destructive rewrite; it is a ledger
  row (S-5), not a detail.

### 6 — Tests
- `link` writes the build-dir override (bare+slash) to `project.local.json`;
  **require-built** error when unbuilt; effective merge (local overrides base);
  `unlink` removes the override and leaves `project.json` **unchanged**
  (lossless restore); **SAFETY: a linked dep is absent from `lykn dist`
  output**; **effective-config relative-path resolution** (`../lang/…` resolves
  correctly from `target/lykn/project.effective.json`).
- `make check` green.

## MUST NOT

- **Do not touch `project.json` on `link`** — the committed pin is never edited;
  the override lives in `project.local.json` (S-2/S-6).
- **Do not let the overlay reach dist/publish** — they read raw (S-5).
- **Do not resolve to `packages/`** — build-dir only, require-built (S-3).
- **No new heavy Rust deps** (deno-shell continuity from slice03).
- **No N1 / test-import resolution** — that's slice05.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` with: the 8-row ledger walk (paste `project.json` +
`project.local.json` before/after a `link`, and the dist-output proving the
linked dep is absent); the effective-config merge as landed (the reader + where
the `--config` is generated); and a **bubble-up** — did the overlay deliver the
lossless registry⇄local flip with the dist-ignores-overlay safety property; what
it revealed that reshapes **slice05** (N1 test resolution — how a test imports the
linked package); any effective-config path-resolution subtlety.

Then **stop** — CDC verifies the effective reader is dev-only, build-dir
resolution, the safety test, and lossless unlink. Runtime rows reconcile on host.

## Host note

Apple Silicon: `rm -f bin/lykn && cp …` (bare `cp` over the running binary →
`Killed: 9`).
