# arc06 · slice06 — Closing Report (version consolidation + 0.6.0-dev)

**By:** CC (Claude Code) · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Verdict: delivered.** The three Rust crates now inherit **one**
workspace-declared version, and both language surfaces (Rust + JS) read
**`0.6.0-dev`** — so `lykn --version` reports the current build, not the last
release. `make check` green; no snapshot breakage. This is arc06's last unit
before the operator gate.

## Per-row ledger walk (6 in, 6 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **V-1** — version declared once, crates inherit | **done** | root `Cargo.toml`: `[workspace.package] version = "0.6.0-dev"` + `[workspace.dependencies]` (lykn-lang, lykn-cli path+version). `lykn-lang`/`lykn-cli`/`lykn` → `version.workspace = true`; inter-crate deps → `lykn-lang.workspace = true` / `lykn-cli.workspace = true`. A release bump edits the root file only. |
| **V-2** — Rust `0.6.0-dev`; honest `--version` | **done** | `cargo metadata --no-deps`: all three crates `0.6.0-dev`; `./bin/lykn --version` → **`lykn 0.6.0-dev`** (was `0.5.2`). clap's `version` pulls `CARGO_PKG_VERSION`. |
| **V-3** — JS `0.6.0-dev` | **done** | `packages/{lang,testing,browser}/deno.json` `version` → `0.6.0-dev`. Root `project.json` has no version field. (`dist.rs` stamps `export const VERSION` + the generated deno/package.json from this at publish time.) |
| **V-4** — pins + template untouched | **done** | left as-is: `test/forms/dd-53.test.js` `jsr:@lykn/testing@0.5.2` (published fetch-path pin), `main.rs` scaffold template `"version": "0.1.0"` (a generated project's default). Neither is lykn's own version. |
| **V-5** — `make check` green; no snapshot break | **done** (CC-attested) | `make check` ✓ (build + lint + test; 476 doc blocks, 0 failed). `grep 0.5.2 crates/lykn-cli/src/snapshots/` → none. `publishing_dry_run.rs` uses synthetic fixtures; `publishing_real_packages.rs` asserts `.name`/`.kind`, not `.version`. |
| **V-6** — host-reconcile runsheet | **done** | `arc06/host-reconcile-runsheet.md`: §0 prereqs → Part C (A-6 bar: build + test 43/0 + publish-dry) → C-bis (optional: link current-source lang/testing) → Parts A/B (add, link/unlink+safety) → sign-off. "On versions" note distinguishes the `0.6.0-dev` toolchain from mycelium's published-`0.5.2` library pins. |

## What changed (diff shape)

- **`Cargo.toml`** (root): `+[workspace.package]` (version) `+[workspace.dependencies]` (2 path deps).
- **`crates/lykn-lang/Cargo.toml`**, **`crates/lykn-cli/Cargo.toml`**, **`crates/lykn/Cargo.toml`**: `version = "0.5.2"` → `version.workspace = true`; the two inter-crate deps → `.workspace = true`.
- **`Cargo.lock`**: regenerated (workspace member versions).
- **`packages/{lang,testing,browser}/deno.json`**: `0.5.2` → `0.6.0-dev`.
- **`host-reconcile-runsheet.md`**: version note + `--version` expectations.

No source logic changed — manifests + config + one doc.

## Why this earned a slice (not a drive-by)

The bump touches the **publishing pipeline**: `dist.rs` reads the package
version into the generated `deno.json`/`package.json` and the `VERSION` stub, so
a version change is exactly the class of edit that shifts publishing output. I
checked the insta snapshot surface first (`grep 0.5.2 snapshots/` → none; the
real-packages test asserts name/kind, not version) and confirmed `make check`
green — so the bump is snapshot-safe, but that had to be *verified*, not assumed.

## Bubble-up to the arc

- **arc06 closeout is unblocked.** The reconcile runsheet is honest (the
  operator will now see `lykn 0.6.0-dev`, resolving the "why 0.5.2?" question),
  and the version-bump footgun (three manifests + three deno.json to keep in
  sync) is gone — future bumps edit the root `Cargo.toml` version + the three
  `deno.json` (JS has no workspace-inherit equivalent; noted below).
- **Routed forward (arc09 release):** the actual `0.6.0` bump (drop `-dev`), and
  the JSR/crates.io/npm publish. A follow-on could also DRY the JS side (a single
  source of version for the three `deno.json`) — small, non-blocking.
- **No behaviour change**, no new deps, `make check` green — a clean closeout
  increment.

## Discipline notes

- **Host note:** `rm -f bin/lykn && cp target/release/lykn bin/lykn` (Apple
  Silicon signature) before `--version` / reconcile.
- Registry pins to *published* packages were deliberately **not** rewritten —
  bumping them would point at unpublished `0.6.0-dev` and break the fetch-path
  test. Scope held.
- Closing report + ledger + slice-doc authored at operator direction (no CDC
  cc-prompt for this impromptu slice); CDC adds `cdc-verification.md` on review.
