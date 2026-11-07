export {walkProgram};
const ReferenceRole = { tag: "ReferenceRole" };
const BindingRole = { tag: "BindingRole" };
const NameRole = { tag: "NameRole" };
const DeferredRole = { tag: "DeferredRole" };
function own(value, key) {
  if (typeof key !== "string") throw new TypeError("own: arg 'key' expected string, got " + typeof key);

  const result__gensym0 = (!(value === null) && (typeof value === "object" || typeof value === "function")) && Object.hasOwn(value, key);
  if (typeof result__gensym0 !== "boolean") throw new TypeError("own: return value expected boolean, got " + typeof result__gensym0);

  return result__gensym0;
}
function child(value, key) {
  if (typeof key !== "string") throw new TypeError("child: arg 'key' expected string, got " + typeof key);

  return own(value, key) ? value[key] : null;
}
function pathField(path, field) {
  if (typeof path !== "string") throw new TypeError("pathField: arg 'path' expected string, got " + typeof path);

  if (typeof field !== "string") throw new TypeError("pathField: arg 'field' expected string, got " + typeof field);

  const result__gensym1 = `${path}.${field}`;
  if (typeof result__gensym1 !== "string") throw new TypeError("pathField: return value expected string, got " + typeof result__gensym1);

  return result__gensym1;
}
function pathIndex(path, index) {
  if (typeof path !== "string") throw new TypeError("pathIndex: arg 'path' expected string, got " + typeof path);

  if (typeof index !== "number" || Number.isNaN(index)) throw new TypeError("pathIndex: arg 'index' expected number, got " + typeof index);

  const result__gensym2 = `${path}[${index}]`;
  if (typeof result__gensym2 !== "string") throw new TypeError("pathIndex: return value expected string, got " + typeof result__gensym2);

  return result__gensym2;
}
function isAstNode(value) {
  const result__gensym3 = ((!(value === null) && typeof value === "object") && own(value, "type")) && typeof value["type"] === "string";
  if (typeof result__gensym3 !== "boolean") throw new TypeError("isAstNode (ast-node?): return value expected boolean, got " + typeof result__gensym3);

  return result__gensym3;
}
function unsupported(state, node, path) {
  if (typeof path !== "string") throw new TypeError("unsupported: arg 'path' expected string, got " + typeof path);

  {
    state["coverage"]["value"] = "unsupported_ast";
    state["errors"]["value"] = (errors => {
      if (!Array.isArray(errors)) throw new TypeError("anonymous: arg 'errors' expected array, got " + typeof errors);

      return [...errors, { status: "unsupported_ast", nodeType: own(node, "type") ? node["type"] : null, path: path, loc: own(node, "loc") && own(node["loc"], "start") ? node["loc"]["start"] : null, range: child(node, "range") }];
    })(state["errors"]["value"]);
  }
}
function addReason(state, node, path, category, rule) {
  if (typeof path !== "string") throw new TypeError("addReason: arg 'path' expected string, got " + typeof path);

  if (typeof category !== "string") throw new TypeError("addReason: arg 'category' expected string, got " + typeof category);

  if (typeof rule !== "string") throw new TypeError("addReason: arg 'rule' expected string, got " + typeof rule);

  state["reasons"]["value"] = (reasons => {
    if (!Array.isArray(reasons)) throw new TypeError("anonymous: arg 'reasons' expected array, got " + typeof reasons);

    return [...reasons, { nodeType: child(node, "type"), path: path, loc: own(node, "loc") && own(node["loc"], "start") ? node["loc"]["start"] : null, range: child(node, "range"), category: category, rule: rule, potential_load_evaluation: true, observed_effect: null }];
  })(state["reasons"]["value"]);
}
function addEdge(state, node, path, bare) {
  if (typeof path !== "string") throw new TypeError("addEdge: arg 'path' expected string, got " + typeof path);

  if (typeof bare !== "boolean") throw new TypeError("addEdge: arg 'bare' expected boolean, got " + typeof bare);

  {
    state["edges"]["value"] = (edges => {
      if (!Array.isArray(edges)) throw new TypeError("anonymous: arg 'edges' expected array, got " + typeof edges);

      return [...edges, { nodeType: child(node, "type"), path: path, source: own(node, "source") ? child(node["source"], "value") : null, bare_import: bare }];
    })(state["edges"]["value"]);
    if (bare) state["bare"]["value"] = (n => {
      if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

      return n + 1;
    })(state["bare"]["value"]);

  }
}
function isAstChildIn(value) {
  const result__gensym4 = isAstNode(value) ? true : Array.isArray(value) ? value.some(item => isAstNode(item)) : false;
  if (typeof result__gensym4 !== "boolean") throw new TypeError("isAstChildIn (ast-child-in?): return value expected boolean, got " + typeof result__gensym4);

  return result__gensym4;
}
function flagUnlisted(state, value, path) {
  if (typeof path !== "string") throw new TypeError("flagUnlisted: arg 'path' expected string, got " + typeof path);

  if (isAstNode(value)) unsupported(state, value, path);
   else if (Array.isArray(value)) for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    if (isAstNode(item)) unsupported(state, item, pathIndex(path, index));

  }


}
function checkUnlisted(state, node, path, allowed) {
  if (typeof path !== "string") throw new TypeError("checkUnlisted: arg 'path' expected string, got " + typeof path);

  if (!Array.isArray(allowed)) throw new TypeError("checkUnlisted: arg 'allowed' expected array, got " + typeof allowed);

  for (const entry of Object.entries(node)) {
    const key = entry[0];
    const value = entry[1];
    if (!allowed.includes(key) && isAstChildIn(value)) flagUnlisted(state, value, pathField(path, key));

  }
}
function checkAttributes(state, node, path) {
  if (typeof path !== "string") throw new TypeError("checkAttributes: arg 'path' expected string, got " + typeof path);

  for (const field of ["attributes", "assertions"]) {
    const value = child(node, field);
    if (!(value === null) && isAstChildIn(value)) flagUnlisted(state, value, pathField(path, field));

  }
}
function visitList(state, values, path, role) {
  if (typeof path !== "string") throw new TypeError("visitList: arg 'path' expected string, got " + typeof path);

  if (typeof role !== "object" || (role === null || !("tag" in role))) throw new TypeError("visitList: arg 'role' expected FieldRole, got " + typeof role);

  if (Array.isArray(values)) for (let index = 0; index < values.length; index += 1) {
    if (!(values[index] === null)) {
      const target__gensym5 = role;
      if (target__gensym5.tag === "BindingRole") {
        visitPattern(state, values[index], pathIndex(path, index));
      } else if (target__gensym5.tag === "ReferenceRole") {
        visitNode(state, values[index], pathIndex(path, index), role);
      } else if (target__gensym5.tag === "NameRole") {
        visitNode(state, values[index], pathIndex(path, index), role);
      } else if (target__gensym5.tag === "DeferredRole") {
        visitNode(state, values[index], pathIndex(path, index), role);
      } else {
        throw new Error("unsupported traversal role");
      }



    }
  }
   else if (!(values === null)) unsupported(state, values, path);


}
function visitOne(state, node, field, path, role) {
  if (typeof field !== "string") throw new TypeError("visitOne: arg 'field' expected string, got " + typeof field);

  if (typeof path !== "string") throw new TypeError("visitOne: arg 'path' expected string, got " + typeof path);

  if (typeof role !== "object" || (role === null || !("tag" in role))) throw new TypeError("visitOne: arg 'role' expected FieldRole, got " + typeof role);

  const value = child(node, field);
  if (!(value === null)) {
    const target__gensym6 = role;
    if (target__gensym6.tag === "BindingRole") {
      visitPattern(state, value, pathField(path, field));
    } else if (target__gensym6.tag === "ReferenceRole") {
      visitNode(state, value, pathField(path, field), role);
    } else if (target__gensym6.tag === "NameRole") {
      visitNode(state, value, pathField(path, field), role);
    } else if (target__gensym6.tag === "DeferredRole") {
      visitNode(state, value, pathField(path, field), role);
    } else {
      throw new Error("unsupported traversal role");
    }



  }
}
function visitPattern(state, node, path) {
  if (typeof path !== "string") throw new TypeError("visitPattern: arg 'path' expected string, got " + typeof path);

  if (node === null) null;
   else {
    const target__gensym7 = child(node, "type");
    if (target__gensym7 === "Identifier") {
      checkUnlisted(state, node, path, ["type", "name"]);
      null;
    } else if (target__gensym7 === "RestElement") {
      checkUnlisted(state, node, path, ["type", "argument"]);
      visitOne(state, node, "argument", path, BindingRole);
    } else if (target__gensym7 === "AssignmentPattern") {
      checkUnlisted(state, node, path, ["type", "left", "right"]);
      visitOne(state, node, "left", path, BindingRole);
      visitOne(state, node, "right", path, ReferenceRole);
    } else if (target__gensym7 === "ArrayPattern") {
      checkUnlisted(state, node, path, ["type", "elements"]);
      addReason(state, node, path, "destructuring", "array binding may acquire an iterator");
      visitList(state, child(node, "elements"), pathField(path, "elements"), BindingRole);
    } else if (target__gensym7 === "ObjectPattern") {
      checkUnlisted(state, node, path, ["type", "properties"]);
      addReason(state, node, path, "destructuring", "object binding may invoke getters");
      visitList(state, child(node, "properties"), pathField(path, "properties"), BindingRole);
    } else if (target__gensym7 === "Property") {
      checkUnlisted(state, node, path, ["type", "key", "value", "computed", "shorthand", "kind", "method"]);
      if (child(node, "computed")) {
        addReason(state, child(node, "key"), pathField(path, "key"), "computed_key_coercion", "ToPropertyKey may invoke user conversion");
        visitOne(state, node, "key", path, ReferenceRole);
      } else visitOne(state, node, "key", path, NameRole);

      visitPattern(state, child(node, "value"), pathField(path, "value"));
    } else {
      unsupported(state, node, path);
    }





  }
}
function visitNode(state, node, path, role) {
  if (typeof path !== "string") throw new TypeError("visitNode: arg 'path' expected string, got " + typeof path);

  if (typeof role !== "object" || (role === null || !("tag" in role))) throw new TypeError("visitNode: arg 'role' expected FieldRole, got " + typeof role);

  if (!isAstNode(node)) unsupported(state, node, path);
   else {
    const target__gensym8 = child(node, "type");
    if (target__gensym8 === "Identifier") {
      checkUnlisted(state, node, path, ["type", "name"]);
      {
        const target__gensym9 = role;
        if (target__gensym9.tag === "ReferenceRole") {
          addReason(state, node, path, "identifier_read", "name resolution is not established");
        } else if (target__gensym9.tag === "BindingRole") {
          null;
        } else if (target__gensym9.tag === "NameRole") {
          null;
        } else if (target__gensym9.tag === "DeferredRole") {
          null;
        } else {
          throw new Error("match: no matching pattern");
        }



      }
    } else if (target__gensym8 === "Literal") {
      checkUnlisted(state, node, path, ["type", "value", "raw", "regex", "bigint"]);
      null;
    } else if (target__gensym8 === "ThisExpression") {
      checkUnlisted(state, node, path, ["type"]);
      null;
    } else if (target__gensym8 === "Super") {
      checkUnlisted(state, node, path, ["type"]);
      null;
    } else if (target__gensym8 === "MetaProperty") {
      checkUnlisted(state, node, path, ["type", "meta", "property"]);
      null;
    } else if (target__gensym8 === "TemplateElement") {
      checkUnlisted(state, node, path, ["type", "value", "tail"]);
      null;
    } else if (target__gensym8 === "Program") {
      checkUnlisted(state, node, path, ["type", "sourceType", "body", "directives"]);
      visitList(state, child(node, "body"), pathField(path, "body"), ReferenceRole);
    } else if (target__gensym8 === "BlockStatement") {
      checkUnlisted(state, node, path, ["type", "body", "directives"]);
      visitList(state, child(node, "body"), pathField(path, "body"), ReferenceRole);
    } else if (target__gensym8 === "ExpressionStatement") {
      checkUnlisted(state, node, path, ["type", "expression", "directive"]);
      visitOne(state, node, "expression", path, ReferenceRole);
    } else if (target__gensym8 === "EmptyStatement") {
      checkUnlisted(state, node, path, ["type"]);
      null;
    } else if (target__gensym8 === "DebuggerStatement") {
      checkUnlisted(state, node, path, ["type"]);
      null;
    } else if (target__gensym8 === "BreakStatement") {
      checkUnlisted(state, node, path, ["type", "label"]);
      null;
    } else if (target__gensym8 === "ContinueStatement") {
      checkUnlisted(state, node, path, ["type", "label"]);
      null;
    } else if (target__gensym8 === "LabeledStatement") {
      checkUnlisted(state, node, path, ["type", "label", "body"]);
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "IfStatement") {
      checkUnlisted(state, node, path, ["type", "test", "consequent", "alternate"]);
      visitOne(state, node, "test", path, ReferenceRole);
      visitOne(state, node, "consequent", path, ReferenceRole);
      visitOne(state, node, "alternate", path, ReferenceRole);
    } else if (target__gensym8 === "SwitchStatement") {
      checkUnlisted(state, node, path, ["type", "discriminant", "cases"]);
      visitOne(state, node, "discriminant", path, ReferenceRole);
      visitList(state, child(node, "cases"), pathField(path, "cases"), ReferenceRole);
    } else if (target__gensym8 === "SwitchCase") {
      checkUnlisted(state, node, path, ["type", "test", "consequent"]);
      visitOne(state, node, "test", path, ReferenceRole);
      visitList(state, child(node, "consequent"), pathField(path, "consequent"), ReferenceRole);
    } else if (target__gensym8 === "TryStatement") {
      checkUnlisted(state, node, path, ["type", "block", "handler", "finalizer"]);
      visitOne(state, node, "block", path, ReferenceRole);
      visitOne(state, node, "handler", path, ReferenceRole);
      visitOne(state, node, "finalizer", path, ReferenceRole);
    } else if (target__gensym8 === "CatchClause") {
      checkUnlisted(state, node, path, ["type", "param", "body"]);
      visitPattern(state, child(node, "param"), pathField(path, "param"));
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "ThrowStatement") {
      checkUnlisted(state, node, path, ["type", "argument"]);
      addReason(state, node, path, "throw", "throw may terminate module evaluation");
      visitOne(state, node, "argument", path, ReferenceRole);
    } else if (target__gensym8 === "WhileStatement") {
      checkUnlisted(state, node, path, ["type", "test", "body"]);
      visitOne(state, node, "test", path, ReferenceRole);
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "DoWhileStatement") {
      checkUnlisted(state, node, path, ["type", "body", "test"]);
      visitOne(state, node, "body", path, ReferenceRole);
      visitOne(state, node, "test", path, ReferenceRole);
    } else if (target__gensym8 === "ForStatement") {
      checkUnlisted(state, node, path, ["type", "init", "test", "update", "body"]);
      visitOne(state, node, "init", path, ReferenceRole);
      visitOne(state, node, "test", path, ReferenceRole);
      visitOne(state, node, "update", path, ReferenceRole);
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "ForInStatement") {
      checkUnlisted(state, node, path, ["type", "left", "right", "body", "await"]);
      if (child(child(node, "left"), "type") === "VariableDeclaration") visitOne(state, node, "left", path, ReferenceRole);
       else visitPattern(state, child(node, "left"), pathField(path, "left"));

      visitOne(state, node, "right", path, ReferenceRole);
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "ForOfStatement") {
      checkUnlisted(state, node, path, ["type", "left", "right", "body", "await"]);
      if (child(child(node, "left"), "type") === "VariableDeclaration") visitOne(state, node, "left", path, ReferenceRole);
       else visitPattern(state, child(node, "left"), pathField(path, "left"));

      addReason(state, node, path, "iteration", "iteration may acquire an iterator");
      visitOne(state, node, "right", path, ReferenceRole);
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "WithStatement") {
      checkUnlisted(state, node, path, ["type", "object", "body"]);
      unsupported(state, node, path);
    } else if (target__gensym8 === "VariableDeclaration") {
      checkUnlisted(state, node, path, ["type", "declarations", "kind"]);
      visitList(state, child(node, "declarations"), pathField(path, "declarations"), ReferenceRole);
    } else if (target__gensym8 === "VariableDeclarator") {
      checkUnlisted(state, node, path, ["type", "id", "init"]);
      visitPattern(state, child(node, "id"), pathField(path, "id"));
      visitOne(state, node, "init", path, ReferenceRole);
    } else if (target__gensym8 === "FunctionDeclaration") {
      checkUnlisted(state, node, path, ["type", "id", "params", "body", "generator", "async", "expression"]);
      null;
    } else if (target__gensym8 === "FunctionExpression") {
      checkUnlisted(state, node, path, ["type", "id", "params", "body", "generator", "async", "expression"]);
      null;
    } else if (target__gensym8 === "ArrowFunctionExpression") {
      checkUnlisted(state, node, path, ["type", "id", "params", "body", "generator", "async", "expression"]);
      null;
    } else if (target__gensym8 === "ClassDeclaration") {
      checkUnlisted(state, node, path, ["type", "id", "superClass", "body"]);
      if (!(child(node, "superClass") === null)) {
        addReason(state, child(node, "superClass"), pathField(path, "superClass"), "class_heritage_validation", "heritage validation may throw");
        visitOne(state, node, "superClass", path, ReferenceRole);
      }
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "ClassExpression") {
      checkUnlisted(state, node, path, ["type", "id", "superClass", "body"]);
      if (!(child(node, "superClass") === null)) {
        addReason(state, child(node, "superClass"), pathField(path, "superClass"), "class_heritage_validation", "heritage validation may throw");
        visitOne(state, node, "superClass", path, ReferenceRole);
      }
      visitOne(state, node, "body", path, ReferenceRole);
    } else if (target__gensym8 === "ClassBody") {
      checkUnlisted(state, node, path, ["type", "body"]);
      visitList(state, child(node, "body"), pathField(path, "body"), ReferenceRole);
    } else if (target__gensym8 === "MethodDefinition") {
      checkUnlisted(state, node, path, ["type", "key", "value", "kind", "computed", "static"]);
      if (child(node, "computed")) {
        addReason(state, child(node, "key"), pathField(path, "key"), "computed_key_coercion", "ToPropertyKey may invoke user conversion");
        visitOne(state, node, "key", path, ReferenceRole);
      } else visitOne(state, node, "key", path, NameRole);

      null;
    } else if (target__gensym8 === "PropertyDefinition") {
      checkUnlisted(state, node, path, ["type", "key", "value", "computed", "static"]);
      if (child(node, "computed")) {
        addReason(state, child(node, "key"), pathField(path, "key"), "computed_key_coercion", "ToPropertyKey may invoke user conversion");
        visitOne(state, node, "key", path, ReferenceRole);
      } else visitOne(state, node, "key", path, NameRole);

      if (child(node, "static")) visitOne(state, node, "value", path, ReferenceRole);

    } else if (target__gensym8 === "StaticBlock") {
      checkUnlisted(state, node, path, ["type", "body"]);
      visitList(state, child(node, "body"), pathField(path, "body"), ReferenceRole);
    } else if (target__gensym8 === "CallExpression") {
      checkUnlisted(state, node, path, ["type", "callee", "arguments", "optional"]);
      addReason(state, node, path, "call", "call may invoke user or host behavior");
      visitOne(state, node, "callee", path, ReferenceRole);
      visitList(state, child(node, "arguments"), pathField(path, "arguments"), ReferenceRole);
    } else if (target__gensym8 === "NewExpression") {
      checkUnlisted(state, node, path, ["type", "callee", "arguments"]);
      addReason(state, node, path, "construction", "construction may invoke user behavior");
      visitOne(state, node, "callee", path, ReferenceRole);
      visitList(state, child(node, "arguments"), pathField(path, "arguments"), ReferenceRole);
    } else if (target__gensym8 === "TaggedTemplateExpression") {
      checkUnlisted(state, node, path, ["type", "tag", "quasi"]);
      addReason(state, node, path, "tagged_template", "tag may execute during evaluation");
      visitOne(state, node, "tag", path, ReferenceRole);
      visitOne(state, node, "quasi", path, ReferenceRole);
    } else if (target__gensym8 === "AwaitExpression") {
      checkUnlisted(state, node, path, ["type", "argument"]);
      addReason(state, node, path, "await", "await may suspend module evaluation");
      visitOne(state, node, "argument", path, ReferenceRole);
    } else if (target__gensym8 === "ImportExpression") {
      checkUnlisted(state, node, path, ["type", "source", "options", "phase"]);
      addReason(state, node, path, "dynamic_import", "dynamic import may load another module");
      visitOne(state, node, "source", path, ReferenceRole);
      visitOne(state, node, "options", path, ReferenceRole);
    } else if (target__gensym8 === "AssignmentExpression") {
      checkUnlisted(state, node, path, ["type", "operator", "left", "right"]);
      addReason(state, node, path, "assignment", "assignment mutates a reference");
      visitOne(state, node, "left", path, ReferenceRole);
      visitOne(state, node, "right", path, ReferenceRole);
    } else if (target__gensym8 === "UpdateExpression") {
      checkUnlisted(state, node, path, ["type", "operator", "argument", "prefix"]);
      addReason(state, node, path, "update", "update mutates a reference");
      visitOne(state, node, "argument", path, ReferenceRole);
    } else if (target__gensym8 === "MemberExpression") {
      checkUnlisted(state, node, path, ["type", "object", "property", "computed", "optional"]);
      addReason(state, node, path, "member_read", "member access may invoke a getter or proxy");
      visitOne(state, node, "object", path, ReferenceRole);
      if (child(node, "computed")) {
        addReason(state, child(node, "property"), pathField(path, "property"), "computed_key_coercion", "ToPropertyKey may invoke user conversion");
        visitOne(state, node, "property", path, ReferenceRole);
      } else visitOne(state, node, "property", path, NameRole);

    } else if (target__gensym8 === "ChainExpression") {
      checkUnlisted(state, node, path, ["type", "expression"]);
      visitOne(state, node, "expression", path, ReferenceRole);
    } else if (target__gensym8 === "ArrayExpression") {
      checkUnlisted(state, node, path, ["type", "elements"]);
      visitList(state, child(node, "elements"), pathField(path, "elements"), ReferenceRole);
    } else if (target__gensym8 === "ObjectExpression") {
      checkUnlisted(state, node, path, ["type", "properties"]);
      visitList(state, child(node, "properties"), pathField(path, "properties"), ReferenceRole);
    } else if (target__gensym8 === "SpreadElement") {
      checkUnlisted(state, node, path, ["type", "argument"]);
      addReason(state, node, path, "spread", "spread may invoke getters or iterators");
      visitOne(state, node, "argument", path, ReferenceRole);
    } else if (target__gensym8 === "Property") {
      {
        const target__gensym10 = role;
        if (target__gensym10.tag === "BindingRole") {
          visitPattern(state, node, path);
        } else if (target__gensym10.tag === "ReferenceRole") {
          checkUnlisted(state, node, path, ["type", "key", "value", "computed", "shorthand", "kind", "method"]);
          if (child(node, "computed")) {
            addReason(state, child(node, "key"), pathField(path, "key"), "computed_key_coercion", "ToPropertyKey may invoke user conversion");
            visitOne(state, node, "key", path, ReferenceRole);
          } else visitOne(state, node, "key", path, NameRole);

          visitOne(state, node, "value", path, ReferenceRole);
        } else if (target__gensym10.tag === "NameRole") {
          unsupported(state, node, path);
        } else if (target__gensym10.tag === "DeferredRole") {
          unsupported(state, node, path);
        } else {
          throw new Error("match: no matching pattern");
        }



      }
    } else if (target__gensym8 === "ArrayPattern") {
      visitPattern(state, node, path);
    } else if (target__gensym8 === "ObjectPattern") {
      visitPattern(state, node, path);
    } else if (target__gensym8 === "UnaryExpression") {
      checkUnlisted(state, node, path, ["type", "operator", "prefix", "argument"]);
      if (!(child(node, "operator") === "!")) addReason(state, node, path, "operator_coercion", "unary operator may coerce an unconstrained operand");

      visitOne(state, node, "argument", path, ReferenceRole);
    } else if (target__gensym8 === "BinaryExpression") {
      checkUnlisted(state, node, path, ["type", "operator", "left", "right"]);
      if (!["===", "!=="].includes(child(node, "operator"))) addReason(state, node, path, "operator_coercion", "binary operator may coerce unconstrained operands");

      visitOne(state, node, "left", path, ReferenceRole);
      visitOne(state, node, "right", path, ReferenceRole);
    } else if (target__gensym8 === "LogicalExpression") {
      checkUnlisted(state, node, path, ["type", "operator", "left", "right"]);
      visitOne(state, node, "left", path, ReferenceRole);
      visitOne(state, node, "right", path, ReferenceRole);
    } else if (target__gensym8 === "ConditionalExpression") {
      checkUnlisted(state, node, path, ["type", "test", "consequent", "alternate"]);
      visitOne(state, node, "test", path, ReferenceRole);
      visitOne(state, node, "consequent", path, ReferenceRole);
      visitOne(state, node, "alternate", path, ReferenceRole);
    } else if (target__gensym8 === "SequenceExpression") {
      checkUnlisted(state, node, path, ["type", "expressions"]);
      visitList(state, child(node, "expressions"), pathField(path, "expressions"), ReferenceRole);
    } else if (target__gensym8 === "TemplateLiteral") {
      checkUnlisted(state, node, path, ["type", "quasis", "expressions"]);
      if (child(node, "expressions")["length"] > 0) addReason(state, node, path, "coercion", "template substitution may invoke conversion hooks");

      visitList(state, child(node, "expressions"), pathField(path, "expressions"), ReferenceRole);
    } else if (target__gensym8 === "ImportDeclaration") {
      checkUnlisted(state, node, path, ["type", "specifiers", "source", "assertions", "attributes", "importKind"]);
      checkAttributes(state, node, path);
      addEdge(state, node, path, child(node, "specifiers")["length"] === 0);
    } else if (target__gensym8 === "ExportNamedDeclaration") {
      checkUnlisted(state, node, path, ["type", "declaration", "specifiers", "source", "exportKind", "attributes"]);
      checkAttributes(state, node, path);
      if (!(child(node, "source") === null)) addEdge(state, node, path, false);

      visitOne(state, node, "declaration", path, ReferenceRole);
      visitList(state, child(node, "specifiers"), pathField(path, "specifiers"), NameRole);
    } else if (target__gensym8 === "ExportDefaultDeclaration") {
      checkUnlisted(state, node, path, ["type", "declaration"]);
      visitOne(state, node, "declaration", path, ReferenceRole);
    } else if (target__gensym8 === "ExportAllDeclaration") {
      checkUnlisted(state, node, path, ["type", "source", "exported", "exportKind", "attributes"]);
      checkAttributes(state, node, path);
      addEdge(state, node, path, false);
    } else if (target__gensym8 === "ImportSpecifier") {
      checkUnlisted(state, node, path, ["type", "imported", "local", "importKind"]);
      null;
    } else if (target__gensym8 === "ExportSpecifier") {
      checkUnlisted(state, node, path, ["type", "local", "exported", "exportKind"]);
      null;
    } else {
      unsupported(state, node, path);
    }































































  }
}
function isDirectTopLevel(node, reasons) {
  if (!Array.isArray(reasons)) throw new TypeError("isDirectTopLevel (direct-top-level?): arg 'reasons' expected array, got " + typeof reasons);

  const result__gensym11 = (reasons.length > 0 || child(node, "type") === "ExpressionStatement") || ["BlockStatement", "IfStatement", "SwitchStatement", "TryStatement", "ThrowStatement", "WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement", "LabeledStatement", "WithStatement", "DebuggerStatement"].includes(child(node, "type"));
  if (typeof result__gensym11 !== "boolean") throw new TypeError("isDirectTopLevel (direct-top-level?): return value expected boolean, got " + typeof result__gensym11);

  return result__gensym11;
}
function walkProgram(program) {
  return !isAstNode(program) || child(program, "type") !== "Program" ? { coverage_status: "unsupported_ast", direct_statements: [], direct_count: 0, reasons: [], reason_count: 0, dependency_edges: [], dependency_edge_count: 0, bare_imports: 0, unsupported_nodes: [{ status: "unsupported_ast", nodeType: child(program, "type"), path: "Program", loc: child(program, "loc"), range: child(program, "range") }] } : !Array.isArray(child(program, "body")) ? { coverage_status: "unsupported_ast", direct_statements: [], direct_count: 0, reasons: [], reason_count: 0, dependency_edges: [], dependency_edge_count: 0, bare_imports: 0, unsupported_nodes: [{ status: "unsupported_ast", nodeType: "Program", path: "Program.body", loc: child(program, "loc"), range: child(program, "range") }] } : (() => {
    const direct = { value: [] };
    const findings = { value: 0 };
    const reasonsTotal = { value: [] };
    const edges = { value: [] };
    const bare = { value: 0 };
    const coverage = { value: "complete" };
    const errors = { value: [] };
    for (let index = 0; index < program.body.length; index += 1) {
      const parent = program.body[index];
      const parentPath = pathIndex("Program.body", index);
      const localReasons = { value: [] };
      const localEdges = { value: [] };
      const localBare = { value: 0 };
      const localCoverage = { value: "complete" };
      const localErrors = { value: [] };
      visitNode({ reasons: localReasons, edges: localEdges, bare: localBare, coverage: localCoverage, errors: localErrors }, parent, parentPath, ReferenceRole);
      const parentFinding = isDirectTopLevel(parent, localReasons.value);
      if (parentFinding) findings.value = (n => {
        if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

        return n + 1;
      })(findings.value);

      reasonsTotal.value = (all => {
        if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

        return all.concat(localReasons.value);
      })(reasonsTotal.value);
      edges.value = (all => {
        if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

        return all.concat(localEdges.value);
      })(edges.value);
      bare.value = (n => {
        if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

        return n + localBare.value;
      })(bare.value);
      if (localCoverage.value === "unsupported_ast") coverage.value = "unsupported_ast";

      errors.value = (all => {
        if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

        return all.concat(localErrors.value);
      })(errors.value);
      direct.value = (rows => {
        if (!Array.isArray(rows)) throw new TypeError("anonymous: arg 'rows' expected array, got " + typeof rows);

        return [...rows, { parentPath: parentPath, parentType: child(parent, "type"), finding: parentFinding, potential_load_evaluation: parentFinding, observed_effect: null, reasons: localReasons.value, reasonCount: localReasons.value["length"], dependency_edges: localEdges.value }];
      })(direct.value);
    }
    return { coverage_status: coverage.value, direct_statements: direct.value, direct_count: findings.value, reason_count: reasonsTotal.value["length"], reasons: reasonsTotal.value, dependency_edges: edges.value, dependency_edge_count: edges.value["length"], bare_imports: bare.value, unsupported_nodes: errors.value };
  })();
}
