# Discovery rows from `03-threading-macros`

Produced 2026-07-25. **These six rows have been appended to
`backlog/discoveries.md`** (on `main`'s working tree), together with a
correction to `D-2607-K9RT`, an evidence-base block on that row, and two new
instances added to `D-2607-Z5KN`.

## Status: ROUTED (resolved 2026-07-25)

All six rows are in `backlog/discoveries.md`, **and the register is now
committed** — the operator committed `backlog/` (3 files) to both `main`
and `release/0.6.x` the same day, after this unit flagged that it was untracked
on every branch. The register's routing rule (`D-2607-8HTN`) is therefore
satisfied on both halves: the destination exists in git *and* contains the rows.

*Superseded text, kept for provenance:* this section previously read
**"appended, but NOT yet routed"**, because `git ls-tree` returned 0 files for
`backlog` on `main`, `release/0.6.x` and `release/0.7.x`. That was accurate
when written and is no longer true. The finding stands as the reason the commit
happened; the blocker does not.

**This file is retained anyway**, for one reason that has not changed: the rows
were authored here and the register lives on another branch, so this is the
provenance record of where they came from. Retire it if and when the register
grows a per-unit source field.

**Rule adopted as a result** (`CLAUDE.md`, "Which branch do I write to?",
confirmed with the operator 2026-07-25): `main` changes by rebase/merge only;
0.6.0 work is authored in `.worktrees/0.6.x/`, 0.7.0 work in `.worktrees/0.7.x/`,
and **cross-cutting artifacts — this register, the DDs — are owned by the active
release branch**, currently 0.6.x. Future rows from 0.7.0 units are written to
the register in the **0.6.x worktree**, not here and not on `main`.

---

### `D-2607-8QVL` — DD-18's `->>` example documents the wrong expansion, and it is `final`

- **What:** `project01-mvp/arc03-surface-language/artifacts/design/06-final/0023-dd-18-threading-macros-and-conditional-binding.md`,
  §`->>` thread-last, states that

  ```lisp
  (->> items (filter even?) (map double) (take 5))
  ```

  compiles to `take(map(filter(items, even?), double), 5)`. That is the
  **thread-first** nesting. The compiler produces
  `take(5, map(double, filter(isEven, items)))`. The DD's stated *kernel
  expansion*, `(take (map (filter items even?) double) 5)`, is wrong the same
  way — `items` threaded into first position under a `->>` heading.
  **The code is correct; the DD is wrong.**
- **Where:** `docs/design/06-final/0023-dd-18-…md`, §`->>` thread-last
  (the "Syntax" JS block and the kernel-expansion block).
- **How found:** `audit` — reading the governing DD before writing the
  threading-macro survey; confirmed by executing the compiler
  (`project03-language-evolution/slice03-threading-macros/scripts/probe-threading.js`).
- **Guess:** High. It is a `final`-state DD, it is the normative description of
  the macro, and it teaches the reader that `->>` does what `->` does — which is
  precisely the confusion the survey found in the guides too.
- **Kind:** `trap` · **Status:** `open`
- **Note:** this is `D-2607-3VXM`'s shape one level up. There, tests asserted a
  shape nobody executed; here, the *specification* did. Same root: nothing ran
  the example.
- **Minor, same family:** `D-2607-K9RT` renders `even?` as `evenQMARK`; the
  current identifier mapping produces `isEven`.

---

### `D-2607-3KTP` — `as->` does not exist and fails silently

- **What:** `(as-> x $ (f $ 1) (g 2 $))` compiles clean, with no diagnostic, to
  `asTo(x, $, f($, 1), g(2, $));` — a call to an undefined `asTo`, plus a
  reference to an undefined `$`. `ReferenceError` at runtime. The `asTo`
  spelling comes from the `->` → `To` rule in `compiler.js:405`
  (`MULTI_CHAR_ESCAPES`) mechanically rewriting an unrecognised head.
- **Where:** `packages/lang/classifier.js` — registered threading heads are
  `->`, `->>`, `some->`, `some->>`; there is no `as->`.
- **How found:** `audit` — probing the threading surface during the
  `03-threading-macros` survey.
- **Guess:** Medium-high. Strictly an instance of `D-2607-P4WQ`'s class (any
  unknown head compiles to a call), but a **high-traffic** instance: `as->` is
  the third threading macro a Clojure user reaches for, and lykn's own guides
  teach the other four.
