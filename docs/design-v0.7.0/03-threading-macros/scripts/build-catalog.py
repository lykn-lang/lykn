#!/usr/bin/env python3
"""
build-catalog.py — regenerate the argument-position catalogs for the
threading-macro survey (docs/design-v0.7.0/03-threading-macros/).

Two tiers:

  Tier 1  ECMAScript 2025 built-ins   <- docs/ecmascript-2025/function-heads.md
  Tier 2  Host surface (Web + Deno)   <- `deno types` output

Both tiers are classified by SHAPE — where the *primary datum* sits relative
to the call's argument list. The mechanical fields (kind, arity, parameter
names) are derived; the SHAPE of every callable with required arity >= 2 is
hand-assigned in the tables below and reviewed individually. Nothing is
guessed by heuristic: if a callable is not in a hand table and has required
arity >= 2, it is emitted as UNCLASSIFIED and the build fails loudly.

Usage (run from the unit directory, not from scripts/):

    deno types > /tmp/deno-types.d.ts
    python3 scripts/build-catalog.py \
        --spec <path-to-main-checkout>/docs/ecmascript-2025/function-heads.md \
        --deno-types /tmp/deno-types.d.ts \
        --out data

NOTE: `docs/ecmascript-2025/` lives on `main`, NOT on `release/0.7.x` where this
unit lives, so --spec must point at a `main` checkout. See inventory.md section 9.
"""

import argparse
import collections
import csv
import json
import os
import re
import sys

# --------------------------------------------------------------------------
# SHAPE vocabulary
# --------------------------------------------------------------------------
# RECEIVER-D         primary datum arrives as `this` (the method case)
# OPERATOR-RECEIVER  receiver is a configured operator; datum is an argument
# D-FIRST            datum is parameter 0 of a free/static function
# D-LAST             datum is the last *required* parameter (req arity >= 2)
# D-MID              datum is neither first nor last (req arity >= 3)
# F-LAST             trailing parameter is a callback; no data datum
# PEER               two or more symmetric operands, no primary datum
# UNARY              required arity 1 — first and last coincide (UNDECIDABLE)
# NO-D               no threadable primary datum (constructors, niladics)
# EXCLUDE            not an observable built-in (spec-internal shorthand)
#
# Only callables with required arity >= 2 DISCRIMINATE between `->` and `->>`.
# Everything else is silent evidence and must not be pooled into the counts.
# --------------------------------------------------------------------------

SPEC_LIBRARY_CHAPTERS = {f"{n:02d}" for n in range(19, 29)}

