import { assertEquals, assertStringIncludes } from 'jsr:@std/assert';
import { compileLykn } from '../../packages/browser/compiler.js';

Deno.test('browser compiler emits ESM with owned host references that an ESM consumer can run', async () => {
  const source = `
    (exports observed)
    (bind Number 0) (bind Array 0) (bind TypeError 0) (bind Error 0)
    (func check-number :args (:number value) :returns :number :body value)
    (func check-array :args (:array value) :body value)
    (func capture-number :args () :body
      (try (return (check-number "wrong"))
        (catch error (return (array error:name error:message)))))
    (func capture-array :args () :body
      (try (return (check-array 1))
        (catch error (return (array error:name error:message)))))
    (func capture-match :args () :body
      (try (return (match 1 (2 "matched")))
        (catch error (return (array error:name error:message)))))
    (bind observed (array (capture-number) (capture-array) (capture-match)))
  `;
  const generated = compileLykn(source);
  assertStringIncludes(generated, 'from "data:text/javascript,');
  assertStringIncludes(generated, 'lyknIntrinsicArrayIsArray0');
  assertStringIncludes(generated, 'lyknIntrinsicTypeError0');
  assertStringIncludes(generated, 'lyknIntrinsicError0');

  const dir = await Deno.makeTempDir();
  const path = `${dir}/browser-compiled.mjs`;
  try {
    await Deno.writeTextFile(path, generated);
    const module = await import(`file://${path}`);
    assertEquals(module.observed, [
      ['TypeError', "checkNumber: arg 'value' expected number, got string"],
      ['TypeError', "checkArray: arg 'value' expected array, got number"],
      ['Error', 'match: no matching pattern'],
    ]);
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
});
