# arc06 · slice04 — `lykn link`/`unlink` (the registry⇄local overlay)

> **Open set** (2026-07-22, CDC). DD-63 promoted (odm). The **dev-only,
> non-destructive** registry⇄local switch — the DD-63 §3(a) overlay. Builds on
> slice03's specifier/pair/writer machinery. The N1 downstream-test resolution
> is **slice05** (separate capability; this slice produces the import-map
> specifier slice05 must honor).

## 1. Goal

`lykn link <package> <local-path>` points an already-declared dependency at a
**local build** for development, via a **git-ignored `project.local.json`** that
overlays the committed `project.json` — so `lykn run`/`test`/`compile` use the
local checkout while `lykn dist`/`publish` **still use the committed registry
pin**. `lykn unlink <package>` flips back; the registry pin was never touched.
This is the "flip constantly, lose nothing, never commit a local path" ergonomic
the mycelium audit named the biggest gap.

## 2. Scope

### In

- **`Link { package, path }` + `Unlink { package }`** — clap variants + dispatch
  (beside `Add` from slice03).
- **`project.local.json`** (git-ignored) — holds *only* the overridden `imports`
  keys. `lykn link` writes/updates the override; `unlink` removes it.
- **Build-dir resolution** (DD-63 §3(d)) — `link` resolves the override to
  `<path>/target/lykn/build/<pkg>/` (bare → its `mod.js`, slash → the dir),
  **not** `<path>/packages/<pkg>/` (source `.lykn`). **Require-built:** error
  `run 'lykn build' in <path> first` if `target/lykn/build/<pkg>/` is absent — do
  not auto-build another project. Reuse slice03's bare+slash pair emission.
- **Effective-config merge (the mechanism)** — because Deno reads exactly one
  `--config` and **`project.json` *is* that config**, add
  `read_effective_project_config[_optional]`: merge `project.json` +
  `project.local.json` (**local wins**) and, for the deno-facing config, write
  the merged result to a git-ignored `target/lykn/project.effective.json` and
  pass `deno … --config` **that** (when an overlay exists; else pass
  `project.json` directly — zero overhead for the common case).
- **Dev-only — invisible to dist/publish (the safety property).** The merged
  view feeds **run / test / compile / macro-expansion** only.
  **`lykn dist`/`publish` continue to read the raw `project.json`** (they keep
  the existing `read_project_config` reader; do **not** switch them to the
  effective reader). A linked dependency MUST NOT appear in `lykn dist` output.
- **`.gitignore`** — the `lykn new` scaffold template gains `project.local.json`.
- **Tests** — `link` writes the override (build-dir path, bare+slash);
  require-built errors when unbuilt; effective merge (local overrides base);
  `unlink` removes it and restores the committed pin; run/test resolve via the
  merged config; **the safety test: a linked dep is absent from `lykn dist`
  output / publish staging**.

### Out

- **N1** — how a downstream *test* imports its own built local package (the
  relative `../render.js` dangling under `target/`) — **slice05** (the A-6
  "downstream `lykn test` green" bar). slice04 produces the specifier; slice05
  makes test-resolution honor it.
- `lykn remove`, the Mix `~>` DSL, `lykn update`, `--package` — future.

## 3. Design points (DD-63)

- **Merge point** (DD-63 §3(a)): the effective reader lives near
  `config::read_project_config`, consumed by the dev paths (`compile.rs`'s macro
  import-map; `find_config`/the deno `--config` for run/test); `dist.rs` stays on
  the raw reader. One merged view for dev; raw for publish.
- **Effective-config path resolution** (DD-63 §7 wrinkle) — a relative override
  (`../lang/target/lykn/build/lang/`) is **project-root-relative**; when written
  into `target/lykn/project.effective.json` it must still resolve to the same
  place (keep root-relative, or absolutize). **Test this explicitly** — it's the
  easiest thing to get subtly wrong.
- **Deno-shell continuity** — no new heavy Rust deps (slice03's S-7 holds).

## 4. Verification approach

- **CC** attests: `lykn link @lykn/foo ../foo` (foo built) writes the build-dir
  override to `project.local.json`; `lykn run`/`test` use it; **`lykn dist`
  ignores it** (linked dep absent from staged output — the safety property);
  `unlink` restores the committed pin; require-built error when unbuilt;
  `make check` green.
- **CDC** verifies against `lang`: the effective reader merges local-over-base
  and is consumed by the dev paths **only** (`dist.rs` still reads raw — grep the
  call sites); `project.local.json` is git-ignored (scaffold template); build-dir
  (not source) resolution; the safety test exists. Runtime rows reconcile on host.

## 5. Exit criteria

1. `lykn link`/`unlink` manage a git-ignored `project.local.json` overlay;
   `unlink` losslessly restores the committed pin.
2. `link` resolves to `target/lykn/build/<pkg>/` (require-built; helpful error).
3. Effective config = `project.json` ⊕ `project.local.json` (local wins), fed to
   run/test/compile/macro; **dist/publish read raw `project.json`** (safety test:
   linked dep absent from dist output).
4. Effective-config relative-path resolution correct (tested).
5. Scaffold `.gitignore` includes `project.local.json`; `make check` green;
   no new heavy Rust deps.

## 6. Consumes / feeds

Consumes DD-63 + slice03 (specifier/pair emission, `project.json` writer) + the
`config`/`find_config`/deno-invocation model. Feeds **slice05** (N1: test
resolution honors the linked specifier) and the arc composition demo (A-6:
mycelium builds+tests as a downstream against a *local* lykn).
