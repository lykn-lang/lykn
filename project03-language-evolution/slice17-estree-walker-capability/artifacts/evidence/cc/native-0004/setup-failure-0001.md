# Setup failure 0001 — recursive ancestor config probe

The attempted recursive `find` probe at `/private/tmp` exited 1 before any native
compiler command. The observed stderr was:

`find: /private/tmp/codex-daemon-501: Operation not permitted`

The partial output file is retained as `setup-failure-0001-ancestor-configs-partial.txt`.
No source/compiler/runtime check was run by this setup attempt.
