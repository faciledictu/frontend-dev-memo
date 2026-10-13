---
sidebar_position: 8
description:
  Creating and cloning objects, accessing properties, Object static methods
---

# Objects

An object is a collection of **key-value pairs**. Keys are strings or symbols,
values can be of any type. Objects are stored and compared **by reference**, so
copying a variable does not copy the object. A **shallow clone** copies only the
top level (`{ ...obj }`, `Object.assign()`); a **deep clone** copies nested
objects too (`structuredClone()`).

## Creating

- **Object Literal notation[^1].** It allows defining key-value pairs within
  curly braces `{}`.
- **`Object.create()` method[^2].** This method allows you to create a new
  object using a prototype object passed as an argument.
- **Constructor function and ES6 Classes[^3].** These approaches allow you to
  create an object using the `new` keyword. See [Classes](./classes.md) and
  [Prototypes](./prototypes.md).

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer

[^2]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

[^3]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects#using_a_constructor_function

## Cloning

### Shallow Clone

A shallow clone copies the top-level properties. Nested objects and arrays are
not copied: the clone and the original share them, so a change to a nested
object in the clone affects the original.

#### Using `Object.assign()` static method

`Object.assign()` copies all enumerable own properties from one or more source
objects to a target object. It returns the target object.

```javascript
const original = { a: 1, b: 2 };
const clone = Object.assign({}, original);
console.log(clone); // { a: 1, b: 2 }
```

#### Using Spread Operator `...`

Works in a similar way to `Object.assign()`, but uses another syntax.

```javascript
const original = { a: 1, b: 2 };
const clone = { ...original };
console.log(clone); // { a: 1, b: 2 }
```

### Deep Clone

#### Using `structuredClone()` global function

`structuredClone()` is a built-in JavaScript function that creates a deep clone
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

It handles `Date`, `Map`, `Set`, typed arrays and cyclic references. Its
limitations:

- functions and DOM nodes can't be cloned (`DataCloneError`);
- the prototype chain, getters and setters are not preserved, so class instances
  become plain objects.

#### Using `JSON` methods

An older approach that works only for JSON-compatible data: functions and
`undefined` values are dropped, `Date` becomes a string, `Map` and `Set` become
empty objects, and cyclic references throw.

```javascript
const original = { a: 1, b: { c: 2 } };
const stringified = JSON.stringify(original);
const clone = JSON.parse(stringified);

console.log(clone); // { a: 1, b: { c: 2 } }
```

#### Using Recursive Function or Libraries

Some libraries provide their own solutions for deep cloning. For example, lodash
has a `cloneDeep()` function.

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

The optional chaining operator `?.` allows you to access properties of an object
without the fear of encountering _TypeError_ if the value before the operator is
nullish (`null` or `undefined`). In that case the whole expression evaluates to
`undefined`.

It is often combined with the nullish coalescing operator `??`, which provides a
fallback for a nullish value.

```javascript
console.log(person.contacts?.email); // undefined
console.log(person.contacts?.email ?? 'no email'); // 'no email'
```

### Bracket Notation

You can use square brackets and put the property name as a string inside them.

```javascript
console.log(person['name']); // Output: John

const propName = 'age';
console.log(person[propName]); // Output: 30
```

### `for...in` Statement

Iterates over the enumerable string keys of an object, **including inherited
ones**. To iterate over own keys only, use `Object.keys()` or
`Object.entries()`. It is not meant for arrays.

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

`Object.hasOwn(obj, prop)` returns `true` if the object has the specified
property as its own property, otherwise returns `false`. Introduced in
ECMAScript 2022 (ES13), this method provides a more reliable and modern
alternative to `Object.prototype.hasOwnProperty()`.

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
