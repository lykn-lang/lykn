# 26 Managing Memory

## 26.1 WeakRef Objects

A [WeakRef](#sec-weak-ref-constructor) is an object that is used to refer to a target object or symbol without preserving it from garbage collection. [WeakRefs](#sec-weak-ref-constructor) can be dereferenced to allow access to the target value, if the target hasn't been reclaimed by garbage collection.

### 26.1.1 The WeakRef Constructor

The WeakRef [constructor](#constructor):

- is %WeakRef%.
- is the initial value of the "WeakRef" property of the [global object](#sec-global-object).
- creates and initializes a new WeakRef when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified `WeakRef` behaviour must include a `super` call to the `WeakRef` [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `WeakRef.prototype` built-in methods.

#### 26.1.1.1 WeakRef ( `target` )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`target`) is false, throw a TypeError exception.
3.  Let `weakRef` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%WeakRef.prototype%", « `[[WeakRefTarget]]` »).
4.  Perform [AddToKeptObjects](#sec-addtokeptobjects)(`target`).
5.  Set `weakRef`.`[[WeakRefTarget]]` to `target`.
6.  Return `weakRef`.

### 26.1.2 Properties of the WeakRef Constructor

The [WeakRef](#sec-weak-ref-constructor) [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 26.1.2.1 WeakRef.prototype

The initial value of `WeakRef.prototype` is the [WeakRef prototype](#sec-properties-of-the-weak-ref-prototype-object) object.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 26.1.3 Properties of the WeakRef Prototype Object

The WeakRef prototype object:

- is %WeakRef.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have a `[[WeakRefTarget]]` internal slot.

[Normative Optional](#sec-conformance)

#### 26.1.3.1 WeakRef.prototype.constructor

The initial value of `WeakRef.prototype.constructor` is [%WeakRef%](#sec-weak-ref-constructor).

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

#### 26.1.3.2 WeakRef.prototype.deref ( )

This method performs the following steps when called:

1.  Let `weakRef` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`weakRef`, `[[WeakRefTarget]]`).
3.  Return [WeakRefDeref](#sec-weakrefderef)(`weakRef`).

Note

If the [WeakRef](#sec-weak-ref-constructor) returns a `target` value that is not undefined, then this `target` value should not be garbage collected until the current execution of ECMAScript code has completed. The [AddToKeptObjects](#sec-addtokeptobjects) operation makes sure read consistency is maintained.

``` javascript
let target = { foo() {} };
let weakRef = new WeakRef(target);

// ... later ...

if (weakRef.deref()) {
  weakRef.deref().foo();
}
```

In the above example, if the first deref does not evaluate to undefined then the second deref cannot either.

#### 26.1.3.3 WeakRef.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "WeakRef".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 26.1.4 WeakRef Abstract Operations

#### 26.1.4.1 WeakRefDeref ( `weakRef` )

The abstract operation WeakRefDeref takes argument `weakRef` (a [WeakRef](#sec-weak-ref-constructor)) and returns an [ECMAScript language value](#sec-ecmascript-language-types). It performs the following steps when called:

1.  Let `target` be `weakRef`.`[[WeakRefTarget]]`.
2.  If `target` is not empty, then
    1.  Perform [AddToKeptObjects](#sec-addtokeptobjects)(`target`).
    2.  Return `target`.
3.  Return undefined.

Note

This abstract operation is defined separately from WeakRef.prototype.deref strictly to make it possible to succinctly define liveness.

### 26.1.5 Properties of WeakRef Instances

[WeakRef](#sec-weak-ref-constructor) instances are [ordinary objects](#ordinary-object) that inherit properties from the [WeakRef prototype](#sec-properties-of-the-weak-ref-prototype-object). [WeakRef](#sec-weak-ref-constructor) instances also have a `[[WeakRefTarget]]` internal slot.

## 26.2 FinalizationRegistry Objects

A [FinalizationRegistry](#sec-finalization-registry-constructor) is an object that manages registration and unregistration of cleanup operations that are performed when target objects and symbols are garbage collected.

### 26.2.1 The FinalizationRegistry Constructor

The FinalizationRegistry [constructor](#constructor):

- is %FinalizationRegistry%.
- is the initial value of the "FinalizationRegistry" property of the [global object](#sec-global-object).
- creates and initializes a new FinalizationRegistry when called as a [constructor](#constructor).
- is not intended to be called as a function and will throw an exception when called in that manner.
- may be used as the value in an `extends` clause of a class definition. Subclass [constructors](#constructor) that intend to inherit the specified `FinalizationRegistry` behaviour must include a `super` call to the `FinalizationRegistry` [constructor](#constructor) to create and initialize the subclass instance with the internal state necessary to support the `FinalizationRegistry.prototype` built-in methods.

#### 26.2.1.1 FinalizationRegistry ( `cleanupCallback` )

This function performs the following steps when called:

1.  If NewTarget is undefined, throw a TypeError exception.
2.  If [IsCallable](#sec-iscallable)(`cleanupCallback`) is false, throw a TypeError exception.
3.  Let `finalizationRegistry` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(NewTarget, "%FinalizationRegistry.prototype%", « `[[Realm]]`, `[[CleanupCallback]]`, `[[Cells]]` »).
4.  Let `fn` be the [active function object](#active-function-object).
5.  Set `finalizationRegistry`.`[[Realm]]` to `fn`.`[[Realm]]`.
6.  Set `finalizationRegistry`.`[[CleanupCallback]]` to [HostMakeJobCallback](#sec-hostmakejobcallback)(`cleanupCallback`).
7.  Set `finalizationRegistry`.`[[Cells]]` to a new empty [List](#sec-list-and-record-specification-type).
8.  Return `finalizationRegistry`.

### 26.2.2 Properties of the FinalizationRegistry Constructor

The [FinalizationRegistry](#sec-finalization-registry-constructor) [constructor](#constructor):

- has a `[[Prototype]]` internal slot whose value is [%Function.prototype%](#sec-properties-of-the-function-prototype-object).
- has the following properties:

#### 26.2.2.1 FinalizationRegistry.prototype

The initial value of `FinalizationRegistry.prototype` is the [FinalizationRegistry prototype](#sec-properties-of-the-finalization-registry-prototype-object) object.

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 26.2.3 Properties of the FinalizationRegistry Prototype Object

The FinalizationRegistry prototype object:

- is %FinalizationRegistry.prototype%.
- has a `[[Prototype]]` internal slot whose value is [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
- is an [ordinary object](#ordinary-object).
- does not have `[[Cells]]` and `[[CleanupCallback]]` internal slots.

#### 26.2.3.1 FinalizationRegistry.prototype.constructor

The initial value of `FinalizationRegistry.prototype.constructor` is [%FinalizationRegistry%](#sec-finalization-registry-constructor).

#### 26.2.3.2 FinalizationRegistry.prototype.register ( `target`, `heldValue` \[ , `unregisterToken` \] )

This method performs the following steps when called:

1.  Let `finalizationRegistry` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`finalizationRegistry`, `[[Cells]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`target`) is false, throw a TypeError exception.
4.  If [SameValue](#sec-samevalue)(`target`, `heldValue`) is true, throw a TypeError exception.
5.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`unregisterToken`) is false, then
    1.  If `unregisterToken` is not undefined, throw a TypeError exception.
    2.  Set `unregisterToken` to empty.
6.  Let `cell` be the [Record](#sec-list-and-record-specification-type) { `[[WeakRefTarget]]`: `target`, `[[HeldValue]]`: `heldValue`, `[[UnregisterToken]]`: `unregisterToken` }.
7.  Append `cell` to `finalizationRegistry`.`[[Cells]]`.
8.  Return undefined.

Note

Based on the algorithms and definitions in this specification, `cell`.`[[HeldValue]]` is [live](#sec-liveness) when `finalizationRegistry`.`[[Cells]]` contains `cell`; however, this does not necessarily mean that `cell`.`[[UnregisterToken]]` or `cell`.`[[Target]]` are [live](#sec-liveness). For example, registering an object with itself as its unregister token would not keep the object alive forever.

#### 26.2.3.3 FinalizationRegistry.prototype.unregister ( `unregisterToken` )

This method performs the following steps when called:

1.  Let `finalizationRegistry` be the this value.
2.  Perform ? [RequireInternalSlot](#sec-requireinternalslot)(`finalizationRegistry`, `[[Cells]]`).
3.  If [CanBeHeldWeakly](#sec-canbeheldweakly)(`unregisterToken`) is false, throw a TypeError exception.
4.  Let `removed` be false.
5.  For each [Record](#sec-list-and-record-specification-type) { `[[WeakRefTarget]]`, `[[HeldValue]]`, `[[UnregisterToken]]` } `cell` of `finalizationRegistry`.`[[Cells]]`, do
    1.  If `cell`.`[[UnregisterToken]]` is not empty and [SameValue](#sec-samevalue)(`cell`.`[[UnregisterToken]]`, `unregisterToken`) is true, then
        1.  Remove `cell` from `finalizationRegistry`.`[[Cells]]`.
        2.  Set `removed` to true.
6.  Return `removed`.

#### 26.2.3.4 FinalizationRegistry.prototype \[ %Symbol.toStringTag% \]

The initial value of the [%Symbol.toStringTag%](#sec-well-known-symbols) property is the String value "FinalizationRegistry".

This property has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }.

### 26.2.4 Properties of FinalizationRegistry Instances

[FinalizationRegistry](#sec-finalization-registry-constructor) instances are [ordinary objects](#ordinary-object) that inherit properties from the [FinalizationRegistry prototype](#sec-properties-of-the-finalization-registry-prototype-object). [FinalizationRegistry](#sec-finalization-registry-constructor) instances also have `[[Cells]]` and `[[CleanupCallback]]` internal slots.
