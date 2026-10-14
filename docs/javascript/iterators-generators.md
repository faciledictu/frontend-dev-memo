---
sidebar_position: 10
description:
  The iteration protocols, generator functions, iterator helpers and async
  iteration
---

# Iterators and Generators

- An **iterator** is an object with a `next()` method that returns
  `{ value, done }`. Each call gives the next value until `done` is `true`.
- An **iterable** is an object with a `[Symbol.iterator]()` method that returns
  an iterator. Arrays, strings, `Map`, `Set`, `arguments` and DOM collections
  are iterable; plain objects are not.
- A **generator** is a function declared with `function*`. Calling it does not
  run the body: it returns a **generator object**, which is both an iterator and
  an iterable. Each `next()` runs the body up to the next `yield` and pauses
  there.

`for...of`, spread, destructuring, `Array.from`, `new Map()`, `new Set()` and
`Promise.all` all accept any iterable.

## Details

### The Protocols

```javascript
const iterator = [10, 20][Symbol.iterator]();

iterator.next(); // { value: 10, done: false }
iterator.next(); // { value: 20, done: false }
iterator.next(); // { value: undefined, done: true }
```

- An iterator is **one pass**: once it is done, it stays done. An iterable can
  usually create a new iterator each time.
- Iteration is **lazy**: values are produced only when asked for. That makes
  infinite sequences possible.
- An iterator may have a **`return()`** method. `for...of` calls it when the
  loop stops early (`break`, `return`, `throw`), so the source can clean up.

### Generators

| Syntax               | What it does                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `function* gen() {}` | declares a generator function; also `*method() {}` in a class    |
| `yield value`        | pauses and gives `value` to the caller                           |
| `yield* iterable`    | yields every value of another iterable or generator              |
| `return value`       | finishes: `{ value, done: true }`; `for...of` ignores this value |
| `gen.next(x)`        | resumes; `x` becomes the result of the paused `yield` expression |
| `gen.return(x)`      | finishes the generator; `finally` blocks still run               |
| `gen.throw(error)`   | throws the error at the paused `yield`                           |

Generators are the shortest way to write an iterator: the state (where to
continue) is kept by the engine instead of being tracked by hand.

### Iterator Helpers (ES2025)

Iterators have their own lazy methods, like the array ones: `map`, `filter`,
`take`, `drop`, `flatMap`, `reduce`, `toArray`, `forEach`, `some`, `every`,
`find`. `Iterator.from(obj)` wraps any iterator or iterable.

- Unlike array methods, they don't create intermediate arrays and work with
  infinite sequences.
- They are methods of iterators, not of iterables: call `map.values().map(…)`,
  not `map.map(…)`.
- Baseline 2025: supported in current browsers and Node.js 22+.

### Async Iteration

- An **async iterator**'s `next()` returns a promise of `{ value, done }`. An
  async iterable has `[Symbol.asyncIterator]()`.
- `for await...of` consumes it, inside an async function or a module. It also
  accepts sync iterables of promises.
- `async function*` combines both: it can `await` and `yield`.
- Typical sources: readable streams (`ReadableStream` in browsers, Node.js
  streams), paginated APIs, events.
- `Array.fromAsync(asyncIterable)` collects everything into an array (ES2026,
  Baseline 2024).

## Example

<details>
<summary>Examples</summary>

A custom iterable written by hand and with a generator:

```javascript
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () =>
        current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true },
    };
  },
};

[...range]; // [1, 2, 3]

const range2 = {
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};

[...range2]; // [1, 2, 3]
```

An infinite sequence with iterator helpers:

```javascript
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

naturals()
  .filter((n) => n % 2 === 0)
  .map((n) => n * n)
  .take(3)
  .toArray(); // [4, 16, 36]
```

`next(x)` and cleanup:

```javascript
function* dialog() {
  try {
    const name = yield 'What is your name?';
    yield `Hello, ${name}!`;
  } finally {
    console.log('closed');
  }
}

const talk = dialog();
talk.next().value; // 'What is your name?'
talk.next('Ann').value; // 'Hello, Ann!'
talk.return(); // logs 'closed'
```

Paginated API as an async generator:

```javascript
async function* fetchPages(url) {
  while (url) {
    const response = await fetch(url);
    const { items, next } = await response.json();
    yield items;
    url = next;
  }
}

for await (const items of fetchPages('/api/users?page=1')) {
  render(items);
}
```

</details>

## Follow-up Questions

- How do you make a plain object iterable? Add `[Symbol.iterator]`, or iterate
  over `Object.entries(obj)`.
- What happens to a generator when `for...of` breaks? The loop calls `return()`,
  the generator finishes and its `finally` blocks run.
- Why are generators described as "pausable functions"? The function's execution
  context is saved at `yield` and restored on `next()`. Before `async/await`,
  libraries such as `co` and `redux-saga` built async flows on top of this.
- Can you iterate over an iterator twice? No, it is exhausted. Get a new one
  from the iterable.

## Common Mistakes

- Expecting a call to a generator function to run its body. Nothing runs until
  the first `next()`.
- "`for...in` iterates values." It iterates **property names** of objects; use
  `for...of` for values of iterables.
- Spreading an infinite generator: `[...naturals()]` never finishes.
- Reusing an exhausted iterator, for example a generator object stored in a
  variable and passed to two loops: the second loop sees nothing.
- Calling iterator helpers on an iterable: `new Set([1]).map` is `undefined`;
  use `set.values().map(…)`.

## See Also

- [Arrays](./arrays.md)
- [Map, Set, WeakMap and WeakSet](./map-set.md)
- [Promises and async/await](./promises.mdx)
