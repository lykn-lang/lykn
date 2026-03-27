import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { read } from "../../src/reader.js";
import { expand, resetGensym, resetMacros, resetModuleCache } from "../../src/expander.js";
import { compile } from "../../src/compiler.js";

function lykn(source) {
  resetMacros(); resetGensym(); resetModuleCache();
  return compile(expand(read(source))).trim();
}

Deno.test("integration: control flow macros (when, unless)", () => {
  const result = lykn(`
    (macro when (test (rest body))
      \`(if ,test (block ,@body)))

    (macro unless (test (rest body))
      \`(if (! ,test) (block ,@body)))

    (const x 10)
    (when (> x 0)
      (console:log "positive")
      (console:log x))

    (unless (=== x 0)
      (console:log "nonzero"))
  `);

  assertEquals(result.includes("const x = 10"), true);
  assertEquals(result.includes("if (x > 0)"), true);
  assertEquals(result.includes('"positive"'), true);
  assertEquals(result.includes("!(x === 0)"), true);
  assertEquals(result.includes('"nonzero"'), true);
});
