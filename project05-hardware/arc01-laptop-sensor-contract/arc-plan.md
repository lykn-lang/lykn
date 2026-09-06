# arc01 — Laptop/Sensor Contract

> **Status: Active, procurement in flight.** This arc is the first purchasable
> hardware increment. It uses a laptop and Bus Pirate to learn the IMU contract
> before any STM32 firmware or Lykn C backend work can hide the problem.

## 1. Capability

Arc01 establishes a direct component-level contract for the first IMU path:
laptop over USB to Bus Pirate, Bus Pirate to one ICM-42688-P breakout/eval
board over SPI or I2C, with command transcripts, register behavior, and bus
observations recorded as evidence.

The arc is useful only if it teaches both sides of the project:

- **Camera telemetry:** which IMU registers, modes, FIFO behavior, interrupts,
  sync pins, and failure signatures matter before an MCU driver exists.
- **Lykn embedded C:** which syntax/profile requirements are justified by real
  register-level work: fixed-width integers, bit fields/masks, register maps,
  byte buffers, small pure parsers, explicit bus effects, and transport
  boundaries.

The intended result is not an IMU driver. It is a contract and demonstrator
corpus that later STM32 and Lykn work can use as an oracle.

## 2. Source material and hardware candidates

Read these before opening slice open sets:

- `../project-plan.md` — project boundary and arc roadmap.
- `../../design-v0.8.0/project-plan.md` — compiler-design research boundary.
- `../../design-v0.8.0/arc01-c-target-research/arc-plan.md` — embedded C
  research threads.
- `../../design-v0.8.0/arc01-c-target-research/initial-thoughts.md` — initial
  target-profile TODO list.
- Bus Pirate 6 / BPIO2 / follow-along logic analyzer docs or product pages.
- ICM-42688-P board documentation for the chosen breakout/evaluation board.

Minimum hardware for this arc:

- Bus Pirate 6 (RP2350) REV2B.
- Bus Pirate probe cable set.
- One ICM-42688-P breakout/evaluation board.
- Breadboard, short jumper wires, 22 AWG solid-core hookup wire as needed.
- Headers/connectors only as required to make a mechanically stable test.

Preferred first sensor board: **MikroE 6DOF IMU 14 Click** if its pin exposure
and availability remain suitable. Acceptable alternate: **TDK EV_ICM-42688-P**
if consolidation through DigiKey or board documentation makes it the cleaner
first purchase. Do not buy both for arc01 unless the operator explicitly wants
parallel board-comparison scope; that belongs in a later comparison slice or
arc.

## 3. Slice breakdown

These slices are the active first approximation for arc01. slice01 remains
operationally open until ordered hardware is physically present; slice02 is open
for pre-live preparation but cannot claim live bench evidence until that gate
clears.

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · procurement-and-bench-contract** | Confirm the exact first-order hardware, pin/bus plan, voltage/power limits, and bench safety/mechanical setup. Produce a wiring plan and acceptance checklist before hardware is energized. No Lykn/compiler code. | **Open / procurement in flight** ([slice-doc](slice01-procurement-and-bench-contract/slice-plan.md), [ledger](slice01-procurement-and-bench-contract/ledger.md), [cc-prompt](slice01-procurement-and-bench-contract/cc-prompt.md), [closing-report](slice01-procurement-and-bench-contract/closing-report.md), [CDC note](slice01-procurement-and-bench-contract/cdc-verification.md)) |
| **slice02 · manual-register-bringup** | Use Bus Pirate interactively to power the IMU, select SPI/I2C as appropriate, read identity/status registers, perform one write/readback config operation, and record known-good and known-bad bus signatures. | **Open / pre-live prep** ([slice-doc](slice02-manual-register-bringup/slice-plan.md), [ledger](slice02-manual-register-bringup/ledger.md), [cc-prompt](slice02-manual-register-bringup/cc-prompt.md), [artifact index](./slice02-manual-register-bringup/artifacts/README.md)) |
| **slice03 · scripted-bpio2-probe** | Turn the manual sequence into a laptop-side script or transcript-driven tool using BPIO2 or the most suitable Bus Pirate automation path. Output deterministic register reads and error cases. | Proposed |
| **slice04 · lykn-c-shape-notes** | Convert the observed register/FIFO/config work into Lykn embedded-C requirements: data types, bit operations, effect/capability boundaries, transport abstraction, and forms that must be rejected or restricted. No compiler implementation. | Proposed |
| **slice05 · contract-package-and-bubble-up** | Assemble the IMU contract packet for later arcs: wiring, transcripts, register table, failure signatures, and the target-profile deltas that must bubble into `project04-c-lang/`. | Proposed |

### Proposed execution stance

slice01 and slice02 may be small enough to combine if the operator wants a
single first work package once hardware is in hand. Keep slice03 separate
unless the Bus Pirate automation path is already trivial; it is the first place
tooling choices can quietly expand scope. Keep slice04 separate because it is
thinking/design work derived from evidence, not just bench execution.

