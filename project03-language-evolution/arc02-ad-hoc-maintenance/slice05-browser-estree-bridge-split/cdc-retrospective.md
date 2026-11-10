# S05 CDC retrospective

Comparing the entire actual minified artifact made the independent
metafile usable as evidence about the shipped graph. Exact S04
Chromium and staged-package receipts also gave stable product oracles
across both refactors.

The first candidate changed the native cache suffix but left the
M4 recovery helper pointing to the S04 directory. CDC found this
after the first freeze. The one-line test correction preserved the
old sibling and restored M4's intended recovery check. Review both
producer and test paths when changing a versioned cache name.

Both source commits carry noncontiguous coauthor trailers. CC also
wrote its command manifests after launch, despite the evidence
assignment. The actual commits, raw outputs, setup retries and
postflight records remain intact. Independent launches supplied
separate prospective evidence. Future handoffs should provide one
exact message file and inspect the raw Git body after committing.
