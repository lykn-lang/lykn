// lykn compiler
// Transforms lykn s-expression AST into ESTree nodes
// Uses astring for code generation

import { generate } from 'astring';

/** Convert lisp-case to camelCase via single-pass character walk. */
function toCamelCase(str) {
  let out = '';
  let leadingHyphens = true;
  let upperNext = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (ch === '-') {
      if (leadingHyphens) {
        out += '_';
      } else if (i === str.length - 1) {
        out += '_';
      } else {
        upperNext = true;
      }
    } else {
      leadingHyphens = false;
      if (upperNext) {
        out += ch.toUpperCase();
        upperNext = false;
      } else {
        out += ch;
      }
    }
  }

  return out;
}

// Built-in macros: maps s-expression forms to ESTree AST nodes
const macros = {
  // Variable declaration: (var x 1)
  'var'(args) {
    const decl = {
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: [{
        type: 'VariableDeclarator',
        id: compileExpr(args[0]),
        init: args[1] ? compileExpr(args[1]) : null,
      }],
    };
    return decl;
  },

  // Const declaration: (const x 1)
  'const'(args) {
    return {
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [{
        type: 'VariableDeclarator',
        id: compileExpr(args[0]),
        init: args[1] ? compileExpr(args[1]) : null,
      }],
    };
  },

  // Let declaration: (let x 1)
  'let'(args) {
    return {
      type: 'VariableDeclaration',
      kind: 'let',
      declarations: [{
        type: 'VariableDeclarator',
        id: compileExpr(args[0]),
        init: args[1] ? compileExpr(args[1]) : null,
      }],
    };
  },

  // Computed member access: (get obj key)
  'get'(args) {
    if (args.length !== 2) {
      throw new Error('get requires exactly 2 arguments: (get object key)');
    }
    return {
      type: 'MemberExpression',
      object: compileExpr(args[0]),
      property: compileExpr(args[1]),
      computed: true,
    };
  },

  // Arrow function: (=> (a b) (+ a b))
  '=>'(args) {
    const params = args[0].type === 'list'
      ? args[0].values.map(compileExpr)
      : [];
    const bodyExprs = args.slice(1);
    if (bodyExprs.length === 1) {
      const compiled = compileExpr(bodyExprs[0]);
      return {
        type: 'ArrowFunctionExpression',
        params,
        body: compiled,
        expression: true,
      };
    }
    return {
      type: 'ArrowFunctionExpression',
      params,
      body: {
        type: 'BlockStatement',
        body: bodyExprs.map(e => toStatement(compileExpr(e))),
      },
      expression: false,
    };
  },

  // Lambda: (lambda (a b) (return (+ a b)))
  'lambda'(args) {
    const params = args[0].type === 'list'
      ? args[0].values.map(compileExpr)
      : [];
    const bodyExprs = args.slice(1);
    return {
      type: 'FunctionExpression',
      id: null,
      params,
      body: {
        type: 'BlockStatement',
        body: bodyExprs.map(e => toStatement(compileExpr(e))),
      },
    };
  },

  // Return: (return expr)
  'return'(args) {
    return {
      type: 'ReturnStatement',
      argument: args[0] ? compileExpr(args[0]) : null,
    };
  },

  // If: (if cond then else)
  'if'(args) {
    return {
      type: 'IfStatement',
      test: compileExpr(args[0]),
      consequent: toStatement(compileExpr(args[1])),
      alternate: args[2] ? toStatement(compileExpr(args[2])) : null,
    };
  },

  // Block: (block stmt1 stmt2 ...)
  'block'(args) {
    return {
      type: 'BlockStatement',
      body: args.map(e => toStatement(compileExpr(e))),
    };
  },

  // Assignment: (= x 5)
  '='(args) {
    return {
      type: 'AssignmentExpression',
      operator: '=',
      left: compileExpr(args[0]),
      right: compileExpr(args[1]),
    };
  },

  // New: (new Thing arg1 arg2)
  'new'(args) {
    return {
      type: 'NewExpression',
      callee: compileExpr(args[0]),
      arguments: args.slice(1).map(compileExpr),
    };
  },

  // Array literal: (array 1 2 3)
  'array'(args) {
    return {
      type: 'ArrayExpression',
      elements: args.map(compileExpr),
    };
  },

  // Object literal: (object key1 val1 key2 val2)
  'object'(args) {
    const properties = [];
    for (let i = 0; i < args.length; i += 2) {
      properties.push({
        type: 'Property',
        key: args[i].type === 'atom'
          ? { type: 'Identifier', name: args[i].value }
          : compileExpr(args[i]),
        value: compileExpr(args[i + 1]),
        kind: 'init',
        computed: false,
        shorthand: false,
        method: false,
      });
    }
    return { type: 'ObjectExpression', properties };
  },
};

