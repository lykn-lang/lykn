export function slots(arg0_1: number, arg1: string, _value: number, arg0: number, arg2: string): unknown[];
export function beforeRequired(fixed: number, arg1: string | undefined, tail: boolean): void;
export function trailingDefault(fixed: number, arg1?: string): void;
export function restDefault(arg0?: number, ...values: string[]): void;
export function tupleBeforeRequired(arg0: [number | undefined, string]): void;
export function tupleTrailing(arg0: [number, (string | undefined)?, ...boolean[]]): void;
export function objectDefault(arg0: { _: number; label?: string | undefined }): void;
