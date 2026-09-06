# arc06 · slice06 — Version consolidation + 0.6.0-dev bump (arc-closeout)

> **Open set** (2026-07-24, operator). A **tiny impromptu closeout slice**. Two
> housekeeping changes surfaced while writing the arc06 host-reconcile runsheet:
> (1) the three Rust crates each maintained their own identical `version`, and
> (2) the whole tree still read `0.5.2` — so `lykn --version` misrepresented the
> current build as the last release. Consolidate the version to one
> workspace-inherited declaration and bump both language surfaces (Rust + JS) to
> `0.6.0-dev`. Not a capability slice — it removes a footgun and makes the
> version string honest for the arc06 reconcile.

## 1. Goal

- **One version, declared once.** The three crates (`lykn-lang`, `lykn-cli`,
  `lykn`) are never released independently — they always share the language
  release version. Declare it in the workspace root; crates inherit it.
- **Honest current version.** Bump Rust + JS to `0.6.0-dev` so `lykn --version`
  (and the published-package metadata at dist time) reflects the current
  `release/0.6.x` build, not the last release `0.5.2`. The final `0.6.0` bump is
  a release task (arc09); `-dev` marks pre-release.

## 2. Scope

### In

- **Rust workspace inheritance.** Root `Cargo.toml` gains `[workspace.package]
  version = "0.6.0-dev"` + `[workspace.dependencies]` for the two inter-crate
  path deps; each crate uses `version.workspace = true` and
  `<dep>.workspace = true`. A release bump now edits the **root file only**.
- **JS bump.** `packages/{lang,testing,browser}/deno.json` `version` →
  `0.6.0-dev`.
- **The host-reconcile runsheet** (`../host-reconcile-runsheet.md`) — the
  operator artifact for reconciling arc06's CC-attested runtime rows; authored
  here as part of closeout, with the version note corrected to `0.6.0-dev`.

### Out (deliberately untouched — scope discipline)

- **Registry-pin references to *published* packages.** `test/forms/dd-53.test.js`
  pins `jsr:@lykn/testing@0.5.2` — a **published-JSR** pin exercising the fetch
  path; 0.6.0-dev isn't published, so it stays. mycelium's `@lykn/lang@0.5.2` /
  `@lykn/testing@0.5.2` pins are the same (separate repo).
- **The scaffold template default** `"version": "0.1.0"` in `lykn new` output —
  that's a generated *project's* starting version, not lykn's.
- **The `0.6.0` release bump** and JSR/crates.io publish — arc09.

## 3. Verification approach

- **CC** lands the manifest + deno.json edits, rebuilds, confirms
  `lykn --version` = `0.6.0-dev` and all three crates report it, and attests
  `make check` green (no snapshot breakage — no committed snapshot hard-codes the
  version).
- **CDC** verifies: the workspace-inheritance shape (one `version`, crates
  inherit), no stray `0.5.2` left in *source/config* (registry pins excepted),
  and `make check` green on host reconcile.

## 4. Exit criteria

1. Version declared once at the workspace root; three crates inherit it.
2. Rust + JS both at `0.6.0-dev`; `lykn --version` → `lykn 0.6.0-dev`.
3. Published-registry pins + scaffold template untouched (scope discipline).
4. `make check` green; scoped diff.
5. Host-reconcile runsheet in place with the corrected version note.

## 5. Consumes / feeds

Consumes nothing. Feeds the **arc06 close**: makes the reconcile runsheet's
version story honest (`0.6.0-dev` toolchain vs published-`0.5.2` library pins)
and removes the three-places-to-bump footgun before the 0.6.0 release (arc09).
