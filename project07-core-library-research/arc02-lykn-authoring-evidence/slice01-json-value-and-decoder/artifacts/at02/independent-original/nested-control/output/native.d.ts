type Option =
  | { tag: "Some"; value: unknown }
  | { tag: "None" };
type InnerValue = { tag: "InnerNumber"; value: number };
