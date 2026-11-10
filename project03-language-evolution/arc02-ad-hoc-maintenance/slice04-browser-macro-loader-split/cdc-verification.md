# S04 independent acceptance

Accepted task source `cc806c844c5540d3b536d5a7397f0ad5b1c1387b`,
tree `4717a5edd6eb0d996f2111a4f9982bf22159ef01`. Actual Luna 6 High
CC implemented the split and returned source ownership. Sol 6.1 High
CDC independently reproduced the gates and real products.

| Row | Independent disposition |
| --- | --- |
| BM-01 | Actual CLI staged public browser module, compiler and export manifests byte-equal to baseline. Cached frozen Deno emitted `["21 + 21;\\n",3,true,19,23]` with real local macro and controlled async load. Exact scoped npm alias resolved via the original expander façade URL. |
| BM-02 | Actual CLI min and dev Chromium both pass 15 diagnostic/code cases. Dev DOM exactly matches baseline. The min diff changes only the four generated scheme-detail spellings from `mo.resolve` to the previous dev spelling `import_meta.resolve`. Positive DOM matches byte-for-byte, including inline macro, strict/lax checks, and ordered `["first","fetch",19,"last"]`. |
| BM-03 | Nineteen focused public macro tests pass. Staged same-mtime module rewrite kept its cached value until reset. Native cold/warm and old emitted code agree and runtime prints 42. All 18 original legacy cache file hashes are unchanged, and both the complete new native cache and a fresh normal Make cache equal the tracked mirror. |
| BM-04 | The native esbuild 0.27.4 diagnostic metafile output equals the entire actual CLI minified artifact. Both browser expansion modules appear, and the Deno loader, Deno façade and node:path shim are absent. The official fixed meter passes at 42,221 gzip bytes under 81,920, with the historical baseline 27,906. |
| BM-05 | Normal Make, standalone citations and the actual fixed-size gate return 0 on the accepted freeze. The unfiltered gate includes 1,167 Rust library tests, all native suites, 1,494 JS/Lykn tests and 67 steps, and 482 docs. Standalone citations cover 64 documents and 601 historical entries. |

The actual CLI minified artifact is 155,089 bytes and the actual
dev artifact is 324,326. The baseline measured 163,152 and 340,187.
Pinned CompressionStream gives 42,221 and 60,142 gzip versus
44,844 and 63,706. The measured minified gzip saving is 2,623.
Raw meter output varies slightly by build path. The committed
meter still selects the original Deno route and shim for the
historical source. CLI selection is scoped to the actual browser
compiler import. Real IIFE output was validated on macOS arm64.
[Independent receipts](artifacts/evidence/cdc/).

CC's initial cold-cache native run and unisolated normal Make
failed. The scoped cache and scratch setup corrected those launches.
The draft JS meter verification logic was outside the authorized
evidence language and scope. Its exact patch and raw output remain
as process evidence, and were excluded from acceptance. CC removed
it before the first commit. Independent committed delta whitespace
check exposed a blank EOF in each loader mirror at `098d7c21`.
The independent orchestration also launched its original Make,
cites and budget after that preflight exit2. Those three results
were green, the dependent source archive did not run, and the
actual original receipts remain separate. The exact two-line
refinement was reviewed and every required final gate replayed.
[CC evidence](artifacts/evidence/cc/) and
[first freeze](artifacts/evidence/first-freeze/).

The [actual host invocation IIFE fixture](artifacts/evidence/baseline-host/)
freezes S04 outputs for S05, including the full live and fallback
programs, the live trace, protected-write rejection and eval's
existing ESM syntax error. AM-06 is done. AM-05 and AM-07 retain
their composition and release dispositions.
