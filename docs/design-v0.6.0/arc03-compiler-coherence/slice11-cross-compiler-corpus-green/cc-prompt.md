# CC Prompt — arc03 / slice11 · cross-compiler-corpus-green

**From:** CDC (Cowork Claude)
**To:** CC (Claude Code, fresh session on Duncan's machine)
**Branch:** off `release/0.6.x` (use the `cdc/compiler-coherence` worktree or a
fresh branch — Duncan decides; do git ops on the host).
**Re:** Get the cross-compiler `compile-both` corpus **green** so arc03 can
close. This is arc03's remediation slice (slice11), routed from
`docs/design-v0.6.0/arc03-compiler-coherence/closing-report.md` §5.

---

## 0. Read these first (in order)

1. `docs/design-v0.6.0/arc03-compiler-coherence/slice11-cross-compiler-corpus-green/ledger.md`
   — **the contract.** Nine rows (F-1…F-9); every row must reach a final status
   with reproducible evidence.
2. `docs/design-v0.6.0/arc03-compiler-coherence/slice11-cross-compiler-corpus-green/slice-doc.md`
   — goal, scope (in/out), verification approach.
3. `docs/design-v0.6.0/arc03-compiler-coherence/closing-report.md` §3/§5 — the
   six residual failures, their diffs, and the dispositions you are executing.
4. `packages/testing/helpers.js` — the `compileBoth` normalizer **and its
   extension policy** (lines ~120–185). This policy is binding (F-8).
5. The skill-bundled `LEDGER-DISCIPLINE.md` (note: the repo symlink
   `assets/ai/LEDGER_DISCIPLINE.md` is currently **dead** — underscore vs hyphen;
   read the collaboration-framework copy and, if quick, fix the symlink as a
   drive-by).

Do not start coding until you've read these and confirmed the ledger criteria.
If a row is wrong or impossible, raise it as a ledger amendment — do not silently
work around it.

## 1. The binding constraint (read twice)

**Default action: FIX the divergence in the compiler; do NOT extend the
normalizer.** `helpers.js` already normalizes trailing-`;` (transform #4) and
gensyms (transform #3); the policy comment is explicit that a normalizer
extension *hides* a real difference while a compiler fix *eliminates* it. Any
change to the normalizer requires (a) a rationale comment in the transform list
**and** (b) a reference to this slice — and is only acceptable when a compiler
fix genuinely isn't the right call. F-8 verifies this.

## 2. The work (MUST)

1. **F-1/F-2 — async-declaration trailing `;` (the main fix).** Rust emits a
   trailing `;` after `async function`/`async function*` **declarations**;
   astring (JS) omits it, and normalizer transform #4 does not clear it for the
   async shape. Fix it in Rust codegen — the `emit_async` path
   (`crates/lykn-lang/src/codegen/emit.rs` ~534–565) routing into
   `emit_function` / `emit_function_star`. The sync function-declaration path
   already converges; make async match. Investigate *why* #4 doesn't fire for
   async and prefer the codegen fix over widening #4. This should clear all three
   async/generator failures.
2. **F-3 — DD-49 gensym/blank-line residual.** Determine whether it's a real
   codegen difference (e.g. a stray blank line before `return`, or a gensym not
   covered by transform #3). Prefer a compiler fix; touch transform #3 only
   under the F-8 policy.
3. **F-4 — DD-52 import-macros path.** The Rust compiler resolves the macro path
   relative to the temp file rather than the `--source-context-path` root. If
   that's a real resolution bug, fix it; if it's an artifact of how the harness
   writes temp files, mark the test skipped with a written rationale. State which.
4. **F-5 — DD-53 JSR end-to-end.** Network/environment-gated; make it skip
   cleanly offline with a rationale rather than hard-fail. Not a coherence defect.
5. **F-7 — stale-binary guard.** Make the corpus run build a fresh binary first
   (or fail loudly if `bin/lykn` is older than `crates/**/*.rs`). A stale binary
   produced 16 phantom failures during the A-2 run — close that trap.
6. **F-6 — green.** With the above, `cargo build --release &&
   LYKN_BIN="$(pwd)/target/release/lykn" "$LYKN_BIN" test` exits **0 failed**.
7. **F-9 — no regressions.** `cargo test` and
   `deno test --config project.json -A test/` stay green.

## 3. Discipline

- **TDD-first where it fits:** for F-1, a failing `compile-both` assertion
  already exists — make it pass by fixing codegen, and confirm the diff.
- **MUST framing, no soft language.** Don't mark a row `done` without the
  command output that proves it. `attested` is your ceiling; CDC reproduces.
- **Iteration budget: 5.** If you can't converge a row in 5, stop and surface it
  (it may need a scope/ledger amendment, not a 6th grind).
- **Safety gates:** never auto-pass `--allow-dirty`/`--force`/etc. (CLAUDE.md).
- Do not touch the `cargo fmt` red state or DD-58/DD-37 behavior — out of scope.

## 4. Close

Write the per-row walk into the same `ledger.md` (status + evidence per row),
fill **What Worked** and **Closure**, then write a slice closing-report at
`docs/design-v0.6.0/arc03-compiler-coherence/slice11-cross-compiler-corpus-green/closing-report.md`
with the per-row walk **and a Bubble-up to arc03** (did slice11 deliver A-6;
anything it revealed that changes the arc-plan; the silent-drop diff). Then tell
Duncan it's ready for CDC verification — CDC reproduces F-1…F-9, lifts the
evidence to `reproduced`, marks arc03 row A-6 done, and writes arc03's final
close.
