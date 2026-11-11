---
project: project03-language-evolution
arc: arc04-qualified-adts
slice: slice02-existing-adt-correctness
status: closed
version: "1.5"
depends-on: [slice01-contract-and-emission-design]
---

# Existing ADT correctness

2026-11-11: closed with all five PC rows done. Corrected software candidate
`0829e892` has independent runtime acceptance, and the final metadata review of
planning `b61c9968` accepts the retrospective, history and parent handoff.
Source is task-only; release `685bbe1d`, qualified ADTs and later arc gates
remain unchanged. Earlier open/held stages below retain their dated context.

Repair D-2611-NPAT and D-2611-ZVAR in the native and public compilers before
changing ADT representation. This increment preserves flat constructors and
string tags. It does not implement qualified ownership, nominal branding,
import interfaces, a new host contract or either emission experiment.

The operator authorized S02 on 2026-11-11, Autonomous Mode, Luna 6 High CC and
separate Sol 6.1 High CDC. Obvious corrections remain authorized; escalate only
an unresolved design choice or real evidence gap. Source integration and push
are separate from this task.

Source baseline: 685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. Reuse the clean
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering` worktree
on dedicated `codex/adt-pattern-correctness`. Planning remains separate here.
The initial planning base was 4497796690e9694ccb473106bcada57ea2df7fce.

The original balanced controls remain byte-preserved under Project07 Arc02
S01 `artifacts/at02/independent-original/{nested-control,zero-control}`.
The nested control must print `7`; the zero control must print
`["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]`.
Original native/public failures and pins remain historical evidence.

Implement an ordered recursive pattern plan for the existing constructor,
object, literal, binding and wildcard AST. Subject evaluation is once; parent
checks precede child extraction; each demanded field is captured once and
checked before its user binding is introduced. Wildcards do not read fields.
False guards continue to later clauses. Preserve lexical scope, completion
and control transfers without adding a function boundary to statement paths.
Use the same semantics for shared `if-let` and `when-let` paths, retaining
their existing nullish root-binding policy. Null/undefined nested constructor
subjects are mismatches, while raw string-tagged objects remain compatible.
Both zero-field declaration spellings produce tagged object constants.

Field once/order/no-read guarantees apply to registered constructor fields and
structural object patterns. The public unregistered-constructor compatibility
fallback retains its historical positional `Object.values` mapping and reads;
it is not a field-selective interface. Test its retained flat-binding behavior
and record that limitation rather than silently changing enumeration semantics.
Qualified/imported constructor resolution belongs to later increments.

The first focused runtime run exposed native sequence-expression grouping:
`emit_seq` printed an ungrouped comma expression inside conditions. Iteration01
adds the necessary bounded codegen correction and grammar-context regressions,
retaining the simple ordered capture rather than a value-tautology workaround.
All five criteria remain; this is an in-scope implementation dependency, with
its actual failed attempts retained in the close record.

Iteration02 consolidates early independent draft-review findings: public bare
zero-variant conditional dispatch and new field temporaries capturing names
introduced by later macro expansion. Reuse/generalize the existing private
completion-identity finalization so new field names are assigned against the
complete expanded unit, with actual macro-capture regressions across affected
routes. This remains compiler-internal hygiene, not S03 nominal ADT identity.

The full gate exposed an existing protected-exit interaction: the old protected
match fixture's second wildcard returned `"bad"`, previously unreachable because
of incorrect false-guard continuation. Correct continuation reaches that return
and reveals the baseline function-prefix early-return bypass of tail checks.
Independent source triage identifies existing ownership in Arc01 S04 I4,
CV-03, with CV-04/CV-05 and CI-04 composition open. S02 adds no new bypass
mechanism and does not implement that separate completion work. Retain the
original failing source/output/gate receipt. The replacement finite regression
uses a traced fallback and tail `7` to prove guard continuation and retained
tail postcondition execution. PC-03 acceptance must disclose this limit; it
cannot claim general checked early-return correctness or cross-backend parity.

Independent exact-pin review of initial candidate `7b09a4e` found RV-01: the
separately embedded public compiler payload still contained baseline source.
Iteration03 synchronizes the actual packaged payload and requires fresh-cache
materialization/delivery regressions before S02 acceptance. Original CC gate
results are attested prose; unavailable raw historical logs are explicitly
distinguished from newly captured final and independent receipts. All PC rows
remain open. This correction does not claim a same-version warm-cache upgrade
or content-addressed cache redesign.

Use product tests and exact runtime oracles for positive and discriminating
negative cases, all affected routes, evaluation order, falsy payloads and name
hygiene. Replay the unchanged original controls on both current pipelines.
`make check`, committed-HEAD cited-path gate and browser size gate close the
candidate only after independent verification. New probe/orchestration helpers
must be Lykn; no Python/Ruby/Fennel or handwritten JS research helpers.

The ordinary Git diff, test harness and command receipts suffice. A bounded
`artifacts/` log set is permitted only to retain original-control replay,
nontrivial runtime observations, failed attempts and full-gate outcomes that
the closing report otherwise cannot make reproducible. No copied source
archive, per-command inventory or separate reconstruction exercise is needed.

CC reports proposed-done with exact commits and all five PC rows. CDC checks
the actual diff, replays the original witnesses, exercises discriminating
tests and verifies every row before root closes QA-02 at the arc. S03 remains
later work; this repair does not establish qualified or nominal semantics.
