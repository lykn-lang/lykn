# CC closing report — Run permissions proposed-done

Date: 2026-09-12. Role: CC implementer. Status: **proposed-done**, at attested
strength. All six ledger rows remain **open** pending CDC reproduction.

Source commit: `d0bb981dae2a4abf6c984406c4b2081a45cc92f8` on `release/0.6.x`,
worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`.
The planning delivery is the scoped commit containing this report, identifiable
with `git log -1 --format=%H -- project07-core-library-research/arc03-findings-and-integration/slice01-run-permissions/closing-report.md`
from the planning root. Both source and planning commits precede CDC handoff;
the user-facing delivery reports their exact IDs. Nothing was pushed or propagated.

## Delivered behavior

`lykn run` no longer injects all-access grants. Its explicit allow/deny options
accept bare or equals-scoped values, with Deno-compatible repeated scopes;
`-A`/`--allow-all`, no-prompt, cached-only and frozen controls are explicit.
Runtime flags end at FILE; script arguments cannot become permissions.
Standalone/workspace compilation, effective config and child exit propagation
are retained. Both requested guides describe the resulting contract.

## Per-row attestation

| Row | Proposed result / strength | Evidence and remaining close requirement |
| --- | --- | --- |
| RP-01 | proposed-done / attested | [Original reproduction](artifacts/reproduction.md) captures implicit -A on all three routes. [Validation](artifacts/validation.md) proves absence on corrected standalone/workspace/JS and no-project fallback. CDC replay pending |
| RP-02 | proposed-done / attested | All 16 permission options, bare/scoped/repeated/empty, equals, spaces, both all-access spellings, separator and after-FILE flags covered by process tests; real Deno repeated-scope controls. CDC replay pending |
| RP-03 | proposed-done / attested | Three routes × read/write controls: no-grant and outside denial, scoped success, deny precedence, script grant attempts; six additional receipt-executable controls. CDC replay pending |
| RP-04 | proposed-done / attested | Config overlay/path checks, all cached/frozen forms and runtime placement; mock child stderr/exit 37 and actual Deno script exit 23. CDC replay pending |
| RP-05 | proposed-done / attested | Two source guides, fresh help, [RP-B01 receipt](artifacts/build-receipt.md): source/tree/input hashes, build settings, runtime identity and binary hash. CDC reconciliation pending |
| RP-06 | CC delivery proposed-done / attested | 11 targeted tests, canonical make check, committed-HEAD cited gate, exact source commit and scoped planning handoff. Independent close is explicitly still pending; JSON launch remains gated |

Validation: 1,502 Rust tests, 1,465 JavaScript/Lykn suite tests, and 482 doc
tests passed in canonical `make check`; Clippy, formatting, syntax/source lint
and cited paths passed. The final targeted run passed all 11 tests. Committed
HEAD's separate cited-path gate also passed. Two failed verification rounds
(test path-string assumption, then Clippy enum size) were corrected within
scope and retained in [validation](artifacts/validation.md).

## Artifact and scope inventory

- `artifacts/reproduction.md`: original source/binary defect and Deno parsing controls.
- `artifacts/validation.md`: coverage, failed/successful gates, revised argv,
  receipt-executable smoke and CDC replay instructions.
- `artifacts/build-receipt.md`: RP-B01 source-to-byte/runtime provenance and help.

Source commit paths exactly match the four-file allowlist: main.rs, the new
run_permissions.rs integration test, and the two named guides. No dependency,
lockfile, snapshot, governance, test-runner or unrelated source edit. Planning
updates are limited to the authorized slice/ancestor evidence and discovery
entry. Unrelated concurrently staged planning work is excluded with exact
path commits. The required Rust skill was missing; the operator explicitly
approved installed rust-guidelines, recorded in validation and the CC prompt.

## Bubble-up to the arc

1. **Assigned capability:** The run-permission repair and traceable executable
   are delivered at CC attested strength. A3-01 remains open until CDC independently
   establishes the correction. The assigned correction does not close Arc03.
2. **New information and plan effect:** Deno 2.7.7 distinguishes bare permission
   flags from explicit empty values, and mixed bare/scoped repetitions retain
   the scopes. Tests and guides now preserve that behavior. No new slice or
   sequencing change is needed. RP-B01 replaces the unknown-build prerequisite
   for future trials only after CDC verifies it; historical B01 stays intact.
3. **Silent-drop diff:** Six rows opened, six reported, zero removed/deferred/
   no-op rows. Required process and real read/write controls, both guides,
   original/revised evidence, full gates, and build receipt are present.
   Independent verification is owed, not silently credited. Actual prompting,
   Windows execution and comprehensive non-file permission enforcement are not
   asserted. Full package/offline work remains Arc01/Slice04; test-runner
   permission debt remains Arc03/Slice02. LINT/NPMB/JSER and human acceptance
   retain their existing owners.

CDC must verify and close this slice before lifting the opened JSON packet's
gate. After that closure, resume this exact prompt (not Arc03 numeric advancement):

`arc01-format-runtime-evidence/slice02-json-behavior/cc-prompt.md`

Queue Arc03/Slice02 planning separately. No JSON runtime trial, formal closure,
operator acceptance, publication or release propagation is claimed here.
