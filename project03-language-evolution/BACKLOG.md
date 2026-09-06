# docs/design-v0.7.0 — Candidate Backlog (consolidated register)

> **The single watched place for everything we want to work on in 0.7.0+.**
> This is a *candidate register*, not a `project-plan.md` — the 0.7.0 project
> definition is still deliberately deferred (*plan late, plan deep*; see
> `README.md`). Its job is the one the operator named: **don't lose track.**
> Every row has a **source** and a **re-entry condition**; nothing here is
> silently dropped. Dispositions marked *(operator decides)* are the release
> boundaries — 0.7.0 vs 0.8.0+ — that are Duncan's call at 0.7.0 planning.
>
> **Consolidated 2026-07-22** from four scattered sources: the 0.6.0
> `project-plan.md` §1 "Post-0.6.0 tracked candidates"; the two research units
> already in this tree; the arc14 seed in the 0.6.0 tree; and CDC memory-only
> items. Two net-new items (full i18n, build-tooling) were added from the
> operator's 2026-07-22 direction.

## How this list stays honest

- **Source** — where the item came from, so it can be traced back.
- **Re-entry** — the condition that makes the item actionable (what has to be
  true, or what touches it next).
- **Disposition** — provisional release target. *(operator decides)* means the
  0.7.0-vs-later boundary is unset and is Duncan's at planning time.
- When **arc06 slice02** (the mycelium re-audit, host-run by CC now) closes, its
  routing table will add any new *post-0.6.0* rows here — this register is the
  named home for them (anti-silent-drop, per the arc11 buried-intent discipline).

---

## A. Big-rock candidate arcs (each likely a multi-slice arc, some version-spanning)

### A1 · Language build tooling — batteries-included *(NEW 2026-07-22; first part → 0.7.0)*

**Capability.** `lykn` is the *only* tool a lykn project needs — no separate
build tool. The bar is the best build tooling the operator has used: Clojure's
**lein**, Erlang/LFE's **rebar3**, and Rust's **cargo + rustup**.

