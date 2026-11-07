# Slice20 — local integration of the accepted semantic-context stack

Opened2026-11-07 after explicit Operator request: “fast-forward release/0.6.x
to8f5d199, then validate the release build and independently review it. Same
Luna6 High CC and Sol6.1 High CDC, Autonomous Mode, and stop on any substantive
failure ... If everything passes with no issues, merge, and move directly into
the next chunk of work”. The exact local FF is the authorized merge; no second
merge, squash, propagation, push/publication or remote CI follows. After green
independent close, advance to Arc01 S02 **readiness/design only** until its
explicit public Rust compatibility choice is answered. Root has requested that
choice separately while unaffected integration continues. Do not infer it.

This is the available next standalone integration unit, consistent with Slice10/
16, spanning accepted Slice19 and Arc01 S01. Closed S01 and planned S02 are not
repurposed. Source semantics were already independently accepted; this unit has
no product authorship or source-repair authority. Any substantive failure stops
dependent work; preserve FF state/evidence, no automatic rollback or workaround.
Normal integration refinement ceiling5 is not a reset of source/tool budgets;
eight spent tooling passes remain unchanged. No automatic correction on failure.

## Roles, source identity and exact integration

CDC `/root/cdc`, OpenAI Sol6.1 High, design/independent acceptance/planning close.
One fresh fork-none Luna6 High CC handles integration/release validation. Fresh
context avoids stale task-versus-release cwd instructions; same approved model.
Root is read-only coordinator. CC receives release/index and explicit planning
raw/closing-report ownership; CDC no overlapping writes/builds until return.

Planning starts cleanf75b73f2efe768912b7a3f32fba1edef63913f96. Existing release
checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, release/0.6.x,
clean5408abd432b8789ae474a3895436f68818c4e482,
tree39bc56b73897e568ff81ce60a2feef28a2310ea8.
Exact accepted target8f5d1990df86405656729972485ae4d11feba808,
tree8b1a05ff7ca8d6c9aedd82984be19d81a03894f2, on
codex/variadic-for-body-context in existing contract-predicate-lowering checkout.
Mergebase5408, left/right0/11. Revalidate then **git merge --ff-only exact8f**,
preserving all11 commits and old task/reference tips. No authored merge message
is created by FF; real-newline/coauthor requirements apply to planning commits.

Release-relative final delta is exactly seven paths:

```text
crates/lykn-cli/tests/match_clause_validation.rs
crates/lykn-cli/tests/variadic_for_bodies.rs
crates/lykn-lang/src/classifier/forms.rs
crates/lykn-lang/src/emitter/forms.rs
docs/guides/00-lykn-surface-forms.md
test/fixtures/variadic-for-bodies.lykn
test/forms/for.test.js
```

No AGENTS/CLAUDE, Cargo/lock, Make/scripts/workflow/census, package exports or JS
compiler/mirror product change. No new source worktree is needed; release pointer
movement is this explicit integration exception, not product authoring on release.

## Required release proof

1. Before FF inspect actual branch/status/ancestry/tree/pathset and local common
   Git hooks/config/workflow triggers. Retain own receipts. No hook bypass or
   hosted action. Stop if the exact predicted FF/tree is not available.
2. After FF prove HEAD/tree byte-identical to accepted8f, exact seven-path delta,
   clean source/unchanged other refs. Later gate failure leaves FF intact.
3. Record actual source-cwd Rust/cargo (previously1.97), Deno executable
   `/opt/homebrew/bin/deno`, version2.9.6, SHA
   2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
   Installed cargo-binstall/outdated/llvm-cov/cache conditions must be checked;
   no auto-install/update/dependency acquisition to satisfy a failure.
4. Run full NORMAL unfiltered `make check` from release, with fresh owned npm/
   XDG caches and fixed existing DENO_DIR=/Users/oubiwann/Library/Caches/deno,
   supported LYKN_TEST_DENO=/opt/homebrew/bin/deno. No global CARGO_NET_OFFLINE/
   CARGO_TARGET_DIR overrides or test filtering, suppressed diagnostics or bypass.
   Existing legacy npm dry-run compatibility tests remain included; no claim this
   full gate is npm-free. Capture exact command/cwd/selected ambient/explicit env,
   separate full stdout/stderr and actual exit from first launch. Old capture
   limits remain historical, not repeated or retroactively cured.
