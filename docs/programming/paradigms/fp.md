---
sidebar_position: 2
description:
  Pure functions, side effects, referential transparency, immutability,
  higher-order functions, closures, currying vs partial application,
  composition, functors and monads
---

# Functional Programming

Functional programming (FP) is a way of writing programs out of **pure
functions**: functions that, like a formula in math, always give the same answer
for the same input and do nothing besides returning it. Data is not changed in
place — a changed copy is created instead (**immutability**). Functions are
values like numbers or strings, so they can be passed to other functions and
combined. In JavaScript FP is a style rather than a language feature: `map` /
`filter`, React components and Redux reducers are written this way.

## Details

### In Plain Words

**A pure function** is like `add(2, 3)` in math: the answer is always `5`, and
computing it changes nothing in the world. "What time is it?" or "add this to my
cart" are not pure: the answer depends on when you ask, or the action changes
something.

```javascript
const add = (a, b) => a + b; // pure: depends only on a and b

let count = 0;
const increment = () => ++count; // impure: changes count outside

console.log(add(2, 3), add(2, 3)); // 5 5
console.log(increment(), increment()); // 1 2 — the same call, different answers
```

Because `add(2, 3)` is always `5`, the call can be replaced with `5` anywhere in
the program — this is **referential transparency**. `increment()` cannot be
replaced with `1`: the second call returns `2`.

**Immutability**: instead of changing an object, make a new one with the change.
The old value stays as it was, so nobody holding it is surprised.

```javascript
const user = { name: 'Alice', city: 'Paris' };
const moved = { ...user, city: 'Rome' }; // a new object

console.log(user.city, moved.city); // Paris Rome
```

**Functions as values**: a function can be passed to another function, like an
instruction: "here is a list, and here is what to do with each element".

```javascript
const prices = [10, 20, 30];
const withTax = prices.map((price) => price * 1.2);

console.log(withTax); // [ 12, 24, 36 ]
```

### Definitions

| Term                     | Strict meaning                                                                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pure function            | (1) **Deterministic**: the same arguments always give the same result; (2) **no side effects**: the call does nothing observable besides returning the result                                      |
| Side effect              | Any observable interaction besides returning a value: changing a variable or object outside the function (including the arguments), I/O (network, DOM, storage, logging), throwing an exception    |
| Referential transparency | An expression can be replaced with its value without changing the program's behavior. A call of a pure function is referentially transparent                                                       |
| Immutability             | A value is never changed after it is created; an "update" creates a new value                                                                                                                      |
| First-class functions    | Functions are values: assigned to variables, passed as arguments, returned from functions, stored in data structures                                                                               |
| Higher-order function    | A function that takes a function as an argument or returns one: `map`, `filter`, `reduce`, `debounce`, a React HOC (higher-order component)                                                        |
| Closure                  | A function together with references to the variables of the scope where it was created; it can read and update them after that scope has finished. Curried functions in JS are built with closures |
| Declarative style        | Code describes **what** the result is (`filter`, then `map`), not the steps to compute it                                                                                                          |

What breaks determinism: reading anything that can change between calls — a
mutable outer variable, the time (`Date.now()`), randomness (`Math.random()`),
input from I/O. Reading a constant (`Math.PI`, a deeply frozen config) does not.

### Pure Functions and Closures

"Depends only on its arguments" cannot be taken literally: almost every function
uses names it did not receive as arguments — `Math.sqrt`, an imported helper, a
constant from the same module. In JavaScript every function keeps a reference to
the scope where it was created (that is what a closure is), and it reaches these
names through it. So closures do not make a function impure; what matters is
whether **what it refers to can change**:

```javascript
// Pure: uses Math.sqrt, which it did not receive, but which does not change
const hypotenuse = (a, b) => Math.sqrt(a * a + b * b);

// Pure: x is captured in a closure, but never changes
const makeAdder = (x) => (y) => x + y;
const add5 = makeAdder(5);

// Impure: the captured variable is reassigned
let rate = 1.2;
const withTax = (price) => price * rate;

console.log(hypotenuse(3, 4), add5(2), add5(2)); // 5 7 7
console.log(withTax(10)); // 12
rate = 1.5;
console.log(withTax(10)); // 15 — the same argument, a different result
```

- Captured with `const` is not enough for objects: if a captured object is
  mutated somewhere, a function that reads it is impure.
