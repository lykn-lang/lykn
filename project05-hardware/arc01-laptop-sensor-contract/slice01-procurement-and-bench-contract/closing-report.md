# Slice 01 Closing Report: Procurement and Bench Contract

Date: 2026-08-21
Branch: release/0.8.x
Scope: planning/procurement only; no hardware was energized.

## Source Material Read

Local planning and project sources:

- AGENTS.md - branch, artifact-home, citation, and verification rules.
- docs/hardware-v0.8.0/README.md - hardware-track artifact home and status.
- docs/hardware-v0.8.0/project-plan.md - hardware project boundary and arc roadmap.
- docs/hardware-v0.8.0/arc01-laptop-sensor-contract/arc-plan.md - arc01 capability, candidates, gates, and ledger.
- docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice01-procurement-and-bench-contract/slice-doc.md - slice scope, outputs, and exit criteria.
- docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice01-procurement-and-bench-contract/ledger.md - F-1 through F-10 acceptance criteria.
- docs/design-v0.8.0/project-plan.md - embedded-C research boundary.
- docs/design-v0.8.0/arc01-c-target-research/arc-plan.md - target-profile research threads.
- docs/design-v0.8.0/arc01-c-target-research/initial-thoughts.md - provisional embedded target TODO list.

Current external sources:

- https://docs.buspirate.com/docs/hardware/bp6rev2/hardware/ - Bus Pirate 6 REV2 hardware, IO voltage, programmable supply, current limit, follow-along logic analyzer.
- https://docs.buspirate.com/docs/overview/probe-cable/ - Bus Pirate probe cable kit contents and lead labels.
- https://docs.buspirate.com/docs/overview/io-pins/ - Bus Pirate IO-to-protocol mapping used for the SPI wiring table.
- https://docs.buspirate.com/docs/command-reference/spi-protocol/ - Bus Pirate SPI connections, mode defaults, CS semantics, and syntax.
- https://docs.buspirate.com/docs/binmode-reference/protocol-bpio2 - BPIO2 role and second-serial-port requirement.
- https://docs.buspirate.com/docs/logic-analyzer/logicanalyzer/ - logic analyzer modes and follow-along capabilities.
- https://dirtypcbs.com/store/details/6667/bus-pirate-6-rp2350b-with-enclosure - current Bus Pirate 6 purchase page.
- https://shop.buspirate.com/ - current Bus Pirate probe cable shop listing.
- https://www.mikroe.com/6dof-imu-14-click - MikroE 6DOF IMU 14 Click product, pinout, jumpers, voltage, and current stock status.
- https://download.mikroe.com/documents/add-on-boards/click/6dof_imu_14_click/6dof-imu-14-click-schematic-v100.pdf - MikroE schematic v100; jumper and sensor-pin verification.
- https://download.mikroe.com/documents/datasheets/ICM-42688-P_Datasheet.pdf - ICM-42688-P voltage, SPI mode, register map, and WHO_AM_I value.
- https://www.mouser.com/en/ProductDetail/Mikroe/MIKROE-4237?qs=hWgE7mdIu5Th0Vmu4C82%2FQ%3D%3D - US distributor availability for MIKROE-4237.
- https://www.sparkfun.com/mikroe-6dof-imu-14-click-sen-18783.html - retired/out-of-stock US listing for the MikroE board.
- https://www.digikey.com/en/products/detail/tdk-invensense/EV-ICM-42688-P/18634550 - TDK EV_ICM-42688-P availability and basic attributes.
- https://product.tdk.com/en/search/sensor/mortion-inertial/imu/info?part_no=ICM-42688-P - current TDK product-center electrical characteristics.
- https://www.invensense.tdk.com/en-us/products/6-axis/icm-42688-p - current TDK InvenSense documentation hub.
- https://www.sparkfun.com/breadboard-self-adhesive-white.html - solderless breadboard purchase source.
- https://www.sparkfun.com/hook-up-wire-assortment-solid-core-22-awg.html - 22 AWG solid-core hookup wire purchase source.

