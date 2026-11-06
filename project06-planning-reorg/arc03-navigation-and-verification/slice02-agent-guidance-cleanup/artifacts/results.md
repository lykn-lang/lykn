# Slice02 CC intake and implementation evidence

Date: 2026-11-05. Current assignment: `cc-prompt-iteration02.md` with all
unaffected initial requirements. CC Luna 6 High; CDC Sol 6.1 High; root
read-only coordinator. This intake is being written before any source/worktree
mutation. No files or indices have yet been changed.

## Source-cited contract readback

- The existing canonical `AGENTS.md` is regular mode 100644 and `CLAUDE.md` is
  a mode-120000 relative symlink to `AGENTS.md` in all seven homes; preserve
  that arrangement while rewriting agent-neutral guidance. The companion
  governance cleanup is a bounded explicit exception for main/task homes, not
  product code authority or branch integration.
- Lykn's three principles are source-only user trees, Lykn-only normal user
  tooling, and compiler-owned generated-output quality (`release/0.7.x` at
  `74a90d5`, `docs/philosophy.md` §§ “The three principles” and
  “Implications/What Lykn contributors must ensure”, lines 31–85, 159–195).
  Contributors may use native tooling for Lykn itself; ordinary Lykn project
  work uses `lykn`. The JavaScript compiler/browser path remains extant.
- `Cargo.toml` `[workspace]` (line 3) contains `lykn-lang`, `lykn-cli`, and
  umbrella crate `lykn`. `crates/lykn-cli/src/main.rs` `Commands` retains
  `Compile`, `Build`, and `Dist` (lines 39–65, 117–130); `Build` also keeps
  the browser flag. `cmd_build` marks `build --dist` deprecated and sends
  users to `lykn dist` (lines 1506–1548). Existing npm-resolved compiler
  inputs are not approval for new research dependencies or a Node project.
  No mandatory Lykn runtime in emitted JS is distinct from compiler deps.
- The Makefile defines `make help`, `make check-cited-paths`,
  `make test-suite`, `make test-docs`, and `make check`. `test-suite` calls
  `lykn test`; `test-docs` calls `lykn test --docs` over guides, README and
  examples; `check` includes `test`, which includes docs, so the docs chain is
  not duplicated. `test/CONVENTIONS.md` documents explicit raw-Deno
  `--config project.json -A test/`, bare imports and cwd-rooted fixtures.
  Lykn wrappers must not silently inject permission grants.
- Installed session skills are the routing authority: `rust-guidelines`,
  `javascript-deno-guidelines`, `testing`, and `collaboration-framework`, with
  `code-auditing`, `work-verification`, and `agent-coordination` routed as
  relevant. The repository-owned Lykn reference does not promise skill
  installation/discovery. No personal paths or external skill links return.
- Planning stays the canonical history/evidence home. Never merge planning
  into source; preserve plans, ledgers, prompts, historical records, source
  citation contexts and original human gates. Normal source propagation is
  0.6.x → 0.7.x → 0.8.x after divergence/local-edit review and with explicit
  integration/push authority. This governance cleanup is the scoped exception.
  `lib/`/opt-in JSR/selective entries/effects/API is future direction, not
  implementation, licensing or publication approval. Project07 synthesis,
  licensing, bootstrap, authoring/book and human gates remain with their plans.
- Placement changed twice before implementation. The initial
  `docs/guides/SKILL.md` proposal would put illustrative agent examples into
  executable doctests. Iteration01's `docs/skills/lykn/SKILL.md` proposal also
  changed after review. Current authority is root `skills/lykn/SKILL.md`,
  outside the doctest and docs-census populations. This preserves the
  reference's agent-guidance role without modifying selectors/example bodies.
  The known grouped Bindings/expected-JS mismatch in the five `241bc4d8...`
  variants is static GC-D01 follow-up for Project07 Arc03; it was not executed
  or repaired. `skills/` does not imply automatic skill registration or
  `.agents` discovery.
- Each source skill first reaches a byte-identical `git mv` checkpoint from
  its own original blob. Only then change the single stale DD49 URL to the
  assigned branch-qualified planning URL. Final bytes differ by exactly that
  citation in each source home. Main is never overwritten from another
  branch. The frozen citation census and historical plans stay unchanged.

