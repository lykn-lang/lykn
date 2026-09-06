---
number: 26
title: "DD-21: Type Analysis and Exhaustiveness"
author: "the new"
component: All
tags: [change-me]
created: 2026-03-31
updated: 2026-04-04
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# DD-21: Type Analysis and Exhaustiveness

**Status**: Decided
**Date**: 2026-03-28
**Session**: v0.3.0 surface language design

## Summary

The analysis module uses Maranget's algorithm for both `match`
exhaustiveness checking and multi-clause `func` overlap detection —
one pattern analysis framework, two consumers. The type registry
stores type definitions, constructor metadata, and blessed type
flags. Pattern-based type inference resolves the matched type from
constructor patterns without annotations; mixed constructors from
different types are a compile error. Guards are treated as partial
coverage — guarded clauses do not satisfy exhaustiveness. Scope
tracking covers both surface and kernel forms.

## Decisions

### Maranget's algorithm for pattern analysis

**Decision**: The analysis module implements Maranget's usefulness
and exhaustiveness algorithm ("Warnings for pattern matching,"
Journal of Functional Programming, 2007). The algorithm operates on
a **pattern matrix** — rows are clauses, columns are positions being
matched. Two operations are defined:

**Usefulness**: Is a given pattern vector useful with respect to the
existing pattern matrix? A pattern is useful if there exists at
least one value vector matched by the new pattern but not by any row
in the existing matrix. Useless patterns are unreachable code.

**Exhaustiveness**: Is the pattern matrix exhaustive? The matrix is
exhaustive if no value vector exists that is not matched by at least
one row. Non-exhaustive matrices represent missing cases.

The algorithm works recursively by **specialization** — decomposing
patterns by their head constructor and recursing on the remaining
columns. For ADT constructors, the algorithm enumerates all variants
from the type registry. For wildcards, it considers all possible
head constructors. For literals on open types, it cannot enumerate
all values, so `_` is required.

**Two consumers of the same framework**:

| Consumer | Question asked | Input | Output |
|----------|---------------|-------|--------|
| `match` exhaustiveness | "Are all possible inputs covered?" | Match clause patterns | Compile error listing uncovered variants |
| `func` overlap detection | "Could two clauses match the same input?" | Multi-clause `:args` patterns | Compile error identifying overlapping clause pairs |

For `match`, the algorithm checks exhaustiveness of the clause
patterns against the inferred type's variant set. For multi-clause
`func`, the algorithm checks whether any two clauses' `:args`
patterns overlap — i.e., whether there exists an argument tuple that
would match both clauses. Since DD-16 v1.2 requires type annotations
on all parameters, every `func` clause has full type information in
every parameter position.

**Pattern representation**: The algorithm operates on an internal
**deconstructed pattern** representation, separate from the surface
AST. Each pattern is decomposed into:

- **Constructor patterns**: An ADT constructor name + sub-patterns
  for its fields. The type registry provides the complete set of
  constructors for each type.
- **Literal patterns**: A concrete value (number, string, keyword,
  boolean, `null`, `undefined`). Treated as constructors from an
  open (infinite) type.
- **Wildcard patterns**: `_` or bare binding symbols. Match any
  value.
- **Structural patterns**: `obj` keyword-value patterns. Treated as
  open-type patterns — no exhaustiveness analysis. Require `_`.
- **Type keyword patterns**: `:number`, `:string`, etc. in `func`
  `:args`. Treated as constructors from a finite set (the built-in
  type keywords from DD-16). Two clauses with the same type keyword
  at the same position overlap; different type keywords do not.

**Rationale**: Maranget's algorithm is the standard approach used by
Rust, OCaml, Haskell, and Elm for pattern matching analysis. It
handles nested patterns correctly through recursive specialization,
which a purpose-built checker would need to reinvent. The algorithm
is well-documented, has known complexity bounds, and is proven
correct. Using it for both `match` and `func` avoids maintaining
two separate pattern analysis systems for the same fundamental
operation.

