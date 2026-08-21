# arc07 — Sensor Comparison

Status: first approximation / supply-gated

## 1. Capability

Arc07 compares the first IMU candidate against the later ICM-45686 candidate
under a shared motion/timing setup. It should decide whether the second sensor
earns its complexity or whether the earlier candidate remains the practical
telemetry choice.

## 2. Slice breakdown

Provisional:

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · second-sensor-procurement-check** | Confirm ICM-45686 board availability and whether comparison timing is still justified. | Provisional |
| **slice02 · contract-port** | Apply arc01/arc04 contract method to the ICM-45686 board. | Provisional |
| **slice03 · side-by-side-capture** | Capture comparable motion data and power/timing notes for both sensors. | Provisional |
| **slice04 · selection-or-deferral** | Select, defer, or reject the second sensor with evidence and bubble-up. | Provisional |

## 3. Dependencies

Consumes arc01 and arc04; benefits from arc05. Supply availability may delay or
skip this arc without blocking earlier telemetry/Lykn learning.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | second-sensor availability and comparison value are checked before purchase | slice01 close | serious | cart discipline | open | | supply-gated |
| A-2 | ICM-45686 contract method is comparable to arc01/arc04 | transcript/log | serious | comparison validity | open | | |
| A-3 | side-by-side data is captured or explicitly deferred | capture/closing report | serious | telemetry decision | open | | |
| A-4 | sensor decision bubbles up to project plan | plan/version-history entry | serious | project-management | open | | |

## 5. Version History

### v1.0 - 2026-08-21

Created as a provisional arc file. Detailed planning deferred until the first
sensor path and supply picture justify comparison.
