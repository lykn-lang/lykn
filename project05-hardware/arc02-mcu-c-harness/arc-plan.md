# arc02 — MCU C Harness

Status: first approximation

## 1. Capability

Arc02 brings up the selected STM32 development board with small hand-written C
harnesses. It establishes the first board-facing ABI that Lykn might emit
against later: simple functions, fixed-width types, GPIO/timing hooks, and a
tiny owned shim boundary that keeps vendor HAL details out of Lykn semantics.

## 2. Slice breakdown

Provisional:

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · board-toolchain-bringup** | Install/verify the C toolchain path for NUCLEO-U575ZI-Q, build and flash a minimal C program, record exact commands. | Provisional |
| **slice02 · owned-board-shim** | Define a tiny C shim boundary for GPIO/timing/status without committing Lykn to STM32Cube semantics. | Provisional |
| **slice03 · lykn-shaped-c-fixtures** | Write small C fixtures that correspond to likely Lykn output shapes: `main`, fixed-width funcs, branches, loops, result codes. | Provisional |
| **slice04 · profile-bubble-up** | Bubble board/shim constraints into the embedded target profile. | Provisional |

## 3. Dependencies

Consumes arc01's register/transport requirements and the compiler-design seed.
Feeds arc03 storage, arc04 MCU/IMU integration, arc05 power measurement, and
arc06 timing stimulus.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | NUCLEO-U575ZI-Q C toolchain path builds and flashes a minimal program | slice close transcript | serious | arc capability | open | | |
| A-2 | owned board shim boundary is documented | shim header/source + notes | serious | Lykn target profile | open | | no vendor HAL in Lykn semantics |
| A-3 | Lykn-shaped C fixtures compile under the chosen toolchain | build transcript | serious | embedded C research | open | | |
| A-4 | constraints bubble up to `docs/design-v0.8.0/` | plan/version-history entry | serious | project-management | open | | |

## 5. Version History

### v1.0 - 2026-08-21

Created as a provisional arc file. Detailed planning deferred until arc01 has
produced its component contract.
