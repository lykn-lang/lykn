# Argument-position inventory of the ECMAScript 2025 + host surface

**Unit:** `docs/design-v0.7.0/03-threading-macros/`
**Kind:** research (SDLC step 1) — no production code changes
**Date:** 2026-07-25
**Serves:** `D-2607-K9RT` (held-for-design), `D-2607-W7KD` (held-for-design),
`D-2607-XXXX` (the pending language-design conversation, which owns the call)

---

## 0. Bottom line

The question as posed was *"can `->>` be supported in ECMAScript 2025?"* The
survey answers a sharper question, because the original premise turned out to be
false in a useful way.

1. **`->>` is already implemented and correct.** `classifier.js:66-68`,
   `Thread("last", …)`, plus `some->>`. Verified by execution, not by shape
   (§6.1). The feature is not missing.
2. **`->>` has a real domain in JS — but it is not Clojure's domain.** Clojure's
   `->>` is the *sequence-pipeline* macro. In JavaScript that role is taken by
   the receiver: `xs.filter(f).map(g)`. What is left for `->>` is a different
   and much smaller class — **configured operators and keyed sinks** — where the
   leading arguments constitute an operator and the datum trails it.
3. **The counts.** Of 489 ES2025 built-ins, **417 (85%) cannot distinguish `->`
   from `->>` at all** — the datum is the receiver, or the function is unary. Of
   the **48** that can, it is **37 datum-first to 2 datum-last**. Adding the host
   tier (214 more callables) brings the discriminating set to **119**, at
   **64 datum-first to 20 datum-last**.
4. **The two ES2025 datum-last functions are `BigInt.asIntN` and
   `BigInt.asUintN`.** That is the entire thread-last domain in the core
   language's free/static surface.
5. **The host tier is where thread-last actually lives** — and it is worth
   keeping `->>` for. `Deno.writeTextFile(path, data)` and
   `crypto.subtle.digest(algorithm, data)` are datum-last *and* plausible
   pipeline termini.
6. **The genuinely missing feature is `as->`, not `->>`.** It does not exist,
   and — worse — `(as-> x $ …)` compiles clean to a call to an undefined
   `asTo(…)` (§6.3). One general form subsumes datum-last, datum-mid, and
   operator-receiver together, where a second dedicated macro serves two
   built-ins.

**Recommendation, in one line:** keep `->>` and re-scope it in the docs from
*"the sequence pipeline"* to *"the configured-operator / sink step"*; ship
`as->`; do **not** ship a collection-last prelude.

---

## 1. Why the naive question is under-determined

Clojure's `->>` earns its keep because `clojure.core`'s sequence library is
consistently **operator-first, collection-last**: `(map f coll)`,
`(filter pred coll)`, `(take n coll)`. Chain three of those and thread-last is
the only ergonomic spelling.

JavaScript's sequence library is the exact mirror. `xs.map(f)` puts the
collection in the receiver slot and the operator in the argument slot. So the
Clojure shape that *motivates* `->>` is, in JS, the shape that motivates `->`.

That much is folklore. What the folklore does not tell you is whether some
*other* coherent datum-last class exists in JS that `->>` could serve. Answering
that requires an actual census, which is what follows.

---

## 2. Method

### 2.1 Corpus

| Tier | Source | Callables |
|---|---|---|
| 1 | ECMA-262 16th ed. (ES2025), clauses 19–28, via `docs/ecmascript-2025/function-heads.md` | 489 |
| 2 | Host surface — Web + Deno, via `deno types` (Deno 2.9.4) | 214 |

Tier 1 starts from the corpus's 1,165 extracted function heads, keeps clauses
19–28 (the observable built-in library, excluding language semantics), and drops
the 215 abstract operations that live inside those clauses — leaving 489
observable callables. One further row (`IfAbruptRejectPromise`) is excluded as
spec-internal shorthand notation rather than a built-in.

Tier 2 is the surface lykn programs actually run against. It is included because
Tier 1 alone would have produced a misleading answer (§4).

### 2.2 The classification

Each callable gets one **shape** — where the *primary datum* sits, the datum
being the value a pipeline would carry:

