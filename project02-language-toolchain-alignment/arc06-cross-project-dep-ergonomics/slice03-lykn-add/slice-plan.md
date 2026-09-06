# arc06 · slice03 — `lykn add` (registry dependency-add)

> **Open set** (2026-07-22, CDC). **Provisional — pending DD-63 promotion**
> (every DD-63 decision is operator-locked; this details the `lykn add` half).
> The *committed, exact-pinned* registry dependency-add. The local overlay
> (`lykn link`/`unlink`, `project.local.json`, effective-config) and the N1
> test-resolution are **slice04**. Fixes DD-63 problems #2 (unpinned) + #3
> (bare/slash pair) for registry deps.

## 1. Goal

`lykn add jsr:@scope/pkg[@version]` (and `npm:pkg[@version]`) adds a dependency
to the **root `project.json`**, **pinned to an exact version**, with the
**bare + trailing-slash** import pair emitted from the package's exports, the
**macro axis** wired if it's a macro module, and the Deno cache populated — so
the first `lykn build`/`test` doesn't cold-fetch. `lykn add` did **not** exist
(net-new; the DD-51 replacement).

## 2. Scope

### In

- **`Add` subcommand** — a clap `Commands::Add { specifier: String }` variant +
  `cmd_add` dispatch (insertion point: beside `Commands::Dist`/`Publish` in
  `main.rs`).
- **Specifier parse** — `jsr:@scope/pkg`, `npm:pkg`, each with optional
  `@version`. Reject malformed specifiers with a clear error.
- **Exact-pin resolution (see §Design).** If a version is given, pin it. If not,
  resolve the **latest published** version and pin it exact
  (`jsr:@lykn/lang@0.6.0`). This closes DD-63 #2 (the scaffold's unpinned
  `jsr:@lykn/lang/`).
- **Bare + slash pair** (DD-63 #3) — emit **both** keys, e.g.
  `"@lykn/foo": "jsr:@lykn/foo@X"` (bare → entry) and
  `"@lykn/foo/": "jsr:@lykn/foo@X/"` (slash → subpaths). Derive the entry from
  the package's `exports` where available (§Design: exports discovery).
- **Write to root `project.json`** `imports` (an `IndexMap` — preserve key order;
  pretty-print consistent with the existing file). **Idempotent:** re-adding an
  existing dep **updates** its pin, doesn't duplicate.
- **Cache population** — after the write, `deno cache`/`deno info` the new
  specifier so resolution is validated at add-time (surface a bad specifier now,
  not mid-build).
- **Macro axis** (DD-63 §3(e)) — read the added package's `PackageKind`
  (`config::PackageKind::{Runtime, MacroModule, Tooling}`). A `MacroModule`
  (e.g. `@lykn/testing`) must end up usable via `import-macros` (confirm the
  written specifier makes `(import-macros "jsr:@scope/pkg" …)` resolve); a
  `Runtime` gets the value pair. Both if it exposes both.
- **Tests** — specifier parse (valid/invalid, with/without version); pin (given
  version pins it; no version → latest exact); pair emission from `exports`;
  idempotent `project.json` write (re-add updates, order preserved); macro-kind
  detection.

### Out

- **`lykn link`/`unlink` + the overlay + effective-config** — slice04.
- **N1** downstream-test resolution — slice04 (may re-slice).
- **`lykn remove`**, the **Mix `~>` DSL**, `lykn update`, `--package`
  member-scoped adds, **non-exact ranges** in the stored specifier — all 0.7.0 /
  future (DD-63 §6).

## 3. Design points (refine DD-63 — flag for promotion)

- **Resolution mechanism — shell to deno, not a new Rust dep (refines
  DD-63 §3(b)).** `lykn-cli` has no HTTP client and no semver crate, and lykn
  shells to `deno` for all external work. So `lykn add` resolves the latest
  version + reads `exports` by **fetching registry metadata through deno** (a
  `deno eval` GET of JSR `meta.json` / the npm registry JSON), then pins exact.
  No `reqwest`/`ureq`/`nodejs-semver` added in 0.6.0; the pin matches deno's own
  resolution exactly. **`nodejs-semver` enters with the 0.7.0 `~>` range work**
  (BACKLOG A1.1), where a real range engine is actually needed — not here.
- **Exports discovery for registry packages (DD-63 §7).** Prefer the published
  metadata's `exports` (from the same registry fetch) to derive the bare entry;
  **fall back** to the conventional `mod.js` entry + `/` subpath when metadata is
  thin. Record which was used.
- **Acceptance against real registries.** 0.6.0 isn't published yet (crates at
  0.5.2), so test `lykn add` against *real* published packages that exist today
  — `lykn add npm:astring`, `lykn add jsr:@std/assert` — plus a fixture for the
  macro-module path.

## 4. Verification approach

- **CC** lands the subcommand, attests: `lykn add npm:astring` and
  `lykn add jsr:@std/assert` write exact-pinned bare+slash entries to
  `project.json`; re-add updates in place; a macro-module add leaves
  `import-macros` resolving; `deno` resolves the written specifiers; `make check`
  green. Runtime rows CC-attested (network + deno) → host reconcile.
- **CDC** verifies against `lang`: the subcommand + dispatch exist; the pin is
  **exact** (no floating range written); the `project.json` writer preserves
  `IndexMap` order and is idempotent; macro-kind is read via `PackageKind`; no
  new heavy Rust deps snuck in (the deno-shell decision held). CDC cannot run
  the network/deno path — those reconcile on host.

## 5. Exit criteria

1. `lykn add <jsr:|npm: spec>` writes an **exact-pinned** bare+slash pair to root
   `project.json`; idempotent re-add.
2. No-version add resolves + pins the latest exact (via deno-fetch); given-version
   add pins it.
3. Macro-module add leaves `import-macros` resolving; runtime add gets the value
   pair.
4. Cache populated / specifier validated at add-time.
5. No new HTTP/semver Rust deps (deno-shell mechanism); `make check` green; tests
   for parse / pin / pair / idempotent-write / macro-kind.

## 6. Consumes / feeds

Consumes DD-63, the `config`/`PackageKind` model, the deno-shell pattern
(`bridge.rs`/the deno invocations), and the `project.json` `IndexMap` writer.
Feeds **slice04** (`link`/`unlink` reuse the specifier/pair machinery and the
`project.json` writer; the overlay layers on top) and the arc composition demo
(A-5: `lykn add` adds a dep and it resolves).
