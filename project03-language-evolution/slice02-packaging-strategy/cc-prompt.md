# CC prompt — Slice 02: packaging-strategy (execution phases)

You are CC, the implementing context for the **execution phases** of a
packaging-strategy research slice. Read these first, in order:

1. `project03-language-evolution/slice02-packaging-strategy/slice-plan.md` — the
   plan-of-record, especially the Background section (this is CDC's
   committed research; treat it as the starting hypothesis, not settled
   fact — D-1 in particular exists because it needs independent checking)
2. `project03-language-evolution/slice02-packaging-strategy/ledger.md` — you own rows
   **D-1, D-2, D-3, D-4, D-5, D-6, D-7**; update Evidence (strength
   *attested*) as each lands, not at the end
3. `CLAUDE.md` — especially the **Lykn CLI safety gates** section (do not
   auto-pass `--allow-dirty`, `--no-verify`, or similar to any tool you
   invoke)

**Hard constraints:**

- This slice is **research and drafting only**. Do not modify compiler,
  CLI, dist, or CI code. Your writes are confined to
  `docs/design-v0.7.0/02-packaging-strategy/evidence/`,
  `docs/design-v0.7.0/02-packaging-strategy/artifacts/`, and the ledger
  file. Draft artifacts (formula, `.deb` config, workflow YAML) live here,
  not at their eventual real repo locations — this slice does not publish
  or merge anything.
- Do not write `report.md` — CDC assembles the report from your evidence.
  Your deliverable is evidence + draft artifacts + ledger updates + a
  short run-notes file (`evidence/cc-run-notes.md`) for anything
  surprising.
- If a step requires an environment you don't have (most likely: no
  macOS/Homebrew reachable for D-4), don't fake it — record the no-op with
  the specific reason and what would be needed to complete it. That's a
  valid, disclosed outcome, not a blocker.

## Phase P0 — Deno/Debian-archive verification → `evidence/deno-debian-check.md`

CDC's finding (slice-doc Background) is that Deno is not in the official
Debian archive, sourced from web search pointing at
`https://github.com/denoland/deno/issues/1583` and secondary blog posts.
This is the single claim the whole Debian-route recommendation rests on —
verify it directly, don't re-search:

```sh
# On a real Debian/Ubuntu system or container if available:
apt-cache search '^deno$'
apt-cache policy deno
# Or check Debian's package tracker directly:
# https://tracker.debian.org/pkg/deno  and  https://packages.debian.org/search?keywords=deno
```

If no Debian system/container is reachable, use `docker run --rm debian:stable apt-get update && apt-cache search deno` (or the closest equivalent your sandbox allows) rather than skipping the check. Record the transcript and, separately, whether the upstream issue (denoland/deno#1583) is still open and what the most recent comment says about *why* — this is D-1's evidence.

## Phase P1 — runtime-dependency re-verification → ledger D-2

```sh
grep -rn "Command::new" crates/lykn-cli/src/
```

Confirm the three tools found (`deno`, `npm`, `git`) and their call sites
match the slice-doc's Background list, and confirm no additional
`Command::new` (or `std::process::Command` alias) call sites were missed.
Update D-2's evidence with the grep transcript.

## Phase P2 — Homebrew formula draft + validation → `artifacts/lykn.rb`, `evidence/brew-validation.md`

Draft a Homebrew formula for a custom tap (not homebrew-core). Shape:

```ruby
class Lykn < Formula
  desc "Lisp Flavoured JavaScript — compiles to clean, dependency-free JS"
  homepage "https://github.com/lykn-lang/lykn"
  url "https://github.com/lykn-lang/lykn/archive/refs/tags/v<VERSION>.tar.gz"
  sha256 "<fill in from the actual release tarball>"
  license "Apache-2.0"

  depends_on "rust" => :build
  depends_on "deno"

  def install
    system "cargo", "install", *std_cargo_args(path: "crates/lykn-cli")
  end

  test do
    system "#{bin}/lykn", "--version"
  end
end
```

Adjust the `install` stanza if `std_cargo_args` doesn't resolve cleanly
against this workspace's layout (it's a multi-crate workspace, not a
single-crate repo — worth checking `cargo install --path crates/lykn-cli`
manually first). If `brew` is reachable in your environment: `brew audit --strict --online artifacts/lykn.rb` (adjust path handling as needed for a non-tap-installed formula) and, if feasible, a real `brew install --build-from-source` against a scratch tap. If not reachable, record the no-op in `evidence/brew-validation.md` with what a human would need to run locally to finish this check — do not skip silently.

## Phase P3 — Debian packaging draft + local build → `artifacts/` (deb config), `evidence/cargo-deb-build.md`

Use `cargo-deb` (install if needed: `cargo install cargo-deb`). Add a
`[package.metadata.deb]` section as a **draft** — do not commit it to the
real `crates/lykn-cli/Cargo.toml`; write it to
`artifacts/Cargo.toml.deb-metadata-draft` and copy it into a scratch copy
of the workspace (e.g. under `/tmp`) to actually build, so this slice's
"no production code changed" guarantee (D-9) holds. Shape to start from:

```toml
[package.metadata.deb]
maintainer = "<TBD — operator to fill in>"
copyright = "2026, <TBD>"
license-file = ["../../LICENSE", "4"]
extended-description = "Lisp Flavoured JavaScript — compiles to clean, dependency-free JS."
depends = "$auto"
recommends = "deno"
section = "devel"
priority = "optional"
assets = [
    ["target/release/lykn", "usr/bin/", "755"],
]
```

Run `cargo deb` (or `cargo deb -p lykn-cli` from the workspace root, in
your scratch copy) and record the full transcript, including any errors —
a failed build with a clear diagnosis is a valid, useful outcome for D-6,
not something to paper over.

## Phase P4 — CI gap analysis + draft workflow → `report.md` §CI gap (leave a placeholder note for CDC), `artifacts/release-workflow-draft.yml`

Confirm current CI coverage:

```sh
grep -n "runs-on" .github/workflows/*.yml
```

Draft (do not add to `.github/workflows/`) a release workflow covering a
build matrix of at least `ubuntu-latest` (x86_64), `ubuntu-latest` via
cross/musl or an arm64 runner (arm64), `macos-13` (x86_64), and
`macos-14` (arm64) — note in `cc-run-notes.md` whether `cargo-dist` looks
like a good fit for generating this matrix given the workspace's
multi-crate layout, or whether a hand-written matrix is preferable.

## Close-out

- Ledger rows D-1 through D-7: Evidence filled, strength *attested*.
- `evidence/cc-run-notes.md`: anything the plan did not anticipate —
  surprises here are contributions, not failures. In particular: if D-1
  overturns the Deno/Debian-archive finding, say so plainly and flag it as
  a **finding that changes the report's recommendation**, not a minor
  note.
- Per LEDGER-DISCIPLINE.md: if a criterion is unclear or wrong, raise an
  amendment request; do not work around it. Iteration budget five — if
  blocked, name the blocker and stop rather than improvising.
