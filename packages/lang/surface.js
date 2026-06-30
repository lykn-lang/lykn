/**
 * @module
 * lykn surface form macros.
 * Each macro transforms surface syntax to kernel forms (DD-01 through DD-09).
 * These are the JS reference implementation; the Rust compiler will produce
 * identical expansions as static transforms.
 */

import {
	sym,
	array,
	gensym,
	isKeyword,
	isArray,
} from "./expander.js";
import { typeRegistry } from "./surface-helpers.js";


export function resetTypeRegistry() {
	typeRegistry.clear();
	// Pre-populate with blessed prelude types (DD-17)
	typeRegistry.set("Some", ["value"]);
	typeRegistry.set("None", []);
	typeRegistry.set("Ok", ["value"]);
	typeRegistry.set("Err", ["error"]);
}







/**
 * Parse a destructuring pattern list: (object :type name ...) or (array :type name ...)
 * Returns { destructured: true, kind, fields, rest? }
 */
export function parseDestructuredParam(listNode) {
	const values = listNode.values;
	if (values.length === 0) {
		throw new Error(
			"empty destructuring pattern — at least one field required",
		);
	}
	const head = values[0];
	if (head.type !== "atom" || (head.value !== "object" && head.value !== "array")) {
		throw new Error(
			`expected 'object' or 'array' at head of destructuring pattern, got '${head.value ?? head.type}'`,
		);
	}
	const kind = head.value;
	const inner = values.slice(1);

	if (inner.length === 0) {
		throw new Error(
			"empty destructuring pattern — at least one field required",
		);
	}

	if (kind === "object") {
		return parseObjectDestructure(inner, listNode);
	}
	return parseArrayDestructure(inner, listNode);
}

export function parseObjectDestructure(values, _parentNode) {
	const fields = [];
	let i = 0;
	while (i < values.length) {
		const cur = values[i];
		// Check for deferred features in type position
		if (isArray(cur)) {
			const headVal = cur.values[0];
			const headName = headVal?.type === "atom" ? headVal.value : "";
			if (headName === "default") {
				if (cur.values.length !== 4) {
					throw new Error(
						"default in destructured params requires 3 arguments: (default :type name value)",
					);
				}
				const defTypeKw = cur.values[1];
				const defName = cur.values[2];
				const defValue = cur.values[3];
				if (!isKeyword(defTypeKw)) {
					throw new Error("default: first argument must be a type keyword");
				}
				if (defName.type !== "atom") {
					throw new Error("default: second argument must be a parameter name");
				}
				fields.push({ typeKw: defTypeKw, name: defName, defaultValue: defValue });
				i += 1;
				continue;
			}
			if (headName === "alias") {
				// (alias :type alias-name (object/array ...))
				if (cur.values.length < 4) {
					throw new Error(
						"alias in destructured params requires: (alias :type name (object/array ...))",
					);
				}
				const aliasTypeKw = cur.values[1];
				const aliasName = cur.values[2];
				const innerPattern = cur.values[3];
				if (!isKeyword(aliasTypeKw)) {
					throw new Error("alias: first argument must be a type keyword");
				}
				if (aliasName.type !== "atom") {
					throw new Error("alias: second argument must be a name");
				}
				if (!isArray(innerPattern)) {
					throw new Error(
						"alias: third argument must be a destructuring pattern (object/array ...)",
					);
				}
				const nestedParam = parseDestructuredParam(innerPattern);
				fields.push({
					nested: true,
					alias: aliasName,
					typeKw: aliasTypeKw,
					pattern: nestedParam,
				});
				i += 1;
				continue;
			}
			if (headName === "object" || headName === "array") {
				throw new Error(
					"nested pattern in object destructuring must use alias to specify the property name: (alias :type name (object/array ...))",
				);
			}
			throw new Error(
				`expected type keyword at position ${i} in destructuring pattern`,
			);
		}
		if (!isKeyword(cur)) {
			if (cur.type === "atom") {
				throw new Error(
					`field '${cur.value}' missing type annotation (use :any to opt out)`,
				);
			}
			throw new Error(
				`expected type keyword at position ${i} in destructuring pattern`,
			);
		}
		if (i + 1 >= values.length) {
			throw new Error(
				`type keyword :${cur.value} has no field name in destructuring pattern`,
			);
		}
		const nameNode = values[i + 1];
		if (isArray(nameNode)) {
			throw new Error("field name must be an atom");
		}
		if (nameNode.type !== "atom") {
			throw new Error("field name must be an atom");
		}
		fields.push({ typeKw: cur, name: nameNode });
		i += 2;
	}
	return { destructured: true, kind: "object", fields };
}

