# arc06 · slice03 — CDC Verification (`lykn add` registry dependency-add)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's slice03 @ `f9f9014`.
Code review + grep against `lang`; runtime rows (deno-fetch, live registries,
`make check`) CC-attested → host reconcile. Verifier ≠ closer.

## Verdict — VERIFIED

`lykn add` lands clean. The parser edge I was most worried about is handled
correctly and tested; the format-preserving `project.json` write is sound and
idempotent; no heavy Rust deps (deno-shell held); macro axis via `PackageKind`.
Rows S-1…S-8 met. Two process notes below (a commit-hygiene sweep; a deno gotcha)
— neither a defect.

## Independent CDC checks (against `lang` @ f9f9014)

| Claim | CDC check | Result |
|-------|-----------|--------|
| **Specifier parse — scope-`@` vs version-`@`** | `parse_specifier` splits version on `rest.rfind('@')` **with an `at > 0` guard** → `jsr:@std/assert` (scope-`@` at 0) parses as **no-version**; `@lykn/lang@0.6.0` splits on the version `@`. Both tested, + empty-version / jsr-must-be-scoped / unknown-scheme rejections. | **reproduced** — the classic two-`@` trap is handled |
| **Exact pin, never floating** | `import_pair` renders `name@version` / `name@version/`; test asserts `jsr:@lykn/foo@0.6.0` + npm `astring@1.9.0` pairs; no-version resolves via deno-fetch then pins | **reproduced** (format) + **attested** (runtime resolve) |
| **bare + slash pair** | `import_pair` → `[(name, spec), (name/, spec/)]`, exact-pinned; tested jsr + npm | **reproduced** |
| **Idempotent, format-preserving write** | `upsert_imports`: authoritative `IndexMap` from `read_project_config` (update-in-place) + `splice_imports` rewrites only the imports object body (balanced-brace `object_end`), preserving `workspace`/`lint`/`tasks` + indentation; append + idempotent-update tests | **reproduced** |
| **Macro axis via `PackageKind`** | `detect_kind` reads the package's `lykn.kind`; MacroModule → the bare key is the macro specifier | **reproduced** (logic) + **attested** (`@lykn/testing`) |
| **No heavy Rust deps (S-7)** | `git show --stat f9f9014`: **`Cargo.toml` untouched**; resolution via `deno eval`/`deno info` | **reproduced** — deno-shell held |
| **Scoped source diff** | source = `add.rs` (new) + `lib.rs` (mod decl) + `main.rs` (`Add` + `cmd_add` + dispatch); no unrelated source | **reproduced** |
| Live-registry adds, add-time validation, `make check` | host-only | **attested (CC)** → reconcile |

## Notes (process, not defects)

1. **Commit hygiene — planning docs swept into the source commit.** `f9f9014`
   is 6 files: the 3 source files **plus** the 3 original slice03 planning docs
   (my delivered `cc-prompt`/`ledger`/`slice-doc`) that were already staged. So
   CC's evidence-filled `ledger.md` is now uncommitted (`M`), and the *original*
   (empty-status) ledger sits in the commit. Harmless (the filled version
   supersedes), and CC flagged it. **Doc-commit set for Duncan:** the filled
   `ledger.md` + `closing-report.md` + **this `cdc-verification.md`** land
   together on the next docs commit. The CC-commits-source-only boundary blurred
   here; worth keeping `git add -p`/explicit paths next time.

2. **Deno gotcha (logged).** `deno eval` runs with **all permissions
   implicitly** and **rejects** `-A`/`--allow-net` — so the resolution fetch
   takes **no** permission flag. A real deno-shell fact; slice04 and any future
   deno-shell work inherit it.

## Feeds forward

- **A-5** (arc ledger: "`lykn add` adds a dependency and it resolves") — met
  pending host reconcile.
- **slice04 alignment confirmed by CC's bubble-up:** `upsert_imports` /
  `import_pair` / `parse_specifier` are exactly the reuse surface my slice04
  slice-doc names; and **exports-discovery + the `mod.js` fallback belong in
  `link` (slice04)** — for registry adds deno resolves the entry so the fallback
  never fires; it matters only when `link` points at a concrete built file.
  slice04's design holds.
- **DD-63 deno-shell refinement confirmed empirically** — deno's own resolution
  gave exact versions with zero Rust deps; `nodejs-semver` is genuinely deferred
  to the 0.7.0 `~>` work (BACKLOG A1.1).

## Close status

slice03 **CDC-verified → closes** on host reconcile of the deno/registry rows +
`make check`. Feeds A-5. CC's next arc06 pickup is **slice04** (`lykn link`,
already detailed) — its reuse surface is now confirmed to exist.
