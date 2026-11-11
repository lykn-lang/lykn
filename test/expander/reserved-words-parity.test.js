import { assertEquals, assertStringIncludes } from "https://deno.land/std/assert/mod.ts";
import { dirname, fromFileUrl, resolve } from "https://deno.land/std/path/mod.ts";
import { RESERVED_WORDS as JS_LIST } from "lang/reserved-words.js";
import { validateReservedNames } from "lang/binding.js";
import { isReservedWord } from "lang/reserved-words.js";
import { read } from "lang/reader.js";

const repoRoot = resolve(dirname(fromFileUrl(import.meta.url)), "../..");
const EXPECTED_RESERVED = [
  "await", "break", "case", "catch", "class", "const", "continue", "debugger",
  "default", "delete", "do", "else", "enum", "export", "extends", "false",
  "finally", "for", "function", "if", "import", "implements", "interface", "in",
  "instanceof", "let", "new", "null", "package", "private", "protected", "public",
  "return", "super", "static", "switch", "this", "throw", "true", "try", "typeof",
  "var", "void", "while", "with", "yield",
];
const LEGAL_CONTEXTUAL = ["as", "async", "from", "get", "meta", "of", "set", "target", "widget"];

function parseRustList() {
  const src = Deno.readTextFileSync(resolve(repoRoot, "crates/lykn-lang/src/binding.rs"));
  const block = src.match(/pub const RESERVED_WORDS[^=]*=\s*&\[([\s\S]*?)\];/);
  if (!block) throw new Error("could not locate Rust RESERVED_WORDS");
  return [...block[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
}

async function parseModuleBinding(name) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-reserved-word-" });
  const path = `${directory}/probe.mjs`;
  try {
    await Deno.writeTextFile(path, `export {};\nconst ${name} = 0;\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-remote", "--no-npm", "--no-prompt", "--cached-only", path],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    return {
      success: result.code === 0,
      stderr: new TextDecoder().decode(result.stderr),
    };
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("reserved-word table exactly matches Rust and fixed normative vocabulary", () => {
  assertEquals([...JS_LIST], parseRustList());
  assertEquals([...JS_LIST], EXPECTED_RESERVED);
  for (const word of EXPECTED_RESERVED) assertEquals(isReservedWord(word), true, word);
  for (const word of LEGAL_CONTEXTUAL) assertEquals(isReservedWord(word), false, word);
  assertEquals(isReservedWord("eval"), false);
  assertEquals(isReservedWord("arguments"), false);
});

Deno.test("each reserved table entry fails an actual offline ESM parse", async () => {
  for (const word of JS_LIST) {
    const result = await parseModuleBinding(word);
    assertEquals(result.success, false, `${word} unexpectedly parsed as an ESM binding`);
    assertStringIncludes(result.stderr.toLowerCase(), "error");
  }
});

Deno.test("legal contextual names and strict-only bindings use separate oracles", async () => {
  for (const word of LEGAL_CONTEXTUAL) {
    const result = await parseModuleBinding(word);
    assertEquals(result.success, true, `${word}: ${result.stderr}`);
  }
  for (const word of ["eval", "arguments"]) {
    const result = await parseModuleBinding(word);
    assertEquals(result.success, false, `${word} must remain strict-binding-only`);
    assertStringIncludes(result.stderr.toLowerCase(), "error");
    assertEquals(isReservedWord(word), false);
  }
  for (const [source, phrase] of [["(bind eval 0)", "strict-mode binding"], ["(label eval (block))", ""], ["(bind if! 0)", "emits the JavaScript reserved word 'if'"]]) {
    if (phrase) {
      try {
        validateReservedNames(read(source));
        throw new Error(`expected ${source} to reject`);
      } catch (error) {
        assertStringIncludes(error.message, phrase);
      }
    } else {
      validateReservedNames(read(source));
    }
  }
});