### Type registry

**Decision**: The type registry is a data structure populated during
the collection phase (DD-20, Phase 1) and consumed during analysis
(Phase 2). It stores the information needed for exhaustiveness
checking, type check emission, enhanced error messages, and
constructor arity validation.

**Information stored per type**:

| Field | Purpose | Example |
|-------|---------|---------|
| Type name | Identification | `Option` |
| Module path | Blessed type identification, import resolution | `lykn/core/option` |
| Constructor set | Exhaustiveness — complete variant enumeration | `[Some, None]` |
| Per-constructor field list | Pattern destructuring, arity validation | `Some: [{name: "value", type: :any}]` |
| Per-constructor field types | Type check emission in constructors | `:number`, `:string`, `:any`, user-defined |
| Blessed flag | Enhanced error messages | `true` for `Option`, `Result` from `lykn/core` |

**Constructor lookup**: The registry supports lookup by constructor
name, returning the owning type. This is how the classifier and
analysis module resolve constructor patterns — `Some` → `Option`,
`Ok` → `Result`, `Circle` → `Shape`. Constructor names must be
unique within a module scope (DD-17 edge case: collision across
types is a compile error).

**Blessed type identification**: `Option` and `Result` from
`lykn/core` are identified by module path, not by name. A local
`(type Option ...)` definition shadows the prelude import and is
NOT blessed — it does not receive enhanced error messages or
compiler recognition (DD-17 decision).

**Population**: The collection phase traverses all `Type` nodes in
the typed surface AST, registers each type and its constructors in
the registry, and validates:

- No duplicate constructor names within the module scope
- All constructor fields have type annotations (DD-17 requirement)
- User-defined types referenced in field types exist in the registry
  or are imported

**Rationale**: The type registry is the bridge between `type`
definitions and `match` analysis. Without it, the exhaustiveness
checker has no way to know what variants exist for a given type.
Storing the information at the type level (not scattered across
individual constructors) makes the variant enumeration straightforward
— the checker asks "what are all the constructors of this type?"
and gets a complete list. The blessed flag enables the diagnostics
module to produce enhanced messages (DD-20) without the analysis
module needing to know about messaging.

### Pattern-based type inference for `match`

**Decision**: The analysis module infers the type of the matched
expression from the constructor patterns in the `match` clauses.
No type annotation on the match target is required. Five rules
govern inference and checking:

**Rule 1 — ADT constructor patterns infer the type.** If any clause
uses an ADT constructor pattern, the compiler looks up the
constructor in the type registry and infers the matched type.

```lisp
;; Compiler infers: matching on Option (from Some and None)
(match x
  ((Some v) (use v))
  (None (default)))
```

**Rule 2 — All constructors must belong to the same type.** If
clauses mention constructors from different types, it is a compile
error. The patterns disagree about what type the matched expression
has.

```lisp
;; COMPILE ERROR: Some is from Option, Ok is from Result
(match x
  ((Some v) v)
  ((Ok v) v)
  (_ 0))
;; Error: mixed constructors in match — Some (from Option) and
;; Ok (from Result) cannot appear in the same match
```

**Rule 3 — Literal-only patterns require `_`.** If all clauses use
literal patterns (numbers, strings, keywords, booleans), no type
can be inferred. The value space is open. `_` wildcard is required.

```lisp
;; No constructors — no inference, _ required
(match status
  (200 "ok")
  (404 "not found")
  (_ "unknown"))
```

**Rule 4 — Structural `obj` patterns require `_`.** Structural
patterns are inherently non-exhaustive. No type inference. `_`
required.

```lisp
;; Structural — no inference, _ required
(match response
  ((obj :ok true :data d) (process d))
  (_ (handle-error)))
```

**Rule 5 — Mixed ADT constructors and literals are a type error.**
If a match contains both ADT constructor patterns and literal
patterns at the top level, it is a compile error. If the patterns
say the value is an `Option`, then a literal pattern like `42`
can never match — it's dead code that indicates a bug.

