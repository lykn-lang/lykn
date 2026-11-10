# S22 independent verification

Luna 6 High implemented the bounded spread route. Sol 6.1 High
independently reviewed the frozen source and owns the final evidence
walk. The accepted starting point was `b1937050`, with the release
worktree at `6c9dbd5c`. Source changes stay on the dedicated task branch.

## Historical controls and corrections

- [Old baseline](artifacts/evidence/cc/old-387617f3) at `387617f3`
  passed 48 of 53 native tests, with five predicted spread reds.
  Public retained 11 passing parents and 42 passing steps alongside
  its predicted failures. Ordinary F2 produced `[1,2,3]` plus LF on
  both actual routes. Old F3 native printed malformed code without
  runtime execution. Public F3 returned its existing checked error.
- [First product attempts](artifacts/evidence/cc/before-native-oracles-1abb8946)
  at `1abb8946` passed 44 of 53 native tests without the required
  scoped DENO_DIR. The actual pinned retry passed 51 of 53. It still
  lacked full prospective ancestor/cache evidence. The two remaining
  assertions disagreed with actual printer parentheses and the
  pre-existing unused-binding warning. Current artifact bytes and
  strict traces supported the narrow oracle repair.
- [Provisional test attempt](artifacts/evidence/cc/interim-8bc43a41)
  retained a no-run only result. It preceded the fixed correction
  handoff, used the first test body and temporarily changed the frozen
  malformed input. Final `a1137ea2` restored the input and passed
  native 53/53 and public 15 tests with 43 passing steps. The first
  public run lacked separate receipt files. An already launched
  repeat also passed and captured them. [Both public runs and the
  first Make formatting failure](artifacts/evidence/cc/a1137ea2) remain.
- `23f2bf00` changed three actual Rust emitter formatting hunks.
  [The second normal Make run](artifacts/evidence/cc/23f2bf00/full-make)
  passed release build and Clippy, then identified seven native test
  formatting hunks. The three numbered refinements and the separate
  provisional attempt remain visible. None changes the frozen
  shared Lykn fixtures or accepted runtime expectations.

- [Workspace formatting checks](artifacts/evidence/cc/iter03-format)
  identified one additional assertion wrapper before the final
  freeze. [The complete retry](artifacts/evidence/cc/iter03-format-retry)
  passed. Final `487ebdbb` changes only formatting in the native
  test, including a trailing macro comma. The frozen package bytes
  are identical to the original product freeze.
- [First Make at the final freeze](artifacts/evidence/cc/487ebdbb-unpinned/full-make)
  passed release build, Clippy, formatting and source lint. The
  launcher unset the required DENO_DIR. Four Rust integration tests
  failed when native macro expansion tried to fetch `astring@1.9.0`
  and received DNS errors. The normal Make rerun retained the same
  command and source under the required pinned cache and fresh roots.

## Independent row walk

CC returned exclusive task and build ownership at the clean final
freeze and proposed all four criteria. The reports below use the
canonical ledger order. The provisional commit used the original
test message. The cache-omitted Make ran at `487ebdbb`. Both points
are established by Git and the actual launch, rather than the
actor's approximate handoff wording.

The [independent focused runs](artifacts/evidence/cdc/final-487ebdbb)
built the native test target and CLI, then pinned them before direct
execution. Native passed 53 of 53. Public passed 15 tests and 43
steps, with no failures. Each runtime uses the actual generated
module and strict Deno 2.9.6. Scoped argv, named configuration
absence checks, raw streams, producer hashes and statuses are
retained. The direct native producers were unchanged across use.

- **OS-01.** Shared F1 has byte-identical native and public stdout.
  The getter and original receiver are retained, iteration reaches
  done before the later argument, iterator throw preserves exact
  error identity and skips later effects. Source return skips the
  final invocation. Native and public strict stderr are empty.
- **OS-02.** The full modules show own numeric slots and length in
  a null-prototype object, native for-of, a stable void 0 lexical
  receiver, and the existing lazy typed provider only when the
  selected route needs it. The receiver-only lifted-key case
  returns before the ordinary bracket spread call, with no support
  in its own module. The fourteen named S18 optimizer-input files
  are byte-identical, with the same eight distinct hashes as all
  fourteen recorded original optimization invocations. The
  [S18 optimizer evidence](../slice18-ordered-member-calls/cdc-verification.md)
  applies to those exact inputs. This slice measured no new bundles.
- **OS-03.** The three exact old mixed-spread holds now produce
  complete native and public modules in the admitted routes.
  F2 native JS, kernel JSON, public JS and strict stdout match
  their own old bytes. F3 native exits 1 with empty stdout, the
  recorded separate unused-binding warning and exact `2:11`
  spread diagnostic. JS and DTS are absent. Public returns
  `Error` with the same message and null output. F3 ran no
  generated program. Unrelated warnings remain owned by analysis.

- **OS-04.** The separate normal Make passed release build, Clippy,
  formatting, source lint, all Rust suites including 1,167 library
  tests, 1,494 JS/Lykn tests plus 67 steps, and 482 documentation
  tests. Standalone citations passed 64 documents and 601 historical
  citations. The copied task binary and release-profile artifact both
  hash to `7a1fb0f0943a4e7ac37183a7a68bd81e1f01672167cb27e3adc98802cacf0c00`.
  The whole freshly materialized package tree matches the tracked
  mirror. Canonical, mirrored and materialized expanders match.
  The [CC final Make and citations](artifacts/evidence/cc/final-487ebdbb)
  independently preceded this replay.

During CDC archiving, five citation receipt files were briefly copied
under an untracked task-root directory. Their bytes were moved to
planning and checked against the originals. Only owned empty
directories were removed. No tracked inputs changed. Final task
status is clean. The post-Make output shows the earlier untracked
directory, and the separate final-status receipt shows its removal.

Accepted `487ebdbbae1758228f81383210eba419d64cc8ed`, tree
`05b5aa7a52cca1a32e65c5bd378c3a24ac12f5a7`, on the dedicated
task branch. OS-01 through OS-04 are done. Release remains
`6c9dbd5c`.

## Remaining ownership

The bounded I3 checkpoints cover S17 lexical calls, S18 static
members, S19 computed receivers, S20 private value naming, S21
simple and literal-string `+=` writes, and S22 mixed argument
spread. Lifted direct eval and dynamic compound keys remain explicit
design holds. Direct eval depends on the actual callee Reference
before argument evaluation. A saved callable would make it indirect.
The existing [S21 probe](../slice21-ordered-assignment-references/artifacts/evidence/preliminary-reference)
observed the pinned engine reading one property and writing another
after the second object-key coercion in a compound assignment.
These holds carry no claim about successful compilation. Other
operators and special references are outside the proven subset.
CV-04 and CI-04 stay open. I4 checked exits, finally/deferred/async,
composition and S07/S08 review retain their prior owners.

DD-37 measures the whole browser compiler separately. The
[root's checkpoint](artifacts/evidence/dd37-1abb8946) reports
44,345 gzip bytes with the fixed same-platform script, 16,715 above
the historical 27,630 and 11,595 above the +5,120 allowance.
The measured `1abb8946` package tree equals the final package tree.
The size budget and hosted rerun remain open.

Scoped prose and source whitespace checks pass. The full staged
evidence diff check exits 2 on original raw whitespace and blank EOF lines.
