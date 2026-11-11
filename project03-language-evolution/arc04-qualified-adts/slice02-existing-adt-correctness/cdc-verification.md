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
