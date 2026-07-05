// DD-37 M22-3b: shared helpers extracted from surface.js.
// Used by both surface.js (for forms not yet migrated) and
// classifier.js (for forms migrated to the new architecture).

import {
  sym,
  array,
  gensym,
  isKeyword,
  isArray,
  formatSExpr,
} from "./expander.js";
import { toJsIdentifier } from "./compiler.js";
import { markKernel } from "./kernel-mark.js";
// Param-shape sub-parsers (still in surface.js, not in this extraction set);
// parseTypedParams delegates to them, so import them to satisfy the move.
import {
  parseDestructuredParam,
  parseDefaultParam,
  parseRestParam,
} from "./surface.js";

// Re-export expander helpers for classifier.js convenience
export { sym, array, gensym, isKeyword, isArray, formatSExpr, toJsIdentifier };

const STATEMENT_ONLY_HEADS = [
  "while", "for", "for-of", "for-in", "do-while", "switch",
  "label", "debugger",
  "block", "try", "catch", "finally",
  "var", "const", "let",
  "func", "fn", "class", "type", "export", "import",
];

export function isStatementOnlyForm(expr) {
  if (!isArray(expr) || expr.values.length === 0) return false;
  const head = expr.values[0];
  if (!head || head.type !== "atom") return false;
  const name = head.value;
  if (name === "if") return expr.values.length < 4;
  return STATEMENT_ONLY_HEADS.includes(name);
}

export function wrapReturnLast(bodyForms) {
  if (bodyForms.length === 0) return [];
  const lastExpr = bodyForms[bodyForms.length - 1];
  if (isStatementOnlyForm(lastExpr)) {
    return [...bodyForms];
  }
  if (bodyForms.length === 1) return [array(sym("return"), bodyForms[0])];
  return [...bodyForms.slice(0, -1), array(sym("return"), lastExpr)];
}

/**
 * Build a list node marked as sanctioned kernel output (so it is not
 * re-classified/re-expanded and is exempt from DD-58 strict). Used by
 * `compileLetPattern`. (DD-37 step 4 — was a mutated per-node kernel marker.)
 * @param {...*} items
 * @returns {object}
 */
export function kernelArray(...items) {
  return markKernel(array(...items));
}

// --- Shared Helpers ---

export function isPascalCase(name) {
	return name.length > 0 && name[0] >= "A" && name[0] <= "Z";
}

/**
 * Build an && chain from an array of check AST nodes.
 */
export function andChain(checks) {
	if (checks.length === 0) return null;
	if (checks.length === 1) return checks[0];
	let result = checks[0];
	for (let i = 1; i < checks.length; i++) {
		result = array(sym("&&"), result, checks[i]);
	}
	return result;
}

/**
 * Determine the static type of a literal AST node, or null if not a literal.
 */
export function getLiteralType(node) {
	if (node.type === "number") return "number";
	if (node.type === "string") return "string";
	if (node.type === "atom") {
		if (node.value === "true" || node.value === "false") return "boolean";
		if (node.value === "null") return "null";
		if (node.value === "undefined") return "undefined";
		if (node.value === "NaN") return "NaN";
	}
	// #a(...) array literal — classified as a list with head "array"
	if (
		node.type === "list" &&
		node.values.length > 0 &&
		node.values[0].type === "atom" &&
		node.values[0].value === "array"
	)
		return "array";
	// (obj ...) — classified as a list with head "obj"
	if (
		node.type === "list" &&
		node.values.length > 0 &&
		node.values[0].type === "atom" &&
		node.values[0].value === "obj"
	)
		return "object";
	return null;
}

/**
 * Check if a type annotation matches a statically known literal type.
 */
export function typeMatchesLiteral(typeName, literalType) {
	if (literalType === "NaN") return false; // NaN fails :number
	if (literalType === "null") return false; // null fails :object
	if (literalType === "undefined") return false; // undefined fails everything
	return typeName === literalType;
}

/**
 * Build a type check assertion for a parameter.
 * Returns a kernel (if (check) (throw (new TypeError msg))) form, or null for :any.
 */
