# Dogfooding friction log — writing the book-audit tool in lykn

**Kept by:** CDC · **Started:** 2026-07-24 · **Against:** `release/0.6.x`

The rule: every time the guides don't answer a question I actually have while
writing real lykn, it goes here — with what I wanted, what the guides said, and
what I did instead. Findings route to **arc07** (guides/SKILL) or to a language
arc when the defect is in the language rather than the docs.

Severity: **blocker** (can't proceed correctly) · **trap** (guides lead you
somewhere broken) · **gap** (unanswered, had to guess) · **polish**.

---

## F-1 — `(->> items (filter even?) (map double))` cannot run. **TRAP.**

**Where:** `docs/guides/00-lykn-surface-forms.md:678` (thread-last, the flagship
example), again at `:697` for `some->>`, and in
`examples/surface/threading.lykn:33-37` — a shipped example file.

**What I wanted:** to pipe an array through filter/map/reduce, which is the
first thing any data-processing program needs.

**What the guides say:** thread-last with free functions —

```lisp
(->> items (filter even?) (map double))
```

**What actually happens:** `->>` is a purely syntactic macro. That expands to
`map(double, filter(evenQMARK, items))`. **`filter`, `map` and `reduce` do not
exist.**

> **Correction, 2026-07-25** (`D-2607-V8DM`). Two notes on this paragraph, which
> is otherwise exactly right and was the finding that opened the whole thread:
>
> 1. `even?` compiles to **`isEven`**, not `evenQMARK` — verified in both
>    compilers (`project03-language-evolution/slice03-threading-macros/data/parity-transcript.txt`,
>    on `release/0.7.x`). `D-2607-K9RT` copied `evenQMARK` from here and it went
>    unchecked in the register too.
> 2. The substance above — *the macro works, the functions it names do not
>    exist* — is **confirmed**. Flagging it because this finding later travelled
>    informally as *"`->>` is not implemented"*, which is a different and false
>    claim: `->>` is implemented correctly in both compilers. The compression
>    happened downstream of this document, not in it. There is no prelude, no stdlib, no auto-import — I grepped the whole
repo: nothing defines or exports them. The example compiles cleanly and then
throws `ReferenceError: filter is not defined` at runtime.

`examples/surface/threading.lykn` has the same defect in a file a newcomer is
specifically pointed at:

```lisp
(bind total
  (->> numbers
    (filter (fn (:number n) (= (% n 2) 0)))
    (map (fn (:number n) (* n 10)))
    (reduce (fn (:number acc :number n) (+ acc n)) 0)))
```

**Why nothing caught it:** the threading tests assert compiled *shape*, not
execution — `test/surface/threading_test.lykn:25` asserts
`"(->> items (filter pred) (map f) (reduce g init))"` produces the right nesting
and stops there. `examples/` is not executed in `make check`.

**What I did instead:** thread-*first* with method calls, which is what a JS
array actually offers:

```lisp
(-> lines (:reduce step (empty-scan)))
(-> blocks (:filter (fn ((Block b)) (= (fence-base-tag b) tag))))
```

**My read:** this is the sharpest kind of doc defect — not stale, but *never
true*, and it teaches Clojure muscle memory to people writing JavaScript. It
also propagates: `->>` is documented as a peer of `->` when in practice `->` is
the workhorse and `->>` has almost nothing in the JS world to point at, because
JS collection APIs are methods on the receiver, not collection-last functions.

**Three ways out, and this is a language call, not a doc call:**

1. **Fix the docs only.** Rewrite both `->>` examples to use functions the
   reader has actually defined (`(->> xs (my-filter pred))`), and add a note
   that lykn has no collection prelude. Cheapest; leaves `->>` looking like a
   form with no natural use.
2. **Ship a small prelude.** `filter`/`map`/`reduce`/`some`/`every` as
   collection-last free functions, which is what would make `->>` earn its
   place. This is a real language-scope decision and probably 0.7.0.
3. **Demote `->>` in the docs.** Teach `->` + method-threading as the idiom and
   present `->>` as the form you reach for with your own collection-last
   helpers.

I'd argue for **1 now** (0.6.0, it's a doc fix) and **2 as a 0.7.0 candidate**,
because a Lisp-flavoured language without `map`/`filter`/`reduce` will keep
surprising every single person who arrives.

**Routes to:** arc07 (the doc fix) + a 0.7.0 BACKLOG row (the prelude question).
The `examples/` file is arguably a 0.6.0 bug in its own right.

---

## F-2 — Nothing tells me whether `examples/` is verified. **GAP.**

F-1 was findable only because I went looking. `make check` runs the corpus,
`make test-docs` runs fenced blocks in `docs/`. `examples/*.lykn` appears to be
in neither — which is how a shipped example stayed broken. Worth confirming, and
if true, worth fixing: examples are the highest-traffic code in any language
project.

