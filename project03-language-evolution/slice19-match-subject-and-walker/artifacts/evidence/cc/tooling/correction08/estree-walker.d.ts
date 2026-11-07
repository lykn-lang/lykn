type FieldRole =
  | { tag: "ReferenceRole" }
  | { tag: "BindingRole" }
  | { tag: "NameRole" }
  | { tag: "DeferredRole" };
export function walkProgram(program: unknown): unknown;
