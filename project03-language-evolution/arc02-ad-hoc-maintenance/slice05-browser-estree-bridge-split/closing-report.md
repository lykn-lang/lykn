# S05 close

Luna 6 High CC implemented the split and proposed all four criteria
complete. Sol 6.1 High CDC independently accepts the composed task
source `685bbe1d`. BE-01 through BE-04 and Arc02 AM-07 are done.

The shipped browser excludes the private ESTree bridge while retaining
the shared compiler, kernel materializer and protected-host behavior.
The Deno private request path, staged ESM facade and native embedded
compiler are verified. The actual browser is 41,338 gzip bytes.
S05 saves 883 bytes, and the two splits save 3,506 bytes from the
policy baseline under the fixed 81,920-byte cap.

Local `release/0.6.x` remains `b0c97f4e`. AM-05 retains its
release integration and verification gate.

[Independent verification](cdc-verification.md).
[Retrospective](cdc-retrospective.md).
