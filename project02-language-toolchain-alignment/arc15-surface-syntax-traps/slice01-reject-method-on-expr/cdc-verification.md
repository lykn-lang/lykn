# arc15 · slice01 — CDC Verification (Reject method-on-expression + migrate guides)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's slice01 delivery @
`9ca9c7e` (closing-report + ledger untracked). **Verifier ≠ closer.** CDC checks
against `lang` by code review + grep (no toolchain in the sandbox); runtime rows
(`make check`/`make test-docs`) stay CC-attested → host reconcile.

## Verdict — VERIFIED (with one carry-forward + a CDC self-correction)

The guarantee holds and the guides are clean. `9ca9c7e` is an ancestor of HEAD;
the diff is exactly scoped (3 source files + 6 guides, no drive-bys). The design
deviation CC flagged — a recursive validation pass instead of the classify-
dispatch check the cc-prompt specified — is **correct and an improvement**, not a
workaround. One consistency carry-forward for slice02 (below), and one enumeration
miss that was mine, caught by CC.

## Independent CDC checks (against `lang` source)

| Claim | CDC check | Result | Strength |
|-------|-----------|--------|----------|
| Recon-scoped diff | `git show --stat 9ca9c7e` | `compile.rs`, `classifier/forms.rs`, `classifier/mod.rs` + 6 guides; **no unrelated files** | **reproduced** |
| **The guarantee — cannot compile the trap** | read `check_method_on_expression` + `walk_method_calls` (`forms.rs`) + wiring (`compile.rs:177`) | signature = head `List`/`Cons` **and** arg0 `Keyword`; `walk_method_calls` recurses every List child + Cons car/cdr → **any nesting depth**; runs in `compile_source_inner`, the shared path for build/run/test/compile | **reproduced** |
| No over-rejection | read the carve-outs | atom method (atom head), threading `(:m a)` (keyword *head*, not List head), IIFE/curried (List head + **non**-keyword arg0) all fall through | **reproduced** |
| Guides migrated to threading | grep the enumerated sites | `(-> (new TextEncoder) (:encode …))`, `(-> (parts:slice 1) (:join "="))`, `(-> (/ cents 100) (:toFixed 2))`, etc. — threading | **reproduced** |
| No guide teaches the trap | re-run `grep -rnE '\):[a-zA-Z]' docs/guides/` | 9 hits, **all** comments / prose / "don't" examples (ID-31/ID-41/ID-47/ID-20) | **reproduced** |
| `make check` + `make test-docs` green (476/0) | host-only | not independently run | **attested (CC)** → host reconcile |

## Ledger walk (S-1…S-7)

S-1 (error + fix-it) **met**; S-2 (no over-rejection) **met**; S-3 (teaching
sites → threading) **met**; S-4 (ID-31 threading-primary + 09-anti-patterns
cross-ref) **met** — landed as ID-31 (express) + ID-41 (get) rewritten, and new
**ID-47** (compiler-enforced) in 09-anti-patterns; S-5 (`make test-docs` + clean
sweep) **met (CC-attested)**; S-6 (`make check`, no source regressed) **met
(CC-attested)**; S-7 (scoped diff) **met**.

## The design deviation — assessed, and endorsed

DD-64 §4 and the cc-prompt placed the check in the classifier's **call dispatch**.
CC found that insufficient: `classify_form` only sees top-level forms, and the
trap is normally **nested** (a `bind` value, a call arg), lowered lazily by the
emitter without re-classifying — so a dispatch-only check let
`(bind r ((express p):join ""))` through. CC added a recursive
`validate_method_calls` pass (mirroring D2's `binding::validate_reserved_names`)
wired into `compile_source_inner`, keeping the dispatch check for fast `lykn
check`. **This is the correct architecture** — the recursive pass on the shared
compile path is what actually delivers "cannot compile the wrong way." Endorsed;
DD-64 should be annotated to reflect that the guarantee lives in a pipeline
validation pass, not classify-dispatch.

## Carry-forward for slice02 (and a small slice01 follow-up)

`lykn check` (`check_strict`) and the eventual slice02 **lint rule** currently
would rely on **dispatch-level** detection (top-level only) — so a *nested* trap
that `lykn build` rejects could pass `lykn check`/`lykn lint`. The guarantee is
intact (nothing wrong ever *compiles*), but check/lint should agree with compile.

**slice02 requirement:** the lint rule MUST use the recursive `walk_method_calls`
detection, not a dispatch branch — this is exactly CC's own bubble-up ("nesting
traps need a tree-walk"). **Small follow-up:** wire `validate_method_calls` into
`check_strict` too, so `lykn check` ≡ compile on this trap (cheap — the pass is
already public in `classifier::`). Neither blocks slice01's close.

## CDC self-correction (owning my miss)

CC surfaced a guide site my cc-prompt enumeration mis-handled:
**`09-anti-patterns.md:405`** — the ID-20 fire-and-forget "Fix" used
`((log-request req):catch …)` in a **compiled** fence (a *live* teaching site,
would have broken `make test-docs`), but I filed 09-anti-patterns under
"documented-as-wrong / repoint" rather than "migrate," so it wasn't in the
migrate list. I also collapsed "ID-31 (1040/1257/1263)" into one entry when it
spanned **two** (ID-31 express + ID-41 get). CC caught and migrated both. My
sweep *found* line 405; my categorization of it was wrong. Lesson for the next
trap-migration prompt: a `):kw` hit inside a ```` ```lykn ```` (non-skip) fence is
a **migrate** site regardless of the guide's "anti-pattern" framing — classify by
fence-executability, not by the surrounding prose.

## Close status

slice01 **CDC-verified**; **not yet closed** — closer ≠ verifier, and
`make check`/`make test-docs` reconcile on a host re-run. arc15 arc-plan:
**A-1 → done-pending-reconcile**; **A-3/A-4/A-5/A-6 → met** (A-5/A-6 CC-attested);
**A-2 (lint) remains open** with the recursive-detection requirement above.
Ledger close-commit is Duncan's. No iteration burn (first pass, self-corrected).

## Host note (from CC, worth keeping)

On Apple Silicon, `cp` over the running `bin/lykn` invalidates the binary's
signature → `Killed: 9`. Re-copy with `rm -f bin/lykn && cp …` (or install to a
fresh path). Operational, not a code issue.