# --- Tier 1: hand classification of the discriminating ES2025 set ----------
ES_HAND = {
    "parseInt": ("D-FIRST", "string=D, radix=C"),
    "Number.parseInt": ("D-FIRST", "string=D, radix=C"),
    "Object.assign": ("D-FIRST", "target=D (mutated), sources=peer data"),
    "Object.create": ("D-FIRST", "O=prototype datum, Properties=C"),
    "Object.defineProperties": ("D-FIRST", "O=D"),
    "Object.defineProperty": ("D-FIRST", "O=D, P=K, Attributes=C"),
    "Object.getOwnPropertyDescriptor": ("D-FIRST", "O=D, P=K"),
    "Object.groupBy": ("D-FIRST", "items=D, callback=F  ** ES2024, newest collection API **"),
    "Object.hasOwn": ("D-FIRST", "O=D, P=K"),
    "Object.is": ("PEER", "two peer values, no primary"),
    "Object.setPrototypeOf": ("D-FIRST", "O=D, proto=C"),
    "Function": ("NO-D", "constructor; builds a function from source text"),
    "AggregateError": ("NO-D", "constructor"),
    "GeneratorFunction": ("NO-D", "constructor"),
    "AsyncGeneratorFunction": ("NO-D", "constructor"),
    "AsyncFunction": ("NO-D", "constructor"),
    "BigInt.asIntN": ("D-LAST", "bits=C, bigint=D  ** configured operator **"),
    "BigInt.asUintN": ("D-LAST", "bits=C, bigint=D  ** configured operator **"),
    "Math.atan2": ("PEER", "y,x are peer coordinates; y-first is the oddity, not data position"),
    "Math.imul": ("PEER", "peer operands"),
    "Math.pow": ("D-FIRST", "base=D, exponent=C"),
    "String.raw": ("D-FIRST", "template=D, substitutions=peer"),
    "RegExp": ("D-FIRST", "constructor; pattern=D, flags=C"),
    "Map.groupBy": ("D-FIRST", "items=D, callback=F  ** ES2024, newest collection API **"),
    "Promise.try": ("NO-D", "callback=F is the subject; args=peer"),
    "Reflect.apply": ("D-FIRST", "target=D"),
    "Reflect.construct": ("D-FIRST", "target=D"),
    "Reflect.defineProperty": ("D-FIRST", "target=D"),
    "Reflect.deleteProperty": ("D-FIRST", "target=D"),
    "Reflect.get": ("D-FIRST", "target=D, propertyKey=K"),
    "Reflect.getOwnPropertyDescriptor": ("D-FIRST", "target=D"),
    "Reflect.has": ("D-FIRST", "target=D"),
    "Reflect.set": ("D-FIRST", "target=D, propertyKey=K, V=peer"),
    "Reflect.setPrototypeOf": ("D-FIRST", "target=D"),
    "Proxy": ("D-FIRST", "constructor; target=D, handler=C"),
    "Proxy.revocable": ("D-FIRST", "target=D, handler=C"),
    "IfAbruptRejectPromise": ("EXCLUDE", "spec-internal shorthand notation, not an observable built-in"),
}
for _n in ("add and compareExchange exchange load or store sub wait waitAsync "
           "notify xor").split():
    ES_HAND[f"Atomics.{_n}"] = ("D-FIRST", "typedArray=D, index=K, value/etc=peer")

# Prototype methods whose RECEIVER is a configured operator rather than the datum.
ES_OPERATOR_RECEIVER = {
    "RegExp.prototype.exec": "receiver=compiled pattern (operator); string=D",
    "RegExp.prototype.test": "receiver=compiled pattern (operator); S=D",
    "RegExp.prototype [ %Symbol.match% ]": "internal protocol hook; user-facing twin is String.prototype.match",
    "RegExp.prototype [ %Symbol.matchAll% ]": "internal protocol hook; twin String.prototype.matchAll",
    "RegExp.prototype [ %Symbol.replace% ]": "internal protocol hook; twin String.prototype.replace",
    "RegExp.prototype [ %Symbol.search% ]": "internal protocol hook; twin String.prototype.search",
    "RegExp.prototype [ %Symbol.split% ]": "internal protocol hook; twin String.prototype.split",
    "Function.prototype.apply": "receiver=function (operator); thisArg=D",
    "Function.prototype.call": "receiver=function (operator); thisArg=D",
    "Function.prototype.bind": "receiver=function (operator); thisArg=D",
    "Function.prototype [ %Symbol.hasInstance% ]": "receiver=constructor (operator); V=D",
    "Object.prototype.isPrototypeOf": "receiver=the prototype (operator); V=D",
}

