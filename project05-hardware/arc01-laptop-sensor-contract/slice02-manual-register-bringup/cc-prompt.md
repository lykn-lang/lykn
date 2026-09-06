# CC Prompt - arc01 slice02: manual register bringup

You are CC in the execution seat. CDC has opened the first live bench slice for
the Lykn hardware 0.8.0 research track. Your job is to use the slice01 bench
contract to manually prove laptop -> Bus Pirate -> IMU register communication,
then close the slice with transcript evidence.

Do not start live bench work unless slice01 is closed or Duncan explicitly
overrides the sequence.

## Branch and repo

Work in:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/0.8.x
```

Branch:

```text
release/0.8.x
```

Do not write to `main`.

## Required reading

Read these before touching hardware:

1. `AGENTS.md`
2. `docs/hardware-v0.8.0/README.md`
3. `docs/hardware-v0.8.0/project-plan.md`
4. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/arc-plan.md`
5. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice01-procurement-and-bench-contract/closing-report.md`
6. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice02-manual-register-bringup/slice-doc.md`
7. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice02-manual-register-bringup/ledger.md`
8. Current Bus Pirate terminal/protocol docs for the selected bus mode.
9. Current ICM-42688-P datasheet/register reference.
10. Current chosen board documentation.

If `slice01/closing-report.md` does not exist, stop before live work and report
that this slice is blocked on slice01 closure unless Duncan overrides.

## Assignment

Use the slice01 wiring/safety/artifact contract to perform the first manual
register bringup.

The close report must include:

1. Source material read, with one-line role for each source.
2. Preconditions:
   - slice01 close read;
   - hardware present;
   - selected board confirmed;
   - wiring table followed;
   - safety checklist complete;
   - artifact home ready.
3. Hardware-as-used:
   - Bus Pirate hardware/firmware/status information if available;
   - IMU board name/revision/marking;
   - bus mode and speed;
   - voltage/current-limit settings;
   - wiring-as-used table.
4. Power-up result:
   - command/status transcript;
   - voltage/current status if available;
   - any over-current or unexpected status.
5. Identity/status register read:
   - exact command sequence;
   - register name/address;
   - reply bytes/value;
   - interpretation;
   - repeated/witnessed result.
6. Configuration write/readback:
   - selected safe register;
   - write value/mask;
   - readback value;
   - interpretation.
7. Known-bad case:
   - selected failure;
   - why it is safe/reversible;
   - observed transcript/signature;
   - diagnosis.
8. Artifact index:
   - transcript filenames/paths;
   - captures/logs if any;
   - notes/photos/sketches if any.
9. Slice03 automation seed:
   - manual commands to script;
   - expected values;
   - tolerated variation;
   - negative case to preserve.
10. Preliminary Lykn embedded-C observations:
    - fixed-width integer needs;
    - register constants/maps;
    - bit masks/fields;
    - byte buffers;
    - explicit bus effects;
    - transport boundary notes.
11. Row-by-row ledger walk for F-1 through F-12.
12. Bubble-up to arc01:
    - whether slice03 should use BPIO2, terminal transcript automation, or
      another path;
    - whether arc01 slice breakdown or ledger needs adjustment;
    - whether any findings must update `docs/design-v0.8.0/`.

## Constraints

- Manual register bringup only.
- Do not write BPIO2 automation in this slice.
- Do not write STM32 firmware.
- Do not perform FIFO/interrupt/FSYNC work beyond an optional tiny sanity read
  if it falls naturally out of identity/config success.
- Do not claim a successful read without saved transcript evidence.
- Do not perform unsafe fault injection. The known-bad case must be reversible
  and low risk.
- If live hardware behavior diverges from slice01's wiring/safety contract,
  stop and record the deviation before continuing.

## Verification

Run document/planning checks:

```sh
git diff --check
```

Run this only if tracked path citations are added/changed:

```sh
make check-cited-paths
```

Bench verification:

- repeat or witness the identity/status read;
- repeat or witness the configuration readback;
- save transcripts in the agreed artifact home;
- confirm the known-bad case produces a distinct signature.

## Required close

Write `closing-report.md` only when every ledger row has a final disposition.
If hardware is absent, unsafe, or documentation is insufficient, mark affected
rows `deferred` with concrete re-entry conditions. Do not leave rows open.

Use the shared trailers for any assistant-authored commit if the operator asks
for a commit:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