export function parseArrayDestructure(values, _parentNode) {
	const fields = [];
	let rest = null;
	let i = 0;
	while (i < values.length) {
		const cur = values[i];
		// Skip element: _
		if (cur.type === "atom" && cur.value === "_") {
			fields.push({ skip: true, name: cur });
			i += 1;
			continue;
		}
		// Rest element: (rest :type name)
		if (isArray(cur)) {
			const headVal = cur.values[0];
			const headName = headVal?.type === "atom" ? headVal.value : "";
			if (headName === "rest") {
				if (cur.values.length !== 3) {
					throw new Error("rest element must be (rest :type name)");
				}
				if (i + 1 !== values.length) {
					throw new Error(
						"rest element must be last in array destructuring",
					);
				}
				if (!isKeyword(cur.values[1])) {
					throw new Error("rest element must be (rest :type name)");
				}
				if (cur.values[2].type !== "atom") {
					throw new Error("rest element must be (rest :type name)");
				}
				rest = { typeKw: cur.values[1], name: cur.values[2] };
				i += 1;
				continue;
			}
			if (headName === "default") {
				if (cur.values.length !== 4) {
					throw new Error(
						"default in destructured params requires 3 arguments: (default :type name value)",
					);
				}
				const defTypeKw = cur.values[1];
				const defName = cur.values[2];
				const defValue = cur.values[3];
				if (!isKeyword(defTypeKw)) {
					throw new Error("default: first argument must be a type keyword");
				}
				if (defName.type !== "atom") {
					throw new Error("default: second argument must be a parameter name");
				}
				fields.push({ typeKw: defTypeKw, name: defName, defaultValue: defValue });
				i += 1;
				continue;
			}
			if (headName === "object" || headName === "array") {
				// Positional nested pattern — no alias needed in array context
				const nestedParam = parseDestructuredParam(cur);
				fields.push({
					nested: true,
					alias: null,
					typeKw: null,
					pattern: nestedParam,
				});
				i += 1;
				continue;
			}
			if (headName === "alias") {
				if (cur.values.length < 4) {
					throw new Error(
						"alias in destructured params requires: (alias :type name (object/array ...))",
					);
				}
				const aliasTypeKw = cur.values[1];
				const aliasName = cur.values[2];
				const innerPattern = cur.values[3];
				if (!isKeyword(aliasTypeKw)) {
					throw new Error("alias: first argument must be a type keyword");
				}
				if (aliasName.type !== "atom") {
					throw new Error("alias: second argument must be a name");
				}
				if (!isArray(innerPattern)) {
					throw new Error(
						"alias: third argument must be a destructuring pattern (object/array ...)",
					);
				}
				const nestedParam = parseDestructuredParam(innerPattern);
				fields.push({
					nested: true,
					alias: aliasName,
					typeKw: aliasTypeKw,
					pattern: nestedParam,
				});
				i += 1;
				continue;
			}
			throw new Error(
				`unexpected list in array destructuring at position ${i}`,
			);
		}
		// Typed element: :type name
		if (isKeyword(cur)) {
			if (i + 1 >= values.length) {
				throw new Error(
					`type keyword :${cur.value} has no element name`,
				);
			}
			const nameNode = values[i + 1];
			if (nameNode.type !== "atom") {
				throw new Error("element name must be an atom");
			}
			fields.push({ typeKw: cur, name: nameNode });
			i += 2;
			continue;
		}
		// Bare name without type keyword
		if (cur.type === "atom") {
			throw new Error(
				`field '${cur.value}' missing type annotation (use :any to opt out)`,
			);
		}
		throw new Error(
			`expected type keyword, _, or (rest ...) at position ${i} in array destructuring`,
		);
	}
	return { destructured: true, kind: "array", fields, rest };
}