5. All necessary test/CLI binaries are built by full Make before final pin.
   Pin actual absolute release/bin/debug CLI and actual built test executables
   AFTER the last Cargo/Make, before runtime. Do not assume task hash657 carries
   across checkout/build. Release and copied bin must byte-match. No Cargo rebuild
   between final pins and direct focused binaries/CLI/runtime operations.
6. Run existing built native integration targets directly: all5 tests from
   `match_clause_validation.rs` and both2 from `variadic_for_bodies.rs`, nocapture.
   Their frozen source/runtime/negative assertions stay unchanged. Preserve actual
   selected counts, raw source/generated streams and complete failures. Full Make
   also covers library roles/public JS1470/docs482 (derive actual populations).
7. Direct actual release CLI check/strict compile the original740-byte positive:
   planning `project03-language-evolution/slice19-match-subject-and-walker/artifacts/evidence/cdc/positive-0001/positive.lykn`,
   SHAceaaf162892e964a76f317558ad35cfcdf82bd6731fcebe0eabb21de2d953058.
   Copy unchanged into an owned config-free private/tmp cwd; verify bytes before
   use, retain full JS/DTS and read complete generated modules. Existing oracle:
   `[[42,["prefix","tail","statement"]],[42,["tail"]],[0,["fallback"]]]` plusLF,
   runtime0/empty stderr. DTS exact Choice-only bytes as the existing native test,
   SHA0ce10d8a36d40fa340ede6fce895a51b8a3b6e6dfaf1d51a03b6fc6a20d6986f.
   Do not assume an old generated-JS hash; derive actual, inspect and execute.
8. Likewise release check/strict compile the unchanged accepted Cfor fixture
   source8f `test/fixtures/variadic-for-bodies.lykn`, SHA
   9b527840a0c179b64ebb392402679a5e32a3acced117db53722fe217c4efe2ff.
   Runtime exact `{"trace":[0,10,11,1,11,12]}` plusLF/0/empty stderr. All three
   header Value negatives are the existing independent native test population,
   not skipped behind a positive assertion. Direct generated children use
   `deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt`
   with no extra grants. Record actual CLI/Deno hashes before/after use.
9. Separate `make check-cited-paths` at committed integrated source. Compare
   canonical/embedded product JS bytes (unchanged), check final clean tree/refs.
   Retain S01 independent original-walker compile-only evidence by exact source
   byte identity; no new walker compilation/execution is needed for this release
   integration, and no K/helper/pilot/old F6 matrix re-entry is authorized.

CDC independently repeats normal release gates/focused/direct proof after clean
ownership return with distinct owned outputs/caches, reviews whole-tree equality,
source delta/ancestry and full relevant JS/DTS. No new harness/checker needed;
native direct commands/filesystem/comparison and frozen Lykn inputs suffice.

## Records, boundaries and readiness

CC may write only release pointer by FF/ignored build outputs, this slice's
`artifacts/evidence/cc/` and `closing-report.md`. All other source bytes/planning
prose/ledgers read-only. CDC owns per-row verification/retro/parent status and
later S02 readiness. Planning commits use exact allowed paths, actual -F files
with contiguous Codex and Billo AI trailers, raw message readback; no history
rewrite or blanket staging. Raw bytes preserved; prose/source whitespace checked
separately, no raw terminal normalization to satisfy cosmetic checks.

All research/helper/orchestration/validator/evidence/JSON/command-building logic
must be Lykn. NO Python execution/exception, Ruby/Fennel/handwritten research JS/
Node/jq/shell-logic substitute. Native direct existing CLI/simple filesystem
operations are allowed; no new helper is needed. No product changes, deps,
installs, global tool replacement, propagation, push/publication or remote CI.

Author readiness: live refs/trees/0–11/pathset checked; actual five-test match
harness, two-test Cfor harness, immutable740 source/oracles and Slice16 integration
precedent inspected. One initial wrong filename lookup produced only read error,
corrected to actual match_clause_validation.rs before assignment. PM README and
required layout/topdown/close/verification/testing/prompt contracts refreshed or
retained unchanged with relevant source identity revalidated. No semantic design
choice in the integration remains unresolved. S02 API compatibility is separate
and held; ask once through root while integration proceeds, not an implementation
decision left to CC. Finish all five integration rows and close before S02 advance.
