import {
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import { lykn } from "../../packages/lang/mod.js";

Deno.test("language surface runway: grouped bind emits sequential constants", () => {
  const result = lykn(`
    (func normalize :args (:any record) :body
      (bind
        email record
        role email)
      role)
  `);
  assertStringIncludes(result, "const email = record;");
  assertStringIncludes(result, "const role = email;");
  assertStringIncludes(result, "return role;");
});

Deno.test("language surface runway: cond expression emits valid value JS", () => {
  const result = lykn(`
    (func role-label :args (:string role) :body
      (cond
        ((= role "admin") "Admin")
        (:else "User")))
  `);
  assertStringIncludes(result, 'role === "admin" ? "Admin" : "User"');
});

Deno.test("language surface runway: cond expression without else rejects", () => {
  assertThrows(
    () => lykn('(bind label (cond ((= role "admin") "Admin")))'),
    Error,
    "if in expression position requires an else branch",
  );
});

Deno.test("language surface runway: exports emits named export list", () => {
  const result = lykn(`
    (exports normalize-role)
    (func normalize-role :args (:string role) :body role)
  `);
  assertStringIncludes(result, "export {normalizeRole};");
});
