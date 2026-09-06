# Handoff: Why the Surface/Kernel Separation Needs to Happen Now

**Authoring CDC:** Cowork Claude, cdc/dep-ergonomics thread
**Date:** 2026-05-14
**For:** the CDC who picks up the surface/kernel separation thread
**Purpose:** convey the findings, the problem space we were exploring, and the architectural concern that surfaced — plus the 0.7.0 i18n context that makes the separation foundational rather than merely cleaner.

---

## TL;DR

We started by triaging 14 post-rebase doctest failures. The triage revealed the failures all trace back to a single architectural fact: **surface lykn and kernel lykn share syntactic heads** (`(if …)`, `(try …)`, `(fn …)`, etc. are syntactically identical at both layers). The compilers disambiguate by structural/contextual analysis, and that analysis has been a recurring source of bugs across DD-50 / DD-50.5 / DD-50.6 / DD-50.7 — and now D-1 / D-2 (our 14 failures).

While planning the fix, Duncan revealed that 0.7.0 will introduce native-language readers (users will write lykn in Russian, Japanese, etc., with surface forms translated). Implementing this requires a canonical form catalog, which forces the question: when we write `bind` in the catalog, do we mean *surface* `bind` or some kernel form that happens to share the name? Under the current overlapping model, the catalog has to encode the overlap; under separation, the catalog encodes the distinction.

Result: the cleanup work we were planning bakes in current-overlap assumptions in ways that would need to be redone post-separation. The right move is to do the separation first, then return to the cleanup work against a clean foundation.

---

## The starting point: 14 post-rebase doctest failures

After rebasing the cdc/dep-ergonomics branch onto `release/0.6.x`, `make check` showed 14 doctest failures in `docs/guides/*.md`. `cargo test -p lykn-lang` passed all 1071 tests; `lykn build && lykn test` passed all 1286. The failures were isolated to doc-tests run by the JS compiler against `docs/guides/` examples.

The 14 failures classified into three classes (Phase 1a triage):

**Class A1 — Factory pattern (6 failures).** Functions of the shape:

```lykn
(func create-logger
  :args (:string prefix)
  :returns :function
  :body (fn (:string message)
    (console:log (template "[" prefix "] " message))))
```

The body ends in a surface `(fn …)` form. The JS compiler rejects this because the `func` macro's DD-50.6 Q2=A check sees `fn` as "a statement-only form which cannot produce a value." But `fn` always expands to a kernel `(=> …)` arrow expression, which IS value-producing. The check is being applied at the wrong layer.

**Class A2 — Try-as-expression (2 failures).** Functions of the shape:

```lykn
(func try-parse-json :args (:string s) :returns :any :body
  (try (JSON:parse s) (catch undefined)))

(func valid-json? :args (:string s) :returns :boolean :body
  (try (block (JSON:parse s) true) (catch false)))
```

Both compilers (Rust and JS) reject these because `try` emits a JS `TryStatement`, which is statement-only — but the function declares it returns a value. The docs assume a feature (value-producing `try`) that the compiler doesn't implement.

**Class B — Intentional-error ICU template blocks (6 failures).** Six blocks in `docs/guides/17-template-and-i18n.md` that demonstrate what compile errors look like (`(template "Hello, {name}!")` etc.) with `;; ERROR:` comments. The doctest framework was treating them as "should compile" tests.

Class B was the easy one: the framework already supports a `compile-fail` annotation; six fence edits closed those. Already shipped.

Classes A1 and A2 are the architectural ones.

---

## The diagnosis: form-classification conflation, cross-impl drift

Phase 1c audited every "form classification" mechanism in both compilers. Headline findings:

**Both compilers conflate two different questions onto a single list.**

The Rust `STATEMENT_FORM_HEADS` (and JS `STATEMENT_ONLY_HEADS`) is used to answer *two* questions:

1. *Does this form emit as a JS statement after expansion?* — used for IIFE-vs-ternary decisions on `if`.
2. *Can this form produce a value as the last expression of a `:returns :T` body?* — used for DD-50.6's Q2=A diagnostic.

These overlap but aren't the same set. `(if …)` with no else answers "yes" to Q1 and "no" to Q2. `return`/`throw`/`break`/`continue` answer "yes" to Q1 but the question is moot for Q2 (control transfers out). `fn` answers "no" to Q1 (compiles to arrow expression) but the JS list nevertheless includes it as if it were statement-only.

