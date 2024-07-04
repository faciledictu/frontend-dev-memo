---
sidebar_position: 6
---

# Functional Programming

Functional programming is a programming paradigm that treats computation as the
evaluation of mathematical functions and avoids changing state and mutable data.

Functional programming favors a declarative programming style where programs.

## Pure Functions

A pure function is a function that:

- Deterministic, i. e. given the same input, always returns the same output.
- Has no side effects (does not modify any external state).

## First-Class Functions

Functions are treated as first-class citizens, meaning they can be passed as
arguments to other functions, returned as values from other functions, and
assigned to variables. This allows functions to be used flexibly and composed
together.

## Immutability

In FP, data structures are immutable by the nature of the paradigm. Instead of
changing an existing data structure, new data structures are created with the
necessary changes.

## Functors

A functor is a data structure that can be mapped over. It implements a `map`
method that applies a function to each value inside the functor, returning a new
functor with the transformed values.

In JavaScript, arrays are the most common example of functors.

```javascript
const array = [1, 2, 3];
const newArray = array.map((x) => x * 2);
console.log(newArray); // Output: [2, 4, 6]
```

## Currying

Currying is the process of transforming a function that takes multiple arguments
into a series of functions that each take a single argument.

```javascript
function volume(length) {
  return function (width) {
    return function (height) {
      return length * width * height;
    };
  };
}

// Example usage:
const length2 = volume(2); // Partially apply length
const length2Width3 = length2(3); // Partially apply width
console.log(length2Width3(4)); // Output: 24

// You can also use it in a single step:
console.log(volume(2)(3)(4)); // Output: 24
```

## Composition

Function composition is the process of combining two or more functions to
produce a new function. The output of one function becomes the input to the
next.

```javascript
const compose = (f, g) => (x) => f(g(x));

const add1 = (x) => x + 1;
const double = (x) => x * 2;

const add1ThenDouble = compose(double, add1);
console.log(add1ThenDouble(3)); // Output: 8
```

:::tip

An alternative method to function composition is using a `pipe` function, which
applies functions from left to right (as opposed to the right-to-left
application of compose).

```javascript
const compose =
  (...functions) =>
  (input) =>
    functions.reduceRight((acc, fn) => fn(acc), input);

const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input);

const plus2 = (num) => num + 2;
const double = (num) => num * 2;

const doubleAndPlus2 = pipe(double, plus2);

const plus2AndDouble = compose(double, plus2);

console.log(doubleAndPlus2(3), plus2AndDouble(3)); // Output: 8, 10
```

:::

## Monads

Monads allow for chaining operations while maintaining a functional style,
making it easier to manage side effects, such as handling null values,
asynchronous computations, state, etc.

- A monad has functor-like structure: it implements the `map` function, which
  applies a function to the wrapped value inside the monad.

- The `unit` (sometimes called `return` or `of`) function takes a value and
  wraps it in a monad. It serves as a way to lift a value into the monadic
  context. flatMap (or bind) Function:

- The `flatMap` (sometimes called `bind` or `chain`) function applies a function
  that returns a monad to a monad, and then flattens the result. It enables
  chaining of monadic operations without nesting.

### Monad Laws

- **Left Identity** `unit(a).flatMap(f)`is equivalent to`f(a)`
- **Right Identity** `m.flatMap(unit)` is equivalent to `m`
- **Associativity** `m.flatMap(f).flatMap(g)` is equivalent to
  `m.flatMap(x => f(x).flatMap(g))`

### Example: 'Maybe' Monad

The Maybe monad is a common example, which handles computations that might fail
(i.e., might return `null` or `undefined`).

The Maybe monad has two possible states:

- `Just`, or `Some` represents a value.
- `Nothing`, or `None` represents the absence of a value.

```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  // Wraps a value in a Maybe monad
  static of(value) {
    return new Maybe(value);
  }

  // Applies a function to the value inside the Maybe, if it exists
  map(fn) {
    if (this.isNothing()) {
      return this; // If the value is null or undefined, return the same instance
    }
    return Maybe.of(fn(this.value));
  }

  // Applies a function that returns a Maybe, and flattens the result
  flatMap(fn) {
    return this.isNothing() ? this : fn(this.value);
  }

  // Checks if the value is null or undefined
  isNothing() {
    return this.value === null || this.value === undefined;
  }
}

// Basic example usage
const safeDivide = (num, denom) =>
  denom === 0 ? Maybe.of(null) : Maybe.of(num / denom);

const result = Maybe.of(10)
  .flatMap((value) => safeDivide(value, 2)) // Maybe.of(5)
  .flatMap((value) => safeDivide(value, 0)) // Maybe.of(null) because division by zero
  .flatMap((value) => Maybe.of(value + 1)); // Still Maybe.of(null)

console.log(result); // Output: Maybe { value: null }

// Antoher example
const getUser = (id) =>
  (id = 1
    ? Maybe.of({ id, name: 'John Doe', address: '123 Main St' })
    : Maybe.of(null));

const getAddress = (user) =>
  'address' in user ? Maybe.of(user.address) : Maybe.of(null);

const userAddress = Maybe.of(1).flatMap(getUser).flatMap(getAddress);
console.log(userAddress); // Output: Maybe { value: '123 Main St' }

const missingUserAddress = Maybe.of(2).flatMap(getUser).flatMap(getAddress);
console.log(missingUserAddress); // Output: Maybe { value: null }
```
