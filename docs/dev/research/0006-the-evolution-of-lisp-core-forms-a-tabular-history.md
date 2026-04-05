# The Evolution of Lisp Core Forms: A Tabular History

This document traces how the categorization of "core" versus "derived" forms evolved across the history of Lisp, from McCarthy's 1960 paper through the Scheme standardization process.

---

## 1. McCarthy's Original Lisp (1960)

**Source:** "Recursive Functions of Symbolic Expressions and Their Computation by Machine, Part I"

McCarthy distinguished between **elementary functions** (which evaluate their arguments) and **special forms** (which have non-standard evaluation rules).

### Elementary Functions (5)

| Function | Purpose |
|----------|---------|
| `ATOM`   | Test if argument is an atomic symbol |
| `EQ`     | Test equality of two atoms |
| `CAR`    | Return first element of a pair |
| `CDR`    | Return second element of a pair |
| `CONS`   | Construct a new pair from two arguments |

### Special Forms (4)

| Form     | Purpose | Notes |
|----------|---------|-------|
| `QUOTE`  | Prevent evaluation of argument | Returns argument unevaluated |
| `COND`   | Conditional expression | Lazy evaluation of branches |
| `LAMBDA` | Function abstraction | Creates anonymous functions |
| `LABEL`  | Recursive naming | Later shown unnecessary by D.M.R. Park (could use Y combinator) |

**Total: 9 operators** for a complete, universal programming language.

---

## 2. Original Scheme (1975)

**Source:** MIT AI Memo 349, "Scheme: An Interpreter for Extended Lambda Calculus" (Sussman & Steele, December 1975)

Scheme introduced a key distinction: **AINTs** ("are to SCHEME as FSUBRs are to LISP" — primitive special forms built into the interpreter) versus **AMACROs** ("similar to MacLISP MACROs... expanded into equivalent code before being executed").

### AINTs (Primitive Special Forms) — 7

| Form        | Purpose | Notes |
|-------------|---------|-------|
| `IF`        | Two-branch conditional | "The primitive conditional operator" |
| `QUOTE`     | Prevent evaluation | "As in LISP" |
| `DEFINE`    | Top-level definition | "Analogous to MacLISP DEFUN" but LAMBDA must appear explicitly |
| `LABELS`    | Local recursive function definitions | ALGOLesque block syntax; allows mutual recursion |
| `ASET`      | Assignment (mutation) | "The side effect primitive, analogous to LISP SET" |
| `EVALUATE`  | Eval | "Similar to LISP EVAL" |
| `CATCH`     | Continuation capture | "The escape operator which gives the user a handle on control structure" |

*Note:* `LAMBDA` is not listed as an AINT because it's even more fundamental — it's how all functions (closures) are created. The memo states that "LAMBDA expressions need not be QUOTEd... they will evaluate to closures of themselves."

### Multiprocessing Primitives (4)

| Form                        | Purpose |
|-----------------------------|---------|
| `CREATE!PROCESS`            | Generate new parallel process |
| `START!PROCESS`             | Start a process by ID |
| `STOP!PROCESS`              | Stop a process |
| `EVALUATE!UNINTERRUPTIBLY`  | Synchronization primitive (atomic execution) |

### AMACROs (Derived Forms) — 6 listed

| Form       | Expansion Target | Notes |
|------------|------------------|-------|
| `COND`     | Nested `IF`      | "Like MacLISP COND, except singleton clauses not allowed" |
| `AND`      | `IF`             | "As in MacLISP" |
| `OR`       | `IF`             | "As in MacLISP" |
| `BLOCK`    | `LAMBDA`         | "Like MacLISP PROGN" but tail-call optimized |
| `DO`       | `LABELS` + `IF`  | "Like MacLISP new-style DO" |
| `AMAPCAR`  | `LABELS`         | "Like MAPCAR but expects a SCHEME lambda closure" |
| `AMAPLIST` | `LABELS`         | "Like MAPLIST but expects a SCHEME lambda closure" |

