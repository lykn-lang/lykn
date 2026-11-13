const lyknIntrinsicTypeError0 = TypeError;
const cli = "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn";
const decoder = new TextDecoder();
function rejectRoutes(stem, expected) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("rejectRoutes: arg 'stem' expected string, got " + typeof stem);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("rejectRoutes: arg 'expected' expected string, got " + typeof expected);
  }
  const source = Deno.cwd() + "/fixtures/" + stem + ".lykn";
  for (const mode of ["checked", "stripped", "check"]) {
    const label = stem + "-native-" + mode;
    const path = Deno.cwd() + "/runtime/" + label + ".mjs";
    const args = mode === "check" ? ["check", source] : ["compile", source, "-o", path];
    if (mode === "stripped") {
      args.push("--strip-assertions");
    }
    Deno.writeTextFileSync("receipts/" + label + ".command.json", JSON.stringify({ program: cli, args: args, cwd: Deno.cwd() }, null, 2));
    const command = new Deno.Command(cli, { args: args, stdout: "piped", stderr: "piped" });
    const result = command.outputSync();
    Deno.writeFileSync("receipts/" + label + ".stdout.txt", result.stdout);
    Deno.writeFileSync("receipts/" + label + ".stderr.txt", result.stderr);
    Deno.writeTextFileSync("receipts/" + label + ".status.txt", String(result.code));
    const message = decoder.decode(result.stderr);
    if (result.code !== 1) {
      throw new Error("unexpected status " + label);
    }
    if (!message.includes(expected)) {
      throw new Error(label + message);
    }
    if (message.includes("was-expanded")) {
      throw new Error("probe executed " + label);
    }
    if (result.stdout.length !== 0) {
      throw new Error("unexpected stdout " + label);
    }
  }
  return console.log(stem, "three diagnostic routes pass");
}
rejectRoutes("header-order", "parameter name must be an atom");
rejectRoutes("header-registration-control", "parameter name must be an atom");
rejectRoutes("header-default-order", "(default) expected :type name value");
rejectRoutes("header-fn-order", "parameter name must be an atom");
rejectRoutes("header-genfn-order", "parameter name must be an atom");
rejectRoutes("header-lambda-order", "parameter name must be an atom");
rejectRoutes("header-later-clause-valid-overloads", "parameter name must be an atom");
rejectRoutes("genfn-missing-yields-body", "genfn: :yields requires a type keyword and body");
