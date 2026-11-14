# S02 refinement01 — valid grouped literal-key emission

Issued2026-11-13 after separate Sol source-readiness approval. Same OpenAI gpt-6-luna/high CC,
separate gpt-6.1-sol/high CDC, Autonomous Mode. This preserves and completes
the entire initial cc-prompt.md assignment and ND-01–09; it does not close or
replace acceptance with a smaller key-only task. Root owns planning Git/index.
Current source is the original49982409 plus Luna's in-progress S02 changes in
the same assigned worktree/branch. Luna retains exclusive source/build ownership.
No candidate has been accepted and no release is changed.

## Source-grounded correction

Root inspected codegen/emit.rs emit_alias_pattern (baseline1382). It currently
writes the alias property key with emit_expr directly. The new grouped zero-name
recognizer admits Number keys, but a negative numeric key cannot appear bare as
a JavaScript PropertyName: it requires computed brackets. This is source-derived
triage; preserve the first actual regression before the writer edit and do not
claim a baseline runtime observation until it executes. Luna has now captured
a clean in-progress-source red: prelude `{[-1]: 7}` is valid, generated
`const {-1: private} = record` fails Deno parsing. The earlier flawed prelude
`{-1: 7}` attempt is retained separately and is not the causal witness.

Add exactly ONE source path to the initial nine: crates/lykn-lang/src/codegen/emit.rs.
In emit_alias_pattern, wrap a Number key with a negative sign (including -0)
in `[` and `]`, emitting the number through the existing expression writer
inside. Existing emit_number already canonicalizes -0 to0; its key control is
property0 preservation, not a claim of an old -0 parse bug or new signed-zero
semantics. Leave number formatting/range behavior, nonnegative numeric and all
other key output unchanged. Preserve
target/default pattern emission, key identity, evaluation and private metadata.
This is a syntax-correct numeric property spelling, not Source discard lowering
in the raw API. Raw writer underscore behavior remains literal as before.

In the zero-name structural recognizer's static alias-key set, include Bool and
Null as well as Atom/Keyword/String/Number: existing writer emits true/false/null
as legal literal property names. This preserves the decision to admit actual
valid writer shapes; no computed expression-key grammar or new semantic feature.

Use the existing new native product-test file, not new test infrastructure:

- Actual grouped all-discard alias key -1, with foreign global_=99 and a source
  object whose -1 getter returns7 and increments a counter, must compile/run0,
  stdout proving99 and exactly one getter read, empty stderr. Preserve the
  pre-edit failure/generated JS and exact source condition.
- Negative-zero alias key preserves property0 and getter behavior; positive
  numeric0, keyword/string keys remain valid. Bool/null alias grouped shapes
  run with actual literal keys and preserve source99/effects.
- Direct raw codegen numeric alias -1/-0 emits valid executable JS while its
  ordinary `_` binding remains literal; this is separate from canonical private
  discard preparation. Add suitable focused assertions in existing codegen
  tests in the newly allowed file and runtime proof in the native test file.
- Malformed key/target shapes still reject; no extension of unrelated catch,
  annotation, assignment, namespace, declaration or optimizer semantics.

## Current scope, intake and return

Source recipe and all nine ND rows remain the initial S02 plan/ledger/prompt.
Read this amendment fully plus the actual key writer/number writer and affected
new predicate/tests. Record actual readback and source state in artifacts/cc/index.md
before dependent edits; capture failed/final condition sources before runs.
The first prompt remains immutable history. Current assignment becomes this
refinement on issue; exact TEN-path commit (initial9 plus emit.rs), no unrelated
source edits. Ordinary in-scope test/oracle corrections remain autonomous.

Finish the full initial proof: native/CLI/finalized JSON and raw API controls,
affected regressions, fresh staged output, one final make check with docs once
and absolute precreated M6 hook, exact-scope/coauthor commit, post-HEAD citation
and fresh81920-byte gzip gates. Source edits after a gate require affected
revalidation; don't run a full gate on an unfinished test population. Capture
actual statuses/counts/cache/warning limits and all prior failed attempts.

Return CC proposed-done with closing report's complete9-row walk, artifact
inventory, bubble-up and both prompt identities, clean source/no owned jobs.
Separate Sol validates before root closes S02 and its retrospective. No S03
advance/merge/push/release/publication/licence/new dependency/remote CI/experiment.

No Python execution or parity exception. No Python/Ruby/Fennel/handwritten JS
research/helper/evidence/orchestration/command logic. New helpers use Lykn;
ordinary Rust/JS product tests and direct native CLI/simple filesystem lifecycle
are allowed. Existing owned S02 artifact/cache homes and all initial constraints
continue; do not reconstruct missing historical source snapshots as originals.
