const lyknIntrinsicTypeError0 = TypeError;
import {compile} from "lang/compiler.js";
const cli = "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn";
const home = Deno.cwd();
const decoder = new TextDecoder();
function demand(condition, message) {
  if (typeof condition !== "boolean") {
    throw new lyknIntrinsicTypeError0("demand: arg 'condition' expected boolean, got " + typeof condition);
  }
  if (typeof message !== "string") {
    throw new lyknIntrinsicTypeError0("demand: arg 'message' expected string, got " + typeof message);
  }
  if (!condition) {
    throw new Error(message);
  } else {
    return null;
  }
}
function capture(label, cwd, program, args) {
  if (typeof label !== "string") {
    throw new lyknIntrinsicTypeError0("capture: arg 'label' expected string, got " + typeof label);
  }
  if (typeof cwd !== "string") {
    throw new lyknIntrinsicTypeError0("capture: arg 'cwd' expected string, got " + typeof cwd);
  }
  if (typeof program !== "string") {
    throw new lyknIntrinsicTypeError0("capture: arg 'program' expected string, got " + typeof program);
  }
  const stem = home + "/receipts/" + label;
  Deno.writeTextFileSync(stem + ".command.json", JSON.stringify({ program: program, args: args, cwd: cwd, env: { DENO_DIR: Deno.env.get("DENO_DIR"), XDG_CACHE_HOME: Deno.env.get("XDG_CACHE_HOME"), NPM_CONFIG_CACHE: Deno.env.get("NPM_CONFIG_CACHE"), TMPDIR: Deno.env.get("TMPDIR") } }, null, 2));
  const command = new Deno.Command(program, { args: args, cwd: cwd, stdout: "piped", stderr: "piped" });
  const result = command.outputSync();
  Deno.writeFileSync(stem + ".stdout.txt", result.stdout);
  Deno.writeFileSync(stem + ".stderr.txt", result.stderr);
  Deno.writeTextFileSync(stem + ".status.txt", String(result.code));
  return result;
}
function runEsm(label, path, expected) {
  if (typeof label !== "string") {
    throw new lyknIntrinsicTypeError0("runEsm: arg 'label' expected string, got " + typeof label);
  }
  if (typeof path !== "string") {
    throw new lyknIntrinsicTypeError0("runEsm: arg 'path' expected string, got " + typeof path);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("runEsm: arg 'expected' expected string, got " + typeof expected);
  }
  const result = capture(label, home, Deno.execPath(), ["run", "--no-config", "--no-prompt", "--cached-only", path]);
  return demand((result.code === 0 && result.stderr.length === 0) && decoder.decode(result.stdout) === expected, label + " runtime mismatch");
}
function unitRoutes(stem, field, other, expected) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("unitRoutes: arg 'stem' expected string, got " + typeof stem);
  }
  if (typeof field !== "string") {
    throw new lyknIntrinsicTypeError0("unitRoutes: arg 'field' expected string, got " + typeof field);
  }
  if (typeof other !== "string") {
    throw new lyknIntrinsicTypeError0("unitRoutes: arg 'other' expected string, got " + typeof other);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("unitRoutes: arg 'expected' expected string, got " + typeof expected);
  }
  const source = home + "/fixtures/" + stem + ".lykn";
  for (const mode of ["checked", "stripped"]) {
    const label = stem + "-" + mode;
    const path = home + "/runtime/" + label + ".mjs";
    const args = ["compile", source, "-o", path];
    if (mode === "stripped") {
      args.push("--strip-assertions");
    }
    const result = capture(label + "-compile", home, cli, args);
    demand(result.code === 0, label + decoder.decode(result.stderr));
    const js = Deno.readTextFileSync(path);
    const dts = Deno.readTextFileSync(home + "/runtime/" + label + ".d.ts");
    demand(((js.includes(field) && !js.includes(other)) && dts.includes(field)) && !dts.includes(other), label + " paired metadata mismatch");
    runEsm(label + "-run", path, expected);
  }
  const jsonResult = capture(stem + "-json", home, cli, ["compile", source, "--kernel-json"]);
  demand(jsonResult.code === 0, stem + " JSON compile failed");
  Deno.writeFileSync(home + "/runtime/" + stem + ".kernel.json", jsonResult.stdout);
  const forms = JSON.parse(decoder.decode(jsonResult.stdout));
  const jsPath = home + "/runtime/" + stem + "-json-public.mjs";
  Deno.writeTextFileSync(jsPath, compile(forms));
  runEsm(stem + "-json-run", jsPath, expected);
  return console.log(stem, "JS/stripped/JSON/DTS pass");
}
unitRoutes("unit-a", "left", "right", "3\n");
unitRoutes("unit-b", "right", "left", "three\n");
const mismatch = capture("mismatch", home, cli, ["compile", home + "/fixtures/mismatch.lykn", "-o", home + "/runtime/mismatch.mjs"]);
const errorText = decoder.decode(mismatch.stderr);
demand(((mismatch.code === 1 && errorText.includes("age")) && errorText.includes("suggestion: change the type annotation")) && !errorText.includes("warning:"), "analysis failure adapter mismatch");
const recovered = capture("recovery", home, cli, ["compile", home + "/fixtures/unit-a.lykn", "-o", home + "/runtime/recovery.mjs"]);
demand(recovered.code === 0, "CLI recovery failed");
runEsm("recovery-run", home + "/runtime/recovery.mjs", "3\n");
const warnings = capture("compile-warnings", home, cli, ["compile", home + "/fixtures/warnings.lykn", "-o", home + "/runtime/warnings.mjs"]);
const warningText = decoder.decode(warnings.stderr);
demand((warnings.code === 0 && warningText.includes("unused binding 'unused'")) && warningText.includes(".d.ts will use"), "compile warning adapter mismatch");
const dist = capture("dist-warnings", "/private/tmp/lykn-b2b1-cdc/dist-warning", cli, ["dist"]);
const distText = decoder.decode(dist.stderr);
demand((dist.code === 0 && !distText.includes("unused binding 'unused'")) && distText.includes(".d.ts will use"), "dist warning asymmetry mismatch " + distText);
const distFailure = capture("dist-analysis-failure", "/private/tmp/lykn-b2b1-cdc/dist-failure", cli, ["dist"]);
const distError = decoder.decode(distFailure.stderr);
demand(((distFailure.code === 1 && distError.includes("mod.lykn")) && distError.includes("age")) && distError.includes("suggestion: change the type annotation"), "dist failure mismatch " + distError);
console.log("analysis failure/recovery/compile-dist warning asymmetry pass");
