# 10 Ordinary and Exotic Objects Behaviours

## 10.1 Ordinary Object Internal Methods and Internal Slots

All [ordinary objects](#ordinary-object) have an internal slot called `[[Prototype]]`. The value of this internal slot is either null or an object and is used for implementing inheritance. Assume a property named `P` is missing from an [ordinary object](#ordinary-object) `O` but exists on its `[[Prototype]]` object. If `P` refers to a [data property](#sec-object-type) on the `[[Prototype]]` object, `O` inherits it for get access, making it behave as if `P` was a property of `O`. If `P` refers to a writable [data property](#sec-object-type) on the `[[Prototype]]` object, set access of `P` on `O` creates a new [data property](#sec-object-type) named `P` on `O`. If `P` refers to a non-writable [data property](#sec-object-type) on the `[[Prototype]]` object, set access of `P` on `O` fails. If `P` refers to an [accessor property](#sec-object-type) on the `[[Prototype]]` object, the accessor is inherited by `O` for both get access and set access.

Every [ordinary object](#ordinary-object) has a Boolean-valued `[[Extensible]]` internal slot which is used to fulfill the extensibility-related internal method invariants specified in [6.1.7.3](#sec-invariants-of-the-essential-internal-methods). Namely, once the value of an object's `[[Extensible]]` internal slot has been set to false, it is no longer possible to add properties to the object, to modify the value of the object's `[[Prototype]]` internal slot, or to subsequently change the value of `[[Extensible]]` to true.

In the following algorithm descriptions, assume `O` is an [ordinary object](#ordinary-object), `P` is a [property key](#property-key) value, `V` is any [ECMAScript language value](#sec-ecmascript-language-types), and `Desc` is a [Property Descriptor](#sec-property-descriptor-specification-type) record.

Each [ordinary object](#ordinary-object) internal method delegates to a similarly-named abstract operation. If such an abstract operation depends on another internal method, then the internal method is invoked on `O` rather than calling the similarly-named abstract operation directly. These semantics ensure that [exotic objects](#exotic-object) have their overridden internal methods invoked when [ordinary object](#ordinary-object) internal methods are applied to them.

### 10.1.1 `[[GetPrototypeOf]]` ( )

The `[[GetPrototypeOf]]` internal method of an [ordinary object](#ordinary-object) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) either an Object or null. It performs the following steps when called:

1.  Return [OrdinaryGetPrototypeOf](#sec-ordinarygetprototypeof)(`O`).

#### 10.1.1.1 OrdinaryGetPrototypeOf ( `O` )

The abstract operation OrdinaryGetPrototypeOf takes argument `O` (an Object) and returns an Object or null. It performs the following steps when called:

1.  Return `O`.`[[Prototype]]`.

### 10.1.2 `[[SetPrototypeOf]]` ( `V` )

The `[[SetPrototypeOf]]` internal method of an [ordinary object](#ordinary-object) `O` takes argument `V` (an Object or null) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  Return [OrdinarySetPrototypeOf](#sec-ordinarysetprototypeof)(`O`, `V`).

#### 10.1.2.1 OrdinarySetPrototypeOf ( `O`, `V` )

The abstract operation OrdinarySetPrototypeOf takes arguments `O` (an Object) and `V` (an Object or null) and returns a Boolean. It performs the following steps when called:

1.  Let `current` be `O`.`[[Prototype]]`.
2.  If [SameValue](#sec-samevalue)(`V`, `current`) is true, return true.
3.  Let `extensible` be `O`.`[[Extensible]]`.
4.  If `extensible` is false, return false.
5.  Let `p` be `V`.
6.  Let `done` be false.
7.  Repeat, while `done` is false,
    1.  If `p` is null, then
        1.  Set `done` to true.
    2.  Else if [SameValue](#sec-samevalue)(`p`, `O`) is true, then
        1.  Return false.
    3.  Else,
        1.  If `p`.`[[GetPrototypeOf]]` is not the [ordinary object](#ordinary-object) internal method defined in [10.1.1](#sec-ordinary-object-internal-methods-and-internal-slots-getprototypeof), set `done` to true.
        2.  Else, set `p` to `p`.`[[Prototype]]`.
8.  Set `O`.`[[Prototype]]` to `V`.
9.  Return true.

Note

The loop in step [7](#step-ordinarysetprototypeof-loop) guarantees that there will be no cycles in any prototype chain that only includes objects that use the [ordinary object](#ordinary-object) definitions for `[[GetPrototypeOf]]` and `[[SetPrototypeOf]]`.

### 10.1.3 `[[IsExtensible]]` ( )

The `[[IsExtensible]]` internal method of an [ordinary object](#ordinary-object) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  Return [OrdinaryIsExtensible](#sec-ordinaryisextensible)(`O`).

#### 10.1.3.1 OrdinaryIsExtensible ( `O` )

The abstract operation OrdinaryIsExtensible takes argument `O` (an Object) and returns a Boolean. It performs the following steps when called:

1.  Return `O`.`[[Extensible]]`.

### 10.1.4 `[[PreventExtensions]]` ( )

The `[[PreventExtensions]]` internal method of an [ordinary object](#ordinary-object) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) true. It performs the following steps when called:

1.  Return [OrdinaryPreventExtensions](#sec-ordinarypreventextensions)(`O`).

#### 10.1.4.1 OrdinaryPreventExtensions ( `O` )

The abstract operation OrdinaryPreventExtensions takes argument `O` (an Object) and returns true. It performs the following steps when called:

1.  Set `O`.`[[Extensible]]` to false.
2.  Return true.

### 10.1.5 `[[GetOwnProperty]]` ( `P` )

The `[[GetOwnProperty]]` internal method of an [ordinary object](#ordinary-object) `O` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) either a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined. It performs the following steps when called:

1.  Return [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`O`, `P`).

#### 10.1.5.1 OrdinaryGetOwnProperty ( `O`, `P` )

The abstract operation OrdinaryGetOwnProperty takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined. It performs the following steps when called:

1.  If `O` does not have an own property with key `P`, return undefined.
2.  Let `D` be a newly created [Property Descriptor](#sec-property-descriptor-specification-type) with no fields.
3.  Let `X` be `O`'s own property whose key is `P`.
4.  If `X` is a [data property](#sec-object-type), then
    1.  Set `D`.`[[Value]]` to the value of `X`'s `[[Value]]` attribute.
    2.  Set `D`.`[[Writable]]` to the value of `X`'s `[[Writable]]` attribute.
5.  Else,
    1.  [Assert](#assert): `X` is an [accessor property](#sec-object-type).
    2.  Set `D`.`[[Get]]` to the value of `X`'s `[[Get]]` attribute.
    3.  Set `D`.`[[Set]]` to the value of `X`'s `[[Set]]` attribute.
6.  Set `D`.`[[Enumerable]]` to the value of `X`'s `[[Enumerable]]` attribute.
7.  Set `D`.`[[Configurable]]` to the value of `X`'s `[[Configurable]]` attribute.
8.  Return `D`.

### 10.1.6 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of an [ordinary object](#ordinary-object) `O` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`O`, `P`, `Desc`).

#### 10.1.6.1 OrdinaryDefineOwnProperty ( `O`, `P`, `Desc` )

The abstract operation OrdinaryDefineOwnProperty takes arguments `O` (an Object), `P` (a [property key](#property-key)), and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `current` be ? `O`.`[[GetOwnProperty]]`(`P`).
2.  Let `extensible` be ? [IsExtensible](#sec-isextensible-o)(`O`).
3.  Return [ValidateAndApplyPropertyDescriptor](#sec-validateandapplypropertydescriptor)(`O`, `P`, `extensible`, `Desc`, `current`).

#### 10.1.6.2 IsCompatiblePropertyDescriptor ( `Extensible`, `Desc`, `Current` )

The abstract operation IsCompatiblePropertyDescriptor takes arguments `Extensible` (a Boolean), `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)), and `Current` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns a Boolean. It performs the following steps when called:

1.  Return [ValidateAndApplyPropertyDescriptor](#sec-validateandapplypropertydescriptor)(undefined, "", `Extensible`, `Desc`, `Current`).

#### 10.1.6.3 ValidateAndApplyPropertyDescriptor ( `O`, `P`, `extensible`, `Desc`, `current` )

The abstract operation ValidateAndApplyPropertyDescriptor takes arguments `O` (an Object or undefined), `P` (a [property key](#property-key)), `extensible` (a Boolean), `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)), and `current` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns a Boolean. It returns true if and only if `Desc` can be applied as the property of an object with specified `extensibility` and current property `current` while upholding [invariants](#sec-invariants-of-the-essential-internal-methods). When such application is possible and `O` is not undefined, it is performed for the property named `P` (which is created if necessary). It performs the following steps when called:

1.  [Assert](#assert): `P` is a [property key](#property-key).
2.  If `current` is undefined, then
    1.  If `extensible` is false, return false.
    2.  If `O` is undefined, return true.
    3.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is true, then
        1.  Create an own [accessor property](#sec-object-type) named `P` of object `O` whose `[[Get]]`, `[[Set]]`, `[[Enumerable]]`, and `[[Configurable]]` attributes are set to the value of the corresponding field in `Desc` if `Desc` has that field, or to the attribute's [default value](#table-object-property-attributes) otherwise.
    4.  Else,
        1.  Create an own [data property](#sec-object-type) named `P` of object `O` whose `[[Value]]`, `[[Writable]]`, `[[Enumerable]]`, and `[[Configurable]]` attributes are set to the value of the corresponding field in `Desc` if `Desc` has that field, or to the attribute's [default value](#table-object-property-attributes) otherwise.
    5.  Return true.
3.  [Assert](#assert): `current` is a [fully populated Property Descriptor](#sec-property-descriptor-specification-type).
4.  If `Desc` does not have any fields, return true.
5.  If `current`.`[[Configurable]]` is false, then
    1.  If `Desc` has a `[[Configurable]]` field and `Desc`.`[[Configurable]]` is true, return false.
    2.  If `Desc` has an `[[Enumerable]]` field and `Desc`.`[[Enumerable]]` is not `current`.`[[Enumerable]]`, return false.
    3.  If [IsGenericDescriptor](#sec-isgenericdescriptor)(`Desc`) is false and [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is not [IsAccessorDescriptor](#sec-isaccessordescriptor)(`current`), return false.
    4.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`current`) is true, then
        1.  If `Desc` has a `[[Get]]` field and [SameValue](#sec-samevalue)(`Desc`.`[[Get]]`, `current`.`[[Get]]`) is false, return false.
        2.  If `Desc` has a `[[Set]]` field and [SameValue](#sec-samevalue)(`Desc`.`[[Set]]`, `current`.`[[Set]]`) is false, return false.
    5.  Else if `current`.`[[Writable]]` is false, then
        1.  If `Desc` has a `[[Writable]]` field and `Desc`.`[[Writable]]` is true, return false.
        2.  NOTE: [SameValue](#sec-samevalue) returns true for NaN values which may be distinguishable by other means. Returning here ensures that any existing property of `O` remains unmodified.
        3.  If `Desc` has a `[[Value]]` field, return [SameValue](#sec-samevalue)(`Desc`.`[[Value]]`, `current`.`[[Value]]`).
6.  If `O` is not undefined, then
    1.  If [IsDataDescriptor](#sec-isdatadescriptor)(`current`) is true and [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is true, then
        1.  If `Desc` has a `[[Configurable]]` field, let `configurable` be `Desc`.`[[Configurable]]`; else let `configurable` be `current`.`[[Configurable]]`.
        2.  If `Desc` has a `[[Enumerable]]` field, let `enumerable` be `Desc`.`[[Enumerable]]`; else let `enumerable` be `current`.`[[Enumerable]]`.
        3.  Replace the property named `P` of object `O` with an [accessor property](#sec-object-type) whose `[[Configurable]]` and `[[Enumerable]]` attributes are set to `configurable` and `enumerable`, respectively, and whose `[[Get]]` and `[[Set]]` attributes are set to the value of the corresponding field in `Desc` if `Desc` has that field, or to the attribute's [default value](#table-object-property-attributes) otherwise.
    2.  Else if [IsAccessorDescriptor](#sec-isaccessordescriptor)(`current`) is true and [IsDataDescriptor](#sec-isdatadescriptor)(`Desc`) is true, then
        1.  If `Desc` has a `[[Configurable]]` field, let `configurable` be `Desc`.`[[Configurable]]`; else let `configurable` be `current`.`[[Configurable]]`.
        2.  If `Desc` has a `[[Enumerable]]` field, let `enumerable` be `Desc`.`[[Enumerable]]`; else let `enumerable` be `current`.`[[Enumerable]]`.
        3.  Replace the property named `P` of object `O` with a [data property](#sec-object-type) whose `[[Configurable]]` and `[[Enumerable]]` attributes are set to `configurable` and `enumerable`, respectively, and whose `[[Value]]` and `[[Writable]]` attributes are set to the value of the corresponding field in `Desc` if `Desc` has that field, or to the attribute's [default value](#table-object-property-attributes) otherwise.
    3.  Else,
        1.  For each field of `Desc`, set the corresponding attribute of the property named `P` of object `O` to the value of the field.
7.  Return true.

### 10.1.7 `[[HasProperty]]` ( `P` )

The `[[HasProperty]]` internal method of an [ordinary object](#ordinary-object) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [OrdinaryHasProperty](#sec-ordinaryhasproperty)(`O`, `P`).

#### 10.1.7.1 OrdinaryHasProperty ( `O`, `P` )

The abstract operation OrdinaryHasProperty takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `hasOwn` be ? `O`.`[[GetOwnProperty]]`(`P`).
2.  If `hasOwn` is not undefined, return true.
3.  Let `parent` be ? `O`.`[[GetPrototypeOf]]`().
4.  If `parent` is not null, then
    1.  Return ? `parent`.`[[HasProperty]]`(`P`).
5.  Return false.

### 10.1.8 `[[Get]]` ( `P`, `Receiver` )

The `[[Get]]` internal method of an [ordinary object](#ordinary-object) `O` takes arguments `P` (a [property key](#property-key)) and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [OrdinaryGet](#sec-ordinaryget)(`O`, `P`, `Receiver`).

#### 10.1.8.1 OrdinaryGet ( `O`, `P`, `Receiver` )

The abstract operation OrdinaryGet takes arguments `O` (an Object), `P` (a [property key](#property-key)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`P`).
2.  If `desc` is undefined, then
    1.  Let `parent` be ? `O`.`[[GetPrototypeOf]]`().
    2.  If `parent` is null, return undefined.
    3.  Return ? `parent`.`[[Get]]`(`P`, `Receiver`).
3.  If [IsDataDescriptor](#sec-isdatadescriptor)(`desc`) is true, return `desc`.`[[Value]]`.
4.  [Assert](#assert): [IsAccessorDescriptor](#sec-isaccessordescriptor)(`desc`) is true.
5.  Let `getter` be `desc`.`[[Get]]`.
6.  If `getter` is undefined, return undefined.
7.  Return ? [Call](#sec-call)(`getter`, `Receiver`).

### 10.1.9 `[[Set]]` ( `P`, `V`, `Receiver` )

The `[[Set]]` internal method of an [ordinary object](#ordinary-object) `O` takes arguments `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [OrdinarySet](#sec-ordinaryset)(`O`, `P`, `V`, `Receiver`).

#### 10.1.9.1 OrdinarySet ( `O`, `P`, `V`, `Receiver` )

The abstract operation OrdinarySet takes arguments `O` (an Object), `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `ownDesc` be ? `O`.`[[GetOwnProperty]]`(`P`).
2.  Return ? [OrdinarySetWithOwnDescriptor](#sec-ordinarysetwithowndescriptor)(`O`, `P`, `V`, `Receiver`, `ownDesc`).

#### 10.1.9.2 OrdinarySetWithOwnDescriptor ( `O`, `P`, `V`, `Receiver`, `ownDesc` )

The abstract operation OrdinarySetWithOwnDescriptor takes arguments `O` (an Object), `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `ownDesc` (a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `ownDesc` is undefined, then
    1.  Let `parent` be ? `O`.`[[GetPrototypeOf]]`().
    2.  If `parent` is not null, then
        1.  Return ? `parent`.`[[Set]]`(`P`, `V`, `Receiver`).
    3.  Else,
        1.  Set `ownDesc` to the PropertyDescriptor { `[[Value]]`: undefined, `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: true }.
2.  If [IsDataDescriptor](#sec-isdatadescriptor)(`ownDesc`) is true, then
    1.  If `ownDesc`.`[[Writable]]` is false, return false.
    2.  If `Receiver` [is not an Object](#sec-object-type), return false.
    3.  Let `existingDescriptor` be ? `Receiver`.`[[GetOwnProperty]]`(`P`).
    4.  If `existingDescriptor` is not undefined, then
        1.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`existingDescriptor`) is true, return false.
        2.  If `existingDescriptor`.`[[Writable]]` is false, return false.
        3.  Let `valueDesc` be the PropertyDescriptor { `[[Value]]`: `V` }.
        4.  Return ? `Receiver`.`[[DefineOwnProperty]]`(`P`, `valueDesc`).
    5.  Else,
        1.  [Assert](#assert): `Receiver` does not currently have a property `P`.
        2.  Return ? [CreateDataProperty](#sec-createdataproperty)(`Receiver`, `P`, `V`).
3.  [Assert](#assert): [IsAccessorDescriptor](#sec-isaccessordescriptor)(`ownDesc`) is true.
4.  Let `setter` be `ownDesc`.`[[Set]]`.
5.  If `setter` is undefined, return false.
6.  Perform ? [Call](#sec-call)(`setter`, `Receiver`, « `V` »).
7.  Return true.

### 10.1.10 `[[Delete]]` ( `P` )

The `[[Delete]]` internal method of an [ordinary object](#ordinary-object) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [OrdinaryDelete](#sec-ordinarydelete)(`O`, `P`).

#### 10.1.10.1 OrdinaryDelete ( `O`, `P` )

The abstract operation OrdinaryDelete takes arguments `O` (an Object) and `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `desc` be ? `O`.`[[GetOwnProperty]]`(`P`).
2.  If `desc` is undefined, return true.
3.  If `desc`.`[[Configurable]]` is true, then
    1.  Remove the own property with name `P` from `O`.
    2.  Return true.
4.  Return false.

### 10.1.11 `[[OwnPropertyKeys]]` ( )

The `[[OwnPropertyKeys]]` internal method of an [ordinary object](#ordinary-object) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key). It performs the following steps when called:

1.  Return [OrdinaryOwnPropertyKeys](#sec-ordinaryownpropertykeys)(`O`).

#### 10.1.11.1 OrdinaryOwnPropertyKeys ( `O` )

The abstract operation OrdinaryOwnPropertyKeys takes argument `O` (an Object) and returns a [List](#sec-list-and-record-specification-type) of [property keys](#property-key). It performs the following steps when called:

1.  Let `keys` be a new empty [List](#sec-list-and-record-specification-type).
2.  For each own [property key](#property-key) `P` of `O` such that `P` is an [array index](#array-index), in ascending numeric index order, do
    1.  Append `P` to `keys`.
3.  For each own [property key](#property-key) `P` of `O` such that `P` [is a String](#sec-ecmascript-language-types-string-type) and `P` is not an [array index](#array-index), in ascending chronological order of property creation, do
    1.  Append `P` to `keys`.
4.  For each own [property key](#property-key) `P` of `O` such that `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), in ascending chronological order of property creation, do
    1.  Append `P` to `keys`.
5.  Return `keys`.

### 10.1.12 OrdinaryObjectCreate ( `proto` \[ , `additionalInternalSlotsList` \] )

The abstract operation OrdinaryObjectCreate takes argument `proto` (an Object or null) and optional argument `additionalInternalSlotsList` (a [List](#sec-list-and-record-specification-type) of names of internal slots) and returns an Object. It is used to specify the runtime creation of new [ordinary objects](#ordinary-object). `additionalInternalSlotsList` contains the names of additional internal slots that must be defined as part of the object, beyond `[[Prototype]]` and `[[Extensible]]`. If `additionalInternalSlotsList` is not provided, a new empty [List](#sec-list-and-record-specification-type) is used. It performs the following steps when called:

1.  Let `internalSlotsList` be « `[[Prototype]]`, `[[Extensible]]` ».
2.  If `additionalInternalSlotsList` is present, set `internalSlotsList` to the [list-concatenation](#list-concatenation) of `internalSlotsList` and `additionalInternalSlotsList`.
3.  Let `O` be [MakeBasicObject](#sec-makebasicobject)(`internalSlotsList`).
4.  Set `O`.`[[Prototype]]` to `proto`.
5.  Return `O`.

Note

Although OrdinaryObjectCreate does little more than call [MakeBasicObject](#sec-makebasicobject), its use communicates the intention to create an [ordinary object](#ordinary-object), and not an exotic one. Thus, within this specification, it is not called by any algorithm that subsequently modifies the internal methods of the object in ways that would make the result non-ordinary. Operations that create [exotic objects](#exotic-object) invoke [MakeBasicObject](#sec-makebasicobject) directly.

### 10.1.13 OrdinaryCreateFromConstructor ( `constructor`, `intrinsicDefaultProto` \[ , `internalSlotsList` \] )

The abstract operation OrdinaryCreateFromConstructor takes arguments `constructor` (a [function object](#function-object)) and `intrinsicDefaultProto` (a String) and optional argument `internalSlotsList` (a [List](#sec-list-and-record-specification-type) of names of internal slots) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It creates an [ordinary object](#ordinary-object) whose `[[Prototype]]` value is retrieved from a [constructor](#constructor)'s "prototype" property, if it exists. Otherwise the intrinsic named by `intrinsicDefaultProto` is used for `[[Prototype]]`. `internalSlotsList` contains the names of additional internal slots that must be defined as part of the object. If `internalSlotsList` is not provided, a new empty [List](#sec-list-and-record-specification-type) is used. It performs the following steps when called:

1.  [Assert](#assert): `intrinsicDefaultProto` is this specification's name of an intrinsic object. The corresponding object must be an intrinsic that is intended to be used as the `[[Prototype]]` value of an object.
2.  Let `proto` be ? [GetPrototypeFromConstructor](#sec-getprototypefromconstructor)(`constructor`, `intrinsicDefaultProto`).
3.  If `internalSlotsList` is present, let `slotsList` be `internalSlotsList`.
4.  Else, let `slotsList` be a new empty [List](#sec-list-and-record-specification-type).
5.  Return [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`proto`, `slotsList`).

### 10.1.14 GetPrototypeFromConstructor ( `constructor`, `intrinsicDefaultProto` )

The abstract operation GetPrototypeFromConstructor takes arguments `constructor` (a [function object](#function-object)) and `intrinsicDefaultProto` (a String) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It determines the `[[Prototype]]` value that should be used to create an object corresponding to a specific [constructor](#constructor). The value is retrieved from the [constructor](#constructor)'s "prototype" property, if it exists. Otherwise the intrinsic named by `intrinsicDefaultProto` is used for `[[Prototype]]`. It performs the following steps when called:

1.  [Assert](#assert): `intrinsicDefaultProto` is this specification's name of an intrinsic object. The corresponding object must be an intrinsic that is intended to be used as the `[[Prototype]]` value of an object.
2.  Let `proto` be ? [Get](#sec-get-o-p)(`constructor`, "prototype").
3.  If `proto` [is not an Object](#sec-object-type), then
    1.  Let `realm` be ? [GetFunctionRealm](#sec-getfunctionrealm)(`constructor`).
    2.  Set `proto` to `realm`'s intrinsic object named `intrinsicDefaultProto`.
4.  Return `proto`.

Note

If `constructor` does not supply a `[[Prototype]]` value, the default value that is used is obtained from the [realm](#realm) of the `constructor` function rather than from the [running execution context](#running-execution-context).

### 10.1.15 RequireInternalSlot ( `O`, `internalSlot` )

The abstract operation RequireInternalSlot takes arguments `O` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `internalSlot` (an internal slot name) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It throws an exception unless `O` [is an Object](#sec-object-type) and has the given internal slot. It performs the following steps when called:

1.  If `O` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  If `O` does not have an `internalSlot` internal slot, throw a TypeError exception.
3.  Return unused.

## 10.2 ECMAScript Function Objects

ECMAScript [function objects](#function-object) encapsulate parameterized ECMAScript code closed over a lexical environment and support the dynamic evaluation of that code. An ECMAScript [function object](#function-object) is an [ordinary object](#ordinary-object) and has the same internal slots and the same internal methods as other [ordinary objects](#ordinary-object). The code of an ECMAScript [function object](#function-object) may be either [strict mode code](#sec-strict-mode-code) ([11.2.2](#sec-strict-mode-code)) or [non-strict code](#non-strict-code). An ECMAScript [function object](#function-object) whose code is [strict mode code](#sec-strict-mode-code) is called a strict function. One whose code is not [strict mode code](#sec-strict-mode-code) is called a non-strict function.

In addition to `[[Extensible]]` and `[[Prototype]]`, ECMAScript [function objects](#function-object) also have the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects).

| Internal Slot | Type | Description |
|----|----|----|
| `[[Environment]]` | an [Environment Record](#sec-environment-records) | The [Environment Record](#sec-environment-records) that the function was closed over. Used as the outer environment when evaluating the code of the function. |
| `[[PrivateEnvironment]]` | a [PrivateEnvironment Record](#privateenvironment-record) or null | The [PrivateEnvironment Record](#privateenvironment-record) for [Private Names](#sec-private-names) that the function was closed over. null if this function is not syntactically contained within a class. Used as the outer PrivateEnvironment for inner classes when evaluating the code of the function. |
| `[[FormalParameters]]` | a [Parse Node](#sec-syntactic-grammar) | The root parse node of the source text that defines the function's formal parameter list. |
| `[[ECMAScriptCode]]` | a [Parse Node](#sec-syntactic-grammar) | The root parse node of the source text that defines the function's body. |
| `[[ConstructorKind]]` | base or derived | Whether or not the function is a derived class [constructor](#constructor). |
| `[[Realm]]` | a [Realm Record](#realm-record) | The [realm](#realm) in which the function was created and which provides any intrinsic objects that are accessed when evaluating the function. |
| `[[ScriptOrModule]]` | a [Script Record](#script-record) or a [Module Record](#sec-abstract-module-records) | The script or module in which the function was created. |
| `[[ThisMode]]` | lexical, strict, or global | Defines how `this` references are interpreted within the formal parameters and code body of the function. lexical means that `this` refers to the this value of a lexically enclosing function. strict means that the this value is used exactly as provided by an invocation of the function. global means that a this value of undefined or null is interpreted as a reference to the [global object](#sec-global-object), and any other this value is first passed to [ToObject](#sec-toobject). |
| `[[Strict]]` | a Boolean | true if this is a [strict function](#strict-function), false if this is a [non-strict function](#non-strict-function). |
| `[[HomeObject]]` | an Object | If the function uses `super`, this is the object whose `[[GetPrototypeOf]]` provides the object where `super` property lookups begin. |
| `[[SourceText]]` | a sequence of Unicode code points | The [source text](#sec-source-text) that defines the function. |
| `[[Fields]]` | a [List](#sec-list-and-record-specification-type) of [ClassFieldDefinition Records](#sec-classfielddefinition-record-specification-type) | If the function is a class, this is a list of [Records](#sec-list-and-record-specification-type) representing the non-static fields and corresponding initializers of the class. |
| `[[PrivateMethods]]` | a [List](#sec-list-and-record-specification-type) of [PrivateElements](#sec-privateelement-specification-type) | If the function is a class, this is a list representing the non-static private methods and accessors of the class. |
| `[[ClassFieldInitializerName]]` | a String, a Symbol, a [Private Name](#sec-private-names), or empty | If the function is created as the initializer of a class field, the name to use for [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of the field; empty otherwise. |
| `[[IsClassConstructor]]` | a Boolean | Indicates whether the function is a class [constructor](#constructor). (If true, invoking the function's `[[Call]]` will immediately throw a TypeError exception.) |

Table 30: Internal Slots of ECMAScript Function Objects

All ECMAScript [function objects](#function-object) have the `[[Call]]` internal method defined here. ECMAScript functions that are also [constructors](#constructor) in addition have the `[[Construct]]` internal method.

### 10.2.1 `[[Call]]` ( `thisArgument`, `argumentsList` )

The `[[Call]]` internal method of an ECMAScript [function object](#function-object) `F` takes arguments `thisArgument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `callerContext` be the [running execution context](#running-execution-context).
2.  Let `calleeContext` be [PrepareForOrdinaryCall](#sec-prepareforordinarycall)(`F`, undefined).
3.  [Assert](#assert): `calleeContext` is now the [running execution context](#running-execution-context).
4.  If `F`.`[[IsClassConstructor]]` is true, then
    1.  Let `error` be a newly created TypeError object.
    2.  NOTE: `error` is created in `calleeContext` with `F`'s associated [Realm Record](#realm-record).
    3.  Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
    4.  Return [ThrowCompletion](#sec-throwcompletion)(`error`).
5.  Perform [OrdinaryCallBindThis](#sec-ordinarycallbindthis)(`F`, `calleeContext`, `thisArgument`).
6.  Let `result` be [Completion](#sec-completion-ao)([OrdinaryCallEvaluateBody](#sec-ordinarycallevaluatebody)(`F`, `argumentsList`)).
7.  Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
8.  If `result` is a [return completion](#sec-completion-record-specification-type), return `result`.`[[Value]]`.
9.  [Assert](#assert): `result` is a [throw completion](#sec-completion-record-specification-type).
10. Return ? `result`.

Note

When `calleeContext` is removed from the [execution context stack](#execution-context-stack) in step [7](#step-call-pop-context-stack) it must not be destroyed if it is suspended and retained for later resumption by an accessible Generator.

#### 10.2.1.1 PrepareForOrdinaryCall ( `F`, `newTarget` )

The abstract operation PrepareForOrdinaryCall takes arguments `F` (an ECMAScript [function object](#function-object)) and `newTarget` (an Object or undefined) and returns an [execution context](#sec-execution-contexts). It performs the following steps when called:

1.  Let `callerContext` be the [running execution context](#running-execution-context).
2.  Let `calleeContext` be a new [ECMAScript code execution context](#ecmascript-code-execution-context).
3.  Set the Function of `calleeContext` to `F`.
4.  Let `calleeRealm` be `F`.`[[Realm]]`.
5.  Set the [Realm](#realm) of `calleeContext` to `calleeRealm`.
6.  Set the ScriptOrModule of `calleeContext` to `F`.`[[ScriptOrModule]]`.
7.  Let `localEnv` be [NewFunctionEnvironment](#sec-newfunctionenvironment)(`F`, `newTarget`).
8.  Set the LexicalEnvironment of `calleeContext` to `localEnv`.
9.  Set the VariableEnvironment of `calleeContext` to `localEnv`.
10. Set the PrivateEnvironment of `calleeContext` to `F`.`[[PrivateEnvironment]]`.
11. If `callerContext` is not already suspended, suspend `callerContext`.
12. Push `calleeContext` onto the [execution context stack](#execution-context-stack); `calleeContext` is now the [running execution context](#running-execution-context).
13. NOTE: Any exception objects produced after this point are associated with `calleeRealm`.
14. Return `calleeContext`.

#### 10.2.1.2 OrdinaryCallBindThis ( `F`, `calleeContext`, `thisArgument` )

The abstract operation OrdinaryCallBindThis takes arguments `F` (an ECMAScript [function object](#function-object)), `calleeContext` (an [execution context](#sec-execution-contexts)), and `thisArgument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns unused. It performs the following steps when called:

1.  Let `thisMode` be `F`.`[[ThisMode]]`.
2.  If `thisMode` is lexical, return unused.
3.  Let `calleeRealm` be `F`.`[[Realm]]`.
4.  Let `localEnv` be the LexicalEnvironment of `calleeContext`.
5.  If `thisMode` is strict, then
    1.  Let `thisValue` be `thisArgument`.
6.  Else,
    1.  If `thisArgument` is either undefined or null, then
        1.  Let `globalEnv` be `calleeRealm`.`[[GlobalEnv]]`.
        2.  [Assert](#assert): `globalEnv` is a [Global Environment Record](#sec-global-environment-records).
        3.  Let `thisValue` be `globalEnv`.`[[GlobalThisValue]]`.
    2.  Else,
        1.  Let `thisValue` be ! [ToObject](#sec-toobject)(`thisArgument`).
        2.  NOTE: [ToObject](#sec-toobject) produces wrapper objects using `calleeRealm`.
7.  [Assert](#assert): `localEnv` is a [Function Environment Record](#sec-function-environment-records).
8.  [Assert](#assert): The next step never returns an [abrupt completion](#sec-completion-record-specification-type) because `localEnv`.`[[ThisBindingStatus]]` is not initialized.
9.  Perform ! [BindThisValue](#sec-bindthisvalue)(`localEnv`, `thisValue`).
10. Return unused.

#### 10.2.1.3 Runtime Semantics: EvaluateBody

The [syntax-directed operation](#sec-algorithm-conventions-syntax-directed-operations) EvaluateBody takes arguments `functionObject` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It is defined piecewise over the following productions:

[FunctionBody](#prod-FunctionBody) : [FunctionStatementList](#prod-FunctionStatementList)

1.  Return ? [EvaluateFunctionBody](#sec-runtime-semantics-evaluatefunctionbody) of [FunctionBody](#prod-FunctionBody) with arguments `functionObject` and `argumentsList`.

[ConciseBody](#prod-ConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return ? [EvaluateConciseBody](#sec-runtime-semantics-evaluateconcisebody) of [ConciseBody](#prod-ConciseBody) with arguments `functionObject` and `argumentsList`.

[GeneratorBody](#prod-GeneratorBody) : [FunctionBody](#prod-FunctionBody)

1.  Return ? [EvaluateGeneratorBody](#sec-runtime-semantics-evaluategeneratorbody) of [GeneratorBody](#prod-GeneratorBody) with arguments `functionObject` and `argumentsList`.

[AsyncGeneratorBody](#prod-AsyncGeneratorBody) : [FunctionBody](#prod-FunctionBody)

1.  Return ? [EvaluateAsyncGeneratorBody](#sec-runtime-semantics-evaluateasyncgeneratorbody) of [AsyncGeneratorBody](#prod-AsyncGeneratorBody) with arguments `functionObject` and `argumentsList`.

[AsyncFunctionBody](#prod-AsyncFunctionBody) : [FunctionBody](#prod-FunctionBody)

1.  Return ? [EvaluateAsyncFunctionBody](#sec-runtime-semantics-evaluateasyncfunctionbody) of [AsyncFunctionBody](#prod-AsyncFunctionBody) with arguments `functionObject` and `argumentsList`.

[AsyncConciseBody](#prod-AsyncConciseBody) : [ExpressionBody](#prod-ExpressionBody)

1.  Return ? [EvaluateAsyncConciseBody](#sec-runtime-semantics-evaluateasyncconcisebody) of [AsyncConciseBody](#prod-AsyncConciseBody) with arguments `functionObject` and `argumentsList`.

[Initializer](#prod-Initializer) : = [AssignmentExpression](#prod-AssignmentExpression)

1.  [Assert](#assert): `argumentsList` is empty.
2.  [Assert](#assert): `functionObject`.`[[ClassFieldInitializerName]]` is not empty.
3.  If [IsAnonymousFunctionDefinition](#sec-isanonymousfunctiondefinition)([AssignmentExpression](#prod-AssignmentExpression)) is true, then
    1.  Let `value` be ? [NamedEvaluation](#sec-runtime-semantics-namedevaluation) of [Initializer](#prod-Initializer) with argument `functionObject`.`[[ClassFieldInitializerName]]`.
4.  Else,
    1.  Let `rhs` be ? [Evaluation](#sec-evaluation) of [AssignmentExpression](#prod-AssignmentExpression).
    2.  Let `value` be ? [GetValue](#sec-getvalue)(`rhs`).
5.  Return [ReturnCompletion](#sec-returncompletion)(`value`).

Note

Even though field initializers constitute a function boundary, calling [FunctionDeclarationInstantiation](#sec-functiondeclarationinstantiation) does not have any observable effect and so is omitted.

[ClassStaticBlockBody](#prod-ClassStaticBlockBody) : [ClassStaticBlockStatementList](#prod-ClassStaticBlockStatementList)

1.  [Assert](#assert): `argumentsList` is empty.
2.  Return ? [EvaluateClassStaticBlockBody](#sec-runtime-semantics-evaluateclassstaticblockbody) of [ClassStaticBlockBody](#prod-ClassStaticBlockBody) with argument `functionObject`.

#### 10.2.1.4 OrdinaryCallEvaluateBody ( `F`, `argumentsList` )

The abstract operation OrdinaryCallEvaluateBody takes arguments `F` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns a [return completion](#sec-completion-record-specification-type) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [EvaluateBody](#sec-runtime-semantics-evaluatebody) of `F`.`[[ECMAScriptCode]]` with arguments `F` and `argumentsList`.

### 10.2.2 `[[Construct]]` ( `argumentsList`, `newTarget` )

The `[[Construct]]` internal method of an ECMAScript [function object](#function-object) `F` takes arguments `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and `newTarget` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `callerContext` be the [running execution context](#running-execution-context).
2.  Let `kind` be `F`.`[[ConstructorKind]]`.
3.  If `kind` is base, then
    1.  Let `thisArgument` be ? [OrdinaryCreateFromConstructor](#sec-ordinarycreatefromconstructor)(`newTarget`, "%Object.prototype%").
4.  Let `calleeContext` be [PrepareForOrdinaryCall](#sec-prepareforordinarycall)(`F`, `newTarget`).
5.  [Assert](#assert): `calleeContext` is now the [running execution context](#running-execution-context).
6.  If `kind` is base, then
    1.  Perform [OrdinaryCallBindThis](#sec-ordinarycallbindthis)(`F`, `calleeContext`, `thisArgument`).
    2.  Let `initializeResult` be [Completion](#sec-completion-ao)([InitializeInstanceElements](#sec-initializeinstanceelements)(`thisArgument`, `F`)).
    3.  If `initializeResult` is an [abrupt completion](#sec-completion-record-specification-type), then
        1.  Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
        2.  Return ? `initializeResult`.
7.  Let `constructorEnv` be the LexicalEnvironment of `calleeContext`.
8.  Let `result` be [Completion](#sec-completion-ao)([OrdinaryCallEvaluateBody](#sec-ordinarycallevaluatebody)(`F`, `argumentsList`)).
9.  Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
10. If `result` is a [throw completion](#sec-completion-record-specification-type), then
    1.  Return ? `result`.
11. [Assert](#assert): `result` is a [return completion](#sec-completion-record-specification-type).
12. If `result`.`[[Value]]` [is an Object](#sec-object-type), return `result`.`[[Value]]`.
13. If `kind` is base, return `thisArgument`.
14. If `result`.`[[Value]]` is not undefined, throw a TypeError exception.
15. Let `thisBinding` be ? `constructorEnv`.GetThisBinding().
16. [Assert](#assert): `thisBinding` [is an Object](#sec-object-type).
17. Return `thisBinding`.

### 10.2.3 OrdinaryFunctionCreate ( `functionPrototype`, `sourceText`, `ParameterList`, `Body`, `thisMode`, `env`, `privateEnv` )

The abstract operation OrdinaryFunctionCreate takes arguments `functionPrototype` (an Object), `sourceText` (a sequence of Unicode code points), `ParameterList` (a [Parse Node](#sec-syntactic-grammar)), `Body` (a [Parse Node](#sec-syntactic-grammar)), `thisMode` (lexical-this or non-lexical-this), `env` (an [Environment Record](#sec-environment-records)), and `privateEnv` (a [PrivateEnvironment Record](#privateenvironment-record) or null) and returns an ECMAScript [function object](#function-object). It is used to specify the runtime creation of a new function with a default `[[Call]]` internal method and no `[[Construct]]` internal method (although one may be subsequently added by an operation such as [MakeConstructor](#sec-makeconstructor)). `sourceText` is the source text of the syntactic definition of the function to be created. It performs the following steps when called:

1.  Let `internalSlotsList` be the internal slots listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects).
2.  Let `F` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(`functionPrototype`, `internalSlotsList`).
3.  Set `F`.`[[Call]]` to the definition specified in [10.2.1](#sec-ecmascript-function-objects-call-thisargument-argumentslist).
4.  Set `F`.`[[SourceText]]` to `sourceText`.
5.  Set `F`.`[[FormalParameters]]` to `ParameterList`.
6.  Set `F`.`[[ECMAScriptCode]]` to `Body`.
7.  Let `Strict` be [IsStrict](#sec-isstrict)(`Body`).
8.  Set `F`.`[[Strict]]` to `Strict`.
9.  If `thisMode` is lexical-this, set `F`.`[[ThisMode]]` to lexical.
10. Else if `Strict` is true, set `F`.`[[ThisMode]]` to strict.
11. Else, set `F`.`[[ThisMode]]` to global.
12. Set `F`.`[[IsClassConstructor]]` to false.
13. Set `F`.`[[Environment]]` to `env`.
14. Set `F`.`[[PrivateEnvironment]]` to `privateEnv`.
15. Set `F`.`[[ScriptOrModule]]` to [GetActiveScriptOrModule](#sec-getactivescriptormodule)().
16. Set `F`.`[[Realm]]` to [the current Realm Record](#current-realm).
17. Set `F`.`[[HomeObject]]` to undefined.
18. Set `F`.`[[Fields]]` to a new empty [List](#sec-list-and-record-specification-type).
19. Set `F`.`[[PrivateMethods]]` to a new empty [List](#sec-list-and-record-specification-type).
20. Set `F`.`[[ClassFieldInitializerName]]` to empty.
21. Let `len` be the [ExpectedArgumentCount](#sec-static-semantics-expectedargumentcount) of `ParameterList`.
22. Perform [SetFunctionLength](#sec-setfunctionlength)(`F`, `len`).
23. Return `F`.

### 10.2.4 AddRestrictedFunctionProperties ( `F`, `realm` )

The abstract operation AddRestrictedFunctionProperties takes arguments `F` (a [function object](#function-object)) and `realm` (a [Realm Record](#realm-record)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `realm`.`[[Intrinsics]]`.\[\[[%ThrowTypeError%](#sec-%throwtypeerror%)\]\] exists and has been initialized.
2.  Let `thrower` be `realm`.`[[Intrinsics]]`.\[\[[%ThrowTypeError%](#sec-%throwtypeerror%)\]\].
3.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "caller", PropertyDescriptor { `[[Get]]`: `thrower`, `[[Set]]`: `thrower`, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
4.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "arguments", PropertyDescriptor { `[[Get]]`: `thrower`, `[[Set]]`: `thrower`, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
5.  Return unused.

#### 10.2.4.1 %ThrowTypeError% ( )

This function is the %ThrowTypeError% intrinsic object.

It is an anonymous built-in [function object](#function-object) that is defined once for each [realm](#realm).

It performs the following steps when called:

1.  Throw a TypeError exception.

The value of the `[[Extensible]]` internal slot of this function is false.

The "length" property of this function has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

The "name" property of this function has the attributes { `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }.

### 10.2.5 MakeConstructor ( `F` \[ , `writablePrototype` \[ , `prototype` \] \] )

The abstract operation MakeConstructor takes argument `F` (an ECMAScript [function object](#function-object) or a built-in [function object](#function-object)) and optional arguments `writablePrototype` (a Boolean) and `prototype` (an Object) and returns unused. It converts `F` into a [constructor](#constructor). It performs the following steps when called:

1.  If `F` is an ECMAScript [function object](#function-object), then
    1.  [Assert](#assert): [IsConstructor](#sec-isconstructor)(`F`) is false.
    2.  [Assert](#assert): `F` is an extensible object that does not have a "prototype" own property.
    3.  Set `F`.`[[Construct]]` to the definition specified in [10.2.2](#sec-ecmascript-function-objects-construct-argumentslist-newtarget).
2.  Else,
    1.  Set `F`.`[[Construct]]` to the definition specified in [10.3.2](#sec-built-in-function-objects-construct-argumentslist-newtarget).
3.  Set `F`.`[[ConstructorKind]]` to base.
4.  If `writablePrototype` is not present, set `writablePrototype` to true.
5.  If `prototype` is not present, then
    1.  Set `prototype` to [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object)).
    2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`prototype`, "constructor", PropertyDescriptor { `[[Value]]`: `F`, `[[Writable]]`: `writablePrototype`, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
6.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "prototype", PropertyDescriptor { `[[Value]]`: `prototype`, `[[Writable]]`: `writablePrototype`, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
7.  Return unused.

### 10.2.6 MakeClassConstructor ( `F` )

The abstract operation MakeClassConstructor takes argument `F` (an ECMAScript [function object](#function-object)) and returns unused. It performs the following steps when called:

1.  [Assert](#assert): `F`.`[[IsClassConstructor]]` is false.
2.  Set `F`.`[[IsClassConstructor]]` to true.
3.  Return unused.

### 10.2.7 MakeMethod ( `F`, `homeObject` )

The abstract operation MakeMethod takes arguments `F` (an ECMAScript [function object](#function-object)) and `homeObject` (an Object) and returns unused. It configures `F` as a method. It performs the following steps when called:

1.  [Assert](#assert): `homeObject` is an [ordinary object](#ordinary-object).
2.  Set `F`.`[[HomeObject]]` to `homeObject`.
3.  Return unused.

### 10.2.8 DefineMethodProperty ( `homeObject`, `key`, `closure`, `enumerable` )

The abstract operation DefineMethodProperty takes arguments `homeObject` (an Object), `key` (a [property key](#property-key) or [Private Name](#sec-private-names)), `closure` (a [function object](#function-object)), and `enumerable` (a Boolean) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a [PrivateElement](#sec-privateelement-specification-type) or unused, or an [abrupt completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  [Assert](#assert): `homeObject` is an ordinary, extensible object.
2.  If `key` is a [Private Name](#sec-private-names), then
    1.  Return [PrivateElement](#sec-privateelement-specification-type) { `[[Key]]`: `key`, `[[Kind]]`: method, `[[Value]]`: `closure` }.
3.  Else,
    1.  Let `desc` be the PropertyDescriptor { `[[Value]]`: `closure`, `[[Writable]]`: true, `[[Enumerable]]`: `enumerable`, `[[Configurable]]`: true }.
    2.  Perform ? [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`homeObject`, `key`, `desc`).
    3.  NOTE: [DefinePropertyOrThrow](#sec-definepropertyorthrow) only returns an [abrupt completion](#sec-completion-record-specification-type) when attempting to define a class static method whose `key` is "prototype".
    4.  Return unused.

### 10.2.9 SetFunctionName ( `F`, `name` \[ , `prefix` \] )

The abstract operation SetFunctionName takes arguments `F` (a [function object](#function-object)) and `name` (a [property key](#property-key) or [Private Name](#sec-private-names)) and optional argument `prefix` (a String) and returns unused. It adds a "name" property to `F`. It performs the following steps when called:

1.  [Assert](#assert): `F` is an extensible object that does not have a "name" own property.
2.  If `name` [is a Symbol](#sec-ecmascript-language-types-symbol-type), then
    1.  Let `description` be `name`'s `[[Description]]` value.
    2.  If `description` is undefined, set `name` to the empty String.
    3.  Else, set `name` to the [string-concatenation](#string-concatenation) of "\[", `description`, and "\]".
3.  Else if `name` is a [Private Name](#sec-private-names), then
    1.  Set `name` to `name`.`[[Description]]`.
4.  If `F` has an `[[InitialName]]` internal slot, then
    1.  Set `F`.`[[InitialName]]` to `name`.
5.  If `prefix` is present, then
    1.  Set `name` to the [string-concatenation](#string-concatenation) of `prefix`, the code unit 0x0020 (SPACE), and `name`.
    2.  If `F` has an `[[InitialName]]` internal slot, then
        1.  Optionally, set `F`.`[[InitialName]]` to `name`.
6.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "name", PropertyDescriptor { `[[Value]]`: `name`, `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
7.  Return unused.

### 10.2.10 SetFunctionLength ( `F`, `length` )

The abstract operation SetFunctionLength takes arguments `F` (a [function object](#function-object)) and `length` (a non-negative [integer](#integer) or +∞) and returns unused. It adds a "length" property to `F`. It performs the following steps when called:

1.  [Assert](#assert): `F` is an extensible object that does not have a "length" own property.
2.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`F`, "length", PropertyDescriptor { `[[Value]]`: [𝔽](#𝔽)(`length`), `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
3.  Return unused.

### 10.2.11 FunctionDeclarationInstantiation ( `func`, `argumentsList` )

The abstract operation FunctionDeclarationInstantiation takes arguments `func` (an ECMAScript [function object](#function-object)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or an [abrupt completion](#sec-completion-record-specification-type). `func` is the [function object](#function-object) for which the [execution context](#sec-execution-contexts) is being established.

Note 1

When an [execution context](#sec-execution-contexts) is established for evaluating an ECMAScript function a new [Function Environment Record](#sec-function-environment-records) is created and bindings for each formal parameter are instantiated in that [Environment Record](#sec-environment-records). Each declaration in the function body is also instantiated. If the function's formal parameters do not include any default value initializers then the body declarations are instantiated in the same [Environment Record](#sec-environment-records) as the parameters. If default value parameter initializers exist, a second [Environment Record](#sec-environment-records) is created for the body declarations. Formal parameters and functions are initialized as part of FunctionDeclarationInstantiation. All other bindings are initialized during evaluation of the function body.

It performs the following steps when called:

1.  Let `calleeContext` be the [running execution context](#running-execution-context).
2.  Let `code` be `func`.`[[ECMAScriptCode]]`.
3.  Let `strict` be `func`.`[[Strict]]`.
4.  Let `formals` be `func`.`[[FormalParameters]]`.
5.  Let `parameterNames` be the [BoundNames](#sec-static-semantics-boundnames) of `formals`.
6.  If `parameterNames` has any duplicate entries, let `hasDuplicates` be true. Otherwise, let `hasDuplicates` be false.
7.  Let `simpleParameterList` be [IsSimpleParameterList](#sec-static-semantics-issimpleparameterlist) of `formals`.
8.  Let `hasParameterExpressions` be [ContainsExpression](#sec-static-semantics-containsexpression) of `formals`.
9.  Let `varNames` be the [VarDeclaredNames](#sec-static-semantics-vardeclarednames) of `code`.
10. Let `varDeclarations` be the [VarScopedDeclarations](#sec-static-semantics-varscopeddeclarations) of `code`.
11. Let `lexicalNames` be the [LexicallyDeclaredNames](#sec-static-semantics-lexicallydeclarednames) of `code`.
12. Let `functionNames` be a new empty [List](#sec-list-and-record-specification-type).
13. Let `functionsToInitialize` be a new empty [List](#sec-list-and-record-specification-type).
14. For each element `d` of `varDeclarations`, in reverse [List](#sec-list-and-record-specification-type) order, do
    1.  If `d` is neither a [VariableDeclaration](#prod-VariableDeclaration) nor a [ForBinding](#prod-ForBinding) nor a [BindingIdentifier](#prod-BindingIdentifier), then
        1.  [Assert](#assert): `d` is either a [FunctionDeclaration](#prod-FunctionDeclaration), a [GeneratorDeclaration](#prod-GeneratorDeclaration), an [AsyncFunctionDeclaration](#prod-AsyncFunctionDeclaration), or an [AsyncGeneratorDeclaration](#prod-AsyncGeneratorDeclaration).
        2.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `d`.
        3.  If `functionNames` does not contain `fn`, then
            1.  Insert `fn` as the first element of `functionNames`.
            2.  NOTE: If there are multiple function declarations for the same name, the last declaration is used.
            3.  Insert `d` as the first element of `functionsToInitialize`.
15. Let `argumentsObjectNeeded` be true.
16. If `func`.`[[ThisMode]]` is lexical, then
    1.  NOTE: Arrow functions never have an arguments object.
    2.  Set `argumentsObjectNeeded` to false.
17. Else if `parameterNames` contains "arguments", then
    1.  Set `argumentsObjectNeeded` to false.
18. Else if `hasParameterExpressions` is false, then
    1.  If `functionNames` contains "arguments" or `lexicalNames` contains "arguments", then
        1.  Set `argumentsObjectNeeded` to false.
19. If `strict` is true or `hasParameterExpressions` is false, then
    1.  NOTE: Only a single [Environment Record](#sec-environment-records) is needed for the parameters, since calls to `eval` in [strict mode code](#sec-strict-mode-code) cannot create new bindings which are visible outside of the `eval`.
    2.  Let `env` be the LexicalEnvironment of `calleeContext`.
20. Else,
    1.  NOTE: A separate [Environment Record](#sec-environment-records) is needed to ensure that bindings created by [direct eval](#sec-function-calls-runtime-semantics-evaluation) calls in the formal parameter list are outside the environment where parameters are declared.
    2.  Let `calleeEnv` be the LexicalEnvironment of `calleeContext`.
    3.  Let `env` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`calleeEnv`).
    4.  [Assert](#assert): The VariableEnvironment of `calleeContext` and `calleeEnv` are the same [Environment Record](#sec-environment-records).
    5.  Set the LexicalEnvironment of `calleeContext` to `env`.
21. For each String `paramName` of `parameterNames`, do
    1.  Let `alreadyDeclared` be ! `env`.HasBinding(`paramName`).
    2.  NOTE: [Early errors](#early-error) ensure that duplicate parameter names can only occur in [non-strict functions](#non-strict-function) that do not have parameter default values or rest parameters.
    3.  If `alreadyDeclared` is false, then
        1.  Perform ! `env`.CreateMutableBinding(`paramName`, false).
        2.  If `hasDuplicates` is true, then
            1.  Perform ! `env`.InitializeBinding(`paramName`, undefined).
22. If `argumentsObjectNeeded` is true, then
    1.  If `strict` is true or `simpleParameterList` is false, then
        1.  Let `ao` be [CreateUnmappedArgumentsObject](#sec-createunmappedargumentsobject)(`argumentsList`).
    2.  Else,
        1.  NOTE: A mapped argument object is only provided for [non-strict functions](#non-strict-function) that don't have a rest parameter, any parameter default value initializers, or any destructured parameters.
        2.  Let `ao` be [CreateMappedArgumentsObject](#sec-createmappedargumentsobject)(`func`, `formals`, `argumentsList`, `env`).
    3.  If `strict` is true, then
        1.  Perform ! `env`.CreateImmutableBinding("arguments", false).
        2.  NOTE: In [strict mode code](#sec-strict-mode-code) [early errors](#early-error) prevent attempting to assign to this binding, so its mutability is not observable.
    4.  Else,
        1.  Perform ! `env`.CreateMutableBinding("arguments", false).
    5.  Perform ! `env`.InitializeBinding("arguments", `ao`).
    6.  Let `parameterBindings` be the [list-concatenation](#list-concatenation) of `parameterNames` and « "arguments" ».
23. Else,
    1.  Let `parameterBindings` be `parameterNames`.
24. Let `iteratorRecord` be [CreateListIteratorRecord](#sec-createlistiteratorRecord)(`argumentsList`).
25. If `hasDuplicates` is true, then
    1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of `formals` with arguments `iteratorRecord` and undefined.
26. Else,
    1.  Perform ? [IteratorBindingInitialization](#sec-runtime-semantics-iteratorbindinginitialization) of `formals` with arguments `iteratorRecord` and `env`.
27. If `hasParameterExpressions` is false, then
    1.  NOTE: Only a single [Environment Record](#sec-environment-records) is needed for the parameters and top-level vars.
    2.  Let `instantiatedVarNames` be a copy of the [List](#sec-list-and-record-specification-type) `parameterBindings`.
    3.  For each element `n` of `varNames`, do
        1.  If `instantiatedVarNames` does not contain `n`, then
            1.  Append `n` to `instantiatedVarNames`.
            2.  Perform ! `env`.CreateMutableBinding(`n`, false).
            3.  Perform ! `env`.InitializeBinding(`n`, undefined).
    4.  Let `varEnv` be `env`.
28. Else,
    1.  NOTE: A separate [Environment Record](#sec-environment-records) is needed to ensure that closures created by expressions in the formal parameter list do not have visibility of declarations in the function body.
    2.  Let `varEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`env`).
    3.  Set the VariableEnvironment of `calleeContext` to `varEnv`.
    4.  Let `instantiatedVarNames` be a new empty [List](#sec-list-and-record-specification-type).
    5.  For each element `n` of `varNames`, do
        1.  If `instantiatedVarNames` does not contain `n`, then
            1.  Append `n` to `instantiatedVarNames`.
            2.  Perform ! `varEnv`.CreateMutableBinding(`n`, false).
            3.  If `parameterBindings` does not contain `n`, or if `functionNames` contains `n`, then
                1.  Let `initialValue` be undefined.
            4.  Else,
                1.  Let `initialValue` be ! `env`.GetBindingValue(`n`, false).
            5.  Perform ! `varEnv`.InitializeBinding(`n`, `initialValue`).
            6.  NOTE: A var with the same name as a formal parameter initially has the same value as the corresponding initialized parameter.
29. NOTE: Annex [B.3.2.1](#sec-web-compat-functiondeclarationinstantiation) adds additional steps at this point.
30. If `strict` is false, then
    1.  Let `lexEnv` be [NewDeclarativeEnvironment](#sec-newdeclarativeenvironment)(`varEnv`).
    2.  NOTE: [Non-strict functions](#non-strict-function) use a separate [Environment Record](#sec-environment-records) for top-level lexical declarations so that a [direct eval](#sec-function-calls-runtime-semantics-evaluation) can determine whether any var scoped declarations introduced by the eval code conflict with pre-existing top-level lexically scoped declarations. This is not needed for [strict functions](#strict-function) because a strict [direct eval](#sec-function-calls-runtime-semantics-evaluation) always places all declarations into a new [Environment Record](#sec-environment-records).
31. Else,
    1.  Let `lexEnv` be `varEnv`.
32. Set the LexicalEnvironment of `calleeContext` to `lexEnv`.
33. Let `lexDeclarations` be the [LexicallyScopedDeclarations](#sec-static-semantics-lexicallyscopeddeclarations) of `code`.
34. For each element `d` of `lexDeclarations`, do
    1.  NOTE: A lexically declared name cannot be the same as a function/generator declaration, formal parameter, or a var name. Lexically declared names are only instantiated here but not initialized.
    2.  For each element `dn` of the [BoundNames](#sec-static-semantics-boundnames) of `d`, do
        1.  If [IsConstantDeclaration](#sec-static-semantics-isconstantdeclaration) of `d` is true, then
            1.  Perform ! `lexEnv`.CreateImmutableBinding(`dn`, true).
        2.  Else,
            1.  Perform ! `lexEnv`.CreateMutableBinding(`dn`, false).
35. Let `privateEnv` be the PrivateEnvironment of `calleeContext`.
36. For each [Parse Node](#sec-syntactic-grammar) `f` of `functionsToInitialize`, do
    1.  Let `fn` be the sole element of the [BoundNames](#sec-static-semantics-boundnames) of `f`.
    2.  Let `fo` be [InstantiateFunctionObject](#sec-runtime-semantics-instantiatefunctionobject) of `f` with arguments `lexEnv` and `privateEnv`.
    3.  Perform ! `varEnv`.SetMutableBinding(`fn`, `fo`, false).
37. Return unused.

Note 2

[B.3.2](#sec-block-level-function-declarations-web-legacy-compatibility-semantics) provides an extension to the above algorithm that is necessary for backwards compatibility with web browser implementations of ECMAScript that predate ECMAScript 2015.

## 10.3 Built-in Function Objects

A built-in [function object](#function-object) is an [ordinary object](#ordinary-object); it must satisfy the requirements for [ordinary objects](#ordinary-object) set out in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots).

In addition to the internal slots required of every [ordinary object](#ordinary-object) (see [10.1](#sec-ordinary-object-internal-methods-and-internal-slots)), a built-in [function object](#function-object) must also have the following internal slots:

- `[[Realm]]`, a [Realm Record](#realm-record) that represents the [realm](#realm) in which the function was created.
- `[[InitialName]]`, a String that is the initial name of the function. It is used by [20.2.3.5](#sec-function.prototype.tostring).

The initial value of a built-in [function object](#function-object)'s `[[Prototype]]` internal slot is [%Function.prototype%](#sec-properties-of-the-function-prototype-object), unless otherwise specified.

A built-in [function object](#function-object) must have a `[[Call]]` internal method that conforms to the definition in [10.3.1](#sec-built-in-function-objects-call-thisargument-argumentslist).

A built-in [function object](#function-object) has a `[[Construct]]` internal method if and only if it is described as a “[constructor](#constructor)”, or some algorithm in this specification explicitly sets its `[[Construct]]` internal method. Such a `[[Construct]]` internal method must conform to the definition in [10.3.2](#sec-built-in-function-objects-construct-argumentslist-newtarget).

An implementation may provide additional built-in [function objects](#function-object) that are not defined in this specification.

### 10.3.1 `[[Call]]` ( `thisArgument`, `argumentsList` )

The `[[Call]]` internal method of a built-in [function object](#function-object) `F` takes arguments `thisArgument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [BuiltinCallOrConstruct](#sec-builtincallorconstruct)(`F`, `thisArgument`, `argumentsList`, undefined).

### 10.3.2 `[[Construct]]` ( `argumentsList`, `newTarget` )

The `[[Construct]]` internal method of a built-in [function object](#function-object) `F` (when the method is present) takes arguments `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and `newTarget` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `result` be ? [BuiltinCallOrConstruct](#sec-builtincallorconstruct)(`F`, uninitialized, `argumentsList`, `newTarget`).
2.  [Assert](#assert): `result` [is an Object](#sec-object-type).
3.  Return `result`.

### 10.3.3 BuiltinCallOrConstruct ( `F`, `thisArgument`, `argumentsList`, `newTarget` )

The abstract operation BuiltinCallOrConstruct takes arguments `F` (a built-in [function object](#function-object)), `thisArgument` (an [ECMAScript language value](#sec-ecmascript-language-types) or uninitialized), `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)), and `newTarget` (a [constructor](#constructor) or undefined) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `callerContext` be the [running execution context](#running-execution-context).
2.  If `callerContext` is not already suspended, suspend `callerContext`.
3.  Let `calleeContext` be a new [execution context](#sec-execution-contexts).
4.  Set the Function of `calleeContext` to `F`.
5.  Let `calleeRealm` be `F`.`[[Realm]]`.
6.  Set the [Realm](#realm) of `calleeContext` to `calleeRealm`.
7.  Set the ScriptOrModule of `calleeContext` to null.
8.  Perform any necessary [implementation-defined](#implementation-defined) initialization of `calleeContext`.
9.  Push `calleeContext` onto the [execution context stack](#execution-context-stack); `calleeContext` is now the [running execution context](#running-execution-context).
10. Let `result` be the [Completion Record](#sec-completion-record-specification-type) that is the result of evaluating `F` in a manner that conforms to the specification of `F`. If `thisArgument` is uninitialized, the this value is uninitialized; otherwise, `thisArgument` provides the this value. `argumentsList` provides the named parameters. `newTarget` provides the NewTarget value.
11. NOTE: If `F` is defined in this document, “the specification of `F`” is the behaviour specified for it via algorithm steps or other means.
12. Remove `calleeContext` from the [execution context stack](#execution-context-stack) and restore `callerContext` as the [running execution context](#running-execution-context).
13. Return ? `result`.

Note

When `calleeContext` is removed from the [execution context stack](#execution-context-stack) it must not be destroyed if it has been suspended and retained by an accessible Generator for later resumption.

### 10.3.4 CreateBuiltinFunction ( `behaviour`, `length`, `name`, `additionalInternalSlotsList` \[ , `realm` \[ , `prototype` \[ , `prefix` \] \] \] )

The abstract operation CreateBuiltinFunction takes arguments `behaviour` (an [Abstract Closure](#sec-abstract-closure), a set of algorithm steps, or some other definition of a function's behaviour provided in this specification), `length` (a non-negative [integer](#integer) or +∞), `name` (a [property key](#property-key) or a [Private Name](#sec-private-names)), and `additionalInternalSlotsList` (a [List](#sec-list-and-record-specification-type) of names of internal slots) and optional arguments `realm` (a [Realm Record](#realm-record)), `prototype` (an Object or null), and `prefix` (a String) and returns a built-in [function object](#function-object). `additionalInternalSlotsList` contains the names of additional internal slots that must be defined as part of the object. This operation creates a built-in [function object](#function-object). It performs the following steps when called:

1.  If `realm` is not present, set `realm` to [the current Realm Record](#current-realm).
2.  If `prototype` is not present, set `prototype` to `realm`.`[[Intrinsics]]`.\[\[[%Function.prototype%](#sec-properties-of-the-function-prototype-object)\]\].
3.  Let `internalSlotsList` be a [List](#sec-list-and-record-specification-type) containing the names of all the internal slots that [10.3](#sec-built-in-function-objects) requires for the built-in [function object](#function-object) that is about to be created.
4.  Append to `internalSlotsList` the elements of `additionalInternalSlotsList`.
5.  Let `func` be a new built-in [function object](#function-object) that, when called, performs the action described by `behaviour` using the provided arguments as the values of the corresponding parameters specified by `behaviour`. The new [function object](#function-object) has internal slots whose names are the elements of `internalSlotsList`, and an `[[InitialName]]` internal slot.
6.  Set `func`.`[[Prototype]]` to `prototype`.
7.  Set `func`.`[[Extensible]]` to true.
8.  Set `func`.`[[Realm]]` to `realm`.
9.  Set `func`.`[[InitialName]]` to null.
10. Perform [SetFunctionLength](#sec-setfunctionlength)(`func`, `length`).
11. If `prefix` is not present, then
    1.  Perform [SetFunctionName](#sec-setfunctionname)(`func`, `name`).
12. Else,
    1.  Perform [SetFunctionName](#sec-setfunctionname)(`func`, `name`, `prefix`).
13. Return `func`.

Each built-in function defined in this specification is created by calling the CreateBuiltinFunction abstract operation.

## 10.4 Built-in Exotic Object Internal Methods and Slots

This specification defines several kinds of built-in [exotic objects](#exotic-object). These objects generally behave similar to [ordinary objects](#ordinary-object) except for a few specific situations. The following [exotic objects](#exotic-object) use the [ordinary object](#ordinary-object) internal methods except where it is explicitly specified otherwise below:

### 10.4.1 Bound Function Exotic Objects

A [bound function exotic object](#bound-function-exotic-object) is an [exotic object](#exotic-object) that wraps another [function object](#function-object). A [bound function exotic object](#bound-function-exotic-object) is callable (it has a `[[Call]]` internal method and may have a `[[Construct]]` internal method). Calling a [bound function exotic object](#bound-function-exotic-object) generally results in a call of its wrapped function.

An object is a bound function exotic object if its `[[Call]]` and (if applicable) `[[Construct]]` internal methods use the following implementations, and its other essential internal methods use the definitions found in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots). These methods are installed in [BoundFunctionCreate](#sec-boundfunctioncreate).

[Bound function exotic objects](#bound-function-exotic-object) do not have the internal slots of ECMAScript [function objects](#function-object) listed in [Table 30](#table-internal-slots-of-ecmascript-function-objects). Instead they have the internal slots listed in [Table 31](#table-internal-slots-of-bound-function-exotic-objects), in addition to `[[Prototype]]` and `[[Extensible]]`.

| Internal Slot | Type | Description |
|----|----|----|
| `[[BoundTargetFunction]]` | a callable Object | The wrapped [function object](#function-object). |
| `[[BoundThis]]` | an [ECMAScript language value](#sec-ecmascript-language-types) | The value that is always passed as the this value when calling the wrapped function. |
| `[[BoundArguments]]` | a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types) | A list of values whose elements are used as the first arguments to any call to the wrapped function. |

Table 31: Internal Slots of Bound Function Exotic Objects

#### 10.4.1.1 `[[Call]]` ( `thisArgument`, `argumentsList` )

The `[[Call]]` internal method of a [bound function exotic object](#bound-function-exotic-object) `F` takes arguments `thisArgument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `target` be `F`.`[[BoundTargetFunction]]`.
2.  Let `boundThis` be `F`.`[[BoundThis]]`.
3.  Let `boundArgs` be `F`.`[[BoundArguments]]`.
4.  Let `args` be the [list-concatenation](#list-concatenation) of `boundArgs` and `argumentsList`.
5.  Return ? [Call](#sec-call)(`target`, `boundThis`, `args`).

#### 10.4.1.2 `[[Construct]]` ( `argumentsList`, `newTarget` )

The `[[Construct]]` internal method of a [bound function exotic object](#bound-function-exotic-object) `F` takes arguments `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and `newTarget` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `target` be `F`.`[[BoundTargetFunction]]`.
2.  [Assert](#assert): [IsConstructor](#sec-isconstructor)(`target`) is true.
3.  Let `boundArgs` be `F`.`[[BoundArguments]]`.
4.  Let `args` be the [list-concatenation](#list-concatenation) of `boundArgs` and `argumentsList`.
5.  If [SameValue](#sec-samevalue)(`F`, `newTarget`) is true, set `newTarget` to `target`.
6.  Return ? [Construct](#sec-construct)(`target`, `args`, `newTarget`).

#### 10.4.1.3 BoundFunctionCreate ( `targetFunction`, `boundThis`, `boundArgs` )

The abstract operation BoundFunctionCreate takes arguments `targetFunction` (a [function object](#function-object)), `boundThis` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `boundArgs` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [function object](#function-object) or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of new [bound function exotic objects](#bound-function-exotic-object). It performs the following steps when called:

1.  Let `proto` be ? `targetFunction`.`[[GetPrototypeOf]]`().
2.  Let `internalSlotsList` be the [list-concatenation](#list-concatenation) of « `[[Prototype]]`, `[[Extensible]]` » and the internal slots listed in [Table 31](#table-internal-slots-of-bound-function-exotic-objects).
3.  Let `obj` be [MakeBasicObject](#sec-makebasicobject)(`internalSlotsList`).
4.  Set `obj`.`[[Prototype]]` to `proto`.
5.  Set `obj`.`[[Call]]` as described in [10.4.1.1](#sec-bound-function-exotic-objects-call-thisargument-argumentslist).
6.  If [IsConstructor](#sec-isconstructor)(`targetFunction`) is true, then
    1.  Set `obj`.`[[Construct]]` as described in [10.4.1.2](#sec-bound-function-exotic-objects-construct-argumentslist-newtarget).
7.  Set `obj`.`[[BoundTargetFunction]]` to `targetFunction`.
8.  Set `obj`.`[[BoundThis]]` to `boundThis`.
9.  Set `obj`.`[[BoundArguments]]` to `boundArgs`.
10. Return `obj`.

### 10.4.2 Array Exotic Objects

An Array is an [exotic object](#exotic-object) that gives special treatment to [array index](#array-index) [property keys](#property-key) (see [6.1.7](#sec-object-type)). A property whose [property name](#property-name) is an [array index](#array-index) is also called an *element*. Every Array has a non-configurable "length" property whose value is always a non-negative [integral Number](#integral-number) whose [mathematical value](#mathematical-value) is strictly less than 2\*\*³². The value of the "length" property is numerically greater than the name of every own property whose name is an [array index](#array-index); whenever an own property of an Array is created or changed, other properties are adjusted as necessary to maintain this invariant. Specifically, whenever an own property is added whose name is an [array index](#array-index), the value of the "length" property is changed, if necessary, to be one more than the numeric value of that [array index](#array-index); and whenever the value of the "length" property is changed, every own property whose name is an [array index](#array-index) whose value is not smaller than the new length is deleted. This constraint applies only to own properties of an Array and is unaffected by "length" or [array index](#array-index) properties that may be inherited from its prototypes.

An object is an Array exotic object (or simply, an Array) if its `[[DefineOwnProperty]]` internal method uses the following implementation, and its other essential internal methods use the definitions found in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots). These methods are installed in [ArrayCreate](#sec-arraycreate).

#### 10.4.2.1 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of an [Array exotic object](#array-exotic-object) `A` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` is "length", then
    1.  Return ? [ArraySetLength](#sec-arraysetlength)(`A`, `Desc`).
2.  Else if `P` is an [array index](#array-index), then
    1.  Let `lengthDesc` be [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`A`, "length").
    2.  [Assert](#assert): [IsDataDescriptor](#sec-isdatadescriptor)(`lengthDesc`) is true.
    3.  [Assert](#assert): `lengthDesc`.`[[Configurable]]` is false.
    4.  Let `length` be `lengthDesc`.`[[Value]]`.
    5.  [Assert](#assert): `length` is a non-negative [integral Number](#integral-number).
    6.  Let `index` be ! [ToUint32](#sec-touint32)(`P`).
    7.  If `index` ≥ `length` and `lengthDesc`.`[[Writable]]` is false, return false.
    8.  Let `succeeded` be ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, `P`, `Desc`).
    9.  If `succeeded` is false, return false.
    10. If `index` ≥ `length`, then
        1.  Set `lengthDesc`.`[[Value]]` to `index` + 1_(𝔽).
        2.  Set `succeeded` to ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", `lengthDesc`).
        3.  [Assert](#assert): `succeeded` is true.
    11. Return true.
3.  Return ? [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, `P`, `Desc`).

#### 10.4.2.2 ArrayCreate ( `length` \[ , `proto` \] )

The abstract operation ArrayCreate takes argument `length` (a non-negative [integer](#integer)) and optional argument `proto` (an Object) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [Array exotic object](#array-exotic-object) or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of new Arrays. It performs the following steps when called:

1.  If `length` \> 2\*\*³² - 1, throw a RangeError exception.
2.  If `proto` is not present, set `proto` to [%Array.prototype%](#sec-properties-of-the-array-prototype-object).
3.  Let `A` be [MakeBasicObject](#sec-makebasicobject)(« `[[Prototype]]`, `[[Extensible]]` »).
4.  Set `A`.`[[Prototype]]` to `proto`.
5.  Set `A`.`[[DefineOwnProperty]]` as specified in [10.4.2.1](#sec-array-exotic-objects-defineownproperty-p-desc).
6.  Perform ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", PropertyDescriptor { `[[Value]]`: [𝔽](#𝔽)(`length`), `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
7.  Return `A`.

#### 10.4.2.3 ArraySpeciesCreate ( `originalArray`, `length` )

The abstract operation ArraySpeciesCreate takes arguments `originalArray` (an Object) and `length` (a non-negative [integer](#integer)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of a new Array or similar object using a [constructor](#constructor) function that is derived from `originalArray`. It does not enforce that the [constructor](#constructor) function returns an Array. It performs the following steps when called:

1.  Let `isArray` be ? [IsArray](#sec-isarray)(`originalArray`).
2.  If `isArray` is false, return ? [ArrayCreate](#sec-arraycreate)(`length`).
3.  Let `C` be ? [Get](#sec-get-o-p)(`originalArray`, "constructor").
4.  If [IsConstructor](#sec-isconstructor)(`C`) is true, then
    1.  Let `thisRealm` be [the current Realm Record](#current-realm).
    2.  Let `realmC` be ? [GetFunctionRealm](#sec-getfunctionrealm)(`C`).
    3.  If `thisRealm` and `realmC` are not the same [Realm Record](#realm-record), then
        1.  If [SameValue](#sec-samevalue)(`C`, `realmC`.`[[Intrinsics]]`.\[\[[%Array%](#sec-array-constructor)\]\]) is true, set `C` to undefined.
5.  If `C` [is an Object](#sec-object-type), then
    1.  Set `C` to ? [Get](#sec-get-o-p)(`C`, [%Symbol.species%](#sec-well-known-symbols)).
    2.  If `C` is null, set `C` to undefined.
6.  If `C` is undefined, return ? [ArrayCreate](#sec-arraycreate)(`length`).
7.  If [IsConstructor](#sec-isconstructor)(`C`) is false, throw a TypeError exception.
8.  Return ? [Construct](#sec-construct)(`C`, « [𝔽](#𝔽)(`length`) »).

Note

If `originalArray` was created using the standard built-in Array [constructor](#constructor) for a [realm](#realm) that is not the [realm](#realm) of the [running execution context](#running-execution-context), then a new Array is created using the [realm](#realm) of the [running execution context](#running-execution-context). This maintains compatibility with Web browsers that have historically had that behaviour for the `Array.prototype` methods that now are defined using ArraySpeciesCreate.

#### 10.4.2.4 ArraySetLength ( `A`, `Desc` )

The abstract operation ArraySetLength takes arguments `A` (an Array) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `Desc` does not have a `[[Value]]` field, then
    1.  Return ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", `Desc`).
2.  Let `newLenDesc` be a copy of `Desc`.
3.  Let `newLen` be ? [ToUint32](#sec-touint32)(`Desc`.`[[Value]]`).
4.  Let `numberLen` be ? [ToNumber](#sec-tonumber)(`Desc`.`[[Value]]`).
5.  If [SameValueZero](#sec-samevaluezero)(`newLen`, `numberLen`) is false, throw a RangeError exception.
6.  Set `newLenDesc`.`[[Value]]` to `newLen`.
7.  Let `oldLenDesc` be [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`A`, "length").
8.  [Assert](#assert): [IsDataDescriptor](#sec-isdatadescriptor)(`oldLenDesc`) is true.
9.  [Assert](#assert): `oldLenDesc`.`[[Configurable]]` is false.
10. Let `oldLen` be `oldLenDesc`.`[[Value]]`.
11. If `newLen` ≥ `oldLen`, then
    1.  Return ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", `newLenDesc`).
12. If `oldLenDesc`.`[[Writable]]` is false, return false.
13. If `newLenDesc` does not have a `[[Writable]]` field or `newLenDesc`.`[[Writable]]` is true, then
    1.  Let `newWritable` be true.
14. Else,
    1.  NOTE: Setting the `[[Writable]]` attribute to false is deferred in case any elements cannot be deleted.
    2.  Let `newWritable` be false.
    3.  Set `newLenDesc`.`[[Writable]]` to true.
15. Let `succeeded` be ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", `newLenDesc`).
16. If `succeeded` is false, return false.
17. For each own [property key](#property-key) `P` of `A` such that `P` is an [array index](#array-index) and ! [ToUint32](#sec-touint32)(`P`) ≥ `newLen`, in descending numeric index order, do
    1.  Let `deleteSucceeded` be ! `A`.`[[Delete]]`(`P`).
    2.  If `deleteSucceeded` is false, then
        1.  Set `newLenDesc`.`[[Value]]` to ! [ToUint32](#sec-touint32)(`P`) + 1_(𝔽).
        2.  If `newWritable` is false, set `newLenDesc`.`[[Writable]]` to false.
        3.  Perform ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", `newLenDesc`).
        4.  Return false.
18. If `newWritable` is false, then
    1.  Set `succeeded` to ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`A`, "length", PropertyDescriptor { `[[Writable]]`: false }).
    2.  [Assert](#assert): `succeeded` is true.
19. Return true.

Note

In steps [3](#step-arraysetlength-newlen) and [4](#step-arraysetlength-numberlen), if `Desc`.`[[Value]]` is an object then its `valueOf` method is called twice. This is legacy behaviour that was specified with this effect starting with the 2^(nd) Edition of this specification.

### 10.4.3 String Exotic Objects

A String object is an [exotic object](#exotic-object) that encapsulates a String value and exposes virtual [integer-indexed](#integer-index) [data properties](#sec-object-type) corresponding to the individual code unit elements of the String value. [String exotic objects](#string-exotic-object) always have a [data property](#sec-object-type) named "length" whose value is the length of the encapsulated String value. Both the code unit [data properties](#sec-object-type) and the "length" property are non-writable and non-configurable.

An object is a String exotic object (or simply, a String object) if its `[[GetOwnProperty]]`, `[[DefineOwnProperty]]`, and `[[OwnPropertyKeys]]` internal methods use the following implementations, and its other essential internal methods use the definitions found in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots). These methods are installed in [StringCreate](#sec-stringcreate).

[String exotic objects](#string-exotic-object) have the same internal slots as [ordinary objects](#ordinary-object). They also have a `[[StringData]]` internal slot.

#### 10.4.3.1 `[[GetOwnProperty]]` ( `P` )

The `[[GetOwnProperty]]` internal method of a [String exotic object](#string-exotic-object) `S` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) either a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined. It performs the following steps when called:

1.  Let `desc` be [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`S`, `P`).
2.  If `desc` is not undefined, return `desc`.
3.  Return [StringGetOwnProperty](#sec-stringgetownproperty)(`S`, `P`).

#### 10.4.3.2 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of a [String exotic object](#string-exotic-object) `S` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  Let `stringDesc` be [StringGetOwnProperty](#sec-stringgetownproperty)(`S`, `P`).
2.  If `stringDesc` is not undefined, then
    1.  Let `extensible` be `S`.`[[Extensible]]`.
    2.  Return [IsCompatiblePropertyDescriptor](#sec-iscompatiblepropertydescriptor)(`extensible`, `Desc`, `stringDesc`).
3.  Return ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`S`, `P`, `Desc`).

#### 10.4.3.3 `[[OwnPropertyKeys]]` ( )

The `[[OwnPropertyKeys]]` internal method of a [String exotic object](#string-exotic-object) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key). It performs the following steps when called:

1.  Let `keys` be a new empty [List](#sec-list-and-record-specification-type).
2.  Let `str` be `O`.`[[StringData]]`.
3.  [Assert](#assert): `str` [is a String](#sec-ecmascript-language-types-string-type).
4.  Let `len` be the length of `str`.
5.  For each [integer](#integer) `i` such that 0 ≤ `i` \< `len`, in ascending order, do
    1.  Append ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)) to `keys`.
6.  For each own [property key](#property-key) `P` of `O` such that `P` is an [array index](#array-index) and ! [ToIntegerOrInfinity](#sec-tointegerorinfinity)(`P`) ≥ `len`, in ascending numeric index order, do
    1.  Append `P` to `keys`.
7.  For each own [property key](#property-key) `P` of `O` such that `P` [is a String](#sec-ecmascript-language-types-string-type) and `P` is not an [array index](#array-index), in ascending chronological order of property creation, do
    1.  Append `P` to `keys`.
8.  For each own [property key](#property-key) `P` of `O` such that `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), in ascending chronological order of property creation, do
    1.  Append `P` to `keys`.
9.  Return `keys`.

#### 10.4.3.4 StringCreate ( `value`, `prototype` )

The abstract operation StringCreate takes arguments `value` (a String) and `prototype` (an Object) and returns a [String exotic object](#string-exotic-object). It is used to specify the creation of new [String exotic objects](#string-exotic-object). It performs the following steps when called:

1.  Let `S` be [MakeBasicObject](#sec-makebasicobject)(« `[[Prototype]]`, `[[Extensible]]`, `[[StringData]]` »).
2.  Set `S`.`[[Prototype]]` to `prototype`.
3.  Set `S`.`[[StringData]]` to `value`.
4.  Set `S`.`[[GetOwnProperty]]` as specified in [10.4.3.1](#sec-string-exotic-objects-getownproperty-p).
5.  Set `S`.`[[DefineOwnProperty]]` as specified in [10.4.3.2](#sec-string-exotic-objects-defineownproperty-p-desc).
6.  Set `S`.`[[OwnPropertyKeys]]` as specified in [10.4.3.3](#sec-string-exotic-objects-ownpropertykeys).
7.  Let `length` be the length of `value`.
8.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`S`, "length", PropertyDescriptor { `[[Value]]`: [𝔽](#𝔽)(`length`), `[[Writable]]`: false, `[[Enumerable]]`: false, `[[Configurable]]`: false }).
9.  Return `S`.

#### 10.4.3.5 StringGetOwnProperty ( `S`, `P` )

The abstract operation StringGetOwnProperty takes arguments `S` (an Object that has a `[[StringData]]` internal slot) and `P` (a [property key](#property-key)) and returns a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined. It performs the following steps when called:

1.  If `P` [is not a String](#sec-ecmascript-language-types-string-type), return undefined.
2.  Let `index` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
3.  If `index` is not an [integral Number](#integral-number), return undefined.
4.  If `index` is -0_(𝔽) or `index` \< -0_(𝔽), return undefined.
5.  Let `str` be `S`.`[[StringData]]`.
6.  [Assert](#assert): `str` [is a String](#sec-ecmascript-language-types-string-type).
7.  Let `len` be the length of `str`.
8.  If [ℝ](#ℝ)(`index`) ≥ `len`, return undefined.
9.  Let `resultStr` be the [substring](#substring) of `str` from [ℝ](#ℝ)(`index`) to [ℝ](#ℝ)(`index`) + 1.
10. Return the PropertyDescriptor { `[[Value]]`: `resultStr`, `[[Writable]]`: false, `[[Enumerable]]`: true, `[[Configurable]]`: false }.

### 10.4.4 Arguments Exotic Objects

Most ECMAScript functions make an arguments object available to their code. Depending upon the characteristics of the function definition, its arguments object is either an [ordinary object](#ordinary-object) or an [arguments exotic object](#arguments-exotic-object). An [arguments exotic object](#arguments-exotic-object) is an [exotic object](#exotic-object) whose [array index](#array-index) properties map to the formal parameters bindings of an invocation of its associated ECMAScript function.

An object is an arguments exotic object if its internal methods use the following implementations, with the ones not specified here using those found in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots). These methods are installed in [CreateMappedArgumentsObject](#sec-createmappedargumentsobject).

Note 1

While [CreateUnmappedArgumentsObject](#sec-createunmappedargumentsobject) is grouped into this clause, it creates an [ordinary object](#ordinary-object), not an [arguments exotic object](#arguments-exotic-object).

[Arguments exotic objects](#arguments-exotic-object) have the same internal slots as [ordinary objects](#ordinary-object). They also have a `[[ParameterMap]]` internal slot. Ordinary arguments objects also have a `[[ParameterMap]]` internal slot whose value is always undefined. For ordinary argument objects the `[[ParameterMap]]` internal slot is only used by `Object.prototype.toString` ([20.1.3.6](#sec-object.prototype.tostring)) to identify them as such.

Note 2

The [integer-indexed](#integer-index) [data properties](#sec-object-type) of an [arguments exotic object](#arguments-exotic-object) whose numeric name values are less than the number of formal parameters of the corresponding [function object](#function-object) initially share their values with the corresponding argument bindings in the function's [execution context](#sec-execution-contexts). This means that changing the property changes the corresponding value of the argument binding and vice-versa. This correspondence is broken if such a property is deleted and then redefined or if the property is changed into an [accessor property](#sec-object-type). If the arguments object is an [ordinary object](#ordinary-object), the values of its properties are simply a copy of the arguments passed to the function and there is no dynamic linkage between the property values and the formal parameter values.

Note 3

The ParameterMap object and its property values are used as a device for specifying the arguments object correspondence to argument bindings. The ParameterMap object and the objects that are the values of its properties are not directly observable from ECMAScript code. An ECMAScript implementation does not need to actually create or use such objects to implement the specified semantics.

Note 4

Ordinary arguments objects define a non-configurable [accessor property](#sec-object-type) named "callee" which throws a TypeError exception on access. The "callee" property has a more specific meaning for [arguments exotic objects](#arguments-exotic-object), which are created only for some class of [non-strict functions](#non-strict-function). The definition of this property in the ordinary variant exists to ensure that it is not defined in any other manner by conforming ECMAScript implementations.

Note 5

ECMAScript implementations of [arguments exotic objects](#arguments-exotic-object) have historically contained an [accessor property](#sec-object-type) named "caller". Prior to ECMAScript 2017, this specification included the definition of a throwing "caller" property on ordinary arguments objects. Since implementations do not contain this extension any longer, ECMAScript 2017 dropped the requirement for a throwing "caller" accessor.

#### 10.4.4.1 `[[GetOwnProperty]]` ( `P` )

The `[[GetOwnProperty]]` internal method of an [arguments exotic object](#arguments-exotic-object) `args` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) either a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined. It performs the following steps when called:

1.  Let `desc` be [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`args`, `P`).
2.  If `desc` is undefined, return undefined.
3.  Let `map` be `args`.`[[ParameterMap]]`.
4.  Let `isMapped` be ! [HasOwnProperty](#sec-hasownproperty)(`map`, `P`).
5.  If `isMapped` is true, then
    1.  Set `desc`.`[[Value]]` to ! [Get](#sec-get-o-p)(`map`, `P`).
6.  Return `desc`.

#### 10.4.4.2 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of an [arguments exotic object](#arguments-exotic-object) `args` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  Let `map` be `args`.`[[ParameterMap]]`.
2.  Let `isMapped` be ! [HasOwnProperty](#sec-hasownproperty)(`map`, `P`).
3.  Let `newArgDesc` be `Desc`.
4.  If `isMapped` is true and [IsDataDescriptor](#sec-isdatadescriptor)(`Desc`) is true, then
    1.  If `Desc` does not have a `[[Value]]` field, `Desc` has a `[[Writable]]` field, and `Desc`.`[[Writable]]` is false, then
        1.  Set `newArgDesc` to a copy of `Desc`.
        2.  Set `newArgDesc`.`[[Value]]` to ! [Get](#sec-get-o-p)(`map`, `P`).
5.  Let `allowed` be ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`args`, `P`, `newArgDesc`).
6.  If `allowed` is false, return false.
7.  If `isMapped` is true, then
    1.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is true, then
        1.  Perform ! `map`.`[[Delete]]`(`P`).
    2.  Else,
        1.  If `Desc` has a `[[Value]]` field, then
            1.  [Assert](#assert): The following Set will succeed, since formal parameters mapped by arguments objects are always writable.
            2.  Perform ! [Set](#sec-set-o-p-v-throw)(`map`, `P`, `Desc`.`[[Value]]`, false).
        2.  If `Desc` has a `[[Writable]]` field and `Desc`.`[[Writable]]` is false, then
            1.  Perform ! `map`.`[[Delete]]`(`P`).
8.  Return true.

#### 10.4.4.3 `[[Get]]` ( `P`, `Receiver` )

The `[[Get]]` internal method of an [arguments exotic object](#arguments-exotic-object) `args` takes arguments `P` (a [property key](#property-key)) and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `map` be `args`.`[[ParameterMap]]`.
2.  Let `isMapped` be ! [HasOwnProperty](#sec-hasownproperty)(`map`, `P`).
3.  If `isMapped` is false, then
    1.  Return ? [OrdinaryGet](#sec-ordinaryget)(`args`, `P`, `Receiver`).
4.  Else,
    1.  [Assert](#assert): `map` contains a formal parameter mapping for `P`.
    2.  Return ! [Get](#sec-get-o-p)(`map`, `P`).

#### 10.4.4.4 `[[Set]]` ( `P`, `V`, `Receiver` )

The `[[Set]]` internal method of an [arguments exotic object](#arguments-exotic-object) `args` takes arguments `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If [SameValue](#sec-samevalue)(`args`, `Receiver`) is false, then
    1.  Let `isMapped` be false.
2.  Else,
    1.  Let `map` be `args`.`[[ParameterMap]]`.
    2.  Let `isMapped` be ! [HasOwnProperty](#sec-hasownproperty)(`map`, `P`).
3.  If `isMapped` is true, then
    1.  [Assert](#assert): The following Set will succeed, since formal parameters mapped by arguments objects are always writable.
    2.  Perform ! [Set](#sec-set-o-p-v-throw)(`map`, `P`, `V`, false).
4.  Return ? [OrdinarySet](#sec-ordinaryset)(`args`, `P`, `V`, `Receiver`).

#### 10.4.4.5 `[[Delete]]` ( `P` )

The `[[Delete]]` internal method of an [arguments exotic object](#arguments-exotic-object) `args` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `map` be `args`.`[[ParameterMap]]`.
2.  Let `isMapped` be ! [HasOwnProperty](#sec-hasownproperty)(`map`, `P`).
3.  Let `result` be ? [OrdinaryDelete](#sec-ordinarydelete)(`args`, `P`).
4.  If `result` is true and `isMapped` is true, then
    1.  Perform ! `map`.`[[Delete]]`(`P`).
5.  Return `result`.

#### 10.4.4.6 CreateUnmappedArgumentsObject ( `argumentsList` )

The abstract operation CreateUnmappedArgumentsObject takes argument `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns an [ordinary object](#ordinary-object). It performs the following steps when called:

1.  Let `len` be the number of elements in `argumentsList`.
2.  Let `obj` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)([%Object.prototype%](#sec-properties-of-the-object-prototype-object), « `[[ParameterMap]]` »).
3.  Set `obj`.`[[ParameterMap]]` to undefined.
4.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, "length", PropertyDescriptor { `[[Value]]`: [𝔽](#𝔽)(`len`), `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
5.  Let `index` be 0.
6.  Repeat, while `index` \< `len`,
    1.  Let `val` be `argumentsList`\[`index`\].
    2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`index`)), `val`).
    3.  Set `index` to `index` + 1.
7.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, [%Symbol.iterator%](#sec-well-known-symbols), PropertyDescriptor { `[[Value]]`: %Array.prototype.values%, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
8.  Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, "callee", PropertyDescriptor { `[[Get]]`: [%ThrowTypeError%](#sec-%throwtypeerror%), `[[Set]]`: [%ThrowTypeError%](#sec-%throwtypeerror%), `[[Enumerable]]`: false, `[[Configurable]]`: false }).
9.  Return `obj`.

#### 10.4.4.7 CreateMappedArgumentsObject ( `func`, `formals`, `argumentsList`, `env` )

The abstract operation CreateMappedArgumentsObject takes arguments `func` (an Object), `formals` (a [Parse Node](#sec-syntactic-grammar)), `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)), and `env` (an [Environment Record](#sec-environment-records)) and returns an [arguments exotic object](#arguments-exotic-object). It performs the following steps when called:

1.  [Assert](#assert): `formals` does not contain a rest parameter, any binding patterns, or any initializers. It may contain duplicate identifiers.
2.  Let `len` be the number of elements in `argumentsList`.
3.  Let `obj` be [MakeBasicObject](#sec-makebasicobject)(« `[[Prototype]]`, `[[Extensible]]`, `[[ParameterMap]]` »).
4.  Set `obj`.`[[GetOwnProperty]]` as specified in [10.4.4.1](#sec-arguments-exotic-objects-getownproperty-p).
5.  Set `obj`.`[[DefineOwnProperty]]` as specified in [10.4.4.2](#sec-arguments-exotic-objects-defineownproperty-p-desc).
6.  Set `obj`.`[[Get]]` as specified in [10.4.4.3](#sec-arguments-exotic-objects-get-p-receiver).
7.  Set `obj`.`[[Set]]` as specified in [10.4.4.4](#sec-arguments-exotic-objects-set-p-v-receiver).
8.  Set `obj`.`[[Delete]]` as specified in [10.4.4.5](#sec-arguments-exotic-objects-delete-p).
9.  Set `obj`.`[[Prototype]]` to [%Object.prototype%](#sec-properties-of-the-object-prototype-object).
10. Let `map` be [OrdinaryObjectCreate](#sec-ordinaryobjectcreate)(null).
11. Set `obj`.`[[ParameterMap]]` to `map`.
12. Let `parameterNames` be the [BoundNames](#sec-static-semantics-boundnames) of `formals`.
13. Let `numberOfParameters` be the number of elements in `parameterNames`.
14. Let `index` be 0.
15. Repeat, while `index` \< `len`,
    1.  Let `val` be `argumentsList`\[`index`\].
    2.  Perform ! [CreateDataPropertyOrThrow](#sec-createdatapropertyorthrow)(`obj`, ! [ToString](#sec-tostring)([𝔽](#𝔽)(`index`)), `val`).
    3.  Set `index` to `index` + 1.
16. Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, "length", PropertyDescriptor { `[[Value]]`: [𝔽](#𝔽)(`len`), `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
17. Let `mappedNames` be a new empty [List](#sec-list-and-record-specification-type).
18. Set `index` to `numberOfParameters` - 1.
19. Repeat, while `index` ≥ 0,
    1.  Let `name` be `parameterNames`\[`index`\].
    2.  If `mappedNames` does not contain `name`, then
        1.  Append `name` to `mappedNames`.
        2.  If `index` \< `len`, then
            1.  Let `g` be [MakeArgGetter](#sec-makearggetter)(`name`, `env`).
            2.  Let `p` be [MakeArgSetter](#sec-makeargsetter)(`name`, `env`).
            3.  Perform ! `map`.`[[DefineOwnProperty]]`(! [ToString](#sec-tostring)([𝔽](#𝔽)(`index`)), PropertyDescriptor { `[[Set]]`: `p`, `[[Get]]`: `g`, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
    3.  Set `index` to `index` - 1.
20. Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, [%Symbol.iterator%](#sec-well-known-symbols), PropertyDescriptor { `[[Value]]`: %Array.prototype.values%, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
21. Perform ! [DefinePropertyOrThrow](#sec-definepropertyorthrow)(`obj`, "callee", PropertyDescriptor { `[[Value]]`: `func`, `[[Writable]]`: true, `[[Enumerable]]`: false, `[[Configurable]]`: true }).
22. Return `obj`.

##### 10.4.4.7.1 MakeArgGetter ( `name`, `env` )

The abstract operation MakeArgGetter takes arguments `name` (a String) and `env` (an [Environment Record](#sec-environment-records)) and returns a [function object](#function-object). It creates a built-in [function object](#function-object) that when executed returns the value bound for `name` in `env`. It performs the following steps when called:

1.  Let `getterClosure` be a new [Abstract Closure](#sec-abstract-closure) with no parameters that captures `name` and `env` and performs the following steps when called:
    1.  Return `env`.GetBindingValue(`name`, false).
2.  Let `getter` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`getterClosure`, 0, "", « »).
3.  NOTE: `getter` is never directly accessible to ECMAScript code.
4.  Return `getter`.

##### 10.4.4.7.2 MakeArgSetter ( `name`, `env` )

The abstract operation MakeArgSetter takes arguments `name` (a String) and `env` (an [Environment Record](#sec-environment-records)) and returns a [function object](#function-object). It creates a built-in [function object](#function-object) that when executed sets the value bound for `name` in `env`. It performs the following steps when called:

1.  Let `setterClosure` be a new [Abstract Closure](#sec-abstract-closure) with parameters (`value`) that captures `name` and `env` and performs the following steps when called:
    1.  Return ! `env`.SetMutableBinding(`name`, `value`, false).
2.  Let `setter` be [CreateBuiltinFunction](#sec-createbuiltinfunction)(`setterClosure`, 1, "", « »).
3.  NOTE: `setter` is never directly accessible to ECMAScript code.
4.  Return `setter`.

### 10.4.5 TypedArray Exotic Objects

A [TypedArray](#typedarray) is an [exotic object](#exotic-object) that performs special handling of [integer index](#integer-index) [property keys](#property-key).

[TypedArrays](#typedarray) have the same internal slots as [ordinary objects](#ordinary-object) and additionally `[[ViewedArrayBuffer]]`, `[[ArrayLength]]`, `[[ByteOffset]]`, `[[ContentType]]`, and `[[TypedArrayName]]` internal slots.

An object is a TypedArray if its `[[PreventExtensions]]`, `[[GetOwnProperty]]`, `[[HasProperty]]`, `[[DefineOwnProperty]]`, `[[Get]]`, `[[Set]]`, `[[Delete]]`, and `[[OwnPropertyKeys]]`, internal methods use the definitions in this section, and its other essential internal methods use the definitions found in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots). These methods are installed by [TypedArrayCreate](#sec-typedarraycreate).

#### 10.4.5.1 `[[PreventExtensions]]` ( )

The `[[PreventExtensions]]` internal method of a [TypedArray](#typedarray) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  NOTE: The extensibility-related invariants specified in [6.1.7.3](#sec-invariants-of-the-essential-internal-methods) do not allow this method to return true when `O` can gain (or lose and then regain) properties, which might occur for properties with [integer index](#integer-index) names when its underlying buffer is resized.
2.  If [IsTypedArrayFixedLength](#sec-istypedarrayfixedlength)(`O`) is false, return false.
3.  Return [OrdinaryPreventExtensions](#sec-ordinarypreventextensions)(`O`).

#### 10.4.5.2 `[[GetOwnProperty]]` ( `P` )

The `[[GetOwnProperty]]` internal method of a [TypedArray](#typedarray) `O` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) either a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined. It performs the following steps when called:

1.  If `P` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `numericIndex` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
    2.  If `numericIndex` is not undefined, then
        1.  Let `value` be [TypedArrayGetElement](#sec-typedarraygetelement)(`O`, `numericIndex`).
        2.  If `value` is undefined, return undefined.
        3.  Return the PropertyDescriptor { `[[Value]]`: `value`, `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: true }.
2.  Return [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`O`, `P`).

#### 10.4.5.3 `[[HasProperty]]` ( `P` )

The `[[HasProperty]]` internal method of a [TypedArray](#typedarray) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `numericIndex` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
    2.  If `numericIndex` is not undefined, return [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, `numericIndex`).
2.  Return ? [OrdinaryHasProperty](#sec-ordinaryhasproperty)(`O`, `P`).

#### 10.4.5.4 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of a [TypedArray](#typedarray) `O` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `numericIndex` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
    2.  If `numericIndex` is not undefined, then
        1.  If [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, `numericIndex`) is false, return false.
        2.  If `Desc` has a `[[Configurable]]` field and `Desc`.`[[Configurable]]` is false, return false.
        3.  If `Desc` has an `[[Enumerable]]` field and `Desc`.`[[Enumerable]]` is false, return false.
        4.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is true, return false.
        5.  If `Desc` has a `[[Writable]]` field and `Desc`.`[[Writable]]` is false, return false.
        6.  If `Desc` has a `[[Value]]` field, perform ? [TypedArraySetElement](#sec-typedarraysetelement)(`O`, `numericIndex`, `Desc`.`[[Value]]`).
        7.  Return true.
2.  Return ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`O`, `P`, `Desc`).

#### 10.4.5.5 `[[Get]]` ( `P`, `Receiver` )

The `[[Get]]` internal method of a [TypedArray](#typedarray) `O` takes arguments `P` (a [property key](#property-key)) and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `numericIndex` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
    2.  If `numericIndex` is not undefined, then
        1.  Return [TypedArrayGetElement](#sec-typedarraygetelement)(`O`, `numericIndex`).
2.  Return ? [OrdinaryGet](#sec-ordinaryget)(`O`, `P`, `Receiver`).

#### 10.4.5.6 `[[Set]]` ( `P`, `V`, `Receiver` )

The `[[Set]]` internal method of a [TypedArray](#typedarray) `O` takes arguments `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `numericIndex` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
    2.  If `numericIndex` is not undefined, then
        1.  If [SameValue](#sec-samevalue)(`O`, `Receiver`) is true, then
            1.  Perform ? [TypedArraySetElement](#sec-typedarraysetelement)(`O`, `numericIndex`, `V`).
            2.  Return true.
        2.  If [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, `numericIndex`) is false, return true.
2.  Return ? [OrdinarySet](#sec-ordinaryset)(`O`, `P`, `V`, `Receiver`).

#### 10.4.5.7 `[[Delete]]` ( `P` )

The `[[Delete]]` internal method of a [TypedArray](#typedarray) `O` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  If `P` [is a String](#sec-ecmascript-language-types-string-type), then
    1.  Let `numericIndex` be [CanonicalNumericIndexString](#sec-canonicalnumericindexstring)(`P`).
    2.  If `numericIndex` is not undefined, then
        1.  If [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, `numericIndex`) is false, return true; else return false.
2.  Return ! [OrdinaryDelete](#sec-ordinarydelete)(`O`, `P`).

#### 10.4.5.8 `[[OwnPropertyKeys]]` ( )

The `[[OwnPropertyKeys]]` internal method of a [TypedArray](#typedarray) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key). It performs the following steps when called:

1.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
2.  Let `keys` be a new empty [List](#sec-list-and-record-specification-type).
3.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is false, then
    1.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
    2.  For each [integer](#integer) `i` such that 0 ≤ `i` \< `length`, in ascending order, do
        1.  Append ! [ToString](#sec-tostring)([𝔽](#𝔽)(`i`)) to `keys`.
4.  For each own [property key](#property-key) `P` of `O` such that `P` [is a String](#sec-ecmascript-language-types-string-type) and `P` is not an [integer index](#integer-index), in ascending chronological order of property creation, do
    1.  Append `P` to `keys`.
5.  For each own [property key](#property-key) `P` of `O` such that `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), in ascending chronological order of property creation, do
    1.  Append `P` to `keys`.
6.  Return `keys`.

#### 10.4.5.9 TypedArray With Buffer Witness Records

An TypedArray With Buffer Witness Record is a [Record](#sec-list-and-record-specification-type) value used to encapsulate a [TypedArray](#typedarray) along with a cached byte length of the viewed buffer. It is used to help ensure there is a single shared memory read event of the byte length data block when the viewed buffer is a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).

TypedArray With Buffer Witness Records have the fields listed in [Table 32](#table-typedarray-with-buffer-witness-record-fields).

| Field Name | Value | Meaning |
|----|----|----|
| `[[Object]]` | a [TypedArray](#typedarray) | The [TypedArray](#typedarray) whose buffer's byte length is loaded. |
| `[[CachedBufferByteLength]]` | a non-negative [integer](#integer) or detached | The byte length of the object's `[[ViewedArrayBuffer]]` when the [Record](#sec-list-and-record-specification-type) was created. |

Table 32: [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records) Fields

#### 10.4.5.10 MakeTypedArrayWithBufferWitnessRecord ( `obj`, `order` )

The abstract operation MakeTypedArrayWithBufferWitnessRecord takes arguments `obj` (a [TypedArray](#typedarray)) and `order` (seq-cst or unordered) and returns a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records). It performs the following steps when called:

1.  Let `buffer` be `obj`.`[[ViewedArrayBuffer]]`.
2.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`buffer`) is true, then
    1.  Let `byteLength` be detached.
3.  Else,
    1.  Let `byteLength` be [ArrayBufferByteLength](#sec-arraybufferbytelength)(`buffer`, `order`).
4.  Return the [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records) { `[[Object]]`: `obj`, `[[CachedBufferByteLength]]`: `byteLength` }.

#### 10.4.5.11 TypedArrayCreate ( `prototype` )

The abstract operation TypedArrayCreate takes argument `prototype` (an Object) and returns a [TypedArray](#typedarray). It is used to specify the creation of new [TypedArrays](#typedarray). It performs the following steps when called:

1.  Let `internalSlotsList` be « `[[Prototype]]`, `[[Extensible]]`, `[[ViewedArrayBuffer]]`, `[[TypedArrayName]]`, `[[ContentType]]`, `[[ByteLength]]`, `[[ByteOffset]]`, `[[ArrayLength]]` ».
2.  Let `A` be [MakeBasicObject](#sec-makebasicobject)(`internalSlotsList`).
3.  Set `A`.`[[PreventExtensions]]` as specified in [10.4.5.1](#sec-typedarray-preventextensions).
4.  Set `A`.`[[GetOwnProperty]]` as specified in [10.4.5.2](#sec-typedarray-getownproperty).
5.  Set `A`.`[[HasProperty]]` as specified in [10.4.5.3](#sec-typedarray-hasproperty).
6.  Set `A`.`[[DefineOwnProperty]]` as specified in [10.4.5.4](#sec-typedarray-defineownproperty).
7.  Set `A`.`[[Get]]` as specified in [10.4.5.5](#sec-typedarray-get).
8.  Set `A`.`[[Set]]` as specified in [10.4.5.6](#sec-typedarray-set).
9.  Set `A`.`[[Delete]]` as specified in [10.4.5.7](#sec-typedarray-delete).
10. Set `A`.`[[OwnPropertyKeys]]` as specified in [10.4.5.8](#sec-typedarray-ownpropertykeys).
11. Set `A`.`[[Prototype]]` to `prototype`.
12. Return `A`.

#### 10.4.5.12 TypedArrayByteLength ( `taRecord` )

The abstract operation TypedArrayByteLength takes argument `taRecord` (a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records)) and returns a non-negative [integer](#integer). It performs the following steps when called:

1.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, return 0.
2.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
3.  If `length` = 0, return 0.
4.  Let `O` be `taRecord`.`[[Object]]`.
5.  If `O`.`[[ByteLength]]` is not auto, return `O`.`[[ByteLength]]`.
6.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
7.  Return `length` × `elementSize`.

#### 10.4.5.13 TypedArrayLength ( `taRecord` )

The abstract operation TypedArrayLength takes argument `taRecord` (a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records)) and returns a non-negative [integer](#integer). It performs the following steps when called:

1.  [Assert](#assert): [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is false.
2.  Let `O` be `taRecord`.`[[Object]]`.
3.  If `O`.`[[ArrayLength]]` is not auto, return `O`.`[[ArrayLength]]`.
4.  [Assert](#assert): [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`O`.`[[ViewedArrayBuffer]]`) is false.
5.  Let `byteOffset` be `O`.`[[ByteOffset]]`.
6.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
7.  Let `byteLength` be `taRecord`.`[[CachedBufferByteLength]]`.
8.  [Assert](#assert): `byteLength` is not detached.
9.  Return [floor](#eqn-floor)((`byteLength` - `byteOffset`) / `elementSize`).

#### 10.4.5.14 IsTypedArrayOutOfBounds ( `taRecord` )

The abstract operation IsTypedArrayOutOfBounds takes argument `taRecord` (a [TypedArray With Buffer Witness Record](#sec-typedarray-with-buffer-witness-records)) and returns a Boolean. It checks if any of the object's numeric properties reference a value at an index not contained within the underlying buffer's bounds. It performs the following steps when called:

1.  Let `O` be `taRecord`.`[[Object]]`.
2.  Let `bufferByteLength` be `taRecord`.`[[CachedBufferByteLength]]`.
3.  [Assert](#assert): [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`.`[[ViewedArrayBuffer]]`) is true if and only if `bufferByteLength` is detached.
4.  If `bufferByteLength` is detached, return true.
5.  Let `byteOffsetStart` be `O`.`[[ByteOffset]]`.
6.  If `O`.`[[ArrayLength]]` is auto, then
    1.  Let `byteOffsetEnd` be `bufferByteLength`.
7.  Else,
    1.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
    2.  Let `byteOffsetEnd` be `byteOffsetStart` + `O`.`[[ArrayLength]]` × `elementSize`.
8.  If `byteOffsetStart` \> `bufferByteLength` or `byteOffsetEnd` \> `bufferByteLength`, return true.
9.  NOTE: 0-length [TypedArrays](#typedarray) are not considered out-of-bounds.
10. Return false.

#### 10.4.5.15 IsTypedArrayFixedLength ( `O` )

The abstract operation IsTypedArrayFixedLength takes argument `O` (a [TypedArray](#typedarray)) and returns a Boolean. It performs the following steps when called:

1.  If `O`.`[[ArrayLength]]` is auto, return false.
2.  Let `buffer` be `O`.`[[ViewedArrayBuffer]]`.
3.  If [IsFixedLengthArrayBuffer](#sec-isfixedlengtharraybuffer)(`buffer`) is false and [IsSharedArrayBuffer](#sec-issharedarraybuffer)(`buffer`) is false, return false.
4.  Return true.

#### 10.4.5.16 IsValidIntegerIndex ( `O`, `index` )

The abstract operation IsValidIntegerIndex takes arguments `O` (a [TypedArray](#typedarray)) and `index` (a Number) and returns a Boolean. It performs the following steps when called:

1.  If [IsDetachedBuffer](#sec-isdetachedbuffer)(`O`.`[[ViewedArrayBuffer]]`) is true, return false.
2.  If `index` is not an [integral Number](#integral-number), return false.
3.  If `index` is -0_(𝔽) or `index` \< -0_(𝔽), return false.
4.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, unordered).
5.  NOTE: Bounds checking is not a synchronizing operation when `O`'s backing buffer is a [growable SharedArrayBuffer](#sec-fixed-length-and-growable-sharedarraybuffer-objects).
6.  If [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`) is true, return false.
7.  Let `length` be [TypedArrayLength](#sec-typedarraylength)(`taRecord`).
8.  If [ℝ](#ℝ)(`index`) ≥ `length`, return false.
9.  Return true.

#### 10.4.5.17 TypedArrayGetElement ( `O`, `index` )

The abstract operation TypedArrayGetElement takes arguments `O` (a [TypedArray](#typedarray)) and `index` (a Number) and returns a Number, a BigInt, or undefined. It performs the following steps when called:

1.  If [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, `index`) is false, return undefined.
2.  Let `offset` be `O`.`[[ByteOffset]]`.
3.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
4.  Let `byteIndexInBuffer` be ([ℝ](#ℝ)(`index`) × `elementSize`) + `offset`.
5.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`O`).
6.  Return [GetValueFromBuffer](#sec-getvaluefrombuffer)(`O`.`[[ViewedArrayBuffer]]`, `byteIndexInBuffer`, `elementType`, true, unordered).

#### 10.4.5.18 TypedArraySetElement ( `O`, `index`, `value` )

The abstract operation TypedArraySetElement takes arguments `O` (a [TypedArray](#typedarray)), `index` (a Number), and `value` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `O`.`[[ContentType]]` is bigint, let `numValue` be ? [ToBigInt](#sec-tobigint)(`value`).
2.  Otherwise, let `numValue` be ? [ToNumber](#sec-tonumber)(`value`).
3.  If [IsValidIntegerIndex](#sec-isvalidintegerindex)(`O`, `index`) is true, then
    1.  Let `offset` be `O`.`[[ByteOffset]]`.
    2.  Let `elementSize` be [TypedArrayElementSize](#sec-typedarrayelementsize)(`O`).
    3.  Let `byteIndexInBuffer` be ([ℝ](#ℝ)(`index`) × `elementSize`) + `offset`.
    4.  Let `elementType` be [TypedArrayElementType](#sec-typedarrayelementtype)(`O`).
    5.  Perform [SetValueInBuffer](#sec-setvalueinbuffer)(`O`.`[[ViewedArrayBuffer]]`, `byteIndexInBuffer`, `elementType`, `numValue`, true, unordered).
4.  Return unused.

Note

This operation always appears to succeed, but it has no effect when attempting to write past the end of a [TypedArray](#typedarray) or to a [TypedArray](#typedarray) which is backed by a detached ArrayBuffer.

#### 10.4.5.19 IsArrayBufferViewOutOfBounds ( `O` )

The abstract operation IsArrayBufferViewOutOfBounds takes argument `O` (a [TypedArray](#typedarray) or a DataView) and returns a Boolean. It checks if either any of a [TypedArray](#typedarray)'s numeric properties or a DataView object's methods can reference a value at an index not contained within the underlying data block's bounds. This abstract operation exists as a convenience for upstream specifications. It performs the following steps when called:

1.  If `O` has a `[[DataView]]` internal slot, then
    1.  Let `viewRecord` be [MakeDataViewWithBufferWitnessRecord](#sec-makedataviewwithbufferwitnessrecord)(`O`, seq-cst).
    2.  Return [IsViewOutOfBounds](#sec-isviewoutofbounds)(`viewRecord`).
2.  Let `taRecord` be [MakeTypedArrayWithBufferWitnessRecord](#sec-maketypedarraywithbufferwitnessrecord)(`O`, seq-cst).
3.  Return [IsTypedArrayOutOfBounds](#sec-istypedarrayoutofbounds)(`taRecord`).

### 10.4.6 Module Namespace Exotic Objects

A [module namespace exotic object](#module-namespace-exotic-object) is an [exotic object](#exotic-object) that exposes the bindings exported from an ECMAScript [Module](#prod-Module) (See [16.2.3](#sec-exports)). There is a one-to-one correspondence between the String-keyed own properties of a [module namespace exotic object](#module-namespace-exotic-object) and the binding names exported by the [Module](#prod-Module). The exported bindings include any bindings that are indirectly exported using `export *` export items. Each String-valued own [property key](#property-key) is the [StringValue](#sec-static-semantics-stringvalue) of the corresponding exported binding name. These are the only String-keyed properties of a [module namespace exotic object](#module-namespace-exotic-object). Each such property has the attributes { `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: false }. [Module namespace exotic objects](#module-namespace-exotic-object) are not extensible.

An object is a module namespace exotic object if its `[[GetPrototypeOf]]`, `[[SetPrototypeOf]]`, `[[IsExtensible]]`, `[[PreventExtensions]]`, `[[GetOwnProperty]]`, `[[DefineOwnProperty]]`, `[[HasProperty]]`, `[[Get]]`, `[[Set]]`, `[[Delete]]`, and `[[OwnPropertyKeys]]` internal methods use the definitions in this section, and its other essential internal methods use the definitions found in [10.1](#sec-ordinary-object-internal-methods-and-internal-slots). These methods are installed by [ModuleNamespaceCreate](#sec-modulenamespacecreate).

[Module namespace exotic objects](#module-namespace-exotic-object) have the internal slots defined in [Table 33](#table-internal-slots-of-module-namespace-exotic-objects).

| Internal Slot | Type | Description |
|----|----|----|
| `[[Module]]` | a [Module Record](#sec-abstract-module-records) | The [Module Record](#sec-abstract-module-records) whose exports this namespace exposes. |
| `[[Exports]]` | a [List](#sec-list-and-record-specification-type) of Strings | A [List](#sec-list-and-record-specification-type) whose elements are the String values of the exported names exposed as own properties of this object. The list is sorted according to [lexicographic code unit order](#lexicographic-code-unit-order). |

Table 33: Internal Slots of Module Namespace Exotic Objects

#### 10.4.6.1 `[[GetPrototypeOf]]` ( )

The `[[GetPrototypeOf]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) null. It performs the following steps when called:

1.  Return null.

#### 10.4.6.2 `[[SetPrototypeOf]]` ( `V` )

The `[[SetPrototypeOf]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes argument `V` (an Object or null) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  Return ! [SetImmutablePrototype](#sec-set-immutable-prototype)(`O`, `V`).

#### 10.4.6.3 `[[IsExtensible]]` ( )

The `[[IsExtensible]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) false. It performs the following steps when called:

1.  Return false.

#### 10.4.6.4 `[[PreventExtensions]]` ( )

The `[[PreventExtensions]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) true. It performs the following steps when called:

1.  Return true.

#### 10.4.6.5 `[[GetOwnProperty]]` ( `P` )

The `[[GetOwnProperty]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return [OrdinaryGetOwnProperty](#sec-ordinarygetownproperty)(`O`, `P`).
2.  Let `exports` be `O`.`[[Exports]]`.
3.  If `exports` does not contain `P`, return undefined.
4.  Let `value` be ? `O`.`[[Get]]`(`P`, `O`).
5.  Return PropertyDescriptor { `[[Value]]`: `value`, `[[Writable]]`: true, `[[Enumerable]]`: true, `[[Configurable]]`: false }.

#### 10.4.6.6 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return ! [OrdinaryDefineOwnProperty](#sec-ordinarydefineownproperty)(`O`, `P`, `Desc`).
2.  Let `current` be ? `O`.`[[GetOwnProperty]]`(`P`).
3.  If `current` is undefined, return false.
4.  If `Desc` has a `[[Configurable]]` field and `Desc`.`[[Configurable]]` is true, return false.
5.  If `Desc` has an `[[Enumerable]]` field and `Desc`.`[[Enumerable]]` is false, return false.
6.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`Desc`) is true, return false.
7.  If `Desc` has a `[[Writable]]` field and `Desc`.`[[Writable]]` is false, return false.
8.  If `Desc` has a `[[Value]]` field, return [SameValue](#sec-samevalue)(`Desc`.`[[Value]]`, `current`.`[[Value]]`).
9.  Return true.

#### 10.4.6.7 `[[HasProperty]]` ( `P` )

The `[[HasProperty]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  If `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), return ! [OrdinaryHasProperty](#sec-ordinaryhasproperty)(`O`, `P`).
2.  Let `exports` be `O`.`[[Exports]]`.
3.  If `exports` contains `P`, return true.
4.  Return false.

#### 10.4.6.8 `[[Get]]` ( `P`, `Receiver` )

The `[[Get]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes arguments `P` (a [property key](#property-key)) and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  If `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), then
    1.  Return ! [OrdinaryGet](#sec-ordinaryget)(`O`, `P`, `Receiver`).
2.  Let `exports` be `O`.`[[Exports]]`.
3.  If `exports` does not contain `P`, return undefined.
4.  Let `m` be `O`.`[[Module]]`.
5.  Let `binding` be `m`.ResolveExport(`P`).
6.  [Assert](#assert): `binding` is a [ResolvedBinding Record](#resolvedbinding-record).
7.  Let `targetModule` be `binding`.`[[Module]]`.
8.  [Assert](#assert): `targetModule` is not undefined.
9.  If `binding`.`[[BindingName]]` is namespace, then
    1.  Return [GetModuleNamespace](#sec-getmodulenamespace)(`targetModule`).
10. Let `targetEnv` be `targetModule`.`[[Environment]]`.
11. If `targetEnv` is empty, throw a ReferenceError exception.
12. Return ? `targetEnv`.GetBindingValue(`binding`.`[[BindingName]]`, true).

Note

ResolveExport is side-effect free. Each time this operation is called with a specific `exportName`, `resolveSet` pair as arguments it must return the same result. An implementation might choose to pre-compute or cache the ResolveExport results for the `[[Exports]]` of each [module namespace exotic object](#module-namespace-exotic-object).

#### 10.4.6.9 `[[Set]]` ( `P`, `V`, `Receiver` )

The `[[Set]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) takes arguments `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns a [normal completion containing](#sec-completion-record-specification-type) false. It performs the following steps when called:

1.  Return false.

#### 10.4.6.10 `[[Delete]]` ( `P` )

The `[[Delete]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes argument `P` (a [property key](#property-key)) and returns a [normal completion containing](#sec-completion-record-specification-type) a Boolean. It performs the following steps when called:

1.  If `P` [is a Symbol](#sec-ecmascript-language-types-symbol-type), then
    1.  Return ! [OrdinaryDelete](#sec-ordinarydelete)(`O`, `P`).
2.  Let `exports` be `O`.`[[Exports]]`.
3.  If `exports` contains `P`, return false.
4.  Return true.

#### 10.4.6.11 `[[OwnPropertyKeys]]` ( )

The `[[OwnPropertyKeys]]` internal method of a [module namespace exotic object](#module-namespace-exotic-object) `O` takes no arguments and returns a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key). It performs the following steps when called:

1.  Let `exports` be `O`.`[[Exports]]`.
2.  Let `symbolKeys` be [OrdinaryOwnPropertyKeys](#sec-ordinaryownpropertykeys)(`O`).
3.  Return the [list-concatenation](#list-concatenation) of `exports` and `symbolKeys`.

#### 10.4.6.12 ModuleNamespaceCreate ( `module`, `exports` )

The abstract operation ModuleNamespaceCreate takes arguments `module` (a [Module Record](#sec-abstract-module-records)) and `exports` (a [List](#sec-list-and-record-specification-type) of Strings) and returns a [module namespace exotic object](#module-namespace-exotic-object). It is used to specify the creation of new [module namespace exotic objects](#module-namespace-exotic-object). It performs the following steps when called:

1.  [Assert](#assert): `module`.`[[Namespace]]` is empty.
2.  Let `internalSlotsList` be the internal slots listed in [Table 33](#table-internal-slots-of-module-namespace-exotic-objects).
3.  Let `M` be [MakeBasicObject](#sec-makebasicobject)(`internalSlotsList`).
4.  Set `M`'s essential internal methods to the definitions specified in [10.4.6](#sec-module-namespace-exotic-objects).
5.  Set `M`.`[[Module]]` to `module`.
6.  Let `sortedExports` be a [List](#sec-list-and-record-specification-type) whose elements are the elements of `exports`, sorted according to [lexicographic code unit order](#lexicographic-code-unit-order).
7.  Set `M`.`[[Exports]]` to `sortedExports`.
8.  Create own properties of `M` corresponding to the definitions in [28.3](#sec-module-namespace-objects).
9.  Set `module`.`[[Namespace]]` to `M`.
10. Return `M`.

### 10.4.7 Immutable Prototype Exotic Objects

An [immutable prototype exotic object](#immutable-prototype-exotic-object) is an [exotic object](#exotic-object) that has a `[[Prototype]]` internal slot that will not change once it is initialized.

An object is an immutable prototype exotic object if its `[[SetPrototypeOf]]` internal method uses the following implementation. (Its other essential internal methods may use any implementation, depending on the specific [immutable prototype exotic object](#immutable-prototype-exotic-object) in question.)

Note

Unlike other [exotic objects](#exotic-object), there is not a dedicated creation abstract operation provided for [immutable prototype exotic objects](#immutable-prototype-exotic-object). This is because they are only used by [%Object.prototype%](#sec-properties-of-the-object-prototype-object) and by [host environments](#host-environment), and in [host environments](#host-environment), the relevant objects are potentially exotic in other ways and thus need their own dedicated creation operation.

#### 10.4.7.1 `[[SetPrototypeOf]]` ( `V` )

The `[[SetPrototypeOf]]` internal method of an [immutable prototype exotic object](#immutable-prototype-exotic-object) `O` takes argument `V` (an Object or null) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Return ? [SetImmutablePrototype](#sec-set-immutable-prototype)(`O`, `V`).

#### 10.4.7.2 SetImmutablePrototype ( `O`, `V` )

The abstract operation SetImmutablePrototype takes arguments `O` (an Object) and `V` (an Object or null) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Let `current` be ? `O`.`[[GetPrototypeOf]]`().
2.  If [SameValue](#sec-samevalue)(`V`, `current`) is true, return true.
3.  Return false.

## 10.5 Proxy Object Internal Methods and Internal Slots

A Proxy object is an [exotic object](#exotic-object) whose essential internal methods are partially implemented using ECMAScript code. Every Proxy object has an internal slot called `[[ProxyHandler]]`. The value of `[[ProxyHandler]]` is an object, called the proxy's *handler object*, or null. Methods (see [Table 34](#table-proxy-handler-methods)) of a handler object may be used to augment the implementation for one or more of the Proxy object's internal methods. Every Proxy object also has an internal slot called `[[ProxyTarget]]` whose value is either an object or null. This object is called the proxy's *target object*.

An object is a Proxy exotic object if its essential internal methods (including `[[Call]]` and `[[Construct]]`, if applicable) use the definitions in this section. These internal methods are installed in [ProxyCreate](#sec-proxycreate).

| Internal Method         | Handler Method             |
|-------------------------|----------------------------|
| `[[GetPrototypeOf]]`    | `getPrototypeOf`           |
| `[[SetPrototypeOf]]`    | `setPrototypeOf`           |
| `[[IsExtensible]]`      | `isExtensible`             |
| `[[PreventExtensions]]` | `preventExtensions`        |
| `[[GetOwnProperty]]`    | `getOwnPropertyDescriptor` |
| `[[DefineOwnProperty]]` | `defineProperty`           |
| `[[HasProperty]]`       | `has`                      |
| `[[Get]]`               | `get`                      |
| `[[Set]]`               | `set`                      |
| `[[Delete]]`            | `deleteProperty`           |
| `[[OwnPropertyKeys]]`   | `ownKeys`                  |
| `[[Call]]`              | `apply`                    |
| `[[Construct]]`         | `construct`                |

Table 34: Proxy Handler Methods

When a handler method is called to provide the implementation of a Proxy object internal method, the handler method is passed the proxy's target object as a parameter. A proxy's handler object does not necessarily have a method corresponding to every essential internal method. Invoking an internal method on the proxy results in the invocation of the corresponding internal method on the proxy's target object if the handler object does not have a method corresponding to the internal trap.

The `[[ProxyHandler]]` and `[[ProxyTarget]]` internal slots of a Proxy object are always initialized when the object is created and typically may not be modified. Some Proxy objects are created in a manner that permits them to be subsequently *revoked*. When a proxy is revoked, its `[[ProxyHandler]]` and `[[ProxyTarget]]` internal slots are set to null causing subsequent invocations of internal methods on that Proxy object to throw a TypeError exception.

Because Proxy objects permit the implementation of internal methods to be provided by arbitrary ECMAScript code, it is possible to define a Proxy object whose handler methods violates the invariants defined in [6.1.7.3](#sec-invariants-of-the-essential-internal-methods). Some of the internal method invariants defined in [6.1.7.3](#sec-invariants-of-the-essential-internal-methods) are essential integrity invariants. These invariants are explicitly enforced by the Proxy object internal methods specified in this section. An ECMAScript implementation must be robust in the presence of all possible invariant violations.

In the following algorithm descriptions, assume `O` is an ECMAScript Proxy object, `P` is a [property key](#property-key) value, `V` is any [ECMAScript language value](#sec-ecmascript-language-types) and `Desc` is a [Property Descriptor](#sec-property-descriptor-specification-type) record.

### 10.5.1 `[[GetPrototypeOf]]` ( )

The `[[GetPrototypeOf]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) either an Object or null, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "getPrototypeOf").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[GetPrototypeOf]]`().
7.  Let `handlerProto` be ? [Call](#sec-call)(`trap`, `handler`, « `target` »).
8.  If `handlerProto` [is not an Object](#sec-object-type) and `handlerProto` is not null, throw a TypeError exception.
9.  Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
10. If `extensibleTarget` is true, return `handlerProto`.
11. Let `targetProto` be ? `target`.`[[GetPrototypeOf]]`().
12. If [SameValue](#sec-samevalue)(`handlerProto`, `targetProto`) is false, throw a TypeError exception.
13. Return `handlerProto`.

Note

`[[GetPrototypeOf]]` for Proxy objects enforces the following invariants:

- The result of `[[GetPrototypeOf]]` must be either an Object or null.
- If the target object is not extensible, `[[GetPrototypeOf]]` applied to the Proxy object must return the same value as `[[GetPrototypeOf]]` applied to the Proxy object's target object.

### 10.5.2 `[[SetPrototypeOf]]` ( `V` )

The `[[SetPrototypeOf]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes argument `V` (an Object or null) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "setPrototypeOf").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[SetPrototypeOf]]`(`V`).
7.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target`, `V` »)).
8.  If `booleanTrapResult` is false, return false.
9.  Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
10. If `extensibleTarget` is true, return true.
11. Let `targetProto` be ? `target`.`[[GetPrototypeOf]]`().
12. If [SameValue](#sec-samevalue)(`V`, `targetProto`) is false, throw a TypeError exception.
13. Return true.

Note

`[[SetPrototypeOf]]` for Proxy objects enforces the following invariants:

- The result of `[[SetPrototypeOf]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- If the target object is not extensible, the argument value must be the same as the result of `[[GetPrototypeOf]]` applied to target object.

### 10.5.3 `[[IsExtensible]]` ( )

The `[[IsExtensible]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "isExtensible").
6.  If `trap` is undefined, then
    1.  Return ? [IsExtensible](#sec-isextensible-o)(`target`).
7.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target` »)).
8.  Let `targetResult` be ? [IsExtensible](#sec-isextensible-o)(`target`).
9.  If `booleanTrapResult` is not `targetResult`, throw a TypeError exception.
10. Return `booleanTrapResult`.

Note

`[[IsExtensible]]` for Proxy objects enforces the following invariants:

- The result of `[[IsExtensible]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- `[[IsExtensible]]` applied to the Proxy object must return the same value as `[[IsExtensible]]` applied to the Proxy object's target object with the same argument.

### 10.5.4 `[[PreventExtensions]]` ( )

The `[[PreventExtensions]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "preventExtensions").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[PreventExtensions]]`().
7.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target` »)).
8.  If `booleanTrapResult` is true, then
    1.  Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
    2.  If `extensibleTarget` is true, throw a TypeError exception.
9.  Return `booleanTrapResult`.

Note

`[[PreventExtensions]]` for Proxy objects enforces the following invariants:

- The result of `[[PreventExtensions]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- `[[PreventExtensions]]` applied to the Proxy object only returns true if `[[IsExtensible]]` applied to the Proxy object's target object is false.

### 10.5.5 `[[GetOwnProperty]]` ( `P` )

The `[[GetOwnProperty]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) either a [Property Descriptor](#sec-property-descriptor-specification-type) or undefined, or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "getOwnPropertyDescriptor").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[GetOwnProperty]]`(`P`).
7.  Let `trapResultObj` be ? [Call](#sec-call)(`trap`, `handler`, « `target`, `P` »).
8.  If `trapResultObj` [is not an Object](#sec-object-type) and `trapResultObj` is not undefined, throw a TypeError exception.
9.  Let `targetDesc` be ? `target`.`[[GetOwnProperty]]`(`P`).
10. If `trapResultObj` is undefined, then
    1.  If `targetDesc` is undefined, return undefined.
    2.  If `targetDesc`.`[[Configurable]]` is false, throw a TypeError exception.
    3.  Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
    4.  If `extensibleTarget` is false, throw a TypeError exception.
    5.  Return undefined.
11. Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
12. Let `resultDesc` be ? [ToPropertyDescriptor](#sec-topropertydescriptor)(`trapResultObj`).
13. Perform [CompletePropertyDescriptor](#sec-completepropertydescriptor)(`resultDesc`).
14. Let `valid` be [IsCompatiblePropertyDescriptor](#sec-iscompatiblepropertydescriptor)(`extensibleTarget`, `resultDesc`, `targetDesc`).
15. If `valid` is false, throw a TypeError exception.
16. If `resultDesc`.`[[Configurable]]` is false, then
    1.  If `targetDesc` is undefined or `targetDesc`.`[[Configurable]]` is true, then
        1.  Throw a TypeError exception.
    2.  If `resultDesc` has a `[[Writable]]` field and `resultDesc`.`[[Writable]]` is false, then
        1.  [Assert](#assert): `targetDesc` has a `[[Writable]]` field.
        2.  If `targetDesc`.`[[Writable]]` is true, throw a TypeError exception.
17. Return `resultDesc`.

Note

`[[GetOwnProperty]]` for Proxy objects enforces the following invariants:

- The result of `[[GetOwnProperty]]` must be either an Object or undefined.
- A property cannot be reported as non-existent, if it exists as a non-configurable own property of the target object.
- A property cannot be reported as non-existent, if it exists as an own property of a non-extensible target object.
- A property cannot be reported as existent, if it does not exist as an own property of the target object and the target object is not extensible.
- A property cannot be reported as non-configurable, unless it exists as a non-configurable own property of the target object.
- A property cannot be reported as both non-configurable and non-writable, unless it exists as a non-configurable, non-writable own property of the target object.

### 10.5.6 `[[DefineOwnProperty]]` ( `P`, `Desc` )

The `[[DefineOwnProperty]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes arguments `P` (a [property key](#property-key)) and `Desc` (a [Property Descriptor](#sec-property-descriptor-specification-type)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "defineProperty").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[DefineOwnProperty]]`(`P`, `Desc`).
7.  Let `descObj` be [FromPropertyDescriptor](#sec-frompropertydescriptor)(`Desc`).
8.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target`, `P`, `descObj` »)).
9.  If `booleanTrapResult` is false, return false.
10. Let `targetDesc` be ? `target`.`[[GetOwnProperty]]`(`P`).
11. Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
12. If `Desc` has a `[[Configurable]]` field and `Desc`.`[[Configurable]]` is false, then
    1.  Let `settingConfigFalse` be true.
13. Else,
    1.  Let `settingConfigFalse` be false.
14. If `targetDesc` is undefined, then
    1.  If `extensibleTarget` is false, throw a TypeError exception.
    2.  If `settingConfigFalse` is true, throw a TypeError exception.
15. Else,
    1.  If [IsCompatiblePropertyDescriptor](#sec-iscompatiblepropertydescriptor)(`extensibleTarget`, `Desc`, `targetDesc`) is false, throw a TypeError exception.
    2.  If `settingConfigFalse` is true and `targetDesc`.`[[Configurable]]` is true, throw a TypeError exception.
    3.  If [IsDataDescriptor](#sec-isdatadescriptor)(`targetDesc`) is true, `targetDesc`.`[[Configurable]]` is false, and `targetDesc`.`[[Writable]]` is true, then
        1.  If `Desc` has a `[[Writable]]` field and `Desc`.`[[Writable]]` is false, throw a TypeError exception.
16. Return true.

Note

`[[DefineOwnProperty]]` for Proxy objects enforces the following invariants:

- The result of `[[DefineOwnProperty]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- A property cannot be added, if the target object is not extensible.
- A property cannot be non-configurable, unless there exists a corresponding non-configurable own property of the target object.
- A non-configurable property cannot be non-writable, unless there exists a corresponding non-configurable, non-writable own property of the target object.
- If a property has a corresponding target object property then applying the [Property Descriptor](#sec-property-descriptor-specification-type) of the property to the target object using `[[DefineOwnProperty]]` will not throw an exception.

### 10.5.7 `[[HasProperty]]` ( `P` )

The `[[HasProperty]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "has").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[HasProperty]]`(`P`).
7.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target`, `P` »)).
8.  If `booleanTrapResult` is false, then
    1.  Let `targetDesc` be ? `target`.`[[GetOwnProperty]]`(`P`).
    2.  If `targetDesc` is not undefined, then
        1.  If `targetDesc`.`[[Configurable]]` is false, throw a TypeError exception.
        2.  Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
        3.  If `extensibleTarget` is false, throw a TypeError exception.
9.  Return `booleanTrapResult`.

Note

`[[HasProperty]]` for Proxy objects enforces the following invariants:

- The result of `[[HasProperty]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- A property cannot be reported as non-existent, if it exists as a non-configurable own property of the target object.
- A property cannot be reported as non-existent, if it exists as an own property of the target object and the target object is not extensible.

### 10.5.8 `[[Get]]` ( `P`, `Receiver` )

The `[[Get]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes arguments `P` (a [property key](#property-key)) and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "get").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[Get]]`(`P`, `Receiver`).
7.  Let `trapResult` be ? [Call](#sec-call)(`trap`, `handler`, « `target`, `P`, `Receiver` »).
8.  Let `targetDesc` be ? `target`.`[[GetOwnProperty]]`(`P`).
9.  If `targetDesc` is not undefined and `targetDesc`.`[[Configurable]]` is false, then
    1.  If [IsDataDescriptor](#sec-isdatadescriptor)(`targetDesc`) is true and `targetDesc`.`[[Writable]]` is false, then
        1.  If [SameValue](#sec-samevalue)(`trapResult`, `targetDesc`.`[[Value]]`) is false, throw a TypeError exception.
    2.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`targetDesc`) is true and `targetDesc`.`[[Get]]` is undefined, then
        1.  If `trapResult` is not undefined, throw a TypeError exception.
10. Return `trapResult`.

Note

`[[Get]]` for Proxy objects enforces the following invariants:

- The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable own [data property](#sec-object-type).
- The value reported for a property must be undefined if the corresponding target object property is a non-configurable own [accessor property](#sec-object-type) that has undefined as its `[[Get]]` attribute.

### 10.5.9 `[[Set]]` ( `P`, `V`, `Receiver` )

The `[[Set]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes arguments `P` (a [property key](#property-key)), `V` (an [ECMAScript language value](#sec-ecmascript-language-types)), and `Receiver` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "set").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[Set]]`(`P`, `V`, `Receiver`).
7.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target`, `P`, `V`, `Receiver` »)).
8.  If `booleanTrapResult` is false, return false.
9.  Let `targetDesc` be ? `target`.`[[GetOwnProperty]]`(`P`).
10. If `targetDesc` is not undefined and `targetDesc`.`[[Configurable]]` is false, then
    1.  If [IsDataDescriptor](#sec-isdatadescriptor)(`targetDesc`) is true and `targetDesc`.`[[Writable]]` is false, then
        1.  If [SameValue](#sec-samevalue)(`V`, `targetDesc`.`[[Value]]`) is false, throw a TypeError exception.
    2.  If [IsAccessorDescriptor](#sec-isaccessordescriptor)(`targetDesc`) is true, then
        1.  If `targetDesc`.`[[Set]]` is undefined, throw a TypeError exception.
11. Return true.

Note

`[[Set]]` for Proxy objects enforces the following invariants:

- The result of `[[Set]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- Cannot change the value of a property to be different from the value of the corresponding target object property if the corresponding target object property is a non-writable, non-configurable own [data property](#sec-object-type).
- Cannot set the value of a property if the corresponding target object property is a non-configurable own [accessor property](#sec-object-type) that has undefined as its `[[Set]]` attribute.

### 10.5.10 `[[Delete]]` ( `P` )

The `[[Delete]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes argument `P` (a [property key](#property-key)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a Boolean or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "deleteProperty").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[Delete]]`(`P`).
7.  Let `booleanTrapResult` be [ToBoolean](#sec-toboolean)(? [Call](#sec-call)(`trap`, `handler`, « `target`, `P` »)).
8.  If `booleanTrapResult` is false, return false.
9.  Let `targetDesc` be ? `target`.`[[GetOwnProperty]]`(`P`).
10. If `targetDesc` is undefined, return true.
11. If `targetDesc`.`[[Configurable]]` is false, throw a TypeError exception.
12. Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
13. If `extensibleTarget` is false, throw a TypeError exception.
14. Return true.

Note

`[[Delete]]` for Proxy objects enforces the following invariants:

- The result of `[[Delete]]` [is a Boolean](#sec-ecmascript-language-types-boolean-type) value.
- A property cannot be reported as deleted, if it exists as a non-configurable own property of the target object.
- A property cannot be reported as deleted, if it exists as an own property of the target object and the target object is non-extensible.

### 10.5.11 `[[OwnPropertyKeys]]` ( )

The `[[OwnPropertyKeys]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes no arguments and returns either a [normal completion containing](#sec-completion-record-specification-type) a [List](#sec-list-and-record-specification-type) of [property keys](#property-key) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "ownKeys").
6.  If `trap` is undefined, then
    1.  Return ? `target`.`[[OwnPropertyKeys]]`().
7.  Let `trapResultArray` be ? [Call](#sec-call)(`trap`, `handler`, « `target` »).
8.  Let `trapResult` be ? [CreateListFromArrayLike](#sec-createlistfromarraylike)(`trapResultArray`, property-key).
9.  If `trapResult` contains any duplicate entries, throw a TypeError exception.
10. Let `extensibleTarget` be ? [IsExtensible](#sec-isextensible-o)(`target`).
11. Let `targetKeys` be ? `target`.`[[OwnPropertyKeys]]`().
12. [Assert](#assert): `targetKeys` is a [List](#sec-list-and-record-specification-type) of [property keys](#property-key).
13. [Assert](#assert): `targetKeys` contains no duplicate entries.
14. Let `targetConfigurableKeys` be a new empty [List](#sec-list-and-record-specification-type).
15. Let `targetNonconfigurableKeys` be a new empty [List](#sec-list-and-record-specification-type).
16. For each element `key` of `targetKeys`, do
    1.  Let `desc` be ? `target`.`[[GetOwnProperty]]`(`key`).
    2.  If `desc` is not undefined and `desc`.`[[Configurable]]` is false, then
        1.  Append `key` to `targetNonconfigurableKeys`.
    3.  Else,
        1.  Append `key` to `targetConfigurableKeys`.
17. If `extensibleTarget` is true and `targetNonconfigurableKeys` is empty, then
    1.  Return `trapResult`.
18. Let `uncheckedResultKeys` be a [List](#sec-list-and-record-specification-type) whose elements are the elements of `trapResult`.
19. For each element `key` of `targetNonconfigurableKeys`, do
    1.  If `uncheckedResultKeys` does not contain `key`, throw a TypeError exception.
    2.  Remove `key` from `uncheckedResultKeys`.
20. If `extensibleTarget` is true, return `trapResult`.
21. For each element `key` of `targetConfigurableKeys`, do
    1.  If `uncheckedResultKeys` does not contain `key`, throw a TypeError exception.
    2.  Remove `key` from `uncheckedResultKeys`.
22. If `uncheckedResultKeys` is not empty, throw a TypeError exception.
23. Return `trapResult`.

Note

`[[OwnPropertyKeys]]` for Proxy objects enforces the following invariants:

- The result of `[[OwnPropertyKeys]]` is a [List](#sec-list-and-record-specification-type).
- The returned [List](#sec-list-and-record-specification-type) contains no duplicate entries.
- Each element of the returned [List](#sec-list-and-record-specification-type) is a [property key](#property-key).
- The result [List](#sec-list-and-record-specification-type) must contain the keys of all non-configurable own properties of the target object.
- If the target object is not extensible, then the result [List](#sec-list-and-record-specification-type) must contain all the keys of the own properties of the target object and no other values.

### 10.5.12 `[[Call]]` ( `thisArgument`, `argumentsList` )

The `[[Call]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes arguments `thisArgument` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an [ECMAScript language value](#sec-ecmascript-language-types) or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  Let `handler` be `O`.`[[ProxyHandler]]`.
4.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
5.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "apply").
6.  If `trap` is undefined, then
    1.  Return ? [Call](#sec-call)(`target`, `thisArgument`, `argumentsList`).
7.  Let `argArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`argumentsList`).
8.  Return ? [Call](#sec-call)(`trap`, `handler`, « `target`, `thisArgument`, `argArray` »).

Note

A [Proxy exotic object](#proxy-exotic-object) only has a `[[Call]]` internal method if the initial value of its `[[ProxyTarget]]` internal slot is an object that has a `[[Call]]` internal method.

### 10.5.13 `[[Construct]]` ( `argumentsList`, `newTarget` )

The `[[Construct]]` internal method of a [Proxy exotic object](#proxy-exotic-object) `O` takes arguments `argumentsList` (a [List](#sec-list-and-record-specification-type) of [ECMAScript language values](#sec-ecmascript-language-types)) and `newTarget` (a [constructor](#constructor)) and returns either a [normal completion containing](#sec-completion-record-specification-type) an Object or a [throw completion](#sec-completion-record-specification-type). It performs the following steps when called:

1.  Perform ? [ValidateNonRevokedProxy](#sec-validatenonrevokedproxy)(`O`).
2.  Let `target` be `O`.`[[ProxyTarget]]`.
3.  [Assert](#assert): [IsConstructor](#sec-isconstructor)(`target`) is true.
4.  Let `handler` be `O`.`[[ProxyHandler]]`.
5.  [Assert](#assert): `handler` [is an Object](#sec-object-type).
6.  Let `trap` be ? [GetMethod](#sec-getmethod)(`handler`, "construct").
7.  If `trap` is undefined, then
    1.  Return ? [Construct](#sec-construct)(`target`, `argumentsList`, `newTarget`).
8.  Let `argArray` be [CreateArrayFromList](#sec-createarrayfromlist)(`argumentsList`).
9.  Let `newObj` be ? [Call](#sec-call)(`trap`, `handler`, « `target`, `argArray`, `newTarget` »).
10. If `newObj` [is not an Object](#sec-object-type), throw a TypeError exception.
11. Return `newObj`.

Note 1

A [Proxy exotic object](#proxy-exotic-object) only has a `[[Construct]]` internal method if the initial value of its `[[ProxyTarget]]` internal slot is an object that has a `[[Construct]]` internal method.

Note 2

`[[Construct]]` for Proxy objects enforces the following invariants:

- The result of `[[Construct]]` must be an Object.

### 10.5.14 ValidateNonRevokedProxy ( `proxy` )

The abstract operation ValidateNonRevokedProxy takes argument `proxy` (a [Proxy exotic object](#proxy-exotic-object)) and returns either a [normal completion containing](#sec-completion-record-specification-type) unused or a [throw completion](#sec-completion-record-specification-type). It throws a TypeError exception if `proxy` has been revoked. It performs the following steps when called:

1.  If `proxy`.`[[ProxyTarget]]` is null, throw a TypeError exception.
2.  [Assert](#assert): `proxy`.`[[ProxyHandler]]` is not null.
3.  Return unused.

### 10.5.15 ProxyCreate ( `target`, `handler` )

The abstract operation ProxyCreate takes arguments `target` (an [ECMAScript language value](#sec-ecmascript-language-types)) and `handler` (an [ECMAScript language value](#sec-ecmascript-language-types)) and returns either a [normal completion containing](#sec-completion-record-specification-type) a [Proxy exotic object](#proxy-exotic-object) or a [throw completion](#sec-completion-record-specification-type). It is used to specify the creation of new Proxy objects. It performs the following steps when called:

1.  If `target` [is not an Object](#sec-object-type), throw a TypeError exception.
2.  If `handler` [is not an Object](#sec-object-type), throw a TypeError exception.
3.  Let `P` be [MakeBasicObject](#sec-makebasicobject)(« `[[ProxyHandler]]`, `[[ProxyTarget]]` »).
4.  Set `P`'s essential internal methods, except for `[[Call]]` and `[[Construct]]`, to the definitions specified in [10.5](#sec-proxy-object-internal-methods-and-internal-slots).
5.  If [IsCallable](#sec-iscallable)(`target`) is true, then
    1.  Set `P`.`[[Call]]` as specified in [10.5.12](#sec-proxy-object-internal-methods-and-internal-slots-call-thisargument-argumentslist).
    2.  If [IsConstructor](#sec-isconstructor)(`target`) is true, then
        1.  Set `P`.`[[Construct]]` as specified in [10.5.13](#sec-proxy-object-internal-methods-and-internal-slots-construct-argumentslist-newtarget).
6.  Set `P`.`[[ProxyTarget]]` to `target`.
7.  Set `P`.`[[ProxyHandler]]` to `handler`.
8.  Return `P`.
