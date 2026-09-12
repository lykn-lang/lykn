# CDC verification — Slice01 closed

Date: 2026-09-12 UTC. Reviewer: Codex, CDC, separate from executing CC.
Reviewed commit: `eb200e5ae831dac27ee012c099939d07f6ba274e`.

**Verdict: all seven baseline/protocol criteria are done at reproduced strength.**
This closes research preparation, not executed JSON/YAML behavior, dependency
acceptance, repaired source, or human aesthetic acceptance. The CC closing
report and B01 remain historical attestation; this file supplies independent
review and current-state reconciliation.

## Independent checks

- Re-read original scope, seven ledger criteria, six new artifacts, seed,
  closing report, ancestor diffs and five discovery additions.
- `git show --format= --check eb200e5` passed. Its 14 paths match the report
  and are a subset of the original prompt's allowlist. Seed and CC prompt
  were unchanged. No source changes were included.
- Replayed the report's fence-aware link check: **49 links, 0 missing**.
  Checked 10 source and seven book paths with `git cat-file -e` at `8c66469`
  and `6aa379d`: **17 locators, 0 missing**. Inspected relevant content too.
- Counted **10 SE dispositions**, **51 unique fixture families** (17 J,
  16 Y, 9 R, 9 L), five original authoring tasks, seven unchanged criteria.
  Walked coverage against project Scope and DoD; no category was dropped.
- Independently fetched pinned YAML manifests and all their TS files into a
  fresh disposable directory. Checked manifest hashes against CC's recorded
  identities before trusting individual checksums:

```text
std/yaml/1.2.0 checked=30 mismatches=0
metadata sha256=20beb41e4983ba3437dbefac62b14061ab058e8a187596f19d28ff9035f6e6cf
eemeli/yaml/2.9.1 checked=77 mismatches=0
metadata sha256=8987c5ee76629274c14b610d5eb0b6f71d08eafe0dd8b9d233aec69bbf9e705d
```

Replay: the complete curl/jq/shasum procedure in
[source-register.md](artifacts/source-register.md), including manifest hash
checks. CDC scratch was `/private/tmp/lykn-p07-cdc-sources.fR8iDm`; the pinned
URLs/hashes are the durable replay anchors. No package code was executed.

Read the retrieved JSON stream/canonicalization and JSONC implementations,
YAML parser/schema/types and document APIs. Confirmed framing qualifications,
JSONC's type-only import, and std/yaml's internal-versus-test import boundary.
Confirmed `node:process` imports at line 1 of the candidate's composer, parser
and logging modules, their public-index exports, and actual env/emitWarning
uses. This proves a Node API dependency, not a Node executable requirement.

Read the pinned launcher and contradictory guide passages with `git show`;
inspected book JSON line 44 and ECMAScript 2025 SerializeJSONProperty's BigInt
throw rule. All five discoveries are supported at their stated source/document
evidence kind. Full resolved graphs, runtime behavior and vulnerability claims
are not inferred. Deduplication review found no matching prior entry for these
five specific findings; adjacent discoveries were retained.

## Baseline drift reconciliation

CDC observations began around 22:01 UTC. Re-ran version/help/hash, worktree/status,
symlink and bounded patch-search checks. Deno and PATH Lykn retain B01 identities:

| Surface | CDC observation | Consequence |
| --- | --- | --- |
| Deno | 2.7.7; SHA-256 `103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4` | B01 reproduced |
| PATH Lykn | 0.5.2; SHA-256 `c02d3b844d1d3243f5ad0d4793e3cd2c691038f9011e43734513e1dd19b6bb03` | B01 reproduced; still not selected |
| 0.6.x source | `2a0cabf80fcc881c47995421b579244b3b7fb19c` | Since B01 only classifier.js and language-surface-runway.test.js changed; launcher unchanged |
| bin/lykn and target/release/lykn | Both 0.6.0-dev; SHA-256 `67517631606f0588103a35bbbc0b8cdcefb4dc9c891e4c25848d3bbe7d1912c2` | New binary bytes; historical B01 build provenance remains attested/unknown |
| Book | `43cfebc27e57952511e0b01e06b629abf1322e79`; same symlink target | JSON chapter unchanged; untracked `_to_delete/` preserved |

No patch checkout was found within the recorded bounded search. Historical Git
objects and guide locators remain available. Do not overwrite B01 with current
identities or call its historical binary independently recreated. The correction
must produce a fresh build receipt; subsequent trials pin that corrected binary.
No source/book files were changed by CDC.

## Per-row verdict

| Row | Status / strength | Basis and limit |
| --- | --- | --- |
| S-01 | done / reproduced | Current identity inspection plus pinned source checks; drift reconciled. Historical binary provenance remains unknown as permitted by the contract |
| S-02 | done / reproduced | All ten source dispositions inspected, independent package bytes and specification checks; no runtime overclaim |
| S-03 | done / reproduced | All 51 owned families retain inputs, invariants/unknowns and evidence; crosswalk covers scope |
| S-04 | done / reproduced | Read-only protocol walkthrough, available compiler/runtime identities, isolation/recording/stops and explicit launch prerequisite. Restricted runtime execution is not claimed |
| S-05 | done / reproduced | Five tasks, reference logs, six-way attribution, denominators, controls, book locators and human-review protocol; no invented scores |
| S-06 | done / reproduced | Five supported discoveries, separate hypotheses/gaps, honest open status. PERM gains a concrete correction destination at CDC opening |
| S-07 | done / reproduced | Complete artifact/row walk, exact CC scope, checks and bubble-up; zero removed, deferred or no-op criteria |

## Bubble-up check and advancement

The assigned baseline/protocol capability is delivered. Runtime trials were
outside this slice and their prerequisite is explicit.

**Plan change:** open Arc03 early and its `slice01-run-permissions` under the
operator's explicit tooling-correction authorization. Open Arc01/Slice02's full
packet with execution blocked until that correction is independently verified.
The actionable next CC assignment is the correction. Retain J-01–17, YAML Y-14,
and resource-supervisor gates. No direct-Deno or Node-candidate exception is
introduced. Broader guide/book/test-runner corrections remain open.

Current drift requires a new build receipt, not a rewrite of CC's historical
baseline. Only Arc01 A-01 (child closure) closes above this slice; arc/project
composition and operator acceptance remain open.

CDC handoff validation: 73 project-local Markdown links resolve after opening
the correction and JSON packets; status JSON parses and names Arc03 current,
Arc01 next. Original seven criterion texts remain unchanged. Whitespace and
exact staged scope were checked before the CDC commit. Concurrent Project02
closure was committed separately and is not part of this review's changes.

## What worked

Pinned source exposed a Node API edge hidden by package summaries. Separating
binary bytes from source commits made concurrent changes visible. The case
crosswalk retained human and documentation outcomes alongside format research.