```lisp
;; COMPILE ERROR: Some implies Option, 42 is a number literal
(match x
  ((Some v) v)
  (42 "the answer")
  (_ 0))
;; Error: match on Option (inferred from Some) contains
;; number literal pattern 42 — this clause can never match
```

**Boolean exhaustiveness**: When the compiler can determine that the
matched value is boolean (from context or future type annotations),
matching `true` and `false` is exhaustive without `_`. Since v0.3.0
does not have full type inference, this applies when the match
target is a boolean literal or a known-boolean expression. Otherwise,
boolean matches require `_` like any other literal match.

**Rationale**: Pattern-based inference is the standard approach in
Haskell, Elm, Rust, and OCaml. The patterns carry the type
information — if the developer writes `(Some v)`, they're asserting
the matched value is an `Option`. The compiler can verify this
assertion is consistent across all clauses without requiring an
explicit annotation. Mixed constructors from different types are a
type error for the same reason they are in Haskell/Elm/Rust: the
matched expression has one type, and patterns from different types
are contradictory. Rule 5 (mixed constructors and literals) is the
same principle: if the patterns infer `Option`, a number literal
can never match an `Option` value.

### Guard handling in exhaustiveness

**Decision**: Clauses with `:when` guards are treated as **partial
coverage** in the exhaustiveness checker. A guarded clause's pattern
contributes to **reachability analysis** (can this clause ever
fire?) but does NOT contribute to the **coverage set** (does the
match handle all possible inputs?).

**Implementation**: Before running Maranget's algorithm for
exhaustiveness, the clause list is pre-processed:

1. All clauses (guarded and unguarded) are included in the
   reachability check. This detects unreachable clauses — a guarded
   clause shadowed by an earlier unguarded clause with the same
   pattern is unreachable.
2. For the exhaustiveness check, only **unguarded clauses** are
   included in the coverage set. Guarded clauses are excluded because
   the guard could evaluate to false, leaving the pattern's space
   uncovered.

**Examples**:

```lisp
;; NOT exhaustive — guard makes (Some v) partial
(match opt
  ((Some v) :when (> v 0) (use-positive v))
  (None (default)))
;; Error: non-exhaustive match — Some not fully covered
;; (guarded clause does not satisfy exhaustiveness)
```

```lisp
;; Exhaustive — unguarded (Some v) covers remaining cases
(match opt
  ((Some v) :when (> v 0) (use-positive v))
  ((Some v) (use-nonpositive v))
  (None (default)))
```

```lisp
;; NOT exhaustive — multiple guards don't cover all of Some
(match opt
  ((Some v) :when (> v 0) (positive v))
  ((Some v) :when (< v 0) (negative v))
  (None (default)))
;; Error: non-exhaustive match — Some not fully covered
;; (Some 0 not covered by either guarded clause)
```

```lisp
;; Exhaustive — wildcard covers remaining cases
(match opt
  ((Some v) :when (> v 0) (positive v))
  ((Some v) :when (< v 0) (negative v))
  (_ (zero-or-none)))
```

