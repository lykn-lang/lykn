# M16-2 Formatting Divergences Diagnosis — CDC Review (Turn 1)

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-16-m16-formatting-divergences-diagnosis.md`
**Reviewed at:** 2026-05-16
**Disposition:** **Diagnosis accepted with one direction-revision and
one promotion-to-correctness-grade.** CC's amendment request
(defer the `=` assignment bug fixes to DD-58) is **approved**. One
additional item promoted to correctness-grade by CDC review: C-6
template-content divergence is real, not just "investigate" —
`String.raw` preserves source-text literally and the JS-vs-Rust
content differs in character count. Tiers A and B are committed
and done; Turn 2 proceeds on the items below.

---

## Methodology behavior — exemplary

CC's behaviour in Turn 1 is methodology-positive across the board:

1. **The MUST-gate held.** CC stopped at the diagnosis, surfaced
   findings, and waited for CDC review rather than auto-proceeding.
2. **Two items promoted from formatting-class to correctness-grade**
   (C-1 class constructor `=`, C-4 destructuring-assignment `=`).
   This is exactly the escape hatch the prompt's Tier C structure
   was designed to enable — CC didn't silently re-scope to "still
   formatting" to keep the work bounded.
3. **Amendment request raised explicitly** rather than worked
   around. The deferral-to-DD-58 reasoning is sound and worth
   approving.
4. **Three items declared "no action — already converges"** with
   the stale-build hypothesis named. CC didn't paper over by
   inventing fixes; surfaced the empirical finding honestly.
5. **C-6 template content tagged "may be correctness-grade —
   need investigation"** rather than auto-classified as
   formatting. Right instinct; CDC's independent verification
   confirms.

The Turn 1 ⇄ Turn 2 gate is now demonstrably the right shape for
this class of work. Worth canonicalising as a methodology pattern
beyond this thread.

---

## Verification of CC's substantive claims

### Claim 1: C-1 class constructor `=` and C-4 destructuring-assignment `=` are correctness-grade ✓

**Verified.** The Rust output `this.x === x;` is a no-op equality
comparison; the user's clearly-intended assignment (`this.x = x;`)
is what JS emits. The runtime behaviour differs: JS sets the
property; Rust does not. Both compilers' surface macros emit `===`
unconditionally for surface `=` (verified at `packages/lang/surface.js`
`macroEnv.set("=", ...)` and `crates/lykn-lang/src/emitter/forms.rs`
`SurfaceForm::Eq`).

The JS path apparently has a class-form-specific path that
preserves the user's `=` as kernel-= (assignment) inside
constructor bodies — honouring ID-38's context-dependent semantics
for kernel-=. The Rust path doesn't have the equivalent treatment.

### Claim 2: root cause is at surface-classification, not codegen ✓

**Verified.** Rust codegen `emit.rs:193` has
`"=" => emit_assignment(w, args)?` — codegen DOES treat the `=`
atom as assignment. The bug is upstream: the surface classifier
intercepts `=` as `SurfaceForm::Eq` (per `is_surface_form` in
`dispatch.rs`) and the emitter converts it to `===` before codegen
sees it. So `emit_assignment` is never reached for these cases.
The fix has to be at the classifier or emitter layer, not codegen.

### Claim 3: deferral to DD-58 is the right call ✓

**Approved.** Reasoning beyond CC's:

- Under DD-58's closed-namespace model, surface `=` is
  unambiguously equality (flavor c — rich namesake-sharing with
  kernel `=`); surface `set!` is unambiguously property assignment;
  kernel `=` (reached via `(kernel:= ...)`) preserves ID-38's
  context-dependent behaviour.
- The user's `(= this:x x)` in a class constructor body is
  arguably *deprecated surface syntax* — DD-22 already moved
  property assignment to `set!`. Under DD-58, this either becomes
  a diagnostic ("did you mean `set!`?") or an implicit conversion.
- Fixing the divergence at the surface-classifier or class-form
  handler layer NOW would lock in a specific interpretation that
  DD-58 may need to revisit. CC's "partial fix that DD-58
  supersedes" framing is correct.
- The bug is real but **bounded** in user impact: any user
  affected today is writing `(= property value)` in a class body,
  which DD-22 already deprecated as a pattern. The `set!` migration
  path exists.

**Recommended scope for the deferral:** DD-58's draft (workbench)
should explicitly call out this divergence as one of the
correctness-grade items the closed-namespace model resolves.
Worth a sentence in DD-58's "What Worked" / "Breaking Changes
Inventory" or similar section, naming this bug as resolved by the
namespace clarification.

### Claim 4: C-2 (generators), C-4 (destr param formatting), C-5 (defaults) already converge ✓ (with caveat)

CC reports that re-running these tests post-normalization yields
convergent output and that the original M16-2 failures were
likely stale builds. **CDC accepts this provisionally** — the
empirical evidence (CC's re-run after a fresh build) is the right
basis. The caveat: CC says C-5 may have a different failing pattern
not yet pinpointed.

**Direction for Turn 2:** For C-2 and C-4 destr-param formatting,
no action needed; convert the affected test files to `compile-both`
to lock the convergence into the regression net. **For C-5,
CC MUST find the specific failing pattern** before declaring "no
action" — the current diagnosis says "Need more investigation." If
C-5 turns out to be a genuine divergence (not a stale-build
artifact), it gets the same treatment as other classes.

### Claim 5: C-6 template content "may be correctness-grade — need investigation"

**CDC verifies: yes, correctness-grade.** Analysis:

The lykn source `(template "\\n")` — the string literal `"\\n"`
parses to a 2-character string: backslash + n (per standard
escape-sequence rules).

- **JS output:** ``` (String.raw)`\n`; ``` — the template literal
  contains the 2-character source-form `\n` (backslash + n). At
  runtime, `String.raw` preserves source-text literally, returning
  the 2-character string `"\n"` (backslash + n).
- **Rust output:** ``` String.raw`\\n`; ``` — the template literal
  contains the 3-character source-form `\\n` (backslash + backslash
  + n). At runtime, `String.raw` returns the 3-character string
  `"\\n"` (two backslashes + n).

The runtime string lengths differ by 1. Any consumer code that
counts characters, uses the string as a regex, or pattern-matches
on its content will produce different results between JS and Rust
output.

**Promotion to correctness-grade. Direction (a) for Turn 2 — align
Rust to JS.** The JS output is correct (preserves the user's
literal 2-character intent through to runtime). The Rust output
adds a spurious backslash escape that doesn't belong there.

**Same caveat as C-1/C-4:** if this turns out to be entangled with
the kernel/surface = boundary (e.g., template literal interpretation
in surface vs. kernel), defer to DD-58. CDC's read is that this is
a localised template-emission bug, not a closed-namespace issue,
but CC should surface if the diagnosis differs.

---

## Direction confirmations per class (for Turn 2)

| Class | CDC direction | Notes |
|-------|---------------|-------|
| **C-1 object parens** | **(a) align Rust** | Codegen: wrap standalone object expressions in `(...)` for expression-statement disambiguation |
| **C-1 class body whitespace** | **(c) normalize** | Already handled by whitespace collapse; convert affected tests to `compile-both` |
| **C-1 class constructor `=` (correctness)** | **DEFER TO DD-58** | Amendment approved. Add to DD-58 breaking-changes inventory; convert affected test to `compile-both` with `set!` instead of `=` (or skip with rationale comment for now) |
| **C-2 generators** | **no action — convert to compile-both** | Stale build hypothesis accepted; convert test to lock convergence |
| **C-3 trailing `;`** | **(c) normalize** | Extend the `;\s*}` normalizer pattern OR strip trailing `;` after `}` more broadly. MUST update the normalizer-policy comment (B-3) with rationale |
| **C-3 async arrow parens** | **(a) align Rust** | Codegen: wrap async arrows in `(...)` matching JS's expression-statement disambiguation |
| **C-4 destr-param formatting** | **no action — convert to compile-both** | Already converges; convert tests |
| **C-4 destr-assign `=` (correctness)** | **DEFER TO DD-58** | Same as C-1 class constructor `=`. Approved amendment |
| **C-5 default params** | **investigate first** | CC MUST pinpoint the specific failing pattern. If genuine divergence: (a) or (b) per CC's analysis. If stale build: no action + convert tests |
| **C-6 tag parens** | **(a) align Rust** | Codegen: wrap tag expressions in `(...)` for member-expression tags |
| **C-6 template content (correctness — CDC promotion)** | **(a) align Rust** | Codegen: stop adding spurious escape in template content. Investigate if entangled with surface/kernel boundary — if yes, defer to DD-58 |

---

## Aggregate disposition for Turn 2

**Turn 2 acceptance criteria, by item:**

- **C-1 object parens, C-3 async arrow parens, C-6 tag parens:**
  fix in Rust codegen (`emit.rs`). Convert the affected test files
  to `compile-both` (per the prompt's aggregate acceptance).
- **C-1 class body, C-2 generators, C-3 trailing `;`, C-4 destr-param,
  C-4 destr-assign `=` (post-defer), C-5 (after pinpoint):** convert
  the affected test files to `compile-both`. For C-3 trailing `;`,
  update normalizer-policy comment from B-3 with rationale.
- **C-1 class constructor `=`, C-4 destr-assign `=`:** deferred to
  DD-58. Add a comment to DD-58's draft (workbench) referencing
  these two findings. Test files affected by these specific cases
  either (a) get `(set! ...)` substituted for `(= ...)` as a
  user-code fix that produces convergent output, or (b) get a
  skip-with-rationale comment naming the DD-58 deferral.
- **C-5:** pinpoint first; then either (a)/(b) per CC's analysis,
  or no-action-+-convert-tests if stale build.
- **C-6 template content:** fix in Rust codegen; investigate
  whether entangled with surface/kernel boundary before fixing.
  If entangled, defer to DD-58 with explicit reason.

**Aggregate target:** the 9 affected test files now use
`compile-both` (modulo the 2 deferred-to-DD-58 cases, which get
skip-with-rationale). The total `compile-both` count strictly
greater than the post-M16-2 baseline of 68.

---

## Open items needing CDC follow-up

1. **DD-58 amendment to record C-1/C-4 deferrals.** I'll add a
   paragraph to DD-58's draft (when I get to its revisions)
   naming these two findings as items the closed-namespace model
   resolves. Provisional spot: in the "Breaking changes inventory"
   or "What this fixes" section.

2. **Normalizer-policy comment language for C-3 trailing `;`.**
   When CC extends the normalizer (per B-3), the rationale should
   name C-3's class explicitly: "trailing semicolons after function
   declarations and other top-level statements are syntactically
   valid but unnecessary; collapsed here because the divergence is
   stylistic and downstream-irrelevant. Original source: M16-2
   compileBoth fast-follow."

3. **Template content fix — verify entanglement.** Before CC
   implements the C-6 template-content fix, CC should briefly
   diagnose: is the bug in the template emitter's escape-handling
   (localised), or in how surface vs. kernel processing of
   template content interacts (DD-58 territory)? If localised,
   fix; if surface/kernel-entangled, defer.

---

## Methodology observations to canonicalise

1. **The two-turn Tier C pattern worked.** CC's MUST-gate behaviour
   surfaced two correctness-grade items + one amendment request +
   three "no action" items + one investigate-further item. None
   of these would have been visible if CC had auto-proceeded to
   implementation. The diagnosis-with-gate pattern is now
   demonstrably the right shape for multi-class formatting work.

2. **The "promotion to correctness-grade" escape hatch is
   load-bearing.** Two items got promoted (C-1 class `=`, C-4
   destr `=`) by CC; one more (C-6 template content) by CDC. That's
   three of six classes that turned out to be more substantive
   than the prompt's tier classification implied. **Worth
   canonicalising: when scoping work as "formatting-class" or
   "stylistic," always include the escape hatch for empirical
   promotion to correctness-grade.**

3. **Deferral-to-larger-DD is methodology-positive when the
   architectural reason is real.** CC's amendment request for
   C-1/C-4 isn't avoidance — it's recognising that a partial fix
   would lock in an interpretation that DD-58 supersedes. The
   prompt's structure made this possible: each Tier C item could
   be independently dispositioned, so deferring two while
   implementing the others is clean.

---

## What CC does NOT need to redo

- The Tier A and Tier B work (committed) is done and accepted.
- The Tier C diagnosis is structurally sound; the directions per
  class are confirmed above.
- CC's correctness-grade promotions for C-1/C-4 are accepted as
  presented.
- The "no action — already converges" findings for C-2 and C-4
  destr-param formatting are accepted (with the test-conversion
  follow-through requirement).

---

## Open inputs for Duncan

1. **Approve the diagnosis + directions per class?** CDC has;
   awaiting your sign-off per methodology framework.
2. **Approve the C-1/C-4 `=` deferral to DD-58?** CC requested;
   CDC concurs. Your ratification ratifies the methodology call.
3. **Approve the C-6 template-content promotion to correctness-
   grade?** This is CDC's call (not CC's); your sign-off seals it.
4. **DD-58 draft revision to record the C-1/C-4 deferrals:**
   CDC will add this paragraph in the next DD-58 revision. Say
   if you want it earlier (now vs. next pass).
5. **Iteration count:** Turn 1 was iteration 1 of 5. Turn 2 will
   span 1-2 iterations (implementation + verification). Plenty of
   budget.
6. **Commit timing for cdc/compiler-coherence merge:** when you're
   ready to merge into release/0.6.x, M16 + source-context-path +
   compile_file_with_dts-cleanup + import-macros-Turn-2 + this
   Turn-2 work all land together. Sequencing your call.
