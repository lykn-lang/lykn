---
number: 64
title: "DD-62 — Comment Retention & Provenance (`lykn` comments through the pipeline)"
author: "Duncan McGreggor"
component: All
tags: [change-me]
created: 2026-07-23
updated: 2026-07-23
state: Draft
supersedes: null
superseded-by: null
version: 1.0
---

# DD-62 — Comment Retention & Provenance (`lykn` comments through the pipeline)

> **Status: DRAFT — for odm promotion (Duncan; odm assigns its own file
> number; the DD number is 62, next after DD-61).** Drafted by CDC 2026-07-21
> from the operator's design directive during arc05 slice04 scoping. Lives in
> `arc14-comment-retention/design/` until promoted into `project01-mvp/artifacts/design-index.md/`.
> Motivating pain: **LFE drops comments wholesale with no option to retain
> them** — lykn should not repeat that.

## 1. Context and motivation

Comments are the one part of a program the compiler today treats as noise: both
readers discard them at the lexer. That is fine for a pure source→JS transform,
but it blocks a family of capabilities the toolchain wants:

- **Lint suppression** (`; lykn-lint: disable-next-line no-require`-style
  directives) — the immediate consumer; arc05's suppression mechanism cannot
  exist until the reader retains comments.
- **Readable JS with provenance** — lykn's readable-output principle extends
  naturally to carrying the author's comments into the emitted JS, *with a
  marker* when a comment was written against a surface form that has since been
  lowered/desugared and may no longer describe the emitted code.
- **Tooling** — `lykn fmt` round-tripping, doc extraction, LSP hover.

The operator's directive (2026-07-21), verbatim intent: the compiler should
**(1)** have an option to retain comments; **(2)** annotate comments as code is
transformed surface → kernel, letting a consumer know the comment was written
against surface and may no longer apply; **(3)** wait until the final move to
JS/ECMAScript to remove comments — or optionally preserve them with a provenance
annotation.

## 2. Current state (grounded 2026-07-21)

- **Rust reader** (`crates/lykn-lang/src/reader/`): `lexer.rs::skip_whitespace_
  and_comments` discards line (`;`), datum (`#;`), and block (`#|…|#`) comments;
  `parser.rs` skips datum/block comments structurally. No comment survives to
  the `SExpr` tree.
- **JS reader** (`packages/lang/reader.js`): `skipWhitespaceAndComments` +
  `readExprComment`/`readBlockComment` — same discard behaviour, parity with
  Rust.
- **`SExpr`** (`ast/sexpr.rs`): variants are `Atom`/`String`/`Number`/`Bool`/
  `Null`/`List`/`Cons`. **No comment or trivia node, no trivia field.** (Note:
  `Atom` was just made a private-payload struct in arc13 — the pattern for
  adding node-carried metadata without breaking the public API exists.)
- **Pipelines** (DD-61): Rust `read → expand → resolve → classify → emit →
  codegen`; JS `read → expand → compile` (lowering during expansion). Comments
  would enter at `read` and must survive — or be re-attached across — every
  transform to reach codegen.

So all three of the operator's steps are **new work on both backends**; none of
the infrastructure exists yet. This is the sizing basis for making it an arc.

## 3. The three commitments

### C1 — The reader retains comments (opt-in)

