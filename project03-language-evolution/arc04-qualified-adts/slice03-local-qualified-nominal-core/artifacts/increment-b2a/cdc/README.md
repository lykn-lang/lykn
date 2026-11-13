# B2a independent CDC HOLD — bcb98482

Independent Sol 6.1 High review, 2026-11-12. Source is the dedicated
`codex/qualified-adt-core` worktree at
`bcb98482fa9b32aa6f58df3e2249123e16924271`, tree
`72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9`. Source implementation is fbd1604d
plus two preserved empty trailer corrections. Source is clean; CDC made no
source edits. `receipts/source-pin.txt`, `source-status.txt`, `source-inventory.txt`
and `binaries.sha256` preserve the actual input. `diff-check.status.txt` is0.
Root owns planning Git/index/ledger and all consequential design decisions.

**Disposition: HOLD B2-LX.** A/B1/IC acceptance is unchanged. No B2b,
OwnerRef/CaseRef, nominal runtime, purity, LC-02–08, S03, release or remote
acceptance follows. B2-ID-NAME remains pending. The full known-bad gate was
not rerun; no independent full, cold M6, copied CLI/browser, citation or size
acceptance is claimed.

## Causal findings

### B2a-R01 — native macro redispatch bypasses actual priority (P1)

`crates/lykn-lang/src/expander/pass2.rs:135–167` retains the old inner loop:
only entry checks lexical bindings and try_desugar; later macro results invoke
any matching macro directly. This predates B2a but violates issued iteration09
step4 and the reviewed recipe. It is not a new native public-style surface
precedence claim: the concrete sugar control uses the existing direct-entry
car/cons policy.

- `fixtures/native-bound-chain.lykn` compiles0 and executes0 printing99.
  A macro returns `(already-bound 1)` after a callable already-bound binding;
  required result41. `native-bound-direct.lykn` compiles0/executes0 printing41.
- `native-sugar-chain.lykn` compiles0/executes0 printing99. Its macro returns
  `(car (cons 41 0))` while a user car macro exists. Direct-entry paired
  `native-sugar-direct.lykn` compiles0/executes0 printing41. Generated ESM
  visibly distinguishes `console.log(99)` from `[41,0][0]`.
- Adjacent actual-entry violation: pass2's multi-genfunc check at83–92 runs
  before its lexical bound check at104–105. `native-genfunc-bound.lykn`
  compiles0. The same ordinary bound call plus unrelated harmless macro in
  `native-genfunc-bound-macros.lykn` exits1 with the unsupported-genfunc
  diagnostic. The ordinary call source contains clause-shaped expressions;
  its runtime is deliberately unclaimed. This is a compile-dispatch witness.

Repair invariant: each same-root result must revisit actual native entry
policy under one original-name/location user-macro budget; unsupported-form
checks apply only when the head really dispatches as that form. Children have
independent budgets. Do not introduce general native classifier precedence.

### B2a-R02 — public supported class defaults crash (P1)

`packages/lang/expander-core.js:1117` passes an Array to replaceChildPath,
whose1127 reads `root.values.slice()`. For an Array, values is the iterator
method, not a child array. The exact embedded mirror has the same defect.

`fixtures/class-default.lykn` through the actual current canonical public
compiler exits1: `TypeError: root.values.slice is not a function`, with full
stack retained. The no-default current positive compiles0/executes0 printing42.
The exact e80 public package extracted with git archive compiles the failing
fixture0 and actual emitted ESM executes0 printing42. Thus the fixture is an
existing valid method-default source, and this is a regression.

Repair invariant: use the existing array-path helper consistently; preserve
member-relative occurrence paths, one expansion per default and private child
identity. No class grammar or default semantics extension is necessary.

### B2a-R03 — named kernel:function header loses parameter scope (P1)

`crates/lykn-lang/src/lexical_regions.rs:194–209` admits kernel:function and
kernel:function* but optional-name detection tests only literal function and
function*. It treats the name as a body item and fails to establish its actual
parameter scope in the new shared resolver/pass2 layout.

`fixtures/kernel-named-function.lykn` compiles0 to `return [7]` and actual ESM
executes0 printing `[ 7 ]`, rather than invoking its callable array parameter.
The ordinary `.lyk` function control compiles0/executes0 printing7. The exact
escaped fixture through the current canonical public compiler also compiles0/
executes0 printing7. The required result is7. Canonicalize the supported
function-family prefix before optional-name selection; retain arrow/lambda
and TypedParameter/BindingPattern grammar boundaries.

## Retained controls and limitations