**Key insight from the memo:** "We discovered that the 'actors' and the lambda expressions were identical in implementation. Once we had discovered this, all the rest fell into place, and it was only natural to begin thinking about actors in terms of lambda calculus."

---

## 3. RABBIT Compiler (1978)

**Source:** MIT AI Technical Report 474, "RABBIT: A Compiler for SCHEME" (Steele)

The RABBIT compiler formalized the "semantic basis set" — the minimal core the compiler needed to understand.

### Semantic Basis Set

| Form       | Category | Purpose |
|------------|----------|---------|
| `LAMBDA`   | Core     | Function abstraction |
| `IF`       | Core     | Conditional |
| `QUOTE`    | Core     | Literal data |
| `SETQ`     | Core     | Assignment |
| `CATCH`    | Core     | Continuation capture |
| Application| Core     | Function calls |

### Explicitly Derived (Compiled as Macro Expansions)

| Form       | Notes |
|------------|-------|
| `COND`     | → nested `IF` |
| `AND`      | → `IF` with `LAMBDA` for lazy evaluation |
| `OR`       | → `IF` with `LAMBDA` |
| `BLOCK`    | → sequenced `LAMBDA` applications |
| `DO`       | → recursive `LABELS` |
| `PROG`     | → combination of primitives |
| `LET`      | → `LAMBDA` application |
| `LABELS`   | → `LETREC` equivalent |

---

## 4. R3RS — Revised³ Report on Scheme (1986)

**Source:** The R3RS specification

R3RS introduced the formal distinction between **Primitive Expression Types** and **Derived Expression Types**, with explicit rewrite rules showing how derived forms reduce to primitives.

### Primitive Expression Types (6)

| Expression Type     | Syntax Example | Purpose |
|--------------------|----------------|---------|
| Variable reference | `x`            | Look up binding |
| Literal expression | `'datum`, `#t`, `42` | Self-evaluating or quoted data |
| Procedure call     | `(operator operands...)` | Apply function |
| Lambda expression  | `(lambda (x) body)` | Create procedure |
| Conditional        | `(if test conseq alt)` | Branch |
| Assignment         | `(set! var expr)` | Mutate binding |

### Derived Expression Types (Reducible to Primitives)

| Form        | Category    | Reduces To |
|-------------|-------------|------------|
| `cond`      | Conditional | Nested `if` |
| `case`      | Conditional | `let` + `cond` + `memv` |
| `and`       | Conditional | `if` + `let` |
| `or`        | Conditional | `if` + `let` |
| `let`       | Binding     | `lambda` application |
| `let*`      | Binding     | Nested `let` |
| `letrec`    | Binding     | `let` + `set!` |
| `begin`     | Sequencing  | `lambda` with sequence |
| `do`        | Iteration   | `letrec` + `if` |
| `delay`     | Evaluation  | `lambda` (thunk creation) |
| `quasiquote`| Quotation   | `quote` + `cons` + `list` |

**Key quote from R3RS:** "By the application of these rules, any expression can be reduced to a semantically equivalent expression in which only the primitive expression types (literal, variable, call, lambda, if, set!) occur."

---

## 5. R5RS — Revised⁵ Report on Scheme (1998)

**Source:** The R5RS specification

R5RS refined the categories and added macro-related primitives.

### Primitive Constructs (9)

| Category | Forms | Purpose |
|----------|-------|---------|
| **Expression Types** | | |
| Variable reference | `identifier` | Lookup |
| Literal | `quote`, self-evaluating | Data |
| Procedure call | `(operator operands...)` | Application |
| `lambda` | `(lambda formals body)` | Abstraction |
| `if` | `(if test conseq [alt])` | Conditional |
| `set!` | `(set! var expr)` | Assignment |
| **Macro Forms** | | |
| `let-syntax` | | Local macro binding |
| `letrec-syntax` | | Recursive local macros |
| `syntax-rules` | | Pattern-based macros |

### Derived Expression Types (14)

