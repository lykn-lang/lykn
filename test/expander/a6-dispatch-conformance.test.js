// arc13/slice10 F-4 — the §A6 static conformance check (DD-61 §A6, JS side).
//
// DD-61 §A6 makes the resolution tag unignorable: the form-vs-call dispatch door
// must read a head through `formHead` (which returns null for a lexically bound
// head), never the raw `.value`. JS has no type system to forbid the raw read
// while the tag is a plain property, so this test is the standing backstop — the
// JS twin of the Rust `a6_dispatch_conformance.rs` grep.
//
// It scans the post-resolution consumer (`compiler.js`) for FORM-HEAD dispatch
// reads — the macro-table lookup `macros[<head>.value]` and head-name equality
// `<head>.value === …` / `<head>.values[0].value === …` — and fails unless each
// is either routed through `formHead` or explicitly sanctioned with an
// `A6-exempt` marker (a read that parses the internal grammar of an
// already-identified form — destructuring/pattern markers, param defaults,
// declaration kinds, try/switch clause markers — where the marker atom can never
// be a lexically bound call head).
//
// The expander is NOT scanned: on JS resolution lives inside the expander walk
// (the ref gate), which runs BEFORE any classifier/macro/kernel dispatch, so a
// bound head is filtered before those raw `head.value` reads execute — the exact
// analogue of Rust not scanning its expander (which gates via the light scan).

import { assert } from "https://deno.land/std/assert/mod.ts";

// The single post-resolution consumer of the tag.
const CONSUMER = "packages/lang/compiler.js";

/**
 * Is `line` a FORM-HEAD dispatch read — the idiom this check polices? Two
 * shapes: the macro-table door `macros[<x>.value]`, and a head-name equality
 * `<head-ish>.value ===` where the left side is a list head (`head`/`headNode`/
 * `innerHead` or a `…values[0]` first element).
 */
function isFormHeadDispatch(line) {
  const t = line.trim();
  if (/macros\[[^\]]*\.value\s*\]/.test(t)) return true; // the dispatch door
  if (/\.values\[0\]\.value\s*===/.test(t)) return true; // first-element head
  if (/\b(head|headNode|innerHead)\.value\s*===/.test(t)) return true;
  return false;
}

/**
 * Sanctioned if the read routes through `formHead`, or an `A6-exempt` marker
 * sits within a small window (a multi-line `&&` condition can carry the marker a
 * line or two away from the `.value ===`). The window is tight enough that the
 * seeded-violation demo (an isolated unmarked read) is still caught.
 */
function sanctioned(lines, idx) {
  if (lines[idx].includes("formHead")) return true;
  // A marker sits above the enclosing `if (…)`; a multi-line `&&` condition can
  // put the read a few lines below it — scan a little further up than down.
  const lo = Math.max(0, idx - 5);
  const hi = Math.min(lines.length - 1, idx + 2);
  for (let i = lo; i <= hi; i++) {
    if (lines[i].includes("A6-exempt")) return true;
  }
  return false;
}

Deno.test("DD-61 §A6: form-head dispatch in compiler.js reads through formHead", () => {
  const src = Deno.readTextFileSync(CONSUMER);
  const lines = src.split("\n");
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    if (isFormHeadDispatch(lines[i]) && !sanctioned(lines, i)) {
      violations.push(`${CONSUMER}:${i + 1}: ${lines[i].trim()}`);
    }
  }
  assert(
    violations.length === 0,
    "form-head dispatch must use `formHead(...)` (or be marked `A6-exempt` for a " +
      "structural grammar read). Unsanctioned raw head-name reads:\n" +
      violations.join("\n"),
  );
});
