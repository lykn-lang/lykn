# arc06 · slice04 — Ledger (`lykn link`/`unlink` overlay)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands + attests
(deno/fs rows host-run); CDC verifies structure against `lang`. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | **`Link`/`Unlink` subcommands** — clap variants + dispatch; `link <pkg> <path>` / `unlink <pkg>`. | read `main.rs` enum + dispatch | serious | DD-63 §2 | **done** | `Commands::Link{package,path}`/`Unlink{package}`→`cmd_link`/`cmd_unlink` (main.rs) | net-new |
| S-2 | **git-ignored `project.local.json` overlay** — `link` writes/updates only the overridden `imports` keys; `unlink` removes; scaffold `.gitignore` includes it. | tests + `gitignore_template` | serious | DD-63 §3(a) | **done** | `config::write_overlay`/`remove_from_overlay` (imports-only, order-preserved); `GITIGNORE_TEMPLATE` += `project.local.json`. `overlay_write_read_roundtrip…` test | |
| S-3 | **Build-dir resolution** — override → `<path>/target/lykn/build/<pkg>/` (bare `mod.js` + slash dir), **not** `packages/`; **require-built** (helpful error if absent). | test built + unbuilt | serious | DD-63 §3(d) | **done** | `cmd_link` → `<path>/target/lykn/build/<pkg>/` (bare mod.js, slash dir); unbuilt → "run 'lykn build' in <path> first" rc=1 (host) | reuse slice03 shape |
| S-4 | **Effective merge (local wins)** — `read_effective_project_config` = base ⊕ overlay; fed to run/test/compile/macro; deno `--config` uses `target/lykn/project.effective.json` when overlay present, else raw `project.json`. | read the reader + `find_config`/compile call sites | serious | DD-63 §3(a) | **done** | `read_effective_project_config_optional` (local wins) → compile.rs ×3 + cmd_test + `dev_config`; `write_effective_deno_config` emits the effective file. `effective_merge_local_wins_over_base` test; host: localdep in effective | |
| S-5 | **SAFETY: dist/publish ignore the overlay** — `dist.rs`/publish read raw `project.json`; a **linked dep is absent from `lykn dist` output**. | grep dist call sites (raw reader); the dist-ignores-overlay test | **serious** | DD-63 §3(a) | **done** (CC-attested) | grep: `dist.rs` reads raw (`read_project_config[_optional]` @185/573/611), never effective. Host: `lykn dist` after link → **0** localdep in staged `project.json` | the property Option-2 buys |
| S-6 | **`unlink` losslessly restores** the committed registry pin (never touched). | test: link → unlink → project.json unchanged, project.local.json entry gone | correctness | DD-63 §2 | **done** | `remove_from_overlay` (delete-when-empty); host: link→unlink→overlay gone, project.json 0 localdep. `overlay_remove…` test | |
| S-7 | **Effective-config relative-path resolution** — `../lang/…` overrides resolve correctly from `target/lykn/project.effective.json`. | explicit path test | serious | DD-63 §7 | **done** | `absolutize_import` resolves relative overrides against root before writing the effective file; host: `../localdep/…`→`/private/tmp/relproj/../localdep/…`. `absolutize_relative…` test | easy to get subtly wrong |
| S-8 | **`make check` green; scoped diff; no new heavy deps** — main.rs + config/effective reader + gitignore + tests. | host `make check`; `git show --stat`; `Cargo.toml` | serious | recon discipline | **done** (CC-attested) | `make check` ✓; diff = main.rs + config.rs + compile.rs(3 dev sites) + add.rs(pub(crate)); `dist.rs` untouched; `Cargo.toml` untouched | deno-shell holds |

## Closure

Closed at `<CDC-fills>` (CC-attested; deno/fs + `make check` reconcile on host).
Rows: 8. Done: 8. _(On close: CDC verifies the effective reader is dev-only
[`dist.rs` grep = raw], build-dir resolution, the dist-ignores-overlay safety
test, lossless unlink, and the absolutization; runtime rows reconcile on a host
re-run. Handoff to slice05: the linked package is reachable via its **import-map
key** (`<pkg>`/`<pkg>/`) which the effective config resolves — N1's A-6 bar is
"a downstream test imports its package by specifier, `lykn test` green", not new
resolution code.)_
