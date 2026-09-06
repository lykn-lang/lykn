# Arc01: C Target Research

Status: very early research seed
Created: 2026-08-20

## Purpose

This arc exists to investigate whether Lykn can become a useful syntax and
safety layer for embedded development by adding an embedded/C target path.

The arc starts from one architectural observation: Lykn has already proven a
compiler workflow from typed S-expressions through a normalized lower layer to
a destination language. The research question is how much of that workflow can
be reused when the destination is C for OS-less or constrained hardware rather
than JavaScript for Deno/browser environments.

## Current Read

The current codebase suggests a conservative direction:

- Reuse the Rust compiler front half where possible.
- Add target-profile validation before target lowering.
- Treat the existing JS kernel as JavaScript-specific.
- Add a new embedded/C IR only after the target contract is clear.
- Keep vendor SDKs behind a small owned ABI or target adapter until evidence
  says otherwise.

## Research Threads

1. Target profile

   Define what "embedded" means to Lykn: freestanding C, no hidden heap,
   fixed-width numeric types, explicit effects, restricted imports, no
   JavaScript interop, and target-specific capability boundaries.

2. Surface-form classification

   Classify each current Lykn surface form as reusable, restricted,
   forbidden, target-specific, or undecided under an embedded profile.

3. Type model

   Determine how embedded primitives such as `u8`, `u16`, `u32`, `i32`,
   `bool`, fixed arrays, pointers, volatile registers, and peripheral handles
   fit with the current type annotation model.

4. Effect and capability model

   Explore how Lykn could represent MMIO, GPIO, interrupts, timing, unsafe C,
   and allocation boundaries without turning the language into a thin macro
   wrapper over C.

5. IR and backend shape

   Decide whether the embedded path wants a new IR beside the JS kernel or a
   generalized multi-target lower layer. Prefer evidence over elegance.

6. First demonstrator

   Identify the smallest compileable example that teaches us something real,
   such as typed arithmetic, a pure function, a tagged ADT, or a GPIO blink
   through a tiny C shim.

## Non-Goals For Now

- No production C backend.
- No board-specific commitment.
- No rewrite of the current JS compiler.
- No modification of 0.6.x or 0.7.x release commitments.
- No claim that 0.8.0 ships embedded support.

## Seed Artifacts

- `initial-thoughts.md` preserves the first grounded TODO list from the
  compiler reconnaissance pass.

## Next Step

After reflection, open a formal research slice only if the direction still
feels worth pursuing.
