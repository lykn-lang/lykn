# S01 independent design verification

## Initial review — candidate 4bd224fc

**Verdict: not accepted; all five QD rows remain open.** This is a substantive
initial design review, preserved before the consolidated corrective iteration.
It accepts neither the contract nor the emission protocol for implementation
or experiment execution. Explicitly unresolved architecture is not itself an
agent violation; the findings identify source errors and contract/proof gaps
that the final design must resolve. The root coordinator retains PL decision
authority. This reviewer proposes no replacement architecture.

Actual reviewer: the assigned independent Codex Sol 6.1 High context, separate
from Luna 6 High CC. Assignment: slice-root `cc-prompt.md` and current plan/ledger
at `f478eb788159d856d9c32a06486f07bc050d2f01`. Reviewed proposal commit
`4bd224fcd9b4a9354bb1a7950904760b54c33b32`: the
[contract](artifacts/qualified-adt-contract.md),
[protocol](artifacts/emission-protocol.md) and
[contributor report](closing-report.md).

All source locators below refer to the read-only worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/completion-value-flow`, commit
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`. The source remained clean.
This review read actual native/public interfaces and preserved research;
no source write, helper logic, prototype, compile, test, bundle or experimental
execution occurred. Existing tool availability was checked read-only during
preparation, not rebuilt or treated as new layout proof.

## Findings

### RV-01 — High: prelude interoperability and legacy binding compatibility are unspecified

Location: contract:62–100,204–246; QD-01/02/03/05.

The declaration-binding owner rule and generic branding options do not state
how built-in Option/Result values interoperate across independently compiled
modules without a mandatory shared runtime. A fresh prelude owner per compilation
or module evaluation would make common separately compiled APIs reject one
another's values. Built-in compatibility must be stated separately from any
generative user-owner policy; the initial draft contains no such exception.
This is a correctness-grade compatibility obligation, not a request to select
an identity representation in this review.

The actual native prelude has named module paths `lykn/core/option` and
`lykn/core/result` (`analysis/prelude.rs:7–54`). User definitions may shadow
blessed constructors, losing enhancement; registration removes the entire
shadowed blessed type mapping (`analysis/type_registry.rs:43–47,80–86`). The
contract must explicitly disposition that existing policy and distinguish
pre-registered metadata from actual runtime constructor bindings.

There is also a concrete legacy namespace collision to account for:
`test/surface/type_test.lykn:32–41` uses `(type Box (Box ...))` and Pair/Pair.
Adding a runtime type namespace while retaining a same-named bare constructor
cannot silently place both in one binding. The draft mentions migration
collisions generally, but supplies no worked policy for these actual consumers.

Required disposition: identify built-in cross-unit compatibility, user/prelude
shadowing, constructor availability and same-name legacy migration behavior,
with discriminating cases. Root owns those decisions; no solution is prescribed
here.

### RV-02 — Medium: existing host protection cannot protect arbitrary intrinsic captures

Location: contract:148–155; QD-02/03/05.

The draft correctly limits protected-host v1, then offers capturing Object or
Symbol operations “under the existing protected contract.” That existing
facility protects global Reflect and the exact Reflect.apply slot, and forwards
an already evaluated compiler-owned invocation. It does not establish the
provenance or integrity of Object.freeze, Object.defineProperty, Symbol or a
captured callable. The offered path therefore implies authority/guarantees
that the current contract does not provide.

Source authority: `docs/host-contract.md:3–20,35–49`. The final design must name
its actual intrinsic assumptions/mechanism and any separately scoped host
contract decision. It may not describe generic capture as already protected.

### RV-03 — Medium: L2's private bindings do not establish imported public selectivity

Location: protocol:45–58 and C2/C6 at :22,26; QD-03/04/05.

L2 permits static references to private case bindings. Those bindings are
reachable directly only within their defining module. A consumer importing
only the named Label facade cannot refer to another module's private lexical
bindings. Eliminating unused local cases in C2 therefore does not establish
selectivity through the qualified imported public interface exercised by C6.

