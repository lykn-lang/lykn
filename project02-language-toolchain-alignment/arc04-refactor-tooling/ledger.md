# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (verbatim-move core) closed | ptr: slice01 closing-report + cdc-verification | correctness | arc-plan | **done** | slice01 closed 9/9 (CC-attested + CDC code/git-verified) |
| A-2 | slice02 (rewiring + batch) closed | ptr: slice02 closing-report + cdc-verification | correctness | arc-plan | **done** | slice02 closed (CC-attested + CDC git/code-verified) |
| A-3 | `move-function` performs a real move with the full suite green, end-to-end | run the move + rebuild-first `lykn test` | serious | arc-plan | **done** | **slice03 (M22.5-2): 10 real moves, byte-identical, corpus 1345/0** — the tool proven on the real corpus, committed (`266ff3d`) |
| A-4 | **Composition: tool + extraction recompose into the capability** — surface extraction complete, behaviour preserved, lint green | closing-report §3: surface.js 2,315→448, classifier.js imports nothing from surface.js, corpus 1345/0 throughout, `deno lint packages/` exit 0 | serious | arc-plan | **done** | reproduced at arc scale (cumulative green + structural reduction + byte-identity); see `closing-report.md` |
| A-5 | slices 03–05 (the extraction campaign) closed | ptr: each slice closing-report + cdc-verification | correctness | arc-plan | **done** | M22.5-2/-3/-4 all closed (`266ff3d`/`ff481b4`/`6c9de6d`) |

