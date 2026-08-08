# arc10 · compiler-completion — Arc Closing Report

> **Reclose addendum (2026-08-08):** arc10 was reopened for
> `slice04 · no-else-if-expression-error`, surfaced by arc07 slice02 as
> `D-2608-W2HF`. That follow-up is now closed: no-else `if` in expression
> position fails `lykn check`/`compile` before invalid JS can be emitted. The
> original three-slice DD-58/DD-37 gate below remains historical truth; this
> addendum restores arc10 to **Closed**.

**Assembled by:** CDC (Cowork) · **Date:** 2026-07-05
**Composition verdict: delivered — pending the host composition run + operator
gate.** CDC assembled this close and cannot sign it off alone
(LEDGER-DISCIPLINE §B: composition rows are *reproduced at arc scale* by an
independent party; the doer of the composition ≠ its gatekeeper). §5 below is
the operator's runbook.

## 1. The capability, restated — and the verdict

From `arc-plan.md`: *make surface lykn actually the closed, clean namespace
DD-58 and DD-37 designed — so the language becomes what `philosophy.md` and
the guides already claim it is*: (1) DD-58 strict default-on for ordinary
`.lykn` compilation, with the `(kernel:<form> …)` escape; (2) DD-37 step 4,
the `_kernel` scaffolding removed.

**Verdict: delivered, on every compile path.** The 5 kernel-only declaration
heads are compile errors in surface on the Rust CLI (`compile`/`run`/`build`/
`check`), the JS API, doctests, the browser, and JSR consumers — user-written
*and* user-macro-emitted (A-6, Rust semantics) — with `kernel:` as the
sanctioned escape on both compilers (Rust-verbatim diagnostics, did-you-mean,
convergent output, corpus-guarded). The `_kernel` marker is gone, replaced by
the sanctioned-kernel registry (`kernel-mark.js`). Beyond the original
capability statement, the arc also landed the kernel-form parity guard and
the macro-boundary semantics decision recorded in DD-58.

## 2. The slice walk (4 of 4 — matches the arc-plan breakdown)

| Slice | Outcome | Close |
|-------|---------|-------|
| slice01 · dd58-strict-default | **Delivered** — Rust-CLI strict default-on (5 heads error; `kernel:` resolves; `.lyk` exempt; `--no-strict` harness-only); guides migrated. Bubble-up: the JS-parity gap → slice02. | `faee8a1`, CDC-verified 2026-06-30 |
| slice02 · js-dd58-parity | **Delivered** — JS compiler strict default-on + `kernel:` escape (`kernel-forms.js` mirror, whitelist parity CDC-reproduced 92=92); browser + `lykn test` codegen extension-aware; 26-site migration; fences flipped. Bubble-ups: A-6 asymmetry, A-7 duplication, A-8 corpus gap. | `feb056c`, CDC-verified 2026-07-05 |
| slice03 · dd37-step4-kernel-removal | **Delivered** — `_kernel` → WeakSet registry (zero-grep reproduced); A-6 enforced (post-pass2 sweep; divergence runtime-confirmed first); A-7 parity guard in `make check`; A-8 corpus rows. | `2f6a84d`, CDC-verified 2026-07-05 |
| slice04 · no-else-if-expression-error | **Delivered** — Rust `check`/`compile` reject no-else `if` in expression position before codegen; statement-position no-else `if` and expression-position else-branch `if` remain valid; DD-50 corpus/parity fixtures pass. | [`slice04 closing-report`](./slice04-no-else-if-expression-error/closing-report.md), CDC-verified 2026-08-08 |

No slice dropped, deferred, or missing.

## 3. The composition check (arc-ledger per-row walk)

| Row | Status | Evidence / disposition |
|-----|--------|------------------------|
| A-1 slice01 closed | done | attested ptr (its `cdc-verification.md`) |
| A-2 slice02 closed | done | attested ptr |
| A-5 slice03 closed | done | attested ptr |
| A-3 surface prevents the 5 heads, **both compilers** | **met (attested + code-reproduced)** | per-slice evidence + committed tests + corpus rows; **awaiting arc-scale host reproduction (§5)** |
| A-4 whole tree green after migration | **met (attested)** | per-slice greens; final 1365/0 · 673/0 · `make check` ✓; mycelium clause **deferred** (operator repo-only boundary; re-entry = downstream-migration follow-up); **awaiting host reproduction (§5)** |
| A-6 macro-boundary asymmetry | done | operator decision (Rust semantics, 2026-07-05) + slice03 F-1/F-4 + DD-58 refinement entry |
| A-7 kernel-form duplication | done | parity guard in `make check` (seeded-mismatch demo) |
| A-8 `kernel:` corpus rows | done | 5 rows, green |
| A-9 slice04 closed | done | slice04 `closing-report.md` + `cdc-verification.md`; N-1...N-8 done |
| A-10 no-else `if` expression-position rejects before invalid JS | done | negative fixture fails `check`/`compile` with DD-50 diagnostic; positives and DD-50 suites pass |

**Silent-drop diff at arc scale:** capability-as-specified vs delivered —
nothing the arc promised is missing. Named deviations, all disclosed:
mycelium (deferred by design, tracked); the kernel-form set remains
*duplicated-but-guarded* rather than single-sourced (A-7 note); two cosmetic
defects routed for one-line drive-bys (stale `kernel-mark.js:10` comment;
stale `macroEnv.has('bind')` guard, pre-existing).

