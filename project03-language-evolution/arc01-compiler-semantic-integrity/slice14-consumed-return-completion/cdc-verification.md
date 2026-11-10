# Independent verification of direct consumed returns

Accepted 2026-11-10 by Sol 6.1 High CDC after Luna 6 High CC
returned clean exclusive task, index, build and raw ownership.
CC proposed CR-01 through CR-03 done within the finite route,
and held CR-04 for this separate replay.

Exact task `84bc88b6f99c421b5251bde0ae58a8422d93f7b2`, tree
`5b77022a16ab104876b751428edc6dca37646cfb`, clean on
`codex/completion-value-flow`. Exact delta from `31893710`
is five production/docs paths and six fixture/test paths.
No public API or host/runtime dependency changes.

| Row | Disposition | Independent evidence |
| --- | --- | --- |
| CR-01 | Done | F2 explicit return of a consumed do keeps continue/break in the actual loop. Its exact trace proves loop update, selected arm and eventual function tail. Existing pure ternary and no-else statement forms remain. Public no-else consumed-tail diagnostic and grouped declarations before bare return pass separately. |
| CR-02 | Done | F1 returns the explicit early value and an ordinary selected value with subject/guard once per call. F3 catches the exact guarded exhaustion error. Complete modules show the shared ordered pattern/guard candidates and direct clause returns. |
| CR-03 | Done | F4 returns from the actual named function after fixed-point macro expansion, while the genuine nested function keeps its own return. The untaken alternate has no effects. Existing protected/legacy, bound call, statement match and prior semantic-role controls remain green. |
| CR-04 | Done | Independent grouped no-run, explicit CLI build, direct native 26/26, public parent 24 steps and seven separate controls all pass. Full normal Make, standalone citations, exact scope and fresh materialized package comparison pass. |

All eight current runtime children exit 0 with exact JSON plus
LF and empty stderr. Native checks and strict compiles exit 0,
emit JS and leave no DTS for these unexported fixtures. The eight
generated modules match their respective CC modules byte for
byte. [Complete fixture comparisons](artifacts/evidence/cdc/84bc88b6/fixture-comparisons.txt),
[native modules and child receipts](artifacts/evidence/cdc/84bc88b6/native-fixtures/)
and [public modules and child receipts](artifacts/evidence/cdc/84bc88b6/public-fixtures/).

[Full normal Make](artifacts/evidence/cdc/84bc88b6/make/) exits 0
with Clippy, format, 1,166 native library tests, 1,487 JS/Lykn tests
with 48 steps and 482 docs cases. [Standalone cited paths](artifacts/evidence/cdc/84bc88b6/cites/)
exit 0 for 64 documents and 601 historical citations. Independent
runs use fresh per-gate /private/tmp TMPDIR, XDG and npm roots,
fixed DENO_DIR, Deno 2.9.6 and Rust/Cargo 1.97.0. There were 124
exact config names observed absent before their applicable runs.
Normal Make uses ordinary PATH with test-only overrides removed.

The focused CLI, runner and Deno pins match before and after
direct execution. The full Make changes the debug CLI pin after
focused execution. [Actual post-Make pins](artifacts/evidence/cdc/84bc88b6/post-make-pins.txt)
identify byte-equal task release and installed binaries at SHA-256
`a5376c8ac8d46cbc7509e7331ed4e7e9be151bbfd461d247ace7907963ee6bcd`.
The [fresh materialized package](artifacts/evidence/cdc/84bc88b6/materialized-byte-check.txt)
matches embedded source, and the changed expander matches its
canonical, embedded and actual cache copies.

## Baselines, refinements and gate limits

- [Old baseline](artifacts/evidence/cc/baseline-0a17dda5/) at
  test-only `0a17dda5`, production `31893710`, measured
  native 23/26 and public 21/24 steps with all five then-existing
  independent negatives passing. Native F1 emits a nested
  `return return` and fails execution. Both F2 modules put a
  loop transfer in an IIFE and fail with illegal continue.
  Native F3 passes, while public F3 exits 0 with `["guard",null]`.
  Native F4 uses a bare `inside` reference and fails, while
  public F4 stops before module emission on an invalid expansion
  node. That independent quoted-string loss is NE-C18.
- [Refinement 01 replay](artifacts/evidence/cc/replay-40c37d3d/)
  preserves the same F4 oracle and actual macro region, with
  typed string AST arguments unquoted into the template.
  Native exact F4 and public F4 pass. Public parent is 22/24
  with only expected F2/F3 red. Both old F4 modules still have
  the return inside the generated arrow. No old run is
  reattributed to the corrected source.
- Source `75d286e2` and `1e5203b7` were held on static review
  before any executable gate. [Correction 02](cc-prompt-iteration02.md)
  materialized actual return regions, and its `6e406654`
  focused native 26/public 24 with five controls all pass.
  [Its receipts](artifacts/evidence/cc/focused-6e406654/) remain.
  Corrections [03](cc-prompt-iteration03.md) and
  [04](cc-prompt-iteration04.md) preserve the exact old consumed
  no-else error and actual grouped statement tail conversion.
  Four runtime fixture inputs and earlier assertions stay fixed.
- [Current CC records](artifacts/evidence/cc/current-84bc88b6/)
  retain the first unfiltered Make exit 0 with fresh cache
  isolation unproven because it set XDG_CONFIG_HOME rather than
  XDG_CACHE_HOME. The second attempt exits 2 with 26 runner
  setup failures before any fixture because its evidence
  variable was present and empty. Neither is the final gate.
  The third fresh full run uses both test-only variables unset
  and exits 0. Both cites executions exit 0. Fresh explicit
  materialization and canonical/embedded expander cmp pass.
  Some initial CC outer records state inherited PATH without
  listing it. The independent receipts record actual PATH and
  distinct complete streams.
- Source and planning prose whitespace checks pass. The full
  staged archive check exits 2 on retained raw stream whitespace
  and blank EOF lines only. Raw bytes are preserved.

S14 proves the specified direct returned if/do/match in ordinary
single-clause named functions and the actual finite regions in
those fixtures. Remaining bind/lazy value-prefix delivery,
ordered/reference holds and I3/I4 retain separate owners.
CV-04 and CI-04 remain open. Local release stays at `31893710`.
