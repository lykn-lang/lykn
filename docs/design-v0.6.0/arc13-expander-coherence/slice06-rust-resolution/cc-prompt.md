# CC Prompt — arc13 / slice06 · rust-resolution

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x`. **Re:** The resolution slice proper — DD-60 D1
on Rust per **DD-61** (read it first: `../design/dd-61-…md`, plus DD-60 and
your own slice03/05 closing-report hook notes). The binding layer you built
is complete and test-pinned; this slice hangs the resolver on it. **Read
the ledger + slice-doc before writing any code** — the slice-doc carries
the grounded dispatch map (file:line) and three named design tensions.

## The work (MUST) — 6 rows (ledger has the table)

1. **F-1 — resolver.** `SExpr::Atom` gains `binding: NameRes
   {Unresolved, BindingDef, BindingRef}` (`#[non_exhaustive]`); reader →
   `Unresolved` always. The classifier hosts the env; extension comes
   **only** from `binding::bindings_introduced` (skip
   `shadows_values() == false`); tag def-sites and refs. Tags must never
   change emitted JS text. Equality (derived `PartialEq` now includes the
   field): decide, and **surface the choice in the closing report**.
2. **F-2 — expander light scan.** Before user-macro dispatch or
   `try_desugar` fires in `pass2`, consult a scope set built from the
   same walker. Bound head → neither fires. Verify the `has_macros`
   short-circuit leaves no exposure on the no-macro path (check, report).
3. **F-3 — the §A6 swap.** `as_form_head()` (`#[must_use]`; `None` for
   binding-refs) replaces every **dispatch-purpose** head read in all
   four subsystems (slice-doc lists the sites). `BindingRef` heads take
   the **plain call** path (`array(1, 2)`, not the parenthesized
   computed-callee shape). `as_atom` survives for non-dispatch uses only.
   **The privacy restructure is NOT this slice** (operator call) — do not
   start it.
4. **F-4 — the standing check.** A `make check` test that fails on any
   dispatch-purpose raw-head read outside sanctioned sites; seeded-
   violation demo (add one, watch it fail, remove it).
5. **F-5 — matrix.** Re-probe: Rust columns hit their DD-60 targets
   (legal-ident cells → `calls-binding`; reserved rows stay
   `rejects-cleanly`); **JS columns byte-identical** to the slice05
   baseline; corpus outputs unchanged. **Any JS/corpus movement = leak =
   STOP and report.**
6. **F-6** — `make check` ✓; suites ≥1401/0; parity + coverage green;
   `./bin/lykn` rebuilt before every probe (the PATH-binary trap).

## Discipline

Surface, don't decide silently — anything resolution contact reveals that
DD-60/DD-61 didn't anticipate is a finding for the bubble-up, not a quiet
fold (this arc's record: three DD refinements arrived exactly this way).
Self-stop beats working around. Closing report untracked
(`docs/design-v0.6.0/**` is CDC's); commit **source only**. Close set:
closing-report with the per-row walk + bubble-up (js-resolution hook
notes — what the JS slice mirrors, where the asymmetries are — and the
silent-drop diff).
