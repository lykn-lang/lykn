# 02 · artifact-homes — Closing Report (L-7 / L-8, CC's half)

**By:** CC · **Date:** 2026-07-25 · **Branch:** `release/0.6.x` @ `e77ebcf`
**Verdict: L-7 delivered, L-8 census delivered with a disposition question
attached.** `make check` now fails when a tracked document cites a repo-relative
path that does not resolve in `git ls-tree HEAD` **on the branch being checked**.
The frozen census is generated and committed. Two things need the operator
before this closes: **the gate is red on `release/0.6.x` right now** for two
citations belonging to a *concurrent session's uncommitted work* (§6), and the
census as generated absorbs classes the amendment did not anticipate (§7, §8).

## 1 · What landed

| File | What |
|---|---|
| `scripts/check-cited-paths.js` | The gate. Pure functions + a CLI; ~1s over 556 documents. |
| `scripts/cited-paths-census.tsv` | The frozen census — 631 `(file, path)` pairs, headed as the closure of `D-2607-D3NL`. |
| `test/integration/cited-paths.test.js` | 22 tests. Every documented catch **and** every documented non-catch is pinned. |
| `Makefile` | New `check-cited-paths` target, wired into `common-checks` → `make check`. |

Placed in `common-checks` **before** `build-release`, not inside `lint`: the gate
needs only git and deno, so it fails in ~1s rather than after a release build.
`lint` stays what it is — source quality, and it needs `bin/lykn`.

## 2 · Per-row walk

| Row | Status | Evidence |
|-----|--------|----------|
| **L-7** — `make check` fails on a citation that doesn't resolve in git *on that document's own branch*, with `file:line` | **attested (CC)** | Seeded-failure demo §5; three-branch run §4; 22 unit tests. Resolution is `git ls-tree -r HEAD` — never `--all`, never the filesystem. Message format: `docs/philosophy.md:469  docs/design-v0.6.0/no-such-slice/slice-doc.md  →  … (not in git at HEAD)`. |
| **L-8** — census + exemption recommendation | **delivered, decision owed** | §3 (census), §7 (the three classes + a fourth), §8 (the premise crack). |

## 3 · The census

Generated once from the **committed content of HEAD `e77ebcf`**, not the working
tree. That distinction is deliberate and load-bearing: the census is a
reproducible record of one commit, so an in-flight edit in someone else's
checkout can never quietly become an accepted exemption. The gate itself reads
the **working tree**, so breakage surfaces before the commit that would bake it
in. Regenerating from HEAD reproduces the committed file byte-for-byte, which is
this slice's proof that the gate is green against HEAD.

| | pairs | distinct paths | citing files |
|---|---|---|---|
| `workbench/…` | 306 | 156 | — |
| everything else | 325 | 151 | — |
| **total** | **631** | **307** | **174** |

**Delta against CDC's census (143 paths × 106 files × 353 sites), disclosed.**
The two numbers are not comparable and neither is wrong. CDC swept all 507
tracked documents for `workbench/…` only; this gate scans 556 documents
(`docs/**/*.{md,html}` + root `AGENTS.md`) for *every* repo-relative citation,
including HTML `<code>`/`href` and markdown link targets, which CDC's grep did
not reach. The 156 vs 143 workbench figure is the extra extraction surface; the
325 non-workbench pairs are the population CDC's sweep never measured.

**That is the headline finding of L-8: the historical dangling-citation problem
is roughly twice the size the amendment assumed, and only half of it is
`workbench/`.** The other half is moved and pre-restructure paths inside tracked
trees — `packages/lykn/…` (renamed to `packages/lang/`), `test/surface/*.test.js`
(migrated to `.lykn`), `test/fixtures/surface/*.json`, `crates/design/…`,
`docs/design/05-active/…` entries since promoted. The operator's disposition
(option (a), accept and mark) applies to these with exactly the same force; they
are simply not what the amendment was looking at when it wrote "the 143 paths ×
106 files".

## 4 · Three-branch run (L-7's verify column asked for two)

Run from each worktree with the 0.6.x census supplied via `--census-file=`
(the snapshot has not merged to those branches yet):

| Branch | Live findings | What they are |
|---|---|---|
| `release/0.6.x` | **2** | A concurrent session's uncommitted work — §6. |
| `main` | **1** | `project02-language-toolchain-alignment/status.html:273` → docs/archive/ |
| `release/0.7.x` | **15** | 1 shared with `main`; **14 new, and all of them real** — §4.1. |

### 4.1 · The 0.7.x result is the argument for the gate