## Opening worktree state and path inventory

Opening states were captured before changes using Git HEAD/status/index reads
and `lstat`/`readlink` only; external symlink targets were not traversed. All
seven homes were clean at these tips:

| Home | Branch | Opening HEAD | Status |
| --- | --- | --- | --- |
| repository root | `main` | `12afe1c7c7c8acaabce5b7b75e0df19f3b3fb6ec` | clean |
| `.worktrees/0.6.x` | `release/0.6.x` | `4dded883bbd321d19635e6fce233343f33803f9e` | clean |
| `.worktrees/0.7.x` | `release/0.7.x` | `74a90d51b853fc18fe2b7c6ee07417736e1ce464` | clean |
| `.worktrees/0.8.x` | `release/0.8.x` | `0f3c28ce78f127ec122334c22fd15b8b433905b7` | clean |
| `.worktrees/planning` | `planning` | `3732b2946cd7b7f15fe769872e0c0495b5fa1fc7` | clean before CDC amendment; current clean planning HEAD `7d53c693cddf2aea27a9d1d2a8faed98766d2725` |
| `.worktrees/native-esbuild-controls` | `codex/native-esbuild-controls` | `74a90d51b853fc18fe2b7c6ee07417736e1ce464` | clean |
| `.worktrees/contract-predicate-lowering` | `codex/contract-predicate-lowering` | `74a90d51b853fc18fe2b7c6ee07417736e1ce464` | clean |

Across all seven: `AGENTS.md` Git blob
`d796b8f37d655db9ad09d68d4b77847b4f9f4e9a`, mode 100644; file SHA-256
`f837dc71ab11ffc2a0a97997967aa6f2da222c5246c757412decbea107f633b3`.
`CLAUDE.md` blob `47dc3e3d863cfb5727b87d785d09abf9743c0a72`, mode 120000,
literal relative target `AGENTS.md` (filesystem symlink mode 0755). No new
`skills/lykn/SKILL.md` exists initially.

The six source `assets/ai/SKILL.md` files are regular mode 100644 (filesystem
0644). Main has blob `0205e6ea0457c0099f1dec0a36fc62b363cbaa9d`, SHA-256
`6d20ecc6c24b3fe9032d05fb26743feac86e06ee89a05b812d62c3e4b075434e`; each of
the other five has blob `241bc4d8ce5dfff153edec2462e012849e96b2ad`, SHA-256
`b6fe18c04e547efac0a2a62d3d95a437d76d7cec436bd453c07a0f454e03fa4a`.

`assets/ai` immediate-entry inventory, by `lstat`:

- Main: `SKILL.md`; tracked absolute symlinks
  `CLAUDE-CODE-COVERAGE.md` →
  `/Users/oubiwann/lab/billosys/ai-engineering/docs/CLAUDE-CODE-COVERAGE.md`,
  `CODE-AUDIT.md` → `/Users/oubiwann/lab/billosys/ai-engineering/docs/CODE-AUDIT.md`,
  `LEDGER_DISCIPLINE.md` →
  `/Users/oubiwann/lab/billosys/ai-engineering/templates/LEDGER-DISCIPLINE.md`,
  `SUBAGENT-DELEGATION-POLICY.md` →
  `/Users/oubiwann/lab/billosys/ai-engineering/docs/SUBAGENT-DELEGATION-POLICY.md`;
  five additional ignored/untracked links `AI-CONSTITUTION-SUPPLEMENT.md` →
  `/Users/oubiwann/lab/billosys/ai-engineering/docs/AI-CONSTITUTION-SUPPLEMENT.md`,
  `AI-ENGINEERING-METHODOLOGY.md` →
  `/Users/oubiwann/lab/billosys/ai-engineering/docs/AI-ENGINEERING-METHODOLOGY.md`,
  `deno` → `/Users/oubiwann/lab/billosys/ai-engineering/knowledge/deno`,
  `js` → `/Users/oubiwann/lab/billosys/ai-engineering/knowledge/js`,
  `rust` → `/Users/oubiwann/lab/billosys/ai-engineering/knowledge/rust`. All
  links are mode 0755; targets were not inspected.
- Each of the five other source homes has exactly `SKILL.md` plus the same
  four tracked external links above; links are mode 0755. No additional
  immediate entries were found.
