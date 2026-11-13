const lyknIntrinsicTypeError0 = TypeError;
import {lykn, read} from "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
import {validateProtectedHost} from "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/protected-host.js";
import {toJsIdentifier, formHead} from "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/compiler.js";
function directPolicy(stem) {
  if (typeof stem !== "string") {
    throw new lyknIntrinsicTypeError0("directPolicy: arg 'stem' expected string, got " + typeof stem);
  }
  const source = Deno.readTextFileSync("fixtures/" + stem + ".lykn");
  try {
    validateProtectedHost(read(source), { toJsIdentifier: toJsIdentifier, formHead: formHead });
    Deno.writeTextFileSync("receipts/public-direct-" + stem + ".txt", "accepted");
    console.log(stem, "direct-accepted");
  } catch (failure) {
    Deno.writeTextFileSync("receipts/public-direct-" + stem + ".txt", failure.message);
    console.log(stem, failure.message);
  }
}
directPolicy("genfn-protected-string-metadata");
directPolicy("genfn-protected-string-body");
const metadata = Deno.readTextFileSync("fixtures/genfn-protected-string-metadata.lykn");
Deno.writeTextFileSync("runtime/public-genfn-protected-string-metadata.mjs", lykn(metadata));
console.log("public metadata compiled");
try {
  lykn(Deno.readTextFileSync("fixtures/genfn-protected-string-body.lykn"));
  throw new Error("unexpected actual body accepted");
} catch (failure) {
  Deno.writeTextFileSync("receipts/public-actual-genfn-protected-string-body.txt", failure.message);
  (() => {
    if (!failure.message.includes("host-contract v2: write to protected slot Array.isArray")) {
      throw failure;
    } else {
      return null;
    }
  })();
  console.log("public actual body rejected");
}
