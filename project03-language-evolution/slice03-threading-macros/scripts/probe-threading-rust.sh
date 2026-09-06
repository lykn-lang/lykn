#!/usr/bin/env bash
# probe-threading-rust.sh — the same probes as probe-threading.js, but through
# the RUST compiler, so the JS/Rust parity claim is reproducible rather than
# asserted from reading two sources that look alike.
#
# Why this exists: the first pass of `03-threading-macros` verified threading
# behaviour through `packages/lang` only and reported implementation status as
# settled. lykn has TWO compilers (CLAUDE.md, "Shared pattern": the readers are
# parallel implementations). A one-compiler check cannot settle a question about
# the language. See inventory.md section 6.5.
#
# Usage, from the repo root:
#     cargo build --release -p lykn-cli
#     docs/design-v0.7.0/03-threading-macros/scripts/probe-threading-rust.sh
#
# Optional: LYKN=/path/to/lykn to point at an existing binary.

set -u
LYKN="${LYKN:-./target/release/lykn}"
if [ ! -x "$LYKN" ]; then
  echo "no lykn binary at $LYKN — run: cargo build --release -p lykn-cli" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
LYKN="$(cd "$(dirname "$LYKN")" && pwd)/$(basename "$LYKN")"

probe() {
  printf '%s\n' "$1" > "$TMP/t.lykn"
  printf '  %s\n      => %s\n' "$1" "$("$LYKN" compile "$TMP/t.lykn" 2>&1 | grep -v '^$' | tr '\n' ' ')"
}

echo "================================================================"
echo " RUST compiler — threading probes"
echo " binary: $LYKN"
echo "================================================================"

echo
echo "-- DD-18's worked ->> example (DD claims thread-FIRST nesting) --"
probe '(->> items (filter even?) (map double) (take 5))'
probe '(-> items (filter even?) (map double) (take 5))'

echo
echo "-- -> and ->> identical for keyword (method) steps --"
probe '(-> s (:to-upper-case) (:slice 0 10))'
probe '(->> s (:to-upper-case) (:slice 0 10))'

echo
echo "-- as-> does not exist; compiles silently to an undefined asTo --"
probe '(as-> x $ (f $ 1) (g 2 $))'

echo
echo "-- the real ->> domain: configured operators and keyed sinks --"
probe '(->> rendered (Deno:write-text-file "out.html"))'
probe '(->> bytes (crypto:subtle:digest "SHA-256"))'
probe '(->> n (BigInt:as-int-n 64))'

echo
echo "-- where -> is right instead --"
probe '(-> xs (Object:group-by f))'
probe '(-> target (Reflect:get :key))'

echo
echo "-- unary: undecidable, both agree --"
probe '(->> 5 inc double)'
probe '(-> 5 inc double)'
