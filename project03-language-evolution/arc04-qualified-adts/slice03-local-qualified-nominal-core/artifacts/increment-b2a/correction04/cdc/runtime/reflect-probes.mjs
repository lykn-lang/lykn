const lyknIntrinsicTypeError0 = TypeError;
import {read} from "lang/reader.js";
import {compile, compileExpr} from "lang/compiler.js";
import {compileWithHostInvocations, hostInvocationRequest, newHostInvocationId} from "lang/host-invocation.js";
const home = Deno.args[0];
const decoder = new TextDecoder();
function anchorIn(node) {
  if (node.type !== "list") {
    return null;
  }
  if (node.values.length === 3 && node.values[0]["value"] === "saved") {
    return node;
  }
  for (const child of node.values) {
    const found = anchorIn(child);
    if (found) {
      return found;
    }
  }
  return null;
}
function expectError(label, action, expected) {
  if (typeof label !== "string") {
    throw new lyknIntrinsicTypeError0("expectError: arg 'label' expected string, got " + typeof label);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("expectError: arg 'expected' expected string, got " + typeof expected);
  }
  try {
    action();
    throw new Error("unexpected success " + label);
  } catch (failure) {
    Deno.writeTextFileSync(home + "/" + label + ".diagnostic.txt", failure.message);
    if (!failure.message.includes(expected)) {
      throw failure;
    }
    true;
  }
}
for (const scenario of ["global", "shadowed"]) {
  const prefix = scenario === "shadowed" ? "(const Reflect 0) " : "";
  const forms = read(prefix + "(function saved (value) (return (+ this:base value))) (const receiver (object (base 40))) (const argv (array 1)) (console:log (saved receiver argv))");
  const anchor = forms.map(anchorIn);
  const selected = anchor.find(value => value);
  const request = hostInvocationRequest(newHostInvocationId(), selected);
  const generated = compileWithHostInvocations(forms, compile, [request]);
  const path = home + "/reflect-" + scenario + ".mjs";
  Deno.writeTextFileSync(path, generated);
  const args = ["run", "--no-config", "--no-prompt", "--cached-only", path];
  Deno.writeTextFileSync(home + "/reflect-" + scenario + ".command.json", JSON.stringify({ program: Deno.execPath(), args: args, cwd: Deno.cwd() }, null, 2));
  const command = new Deno.Command(Deno.execPath(), { args: args, stdout: "piped", stderr: "piped" });
  const result = command.outputSync();
  Deno.writeFileSync(home + "/reflect-" + scenario + ".stdout.txt", result.stdout);
  Deno.writeFileSync(home + "/reflect-" + scenario + ".stderr.txt", result.stderr);
  Deno.writeTextFileSync(home + "/reflect-" + scenario + ".status.txt", String(result.code));
  if (!((result.code === 0 && decoder.decode(result.stdout) === "41\n") && result.stderr.length === 0)) {
    throw new Error("Reflect runtime mismatch " + scenario);
  }
}
const forms = read("(saved receiver argv)");
const request = hostInvocationRequest(newHostInvocationId(), forms[0]);
expectError("fragment", () => compileWithHostInvocations(forms, items => compileExpr(items[0]), [request]), "complete finalization");
if (compile(forms) !== "saved(receiver, argv);\n") {
  throw new Error("Reflect recovery mismatch");
}
const other = read("(other receiver argv)")[0];
const orphan = hostInvocationRequest(newHostInvocationId(), other);
expectError("orphan", () => compileWithHostInvocations(forms, compile, [orphan]), "orphaned");
console.log("Reflect2 runtime/fragment/orphan/recovery pass");
