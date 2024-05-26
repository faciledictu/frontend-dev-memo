---
sidebar_position: 1.5
description: What data types exist in modern JS
---

# Data types

JavaScript includes 8 data types.

- Seven are primitive data types[^1]

  - **undefined**: a special value automatically assigned to identifiers if they
    don't have any value
  - **null**: A keyword denoting a nonexistent value, but implicitly assigned
  - **boolean**: contains `true` and `false` values
  - **string**: a sequence of characters that represents a text value
  - **number**: an integer or floating point number
  - **bigint**: an integer with infinite precision
  - **symbol**: a data type whose instances are always unique

- And one is a non-primitive, or composite, data type

  - **Object**

:::note Note

`typeof null` will return `object` instead of `null`. This behaviour has some
historical reasons.

:::

:::note Note

`-Infinity`, `+Infinity` and even `NaN` (not a number) are a special values of
the number data type. And `NaN` it's also the only value in JavaScript that
isn't equal to itself when we use the loose or strict equality operator to
compare it (only `Object.is(NaN, NaN)` will return `true`).

:::

## Primitives

### Immutability[^2]

It is important not to confuse a primitive value itself with a variable assigned
a primitive value. Primitives are immutable, so if you intend to alter the
variable containing a primitive, you need to replace its value with a new one.

Strings are immutable, so you can't replace one letter in the string value.
Symbols are immutable also.

### Auto-boxing

Technically, primitives have no methods or properties, but they behave as if
they do. When we try to access property or method of a primitive, JavaScript
temporary converts the primitive to the corresponding object.

## Objects

Objects are stored in memory, and variables reference them by links. In
JavaScript, objects are the sole mutable values.

Arrays, Dates, Sets, Maps, and many more structures in JavaScript are also
objects. Additionally, functions are objects, with the added capability of being
callable.

Each object represents a collection of key-value pairs. Keys are either strings
or symbols, and values can be of any data type, including other objects.[^3]

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#data_structures_and_types

[^2]: https://developer.mozilla.org/en-US/docs/Glossary/Mutable
[^3]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects

## Type converson

JavaScript is a weakly typed language, so values can be converted to another
type when needed. This called **impicit type conversion** or **type coercion**.
For example, when we use logical negation operator `!` followed value is coerced
to boolean. Invoking `console.log()` with any non-string argument triggers
string coercion.

Values can be converted different ways: to primitives (it’s called _Primitive
coercion_), to strings (_String coercion_), to booleans (_Boolean coercion_), to
numbers (_Numeric coercion_) and to object (_Object coercion_). However, values
cannot be coerced to `null`, `undefined`, or `symbol`. In other words, these
data types don't have their coercion process.[^4]

Manual transformations of data from one type to another called **explicit type
conversion** and achieved through functions like `parseInt()`, `Object()` or
methods like `.toString`.

[^4]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#type_coercion
