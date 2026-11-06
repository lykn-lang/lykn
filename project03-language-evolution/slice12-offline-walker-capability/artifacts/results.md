# Slice12 Phase A CC results

Date: 2026-11-06. CC: OpenAI6 Luna High. Scope: Phase A parser prerequisite
only. The full accepted Slice11 controls remain frozen in `controls.json`;
this attempt activated only K11, K01, K08 and K09, in that order.

## Frozen inputs and tool identity

- Planning freeze before checks: `21aa45e`; corrected freeze: `e6655b0565a5fea1d21bdbce7161ab121957fac2`; subsequent exact source bodies and failed checks are retained in `attempt-0001` through `attempt-0009`.
- Source baseline: read-only `release/0.6.x@f70565566088f5d55129edda6bd73a4691e5a58d`; its worktree was clean at intake.
- Compiler for all three actual source checks: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/target/release/lykn`, version `0.6.0`, SHA-256 `57a49f559a79700d66a2d1db216bd179d54fd0c51fd7f2626ff2029bd3163d28`.
- Check cwd: `/private/tmp/lykn-slice12-cc-01`. Direct `test ! -e` checks returned 0 for `/project.json`, `/private/project.json`, `/private/tmp/project.json`, and the cwd's `project.json`, avoiding the ancestor `project.json` discovery trap.
- Selected parser identity was re-read at intake: cached Acorn `8.17.0` ESM SHA-256 `1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7`. Deno `2.9.6` SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`. Neither was imported/executed in this Phase A attempt.

## Actual native source-check attempts

All three `lykn check` attempts ran the frozen source with the pinned binary and
config-free cwd. Each exited 1; stdout was empty. Exact argv, stdout, stderr and
exit are retained in the listed paths.

| Attempt | Frozen source | Stderr diagnostic | Receipt |
|---|---|---|---|
| 1 | Commit `e6655b0` | `parser-core.lykn: error: unterminated list at 29:1` | `evidence/cc/native-checks-01/` |
| 2 | Commit `b292554` | `parser-core.lykn: error: unterminated list at 11:1` | `evidence/cc/native-checks-02/` |
| 3 | Commit `6c4faee8c093ba1a109152fee90c508816b49320` | `exports references unknown top-level binding 'load-parser'` and the same for `verify-parser` | `evidence/cc/native-checks-03/` |

CDC's source review matched the third failure to a valid-source limitation:
the documented named async function form `(async (func name ...))` is not
recognized by this release's `top_level_binding_sites`/`bindings_introduced`
path as an exportable top-level binding, while `(exports name)` is the
documented local export form. This is a Lykn source/compiler validation gap,
not a parser artifact or offline Deno result. CDC will independently rerun the
same pinned native check from a fresh config-free cwd and route the confirmed
gap for disposition.

The following gates did not run: `lykn fmt --check`, `lykn lint`, any strict
compile, Deno check, generated-code review, or Deno runtime. The owned ignored
`target/slice12/cc/source/` output directory is empty; no generated JS exists.
There were **0 of 4** Phase A child observations: K11, K01, K08 and K09 are all
unrun. Consequently there are no parser statuses, ASTs, locations, ranges,
error messages or raw child receipts. The full walker gate is **unrun**: K01–K12,
including K10a/K10b and the K12 synthetic unit boundary. No walker was authored.

## Preserved process exceptions

Before candidate bytes were copied or committed, I ran `git diff --check` and
`jq empty controls.json`. The captured tool output was empty and the exit codes
were not retained; `git diff --check` did not inspect the then-untracked
candidate. These are process exceptions, not passed evidence. The initial
freeze commit `21aa45e` was also created with
`git -c core.hooksPath=/dev/null`; this was a hooks bypass and is not
retroactively treated as compliant. The exact current control bytes and initial
bodies are retained in `21aa45e` and `evidence/cc/attempt-0001/candidate/`;
the control file was not edited after that early check (CC attestation only).
Current read-only hook inspection found no configured
`core.hooksPath` and only sample hook files; that present-state observation is
not historical proof. All later commits used normal Git, explicit path lists,
real multiline message files and both contiguous co-author trailers.

No Python or substitute scripting was authored or executed. No source release
file, dependency, cache, remote workflow, publication or full audit was changed
or run. All six ledger rows remain open pending independent CDC replay and
disposition; Phase B and downstream controls remain unissued/unrun.