- **Kind:** `gap` · **Status:** `routed` → `project03-language-evolution/BACKLOG.md` §A7
- **Why it matters beyond the missing macro:** the `03-threading-macros` survey
  found that `as->` is the *general* form — one macro covers datum-last,
  datum-mid, and operator-receiver signatures, including the datum-in-the-middle
  shape that currently has **no** spelling in lykn at all
  (`Reflect.set(target, key, V)` threading `V`).

---

### `D-2607-W4RC` — `->` and `->>` are byte-identical across 85% of the ES surface

- **What:** DD-18.1's keyword-step rule fires *before* the thread position
  check, so a `(:method args)` step threads the receiver regardless of which
  macro wraps it. `(-> s (:to-upper-case) (:slice 0 10))` and
  `(->> s (:to-upper-case) (:slice 0 10))` emit identical JS. Combined with
  unary functions (where first and last coincide), **417 of 489 ES2025 built-ins
  cannot distinguish the two macros.**
- **How found:** `audit` + execution — `03-threading-macros`, R-2 and R-6.
- **Guess:** Medium as a defect (it is correct behaviour), **high as a docs
  finding.** A reader arriving from Clojure will assume the macro choice is
  meaningful everywhere. It is meaningful in 48 of 489 core cases and 71 of 214
  host cases.
- **Kind:** `gap` · **Status:** `open` → arc07 (guides) / book
- **Suggested:** say it outright in the threading guide — *"for method steps the
  two macros are the same; the choice only matters for free and namespaced
  functions"* — and give the reader the rule for which to pick.

---

### `D-2607-L7BX` — `project03-language-evolution/` is absent from `main`, with debris that makes it look present

- **What:** The 0.7.0 planning tree exists only on `release/0.7.x`. On `main`,
  `project03-language-evolution/` holds two **empty, untracked** directories —
  `02-packaging-strategy/artifacts` and `02-packaging-strategy/evidence` — and
  nothing else. An `ls` on `main` suggests the tree is present and merely
  sparse; `git ls-files` shows it is not there at all.
- **Where:** `main` working tree vs `release/0.7.x`. Verified with
  `git ls-tree -r --name-only <branch> -- docs/design-v0.7.0` across every local
  branch: empty for all but `release/0.7.x`.
- **How found:** `audit` — locating the home for the `03-threading-macros` unit.
- **Guess:** Low-medium as a hazard, but it is the **`workbench/` failure shape
  in miniature**: a path that resolves on disk and not in git, in the directory
  where planning artifacts are supposed to be findable. `D-2607-D3NL` is the
  same class at scale.
- **Kind:** `trap` · **Status:** `open`
- **The mirror problem, and the one with teeth:** `docs/ecmascript-2025/` (the
  42-file ES2025 spec corpus, `0a4b138`) is on **`main` only**. Research units
  under `project03-language-evolution/` live on `release/0.7.x` and therefore **cannot
  cite it with a path that resolves on their own branch** — which
  `CLAUDE.md` requires and `make check` enforces. Found the hard way: the
  `03-threading-macros` reproduce command was written against
  a two-levels-up `ecmascript-2025` path and did not resolve. **Operator call:** cherry-pick
  `0a4b138` onto `release/0.7.x`, or accept cross-branch notes in every unit
  that uses the corpus.
- **Also:** `backlog/owed-0.7.x-rows.md:4` names the worktree as
  `.workdirs/release-0.7.x`; the actual path is `.worktrees/0.7.x`. One-line fix,
  same document that exists to make the 0.7.x checkout cheap.

---

---

### `D-2607-2PQR` — cross-compiler threading parity rests on two test cases

- **What:** `crates/lykn-lang/tests/cross_compiler.rs:144-145` contains the
  entire JS/Rust parity surface for threading:

  ```rust
  cross_test!(cross_thread_first, "(-> x f g)");
  cross_test!(cross_thread_last,  "(->> x (f a) (g b))");
  ```

  Bare symbols and one plain call. **No keyword-step parity test**, despite
  DD-18.1 changing the keyword path in *both* emitters (its Phase 2 and Phase 3).
  Nothing compares the two implementations on `(:method args)`, on namespaced
  heads, or on `some->`/`some->>`.
