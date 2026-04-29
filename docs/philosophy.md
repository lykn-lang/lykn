# Lykn Language Philosophy

> **Status:** Living document, version 0.1, drafted 2026-04-29.
> **Authors:** Duncan McGreggor and Claude (Cowork session).
> **Position in the corpus:** Foundational. `assets/ai/SKILL.md` and the
> `docs/guides/` corpus derive from these principles; where a guide
> conflicts with this document, the guide is drift. This file is the
> ground truth.

---

## Preamble

Lykn is a new language. While the kernel language is a JavaScript dialect, its surface language is genuinely a _distinct_ language. The kernel language is not taught; it is an IR for compilers and language maintainers only. The surface language is the language that is taught. That is the language for which we provide tooling. Therefore, the taught, supported, tooled Lykn language is not a JavaScript dialect, not a preprocessor, not a syntactic skin over Deno. The fact that it _compiles_ to JavaScript and _runs_ on Deno is an implementation detail — true at the engineering layer, false at the user-experience layer.

This distinction is load-bearing. A user who writes Lykn should
experience Lykn the way a Rust developer experiences Rust or a Go
developer experiences Go: a coherent language with a coherent
toolchain, where the underlying machinery is invisible during normal
work. The compiled output exists; users do not interact with it.
The `lykn` binary wraps every operation; users never reach around it.

What follows are the three principles that make that experience real,
the rationale for each, the practical implications, and the audit
checklist by which we measure compliance.

---

## The three principles

### Principle 1 — Source-only tree

A Lykn user, looking at their project's source tree, sees only
`.lykn` and `.lyk` files (plus configuration and metadata —
`deno.json`, `project.json`, `LICENSE`, `README.md`). They do **not**
see compiled `.js`, `.ts`, `.d.ts`, or any artifact of the
compilation pipeline.

Compiled output, intermediate files, and build artifacts live in a
dedicated build directory — `dist/`, `target/`, or equivalent — which
is gitignored and treated as ephemeral. The pattern matches Rust
(`target/`), Go (build output discarded by default), C/C++ (`build/`),
and every other cleanly-compiled language.

This is not a stylistic preference. It is a structural commitment:
mixing source and compiled output in the same directory tree is the
mark of a transpiler-flavoured tool, not a language. Lykn is the
latter.

### Principle 2 — `lykn`-only tooling

A Lykn user runs `lykn <command>` for every project operation: build,
test, lint, format, run, publish, scaffold, check. They do **not**
invoke `deno`, `npm`, `cargo`, `node`, or any other underlying tool
directly during normal project work.

The Lykn CLI is the _surface_ of the language. Underlying tools
exist, are wrapped by `lykn` subcommands, and do their work invisibly.
A user encountering a need to invoke deno (or npm, or cargo) directly
has, by definition, hit a tooling gap that Lykn should close — not a
usage they should adopt.