// Binary/logical operators
const binaryOps = ['+', '-', '*', '/', '%', '===', '!==', '==', '!=',
                    '<', '>', '<=', '>=', '&&', '||', '??',
                    '&', '|', '^', '<<', '>>', '>>>'];
for (const op of binaryOps) {
  macros[op] = (args) => {
    const type = (op === '&&' || op === '||' || op === '??')
      ? 'LogicalExpression'
      : 'BinaryExpression';
    let result = {
      type,
      operator: op,
      left: compileExpr(args[0]),
      right: compileExpr(args[1]),
    };
    // Support n-ary: (+ a b c) => a + b + c
    for (let i = 2; i < args.length; i++) {
      result = { type, operator: op, left: result, right: compileExpr(args[i]) };
    }
    return result;
  };
}

// Unary prefix: (! x), (typeof x)
for (const op of ['!', '~', 'typeof', 'void', 'delete']) {
  macros[op] = (args) => ({
    type: 'UnaryExpression',
    operator: op,
    prefix: true,
    argument: compileExpr(args[0]),
  });
}

// Ensure a node is wrapped as a statement
function toStatement(node) {
  if (!node) return { type: 'EmptyStatement' };
  if (node.type.endsWith('Statement') || node.type.endsWith('Declaration')) {
    return node;
  }
  return { type: 'ExpressionStatement', expression: node };
}

// Compile a single s-expression node to an ESTree node
export function compileExpr(node) {
  if (!node) return { type: 'Literal', value: null };

  switch (node.type) {
    case 'number':
      return { type: 'Literal', value: node.value };
    case 'string':
      return { type: 'Literal', value: node.value };
    case 'atom': {
      const val = node.value;

      // 1. Literal atoms
      if (val === 'true') return { type: 'Literal', value: true };
      if (val === 'false') return { type: 'Literal', value: false };
      if (val === 'null') return { type: 'Literal', value: null };
      if (val === 'undefined') return { type: 'Identifier', name: 'undefined' };

      // 2. Special keyword atoms
      if (val === 'this') return { type: 'ThisExpression' };
      if (val === 'super') return { type: 'Super' };

      // 3. Colon syntax → MemberExpression chain
      if (val.includes(':')) {
        if (val === ':') {
          throw new Error('Bare colon is not a valid identifier');
        }
        if (val.startsWith(':')) {
          throw new Error('Leading colon syntax is reserved for future use');
        }
        if (val.endsWith(':')) {
          throw new Error('Trailing colon in member expression');
        }

        const segments = val.split(':');
        for (const seg of segments) {
          if (seg === '') {
            throw new Error('Empty segment in colon syntax (consecutive colons)');
          }
          if (/^\d/.test(seg)) {
            throw new Error(
              `Numeric segment "${seg}" in colon syntax — use (get obj ${seg}) for computed access`
            );
          }
        }

        const first = segments[0];
        let result;
        if (first === 'this') {
          result = { type: 'ThisExpression' };
        } else if (first === 'super') {
          result = { type: 'Super' };
        } else {
          result = { type: 'Identifier', name: toCamelCase(first) };
        }

        for (let i = 1; i < segments.length; i++) {
          result = {
            type: 'MemberExpression',
            object: result,
            property: { type: 'Identifier', name: toCamelCase(segments[i]) },
            computed: false,
          };
        }

        return result;
      }

      // 4. Regular identifier with camelCase
      return { type: 'Identifier', name: toCamelCase(val) };
    }
    case 'list': {
      if (node.values.length === 0) {
        return { type: 'ArrayExpression', elements: [] };
      }
      const head = node.values[0];
      const rest = node.values.slice(1);

      // Check if head matches a macro
      if (head.type === 'atom' && macros[head.value]) {
        return macros[head.value](rest);
      }

      // Otherwise it's a function call
      return {
        type: 'CallExpression',
        callee: compileExpr(head),
        arguments: rest.map(compileExpr),
        optional: false,
      };
    }
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

// Compile an array of top-level s-expressions to a JS program string
export function compile(exprs) {
  const program = {
    type: 'Program',
    body: exprs.map(e => toStatement(compileExpr(e))),
    sourceType: 'module',
  };
  return generate(program, { indent: '  ' });
}
