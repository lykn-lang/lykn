# CC Prompt - arc01 slice01: procurement and bench contract

You are CC in the execution seat. CDC has opened the first hardware-coupled
Lykn 0.8.0 slice. This is a planning/procurement slice only: select the exact
first-order arc01 kit and write the bench contract that the live bringup slice
will follow. Do not energize hardware.

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

Read these before editing close artifacts:

1. `AGENTS.md`
2. `docs/hardware-v0.8.0/README.md`
3. `docs/hardware-v0.8.0/project-plan.md`
4. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/arc-plan.md`
5. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice01-procurement-and-bench-contract/slice-doc.md`
6. `docs/hardware-v0.8.0/arc01-laptop-sensor-contract/slice01-procurement-and-bench-contract/ledger.md`
7. `docs/design-v0.8.0/project-plan.md`
8. `docs/design-v0.8.0/arc01-c-target-research/arc-plan.md`
9. `docs/design-v0.8.0/arc01-c-target-research/initial-thoughts.md`
10. Current Bus Pirate 6 hardware, BPIO2, and logic-analyzer documentation.
11. Current documentation and pinout/schematic material for the selected
    ICM-42688-P board candidates.

Use current source pages for product availability and technical claims. If
current sources disagree with earlier planning notes, report the discrepancy
instead of smoothing it over.

## Assignment

Close the procurement and bench-contract slice without performing live bench
work.

Produce a `closing-report.md` in this slice directory with:

1. Source material read, with one-line role for each source.
2. Exact arc01 first-order purchase list:
   - item;
   - vendor/source;
   - quantity;
   - purpose;
   - buy/defer decision;
   - any availability caveat.
3. First IMU board decision:
   - selected board;
   - rejected/deferred alternate;
   - reason tied to pin exposure, docs, stock, mechanical fit, or order
     consolidation.
4. First bus mode decision:
   - SPI-first or I2C-first;
   - board jumper/solder-bridge implications;
   - why the other mode is deferred.
5. Wiring/pin table for the first live test:
   - Bus Pirate lead/pin;
   - IMU board pin;
   - signal;
   - direction;
   - expected voltage;
   - notes/risk.
6. Pre-power safety checklist:
   - board revision/part recorded;
   - mode jumpers checked;
   - 3.3 V rail and GND identified;
   - Bus Pirate power/current limit selected;
   - no 5 V on 3.3 V-only signals;
   - chip select state handled;
   - visual/continuity checks complete.
7. Artifact-home decision for slice02:
   - terminal transcripts;
   - logic captures;
   - exported logs/CSV;
   - wiring photos/sketches;
   - notes/index.
8. Slice02 starting checklist:
   - hardware present;
   - docs present;
   - pre-power checks complete;
   - first commands/observations to attempt.
9. Row-by-row ledger walk for F-1 through F-10.
10. Bubble-up to arc01:
    - whether slice02 can proceed;
    - whether `arc-plan.md` or `project-plan.md` must change;
    - any deferred decisions with re-entry conditions.

## Constraints

- Do not energize the IMU or run Bus Pirate register commands in this slice.
- Do not write STM32 firmware.
- Do not write Lykn compiler code.
- Do not buy/plan the entire project cart; keep scope to arc01's first live
  component contract.
- Do not silently select both ICM-42688-P boards for comparison. If both seem
  necessary, write that as an operator decision request or follow-up scope.

## Verification

Run document/planning checks:

```sh
git diff --check
```

Run this only if tracked path citations are added/changed:

```sh
make check-cited-paths
```

Also manually verify the board pinout and voltage requirements against the
wiring and safety tables. Record the source used for that manual verification.

## Required close

Write `closing-report.md` only when every ledger row has a final disposition.
If a row cannot close because a product page, schematic, or decision is missing,
mark it `deferred` with a concrete re-entry condition. Do not leave rows open.

Use the shared trailers for any assistant-authored commit if the operator asks
for a commit:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
