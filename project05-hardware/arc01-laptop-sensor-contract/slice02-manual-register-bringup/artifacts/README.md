# Slice02 Artifacts

Status: opened for pre-live preparation on 2026-08-21.

This directory is the durable index for manual register-bringup evidence. Live
IMU bench evidence must not be added until the updated wiring map and pre-power
checklist are complete.

Update, 2026-09-03: the Bus Pirate and MikroE board are physically present.
Bus Pirate firmware/status evidence has begun. Do not power the IMU until the
updated wiring map and pre-power checklist are complete.

## Hardware Arrival Gate

| Item | Status | Evidence |
|------|--------|----------|
| Bus Pirate 6 REV2B | arrived; firmware updated; status captured | `transcripts/001-buspirate-status.txt`, operator report, 2026-09-03 |
| Bus Pirate probe cable set | arrived | operator report, 2026-09-03 |
| MikroE MIKROE-4237 6DOF IMU 14 Click | arrived | operator report, 2026-09-03 |
| Breadboard and wires | available from bench stash | operator report, 2026-08-21 |

## Planned Artifact Layout

```text
artifacts/
  README.md
  transcripts/
    README.md
    001-buspirate-status.txt
    002-pre-power-checklist.txt
    003-first-power.txt
    004-who-am-i-read.txt
    005-config-write-readback.txt
    006-known-bad-case.txt
  captures/
    README.md
  logs/
    README.md
  sketches/
    README.md
```

Use the child directories when the corresponding artifact exists.

## Source Basis

Current sources checked for pre-live command planning:

- Bus Pirate SPI Protocol: SPI wiring, 100 kHz default prompt, 8-bit default,
  CPOL=0/CPHA=0 default, active-low CS default, and `[` / `]` / `r` syntax.
- Bus Pirate Command Reference: `i` version/status, `m` mode selection,
  `W <voltage> <current limit>`, `w`, and `v` voltage/current reporting.
- Bus Pirate Bus Syntax Reference: bracketed transactions and read/write byte
  syntax.
- Bus Pirate IO Pin Descriptions: supplied the initial IO4=SCLK, IO5=MOSI,
  IO6=MISO, IO7=CS mapping hypothesis. Live Bus Pirate 6 status evidence on
  2026-09-03 reported IO4=MISO, IO5=CS, IO6=CLK, IO7=MOSI; the slice01 wiring
  table was updated before power.
- MikroE 6DOF IMU 14 Click product page and schematic: MIKROE-4237 pinout,
  JP2-JP4 COMM SEL left/SPI, 3.3 V input, and mikroBUS pin assignment.
- TDK/InvenSense ICM-42688-P product page and DS-000347 datasheet: 1.71-3.6 V
  VDD/VDDIO range, 24 MHz SPI maximum, SPI read/write address format,
  `WHO_AM_I`, `INT_STATUS`, `REG_BANK_SEL`, and `GYRO_CONFIG0` register facts.

## Planned Transcript Names

| Filename | Purpose | Status |
|----------|---------|--------|
| `transcripts/001-buspirate-status.txt` | Bus Pirate version/status and SPI pin assignment before wiring/power | captured 2026-09-03 |
| `transcripts/002-pre-power-checklist.txt` | Recorded checklist before first energizing step | pending hardware |
| `transcripts/003-first-power.txt` | 3.3 V enable/current/LED observations | pending hardware |
| `transcripts/004-who-am-i-read.txt` | First and repeated WHO_AM_I register read | pending hardware |
| `transcripts/005-config-write-readback.txt` | One safe configuration write/readback | pending hardware |
| `transcripts/006-known-bad-case.txt` | One safe intentional failure signature | pending hardware |

## First Command Notes

Planning basis from slice01:

- SPI-first.
- Start at 100 kHz or lower, 8 bits, mode 0, active-low CS.
- Supply: 3.3 V with initial 20 mA current limit.
- Bus Pirate starts in HiZ; keep VOUT off until checklist completion.
- WHO_AM_I address: `0x75`.
- SPI read command byte for WHO_AM_I: `0xF5`.
- Expected WHO_AM_I value: `0x47`.

## Planned Manual Command Sequence

Do not run these against hardware until the hardware arrival gate has cleared
and the slice01 safety checklist is complete.

### 001 - Bus Pirate status and SPI setup

Record:

```text
HiZ> i
HiZ> w
HiZ> m spi
```

Accept or explicitly record these SPI settings:

```text
KHz: 100 or lower
Data bits: 8
Clock polarity: idle low
Clock phase: leading edge
Chip select: active low
Bit order: MSB first
Pull-ups: off
VOUT: off
```

Then record:

```text
SPI> i
SPI> v
```

Before connecting VOUT to the board, verify the live Bus Pirate display or
status output maps IO4/IO5/IO6/IO7 to MISO/CS/CLK/MOSI. Stop if it does not.

### 002 - Pre-power checklist

