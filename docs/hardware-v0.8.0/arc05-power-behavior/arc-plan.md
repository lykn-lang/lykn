# arc05 — Power Behavior

Status: first approximation

## 1. Capability

Arc05 measures power behavior with PPK2. It turns low-power from an aspiration
into evidence: idle, active sampling, storage writes, and stress/fault-like
states should have measured current profiles before hardware or language
design assumes they are cheap.

## 2. Slice breakdown

Provisional:

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · ppk2-bench-bringup** | Bring up PPK2 safely with one simple DUT and establish capture/export workflow. | Provisional |
| **slice02 · stm32-idle-active-baseline** | Measure STM32 idle and simple active C harness states. | Provisional |
| **slice03 · telemetry-state-profiles** | Measure at least one IMU/storage active path. | Provisional |
| **slice04 · low-power-profile-bubble-up** | Convert measurements into Lykn no-heap/sleep/wake/effect requirements. | Provisional |

## 3. Dependencies

Consumes arc02 and usually arc03/arc04. Feeds final hardware selection and
Lykn embedded profile restrictions.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | PPK2 capture/export workflow is reproduced | transcript/export file | serious | arc capability | open | | |
| A-2 | idle and active current profiles are measured | captured data | serious | telemetry requirement | open | | |
| A-3 | at least one telemetry-like state is measured | captured data | serious | project DoD | open | | |
| A-4 | low-power language/profile implications bubble up | plan/version-history entry | serious | project-management | open | | |

## 5. Version History

### v1.0 - 2026-08-21

Created as a provisional arc file. Detailed planning deferred until the first
MCU harness exists.
