---
sidebar_position: 2
description:
  Pure functions, immutability, higher-order functions, currying vs partial
  application, composition, functors and monads
---

# Functional Programming

Functional programming (FP) builds programs from **pure functions**: the result
depends only on the arguments, and nothing outside is read or changed. Data is
**immutable**: instead of modifying a value, a new one is created. Functions are
**first-class** values, so they are passed around and combined: **higher-order
functions** (`map`, `filter`, `reduce`), **currying**, **composition**. Side
effects (network, DOM, storage) are pushed to the edges of the program.
JavaScript is not a pure functional language, but React, Redux and array methods
are built on these ideas.

## Details

### Core Ideas

| Concept                  | Means                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Pure function            | Same input → same output; no side effects (no mutation, I/O, `Date.now()`, `Math.random()`) |
| Side effect              | Anything observable besides the return value: changing outer variables, network, DOM, logs  |
| Immutability             | Values are not changed after creation; updates create copies (`{ ...obj }`, `toSorted`)     |
| First-class functions    | Functions are values: stored in variables, passed, returned                                 |
| Higher-order function    | Takes or returns a function: `map`, `filter`, `debounce`, HOCs                              |
| Referential transparency | A call can be replaced with its result without changing the program                         |

Immutability in JavaScript is a convention, not a guarantee: `const` only
prevents reassignment, and `Object.freeze` is shallow.

### Currying vs Partial Application

- **Currying** turns `f(a, b, c)` into `f(a)(b)(c)`: a chain of functions of
  **one** argument each.
- **Partial application** fixes **some** arguments and returns a function of the
  rest: `const add5 = add.bind(null, 5)`.
- A curried function is partially applied by calling it with the first argument,
  but partial application does not need currying.

### Composition

`compose(f, g)(x)` is `f(g(x))`: functions are applied **right to left**.
`pipe(f, g)(x)` is `g(f(x))`: **left to right**, in reading order.

### Functors and Monads

- A **functor** is a container with a `map` that applies a function to the value
  inside and returns a new container of the same kind: `Array`.
- A **monad** also has `of` (wrap a value) and `flatMap` (also called `chain`,
  `bind`): apply a function that itself returns a container, without nesting
  containers. This chains steps that may fail, be absent or be asynchronous.
- `Array.prototype.flatMap` behaves like a monad's `flatMap`; `Promise.then`
  behaves like both `map` and `flatMap` because it flattens returned promises
  automatically, so it is not a lawful monad.
- Monad laws: `of(a).flatMap(f)` ≡ `f(a)` (left identity), `m.flatMap(of)` ≡ `m`
  (right identity), `m.flatMap(f).flatMap(g)` ≡
  `m.flatMap((x) => f(x).flatMap(g))` (associativity).

## Example

```javascript
// Currying
const volume = (length) => (width) => (height) => length * width * height;
const baseArea6 = volume(2)(3); // a function that takes height
console.log(baseArea6(4), volume(2)(3)(4)); // 24 24

// Partial application
const multiply = (a, b, c) => a * b * c;
const double = multiply.bind(null, 2, 1);
console.log(double(5)); // 10

// Composition
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

const plus2 = (n) => n + 2;
const times2 = (n) => n * 2;
console.log(pipe(times2, plus2)(3), compose(times2, plus2)(3)); // 8 10
```

<details>
<summary>The Maybe monad</summary>

`Maybe` holds a value or nothing (`null` / `undefined`); every step after
"nothing" is skipped, so there are no `null` checks between steps.

```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return this.isNothing() ? this : fn(this.value);
  }
}

const users = { 1: { name: 'Alice', address: { city: 'Paris' } } };
const findUser = (id) => Maybe.of(users[id]);
const getAddress = (user) => Maybe.of(user.address);

const city = (id) =>
  findUser(id)
    .flatMap(getAddress)
    .map((address) => address.city);

console.log(city(1)); // Maybe { value: 'Paris' }
console.log(city(2)); // Maybe { value: undefined }
```

</details>

## Follow-up Questions

- Is a function that uses `console.log` pure? No: logging is a side effect, even
  though the return value does not change.
- Why does React care about purity? Components and reducers may run more than
  once (Strict Mode, concurrent rendering); a pure render gives the same result
  each time.
- How to update nested state immutably? Copy each level on the path:
  `{ ...state, user: { ...state.user, name } }`, or use Immer.

## Common Mistakes

- Mixing up currying and partial application.
- Thinking `const` makes an object immutable.
- Calling `forEach` with mutation of an outer array "functional".

## See Also

- [Programming Paradigms](./overview.md)
