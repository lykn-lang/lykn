import { assertEquals, assertStringIncludes, assertThrows } from "jsr:@std/assert";
import { read } from "../../packages/lang/reader.js";
import { compile, compileExpr } from "../../packages/lang/compiler.js";
import {
  compileWithHostInvocations,
  hostInvocationRequest,
  newHostInvocationId,
} from "../../packages/lang/host-invocation.js";

const FIXTURES = "test/fixtures/lazy-protected-invocation/";

function fixture(name) {
  return read(Deno.readTextFileSync(`${FIXTURES}${name}`));
}

function findSavedCall(nodes) {
  for (const node of nodes) {
    if (node.type !== "list") continue;
    const values = node.values;
    if (values.length === 3 && values[0].type === "atom" && values[0].value === "saved" &&
        values[1].type === "atom" && values[1].value === "receiver" &&
        values[2].type === "atom" && values[2].value === "argv") return node;
    const found = findSavedCall(values);
    if (found) return found;
  }
  return null;
}

function compileProvider(requested) {
  const forms = fixture("provider.lisp");
  if (!requested) return compile(forms);
  const anchor = findSavedCall(forms);
  if (!anchor) throw new Error("shared provider fixture lost its exact saved call node");
  const request = hostInvocationRequest(newHostInvocationId(), anchor);
  return compileWithHostInvocations(forms, compile, [request]);
}

function caseRoot(name, evidenceRoot) {
  const requestedRoot = Deno.env.get("LYKN_INTRINSIC_EVIDENCE_DIR");
  const root = requestedRoot ? `${requestedRoot}/public/${name}` : `${evidenceRoot}/${name}`;
  Deno.mkdirSync(root, { recursive: true });
  return root;
}

function compileFixture(name) {
  return compile(fixture(name));
}

Deno.test("lazy protected invocation preserves the no-request compiler path", () => {
  const forms = fixture("provider.lisp");
  const first = compile(forms);
  const second = compileWithHostInvocations(forms, compile, []);
  assertEquals(second, first);
  assertEquals(second.includes("function lyknHostReflectApply"), false);
  assertStringIncludes(second, "saved(receiver, argv)");
  const requestedProvider = compileProvider(true);
  assertStringIncludes(requestedProvider, "function lyknHostReflectApply2(fn, receiver, argv)");
  assertStringIncludes(requestedProvider, "lyknHostReflectApply2(saved, receiver, argv)");
  assertEquals(requestedProvider.indexOf('"use strict";') <
    requestedProvider.indexOf("function lyknHostReflectApply2"), true);

  const collision = fixture("collision.lisp");
  const anchor = findSavedCall(collision);
  const request = hostInvocationRequest(newHostInvocationId(), anchor);
  const output = compileWithHostInvocations(collision, compile, [request]);
  assertStringIncludes(output, "function lyknHostReflectApply2(fn, receiver, argv)");
  assertStringIncludes(output, "typeof lyknHostReflectApply1");

  const textualOnly = compile(read('(list "hostInvocationRequest" "Reflect.apply")'));
  assertEquals(textualOnly.includes("lyknHostReflectApply"), false);
});

Deno.test("lazy protected invocation validates plans and recovers after rejection", () => {
  const moduleReflect = read('(const Reflect local) (saved receiver argv)');
  const request = hostInvocationRequest(newHostInvocationId(), moduleReflect[1]);
  assertThrows(() => compileWithHostInvocations(moduleReflect, compile, [request]), Error,
    "module Reflect binding");
  assertEquals(compile(moduleReflect).includes("const Reflect = local;"), true);
  assertEquals(compileWithHostInvocations(moduleReflect, compile, []), compile(moduleReflect));

  const nested = read('(saved (receiver) argv)');
  const nestedRequest = hostInvocationRequest(newHostInvocationId(), nested[0]);
  assertThrows(() => compileWithHostInvocations(nested, compile, [nestedRequest]), Error,
    "stable atom references");

  const duplicate = read('(saved receiver argv)');
  const duplicateRequest = hostInvocationRequest(newHostInvocationId(), duplicate[0]);
  assertThrows(() => compileWithHostInvocations(duplicate, compile,
    [duplicateRequest, duplicateRequest]), Error, "duplicate");

  const orphanUnit = read('(saved receiver argv)');
  const orphanAnchor = read('(other receiver argv)')[0];
  const orphanRequest = hostInvocationRequest(newHostInvocationId(), orphanAnchor);
  assertThrows(() => compileWithHostInvocations(orphanUnit, compile, [orphanRequest]), Error,
    "orphaned");

  const unfinalized = read('(saved receiver argv)');
  const unfinalizedRequest = hostInvocationRequest(newHostInvocationId(), unfinalized[0]);
  assertThrows(() => compileWithHostInvocations(unfinalized,
    (exprs) => compileExpr(exprs[0]), [unfinalizedRequest]), Error,
  "complete finalization");
  assertEquals(compile(unfinalized), "saved(receiver, argv);\n",
    "a callback that returns a provisional node must leave no active request");

  for (const source of [
    '(saved receiver:method argv)',
    '(saved this argv)',
    '(saved receiver true)',
    '(undefined receiver argv)',
  ]) {
    const invalid = read(source);
    const invalidRequest = hostInvocationRequest(newHostInvocationId(), invalid[0]);
    let callbackRan = false;
    assertThrows(() => compileWithHostInvocations(invalid, () => {
      callbackRan = true;
      return "should not run";
    }, [invalidRequest]), Error, "stable atom references");
    assertEquals(callbackRan, false);
  }
  const emptyOperand = [{
    type: "list",
    values: [{ type: "atom", value: "saved" }, { type: "atom", value: "" },
      { type: "atom", value: "argv" }],
  }];
  const emptyRequest = hostInvocationRequest(newHostInvocationId(), emptyOperand[0]);
  assertThrows(() => compileWithHostInvocations(emptyOperand, () => "not compiled", [emptyRequest]),
    Error, "stable atom references");

  const multiple = read('(saved receiver argv) (other target args)');
  const multipleRequests = multiple.map(node =>
    hostInvocationRequest(newHostInvocationId(), node));
  const multipleOutput = compileWithHostInvocations(multiple, compile, multipleRequests);
  assertEquals((multipleOutput.match(/function lyknHostReflectApply0/g) ?? []).length, 1);
  assertStringIncludes(multipleOutput, "lyknHostReflectApply0(saved, receiver, argv);");
  assertStringIncludes(multipleOutput, "lyknHostReflectApply0(other, target, args);");
});