A reader option (default off, to preserve today's behaviour and output) that
**captures** comments instead of discarding them. Two sub-decisions (open,
§5): *where the comment attaches* and *what a comment is attached to*.

Comment kinds to retain: line (`;`), block (`#|…|#`). The datum comment (`#;`
skips the next form) is a deletion directive, not a comment to carry — retain it
only as the fact "this form was datum-commented" if useful, else leave as today.

### C2 — Provenance annotation across surface → kernel

As the expander/desugarer/classifier lowers a surface form to kernel shapes, a
comment attached to the surface form is **carried with a provenance tag**
recording that it was *authored against surface* and the form it annotated may
have been transformed. A downstream consumer (JS emitter, `fmt`, a human reading
the kernel IR) can then tell "this comment described the surface the user wrote,
not necessarily the lowered code beside it." The tag is the honest-signal
analogue of DD-61's resolution tags: metadata that rides the node and makes a
later decision safe.

Key cases to define (§5): a commented form that **desugars** (comment still
applies, mark surface-authored); a commented form **consumed by a macro**
(comment may be meaningless — mark or drop-with-record); a commented form
**dropped** entirely (its comment is orphaned — where does it go?).

### C3 — Strip-or-preserve at JS emission

Comments are removed **only at the final codegen step** (not earlier), so every
intermediate stage can still see them. Default: **strip** (today's clean output
is the baseline). Opt-in: **preserve**, emitting each retained comment into the
JS with, where provenance says the surface was transformed, a short annotation
(e.g. `/* lykn: surface-authored */`) so a reader of the JS isn't misled.

## 4. Consumers (why the arc pays for itself)

1. **Lint suppression (arc05 follow-on / first consumer):** with C1, `lykn lint`
   can read `; lykn-lint: disable[-next-line] <rule>` directives attached to the
   following form and suppress matching findings. This is the concrete
   motivation and the smallest end-to-end slice of the capability (needs only
   C1 + a directive parser, not C2/C3).
2. **Readable JS with comments (C2+C3):** the flagship user-facing payoff.
3. **`lykn fmt` fidelity:** formatting that keeps comments in place.
4. **Doc/LSP tooling:** later.

## 5. Open questions (for the operator + the design pass)

- **Attach model:** (a) a new `SExpr::Comment` node in the sibling stream;
  (b) trivia fields (`leading`/`trailing` comments) on each node; (c) a
  side-table keyed by span. (b)/(c) keep the tree's semantic shape clean (rules,
  resolver, matcher don't trip over comment nodes — important given arc13's
  "every dispatch site" discipline); (a) is simplest to read but pollutes every
  structural walk. **CDC lean: (b) or (c)** — a `Comment` node would force every
  arc13 consumer to skip it, re-opening the "structural walks must know about
  X" burden.
- **Provenance granularity:** is "surface-authored, form transformed" one bit,
  or does it record the transform chain? Start with one bit; expand if a
  consumer needs more.
- **Orphaned comments** (form dropped by a macro / dead-code elimination): drop
  with a record, or hoist to the nearest surviving sibling? Default: keep
  attached to the surface position, emit-or-drop per C3.
- **Both-backend parity:** the conformance discipline (arc13) applies — comment
  attach + provenance must agree across Rust and JS, or divergence is a bug. A
  small comment-conformance corpus is the natural gate.
- **Release boundary: 0.7.0 (operator-decided 2026-07-21).** Additive
  capability, not toolchain *alignment*; kept out so arc05 and 0.6.0 closed
  without a new blocker — this settles the DD's one open scheduling question.

## 6. Slice sketch (seeded, NOT committed — plan late)

A plausible decomposition, to be planned in detail when the arc becomes active:

- **s01 · reader retention (C1), both backends + attach model** — the smallest
  thing that unblocks lint suppression; a comment-conformance corpus seed.
- **s02 · lint suppression** — the directive parser + `lykn lint` consumption
  (retires the arc05 deferral; closes the 2 kernel-interop dogfood
  acknowledgements with real inline suppression).
- **s03 · provenance across lowering (C2)** — the surface-authored tag through
  expand/desugar/classify, both backends.
- **s04 · JS emission strip-or-preserve (C3) + arc close** — the codegen option
  + the preserve annotation; comment-conformance corpus standing.

## 7. Non-goals (v1)

Reformatting/normalizing comments; doc-comment semantics (a `///`-style API-doc
convention is a separate feature); comment-driven pragmas beyond lint
suppression; LSP.

---

_DRAFT — odm promotion pending (Duncan). Mirror the refinement log in full on
promotion, per the DD-60/DD-61 lesson._