**Reachability and guards**: A guarded clause is reachable if its
pattern is useful (Maranget's usefulness check) with respect to
earlier clauses. A guarded clause can shadow a later clause's
pattern, but only for the guard-passing subset — the later clause
remains reachable for the guard-failing subset. The checker does
not warn about clauses that are only reachable via guard failure.

**Rationale**: This is the approach used by GHC (Haskell) and rustc
(Rust). Guards are arbitrary boolean expressions — the compiler
cannot reason about their coverage without solving the halting
problem. Treating guarded clauses as partial is sound (never
produces false "exhaustive" results) and conservative (may require
an extra wildcard clause when the developer knows the guards are
complete). The alternative — analyzing guard expressions for
complementarity — is undecidable in general and a poor investment
for v0.3.0.

### Unified pattern analysis for `match` and `func`

**Decision**: Multi-clause `func` overlap detection uses the same
Maranget-based pattern analysis framework as `match` exhaustiveness.
The `:args` clause of each `func` clause is treated as a pattern
row. Type keywords are treated as constructors from the finite set
of built-in types (DD-16).

**How `:args` patterns map to Maranget's framework**:

| `:args` element | Pattern representation |
|----------------|----------------------|
| `:number a` | Constructor pattern: `Number` (from built-in type set) |
| `:string a` | Constructor pattern: `String` |
| `:boolean a` | Constructor pattern: `Boolean` |
| `:any a` | Wildcard pattern (matches any type) |
| `:UserType a` | Constructor pattern: the user-defined type |
| Arity | Number of columns in the pattern matrix |

**Overlap detection**: Two clauses overlap if Maranget's usefulness
check determines that neither clause is useful with respect to the
other — i.e., the intersection of their pattern spaces is non-empty.
Overlapping clauses are a compile error (DD-16).

**Examples**:

```lisp
;; No overlap — different arities
(func greet
  (:args (:string name)
   :returns :string
   :body (str "Hello, " name))
  (:args (:string greeting :string name)
   :returns :string
   :body (str greeting ", " name)))
```

```lisp
;; No overlap — different types at same position
(func add
  (:args (:number a :number b)
   :returns :number
   :body (+ a b))
  (:args (:string a :string b)
   :returns :string
   :body (str a b)))
```

```lisp
;; COMPILE ERROR — identical type patterns, same arity
(func process
  (:args (:number x :number y)
   :returns :number
   :body (+ x y))
  (:args (:number a :number b)
   :returns :number
   :body (* a b)))
;; Error: overlapping clauses — clauses 1 and 2 both match
;; (number, number)
```

```lisp
;; COMPILE ERROR — :any overlaps with :number at same position
(func process
  (:args (:number x)
   :returns :number
   :body (* x 2))
  (:args (:any x)
   :returns :string
   :body (str x)))
;; Error: overlapping clauses — clause 2 (:any) overlaps with
;; clause 1 (:number) at position 1
```

**Dispatch ordering is NOT affected**: DD-16 specifies that clause
ordering in compiled output is deterministic (longer arity first,
typed before untyped, declaration order as tiebreaker). Since
overlapping clauses are rejected, ordering never affects behavior.
The ordering rules ensure efficient dispatch (most-specific-first),
not correctness.

**Rationale**: Multi-clause `func` dispatch is pattern matching on
argument types and arity. The `:args` patterns are structurally
identical to `match` patterns — each position has a type constraint
that either matches (specific type) or accepts anything (`:any`).
Using the same framework avoids maintaining two separate analysis
systems and ensures consistent semantics. If two `match` clauses
with identical patterns would be flagged, two `func` clauses with
identical `:args` should be flagged by the same logic.

### Scope tracking across surface and kernel forms

**Decision**: The analysis module tracks bindings introduced by
ALL forms — surface and kernel. Scope tracking enables unused
binding detection and undefined reference detection across the
entire module, regardless of whether individual forms are surface
or kernel.

**Binding introduction rules**:

| Form | Binding introduced | Scope |
|------|--------------------|-------|
| `bind` (surface) | Named binding | Rest of enclosing block |
| `func` (surface) | Function name + param bindings | Function name: enclosing scope. Params: function body |
| `fn` / `lambda` (surface) | Param bindings | Function body |
| `match` clause (surface) | Pattern bindings | Clause body |
| `if-let` (surface) | Pattern bindings | Then-branch (and else-branch for the match target binding) |
| `when-let` (surface) | Pattern bindings | Body |
| `type` (surface) | Constructor names | Rest of enclosing block |
| `const` (kernel) | Named binding | Rest of enclosing block |
| `function` (kernel) | Function name + param bindings | Same as `func` |
| `import` (kernel/surface) | Imported names | Entire module |
| `class` (kernel) | Class name | Rest of enclosing block |
| `for` (kernel) | Loop variable | Loop body |

**Usage tracking**: Every symbol reference in an expression position
is checked against the scope tree. If the symbol is a known binding,
it's marked as "used." If the symbol is not in scope and is not a
known form name or global, it's an undefined reference (compile
error for surface forms, warning for kernel passthroughs).

