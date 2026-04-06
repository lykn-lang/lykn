---
number: 30
title: "Pure Rust Kernel→JS Codegen"
author: "Duncan McGreggor"
component: All
tags: [change-me]
created: 2026-04-05
updated: 2026-04-05
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# Pure Rust Kernel→JS Codegen

## Context

The `lykn compile` command currently shells out to Deno to run `src/compiler.js` + `astring` for the final kernel→JS step. This means the Rust binary isn't self-contained — it requires Deno installed and the lykn JS source tree available at compile time.

This plan replaces that bridge with a pure Rust codegen module that directly pattern-matches kernel `SExpr` forms and emits JavaScript source text. Zero new dependencies. The Rust binary becomes fully self-contained.

## Architecture

```
BEFORE:  SExpr → JSON → temp file → Deno subprocess → compiler.js → astring → JS text
AFTER:   SExpr → codegen::emit_js() → JS text  (pure Rust, in-process)
```

## Scope: What the codegen must handle

The JS compiler (`src/compiler.js`) has ~85 kernel form handlers. These fall into categories:

### Category 1: Declarations (3 forms)

- `const`, `let`, `var` — `kind name = init;`

### Category 2: Functions (5 forms)

- `=>` — arrow function (expression body or block body)
- `lambda` — anonymous function expression
- `function` — named function declaration
- `async` — wraps any function form to add `async`
- `await` — `await expr`

### Category 3: Control flow (13 forms)

- `if` — `if (cond) { then } else { else }`
- `while`, `do-while` — loops
- `for` — C-style `for (init; test; update) { body }`
- `for-of`, `for-in` — iteration loops
- `switch` — switch/case/default
- `break`, `continue` — with optional label
- `label` — labeled statement
- `return` — return statement
- `throw` — throw statement
- `try` — try/catch/finally
- `block` — `{ stmts }`

### Category 4: Expressions (8 forms)

- `?` — ternary `test ? then : else`
- `=` — assignment `left = right`
- `new` — `new Constructor(args)`
- `get` — computed access `obj[key]`
- `.` — method call `obj.method(args)`
- `seq` — comma operator `(a, b, c)`
- `++`, `--` — prefix update

