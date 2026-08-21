# arc03 — Storage Path

Status: first approximation

## 1. Capability

Arc03 measures the first microSD storage path for telemetry data. It starts
with the simplest useful breakout and separates what can be learned over SPI
from what must eventually be tested with native SDIO/SDMMC.

## 2. Slice breakdown

Provisional:

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · breakout-wiring-and-card-baseline** | Wire the microSD breakout, identify cards, and record basic read/write behavior. | Provisional |
| **slice02 · write-flush-patterns** | Exercise telemetry-like append, flush, and burst-write patterns; record latency/failure behavior. | Provisional |
| **slice03 · power-loss-fault-sketch** | Define and, if safe, run first fault-like interruption tests without final battery hardware. | Provisional |
| **slice04 · storage-profile-bubble-up** | Convert findings into Lykn requirements for fixed buffers, result types, and storage effects. | Provisional |

## 3. Dependencies

Consumes arc02's board bringup. Feeds arc05 power behavior and the final
telemetry logger storage design.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | at least one microSD breakout/card path writes data | transcript/log | serious | arc capability | open | | |
| A-2 | telemetry-like write/flush behavior is measured | log/summary table | serious | telemetry contract | open | | |
| A-3 | SPI-vs-SDIO/SDMMC boundary is explicitly stated | closing report | serious | design boundary | open | | |
| A-4 | Lykn storage-related target requirements bubble up | plan/version-history entry | serious | project-management | open | | |

## 5. Version History

### v1.0 - 2026-08-21

Created as a provisional arc file. Detailed planning deferred until arc02.
