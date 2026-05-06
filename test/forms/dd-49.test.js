import { assertEquals } from "jsr:@std/assert";
import { toJsIdentifier } from "../../packages/lang/compiler.js";

// ── Regression: existing camelCase behaviour preserved ──────

Deno.test("camel: no hyphens", () => {
  assertEquals(toJsIdentifier("hello"), "hello");
});

Deno.test("camel: simple", () => {
  assertEquals(toJsIdentifier("my-function"), "myFunction");
});

Deno.test("camel: multiple segments", () => {
  assertEquals(toJsIdentifier("a-b-c"), "aBC");
});

Deno.test("camel: leading hyphen", () => {
  assertEquals(toJsIdentifier("-private"), "_private");
});

Deno.test("camel: trailing hyphen", () => {
  assertEquals(toJsIdentifier("trailing-"), "trailing_");
});

Deno.test("camel: double leading", () => {
  assertEquals(toJsIdentifier("--double"), "__double");
});

Deno.test("camel: all hyphens", () => {
  assertEquals(toJsIdentifier("---"), "___");
});

Deno.test("camel: single char", () => {
  assertEquals(toJsIdentifier("x"), "x");
});

Deno.test("camel: get-user", () => {
  assertEquals(toJsIdentifier("get-user"), "getUser");
});

// ── Rule 1: trailing ? → predicate naming ────────────────

Deno.test("rule1: valid?", () => {
  assertEquals(toJsIdentifier("valid?"), "isValid");
});

Deno.test("rule1: empty?", () => {
  assertEquals(toJsIdentifier("empty?"), "isEmpty");
});

Deno.test("rule1: even?", () => {
  assertEquals(toJsIdentifier("even?"), "isEven");
});

Deno.test("rule1: has-items?", () => {
  assertEquals(toJsIdentifier("has-items?"), "hasItems");
});

Deno.test("rule1: is-void?", () => {
  assertEquals(toJsIdentifier("is-void?"), "isVoid");
});

Deno.test("rule1: can-edit?", () => {
  assertEquals(toJsIdentifier("can-edit?"), "canEdit");
});

Deno.test("rule1: should-retry?", () => {
  assertEquals(toJsIdentifier("should-retry?"), "shouldRetry");
});

Deno.test("rule1: will-succeed?", () => {
  assertEquals(toJsIdentifier("will-succeed?"), "willSucceed");
});

Deno.test("rule1: does-match?", () => {
  assertEquals(toJsIdentifier("does-match?"), "doesMatch");
});

Deno.test("rule1: was-modified?", () => {
  assertEquals(toJsIdentifier("was-modified?"), "wasModified");
});

Deno.test("rule1: had-error?", () => {
  assertEquals(toJsIdentifier("had-error?"), "hadError");
});

// ── Rule 2: trailing ! → strip ───────────────────────────

Deno.test("rule2: swap!", () => {
  assertEquals(toJsIdentifier("swap!"), "swap");
});

Deno.test("rule2: reset!", () => {
  assertEquals(toJsIdentifier("reset!"), "reset");
});

Deno.test("rule2: set!", () => {
  assertEquals(toJsIdentifier("set!"), "set");
});

// ── Rule 3: embedded punctuation → abbreviation ──────────

Deno.test("rule3: *globals*", () => {
  assertEquals(toJsIdentifier("*globals*"), "STARGlobalsSTAR");
});

Deno.test("rule3: string->json", () => {
  assertEquals(toJsIdentifier("string->json"), "stringToJson");
});

Deno.test("rule3: json<-string", () => {
  assertEquals(toJsIdentifier("json<-string"), "jsonFromString");
});

Deno.test("rule3: embedded qmark", () => {
  assertEquals(toJsIdentifier("func?-thing"), "funcQMARKThing");
});

Deno.test("rule3: +constant+", () => {
  assertEquals(toJsIdentifier("+constant+"), "PLUSConstantPLUS");
});

Deno.test("rule3: =val", () => {
  assertEquals(toJsIdentifier("=val"), "EQVal");
});

Deno.test("rule3: &rest", () => {
  assertEquals(toJsIdentifier("&rest"), "AMPRest");
});

Deno.test("rule3: %scratch", () => {
  assertEquals(toJsIdentifier("%scratch"), "PCTScratch");
});

Deno.test("rule3: $ref passthrough", () => {
  assertEquals(toJsIdentifier("$ref"), "$ref");
});

Deno.test("rule3: path/to", () => {
  assertEquals(toJsIdentifier("path/to"), "pathSLASHTo");
});

// ── Rule 4: macro-name overrides ─────────────────────────

Deno.test("rule4: ->", () => {
  assertEquals(toJsIdentifier("->"), "threadFirst");
});

Deno.test("rule4: ->>", () => {
  assertEquals(toJsIdentifier("->>"), "threadLast");
});

// ── Rule 5: doubled trailing punctuation ─────────────────

Deno.test("rule5: valid??", () => {
  assertEquals(toJsIdentifier("valid??"), "isValidQMARK");
});

Deno.test("rule5: swap!!", () => {
  assertEquals(toJsIdentifier("swap!!"), "swapBANG");
});

// ── Edge cases ───────────────────────────────────────────

Deno.test("edge: lone ?", () => {
  assertEquals(toJsIdentifier("?"), "QMARK");
});

Deno.test("edge: lone !", () => {
  assertEquals(toJsIdentifier("!"), "BANG");
});

Deno.test("edge: lone *", () => {
  assertEquals(toJsIdentifier("*"), "STAR");
});

Deno.test("edge: single hyphen", () => {
  assertEquals(toJsIdentifier("-"), "_");
});

Deno.test("edge: double hyphen", () => {
  assertEquals(toJsIdentifier("--"), "__");
});

Deno.test("edge: empty string", () => {
  assertEquals(toJsIdentifier(""), "");
});
