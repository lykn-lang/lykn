import { assertEquals, assertThrows } from "jsr:@std/assert";
import { read } from "../../packages/lang/reader.js";
import { compile } from "../../packages/lang/compiler.js";
import {
  compileWithHostInvocations,
  hostInvocationRequest,
  newHostInvocationId,
} from "../../packages/lang/host-invocation.js";

Deno.test("private host invocation lowers only the exact requested call", () => {
  const ordinary = read('(saved receiver argv)');
  const ordinaryOutput = compile(ordinary);
  assertEquals(ordinaryOutput, "saved(receiver, argv);\n");

  const requested = read('"use strict" (saved receiver argv)');
  const request = hostInvocationRequest(newHostInvocationId(), requested[1]);
  const output = compileWithHostInvocations(requested, [request]);
  assertEquals(output.includes("function lyknHostReflectApply0(fn, receiver, argv)"), true);
  assertEquals(output.includes("lyknHostReflectApply0(saved, receiver, argv);"), true);
  assertEquals(output.indexOf('"use strict";') < output.indexOf("function lyknHostReflectApply0"), true);
});

Deno.test("private host invocation rejects module Reflect and malformed requests", () => {
  const moduleReflect = read('(const Reflect local) (saved receiver argv)');
  const moduleRequest = hostInvocationRequest(newHostInvocationId(), moduleReflect[1]);
  assertThrows(() => compileWithHostInvocations(moduleReflect, [moduleRequest]), Error,
    "module Reflect binding");

  const malformed = read('(saved receiver)');
  const malformedRequest = hostInvocationRequest(newHostInvocationId(), malformed[0]);
  assertThrows(() => compileWithHostInvocations(malformed, [malformedRequest]), Error,
    "three-part call");

  const orphan = read('(saved receiver argv)');
  const absentNode = read('(other receiver argv)')[0];
  const orphanRequest = hostInvocationRequest(newHostInvocationId(), absentNode);
  assertThrows(() => compileWithHostInvocations(orphan, [orphanRequest]), Error,
    "unconsumed");
});
