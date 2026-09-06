# Slice 02: shape-rule-corpus — Ledger

12 verified lint rules + 2 recon-gated compiler fixes + ID-03 measurement +
real dogfood. Contract source: slice01's F-1 table + operator decisions
2026-07-06. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.
Rebuild-first. 6 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **The 12 rules implemented** — each with both-direction fixtures (bad flagged at head-atom span with suggestion; good silent); conventions rules path-scoped to test files; severities per the slice-doc table | per-rule tests; fixture count = 12 × ≥2; snapshot extended + reviewed | serious | slice01 F-1 table | open | | for-in-on-arrays conservative (prefer misses over false positives) |
| F-2 | **ID-03 severity measured, not assumed** — the rule run over the full repo corpus; hit list with per-hit judgment (true/false positive); severity proposed from the data (warn / info / drop) | the measurement table + proposal in the closing report | serious | DD-59 flag + slice01 F-1 | open | | the operator confirms the proposal at close — surfaced, not decided |
| F-3 | **ID-44 compiler fix** — `(for-of (const …) …)` is a compile error with a helpful diagnostic on the **Rust** compiler; **JS compiler checked on the same input first** and fixed-or-surfaced (backends must agree on rejection); regression tests + a cross-compiler corpus row; guide-09's "Throws" claim becomes true | compile the repro → error both backends; corpus row green; `deno check` never sees `for (const const …)` again | serious | slice01 F-1 (compiler bug) + operator decision | open | | Principle 3: no silent invalid output at rc=0. **Self-stop if the fix exceeds a validator guard** |
| F-4 | **ID-42 reserved-param disallow, recon-gated** — recon delivers: shadowing-semantics confirmation, the proposed reserved set (dangerous shadowers only), blast-radius grep (repo + guides), both-backend assessment. **If small: compile error both backends + tests. If large: STOP — report the data; lint-warn is the measured fallback (operator re-decides)** | recon table in the closing report; then either the error demo on both backends or the fallback report | serious | operator decision 2026-07-06 ("simply disallow it") | open | | breaking change if implemented — flag for arc09 release notes either way |
| F-5 | **Real dogfood** — `./bin/lykn lint` with the full corpus over all repo `.lykn` sources; every finding fixed or acknowledged in a triage table; ends exit 0 or fully-acknowledged | the triage table; the final run transcript | serious | arc A-5 (at slice scale) | open | | expect prefer-surface-operators / or-for-defaults to fire — that's the signal, handle honestly |
| F-6 | **Green bar** — `make check` ✓; suites at baseline (1365/0 · 673/0 + the new corpus row(s)); snapshots reviewed never auto-accepted; `./bin/lykn` in all transcripts | suite runs; snapshot review noted | serious | standing bar | open | | |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> F-3/F-4 are the scope risks: both are recon-gated with self-stop — a
> validator guard and a name check, not emitter rewrites; if either grows,
> surface with data rather than grind. Breaking-change notes (ID-44
> rejection; ID-42 if implemented) → arc09. The DD-59 addendum (corpus
> 19→final, the two compiler-enforcement promotions) is CDC's at close.