- Strictly speaking, even `Math.sqrt` can be reassigned in JavaScript, and then
  `hypotenuse` changes behavior. Purity is therefore a promise about the
  environment: built-ins, imports and module constants are **assumed** not to
  change. In Haskell this is guaranteed (nothing can be reassigned); in
  JavaScript it is a convention.

### Why It Matters

Pure functions are:

- **predictable and easy to test**: the result is determined by the arguments,
  so a test needs no setup or mocks;
- **safe to cache** (memoization): the same arguments always give the same
  result — this is what `useMemo`, `React.memo` and `reselect` rely on;
- **safe to call again or in a different order**: React may render a component
  more than once (Strict Mode, concurrent rendering) and expects the same
  result.

Immutable data adds **cheap change detection**: if a new object was created, it
changed; if the reference is the same, it did not. React and Redux compare state
by reference (`Object.is` / `===`) for this reason.

### Functional Core, Imperative Shell

A program cannot be fully pure: it has to show something on the screen and talk
to a server. The usual structure (named "functional core, imperative shell" by
Gary Bernhardt) keeps the logic pure and the effects in a thin outer layer:

| Pure core                                   | Effects at the edges                     |
| ------------------------------------------- | ---------------------------------------- |
| Reducers, selectors, formatting, validation | `fetch`, `localStorage`, timers, logging |
| The render of a React component             | `useEffect`, event handlers              |
| Pure derived data in `useMemo`              | Thunks, sagas, listener middleware       |

### Immutability in JavaScript

- `const` forbids **reassigning the variable**, not changing the object it
  points to.
- `Object.freeze` forbids changes, but only at the top level (shallow).
- In practice immutability is a **convention**: updates copy the changed level
  (`{ ...obj }`, `[...arr]`) or use the copying array methods `toSorted`,
  `toReversed`, `toSpliced`, `with`; Immer lets you write "mutating" code that
  produces a new object.
- A copy shares unchanged parts with the original (**structural sharing**):
  `{ ...state, user }` copies one level, not the whole tree.

### Recursion Instead of Loops

Purely functional languages have no mutable loop counters: repetition is
expressed with **recursion** or with higher-order functions (`map`, `reduce`).
Each recursive call takes a frame on the call stack, so the depth is limited. A
**tail call** is a call that is the very last action of a function
(`return f(x)`); with **proper tail calls** the engine reuses the frame, and the
depth is unlimited. The ECMAScript spec requires them in strict mode, but only
Safari implements them, so deep recursion in Chrome, Node.js and Firefox
overflows the stack (`RangeError: Maximum call stack size exceeded` in V8,
`InternalError: too much recursion` in Firefox). Use `reduce` or a loop for long
sequences.

### Currying vs Partial Application

- **Currying** transforms a function of _n_ arguments into a chain of _n_
  functions of **one** argument each: `f(a, b, c)` → `f(a)(b)(c)`. Named after
  the logician Haskell Curry (the idea goes back to Moses Schönfinkel).
- Library `curry` helpers (Lodash, Ramda) are looser: they accept several
  arguments at a time, `f(a, b)(c)`, until all are collected.
- **Partial application** fixes **some** arguments and returns a function of the
  remaining ones: `add.bind(null, 5)`.
- Calling a curried function with its first argument is a partial application,
  but partial application does not require currying.

### Composition

Composition combines functions so that the output of one is the input of the
next: `compose(f, g)(x)` is `f(g(x))` — applied **right to left**, as in math;
`pipe(f, g)(x)` is `g(f(x))` — **left to right**, in reading order. This is
**function composition**; "composition over inheritance" in OOP means combining
objects, a related but different idea.

### Where FP Comes From

- **Lambda calculus** (Alonzo Church, 1930s): a mathematical model of
  computation built only from functions.
- Languages: Lisp (1958), ML, Erlang, **Haskell** (purely functional: effects
  are tracked in types), Elm, Clojure, F#.
- JavaScript took first-class functions and closures from Scheme (a Lisp), but
  variables and objects are mutable, so purity is up to the programmer.

### Going Deeper: Functors and Monads

Rarely asked in frontend interviews beyond "what is it?", but the patterns
appear in everyday code (`Array`, `Promise`, optional values).

