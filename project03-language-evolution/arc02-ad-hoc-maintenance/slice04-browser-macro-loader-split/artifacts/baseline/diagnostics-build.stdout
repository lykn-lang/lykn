function diagnose(source) {
  if (typeof source !== "string") {
    throw new TypeError("diagnose: arg 'source' expected string, got " + typeof source);
  }
  try {
    return ["ok", lykn.compile(source)];
  } catch (caught) {
    return [caught.name, caught.message];
  }
}
const specimens = ["(import-macros)", "(import-macros 1 (witness))", "(import-macros \"./x.lykn\" witness)", "(import-macros \"./x.lykn\" (witness))", "(import-macros \"../x.lykn\" (witness))", "(import-macros \"/x.lykn\" (witness))", "(import-macros \"bare\" (witness))", "(import-macros \"file:///x.lykn\" (witness))", "(import-macros \"file://%\" (witness))", "(import-macros \"jsr:@fixture/witness\" (witness))", "(import-macros \"npm:witness\" (witness))", "(import-macros \"http://127.0.0.1/witness.lykn\" (witness))", "(import-macros \"https://example.invalid/witness.lykn\" (witness))", "(import-macros \"FILE:///x.lykn\" (witness))", "(+ 1 2)"];
document.getElementById("report")["textContent"] = JSON.stringify(specimens.map(diagnose));
