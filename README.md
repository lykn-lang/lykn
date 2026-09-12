# Lykn planning

Planning authority lives on branch `planning` in `.worktrees/planning`. Source docs are for users and developers.

- [project01-mvp](project01-mvp/project-plan.md)
- [project02-language-toolchain-alignment](project02-language-toolchain-alignment/project-plan.md)
- [project03-language-evolution](project03-language-evolution/project-plan.md)
- [project04-c-lang](project04-c-lang/project-plan.md)
- [project05-hardware](project05-hardware/project-plan.md)
- [project06-planning-reorg](project06-planning-reorg/project-plan.md)
- [project07-core-library-research](project07-core-library-research/project-plan.md): JSON, YAML, Deno, and Lykn authoring research; Expedited Mode.

- [Planning status dashboards](status/status.html)
- [Cross-project backlog](backlog/README.md)
- [Migration provenance](project06-planning-reorg/arc01-history-and-import/slice01-migration/artifacts/migration-manifest.json)

Projects use planned-release YAML metadata; numeric IDs do not define release scope or dependency order. Historical source-root snippets are read against the source commit in the migration manifest. Current source work runs in its release worktree. Original implementation commits remain ancestors of selective imports solely to preserve file history; never merge planning into source.
