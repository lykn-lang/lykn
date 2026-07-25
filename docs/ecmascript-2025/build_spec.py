#!/usr/bin/env python3
"""Split the flat ECMAScript-2025 markdown into per-clause chapter files with
secnum-derived heading depth, plus an INDEX and a function-heads audit extract.

Input : spec-REC.md  (pandoc gfm output; secnum kept, list-markers stripped)
Output: <outdir>/{INDEX.md, function-heads.md, 00-front-matter.md,
        NN-slug.md, annex-X-slug.md}
"""
import re
import sys
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

lines = SRC.read_text(encoding="utf-8").split("\n")

HEADING = re.compile(r"^(#{1,6})\s+(.*)$")
# secnum prefix: 1 | 7.2.12 | A.1 | B.2.1  (numeric, or lettered annex sub-section)
SECNUM = re.compile(r"^((?:[0-9]+|[A-Z])(?:\.[0-9]+)*)\s+(.*)$")
# annex root heading: "Annex A (informative) Grammar Summary"
ANNEX = re.compile(r"^Annex\s+([A-Z])\s+\((informative|normative)\)\s+(.*)$")
FENCE = re.compile(r"^(```|~~~)")
BACKMATTER = {"Bibliography", "Colophon", "Copyright & Software License"}

def slug(text):
    # strip inline markdown/code/links for a clean filename
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)   # links -> text
    t = t.replace("`", "").replace("[[", "").replace("]]", "")
    t = re.sub(r"[^\w\s-]", "", t).strip().lower()
    t = re.sub(r"[\s_-]+", "-", t)
    return t or "section"

# ---- Pass 1: re-level headings (fence-aware), collect heading records ----
out_lines = []
records = []            # (level, secnum_or_None, title, out_index, kind)
cur_secnum_depth = 0    # depth of most recent numbered heading (0 = front matter)
in_fence = False
seen_backmatter = False

for raw in lines:
    if FENCE.match(raw):
        in_fence = not in_fence
        out_lines.append(raw)
        continue
    m = HEADING.match(raw) if not in_fence else None
    if not m:
        out_lines.append(raw)
        continue
    body = m.group(2)
    am = ANNEX.match(body)
    sm = SECNUM.match(body)
    if am:                                  # annex root -> top-level file
        secnum, title, kind, level = am.group(1), body, "annex", 1
        cur_secnum_depth = 1
    elif sm:                                # numbered (or lettered sub-) clause
        secnum, title = sm.group(1), sm.group(2)
        depth = secnum.count(".") + 1
        cur_secnum_depth = depth
        level = min(6, depth)
        kind = "clause" if (secnum.isdigit() and depth == 1) else None
    elif body in BACKMATTER and not seen_backmatter:
        secnum, title, kind, level = None, body, "backmatter", 1
        seen_backmatter = True
    else:                                   # unnumbered subsection / front matter
        secnum, title = None, body
        level = 1 if cur_secnum_depth == 0 else min(6, cur_secnum_depth + 1)
        kind = None
    new = "#" * level + " " + body
    records.append((level, secnum, title, len(out_lines), kind))
    out_lines.append(new)

# ---- Pass 2: split into files at each top-level (clause / annex / back-matter) ----
boundaries = [(idx, sec, title, kind)
              for (lvl, sec, title, idx, kind) in records
              if kind in ("clause", "annex", "backmatter")]

files = []   # (filename, start_idx, end_idx, secnum, title)
first = boundaries[0][0] if boundaries else len(out_lines)
if first > 0:
    files.append(("00-front-matter.md", 0, first, None, "Front Matter"))
for i, (idx, sec, title, kind) in enumerate(boundaries):
    end = boundaries[i + 1][0] if i + 1 < len(boundaries) else len(out_lines)
    if kind == "clause":
        fname = f"{int(sec):02d}-{slug(title)}.md"
    elif kind == "annex":
        clean = ANNEX.match(title).group(3)      # title minus "Annex X (kind) "
        fname = f"annex-{sec.lower()}-{slug(clean)}.md"
    else:                                        # backmatter
        fname = "zz-back-matter.md"
    files.append((fname, idx, end, sec, title))

# map each output-line index -> filename (for INDEX links)
idx_to_file = {}
for fname, s, e, sec, title in files:
    for j in range(s, e):
        idx_to_file[j] = fname

for fname, s, e, sec, title in files:
    body = "\n".join(out_lines[s:e]).strip() + "\n"
    (OUT / fname).write_text(body, encoding="utf-8")

# ---- INDEX.md : nested TOC (numbered headings only), linked to files ----
idx_lines = ["# ECMAScript 2025 — Index\n",
             f"Generated from `{SRC.name}`. {len(files)} files, "
             f"{len(records)} headings.\n",
             "One file per top-level clause. See `function-heads.md` for the "
             "abstract-operation / built-in signature audit table.\n"]
for (lvl, sec, title, oidx, kind) in records:
    if sec is None:
        continue
    depth = 1 if kind == "annex" else sec.count(".") + 1
    if depth > 3:            # keep the index scannable: clauses + 2 levels
        continue
    indent = "  " * (depth - 1)
    fname = idx_to_file.get(oidx, "")
    plain = re.sub(r"`", "", title)
    idx_lines.append(f"{indent}- `{sec}` [{plain}]({fname})")
(OUT / "INDEX.md").write_text("\n".join(idx_lines) + "\n", encoding="utf-8")

# ---- function-heads.md : every heading that is a callable signature ----
SIG_HEAD = re.compile(r"^(.*?\S)\s*\((.*)\)\s*$")   # NAME ( params )
fh = ["# ECMAScript 2025 — Function / Operation Heads\n",
      "Every clause heading shaped like `Name ( params )`, with the signature "
      "sentence that follows it. For the function-head consistency audit.\n"]
n_heads = 0
for k, (lvl, sec, title, oidx, kind) in enumerate(records):
    if sec is None or kind == "annex":
        continue
    plain = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", title).replace("`", "")
    sh = SIG_HEAD.match(plain)
    if not sh:
        continue
    name = sh.group(1).strip()
    params = sh.group(2).strip()
    fname = idx_to_file.get(oidx, "")
    # grab the first non-empty paragraph after the heading as the signature line
    sig = ""
    for look in range(oidx + 1, min(oidx + 6, len(out_lines))):
        t = out_lines[look].strip()
        if t:
            sig = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t).replace("`", "")
            break
    n_heads += 1
    fh.append(f"## `{sec}` {name} ( {params} )")
    fh.append(f"*{fname}*")
    if sig:
        fh.append(f"> {sig}")
    fh.append("")
(OUT / "function-heads.md").write_text("\n".join(fh) + "\n", encoding="utf-8")

print(f"files written : {len(files)}")
print(f"headings      : {len(records)}")
print(f"function heads : {n_heads}")
print(f"front matter  : lines 0..{first}")
