const lyknIntrinsicTypeError0 = TypeError;
const cli = "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn";
const decoder = new TextDecoder();
function capture(label, program, args) {
  if (typeof label !== "string") {
    throw new lyknIntrinsicTypeError0("capture: arg 'label' expected string, got " + typeof label);
  }
  if (typeof program !== "string") {
    throw new lyknIntrinsicTypeError0("capture: arg 'program' expected string, got " + typeof program);
  }
  const stem = "receipts/" + label;
  Deno.writeTextFileSync(stem + ".command.json", JSON.stringify({ program: program, args: args, cwd: Deno.cwd(), environment: { DENO_DIR: Deno.env.get("DENO_DIR"), XDG_CACHE_HOME: Deno.env.get("XDG_CACHE_HOME"), NPM_CONFIG_CACHE: Deno.env.get("NPM_CONFIG_CACHE"), TMPDIR: Deno.env.get("TMPDIR") } }, null, 2));
  const command = new Deno.Command(program, { args: args, stdout: "piped", stderr: "piped" });
  const result = command.outputSync();
  Deno.writeFileSync(stem + ".stdout.txt", result.stdout);
  Deno.writeFileSync(stem + ".stderr.txt", result.stderr);
  Deno.writeTextFileSync(stem + ".status.txt", String(result.code));
  if (result.code !== 0) {
    throw new Error(label + " " + decoder.decode(result.stderr));
  }
  return result;
}
function runtimeRoutes(stem, expected) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("runtimeRoutes: arg 'stem' expected string, got " + typeof stem);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("runtimeRoutes: arg 'expected' expected string, got " + typeof expected);
  }
  const source = Deno.cwd() + "/fixtures/" + stem + ".lykn";
  for (const mode of ["checked", "stripped"]) {
    const label = stem + "-" + mode;
    const output = Deno.cwd() + "/runtime/" + label + ".mjs";
    const args = ["compile", source, "-o", output];
    if (mode === "stripped") {
      args.push("--strip-assertions");
    }
    capture(label + "-compile", cli, args);
    const result = capture(label + "-run", Deno.execPath(), ["run", "--no-config", "--no-prompt", "--cached-only", output]);
    const text = decoder.decode(result.stdout);
    if (text !== expected) {
      throw new Error(label + " unexpected stdout " + text);
    }
    if (result.stderr.length !== 0) {
      throw new Error(label + " unexpected runtime stderr");
    }
  }
  capture(stem + "-check", cli, ["check", source]);
  return console.log(stem, "checked/stripped/runtime/check pass");
}
runtimeRoutes("native-clause-runtime", "11\n42\n");
runtimeRoutes("native-class-runtime", "7\n42\n");
runtimeRoutes("native-post-before", "true\n");
runtimeRoutes("native-post-after", "true\n");
runtimeRoutes("native-member-wrappers", "40\n7\n42\n42\n41\n43\n[1,2]\n");
runtimeRoutes("genfn-protected-string-metadata", "41\n");
runtimeRoutes("genfunc-protected-post", "[ 41 ]\n");
