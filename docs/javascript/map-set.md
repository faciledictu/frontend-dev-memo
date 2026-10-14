---
sidebar_position: 9
description:
  Map vs plain objects, Set and set methods, WeakMap and WeakSet and when to use
  them
---

# Map, Set, WeakMap and WeakSet

- **`Map`** is a collection of key–value pairs where a key can be **any value**,
  including objects. It keeps **insertion order**, has `size` and is iterable.
- **`Set`** is a collection of **unique values**, also ordered and iterable.
- **`WeakMap`** and **`WeakSet`** hold objects **weakly**: an entry does not
  keep its key alive, and when the key becomes unreachable the entry disappears.
  That is why they can't be iterated and have no `size`.

`Map` keys and `Set` values are compared with **SameValueZero**: like `===`, but
`NaN` equals `NaN`. Objects are compared by reference.

## Details

### Map vs Object

|                  | `Map`                                      | Object                                          |
| ---------------- | ------------------------------------------ | ----------------------------------------------- |
| Keys             | any value                                  | strings and symbols; numbers become strings     |
| Order            | insertion order                            | integer keys first, ascending, then insertion   |
| Size             | `map.size`                                 | `Object.keys(obj).length`                       |
| Iteration        | directly: `for...of`, `forEach`            | through `Object.keys` / `entries`               |
| Inherited keys   | none                                       | from the prototype unless `Object.create(null)` |
| Frequent changes | optimized for adding and removing entries  | optimized for a fixed shape                     |
| JSON             | not supported: `JSON.stringify` gives `{}` | supported                                       |

Use an object for records with known fields and for data that goes to JSON. Use
a `Map` for dictionaries with arbitrary or non-string keys, frequent additions
and removals, and when the order matters. Conversion: `Object.fromEntries(map)`
and `new Map(Object.entries(obj))`.

### Map and Set Methods

| `Map`                       | `Set`                      | What it does                                 |
| --------------------------- | -------------------------- | -------------------------------------------- |
| `new Map([[k, v], …])`      | `new Set(iterable)`        | creates from an iterable                     |
| `set(key, value)`           | `add(value)`               | adds or replaces; returns the collection     |
| `get(key)`                  | —                          | the value or `undefined`                     |
| `has(key)`                  | `has(value)`               | checks presence                              |
| `delete(key)`               | `delete(value)`            | removes; returns `true` if it was there      |
| `clear()`                   | `clear()`                  | removes everything                           |
| `size`                      | `size`                     | the number of entries (a getter, not a call) |
| `keys()`, `values()`        | `keys()`, `values()`       | iterators in insertion order                 |
| `entries()`, `forEach(fn)`  | `entries()`, `forEach(fn)` | `entries()` of a `Set` gives `[v, v]` pairs  |
| `Map.groupBy(items, fn)`    | —                          | groups items into a `Map` by key (ES2024)    |
| `getOrInsert(key, default)` | —                          | `get`, or `set` and return (ES2026)          |

`getOrInsertComputed(key, fn)` calls `fn` only when the key is missing. Both
also exist on `WeakMap`. They are Baseline 2026 and not in Node.js 24 (added in
Node.js 26): check support or use a polyfill.

### Set Operations (ES2025)

| Method                     | Result                                 |
| -------------------------- | -------------------------------------- |
| `a.union(b)`               | new `Set`: in `a` or in `b`            |
| `a.intersection(b)`        | new `Set`: in both                     |
| `a.difference(b)`          | new `Set`: in `a` but not in `b`       |
| `a.symmetricDifference(b)` | new `Set`: in exactly one of them      |
| `a.isSubsetOf(b)`          | `true` if every value of `a` is in `b` |
| `a.isSupersetOf(b)`        | `true` if every value of `b` is in `a` |
| `a.isDisjointFrom(b)`      | `true` if they share no values         |

The argument must be **set-like** (`size`, `has`, `keys`): a `Set` or a `Map`,
but not an array. `a.union([1, 2])` throws a `TypeError`; wrap it:
`a.union(new Set([1, 2]))`.

### WeakMap and WeakSet

- Keys of a `WeakMap` and values of a `WeakSet` must be **objects** (or
  non-registered symbols). Adding a primitive throws a `TypeError`.
- Only `get`, `set`, `has`, `delete` (`add` for `WeakSet`). No `size`, no
  iteration, no `clear`: the contents depend on when the garbage collector runs.
- Uses:
  - **data attached to objects you don't own**: DOM nodes, objects from a
    library;
  - **caches** keyed by an object, freed together with it;
  - **marking objects** as visited or processed (`WeakSet`);
  - **private data** of instances (before `#private` fields).
- `WeakRef` holds a weak reference to a single object, and
  `FinalizationRegistry` runs a callback after an object is collected. Both are
  rarely needed. See [Garbage Collection](./garbage-collection.md).

## Example

<details>
<summary>Examples</summary>

```javascript
const user = { name: 'Ann' };

const visits = new Map();
visits.set(user, 1);
visits.set('user', 2); // a string key is a different key
visits.get(user); // 1
visits.size; // 2

// An object as an object key becomes '[object Object]'
const obj = {};
obj[user] = 1;
Object.keys(obj); // ['[object Object]']

// NaN works as a key
new Map([[NaN, 'not a number']]).get(NaN); // 'not a number'

// Unique values
[...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]

// Grouping
const items = [
  { name: 'apple', type: 'fruit' },
  { name: 'carrot', type: 'vegetable' },
  { name: 'pear', type: 'fruit' },
];
Map.groupBy(items, (item) => item.type).get('fruit').length; // 2

// Set operations
const frontend = new Set(['js', 'css', 'html']);
const backend = new Set(['js', 'sql']);
frontend.intersection(backend); // Set { 'js' }
frontend.difference(backend); // Set { 'css', 'html' }
```

A cache that does not hold on to its keys:

```javascript
const cache = new WeakMap();

function getStats(data) {
  if (!cache.has(data)) {
    cache.set(data, { sum: data.reduce((a, b) => a + b, 0) });
  }
  return cache.get(data);
}

let data = [1, 2, 3];
getStats(data); // computed
getStats(data); // from the cache
data = null; // the array and its cache entry can now be collected
```

</details>

## Follow-up Questions

- How do you remove duplicates from an array of objects by `id`? A `Map` keyed
  by `id`: `[...new Map(users.map((u) => [u.id, u])).values()]`; later items
  win.
- Why can't you iterate over a `WeakMap`? The result would depend on when the
  garbage collector runs, so the language does not expose it.
- Why does a `Map` with object keys leak and a `WeakMap` does not? A `Map` key
  is a strong reference: the object stays reachable through the map until the
  entry is deleted.
- How do you serialize a `Map`? `JSON.stringify([...map])` or
  `JSON.stringify(Object.fromEntries(map))` if the keys are strings.

## Common Mistakes

- `map[key] = value` instead of `map.set(key, value)`: it creates a property on
  the `Map` object, not an entry.
- `map.size()`: `size` is a property.
- Expecting `new Set([{ id: 1 }, { id: 1 }])` to contain one object: the objects
  are different references.
- "`WeakMap` is a faster `Map`." It is a different tool: object keys only, no
  iteration.
- Using an object as a dictionary with user-provided keys: a key like
  `__proto__` or `constructor` hits the prototype. Use a `Map` or
  `Object.create(null)`.

## See Also

- [Objects](./objects.md)
- [Iterators and Generators](./iterators-generators.md)
- [Garbage Collection](./garbage-collection.md)
