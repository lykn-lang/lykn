# Findings and prerequisites — 2026-09-12

CC-attested baseline inspection. No source fixes, behavioral probes or independent
verification performed. New permanent IDs are recorded in the
[Discovery Register](../../../../backlog/discoveries.md); source evidence and
claims are detailed in [B01](baseline.md) and [source register](source-register.md).
All new discovery statuses remain **open**. Proposed later owners below do not
claim routing into a future arc/slice that does not yet exist in Git.

## Confirmed findings

| ID | Evidence and implication | Owner / re-entry condition |
| --- | --- | --- |
| D-2609-PERM | Lykn source `8c66469`, `crates/lykn-cli/src/main.rs:499,505` injects `-A` in run. Actual selected help has no permission-forwarding option; repository governance forbids injection. Source-level implementation defect; selected binary behavior not probed | CDC must resolve before S02 runtime launch: open narrow Arc03 correction with exact release source paths and permission negative tests, or record explicit operator authorization of a research launch route. S04 must still prove effective permissions |
| D-2609-LINT | Same commit, `assets/ai/SKILL.md:76-79` prohibits user lint/format over generated JS; `:709-715` prescribes that pipeline as MUST. Guide 14 repeats the latter at ID-22. Directly conflicting authoring instructions | A03 correction after A02 captures affected authoring behavior; current trials follow source-first rule and retain contradiction. No compiler bug inferred from wording alone |
| D-2609-NPMB | Same commit, SKILL line 21 says strictly no npm in development, but guide 14 ID-07/24 explicitly teaches npm dependencies (lines 103,304–315), and project.json:11 imports npm:astring | A03 clarify guide scope and existing compiler-tooling exception; S04 audit new-library policy separately. Existing dependency is not permission to add another |
| D-2609-JSER | Book commit `6aa379d`, `src/part5/chapter25/2-json.md:44` groups unsupported values as dropped or converted to null, including BigInt. ECMAScript 2025 §25.5.2.2 requires TypeError for a remaining BigInt value | A02 reproduce J-09 and inspect Date/Map/Set wording too; A03 coordinate correction with Project02 Book arc. No blanket book audit or repair claimed |
| D-2609-YNOD | Published @eemeli/yaml 2.9.1 has runtime imports of node:process in src/compose/composer.ts:1, src/parse/parser.ts:1, src/log.ts:1. Public index exports parser/composer. Static import evidence directly contradicts treating this JSR candidate as Node-API-free | S04 dependency alternatives/policy disposition before any candidate execution/adoption; S03 retains Y-14 document-preservation requirement as gated. Do not replace it silently with npm or presume a port is approved |

These findings can be reproduced by reading pinned primary sources; they are
not reported as exploit findings or runtime failures. Byte hashes of all 30
std/yaml and 77 eemeli/yaml published TS files were compared with their pinned
metadata checksum: **107 checked, 0 mismatches**. This validates retrieved bytes,
not source correctness, graph execution, policy acceptance or library fidelity.

## Deduplication record

Read planning `backlog/README.md`; searched existing discoveries for npm/astring,
permissions/allow-all/-A, generated output lint/format, JSON/BigInt/serialization,
guide/CLI and new IDs before insertion. No equivalent specific findings were
found for the five rows above. Existing adjacent rows were retained:

- D-2608-BINW addresses new-project local CLI availability, not B01's installed
  vs local version difference. No duplicate binary-availability discovery added.
- D-2607-V5DK is the prior dist-command guide correction; it does not close the
  remaining generated-output lint contradiction.
- D-2607-N8RP, D-2607-F6PA and D-2607-M2XE already concern try/Result and book
  contradictions. Reuse these when AT-05 reproduces related behavior; do not
  count them as new discoveries from this baseline.
- D-2609-FNRT has recorded closure; D-2609-FOVL records a compiler-parity finding.
  Their ledger dispositions are prior evidence, not independently reproduced
  by this slice. A02 must pin/recheck relevant behavior rather than inherit it.

The scan was specific to baseline findings, not a complete re-audit of the
Discovery Register. No trending totals or historical statuses were rewritten.

## Hypotheses and unresolved prerequisites

| ID | Observation / hypothesis | Disposition and owner |
| --- | --- | --- |
| H-01 | Skill says compiler verifies match coverage; guide 05 ID-04 describes a runtime fallback. Static exhaustiveness, forged tags and recursive fields may provide less protection than readers expect | Unresolved implementation cause; L-01/03 in A02 must test both compilers, assertions and malformed values before calling it a compiler defect |
| H-02 | Keyword/object naming conversion may corrupt externally supplied arbitrary keys if authoring guidance is followed indiscriminately | Untested hazard; J-08/L-04, S02/A02 own exact-key preservation; no source defect declared |
| H-03 | Value-based YAML rewrite loses presentation; document APIs may still normalize unrelated bytes | API-shape inference only; Y-10/11/14 in S03 measure actual value and byte effects |
| H-04 | Runtime compatibility, resource bounds, cached/offline resolution and file replacement semantics remain untested | S02/03 collect per-run evidence; S04 closes graph/runtime boundary after launch gate; do not call docs package acceptance |
| G-01 | Selected 0.6.0-dev binary is available but not traceably built from source HEAD | B01 identifies bytes and help honestly. Record build receipt in an explicitly authorized later source/provenance step if source attribution is needed; do not rebuild here |
| G-02 | Patch checkout not found in bounded search; could be differently named or elsewhere | Arc04 must establish path, remote, branch/status before source integration. No repository creation, ID reservation or guessed route |
| G-03 | @std/yaml port ancestry and upstream dev ecosystems may conflict with the operator's broader “ecosystem” boundary even when runtime imports are local | S04 exposes ancestry/runtime/dev distinctions; operator decides acceptance. No acceptance inferred from std naming or Deno compatibility |
| G-04 | Operator's aesthetic preferences for the resulting code have not been elicited on any trial source | A02 L-08/AE01 capture actual reactions; project P-08 remains open |

## Scope disposition

The slice delivered inspection and a versioned protocol. Full format trials,
permission correction, candidate replacement, compiler/type probes, authoring
trials, human reviews and source integration remain their original later work.
The new launch prerequisite may justify opening Arc03 earlier, as already
permitted by the project roadmap. CDC decides the concrete next opening without
silently dropping JSON-first sequencing or the YAML document workflow.