### Category 5: Binary/logical operators (25 forms)

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `**`
- Comparison: `===`, `!==`, `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `&&`, `||`, `??`
- Bitwise: `&`, `|`, `^`, `<<`, `>>`, `>>>`
- Special: `in`, `instanceof`
- N-ary: `(+ a b c)` → `a + b + c`

### Category 6: Unary operators (5 forms)

- `!`, `~`, `typeof`, `void`, `delete`

### Category 7: Compound assignment (15 forms)

- `+=`, `-=`, `*=`, `/=`, `%=`, `**=`
- `<<=`, `>>=`, `>>>=`, `&=`, `|=`, `^=`
- `&&=`, `||=`, `??=`

### Category 8: Object/array construction (3 forms)

- `object` — `{ key: value, ... }` with shorthand, computed, spread
- `array` — `[elem, ...]`
- `spread` — `...expr`

### Category 9: Templates & regex (3 forms)

- `template` — `` `str ${expr} str` ``
- `tag` — `` tag`...` ``
- `regex` — `/pattern/flags`

### Category 10: Patterns & defaults (3 forms)

- `default` — `name = value` (in params)
- `rest` — `...name` (in params/destructuring)
- Destructuring in `compilePattern`: `object`, `array`, `alias`

### Category 11: Classes (3 forms)

- `class` — class declaration with extends, fields, methods, accessors, static
- `class-expr` — anonymous class expression
- Class members: `field`, `get`, `set`, `static`, `async`, `constructor`

### Category 12: Modules (3 forms)

- `import` — all variants (side-effect, default, named, default+named)
- `export` — all variants (default, named, re-export, declaration)
- `dynamic-import` — `import("mod")`

### Category 13: Misc (2 forms)

- `debugger` — `debugger;`
- `.` — method call (new, added in BUG 11 fix)

### Cross-cutting concerns

1. **`toCamelCase`** — `my-function` → `myFunction`, `-private` → `_private`
2. **Colon syntax** — `console:log` → `console.log`, `this:-name` → `this.#_name`
3. **Operator precedence** — when to parenthesize: `(a + b) * c` not `a + b * c`
4. **Statement vs expression** — `if` is a statement, wrapping needed in some contexts
5. **Indentation** — 2-space indent, consistent formatting
6. **Semicolons** — emitted after statements (matching astring's default)

## Implementation Plan

### New file: `crates/lykn-lang/src/codegen/mod.rs`

New module `codegen` in `lykn-lang` containing:

```
crates/lykn-lang/src/codegen/
  mod.rs          — public API: emit_module_js(&[SExpr]) -> String
  emit.rs         — core emit_expr() dispatcher + form handlers
  format.rs       — JS writer with indentation tracking
  names.rs        — toCamelCase + colon syntax → member chains
  precedence.rs   — operator precedence for parenthesization
```

### Phase 1: Foundation — Writer + Names (`format.rs`, `names.rs`)

**`format.rs`** — A `JsWriter` struct that builds a JS string with indentation:

```rust
struct JsWriter {
    buf: String,
    indent_level: usize,
    indent_str: &'static str,  // "  " (2 spaces)
    at_line_start: bool,
}

impl JsWriter {
    fn write(&mut self, s: &str)       // append text
    fn writeln(&mut self, s: &str)     // append text + newline
    fn newline(&mut self)              // newline + indent
    fn indent(&mut self)               // increase indent
    fn dedent(&mut self)               // decrease indent
    fn write_block<F>(&mut self, f: F) // { indent; f(); dedent; }
    fn semicolon(&mut self)            // ";\n"
}
```

**`names.rs`** — Identifier transformation:

```rust
fn to_camel_case(s: &str) -> String          // my-func → myFunc
fn split_colon_syntax(s: &str) -> Vec<String> // a:b:c → ["a", "b", "c"]
fn is_private_field(s: &str) -> bool          // starts with -
fn emit_member_chain(w: &mut JsWriter, segments: &[String])
```

### Phase 2: Precedence (`precedence.rs`)

Define operator precedence levels matching JavaScript:

```rust
fn precedence(op: &str) -> u8 {
    match op {
        "," | "seq" => 1,
        "=" | "+=" | "-=" | ... => 2,  // assignment
        "?" => 3,                       // ternary
        "||" => 4, "&&" => 5, "|" => 6, "^" => 7, "&" => 8,
        "==" | "!=" | "===" | "!==" => 9,
        "<" | ">" | "<=" | ">=" | "in" | "instanceof" => 10,
        "<<" | ">>" | ">>>" => 11,
        "+" | "-" => 12,
        "*" | "/" | "%" => 13,
        "**" => 14,
        "!" | "~" | "typeof" | "void" | "delete" => 15,  // unary
        "new" => 16,
        "++" | "--" => 16,
        _ => 20,  // function call, member access — highest
    }
}

fn needs_parens(parent_op: &str, child_op: &str, is_right: bool) -> bool
```

### Phase 3: Core dispatcher (`emit.rs`)

The main `emit_expr` function that dispatches on the head atom:

```rust
fn emit_expr(w: &mut JsWriter, expr: &SExpr, parent_prec: u8) {
    match expr {
        SExpr::Number { value, .. } => emit_number(w, *value),
        SExpr::String { value, .. } => emit_string_literal(w, value),
        SExpr::Bool { value, .. } => w.write(if *value { "true" } else { "false" }),
        SExpr::Null { .. } => w.write("null"),
        SExpr::Atom { value, .. } => emit_atom(w, value),  // handles camelCase, colon syntax, this, super, etc.
        SExpr::Keyword { value, .. } => emit_string_literal(w, value), // keywords → string literals
        SExpr::List { values, .. } => emit_list(w, values, parent_prec),
        _ => {}
    }
}

fn emit_list(w: &mut JsWriter, values: &[SExpr], parent_prec: u8) {
    let head = head_atom(values);  // extract head form name
    let args = &values[1..];
    match head {
        // Declarations
        "const" | "let" | "var" => emit_var_decl(w, head, args),

        // Functions
        "=>" => emit_arrow(w, args),
        "lambda" => emit_lambda(w, args),
        "function" => emit_function_decl(w, args),
        "async" => emit_async(w, args),
        "await" => emit_await(w, args, parent_prec),
        "return" => emit_return(w, args),

        // Control flow
        "if" => emit_if(w, args),
        "block" => emit_block(w, args),
        "while" => emit_while(w, args),
        // ... etc for all ~85 forms

        // Binary operators (n-ary)
        "+" | "-" | "*" | "/" | "%" | "**" |
        "===" | "!==" | "==" | "!=" | "<" | ">" | "<=" | ">=" |
        "&&" | "||" | "??" |
        "&" | "|" | "^" | "<<" | ">>" | ">>>" |
        "in" | "instanceof" => emit_binary(w, head, args, parent_prec),

        // Unary
        "!" | "~" | "typeof" | "void" | "delete" => emit_unary(w, head, args),

        // Compound assignment
        "+=" | "-=" | ... => emit_compound_assign(w, head, args),

        // Default: function call
        _ => emit_call(w, values),
    }
}
```

### Phase 4: Form handlers — each category

Implement each handler function. Some examples:

**`emit_var_decl`**: `(const x 1)` → `const x = 1`

```rust
fn emit_var_decl(w: &mut JsWriter, kind: &str, args: &[SExpr]) {
    w.write(kind); w.write(" ");
    emit_pattern(w, &args[0]);
    if args.len() > 1 {
        w.write(" = ");
        emit_expr(w, &args[1], 0);
    }
}
```

**`emit_arrow`**: `(=> (a b) (+ a b))` → `(a, b) => a + b` or block

```rust
fn emit_arrow(w: &mut JsWriter, args: &[SExpr]) {
    emit_params(w, &args[0]);
    w.write(" => ");
    if args.len() == 2 {
        // single expression body
        emit_expr(w, &args[1], 0);
    } else {
        // block body
        w.write_block(|w| {
            for stmt in &args[1..] {
                emit_statement(w, stmt);
            }
        });
    }
}
```

**`emit_binary`**: `(+ a b c)` → `a + b + c` with precedence

```rust
fn emit_binary(w: &mut JsWriter, op: &str, args: &[SExpr], parent_prec: u8) {
    let my_prec = precedence(op);
    let need_parens = my_prec < parent_prec;
    if need_parens { w.write("("); }
    emit_expr(w, &args[0], my_prec);
    for arg in &args[1..] {
        w.write(&format!(" {op} "));
        emit_expr(w, arg, my_prec + 1); // +1 for left-associativity
    }
    if need_parens { w.write(")"); }
}
```

**`emit_object`**: `(object (name "x") age (spread rest))` → `{ name: "x", age, ...rest }`

```rust
fn emit_object(w: &mut JsWriter, args: &[SExpr]) {
    // Handle: bare atom (shorthand), (key value) pair, (spread x), ((computed k) v)
}
```

**`emit_class`**: Full class with extends, fields, methods, accessors, static

```rust
fn emit_class(w: &mut JsWriter, args: &[SExpr]) {
    // name, superclass list, members...
}
```

**`emit_import`**: All import variants

```rust
fn emit_import(w: &mut JsWriter, args: &[SExpr]) {
    // (import "mod"), (import "mod" name), (import "mod" (a b)), (import "mod" name (a b))
}
```

**`emit_template`**: `` `str ${expr} str` ``

```rust
fn emit_template(w: &mut JsWriter, args: &[SExpr]) {
    w.write("`");
    for arg in args {
        if is_string(arg) {
            w.write(&arg.string_value()); // raw template text
        } else {
            w.write("${");
            emit_expr(w, arg, 0);
            w.write("}");
        }
    }
    w.write("`");
}
```

### Phase 5: Pattern emission for destructuring

```rust
fn emit_pattern(w: &mut JsWriter, pat: &SExpr) {
    // atom → identifier (camelCase)
    // _ → skip (array hole)
    // (object name age (default x 0) (alias a b) (rest r)) → { name, age, x = 0, a: b, ...r }
    // (array first second (rest tail)) → [first, second, ...tail]
    // (default name value) → name = value
    // (rest name) → ...name
}
```

### Phase 6: Integration — replace bridge

**`crates/lykn-lang/src/lib.rs`** — add `pub mod codegen;`

**`crates/lykn-cli/src/compile.rs`** — replace bridge call:

```rust
// BEFORE:
let js = bridge::kernel_json_to_js(&kernel_json, file)?;

