# project05-hardware

Current home: branch planning, project05-hardware. Start with [project-plan.md](project-plan.md). Release intent is YAML metadata; the following retained notes describe the original versioned layout.

# Lykn Hardware 0.8.0 Planning

This tree is the planning home for hardware-coupled Lykn 0.8.0 research:
small electronics experiments that should teach both camera telemetry facts and
embedded-C target requirements for Lykn.

The canonical planning layout follows the project/arc/slice discipline from
`collaboration-framework/docs/PROJECT-MANAGEMENT.md`, with one local adaptation:
this track lives under `project05-hardware/` rather than
`project04-c-lang/` because the operator explicitly split hardware
investigation from the compiler-design seed.

Artifacts:

- `project-plan.md` is the roadmap and project ledger.
- `arcNN-*/arc-plan.md` files are first-pass arc plans.
- Per-slice open sets will be added only when a slice is next:
  `slice-doc.md`, `ledger.md`, and `cc-prompt.md`.
- Per-slice close sets are not opened until there is work to close:
  `closing-report.md` and `cdc-verification.md`.

Current status: first approximation, created 2026-08-21.
