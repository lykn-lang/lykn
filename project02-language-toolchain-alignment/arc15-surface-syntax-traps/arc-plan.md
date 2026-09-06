# arc15 — Surface-Syntax Traps

> **Status: CLOSED — 2026-08-08** (operator-initiated
> after the arc06/slice02 #6 finding + pushback). **Release: 0.6.0.** The home
> for surface-syntax shapes that **compile clean but mean something the author
> didn't write** — starting with method-call-on-an-expression (DD-64). Design:
> [`design/dd-64-method-on-expression-DRAFT.md`](design/dd-64-method-on-expression-DRAFT.md)
> (odm promotion = Duncan).

## 1. Capability

A class of lykn surface forms currently **compile to confidently-wrong output
without an error** — the author writes something that looks right, the compiler
faithfully compiles a *different* valid construct, and the mistake surfaces (if
at all) as an opaque runtime crash. This is the exact "papered-over / silently
wrong" class 0.6.0 exists to close, applied to *surface syntax*. arc15 makes
each such trap a **compile error with a fix-it**, teaches the Lykn-correct
pattern in the guides, and adds a **lint rule** for the friendly earlier catch —
so a user *cannot* build a codebase on the trap and have it break later.

The flagship (and slice01) is **method-call on a parenthesized expression**
(`((express parts):join "")` → `parts.value("join","")`), whose correct form is
threading (`(-> (express parts) (:join ""))`). DD-64 is its design.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · reject-method-on-expr + guide migration** | Classifier **error** on `(<non-atom-head> :kw …)` with a threading fix-it + tests; **migrate the guide sites** that teach the trap to threading + repoint ID-31/ID-41/09-anti-patterns (ID-47). Landed as a **recursive `validate_method_calls` pass** in the compile pipeline (dispatch-only was insufficient for nested traps). | **CDC-verified** (`9ca9c7e`; host reconcile pending) |
| **slice02 · lint rule** | arc05 `lykn lint` rule flagging `(<non-atom-head> :kw …)` with the threading fix-it. Reused the recursive method-call walk so lint/check agree with compile on nested traps; follow-up B replaced the magic `:when` carve-out with the structural match-clause exemption. | **CDC-verified** (`d6c23b5` + `90cf211`) |
| **slice03 · type-safe method-check (hardening)** | **DEFERRED (operator, 2026-07-22 — keep B).** The post-classify premise **failed**: classification leaves *nested* exprs raw (`Bind.value`/`FuncClause.body` are `SExpr`), so a nested guarded `match` stays raw and its `((pattern) :when …)` keeps the trap shape (CC proved vs `data-types.lykn`). Match-awareness is therefore **irreducible** without a full classifier rewrite (**Option C → 0.7.x backlog, research**). B (structural `is_match_clause`/`ptr::eq` exemption) is **retained** for 0.6.0; document the borrow invariant. | **Deferred → 0.7.0 (Option C)** |
| **slice04 · sibling traps** | Execution-probed and fixed the sibling traps: stripped Rust `fn` no longer drops the final value (`D-2607-3XKP`), string escapes cook or fail instead of silently collapsing (`D-2607-N6HS`), and final `return`/`throw`/`break`/`continue` forms are no longer double-wrapped (`D-2607-K4WT`). Guide ID-32/ID-33 re-scoped. Probe corrected one premise: current untyped `(fn (x) …)` is **not** a cross-backend silent-return trap; JS rejects it, Rust mis-lowers it loudly, now tracked as `D-2608-H7FN`. | **Closed** ([slice-doc](slice04-sibling-traps/slice-plan.md), [ledger](slice04-sibling-traps/ledger.md), [closing-report](slice04-sibling-traps/closing-report.md)) |
| **slice05 · nested `fn` parameter validation** | Fast-follow for `D-2608-H7FN`: Rust now rejects nested bare-parameter `fn`/`lambda`/`genfn` forms at compile/check time, matching JS, instead of falling through to bad raw-call emission. The fix is a narrow parameter-list validator; the older labelled-`fn` non-param arity residual remains unchanged. | **Closed** ([slice-doc](slice05-nested-fn-param-validation/slice-plan.md), [ledger](slice05-nested-fn-param-validation/ledger.md), [cc-prompt](slice05-nested-fn-param-validation/cc-prompt.md), [closing-report](slice05-nested-fn-param-validation/closing-report.md), [cdc-verification](slice05-nested-fn-param-validation/cdc-verification.md)) |

_Plan late, plan deep: slices 01/02/04/05 are closed, slice03 is deferred to
0.7.0, and slice04 was scoped only after the runtime probe converted the
liveness re-check from inference to executed fact._

## 3. Dependencies

Consumes the **threading** machinery (`apply_threading_step`, emitter/forms.rs —
already shipping; the correct pattern compiles today) and the **classifier**
dispatch (where the error lands). slice02 consumes **arc05**'s lint framework.
**Feeds arc07** (the guide/SKILL alignment — arc15 migrates the specific trap
sites; arc07 owns the broader guide pass). Independent of arc06. Must land in
0.6.0 (pre-adoption, per DD-64's forward-compat rationale). No `crates` API
change beyond the new classifier error.

## 4. Arc ledger

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.7 — 2026-08-08 (arc closed; P-19 done)

arc15 closed at arc scale. The closing pass reproduced the three canonical
DD-64 trap shapes as hard compile errors with threading fix-its; reproduced the
positive atom and threaded method-call forms; swept the guides for glued
`):keyword` fingerprints; ran `make test-docs` green with 476 passing blocks and
0 failures; and ran final `make check` green on the committed close-documentation
state.

P-19 bubbles up as done for 0.6.0. The remaining release sequence is now arc07
(broader guide/SKILL drift) + arc16 (book 0.6.0 edition), then arc09. slice03's
fully typed classifier rewrite remains deferred to 0.7.x Option C; it is a named
route, not an arc15 drop.

### v1.6 — 2026-08-08 (slice05 closed the nested `fn` parameter mismatch)

slice05 closed `D-2608-H7FN` with a narrow resolved pre-classification validator:
nested `fn`/`lambda`/`genfn` forms with malformed parameter lists now error
before recursive emission can fall back to raw-call output. Both `lykn compile`
and `lykn check` reject `(bind f (fn (x) x))`; a lexically bound `fn` head still
compiles as a value call under DD-61.

This intentionally did not rewrite `emit_expr` to return `Result`, and it did
not re-disposition the older labelled-`fn` non-param arity residual. Arc15 is
now ready for arc-close reproduction: slices 01, 02, 04, and 05 are closed;
slice03 remains deferred to 0.7.0.

### v1.5 — 2026-08-08 (slice04 implemented after execution probe)

The owed probe ran first and changed the work in one useful way: the silent
`undefined` return was reproduced for typed multi-form `fn` under Rust
`--strip-assertions`, but the untyped-`fn` claim was stale. JS now rejects
`(fn (x) ...)`; Rust still compiles it as a bad plain call to `fn(...)`, a loud
parity bug tracked separately as `D-2608-H7FN`.

slice04 fixed the silent classes and the cheap same-path loud class:
`D-2607-3XKP`, `D-2607-N6HS`, and `D-2607-K4WT` are closed by code + tests +
guide/register updates. Full-gate evidence lives in the slice04 ledger and
closing report. The probe's corrected untyped-`fn` premise became a new
fast-follow, slice05, because it is a loud Rust/JS parity bug rather than the
silent stripped-return trap slice04 was scoped to close.

### v1.4 — 2026-07-25 (slice04 liveness re-check; scope corrected *before* scoping)

**Which child surfaced it:** slice04's own pre-scoping re-check, run before the
open set was written — *plan late, plan deep* working as intended.

The row assumed **two items of one kind**. The re-check found **four items of
three kinds**, and moved the centre of gravity: the dangerous trap is not the
`return return` the row is named for — that emits invalid JS and fails loudly —
but the **silent** `undefined` return from an untyped (or `--strip-assertions`)
multi-statement `fn`, which is build-flag-conditional and can pass every test in
a normal build while failing in a stripped one. ID-33 is broader than its guide
entry. A fourth item (`throw`/`break`/`continue` in last position) was not
recorded anywhere.

Three register rows opened: `D-2607-3XKP` (high), `D-2607-N6HS` (medium-high),
`D-2607-K4WT` (low-medium). Two guide entries — `01-core-idioms.md` ID-32 and
ID-33 — are narrower than the defects they describe and are owed a re-scope
alongside the fix → arc07.

**Deliberately not done: the slice open set.** Scoping against inference would
repeat `D-2607-3VXM` (shape-assertions standing in for execution). CDC cannot
run the toolchain, so the runtime half of every finding is marked `inference`;
one CC probe converts it to executed fact and *then* the slice is scoped.
Disclosed, not dropped.

### v1.3 — 2026-07-22 (slice03 hardening DEFERRED — premise failed)
The post-classify hardening's premise ("`MatchClause` destructuring dissolves the
`:when` collision") holds only for *top-level* matches; **nested** matches stay raw
(`SurfaceForm` children are raw `SExpr`), so their guarded clauses keep the trap
shape — CC self-stopped and proved it against a shipped example before writing code.
Match-awareness is irreducible without a full classifier rewrite. Operator chose
**Option B**: keep the verified B implementation, document the `ptr::eq` borrow
invariant, and route the real fix (**Option C — fully-typed classification**) to
0.7.x-branch research. CDC self-note: 2nd premise hole on this slice; both caught by
CC's verify-before-writing discipline.

### v1.2 — 2026-07-22 (slice02 closed; hardening slice added)
slice02 (lint rule + check parity) closed after follow-up B (`90cf211`) replaced the
magic `:when` carve-out with a structural, pointer-identity-shared match-clause exemption
(compile walker + lint rule, both CDC-verified sound). B's residual — the `ptr::eq` borrow
invariant is convention, not type-enforced — motivated **slice03 · type-safe method-check**:
run the check on the classified tree so a guard vs a method-call is a *type* distinction.
Sibling traps (ID-32/ID-33) renumbered slice04.

### v1.1 — 2026-07-22 (slice01 CDC-verified)
slice01 delivered (`9ca9c7e`) + CDC-verified: the trap is a compile error at any
nesting depth (recursive `validate_method_calls` on the shared compile path —
CC's endorsed deviation from the cc-prompt's classify-dispatch placement); ~14
guide sites migrated to threading; ID-47 added to 09-anti-patterns; sweep clean;
`make check`/`make test-docs` green (CC-attested, host reconcile pending). A-1
done-pending-reconcile; A-3…A-6 met. Carry-forward: slice02 lint MUST use the
recursive detection; wire it into `check_strict` too. CDC self-note: mis-filed
`09-anti-patterns:405` in the enumeration (CC caught it).

### v1.0 — 2026-07-22 (arc SEEDED + slice-planned; recon done)
Operator-initiated from arc06/slice02 #6 (method-on-`express` silent miscompile)
after pushback on the initial CDC "small deal" read. Decisions: general boundary,
new arc15, both compiler-error + lint + guides (DD-64). CDC ran the ground-truth
sweep before scoping (recon-first): **0 source/test hits, 0 mycelium, ~13 guide
sites** (~10 teach the trap, ~3 document it). slice01 detailed against the sweep;
slices 02/03 shaped. arc ledger opened (A-1…A-6). DD-64 seeded for odm promotion.
