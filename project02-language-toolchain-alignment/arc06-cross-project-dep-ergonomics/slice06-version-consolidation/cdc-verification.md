# arc06 · slice06 — CDC Verification (version consolidation + `0.6.0-dev`)

**By:** CDC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Verifying:** `caeb2e4` (source) + `1139c42` (docs)
**Verdict: CLOSE.** Six rows in, six verified. One item routed to arc09.

## Method

Read the manifests and configs at HEAD and ran an independent sweep for stray
`0.5.2` rather than checking only the sites the ledger named — the point of an
independent pass being to look where the doer didn't. No toolchain here, so
`make check` and `lykn --version` stay **CC-attested**.

## Per-row verification

| Row | CDC finding |
|-----|-------------|
| **V-1** — version declared once at the root | **Verified.** `Cargo.toml:10-15` carries `[workspace.package] version = "0.6.0-dev"` and `[workspace.dependencies]` for both inter-crate path deps. All three crates (`lykn-lang`, `lykn-cli`, `lykn`) use `version.workspace = true` at line 3. A release bump is now a one-file edit, as claimed. |
| **V-2** — Rust at `0.6.0-dev` | **Verified by inheritance** — the three manifests inherit the root's `0.6.0-dev`, so `cargo metadata` follows by construction. `./bin/lykn --version` output is **CC-attested** (runtime). |
| **V-3** — JS at `0.6.0-dev` | **Verified.** `packages/{lang,testing,browser}/deno.json:3` all read `0.6.0-dev`. |
| **V-4** — registry pins + scaffold template untouched | **Verified.** `test/forms/dd-53.test.js` still pins `jsr:@lykn/testing@0.5.2` (the production JSR fetch path — pinning a *published* artifact, correctly not bumped); `main.rs:1185` scaffold template still emits `"0.1.0"`. No over-reach. |
| **V-5** — `make check` green; no snapshot breakage | **Snapshot half independently verified**: `grep 0.5.2 crates/lykn-cli/src/snapshots/` returns nothing. `make check` is **CC-attested**. |
| **V-6** — host-reconcile runsheet in place | **Verified.** `host-reconcile-runsheet.md` carries §0 prereqs, Part C (the A-6 bar, C1/C2/C3 with expected output), C-bis, Parts A/B, sign-off, and the "On versions — two surfaces, don't conflate them" note. |

## What the independent sweep added

Grepping beyond the ledger's named sites surfaced two things, neither a defect
in this slice:

**1. Two more legitimate `@0.5.2` literals.** `pass0.rs` and `config.rs` carry
`jsr:@lykn/testing@0.5.2` in slice07's tests — test *data* (a literal specifier
being resolved), not version declarations. V-4's excepted-sites list predates
slice07 and so doesn't mention them. Worth a line in the runsheet so a future
release bump doesn't `sed` them blindly, but nothing to fix now.

**2. `dist/` is stale at `0.5.2` — and that matters at release time.**
`dist/{lang,testing,browser}/{deno.json,package.json,mod.js}` still carry
`"version": "0.5.2"`. `dist/` is gitignored, so this is a local build artifact
and **out of scope for this slice** — but `lykn publish --no-build` explicitly
exists to publish an already-staged `dist/`, which means a publish run that
skips the build would ship 0.5.2 metadata from a 0.6.0 tree.

**Routing: arc09, as a release-prep precondition** — `lykn dist` must be re-run
(or `--no-build` avoided) before any publish. Not a slice06 finding; slice06 is
what *revealed* it, by making the source/artifact version skew visible for the
first time.

## Bubble-up verification

**Delivered its assigned piece?** Yes. slice06 had no assigned piece in the
arc-plan at open — like slice07, it originated in the operator's host-reconcile
runsheet pass, and both were added to the breakdown retroactively in
`arc-plan.md` v1.3. Measured against its own slice-doc, it delivers: one version
declaration, honest `--version`, no over-reach into published pins.

**Silent-drop diff:** clean. Scope-as-delivered matches scope-as-specified; the
deliberate exclusions (registry pins, scaffold template, the final 0.6.0 bump →
arc09) are all named in the commit message and V-4.

**Arc-plan change required?** Already made — v1.3 added the slice and ledger row
**A-8**. **A-8 is now met.**
