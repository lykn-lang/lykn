# Operator decision record

2026-09-14. **Qualified direction accepted; new-code licence pending;
independent design CDC owed.** Decision owner: oubiwann.

## Actual response and scope

After reviewing the three questions and CDC's recommendations, the operator
quoted those recommendations and explicitly responded:

> I actually like these recommendations and will go with these :-D

The accepted recommendations approve bounded evaluation, not commitment to a
complete port; require translation inventory and feasibility review first;
require idiomatic Lykn and ADTs internally; separate the new-code licence;
accept the initial behavioral proof with provisional limits and only the original
no-op/n=2 edits; and accept the proposed home and accountable ownership with
separate bootstrap review. This is operator evidence from the conversation,
not an independently performed CDC verification of the artifacts.

The earlier response “Leave source home unassigned pending design” is preserved
as history and superseded for home selection by this answer. No repository was
created. The original sealed packet and machine crosswalk retain their
pre-decision snapshot/status; this decision record governs current approval.

| Choice | Accepted disposition | Remaining gate |
| --- | --- | --- |
| D1 Boundary | Approve reviewed attributed ancestry while forbidding new owned Node/npm runtime/type/test/build dependencies; retain the specifically inventoried existing compiler toolchain boundary | Independent graph/provenance proof; no silent new toolchain exception |
| D2 Route and reuse | Approve bounded Eemeli 2.9.1 port evaluation with byte-preserving editing; require idiomatic Lykn and internal ADTs, not a thin Lykn interface over mechanical TypeScript translation | Translation inventory and feasibility review before commitment to the port; separately authorized source scope and independent proof |
| D3a Reuse/notices | Allow reviewed attributed MIT/ISC source/fixture reuse with original notices and derivation tracking | File-level provenance/notice review before actual reuse |
| D3b New-code licence | **Pending by explicit operator choice. ISC is not selected.** Upstream choice does not select our new-code licence | Operator chooses separately before a new-code LICENSE or licensed implementation is authored; do not default to ISC |
| D4 Fidelity/schema/value | Accept the proposed initial proof contract: exact no-ops, zero unrelated-byte changes, explicit graph-to-value conversion and the documented schema/value distinctions | First editing proof covers only original no-op/n=2 cases; broader edits require new design and cases; no implementation capability inferred |
| D5 Resource/file policy | Accept the initial resource/file proof contract and honest visibility/conflict/orphan/durability boundaries | 1MiB input/2MiB output are provisional research limits, not permanent library limits; counters/cancellation/file behavior require proof; all 36 unavailable cells remain |
| D6 Source home | Select future lykn-patch/yaml at /Users/oubiwann/lab/lykn/yaml, initial main | Separate bootstrap review and exact creation scope remain required; actual repository/worktree/branch/status proof follows creation; no creation in this task |
| D7 Ownership | oubiwann accepts accountability for maintenance, build and release decisions; implementation and review may be delegated appropriately | No assistant or upstream project receives an implicit ongoing maintenance duty; future publication still requires its own authority |
| D8 Next proof scope | Accept the bounded staged proposal with translation inventory/feasibility, idiomatic internal design and separate bootstrap review | Independent design CDC and subsequent exact source/evaluation open sets; no full port commitment, production YAML leapfrogging JSON, project number or release assignment |

The source-home selection is conditional authority for the reviewed later
bootstrap process, not permission to execute creation or source work now.
The initial bootstrap's LICENSE path cannot be populated with an assumed
new-code licence while D3b is pending. No additional answer is needed to record
the approvals already supplied; the licence remains deliberately undecided.

Live source inspection confirmed Apache-2.0 in lykn main at `1b74783:LICENSE`
and MIT in mycelium at `e60af9dfef679e9aa83fdcd140a3b283ffa04112:LICENSE`.
These are existing project choices, not selection of this route's licence.
The prior mycelium README's Apache-2.0 label conflicts with its LICENSE and
must not be used to infer the route licence. No licence files were changed.

All DR status cells remain open. DR-01 retains the pending new-code licence;
DR-04 retains bootstrap/actual-home verification; DR-05 retains independent
CDC and later scope gates. The accepted behavioral design does not supply
Arc02 source-shape/ADT execution or P-04/P-08 project acceptance.
