# CC Prompt — arc05 · slice04 · Integration + guide alignment (arc05's last slice)

> **You are CC** (Claude Code, IC seat) on `~/lab/lykn/lang`, branch
> `release/0.6.x`. Implement against `ledger.md` (read it first). Ground every
> change in the actual code/guides; **surface and self-stop, do not decide
> silently.** Commit **source + docs** (guides are shipped docs, not planning);
> leave `docs/design-v0.6.0/**` planning docs to CDC.

## Context

slice03 closed (`ea429e2`): `lykn lint` is resolution-aware with 15 shape/
conventions rules + the ID-12 shadowing rule; dogfood is clean except **2
intentional `===` findings** in `test/surface/kernel-in-surface_test.lykn`
(a fixture whose purpose is kernel forms in surface). This slice wires lint into
the build, aligns the guides, and demonstrates the rule set — the last steps
before arc05 closes.

**Suppression is NOT in this slice.** The inline `; lykn-lint: disable`
mechanism depends on the reader retaining comments, which no backend does today
— it is deferred to **arc14 · comment-retention** (DD-62). Handle the 2 fixture
findings by **path-scoping**, not suppression (item 1).

## What to do (MUST)

### 1. Wire `lykn lint` into `make lint` / `make check` — green (ledger F-1, F-8)

1. Add `./bin/lykn lint <source trees>` to the `make lint` target (which
   `make check` runs). Rebuild-first: `./bin/lykn build` before invoking.
2. **Make it green.** The 2 kernel-interop findings must not red the build.
   **Path-scope**, don't suppress: either lint the source trees *excluding*
   kernel-interop test fixtures, or add a small ignore-path list the CLI
   honours. **Do not** invent an inline-suppression comment syntax (that is
   arc14 — if you find yourself adding comment-directive parsing, STOP and
   surface). Record the mechanism you chose in the closing report.
3. **Surface if the scoping is uglier than a path exclusion** (e.g. if it needs
   per-rule config) — that is a signal the suppression deferral pinches here,
   and a re-scope note, not a thing to force.

### 2. guide-09 reclassification (ledger F-2, F-3, F-4) — closes arc05 A-6

4. For **every** `## ID-NN` entry in `docs/guides/09-anti-patterns.md`, rewrite
   the `**Status**` line to an accurate enforcement label:
   - **Compiler-enforced** — the compiler hard-errors it (the 5 kernel-only
     declaration forms via DD-58 strict; D2 reserved-word rejection; anything
     `lykn check`/compile rejects). The CC anti-patterns audit found the blanket
     "ELIMINATED BY LANGUAGE DESIGN" is true for only a minority — verify, don't
     assume.
   - **Linted (`<rule-id>`)** — a live `lykn lint` rule catches it. Cite the
     exact rule id from `crates/lykn-cli/src/lint/mod.rs` `registry()`
     (no-require, sort-without-comparator, parseint-radix, no-eval,
     no-new-wrappers, global-isnan, no-arguments, no-iife, no-delete-on-array,
     no-json-deep-copy, prefer-surface-operators, or-for-defaults,
     for-in-on-arrays, no-relative-source-imports, no-dirname-fixtures,
     shadowing).
   - **Documented-only** — neither the compiler nor a lint rule enforces it; the
     guide is the guardrail.
5. Keep each entry's JS-hazard explanation and fix-pointer; only the Status
   label (and fix-pointer if it now points at a rule) changes. **MUST-verify
   (F-3):** each "Linted" label names a real registered rule; spot-check a
   couple of "Compiler-enforced" labels by actually compiling the bad example
   and confirming it errors. If a label can't be substantiated, mark it
   Documented-only and note it.
6. `make test-docs` green after the edits (F-4) — doctest fences must still
   compile.

### 3. guide-15 + SKILL (ledger F-5)

7. Add a `lykn lint` section to `docs/guides/15-lykn-cli.md`: usage
   (`lykn lint <paths…>`), the rule set (point at guide-09's labels), exit codes
   (0 clean / 1 findings / 2 usage-IO), `--format=json`, `.lyk` exempt.
8. Add a short linter note to the **lykn-language-guidelines SKILL** (same
   surface: what `lykn lint` catches, how to run it).

### 4. The P-11 demo corpus (ledger F-6, F-7) — arc05 A-4

9. Build a **seeded** fixture (one deliberate instance per v1 rule, in a
   `_test.lykn`-named path so the path-scoped conventions rules fire) and a
   **clean** idiomatic fixture. Add a runner/test asserting: over seeded, every
   rule id fires exactly where seeded (exit 1); over clean, zero findings (exit
   0). This is the arc composition demo — put it where the arc close can
   reproduce it on the host.

## Standing rules (MUST)

- **Rebuild first** (`./bin/lykn build`) before any lint/deno/matrix probe
  (staleness trap #4). **`./bin/lykn`, never bare `lykn`.**
- A bare `cargo test` hits the stale-`bin/lykn` guard (`lyk_runner_kernel_only`)
  — `cargo build --release && cp target/release/lykn bin/lykn` first; `make
  check` rebuilds so it's green.
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.
- Docs-touching slice → **`make test-docs`** is part of your bar.
- **No suppression scaffolding** — if the task pulls toward comment-directive
  parsing, stop and surface (it's arc14).

## Close-set (what to hand back)

Write `closing-report.md` in this slice dir with:

1. A **per-row ledger walk** F-1…F-8 (status + evidence; no prose summary; 8
   in, 8 out).
2. The **make-lint scoping mechanism** you chose (F-1) and the **guide-09
   label tally** (how many Compiler-enforced / Linted / Documented-only, and
   any entry whose blanket "ELIMINATED" was downgraded).
3. **Bubble-up to the arc** (three questions): did slice04 deliver arc05's last
   piece; what it revealed (esp. anything the arc05 close or arc14 should know —
   e.g. how much the suppression deferral pinched); the silent-drop diff.

Then **stop** — CDC verifies, closes slice04, then writes the **arc05
`closing-report.md`** (composition check A-1…A-7 + bubble-up to the project +
P-5) and closes arc05. If you hit your context ceiling, self-stop clean and
write a handoff addendum (a recycle is not an iteration).
