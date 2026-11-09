import { assertEquals, assertStringIncludes, assertThrows } from "jsr:@std/assert";
import { read } from "../../packages/lang/reader.js";
import { compile } from "../../packages/lang/compiler.js";
import {
  compileWithHostInvocations,
  hostInvocationRequest,
  newHostInvocationId,
} from "../../packages/lang/host-invocation.js";

const FIXTURES = new URL("../fixtures/lazy-protected-invocation/", import.meta.url);

function fixture(name) {
  return read(Deno.readTextFileSync(new URL(name, FIXTURES)));
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
  assertEquals(second.includes("lyknHostReflectApply"), false);

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
    "three-part call");

  const duplicate = read('(saved receiver argv)');
  const duplicateRequest = hostInvocationRequest(newHostInvocationId(), duplicate[0]);
  assertThrows(() => compileWithHostInvocations(duplicate, compile,
    [duplicateRequest, duplicateRequest]), Error, "duplicate");
});

Deno.test("lazy protected invocation materializes all four public proof inputs", () => {
  const evidenceRoot = Deno.env.get("LYKN_INTRINSIC_EVIDENCE_DIR") ?? Deno.makeTempDirSync({ prefix: "lykn-invoke-public-" });
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
  assertEquals(shakenProvider.indexOf("Reflect.apply") > shakenProvider.indexOf("function lyknHostReflectApply0"), true);
  assertEquals(Deno.readTextFileSync(`${shakenRoot}/entry.js`).includes("lyknHostReflectApply"), false);

  // Retained but uncalled: invocation survives in the export; lookup stays in
  // the helper body. The separately compiled observer counts property reads.
  const retainedRoot = caseRoot("retained", evidenceRoot);
  Deno.writeTextFileSync(`${retainedRoot}/provider.js`, compileProvider(true));
  const retainedInput = Deno.readTextFileSync(`${retainedRoot}/provider.js`);
  assertStringIncludes(retainedInput, "export {invoke, marker}");
  assertStringIncludes(retainedInput, "function lyknHostReflectApply0");
  Deno.writeTextFileSync(`${retainedRoot}/observer.js`, compileFixture("retained-observer.lisp"));

  // Live call: saved getter value, original receiver and fully materialized
  // arguments survive a getter, spread, and later argument mutation.
  const liveRoot = caseRoot("live", evidenceRoot);
  Deno.writeTextFileSync(`${liveRoot}/provider.js`, compileProvider(true));
  Deno.writeTextFileSync(`${liveRoot}/entry.js`, compileFixture("live-entry.lisp"));
  assertStringIncludes(Deno.readTextFileSync(`${liveRoot}/provider.js`), "lyknHostReflectApply0");
  assertStringIncludes(Deno.readTextFileSync(`${liveRoot}/entry.js`), "invoke(");
  assertStringIncludes(Deno.readTextFileSync(`${liveRoot}/entry.js`), "function*() {");
});
