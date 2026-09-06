# Initial Thoughts: Lykn C Target

Status: captured brainstorm, not a committed design
Created: 2026-08-20

## Summary

The earlier C-target brainstorm fits Lykn well, but not as "reuse the JS
kernel IR and print C." The more likely path is to reuse the Rust compiler
front half, add an embedded target/profile layer, then lower to a new
C-oriented IR.

## Codebase-Grounded TODO List

1. Define the embedded target contract first.

   Add a design doc for `lykn/embedded`, probably 0.8.x or later. Decide
   whether the first target is `freestanding-c`, `mcu-c`, or a named board
   profile. Define what is forbidden: heap, async, JS interop, classes, dynamic
   import, browser APIs, and maybe macros with host-side effects.

2. Introduce target profiles before emission.

   The current compile flow goes from analysis to JS kernel emission. Add a
   target/profile validation phase after analysis and before emitter. First
   profile: reject unsupported surface forms cleanly rather than trying to
   lower everything.

3. Design an embedded type layer.

   Current annotations are names like `number`, `string`, `boolean`, `array`,
   and user ADTs, checked mostly through JavaScript runtime patterns. Add
   embedded primitives such as `u8`, `u16`, `u32`, `i32`, `bool`, `ptr`,
   `volatile`, and fixed arrays. Decide whether embedded types are normal
   keyword annotations, target-gated annotations, or a separate namespace.

4. Add an embedded safety/effect model.

   Track capabilities such as `mmio`, `gpio`, `irq`, `delay`, `unsafe-c`, and
   `heap`. Make hardware access explicit, probably through blessed modules or
   macros rather than arbitrary pointer forms. Enforce ISR-safe and
   no-allocation rules as profile checks.

5. Create a C-oriented IR, not a JS-kernel reuse.

   The existing kernel is a thin JavaScript dialect: JS operators, modules,
   classes, promises, objects, `typeof`, and related semantics. Add something
   like `embedded::ir` or `c_ir` with declarations, fixed-width types,
   structs/enums, functions, statements, expressions, and volatile
   reads/writes. Then add `codegen_c`, parallel to the current JS codegen.

6. Prototype with a tiny subset.

   Start with `bind`, `func`, primitive arithmetic, `if`, `do`, and fixed-width
   return types. Then add ADTs as C tagged structs/unions. Then add GPIO/MMIO
   as the first real embedded capability.

7. Defer JS parity.

   The JS compiler is valuable for browser Lykn, but embedded should begin in
   Rust. Later, if useful, the JS compiler can validate embedded syntax for
   docs or playground use, but it should not define the embedded semantics.

8. Avoid baking vendor HALs into Lykn.

   A better first shape is for Lykn to emit C against a tiny owned embedded
   ABI/shim. Board/vendor support can then live in per-target C headers or
   runtime glue, not scattered through compiler semantics.

## First Research Artifact To Open Later

The most important first formal artifact is not a C backend implementation.
It is a target-profile design slice that answers:

```text
Which Lykn forms survive under freestanding-c, what safety guarantees does
that profile make, and where does JS-shaped semantics stop?
```
