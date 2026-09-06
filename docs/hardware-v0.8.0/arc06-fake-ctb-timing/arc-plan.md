# arc06 — Fake CTB / Timing Adversary

Status: first approximation

## 1. Capability

Arc06 creates a small timing stimulus device that stands in for the camera time
bridge and related camera-side signals. It should generate repeatable good
events and deliberately bad timing cases so the logger can be tested without a
camera always attached.

## 2. Hardware note

The preferred controller is Pico 2 H / RP2350-class hardware. An RP2040 Pico
board can still be useful for basic GPIO/UART stimulus, but it should not be
silently treated as equivalent to RP2350 for low-power or newer-interface
research.

## 3. Slice breakdown

Provisional:

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · controller-selection-and-sdk** | Select RP2350-vs-RP2040 route, bring up C/C++ SDK, and record commands. | Provisional |
| **slice02 · good-event-generator** | Generate repeatable REC_STATE / strobe / UART-like event patterns. | Provisional |
| **slice03 · adversarial-event-generator** | Generate delayed, dropped, duplicated, or malformed timing cases. | Provisional |
| **slice04 · timing-profile-bubble-up** | Convert findings into Lykn requirements for event structs, timing effects, and deterministic tests. | Provisional |

## 4. Dependencies

Consumes arc02 and benefits from arc04. Feeds integration testing and language
requirements for deterministic event handling.

## 5. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | controller choice is explicit and justified | slice01 close | serious | hardware boundary | open | | RP2350 preferred |
| A-2 | good timing stimulus is reproducible | transcript/capture | serious | telemetry contract | open | | |
| A-3 | at least one adversarial timing case is reproducible | transcript/capture | serious | testability | open | | |
| A-4 | timing/event requirements bubble up | plan/version-history entry | serious | project-management | open | | |

## 6. Version History

### v1.0 - 2026-08-21

Created as a provisional arc file. Detailed planning deferred until the MCU path
is available.
