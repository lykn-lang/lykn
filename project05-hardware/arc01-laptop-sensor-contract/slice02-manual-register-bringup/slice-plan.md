# Slice 02: Manual Register Bringup

> Open bench slice. Use the slice01 bench contract to power the selected
> ICM-42688-P board through Bus Pirate, read identity/status registers, perform
> one configuration write/readback, and record both known-good and known-bad
> signatures. No automation or MCU firmware in this slice.
>
> Current status, 2026-09-03: hardware has arrived and Bus Pirate
> firmware/status evidence has begun. Live first-power and register work remain
> blocked until the updated wiring map and pre-power checklist are complete.

## Goal

Produce the first real component-level evidence for the telemetry IMU path:
from laptop to Bus Pirate to sensor and back. The result should be a small,
trustworthy register contract that later slices can script, port to STM32, and
mine for Lykn embedded-C requirements.

At close, we should know:

- the selected board can be safely powered in the chosen setup;
- the selected bus mode can read a stable identity/status value;
- at least one configuration register can be written and read back;
- at least one intentional failure mode has a recognizable signature;
- the first manual sequence is documented well enough to become a script in
  slice03.

## Preconditions

Do not start live IMU bench work until slice01's physical-arrival gate has
cleared, the Bus Pirate live SPI mapping has been reconciled into the wiring
table, and the pre-power checklist is complete.

Required before first power:

- exact selected board is in hand;
- Bus Pirate 6 and probe cable are in hand;
- wiring/pin table from slice01 is available;
- pre-power safety checklist from slice01 is complete;
- artifact-home decision from slice01 is available;
- current sensor datasheet/board docs are open and cited in notes;
- Bus Pirate terminal access is working.

If any precondition fails, stop and close or defer the affected ledger row with
a concrete re-entry condition. Do not "just try it."

Allowed before hardware arrival:

- reread and annotate the slice01 wiring/safety contract;
- create and maintain the slice02 artifact index;
- prepare transcript filenames and command-sequence notes;
- identify candidate known-bad cases from the datasheet and Bus Pirate docs;
- prepare Lykn embedded-C observation headings.

Not allowed before hardware arrival:

- energizing any device;
- claiming Bus Pirate status from delivered hardware;
- claiming identity/status/config read evidence.

## Scope

In scope:

- Set up the Bus Pirate and chosen IMU board according to slice01's wiring
  contract.
- Record hardware facts before power:
  - Bus Pirate hardware/firmware version if available;
  - selected IMU board name/revision;
  - bus mode and speed;
  - selected voltage/current limit;
  - wiring table actually used.
- Power the IMU through the planned safe path.
- Confirm expected supply/IO voltages as far as the available tools allow.
- Read identity/status registers manually.
- Perform one configuration write/readback manually.
- Optionally perform a minimal data-ready or sensor-output read if it is
  trivial after identity/config success; do not let this expand the slice into
  FIFO/driver work.
- Record at least one intentional negative case:
  - wrong SPI mode;
  - wrong chip-select handling;
  - unpowered sensor read;
  - wrong register address;
  - or another safe, reversible failure selected from the docs.
- Capture transcripts and notes in the artifact home chosen by slice01.
- Produce a command-sequence summary for slice03 automation.

Out of scope:

- BPIO2 or Python/Rust automation.
- STM32 firmware.
- FIFO bringup beyond a tiny optional sanity read.
- Interrupt/FSYNC timing work.
- PPK2 power measurement.
- Lykn compiler implementation.
- Final driver API design.
- Permanent sensor selection.

## Source material

Read before live work:

- `../arc-plan.md`
- `../slice01-procurement-and-bench-contract/closing-report.md`
- `../slice01-procurement-and-bench-contract/ledger.md`
- chosen board documentation from slice01
- ICM-42688-P datasheet/register reference
- Bus Pirate 6 terminal/protocol documentation for the selected bus mode
- artifact-home policy selected in slice01

If slice01's physical-arrival gate has not cleared, this slice can do pre-live
preparation only; it cannot close with live evidence.

## Expected outputs

The close report should contain:

- final wiring-as-used table;
- Bus Pirate version/status details available from the tool;
- board revision/details available from board markings or docs;
- power/voltage/current-limit settings;
- exact manual command sequence;
- identity/status register transcript;
- config write/readback transcript;
- known-bad transcript and diagnosis;
- notes on any surprising behavior;
- slice03 automation seed: commands, expected values, tolerances, and error
  cases;
- preliminary Lykn embedded-C observations surfaced by the manual work.

## Verification

Minimum document/planning checks:

- `git diff --check`
- `make check-cited-paths` if tracked documents add path citations to files
  that must resolve in git

Bench verification:

- Re-run or witness the identity/status read after the first success.
- Re-run or witness the config write/readback after the first success.
- Confirm the known-bad case returns a different, documented signature.
- Confirm all transcripts are saved in the slice01 artifact home.

Evidence should be transcript-based wherever possible. A prose claim such as
"WHO_AM_I worked" is not enough.

## Exit criteria

- The ledger rows all reach a final status with evidence.
- The IMU can be powered without violating the slice01 safety checklist.
- A stable identity/status register read is recorded.
- A configuration write/readback is recorded.
- A safe known-bad signature is recorded.
- The manual command sequence is written clearly enough for slice03 to script.
- Any deviations from slice01's wiring/safety/artifact contract are named and
  bubbled up to the arc.
- The closing report states whether slice03 should proceed with BPIO2, terminal
  transcript replay, or another automation path.

## Design sub-questions

Surface these in the closing report:

1. Did the chosen board make direct component testing simpler or harder than
   expected?
2. Did the first bus mode remain the right default after real traffic?
3. Which values are fixed contract facts, and which are board/setup-specific?
4. Which operations most clearly map to future Lykn syntax: register constants,
   bit masks, typed byte buffers, effects, or transport handles?
5. Does slice03 need BPIO2 immediately, or is terminal transcript automation
   sufficient for the next increment?
