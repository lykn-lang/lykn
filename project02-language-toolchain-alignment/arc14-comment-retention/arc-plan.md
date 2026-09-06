# arc14 — Comment Retention & Provenance

> **Status: SEEDED (2026-07-21) — not slice-planned.** Capability home for the
> operator's comment-handling directive; design in
> [`design/dd-62-comment-retention-DRAFT.md`](./design/dd-62-comment-retention-DRAFT.md)
> (odm promotion = Duncan). **Release boundary: 0.7.0 — operator-decided 2026-07-21** (additive
> capability, not toolchain *alignment*; kept out so arc05/0.6.0 closed without a
> new blocker). Created when arc05 slice04
> deferred the lint-suppression mechanism here (its natural first consumer).

## 1. Capability

The lykn compiler **retains comments** through the pipeline instead of
discarding them at the reader (today both backends drop line/block/datum
comments; `SExpr` has no trivia node). Three commitments (DD-62):

1. **Reader retention (opt-in)** — capture comments rather than skip them, on
   both backends, attached to the tree (attach model TBD — DD-62 §5).
2. **Provenance across surface → kernel** — a comment carried through lowering
   is tagged *surface-authored*, so a consumer knows it described the surface
   the user wrote and may not describe the transformed code beside it.
3. **Strip-or-preserve at JS emission** — comments removed only at final
   codegen (default strip; opt-in preserve with a provenance annotation).

The flagship payoff is readable JS that carries the author's comments honestly;
the immediate payoff is **lint suppression** (arc05's deferred mechanism).

## 2. Slice breakdown

**Not yet planned** (plan late, plan deep). The DD-62 §6 seed sketch —
s01 reader-retention (C1) + attach model → s02 lint-suppression → s03
provenance (C2) → s04 JS emission (C3) + arc close — is a starting point, to be
turned into an open set when the arc becomes active and the attach-model
question (DD-62 §5) is resolved.

## 3. Dependencies

Consumes arc13's node-metadata pattern (arc13 made `SExpr::Atom` a private-payload
struct — the precedent for carrying node metadata without breaking the public
API) and its conformance-corpus discipline (a comment-conformance corpus is the
cross-backend gate). **Retires the arc05 slice04 suppression deferral** (s02 is
the suppression mechanism). Independent of arc06/arc07.

## 4. Arc ledger

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.0 — 2026-07-21 (seeded)
Created as the home for the operator's comment-retention directive, surfaced
during arc05 slice04 scoping when the suppression mechanism was found to depend
on reader comment-retention (which does not exist — same shape as arc05→arc13).
DD-62 drafted (3 commitments + attach-model options + slice seed). Release
boundary **decided 0.7.0** (operator, 2026-07-21; CDC's lean confirmed). Suppression
deferred here from slice04. Which-child-surfaced: arc05 slice04 scoping.
