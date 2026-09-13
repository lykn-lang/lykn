# arc09 slice05 — Release-candidate UAT Feedback

> **Status: Open.** The operator deferred full 0.6.0 publication on 2026-09-12
> to run UAT in other projects first. This slice records that UAT gate and the
> feedback disposition before publication is reconsidered.

## 1. Objective

Exercise the 0.6.0 release candidate in the projects that need to ship with it,
record feedback, and decide whether the release candidate remains publish-ready
or needs another source iteration.

## 2. Inputs

- [slice03 CDC-verified dry-run receipt](../slice03-publish-dry-runs-and-package-audit/artifacts/dry-run-and-package-audit-receipt.md)
- [slice04 deferral closing report](../slice04-operator-publication-and-tags/closing-report.md)
- Current release-candidate source commit `50608c443c452107b138cc30deda4a09ab5c7642`

## 3. In scope

- Identify the UAT projects and the exact Lykn release-candidate consumption route for each.
- Run the project-specific build/test/package gates needed to decide whether each project can ship with the 0.6.0 release candidate.
- Record feedback as release-blocking, non-blocking, or routed to later work.
- If feedback requires source changes, route that iteration explicitly and refresh the affected release evidence before returning to publication.
- If all projects pass UAT, open a post-UAT publication/tag slice with the exact release-candidate commit and evidence packet.

## 4. Out of scope

- Publishing Lykn 0.6.0 to JSR, npm, or crates.io.
- Creating or pushing source or book release tags.
- Treating UAT feedback as accepted without evidence or explicit routing.
- Post-publish temporary-install verification.

## 5. Verification

- UAT project matrix names every project, commit/status, Lykn consumption route, commands run, results, and feedback disposition.
- Any release-blocking feedback has an owning source/planning home before the slice closes.
- If source changes, refreshed source validation and relevant dry-runs are captured before publication resumes.
- If no source changes are needed, the existing release-candidate commit is confirmed as still publish-ready.

## 6. Completion

This slice closes when the operator has enough UAT evidence to either iterate on
the release candidate or resume the publication/tag boundary.
