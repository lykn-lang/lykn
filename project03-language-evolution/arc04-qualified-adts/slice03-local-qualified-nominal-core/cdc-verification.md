# S03 independent verification

## Increment A candidate 5a8aedc5 — 2026-11-11

**Verdict: HOLD; do not accept increment A or start dependent nominal work.**
This separate Sol 6.1 High context reviewed the issued initial prompt, all eight
open LC rows, actual 38-path source delta from accepted `0829e892`, CC's
closing report and available raw gate logs. Root transferred exclusive task
build/execution ownership after Luna returned the committed candidate.
No source repair, Git index change, stage, commit or parent/ledger edit was
made by this reviewer.

Source remained clean on `codex/qualified-adt-core` at
`5a8aedc5dcd6329da7b5f33a5397126a45891bac`, tree
`3a05cbf5cc12b8e964e5de983b2f835e1f563c4e`. The source diff synchronizes six
changed canonical compiler files into the embedded payload and adds the finite
native/public private-reference facilities, v2 policy, guard/error consumers,
JSON Result boundaries and tests. This is A only: no nominal syntax, qualified
owner resolution or purity implementation is accepted here.

### Findings and required correction

1. **AF-01 — substantive native dispatch capture, independently reproduced.**
   `crates/lykn-lang/src/emitter/forms.rs::build_dispatch_check`, line 3938,
   still constructs `atom("Array:isArray")`. All other production raw
   Number/Array/Promise/TypeError/Error producers in the scoped emitter census
   were migrated; this one was missed. With `(bind Array 0)`, a multi-clause
   `func` accepting `:array` and `:string`, called with `#a(1)`, compiles but
   produces `["TypeError","Array.isArray is not a function"]`. Expected
   selection is `"array"`. The same failure occurs with an enclosing-function
   parameter named Array. Both module and parameter controls fail semantically
   in checked and stripped output: four independently executed conditions,
   each compile/runtime process exit 0 because the probe catches and records
   the exception. Generated payload guards already use the correct imported
   or local alias; the earlier dispatch condition bypasses it. Correct this
   owned producer and add discriminating module/parameter regressions,
   including retained string and unknown-clause outcomes.
2. **AF-02 — cold delivery oracle does not cover A's full changed boundary.**
   `crates/lykn-cli/tests/macro_dependencies.rs::m6_...`, line 714, retains its
   old five-file comparison list. The union with A's changed canonical files
   is seven: binding, classifier, compiler, compiler-private-atoms,
   expander-core, protected-host and surface-helpers. Actual copies appear
   synchronized in the inspected diff, but the passing M6 receipt does not
   prove the omitted compiler/policy bytes or new owned guard runtime through
   materialized imports. Its existing public ADT fixture has `:any` payloads.
   Adapt the comparison set and exercise A's host guards/errors against the
   actual cold-materialized `lang/` path/copy-of-CLI route.
3. **AF-03 — unfinished native fragment return, source-inspected boundary.**
   Public `emitter/forms.rs::emit_form` (276–289) detects only old
   host-invocation markers before returning forms. Typed guards now introduce
   private host references; this fragment API can therefore return unfinished
   reference-bearing forms instead of its assigned structured fragment error.
   Complete emission/JSON lowerers subsequently handle them, and fragment JSON
   rejects them, but that does not enforce this earlier public fragment
   boundary. Add the corresponding check and direct product test, or obtain
   an explicit contract disposition before claiming all native fragments are
   covered. This finding is source inspection, not an executed native API
   reproduction; no private Rust research helper was authored.
4. **AF-04 — shared public reference identity, reproduced internal case.**
   `packages/lang/compiler.js::lowerHostReferences` appends every encountered
   marked atom to an array, then clears its metadata during mutation. Reusing
   one owned `hostReference("SymbolFor")` atom as the head of two calls causes
   the second mutation to throw `invalid compiler-owned host reference`.
   Root explicitly selected a bounded deduplicated mutation fix and internal
   regression. Reference values may have multiple occurrences; this is
   distinct from single-consumption Reflect invocation anchors. No ordinary
   source exploit is claimed.

