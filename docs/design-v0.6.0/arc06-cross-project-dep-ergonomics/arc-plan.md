# arc06 — Cross-Project Dependency Ergonomics

> **Status: ACTIVE — slice-planned 2026-07-21** (the 0.6.0 dive's original
> motivation, resumed with the toolchain now solid). slice01 closed
> (2026-05-12); **slice02 · mycelium re-audit** is the next work (recon-first).
> Originating thread: `design/kickoff-thread.md`; empirical corpus:
> `design/mycelium-bootstrap-issues.md`.

## 1. Capability

lykn projects consume lykn *itself* as a dependency; the canonical downstream is
the **mycelium** project (`~/lab/lykn/mycelium`), the first real project built on
the toolchain. When that integration breaks, downstream users hit hard blockers.
arc06 makes the **consume-lykn-as-a-dependency path work end-to-end** —
external-project scaffold, cross-project resolution, `lykn test`/publish from
outside the monorepo — and delivers **`lykn add`**, the ergonomic
dependency-addition command DD-51 left missing when it banned `deno add` in lykn
projects. **This is what the 0.6.0 dive was originally in service of:** the guide
pass (arc07) cannot document the dependency / external-test / publish workflows
truthfully until those workflows actually work — arc06 is that prerequisite.

The acceptance corpus is mycelium: the arc's class-(b) composition row is a
mycelium-as-downstream end-to-end **scaffold → add → build → test → publish-dry**
demonstration, reproduced at arc scale on the host.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · lang-exports-gap** (Finding D) | `packages/lang/deno.json` exports missing `./mod.js` sub-path; the downstream-resolution fix + a defensive `helpers.js` refactor | **Closed** (2026-05-12) |
| **slice02 · mycelium re-audit** | **Recon-only** (CDC did the static pre-audit — mycelium is Cowork-connected now; the **runtime** pass is CC-run on the host): re-point mycelium at current lykn (it pins `@0.5.2`) + smoke-test against current `release/0.6.x`; disposition **each** of the 14 `mycelium-bootstrap-issues.md` issues as **fixed / partial / open** (with the 0.6.0 arc that fixed it), plus any **new** friction; produce the authoritative open-blocker inventory that scopes slices 03/04 and routes any compiler bugs. No fixes — the ground-truth pass. | **Closed** — CDC-verified 2026-07-22 (a2e9b00; 9 fixed/1 partial/2 open + N1–N4; host reconcile pending) |
| **slice03 · `lykn add`** (registry) | Exact-pinned registry dependency-add (DD-63, promoted): parse jsr:/npm:, resolve+pin exact via **deno-shell**, bare+slash pair from `exports`, idempotent format-preserving `project.json` write, macro axis via `PackageKind`, add-time validate. | **Closed** — CDC-verified 2026-07-22 (f9f9014); host reconcile pending |
| **slice04 · `lykn link`/`unlink`** (overlay) | The dev-only, non-destructive registry⇄local switch (DD-63 §3(a)): git-ignored `project.local.json`, effective-config merge (dist/publish read raw — safety row), build-dir resolution (require-built), lossless unlink. Reuses slice03. | **Detailed** — open set 2026-07-22 (CC-ready) |
| **slice05 · N1 external-test resolution** | How a downstream *test* imports its own built local package — the relative `../render.js` that dangles under the arc11 `target/` model (arc06/slice02 N1). The **A-6 concrete bar** (`lykn test` green from mycelium). | Shaped (from slice02; detail after slice04) |

_Plan late, plan deep: slices 03/04 are shaped, not detailed — the slice02
re-audit produces the inventory they are scoped against (recon-first, per the
arc10 lesson: verify the contract against ground truth before scoping)._

## 3. Dependencies

