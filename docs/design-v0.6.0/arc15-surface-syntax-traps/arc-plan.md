# arc15 — Surface-Syntax Traps

> **Status: ACTIVE — seeded + slice-planned 2026-07-22** (operator-initiated
> after the arc06/slice02 #6 finding + pushback). **Release: 0.6.0.** The home
> for surface-syntax shapes that **compile clean but mean something the author
> didn't write** — starting with method-call-on-an-expression (DD-64). Design:
> [`design/dd-64-method-on-expression-DRAFT.md`](./design/dd-64-method-on-expression-DRAFT.md)
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
| **slice04 · sibling traps** | ~~Assess whether still-live … **ID-32** `return return`, **ID-33** `\uNNNN` not processed … **Shaped, not detailed**.~~ **Liveness re-check DONE 2026-07-25** ([`slice04-sibling-traps/liveness-recheck.md`](./slice04-sibling-traps/liveness-recheck.md)): **both live on both backends, and neither is what its guide entry says.** ID-32 is *two* traps of *two* severities — (b) untyped-or-`--strip-assertions` `fn` silently returns `undefined` (**arc15's class, and the headline**, `D-2607-3XKP`) vs (a) `return return`, which emits **invalid JS** and so fails loudly (`require` genus, not this arc's charter). ID-33's real gap is **every escape except `\n \t \\ \"`**, not just `\uNNNN` (`D-2607-N6HS`) — both readers in exact parity. **New sibling:** the same wrap fires for `throw`/`break`/`continue` (`D-2607-K4WT`). **Neither trap has a single test in either compiler.** | **Re-checked; scoping blocked on one CC probe** (execute the four shapes on both backends so the severity column stops being inference) |

_Plan late, plan deep: slices 01/02 are closed, slice03 is deferred to 0.7.0,
and slice04 is deliberately not scoped until the runtime probe converts the
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

Composition criteria that verify the capability. Class-(b) rows reproduced at
arc scale. Opens here; per-row walk closes in `closing-report.md`.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (reject + guide migration) closed | ptr: slice01 cdc-verification | serious | arc-plan | **done** | `9ca9c7e` + CDC verification | the guarantee + docs correctness |
| A-2 | slice02 (lint rule) closed | ptr: slice02 cdc-verification | serious | arc-plan | **done** | `d6c23b5` + follow-up B `90cf211`, both CDC-verified | the DX layer |
| A-3 | **`((express x):m …)` and every non-atom-head + keyword-first shape is a compile ERROR** with the threading fix-it (not silent, not a warning) | host: `lykn compile` the trap → non-zero exit + fix-it message; the 3 canonical shapes (express / new / arithmetic) all rejected | serious | DD-64 | **partially done** | covered by slices 01/02 for method-on-expression; sibling traps remain slice04 | reproduce at arc scale on host at arc close |
| A-4 | **the Lykn-correct form compiles** — `(-> (express x) (:m …))` and atom `(x:m …)` still emit correctly (no over-rejection) | host: threading + atom-method forms compile green; positive tests | correctness | DD-64 | **partially done** | positive coverage from slice01; final arc-scale reproduction still owed | anti-over-rejection |
| A-5 | **no guide teaches the trap** — the sweep for `):kw` glued fingerprint returns only *documented-as-wrong* sites; `make test-docs` green | re-run the CDC sweep; every remaining hit is an ID-31/anti-pattern "don't" example | correctness | CDC sweep | **partial** | method-on-expression guide sites migrated; sibling-trap guide updates owed to slice04/arc07 | anti-silent-drop for docs |
| A-6 | **no existing source/test regressed** — corpus was 0-hits pre-change; `make check` green | host: `make check` green post-error | correctness | CDC sweep | **partial** | slices 01/02 attested green; arc-scale close still owed after slice04 | sweep said 0 source hits |

## 5. Version History

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
