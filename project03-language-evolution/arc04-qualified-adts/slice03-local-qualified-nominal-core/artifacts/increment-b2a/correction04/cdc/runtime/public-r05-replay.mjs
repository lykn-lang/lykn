const lyknIntrinsicTypeError0 = TypeError;
import {lykn} from "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
import {resetMacros} from "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/expander-core.js";
function expectInvalid(stem, expected) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("expectInvalid: arg 'stem' expected string, got " + typeof stem);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("expectInvalid: arg 'expected' expected string, got " + typeof expected);
  }
  resetMacros();
  const source = Deno.readTextFileSync("fixtures/" + stem + ".lykn");
  try {
    const output = lykn(source);
    Deno.writeTextFileSync("runtime/public-" + stem + ".mjs", output);
    throw new Error("unexpected compilation success: " + stem);
  } catch (failure) {
    const message = failure.message;
    Deno.writeTextFileSync("receipts/public-" + stem + ".diagnostic.txt", message);
    if (!message.includes(expected)) {
      throw failure;
    }
    if (message.includes("was-expanded")) {
      throw failure;
    }
    console.log(stem, message);
  }
}
function expectRuntime(stem, expected) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("expectRuntime: arg 'stem' expected string, got " + typeof stem);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("expectRuntime: arg 'expected' expected string, got " + typeof expected);
  }
  resetMacros();
  const source = Deno.readTextFileSync("fixtures/" + stem + ".lykn");
  const output = lykn(source);
  const path = Deno.cwd() + "/runtime/public-" + stem + ".mjs";
  Deno.writeTextFileSync(path, output);
  const args = ["run", "--no-config", "--no-prompt", "--cached-only", path];
  Deno.writeTextFileSync("receipts/public-" + stem + "-run.command.json", JSON.stringify({ program: Deno.execPath(), args: args, cwd: Deno.cwd() }, null, 2));
  const command = new Deno.Command(Deno.execPath(), { args: args, stdout: "piped", stderr: "piped" });
  const result = command.outputSync();
  Deno.writeFileSync("receipts/public-" + stem + "-run.stdout.txt", result.stdout);
  Deno.writeFileSync("receipts/public-" + stem + "-run.stderr.txt", result.stderr);
  Deno.writeTextFileSync("receipts/public-" + stem + "-run.status.txt", String(result.code));
  const decoder = new TextDecoder();
  if (result.code !== 0) {
    throw new Error(decoder.decode(result.stderr));
  }
  if (decoder.decode(result.stdout) !== expected) {
    throw new Error("unexpected output " + stem);
  }
  return console.log(stem, "runtime-pass");
}
expectInvalid("header-order", "parameter name must be an atom");
expectInvalid("header-registration-control", "parameter name must be an atom");
expectInvalid("header-default-order", "(default) second element must be a name");
expectInvalid("header-default-body-order", "(default) second element must be a name");
expectInvalid("header-fn-order", "parameter name must be an atom");
expectInvalid("header-genfn-order", "parameter name must be an atom");
expectInvalid("header-lambda-order", "parameter name must be an atom");
expectInvalid("header-later-clause-valid-overloads", "parameter name must be an atom");
expectInvalid("genfn-missing-yields-body", "genfn: :yields requires a type keyword and body");
expectInvalid("genfn-actual-body-binding", "forbidden as a strict-mode binding identifier");
expectRuntime("header-valid-default-probe-quoted", "41\n");
expectRuntime("genfn-ignored-header", "41\n");
expectRuntime("genfn-inert-binding-payload", "41\n");
expectRuntime("genfn-no-metadata", "41\n");
expectRuntime("genfn-typed-yields", "41\n");