export function buildTypeCheck(paramNode, typeKw, funcName, label) {
	const typeName = typeKw.value;
	if (typeName === "any") return null;

	const paramName = paramNode.value;
	const hasPunct = (s) => /[^a-zA-Z0-9_-]/.test(s);
	const jsFuncName = toJsIdentifier(funcName);
	const dispFunc = jsFuncName !== funcName && hasPunct(funcName) ? `${jsFuncName} (${funcName})` : jsFuncName;
	const jsParamName = toJsIdentifier(paramName);
	const dispParam = jsParamName !== paramName && hasPunct(paramName) ? `${jsParamName} (${paramName})` : jsParamName;
	const msgText = label === "return"
		? `${dispFunc}: return value expected ${typeName}, got `
		: label
			? `${dispFunc}: ${label} '${dispParam}' expected ${typeName}, got `
			: `${dispFunc} '${dispParam}': expected ${typeName}, got `;
	const msg = {
		type: "string",
		value: msgText,
	};
	const typeofParam = array(sym("typeof"), paramNode);
	const errorMsg = array(sym("+"), msg, typeofParam);
	const throwStmt = array(
		sym("throw"),
		array(sym("new"), sym("TypeError"), errorMsg),
	);

	let check;
	switch (typeName) {
		case "number":
			check = array(
				sym("||"),
				array(sym("!=="), typeofParam, { type: "string", value: "number" }),
				array(sym("Number:isNaN"), paramNode),
			);
			break;
		case "string":
			check = array(sym("!=="), typeofParam, {
				type: "string",
				value: "string",
			});
			break;
		case "boolean":
			check = array(sym("!=="), typeofParam, {
				type: "string",
				value: "boolean",
			});
			break;
		case "function":
			check = array(sym("!=="), typeofParam, {
				type: "string",
				value: "function",
			});
			break;
		case "object":
			check = array(
				sym("||"),
				array(sym("!=="), typeofParam, { type: "string", value: "object" }),
				array(sym("==="), paramNode, sym("null")),
			);
			break;
		case "array":
			check = array(sym("!"), array(sym("Array:isArray"), paramNode));
			break;
		case "symbol":
			check = array(sym("!=="), typeofParam, {
				type: "string",
				value: "symbol",
			});
			break;
		case "bigint":
			check = array(sym("!=="), typeofParam, {
				type: "string",
				value: "bigint",
			});
			break;
		default:
			// User-defined type — check for tagged object
			check = array(
				sym("||"),
				array(sym("!=="), typeofParam, { type: "string", value: "object" }),
				array(
					sym("||"),
					array(sym("==="), paramNode, sym("null")),
					array(
						sym("!"),
						array(sym("in"), { type: "string", value: "tag" }, paramNode),
					),
				),
			);
			break;
	}

	return array(sym("if"), check, throwStmt);
}

// --- Param shape helpers ---

/** Get kernel param name nodes for a function signature. */
export function paramNameNodes(p) {
	if (p.destructured) {
		if (p.kind === "object") {
			const elems = p.fields.map((f) => {
				if (f.nested) {
					const innerKernel = paramNameNodes(f.pattern)[0];
					if (f.alias) {
						return array(sym("alias"), f.alias, innerKernel);
					}
					return innerKernel;
				}
				if (f.defaultValue) {
					return array(sym("default"), f.name, f.defaultValue);
				}
				return f.name;
			});
			return [array(sym("object"), ...elems)];
		}
		if (p.kind === "array") {
			const elems = p.fields.map((f) => {
				if (f.skip) return sym("_");
				if (f.nested) {
					const innerKernel = paramNameNodes(f.pattern)[0];
					if (f.alias) {
						return array(sym("alias"), f.alias, innerKernel);
					}
					return innerKernel;
				}
				if (f.defaultValue) return array(sym("default"), f.name, f.defaultValue);
				return f.name;
			});
			if (p.rest) {
				elems.push(array(sym("rest"), p.rest.name));
			}
			return [array(sym("array"), ...elems)];
		}
	}
	// Simple param — handle default and rest
	if (p.defaultValue) {
		return [array(sym("default"), p.name, p.defaultValue)];
	}
	if (p.isRest) {
		return [array(sym("rest"), p.name)];
	}
	return [p.name];
}

/** Get type check assertions for a param. */
export function paramTypeChecks(p, funcName) {
	if (p.destructured) {
		const checks = [];
		const allFields = [
			...p.fields.filter((f) => !f.skip),
			...(p.rest ? [p.rest] : []),
		];
		for (const f of allFields) {
			if (f.nested) {
				// Recurse into nested pattern for leaf-level checks
				checks.push(...paramTypeChecks(f.pattern, funcName));
				// Type-check the alias binding itself if not :any
				if (f.typeKw && f.typeKw.value !== "any") {
					const check = buildTypeCheck(f.alias, f.typeKw, funcName, "arg");
					if (check) checks.push(check);
				}
				continue;
			}
			const check = buildTypeCheck(f.name, f.typeKw, funcName, "arg");
			if (check) checks.push(check);
		}
		return checks;
	}
	// Rest param: per-element type check via for-of loop
	if (p.isRest) {
		if (p.typeKw.value === "any") return [];
		const elVar = gensym("el");
		const innerCheck = buildTypeCheck(elVar, p.typeKw, funcName, "rest arg");
		if (!innerCheck) return [];
		return [array(sym("for-of"), elVar, p.name, innerCheck)];
	}
	const check = buildTypeCheck(p.name, p.typeKw, funcName, "arg");
	return check ? [check] : [];
}

