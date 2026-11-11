import { assertEquals, assertStringIncludes, assertThrows } from 'jsr:@std/assert';
import { compile, compileExpr } from '../../packages/lang/compiler.js';
import { expand, expandExpr } from '../../packages/lang/expander.js';
import { read } from '../../packages/lang/reader.js';
import { hostReference } from '../../packages/lang/surface-helpers.js';

Deno.test('owned host references are lowered hygienically in complete units', () => {
  const expanded = expand(
    read('(bind Number 0) (func f :args (:number x) :returns :number :body x)'),
  );
  const generated = compile(expanded);
  assertStringIncludes(
    generated,
    'import {numberIsNaN as lyknIntrinsicNumberIsNaN0}',
  );
  assertStringIncludes(generated, 'const lyknIntrinsicTypeError0 = TypeError;');
  assertStringIncludes(generated, 'lyknIntrinsicNumberIsNaN0(x)');
  assertStringIncludes(generated, 'new lyknIntrinsicTypeError0(');
  assertStringIncludes(generated, 'const Number = 0;');
});

Deno.test('no-request output and source-shaped names do not select private references', () => {
  assertEquals(
    compile(expand(read('(bind answer 42)'))),
    'const answer = 42;\n',
  );
  assertEquals(
    compile([{ type: 'atom', value: 'lyknIntrinsicError0' }]),
    'lyknIntrinsicError0;\n',
  );
});

Deno.test('normalized source identifiers reserve generated reference aliases', () => {
  const generated = compile(expand(read(
    '(bind lykn-intrinsic-array-is-array0 0) (func accepts-array :args (:array value) :body value)',
  )));
  assertStringIncludes(generated, 'const lyknIntrinsicArrayIsArray1 = Array.isArray;');
  assertEquals(generated.includes('const lyknIntrinsicArrayIsArray0 = Array.isArray;'), false);
});

Deno.test('unfinished private host references fail on the fragment compiler path', () => {
  assertThrows(
    () => compileExpr(hostReference('Error')),
    Error,
    'unfinished compiler-owned host reference',
  );
});

Deno.test('one owned value reference can head multiple calls and shares one alias', async () => {
  const forms = expand(read(
    '(exports observed) (bind observed (array (lookup "lykn:shared") (lookup "lykn:shared")))',
  ));
  const shared = hostReference('SymbolFor');
  const replaceCalls = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'list' && node.values[0]?.type === 'atom' && node.values[0].value === 'lookup') {
      node.values[0] = shared;
    }
    if (node.type === 'list') for (const child of node.values) replaceCalls(child);
    if (node.type === 'cons') { replaceCalls(node.car); replaceCalls(node.cdr); }
  };
  for (const form of forms) replaceCalls(form);
  const generated = compile(forms);
  assertEquals((generated.match(/const lyknIntrinsicSymbolFor0 = Symbol\.for;/g) ?? []).length, 1);
  assertEquals((generated.match(/lyknIntrinsicSymbolFor0\("lykn:shared"\)/g) ?? []).length, 2);

  const dir = await Deno.makeTempDir();
  const path = `${dir}/shared-host-reference.js`;
  try {
    await Deno.writeTextFile(path, generated);
    const module = await import(`file://${path}`);
    assertEquals(module.observed[0], module.observed[1]);
    assertEquals(module.observed[0], Symbol.for('lykn:shared'));
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
});

Deno.test('expandExpr materializes owned references as complete multi-form output', () => {
  const expanded = expandExpr(
    read('(func f :args (:number x) :returns :number :body x)')[0],
  );
  assertEquals(Array.isArray(expanded), true);
  assertStringIncludes(
    compile(expanded),
    'const lyknIntrinsicTypeError0 = TypeError;',
  );
});

Deno.test('public emitted ESM uses real guard and no-match intrinsics under module shadowing', async () => {
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
  const dir = await Deno.makeTempDir();
  const path = `${dir}/host-references.js`;
  try {
    await Deno.writeTextFile(path, compile(expand(read(source))));
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