- Supported kernel-object dynamic alpha/beta macros in
  `native-loop-kernel.lykn` exit1 normally with
  `expansion limit (1000) exceeded expanding 'alpha' at 3:1`. No stack overflow.
  This establishes the current genuine chain limit/original-name control.
- `native-lazy-discard.lykn` compiles0/executes0 printing41; its unused raw
  argument macro is not invoked. The unused throw-shaped body is not claimed
  as a supported execution oracle.
- First loop attempt `native-loop-chain.lykn` is rejected by pass1's circular
  dependency check. Second `native-loop-dynamic.lykn` reaches an unsupported
  surface obj macro expression (`obj is not defined`). Both failed attempts
  remain; neither proves the head-chain limit. The kernel-object attempt is
  the supported replacement and has its own receipt.
- `native-malformed-header.lykn` used throw-shaped macro expression syntax;
  its `Unexpected token 'throw'` is retained as an unsuitable probe, not a
  fourth software finding. Its plain malformed-header control returns the
  established `parameter name must be an atom` diagnostic. No macro-effect
  ordering conclusion is claimed from this attempt.
- `native-surface-chain.lykn` and `native-quote-chain.lykn` were authored but
  not executed. No native bind/quote precedence conclusion relies on them.
- Full source inventory is22 paths and contains no old golden changes. Root
  and CDC read the actual prior CC full log:1546 passed/67steps/0failed, docs482/0.
  Original CC index/closing report1536 remains preserved as an attestation
  reporting error. `cc-denominator-excerpt.txt` and original log digest identify
  the evidence. This is reconciliation of CC evidence, not independent rerun.

## Execution and reproduction

All compiler/runtime witnesses are native CLI calls or Lykn-authored driver/
fixture logic. No Python/Ruby/Fennel/handwritten JS helper was authored. The
compiled driver files are generated output. Candidate native CLI was freshly
checked with `cargo build --release -p lykn-cli` (exit0, no-op build), using the
assigned source; exact binary digest is retained. That first build used owned
/tmp environment paths before they had been created; it performed no new
compilation and succeeded. Direct mkdir established those paths before every
compiler/runtime invocation. This ordering caveat is explicit, not repaired
historical evidence.

Common environment for retained invocations:

```
DENO_DIR=/Users/oubiwann/Library/Caches/deno
XDG_CACHE_HOME=/tmp/lykn-b2a-cdc-xdg
NPM_CONFIG_CACHE=/tmp/lykn-b2a-cdc-npm
TMPDIR=/tmp/lykn-b2a-cdc-tmp
```

Working directory is this CDC directory except cargo/build and Git inspection,
which use the assigned source worktree. Native compiler executable:
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn`.
Native compile command for each stem is `lykn compile fixtures/<stem>.lykn -o
runtime/<stem>.mjs`; kernel-named-function-control uses `.lyk`. Streams/status
are `<stem>-compile.{stdout,stderr,status}.txt`. Public driver compilation and
baseline-public-driver compilation use the same command convention.

Public compile command:

```
deno run --no-prompt --cached-only --allow-read --allow-env \
  --config /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/project.json \
  runtime/public-driver.mjs fixtures/class-default.lykn
```

Its stdout/stderr/status are `public-class-default.*`. The same public driver
compiles class-no-default and kernel-named-function into their explicitly named
`runtime/public-*.mjs`, with compiler stderr/status in matching receipts. It
imports the canonical current package by absolute source path, so project.json's
target lang/ alias cannot redirect this witness. To reproduce the baseline:
create `/tmp/lykn-b2a-cdc-e80`, then run `git archive e80f613b packages/lang |
tar -x -C /tmp/lykn-b2a-cdc-e80` from source. Compile baseline-public-driver,
then run it with class-default using the same Deno options; stdout is retained
as runtime/baseline-public-class-default.mjs and stderr/status are matching
receipts. No source checkout/worktree mutation is involved.

Each materialized ESM executes with `deno run --no-config --no-prompt
--cached-only runtime/<name>.mjs`, streams/status `<name>-run.*`. Numeric status
is captured immediately after each command, not inferred from a wrapper exit.
Native build and diff-check raw files were initially captured under /tmp then
copied byte-for-byte; all witness streams were captured directly here.

## Handoff and correction readiness

Source/build ownership returns clean to root after this HOLD. Root's draft
iteration10 R01–03, including bound-genfunc gating, was independently reviewed
read-only after the findings: its mechanics are source-ready; no competing
architecture or further language decision is needed. This is correction
assignment readiness, not corrected-software acceptance. The next candidate
still requires fresh focused/full/delivery gates and independent review.
