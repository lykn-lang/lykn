# arc04 — MCU/IMU Data Path

Status: first approximation

## 1. Capability

Arc04 moves from laptop-driven component testing to MCU-driven IMU sampling.
The STM32 reads the IMU using the arc01 contract, including FIFO, interrupt,
and timing behavior that resembles the eventual telemetry logger.

## 2. Slice breakdown

Provisional:

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · stm32-register-port** | Port the arc01 known-good register sequence into hand-written C on STM32. | Provisional |
| **slice02 · fifo-and-interrupt-baseline** | Enable FIFO/interrupt behavior and record sample timing under controlled motion. | Provisional |
| **slice03 · transport-abstraction-check** | Compare Bus Pirate and STM32 transports against the same contract; document divergence. | Provisional |
| **slice04 · imu-profile-bubble-up** | Convert findings into Lykn requirements for effects, peripheral handles, buffers, and ISR safety. | Provisional |

## 3. Dependencies

Consumes arc01 and arc02. Feeds arc05 power measurement, arc06 timing stimulus,
and arc07 sensor comparison.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | STM32 reproduces arc01 identity/config sequence | transcript/log | serious | arc capability | open | | |
| A-2 | FIFO or interrupt behavior is exercised and recorded | log/capture | serious | telemetry contract | open | | |
| A-3 | transport abstraction requirements are explicit | closing report | serious | Lykn target profile | open | | |
| A-4 | ISR/buffer/effect requirements bubble up | plan/version-history entry | serious | project-management | open | | |

## 5. Version History

### v1.0 - 2026-08-21

Created as a provisional arc file. Detailed planning deferred until arc01/arc02
close.