**Method (the operator's brief).** A full feature-set survey of all four
tools → assemble the **superset** of their capabilities → for each superset
feature, identify (a) anything **lein / rebar3** have that **cargo** lacks, and
(b) whether lykn should **implement** it natively or **wrap** an existing tool.
Cargo is the primary model; the point of surveying lein/rebar3 is to catch what
cargo *doesn't* cover. From the superset + implement/wrap calls, stand up a
**version-spanning `build-tool` project** and split it across releases (what
lands in 0.7.0, what pushes to 0.8.0, …).

**Re-entry.** Open a step-1 research unit **`03-build-tooling-survey/`** in this
tree (mirrors `01-treeshake-audit` / `02-packaging-strategy`): the survey +
superset + implement-vs-wrap matrix is its deliverable, and it feeds the
version-spanning project definition. **This register captures the intent; the
survey unit is the next thing to scope** (CDC can draft its slice-doc +
cc-prompt on request).

**Disposition.** First part **0.7.0** (operator); the full build-tool project
spans 0.7.0 → 0.8.0+ *(operator decides the split, informed by the survey)*.

**Adjacency.** `02-packaging-strategy` (distribution) and `01-treeshake-audit`
(build output) are downstream of a batteries-included build tool; `lykn add`
(arc06, 0.6.0) is its first dependency-management primitive.

#### A1.1 · Dependency version management — Mix/rebar3-style `~>` *(research + decision, 2026-07-22)*

**Origin.** The DD-63 (`lykn add`) version-pinning question. Operator prefers the
Elixir/Mix–Hex `~>` version scheme that rebar3 adopted (most of the LFE
community moved to it); wanted to know if Rust gives it "for free."

**Decision — the split (operator-approved 2026-07-22):**
- **0.6.0 / DD-63 (`lykn add`):** resolve the package and **pin an exact
  version** in the specifier (`jsr:@lykn/lang@0.6.0`). That alone closes the
  unpinned-scaffold hole (the scaffold writes `jsr:@lykn/lang/` — no version).
  Minimal, correct, unblocks downstream. Use the npm-semver engine (below) so
  it is already npm-correct.
- **0.7.0 / build-tool arc:** the **`~>` requirement DSL + `lykn update` +
  lykn-owned version management** — the deep tooling work. This is where the
  Mix/rebar3 ergonomics land, informed by the survey.

**Why the deep work belongs here (the constraint that shapes it).** lykn deps
are `jsr:`/`npm:` specifiers **resolved by Deno**, and Deno's version semantics
are **npm's, not cargo's**. Consequences:
- *"Cargo directly" is out* — cargo only resolves crates.io via its own
  resolver; it cannot touch JSR/npm.
- *Cargo's `semver` crate is the **wrong** free lunch* — excellent, but cargo's
  range/pre-release semantics differ subtly from npm's; lykn computing "latest
  matching" with cargo semantics could disagree with what Deno resolves at build
  time. The correct free engine is an **npm-semantics Rust crate**:
  [`nodejs-semver`](https://crates.io/crates/nodejs-semver) (node-semver
  compliant) or [`node-semver`](https://docs.rs/node-semver). Those give the
  edge-case-heavy engine — parse, precedence, pre-release ordering, "does X
  satisfy R", "latest of {published} satisfying R" — matching Deno's world.
- *Deno's **specifier** range support is partial/evolving*
  ([denoland/deno#28852](https://github.com/denoland/deno/issues/28852)): `>=`,
  multi-major spans, and `||` are rejected in specifiers today (caret-within-a-
  major works — mycelium's `npm:astring@^1.9.0` resolves). This pushes toward
  **resolve-the-requirement-and-store-exact** (Deno always accepts an exact
  version) rather than storing a live range Deno might reject.

**What's free vs. what lykn builds:**
- **Free (npm-semver Rust crate):** the whole comparison/satisfaction engine —
  the "excellent code + wide tests" part. Adopt, don't write.
- **Custom (small, but the wide-tests piece):** the `~>` → range translation.
  Hex/Mix rules ([Elixir `Version`](https://hexdocs.pm/elixir/Version.html)):
  `~> 2.1.3` = `>= 2.1.3 and < 2.2.0` (patch only); `~> 2.1` = `>= 2.1.0 and
  < 3.0.0` (minor+patch) — the dot-part count sets the ceiling. No mainstream
  Rust crate implements Hex ranges, so this thin layer is lykn-owned and is
  exactly where the edge-case test suite goes.

**Architecture (target).** Mix `~>` as the `lykn add`/manifest surface →
translate to a resolved **exact** version for the Deno-facing specifier + lock →
`lykn update` re-resolves against the recorded `~>` requirement. lykn **owns the
version story** (the rebar3 model — the build tool owns dependency version
management rather than deferring to the runtime resolver), which is coherent
with DD-51 (lykn owns the workflow; projects don't reach around to Deno) and
immune to Deno's range-support gaps (you always hand Deno an exact version).

**Feeds:** DD-63 (0.6.0 pin-exact decision recorded); the `03-build-tooling-
survey` unit (dependency version management is a first-class survey axis —
compare lein/rebar3-Hex/cargo/npm version schemes); the build-tool arc's own
version-management slice. Engine pick (`nodejs-semver`) is a survey validation
item, not yet locked.

### A2 · Full i18n / Unicode source support *(NEW 2026-07-22)*

**Capability.** First-class non-ASCII in lykn — Chinese, Cyrillic, and beyond:
Unicode **identifiers** (reader + the codegen name-mangler, which today assumes
ASCII → JS-identifier rules), string/format handling, and whatever the surface
and both backends need to treat non-ASCII source as a first-class citizen.

**Source / first step.** The 0.6.0 `template` → ICU MessageFormat work
(**arc08 / DD-55**) was step one — MessageFormat i18n in the `template` macro.
"Full i18n" is the broader effort that step pointed at.

**Re-entry.** Wants a design/research unit to scope the surface: which Unicode
identifier rules (e.g. UAX-31), how the `codegen/names.rs` mangler maps
non-ASCII → valid JS identifiers, reader lexing, and test corpus. Not yet
scoped.

**Disposition.** *(operator decides)* — candidate for 0.7.0.

### A3 · Comment retention & provenance — **arc14 / DD-62** *(release boundary 0.7.0, operator-decided 2026-07-21)*

**Capability.** The compiler retains comments through the pipeline instead of
dropping them at the reader. Three DD-62 commitments: (1) opt-in reader
retention on both backends; (2) surface→kernel **provenance** tagging
(surface-authored comments flagged as possibly-stale beside transformed code);
(3) strip-or-preserve **only** at JS emission (default strip; opt-in preserve
with provenance annotation). Flagship payoff: honest, readable JS. Immediate
payoff: **inline `lykn lint` suppression** (arc05's deferred mechanism).

**Source.** arc05/slice04 deferred the lint-suppression mechanism here; seeded
as arc14 in the 0.6.0 tree; release boundary 0.7.0.

**Re-entry.** Already seeded (`project02-language-toolchain-alignment/arc14-comment-retention/`,
`design/dd-62-comment-retention-DRAFT.md`). Activate + slice-plan when 0.7.0
opens; the open DD-62 §5 question (comment attach model) resolves first.
Consumes arc13's node-metadata pattern.

**Disposition.** **0.7.0** (decided). *When 0.7.0 planning starts, arc14's home
should migrate from the 0.6.0 tree into this one.*

### A4 · Tree-shakeable compiled output — **`01-treeshake-audit`** (research open)

**Capability (candidate).** App bundling / tree-shaken output — making
compiled lykn dead-code-eliminate cleanly under esbuild/rollup.

**Source / status.** Step-1 research unit already in this tree: diagnostic
audit of tree-shakeability across both emission paths (Rust codegen vs
`bridge.rs` → JS compiler), fixtures, an esbuild experiment, and dist metadata.
Memory flags `sideEffects` absent from `dist.rs`. **Open.**

**Re-entry.** The audit report defines the candidate arc's scope.
**Disposition.** *(operator decides)* — informed by the audit.

### A5 · Packaging & distribution — **`02-packaging-strategy`** (research open)

**Capability (candidate).** Release engineering: Homebrew (custom tap) and
Debian (self-hosted APT repo) packaging, given lykn's Rust build + Deno runtime
dependency.

**Source / status.** Step-1 research unit already in this tree. **Open.**
**Re-entry.** The strategy report defines the candidate arc's scope.
**Disposition.** *(operator decides)* — pairs naturally with arc09 release work
and with A1 (build tooling).

### A6 · Fully-typed classification — recursive typed AST *(NEW 2026-07-22; research; origin arc15 slice03)*

**Capability (candidate).** Make `classify` produce a **fully-typed recursive
tree** — every nested expression a classified node with its own type — instead
of the current hybrid where `SurfaceForm` variants hold **raw `SExpr` children**
(`Bind.value`, `Match.target`, `MatchClause.guard`/`.body`, `FuncClause.body`,
`FunctionCall.head`/`.args`, … are `SExpr`, lowered lazily by the emitter).
Analysis passes would then match on **types**, not on raw surface shape.

**Origin — the constraint that forces it (arc15 slice03).** The method-on-
expression trap (`((express p):join "")` → silent miscompile) is a **raw-shape
collision**: a guarded match clause `((Some v) :when …)` and the trap have the
**identical** raw shape (List/Cons head + Keyword arg0). `classify_match`
dissolves the collision by consuming `:when` into a typed
`MatchClause { pattern, guard, body }` — **but only for top-level matches.**
A match nested in `Bind.value` or a `FuncClause.body` stays **raw `SExpr`**, so
its clauses keep the trap shape (proven against `data-types.lykn:54–59` +
a minimal repro that compiles clean today). **Match-awareness is therefore
irreducible without typing the nested exprs** — which is exactly this arc.
slice03 landed **Option B** (recursive raw-shape walk with a parent-aware
`is_match_clause`/`ptr::eq` skip) as the verified-correct 0.6.0 guarantee; the
`ptr::eq` borrow-identity check is a maintainability sharp-edge, not a bug.
**This entry is slice03's deferred Option C.**

**Research question.** What does it cost, and what does it buy, to make
classification recursive and total — so that a nested `match` (or any nested
form) is a **typed node** at classification time rather than raw `SExpr` the
emitter lowers later? The deliverable is a **cost/benefit + architecture-
direction report**, not an implementation.

**Impact — what it dissolves and enables (benefit).**
- **Retires the whole raw-shape-collision class**, not just the one trap:
  method-on-expression, `:when` disambiguation, and any future analysis that
  today must special-case surface shape all become **exhaustive `match` on
  typed variants** — completeness compiler-enforced (no `_ =>`), no
  `ptr::eq`/parent-identity carve-outs anywhere.
- **Type-safe analysis passes** generally: lint checks, future optimizations,
  and provenance/metadata passes operate on a stable typed tree instead of
  re-deriving structure from `SExpr` heuristics.
- **Removes the slice03 B sharp-edge** (the `ptr::eq` borrow invariant) at the
  root rather than fencing it.

**Cost / risk.**
- **Large, central rewrite.** Every `SurfaceForm` variant that currently holds
  `SExpr` children gains typed children; the classifier grows recursive-descent
  for all nested positions (this is the bulk of the work and the wide-test
  surface).
- **Emitter + analyzer adaptation.** The emitter currently **lowers raw `SExpr`
  lazily**; it would consume typed nodes instead — a coordinated change across
  codegen (Rust) and the analyzer, with the JS compiler (`packages/lang`) to
  keep in parity.
- **High blast radius, high regression risk.** Touches the pipeline core
  (reader → expander → resolver → **classifier** → analyzer → emitter →
  codegen); needs a full-corpus parity gate. **Likely 0.8.0+**, not a single
  0.7.0 slice — a version-spanning effort in its own right.

**Compiler/checker future directions to settle in the research.**
- **Scope of typing** — type *all* nested exprs, or only the collision-prone
  positions (matches, method receivers)? Full typing is cleaner but larger;
  targeted typing is cheaper but keeps a raw/typed boundary.
- **Two-compiler parity** — does the JS `packages/lang` classifier mirror the
  Rust one, or does one lead? (DD-era divergence risk.)
- **Interaction with A3 (arc14 comment retention / node-metadata)** and A1
  (build tooling) — a typed tree is the natural carrier for provenance metadata;
  sequencing matters.
- **Migration path** — incremental (variant-by-variant, raw-fallback during
  transition) vs. big-bang; how the parity corpus gates each step.

**Re-entry.** Open a research unit (mirrors `01-treeshake-audit` /
`02-packaging-strategy`) — **`04-typed-classification/`** — whose deliverable is
the impact + cost/benefit + implement-plan report. CDC can draft its slice-doc +
cc-prompt on request. **Cross-ref: `docs/design-v0.6.0/arc15-surface-syntax-
traps/` slice03 (DEFERRED — Option B retained for 0.6.0; this is its Option C).**

**Disposition.** *(operator decides)* — research is a 0.7.0 candidate; the
implementation is **likely 0.8.0+** (version-spanning), informed by the report.

---

### A7 · `as->` — the general threading form *(NEW 2026-07-25; origin `03-threading-macros`)*

**Capability.** Add `as->` (and, for symmetry, consider `some-as->`): a
threading macro that binds the threaded value to a **named placeholder** so each
step can put it in *any* position.

```lisp
(as-> data $
  (crypto:subtle:digest "SHA-256" $)     ;; datum last
  (Reflect:set target :digest $)         ;; datum in the MIDDLE — no spelling today
  (Deno:write-text-file "out.bin" $))    ;; datum last
```

**Why this, and why now.** The `03-threading-macros` survey censused the entire
observable ECMAScript 2025 built-in library (489 callables) plus the host surface
(214 more) and classified every one by where its primary datum sits. Results:

- **48** ES2025 callables actually discriminate between `->` and `->>`
  (required arity ≥ 2). The split is **37 datum-first : 2 datum-last** — and the
  two datum-last are `BigInt.asIntN` / `asUintN`.
- The host tier adds **71** discriminating callables at **27 : 18**, where the
  datum-last set is two coherent families (WebCrypto configured operators; keyed
  sinks like `Deno.writeTextFile`, `Headers.set`, `localStorage.setItem`).
- **6** host signatures are datum-**middle** (`SubtleCrypto.importKey`,
  `wrapKey`, `unwrapKey`, `deriveKey`, `deriveBits`) and **17** are callback-last.
  **None of these has any spelling in lykn today.**

So the surface budget argument is: a second *dedicated* macro (`->>`) serves 2
core built-ins, while **one general form serves datum-last, datum-middle, and
operator-receiver together** — and gives the reader an escape hatch for every
signature the survey classified `PEER`, `D-MID` or `F-LAST`.

**It also currently mis-compiles, silently.** `(as-> x $ (f $ 1) (g 2 $))`
compiles clean — no diagnostic — to `asTo(x, $, f($, 1), g(2, $));`, a call to an
undefined `asTo` (the `->` → `To` rule at `compiler.js:405` rewriting an
unrecognised head), plus an undefined `$`. `ReferenceError` at runtime. So the
choice is not *add a feature* vs *do nothing*; it is *add it* vs *leave a
Clojure-shaped trap that compiles*.

**Scope sketch.** Additive, both compilers, mirrors the DD-18 / DD-18.1 pattern:
a `classifier.js` head + `AsThread` surface node, expansion to nested `const`
bindings (or an IIFE, as `some->` already does), the parallel Rust
`emitter/forms.rs` arm, cross-compiler tests, and a guides section. DD-18.1's
keyword-step rule should apply unchanged, so `(:method …)` steps keep working.
Interaction to decide: whether the placeholder is user-named (Clojure) or a
fixed sigil.

**Source:** `project03-language-evolution/slice03-threading-macros/` — `inventory.md` §5–§7
(recommendation R2), ledger rows R-7 and R-8. Discovery row `D-2607-3KTP`.

**Re-entry:** the pending language-design conversation on threading macros — the
same one that owns `D-2607-K9RT`'s disposition. `as->` and the
collection-prelude question should be decided together, since the survey's
recommendation is *ship `as->`, don't ship a datum-last prelude* and the two
arguments share a premise.

**Disposition:** *(operator decides)* — the survey argues 0.7.0; it is small,
additive, and closes a silent trap.

---

## B. Routed items from the 0.6.0 buried-intent audit (project-plan §1)

Each was surfaced and dispositioned by the arc11 buried-intent audit; carried
here so "routed" never becomes "re-buried."

| Item | What / why | Source | Re-entry | Disposition |
|------|-----------|--------|----------|-------------|
| **`set-symbol!` deprecation** | Breaking. Live surface form — the only spelling for computed-key assignment (1 guide + 2 tests). Deprecate per original intent, or keep? | arc11/slice02 F-4 | Decide at 0.7.0 planning | *(operator decides)* |
| **`genfunc` multi-clause** | Rust emitter silently emits only the first clause (matches JS). A compiler feature. | arc11/slice02 N1 | When multi-clause generators are needed | 0.7.x |
| **ICU error-position → Span** | ICU error positions not attributed to source Spans (`icu.rs:696`). | arc11/slice02 #2 | When ICU/i18n area is next touched — **folds into A2** | with A2 |
| **Reader block-comment stub cleanup** | `parser.rs:308–310` stub. | arc11/slice02 N2 | When comment handling is touched — **folds into A3 (arc14)** | with A3 |
| **Doctest nested-fence scanner** | `doctest.rs:1138`. | arc11/slice02 N3 | When doctest is next touched | *(operator decides)* |
| **Nested-destructure completeness** | `emitter/forms.rs:2074`. | arc11/slice02 N4 | When destructuring is extended | *(operator decides)* |
| **Downstream mycelium DD-58 migration** | Bare kernel forms in mycelium break under a strict consumer. | arc10 | **arc06 slice02 re-audit will re-confirm/route this** (host-run now) | 0.7.0 candidate |
| **Batch-compile the test corpus** | `compile_lykn_test_files` spawns ~97 per-file `deno eval`s; batching into one Deno process is the next big verification speed win. | arc12/slice01 | When verification perf is next prioritized | 0.7.x |
| **Toolchain hardening trio** | (a) stray-sibling double-run guard (`lykn test` runs `test/`'s hand-written `*.test.js` explicitly + corpus only from `target/`); (b) freshness-guard scoped to `src/` (newer `tests/*.rs` false-positives); (c) `--compile-only`+`--docs` honored by `run_doc_tests`. | arc12/slice01 | When the CLI is next touched — **relevant to A1** | 0.7.x |

---

## C. Memory-only items now promoted into this register

These lived only in CDC memory (the "lose track" risk the operator named).

| Item | What | Source (memory) | Re-entry | Disposition |
|------|------|-----------------|----------|-------------|
| **GitHub Linguist submission** | Register lykn with GitHub Linguist so `.lykn` highlights and lykn code blocks use ` ```lykn ` instead of ` ```lisp `. | `lykn_linguist_deferred.md` | Needs a stable public grammar + enough public lykn on GitHub | 0.7.0+ |
| **Subprocess in-memory module loading** | Phase-3 alternative to DD-54's disk-materialization: rewrite the `env.rs` subprocess to import via `data:` / Blob URLs. Perf/cleanliness of the macro-expansion subprocess. | `subprocess_inmemory_loading.md` | When macro-subprocess perf or the DD-54 approach is revisited | *(operator decides)* |
| **Lykn Book multi-edition versioning** | Permanent `/vX.Y/` URLs, shared images, "Book Versions" ToC. **Lives in the `~/lab/cnbb/lykn` repo — tracked as its own project, not a lang arc.** | `lykn_book_versioning.md` | Cross-reference only; owned by the Book project | external (cross-ref) |

---

## D. Provenance & maintenance

- **Not a `project-plan.md`.** When the 0.7.0 project is defined, write
  `project-plan.md` from this register + the research-unit reports; arc14
  migrates in from the 0.6.0 tree at that point.
- **Feeders still open:** arc06 slice02 (mycelium re-audit, host-run) will add
  routed post-0.6.0 rows; arc07 (0.6.0 docs) may surface guide-drift items that
  belong here.
- **Owner of dispositions:** the *(operator decides)* release boundaries are
  Duncan's at 0.7.0 planning; CDC's role is to keep the list complete and each
  row traceable, not to set the boundaries.
