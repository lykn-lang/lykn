# Slice 02: Manual Register Bringup - Ledger

First live bench slice. Use the slice01 bench contract to manually establish a
known-good and known-bad Bus Pirate to ICM-42688-P register sequence.

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Slice01 preconditions satisfied before first power | closing report cites slice01 close, selected board, wiring table, safety checklist, and artifact-home decision | correctness-grade | slice sequencing | open | | no live work before bench contract |
| F-2 | Hardware-as-used recorded | closing report lists Bus Pirate hardware/firmware info if available, IMU board name/revision, bus mode/speed, voltage/current settings, and wiring-as-used | serious | arc01 A-1/A-2 | open | | exact setup matters more than pretty prose |
| F-3 | Pre-power safety checklist executed | closing report includes completed checklist from slice01 or a documented equivalent with deviations | correctness-grade | arc01 A-2 | open | | no 5 V surprise |
| F-4 | IMU powered through planned safe path | transcript/notes show power enabled, expected voltage observed or status reported, and no over-current/safety stop | correctness-grade | arc01 A-2 | open | | record current-limit setting if available |
| F-5 | Identity/status register read succeeds manually | saved transcript shows command sequence, register address/name, reply bytes/value, and interpretation | serious | arc01 A-3 | open | | first known-good oracle |
| F-6 | Identity/status read is repeated or witnessed | second transcript or close-report note shows repeat result under same wiring/setup | serious | reproducibility | open | | avoids one-off success |
| F-7 | One configuration write/readback succeeds manually | saved transcript shows register write, readback, expected mask/value, and interpretation | serious | arc01 A-4 | open | | proves write path |
| F-8 | One safe intentional failure case is recorded | saved transcript shows selected known-bad setup/command, observed failure signature, and diagnosis | serious | arc01 A-5 | open | | do not create unsafe fault |
| F-9 | Transcript/artifact index complete | closing report indexes all transcripts/captures/notes according to slice01 artifact-home policy | serious | arc01 G-4 | open | | no orphan bench evidence |
| F-10 | Slice03 automation seed written | closing report lists manual commands, expected values, tolerances, and error cases suitable for scripting | serious | arc01 A-6 | open | | BPIO2 decision can be deferred with reason |
| F-11 | Preliminary Lykn embedded-C observations captured | closing report names observed needs for fixed-width types, masks, byte buffers, effects, or transport boundaries | serious | arc01 A-7 | open | | not a compiler implementation |
| F-12 | Arc/project bubble-up decision recorded | closing report states whether arc-plan/project-plan/design-v0.8.0 updates are required before slice03 | serious | project-management | open | | anti-silent-drop row |

## What Worked

_(At slice close. Patterns that made the slice close cleanly.)_

## Closure

_(At slice close: commit SHA if any, date, verifier, row disposition counts.)_
