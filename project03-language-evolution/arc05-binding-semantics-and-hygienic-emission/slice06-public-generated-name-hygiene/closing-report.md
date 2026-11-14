# S06 CC close — proposed done

Date: 2026-11-14

This is the CC source/build close for S06 public generated-name hygiene. All eight plan rows are proposed done from this implementation and its captured evidence. Independent CDC disposition, root retrospective, and ledger updates remain owned by their named contributors; this report does not accept or close those rows.

## Source delivery

- Worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
- Branch: `codex/qualified-adt-core`
- Commit: `17791f24696ecbd1bc1cc4cabcc65c1a49d555c1`
- Tree: `792fd4244180068e3319c49785cf8df1ff5ae02b`
- Commit message: `Protect public compiler-generated bindings from capture`
- The commit has the required adjacent Codex and Billo AI coauthor trailers, includes exactly fifteen paths, and the source worktree was clean after commit.
- No dependency/lockfile, module export, native emitter, AST/reader/resolver, protected-policy, DTS, release, or publication changes were made. No source-binding identity or general macro-hygiene promise was added.

## Implementation and test inventory

Nine logical paths were committed: six compiler modules (`identifier.js`, `compiler.js`, `expander-core.js`, `classifier.js`, `host-invocation-kernel.js`, `host-invocation.js`), the new eight-group `test/forms/public-generated-names.test.js`, the M6 integration test update in `crates/lykn-cli/tests/macro_dependencies.rs`, and the narrow public boundary note in `docs/guides/06-functions-closures.md`.

The six existing tracked embedded mirrors of those compiler modules were copied byte-for-byte before fresh builds and committed alongside the logical files. The new public test uses `lang/` and `browser/` import-map aliases, so M6 executes the materialized package rather than reaching canonical source by relative import.

The implementation centralizes physical JavaScript-name occupancy and generated-name allocation, reserves names across owned compiler inputs and macro expansion barriers, threads per-unit/per-form allocator state through existing producer APIs, preserves the public gensym stream, and protects late ICU, host-reference, expanded-host-invocation, and lazy invocation names. The new test exercises complete-source typed/recursive/sibling cases, defaults, conditionals, threading, discard, both Match routes, overloads, generator functions/yields, direct builders, macro re-entry, ICU, raw request anchors, and an actual expanded method invocation.

The actual expanded invocation fixture owns `lyknHostReflectApply0` in source. Its expanded receiver call emits and executes `lyknHostReflectApply1`; its runtime oracle preserves the getter → argument 1 → argument 2 → method order and original receiver/value. The separate raw saved-call request remains tested with its exact node anchor and result `14`.

## Proposed dispositions

| PN | CC proposal | Evidence and limit |
|---|---|---|
| PN-01 | Proposed done | Shared physical keys account for normalized, colon-segment, Unicode/escape, and emitted-name forms; focused opposition tests cover the candidate collision and insertion paths. |
| PN-02 | Proposed done | The whole-source, one-form, and direct-builder paths seed the names they own. The eight new groups execute the public producers and value/effect cases; direct APIs are not claimed to know sibling forms they never receive. |
| PN-03 | Proposed done | Existing `gensym`/`resetGensym` behavior remains intact; failure/re-entry, independent invocation, and nested public entries are exercised without a new global active-unit allocator. |
| PN-04 | Proposed done | M6 and focused public tests exercise actual ICU, compiler-private completion/discard, expanded host invocation and lazy saved-call request paths. Exact anchors remain object-identity based; the new expanded helper collision executes. |
| PN-05 | Proposed done | Runtime checks cover source output/effects, browser ESM, direct/fragments, JSON round trip, raw source-shaped names, and user namespace preservation. Raw lower-level compiler semantics and full source-binding identity remain outside this slice. |
| PN-06 | Proposed done | M6 strict public consumer: 8 paths, 78 passed, 0 failed; all 15 canonical/embedded/materialized comparisons were inspected and true. Actual command, import map, output/status, and environment/cache details are in the final M6 receipts. |
| PN-07 | Proposed done | Exact fifteen-path commit, fresh artifacts, focused and full gates, docs, final-HEAD citation gate, and fresh 80 KiB (81,920-byte) bundle budget are recorded below. No dependency or gate was weakened. |
| PN-08 | Proposed done by CC; review pending | Intake, failed attempts, corrected summaries, raw available receipts, final close, and source inventory are preserved. Independent CDC, root retrospective, and all ledger changes remain outstanding and are not represented as accepted here. |

## Validation and retained attempts

Focused attempt history is preserved under `artifacts/cc/`:

- Attempt01: captured only in the tool result, not saved as raw stdout/stderr. The contemporaneous note first misstated the new-group count; an append-only correction records the actual aggregate as 28 passed / 7 failed (26 passed / 1 failed among the old focused paths; 2 passed / 6 failed in the new path). The original mistake remains visible. No full failed-source snapshot is claimed.
- Attempt02: 31 passed / 4 failed. Captured streams show the typed/default fixture oracle and direct-builder fixture issue plus an emitted ICU identifier-run collision. Those were corrected without reducing runtime assertions.
- Attempt03: 33 passed / 2 failed. The remaining issues were the missing Match output line in the builder transcript and the saved-call fixture treating `Reflect.apply`'s argument list as one nested value. The fixture was corrected to match the existing scalar saved-call protocol; expected runtime value remained 14. No full failed-source snapshot is claimed.
- Attempt04: 35 passed / 0 failed after those corrections. Its separate note clarifies that DD-37 contributes one comparison test; `106` is a value oracle in the S06 threading/discard/conditional/Match group, not a DD-37 test count.
- Attempt05: 35 passed / 0 failed after restoring the existing `toJsIdentifier` option consumed by the expanded invocation finalizer.
- Attempt06: 42 passed / 0 failed across the original seven focused paths plus `discard-bindings.test.js`, which contains the actual expanded invocation consumer. It includes the new test's eight groups.

