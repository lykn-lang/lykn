# CC Prompt — arc07 / slice02 · current-drift-recon

**From:** CDC (Codex Desktop) · **To:** CC (Codex CLI) · **Date:** 2026-08-08  
**Branch:** `release/0.6.x`  
**Re:** Re-ground arc07 before guide/SKILL edits. Recon only.

## 0. Read first

- `docs/design-v0.6.0/project-plan.md`
- `docs/design-v0.6.0/arc07-docs/arc-plan.md`
- `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/slice-doc.md`
- `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/ledger.md`
- `docs/design-v0.6.0/arc07-docs/design/guide-drift-cleanup-plan.md`
- `docs/design-v0.6.0/arc07-docs/design/proposed-skill-and-guide-additions.md`
- `assets/ai/SKILL.md`
- the guide files under `docs/guides/`

## 1. Mission

Produce the current drift inventory for arc07. Do **not** edit the guides or
`assets/ai/SKILL.md` in this slice. The old seed lists are useful provenance,
but they predate major 0.6.0 work. Your job is to classify what remains true
today, prove behaviour claims from the actual branch, and recommend the next
arc07 slice shape.

## 2. Required Work

Follow the ledger row by row.

1. Record the substrate you loaded and the exact `HEAD`.
2. Disposition every item in `guide-drift-cleanup-plan.md`:
   `done`, `still-open`, `stale`, `superseded`, or `defer`.
3. Disposition every item in `proposed-skill-and-guide-additions.md` with the
   same statuses.
4. Run current sweeps over `docs/guides/` and `assets/ai/SKILL.md`. At minimum:

   ```bash
   rg -n "Biome|biome|deno publish|npm publish|deno test|deno run|deno fmt|deno lint|cargo build|node |src/|dist/|target/lykn|package\\.json|jsr\\.json|\\? suffix|if.*expression|\\):[A-Za-z_-]" docs/guides assets/ai/SKILL.md
   ```

   Add more targeted sweeps as the hits require.

5. For behaviour claims, run the branch:
   - use `./bin/lykn`, not a global `lykn`;
   - rebuild first if the binary/build artifacts are stale;
   - verify cheap compiler/CLI claims directly (`check`, `compile`, `lint`);
   - where a full command is expensive or requires network/publish side
     effects, cite existing tests or mark the item with a blocked reason and
     re-entry condition.

6. Write `closing-report.md` in the slice directory. It must include:
   - the per-row ledger walk;
   - a seed-disposition table for both seed docs;
   - a current-sweep table with command, hit count, and classification;
   - behavioural verification transcripts for live claims;
   - "Recommended next slice breakdown" with one of:
     - arc07 can close after this recon;
     - one implementation slice is enough;
     - split implementation slices, with proposed names/scopes.
   - "Bubble-up to the arc": what changed in the arc-plan, what the next slice
     should be, and the silent-drop diff.

## 3. Boundaries

- No guide/SKILL edits in this slice.
- No source/compiler changes.
- Do not append to `scripts/cited-paths-census.tsv`.
- Do not create a parallel report outside the slice directory; the inventory
  belongs in `closing-report.md`.
- If a seed claim is now false because the compiler/tooling changed, mark it
  `stale` or `superseded`; do not preserve it out of politeness.
- If a current guide example is intentionally Deno-level rather than Lykn
  project-level, classify it with the reason. Raw `deno` is not automatically
  drift when the guide is explicitly teaching Deno runtime behaviour.

## 4. Verification

At close:

```bash
git diff --name-only
make test-docs
make check-cited-paths
```

`make check` is optional for this recon-only slice unless you touch executable
docs, source, or `assets/ai/SKILL.md`. If you skip it, say why.

## 5. Close

Update `ledger.md` with evidence, write `closing-report.md`, commit the slice
close, and hand back for CDC verification. Leave arc-plan/project-plan/status
surface updates for CDC unless the recon itself forces an immediate correction
that would otherwise mislead the next slice.