Record the slice01 checklist item by item in
`transcripts/002-pre-power-checklist.txt`. Do not shorten the checklist to a
single "passed" line.

### 003 - First power

After wiring and continuity checks:

```text
SPI> W 3.3 20
SPI> v
```

Expected result: power enabled at approximately 3.3 V, no digital-fuse trip,
and current comfortably below the 20 mA limit. If the current limit trips,
record the transcript, run `w` to ensure VOUT is disabled, and stop.

### 004 - Identity and status reads

Confirm register bank 0, then read identity and status:

```text
SPI> [0xF6 r]
SPI> [0xF5 r]
SPI> [0xAD r]
SPI> [0xF5 r]
```

Interpretation:

- `0xF6` is SPI read of `REG_BANK_SEL` (`0x76` with read bit set). Expected:
  bank 0 (`0x00`) before first register work.
- `0xF5` is SPI read of `WHO_AM_I` (`0x75` with read bit set). Expected:
  `0x47`.
- `0xAD` is SPI read of `INT_STATUS` (`0x2D` with read bit set). Expected:
  record raw value and decode only bits supported by the open datasheet; do
  not require a fixed status value for slice success.
- The second `WHO_AM_I` read is the repeat/witness check.

Stop if `WHO_AM_I` is not `0x47`; do not proceed to write/readback.

### 005 - Configuration write/readback

Candidate safe register: `GYRO_CONFIG0` at `0x4F`.

Reason: it is R/W in bank 0, reset value is expected to be `0x06`, and changing
only the low-nibble ODR while the gyro remains off avoids enabling measurement
or touching power-mode state. This proves write/readback without entering FIFO,
interrupt, or sensor-output scope.

Planned sequence:

```text
SPI> [0xCF r]
SPI> [0x4F 0x07]
SPI> [0xCF r]
SPI> [0x4F 0x06]
SPI> [0xCF r]
```

Interpretation:

- `0xCF` is SPI read of `GYRO_CONFIG0` (`0x4F` with read bit set).
- First read should be `0x06`. If not, stop and record the deviation before
  writing.
- Write `0x07` changes `GYRO_ODR` from the reset 1 kHz code to the 200 Hz code
  while leaving `GYRO_FS_SEL` at reset and reserved bit 4 clear.
- Readback should be `0x07`.
- Restore `0x06` and confirm final readback is `0x06`.

### 006 - Known-bad case

Selected safe known-bad case: no-CS identity read after a known-good
`WHO_AM_I` read.

Planned command:

```text
SPI> > 0xF5 r
```

Why safe/reversible: `>` executes bus syntax without a start condition, so SPI
CS should remain inactive. It changes no wiring, does not alter power, and does
not write a register.

Expected signature: the read does not produce a valid `WHO_AM_I` value
(`0x47`) under the same wiring that produced the known-good read. Record the
actual byte(s), then run one normal `WHO_AM_I` read again:

```text
SPI> [0xF5 r]
```

If no-CS unexpectedly returns `0x47`, do not invent a failure. Record it and
switch to the lower-risk alternate of reading a non-identity register address
(`SPI> [0xF4 r]`) only after checking the current datasheet register map.

## Known-Bad Candidates

Chosen primary case for slice02: no-CS identity read as described above.

Deferred candidates, choose only if the primary case fails to produce a
distinct signature:

- disconnected MISO;
- wrong SPI mode;
- wrong register address;
- CS handling mistake that does not short or over-voltage any signal.

## Lykn Embedded-C Observation Headings

Record observations under these headings during live work:

- fixed-width integer needs;
- register constants and maps;
- bit masks and fields;
- byte buffers;
- explicit bus effects;
- transport boundary notes.

## Preliminary Lykn Embedded-C Observation Template

Use this shape in the eventual close report after live evidence exists:

| Heading | Observation to capture |
|---------|------------------------|
| fixed-width integer needs | Register addresses and values are byte-sized; status/config decoding should use explicit `u8` values and possibly `u16` for combined sensor words in later slices. |
| register constants and maps | Preserve constants for `WHO_AM_I`, `INT_STATUS`, `REG_BANK_SEL`, `GYRO_CONFIG0`, SPI read bit `0x80`, and expected identity `0x47`. |
| bit masks and fields | Decode `GYRO_CONFIG0` as full-scale bits plus ODR nibble; avoid raw magic writes in later C/Lykn examples. |
| byte buffers | SPI transactions are byte sequences with one address byte plus one or more data bytes; slice03 should preserve exact byte order. |
| explicit bus effects | Reads/writes require CS assertion, SPI mode, VOUT state, and timing; these are effects, not pure expressions. |
| transport boundary notes | Keep Bus Pirate terminal/BPIO2 details outside the eventual IMU register contract; the stable contract is register transactions plus electrical preconditions. |

## Hold-Open Notes

Rows F-1 through F-12 in the slice ledger remain open until live evidence
exists or the operator explicitly asks to close a deferred/no-live-evidence
attempt. This artifact index is pre-live preparation only.
