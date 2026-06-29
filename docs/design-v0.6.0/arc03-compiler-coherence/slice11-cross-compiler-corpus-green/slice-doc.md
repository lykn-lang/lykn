# Slice 11: cross-compiler-corpus-green

> The remediation slice that gates arc03's formal close. Routed from arc03
> `closing-report.md` §5 (the A-2 composition run left the `compile-both` corpus
> red on 6 non-semantic failures). Per LEDGER-DISCIPLINE §B this is
> remediation-not-iteration: a planned slice, not an in-place grind on the arc.

## Goal

Get the cross-compiler `compile-both` corpus **green** (`lykn test` exits 0)
without weakening the equality check — by **fixing the divergences in the
compiler** wherever they are real (the `helpers.js` normalizer policy:
"FIX the divergence in one compiler, do not extend the normalizer"), and by
**dispositioning** the genuinely non-coherence outliers (a harness path issue
and a network-gated test) with explicit rationale. Add a guard so the check
can't silently run against a stale `bin/lykn` and report false divergences.

## Scope (in)

- Rust codegen fix: async function **declarations** must not emit a trailing
  `;` (the `emit_async` → `emit_function` / `emit_function_star` path,
  `crates/lykn-lang/src/codegen/emit.rs` ~534–565), so they converge with the
  JS (astring) output. This clears 3 of the 6 (async decl, for-await-of, async
  function*).
- The `__gensym` + blank-line residual on the DD-49 return-type-check test:
  resolve via compiler fix if real; only touch normalizer transform #3 with the
  policy-required rationale + closing-report reference.
- The DD-52 `import-macros` `--source-context-path` temp-dir path resolution
  (#3): fix the Rust path resolution if it's a real bug, else formally mark the
  test a documented harness limitation with rationale.
- The DD-53 R-5 JSR end-to-end test (#4): disposition as network/environment
  gated (not a coherence defect) — skip-with-rationale in offline runs.
- A stale-`bin/lykn` guard so `lykn test` / `make` build a fresh binary first
  (or fail loudly if the binary is older than the Rust sources).

## Scope (out)

- Extending `compile-both` coverage beyond form codegen (the ~11% bound is a
  documented limitation; a future arc).
- The `cargo fmt` / `make check` red state (separate project-level finding).
- Any DD-58/DD-37 behavior change — this is convergence cleanup only.

## Verification approach

Run the corpus against a **freshly built** binary (never the stale `bin/lykn`):

```sh
cargo build --release
export LYKN_BIN="$(pwd)/target/release/lykn"
"$LYKN_BIN" test          # acceptance: 0 failed
```

Plus per-row greps/tests in `ledger.md`.

## Exit criteria

All ledger rows reach a final status; F-6 (corpus green) is `done` with a
freshly-built-binary transcript; arc03 can then close (its row A-6) and bubble
up to project.
