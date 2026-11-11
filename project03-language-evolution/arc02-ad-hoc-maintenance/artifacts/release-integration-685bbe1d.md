# S04 and S05 local release integration

On 2026-11-10 the Operator authorized a local fast-forward of
`release/0.6.x` from `b0c97f4eb587e4a65273131fd9d2bbe0f63b3f8a`
to `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`.
The root context performed the fast-forward. Sol 6.1 High CDC
independently verified the release checkout and reran the gates.
The actual reflog records a fast-forward. Ancestry is 0 behind and
4 ahead of the pre-integration head. The release tree
`f53a818928d752b842f8af2c3933aad4d82f9117` equals the accepted task
tree. The release index and tracked source were clean after replay.

| Gate | Independent result on the local release checkout |
| --- | --- |
| Normal repository validation | Unfiltered `make check` exited 0. This includes 1,167 Rust library tests, all other Rust suites, 1,494 JS/Lykn tests and 67 steps, and 482 documentation tests. |
| Committed citations | Standalone `make check-cited-paths` exited 0 for 64 documents and 601 accepted historical citations. |
| Fixed browser bundle gate | Official Deno 2.7.7 and the committed meter returned 0. Raw 318,148, minified 151,673, gzip 41,338 bytes. The original fixed source remains 27,906 gzip bytes. The result is +13,432 above that historical comparison and 40,582 below the 81,920 cap. |
| Actual release CLI browser artifacts | The fresh release CLI built both artifacts. Its minified bytes equal the previously accepted real CLI and graph output in full, SHA-256 `07a879e97518f7d896810075e74037e5c6141bc16ce8dea59360ec6bfb43a483`. The archived developer build differs only in the generated astring source-path comment. Fresh sandboxed Chromium host and developer diagnostic DOMs match the accepted outputs exactly, at 12,441 and 1,390 bytes. |
| Embedded compiler and cache | The canonical and embedded lang trees match. The fresh normal Make cache and the separate cold/warm release cache equal the full embedded payload. All 22 files in the actual S04 cache sibling retain their hashes. The old, cold, warm and recovered generated programs match and strict Deno prints `42\n` with empty stderr. M4 observes missing config with the lock present and recovers exact config and lock bytes. |

The 2,623-byte S04 saving and 883-byte S05 saving give a combined
3,506 bytes from the 44,844-byte pre-split release. The official
meter and actual minified CLI artifact agree on the minified size.
The independent artifact build ran from a private archive of the
exact release source. Its developer output is 318,160 bytes,
reflecting the single path comment above.

The exact task tree, minified artifact and browser driver bytes
also preserve the applicability of the independently verified
full staged ESM, private ESTree and optimizer evidence in the
[S04](../slice04-browser-macro-loader-split/cdc-verification.md)
and [S05](../slice05-browser-estree-bridge-split/cdc-verification.md)
records. The table lists the checks freshly executed for integration.
[Release receipts](evidence/browser-release-685bbe1d/) preserve
prospective commands, config checks, tool and producer pins, and
actual raw statuses and outputs.

AM-05 is done for this local release integration. Project02's
[release checklist](../../../project02-language-toolchain-alignment/arc09-release-0.6.0/arc-plan.md)
still owns the remaining external release gates. Hosted CI on this
exact head, tags and publication remain separate.

The staged prose check passed. The full staged planning whitespace
check returned 2 on four preserved raw-output and literal-diff
locations. The original bytes remain intact.
