# arc06 · slice03 — Ledger (`lykn add` registry dependency-add)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands + attests
(network/deno rows are host-run); CDC verifies structure against `lang`. Closer ≠
verifier. **Provisional — pending DD-63 promotion.**

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | **`Add` subcommand exists** — clap `Commands::Add { specifier }` + `cmd_add` dispatch; specifier parse handles `jsr:`/`npm:` ± `@version`, rejects malformed. | read `main.rs` enum + dispatch; parse unit tests | serious | DD-63 §2 | **done** | `main.rs` `Commands::Add`→`cmd_add`; `add::parse_specifier` (scope-`@` vs version-`@`); malformed `lykn add astring`→rc=2. Tests `parse_jsr…`/`parse_npm…`/`parse_rejects_malformed` | net-new command |
| S-2 | **Exact pin** — a written specifier is a concrete version (`@X`), never a floating range; no-version add resolves latest exact; given-version pins it. | read the writer + resolve path; assert no `^`/`~`/`/`-only written | serious | DD-63 #2 | **done** | `resolve_latest_version` (deno-fetch) / given version; `lykn add npm:astring`→`@1.9.0` (upgraded floating `^1.9.0`). `import_pair_is_exact_and_paired` asserts no `^`/`~` | closes unpinned scaffold |
| S-3 | **Bare + slash pair** — both keys written, entry from `exports` (fallback `mod.js`+`/`). | read pair emission; test both keys present | serious | DD-63 #3 | **done** | `import_pair` → `name`+`name/`, values the specifier + `/`. Registry value = specifier (deno resolves entry via exports) → mod.js fallback is a **slice04/link** need, never hit here (closing-report §Resolution) | |
| S-4 | **Idempotent `project.json` write** — re-add updates the pin; `IndexMap` order preserved; pretty-print consistent. | test: add, re-add → one entry, updated; diff order stable | correctness | DD-63 §3(f) | **done** | `upsert_imports`: ordered `IndexMap` + text-splice of only the `imports` object (4-space preserved). Re-add `@std/assert@1.0.0`→1 entry, no dup. `upsert_appends…`/`upsert_is_idempotent…` | no dup, no churn |
| S-5 | **Macro axis** — `MacroModule` add leaves `import-macros` resolving; `Runtime` gets the value pair (read via `PackageKind`). | test macro-module fixture + a runtime pkg | serious | DD-63 §3(e) | **done** | `detect_kind` reads `PackageKind` (JSR deno.json `lykn.kind`); `lykn add jsr:@lykn/testing@0.5.2`→"macro module"; astring/@std/assert→Runtime. `kind_from_str` test | bare key = macro specifier |
| S-6 | **Cache/validate at add-time** — new specifier is `deno cache`/`info`-d; a bad specifier errors at `add`, not mid-build. | attest: bad specifier → add-time error | correctness | DD-63 §5 | **done** (CC-attested) | `cache_specifier` (`deno info`); `lykn add jsr:@std/does-not-exist-xyz`→404 rc=1, no write | |
| S-7 | **Deno-shell mechanism held** — no `reqwest`/`ureq`/`nodejs-semver` added to `lykn-cli` in 0.6.0; resolution via deno-fetch. | `Cargo.toml` diff = no new heavy deps | serious | slice-doc §3 (DD-63 refine) | **done** | `git diff crates/lykn-cli/Cargo.toml` = empty; all external work via `deno eval`/`deno info` | nodejs-semver → 0.7.0 |
| S-8 | **`make check` green; scoped diff** — `main.rs` (Add) + a `cmd_add` module + `config`/writer touches + tests only; no unrelated changes. | host `make check`; `git show --stat` | serious | recon discipline | **done** (CC-attested) | `make check` ✓; diff = `main.rs` + new `add.rs` + `lib.rs`; `config` consumed unchanged | |

## Closure

Closed at `<CDC-fills>` (CC-attested; network/deno + `make check` reconcile on
host). Rows: 8. Done: 8. _(On close: CDC verifies the subcommand/parse/exact-pin/
pair/idempotent-write/macro-kind against `lang` and confirms no heavy deps were
added — `Cargo.toml` diff empty; network + deno + real-registry rows reconcile on
a host re-run. Key handoff to slice04: `upsert_imports`/`import_pair`/
`parse_specifier` are the `link` overlay's reuse surface; exports discovery +
`mod.js` fallback land there, not here.)_
