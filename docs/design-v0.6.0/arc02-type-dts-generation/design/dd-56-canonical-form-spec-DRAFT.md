# DD-56 — Canonical Form Specification and Language Catalog

**Status:** Draft (CDC, 2026-05-14) — pending Duncan's calls on Q1–Q8.
**Origin:** Phase 3 W-3 (per `workbench/phase-3-synthesis-plan-2026-05-14.md`), reframed once Duncan revealed the 0.7.0 i18n surface-language work.
**Closes:** D-4 (cross-compiler list drift), D-6 (architectural parity), and establishes the foundation for 0.7.0 i18n.

---

## Context

Two convergent needs surface a shared underlying gap:

**0.6.x (immediate, surfaced by Phase 1c audit):**

The form-classification machinery in both lykn compilers maintains parallel hand-maintained lists — `STATEMENT_FORM_HEADS` in Rust (`crates/lykn-lang/src/emitter/forms.rs:2567`) and `STATEMENT_ONLY_HEADS` in JS (`packages/lang/surface.js:902`). The lists have drifted out of sync (Rust missing `fn`; JS missing control-flow heads). DD-50.6's Q4=A invariant ("two lists kept in sync via compile-both tests") is not held in practice. The drift caused D-1 (factory-pattern doctest failures) to ship undetected.

**0.7.0 (planned, revealed during Phase 3 synthesis):**

Native-language readers of other scripts will let users write lykn in their preferred language. Example:

```lykn
;; lang: ru
(привязка имя "Дункан")
(функция приветствие
  :аргументы (:строка имя)
  :возвращает :строка
  :тело (шаблон "Привет, {имя}!" :имя имя))

(консоль:лог (приветствие имя))
```

This requires a canonical, machine-readable enumeration of every form, keyword clause, type keyword, and (eventually) reserved word, with per-locale translations as additional columns.

**Both needs converge on a single canonical form specification file.** Solving the 0.6.x parity-discipline problem also produces the foundation for 0.7.0 i18n. Option A in the Phase 3 W-3 sub-call wasn't just "the cleanest end state for 0.6.x" — it's a 0.7.0 prerequisite. Skipping B and C and going directly to A is therefore strictly forward-load-bearing, not premature.

---

## Goals

1. **Single source of truth** for every lykn form — surface, kernel, operator alike.
2. **Per-form semantic flags** answering the classification questions identified in Phase 1c:
   - **Q-emit**: after full kernel expansion, does this form emit as a JS statement (vs expression)?
   - **Q-value**: as the last expression of a `:returns :T` body, can this form produce a value?
   - **Q-transfer**: is this a control-transfer form (`return`/`throw`/`break`/`continue`) whose value-producing-ness is moot because control leaves the scope?
   - **Q-child**: for parent forms, what `ExprContext` does each child position inherit? (Relevant primarily to kernel forms; surface forms expand before this question matters.)
3. **Forward-compatible i18n hooks**: schema reserves space for per-locale translation columns. Empty in 0.6.x; populated per locale in 0.7.0+.
4. **Build-system integration**: both Rust and JS compilers consume the same catalog to generate their classification lists. Hand-maintained `STATEMENT_FORM_HEADS` / `STATEMENT_ONLY_HEADS` are removed.
5. **Drift is structurally impossible** — if both compilers consume the catalog via codegen, they cannot disagree. If they could disagree (e.g., the codegen step is skipped), a cross-compiler test fails CI loudly.

---

## Design questions

Each question lists options, then a proposed default. Duncan: confirm or amend each.

### Q1 — File format

| Option | Pros | Cons |
|---|---|---|
| **A. TOML** | Rust-ecosystem default; `[[forms]]` array-of-tables maps cleanly to per-form records; Serde support; allows inline comments | Per-locale nested tables get verbose |
| **B. YAML** | Cleaner nested structure for translations | Mixed parser-quality story; whitespace-significant |
| **C. JSON** | Simplest parse story | No comments; less human-friendly to hand-edit |
| **D. RON / KDL / etc.** | Niche options | Smaller ecosystem; tooling gaps |