## Purchase List

| Item | Vendor/source | Qty | Purpose | Buy/defer | Availability caveat |
|------|---------------|-----|---------|-----------|---------------------|
| Bus Pirate 6 RP2350B with enclosure | DirtyPCBs Bus Pirate 6 listing | 1 | Laptop-to-sensor host interface, programmable 3.3 V supply, current limit, terminal SPI, follow-along logic capture | Buy | Listing is live; record delivered hardware revision before use. |
| Bus Pirate Probe Cable Set | Bus Pirate Shop / Bus Pirate probe cable docs | 1 | Keyed 10-pin cable, labeled leads, hooks, and milled breadboard pins for stable Bus Pirate wiring | Buy | Bus Pirate Shop currently lists the set at USD 9.95; verify contents on arrival. |
| MikroE MIKROE-4237 6DOF IMU 14 Click | MikroE primary product page; Mouser US as managed backorder option | 1 | First ICM-42688-P board for arc01 | Selected, but procurement-blocked | MikroE primary page says out of stock/unavailable; Mouser US shows stock 0 with 7-week factory lead time; SparkFun is retired/out of stock. |
| SparkFun PRT-12002 solderless breadboard | SparkFun | 1 | Mechanically stable 0.1 inch breadboard base for Click board plus probe leads | Buy if not already on bench | Current SparkFun page says in stock. |
| SparkFun PRT-11367 22 AWG solid-core hookup wire assortment | SparkFun | 1 | Short custom jumpers for clean, strain-reduced breadboard wiring | Buy if not already on bench | Current SparkFun page says in stock. |
| Extra headers/adapters | No purchase in slice01 | 0 | Avoid cart sprawl until the selected board arrives | Defer | The probe cable kit includes breadboard pins; buy headers only if the delivered board lacks usable 0.1 inch pins. |
| TDK EV_ICM-42688-P | DigiKey | 0 | Alternate ICM-42688-P evaluation board | Defer | DigiKey shows active part, stock 0, one expected on 2026-09-08; board-specific public schematic/pinout was not found in this pass. |

## IMU Board Decision

Selected first board: MikroE MIKROE-4237, 6DOF IMU 14 Click.

Reason: it has the clearest bench-contract surface for this slice. The product page exposes the mikroBUS pinout, SPI/I2C jumper defaults, 3.3 V-only requirement, board size, and schematic download. The schematic confirms the ICM-42688-P signal names and COMM SEL jumpers. The board is shown usable on a breadboard, which fits the Bus Pirate probe-cable and milled-pin setup.

Procurement caveat: the selected board is not currently buyable from MikroE direct, and US distributor availability is poor. This blocks live slice02 until either the selected board is obtained, a backorder is acceptable to the operator, or the operator explicitly approves a rescope to a different board.

Rejected/deferred alternate: TDK EV_ICM-42688-P.

Reason: it is the official TDK evaluation-board candidate and stays valid as a fallback, but DigiKey currently has zero in stock, and this pass found only basic distributor attributes plus generic ICM-42688-P documentation, not an equally convenient board-level pinout/schematic for direct Bus Pirate wiring. It is deferred until it is in stock and a board-level pinout/schematic is available, or until the operator explicitly prefers official-EV-board consolidation despite weaker immediate bench documentation.

Design sub-question: the mikroBUS layout is mostly a help for this first Bus Pirate test because it gives a standard 2x8, 0.1 inch pin field and public pin table. It is also a constraint: the tester must not assume a generic breakout, must check JP2-JP4 before power, and must leave the mikroBUS 5 V pin unconnected.

## Bus Mode Decision

Decision: SPI-first.

Board implications:

- MikroE JP2, JP3, and JP4 COMM SEL must all be in the left/SPI position before power.
- JP1 ADDR SEL is only relevant for I2C address selection and is not used for SPI-first.
- I2C SCL/SDA pins remain unconnected for the first test.
- Bus Pirate pull-ups stay disabled for SPI unless a later observation justifies enabling them.

