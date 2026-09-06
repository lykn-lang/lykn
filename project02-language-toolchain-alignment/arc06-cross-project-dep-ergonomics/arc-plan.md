# arc06 — Cross-Project Dependency Ergonomics

> **Status: CLOSED — GATE GO 2026-07-24 (operator).** All seven slices closed and
> CDC-verified; **all runtime rows reproduced by the operator** on host (runsheet
> Parts A, B, C, C-bis). 0.6.0's founding goal — consume lykn as a dependency,
> end to end — is **met**.
>
> *Was: CLOSE-READY (re-issued) — all seven slices closed and CDC-verified.* slice07's iteration 1 resolved all six review findings
> (`72a1cfd`/`70666d0`); slice06 verified the same day. Arc ledger A-1…A-9 met.
> Gate (GO) is the operator's, after the host reconcile in
> `host-reconcile-runsheet.md`. See the **re-issued** `closing-report.md`.
>
> *Was: "CLOSE-READY 2026-07-22 — all slices closed (02–05), A-1…A-7 met;
> runtime rows reconcile on host; gate (GO) is the operator's." That status
> predated slices 06 and 07; the `closing-report.md` written under it is
> **superseded in part** — see v1.3. (A dangling sentence fragment from an
> earlier partial edit was also removed here.)*
>
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
| **slice04 · `lykn link`/`unlink`** (overlay) | The dev-only, non-destructive registry⇄local switch (DD-63 §3(a)): git-ignored `project.local.json`, effective-config merge (dist/publish read raw — safety row), build-dir resolution (require-built), lossless unlink. Reuses slice03. | **Closed** — CDC-verified 2026-07-22 (`e1c0dd7`); host reconcile pending |
| **slice05 · N1 external-test resolution** | How a downstream *test* imports its own built local package — the relative `../render.js` that dangles under the arc11 `target/` model (arc06/slice02 N1). The **A-6 concrete bar** (`lykn test` green from mycelium). | **Closed** — CDC-verified 2026-07-24 (`54c9099`; guide `42500a9`). Compiler preserves specifiers verbatim (`emit_import`) — zero `lang` change |
| **slice06 · version-consolidation** | Consolidate the crate version to the workspace root; bump `0.6.0-dev`. Release-hygiene prerequisite surfaced by the operator's host-reconcile runsheet pass. | **Closed** (`caeb2e4` source, `1139c42` docs) — CDC verification owed |
| **slice07 · link-registry-specifier** | `lykn link jsr:@scope/pkg@ver <path>` — redirect a *literal* registry specifier (incl. a macro module imported by that literal) at a local **dist** staging, via a resolver Tier-0 exact override ahead of the scheme branch. Closes the runsheet's routed C-bis limitation as a shipped 0.6.0 capability. | **Iteration 1** (`58e22e8` source, `be72c37` docs) — CDC review returned 4 fixes + 1 host question; see `slice07…/cc-prompt-followup.md` |

_~~Plan late, plan deep: slices 03/04 are shaped, not detailed — the slice02
re-audit produces the inventory they are scoped against.~~_ **Superseded
(v1.3):** slices 03–05 are closed. The pattern held and is worth recording:
**every slice after 02 was scoped against recon output rather than the original
plan**, and slices 06 and 07 were not in the arc-plan at all until v1.3 — both
arrived from the operator's host-reconcile pass. Recon-first works; the cost is
that this arc-plan must be re-reconciled at each slice close, not only at arc
close._

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

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.3 — 2026-07-24 (arc REOPENED; slices 06 + 07 added; ledger + statuses reconciled)

**The arc-plan had gone stale against its own slices — this entry is the
reconciliation.** Between v1.2 (2026-07-21) and today, five slices closed and
two new ones were created, and none of it reached this file; the
`closing-report.md` carried the current truth while the plan-of-record still
said "slice02 is the next work." That is the *plan that never changes*
anti-pattern (PROJECT-MANAGEMENT Part VII), and it is why slices 06 and 07 were
invisible at arc scale. Fixed here, and the lesson recorded in §2.

Changes:

- **Status: CLOSE-READY → ACTIVE.** An arc closes when its last slice is
  CDC-closed; **slice07 is in iteration 1**, so arc06 is not closeable. The
  CLOSE-READY status and the `closing-report.md` written under it both predate
  slices 06 and 07 — the report is **superseded in part**, not withdrawn: its
  A-1…A-7 walk stands, but its slice walk is incomplete and its verdict is
  premature. It will be re-issued at the real close.
- **Slice breakdown reconciled**: slice04 `Detailed` → **Closed** (`e1c0dd7`),
  slice05 `Shaped` → **Closed** (`54c9099`), and **slice06 ·
  version-consolidation** + **slice07 · link-registry-specifier** added — both
  already committed, neither previously in the breakdown.
- **Arc ledger**: A-6 and A-7 → **met** (they were still `open` here while the
  closing-report recorded them met); **A-8** (slice06 closed) and **A-9**
  (slice07 closed) added. A-9 is now the row blocking the gate.
- **Removed** a dangling sentence fragment in the header left by an earlier
  partial overwrite.

Which-child-surfaced: **slice07's CDC review** (the review that found the
effective-config regression also found that neither slice06 nor slice07 existed
at arc scale), plus the operator's host-reconcile runsheet pass, which is where
both slices originated.

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