**Proposed default: A (TOML).** Matches the workspace's existing config posture (`Cargo.toml`); supports `[[forms]]` array-of-tables; the inline-comment story is valuable for documenting why a form has a particular classification.

### Q2 — File location

| Option | Pros | Cons |
|---|---|---|
| **A. `crates/lykn-lang/forms.toml`** | Beside the canonical Rust impl | Implies Rust-side ownership; JS reads from "another crate's territory" |
| **B. `assets/forms.toml`** | Beside other AI/skill assets | "assets" framing undersells the file's authority |
| **C. `forms.toml` (repo root)** | First-class language spec; beside `Cargo.toml` / `project.json` | Repo root gets crowded |
| **D. `spec/forms.toml`** | New top-level "spec/" directory; explicit "this is the language spec"; allows `spec/translations/<locale>.toml` siblings | One more top-level directory |

**Proposed default: D (`spec/forms.toml`).** First-class status reflects authority. Allows `spec/translations/ru.toml`, `spec/translations/ja.toml`, etc. as siblings in 0.7.0. Discoverable for new contributors. The naming aligns with how language specifications are framed in other communities ("the Rust language spec," "the ECMAScript spec").

### Q3 — Schema scope

| Option | Pros | Cons |
|---|---|---|
| **A. Surface forms only** (`bind`, `func`, `fn`, `match`, …) | Smaller initial scope | Q-emit and Q-value span both layers; half-coverage leaves drift partially unsolved |
| **B. Surface + kernel** (every form, distinguished by `kind` field) | Complete coverage; classification questions answered uniformly | More entries to write initially |

**Proposed default: B.** Both compilers need to classify both kinds. Phase 1c's analysis showed the conflation problem exists at both layers. Half-coverage means we'd still need a parallel kernel-side list.

### Q4 — Canonical naming

| Option | Pros | Cons |
|---|---|---|
| **A. English form names are canonical IDs** | Pragmatic; preserves the existing compiler internal representation; matches how Excel / OpenOffice / etc. handle multilingual function names | Privileges English |
| **B. Abstract numeric IDs as canonical** (e.g., `form-001`, `form-002`); every language including English is a translation | Truly language-neutral | Requires touching every line of the compiler that references a form name; readability collapses |

**Proposed default: A.** Internal AST node names stay English (`Bind`, `Func`, etc.). Translation happens at the reader/lexer layer in 0.7.0. The pragmatic choice; matches every other multilingual programming language's architecture.

### Q5 — What gets translated in 0.7.0

| Category | In catalog & translated? | Notes |
|---|---|---|
| Surface form names (`bind`, `func`, `fn`, …) | **Yes** | Core scope |
| Keyword clauses (`:args`, `:body`, `:returns`, `:pre`, `:post`, `:yields`) | **Yes** | Core scope |
| Type keywords (`:string`, `:number`, `:boolean`, `:any`, …) | **Yes** | Core scope |
| Kernel form names (`function`, `const`, `=>`, `if`, `try`) | In catalog, **not translated** | Kernel is "thin skin over JS" per Ch 2.2; not user-facing |
| Reserved JS identifiers (`undefined`, `null`, `true`, `false`) | **No, out of scope** | These are JS-host, not lykn-surface; separate i18n concern |
| Standard library globals (`console`, `Math`, `JSON`) | **No, out of scope** | Separate i18n stdlib effort for 0.7+ |

**Proposed default: as tabled above.** Worth confirming explicitly — Duncan's Russian example showed `консоль:лог`, which suggests stdlib translation is part of the 0.7.0 vision, but that's a separate catalog / mechanism (probably a per-locale shim layer) rather than something to bake into the form-spec file.

### Q6 — Rust codegen approach

| Option | Pros | Cons |
|---|---|---|
| **A. `build.rs` + Serde + TOML** parses at compile time, emits generated `.rs` into `OUT_DIR`, consumed via `include!` | Standard Rust pattern; clean compile-time errors on malformed TOML; no proc-macro complexity | One more build dependency (toml, serde) |
| **B. Procedural macro** that parses TOML and expands to const arrays | Single-step | Proc-macro infra is heavier; harder to debug; compile-time TOML errors harder to surface cleanly |
| **C. Runtime parse** via Serde at compiler startup | No build step | Slower; inappropriate for a compiler; runtime errors instead of compile-time |