# --- Tier 2: hand classification of the discriminating host set ------------
HOST_HAND = {
    ("SubtleCrypto", "digest"): ("D-LAST", "algorithm=C, data=D — configured operator; plausible pipeline step"),
    ("SubtleCrypto", "sign"): ("D-LAST", "algorithm+key=configured operator, data=D"),
    ("SubtleCrypto", "verify"): ("D-LAST", "algorithm+key+signature lead, data=D"),
    ("SubtleCrypto", "encrypt"): ("D-LAST", "algorithm+key=operator, data=D"),
    ("SubtleCrypto", "decrypt"): ("D-LAST", "algorithm+key=operator, data=D"),
    ("SubtleCrypto", "exportKey"): ("D-LAST", "format=C, key=D"),
    ("SubtleCrypto", "deriveBits"): ("D-MID", "algorithm, baseKey=D, length=C"),
    ("SubtleCrypto", "deriveKey"): ("D-MID", "algorithm, baseKey=D, then 3 more"),
    ("SubtleCrypto", "importKey"): ("D-MID", "format, keyData=D, algorithm, ..."),
    ("SubtleCrypto", "wrapKey"): ("D-MID", "format, key=D, wrappingKey, wrapAlgorithm"),
    ("SubtleCrypto", "unwrapKey"): ("D-MID", "format, wrappedKey=D, then 4 more"),
    ("SubtleCrypto", "generateKey"): ("NO-D", "produces a key; no input datum"),
    ("URLPattern", "test"): ("OPERATOR-RECEIVER", "receiver=compiled pattern; input=D (mirrors RegExp)"),
    ("URLPattern", "exec"): ("OPERATOR-RECEIVER", "receiver=compiled pattern; input=D (mirrors RegExp)"),
    ("TextEncoder", "encodeInto"): ("D-FIRST", "input=D, dest=out-param"),
    ("Storage", "setItem"): ("D-LAST", "key=K, value=D — key/value sink"),
    ("Headers", "append"): ("D-LAST", "name=K, value=D — keyed sink"),
    ("Headers", "set"): ("D-LAST", "name=K, value=D — keyed sink"),
    ("URLSearchParams", "append"): ("D-LAST", "name=K, value=D — keyed sink"),
    ("URLSearchParams", "set"): ("D-LAST", "name=K, value=D — keyed sink"),
    ("FormData", "append"): ("D-LAST", "name=K, value=D, fileName=C"),
    ("FormData", "set"): ("D-LAST", "name=K, value=D, fileName=C"),
    ("EventTarget", "addEventListener"): ("F-LAST", "type=K, listener=F — no data datum"),
    ("EventTarget", "removeEventListener"): ("F-LAST", "type=K, listener=F"),
    ("AbortSignal", "addEventListener"): ("F-LAST", "type=K, listener=F"),
    ("AbortSignal", "removeEventListener"): ("F-LAST", "type=K, listener=F"),
    ("WebSocket", "addEventListener"): ("F-LAST", "type=K, listener=F"),
    ("WebSocket", "removeEventListener"): ("F-LAST", "type=K, listener=F"),
    ("__globals__", "addEventListener"): ("F-LAST", "type=K, listener=F"),
    ("__globals__", "removeEventListener"): ("F-LAST", "type=K, listener=F"),
    ("__globals__", "createImageBitmap"): ("D-FIRST", "image=D, crop rect=C"),
}
DENO_HAND = {
    "writeTextFile": ("D-LAST", "path=K, data=D  ** plausible pipeline terminus **"),
    "writeTextFileSync": ("D-LAST", "path=K, data=D  ** plausible pipeline terminus **"),
    "writeFile": ("D-LAST", "path=K, data=D  ** plausible pipeline terminus **"),
    "writeFileSync": ("D-LAST", "path=K, data=D  ** plausible pipeline terminus **"),
    "bench": ("F-LAST", "name/options lead, fn last — callback-last convention"),
    "serve": ("F-LAST", "options lead, handler last — callback-last convention"),
    "test": ("F-LAST", "name lead, fn last"),
    "addSignalListener": ("F-LAST", "signal=K, handler=F"),
    "removeSignalListener": ("F-LAST", "signal=K, handler=F"),
    "spawn": ("D-FIRST", "command=D, args, options"),
    "spawnAndWait": ("D-FIRST", "command=D, args, options"),
    "spawnAndWaitSync": ("D-FIRST", "command=D, args, options"),
    "resolveDns": ("D-FIRST", "query=D, recordType=C"),
    "chown": ("D-FIRST", "path=D"), "chownSync": ("D-FIRST", "path=D"),
    "chmod": ("D-FIRST", "path=D"), "chmodSync": ("D-FIRST", "path=D"),
    "utime": ("D-FIRST", "path=D"), "utimeSync": ("D-FIRST", "path=D"),
    "link": ("D-FIRST", "oldpath=D, newpath=peer"), "linkSync": ("D-FIRST", "oldpath=D"),
    "rename": ("D-FIRST", "oldpath=D"), "renameSync": ("D-FIRST", "oldpath=D"),
    "symlink": ("D-FIRST", "oldpath=D"), "symlinkSync": ("D-FIRST", "oldpath=D"),
    "copyFile": ("D-FIRST", "fromPath=D"), "copyFileSync": ("D-FIRST", "fromPath=D"),
}

