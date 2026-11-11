type JsonValue =
  | { tag: "JNull" }
  | { tag: "JBoolean"; value: boolean }
  | { tag: "JNumber"; value: number }
  | { tag: "JString"; value: string }
  | { tag: "JArray"; values: unknown[] }
  | { tag: "JObject"; entries: unknown[] };
type HostValue = { tag: "JUndefined" };
type JsonEntry = { tag: "Entry"; key: string; value: unknown };
type Option =
  | { tag: "Some"; value: unknown }
  | { tag: "None" };
type DecodeFailure =
  | { tag: "WrongValue"; path: string; expected: string }
  | { tag: "MissingField"; path: string }
  | { tag: "InvalidPort"; path: string; value: number };
type DecodeResult =
  | { tag: "Decoded"; value: unknown }
  | { tag: "Rejected"; failure: unknown };
type Label =
  | { tag: "LabelMissing" }
  | { tag: "LabelNull" }
  | { tag: "LabelText"; value: string };
type Config = { tag: "ServerConfig"; port: number; label: unknown };
