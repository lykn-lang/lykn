# 28 Reflection

## 28.1 The Reflect Object

The Reflect object:

- is %Reflect%.
- is the initial value of the "Reflect" property of the [global object](#sec-global-object).
- is an [ordinary object](#ordinary-object).
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is not a [function object](#function-object).
- does not have a `[[Construct]]` internal method; it cannot be used as a [constructor](#constructor) with the `new` operator.
- does not have a `[[Call]]` internal method; it cannot be invoked as a function.

### 28.1.1 Reflect.apply ( `target`, `thisArgument`, `argumentsList` )

This function performs the following steps when called:

1.  If [IsCallable](#sec-iscallable)(`target`) is false, throw a TypeError exception.
2.  Let `args` be ? [CreateListFromArrayLike](#sec-createlistfromarraylike)(`argumentsList`).
3.  Perform [PrepareForTailCall](#sec-preparefortailcall)().
4.  Return ? [Call](#sec-call)(`target`, `thisArgument`, `args`).

### 28.1.2 Reflect.construct ( `target`, `argumentsList` \[ , `newTarget` \] )

This function performs the following steps when called:

1.  If [IsConstructor](#sec-isconstructor)(`target`) is false, throw a TypeError exception.
2.  If `newTarget` is not present, set `newTarget` to `target`.
3.  Else if [IsConstructor](#sec-isconstructor)(`newTarget`) is false, throw a TypeError exception.
4.  Let `args` be ? [CreateListFromArrayLike](#sec-createlistfromarraylike)(`argumentsList`).
5.  Return ? [Construct](#sec-construct)(`target`, `args`, `newTarget`).

### 28.1.3 Reflect.defineProperty ( `target`, `propertyKey`, `attributes` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`propertyKey`).
3.  Let `desc` be ? [ToPropertyDescriptor](#sec-topropertydescriptor)(`attributes`).
4.  Return ? `target`.`[[DefineOwnProperty]]`(`key`, `desc`).

### 28.1.4 Reflect.deleteProperty ( `target`, `propertyKey` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`propertyKey`).
3.  Return ? `target`.`[[Delete]]`(`key`).

### 28.1.5 Reflect.get ( `target`, `propertyKey` \[ , `receiver` \] )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`propertyKey`).
3.  If `receiver` is not present, then
    1.  Set `receiver` to `target`.
4.  Return ? `target`.`[[Get]]`(`key`, `receiver`).

### 28.1.6 Reflect.getOwnPropertyDescriptor ( `target`, `propertyKey` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`propertyKey`).
3.  Let `desc` be ? `target`.`[[GetOwnProperty]]`(`key`).
4.  Return [FromPropertyDescriptor](#sec-frompropertydescriptor)(`desc`).

### 28.1.7 Reflect.getPrototypeOf ( `target` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Return ? `target`.`[[GetPrototypeOf]]`().

### 28.1.8 Reflect.has ( `target`, `propertyKey` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`propertyKey`).
3.  Return ? `target`.`[[HasProperty]]`(`key`).

### 28.1.9 Reflect.isExtensible ( `target` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Return ? `target`.`[[IsExtensible]]`().

### 28.1.10 Reflect.ownKeys ( `target` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `keys` be ? `target`.`[[OwnPropertyKeys]]`().
3.  Return [CreateArrayFromList](#sec-createarrayfromlist)(`keys`).

### 28.1.11 Reflect.preventExtensions ( `target` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Return ? `target`.`[[PreventExtensions]]`().

### 28.1.12 Reflect.set ( `target`, `propertyKey`, `V` \[ , `receiver` \] )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  Let `key` be ? [ToPropertyKey](#sec-topropertykey)(`propertyKey`).
3.  If `receiver` is not present, then
    1.  Set `receiver` to `target`.
4.  Return ? `target`.`[[Set]]`(`key`, `V`, `receiver`).

### 28.1.13 Reflect.setPrototypeOf ( `target`, `proto` )

This function performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  If `proto` [is not an Object](#sec-object-type) and `proto` is not null, throw a TypeError exception.
3.  Return ? `target`.`[[SetPrototypeOf]]`(`proto`).

### 28.1.14 Reflect \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Reflect".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

## 28.2 Proxy Objects

### 28.2.1 The Proxy Constructor

The Proxy [constructor](#constructor):

- is %Proxy%.
- is the initial value of the "Proxy" property of the [global object](#sec-global-object).
- creates and initializes a new Proxy object when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.

#### 28.2.1.1 Proxy ( `target`, `handler` )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  Return ? [ProxyCreate](#sec-proxycreate)(`target`, `handler`).

### 28.2.2 Properties of the Proxy Constructor

The Proxy [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- does not have a "prototype" property because Proxy objects do not have a `[[Prototype]]` internal slot that requires initialization.
- has the following properties:

#### 28.2.2.1 Proxy.revocable ( `target`, `handler` )

This function creates a revocable Proxy object.

It performs the following steps when called:

1.  Let `proxy` be ? [ProxyCreate](#sec-proxycreate)(`target`, `handler`).
2.  Let `revokerClosure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures nothing and performs the following steps when called:
    1.  Let `F` be the [active function object](#active-function-object).
    2.  Let `p` be `F`.`[[RevocableProxy]]`.
    3.  If `p` is null, return undefined.
    4.  Set `F`.`[[RevocableProxy]]` to null.
    5.  [Assert](#assert): `p` is a [Proxy exotic object](#proxy-exotic-object).
    6.  Set `p`.`[[ProxyTarget]]` to null.
    7.  Set `p`.`[[ProxyHandler]]` to null.
    8.  Return undefined.
3.  Let `revoker` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`revokerClosure`, 0, "", « `[[RevocableProxy]]` »).
4.  Set `revoker`.`[[RevocableProxy]]` to `proxy`.
5.  Let `result` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
6.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`result`, "proxy", `proxy`).
7.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`result`, "revoke", `revoker`).
8.  Return `result`.

## 28.3 Module Namespace Objects

A Module Namespace Object is a [module namespace exotic object](#module-namespace-exotic-object) that provides runtime property-based access to a module's exported bindings. There is no [constructor](#constructor) function for Module Namespace Objects. Instead, such an object is created for each module that is imported by an [ImportDeclaration](#prod-ImportDeclaration) that contains a [NameSpaceImport](#prod-NameSpaceImport).

In addition to the properties specified in [10.4.6](#sec-module-namespace-exotic-objects) each Module Namespace Object has the following own property:

### 28.3.1 %Symbol.toStringTag%

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "Module".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.
