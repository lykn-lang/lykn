# DD-64 — Method calls on expressions: reject the trap, thread instead (DRAFT)

> **Status: DRAFT (CDC seed 2026-07-22; odm promotion = Duncan).**
> **Release: 0.6.0.** **Home: arc15 · surface-syntax-traps.**
> **Decisions locked (operator, 2026-07-22):** (1) detection boundary =
> **general** — reject any non-atom receiver, not just `express`; (2) new
> **arc15**; (3) **both** compiler error + arc05 lint rule + guide fixes.
> This *reverses* the earlier "route #6 to compiler-follow-up / post-0.6.0":
> 0.6.0 is the compiler-cleanup release, the pattern isn't widely adopted yet,
> and the audience includes JS devs who won't know ID-31. Source: arc06/slice02
> #6 + operator pushback on the initial CDC severity read.

## 1. The problem (verified against source)

lykn's method-call sugar `x:method` requires `x` to be an **atom** (`parts:join`
is one colon-bearing token, split into member access). When the receiver is a
**parenthesized expression**, the reader cannot attach `:method` to it — the
`:method` becomes a *separate keyword element*, and the form collapses to an
ordinary call. Two individually-reasonable rules collide:

- **`x:method` is atom-only** (member access is lexed at the atom level).
- **A keyword in argument position emits as a string** (`codegen/emit.rs:87`:
  "Keywords emit as string literals"; `:my-key` → `"myKey"`).

So `((express parts):join "")` is really the call `[(express parts), :join, ""]`
→ head `(express parts)` → `parts.value`, args `:join`→`"join"`, `""`→`""`:

```lykn
((express parts):join "")     ;; intent: parts.value.join("")
```
```js
parts.value("join", "")       // actual: a function call, method name as a string
```

**Runtime outcome:** commonly the expressed value is an array, so
`parts.value(...)` throws `TypeError: parts.value is not a function` — a crash
pointing at `.value` and a call the author never wrote (uninterpretable to a
newcomer). If the cell holds a *function*, it silently runs with the method name
as its first argument — a true silent wrong-behaviour path. Either way the
compile is clean (`rc=0`, passes `lykn check`).

**Not `express`-specific.** Any parenthesized receiver hits it —
`((new TextEncoder):encode s)`, `((get row 0):to-upper-case)`, `((/ x 100):toFixed 2)`.

## 2. Ground-truth sweep (CDC, 2026-07-22) — the general boundary is safe

Textual fingerprint of the trap: a receiver `)` **glued** to a keyword colon
(`):method`, mimicking `x:method`). Swept `.lykn`/`.lyk` + guides + mycelium:

| Surface | Glued `):kw` hits | Reading |
|---------|-------------------|---------|
| `lang` source + tests | **0** | the compiler error breaks **no** existing source/tests |
| mycelium | **0** | downstream already worked around it (intermediate bind) |
| guides (`docs/guides/`) | **~13** | ~10 **teach the trap as if it works**; ~3 **document it as wrong** |

The guide sites that *teach* it (become compile errors → migrate to threading):
`14-no-node-boundary` (`(new TextEncoder):encode`, `(new TextDecoder):decode` ×3),
`03-error-handling:211` (`(express errors):length`), `:556` (`(log-request req):catch`),
`06-functions-closures:38/39/562/642/988` (`(get parts 0):trim`, `(parts:slice 1):join`,
`#a(1 2 3):map`, `(/ cents 100):toFixed`), `08-performance:71/391`
(`(- t1 t0):toFixed`, `(express lines):join`). The sites that *document it as
wrong* (keep, repoint to threading): `01-core-idioms` ID-31 (1040/1257/1263),
`09-anti-patterns:335`.

**Two conclusions:** (a) **zero legitimate `(computed-fn :keyword-arg)` false
positives** exist in the corpus — the feared `((get handlers t) :default 0)`
pattern does not occur, so the general boundary is safe; (b) our **own docs are
the main propagation vector** — a strong argument the trap is live and worth the
0.6.0 fix, and the reason guide migration is a *prerequisite* (make test-docs),
not polish.