**Unused binding detection**: After the full module is processed,
any binding that was introduced but never marked as used produces
a warning. Exceptions:

- Bindings starting with `_` are exempt (convention for intentionally
  unused bindings, consistent with DD-06)
- Exported bindings are exempt (they may be used by importers)
- Constructor names from `type` are exempt (they're public API)

**Shadowing**: A binding that shadows an outer binding of the same
name produces a warning (not an error). Shadowing is valid — inner
bindings take precedence — but it may indicate a mistake.

**Rationale**: Scope tracking across both surface and kernel forms
ensures that unused-binding detection works for the entire file, not
just the surface forms. A developer who writes `(const helper ...)
(func main ...)` where `helper` is unused should get the same
warning as `(bind helper ...) (func main ...)`. The trait-based
form handler from DD-20 makes this possible — kernel passthrough
handlers implement binding introduction and usage tracking without
needing full semantic understanding of kernel forms.

## Rejected Alternatives

### Purpose-built exhaustiveness checker (no Maranget)

**What**: Implement a simpler, lykn-specific exhaustiveness checker
that handles ADT variants, literals, and wildcards without the full
generalized algorithm.

**Why rejected**: Nested patterns complicate things. `(match x
((Ok (Some v)) ...) ((Ok None) ...) ((Err e) ...))` requires
tracking coverage across nested variant combinations. Maranget's
recursive specialization handles this correctly by construction. A
purpose-built checker would need to reinvent the same recursion,
without the benefit of proven correctness.

### Separate overlap detection for `func` (non-Maranget)

**What**: Implement `func` overlap detection as pairwise comparison
of type keywords, without using the pattern analysis framework.

**Why rejected**: Pairwise comparison works for the simple cases
but would need to be extended if `func` patterns ever gain
complexity (destructuring in `:args`, nested type constraints). The
Maranget framework handles all of these by construction. And since
DD-16 v1.2 guarantees type annotations on all parameters, the
`:args` patterns always have enough information for Maranget to
work with. One framework is simpler than two.

### No type inference for `match` — annotation required

**What**: Require a type annotation on the `match` target for
exhaustiveness checking to apply. Without annotation, `_` is always
required.

**Why rejected**: v0.3.0 does not have type annotations on `match`
targets (deferred to gradual type system, v0.4.0+). This would mean
no exhaustiveness checking in v0.3.0 — defeating the purpose of
building Maranget. Pattern-based inference (looking at what
constructors the clauses mention) provides exhaustiveness checking
without annotations, following the approach used by Haskell, Elm,
and Rust.

### Allow mixed constructors from different types

**What**: If a `match` contains constructors from different types,
treat each constructor's clauses independently — check exhaustiveness
for each type separately, or treat as structural matching with `_`
required.

**Why rejected**: Mixed constructors from different types are a bug.
The matched expression has one type — `Some` says it's an `Option`,
`Ok` says it's a `Result`. These are contradictory. Silently
allowing this hides the bug. Haskell, Elm, and Rust all emit type
errors for this case.

### Allow mixed ADT constructors and literal patterns

**What**: If a `match` contains both ADT constructor patterns and
literal patterns, treat them as independent — the constructor
patterns check ADT variants, the literal patterns check values.

**Why rejected**: If the constructor patterns infer `Option`, a
literal pattern like `42` can never match an `Option` value — it's
dead code. This indicates a bug: the developer likely meant to
match inside a `Some` body, not at the top level. Flagging this
as a compile error catches the mistake early.

### Analyze guard expressions for complementarity

**What**: When multiple guarded clauses cover the same pattern,
analyze their guard expressions to determine if they are
collectively exhaustive (e.g., `(> v 0)` and `(<= v 0)` together
cover all numbers).

**Why rejected**: Guard expression analysis is undecidable in
general — guards can call arbitrary functions, reference mutable
state (via `express`), and depend on runtime values. Analyzing
specific cases (simple comparisons on the bound variable) adds
complexity for limited benefit. The conservative approach — treat
all guarded clauses as partial — is sound and follows GHC and
rustc. If guards are collectively exhaustive, the developer adds
`_` with a comment; if they're not, the compiler catches the bug.

### Scope tracking for surface forms only

**What**: Only track bindings introduced by surface forms (`bind`,
`func`, `match`, etc.). Kernel passthrough forms are invisible to
scope analysis.

**Why rejected**: A developer using kernel forms in a surface file
(valid per DD-15) would not get unused-binding warnings for kernel
bindings. `(const helper ...)` would be invisible to the analysis,
even though it introduces a binding that may be unused. Surface-and-
kernel scope tracking provides complete coverage with minimal
additional cost — the kernel passthrough handler only needs to
recognize binding-introducing forms, not understand their full
semantics.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| `match` with no constructor patterns | No type inference, `_` required | `(match x (42 ...) (_ ...))` |
| `match` with constructors from one type | Type inferred, exhaustiveness checked | `(match opt ((Some v) ...) (None ...))` |
| `match` with constructors from two types | Compile error — mixed constructors | `(match x ((Some v) ...) ((Ok v) ...))` |
| `match` with constructor and literal | Compile error — contradictory patterns | `(match x ((Some v) ...) (42 ...))` |
| `match` with constructor and `obj` | Compile error — contradictory patterns | `(match x ((Some v) ...) ((obj :a b) ...))` |
| `match` with constructor and `_` | Type inferred, `_` covers remaining variants | `(match opt ((Some v) v) (_ 0))` |
| Nested patterns — all variants covered | Exhaustive, no `_` needed | `(match r ((Ok (Some v)) ...) ((Ok None) ...) ((Err e) ...))` |
| Nested patterns — missing combination | Compile error listing missing combination | `(match r ((Ok (Some v)) ...) ((Err e) ...))` → missing `(Ok None)` |
| Guarded clause as only coverage for variant | Not exhaustive — guard is partial | See guard examples above |
| Multiple guarded clauses same variant | Not exhaustive without unguarded catch | See guard examples above |
| Unreachable clause after wildcard | Warning — clause can never match | `(match x (_ ...) ((Some v) ...))` — `Some` unreachable |
| Unreachable clause after complete coverage | Warning — clause can never match | `(match opt ((Some v) ...) (None ...) (_ ...))` — `_` unreachable |
| `func` clauses same arity same types | Compile error — overlap | `(:args (:number x)) (:args (:number y))` |
| `func` clauses same arity different types | No overlap | `(:args (:number x)) (:args (:string x))` |
| `func` clauses different arity | No overlap | `(:args (:number x)) (:args (:number x :number y))` |
| `func` clause with `:any` overlapping typed clause | Compile error — `:any` is superset | `(:args (:number x)) (:args (:any x))` |
| `func` all clauses `:any` same arity | Compile error — identical patterns | `(:args (:any x)) (:args (:any y))` |
| Constructor not in type registry | Compile error — unknown constructor | `(match x ((Foo v) ...))` → "unknown constructor Foo" |
| Unused `bind` binding | Warning | `(bind x 42)` with no reference to `x` |
| Unused `const` binding (kernel) | Warning | `(const x 42)` with no reference to `x` |
| Unused `_` prefixed binding | No warning — intentionally unused | `(bind _temp (compute))` |
| Exported binding unused locally | No warning — may be used by importers | `(export (func f ...))` with no local call to `f` |
| Shadowed binding | Warning | `(bind x 1) (bind x 2)` — inner `x` shadows outer |
| `type` constructor names | Exempt from unused-binding check | Constructors are public API |
| Boolean `match` with `true` + `false` | Exhaustive if type known to be boolean | Future: context-based boolean inference |
| `match` on `cell` without `express` | Caught by separate analysis check (DD-20 open question) | `(match counter ...)` → "cannot match on cell — use express" |

## Dependencies

- **Depends on**: DD-15 (surface language architecture — `bind`,
  keywords, functional commitment, kernel form passthrough), DD-16
  v1.2 (`func` — type annotations required on all parameters,
  multi-clause dispatch, overlap detection rules, `--strip-assertions`),
  DD-17 (`type` + `match` — ADT definitions, tagged objects,
  exhaustiveness as compile error, structural matching, blessed types,
  guard semantics, IIFE codegen), DD-18 (threading — `if-let`/
  `when-let` pattern bindings, scope of pattern variables), DD-19
  (contracts — no direct dependency, but scope tracking covers
  `:pre`/`:post` expression bindings), DD-20 (surface compiler
  architecture — analysis module position in pipeline, three-phase
  compilation, type registry as collection-phase output, trait-based
  form handler interface, diagnostics module)
- **Affects**: Future DDs: gradual type system (v0.4.0+ — extends
  type registry with parametric types, enables type inference beyond
  pattern-based), linter rule set (extends analysis module with
  additional passes), IDE/LSP integration (analysis module provides
  diagnostics for real-time feedback)

## Open Questions

- [ ] Linter rule set — the compiler runs exhaustiveness, overlap
  detection, scope tracking, and unused bindings. The linter should
  additionally check: keyword casing (`:firstName` → suggest
  `:first-name`), side effects in `:when` guards (mutation or I/O →
  warning), dead code (`when-let` with `_` pattern, `if-let` with
  `_` pattern), `cell` misuse (`match` on cell without `express`),
  eta reduction (`(fn (:any x) (f x))` → suggest `f`), and
  formatting issues. Needs its own DD.
- [ ] Performance of Maranget on large variant sets — types with
  many constructors (>20) may produce large pattern matrices. The
  algorithm's complexity is exponential in the worst case (nested
  patterns across large types), but real-world lykn code is unlikely
  to hit this. Monitor during implementation.
