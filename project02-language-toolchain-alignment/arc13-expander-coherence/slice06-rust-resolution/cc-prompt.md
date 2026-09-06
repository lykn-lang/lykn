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

## Handoff addendum (2026-07-06 — fresh-context pickup)

The prior session **self-stopped cleanly** mid-slice (context exhaustion
at the tail of a very long day; a byte-offset fix script corrupted files
on nested braces → full revert; **tree green at `0055ba1`, nothing
committed**). Its design work stands — re-derive nothing; details in the
outgoing session's handoff report (workbench):

- **`NameRes {Unresolved, BindingDef, BindingRef}`**, `#[non_exhaustive]`,
  `Default = Unresolved`.
- **Tension #2 DECIDED** by the outgoing session: manual
  **tag-insensitive `PartialEq`** (the tag is dispatch metadata, not
  structural identity — keeps every existing `SExpr` comparison stable
  across the pass). Keep it; state it in the closing report.
- **`as_form_head()`**: `#[must_use]`, returns `None` for any
  **non-`Unresolved`** atom (defs *and* refs — a def-site name must never
  dispatch either); plus `name_res()` / `with_name_res()` helpers.
- **Census:** the field add breaks only **~59 sites** (31 struct-literal
  constructions + 28 non-`..` patterns); the other ~200 `..`-patterns
  absorb it silently.
- **Method that works:** rustc's own machine-applicable suggestions /
  `cargo fix` for the E0027 pattern fixes; the 31 constructions by hand —
  or better, via a **central `SExpr::atom(value, span)` constructor**
  (→ `Unresolved`), which centralizes the §A4 invariant and pre-does
  step (1) of the phased atom-payload-privacy slice (CDC recommendation,
  operator-aware; your call on contact — surface it). **No byte-offset
  scripting** (the outgoing session's crash report; don't repeat it).
- Land the foundation as a **first green increment**, then the
  incremental chain: F-1 resolver → F-2 scan → F-3 swap → F-4 check →
  F-5 matrix, verifying at each step.
