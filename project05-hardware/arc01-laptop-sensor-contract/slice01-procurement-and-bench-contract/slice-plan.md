# Slice 01: Procurement and Bench Contract

> Planning-only slice. Select the exact first-order hardware, define the bench
> setup, and produce the wiring/safety/artifact contract that slice02 will use.
> Do not energize hardware in this slice.
>
> Operator status update, 2026-08-21: the Bus Pirate/probe cable hardware and
> selected MikroE IMU board are on the way. Keep this slice operationally open
> until the physical-arrival gate is recorded, even though the planning contract
> has been accepted for slice02 pre-live preparation.

## Goal

Arc01 should begin from a known, repeatable, safe component test setup rather
than from a shopping cart and a bundle of assumptions. This slice turns the
operator's candidate hardware list into one concrete first-order kit and one
bench contract for the first live IMU test.

At close, slice02 should be able to start with no ambiguity about:

- which IMU board is first;
- which bus mode is first;
- which pins connect to which Bus Pirate leads;
- how the IMU is powered and current-limited;
- what "safe to energize" means;
- where transcripts, captures, and bench notes will live;
- what hardware facts must be recorded before any result is trusted.

## Scope

In scope:

- Choose exactly one first ICM-42688-P board for arc01:
  - preferred candidate: MikroE 6DOF IMU 14 Click;
  - acceptable alternate: TDK EV_ICM-42688-P.
- Confirm the first-order purchase list for arc01 only:
  - Bus Pirate 6 REV2B;
  - Bus Pirate probe cable set;
  - one ICM-42688-P board;
  - minimum breadboard/wire/header pieces needed to make the setup stable.
- Decide SPI-first versus I2C-first, with a bias toward SPI unless the chosen
  board documentation argues otherwise.
- Produce a pin/wiring table for the selected bus mode:
  - Bus Pirate pin/lead;
  - IMU board pin;
  - signal name;
  - direction;
  - expected voltage;
  - notes or risk.
- Define bench safety and pre-power checks:
  - board revision/part number recorded;
  - jumper/solder-bridge mode selection checked;
  - 3.3 V rail and ground identified;
  - current limit selected;
  - no 5 V applied to 3.3 V-only signals;
  - no floating chip select during first SPI test;
  - continuity/visual checks recorded before power.
- Decide the durable artifact home for arc01 bench materials:
  - terminal transcripts;
  - wiring photos if used;
  - logic captures if produced;
  - exported logs or CSV;
  - per-test notes.
- Write the slice02 starting checklist: hardware present, docs read, pins
  verified, first command sequence identified.

Out of scope:

- Energizing the IMU.
- Running Bus Pirate commands against the sensor.
- Writing BPIO2 scripts.
- STM32 firmware or any MCU work.
- Lykn compiler implementation.
- Final IMU selection between ICM-42688-P and ICM-45686.
- Buying both ICM-42688-P board variants for parallel comparison unless the
  operator explicitly expands scope.

## Source material

Read before closing:

- `../arc-plan.md`
- `../../project-plan.md`
- `../../../design-v0.8.0/project-plan.md`
- `../../../design-v0.8.0/arc01-c-target-research/arc-plan.md`
- `../../../design-v0.8.0/arc01-c-target-research/initial-thoughts.md`
- Current Bus Pirate 6 hardware, logic-analyzer, and BPIO2 documentation.
- Current documentation/schematic/pinout for the chosen ICM-42688-P board.
- Current cart/vendor pages for the specific items selected.

If any current product/source page disagrees with earlier planning notes, the
current source wins and the discrepancy must be named in the closing report.

## Expected outputs

This slice should leave durable planning artifacts in the slice close report,
not just conversational agreement. The close report should contain:

- exact purchase list and vendor/source links;
- selected first IMU board and reason;
- rejected alternate and reason;
- selected first bus mode and reason;
- wiring/pin table;
- pre-power safety checklist;
- artifact-home decision;
- slice02 preconditions and first-test checklist;
- any arc-plan changes required before slice02 starts.

## Verification

Minimum document/planning checks:

- `git diff --check`
- `make check-cited-paths` if tracked documents add path citations to files
  that must resolve in git

Manual verification required:

- Compare the chosen board's documented pinout against the wiring table.
- Compare the chosen board's voltage requirements against the safety checklist.
- Confirm the selected artifact home is tracked or otherwise explicitly
  classified as scratch, with a reason.

No bench test can be claimed in this slice. If the hardware is already present,
that does not change the scope: live bringup belongs to slice02.

## Exit criteria

- The ledger rows all reach a final status with evidence.
- Exactly one first IMU board is selected for arc01.
- The first-order purchase list is scoped to arc01, not the whole project.
- The first bus mode is selected or explicitly deferred with a blocker.
- The wiring table is complete enough for slice02 to follow.
- The safety checklist makes it clear when the first energizing step is allowed.
- Artifact-home policy for slice02 transcripts/captures is decided.
- The closing report states whether slice02 can open as live bench work or is
  blocked on procurement, missing documentation, or unresolved pin/safety risk.
- If hardware is still in transit, the planning rows may be accepted while the
  slice remains operationally open on the physical-arrival gate.

## Design sub-questions

Surface these in the closing report; do not decide silently:

1. Is the MikroE Click board's mikroBUS layout a help or a constraint for this
   first direct Bus Pirate test?
2. Is SPI-first still the right first bus mode once the exact board pinout and
   jumpers are inspected?
3. Should text transcripts be tracked in the slice directory, while large
   binary captures live elsewhere with an index, or should all arc01 artifacts
   live under a dedicated tracked `artifacts/` subtree?
4. Is BPIO2 required for arc01 closure, or is repeatable terminal transcript
   evidence enough until slice03?
5. Does the first live test need a photograph/sketch of the wiring for
   verification, or is a pin table sufficient?
