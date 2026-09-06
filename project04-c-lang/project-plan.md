---
project: project04-c-lang
status: research-seed
planned-release: "0.8.0"
depends-on: ["project03-language-evolution"]
blocks: []
related: ["project05-hardware"]
---

# Lykn 0.8.0 Project Plan

Status: very early research seed
Created: 2026-08-20
Branch: release/0.8.x

## Purpose

Lykn 0.8.0 is tentatively reserved for exploring whether Lykn's typed
S-expression surface can support embedded development through a C-oriented
target path.

This is not yet a committed implementation plan. The immediate goal is to
hold the question in a durable location while preserving the distinction
between:

- Lykn as a JavaScript-targeting language today.
- Lykn as a reusable compiler architecture.
- A possible embedded/freestanding target profile.
- A possible C code generation backend.

## Working Hypothesis

The most promising direction is not "reuse the JS kernel IR and print C."
The more plausible path is:

```text
Lykn source
  -> typed Lykn core / surface AST
  -> target-profile validation
  -> embedded-oriented IR
  -> C codegen
  -> freestanding or vendor-toolchain C
```

The Rust compiler is the likely first exploration surface because it already
has a typed surface AST, static analysis, an emitter boundary, and pure Rust
JavaScript code generation. The JS compiler remains important for browser and
reference behavior, but should not define the embedded target semantics.

## Project Boundary

In scope for the research opening:

- Compare the current Rust and JS compiler boundaries against the embedded
  target idea.
- Define what a minimal embedded target profile would mean.
- Identify which existing Lykn forms are reusable, restricted, forbidden, or
  target-specific under an embedded profile.
- Decide whether the right lower layer is a generalized multi-target IR or a
  separate embedded/C IR beside the existing JS kernel.
- Sketch the first tiny compileable subset before any production backend work.

Out of scope for the research opening:

- Implementing C codegen.
- Selecting a vendor SDK, board, or MCU family as the permanent target.
- Changing current 0.6.x or 0.7.x behavior.
- Promising that Lykn will support embedded development in 0.8.0.

## Arc Roadmap

### arc01-c-target-research

Status: opened as a seed only.

Purpose: turn the initial compiler/backend brainstorm into a grounded research
program for a possible embedded C target.

Current artifacts:

- docs/design-v0.8.0/arc01-c-target-research/arc-plan.md
- docs/design-v0.8.0/arc01-c-target-research/initial-thoughts.md

## Open Questions

- Should "embedded Lykn" be a target profile on the existing surface language,
  a dialect, or a separate layer?
- Should the first backend target strict freestanding C, a small Lykn-owned C
  ABI, or a real vendor HAL?
- Which Lykn forms should be rejected under an embedded profile even if they
  can be expressed in C?
- Can Lykn's existing ADT and match analysis become useful for C tagged
  structs/unions without overfitting to JavaScript's tagged-object model?
- How should target capabilities be represented: types, effects, modules,
  compiler flags, or some combination?
- What is the smallest demonstrator that teaches us something real?

## Next Move

Pause. Let the idea breathe before opening formal slices or assigning
implementation work.
