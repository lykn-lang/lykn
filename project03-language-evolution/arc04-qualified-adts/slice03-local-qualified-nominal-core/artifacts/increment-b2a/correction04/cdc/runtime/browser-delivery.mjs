const lyknIntrinsicTypeError0 = TypeError;
import {compileLykn} from "browser/compiler.js";
const decoder = new TextDecoder();
function runBrowser(stem, expected) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("runBrowser: arg 'stem' expected string, got " + typeof stem);
  }
  if (typeof expected !== "string") {
    throw new lyknIntrinsicTypeError0("runBrowser: arg 'expected' expected string, got " + typeof expected);
  }
  const generated = compileLykn(Deno.readTextFileSync("fixtures/" + stem + ".lykn"));
  const path = Deno.cwd() + "/runtime/browser-materialized-" + stem + ".mjs";
  Deno.writeTextFileSync(path, generated);
  const args = ["run", "--no-config", "--no-prompt", "--cached-only", path];
  Deno.writeTextFileSync("receipts/browser-" + stem + ".command.json", JSON.stringify({ program: Deno.execPath(), args: args, cwd: Deno.cwd() }, null, 2));
  const command = new Deno.Command(Deno.execPath(), { args: args, stdout: "piped", stderr: "piped" });
  const result = command.outputSync();
  Deno.writeFileSync("receipts/browser-" + stem + ".stdout.txt", result.stdout);
  Deno.writeFileSync("receipts/browser-" + stem + ".stderr.txt", result.stderr);
  Deno.writeTextFileSync("receipts/browser-" + stem + ".status.txt", String(result.code));
  if (!((result.code === 0 && result.stderr.length === 0) && decoder.decode(result.stdout) === expected)) {
    throw new Error("browser mismatch " + stem);
  }
  return console.log(stem, "browser-compile/ESM pass");
}
runBrowser("browser-owned", "[[\"TypeError\",\"checkNumber: arg 'value' expected number, got string\"],[\"TypeError\",\"checkArray: arg 'value' expected array, got number\"],[\"Error\",\"match: no matching pattern\"]]\n");
runBrowser("genfn-protected-string-metadata", "41\n");
runBrowser("genfunc-protected-post", "[ 41 ]\n");