The shipped code has two override-patches bolted onto the shared Rust list (an `if` length special-case, a control-flow exclusion list) — symptoms that the list-as-data fits one consumer but not the other.

**The two compilers' lists have drifted out of sync.**

| Form | Rust `STATEMENT_FORM_HEADS` | JS `STATEMENT_ONLY_HEADS` |
|---|---|---|
| `if`, `throw`, `return`, `break`, `continue` | yes | no |
| `fn` | **no** | **yes** |
| (other 19 entries) | yes | yes |

DD-50.6 Q4=A promised "two lists kept in sync via compile-both tests." The tests existed but didn't exercise the surface-vs-kernel boundary (no test covered `(fn …)` or any other surface form that expands to a value-producing kernel form), so the drift was invisible.

**The Rust compiler implements DD-50.6 Q3=C correctly; the JS compiler doesn't.**

Q3=C was decided as "compile-then-check" — *check the post-expansion form's head*, not the surface-form's head. Rust runs the check on `emit_body(...)` output, which is post-expansion (so `fn → =>`, and `=>` isn't in the list → correctly accepts). JS runs the check on the surface form (`fn` is still `fn`, JS list includes `fn` → rejects). The JS implementation took a shortcut that violated the stated design intent.

---

## The doc audit: what's being taught

Phase 2 catalogued where the failing patterns appear across all doc surfaces.

**Class A1 (factory pattern) is canonical across many surfaces:**

- `docs/guides/06-functions-closures.md` ID-09 ("Factory Functions That Return Closures"), strength SHOULD, three instances (create-logger, create-multiplier, create-filter)
- `docs/guides/07-async-concurrency.md` (debounce, throttle)
- `docs/guides/08-performance.md` (memoize, memoize-lru)
- Book Ch 4.3 (Scope) and Ch 7.4 (Closures) — `make-greeter` and `make-counter`, taught as "The Pure Pattern" and "The Stateful Pattern"
- Book Ch 7.3 (fn/lambda) explicitly: *"fn compiles to an arrow function expression"*
- Book Ch 7.7 (Kernel Underneath) table: surface `fn` → kernel `=>`

Five doc surfaces aligned that the pattern is correct + the Rust compiler agrees + DD-50.6 Q3=C agrees. Only the JS compiler dissents.

**Class A2 (try-as-expression) is taught in at least five book chapters:**

- `docs/guides/03-error-handling.md` ID-12 — `try-parse-json`, `valid-json?`
- Book Ch 17.4 (Async error handling) — `safe-fetch` with try → Result pattern
- Book Ch 25.2 (JSON) — `parse-json-safe` returning `(Ok …)` / `(Err …)`
- Book Ch 27.5 (Fetch) — `fetch-json` with try → Result
- Book Ch 37.5 (Routes), Book Ch 38.3 (API) — handler patterns

**But:** Book Ch 9.5 (the canonical try chapter) treats try as kernel-only / statement-only, quote: *"`throw`, `try`, `catch`, `finally` are kernel forms with no surface transformation."* SKILL.md (line 446) agrees with Ch 9.5. So the book is *internally inconsistent* on try-as-expression — five later chapters use it; the canonical chapter denies it exists.

This wasn't a single-doc quirk; it's a pervasive pattern, with a contradiction inside the book itself.

---

## The architectural argument that surfaced

Both A1 and A2 trace to the same root: **surface lykn and kernel lykn share syntactic heads, and the compiler disambiguates by structural/contextual analysis.**

- A1: surface `fn` and kernel `=>` are different forms, but the JS classification check looked at the syntactic head *before* expansion, when it's still `fn`. The check was at the wrong layer because there was no syntactic way to tell "this is a surface form that will expand" vs "this is a kernel form as-is."
- A2: surface `try` (intended to be value-producing per the docs and book Ch 17.4 / 25.2 / 27.5 / 37.5 / 38.3) and kernel `try` (always a JS try-statement) share the syntactic head `(try …)`. No way to disambiguate at the syntactic level. The compiler has to infer "are we in expression position?" and route accordingly — exactly the kind of context-disambiguation logic that has been causing trouble.

This is the same architectural pattern that produced DD-50 / DD-50.5 / DD-50.6 / DD-50.7. Each one was a patch to disambiguate one more case of surface/kernel overlap. Each patch was correct in isolation. The aggregate is the conflation problem we surfaced in Phase 1c.

Book Ch 2.2 ("The Kernel: A Thin Skin over JavaScript") articulates the architectural principle that *should* hold:

> The kernel is *complete*. Any JavaScript program can be written in kernel Lykn. […] The surface language adds safety and ergonomics, but it does not add capability. […] The surface language never needs to invent a new kernel form to support a new feature. `match` compiles to nested `if` statements. `type` compiles to constructor functions. `cell` compiles to `{ value: x }`. **The kernel vocabulary is stable, and the surface innovates on top of it without asking the kernel's permission.**

The principle is sound. The current implementation undermines it by letting surface and kernel share syntactic heads — which means the "surface innovates on top of the kernel" claim has nowhere to manifest *syntactically*. The disambiguation gets buried in the compiler instead of being explicit in the source language.

---

## The i18n unlock — how it changes the priority

While planning the Phase 3 cleanup (workstreams W-1 through W-5 in `project02-language-toolchain-alignment/arc03-compiler-coherence/design/phase-3-synthesis-plan.md`), one workstream — **W-3, the canonical source of truth for form classifications** — needed a design decision: TOML-generated lists (option A), test-fixture verification (B), or just structural tests (C).

I initially recommended option B for 0.6.x as the lowest-tooling-weight path, with A as a 0.7+ aspiration.

Duncan responded that 0.7.0 will introduce native-language readers — users writing lykn in their preferred language. The example he gave:

```lykn
;; lang: ru
(привязка имя "Дункан")
(функция приветствие
  :аргументы (:строка имя)
  :возвращает :строка
  :тело (шаблон "Привет, {имя}!" :имя имя))

(консоль:лог (приветствие имя))
```

Where:
- `привязка` = `bind`
- `функция` = `func`
- `:аргументы` = `:args`
- `:строка` = `:string`
- `:возвращает` = `:returns`
- `:тело` = `:body`
- `шаблон` = `template`

Implementing this requires a canonical, machine-readable enumeration of every form, every keyword clause (`:args`, `:body`, etc.), every type keyword (`:string`, `:number`, etc.), with per-locale translation columns. The 0.6.x parity-discipline work and the 0.7.0 i18n work converge on the same artifact: a canonical form spec file.

This makes option A (lykn-side TOML, code-generated lists) not just "cleanest" but *prerequisite for 0.7.0*. Skipping B and C and going directly to A is strictly forward-load-bearing.

But the form spec file forces a question we hadn't fully reckoned with: **when the catalog declares an entry for `bind`, does that mean surface-`bind`, kernel-`bind`, or both?** Under the current overlapping model the answer is "both, distinguished by a `kind` field." Under separation the answer is "those are different forms with different syntactic heads."

The schema design — and downstream, every translation file in 0.7.0 — looks substantively different in the two worlds.

---

## Why separation first

Three of the four cleanup workstreams I had planned (W-1 JS Q3=C, W-2 position-aware surface `try`, W-3 form catalog) bake in current-overlap assumptions:

- **W-1**: the whole architectural point of Q3=C is *compile-then-check on the post-expansion form*. That's a workaround for "surface and kernel share syntactic heads, so we have to look at the post-expansion form to discriminate." Under separation, surface forms and kernel forms have distinct heads from the lexer's perspective; the discrimination is syntactic, not structural. The Q3=C machinery becomes unnecessary in its current shape.
- **W-2**: "surface `try` becomes value-producing while kernel `try` stays statement-only" is *literally the separation* applied to one form. Doing W-2 under the overlapping model means writing more context-disambiguation logic ("is this `try` the surface one or the kernel one based on its position?"). Doing W-2 post-separation means surface `try` and kernel `try` are syntactically distinct; the IIFE-wrap logic only ever runs on the surface form. Much cleaner.
- **W-3 (DD-56)**: my schema sketch has `kind = "surface"` and `kind = "kernel"` entries with the *same form name* (`try` appears twice). That representation only makes sense under the overlapping model. Under separation, the kernel entries have different syntactic identifiers (whatever the chosen kernel-call syntax produces) and the catalog's structure changes.

Proceeding with these workstreams now would mean writing code and design docs that need substantial reframing post-separation. Better to do the separation first and rewrite the prescriptive pieces against the clean foundation.

**What survives the separation:**

- Phase 1a triage — the 14 failing tests are real regardless
- Phase 1c audit — the conflation analysis is an honest description of the current overlapping state; useful as historical record and as part of the case for separation
- Phase 2 catalog + book addendum — doc divergences are real regardless of separation; the docs need to be aligned with whatever final state we choose
- The Phase 3 D-2 call — Duncan affirmed that surface `try` should be value-producing (Lisp/Haskell/Rust family alignment). That language-design call is valid regardless of separation; separation just makes it cleaner to implement.

**What needs reframing post-separation:**

- Phase 3 synthesis plan §W-1, §W-2, §W-3
- DD-56 schema (the form catalog)
- The eventual CC implementation prompts

---

## Concrete use cases for the separation thread

When you design the new kernel-call syntax (the "two proposed syntaxes" Duncan mentioned was part of the 0.6.0 plan), here are concrete scenarios the design needs to handle cleanly:

### 1. The factory pattern (A1)

```lykn
(func create-logger
  :args (:string prefix)
  :returns :function
  :body (fn (:string message)
    (console:log (template "[" prefix "] " message))))
```

Under current state: `func` macro classifies `fn` as the last body expression — confused about whether it's surface-fn (will expand to value-producing `=>`) or kernel-fn (which doesn't exist as a kernel form, but the JS list includes `fn` defensively).