Reason: SPI avoids I2C address and pull-up ambiguity, gives a dedicated CS line, matches the slice's default bias, and provides a simple first identity-register read. The ICM-42688-P datasheet says DEVICE_CONFIG defaults to SPI mode 0 and mode 3 support; Bus Pirate SPI defaults are compatible with mode 0. Start at 100 kHz or lower, not near the 24 MHz sensor maximum.

Deferred mode: I2C-first is deferred. Re-entry condition: choose I2C only if SPI wiring or jumper inspection fails, if the delivered board is already soldered for I2C and changing COMM SEL would risk damage, or if the operator asks to prioritize I2C because later arcs need address-sharing behavior.

## Wiring Table for First Live Test

Manual verification basis: Bus Pirate IO Pin Descriptions for initial
IO4/IO5/IO6/IO7 SPI mapping hypothesis; Bus Pirate SPI Protocol for signal
direction and CS behavior; MikroE product pinout and schematic v100 for Click
pins; ICM-42688-P datasheet for voltage and SPI register behavior.

Live mapping update, 2026-09-03: the first Bus Pirate 6 terminal/status check
in slice02 reported `IO4=MISO`, `IO5=CS`, `IO6=CLK`, and `IO7=MOSI`, with VOUT
off and no external board powered. This supersedes the initial IO mapping
hypothesis from the Bus Pirate IO Pin Descriptions page. Do not wire or power
the IMU using the old `IO4=SCLK`, `IO5=MOSI`, `IO6=MISO`, `IO7=CS` mapping.

| Bus Pirate lead/pin | IMU board pin | Signal | Direction | Expected voltage | Notes/risk |
|---------------------|---------------|--------|-----------|------------------|------------|
| Pin 1 VOUT/VREF | 3.3V, mikroBUS pin 7 | VCC / board supply | Bus Pirate -> board | 3.3 V | Set Bus Pirate supply to 3.3 V. Initial current limit: 20 mA. Do not connect mikroBUS 5V pin. |
| Pin 10 GND | GND, mikroBUS pin 8 | GND | Common | 0 V | Use the nearest ground. Optional: tie pin 9 GND too after continuity check. |
| IO6 / physical pin 8 | SCK, mikroBUS pin 4 | SPI CLK / SCLK | Bus Pirate -> board | 0 to 3.3 V | Live Bus Pirate 6 status reports IO6=CLK in SPI mode. |
| IO7 / physical pin 9 | SDI/MOSI, mikroBUS pin 6 | SPI MOSI / AP_SDI | Bus Pirate -> board | 0 to 3.3 V | Live Bus Pirate 6 status reports IO7=MOSI. Data from Bus Pirate to ICM-42688-P. |
| IO4 / physical pin 6 | SDO/MISO, mikroBUS pin 5 | SPI MISO / AP_SDO | Board -> Bus Pirate | 0 to 3.3 V | Live Bus Pirate 6 status reports IO4=MISO. Data from ICM-42688-P to Bus Pirate. Leave as Bus Pirate input. |
| IO5 / physical pin 7 | CS, mikroBUS pin 3 | SPI CS / AP_CS | Bus Pirate -> board | Idle high 3.3 V; active low 0 V | Live Bus Pirate 6 status reports IO5=CS. Must idle high before power and between transactions. Bus Pirate `[` pulls active low; `]` releases high. |
| Not connected | SCL, mikroBUS pin 12 | I2C SCL | N/A | N/A | Unused in SPI-first. |
| Not connected | SDA, mikroBUS pin 11 | I2C SDA | N/A | N/A | Unused in SPI-first. |
| Not connected | INT, mikroBUS pin 15 | Interrupt | Board -> host | 0 to 3.3 V if later used | Defer until identity/status read succeeds. |
| Not connected | SNC/PWM, mikroBUS pin 16 | FSYNC/CLKIN | Host -> board or board-specific | 0 to 3.3 V if later used | Defer; leave unconnected for first identity read. |
| Not connected | 5V, mikroBUS pin 10 | 5 V rail | N/A | Must remain unconnected | MikroE board is 3.3 V-only. |