- [ ] Interaction with parametric types (v0.4.0+) — when `Option`
  becomes `Option<T>`, the type registry needs type parameters and
  the exhaustiveness checker needs to handle parametric constructors.
  The current design stores `:any` for all field types, which is
  compatible — parametric types refine `:any` to specific type
  parameters.
- [ ] Array patterns in `match` — DD-17 deferred detailed design
  for array destructuring patterns. The pattern analysis framework
  needs to handle array patterns when they are designed — arrays
  have potentially infinite length, so exhaustiveness for array
  patterns requires `_` (similar to literal patterns on open types).
- [ ] Occurrence typing — after a `match` clause like
  `((Some v) ...)`, the compiler knows `v` has the type of `Some`'s
  field within the clause body. This is a form of type narrowing
  that the analysis module could track and propagate. Deferred to
  gradual type system (v0.4.0+).
- [ ] `bind` type annotation enforcement — DD-15 v1.1 left open
  whether `(bind b a)` (variable reference without type annotation)
  should be a compile error or linter warning. The scope tracking
  infrastructure supports either — it knows the type of `a` if `a`
  has a type annotation, and can propagate it to `b`. Decision
  deferred.
- [ ] Cross-module exhaustiveness — when a `type` is defined in
  module A and matched in module B, the type registry needs the
  type's definition from module A. This requires the compiler to
  process imports before analysis, which DD-20's collection phase
  already handles for prelude imports. Extending it to user imports
  of user-defined types needs detailed design.
- [ ] Warning vs error for unreachable clauses — currently specified
  as warnings. Should unreachable `match` clauses be errors (like
  non-exhaustive matches) or warnings (like unused bindings)? Errors
  are stricter but may be annoying during development. Warnings are
  gentler but may be ignored.

## Version History

### v1.0 — 2026-03-28

Initial version.
