# Correction02 validation stop — 2026-11-07

Source candidate: `codex/checked-emission-results-v2@483ff5074001d7a039270f4639e8ef61d70e4b4e`, tree `e653fa678a153b08c4fc3caad49f1d846bdf4b84`; source remained clean at the stop. The exact command, cwd, task-specific fresh XDG/npm caches, fixed `DENO_DIR`, Rust version, and separate raw stdout/stderr/exit are adjacent in `make-check.command.txt`, `make-check.stdout`, `make-check.stderr`, and `make-check.exit`.

The required normal unfiltered `make check` exited 2. Its `common-checks` path visibly passed dependency freshness, its embedded committed cited-path check (63 documents; 601 historical citations), release build, Clippy, format, Lykn syntax/lint, and artifact refresh. The Rust test stage completed with passing unit and integration binaries. The subsequent full Deno test suite stopped at one existing documented conformance residual after 1469 passed across 11 steps. The make chain therefore did not reach `test-docs`; the separate `make check-cited-paths` command was not run, though its embedded prerequisite passed.

Exact failing case from `test/expander/conformance-corpus.test.js:221–232`:

```js
Deno.test("residual (documented): form-named label — shape-mismatch asymmetry", () => {
  const src = "(label fn (block (fn 987)))";
  const rust = compileRust(src);
  const js = compileJs(src);
  assert(rust.ok, `Rust should still emit (fall-through call): ${rust.err}`);
  assert(rust.out.includes("fn(987)"), `Rust should fall through to a call:\n${rust.out}`);
  assert(!js.ok, `JS should raise a form-shape error (documented residual): ${js.out}`);
});
```

The raw Deno failure says Rust returned `1:18: error: fn requires params and body`; Deno reports the failure at line 221 and assertion source line 232. No retry, filter, source/oracle edit, standalone citation command, or other dependent check followed. Full focused gates had passed before Make; their raw receipts are in this attempt directory. This stop does not establish S02 product acceptance. Independent CDC replay is pending.
