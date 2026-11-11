## `type`: Defining Algebraic Data Types

The `type` form defines a new data type with one or more variants, each with its own named fields.

### Basic Types

```lisp
(type Option
  (Some :any value)
  None)

(type Result
  (Ok :any value)
  (Err :any error))
```

These compile to constructor functions and constant objects:

```javascript
{
  function Some(value) {
    return {tag: "Some", value: value};
  }
  const None = {tag: "None"};
}
```

```javascript
{
  function Ok(value) {
    return {tag: "Ok", value: value};
  }
  function Err(error) {
    return {tag: "Err", error: error};
  }
}
```

### Multi-Field Constructors

```lisp
(type Shape
  (Circle :number radius)
  (Rect :number width :number height)
  (Point))
```

```javascript
{
  function Circle(radius) {
    if (typeof radius !== "number" || Number.isNaN(radius))
      throw new TypeError(
        "Circle: field 'radius' expected number, got " + typeof radius);

    return {tag: "Circle", radius: radius};
  }
  function Rect(width, height) {
    if (typeof width !== "number" || Number.isNaN(width))
      throw new TypeError(
        "Rect: field 'width' expected number, got " + typeof width);

    if (typeof height !== "number" || Number.isNaN(height))
      throw new TypeError(
        "Rect: field 'height' expected number, got " + typeof height);

    return {tag: "Rect", width: width, height: height};
  }
  const Point = {tag: "Point"};
}
```

### What You're Looking At

Several things are worth noticing in that output:

**Named fields.** `{ tag: "Circle", radius: 5 }` is debuggable — `console.log` shows the field names. Not `{ tag: "Circle", _0: 5 }`.

**Zero-field constructors are constant objects.** `Point` is `{ tag: "Point" }`, not a function. The tag is always present — `match` always checks `.tag`, regardless of how many fields the variant has.

**All fields require type annotations.** `:any` is the explicit opt-out. Same convention as `func` parameters and `fn` params — if you declare a type, it's enforced.

**Construction-time validation.** `Circle("not a number")` throws `TypeError` in development. Stripped by `--strip-assertions`.

**Constructors are values.** `Some` is a regular function. You can pass it to `map`: `(items:map Some)` wraps every element in `Some`. Constructors compose like any other function.
