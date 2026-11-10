# Independent verification of native match clause scope

Accepted 2026-11-09 by Sol 6.1 High CDC after Luna 6 High CC's
actual MC-01 through MC-04 proposed-done return and explicit
exclusive task/index/build/raw handoff. The verification and
archive copies below are CDC work.

Clean task `codex/completion-value-flow` at
`b5c22b63029f394d8a12b8b8afd98ce051420258`, tree
`78369d6fe65a727a90a40e07bef60557bcff5ebb`. The exact delta from
`7b17a784` is nine allowed paths. Four native source files,
Guide 00, the existing native/public test tables and two fixtures
changed. The classifier shares the same grammar and diagnostic
order. The resolver, Pass2 and shadow lint consume one borrowed
clause plan. Public production, binding API and both frozen
runtime oracles are unchanged.

| Row | Disposition | Reproduced evidence |
| --- | --- | --- |
| MC-01 | Done | Exact resolver tags distinguish incoming subject, actual pattern definition, own guard/body references and genuine sibling dispatch. F1 produces [11,22,14] with the second clause's nested match and both ordinary bound calls in the emitted module. |
| MC-02 | Done | F2 produces [7]. Native Pass2 retains the object pattern and expands both the executable guard and body macros. The earlier clause binder named clause-push does not block its sibling's macro. Full native module contains the structural checks, local n, comparison and push. |
| MC-03 | Done | The bound/tagged ordinary-call control rejects phantom pattern sites and retains the original tagged head. The shadow unit returns only the exact first clause's genuine declaration span. The unchanged public compiler passes both fixtures and all 16 shared steps. |
| MC-04 | Done | Grouped no-run and native 17/17, three resolver tests, and public parent with 16 steps pass. Normal unfiltered Make exits 0 with 1,164 native library tests, 1,480 JS/Lykn tests with 40 steps and 482 documentation cases. Standalone cited paths exits 0 for 64 documents and 601 historical citations. |

Both native checks and strict compiles succeed with actual absent
DTS. All four runtime children exit 0 with exact stdout plus LF
and empty stderr. All four generated modules were read in full,
then reproduced byte for byte in the independent runs.
[Fixture comparisons](artifacts/evidence/cdc/b5c22b63/fixture-comparisons.txt)
include separate runtime and module observations. The
[post-Make pins](artifacts/evidence/cdc/b5c22b63/post-make-pins.txt)
identify matching task release/installed binaries at SHA-256
`caebdeafa2feecd60e9bcdccd937df41553767ae53be5bf47de41a3f0ded99db`.
Focused producer pins are byte-identical before and after.

## Earlier conditions and limits

- Original test-only `bd081320` native 15/17, public 15/16 and
  all three private discriminators red. The native resolver controls
  found the false guard BindingDef, the phantom operand BindingDef
  and two shadow sites in place of one. Native F1 produced both a raw
  `do(...)` guard and a bogus nested call, with Deno SyntaxError on
  the guard first. Public F1 failed before module creation on the
  reserved-name walk's false pattern binder. Native F2's module
  showed a literalized object pattern and suppressed sibling macro,
  but Deno first hit its unstripped `kernel.object(key(7))` subject.
  Public F2 passed. [Original actual records](artifacts/evidence/cc/baseline-bd081320/).
- The exact two-fixture successor `8036f562` uses an ordinary
  trace helper and JSON.parse object. Oracles are unchanged.
  Native F1 check/compile 0, strict runtime 1 with actual
  ReferenceError at the emitted sibling call. Native F2 check/
  compile/runtime 0, but actual stdout was `["fallback"]` rather
  than `[7]`. Public 1+16 passes. Both native exact runner tests
  fail their old oracle. The producer hash lines are unchanged,
  while the pin files correctly identify different fixture commits.
  [Isolated baseline](artifacts/evidence/cc/replay-8036f562/).
- Production `e96ab03c` was held on source review before behavior.
  The [second refinement](cc-prompt-iteration02.md) completes the
  isolated guard shadow walk and preserves optional classifier capture.
  The direct-AST shadow-span assertion retains the first test's
  exact predicate. The final source freeze is above.
- Native F1 compile warning at 9:3 and native F2 warnings at
  7:3 and 8:3 for unreachable clauses and 6:4 for unused
  clause-push are byte-identical between isolated old and final
  runs. Their meaning stays with later diagnostic analysis.
  No assertion equates successful runtime with absence of warnings.
- The initial/replay CC records contain real argv, cwd, scoped
  environment and hashes but lack separate contemporaneous named
  config-ancestor checks. Current CC directory/source/pin probes
  also omit some exact named-config checks. No historical preflight
  is reconstructed. The independent runs use separate fresh
  /private/tmp TMPDIR/XDG/npm roots with all 112 exact names probed
  absent, fixed DENO_DIR and pinned Rust/Cargo 1.97.0 and Deno
  2.9.6. [Independent preflight and runs](artifacts/evidence/cdc/b5c22b63/).
- [Current CC records](artifacts/evidence/cc/current-b5c22b63/)
  retain raw command and outer gate streams and the complete S12
  child artifacts. The four inherited native negative cases run
  inside one parent. Their JS file-effect checks are active and
  the DTS field remains an unobserved placeholder.
- Source and planning prose diff checks pass. The full staged
  planning check exits 2 on preserved terminal whitespace and
  blank EOF lines in raw logs. The archive keeps those bytes.

Native clause-local scope is accepted. The original public
reserved-name and nested native kernel-escape failures have separate
backlog owners. General consumed completion, I3, I4, CV-04 and
CI-04 remain open. Release stays at the independently validated
`7b17a784`.