| Shape | Meaning |
|---|---|
| `RECEIVER-D` | datum arrives as `this` — the ordinary method case |
| `OPERATOR-RECEIVER` | receiver is a *configured operator*; the datum is an argument |
| `D-FIRST` | datum is parameter 0 of a free/static function |
| `D-LAST` | datum is the last **required** parameter (required arity ≥ 2) |
| `D-MID` | datum is neither first nor last |
| `F-LAST` | trailing parameter is a callback; there is no data datum |
| `PEER` | symmetric operands, no primary datum |
| `UNARY` | required arity 1 — first and last coincide |
| `NO-D` | no threadable datum (constructors, niladics) |

### 2.3 The methodological crux — read this before trusting any count

**`->` and `->>` only differ for callables with required arity ≥ 2.** A unary
function's sole argument is simultaneously first and last; a method's datum is
the receiver either way. Pooling those into a ratio inflates whichever side you
are arguing for, and it is the single easiest way to get this question wrong.

Every count below therefore reports the **discriminating set** separately.
Nothing is classified by heuristic: every callable with required arity ≥ 2 is
hand-assigned in a reviewed table in `scripts/build-catalog.py`, and the build
**fails loudly** on any unclassified row. There is no residue — the build prints
`self-check: OK` only when every discriminating callable has been looked at.

---

## 3. Tier 1 — ECMAScript 2025

```
RECEIVER-D           274        <- the datum is the receiver
UNARY                143        <- undecidable
D-FIRST               37
NO-D                  17
OPERATOR-RECEIVER     12
PEER                   3
D-LAST                 2
EXCLUDE                1
                     ---
                     489
```

**417 of 489 (85%) are `RECEIVER-D` or `UNARY`** — for these, `->` and `->>`
produce identical output. This is not an interpretation; it follows from the
expansion rules and is confirmed by compilation (§6.1).

### The discriminating set — 48 callables

| Shape | Count |
|---|---|
| `D-FIRST` | **37** |
| `NO-D` | 6 |
| `PEER` | 3 |
| `D-LAST` | **2** |

**Datum-first to datum-last: 37 : 2.**

The 37 are `Object.*` (11), `Reflect.*` (9), `Atomics.*` (12), `parseInt` /
`Number.parseInt`, `Math.pow`, `String.raw`, `Proxy` / `Proxy.revocable`,
`RegExp`.

The 2 are:

```
BigInt.asIntN  ( bits, bigint )
BigInt.asUintN ( bits, bigint )
```

That is the whole thread-last domain in the core language's free/static surface:
two bit-width conversion utilities.

### Two corroborating details

**TC39's current instinct is datum-first.** The newest collection APIs in the
language — `Object.groupBy(items, callback)` and `Map.groupBy(items, callback)`,
both ES2024 — put the collection **first** and the function second. This is the
closest ES has to a `clojure.core` seq function, and it is the opposite of
Hickey's order. Datum-first is not merely a legacy accident being carried
forward; it is the live convention.

**The 12 `OPERATOR-RECEIVER` methods mostly are not user-facing.** Seven are the
RegExp `%Symbol.*%` protocol hooks — internal delegation targets, not the
spelling anyone writes. And for each, the language ships a **datum-as-receiver
twin** that *is* the user-facing spelling:

| operator-receiver (internal) | datum-as-receiver (what you write) |
|---|---|
| `re[%Symbol.match%](s)` | `s.match(re)` |
| `re[%Symbol.matchAll%](s)` | `s.matchAll(re)` |
| `re[%Symbol.replace%](s, r)` | `s.replace(re, r)` |
| `re[%Symbol.search%](s)` | `s.search(re)` |
| `re[%Symbol.split%](s, lim)` | `s.split(re, lim)` |

The genuinely user-facing operator-receiver set is six methods: `re.exec`,
`re.test`, `f.call`, `f.apply`, `f.bind`, `proto.isPrototypeOf`.

---

## 4. Tier 2 — the host surface, where this gets interesting

If the survey had stopped at Tier 1 it would have concluded that `->>` is dead
weight. That conclusion would have been wrong.

