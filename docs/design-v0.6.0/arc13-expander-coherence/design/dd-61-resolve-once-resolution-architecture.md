# DD-61 — Resolve-Once: Name-Resolution Architecture (implements DD-60)

> **Status: CONFIRMED (operator, 2026-07-06 — the architecture, the
> flags-over-renaming/new-construct call, and the §A6 mandatory-tooling
> refinement) — for odm addition (Duncan; odm will assign its own number;
> the DD number is 61).** Renumbered from "DD-60 Appendix A" at the
> operator's call, 2026-07-06 — a separate file carrying DD-weight decisions
> is a DD, per the house implements-pattern (DD-37 implements DD-36).
> Drafted by CDC after the arc13/slice02 self-stop (the four-subsystem
> finding) and a survey of the established patterns: Racket's
> single-resolver hygienic expander (Flatt, "Binding as Sets of Scopes",
> POPL 2016; Dybvig syntax-case), GHC's Renamer, rustc's
> resolution-interleaved-with-expansion (RFC 1560). **DD-60's semantics
> (D1–D3) are unchanged; DD-61 fixes *where and how* they are implemented.**
> Internal section labels remain §A1–A6; external references use
> "DD-61 §A2" style.

## The root cause (why four sites exist)

The kernel S-expr IR is **stringly at the head position**: `(array 1 2)`
cannot express "call the variable `array`" vs "the array form". Every phase
that encounters a head atom must therefore re-decide what the name means —
expander (user macros), classifier (top-level surface), emitter (nested
surface), codegen (kernel heads). Four independent deciders = the divergence
class this arc exists to kill. An `is_lexically_bound()` oracle consulted at
four sites improves consistency but keeps four *decision points* that can be
forgotten or mis-sequenced. The established cure is stronger: **resolve once,
make the resolution part of the data, and turn every dispatch site into a
read-only consumer.**

## A1 — The artifact: resolved-atom flags (not renaming, not a new form)

Every atom occurrence gets, at resolution time, a **resolution tag** carried
*in the atom*:

- **Rust:** `SExpr::Atom` gains a field (e.g. `binding: NameRes` where
  `NameRes ∈ {Unresolved, BindingDef, BindingRef}`). Travels through clones
  by value — no node-identity fragility (the arc10 mark-propagation lesson,
  solved structurally).
- **JS:** a property on the atom node (`{type:'atom', value, binding:'ref'}`)
  — survives spreads/rebuilds as an own-property; more robust than a WeakSet
  for this use (unlike kernel-mark, these atoms are heavily rebuilt).

**Why not alpha-renaming (GHC-grade):** lykn's compiled output must keep the
user's names (readable-JS principle) — renaming would require un-renaming at
codegen. **Why not a new kernel form (`(ref x)`):** the kernel grammar is
user-facing (`.lyk`) and mirrored across two implementations; a
compiler-internal construct leaking into the shared grammar is its own
hazard. Flags change no grammar and no output.

**Consumer rule (the whole point):** any dispatch site seeing a head atom
with `binding: ref` treats it as **a call to the binding** — no macro, no
form, no kernel head. Sites do not consult scope; scope no longer exists for
them. Ambiguity is resolved before they run.

## A2 — One binding-position walker per backend (shared, and D2's home)

