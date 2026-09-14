# Dependency and document-route decision packet — partial

Status: evidence-backed alternatives for review; no package adoption, policy
relaxation, document-route acceptance or operator acceptance is recorded.
DB-07 remains open. [Inventory](dependency-inventory.md) and [results](results.md)
separate measured behavior, static source evidence and unfinished reconciliation.

| Alternative | Evidence supporting consideration | Cost / gate / disposition |
| --- | --- | --- |
| Native JSON with explicit Lykn validation | Prior JSON CDC plus new no-grant parser and boundary cases | Numeric fidelity, duplicate-key and source-preservation policy still required; not adopted here |
| Pinned standard JSON/JSONC/streams and YAML value APIs | Permitted export graph closes; warm/cold and permission cases observed | Complete lineage/dev classification and policy decision still owed; YAML value output is not document preservation |
| Eemeli YAML source unchanged | Rich document candidate retained with exact source/package metadata | Direct Node edges and npm build surface; prohibited execution remains gated |
| Upstream browser build | Static upstream build config supplies browser substitutions | Browser targeting does not remove npm toolchain/ancestry obligations; no independently acceptable artifact/route demonstrated |
| Independently maintained Lykn/Deno document implementation or port | Could make the runtime/build boundaries explicit | Design alternative only; requires bounded source/lineage/license/maintenance proof and all 28 Y-14 trials; no implementation authorized by this record |

No compatible document route was established. All 28 Y-14 cases and
D-2609-YNOD remain open. The concrete next decision task belongs to Arc01's
[planned Slice09](../../arc-plan.md#remaining-research-ownership-after-slice04-partial-execution):
finish exact graph/lineage/resource reconciliation; compare these alternatives
under the unchanged no-Node/npm direction; then establish a compatible route
or open the bounded Arc03 design/correction prerequisite before document
execution. That prerequisite must name source home, maintainer/owner, package
and build constraints, original Y-14 coverage and acceptance/re-entry criteria.
It must exist in Git before being called routed. A roadmap promise is not a
compatible implementation, nor does it close DB-07.

File policy also remains a decision: bounded replacement/concurrency/cancellation
observations support evaluating a same-filesystem temp-and-rename approach,
but the current cross-filesystem observation is NotCapable and pending actual
OS evidence. Durability, failure recovery/orphan ownership, mode/link handling
and API error contracts need explicit treatment in the later library work.
Sampled RSS and representative resource runs establish no hard memory guarantee.

All source/compiler fixes remain in their release-owned worktrees; guide/book
corrections retain Arc03 ownership; ADT and representative authoring trials
retain Arc02 ownership. P-04/P-08 require the operator's actual code-shape and
direction judgments. This packet does not supply those judgments or assign a
new library release/repository by implication.