Post-separation: there should be no ambiguity. Surface `fn` is unambiguously surface; it expands to its kernel form before classification matters. Question for the design: does the separation eliminate this kind of "look at the form *before* expansion" check entirely, or just make it well-defined?

### 2. The position-aware `try` (A2)

```lykn
;; Should produce value (book Ch 17.4 + 25.2 etc., docs/guides/03-error-handling.md ID-12)
(func safe-fetch
  :args (:string url)
  :body
  (try
    (bind response (await (fetch url)))
    (Ok (await (response:json)))
    (catch e
      (Err e:message))))

;; vs:

;; Pure statement-form try (book Ch 9.5, statement-position usage)
(try
  (await (cleanup-task))
  (catch e (log-error e)))
```

Under current state: same syntactic head `(try …)`, different intended semantics, compiler has to disambiguate by position.

Post-separation: surface `try` is one form with consistent value-producing semantics (IIFE-wrap when not at top-level statement position). Kernel `try` is a different syntactic form (per whatever kernel-call syntax wins) that always emits as JS try-statement. Question for the design: what does a user write when they explicitly want the kernel form? Most surface lykn never needs the kernel form directly — but advanced JS-interop cases will.

### 3. The `throw` form

```lykn
(throw (new Error "something went wrong"))
```

This is treated as `MUST always be kernel-direct` per SKILL.md (line 446-447) — there's no surface wrapping. But it shares its syntactic head with `(throw …)` as it might appear elsewhere. Under separation, where does `throw` live? Is there a surface `throw` that adds anything (type check on the thrown value?), or is `throw` always kernel?