Exactly one component per backend knows **what binds**: params of
`func`/`fn`/`genfunc`/`genfn`/`lambda`, `bind`, destructuring patterns, loop
bindings, class-method params (DD-60's list). Both the resolver (D1) and the
reserved-word validator (D2) are *clients of this walker* — D2 is "validate
the name at each binding position", D1 is "extend the env at each binding
position". Building D2 first therefore builds D1's chassis.

## A3 — Pass placement per pipeline

**JS** (`read → expand → compile`): resolution threads through the existing
`expandExpr` walk — entering a form extends the env from its binding
positions (and **binding-position atoms are never dispatched** — this alone
fixes the JS throws-from-the-binding-site rows); head-atom dispatch consults
the env *first*: bound → tag `ref`, emit a plain call. `compiler.js` consumes
tags for kernel heads. One resolver (in the walk), two consumers.

**Rust** (`read → expand → classify → … → emit → codegen`): the classifier
hosts the env (it already walks surface structure). The wrinkle is the
**expander runs earlier** and dispatches user macros — so it gets a **light
binding-scan** using the shared walker (A2) to know what's bound before
firing any user macro (the small, scoped version of rustc's interleaving —
the expander learns *binding positions only*, not classification). Classifier
tags atoms; emitter and codegen become consumers (flagged head → call node).

## A4 — Semantics preserved, edge cases inherited

D1/D2/D3 exactly as DD-60 states. Macro-introduced bindings participate in
the same env (auto-gensym names can't collide, but the rule is uniform).
The tag never appears in user-written `.lyk` (reader always produces
`Unresolved`) and never changes emitted JS text.

## A5 — Convergence enforcement

The conformance corpus + matrix re-probe remain the cross-backend gate; A2's
single walker kills the intra-backend divergence; the tag kills the
inter-phase divergence. What's left to trust is one resolver per backend —
which is the irreducible minimum for two implementations, and exactly what
the corpus pins.

## A6 — Making the flag unignorable (operator refinement, 2026-07-06)

The honest weakness of a flag is that it can be *ignored* — a consumer that
forgets to check it silently misbehaves. The refinement (operator: "make it
mandatory for the tooling to read the flags"): **don't hand dispatch sites
the name when it's a binding ref.**

- **Rust — the accessor swap.** Every dispatch site today asks
  `values[0].as_atom()` and matches the string. Slices 04/05 replace the
  *dispatch-purpose* accessor with **`as_form_head() -> Option<&str>`**,
  which returns the name **only for unresolved atoms** and `None` for
  binding-refs. A resolution-unaware site never receives `"array"` for a
  bound `array` — it falls through to the call path, *which is the correct
  semantics*. Enforced by construction: the `binding` field is private; the
  accessor is `#[must_use]`; the resolution enum is `#[non_exhaustive]`.
  The raw-name accessor survives only for non-dispatch uses (spans,
  rendering) under a name that makes misuse conspicuous in review.
- **JS — the same API + a static conformance check.** `formHead(node)`
  returns `null` for binding-refs; dispatch sites convert to it. Backstop
  (no type system to conscript): a **`make check` test that greps
  `packages/lang` for raw head-name dispatch** (`.value ===`-style
  comparisons in dispatch position) outside the sanctioned resolver module
  — the A-7 parity-test pattern applied to discipline.
- **Three enforcement layers, cheapest-first:** the API makes forgetting
  structurally hard; the static check makes bypass loud in CI; the
  conformance corpus makes any surviving drift a red test forever.

**Tooling accounting (operator question, 2026-07-06 — which tools must
consume resolution):** `lykn lint` **must** (its rules head-match the
pre-expansion SExpr; a bound-name call would false-positive) — routed to
arc05's resume slice, which threads the same walker/env. `lykn fmt` is a
**documented no-op**: it formats by *shape* on unresolved source, which is
correct — layout is not meaning, and fmt never dispatches semantically.
`.d.ts` generation consumes the classified (post-resolution) AST and
inherits correctness from slice04 (its suite rows are the check). The
doctest/test runners and the browser bundle consume compiler *output* or
`packages/lang` itself (slice05). No additional slices required; the A6
enforcement rows are pinned in slices 04/05's ledgers at scoping.

**Revisit trigger (recorded per the flags-vs-wrapper decision):** if a
forgotten-consumer bug ever reaches past all three layers — i.e., the
corpus misses a divergence this class was supposed to pin — that is the
signal to escalate to the structural options (a wrapped reference construct
or nanopass-grade IR separation) rather than adding a fourth layer of
vigilance. Until then, A6 + A5 buy wrapper-grade safety at flag-grade cost.

## Refinement log

### 2026-07-06 (§A6 Rust privacy — phased; surfaced by arc13/slice06 scoping)

§A6's "the `binding` field is private" cannot hold literally: Rust enum
variant fields inherit the enum's visibility (no per-field privacy on a
`pub enum`). By-construction privacy requires restructuring `SExpr::Atom`
to carry a private-field struct payload (~259 construction/pattern sites,
mechanical). **Operator-confirmed 2026-07-06: phase it.** The
rust-resolution slice lands the accessor (`as_form_head()`, `#[must_use]`,
`#[non_exhaustive]` `NameRes`) with **all** dispatch sites converted plus a
standing static conformance check (the JS-backstop pattern applied to Rust)
— so the §A6 consumer rule holds check-enforced immediately; the payload
restructure lands as its own slice (arc13, numbered at creation) and
upgrades it to visibility-enforced. The three-layer story is unchanged;
only the first layer's mechanism arrives in two steps.
Which-child-surfaced: arc13/slice06 (scoping-time grounding, CDC).

### 2026-07-07 (§A6 Rust end-state as-built — surfaced by arc13/slice07)

Two as-built confirmations from the privacy recon, operator-decided
2026-07-07: **(1)** the phased privacy layer lands as **two slices**
(accessor-sweep, then the atomic `Atom(AtomData)` flip) — the recon
found the construction class already retired by slice06's central
constructor and the real blast radius to be ~85 field-naming pattern
sites across **two crates** (`lykn-cli` consumes lykn-lang's `SExpr`;
there is no separate one). **(2)** **`as_atom()` remains public under
its current name** — privacy removes the destructure path to the raw
name but `as_atom()` still returns it, so the slice06 static
conformance check **remains load-bearing**; §A6's "conspicuous name"
language for the raw accessor is satisfied by the doc-comment +
check regime rather than a rename (~350-site churn declined for
marginal gain). On Rust the three §A6 layers land as **visibility
(post-flip) + static check + corpus**. Which-child-surfaced:
arc13/slice07.

## Slice impact (the re-slice this appendix implies)

| Slice | Scope |
|-------|-------|
| slice03 · binding-walker + D2 (both backends) | A2's walker on each backend + the reserved-word validator riding it (all binding positions, `export`, `kernel:` name slot) + list-parity test. Ships first; kills the ID-44 genus; builds D1's chassis. |
| slice04 · rust-resolution | Env + tags through expander-scan/classifier; emitter + codegen to consumers; Rust matrix columns → DD-60 targets. |
| slice05 · js-resolution | Env + tags through `expandExpr`; `compiler.js` consumer; JS matrix columns → targets. |
| slice06 · conformance corpus + arc close | The permanent cross-backend corpus from the matrix; A-4/A-5 reproduced; DD-60 refinement entry recording this architecture. |
