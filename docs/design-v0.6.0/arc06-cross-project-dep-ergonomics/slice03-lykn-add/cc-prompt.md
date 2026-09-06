# CC Prompt — arc06 · slice03 · `lykn add` (registry dependency-add)

> **You are CC** (Claude Code, IC seat) on `~/lab/lykn/lang`, branch
> `release/0.6.x`. This slice adds the **`lykn add`** subcommand — the committed,
> exact-pinned registry dependency-add (DD-51's replacement). Read
> `design/dd-63-lykn-add-DRAFT.md`, `slice-doc.md`, `ledger.md` (8 rows) first.
> The local overlay (`lykn link`/`unlink`) and N1 are **slice04 — not this
> slice**. Surface and self-stop.

## Why this slice exists

DD-51 banned `deno add` in lykn projects, leaving no ergonomic way to add a
dependency — you hand-edit `project.json`. `lykn add` fills that. The audit
(arc06/slice02) also found the `lykn new` scaffold writes **unpinned** specifiers
(`jsr:@lykn/lang/` — no `@version`), a reproducibility hazard. `lykn add` fixes
that by **pinning exact**, and emits the **bare + trailing-slash** import pair a
human otherwise has to know to hand-write.

## What to do (MUST)

### 1 — The `Add` subcommand
- Add `Commands::Add { specifier: String }` (clap) beside `Dist`/`Publish` in
  `main.rs`, dispatched to `cmd_add`.
- Parse `<specifier>`: `jsr:@scope/pkg[@version]` or `npm:pkg[@version]`. Reject
  malformed with a clear message.

### 2 — Resolve + pin EXACT (shell to deno — no new Rust deps)
- **Do not add `reqwest`/`ureq`/`nodejs-semver`.** `lykn-cli` shells to `deno`
  for external work; resolve the same way. If the specifier has **no version**,
  fetch the registry metadata **through deno** (a `deno eval` GET of JSR
  `https://jsr.io/@scope/pkg/meta.json` → `latest`, or the npm registry JSON →
  `dist-tags.latest`) and **pin that exact version**. If a version is given, pin
  it. Never write a floating range (`^`/`~`) in 0.6.0.
- *(Why: the pin then matches deno's own resolution exactly, and `nodejs-semver`
  is deferred to the 0.7.0 `~>` range work where it's actually needed.)*

### 3 — Bare + trailing-slash pair
- Write **both** import keys: bare → the package entry, slash (`…/`) → the
  package directory. Derive the entry from the package's **`exports`** (from the
  same registry-metadata fetch); **fall back** to `mod.js` + `/` if metadata is
  thin. Record which path was used.

### 4 — Write root `project.json` (idempotent)
- Edit the **root** `project.json` `imports`. Preserve `IndexMap` key order and
  match the file's existing pretty-print. **Re-adding an existing dep updates its
  pin in place** — no duplicate keys, minimal diff.

### 5 — Macro axis
- Read the added package's `PackageKind` (`config`). `MacroModule` (e.g.
  `@lykn/testing`) → ensure the written specifier makes
  `(import-macros "jsr:@scope/pkg" …)` resolve; `Runtime` → the value pair. Both
  if it exposes both.

### 6 — Cache + validate
- After writing, `deno cache`/`deno info` the new specifier so a bad add fails
  **now** (add-time), not mid-build.

### 7 — Tests + verify
- Unit tests: parse (valid/invalid, ±version); pin (given pins; none → latest
  exact); pair emission from `exports`; **idempotent** write (add, re-add → one
  updated entry, order preserved); macro-kind detection.
- Acceptance against **real** registries (0.6.0 isn't published — crates are
  0.5.2): `lykn add npm:astring`, `lykn add jsr:@std/assert` → exact-pinned pair
  in `project.json`, deno resolves them. `make check` green.

## MUST NOT

- **No `lykn link`/`unlink`, no `project.local.json`, no effective-config
  overlay** — that's **slice04**. This slice writes the *committed* `project.json`
  only.
- **No new heavy Rust deps** (`reqwest`/`ureq`/`nodejs-semver`) — deno-shell (S-7).
- **No floating ranges** written — exact pins only (S-2).
- **No `lykn remove`, no `~>` DSL, no `lykn update`, no `--package`** — future.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` with:

1. A **per-row ledger walk** S-1…S-8 (status + evidence — paste the written
   `project.json` before/after for a registry add, and the `Cargo.toml` diff
   showing no new heavy deps).
2. The **resolution mechanism** as landed (the deno-fetch command + how `latest`
   and `exports` were read), and the exports-fallback cases hit.
3. **Bubble-up to the arc** (three questions): did `lykn add` deliver
   exact-pinned registry adds; what the resolution/exports work revealed that
   reshapes slice04 (the overlay reuses this machinery) or refines DD-63 (esp. the
   deno-shell-vs-nodejs-semver call); anything the registry-metadata shapes forced
   (JSR vs npm differences).

Then **stop** — CDC verifies the subcommand/pin/pair/idempotent-write/macro-kind
+ no-new-deps against `lang`; network/deno rows reconcile on host. If you hit your
context ceiling, self-stop clean with a handoff addendum.

## Host note (from slice01)

On Apple Silicon, re-copy the binary with `rm -f bin/lykn && cp …` — a bare `cp`
over the running binary invalidates its signature (`Killed: 9`).
