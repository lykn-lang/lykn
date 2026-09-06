# Slice 01: Procurement and Bench Contract - Ledger

Planning-only slice. Select the first arc01 hardware kit and define the bench
contract for live IMU bringup. Do not energize hardware in this slice.

Operator status update, 2026-08-21: the planning/procurement contract has been
accepted for slice02 pre-live preparation, but slice01 remains operationally
open until the ordered Bus Pirate/probe cable hardware and selected MikroE IMU
board are physically present.

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Exact first-order arc01 purchase list selected, limited to Bus Pirate 6, probe cable, one ICM-42688-P board, and minimum wiring/header materials | closing report includes item table with vendor/source links, quantity, role, and buy/defer rationale | serious | arc01 A-1 | done | closing-report Purchase List; worktree close artifact, commit pending operator action | no whole-project cart sprawl; IMU selected but procurement-blocked |
| F-2 | Exactly one first ICM-42688-P board selected, with alternate dispositioned | closing report names selected board, rejected/deferred alternate, and reason tied to pin exposure/docs/availability | serious | arc01 G-1 | done | closing-report IMU Board Decision; worktree close artifact, commit pending operator action | MikroE selected; TDK alternate deferred |
| F-3 | First bus mode selected or blocked with concrete reason | closing report states SPI-first/I2C-first decision, board jumper requirements, and re-entry if blocked | serious | arc01 G-2 | done | closing-report Bus Mode Decision; worktree close artifact, commit pending operator action | SPI-first; I2C deferred |
| F-4 | Wiring/pin table complete for the first live test | table maps Bus Pirate lead/pin to IMU board pin, signal, direction, voltage, and notes | correctness-grade | arc01 A-1/A-2 | done | closing-report Wiring Table; worktree close artifact, commit pending operator action | includes live statusbar confirmation gate |
| F-5 | Pre-power safety checklist defined | checklist covers board revision, bus-mode jumpers, 3.3 V rail, GND, current limit, CS state, 5 V avoidance, and visual/continuity checks | correctness-grade | arc01 A-2 | done | closing-report Pre-Power Safety Checklist; worktree close artifact, commit pending operator action | no energized hardware in this slice |
| F-6 | Artifact-home policy selected for slice02 bench materials | closing report names where transcripts, captures, logs, photos/sketches, and notes live; classifies tracked vs scratch | serious | arc01 G-4 | done | closing-report Artifact-Home Decision; worktree close artifact, commit pending operator action | tracked summaries/index; scratch raw binaries only |
| F-7 | Slice02 first-test checklist written | closing report lists slice02 preconditions and first commands/observations to attempt | serious | arc01 slice sequencing | done | closing-report Slice02 Starting Checklist; worktree close artifact, commit pending operator action | live slice blocked until selected board is present |
| F-8 | Current source discrepancies surfaced | closing report names any mismatch between earlier planning notes and current product/docs pages, or states none found | serious | spec-keeping | done | closing-report Source Discrepancies; worktree close artifact, commit pending operator action | current source wins |
| F-9 | No live hardware work performed | closing report states no energizing/register reads occurred; no bench transcript is claimed | correctness-grade | slice boundary | done | closing-report Scope statement and Ledger Walk; worktree close artifact, commit pending operator action | preserves slice01/slice02 separation |
| F-10 | Arc/project bubble-up decision recorded | closing report states whether `arc-plan.md` or `project-plan.md` need updates before slice02 | serious | project-management | done | closing-report Bubble-Up to Arc01; worktree close artifact, commit pending operator action | no plan text change required before slice02 |

## What Worked

- Current source checks separated documentation suitability from procurement availability.
- The close report records a procurement blocker instead of claiming slice02 can start live.
- The wiring table includes a live Bus Pirate 6 statusbar confirmation gate for SPI pin mapping.

## Closure

Date: 2026-08-21
Verifier: CC self-close; CDC planning verification written; operator hold-open
on physical-arrival gate.
Commit: pending operator action.
Row disposition counts: 10 done, 0 deferred, 0 no-op, 0 open.

Operational status: physical hardware arrival recorded on 2026-09-03. The row
counts above describe the planning contract only; live IMU power remains owned
by slice02.