Deno.test("lazy protected invocation checks source module binding roles", () => {
  const unavailableSources = [
    '(import "./remote.js" ((alias remote Reflect))) (saved receiver argv)',
    '(export (function Reflect () (return 1))) (saved receiver argv)',
    '(export default (function Reflect () (return 1))) (saved receiver argv)',
    '(export (async (function Reflect () (return 1)))) (saved receiver argv)',
    '(block (var Reflect local)) (saved receiver argv)',
  ];
  for (const source of unavailableSources) {
    const forms = read(source);
    const anchor = findSavedCall(forms);
    assertThrows(() => compileWithHostInvocations(forms, compile,
      [hostInvocationRequest(newHostInvocationId(), anchor)]), Error,
    "module Reflect binding");
  }
  const reexport = read('(export "./remote.js" (names Reflect)) (saved receiver argv)');
  assertEquals(compileWithHostInvocations(reexport, compile,
    [hostInvocationRequest(newHostInvocationId(), findSavedCall(reexport))])
    .includes("function lyknHostReflectApply0"), true);

  const nested = read('(function local (Reflect) (saved receiver argv))');
  assertEquals(compileWithHostInvocations(nested, compile,
    [hostInvocationRequest(newHostInvocationId(), findSavedCall(nested))])
    .includes("function lyknHostReflectApply0"), true);
});

Deno.test("lazy protected invocation materializes all four public proof inputs", () => {
  const requestedEvidenceRoot = Deno.env.get("LYKN_INTRINSIC_EVIDENCE_DIR");
  const evidenceRoot = requestedEvidenceRoot ?? Deno.makeTempDirSync({ prefix: "lykn-invoke-public-" });
  try {
  // Absent: ordinary compile is byte-identical and has no helper or lookup.
  const absentRoot = caseRoot("absent", evidenceRoot);
  const absentForms = fixture("absent.lisp");
  const absentJs = compile(absentForms);
  assertEquals(absentJs, compileWithHostInvocations(absentForms, compile, []));
  assertEquals(absentJs.includes("lyknHostReflectApply"), false);
  assertEquals(absentJs.includes("Reflect.apply"), false);
  Deno.writeTextFileSync(`${absentRoot}/absent.js`, absentJs);
  assertEquals(Deno.readTextFileSync(`${absentRoot}/absent.js`), absentJs);

  // Shaken: provider side effects remain while unused invoke/helper disappear.
  const shakenRoot = caseRoot("shaken", evidenceRoot);
  Deno.writeTextFileSync(`${shakenRoot}/provider.js`, compileProvider(true));
  Deno.writeTextFileSync(`${shakenRoot}/entry.js`, compileFixture("shaken-entry.lisp"));
  const shakenProvider = Deno.readTextFileSync(`${shakenRoot}/provider.js`);
  assertStringIncludes(shakenProvider, "Reflect.apply");
  assertEquals(shakenProvider.indexOf("Reflect.apply") > shakenProvider.indexOf("function lyknHostReflectApply2"), true);
  assertEquals(Deno.readTextFileSync(`${shakenRoot}/entry.js`).includes("lyknHostReflectApply"), false);

  // Retained but uncalled: invocation survives in the export; lookup stays in
  // the helper body. The separately compiled observer counts property reads.
  const retainedRoot = caseRoot("retained", evidenceRoot);
  Deno.writeTextFileSync(`${retainedRoot}/provider.js`, compileProvider(true));
  const retainedInput = Deno.readTextFileSync(`${retainedRoot}/provider.js`);
  assertStringIncludes(retainedInput, "export {invoke, marker}");
  assertStringIncludes(retainedInput, "function lyknHostReflectApply2");
  Deno.writeTextFileSync(`${retainedRoot}/observer.js`, compileFixture("retained-observer.lisp"));

  // Live call: saved getter value, original receiver and fully materialized
  // arguments survive a getter, spread, and later argument mutation.
  const liveRoot = caseRoot("live", evidenceRoot);
  Deno.writeTextFileSync(`${liveRoot}/provider.js`, compileProvider(true));
  Deno.writeTextFileSync(`${liveRoot}/entry.js`, compileFixture("live-entry.lisp"));
  assertStringIncludes(Deno.readTextFileSync(`${liveRoot}/provider.js`), "lyknHostReflectApply2");
  assertStringIncludes(Deno.readTextFileSync(`${liveRoot}/entry.js`), "invoke(");
  assertStringIncludes(Deno.readTextFileSync(`${liveRoot}/entry.js`), "function* () {");
  } finally {
    if (!requestedEvidenceRoot) Deno.removeSync(evidenceRoot, { recursive: true });
  }
});