- A **functor** is, intuitively, a container with a `map` that applies a
  function to the value(s) inside and returns a container of the same kind.
  Strictly, it is any type with a `map` that obeys two laws, so it need not be a
  container: a function can be mapped by composition,
  `map(g, f) = (x) => g(f(x))`. Laws: `x.map((a) => a)` ≡ `x` (identity) and
  `x.map(f).map(g)` ≡ `x.map((a) => g(f(a)))` (composition). `Array` is a
  functor.
- A **monad** is a functor with two more operations: `of` puts a plain value
  into the container, and `flatMap` (also `chain`, `bind`) applies a function
  that itself **returns a container**, without nesting the result
  (`Maybe<Maybe<T>>` → `Maybe<T>`). This chains steps that may produce no value,
  fail or complete later.
- Monad laws, for functions of one argument: `of(a).flatMap(f)` ≡ `f(a)` (left
  identity), `m.flatMap((x) => of(x))` ≡ `m` (right identity),
  `m.flatMap(f).flatMap(g)` ≡ `m.flatMap((x) => f(x).flatMap(g))`
  (associativity).
- `Array` with `Array.of` and `flatMap` behaves as a monad when the callbacks
  take one argument and return arrays. Note that JS passes
  `(value, index, array)`: `[1, 2].flatMap(Array.of)` gives
  `[1, 0, [1, 2], 2, 1, [1, 2]]`. `Promise.then` acts as both `map` and
  `flatMap`, and a promise of a promise cannot exist (it is always flattened),
  so `Promise` is monad-like but breaks the laws when a value is itself a
  promise or a thenable.

## Example

```javascript
// Currying: one argument at a time, thanks to closures
const volume = (length) => (width) => (height) => length * width * height;
const volumeOf2x3 = volume(2)(3); // remembers length and width, waits for height
console.log(volumeOf2x3(4), volume(2)(3)(4)); // 24 24

// A generic curry: collects arguments until fn.length of them are passed
const curry =
  (fn) =>
  (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...more) => curry(fn)(...args, ...more);
const curriedVolume = curry((l, w, h) => l * w * h);
console.log(curriedVolume(2)(3)(4), curriedVolume(2, 3)(4)); // 24 24

// Partial application: fix some arguments of a regular function
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
"nothing" is skipped, so there are no `null` checks between steps. Optional
chaining (`user?.address?.city`) solves the same problem for property access.
This simplified `Maybe` treats `of(null)` as "nothing", so it breaks the laws
when a function returns or handles `null`; full implementations have separate
`Just` and `Nothing` types.

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
- Is a function that reads `Date.now()` pure? No: the result changes between
  calls with the same arguments. Pass the time in as an argument to make it pure
  and testable.
- Is `array.sort()` functional? No: it sorts in place and mutates the array;
  `toSorted()` returns a new one.
- Why does React care about purity? Components and reducers may run more than
  once (Strict Mode, concurrent rendering); a pure render gives the same result
  each time.
- How to update nested state immutably? Copy each level on the path:
  `{ ...state, user: { ...state.user, name } }`, or use Immer.
- Pure vs idempotent? Idempotent means that repeating an operation has the same
  effect as doing it once: a second `DELETE /users/1` leaves the server in the
  same state (even if it answers 404); in math, `Math.abs(Math.abs(x))` is
  `Math.abs(x)`. An idempotent operation can still have side effects; a pure
  function has none.
- How to write a memoize helper? Cache results by argument: it is only correct
  for pure functions.

  ```javascript
  const memoize = (fn) => {
    const cache = new Map();
    return (n) => {
      if (!cache.has(n)) cache.set(n, fn(n));
      return cache.get(n);
    };
  };
  const square = memoize((n) => n * n);
  console.log(square(4), square(4)); // 16 16 — computed once
  ```

## Common Mistakes

- Defining a pure function only as "no side effects": it must also be
  deterministic.
- Mixing up currying and partial application.
- Thinking `const` or `Object.freeze` makes nested data immutable.
- Calling `forEach` that pushes into an outer array "functional".
- Saying that FP means "no state": state exists, but it is passed and returned
  explicitly instead of being changed in place.

## See Also

- [Programming Paradigms](./overview.md)
- [Closures](../../javascript/closures.md)
- [Mostly Adequate Guide to Functional Programming](https://github.com/MostlyAdequate/mostly-adequate-guide)
  — a free book on FP in JavaScript, from pure functions to monads.
