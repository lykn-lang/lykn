# CC Prompt — arc13 / slice03 · binding-walker + d2-validation

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call).
**Re:** The re-slice after your slice02 self-stop (which was right, and led
somewhere good). The architecture is settled — **DD-61 · Resolve-Once**
(`arc13/design/dd-61-resolve-once-resolution-architecture.md`,
operator-confirmed): *resolve once, consume everywhere*, via resolved-atom
flags + **one binding-position walker per backend**. This slice builds the
walker on both backends and ships D2 riding it. Resolution-independent —
no scope, no tags, no dispatch changes.

## 0. Read first

- `…/slice03-binding-walker-d2/ledger.md` (5 rows) + `slice-doc.md`.
- **DD-61** — especially §A2 (the walker is D2's home and D1's chassis)
  and A1 (what slices 04/05 will hang on your hook points).
- Your own slice02 self-stop report — the EmitterContext validation notes.

## 1. The work (MUST)

1. **F-1/F-2 — the walker, both backends.** One component per backend that
   enumerates every DD-60 binding position (params of
   `func`/`fn`/`genfunc`/`genfn`/`lambda`, `bind`, destructuring patterns,
   loop bindings, class-method params) yielding (name, position-kind,
   span). **Shared fixture corpus pins shape-parity** between the two
   walkers. JS caveat: identify binding positions *without changing their
   expansion behavior yet* — the throws-at-binding-site fix is slice05's.
   Design the API with the env-extension hook in mind (slices 04/05 will
   call "extend env here"); document the hook points in your bubble-up.
2. **F-3 — D2 on both backends.** Reserved word at any binding position →
   compile error, DD-58-voice diagnostic (`'if' is a JavaScript reserved
   word and cannot be used as a lykn name` + position + fix). Covers
   `export`ed names and the `kernel:` escape's name slot
   (operator-confirmed: validity is not a macro concern). Placement of the
   `kernel:` check — pick for the better span, say why.
3. **F-4 — three-way parity.** Rust list ≡ JS list ≡ the probe's empirical
   legality function; in `make check`; seeded-drift demo, then restore.
4. **F-5 — matrix re-probe.** Only D2 rows move (→ `rejects-cleanly`,
   both). **Any other cell moving = scope leak — stop and surface.**

## 2. Verify (rebuild-first)

`make check` ✓; suites ≥1368/0 · ≥673/0 (+ validator tests); the re-probe
diff showing exactly the D2 delta; snapshots reviewed never auto-accepted;
`./bin/lykn` everywhere.

## 3. Discipline

- The walker is **the** single source of what-binds per backend — resist
  inlining position knowledge at validator call sites; the whole point is
  that slices 04/05 reuse this component, not re-derive it.
- Surface, don't decide: walker API shape, `kernel:` check placement,
  anything the fixtures reveal about binding positions DD-60's list missed
  (if a position exists that the DD didn't enumerate — that's a DD-60
  refinement, surface it).
- Breaking note for arc09: reserved-word names now error (previously:
  invalid JS at rc=0).
- Closing report untracked; `docs/design-v0.6.0/**` is CDC's. Source only.

## 4. Close

Per-row walk (5 rows) + the re-probe diff + walker hook-point notes +
bubble-up → CDC verification → slice04 (rust-resolution) scopes against
your hook points. The arc's endgame: slices 04/05 make the matrix converge;
slice06 makes it permanent.