Run against a branch it was never tuned on, the gate immediately found
**fourteen instances of the original register bug** — tracked planning documents
citing research artifacts that exist in nobody's git:

```
docs/design-v0.7.0/01-treeshake-audit/cc-prompt.md:57   scripts/shake-experiment.js
docs/design-v0.7.0/01-treeshake-audit/cc-prompt.md:71   scripts/toplevel-walker.js
docs/design-v0.7.0/03-threading-macros/ledger.md:19     scripts/build-catalog.py
docs/design-v0.7.0/03-threading-macros/ledger.md:27     scripts/probe-threading.js
docs/design-v0.7.0/03-threading-macros/ledger.md:27     scripts/probe-threading-rust.sh
… plus 01/02's `evidence/` and `artifacts/` directories, and
   docs/design-v0.7.0/01-treeshake-audit/inventory.md:15  crates/lykn-cli/tests/cross_compiler.rs
```

Two of those are **ledger rows citing their own evidence**. Under
`LEDGER_DISCIPLINE`, a row's evidence is the thing that makes it more than an
assertion — and the evidence is not in git. This is `D-2607-8HTN`'s routing rule
("a row is not `routed` until the destination file exists in git and contains
it") failing on a live branch, five days after it was written. Owed to 0.7.x, not
fixed here.

## 5 · Seeded-failure demo (hard requirement)

Five seeds appended to `docs/philosophy.md`, plus one untracked-but-present file
created on disk at docs/backlog/seeded-untracked.md:

```
✗ Dangling citations — a tracked document cites a path that does not resolve in git on release/0.6.x

  docs/philosophy.md:469  docs/design-v0.6.0/no-such-slice/slice-doc.md  →  … (not in git at HEAD)
  docs/philosophy.md:470  workbench/seeded-brand-new-note.md             →  … (not in git at HEAD)
  docs/philosophy.md:471  docs/design-v0.7.0/04-not-yet/slice-doc.md     →  … (not in git at HEAD)
  docs/philosophy.md:472  docs/backlog/seeded-untracked.md               →  … (not in git at HEAD)

4 dangling citations.
```

Exit 1. Seeds removed, file restored → exit 0. Each seed proves a distinct
contract: a plain bogus path; a **new** `workbench/` citation failing despite 306
grandfathered `workbench/` pairs; a cross-branch reach; and — the original
register bug — **a file that exists on disk but is not in git**.

The fifth seed was a markdown link to `../docs/backlog/README.md`. It did **not**
fire, correctly: from `docs/philosophy.md` that resolves to
`backlog/README.md`, which is tracked. A bad seed, not a missed catch;
recorded because a demo that quietly drops a case is the thing `D-2607-B8SY`
warns about.

## 6 · Why the gate is red on `release/0.6.x` right now

```
docs/backlog/discoveries.md:203                                 →  docs/design-v0.6.0/arc15-surface-syntax-traps/slice04-sibling-traps/liveness-recheck.md
docs/design-v0.6.0/arc15-surface-syntax-traps/arc-plan.md:32    →  (same)
```

`liveness-recheck.md` exists on disk (7.6 KB, written 01:32 today) and is
**untracked**. Two documents already cite it. This is the register bug
reproducing itself, in this worktree, on the same day the gate landed — and the
gate caught it within minutes of being wired up.

**Not fixed here, deliberately.** Those are another session's uncommitted files;
`git add`-ing someone else's work-in-progress is not mine to do. The fix is one
`git add` of the `slice04-sibling-traps/` directory under arc15. Until then
`make check` is red, which is the correct behaviour and not a defect in the gate.

## 7 · The exemption classes — census and recommendation

The amendment named three classes for me to bring back, and the sweep found a
fourth. **As shipped, the frozen census absorbs all four**, because that is what
"generated once from today's census" produces. Each deserves a separate verdict,
because they have different lifecycles and only one of them is actually history.

| Class | Pairs | Recommendation |
|---|---|---|
| **1 · Shorthand fragments** (`ast/sexpr.rs`, `emitter/forms.rs`, `05-active/0059-…`) | **0** | **No exemption needed — solved by the extraction rule.** A candidate is only checked if its first segment is a *tracked top-level entry at HEAD*. `ast`, `emitter`, `05-active` are not, so they never enter the gate. Same rule disposes of branch names (`release/0.6.x`), out-of-repo trees (`collaboration-framework/…`), and generated dirs (`target/`, `dist/`, `bin/`). This one rule removed ~1850 false candidates. |
| **2 · Pre-restructure paths** (`src/surface.js`, packages/lykn/…, test/surface/*.test.js) | ~290 | **Frozen census, as shipped.** `src/…` is unanchored and never checked; the anchored ones (packages/lykn/, test/…, crates/design/…) are exactly the operator's accept-and-mark class. Self-closing. |
| **3 · Out-of-repo symlinks** (`assets/ai/**`) | **33** | **Recommend a rule, not census rows.** `/assets/ai` is gitignored (`.gitignore:10`) with five symlinks force-added into an out-of-repo checkout; assets/ai/rust/ and assets/ai/js/ resolve only on a host that has the sibling `ai-engineering` repo. Git cannot verify these on *any* branch, ever — so they are structurally like `target/`, not like history. `AGENTS.md` itself says of them *"may be a symlink; check to be sure"*. Freezing a permanently-unverifiable class into a file headed "accepted, not repaired" mislabels it. |
| **4 · Deliberate cross-branch citations** (docs/design-v0.7.0/\*\*) — *the class the amendment forbade blanket-escaping* | **12**, in 7 documents | **Needs the operator. See §8.** |

## 8 · The premise crack: `AGENTS.md` cannot be clean under the branch rule

The amendment's point 4 says `AGENTS.md` is byte-identical on every branch by
rule, "so it is the one file whose citations must resolve on **all** branches.
Worth a dedicated case." It is — and the dedicated case fails. `AGENTS.md` has
eight dangling citations today, in four classes, and **three of the four are
things `AGENTS.md` must say by its own governance design**:

| Citation | Why it's there |
|---|---|
| docs/design-v0.7.0/ ×3 | The **routing table's own target**. `AGENTS.md` tells you 0.7.0 work goes there; the table simultaneously guarantees the tree is 0.7.x-only. |
| workbench/old, workbench/dd-35-… ×2 | Naming `workbench/` **is** the scratch rule. A rule that forbids citing `workbench/` cannot state itself without citing it. |
| assets/ai/js/ and assets/ai/rust/ ×4 | Skills whose presence `AGENTS.md` explicitly describes as conditional. |
| docs/design-v0.5.x ×1 | A genuine forward reference — "a future docs/design-v0.5.x/ retro pass". Exists nowhere yet. |

So the rule as literally written outlaws the document that carries it. **That is
not a reason to drop the gate** — it caught 14 real defects on 0.7.x and 2 in
this worktree within an hour. It is a reason to decide class 4 before freezing.

**My recommendation, and I'll flag that it goes against the amendment's letter:**
exempt docs/design-v&lt;X.Y.Z&gt;/ **by rule, but only when that planning tree is
absent from HEAD in its entirety.** The distinction is precise and self-closing:

- a **missing root** (docs/design-v0.7.0/ nowhere on `release/0.6.x`) is a
  *branch-ownership fact* that `AGENTS.md`'s routing table deliberately creates;
- a **missing leaf under a present root**
  (`docs/design-v0.6.0/arc15-…/liveness-recheck.md`) is a broken citation, and
  stays checked.

The amendment's counter-prescription — "get the data onto its branch, which is
what the rebase did" — worked for the ES2025 corpus because that corpus is
*read-only reference material*. It does not transfer to a sibling release's live
planning tree: copying docs/design-v0.7.0/ onto `release/0.6.x` manufactures a
stale second copy of a tree that is being written daily on another branch, which
is precisely the "one branch per concern" failure the routing rule exists to
prevent. The alternative — rewriting the 12 pairs / 23 sites as unbackticked
prose — is cheap but strips the useful information out of the documents.

If the operator prefers the amendment's letter, the change is one line
(`REPO_TOP_LEVEL_DENY` gains a case) and the 12 pairs come out of the census.

## 9 · The extraction rule, and what it deliberately does not catch

Written out in full at the head of `scripts/check-cited-paths.js` and pinned by
tests, because a check that silently under-matches is the failure this slice
exists to close. Summary of the non-catches:

- **Tokens without a `/`** — a bare `AGENTS.md` in prose is indistinguishable
  from a generic mention.
- **Glob patterns** (`docs/guides/*`, `crates/**/*.rs`) — 40 distinct patterns.
  Matching semantics would have to be invented, and a wrong one is worse than
  none.
- **Fenced code-block contents** — shell transcripts cite paths relative to a
  cwd the checker cannot know. Fence state is tracked properly (both delimiters,
  respecting opener length), which it was not in the first draft — see §11.
- **`./` and `../` code spans** — genuinely ambiguous between a shell invocation
  (`./bin/lykn`), a module specifier (`./mod.js`), and a document-relative path.
  Guessing document-relative produced 200+ false hits. **Link** targets keep
  their relative resolution, because markdown defines it.
- **Link targets that resolve root-relative but not document-relative** — the
  gate asserts a cited path *names something real*, not that a renderer would
  follow it. A true link-checker is a different tool.
- Scheme specifiers, absolute and `~/` paths, and placeholder paths
  (`docs/design-vX.Y.Z/`, `arcNN-…`, `workbench/YYYY-MM-DD-…`, anything with
  `<>{}$`). HTML entities are decoded first, so `workbench/&lt;date&gt;-…` is
  correctly read as a placeholder.

Three of these were bugs found by running the sweep rather than decisions: the
`X.Y.Z`/`NN` placeholder test used `\b` anchors that never fire mid-token; HTML
entities defeated the placeholder rule in `status.html`; and fenced blocks were
never actually skipped — the claim held only because fences rarely contain
backticks or link syntax. All three are regression-tested now. The third is the
sharpest: a documented non-catch that is true by accident is precisely the
overclaiming this slice set out to stop.

## 10 · Owed, not done

1. **Register rows.** The 0.7.x findings (§4.1), the `main` finding, and the
   `assets/ai` class each deserve a `D-YYMM-XXXX` row. Not written here:
   `backlog/discoveries.md` is being edited by a concurrent session and
   racing it would corrupt the register this slice just gave a home to.
2. **A real broken link in a shipped guide** — `docs/guides/12-deno/12-04-publishing.md:71`:

   ```
   is:      [`docs/philosophy.md`](../../docs/philosophy.md)   → docs/docs/philosophy.md
   correct: [`docs/philosophy.md`](../../philosophy.md)
   ```

   Two characters. Left alone because the operator's disposition said the
   historical corpus is not salvaged, and I would rather ask than quietly
   widen scope.
3. **Cross-repo citations read as repo-relative.** These are **book-repo** paths
   sitting in **lang-repo** documents:

   ```
   02-artifact-homes/ledger.md   row L-6   tools/book-audit/fences.lykn
   arc16 kickoff-thread                    test/book/
   arc16 kickoff-thread                    scripts/mdbook-epub-image-paths.py
   ```

   `tools/`, `test/` and `scripts/` are all real lang top-level directories, so
   these read as lang paths and dangle. Worth a convention — qualify cross-repo
   citations — more than a code change.
4. **`make check` end-to-end on the operator's host.** CC has run
   `build-release`, `lint`, `test-rust`, `test-suite`, `test-docs` and the gate;
   the composite green reconciles on the host once §6 is resolved.

## 11 · A gap the gate found in itself — quoting a path you are reporting broken

The first draft of **this report** tripped the gate seventeen times. Every hit
was correct: a closing report about dangling citations names dangling paths, and
the house style for naming a path is backticks, which is exactly what the gate
reads as a claim.

It then caught the report a second time, after the fix: a line of §9 that began
with a fence delimiter — while *explaining* fence handling — opened a stray fence
and unbalanced every block below it. CommonMark reads it exactly the same way, so
the gate was right twice. The lesson generalizes past this file: **prose about
syntax is written in that syntax**, and a checker that reads documents will meet
that everywhere.

This is not a one-off. Closing reports, audit reports, CDC verifications and
Discovery Register rows all exist partly to say *"this path is broken"*, and
under the gate every one of them will hit this. The dangerous resolution is the
obvious one — append to the census — and that is forbidden by design, so the
pressure has to go somewhere else.

**What I did, and why I did not build a mechanism.** This report now confines
quoted-broken paths to fenced code blocks (an already-documented, already-tested
non-catch) and to unbackticked prose in table cells, where a fence cannot go.
That needs no new machinery. I deliberately did **not** add an inline
suppression comment: `Makefile:308-312` records the house position — *"This is
path exclusion, NOT inline suppression — comment-directive suppression is
deferred to arc14 (comment-retention, DD-62)"* — and a gate landing today should
not be the thing that quietly reverses it.

**What the project owes itself** is a stated convention, because the current
answer ("remember to use a fence") is exactly the kind of unwritten rule that
produced `D-2607-D3NL` in the first place. Three candidates, my preference
first:

1. **Convention only** — *a path being reported broken goes in a fenced block or
   plain prose; backticks assert the path resolves.* Zero code, and it gives
   backticks a real meaning they do not currently have.
2. **A `> quoted-paths` blockquote genre** the extractor skips — visible, local,
   no per-line noise; but it is inline suppression wearing a hat.
3. **Path exclusion for report genres** (`*/closing-report.md`,
   `*/cdc-verification.md`) — matches the `make lint` precedent exactly, but
   blinds the gate to whole documents in the very tree where the original bug
   lived. I would not take this one.
