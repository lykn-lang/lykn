# 01 · macro-entry-diagnostics — CDC Verification

**By:** CDC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Verifying:** `41cf05a` (source + tests) + `e8f212d` (slice docs)
**Verdict: CLOSE** — six rows met at code level, with **one disclosed deferral**
that CC surfaced rather than glossed (see §3). Two corrections to my own prior
claims recorded in §4.

## 1. Method

Read the post-fix source at HEAD — `pass0.rs`, `expander.js`, both new test
files — not CC's diffs or summary. Structural rows are *reproduced by
inspection*. `make check` and the induced-drift demo are **CC-attested**; I have
no toolchain.

## 2. Per-row verification

| Row | CDC finding |
|-----|-------------|
| **M-1** | **Met.** `find_macro_entry` branches on `!pkg_dir.is_dir()` before the candidate walk. The call-site widening in `process_single_import` is `resolved.is_dir() \|\| !resolved.exists()` — I checked the third case, and it's correct: a path that *exists and is a file* (the ordinary resolved-to-`mod.lykn` success) takes neither branch and proceeds untouched. The widening was necessary, not incidental: without it a missing path never reached the leaf and produced the downstream "cannot read macro module" instead. |
| **M-2** | **Met, with a note.** The message is preserved and the pre-existing Rust↔JS drift is closed. **But parity was reached by levelling down:** Rust's form carried a parenthetical — `checked: lykn.macroEntry (absent or file not found)` on its own line — telling you *which* check failed; the unified message is JS's single line without it. The result is fine and no worse than JS was, but "make them match" silently resolved as "make them both the less informative one." Recorded, not blocking. If the distinction was worth having, it's cheap to restore *in both*. |
| **M-3** | **Met.** `MacroOrigin { specifier, via_overlay }` threaded into the leaf; `macro_dir_not_found_message` emits specifier, `via:` and both exits. The `via_overlay` predicate is exactly right — a scheme specifier whose import-map target is non-scheme is precisely the Tier-0 case, and it reuses `is_scheme_specifier` rather than re-deriving the test. |
| **M-4** | **Met, with a bounded guarantee (disclosed).** The parity test asserts seven canonical phrases appear verbatim in both source files, and CC verified it **fails on induced drift** by breaking the JS `checked:` line — which is what the ledger asked for (fails on a real divergence, not merely exists). **Its limit, which CC states in the test's own header:** it compares *source text*, not emitted output. So it catches vocabulary drift — the class that actually happened — but would stay green if one implementation assembled the same phrases in a different order, or if a phrase appeared only in a comment. Bounded, honest, and appropriate to the cost; the stronger form (compare emitted strings from both compilers over one fixture) is the upgrade if this class recurs. |
| **M-5** | **Met, and my diagnosis was wrong.** I attributed the `Uncaught (in promise)` to `expander.js:1252-1256` escaping to the runtime. It was the **deno eval compile-driver script in `main.rs`** failing to catch — the throw itself was fine. CC traced the actual path instead of taking my word for it, which is the correct response to a prompt that asserts a mechanism. Closed as done rather than the deferral I'd pre-authorised. |
| **M-6** | **Met.** Diff scope: `pass0.rs`, `expander.js`, two new test files, plus the one `main.rs` touch required by M-5 — which was disclosed rather than folded in. No new deps. `make check` CC-attested. |

## 3. The deferral CC surfaced — and it is the right call

CC disclosed that mycelium's `lykn test` resolves `@lykn/lang@0.5.2` from the
registry, so **the JS compiler on mycelium's path predates this fix**. The
improved message reaches that path only when 0.6.0 publishes.

