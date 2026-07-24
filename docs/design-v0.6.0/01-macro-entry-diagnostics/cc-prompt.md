# CC Prompt — `import-macros` resolution diagnostics

**From:** CDC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Origin:** operator hit this running arc06's host-reconcile runsheet, Part C-bis
(the negative check that proves a `lykn link` override is live).
**Recon:** done — premise verified by reading both implementations. No recon
turn needed; this is a direct implementation prompt.

## What happened

Running the C-bis negative check — move the linked dist away, confirm the build
fails at the *local* path rather than silently falling back to JSR — produced:

```
error: Uncaught (in promise) Error: import-macros: no macro entry found in
  /Users/oubiwann/lab/lykn/lang/target/lykn/dist/testing/
  checked: lykn.macroEntry, mod.lykn, mod.lyk, macros.lykn, macros.lyk, index.lykn, index.lyk
  hint: add lykn.macroEntry to the package's deno.json
```

The check **passed** — that's the correct failure. But the diagnostic is wrong in
three separate ways, and one of them is actively misleading.

## Finding 1 — neither implementation checks whether the directory exists

**This is the important one.**

`find_macro_entry` (Rust: `crates/lykn-lang/src/expander/pass0.rs`; JS:
`packages/lang/expander.js:1235-1258`) walks a candidate chain — `lykn.macroEntry`
from `deno.json`, then `mod.lykn`/`mod.lyk`/`macros.lykn`/`macros.lyk`/
`index.lykn`/`index.lyk`, then a `.lykn`-valued `exports` — and every probe is an
existence check on `pkg_dir.join(candidate)`.

**When `pkg_dir` itself doesn't exist, every probe fails for that reason**, and
both implementations fall through to the same error, which reports "no macro
entry found in \<dir\>" and hints *"add `lykn.macroEntry` to the package's
`deno.json`"*.

That hint tells the user to add a config field to a `deno.json` inside a
directory that isn't there. It is confidently, specifically wrong — which is
worse than terse. The two cases need different messages:

- **`pkg_dir` missing** → *the package directory does not exist*
- **`pkg_dir` present, no entry** → the current message, which is good as-is

### The fix

Check `pkg_dir` first and branch. Sketch for the Rust side; mirror it in JS:

```rust
if !pkg_dir.is_dir() {
    return Err(LyknError::Read {
        message: format!(
            "import-macros: package directory not found: {}\n  \
             the macro module was resolved to a path that does not exist",
            pkg_dir.display()
        ),
        location: SourceLoc::default(),
    });
}
```

## Finding 2 — the error names a path the user never typed

The user wrote:

```lisp
(import-macros "jsr:@lykn/testing@0.5.2" (test is-equal))
```

The error names `/Users/oubiwann/lab/lykn/lang/target/lykn/dist/testing/`. Those
are connected by a `lykn link` overlay in `project.local.json` — and nothing in
the message says so. The user has to reverse-engineer why the compiler is
looking somewhere they never mentioned.

**When resolution came through the Tier-0 overlay, the error should say so and
name the two exits.** Target shape:

```
import-macros: package directory not found
  specifier: jsr:@lykn/testing@0.5.2
  resolved to: /Users/oubiwann/lab/lykn/lang/target/lykn/dist/testing/
  via: lykn link overlay (project.local.json)
  hint: run 'lykn dist' in the linked project, or 'lykn unlink jsr:@lykn/testing@0.5.2'
```

That matches the bar this arc already set elsewhere — `"run 'lykn dist' in <path>
first"`, `"registry returned 404"`, `"Commit or stash these changes, or pass
--allow-dirty to proceed anyway."` Each names the problem *and* the exit.

### Design question for you (answer before implementing)

`find_macro_entry(pkg_dir)` takes only a path — it has no idea a specifier or an
overlay was involved. Threading provenance to it is the real work here. Two
shapes:

- **(a) Pass provenance down.** Give `find_macro_entry` an optional
  `origin: Option<&MacroOrigin>` carrying the specifier and whether Tier 0 fired.
  Honest and complete; touches the call chain.
- **(b) Enrich at the call site.** Let `find_macro_entry` stay path-only and have
  `resolve_specifier`'s caller — which *does* know the specifier and whether the
  overlay fired — catch the error and add the specifier/via/hint lines.

