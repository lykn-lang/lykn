# Slice: cross-compiler-fast-follows (grouped)

> Reconstructed retroactively (2026-06-28). Groups five small, independently
> shipped fast-follows under one slice for legibility (rather than five
> micro-slices). Each item keeps its own cc-prompt / closing / cdc under
> `fast-follows/<item>/`.

## Goal / scope
Drive-by cross-compiler coherence fixes surfaced during M16–M22:
- `compileboth-source-context-path` — `compileBoth` `--source-context-path` routing
- `import-macros-divergence` — import-macros output divergence (+ diagnosis)
- `drive-by-cleanups` — three remaining coherence items
- `wishlist-cleanup` — wishlist items across recent work
- `closest-kernel-form-refactor` — unify `closest_kernel_form` / `is_kernel_form`

The D-series commits (template-escape unification; single-param arrow cosmetics)
are the committed code tail of this group at `release/0.6.x` HEAD.

## Status
Closed (shipped 2026-05-15…17).

## Artifacts
- `fast-follows/<item>/` — per-item cc-prompt / closing-report / cdc-verification

**Gap (disclosed):** `fast-follows/drive-by-cleanups/` has `cc-prompt.md` +
`closing-report.md` but **no `cdc-verification.md`** — the original drive-by
items did not warrant a separate CDC pass. Faithful to history, not a drop.