/** Get all bound name nodes for a param. */
export function paramBoundNames(p) {
	if (p.destructured) {
		const names = [];
		for (const f of p.fields) {
			if (f.skip) continue;
			if (f.nested) {
				if (f.alias) names.push(f.alias);
				names.push(...paramBoundNames(f.pattern));
				continue;
			}
			names.push(f.name);
		}
		if (p.rest) names.push(p.rest.name);
		return names;
	}
	return [p.name];
}

/**
 * Parse a top-level (default :type name value) in :args.
 */
export function parseDefaultParam(listNode) {
	const vals = listNode.values;
	if (vals.length !== 4) {
		throw new Error(
			"(default) in :args requires exactly 3 elements: :type name value",
		);
	}
	if (!isKeyword(vals[1])) {
		throw new Error("(default) first element must be a type keyword");
	}
	if (vals[2].type !== "atom") {
		throw new Error("(default) second element must be a name");
	}
	return { typeKw: vals[1], name: vals[2], defaultValue: vals[3] };
}

/**
 * Parse a top-level (rest :type name) in :args.
 */
export function parseRestParam(listNode) {
	const vals = listNode.values;
	if (vals.length !== 3) {
		throw new Error(
			"(rest) in :args requires exactly 2 elements: :type name",
		);
	}
	if (!isKeyword(vals[1])) {
		throw new Error("(rest) first element must be a type keyword");
	}
	if (vals[2].type !== "atom") {
		throw new Error("(rest) second element must be a name");
	}
	return { typeKw: vals[1], name: vals[2], isRest: true };
}