/**
 * Compile a match pattern against a target symbol.
 * Returns { checks: AST[], bindings: AST[] }.
 * checks are conditions (to be &&'d together).
 * bindings are (const ...) forms.
 */
export function compilePattern(pattern, targetSym) {
	// Wildcard
	if (pattern.type === "atom" && pattern.value === "_") {
		return { checks: [], bindings: [] };
	}

	// Literal: number
	if (pattern.type === "number") {
		return {
			checks: [array(sym("==="), targetSym, pattern)],
			bindings: [],
		};
	}

	// Literal: string
	if (pattern.type === "string") {
		return {
			checks: [array(sym("==="), targetSym, pattern)],
			bindings: [],
		};
	}

	// Literal: keyword → string comparison
	if (pattern.type === "keyword") {
		return {
			checks: [
				array(sym("==="), targetSym, { type: "string", value: pattern.value }),
			],
			bindings: [],
		};
	}

	// Literal atoms: true, false, null, undefined
	if (
		pattern.type === "atom" &&
		(pattern.value === "true" ||
			pattern.value === "false" ||
			pattern.value === "null" ||
			pattern.value === "undefined")
	) {
		return {
			checks: [array(sym("==="), targetSym, pattern)],
			bindings: [],
		};
	}

	// Zero-field ADT constructor (PascalCase bare atom)
	if (pattern.type === "atom" && isPascalCase(pattern.value)) {
		return {
			checks: [
				array(sym("==="), sym(`${targetSym.value}:tag`), {
					type: "string",
					value: pattern.value,
				}),
			],
			bindings: [],
		};
	}

	// Simple binding (lowercase bare atom, not wildcard)
	if (pattern.type === "atom") {
		return {
			checks: [],
			bindings: [array(sym("const"), pattern, targetSym)],
		};
	}

	// List patterns
	if (pattern.type === "list" && pattern.values.length > 0) {
		const head = pattern.values[0];

		// Structural obj pattern: (obj :key binding :key binding ...)
		if (head.type === "atom" && head.value === "obj") {
			const checks = [
				array(sym("==="), array(sym("typeof"), targetSym), {
					type: "string",
					value: "object",
				}),
				array(sym("!=="), targetSym, sym("null")),
			];
			const bindings = [];
			const pairs = pattern.values.slice(1);
			for (let i = 0; i < pairs.length; i += 2) {
				const key = pairs[i];
				const binding = pairs[i + 1];
				if (!isKeyword(key)) {
					throw new Error(
						`match obj pattern: expected keyword, got ${key?.type}`,
					);
				}
				const keyStr = { type: "string", value: key.value };
				checks.push(array(sym("in"), keyStr, targetSym));
				// If binding is a literal, add equality check instead of binding
				if (
					binding.type === "number" ||
					binding.type === "string" ||
					(binding.type === "atom" &&
						(binding.value === "true" ||
							binding.value === "false" ||
							binding.value === "null"))
				) {
					checks.push(
						array(sym("==="), sym(`${targetSym.value}:${key.value}`), binding),
					);
				} else if (binding.type === "atom" && binding.value !== "_") {
					bindings.push(
						array(
							sym("const"),
							binding,
							sym(`${targetSym.value}:${key.value}`),
						),
					);
				}
				// _ in obj pattern — just check key exists, no binding
			}
			return { checks, bindings };
		}

		// ADT constructor pattern: (ConstructorName binding1 binding2 ...)
		if (head.type === "atom" && isPascalCase(head.value)) {
			const ctorName = head.value;
			const fieldNames = typeRegistry.get(ctorName);
			const patternBindings = pattern.values.slice(1);

			const checks = [
				array(sym("==="), sym(`${targetSym.value}:tag`), {
					type: "string",
					value: ctorName,
				}),
			];
			const bindings = [];

			if (fieldNames) {
				// Type registry available — use named field access
				for (let i = 0; i < patternBindings.length; i++) {
					const fieldName = fieldNames[i];
					if (!fieldName) break;
					const binding = patternBindings[i];
					const fieldAccess = sym(`${targetSym.value}:${fieldName}`);

					if (binding.type === "atom" && binding.value === "_") {
						// Wildcard — no binding
					} else if (
						binding.type === "list" &&
						binding.values.length > 0 &&
						isPascalCase(binding.values[0].value)
					) {
						// Nested ADT pattern
						const nestedTarget = gensym("t");
						bindings.push(array(sym("const"), nestedTarget, fieldAccess));
						const nested = compilePattern(binding, nestedTarget);
						checks.push(...nested.checks);
						bindings.push(...nested.bindings);
					} else if (binding.type === "atom") {
						bindings.push(array(sym("const"), binding, fieldAccess));
					} else {
						// Literal in pattern position — equality check
						checks.push(array(sym("==="), fieldAccess, binding));
					}
				}
			} else {
				// No type registry — positional field access via Object.values
				// This is a fallback; with type registry it shouldn't happen for well-typed code
				for (let i = 0; i < patternBindings.length; i++) {
					const binding = patternBindings[i];
					const fieldAccess = array(
						sym("get"),
						array(sym("Object:values"), targetSym),
						{ type: "number", value: i + 1 },
					); // +1 to skip tag
					if (binding.type === "atom" && binding.value !== "_") {
						bindings.push(array(sym("const"), binding, fieldAccess));
					}
				}
			}

			return { checks, bindings };
		}
	}

	throw new Error(`match: unrecognized pattern: ${formatSExpr(pattern)}`);
}