## 4. Dependencies

Consumes:

- the 0.8.0 embedded C research seed;
- the operator's current hardware shopping list;
- current Bus Pirate and IMU board documentation at slice-open time.

Feeds:

- arc02's C board ABI and transport boundary;
- arc04's STM32 IMU driver/data path;
- arc07's later sensor-comparison method;
- the embedded target profile in `project04-c-lang/`.

## 5. Decision gates

| Gate | Decision needed | Decide before |
|------|-----------------|---------------|
| G-1 | Choose exactly one first ICM-42688-P board for arc01: MikroE 6DOF IMU 14 Click or TDK EV_ICM-42688-P. | slice01 open set |
| G-2 | Choose first bus mode: SPI-first unless board constraints or docs argue otherwise. | slice01 open set |
| G-3 | Decide whether BPIO2 scripting is required in arc01 or whether terminal transcripts are enough for the first contract. | slice03 open set |
| G-4 | Decide where durable bench artifacts live if they are not normal planning docs: transcripts, captures, exported CSV/log files. | slice01 open set |
| G-5 | Decide whether Lykn syntax notes in slice04 remain prose-only or include tiny illustrative `.lykn` examples. | slice04 open set |

## 6. Arc ledger

Capability: a reproducible laptop-to-IMU component contract exists, and it has
produced concrete Lykn embedded-C target requirements.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | exact first-order hardware and wiring plan selected | slice01 close: bill of materials + wiring/pin plan | serious | arc capability | open | | prevents cart sprawl |
| A-2 | voltage/power/bus safety checks documented before first energized test | slice01 close: checklist and operator review | serious | bench safety | open | | especially 3.3 V-only boards |
| A-3 | IMU identity/status register read succeeds manually | slice02 close: transcript with command, reply, wiring, voltage | serious | telemetry contract | open | | first known-good oracle |
| A-4 | at least one configuration write/readback succeeds manually | slice02 close: transcript and register notes | serious | telemetry contract | open | | proves write path |
| A-5 | at least one intentional failure case is recorded | slice02/03 close: known-bad mode/wiring/config signature | serious | debugging contract | open | | later driver tests need negative examples |
| A-6 | scripted or repeatable automation path exists, or is explicitly deferred with rationale | slice03 close | serious | development velocity | open | | BPIO2 preferred if available and stable |
| A-7 | register/FIFO/config observations are converted into Lykn embedded-C requirements | slice04 close | serious | Lykn target profile | open | | no compiler code required |
| A-8 | contract packet is assembled for later arcs | slice05 close: artifact index and bubble-up | serious | project recomposition | open | | feeds arc02/arc04/arc07 |
| A-9 | arc findings bubble up into this project plan and/or `project04-c-lang/` | arc close: version-history entries | serious | project-management | open | | anti-silent-drop row |

## 7. Verification strategy

Planning/document slices in this repo should at minimum run:

- `git diff --check`
- `make check-cited-paths` when tracked documents add or change path citations

Bench slices must add their own evidence:

- wiring/pin checklist;
- terminal transcript or script output;
- captured register values with hardware revision and bus mode;
- explicit known-good and known-bad signatures;
- artifact index naming where transcripts/captures live.

If hardware has not arrived, a slice can close only as planning/procurement
work. It must not claim bench evidence.

## 8. Out of scope

- STM32 firmware.
- SD card/storage behavior.
- PPK2 power measurement.
- Final IMU selection between ICM-42688-P and ICM-45686.
- Production Lykn C codegen.
- Broad driver architecture beyond the small transport boundary notes learned
  from this component contract.

## 9. Version History

### v1.0 - 2026-08-21

Opened arc01 as the first hardware-coupled planning arc. Proposed five slices:
procurement/bench contract, manual register bringup, scripted BPIO2 probe,
Lykn C shape notes, and final contract packaging/bubble-up.

### v1.1 - 2026-08-21

Drafted canonical open sets for slice01 `procurement-and-bench-contract` and
slice02 `manual-register-bringup`. Kept slice01 planning-only and slice02 as
the first live bench slice so hardware safety, artifact homes, and procurement
scope are closed before the IMU is energized.

### v1.2 - 2026-08-21

Operator update: Bus Pirate/probe cable hardware and the selected MikroE
MIKROE-4237 IMU board are on the way. slice01 remains operationally open until
physical arrival is recorded. slice02 is opened for pre-live preparation now,
with first-power/register ledger rows blocked until hardware is in hand.

### v1.3 - 2026-09-03

Operator update: hardware arrival is now recorded and Bus Pirate firmware/status
evidence has begun. slice02's first status transcript reported SPI mapping as
IO4=MISO, IO5=CS, IO6=CLK, IO7=MOSI, superseding the initial IO mapping
hypothesis before any IMU power. The next gate is the updated pre-power wiring
check, not a register read.