```
NO-D                  77
D-FIRST               62
UNARY                 26
F-LAST                23
D-LAST                18        <- eighteen
D-MID                  6
OPERATOR-RECEIVER      2
                     ---
                     214
```

### The discriminating set — 71 callables

| Shape | Count |
|---|---|
| `D-FIRST` | 27 |
| `D-LAST` | **18** |
| `F-LAST` | 17 |
| `D-MID` | 6 |
| `NO-D` | 3 |

The 18 `D-LAST` rows (17 distinct operations) fall into exactly two families:

**Configured operators** — leading arguments specify *how*, the datum is *what*:

```
crypto.subtle.digest    ( algorithm, data )
crypto.subtle.sign      ( algorithm, key, data )
crypto.subtle.verify    ( algorithm, key, signature, data )
crypto.subtle.encrypt   ( algorithm, key, data )
crypto.subtle.decrypt   ( algorithm, key, data )
crypto.subtle.exportKey ( format, key )
```

**Keyed sinks** — a locator, then the value being deposited:

```
Deno.writeTextFile   ( path, data )        Headers.set          ( name, value )
Deno.writeFile       ( path, data )        Headers.append       ( name, value )
Deno.writeTextFileSync ( path, data )      FormData.set         ( name, value )
Deno.writeFileSync   ( path, data )        FormData.append      ( name, value )
localStorage.setItem ( key, value )        URLSearchParams.set  ( name, value )
                                           URLSearchParams.append ( name, value )
```

`URLPattern.test/exec` also mirror `RegExp` exactly — a compiled matcher as
receiver, the input as argument. The operator-receiver pattern is not a RegExp
quirk; it recurs whenever an API compiles a matcher.

Everything else in Deno's 96-function namespace is **path/subject-first**
(`Deno.readTextFile(path, options)`, `Deno.mkdir(path, options)`, …), and 17
host callables are `F-LAST` — `Deno.serve(options, handler)`,
`addEventListener(type, listener)`. Callback-last is a real JS convention, but
it is not a *data*-last convention and no threading macro serves it.

---

## 5. The generalisation

Across 119 discriminating callables in both tiers, one rule accounts for
essentially every datum-last signature:

> **JavaScript places the datum last exactly when the leading arguments
> constitute a configured operator or a destination — a compiled matcher, a
> keyed cipher, a width-parameterised conversion, a path, a header name.
> Otherwise the datum comes first.**

This is a coherent convention, not noise, and it is *not* the same convention as
Clojure's. Hickey put the collection last so that **successive transformations
compose**. JavaScript puts the datum last so that **the operator reads before
its operand** — which is a statement about one call, not about a chain.

That difference is the whole answer, and it has a direct consequence:

**Clojure's `->>` is a chaining macro; JavaScript's thread-last cases are
terminal.** You write to a file once, at the end. You digest a buffer once. You
set a header once. You do not chain `crypto.subtle.digest` into
`Deno.writeTextFile` into `Headers.set` — and in the rare case you do, each step
is a different operator with a different config, so nothing accumulates the way
`filter → map → take` accumulates.

So `->>` in lykn should be understood as a **one-step affordance**, not a
pipeline. Which it can be, perfectly well — `(->> rendered (Deno:writeTextFile
"out.html"))` is genuinely nicer than the alternatives. It is just not the thing
the guides currently advertise.

### The three threading shapes in JavaScript

Clojure has two. JavaScript has three, and lykn currently has clean support for
one and a half:

| # | Shape | Example | lykn spelling | Status |
|---|---|---|---|---|
| 1 | datum as receiver | `xs.map(f).filter(g)` | `(-> xs (:map f) (:filter g))` | ✔ works (DD-18.1) |
| 2 | datum-first free fn | `Object.groupBy(xs, f)` | `(-> xs (Object:group-by f))` | ✔ works |
| 3 | datum-last / operator-first | `digest(algo, data)` | `(->> data (crypto:subtle:digest algo))` | ✔ works, undocumented |
| — | **datum in the middle** | `Reflect.set(t, k, V)` | — | ✘ **no spelling** |