The commit has a blank line between Codex and Billo AI co-author trailers,
contrary to AGENTS' contiguous-trailer rule. Root independently noticed the
same documentary deviation. Preserve this committed pin/history; do not amend
it. Subsequent commits must use contiguous trailers. This is not a source
runtime repair or grounds to rewrite prior evidence.

### Independently executed evidence and its limits

A fresh `make check` exited 0 with existing explicit Deno cache and fresh owned
npm/XDG/tmp homes. It completed build/lint/Clippy/format, Rust integrations,
1,176 language unit tests, 1,507 corpus tests plus 67 steps, and 482 docs once.
The browser ESM consumer and current M6 tests ran within that gate. The gate
was already running when AF-01 was confirmed; its successful population does
not cover the independently failing condition. No duplicate documentation
suite was run.

A reviewer-authored Lykn driver imported the existing internal public
`hostReference` producer and exercised all nine values through actual emitted
ESM in unshadowed, module-root-shadowed and parameter-root-shadowed units.
All 27 runtime assertions passed: Symbol construction/registry identity,
Object freeze/descriptor behavior, Number.isNaN, Array.isArray, Promise,
TypeError and Error. Three public fragment controls correctly reject an
unfinished atom, call-head reference and `new` constructor reference. This
does not validate the missed native dispatch consumer or future nominal
producers. A separate internal sharing observation records that reusing one
marked atom object in two calls is rejected after metadata is cleared on the
first occurrence. Root's subsequent disposition requires the bounded AF-04
fix; no source-reachable exploit is claimed.

Support aliases/import specifiers are sparse and after directives. Both fixed
inline module constants, however, capture/export all nine values regardless
of the requested subset. Root explicitly approved that fixed-module baseline
as a provisional layout; it is not a rejection finding. Do not describe the
data-module body as sparse.
The current protected-host assumption excludes foreign/dynamic tampering;
this review did not invent getter-tampering acceptance requirements. Later
LC-06 still owns support-initializer provenance/removal in the ADT dependency
graph; no purity or zero-contribution result is accepted now. Collision and
same-spelling macro requirements still need their discriminating corrected
candidate evidence rather than inference from a complete-name walk alone.

Fresh bounded [raw receipts](artifacts/increment-a/cdc/receipts-5a8aedc5.tar.gz)
and [navigation/digest](artifacts/increment-a/cdc/README.md) preserve actual
argv/cwd/selected environment, source/tool/binary pins, source/generated
probes, runtime observations and the first failed reviewer import-map setup.
The retry used existing `project.json`, without changing any dependency.
Compiler/source pins remained unchanged throughout. Installed and release
CLI SHA-256 are both
`e4e949abdda17d52f7024ce88f58c15e517aeaae5b9444d67d48d2fa857aabbb`;
Rust/Cargo are 1.97.0, Deno 2.9.6.

After AF-01, root directed bounded focused completion and return rather than
additional full gates on a known-failing candidate. Separate fresh citation
and browser-size gates, adapted cold host-runtime proof and corrected source
full gates therefore remain unrun here. CC's reported successful gates retain
their attested strength and original logs; they are not independent acceptance.
No missing historical raw log was reconstructed.

### Criterion disposition and ownership

LC-01 is **open/held** by AF-01 and the remaining fragment/delivery obligations.
The seven other LC rows remain open; A neither closes them nor implements the
qualified nominal feature. Retain S02's separately accepted evidence and I4
protected early-return, historical unregistered fallback and version-sentinel
warm-cache limits; this A review does not strengthen those claims.

Root owns the correction assignment, planning Git/index and ledger/parent
status. The reviewer returns exclusive task source/build execution and this
verification/evidence ownership now. Further source correction belongs to CC,
followed by separate review of the actual corrected candidate and required
gates. No B/C implementation authority follows from this record.
