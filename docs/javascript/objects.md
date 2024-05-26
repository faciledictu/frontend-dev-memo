---
sidebar_position: 7
description: Working with objects in JavaScript
---

# Objects

## Creating

- **Object Literal notation[^11].** It allows defining key-value pairs within
  curly braces `{}`.
- **`Object.create()` method[^12].** This method allows you to create a new
  object using a prototype object passed as an argument.
- **Constructor function and ES6 Classes[^13].** These approaches allows you to
  create an object using the `new` keyword. JavaScript offers various built-in
  constructors for creating different objects, and it's also possible to define
  custom ones. While both constructor functions and ES6 classes can be used,
  classes provide a more organized and structured way to create objects.

[^11]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer

[^12]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

[^13]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects#using_a_constructor_function

## Cloning

### Shallow Clone

A shallow clone in JavaScript refers to a copy of an object where the top-level
properties are duplicated, but nested objects or arrays are not deeply copied.
Instead, the references to the nested objects or arrays are copied. Changes to
nested objects or arrays in the clone will affect the original object.

#### Using `Object.assign()` static method

`Object.assign()` copies all enumerable own properties from one or more source
objects to a target object. It returns the target object

```javascript
const original = { a: 1, b: 2 };
const clone = Object.assign({}, original);
console.log(clone); // { a: 1, b: 2 }
```

#### Using Spread Operator `...`

Works the similar way as `Object.assign()`, but uses another syntax.

```javascript
const original = { a: 1, b: 2 };
const clone = { ...original };
console.log(clone); // { a: 1, b: 2 }
```

### Deep Clone

#### Using `structuredClone()` global function

`tructuredClone()` is a built-in JavaScript function that creates a deep clone
of a given value, including objects, arrays, and other complex data types.

```javascript
const original = {
  a: 1,
  b: {
    c: 2,
  },
  d: new Date(),
};

const clone = structuredClone(original);
console.log(clone); // { a: 1, b: { c: 2 }, d: Date object }
```

This function is supported in modern browsers and Node.js. However, in some
environments `structuredClone` is not available.

#### Using `JSON` methods

This method works well for simple objects but has limitations with functions,
`Date`, `Set`, `Map` and more complex object as well as `undefined` values,
because of limitations of JSON format itself.

```javascript
const original = { a: 1, b: { c: 2 } };
const stringified = JSON.stringify(original);
const clone = JSON.parse(stringified);

console.log(clone); // { a: 1, b: { c: 2 } }
```

#### Using Recursive Function or Libraries

Some libraries provide their own solutions for deep cloning. For example, lodash
has `cloneDeep()` function.

## Accessing properties and methods

### Dot Notation

```javascript
// Object
const person = {
  name: 'John',
  age: 30,
  city: 'New York',
};

console.log(person.name); // John
console.log(person.age); // 30
```

#### The optional chaining operator

The optional chaining operator (also known as nullish coalescing) allows you to
access properties of an object without the fear of encountering _TypeError_ if
the property does not exist (or is nullish).

```javascript
console.log(person.contacts?.email); // undefined
```

This operator simplifies code and makes it more readable, especially in
scenarios where you need to access nested properties and handle potential null
or undefined values gracefully.

### Bracket Notation

You can use square brackets and put the property name as a string inside them.

```javascript
console.log(person['name']); // Output: John

const propName = 'age';
console.log(person[propName]); // Output: 30
```

### `for...in` Statement

This loop statement is used for iterating over the enumerable properties of an
object. It allows you to iterate over the keys (property names) of an object,
including inherited ones, but it's not suitable for iterating over arrays or
other iterable objects.

```javascript
const person = {
  name: 'Alice',
  age: 30,
  gender: 'female',
};

for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
```

## `Object` static methods

`Object.hasOwn(obj)` returns `true` if the object has the specified property as
its own property, otherwise returns false. Introduced in ECMAScript 2022 (ES13),
this method provides a more reliable and modern alternative to
`Object.prototype.hasOwnProperty()`.

```javascript
const exampleObject = {
  name: 'Alice',
  age: 30,
};

console.log(Object.hasOwn(exampleObject, 'name')); // true
console.log(Object.hasOwn(exampleObject, 'gender')); // false
console.log(Object.hasOwn(exampleObject, 'toString')); // false

// If the environment doesn't support Object.hasOwn() method
console.log(exampleObject.hasOwnProperty('name')); // true
```

`Object.keys(obj)` returns an array of a given object's own enumerable property
names.

`Object.values(obj)` returns an array of a given object's own enumerable
property values.

`Object.entries(obj)` returns an array of a given object's own enumerable
property `[key, value]` pairs.

```javascript
const obj = { a: 1, b: 2, c: 3 };

const keys = Object.keys(obj);
console.log(keys); // ['a', 'b', 'c']

const values = Object.values(obj);
console.log(values); // [1, 2, 3]

const entries = Object.entries(obj);
console.log(entries); // [['a', 1], ['b', 2], ['c', 3]]
```
