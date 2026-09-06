# slice04 · sibling traps — liveness re-check

**By:** CDC · **Date:** 2026-07-25 · **Branch:** `release/0.6.x` @ `e77ebcf`
**Purpose:** the arc-plan marks slice04 *"Shaped, not detailed"* and gates it on
one question — *are ID-32 and ID-33 still live silent miscompiles on current
lykn?* This answers it before the slice is scoped, so scoping is done against
the traps as they exist rather than as they were described.

**Method and its ceiling.** Code review of the post-fix source at HEAD, **both
backends**, plus grep for coverage. **Nothing here was executed** — the sandbox
has no cargo/deno. Every claim about *what the source does* is `reproduced`
(I read it); every claim about *what the emitted JS then does at runtime* is
marked `inference` and needs a CC probe. `D-2607-3VXM` is exactly the failure of
not making that distinction, so it is made per-claim below.

**Verdict up front: both are live, and neither is what its guide entry says.**

---

## ID-32 — it is two traps, of two different severities

The guide (`docs/guides/01-core-idioms.md:1063`) presents one MUST. The source
says there are two distinct failures behind it, and they are **not** the same
class. This matters because arc15's charter is *silent* miscompiles, and only
one half qualifies.

### (a) Typed `fn` + explicit `(return …)` → `return return X`  — **live, but LOUD**

Both backends wrap the last body expression when the arrow has type checks, and
**neither treats `return` as statement-only**, so an explicit return gets
wrapped a second time:

- **Rust** — `crates/lykn-lang/src/emitter/forms.rs`, `emit_fn_expr`: wraps when
  `has_type_checks`. The gate is `is_valueless_last_expr`, which does this:
  ```rust
  if matches!(head, "return" | "throw" | "break" | "continue") {
      return false;      // → NOT valueless → gets wrapped
  }
  ```
  `convert_to_expression` then passes it through untouched (it only rewrites
  `if`), so the emitted kernel is `(return (return X))`.
- **JS** — `packages/lang/classifier.js` `case "Fn"`: `typeChecks.length > 0` →
  `wrapReturnLast(node.bodyForms)`. `isStatementOnlyForm` consults
  `STATEMENT_ONLY_HEADS` (`surface-helpers.js:26`), which **does not contain
  `return`**. Same result.
- `emit_return` (`codegen/emit.rs`) writes `return ` then the expression, with
  no guard. Output: `return return X;`

**Parity note:** the behaviour matches, but the *intent* does not. Rust names
`return` in an explicit `matches!` and decides "not valueless"; JS reaches the
same place by **omission** from a list. One is a decision, one is a gap. Fixing
this means touching both, and the JS side has nothing recording why.

**Severity — the correction.** `return return X;` is not valid JavaScript:
`return` takes an optional *Expression*, and `return X` is a *Statement*. So
this fails at parse time on first load — **loud, not silent**. It belongs to the
*"compiles ≠ valid output"* genus (the `require` → invalid-ESM shape), **not**
to arc15's silent-miscompile charter. *(`inference` — from the ECMAScript
grammar, not from a run. A CC probe settles it in one command; if it somehow
parses, this reclassifies upward and the slice's priority changes.)*

### (b) Untyped multi-statement `fn` → value silently discarded — **live and SILENT**

This is the half the guide states almost in passing, and it is the one that fits
arc15:

- **Rust** — with no type checks the `else` branch runs `items.extend(emitted_body)`:
  **no return wrap at all.** `emit_arrow` then sees `body.len() > 1` → `emit_block_body`
  → `{ stmt1; stmt2; }`.
- **JS** — the `typeChecks.length > 0` test fails → `...node.bodyForms` raw.

So a multi-statement `fn` **without** typed params compiles clean and evaluates
to `undefined`. No error, no warning, plausible-looking output. *(Source read:
`reproduced`. "Evaluates to `undefined`": `inference`.)*

**And the same path fires on typed params under `--strip-assertions`**, because
`has_type_checks` is `!ctx.strip_assertions && …`. A function that returns
correctly in a normal build returns `undefined` in a stripped one. The guide
says this; the source confirms it. **This is the most dangerous item in the
re-check** — a build-flag-dependent silent value loss.

### (c) NEW, unregistered — `throw` / `break` / `continue` in the same position

The Rust `matches!` above lists **four** heads, not one. A typed `fn` ending in
`(throw X)` takes the identical path and emits `return throw X;`; `(break)` and
`(continue)` likewise. Same on JS by the same omission. Nobody has recorded
this; it is a strictly larger surface than ID-32 as written. Registered below.

---

## ID-33 — live on both readers, and **broader than the guide says**

The guide (`:1103`) says lykn does not process `\uNNNN`. True, and incomplete.
Both readers implement exactly four escapes and let everything else through as
the bare character:

- **Rust** — `crates/lykn-lang/src/reader/lexer.rs:212-217`, `read_string`:
  ```rust
  Some('n')  => value.push('\n'),
  Some('t')  => value.push('\t'),
  Some('\\') => value.push('\\'),
  Some('"')  => value.push('"'),
  Some(c)    => value.push(c),        // ← everything else
  ```
- **JS** — `packages/lang/reader.js:61`, `readString`: the same four, then
  `else value += esc;`

**Exact parity — same four escapes, same catch-all.** That is good news for
scoping: a fix lands symmetrically and there is no divergence to reconcile
first.

**The correction:** the gap is not `\u`. It is **every escape except those
four** — `\r`, `\0`, `\b`, `\f`, `\v`, `\xNN`, `\'`, `\uNNNN`, `\u{…}`. `"\r"`
silently becomes the letter `r`; `"…"` becomes `u2026`. Silent, no
diagnostic, and the failure is a plausible-looking string — squarely arc15's
class. The guide's entry should be re-scoped along with the fix.

---

## Coverage — the systemic finding predicted both

```
grep -rn "return return"     crates/ packages/ test/   → 0 hits
grep -rln "\\uNNNN escapes"  crates/ packages/ test/   → 0 hits
```

**Neither trap has a single test in either compiler.** That is `D-2607-Z5KN`
again — *the uncovered case is reliably the one that ships wrong* — and it is
the strongest argument for the slice: whatever is decided about diagnostics, the
regression tests are owed regardless, on both backends.

---

## What this changes about slice04's scope

The arc-plan row assumed two items of one kind. The re-check finds **four
items of three kinds**:

| Item | Class | Fits arc15's charter? |
|---|---|---|
| ID-32(b) untyped/stripped `fn` silently returns `undefined` | **silent miscompile** | **Yes — this is the headline** |
| ID-33 unhandled escapes (all of them, not just `\u`) | **silent miscompile** | **Yes** |
| ID-32(a) `return return` | invalid output, loud | No — `require` genus |
| ID-32(c) `throw`/`break`/`continue` | invalid output, loud | No — same genus, new |

**Recommendation (CDC, for the operator):** scope slice04 to the two silent
items, take (a) and (c) as cheap drive-bys *only if* the same guard covers them
— the four heads share one `matches!` on Rust and one list on JS, so one edit
plausibly fixes all four — and put the regression tests on both backends in the
ledger regardless. If (a)/(c) turn out to need separate work, route them out
rather than growing the slice.

**Before scoping, one CC probe is owed** — compile the four shapes on both
backends and record the actual emitted JS and its runtime behaviour, so the
severity column above stops being inference. That is a ~20-minute job and it is
the same discipline `D-2607-3VXM` exists to enforce.
