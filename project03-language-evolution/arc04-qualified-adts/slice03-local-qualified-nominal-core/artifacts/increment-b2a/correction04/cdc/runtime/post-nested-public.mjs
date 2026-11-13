import {lykn} from "lang/mod.js";
try {
  lykn(Deno.readTextFileSync("fixtures/post-nested-negative.lykn"));
  throw new Error("nested block leaked into post scope");
} catch (failure) {
  Deno.writeTextFileSync("receipts/post-nested-public.diagnostic.txt", failure.message);
  (() => {
    if (!failure.message.includes("forbidden as a strict-mode binding identifier")) {
      throw failure;
    } else {
      return null;
    }
  })();
  console.log("nested block does not leak into post");
}
