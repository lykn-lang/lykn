# arc06 · slice06 — Ledger (version consolidation + 0.6.0-dev)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands +
attests `make check`; CDC verifies the workspace-inheritance shape + no stray
`0.5.2` in source/config (registry pins excepted). Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| V-1 | **Version declared once at the workspace root** — `[workspace.package] version` + `[workspace.dependencies]` for the inter-crate path deps; the three crates use `version.workspace = true` + `<dep>.workspace = true`. | read root `Cargo.toml` + 3 crate manifests | serious | operator | **done** | root `Cargo.toml` `[workspace.package] version = "0.6.0-dev"` + `[workspace.dependencies]` (lykn-lang, lykn-cli); `lykn-lang`/`lykn-cli`/`lykn` all `version.workspace = true`; inter-crate deps `<dep>.workspace = true` | one file to bump |
| V-2 | **Rust at `0.6.0-dev`; `lykn --version` honest** — all three crates report it. | `cargo metadata`; `lykn --version` | serious | operator | **done** | `cargo metadata`: lykn / lykn-cli / lykn-lang all `0.6.0-dev`; `./bin/lykn --version` → `lykn 0.6.0-dev` (was `0.5.2`) | clap pulls `CARGO_PKG_VERSION` |
| V-3 | **JS at `0.6.0-dev`** — the three published-package configs. | grep `deno.json` versions | serious | operator | **done** | `packages/{lang,testing,browser}/deno.json` `version` → `0.6.0-dev` (root `project.json` has no version field) | dist stamps `VERSION` from this |
| V-4 | **Registry pins + scaffold template untouched** — `test/forms/dd-53.test.js` `@0.5.2` (published fetch-path pin), `lykn new`'s `"0.1.0"` template default. | grep the excepted sites unchanged | correctness | scope discipline | **done** | those `0.5.2`/`0.1.0` references deliberately left; they're published-registry / generated-project versions, not lykn's | no over-reach |
| V-5 | **`make check` green; no snapshot breakage** — no committed insta snapshot hard-codes the version. | host `make check`; grep snapshots for `0.5.2` | serious | recon discipline | **done** (CC-attested) | `make check` ✓ (build+lint+test, 476 doc blocks 0 failed); `grep 0.5.2 crates/lykn-cli/src/snapshots/` = none; publishing tests assert name/kind, not version | |
| V-6 | **Host-reconcile runsheet in place** — the arc06 operator artifact; version note corrected to `0.6.0-dev` vs published-`0.5.2` library pins. | read `../host-reconcile-runsheet.md` | correctness | arc close | **done** | `arc06/host-reconcile-runsheet.md`: §0 prereqs, Part C (A-6 bar), C-bis (link current libs), Parts A/B, sign-off; "On versions" note | feeds the gate |

## Closure

Closed at `<CDC-fills>` (CC-attested; `make check` reconciles on host). Rows: 6.
Done: 6. _(On close: CDC confirms the single workspace version + crate
inheritance, no stray `0.5.2` in source/config beyond the excepted registry
pins, and `make check` green. This is arc06's last unit before the gate.)_
