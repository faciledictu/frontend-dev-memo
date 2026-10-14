---
sidebar_position: 7
description: Array methods by group, mutating and non-mutating, common pitfalls
---

# Arrays

An array is an **object** for storing an ordered collection: elements of any
type are accessed by an index that starts from `0`, and `length` is the highest
index plus one. The main thing to remember about array methods is which of them
**mutate** the array and which **return a new one**.

| Mutate the array                  | Return a new array or value                   |
| --------------------------------- | --------------------------------------------- |
| `push`, `pop`, `shift`, `unshift` | `concat`, `slice`, spread `[...arr]`          |
| `splice`                          | `toSpliced`, `with` (ES2023)                  |
| `sort`, `reverse`                 | `toSorted`, `toReversed` (ES2023)             |
| `fill`, `copyWithin`              | `map`, `filter`, `flat`, `flatMap`            |
|                                   | `find`, `includes`, `some`, `every`, `reduce` |

## Methods

### Adding and Removing

| Method                                 | What it does                            | Returns          |
| -------------------------------------- | --------------------------------------- | ---------------- |
| `push(...items)`                       | adds to the end                         | new length       |
| `pop()`                                | removes the last element                | removed element  |
| `unshift(...items)`                    | adds to the beginning                   | new length       |
| `shift()`                              | removes the first element               | removed element  |
| `splice(start, deleteCount, ...items)` | removes and inserts in place            | removed elements |
| `slice(start, end)`                    | copies a part, `end` is not included    | new array        |
| `concat(...arrays)`                    | joins arrays                            | new array        |
| `with(index, value)`                   | replaces one element in a copy (ES2023) | new array        |

`splice` changes the array, `slice` does not.

<details>
<summary>Examples</summary>

```javascript
const colors = ['red', 'green', 'blue'];

colors.push('yellow'); // 4, colors: ['red', 'green', 'blue', 'yellow']
colors.pop(); // 'yellow', colors: ['red', 'green', 'blue']
colors.unshift('orange'); // 4, colors: ['orange', 'red', 'green', 'blue']
colors.shift(); // 'orange', colors: ['red', 'green', 'blue']

// At index 1, remove 1 element and insert 'purple'
colors.splice(1, 1, 'purple'); // ['green'], colors: ['red', 'purple', 'blue']

colors.slice(0, 2); // ['red', 'purple'], colors is not changed
colors.with(0, 'pink'); // ['pink', 'purple', 'blue'], colors is not changed
```

</details>

### Searching and Checking

| Method                 | What it does                              | Returns                |
| ---------------------- | ----------------------------------------- | ---------------------- |
| `includes(value)`      | checks whether the value is in the array  | boolean                |
| `indexOf(value)`       | finds the position of a value             | index or `-1`          |
| `find(fn)`             | first element that passes the test        | element or `undefined` |
| `findIndex(fn)`        | position of the first element that passes | index or `-1`          |
| `findLast(fn)`         | the same as `find`, from the end          | element or `undefined` |
| `some(fn)`             | at least one element passes the test      | boolean                |
| `every(fn)`            | all elements pass the test                | boolean                |
| `Array.isArray(value)` | checks whether the value is an array      | boolean                |

- `includes` finds `NaN`, `indexOf` does not.
- On an empty array `every` returns `true` and `some` returns `false`.

### Transforming

| Method                     | What it does                                  | Returns      |
| -------------------------- | --------------------------------------------- | ------------ |
| `map(fn)`                  | converts every element                        | new array    |
| `filter(fn)`               | keeps the elements that pass the test         | new array    |
| `reduce(fn, initial)`      | folds the array into one value, left to right | single value |
| `reduceRight(fn, initial)` | the same, right to left                       | single value |
| `flat(depth)`              | flattens nested arrays, one level by default  | new array    |
| `flatMap(fn)`              | `map` followed by `flat` of one level         | new array    |
| `join(separator)`          | glues the elements into a string              | string       |

<details>
<summary>Examples</summary>

