# Partial static retrieval; inventory remains owed

The pre-upgrade Lykn transport-list source enumerated 188 files from the exact
published manifests for std/json 1.1.0, std/jsonc 1.0.2, std/yaml 1.2.0,
std/streams 1.1.2 and eemeli/yaml 2.9.1. The URL/path list, five metadata files
and downloaded source bytes are retained individually inside the raw packet.
Transport finished before the launcher blocker. No package was evaluated.

The captured moduleGraph2 data distinguishes importType from runtime imports.
The operator-suggested eval route subsequently ran the native Lykn audit: all
188 sizes and SHA-256 values match metadata, 376 checks. This is integrity against
the registry's metadata, not independent upstream authenticity. A full transitive
graph walk did not run. dependency-graph.json is explicitly captured published
graph metadata, not a resolved runtime graph.
Published tests/examples, absent upstream development inputs, licenses, source
lineage and toolchain edges still need the complete R-02 disposition. Captured
Cargo.lock, Lykn project/deno lock, CI and CLI source retain toolchain context;
they are not a completed toolchain dependency audit.

Earlier CDC evidence for the exact std/yaml runtime and JSON/streams graphs
remains valid for its own conditions. The published std/yaml js-yaml ancestry
and eemeli runtime Node imports remain explicit inherited findings. This packet
independently verifies the captured published bytes but does not reverify runtime
behavior or adopt those packages. The generated merged lock/config is a candidate,
not a runtime-validated freeze. Development ranges and a compatible document
candidate remain unresolved.
