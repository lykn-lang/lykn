# arc06 · slice03 — Closing Report (`lykn add` registry dependency-add)

**By:** CC (Claude Code) · **Date:** 2026-07-23 · **Branch:** `release/0.6.x`
**Verdict: delivered.** `lykn add jsr:@scope/pkg[@version]` / `npm:pkg[@version]`
adds an **exact-pinned** bare+slash import pair to the root `project.json`,
idempotently, resolving through **deno** (no new Rust deps), validating at
add-time, and reading the package kind for the macro axis. Verified against real
registries (`npm:astring`, `jsr:@std/assert`, `jsr:@lykn/testing`). `make check`
green.

## Per-row ledger walk (8 in, 8 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **S-1** — `Add` subcommand + parse | **done** | `Commands::Add { specifier }` (main.rs) → `cmd_add`; `add::parse_specifier` handles `jsr:`/`npm:` ± `@version` (scope-`@` vs version-`@` by position). Malformed rejected: `lykn add astring` → *"missing registry scheme"* rc=2. 3 parse tests. |
| **S-2** — exact pin | **done** | given version pins it; no-version → `resolve_latest_version` (deno-fetch) pins latest exact. `lykn add npm:astring` → `npm:astring@1.9.0` (upgraded the scaffold's floating `^1.9.0`). No `^`/`~` written (asserted in `import_pair_is_exact_and_paired`). |
| **S-3** — bare + slash pair | **done** | `import_pair` emits `"@std/assert": "jsr:@std/assert@1.0.19"` + `"@std/assert/": "jsr:@std/assert@1.0.19/"`. Registry value = the specifier (deno resolves the entry from `exports`); see §Resolution. |
| **S-4** — idempotent `project.json` write | **done** | `upsert_imports`: read ordered `IndexMap`, `insert` (update-in-place / append), splice only the `imports` object back into the raw text — `workspace`/`lint`/`tasks` byte-identical, 4-space indent preserved. Re-add `jsr:@std/assert@1.0.0` → one updated entry, no dup. 2 write tests (`upsert_appends…`, `upsert_is_idempotent…`). |
| **S-5** — macro axis | **done** | `detect_kind` reads the added package's `PackageKind` (JSR: fetch published `deno.json` `lykn.kind`; npm → Runtime). `lykn add jsr:@lykn/testing@0.5.2` → *"(macro module — usable via import-macros)"* — the bare key **is** the macro specifier, so `import-macros` resolves via the same pair. `kind_from_str` test. |
| **S-6** — cache/validate at add-time | **done** | after write, `cache_specifier` (`deno info <specifier>`) resolves+caches; a bad add fails **now**: `lykn add jsr:@std/does-not-exist-xyz` → *"registry returned 404"* rc=1, no write (resolve fails first). |
| **S-7** — deno-shell mechanism held | **done** | `git diff crates/lykn-cli/Cargo.toml` = **empty** — no `reqwest`/`ureq`/`nodejs-semver`. All external work via `deno eval` / `deno info`. |
| **S-8** — `make check` green; scoped diff | **done** (CC-attested) | `make check` ✓. Diff: `main.rs` (Add + `cmd_add`) + new `add.rs` (module + 7 tests) + `lib.rs` (`pub mod add`). `config`/`PackageKind` consumed, not changed. |

### `project.json` before / after (real registry add)

```jsonc
// before (lykn new scaffold — note the FLOATING astring)
"imports": { "addtest/": "…", "lang/": "jsr:@lykn/lang/", "testing": "jsr:@lykn/testing",
             "testing/": "jsr:@lykn/testing/", "astring": "npm:astring@^1.9.0" }

// after: lykn add npm:astring ; lykn add jsr:@std/assert@1.0.0
"imports": { "addtest/": "…", "lang/": "jsr:@lykn/lang/", "testing": "jsr:@lykn/testing",
             "testing/": "jsr:@lykn/testing/",
             "astring":  "npm:astring@1.9.0",          // floating → exact, in place
             "astring/": "npm:astring@1.9.0/",
             "@std/assert":  "jsr:@std/assert@1.0.0",
             "@std/assert/": "jsr:@std/assert@1.0.0/" }
```

## Resolution mechanism (as landed)

- **Latest resolution — `deno eval`.** `deno eval --ext=js <script>` where the
  script `fetch`es the registry metadata and prints `latest`:
  - **JSR:** `GET https://jsr.io/@scope/pkg/meta.json` → `j.latest`.
  - **npm:** `GET https://registry.npmjs.org/pkg` → `j['dist-tags'].latest`.
  - **`deno eval` runs with all permissions implicitly** — it *rejects* `-A` /
    `--allow-net` (a real gotcha this slice hit: `fetch` works with no flag).
- **Exports discovery — not needed for the registry pair value.** For a registry
  add the bare value is the specifier itself (`jsr:@scope/pkg@X`); **deno resolves
  the entry from the package's `exports` at import time**, so `lykn add` does not
  append an entry file and the `mod.js` fallback was **never hit**. Exports
  discovery is a **`link` (slice04)** concern — a local override points at a
  concrete built file (`…/target/lykn/build/<pkg>/mod.js`), which is where
  reading `exports` (and the `mod.js` fallback) actually matters.
- **Kind — `deno eval` fetch of the published `deno.json`.** JSR serves
  `https://jsr.io/@scope/pkg/<version>/deno.json`; `detect_kind` reads
  `lykn.kind` (`macro-module`/`tooling`/else `runtime`). npm has no lykn kind →
  Runtime.

## Bubble-up to the arc (three questions)

**1. Did `lykn add` deliver exact-pinned registry adds?** Yes — idempotent,
order-preserving, exact-pinned, add-time-validated, across JSR and npm, verified
against live registries. It also *upgrades* an existing floating specifier to an
exact pin on re-add (closes the scaffold's `^1.9.0` hazard).

**2. What the resolution/exports work revealed for slice04 / DD-63:**
- **`link`/`unlink` (slice04) reuses this machinery directly:** `parse_specifier`
  (the specifier), `import_pair` (the key shape), and especially
  `upsert_imports` (the idempotent, order-preserving splice writer) are the exact
  pieces the overlay needs — the overlay just writes the *other* file
  (`project.local.json`) with local-path values instead of registry specifiers.
  Recommend slice04 build `project.local.json` writing on `upsert_imports`
  (generalize it to take a target path), and reuse `import_pair`'s key derivation
  with local values (`…/target/lykn/build/<pkg>/mod.js` + dir).
- **Exports discovery is a slice04 need, not slice03's** (see §Resolution): the
  `mod.js` fallback never fired for registry adds. When slice04 writes local
  file-path values, it must read the local package's `deno.json` `exports` to pick
  the entry (and fall back to `mod.js`) — that's where DD-63 §3(c)/§7's exports
  work lands.
- **DD-63 refine — the deno-shell call held; `nodejs-semver` genuinely deferrable.**
  Deno's own resolution returned the exact `latest` we needed with zero Rust
  deps; a range engine buys nothing for exact pinning. Confirms the slice-doc §3
  refinement: `nodejs-semver` enters only with the 0.7.0 `~>` range DSL, not now.

**3. What the registry-metadata shapes forced (JSR vs npm):**
- **Different `latest` locations:** JSR `meta.json.latest` vs npm
  `dist-tags.latest` — one `latest_query` per registry.
- **Scoping rules differ:** JSR requires `@scope/pkg` (rejected otherwise); npm
  allows both scoped (`@babel/core`) and unscoped (`astring`) — parse handles the
  scope-`@`-vs-version-`@` disambiguation by position.
- **Kind metadata is JSR-only** (npm packages carry no `lykn` block) — `detect_kind`
  short-circuits npm to Runtime.

## Discipline notes

- **Source:** new `crates/lykn-cli/src/add.rs` (parse/resolve/pair/write/cache/
  kind + 7 unit tests), `main.rs` (`Add` + `cmd_add`), `lib.rs` (`pub mod add`).
  No new deps (S-7); `config`/`PackageKind` consumed, not changed. No `lykn link`/
  `project.local.json`/overlay (slice04); no `remove`/`~>`/`update`/`--package`.
- **Host note:** `rm -f bin/lykn && cp …` (Apple Silicon signature). Network/deno
  rows (resolve, `deno info`, real-registry acceptance) CC-attested → host
  reconcile.
- Closing report + ledger untracked at hand-off; source lands as a green
  increment.
