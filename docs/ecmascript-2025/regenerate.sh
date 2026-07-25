#!/usr/bin/env bash
# Regenerate the split ECMAScript Markdown corpus from the source HTML, in place
# (output goes to this script's own directory). Self-contained per edition:
# to build a future edition, copy this script + build_spec.py into a new
# docs/ecmascript-YYYY/ dir, drop the edition's single-page HTML alongside it,
# and run. See README.md "Regenerating for a future edition".
#
# Requires: pandoc (>=3), perl, python3.
#
# Usage:  ./regenerate.sh [path/to/spec.html]
#   With no argument, auto-detects a sibling *Language-Specification*.html.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- locate the source HTML -------------------------------------------------
if [[ $# -ge 1 ]]; then
  SRC="$1"
else
  shopt -s nullglob
  CANDIDATES=("$HERE"/../*Language-Specification*.html "$HERE"/*Language-Specification*.html)
  shopt -u nullglob
  if [[ ${#CANDIDATES[@]} -eq 0 ]]; then
    echo "error: no source HTML given and none found next to $HERE" >&2
    echo "       pass it explicitly:  ./regenerate.sh path/to/spec.html" >&2
    exit 2
  elif [[ ${#CANDIDATES[@]} -gt 1 ]]; then
    echo "error: multiple candidate HTML files found; pass one explicitly:" >&2
    printf '       %s\n' "${CANDIDATES[@]}" >&2
    exit 2
  fi
  SRC="${CANDIDATES[0]}"
fi
[[ -f "$SRC" ]] || { echo "error: source not found: $SRC" >&2; exit 2; }
echo "source: $SRC"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# 1. Strip the spec's cosmetic rendering spans (ecmarkup convention). Proven
#    surgical on ES2025: touches only <span>, removing list-marker + item-toggle
#    spans, nothing else. secnum spans are KEPT — they carry the section numbers
#    the leveling and cross-references depend on.
perl -0777 -pe '
  s{<span\b[^>]*\bclass="list-marker"[^>]*>.*?</span>}{}gs;
  s{<span\b[^>]*\bclass="item-toggle[^"]*"[^>]*>.*?</span>}{}gs;
' "$SRC" > "$WORK/pre.html"

# 2. HTML -> GitHub-Flavored Markdown.
#    gfm-raw_html : drop unmappable raw HTML instead of embedding it
#    --wrap=none  : one line per paragraph (diffable, greppable)
#    atx headings : '# ' style, required by the leveling step
pandoc "$WORK/pre.html" -f html -t gfm-raw_html \
  --wrap=none --markdown-headings=atx --strip-comments \
  -o "$WORK/flat.md"

# 3. Derive heading depth from section numbers, split one file per top-level
#    clause/annex, emit INDEX.md + function-heads.md.
python3 "$HERE/build_spec.py" "$WORK/flat.md" "$HERE"

# 4. Content-integrity self-check: reassembling the split chapter files must
#    reproduce the flat markdown byte-for-byte, heading levels aside. This is
#    the guard that catches ecmarkup drift on a new edition — if the split
#    dropped, duplicated, or reordered anything, this fails loudly.
python3 - "$WORK/flat.md" "$HERE" <<'PY'
import sys, re
from pathlib import Path
flat, out = Path(sys.argv[1]), Path(sys.argv[2])
def norm(text):
    return [re.sub(r'^#+ ', '', ln) for ln in text.split("\n") if ln.strip()]
src = norm(flat.read_text())
chapters = sorted(p for p in out.glob("*.md")
                  if p.name not in ("INDEX.md", "function-heads.md", "README.md"))
reasm = []
for p in chapters:
    reasm += norm(p.read_text())
if src == reasm:
    print(f"self-check: OK — {len(chapters)} chapter files reproduce the source "
          f"content exactly ({len(src)} lines).")
else:
    print("self-check: FAILED — split output does not reconstruct the source.",
          file=sys.stderr)
    print(f"  source content lines={len(src)} reassembled={len(reasm)}", file=sys.stderr)
    for i, (a, b) in enumerate(zip(src, reasm)):
        if a != b:
            print(f"  first divergence at content line {i}:", file=sys.stderr)
            print(f"    src: {a!r}", file=sys.stderr)
            print(f"    got: {b!r}", file=sys.stderr)
            break
    sys.exit(1)
PY

echo "Regenerated corpus in $HERE"