export function compileLetPattern(pattern, tempVar) {
	if (
		isArray(pattern) &&
		pattern.values.length > 0 &&
		pattern.values[0].type === "atom" &&
		isPascalCase(pattern.values[0].value)
	) {
		const { checks, bindings } = compilePattern(pattern, tempVar);
		return { condition: andChain(checks), bindings };
	}
	if (
		isArray(pattern) &&
		pattern.values.length > 0 &&
		pattern.values[0].type === "atom" &&
		pattern.values[0].value === "obj"
	) {
		const { checks, bindings } = compilePattern(pattern, tempVar);
		return { condition: andChain(checks), bindings };
	}
	if (pattern.type === "atom" && !isPascalCase(pattern.value)) {
		const condition = kernelArray(sym("!="), tempVar, sym("null"));
		const bindings = [array(sym("const"), pattern, tempVar)];
		return { condition, bindings };
	}
	return null;
}

/**
 * Parse typed parameter list: (:type name :type name ...) → [{typeKw, name}, ...]
 * Also accepts destructuring patterns, (default ...), and (rest ...).
 */
export function parseTypedParams(paramList) {
	const params = [];
	const values = paramList.values;
	let i = 0;
	while (i < values.length) {
		if (isArray(values[i])) {
			const headVal = values[i].values[0];
			const headName = headVal?.type === "atom" ? headVal.value : "";
			if (headName === "object" || headName === "array") {
				params.push(parseDestructuredParam(values[i]));
			} else if (headName === "default") {
				params.push(parseDefaultParam(values[i]));
			} else if (headName === "rest") {
				params.push(parseRestParam(values[i]));
			} else {
				throw new Error(
					`expected 'object', 'array', 'default', or 'rest' at head of sub-form in :args, got '${headName || values[i].type}'`,
				);
			}
			i += 1;
		} else if (isKeyword(values[i])) {
			// Simple param — :type name pair
			if (i + 1 >= values.length) {
				throw new Error(
					`type keyword :${values[i].value} has no parameter name`,
				);
			}
			params.push({ typeKw: values[i], name: values[i + 1] });
			i += 2;
		} else {
			throw new Error(
				`expected type keyword or sub-form at position ${i}, got ${values[i]?.type ?? "nothing"}`,
			);
		}
	}
	// Validate rest constraints
	const restParams = params.filter((p) => p.isRest);
	if (restParams.length > 1) {
		throw new Error("only one rest parameter allowed");
	}
	if (restParams.length === 1) {
		const lastParam = params[params.length - 1];
		if (!lastParam.isRest) {
			throw new Error("rest parameter must be the last parameter");
		}
	}
	return params;
}

// --- Type Registry ---
// Maps constructor names to their field names, populated by `type` macro.
// Used by `match` and `if-let`/`when-let` to resolve ADT pattern field bindings.
export const typeRegistry = new Map();
