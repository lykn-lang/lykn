# 01 · macro-entry-diagnostics — Slice Doc

**Scale:** standalone slice (no arc). Per `PROJECT-MANAGEMENT.md` Part II, when a
body of work is one slice rather than an arc, the per-slice documents live
directly in one `NN-<slug>/` directory under `docs/design-vX.Y.Z/`, with no
`arc-plan.md` and no arc-level `closing-report.md` above them.

**Layout note (confirmation protocol, Part VI):** bare-`NN` non-arc units are an
existing convention in this project — `docs/design-v0.7.0/` carries
`01-treeshake-audit/`, `02-packaging-strategy/`, `04-typed-classification/`. This
is the first one under `design-v0.6.0/`; the naming follows that precedent rather
than inventing a parallel one. Operator confirmed 2026-07-24.

**Opened:** 2026-07-24 · **Author:** CDC · **Branch:** `release/0.6.x`
**Origin:** operator host-reconcile of arc06, runsheet Part C-bis.

## 1. Goal

`import-macros` resolution failures should tell the operator what actually went
wrong and what to do next — without reading the compiler source.

Today they don't, in one specific and costly way: when the resolved package
*directory* does not exist, both compilers report "no macro entry found" and hint
*"add `lykn.macroEntry` to the package's `deno.json`"* — a confident, specific
instruction to edit a file inside a directory that isn't there.

## 2. Why now, and why not in arc06

Found by the operator running arc06's host-reconcile runsheet, Part C-bis — the
negative check that proves a `lykn link` override is live by moving the linked
dist away. The check **passed**; the diagnostic it produced is the finding.

**This is deliberately not an arc06 row.** arc06 is CLOSE-READY at the operator's
gate, its capability is delivered, and `find_macro_entry` predates slice07
entirely — slice07 only made this code path reachable a new way. Reopening a
closed-out arc for a defect that isn't its own would be the wrong instinct, and
it would be the third round trip on that arc in one day.

## 3. Scope

### In

1. **Missing-directory detection.** `find_macro_entry` checks whether `pkg_dir`
   exists before walking the candidate chain, and reports a distinct error when
   it doesn't.
2. **Overlay provenance.** When resolution reached that path through the Tier-0
   `lykn link` overlay, the error names the *specifier* the user actually wrote,
   says the path came from the overlay, and gives both exits (`lykn dist` in the
   linked project, or `lykn unlink <specifier>`).
3. **Failure framing.** The JS expander's throw escapes to Deno's top level as
   `Uncaught (in promise)`. Bring it in line with the CLI's other failures — or
   disclose why not.
4. **Cross-compiler parity**, with a test that fails on drift. See §5.

### Out

- Any change to Tier-0 resolution *semantics*. slice07 is closed and
  CDC-verified; this is diagnostics only.
- The `lykn link` runtime-import boundary (routed to 0.7.0 by slice07).
- The wider "every diagnostic in the compiler" sweep. If dogfooding keeps
  producing error-quality findings — likely — this graduates into a diagnostics
  arc. One finding does not justify one yet (*plan late, plan deep*).

## 4. The three defects, with evidence

**D-1 — no existence check on `pkg_dir`.** Rust
`crates/lykn-lang/src/expander/pass0.rs` (`find_macro_entry`) and JS
`packages/lang/expander.js:1235-1258` both probe `lykn.macroEntry`, then six
fallback filenames, then a `.lykn`-valued `exports` — each an existence check on
`pkg_dir.join(candidate)`. With `pkg_dir` absent, every probe fails *for that
reason* and both fall through to the "no macro entry found" error plus the
`lykn.macroEntry` hint. **Well-formed but wrong is worse than terse.**

**D-2 — the error names a path the user never typed.** Source says
`(import-macros "jsr:@lykn/testing@0.5.2" …)`; the error names
`…/target/lykn/dist/testing/`. The link between them is a `project.local.json`
overlay and nothing in the message mentions it.

**D-3 — the JS path escapes as an unhandled rejection.** `expander.js:1252-1256`
throws a bare `Error` that reaches Deno's top-level handler, so an *expected*
user-facing failure is presented as a crash. Every other CLI failure is a clean
`eprintln!` plus an exit code.

## 5. The constraint that shapes this slice

**The message exists twice and has already drifted.** Rust lists the checked
candidates across two lines with a parenthetical noting `lykn.macroEntry` was
absent-or-not-found; JS lists them on one line without it. Nobody noticed,
because nothing compares them.

This is DD-57's Q4=A / W-3 problem in miniature: two implementations of one
semantic answer kept in sync by hope. **A test that fails when the two
diagnostics drift is the structural point of this slice**, not a nicety. Fixing
the message without it just resets the drift clock.

## 6. Verification approach

Code review plus tests; CDC verifies against `lang` by inspection, CC attests the
runtime rows. The concrete acceptance demonstration is the operator's own repro:
the C-bis negative check should produce a message that says what to do next.

**Coverage note that motivates the test rows.** The existing test
(`pass0.rs:1026`, `test_find_macro_entry_no_entry_errors`) creates the temp
directory *then* calls `find_macro_entry` — so it covers "directory exists, no
entry" and **there is no test for "directory missing"** in either compiler. The
untested case is the one that shipped wrong. That is now the third instance of
this shape in a single day (slice07's rewritten-with-zero-coverage function, the
test whose name overclaimed its guard, and this), which is itself a systemic
entry in `docs/backlog/discoveries.md`.

## 7. Exit criteria

Ledger `M-1` … `M-6` all reach a final status, `make check` green, and the C-bis
negative check produces an actionable message. `M-5` (D-3's framing) may close as
a **disclosed deferral with rationale** if the fix isn't cheap — message content
matters more than framing, and a rushed all-three is worse than a clean two.

## 8. One open design question, delegated

`find_macro_entry(pkg_dir)` takes only a path and has no idea a specifier or an
overlay was involved. Threading provenance is the real work in D-2. Two shapes —
pass an `origin` down into the leaf, or enrich at the call site that already
knows the specifier and whether Tier 0 fired. **CDC leans on enriching at the
call site** (keeps the leaf pure, smaller diff, context lives where it already
is), but CC is closer to that call chain and owns the call. Recorded here so the
decision is visible rather than absorbed silently into the diff.
