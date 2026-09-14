# Operator decision record

2026-09-14. Status: **reviewable recommendations; required choices pending**.
Owner of every decision below: oubiwann. CC authored the recommendations and
does not supply acceptance. Independent CDC remains separate.

Actual prior operator response, from this conversation after Slice09:
“Leave source home unassigned pending design.” This remains the only recorded
source-home disposition. The current instruction to follow Slice08's prompt
authorizes design preparation, not selection, creation, porting or adoption.

The [complete design](design-brief.md), [exact 28-case crosswalk](y14-crosswalk.json)
and [subsequent proof proposal](proof-contract.md) make the choices concrete.

| Choice | Alternatives | Recommendation | Actual response / status |
| --- | --- | --- | --- |
| D1 Boundary | Forbid runtime edges only; forbid new owned runtime/type/test/build Node/npm edges while allowing attributed history; forbid all historical ancestry too | Forbid new owned Node/npm graphs; allow reviewed history and the specifically inventoried existing Lykn compiler toolchain | Pending; existing runtime exclusion continues; no new exception adopted |
| D2 Route and reuse | Value-only workflow; unchanged Eemeli; browser artifact; maintained port; independently authored parser | Bounded Eemeli 2.9.1 attributed-port evaluation with Lykn public API and byte-preserving edit layer; no fallback rewrite if proof fails | Pending; zero candidate evaluation or port work |
| D3 Notices and new-code license | Attributed MIT/ISC reuse with retained notices; prohibit copying and independently author; select new-code license separately | Permit reviewed MIT/ISC source/fixture reuse, retain notices and derivation map; ISC for new focused route code | Pending; source notices are evidence, not operator adoption or legal advice |
| D4 Fidelity/schema/value | Exact supported-edit preservation; comment-preserving normalization; value rewrite; schema/profile alternatives | Exact no-op and zero unrelated-byte changes; YAML 1.2 core default, separate 1.1 profile; graph separate from strict recursive/JSON conversion | Pending; proposed golden bytes are not observed output |
| D5 Resource/file policy | Explicit bounded profile with visible limits; unbounded convenience; overwrite/conflict/metadata/durability alternatives | Initial 1MiB/2MiB profile and counters; cooperative cancellation plus external stops; cooperating writers only, no symlink/cross-device fallback, no crash-durability claim | Pending; package limits/cancellation still need proof; all 36 unavailable cells retain re-entry |
| D6 Source home | New focused lykn-patch repo; compiler package; mycelium package; operator-specified existing home | Proposed lykn-patch/yaml at /Users/oubiwann/lab/lykn/yaml, initial main, under separate later creation scope | **Unassigned pending design**; no reservation/creation; actual selection and later repository proof owed |
| D7 Maintenance/build/release ownership | Operator accepts all three roles; operator names another willing owner; no maintenance/adoption | oubiwann accountable for maintenance/build/release decisions; bounded assistant work assists only | Pending; no person is assigned without acceptance |
| D8 Next proof scope | Approve bounded staged proposal; revise it; defer implementation | Accept the proof-contract design, then commission a separate exact creation/source open set after CDC | Pending; no source/creation authorization inferred |

For D6, a selection of a proposed new home can record explicit authorization for
its later creation, but this turn will not create it. Actual repository/worktree
identity and clean status are then checked in that later bounded task. Project
number, package naming and release assignment remain unassigned. D4 acceptance
is acceptance of a behavioral design, not Arc02 source-shape acceptance or
P-04/P-08 project direction acceptance.

DR-01 needs D1–D3/D7 responses; DR-04 needs D6/D7 and existing-home proof or
explicit separate creation authorization. D4/D5/D8 also require actual
disposition before design acceptance. Technical artifact completion is not a
substitute. No row depending on an unanswered choice is marked proposed-done.
