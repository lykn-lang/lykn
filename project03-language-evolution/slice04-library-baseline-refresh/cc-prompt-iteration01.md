# CC correction — Slice04 iteration01

Execute this bounded refinement and return to CDC. You remain OpenAI Codex
6 Luna High; CDC/reviewer remains Sol6.1 High. Project03, collapsed standalone
Slice04. This is the first refinement after `cc-prompt.md`, initial CC commit
`e4d0e4d159028183836ae853a36f2ea55ee49c19`. Read this whole prompt, current
slice-plan/ledger and `cdc-verification.md` initial review before editing.
Source still read-only release/0.7.x at
`74a90d51b853fc18fe2b7c6ee07417736e1ce464`; revalidate source/planning identity
and relevant status. Current planning includes CDC's iteration-open commit.

## What remains

LB-05 is not ready: Findings §Claims, controls and falsifying oracles currently
puts unrelated YAML modules **inside the JSON package**. The accepted direction
is independently opt-in packages, so distinguish two separately falsifiable
claims: a JSON consumer excludes a separate YAML package; a consumer of one JSON
entrypoint excludes unused modules inside that JSON package. The initial prompt
already required independent packages/selective entrypoints and functional,
effect and API oracles. This correction completes that contract; it does not
approve a production API, fixture execution or new evidence mechanism.

1. In existing Findings, preserve the initial attempt via Git plus the dated
   correction/readback note; replace the current conflated oracle with a clear
   pair. Define hypothetical local research specimens **only in prose**; no
   fixture/program/package is created in this slice. Distinguish local specimen
   labels from assigned `@lykn/*` production names/APIs.
2. Cross-package specimen: independent JSON and YAML fixture packages are both
   available, with no JSON→YAML dependency. Freeze their disjoint module sets.
   The consumer imports JSON value parsing only; for `{"x":1}`, the returned
   value has exactly key x with number1. Specify absence of every YAML module/
   edge/contribution under the approved graph/retained-output evidence method,
   plus a positive control that explicitly imports YAML. Exact hypothetical
   YAML behavior may be a small stated fixture result, not a production parser
   promise. Do not silently equate graph inclusion with retained payload.
3. Within-package specimen: the JSON fixture exposes a value-parse subpath and
   a separate file-I/O/document-helper subpath. The value module must have no
   dependency on the other subpath and unused helpers must have no load-time
   effects in this specific specimen. JSON value consumer still yields x=1,
   while helper module identities/edges/contribution are absent under the
   proposed evidence method. Define a positive consumer of the helper subpath
   so a broken entrypoint cannot pass merely by disappearing. All configured
   public subpaths remain usable in the separate package-API check; one app's
   omission cannot delete the helpers from published package output.
4. Make no-import and effect observations concrete enough for later execution.
   For example a no-import app emits exactly `BASE` and compares the frozen
   stdlib module set against resolved-input and retained-output evidence;
   a used-export case returns42; an effect case observes exactly
   `["init:effect", "entry:42"]`; a separate throwing-initializer case observes
   `Error("audit-init")` and no entry marker. You may use equivalent precise
   hypothetical data with the same discrimination. Preserve required throwing/
   effect behavior instead of using PURE/sideEffects:false to pass the test.
   Distinguish the planned graph/membership/functional evidence and its gaps;
   missing metafile/walker or attribution capability remains unresolved, not
   replaced by grep or a byte delta. No experiment is authorized.
5. LB-01 clarification only: the existing intake generically groups required
   framework/domain documents. In that same record, name manifest items and
   actual loaded full/section extents with source identity; keep previously
   recorded read coverage and source evidence. State any missing extent and
   load only a genuine gap. Do not repeat unchanged complete documents merely
   to produce new receipts. Query coverage and original source/tool observations
   remain their original date/pin; add a short current-prompt readback of the
   two boundary claims. Reading receipts remain attestation, not acceptance.

## Evidence retention, checks and return

CDC already reproduced LB-02/03/04 and diagnostic/source portions of LB-06 at
the unchanged source pin, plus LB-01 source/tool facts; see verification record.
Retain those observations with their actual original evidence date/revision.
This correction does not require a new source census, full reread, tool-help
run, build or research program. Recheck source references only if your edits
change their meaning; recheck active assignment/current source status always.
F-1–F-12 and all Project07 gates remain unchanged and open. Five-iteration
budget is unchanged; this is iteration01. No next slice or experiment follows.

Required-full now: this prompt, current slice-plan and ledger, current CDC
initial review, and the Findings protocol/Intake plus closing-report being
changed. Required-section: prior prompt §§Deliverable and boundary, Preflight
and ownership, Checks stop and return (same constraints); the original manifest
remains applicable with honestly retained coverage, not invented new receipts.
Conditional: load an exact prior guide/source extent only if you identify an
actual coverage gap or change a source conclusion. Record not-triggered reasons
and current readback briefly in existing Findings; no new evidence file needed.

Mutation/index ownership transfers to you for the same four paths only:
`artifacts/findings.md`, `ledger.md`, `slice-plan.md` (assignment/intake status
only), `closing-report.md`, all under this Slice04. CDC verification/iteration
prompt and parent plans are read-only. Do not change issued prompts.

Self-check LB-05 against all five claims: no import; cross-package JSON/YAML
exclusion; within-JSON selective entrypoint; effectful application shake; public
package API preservation. Each has a setup, precise observation and plausible
wrong outcome it rejects. Check source diff/path scope, F-row count/preservation,
`git diff --check`, final artifact inventory (one Findings file), and residual
owners. Update ledger evidence as attested, statuses stay open. Preserve the
initial closing report in a dated section and append iteration01's current
row-walk/update rather than erase initial proposed-done history.

Commit only the four explicit permitted paths (`git commit --only -- <paths>`)
with contiguous Codex and Billo AI trailers as before. Return exact prompt,
commit, changes/checks/limits, source/planning status and ownership to CDC.
Do not author your own independent verification or retrospective.
