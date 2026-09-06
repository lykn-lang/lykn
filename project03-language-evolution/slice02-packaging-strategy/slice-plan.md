# Slice 02: packaging-strategy — plan-of-record

**Status:** open (2026-07-07)
**Kind:** research + strategy — no production code changes; draft packaging
artifacts land under this slice's own directory, not the repo's release path
**Feeds:** 0.7.0 project definition (candidate arc: release engineering /
distribution)

## Goal

Determine how `lykn` gets into Homebrew and (as the first Linux target)
Debian, given its Rust build and its runtime dependency on Deno, and produce
a strategy report the 0.7.0 project-plan can turn into a real
implementation arc. The report answers four questions:

1. **What does the compiled `lykn` binary actually require at runtime**,
   and does that constrain the packaging routes available?
2. **What is the realistic Homebrew path** — custom tap vs. homebrew-core —
   and what does a working formula look like?
3. **What is the realistic Debian path**, given Deno's own packaging
   history, and what does a working `.deb` + distribution channel look
   like?
4. **What has to change in CI/release tooling** before either artifact can
   be built repeatably, and what is the recommended arc/slice breakdown for
   that implementation work?

## Background (established in the 2026-07-07 planning session)

- The compiled `lykn` binary shells out to exactly three external tools,
  all in `crates/lykn-cli/src/`: **`deno`** (mandatory — `bridge.rs:30`,
  `main.rs:404/784/811/1027/1392`; compile/run/test/`publish --jsr` all
  fail without it, per the existing error message in `bridge.rs:38`),
  **`npm`** (conditional — `main.rs:1053/1066`, only for
  `lykn publish --npm`), and **`git`** (conditional — `main.rs:970`, only
  for the dirty-tree gate unless `--allow-dirty`). `make` and `bash` are
  this repo's *dev* tooling (the Makefile); the shipped binary does not
  invoke either. This resolves an assumption in the original ask — the
  wrapped-tool surface for packaging purposes is `{deno, npm*, git*}`, not
  `{make, bash, deno, npm, git}`.
- Cargo workspace: `crates/lykn-lang` (lib, no bin), `crates/lykn-cli`
  (produces the `lykn` binary, dependencies `clap`, `indexmap`, `serde`,
  `serde_json`, `thiserror` — all common, already-packaged-in-Debian
  crates; no system-library bindings), `crates/lykn` (thin re-export
  wrapper). All three at v0.5.2, license `Apache-2.0` (DFSG- and
  Homebrew-compatible), repository `https://github.com/lykn-lang/lykn`.
- **No packaging material exists in the repo today** — confirmed by a
  repo-wide case-insensitive search for `homebrew`, `debian`, `.deb`,
  `formula`, `apt`, `cargo-deb`, `cargo-dist`.
- **CI builds only `ubuntu-latest` x86_64** (`.github/workflows/ci.yml`);
  there is no release job and no multi-platform build matrix. Both target
  ecosystems need at minimum linux-x86_64 (+ ideally arm64) and (for
  Homebrew) macOS x86_64/arm64 builds.
- **Homebrew:** homebrew-core requires 30 forks/watchers or 75 stars before
  it will accept a formula — not met, so the entry path is a custom tap
  (e.g. `lykn-lang/homebrew-lykn`), not homebrew-core submission. Deno
  itself **is** in homebrew-core, so `depends_on "deno"` in a lykn formula
  resolves cleanly against an existing, bottled dependency; the build step
  is the standard `depends_on "rust" => :build` + `cargo install --locked`
  pattern.