This generalizes: which forms are "surface only," "kernel only," and "both"? The separation design probably needs to enumerate this. The form catalog (DD-56's eventual descendant) is the natural place to declare it.

### 4. The kernel-call syntax choice

Several plausible shapes for the new kernel-call syntax — these are what I imagine; you'll consider others:

- **Namespace prefix on kernel calls:** `(kernel:if cond then else)`, `(kernel:try body catch)`. Surface forms stay unprefixed. Consistent with the existing `js:` namespace pattern for JS interop.
- **Special enclosing form:** `(kernel (if cond then else))` — explicit "drop to kernel" form. Bigger syntactic weight; harder to nest.
- **Reader macro:** `#kernel(if cond then else)` or `#k(if ...)`. Reader-level distinction. Compact.
- **Inverse:** kernel forms stay bare; surface forms get a marker. `(surface:if ...)` for surface, `(if ...)` is kernel. Probably wrong because surface is the user-facing language; should be unmarked.

Whatever the choice, the i18n implications need to be considered: when a user writes `(привязка …)` in Russian-flavored lykn, that's the surface form. Is there a Russian-flavored *kernel* form too, or do kernel forms stay in their canonical (English? Mathematical?) representation? My guess from Duncan's framing is that kernel stays language-neutral / English-canonical because the kernel is "the thin skin over JS," and JS itself isn't translatable — but worth confirming.

### 5. The form catalog's place after separation

The 0.7.0 form catalog needs to declare:

- Every surface form, with classification flags and per-locale translation hooks.
- Every kernel form, with classification flags but *no* translation hooks (probably).
- The surface↔kernel mapping (e.g., surface `fn` → kernel `=>`; surface `match` → kernel `if`-chain).

The catalog schema's shape depends heavily on the separation design. If the separation makes surface and kernel namespaces fully disjoint, the catalog has two clean sections. If there's any sharing of syntactic identifiers (which would be a design choice), the catalog has to encode the sharing explicitly.

---

## State of the in-flight work

**Shipped:**
- W-4d (the six fence edits in `17-template-and-i18n.md`). Closed Class B; 6 of 14 doctest failures gone. Zero compiler change; zero architecture impact.

**Drafted but paused pending separation:**
- DD-56 (canonical form spec): `project02-language-toolchain-alignment/arc02-type-dts-generation/design/dd-56-canonical-form-spec-DRAFT.md` — schema sketch in §"Schema sketch" needs reframing post-separation.
- W-1, W-2 implementation prompts: not yet written, intentionally paused.

**Diagnostic artifacts (still useful regardless of separation):**
- Phase 1a triage: `project02-language-toolchain-alignment/arc03-compiler-coherence/design/phase-1a-test-failure-triage.md`
- Phase 1c audit: `project02-language-toolchain-alignment/arc03-compiler-coherence/design/phase-1c-classification-audit.md`
- Phase 2 main catalog: `project02-language-toolchain-alignment/arc03-compiler-coherence/design/phase-2-divergence-catalog.md`
- Phase 2 book addendum: `~/lab/cnbb/lykn/workbench/phase-2-book-addendum-2026-05-14.md`
- Phase 3 synthesis plan: `project02-language-toolchain-alignment/arc03-compiler-coherence/design/phase-3-synthesis-plan.md` (prescriptive parts need rewriting post-separation)

**Open Phase 3 language-design calls already settled (still valid):**
- D-1 (factory pattern): JS-side fix. Direction confirmed.
- D-2 (try-as-expression): D-2.γ — surface `try` becomes value-producing. Lisp/Haskell/Rust family alignment.
- D-3 (intentional-error blocks): doc-only fix via `,compile-fail` annotation. Already shipped.

---

## Recommended sequence after separation lands

1. Separation thread produces a settled DD on the kernel-call syntax.
2. Surface forms and kernel forms become syntactically distinct in the compiler.
3. We return to the cdc/dep-ergonomics thread and rewrite DD-56's schema against the separated model.
4. W-1 (JS-side classification fix): re-scope against the cleaner architecture. The Q3=C compile-then-check probably becomes "just check the syntactic head" — much simpler.
5. W-2 (surface `try` as value-producing): implement against the clean syntactic distinction. No context-disambiguation needed.
6. W-4a/b/c (prose updates): update the book Ch 9.5, SKILL.md, and the error-handling guide to reflect the separated model with surface `try` as position-aware.
7. W-5 (methodology): document the discipline that prevented Q4=A from holding in DD-50.6, and what changed.

The separation is the foundational piece. Everything else slots in afterward.

---

## A note on heritage

Duncan has been steering the language toward the Lisp/Haskell/Rust family on key questions (try-as-expression being the most recent). The separation is *also* in that lineage: every serious Lisp dialect since R6RS has had a clear answer to "what counts as a primitive vs what's surface-macro sugar." Common Lisp has its package system; Scheme has hygienic macros that draw the line explicitly; Clojure has its bootstrap distinction. None of them ship a "surface and kernel share heads, disambiguated by context" model — because everyone who's tried it has hit exactly the kind of bugs we've been triaging here.

Doing the separation now puts lykn in good company. The 0.7.0 i18n work makes the catalog mandatory anyway. The cleanup work benefits from a clean foundation. The pieces line up — the order is what matters.

Good luck.