**Routes to:** arc07 or arc12 (test topology).

---

## F-3 — No guidance on iterating with an accumulator. **GAP.**

**What I wanted:** a line-scanner — walk lines, carry state, emit records. The
single most common shape in text processing.

**What the guides offer:** `bind` (immutable), `cell`+`swap!` (mutation, and
`09-anti-patterns` says don't reach for it unless genuinely needed), and kernel
`for`/`while`. Nothing shows a fold, and `reduce` doesn't exist as a free
function (F-1).

**The tension I hit:** the SKILL's own generator example uses
`(for (let i start) (< i end) (+= i 1) …)` — kernel `let` — while the
anti-patterns table says *"Using kernel forms when surface forms exist (`const`
instead of `bind`, ...)"* and *"never reach for kernel `let`"*. So the guides
model the thing they prohibit. A reader can't tell whether the loop counter is a
sanctioned exception or a slip.

**What I did instead:** `(-> lines (:reduce step (empty-scan)))` with a typed
`Scan` record threaded through, which I believe is the intended functional
answer — but I inferred it rather than read it.

**Suggested fix:** a short "Iteration and accumulation" section in
`01-core-idioms.md` that ranks the options (method `:reduce` → recursion →
`cell` → kernel loop) and says plainly when the kernel loop is allowed.

**Routes to:** arc07.

---

## F-4 — `try` still can't produce a value, and SKILL.md still teaches the old story. **BLOCKER (already decided).**

`assets/ai/SKILL.md` says *"`try`/`catch`/`finally`: kernel forms used directly
in surface code. **MUST**"* — DD-57's W-4b item, unchanged since 2026-05-14.
This is currently accurate (W-2 never shipped) and becomes wrong the moment it
does. Already routed: operator decided 2026-07-24 to ship W-2 in 0.6.0.

I hit this immediately: with no value-producing `try`, a parse step that can fail
has no clean expression-position spelling, which pushes error handling into
statement position and out of pipelines. This is a real ergonomic cost, not just
a doc inconsistency — worth recording as independent support for the W-2 call.

**Routes to:** the W-2 arc (code) + arc07/W-4b (SKILL + guides).

---

## F-5 — Single-constructor `type` is undocumented. **GAP.**

Every `type` example in the guides and SKILL is a sum type (`Option`, `Result`).
I wanted a plain record — `(type Block (Block :string tag :number line :string
body))` — which I *believe* works, since a sum type with one constructor is
still a type, but no example confirms it and no guide says "this is how you
declare a record."

Related unknowns I had to guess at:

- Is `(Scan)` valid as a `:returns` annotation for a constructed type? The
  guides show `(Counter c)` in `:args` patterns but never a type in `:returns`.
- Do constructor fields read as `s:blocks`, or does the tagged representation
  (`{tag: "Scan", ...}`) require something else? The skill says `(Some v)`
  matches `{ tag: "Some", value: v }` — for a **multi-field** constructor the
  field layout is never shown.

That last one is load-bearing and I could not answer it from the docs. If
multi-field constructors don't store fields under their declared names, most of
this module is wrong.

**Suggested fix:** one worked record example in `05-type-discipline.md`,
including the compiled JS, so the field layout is visible.

**Routes to:** arc07 (and it's a strong book candidate too — records before sum
types is the friendlier teaching order).

---

## F-6 — String and array method names are unverifiable from the docs. **GAP.**

I used `:trim-start`, `:starts-with`, `:slice`, `:split`, `:join`, `:at`,
`:filter`, `:reduce`, assuming lisp-case→camelCase gets me
`trimStart`/`startsWith`/`at`. That should hold by DD-49's rule, but no guide
shows a method call whose name actually needs the conversion — every example is
single-word (`:to-upper-case` in the threading example is the one exception, and
it's in a form I couldn't otherwise verify).

A short "calling JS methods from lykn" table — `str.startsWith` → `(:starts-with)`,
`arr.at` → `(:at)` — would remove all doubt cheaply.

**Routes to:** arc07.

---

## F-7 — Inline exports plus `mod.lykn` exports create an unclear export story. **GAP / DESIGN.**

**Where:** CC's 2026-08-08 external-library dogfood report, in the generated
utility-library module shape, e.g.

```lisp
(export (func collect-valid-records
  :args (:array results)
  :returns :array
  :body
  (results:flat-map (fn (:any result)
    (? (= result:tag "ShapeOk")
      #a(result:value)
      #a())))))
```

The same dogfood package also had a `mod.lykn` entrypoint with a second explicit
export list:

```lisp
(export "./record-shape.js" (names
  ShapeOk
  ShapeErr
  collect-valid-records
  normalize-email
  ...))
```

