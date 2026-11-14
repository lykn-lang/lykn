# Root preliminary source review — 17791f24

2026-11-14. Root owns source/build after CC returned clean17791f24696ecbd1bc1cc4cabcc65c1a49d555c1,
tree792fd4244180068e3319c49785cf8df1ff5ae02b. These findings are root
observations for independent Sol review, not a substitute for its disposition.
All8PN/BS-06 remain open; no independent aggregate gate has run on this candidate.

1. Actual emitted name collection is still incomplete. identifier.js
   physicalIdentifierKeys normalizes the complete text but extracts runs from
   the RAW decoded text. It does not first obtain the actual compiler member
   text through toJsIdentifierParts as required by plan B. Example leading
   hyphens disappear before token extraction, losing the emitted root.
   Actual adjacent dissoc-physical-review.lykn uses a foreign/global property
   named ___gensym0 as data, then Source ---gensym0.child. The actual public
   pipeline emits const {drop: ___gensym0,...}=___gensym0.child and throws TDZ.
   Reused original public-compile.lykn client at task177 with release82 native
   bootstrap, same explicit read/cached-only/frozen grants as root baseline;
   compile exit0/empty stderr, direct deno run --no-config --no-prompt --no-npm
   --cached-only target/lykn/arc05-s06-root/dissoc-review.mjs exit1/empty stdout.
   Generated text and exact stderr are adjacent. Correct runtime is
   {"keep":7} newline, exit0/empty stderr. This is ordinary static generated-name
   protection already in scope, not Source binding renaming or eval hygiene.
2. decodeIdentifierEscapes uses repeated suffix-wide text.indexOf('}',...) for
   every braced escape. Many unterminated \\u{ prefixes cause repeated scans;
   this contradicts the explicit incremental bounded-progress design. Static
   finding; no adversarial timing/performance experiment was executed.
3. next() remembers only lastRejectedCandidate. A callback cycling occupied A,
   B,A,B never repeats ADJACENTLY and can loop forever. Plan requires detecting
   repeated rejected raw candidates, without an arbitrary retry cap. Static
   finding; no unsupervised infinite callback was executed. A bounded callback
   safety tripwire in the product test can distinguish allocator rejection from
   later callback exhaustion without a hang.

CC metadata also needs correction: closing-report's514 Rust passes contradicts
its actual full log, which includes native lykn-lang1217 alone (line1913), plus
CLI194/umbrella99/etc. Read all result lines for actual total. Its statement
'No ... module export ... changes' must mean no PACKAGE ENTRYPOINT changes:
identifier.js adds five named module exports and producer options change.
These belong in Arc06 LI-04 as required; do not erase them through wording.

Separate reviewer should inspect full source/test delta, confirm/consolidate
these and any other material findings before a single bounded correction.
Do not run full aggregate verification on held source. No product edit is made
by root; existing CC attestation and every failed attempt stay retained.
