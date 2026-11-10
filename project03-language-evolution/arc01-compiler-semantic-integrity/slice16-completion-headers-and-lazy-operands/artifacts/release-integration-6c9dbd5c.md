# Local S14–S16 release integration — 2026-11-10

The Operator authorized a local fast-forward and continuation
into I3 after independent green gates. The root coordinator
fast-forwarded the existing `release/0.6.x` checkout from
`31893710bbba8999e936fade2d79ae6f6aee929c` to accepted
`6c9dbd5c38f16674c7b95315bd32bfee9fd131e5`. Sol 6.1 High CDC
independently verified the exact reflog fast-forward, 0/15
ancestry, 26-path change, tree
`d9ce3a36e164252740d9ac29f712c85add99a0de`, clean status,
and empty index and tracked comparisons. The separately
accepted [task proof](../cdc-verification.md) remains distinct.

Unfiltered normal Make and standalone cited paths both exit 0.
The full gate passes Clippy, formatting, 1,166 Rust library
tests, 1,487 JS/Lykn tests with 56 steps and 482 docs cases.
Standalone cites cover 64 documents and 601 historical entries.
The prospective commands use ordinary pinned Deno 2.9.6 PATH,
Rust/Cargo 1.97.0, fixed DENO_DIR and separate config-free
TMPDIR/XDG/npm roots with both test-only variables unset.
All 68 exact named configuration paths were observed absent.

Actual release-path `bin/lykn` and `target/release/lykn`
are byte-identical at SHA-256
`ea922178b5edade1848b87c755e75cb1e21f9045e4b80fe6a69dc896ddd3b810`.
The fresh complete XDG package equals the repository embedded
package. Both changed JS files match canonical, embedded, build
and actual fresh materialized copies. See the
[raw release evidence](evidence/cdc/release-6c9dbd5c/).
The raw streams retain their original formatting.

This establishes the local release gate for I3. CV-04, CI-04,
I4 and wider composition stay open.
