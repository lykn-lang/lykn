# compileBoth Fast-Follow Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-16-compileboth-source-context-path-closing-report.md`
**Reviewed at:** 2026-05-16
**Disposition:** **Accepted with one methodology finding.** All 8
acceptance criteria are met as written. The implementation is
structurally clean and matches the prescribed shape exactly. One
substantive concern: criterion F-4 is met *literally* but the M16-6
test's `compile-both` invocation doesn't exercise the directory-path
resolution that was the original substantive intent — because of CC's
fast-follow #1 finding (an unrelated import-macros output divergence).
This is a real issue, but it's primarily a finding about ledger-
criterion drafting, not CC's implementation. Iteration count: 1 of 5.

---

## Protocol checklist (LEDGER_DISCIPLINE CDC protocol)

| Requirement | Status | Notes |
|---|---|---|
| Row count: 8 → 8 walked | ✓ | F-1 through F-8 all addressed |
| Every done row: evidence reproducible | ✓ (with caveats) | Most verified via grep; F-1 verified via source (sandbox can't run binary); F-5 trusted via CC's reported counts |
| No silent drops | ✓ | All rows have explicit status |
| Spec-softening check | ⚠ | F-4 literal-vs-substantive gap — see below |
| Partial-adoption check | ✓ | Flag applied at exactly one site (cmd_compile + compileBoth) |
| Backward-compat invariant | ✓ | `compile_source` signature unchanged; default `None` path preserves behaviour |
| Substrate-rule compliance section | ✓ | Four rules addressed |
| Fast-follow findings logged | ✓ | Two: import-macros output divergence + compile_file_with_dts dead code |

---

## Per-row verification (independent reproduction)

### F-1 — Flag exists on `lykn compile` ✓ (source-verified)

The Mac binary `./bin/lykn` won't execute in the Linux sandbox
(`Exec format error`), so I can't run the help-text check directly.
Verified via source instead:

- `crates/lykn-cli/src/main.rs:56` — `source_context_path: Option<PathBuf>` field on `Compile` clap variant.
- Doc comment is well-written: explains the use case (compileBoth) and the behaviour (resolve as if source lives at PATH).
- `#[arg(long, value_name = "PATH")]` — clap setup is correct.

### F-2 — Plumbing via synthetic path; `compile_source` signature unchanged ✓

- `compile_source` signature: `pub fn compile_source(source: &str, file_path: Option<&Path>, strip_assertions: bool, kernel_json_only: bool)` — unchanged from pre-change. ✓
- `source_context_path` references in main.rs: 5 matches (field, destructure, parameter, routing logic).
- The routing in `cmd_compile` matches the prescribed shape:
  ```rust
  let resolve_path: std::path::PathBuf = match source_context_path {
      Some(ctx) => ctx.join("__compileBoth__.lykn"),
      None => file.to_path_buf(),
  };
  ```
  Synthetic-path approach used as specified. Decision local to
  `cmd_compile`; downstream signatures unchanged. ✓

### F-3 — `compileBoth` passes `--source-context-path` with `Deno.cwd()` ✓

```js
const projectRoot = Deno.cwd();
const proc = new Deno.Command(lyknBin, {
  args: ["compile", "--source-context-path", projectRoot, tmpPath],
  ...
}).outputSync();
```

Matches the prescribed shape exactly.

### F-4 — M16-6 test uses `compile-both`; stale comment gone — *literal criterion met; substantive intent unmet*

**Literal verification:**
- `grep -c "compile-both" test/forms/dd-52-import-path-convergence_test.lykn` → 2. ✓
- `grep -c "compileBoth cannot test" test/forms/...` → 0 (stale comment gone). ✓

**Substantive concern:** I read the test content. Two test cases:

1. The first uses `compile` (JS-only) on an `(import-macros "./packages/testing" ...)` source. Verifies the JS expander's directory-path resolution. ✓ for the JS-side substantive feature.
2. The second uses `compile-both` on `(bind x 42)`. **This does not exercise import-macros at all.** It just verifies `compile-both` works on a trivial source.

The original M16-6 substantive intent was: cross-compiler verification of directory-path import-macros resolution. The `--source-context-path` flag was added specifically to enable this. CC's test as written satisfies the *flag works at all* claim but doesn't verify the *substantive convergence on directory-path imports* claim.

CC's fast-follow #1 ("import-macros output divergence between compilers") names the actual blocker: when the source contains `(import-macros ...)`, both compilers produce different output because of unrelated import-declaration handling. So `compile-both` on an `(import-macros "./packages/testing" ...)` source would fail — not because of relative-path resolution (which is fixed), but because of the unrelated divergence in import-declaration emission.

**CDC's disposition on this:** the literal criterion F-4 is met. The substantive gap is real but is **upstream of CC's work** — it's a finding about the import-declarations divergence, not about CC's `--source-context-path` implementation. CC behaved correctly by surfacing the blocker as fast-follow #1.

**Methodology finding (on my side, not CC's):** my prompt's F-4 criterion said "M16-6 test now uses compile-both (cross-compiler verification)." A stricter criterion would have been "uses compile-both with an `(import-macros ...)` source that exercises the directory-path resolution this work enables." The weaker criterion let CC meet it without actually demonstrating the cross-compiler verification the work was designed to support. **This is the same class of methodology learning I logged after M16-5's count criterion:** when a fix is intended to ENABLE a specific test pattern, the acceptance criterion should name what the test must exercise, not just that it must use the new tool.

CC's honesty about fast-follow #1 is the protective layer that surfaces the gap. Without that explicit naming, the gap would have been silent.

### F-5 — Backward-compat: existing tests pass ✓ (trusted)

Sandbox can't run tests; trusting CC's reported counts:
- `cargo test -p lykn-lang`: 1071 (matches post-M16 baseline). ✓
- `cargo test -p lykn-cli`: 186 (new baseline; +1 from new unit test).
- `make test-lykn`: 292 (matches post-M16 baseline). ✓
- `./bin/lykn test test/forms/`: 667 (was 666; +1 from new M16-6 test). ✓

All counts consistent with "nothing regressed, only additions."

### F-6 — Rust unit test ✓

Test exists at `crates/lykn-cli/src/compile.rs` as
`compile_source_context_path_synthetic_parent`. The test verifies
the architectural premise (synthetic path's `parent()` equals
context directory) AND functional correctness (`compile_source`
with a synthetic path produces valid output).

**Minor caveat:** the test exercises the *mechanism* (synthetic path
+ parent semantics), not the *routing logic* in `cmd_compile` (the
`match source_context_path` block). A stricter test would invoke
`cmd_compile` itself or an integration-style harness. Acceptable for
a unit test of this scope; the mechanism it verifies is the load-
bearing piece.

### F-7 — Docstring updated ✓

- `grep -c "cannot test import-macros" packages/testing/helpers.js` → 0. ✓ (stale limitation gone)
- `grep -c "source-context-path" packages/testing/helpers.js` → 2 (docstring + code). ✓

The docstring now reads: "The Rust compiler is invoked via the `lykn` binary with `--source-context-path` set to `Deno.cwd()` so that relative imports in source resolve from the project root regardless of the temp file's location." Accurate and self-contained.

### F-8 — Single coherent commit chain ✓

Verified via direct `git log --oneline cdc/compiler-coherence` from `lang/`:

- `a97e151` Add --source-context-path flag to lykn compile for compileBoth

One commit, well-titled. Criterion was ≥1; met. ✓

---

## Forbidden-patterns check — none violated

I named four forbidden patterns in the prompt; CDC verified none were violated:

1. **No new parameter on `compile_source` / `compile_file` / `expander::expand`.** ✓ Verified: signatures unchanged.
2. **Flag NOT extended to `lykn run` or `lykn test`.** ✓ Verified: `source_context_path` mentioned only in the `Compile` clap variant and `cmd_compile`.
3. **Temp-file machinery NOT removed from compileBoth.** ✓ Verified: `Deno.makeTempFileSync` still used; just with the new flag passed alongside.
4. **`expander::expand` and pass0 NOT touched.** ✓ Verified: the existing `file_path` plumbing is reused.

---

## Fast-follow findings — independent assessment

### Finding #1 — import-macros output divergence between compilers

**Severity: substantive; high-priority for full compileBoth utility.**

CC's description matches the structural observation that drove F-4's
substantive gap: JS compiler emits import declarations for the macro
module (e.g., `import {...} from "..."`); Rust compiler omits them.

This is a real cross-compiler divergence that prevents `compileBoth`
strict-equality on any source containing `(import-macros ...)`. It's
**not** about the macro expansion itself (both compilers correctly
expand the macros), just about whether the resulting JS includes the
upstream import statement.

**Why this matters:** the entire reason for `--source-context-path`
was to enable `compileBoth` on sources with relative-path imports.
Most such sources WILL use `(import-macros ...)` — that's the
canonical use case. If `compileBoth` can't converge on import-macros
sources, the practical reach of this fix is narrower than intended.

**Suggested disposition:** track as a separate fast-follow milestone
(could be M17 or a follow-up to M16). The fix path likely lives in
the JS expander or compiler: align JS import-declaration emission to
match Rust's omit-behaviour (or align Rust to JS's include-behaviour
— Duncan's design call which is canonical).

### Finding #2 — `compile_file_with_dts` is dead code

**Severity: polish.**

Verified independently: `compile_file_with_dts` is declared at
`crates/lykn-cli/src/compile.rs:53` with no callers anywhere in
`crates/`. The refactor of `cmd_compile` to read source itself and
call `compile_source_with_dts` directly made this entry point
redundant.

**Suggested disposition:** delete in the next compile.rs touch.
Trivial cleanup; not blocking anything.

---

## Methodology observations

### Methodology-positive behaviours

1. **CC's exact-shape conformance to the prompt.** The synthetic-path
   approach, `__compileBoth__.lykn` naming, `cmd_compile`-local
   routing, signature-preserving design — all match the prescribed
   shape. CC didn't reach for the "add a parameter to
   `compile_source`" shape that the Pre-solved Obstacle 2 explicitly
   forbade.

2. **CC surfaced fast-follow #1 honestly.** The import-macros
   divergence was discovered during implementation (when CC tried
   compile-both on an import-macros source and saw it diverge). CC
   logged it explicitly rather than papering over by writing a
   compile-both test that avoided import-macros.

3. **CC named the dead-code finding (fast-follow #2)** rather than
   silently leaving it as `dead_code` noise. Substrate-pillar
   discipline.

### Methodology-relevant finding for future ledger writing

**Acceptance criteria for "enable test pattern X" work should name
what the test must exercise, not just what tool it must use.**

The F-4 criterion as written ("M16-6 test now uses `compile-both`")
was satisfiable without actually verifying the substantive feature
the work was designed to enable. A stricter wording — "M16-6 test
uses `compile-both` on an `(import-macros ...)` source that
exercises directory-path resolution" — would have caught the gap at
ledger-writing time and forced fast-follow #1 to surface as a
stop-and-surface gate rather than as a closing-report finding.

This is the same class of methodology learning logged after M16-5's
count criterion: when a fix is intended to enable a specific
verification, the acceptance criterion should be written in terms of
what the verification demonstrates, not what surface mechanism is
used. **Both are findings about CDC-side ledger drafting, not
CC-side implementation.** Worth folding into the LEDGER_DISCIPLINE
guidance or a thread-level note.

---

## Recommendations

1. **Accept this closure.** CC's work meets all 8 criteria literally
   and the implementation is structurally clean.
2. **Schedule fast-follow #1 (import-macros divergence) as the next
   priority** in the compiler-coherence thread or as part of M17.
   Without it, `compileBoth`'s reach is materially narrower than the
   `--source-context-path` work was designed to enable.
3. **Land fast-follow #2 (compile_file_with_dts cleanup) as a
   drive-by** in the next compile.rs touch. Low effort; closes dead
   code.
4. **Log the F-4 ledger-criterion methodology lesson** alongside the
   M16-5 count-criterion lesson. The pattern is consistent enough
   that it's worth canonicalising.

---

## What CC does NOT need to redo

- The implementation is structurally correct at all four touched
  files (main.rs clap, main.rs cmd_compile, compile.rs unit test,
  helpers.js compileBoth).
- The synthetic-path naming is well-chosen and documented.
- The closing report's per-row walk is thorough.
- The substrate-rule compliance section is honest and accurate.
- The fast-follow findings are precisely characterised.

CDC's observations are methodology learnings, not corrections.

---

## Open inputs for Duncan

1. **Accept this closure?** CDC recommendation: yes.
2. **Fast-follow #1 (import-macros divergence) disposition.** CDC
   lean: this is substantive enough to be its own milestone (M17?)
   or a high-priority row in whatever follows. It's the load-bearing
   piece for `compileBoth`'s practical reach.
3. **Fast-follow #2 (dead code) disposition.** CDC lean: drive-by in
   the next compile.rs touch.
4. **Methodology-lesson logging.** Two related ledger-criterion
   lessons now (M16-5 count, this work's F-4 substantive-intent).
   Worth a thread-level note in `workbench/2026-05-10-compiler-architecture-coherence-thread-opening.md` (or its `docs/dev/` canonical location); fold into LEDGER_DISCIPLINE if the pattern recurs once more.
5. **Commit timing.** When you merge cdc/compiler-coherence into
   release/0.6.x, all M16 + this fast-follow commits land together.
   Sequencing your call.