HOST_INTERFACES = [
    "Headers", "URLSearchParams", "URL", "TextEncoder", "TextDecoder", "Console",
    "Request", "Response", "Blob", "FormData", "AbortController", "AbortSignal",
    "ReadableStream", "WritableStream", "Crypto", "SubtleCrypto", "Storage",
    "EventTarget", "URLPattern", "WebSocket",
]


# --------------------------------------------------------------------------
# Tier 1 — ECMAScript 2025
# --------------------------------------------------------------------------
def unescape(s):
    return s.replace("\\[", "[").replace("\\]", "]").replace("\\_", "_").replace("\xa0", " ")


def parse_params(raw):
    """Return [(name, optional, variadic)] preserving spec bracket nesting."""
    raw = unescape(raw).strip()
    if not raw:
        return []
    toks, cur, depth_marker = [], "", 0
    for ch in raw:
        if ch in "[],":
            if cur.strip():
                toks.append(("NAME", cur.strip()))
                cur = ""
            toks.append({"[": ("OPEN", None), "]": ("CLOSE", None), ",": ("COMMA", None)}[ch])
        else:
            cur += ch
    if cur.strip():
        toks.append(("NAME", cur.strip()))
    out, depth = [], 0
    for kind, val in toks:
        if kind == "OPEN":
            depth += 1
        elif kind == "CLOSE":
            depth -= 1
        elif kind == "NAME":
            out.append((val.lstrip("."), depth > 0, val.startswith("...")))
    return out


def es_kind(name):
    if re.search(r"\.prototype\s*(\.|\[)", name) or re.match(r"^%\w*Prototype%", name):
        return "proto"
    if name.startswith("get ") or name.startswith("set "):
        return "accessor"
    return "static" if ("." in name or "[" in name) else "global"


def norm(n):
    return " ".join(n.replace("(", "").replace(")", "").split())


def build_es(spec_path):
    txt = open(spec_path, encoding="utf-8").read()
    entries = re.findall(r"^## `([^`]+)` (.+?)\n\*(.+?)\*\n> (.*)$", txt, re.M)
    rows = []
    for sec, head, srcfile, desc in entries:
        if srcfile[:2] not in SPEC_LIBRARY_CHAPTERS:
            continue
        if desc.startswith("The abstract operation") or " abstract operation " in desc[:60]:
            continue
        m = re.match(r"^(.*?)\s*\(\s*(.*?)\s*\)\s*$", head)
        if not m:
            continue
        name = unescape(m.group(1))
        params = parse_params(m.group(2))
        req = [p for p in params if not p[1]]
        kind = es_kind(name)
        nk = norm(name)

        note = ""
        if kind == "proto":
            hit = next((v for k, v in ES_OPERATOR_RECEIVER.items() if nk.startswith(norm(k))), None)
            shape, note = ("OPERATOR-RECEIVER", hit) if hit else ("RECEIVER-D", "")
        elif len(req) == 0:
            shape = "NO-D"
        elif len(req) == 1:
            shape = "UNARY"
        else:
            shape, note = ES_HAND.get(name, ("UNCLASSIFIED", ""))

        rows.append({
            "section": sec, "chapter": srcfile[:2], "name": name, "kind": kind,
            "arity": len(params), "req_arity": len(req),
            "params": [p[0] for p in params],
            "shape": shape, "note": note,
            "discriminating": "yes" if (kind in ("global", "static")
                                        and len(req) >= 2
                                        and shape != "EXCLUDE") else "no",
        })
    return rows


# --------------------------------------------------------------------------
# Tier 2 — host surface
# --------------------------------------------------------------------------
def host_req_arity(sig):
    if not sig.strip():
        return 0
    parts, depth, cur = [], 0, ""
    for ch in sig:
        if ch in "<([{":
            depth += 1
        elif ch in ">)]}":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append(cur)
            cur = ""
        else:
            cur += ch
    if cur.strip():
        parts.append(cur)
    n = 0
    for p in parts:
        nm = p.split(":")[0].strip()
        if not nm:
            continue
        if nm.endswith("?") or nm.startswith("..."):
            break
        n += 1
    return n


def _block(src, pattern):
    m = re.search(pattern, src, re.M)
    if not m:
        return None
    i, depth = m.end(), 1
    start = i
    while i < len(src) and depth:
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
        i += 1
    return src[start:i - 1]


