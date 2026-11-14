# Independent CDC receipts — Arc05 S01

Reviewer: OpenAI gpt-6.1-sol/high, fresh `/root/arc05_s01_cdc` context;
implementer: OpenAI gpt-6-luna/high. Date: 2026-11-13.
Source is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/qualified-adt-core`, commit4998240927909c3abc0172dfef2b56076b19f708,
treeb18e75dc06888a771bd7f3aa92a3c2cb1a7e1dc8. No source mutation.
Root retains planning Git/index/ledger; this directory and the canonical
`../../cdc-verification.md` are reviewer-authored.

## Exact execution context

All five gates ran from the source worktree above, with these explicit exports:

```sh
export DENO_DIR='/Users/oubiwann/Library/Caches/deno'
export XDG_CONFIG_HOME=/private/tmp/lykn-arc05-s01-cdc/xdg
export XDG_CACHE_HOME=/private/tmp/lykn-arc05-s01-cdc/xdg
export NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s01-cdc/npm
export TMPDIR=/private/tmp/lykn-arc05-s01-cdc/tmp
```

The owned directories were precreated before the first build. The absolute M6
evidence directory below was also precreated before make check. DENO_DIR is
existing and warm; M6 independently creates a fresh owned XDG embedded cache.
No cache was deleted. There is no entirely-offline claim: bundle-size stderr
records npm esbuild downloads. Existing astring package-condition warnings remain.

Exact commands, in execution order:

```sh
make fresh-artifacts
./bin/lykn test test/forms/discard-bindings.test.js test/expander/binding-walker-parity.test.js test/expander/lexical-regions.test.js test/expander/reserved-words-parity.test.js test/forms/reserved-binding-output.test.js test/forms/semantic-roles.test.js test/forms/lazy-protected-invocation.test.js test/forms/protected-host-policy.test.js test/forms/protected-host.test.js test/forms/host-reference-lowering.test.js test/forms/browser-host-reference-compile.test.js test/forms/icu-generated-names.test.js test/forms/template-icu.test.js test/forms/icu-parser.test.js
export LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR='/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice01-public-source-discards/artifacts/cdc/m6-evidence'
make check
make check-cited-paths
make bundle-size-check
```

The M6 hook export applied to make check; subsequent citation/size commands
used the five base environment exports and did not need that hook.
Each command's complete stdout/stderr is in the corresponding basename's
`.stdout`/`.stderr`; `.exit` contains the actual numeric command status. Shell
capture saved `$?` immediately and printed the result. All five statuses are0.

| Receipt basename | Observed result |
| --- | --- |
| fresh-artifacts | Release CLI and lang/browser/testing staging rebuilt0 before public tests. |
| focused | Actual203 tests /56steps /0failed:7 discard groups plus13 affected regression files. |
| make-check | Full native gate0; lykn-lang library1201; product1570/67steps; docs482/0failed, generated22files with15skipped entries. |
| check-cited-paths | Final source HEAD:64documents/601historical citations0. |
| bundle-size-check | Fresh current gzip47747bytes; cap81920; baseline27630;0. |

Actual M6 child command/config, source fixture, generated module, stdout/stderr,
numeric status and14 module comparisons are in `m6-evidence/`. Inner strict
public output is62passed/0failed, not an inference from Rust's expected-string
assertion. Every comparison records canonical_equals_embedded=true and
canonical_equals_materialized=true. Child Deno resolves2.9.6. Its config maps
lang/ to the fresh materialized compiler and browser/ to fresh staged output.
The broader make check includes Rust integration/doc results;1201 is the
lykn-lang library population, not the whole Rust test denominator.

## Source and lifecycle records

`source-pin.txt`, `candidate.diff`, `source-initial-status.txt`,
`discard-bindings.reviewed.js` and `source-staged-hashes.txt` preserve the exact
candidate and reviewed product-test bytes. Initial clean state was observed
before any validation; the empty status file was captured after focused tests,
with source unchanged. The staged binding hash equals both canonical and
embedded bytes:cad3be2ebe003fd315c0b577d34a2dfdbb8491d57cb2e3ae82587e992a5d6d2e.

Five direct cmp commands independently returned0 for canonical/embedded
binding.js, classifier.js, compiler.js, expander-core.js, surface-helpers.js.
M6 provides durable comparisons for these and nine other delivery modules.
`source-final-status.txt` and `source-final-pin.txt` record the final readback.

Tool sessions: focused73136 and make-check85488 both completed naturally0;
other commands returned synchronously. No stalled job, TERM or process cleanup
was needed, and no reviewer-owned job remains. No process census or broad kill.

One read-only inventory attempt asked for a nonexistent historical
supplement/README.md; cat returned1. The actual commands.txt, environment.txt,
all Lykn inputs, raw outputs/statuses and owning historical README were then
read directly. This is a path miss, not a software-gate failure. Truncated bulk
reads were recovered with bounded file/range reads as the verification records.
No malformed reader probe, helper-language program, new evidence harness,
archive, dependency, source repair, planning Git/index/ledger change, merge,
push, publication, release or S02 action occurred.
