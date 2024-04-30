# React Developer Interwiev Questions

I've put together this file of answers to some of the most common questions
about JavaScript and React that you might be asked in a job interview.

> [!IMPORTANT]
> I've answered all the questions myself, using different sources.
> I can't promise that the answers are 100% correct and comprehensive, but I'm
> working on it!

## JavaScript Basics

### What data types exist in modern JS?

JavaScript includes 8 data types.

- Seven are primitive data types[^1]

  - **undefined**: a special value automatically assigned to identifiers if they
    don't have any value
  - **null**: A keyword denoting a nonexistent value, but implicitly assigned
  - **boolean**: contains `true` and `false` values
  - **string:**: a sequence of characters that represents a text value
  - **number**: an integer or floating point number
  - **bigint**: an integer with infinite precision
  - **symbol**: a data type whose instances are always unique

- And one is a non-primitive, or composite, data type

  - **Object**

#### Primitives

##### Immutability[^2]

It is important not to confuse a primitive value itself with a variable
assigned a primitive value. Primitives are immutable, so if you intend to
alter the variable containing a primitive, you need to replace its value with
a new one.

Strings are immutable, so you can't replace one letter in the string value.
Symbols are immutable also.

##### Auto-boxing

Technically, primitives have no methods or properties, but they behave as if
they do. When we try to access property or method of a primitive, JavaScript
temporary converts the primitive to the corresponding object.

> [!NOTE]
> `typeof null` will return `object` instead of `null`. This behaviour has some
historical reasons.
> [!NOTE]
> `-Infinity`, `+Infinity` and even `NaN` (not a number) are a
> special values of the number data type. And `NaN` it's also the only value in
> JavaScript that isn't equal to itself when we use the loose or strict
> equality operator to compare it (only `Object.is(NaN, NaN)` will return
> `true`).

#### Objects

Objects are stored in memory, and variable reference them by links. In
JavaScript, objects are the sole mutable values.

Arrays, Dates, Sets, Maps, and many more structures in JavaScript are also
objects. Additionally, functions are objects, with the added capability of being
callable.

Each object represents a collection of key-value pairs. Keys are either strings
or symbols, and values can be of any data type, including other objects.[^3]

[^1]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#data_structures_and_types>
[^2]: <https://developer.mozilla.org/en-US/docs/Glossary/Mutable>
[^3]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects>