(Exception: contributors _to_ Lykn itself, working on the compiler
or its Rust crates, use cargo to build the `lykn` binary. That is
"working on Lykn," not "using Lykn," and falls outside this
principle's scope.)

### Principle 3 — Compiler-owned output quality

The Lykn compiler is responsible for producing JavaScript output
that is properly formatted, lint-clean, and behaviorally correct.
Errors in compiled JS are language-level bugs, not user-facing
issues.

The user never runs `deno fmt`, `deno lint`, or `deno test` against
compiled output. If the compiler produces malformed, ugly, or buggy
JS, that is a defect in the Lykn compiler — to be reported,
diagnosed, and fixed in the toolchain. The user is not the validator
of compiled output.

This principle places a real burden on the compiler test suite: it
must cover the edge cases that would otherwise be caught by
post-compile linting. Compiler quality is the only mechanism that
delivers compiled-output quality, because the user is never invited
to look at — let alone validate — what the compiler produces.

---

## Rationale

The three principles converge on a single claim: a programming
language earns its identity by giving users a coherent surface, not
by being technically interesting underneath. The technical interest
is for the compiler authors. The surface is for the users.

Specific cross-domain references that informed these principles:

- **Rust's `target/` discipline.** Rust users see `.rs` files; build
  output goes to `target/`, which is gitignored by default. The
  `cargo` toolchain wraps everything. A Rust developer rarely
  invokes `rustc` directly; they invoke `cargo build`, `cargo test`,
  `cargo clippy`. The toolchain is the surface.
- **Go's tooling discipline.** Source is `.go` files. The `go`
  command does compile, test, format, vet, install. The Go user
  doesn't invoke an underlying linker, doesn't manage a build
  directory by hand, doesn't see object files.
- **TypeScript's contrast.** TypeScript users _do_ often see
  compiled `.js` and `.d.ts` files in their tree, because TypeScript
  positions itself as a JavaScript dialect — a transpiler-flavoured
  tool, not a language. This is one of the things Lykn explicitly
  diverges from.
- **Anthropic's "the surface is the product" principle.** What the
  user touches is what the language is. Implementation details that
  leak through the surface are bugs at the product layer, even when
  they're correct at the engineering layer.

---

## Implications

### What the user experiences

When a user works on a Lykn project, their experience matches this
sequence:

```sh
# Create a project
lykn new my-app

# Edit Lykn source files
# (only .lykn, .lyk, and config — no .js to be seen)

# Run the program
lykn run packages/my-app/main.lykn

# Run the test suite
lykn test

# Format source
lykn fmt

# Check syntax / lint source
lykn check       # syntax
lykn lint        # idiom / style / anti-patterns (when implemented; see Open Questions)

# Build for distribution
lykn build --dist

# Publish
lykn publish --jsr
lykn publish --npm
```

There is no `deno run`, no `deno fmt`, no `deno test`, no
`deno publish`, no `npm publish`, no `cargo build` (for the user's
project). Every command is `lykn <something>`. The `lykn` binary
internally calls the underlying tools as needed — that is hidden.

### What Lykn contributors must ensure

For Principle 1 to hold:

- `lykn compile` writes its output to a build-artifact directory
  (`dist/`, `target/`, or equivalent), not alongside source.
- `lykn build --dist` operates on `.lykn` source directly, producing
  a `dist/` tree without intermediate `.js` files in the source tree.
- The `lykn new` scaffold's `.gitignore` includes the build-artifact
  directory and any `*.js` patterns that would catch stray compiled
  output.
- Source `deno.json`'s `exports` field references the _built_ path
  (e.g., `./dist/mod.js`), not a source-tree sibling.

For Principle 2 to hold:

- Every operation a user performs has a `lykn <subcommand>` entry
  point. Where the operation is currently fulfilled by a raw deno
  command, `lykn` must wrap it.
- Workflow documentation (`15-lykn-cli.md`, the Makefile examples,
  the SKILL) shows only `lykn <command>` invocations.
- Where `lykn <subcommand>` exists but doesn't yet do the right
  thing (see Known violations), it should at minimum produce a clear
  "not implemented" message rather than silently delegating to a
  wrong layer.

For Principle 3 to hold:

- The Lykn compiler test suite covers formatting, lint-cleanliness,
  and edge-case correctness of generated JavaScript. The "did the
  compiler produce valid output" question is answered by the
  compiler's own tests, not by the user running `deno lint` after
  the fact.
- Compiler bugs that produce malformed JS are flagged as bugs and
  fixed in the compiler — not papered over with post-hoc formatting
  passes the user would invoke.

### What downstream packages look like

A published Lykn package, viewed on JSR or npm, contains compiled
JavaScript artifacts. That is a natural property of distribution —
the consumer of the package may not be a Lykn project. What the
consumer sees:

- On JSR / npm: a directory of compiled `.js` (and possibly `.d.ts`)
  files, plus `LICENSE`, `README.md`, and metadata.
- In their Lykn project: a `jsr:@<scope>/<pkg>` import that resolves
  through Deno's cache. The consumer's project remains source-only
  in their tree; the cached package contents are an implementation
  detail of resolution.

The publishing pipeline (`lykn publish --jsr`, `lykn publish --npm`)
operates on the `dist/` build artifacts directly — not through `git`
— so the source repo's gitignore can correctly exclude `dist/` and
the publish flow still works.

---

## Audit checklist

The following grep-verifiable checks operationalize compliance with
this document. They are designed to be run as a periodic audit — and
specifically as the spec for any "philosophy alignment" milestone.

### Principle 1 checks

- **No `.js` or `.ts` files in `packages/<name>/`** (other than
  intentional hand-written JS shims, which should be flagged
  explicitly):
  `find packages -name "*.js" -o -name "*.ts" | grep -v dist`
  should return nothing in a freshly-built project.
- **`.gitignore` includes build-artifact directories**:
  `grep -E "^(dist|target|build)/" <scaffold>/.gitignore` returns matches.
- **Source `deno.json` `exports` field references built path**:
  `grep -E '"exports".*"\./mod\.js"' packages/*/deno.json` (without
  `dist/`) should return _no_ matches; `grep -E '"exports".*"\./dist/'`
  should return matches in a properly-aligned scaffold.

### Principle 2 checks

- **No raw `deno`/`npm`/`cargo`/`node` commands** in user-facing
  workflow documentation:
  `grep -rnE "^(deno|npm|cargo|node) " docs/guides/ assets/ai/SKILL.md`
  should return matches _only_ in MUST-AVOID, counter-cue, or
  reference contexts (verifiable via context inspection — same
  pattern as M2's reconciliation audit).
- **Every common operation has a `lykn` subcommand**:
  `lykn --help` should list `compile`, `run`, `test`, `fmt`, `check`,
  `lint`, `new`, `build`, `publish`. Each subcommand should produce
  meaningful behavior (or a clear "not implemented" message — never
  silent delegation to a wrong layer).
- **Scaffold's `Makefile` (if generated) uses only `lykn` commands**:
  `grep -nE "^\t(deno|npm|cargo) " <scaffold>/Makefile` should return nothing.

### Principle 3 checks

- **`lykn build --dist` produces valid JS without external
  validation**: a fresh `lykn new && lykn build --dist` in a scratch
  dir produces a `dist/` tree that passes `deno lint` and
  `deno fmt --check` _without any user invocation_. (The check is
  internal to compiler verification; the user never runs it.)
- **Compiler test suite includes formatting / lint cases**:
  `grep -rnE "deno_lint|deno_fmt|format_check" crates/lykn-compiler/`
  (or wherever compiler tests live) returns coverage. (Or, if the
  test suite uses different mechanisms, the equivalent: tests assert
  output JS is well-formed and idiomatic.)

---

## Known violations (current state, 2026-04-29)

These are places where the current implementation does not yet match
the philosophy. They are listed so a remediation milestone can audit
them and either fix or explicitly defer.

### From Phase 1 work

- **`lykn compile` writes `.js` next to `.lykn` source.** The compiler's
  default output target is the source directory, producing
  `mod.js` next to `mod.lykn`. Should write to `dist/` (or `target/`)
  by default.
- **`.gitignore` does not exclude `*.js` from source tree.** Currently
  excludes `dist/`, `bin/`, `*.js.map` but not `*.js`. Under
  Principle 1, `.js` should not appear in the source tree, so
  ignoring `*.js` is defensive (catches stray output from misconfigured
  builds).
- **Source `deno.json` `exports` references `./mod.js`** (a source-tree
  sibling), not `./dist/mod.js`. The current scaffold and the `lykn
  build --dist` pipeline are calibrated to the misaligned state. The
  M3 work _aligned the scaffold to current behavior_; aligning to
  philosophy will require adjusting both the compiler's output target
  and the exports-field convention.
- **`lykn lint` lints compiled JS via `deno lint`.** Under Principle 3,
  this is exactly the operation the user should never need to perform
  — compiler-produced JS should already be lint-clean. The command
  should be stubbed to produce a "not implemented yet" message until
  a Lykn-source linter is built (see Open Questions).
- **`lykn fmt` does not wrap `deno fmt` for compiled output.** Currently
  `lykn fmt` formats `.lykn` source. Under Principle 3, compiled
  output formatting is the compiler's responsibility, so `lykn fmt`
  _correctly_ does not need to handle compiled output. (No fix
  required for this one — the gap I previously identified was wrong.)
- **`15-lykn-cli.md` workflow documentation exposes raw `deno test`,
  `deno run`, `deno fmt`, `deno lint` commands.** Per Principle 2,
  these should all be `lykn` invocations. Some require wrappers that
  already exist (`lykn test`, `lykn run`); others (`deno fmt`,
  `deno lint` of compiled output) shouldn't be in workflows at all
  per Principle 3.

### From earlier in the codebase's history

- **Some guides and SKILL.md sections** still describe the toolchain
  in the language of "compile → format → lint → test" as if those
  were _user-facing_ steps. They should describe a single
  `lykn build --dist` (or similar) where the underlying steps are
  invisible.

---

## Decided design questions

The five questions raised in the v0.1 draft were resolved on
2026-04-29. Each is recorded here — both the resolution and the
reasoning — so the audit checklist and the remediation milestones can
reference them.

1. **Build-artifact directory name (and Deno conflict question).**
   _Decision:_ `dist/` for now (current convention; matches npm
   convention; no built-in semantic conflict with Deno — Deno does
   not own a `dist/` directory at the toolchain level, only `deno.json`
   for config). _0.6.0 plan:_ regardless of whether a conflict surfaces
   in practice, reorganize to `./target/lykn/build/` (intermediate
   compiler output) and `./target/lykn/dist/` (publish-ready staging),
   matching Rust's `target/` discipline more cleanly and disambiguating
   build artifacts from publish artifacts. The `target/lykn/...`
   namespace also makes the directory plainly Lykn-scoped, removing
   any ambiguity if other tooling ever adopts a top-level `dist/` of
   its own.

2. **`lykn lint` scope when implemented.** _Decision:_ Option A.
   When a Lykn-source linter ships (tentatively 0.6.0), `lykn lint`
   lints Lykn source only — anti-patterns, idiom, style. The
   compiled-JS-lint capability goes away from the user surface;
   compiler-output quality is owned by Principle 3 (compiler test
   suite covers it). _Immediate action:_ the current `lykn lint`
   implementation, which delegates to `deno lint` against compiled
   JS, must be replaced with a clear "not implemented yet" message
   so users are not invited to operate on compiled output.

3. **Compiler output target.** _Decision:_ folded into the 0.6.0
   build-dir reorganization (item 1). The reorg is a 0.6.0 commitment
   regardless of whether the publish-artifact concern surfaces in
   practice — the structural cleanliness of `target/lykn/build/` for
   intermediates and `target/lykn/dist/` for publish-ready output is
   worth doing for its own sake. Principle 1 is satisfied either by
   `dist/` (current) or by the 0.6.0 reorg; both keep `.js` out of
   the source tree.

4. **JSR publishing only via `lykn publish`.** _Decision:_ accepted as
   an architectural commitment. `lykn publish --jsr` is the only
   supported publish path; a user invoking `deno publish` directly
   will get nothing (because compiled output lives in a gitignored
   build dir, and `deno publish` operates on git-tracked files). This
   is _correct_ under Principle 2 — they shouldn't be reaching around
   the Lykn CLI. _0.6.0 enhancement:_ `lykn publish` should fail if
   the project has uncommitted changes (mirroring `cargo publish` /
   `deno publish` behaviour), with an override flag (`--allow-dirty`
   or equivalent) for cases where the user explicitly accepts the
   risk. This makes the publish gate explicit at the lykn surface
   rather than implicit in the underlying tools.

5. **Editor / LSP integration.** _Decision:_ the LSP works against
   `.lykn` files. 100% surface-language experience — diagnostics,
   completions, go-to-definition all operate at the Lykn level. The
   user never sees the LSP reasoning about compiled JS. This is the
   only resolution consistent with all three principles; any LSP
   that surfaces compiled-JS state would violate Principle 1
   (exposes the compilation pipeline) and arguably Principle 2
   (introduces a non-Lykn tool surface).

---

## 0.6.0 commitments

Three items above are explicit 0.6.0 commitments, gathered here for
visibility:

- **Build-dir reorganization** to `./target/lykn/build/` and
  `./target/lykn/dist/`. Touches the Rust CLI (compile output
  target, build/dist staging logic), `lykn new` scaffold templates
  (`.gitignore`, source `deno.json` `exports` field), and
  documentation.
- **Lykn-source linter** for `lykn lint`. New work: AST-level checks
  for anti-patterns, idiom, style. The corpus in
  `docs/guides/09-anti-patterns.md` and the surface forms reference
  is a starting point for the rule set.
- **`lykn publish` uncommitted-changes check.** Fails by default if
  the project has uncommitted changes; `--allow-dirty` (or named
  equivalent) overrides. Matches `cargo publish` and `deno publish`
  conventions.

These commitments do not block the 0.5.1 ship. 0.5.1 is the
documentation/scaffold/SKILL alignment release; 0.6.0 is the language-
toolchain alignment release where these structural commitments land.

---

## Provenance

This document was developed jointly by Duncan McGreggor and Claude
(Cowork session, 2026-04-29) during Phase 1 of the Lykn 0.5.1
remediation work. The principles surfaced when CDC review of M3
revealed a cognitive mismatch in earlier dispositions: I had been
calibrating against the current implementation rather than against
the language's stance toward its users. Duncan named the philosophy
explicitly; this document captures it.

The principles are foundational and expected to be stable; the
"Known violations" and "Open questions" sections will evolve as the
codebase converges on the principles and as new tooling design
questions surface.

Future readers — Claude (any future Cowork or CC session), human
contributors, downstream developers — should treat the three
principles as ground truth for "what Lykn is." Implementation choices
that conflict with them are drift to be remediated. New design
questions that arise should be checked against them: does the
proposed shape preserve source-only trees, Lykn-only tooling, and
compiler-owned output quality?

---

## Audit roadmap (informational; not part of this document's scope)

The remediation work this document enables — auditing the codebase
against the three principles, fixing what diverges, deferring what's
non-trivial — is structured as Phase 1.5 (cleanup of philosophy-
adjacent items that fall within Phase 1's docs/scaffold scope) plus
Phase 2 / Phase 3 work for the items requiring Rust-CLI changes
(`lykn compile` output target, `lykn fmt` scope, `lykn lint`
implementation). The specific milestones will be drafted separately;
they are not a part of this philosophical document.
