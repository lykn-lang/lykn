# Finding D — @lykn/lang's `exports` field missing `./mod.js` sub-path

**Date:** 2026-05-12
**Thread:** cdc/dep-ergonomics
**Relates to:** `report-mycelium-bootstrap-issues.md` issue #9 (complementary, not duplicate)
**Discovery:** Pre-Finding-E smoke test of mycelium with `jsr:@lykn/lang@0.5.2/` prefix import. Now masked by Finding E (compiler bug) on `release/0.6.x`, but still real and reproducible against published 0.5.2.

## Summary

`@lykn/lang`'s `packages/lang/deno.json` declares this `exports` object:

```json
"exports": {
  ".":             "./mod.js",
  "./reader.js":   "./reader.js",
  "./compiler.js": "./compiler.js",
  "./expander.js": "./expander.js",
  "./surface.js":  "./surface.js"
}
```

`./mod.js` is the target of the `.` (root) export. It is **not** exposed as a sub-path. Consumers using `jsr:@lykn/lang/mod.js` get a JSR resolution failure:

```
Failed to resolve the specifier "lang/mod.js" as its after-prefix portion "mod.js"
could not be URL-parsed relative to the URL prefix "jsr:@lykn/lang@0.5.2/" mapped
to by the prefix "lang/"
```

That sub-path is needed because `@lykn/testing`'s `packages/testing/helpers.js` line 18 imports it:

```javascript
import { lykn } from "lang/mod.js";
```

That bare-prefix import resolves through the consumer's `"lang/"` import-map entry:
- Local-path (`"../lang/packages/lang/"`) → filesystem resolves `../lang/packages/lang/mod.js`. Works (filesystems don't enforce exports fields).
- JSR-pinned (`"jsr:@lykn/lang@0.5.2/"`) → resolves to `"jsr:@lykn/lang@0.5.2/mod.js"`. **Fails — sub-path not in exports field.**

## Relationship to bootstrap-issue-#9

Bootstrap report issue #9 frames the problem as "`lykn new` project.json missing `lang/` and `testing/` imports" and recommends scaffold-level fixes. That framing is correct for the *scaffold-time* layer. Finding D identifies the *package-publish-time* layer:

| Layer | Issue | Fix |
|---|---|---|
| Scaffold (issue #9) | `lykn new` doesn't generate `lang/`/`testing/` imports in `project.json` | `lykn new` template adds them |
| Package publish (Finding D) | Even with consumer's imports configured correctly via JSR prefix, `@lykn/lang` doesn't expose `./mod.js` | Add `"./mod.js": "./mod.js"` to `packages/lang/deno.json` exports |

**Both fixes are needed.** Issue #9 makes the scaffold produce a project.json that *can work*. Finding D makes `@lykn/lang` *capable of working* when project.json maps the prefix to JSR. Without Finding D's fix, even a perfectly-scaffolded project hits the resolution failure the moment it pins to a registry specifier.

## Two-line structural fix

`packages/lang/deno.json`:

```diff
   "exports": {
     ".":             "./mod.js",
+    "./mod.js":      "./mod.js",
     "./reader.js":   "./reader.js",
     "./compiler.js": "./compiler.js",
     "./expander.js": "./expander.js",
     "./surface.js":  "./surface.js"
   }
```

This explicitly exposes `./mod.js` as both the root and as a sub-path, allowing both `jsr:@lykn/lang` and `jsr:@lykn/lang/mod.js` to resolve.

## Defensive secondary fix (optional but recommended)

`packages/testing/helpers.js` line 18 makes the testing macros depend on a sub-path the @lykn/lang package historically didn't expose. Even after the structural fix above, this dependency is fragile — future restructuring of @lykn/lang could drop `mod.js` and break helpers.js again. Defensive: reconstruct `lykn` locally instead of importing it.

```diff
 import { read } from "lang/reader.js";
 import { compile as rawCompile } from "lang/compiler.js";
 import {
   resetGensym,
   resetMacros,
   resetModuleCache,
+  expand,
 } from "lang/expander.js";
-import { lykn } from "lang/mod.js";
+
+// Reconstruct `lykn` locally to avoid depending on @lykn/lang
+// exposing `./mod.js` as a sub-path. See Finding D in
+// workbench/finding-d-lang-exports-gap-2026-05-12.md.
+function lykn(source) {
+  return rawCompile(expand(read(source)));
+}
```

(Note: this requires importing `expand` from `lang/expander.js`, which IS already in the exports field.)

## Audit recommendation — broader exports-field review

While we're touching `@lykn/lang`'s exports, audit the others. Question for each lykn package: does anyone's helpers / macros / runtime code import a sub-path of this package, AND is that sub-path in the package's exports field?

A grep across the workspace:

```sh
# Find bare-prefix imports of any lykn-published package's sub-path
grep -rnE 'from "(lang|testing|browser|mycl)/' packages/

# For each match, check whether the referenced sub-path is in the
# corresponding package's deno.json exports field.
```

The structural rule: **any sub-path that appears in another lykn package's import statement MUST be in the target package's exports field.** This is the lykn-internal equivalent of "every imported module must resolve."

## Why this matters even post-Finding-E

Finding E (the DD-50 emission bug) currently blocks Pass 2 of the smoke test before it can reach a resolution failure. Once Finding E is fixed (DD-50.7), the next consumer who pins to registry specifiers will hit Finding D. Fixing only E surfaces D as a follow-on failure; fixing both together is the cleaner end-state.

## Release-shape recommendation

Bundle Finding D's fix with Finding E's fix in the same release:

- If Duncan chooses 0.5.3 patch (DD-50.7's option c): D ships in 0.5.3 along with E.
- If Duncan chooses fix-before-0.6.0 (DD-50.7's option a, per Duncan's call): D ships in 0.6.0.

Either way, the 0.5.3 / 0.6.0 release notes should explicitly call out the exports-field addition as enabling registry-prefix imports for downstream consumers.

## Coordination handoff

This memo is structured for incorporation into bootstrap-issue-#9's GitHub ticket draft (the active CC prompt at `workbench/CC-prompt-create-gh-tickets-2026-05-10.md`). If issue #9's ticket already exists in some draft form, add Finding D as a "Related" section. If not, file Finding D as its own ticket cross-referenced from #9.

## What this memo does NOT propose

- Filing the GitHub ticket here. That's bootstrap-#9's CC prompt's job.
- Implementing the fix here. The two-line `deno.json` edit + the defensive helpers.js refactor are simple enough to be a single small commit on `release/0.6.x` whenever Duncan chooses to land them.
- A separate DD. The fix is structural-but-small; no design tension to resolve. A diff + a release-notes line suffices.
