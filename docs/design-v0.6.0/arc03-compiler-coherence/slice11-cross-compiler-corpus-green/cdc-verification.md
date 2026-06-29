# Slice 11: cross-compiler-corpus-green — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-28
**Verdict: accepted.** All nine rows verified to the strength the verifying
environment allows; arc03 row **A-6 → done**.

## Verification environment + honest limits

CDC runs in a Linux sandbox; CC's work targets macOS + Deno. Two consequences,
stated up front per calibrated-honesty:

- **Reproducible here:** git history/diffs, and **full code review of every
  changed artifact** (CDC read the actual source, not CC's summary — CAP
  evidence-access).
- **Not reproducible here:** the runtime suites (`lykn test` corpus, `cargo
  test`, `clippy`, `deno test`) — `deno` is absent and CC's macOS binary can't
  execute on Linux. These rows are **CC-attested + CDC code-verified**; full
  runtime reproduction is deferred to an operator host re-run (commands in the
  slice closing-report), which lifts them `attested → reconciled`.

## Per-row verification

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 async decl trailing `;` | **Code-reviewed** `emit.rs`: `is_async_declaration` correctly matches `(async (function\|function* …))`; `emit_statement` routes them through the declaration path (no `;`); async arrows/lambdas stay expression statements. Logic correct by inspection; matches the documented intent. | reproduced (code) + attested (runtime) |
| F-2 generators | Same fix path (`function*` covered by `is_async_declaration`); correct by inspection. | reproduced (code) + attested |
| F-3 DD-49 gensym | CC's diagnosis (stale build dir lacked normalizer transform #3; source normalizer → `EQUAL? true`) is consistent with the normalizer I read in `helpers.js`. **Not a codegen defect.** | attested + reasoned |
| F-4 DD-52 import-macros | CC's diagnosis (stale `helpers.js` predated the `--source-context-path` fast-follow) is consistent with the fast-follow being present in source. **Not a Rust path bug.** | attested + reasoned |
| F-5 DD-53 network | **Code-reviewed** `dd-53.test.js`: reachability probe (`fetch jsr.io/meta` + `AbortSignal.timeout(5000)`, try/catch → skip). Correctly distinguishes permission from reachability. | reproduced (code) + attested |
| F-6 corpus green | CC-attested `1293/0` across 3 runs. **Not runnable here** (no Linux binary). Deferred to host. | attested |
| F-7 staleness guard | **Code-reviewed** `main.rs` `check_cross_compiler_freshness`: checks (1) binary vs `crates/**/*.rs` and (2) `target/lykn/build/` vs `packages/**/*.{js,lykn}`, both with loud `Err` + exit, guarded by `!compile_only`. Makefile `fresh-artifacts` prereq confirmed on `test-js`/`test-lykn`. Covers **both** staleness traps. | reproduced (code) + attested (firing) |
| F-8 no normalizer weakening | **git-verified:** last change to `packages/testing/helpers.js` is commit `e89e0ec` (pre-slice11); slice11 commit `f37cf49` does not touch it. | reproduced |
| F-9 no regressions | CC-attested (`cargo test` green, `deno 657/0`, `clippy` exit 0). Not runnable here. Deferred to host. | attested |

## Accepted correction (records into arc03)

CC surfaced a real correction to the arc03 closing-report's classification:
**F-3 and F-4 were never compiler defects** — both were the *stale build dir*
trap (a second, separate trap from the stale *binary* arc03 §5 #5 named). So of
the 6 residuals from the A-2 run: **1 root-cause codegen quirk** (async trailing
`;`, cosmetic, 3 failures) + **2 stale-build-dir artifacts** + **1 inherent
gensym** (absorbed by transform #3) + **1 network gate**. The "0 semantic
divergences" finding stands and is *sharpened*: the only genuine Rust↔JS codegen
divergence in the set was cosmetic, now fixed. This is recorded in arc03's
closing-report Correction addendum.

## Disposition

- Silent-drop check: 9 rows opened, 9 closed (9 done). No drops. ✓
- Scope-out items (cargo-fmt red, coverage-beyond-form-codegen, DD-58/DD-37
  behavior) correctly untouched. ✓
- Discipline: compiler fix preferred over normalizer extension (F-8 honored). ✓
- **arc03 A-6 → done.** arc03 may close (see arc03 `closing-report.md`
  Correction). **Operator host re-run recommended** to reconcile F-6/F-9.

**Drive-by confirmed:** the dead `assets/ai/LEDGER_DISCIPLINE.md` symlink is
fixed (commit `1ef8744`) — now targets the hyphenated `LEDGER-DISCIPLINE.md`.
