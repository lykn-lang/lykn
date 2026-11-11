const planning = "/Users/oubiwann/lab/lykn/lang/.worktrees/planning";
const slice = "project07-core-library-research/arc02-lykn-authoring-evidence/slice01-json-value-and-decoder";
for (const doc of ["cdc-verification.md", "ledger.md", "closing-report.md"]) {
  const relative = `${slice}/${doc}`;
  const text = Deno.readTextFileSync(`${planning}/${relative}`);
  const matches = text.matchAll(new RegExp("\\[[^\\]]*\\]\\(([^)]+)\\)", "g"));
  for (const match of matches) {
    const target = match[1];
    if (target.startsWith("#") || target.includes("://")) {
      continue;
    }
    const url = new URL(target, `file://${planning}/${relative}`);
    Deno.statSync(url);
    const file = url.pathname.slice(planning.length + 1);
    const command = new Deno.Command("/usr/bin/git", { args: ["-C", planning, "ls-files", "--error-unmatch", file], stdout: "piped", stderr: "piped" });
    const output = command.outputSync();
    if (!(output.code === 0)) {
      throw new Error(`untracked target ${file}`);
    }
    console.log(doc, target, "tracked");
  }
}
