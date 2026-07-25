# 9 Executable Code and Execution Contexts

## 9.1 Environment Records

Environment Record is a specification type used to define the association of [Identifier](#prod-Identifier)s to specific variables and functions, based upon the lexical nesting structure of ECMAScript code. Usually an Environment Record is associated with some specific syntactic structure of ECMAScript code such as a [FunctionDeclaration](#prod-FunctionDeclaration), a [BlockStatement](#prod-BlockStatement), or a [Catch](#prod-Catch) clause of a [TryStatement](#prod-TryStatement). Each time such code is evaluated, a new Environment Record is created to record the identifier bindings that are created by that code.

Every Environment Record has an `[[OuterEnv]]` field, which is either null or a reference to an outer Environment Record. This is used to model the logical nesting of Environment Record values. The outer reference of an (inner) Environment Record is a reference to the Environment Record that logically surrounds the inner Environment Record. An outer Environment Record may, of course, have its own outer Environment Record. An Environment Record may serve as the outer environment for multiple inner Environment Records. For example, if a [FunctionDeclaration](#prod-FunctionDeclaration) contains two nested [FunctionDeclaration](#prod-FunctionDeclaration)s then the Environment Records of each of the nested functions will have as their outer Environment Record the Environment Record of the current evaluation of the surrounding function.

Environment Records are purely specification mechanisms and need not correspond to any specific artefact of an ECMAScript implementation. It is impossible for an ECMAScript program to directly access or manipulate such values.

### 9.1.1 The Environment Record Type Hierarchy

[Environment Records](#sec-environment-records) can be thought of as existing in a simple object-oriented hierarchy where [Environment Record](#sec-environment-records) is an abstract class with three concrete subclasses: [Declarative Environment Record](#sec-declarative-environment-records), [Object Environment Record](#sec-object-environment-records), and [Global Environment Record](#sec-global-environment-records). [Function Environment Records](#sec-function-environment-records) and [Module Environment Records](#sec-module-environment-records) are subclasses of [Declarative Environment Record](#sec-declarative-environment-records).

- [Environment Record](#sec-environment-records) (abstract)

  - A *[Declarative Environment Record](#sec-declarative-environment-records)* is used to define the effect of ECMAScript language syntactic elements such as [FunctionDeclaration](#prod-FunctionDeclaration)s, [VariableDeclaration](#prod-VariableDeclaration)s, and [Catch](#prod-Catch) clauses that directly associate identifier bindings with [ECMAScript language values](#sec-ecmascript-language-types).

    - A *[Function Environment Record](#sec-function-environment-records)* corresponds to the invocation of an ECMAScript [function object](#function-object), and contains bindings for the top-level declarations within that function. It may establish a new `this` binding. It also captures the state necessary to support `super` method invocations.

    - A *[Module Environment Record](#sec-module-environment-records)* contains the bindings for the top-level declarations of a [Module](#prod-Module). It also contains the bindings that are explicitly imported by the [Module](#prod-Module). Its `[[OuterEnv]]` is a [Global Environment Record](#sec-global-environment-records).

  - An *[Object Environment Record](#sec-object-environment-records)* is used to define the effect of ECMAScript elements such as [WithStatement](#prod-WithStatement) that associate identifier bindings with the properties of some object.

  - A *[Global Environment Record](#sec-global-environment-records)* is used for [Script](#prod-Script) global declarations. It does not have an outer environment; its `[[OuterEnv]]` is null. It may be prepopulated with identifier bindings and it includes an associated [global object](#sec-global-object) whose properties provide some of the global environment's identifier bindings. As ECMAScript code is executed, additional properties may be added to the [global object](#sec-global-object) and the initial properties may be modified.

The [Environment Record](#sec-environment-records) abstract class includes the abstract specification methods defined in [Table 16](#table-abstract-methods-of-environment-records). These abstract methods have distinct concrete algorithms for each of the concrete subclasses.

| Method | Purpose |
|----|----|
| HasBinding(N) | Determine if an [Environment Record](#sec-environment-records) has a binding for the String value `N`. Return true if it does and false if it does not. |
| CreateMutableBinding(N, D) | Create a new but uninitialized mutable binding in an [Environment Record](#sec-environment-records). The String value `N` is the text of the bound name. If the Boolean argument `D` is true the binding may be subsequently deleted. |
| CreateImmutableBinding(N, S) | Create a new but uninitialized immutable binding in an [Environment Record](#sec-environment-records). The String value `N` is the text of the bound name. If `S` is true then attempts to set it after it has been initialized will always throw an exception, regardless of the strict mode setting of operations that reference that binding. |
| InitializeBinding(N, V) | Set the value of an already existing but uninitialized binding in an [Environment Record](#sec-environment-records). The String value `N` is the text of the bound name. `V` is the value for the binding and is a value of any [ECMAScript language type](#sec-ecmascript-language-types). |
| SetMutableBinding(N, V, S) | Set the value of an already existing mutable binding in an [Environment Record](#sec-environment-records). The String value `N` is the text of the bound name. `V` is the value for the binding and may be a value of any [ECMAScript language type](#sec-ecmascript-language-types). `S` [is a Boolean](#sec-ecmascript-language-types-boolean-type) flag. If `S` is true and the binding cannot be set throw a TypeError exception. |
| GetBindingValue(N, S) | Returns the value of an already existing binding from an [Environment Record](#sec-environment-records). The String value `N` is the text of the bound name. `S` is used to identify references originating in [strict mode code](#sec-strict-mode-code) or that otherwise require strict mode reference semantics. If `S` is true and the binding does not exist throw a ReferenceError exception. If the binding exists but is uninitialized a ReferenceError is thrown, regardless of the value of `S`. |
| DeleteBinding(N) | Delete a binding from an [Environment Record](#sec-environment-records). The String value `N` is the text of the bound name. If a binding for `N` exists, remove the binding and return true. If the binding exists but cannot be removed return false. If the binding does not exist return true. |
| HasThisBinding() | Determine if an [Environment Record](#sec-environment-records) establishes a `this` binding. Return true if it does and false if it does not. |
| HasSuperBinding() | Determine if an [Environment Record](#sec-environment-records) establishes a `super` method binding. Return true if it does and false if it does not. If it returns true it implies that the [Environment Record](#sec-environment-records) is a [Function Environment Record](#sec-function-environment-records), although the reverse implication does not hold. |
| WithBaseObject() | If this [Environment Record](#sec-environment-records) is associated with a `with` statement, return the with object. Otherwise, return undefined. |

Table 16: Abstract Methods of [Environment Records](#sec-environment-records)

#### 9.1.1.1 Declarative Environment Records

Each Declarative Environment Record is associated with an ECMAScript program scope containing variable, constant, let, class, module, import, and/or function declarations. A Declarative Environment Record binds the set of identifiers defined by the declarations contained within its scope.

##### 9.1.1.1.1 HasBinding ( `N` )

The HasBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes argument `N` (a String) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It determines if the argument identifier is one of the identifiers bound by the record. It performs the following steps when called:

1.  If `envRec` has a binding for `N`, return true.
2.  Return false.

##### 9.1.1.1.2 CreateMutableBinding ( `N`, `D` )

The CreateMutableBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes arguments `N` (a String) and `D` (a Boolean) and returns a [normal completion containing](#sec-completion-record-specification-type) unused. It creates a new mutable binding for the name `N` that is uninitialized. A binding must not already exist in this [Environment Record](#sec-environment-records) for `N`. If `D` is true, the new binding is marked as being subject to deletion. It performs the following steps when called:

1.  [Assert](#assert): `envRec` does not already have a binding for `N`.
2.  Create a mutable binding in `envRec` for `N` and record that it is uninitialized. If `D` is true, record that the newly created binding may be deleted by a subsequent DeleteBinding call.
3.  Return unused.

##### 9.1.1.1.3 CreateImmutableBinding ( `N`, `S` )

The CreateImmutableBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes arguments `N` (a String) and `S` (a Boolean) and returns a [normal completion containing](#sec-completion-record-specification-type) unused. It creates a new immutable binding for the name `N` that is uninitialized. A binding must not already exist in this [Environment Record](#sec-environment-records) for `N`. If `S` is true, the new binding is marked as a strict binding. It performs the following steps when called:

1.  [Assert](#assert): `envRec` does not already have a binding for `N`.
2.  Create an immutable binding in `envRec` for `N` and record that it is uninitialized. If `S` is true, record that the newly created binding is a strict binding.
3.  Return unused.

##### 9.1.1.1.4 InitializeBinding ( `N`, `V` )

The InitializeBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes arguments `N` (a String) and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a [normal completion containing](#sec-completion-record-specification-type) unused. It is used to set the bound value of the current binding of the identifier whose name is `N` to the value `V`. An uninitialized binding for `N` must already exist. It performs the following steps when called:

1.  [Assert](#assert): `envRec` must have an uninitialized binding for `N`.
2.  Set the bound value for `N` in `envRec` to `V`.
3.  Record that the binding for `N` in `envRec` has been initialized.
4.  Return unused.

##### 9.1.1.1.5 SetMutableBinding ( `N`, `V`, `S` )

The SetMutableBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes arguments `N` (a String), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It attempts to change the bound value of the current binding of the identifier whose name is `N` to the value `V`. A binding for `N` normally already exists, but in rare cases it may not. If the binding is an immutable binding, a TypeError is thrown if `S` is true. It performs the following steps when called:

1.  If `envRec` does not have a binding for `N`, then
    1.  If `S` is true, throw a ReferenceError exception.
    2.  Perform ! `envRec`.CreateMutableBinding(`N`, true).
    3.  Perform ! `envRec`.InitializeBinding(`N`, `V`).
    4.  Return unused.
2.  If the binding for `N` in `envRec` is a strict binding, set `S` to true.
3.  If the binding for `N` in `envRec` has not yet been initialized, then
    1.  Throw a ReferenceError exception.
4.  Else if the binding for `N` in `envRec` is a mutable binding, then
    1.  Change its bound value to `V`.
5.  Else,
    1.  [Assert](#assert): This is an attempt to change the value of an immutable binding.
    2.  If `S` is true, throw a TypeError exception.
6.  Return unused.

Note

An example of ECMAScript code that results in a missing binding at step [1](#step-setmutablebinding-missing-binding) is:

``` javascript
function f() { eval("var x; x = (delete x, 0);"); }
```

##### 9.1.1.1.6 GetBindingValue ( `N`, `S` )

The GetBindingValue concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes arguments `N` (a String) and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It returns the value of its bound identifier whose name is `N`. If the binding exists but is uninitialized a ReferenceError is thrown, regardless of the value of `S`. It performs the following steps when called:

1.  [Assert](#assert): `envRec` has a binding for `N`.
2.  If the binding for `N` in `envRec` is an uninitialized binding, throw a ReferenceError exception.
3.  Return the value currently bound to `N` in `envRec`.

##### 9.1.1.1.7 DeleteBinding ( `N` )

The DeleteBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes argument `N` (a String) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It can only delete bindings that have been explicitly designated as being subject to deletion. It performs the following steps when called:

1.  [Assert](#assert): `envRec` has a binding for `N`.
2.  If the binding for `N` in `envRec` cannot be deleted, return false.
3.  Remove the binding for `N` from `envRec`.
4.  Return true.

##### 9.1.1.1.8 HasThisBinding ( )

The HasThisBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes no arguments and returns false. It performs the following steps when called:

1.  Return false.

Note

A regular [Declarative Environment Record](#sec-declarative-environment-records) (i.e., one that is neither a [Function Environment Record](#sec-function-environment-records) nor a [Module Environment Record](#sec-module-environment-records)) does not provide a `this` binding.

##### 9.1.1.1.9 HasSuperBinding ( )

The HasSuperBinding concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes no arguments and returns false. It performs the following steps when called:

1.  Return false.

Note

A regular [Declarative Environment Record](#sec-declarative-environment-records) (i.e., one that is neither a [Function Environment Record](#sec-function-environment-records) nor a [Module Environment Record](#sec-module-environment-records)) does not provide a `super` binding.

##### 9.1.1.1.10 WithBaseObject ( )

The WithBaseObject concrete method of a [Declarative Environment Record](#sec-declarative-environment-records) `envRec` takes no arguments and returns undefined. It performs the following steps when called:

1.  Return undefined.

#### 9.1.1.2 Object Environment Records

Each Object Environment Record is associated with an object called its *binding object*. An Object Environment Record binds the set of string identifier names that directly correspond to the property names of its binding object. [Property keys](#property-key) that are not strings in the form of an [IdentifierName](#prod-IdentifierName) are not included in the set of bound identifiers. Both own and inherited properties are included in the set regardless of the setting of their `[[Enumerable]]` attribute. Because properties can be dynamically added and deleted from objects, the set of identifiers bound by an Object Environment Record may potentially change as a side-effect of any operation that adds or deletes properties. Any bindings that are created as a result of such a side-effect are considered to be a mutable binding even if the Writable attribute of the corresponding property is false. Immutable bindings do not exist for Object Environment Records.

Object Environment Records created for `with` statements ([14.11](#sec-with-statement)) can provide their binding object as an implicit this value for use in function calls. The capability is controlled by a Boolean `[[IsWithEnvironment]]` field.

Object Environment Records have the additional state fields listed in [Table 17](#table-additional-fields-of-object-environment-records).

| Field Name | Value | Meaning |
|----|----|----|
| `[[BindingObject]]` | an Object | The binding object of this [Environment Record](#sec-environment-records). |
| `[[IsWithEnvironment]]` | a Boolean | Indicates whether this [Environment Record](#sec-environment-records) is created for a `with` statement. |

Table 17: Additional Fields of [Object Environment Records](#sec-object-environment-records)

##### 9.1.1.2.1 HasBinding ( `N` )

The HasBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes argument `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It determines if its associated binding object has a property whose name is `N`. It performs the following steps when called:

1.  Let `bindingObject` be `envRec`.`[[BindingObject]]`.
2.  Let `foundBinding` be ? [HasProperty](#sec-hasproperty)(`bindingObject`, `N`).
3.  If `foundBinding` is false, return false.
4.  If `envRec`.`[[IsWithEnvironment]]` is false, return true.
5.  Let `unscopables` be ? [Get](#sec-get-o-p)(`bindingObject`, [%Symbol.unscopables%](#sec-well-known-symbols)).
6.  If `unscopables` [is an Object](#sec-object-type), then
    1.  Let `blocked` be [ToBoolean](#sec-toboolean)(? [Get](#sec-get-o-p)(`unscopables`, `N`)).
    2.  If `blocked` is true, return false.
7.  Return true.

##### 9.1.1.2.2 CreateMutableBinding ( `N`, `D` )

The CreateMutableBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes arguments `N` (a String) and `D` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It creates in an [Environment Record](#sec-environment-records)'s associated binding object a property whose name is `N` and initializes it to the value undefined. If `D` is true, the new property's `[[Configurable]]` attribute is set to true; otherwise it is set to false. It performs the following steps when called:

1.  Let `bindingObject` be `envRec`.`[[BindingObject]]`.
2.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`bindingObject`, `N`, PropertyDescriptor { `[[Value]]`: undefined, `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: `D` }).
3.  Return unused.

Note

Normally `envRec` will not have a binding for `N` but if it does, the semantics of [DefinePropertyOrThrow](#sec-definepropertyorthrow) may result in an existing binding being replaced or shadowed or cause an [abrupt completion](#sec-completion-record-specification-type) to be returned.

##### 9.1.1.2.3 CreateImmutableBinding ( `N`, `S` )

The CreateImmutableBinding concrete method of an [Object Environment Record](#sec-object-environment-records) is never used within this specification.

##### 9.1.1.2.4 InitializeBinding ( `N`, `V` )

The InitializeBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes arguments `N` (a String) and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to set the bound value of the current binding of the identifier whose name is `N` to the value `V`. It performs the following steps when called:

1.  Perform ? `envRec`.SetMutableBinding(`N`, `V`, false).
2.  Return unused.

Note

In this specification, all uses of CreateMutableBinding for [Object Environment Records](#sec-object-environment-records) are immediately followed by a call to InitializeBinding for the same name. Hence, this specification does not explicitly track the initialization state of bindings in [Object Environment Records](#sec-object-environment-records).

##### 9.1.1.2.5 SetMutableBinding ( `N`, `V`, `S` )

The SetMutableBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes arguments `N` (a String), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It attempts to set the value of the [Environment Record](#sec-environment-records)'s associated binding object's property whose name is `N` to the value `V`. A property named `N` normally already exists but if it does not or is not currently writable, error handling is determined by `S`. It performs the following steps when called:

1.  Let `bindingObject` be `envRec`.`[[BindingObject]]`.
2.  Let `stillExists` be ? [HasProperty](#sec-hasproperty)(`bindingObject`, `N`).
3.  If `stillExists` is false and `S` is true, throw a ReferenceError exception.
4.  Perform ? [Set](#sec-set-o-p-v-throw)(`bindingObject`, `N`, `V`, `S`).
5.  Return unused.

##### 9.1.1.2.6 GetBindingValue ( `N`, `S` )

The GetBindingValue concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes arguments `N` (a String) and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It returns the value of its associated binding object's property whose name is `N`. The property should already exist but if it does not the result depends upon `S`. It performs the following steps when called:

1.  Let `bindingObject` be `envRec`.`[[BindingObject]]`.
2.  Let `value` be ? [HasProperty](#sec-hasproperty)(`bindingObject`, `N`).
3.  If `value` is false, then
    1.  If `S` is false, return undefined; otherwise throw a ReferenceError exception.
4.  Return ? [Get](#sec-get-o-p)(`bindingObject`, `N`).

##### 9.1.1.2.7 DeleteBinding ( `N` )

The DeleteBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes argument `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It can only delete bindings that correspond to properties of the environment object whose `[[Configurable]]` attribute have the value true. It performs the following steps when called:

1.  Let `bindingObject` be `envRec`.`[[BindingObject]]`.
2.  Return ? `bindingObject`.`[[Delete]]`(`N`).

##### 9.1.1.2.8 HasThisBinding ( )

The HasThisBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes no arguments and returns false. It performs the following steps when called:

1.  Return false.

Note

[Object Environment Records](#sec-object-environment-records) do not provide a `this` binding.

##### 9.1.1.2.9 HasSuperBinding ( )

The HasSuperBinding concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes no arguments and returns false. It performs the following steps when called:

1.  Return false.

Note

[Object Environment Records](#sec-object-environment-records) do not provide a `super` binding.

##### 9.1.1.2.10 WithBaseObject ( )

The WithBaseObject concrete method of an [Object Environment Record](#sec-object-environment-records) `envRec` takes no arguments and returns an Object or undefined. It performs the following steps when called:

1.  If `envRec`.`[[IsWithEnvironment]]` is true, return `envRec`.`[[BindingObject]]`.
2.  Otherwise, return undefined.

#### 9.1.1.3 Function Environment Records

A Function Environment Record is a [Declarative Environment Record](#sec-declarative-environment-records) that is used to represent the top-level scope of a function and, if the function is not an [ArrowFunction](#prod-ArrowFunction), provides a `this` binding. If a function is not an [ArrowFunction](#prod-ArrowFunction) function and references `super`, its Function Environment Record also contains the state that is used to perform `super` method invocations from within the function.

Function Environment Records have the additional state fields listed in [Table 18](#table-additional-fields-of-function-environment-records).

| Field Name | Value | Meaning |
|----|----|----|
| `[[ThisValue]]` | an [ECMAScript language value](#sec-ecmascript-language-types) | This is the this value used for this invocation of the function. |
| `[[ThisBindingStatus]]` | lexical, initialized, or uninitialized | If the value is lexical, this is an [ArrowFunction](#prod-ArrowFunction) and does not have a local this value. |
| `[[FunctionObject]]` | an ECMAScript [function object](#function-object) | The [function object](#function-object) whose invocation caused this [Environment Record](#sec-environment-records) to be created. |
| `[[NewTarget]]` | a [constructor](#constructor) or undefined | If this [Environment Record](#sec-environment-records) was created by the `[[Construct]]` internal method, `[[NewTarget]]` is the value of the `[[Construct]]` `newTarget` parameter. Otherwise, its value is undefined. |

Table 18: Additional Fields of [Function Environment Records](#sec-function-environment-records)

Function Environment Records support all of the [Declarative Environment Record](#sec-declarative-environment-records) methods listed in [Table 16](#table-abstract-methods-of-environment-records) and share the same specifications for all of those methods except for HasThisBinding and HasSuperBinding. In addition, Function Environment Records support the methods listed in [Table 19](#table-additional-methods-of-function-environment-records):

| Method | Purpose |
|----|----|
| GetThisBinding() | Return the value of this [Environment Record](#sec-environment-records)'s `this` binding. Throws a ReferenceError if the `this` binding has not been initialized. |

Table 19: Additional Methods of [Function Environment Records](#sec-function-environment-records)

##### 9.1.1.3.1 BindThisValue ( `envRec`, `V` )

The abstract operation BindThisValue takes arguments `envRec` (a [Function Environment Record](#sec-function-environment-records)) and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It sets the `envRec`.`[[ThisValue]]` and records that it has been initialized. It performs the following steps when called:

1.  [Assert](#assert): `envRec`.`[[ThisBindingStatus]]` is not lexical.
2.  If `envRec`.`[[ThisBindingStatus]]` is initialized, throw a ReferenceError exception.
3.  Set `envRec`.`[[ThisValue]]` to `V`.
4.  Set `envRec`.`[[ThisBindingStatus]]` to initialized.
5.  Return unused.

##### 9.1.1.3.2 HasThisBinding ( )

The HasThisBinding concrete method of a [Function Environment Record](#sec-function-environment-records) `envRec` takes no arguments and returns a Boolean. It performs the following steps when called:

1.  If `envRec`.`[[ThisBindingStatus]]` is lexical, return false; otherwise, return true.

##### 9.1.1.3.3 HasSuperBinding ( )

The HasSuperBinding concrete method of a [Function Environment Record](#sec-function-environment-records) `envRec` takes no arguments and returns a Boolean. It performs the following steps when called:

1.  If `envRec`.`[[ThisBindingStatus]]` is lexical, return false.
2.  If `envRec`.`[[FunctionObject]]`.`[[HomeObject]]` is undefined, return false; otherwise, return true.

##### 9.1.1.3.4 GetThisBinding ( )

The GetThisBinding concrete method of a [Function Environment Record](#sec-function-environment-records) `envRec` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): `envRec`.`[[ThisBindingStatus]]` is not lexical.
2.  If `envRec`.`[[ThisBindingStatus]]` is uninitialized, throw a ReferenceError exception.
3.  Return `envRec`.`[[ThisValue]]`.

##### 9.1.1.3.5 GetSuperBase ( `envRec` )

The abstract operation GetSuperBase takes argument `envRec` (a [Function Environment Record](#sec-function-environment-records)) and returns an Object, null, or undefined. It returns the object that is the base for `super` property accesses bound in `envRec`. The value undefined indicates that such accesses will produce runtime errors. It performs the following steps when called:

1.  Let `home` be `envRec`.`[[FunctionObject]]`.`[[HomeObject]]`.
2.  If `home` is undefined, return undefined.
3.  [Assert](#assert): `home` is an [ordinary object](#ordinary-object).
4.  Return ! `home`.`[[GetPrototypeOf]]`().

#### 9.1.1.4 Global Environment Records

A Global Environment Record is used to represent the outer most scope that is shared by all of the ECMAScript [Script](#prod-Script) elements that are processed in a common [realm](#realm). A Global Environment Record provides the bindings for built-in globals (clause [19](#sec-global-object)), properties of the [global object](#sec-global-object), and for all top-level declarations ([8.2.9](#sec-static-semantics-toplevellexicallyscopeddeclarations), [8.2.11](#sec-static-semantics-toplevelvarscopeddeclarations)) that occur within a [Script](#prod-Script).

A Global Environment Record is logically a single record but it is specified as a composite encapsulating an [Object Environment Record](#sec-object-environment-records) and a [Declarative Environment Record](#sec-declarative-environment-records). The [Object Environment Record](#sec-object-environment-records) has as its base object the [global object](#sec-global-object) of the associated [Realm Record](#realm-record). This [global object](#sec-global-object) is the value returned by the Global Environment Record's GetThisBinding concrete method. The [Object Environment Record](#sec-object-environment-records) component of a Global Environment Record contains the bindings for all built-in globals (clause [19](#sec-global-object)) and all bindings introduced by a [FunctionDeclaration](#prod-FunctionDeclaration), [GeneratorDeclaration](#prod-GeneratorDeclaration), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), or [VariableStatement](#prod-VariableStatement) contained in global code. The bindings for all other ECMAScript declarations in global code are contained in the [Declarative Environment Record](#sec-declarative-environment-records) component of the Global Environment Record.

Properties may be created directly on a [global object](#sec-global-object). Hence, the [Object Environment Record](#sec-object-environment-records) component of a Global Environment Record may contain both bindings created explicitly by [FunctionDeclaration](#prod-FunctionDeclaration), [GeneratorDeclaration](#prod-GeneratorDeclaration), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), or [VariableDeclaration](#prod-VariableDeclaration) declarations and bindings created implicitly as properties of the [global object](#sec-global-object). In order to identify which bindings were explicitly created using declarations, a Global Environment Record maintains a list of the names bound using the [CreateGlobalVarBinding](#sec-createglobalvarbinding) and [CreateGlobalFunctionBinding](#sec-createglobalfunctionbinding) [abstract operations](#sec-algorithm-conventions-abstract-operations).

Global Environment Records have the additional fields listed in [Table 20](#table-additional-fields-of-global-environment-records) and the additional methods listed in [Table 21](#table-additional-methods-of-global-environment-records).

| Field Name | Value | Meaning |
|----|----|----|
| `[[ObjectRecord]]` | an [Object Environment Record](#sec-object-environment-records) | Binding object is the [global object](#sec-global-object). It contains global built-in bindings as well as [FunctionDeclaration](#prod-FunctionDeclaration), [GeneratorDeclaration](#prod-GeneratorDeclaration), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), and [VariableDeclaration](#prod-VariableDeclaration) bindings in global code for the associated [realm](#realm). |
| `[[GlobalThisValue]]` | an Object | The value returned by `this` in global scope. [Hosts](#host) may provide any ECMAScript Object value. |
| `[[DeclarativeRecord]]` | a [Declarative Environment Record](#sec-declarative-environment-records) | Contains bindings for all declarations in global code for the associated [realm](#realm) code except for [FunctionDeclaration](#prod-FunctionDeclaration), [GeneratorDeclaration](#prod-GeneratorDeclaration), [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration), and [VariableDeclaration](#prod-VariableDeclaration) bindings. |

Table 20: Additional Fields of [Global Environment Records](#sec-global-environment-records)

| Method | Purpose |
|----|----|
| GetThisBinding() | Return the value of this [Environment Record](#sec-environment-records)'s `this` binding. |

Table 21: Additional Methods of [Global Environment Records](#sec-global-environment-records)

##### 9.1.1.4.1 HasBinding ( `N` )

The HasBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes argument `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It determines if the argument identifier is one of the identifiers bound by the record. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, return true.
3.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
4.  Return ? `ObjRec`.HasBinding(`N`).

##### 9.1.1.4.2 CreateMutableBinding ( `N`, `D` )

The CreateMutableBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes arguments `N` (a String) and `D` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It creates a new mutable binding for the name `N` that is uninitialized. The binding is created in the associated DeclarativeRecord. A binding for `N` must not already exist in the DeclarativeRecord. If `D` is true, the new binding is marked as being subject to deletion. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, throw a TypeError exception.
3.  Return ! `DclRec`.CreateMutableBinding(`N`, `D`).

##### 9.1.1.4.3 CreateImmutableBinding ( `N`, `S` )

The CreateImmutableBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes arguments `N` (a String) and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It creates a new immutable binding for the name `N` that is uninitialized. A binding must not already exist in this [Environment Record](#sec-environment-records) for `N`. If `S` is true, the new binding is marked as a strict binding. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, throw a TypeError exception.
3.  Return ! `DclRec`.CreateImmutableBinding(`N`, `S`).

##### 9.1.1.4.4 InitializeBinding ( `N`, `V` )

The InitializeBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes arguments `N` (a String) and `V` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It is used to set the bound value of the current binding of the identifier whose name is `N` to the value `V`. An uninitialized binding for `N` must already exist. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, then
    1.  Return ! `DclRec`.InitializeBinding(`N`, `V`).
3.  [Assert](#assert): If the binding exists, it must be in the [Object Environment Record](#sec-object-environment-records).
4.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
5.  Return ? `ObjRec`.InitializeBinding(`N`, `V`).

##### 9.1.1.4.5 SetMutableBinding ( `N`, `V`, `S` )

The SetMutableBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes arguments `N` (a String), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It attempts to change the bound value of the current binding of the identifier whose name is `N` to the value `V`. If the binding is an immutable binding and `S` is true, a TypeError is thrown. A property named `N` normally already exists but if it does not or is not currently writable, error handling is determined by `S`. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, then
    1.  Return ? `DclRec`.SetMutableBinding(`N`, `V`, `S`).
3.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
4.  Return ? `ObjRec`.SetMutableBinding(`N`, `V`, `S`).

##### 9.1.1.4.6 GetBindingValue ( `N`, `S` )

The GetBindingValue concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes arguments `N` (a String) and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It returns the value of its bound identifier whose name is `N`. If the binding is an uninitialized binding throw a ReferenceError exception. A property named `N` normally already exists but if it does not or is not currently writable, error handling is determined by `S`. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, then
    1.  Return ? `DclRec`.GetBindingValue(`N`, `S`).
3.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
4.  Return ? `ObjRec`.GetBindingValue(`N`, `S`).

##### 9.1.1.4.7 DeleteBinding ( `N` )

The DeleteBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes argument `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It can only delete bindings that have been explicitly designated as being subject to deletion. It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  If ! `DclRec`.HasBinding(`N`) is true, then
    1.  Return ! `DclRec`.DeleteBinding(`N`).
3.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
4.  Let `globalObject` be `ObjRec`.`[[BindingObject]]`.
5.  Let `existingProp` be ? [HasOwnProperty](#sec-hasownproperty)(`globalObject`, `N`).
6.  If `existingProp` is true, then
    1.  Return ? `ObjRec`.DeleteBinding(`N`).
7.  Return true.

##### 9.1.1.4.8 HasThisBinding ( )

The HasThisBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes no arguments and returns true. It performs the following steps when called:

1.  Return true.

Note

[Global Environment Records](#sec-global-environment-records) always provide a `this` binding.

##### 9.1.1.4.9 HasSuperBinding ( )

The HasSuperBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes no arguments and returns false. It performs the following steps when called:

1.  Return false.

Note

[Global Environment Records](#sec-global-environment-records) do not provide a `super` binding.

##### 9.1.1.4.10 WithBaseObject ( )

The WithBaseObject concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes no arguments and returns undefined. It performs the following steps when called:

1.  Return undefined.

##### 9.1.1.4.11 GetThisBinding ( )

The GetThisBinding concrete method of a [Global Environment Record](#sec-global-environment-records) `envRec` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) an Object. It performs the following steps when called:

1.  Return `envRec`.`[[GlobalThisValue]]`.

##### 9.1.1.4.12 HasLexicalDeclaration ( `envRec`, `N` )

The abstract operation HasLexicalDeclaration takes arguments `envRec` (a [Global Environment Record](#sec-global-environment-records)) and `N` (a String) and returns a Boolean. It determines if the argument identifier has a binding in `envRec` that was created using a lexical declaration such as a [LexicalDeclaration](#prod-LexicalDeclaration) or a [ClassDeclaration](#prod-ClassDeclaration). It performs the following steps when called:

1.  Let `DclRec` be `envRec`.`[[DeclarativeRecord]]`.
2.  Return ! `DclRec`.HasBinding(`N`).

##### 9.1.1.4.13 HasRestrictedGlobalProperty ( `envRec`, `N` )

The abstract operation HasRestrictedGlobalProperty takes arguments `envRec` (a [Global Environment Record](#sec-global-environment-records)) and `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It determines if the argument identifier is the name of a property of the [global object](#sec-global-object) that must not be shadowed by a global lexical binding. It performs the following steps when called:

1.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
2.  Let `globalObject` be `ObjRec`.`[[BindingObject]]`.
3.  Let `existingProp` be ? `globalObject`.`[[GetOwnProperty]]`(`N`).
4.  If `existingProp` is undefined, return false.
5.  If `existingProp`.`[[Configurable]]` is true, return false.
6.  Return true.

Note

Properties may exist upon a [global object](#sec-global-object) that were directly created rather than being declared using a var or function declaration. A global lexical binding may not be created that has the same name as a non-configurable property of the [global object](#sec-global-object). The global property "undefined" is an example of such a property.

##### 9.1.1.4.14 CanDeclareGlobalVar ( `envRec`, `N` )

The abstract operation CanDeclareGlobalVar takes arguments `envRec` (a [Global Environment Record](#sec-global-environment-records)) and `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It determines if a corresponding [CreateGlobalVarBinding](#sec-createglobalvarbinding) call would succeed if called for the same argument `N`. Redundant var declarations and var declarations for pre-existing [global object](#sec-global-object) properties are allowed. It performs the following steps when called:

1.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
2.  Let `globalObject` be `ObjRec`.`[[BindingObject]]`.
3.  Let `hasProperty` be ? [HasOwnProperty](#sec-hasownproperty)(`globalObject`, `N`).
4.  If `hasProperty` is true, return true.
5.  Return ? [IsExtensible](#sec-isextensible-o)(`globalObject`).

##### 9.1.1.4.15 CanDeclareGlobalFunction ( `envRec`, `N` )

The abstract operation CanDeclareGlobalFunction takes arguments `envRec` (a [Global Environment Record](#sec-global-environment-records)) and `N` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It determines if a corresponding [CreateGlobalFunctionBinding](#sec-createglobalfunctionbinding) call would succeed if called for the same argument `N`. It performs the following steps when called:

1.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
2.  Let `globalObject` be `ObjRec`.`[[BindingObject]]`.
3.  Let `existingProp` be ? `globalObject`.`[[GetOwnProperty]]`(`N`).
4.  If `existingProp` is undefined, return ? [IsExtensible](#sec-isextensible-o)(`globalObject`).
5.  If `existingProp`.`[[Configurable]]` is true, return true.
6.  If [IsDataDescriptor](#sec-isdatadescriptor)(`existingProp`) is true and `existingProp` has attribute values { `[[Writable]]`: true, `[[Enumerable]]`: true }, return true.
7.  Return false.

##### 9.1.1.4.16 CreateGlobalVarBinding ( `envRec`, `N`, `D` )

The abstract operation CreateGlobalVarBinding takes arguments `envRec` (a [Global Environment Record](#sec-global-environment-records)), `N` (a String), and `D` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It creates and initializes a mutable binding in the associated [Object Environment Record](#sec-object-environment-records). If a binding already exists, it is reused and assumed to be initialized. It performs the following steps when called:

1.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
2.  Let `globalObject` be `ObjRec`.`[[BindingObject]]`.
3.  Let `hasProperty` be ? [HasOwnProperty](#sec-hasownproperty)(`globalObject`, `N`).
4.  Let `extensible` be ? [IsExtensible](#sec-isextensible-o)(`globalObject`).
5.  If `hasProperty` is false and `extensible` is true, then
    1.  Perform ? `ObjRec`.CreateMutableBinding(`N`, `D`).
    2.  Perform ? `ObjRec`.InitializeBinding(`N`, undefined).
6.  Return unused.

##### 9.1.1.4.17 CreateGlobalFunctionBinding ( `envRec`, `N`, `V`, `D` )

The abstract operation CreateGlobalFunctionBinding takes arguments `envRec` (a [Global Environment Record](#sec-global-environment-records)), `N` (a String), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `D` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It creates and initializes a mutable binding in the associated [Object Environment Record](#sec-object-environment-records). If a binding already exists, it is replaced. It performs the following steps when called:

1.  Let `ObjRec` be `envRec`.`[[ObjectRecord]]`.
2.  Let `globalObject` be `ObjRec`.`[[BindingObject]]`.
3.  Let `existingProp` be ? `globalObject`.`[[GetOwnProperty]]`(`N`).
4.  If `existingProp` is undefined or `existingProp`.`[[Configurable]]` is true, then
    1.  Let `desc` be the PropertyDescriptor { `[[Value]]`: `V`, `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: `D` }.
5.  Else,
    1.  Let `desc` be the PropertyDescriptor { `[[Value]]`: `V` }.
6.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`globalObject`, `N`, `desc`).
7.  Perform ? [Set](#sec-set-o-p-v-throw)(`globalObject`, `N`, `V`, false).
8.  Return unused.

Note

Global function declarations are always represented as own properties of the [global object](#sec-global-object). If possible, an existing own property is reconfigured to have a standard set of attribute values. Step [7](#step-createglobalfunctionbinding-set) is equivalent to what calling the InitializeBinding concrete method would do and if `globalObject` is a Proxy will produce the same sequence of Proxy trap calls.

#### 9.1.1.5 Module Environment Records

A Module Environment Record is a [Declarative Environment Record](#sec-declarative-environment-records) that is used to represent the outer scope of an ECMAScript [Module](#prod-Module). In additional to normal mutable and immutable bindings, Module Environment Records also provide immutable import bindings which are bindings that provide indirect access to a target binding that exists in another [Environment Record](#sec-environment-records).

Module Environment Records support all of the [Declarative Environment Record](#sec-declarative-environment-records) methods listed in [Table 16](#table-abstract-methods-of-environment-records) and share the same specifications for all of those methods except for GetBindingValue, DeleteBinding, HasThisBinding and GetThisBinding. In addition, Module Environment Records support the methods listed in [Table 22](#table-additional-methods-of-module-environment-records):

| Method | Purpose |
|----|----|
| GetThisBinding() | Return the value of this [Environment Record](#sec-environment-records)'s `this` binding. |

Table 22: Additional Methods of [Module Environment Records](#sec-module-environment-records)

##### 9.1.1.5.1 GetBindingValue ( `N`, `S` )

The GetBindingValue concrete method of a [Module Environment Record](#sec-module-environment-records) `envRec` takes arguments `N` (a String) and `S` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It returns the value of its bound identifier whose name is `N`. However, if the binding is an indirect binding the value of the target binding is returned. If the binding exists but is uninitialized a ReferenceError is thrown. It performs the following steps when called:

1.  [Assert](#assert): `S` is true.
2.  [Assert](#assert): `envRec` has a binding for `N`.
3.  If the binding for `N` is an indirect binding, then
    1.  Let `M` and `N2` be the indirection values provided when this binding for `N` was created.
    2.  Let `targetEnv` be `M`.`[[Environment]]`.
    3.  If `targetEnv` is empty, throw a ReferenceError exception.
    4.  Return ? `targetEnv`.GetBindingValue(`N2`, true).
4.  If the binding for `N` in `envRec` is an uninitialized binding, throw a ReferenceError exception.
5.  Return the value currently bound to `N` in `envRec`.

Note

`S` will always be true because a [Module](#prod-Module) is always [strict mode code](#sec-strict-mode-code).

##### 9.1.1.5.2 DeleteBinding ( `N` )

The DeleteBinding concrete method of a [Module Environment Record](#sec-module-environment-records) is never used within this specification.

Note

[Module Environment Records](#sec-module-environment-records) are only used within strict code and an [early error](#early-error) rule prevents the delete operator, in strict code, from being applied to a [Reference Record](#sec-reference-record-specification-type) that would resolve to a [Module Environment Record](#sec-module-environment-records) binding. See [13.5.1.1](#sec-delete-operator-static-semantics-early-errors).

##### 9.1.1.5.3 HasThisBinding ( )

The HasThisBinding concrete method of a [Module Environment Record](#sec-module-environment-records) `envRec` takes no arguments and returns true. It performs the following steps when called:

1.  Return true.

Note

[Module Environment Records](#sec-module-environment-records) always provide a `this` binding.

##### 9.1.1.5.4 GetThisBinding ( )

The GetThisBinding concrete method of a [Module Environment Record](#sec-module-environment-records) `envRec` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) undefined. It performs the following steps when called:

1.  Return undefined.

##### 9.1.1.5.5 CreateImportBinding ( `envRec`, `N`, `M`, `N2` )

The abstract operation CreateImportBinding takes arguments `envRec` (a [Module Environment Record](#sec-module-environment-records)), `N` (a String), `M` (a [Module Record](#sec-abstract-module-records)), and `N2` (a String) and returns unused. It creates a new initialized immutable indirect binding for the name `N`. A binding must not already exist in `envRec` for `N`. `N2` is the name of a binding that exists in `M`'s [Module Environment Record](#sec-module-environment-records). Accesses to the value of the new binding will indirectly access the bound value of the target binding. It performs the following steps when called:

1.  [Assert](#assert): `envRec` does not already have a binding for `N`.
2.  [Assert](#assert): When `M`.`[[Environment]]` is instantiated, it will have a direct binding for `N2`.
3.  Create an immutable indirect binding in `envRec` for `N` that references `M` and `N2` as its target binding and record that the binding is initialized.
4.  Return unused.

### 9.1.2 Environment Record Operations

The following [abstract operations](#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon [Environment Records](#sec-environment-records):

#### 9.1.2.1 GetIdentifierReference ( `env`, `name`, `strict` )

The abstract operation GetIdentifierReference takes arguments `env` (an [Environment Record](#sec-environment-records) or null), `name` (a String), and `strict` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Reference Record](#sec-reference-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `env` is null, then
    1.  Return the [Reference Record](#sec-reference-record-specification-type) { `[[Base]]`: unresolvable, `[[ReferencedName]]`: `name`, `[[Strict]]`: `strict`, `[[ThisValue]]`: empty }.
2.  Let `exists` be ? `env`.HasBinding(`name`).
3.  If `exists` is true, then
    1.  Return the [Reference Record](#sec-reference-record-specification-type) { `[[Base]]`: `env`, `[[ReferencedName]]`: `name`, `[[Strict]]`: `strict`, `[[ThisValue]]`: empty }.
4.  Else,
    1.  Let `outer` be `env`.`[[OuterEnv]]`.
    2.  Return ? [GetIdentifierReference](#sec-getidentifierreference)(`outer`, `name`, `strict`).

#### 9.1.2.2 NewDeclarativeEnvironment ( `E` )

The abstract operation NewDeclarativeEnvironment takes argument `E` (an [Environment Record](#sec-environment-records) or null) and returns a [Declarative Environment Record](#sec-declarative-environment-records). It performs the following steps when called:

1.  Let `env` be a new [Declarative Environment Record](#sec-declarative-environment-records) containing no bindings.
2.  Set `env`.`[[OuterEnv]]` to `E`.
3.  Return `env`.

#### 9.1.2.3 NewObjectEnvironment ( `O`, `W`, `E` )

The abstract operation NewObjectEnvironment takes arguments `O` (an Object), `W` (a Boolean), and `E` (an [Environment Record](#sec-environment-records) or null) and returns an [Object Environment Record](#sec-object-environment-records). It performs the following steps when called:

1.  Let `env` be a new [Object Environment Record](#sec-object-environment-records).
2.  Set `env`.`[[BindingObject]]` to `O`.
3.  Set `env`.`[[IsWithEnvironment]]` to `W`.
4.  Set `env`.`[[OuterEnv]]` to `E`.
5.  Return `env`.

#### 9.1.2.4 NewFunctionEnvironment ( `F`, `newTarget` )

The abstract operation NewFunctionEnvironment takes arguments `F` (an ECMAScript [function object](#function-object)) and `newTarget` (an Object or undefined) and returns a [Function Environment Record](#sec-function-environment-records). It performs the following steps when called:

1.  Let `env` be a new [Function Environment Record](#sec-function-environment-records) containing no bindings.
2.  Set `env`.`[[FunctionObject]]` to `F`.
3.  If `F`.`[[ThisMode]]` is lexical, set `env`.`[[ThisBindingStatus]]` to lexical.
4.  Else, set `env`.`[[ThisBindingStatus]]` to uninitialized.
5.  Set `env`.`[[NewTarget]]` to `newTarget`.
6.  Set `env`.`[[OuterEnv]]` to `F`.`[[Environment]]`.
7.  Return `env`.

#### 9.1.2.5 NewGlobalEnvironment ( `G`, `thisValue` )

The abstract operation NewGlobalEnvironment takes arguments `G` (an Object) and `thisValue` (an Object) and returns a [Global Environment Record](#sec-global-environment-records). It performs the following steps when called:

1.  Let `objRec` be [NewObjectEnvironment](#sec-newobjectenvironment)(`G`, false, null).
2.  Let `dclRec` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(null).
3.  Let `env` be a new [Global Environment Record](#sec-global-environment-records).
4.  Set `env`.`[[ObjectRecord]]` to `objRec`.
5.  Set `env`.`[[GlobalThisValue]]` to `thisValue`.
6.  Set `env`.`[[DeclarativeRecord]]` to `dclRec`.
7.  Set `env`.`[[OuterEnv]]` to null.
8.  Return `env`.

#### 9.1.2.6 NewModuleEnvironment ( `E` )

The abstract operation NewModuleEnvironment takes argument `E` (an [Environment Record](#sec-environment-records)) and returns a [Module Environment Record](#sec-module-environment-records). It performs the following steps when called:

1.  Let `env` be a new [Module Environment Record](#sec-module-environment-records) containing no bindings.
2.  Set `env`.`[[OuterEnv]]` to `E`.
3.  Return `env`.

## 9.2 PrivateEnvironment Records

A PrivateEnvironment Record is a specification mechanism used to track [Private Names](#sec-private-names) based upon the lexical nesting structure of [ClassDeclaration](#prod-ClassDeclaration)s and [ClassExpression](#prod-ClassExpression)s in ECMAScript code. They are similar to, but distinct from, [Environment Records](#sec-environment-records). Each [PrivateEnvironment Record](#privateenvironment-record) is associated with a [ClassDeclaration](#prod-ClassDeclaration) or [ClassExpression](#prod-ClassExpression). Each time such a class is evaluated, a new [PrivateEnvironment Record](#privateenvironment-record) is created to record the [Private Names](#sec-private-names) declared by that class.

Each [PrivateEnvironment Record](#privateenvironment-record) has the fields defined in [Table 23](#table-privateenvironment-records).

| Field Name | Value Type | Meaning |
|----|----|----|
| `[[OuterPrivateEnvironment]]` | a [PrivateEnvironment Record](#privateenvironment-record) or null | The [PrivateEnvironment Record](#privateenvironment-record) of the nearest containing class. null if the class with which this [PrivateEnvironment Record](#privateenvironment-record) is associated is not contained in any other class. |
| `[[Names]]` | a [List](#sec-list-and-record-specification-type) of [Private Names](#sec-private-names) | The [Private Names](#sec-private-names) declared by this class. |

Table 23: [PrivateEnvironment Record](#privateenvironment-record) Fields

### 9.2.1 PrivateEnvironment Record Operations

The following [abstract operations](#sec-algorithm-conventions-abstract-operations) are used in this specification to operate upon [PrivateEnvironment Records](#privateenvironment-record):

#### 9.2.1.1 NewPrivateEnvironment ( `outerPrivateEnv` )

The abstract operation NewPrivateEnvironment takes argument `outerPrivateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns a [PrivateEnvironment Record](#privateenvironment-record). It performs the following steps when called:

1.  Let `names` be a new empty [List](#sec-list-and-record-specification-type).
2.  Return the [PrivateEnvironment Record](#privateenvironment-record) { `[[OuterPrivateEnvironment]]`: `outerPrivateEnv`, `[[Names]]`: `names` }.

#### 9.2.1.2 ResolvePrivateIdentifier ( `privateEnv`, `identifier` )

The abstract operation ResolvePrivateIdentifier takes arguments `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record)) and `identifier` (a String) and returns a [Private Name](#sec-private-names). It performs the following steps when called:

1.  Let `names` be `privateEnv`.`[[Names]]`.
2.  For each [Private Name](#sec-private-names) `pn` of `names`, do
    1.  If `pn`.`[[Description]]` is `identifier`, then
        1.  Return `pn`.
3.  Let `outerPrivateEnv` be `privateEnv`.`[[OuterPrivateEnvironment]]`.
4.  [Assert](#assert): `outerPrivateEnv` is not null.
5.  Return [ResolvePrivateIdentifier](#sec-resolve-private-identifier)(`outerPrivateEnv`, `identifier`).

## 9.3 Realms

Before it is evaluated, all ECMAScript code must be associated with a realm. Conceptually, a [realm](#realm) consists of a set of intrinsic objects, an ECMAScript global environment, all of the ECMAScript code that is loaded within the scope of that global environment, and other associated state and resources.

A [realm](#realm) is represented in this specification as a Realm Record with the fields specified in [Table 24](#table-realm-record-fields):

[TABLE]

Table 24: [Realm Record](#realm-record) Fields

### 9.3.1 InitializeHostDefinedRealm ( )

The abstract operation InitializeHostDefinedRealm takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `realm` be a new [Realm Record](#realm-record).
2.  Perform [CreateIntrinsics](#sec-createintrinsics)(`realm`).
3.  Set `realm`.`[[AgentSignifier]]` to [AgentSignifier](#sec-agentsignifier)().
4.  Set `realm`.`[[TemplateMap]]` to a new empty [List](#sec-list-and-record-specification-type).
5.  Let `newContext` be a new [execution context](#sec-execution-contexts).
6.  Set the Function of `newContext` to null.
7.  Set the [Realm](#realm) of `newContext` to `realm`.
8.  Set the ScriptOrModule of `newContext` to null.
9.  Push `newContext` onto the [execution context stack](#execution-context-stack); `newContext` is now the [running execution context](#running-execution-context).
10. If the [host](#host) requires use of an [exotic object](#exotic-object) to serve as `realm`'s [global object](#sec-global-object), then
    1.  Let `global` be such an object created in a [host-defined](#host-defined) manner.
11. Else,
    1.  Let `global` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`realm`.`[[Intrinsics]]`.\[\[[%Object.prototype%](#sec-properties-of-the-object-prototype-object)\]\]).
12. If the [host](#host) requires that the `this` binding in `realm`'s global scope return an object other than the [global object](#sec-global-object), then
    1.  Let `thisValue` be such an object created in a [host-defined](#host-defined) manner.
13. Else,
    1.  Let `thisValue` be `global`.
14. Set `realm`.`[[GlobalObject]]` to `global`.
15. Set `realm`.`[[GlobalEnv]]` to [NewGlobalEnvironment](#sec-newglobalenvironment)(`global`, `thisValue`).
16. Perform ? [SetDefaultGlobalBindings](#sec-setdefaultglobalbindings)(`realm`).
17. Create any [host-defined](#host-defined) [global object](#sec-global-object) properties on `global`.
18. Return unused.

### 9.3.2 CreateIntrinsics ( `realmRec` )

The abstract operation CreateIntrinsics takes argument `realmRec` (a [Realm Record](#realm-record)) and returns unused. It performs the following steps when called:

1.  Set `realmRec`.`[[Intrinsics]]` to a new [Record](#sec-list-and-record-specification-type).
2.  Set fields of `realmRec`.`[[Intrinsics]]` with the values listed in [Table 6](#table-well-known-intrinsic-objects). The field names are the names listed in column one of the table. The value of each field is a new object value fully and recursively populated with property values as defined by the specification of each object in clauses [19](#sec-global-object) through [28](#sec-reflection). All object property values are newly created object values. All values that are built-in [function objects](#function-object) are created by performing [CreateBuiltinFunction](#sec-createbuiltinfunction)(`steps`, `length`, `name`, `slots`, `realmRec`, `prototype`) where `steps` is the definition of that function provided by this specification, `name` is the initial value of the function's "name" property, `length` is the initial value of the function's "length" property, `slots` is a list of the names, if any, of the function's specified internal slots, and `prototype` is the specified value of the function's `[[Prototype]]` internal slot. The creation of the intrinsics and their properties must be ordered to avoid any dependencies upon objects that have not yet been created.
3.  Perform [AddRestrictedFunctionProperties](#sec-addrestrictedfunctionproperties)(`realmRec`.`[[Intrinsics]]`.\[\[[%Function.prototype%](#sec-properties-of-the-function-prototype-object)\]\], `realmRec`).
4.  Return unused.

### 9.3.3 SetDefaultGlobalBindings ( `realmRec` )

The abstract operation SetDefaultGlobalBindings takes argument `realmRec` (a [Realm Record](#realm-record)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `global` be `realmRec`.`[[GlobalObject]]`.
2.  For each property of the Global Object specified in clause [19](#sec-global-object), do
    1.  Let `name` be the String value of the [property name](#property-name).
    2.  Let `desc` be the fully populated data [Property Descriptor](#sec-property-descriptor-specification-type) for the property, containing the specified attributes for the property. For properties listed in [19.2](#sec-function-properties-of-the-global-object), [19.3](#sec-constructor-properties-of-the-global-object), or [19.4](#sec-other-properties-of-the-global-object) the value of the `[[Value]]` attribute is the corresponding intrinsic object from `realmRec`.
    3.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`global`, `name`, `desc`).
3.  Return unused.

## 9.4 Execution Contexts

An execution context is a specification device that is used to track the runtime evaluation of code by an ECMAScript implementation. At any point in time, there is at most one execution context per [agent](#agent) that is actually executing code. This is known as the [agent](#agent)'s running execution context. All references to the [running execution context](#running-execution-context) in this specification denote the [running execution context](#running-execution-context) of the [surrounding agent](#surrounding-agent).

The execution context stack is used to track execution contexts. The [running execution context](#running-execution-context) is always the top element of this stack. A new execution context is created whenever control is transferred from the executable code associated with the currently [running execution context](#running-execution-context) to executable code that is not associated with that execution context. The newly created execution context is pushed onto the stack and becomes the [running execution context](#running-execution-context).

An execution context contains whatever implementation specific state is necessary to track the execution progress of its associated code. Each execution context has at least the state components listed in [Table 25](#table-state-components-for-all-execution-contexts).

| Component | Purpose |
|----|----|
| code evaluation state | Any state needed to perform, suspend, and resume evaluation of the code associated with this [execution context](#sec-execution-contexts). |
| Function | If this [execution context](#sec-execution-contexts) is evaluating the code of a [function object](#function-object), then the value of this component is that [function object](#function-object). If the context is evaluating the code of a [Script](#prod-Script) or [Module](#prod-Module), the value is null. |
| [Realm](#realm) | The [Realm Record](#realm-record) from which associated code accesses ECMAScript resources. |
| ScriptOrModule | The [Module Record](#sec-abstract-module-records) or [Script Record](#script-record) from which associated code originates. If there is no originating script or module, as is the case for the original [execution context](#sec-execution-contexts) created in [InitializeHostDefinedRealm](#sec-initializehostdefinedrealm), the value is null. |

Table 25: State Components for All Execution Contexts

[Evaluation](#sec-evaluation) of code by the [running execution context](#running-execution-context) may be suspended at various points defined within this specification. Once the [running execution context](#running-execution-context) has been suspended a different execution context may become the [running execution context](#running-execution-context) and commence evaluating its code. At some later time a suspended execution context may again become the [running execution context](#running-execution-context) and continue evaluating its code at the point where it had previously been suspended. Transition of the [running execution context](#running-execution-context) status among execution contexts usually occurs in stack-like last-in/first-out manner. However, some ECMAScript features require non-LIFO transitions of the [running execution context](#running-execution-context).

The value of the [Realm](#realm) component of the [running execution context](#running-execution-context) is also called the current Realm Record. The value of the Function component of the [running execution context](#running-execution-context) is also called the active function object.

ECMAScript code execution contexts have the additional state components listed in [Table 26](#table-additional-state-components-for-ecmascript-code-execution-contexts).

| Component | Purpose |
|----|----|
| LexicalEnvironment | Identifies the [Environment Record](#sec-environment-records) used to resolve identifier references made by code within this [execution context](#sec-execution-contexts). |
| VariableEnvironment | Identifies the [Environment Record](#sec-environment-records) that holds bindings created by [VariableStatement](#prod-VariableStatement)s within this [execution context](#sec-execution-contexts). |
| PrivateEnvironment | Identifies the [PrivateEnvironment Record](#privateenvironment-record) that holds [Private Names](#sec-private-names) created by [ClassElement](#prod-ClassElement)s in the nearest containing class. null if there is no containing class. |

Table 26: Additional State Components for ECMAScript Code Execution Contexts

The LexicalEnvironment and VariableEnvironment components of an execution context are always [Environment Records](#sec-environment-records).

Execution contexts representing the evaluation of Generators have the additional state components listed in [Table 27](#table-additional-state-components-for-generator-execution-contexts).

| Component | Purpose |
|----|----|
| Generator | The Generator that this [execution context](#sec-execution-contexts) is evaluating. |

Table 27: Additional State Components for Generator Execution Contexts

In most situations only the [running execution context](#running-execution-context) (the top of the [execution context stack](#execution-context-stack)) is directly manipulated by algorithms within this specification. Hence when the terms “LexicalEnvironment”, and “VariableEnvironment” are used without qualification they are in reference to those components of the [running execution context](#running-execution-context).

An execution context is purely a specification mechanism and need not correspond to any particular artefact of an ECMAScript implementation. It is impossible for ECMAScript code to directly access or observe an execution context.

### 9.4.1 GetActiveScriptOrModule ( )

The abstract operation GetActiveScriptOrModule takes no arguments and returns a [Script Record](#script-record), a [Module Record](#sec-abstract-module-records), or null. It is used to determine the running script or module, based on the [running execution context](#running-execution-context). It performs the following steps when called:

1.  If the [execution context stack](#execution-context-stack) is empty, return null.
2.  Let `ec` be the topmost [execution context](#sec-execution-contexts) on the [execution context stack](#execution-context-stack) whose ScriptOrModule component is not null.
3.  If no such [execution context](#sec-execution-contexts) exists, return null. Otherwise, return `ec`'s ScriptOrModule.

### 9.4.2 ResolveBinding ( `name` \[ , `env` \] )

The abstract operation ResolveBinding takes argument `name` (a String) and optional argument `env` (an [Environment Record](#sec-environment-records) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Reference Record](#sec-reference-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It is used to determine the binding of `name`. `env` can be used to explicitly provide the [Environment Record](#sec-environment-records) that is to be searched for the binding. It performs the following steps when called:

1.  If `env` is not present or `env` is undefined, then
    1.  Set `env` to the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  [Assert](#assert): `env` is an [Environment Record](#sec-environment-records).
3.  Let `strict` be [IsStrict](#sec-isstrict)(the syntactic production that is being evaluated).
4.  Return ? [GetIdentifierReference](#sec-getidentifierreference)(`env`, `name`, `strict`).

Note

The result of ResolveBinding is always a [Reference Record](#sec-reference-record-specification-type) whose `[[ReferencedName]]` field is `name`.

### 9.4.3 GetThisEnvironment ( )

The abstract operation GetThisEnvironment takes no arguments and returns an [Environment Record](#sec-environment-records). It finds the [Environment Record](#sec-environment-records) that currently supplies the binding of the [keyword](#sec-keywords-and-reserved-words) `this`. It performs the following steps when called:

1.  Let `env` be the [running execution context](#running-execution-context)'s LexicalEnvironment.
2.  Repeat,
    1.  Let `exists` be `env`.HasThisBinding().
    2.  If `exists` is true, return `env`.
    3.  Let `outer` be `env`.`[[OuterEnv]]`.
    4.  [Assert](#assert): `outer` is not null.
    5.  Set `env` to `outer`.

Note

The loop in step [2](#step-getthisenvironment-loop) will always terminate because the list of environments always ends with the global environment which has a `this` binding.

### 9.4.4 ResolveThisBinding ( )

The abstract operation ResolveThisBinding takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It determines the binding of the [keyword](#sec-keywords-and-reserved-words) `this` using the LexicalEnvironment of the [running execution context](#running-execution-context). It performs the following steps when called:

1.  Let `envRec` be [GetThisEnvironment](#sec-getthisenvironment)().
2.  Return ? `envRec`.GetThisBinding().

### 9.4.5 GetNewTarget ( )

The abstract operation GetNewTarget takes no arguments and returns an Object or undefined. It determines the NewTarget value using the LexicalEnvironment of the [running execution context](#running-execution-context). It performs the following steps when called:

1.  Let `envRec` be [GetThisEnvironment](#sec-getthisenvironment)().
2.  [Assert](#assert): `envRec` has a `[[NewTarget]]` field.
3.  Return `envRec`.`[[NewTarget]]`.

### 9.4.6 GetGlobalObject ( )

The abstract operation GetGlobalObject takes no arguments and returns an Object. It returns the [global object](#sec-global-object) used by the currently [running execution context](#running-execution-context). It performs the following steps when called:

1.  Let `currentRealm` be [the current Realm Record](#current-realm).
2.  Return `currentRealm`.`[[GlobalObject]]`.

## 9.5 Jobs and Host Operations to Enqueue Jobs

A Job is an [Abstract Closure](#sec-abstract-closure) with no parameters that initiates an ECMAScript computation when no other ECMAScript computation is currently in progress.

[Jobs](#job) are scheduled for execution by ECMAScript [host environments](#host-environment) in a particular [agent](#agent). This specification describes the [host hooks](#host-hook) [HostEnqueueGenericJob](#sec-hostenqueuegenericjob), [HostEnqueueFinalizationRegistryCleanupJob](#sec-host-cleanup-finalization-registry), [HostEnqueuePromiseJob](#sec-hostenqueuepromisejob), and [HostEnqueueTimeoutJob](#sec-hostenqueuetimeoutjob) to schedule jobs. The [host hooks](#host-hook) in this specification are organized by the additional constraints imposed on the scheduling of jobs. [Hosts](#host) may define additional [abstract operations](#sec-algorithm-conventions-abstract-operations) which schedule jobs. Such operations accept a [Job](#job) [Abstract Closure](#sec-abstract-closure) and a [realm](#realm) (a [Realm Record](#realm-record) or null) as parameters. If a [Realm Record](#realm-record) is provided, these operations schedule the job to be performed at some future time in the provided [realm](#realm), in the [agent](#agent) that owns the [realm](#realm). If null is provided instead for the [realm](#realm), then the job does not evaluate ECMAScript code. Their implementations must conform to the following requirements:

- At some future point in time, when there is no running context in the [agent](#agent) for which the job is scheduled and that [agent](#agent)'s [execution context stack](#execution-context-stack) is empty, the implementation must:
  1.  Perform any [host-defined](#host-defined) preparation steps.
  2.  Invoke the [Job](#job) [Abstract Closure](#sec-abstract-closure).
  3.  Perform any [host-defined](#host-defined) cleanup steps, after which the [execution context stack](#execution-context-stack) must be empty.
- Only one [Job](#job) may be actively undergoing evaluation at any point in time in an [agent](#agent).
- Once evaluation of a [Job](#job) starts, it must run to completion before evaluation of any other [Job](#job) starts in an [agent](#agent).
- The [Abstract Closure](#sec-abstract-closure) must return a [normal completion](#sec-completion-record-specification-type), implementing its own handling of errors.

Note 1

[Host environments](#host-environment) are not required to treat [Jobs](#job) uniformly with respect to scheduling. For example, web browsers and Node.js treat Promise-handling [Jobs](#job) as a higher priority than other work; future features may add [Jobs](#job) that are not treated at such a high priority.

At any particular time, `scriptOrModule` (a [Script Record](#script-record), a [Module Record](#sec-abstract-module-records), or null) is the active script or module if all of the following conditions are true:

- [GetActiveScriptOrModule](#sec-getactivescriptormodule)() is `scriptOrModule`.
- If `scriptOrModule` is a [Script Record](#script-record) or [Module Record](#sec-abstract-module-records), let `ec` be the topmost [execution context](#sec-execution-contexts) on the [execution context stack](#execution-context-stack) whose ScriptOrModule component is `scriptOrModule`. The [Realm](#realm) component of `ec` is `scriptOrModule`.`[[Realm]]`.

At any particular time, an execution is prepared to evaluate ECMAScript code if all of the following conditions are true:

- The [execution context stack](#execution-context-stack) is not empty.
- The [Realm](#realm) component of the topmost [execution context](#sec-execution-contexts) on the [execution context stack](#execution-context-stack) is a [Realm Record](#realm-record).

Note 2

[Host environments](#host-environment) may prepare an execution to evaluate code by pushing [execution contexts](#sec-execution-contexts) onto the [execution context stack](#execution-context-stack). The specific steps are [implementation-defined](#implementation-defined).

The specific choice of [Realm](#realm) is up to the [host environment](#host-environment). This initial [execution context](#sec-execution-contexts) and [Realm](#realm) is only in use before any callback function is invoked. When a callback function related to a [Job](#job), like a Promise handler, is invoked, the invocation pushes its own [execution context](#sec-execution-contexts) and [Realm](#realm).

Particular kinds of [Jobs](#job) have additional conformance requirements.

### 9.5.1 JobCallback Records

A JobCallback Record is a [Record](#sec-list-and-record-specification-type) value used to store a [function object](#function-object) and a [host-defined](#host-defined) value. [Function objects](#function-object) that are invoked via a [Job](#job) enqueued by the [host](#host) may have additional [host-defined](#host-defined) context. To propagate the state, [Job](#job) [Abstract Closures](#sec-abstract-closure) should not capture and call [function objects](#function-object) directly. Instead, use [HostMakeJobCallback](#sec-hostmakejobcallback) and [HostCallJobCallback](#sec-hostcalljobcallback).

Note

The WHATWG HTML specification (<https://html.spec.whatwg.org/>), for example, uses the [host-defined](#host-defined) value to propagate the incumbent settings object for Promise callbacks.

JobCallback Records have the fields listed in [Table 28](#table-jobcallback-records).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Callback]]` | a [function object](#function-object) | The function to invoke when the [Job](#job) is invoked. |
| `[[HostDefined]]` | anything (default value is empty) | Field reserved for use by [hosts](#host). |

Table 28: [JobCallback Record](#sec-jobcallback-records) Fields

### 9.5.2 HostMakeJobCallback ( `callback` )

The [host-defined](#host-defined) abstract operation HostMakeJobCallback takes argument `callback` (a [function object](#function-object)) and returns a [JobCallback Record](#sec-jobcallback-records).

An implementation of HostMakeJobCallback must conform to the following requirements:

- It must return a [JobCallback Record](#sec-jobcallback-records) whose `[[Callback]]` field is `callback`.

The default implementation of HostMakeJobCallback performs the following steps when called:

1.  Return the [JobCallback Record](#sec-jobcallback-records) { `[[Callback]]`: `callback`, `[[HostDefined]]`: empty }.

ECMAScript [hosts](#host) that are not web browsers must use the default implementation of HostMakeJobCallback.

Note

This is called at the time that the callback is passed to the function that is responsible for its being eventually scheduled and run. For example, `promise.then(thenAction)` calls MakeJobCallback on `thenAction` at the time of invoking `Promise.prototype.then`, not at the time of scheduling the reaction [Job](#job).

### 9.5.3 HostCallJobCallback ( `jobCallback`, `V`, `argumentsList` )

The [host-defined](#host-defined) abstract operation HostCallJobCallback takes arguments `jobCallback` (a [JobCallback Record](#sec-jobcallback-records)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type).

An implementation of HostCallJobCallback must conform to the following requirements:

- It must perform and return the result of [Call](#sec-call)(`jobCallback`.`[[Callback]]`, `V`, `argumentsList`).

Note

This requirement means that [hosts](#host) cannot change the `[[Call]]` behaviour of [function objects](#function-object) defined in this specification.

The default implementation of HostCallJobCallback performs the following steps when called:

1.  [Assert](#assert): [IsCallable](#sec-iscallable)(`jobCallback`.`[[Callback]]`) is true.
2.  Return ? [Call](#sec-call)(`jobCallback`.`[[Callback]]`, `V`, `argumentsList`).

ECMAScript [hosts](#host) that are not web browsers must use the default implementation of HostCallJobCallback.

### 9.5.4 HostEnqueueGenericJob ( `job`, `realm` )

The [host-defined](#host-defined) abstract operation HostEnqueueGenericJob takes arguments `job` (a [Job](#job) [Abstract Closure](#sec-abstract-closure)) and `realm` (a [Realm Record](#realm-record)) and returns unused. It schedules `job` in the [realm](#realm) `realm` in the [agent](#agent) signified by `realm`.`[[AgentSignifier]]` to be performed at some future time. The [Abstract Closures](#sec-abstract-closure) used with this algorithm are intended to be scheduled without additional constraints, such as priority and ordering.

An implementation of HostEnqueueGenericJob must conform to the requirements in [9.5](#sec-jobs).

### 9.5.5 HostEnqueuePromiseJob ( `job`, `realm` )

The [host-defined](#host-defined) abstract operation HostEnqueuePromiseJob takes arguments `job` (a [Job](#job) [Abstract Closure](#sec-abstract-closure)) and `realm` (a [Realm Record](#realm-record) or null) and returns unused. It schedules `job` to be performed at some future time. The [Abstract Closures](#sec-abstract-closure) used with this algorithm are intended to be related to the handling of Promises, or otherwise, to be scheduled with equal priority to Promise handling operations.

An implementation of HostEnqueuePromiseJob must conform to the requirements in [9.5](#sec-jobs) as well as the following:

- If `realm` is not null, each time `job` is invoked the implementation must perform [implementation-defined](#implementation-defined) steps such that execution is [prepared to evaluate ECMAScript code](#job-preparedtoevaluatecode) at the time of `job`'s invocation.
- Let `scriptOrModule` be [GetActiveScriptOrModule](#sec-getactivescriptormodule)() at the time HostEnqueuePromiseJob is invoked. If `realm` is not null, each time `job` is invoked the implementation must perform [implementation-defined](#implementation-defined) steps such that `scriptOrModule` is the [active script or module](#job-activescriptormodule) at the time of `job`'s invocation.
- [Jobs](#job) must run in the same order as the HostEnqueuePromiseJob invocations that scheduled them.

Note

The `realm` for [Jobs](#job) returned by [NewPromiseResolveThenableJob](#sec-newpromiseresolvethenablejob) is usually the result of calling [GetFunctionRealm](#sec-getfunctionrealm) on the `then` [function object](#function-object). The `realm` for [Jobs](#job) returned by [NewPromiseReactionJob](#sec-newpromisereactionjob) is usually the result of calling [GetFunctionRealm](#sec-getfunctionrealm) on the handler if the handler is not undefined. If the handler is undefined, `realm` is null. For both kinds of [Jobs](#job), when [GetFunctionRealm](#sec-getfunctionrealm) completes abnormally (i.e. called on a revoked Proxy), `realm` is [the current Realm Record](#current-realm) at the time of the [GetFunctionRealm](#sec-getfunctionrealm) call. When the `realm` is null, no user ECMAScript code will be evaluated and no new ECMAScript objects (e.g. Error objects) will be created. The WHATWG HTML specification (<https://html.spec.whatwg.org/>), for example, uses `realm` to check for the ability to run script and for the [entry](https://html.spec.whatwg.org/#entry) concept.

### 9.5.6 HostEnqueueTimeoutJob ( `timeoutJob`, `realm`, `milliseconds` )

The [host-defined](#host-defined) abstract operation HostEnqueueTimeoutJob takes arguments `timeoutJob` (a [Job](#job) [Abstract Closure](#sec-abstract-closure)), `realm` (a [Realm Record](#realm-record)), and `milliseconds` (a non-negative [finite](#finite) Number) and returns unused. It schedules `timeoutJob` in the [realm](#realm) `realm` in the [agent](#agent) signified by `realm`.`[[AgentSignifier]]` to be performed after at least `milliseconds` milliseconds.

An implementation of HostEnqueueTimeoutJob must conform to the requirements in [9.5](#sec-jobs).

## 9.6 Agents

An agent comprises a set of ECMAScript [execution contexts](#sec-execution-contexts), an [execution context stack](#execution-context-stack), a [running execution context](#running-execution-context), an Agent Record, and an executing thread. Except for the [executing thread](#executing-thread), the constituents of an [agent](#agent) belong exclusively to that [agent](#agent).

An [agent](#agent)'s [executing thread](#executing-thread) executes algorithmic steps on the [agent](#agent)'s [execution contexts](#sec-execution-contexts) independently of other [agents](#agent), except that an [executing thread](#executing-thread) may be used as the [executing thread](#executing-thread) by multiple [agents](#agent), provided none of the [agents](#agent) sharing the thread have an [Agent Record](#agent-record) whose `[[CanBlock]]` field is true.

Note 1

Some web browsers share a single [executing thread](#executing-thread) across multiple unrelated tabs of a browser window, for example.

While an [agent](#agent)'s [executing thread](#executing-thread) is executing algorithmic steps, the [agent](#agent) is the surrounding agent for those steps. The steps use the [surrounding agent](#surrounding-agent) to access the specification-level execution objects held within the [agent](#agent): the [running execution context](#running-execution-context), the [execution context stack](#execution-context-stack), and the [Agent Record](#agent-record)'s fields.

An agent signifier is a globally-unique opaque value used to identify an [Agent](#agent).

| Field Name | Value | Meaning |
|----|----|----|
| `[[LittleEndian]]` | a Boolean | The default value computed for the *isLittleEndian* parameter when it is needed by the algorithms [GetValueFromBuffer](#sec-getvaluefrombuffer) and [SetValueInBuffer](#sec-setvalueinbuffer). The choice is [implementation-defined](#implementation-defined) and should be the alternative that is most efficient for the implementation. Once the value has been observed it cannot change. |
| `[[CanBlock]]` | a Boolean | Determines whether the [agent](#agent) can block or not. |
| `[[Signifier]]` | an [agent signifier](#sec-agents) | Uniquely identifies the [agent](#agent) within its [agent cluster](#sec-agent-clusters). |
| `[[IsLockFree1]]` | a Boolean | true if atomic operations on one-byte values are lock-free, false otherwise. |
| `[[IsLockFree2]]` | a Boolean | true if atomic operations on two-byte values are lock-free, false otherwise. |
| `[[IsLockFree8]]` | a Boolean | true if atomic operations on eight-byte values are lock-free, false otherwise. |
| `[[CandidateExecution]]` | a [candidate execution](#sec-candidate-executions) [Record](#sec-list-and-record-specification-type) | See the [memory model](#sec-memory-model). |
| `[[KeptAlive]]` | a [List](#sec-list-and-record-specification-type) of either Objects or Symbols | Initially a new empty [List](#sec-list-and-record-specification-type), representing the list of objects and/or symbols to be kept alive until the end of the current [Job](#job) |
| `[[ModuleAsyncEvaluationCount]]` | an [integer](#integer) | Initially 0, used to assign unique incrementing values to the `[[AsyncEvaluationOrder]]` field of modules that are asynchronous or have asynchronous dependencies. |

Table 29: [Agent Record](#agent-record) Fields

Once the values of `[[Signifier]]`, `[[IsLockFree1]]`, and `[[IsLockFree2]]` have been observed by any [agent](#agent) in the [agent cluster](#sec-agent-clusters) they cannot change.

Note 2

The values of `[[IsLockFree1]]` and `[[IsLockFree2]]` are not necessarily determined by the hardware, but may also reflect implementation choices that can vary over time and between ECMAScript implementations.

There is no `[[IsLockFree4]]` field: 4-byte atomic operations are always lock-free.

In practice, if an atomic operation is implemented with any type of lock the operation is not lock-free. Lock-free does not imply wait-free: there is no upper bound on how many machine steps may be required to complete a lock-free atomic operation.

That an atomic access of size *n* is lock-free does not imply anything about the (perceived) atomicity of non-atomic accesses of size *n*, specifically, non-atomic accesses may still be performed as a sequence of several separate memory accesses. See [ReadSharedMemory](#sec-memory-model-fundamentals) and [WriteSharedMemory](#sec-memory-model-fundamentals) for details.

Note 3

An [agent](#agent) is a specification mechanism and need not correspond to any particular artefact of an ECMAScript implementation.

### 9.6.1 AgentSignifier ( )

The abstract operation AgentSignifier takes no arguments and returns an [agent signifier](#sec-agents). It performs the following steps when called:

1.  Let `AR` be the [Agent Record](#agent-record) of the [surrounding agent](#surrounding-agent).
2.  Return `AR`.`[[Signifier]]`.

### 9.6.2 AgentCanSuspend ( )

The abstract operation AgentCanSuspend takes no arguments and returns a Boolean. It performs the following steps when called:

1.  Let `AR` be the [Agent Record](#agent-record) of the [surrounding agent](#surrounding-agent).
2.  Return `AR`.`[[CanBlock]]`.

Note

In some environments it may not be reasonable for a given [agent](#agent) to suspend. For example, in a web browser environment, it may be reasonable to disallow suspending a document's main event handling thread, while still allowing workers' event handling threads to suspend.

### 9.6.3 IncrementModuleAsyncEvaluationCount ( )

The abstract operation IncrementModuleAsyncEvaluationCount takes no arguments and returns an [integer](#integer). It performs the following steps when called:

1.  Let `AR` be the [Agent Record](#agent-record) of the [surrounding agent](#surrounding-agent).
2.  Let `count` be `AR`.`[[ModuleAsyncEvaluationCount]]`.
3.  Set `AR`.`[[ModuleAsyncEvaluationCount]]` to `count` + 1.
4.  Return `count`.

Note

This value is only used to keep track of the relative evaluation order between pending modules. An implementation may unobservably reset `[[ModuleAsyncEvaluationCount]]` to 0 whenever there are no pending modules.

## 9.7 Agent Clusters

An agent cluster is a maximal set of [agents](#agent) that can communicate by operating on shared memory.

Note 1

Programs within different [agents](#agent) may share memory by unspecified means. At a minimum, the backing memory for SharedArrayBuffers can be shared among the [agents](#agent) in the cluster.

There may be [agents](#agent) that can communicate by message passing that cannot share memory; they are never in the same agent cluster.

Every [agent](#agent) belongs to exactly one agent cluster.

Note 2

The [agents](#agent) in a cluster need not all be alive at some particular point in time. If [agent](#agent) **A** creates another [agent](#agent) **B**, after which **A** terminates and **B** creates [agent](#agent) **C**, the three [agents](#agent) are in the same cluster if **A** could share some memory with **B** and **B** could share some memory with **C**.

All [agents](#agent) within a cluster must have the same value for the `[[LittleEndian]]` field in their respective [Agent Records](#agent-record).

Note 3

If different [agents](#agent) within an agent cluster have different values of `[[LittleEndian]]` it becomes hard to use shared memory for multi-byte data.

All [agents](#agent) within a cluster must have the same values for the `[[IsLockFree1]]` field in their respective [Agent Records](#agent-record); similarly for the `[[IsLockFree2]]` field.

All [agents](#agent) within a cluster must have different values for the `[[Signifier]]` field in their respective [Agent Records](#agent-record).

An embedding may deactivate (stop forward progress) or activate (resume forward progress) an [agent](#agent) without the [agent](#agent)'s knowledge or cooperation. If the embedding does so, it must not leave some [agents](#agent) in the cluster active while other [agents](#agent) in the cluster are deactivated indefinitely.

Note 4

The purpose of the preceding restriction is to avoid a situation where an [agent](#agent) deadlocks or starves because another [agent](#agent) has been deactivated. For example, if an HTML shared worker that has a lifetime independent of documents in any windows were allowed to share memory with the dedicated worker of such an independent document, and the document and its dedicated worker were to be deactivated while the dedicated worker holds a lock (say, the document is pushed into its window's history), and the shared worker then tries to acquire the lock, then the shared worker will be blocked until the dedicated worker is activated again, if ever. Meanwhile other workers trying to access the shared worker from other windows will starve.

The implication of the restriction is that it will not be possible to share memory between [agents](#agent) that don't belong to the same suspend/wake collective within the embedding.

An embedding may terminate an [agent](#agent) without any of the [agent](#agent)'s cluster's other [agents](#agent)' prior knowledge or cooperation. If an [agent](#agent) is terminated not by programmatic action of its own or of another [agent](#agent) in the cluster but by forces external to the cluster, then the embedding must choose one of two strategies: Either terminate all the [agents](#agent) in the cluster, or provide reliable APIs that allow the [agents](#agent) in the cluster to coordinate so that at least one remaining member of the cluster will be able to detect the termination, with the termination data containing enough information to identify the [agent](#agent) that was terminated.

Note 5

Examples of that type of termination are: operating systems or users terminating [agents](#agent) that are running in separate processes; the embedding itself terminating an [agent](#agent) that is running in-process with the other [agents](#agent) when per-[agent](#agent) resource accounting indicates that the [agent](#agent) is runaway.

Each of the following specification values, and values transitively reachable from them, belong to exactly one agent cluster.

- [candidate execution](#sec-candidate-executions) [Record](#sec-list-and-record-specification-type)
- [Shared Data Block](#sec-data-blocks)
- [WaiterList Record](#sec-waiterlist-records)

Prior to any evaluation of any ECMAScript code by any [agent](#agent) in a cluster, the `[[CandidateExecution]]` field of the [Agent Record](#agent-record) for all [agents](#agent) in the cluster is set to the initial [candidate execution](#sec-candidate-executions). The initial [candidate execution](#sec-candidate-executions) is an [empty candidate execution](#sec-candidate-executions) whose `[[EventsRecords]]` field is a [List](#sec-list-and-record-specification-type) containing, for each [agent](#agent), an [Agent Events Record](#sec-agent-event-records) whose `[[AgentSignifier]]` field is that [agent](#agent)'s [agent signifier](#sec-agents), and whose `[[EventList]]` and `[[AgentSynchronizesWith]]` fields are empty [Lists](#sec-list-and-record-specification-type).

Note 6

All [agents](#agent) in an agent cluster share the same [candidate execution](#sec-candidate-executions) in its [Agent Record](#agent-record)'s `[[CandidateExecution]]` field. The [candidate execution](#sec-candidate-executions) is a specification mechanism used by the [memory model](#sec-memory-model).

Note 7

An agent cluster is a specification mechanism and need not correspond to any particular artefact of an ECMAScript implementation.

## 9.8 Forward Progress

For an [agent](#agent) to *make forward progress* is for it to perform an evaluation step according to this specification.

An [agent](#agent) becomes *blocked* when its [running execution context](#running-execution-context) waits synchronously and indefinitely for an external event. Only [agents](#agent) whose [Agent Record](#agent-record)'s `[[CanBlock]]` field is true can become blocked in this sense. An *unblocked* [agent](#agent) is one that is not blocked.

Implementations must ensure that:

- every unblocked [agent](#agent) with a dedicated [executing thread](#executing-thread) eventually makes forward progress
- in a set of [agents](#agent) that share an [executing thread](#executing-thread), one [agent](#agent) eventually makes forward progress
- an [agent](#agent) does not cause another [agent](#agent) to become blocked except via explicit APIs that provide blocking.

Note

This, along with the liveness guarantee in the [memory model](#sec-memory-model), ensures that all seq-cst writes eventually become observable to all [agents](#agent).

## 9.9 Processing Model of WeakRef and FinalizationRegistry Targets

### 9.9.1 Objectives

This specification does not make any guarantees that any object or symbol will be garbage collected. Objects or symbols which are not [live](#sec-liveness) may be released after long periods of time, or never at all. For this reason, this specification uses the term "may" when describing behaviour triggered by garbage collection.

The semantics of [WeakRefs](#sec-weak-ref-constructor) and [FinalizationRegistrys](#sec-finalization-registry-constructor) is based on two operations which happen at particular points in time:

- When `WeakRef.prototype.deref` is called, the referent (if undefined is not returned) is kept alive so that subsequent, synchronous accesses also return the same value. This list is reset when synchronous work is done using the [ClearKeptObjects](#sec-clear-kept-objects) abstract operation.
- When an object or symbol which is registered with a [FinalizationRegistry](#sec-finalization-registry-constructor) becomes unreachable, a call of the [FinalizationRegistry](#sec-finalization-registry-constructor)'s cleanup callback may eventually be made, after synchronous ECMAScript execution completes. The [FinalizationRegistry](#sec-finalization-registry-constructor) cleanup is performed with the [CleanupFinalizationRegistry](#sec-cleanup-finalization-registry) abstract operation.

Neither of these actions ([ClearKeptObjects](#sec-clear-kept-objects) or [CleanupFinalizationRegistry](#sec-cleanup-finalization-registry)) may interrupt synchronous ECMAScript execution. Because [hosts](#host) may assemble longer, synchronous ECMAScript execution runs, this specification defers the scheduling of [ClearKeptObjects](#sec-clear-kept-objects) and [CleanupFinalizationRegistry](#sec-cleanup-finalization-registry) to the [host environment](#host-environment).

Some ECMAScript implementations include garbage collector implementations which run in the background, including when ECMAScript is idle. Letting the [host environment](#host-environment) schedule [CleanupFinalizationRegistry](#sec-cleanup-finalization-registry) allows it to resume ECMAScript execution in order to run finalizer work, which may free up held values, reducing overall memory usage.

### 9.9.2 Liveness

For some set of objects and/or symbols `S` a hypothetical WeakRef-oblivious execution with respect to `S` is an execution whereby the abstract operation [WeakRefDeref](#sec-weakrefderef) of a [WeakRef](#sec-weak-ref-constructor) whose referent is an element of `S` always returns undefined.

Note 1

[WeakRef](#sec-weak-ref-constructor)-obliviousness, together with liveness, capture two notions. One, that a [WeakRef](#sec-weak-ref-constructor) itself does not keep its referent alive. Two, that cycles in liveness does not imply that a value is live. To be concrete, if determining `v`'s liveness depends on determining the liveness of a [WeakRef](#sec-weak-ref-constructor) referent, `r`, `r`'s liveness cannot assume `v`'s liveness, which would be circular reasoning.

Note 2

[WeakRef](#sec-weak-ref-constructor)- obliviousness is defined on sets of objects or symbols instead of individual values to account for cycles. If it were defined on individual values, then a [WeakRef](#sec-weak-ref-constructor) referent in a cycle will be considered live even though its identity is only observed via other [WeakRef](#sec-weak-ref-constructor) referents in the cycle.

Note 3

Colloquially, we say that an individual object or symbol is live if every set containing it is live.

At any point during evaluation, a set of objects and/or symbols `S` is considered live if either of the following conditions is met:

- Any element in `S` is included in any [agent](#agent)'s `[[KeptAlive]]` [List](#sec-list-and-record-specification-type).
- There exists a valid future hypothetical WeakRef-oblivious execution with respect to `S` that observes the identity of any value in `S`.

Note 4

The second condition above intends to capture the intuition that a value is live if its identity is observable via non-[WeakRef](#sec-weak-ref-constructor) means. A value's identity may be observed by observing a strict equality comparison or observing the value being used as key in a Map.

Note 5

Presence of an object or a symbol in a field, an internal slot, or a property does not imply that the value is live. For example if the value in question is never passed back to the program, then it cannot be observed.

This is the case for keys in a WeakMap, members of a WeakSet, as well as the `[[WeakRefTarget]]` and `[[UnregisterToken]]` fields of a [FinalizationRegistry](#sec-finalization-registry-constructor) Cell record.

The above definition implies that, if a key in a WeakMap is not live, then its corresponding value is not necessarily live either.

Note 6

Liveness is the lower bound for guaranteeing which [WeakRefs](#sec-weak-ref-constructor) engines must not empty. Liveness as defined here is undecidable. In practice, engines use conservative approximations such as reachability. There is expected to be significant implementation leeway.

### 9.9.3 Execution

At any time, if a set of objects and/or symbols `S` is not [live](#sec-liveness), an ECMAScript implementation may perform the following steps atomically:

1.  For each element `value` of `S`, do
    1.  For each [WeakRef](#sec-weak-ref-constructor) `ref` such that `ref`.`[[WeakRefTarget]]` is `value`, do
        1.  Set `ref`.`[[WeakRefTarget]]` to empty.
    2.  For each [FinalizationRegistry](#sec-finalization-registry-constructor) `fg` such that `fg`.`[[Cells]]` contains a [Record](#sec-list-and-record-specification-type) `cell` such that `cell`.`[[WeakRefTarget]]` is `value`, do
        1.  Set `cell`.`[[WeakRefTarget]]` to empty.
        2.  Optionally, perform [HostEnqueueFinalizationRegistryCleanupJob](#sec-host-cleanup-finalization-registry)(`fg`).
    3.  For each WeakMap `map` such that `map`.`[[WeakMapData]]` contains a [Record](#sec-list-and-record-specification-type) `r` such that `r`.`[[Key]]` is `value`, do
        1.  Set `r`.`[[Key]]` to empty.
        2.  Set `r`.`[[Value]]` to empty.
    4.  For each WeakSet `set` such that `set`.`[[WeakSetData]]` contains `value`, do
        1.  Replace the element of `set`.`[[WeakSetData]]` whose value is `value` with an element whose value is empty.

Note 1

Together with the definition of liveness, this clause prescribes optimizations that an implementation may apply regarding [WeakRefs](#sec-weak-ref-constructor).

It is possible to access an object without observing its identity. Optimizations such as dead variable elimination and scalar replacement on properties of non-escaping objects whose identity is not observed are allowed. These optimizations are thus allowed to observably empty [WeakRefs](#sec-weak-ref-constructor) that point to such objects.

On the other hand, if an object's identity is observable, and that object is in the `[[WeakRefTarget]]` internal slot of a [WeakRef](#sec-weak-ref-constructor), optimizations such as rematerialization that observably empty the [WeakRef](#sec-weak-ref-constructor) are prohibited.

Because calling [HostEnqueueFinalizationRegistryCleanupJob](#sec-host-cleanup-finalization-registry) is optional, registered objects in a [FinalizationRegistry](#sec-finalization-registry-constructor) do not necessarily hold that [FinalizationRegistry](#sec-finalization-registry-constructor) [live](#sec-liveness). Implementations may omit [FinalizationRegistry](#sec-finalization-registry-constructor) callbacks for any reason, e.g., if the [FinalizationRegistry](#sec-finalization-registry-constructor) itself becomes dead, or if the application is shutting down.

Note 2

Implementations are not obligated to empty [WeakRefs](#sec-weak-ref-constructor) for maximal sets of non-[live](#sec-liveness) objects or symbols.

If an implementation chooses a non-[live](#sec-liveness) set `S` in which to empty [WeakRefs](#sec-weak-ref-constructor), this definition requires that it empties [WeakRefs](#sec-weak-ref-constructor) for all values in `S` simultaneously. In other words, it is not conformant for an implementation to empty a [WeakRef](#sec-weak-ref-constructor) pointing to a value `v` without emptying out other [WeakRefs](#sec-weak-ref-constructor) that, if not emptied, could result in an execution that observes the value of `v`.

### 9.9.4 Host Hooks

#### 9.9.4.1 HostEnqueueFinalizationRegistryCleanupJob ( `finalizationRegistry` )

The [host-defined](#host-defined) abstract operation HostEnqueueFinalizationRegistryCleanupJob takes argument `finalizationRegistry` (a [FinalizationRegistry](#sec-finalization-registry-constructor)) and returns unused.

Let `cleanupJob` be a new [Job](#job) [Abstract Closure](#sec-abstract-closure) with no parameters that captures `finalizationRegistry` and performs the following steps when called:

1.  Let `cleanupResult` be [Completion](#sec-completion-ao)([CleanupFinalizationRegistry](#sec-cleanup-finalization-registry)(`finalizationRegistry`)).
2.  If `cleanupResult` is an [abrupt completion](#sec-completion-record-specification-type), perform any [host-defined](#host-defined) steps for reporting the error.
3.  Return unused.

An implementation of HostEnqueueFinalizationRegistryCleanupJob schedules `cleanupJob` to be performed at some future time, if possible. It must also conform to the requirements in [9.5](#sec-jobs).

## 9.10 ClearKeptObjects ( )

The abstract operation ClearKeptObjects takes no arguments and returns unused. ECMAScript implementations are expected to call ClearKeptObjects when a synchronous sequence of ECMAScript executions completes. It performs the following steps when called:

1.  Let `agentRecord` be the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
2.  Set `agentRecord`.`[[KeptAlive]]` to a new empty [List](#sec-list-and-record-specification-type).
3.  Return unused.

## 9.11 AddToKeptObjects ( `value` )

The abstract operation AddToKeptObjects takes argument `value` (an Object or a Symbol) and returns unused. It performs the following steps when called:

1.  Let `agentRecord` be the [surrounding agent](#surrounding-agent)'s [Agent Record](#agent-record).
2.  Append `value` to `agentRecord`.`[[KeptAlive]]`.
3.  Return unused.

Note

When the abstract operation AddToKeptObjects is called with a target object or symbol, it adds the target to a list that will point strongly at the target until [ClearKeptObjects](#sec-clear-kept-objects) is called.

## 9.12 CleanupFinalizationRegistry ( `finalizationRegistry` )

The abstract operation CleanupFinalizationRegistry takes argument `finalizationRegistry` (a [FinalizationRegistry](#sec-finalization-registry-constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): `finalizationRegistry` has `[[Cells]]` and `[[CleanupCallback]]` internal slots.
2.  Let `callback` be `finalizationRegistry`.`[[CleanupCallback]]`.
3.  While `finalizationRegistry`.`[[Cells]]` contains a [Record](#sec-list-and-record-specification-type) `cell` such that `cell`.`[[WeakRefTarget]]` is empty, an implementation may perform the following steps:
    1.  Choose any such `cell`.
    2.  Remove `cell` from `finalizationRegistry`.`[[Cells]]`.
    3.  Perform ? [HostCallJobCallback](#sec-hostcalljobcallback)(`callback`, undefined, « `cell`.`[[HeldValue]]` »).
4.  Return unused.

## 9.13 CanBeHeldWeakly ( `v` )

The abstract operation CanBeHeldWeakly takes argument `v` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a Boolean. It returns true if and only if `v` is suitable for use as a weak reference. Only values that are suitable for use as a weak reference may be a key of a WeakMap, an element of a WeakSet, the target of a [WeakRef](#sec-weak-ref-constructor), or one of the targets of a [FinalizationRegistry](#sec-finalization-registry-constructor). It performs the following steps when called:

1.  If `v` [is an Object](#sec-object-type), return true.
2.  If `v` [is a Symbol](#sec-ecmascript-language-types-symbol-type) and [KeyForSymbol](#sec-keyforsymbol)(`v`) is undefined, return true.
3.  Return false.

Note

A language value without [language identity](#sec-identity) can be manifested without prior reference and is unsuitable for use as a weak reference. A Symbol value produced by [Symbol.for](#sec-symbol.for), unlike other Symbol values, does not have language identity and is unsuitable for use as a weak reference. [Well-known symbols](#sec-well-known-symbols) are likely to never be collected, but are nonetheless treated as suitable for use as a weak reference because they are limited in number and therefore manageable by a variety of implementation approaches. However, any value associated to a well-known symbol in a [live](#sec-liveness) WeakMap is unlikely to be collected and could “leak” memory resources in implementations.
