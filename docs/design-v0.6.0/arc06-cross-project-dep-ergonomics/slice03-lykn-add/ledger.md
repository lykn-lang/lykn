# arc06 · slice03 — Ledger (`lykn add` registry dependency-add)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands + attests
(network/deno rows are host-run); CDC verifies structure against `lang`. Closer ≠
verifier. **Provisional — pending DD-63 promotion.**

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | **`Add` subcommand exists** — clap `Commands::Add { specifier }` + `cmd_add` dispatch; specifier parse handles `jsr:`/`npm:` ± `@version`, rejects malformed. | read `main.rs` enum + dispatch; parse unit tests | serious | DD-63 §2 | open | | net-new command |
| S-2 | **Exact pin** — a written specifier is a concrete version (`@X`), never a floating range; no-version add resolves latest exact; given-version pins it. | read the writer + resolve path; assert no `^`/`~`/`/`-only written | serious | DD-63 #2 | open | | closes unpinned scaffold |
| S-3 | **Bare + slash pair** — both keys written, entry from `exports` (fallback `mod.js`+`/`). | read pair emission; test both keys present | serious | DD-63 #3 | open | | |
| S-4 | **Idempotent `project.json` write** — re-add updates the pin; `IndexMap` order preserved; pretty-print consistent. | test: add, re-add → one entry, updated; diff order stable | correctness | DD-63 §3(f) | open | | no dup, no churn |
| S-5 | **Macro axis** — `MacroModule` add leaves `import-macros` resolving; `Runtime` gets the value pair (read via `PackageKind`). | test macro-module fixture + a runtime pkg | serious | DD-63 §3(e) | open | | |
| S-6 | **Cache/validate at add-time** — new specifier is `deno cache`/`info`-d; a bad specifier errors at `add`, not mid-build. | attest: bad specifier → add-time error | correctness | DD-63 §5 | open | | |
| S-7 | **Deno-shell mechanism held** — no `reqwest`/`ureq`/`nodejs-semver` added to `lykn-cli` in 0.6.0; resolution via deno-fetch. | `Cargo.toml` diff = no new heavy deps | serious | slice-doc §3 (DD-63 refine) | open | | nodejs-semver → 0.7.0 |
| S-8 | **`make check` green; scoped diff** — `main.rs` (Add) + a `cmd_add` module + `config`/writer touches + tests only; no unrelated changes. | host `make check`; `git show --stat` | serious | recon discipline | open | | |

## Closure

Closed at `<CDC-fills>` (CC-attested; network/deno + `make check` reconcile on
host). Rows: 8. _(On close: CDC verifies the subcommand/parse/exact-pin/pair/
idempotent-write/macro-kind against `lang` and confirms no heavy deps were added;
network + deno rows reconcile on a host re-run.)_
