# Independent increment-A review — 5a8aedc5

Separate Sol 6.1 High reviewer, 2026-11-11. Task source remained clean on
`codex/qualified-adt-core` at `5a8aedc5dcd6329da7b5f33a5397126a45891bac`,
tree `3a05cbf5cc12b8e964e5de983b2f835e1f563c4e`.

`receipts-5a8aedc5.tar.gz` SHA-256:
`fbe812d8fea4b38554387b48707dadbb4717d4179b4e78f6571c3ae18f6b8ca1`.
It contains raw process launches/streams/status, Lykn-authored helpers/probes,
useful generated modules and final source/tool/binary pins. No binaries,
dependency packages or user/owned caches are archived.

| Archive path | Meaning |
| --- | --- |
| `receipts/make-check/` | Fresh complete gate exited 0: 1,176 language units; 1,507 corpus tests/67 steps; 482 docs; Rust integrations/build/lint/Clippy/format. Existing browser ESM and old M6 tests ran. This passing population missed the independently reproduced dispatch defect. |
| `dispatch*.lykn`, `dispatch*.js`, `receipts/dispatch*-compile/`, `receipts/dispatch*-runtime/` | Native module and enclosing-parameter `Array` shadow controls, checked/stripped. All four compile/runtime process pairs exit 0; the caught actual output is `["TypeError","Array.isArray is not a function"]` rather than expected `"array"`. Generated dispatch still names the user Array; payload guard already uses the correct alias. |
| `reference-probes.lykn`, `reference-results.json`, three `*-shadowed.js`/`unshadowed.js` outputs | Public private-producer controls for all nine references: unshadowed/module-shadowed/parameter-shadowed, 27/27 runtime assertions pass. Three fragment atom/call-head/new-constructor rejection controls pass. Shared private atom reuse is separately recorded as rejected. |
| `receipts/reference-probes/` | First driver invocation failed because `--no-config` could not resolve compiler-owned `astring`; this is reviewer setup failure, not a product regression. |
| `receipts/reference-probes-config/` | Complete successful retry using existing repository `project.json`, explicit existing Deno cache, no dependency change. |
| `pins.json`, `receipts/final-pins/` | Clean candidate/tree, source delta, actual commit trailers, Rust/Cargo/Deno and binary hashes. |

Outer launches explicitly used `DENO_DIR=/Users/oubiwann/Library/Caches/deno`
and owned npm/XDG/tmp under `/private/tmp/lykn-s03-a-cdc-5a8aedc5`.
Rust/Cargo are 1.97.0 and Deno 2.9.6. Full-gate installed and release CLI both
hash `e4e949abdda17d52f7024ce88f58c15e517aeaae5b9444d67d48d2fa857aabbb`.

The public driver imports the existing internal `hostReference` producer,
constructs kernel using Lykn, invokes the product compiler and imports its
actual emitted ESM. Checks establish Symbol construction/registry identity,
Object freeze/descriptor behavior, NaN/array predicates, Promise and both error
constructors in the three shadowing conditions. It is not a claim that future
nominal producers or every native consumer are correct. Public fragment checks
cover the reference itself, a marked call head and a marked `new` constructor.

No source fix or new Rust/JS test/helper was authored by this reviewer. A
helper's extra closing parenthesis was corrected before successful replay;
its compile diagnostic and the consequent missing-output launch are session
observations, not invented archived logs. Helper unused-binding warnings also
remain session observations. CC's historical setup failures remain at their
original documentary strength; unavailable raw logs were not reconstructed.

After the known product failure, root directed the reviewer to finish focused
checks and return ownership. The already-running full gate had completed;
separate fresh citation/size gates, adapted cold host-runtime proof and further
full gates were not run on this rejected candidate. They remain required for
the corrected candidate. The main verification record contains the HOLD and
remaining boundaries.