export function registerSurfaceMacros(macroEnv) {
	// --- Shared helpers (scoped to registerSurfaceMacros for access to sym, array, etc.) ---

	// DD-37 M22-3b: STATEMENT_ONLY_HEADS, isStatementOnlyForm, wrapReturnLast
	// extracted to surface-helpers.js (imported at module level).

	/**
	 * Build a threading expression (thread-first or thread-last).
	 * position: 'first' — insert threaded as first arg after fn
	 * position: 'last'  — insert threaded as last arg
	 */
	function buildThread(args, position) {
		if (args.length < 2) {
			const name = position === "first" ? "->" : "->>";
			throw new Error(`${name} requires at least 2 arguments: (${name} value step...)`);
		}
		let threaded = args[0];
		for (let i = 1; i < args.length; i++) {
			const step = args[i];
			if (isKeyword(step)) {
				threaded = array(sym("."), threaded, sym(step.value));
			} else if (isArray(step) && step.values.length > 0 && isKeyword(step.values[0])) {
				const [kw, ...rest] = step.values;
				threaded = array(sym("."), threaded, sym(kw.value), ...rest);
			} else if (isArray(step)) {
				if (position === "first") {
					const [fn, ...rest] = step.values;
					threaded = array(fn, threaded, ...rest);
				} else {
					threaded = array(...step.values, threaded);
				}
			} else {
				threaded = array(step, threaded);
			}
		}
		return threaded;
	}

	/**
	 * Build a nil-safe threading expression (some-> or some->>).
	 * position: 'first' or 'last' — same insertion semantics as buildThread.
	 */
	function buildSomeThread(args, position) {
		const name = position === "first" ? "some->" : "some->>";
		if (args.length < 2) {
			throw new Error(`${name} requires at least 2 arguments`);
		}
		const stmts = [];
		let prevVar = gensym("t");
		stmts.push(array(sym("const"), prevVar, args[0]));
		stmts.push(
			array(
				sym("if"),
				array(sym("=="), prevVar, sym("null")),
				array(sym("return"), prevVar),
			),
		);

		for (let i = 1; i < args.length; i++) {
			const step = args[i];
			let callExpr;
			if (isKeyword(step)) {
				callExpr = array(sym("."), prevVar, sym(step.value));
			} else if (isArray(step) && step.values.length > 0 && isKeyword(step.values[0])) {
				const [kw, ...rest] = step.values;
				callExpr = array(sym("."), prevVar, sym(kw.value), ...rest);
			} else if (isArray(step)) {
				if (position === "first") {
					const [fn, ...rest] = step.values;
					callExpr = array(fn, prevVar, ...rest);
				} else {
					callExpr = array(...step.values, prevVar);
				}
			} else {
				callExpr = array(step, prevVar);
			}

			if (i === args.length - 1) {
				stmts.push(array(sym("return"), callExpr));
			} else {
				const nextVar = gensym("t");
				stmts.push(array(sym("const"), nextVar, callExpr));
				stmts.push(
					array(
						sym("if"),
						array(sym("=="), nextVar, sym("null")),
						array(sym("return"), nextVar),
					),
				);
				prevVar = nextVar;
			}
		}

		const arrowFn = array(sym("=>"), array(), ...stmts);
		return array(arrowFn);
	}

	/**
	 * Compile a let-binding pattern (for if-let / when-let).
	 * Detects ADT constructor patterns (PascalCase), obj patterns, and simple bindings.
	 * Returns { condition, bindings } where condition is the test AST node
	 * and bindings is an array of (const ...) forms.
	 */
	// DD-37 M22-3b: compileLetPattern moved to top-level (exported).

	// DD-37 M22: bind, =, !=, func, genfunc, genfn, match, type
	// all moved to classifier.js (batches 8+9).


	// --- not (logical NOT) ---
	// DD-37 M21: `not` moved to classifier.js (DD-37 step 3 pilot).
	// The classifier handles (not x) → Not AST node → (! x) kernel form.

	// DD-37 M22: ->, ->> moved to classifier.js (batch 3).

	// DD-37 M22: assoc, dissoc, conj moved to classifier.js (batch 2).

	// ===================================================================
	// js: namespace interop (DD-15)
	// ===================================================================

	// --- js:call ---
	// (js:call obj:method args...) → (obj:method args...)
	macroEnv.set("js:call", (...args) => {
		if (args.length < 1) {
			throw new Error("js:call requires at least a method reference");
		}
		return array(args[0], ...args.slice(1));
	});

	// --- js:bind ---
	// (js:bind obj:method obj) → (obj:method:bind obj)
	macroEnv.set("js:bind", (...args) => {
		if (args.length !== 2) {
			throw new Error(
				"js:bind requires exactly 2 arguments: (js:bind obj:method obj)",
			);
		}
		if (args[0].type !== "atom") {
			throw new Error("js:bind: first argument must be a method reference");
		}
		return array(sym(`${args[0].value}:bind`), args[1]);
	});

	// --- js:eval ---
	// (js:eval code) → (eval code)
	macroEnv.set("js:eval", (...args) => {
		if (args.length !== 1) {
			throw new Error("js:eval requires exactly 1 argument");
		}
		return array(sym("eval"), args[0]);
	});

	// --- js:eq ---
	// (js:eq a b) → (== a b)
	macroEnv.set("js:eq", (...args) => {
		if (args.length !== 2) {
			throw new Error("js:eq requires exactly 2 arguments");
		}
		return array(sym("=="), args[0], args[1]);
	});

	// --- js:typeof ---
	// (js:typeof x) → (typeof x)
	macroEnv.set("js:typeof", (...args) => {
		if (args.length !== 1) {
			throw new Error("js:typeof requires exactly 1 argument");
		}
		return array(sym("typeof"), args[0]);
	});

	// ===================================================================
	// Phase 2: Complex Surface Forms

	// DD-37 M22: if-let, when-let moved to classifier.js (batch 4).
	// DD-37 M22: some->, some->> moved to classifier.js (batch 3).
}
