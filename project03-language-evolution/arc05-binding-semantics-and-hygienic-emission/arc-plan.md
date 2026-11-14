---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
status: active
version: "0.2"
planned-release: unassigned
depends-on: []
related: [arc04-qualified-adts, arc06-adt-modules-and-library-integration]
---

# Binding semantics and hygienic emission

## Authority and outcome

2026-11-13: the operator approves this separate binding arc after the Arc04
S03 reconciliation. The subsequent operator instruction opens
[S01 public Source discards](slice01-public-source-discards/slice-plan.md) for
implementation and independent close only: fresh Luna6 High CC and separate
Sol6.1 High CDC, Autonomous Mode. Root owns planning and serial source/build
handoffs. S02 and later remain roadmap entries; no release action is authorized.

Deliver coherent discard bindings and preserve exact Lykn source identities
through JavaScript emission, without changing property/API names or observable
evaluation. This is general compiler work, supplying the binding prerequisites
for qualified ADTs. It does not implement owner/case metadata or nominal ADTs.

The operator's decisions are binding: `_` discards in binding patterns,
`_value` is ordinary, and distinct Lykn spellings identify distinct bindings.
Keep the existing same-scope collision and public export diagnostics unless a
separate language decision changes them. A discard preserves initializers,
arguments, defaults, destructuring operations and applicable type checks.
Schema fields, property keys, labels and foreign/public names have distinct
roles; no global string replacement or source-name prefix grants authority.

## Accepted inputs and current held work

Consume the bounded acceptances in the
[historical S03 ledger](../arc04-qualified-adts/slice03-local-qualified-nominal-core/ledger.md):
host references, public per-call type state, binding-role validation, lexical
regions, owned native analysis units, both ICU name allocators and native
Source discards. Their original evidence and limits remain authoritative.

Source home is the existing `.worktrees/contract-predicate-lowering`, branch
`codex/qualified-adt-core`, currently clean at
`dba24d4063f34551c30590c884a495c8ca57298f`. The last independently accepted
checkpoint is native discard `759567f9`; release/0.6.x remains `0829e892`.
The public candidate has [R01 HOLD](../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/public/cdc/README.md).
The preserved [iteration22](../arc04-qualified-adts/slice03-local-qualified-nominal-core/cc-prompt-iteration22.md)
was paused before source edits. It is input to BS-01, not an automatically
resumed assignment. The full public21 contract and original failed attempts
remain part of BS-01's acceptance scope; fixing R01 alone is not acceptance.

## Candidate slice roadmap

These are capability boundaries, not implementation-ready assignments or
existing slice directories. Before opening one, inspect current source, finish
its design and size its reading/code/proof packet with correction headroom.
Split further before issue if it cannot fit. Each slice includes implementation,
affected delivery, necessary immediate documentation and independent review.

| Candidate | Useful delivery | Specific prerequisites |
| --- | --- | --- |
| [S01 public Source discard completion](slice01-public-source-discards/slice-plan.md) — active | Restore nested catch-default validation and independently finish the existing public discard contract across canonical/browser/materialized paths | Native759, held publicdba, original21 scope and R01 witness |
| S02 native remaining discard binding forms | Complete native catch/loop/raw-callable/method roles; explicitly resolve grouped all-discard non-atom Bind admission and the existing simple-multi default/rest boundary | S01 stable baseline; explicit consumed-role/API contract before issue |
| S03 public remaining discard binding forms | Deliver corresponding public/browser behavior, preserve already-admitted non-atom discard groups, and explicitly resolve the public simple-multi default/rest boundary | S02's reviewed shared contract; public consumer census, data/schema and private finalization |
| S04 discard-aware declarations | Keep parameters, schema fields and exported declarations consistent with actual discard behavior | S02/S03 semantics; actual TypeScript declaration consumer |
| S05 native compiler-generated name hygiene | Protect remaining compiler temporaries from source, foreign and generated-name collisions | Native discard roles; complete producer/reservation census |
| S06 public compiler-generated name hygiene | Protect corresponding public producers while preserving private object identities and macro transport limits | Public discard roles; complete producer/finalizer census |
| S07 native exact source-binding emission | Resolve binding occurrences and allocate safe JS names while retaining hoisting, TDZ, data/API names, foreign targets and JSON behavior | S05; settled source-name policy; actual native writer scopes |
| S08 public exact source-binding emission | Deliver equivalent behavior through normal/fragment/browser/materialized entrances | S06; same language contract; public lifecycle/consumer census |

The two backends can share a reviewed contract without pretending their
implementation paths are identical. Raw/kernel entrances need explicit
dispositions; they are not covered merely by a Source-language test. No
wholesale catch grammar redesign, general hygienic-macro system, new public
flag or trusted serialized metadata is selected by this roadmap.

BS-02/03 explicitly own the earlier grouped-admission and top-level SIMPLE
multi-clause default/rest limits, including backend differences. This does not
declare those features implemented or select new support semantics. Before
issue, settle the supported contract and acceptance; a justified deferral needs
a concrete follow-up owner/re-entry condition rather than disappearing into
retired S03 history. Public's existing non-atom discard admission is preserved.

The naming direction and unresolved author-readiness details are preserved in
[the owner-unit preparation](../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/b2b-owner-unit-preparation.md)
and [runtime-name draft](../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/b2-native-runtime-name-plan.md).
These are design inputs, not source-ready recipes. In particular, distinguish
early source-owner queries from the later runtime binding/name plan.

## Verification, handoff and limits

The [ledger](ledger.md) carries BS-01–09, all open. Independent acceptance must
cover actual changed consumers, meaningful negative controls, repository checks
and embedded parity. Preserve final-source citations, existing size policy,
cache/network limits, original failures and exact commit scope. Test count
alone is not scope coverage. Arc close verifies composition, not just child
pointers; accepted outputs feed Arc04 activation and Arc06 integration.

Use the existing planning/source homes. Root owns design and planning Git/index;
S01 implementation is Luna6 High with separate Sol6.1 High review under the
explicit2026-11-13 resume; later slices need their own opening. Preserve prior refinement
history; new filenames do not reset exhausted allowances. An iteration refines
one delivery; a new capability receives its own slice.

No source/build/probe/experiment/merge/push/publication/licence/dependency action
is authorized here. Helpers use Lykn under repository guidance; no Python or
substitute helper-language exception. Reader RDEO/RDCL, Arc01 I4 and diagnostic
work, whole-work audits and the separate book/human gates keep their owners.

## Version history

- 2026-11-13 v0.1: Operator-approved planning home for binding work extracted
  from S03; preserve acceptances/HOLD/paused22 and record eight candidate slices.