**What I wanted:** one coherent module-export story. A module's public API
should be visible at the top, before the function bodies, and a package
entrypoint should not require a second export list unless it is serving a
clearly different purpose.

**What the guides/SKILL currently teach:** inline named exports:
`(export (func ...))` and `(export (bind ...))`. The generated package shape
also pushes public API through a `mod.lykn` re-export list. That may be a real
two-level requirement, but if so the requirement needs to be explicit.

**Why this matters:** inline export wrappers make the export decision live at the
definition site, which is familiar from JavaScript but awkward in a Lisp-flavoured
module. It hides the public surface inside implementation detail and makes
teaching examples look noisier than the language needs to be. This is not merely
a prose style preference if the language lacks a first-class top-of-module export
declaration form. The `mod.lykn` list adds a second question: is the author
declaring export intent twice, or are implementation visibility and package
entrypoint re-export separate concepts?

**Candidate direction:** standardize public Lykn examples on a top-of-module
export surface before the book starts. The exact spelling is a design decision,
but the desired shape is something closer to:

```lisp
(exports collect-valid-records normalize-record valid-record?)

(func collect-valid-records
  :args (:array results)
  :returns :array
  :body
  ...)
```

If the compiler does not support the settled form yet, this becomes a pre-book
language/compiler slice, not a book workaround. The book should not normalize the
current inline wrapper as the durable idiom unless the operator explicitly
decides to accept that cost. The design also needs to decide how entrypoint
barrel exports interact with implementation-module exports: required, redundant,
or intentionally distinct.

**Routes to:** `D-2608-XPRT` in the discovery register; arc16 planning must make
the export-surface decision before drafting the module/API chapters. The fix may
route to arc10/compiler-completion or a new 0.6.0 language-surface slice once the
syntax is chosen.

---

## F-8 — Repeated local `bind` forms need a grouped binding surface. **GAP / DESIGN.**

**Where:** CC's 2026-08-08 external-library dogfood report, in normalization
code shaped like:

```lisp
(bind id (normalize-token record:id))
(bind name (? (= (js:typeof record:name) "string")
  (record:name:trim)
  ""))
(bind email (normalize-email record:email))
(bind role (normalize-role record:role))
(bind tags (normalize-tags (?? record:tags #a())))
```

**What I wanted:** a compact local-binding form for the common "derive several
locals, then build a value" shape. In a Lisp, a run of sibling bindings should
not be the only available spelling for a local scope.

**Candidate direction:** support a let-style grouped binding surface, with a
shape along these lines:

```lisp
(bind
  email (normalize-email record:email)
  role (normalize-role record:role)
  tags (normalize-tags (?? record:tags #a())))
```

The exact semantics need a design call before implementation: simultaneous vs
sequential binding, body placement, shadowing rules, whether this is a new
`let`/`let*` family or an extension of `bind`, and how it composes with the
existing "bind for all values" guidance.

**Why this matters:** without a grouped form, idiomatic Lykn examples drift
toward verbose statement lists. That makes real modules look more imperative
than the language wants to feel, especially in validation/normalization code
where several derived locals are natural and should read as one expression.

**Routes to:** `D-2608-LBND` in the discovery register; arc16 planning must make
the grouped-local-binding decision before drafting the expression/local-binding
chapters. The fix may route to arc10/compiler-completion or a new 0.6.0
language-surface slice once the syntax and semantics are chosen.

---

## F-9 — Nested validation `?` ladders need a flatter branch surface. **GAP / DESIGN.**

**Where:** CC's 2026-08-08 external-library dogfood report, in validation code
shaped like:

```lisp
(? (not (string-present? id))
  (ShapeErr (validation-error "id" "missing-id" "id must be a non-empty string"))
  (? (not (string-present? name))
    (ShapeErr (validation-error "name" "missing-name" "name must be a non-empty string"))
    (? (not (valid-email? email))
      (ShapeErr (validation-error "email" "invalid-email" "email must contain a local part and domain"))
      (ShapeOk (obj
        :id id
        :name name
        :email email
        :role role
        :tags tags)))))))
```

**What I wanted:** a flat, scan-friendly way to express ordered validation cases:
first failing predicate returns its error, otherwise return the success value.
Deeply nesting the same `?` form is a signal that the surface is missing a more
readable branch construct.

**Candidate direction:** add or bless a `cond`/guard-style surface, with a shape
roughly like:

```lisp
(cond
  ((not (string-present? id))
   (ShapeErr (validation-error "id" "missing-id" "id must be a non-empty string")))
  ((not (string-present? name))
   (ShapeErr (validation-error "name" "missing-name" "name must be a non-empty string")))
  ((not (valid-email? email))
   (ShapeErr (validation-error "email" "invalid-email" "email must contain a local part and domain")))
  (:else
   (ShapeOk (obj :id id :name name :email email :role role :tags tags))))
```

