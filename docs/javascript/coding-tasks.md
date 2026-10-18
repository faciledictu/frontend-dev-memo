---
sidebar_position: 21
description:
  An index of live-coding tasks - bind, call/apply, Promise.all, debounce, deep
  copy, memoize, flat, event emitter, LRU cache - and where each is solved
tags: [middle]
---

# Common Coding Tasks

At a live-coding round you are asked to **re-implement a built-in or a small
utility**: `bind`, `Promise.all`, `debounce`, a deep copy, an event emitter, an
LRU cache. The task checks **closures**, **`this`**, **promises** and attention
to **edge cases**, not memorized code. Clarify the contract first (arguments,
`this`, errors, return value), write the simple version, then name the edge
cases and the complexity. This page is an index: each row links to the page that
explains the topic and shows the solution.

## Details

### Functions and `this`

| Task                    | What it checks                                               | Solution                                                                                 |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `bind`                  | Closures, `this`, fixed arguments, `new` on a bound function | [bind, call and apply](./bind-call-apply.md), follow-up questions                        |
| `call` / `apply`        | How `this` is set by a method call                           | [Below](#call-and-apply)                                                                 |
| `debounce` / `throttle` | Timers, closures, passing `this` and arguments through       | [Debounce and Throttle](./debounce-throttle.md)                                          |
| `memoize`               | A cache in a closure, the cache key, pure functions          | [Functional Programming](../programming/paradigms/fp.md), follow-up questions            |
| `once`                  | State in a closure, keeping the first result                 | [Below](#once)                                                                           |
| `curry`, `compose`      | Closures, `fn.length`, the order of application              | [Functional Programming](../programming/paradigms/fp.md#currying-vs-partial-application) |
| A retry wrapper         | Higher-order functions, `async` / `await` in a loop          | [Design Patterns](../programming/patterns.md), the Decorator example                     |

### Promises

| Task                      | What it checks                                              | Solution                                                  |
| ------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| `Promise.all`             | Result order, fail-fast, an empty input, non-promise values | [Promises](./promises.mdx), follow-up questions           |
| `allSettled` / `race`     | The difference between the combinators                      | [Below](#allsettled-and-race)                             |
| A request with a timeout  | `AbortController`, `AbortSignal.timeout`, `Promise.race`    | [Promises](./promises.mdx), "More examples"               |
| Promisify a callback API  | `new Promise`, `resolve` / `reject` in the callback         | [Promises](./promises.mdx), follow-up questions           |
| At most N tasks at a time | A queue of tasks, workers, keeping the result order         | [Below](#concurrency-limit)                               |
| "What does this print?"   | Microtasks vs tasks, the synchronous executor               | [Event Loop](./event-loop.md), [Promises](./promises.mdx) |

### Objects and Arrays

| Task                        | What it checks                                                       | Solution                                                                       |
| --------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Deep copy                   | Recursion, cycles, `Date` / `Map` / `Set`; knowing `structuredClone` | [Objects](./objects.md#cloning) for the built-ins, [below](#deep-copy) by hand |
| Deep equal                  | Recursion, `Object.is`, keys and prototypes                          | [Below](#deep-equal)                                                           |
| `flat`                      | Recursion with depth                                                 | [Arrays](./arrays.md#transforming) for the built-in, [below](#flat) by hand    |
| `var` in a loop with timers | Closures and block scope                                             | [Closures](./closures.md), follow-up questions                                 |
| `this` in a callback        | The rules of `this`                                                  | [The `this` Keyword](./this-keyword.md)                                        |

### Data Structures and Algorithms

| Task                                           | What it checks                                             | Solution                                                                           |
| ---------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Event emitter (`on` / `off` / `once` / `emit`) | A `Map` of listener sets, unsubscribe, emit while changing | [Below](#event-emitter); Observer in [Design Patterns](../programming/patterns.md) |
| LRU cache                                      | O(1) `get` and `set`, the insertion order of `Map`         | [Below](#lru-cache)                                                                |
| Binary search, duplicates, BFS, Fibonacci      | Big O, choosing a structure, memoization                   | [Algorithms and Data Structures](../programming/data-structures.md)                |

### React

| Task                       | What it checks                                     | Solution                                                                                |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Search input with debounce | A stable debounced function, cleanup on unmount    | [Debounce and Throttle](./debounce-throttle.md), "In React"                             |
| Fetching in an effect      | Race conditions, cleanup, loading and error states | [Side Effects](../react/hooks/side-effects.md)                                          |
| Tabs, accordion            | Compound components, context                       | [Composition Patterns](../react/basics/patterns.md)                                     |
| A list with add / remove   | `key`, immutable updates                           | [Lists and `key`](../react/basics/lists-and-keys.md), [State](../react/basics/state.md) |

## Example

The tasks that are not solved on other pages. Each solution has been run in
Node.js.

### `call` and `apply`

<details>
<summary>Solution</summary>

```javascript
Function.prototype.myCall = function (thisArg, ...args) {
  // null / undefined → globalThis, primitives → wrapper objects (non-strict)
  const context = thisArg == null ? globalThis : Object(thisArg);
  const key = Symbol('fn'); // a unique key does not overwrite own properties
  context[key] = this;
  try {
    // highlight-next-line
    return context[key](...args); // a method call: `this` is `context`
  } finally {
    delete context[key];
  }
};

Function.prototype.myApply = function (thisArg, args = []) {
  return this.myCall(thisArg, ...args);
};

function greet(greeting, mark) {
  return `${greeting}, ${this.name}${mark}`;
}
console.log(greet.myCall({ name: 'Ada' }, 'Hi', '!')); // Hi, Ada!
console.log(greet.myApply({ name: 'Bob' }, ['Hello', '?'])); // Hello, Bob?
```

</details>

### `once`

<details>
<summary>Solution</summary>

```javascript
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      // highlight-next-line
      result = fn.apply(this, args);
    }
    return result;
  };
}

const init = once(() => {
  console.log('init');
  return 42;
});
console.log(init(), init()); // init, then 42 42
```

</details>

### `allSettled` and `race`

<details>
<summary>Solution</summary>

```javascript
function promiseAllSettled(iterable) {
  return Promise.all(
    [...iterable].map(
      (item) =>
        // highlight-start
        Promise.resolve(item).then(
          (value) => ({ status: 'fulfilled', value }),
          (reason) => ({ status: 'rejected', reason })
        )
      // highlight-end
    )
  );
}

function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      // the first to settle wins; later calls to resolve / reject are ignored
      Promise.resolve(item).then(resolve, reject);
    }
  });
}

const fail = Promise.reject(new Error('fail'));
console.log(await promiseAllSettled([1, fail]));
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: Error: fail }]

const wait = (ms, value) =>
  new Promise((resolve) => setTimeout(resolve, ms, value));
console.log(await promiseRace([wait(100, 'slow'), wait(10, 'fast')])); // fast
```

</details>

### Concurrency Limit

Run async tasks with at most `limit` of them in progress; the results keep the
order of the tasks.

<details>
<summary>Solution</summary>

```javascript
async function runWithLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      // highlight-next-line
      const index = next++; // synchronous, so two workers never take one task
      results[index] = await tasks[index]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers); // rejects on the first failed task
  return results;
}

const wait = (ms, value) =>
  new Promise((resolve) => setTimeout(resolve, ms, value));
const tasks = [300, 100, 200, 100].map((ms, i) => () => wait(ms, i));

console.log(await runWithLimit(tasks, 2)); // [0, 1, 2, 3] in ~400 ms, not 700
```

</details>

### Deep Copy

In real code, `structuredClone`. By hand:

<details>
<summary>Solution</summary>

```javascript
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value; // primitives, functions
  // highlight-next-line
  if (seen.has(value)) return seen.get(value); // a cycle: reuse the copy
  if (value instanceof Date) return new Date(value);
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(deepClone(k, seen), deepClone(v, seen)));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach((v) => copy.add(deepClone(v, seen)));
    return copy;
  }

  const copy = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    copy[key] = deepClone(value[key], seen);
  }
  return copy;
}

const original = { date: new Date(0), tags: new Set(['a']), nested: { n: 1 } };
original.self = original;
const copy = deepClone(original);
console.log(copy.nested !== original.nested, copy.self === copy); // true true
console.log(copy.date instanceof Date, copy.tags.has('a')); // true true
```

</details>

### Deep Equal

<details>
<summary>Solution</summary>

```javascript
function deepEqual(a, b) {
  if (Object.is(a, b)) return true; // primitives, the same reference, NaN
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  // highlight-next-line
  return keys.every(
    (key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key])
  );
}

console.log(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })); // true
console.log(deepEqual({ a: 1 }, { a: 1, b: undefined })); // false
console.log(deepEqual([1, 2], { 0: 1, 1: 2 })); // false: different prototypes
console.log(deepEqual(NaN, NaN), deepEqual(null, {})); // true false
// Not handled: Date, Map, Set (no own keys, so any two are "equal") and cycles
```

</details>

### `flat`

<details>
<summary>Solution</summary>

```javascript
function flat(array, depth = 1) {
  const result = [];
  for (const item of array) {
    if (Array.isArray(item) && depth > 0) {
      // highlight-next-line
      result.push(...flat(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

console.log(flat([1, [2, [3, [4]]]])); // [1, 2, [3, [4]]]
console.log(flat([1, [2, [3, [4]]]], Infinity)); // [1, 2, 3, 4]
```

</details>

### Event Emitter

<details>
<summary>Solution</summary>

```javascript
class EventEmitter {
  #listeners = new Map(); // event name → Set of listeners

  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(listener);
    return () => this.off(event, listener); // unsubscribe
  }

  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
  }

  once(event, listener) {
    const off = this.on(event, (...args) => {
      off();
      listener(...args);
    });
    return off;
  }

  emit(event, ...args) {
    // a copy: listeners added or removed during emit don't affect this call
    // highlight-next-line
    for (const listener of [...(this.#listeners.get(event) ?? [])]) {
      listener(...args);
    }
  }
}

const emitter = new EventEmitter();
const unsubscribe = emitter.on('message', (text) => console.log('on:', text));
emitter.once('message', (text) => console.log('once:', text));
emitter.emit('message', 'hi'); // on: hi, once: hi
unsubscribe();
emitter.emit('message', 'again'); // nothing
```

</details>

### LRU Cache

A cache of fixed size that evicts the **least recently used** entry. A `Map`
iterates keys in insertion order, so deleting and re-inserting a key moves it to
the end, and the first key is the oldest.

<details>
<summary>Solution</summary>

```javascript
class LRUCache {
  #capacity;
  #map = new Map(); // the first key is the least recently used

  constructor(capacity) {
    this.#capacity = capacity;
  }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key); // move to the end: now the most recent
    this.#map.set(key, value);
    return value;
  }

  set(key, value) {
    this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#capacity) {
      // highlight-next-line
      this.#map.delete(this.#map.keys().next().value); // evict the oldest
    }
  }
}

const cache = new LRUCache(2);
cache.set('a', 1);
cache.set('b', 2);
cache.get('a'); // 'a' is now the most recent
cache.set('c', 3); // evicts 'b'
console.log(cache.get('b'), cache.get('a'), cache.get('c')); // undefined 1 3
```

</details>

## Follow-up Questions

- How would you test it? Name the cases out loud: an empty input, one item, an
  error, `this` and arguments passed through, the order of async results; for
  timers, fake timers (`vi.useFakeTimers()`).
- Why a `Symbol` in `myCall`? A unique key cannot overwrite a property the
  object already has; a string key like `fn` could.
- What is the complexity of the LRU cache? O(1) for `get` and `set`: `Map`
  lookup, delete and insert are O(1) on average. Without `Map` ordering, the
  classic answer is a hash map plus a doubly linked list.
- How does `structuredClone` differ from a hand-written copy? It handles cycles,
  `Date`, `Map`, `Set`, typed arrays and more, but throws on functions and DOM
  nodes and drops the prototype of class instances.
- What should `memoize` use as a key for several arguments? A serialized key
  (`JSON.stringify(args)`) for primitives, or nested `Map` / `WeakMap` per
  argument for objects; and an unbounded cache leaks memory, which is where an
  LRU limit comes in.
- How do you cancel the tasks of `runWithLimit` after a failure? Pass an
  `AbortSignal` to each task and stop the workers when it is aborted; by itself
  `Promise.all` only stops waiting.

## Common Mistakes

- Losing `this` and arguments in a wrapper: an arrow function as the returned
  function, or `fn()` instead of `fn.apply(this, args)`.
- A `Promise.all` that never settles for an empty array, or that pushes results
  in completion order instead of input order.
- `JSON.parse(JSON.stringify(obj))` as a deep copy without naming what it loses:
  `Date`, `undefined`, `Map`, `Set`, cycles.
- Recursion without tracking visited objects: a cyclic object overflows the
  stack.
- Mutating the input array or object in a utility that should return a new one.
- Writing code silently: the interviewer checks the reasoning as much as the
  result.

## See Also

- [Closures](./closures.md)
- [Promises and async/await](./promises.mdx)
- [Algorithms and Data Structures](../programming/data-structures.md)
