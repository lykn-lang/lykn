# arc10 · compiler-completion — Arc Closing Report

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

## 2. The slice walk (3 of 3 — matches the arc-plan breakdown)

| Slice | Outcome | Close |
|-------|---------|-------|
| slice01 · dd58-strict-default | **Delivered** — Rust-CLI strict default-on (5 heads error; `kernel:` resolves; `.lyk` exempt; `--no-strict` harness-only); guides migrated. Bubble-up: the JS-parity gap → slice02. | `faee8a1`, CDC-verified 2026-06-30 |
| slice02 · js-dd58-parity | **Delivered** — JS compiler strict default-on + `kernel:` escape (`kernel-forms.js` mirror, whitelist parity CDC-reproduced 92=92); browser + `lykn test` codegen extension-aware; 26-site migration; fences flipped. Bubble-ups: A-6 asymmetry, A-7 duplication, A-8 corpus gap. | `feb056c`, CDC-verified 2026-07-05 |
| slice03 · dd37-step4-kernel-removal | **Delivered** — `_kernel` → WeakSet registry (zero-grep reproduced); A-6 enforced (post-pass2 sweep; divergence runtime-confirmed first); A-7 parity guard in `make check`; A-8 corpus rows. | `2f6a84d`, CDC-verified 2026-07-05 |

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

**Gate: PENDING** — operator (Duncan): host composition run (§5) + go/adjust
sign-off. Slices: 3/3 (matches breakdown). Findings dispositioned: 8 arc-ledger
rows walked; slice-level bubble-ups all routed (see §3/§6).