The exact spelling is open: `cond`, `case`, `guard`, validation helpers, or a
pipeline-friendly Result combinator are all possible. The language-design work
is to settle which branch surface Lykn wants, how it compiles, how exhaustiveness
or else-coverage is checked, and how it interacts with existing `?` and `match`
guidance.

**Why this matters:** the book will have to teach validation, parsing, and API
boundary checks. If the only blessed branch surface is nested `?`, examples will
be structurally correct but pedagogically heavy. This is the sort of syntax debt
the book pass is supposed to expose before it becomes the idiom.

**Routes to:** `D-2608-COND` in the discovery register; arc16 planning must make
the flatter-branching decision before drafting validation/control-flow chapters.
The fix may route to arc10/compiler-completion or a new 0.6.0 language-surface
slice once the syntax and semantics are chosen.

---

## F-10 — Lykn-owned generated manifests blur the source-tree ownership boundary. **GAP / DESIGN.**

**Where:** CC's 2026-08-08 external-library dogfood report, in the scaffolded
project file list:

```text
/private/tmp/lykn-dogfood-utility-lib/packages/lykn-dogfood-utility-lib/deno.json
```

The report describes this as created by `lykn new`, alongside the package's
`.lykn` sources and generated `target/lykn/build/...` outputs.

**What I wanted:** a clearer source-tree ownership rule. For the parts of a
project that Lykn builds and owns, source packages should be authored in Lykn
source files (`.lykn` / `.lyk`), while Lykn-generated JSON manifests and other
build/publish files should live under generated homes such as `target/`,
`dist/`, or another explicitly generated artifact directory.

This is not a ban on user-owned non-Lykn source files. Users should remain free
to put their own README files, data files, fixtures, assets, handwritten JS, or
other project resources in source control when those files are genuinely part of
their project. The smell is Lykn putting its own generated/config/build surface
inside a package source tree and making it look author-owned.

**What the guides/SKILL currently teach:** there is a design tension here, not
just a missing sentence. Recent build/dist guidance says generated publish
manifests land under `target/lykn/{build,dist}` / `dist`, but older and still
active project-structure guidance also treats per-package source `deno.json` as
package config, export metadata, and a staging template. CC followed that
current surface, so the dogfood result reflects the tool and guide state rather
than a random implementer invention.

**Why this matters:** the book will have to teach what a Lykn package looks
like. If `lykn new` scaffolds a package-level `deno.json`, the book either
normalizes Deno metadata as author-facing Lykn package source or has to explain
why generated/tool-owned metadata is sitting beside user source. That undercuts
the source-only / Lykn-first story unless the ownership boundary is made
explicit.

**Routes to:** `D-2608-SOWN` in the discovery register; arc16 planning must make
the source-tree ownership decision before drafting project-structure,
package-layout, build, or publishing chapters. The fix may route to `lykn new`,
package metadata design, dist/build staging, docs, or all of them.

---

## Running tally

| # | Kind | One-line | Routes to |
|---|------|----------|-----------|
| F-1 | **trap** | `->>` flagship example can't run; no collection prelude exists | arc07 + 0.7.0 backlog + `examples/` bug |
| F-2 | gap | `examples/*.lykn` appears unverified by any test target | arc07 / arc12 |
| F-3 | gap | no idiomatic answer for accumulate-over-a-sequence; guides model the kernel loop they ban | arc07 |
| F-4 | blocker | `try` valueless; SKILL still teaches kernel-only | W-2 arc + arc07 |
| F-5 | gap | single-constructor records + multi-field constructor layout undocumented | arc07 + book |
| F-6 | gap | no method-name conversion examples for JS interop | arc07 |
| F-7 | gap/design | inline exports plus `mod.lykn` re-exports leave export ownership unclear | `D-2608-XPRT` + arc16 planning + possible compiler slice |
| F-8 | gap/design | repeated local `bind` forms need a grouped let-style binding surface | `D-2608-LBND` + arc16 planning + possible compiler slice |
| F-9 | gap/design | nested validation `?` ladders need a flatter `cond`/guard-style branch surface | `D-2608-COND` + arc16 planning + possible compiler slice |
| F-10 | gap/design | Lykn-owned generated manifests need a generated home, not package source ownership | `D-2608-SOWN` + arc16 planning + possible scaffold/build/docs slice |

**Ten findings from real-module dogfooding before the book pass.** That is
the argument for the dogfooding approach, and it is also the argument for doing
it *before* the book's pedagogical pass rather than after: F-1, F-3, F-5, F-7,
F-8, F-9, and F-10 are all things the book would otherwise have to teach around.
