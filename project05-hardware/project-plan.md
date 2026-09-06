---
project: project05-hardware
status: active
planned-release: "0.8.0"
depends-on: []
blocks: []
related: ["project04-c-lang"]
---

# Lykn Hardware 0.8.0 — Project Plan

> Plan-of-record for the hardware-coupled 0.8.0 research track. This is the
> roadmap for using small electronics experiments to drive two questions at
> once: what the camera telemetry logger actually needs from hardware, and what
> Lykn must be able to express before an embedded C target is worth building.

Status: arc01 active
Created: 2026-08-21
Branch: release/0.8.x
Home: `project05-hardware/`

## 1. Definition of done and boundaries

**What this project delivers.** This project is done when the first hardware
bench sequence has produced enough evidence to decide whether Lykn's embedded C
research should continue toward a real backend. The output is not production
firmware. The output is a set of measured hardware contracts, small C harnesses,
and target-profile requirements that can feed `project04-c-lang/`.

Specifically, the project should deliver:

- a laptop-to-sensor component contract for the first IMU path;
- a board-level C harness on the chosen STM32 development board;
- a storage-path experiment that distinguishes SPI microSD from native SDIO /
  SDMMC needs;
- an MCU-to-IMU data path with FIFO/interrupt/timing requirements;
- a first measured power profile for idle, sampling, writing, and fault-like
  states;
- a fake camera-time-bridge / timing adversary that can generate repeatable
  camera-side events;
- a sensor-comparison result that decides whether the second IMU candidate is
  worth carrying forward;
- a bubble-up into the Lykn 0.8.0 compiler-design plan naming the embedded C
  target requirements these experiments actually justified.

**What this project does not deliver.**

- No production C backend.
- No final telemetry logger PCB, enclosure, battery stack, or camera mount.
- No permanent vendor SDK commitment.
- No claim that Lykn 0.8.0 ships embedded support.
- No attempt to express every vendor register or HAL concept in Lykn.
- No source changes on `main`; 0.8.0 artifacts live in
  `.worktrees/0.8.x/`.

**Relationship to the compiler-design seed.** This project consumes the
research direction already captured in
`project04-c-lang/arc01-c-target-research/`: Lykn source should pass through
typed surface/core analysis, target-profile validation, an embedded/C-oriented
IR, and then C codegen. This hardware track exists to keep that design from
drifting into abstract compiler elegance without bench evidence.

## 2. Arc roadmap

Arcs are ordered by the smallest useful hardware purchase that can teach a
complete thing. Later arcs are intentionally first approximations; plan late,
plan deep.

| Arc | Capability | Hardware trigger | Depends on | Status |
|-----|------------|------------------|------------|--------|
| **arc01 · laptop-sensor-contract** | Laptop directly drives an IMU over Bus Pirate, records the register/bus contract, and extracts the first Lykn embedded C requirements from register work. | Bus Pirate 6 + probe cable + one ICM-42688-P breakout/eval + breadboard/wires | compiler-design seed | **Active planning** |
| **arc02 · mcu-c-harness** | STM32 Nucleo runs small hand-written C harnesses that define the first board ABI Lykn may target. | NUCLEO-U575ZI-Q + headers/wires | arc01 for target requirements; compiler-design seed | First approximation |
| **arc03 · storage-path** | microSD writes are measured through the simplest useful path, then SDIO/SDMMC requirements are separated from SPI convenience. | 2x Adafruit MicroSD SPI/SDIO breakouts + microSD cards | arc02 | First approximation |
| **arc04 · mcu-imu-data-path** | STM32 reads IMU data using the sensor contract, including FIFO/interrupt/timing behavior. | Reuses arc01/arc02 hardware | arc01, arc02 | First approximation |
| **arc05 · power-behavior** | PPK2 produces current profiles for idle, sampling, storage, and stress states. | Nordic PPK2 | arc02, usually arc03/arc04 | First approximation |
| **arc06 · fake-ctb-timing** | A small secondary controller generates repeatable camera-side timing events and bad-behavior cases. | Pico 2 H / RP2350 preferred; RP2040 acceptable for basic stimulus | arc02; arc04 useful | First approximation |
| **arc07 · sensor-comparison** | ICM-42688-P and ICM-45686 are compared under the same motion/timing setup, and one is selected/deferred. | ICM-45686 board when available | arc01, arc04, arc05 | First approximation / supply-gated |