Shapes 1 and 2 are both served by `->`, which is why `->` is the workhorse: the
keyword-step rule from DD-18.1 makes it a *hybrid* macro that handles
receiver-threading and first-argument-threading in one form. That hybrid is
lykn's genuine adaptation to JS, and it is worth naming as such in the docs — it
is not something Clojure has.

Shape 4 has no spelling at all, and `as->` is its answer.

---

## 6. Findings that came out of the survey

These are new. Each has a Discovery Register row — `D-2607-8QVL` (§6.1),
`D-2607-W4RC` (§6.2), `D-2607-3KTP` (§6.3), `D-2607-L7BX` (§6.4),
`D-2607-2PQR` (§6.5), `D-2607-V8DM` (§6.6). All six are appended to
`docs/backlog/discoveries.md`; `discovery-rows.md` records why they are not yet
`routed` (the register is untracked on every branch).

**All compiler-behaviour claims below hold for BOTH compilers.** The first pass
of this unit verified through `packages/lang` only, which was not enough to
settle a question about the language — see §6.6. Every claim in §6.1–§6.3 has
since been re-run through the Rust compiler as well; the machine-diffed
transcript is `data/parity-transcript.txt` (14 cases, 14 agree, 0 disagree).

### 6.1 DD-18's worked `->>` example is wrong — and it is `final`

`docs/design/06-final/0023-dd-18-threading-macros-and-conditional-binding.md`,
§`->>` thread-last, documents:

```lisp
(->> items (filter even?) (map double) (take 5))
```
```javascript
take(map(filter(items, even?), double), 5)          ;; as written in DD-18
```

That is the **thread-first** nesting. The compiler actually produces:

```javascript
take(5, map(double, filter(isEven, items)));        ;; verified by execution
```

