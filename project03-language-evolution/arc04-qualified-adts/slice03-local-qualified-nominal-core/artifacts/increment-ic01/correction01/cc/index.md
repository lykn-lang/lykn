# IC-01 correction01 iteration07 — CC receipts

**Disposition: CC proposed-done; independent Sol verification pending.** This
corrects the preserved iteration06 HOLD at `5bdbfe3c` without rewriting that
candidate or its evidence. Final source is `b8a1fa17cf9543c22a52228d17f0dd19e3fcf0a1`,
tree `d3e604b206cfedac1ec97a5932ba8b1bb5fca61f`, branch
`codex/qualified-adt-core` in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`;
the source worktree is clean. The correction is the three-commit sequence
`284ad97b` (shared grammar / complete role walks), `b6536e0d` (exactly-once
kernel declaration default traversal), `b8a1fa17` (occurrence-count and
supported-native-macro oracles). All commits carry contiguous Codex and Billo
AI trailers. Source diff from `5bdbfe3c` is limited to these 11 authorized
paths:

- `crates/lykn-cli/src/compile.rs`
- `crates/lykn-cli/tests/macro_dependencies.rs`
- `crates/lykn-lang/embedded/packages/lang/{binding.js,classifier.js,function-clauses.js}`
- `crates/lykn-lang/src/{binding.rs,classifier/forms.rs}`
- `packages/lang/{binding.js,classifier.js,function-clauses.js}`
- `test/forms/reserved-binding-output.test.js`

## Implementation and focused evidence

Native `parse_keyword_clauses` / `is_func_clause_key` are reused unchanged and
made `pub(crate)`. Public parsing moved unchanged into the private
`function-clauses.js` leaf; `classifier.js` reexports those same public names,
and `binding.js` imports the leaf without a classifier cycle. Native and public
source Func/Genfunc walks select multi-clause, keyword mode and zero-argument
shorthand from their actual first post-name argument. They use last-group-wins,
visit all selected body forms, and do not inspect overridden metadata as code.
Public outgoing own-level body bindings reach postconditions in either textual
order. Native follows physical group order: body-before-post remains valid and
post-before-body still rejects its old strict `eval` case for the separate B2
resolver/lowering limit. Native computed callees are visited before independent
arguments; atom heads have no executable child.

Default traversal and binder projection are role-specific and recursive. Typed
source alias keys are data; only nested locals bind. Kernel alias keys can be
keywords and the local slot is still checked. Source bind, kernel declaration,
function and class-member defaults are covered; class-member queries are
validation-only and legacy D1 class aggregation is unchanged. A direct
`walkBindings`/`walk_bindings` occurrence-count assertion confirms a single
kernel declaration default yields exactly `value, local, inner`, once each.
No public `kernel:lambda` escape or nominal activation was added.

Supported macro regression passes the caller's typed parameter AST through
unquote into a real `fn`: the restricted `package` parameter fails on public
and native paths; renamed `safe` compiles and generated ESM executes with
output `0`. The typed nested alias runtime fixture executes and prints
`local-value`; the external key `package` is not treated as a binder. Public
post-order paired fixtures both execute and print `true`.

Focused final-pin receipts are under [`receipts/native-focused/final-pin/`](receipts/native-focused/final-pin/):

- Rust binding tests: 30/30; native CLI macro/compile-check-stripped test: 1/1.
- Public `reserved-binding-output.test.js`: 14/14; actual cold M6 public set: 25/25.
- The eight negative retained witness inputs (`function-tail`,
  `computed-callee`, `kernel-default`, `declaration-default`, `class-default`,
  `alias-default`, `post-before-body`, `macro-fn`) each fail native checked
  compile, stripped compile and check. The body-before-post positive passes
  all three and its emitted module prints `true`.
- `alias-default` native compile is retained as a direct-gate result only; its
  old unlowered-`do` emission limit is not claimed as an independent runtime
  oracle. The kernel-lambda probe remains direct-only because public whitelist
  support is intentionally unchanged.

## Final gates at b8a1fa17

| Gate | Result |
| --- | --- |
| `make check` | Pass; JS+Lykn 1533/1533 across 67 steps; docs 482/482 (one docs run in this final gate) |
| Actual cold M6 | Pass; 12 canonical/embedded/materialized byte comparisons; 25/25 strict materialized public tests |
| `make check-cited-paths` after commit | Pass; 64 documents and 601 historical citations accepted |
| `make bundle-size-check` after commit | Pass; 43,828 gzip bytes, +16,198 vs 27,630 baseline, under 81,920-byte budget |
| Focused Rust binding tests | 30/30 |
| Native supported-macro compile/check/stripped and legal runtime | Pass; 1/1 unit test, legal output `0` |

Full final outputs are `receipts/make-check-final.log`, `receipts/m6-focused-final.log`,
`receipts/committed-citations-final.log`, and `receipts/browser-size-final.log`.
The final cold-M6 run retains its raw streams and twelve comparison receipts at
the `receipts/m6-*` paths. `receipts/pre-final-284ad97/` preserves the prior
candidate's own M6/full/citation/size evidence and focused logs; it is not
relabelled as final-pin evidence.

An initial full check on `284ad97` stopped at two Clippy `collapsible_if`
findings. The exact failure was visible in the tool transcript but no raw log
was captured; it is not reconstructed here. Both conditions were corrected.
The final full check above is the authoritative green result. Existing
iteration05 first-full-gate 481/1 documentation failure and iteration06 HOLD
witnesses remain preserved at their earlier paths and pins.

The B2 native post-before-body ordering repair, public API/run-load behavior,
LC-02–08, qualified nominal activation, release integration, publication and
S03 acceptance remain open. This is a clean CC handoff for separate Sol review,
not independent acceptance or source integration authority.