Consumes arc01's `target/lykn/{build,dist}` layout + `project.json` import
model; arc11's source-only test build (`target/lykn/test/`); DD-51's
tool-boundary decisions (the `deno add` ban `lykn add` replaces). **Acceptance
corpus:** mycelium (`~/lab/lykn/mycelium`, now Cowork-connected — CDC reads and
pre-audits statically, but the toolchain runs only on the host, so the runtime
audit + the arc-close demo are CC-run and attested). It currently pins
`jsr:@lykn/lang@0.5.2`, so the audit re-points it at current lykn first. **Feeds arc07** (the
guide pass — the dependency/publish/external-test workflows arc07 documents
depend on arc06 making them work). Independent of arc14. Must land before arc09.

## 4. Arc ledger

Composition criteria that verify the capability. Class-(b) rows are **reproduced
at arc scale** (the mycelium end-to-end demo), never inherited. Opens here;
per-row walk closes in `closing-report.md`. (A-5…A-7 firm up when slices 03/04
are detailed post-audit.)

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (lang-exports-gap) closed | ptr: slice01 closing-report + cdc-verification | correctness | round-2 | done | Finding-D closing + CDC review (attested) | |
| A-2 | slice02 (mycelium re-audit) closed | ptr: slice02 cdc-verification | serious | arc-plan | **done** (pending host reconcile) | slice02 cdc-verification (a2e9b00) | the ground-truth inventory |
| A-3 | slice03 (`lykn add`) closed | ptr: slice03 cdc-verification | serious | arc-plan | **done** (pending reconcile) | slice03 cdc-verification (f9f9014) | DD-63-backed |
| A-4 | slice04 (external-project path) closed | ptr: slice04 cdc-verification | serious | arc-plan | open | | sized post-audit |
| A-5 | **`lykn add <specifier>` adds a dependency to a project and it resolves** — end-to-end on a fixture project | run `lykn add`; the added dep imports + compiles | serious | arc-plan / DoD (P-6) | **met** (CC-attested; reconcile) | `lykn add npm:astring` → `@1.9.0` exact, resolves (slice03) | reproduce at arc scale on host |
| A-6 | **mycelium builds *and tests* green as a downstream of current lykn** (the composition demo) | host: mycelium → `lykn build` + **`lykn test`** + `lykn publish --dry` green | serious | arc-plan | open | | **A-6's concrete bar = downstream `lykn test` green** (slice02 finding). RED today — **N1** (test's relative `../render.js` dangles under `target/`) → **slice05**. host-only |
| A-7 | every mycelium-bootstrap issue is dispositioned — fixed / fixed-in-arc06 / routed-with-home / documented-only | ptr: slice02 inventory + the routing table | correctness | mycelium report | open | | no silent drops from the 14-issue list |

## 5. Version History

### v1.2 — 2026-07-21 (arc ACTIVE; slice-planned; recon-first)
Resumed as the next 0.6.0 work after arc05 closed. Grounding: `lykn add` does
**not** exist (net-new; the DD-51 replacement); the `lykn new` scaffold is
monorepo-shaped (`config.rs` maps `lang/` to local `./packages/`, which is what
breaks external projects); mycelium is **not** a Cowork-connected folder (audit
is host-run by CC). The April-2026 `mycelium-bootstrap-issues.md` (14 issues) is
largely stale post-0.6.0 (#14 → arc01/11, #2 → 0.5.2, #8 → arc02, likely #5/#7
→ arc03/arc10), so the arc opens **recon-first**: slice02 re-audits mycelium
against current `release/0.6.x` and produces the authoritative inventory before
slices 03/04 (`lykn add` + external-project path) are detailed — the arc10
"verify the contract against ground truth" lesson. Arc ledger opened (A-1…A-7);
`lykn add` flagged for **DD-63** (post-audit). Which-child: arc06 activation.

### v1.1 — 2026-06-28 (round-2 migration)
Added closed **slice01 · lang-exports-gap** (Finding D — a complete
finding→prompt→closing→cdc micro-slice) and `design/mycelium-bootstrap-issues.md`
(its empirical root), surfaced by CC's reconciliation. Status moved from "not
started" to "one closed micro-slice."

### v1.0 — 2026-06-28 (reconstructed)
Capability statement recovered from the dep-ergonomics kickoff thread; arc
seeded, not slice-planned.
