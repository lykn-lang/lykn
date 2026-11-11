type ControlJson =
  | { tag: "ControlNull" }
  | { tag: "ControlNumber"; value: number }
  | { tag: "ControlArray"; values: unknown[] };
type OtherTag = { tag: "OtherTag"; id: number };
type NestedResult =
  | { tag: "NestedSome"; value: unknown }
  | { tag: "NestedNone" };
type InnerNumber = { tag: "InnerNumber"; value: number };
