# Slice 02: buried-intent-audit — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-05 · **Branch:** `release/0.6.x`
**Verdict: delivered — arc11's last slice.** Swept the buried-intent inventory;
**every hit has a written disposition** (wired / retired / tracked). Trivial
fixes landed; `SetSymbol` assessed + routed (not removed); conventions + canonical
test command documented; doctest dir harmonized. Sweep re-run at close diffs
clean against the table (A-4).

---

## F-1 — Sweep + reconciliation

Grep set (over `crates/*/src` + `packages/`): `TODO`/`FIXME`/`XXX`/
`unimplemented!`/`todo!`, `for now`/`temporar`/`transitional`/`reserved`,
`hide = true`, `allow(dead_code)`, plus the CLI-surface sweep
(underscore-silenced params, hidden clap flags, threaded-and-dropped options)
and a bounded doc-claims sample.

**Benign-filter rule applied** (*describes-now* = noise; *should-someday* =
inventory). Documented benign (not dispositioned): `config.rs:511`,
`bridge.rs:14`, `doctest.rs:3/:522` ("temporary file" *descriptions*);
`main.rs:308`, `names.rs:235`, `classifier/mod.rs:14`, `kernel-mark.js:1`
("existing behaviour preserved" / "transitional" *describing* current code).

**Reconciliation vs the 9-item seed:** all 9 accounted for; **4 new code items**
found (below). Nothing dropped. `hide = true` / `allow(dead_code)` /
`unimplemented!` = **zero** (the `--out-dir` hidden flag was un-hidden in
slice01).

---

## F-2 — Disposition table (every item: wired / retired / tracked)

### Seed items

| # | Item | Disposition | Rationale / home |
|---|------|-------------|------------------|
| 1 | `surface.rs:294` `SetSymbol` deprecation TODO (trigger fired) | **tracked** | F-4: 0.7.0 breaking-change candidate, operator decision. Stale TODO text replaced with a tracked-home comment. |
| 2 | `icu.rs:696` `TODO: translate e.position into a Span offset` | **tracked** | Not a one-liner (needs ICU-position → source-Span mapping). Home: ICU error-attribution polish (arc07-adjacent / a finding); re-entry when ICU diagnostics UX is prioritized. |
| 3 | `kernel-mark.js:10` false "`kernelArray` removed as dead" comment | **wired** | Corrected: `kernelArray` lives (`surface-helpers.js`, used by `compileLetPattern`). |
| 4 | `expander.js` `macroEnv.has('bind')` stale guard | **wired** | Re-keyed to `macroEnv.has('js:eq')` — `bind` moved to the classifier (DD-37), so the old key never matched and registration re-ran every call. |
| 5 | `main.rs:805` `cmd_lint(_paths)` stub | **tracked** | Pointer verified: message cites issue #1; arc05 / P-11 owns `lykn lint`. No code change. |

### New items (this sweep)

