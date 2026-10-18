---
sidebar_position: 9
description:
  Cloning objects, accessing properties, iterating, Object static methods
tags: [junior, middle]
---

# Objects

An object is a collection of **key-value pairs**. Keys are strings or symbols,
values can be of any type. Objects are stored and compared **by reference**, so
copying a variable does not copy the object. A **shallow clone** copies only the
top level (`{ ...obj }`, `Object.assign()`); a **deep clone** copies nested
objects too (`structuredClone()`).

## Cloning

| Way                               | Depth   | Notes                                                  |
| --------------------------------- | ------- | ------------------------------------------------------ |
| `{ ...obj }`                      | shallow | nested objects are shared with the original            |
| `Object.assign({}, obj)`          | shallow | the same; can also merge several sources into a target |
| `structuredClone(obj)`            | deep    | handles `Date`, `Map`, `Set` and cyclic references     |
| `JSON.parse(JSON.stringify(obj))` | deep    | JSON-compatible data only                              |
| `cloneDeep(obj)` from lodash      | deep    | keeps prototypes; copies functions by reference        |

Limitations:

- **`structuredClone`** throws `DataCloneError` on functions and DOM nodes. The
  prototype chain, getters and setters are not preserved, so class instances
  become plain objects.
- **JSON** drops functions and `undefined` values, turns `Date` into a string
  and `Map` / `Set` into empty objects, and throws on cyclic references.

<details>
<summary>Examples</summary>

```javascript
const original = { a: 1, nested: { b: 2 }, date: new Date() };

const shallow = { ...original };
shallow.nested.b = 3;
console.log(original.nested.b); // 3: the nested object is shared

const deep = structuredClone(original);
deep.nested.b = 4;
console.log(original.nested.b); // 3: the nested object was copied
console.log(deep.date instanceof Date); // true

const viaJson = JSON.parse(JSON.stringify(original));
console.log(typeof viaJson.date); // 'string'
```

</details>

## Accessing Properties

| Syntax                      | What it does                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `obj.key`                   | dot notation, for known valid identifiers                                               |
| `obj[key]`                  | bracket notation, for dynamic keys and keys that are not identifiers                    |
| `obj?.key`                  | optional chaining: `undefined` instead of `TypeError` if `obj` is `null` or `undefined` |
| `value ?? fallback`         | nullish coalescing: the fallback only for `null` and `undefined`                        |
| `'key' in obj`              | checks own and inherited properties                                                     |
| `Object.hasOwn(obj, 'key')` | checks own properties only                                                              |
| `const { key } = obj`       | destructuring                                                                           |

`??` differs from `||`: `0`, `''` and `false` are kept, because they are not
nullish.

<details>
<summary>Examples</summary>

```javascript
const person = { name: 'John', age: 0 };

console.log(person.name); // 'John'

const propName = 'age';
console.log(person[propName]); // 0

console.log(person.contacts?.email); // undefined
console.log(person.contacts?.email ?? 'no email'); // 'no email'

console.log(person.age || 18); // 18
console.log(person.age ?? 18); // 0

console.log('toString' in person); // true
console.log(Object.hasOwn(person, 'toString')); // false
```

</details>

## Iterating

| Way                   | What it goes over                               |
| --------------------- | ----------------------------------------------- |
| `for...in`            | enumerable string keys, **including inherited** |
| `Object.keys(obj)`    | own enumerable keys                             |
| `Object.values(obj)`  | own enumerable values                           |
| `Object.entries(obj)` | own enumerable `[key, value]` pairs             |

Integer-like keys go first in ascending order, then string keys in the order
they were added. `for...in` is not meant for arrays. Plain objects are not
iterable, so `for...of` needs one of the methods above; see
[Iterators and Generators](./iterators-generators.md).

<details>
<summary>Examples</summary>

```javascript
const obj = { a: 1, b: 2, c: 3 };

console.log(Object.keys(obj)); // ['a', 'b', 'c']
console.log(Object.values(obj)); // [1, 2, 3]
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]

for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}
```

</details>

## `Object` Static Methods

| Method                                        | What it does                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Object.keys / values / entries`              | arrays of own enumerable keys, values or pairs                                                    |
| `Object.fromEntries(pairs)`                   | builds an object from `[key, value]` pairs                                                        |
| `Object.assign(target, ...src)`               | copies own enumerable properties into `target`                                                    |
| `Object.hasOwn(obj, key)`                     | own property check; replaces `hasOwnProperty` (ES2022)                                            |
| `Object.freeze(obj)`                          | forbids any changes; shallow                                                                      |
| `Object.seal(obj)`                            | forbids adding and deleting; values can be changed                                                |
| `Object.create(proto)`                        | new object with the given prototype                                                               |
| `Object.defineProperty(obj, key, descriptor)` | sets `writable`, `enumerable`, `configurable`, or `get` / `set`; omitted flags default to `false` |
| `Object.getPrototypeOf(obj)`                  | returns the prototype                                                                             |
| `Object.groupBy(items, fn)`                   | groups items into an object by key (ES2024)                                                       |

## Creating

- **Object literal**: key-value pairs in curly braces `{}`.
- **`Object.create(proto)`**: a new object with the given prototype.
- **Constructor function or class** with `new`. See [Classes](./classes.md) and
  [Prototypes](./prototypes.md).

## Follow-up Questions

- How do you compare two objects? `===` compares references. Compare the
  contents field by field or with a deep-equal helper; see
  [Common Coding Tasks](./coding-tasks.md#deep-equal).
- How do you make an object immutable? `Object.freeze()` is shallow; nested
  objects have to be frozen separately.
- When should `Map` be used instead of an object? For keys that are not strings,
  frequent additions and removals, and when the size and insertion order matter.
  See [Map, Set, WeakMap and WeakSet](./map-set.md).

## Common Mistakes

- "The spread operator makes a deep copy." Only the top level is copied.
- Mixing up `?.` (optional chaining) and `??` (nullish coalescing).
- Using `||` for defaults and losing `0` or an empty string.
- "`const` makes an object immutable." See [Variables](./variables.md).
