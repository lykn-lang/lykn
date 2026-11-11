# AT-02 initial capture intake

Read on 2026-11-10, 19:05–19:07 America/Chicago (2026-11-11 01:05–01:07 UTC), before writing `response.md` or `decoder.lykn` and before any compiler, formatter, or reviewer feedback.

## Assignment and governing instructions

| Reference | Revision / file | Extent read and use |
|---|---|---|
| Issued assignment | Planning `da126cfc36a268ededd7be504d15794427bd9d6f`; `project07-core-library-research/arc02-lykn-authoring-evidence/slice01-json-value-and-decoder/cc-prompt.md` | Complete file. Fixed task, pinned condition, source-only research policy, allowed destination, and first-capture boundary. |
| Governing instructions | Planning worktree `AGENTS.md` (uncommitted state checked clean); `/AGENTS.md` supplied in the conversation | Complete files. Source/planning boundaries, Lykn research-language restriction, explicit-path Git operations, commit trailers, user persona. |
| Slice manifest | Not found in the assigned slice | Searched only the assigned slice's tracked/hidden file listing for a name containing `manifest`; none was present. No manifest was read or used. |

## Pinned execution identities (identity checks only; no solution execution)

| Item | Verified value |
|---|---|
| Source worktree / branch | `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, `codex/completion-value-flow` |
| Source HEAD | `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95` |
| Source status | Clean (`git status --short --branch` displayed only the branch header) |
| Native CLI SHA-256 | `0cf695212c617b413f0d54fbfc1d0134da1361c33eba4bf627c13f9cb550e4a2` |
| Deno | `2.9.6 (stable, release, aarch64-apple-darwin)` |
| Deno SHA-256 | `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74` |
| Planning worktree / branch / HEAD | `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, `planning`, `da126cfc36a268ededd7be504d15794427bd9d6f`; clean at intake |

Identity command calls were direct shell invocations of `git rev-parse`, `git status --short --branch`, `shasum -a 256`, `deno --version`, and `command -v deno`. No Lykn source was compiled or run.

## Required Lykn source references

All paths below are from source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/completion-value-flow`, commit `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`.

| Reference | Extent read and actual use |
|---|---|
| `skills/lykn/SKILL.md` | Read the complete 808-line skill in one bounded read; tool output reported truncation near the middle, so relevant sections were recovered in explicit excerpts. Used surface conventions, typed boundaries, ADT/match examples, CLI restrictions, and anti-pattern framing. |
| `docs/guides/09-anti-patterns.md` | Required first guide; lines 1–260 read. Used the guidance on strict equality, correct type checks, avoiding truthiness defaults, and source syntax. The remainder was not needed for this answer. |
| `docs/guides/00-lykn-surface-forms.md` | Read `Syntax Fundamentals` (1–73), `Bindings & Mutation` (74–203), `Functions` (204–494), `Types & Pattern Matching` (495–652), and `Objects & Immutable Updates` (653–740). Used member access, keyword fields, immutable bindings, typed functions, constructors, Option/match patterns, and object/array syntax. |
| `docs/guides/05-type-discipline.md` | Read ID-01–05 (1–207), ID-19 (503–522), ID-21 (537–563), and ID-26–30 (638–754). Used typed parameters/returns, ADTs, domain validation contracts, explicit `undefined` vs `null`, boundary validation, and limitations of `:array` checks. |
| `docs/guides/06-functions-closures.md` | Read ID-01–02 (14–79), ID-11–13 (606–655), ID-20–24 (743–865), and ID-28–29 (973–1033). Used `func`/`fn`, binding scope, search/array methods, and pure decoder structure. |

No extra source guide files were consulted. The skill's inline guidance and its directly applicable examples were consulted as recorded above.

## Required captured book chapters

Both immutable snapshots are under this slice's `artifacts/at02/references/`. Their provenance was checked against `/Users/oubiwann/lab/cnbb/lykn` at `main` commit `f55da0e86068ce1aa27581fe1199b68258e64f3f`; `git show <commit>:<path> | shasum -a 256` matched each snapshot byte-for-byte.

| Original book file at pinned commit | Captured file / SHA-256 | Extent and actual use |
|---|---|---|
| `src/part2/chapter10/2-type.md` | `artifacts/at02/references/2-type.md` / `2791e869067fcf09dbb8b19f0a72d3b6c53b4a6dc1423fffffe2e14ef589260f` | Complete file. Used named ADT fields, constructor validation, and zero-field constructors. |
| `src/part2/chapter10/3-match.md` | `artifacts/at02/references/3-match.md` / `f47589a91397d7538a93874d4fcbb0ba7517b7f5111ae6b5fbb55e13d1a1c910` | Complete file. Used constructor patterns, literal/wildcard patterns, and the lack of a runtime pattern library. |

## Tool calls, readback, and deviations

- Read assignment, then planning `AGENTS.md`; verified the named source and planning identities; read Lykn skill, anti-patterns first, assigned source guide sections, and both pinned book snapshots. Used shell only for direct identity/Git/hash commands and reads; file authoring uses Lykn source and Markdown. No Python, Ruby, Fennel, handwritten JS/Node, network, dependencies, examples, earlier conversation, memory, or preflight probe were used.
- Available model identification: GPT-6 family / Codex. Reasoning-effort setting was not exposed to this agent.
- Readback: sample domain shape is `{ server: { port }, label? }`; input is an already decoded, explicitly ADT-modeled value; success and expected decode failures are represented by Lykn ADTs; source execution remains after this capture.
- The governing source-only/no-new-dependencies policy agrees with this assignment. The skill's general CLI verification advice is deferred by the assignment's explicit first-capture condition; no command was run to compile, format, or execute the proposed code.
- Before reading the match chapter, one `cat` used a path missing the `arc02-lykn-authoring-evidence` component and returned “No such file or directory.” The correct assigned snapshot was then read in full. This lookup mistake is preserved here without changing the captured answer.
- Manifest unavailable: the assigned slice contains no filename matching `manifest`; no substitute manifest was inferred.
- No pre-capture compiler output, formatter output, evaluation feedback, reviewer hint, or answer revision occurred.