## 3. Current status

- `arc01-laptop-sensor-contract` is the active detailed-planning arc.
- arc01 slice01 is open with the planning/procurement contract accepted and
  hardware procurement in flight. The Bus Pirate/probe cable and MikroE IMU
  board have been ordered or confirmed as on the way, but the live bench gate
  remains physical arrival.
- arc01 slice02 is open for pre-live setup, source review, artifact-index
  preparation, and command-sequence planning. Live first-power/register work is
  blocked until the selected hardware is physically present.
- The later arc plans exist so the shopping list is no longer a pile; their
  slice breakdowns are provisional and should be revised after arc01 closes.
- No live bench work has been performed in this planning tree.

## 4. Project ledger

Composition criteria verifying the project definition of done. These rows open
here and close in a future project closing report.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| P-1 | Arc01 produces a laptop-to-IMU component contract with reproducible commands/transcripts | arc01 closing-report and contract artifact | serious | project DoD | open | | establishes sensor facts before MCU code |
| P-2 | Arc02 produces a board ABI candidate with at least one STM32 C harness | arc02 closing-report + harness build/run evidence | serious | project DoD | open | | keeps vendor HAL outside Lykn semantics |
| P-3 | Arc03 records storage-path behavior and separates SPI convenience from SDIO/SDMMC requirements | arc03 closing-report + write/flush/fault notes | serious | project DoD | open | | prevents premature storage assumptions |
| P-4 | Arc04 records MCU-to-IMU data-path behavior using the arc01 contract | arc04 closing-report + FIFO/interrupt evidence | serious | project DoD | open | | first actual logger-like sensor path |
| P-5 | Arc05 records measured power profiles for at least idle and one active telemetry state | arc05 closing-report + PPK2 export/screenshots/transcript | serious | project DoD | open | | low-power requirements become evidence-backed |
| P-6 | Arc06 records repeatable camera-side timing stimulus and at least one adversarial timing case | arc06 closing-report + stimulus transcript | serious | project DoD | open | | makes CTB behavior testable without a camera |
| P-7 | Arc07 either selects a sensor candidate or explicitly defers selection with named missing evidence | arc07 closing-report | serious | project DoD | open | | comparison may be supply-gated |
| P-8 | Every closed arc bubbles up Lykn embedded-C requirements into this roadmap or `project04-c-lang/` | arc close reports + project-plan Version History | serious | project-management | open | | anti-silent-drop row |

## 5. Version History

### v1.0 - 2026-08-21

Opened the hardware-coupled 0.8.0 research project under the operator-specified
`project05-hardware/` home. Created first-pass arc roadmap and project
ledger. Arc01 is the active planning target; later arcs are intentionally
provisional.

### v1.1 - 2026-08-21

Recorded that arc01 slice01 and slice02 open sets are drafted. The project
remains planning-only; no hardware evidence has been claimed.

### v1.2 - 2026-08-21

Operator update: Bus Pirate/probe cable hardware and the selected MikroE IMU
board are in procurement and expected to arrive. Kept slice01 operationally
open on the physical-arrival gate while opening slice02 for pre-live bench
preparation. Live slice02 evidence remains blocked until the hardware is in
hand.

### v1.3 - 2026-09-03

Operator update: the MikroE board arrived, the Bus Pirate arrived, firmware was
updated, and the first Bus Pirate status transcript was captured. The live
status output superseded the initial SPI IO mapping hypothesis before any IMU
wiring or power. Live IMU power remains blocked until the updated wiring map
and pre-power checklist are complete.