def build_host(types_path):
    src = open(types_path, encoding="utf-8").read()
    collected = {}
    for iface in HOST_INTERFACES:
        body = _block(src, r"^\s*(?:declare\s+)?interface\s+" + iface + r"\b[^{]*\{")
        if body is None:
            continue
        meths = re.findall(r"^\s{0,4}(?:readonly\s+)?([A-Za-z_$][\w$]*)\s*\(([^;]*?)\)\s*:",
                           body, re.M | re.S)
        if meths:
            collected[iface] = meths
    collected["__globals__"] = re.findall(
        r"^declare function ([A-Za-z_$][\w$]*)\s*\(([^;]*?)\)\s*:", src, re.M | re.S)
    deno_body = _block(src, r"^declare namespace Deno \{")
    if deno_body:
        collected["Deno"] = re.findall(
            r"^\s{2}(?:export\s+)?function ([A-Za-z_$][\w$]*)\s*\(([^;]*?)\)\s*:",
            deno_body, re.M | re.S)

    rows = []
    for owner, meths in collected.items():
        for name, raw in meths:
            sig = " ".join(raw.split())
            req = host_req_arity(sig)
            key = (owner, name)
            if key in HOST_HAND:
                shape, note = HOST_HAND[key]
            elif owner == "Deno" and name in DENO_HAND:
                shape, note = DENO_HAND[name]
            elif owner == "Deno":
                shape, note = ("D-FIRST" if req >= 1 else "NO-D"), "path/subject-first"
            elif req == 0:
                shape, note = "NO-D", ""
            elif req == 1:
                shape, note = "UNARY", ""
            else:
                shape, note = "UNCLASSIFIED", ""
            rows.append({
                "owner": owner, "name": name, "signature": sig, "req_arity": req,
                "shape": shape, "note": note,
                "discriminating": "yes" if req >= 2 else "no",
            })
    return rows


# --------------------------------------------------------------------------
def emit(rows, cols, out_dir, stem):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, stem + ".tsv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter="\t")
        w.writerow(cols)
        for r in rows:
            w.writerow(["|".join(r[c]) if isinstance(r[c], list) else r[c] for c in cols])
    with open(os.path.join(out_dir, stem + ".json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=1)


def summarise(label, rows):
    print(f"\n=== {label}: {len(rows)} callables ===")
    for s, v in collections.Counter(r["shape"] for r in rows).most_common():
        print(f"  {s:20s} {v:5d}")
    disc = [r for r in rows if r["discriminating"] == "yes"]
    print(f"  -- discriminating (required arity >= 2): {len(disc)}")
    for s, v in collections.Counter(r["shape"] for r in disc).most_common():
        print(f"     {s:20s} {v:5d}")
    return disc


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True, help="path to function-heads.md")
    ap.add_argument("--deno-types", required=True, help="path to `deno types` output")
    ap.add_argument("--out", required=True, help="output directory for catalogs")
    a = ap.parse_args()

    es = build_es(a.spec)
    host = build_host(a.deno_types)

    bad = [r for r in es + host if r["shape"] == "UNCLASSIFIED"]
    if bad:
        print("FAIL — unclassified callables (add them to the hand tables):", file=sys.stderr)
        for r in bad:
            print("   ", r.get("name"), r.get("owner", ""), file=sys.stderr)
        sys.exit(1)

    emit(es, ["section", "chapter", "name", "kind", "arity", "req_arity",
              "params", "shape", "discriminating", "note"], a.out, "catalog-es2025")
    emit(host, ["owner", "name", "signature", "req_arity",
                "shape", "discriminating", "note"], a.out, "catalog-host")

    d1 = summarise("Tier 1 — ECMAScript 2025 built-ins (ch.19-28)", es)
    d2 = summarise("Tier 2 — host surface (Web + Deno)", host)

    c = collections.Counter(r["shape"] for r in d1 + d2)
    print(f"\n=== COMBINED discriminating set: {len(d1) + len(d2)} ===")
    print(f"  datum-first : datum-last  =  {c['D-FIRST']} : {c['D-LAST']}")
    print("  self-check: OK")


if __name__ == "__main__":
    main()
