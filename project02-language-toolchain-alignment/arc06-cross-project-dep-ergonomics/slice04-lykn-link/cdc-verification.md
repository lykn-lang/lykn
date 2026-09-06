# arc06 · slice04 — CDC Verification (`lykn link`/`unlink` overlay)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's slice04 @ `e1c0dd7`
(clean source-only, 4 files). Code review + grep against `lang`; runtime rows
CC-attested → host reconcile. Verifier ≠ closer.

## Verdict — VERIFIED

The overlay lands with its safety property **architecturally guaranteed** (not
just tested), the non-destructive design holds by construction, the DD-63 §7
path wrinkle is handled + tested, and no new deps. Rows S-1…S-8 met. And CC
cleaned up last slice's commit-hygiene sweep (explicit pathspec — source-only).

## Independent CDC checks (against `lang` @ e1c0dd7)

| Claim | CDC check | Result |
|-------|-----------|--------|
| **SAFETY — dist/publish never see the overlay** | call-site trace: `read_effective_project_config_optional` is read **only** by `compile.rs` (macro map) + `main.rs:769` (the `lykn test` path); **`dist.rs` reads raw `read_project_config` at all 3 sites**; `cmd_publish`/`cmd_dist` never read effective | **reproduced** — architectural, stronger than a test |
| **Non-destructive — `project.json` never written by link/unlink** | `cmd_link` → `config::write_overlay` (project.local.json); `cmd_unlink` → `config::remove_from_overlay`; neither writes `project.json` (link's own msg: "project.json unchanged") | **reproduced** — lossless unlink by construction |
| Effective merge (base ⊕ overlay, local wins), dev-only | `read_effective_project_config_optional` + `dev_config` writing `target/lykn/project.effective.json`; consumed by compile/run/test only | **reproduced** |
| **Relative-path absolutization (DD-63 §7)** | `absolutize_import`: registry (`jsr:`/`npm:`), URL, already-absolute left alone; relative absolutized against root; tested (`absolutize_relative_leaves_registry_and_absolute`) | **reproduced** |
| Build-dir resolution + require-built | link resolves to `<path>/target/lykn/build/<pkg>/` (bare `mod.js`/slash dir), not `packages/`; require-built error | **reproduced** (logic) + **attested** (runtime) |
| No new deps; imports-writer reused | `Cargo.toml` untouched; `add::splice_imports`/`render_imports` made `pub(crate)` — one writer for `project.json`, `project.local.json`, effective file | **reproduced** |
| Clean source-only diff | `git show --stat e1c0dd7`: `add.rs`/`compile.rs`/`config.rs`/`main.rs` only (explicit pathspec) | **reproduced** |
| link/unlink e2e, dist-absent check, require-built | host-only | **attested (CC)** → reconcile |

## CC's slice05 reframe — CDC endorses (and it's grounded)

CC recommends A-6's bar become *"a downstream **test imports its package by
specifier** (not a relative source path); `lykn test` green from mycelium"* —
mostly convention + demo, **not new resolution code** — because the linked
package is already reachable via its import-map key (`<pkg>`/`<pkg>/`) and the
effective config resolves that to the local build.

**CDC concurs, and it's confirmed by the scaffold:** `lykn new`'s
`project_json_template` **already writes the self-package key**
`"{name}/": "./target/lykn/build/{name}/"`. So a *new* project's test can import
`{name}/render.js` and it resolves to the built output — no new machinery. N1 is
therefore: (a) the **import convention** (import by the self-package specifier,
not `../render.js`), (b) a **mycelium update** (its hand-written `project.json`
predates the self-key), (c) a **guide note**, and (d) the **demo**. This shrinks
slice05 from "resolution code" to "convention + corpus fix + demo," and makes the
restated A-6 achievable. I'll scope slice05 that way.

## Close status

slice04 **CDC-verified → closes** on host reconcile (link/unlink e2e +
dist-absent + `make check`). arc06 ledger: **A-4 met** (pending reconcile).
**Doc-commit set for Duncan:** slice04 `closing-report.md` + this
`cdc-verification.md`. The arc06 chain: slice02 → DD-63 → slice03 (`lykn add`) →
slice04 (`lykn link`) → **slice05 (N1)** is the last slice; on it, **A-6** (the
mycelium build+test+publish-dry composition demo) is reproducible and the arc can
close.
