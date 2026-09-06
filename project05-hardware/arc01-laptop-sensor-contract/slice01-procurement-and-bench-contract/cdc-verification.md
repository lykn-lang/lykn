# CDC Verification: Slice 01 Procurement and Bench Contract

Date: 2026-08-21
Verifier: CDC
Branch: release/0.8.x
Verdict: verified with procurement blocker carried forward

## Scope

CDC verified CC's close for
`slice01-procurement-and-bench-contract`. This was a planning/procurement
slice only. No hardware evidence was expected, and none was claimed.

The slice is accepted as closed at the planning level. The next live slice,
`slice02-manual-register-bringup`, remains blocked until the selected
MikroE MIKROE-4237 board is physically procured or the operator explicitly
selects a replacement board.

## Evidence Reviewed

Local artifacts:

- `slice-doc.md` - opening scope and exit criteria.
- `ledger.md` - 10 opening rows, all dispositioned by CC.
- `closing-report.md` - purchase list, board decision, bus decision, wiring
  table, safety checklist, artifact-home policy, slice02 checklist, row walk,
  and bubble-up.
- `../arc-plan.md` - arc01 capability and decision gates.
- `../../project-plan.md` - hardware project roadmap and project ledger.

External evidence spot-checked:

- Bus Pirate 6 hardware page: confirms programmable supply, current limit,
  voltage measurement, follow-along logic analyzer, and main connector role.
- Bus Pirate SPI protocol page: confirms MOSI/MISO/CLK/CS connections,
  default 100 kHz-class setup, active-low CS default, and `[` / `]` CS syntax.
- Bus Pirate IO pin descriptions: confirms main connector VOUT/IO0-IO7/GND
  shape and the documented IO4=SCLK, IO5=MOSI, IO6=MISO, IO7=CS SPI mapping,
  while also supporting CC's live-statusbar confirmation caveat.
- MikroE 6DOF IMU 14 Click product page: confirms PID MIKROE-4237, ICM-42688-P,
  SPI/I2C interfaces, 3.3 V-only operation, pinout, JP2-JP4 COMM SEL left/SPI
  default, and out-of-stock status.
- Mouser MIKROE-4237 page: confirms stock 0 and 7-week estimated factory lead
  time at the time of verification.
- DigiKey EV_ICM-42688-P page: confirms stock 0 and one expected in stock on
  2026-09-08 at the time of verification.
- DigiKey-hosted ICM-42688-P datasheet text: confirms SPI read/write address
  format, 24 MHz maximum SPI clock, DEVICE_CONFIG SPI mode default supporting
  modes 0 and 3, WHO_AM_I address 0x75, and reset value 0x47.

## Checks Run

```sh
git diff --check
```

Result: passed.

```sh
make check-cited-paths
```

Result: failed with 15 dangling citations.

Assessment: the failure is not a slice01 implementation defect. Fourteen
reported dangling citations are pre-existing `project03-language-evolution/` issues on
this branch. The one hardware-track citation is expected until the new
`closing-report.md` is committed to `HEAD`: slice02 already cites the slice01
close artifact as its prerequisite. This matches the repository's documented
HEAD-based citation-gate behavior.

## Row Verification

| ID | CDC status | Verification |
|----|------------|--------------|
| F-1 | reproduced | The Purchase List is scoped to Bus Pirate 6, probe cable, one selected ICM-42688-P board, breadboard, and wire/header minimums; it explicitly defers extra headers/adapters and the TDK alternate. |
| F-2 | reproduced | The IMU Board Decision selects MikroE MIKROE-4237 and defers TDK EV_ICM-42688-P with stock and documentation rationale. Current MikroE/Mouser/DigiKey pages support the availability claims. |
| F-3 | reproduced | The Bus Mode Decision selects SPI-first, records JP2-JP4 COMM SEL left/SPI, defers I2C-first with re-entry conditions, and matches MikroE/ICM/Bus Pirate source material. |
| F-4 | reproduced | The Wiring Table maps Bus Pirate VOUT/GND and IO4-IO7 to the Click-board SPI pins with direction, voltage, and risk notes. The live Bus Pirate 6 statusbar confirmation gate is appropriate because the IO mapping source labels part of its detail as an RP2040 pin map. |
| F-5 | reproduced | The Pre-Power Safety Checklist covers board revision, COMM SEL jumpers, 3.3 V/GND, current limit, CS idle state, 5 V avoidance, continuity/visual checks, and current-limit stop behavior. |
| F-6 | reproduced | The Artifact-Home Decision gives slice02 a tracked `artifacts/` subtree for durable text/small artifacts and routes large raw captures to scratch with tracked summaries, avoiding scratch-only closure evidence. |
| F-7 | reproduced | The Slice02 Starting Checklist records procurement, docs, pre-power, terminal/statusbar, first power, first WHO_AM_I read, first status read, and known-bad candidate steps. |
| F-8 | reproduced | The Source Discrepancies section names the current stock/availability mismatches and the TDK documentation/stock weakness. |
| F-9 | reproduced | The report states the slice was planning/procurement only and claims no energizing, register reads, Bus Pirate hardware commands against a device, firmware work, or bench transcript evidence. |
| F-10 | reproduced | The Bubble-Up to Arc01 records that slice02 is blocked on procurement and that no arc/project plan text change is required before slice02 if this close is accepted. Deferred decisions have concrete re-entry conditions. |

Rows: 10. Done/reproduced: 10. Deferred: 0. No-op: 0. Open: 0.

## Findings

No blocking findings.

One non-blocking observation: the selected board is technically the right first
bench surface, but procurement is not solved. That is correctly represented as
a slice02 blocker rather than hidden inside a "buy" decision.

## Bubble-Up Check

The closing report's bubble-up is honest and complete:

- slice01 delivered its assigned piece of arc01: first hardware selection,
  wiring/safety contract, artifact-home policy, and slice02 start criteria;
- slice02 is blocked on physical procurement, not on planning ambiguity;
- no arc-plan or project-plan update is required before slice02 unless the
  operator rescope-selects a different IMU board;
- BPIO2, I2C-first, TDK fallback, raw capture storage, and IMU procurement have
  named re-entry conditions.

## CDC Verdict

Accepted. Slice01 is CDC-verified as a planning/procurement close.

Do not start live slice02 hardware work until one of these is true:

1. MikroE MIKROE-4237 is physically in hand; or
2. the operator explicitly accepts a backorder wait and keeps slice02 blocked
   until arrival; or
3. the operator explicitly rescope-selects a replacement board and updates the
   slice01 contract or opens a remediation planning slice.