**Proposed default: A.** Standard pattern. `lykn-lang` already has Serde; adding `toml` is a single line. The generated file is reviewable.

### Q7 — JS codegen approach

| Option | Pros | Cons |
|---|---|---|
| **A. Pre-build Deno script** parses `spec/forms.toml`, writes `packages/lang/generated/form-catalog.js` | Mirror of the Rust pattern; generated file is just JS const arrays; runs as part of `lykn build` or on demand | One more pre-build step |
| **B. Runtime fetch + parse** on lykn import | No build step | Only works server-side / Deno; would break browser shim; runtime parse cost |
| **C. Hand-maintained mirror** with cross-compiler tests verifying parity | No new tooling | Defeats the purpose; drift would silently shift to the mirror |

**Proposed default: A.** Pre-build via Deno script keeps the JS compiler dependency-free at runtime, mirrors the Rust pattern, and the generated `.js` can be committed (so consumers don't need the toolchain to use lykn-as-a-library).

### Q8 — Validation discipline

| Option | When it runs | Strength |
|---|---|---|
| **A. Build-time lint rule** — every form-name string literal in either compiler's source must appear in the catalog | Build time | Strongest; structural; can't ship a stray form name |
| **B. Runtime assertion** at compiler startup | Runtime | Slower; not appropriate for a compiler |
| **C. Test-only check** — one test enumerates form names from each compiler's source, diffs against catalog | Test time | Weaker than A but quick to add |

**Proposed default: C for 0.6.x, A as 0.7+ aspiration.** Option C is hours of work; option A is bigger lint-infrastructure work. C is sufficient if the test corpus is watertight.

### Q9 — 0.6.x → 0.7.0 forward-compatibility constraint

The 0.6.x catalog ships with the four classification flags (Q-emit, Q-value, Q-transfer, Q-child). 0.7.0 extends it with `[forms.translations.<locale>]` sub-tables. The schema MUST be designed so that 0.7.0's extension is purely additive — no existing field changes shape or semantics.

**No actual decision here — just a constraint to satisfy.**

### Q10 — Backwards-compatibility during the W-3 transition

After the catalog lands, the hand-maintained `STATEMENT_FORM_HEADS` and `STATEMENT_ONLY_HEADS` lists are **removed entirely** from both compilers. Their consumers go through the generated catalog. No parallel maintenance period; the migration is atomic.

**Proposed default: atomic migration.** Worth confirming explicitly because some teams prefer dual-write periods. For this catalog, the only safe state is single-source.

---

## Schema sketch (illustrative — finalized in W-3 Turn 1)

```toml
schema_version = "1.0"

# ─── Surface forms ─────────────────────────────────────────────────

[[forms]]
name = "bind"
kind = "surface"
emits_as_statement = true       # Q-emit
produces_value_as_last_body = false   # Q-value
is_control_transfer = false     # Q-transfer
# child_context_profile reserved for kernel forms

[[forms]]
name = "fn"
kind = "surface"
expands_to = "=>"               # the kernel form
emits_as_statement = false      # (after expansion to =>)
produces_value_as_last_body = true
is_control_transfer = false

[[forms]]
name = "try"
kind = "surface"                # NOTE: position-aware after W-2
emits_as_statement = "position_dependent"   # special value
produces_value_as_last_body = true  # under W-2
is_control_transfer = false

# ─── Kernel forms ──────────────────────────────────────────────────

[[forms]]
name = "try"
kind = "kernel"
emits_as_statement = true       # kernel try is always a JS statement
produces_value_as_last_body = false
is_control_transfer = false
child_context_profile = "AllParent"   # Q-child

[[forms]]
name = "if"
kind = "kernel"
emits_as_statement = true
produces_value_as_last_body = "if_else_form"  # special: depends on else-branch presence
is_control_transfer = false
child_context_profile = "Positional"
positional_contexts = ["Value", "Statement", "Statement"]

# ─── Keyword clauses ───────────────────────────────────────────────

[[keywords]]
name = "args"
context = "func_clause"

[[keywords]]
name = "body"
context = "func_clause"

# ─── Type keywords ─────────────────────────────────────────────────

[[type_keywords]]
name = "string"
js_type = "string"
runtime_check = "typeof x === 'string'"

[[type_keywords]]
name = "number"
js_type = "number"
runtime_check = "typeof x === 'number' && !Number.isNaN(x)"
```

The illustrative shape above is not the final spec — Turn 1 of W-3 refines it. Key features to preserve:

- `schema_version` at the top.
- Three top-level sections: `[[forms]]` (functional units), `[[keywords]]` (clause markers), `[[type_keywords]]` (type-level keywords).
- `kind = "surface" | "kernel" | "operator"` distinguishes layers.
- The four classification flags as named columns.
- Reserved space for `[forms.translations.<locale>]` sub-tables (added in 0.7.0; absent in 0.6.x — schema accepts both).

---

## Forbidden patterns

1. **Don't infer classification flags from the existing hand-maintained lists without verification.** Each form's flags must be cross-checked against both Rust and JS compiler implementations. The current lists have drift; the catalog cannot inherit it.

2. **Don't put translations in the same file as the canonical English entries.** Per-locale translation files live separately (`spec/translations/<locale>.toml`), referencing canonical English form names as keys.

3. **Don't ship without a `schema_version` field.** The catalog is a versioned language spec.

4. **Don't ship without complete enumeration.** Every form currently referenced in either compiler's classification machinery must be in the catalog. Missing forms = silent breakage.

5. **Don't keep parallel hand-maintained lists** as a "transition period." The catalog is the SoT from day one; if the codegen breaks, the compiler stops working — that's the *correct* failure mode.

---

## Out of scope for DD-56

- The 0.7.0 reader/parser changes that consume per-locale translations.
- Translation files themselves (Russian, Japanese, etc.) — those come with 0.7.0.
- Build-time lint rule for cross-source-of-truth validation (Q8 option A) — 0.7+.
- Standard-library i18n (`console:log` → `консоль:лог`) — separate 0.7+ scope.
- The reader-level locale-prefix mechanism (`;; lang: ru` at top of file) — 0.7.0 reader work.
- Operator-precedence tables — already declared elsewhere in the compiler; not part of this catalog.

---

## Cross-references

- DD-50.6 (`docs/dev/0016-dd-50.6-implementation-prompt-for-cc.md`) — Q4=A invariant not held in practice; this DD's remediation.
- DD-55 (`docs/design/06-final/0055-dd-55-template-macro-redesign-icu-messageformat-i18n-foundation.md`) — adjacent i18n work; template-level ICU foundation.
- Phase 1c classification audit (`workbench/phase-1c-classification-audit-2026-05-14.md`) — the conflation analysis.
- Phase 3 synthesis plan (`workbench/phase-3-synthesis-plan-2026-05-14.md`) §W-3.

---

## Decisions pending — Duncan's calls

| Q | Proposed default | Duncan's call |
|---|---|---|
| Q1 (file format) | A (TOML) | _____ |
| Q2 (file location) | D (`spec/forms.toml`) | _____ |
| Q3 (schema scope) | B (surface + kernel) | _____ |
| Q4 (canonical naming) | A (English-canonical + translation files) | _____ |
| Q5 (what's in 0.7.0 catalog) | form names + keyword clauses + type keywords | _____ |
| Q6 (Rust codegen) | A (`build.rs`) | _____ |
| Q7 (JS codegen) | A (pre-build Deno script) | _____ |
| Q8 (validation) | C for 0.6.x, A for 0.7+ | _____ |
| Q9 (forward-compat) | constraint — must be satisfied | confirm |
| Q10 (atomic migration) | atomic; no parallel period | confirm |

Once Duncan signs off (or amends), I'll write the W-3 implementation prompt for CC. The prompt will use the standard two-turn protocol: Turn 1 produces a finalized schema and codegen design memo; Turn 2 implements after CDC review.
