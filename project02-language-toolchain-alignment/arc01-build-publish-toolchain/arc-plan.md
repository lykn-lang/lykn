# arc01 — Build & Publish Toolchain

> **Status: Closed.** Reconstructed retroactively (2026-06-28) from milestone
> M11+M13. See `slice01-.../{ledger.md, closing-report.md}` for the shipped
> evidence and `design/kickoff-thread.md` for the originating thread.

## 1. Capability

Move the build/publish toolchain onto a clean, Lykn-scoped artifact discipline:
intermediate compiler output under `target/lykn/build/` and publish-ready
staging under `target/lykn/dist/` (matching Rust's `target/` convention and
keeping `.js` out of the source tree, per philosophy Principle 1), and make the
publish gate explicit at the Lykn surface — `lykn publish` fails on an
uncommitted working tree, with an opt-in override that is **never**
auto-injected (philosophy decided-questions #1 and #4; AGENTS.md "Lykn CLI
safety gates").

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · build-dir-and-publish-dirty-check** | `target/lykn/{build,dist}` reorg; `lykn dist` subcommand + deprecation alias; whole-project `lykn build`; `project.json` import repointing; scaffold update; `lykn publish` dirty-check gate + `--allow-dirty` (no auto-injection) | Closed |

**Note on slicing.** This arc was proposed as two slices (build-dir reorg /
publish dirty-check) but **shipped as one combined milestone (M11+M13)** with a
single ledger whose rows (`M11M13-1…12`) interleave both capabilities and share
cross-spec consistency and substrate-compliance checks. Splitting the combined
artifact retroactively would damage a coherent document, so the arc carries one
slice. Both capabilities are fully covered within. (Recorded in project-plan
Version History v1.0.)

## 3. Dependencies

Consumes: nothing earlier (foundational). Leaves for later arcs: the
`target/lykn/build/` layout that arc03 (compiler-coherence) and arc06
(dep-ergonomics) build on; the `lykn publish` gate that arc09 (release) relies
on.

## 4. Arc ledger

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg.

## 5. Version History

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from M11+M13 (shipped 2026-05-11). One-slice decision recorded
above and in project-plan v1.0.