```javascript
const numbers = [1, 2, 3];

numbers.map((n) => n * 2); // [2, 4, 6]
numbers.filter((n) => n > 1); // [2, 3]
numbers.reduce((sum, n) => sum + n, 0); // 6

['a', 'b', 'c'].reduceRight((acc, letter) => acc + letter, ''); // 'cba'

[1, [2, [3]]].flat(); // [1, 2, [3]]
['a b', 'c'].flatMap((s) => s.split(' ')); // ['a', 'b', 'c']
numbers.join('-'); // '1-2-3'
```

</details>

### Ordering

| Method                | What it does             | Returns        |
| --------------------- | ------------------------ | -------------- |
| `sort(compareFn)`     | sorts in place           | the same array |
| `toSorted(compareFn)` | sorts a copy (ES2023)    | new array      |
| `reverse()`           | reverses in place        | the same array |
| `toReversed()`        | reverses a copy (ES2023) | new array      |

Without a comparison function `sort` converts the elements to **strings** and
compares their UTF-16 code units, so numbers need a comparator:

```javascript
const arr = [1, 10, 2];

arr.sort(); // [1, 10, 2]
arr.sort((a, b) => a - b); // [1, 2, 10]
```

### Iterating

| Way           | What it does                                         |
| ------------- | ---------------------------------------------------- |
| `forEach(fn)` | calls `fn` for every element, returns `undefined`    |
| `for...of`    | a loop over the values; supports `break` and `await` |
| `entries()`   | an iterator of `[index, value]` pairs for `for...of` |

`forEach` can't be stopped with `break` and does not wait for `async` callbacks;
see [Promises and async/await](./promises.mdx). How `for...of` works is covered
in [Iterators and Generators](./iterators-generators.md).

### Creating

| Way                           | What it does                                |
| ----------------------------- | ------------------------------------------- |
| `[1, 2, 3]`                   | array literal                               |
| `[...iterable]`               | shallow copy of an array or any iterable    |
| `Array.from(iterable, mapFn)` | array from an iterable or array-like object |
| `Array.of(...items)`          | array of the given arguments                |
| `new Array(3)`                | empty array with `length` 3, not `[3]`      |

<details>
<summary>Examples</summary>

```javascript
const birds = ['sparrow', 'crow'];
const animals = ['cow', ...birds]; // ['cow', 'sparrow', 'crow']

Array.from('abc'); // ['a', 'b', 'c']
Array.from({ length: 3 }, (_, index) => index + 1); // [1, 2, 3]
Array.from(document.querySelectorAll('div')); // array of elements

new Array(3); // [ <3 empty items> ]
```

</details>

## Accessing Elements

- `arr[0]` is the first element, `arr[arr.length - 1]` is the last one.
- `arr.at(-1)` accepts negative indices and counts from the end.
- A missing index gives `undefined`, not an error.
- Destructuring extracts several elements at once.

<details>
<summary>Examples</summary>

```javascript
const array = [1, 2, 3, 4, 5];

array.at(-1); // 5

const [a, b] = array; // a = 1, b = 2
const [c, , d] = array; // c = 1, d = 3
const [e, ...rest] = array; // e = 1, rest = [2, 3, 4, 5]
const [g, h = 'default'] = [1]; // g = 1, h = 'default'

// Swapping two variables
let x = 1;
let y = 2;
[x, y] = [y, x]; // x = 2, y = 1
```

</details>

## Follow-up Questions

- How do you copy an array? `[...arr]` or `arr.slice()` for a shallow copy,
  `structuredClone(arr)` for a deep one. See [Objects](./objects.md).
- How do you remove duplicates? `[...new Set(arr)]`. See
  [Map, Set, WeakMap and WeakSet](./map-set.md).
- What is the difference between `map` and `forEach`? `map` returns a new array,
  `forEach` returns nothing and is used for side effects.

## Common Mistakes

- Sorting numbers with `sort()` without a comparator.
- Mixing up `slice` and `splice`.
- Expecting `sort` or `reverse` to return a copy: they change the original
  array, which breaks React state.
- Using `map` only for side effects instead of `forEach` or `for...of`.
