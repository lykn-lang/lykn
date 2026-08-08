import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/assert/mod.ts";
import { read } from "../../packages/lang/reader.js";

Deno.test("reader: standard string escapes decode", () => {
  const [node] = read(String.raw`"\n\t\r\b\f\v\0\\\"\'\/\x41\u2026\u{1F600}"`);
  assertEquals(node, {
    type: "string",
    value: "\n\t\r\b\f\v\0\\\"'/A\u2026\u{1F600}",
  });
});

Deno.test("reader: malformed and unknown string escapes throw", () => {
  assertThrows(
    () => read(String.raw`"\q"`),
    Error,
    "unsupported escape sequence \\q",
  );
  assertThrows(() => read(String.raw`"\x4z"`), Error, "malformed \\x escape");
  assertThrows(() => read(String.raw`"\u12xz"`), Error, "malformed \\u escape");
  assertThrows(() => read(String.raw`"\u{}"`), Error, "empty \\u{...} escape");
  assertThrows(
    () => read(String.raw`"\01"`),
    Error,
    "octal escapes are not supported",
  );
});