## Pre-Power Safety Checklist

All items must be checked in slice02 before energizing:

- Record Bus Pirate hardware revision, firmware version, and delivered probe-cable contents.
- Record IMU board make, part number MIKROE-4237, board revision/schematic version if printed, and visible jumper positions.
- Confirm JP2, JP3, and JP4 COMM SEL are all left/SPI. If mixed or right/I2C, do not power until resolved.
- Confirm JP1 ADDR SEL is irrelevant for SPI-first and has not been mistaken for COMM SEL.
- Identify 3.3V and GND on the board from the silkscreen and continuity to the schematic/mikroBUS pins.
- With Bus Pirate VOUT off, verify no continuity short between 3.3V and GND.
- With Bus Pirate VOUT off, verify IO5/CS is wired to CS, IO6/CLK to SCK,
  IO7/MOSI to SDI, and IO4/MISO to SDO.
- Configure Bus Pirate supply to 3.3 V with initial 20 mA current limit.
- Keep Bus Pirate IO reference at 3.3 V; no 5 V on any board signal.
- Leave Bus Pirate pull-ups off for SPI-first.
- Confirm CS idles high before the first transaction.
- Confirm all unused 5V/I2C/INT/FSYNC pins are not accidentally bridged by breadboard rails.
- Create a wiring sketch or photo and record it in the slice02 artifact index before power.
- If current immediately hits the 20 mA limit, power down and record it as a known-bad signature; do not raise the limit until visual/continuity checks are repeated.

## Artifact-Home Decision for Slice02

Text and small durable bench artifacts should live under the slice02 directory, in a tracked artifact subtree opened by slice02:

```text
docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice02-manual-register-bringup/artifacts/
  README.md
  transcripts/
  captures/
  logs/
  sketches/
```

Policy by artifact type:

- Terminal transcripts: tracked text under `artifacts/transcripts/`.
- Logic captures: export small CSV/text/decoder summaries under `artifacts/captures/`; keep large raw PulseView/Sigrok binaries in scratch unless the operator explicitly wants binary artifacts tracked.
- Exported logs/CSV: tracked under `artifacts/logs/` if small enough to review in Git.
- Wiring photos/sketches: prefer a tracked Markdown or ASCII sketch under `artifacts/sketches/`; add a compressed photo only if it is needed to disambiguate wiring and the file size is reasonable.
- Notes/index: `artifacts/README.md` is the durable index and must name hardware revision, board revision, bus mode, filenames, and any scratch raw-capture location.

Scratch raw captures, if needed, should use a clearly non-durable home and must not be the only cited evidence:

```text
workbench/hardware-v0.8.0/arc01/slice02/raw-captures/
```

Tracked docs may cite the tracked artifact index and exported summaries. They must not depend on a scratch-only raw capture for a closure claim.

## Slice02 Starting Checklist

Slice02 cannot proceed to live bench work until the selected board is physically present. Once present:

- Hardware present: Bus Pirate 6, probe cable kit, selected MikroE MIKROE-4237 board, breadboard, wire.
- Docs present: Bus Pirate 6 hardware docs, Bus Pirate SPI docs, probe cable docs, MikroE product page, MikroE schematic v100, ICM-42688-P datasheet.
- Pre-power checks complete: all checklist items above recorded in the artifact index.
- First setup: Bus Pirate in HiZ, VOUT off, wiring complete, statusbar confirms
  the live SPI pin assignment recorded above.
- First mode: enter SPI at 100 kHz, 8 bits, mode 0, active-low CS.
- First power observation: enable 3.3 V with 20 mA current limit; record current draw and whether PWR LED lights.
- First register observation: read WHO_AM_I at register 0x75. For SPI read, set the read bit on the address byte: transmit 0xF5 then read one byte. Expected value: 0x47.
- First status observation if WHO_AM_I succeeds: read INT_STATUS at 0x2D and record RESET_DONE_INT / DATA_RDY-related behavior without configuring sensors yet.
- First known-bad observation to consider only after a known-good read: wrong CS polarity, disconnected MISO, or COMM SEL mismatch, each recorded as a separate failure signature.

