type Option =
  | { tag: "Some"; value: unknown }
  | { tag: "None" };
type InnerValue =
  | { tag: "InnerNumber"; value: unknown }
  | { tag: "InnerFlag" };
type ZeroForms =
  | { tag: "ListZero" }
  | { tag: "BareZero" };
