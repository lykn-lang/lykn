# Slice 01: Procurement and Bench Contract - Ledger

Planning-only slice. Select the first arc01 hardware kit and define the bench
contract for live IMU bringup. Do not energize hardware in this slice.

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Exact first-order arc01 purchase list selected, limited to Bus Pirate 6, probe cable, one ICM-42688-P board, and minimum wiring/header materials | closing report includes item table with vendor/source links, quantity, role, and buy/defer rationale | serious | arc01 A-1 | open | | no whole-project cart sprawl |
| F-2 | Exactly one first ICM-42688-P board selected, with alternate dispositioned | closing report names selected board, rejected/deferred alternate, and reason tied to pin exposure/docs/availability | serious | arc01 G-1 | open | | MikroE preferred unless evidence says otherwise |
| F-3 | First bus mode selected or blocked with concrete reason | closing report states SPI-first/I2C-first decision, board jumper requirements, and re-entry if blocked | serious | arc01 G-2 | open | | default bias is SPI-first |
| F-4 | Wiring/pin table complete for the first live test | table maps Bus Pirate lead/pin to IMU board pin, signal, direction, voltage, and notes | correctness-grade | arc01 A-1/A-2 | open | | must be usable without rereading the whole conversation |
| F-5 | Pre-power safety checklist defined | checklist covers board revision, bus-mode jumpers, 3.3 V rail, GND, current limit, CS state, 5 V avoidance, and visual/continuity checks | correctness-grade | arc01 A-2 | open | | no energized hardware in this slice |
| F-6 | Artifact-home policy selected for slice02 bench materials | closing report names where transcripts, captures, logs, photos/sketches, and notes live; classifies tracked vs scratch | serious | arc01 G-4 | open | | tracked docs must not cite unresolved scratch paths |
| F-7 | Slice02 first-test checklist written | closing report lists slice02 preconditions and first commands/observations to attempt | serious | arc01 slice sequencing | open | | includes hardware-present and docs-present gates |
| F-8 | Current source discrepancies surfaced | closing report names any mismatch between earlier planning notes and current product/docs pages, or states none found | serious | spec-keeping | open | | current source wins |
| F-9 | No live hardware work performed | closing report states no energizing/register reads occurred; no bench transcript is claimed | correctness-grade | slice boundary | open | | preserves slice01/slice02 separation |
| F-10 | Arc/project bubble-up decision recorded | closing report states whether `arc-plan.md` or `project-plan.md` need updates before slice02 | serious | project-management | open | | anti-silent-drop row |

## What Worked

_(At slice close. Patterns that made the slice close cleanly.)_

## Closure

_(At slice close: commit SHA if any, date, verifier, row disposition counts.)_