- **Debian:** the official archive route is blocked by something upstream
  of lykn's own crate tree. Debian's Rust policy
  (`rust-team.pages.debian.net/book/policy.html`) requires every crate
  dependency to exist in the archive as its own `librust-*-dev` package —
  mechanical but tractable, since lykn's actual dependency list is small
  and mainstream. The real blocker is that **Deno itself is not in the
  Debian archive** — [a six-year-old open upstream issue](https://github.com/denoland/deno/issues/1583),
  attributed (via search, not yet independently confirmed against Debian's
  package tracker — see ledger row D-1) to `rusty_v8` bundling a prebuilt
  V8 binary blob that conflicts with Debian's build-from-source policy. A
  `Depends: deno` line in a `.deb` cannot resolve against the official
  archive regardless of how well lykn's own crates are packaged. The
  practical route is therefore a **self-hosted APT repository**
  (`cargo-deb` + a signed repo via `aptly`/`reprepro`), with Deno declared
  as `Recommends` plus a documented manual-install step — the same posture
  Deno takes for its own distribution.
- **`cargo-dist`** is the current standard tool for generating a
  cross-platform GitHub Actions release matrix and Homebrew tap
  publishing in one pass; it does not generate `.deb`s, so `cargo-deb`
  stays a separate step in the pipeline either way.
- Operator decision (2026-07-07): target the self-hosted-APT-repo route
  for Debian, not the official-archive route, and not deferral.

## Scope

**In:**

- Confirm/refute the runtime-dependency inventory above by grep (already
  attested; CC re-verifies).
- **Independent verification of the Deno/Debian-archive claim** — check
  Debian's actual package tracker / `apt-cache` output, not just search
  results, since the current sourcing is web-search-attested.
- Draft a working Homebrew formula (`lykn.rb`) for a custom tap, and, if a
  macOS/Homebrew environment is reachable from the execution context,
  validate it (`brew audit`, `brew install --build-from-source` against a
  local tap checkout).
- Draft a working `.deb` packaging config (`Cargo.toml` `[package.metadata.deb]`
  or a standalone `debian/` control set for `cargo-deb`), and validate it
  with a local `cargo deb` build.
- A gap analysis of what CI/release tooling needs to change (multi-platform
  build matrix, artifact publishing) to support both routes, with a
  **draft** (not merged) GitHub Actions workflow addition.
- The strategy report (`report.md` in this directory), including a
  recommended 0.7.0 arc/slice breakdown for the actual implementation
  work.

**Out:**

- Actually creating/publishing the `lykn-lang/homebrew-lykn` tap repo.
- Actually standing up hosting for a self-hosted APT repository (signing
  infrastructure, hosting choice, DNS) — the report recommends an
  approach; standing it up is implementation-arc work.
- Merging any CI workflow changes — drafts only, reviewed as part of this
  slice's report.
- Pursuing homebrew-core submission or the official Debian archive route
  (both ruled out by the background above, not re-litigated here unless
  CC's verification in D-1 overturns the Deno finding).
- Windows packaging (out of scope for this ask).

## Verification approach — predictions before evidence

Mirrors slice 01's split, for the same reason: the toolchain-grounded
claims (does `cargo deb` actually build cleanly against `lykn-cli`'s real
`Cargo.toml`; does the draft Homebrew formula actually pass `brew audit`)
need the real Rust/Deno/Homebrew toolchain, which this planning session's
sandbox does not reliably reproduce (in particular, no macOS/Homebrew is
reachable here at all).

1. **CDC static phase (this session):** ecosystem research, the
   runtime-dependency inventory, the Homebrew/Debian route decision
   matrix, and first-draft formula/packaging-config text — all committed
   to this directory before CC runs anything.
2. **CC execution phase** (operator hands off `cc-prompt.md`): the
   Deno/Debian-archive independent check, `cargo deb` build attempt
   against the real workspace, Homebrew formula validation (if a
   macOS/brew environment is available to the operator), CI matrix draft.
3. **CDC close phase:** divergence table (draft vs. what actually built/
   validated), report assembly with the recommended arc/slice breakdown,
   ledger walk.

**Named structural limitation:** same as slice 01 — CDC performs the
static research and verifies the slice. Mitigation: the toolchain-grounded
claims are pushed to CC specifically because they're the ones a sandbox
can't fake; CDC's job is research synthesis and drafting, which is
independently checkable against the cited sources.

## Roles and handoff points

| Phase | Who | Why |
|-------|-----|-----|
| Ecosystem research, dependency inventory, route decision matrix, draft formula/packaging text | CDC (Cowork session) | External research + drafting; no local toolchain or macOS needed |
| Deno/Debian-archive verification, `cargo deb` build, Homebrew formula validation, CI matrix draft | CC (operator hands off `cc-prompt.md`) | Requires the real Rust toolchain and (for Homebrew validation) a reachable macOS/Homebrew environment |
| Divergence analysis, report, recommended arc/slice breakdown, verification | CDC + operator gate | Judgment work stays in the main context |

## Exit criteria

The ledger rows in `ledger.md` (D-1 … D-9). Every row reaches
`done`/`deferred`/`no-op` with evidence per LEDGER-DISCIPLINE.md before this
slice closes. Iteration budget: five, per discipline.

## Version History

- **v1.0 (2026-07-07)** — initial plan-of-record. Layout
  (`project03-language-evolution/slice02-packaging-strategy/`, arc wrapper collapsed,
  project-plan deferred) follows the precedent set by
  `01-treeshake-audit/`, confirmed with the operator this date.