The baseline implements named runtime imports/aliases
(`packages/lang/compiler.js:27–46`; native `binding.rs:335–379`), not an imported
private-case access mechanism. Freeze the real module boundaries, public and
any generated export/import wiring, and the exact applicability of each
retention claim before execution. Keep local-case removal distinct from
cross-module public-interface proof. This is not a request to choose or add an
export mechanism here.

### RV-04 — Medium: the producer and exact executable comparison remain unspecified

Location: protocol:28–34,36–64,85–92; QD-04/05.

The protocol names consumer families and layout sketches, then defers exact
source bytes, commands and oracles. It also asks to test Lykn-produced modules,
but the pinned compiler cannot produce the proposed qualified forms. The
pre-production gate precedes S03 layout selection, so a concrete account of
which authorized Lykn-authored producer emits each candidate is necessary.
Without it, prototype and integrated compiler claims can be conflated, or the
gate can accidentally depend on the implementation it is meant to select.

The final protocol must identify exact fixtures, producer/lowering path and
metadata inputs, tool/argv/permission details and expected observations, and
state what this prototype can establish versus S04's later integrated modules.
The 24 proposed unique cells and separate replay count are clear; they are not
operator agreement or executed proof. No execution is requested to resolve this
documentary and design dependency.

### RV-05 — Medium: ordinary runtime aliases and member access need worked boundaries

Location: contract:21–46,65–100; QD-01/02/03.

The import-alias and direct-shadow examples are useful, but do not disposition
local value aliases such as `(bind alias Label)`, detached case values, or
computed `(get Label key)` access versus statically resolved Label:Case.
“Use lexical binding kind” is insufficient by itself: current imports carry
ImportLocal markers, not declared-owner interfaces (`binding.rs:335–379`);
ordinary colon access remains a runtime operation. Missing-interface and
unknown-case diagnostics must not swallow valid imported host-object access.

Provide worked source outcomes for those alias/member boundaries and state
which uses retain ADT-specific static resolution and which remain ordinary
runtime operations. This must agree with the chosen metadata and mutation
contract. Surface namespace imports remain banned (`skills/lykn/SKILL.md:442`);
an escaping ADT namespace value is not permission for `import * as` syntax.

### RV-06 — Low: reset-path wording overstates current automatic isolation

Location: contract:108–110; QD-03.

The text says expander-core resets type state “on its path.” The actual reset
is in the explicit `resetMacros` API (`packages/lang/expander-core.js:653–656`).
Normal `expandWithMacroImports` (:2257–2290) does not call it. Meanwhile
`classifier.js:1503,1522` writes the shared typeRegistry. Describe the explicit
reset and ordinary compilation path accurately, retaining per-call isolation
as a requirement rather than implying it is already provided.

## Five-row disposition

| Row | Initial independent disposition |
| --- | --- |
| QD-01 | Open. Approved syntax is retained; runtime alias/member and legacy binding boundaries still need worked decisions (RV-01/05). |
| QD-02 | Open. Root must settle identity, prelude cross-unit compatibility, guard/strip, serialization and mutation/hygiene; RV-01/02/05 identify additional obligations. |
| QD-03 | Open. Baseline map is substantially grounded, but private/imported access, exact metadata API/wiring, compatibility and reset wording need reconciliation (RV-01/03/05/06). |
| QD-04 | Open. Proposed 24-cell count and zero-unused oracles are preserved; exact executable producers/fixtures and applicable public-interface proof are not yet concrete (RV-03/04). |
| QD-05 | Open. Increment ordering and existing API/docs/book/human owners are retained, but the contract/protocol dependencies above remain before implementation. |

The proposal correctly separates approved qualified construction/patterns from
unresolved representation choices, preserves ordinary member syntax and the
namespace-import ban, and keeps reader, guide/book, API audit, Project07 research
and human judgments with their existing owners. These strengths do not resolve
the six findings or close any QA/QD row. The next review must identify the
corrective assignment and exact revised candidate, preserve this initial verdict,
and assess root's actual PL dispositions separately from CC attestation.
