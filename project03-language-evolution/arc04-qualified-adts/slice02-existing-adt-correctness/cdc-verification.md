# S02 independent verification

## Initial exact-pin source review — 2026-11-11

**Verdict: candidate 7b09a4e is not accepted. All five PC rows remain open.**
The committed source has a real embedded-payload delivery gap. This initial
pass is source/test inspection only; no independent build, compile, probe,
runtime, full gate or original-control replay occurred. Doer-reported results
are not promoted to independent evidence.

Actual reviewer is the assigned independent Codex Sol 6.1 High context,
separate from Luna 6 High CC, under the operator-selected Autonomous Mode.
Root retains design, coordination and Git ownership. Review assignment is the
slice-root `cc-prompt.md`, iterations01/02, plan v1.3 and five PC criteria at
planning `16b8d0393e5bb2681c49bc68c530ea7ce19d29ba`. Source home is
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch
`codex/adt-pattern-correctness`, reviewed clean at exact candidate
`7b09a4e119fb841f950111217a07d5d8e833c220` against baseline
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`.

### RV-01 — High: the embedded public compiler payload is stale

`crates/lykn-lang/src/expander/embedded.rs:13` embeds
`crates/lykn-lang/embedded/packages/lang`, rather than canonical
`packages/lang`. The candidate changes canonical `binding.js`, `classifier.js`,
`expander-core.js` and `surface-helpers.js`, and adds canonical
`compiler-private-atoms.js`, without updating their actual embedded payload.

Read-only `git ls-tree 7b09a4e` identifies the embedded expander core as baseline
blob `64cd81aeb6cd226574120b9fea7ac419fc8582a7`, while the canonical expander
core is `15eef31e72612da4b157a473a5556f186a5494be`. `cmp` independently confirms
the files differ. The embedded private-atoms module is absent; its canonical
blob is `920b7f7e355dbc88df894838c3e4076c3fb83341`. The committed changed-path
list has no embedded JavaScript paths.

Consequently, materializing this binary's embedded compiler cannot supply the
candidate's complete public matcher, zero-field or private-name implementation.
Canonical-source public tests alone cannot establish behavior of that delivery
route. This is source-proven packaging/route inconsistency, not a claimed fresh
observed runtime result.

Required correction: synchronize the changed embedded modules and new private
module, then review the exact corrected pin and verify actual fresh-XDG
materialization plus affected embedded compiler/runtime consumers. Preserve this
initial candidate and verdict. A matching directory listing alone will not
establish runtime correctness.

### Other source observations and retained draft findings

The earlier read-only preparation located the unchanged balanced NPAT and ZVAR
controls under Project07 Arc02 S01
`artifacts/at02/independent-original/{nested-control,zero-control}`. Their exact
oracles remain `7` and
`["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]` respectively.
Their historical compiler pins, failures and raw evidence remain distinct from
any later candidate replay.

Two draft findings were returned before this commit: public bare PascalCase
conditional patterns were caught as simple bindings, and new public field
temporaries could capture free names introduced by later macro expansion.
The current diff addresses those source mechanisms: constructor atoms reach
recursive dispatch; field atoms carry private identities, use computed member
references, are excluded from user binding analysis, and receive printed names
after macro expansion. The helper remains internal rather than entering the
explicit public expander/mod facade. Public `expandExpr` also finalizes its
completed result. These are inspected implementation observations, not runtime
acceptance of the draft-finding repairs.

The native shared plan now orders null/tag or structural-key checks before
demanded captures, recursively checks children and introduces user bindings on
success. Conditional bindings reuse that recursion, retaining the nullish rule
only for a root simple binding. The protected native matcher reuses ordered
candidate selection with completion lifting disabled there. Sequence output
is grouped at codegen, public zero-field list declarations emit constants,
native null literal classification is admitted, and public guarded-final
catch-all exhaustion now retains a throw. No further concrete lowering defect
was found in this bounded pass. The added runtime fixtures and updated test
expectations were read; their presence is not executed proof.

### Existing protected-exit limitation and corrected finite oracle

Source inspection of baseline `685bbe1d` confirms that `emit_func_single`
already appends prefix statements before its tail-result/postcondition
machinery. A reached prefix explicit return can bypass that machinery without
any match. The enabled native post branch also already omits a return-type
guard; S09's independent review explicitly recorded that narrower behavior.

Correcting false-guard continuation makes the old protected fixture's second
wildcard, `(return "bad")`, reachable. That is a real exposed interaction,
not merely an obsolete output string. It introduces no new exit-check bypass
mechanism. The separate owner remains Arc01 S04 I4, especially CV-03, with
CV-04/CV-05 and arc CI-04 composition open. See the S04 ledger and
`artifacts/incremental-completion-design.md` section4/I4, and S09's independent
verification/SM-04 limits. S02 does not accept general protected early returns
or cross-backend parity and does not implement I4.

The replacement fixture traces the selected fallback and retains tail `7` and
its postcondition effect, with expected `[7,["fallback",7]]`. It can prove that
finite continuation/tail-preservation contract once independently run. It
cannot discharge the existing early-return obligation. Preserve the old
fixture, generated output and actual failed gate evidence where available.

At this review boundary the original full-gate failure is reported in prose;
an original raw gate log has not been supplied to this reviewer. Do not
reconstruct a historical receipt. A later independent run should preserve a
fresh bounded reproduction of the old protected source with actual argv,
source/tool pins, generated output, streams and status, explicitly dated and
labelled as a new reproduction rather than the missing original log.

### Initial row walk and next gate

| Row | Independent disposition at this candidate |
| --- | --- |
| PC-01 | Open. Recursive source changes inspected; exact original NPAT and discriminating candidate runtimes not independently replayed. Embedded route held by RV-01. |
| PC-02 | Open. Canonical zero-field normalization inspected; unchanged ZVAR replay and fielded/zero matching proof remain. Embedded route held by RV-01. |
| PC-03 | Open. Shared ordering, private identities, conditional dispatch and bounded protected oracle inspected. Independent runtime effects, scope, transfers, hygiene and fallback proof remain; I4 limitation remains explicit. |
| PC-04 | Open. No independent focused/full/citation/browser-size gate executed. Corrected committed delivery and explicit execution ownership precede those checks. |
| PC-05 | Open. History and downstream owner triage recorded here; final candidate/evidence review, retrospective and parent bubble-up remain. |

Root owns the corrective assignment and subsequent source/planning commits.
CC retains source/build ownership until the explicit handoff. This reviewer
authored only this verification file under a specific write grant, performed
no source repair, staged or committed nothing, and returns file ownership to
root. Later review must append the corrected candidate's actual evidence and
verdict without overwriting this hold.

## Corrected candidate: independent source and runtime verification — 2026-11-11

**Current source verdict: accept corrected software candidate 0829e892 within
S02's stated limits.** PC-01–PC-04 now have independent reproduced evidence.
PC-05 retains root's retrospective and parent-close bookkeeping obligations;
its final documentary acceptance follows that actual metadata review. This
review changes no ledger or parent status. The initial 7b09a4e hold above is
preserved and is not relabelled as acceptance.

The same independent Sol 6.1 High context received explicit source/build and
execution ownership after CC finished source work. CC's planning handoff is
`e24804da5a9282e43d2fdddf5369e8d5499f989f`. Reviewed the actual initial and
corrected CC reports, iteration03 at `87ad086c`, its retained raw evidence,
plan v1.3 and all five PC criteria, then independently executed the checks
below. This is not acceptance by copying CC's summary.

Exact source stayed clean on `codex/adt-pattern-correctness` at
`0829e892999890e8877dec5e35cd249753e1be5d`. Both scoped source commits
`7b09a4e119fb841f950111217a07d5d8e833c220` and `0829e892` contain the required
contiguous Codex/Billo AI co-author trailers. Their complete 24-path delta was
inspected against `685bbe1d`. Release/0.6.x remains exactly `685bbe1d`; it is
an ancestor with left/right count `0 2`, not an integration claim. No source,
release, dependency, Git index or commit was modified by this reviewer.

Fresh durable evidence is the bounded
[independent receipt archive](artifacts/cdc-independent/receipts-0829e892.tar.gz),
with [navigation, digest and launch limits](artifacts/cdc-independent/README.md).
It records actual argv/cwd/selected environment, source/binary pins, raw
stdout/stderr/status and useful complete generated modules. New reviewer
drivers/probes were authored in Lykn. No Python/Ruby/Fennel or handwritten
JavaScript research helper, extra dependency, subagent or source repair was
used. The reviewer did not require sandbox escalation for these runs.

### RV-01 resolved on the actual embedded route

The corrective diff synchronizes the five changed canonical modules, including
`compiler-private-atoms.js`, into the existing crate-owned include directory.
It leaves package config/lock and version-based cache readiness unchanged.

Independent `cargo test --offline -p lykn-cli --test semantic_roles --test
macro_dependencies -- --nocapture` passed 56 semantic-role and 6 dependency/
delivery tests. Fresh M6 copied the built CLI into an owned standalone cwd,
started with an absent versioned XDG package, triggered macro compilation,
compared canonical/embedded/materialized bytes of all five modules and passed
its two strict public runtime tests against that materialized package. Their
actual per-process receipts are in the archive's `m6/`.

A separate reviewer replay also copied the CLI, triggered materialization in
another cold owned XDG root, compared the five delivered files and used its
actual materialized module path for the unchanged original public drivers.
Thus source-tree canonical imports alone are not the delivery oracle. This
resolves RV-01 for fresh materialization. Existing same-version warm caches
remain version-sentinel based; content invalidation was neither implemented
nor accepted by this slice.

### Original controls and discriminating runtime behavior

The exact balanced original NPAT/ZVAR files and public probe copies were
digest-compared with Project07's byte-preserved evidence. The NPAT digest is
`2fc3df55b4034c966295f5f02dcf922938ebf9694c5ab8cc46c84c4d495cd3a6`.
Default and stripped native compilation/run, strict canonical public, and
strict cold-materialized embedded public each produce the actual frozen
outputs: NPAT `7` plus LF; ZVAR
`["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]` plus LF.
That is eight passing original-control runtime conditions, with their compile
and driver stages separately recorded. Replay02 has 25 recorded cells: cold
trigger compile/runtime, eight native compile/runtime cells, twelve public
driver/compile/runtime cells, and old-protected source/compile/runtime.

Strict canonical public runway and semantic-role verification passed 26 tests
and 43 steps. Together with native focused checks and M6, the actual tests
exercise nested constructor/literal/object success and rejection; null/missing
subjects; false/null/undefined and false/0/empty payloads; zero-field declaration
and matching/conditional forms; selected bound-value guards; false-guard
continuation; final guarded wildcard exhaustion; clause-local scope; direct
statement, consumed/value and finite protected routes; return/loop transfers;
and registered/object field effects. The exact traces reject premature inner
reads, repeated demanded reads and wildcard reads.

The macro fixture passes direct statement, value, protected, if-let and when-let
routes while macros read outer `patternField__gensym0/1` values and invoke a
user macro named `patternField__private`. Its outputs preserve outer 90/91,
actual payloads 5–9 and macro value 42. Source inspection verifies opaque
identity metadata survives into computed references, binding filters exclude
only marked atoms, final names see the fully expanded unit and public
`expandExpr` finalizes its returned result. Private helper exports do not enter
the explicit public facade. These conclusions use both runtime observations
and the actual metadata/finalization source, rather than prefix spelling alone.

An additional reviewer Lykn probe passed native default/stripped and strict
canonical/materialized public routes with the same exact output:

```text
["kept",["null","false","undefined","null-mismatch",null],[7,99],["get",true],[1,"after"]]
```

Its constructed `first-name`/`other-value` fields verify normalized registered
extraction; root literal conditional checks distinguish null/false/undefined
from a mismatch; a false-guard clause does not leak its binder; the getter
throws once and preserves exception identity; nested statement matching keeps
continue/break targets. All four outputs were byte-compared. It supplements,
rather than replaces, the committed product fixtures.

The protected finite fixture was deliberately changed and independently
checked: it now traces fallback and checks tail 7, yielding
`[7,["fallback",7]]`. The exact old fixture was separately read from baseline
Git, compiled unchanged at the candidate and freshly observed as `["bad",[]]`.
This substantiates the source-only I4 triage above without reconstructing CC's
missing original raw gate log. Arc01 S04 I4/CV-03, CV-04/CV-05 and CI-04 retain
that early-return obligation. No general protected early-return or
cross-backend parity claim is accepted. The public unregistered flat-pattern
test separately retains output 13 under historical `Object.values` enumeration;
the selective-read guarantee remains limited to registered/object patterns.

### Required full gates, failed setup and actual pins

The first independent `make check` exited 2 at
`npm_dry_run_produces_expected_file_list`: inherited `/Users/oubiwann/.npm`
cache writes failed with npm errno -1. Raw failure remains in
`receipts/full-make/`. No product assertion or source changed. The entire gate
was repeated with owned `npm_config_cache=/private/tmp/lykn-s02-cdc-0829/npm`;
`receipts/full-make-owned-npm/` records exit 0. Normal syntax/lint, build,
Clippy/format and complete Rust/public/Lykn/docs stages ran. Actual reported
populations include 1,170 language unit tests, 1,500 corpus tests plus 67 steps,
and 482 documentation blocks. Documentation was not run redundantly outside
the required full gate.

Fresh committed-HEAD `make check-cited-paths` exited 0 for 64 documents and
601 retained historical citations. Fresh `make bundle-size-check` exited 0:
baseline gzip 27,630 bytes, current 41,349, delta +13,719, within the 80 KiB
budget. Its actual stderr retains the existing astring package-condition
warning and the tool's esbuild metadata download line; neither is erased or
reported as an empty-stderr run. No dependency files changed.

Deno is 2.9.6; Rust/Cargo are 1.97.0. Focused Cargo built the debug CLI before
direct use. Its copied replay executable and standalone copy hash
`1835fdd00e071d32d70b4b49d370fdc06573412873f2789ba3aaf026521cb88c`.
The full gate's release and installed binaries both hash
`d2319c8a27d987a0aa781eeb2b27eeb988f737629ce1208cefd5f3e1af4bdfc5`, matching
CC's independently reported release digest. Build profiles are distinguished;
all refer to the same unchanged source candidate.

Reviewer helper drafting errors were corrected before successful replay:
unsupported expression-method syntax, a missing closing parenthesis, and a
first executed import-map attempt that normalized `lang/` incorrectly.
The executed replay failure and new-home success have distinct raw receipts;
the two initial compile diagnostics remain session observations, not invented
archived logs. None is classified as a product regression. No prior failed
candidate, original research evidence or historical verdict was overwritten.

### Corrected row walk and remaining documentary close

| Row | Independent current disposition |
| --- | --- |
| PC-01 | Verified; supports done. Unchanged NPAT prints 7 in all four routes, with committed and additional nested negative/literal/object/effect controls. |
| PC-02 | Verified; supports done. Unchanged ZVAR prints both object constants in all four routes; zero matching/conditional and fielded callable behavior survive. |
| PC-03 | Verified within explicit limits; supports done. Shared recursion, ordered captures, guard continuation/exhaustion, scope/transfers, normalization, root conditional literals, private macro hygiene, direct public expandExpr and delivered public route pass actual runtimes. Unregistered enumeration, same-version warm cache and separately owned I4 remain disclosed. |
| PC-04 | Verified; supports done. Fresh focused/runtime/full/citation/browser gates and actual pins pass, preserving the npm setup failure and complete retry. No doer-only gate is used as independent proof. |
| PC-05 | Handoff/evidence verified; documentary closure pending. Both scoped source commits, CC planning handoff, this independent record and bounded raw evidence preserve history and owners. Root must still author the retrospective and accurate arc/project bubble-up, then obtain the requested metadata consistency review. |

No unresolved product finding remains for corrected candidate 0829e892.
This is slice-source acceptance only: no release integration, qualified/nominal
ADT feature, emission experiment, production strategy, book/human or higher
arc/project acceptance follows. Root owns ledger changes and the remaining
documentary close. The reviewer returns exclusive source/build and review-file
ownership now; no staging or commit occurred.
