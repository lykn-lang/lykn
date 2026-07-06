# arc11 · source-only-test-build — Arc Closing Report

**Assembled by:** CDC (Cowork) · **Date:** 2026-07-05
**Composition verdict: delivered — pending the host composition run +
operator gate** (LEDGER-DISCIPLINE §B: CDC assembled this close and cannot
sign it off alone). §5 is the operator's runbook — it can be run **together
with arc10's** (same rebuild, overlapping suites).

## 1. The capability, restated — and the verdict

From `arc-plan.md`: *finish philosophy #1 (source-only tree) for the last
remaining source-tree emitter, and close out the class of failure this
instance exemplifies* — the operator-named *delayed-deferred-buried-then-
lost* plague.

**Verdict: delivered.** `lykn test` compiles to `target/lykn/test/` (wiped
per run, gitignored) — generated JS never touches the source tree at any
moment; the reserved `--out-dir` is live and public; the April fossil that
broke unscoped `deno test` is gone; the doctest dir is `target/lykn/`-
aligned; and the buried-intent inventory is **empty-or-tracked** with a
reproducible sweep-diff as evidence — every deferred intent now has a
watcher (project rows, arc05 seed, conventions docs), and the trivial ones
are simply fixed.

## 2. The slice walk (2 of 2 — matches the arc-plan breakdown)

| Slice | Outcome | Close |
|-------|---------|-------|
| slice01 · test-out-dir | **Delivered** — `--out-dir` wired (`target/lykn/test/`, wipe-per-run); F-1 recon caught + fixed 7 location-dependence items before wiring; fossil deleted; `.gitignore` hardened; three-moment demo clean. One amended mechanism (the `project.json` exclude — empirically invalidated, goal met without it; A-5 was:-noted). | `75c9cc2`, CDC-verified 2026-07-05 |
| slice02 · buried-intent-audit | **Delivered** — 13-item disposition table (incl. 4 newly-found items, all tracked); 3 fixes wired; SetSymbol assessed + routed (not removed); `test/CONVENTIONS.md` + CLAUDE.md; doctest-dir harmonized; sweep-diff clean (CDC-reproduced). | `4f2a628`, CDC-verified 2026-07-05 |

No slice dropped, deferred, or missing.

## 3. The composition check (arc-ledger per-row walk)

| Row | Status | Evidence / disposition |
|-----|--------|------------------------|
| A-1 slice01 closed | done | attested ptr (its `cdc-verification.md`) |
| A-2 slice02 closed | done | attested ptr |
| A-3 source tree `.js`-free at every moment | **met (attested)** | slice01 three-moment transcript (mid-run / SIGINT / `--compile-only` / `--docs --compile-only` all 0); at-rest state CDC-reproduced. **Reproduce at arc scale (§5)** |
| A-4 buried-intent inventory empty-or-tracked | **met (CDC-reproduced at slice scale)** | slice02 table + CC sweep-diff + CDC's independent re-run (8 hits, zero orphans); tracked homes instantiated. **Re-run on host at close (§5)** |
| A-5 unscoped `deno test` doesn't abort on artifacts | **met (attested; amended v1.2)** | fossil deleted (CDC-reproduced); bare specifiers resolve; canonical command + unsupported-invocation caveat documented. **Spot-check on host (§5)** |

**Silent-drop diff at arc scale:** nothing promised is missing. Disclosed
deviations: the exclude mechanism (declined with empirical rationale — A-5
amended, goal met); `set-symbol!` removal deliberately **not** done (routed
to the 0.7.0 decision — that's the discipline working, not a drop).

## 4. Accumulated arc-plan change log

v1.0 created (operator observation + CDC ground-truthing; 2 slices) → v1.1
CC's deno-test investigation folded in (the fossil, the missing exclude, the
import-map dissolution of the April blocker; +F-7, +A-5) → v1.2 slice01
closed, **A-5 amended** (exclude mechanism empirically invalidated; goal
stands) → v1.3 slice02 scoped (9-item seed + benign filter) → v1.4 slice02
closed, A-4 CDC-reproduced, arc → CLOSING. Net: the arc *absorbed* a live
operator-hit bug (the TS2307 abort) mid-flight and grew two rows for it;
every change dated and attributed.

## 5. Host composition run (operator runbook — combinable with arc10's §5)