| Form | Category | Defined Via |
|------|----------|-------------|
| `cond` | Conditional | `if`, `let` |
| `case` | Conditional | `let`, `cond`, `memv` |
| `and` | Conditional | `if` |
| `or` | Conditional | `if`, `let` |
| `let` | Binding | `lambda` |
| `let*` | Binding | Nested `let` |
| `letrec` | Binding | `let`, `set!` |
| `begin` | Sequencing | `lambda` |
| `do` | Iteration | `letrec`, `if` |
| `named let` | Iteration | `letrec` |
| `delay` | Lazy eval | `lambda`, promise |
| `quasiquote` | Quotation | `quote`, `cons` |
| `unquote` | Quotation | (part of quasiquote) |
| `unquote-splicing` | Quotation | (part of quasiquote) |

---

## 6. Common Lisp (ANSI Standard, 1994)

**Source:** Common Lisp HyperSpec

Common Lisp took a different approach: **25 special operators** fixed in the language, but implementations may implement any as macros internally (with equivalent macro definitions provided).

### All 25 Special Operators

| Operator | Category | Purpose |
|----------|----------|---------|
| `block` | Control | Establish named exit point |
| `catch` | Control | Dynamic non-local exit |
| `eval-when` | Evaluation | Control evaluation time |
| `flet` | Binding | Local function binding |
| `function` | Reference | Get function object |
| `go` | Control | Transfer to tag |
| `if` | Conditional | Branch |
| `labels` | Binding | Local recursive functions |
| `let` | Binding | Parallel local binding |
| `let*` | Binding | Sequential local binding |
| `load-time-value` | Evaluation | Evaluate at load time |
| `locally` | Declaration | Local declarations |
| `macrolet` | Binding | Local macro binding |
| `multiple-value-call` | Values | Pass multiple values |
| `multiple-value-prog1` | Values | Return multiple values |
| `progn` | Sequencing | Sequential evaluation |
| `progv` | Binding | Dynamic variable binding |
| `quote` | Quotation | Prevent evaluation |
| `return-from` | Control | Return from block |
| `setq` | Assignment | Variable assignment |
| `symbol-macrolet` | Binding | Local symbol macros |
| `tagbody` | Control | Establish tags for GO |
| `the` | Declaration | Type declaration |
| `throw` | Control | Throw to catch |
| `unwind-protect` | Control | Cleanup forms |

**Note:** Common Lisp chose practicality over minimalism. Many of these (like `let`, `let*`, `flet`, `labels`) could theoretically be derived from `lambda`, but having them as special operators enables more efficient compilation.

---

## 7. Theoretical Minimum

Research from the 1980s and 1990s established what truly cannot be derived:

### The Irreducible Core (5 forms for a practical Lisp)

| Form | Why Irreducible |
|------|-----------------|
| `QUOTE` | Operates at meta-level; cannot define quote using quote |
| `LAMBDA` | Foundation of all binding; defines abstraction itself |
| `IF` | Must not evaluate both branches; cannot be a function |
| `SET!` | Requires access to location, not value |
| `DEFINE` | Requires privileged access to environment |

### Pure Lambda Calculus Minimum (3 constructs)

| Construct | Notes |
|-----------|-------|
| Lambda abstraction | `λx.body` |
| Application | `(f x)` |
| Variables | `x` |

Everything else (including conditionals and numbers) can be Church-encoded, but this is impractical for real implementations.

---

## Summary: The Narrowing Funnel

| Era | Source | Total "Core" | Notes |
|-----|--------|--------------|-------|
| 1960 | McCarthy | 9 | 5 functions + 4 special forms |
| 1975 | Original Scheme | 7 | AINTs only |
| 1978 | RABBIT | ~6 | Semantic basis set |
| 1986 | R3RS | 6 | Primitive expression types |
| 1998 | R5RS | 6 + 3 macro | Core expressions + syntax forms |
| 1994 | Common Lisp | 25 | Practical over minimal |
| Theory | Lambda calculus | 3 | Abstraction + application + variables |
| Practical minimum | — | 5 | quote, lambda, if, set!, define |

The history shows a consistent drive toward identifying the smallest possible core, with the insight that **lambda is the universal binding mechanism** from which most other constructs derive.
