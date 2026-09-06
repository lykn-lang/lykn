# arc12 · test-topology — Arc Closing Report

**Assembled by:** CDC (Cowork) · **Date:** 2026-07-05
**Composition verdict: delivered** — and, unusually, already
**operator-reproduced**: Duncan's post-slice `make check && make test-docs`
ran green with single-run behavior observed, the same day the arc was
created, scoped, implemented, and verified. Formal sign-off rides the
combined three-arc gate (§4).

## 1. Capability + verdict

*Every test executes exactly once per `make check`; `make test-docs` tests
docs.* **Delivered and measured**: corpus 8×→1× (`make check`), 4×→0×
(`make test-docs`); doc phase 4 Deno startups → 1; `make test-docs` 1m52s →
2.6s; `make check` >2m → 1m04s; suite/doctest counts unchanged (1365/0 ·
673/0 · docs 475/0); targets honest (`test-suite`; `test-lykn` a documented
alias); `make check` is the documented canonical bar.

## 2. Slice walk (1 of 1)

slice01 · run-once-topology — **delivered** (`3612cad`, CDC-verified; A–D
all reproduced by code; TDD'd CLI gating test). Bonus latent fix: lint ran
before the binary it depends on was built.

## 3. Composition + bubble-up to the project

- **A-2/A-3 met** (census + timing; operator-observed). Formal census grep
  at the gate is now a one-command courtesy, not a cost.
- **Bubble-up:** the ×12 redundancy was the *toolchain-layer* instance of
  the drift genus arc11 audited at the code layer — target names that were
  honest once. Four beyond-scope finds filed **and instantiated** in
  project-plan §Post-0.6.0: the batch-compile lever (97 per-file `deno
  eval` spawns → one process — the next big speed win); stray-sibling
  double-run hardening (deno discovery of `test/` picks up stray
  `*_test.js`); freshness-guard false-positive scoping (`tests/*.rs` trips
  it); the `--compile-only`+`--docs` tidy. Minor open query: 473-vs-475
  doc-count reconciliation (one glance at the gate).
- No project-plan re-scope needed beyond P-17; the roadmap holds.

## 4. The combined three-arc gate (operator runbook — now minutes)

Duncan's 2026-07-05 `make check && make test-docs` green run already covers
the suite bars for all three arcs. Remaining demos:

```sh
which lykn                                   # ⚠ use ./bin/lykn below
# arc10 A-3 (5-form demo, Rust CLI):
for f in const let var function 'function*'; do echo "($f x 1)" > /tmp/t.lykn; ./bin/lykn compile /tmp/t.lykn; done   # 5 errors
echo '(kernel:var x 1)' > /tmp/t.lykn && ./bin/lykn compile /tmp/t.lykn      # → var x = 1;
# arc11 A-3 (three-moment, with the RIGHT binary this time):
find test -name '*_test.js' -delete
./bin/lykn test &  sleep 2 && find test -name '*_test.js' | wc -l           # → 0 (mid-run; SIGINT it after)
find test -name '*_test.js' | wc -l                                          # → 0
./bin/lykn test --compile-only && find test -name '*_test.js' | wc -l        # → 0
# arc12 A-2 (formal census, optional — already operator-observed):
# run make check, then count executions of surface/bind_test in the output   # → 1
```

Green + sign-off ⇒ **arc10, arc11, arc12 all flip Closed** (P-15/P-16/P-17
→ done; attested rows → reconciled). Then arc05.

## 5. Gate

**GATE: GO — signed off by the operator, 2026-07-05.** Suite bars
operator-reproduced (`make check && make test-docs` green, single-run
behavior observed; `lykn test` 1365/0 in 13s during the arc11 demo — the
topology win visible in the wall-clock); the formal census grep was waived
by the operator (already observed + CC-measured). A-2/A-3 → **reconciled**.
Slices: 1/1. Findings: 4 filed + instantiated; 1 minor query open
(473-vs-475 doc-count — carried on the Post-0.6.0 list's polish tier).
**arc12 CLOSED.**
