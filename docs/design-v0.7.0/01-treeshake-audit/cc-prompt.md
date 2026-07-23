# CC prompt — Slice 01: treeshake-audit (execution phases)

You are CC, the implementing context for the **execution phases** of a
diagnostic audit. Read these first, in order:

1. `docs/design-v0.7.0/01-treeshake-audit/slice-doc.md` — the plan-of-record
2. `docs/design-v0.7.0/01-treeshake-audit/ledger.md` — you own rows
   **F-1 (evidence), F-4, F-6, F-8, F-10**; update Evidence (strength
   *attested*) as each lands, not at the end
3. `CLAUDE.md` — especially the **Lykn CLI safety gates** section

**Hard constraints:**

- This slice is **diagnostic only**. Do not modify compiler, CLI, dist, or
  test code. Your writes are confined to
  `docs/design-v0.7.0/01-treeshake-audit/evidence/` and the ledger file.
- Do not pass safety-bypass flags (`--allow-dirty`, `--force`, `-A` beyond
  what a script explicitly needs) to any tool. Use minimal explicit Deno
  permissions.
- Do not write `report.md` — CDC assembles the report. Your deliverable is
  evidence + ledger updates + a short run-notes file
  (`evidence/cc-run-notes.md`) for anything surprising.
- The CDC prediction table must already be committed before you run P2. If
  it is not there (`predictions.md` in this directory), **stop and say so**
  — running the experiment first breaks ledger row F-5.

## Phase P0 — toolchain probe → `evidence/toolchain.md`

Record full command + output for each:

```sh
deno --version
deno bundle --help        # capture whether the subcommand exists in this version
cargo --version
cargo build --release     # must be clean; record warnings verbatim if any
```

## Phase P1 — fixture compile → `evidence/compiled/`

Fixture sources are under `fixtures/` in this directory (one module per
surface family + the two-module app `app-main.lykn` / `app-lib.lykn`).

1. **Determine the emission path(s)** (this is F-1's evidence): which
   pipeline does the default `lykn compile` route through — native
   `lykn_lang::codegen`, or `bridge.rs` → Deno → `packages/lang/compiler.js`?
   Establish it from `crates/lykn-cli/src/compile.rs` / `main.rs` and
   confirm with a live run. Record file:line citations and the transcript.
2. Compile every fixture via the default path into
   `evidence/compiled/default/`.
3. **If** a second path is independently invocable (flag, env var,
   subcommand — discover and record how), compile the same fixtures via it
   into `evidence/compiled/alt/`. If it is not invocable, record why —
   that feeds F-8's no-op rationale.

## Phase P2 — tree-shake experiment → `evidence/`

Run the experiment script provided at `scripts/shake-experiment.js` (esbuild
via `npm:esbuild`, mirroring the `build_browser_bundle` pattern already in
`main.rs`). It bundles the compiled two-module app with
`bundle: true, treeShaking: true, metafile: true` and writes:

- `evidence/bundle.min.js`, `evidence/bundle.js`
- `evidence/metafile.json`
- `evidence/analyze.txt` (esbuild's analyze output)

Verify `jq . evidence/metafile.json` parses. Do not interpret the results —
that is CDC's divergence analysis.

## Phase P3 — corpus scan → `evidence/corpus-scan.json`

Run the walker script provided at `scripts/toplevel-walker.js` over the
compiled test corpus (compile the corpus the way `make build` / the test
pipeline does; record the exact invocation). The walker flags effectful
top-level statements (calls, assignments, mutations outside
declaration-initializer position) with file:line. Save the JSON output and
note the total finding count in `cc-run-notes.md`.

## Phase P4 — cross-emitter diff (conditional) → `evidence/cross-emitter-diff.md`

Only if P1 step 3 produced `evidence/compiled/alt/`: diff the two compiled
trees (`diff -ru`, plus note any differences in *top-level statement
shapes* specifically). Otherwise record the no-op rationale citing your
P1 finding.

## Close-out

- Ledger rows F-1, F-4, F-6, F-8, F-10: Evidence filled, strength
  *attested*.
- `evidence/cc-run-notes.md`: anything the plan did not anticipate
  (bubble-up material — surprises here are contributions, not failures).
- Per LEDGER-DISCIPLINE.md: if a criterion is unclear or wrong, raise an
  amendment request; do not work around it. Iteration budget five —
  if blocked, name the blocker and stop rather than improvising.