- Planning has no `assets/ai` directory, no `docs/guides/SKILL.md`, and no
  `skills/lykn/SKILL.md`.

For each of six source homes, a tracked code/include query searched `.rs`,
`.js`, `.lykn`, `.lyk`, and `Makefile` for old `assets/ai/...` guidance paths;
all returned exit 1/no matches. An initial broad query also included scripts
and surfaced frozen `scripts/cited-paths-census.tsv` historical rows; these
were excluded from live-code conclusions. Active current Lykn reference links
are in `AGENTS.md`, `README.md`, and `docs/philosophy.md` in each source home.
The initial and intermediate placement corrections caused no repository edit
or index change.

## Validation scope

After one committed cleanup commit per home, run `make check-cited-paths` in
all six source worktrees. No full `make check`, doctest, Rust, JS, compiler or
coverage run is in scope for this governance/docs-only cleanup. Planning has
no source Makefile and will be checked for branch-qualified references and
seven-tree equality. No tests were run during intake.

## Implementation and precommit preservation evidence

CDC's iteration03 semantic review read the complete AGENTS candidate and its
source-old/candidate diff. The candidate was corrected to preserve: byte equality
across main/releases/planning/task homes; the branch-qualified planning index;
`docs/philosophy.md` authority and source-worktree qualification; disclosure and
supported substitute when a named skill is missing; Git-backed discovery
routing; source planning exclusion; and shared JS/Rust grammar parity or an
approved divergence. CDC approved the corrected wording, with one final scope
clarification: all planning material stays out of source `docs/`. The exact
current override is `cc-prompt-iteration03.md`; this is preservation of initial
binding requirements, not an expanded cleanup scope.

Each source SKILL was moved from its own worktree before changing its citation.
The `git hash-object skills/lykn/SKILL.md` move checkpoints matched the opening
blobs exactly:

| Home | Move checkpoint blob | Final source commit |
| --- | --- | --- |
| main | `0205e6ea0457c0099f1dec0a36fc62b363cbaa9d` | `eba3de3b22e5d67b41df2c18ee89d41c8a382112` |
| release/0.6.x | `241bc4d8ce5dfff153edec2462e012849e96b2ad` | `f361f9e995cd2b85c8c3a49a57f79112539a2d71` |
| release/0.7.x | `241bc4d8ce5dfff153edec2462e012849e96b2ad` | `b63b6d1845fd96eaf2bd9deb7503265d6433930c` |
| release/0.8.x | `241bc4d8ce5dfff153edec2462e012849e96b2ad` | `ecbd9f0313281a138482b1ef83972894b324ccd9` |
| codex/native-esbuild-controls | `241bc4d8ce5dfff153edec2462e012849e96b2ad` | `32d820a59f78ff9c0843236fdfefc1b791ff4e39` |
| codex/contract-predicate-lowering | `241bc4d8ce5dfff153edec2462e012849e96b2ad` | `32d820a59f78ff9c0843236fdfefc1b791ff4e39` |

After each byte-identical move checkpoint, the only SKILL body change was the
stale DD-49 local path to the canonical branch-qualified planning URL. The
source commit diff reports a one-line addition/one-line removal for that file.
Main's original blob remains distinct from the other five; no sibling version
was copied over it. README and philosophy now reference `skills/lykn/SKILL.md`;
the philosophy audit command scans `docs/guides/` and that root skill file.
The `/assets/ai` ignore rule was removed. Four inventoried tracked external
symlinks were unlinked in each source home. On main, five additional previously
inventoried ignored symlinks were confirmed as symlinks and unlinked. No target
was traversed or removed; each old directory was removed only after empty.

All six exact-path source commits include both required contiguous coauthor
trailers and contain only AGENTS, `.gitignore`, README, philosophy, the SKILL
move/citation, and four tracked symlink deletions. The `make check-cited-paths`
gate ran after commit in each source home and passed:

| Branch | Result |
| --- | --- |
| main | pass; 62 documents |
| release/0.6.x | pass; 63 documents |
| release/0.7.x | pass; 63 documents |
| release/0.8.x | pass; 63 documents |
| codex/native-esbuild-controls | pass; 63 documents |
| codex/contract-predicate-lowering | pass; 63 documents |

