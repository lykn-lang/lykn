# Local I3 release integration — 2026-11-10

The Operator authorized the root coordinator's local fast-forward
from `6c9dbd5c38f16674c7b95315bd32bfee9fd131e5` to accepted
`487ebdbbae1758228f81383210eba419d64cc8ed`. Sol 6.1 High CDC
independently checked the exact fast-forward reflog, 0/34 ancestry,
31 changed paths, clean status, exact target comparison and tree
`05b5aa7a52cca1a32e65c5bd378c3a24ac12f5a7`.

Unfiltered normal Make and standalone citations each exit 0 on the
actual release checkout. The full gate covers Clippy, formatting,
all Rust suites including 1,167 library tests, 1,494 JS/Lykn tests
plus 67 steps, and 482 documentation tests. Citations cover 64
documents and 601 historical entries. The launches used ordinary
Deno 2.9.6 on PATH, Rust/Cargo 1.97.0, fixed DENO_DIR and separate
configuration-free temporary, XDG and npm roots. Neither used
a test-only selector or evidence override.

The built and copied release binaries match at SHA-256
`04c582ca789db38dd7a92ed8f63c0869ddd0d1884d48d556f5f007d3d846a73d`.
The complete fresh embedded package tree matches its tracked source.
Canonical, mirrored and materialized expanders match. [Raw release
receipts](evidence/cdc/release-487ebdbb/).

This validates local integration and keeps the separate DD-37 browser
bundle budget open. The local release remains the base for the bounded
maintenance inquiry.