**I lean (b)** — it keeps the leaf function pure, puts the context where it
actually lives, and is a much smaller diff. But you're closer to that call chain
than I am. If (b) turns out to lose the distinction between the two error cases,
say so and take (a).

Finding 1 is worth landing **regardless of which shape you pick**, and it's
independent of Finding 2 — do it first if that helps you split the work.

## Finding 3 — the JS path escapes as an unhandled promise rejection

`error: Uncaught (in promise) Error: …` is Deno's top-level handler, not ours.
The JS expander throws a bare `Error` (`expander.js:1252-1256`) that escapes to
the runtime, so a *user-facing, expected* failure — you linked something that
isn't there — is presented as a crash.

Every other failure in the CLI is a clean `eprintln!` plus an exit code. Please
check where this escapes on the `lykn test` path and whether it can be caught and
reported the same way. **If it can't be done cheaply, say so and log it** rather
than forcing it — the message content matters more than the framing, and I'd
rather have Findings 1 and 2 landed clean than all three landed rushed.

## Cross-compiler parity — the constraint that shapes this slice

**The message exists twice**, in `pass0.rs` and `expander.js`, and they have
already drifted: Rust lists the checked candidates on two lines with a
parenthetical about `lykn.macroEntry` being absent-or-not-found; JS lists them on
one line without it.

This is the DD-57 Q4=A / W-3 problem in miniature — two implementations of one
semantic answer, kept in sync by hope. **Both implementations must produce
matching diagnostics, and there must be a test that fails when they drift.** If
a shared fixture is the cheap way to get that, use one; if a cross-compiler test
asserting both messages is cheaper, do that. Your call, but the drift-detection
is not optional — it is the point of the slice.

## Tests

The existing test is `test_find_macro_entry_no_entry_errors` (`pass0.rs:1026`).
It creates the temp directory, then calls `find_macro_entry` — so it covers
"directory exists, no entry" and **there is no test at all for "directory
missing."**

That is exactly the untested case that produced the misleading hint. Same shape
as slice07's F3: the untested path is the one that shipped wrong.

Required:

1. **`find_macro_entry` on a missing directory** → the not-found error, *not* the
   `lykn.macroEntry` hint. Both compilers.
2. **`find_macro_entry` on an existing directory with no entry** → the current
   message unchanged. Both compilers. (Regression guard — don't lose the good
   message while fixing the bad one.)
3. **Parity:** the two implementations agree, and the test fails if they drift.
4. If Finding 2 lands: an overlay-resolved failure names the specifier and the
   `lykn unlink` exit.

## Scope

**In:** the three findings above, the tests, cross-compiler parity.

**Out:** any change to Tier-0 resolution semantics (slice07 is closed and
CDC-verified — this is diagnostics only); the `lykn link` runtime-import
boundary (0.7.0); anything in the arc-level planning docs.

**Bar:** `make check` green; the C-bis negative check produces a message that
tells the operator what to do next without reading the source.

## Where this lands

**Confirmed by the operator 2026-07-24:** a **standalone slice** at
`docs/design-v0.6.0/01-macro-entry-diagnostics/` — the "one slice, not an arc"
collapse in `PROJECT-MANAGEMENT.md` Part II, so there is no `arc-plan.md` and no
arc-level closing-report above it. Bare-`NN` non-arc units already exist in this
project under `docs/design-v0.7.0/` (`01-treeshake-audit`, `02-packaging-strategy`,
`04-typed-classification`); this follows that convention rather than inventing a
parallel one.

Read `slice-doc.md` and `ledger.md` in that directory before starting — the
ledger's six rows (**M-1 … M-6**) are the contract, and **M-4 (parity, with
drift-detection) is the structural point of the slice**, not a nicety.

**Deliberately not an arc06 row.** arc06 is CLOSE-READY at the operator's gate,
its capability is delivered, and `find_macro_entry` predates slice07 entirely —
slice07 only made this path reachable a new way. Nothing here should touch the
arc-level planning docs.

On close, write `closing-report.md` with the per-row walk (6 in, 6 out — any
deferral disclosed with a rationale and a named home, per M-5); CDC writes
`cdc-verification.md`.
