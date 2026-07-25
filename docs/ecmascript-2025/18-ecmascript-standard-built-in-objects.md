# 18 ECMAScript Standard Built-in Objects

There are certain built-in objects available whenever an ECMAScript [Script](#prod-Script) or [Module](#prod-Module) begins execution. One, the [global object](#sec-global-object), is part of the global environment of the executing program. Others are accessible as initial properties of the [global object](#sec-global-object) or indirectly as properties of accessible built-in objects.

Unless specified otherwise, a built-in object that is callable as a function is a built-in [function object](#function-object) with the characteristics described in [10.3](#sec-built-in-function-objects). Unless specified otherwise, the `[[Extensible]]` internal slot of a built-in object initially has the value true. Every built-in [function object](#function-object) has a `[[Realm]]` internal slot whose value is the [Realm Record](#realm-record) of the [realm](#realm) for which the object was initially created.

Many built-in objects are functions: they can be invoked with arguments. Some of them furthermore are [constructors](#constructor): they are functions intended for use with the `new` operator. For each built-in function, this specification describes the arguments required by that function and the properties of that [function object](#function-object). For each built-in [constructor](#constructor), this specification furthermore describes properties of the prototype object of that [constructor](#constructor) and properties of specific object instances returned by a `new` expression that invokes that [constructor](#constructor).

Unless otherwise specified in the description of a particular function, if a built-in function or [constructor](#constructor) is given fewer arguments than the function is specified to require, the function or [constructor](#constructor) shall behave exactly as if it had been given sufficient additional arguments, each such argument being the undefined value. Such missing arguments are considered to be “not present” and may be identified in that manner by specification algorithms. In the description of a particular function, the terms “this value” and “NewTarget” have the meanings given in [10.3](#sec-built-in-function-objects).

Unless otherwise specified in the description of a particular function, if a built-in function or [constructor](#constructor) described is given more arguments than the function is specified to allow, the extra arguments are evaluated by the call and then ignored by the function. However, an implementation may define implementation specific behaviour relating to such arguments as long as the behaviour is not the throwing of a TypeError exception that is predicated simply on the presence of an extra argument.

Note 1

Implementations that add additional capabilities to the set of built-in functions are encouraged to do so by adding new functions rather than adding new parameters to existing functions.

Unless otherwise specified every built-in function and every built-in [constructor](#constructor) has the [Function prototype object](#sec-properties-of-the-function-prototype-object), which is the initial value of the expression `Function.prototype` ([20.2.3](#sec-properties-of-the-function-prototype-object)), as the value of its `[[Prototype]]` internal slot.

Unless otherwise specified every built-in prototype object has the [Object prototype object](#sec-properties-of-the-object-prototype-object), which is the initial value of the expression `Object.prototype` ([20.1.3](#sec-properties-of-the-object-prototype-object)), as the value of its `[[Prototype]]` internal slot, except the [Object prototype object](#sec-properties-of-the-object-prototype-object) itself.

If this specification defines a built-in [constructor](#constructor)'s behaviour via algorithm steps, then that is its behaviour for the purposes of both `[[Call]]` and `[[Construct]]`. If such an algorithm needs to distinguish the two cases, it checks whether NewTarget is undefined, which indicates a `[[Call]]` invocation.

Built-in [function objects](#function-object) that are not identified as [constructors](#constructor) do not implement the `[[Construct]]` internal method unless otherwise specified in the description of a particular function.

Built-in [function objects](#function-object) that are not [constructors](#constructor) do not have a "prototype" property unless otherwise specified in the description of a particular function.

Each built-in function defined in this specification is created by calling the [CreateBuiltinFunction](#sec-createbuiltinfunction) abstract operation ([10.3.4](#sec-createbuiltinfunction)). The values of the `length` and `name` parameters are the initial values of the "length" and "name" properties as discussed below. The values of the `prefix` parameter are similarly discussed below.

Every built-in [function object](#function-object), including [constructors](#constructor), has a "length" property whose value is a non-negative [integral Number](#integral-number). Unless otherwise specified, this value is the number of required parameters shown in the subclause heading for the function description. Optional parameters and rest parameters are not included in the parameter count.

Note 2

For example, the [function object](#function-object) that is the initial value of the "map" property of the [Array prototype object](#sec-properties-of-the-array-prototype-object) is described under the subclause heading «Array.prototype.map (callback \[ , thisArg\])» which shows the two named arguments callback and thisArg, the latter being optional; therefore the value of the "length" property of that [function object](#function-object) is 1_(𝔽).

Unless otherwise specified, the "length" property of a built-in [function object](#function-object) has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

Every built-in [function object](#function-object), including [constructors](#constructor), has a "name" property whose value [is a String](#sec-ecmascript-language-types-string-type). Unless otherwise specified, this value is the name that is given to the function in this specification. Functions that are identified as anonymous functions use the empty String as the value of the "name" property. For functions that are specified as properties of objects, the name value is the [property name](#property-name) string used to access the function. Functions that are specified as get or set accessor functions of built-in properties have "get" or "set" (respectively) passed to the `prefix` parameter when calling [CreateBuiltinFunction](#sec-createbuiltinfunction).

The value of the "name" property is explicitly specified for each built-in functions whose [property key](#property-key) [is a Symbol](#sec-ecmascript-language-types-symbol-type) value. If such an explicitly specified value starts with the prefix "get " or "set " and the function for which it is specified is a get or set accessor function of a built-in property, the value without the prefix is passed to the `name` parameter, and the value "get" or "set" (respectively) is passed to the `prefix` parameter when calling [CreateBuiltinFunction](#sec-createbuiltinfunction).

Unless otherwise specified, the "name" property of a built-in [function object](#function-object) has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

Every other [data property](#sec-object-type) described in clauses [19](#sec-global-object) through [28](#sec-reflection) and in Annex [B.2](#sec-additional-built-in-properties) has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true } unless otherwise specified.

Every [accessor property](#sec-object-type) described in clauses [19](#sec-global-object) through [28](#sec-reflection) and in Annex [B.2](#sec-additional-built-in-properties) has the attributes { `[[Enumerable]]`: false, `[[Configurable]]`: true } unless otherwise specified. If only a get accessor function is described, the set accessor function is the default value, undefined. If only a set accessor is described the get accessor is the default value, undefined.
