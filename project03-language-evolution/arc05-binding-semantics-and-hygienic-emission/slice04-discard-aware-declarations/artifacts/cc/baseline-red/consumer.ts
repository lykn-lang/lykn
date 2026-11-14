import type { ignore } from "./generated.d.ts";
type Ignore = typeof ignore;
declare const callIgnore: Ignore;
callIgnore(1, "text");