## 3. Taxonomy — for the guides and the linter

### Valid (compiles, correct) — method sugar on a *name*

| lykn | JS |
|------|----|
| `(el:query-selector "#x")` | `el.querySelector("#x")` |
| `(result:join "")` | `result.join("")` |
| `(console:log msg)` / `(Math:max a b)` | `console.log(msg)` / `Math.max(a, b)` |
| `(this:render)` | `this.render()` |

Rule: **`x:method` is legal iff `x` is a name** (atom / binding / namespace / `this`).

### Invalid (compile error) — method sugar on a *parenthesized expression*

| lykn | today mis-emits |
|------|-----------------|
| `((express parts):join "")` | `parts.value("join","")` |
| `((new TextEncoder):encode s)` | `new TextEncoder()("encode", s)` |
| `((/ cents 100):toFixed 2)` | `(cents / 100)("toFixed", 2)` |

Rejected signature: a **call form whose head is a non-atom** (list / literal /
compound) **and whose first argument is a keyword** — `(<non-atom-head> :kw …)`.
Covers every receiver shape: `(express …)`, `(new …)`, `(get …)`, `#a(…)`,
arithmetic, call-results — because the rule keys on "head is not a name," not on
`express`.

### Lykn-correct pattern — thread it

Grounded: `apply_threading_step` (emitter/forms.rs) turns a keyword-headed step
`(:method args)` into `(. acc method args)`:

```lykn
(-> (express parts) (:join ""))                          ;; parts.value.join("")
(-> (new TextEncoder) (:encode "hello"))                 ;; new TextEncoder().encode("hello")
(-> (express parts) (:join "") (:trim) (:to-upper-case)) ;; chains cleanly
```

Secondary — intermediate bind (ID-31), when the value is reused:
```lykn
(bind arr (express parts))
(arr:join "")
```

Teaching line: *method sugar `x:method` needs `x` to be a name. To call a method
on the result of an expression, thread it — `(-> <expr> (:method args))` — or
bind it first.*

## 4. The compiler change — "cannot compile the wrong way"

The classifier detects `(<non-atom-head> <keyword-first-arg> …)` and **errors**
(not warns), with a fix-it:

```
error: method call on a parenthesized expression is not supported
  ((express parts):join "")
   ^^^^^^^^^^^^^^^^ receiver is an expression, not a name
  help: thread the method call:  (-> (express parts) (:join ""))
        or bind first:           (bind v (express parts)) (v:join "")
  note: to pass a keyword string argument to a computed function, use a
        string literal:  ((express parts) "join" "")
```

Error (not warning) is what satisfies "a user cannot compile the incorrect way"
and prevents a codebase being built on the trap and breaking later.

## 5. Delivery (arc15 slices)

1. **slice01 — reject + migrate guides (coupled):** classifier error + tests,
   *and* migrate the ~10 guide sites to threading + repoint ID-31 /
   09-anti-patterns; `make check` + `make test-docs` green together. (Coupled
   because the error breaks the guides; they move as one capability.)
2. **slice02 — lint rule:** arc05 rule flagging `(<non-atom-head> :kw …)` with
   the threading fix-it — the friendly, earlier catch (DX layer atop the hard
   error).
3. **slice03 — sibling traps (shaped, plan-late):** ID-32 `return return`
   double-return, ID-33 `\uNNNN`-not-processed — assess whether still live, fold
   in.

## 6. Notes

- **Forward-compat:** fixing in 0.6.0 (pre-adoption) avoids a breaking change
  later; the corpus sweep (0 source hits) confirms no migration debt today.
- **Array/data-literal receivers** (`#a(1 2 3):map`) are covered by the same
  "head is not an atom" rule — no special case needed.
- **Reader-level alternative considered & rejected:** making `):method` lex as
  member access on the preceding form would be a larger grammar change and a
  *second* way to spell method chaining; threading already exists and is
  idiomatic. DD-64 keeps one blessed way (thread) and rejects the ambiguous one.