| # | Item | Disposition | Rationale / home |
|---|------|-------------|------------------|
| N1 | `emitter/forms.rs:1676–1681` — multi-clause `genfunc` emits **only the first clause** ("For now, only single-clause… future: dispatch like func_multi") | **tracked** | A real functional limitation (silent clause-drop), matching current JS behaviour. Home: a `genfunc` multi-clause row (0.7.x compiler feature); re-entry when multi-clause generators are needed. Low reach today. |
| N2 | `reader/parser.rs:308–310` — `skip_block_comment(_start)` no-op ("handle at lexer level in a future enhancement"; `_start` unused) | **tracked** | Block comments are already handled at the lexer; this stub + `_start` are vestigial. Home: reader-cleanup finding; re-entry if block-comment span attribution is wanted. |
| N3 | `doctest.rs:1138–1139` — nested-fence "known limitation" in the block scanner | **tracked** | Edge case (```` ```lykn ```` inside a ````markdown block); the test only asserts no-panic. Home: doctest-scanner polish; re-entry if nested-fence docs appear. |
| N4 | `emitter/forms.rs:2074` — nested destructuring pattern "treat as binding" | **tracked** | Recursive nested-pattern compilation deferred. Home: destructuring-completeness row; re-entry when a failing nested case surfaces. |

### Slice01 bubble-up items (inherited)

| # | Item | Disposition |
|---|------|-------------|
| 6 | Reserved-plumbing sweep of the CLI surface | **wired/clean** — only `_paths` (#5, tracked) and `_start` (N2, tracked) remain underscore-silenced; both dispositioned. No other hidden flags or dropped `Option`s (the `--out-dir` case was slice01). |
| 7 | Test-source location-independence conventions | **wired** (F-5) — `test/CONVENTIONS.md`. |
| 8 | Canonical test command | **wired** (F-5) — `test/CONVENTIONS.md` + `AGENTS.md`. |
| 9 | Doctest-dir harmonization | **wired** (F-6) — `target/test/doctest` → `target/lykn/test/doctest`. |

**Proposed tracked homes (for CDC to instantiate as rows):** items 1, 2, N1–N4
need project-plan / finding rows; I name the home + re-entry condition above but
leave `docs/design-v0.6.0/**` row-creation to CDC (bubble-up below).

---

## F-3 — Trivial fixes landed

- **`kernel-mark.js`** — comment corrected (`kernelArray` kept, not removed).
- **`expander.js`** — idempotence guard re-keyed `bind` → `js:eq` (the name
  `registerSurfaceMacros` actually installs). Behaviour-identical (registration
  is idempotent); the guard now actually skips after the first call.
- **`icu.rs:696`** — assessed, **tracked** not fixed (see #2 — non-trivial).

## F-4 — `SetSymbol` / `set-symbol!` assessed + routed (NOT removed)

**Census:** a live **surface** form (computed-key assignment
`(set-symbol! obj key value)` → `obj[key] = value`), classified in
`dispatch.rs`/`forms.rs`/`classifier.js`, used by **1 guide** (`02-api-design.md`)
and **2 tests** (`dd-37-batch1-mutation_test.lykn`, `js-interop_test.lykn`); no
examples. **Design question (surfaced, operator decides):** the TODO's trigger
(surface/kernel separation) fired at arc10's close — should `set-symbol!` be
**deprecated in 0.7.0** (per the original TODO), or **kept** as the surface
spelling for computed-key assignment (there is no other surface form for it —
`set!` takes a static `obj:prop` path)? **Routing:** a 0.7.0 breaking-change
candidate row (project-plan / a DD note); re-entry = the 0.7.0 planning pass.
The stale auto-remove TODO text is **replaced** with a comment naming this
routed home and marking "do not remove before the routed decision."

## F-5 — Conventions + canonical command documented

**Home choice + rationale:** these are **repo test-suite** conventions (how
*this repo's* tests must be written), not user-facing "how to test lykn" — so
they live in **`test/CONVENTIONS.md`** (new; beside the tests, where an author
editing a test looks), not `docs/guides/16-testing.md` (user docs). The
**canonical command** is documented there *and* reinforced in **`AGENTS.md`**
(the contributor command reference, which already carried the `deno test`
line) with the "scope to `test/`, `-A` required, unscoped unsupported" caveat.
Content: bare import-map specifiers (never relative source imports);
`Deno.cwd()`-anchored fixtures (never `import.meta.dirname`); `*_test.js` vs
`*.test.js` naming. **arc05 lint-rule candidates filed in the bubble-up.**

## F-6 — Doctest-dir harmonized

`target/test/doctest/` → **`target/lykn/test/doctest/`** (one constant,
`doctest.rs:553`, + 2 comments), completing slice01's `target/lykn/{build,dist,
test}` alignment. Verified: `lykn test --docs` writes the new path, **old path
absent**, doctests green. (slice01 filed this for its own verify — this is it.)

---

## F-7 — Verification + A-4 sweep-diff

**Observed (2026-07-05, rebuild-first):**
- `make check` → **`✓ All checks passed (build + lint + test)`** (exit 0;
  includes clippy `-D warnings` + `make test-docs`).
- `lykn test` → **`1365 | 0`**; `deno test --config project.json -A test/` →
  **`673 | 0`** (F-3 `expander.js` guard fix behaviour-identical).
- `make test-docs` → 0 failed; doctest output now `target/lykn/test/doctest/`,
  **old `target/test/doctest/` absent**.
- `cargo test` 0 failed; `cargo clippy --all-features --workspace -- -D warnings`
  clean.

**A-4 closure demo — sweep re-run at close, diffed against the table:**

| Remaining sweep hit | Disposition-table row |
|---------------------|-----------------------|
| `icu.rs:696` (TODO) | #2 tracked |
| `main.rs:809` ("For now, lykn check…") | #5 (cmd_lint stub) tracked |
| `emitter/forms.rs:1676/1681` | N1 tracked |
| `parser.rs:308/310` (`_start`, "future enhancement") | N2 tracked |
| `doctest.rs:1138/1139` (nested fences) | N3 tracked |
| `emitter/forms.rs:2074` | N4 tracked |
| `cmd_lint(_paths)` | #5 tracked |

**Zero undispositioned hits.** The 3 wired items (SetSymbol TODO, kernel-mark
comment, `bind` guard) no longer appear.

---

## Bubble-up to arc11 — is arc11 ready to close?

**Yes.** arc11's criteria:
- **A-1 / A-2 (slice01: out-dir wired, source-only)** — done.
- **A-3 (three-moment demo)** — slice01 transcript; still holds.
- **A-4 (buried-intent sweep + disposition)** — this slice; sweep-diff clean.
- **A-5 (unscoped-run diagnosis + hygiene)** — fossil gone; canonical command +
  conventions documented; unscoped-run caveat landed.

**For CDC to instantiate (tracked homes named above, rows are CDC's to create):**
- **0.7.0 project-plan rows:** `set-symbol!` deprecation decision (F-4);
  multi-clause `genfunc` (N1).
- **Findings / cleanup rows:** ICU Span attribution (#2); reader block-comment
  stub (N2); doctest nested-fence scanner (N3); nested-destructure pattern (N4).
- **arc05 lint-rule candidates (from F-5):** (a) reject relative source imports
  in `.lykn` test files (require bare import-map specifiers); (b) reject
  `import.meta.dirname`-anchored fixture paths in test files (require
  `Deno.cwd()`). These enforce the `test/CONVENTIONS.md` rules the compiler
  can't.

**arc11 is ready for its closing-report + host composition run** (A-3 demo +
A-4 sweep-diff + A-5, reproduced at arc scale).

## Discipline notes

- Audit before fix: the disposition table preceded the diffs (F-1/F-2 → F-3).
- F-4 was assess-and-route only — `set-symbol!` not removed (operator decision).
- Doc-touching slice → `make test-docs` in the green bar.
- `docs/design-v0.6.0/**` left to CDC except this closing report. Source only.

Handed back for CDC `cdc-verification.md`.
