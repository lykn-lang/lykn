# Hardware local-state recovery

Nine modified and eleven untracked files were relocated from the 0.8.x hardware planning tree into project05-hardware. They remain uncommitted. The relocation manifest records raw and relocated SHA-256 hashes; Markdown changes consist of navigation and project metadata applied by the migration. Other artifacts are byte-identical.

A safety stash retains the original local state, including the untracked files. It was not popped or dropped:

```text
8cb53cc4a0a401a4739d9178f10612b954c2387a
```

The local backup directory is /private/tmp/lykn-planning-reorg-20260906/local-hardware. The tracked records are in the stash tree, and its third parent holds the originally untracked files. Do not restore the old paths into a cleaned release branch; use the manifest destinations.