## 4. Accumulated arc-plan change log (drift, visible in one place)

v1.0 two-slice plan (strict-default + `_kernel`) → v1.1 slice01's bubble-up
inserted **js-parity as slice02** (the arc's biggest unanticipated finding:
"enforced" must hold on *every* backend) → v1.2 CDC scoped slice02 +
reconciled ledger drift (A-1 stale, A-2 re-pointed, A-5 added) → v1.3
slice02 closed; CDC review added **A-6/A-7/A-8** (macro-boundary asymmetry,
set duplication, corpus gap) → v1.4 operator decided A-6 (Rust semantics)
and bundled the closeout into slice03 → v1.5 slice03 closed, arc → CLOSING.
Net: 2 planned slices became 3; 4 ledger rows became 8; every change is
dated and attributed in the Version History.

## 5. Host composition run (operator runbook — reproduces A-3/A-4 at arc scale)

```sh
make build-release                       # rebuild-first, always
# A-3, Rust path (each must error):
for f in const let var function 'function*'; do echo "($f x 1)" > /tmp/t.lykn; ./bin/lykn compile /tmp/t.lykn; done
echo '(kernel:var x 1)' > /tmp/t.lykn && ./bin/lykn compile /tmp/t.lykn   # → var x = 1;
# A-3, JS path + A-6 + guards + corpus (all inside the suites):
make check                               # build + lint + test
make test-docs                           # doctest path (JS compiler, strict)
lykn test                                # expect 1365 | 0 (incl. kernel-escape rows)
deno test --config project.json -A test/ # expect 673 | 0 (incl. dd58-strict + parity guard)
```

Green run + operator sign-off here = the gate. On sign-off: flip the arc to
**Closed** in `arc-plan.md`/README/status.html and reconcile the attested
rows to *reconciled*.

## 5a. Reclose gate for slice04 (2026-08-08)

The reopened follow-up gate is smaller than the original DD-58/DD-37 composition
run: it verifies `D-2608-W2HF` and the DD-50 context boundary.

```text
./bin/lykn check /private/tmp/arc10-no-else-negative.lykn
./bin/lykn compile /private/tmp/arc10-no-else-negative.lykn
./bin/lykn check /private/tmp/arc10-no-else-statement.lykn
./bin/lykn compile /private/tmp/arc10-no-else-statement.lykn
./bin/lykn compile /private/tmp/arc10-no-else-positive.lykn
cargo fmt --check
cargo test -p lykn-lang
cargo test -p lykn-cli
deno test --config project.json -A test/forms/dd-50.test.js test/forms/dd-50.7.test.js
./bin/lykn test test/forms/dd-50_test.lykn
make test-docs
make check-cited-paths
git diff --check
```

Green run + commit = A-9/A-10 done and arc10 closed again.

## 6. Bubble-up to the project

1. **Capability delivered as the roadmap defined it** — arc10 was created to
   make DD-58 true rather than aspirational, sequenced before arc05; that
   holds, and **arc05 (linter) is now unblocked** with its corpus division
   sharp: the compiler owns the closed declaration-form namespace (now
   enforced everywhere, incl. the macro boundary); the linter owns
   idiom/style (`==`/`&&`/`require`/IIFE, …).
2. **What the arc revealed that the project plan didn't anticipate:**
   (a) *"enforced" is a per-backend claim* — the arc doubled in scope when
   the JS backend turned out lax; the project-level learning is recorded in
   the issues log and now guarded by tests rather than vigilance;
   (b) **the project ledger has no row for arc10** (P-1…P-14 predate it) —
   **P-15 "arc10 closed + composed" added** to `project-plan.md` (v1.15);
   (c) release-notes obligations accumulated here for **arc09**: bare
   kernel-only forms error under the JS API/browser; `(kernel:…)` in JS
   changed meaning (bogus member call → real escape); macro authors emitting
   bare kernel decls must switch to `(kernel:…)` templates.
3. **Silent-drop diff rolled up:** nothing the roadmap expected from arc10
   is missing; the deferred mycelium migration remains a *project-level*
   follow-up (it pre-dates this arc and survives it).

Routed onward: browser-example `(= el:inner-HTML …)` equality no-op → arc07;
`actions/checkout@v4→v5` (pre-existing) + release notes → arc09; downstream
migration → project follow-up.

## 7. Gate

**GATE: GO — signed off by the operator, 2026-07-05** (host run 23:29–23:32
with `./bin/lykn`, post the stale-PATH-binary lesson): the 5-form demo
produced all five kernel-only errors verbatim with suggestions; the
`kernel:` escape resolved (`var x = 1;`); suites reproduced across the day's
sessions (`make check` ✓, `lykn test` 1365/0, deno 673/0, doctests green).
A-3/A-4 → **reconciled**. Slices: 3/3. Findings dispositioned: 8 arc-ledger
rows walked; bubble-ups all routed (§3/§6). **arc10 CLOSED.**

*(First run, 2026-07-05 22:05, was partially invalid — stale PATH binary;
preserved above for the record.)*
