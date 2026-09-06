# arc15 — Surface-Syntax Traps Closing Report

> **Status: CLOSED — 2026-08-08.** Source base before close: `07413e3`.
> Final gate: `make check` green on the arc-close documentation state.

## Verdict

arc15 delivers the 0.6.0 surface-syntax trap capability: surface forms that used
to compile cleanly while meaning something else now fail loudly, with a fix-it
for the Lykn-correct form, and the guide surface no longer teaches the trap as a
valid pattern.

This close does not claim the deferred fully typed classifier rewrite. slice03
proved that match-awareness is irreducible while nested expressions remain raw
`SExpr`; the verified 0.6.0 boundary keeps the structural exemption, and the real
rewrite remains routed to 0.7.x as Option C.

## Slice Walk

| Slice | Close result | Evidence |
|-------|--------------|----------|
| slice01 · reject-method-on-expr + guide migration | closed | `9ca9c7e`; [`slice01-reject-method-on-expr/cdc-verification.md`](slice01-reject-method-on-expr/cdc-verification.md) |
| slice02 · lint rule | closed | `d6c23b5` plus follow-up B `90cf211`; [`slice02-lint-rule/cdc-verification.md`](slice02-lint-rule/cdc-verification.md), [`slice02-lint-rule/cdc-verification-followup-B.md`](slice02-lint-rule/cdc-verification-followup-B.md) |
| slice03 · type-safe method-check | deferred | [`slice03-type-safe-method-check/slice-doc.md`](slice03-type-safe-method-check/slice-plan.md); Option C routed to `release/0.7.x` BACKLOG A6 |
| slice04 · sibling traps | closed | `703394c`; [`slice04-sibling-traps/closing-report.md`](slice04-sibling-traps/closing-report.md) |
| slice05 · nested `fn` parameter validation | closed | `07413e3`; [`slice05-nested-fn-param-validation/closing-report.md`](slice05-nested-fn-param-validation/closing-report.md), [`slice05-nested-fn-param-validation/cdc-verification.md`](slice05-nested-fn-param-validation/cdc-verification.md) |

## Arc Ledger Walk

| ID | Result | Evidence |
|----|--------|----------|
| A-1 | done | slice01 is landed and CDC-verified at `9ca9c7e`; the compiler rejects method calls on parenthesized expression receivers at nested depths. |
| A-2 | done | slice02 is landed and CDC-verified at `d6c23b5`; follow-up B `90cf211` replaced the `:when` magic carve-out with the structural match-clause exemption shared by compile and lint. |
| A-3 | done | Arc-scale trap repro compiled the three canonical forms, and all exited non-zero with the method-on-parenthesized-expression diagnostic plus threading fix-it: `((express parts):join "")`, `((new TextEncoder):encode s)`, and `((/ cents 100):toFixed 2)`. |
| A-4 | done | Positive repro compiled the atom method call and threaded expression method call. `./bin/lykn compile` emitted `parts.join("")` for `(parts:join "")` and `parts.value.join("")` for `(-> (express parts) (:join ""))`; `./bin/lykn lint` returned no findings for both fixtures. |
| A-5 | done | `rg -n "\\):[A-Za-z_-]" docs/guides -g '*.md'` returned only documented-as-wrong/comment/prose examples; `make test-docs` was green: 476 passed, 0 failed, 15 skipped. Broader guide/SKILL alignment remains arc07. |
| A-6 | done | slice04 and slice05 source gates were green at their close commits; final arc-close `make check` is green on the committed close-documentation state. |

## Evidence Transcript

The arc-close compile repro used temporary fixtures for the three DD-64 shapes:

```text
== arith.lykn ==
rc=1
1:10: error: method call on a parenthesized expression is not supported (the receiver is an expression, not a name)
  suggestion: thread the method call: (-> <expr> (:toFixed ...)); or bind first: (bind v <expr>) (v:toFixed ...). To pass a keyword as a string argument to a computed function, use a string literal: (<expr> "toFixed" ...)
== express.lykn ==
rc=1
1:10: error: method call on a parenthesized expression is not supported (the receiver is an expression, not a name)
  suggestion: thread the method call: (-> <expr> (:join ...)); or bind first: (bind v <expr>) (v:join ...). To pass a keyword as a string argument to a computed function, use a string literal: (<expr> "join" ...)
== new.lykn ==
rc=1
1:10: error: method call on a parenthesized expression is not supported (the receiver is an expression, not a name)
  suggestion: thread the method call: (-> <expr> (:encode ...)); or bind first: (bind v <expr>) (v:encode ...). To pass a keyword as a string argument to a computed function, use a string literal: (<expr> "encode" ...)
```

The positive repro used one atom call and one threaded call:

```text
== atom.lykn compile ==
const parts = ["a", "b"];
const r = parts.join("");
== atom.lykn lint ==
✓ no lint findings (1 file(s))
== thread.lykn compile ==
const parts = { value: ["a", "b"] };
const r = parts.value.join("");
== thread.lykn lint ==
✓ no lint findings (1 file(s))
```

The guide sweep returned nine remaining `):kw` fingerprints, all in
documented-as-wrong examples, comments, or prose:

```text
docs/guides/09-anti-patterns.md:335:;; #a(10 9 2):sort → [10, 2, 9]
docs/guides/09-anti-patterns.md:1013:receiver — `((express parts):join "")`, `((new TextEncoder):encode s)`,
docs/guides/09-anti-patterns.md:1014:`((/ cents 100):toFixed 2)` — the `:method` detaches into a keyword *argument*
docs/guides/09-anti-patterns.md:1029:;;   ((express parts):join "")
docs/guides/01-core-idioms.md:1037:— or bind the expressed value first. Writing `((express cell):method …)` is a
docs/guides/01-core-idioms.md:1051:;;   ((express listeners):push fn)
docs/guides/01-core-idioms.md:1056:*argument* that stringifies — `((express listeners):push fn)` becomes the call
docs/guides/01-core-idioms.md:1268:needs a **name**, so `((get obj key):method …)` is a **compile error** (DD-64) —
docs/guides/01-core-idioms.md:1281:;;   ((get obj key):push 4)      ;; used to emit obj[key]("push", 4) — wrong
```

`make test-docs` was green during arc close:

```text
Generated 22 test file(s) with 476 block(s) (15 skipped)
ok | 476 passed | 0 failed (1s)
✓ Documentation tests passed
```

The final arc-close gate was also green:

```text
✓ Cited-path check passed (577 documents on release/0.6.x; 601 historical citations accepted via scripts/cited-paths-census.tsv)
✓ All checks passed (build + lint + test)
```

## Bubble-Up

- P-19 is closed for 0.6.0: method-on-expression and sibling surface traps are
  hard failures or routed loud failures, the nested Rust `fn` parameter mismatch
  is fixed, and guide examples no longer teach the silent trap.
- arc07 remains the broader guide/SKILL alignment pass. arc15's guide row is
  deliberately narrow: it proves the trap is no longer taught as valid, not that
  every guide surface has been reconciled with the 0.6.0 language.
- arc16 can now describe the shipped surface without waiting on arc15. The book
  pass may still surface new defects; those should enter their own slice or be
  routed with named homes.
- DD-64 remains a draft in this planning tree; odm promotion is Duncan-owned and
  is not a blocker for the implemented 0.6.0 compiler/lint/docs capability.

## Version History

### v1.0 — 2026-08-08

Arc close report written after slices 01, 02, 04, and 05 closed and slice03 was
explicitly deferred to 0.7.x.