```sh
make build-release                          # rebuild-first
which lykn                                  # ⚠ if this isn't ./bin/lykn, use ./bin/lykn
                                            #   explicitly below — a stale PATH binary
                                            #   (e.g. an old `cargo install`) sibling-emits
                                            #   and invalidates the A-3 moments
                                            #   (observed in the 2026-07-05 22:05 gate run)
find test -name '*_test.js' -delete         # clear any stale-binary debris (safe: 0 tracked)
# A-3: three-moment (second terminal for the mid-run check)
./bin/lykn test &  sleep 2 && find test -name '*_test.js' | wc -l   # → 0 (mid-run)
# (let it finish) … kill one mid-run too, then:
find test -name '*_test.js' | wc -l                            # → 0 (post-SIGINT)
./bin/lykn test --compile-only && find test -name '*_test.js' | wc -l # → 0
# A-4: sweep re-run — every hit must map to slice02's disposition table:
grep -rniE "TODO|FIXME|XXX|for now|future enhancement|future:|known limitation" crates/*/src packages/ --include="*.rs" --include="*.js"
# A-5: unscoped spot-check (expect: no TS2307 from target/**):
deno test --config project.json 2>&1 | head -20
# Full bar:
make check && make test-docs                # expect green; lykn test 1365|0, deno 673|0
```

Green + operator sign-off = the gate. On sign-off: flip arc11 to **Closed**
(arc-plan header, README, status.html, P-16) and reconcile attested rows.

## 6. Bubble-up to the project

1. **Capability delivered as the roadmap defined it** — and **P-7's DoD
   demo is now unconditionally runnable** (the "at rest only" caveat is
   gone), which is what arc09 needed from this arc.
2. **What the arc revealed the project plan didn't anticipate:**
   (a) the buried-intent audit found **4 real functional deferrals** the
   plan didn't know about (genfunc multi-clause silent drop being the most
   substantive) — now tracked in **project-plan §Post-0.6.0 candidates**
   (v1.17) with the `set-symbol!` 0.7.0 decision;
   (b) **arc05's seed grew** two lint rules that enforce what the compiler
   can't (`test/CONVENTIONS.md`'s location-independence MUSTs);
   (c) a reusable process asset: the **benign-filter rule** and the
   sweep-diff pattern — a future periodic audit costs one grep + one diff.
3. **Silent-drop diff rolled up:** clean.

## 7. Gate

**Gate: PENDING — first run (2026-07-05 22:05) partially invalid; A-3
re-run required.** The operator's first gate run was made with a **stale
PATH binary** (bare `lykn` ≠ `./bin/lykn`; the old binary sibling-emitted →
mid-run 5, post-`--compile-only` 97 files in `test/` — while the fresh
`./bin/lykn` used by `make check` in the same session correctly wrote 97
files to `target/lykn/test/`). Diagnosed by CDC from the transcript +
tree state. **Valid from that session:** A-4 sweep ✓ (8 hits, exact table
match), A-5 ✓ (no TS2307 from `target/**`; the observed failures came from
`.worktrees/` — new finding, below), `make check` + `make test-docs` ✓
(these use `./bin/lykn`). **Outstanding: the A-3 three-moment demo with
`./bin/lykn`** (runbook amended above).

**Two findings from the gate run itself (routed):**
1. **Staleness trap, third costume — the PATH binary.** issues-log #3
   guarded `bin/lykn` and the build dir; a `cargo install`ed `lykn` on
   PATH is a third staleness channel, and the new `*_test.js` gitignore
   *masks* its sibling debris from git. Candidate guard (route to arc09 or
   a polish row): `lykn test` warns when it isn't the repo's `./bin/lykn`
   while one exists, or the version string carries the build commit.
2. **Unscoped `deno test` also walks `.worktrees/`** (4 stale worktree
   checkouts; 2 test failures from old branch code ran during the A-5
   spot-check). Reinforces "unscoped is unsupported." Per the 2026-06-29
   reconciliation all worktree branches are 0-ahead → **the worktrees are
   deletable (operator call)**; `test/CONVENTIONS.md`'s unscoped caveat
   should mention `.worktrees/` when next touched.

Slices: 2/2 (matches breakdown). Findings dispositioned: 13 (slice02 table)
+ the A-5 amendment + the 2 gate-run findings above. arc10's gate items
from the same session (its §5 suites) are green; its 5-form demo transcript
is still wanted with `./bin/lykn` for the same reason.
