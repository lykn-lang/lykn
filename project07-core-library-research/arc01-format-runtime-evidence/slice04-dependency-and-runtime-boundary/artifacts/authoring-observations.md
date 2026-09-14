# Authoring observations and retained failures

CC/Sofie, 2026-09-13. The operator authorized continuation with a maximum of eight
Slice04 failures and explicit `/bin/ln` for isolated symlink setup. The slice
ultimately retains nine failures. The ninth was a process violation: a closeout
verifier was authored after the ceiling, rejected during emitted review and
never executed or corrected. It is not exempted as verification tooling.

| Charge | Condition | Evidence / outcome |
| --- | --- | --- |
| 1–4 | Historical Slice04 source failures | Exact original artifacts/open set and raw packets retained under `payload/meta/prior-artifacts`, `payload/meta/open-set` and inherited packets; prior preparation report remains in Git |
| 5 | First condition symlink preparation | Narrow Deno read/write grants rejected symlink setup before a child record existed; operator authorized isolated `/bin/ln`; work02 freezes that correction |
| 6 | First YAML stringify audit | Plain-scalar expectation rejected actual folded scalar; source-backed byte expectation corrected in work02; original successful child/failing audit retained |
| 7 | First alias-resolution audit | Actual graph error said `not a dependency`; overly specific old predicate failed; work02 preserves the corrected predicate and original output |
| 8 | Second condition cross-filesystem trial | Source-temp read authority absent; actual NotCapable, complete orphan and unchanged destination; no grant correction/retry |
| 9 | Closeout `reconcile.lykn` draft | Source gates passed; emitted code had await inside a synchronous IIFE and a COMPILE_ERROR conditional; never executed or fixed |

The two runtime conditions retain exact source hashes, configs/locks, emitted
code, source gate streams, child/observer output and audit results. The failed
ninth draft is `payload/meta/failed-closeout-reconcile.lykn`, with gates under
`payload/meta/capture-gates/`; no successful result is fabricated for it.
No further code authoring followed that failure. Already-gated capture tooling
and unchanged condition-specific semantic auditors supplied the final packet
and replay; captured replay preserves failing dispositions.

Separately retained infrastructure mistakes: an initial git archive from the
project subdirectory failed; root-scoped export succeeded. An initial source
diff selected no paths from that cwd; corrected full-source files retain all
30 paths. Inherited merged lock failed frozen graph resolution and is retained
beside the distinct resolved preparation lock. `deno info --cached-only` was
rejected as unsupported; static graph retrieval and runtime cached-only cases
remain distinguished. A closeout Markdown patch initially matched the wrong
arc heading and made no writes; the corrected documentation patch was applied.
These are not silently presented as successful commands.

References actually read: current Slice04 prompt/plan/ledger; project/arc bodies
and histories (some combined output truncated); FM01 R rows and RP01; Slice01
findings; JSON/YAML preparation/value/resource CDC; launcher/resume/supervisor
CDC; selected immutable Lykn skill and anti-patterns (some reads truncated),
core/error IDs 01–04 and async IDs 01–05; installed framework, project-management
README/scales/closing, verification ledger/row closure and scientific controls/
capture. Installed Rust guidance is the authorized substitute for the missing
source path; no Rust source was changed. These are not claims to have read every
guide in full. This was informed authoring, not a blinded guide experiment.

Attribution remains bounded: incorrect audit expectations and permission scope
are researcher mistakes, not demonstrated library/compiler defects. Emitted
review caught the invalid helper before runtime; compiler/guide implications
require reproduction through the existing Arc03 findings process. No new source
bug is declared from this failed draft. All earlier guide/book/ADT and human
code-shape obligations survive; an LLM's code assessment is not operator evidence.
