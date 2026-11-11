type JsonValue =
  | { tag: "JsonNull" }
  | { tag: "JsonBoolean"; value: boolean }
  | { tag: "JsonNumber"; value: number }
  | { tag: "JsonString"; value: string }
  | { tag: "JsonArray"; items: unknown[] }
  | { tag: "JsonObject"; entries: unknown[] };
type JsonEntry = { tag: "JsonField"; key: string; value: JsonValue };
type OtherValue = { tag: "Other" };