Each run reported the unchanged 601 historical citations accepted through
`scripts/cited-paths-census.tsv`. The frozen census itself was not edited.
No full `make check`, doctest, Rust, JS, compiler or coverage tests were run;
these are outside this governance/docs-only cleanup. The previously routed
static GC-D01 guide-example inconsistency remains untouched.

Post-commit inspection found all six source worktrees clean. Their committed
`AGENTS.md` blobs are `ede9c15088ba7ffe407ca83dbffea72c168960ae`, regular mode
100644, with identical working bytes. Planning's candidate bytes match at
SHA-256 `0a164012d6ce4c551b7b1538f52b720b5fc9ec17e62edc11b4db05bf06d90023`;
the planning commit is recorded in closing-report.md. Across all seven homes, `CLAUDE.md`
remains Git mode 120000 and a relative symlink to literal `AGENTS.md`. The four
tracked symlink entries and old `assets/ai` directories are absent in each
source tree; all five main-only ignored links are absent too. The only test
executed for this work was the six required committed-HEAD citation gates.

## Iteration04 — GC-R01 release-authoring correction

Fresh independent review found the previous AGENTS candidate had generalized
Autonomous Mode's dedicated task-branch rule into a global product-authoring
restriction on release branches. The old repository guidance assigned ordinary
source and user/developer documentation work to release homes and restricted
`main` to integration; no Operator decision removed that release-home authority.
This was an authoring defect. Iteration04 restores the old assignment rule:
use a dedicated non-default task worktree in Autonomous Mode, or when the active
assignment explicitly requires one; otherwise ordinary source/docs work may use
the assigned release home. `main` remains integration-only except for explicitly
authorized synchronized governance/docs, and the correction adds no implementation,
integration, or external-action authority.

The first iteration04 wording pass created AGENTS-only commits, then CDC
identified that the prose condition could read ambiguously. Those unpushed local
commits were amended in place so each source home still has one explicit
AGENTS-only commit. Superseded local commit -> final amended commit:

| Home | Superseded pass | Final tip |
| --- | --- | --- |
| main | `69eead14fc5b6482e6193bb8f00cf688c090ccf5` | `1dc85832c2414460323f4e203adfcc283db239e7` |
| release/0.6.x | `9464a9731dc3e0a44c5d83f66199e6937040b88c` | `cb3ee61cd686eac9fe551fb9c826b9aad532b008` |
| release/0.7.x | `1caca194b2989c45decbb5d16599836ee4cec189` | `d51f494069552d746f4e8d3fa79cf594f685be0e` |
| release/0.8.x | `efb4664bf47cf097b1c51d50ea84562b62a37cce` | `e0356ee902392610a96492470595ffc745b3d33c` |
| codex/native-esbuild-controls | `86e80ff94ae477b0f35f465a9708f8dfc4032498` | `9be0c301e11e3d8503605e9b50b53056f47c9b14` |
| codex/contract-predicate-lowering | `86e80ff94ae477b0f35f465a9708f8dfc4032498` | `9be0c301e11e3d8503605e9b50b53056f47c9b14` |

For each final source tip, only `AGENTS.md` changed from the previous cleanup
commit. Both required trailers are present. The final committed guidance bytes
match across all seven homes (planning candidate SHA-256 is recorded in the
closeout); CLAUDE symlink modes/targets remain unchanged. Each final source tip
passed `make check-cited-paths`: main reported 62 documents, and each of the
other five source homes reported 63. Every run retained 601 historical census
citations. All six source worktrees are clean. No SKILL, link-removal, source,
code, checker, census, test-selection or test files changed in this correction.

The earlier move checkpoints, unlink commands/inventory, source diff scope,
source citation receipts and static GC-D01 routing remain unchanged evidence at
the original cleanup commits and date; this correction did not rerun or claim
them as fresh. `cdc-retrospective.md` is CDC-owned, untracked and was not
modified or staged. GC-01 through GC-06 and parent A2/P7 remain open pending
independent disposition.

Iteration04 handoff began from clean planning commit
`5d6299fff26a1766899713578c10d188816cd38f` before CC's allowed edits; CDC's
untracked `cdc-retrospective.md` was visible and left untouched. The corrected
planning AGENTS and this existing four-file CC closeout set are committed
separately from that preserved reviewer file. The exact planning correction tip
is returned in the handoff.