**This means the ledger's own "Acceptance demonstration" cannot be reproduced
today.** The bar I wrote was the operator's C-bis repro producing an actionable
message; run right now it produces the *old* content (M-5's no-crash framing is
live; M-1/M-3's content is not).

That is a gap between a stated bar and what is demonstrable, and CC named it
rather than declaring the row met and moving on. **Recording it properly:**

> **Acceptance demonstration — DEFERRED.** Re-entry condition: **0.6.0
> publishes**. At that point re-run runsheet Part C-bis against a mycelium
> whose pins have moved to 0.6.0 and confirm the message names the specifier,
> the overlay, and both exits. Verified today by the local Rust binary
> (`lykn compile` prints the full diagnostic) — CC-attested.

The rows are met; the *end-to-end demonstration* is owed. Both are true and
neither cancels the other.

CC also routed a follow-up rather than expanding scope into `cmd_test`
control-flow: **a swallowed Rust validation error in `compile_lykn_test_files`**
means the local binary's good message doesn't reach the operator even when the
local compiler produces it. That is a discovery in its own right — a swallowed
error is a close cousin of the "green means nothing" family already logged — and
belongs in `backlog/discoveries.md`, not only in this closing report.

## 4. Corrections to my own claims

Two, both worth recording because they share a shape.

**(a) M-5's escape point.** I said the JS expander's bare `throw` reached Deno's
top level. It didn't — the compile-driver script did. I had a grep hit on the
`throw` and reasoned the rest of the causal chain without tracing it.

**(b) Earlier today, the stale `dist/`.** I claimed a build-skipping publish
would ship 0.5.2 metadata. Wrong — `publish` reads `target/lykn/dist/`, and the
`0.5.2` artifacts were in the *legacy* repo-root `dist/`. Same shape: one
observation, a confident consequence, no trace of the path in between.

Twice in one day is a pattern, not two accidents. **My named failure mode is
asserting a causal chain from a single grep hit** — and both times the fix was
someone else checking. Worth carrying into the bootstrap: *when I state a
consequence ("this would ship wrong metadata", "this escapes to the runtime"),
that is a claim about a path I have not walked, and it should be marked as one.*

## 5. Design decision: CC chose (a) over my lean, correctly

I leaned (b) — enrich at the call site, keep the leaf pure, smaller diff. CC took
(a), threading `MacroOrigin` into the leaf, reasoning that it makes parity hold
"by construction."

**CC's choice was right and his justification slightly overstated.** Parity is
*not* by construction — there are still two implementations in two languages,
still guarded by the M-4 test and nothing else. What (a) actually buys is a
**smaller parity surface**: one message-building function per language, rather
than enrichment logic at call sites that differ far more between Rust and JS
than the leaves do.

That's the better argument, and it beats mine. I optimised for diff size and leaf
purity; in a two-compiler project, parity surface is the higher-order concern and
I weighted it too low. Recorded because the *reasoning* is reusable: **when a
thing exists twice, prefer the shape that minimises how much of it exists
twice** — even at the cost of a wider signature.

## 6. Bubble-up verification

**Delivered its assigned piece?** Yes — all six ledger rows, against a slice-doc
written before implementation, with no scope creep. The one out-of-scope touch
(`main.rs`, for M-5) was disclosed.

**Silent-drop diff:** clean. Two items routed forward, both with named homes and
re-entry conditions: the acceptance demonstration (→ 0.6.0 publish) and the
swallowed `compile_lykn_test_files` error (→ follow-up, and the register).

**Plan change required?** No. This is a standalone slice with no arc above it;
`project-plan.md` v1.36 already carries it and §2's standalone-slices note points
at it. On close, that note's status moves open → closed.

**What it revealed:** the systemic entry now has its fourth instance in one day.
The missing-directory case had **no test in either compiler**, and it is the case
that shipped wrong — joining slice07's rewritten-with-zero-coverage function, the
test whose name overclaimed its guard, and the shape-assertion tests that never
execute. Four independent code paths, one root: *we have several ways for green
to mean nothing, and the uncovered case is reliably the one that ships wrong.*
That is no longer a collection of findings. It is a finding.

## 7. Verdict

**01-macro-entry-diagnostics CLOSES.** Six rows met; the acceptance demonstration
deferred with a named re-entry condition; one follow-up routed.
