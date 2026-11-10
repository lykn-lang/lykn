var lykn = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/browser/mod.js
  var mod_exports = {};
  __export(mod_exports, {
    compile: () => compileLykn,
    load: () => load,
    run: () => run
  });

  // packages/lang/reader.js
  function read(source) {
    let pos = 0;
    function peek() {
      return source[pos];
    }
    function advance() {
      return source[pos++];
    }
    function skipWhitespaceAndComments() {
      while (pos < source.length) {
        const ch = peek();
        if (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
          advance();
        } else if (ch === ";") {
          while (pos < source.length && peek() !== "\n") advance();
        } else {
          break;
        }
      }
    }
    function readString() {
      advance();
      let value = "";
      while (pos < source.length && peek() !== '"') {
        if (peek() === "\\") {
          advance();
          value += readStringEscape();
        } else {
          value += advance();
        }
      }
      if (pos < source.length) advance();
      return { type: "string", value };
    }
    function readStringEscape() {
      const esc = advance();
      if (esc === void 0) throw new Error("unterminated escape in string");
      if (esc === "n") return "\n";
      if (esc === "t") return "	";
      if (esc === "r") return "\r";
      if (esc === "b") return "\b";
      if (esc === "f") return "\f";
      if (esc === "v") return "\v";
      if (esc === "0") {
        if (/[0-9]/.test(peek() ?? "")) {
          throw new Error("octal escapes are not supported in strings");
        }
        return "\0";
      }
      if (esc === "\\") return "\\";
      if (esc === '"') return '"';
      if (esc === "'") return "'";
      if (esc === "/") return "/";
      if (esc === "x") return readFixedHexEscape(2, "\\x");
      if (esc === "u") {
        if (peek() === "{") return readBracedUnicodeEscape();
        return readFixedHexEscape(4, "\\u");
      }
      throw new Error(`unsupported escape sequence \\${esc} in string`);
    }
    function readFixedHexEscape(length2, prefix) {
      let hex = "";
      for (let i = 0; i < length2; i++) {
        const ch = advance();
        if (!isHexDigit(ch)) {
          throw new Error(`malformed ${prefix} escape in string`);
        }
        hex += ch;
      }
      return String.fromCodePoint(Number.parseInt(hex, 16));
    }
    function readBracedUnicodeEscape() {
      advance();
      let hex = "";
      while (pos < source.length && peek() !== "}") {
        const ch = advance();
        if (!isHexDigit(ch)) {
          throw new Error("malformed \\u{...} escape in string");
        }
        hex += ch;
      }
      if (peek() !== "}") {
        throw new Error("unterminated \\u{...} escape in string");
      }
      advance();
      if (hex.length === 0) throw new Error("empty \\u{...} escape in string");
      const codePoint = Number.parseInt(hex, 16);
      if (codePoint > 1114111) {
        throw new Error("Unicode escape out of range in string");
      }
      return String.fromCodePoint(codePoint);
    }
    function isHexDigit(ch) {
      return typeof ch === "string" && /^[0-9a-fA-F]$/.test(ch);
    }
    function readAtomOrNumber() {
      let value = "";
      while (pos < source.length) {
        const ch = peek();
        if (ch === " " || ch === "	" || ch === "\n" || ch === "\r" || ch === "(" || ch === ")" || ch === ";" || ch === "`" || ch === "," || ch === "'") {
          break;
        }
        value += advance();
      }
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        return { type: "number", value: parseFloat(value) };
      }
      if (value.length > 1 && value.startsWith(":")) {
        return { type: "keyword", value: value.slice(1) };
      }
      return { type: "atom", value };
    }
    function readList() {
      advance();
      const values = [];
      let sawDot = false;
      let cdrNode = null;
      skipWhitespaceAndComments();
      while (pos < source.length && peek() !== ")") {
        const expr = readExpr();
        if (expr === null) {
          skipWhitespaceAndComments();
          continue;
        }
        if (expr.type === "atom" && expr.value === ".") {
          if (values.length === 0) {
            throw new Error("dot cannot be first element in list");
          }
          if (sawDot) {
            throw new Error("only one dot allowed per list level");
          }
          sawDot = true;
          skipWhitespaceAndComments();
          if (pos >= source.length || peek() === ")") {
            throw new Error("nothing after dot in list");
          }
          cdrNode = readExpr();
          if (cdrNode === null) {
            throw new Error("nothing after dot in list");
          }
          skipWhitespaceAndComments();
          if (pos < source.length && peek() !== ")") {
            throw new Error("only one element allowed after dot in list");
          }
        } else {
          if (sawDot) {
            throw new Error("only one element allowed after dot in list");
          }
          values.push(expr);
        }
        skipWhitespaceAndComments();
      }
      if (pos < source.length) advance();
      if (sawDot) {
        if (values.length !== 1) {
          throw new Error(
            "dotted pair must have exactly one element before the dot"
          );
        }
        return { type: "cons", car: values[0], cdr: cdrNode };
      }
      return { type: "list", values };
    }
    function readDispatch() {
      advance();
      if (pos >= source.length) {
        throw new Error("unexpected end of input after #");
      }
      const ch = peek();
      if (ch === ";") return readExprComment();
      if (ch === "|") return readBlockComment();
      if (ch === "a") return readDataLiteral("array");
      if (ch === "o") return readDataLiteral("object");
      if (ch === "(") {
        throw new Error("use #a(...) for array literals");
      }
      if (ch >= "0" && ch <= "9") return readRadixLiteral();
      throw new Error(`unknown dispatch character: ${ch}`);
    }
    function readExprComment() {
      advance();
      skipWhitespaceAndComments();
      if (pos >= source.length) {
        throw new Error("#; at end of input with no form to discard");
      }
      if (peek() === ")") {
        throw new Error("#; at end of list with no form to discard");
      }
      readExpr();
      return null;
    }
    function readBlockComment() {
      advance();
      let depth = 1;
      while (pos < source.length && depth > 0) {
        const ch = advance();
        if (ch === "#" && pos < source.length && peek() === "|") {
          advance();
          depth++;
        } else if (ch === "|" && pos < source.length && peek() === "#") {
          advance();
          depth--;
        }
      }
      if (depth > 0) {
        throw new Error("unterminated block comment (missing |#)");
      }
      return null;
    }
    function readDataLiteral(formName) {
      advance();
      skipWhitespaceAndComments();
      if (pos >= source.length || peek() !== "(") {
        throw new Error(`#${formName[0]} must be followed by (...)`);
      }
      const list = readList();
      return {
        type: "list",
        values: [{ type: "atom", value: formName }, ...list.values]
      };
    }
    function readRadixLiteral() {
      let baseStr = "";
      while (pos < source.length && peek() !== "r") {
        const ch = peek();
        if (ch >= "0" && ch <= "9") {
          baseStr += advance();
        } else {
          throw new Error(
            `expected 'r' after base in radix literal, got '${ch}'`
          );
        }
      }
      if (pos >= source.length) {
        throw new Error(
          "expected 'r' after base in radix literal, got end of input"
        );
      }
      advance();
      const base = parseInt(baseStr, 10);
      if (base < 2 || base > 36) {
        throw new Error(`radix base must be 2-36, got ${base}`);
      }
      let valueStr = "";
      while (pos < source.length) {
        const ch = peek();
        if (ch === " " || ch === "	" || ch === "\n" || ch === "\r" || ch === "(" || ch === ")" || ch === ";" || ch === "`" || ch === "," || ch === "'") {
          break;
        }
        valueStr += advance();
      }
      if (valueStr === "") {
        throw new Error(`missing value after #${baseStr}r`);
      }
      for (const digit of valueStr) {
        const digitVal = parseInt(digit, 36);
        if (Number.isNaN(digitVal) || digitVal >= base) {
          throw new Error(`'${digit}' is not a valid digit in base ${base}`);
        }
      }
      const value = parseInt(valueStr, base);
      return { type: "number", value, base };
    }
    function readExpr() {
      skipWhitespaceAndComments();
      if (pos >= source.length) return null;
      const ch = peek();
      if (ch === ")") return null;
      if (ch === "(") return readList();
      if (ch === '"') return readString();
      if (ch === "`") {
        advance();
        const expr = readExpr();
        return {
          type: "list",
          values: [{ type: "atom", value: "quasiquote" }, expr]
        };
      }
      if (ch === "'") {
        advance();
        const expr = readExpr();
        return { type: "list", values: [{ type: "atom", value: "quote" }, expr] };
      }
      if (ch === ",") {
        advance();
        if (peek() === "@") {
          advance();
          const expr2 = readExpr();
          return {
            type: "list",
            values: [{ type: "atom", value: "unquote-splicing" }, expr2]
          };
        }
        const expr = readExpr();
        return {
          type: "list",
          values: [{ type: "atom", value: "unquote" }, expr]
        };
      }
      if (ch === "#") {
        const node = readDispatch();
        if (node === null) return readExpr();
        return node;
      }
      return readAtomOrNumber();
    }
    const exprs = [];
    skipWhitespaceAndComments();
    while (pos < source.length) {
      const expr = readExpr();
      if (expr !== null) exprs.push(expr);
      skipWhitespaceAndComments();
    }
    return exprs;
  }

  // ../../../../../Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/astring/1.9.0/dist/astring.mjs
  var { stringify } = JSON;
  if (!String.prototype.repeat) {
    throw new Error(
      "String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation"
    );
  }
  if (!String.prototype.endsWith) {
    throw new Error(
      "String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation"
    );
  }
  var OPERATOR_PRECEDENCE = {
    "||": 2,
    "??": 3,
    "&&": 4,
    "|": 5,
    "^": 6,
    "&": 7,
    "==": 8,
    "!=": 8,
    "===": 8,
    "!==": 8,
    "<": 9,
    ">": 9,
    "<=": 9,
    ">=": 9,
    in: 9,
    instanceof: 9,
    "<<": 10,
    ">>": 10,
    ">>>": 10,
    "+": 11,
    "-": 11,
    "*": 12,
    "%": 12,
    "/": 12,
    "**": 13
  };
  var NEEDS_PARENTHESES = 17;
  var EXPRESSIONS_PRECEDENCE = {
    // Definitions
    ArrayExpression: 20,
    TaggedTemplateExpression: 20,
    ThisExpression: 20,
    Identifier: 20,
    PrivateIdentifier: 20,
    Literal: 18,
    TemplateLiteral: 20,
    Super: 20,
    SequenceExpression: 20,
    // Operations
    MemberExpression: 19,
    ChainExpression: 19,
    CallExpression: 19,
    NewExpression: 19,
    // Other definitions
    ArrowFunctionExpression: NEEDS_PARENTHESES,
    ClassExpression: NEEDS_PARENTHESES,
    FunctionExpression: NEEDS_PARENTHESES,
    ObjectExpression: NEEDS_PARENTHESES,
    // Other operations
    UpdateExpression: 16,
    UnaryExpression: 15,
    AwaitExpression: 15,
    BinaryExpression: 14,
    LogicalExpression: 13,
    ConditionalExpression: 4,
    AssignmentExpression: 3,
    YieldExpression: 2,
    RestElement: 1
  };
  function formatSequence(state, nodes) {
    const { generator } = state;
    state.write("(");
    if (nodes != null && nodes.length > 0) {
      generator[nodes[0].type](nodes[0], state);
      const { length: length2 } = nodes;
      for (let i = 1; i < length2; i++) {
        const param = nodes[i];
        state.write(", ");
        generator[param.type](param, state);
      }
    }
    state.write(")");
  }
  function expressionNeedsParenthesis(state, node, parentNode, isRightHand) {
    const nodePrecedence = state.expressionsPrecedence[node.type];
    if (nodePrecedence === NEEDS_PARENTHESES) {
      return true;
    }
    const parentNodePrecedence = state.expressionsPrecedence[parentNode.type];
    if (nodePrecedence !== parentNodePrecedence) {
      return !isRightHand && nodePrecedence === 15 && parentNodePrecedence === 14 && parentNode.operator === "**" || nodePrecedence < parentNodePrecedence;
    }
    if (nodePrecedence !== 13 && nodePrecedence !== 14) {
      return false;
    }
    if (node.operator === "**" && parentNode.operator === "**") {
      return !isRightHand;
    }
    if (nodePrecedence === 13 && parentNodePrecedence === 13 && (node.operator === "??" || parentNode.operator === "??")) {
      return true;
    }
    if (isRightHand) {
      return OPERATOR_PRECEDENCE[node.operator] <= OPERATOR_PRECEDENCE[parentNode.operator];
    }
    return OPERATOR_PRECEDENCE[node.operator] < OPERATOR_PRECEDENCE[parentNode.operator];
  }
  function formatExpression(state, node, parentNode, isRightHand) {
    const { generator } = state;
    if (expressionNeedsParenthesis(state, node, parentNode, isRightHand)) {
      state.write("(");
      generator[node.type](node, state);
      state.write(")");
    } else {
      generator[node.type](node, state);
    }
  }
  function reindent(state, text, indent, lineEnd) {
    const lines = text.split("\n");
    const end = lines.length - 1;
    state.write(lines[0].trim());
    if (end > 0) {
      state.write(lineEnd);
      for (let i = 1; i < end; i++) {
        state.write(indent + lines[i].trim() + lineEnd);
      }
      state.write(indent + lines[end].trim());
    }
  }
  function formatComments(state, comments, indent, lineEnd) {
    const { length: length2 } = comments;
    for (let i = 0; i < length2; i++) {
      const comment = comments[i];
      state.write(indent);
      if (comment.type[0] === "L") {
        state.write("// " + comment.value.trim() + "\n", comment);
      } else {
        state.write("/*");
        reindent(state, comment.value, indent, lineEnd);
        state.write("*/" + lineEnd);
      }
    }
  }
  function hasCallExpression(node) {
    let currentNode = node;
    while (currentNode != null) {
      const { type } = currentNode;
      if (type[0] === "C" && type[1] === "a") {
        return true;
      } else if (type[0] === "M" && type[1] === "e" && type[2] === "m") {
        currentNode = currentNode.object;
      } else {
        return false;
      }
    }
  }
  function formatVariableDeclaration(state, node) {
    const { generator } = state;
    const { declarations } = node;
    state.write(node.kind + " ");
    const { length: length2 } = declarations;
    if (length2 > 0) {
      generator.VariableDeclarator(declarations[0], state);
      for (let i = 1; i < length2; i++) {
        state.write(", ");
        generator.VariableDeclarator(declarations[i], state);
      }
    }
  }
  var ForInStatement;
  var FunctionDeclaration;
  var RestElement;
  var BinaryExpression;
  var ArrayExpression;
  var BlockStatement;
  var GENERATOR = {
    /*
    Default generator.
    */
    Program(node, state) {
      const indent = state.indent.repeat(state.indentLevel);
      const { lineEnd, writeComments } = state;
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, indent, lineEnd);
      }
      const statements = node.body;
      const { length: length2 } = statements;
      for (let i = 0; i < length2; i++) {
        const statement = statements[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, indent, lineEnd);
        }
        state.write(indent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }
      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, indent, lineEnd);
      }
    },
    BlockStatement: BlockStatement = function(node, state) {
      const indent = state.indent.repeat(state.indentLevel++);
      const { lineEnd, writeComments } = state;
      const statementIndent = indent + state.indent;
      state.write("{");
      const statements = node.body;
      if (statements != null && statements.length > 0) {
        state.write(lineEnd);
        if (writeComments && node.comments != null) {
          formatComments(state, node.comments, statementIndent, lineEnd);
        }
        const { length: length2 } = statements;
        for (let i = 0; i < length2; i++) {
          const statement = statements[i];
          if (writeComments && statement.comments != null) {
            formatComments(state, statement.comments, statementIndent, lineEnd);
          }
          state.write(statementIndent);
          this[statement.type](statement, state);
          state.write(lineEnd);
        }
        state.write(indent);
      } else {
        if (writeComments && node.comments != null) {
          state.write(lineEnd);
          formatComments(state, node.comments, statementIndent, lineEnd);
          state.write(indent);
        }
      }
      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, statementIndent, lineEnd);
      }
      state.write("}");
      state.indentLevel--;
    },
    ClassBody: BlockStatement,
    StaticBlock(node, state) {
      state.write("static ");
      this.BlockStatement(node, state);
    },
    EmptyStatement(node, state) {
      state.write(";");
    },
    ExpressionStatement(node, state) {
      const precedence = state.expressionsPrecedence[node.expression.type];
      if (precedence === NEEDS_PARENTHESES || precedence === 3 && node.expression.left.type[0] === "O") {
        state.write("(");
        this[node.expression.type](node.expression, state);
        state.write(")");
      } else {
        this[node.expression.type](node.expression, state);
      }
      state.write(";");
    },
    IfStatement(node, state) {
      state.write("if (");
      this[node.test.type](node.test, state);
      state.write(") ");
      this[node.consequent.type](node.consequent, state);
      if (node.alternate != null) {
        state.write(" else ");
        this[node.alternate.type](node.alternate, state);
      }
    },
    LabeledStatement(node, state) {
      this[node.label.type](node.label, state);
      state.write(": ");
      this[node.body.type](node.body, state);
    },
    BreakStatement(node, state) {
      state.write("break");
      if (node.label != null) {
        state.write(" ");
        this[node.label.type](node.label, state);
      }
      state.write(";");
    },
    ContinueStatement(node, state) {
      state.write("continue");
      if (node.label != null) {
        state.write(" ");
        this[node.label.type](node.label, state);
      }
      state.write(";");
    },
    WithStatement(node, state) {
      state.write("with (");
      this[node.object.type](node.object, state);
      state.write(") ");
      this[node.body.type](node.body, state);
    },
    SwitchStatement(node, state) {
      const indent = state.indent.repeat(state.indentLevel++);
      const { lineEnd, writeComments } = state;
      state.indentLevel++;
      const caseIndent = indent + state.indent;
      const statementIndent = caseIndent + state.indent;
      state.write("switch (");
      this[node.discriminant.type](node.discriminant, state);
      state.write(") {" + lineEnd);
      const { cases: occurences } = node;
      const { length: occurencesCount } = occurences;
      for (let i = 0; i < occurencesCount; i++) {
        const occurence = occurences[i];
        if (writeComments && occurence.comments != null) {
          formatComments(state, occurence.comments, caseIndent, lineEnd);
        }
        if (occurence.test) {
          state.write(caseIndent + "case ");
          this[occurence.test.type](occurence.test, state);
          state.write(":" + lineEnd);
        } else {
          state.write(caseIndent + "default:" + lineEnd);
        }
        const { consequent } = occurence;
        const { length: consequentCount } = consequent;
        for (let i2 = 0; i2 < consequentCount; i2++) {
          const statement = consequent[i2];
          if (writeComments && statement.comments != null) {
            formatComments(state, statement.comments, statementIndent, lineEnd);
          }
          state.write(statementIndent);
          this[statement.type](statement, state);
          state.write(lineEnd);
        }
      }
      state.indentLevel -= 2;
      state.write(indent + "}");
    },
    ReturnStatement(node, state) {
      state.write("return");
      if (node.argument) {
        state.write(" ");
        this[node.argument.type](node.argument, state);
      }
      state.write(";");
    },
    ThrowStatement(node, state) {
      state.write("throw ");
      this[node.argument.type](node.argument, state);
      state.write(";");
    },
    TryStatement(node, state) {
      state.write("try ");
      this[node.block.type](node.block, state);
      if (node.handler) {
        const { handler } = node;
        if (handler.param == null) {
          state.write(" catch ");
        } else {
          state.write(" catch (");
          this[handler.param.type](handler.param, state);
          state.write(") ");
        }
        this[handler.body.type](handler.body, state);
      }
      if (node.finalizer) {
        state.write(" finally ");
        this[node.finalizer.type](node.finalizer, state);
      }
    },
    WhileStatement(node, state) {
      state.write("while (");
      this[node.test.type](node.test, state);
      state.write(") ");
      this[node.body.type](node.body, state);
    },
    DoWhileStatement(node, state) {
      state.write("do ");
      this[node.body.type](node.body, state);
      state.write(" while (");
      this[node.test.type](node.test, state);
      state.write(");");
    },
    ForStatement(node, state) {
      state.write("for (");
      if (node.init != null) {
        const { init } = node;
        if (init.type[0] === "V") {
          formatVariableDeclaration(state, init);
        } else {
          this[init.type](init, state);
        }
      }
      state.write("; ");
      if (node.test) {
        this[node.test.type](node.test, state);
      }
      state.write("; ");
      if (node.update) {
        this[node.update.type](node.update, state);
      }
      state.write(") ");
      this[node.body.type](node.body, state);
    },
    ForInStatement: ForInStatement = function(node, state) {
      state.write(`for ${node.await ? "await " : ""}(`);
      const { left } = node;
      if (left.type[0] === "V") {
        formatVariableDeclaration(state, left);
      } else {
        this[left.type](left, state);
      }
      state.write(node.type[3] === "I" ? " in " : " of ");
      this[node.right.type](node.right, state);
      state.write(") ");
      this[node.body.type](node.body, state);
    },
    ForOfStatement: ForInStatement,
    DebuggerStatement(node, state) {
      state.write("debugger;", node);
    },
    FunctionDeclaration: FunctionDeclaration = function(node, state) {
      state.write(
        (node.async ? "async " : "") + (node.generator ? "function* " : "function ") + (node.id ? node.id.name : ""),
        node
      );
      formatSequence(state, node.params);
      state.write(" ");
      this[node.body.type](node.body, state);
    },
    FunctionExpression: FunctionDeclaration,
    VariableDeclaration(node, state) {
      formatVariableDeclaration(state, node);
      state.write(";");
    },
    VariableDeclarator(node, state) {
      this[node.id.type](node.id, state);
      if (node.init != null) {
        state.write(" = ");
        this[node.init.type](node.init, state);
      }
    },
    ClassDeclaration(node, state) {
      state.write("class " + (node.id ? `${node.id.name} ` : ""), node);
      if (node.superClass) {
        state.write("extends ");
        const { superClass } = node;
        const { type } = superClass;
        const precedence = state.expressionsPrecedence[type];
        if ((type[0] !== "C" || type[1] !== "l" || type[5] !== "E") && (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.ClassExpression)) {
          state.write("(");
          this[node.superClass.type](superClass, state);
          state.write(")");
        } else {
          this[superClass.type](superClass, state);
        }
        state.write(" ");
      }
      this.ClassBody(node.body, state);
    },
    ImportDeclaration(node, state) {
      state.write("import ");
      const { specifiers, attributes } = node;
      const { length: length2 } = specifiers;
      let i = 0;
      if (length2 > 0) {
        for (; i < length2; ) {
          if (i > 0) {
            state.write(", ");
          }
          const specifier = specifiers[i];
          const type = specifier.type[6];
          if (type === "D") {
            state.write(specifier.local.name, specifier);
            i++;
          } else if (type === "N") {
            state.write("* as " + specifier.local.name, specifier);
            i++;
          } else {
            break;
          }
        }
        if (i < length2) {
          state.write("{");
          for (; ; ) {
            const specifier = specifiers[i];
            const { name } = specifier.imported;
            state.write(name, specifier);
            if (name !== specifier.local.name) {
              state.write(" as " + specifier.local.name);
            }
            if (++i < length2) {
              state.write(", ");
            } else {
              break;
            }
          }
          state.write("}");
        }
        state.write(" from ");
      }
      this.Literal(node.source, state);
      if (attributes && attributes.length > 0) {
        state.write(" with { ");
        for (let i2 = 0; i2 < attributes.length; i2++) {
          this.ImportAttribute(attributes[i2], state);
          if (i2 < attributes.length - 1) state.write(", ");
        }
        state.write(" }");
      }
      state.write(";");
    },
    ImportAttribute(node, state) {
      this.Identifier(node.key, state);
      state.write(": ");
      this.Literal(node.value, state);
    },
    ImportExpression(node, state) {
      state.write("import(");
      this[node.source.type](node.source, state);
      state.write(")");
    },
    ExportDefaultDeclaration(node, state) {
      state.write("export default ");
      this[node.declaration.type](node.declaration, state);
      if (state.expressionsPrecedence[node.declaration.type] != null && node.declaration.type[0] !== "F") {
        state.write(";");
      }
    },
    ExportNamedDeclaration(node, state) {
      state.write("export ");
      if (node.declaration) {
        this[node.declaration.type](node.declaration, state);
      } else {
        state.write("{");
        const { specifiers } = node, { length: length2 } = specifiers;
        if (length2 > 0) {
          for (let i = 0; ; ) {
            const specifier = specifiers[i];
            const { name } = specifier.local;
            state.write(name, specifier);
            if (name !== specifier.exported.name) {
              state.write(" as " + specifier.exported.name);
            }
            if (++i < length2) {
              state.write(", ");
            } else {
              break;
            }
          }
        }
        state.write("}");
        if (node.source) {
          state.write(" from ");
          this.Literal(node.source, state);
        }
        if (node.attributes && node.attributes.length > 0) {
          state.write(" with { ");
          for (let i = 0; i < node.attributes.length; i++) {
            this.ImportAttribute(node.attributes[i], state);
            if (i < node.attributes.length - 1) state.write(", ");
          }
          state.write(" }");
        }
        state.write(";");
      }
    },
    ExportAllDeclaration(node, state) {
      if (node.exported != null) {
        state.write("export * as " + node.exported.name + " from ");
      } else {
        state.write("export * from ");
      }
      this.Literal(node.source, state);
      if (node.attributes && node.attributes.length > 0) {
        state.write(" with { ");
        for (let i = 0; i < node.attributes.length; i++) {
          this.ImportAttribute(node.attributes[i], state);
          if (i < node.attributes.length - 1) state.write(", ");
        }
        state.write(" }");
      }
      state.write(";");
    },
    MethodDefinition(node, state) {
      if (node.static) {
        state.write("static ");
      }
      const kind = node.kind[0];
      if (kind === "g" || kind === "s") {
        state.write(node.kind + " ");
      }
      if (node.value.async) {
        state.write("async ");
      }
      if (node.value.generator) {
        state.write("*");
      }
      if (node.computed) {
        state.write("[");
        this[node.key.type](node.key, state);
        state.write("]");
      } else {
        this[node.key.type](node.key, state);
      }
      formatSequence(state, node.value.params);
      state.write(" ");
      this[node.value.body.type](node.value.body, state);
    },
    ClassExpression(node, state) {
      this.ClassDeclaration(node, state);
    },
    ArrowFunctionExpression(node, state) {
      state.write(node.async ? "async " : "", node);
      const { params } = node;
      if (params != null) {
        if (params.length === 1 && params[0].type[0] === "I") {
          state.write(params[0].name, params[0]);
        } else {
          formatSequence(state, node.params);
        }
      }
      state.write(" => ");
      if (node.body.type[0] === "O") {
        state.write("(");
        this.ObjectExpression(node.body, state);
        state.write(")");
      } else {
        this[node.body.type](node.body, state);
      }
    },
    ThisExpression(node, state) {
      state.write("this", node);
    },
    Super(node, state) {
      state.write("super", node);
    },
    RestElement: RestElement = function(node, state) {
      state.write("...");
      this[node.argument.type](node.argument, state);
    },
    SpreadElement: RestElement,
    YieldExpression(node, state) {
      state.write(node.delegate ? "yield*" : "yield");
      if (node.argument) {
        state.write(" ");
        this[node.argument.type](node.argument, state);
      }
    },
    AwaitExpression(node, state) {
      state.write("await ", node);
      formatExpression(state, node.argument, node);
    },
    TemplateLiteral(node, state) {
      const { quasis, expressions } = node;
      state.write("`");
      const { length: length2 } = expressions;
      for (let i = 0; i < length2; i++) {
        const expression = expressions[i];
        const quasi2 = quasis[i];
        state.write(quasi2.value.raw, quasi2);
        state.write("${");
        this[expression.type](expression, state);
        state.write("}");
      }
      const quasi = quasis[quasis.length - 1];
      state.write(quasi.value.raw, quasi);
      state.write("`");
    },
    TemplateElement(node, state) {
      state.write(node.value.raw, node);
    },
    TaggedTemplateExpression(node, state) {
      formatExpression(state, node.tag, node);
      this[node.quasi.type](node.quasi, state);
    },
    ArrayExpression: ArrayExpression = function(node, state) {
      state.write("[");
      if (node.elements.length > 0) {
        const { elements } = node, { length: length2 } = elements;
        for (let i = 0; ; ) {
          const element = elements[i];
          if (element != null) {
            this[element.type](element, state);
          }
          if (++i < length2) {
            state.write(", ");
          } else {
            if (element == null) {
              state.write(", ");
            }
            break;
          }
        }
      }
      state.write("]");
    },
    ArrayPattern: ArrayExpression,
    ObjectExpression(node, state) {
      const indent = state.indent.repeat(state.indentLevel++);
      const { lineEnd, writeComments } = state;
      const propertyIndent = indent + state.indent;
      state.write("{");
      if (node.properties.length > 0) {
        state.write(lineEnd);
        if (writeComments && node.comments != null) {
          formatComments(state, node.comments, propertyIndent, lineEnd);
        }
        const comma = "," + lineEnd;
        const { properties } = node, { length: length2 } = properties;
        for (let i = 0; ; ) {
          const property = properties[i];
          if (writeComments && property.comments != null) {
            formatComments(state, property.comments, propertyIndent, lineEnd);
          }
          state.write(propertyIndent);
          this[property.type](property, state);
          if (++i < length2) {
            state.write(comma);
          } else {
            break;
          }
        }
        state.write(lineEnd);
        if (writeComments && node.trailingComments != null) {
          formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        }
        state.write(indent + "}");
      } else if (writeComments) {
        if (node.comments != null) {
          state.write(lineEnd);
          formatComments(state, node.comments, propertyIndent, lineEnd);
          if (node.trailingComments != null) {
            formatComments(state, node.trailingComments, propertyIndent, lineEnd);
          }
          state.write(indent + "}");
        } else if (node.trailingComments != null) {
          state.write(lineEnd);
          formatComments(state, node.trailingComments, propertyIndent, lineEnd);
          state.write(indent + "}");
        } else {
          state.write("}");
        }
      } else {
        state.write("}");
      }
      state.indentLevel--;
    },
    Property(node, state) {
      if (node.method || node.kind[0] !== "i") {
        this.MethodDefinition(node, state);
      } else {
        if (!node.shorthand) {
          if (node.computed) {
            state.write("[");
            this[node.key.type](node.key, state);
            state.write("]");
          } else {
            this[node.key.type](node.key, state);
          }
          state.write(": ");
        }
        this[node.value.type](node.value, state);
      }
    },
    PropertyDefinition(node, state) {
      if (node.static) {
        state.write("static ");
      }
      if (node.computed) {
        state.write("[");
      }
      this[node.key.type](node.key, state);
      if (node.computed) {
        state.write("]");
      }
      if (node.value == null) {
        if (node.key.type[0] !== "F") {
          state.write(";");
        }
        return;
      }
      state.write(" = ");
      this[node.value.type](node.value, state);
      state.write(";");
    },
    ObjectPattern(node, state) {
      state.write("{");
      if (node.properties.length > 0) {
        const { properties } = node, { length: length2 } = properties;
        for (let i = 0; ; ) {
          this[properties[i].type](properties[i], state);
          if (++i < length2) {
            state.write(", ");
          } else {
            break;
          }
        }
      }
      state.write("}");
    },
    SequenceExpression(node, state) {
      formatSequence(state, node.expressions);
    },
    UnaryExpression(node, state) {
      if (node.prefix) {
        const {
          operator,
          argument,
          argument: { type }
        } = node;
        state.write(operator);
        const needsParentheses = expressionNeedsParenthesis(state, argument, node);
        if (!needsParentheses && (operator.length > 1 || type[0] === "U" && (type[1] === "n" || type[1] === "p") && argument.prefix && argument.operator[0] === operator && (operator === "+" || operator === "-"))) {
          state.write(" ");
        }
        if (needsParentheses) {
          state.write(operator.length > 1 ? " (" : "(");
          this[type](argument, state);
          state.write(")");
        } else {
          this[type](argument, state);
        }
      } else {
        this[node.argument.type](node.argument, state);
        state.write(node.operator);
      }
    },
    UpdateExpression(node, state) {
      if (node.prefix) {
        state.write(node.operator);
        this[node.argument.type](node.argument, state);
      } else {
        this[node.argument.type](node.argument, state);
        state.write(node.operator);
      }
    },
    AssignmentExpression(node, state) {
      this[node.left.type](node.left, state);
      state.write(" " + node.operator + " ");
      this[node.right.type](node.right, state);
    },
    AssignmentPattern(node, state) {
      this[node.left.type](node.left, state);
      state.write(" = ");
      this[node.right.type](node.right, state);
    },
    BinaryExpression: BinaryExpression = function(node, state) {
      const isIn = node.operator === "in";
      if (isIn) {
        state.write("(");
      }
      formatExpression(state, node.left, node, false);
      state.write(" " + node.operator + " ");
      formatExpression(state, node.right, node, true);
      if (isIn) {
        state.write(")");
      }
    },
    LogicalExpression: BinaryExpression,
    ConditionalExpression(node, state) {
      const { test } = node;
      const precedence = state.expressionsPrecedence[test.type];
      if (precedence === NEEDS_PARENTHESES || precedence <= state.expressionsPrecedence.ConditionalExpression) {
        state.write("(");
        this[test.type](test, state);
        state.write(")");
      } else {
        this[test.type](test, state);
      }
      state.write(" ? ");
      this[node.consequent.type](node.consequent, state);
      state.write(" : ");
      this[node.alternate.type](node.alternate, state);
    },
    NewExpression(node, state) {
      state.write("new ");
      const precedence = state.expressionsPrecedence[node.callee.type];
      if (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.CallExpression || hasCallExpression(node.callee)) {
        state.write("(");
        this[node.callee.type](node.callee, state);
        state.write(")");
      } else {
        this[node.callee.type](node.callee, state);
      }
      formatSequence(state, node["arguments"]);
    },
    CallExpression(node, state) {
      const precedence = state.expressionsPrecedence[node.callee.type];
      if (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.CallExpression) {
        state.write("(");
        this[node.callee.type](node.callee, state);
        state.write(")");
      } else {
        this[node.callee.type](node.callee, state);
      }
      if (node.optional) {
        state.write("?.");
      }
      formatSequence(state, node["arguments"]);
    },
    ChainExpression(node, state) {
      this[node.expression.type](node.expression, state);
    },
    MemberExpression(node, state) {
      const precedence = state.expressionsPrecedence[node.object.type];
      if (precedence === NEEDS_PARENTHESES || precedence < state.expressionsPrecedence.MemberExpression) {
        state.write("(");
        this[node.object.type](node.object, state);
        state.write(")");
      } else {
        this[node.object.type](node.object, state);
      }
      if (node.computed) {
        if (node.optional) {
          state.write("?.");
        }
        state.write("[");
        this[node.property.type](node.property, state);
        state.write("]");
      } else {
        if (node.optional) {
          state.write("?.");
        } else {
          state.write(".");
        }
        this[node.property.type](node.property, state);
      }
    },
    MetaProperty(node, state) {
      state.write(node.meta.name + "." + node.property.name, node);
    },
    Identifier(node, state) {
      state.write(node.name, node);
    },
    PrivateIdentifier(node, state) {
      state.write(`#${node.name}`, node);
    },
    Literal(node, state) {
      if (node.raw != null) {
        state.write(node.raw, node);
      } else if (node.regex != null) {
        this.RegExpLiteral(node, state);
      } else if (node.bigint != null) {
        state.write(node.bigint + "n", node);
      } else {
        state.write(stringify(node.value), node);
      }
    },
    RegExpLiteral(node, state) {
      const { regex } = node;
      state.write(`/${regex.pattern}/${regex.flags}`, node);
    }
  };
  var EMPTY_OBJECT = {};
  var State = class {
    constructor(options) {
      const setup = options == null ? EMPTY_OBJECT : options;
      this.output = "";
      if (setup.output != null) {
        this.output = setup.output;
        this.write = this.writeToStream;
      } else {
        this.output = "";
      }
      this.generator = setup.generator != null ? setup.generator : GENERATOR;
      this.expressionsPrecedence = setup.expressionsPrecedence != null ? setup.expressionsPrecedence : EXPRESSIONS_PRECEDENCE;
      this.indent = setup.indent != null ? setup.indent : "  ";
      this.lineEnd = setup.lineEnd != null ? setup.lineEnd : "\n";
      this.indentLevel = setup.startingIndentLevel != null ? setup.startingIndentLevel : 0;
      this.writeComments = setup.comments ? setup.comments : false;
      if (setup.sourceMap != null) {
        this.write = setup.output == null ? this.writeAndMap : this.writeToStreamAndMap;
        this.sourceMap = setup.sourceMap;
        this.line = 1;
        this.column = 0;
        this.lineEndSize = this.lineEnd.split("\n").length - 1;
        this.mapping = {
          original: null,
          // Uses the entire state to avoid generating ephemeral objects
          generated: this,
          name: void 0,
          source: setup.sourceMap.file || setup.sourceMap._file
        };
      }
    }
    write(code) {
      this.output += code;
    }
    writeToStream(code) {
      this.output.write(code);
    }
    writeAndMap(code, node) {
      this.output += code;
      this.map(code, node);
    }
    writeToStreamAndMap(code, node) {
      this.output.write(code);
      this.map(code, node);
    }
    map(code, node) {
      if (node != null) {
        const { type } = node;
        if (type[0] === "L" && type[2] === "n") {
          this.column = 0;
          this.line++;
          return;
        }
        if (node.loc != null) {
          const { mapping } = this;
          mapping.original = node.loc.start;
          mapping.name = node.name;
          this.sourceMap.addMapping(mapping);
        }
        if (type[0] === "T" && type[8] === "E" || type[0] === "L" && type[1] === "i" && typeof node.value === "string") {
          const { length: length3 } = code;
          let { column, line } = this;
          for (let i = 0; i < length3; i++) {
            if (code[i] === "\n") {
              column = 0;
              line++;
            } else {
              column++;
            }
          }
          this.column = column;
          this.line = line;
          return;
        }
      }
      const { length: length2 } = code;
      const { lineEnd } = this;
      if (length2 > 0) {
        if (this.lineEndSize > 0 && (lineEnd.length === 1 ? code[length2 - 1] === lineEnd : code.endsWith(lineEnd))) {
          this.line += this.lineEndSize;
          this.column = 0;
        } else {
          this.column += length2;
        }
      }
    }
    toString() {
      return this.output;
    }
  };
  function generate(node, options) {
    const state = new State(options);
    state.generator[node.type](node, state);
    return state.output;
  }

  // packages/lang/icu-parser.js
  var ALL_CLDR_CATEGORIES = /* @__PURE__ */ new Set(["zero", "one", "two", "few", "many", "other"]);
  var ENGLISH_CLDR_CATEGORIES = /* @__PURE__ */ new Set(["one", "other"]);
  function parseIcu(input) {
    const parser = new IcuParser(input);
    const nodes = parser.parseMessage();
    if (parser.pos < input.length) {
      parser.error(`unexpected character '${input[parser.pos]}'`);
    }
    return nodes;
  }
  function collectSlotNames(nodes) {
    const names = /* @__PURE__ */ new Set();
    for (const node of nodes) {
      collectSlotNamesInner(node, names);
    }
    return names;
  }
  function collectSlotNamesInner(node, names) {
    if (node.type === "slot") {
      names.add(node.name);
    } else if (node.type === "plural" || node.type === "select") {
      names.add(node.name);
      for (const branch of node.branches) {
        for (const child of branch.body) {
          collectSlotNamesInner(child, names);
        }
      }
    }
  }
  var IcuParser = class {
    constructor(input) {
      this.input = input;
      this.pos = 0;
    }
    error(msg) {
      throw new IcuParseError(msg, this.input, this.pos);
    }
    peek() {
      return this.pos < this.input.length ? this.input[this.pos] : null;
    }
    advance() {
      return this.input[this.pos++];
    }
    expect(ch) {
      if (this.peek() !== ch) {
        const got = this.peek() ?? "end of input";
        this.error(`expected '${ch}', got '${got}'`);
      }
      this.advance();
    }
    skipWhitespace() {
      while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
        this.pos++;
      }
    }
    // Parse a top-level message (sequence of literal/slot/plural/select nodes).
    // Stops at end of input or at an unmatched '}'.
    parseMessage() {
      const nodes = [];
      while (this.pos < this.input.length) {
        const ch = this.peek();
        if (ch === "}") break;
        if (ch === "{") {
          nodes.push(this.parseBlock());
        } else if (ch === "'") {
          nodes.push(this.parseEscape());
        } else {
          nodes.push(this.parseLiteral());
        }
      }
      return coalesceLiterals(nodes);
    }
    // Parse a branch body (inside { ... } of a plural/select branch).
    // Same as parseMessage but stops at '}'.
    parseBranchBody() {
      const nodes = [];
      while (this.pos < this.input.length && this.peek() !== "}") {
        const ch = this.peek();
        if (ch === "{") {
          nodes.push(this.parseBlock());
        } else if (ch === "'") {
          nodes.push(this.parseEscape());
        } else if (ch === "#") {
          nodes.push({ type: "octothorpe" });
          this.advance();
        } else {
          nodes.push(this.parseBranchLiteral());
        }
      }
      return coalesceLiterals(nodes);
    }
    parseLiteral() {
      let value = "";
      while (this.pos < this.input.length) {
        const ch = this.peek();
        if (ch === "{" || ch === "}" || ch === "'") break;
        value += this.advance();
      }
      return { type: "literal", value };
    }
    parseBranchLiteral() {
      let value = "";
      while (this.pos < this.input.length) {
        const ch = this.peek();
        if (ch === "{" || ch === "}" || ch === "'" || ch === "#") break;
        value += this.advance();
      }
      return { type: "literal", value };
    }
    parseEscape() {
      this.advance();
      const next = this.peek();
      if (next === "{" || next === "}" || next === "'") {
        if (next === "'") {
          this.advance();
          return { type: "literal", value: "'" };
        }
        const ch = this.advance();
        if (this.peek() === "'") {
          this.advance();
        }
        return { type: "literal", value: ch };
      }
      return { type: "literal", value: "'" };
    }
    // Parse { ... } — could be a simple slot, plural, or select.
    parseBlock() {
      const _startPos = this.pos;
      this.expect("{");
      this.skipWhitespace();
      const name = this.parseIdentifier();
      if (!name) {
        this.error("expected slot name after '{'");
      }
      this.skipWhitespace();
      if (this.peek() === "}") {
        this.advance();
        return { type: "slot", name };
      }
      if (this.peek() === ",") {
        this.advance();
        this.skipWhitespace();
        const kind = this.parseIdentifier();
        this.skipWhitespace();
        if (kind === "plural") {
          return this.parsePluralBody(name);
        } else if (kind === "select") {
          return this.parseSelectBody(name);
        } else {
          this.error(`unknown format type '${kind}'; expected 'plural' or 'select'`);
        }
      }
      this.error(`expected '}' or ',' after slot name '${name}'`);
    }
    parseIdentifier() {
      let id = "";
      while (this.pos < this.input.length) {
        const ch = this.input[this.pos];
        if (/[a-zA-Z0-9_-]/.test(ch)) {
          id += ch;
          this.pos++;
        } else {
          break;
        }
      }
      return id;
    }
    parsePluralBody(name) {
      this.expect(",");
      this.skipWhitespace();
      const branches = [];
      let hasOther = false;
      while (this.pos < this.input.length && this.peek() !== "}") {
        this.skipWhitespace();
        if (this.peek() === "}") break;
        const key = this.parsePluralKey();
        this.skipWhitespace();
        if (key === "other") hasOther = true;
        this.expect("{");
        const body = this.parseBranchBody();
        this.expect("}");
        const resolved = resolveOctothorpe(body, name);
        branches.push({ key, body: resolved });
        this.skipWhitespace();
      }
      if (!hasOther) {
        this.error(`plural block for {${name}} missing required 'other' branch`);
      }
      const exactValues = /* @__PURE__ */ new Set();
      const categoryKeys = /* @__PURE__ */ new Set();
      for (const b of branches) {
        if (b.key.startsWith("=")) {
          exactValues.add(parseInt(b.key.slice(1), 10));
        } else {
          categoryKeys.add(b.key);
        }
      }
      if (exactValues.has(1) && categoryKeys.has("one")) {
        this.error(
          `plural block for {${name}} has overlapping branches: '=1' and 'one' both match count == 1 under English plural rules. Remove one \u2014 they handle the same case.`
        );
      }
      this.expect("}");
      return { type: "plural", name, branches };
    }
    parsePluralKey() {
      if (this.peek() === "=") {
        this.advance();
        let num = "";
        while (this.pos < this.input.length && /[0-9]/.test(this.input[this.pos])) {
          num += this.advance();
        }
        if (!num) this.error("expected number after '=' in plural key");
        return `=${num}`;
      }
      const cat = this.parseIdentifier();
      if (!cat) this.error("expected plural category or '=N'");
      if (!ALL_CLDR_CATEGORIES.has(cat)) {
        this.error(
          `unknown plural category '${cat}'; valid CLDR categories: ${[...ALL_CLDR_CATEGORIES].join(" ")}`
        );
      }
      if (ALL_CLDR_CATEGORIES.has(cat) && !ENGLISH_CLDR_CATEGORIES.has(cat)) {
        this.error(
          `plural category '${cat}' is not valid under English plural rules. English CLDR uses only 'one' and 'other'. Hint: use '=N {...}' for specific numeric values, e.g. '=0 {none}' for n=0 or '=2 {pair}' for n=2.`
        );
      }
      return cat;
    }
    parseSelectBody(name) {
      this.expect(",");
      this.skipWhitespace();
      const branches = [];
      let hasOther = false;
      while (this.pos < this.input.length && this.peek() !== "}") {
        this.skipWhitespace();
        if (this.peek() === "}") break;
        const key = this.parseIdentifier();
        if (!key) this.error("expected select branch key");
        this.skipWhitespace();
        if (key === "other") hasOther = true;
        this.expect("{");
        const body = this.parseBranchBody();
        this.expect("}");
        branches.push({ key, body });
        this.skipWhitespace();
      }
      if (!hasOther) {
        this.error(`select block for {${name}} missing required 'other' branch`);
      }
      this.expect("}");
      return { type: "select", name, branches };
    }
  };
  var IcuParseError = class extends Error {
    constructor(msg, input, pos) {
      super(`${msg}
  in "${input}"
  at position ${pos}`);
      this.name = "IcuParseError";
      this.input = input;
      this.position = pos;
    }
  };
  function resolveOctothorpe(nodes, selectorName) {
    return nodes.map((node) => {
      if (node.type === "octothorpe") {
        return { type: "slot", name: selectorName };
      }
      if (node.type === "plural" || node.type === "select") {
        return {
          ...node,
          branches: node.branches.map((b) => ({
            ...b,
            body: resolveOctothorpe(b.body, selectorName)
          }))
        };
      }
      return node;
    });
  }
  function coalesceLiterals(nodes) {
    const result = [];
    for (const node of nodes) {
      if (node.type === "literal" && result.length > 0 && result[result.length - 1].type === "literal") {
        result[result.length - 1].value += node.value;
      } else {
        result.push(node);
      }
    }
    return result;
  }

  // packages/lang/reserved-words.js
  var RESERVED_WORDS = Object.freeze([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
  ]);
  var RESERVED_SET = new Set(RESERVED_WORDS);

  // packages/lang/binding.js
  var DECL_HEADS = /* @__PURE__ */ new Set(["const", "let", "var", "function", "function*"]);
  var ENCLOSING_KINDS = /* @__PURE__ */ new Set(["bind", "import-local"]);
  var SEQUENCE = { kind: "seq" };
  function walkBindings(forms) {
    const out = [];
    walkSequence(forms, out, false);
    return out;
  }
  function withMatchName(inScope, names) {
    return inScope || names.includes("match");
  }
  function walkSequence(forms, out, matchInScope) {
    let current = matchInScope;
    for (const form of forms) {
      walk(form, out, current);
      const hoisted = form?.type === "list" ? hoistedNames(form) : [];
      current = withMatchName(current, hoisted);
    }
  }
  function walk(form, out, matchInScope) {
    if (form?.type !== "list") return;
    const head = form.values[0];
    const headName = head?.type === "atom" && head.binding === void 0 ? head.value : null;
    if (head?.type === "atom" && head.value === "match") {
      if (headName === null || matchInScope) {
        for (const argument of form.values.slice(1)) walk(argument, out, matchInScope);
        return;
      }
      out.push(...bindingsIntroduced(form));
      const args = form.values.slice(1);
      if (args.length > 0) walk(args[0], out, matchInScope);
      for (const clause of args.slice(1)) {
        if (clause?.type !== "list" || clause.values.length === 0) continue;
        const patternSites = matchPatternNames(clause.values[0]);
        const clauseScope = withMatchName(
          matchInScope,
          patternSites.map((site) => site.name)
        );
        const guard = isMatchGuardSlot(clause) ? clause.values[2] : null;
        if (guard !== null) walk(guard, out, clauseScope);
        const bodyStart = guard === null ? 1 : 3;
        walkSequence(clause.values.slice(bodyStart), out, clauseScope);
      }
      return;
    }
    out.push(...bindingsIntroduced(form));
    if (headName === null) {
      const children2 = head?.type === "atom" ? form.values.slice(1) : form.values;
      for (const child of children2) walk(child, out, matchInScope);
      return;
    }
    const plan = bindingScopePlan(form, headName);
    const children = form.values;
    if (plan.kind === "conditional") {
      if (children.length > 1) walk(children[1], out, matchInScope);
      for (const branch of children.slice(2)) walk(branch, out, matchInScope);
      return;
    }
    if (plan.kind === "seq") {
      walkSequence(children, out, matchInScope);
      return;
    }
    const split = Math.min(plan.bodyStart, children.length);
    for (const child of children.slice(0, split)) walk(child, out, matchInScope);
    walkSequence(
      children.slice(split),
      out,
      withMatchName(matchInScope, plan.names)
    );
  }
  function extendBindingEnv(env, names) {
    if (names.length === 0) return env;
    const next = new Set(env);
    for (const name of names) next.add(name);
    return next;
  }
  function bodyScopeNames(form) {
    return bindingsIntroduced(form).filter((site) => site.kind !== "label").map((site) => site.name);
  }
  function hoistedNames(form) {
    return bindingsIntroduced(form).filter((site) => site.kind !== "label" && ENCLOSING_KINDS.has(site.kind)).map((site) => site.name);
  }
  function bindingScopePlan(form, headName) {
    if (form?.type !== "list" || form.values.length === 0) return SEQUENCE;
    switch (headName) {
      case "if":
        return { kind: "conditional" };
      case "for-of":
      case "for-in":
      case "for-await-of":
        return { kind: "body", names: bodyScopeNames(form), bodyStart: 3 };
      case "if-let":
      case "when-let":
      case "match":
        return { kind: "body", names: bodyScopeNames(form), bodyStart: 2 };
      default: {
        const kernel = headName?.startsWith("kernel:") ? headName.slice("kernel:".length) : headName;
        if (headName === "bind" || DECL_HEADS.has(kernel)) return SEQUENCE;
        const names = bodyScopeNames(form);
        return names.length === 0 ? SEQUENCE : { kind: "body", names, bodyStart: 0 };
      }
    }
  }
  function isMatchGuardSlot(clause) {
    return clause?.type === "list" && clause.values.length >= 3 && clause.values[1]?.type === "keyword" && clause.values[1].value === "when";
  }
  function bindingsIntroduced(form) {
    if (form?.type !== "list" || form.values.length === 0) return [];
    const head = form.values[0];
    if (head.type !== "atom") return [];
    const name = head.value;
    const args = form.values.slice(1);
    switch (name) {
      case "bind":
        return bindNames(args);
      case "func":
      case "genfunc":
        return funcClauseParamNames(args);
      case "fn":
      case "lambda":
      case "genfn":
        return args.length > 0 ? paramListNames(args[0]) : [];
      case "for-of":
      case "for-in":
      case "for-await-of":
        return args.length > 0 ? patternNames(args[0], "loop-binding") : [];
      case "class":
        return classNames(args);
      case "type":
        return typeConstructorNames(args);
      // DD-60 refinement (2026-07-06): if-let/when-let binding patterns and match
      // clause patterns bind names too.
      case "if-let":
      case "when-let":
        return ifLetPatternNames(args);
      case "match":
        return matchClauseNames(args);
      // DD-60 refinement #2 (2026-07-06): catch bindings, import locals, labels.
      case "catch":
        return args.length > 0 ? patternNames(args[0], "catch-binding") : [];
      case "import":
        return importLocalNames(args);
      case "label":
        return args[0]?.type === "atom" && args[0].value !== "_" ? [{ name: args[0].value, kind: "label", node: args[0] }] : [];
      default: {
        const kernel = name.startsWith("kernel:") ? name.slice("kernel:".length) : name;
        if (DECL_HEADS.has(kernel) && args.length > 0) {
          return patternNames(args[0], "bind");
        }
        return [];
      }
    }
  }
  function bindNames(args) {
    const out = [];
    if (args.length === 2) return patternNames(args[0], "bind");
    if (args.length === 3) return patternNames(args[1], "bind");
    if (args.length < 4) return [];
    let i = 0;
    while (i < args.length) {
      let slot;
      if (args[i]?.type === "keyword") {
        if (i + 2 >= args.length) return out;
        slot = args[i + 1];
        i += 3;
      } else {
        if (i + 1 >= args.length) return out;
        slot = args[i];
        i += 2;
      }
      out.push(...patternNames(slot, "bind"));
    }
    return out;
  }
  var FUNC_CLAUSE_KEYS = /* @__PURE__ */ new Set([
    "args",
    "yields",
    "returns",
    "pre",
    "post",
    "body"
  ]);
  function funcClauseParamNames(args) {
    const out = [];
    if (args[0]?.type === "atom" && args[0].value !== "_") {
      out.push({ name: args[0].value, kind: "bind", node: args[0] });
    }
    const clauses = args.filter(
      (a) => a?.type === "list" && a.values[0]?.type === "keyword" && FUNC_CLAUSE_KEYS.has(a.values[0].value)
    );
    const scan = clauses.length > 0 ? clauses.map((c) => c.values) : [args];
    for (const seq of scan) {
      for (let i = 0; i < seq.length; i++) {
        if (seq[i]?.type === "keyword" && seq[i].value === "args" && seq[i + 1]?.type === "list") {
          out.push(...paramListNames(seq[i + 1]));
        }
      }
    }
    return out;
  }
  function paramListNames(list) {
    if (list?.type !== "list") return [];
    const out = [];
    for (const el of list.values) {
      if (el.type === "keyword") continue;
      if (el.type === "atom") {
        if (el.value !== "_") out.push({ name: el.value, kind: "param", node: el });
      } else if (el.type === "list") {
        const h = el.values[0]?.type === "atom" ? el.values[0].value : "";
        if (h === "rest" && el.values[1]) {
          out.push(...patternNames(el.values[1], "param"));
        } else if (h === "default" && el.values[2]) {
          out.push(...patternNames(el.values[2], "param"));
        } else if (h === "array" || h === "object") {
          out.push(...patternNames(el, "param"));
        }
      }
    }
    return out;
  }
  function classNames(args) {
    const out = [];
    if (args[0]?.type === "atom" && args[0].value !== "_") {
      out.push({ name: args[0].value, kind: "bind", node: args[0] });
    }
    for (const member of args.slice(1)) {
      if (member?.type !== "list") continue;
      const params = member.values[1];
      if (params?.type === "list") {
        for (const p of params.values) {
          if (p.type === "atom" && p.value !== "_") {
            out.push({ name: p.value, kind: "class-method-param", node: p });
          }
        }
      }
    }
    return out;
  }
  function importLocalNames(args) {
    const out = [];
    const second = args[1];
    if (!second) return out;
    if (second.type === "list") {
      importSpecs(second.values, out);
    } else if (second.type === "atom" && second.value !== "_") {
      out.push({ name: second.value, kind: "import-local", node: second });
      if (args[2]?.type === "list") importSpecs(args[2].values, out);
    }
    return out;
  }
  function importSpecs(specs, out) {
    for (const spec of specs) {
      if (spec.type === "atom") {
        if (spec.value !== "_") {
          out.push({ name: spec.value, kind: "import-local", node: spec });
        }
      } else if (spec.type === "list" && spec.values[0]?.type === "atom" && spec.values[0].value === "alias" && spec.values[2]?.type === "atom") {
        out.push({ name: spec.values[2].value, kind: "import-local", node: spec.values[2] });
      }
    }
  }
  function typeConstructorNames(args) {
    const out = [];
    for (const ctor of args.slice(1)) {
      if (ctor?.type !== "list" || ctor.values.length === 0) continue;
      const head = ctor.values[0];
      if (head.type === "atom" && head.value !== "_") {
        out.push({ name: head.value, kind: "bind", node: head });
      }
      for (const field of ctor.values.slice(1)) {
        if (field.type === "atom" && field.value !== "_") {
          out.push({ name: field.value, kind: "param", node: field });
        }
      }
    }
    return out;
  }
  function ifLetPatternNames(args) {
    const pair = args[0];
    if (pair?.type !== "list" || pair.values.length === 0) return [];
    return matchPatternNames(pair.values[0]);
  }
  function matchClauseNames(args) {
    const out = [];
    for (const clause of args.slice(1)) {
      if (clause?.type === "list" && clause.values.length > 0) {
        out.push(...matchPatternNames(clause.values[0]));
      }
    }
    return out;
  }
  function matchPatternNames(pat) {
    if (pat?.type === "atom") {
      const v = pat.value;
      if (v === "_" || v === "true" || v === "false" || v === "null" || v === "undefined") {
        return [];
      }
      if (/^[A-Z]/.test(v)) return [];
      return [{ name: v, kind: "pattern", node: pat }];
    }
    if (pat?.type !== "list" || pat.values.length === 0) return [];
    const head = pat.values[0];
    if (head.type !== "atom") return [];
    if (head.value === "obj") {
      const out = [];
      for (let i = 1; i + 1 < pat.values.length; i += 2) {
        out.push(...matchPatternNames(pat.values[i + 1]));
      }
      return out;
    }
    if (/^[A-Z]/.test(head.value)) {
      const out = [];
      for (const sub of pat.values.slice(1)) out.push(...matchPatternNames(sub));
      return out;
    }
    return [];
  }
  function bindingNamesInPattern(pat, kind = "bind") {
    return patternNames(pat, kind);
  }
  function patternNames(pat, kind) {
    if (pat?.type === "atom") {
      return pat.value === "_" ? [] : [{ name: pat.value, kind, node: pat }];
    }
    if (pat?.type !== "list") return [];
    const h = pat.values[0]?.type === "atom" ? pat.values[0].value : "";
    if (h !== "array" && h !== "object") return [];
    const out = [];
    for (const el of pat.values.slice(1)) {
      if (el.type === "keyword") continue;
      if (el.type === "atom") {
        if (el.value !== "_") out.push({ name: el.value, kind, node: el });
      } else if (el.type === "list") {
        const ih = el.values[0]?.type === "atom" ? el.values[0].value : "";
        if (ih === "rest" && el.values[1]) {
          out.push(...patternNames(el.values[1], kind));
        } else if (ih === "default" && el.values[2]) {
          out.push(...patternNames(el.values[2], kind));
        } else if (ih === "array" || ih === "object") {
          out.push(...patternNames(el, kind));
        }
      }
    }
    return out;
  }
  var RESERVED_SET2 = new Set(RESERVED_WORDS);
  var KIND_PHRASE = {
    "param": "function parameter",
    "bind": "binding name",
    "loop-binding": "loop binding",
    "class-method-param": "class method parameter",
    "pattern": "pattern binding",
    "catch-binding": "catch binding",
    "import-local": "imported name",
    "label": "label"
  };
  function validateReservedNames(forms) {
    for (const site of walkBindings(forms)) {
      if (RESERVED_SET2.has(site.name)) {
        throw new Error(
          `'${site.name}' is a JavaScript reserved word and cannot be used as a lykn ${KIND_PHRASE[site.kind]}; rename it (e.g. \`${site.name}_\`)`
        );
      }
    }
  }

  // packages/lang/protected-host.js
  var WRITES = /* @__PURE__ */ new Set([
    "set!",
    "set-symbol!",
    "assign",
    "++",
    "--",
    "delete",
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "**=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "&&=",
    "||=",
    "??="
  ]);
  var COMPOUND = /* @__PURE__ */ new Set([
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "**=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "&&=",
    "||=",
    "??="
  ]);
  function pathIs(path, wanted) {
    return path.length === wanted.length && path.every((part, i) => part === wanted[i]);
  }
  function normalizedPath(node, locals, toJsIdentifier2, formHead2) {
    if (node?.type === "atom") {
      const parts = node.value.split(":").map(toJsIdentifier2);
      if (locals.has(parts[0])) return null;
      return parts[0] === "Reflect" || parts[0] === "globalThis" ? parts : null;
    }
    if (node?.type === "list" && node.values.length === 3 && formHead2(node.values[0]) === "get") {
      const base = normalizedPath(node.values[1], locals, toJsIdentifier2, formHead2);
      const key = node.values[2]?.type === "string" ? node.values[2].value : null;
      return base && key !== null ? [...base, key] : null;
    }
    return null;
  }
  function addPatternNames(pattern, names, toJsIdentifier2) {
    if (pattern?.type === "atom") {
      if (!["_", "true", "false", "null", "undefined"].includes(pattern.value)) {
        for (const binding of bindingNamesInPattern(pattern, "param")) names.add(toJsIdentifier2(binding.name));
      }
      return;
    }
    if (pattern?.type !== "list" || pattern.values[0]?.type !== "atom") return;
    const [head, ...parts] = pattern.values;
    if (head.value === "array") {
      for (const part of parts) addPatternNames(part, names, toJsIdentifier2);
    } else if (head.value === "object") {
      for (const part of parts) {
        if (part.type === "atom") {
          addPatternNames(part, names, toJsIdentifier2);
        } else if (part.type === "list") {
          const kind = part.values[0]?.value;
          if (kind === "rest") addPatternNames(part.values[1], names, toJsIdentifier2);
          else if (kind === "default") {
            if (part.values[1]?.type === "atom") names.add(toJsIdentifier2(part.values[1].value));
          } else if (kind === "alias") {
            addPatternNames(part.values[2], names, toJsIdentifier2);
          } else addPatternNames(part, names, toJsIdentifier2);
        }
      }
    } else if (head.value === "default") {
      addPatternNames(parts[0], names, toJsIdentifier2);
    } else if (head.value === "rest") {
      addPatternNames(parts[0], names, toJsIdentifier2);
    } else {
      for (const binding of bindingNamesInPattern(pattern, "param")) names.add(toJsIdentifier2(binding.name));
    }
  }
  function patternNames2(patterns, toJsIdentifier2) {
    const names = /* @__PURE__ */ new Set();
    for (const pattern of patterns) addPatternNames(pattern, names, toJsIdentifier2);
    return names;
  }
  function visitPatternDefaults(pattern, visit) {
    if (pattern?.type !== "list") return;
    const [head, ...parts] = pattern.values;
    if (head?.type !== "atom") return;
    if (head.value === "default") {
      visitPatternDefaults(parts[0], visit);
      if (parts[1]) visit(parts[1]);
      return;
    }
    if (head.value === "rest") {
      visitPatternDefaults(parts[0], visit);
    } else if (head.value === "array") {
      for (const part of parts) visitPatternDefaults(part, visit);
    } else if (head.value === "object") {
      for (const part of parts) {
        if (part?.type !== "list") continue;
        const kind = part.values[0]?.value;
        if (kind === "rest") visitPatternDefaults(part.values[1], visit);
        else if (kind === "default") {
          if (part.values[2]) visit(part.values[2]);
        } else if (kind === "alias") {
          visitPatternDefaults(part.values[2], visit);
          if (part.values[3]) visit(part.values[3]);
        } else visitPatternDefaults(part, visit);
      }
    }
  }
  function isVarDeclaration(node, formHead2) {
    const head = node?.type === "list" ? formHead2(node.values[0]) : null;
    return head === "var" || head === "kernel:var";
  }
  function isFunctionBoundary(node, formHead2) {
    if (node?.type !== "list") return false;
    return ["function", "function*", "fn", "lambda", "genfn", "func", "genfunc", "=>", "class", "class-expr"].includes(formHead2(node.values[0]));
  }
  function objectExecutableChildren(property) {
    if (property?.type !== "list" || property.values.length === 0) return [];
    const [key, value] = property.values;
    if (key?.type === "atom" && key.value === "spread") return value ? [value] : [];
    const children = [];
    if (key?.type === "list") {
      if (key.values[0]?.type === "atom" && key.values[0].value === "computed") {
        if (key.values[1]) children.push(key.values[1]);
      } else {
        children.push(key);
      }
    }
    if (value) children.push(value);
    return children;
  }
  function collectVarNames(forms, names, toJsIdentifier2, formHead2, rawKernel = false) {
    for (const form of forms) {
      if (form?.type !== "list") continue;
      const head = formHead2(form.values[0]);
      if (head === null) {
        collectVarNames(form.values, names, toJsIdentifier2, formHead2, rawKernel);
        continue;
      }
      if (["quote", "quasiquote", "syntax-quote"].includes(head) || isFunctionBoundary(form, formHead2)) continue;
      if (head === "object") {
        for (const property of form.values.slice(1)) {
          collectVarNames(objectExecutableChildren(property), names, toJsIdentifier2, formHead2, rawKernel);
        }
      } else if (isVarDeclaration(form, formHead2) && (!rawKernel || head === "var")) {
        for (const binding of bindingsIntroduced(form)) {
          if (binding.kind === "bind") names.add(toJsIdentifier2(binding.name));
        }
        for (const child of form.values.slice(2)) collectVarNames([child], names, toJsIdentifier2, formHead2, rawKernel);
      } else {
        collectVarNames(form.values.slice(1), names, toJsIdentifier2, formHead2, rawKernel);
      }
    }
  }
  function directScopeNames(forms, toJsIdentifier2, formHead2, moduleScope = false) {
    const names = /* @__PURE__ */ new Set();
    for (const form of forms) {
      if (form?.type !== "list") continue;
      const head = formHead2(form.values[0]);
      if (head === null) continue;
      if (!moduleScope && (head === "var" || head === "kernel:var")) continue;
      for (const binding of bindingsIntroduced(form)) {
        if (binding.kind === "bind" || binding.kind === "import-local") {
          names.add(toJsIdentifier2(binding.name));
        }
      }
    }
    if (moduleScope) collectVarNames(forms, names, toJsIdentifier2, formHead2);
    return names;
  }
  function addKernelModuleDeclaration(form, names, toJsIdentifier2, formHead2) {
    if (form?.type !== "list" || form.values.length === 0) return;
    const head = formHead2(form.values[0]);
    const args = form.values.slice(1);
    if (head === "export") {
      const candidate = args[0]?.type === "atom" && args[0].value === "default" ? args[1] : args[0];
      if (candidate) addKernelModuleDeclaration(candidate, names, toJsIdentifier2, formHead2);
      return;
    }
    if (head === "async") {
      const payload = args[0];
      const payloadHead = payload?.type === "list" ? formHead2(payload.values[0]) : null;
      if (payloadHead === "function" || payloadHead === "function*") {
        addKernelModuleDeclaration(payload, names, toJsIdentifier2, formHead2);
      }
      return;
    }
    if (head === "function" || head === "function*") {
      const name = args[0];
      if (name?.type === "atom" && name.value !== "") {
        names.add(toJsIdentifier2(name.value));
      }
      return;
    }
    if (!["const", "let", "class", "import"].includes(head)) return;
    for (const binding of bindingsIntroduced(form)) {
      if (binding.kind === "bind" || binding.kind === "import-local") {
        names.add(toJsIdentifier2(binding.name));
      }
    }
  }
  function kernelModuleNames(forms, toJsIdentifier2, formHead2) {
    const names = /* @__PURE__ */ new Set();
    for (const form of forms) addKernelModuleDeclaration(form, names, toJsIdentifier2, formHead2);
    collectVarNames(forms, names, toJsIdentifier2, formHead2, true);
    return names;
  }
  function moduleBindsReflect(forms, { toJsIdentifier: toJsIdentifier2, formHead: formHead2 }) {
    return kernelModuleNames(forms, toJsIdentifier2, formHead2).has("Reflect");
  }
  function functionScope(body, params, inherited, toJsIdentifier2, formHead2) {
    const names = directScopeNames(body, toJsIdentifier2, formHead2);
    for (const name of params) names.add(name);
    collectVarNames(body, names, toJsIdentifier2, formHead2);
    for (const name of inherited) names.add(name);
    return names;
  }
  function matchPatternNames2(pattern, names, toJsIdentifier2) {
    if (pattern?.type === "atom") {
      const name = pattern.value;
      if (!["_", "true", "false", "null", "undefined"].includes(name) && !/^[A-Z]/.test(name)) {
        names.add(toJsIdentifier2(name));
      }
      return;
    }
    if (pattern?.type !== "list") return;
    const [head, ...parts] = pattern.values;
    if (head?.type !== "atom") return;
    if (head.value === "obj") {
      for (let i = 1; i < parts.length; i += 2) matchPatternNames2(parts[i], names, toJsIdentifier2);
    } else if (/^[A-Z]/.test(head.value)) {
      for (const part of parts) matchPatternNames2(part, names, toJsIdentifier2);
    }
  }
  function validateProtectedHost(exprs, { toJsIdentifier: toJsIdentifier2, formHead: formHead2 }) {
    const writes = [];
    const visitBody = (forms, scopes, dialect) => {
      const names = directScopeNames(forms, toJsIdentifier2, formHead2);
      visitMany(forms, [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...scopes.at(-1), ...names])], dialect, visit);
    };
    const visit = (node, scopes, dialect = "kernel") => {
      if (node?.type !== "list") return;
      const [headNode, ...args] = node.values;
      const head = formHead2(headNode);
      if (["quote", "quasiquote", "syntax-quote"].includes(head)) return;
      const locals = scopes[scopes.length - 1];
      if (head === "block") {
        visitBody(args, scopes, dialect);
        return;
      }
      if (head === "object") {
        for (const property of args) {
          for (const child of objectExecutableChildren(property)) visit(child, scopes, dialect);
        }
        return;
      }
      if (head === null) {
        visit(headNode, scopes, dialect);
        for (const arg of args) visit(arg, scopes, dialect);
        return;
      }
      if (head === "function" || head === "function*") {
        let paramsIndex;
        let bodyIndex;
        if (head === "function") {
          paramsIndex = 1;
          bodyIndex = 2;
        } else if (args[0]?.type === "list") {
          paramsIndex = 0;
          bodyIndex = 1;
        } else {
          paramsIndex = 1;
          bodyIndex = 2;
        }
        const params = args[paramsIndex]?.type === "list" ? args[paramsIndex].values : [];
        const paramNames = patternNames2(params, toJsIdentifier2);
        const body = args.slice(bodyIndex);
        const functionName = args[0]?.type === "atom" && args[0].value !== "" ? toJsIdentifier2(args[0].value) : null;
        const defaultLocals = /* @__PURE__ */ new Set([...locals, ...paramNames]);
        if (functionName) defaultLocals.add(functionName);
        const defaults = [...scopes.slice(0, -1), defaultLocals];
        for (const param of params) visitPatternDefaults(param, (value) => visit(value, defaults, dialect));
        if (functionName) paramNames.add(functionName);
        const nextScope = functionScope(body, paramNames, locals, toJsIdentifier2, formHead2);
        const next = [...scopes.slice(0, -1), nextScope];
        for (const form of body) visit(form, next, dialect);
        return;
      }
      if (head === "lambda" || head === "fn" || head === "genfn" || head === "=>") {
        const params = args[0]?.type === "list" ? args[0].values : [];
        const paramNames = patternNames2(params, toJsIdentifier2);
        const body = args.slice(1);
        const defaults = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...paramNames])];
        for (const param of params) visitPatternDefaults(param, (value) => visit(value, defaults, dialect));
        const nextScope = functionScope(body, paramNames, locals, toJsIdentifier2, formHead2);
        const next = [...scopes.slice(0, -1), nextScope];
        for (const form of body) visit(form, next, dialect);
        return;
      }
      if (head === "func" || head === "genfunc") {
        for (const arg of args) visit(arg, scopes, dialect);
        return;
      }
      if (head === "class" || head === "class-expr") {
        const classNames2 = new Set(locals);
        const namedClass = head === "class";
        if (namedClass && args[0]?.type === "atom") classNames2.add(toJsIdentifier2(args[0].value));
        const baseIndex = namedClass ? 1 : 0;
        const memberIndex = namedClass ? 2 : 1;
        const next = [...scopes.slice(0, -1), classNames2];
        for (const base of args[baseIndex]?.values ?? []) visit(base, next, dialect);
        for (const member of args.slice(memberIndex)) {
          const visitMember = (entry) => {
            if (entry?.type !== "list" || entry.values.length === 0) return;
            const memberHead = entry.values[0]?.value;
            if (memberHead === "static" || memberHead === "async") {
              if (entry.values[1]) visitMember(entry.values[1]);
              return;
            }
            if (memberHead === "field") {
              if (entry.values[2]) visit(entry.values[2], next, dialect);
              return;
            }
            const accessor = memberHead === "get" || memberHead === "set";
            const paramsIndex = accessor ? 2 : 1;
            const bodyIndex = accessor ? 3 : 2;
            const params = entry.values[paramsIndex]?.type === "list" ? entry.values[paramsIndex].values : [];
            const methodLocals = patternNames2(params, toJsIdentifier2);
            for (const name of classNames2) methodLocals.add(name);
            const body = entry.values.slice(bodyIndex);
            const defaults = [...next.slice(0, -1), /* @__PURE__ */ new Set([...classNames2, ...methodLocals])];
            for (const param of params) visitPatternDefaults(param, (value) => visit(value, defaults, dialect));
            const methodScope = functionScope(body, methodLocals, classNames2, toJsIdentifier2, formHead2);
            const methodScopes = [...next.slice(0, -1), methodScope];
            for (const form of body) visit(form, methodScopes, dialect);
          };
          visitMember(member);
        }
        return;
      }
      if (head === "switch") {
        if (args[0]) visit(args[0], scopes, dialect);
        const cases = args.slice(1).filter((clause) => clause?.type === "list");
        const forms = cases.flatMap((clause) => clause.values.slice(1));
        const caseLocals = directScopeNames(forms, toJsIdentifier2, formHead2);
        const next = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...caseLocals])];
        for (const clause of cases) {
          const test = clause.values[0];
          if (test?.value !== "default") visit(test, next, dialect);
          for (const form of clause.values.slice(1)) visit(form, next, dialect);
        }
        return;
      }
      if (head === "for-of" || head === "for-in" || head === "for-await-of") {
        if (args[1]) visit(args[1], scopes, dialect);
        const loopLocals = patternNames2(args[0]?.type === "list" ? [args[0]] : [args[0]], toJsIdentifier2);
        const next = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...loopLocals])];
        if (args[0]) visit(args[0], next, dialect);
        visitBody(args.slice(2), next, dialect);
        return;
      }
      if (head === "for") {
        const init = args[0];
        const loopLocals = directScopeNames(init ? [init] : [], toJsIdentifier2, formHead2);
        const next = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...loopLocals])];
        for (const arg of args.slice(0, 3)) visit(arg, next, dialect);
        visitBody(args.slice(3), next, dialect);
        return;
      }
      if (head === "while" || head === "do-while") {
        if (args[0]) visit(args[0], scopes, dialect);
        visitBody(args.slice(1), scopes, dialect);
        return;
      }
      if (head === "do") {
        visitBody(args, scopes, dialect);
        return;
      }
      if (head === "try") {
        let bodyEnd = args.length;
        let finalizer = null;
        let handler = null;
        const finalCandidate = args[bodyEnd - 1];
        if (finalCandidate?.type === "list" && finalCandidate.values[0]?.type === "atom" && finalCandidate.values[0].value === "finally") {
          finalizer = finalCandidate.values.slice(1);
          bodyEnd--;
        }
        const catchCandidate = args[bodyEnd - 1];
        if (catchCandidate?.type === "list" && catchCandidate.values[0]?.type === "atom" && catchCandidate.values[0].value === "catch") {
          handler = catchCandidate.values.slice(1);
          bodyEnd--;
        }
        visitBody(args.slice(0, bodyEnd), scopes, dialect);
        if (handler) {
          const catchNames = patternNames2(handler[0]?.type === "list" ? [handler[0]] : [handler[0]], toJsIdentifier2);
          const catchScopes = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...catchNames])];
          visitBody(handler.slice(1), catchScopes, dialect);
        }
        if (finalizer) visitBody(finalizer, scopes, dialect);
        return;
      }
      if (head === "if-let" || head === "when-let") {
        const pair = args[0];
        if (pair?.type === "list") {
          const pattern = pair.values[0];
          const scrutinee = pair.values[1];
          const names = /* @__PURE__ */ new Set();
          matchPatternNames2(pattern, names, toJsIdentifier2);
          if (scrutinee) visit(scrutinee, scopes, dialect);
          const thenScope = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...names])];
          if (head === "if-let") {
            if (args[1]) visitBody([args[1]], thenScope, dialect);
            if (args[2]) visitBody([args[2]], scopes, dialect);
          } else {
            visitBody(args.slice(1), thenScope, dialect);
          }
        }
        return;
      }
      if (head === "match") {
        if (args[0]) visit(args[0], scopes, dialect);
        for (const clause of args.slice(1)) {
          if (clause?.type !== "list") continue;
          const names = /* @__PURE__ */ new Set();
          matchPatternNames2(clause.values[0], names, toJsIdentifier2);
          const next = [...scopes.slice(0, -1), /* @__PURE__ */ new Set([...locals, ...names])];
          visitBody(clause.values.slice(1), next, dialect);
        }
        return;
      }
      const operationDialect = head?.startsWith("kernel:") ? "kernel" : dialect;
      const operation = head?.startsWith("kernel:") ? head.slice(7) : head;
      const addWrite = (target, span = target?.span) => {
        writes.push({ path: normalizedPath(target, locals, toJsIdentifier2, formHead2), span });
      };
      const addPatternWrites = (target) => {
        if (target?.type === "list") {
          const [patternHead, ...parts] = target.values;
          if (["array", "object"].includes(patternHead?.value)) {
            for (const part of parts) {
              if (patternHead.value === "object" && part?.type === "list") {
                const kind = part.values[0]?.value;
                if (kind === "alias") addPatternWrites(part.values[2]);
                else if (kind === "default") addWrite(part.values[1]);
                else if (kind === "rest") addPatternWrites(part.values[1]);
                else for (const child of part.values.slice(1)) addPatternWrites(child);
              } else addPatternWrites(part);
            }
            return;
          }
          if (patternHead?.value === "rest") {
            addPatternWrites(parts[0]);
            return;
          }
          if (patternHead?.value === "default") {
            addPatternWrites(parts[0]);
            if (parts[1]) visit(parts[1], scopes, dialect);
            return;
          }
        }
        addWrite(target);
      };
      if (operation === "set-symbol!" && args[0] && args[1]) {
        const base = normalizedPath(args[0], locals, toJsIdentifier2, formHead2);
        const key = args[1].type === "string" ? args[1].value : null;
        writes.push({ path: base && key !== null ? [...base, key] : null, span: args[0].span });
      } else if (WRITES.has(operation) && operation !== "delete" && operation !== "=" && !COMPOUND.has(operation)) {
        if (args[0]) addPatternWrites(args[0]);
      } else if (COMPOUND.has(operation) && args[0]) {
        addPatternWrites(args[0]);
      } else if (operation === "=" && operationDialect === "kernel" && args[0]) {
        addPatternWrites(args[0]);
      } else if (operation === "delete" && operationDialect === "kernel" && args[0]) {
        addWrite(args[0]);
      }
      for (const arg of args) visit(arg, scopes, dialect);
    };
    const moduleNames = kernelModuleNames(exprs, toJsIdentifier2, formHead2);
    visitMany(exprs, [moduleNames], "kernel", visit);
    let invalidatesAliases = false;
    for (const write of writes) {
      if (pathIs(write.path ?? [], ["globalThis"]) || pathIs(write.path ?? [], ["globalThis", "globalThis"])) {
        invalidatesAliases = true;
      }
    }
    for (const write of writes) {
      const path = write.path;
      if (!path) continue;
      const directReflect = pathIs(path, ["Reflect"]);
      const directApply = pathIs(path, ["Reflect", "apply"]);
      const aliasReflect = pathIs(path, ["globalThis", "Reflect"]);
      const aliasApply = pathIs(path, ["globalThis", "Reflect", "apply"]);
      if (directReflect || directApply || !invalidatesAliases && (aliasReflect || aliasApply)) {
        const slot = directApply || aliasApply ? "Reflect.apply" : "Reflect";
        const error = new Error(`host-contract v1: write to protected slot ${slot}`);
        if (write.span) error.span = write.span;
        throw error;
      }
    }
  }
  function visitMany(forms, scopes, dialect, visit) {
    for (const form of forms) visit(form, scopes, dialect);
  }

  // packages/lang/kernel-mark.js
  var sanctioned = /* @__PURE__ */ new WeakSet();
  function markKernel(node) {
    if (node !== null && typeof node === "object") {
      sanctioned.add(node);
    }
    return node;
  }
  function isKernel(node) {
    return node !== null && typeof node === "object" && sanctioned.has(node);
  }

  // packages/lang/host-invocation.js
  var REFLECT_APPLY_ID = /* @__PURE__ */ Symbol("Reflect.apply");
  var INLINE_APPLY_MODULE = "data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D";
  var PROVISIONAL = /* @__PURE__ */ new WeakMap();
  var EXPANDED_REQUESTS = /* @__PURE__ */ new WeakMap();
  var active = null;
  function markExpandedHostCall(node) {
    if (!node || node.type !== "list" || EXPANDED_REQUESTS.has(node)) {
      throw new TypeError("invalid private expanded host invocation request");
    }
    EXPANDED_REQUESTS.set(node, REFLECT_APPLY_ID);
    return node;
  }
  function materializeExpandedHostCalls(forms, {
    toJsIdentifier: toJsIdentifier2,
    formHead: formHead2,
    moduleBindsReflect: moduleBindsReflect2,
    validateProtectedHost: validateProtectedHost2
  }) {
    const nodes = [];
    const seen = /* @__PURE__ */ new Set();
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(visit);
      if (node.type === "list" && EXPANDED_REQUESTS.has(node)) {
        if (seen.has(node)) throw new Error("duplicate expanded host invocation request");
        seen.add(node);
        nodes.push(node);
      }
      if (node.type === "list") node.values.forEach(visit);
      else if (node.type === "cons") {
        visit(node.car);
        visit(node.cdr);
      }
    };
    forms.forEach(visit);
    if (nodes.length === 0) return forms;
    const names = /* @__PURE__ */ new Set();
    const collect = (node) => {
      if (!node || typeof node !== "object") return;
      if (node.type === "atom") {
        for (const segment of node.value.split(":")) names.add(toJsIdentifier2(segment));
      } else if (node.type === "list") node.values.forEach(collect);
      else if (node.type === "cons") {
        collect(node.car);
        collect(node.cdr);
      }
    };
    forms.forEach(collect);
    for (const node of nodes) validateAnchor(node);
    validateProtectedHost2(forms, { toJsIdentifier: toJsIdentifier2, formHead: formHead2 });
    let index = 0;
    while (names.has(`lyknHostReflectApply${index}`)) index++;
    const helper = `lyknHostReflectApply${index}`;
    for (const node of nodes) {
      const id = EXPANDED_REQUESTS.get(node);
      if (id !== REFLECT_APPLY_ID) throw new Error("unsupported protected invocation ID");
      node.values = [{ type: "atom", value: helper }, ...node.values];
      EXPANDED_REQUESTS.delete(node);
    }
    const support = moduleBindsReflect2(forms, { toJsIdentifier: toJsIdentifier2, formHead: formHead2 }) ? markKernel({
      type: "list",
      values: [
        { type: "atom", value: "import" },
        { type: "string", value: INLINE_APPLY_MODULE },
        { type: "list", values: [{ type: "list", values: [
          { type: "atom", value: "alias" },
          { type: "atom", value: "apply" },
          { type: "atom", value: helper }
        ] }] }
      ]
    }) : markKernel({
      type: "list",
      values: [
        { type: "atom", value: "function" },
        { type: "atom", value: helper },
        { type: "list", values: ["fn", "receiver", "argv"].map((value) => ({ type: "atom", value })) },
        { type: "list", values: [
          { type: "atom", value: "return" },
          { type: "list", values: [
            { type: "atom", value: "Reflect:apply" },
            { type: "atom", value: "fn" },
            { type: "atom", value: "receiver" },
            { type: "atom", value: "argv" }
          ] }
        ] }
      ]
    });
    let directiveEnd = 0;
    while (directiveEnd < forms.length && forms[directiveEnd]?.type === "string") directiveEnd++;
    forms.splice(directiveEnd, 0, support);
    return forms;
  }
  function requestedHostCall(node, compileExpr2) {
    const request = active?.byNode.get(node);
    if (!request) return null;
    if (active.consumed.has(request)) throw new Error("host invocation request consumed twice");
    active.consumed.add(request);
    const call = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "__lyknHostInvocationPending__" },
      arguments: node.values.map((value) => compileExpr2(value, "expression")),
      optional: false
    };
    PROVISIONAL.set(call, request);
    return call;
  }
  function finalizeHostInvocations(program, exprs) {
    if (active === null) return program;
    if (active.finalized) throw new Error("host invocation plan finalized more than once");
    if (active.exprs !== exprs) throw new Error("host invocation plan belongs to a different unit");
    if (active.consumed.size !== active.requests.size) {
      throw new Error("orphaned or unconsumed host invocation request");
    }
    const names = /* @__PURE__ */ new Set();
    const calls = [];
    visitAst(program, (node) => {
      if (node.type === "Identifier") names.add(node.name);
      if (node.type === "CallExpression" && PROVISIONAL.has(node)) calls.push(node);
    });
    const needsInlineImport = hasModuleReflectBinding(program);
    if (calls.length !== active.requests.size) {
      throw new Error("orphaned or duplicate provisional host invocation call");
    }
    let index = 0;
    while (names.has(`lyknHostReflectApply${index}`)) index++;
    const helperName = `lyknHostReflectApply${index}`;
    for (const call of calls) {
      const request = PROVISIONAL.get(call);
      if (!active.requests.has(request)) throw new Error("unknown provisional host invocation");
      call.callee = { type: "Identifier", name: helperName };
      PROVISIONAL.delete(call);
    }
    const support = needsInlineImport ? {
      type: "ImportDeclaration",
      specifiers: [{
        type: "ImportSpecifier",
        imported: { type: "Identifier", name: "apply" },
        local: { type: "Identifier", name: helperName }
      }],
      source: { type: "Literal", value: INLINE_APPLY_MODULE }
    } : {
      type: "FunctionDeclaration",
      id: { type: "Identifier", name: helperName },
      params: [
        { type: "Identifier", name: "fn" },
        { type: "Identifier", name: "receiver" },
        { type: "Identifier", name: "argv" }
      ],
      body: {
        type: "BlockStatement",
        body: [{
          type: "ReturnStatement",
          argument: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: { type: "Identifier", name: "Reflect" },
              property: { type: "Identifier", name: "apply" },
              computed: false,
              optional: false
            },
            arguments: [
              { type: "Identifier", name: "fn" },
              { type: "Identifier", name: "receiver" },
              { type: "Identifier", name: "argv" }
            ],
            optional: false
          }
        }]
      },
      generator: false,
      async: false
    };
    let directiveEnd = 0;
    while (directiveEnd < program.body.length && program.body[directiveEnd].type === "ExpressionStatement" && program.body[directiveEnd].expression.type === "Literal" && typeof program.body[directiveEnd].expression.value === "string") {
      directiveEnd++;
    }
    program.body.splice(directiveEnd, 0, support);
    active.finalized = true;
    return program;
  }
  function validateAnchor(node) {
    if (node.type !== "list" || node.values.length !== 3) {
      throw new Error("host invocation request must anchor an exact three-part call");
    }
    for (const [index, operand] of node.values.entries()) {
      if (operand.type !== "atom") {
        throw new Error("host invocation operands must be stable atom references");
      }
      const name = operand.value;
      if (name.length === 0 || name.includes(":") || ["this", "super", "true", "false", "null"].includes(name) || name === "undefined" && index !== 1) {
        throw new Error("host invocation operands must be stable atom references");
      }
    }
  }
  function visitAst(root, visit) {
    const seen = /* @__PURE__ */ new Set();
    function walk2(value) {
      if (!value || typeof value !== "object" || seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) {
        for (const item of value) walk2(item);
        return;
      }
      if (typeof value.type === "string") visit(value);
      for (const [key, child] of Object.entries(value)) {
        if (key !== "loc" && key !== "start" && key !== "end") walk2(child);
      }
    }
    walk2(root);
  }
  function patternNames3(pattern, names) {
    if (!pattern) return;
    if (pattern.type === "Identifier") names.add(pattern.name);
    else if (pattern.type === "RestElement") patternNames3(pattern.argument, names);
    else if (pattern.type === "AssignmentPattern") patternNames3(pattern.left, names);
    else if (pattern.type === "ArrayPattern") pattern.elements.forEach((item) => patternNames3(item, names));
    else if (pattern.type === "ObjectPattern") {
      for (const property of pattern.properties) {
        if (property.type === "RestElement") patternNames3(property.argument, names);
        else patternNames3(property.value, names);
      }
    }
  }
  function hasModuleReflectBinding(program) {
    const names = /* @__PURE__ */ new Set();
    function collectVar(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(collectVar);
      if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression" || node.type === "ClassDeclaration" || node.type === "ClassExpression") return;
      if (node.type === "VariableDeclaration" && node.kind === "var") {
        node.declarations.forEach((decl) => patternNames3(decl.id, names));
      }
      for (const [key, child] of Object.entries(node)) {
        if (key !== "loc" && key !== "start" && key !== "end") collectVar(child);
      }
    }
    for (const statement of program.body) {
      let declaration = statement;
      if (declaration.type === "ExportNamedDeclaration" || declaration.type === "ExportDefaultDeclaration") declaration = declaration.declaration;
      if (!declaration) continue;
      if (declaration.type === "ImportDeclaration") {
        declaration.specifiers.forEach((specifier) => patternNames3(specifier.local, names));
      } else if (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") {
        patternNames3(declaration.id, names);
      } else if (declaration.type === "VariableDeclaration" && declaration.kind !== "var") {
        declaration.declarations.forEach((decl) => patternNames3(decl.id, names));
      }
      collectVar(declaration);
    }
    return names.has("Reflect");
  }

  // packages/lang/compiler.js
  function formHead(node) {
    return node && node.type === "atom" && node.binding === void 0 ? node.value : null;
  }
  function buildImportSpecifier(node) {
    if (node.type === "atom") {
      const name = toJsIdentifier(node.value);
      return {
        type: "ImportSpecifier",
        imported: { type: "Identifier", name },
        local: { type: "Identifier", name }
      };
    }
    if (node.type === "list" && node.values.length >= 2 && node.values[0].type === "atom" && node.values[0].value === "alias") {
      return {
        type: "ImportSpecifier",
        imported: { type: "Identifier", name: toJsIdentifier(node.values[1].value) },
        local: { type: "Identifier", name: toJsIdentifier(node.values[2].value) }
      };
    }
    throw new Error("import: each specifier must be a name or (alias original local)");
  }
  function buildExportNames(namesNode, sourceNode) {
    const items = namesNode.values.slice(1);
    const specifiers = items.map((item) => {
      if (item.type === "atom") {
        const name = toJsIdentifier(item.value);
        return {
          type: "ExportSpecifier",
          local: { type: "Identifier", name },
          exported: { type: "Identifier", name }
        };
      }
      if (item.type === "list" && item.values.length >= 2 && item.values[0].type === "atom" && item.values[0].value === "alias") {
        return {
          type: "ExportSpecifier",
          local: { type: "Identifier", name: toJsIdentifier(item.values[1].value) },
          exported: { type: "Identifier", name: toJsIdentifier(item.values[2].value) }
        };
      }
      throw new Error("export names: each item must be a name or (alias local exported)");
    });
    return {
      type: "ExportNamedDeclaration",
      declaration: null,
      specifiers,
      source: sourceNode ? { type: "Literal", value: sourceNode.value } : null
    };
  }
  function toClassKey(name) {
    const converted = toJsIdentifier(name);
    if (name.startsWith("-")) {
      return { type: "PrivateIdentifier", name: converted };
    }
    return { type: "Identifier", name: converted };
  }
  function makeTemplateElement(raw, tail) {
    const escaped = raw.replaceAll("\\", "\\\\").replaceAll("\r", "\\r").replaceAll("`", "\\`").replaceAll("$", "\\$");
    return {
      type: "TemplateElement",
      value: { raw: escaped, cooked: raw },
      tail
    };
  }
  function templateConcat(args) {
    const quasis = [];
    const expressions = [];
    let currentSegment = "";
    for (let i = 0; i < args.length; i++) {
      if (args[i].type === "string") {
        currentSegment += args[i].value;
      } else {
        quasis.push(makeTemplateElement(currentSegment, false));
        currentSegment = "";
        expressions.push(compileExpr(args[i], "expression"));
      }
    }
    quasis.push(makeTemplateElement(currentSegment, true));
    return {
      type: "TemplateLiteral",
      quasis,
      expressions
    };
  }
  var _icuGensymCounter = 0;
  function freshIcuVar() {
    return { type: "Identifier", name: `_v${_icuGensymCounter++}` };
  }
  function templateIcu(args) {
    _icuGensymCounter = 0;
    const icuString = args[0].value;
    let mft;
    try {
      mft = parseIcu(icuString);
    } catch (e) {
      if (e instanceof IcuParseError) {
        throw e;
      }
      throw e;
    }
    const slotNames = collectSlotNames(mft);
    const kwargs = /* @__PURE__ */ new Map();
    for (let i = 1; i < args.length; i += 2) {
      if (args[i].type !== "keyword") {
        throw new Error(
          `template: expected keyword argument at position ${i}, got ${args[i].type}`
        );
      }
      const key = args[i].value;
      if (kwargs.has(key)) {
        throw new Error(`template: duplicate keyword argument :${key}`);
      }
      if (i + 1 >= args.length) {
        throw new Error(`template: keyword :${key} has no value`);
      }
      kwargs.set(key, compileExpr(args[i + 1], "expression"));
    }
    for (const name of slotNames) {
      if (!kwargs.has(name)) {
        throw new Error(
          `template: no binding for slot {${name}}
  in (template "${icuString}" ...)
  expected slots: ${[...slotNames].join(", ")}
  provided kwargs: ${kwargs.size > 0 ? [...kwargs.keys()].join(", ") : "(none)"}
  hint: add :${name} <value> to the template call`
        );
      }
    }
    for (const key of kwargs.keys()) {
      if (!slotNames.has(key)) {
        throw new Error(
          `template: unused keyword argument :${key}
  in (template "${icuString}" ...)
  expected slots: ${[...slotNames].join(", ")}
  provided kwargs: ${[...kwargs.keys()].join(", ")}
  hint: remove :${key}, or add a {${key}} slot to the template`
        );
      }
    }
    const slotMultiplicity = countSlotReferences(mft);
    const hoistedDecls = [];
    const finalKwargs = /* @__PURE__ */ new Map();
    for (const [key, expr] of kwargs) {
      const refs = slotMultiplicity.get(key) ?? 0;
      const isTrivial = expr.type === "Identifier" || expr.type === "Literal";
      if (refs > 1 && !isTrivial) {
        const local = { type: "Identifier", name: `_${toJsIdentifier(key)}` };
        hoistedDecls.push({
          type: "VariableDeclaration",
          kind: "const",
          declarations: [{ type: "VariableDeclarator", id: local, init: expr }]
        });
        finalKwargs.set(key, local);
      } else {
        finalKwargs.set(key, expr);
      }
    }
    const body = emitMft(mft, finalKwargs);
    if (hoistedDecls.length === 0) {
      return body;
    }
    return {
      type: "CallExpression",
      callee: {
        type: "ArrowFunctionExpression",
        params: [],
        body: {
          type: "BlockStatement",
          body: [...hoistedDecls, { type: "ReturnStatement", argument: body }]
        },
        expression: false
      },
      arguments: []
    };
  }
  function emitMft(nodes, kwargs) {
    if (nodes.every((n) => n.type === "literal")) {
      const text = nodes.map((n) => n.value).join("");
      return { type: "TemplateLiteral", quasis: [makeTemplateElement(text, true)], expressions: [] };
    }
    const quasis = [];
    const expressions = [];
    let currentSegment = "";
    for (const node of nodes) {
      if (node.type === "literal") {
        currentSegment += node.value;
      } else if (node.type === "slot") {
        quasis.push(makeTemplateElement(currentSegment, false));
        currentSegment = "";
        expressions.push(kwargs.get(node.name));
      } else if (node.type === "plural") {
        quasis.push(makeTemplateElement(currentSegment, false));
        currentSegment = "";
        expressions.push(emitPluralIife(node, kwargs));
      } else if (node.type === "select") {
        quasis.push(makeTemplateElement(currentSegment, false));
        currentSegment = "";
        expressions.push(emitSelectIife(node, kwargs));
      }
    }
    quasis.push(makeTemplateElement(currentSegment, true));
    return { type: "TemplateLiteral", quasis, expressions };
  }
  function emitPluralIife(node, kwargs) {
    const valueExpr = kwargs.get(node.name);
    const vId = freshIcuVar();
    const body = [];
    body.push({
      type: "VariableDeclaration",
      declarations: [{
        type: "VariableDeclarator",
        id: vId,
        init: valueExpr
      }],
      kind: "const"
    });
    const exactBranches = node.branches.filter((b) => b.key.startsWith("="));
    const categoryBranches = node.branches.filter((b) => !b.key.startsWith("="));
    for (const branch of exactBranches) {
      const n = parseInt(branch.key.slice(1), 10);
      body.push({
        type: "IfStatement",
        test: { type: "BinaryExpression", operator: "===", left: vId, right: { type: "Literal", value: n } },
        consequent: { type: "ReturnStatement", argument: emitMft(branch.body, makeSlotOverride(kwargs, node.name, vId)) }
      });
    }
    for (const branch of categoryBranches) {
      if (branch.key === "other") continue;
      const test = pluralCategoryTest(branch.key, vId);
      if (test) {
        body.push({
          type: "IfStatement",
          test,
          consequent: { type: "ReturnStatement", argument: emitMft(branch.body, makeSlotOverride(kwargs, node.name, vId)) }
        });
      }
    }
    const otherBranch = categoryBranches.find((b) => b.key === "other");
    body.push({
      type: "ReturnStatement",
      argument: emitMft(otherBranch.body, makeSlotOverride(kwargs, node.name, vId))
    });
    return {
      type: "CallExpression",
      callee: {
        type: "ArrowFunctionExpression",
        params: [],
        body: { type: "BlockStatement", body },
        expression: false
      },
      arguments: []
    };
  }
  function emitSelectIife(node, kwargs) {
    const valueExpr = kwargs.get(node.name);
    const vId = freshIcuVar();
    const body = [];
    body.push({
      type: "VariableDeclaration",
      declarations: [{
        type: "VariableDeclarator",
        id: vId,
        init: valueExpr
      }],
      kind: "const"
    });
    for (const branch of node.branches) {
      if (branch.key === "other") continue;
      body.push({
        type: "IfStatement",
        test: { type: "BinaryExpression", operator: "===", left: vId, right: { type: "Literal", value: branch.key } },
        consequent: { type: "ReturnStatement", argument: emitMft(branch.body, makeSlotOverride(kwargs, node.name, vId)) }
      });
    }
    const otherBranch = node.branches.find((b) => b.key === "other");
    body.push({
      type: "ReturnStatement",
      argument: emitMft(otherBranch.body, makeSlotOverride(kwargs, node.name, vId))
    });
    return {
      type: "CallExpression",
      callee: {
        type: "ArrowFunctionExpression",
        params: [],
        body: { type: "BlockStatement", body },
        expression: false
      },
      arguments: []
    };
  }
  function pluralCategoryTest(category, vId) {
    if (category === "one") {
      return { type: "BinaryExpression", operator: "===", left: vId, right: { type: "Literal", value: 1 } };
    }
    return null;
  }
  function countSlotReferences(nodes, counts = /* @__PURE__ */ new Map()) {
    for (const node of nodes) {
      if (node.type === "slot") {
        counts.set(node.name, (counts.get(node.name) ?? 0) + 1);
      } else if (node.type === "plural" || node.type === "select") {
        counts.set(node.name, (counts.get(node.name) ?? 0) + 1);
        for (const branch of node.branches) {
          countSlotReferences(branch.body, counts);
        }
      }
    }
    return counts;
  }
  function makeSlotOverride(kwargs, name, replacement) {
    const copy = new Map(kwargs);
    copy.set(name, replacement);
    return copy;
  }
  var MACRO_OVERRIDES = /* @__PURE__ */ new Map([["->", "threadFirst"], ["->>", "threadLast"]]);
  var PREDICATE_PREFIXES = ["is-", "has-", "can-", "should-", "will-", "does-", "was-", "had-"];
  var MULTI_CHAR_ESCAPES = [["->", "To"], ["<-", "From"]];
  var PUNCTUATION_TABLE = /* @__PURE__ */ new Map([
    ["?", "QMARK"],
    ["!", "BANG"],
    ["*", "STAR"],
    ["+", "PLUS"],
    ["=", "EQ"],
    ["<", "LT"],
    [">", "GT"],
    ["&", "AMP"],
    ["%", "PCT"],
    ["/", "SLASH"]
  ]);
  function toJsIdentifier(str) {
    const override = MACRO_OVERRIDES.get(str);
    if (override !== void 0) return override;
    const len = str.length;
    if (len === 0) return "";
    let predicateMode = false;
    const last = str[len - 1];
    let working;
    if (last === "?" && len > 1) {
      predicateMode = true;
      working = str.slice(0, len - 1);
    } else if (last === "!" && len > 1) {
      working = str.slice(0, len - 1);
    } else {
      working = str;
    }
    if (predicateMode) {
      let hasPrefix = false;
      for (let p = 0; p < PREDICATE_PREFIXES.length; p++) {
        if (working.startsWith(PREDICATE_PREFIXES[p])) {
          hasPrefix = true;
          break;
        }
      }
      if (!hasPrefix) working = "is-" + working;
    }
    let out = "";
    let i = 0;
    let capNext = false;
    const wLen = working.length;
    while (i < wLen && working[i] === "-") {
      out += "_";
      i++;
    }
    if (i === wLen) return out;
    let trailingHyphens = 0;
    {
      let j = wLen;
      while (j > i && working[j - 1] === "-") {
        trailingHyphens++;
        j--;
      }
    }
    const bodyEnd = wLen - trailingHyphens;
    while (i < bodyEnd) {
      let matchedMulti = false;
      for (let m = 0; m < MULTI_CHAR_ESCAPES.length; m++) {
        const [pattern, abbrev2] = MULTI_CHAR_ESCAPES[m];
        if (working.startsWith(pattern, i)) {
          for (let a = 0; a < abbrev2.length; a++) {
            if (capNext) {
              out += abbrev2[a].toUpperCase();
              capNext = false;
            } else {
              out += abbrev2[a];
            }
          }
          capNext = true;
          i += pattern.length;
          matchedMulti = true;
          break;
        }
      }
      if (matchedMulti) continue;
      const ch = working[i];
      const abbrev = PUNCTUATION_TABLE.get(ch);
      if (abbrev !== void 0) {
        for (let a = 0; a < abbrev.length; a++) {
          if (capNext) {
            out += abbrev[a].toUpperCase();
            capNext = false;
          } else {
            out += abbrev[a];
          }
        }
        capNext = true;
        i++;
        continue;
      }
      if (ch === "-") {
        capNext = true;
        i++;
        continue;
      }
      if (capNext) {
        out += ch.toUpperCase();
        capNext = false;
      } else {
        out += ch;
      }
      i++;
    }
    for (let t = 0; t < trailingHyphens; t++) out += "_";
    return out;
  }
  function makeVarDecl(kind, args) {
    return {
      type: "VariableDeclaration",
      kind,
      declarations: [{
        type: "VariableDeclarator",
        id: compilePattern(args[0]),
        init: args[1] ? compileExpr(args[1], "expression") : null
      }]
    };
  }
  function checkLoopBinding(binding, form) {
    if (binding && binding.type === "list" && binding.values.length > 0 && binding.values[0].type === "atom" && // A6-exempt: structural — a kernel declaration wrapper (const/let/var) in
    // a loop-binding slot, not a form-vs-call head dispatch.
    (binding.values[0].value === "const" || binding.values[0].value === "let" || binding.values[0].value === "var")) {
      const kind = binding.values[0].value;
      throw new Error(
        `${form} binding must not be wrapped in \`${kind}\` \u2014 the loop already binds with \`const\`; use the bare binding`
      );
    }
  }
  function makeForOf(isAwait, args) {
    const form = isAwait ? "for-await-of" : "for-of";
    checkLoopBinding(args[0], form);
    if (args.length < 3) {
      throw new Error(`${form} requires binding, iterable, and body`);
    }
    const binding = compilePattern(args[0]);
    return {
      type: "ForOfStatement",
      left: {
        type: "VariableDeclaration",
        kind: "const",
        declarations: [{
          type: "VariableDeclarator",
          id: binding,
          init: null
        }]
      },
      right: compileExpr(args[1], "expression"),
      body: {
        type: "BlockStatement",
        body: args.slice(2).map((e) => toStatement(compileExpr(e)))
      },
      await: isAwait
    };
  }
  var macros = {
    // Variable declarations: (var x 1), (const x 1), (let x 1)
    "var"(args) {
      return makeVarDecl("var", args);
    },
    "const"(args) {
      return makeVarDecl("const", args);
    },
    "let"(args) {
      return makeVarDecl("let", args);
    },
    // Computed member access: (get obj key)
    "get"(args) {
      if (args.length !== 2) {
        throw new Error("get requires exactly 2 arguments: (get object key)");
      }
      return {
        type: "MemberExpression",
        object: compileExpr(args[0], "expression"),
        property: compileExpr(args[1], "expression"),
        computed: true
      };
    },
    // Method call: (. obj method arg1 arg2 ...) → obj.method(arg1, arg2, ...)
    "."(args) {
      if (args.length < 2) {
        throw new Error(". requires at least 2 arguments: (. object method ...)");
      }
      const obj = compileExpr(args[0], "expression");
      const methodName = args[1].type === "atom" ? toJsIdentifier(args[1].value) : args[1].type === "string" ? args[1].value : (() => {
        throw new Error(". method name must be an atom or string");
      })();
      const methodArgs = args.slice(2).map(compileExpr);
      return {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: obj,
          property: { type: "Identifier", name: methodName },
          computed: false
        },
        arguments: methodArgs,
        optional: false
      };
    },
    // Arrow function: (=> (a b) (+ a b))
    "=>"(args) {
      const params = args[0].type === "list" ? args[0].values.map(compileParam) : [];
      const bodyExprs = args.slice(1);
      if (bodyExprs.length === 1) {
        const compiled = compileExpr(bodyExprs[0], "expression");
        return {
          type: "ArrowFunctionExpression",
          params,
          body: compiled,
          expression: true,
          async: false
        };
      }
      return {
        type: "ArrowFunctionExpression",
        params,
        body: {
          type: "BlockStatement",
          body: bodyExprs.map((e) => toStatement(compileExpr(e)))
        },
        expression: false,
        async: false
      };
    },
    // Lambda: (lambda (a b) (return (+ a b)))
    "lambda"(args) {
      const params = args[0].type === "list" ? args[0].values.map(compileParam) : [];
      const bodyExprs = args.slice(1);
      return {
        type: "FunctionExpression",
        id: null,
        params,
        body: {
          type: "BlockStatement",
          body: bodyExprs.map((e) => toStatement(compileExpr(e)))
        },
        async: false
      };
    },
    // Return: (return expr)
    "return"(args) {
      return {
        type: "ReturnStatement",
        argument: args[0] ? compileExpr(args[0], "expression") : null
      };
    },
    // If: (if cond then else) — DD-50 position-aware
    "if"(args, position) {
      if (position === "expression") {
        if (!args[2]) {
          throw new Error("if in expression position requires an else branch \u2014 add an else branch, or restructure as a statement");
        }
        const test = compileExpr(args[0], "expression");
        const consequent = compileExpr(args[1], "expression");
        const alternate = compileExpr(args[2], "expression");
        if (isExpressionNode(consequent) && isExpressionNode(alternate)) {
          return { type: "ConditionalExpression", test, consequent, alternate };
        }
        return buildIfIIFE(
          test,
          consequent,
          alternate,
          [test, consequent, alternate].some(containsCurrentAwaitNode)
        );
      }
      return {
        type: "IfStatement",
        test: compileExpr(args[0], "expression"),
        consequent: compileIfBranch(args[1]),
        alternate: args[2] ? compileIfBranch(args[2]) : null
      };
    },
    // Block: (block stmt1 stmt2 ...)
    "block"(args) {
      return {
        type: "BlockStatement",
        body: args.map((e) => toStatement(compileExpr(e)))
      };
    },
    // Do block: (do stmt1 stmt2 ... final) — DD-50 Rule 4
    "do"(args, position) {
      if (args.length === 0) {
        return position === "expression" ? { type: "Identifier", name: "undefined" } : { type: "EmptyStatement" };
      }
      if (position === "expression") {
        const stmts = args.slice(0, -1).map((e) => toStatement(compileExpr(e)));
        const value = compileExpr(args[args.length - 1], "expression");
        const isAsync = [...stmts, value].some(containsCurrentAwaitNode);
        const isStatement = value.type.endsWith("Statement") || value.type.endsWith("Declaration");
        const tail = isAsync ? boxCurrentScopeReturns(value) : value;
        const last = isStatement ? tail : {
          type: "ReturnStatement",
          argument: isAsync ? { type: "ArrayExpression", elements: [tail] } : value
        };
        const transformedStmts = isAsync ? stmts.map(boxCurrentScopeReturns) : stmts;
        const call = {
          type: "CallExpression",
          callee: {
            type: "ArrowFunctionExpression",
            params: [],
            body: {
              type: "BlockStatement",
              body: isAsync ? [...transformedStmts, last, boxedUndefinedReturn()] : [...stmts, last]
            },
            expression: false,
            async: isAsync
          },
          arguments: [],
          optional: false
        };
        return isAsync ? unboxAwaitedValue({ type: "AwaitExpression", argument: call }) : call;
      }
      return {
        type: "BlockStatement",
        body: args.map((e) => toStatement(compileExpr(e)))
      };
    },
    // Assignment: (= x 5) or (= (object a b) obj)
    "="(args) {
      if (args.length !== 2) {
        throw new Error("= requires exactly 2 arguments");
      }
      const leftNode = args[0];
      const isPattern = leftNode.type === "list" && leftNode.values.length > 0 && leftNode.values[0].type === "atom" && (leftNode.values[0].value === "object" || leftNode.values[0].value === "array");
      return {
        type: "AssignmentExpression",
        operator: "=",
        left: isPattern ? compilePattern(leftNode) : compileExpr(leftNode, "expression"),
        right: compileExpr(args[1], "expression")
      };
    },
    // Explicit assignment: (assign this:prop value) — class body only
    "assign"(args) {
      if (args.length !== 2) {
        throw new Error("assign requires exactly 2 arguments");
      }
      if (args[0].type !== "atom" || !args[0].value.includes(":")) {
        throw new Error(
          "assign can only be used for property assignment (e.g., this:name) inside class bodies \u2014 use set! for mutation elsewhere"
        );
      }
      return {
        type: "AssignmentExpression",
        operator: "=",
        left: compileExpr(args[0], "expression"),
        right: compileExpr(args[1], "expression")
      };
    },
    // New: (new Thing arg1 arg2)
    "new"(args) {
      return {
        type: "NewExpression",
        callee: compileExpr(args[0], "expression"),
        arguments: args.slice(1).map(compileExpr)
      };
    },
    // Array literal: (array 1 2 3)
    "array"(args) {
      return {
        type: "ArrayExpression",
        elements: args.map(compileExpr)
      };
    },
    // Function declaration: (function name (params) body...)
    "function"(args) {
      if (args.length < 3) {
        throw new Error("function requires a name, params list, and body: (function name (params) body...)");
      }
      if (args[0].type !== "atom") {
        throw new Error(`function name must be an identifier, not a ${args[0].type}`);
      }
      if (args[1].type !== "list") {
        throw new Error("function params must be a list: (function name (params) body...)");
      }
      const params = args[1].values.map(compileParam);
      const bodyExprs = args.slice(2);
      return {
        type: "FunctionDeclaration",
        id: { type: "Identifier", name: toJsIdentifier(args[0].value) },
        params,
        body: {
          type: "BlockStatement",
          body: bodyExprs.map((e) => toStatement(compileExpr(e)))
        },
        async: false,
        generator: false
      };
    },
    // Generator function: (function* name (params) body...) or (function* (params) body...)
    "function*"(args) {
      if (args.length < 2) {
        throw new Error("function* requires params and body");
      }
      if (args[0].type === "atom" && args[0].value !== "") {
        if (args.length < 3 || args[1].type !== "list") {
          throw new Error("function* requires a name, params list, and body: (function* name (params) body...)");
        }
        const params2 = args[1].values.map(compileParam);
        const bodyExprs2 = args.slice(2);
        return {
          type: "FunctionDeclaration",
          id: { type: "Identifier", name: toJsIdentifier(args[0].value) },
          params: params2,
          body: {
            type: "BlockStatement",
            body: bodyExprs2.map((e) => toStatement(compileExpr(e)))
          },
          async: false,
          generator: true
        };
      }
      const paramIdx = args[0].type === "list" ? 0 : 1;
      if (args[paramIdx].type !== "list") {
        throw new Error("function* params must be a list");
      }
      const params = args[paramIdx].values.map(compileParam);
      const bodyExprs = args.slice(paramIdx + 1);
      return {
        type: "FunctionExpression",
        id: null,
        params,
        body: {
          type: "BlockStatement",
          body: bodyExprs.map((e) => toStatement(compileExpr(e)))
        },
        async: false,
        generator: true
      };
    },
    // Async wrapper: (async (function/function*/lambda/=> ...))
    "async"(args) {
      if (args.length !== 1) {
        throw new Error("async takes exactly one argument: (async (function/lambda/=> ...))");
      }
      const child = args[0];
      if (child.type !== "list" || child.values.length === 0) {
        throw new Error("async argument must be a function form: (async (function/lambda/=> ...))");
      }
      const head = child.values[0];
      if (head.type !== "atom" || !["function", "function*", "lambda", "=>"].includes(head.value)) {
        throw new Error(
          `async can only wrap function, function*, lambda, or =>: got ${head.type === "atom" ? head.value : head.type}`
        );
      }
      const compiled = compileExpr(child, "expression");
      compiled.async = true;
      return compiled;
    },
    // Await expression: (await expr)
    "await"(args) {
      if (args.length !== 1) {
        throw new Error("await takes exactly one argument");
      }
      return {
        type: "AwaitExpression",
        argument: compileExpr(args[0], "expression")
      };
    },
    // Yield: (yield expr) or (yield)
    "yield"(args) {
      return {
        type: "YieldExpression",
        argument: args.length > 0 ? compileExpr(args[0], "expression") : null,
        delegate: false
      };
    },
    // Yield delegate: (yield* expr)
    "yield*"(args) {
      if (args.length !== 1) {
        throw new Error("yield* takes exactly one argument");
      }
      return {
        type: "YieldExpression",
        argument: compileExpr(args[0], "expression"),
        delegate: true
      };
    },
    // Import: (import "mod" ...) — various forms
    "import"(args) {
      if (args.length === 0) {
        throw new Error("import requires at least a module path");
      }
      if (args[0].type !== "string") {
        throw new Error("import: first argument must be a module path string");
      }
      const source = { type: "Literal", value: args[0].value };
      const specifiers = [];
      if (args.length === 1) {
      } else if (args.length === 2) {
        if (args[1].type === "atom") {
          specifiers.push({
            type: "ImportDefaultSpecifier",
            local: { type: "Identifier", name: toJsIdentifier(args[1].value) }
          });
        } else if (args[1].type === "list") {
          for (const spec of args[1].values) {
            specifiers.push(buildImportSpecifier(spec));
          }
        } else {
          throw new Error("import: second argument must be a name or list of names");
        }
      } else if (args.length === 3) {
        if (args[1].type !== "atom") {
          throw new Error("import: default import name must be an identifier");
        }
        if (args[2].type !== "list") {
          throw new Error("import: named imports must be a list");
        }
        specifiers.push({
          type: "ImportDefaultSpecifier",
          local: { type: "Identifier", name: toJsIdentifier(args[1].value) }
        });
        for (const spec of args[2].values) {
          specifiers.push(buildImportSpecifier(spec));
        }
      } else {
        throw new Error("import: too many arguments");
      }
      return {
        type: "ImportDeclaration",
        specifiers,
        source
      };
    },
    // Export: (export ...) — various forms
    "export"(args) {
      if (args.length === 0) {
        throw new Error("export requires an argument");
      }
      if (args[0].type === "atom" && args[0].value === "default") {
        if (args.length !== 2) {
          throw new Error("export default takes exactly one expression");
        }
        return {
          type: "ExportDefaultDeclaration",
          declaration: compileExpr(args[1], "expression")
        };
      }
      if (args[0].type === "string") {
        if (args.length !== 2 || args[1].type !== "list") {
          throw new Error('export re-export: (export "mod" (names ...))');
        }
        return buildExportNames(args[1], args[0]);
      }
      if (args[0].type === "list" && args[0].values.length > 0 && args[0].values[0].type === "atom" && args[0].values[0].value === "names") {
        return buildExportNames(args[0], null);
      }
      if (args.length === 1 && args[0].type === "atom") {
        const name = toJsIdentifier(args[0].value);
        return {
          type: "ExportNamedDeclaration",
          declaration: null,
          specifiers: [{
            type: "ExportSpecifier",
            local: { type: "Identifier", name },
            exported: { type: "Identifier", name }
          }],
          source: null
        };
      }
      if (args.length === 1) {
        const decl = compileExpr(args[0], "expression");
        return {
          type: "ExportNamedDeclaration",
          declaration: decl,
          specifiers: [],
          source: null
        };
      }
      throw new Error("export: unrecognized form");
    },
    // Dynamic import expression: (dynamic-import expr)
    "dynamic-import"(args) {
      if (args.length !== 1) {
        throw new Error("dynamic-import takes exactly one argument");
      }
      return {
        type: "ImportExpression",
        source: compileExpr(args[0], "expression")
      };
    },
    // Throw: (throw expr)
    "throw"(args) {
      if (args.length !== 1) {
        throw new Error("throw takes exactly one argument");
      }
      return {
        type: "ThrowStatement",
        argument: compileExpr(args[0], "expression")
      };
    },
    // Try/catch/finally: (try body... (catch e body...) (finally body...))
    "try"(args) {
      if (args.length === 0) {
        throw new Error("try requires a body");
      }
      let handler = null;
      let finalizer = null;
      let bodyEnd = args.length;
      const lastArg = args[args.length - 1];
      if (lastArg.type === "list" && lastArg.values.length > 0 && lastArg.values[0].type === "atom" && lastArg.values[0].value === "finally") {
        finalizer = {
          type: "BlockStatement",
          body: lastArg.values.slice(1).map((e) => toStatement(compileExpr(e)))
        };
        bodyEnd--;
      }
      if (bodyEnd > 0) {
        const catchArg = args[bodyEnd - 1];
        if (catchArg.type === "list" && catchArg.values.length > 0 && catchArg.values[0].type === "atom" && catchArg.values[0].value === "catch") {
          const catchParam = catchArg.values[1];
          handler = {
            type: "CatchClause",
            param: compileExpr(catchParam),
            body: {
              type: "BlockStatement",
              body: catchArg.values.slice(2).map((e) => toStatement(compileExpr(e)))
            }
          };
          bodyEnd--;
        }
      }
      if (!handler && !finalizer) {
        throw new Error("try requires at least a catch or finally clause");
      }
      return {
        type: "TryStatement",
        block: {
          type: "BlockStatement",
          body: args.slice(0, bodyEnd).map((e) => toStatement(compileExpr(e)))
        },
        handler,
        finalizer
      };
    },
    // While: (while test body...)
    "while"(args) {
      if (args.length < 2) {
        throw new Error("while requires a test and body");
      }
      return {
        type: "WhileStatement",
        test: compileExpr(args[0], "expression"),
        body: {
          type: "BlockStatement",
          body: args.slice(1).map((e) => toStatement(compileExpr(e)))
        }
      };
    },
    // Do-while: (do-while test body...) — test first for consistency with while
    "do-while"(args) {
      if (args.length < 2) {
        throw new Error("do-while requires a test and body");
      }
      return {
        type: "DoWhileStatement",
        test: compileExpr(args[0], "expression"),
        body: {
          type: "BlockStatement",
          body: args.slice(1).map((e) => toStatement(compileExpr(e)))
        }
      };
    },
    // C-style for: (for init test update body...)
    "for"(args) {
      if (args.length < 4) {
        throw new Error("for requires init, test, update, and body: (for init test update body...)");
      }
      const init = args[0].type === "list" && args[0].values.length === 0 ? null : compileExpr(args[0], "expression");
      const test = args[1].type === "list" && args[1].values.length === 0 ? null : compileExpr(args[1], "expression");
      const update = args[2].type === "list" && args[2].values.length === 0 ? null : compileExpr(args[2], "expression");
      return {
        type: "ForStatement",
        init,
        test,
        update,
        body: {
          type: "BlockStatement",
          body: args.slice(3).map((e) => toStatement(compileExpr(e)))
        }
      };
    },
    // For-of / for-await-of: (for-of binding iterable body...) / (for-await-of binding iterable body...)
    "for-of"(args) {
      return makeForOf(false, args);
    },
    "for-await-of"(args) {
      return makeForOf(true, args);
    },
    // For-in: (for-in binding object body...)
    "for-in"(args) {
      checkLoopBinding(args[0], "for-in");
      if (args.length < 3) {
        throw new Error("for-in requires binding, object, and body");
      }
      const binding = compilePattern(args[0]);
      return {
        type: "ForInStatement",
        left: {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [{
            type: "VariableDeclarator",
            id: binding,
            init: null
          }]
        },
        right: compileExpr(args[1], "expression"),
        body: {
          type: "BlockStatement",
          body: args.slice(2).map((e) => toStatement(compileExpr(e)))
        }
      };
    },
    // Break: (break) or (break label)
    "break"(args) {
      return {
        type: "BreakStatement",
        label: args.length > 0 ? { type: "Identifier", name: toJsIdentifier(args[0].value) } : null
      };
    },
    // Continue: (continue) or (continue label)
    "continue"(args) {
      return {
        type: "ContinueStatement",
        label: args.length > 0 ? { type: "Identifier", name: toJsIdentifier(args[0].value) } : null
      };
    },
    // Switch: (switch expr (test body...) ... (default body...))
    "switch"(args) {
      if (args.length < 2) {
        throw new Error("switch requires a discriminant and at least one case");
      }
      const discriminant = compileExpr(args[0], "expression");
      const cases = args.slice(1).map((caseNode) => {
        if (caseNode.type !== "list" || caseNode.values.length === 0) {
          throw new Error("switch: each case must be a list (test body...)");
        }
        const headNode = caseNode.values[0];
        const isDefault = headNode.type === "atom" && headNode.value === "default";
        const test = isDefault ? null : compileExpr(headNode, "expression");
        const consequent = caseNode.values.slice(1).map((e) => toStatement(compileExpr(e)));
        return {
          type: "SwitchCase",
          test,
          consequent
        };
      });
      return {
        type: "SwitchStatement",
        discriminant,
        cases
      };
    },
    // Ternary: (? test consequent alternate)
    "?"(args) {
      if (args.length !== 3) {
        throw new Error("? (ternary) requires exactly 3 arguments: (? test then else)");
      }
      return {
        type: "ConditionalExpression",
        test: compileExpr(args[0], "expression"),
        consequent: compileExpr(args[1], "expression"),
        alternate: compileExpr(args[2], "expression")
      };
    },
    // Prefix increment: (++ x)
    "++"(args) {
      if (args.length !== 1) {
        throw new Error("++ takes exactly one argument");
      }
      return {
        type: "UpdateExpression",
        operator: "++",
        argument: compileExpr(args[0], "expression"),
        prefix: true
      };
    },
    // Prefix decrement: (-- x)
    "--"(args) {
      if (args.length !== 1) {
        throw new Error("-- takes exactly one argument");
      }
      return {
        type: "UpdateExpression",
        operator: "--",
        argument: compileExpr(args[0], "expression"),
        prefix: true
      };
    },
    // Label: (label name body)
    "label"(args) {
      if (args.length !== 2) {
        throw new Error("label requires a name and body: (label name body)");
      }
      return {
        type: "LabeledStatement",
        label: { type: "Identifier", name: toJsIdentifier(args[0].value) },
        body: toStatement(compileExpr(args[1]))
      };
    },
    // Debugger: (debugger)
    "debugger"(args) {
      if (args.length !== 0) {
        throw new Error("debugger takes no arguments");
      }
      return {
        type: "DebuggerStatement"
      };
    },
    // Sequence expression: (seq expr1 expr2 ...)
    "seq"(args) {
      if (args.length < 2) {
        throw new Error("seq requires at least 2 expressions");
      }
      return {
        type: "SequenceExpression",
        expressions: args.map(compileExpr)
      };
    },
    // Regex literal: (regex pattern) or (regex pattern flags)
    "regex"(args) {
      if (args.length < 1 || args.length > 2) {
        throw new Error("regex takes 1 or 2 arguments: (regex pattern) or (regex pattern flags)");
      }
      if (args[0].type !== "string") {
        throw new Error("regex pattern must be a string");
      }
      const pattern = args[0].value;
      const flags = args.length === 2 ? args[1].type === "string" ? args[1].value : String(args[1].value) : "";
      return {
        type: "Literal",
        value: null,
        regex: { pattern, flags }
      };
    },
    // Template literal: (template "Hello, " name "!")
    // ICU mode:  (template "Hello, {name}!" :name n)
    // Concat mode: (template "Hello, " name "!")
    // Dispatch: DD-54 §Dispatch rule
    "template"(args) {
      if (args.length === 0) {
        return {
          type: "TemplateLiteral",
          quasis: [makeTemplateElement("", true)],
          expressions: []
        };
      }
      if (args[0].type === "string") {
        if (args.length === 1) {
          const mft = parseIcu(args[0].value);
          const slotNames = collectSlotNames(mft);
          if (slotNames.size > 0) {
            throw new Error(
              `template: no binding for slot {${[...slotNames][0]}}
  in (template "${args[0].value}")
  expected slots: ${[...slotNames].join(", ")}
  provided kwargs: (none)
  hint: add :${[...slotNames][0]} <value> to the template call`
            );
          }
          return emitMft(mft, /* @__PURE__ */ new Map());
        } else if (args.length >= 2 && args[1].type === "keyword") {
          if (args.length === 2) {
            throw new Error(
              `template: ambiguous form
  arg 0 is a literal string and arg 1 is a keyword (:${args[1].value}) with no
  following value, which matches both ICU mode (missing kwarg value)
  and concat mode (keyword as positional arg).
  hint:
    - for ICU mode, add a value: (template "${args[0].value}" :${args[1].value} <expr>)
    - for concat mode, use string concatenation instead`
            );
          }
          return templateIcu(args);
        }
      }
      return templateConcat(args);
    },
    // Tagged template literal: (tag fn (template ...))
    "tag"(args) {
      if (args.length !== 2) {
        throw new Error("tag requires exactly 2 arguments: (tag function (template ...))");
      }
      if (args[1].type !== "list" || args[1].values.length === 0 || args[1].values[0].type !== "atom" || args[1].values[0].value !== "template") {
        throw new Error("tag: second argument must be a (template ...) form");
      }
      const tag = compileExpr(args[0], "expression");
      const quasi = compileExpr(args[1], "expression");
      return {
        type: "TaggedTemplateExpression",
        tag,
        quasi
      };
    },
    // Spread element: (spread expr)
    "spread"(args) {
      if (args.length !== 1) {
        throw new Error("spread takes exactly one argument");
      }
      return {
        type: "SpreadElement",
        argument: compileExpr(args[0], "expression")
      };
    },
    // Default parameter value: (default name value)
    "default"(args) {
      if (args.length !== 2) {
        throw new Error("default requires exactly 2 arguments: (default name value)");
      }
      return {
        type: "AssignmentPattern",
        left: compileExpr(args[0], "expression"),
        right: compileExpr(args[1], "expression")
      };
    },
    // Class declaration: (class Name (Super) body...)
    "class"(args) {
      if (args.length < 2) {
        throw new Error("class requires a name and superclass list: (class Name (Super) body...)");
      }
      if (args[0].type !== "atom") {
        throw new Error("class name must be an identifier");
      }
      if (args[1].type !== "list") {
        throw new Error("class superclass must be a list: () for no extends, (Super) for extends");
      }
      const name = { type: "Identifier", name: toJsIdentifier(args[0].value) };
      const superClass = args[1].values.length > 0 ? compileExpr(args[1].values[0], "expression") : null;
      return {
        type: "ClassDeclaration",
        id: name,
        superClass,
        body: {
          type: "ClassBody",
          body: compileClassBody(args.slice(2))
        }
      };
    },
    // Class expression: (class-expr (Super) body...)
    "class-expr"(args) {
      if (args.length < 1) {
        throw new Error("class-expr requires a superclass list: (class-expr (Super) body...)");
      }
      if (args[0].type !== "list") {
        throw new Error("class-expr superclass must be a list");
      }
      const superClass = args[0].values.length > 0 ? compileExpr(args[0].values[0], "expression") : null;
      return {
        type: "ClassExpression",
        id: null,
        superClass,
        body: {
          type: "ClassBody",
          body: compileClassBody(args.slice(1))
        }
      };
    },
    // Rest element: (rest x) — for function params
    "rest"(args) {
      if (args.length !== 1) {
        throw new Error("rest takes exactly one argument");
      }
      return {
        type: "RestElement",
        argument: compileExpr(args[0], "expression")
      };
    },
    // Object literal: (object (name "Duncan") (age 42)) — grouped pairs
    "object"(args) {
      const properties = [];
      for (const child of args) {
        if (child.type === "atom") {
          const name = toJsIdentifier(child.value);
          properties.push({
            type: "Property",
            key: { type: "Identifier", name },
            value: { type: "Identifier", name },
            kind: "init",
            computed: false,
            shorthand: true,
            method: false
          });
        } else if (child.type === "list") {
          if (child.values.length === 0) {
            throw new Error("object: empty sub-list is not allowed");
          }
          if (child.values[0].type === "atom" && child.values[0].value === "spread") {
            if (child.values.length !== 2) {
              throw new Error("spread takes exactly one argument");
            }
            properties.push({
              type: "SpreadElement",
              argument: compileExpr(child.values[1], "expression")
            });
            continue;
          }
          if (child.values[0].type === "list") {
            const innerList = child.values[0];
            if (innerList.values.length === 2 && innerList.values[0].type === "atom" && innerList.values[0].value === "computed") {
              if (child.values.length !== 2) {
                throw new Error("object: computed property requires a value: ((computed key) value)");
              }
              properties.push({
                type: "Property",
                key: compileExpr(innerList.values[1], "expression"),
                value: compileExpr(child.values[1], "expression"),
                kind: "init",
                computed: true,
                shorthand: false,
                method: false
              });
              continue;
            }
          }
          if (child.values.length === 1) {
            throw new Error(
              `object: single-element sub-list (${child.values[0].type === "atom" ? child.values[0].value : "..."}) is ambiguous \u2014 use a bare atom for shorthand`
            );
          }
          if (child.values.length !== 2) {
            throw new Error(`object: each property must be (key value), got ${child.values.length} elements`);
          }
          const keyNode = child.values[0];
          properties.push({
            type: "Property",
            key: keyNode.type === "atom" ? { type: "Identifier", name: toJsIdentifier(keyNode.value) } : compileExpr(keyNode, "expression"),
            value: compileExpr(child.values[1], "expression"),
            kind: "init",
            computed: false,
            shorthand: false,
            method: false
          });
        } else {
          throw new Error("object: each element must be an atom (shorthand) or a list (key value)");
        }
      }
      return { type: "ObjectExpression", properties };
    }
  };
  function compileIfBranch(node) {
    const compiled = compileExpr(node);
    if (compiled.type === "BlockStatement") return compiled;
    return {
      type: "BlockStatement",
      body: [toStatement(compiled)]
    };
  }
  var binaryOps = [
    "+",
    "-",
    "*",
    "/",
    "%",
    "**",
    "===",
    "!==",
    "==",
    "!=",
    "<",
    ">",
    "<=",
    ">=",
    "&&",
    "||",
    "??",
    "&",
    "|",
    "^",
    "<<",
    ">>",
    ">>>",
    "in",
    "instanceof"
  ];
  for (const op of binaryOps) {
    macros[op] = (args) => {
      const type = op === "&&" || op === "||" || op === "??" ? "LogicalExpression" : "BinaryExpression";
      let result = {
        type,
        operator: op,
        left: compileExpr(args[0], "expression"),
        right: compileExpr(args[1], "expression")
      };
      for (let i = 2; i < args.length; i++) {
        result = { type, operator: op, left: result, right: compileExpr(args[i], "expression") };
      }
      return result;
    };
  }
  for (const op of ["!", "~", "typeof", "void", "delete"]) {
    macros[op] = (args) => ({
      type: "UnaryExpression",
      operator: op,
      prefix: true,
      argument: compileExpr(args[0], "expression")
    });
  }
  var compoundAssignOps = [
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "**=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "&&=",
    "||=",
    "??="
  ];
  for (const op of compoundAssignOps) {
    macros[op] = (args) => {
      if (args.length !== 2) {
        throw new Error(`${op} takes exactly 2 arguments`);
      }
      return {
        type: "AssignmentExpression",
        operator: op,
        left: compileExpr(args[0], "expression"),
        right: compileExpr(args[1], "expression")
      };
    };
  }
  function isExpressionNode(node) {
    if (!node) return false;
    return !node.type.endsWith("Statement") && !node.type.endsWith("Declaration");
  }
  function buildIfIIFE(test, consequent, alternate, isAsync = false) {
    const wrapBranch = (node) => isExpressionNode(node) ? { type: "ReturnStatement", argument: isAsync ? { type: "ArrayExpression", elements: [node] } : node } : toStatement(isAsync ? boxCurrentScopeReturns(node) : node);
    const result = {
      type: "CallExpression",
      callee: {
        type: "ArrowFunctionExpression",
        params: [],
        body: {
          type: "BlockStatement",
          body: [{
            type: "IfStatement",
            test,
            consequent: { type: "BlockStatement", body: [wrapBranch(consequent)] },
            alternate: { type: "BlockStatement", body: [wrapBranch(alternate)] }
          }, ...isAsync ? [boxedUndefinedReturn()] : []]
        },
        expression: false,
        async: isAsync
      },
      arguments: [],
      optional: false
    };
    return isAsync ? unboxAwaitedValue({ type: "AwaitExpression", argument: result }) : result;
  }
  function containsCurrentAwaitNode(node) {
    if (!node || typeof node !== "object") return false;
    if (node.type === "AwaitExpression") return true;
    if (node.type === "ForOfStatement" && node.await) return true;
    if (["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(node.type)) {
      return false;
    }
    if (node.type === "ClassDeclaration" || node.type === "ClassExpression") {
      return containsCurrentAwaitNode(node.superClass) || node.body.body.some((member) => containsCurrentAwaitNode(member));
    }
    if (node.type === "MethodDefinition") {
      return node.computed && containsCurrentAwaitNode(node.key);
    }
    if (node.type === "PropertyDefinition") {
      return node.computed && containsCurrentAwaitNode(node.key) || node.static && containsCurrentAwaitNode(node.value);
    }
    if (node.type === "StaticBlock") {
      return node.body.some((statement) => containsCurrentAwaitNode(statement));
    }
    return Object.values(node).some((value) => Array.isArray(value) ? value.some((child) => containsCurrentAwaitNode(child)) : containsCurrentAwaitNode(value));
  }
  function boxedUndefinedReturn() {
    return {
      type: "ReturnStatement",
      argument: {
        type: "ArrayExpression",
        elements: [{ type: "Identifier", name: "undefined" }]
      }
    };
  }
  function boxCurrentScopeReturns(node) {
    if (!node || typeof node !== "object") return node;
    if ([
      "FunctionDeclaration",
      "FunctionExpression",
      "ArrowFunctionExpression",
      "ClassDeclaration",
      "ClassExpression"
    ].includes(node.type)) return node;
    if (node.type === "ReturnStatement") {
      return {
        ...node,
        argument: {
          type: "ArrayExpression",
          elements: [node.argument || { type: "Identifier", name: "undefined" }]
        }
      };
    }
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.map((child) => boxCurrentScopeReturns(child)) : value && typeof value === "object" ? boxCurrentScopeReturns(value) : value
    ]));
  }
  function unboxAwaitedValue(awaitedBox) {
    return {
      type: "CallExpression",
      callee: {
        type: "ArrowFunctionExpression",
        params: [{ type: "Identifier", name: "__lykn_value_box" }],
        body: {
          type: "MemberExpression",
          object: { type: "Identifier", name: "__lykn_value_box" },
          property: { type: "Literal", value: 0 },
          computed: true,
          optional: false
        },
        expression: true,
        async: false
      },
      arguments: [awaitedBox],
      optional: false
    };
  }
  function toStatement(node) {
    if (!node) return { type: "EmptyStatement" };
    if (node.type.endsWith("Statement") || node.type.endsWith("Declaration")) {
      return node;
    }
    return { type: "ExpressionStatement", expression: node };
  }
  function compileExpr(node, position = "statement") {
    if (!node) return { type: "Literal", value: null };
    const requested = requestedHostCall(node, compileExpr);
    if (requested) return requested;
    switch (node.type) {
      case "number":
        return { type: "Literal", value: node.value };
      case "string":
        return { type: "Literal", value: node.value };
      case "keyword":
        return { type: "Literal", value: toJsIdentifier(node.value) };
      case "atom": {
        const val = node.value;
        if (val === "true") return { type: "Literal", value: true };
        if (val === "false") return { type: "Literal", value: false };
        if (val === "null") return { type: "Literal", value: null };
        if (val === "undefined") return { type: "Identifier", name: "undefined" };
        if (val === "this") return { type: "ThisExpression" };
        if (val === "super") return { type: "Super" };
        if (val.includes(":")) {
          if (val === ":") {
            throw new Error("Bare colon is not a valid identifier");
          }
          if (val.endsWith(":")) {
            throw new Error("Trailing colon in member expression");
          }
          const segments = val.split(":");
          for (const seg of segments) {
            if (seg === "") {
              throw new Error("Empty segment in colon syntax (consecutive colons)");
            }
            if (/^\d/.test(seg)) {
              throw new Error(
                `Numeric segment "${seg}" in colon syntax \u2014 use (get obj ${seg}) for computed access`
              );
            }
          }
          const first2 = segments[0];
          let result;
          if (first2 === "this") {
            result = { type: "ThisExpression" };
          } else if (first2 === "super") {
            result = { type: "Super" };
          } else {
            result = { type: "Identifier", name: toJsIdentifier(first2) };
          }
          for (let i = 1; i < segments.length; i++) {
            const seg = segments[i];
            const isPrivate = seg.startsWith("-");
            const propName = toJsIdentifier(seg);
            result = {
              type: "MemberExpression",
              object: result,
              property: isPrivate ? { type: "PrivateIdentifier", name: propName } : { type: "Identifier", name: propName },
              computed: false
            };
          }
          return result;
        }
        return { type: "Identifier", name: toJsIdentifier(val) };
      }
      case "list": {
        if (node.values.length === 0) {
          return { type: "ArrayExpression", elements: [] };
        }
        const head = node.values[0];
        const rest2 = node.values.slice(1);
        const headName = formHead(head);
        if (headName !== null && macros[headName]) {
          return macros[headName](rest2, position);
        }
        return {
          type: "CallExpression",
          callee: compileExpr(head, "expression"),
          arguments: rest2.map((a) => compileExpr(a, "expression")),
          optional: false
        };
      }
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
  function compileParam(node) {
    if (!node) return null;
    if (node.type === "atom") {
      return { type: "Identifier", name: toJsIdentifier(node.value) };
    }
    return compilePattern(node);
  }
  function compilePattern(node) {
    if (!node) return null;
    switch (node.type) {
      case "atom": {
        const val = node.value;
        if (val === "_") return null;
        if (val === "true" || val === "false" || val === "null" || val === "undefined") {
          return compileExpr(node);
        }
        return { type: "Identifier", name: toJsIdentifier(val) };
      }
      case "list": {
        if (node.values.length === 0) {
          return { type: "ObjectPattern", properties: [] };
        }
        const head = node.values[0];
        const rest2 = node.values.slice(1);
        if (head.type !== "atom") {
          throw new Error("Unrecognized pattern form: expected object, array, default, rest, or alias");
        }
        switch (head.value) {
          case "object":
            return compileObjectPattern(rest2);
          case "array":
            return compileArrayPattern(rest2);
          case "default":
            if (rest2.length !== 2) {
              throw new Error("default in pattern requires 2 arguments: (default name value)");
            }
            return {
              type: "AssignmentPattern",
              left: compilePattern(rest2[0]),
              right: compileExpr(rest2[1], "expression")
            };
          case "rest":
            if (rest2.length !== 1) {
              throw new Error("rest requires exactly 1 argument: (rest name)");
            }
            return {
              type: "RestElement",
              argument: compilePattern(rest2[0])
            };
          case "alias":
            throw new Error("alias can only appear inside an object pattern");
          default:
            return compileExpr(node);
        }
      }
      default:
        return compileExpr(node);
    }
  }
  function compileObjectPattern(children) {
    const properties = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === "atom") {
        const name = toJsIdentifier(child.value);
        properties.push({
          type: "Property",
          key: { type: "Identifier", name },
          value: { type: "Identifier", name },
          kind: "init",
          computed: false,
          shorthand: true,
          method: false
        });
      } else if (child.type === "list") {
        if (child.values.length === 0) {
          throw new Error("Empty sub-list in object pattern");
        }
        const head = child.values[0];
        if (head.type === "atom" && head.value === "rest") {
          if (child.values.length !== 2) {
            throw new Error("rest requires exactly 1 argument");
          }
          if (i !== children.length - 1) {
            throw new Error("rest must be the last element in an object pattern");
          }
          properties.push({
            type: "RestElement",
            argument: compilePattern(child.values[1])
          });
          continue;
        }
        if (head.type === "atom" && head.value === "default") {
          if (child.values.length !== 3) {
            throw new Error("default in object pattern: (default name value)");
          }
          const propName = toJsIdentifier(child.values[1].value);
          properties.push({
            type: "Property",
            key: { type: "Identifier", name: propName },
            value: {
              type: "AssignmentPattern",
              left: { type: "Identifier", name: propName },
              right: compileExpr(child.values[2], "expression")
            },
            kind: "init",
            computed: false,
            shorthand: true,
            method: false
          });
          continue;
        }
        if (head.type === "atom" && head.value === "alias") {
          if (child.values.length < 3 || child.values.length > 4) {
            throw new Error("alias: (alias key local) or (alias key local default)");
          }
          const key = toJsIdentifier(child.values[1].value);
          let valueNode = compilePattern(child.values[2]);
          if (child.values.length === 4) {
            valueNode = {
              type: "AssignmentPattern",
              left: valueNode,
              right: compileExpr(child.values[3], "expression")
            };
          }
          properties.push({
            type: "Property",
            key: { type: "Identifier", name: key },
            value: valueNode,
            kind: "init",
            computed: false,
            shorthand: false,
            method: false
          });
          continue;
        }
        throw new Error(
          `object pattern: each element must be an atom (shorthand), (alias ...), (default ...), or (rest ...). Got: (${head.type === "atom" ? head.value : head.type} ...)`
        );
      } else {
        throw new Error(`object pattern: unexpected ${child.type}`);
      }
    }
    return { type: "ObjectPattern", properties };
  }
  function compileArrayPattern(children) {
    const elements = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === "atom") {
        if (child.value === "_") {
          elements.push(null);
        } else {
          elements.push({ type: "Identifier", name: toJsIdentifier(child.value) });
        }
      } else if (child.type === "list") {
        if (child.values.length === 0) {
          throw new Error("Empty sub-list in array pattern");
        }
        const head = child.values[0];
        if (head.type === "atom" && head.value === "rest") {
          if (child.values.length !== 2) {
            throw new Error("rest requires exactly 1 argument");
          }
          if (i !== children.length - 1) {
            throw new Error("rest must be the last element in an array pattern");
          }
          elements.push({
            type: "RestElement",
            argument: compilePattern(child.values[1])
          });
          continue;
        }
        if (head.type === "atom" && head.value === "default") {
          if (child.values.length !== 3) {
            throw new Error("default in array pattern: (default name value)");
          }
          elements.push({
            type: "AssignmentPattern",
            left: compilePattern(child.values[1]),
            right: compileExpr(child.values[2], "expression")
          });
          continue;
        }
        elements.push(compilePattern(child));
      } else {
        elements.push(compileExpr(child));
      }
    }
    return { type: "ArrayPattern", elements };
  }
  function compileClassBody(elements) {
    return elements.map((el) => compileClassMember(el, false));
  }
  function compileClassMember(node, isStatic) {
    if (node.type !== "list" || node.values.length === 0) {
      throw new Error("Class body element must be a non-empty list");
    }
    const head = node.values[0];
    if (head.type !== "atom") {
      throw new Error("Class body element must start with an atom");
    }
    const headVal = head.value;
    if (headVal === "static") {
      if (node.values.length !== 2) {
        throw new Error("static wraps exactly one class member: (static (member ...))");
      }
      return compileClassMember(node.values[1], true);
    }
    if (headVal === "async") {
      if (node.values.length !== 2) {
        throw new Error("async in class body wraps exactly one method");
      }
      const inner = node.values[1];
      if (inner.type !== "list" || inner.values.length === 0) {
        throw new Error("async must wrap a method definition");
      }
      const innerHead = inner.values[0];
      if (innerHead.type === "atom" && (innerHead.value === "get" || innerHead.value === "set")) {
        const member2 = compileMethodDef(inner, innerHead.value, isStatic);
        member2.value.async = true;
        return member2;
      }
      const member = compileMethodDef(inner, "method", isStatic);
      member.value.async = true;
      return member;
    }
    if (headVal === "field") {
      if (node.values.length < 2 || node.values.length > 3) {
        throw new Error("field: (field name) or (field name value)");
      }
      const fieldName = node.values[1].value;
      const key = toClassKey(fieldName);
      const value = node.values.length === 3 ? compileExpr(node.values[2]) : null;
      return {
        type: "PropertyDefinition",
        key,
        value,
        computed: false,
        static: isStatic
      };
    }
    if (headVal === "get" || headVal === "set") {
      return compileMethodDef(node, headVal, isStatic);
    }
    return compileMethodDef(node, "method", isStatic);
  }
  function compileMethodDef(node, kind, isStatic) {
    const isAccessor = kind === "get" || kind === "set";
    const nameIdx = isAccessor ? 1 : 0;
    const paramsIdx = isAccessor ? 2 : 1;
    const bodyIdx = isAccessor ? 3 : 2;
    const minLen = isAccessor ? 4 : 3;
    if (node.values.length < minLen) {
      const label = isAccessor ? `${kind} accessor` : "Method";
      const form = isAccessor ? `(${kind} name (params) body...)` : "(name (params) body...)";
      throw new Error(`${label} requires name, params, and body: ${form}`);
    }
    const nameAtom = node.values[nameIdx];
    if (nameAtom.type !== "atom") {
      throw new Error(`${isAccessor ? "Accessor" : "Method"} name must be an atom`);
    }
    const key = toClassKey(nameAtom.value);
    const paramsList = node.values[paramsIdx];
    if (paramsList.type !== "list") {
      throw new Error(`${isAccessor ? "Accessor" : "Method"} params must be a list`);
    }
    const params = paramsList.values.map(compileParam);
    const bodyExprs = node.values.slice(bodyIdx);
    const resolvedKind = !isAccessor && nameAtom.value === "constructor" ? "constructor" : kind;
    return {
      type: "MethodDefinition",
      key,
      value: {
        type: "FunctionExpression",
        id: null,
        params,
        body: {
          type: "BlockStatement",
          body: bodyExprs.map((e) => toStatement(compileExpr(e)))
        },
        async: false,
        generator: false
      },
      kind: resolvedKind,
      computed: false,
      static: isStatic
    };
  }
  function compile(exprs) {
    validateProtectedHost(exprs, { toJsIdentifier, formHead });
    const program = {
      type: "Program",
      body: exprs.map((e) => toStatement(compileExpr(e))),
      sourceType: "module"
    };
    return generate(finalizeHostInvocations(program, exprs), { indent: "  " });
  }

  // packages/lang/surface-helpers.js
  var STATEMENT_ONLY_HEADS = [
    "while",
    "for",
    "for-of",
    "for-in",
    "do-while",
    "switch",
    "label",
    "debugger",
    "block",
    "try",
    "catch",
    "finally",
    "var",
    "const",
    "let",
    "func",
    "class",
    "type",
    "export",
    "import"
  ];
  var CONTROL_TRANSFER_HEADS = ["return", "throw", "break", "continue"];
  function isStatementOnlyForm(expr) {
    if (!isArray(expr) || expr.values.length === 0) return false;
    const head = expr.values[0];
    if (!head || head.type !== "atom") return false;
    const name = head.value;
    if (name === "if") return expr.values.length < 4;
    return STATEMENT_ONLY_HEADS.includes(name);
  }
  function wrapReturnLast(bodyForms) {
    if (bodyForms.length === 0) return [];
    const lastExpr = bodyForms[bodyForms.length - 1];
    if (isStatementOnlyForm(lastExpr) || isControlTransferForm(lastExpr)) {
      return [...bodyForms];
    }
    if (bodyForms.length === 1) return [array(sym("return"), bodyForms[0])];
    return [...bodyForms.slice(0, -1), array(sym("return"), lastExpr)];
  }
  function isControlTransferForm(expr) {
    if (!isArray(expr) || expr.values.length === 0) return false;
    const head = expr.values[0];
    return head?.type === "atom" && CONTROL_TRANSFER_HEADS.includes(head.value);
  }
  function kernelArray(...items) {
    return markKernel(array(...items));
  }
  function isPascalCase(name) {
    return name.length > 0 && name[0] >= "A" && name[0] <= "Z";
  }
  function andChain(checks) {
    if (checks.length === 0) return null;
    if (checks.length === 1) return checks[0];
    let result = checks[0];
    for (let i = 1; i < checks.length; i++) {
      result = array(sym("&&"), result, checks[i]);
    }
    return result;
  }
  function getLiteralType(node) {
    if (node.type === "number") return "number";
    if (node.type === "string") return "string";
    if (node.type === "atom") {
      if (node.value === "true" || node.value === "false") return "boolean";
      if (node.value === "null") return "null";
      if (node.value === "undefined") return "undefined";
      if (node.value === "NaN") return "NaN";
    }
    if (node.type === "list" && node.values.length > 0 && node.values[0].type === "atom" && node.values[0].value === "array") {
      return "array";
    }
    if (node.type === "list" && node.values.length > 0 && node.values[0].type === "atom" && node.values[0].value === "obj") {
      return "object";
    }
    return null;
  }
  function typeMatchesLiteral(typeName, literalType) {
    if (literalType === "NaN") return false;
    if (literalType === "null") return false;
    if (literalType === "undefined") return false;
    return typeName === literalType;
  }
  function buildTypeCheck(paramNode, typeKw, funcName, label) {
    const typeName = typeKw.value;
    if (typeName === "any") return null;
    const paramName = paramNode.value;
    const hasPunct = (s) => /[^a-zA-Z0-9_-]/.test(s);
    const jsFuncName = toJsIdentifier(funcName);
    const dispFunc = jsFuncName !== funcName && hasPunct(funcName) ? `${jsFuncName} (${funcName})` : jsFuncName;
    const jsParamName = toJsIdentifier(paramName);
    const dispParam = jsParamName !== paramName && hasPunct(paramName) ? `${jsParamName} (${paramName})` : jsParamName;
    const msgText = label === "return" ? `${dispFunc}: return value expected ${typeName}, got ` : label ? `${dispFunc}: ${label} '${dispParam}' expected ${typeName}, got ` : `${dispFunc} '${dispParam}': expected ${typeName}, got `;
    const msg = {
      type: "string",
      value: msgText
    };
    const typeofParam = array(sym("typeof"), paramNode);
    const errorMsg = array(sym("+"), msg, typeofParam);
    const throwStmt = array(
      sym("throw"),
      array(sym("new"), sym("TypeError"), errorMsg)
    );
    let check;
    switch (typeName) {
      case "number":
        check = array(
          sym("||"),
          array(sym("!=="), typeofParam, { type: "string", value: "number" }),
          array(sym("Number:isNaN"), paramNode)
        );
        break;
      case "string":
        check = array(sym("!=="), typeofParam, {
          type: "string",
          value: "string"
        });
        break;
      case "boolean":
        check = array(sym("!=="), typeofParam, {
          type: "string",
          value: "boolean"
        });
        break;
      case "function":
        check = array(sym("!=="), typeofParam, {
          type: "string",
          value: "function"
        });
        break;
      case "object":
        check = array(
          sym("||"),
          array(sym("!=="), typeofParam, { type: "string", value: "object" }),
          array(sym("==="), paramNode, sym("null"))
        );
        break;
      case "array":
        check = array(sym("!"), array(sym("Array:isArray"), paramNode));
        break;
      case "symbol":
        check = array(sym("!=="), typeofParam, {
          type: "string",
          value: "symbol"
        });
        break;
      case "bigint":
        check = array(sym("!=="), typeofParam, {
          type: "string",
          value: "bigint"
        });
        break;
      default:
        check = array(
          sym("||"),
          array(sym("!=="), typeofParam, { type: "string", value: "object" }),
          array(
            sym("||"),
            array(sym("==="), paramNode, sym("null")),
            array(
              sym("!"),
              array(sym("in"), { type: "string", value: "tag" }, paramNode)
            )
          )
        );
        break;
    }
    return array(sym("if"), check, throwStmt);
  }
  function paramNameNodes(p) {
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
          if (f.defaultValue) {
            return array(sym("default"), f.name, f.defaultValue);
          }
          return f.name;
        });
        if (p.rest) {
          elems.push(array(sym("rest"), p.rest.name));
        }
        return [array(sym("array"), ...elems)];
      }
    }
    if (p.defaultValue) {
      return [array(sym("default"), p.name, p.defaultValue)];
    }
    if (p.isRest) {
      return [array(sym("rest"), p.name)];
    }
    return [p.name];
  }
  function paramTypeChecks(p, funcName) {
    if (p.destructured) {
      const checks = [];
      const allFields = [
        ...p.fields.filter((f) => !f.skip),
        ...p.rest ? [p.rest] : []
      ];
      for (const f of allFields) {
        if (f.nested) {
          checks.push(...paramTypeChecks(f.pattern, funcName));
          if (f.typeKw && f.typeKw.value !== "any") {
            const check3 = buildTypeCheck(f.alias, f.typeKw, funcName, "arg");
            if (check3) checks.push(check3);
          }
          continue;
        }
        const check2 = buildTypeCheck(f.name, f.typeKw, funcName, "arg");
        if (check2) checks.push(check2);
      }
      return checks;
    }
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
  function compilePattern2(pattern, targetSym) {
    if (pattern.type === "atom" && pattern.value === "_") {
      return { checks: [], bindings: [] };
    }
    if (pattern.type === "number") {
      return {
        checks: [array(sym("==="), targetSym, pattern)],
        bindings: []
      };
    }
    if (pattern.type === "string") {
      return {
        checks: [array(sym("==="), targetSym, pattern)],
        bindings: []
      };
    }
    if (pattern.type === "keyword") {
      return {
        checks: [
          array(sym("==="), targetSym, { type: "string", value: pattern.value })
        ],
        bindings: []
      };
    }
    if (pattern.type === "atom" && (pattern.value === "true" || pattern.value === "false" || pattern.value === "null" || pattern.value === "undefined")) {
      return {
        checks: [array(sym("==="), targetSym, pattern)],
        bindings: []
      };
    }
    if (pattern.type === "atom" && isPascalCase(pattern.value)) {
      return {
        checks: [
          array(sym("==="), sym(`${targetSym.value}:tag`), {
            type: "string",
            value: pattern.value
          })
        ],
        bindings: []
      };
    }
    if (pattern.type === "atom") {
      return {
        checks: [],
        bindings: [array(sym("const"), pattern, targetSym)]
      };
    }
    if (pattern.type === "list" && pattern.values.length > 0) {
      const head = pattern.values[0];
      if (head.type === "atom" && head.value === "obj") {
        const checks = [
          array(sym("==="), array(sym("typeof"), targetSym), {
            type: "string",
            value: "object"
          }),
          array(sym("!=="), targetSym, sym("null"))
        ];
        const bindings = [];
        const pairs = pattern.values.slice(1);
        for (let i = 0; i < pairs.length; i += 2) {
          const key = pairs[i];
          const binding = pairs[i + 1];
          if (!isKeyword(key)) {
            throw new Error(
              `match obj pattern: expected keyword, got ${key?.type}`
            );
          }
          const keyStr = { type: "string", value: key.value };
          checks.push(array(sym("in"), keyStr, targetSym));
          if (binding.type === "number" || binding.type === "string" || binding.type === "atom" && (binding.value === "true" || binding.value === "false" || binding.value === "null")) {
            checks.push(
              array(sym("==="), sym(`${targetSym.value}:${key.value}`), binding)
            );
          } else if (binding.type === "atom" && binding.value !== "_") {
            bindings.push(
              array(
                sym("const"),
                binding,
                sym(`${targetSym.value}:${key.value}`)
              )
            );
          }
        }
        return { checks, bindings };
      }
      if (head.type === "atom" && isPascalCase(head.value)) {
        const ctorName = head.value;
        const fieldNames = typeRegistry.get(ctorName);
        const patternBindings = pattern.values.slice(1);
        const checks = [
          array(sym("==="), sym(`${targetSym.value}:tag`), {
            type: "string",
            value: ctorName
          })
        ];
        const bindings = [];
        if (fieldNames) {
          for (let i = 0; i < patternBindings.length; i++) {
            const fieldName = fieldNames[i];
            if (!fieldName) break;
            const binding = patternBindings[i];
            const fieldAccess = sym(`${targetSym.value}:${fieldName}`);
            if (binding.type === "atom" && binding.value === "_") {
            } else if (binding.type === "list" && binding.values.length > 0 && isPascalCase(binding.values[0].value)) {
              const nestedTarget = gensym("t");
              bindings.push(array(sym("const"), nestedTarget, fieldAccess));
              const nested = compilePattern2(binding, nestedTarget);
              checks.push(...nested.checks);
              bindings.push(...nested.bindings);
            } else if (binding.type === "atom") {
              bindings.push(array(sym("const"), binding, fieldAccess));
            } else {
              checks.push(array(sym("==="), fieldAccess, binding));
            }
          }
        } else {
          for (let i = 0; i < patternBindings.length; i++) {
            const binding = patternBindings[i];
            const fieldAccess = array(
              sym("get"),
              array(sym("Object:values"), targetSym),
              { type: "number", value: i + 1 }
            );
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
  function compileLetPattern(pattern, tempVar) {
    if (isArray(pattern) && pattern.values.length > 0 && pattern.values[0].type === "atom" && isPascalCase(pattern.values[0].value)) {
      const { checks, bindings } = compilePattern2(pattern, tempVar);
      return { condition: andChain(checks), bindings };
    }
    if (isArray(pattern) && pattern.values.length > 0 && pattern.values[0].type === "atom" && pattern.values[0].value === "obj") {
      const { checks, bindings } = compilePattern2(pattern, tempVar);
      return { condition: andChain(checks), bindings };
    }
    if (pattern.type === "atom" && !isPascalCase(pattern.value)) {
      const condition = kernelArray(sym("!="), tempVar, sym("null"));
      const bindings = [array(sym("const"), pattern, tempVar)];
      return { condition, bindings };
    }
    return null;
  }
  function parseTypedParams(paramList) {
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
            `expected 'object', 'array', 'default', or 'rest' at head of sub-form in :args, got '${headName || values[i].type}'`
          );
        }
        i += 1;
      } else if (isKeyword(values[i])) {
        if (i + 1 >= values.length) {
          throw new Error(
            `type keyword :${values[i].value} has no parameter name`
          );
        }
        params.push({ typeKw: values[i], name: values[i + 1] });
        i += 2;
      } else {
        throw new Error(
          `expected type keyword or sub-form at position ${i}, got ${values[i]?.type ?? "nothing"}`
        );
      }
    }
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
  var typeRegistry = /* @__PURE__ */ new Map();

  // packages/lang/surface.js
  function parseDestructuredParam(listNode) {
    const values = listNode.values;
    if (values.length === 0) {
      throw new Error(
        "empty destructuring pattern \u2014 at least one field required"
      );
    }
    const head = values[0];
    if (head.type !== "atom" || head.value !== "object" && head.value !== "array") {
      throw new Error(
        `expected 'object' or 'array' at head of destructuring pattern, got '${head.value ?? head.type}'`
      );
    }
    const kind = head.value;
    const inner = values.slice(1);
    if (inner.length === 0) {
      throw new Error(
        "empty destructuring pattern \u2014 at least one field required"
      );
    }
    if (kind === "object") {
      return parseObjectDestructure(inner, listNode);
    }
    return parseArrayDestructure(inner, listNode);
  }
  function parseObjectDestructure(values, _parentNode) {
    const fields = [];
    let i = 0;
    while (i < values.length) {
      const cur = values[i];
      if (isArray(cur)) {
        const headVal = cur.values[0];
        const headName = headVal?.type === "atom" ? headVal.value : "";
        if (headName === "default") {
          if (cur.values.length !== 4) {
            throw new Error(
              "default in destructured params requires 3 arguments: (default :type name value)"
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
          if (cur.values.length < 4) {
            throw new Error(
              "alias in destructured params requires: (alias :type name (object/array ...))"
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
              "alias: third argument must be a destructuring pattern (object/array ...)"
            );
          }
          const nestedParam = parseDestructuredParam(innerPattern);
          fields.push({
            nested: true,
            alias: aliasName,
            typeKw: aliasTypeKw,
            pattern: nestedParam
          });
          i += 1;
          continue;
        }
        if (headName === "object" || headName === "array") {
          throw new Error(
            "nested pattern in object destructuring must use alias to specify the property name: (alias :type name (object/array ...))"
          );
        }
        throw new Error(
          `expected type keyword at position ${i} in destructuring pattern`
        );
      }
      if (!isKeyword(cur)) {
        if (cur.type === "atom") {
          throw new Error(
            `field '${cur.value}' missing type annotation (use :any to opt out)`
          );
        }
        throw new Error(
          `expected type keyword at position ${i} in destructuring pattern`
        );
      }
      if (i + 1 >= values.length) {
        throw new Error(
          `type keyword :${cur.value} has no field name in destructuring pattern`
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
  function parseArrayDestructure(values, _parentNode) {
    const fields = [];
    let rest2 = null;
    let i = 0;
    while (i < values.length) {
      const cur = values[i];
      if (cur.type === "atom" && cur.value === "_") {
        fields.push({ skip: true, name: cur });
        i += 1;
        continue;
      }
      if (isArray(cur)) {
        const headVal = cur.values[0];
        const headName = headVal?.type === "atom" ? headVal.value : "";
        if (headName === "rest") {
          if (cur.values.length !== 3) {
            throw new Error("rest element must be (rest :type name)");
          }
          if (i + 1 !== values.length) {
            throw new Error(
              "rest element must be last in array destructuring"
            );
          }
          if (!isKeyword(cur.values[1])) {
            throw new Error("rest element must be (rest :type name)");
          }
          if (cur.values[2].type !== "atom") {
            throw new Error("rest element must be (rest :type name)");
          }
          rest2 = { typeKw: cur.values[1], name: cur.values[2] };
          i += 1;
          continue;
        }
        if (headName === "default") {
          if (cur.values.length !== 4) {
            throw new Error(
              "default in destructured params requires 3 arguments: (default :type name value)"
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
          const nestedParam = parseDestructuredParam(cur);
          fields.push({
            nested: true,
            alias: null,
            typeKw: null,
            pattern: nestedParam
          });
          i += 1;
          continue;
        }
        if (headName === "alias") {
          if (cur.values.length < 4) {
            throw new Error(
              "alias in destructured params requires: (alias :type name (object/array ...))"
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
              "alias: third argument must be a destructuring pattern (object/array ...)"
            );
          }
          const nestedParam = parseDestructuredParam(innerPattern);
          fields.push({
            nested: true,
            alias: aliasName,
            typeKw: aliasTypeKw,
            pattern: nestedParam
          });
          i += 1;
          continue;
        }
        throw new Error(
          `unexpected list in array destructuring at position ${i}`
        );
      }
      if (isKeyword(cur)) {
        if (i + 1 >= values.length) {
          throw new Error(
            `type keyword :${cur.value} has no element name`
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
      if (cur.type === "atom") {
        throw new Error(
          `field '${cur.value}' missing type annotation (use :any to opt out)`
        );
      }
      throw new Error(
        `expected type keyword, _, or (rest ...) at position ${i} in array destructuring`
      );
    }
    return { destructured: true, kind: "array", fields, rest: rest2 };
  }
  function parseDefaultParam(listNode) {
    const vals = listNode.values;
    if (vals.length !== 4) {
      throw new Error(
        "(default) in :args requires exactly 3 elements: :type name value"
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
  function parseRestParam(listNode) {
    const vals = listNode.values;
    if (vals.length !== 3) {
      throw new Error(
        "(rest) in :args requires exactly 2 elements: :type name"
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
  function registerSurfaceMacros(macroEnv2) {
    macroEnv2.set("js:call", (...args) => {
      if (args.length < 1) {
        throw new Error("js:call requires at least a method reference");
      }
      return array(args[0], ...args.slice(1));
    });
    macroEnv2.set("js:bind", (...args) => {
      if (args.length !== 2) {
        throw new Error(
          "js:bind requires exactly 2 arguments: (js:bind obj:method obj)"
        );
      }
      if (args[0].type !== "atom") {
        throw new Error("js:bind: first argument must be a method reference");
      }
      return array(sym(`${args[0].value}:bind`), args[1]);
    });
    macroEnv2.set("js:eval", (...args) => {
      if (args.length !== 1) {
        throw new Error("js:eval requires exactly 1 argument");
      }
      return array(sym("eval"), args[0]);
    });
    macroEnv2.set("js:eq", (...args) => {
      if (args.length !== 2) {
        throw new Error("js:eq requires exactly 2 arguments");
      }
      return array(sym("=="), args[0], args[1]);
    });
    macroEnv2.set("js:typeof", (...args) => {
      if (args.length !== 1) {
        throw new Error("js:typeof requires exactly 1 argument");
      }
      return array(sym("typeof"), args[0]);
    });
  }

  // packages/lang/surface-ast.js
  function Not(operand) {
    return { type: "Not", operand };
  }
  function Swap(cell, fn, extraArgs) {
    return { type: "Swap", cell, fn, extraArgs };
  }
  function Reset(cell, value) {
    return { type: "Reset", cell, value };
  }
  function SetProp(target, value) {
    return { type: "SetProp", target, value };
  }
  function SetSymbol(obj, key, value) {
    return { type: "SetSymbol", obj, key, value };
  }
  function Conj(arr, item) {
    return { type: "Conj", arr, item };
  }
  function Assoc(obj, pairs) {
    return { type: "Assoc", obj, pairs };
  }
  function Dissoc(obj, keys) {
    return { type: "Dissoc", obj, keys };
  }
  function Thread(position, initial, steps) {
    return { type: "Thread", position, initial, steps };
  }
  function SomeThread(position, initial, steps) {
    return { type: "SomeThread", position, initial, steps };
  }
  function IfLet(bindingPair, thenBody, elseBody) {
    return { type: "IfLet", bindingPair, thenBody, elseBody };
  }
  function WhenLet(bindingPair, bodyForms) {
    return { type: "WhenLet", bindingPair, bodyForms };
  }
  function Fn(paramList, bodyForms) {
    return { type: "Fn", paramList, bodyForms };
  }
  function And(args) {
    return { type: "And", args };
  }
  function Or(args) {
    return { type: "Or", args };
  }
  function Express(cell) {
    return { type: "Express", cell };
  }
  function Obj(pairs) {
    return { type: "Obj", pairs };
  }
  function Cell(value) {
    return { type: "Cell", value };
  }
  function Bind(args) {
    return { type: "Bind", args };
  }
  function BindGroup(bindings) {
    return { type: "BindGroup", bindings };
  }
  function Eq(args) {
    return { type: "Eq", args };
  }
  function Neq(a, b) {
    return { type: "Neq", a, b };
  }
  function Exports(names) {
    return { type: "Exports", names };
  }
  function Func(nameNode, restArgs) {
    return { type: "Func", nameNode, restArgs };
  }
  function GenFunc(nameNode, restArgs) {
    return { type: "GenFunc", nameNode, restArgs };
  }
  function GenFn(paramList, args) {
    return { type: "GenFn", paramList, args };
  }
  function Cond(clauses) {
    return { type: "Cond", clauses };
  }
  function Match(expr, clauses) {
    return { type: "Match", expr, clauses };
  }
  function TypeDef(typeName, constructors) {
    return { type: "TypeDef", typeName, constructors };
  }

  // packages/lang/classifier.js
  function classifySurfaceForm(head, args) {
    switch (head) {
      case "not":
        if (args.length !== 1) {
          throw new Error("not requires exactly 1 argument: (not x)");
        }
        return Not(args[0]);
      case "swap!":
        if (args.length < 2) {
          throw new Error("swap! requires at least 2 arguments: (swap! cell fn)");
        }
        if (args[0].type !== "atom") {
          throw new Error("swap!: first argument must be a symbol");
        }
        return Swap(args[0], args[1], args.slice(2));
      case "reset!":
        if (args.length !== 2) {
          throw new Error(
            "reset! requires exactly 2 arguments: (reset! cell value)"
          );
        }
        if (args[0].type !== "atom") {
          throw new Error("reset!: first argument must be a symbol");
        }
        return Reset(args[0], args[1]);
      case "set!":
        if (args.length !== 2) {
          throw new Error(
            "set! requires exactly 2 arguments: (set! target:prop value)"
          );
        }
        if (args[0].type !== "atom" || !args[0].value.includes(":")) {
          throw new Error(
            "set! requires a property path (e.g., obj:prop), not a bare binding. Use (bind x val) for new bindings, (reset! cell val) for cells."
          );
        }
        return SetProp(args[0], args[1]);
      case "set-symbol!":
        if (args.length !== 3) {
          throw new Error(
            "set-symbol! requires exactly 3 arguments: (set-symbol! obj key value)"
          );
        }
        return SetSymbol(args[0], args[1], args[2]);
      case "conj":
        if (args.length !== 2) {
          throw new Error(
            "conj requires exactly 2 arguments: (conj array value)"
          );
        }
        return Conj(args[0], args[1]);
      case "assoc": {
        if (args.length < 3) {
          throw new Error(
            "assoc requires at least 3 arguments: (assoc obj :key value)"
          );
        }
        const pairs = [];
        for (let i = 1; i < args.length; i += 2) {
          if (args[i].type !== "keyword") {
            throw new Error(
              `assoc: expected keyword at position ${i}, got ${args[i]?.type ?? "nothing"}`
            );
          }
          if (i + 1 >= args.length) {
            throw new Error(`assoc: keyword :${args[i].value} has no value`);
          }
          pairs.push({ key: args[i].value, value: args[i + 1] });
        }
        return Assoc(args[0], pairs);
      }
      case "dissoc": {
        if (args.length < 2) {
          throw new Error(
            "dissoc requires at least 2 arguments: (dissoc obj :key)"
          );
        }
        const keys = [];
        for (let i = 1; i < args.length; i++) {
          if (args[i].type !== "keyword") {
            throw new Error(
              `dissoc: expected keyword at position ${i}, got ${args[i]?.type ?? "nothing"}`
            );
          }
          keys.push(args[i].value);
        }
        return Dissoc(args[0], keys);
      }
      case "->":
        if (args.length < 2) {
          throw new Error("-> requires at least 2 arguments: (-> value step...)");
        }
        return Thread("first", args[0], args.slice(1));
      case "->>":
        if (args.length < 2) {
          throw new Error(
            "->> requires at least 2 arguments: (->> value step...)"
          );
        }
        return Thread("last", args[0], args.slice(1));
      case "some->":
        if (args.length < 2) {
          throw new Error("some-> requires at least 2 arguments");
        }
        return SomeThread("first", args[0], args.slice(1));
      case "some->>":
        if (args.length < 2) {
          throw new Error("some->> requires at least 2 arguments");
        }
        return SomeThread("last", args[0], args.slice(1));
      case "if-let": {
        if (args.length < 2 || args.length > 3) {
          throw new Error(
            "if-let requires 2-3 arguments: (if-let (binding expr) then else?)"
          );
        }
        const bp = args[0];
        if (!bp || bp.type !== "list" || bp.values.length !== 2) {
          throw new Error("if-let: first argument must be (pattern expr)");
        }
        return IfLet(bp, args[1], args.length === 3 ? args[2] : null);
      }
      case "when-let": {
        if (args.length < 2) {
          throw new Error(
            "when-let requires at least 2 arguments: (when-let (binding expr) body...)"
          );
        }
        const bp = args[0];
        if (!bp || bp.type !== "list" || bp.values.length !== 2) {
          throw new Error("when-let: first argument must be (pattern expr)");
        }
        return WhenLet(bp, args.slice(1));
      }
      case "fn":
      case "lambda": {
        if (args.length < 2) {
          throw new Error(
            "fn requires at least 2 arguments: (fn (params) body...)"
          );
        }
        if (!args[0] || args[0].type !== "list") {
          throw new Error("fn: first argument must be a parameter list");
        }
        return Fn(args[0], args.slice(1));
      }
      case "and":
        if (args.length < 2) {
          throw new Error("and requires at least 2 arguments: (and a b)");
        }
        return And(args);
      case "or":
        if (args.length < 2) {
          throw new Error("or requires at least 2 arguments: (or a b)");
        }
        return Or(args);
      case "express":
        if (args.length !== 1) {
          throw new Error("express requires exactly 1 argument: (express cell)");
        }
        if (args[0].type !== "atom") {
          throw new Error("express: argument must be a symbol");
        }
        return Express(args[0]);
      case "obj": {
        const pairs = [];
        for (let i = 0; i < args.length; i += 2) {
          if (args[i].type !== "keyword") {
            throw new Error(
              `obj: expected keyword at position ${i}, got ${args[i]?.type ?? "nothing"}`
            );
          }
          if (i + 1 >= args.length) {
            throw new Error(`obj: keyword :${args[i].value} has no value`);
          }
          pairs.push({ key: args[i].value, value: args[i + 1] });
        }
        return Obj(pairs);
      }
      case "cell":
        if (args.length !== 1) {
          throw new Error("cell requires exactly 1 argument: (cell value)");
        }
        return Cell(args[0]);
      case "bind":
        if (args.length < 2) {
          throw new Error(
            "bind requires at least 2 arguments: (bind name value)"
          );
        }
        if (args.length === 2) return Bind(args);
        if (args.length === 3) {
          if (args[0].type !== "keyword") {
            throw new Error(
              "bind requires 2 arguments, 3 typed arguments, or grouped name/value pairs"
            );
          }
          return Bind(args);
        }
        return BindGroup(parseBindGroup(args));
      case "exports":
        return Exports(parseExports(args));
      case "cond":
        return Cond(parseCond(args));
      case "=":
        if (args.length < 2) {
          throw new Error("= requires at least 2 arguments: (= a b)");
        }
        return Eq(args);
      case "!=":
        if (args.length !== 2) {
          throw new Error("!= requires exactly 2 arguments: (!= a b)");
        }
        return Neq(args[0], args[1]);
      case "func":
        if (args.length < 2) {
          throw new Error("func requires at least a name and body");
        }
        if (args[0].type !== "atom") {
          throw new Error("func: first argument must be a function name");
        }
        return Func(args[0], args.slice(1));
      case "genfunc":
        if (args.length < 2) {
          throw new Error("genfunc requires at least a name and :yields/:body");
        }
        if (args[0].type !== "atom") {
          throw new Error("genfunc: first argument must be a function name");
        }
        return GenFunc(args[0], args.slice(1));
      case "genfn":
        if (args.length < 2) {
          throw new Error("genfn requires at least a parameter list and body");
        }
        if (!args[0] || args[0].type !== "list") {
          throw new Error("genfn: first argument must be a parameter list");
        }
        return GenFn(args[0], args);
      case "match":
        if (args.length < 2) {
          throw new Error("match requires at least an expression and one clause");
        }
        return Match(args[0], args.slice(1));
      case "type":
        if (args.length < 2) {
          throw new Error("type requires a name and at least one constructor");
        }
        if (args[0].type !== "atom") {
          throw new Error("type: first argument must be a type name");
        }
        return TypeDef(args[0], args.slice(1));
      default:
        return null;
    }
  }
  function isKw(x) {
    return x && x.type === "keyword";
  }
  function isArr(x) {
    return x && x.type === "list" && Array.isArray(x.values);
  }
  function namesInPattern(pat) {
    if (pat?.type === "atom") return pat.value === "_" ? [] : [pat.value];
    if (!isArr(pat)) return [];
    const h = pat.values[0]?.type === "atom" ? pat.values[0].value : "";
    if (h !== "array" && h !== "object") return [];
    const out = [];
    for (const el of pat.values.slice(1)) {
      if (el.type === "keyword") continue;
      if (el.type === "atom") {
        if (el.value !== "_") out.push(el.value);
      } else if (isArr(el)) {
        const ih = el.values[0]?.type === "atom" ? el.values[0].value : "";
        if (ih === "rest" && el.values[1]) out.push(...namesInPattern(el.values[1]));
        else if (ih === "default" && el.values[2]) out.push(...namesInPattern(el.values[2]));
        else if (ih === "array" || ih === "object") out.push(...namesInPattern(el));
      }
    }
    return out;
  }
  function parseBindGroup(args) {
    const bindings = [];
    const seen = /* @__PURE__ */ new Set();
    let i = 0;
    while (i < args.length) {
      let typeKw = null;
      let nameNode;
      let valueNode;
      if (args[i]?.type === "keyword") {
        if (i + 2 >= args.length) {
          throw new Error(
            "bind grouped typed pair requires (:type name value)"
          );
        }
        typeKw = args[i];
        nameNode = args[i + 1];
        valueNode = args[i + 2];
        if (nameNode.type !== "atom") {
          throw new Error("bind typed grouped pair name must be an atom");
        }
        i += 3;
      } else {
        if (i + 1 >= args.length) {
          throw new Error("bind grouped form has an incomplete name/value pair");
        }
        nameNode = args[i];
        valueNode = args[i + 1];
        i += 2;
      }
      for (const name of namesInPattern(nameNode)) {
        if (seen.has(name)) {
          throw new Error(`bind group declares '${name}' more than once`);
        }
        seen.add(name);
      }
      bindings.push({ typeKw, nameNode, valueNode });
    }
    return bindings;
  }
  function parseExports(args) {
    if (args.length === 0) {
      throw new Error("exports requires at least one name");
    }
    const seen = /* @__PURE__ */ new Set();
    for (const arg of args) {
      if (arg.type !== "atom") {
        throw new Error("exports expects atom names: (exports name ...)");
      }
      if (arg.value === "_") {
        throw new Error("exports cannot export the wildcard name '_'");
      }
      if (seen.has(arg.value)) {
        throw new Error(`exports lists '${arg.value}' more than once`);
      }
      seen.add(arg.value);
    }
    return args;
  }
  function parseCond(args) {
    if (args.length === 0) {
      throw new Error("cond requires at least one clause");
    }
    const clauses = [];
    let sawElse = false;
    for (let i = 0; i < args.length; i++) {
      const clause = args[i];
      if (!isArr(clause) || clause.values.length !== 2) {
        throw new Error("cond clauses must be two-item lists: (test result)");
      }
      const [test, result] = clause.values;
      if (test.type === "keyword") {
        if (test.value !== "else") {
          throw new Error(`cond: unknown keyword clause :${test.value}`);
        }
        if (sawElse) throw new Error("cond may only have one :else clause");
        if (i !== args.length - 1) {
          throw new Error("cond :else clause must be last");
        }
        sawElse = true;
        clauses.push({ test: null, result });
      } else {
        clauses.push({ test, result });
      }
    }
    return clauses;
  }
  function emitBindKernelArgs(a, h) {
    const { sym: sym2, array: array2 } = h;
    if (a[0].type === "keyword") {
      if (a.length !== 3) {
        throw new Error("bind with type annotation requires 3 arguments");
      }
      const typeKw = a[0], nameNode = a[1], valueNode = a[2];
      const constDecl = array2(sym2("const"), nameNode, valueNode);
      if (typeKw.value === "any") return constDecl;
      const literalType = getLiteralType(valueNode);
      if (literalType !== null) {
        if (!typeMatchesLiteral(typeKw.value, literalType)) {
          throw new Error(
            `bind '${nameNode.value}': type annotation is :${typeKw.value} but initializer is a ${literalType} literal.`
          );
        }
        return constDecl;
      }
      const check = buildTypeCheck(nameNode, typeKw, "bind", "");
      return check === null ? constDecl : array2(sym2("block"), constDecl, check);
    }
    if (a.length !== 2) {
      throw new Error("bind requires exactly name/value or :type name/value arguments");
    }
    return array2(sym2("const"), a[0], a[1]);
  }
  function emitCondChain(clauses, h) {
    const { sym: sym2, array: array2 } = h;
    let i = clauses.length - 1;
    let chain = null;
    if (clauses[i]?.test === null) {
      chain = clauses[i].result;
      i--;
    }
    for (; i >= 0; i--) {
      const clause = clauses[i];
      chain = chain === null ? array2(sym2("if"), clause.test, clause.result) : array2(sym2("if"), clause.test, clause.result, chain);
    }
    return chain ?? sym2("undefined");
  }
  function emitSurfaceForm(node, h) {
    const { sym: sym2, array: array2, gensym: gensym2 } = h;
    switch (node.type) {
      case "Not":
        return array2(sym2("!"), node.operand);
      case "Swap": {
        const cellValue = sym2(`${node.cell.value}:value`);
        return array2(
          sym2("="),
          cellValue,
          array2(node.fn, cellValue, ...node.extraArgs)
        );
      }
      case "Reset":
        return array2(sym2("="), sym2(`${node.cell.value}:value`), node.value);
      case "SetProp":
        return array2(sym2("="), node.target, node.value);
      case "SetSymbol":
        return array2(sym2("="), array2(sym2("get"), node.obj, node.key), node.value);
      case "Conj":
        return array2(sym2("array"), array2(sym2("spread"), node.arr), node.item);
      case "Assoc": {
        const pairs = node.pairs.map((p) => array2(sym2(p.key), p.value));
        return array2(sym2("object"), array2(sym2("spread"), node.obj), ...pairs);
      }
      case "Dissoc": {
        const aliasPatterns = node.keys.map(
          (k) => array2(sym2("alias"), sym2(k), gensym2("_"))
        );
        const restVar = gensym2("rest");
        const pattern = array2(
          sym2("object"),
          ...aliasPatterns,
          array2(sym2("rest"), restVar)
        );
        const binding = array2(sym2("const"), pattern, node.obj);
        const arrowBody = array2(
          sym2("=>"),
          array2(),
          binding,
          array2(sym2("return"), restVar)
        );
        return array2(arrowBody);
      }
      case "Thread": {
        let threaded = node.initial;
        for (const step of node.steps) {
          if (isKw(step)) {
            threaded = array2(sym2("."), threaded, sym2(step.value));
          } else if (isArr(step) && step.values.length > 0 && isKw(step.values[0])) {
            const [kw, ...rest2] = step.values;
            threaded = array2(sym2("."), threaded, sym2(kw.value), ...rest2);
          } else if (isArr(step)) {
            if (node.position === "first") {
              const [fn, ...rest2] = step.values;
              threaded = array2(fn, threaded, ...rest2);
            } else {
              threaded = array2(...step.values, threaded);
            }
          } else {
            threaded = array2(step, threaded);
          }
        }
        return threaded;
      }
      case "SomeThread": {
        const stmts = [];
        let prevVar = gensym2("t");
        stmts.push(array2(sym2("const"), prevVar, node.initial));
        stmts.push(
          array2(
            sym2("if"),
            array2(sym2("=="), prevVar, sym2("null")),
            array2(sym2("return"), prevVar)
          )
        );
        for (let i = 0; i < node.steps.length; i++) {
          const step = node.steps[i];
          let callExpr;
          if (isKw(step)) {
            callExpr = array2(sym2("."), prevVar, sym2(step.value));
          } else if (isArr(step) && step.values.length > 0 && isKw(step.values[0])) {
            const [kw, ...rest2] = step.values;
            callExpr = array2(sym2("."), prevVar, sym2(kw.value), ...rest2);
          } else if (isArr(step)) {
            if (node.position === "first") {
              const [fn, ...rest2] = step.values;
              callExpr = array2(fn, prevVar, ...rest2);
            } else {
              callExpr = array2(...step.values, prevVar);
            }
          } else {
            callExpr = array2(step, prevVar);
          }
          if (i === node.steps.length - 1) {
            stmts.push(array2(sym2("return"), callExpr));
          } else {
            const nextVar = gensym2("t");
            stmts.push(array2(sym2("const"), nextVar, callExpr));
            stmts.push(
              array2(
                sym2("if"),
                array2(sym2("=="), nextVar, sym2("null")),
                array2(sym2("return"), nextVar)
              )
            );
            prevVar = nextVar;
          }
        }
        const arrowFn = array2(sym2("=>"), array2(), ...stmts);
        return array2(arrowFn);
      }
      case "IfLet": {
        const pattern = node.bindingPair.values[0];
        const expr = node.bindingPair.values[1];
        const tempVar = gensym2("t");
        const stmts = [array2(sym2("const"), tempVar, expr)];
        const result = compileLetPattern(pattern, tempVar);
        if (!result) {
          throw new Error(
            `if-let: unrecognized pattern: ${formatSExpr(pattern)}`
          );
        }
        const { condition, bindings } = result;
        const thenBlock = [...bindings, array2(sym2("return"), node.thenBody)];
        if (node.elseBody) {
          stmts.push(
            array2(
              sym2("if"),
              condition,
              array2(sym2("block"), ...thenBlock),
              array2(sym2("block"), array2(sym2("return"), node.elseBody))
            )
          );
        } else {
          stmts.push(
            array2(sym2("if"), condition, array2(sym2("block"), ...thenBlock))
          );
        }
        return array2(array2(sym2("=>"), array2(), ...stmts));
      }
      case "WhenLet": {
        const pattern = node.bindingPair.values[0];
        const expr = node.bindingPair.values[1];
        const tempVar = gensym2("t");
        const stmts = [array2(sym2("const"), tempVar, expr)];
        const result = compileLetPattern(pattern, tempVar);
        if (!result) {
          throw new Error(
            `when-let: unrecognized pattern: ${formatSExpr(pattern)}`
          );
        }
        const { condition, bindings } = result;
        const wrapped = wrapReturnLast(node.bodyForms);
        const returnBody = wrapped.length === 1 ? wrapped[0] : array2(sym2("block"), ...wrapped);
        stmts.push(
          array2(
            sym2("if"),
            condition,
            array2(sym2("block"), ...bindings, returnBody)
          )
        );
        return array2(array2(sym2("=>"), array2(), ...stmts));
      }
      case "Fn": {
        const params = parseTypedParams(node.paramList);
        const pNames = params.flatMap((p) => paramNameNodes(p));
        const typeChecks = [];
        for (const p of params) {
          typeChecks.push(...paramTypeChecks(p, "anonymous"));
        }
        if (typeChecks.length > 0 || node.bodyForms.length > 1) {
          return array2(
            sym2("=>"),
            array2(...pNames),
            ...typeChecks,
            ...wrapReturnLast(node.bodyForms)
          );
        }
        return array2(
          sym2("=>"),
          array2(...pNames),
          ...typeChecks,
          ...node.bodyForms
        );
      }
      case "And": {
        let result = node.args[0];
        for (let i = 1; i < node.args.length; i++) {
          result = array2(sym2("&&"), result, node.args[i]);
        }
        return result;
      }
      case "Or": {
        let result = node.args[0];
        for (let i = 1; i < node.args.length; i++) {
          result = array2(sym2("||"), result, node.args[i]);
        }
        return result;
      }
      case "Express":
        return sym2(`${node.cell.value}:value`);
      case "Obj": {
        const objPairs = node.pairs.map((p) => {
          return markKernel(array2(sym2(p.key), p.value));
        });
        return array2(sym2("object"), ...objPairs);
      }
      case "Cell":
        return array2(sym2("object"), array2(sym2("value"), node.value));
      case "Bind": {
        return emitBindKernelArgs(node.args, h);
      }
      case "BindGroup":
        return node.bindings.map((binding) => {
          const args = binding.typeKw ? [binding.typeKw, binding.nameNode, binding.valueNode] : [binding.nameNode, binding.valueNode];
          return emitBindKernelArgs(args, h);
        });
      case "Exports":
        return array2(sym2("export"), array2(sym2("names"), ...node.names));
      case "Cond":
        return emitCondChain(node.clauses, h);
      case "Eq": {
        if (node.args.length === 2) {
          return array2(sym2("==="), node.args[0], node.args[1]);
        }
        const checks = [];
        for (let i = 0; i < node.args.length - 1; i++) {
          checks.push(array2(sym2("==="), node.args[i], node.args[i + 1]));
        }
        let result = checks[0];
        for (let i = 1; i < checks.length; i++) {
          result = array2(sym2("&&"), result, checks[i]);
        }
        return result;
      }
      case "Neq":
        return array2(sym2("!=="), node.a, node.b);
      case "Func": {
        const { nameNode, restArgs } = node;
        const funcName = nameNode.value;
        const firstAfterName = restArgs[0];
        if (firstAfterName && firstAfterName.type === "list" && firstAfterName.values.length > 0 && firstAfterName.values[0].type === "keyword") {
          return buildMultiClauseFunc(funcName, nameNode, restArgs);
        }
        if (firstAfterName && firstAfterName.type === "keyword") {
          return buildSingleClauseFunc(funcName, nameNode, restArgs);
        }
        return array2(
          sym2("function"),
          nameNode,
          array2(),
          ...wrapReturnLast(restArgs)
        );
      }
      case "GenFunc":
        return emitGenfuncMacro([node.nameNode, ...node.restArgs]);
      case "GenFn": {
        const a = node.args;
        let yieldsType = null, bodyStart = 1;
        if (a.length >= 3 && a[1].type === "keyword" && a[1].value === "yields") {
          if (a.length < 4) {
            throw new Error("genfn: :yields requires a type keyword and body");
          }
          yieldsType = a[2];
          bodyStart = 3;
        }
        const bodyForms = a.slice(bodyStart);
        const params = parseTypedParams(node.paramList);
        const pNames = params.flatMap((p) => paramNameNodes(p));
        const typeChecks = [];
        for (const p of params) {
          typeChecks.push(...paramTypeChecks(p, "anonymous"));
        }
        let instrumentedBody = bodyForms;
        if (yieldsType && yieldsType.type === "keyword" && yieldsType.value !== "any") {
          instrumentedBody = bodyForms.map(
            (e) => instrumentYields(e, yieldsType, "anonymous")
          );
        }
        return array2(
          sym2("function*"),
          array2(...pNames),
          ...typeChecks,
          ...instrumentedBody
        );
      }
      case "Match":
        return emitMatchMacro([node.expr, ...node.clauses]);
      case "TypeDef":
        return emitTypeMacro([node.typeName, ...node.constructors]);
      default:
        throw new Error(`Unknown surface AST node type: ${node.type}`);
    }
  }
  function funcBodyProtectsStatementExit(node) {
    if (!node || node.type !== "Func") return false;
    const { restArgs } = node;
    const first2 = restArgs[0];
    const multi = first2?.type === "list" && first2.values.length > 0 && first2.values[0].type === "keyword";
    if (multi) {
      return restArgs.some(
        (clause) => clause?.type === "list" && (parseKeywordClauses(clause.values).get("post")?.length ?? 0) > 0
      );
    }
    const parsed = parseKeywordClauses(restArgs);
    if ((parsed.get("post")?.length ?? 0) > 0) return true;
    const declared = parsed.get("returns")?.[0];
    return declared?.type === "keyword" && !["any", "void"].includes(declared.value);
  }
  function buildSingleClauseFunc(funcName, funcNameNode, clauseArgs) {
    const clauses = parseKeywordClauses(clauseArgs);
    const argsClause = clauses.get("args");
    const returnsClause = clauses.get("returns");
    const preClause = clauses.get("pre");
    const postClause = clauses.get("post");
    const bodyClause = clauses.get("body");
    if (!bodyClause || bodyClause.length === 0) {
      throw new Error(`func ${funcName}: :body is required`);
    }
    let params = [];
    if (argsClause && argsClause.length === 1 && isArray(argsClause[0])) {
      params = parseTypedParams(argsClause[0]);
    }
    const pNames = params.flatMap((p) => paramNameNodes(p));
    const bodyStmts = [];
    for (const p of params) {
      bodyStmts.push(...paramTypeChecks(p, funcName));
    }
    if (preClause && preClause.length > 0) {
      const preExpr = preClause[0];
      const preMsg = `${funcName}: pre-condition failed: ${formatSExpr(preExpr)} \u2014 caller blame`;
      bodyStmts.push(
        array(
          sym("if"),
          array(sym("!"), preExpr),
          array(
            sym("throw"),
            array(sym("new"), sym("Error"), { type: "string", value: preMsg })
          )
        )
      );
    }
    const hasReturns = returnsClause && returnsClause.length > 0;
    const returnsType = hasReturns ? returnsClause[0] : null;
    const isVoid = returnsType && isKeyword(returnsType) && returnsType.value === "void";
    const hasPost = postClause && postClause.length > 0;
    if (hasPost) {
      const lastBodyExpr = bodyClause[bodyClause.length - 1];
      if (lastBodyExpr && isStatementOnlyForm(lastBodyExpr)) {
        const headName = isArray(lastBodyExpr) && lastBodyExpr.values.length > 0 ? lastBodyExpr.values[0].value || "<unknown>" : "<unknown>";
        const retType = returnsType ? returnsType.value : "<unknown>";
        throw new Error(
          `function \`${funcName}\` declared \`:returns :${retType}\` but body ends with \`${headName}\` (a statement-only form which cannot produce a value). Either: (a) add a return-typed expression after the form, or (b) remove \`:returns :${retType}\` from the function declaration.`
        );
      }
      const resultVar = gensym("result");
      if (bodyClause.length === 1) {
        bodyStmts.push(array(sym("const"), resultVar, bodyClause[0]));
      } else {
        const initBody = bodyClause.slice(0, -1);
        bodyStmts.push(...initBody);
        bodyStmts.push(
          array(sym("const"), resultVar, bodyClause[bodyClause.length - 1])
        );
      }
      if (hasReturns && !isVoid && returnsType.value !== "any") {
        const retCheck = buildTypeCheck(
          resultVar,
          returnsType,
          funcName,
          "return"
        );
        if (retCheck) bodyStmts.push(retCheck);
      }
      const postExpr = postClause[0];
      const postMsg = `${funcName}: post-condition failed: ${formatSExpr(postExpr)} \u2014 callee blame`;
      const postWithResult = replaceTilde(postExpr, resultVar);
      bodyStmts.push(
        array(
          sym("if"),
          array(sym("!"), postWithResult),
          array(
            sym("throw"),
            array(sym("new"), sym("Error"), { type: "string", value: postMsg })
          )
        )
      );
      bodyStmts.push(array(sym("return"), resultVar));
    } else if (hasReturns && !isVoid) {
      if (returnsType.value !== "any") {
        const lastBodyExpr = bodyClause[bodyClause.length - 1];
        if (lastBodyExpr && isStatementOnlyForm(lastBodyExpr)) {
          const headName = isArray(lastBodyExpr) && lastBodyExpr.values.length > 0 ? lastBodyExpr.values[0].value || "<unknown>" : "<unknown>";
          throw new Error(
            `function \`${funcName}\` declared \`:returns :${returnsType.value}\` but body ends with \`${headName}\` (a statement-only form which cannot produce a value). Either: (a) add a return-typed expression after the form, or (b) remove \`:returns :${returnsType.value}\` from the function declaration.`
          );
        }
        const resultVar = gensym("result");
        if (bodyClause.length === 1) {
          bodyStmts.push(array(sym("const"), resultVar, bodyClause[0]));
        } else {
          const initBody = bodyClause.slice(0, -1);
          bodyStmts.push(...initBody);
          bodyStmts.push(
            array(sym("const"), resultVar, bodyClause[bodyClause.length - 1])
          );
        }
        const retCheck = buildTypeCheck(
          resultVar,
          returnsType,
          funcName,
          "return"
        );
        if (retCheck) bodyStmts.push(retCheck);
        bodyStmts.push(array(sym("return"), resultVar));
      } else {
        bodyStmts.push(...wrapReturnLast(bodyClause));
      }
    } else if (isVoid) {
      bodyStmts.push(...bodyClause);
    } else {
      bodyStmts.push(...wrapReturnLast(bodyClause));
    }
    return array(
      sym("function"),
      funcNameNode,
      array(...pNames),
      ...bodyStmts
    );
  }
  function buildMultiClauseFunc(funcName, funcNameNode, clauseLists) {
    const argsVar = gensym("args");
    const stmts = [];
    const parsed = clauseLists.map((cl, index) => {
      const clauses = parseKeywordClauses(cl.values);
      const argsClause = clauses.get("args");
      let params = [];
      if (argsClause && argsClause.length === 1 && isArray(argsClause[0])) {
        params = parseTypedParams(argsClause[0]);
      }
      const typedCount = params.filter(
        (p) => paramDispatchType(p) !== "any"
      ).length;
      return { clauses, params, typedCount, arity: params.length, index };
    });
    checkFuncClauseOverlap(funcName, parsed);
    parsed.sort((a, b) => {
      if (a.arity !== b.arity) return b.arity - a.arity;
      return b.typedCount - a.typedCount;
    });
    for (const clause of parsed) {
      const { clauses, params } = clause;
      const returnsClause = clauses.get("returns");
      const preClause = clauses.get("pre");
      const postClause = clauses.get("post");
      const bodyClause = clauses.get("body");
      if (!bodyClause || bodyClause.length === 0) {
        throw new Error(`func ${funcName}: :body is required in each clause`);
      }
      const conditions = [
        array(sym("==="), sym(`${argsVar.value}:length`), {
          type: "number",
          value: params.length
        })
      ];
      for (let i = 0; i < params.length; i++) {
        const p = params[i];
        const dtype = paramDispatchType(p);
        if (dtype === "any") continue;
        const argAccess = array(sym("get"), argsVar, {
          type: "number",
          value: i
        });
        switch (dtype) {
          case "number":
            conditions.push(
              array(sym("==="), array(sym("typeof"), argAccess), {
                type: "string",
                value: "number"
              })
            );
            break;
          case "string":
            conditions.push(
              array(sym("==="), array(sym("typeof"), argAccess), {
                type: "string",
                value: "string"
              })
            );
            break;
          case "boolean":
            conditions.push(
              array(sym("==="), array(sym("typeof"), argAccess), {
                type: "string",
                value: "boolean"
              })
            );
            break;
          case "function":
            conditions.push(
              array(sym("==="), array(sym("typeof"), argAccess), {
                type: "string",
                value: "function"
              })
            );
            break;
          case "object":
            conditions.push(
              array(
                sym("&&"),
                array(sym("==="), array(sym("typeof"), argAccess), {
                  type: "string",
                  value: "object"
                }),
                array(sym("!=="), argAccess, sym("null"))
              )
            );
            break;
          case "array":
            conditions.push(array(sym("Array:isArray"), argAccess));
            break;
          default:
            break;
        }
      }
      const condition = andChain(conditions);
      const clauseBody = [];
      for (let i = 0; i < params.length; i++) {
        const p = params[i];
        const argAccess = array(sym("get"), argsVar, {
          type: "number",
          value: i
        });
        if (p.destructured) {
          clauseBody.push(
            array(sym("const"), paramNameNodes(p)[0], argAccess)
          );
        } else {
          clauseBody.push(
            array(sym("const"), p.name, argAccess)
          );
        }
      }
      for (const p of params) {
        clauseBody.push(...paramTypeChecks(p, funcName));
      }
      if (preClause && preClause.length > 0) {
        const preExpr = preClause[0];
        const preMsg = `${funcName}: pre-condition failed: ${formatSExpr(preExpr)} \u2014 caller blame`;
        clauseBody.push(
          array(
            sym("if"),
            array(sym("!"), preExpr),
            array(
              sym("throw"),
              array(sym("new"), sym("Error"), {
                type: "string",
                value: preMsg
              })
            )
          )
        );
      }
      const hasReturns = returnsClause && returnsClause.length > 0;
      const hasPost = postClause && postClause.length > 0;
      if (hasPost) {
        const resultVar = gensym("result");
        if (bodyClause.length === 1) {
          clauseBody.push(array(sym("const"), resultVar, bodyClause[0]));
        } else {
          clauseBody.push(...bodyClause.slice(0, -1));
          clauseBody.push(
            array(sym("const"), resultVar, bodyClause[bodyClause.length - 1])
          );
        }
        const postExpr = postClause[0];
        const postMsg = `${funcName}: post-condition failed: ${formatSExpr(postExpr)} \u2014 callee blame`;
        const postWithResult = replaceTilde(postExpr, resultVar);
        clauseBody.push(
          array(
            sym("if"),
            array(sym("!"), postWithResult),
            array(
              sym("throw"),
              array(sym("new"), sym("Error"), {
                type: "string",
                value: postMsg
              })
            )
          )
        );
        clauseBody.push(array(sym("return"), resultVar));
      } else if (hasReturns) {
        clauseBody.push(...wrapReturnLast(bodyClause));
      } else {
        clauseBody.push(...bodyClause);
      }
      stmts.push(
        array(sym("if"), condition, array(sym("block"), ...clauseBody))
      );
    }
    stmts.push(
      array(
        sym("throw"),
        array(sym("new"), sym("TypeError"), {
          type: "string",
          value: `${funcName}: no matching clause for arguments`
        })
      )
    );
    return array(
      sym("function"),
      funcNameNode,
      array(array(sym("rest"), argsVar)),
      ...stmts
    );
  }
  function emitGenfuncMacro(args) {
    if (args.length < 2) {
      throw new Error("genfunc requires at least a name and :yields/:body");
    }
    const funcNameNode = args[0];
    if (funcNameNode.type !== "atom") {
      throw new Error("genfunc: first argument must be a function name");
    }
    const funcName = funcNameNode.value;
    const clauseArgs = args.slice(1);
    const clauses = parseKeywordClauses(clauseArgs);
    const argsClause = clauses.get("args");
    const yieldsClause = clauses.get("yields");
    const _returnsClause = clauses.get("returns");
    const preClause = clauses.get("pre");
    const _postClause = clauses.get("post");
    const bodyClause = clauses.get("body");
    if (!bodyClause || bodyClause.length === 0) {
      throw new Error(`genfunc ${funcName}: :body is required`);
    }
    let params = [];
    if (argsClause && argsClause.length === 1 && isArray(argsClause[0])) {
      params = parseTypedParams(argsClause[0]);
    }
    const pNames = params.flatMap((p) => paramNameNodes(p));
    const bodyStmts = [];
    for (const p of params) {
      bodyStmts.push(...paramTypeChecks(p, funcName));
    }
    if (preClause && preClause.length > 0) {
      const preExpr = preClause[0];
      const preMsg = `${funcName}: pre-condition failed: ${formatSExpr(preExpr)} \u2014 caller blame`;
      bodyStmts.push(
        array(
          sym("if"),
          array(sym("!"), preExpr),
          array(
            sym("throw"),
            array(sym("new"), sym("Error"), { type: "string", value: preMsg })
          )
        )
      );
    }
    let instrumentedBody = bodyClause;
    if (yieldsClause && yieldsClause.length > 0) {
      const yieldsType = yieldsClause[0];
      if (isKeyword(yieldsType) && yieldsType.value !== "any") {
        instrumentedBody = bodyClause.map(
          (expr) => instrumentYields(expr, yieldsType, funcName)
        );
      }
    }
    bodyStmts.push(...instrumentedBody);
    return array(
      sym("function*"),
      funcNameNode,
      array(...pNames),
      ...bodyStmts
    );
  }
  function parseMatchClause(clause, i) {
    if (!isArray(clause) || clause.values.length < 2) {
      throw new Error(
        `match: clause ${i} must be (pattern body...) or (pattern :when guard body...)`
      );
    }
    const pattern = clause.values[0];
    let guard = null;
    let bodyStart = 1;
    if (isMatchGuardSlot(clause)) {
      guard = clause.values[2];
      bodyStart = 3;
    }
    const bodyForms = clause.values.slice(bodyStart);
    if (bodyForms.length === 0) {
      throw new Error(`match: clause ${i} has no body`);
    }
    return { pattern, guard, bodyForms };
  }
  function emitMatchMacro(args) {
    if (args.length < 2) {
      throw new Error("match requires an expression and at least one clause");
    }
    const expr = args[0];
    const clauses = args.slice(1);
    const targetVar = gensym("target");
    const stmts = [array(sym("const"), targetVar, expr)];
    for (let i = 0; i < clauses.length; i++) {
      const { pattern, guard, bodyForms } = parseMatchClause(clauses[i], i);
      const { checks, bindings } = compilePattern2(pattern, targetVar);
      if (guard) {
        const condition = checks.length > 0 ? andChain(checks) : null;
        const innerBlock = [...bindings];
        const wrapped = wrapReturnLast(bodyForms);
        const guardedBody = wrapped.length === 1 ? wrapped[0] : array(sym("block"), ...wrapped);
        innerBlock.push(array(sym("if"), guard, guardedBody));
        if (condition) {
          stmts.push(
            array(sym("if"), condition, array(sym("block"), ...innerBlock))
          );
        } else {
          stmts.push(array(sym("block"), ...innerBlock));
        }
      } else {
        const isWildcard = pattern.type === "atom" && pattern.value === "_";
        const isSimpleBinding = pattern.type === "atom" && !isPascalCase(pattern.value) && pattern.value !== "_" && pattern.value !== "true" && pattern.value !== "false" && pattern.value !== "null" && pattern.value !== "undefined";
        if (isWildcard || isSimpleBinding) {
          const block = [...bindings, ...wrapReturnLast(bodyForms)];
          stmts.push(array(sym("block"), ...block));
        } else {
          const condition = andChain(checks);
          const block = [...bindings, ...wrapReturnLast(bodyForms)];
          stmts.push(
            array(sym("if"), condition, array(sym("block"), ...block))
          );
        }
      }
    }
    const lastClause = clauses[clauses.length - 1];
    const lastPattern = lastClause.values[0];
    const isLastWildcard = lastPattern.type === "atom" && lastPattern.value === "_";
    const isLastBinding = lastPattern.type === "atom" && !isPascalCase(lastPattern.value) && lastPattern.value !== "true" && lastPattern.value !== "false" && lastPattern.value !== "null" && lastPattern.value !== "undefined";
    if (!isLastWildcard && !isLastBinding) {
      stmts.push(
        array(
          sym("throw"),
          array(sym("new"), sym("Error"), {
            type: "string",
            value: "match: no matching pattern"
          })
        )
      );
    }
    const arrowFn = array(sym("=>"), array(), ...stmts);
    return array(arrowFn);
  }
  function emitMatchStatementMacro(args, {
    expandValue,
    expandHeader,
    expandBody,
    env,
    reserveNames
  }) {
    if (args.length < 2) throw new Error("match requires an expression and at least one clause");
    const reserved = reserveNames(args);
    let provisional = gensym("target");
    while (reserved.has(toJsIdentifier(provisional.value))) provisional = gensym("target");
    const header = expandHeader ?? ((form, scope) => ({ prefix: [], value: expandValue(form, scope) }));
    const subject = header(args[0], env);
    const clauses = [];
    for (let i = 0; i < args.length - 1; i++) {
      const { pattern, guard, bodyForms } = parseMatchClause(args[i + 1], i);
      const compiled = compilePattern2(pattern, provisional);
      const names = compiled.bindings.flatMap(
        (binding) => binding?.type === "list" && binding.values[0]?.value === "const" && binding.values[1]?.type === "atom" ? [binding.values[1].value] : []
      );
      const clauseEnv = /* @__PURE__ */ new Set([...env, ...names]);
      clauses.push({
        pattern,
        compiled,
        provisional,
        guard: guard ? header(guard, clauseEnv) : null,
        body: expandBody(bodyForms, clauseEnv)
      });
    }
    reserveNames([
      subject.value,
      ...subject.prefix,
      ...clauses.flatMap((c) => [
        c.guard?.value,
        ...c.guard?.prefix ?? [],
        ...c.body
      ])
    ], reserved);
    let target = provisional;
    if (reserved.has(toJsIdentifier(provisional.value))) {
      target = gensym("target");
      while (reserved.has(toJsIdentifier(target.value))) target = gensym("target");
    }
    reserved.add(toJsIdentifier(target.value));
    let matched = gensym("matched");
    while (reserved.has(toJsIdentifier(matched.value))) matched = gensym("matched");
    const retarget = (node, oldTarget, declarationName = false) => {
      if (!node || typeof node !== "object") return node;
      if (!declarationName && node.type === "atom" && (node.value === oldTarget || node.value.startsWith(`${oldTarget}:`))) {
        return { ...node, value: `${target.value}${node.value.slice(oldTarget.length)}` };
      }
      if (node.type === "list") {
        const isConst = node.values[0]?.type === "atom" && node.values[0].value === "const";
        return { ...node, values: node.values.map((n, i) => retarget(n, oldTarget, isConst && i === 1)) };
      }
      if (node.type === "cons") return { ...node, car: retarget(node.car, oldTarget), cdr: retarget(node.cdr, oldTarget) };
      return node;
    };
    const out = [
      sym("block"),
      ...subject.prefix,
      array(sym("const"), target, subject.value),
      array(sym("let"), matched, sym("false"))
    ];
    let terminal = false;
    for (const clause of clauses) {
      const oldTarget = clause.provisional.value;
      const checks = clause.compiled.checks.map((n) => retarget(n, oldTarget));
      const bindings = clause.compiled.bindings.map((n) => retarget(n, oldTarget));
      const candidate = [sym("block"), ...bindings];
      const selected = array(sym("block"), array(sym("="), matched, sym("true")), ...clause.body);
      if (clause.guard) candidate.push(
        ...clause.guard.prefix,
        array(sym("if"), clause.guard.value, selected)
      );
      else candidate.push(selected);
      out.push(array(sym("if"), andChain([array(sym("!"), matched), ...checks]), array(...candidate)));
      const p = clause.pattern;
      const irrefutable = p?.type === "atom" && (p.value === "_" || !isPascalCase(p.value) && !["true", "false", "null", "undefined"].includes(p.value));
      if (!clause.guard && irrefutable) {
        terminal = true;
        break;
      }
    }
    if (!terminal) out.push(array(
      sym("if"),
      array(sym("!"), matched),
      array(sym("throw"), array(sym("new"), sym("Error"), { type: "string", value: "match: no matching pattern" }))
    ));
    return markKernel(array(...out));
  }
  function emitTypeMacro(args) {
    if (args.length < 2) {
      throw new Error("type requires a name and at least one constructor");
    }
    const typeName = args[0];
    if (typeName.type !== "atom") {
      throw new Error("type: first argument must be a type name");
    }
    const constructors = args.slice(1);
    const forms = [];
    for (const ctor of constructors) {
      if (ctor.type === "atom") {
        const ctorName = ctor.value;
        typeRegistry.set(ctorName, []);
        forms.push(
          array(
            sym("const"),
            ctor,
            array(
              sym("object"),
              array(sym("tag"), { type: "string", value: ctorName })
            )
          )
        );
      } else if (isArray(ctor) && ctor.values.length >= 1) {
        const ctorName = ctor.values[0].value;
        const fields = parseTypedParams({
          type: "list",
          values: ctor.values.slice(1)
        });
        const fieldNames = fields.map((f) => f.name.value);
        typeRegistry.set(ctorName, fieldNames);
        const paramNames = fields.map((f) => f.name);
        const typeChecks = [];
        for (const f of fields) {
          const check = buildTypeCheck(f.name, f.typeKw, ctorName, "field");
          if (check) typeChecks.push(check);
        }
        const objPairs = [
          array(sym("tag"), { type: "string", value: ctorName })
        ];
        for (const f of fields) {
          objPairs.push(array(sym(f.name.value), f.name));
        }
        forms.push(
          array(
            sym("function"),
            sym(ctorName),
            array(...paramNames),
            ...typeChecks,
            array(sym("return"), array(sym("object"), ...objPairs))
          )
        );
      }
    }
    if (forms.length === 1) return forms[0];
    return forms;
  }
  function parseKeywordClauses(args) {
    const clauses = /* @__PURE__ */ new Map();
    let currentKey = null;
    let currentValues = [];
    for (const arg of args) {
      if (isKeyword(arg) && FUNC_CLAUSE_KEYS2.has(arg.value)) {
        if (currentKey !== null) {
          clauses.set(currentKey, currentValues);
        }
        currentKey = arg.value;
        currentValues = [];
      } else {
        currentValues.push(arg);
      }
    }
    if (currentKey !== null) {
      clauses.set(currentKey, currentValues);
    }
    return clauses;
  }
  function instrumentYields(node, yieldsType, funcName) {
    if (!node || node.type !== "list") return node;
    const vals = node.values;
    if (vals.length === 0) return node;
    if (vals[0].type === "atom" && vals[0].value === "yield" && vals.length >= 2) {
      const yieldedExpr = instrumentYields(vals[1], yieldsType, funcName);
      const vVar = gensym("yv");
      const check = buildTypeCheck(vVar, yieldsType, funcName, "yield");
      if (check) {
        const iife = array(
          array(
            sym("=>"),
            array(),
            array(sym("const"), vVar, yieldedExpr),
            check,
            array(sym("return"), vVar)
          )
        );
        return array(sym("yield"), iife);
      }
      return array(sym("yield"), yieldedExpr);
    }
    if (vals[0].type === "atom" && vals[0].value === "yield*") {
      return node;
    }
    return {
      ...node,
      values: vals.map((v) => instrumentYields(v, yieldsType, funcName))
    };
  }
  function replaceTilde(node, replacement) {
    if (!node) return node;
    if (node.type === "atom" && node.value === "~") return replacement;
    if (node.type === "list") {
      return {
        type: "list",
        values: node.values.map((v) => replaceTilde(v, replacement))
      };
    }
    return node;
  }
  function paramDispatchType(p) {
    if (p.destructured) return p.kind;
    return p.typeKw.value;
  }
  function checkFuncClauseOverlap(funcName, clauses) {
    for (let i = 0; i < clauses.length; i++) {
      for (let j = i + 1; j < clauses.length; j++) {
        const left = clauses[i];
        const right = clauses[j];
        if (left.arity !== right.arity) continue;
        if (funcClauseTypesOverlap(left.params, right.params)) {
          throw new Error(
            `${funcName}: clauses ${left.index} and ${right.index} overlap (same arity ${left.arity}, compatible types)`
          );
        }
      }
    }
  }
  function funcClauseTypesOverlap(leftParams, rightParams) {
    for (let i = 0; i < leftParams.length; i++) {
      const leftType = paramDispatchType(leftParams[i]);
      const rightType = paramDispatchType(rightParams[i]);
      if (!dispatchTypesOverlap(leftType, rightType)) {
        return false;
      }
    }
    return true;
  }
  function dispatchTypesOverlap(leftType, rightType) {
    return leftType === "any" || rightType === "any" || leftType === rightType;
  }
  var FUNC_CLAUSE_KEYS2 = /* @__PURE__ */ new Set([
    "args",
    "returns",
    "yields",
    "pre",
    "post",
    "body"
  ]);

  // packages/lang/kernel-forms.js
  var KERNEL_FORMS = /* @__PURE__ */ new Set([
    "const",
    "let",
    "var",
    "function",
    "function*",
    "=>",
    "if",
    "block",
    "return",
    "throw",
    "try",
    "while",
    "do-while",
    "for",
    "for-of",
    "for-in",
    "for-await-of",
    "switch",
    "break",
    "continue",
    "new",
    "delete",
    "typeof",
    "instanceof",
    "in",
    "void",
    "yield",
    "yield*",
    "label",
    "seq",
    "debugger",
    "import",
    "export",
    "dynamic-import",
    "async",
    "await",
    "get",
    "=",
    "array",
    "object",
    "spread",
    "rest",
    "default",
    "alias",
    "template",
    "tag",
    "regex",
    "?",
    "quote",
    "quasiquote",
    "+",
    "-",
    "*",
    "/",
    "%",
    "**",
    "===",
    "!==",
    "==",
    "!=",
    "<",
    ">",
    "<=",
    ">=",
    "&&",
    "||",
    "??",
    "&",
    "|",
    "^",
    "<<",
    ">>",
    ">>>",
    "!",
    "~",
    "++",
    "--",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "**=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "&&=",
    "||=",
    "??="
  ]);
  var KERNEL_ONLY_FORMS = /* @__PURE__ */ new Set([
    "const",
    "let",
    "var",
    "function",
    "function*"
  ]);
  function levenshtein(a, b) {
    const n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    let curr = new Array(n + 1).fill(0);
    for (let i = 0; i < a.length; i++) {
      curr[0] = i + 1;
      for (let j = 0; j < n; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        curr[j + 1] = Math.min(prev[j] + cost, prev[j + 1] + 1, curr[j] + 1);
      }
      [prev, curr] = [curr, prev];
    }
    return prev[n];
  }
  function closestKernelForm(name) {
    let best = null;
    let bestDist = Infinity;
    for (const form of KERNEL_FORMS) {
      const d = levenshtein(name, form);
      if (d < bestDist) {
        bestDist = d;
        best = form;
      }
    }
    return bestDist <= 2 ? best : null;
  }
  function kernelOnlyMessage(head) {
    if (head === "const" || head === "let" || head === "var") {
      return `'${head}' is a kernel-only form; use 'bind' for surface binding, or '(kernel:${head} ...)' to access the kernel form explicitly`;
    }
    return `'${head}' is a kernel-only form; use 'func', 'fn', or 'lambda' for surface functions, or '(kernel:${head} ...)' to access the kernel form explicitly`;
  }

  // packages/lang/expander-core.js
  var gensymCounter = 0;
  var macroEnv = /* @__PURE__ */ new Map();
  var MAX_EXPAND_ITERATIONS = 1e3;
  function sym(name) {
    return { type: "atom", value: name };
  }
  function gensym(prefix = "g") {
    return { type: "atom", value: `${prefix}__gensym${gensymCounter++}` };
  }
  function array(...items) {
    return { type: "list", values: items };
  }
  function append(...arrays) {
    const values = [];
    for (const arr of arrays) {
      if (Array.isArray(arr)) {
        values.push(...arr);
      } else if (arr && arr.type === "list") {
        values.push(...arr.values);
      } else {
        throw new Error(`append: expected list node or array, got ${arr?.type ?? "null"}`);
      }
    }
    return { type: "list", values };
  }
  function isArray(x) {
    return x !== null && x !== void 0 && x.type === "list";
  }
  function isSymbol(x) {
    return x !== null && x !== void 0 && x.type === "atom";
  }
  function isNumber(x) {
    return x !== null && x !== void 0 && x.type === "number";
  }
  function isString(x) {
    return x !== null && x !== void 0 && x.type === "string";
  }
  function isKeyword(x) {
    return x !== null && x !== void 0 && x.type === "keyword";
  }
  function first(arr) {
    return arr.values[0];
  }
  function rest(arr) {
    return { type: "list", values: arr.values.slice(1) };
  }
  var concat = append;
  function length(arr) {
    return arr.values.length;
  }
  function nth(arr, n) {
    return arr.values[n];
  }
  function formatSExpr(node) {
    if (node === null || node === void 0) return "null";
    if (node.type === "atom") return node.value;
    if (node.type === "keyword") return `:${node.value}`;
    if (node.type === "string") return `"${node.value}"`;
    if (node.type === "number") return String(node.value);
    if (node.type === "cons") return `(${formatSExpr(node.car)} . ${formatSExpr(node.cdr)})`;
    if (node.type === "list") {
      return `(${node.values.map(formatSExpr).join(" ")})`;
    }
    return String(node);
  }
  function desugarCons(args) {
    if (args.length !== 2) {
      throw new Error("cons requires exactly 2 arguments");
    }
    return array(sym("array"), args[0], args[1]);
  }
  function desugarList(args) {
    if (args.length === 0) {
      return sym("null");
    }
    let result = sym("null");
    for (let i = args.length - 1; i >= 0; i--) {
      result = array(sym("array"), args[i], result);
    }
    return result;
  }
  function desugarCar(args) {
    if (args.length !== 1) throw new Error("car requires exactly 1 argument");
    return array(sym("get"), args[0], { type: "number", value: 0 });
  }
  function desugarCdr(args) {
    if (args.length !== 1) throw new Error("cdr requires exactly 1 argument");
    return array(sym("get"), args[0], { type: "number", value: 1 });
  }
  function desugarCadr(args) {
    if (args.length !== 1) throw new Error("cadr requires exactly 1 argument");
    return array(
      sym("get"),
      array(sym("get"), args[0], { type: "number", value: 1 }),
      { type: "number", value: 0 }
    );
  }
  function desugarCddr(args) {
    if (args.length !== 1) throw new Error("cddr requires exactly 1 argument");
    return array(
      sym("get"),
      array(sym("get"), args[0], { type: "number", value: 1 }),
      { type: "number", value: 1 }
    );
  }
  function desugarAs(args) {
    if (args.length !== 2) throw new Error("as requires exactly 2 arguments");
    if (args[0].type === "atom") {
      return array(sym("alias"), args[0], args[1]);
    }
    throw new Error("as with pattern first argument must appear in binding position (const/let/var)");
  }
  var MACRO_API_PARAMS = [
    "$array",
    "$sym",
    "$gensym",
    "$isArray",
    "$isSymbol",
    "$isNumber",
    "$isString",
    "$isKeyword",
    "$first",
    "$rest",
    "$concat",
    "$nth",
    "$length",
    "$append"
  ];
  var MACRO_API_VALUES = [
    array,
    sym,
    gensym,
    isArray,
    isSymbol,
    isNumber,
    isString,
    isKeyword,
    first,
    rest,
    concat,
    nth,
    length,
    append
  ];
  var compileStrategy = {
    /** Wrap an atom as an API call that creates a symbol node at runtime. */
    quoteAtom(form) {
      return array(sym("$sym"), { type: "string", value: form.value });
    },
    /** Build a list/cons node via the $array API. */
    makeArray(...items) {
      return array(sym("$array"), ...items);
    },
    /** Quote a symbol name for embedding in a nested quasiquote/unquote form. */
    quoteSymbol(name) {
      return array(sym("$sym"), { type: "string", value: name });
    },
    /** Build a typed number node in the compiled macro result. */
    numberLiteral(form) {
      return array(
        sym("object"),
        array(sym("type"), { type: "string", value: "number" }),
        array(sym("value"), form)
      );
    },
    /** Concatenate spliced and non-spliced parts via $concat. */
    makeConcat(...args) {
      return array(sym("$concat"), ...args);
    },
    /** Empty list representation. */
    emptyList() {
      return array(sym("$array"));
    },
    /** Whether this strategy tracks literal elements (for quoteLiteral opt). */
    tracksLiterals: false,
    /** Wrap an atom element in the element walker. */
    wrapAtomElement(element) {
      return array(sym("$sym"), { type: "string", value: element.value });
    }
  };
  var expandStrategy = {
    quoteAtom(form) {
      return array(sym("quote"), form);
    },
    makeArray(...items) {
      return array(sym("array"), ...items);
    },
    quoteSymbol(name) {
      return array(sym("quote"), sym(name));
    },
    /** Number nodes remain unchanged during ordinary quasiquote expansion. */
    numberLiteral(form) {
      return form;
    },
    makeConcat(...args) {
      return array(sym("append"), ...args);
    },
    emptyList(form) {
      return form;
    },
    tracksLiterals: true,
    wrapAtomElement(element) {
      return array(sym("quote"), element);
    }
  };
  function walkQuasiquote(form, depth, strategy) {
    if (form.type === "number") {
      return strategy.numberLiteral(form);
    }
    if (form.type === "string" || form.type === "keyword") {
      return form;
    }
    if (form.type === "atom") {
      return strategy.quoteAtom(form);
    }
    if (form.type === "cons") {
      const car = walkQuasiquote(form.car, depth, strategy);
      const cdr = walkQuasiquote(form.cdr, depth, strategy);
      return strategy.makeArray(car, cdr);
    }
    if (form.type !== "list") {
      throw new Error(`walkQuasiquote: unexpected node type '${form.type}'`);
    }
    const values = form.values;
    if (values.length === 0) {
      return strategy.emptyList(form);
    }
    const head = values[0];
    if (head.type === "atom" && head.value === "quasiquote") {
      if (values.length !== 2) throw new Error("quasiquote requires exactly one argument");
      const inner = walkQuasiquote(values[1], depth + 1, strategy);
      return strategy.makeArray(strategy.quoteSymbol("quasiquote"), inner);
    }
    if (head.type === "atom" && head.value === "unquote") {
      if (values.length !== 2) throw new Error("unquote requires exactly one argument");
      if (depth === 0) {
        return values[1];
      }
      const inner = walkQuasiquote(values[1], depth - 1, strategy);
      return strategy.makeArray(strategy.quoteSymbol("unquote"), inner);
    }
    if (head.type === "atom" && head.value === "unquote-splicing") {
      if (depth === 0) {
        throw new Error("unquote-splicing not inside a list");
      }
      if (values.length !== 2) throw new Error("unquote-splicing requires exactly one argument");
      const inner = walkQuasiquote(values[1], depth - 1, strategy);
      return strategy.makeArray(strategy.quoteSymbol("unquote-splicing"), inner);
    }
    const parts = values.map((el) => walkQQElement(el, depth, strategy));
    if (strategy.tracksLiterals && parts.every((p) => p.isLiteral)) {
      return quoteLiteral(form);
    }
    if (!parts.some((p) => p.isSplice)) {
      return strategy.makeArray(...parts.map((p) => p.node));
    }
    const concatArgs = parts.map((p) => {
      if (p.isSplice) return p.node;
      return strategy.makeArray(p.node);
    });
    return strategy.makeConcat(...concatArgs);
  }
  function walkQQElement(element, depth, strategy) {
    if (element.type === "list" && element.values.length === 2 && element.values[0].type === "atom" && element.values[0].value === "unquote") {
      if (depth === 0) {
        return { node: element.values[1], isSplice: false, isLiteral: false };
      }
      return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
    }
    if (element.type === "list" && element.values.length === 2 && element.values[0].type === "atom" && element.values[0].value === "unquote-splicing") {
      if (depth === 0) {
        return { node: element.values[1], isSplice: true, isLiteral: false };
      }
      return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
    }
    if (element.type === "list") {
      return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
    }
    if (element.type === "number") {
      return { node: strategy.numberLiteral(element), isSplice: false, isLiteral: true };
    }
    if (element.type === "string") {
      return { node: element, isSplice: false, isLiteral: true };
    }
    if (element.type === "atom") {
      return { node: strategy.wrapAtomElement(element), isSplice: false, isLiteral: true };
    }
    if (element.type === "cons") {
      return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
    }
    return { node: element, isSplice: false, isLiteral: true };
  }
  function compileQuasiquote(form, depth) {
    return walkQuasiquote(form, depth, compileStrategy);
  }
  function resolveAutoGensym(form) {
    const genMap = /* @__PURE__ */ new Map();
    function resolve(node) {
      if (node === null || node === void 0) return node;
      if (node.type === "atom" && node.value.endsWith("#gen")) {
        const prefix = node.value.slice(0, -4);
        if (!genMap.has(prefix)) {
          genMap.set(prefix, gensym(prefix));
        }
        return genMap.get(prefix);
      }
      if (node.type === "list") {
        return { type: "list", values: node.values.map(resolve) };
      }
      if (node.type === "cons") {
        return { type: "cons", car: resolve(node.car), cdr: resolve(node.cdr) };
      }
      return node;
    }
    return resolve(form);
  }
  function compileMacroBody(_paramNames, paramPattern, bodyForms) {
    const processedBody = bodyForms.map((form) => processBodyForm(form));
    const jsParams = compileParamList(paramPattern);
    const bodyStatements = processedBody.map((form, i) => {
      if (i === processedBody.length - 1) {
        return array(sym("return"), form);
      }
      return form;
    });
    const fnForm = array(sym("lambda"), array(...jsParams), ...bodyStatements);
    const jsCode = generate({
      type: "Program",
      body: [{ type: "ExpressionStatement", expression: compileExpr(fnForm) }],
      sourceType: "module"
    }, { indent: "  " });
    return `return ${jsCode.trim()};`;
  }
  function processBodyForm(form) {
    if (form === null || form === void 0) return form;
    if (form.type !== "list" || form.values.length === 0) return form;
    const head = form.values[0];
    if (head.type === "atom" && head.value === "quasiquote") {
      if (form.values.length !== 2) throw new Error("quasiquote requires exactly one argument");
      const body = resolveAutoGensym(form.values[1]);
      return compileQuasiquote(body, 0);
    }
    return { type: "list", values: form.values.map(processBodyForm) };
  }
  function compileParamList(pattern) {
    if (pattern.type !== "list") return [];
    const params = [];
    for (const p of pattern.values) {
      if (p.type === "atom") {
        if (p.value === "_") {
          params.push(sym("_"));
        } else {
          params.push(p);
        }
      } else if (p.type === "list" && p.values.length >= 1) {
        const head = p.values[0];
        if (head.type === "atom" && head.value === "rest") {
          params.push(p);
        } else if (head.type === "atom" && head.value === "default") {
          params.push(p);
        } else {
          params.push(p);
        }
      }
    }
    return params;
  }
  function registerMacroForm(nameNode, paramsNode, bodyForms) {
    const name = nameNode.value;
    if (macroEnv.has(name)) {
      throw new Error(`duplicate macro definition: '${name}'`);
    }
    const paramNames = extractParamNames(paramsNode);
    const jsBody = compileMacroBody(paramNames, paramsNode, bodyForms);
    try {
      const factory = new Function(...MACRO_API_PARAMS, jsBody);
      const macroFn = factory(...MACRO_API_VALUES);
      macroEnv.set(name, macroFn);
    } catch (err) {
      throw new Error(`failed to compile macro '${name}': ${err.message}`, { cause: err });
    }
  }
  function extractParamNames(pattern) {
    const names = /* @__PURE__ */ new Set();
    function walk2(node) {
      if (node === null || node === void 0) return;
      if (node.type === "atom" && node.value !== "_") {
        names.add(node.value);
      } else if (node.type === "list") {
        const head = node.values[0];
        if (head?.type === "atom" && head.value === "rest" && node.values[1]) {
          walk2(node.values[1]);
        } else if (head?.type === "atom" && head.value === "default" && node.values[1]) {
          walk2(node.values[1]);
        } else {
          for (const child of node.values) walk2(child);
        }
      }
    }
    if (pattern.type === "list") {
      for (const p of pattern.values) walk2(p);
    }
    return names;
  }
  function expandQuasiquote(form, depth) {
    return walkQuasiquote(form, depth, expandStrategy);
  }
  function quoteLiteral(form) {
    if (form.type === "number" || form.type === "string") return form;
    if (form.type === "atom") return array(sym("quote"), form);
    if (form.type === "list") {
      if (form.values.length === 0) return form;
      return array(...form.values.map(quoteLiteral));
    }
    if (form.type === "cons") {
      return array(quoteLiteral(form.car), quoteLiteral(form.cdr));
    }
    return form;
  }
  var dispatchTable = Object.assign(/* @__PURE__ */ Object.create(null), {
    "quote": { walk: "none" },
    "macro": { walk: "register-macro" },
    "cons": { walk: "desugar", transform: desugarCons },
    "list": { walk: "desugar", transform: desugarList },
    "car": { walk: "desugar", transform: desugarCar },
    "cdr": { walk: "desugar", transform: desugarCdr },
    "cadr": { walk: "desugar", transform: desugarCadr },
    "cddr": { walk: "desugar", transform: desugarCddr },
    "as": { walk: "desugar", transform: desugarAs },
    "const": { walk: "expand-binding", keyword: "const" },
    "let": { walk: "expand-binding", keyword: "let" },
    "var": { walk: "expand-binding", keyword: "var" },
    "import-macros": { walk: "import-macros" },
    "macroexpand": { walk: "debug-expand", mode: "full" },
    "macroexpand-1": { walk: "debug-expand", mode: "once" }
  });
  var EMPTY_ENV = /* @__PURE__ */ new Set();
  var directResultBlocks = /* @__PURE__ */ new WeakSet();
  var returnOperandValues = /* @__PURE__ */ new WeakSet();
  var completionValueAtoms = /* @__PURE__ */ new WeakMap();
  var completionValueAtomCount = 0;
  function completionValueAtom(identity) {
    const atom = sym("completionValue__private");
    completionValueAtoms.set(atom, identity);
    completionValueAtomCount++;
    return atom;
  }
  function preserveAnonymousName(value) {
    const isAnonymousDefinition = (node) => {
      if (node?.type !== "list" || node.values.length === 0) return false;
      const head = formHead(node.values[0]);
      switch (head) {
        case "=>":
        case "lambda":
        case "class-expr":
          return node.values[1]?.type === "list";
        case "function*":
          return node.values.length >= 3 && node.values[1]?.type === "list" || node.values.length >= 4 && node.values[1]?.type === "atom" && node.values[1].value === "" && node.values[2]?.type === "list";
        case "async": {
          if (node.values.length !== 2) return false;
          const child = node.values[1];
          const childHead = child?.type === "list" && child.values.length > 0 ? formHead(child.values[0]) : null;
          return ["=>", "lambda", "function*"].includes(childHead) && isAnonymousDefinition(child);
        }
        default:
          return false;
      }
    };
    if (!isAnonymousDefinition(value)) return value;
    return markKernel(array(
      sym("?"),
      sym("true"),
      value,
      array(sym("void"), { type: "number", value: 0 })
    ));
  }
  function isAssignResultUse(use) {
    return use !== null && typeof use === "object" && use.kind === "Assign";
  }
  function isResultOperandUse(use) {
    return use === "ReturnOperand" || isAssignResultUse(use);
  }
  function resultValueStatement(use, value) {
    if (use === "ReturnOperand") return array(sym("return"), value);
    return array(sym("="), completionValueAtom(use.identity), preserveAnonymousName(value));
  }
  function resultNoValueStatement(use) {
    if (use === "ReturnOperand") return array(sym("return"));
    return array(sym("="), completionValueAtom(use.identity), array(sym("void"), { type: "number", value: 0 }));
  }
  function isDirectReturnFunc(node) {
    if (!node || node.type !== "Func") return false;
    const restArgs = node.restArgs ?? [];
    const first2 = restArgs[0];
    if (first2?.type === "list" && first2.values.length > 0 && first2.values[0]?.type === "keyword") {
      return false;
    }
    const clauses = parseKeywordClauses(restArgs);
    if ((clauses.get("post")?.length ?? 0) > 0) return false;
    const returns = clauses.get("returns");
    if (!returns || returns.length === 0) return true;
    return returns[0]?.type === "keyword" && returns[0].value === "any";
  }
  var FUNCTION_FAMILY = /* @__PURE__ */ new Set(["func", "genfunc", "fn", "lambda", "genfn"]);
  function tagDefSites(form) {
    for (const site of bindingsIntroduced(form)) {
      if (site.node && site.node.type === "atom") site.node.binding = "def";
    }
  }
  function pushExpanded(out, result) {
    if (Array.isArray(result)) out.push(...result);
    else out.push(result);
  }
  function useAtFunctionBoundary(child, use) {
    if (use !== "DirectStatement" || child?.type !== "list" || child.values.length === 0) return use;
    return ["function", "function*", "=>", "lambda", "async"].includes(formHead(child.values[0])) ? "Statement" : use;
  }
  function expandSingle(form, env, use, context) {
    const result = expandAt(form, env, use);
    if (Array.isArray(result)) {
      if (result.length !== 1) throw new Error(`${context} must expand to a single form`);
      return result[0];
    }
    return result;
  }
  function expandChildrenSeq(children, env, use = "Legacy") {
    const out = [];
    let cur = env;
    for (const child of children) {
      const childUse = useAtFunctionBoundary(child, use);
      pushExpanded(out, expandAt(child, cur, childUse));
      const hoist = child?.type === "list" ? hoistedNames(child) : [];
      if (hoist.length) cur = extendBindingEnv(cur, hoist);
    }
    return out;
  }
  function expandChildrenTail(children, env, prefixUse, tailUse) {
    if (children.length === 0) return { prefix: [], tail: null };
    const prefix = [];
    let cur = env;
    for (const child of children.slice(0, -1)) {
      pushExpanded(prefix, expandAt(child, cur, useAtFunctionBoundary(child, prefixUse)));
      const hoist = child?.type === "list" ? hoistedNames(child) : [];
      if (hoist.length) cur = extendBindingEnv(cur, hoist);
    }
    const tail = expandAt(children[children.length - 1], cur, tailUse);
    return { prefix, tail };
  }
  function expandChildrenPlan(form, env, use = "Legacy") {
    const plan = bindingScopePlan(form, formHead(form.values[0]));
    const children = form.values;
    if ((use === "Statement" || use === "DirectStatement") && formHead(children[0]) === "try") {
      return expandTryStatement(form, env, use);
    }
    if ((use === "Statement" || use === "DirectStatement") && formHead(children[0]) === "switch") {
      const out2 = [children[0]];
      let cur = plan.kind === "body" ? extendBindingEnv(env, plan.names) : env;
      if (children.length > 1) out2.push(expandSingle(children[1], cur, "Value", "switch discriminant"));
      for (const clause of children.slice(2)) {
        if (clause?.type !== "list" || clause.values.length === 0) {
          pushExpanded(out2, expandAt(clause, cur, "Legacy"));
          continue;
        }
        const isDefault = clause.values[0]?.type === "atom" && clause.values[0].value === "default";
        const prefix = isDefault ? [clause.values[0]] : [expandSingle(clause.values[0], cur, "Value", "switch test")];
        out2.push({ type: "list", values: [...prefix, ...expandChildrenSeq(clause.values.slice(1), cur, use)] });
        const hoist = hoistedNames(clause);
        if (hoist.length) cur = extendBindingEnv(cur, hoist);
      }
      return out2;
    }
    if (plan.kind === "conditional") {
      const out2 = [children[0]];
      if (children.length > 1) {
        const conditionUse = use === "Statement" || use === "DirectStatement" || isResultOperandUse(use) ? "Value" : use;
        out2.push(expandConditionalChild(children[1], env, true, conditionUse));
      }
      for (let i = 2; i < children.length; i++) {
        out2.push(expandConditionalChild(
          children[i],
          env,
          false,
          use === "Statement" ? "Statement" : use === "DirectEntry" ? "DirectStatement" : use
        ));
      }
      return out2;
    }
    if (plan.kind === "seq") {
      const roles2 = childRoles(form, use);
      const out2 = [];
      let cur = env;
      for (let i = 0; i < children.length; i++) {
        const requestedRole = roles2[i] ?? "Legacy";
        const role = useAtFunctionBoundary(children[i], requestedRole);
        pushExpanded(out2, role === "Value" ? expandSingle(children[i], cur, role, "expression slot") : expandAt(children[i], cur, role));
        const hoist = children[i]?.type === "list" ? hoistedNames(children[i]) : [];
        if (hoist.length) cur = extendBindingEnv(cur, hoist);
      }
      return out2;
    }
    const split = Math.min(plan.bodyStart, children.length);
    const out = [];
    const roles = childRoles(form, use);
    for (let i = 0; i < split; i++) {
      const role = roles[i] ?? (use === "Protected" ? "Protected" : "Legacy");
      pushExpanded(out, role === "Value" ? expandSingle(children[i], env, role, "expression slot") : expandAt(children[i], env, role));
    }
    if (split < children.length) {
      const bodyEnv = extendBindingEnv(env, plan.names);
      const bodyUse = use === "Statement" || use === "Protected" || use === "DirectStatement" ? use : "Legacy";
      let cur = bodyEnv;
      for (let i = split; i < children.length; i++) {
        const child = children[i];
        const requestedRole = roles[i] ?? bodyUse;
        const role = useAtFunctionBoundary(child, requestedRole);
        pushExpanded(out, role === "Value" ? expandSingle(child, cur, role, "expression slot") : expandAt(child, cur, role));
        const hoist = child?.type === "list" ? hoistedNames(child) : [];
        if (hoist.length) cur = extendBindingEnv(cur, hoist);
      }
    }
    return out;
  }
  function expandConditionalChild(child, env, isCondition, use = "Legacy") {
    const expanded = expandAt(child, env, useAtFunctionBoundary(child, use));
    if (!Array.isArray(expanded)) return expanded;
    if (isCondition && expanded.length > 1) {
      throw new Error("if condition must expand to a single form");
    }
    if (expanded.length > 1) return markKernel(array(sym("block"), ...expanded));
    return expanded[0] ?? null;
  }
  function expandTryStatement(form, env, use = "Statement") {
    const values = form.values;
    let bodyEnd = values.length;
    const finalizer = values[bodyEnd - 1];
    const hasFinally = finalizer?.type === "list" && finalizer.values[0]?.type === "atom" && finalizer.values[0].value === "finally";
    if (hasFinally) bodyEnd--;
    const catcher = values[bodyEnd - 1];
    const hasCatch = catcher?.type === "list" && catcher.values[0]?.type === "atom" && catcher.values[0].value === "catch";
    if (hasCatch) bodyEnd--;
    const out = [values[0]];
    let cur = env;
    for (let i = 1; i < bodyEnd; i++) {
      const child = values[i];
      const head = child?.type === "list" ? child.values[0] : null;
      const structuralElsewhere = head?.type === "atom" && (head.value === "catch" || head.value === "finally");
      const childUse = structuralElsewhere ? "Legacy" : useAtFunctionBoundary(child, use);
      pushExpanded(out, expandAt(child, cur, childUse));
      const hoist = child?.type === "list" ? hoistedNames(child) : [];
      if (hoist.length) cur = extendBindingEnv(cur, hoist);
    }
    if (hasCatch) {
      const catchEnv = extendBindingEnv(env, bodyScopeNames(catcher));
      out.push({ type: "list", values: [catcher.values[0], catcher.values[1], ...expandChildrenSeq(catcher.values.slice(2), catchEnv, use)] });
    }
    if (hasFinally) {
      out.push({ type: "list", values: [finalizer.values[0], ...expandChildrenSeq(finalizer.values.slice(1), env, use)] });
    }
    return out;
  }
  function childRoles(form, use) {
    const roles = Array(form.values.length).fill("Legacy");
    if (form.values.length === 0) return roles;
    const h = formHead(form.values[0]);
    if ((use === "DirectStatement" || isResultOperandUse(use)) && h === "return" && form.values.length === 2) {
      roles[1] = "ReturnOperand";
      return roles;
    }
    if (use === "DirectStatement" || isResultOperandUse(use)) {
      if (h === "block" || h === "do") {
        for (let i = 1; i < roles.length; i++) {
          roles[i] = use === "DirectStatement" ? "DirectStatement" : i === roles.length - 1 ? use : "Statement";
        }
        return roles;
      }
      if (h === "while" || h === "do-while") {
        roles[1] = "Value";
        for (let i = 2; i < roles.length; i++) roles[i] = "DirectStatement";
        return roles;
      }
      if (h === "for") {
        for (let i = 1; i <= 3 && i < roles.length; i++) roles[i] = "Value";
        for (let i = 4; i < roles.length; i++) roles[i] = "DirectStatement";
        return roles;
      }
      if (["for-of", "for-in", "for-await-of"].includes(h)) {
        roles[2] = "Value";
        for (let i = 3; i < roles.length; i++) roles[i] = "DirectStatement";
        return roles;
      }
      if (h === "label") {
        for (let i = 2; i < roles.length; i++) roles[i] = "DirectStatement";
        return roles;
      }
    }
    if (use === "Protected") return roles.fill("Protected");
    if (use === "Legacy") return roles;
    if (h === "function" || h === "function*") {
      const start = form.values[1]?.type === "atom" ? 3 : 2;
      for (let i = start; i < roles.length; i++) roles[i] = use === "DirectEntry" ? "DirectStatement" : "Statement";
      return roles;
    }
    if (h === "lambda") {
      for (let i = 2; i < roles.length; i++) roles[i] = use === "DirectEntry" ? "DirectStatement" : "Statement";
      return roles;
    }
    if (h === "=>") {
      for (let i = 2; i < roles.length; i++) roles[i] = use === "DirectEntry" ? "DirectStatement" : roles.length === 3 ? "Value" : "Statement";
      return roles;
    }
    if (h === "async") {
      if (roles.length > 1) roles[1] = "Value";
      return roles;
    }
    if (use !== "Statement" && use !== "Value") return roles;
    if (use === "Value" && h !== "function" && h !== "function*" && h !== "lambda" && h !== "=>" && h !== "async") return roles;
    if (h === "block" || h === "do") return roles.fill("Statement");
    if (h === "while" || h === "do-while") {
      roles[1] = "Value";
      for (let i = 2; i < roles.length; i++) roles[i] = "Statement";
    } else if (h === "for") {
      for (let i = 1; i <= 3 && i < roles.length; i++) roles[i] = "Value";
      for (let i = 4; i < roles.length; i++) roles[i] = "Statement";
    } else if (["for-of", "for-in", "for-await-of"].includes(h)) {
      roles[2] = "Value";
      for (let i = 3; i < roles.length; i++) roles[i] = "Statement";
    } else if (h === "label") {
      for (let i = 2; i < roles.length; i++) roles[i] = "Statement";
    } else if (h === "export" && use === "Statement") {
      const args = form.values.slice(1);
      if (args[0]?.type === "atom" && args[0].value === "default") {
        if (roles.length > 2) roles[2] = "Value";
      } else if (args.length === 1 && args[0]?.type === "list" && !(args[0].values[0]?.type === "atom" && args[0].values[0].value === "names")) {
        roles[1] = "Value";
      }
    }
    return roles;
  }
  function emittedNames(nodes, reserved = /* @__PURE__ */ new Set()) {
    const walk2 = (node) => {
      if (!node || typeof node !== "object") return;
      if (node.type === "atom") {
        if (completionValueAtoms.has(node)) {
          return;
        }
        reserved.add(toJsIdentifier(node.value));
        for (const part of node.value.split(":").filter(Boolean)) reserved.add(toJsIdentifier(part));
      } else if (node.type === "list") node.values.forEach(walk2);
      else if (node.type === "cons") {
        walk2(node.car);
        walk2(node.cdr);
      }
    };
    for (const node of nodes) walk2(node);
    return reserved;
  }
  function finalizeCompletionValueMarkers(forms) {
    const reserved = emittedNames(forms);
    const names = /* @__PURE__ */ new Map();
    let next = 0;
    const rename = (node) => {
      if (!node || typeof node !== "object") return;
      if (node.type === "atom") {
        const identity = completionValueAtoms.get(node);
        if (identity === void 0) return;
        let name = names.get(identity);
        if (name === void 0) {
          do {
            name = `completionValue__gensym${next++}`;
          } while (reserved.has(toJsIdentifier(name)));
          reserved.add(toJsIdentifier(name));
          names.set(identity, name);
        }
        node.value = name;
        completionValueAtoms.delete(node);
        return;
      }
      if (node.type === "list") node.values.forEach(rename);
      else if (node.type === "cons") {
        rename(node.car);
        rename(node.cdr);
      }
    };
    forms.forEach(rename);
  }
  function emitSurfaceMatchStatement(args, env) {
    return emitMatchStatementMacro(args, {
      env,
      expandValue: (form, scope) => expandSingle(form, scope, "Value", "match expression"),
      expandBody: (forms, scope) => expandChildrenSeq(forms, scope, "Statement"),
      reserveNames: emittedNames
    });
  }
  function emitSurfaceMatchDirect(args, env) {
    return emitMatchStatementMacro(args, {
      env,
      expandValue: (form, scope) => expandSingle(form, scope, "Value", "match expression"),
      expandHeader: (form, scope) => expandDirectValuePlan(form, scope),
      expandBody: (forms, scope) => expandChildrenSeq(forms, scope, "DirectStatement"),
      reserveNames: emittedNames
    });
  }
  function directBlock(statements) {
    const block = markKernel(array(sym("block"), ...statements));
    directResultBlocks.add(block);
    return block;
  }
  function isDirectTransfer(node) {
    const h = node?.type === "list" && node.values.length ? formHead(node.values[0]) : null;
    return ["return", "throw", "break", "continue"].includes(h);
  }
  function isExpandedStatement(node) {
    if (node && typeof node === "object" && returnOperandValues.has(node)) return false;
    const h = node?.type === "list" && node.values.length ? formHead(node.values[0]) : null;
    if (h === null) return false;
    if (h === "for-await-of") return true;
    return isStatementOnlyForm(node);
  }
  function directResultStatements(result, use = "ReturnOperand") {
    if (Array.isArray(result)) {
      const statements = [...result];
      if (statements.length === 0 || !isDirectTransfer(statements[statements.length - 1])) {
        statements.push(resultNoValueStatement(use));
      }
      return statements;
    }
    if (result && typeof result === "object" && directResultBlocks.has(result)) {
      return [result];
    }
    if (result && typeof result === "object" && returnOperandValues.has(result)) {
      return [resultValueStatement(use, result)];
    }
    if (isDirectTransfer(result)) return [result];
    if (isExpandedStatement(result)) return [result, resultNoValueStatement(use)];
    return [resultValueStatement(use, result)];
  }
  function expandResultClause(forms, env, use) {
    if (forms.length === 0) return [resultNoValueStatement(use)];
    const { prefix, tail } = expandChildrenTail(forms, env, "DirectStatement", use);
    return [...prefix, ...directResultStatements(tail, use)];
  }
  function emitSurfaceMatchResult(args, env, use) {
    const result = emitMatchStatementMacro(args, {
      env,
      expandValue: (form, scope) => expandSingle(form, scope, "Value", "match expression"),
      expandHeader: (form, scope) => expandDirectValuePlan(form, scope),
      expandBody: (forms, scope) => expandResultClause(forms, scope, use),
      reserveNames: emittedNames
    });
    directResultBlocks.add(result);
    return result;
  }
  function isDirectResultRegion(result) {
    return Array.isArray(result) || directResultBlocks.has(result) || isDirectTransfer(result) || isExpandedStatement(result);
  }
  function directValuePlanFromResult(result, identity, use) {
    if (!isDirectResultRegion(result)) return { prefix: [], value: result };
    const destination = completionValueAtom(identity);
    const statements = directResultStatements(result, use);
    const body = statements.length === 1 && directResultBlocks.has(statements[0]) ? statements[0] : directBlock(statements);
    return {
      prefix: [array(sym("let"), destination), body],
      value: destination
    };
  }
  function expandDirectValuePlan(form, env) {
    const identity = {};
    const use = { kind: "Assign", identity };
    return directValuePlanFromResult(expandAt(form, env, use), identity, use);
  }
  function expandDirectSpreadArgument(form, env, directCallArgumentRequest) {
    if (form.values.length !== 2) {
      throw new Error("spread takes exactly one argument");
    }
    const operand = expandDirectValuePlan(form.values[1], env);
    const ordinaryValue = markKernel({ ...form, values: [form.values[0], operand.value] });
    directCallArgumentRequest.result = {
      kind: "spread",
      prefix: operand.prefix,
      value: operand.value,
      ordinaryValue
    };
    directCallArgumentRequest.handled = true;
    return ordinaryValue;
  }
  function expandDirectCallArgument(form, env) {
    const identity = {};
    const use = { kind: "Assign", identity };
    const request = { handled: false, result: null };
    const result = expandAt(form, env, use, null, request);
    if (request.handled) return request.result;
    const plan = directValuePlanFromResult(result, identity, use);
    return { kind: "value", ...plan };
  }
  function directWriteNameIsAdmitted(name) {
    if (name.includes(":")) return false;
    return ![
      "Reflect",
      "globalThis",
      "eval",
      "super",
      "new",
      "this",
      "arguments"
    ].includes(toJsIdentifier(name));
  }
  function directWriteTargetParts(target, env, internalComputedTarget = false) {
    if (target?.type === "atom" && directWriteNameIsAdmitted(target.value) && (target.binding === "ref" || env.has(target.value))) {
      return { kind: "lexical", target };
    }
    if (internalComputedTarget) {
      const { receiver: receiver2, key: key2 } = internalComputedTarget;
      if (receiver2?.type !== "atom" || !directWriteNameIsAdmitted(receiver2.value) || !(receiver2.binding === "ref" || env.has(receiver2.value))) return null;
      return { kind: "computed", receiver: receiver2, key: key2, memberHead: sym("get") };
    }
    if (target?.type !== "list" || target.values.length !== 3) return null;
    const [getHead, receiver, key] = target.values;
    if (receiver?.type !== "atom" || !directWriteNameIsAdmitted(receiver.value) || !(receiver.binding === "ref" || env.has(receiver.value))) return null;
    if (getHead?.type !== "atom") return null;
    if (getHead.value === "kernel:get" && getHead.binding === void 0 && !isKernel(target) && KERNEL_FORMS.has("get")) {
      return { kind: "computed", receiver, key, memberHead: markKernel(sym("get")) };
    }
    if (formHead(getHead) !== "get" || isKernel(target) || env.has("get") || macroEnv.has("get")) return null;
    return { kind: "computed", receiver, key, memberHead: getHead };
  }
  function expandDirectAssignment(target, value, operator, env, use, internalComputedTarget = false) {
    const targetPlan = directWriteTargetParts(target, env, internalComputedTarget);
    if (!targetPlan) return null;
    if (operator === "+=" && (targetPlan.kind !== "computed" || targetPlan.key?.type !== "string")) return null;
    const statements = [];
    if (targetPlan.kind === "lexical") {
      const valuePlan2 = expandDirectValuePlan(value, env);
      const assignment2 = markKernel(array(sym(operator), targetPlan.target, valuePlan2.value));
      if (valuePlan2.prefix.length === 0) return assignment2;
      statements.push(...valuePlan2.prefix);
      statements.push(use === "DirectStatement" ? assignment2 : resultValueStatement(use, assignment2));
      return directBlock(statements);
    }
    const receiverPlan = expandDirectValuePlan(targetPlan.receiver, env);
    const keyPlan = expandDirectValuePlan(targetPlan.key, env);
    const valuePlan = expandDirectValuePlan(value, env);
    const lifted = receiverPlan.prefix.length > 0 || keyPlan.prefix.length > 0 || valuePlan.prefix.length > 0;
    const ordinaryTarget = markKernel(array(
      targetPlan.memberHead,
      receiverPlan.value,
      keyPlan.value
    ));
    if (!lifted) {
      return markKernel(array(sym(operator), ordinaryTarget, valuePlan.value));
    }
    statements.push(...receiverPlan.prefix);
    const receiver = completionValueAtom({});
    statements.push(array(sym("const"), receiver, preserveAnonymousName(receiverPlan.value)));
    statements.push(...keyPlan.prefix);
    let key;
    let oldValue = null;
    if (operator === "+=") {
      key = keyPlan.value;
      oldValue = completionValueAtom({});
      const oldGet = markKernel(array(sym("get"), receiver, key));
      statements.push(array(sym("const"), oldValue, preserveAnonymousName(oldGet)));
    } else {
      key = completionValueAtom({});
      statements.push(array(sym("const"), key, preserveAnonymousName(keyPlan.value)));
    }
    statements.push(...valuePlan.prefix);
    const writeTarget = markKernel(array(sym("get"), receiver, key));
    const rightHandSide = oldValue === null ? valuePlan.value : array(sym("+"), oldValue, valuePlan.value);
    const assignment = markKernel(array(sym("="), writeTarget, rightHandSide));
    statements.push(use === "DirectStatement" ? assignment : resultValueStatement(use, assignment));
    return directBlock(statements);
  }
  function isDirectLexicalCallHead(head) {
    if (head?.type !== "atom" || head.binding !== "ref" || head.value.includes(":")) {
      return false;
    }
    return !["eval", "super", "new"].includes(toJsIdentifier(head.value));
  }
  function callArgumentValue(plan) {
    return plan.kind === "spread" ? plan.ordinaryValue : plan.value;
  }
  function appendMaterializedArgument(statements, argv, cursor, value) {
    statements.push(markKernel(array(
      sym("="),
      markKernel(array(sym("get"), argv, cursor)),
      value
    )));
    statements.push(markKernel(array(
      sym("="),
      cursor,
      markKernel(array(sym("+"), cursor, { type: "number", value: 1 }))
    )));
    statements.push(markKernel(array(
      sym("="),
      markKernel(array(sym("get"), argv, { type: "string", value: "length" })),
      cursor
    )));
  }
  function materializeSpreadArguments(argumentsPlan) {
    const argv = completionValueAtom({});
    const cursor = completionValueAtom({});
    const object = markKernel(array(
      sym("object"),
      array({ type: "string", value: "__proto__" }, sym("null")),
      array(sym("length"), { type: "number", value: 0 })
    ));
    const statements = [
      array(sym("const"), argv, object),
      array(sym("let"), cursor, { type: "number", value: 0 })
    ];
    for (const argument of argumentsPlan) {
      statements.push(...argument.prefix);
      if (argument.kind === "spread") {
        const item = completionValueAtom({});
        const body = [];
        appendMaterializedArgument(body, argv, cursor, item);
        statements.push(markKernel(array(sym("for-of"), item, argument.value, ...body)));
      } else {
        appendMaterializedArgument(statements, argv, cursor, argument.value);
      }
    }
    return { statements, argv };
  }
  function planDirectCallArguments(plans, forceLift = false) {
    let lastPrefix = -1;
    for (let index = 0; index < plans.length; index++) {
      if (plans[index].prefix.length > 0) lastPrefix = index;
    }
    const hasSpread = plans.some((plan) => plan.kind === "spread");
    if (lastPrefix < 0) {
      const values2 = plans.map(callArgumentValue);
      if (hasSpread && forceLift) return { kind: "reference-only", values: values2 };
      return forceLift ? { kind: "lifted", prefix: [], values: values2 } : { kind: "unlifted", values: values2 };
    }
    if (hasSpread) return { kind: "lifted-spread", arguments: plans };
    const prefix = [];
    const values = [];
    for (let index = 0; index < plans.length; index++) {
      const { prefix: argumentPrefix, value } = plans[index];
      if (index > lastPrefix) {
        values.push(value);
      } else if (argumentPrefix.length === 0) {
        const saved = completionValueAtom({});
        prefix.push(array(sym("const"), saved, preserveAnonymousName(value)));
        values.push(saved);
      } else {
        prefix.push(...argumentPrefix);
        values.push(value);
      }
    }
    return { kind: "lifted", prefix, values };
  }
  function directMemberCallParts(head) {
    if (head?.type !== "atom" || head.value.startsWith("js:") || head.value.startsWith("kernel:")) {
      return null;
    }
    const separator = head.value.indexOf(":");
    if (separator <= 0 || separator !== head.value.lastIndexOf(":")) return null;
    const base = head.value.slice(0, separator);
    const property = head.value.slice(separator + 1);
    const normalizedBase = toJsIdentifier(base);
    const isOrdinaryIdentifier = (value) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
    if (!property || ["js", "kernel"].includes(base) || normalizedBase === "this" || normalizedBase === "super" || property.startsWith("-") || /^\d/.test(property) || !isOrdinaryIdentifier(normalizedBase) || !isOrdinaryIdentifier(toJsIdentifier(property))) {
      return null;
    }
    return { base, property };
  }
  function expandDirectMemberCall(form, env, use, memberParts) {
    const { base, property } = memberParts;
    const plans = form.values.slice(1).map((argument) => expandDirectCallArgument(argument, env));
    const argumentPlan = planDirectCallArguments(plans);
    if (argumentPlan.kind === "unlifted") {
      return { type: "list", values: [form.values[0], ...argumentPlan.values] };
    }
    return expandSavedMemberInvocation(
      [],
      sym(base),
      [],
      { type: "string", value: toJsIdentifier(property) },
      argumentPlan,
      use
    );
  }
  function expandSavedMemberInvocation(receiverPrefix, receiverValue, keyPrefix, keyValue, argumentPlan, use, sanctionedGet = false) {
    const receiver = completionValueAtom({});
    const callee = completionValueAtom({});
    const getCall = array(sym("get"), receiver, keyValue);
    if (sanctionedGet) markKernel(getCall);
    const statements = [
      ...receiverPrefix,
      array(sym("const"), receiver, preserveAnonymousName(receiverValue)),
      ...keyPrefix,
      array(sym("const"), callee, getCall)
    ];
    let actualArgv;
    if (argumentPlan.kind === "lifted-spread") {
      const materialized = materializeSpreadArguments(argumentPlan.arguments);
      statements.push(...materialized.statements);
      actualArgv = materialized.argv;
    } else {
      actualArgv = completionValueAtom({});
      statements.push(...argumentPlan.prefix);
      statements.push(array(sym("const"), actualArgv, array(sym("array"), ...argumentPlan.values)));
    }
    const invocation = markExpandedHostCall(array(callee, receiver, actualArgv));
    statements.push(use === "DirectStatement" ? invocation : resultValueStatement(use, invocation));
    return directBlock(statements);
  }
  function directComputedMemberCallParts(head, env) {
    if (head?.type !== "list" || head.values.length !== 3) return null;
    if (head.values[1]?.type === "atom" && toJsIdentifier(head.values[1].value) === "super") return null;
    const getHead = head.values[0];
    if (getHead?.type !== "atom") return null;
    if (getHead.value === "kernel:get" && getHead.binding === void 0 && !isKernel(head)) {
      return { explicitEscape: true };
    }
    if (getHead.value !== "get" || getHead.binding !== void 0 || env.has("get") || macroEnv.has("get") || isKernel(head)) return null;
    return { explicitEscape: false };
  }
  function expandDirectComputedMemberCall(form, request, env) {
    const getForm = form;
    const receiver = expandDirectValuePlan(getForm.values[1], env);
    const key = expandDirectValuePlan(getForm.values[2], env);
    const argumentPlans = request.args.map((argument) => expandDirectCallArgument(argument, env));
    const referenceLifted = receiver.prefix.length > 0 || key.prefix.length > 0;
    const argumentPlan = planDirectCallArguments(argumentPlans, referenceLifted);
    if (!referenceLifted && argumentPlan.kind === "unlifted") {
      const member = { ...getForm, values: [getForm.values[0], receiver.value, key.value] };
      if (isKernel(getForm)) markKernel(member);
      request.result = { ...request.outerForm, values: [member, ...argumentPlan.values] };
      request.handled = true;
      return request.result;
    }
    if (argumentPlan.kind === "reference-only") {
      const savedReceiver = completionValueAtom({});
      const statements = [
        ...receiver.prefix,
        array(sym("const"), savedReceiver, preserveAnonymousName(receiver.value)),
        ...key.prefix
      ];
      const member = array(sym("get"), savedReceiver, key.value);
      if (isKernel(getForm)) markKernel(member);
      const call = array(member, ...argumentPlan.values);
      statements.push(request.use === "DirectStatement" ? call : resultValueStatement(request.use, call));
      request.result = directBlock(statements);
      request.handled = true;
      return request.result;
    }
    request.result = expandSavedMemberInvocation(
      receiver.prefix,
      receiver.value,
      key.prefix,
      key.value,
      argumentPlan,
      request.use,
      isKernel(getForm)
    );
    request.handled = true;
    return request.result;
  }
  function expandDirectLexicalCall(form, env, use) {
    const [head, ...args] = form.values;
    const plans = args.map((argument) => expandDirectCallArgument(argument, env));
    const argumentPlan = planDirectCallArguments(plans);
    if (argumentPlan.kind === "unlifted") {
      return { type: "list", values: [head, ...argumentPlan.values] };
    }
    if (argumentPlan.kind === "lifted-spread") {
      const callee2 = completionValueAtom({});
      const receiver = completionValueAtom({});
      const statements2 = [
        array(sym("const"), callee2, head),
        array(sym("const"), receiver, array(sym("void"), { type: "number", value: 0 }))
      ];
      const materialized = materializeSpreadArguments(argumentPlan.arguments);
      statements2.push(...materialized.statements);
      const invocation = markExpandedHostCall(array(callee2, receiver, materialized.argv));
      statements2.push(use === "DirectStatement" ? invocation : resultValueStatement(use, invocation));
      return directBlock(statements2);
    }
    const callee = completionValueAtom({});
    const statements = [array(sym("const"), callee, head), ...argumentPlan.prefix];
    const call = array(callee, ...argumentPlan.values);
    statements.push(use === "DirectStatement" ? call : resultValueStatement(use, call));
    return directBlock(statements);
  }
  function logicalBranchCondition(operator, value) {
    if (operator === "&&") return value;
    if (operator === "||") return array(sym("!"), value);
    return array(
      sym("||"),
      array(sym("==="), value, sym("null")),
      array(sym("==="), value, array(sym("void"), { type: "number", value: 0 }))
    );
  }
  function expandLogicalResultOperand(operands, operator, env, use, preserveVariadic = false) {
    const identity = {};
    const logicalUse = { kind: "Assign", identity };
    const plans = operands.map((operand) => expandAt(operand, env, logicalUse));
    const isValue = (plan) => !isDirectResultRegion(plan);
    if (plans.every(isValue)) {
      if (preserveVariadic) return markKernel(array(sym(operator), ...plans));
      let result = plans[0];
      for (const plan of plans.slice(1)) result = array(sym(operator), result, plan);
      return markKernel(result);
    }
    const destination = completionValueAtom(identity);
    const statements = [array(sym("let"), destination)];
    for (let index = 0; index < plans.length; index++) {
      const plan = plans[index];
      const branch = directResultStatements(plan, logicalUse);
      if (index === 0) {
        statements.push(branch.length === 1 && directResultBlocks.has(branch[0]) ? branch[0] : directBlock(branch));
        continue;
      }
      statements.push(array(
        sym("if"),
        logicalBranchCondition(operator, destination),
        array(sym("block"), ...branch)
      ));
    }
    statements.push(resultValueStatement(use, destination));
    return directBlock(statements);
  }
  function expandResultOperand(form, env, use) {
    const h = formHead(form.values[0]);
    if (h === "if") {
      if (form.values.length < 4) {
        const value2 = expandAt(form, env, "Value");
        if (value2 && typeof value2 === "object" && !Array.isArray(value2)) returnOperandValues.add(value2);
        return value2;
      }
      const { prefix: conditionPrefix, value: condition } = expandDirectValuePlan(form.values[1], env);
      const consequent = expandAt(form.values[2], env, use);
      const alternate = expandAt(form.values[3], env, use);
      const isValue = (result) => !Array.isArray(result) && !directResultBlocks.has(result) && !isDirectTransfer(result) && !isExpandedStatement(result);
      if (isValue(consequent) && isValue(alternate) && conditionPrefix.length === 0) {
        const value2 = { ...form, values: [form.values[0], condition, consequent, alternate] };
        returnOperandValues.add(value2);
        return value2;
      }
      const branch = (result) => array(sym("block"), ...directResultStatements(result, use));
      const conditional = array(sym("if"), condition, branch(consequent), branch(alternate));
      return directBlock([...conditionPrefix, conditional]);
    }
    if (h === "do") {
      const { prefix, tail } = expandChildrenTail(form.values.slice(1), env, "DirectStatement", use);
      if (tail === null) prefix.push(resultNoValueStatement(use));
      else prefix.push(...directResultStatements(tail, use));
      return directBlock(prefix);
    }
    const value = expandAt(form, env, "Value");
    if (isExpandedStatement(value)) return directBlock(directResultStatements(value, use));
    return value;
  }
  function simpleDirectBind(args) {
    let nameNode;
    let valueNode;
    if (args.length === 2) [nameNode, valueNode] = args;
    else if (args.length === 3 && args[0]?.type === "keyword" && args[0].value === "any") {
      [, nameNode, valueNode] = args;
    } else return null;
    if (nameNode?.type !== "atom" || nameNode.value === "_" || nameNode.value.includes(":")) return null;
    return { nameNode, valueNode };
  }
  function expandDirectBind(args, env) {
    const { nameNode, valueNode } = simpleDirectBind(args);
    const kernel = emitSurfaceForm({ type: "Bind", args }, { sym, array, gensym, isKeyword });
    const identity = {};
    const use = { kind: "Assign", identity };
    const value = expandAt(valueNode, env, use);
    const isRegion = Array.isArray(value) || directResultBlocks.has(value) || isDirectTransfer(value) || isExpandedStatement(value);
    if (!isRegion) {
      kernel.values[2] = value;
      return markKernel(kernel);
    }
    return [
      markKernel(array(sym("let"), completionValueAtom(identity))),
      directBlock(directResultStatements(value, use)),
      markKernel(array(sym("const"), nameNode, completionValueAtom(identity)))
    ];
  }
  function expandExpr(form, env = EMPTY_ENV) {
    return expandAt(form, env, "Legacy");
  }
  function expandAt(form, env, use, computedMemberCallRequest = null, directCallArgumentRequest = null) {
    const sanctioned2 = isKernel(form);
    const result = expandExprInner(
      form,
      env,
      use,
      computedMemberCallRequest,
      directCallArgumentRequest
    );
    if (computedMemberCallRequest?.handled) return computedMemberCallRequest.result;
    if (directCallArgumentRequest?.handled) return directCallArgumentRequest.result;
    if (sanctioned2) {
      if (Array.isArray(result)) {
        for (const r of result) markKernel(r);
      } else {
        markKernel(result);
      }
    }
    return result;
  }
  function expandExprInner(form, env, use = "Legacy", computedMemberCallRequest = null, directCallArgumentRequest = null) {
    if (form === null || form === void 0) return form;
    if (form.type === "atom" || form.type === "number" || form.type === "string" || form.type === "keyword") {
      return form;
    }
    if (form.type === "cons") {
      return { type: "cons", car: expandAt(form.car, env, "Legacy"), cdr: expandAt(form.cdr, env, "Legacy") };
    }
    if (form.type !== "list") {
      throw new Error(`expandExpr: unexpected node type '${form.type}'`);
    }
    if (form.values.length === 0) return form;
    const head = form.values[0];
    const boundOrTaggedMatch = head.type === "atom" && head.value === "match" && (head.binding !== void 0 || env.has("match"));
    if (!boundOrTaggedMatch) tagDefSites(form);
    if (head.type === "atom" && head.value === "quasiquote") {
      if (form.values.length !== 2) throw new Error("quasiquote requires exactly one argument");
      const expanded = expandQuasiquote(form.values[1], 0);
      return expandAt(expanded, env, "Legacy");
    }
    if (head.type === "atom" && head.value === "unquote") {
      throw new Error("unquote outside of quasiquote");
    }
    if (head.type === "atom" && head.value === "unquote-splicing") {
      throw new Error("unquote-splicing outside of quasiquote");
    }
    if (head.type === "atom" && head.value.startsWith("kernel:") && !isKernel(form)) {
      const kernelForm = head.value.slice("kernel:".length);
      if (!KERNEL_FORMS.has(kernelForm)) {
        const hint = closestKernelForm(kernelForm);
        throw new Error(
          `unknown kernel form '${kernelForm}' in (kernel:${kernelForm} ...)` + (hint ? `; did you mean '${hint}'?` : "")
        );
      }
      const stripped = markKernel({
        type: "list",
        values: [{ type: "atom", value: kernelForm }, ...form.values.slice(1)]
      });
      if (kernelForm === "spread" && directCallArgumentRequest) {
        return expandDirectSpreadArgument(stripped, env, directCallArgumentRequest);
      }
      if ((kernelForm === "=" || kernelForm === "+=") && (use === "DirectStatement" || isResultOperandUse(use)) && stripped.values.length === 3) {
        const assignment = expandDirectAssignment(
          stripped.values[1],
          stripped.values[2],
          kernelForm,
          env,
          use
        );
        if (assignment !== null) return assignment;
      }
      if (computedMemberCallRequest) {
        computedMemberCallRequest.explicitEscape = true;
      }
      return expandAt(stripped, env, use, computedMemberCallRequest, directCallArgumentRequest);
    }
    if (head.type === "atom" && !isKernel(form) && (head.binding === "ref" || env.has(head.value))) {
      head.binding = "ref";
      if (isDirectLexicalCallHead(head) && (use === "DirectStatement" || isResultOperandUse(use))) {
        return expandDirectLexicalCall(form, env, use);
      }
      const values = [head];
      for (const sub of form.values.slice(1)) {
        pushExpanded(values, expandAt(sub, env, use === "Legacy" || use === "Protected" ? use : "Value"));
      }
      return { type: "list", values };
    }
    const surfaceHead = formHead(head);
    if (surfaceHead !== null && !isKernel(form)) {
      const astNode = classifySurfaceForm(surfaceHead, form.values.slice(1));
      if (astNode) {
        const childEnv = FUNCTION_FAMILY.has(surfaceHead) ? extendBindingEnv(env, bodyScopeNames(form)) : env;
        if (isResultOperandUse(use) && (astNode.type === "And" || astNode.type === "Or")) {
          return expandLogicalResultOperand(
            astNode.args,
            astNode.type === "And" ? "&&" : "||",
            env,
            use
          );
        }
        if (astNode.type === "Match" && use === "Statement") {
          return emitSurfaceMatchStatement([astNode.expr, ...astNode.clauses], env);
        }
        if (astNode.type === "Match" && use === "DirectStatement") {
          return emitSurfaceMatchDirect([astNode.expr, ...astNode.clauses], env);
        }
        if (astNode.type === "Match" && use === "ReturnOperand") {
          return emitSurfaceMatchResult([astNode.expr, ...astNode.clauses], env, use);
        }
        if (astNode.type === "Match" && isAssignResultUse(use)) {
          return emitSurfaceMatchResult([astNode.expr, ...astNode.clauses], env, use);
        }
        if (astNode.type === "Bind" && use === "DirectStatement" && simpleDirectBind(astNode.args)) {
          return expandDirectBind(astNode.args, env);
        }
        if (astNode.type === "BindGroup") {
          const out = [];
          let cur = env;
          for (const binding of astNode.bindings) {
            const args = binding.typeKw ? [binding.typeKw, binding.nameNode, binding.valueNode] : [binding.nameNode, binding.valueNode];
            if (use === "DirectStatement" && simpleDirectBind(args)) {
              pushExpanded(out, expandDirectBind(args, cur));
              const names2 = bindingNamesInPattern(binding.nameNode).map((site) => site.name);
              if (names2.length) cur = extendBindingEnv(cur, names2);
              continue;
            }
            const kernel2 = emitSurfaceForm(
              { type: "Bind", args },
              { sym, array, gensym, isKeyword }
            );
            pushExpanded(out, expandAt(markKernel(kernel2), cur, "Legacy"));
            const names = bindingNamesInPattern(binding.nameNode).map((site) => site.name);
            if (names.length) cur = extendBindingEnv(cur, names);
          }
          return out;
        }
        if (astNode.type === "SetSymbol" && (use === "DirectStatement" || isResultOperandUse(use))) {
          const assignment = expandDirectAssignment(
            null,
            astNode.value,
            "=",
            childEnv,
            use,
            { receiver: astNode.obj, key: astNode.key }
          );
          if (assignment !== null) return assignment;
        }
        const kernel = emitSurfaceForm(astNode, { sym, array, gensym, isKeyword });
        const kernelUse = use === "Protected" ? "Protected" : use === "Legacy" ? "Legacy" : FUNCTION_FAMILY.has(surfaceHead) ? astNode.type === "Func" ? isDirectReturnFunc(astNode) ? "DirectEntry" : funcBodyProtectsStatementExit(astNode) ? "Protected" : "Statement" : "Statement" : "Legacy";
        if (Array.isArray(kernel)) {
          return kernel.map((k) => expandAt(markKernel(k), childEnv, kernelUse));
        }
        return expandAt(markKernel(kernel), childEnv, kernelUse);
      }
    }
    if (head.type === "atom" && macroEnv.has(head.value) && !isKernel(form)) {
      let current = form;
      let count = 0;
      while (current.type === "list" && current.values.length > 0 && current.values[0].type === "atom" && macroEnv.has(current.values[0].value) && !isKernel(current)) {
        const macroName = current.values[0].value;
        const macroArgs = current.values.slice(1);
        try {
          current = macroEnv.get(macroName)(...macroArgs);
        } catch (err) {
          throw new Error(`error expanding macro '${macroName}': ${err.message}`, { cause: err });
        }
        if (++count > MAX_EXPAND_ITERATIONS) {
          throw new Error(`expansion limit (${MAX_EXPAND_ITERATIONS}) exceeded expanding '${form.values[0].value}'`);
        }
      }
      if (Array.isArray(current)) {
        return current.map((r) => expandAt(r, env, use));
      }
      return expandAt(current, env, use, null, directCallArgumentRequest);
    }
    if (directCallArgumentRequest && formHead(head) === "spread") {
      return expandDirectSpreadArgument(form, env, directCallArgumentRequest);
    }
    if (computedMemberCallRequest && formHead(head) === "get" && form.values.length === 3 && head?.type === "atom" && head.binding !== "ref" && (!isKernel(form) || computedMemberCallRequest.explicitEscape)) {
      return expandDirectComputedMemberCall(form, computedMemberCallRequest, env);
    }
    if (use === "DirectStatement" && formHead(head) === "if" && form.values.length >= 2) {
      const conditionPlan = expandDirectValuePlan(form.values[1], env);
      const branches = form.values.slice(2).map(
        (branch) => expandConditionalChild(branch, env, false, "DirectStatement")
      );
      const conditional = markKernel({
        type: "list",
        values: [head, conditionPlan.value, ...branches]
      });
      return conditionPlan.prefix.length ? directBlock([...conditionPlan.prefix, conditional]) : conditional;
    }
    if (isResultOperandUse(use) && ["&&", "||", "??"].includes(formHead(head)) && form.values.length >= 3) {
      const operator = formHead(head);
      return expandLogicalResultOperand(form.values.slice(1), operator, env, use, true);
    }
    if ((use === "DirectStatement" || isResultOperandUse(use)) && formHead(head) === "return" && form.values.length === 2) {
      const value = expandAt(form.values[1], env, "ReturnOperand");
      if (directResultBlocks.has(value)) return value;
      if (Array.isArray(value) || isDirectTransfer(value) || isExpandedStatement(value)) {
        return directBlock(directResultStatements(value, "ReturnOperand"));
      }
      return { ...form, values: [head, value] };
    }
    if (isResultOperandUse(use) && (formHead(head) === "if" || formHead(head) === "do")) {
      return expandResultOperand(form, env, use);
    }
    if (head.type === "atom") {
      const entry = dispatchTable[head.value];
      if (entry) {
        switch (entry.walk) {
          case "none":
            return form;
          case "register-macro":
            throw new Error("unexpected macro definition in expansion pass (macros should be processed in Pass 1)");
          case "desugar": {
            const args = form.values.slice(1);
            const result = entry.transform(args);
            if (Array.isArray(result)) {
              return result.map((r) => expandAt(r, env, use));
            }
            return expandAt(result, env, use);
          }
          case "expand-binding": {
            const args = form.values.slice(1);
            if (args[0]?.type === "list" && args[0].values.length >= 1 && args[0].values[0]?.type === "atom" && args[0].values[0]?.value === "as") {
              const asArgs = args[0].values.slice(1);
              if (asArgs.length === 2 && asArgs[0].type === "list") {
                const pattern = asArgs[0];
                const whole = asArgs[1];
                const initExpr = args[1];
                return [
                  expandExpr(array(sym(entry.keyword), whole, initExpr), env),
                  expandExpr(array(sym(entry.keyword), pattern, whole), env)
                ];
              }
            }
            return { type: "list", values: form.values.map((sub) => expandExpr(sub, env)) };
          }
          case "import-macros":
            throw new Error("import-macros not yet implemented (Phase 5)");
          case "debug-expand": {
            const debugArgs = form.values.slice(1);
            if (debugArgs.length !== 1) {
              throw new Error(`${head.value} requires exactly one argument (quoted form)`);
            }
            let targetForm = debugArgs[0];
            if (targetForm.type === "list" && targetForm.values.length === 2 && targetForm.values[0].type === "atom" && targetForm.values[0].value === "quote") {
              targetForm = targetForm.values[1];
            }
            let result;
            if (entry.mode === "once") {
              if (targetForm.type === "list" && targetForm.values.length > 0 && targetForm.values[0].type === "atom" && macroEnv.has(targetForm.values[0].value)) {
                const macroName = targetForm.values[0].value;
                const macroArgs = targetForm.values.slice(1);
                result = macroEnv.get(macroName)(...macroArgs);
              } else {
                result = targetForm;
              }
            } else {
              result = expandExpr(targetForm, env);
            }
            console.error(formatSExpr(result));
            return null;
          }
          default:
            throw new Error(`unknown dispatch walk strategy: '${entry.walk}'`);
        }
      }
    }
    const computedMemberParts = !isKernel(form) && (use === "DirectStatement" || isResultOperandUse(use)) ? directComputedMemberCallParts(head, env) : null;
    if (computedMemberParts) {
      const request = {
        outerForm: form,
        args: form.values.slice(1),
        use,
        explicitEscape: computedMemberParts.explicitEscape,
        handled: false,
        result: null
      };
      expandAt(head, env, "Legacy", request);
      if (!request.handled) {
        throw new Error("computed member call request was not consumed");
      }
      return request.result;
    }
    const memberParts = !isKernel(form) && (use === "DirectStatement" || isResultOperandUse(use)) ? directMemberCallParts(head) : null;
    if (memberParts) return expandDirectMemberCall(form, env, use, memberParts);
    return { type: "list", values: expandChildrenPlan(form, env, use) };
  }
  function pass1RegisterMacros(forms) {
    const macroForms = [];
    const otherForms = [];
    for (const form of forms) {
      if (form.type === "list" && form.values.length >= 3 && form.values[0].type === "atom" && form.values[0].value === "macro") {
        macroForms.push(form);
      } else {
        otherForms.push(form);
      }
    }
    if (macroForms.length === 0) return otherForms;
    let pending = [...macroForms];
    const maxPasses = pending.length;
    let passCount = 0;
    while (pending.length > 0) {
      passCount++;
      if (passCount > maxPasses) {
        const names = pending.map((f) => f.values[1].value).join(", ");
        throw new Error(`circular macro dependency among: ${names}`);
      }
      let progress = false;
      const stillPending = [];
      for (const form of pending) {
        const name = form.values[1];
        const params = form.values[2];
        const body = form.values.slice(3);
        const pendingNames = new Set(pending.map((f) => f.values[1].value));
        pendingNames.delete(name.value);
        const deps = findSymbolRefs(body, pendingNames);
        if (deps.size === 0) {
          registerMacroForm(name, params, body);
          progress = true;
        } else {
          stillPending.push(form);
        }
      }
      pending = stillPending;
      if (!progress && pending.length > 0) {
        const names = pending.map((f) => f.values[1].value).join(", ");
        throw new Error(`circular macro dependency among: ${names}`);
      }
    }
    return otherForms;
  }
  function findSymbolRefs(forms, names) {
    const found = /* @__PURE__ */ new Set();
    function walk2(node) {
      if (node === null || node === void 0) return;
      if (node.type === "atom" && names.has(node.value)) {
        found.add(node.value);
      } else if (node.type === "list") {
        for (const child of node.values) walk2(child);
      } else if (node.type === "cons") {
        walk2(node.car);
        walk2(node.cdr);
      }
    }
    for (const form of forms) walk2(form);
    return found;
  }
  function pass2ExpandAll(forms) {
    const result = [];
    const completionValueAtomsAtStart = completionValueAtomCount;
    let env = EMPTY_ENV;
    for (const form of forms) {
      const expanded = expandAt(form, env, "Statement");
      if (expanded !== null && expanded !== void 0) {
        if (Array.isArray(expanded)) {
          result.push(...expanded.filter((e) => e !== null && e !== void 0));
        } else {
          result.push(expanded);
        }
      }
      const hoist = form?.type === "list" ? hoistedNames(form) : [];
      if (hoist.length) env = extendBindingEnv(env, hoist);
    }
    if (completionValueAtomCount !== completionValueAtomsAtStart) {
      finalizeCompletionValueMarkers(result);
    }
    return result;
  }
  function enforceStrictTopLevel(forms) {
    for (const form of forms) {
      if (form && form.type === "list" && form.values.length > 0) {
        const head = form.values[0];
        if (head && head.type === "atom" && KERNEL_ONLY_FORMS.has(head.value) && !isKernel(form)) {
          throw new Error(kernelOnlyMessage(head.value));
        }
      }
    }
  }
  function expandWithMacroImports(forms, context = {}, processImports) {
    if (!macroEnv.has("js:eq")) {
      registerSurfaceMacros(macroEnv);
    }
    const { filePath = null, compilationStack = [], strict = true } = context;
    validateReservedNames(forms);
    const afterPass0 = processImports(forms, { filePath, compilationStack });
    const afterPass1 = pass1RegisterMacros(afterPass0);
    const expanded = pass2ExpandAll(afterPass1);
    if (strict) {
      enforceStrictTopLevel(expanded);
    }
    materializeExpandedHostCalls(expanded, {
      toJsIdentifier,
      formHead,
      moduleBindsReflect,
      validateProtectedHost
    });
    return expanded;
  }

  // packages/lang/macro-import-form.js
  function parseMacroImport(form) {
    if (form.type !== "list" || form.values.length < 1 || form.values[0].type !== "atom" || form.values[0].value !== "import-macros") {
      return null;
    }
    const args = form.values.slice(1);
    if (args.length < 2) {
      throw new Error("import-macros requires a path and binding list");
    }
    if (args[0].type !== "string") {
      throw new Error("import-macros: first argument must be a module path string");
    }
    if (args[1].type !== "list") {
      throw new Error("import-macros requires a binding list");
    }
    return { modulePath: args[0].value, bindings: args[1].values };
  }

  // packages/lang/expander-browser.js
  function pass0BrowserImports(forms) {
    const remaining = [];
    for (const form of forms) {
      const parsed = parseMacroImport(form);
      if (!parsed) {
        remaining.push(form);
        continue;
      }
      const { modulePath } = parsed;
      if (modulePath.startsWith("file://")) {
        new URL(modulePath);
        throw new Error(`macro module not found: ${modulePath}`);
      }
      if (/^(jsr|npm|https?):/.test(modulePath)) {
        const cause = new TypeError("import_meta.resolve is not a function");
        throw new Error(`import-macros: could not resolve "${modulePath}": ${cause.message}`);
      }
      if (modulePath.startsWith("/")) {
        throw new Error(
          `import-macros: could not resolve "${modulePath}"
  tier 2 (project.json imports): no matching key
  tier 3 (filesystem): not a relative path
  hint: add an entry to project.json "imports" or use a scheme prefix (jsr:, npm:)`
        );
      }
      throw new Error("import-macros not available in browser");
    }
    return remaining;
  }
  function expand(forms, context = {}) {
    return expandWithMacroImports(forms, context, pass0BrowserImports);
  }

  // packages/browser/compiler.js
  function compileLykn(source, { strict = true } = {}) {
    return compile(expand(read(source), { strict }));
  }
  function run(source, { strict = true } = {}) {
    const js = compileLykn(source, { strict });
    return (0, eval)(js);
  }
  async function load(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[lykn] Failed to load ${url}: ${response.status}`);
    }
    const source = await response.text();
    return run(source, { strict: !url.endsWith(".lyk") });
  }

  // packages/browser/scripts.js
  async function processScripts() {
    const scripts = document.querySelectorAll('script[type="text/lykn"]');
    for (const el of scripts) {
      const label = el.src || "inline script";
      try {
        if (el.src) {
          await load(el.src);
        } else {
          run(el.textContent);
        }
      } catch (err) {
        console.error(`[lykn] Error in ${label}:`, err);
      }
    }
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", processScripts);
    } else {
      processScripts();
    }
  }
  return __toCommonJS(mod_exports);
})();