The DD's stated "kernel expansion" line, `(take (map (filter items even?)
double) 5)`, is wrong the same way — `items` is threaded into first position
under a `->>` heading. **The code is correct in both compilers; the DD is wrong.** Verified by
*running* both, not by reading them — `data/parity-transcript.txt` case 1.

Note this is precisely `D-2607-3VXM`'s shape one level up: the *specification*
asserted a shape nobody executed.

Minor, same family: `D-2607-K9RT` renders `even?` as `evenQMARK`; the current
mapping produces `isEven`.

### 6.2 `->` and `->>` are byte-identical for method steps

Confirmed by compilation, in both compilers:

```lisp
(-> s (:to-upper-case) (:slice 0 10))    =>  s.toUpperCase().slice(0, 10);
(->> s (:to-upper-case) (:slice 0 10))   =>  s.toUpperCase().slice(0, 10);
```

DD-18.1's keyword-step rule fires *before* the position check, so the receiver
threads regardless. Same in Rust:
`crates/lykn-lang/src/emitter/forms.rs:886-935`, where `apply_threading_step`
matches `SExpr::Keyword` in both the `Bare` and `Call` arms before consulting
the `first` flag. This is the right behaviour, but it means that across the
274 `RECEIVER-D` built-ins the choice of macro is a no-op — which is worth
stating in the guides, because a reader coming from Clojure will assume
otherwise.

### 6.3 `as->` does not exist, and fails silently

```lisp
(as-> x $ (f $ 1) (g 2 $))    =>  asTo(x, $, f($, 1), g(2, $));
```

Clean compile, no diagnostic, `ReferenceError` at runtime. The `asTo` spelling
comes from the `->` → `To` rule in `compiler.js:405` (`MULTI_CHAR_ESCAPES`)
mechanically rewriting an unrecognised head.

This is an instance of `D-2607-P4WQ`'s class, not a separate defect — any
unknown head compiles to a call. But it is a *high-traffic* instance: `as->` is
the third threading macro every Clojure user reaches for, and lykn's own docs
teach the other four.

### 6.4 The 0.7.0 planning tree is not on `main`

`docs/design-v0.7.0/` exists only on `release/0.7.x`. On `main` the path holds
two empty untracked directories (`02-packaging-strategy/artifacts`,
`02-packaging-strategy/evidence`) — debris that makes the tree look present when
it is not. Also, `docs/backlog/owed-0.7.x-rows.md:4` names the worktree as
`.workdirs/release-0.7.x`; the actual path is `.worktrees/0.7.x`.

---

### 6.5 Cross-compiler threading coverage is two test cases  (`D-2607-2PQR`)

`crates/lykn-lang/tests/cross_compiler.rs:144-145`:

```rust
cross_test!(cross_thread_first, "(-> x f g)");
cross_test!(cross_thread_last,  "(->> x (f a) (g b))");
```

That is the entire JS/Rust parity surface for threading. There is **no
keyword-step parity test**, even though DD-18.1 explicitly changed the keyword
path in *both* emitters (its Phase 2 and Phase 3). The two cases that do exist
cover only bare symbols and a plain function call.

The two implementations do currently agree — 14/14 in
`data/parity-transcript.txt` — so this is a coverage gap, not a live defect. But
it is the same shape as `D-2607-3VXM`: the thing nobody executes is the thing
that can drift silently, and here what is not executed is the *agreement between
two implementations of the same grammar*, which `CLAUDE.md` names as a standing
obligation ("Changes to the grammar should be reflected in both").

### 6.6 How this unit got it wrong first, and what that says  (`D-2607-V8DM`)

Recorded because the mechanism is more useful than the conclusion.

The first pass of this survey verified threading behaviour through
`packages/lang/mod.js` and reported implementation status as **settled**. lykn
has two compilers. A one-compiler check cannot settle a question about the
language, and the unit's own ledger discipline should have caught the gap before
the operator did.

It surfaced only because the operator held up three accounts of `->>` side by
side and asked which to believe. Reconstructing them:

| Account | What was actually claimed | Verdict |
|---|---|---|
| The `fences.lykn` dogfooding session | *"`->>` is a purely syntactic macro. That expands to `map(double, filter(…, items))`. **`filter`, `map` and `reduce` do not exist.**"* (`dogfooding-friction-log.md` F-1) | **Correct.** It found the *prelude* missing, and quoted the *correct* thread-last expansion. |
| This unit, mid-session | DD-18's worked example is wrong; `->`/`->>` identical **for method steps** | **Correct**, but foregrounded as an "important finding" in a way that read as an alarm about the implementation. |
| This unit, at close | `->>` is implemented correctly | **Correct**, but rested on one compiler. |

**All three agreed.** There was never a contradiction in the facts. What
happened is that F-1's finding — *the prelude is missing* — was compressed in
retelling into *`->>` is not implemented*, which is a different and false claim;
and this unit's framing invited a second misreading in the same direction.

Two things follow, and the second is the one worth keeping:

1. A finding is only as durable as its **shortest** restatement. F-1 is precise;
   the summary that travelled was not. The register exists to stop exactly this,
   and here the register's own row (`D-2607-K9RT`) is precise too — the drift
   happened in the *informal* channel between them.
2. **The register inherited a factual error from F-1 and propagated it
   unchecked**: both say `even?` maps to `evenQMARK`; both compilers actually
   emit `isEven`. Small in itself, and exactly the failure mode the register is
   supposed to catch — a detail nobody re-ran. Corrected in place at both sites,
   as an annotation rather than a silent rewrite.

## 7. Recommendations

Offered as input to the language-design conversation, which owns the decision.
Confidence is marked per item.

### R1 — Re-scope `->>` in the docs; do not remove it *(high confidence)*

`->>` has a real domain — 20 datum-last operations across both tiers, including
the file-write and digest families that any real lykn program touches. Removing
it would be an over-correction driven by Tier 1 alone.

What must change is the *teaching*. Replace the flagship
`(->> items (filter even?) (map double))` — which cannot run — with an example
from the actual domain:

```lisp
(->> rendered (Deno:write-text-file "out.html"))   ;; Deno.writeTextFile("out.html", rendered)
(->> bytes (crypto:subtle:digest "SHA-256"))       ;; crypto.subtle.digest("SHA-256", bytes)
```

And say plainly what `->>` is *for* in a JS-targeting Lisp: the
configured-operator/sink step, typically one step, typically last. This closes
the doc half of `D-2607-K9RT` without waiting on the prelude decision.

### R2 — Ship `as->` *(high confidence)*

It is the general form. One macro covers datum-last, datum-mid, and
operator-receiver — including the shape that currently has **no** spelling at
all (`Reflect.set(target, key, V)` threading `V`; `crypto.subtle.sign(algo, key,
data)` if you ever thread `key`). It also gives the reader an escape hatch for
every signature this survey classified as `PEER`, `D-MID`, or `F-LAST`.

Against a dedicated second macro serving two ES2025 built-ins, `as->` is the
better use of surface budget. And it currently mis-compiles silently, which is
its own argument.

### R3 — Do **not** ship a collection-last prelude *(medium-high confidence)*

This is the live question in `D-2607-K9RT` and `owed-0.7.x-rows.md` row 5, so I
will state the reasoning rather than just the verdict.

Arguments against:

- It would make lykn's own core library the **only** datum-last collection API
  in the ecosystem it compiles into. Every ES built-in, every Deno API, and
  TC39's two newest collection functions are datum-first. A lykn programmer
  would switch conventions at the boundary between lykn's prelude and
  everything else — twice per pipeline.
- It requires runtime functions in compiled output. The project's stated
  invariant is **zero runtime dependencies in compiled output** (CLAUDE.md,
  "What is lykn?"). A prelude either breaks that or depends on tree-shaking
  working — which is exactly what `01-treeshake-audit` is still open to
  determine. **This unit's recommendation is coupled to that unit's result**,
  and I flag the dependency rather than assuming it resolves favourably.
- The receiver-based idiom already works, is idiomatic JS, is lazy in the
  iterator-helper case, and produces cleaner output.

The honest counter-argument, which I do not think wins but which the design
conversation should weigh: a prelude would let lykn code be *portable reasoning*
— the same pipeline shape regardless of whether the collection is an Array, a
Set, an iterator, or a user type — where the method idiom binds you to whatever
the receiver happens to implement. `Iterator.prototype`'s helpers (ES2025) close
most of that gap but not all of it (no `groupBy`, no `partition`, no transducer
story).

If a prelude *is* wanted, the survey says it should be **datum-first**, used
with `->`, not datum-last with `->>`.

### R4 — Fix DD-18's worked example *(high confidence, mechanical)*

§6.1. It is a `final`-state DD teaching an expansion the compiler does not
produce.

### R5 — Answer `D-2607-W7KD` with `:reduce`, not a free `reduce` *(medium confidence)*

Out of this unit's scope but adjacent: the accumulate-over-a-sequence gap. The
survey supports documenting the method spelling
(`(-> xs (:reduce f init))`) as the idiom, which needs no new language surface
and no prelude.

---

## 8. Limitations, and what would falsify this

Stated so the next reader can attack the right things.

- **Tier 2 is scoped to `deno types`**, i.e. Deno's own namespace plus the Web
  APIs Deno exposes. Node-compat APIs, `@std/*`, and npm libraries are **not**
  surveyed. npm in particular is where data-last conventions do exist —
  **Ramda is entirely data-last, and lodash/fp** re-orders lodash to data-last
  for exactly the currying reason Hickey's ordering serves. A lykn programmer
  who reaches for Ramda has a genuine `->>` pipeline. I judge that a minority
  case, but it is an assumption, not a measurement, and the honest way to settle
  it is to survey what lykn programs actually import.
- **"Primary datum" is a judgment.** It is defensible per row and recorded per
  row in the catalog's `note` column, but a reader who disagrees about, say,
  `Object.create(O, Properties)` can re-classify and re-run. The ratio is
  lopsided enough (37:2 in Tier 1) that no plausible re-classification of
  individual rows changes the conclusion — but that robustness claim is itself
  worth checking rather than trusting.
- **The reference literature does not corroborate the framing, because it does
  not discuss it.** A search of *Deep JS*, *Eloquent JavaScript*, *Exploring
  JS*, and *JavaScript: The Definitive Guide* found **no statement of a global
  argument-order rule**, **zero** mentions of Ramda, data-first-vs-data-last,
  point-free style, or the pipeline operator. What they do supply is the
  receiver-as-implicit-first-parameter thesis (Rauschmayer, explicitly, three
  times) and Flanagan's observation that `Function.prototype.bind` partially
  applies **on the left only** — the strongest independent evidence that JS's
  machinery is biased toward datum-first. Sources in §9.
- **Not measured: what lykn programs actually do.** The strongest possible
  evidence here is a corpus count over real lykn code. The register already
  records that *"writing and running real programs in lykn finds more than
  reading lykn does"* (`discoveries.md`, trending note). This survey is a
  reading exercise. It should be checked against `fences.lykn` and the book's
  code once those are executable.

---

## 9. Sources and reproduction

**Primary**
- ECMA-262 16th edition (ES2025), clauses 19–28 — `docs/ecmascript-2025/`
- `deno types`, Deno 2.9.4 — captured to `data/deno-types-version.txt`
- **Both** lykn compilers, executed and machine-diffed —
  `scripts/probe-threading.js` (JS), `scripts/probe-threading-rust.sh` (Rust),
  transcript at `data/parity-transcript.txt`

**Secondary** (`~/lab/billosys/ai-engineering/knowledge/js/sources/md/`)
- Rauschmayer, *Exploring JS* — `30-objects.md:1235`, `:1268`;
  `31-classes.md:2944`, `:2952` (receiver as implicit first parameter;
  uncurrying `thisArg`)
- Flanagan, *JavaScript: The Definitive Guide* — `08-functions.md:1207`
  (`bind` partially applies on the left; `partialRight` must be hand-built);
  `07-arrays.md:390`, `:502` (the Array-iterator `thisArg` convention, and
  `reduce` trading that slot for `initialValue`)
- Haverbeke, *Eloquent JavaScript* — `05-higher-order-functions.md:551`
  (method chaining described as "a pipeline"); hand-written `filter(array,
  test)` / `map(array, transform)` at `:353`, `:403` — idiomatic hand-rolled JS
  defaults to datum-first

**Reproduce**

> **Cross-branch dependency — read first.** This unit lives on `release/0.7.x`.
> The ES2025 corpus it was built from, `docs/ecmascript-2025/` (42 files, added
> in `0a4b138`), is on **`main`** and is **not present on `release/0.7.x`**. So
> a two-levels-up `ecmascript-2025` spec path does *not* resolve from this
> directory, and a
> tracked document must not cite a path that fails to resolve on its own branch
> (`CLAUDE.md`, "A path cited in a tracked document must resolve in git" —
> `make check` enforces this). Point `--spec` at a checkout of `main`:

```sh
cd docs/design-v0.7.0/03-threading-macros
deno types > /tmp/deno-types.d.ts

# --spec must point at docs/ecmascript-2025/function-heads.md on `main`.
# From the `.worktrees/0.7.x` layout that is five levels up (VERIFIED, not counted):
python3 scripts/build-catalog.py \
    --spec ../../../../../docs/ecmascript-2025/function-heads.md \
    --deno-types /tmp/deno-types.d.ts \
    --out data
# prints per-tier shape distributions and `self-check: OK`

# The compiler probes in §6 resolve within this branch and need no adjustment.
# JS compiler:
deno run -A scripts/probe-threading.js
# Rust compiler (from the repo root, after `cargo build --release -p lykn-cli`):
scripts/probe-threading-rust.sh
```

**Resolving the split is an operator call**, not something this unit should
decide: either cherry-pick `0a4b138` onto `release/0.7.x`, or leave the corpus
on `main` and keep the cross-branch note above. Recorded as a bullet under
discovery row `D-2607-L7BX`.

`build-catalog.py` exits non-zero if any callable with required arity >= 2 is
missing from the hand-classification tables, so the catalog cannot silently
drift into heuristic guessing.

**Data**
- `data/catalog-es2025.tsv` / `.json` — 489 rows
- `data/catalog-host.tsv` / `.json` — 214 rows
- `data/parity-transcript.txt` — 14 threading cases through both compilers,
  each diffed programmatically. 14 agree, 0 disagree.