- **Where:** `crates/lykn-lang/tests/cross_compiler.rs:144-145`.
- **How found:** `audit` — building the Rust compiler to settle whether `->>`
  was implemented there too, after the operator surfaced conflicting accounts.
- **Guess:** Medium as a defect risk, **high as an explanation.** The two
  implementations *do* currently agree — 14/14 in
  `project03-language-evolution/slice03-threading-macros/data/parity-transcript.txt`. But the
  thinness of this surface is *why* a JS-only check felt sufficient to the
  session doing the survey, and it is the standing obligation `CLAUDE.md` states
  outright: *"Changes to the grammar should be reflected in both."* Nothing
  enforces that for the part of threading DD-18.1 actually touched.
- **Kind:** `gap` · **Status:** `open` · **Parent:** `D-2607-Z5KN`
- **Suggested:** promote the 14 cases in `parity-transcript.txt` into
  `cross_compiler.rs` — they already exist, already pass, and already cover
  keyword steps, namespaced heads, `some->`/`some->>` and `as->`'s silent
  miscompile. Cheap, and it converts a transcript into a regression gate.

---

### `D-2607-V8DM` — a correct finding degraded, in retelling, into a false one

- **What:** `dogfooding-friction-log.md` F-1 found, correctly, that **the
  collection prelude is missing** — *"`->>` is a purely syntactic macro. That
  expands to `map(double, filter(…, items))`. **`filter`, `map` and `reduce` do
  not exist.**"* Downstream of that, the finding travelled informally as
  ***"`->>` is not implemented"*** — a different claim, and false. `->>` is
  implemented correctly, in **both** compilers (14/14 parity, R-11).
- **How found:** `operator` — Duncan held three accounts of `->>` side by side
  and asked which to believe. Reconstructing them showed **all three agreed**;
  the contradiction was entirely in the summaries.
- **Guess:** Medium-high, and **structural rather than incidental.** The tracked
  artifacts were *precise*: F-1 is precise, and `D-2607-K9RT` is precise. The
  drift happened in the informal channel between them, which is exactly the
  channel a register cannot police. Cost here: a session re-derived a settled
  fact, and nearly wrote a false one into a planning tree.
- **Kind:** `systemic` · **Status:** `open` · **Parent:** `D-2607-Z5KN`
- **The corroborating detail, which is the sharper half:** F-1 states that
  `even?` maps to `evenQMARK`. **It maps to `isEven`** — verified in both
  compilers. `D-2607-K9RT` copied `evenQMARK` from F-1 and it has sat in the
  register unchecked ever since. So the register did not merely fail to stop the
  drift; **it propagated an error from the source document.** A row transcribed
  from a finding is not the same as a row re-run against the code. Corrected at
  both sites 2026-07-25 as an annotation, not a silent rewrite.
- **Candidate disposition:** when a register row quotes *compiled output*, that
  quote is a claim about the code and should carry the same evidence strength as
  any other — i.e. re-run, not transcribed. This is `D-2607-Z5KN`'s thesis
  applied to documentation: the line nobody executed is the line that is wrong.

## Trending-table delta

If all six are accepted, `discoveries.md`'s trending table changes by:

| How found | Δ Entries | Δ `trap`/`blocker` | Δ Systemic |
|---|---|---|---|
| `audit` | +5 | +2 | +1 |
| **`operator`** (new category) | **+1** | 0 | **+1** |
| **Total** | **+6** | **+2** | **+2** |

New totals: `audit` 14, `operator` 1, Total 28, of which `trap`/`blocker` 11,
systemic 6.

**`operator` is proposed as a new "how found" category.** `D-2607-V8DM` was not
found by audit, dogfooding, CDC review, CC implementation, or downstream
friction — it was found by the operator noticing that three accounts of the same
feature disagreed. That is a distinct discovery surface and worth counting
separately, on the same reasoning that made `downstream-friction` worth
separating: the register's trending note already reports that surface as
3-for-3, and this one is 1-for-1 on a *systemic* finding.

Worth noting for the trending read: five of the six came from `audit`, but the
two sharpest (`D-2607-8QVL`, `D-2607-3KTP`) were confirmed only by **executing
the compilers** rather than reading them — and `D-2607-2PQR` was found by
executing the *other* compiler, which the audit had not thought to do. That is
the register's dogfooding-beats-reading thesis reappearing inside an audit: the
audit found the suspicion, execution settled it, and the second execution found
what the first had missed.