BPIO2 is not required for slice02 start. Terminal transcript evidence is enough for manual bringup; BPIO2 re-enters in slice03 if repeatability/tooling pressure justifies it.

## Source Discrepancies

- Earlier planning preferred MikroE 6DOF IMU 14 Click if pin exposure and availability remained suitable. Current source check confirms pin exposure and documentation are suitable, but availability is not: MikroE direct is out of stock/unavailable, Mouser US is stock 0 with a 7-week factory lead time, and SparkFun has retired the item.
- The TDK EV_ICM-42688-P alternate is also supply-gated: DigiKey shows stock 0 with one expected on 2026-09-08.
- The TDK alternate does not currently beat the MikroE board for this slice because this pass did not find a comparable public board-level schematic/pinout for direct Bus Pirate wiring.
- Bus Pirate probe-cable current source is the Bus Pirate Shop/probe-cable docs. Bus Pirate 6 itself is currently sourced from DirtyPCBs via the Bus Pirate hardware docs' purchase links.

## Ledger Walk

| ID | Final status | Evidence |
|----|--------------|----------|
| F-1 | Done | Purchase list above selects the first-order arc01 kit and avoids whole-project cart sprawl. IMU purchase is selected but procurement-blocked. |
| F-2 | Done | MikroE MIKROE-4237 is selected; TDK EV_ICM-42688-P is deferred with stock/docs rationale. |
| F-3 | Done | SPI-first selected; JP2-JP4 left/SPI requirement recorded; I2C-first re-entry conditions named. |
| F-4 | Done | Wiring table maps Bus Pirate lead/pin to MikroE pin, signal, direction, voltage, and risk. |
| F-5 | Done | Pre-power checklist covers revision/part recording, jumpers, 3.3 V/GND, current limit, CS state, 5 V avoidance, and visual/continuity checks. |
| F-6 | Done | Artifact-home policy selects tracked slice02 artifacts for durable text evidence and scratch-only raw binaries with tracked summaries. |
| F-7 | Done | Slice02 checklist names procurement gate, docs gate, pre-power gate, first commands, and first observations. |
| F-8 | Done | Source discrepancies section names stock and documentation mismatches between planning notes and current product/source pages. |
| F-9 | Done | This report states no energizing, register reads, Bus Pirate commands against hardware, firmware work, or bench transcript claims occurred in slice01. |
| F-10 | Done | Bubble-up below records slice02 status and whether arc/project plans need changes. |

## Bubble-Up to Arc01

Slice02 can proceed only after procurement: blocked until the selected MikroE board is physically present or the operator explicitly rescope-selects the TDK EV board or another board.

No arc-plan or project-plan text must change before slice02, provided this closing report is accepted as the slice01 close artifact. The arc-level substance changed from "MikroE preferred if availability remains suitable" to "MikroE selected but procurement-blocked"; that can remain localized here until either the board is acquired or a rescope is needed.

Deferred decisions and re-entry conditions:

- IMU procurement: re-enter when MIKROE-4237 is in hand, backorder accepted, or operator selects a replacement board.
- TDK alternate: re-enter if MIKROE-4237 remains unavailable and EV_ICM-42688-P becomes stocked with usable board docs.
- BPIO2 scripting: re-enter in slice03 after manual transcript evidence exists.
- Logic capture raw storage: re-enter in slice02 only if capture files are small enough to track or the operator wants binary evidence in Git.
- I2C-first: re-enter only if SPI is blocked by hardware state or operator changes the bus priority.

## What Worked

- The source check separated pinout quality from stock status; this prevented a false "buy now" close.
- Keeping SPI-first as a bench contract, not a live command sequence, preserved the slice01/slice02 boundary.
- Naming the Bus Pirate IO mapping as a pre-power confirmation gate avoids baking a firmware-doc mismatch into live wiring.
