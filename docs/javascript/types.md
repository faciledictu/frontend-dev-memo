---
sidebar_position: 1
description: What data types exist in modern JS
---

# Data Types

JavaScript has **8 data types**: seven **primitives** and **object**.[^1]

- **undefined**: the value of a variable that has not been assigned
- **null**: an intentionally empty value, assigned explicitly
- **boolean**: `true` and `false`
- **number**: a 64-bit floating point number, used for integers too
- **bigint**: an integer with arbitrary precision
- **string**: a sequence of characters
- **symbol**: a unique identifier
- **object**: a collection of key-value pairs; arrays, functions, dates, maps
  and sets are objects too

Primitives are **immutable** and compared **by value**. Objects are **mutable**
and compared **by reference**.

## Details

### `typeof`

| Value                      | Result        |
| -------------------------- | ------------- |
| `undefined`                | `'undefined'` |
| `null`                     | `'object'`    |
| `function () {}`           | `'function'`  |
| `[]`, `{}`, `new Date()`   | `'object'`    |
| any other primitive (`1n`) | its type name |

`typeof null` is `'object'` for historical reasons. Check for `null` with
`value === null` and for arrays with `Array.isArray(value)`.

### Special Numbers

- `Infinity`, `-Infinity` and `NaN` (not a number) are values of the number
  type.
- `NaN` is the only value that is not equal to itself. Use `Number.isNaN(value)`
  or `Object.is(value, NaN)`.
- Fractions are stored in binary, so `0.1 + 0.2 !== 0.3`.

### Primitives

- **Immutability[^2].** A primitive value cannot be changed, only replaced: you
  can't replace one letter in a string, you assign a new string to the variable.
- **Auto-boxing.** Primitives have no methods or properties, but behave as if
  they do. When a property is accessed, JavaScript temporarily wraps the
  primitive in the corresponding object (`String`, `Number` and so on).

### Objects

- A variable holds a **reference** to the object. Assigning it to another
  variable or passing it to a function copies the reference, not the object. See
  [Objects](./objects.md) for cloning.
- Keys are strings or symbols, values can be of any type.[^3]

### Type Conversion

- **Implicit conversion (coercion)** happens when an operator or a function
  needs another type: `!value`, `'1' + 1`, `if (value)`.[^4]
- **Explicit conversion** is done by the developer: `Number()`, `String()`,
  `Boolean()`, `parseInt()`.
- **Falsy values**: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`.
  Everything else is truthy, including `'0'`, `[]` and `{}`.
- `===` compares without conversion. `==` converts the operands to the same type
  first. `null == undefined` is `true`, and neither of them equals anything
  else.

## Example

```javascript
console.log(1 + '2'); // '12'
console.log('3' * '2'); // 6
console.log([] + {}); // '[object Object]'
console.log(null == undefined); // true
console.log(null == 0); // false
console.log(NaN === NaN); // false
console.log(0.1 + 0.2 === 0.3); // false
console.log(typeof null); // 'object'
```

## Follow-up Questions

- What is the difference between `null` and `undefined`? `undefined` means "no
  value was assigned", `null` is assigned explicitly to say "empty".
- When is `==` acceptable? `value == null` checks for both `null` and
  `undefined`. In other cases use `===`.
- How do you compare two objects by content? Field by field; `===` only tells
  whether it is the same object.

## Common Mistakes

- "`typeof null` is `'null'`." It is `'object'`.
- "An empty array is falsy." `[]` and `{}` are truthy.
- "Arrays and functions are separate types." They are objects.
- "`number` has integers and floats." There is one number type; integers are
  safe up to `Number.MAX_SAFE_INTEGER`, beyond that use `bigint`.

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#data_structures_and_types

[^2]: https://developer.mozilla.org/en-US/docs/Glossary/Mutable

[^3]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects

[^4]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#type_coercion