The first full `make check` failed before M6: four Rust macro expansion tests could not fetch pinned `astring@1.9.0` from `registry.npmjs.org` because DNS was unavailable in the isolated XDG cache. Its tool output was not captured to a local raw log; this summary preserves the observed condition and exit, without reconstructing raw output. The escalated retry retained the same test/cache semantics and fetched the pinned dependency. That run reached M6 and preserved a separate 77/78 failure receipt: the materialized `discard-bindings.test.js` typed-Bind path found an omitted `toJsIdentifier` callback option in `host-invocation-kernel.js`. The implementation restored the option and added the actual expanded invocation runtime case described above.

The corrected full run is `artifacts/cc/make-check-attempt03.log` with exit `0`. It records the successful optimized `cargo build --release`/fresh-artifacts build, clippy, Rust format check, Lykn syntax/lint, Rust tests, full suite and docs. `cargo test --all-features --workspace` uses Cargo's test/dev profile; its unit, integration and doctest result lines sum to 514 passed / 0 failed. The full JS/Lykn suite reports 1,586 passed across 67 steps / 0 failed; documentation reports 482 passed / 0 failed. No M6 strict tests were filtered or skipped. M6's inner strict consumer—not merely the outer Cargo result—reports `ok | 78 passed | 0 failed` across its eight listed paths. The new S06 file contributes 8/8; the retained discard suite contributes 7/7.

The final M6 integration test runs in Cargo's test/dev profile and copies that test binary's CLI into a standalone directory; the Make prerequisite separately built optimized release artifacts. Its strict Deno invocation imports `lang/` from the materialized package and `browser/` from `target/lykn/build/browser`, runs with `--cached-only`, and records its generated import-map config, command, status, stdout, and stderr. The standalone copied CLI starts without a canonical package fallback and forces a cold owned XDG materialization. Its Deno subprocess uses the shared warm `/Users/oubiwann/Library/Caches/deno`; this proves the requested embedded materialization path while relying on warm pinned dependencies, not cold external dependency resolution. Receipt metadata records the exact Deno executable and inherited XDG/DENO_DIR values; macro child argv is explicitly not separately traced. Exactly fifteen comparison receipts were inspected:

| M6 canonical package file | Bytes | Canonical = embedded = materialized |
|---|---:|---|
| `binding.js` | 35,636 | yes |
| `classifier.js` | 58,364 | yes |
| `compiler-private-atoms.js` | 1,541 | yes |
| `compiler.js` | 74,629 | yes |
| `expander-core.js` | 99,445 | yes |
| `function-clauses.js` | 1,890 | yes |
| `host-invocation-kernel.js` | 3,747 | yes |
| `host-invocation.js` | 8,780 | yes |
| `identifier.js` | 8,613 | yes |
| `lexical-regions.js` | 8,064 | yes |
| `protected-host.js` | 22,819 | yes |
| `reserved-words.js` | 1,445 | yes |
| `surface-helpers.js` | 27,004 | yes |
| `surface-type-context.js` | 423 | yes |
| `surface.js` | 12,158 | yes |

After the commit, final-HEAD `make check-cited-paths` passed for 64 documents (601 historical citations accepted). Fresh `DENO_DIR=/Users/oubiwann/Library/Caches/deno make bundle-size-check` passed its 81,920-byte gzip cap: baseline 27,630 bytes, current 49,965 bytes, delta +22,335 bytes. Esbuild emitted its existing warning that `astring`'s `browser` package condition follows `import` and `require`; both baseline and current measurement completed.

Preflight: the new JS test was formatted with `deno fmt`. `deno fmt --check` on the six existing full source modules was not used as a gate because it reports the repository's existing whole-file style differences; no blanket reformat was applied. Configured Deno lint reports the established unversioned `jsr:@std/assert` import convention on the new file; no project rule was relaxed. The required full repository gate above passes.

## Evidence inventory and handoff

- `artifacts/cc/intake.md`: bounded source/plan/manifest reads, including the later recovered extents.
- `artifacts/cc/focused-attempt01.md` retains the mistaken sub-count and its append-only correction; attempts02–06 stdout/stderr/exit files and `focused-attempt04-note.md` preserve later results and denominator clarification.
- `artifacts/cc/make-check-attempt02.log` and exit preserve the first escalated M6 failure; `m6-escalated-attempt02/` preserves the complete 77/78 inner receipts and all 15 comparisons.
- `artifacts/cc/make-check-attempt03.log` and exit, plus `m6-final-success/`, preserve the final successful full run and M6 inner receipts. `m6-final/` is the separate first-run directory; it was not overwritten.
- The first non-escalated full-check DNS failure had no saved raw stream; the exact error family/count and missing raw-stream limit are recorded above.
- Source/build ownership returns to root at this committed, clean source tree. CC has made no planning Git/index/ledger mutation. Formal refinements spent: 0. No job remains running. No push, release, tag, publication, S07 change, or library trial occurred.

Root owns the next source-first independent review, separate CDC disposition, planning ledger updates, and the requested BS-06/API/research routing and retrospective. This report proposes S06 done; it does not substitute for those later owners.

Suggested bubble-up material for those owners: BS-06 can record the actual
producer census and the distinction between a whole source unit and a direct
builder's bounded input. API review can preserve the current gensym/reset
contract while treating exact source-binding identity and general macro
hygiene as separate decisions. Research review can decide whether further
Unicode/escape and emitted-member-key cases belong in the shared physical-name
model; S06's tested mapping is evidence for this helper, not a claim that all
future backends or arbitrary evaluation are statically discoverable.
