# Slice 06: rust-resolution

> **DD-60 D1 on the Rust backend, per DD-61 (resolve once, consume
> everywhere).** The binding layer is complete by construction (slices
> 03–05); this slice hangs the resolver on it: the expander learns what's
> bound before firing any user macro, the classifier hosts the env and
> tags every atom, and emitter + codegen become **read-only consumers**
> via the `as_form_head()` accessor swap (DD-61 §A6 — rows pinned here at
> scoping, per the arc plan). Operator phasing call (2026-07-06): the §A6
> *privacy* restructure is a follow-up slice — see Design tensions #1.

## Goal

One resolver on the Rust pipeline. After this slice, every legal-ident
name the user lexically binds **means the binding** on Rust — in every
binding position (the walker's complete set) and every reference position
(the matrix's) — and the Rust matrix columns meet their DD-60 targets.
JS is untouched (its columns byte-identical; js-resolution is the next
slice).

## Architecture (DD-61 §A1/§A3/§A6, grounded in the tree 2026-07-06)

The four dispatch sites the tag must reach:

1. **Expander** — `expander/pass2.rs::expand_expr` (:39): user-macro
   dispatch is `env.contains_key(head_name)` (:100); sugar desugar is
   `try_desugar` (:157 — `cons`/`car`/`cdr`/`cadr`/`cddr`/`list`/`as`).
   Runs pre-resolution → gets the **light binding-scan** (§A3): a scope
   set built from `binding::bindings_introduced` during the walk; a bound
   head fires neither a user macro nor a desugar.
2. **Classifier** — `classifier/forms.rs::classify_form{,_strict,_kernel_only}`
   (:37/:117/:232), all dispatching on `values[0].as_atom()`. **Hosts the
   env** (threaded via `bindings_introduced`, skipping kinds where
   `shadows_values() == false` — labels stay out of the value env) and
   **tags atoms**: `SExpr::Atom` gains `binding: NameRes ∈ {Unresolved,
   BindingDef, BindingRef}`. Reader always yields `Unresolved`; tags
   travel by value through clones (the arc10 node-identity lesson, solved
   structurally). A bound head classifies as `FunctionCall`.
3. **Emitter** — `emitter/forms.rs::emit_expr` (:319): the
   `is_surface_form(head_name)` gate (:348), the inline head checks, and
   the nested re-classification (`classify_expr` on subtrees) all become
   tag-consumers — the emitter needs **no second env**; the tag rides the
   atom into every subtree it re-classifies.
4. **Codegen** — `codegen/emit.rs::emit_list` (:198, `match head` :214),
   `emit_class_member` (:1394), inline `head == "catch"/"finally"/"names"`
   (:929/:933/:1604). A `BindingRef` head falls through to the **plain
   call path** (`array(1, 2)` — readable-JS; not the parenthesized
   computed-callee shape reserved for non-atom heads).

The swap: dispatch-purpose head reads convert to
**`as_form_head() -> Option<&str>`** — returns the name only for
`Unresolved` atoms, `None` for binding-refs, `#[must_use]`, with
`NameRes` `#[non_exhaustive]`. An unaware site *cannot* misdispatch — it
falls through to the call path, which is the correct semantics. The
raw accessor (`as_atom`) survives for non-dispatch uses (spans,
rendering, argument reads — the majority of its 441 sites).

## Design tensions (named at scoping — surface, don't decide silently)

1. **§A6 privacy is phased (operator-confirmed 2026-07-06).** Rust
   pub-enum-variant fields cannot be private — DD-61's "the `binding`
   field is private" literally requires restructuring `Atom` to a
   struct payload (~259 `SExpr::Atom {…}` sites). This slice lands the
   accessor + `#[must_use]` + a **Rust-side static conformance check**
   (F-4); the payload restructure is a follow-up slice, numbered at
   creation. DD-61 carries the refinement note.
2. **Equality.** `SExpr` derives `PartialEq`; a new field participates in
   `==`. Decide (tag-insensitive manual impl vs. constructor hygiene in
   tests) and surface the choice + rationale in the closing report.
3. **The `has_macros` short-circuit.** `expander::expand` returns forms
   unchanged when no `macro`/`import-macros` is present — so the light
   scan only runs on macro-bearing files. Verify (don't assume) that the
   no-macro path has no shadowing exposure of its own.

## Scope (in)

1. **F-1** — resolver env + resolved-atom tags on the classifier path
   (walker-consumed; labels skipped; macro-introduced bindings
   participate, DD-61 §A4).
2. **F-2** — expander light binding-scan (user macros + desugar shadowed
   by bound names; consumes the walker, never re-derives positions).
3. **F-3** — the §A6 accessor swap across all four subsystems; zero
   dispatch-purpose raw-head reads remain.
4. **F-4** — the Rust-side static conformance check, standing in
   `make check` (seeded-violation demo).
5. **F-5** — matrix: Rust columns → DD-60 targets; JS columns and all
   existing corpus outputs byte-identical.
6. **F-6** — green bar.

## Scope (out)

JS resolution (`formHead()` + the JS grep check — next slice); the
conformance corpus (the slice after); the `Atom` payload/privacy
restructure (follow-up slice per the phasing call); label D1 semantics
(labels don't shadow — `shadows_values()` already says so); any DD-60
semantics change (refinements go to the operator, not into code).

## Exit criteria

The ledger's six rows closed: tags on every atom occurrence, four
consumer subsystems, the standing check, Rust matrix columns at target
with JS + corpus byte-identical, `make check` green. Bubble-up: hook
notes for js-resolution (what the JS slice should mirror and where the
asymmetries are — e.g. the D2 timing note from slice03), the silent-drop
diff, and anything resolution contact reveals that DD-60/DD-61 didn't
anticipate — surfaced, not folded.