// AFTER:
let js = lykn_lang::codegen::emit_module_js(&kernel_forms);
```

**`crates/lykn-cli/src/bridge.rs`** — can be removed entirely (or kept for `--legacy-bridge` flag during transition)

**`crates/lykn-cli/src/main.rs`** — remove `mod bridge;` (or gate behind feature)

### Phase 7: Testing strategy

1. **Golden file tests**: For each kernel form, compare Rust codegen output against JS compiler output. Use the same cross-compiler test pattern.

2. **Round-trip tests**: Compile surface lykn → kernel SExpr → JS text → execute with Deno, verify output matches.

3. **Example file tests**: `lykn compile examples/surface/main.lykn` output must match the JS pipeline output (modulo whitespace).

4. **Edge cases**: Empty programs, deeply nested expressions, long chains, Unicode strings, regex patterns, template literals with special chars.

## Verification

After each phase, incrementally test:

```sh
cargo test                    # unit tests pass
cargo build --release         # builds without Deno dep
./target/release/lykn compile examples/surface/main.lykn  # produces valid JS
# Compare against JS pipeline:
deno eval "import {lykn} from './src/index.js'; ..."
```

Final verification — the binary works standalone without Deno:

```sh
# Temporarily remove Deno from PATH
PATH_BACKUP=$PATH
export PATH=$(echo $PATH | tr ':' '\n' | grep -v deno | tr '\n' ':')
./target/release/lykn compile examples/surface/main.lykn  # must work!
export PATH=$PATH_BACKUP
```

## Files to create

- `crates/lykn-lang/src/codegen/mod.rs` — public API
- `crates/lykn-lang/src/codegen/emit.rs` — core dispatcher + form handlers
- `crates/lykn-lang/src/codegen/format.rs` — JsWriter
- `crates/lykn-lang/src/codegen/names.rs` — camelCase + colon syntax
- `crates/lykn-lang/src/codegen/precedence.rs` — operator precedence

## Files to modify

- `crates/lykn-lang/src/lib.rs` — add `pub mod codegen;`
- `crates/lykn-cli/src/compile.rs` — use codegen instead of bridge
- `crates/lykn-cli/src/main.rs` — remove bridge module

## Files to remove (or deprecate)

- `crates/lykn-cli/src/bridge.rs` — no longer needed

## Estimated size

- ~800-1200 lines of Rust for the codegen module
- The largest single piece: form handlers in `emit.rs` (~500-700 lines)
- Precedence table: ~50 lines
- JsWriter: ~80 lines
- Names: ~60 lines
