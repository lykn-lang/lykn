# Slice: move-function-core (arc04 / slice01) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-06-28 · **Branch:** `release/0.6.x`
**Evidence strength:** `attested` (CC ran every command; CDC reproduces).

**Verdict: delivered.** The byte-exact `move-function` core (track B, M22.5-T1a)
moves a single named top-level declaration between exactly two files, never
regenerating the moved bytes. All 9 ledger rows reach `done`; 26 tool tests + the
full 657-test JS suite are green; `deno lint scripts/` is clean. Built TDD-first
with a visible red→green SHA boundary per row.

---

## Expected vs actual (honest summary)

**What the core does (T1a scope):** `deno run -A scripts/move-function.js --from
A --to B --name N [--dry-run] [--verify-cmd "…"]`. It parses with `acorn` only to
locate N's `[start,end]` offsets, extracts the verbatim slice, removes it from A
(taking the `export` wrapper and any contiguous leading doc comment), adds a
back-import to A iff a reference remains, inserts the unit into B (composing
`export` after the comment block), strips a pre-existing alias re-export of N in
B, writes both files, runs the verify command, and **reverts both files
byte-exactly if verify fails**. Aborts (writing nothing) on not-found, ambiguous
(>1 top-level decl), or collision (N already declared/imported in B).

**What it deliberately defers to T1b** (unchanged from spec §9): cross-file
consumer rewiring across `packages/lang/*.js`, batch `--names`, scope-accurate
rename/shadowing. No TypeScript, no `astring` regeneration, no MCP/LSP (track C).

**Acceptance helper (F-7):** `parseRestParam` — a non-exported internal in
`surface.js` (def line 611, used line 644). Zero external consumers proven by
`grep -rl parseRestParam packages/ test/ | grep -v surface.js` → none. Moved to a
scratch `surface-helpers.js`; **byte-identical: true**; it gained `export` in TO
(exercising the "was-not-exported" path); `surface.js` gained
`import { parseRestParam } from "./surface-helpers.js"` and no longer declares it.
After `lykn build`, `deno test --config project.json -A test/` → **657 / 0**. The
scratch branch was deleted and `surface.js` restored — **no extraction landed.**

---

## Per-row walk

Full evidence (commands + SHAs) is in [`ledger.md`](ledger.md). All 9 `done`:
F-1 scaffold + locate core · F-2 all shapes + leading comments · F-3 remove/insert
+ **byte-identity invariant** · F-4 addNamedImport/stripReExport · F-5 moveFunction
orchestration + aborts · F-6 verify gate + auto-revert + dry-run · F-7 Layer-4
acceptance (above) · F-8 lint clean · F-9 no regressions (657/0, 26/0).

**Silent-drop check:** 9 opening rows, 9 closed (9 done, 0 deferred, 0 no-op).
TDD discipline held on every row — no test+fix blend, no late-row degradation.

---

## Design calls surfaced (not decided silently)

1. **`scripts/` vs `tools/`** (spec §3): chose **`scripts/`** per the
   `bundle-size.js` precedent and existing lint coverage. No objection.
2. **`insertDeclaration` signature.** Spec §4.1 has it prepend `export ` to the
   verbatim slice, but the slice may carry a leading doc comment — prepending
   would yield `export /** … */ function`. Resolved by making `insertDeclaration`
   a pure append of a **fully-formed unit**, with the orchestrator composing
   `export` *after* the comment block. Byte-identity of the declaration is
   preserved; comments are never orphaned or mis-prefixed.
3. **`npm:acorn` version pin.** Spec §3 says import it bare like
   `bundle-size.js`'s `npm:esbuild`, but the project's `no-unversioned-import`
   lint rule (only `no-slow-types` is excluded) rejects unversioned npm
   specifiers. Pinned `npm:acorn@^8` — still a direct npm specifier with no
   import-map entry, and F-8 (`deno lint`) passes.

---

## Bubble-up to arc04

**1. Did slice01 deliver its assigned piece?** Yes — the verbatim-move core, two
files, byte-exact, with the abort + verify-gate safety discipline. arc04's
capability ("`move-function` byte-exact code-move tool driving surface
extraction") now has its core; slice02 (cross-file rewiring + batch) can build on
it.

**2. What did slice01 reveal the arc-plan didn't anticipate?**

- **`surface-helpers.js` does not exist on `release/0.6.x`.** The M22 audit (and
  the spec) assume it as the extraction target with re-exports at line 52 — that
  was the `.worktrees/compiler-coherence` state, never merged. **T1b / M22.5-2
  must create it (or pick a target) explicitly**; the acceptance created a
  throwaway one. This is a real prerequisite for the actual extractions.
- **Tests run against built `lang/`, not source.** `project.json` maps `lang/` →
  `target/lykn/build/lang/`, so a source move in `packages/lang/` is invisible to
  `deno test … test/` until `lykn build` runs. The tool's single-command verify
  (`runVerifyCommand` runs one executable, by design) therefore tests *stale*
  built output unless the verify command itself rebuilds. **For real extractions,
  pass `--verify-cmd` that rebuilds first (e.g. a wrapper, or `make test-js`),
  or T1b should teach the tool to rebuild before verifying.** This is the same
  build-dir staleness class arc03/slice11 guarded against — worth a shared fix.
- **`surface.js` uses tab indentation** (the moved `parseRestParam` body is
  tab-indented). Byte-exact move preserves it perfectly — but it confirms the
  corpus mixes indentation, so any future "tidy on move" temptation must stay
  resisted (the invariant forbids it anyway).

**3. Silent-drop diff at slice scale:** none. Scope-as-delivered == scope-as-spec
for T1a; the two additions beyond the literal spec (the `insertDeclaration`
composition call and the acorn pin) are disclosed above.

---

## Reproduce (for CDC)

```sh
cd /Users/oubiwann/lab/lykn/lang
deno test -A scripts/move-function.test.js          # expect: 26 passed | 0 failed
deno lint scripts/                                   # expect: exit 0
deno test --config project.json -A test/             # expect: 657 passed | 0 failed
# byte-identity at a glance: dry-run a move and read the (after) blocks
D=$(mktemp -d); printf 'function h(x){return x*2;}\nexport function u(n){return h(n);}\n' > "$D/from.js"; printf 'export const T=1;\n' > "$D/to.js"
deno run -A scripts/move-function.js --from "$D/from.js" --to "$D/to.js" --name h --dry-run
```

The F-7 acceptance is reproducible by repeating the scratch-branch sequence in
the ledger (create `surface-helpers.js`, move `parseRestParam`, `lykn build`,
full suite, then discard) — it intentionally leaves nothing behind.
